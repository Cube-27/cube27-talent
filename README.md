# Cube27 Talent

Managed talent and team-building site for `talent.cube27.com`. Astro
static output plus two Cloudflare Pages Functions for the forms, deployed to an
**independent** Pages project so it shares no failure domain with `cube27.com`.

## Reference documents

Priority when they conflict: **invariants → V1 plan → content strategy → design system → code.**

| Document                                                                                               | Governs                               |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| [`docs/cube27-talent-product-invariants-revised.md`](docs/cube27-talent-product-invariants-revised.md) | Locked business decisions             |
| [`docs/cube27-talent-v1-plan-revised.md`](docs/cube27-talent-v1-plan-revised.md)                       | Product and implementation plan       |
| [`docs/content-strategy.md`](docs/content-strategy.md)                                                 | Messaging, page narrative, copy rules |
| [`docs/design-system.md`](docs/design-system.md)                                                       | Colour, type, components, usage rules |
| [`PRODUCT.md`](PRODUCT.md)                                                                             | Durable product truth                 |

## Commands

```bash
pnpm install
pnpm dev        # localhost:3100 — static pages only, no Pages Functions
pnpm build      # static output to dist/
pnpm preview    # wrangler pages dev dist — the ONLY way to exercise the forms
pnpm test       # resume and request-body security tests
pnpm verify     # format:check + content gate + lint + astro check + test + build
```

`pnpm dev` does not run `functions/`. Form submissions only work under
`pnpm preview`, which needs `.dev.vars`.

## Local setup for the forms

```bash
cp .env.example .env             # PUBLIC_TURNSTILE_SITE_KEY, read at build time
cp .dev.vars.example .dev.vars   # then fill in RESEND_API_KEY
pnpm build && pnpm preview
```

Both example files ship Cloudflare's Turnstile **test** keys — the site key
always passes and no real challenge is shown. Swap in real keys per environment
before launch.

**Turnstile site keys live in the repo, not the dashboard.** They are public —
they ship in the HTML — so `TURNSTILE_SITE_KEYS` in `src/site-config.ts` holds
one per environment and `CF_PAGES_BRANCH` picks between them at build time.
`main` takes the production key; every other branch takes the preview key.
`PUBLIC_TURNSTILE_SITE_KEY` remains an override for local builds. The matching
**secret** keys are confidential and stay in Cloudflare.

A build with no key for its branch fails: the endpoints reject any submission
without a Turnstile token, so it would ship forms that cannot be submitted.
Failing the build is deliberate. `pnpm dev` is exempt.

## Architecture

```text
src/
  data/            role taxonomy, process, FAQs, proof — the content source of truth
  styles/          fonts.css → tokens.css → globals.css
  components/ui/   controls, section shells, image and editorial primitives
  components/sections/  Header, Footer, Hero, ExpertiseSelector, ProcessRail, …
  components/forms/     EmployerForm, CandidateForm
  lib/form-client.ts    shared submit handling, attribution capture
  pages/           one file per route
functions/
  _shared/         responses, validation, turnstile, email
  api/             employer-lead.ts, candidate-application.ts
public/
  _headers         CSP and cache rules
  fonts/           self-hosted woff2 — DM Sans Variable (display + body)
```

**No UI framework.** No React, Vue, CMS or database — the two tab selectors and
the form handlers are plain TypeScript modules (plan §12.4.5).

### Rules the code enforces

- **Proof gating.** Numbers render only when their `src/data/proof.ts` entry is
  `verified: true`. The three approved figures are recorded with their source.
- **Content gate.** `pnpm content:check` rejects stale process-count language,
  engineering-only positioning and prohibited contractual copy in source.
- **Internal email is the critical send.** If Resend fails on the internal
  notification the endpoint returns an error and the browser never reaches the
  confirmation page. The acknowledgement is best-effort and only logged.
- **Two separate candidate consents.** Processing consent is required; retention
  consent is optional and unticked (plan §9.2).

## Environment variables

Every variable is documented in [`.dev.vars.example`](.dev.vars.example), which
covers local `pnpm preview` only. In Cloudflare they are split across two
places, because this repo ships a Wrangler config file:

- **Plain variables** — the `vars` blocks in [`wrangler.jsonc`](wrangler.jsonc)
  (top level is production, `env.preview.vars` is preview). The dashboard
  rejects plain variables while that file exists.
- **`RESEND_API_KEY` and `TURNSTILE_SECRET_KEY`** — encrypted secrets, added per
  environment in the Pages dashboard. Never commit them.

**Production and preview must differ.** Preview `CANDIDATE_APPLICATIONS_TO`
must point at a test inbox — a preview submission must never deliver a resume
to the live recruitment distribution (plan §13.2).

**Separate production queues.** `EMPLOYER_LEADS_TO` holds `talent@cube27.com` and
`CANDIDATE_APPLICATIONS_TO` holds `talent-apply@cube27.com` in production; the
two variables keep employer requirements and candidate applications routed
independently.

**The Resend sending domain is shared.** `mail.cube27.com` serves both this
project and the main Cube27 site, so send quota and sender reputation are
account-wide. Use per-project API keys and a distinct `talent@` sender; see
[operations §3.1](docs/operations.md) for the trade-offs and when to split.

## Deployment

Follow the complete [Cloudflare deployment and integrations operations guide](docs/operations.md)
for Pages, domains, environment bindings, Turnstile, Resend, WAF rules,
verification, monitoring, rotation, and rollback.

1. Create a **new** Cloudflare Pages project — do not reuse `cube27-web`.
2. Build command `pnpm build`, output directory `dist`.
3. Set the variables above for production and preview separately.
4. Verify the Resend sending domain (`mail.cube27.com`, shared with the main
   Cube27 site) before the first real submission.
5. Attach `talent.cube27.com` and confirm TLS.
6. Add a rate-limiting rule on `POST /api/*`.
7. Smoke-test both forms from an external network.

## Before launch

Blocking:

- [ ] Verify `200+ positions filled` and flip it in `src/data/proof.ts`, or
      leave it off.
- [ ] Real Turnstile keys per environment.
- [ ] Production and preview inboxes confirmed, with owners assigned.

CSR, privacy, and terms link to the approved parent-brand pages configured in
`src/site-config.ts`; this site does not duplicate those pages.

Known gaps, deliberately not built:

- **No durable store.** A Resend outage means the submission is not captured
  anywhere. The user sees an error rather than a false success, so nothing is
  silently dropped — but the lead is not recoverable either. A KV or D1 write
  before the send is the recommended fix; it also makes deletion requests
  executable, which an email-only pipeline cannot honour.
- **No rate limiting in code** — configure it at the Cloudflare edge.
- **No analytics or LinkedIn tag** — pending the consent decision (plan §14.5).
