# Cube27 Talent operations guide

This is the deployment and integration runbook for `talent.cube27.com`. It
covers the Cloudflare Pages project, production and preview configuration,
Turnstile, Resend, WAF rules, verification, monitoring, rotation, and rollback.

The application is an Astro static build plus two Cloudflare Pages Functions:

- `POST /api/employer-lead`
- `POST /api/candidate-application`

The candidate endpoint accepts PDF and DOCX resumes up to 5 MiB. The code
streams and counts the complete request before parsing it and structurally
validates documents. Uploaded documents must still be treated as hostile;
edge/mailbox malware scanning is a production control, not a replacement for
the application checks.

## 1. Accounts, access, and values to decide

Before starting, have:

- Cloudflare access to the `cube27.com` zone and Workers & Pages.
- Resend access with permission to add a sending domain and API key.
- A production recruitment inbox and employer-leads inbox with named owners.
- A separate preview/test inbox. Preview must never send resumes to production.
- A stable preview hostname, recommended: `talent-preview.cube27.com`.
- A decision on malware scanning:
  - preferred: Cloudflare Malicious Uploads Detection (Enterprise paid add-on),
    configured to fail closed;
  - otherwise: a documented mailbox/endpoint security product that quarantines
    and scans PDF/DOCX attachments before staff can open them.

Use least privilege. Cloudflare production access, DNS access, Turnstile secret
access, and the Resend sending key should not all depend on one personal account.

## 2. Verify the repository locally

Use the pinned package manager and do not deploy a lockfile drift:

```powershell
pnpm install --frozen-lockfile
pnpm test
pnpm verify
```

For a local Pages Functions smoke test:

```powershell
Copy-Item .dev.vars.example .dev.vars
# Put a Resend test key and test inboxes in .dev.vars.
pnpm build
pnpm preview
```

`.dev.vars` is git-ignored. The committed example uses Cloudflare's documented
Turnstile test keys and must not be reused in production.

## 3. Configure Resend

This project shares one Resend sending subdomain, `mail.cube27.com`, with the
main Cube27 site. Resend verifies a domain rather than individual addresses, so
a single verified subdomain covers every sender both sites need; subdomains are
separate Resend domains, so do not add a second one while the account is on a
single-domain plan. See §3.1 for what that sharing costs.

1. In Resend, add the sending subdomain `mail.cube27.com`, or confirm the main
   site has already verified it.
2. Add the DNS records Resend displays for domain verification. Wait until the
   domain reports verified before continuing. If the domain is already verified
   for the main site, skip to step 3 and change nothing about its DNS.
3. Create an API key named `cube27-talent-production` with **Sending access**,
   restricted to `mail.cube27.com`. Do not use a full-access account key, and do
   not reuse the main site's key — this project rotates independently.
4. Store the key immediately; Resend only displays it once.
5. Use a monitored From and Reply-To configuration:

   ```text
   RESEND_FROM=Cube27 Talent <talent@mail.cube27.com>
   RESEND_REPLY_TO=talent@cube27.com
   ```

   The `talent@` local part is what separates this project's mail from the main
   site's on the shared subdomain. Keep it distinct from any sender the main
   site uses.

6. Create a separate sending-only API key named `cube27-talent-preview`.
7. Decide and record the two production recipients:

   ```text
   EMPLOYER_LEADS_TO=<production employer-leads inbox>
   CANDIDATE_APPLICATIONS_TO=<production recruitment inbox>
   ```

8. For preview, set both recipient values to the test inbox and use a visibly
   non-production From address such as `talent-preview@mail.cube27.com`.
9. Send one manual Resend test message and confirm SPF/DKIM alignment and inbox
   delivery before testing the application.

### 3.1 Consequences of the shared sending subdomain

Sharing `mail.cube27.com` with the main site is a deliberate cost-driven
compromise, not the target state. Record these in the operations log:

- **Shared reputation.** Bounces and spam complaints from either site's mail
  affect delivery for both. Candidate acknowledgements and internal application
  notifications are transactional and low-volume; if the main site ever sends
  marketing or bulk mail from this subdomain, split the two onto separate
  sending subdomains — for example `mail.` for transactional and `updates.` for
  marketing — before that traffic starts.
- **Shared quota.** Both sites draw on one account's daily and monthly send
  allowance. Each candidate application sends two emails, one internal and one
  acknowledgement, and each employer lead sends two. Confirm the current plan
  limits against Resend's pricing page and check headroom during the monitoring
  review in §11; the internal notification is the critical send and a quota
  refusal fails a submission.
- **Shared blast radius.** A compromise or forced rotation of the domain's DNS
  records affects both sites. Per-project API keys (§3 step 3 and step 6) keep
  key rotation isolated; domain-level changes are not.

Resend references: [domain/sender setup](https://resend.com/docs/knowledge-base/how-do-I-create-an-email-address-or-sender-in-resend),
[API-key permissions](https://resend.com/docs/dashboard/api-keys/introduction), and
[Cloudflare integration](https://resend.com/cloudflare).

## 4. Configure Turnstile

Create separate widgets for production and preview so their traffic, secrets,
and hostnames are isolated. Neither widget requires a deployed site: Turnstile
does not resolve the hostnames you enter, so create both before the first build
and edit the hostname lists later if needed — that changes nothing about the
keys.

The two halves of a widget are handled differently:

- The **site key** is public and ships in the HTML. It belongs in
  `TURNSTILE_SITE_KEYS` in `src/site-config.ts`, committed, one entry per
  environment. `CF_PAGES_BRANCH` selects between them at build time: `main`
  takes `production`, every other branch takes `preview`. Do not add it to the
  Cloudflare dashboard.
- The **secret key** is confidential. It is `TURNSTILE_SECRET_KEY`, a Cloudflare
  secret, set separately for Production and Preview.

Always change a pair together. A site key from one widget with the secret from
another fails every submission.

### Production widget

1. Cloudflare dashboard > **Turnstile** > **Add widget**.
2. Name: `cube27-talent-production`.
3. Hostname: `talent.cube27.com` only.
4. Do not add `localhost`, `127.0.0.1`, or a wildcard/Any Hostname entitlement.
5. Record the site key and secret key.

### Preview widget

1. Name: `cube27-talent-preview`.
2. Hostname: the stable preview hostname, preferably
   `talent-preview.cube27.com`.
3. Record a separate site key and secret key.

The forms already send distinct actions:

- `employer-lead`
- `candidate-application`

Cloudflare tokens expire after five minutes and are single-use. The application
validates every token server-side and resets the widget after a failed attempt.
Review Turnstile Analytics after launch for unexpected hostname or action use.

Turnstile references: [setup](https://developers.cloudflare.com/turnstile/get-started/),
[server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/),
[hostname management](https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/), and
[test keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/).

## 5. Create the Cloudflare Pages project

This must be a **Pages** project, not a Worker. Cloudflare now defaults the
creation flow to Workers, and the two are not interchangeable here: the
endpoints rely on Pages Functions' file-based routing, where
`functions/api/employer-lead.ts` becomes `POST /api/employer-lead` with no
router. A Worker expects one `main` entry script and would 404 both forms. The
symptom of picking the wrong flow is a successful build followed by a deploy
step running `wrangler deploy` and failing with `Missing entry-point to Worker
script`. A Pages project runs no deploy command at all; the absence of that
field is how you confirm you are in the right flow.

Cloudflare also needs repository access on the GitHub **organization** that owns
this repo, not a personal account. Install or configure the Cloudflare GitHub
App for the `Cube-27` org before starting; an org owner must approve it.

1. Cloudflare dashboard > **Workers & Pages** > **Create application** >
   **Pages** > **Import an existing Git repository**.
2. Select this repository and create a new project named `cube27-talent`.
   Do not reuse the main Cube27 website project.
3. Configure:

   | Setting                | Value           |
   | ---------------------- | --------------- |
   | Production branch      | `main`          |
   | Root directory         | repository root |
   | Build command          | `pnpm build`    |
   | Build output directory | `dist`          |

4. Leave framework preset on Astro if Cloudflare detects it. This repository is
   static Astro output; the `functions/` directory is deployed as Pages
   Functions and does not require the Astro Cloudflare SSR adapter.
5. Save without promoting traffic until all variables and rules below exist.

Cloudflare reference: [deploy an Astro site to Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/).

## 6. Configure production and preview variables

In **Workers & Pages > cube27-talent > Settings > Variables and Secrets**, set
the values separately for Production and Preview. Secret values must be added
as secrets, not plaintext variables.

Every value below is a **runtime** binding, read only by Pages Functions. The
build needs nothing from the dashboard — the one build-time value, the Turnstile
site key, is committed in `src/site-config.ts` (§4). Neither environment
inherits from the other; an unset variable is simply absent at runtime.

### Production

| Name                        | Kind     | Production value                         |
| --------------------------- | -------- | ---------------------------------------- |
| `ENVIRONMENT`               | Variable | `production`                             |
| `SITE_URL`                  | Variable | `https://talent.cube27.com`              |
| `ALLOWED_HOSTS`             | Variable | `talent.cube27.com`                      |
| `TURNSTILE_SECRET_KEY`      | Secret   | Production widget secret                 |
| `RESEND_API_KEY`            | Secret   | Production sending-only key              |
| `RESEND_FROM`               | Variable | `Cube27 Talent <talent@mail.cube27.com>` |
| `RESEND_REPLY_TO`           | Variable | Monitored reply address                  |
| `EMPLOYER_LEADS_TO`         | Variable | Production leads inbox                   |
| `CANDIDATE_APPLICATIONS_TO` | Variable | Production recruitment inbox             |

### Preview

| Name                        | Kind     | Preview value                                                                   |
| --------------------------- | -------- | ------------------------------------------------------------------------------- |
| `ENVIRONMENT`               | Variable | `preview`                                                                       |
| `SITE_URL`                  | Variable | `https://talent-preview.cube27.com`                                             |
| `ALLOWED_HOSTS`             | Variable | Stable preview hostname and explicitly approved Pages hostname, comma-separated |
| `TURNSTILE_SECRET_KEY`      | Secret   | Preview widget secret                                                           |
| `RESEND_API_KEY`            | Secret   | Preview sending-only key                                                        |
| `RESEND_FROM`               | Variable | Clearly labelled preview sender, e.g. `talent-preview@mail.cube27.com`          |
| `RESEND_REPLY_TO`           | Variable | Test owner                                                                      |
| `EMPLOYER_LEADS_TO`         | Variable | Test inbox only                                                                 |
| `CANDIDATE_APPLICATIONS_TO` | Variable | Test inbox only                                                                 |

Changing any value here takes effect on the next request; no rebuild is needed.
The Turnstile site key is the exception — it is embedded into the static HTML at
build time, so changing it in `src/site-config.ts` requires a deployment.

Cloudflare reference: [Pages Functions bindings](https://developers.cloudflare.com/pages/functions/bindings/).

## 7. Attach domains and protect previews

1. In the Pages project, open **Custom domains** > **Set up a domain**.
2. Add `talent.cube27.com`. Because `cube27.com` is already a Cloudflare zone,
   Cloudflare can create the required DNS record.
3. Add `talent-preview.cube27.com` to the preview deployment strategy.
4. Protect preview deployments with Cloudflare Access or limit them to the
   stable preview host. Preview forms contain working integrations and must not
   become a public alternate submission channel.
5. After the custom domain is healthy, redirect the production `*.pages.dev`
   hostname to `talent.cube27.com`, or protect it with Access. Do not leave an
   unmanaged alternate production hostname.

Cloudflare reference: [Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).

## 8. Create Cloudflare security rules

Rules are configured on the `cube27.com` zone. Start new blocking rules in Log
or preview mode when the plan supports it, validate the events, then enable the
action. Keep the application byte limits even when equivalent edge rules exist.

### 8.1 Request body-size rules

If the zone plan exposes `http.request.body.size` to custom rules, create two
rules under **Security > WAF > Custom rules**.

Employer form — Block:

```text
http.request.method eq "POST"
and http.request.uri.path eq "/api/employer-lead"
and http.request.body.size > 32768
```

Candidate form — Block:

```text
http.request.method eq "POST"
and http.request.uri.path eq "/api/candidate-application"
and http.request.body.size > 5275648
```

The candidate number is 5 MiB plus 32 KiB for fields and multipart overhead.
If this field is unavailable on the current plan, the code still enforces the
actual streamed-byte limits; record the plan limitation in the operations log.

### 8.2 Rate-limiting rules

Go to **Security > WAF > Rate limiting rules**. Use IP (or IP with NAT support
where available) as the counting characteristic. Recommended conservative
starting points:

| Rule                  | Match                                        | Initial threshold                      | Action                   |
| --------------------- | -------------------------------------------- | -------------------------------------- | ------------------------ |
| Candidate submissions | `POST` and path `/api/candidate-application` | 6 requests per 10 minutes per visitor  | Block/429 for 10 minutes |
| Employer submissions  | `POST` and path `/api/employer-lead`         | 10 requests per 10 minutes per visitor | Block/429 for 10 minutes |

Expression editor values on plans that expose the Method field:

```text
http.request.method eq "POST"
and http.request.uri.path eq "/api/candidate-application"
```

```text
http.request.method eq "POST"
and http.request.uri.path eq "/api/employer-lead"
```

On Free/Pro plans where Method is unavailable in rate-rule expressions, match
the exact API path; these paths only support POST, so the behavior remains
bounded. Do not use one generous shared `/api/*` threshold: candidate requests
have materially higher CPU, memory, attachment, and email cost.

Review Security Analytics after one week and one month. Tune from observed
legitimate retries and NAT-shared traffic rather than simply raising limits
after the first false positive.

Cloudflare references: [rate-limiting rules](https://developers.cloudflare.com/waf/rate-limiting-rules/),
[dashboard setup](https://developers.cloudflare.com/waf/rate-limiting-rules/create-zone-dashboard/), and
[parameters/plan differences](https://developers.cloudflare.com/waf/rate-limiting-rules/parameters/).

### 8.3 Malware scanning for candidate uploads

Cloudflare Malicious Uploads Detection is currently an Enterprise paid add-on.
It produces detection fields but does not block by itself. If available:

1. Enable **Security > WAF > Traffic detections > Malicious uploads**.
2. Confirm automatic scanning recognizes the candidate multipart upload.
3. Create a custom WAF rule for the candidate endpoint. Begin with Log, submit
   clean test documents, inspect the fields, then change the action to Block.
4. Use this fail-closed expression:

   ```text
   http.request.method eq "POST"
   and http.request.uri.path eq "/api/candidate-application"
   and (
     not cf.waf.content_scan.has_obj
     or cf.waf.content_scan.has_failed
     or cf.waf.content_scan.has_malicious_obj
     or any(cf.waf.content_scan.obj_results[*] != "clean")
   )
   ```

5. Verify a clean PDF and DOCX reach the test inbox.
6. Use Cloudflare's documented EICAR ZIP test procedure and confirm the request
   is blocked at the edge and no email is generated. Never forward EICAR to the
   production mailbox.
7. Alert on scanner failures and `not scanned` results; do not silently allow
   them.

If the add-on is unavailable, the production launch owner must document the
mail gateway/endpoint product that scans and quarantines attachments, validate
it with the vendor's safe test method, and ensure recruiters cannot bypass the
quarantine. The application rejects malformed, encrypted, expansion-heavy,
macro/embedded-object DOCX files and active/malformed PDFs, but no parser can
substitute for current malware detection.

Cloudflare references: [Malicious Uploads Detection](https://developers.cloudflare.com/waf/detections/malicious-uploads/),
[example rules](https://developers.cloudflare.com/waf/detections/malicious-uploads/example-rules/), and
[setup/testing](https://developers.cloudflare.com/waf/detections/malicious-uploads/get-started/).

## 9. Deploy and smoke-test preview

1. Trigger a preview deployment after all Preview variables are set.
2. Confirm every page returns 200 and assets/fonts load.
3. Confirm response headers include CSP, HSTS, frame denial, nosniff, referrer,
   and permissions policies.
4. Submit the employer form with the preview Turnstile widget:
   - internal email reaches only the test inbox;
   - acknowledgement reaches the supplied test address;
   - the browser redirects only after the internal send succeeds.
5. Submit clean PDF and DOCX candidate resumes at normal sizes.
6. Confirm these cases are rejected:
   - request above the route byte limit;
   - ZIP renamed to `.docx`;
   - encrypted or macro-enabled document;
   - file above 5 MiB;
   - invalid/expired/replayed Turnstile token;
   - cross-origin browser request.
7. Temporarily use Cloudflare's always-fail Turnstile test secret and confirm
   both forms return verification errors and send no email. Restore the preview
   secret and redeploy.
8. Inspect Pages Function logs and verify no form values, resume bytes, secrets,
   or provider response bodies are logged.

## 10. Production release checklist

- [ ] `pnpm test` passes.
- [ ] `pnpm verify` passes.
- [ ] Privacy notice, retention period, deletion process, and legal entity are approved.
- [ ] Production and preview Resend keys are different and sending-only.
- [ ] `mail.cube27.com` is verified in Resend; SPF/DKIM and test delivery pass.
- [ ] The `talent@` sender does not collide with a main-site sender, and current
      plan quota has headroom for both sites (§3.1).
- [ ] Production and preview Turnstile widgets/secrets are different.
- [ ] `TURNSTILE_SITE_KEYS.production` in `src/site-config.ts` is the real
      production widget's site key, not a test key.
- [ ] `TURNSTILE_SITE_KEYS.preview` is the real preview widget's site key; the
      always-pass test key `1x000...AA` is no longer in the file.
- [ ] Each committed site key is paired with its own widget's secret in the
      matching Cloudflare environment.
- [ ] Production Turnstile allows only `talent.cube27.com`.
- [ ] Preview recipient variables point only to a test inbox.
- [ ] Body-size rules are enabled where the plan supports them.
- [ ] Both route-specific rate limits are enabled.
- [ ] Malware scanning/quarantine is enabled and tested fail-closed.
- [ ] `talent.cube27.com` certificate and DNS are healthy.
- [ ] Preview and `*.pages.dev` alternate hostnames are protected or redirected.
- [ ] External-network smoke tests pass for both forms.
- [ ] Named owners can access Pages logs, Resend logs, Turnstile Analytics, and WAF events.

Promote the tested commit to `main`. Cloudflare Pages will build and deploy it.
Run one low-impact production submission per form using owned addresses and
confirm the expected inbox, acknowledgement, reference ID, and logs.

## 11. Monitoring and incident response

Check weekly at launch, then monthly:

- Pages Function errors, CPU/memory pressure, and 413/415/429 rates.
- WAF/rate-limit events and false positives.
- Turnstile invalid-token, duplicate-token, hostname, and action patterns.
- Resend delivery failures, bounces, complaints, quota, and sender reputation.
  Quota and reputation are shared with the main Cube27 site (§3.1), so read them
  as account-wide numbers, not this project's.
- Malware scan failures, suspicious uploads, and quarantine events.
- Shared inbox ownership and response backlog.

If form abuse or a credential leak is suspected:

1. Tighten or block the affected API path at the WAF.
2. Rotate the affected Turnstile secret and/or Resend key.
3. Update the matching Pages secret in Production and Preview separately.
4. Redeploy because a Turnstile site-key change affects the static build.
5. Review Cloudflare, Turnstile, Resend, and mailbox logs; do not copy PII into
   tickets or chat.
6. Restore service only after a clean smoke test.

## 12. Rollback

Use **Workers & Pages > cube27-talent > Deployments** to roll back to the last
known-good deployment. A rollback does not roll back dashboard secrets, DNS,
Turnstile widgets, Resend keys, or WAF rules. Record those separately and undo
only the configuration involved in the incident.

Never weaken body limits, Turnstile validation, document validation, malware
quarantine, or rate limiting merely to make a failing submission pass. Route a
legitimate edge case through the test environment, identify the precise control,
and change it with a regression test and an operations-log entry.
