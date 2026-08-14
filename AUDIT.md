# Audit — talent.cube27.com

Security, design-system and SEO/technical review, with fixes applied.

|            |                                                                                    |
| ---------- | ---------------------------------------------------------------------------------- |
| **Date**   | 14 August 2026                                                                     |
| **Base**   | `65e9e7a` (main)                                                                   |
| **Scope**  | `src/` · `functions/` · `public/` · `docs/` · built `dist/`                        |
| **Method** | Static review plus build output. No live browser, no Cloudflare-side verification. |

**31 findings. 25 fixed, 4 settled as product decisions, 2 open, and one of my
own findings corrected after building it.**
`pnpm verify` passes end to end: format, content gate, lint, `astro check`
(49 files, 0 issues), 18/18 security tests, build.

Design findings are stated against [`docs/design-system.md`](docs/design-system.md),
which is specific enough to audit against directly.

---

## Headline results

|                                      |                Before |                   After |
| ------------------------------------ | --------------------: | ----------------------: |
| Fonts shipped per page               |              94,832 B |     **49,880 B** (−47%) |
| Form field boundary contrast         | 1.31:1 (fails 1.4.11) | **3.12–3.48:1**, no box |
| Footer meta contrast                 |  3.10:1 (fails 1.4.3) |              **4.83:1** |
| Footer wordmark "27" contrast        |                1.87:1 |              **4.91:1** |
| Distinct card paddings               |                     8 |      **3 named scales** |
| Distinct icon tile/glyph pairs       |                     7 |  **3 documented pairs** |
| Dead scroll listeners                |            1 per page |                   **0** |
| Form overflow below 388px            |                 68 px |                   **0** |
| Unreferenced assets in `dist/`       |               26.6 KB |                   **0** |
| Schema entities describing absent UI |               4 pages |                   **0** |

---

## Still open

### SEC-4 · Low · `script-src` still carries `'unsafe-inline'` — finding corrected

**My original finding was wrong on the facts and the fix does not work as
described.** I said one inline script forced `'unsafe-inline'` and a single
SHA-256 hash would replace it. Building it showed otherwise: Astro inlines every
component `<script>` under its size threshold straight into the HTML. The home
page ships **five** inline executable blocks, not one, and each body is
re-minified on every build — so their hashes change whenever the source does.
Hashing would mean regenerating the header on every deploy. A nonce is not
available either: this is a static Pages build with no per-request layer.

The real route to a strict policy is to force Astro to emit those scripts as
external files first, then allow `'self'` alone. That is a build-configuration
change worth doing deliberately, not as an audit cleanup.

`_headers` now documents all of this inline so the next person does not
rediscover it. Everything else in that CSP was tightened — see below.

### DES-9 (partial) · Low · Footer link rows are ~23px tall

The employer form chips are fixed. Footer link rows remain roughly 23px. They
pass WCAG 2.2 SC 2.5.8 via the spacing exception and read as a link list rather
than a control cluster, so raising them is a judgement call on footer density
rather than a defect. Left as-is deliberately.

### TEC-10 · Note · No `lastmod` in the sitemap

Optional, and an absent value beats a wrong one. Worth adding only if driven
from real git commit dates rather than build time.

---

## Settled as product decisions

### Rate limiting — reported configured, **not verified**

The owner reports rate-limiting rules are configured at the Cloudflare edge, and
the finding is closed on that basis. Stated precisely: this is a **reported**
control, not a verified one. Nothing in this repository can confirm it, this
audit did no Cloudflare-side verification, and the §8.2 checklist item is still
unticked.

That matters more than it looks, because the endpoint it protects is the
expensive one and SEC-1 leans on it as a backstop. Record the rule and its
threshold in `docs/operations.md` §8.2 — a screenshot or an export — so the next
reader does not have to take it on trust either.

### Landing display scale — 44px ceiling raised to 50px

`.landing-scale` overrides the display token to `clamp(2.125rem, 4.2vw, 3.125rem)`
because the hero read too small at 44px. **`docs/design-system.md` §4 now states
the 44px rule as applying to sub-pages, names the landing scale explicitly, and
sets 50px as the site ceiling.** No code change — the implementation was already
the intended design.

### Card elevation — hairline and shadow together

The combination of `border border-c27-line` with `--c27-shadow-card` is the
intended card treatment. The design system forbade it in two places, which is
what generated the original finding. Documentation and code now both say what
you decided — details under _Design system_ below.

### Motion values — code kept, document corrected

`.c27-rise` translates 16px against a stated 12px cap, and `--c27-dur` is 500ms
against a stated 450ms. Following the same principle as the display scale, the
implementation was treated as the decision: **§7 now reads 16px and 500ms.**

---

## Fixed — security

### SEC-1 · High → **Medium** · `pdf-lib` — twice re-rated, twice for good reason

I first called this High for the wrong reason (unmaintained dependency), then
Low for a reason that was **factually wrong**. Review caught the second error.
Landing at Medium.

**What I got wrong.** I wrote that "the parse output is never trusted" because
the endpoint emails the original bytes. That is half the picture and the wrong
half. `validatePdf` walks the parsed object graph _to decide accept or reject_.
A parser false negative — a construct pdf-lib mis-parses or fails to surface —
means the document is **accepted** and forwarded to a recruiter's inbox with its
active content intact. I only reasoned about "wrong answer rejects a valid
resume" and never about "wrong answer admits a malicious one", which is the
direction that matters.

**Second error: the resource-exhaustion claim.** I said a hostile document is
bounded by the runtime and the edge rate limit. `MAX_PDF_OBJECTS` and
`MAX_PDF_PAGES` are both evaluated _after_ `PDFDocument.load` returns, so
nothing in this code bounds the parse itself. The runtime limit is real but
unmeasured against a deliberately hostile PDF, and the rate limit is per-IP.

**What stands.** RCE is genuinely not the threat: pure JavaScript in a V8
isolate, no native code, no memory-safety class of bug, no cross-request state.

**Fixed:** `docs/operations.md` §8.4 rewritten to state all of this — the filter
is a filter, not a guarantee, and explicitly not a substitute for the
fail-closed scanning in §8.3. Added a pre-review action to measure worst-case
parse cost on the deployed plan and set a parser-specific budget.

**Test coverage extended**, since the previous suite proved less than the prose
claimed. Three new cases, 18/18 passing:

- `/Launch` action → `active-pdf-action`
- `/EmbeddedFiles` entry → `active-pdf-content`
- **a forbidden key inside a compressed object stream** — this one first asserts
  `/JavaScript` is _absent_ from the raw bytes, then asserts validation rejects
  the file anyway. That converts the §8.4 argument against byte-scanning from a
  claim into something that breaks the build if it stops being true.

### SEC-2 · Medium → **Low** · Retention consent is a process gap, not a code gap

**I overstated this one too.** I wrote that the consent "records a choice the
system cannot honour". That is half right. The system cannot _enforce_ it — but
it does _record_ and _surface_ it: the answer arrives in the internal
notification as the `Retention consent` field, right next to the submission
reference. A recruiter reading that email can act on it. What was missing was
not signal, it was a process.

So this needed neither a schema change nor a rewrite of user-facing privacy copy
— and I am glad I did not touch the copy, because the honest problem was
elsewhere.

**Partially fixed — the process is written, the values are not filled in.**
`docs/operations.md` §8.5 defines the shape: a quarterly cadence, what to delete
and when, how to service a deletion request by submission reference
(`CAN-YYMMDD-XXXXXXXX`, which is in every subject line), and the reminder that
clearing the mailbox does not clear Resend's logs. A later review also caught
that the first draft bounded `Retention consent: No` and left `Yes` unbounded —
consent with no stated period is indefinite retention. §8.5 now sets 24 months
with delete-or-re-consent.

**Three values remain blocking and are marked as such in §8.5**: no mailbox
owner is named, Resend's log retention window is unrecorded, and the 24-month
period needs privacy-owner confirmation. Until those are filled in this is a
documented intention, not a control — and §8.5 says to ship without the optional
retention checkbox rather than collect a consent nothing bounds.

It also records **when to stop doing it manually**: when volume outgrows a
quarterly sweep, or when someone asks for proof a specific profile was deleted,
which a mailbox cannot give you. At that point the fix is _not_ a KV/D1 record
alongside the email — that just creates a second copy of the same PII. It is to
stop emailing the attachment at all: resume to R2 with the retention flag,
recruiters get a link plus metadata, objects expire automatically. That is the
architecture that makes deletion both executable and provable.

### SEC-3 · Medium · Referrer query strings no longer emailed

`document.referrer` was captured whole and emailed verbatim; a referrer from a
third-party site can carry session identifiers or PII in its query.

**Fixed:** `form-client.ts` gained `safeReferrer()`, which parses the referrer
and submits `origin + pathname` only. The attribution signal is unchanged.

### SEC-5 · Low · Unused analytics origins removed from CSP

The policy pre-authorised `static.cloudflareinsights.com` in `script-src` and
`cloudflareinsights.com` in `connect-src` for a beacon the README says is not
enabled.

**Fixed:** both removed. `_headers` documents exactly which entry goes back in
which directive when Web Analytics is turned on.

### SEC-6 · Low · Header policies reconciled across both surfaces

API responses set `cross-origin-resource-policy` and `x-xss-protection`;
`public/_headers` set neither, so the policy a visitor got depended on whether
their first request was a page or an API call.

**Fixed:** `Cross-Origin-Resource-Policy: same-origin` added to `_headers`.
`X-XSS-Protection` removed from `responses.ts` rather than propagated — every
current browser ignores it.

### SEC-7 · Note · No change needed

`isAllowedOrigin` passing non-browser clients is correct for a public form
endpoint. Recorded so the reasoning is not rediscovered as a bug.

---

## Fixed — design system

### DES-1 · High · Fields are wells, not boxes

Every input, textarea and select was `bg-c27-surface` on a `bg-c27-surface`
card, bounded only by `border-c27-line` at **1.31:1** — below the 3:1 WCAG 2.2
SC 1.4.11 requires for the boundary identifying a control. The fields were
effectively invisible until focused, on the two pages the site funnels toward.

**First attempt was wrong.** I darkened the box border to `#918e97`. That passed
the contrast check and looked bad: four dark sides on fifteen stacked inputs
reads as a grid of cages on a page whose entire character is flat hairlines.
Rejected on sight, correctly.

**Shipped instead:** fields are filled wells with a single bottom rule and no
box.

|       |                                                                      |
| ----- | -------------------------------------------------------------------- |
| Fill  | `--c27-field-fill` `#f4f2ee` — the pale stone already in §3          |
| Rule  | 1px bottom only, `--c27-line-control` `#8b8891`                      |
| Rest  | No top, left or right border anywhere                                |
| Focus | Fill lifts to white, rule turns accent, inset shadow reads it as 2px |
| Hover | Rule darkens to `--c27-ink-3`                                        |

The fill does the visual work — a field is obviously a field at a glance — and
the rule is what formally identifies it. Because that rule sits between the fill
above and the card below, it has to clear 3:1 against **both**, which is why
`#8b8891` and not the `#918e97` from the first attempt: that value measured 2.88
against the fill and would have failed on the side nobody checks.

| Adjacent surface     | Ratio | Needs |
| -------------------- | ----: | ----: |
| Card `#ffffff`       |  3.48 |   3.0 |
| Field fill `#f4f2ee` |  3.12 |   3.0 |
| Ground `#faf9f5`     |  3.31 |   3.0 |

Focus thickens the rule with `box-shadow: inset` rather than a wider border, so
nothing shifts by a pixel when you tab through the form.

All of it lives in one `.c27-field` class. The two forms previously repeated a
180-character utility string seven times between them and had drifted — the
candidate textarea was `min-h-[5rem]`, the employer one `min-h-[6rem]`. Both are
now `c27-field min-h-[6rem]`. The role-family chips got the same treatment:
filled, transparent border at rest, accent fill and border when checked, so
state never rests on colour alone.

§6 Forms documents the rule and why the decorative hairline cannot serve as a
control boundary.

### DES-2 · Medium · Cards routed through the design system

`.c27-card`, `.c27-card-on-tint`, `.c27-card-link` and `.c27-soft-panel` existed
with zero usages while every card was re-assembled inline — producing **eight
different paddings** for one component.

**Fixed:** three padding scales, each with a stated job:

| Token               | Value                         | Job                                      |
| ------------------- | ----------------------------- | ---------------------------------------- |
| `--c27-pad-card-sm` | `1.5rem`                      | Dense rails — three or four cards across |
| `--c27-pad-card`    | `clamp(1.5rem, 3vw, 2.5rem)`  | The standard card                        |
| `--c27-pad-card-lg` | `clamp(1.75rem, 4vw, 3.5rem)` | Panels holding a sub-layout              |

`.c27-card` and `.c27-card-on-tint` now carry fill, hairline, shadow **and**
padding, so a card is one class. New `.c27-card-pad`, `.c27-card-pad-sm` and
`.c27-card-lg` cover grid-lattice cards that supply their own borders. All ten
card sites converted. §6 Content panels documents it.

### DES-2 (elevation) · Card shadow made consistent, per your decision

Two card surfaces were missing the treatment everything else had:

- `LeadershipHiring` — the `c27-gradient-blue` panel had neither border nor
  shadow, while `Lifecycle` uses the same gradient with both. Added
  `c27-card-shadow border border-c27-line`.
- `join-talent-network` — the tinted overseas-work note was a bordered card
  surface with no shadow. Added `c27-card-shadow`.

`docs/design-system.md` rewritten to match:

- §2 rule 3 — cards and content panels combine the hairline with the single card
  shadow; overlays take the overlay shadow; section bands, controls and icon
  tiles stay flat.
- Portable flat subset updated, so the rule transfers correctly to other Cube27
  properties.
- §6 elevation hierarchy expanded from four levels to five, adding an explicit
  **functional control** level so it is clear inputs and buttons stay flat while
  the card beneath them is the raised object. A grid-lattice note records how
  the shared-border pattern in `Compliance` and the _why-us_ proof rows works.
- `Section.astro`'s comment, which asserted "There is no shadow anywhere in this
  component" while citing the old rule, rewritten.

Everything else already carried the treatment. Form inputs, chips, error alerts
and icon tiles are correctly flat as controls; the mobile menu, `Select` listbox
and skip link correctly use the heavier overlay shadow.

### DES-3 · Medium · `text-body` is now a real utility

`--c27-text-body` was defined in `:root` but never exported into `@theme
inline`, so Tailwind never generated `.text-body`. Six components used the class
and silently inherited `1rem` from `body` — identical output, zero connection to
the token, and guaranteed to break the moment the token changed.

**Fixed:** `--text-body: var(--c27-text-body);` added. Confirmed present in the
built stylesheet: `.text-body{font-size:var(--c27-text-body)}`.

### DES-4 · Medium · H3 scale given roles instead of components

`Lifecycle` used `.c27-h3` (17px) while the adjacent `Compliance` used
`.c27-h3-lg` (24px) for the same card role, and §4's stated 1.125rem floor did
not match the 1.0625rem token.

**Fixed:** §4 now assigns the two sizes by role rather than restating a floor
the system does not want — `1.5rem` for cards carrying a title plus a paragraph,
`1.0625rem` for label-scale titles in dense rails where the title is a name, not
a sentence. Both existing usages are correct under that rule; this makes the
existing split intentional and documented.

### DES-5 · Medium · Footer wordmark legible

`--c27-brand-27` (#8d296a) on the charcoal footer measured **1.87:1** — the
brand's own numeral was the least readable glyph on the page.

**Fixed:** new `--c27-brand-27-on-deep: #d178aa` token at **4.91:1**, applied in
`Footer.astro`. `#8d296a` retained for light grounds.

### DES-6 · Medium · Footer meta line passes AA

`--c27-on-deep-3` (#64748b) on `--c27-deep` measured **3.10:1** at 13px, which
needs 4.5:1.

**Fixed:** lightened to `#8b94a3` — **4.83:1** — keeping the intended hierarchy
below `--c27-on-deep-2` (5.76:1).

### DES-7 · Low · Heading semantics — my fix was wrong, reverted

`HowItWorksHero` marked its evidence-card titles `<h2 class="c27-h3">` while the
identical grids elsewhere used `<h3>`. I changed it to `<h3>` for consistency.

**That was a regression and review caught it.** Those cards sit directly under
the page `h1` with no section heading between them, so `h3` skipped a level —
`how-it-works` went `h1 → h3`, which is worse than the inconsistency I was
fixing. The other grids are correct at `h3` because they sit under a
`SectionHead` `h2`. **Heading rank follows document position, not visual
similarity**, and I applied the wrong rule.

**Reverted to `<h2>`**, with a comment on the element explaining why it
deliberately differs from the visually identical grids. Verified: no page skips
a level.

The other half of that change stands — `ExpertiseSelector`'s dynamic `Heading`
component, driven by a `headingLevel` prop no caller ever passed, is replaced
with a plain `<h3>` and the prop removed. That grid does sit under a
`SectionHead`.

### DES-10 · Low · Icon tiles reduced to three documented pairs

Seven tile/glyph combinations existed across the components with no rule.

**Fixed:** normalised to `size-11`/20px, `size-12`/24px, `size-14`/26px, and §6
now carries the table with each pair's job.

### DES-11 · Note → **High** · Both forms overflowed below 388px

I wrote that tracing the layout by hand to 320px found no horizontal-overflow
risk. **That was wrong**, and a reviewer rendering the page in a real browser
caught it.

The Turnstile iframe has a 300px minimum width and is the only fixed-width
element in either form. Confirmed by arithmetic against the built tokens:

| Viewport | Available inside the card | 300px widget          |
| -------: | ------------------------: | --------------------- |
|    320px |                     232px | **overflows by 68px** |
|    360px |                     272px | **overflows by 28px** |
|    388px |                     300px | fits                  |

**Why the audit missed it, which is the part worth keeping:** Turnstile is a
third-party iframe injected at runtime by an external script. It appears nowhere
in the source. Every constraint I _could_ trace was sound — fluid gutters, all
fixed `minmax()` minimums gated behind `lg:`, a correct snap-scroll rail for the
expertise tabs, every grid collapsing to one column — and the layout still broke,
because a source-level read structurally cannot see an element that does not
exist until a third-party script runs. "No live browser" was listed as a scope
limit from the start; this is the defect that limit was hiding.

**Fixed:** the widget now renders `flexible` by default and switches to Turnstile's
150px `compact` size below 25rem, set before `api.js` auto-renders. Script order
verified in the built HTML: widget div, then the sizing script, then `api.js`.
`docs/design-system.md` §6 Forms now carries the general rule — embedded
third-party widgets need checking at 320px in a real browser.

The mobile menu findings stand: it positions correctly against the sticky header
and closes on link click, outside click and Escape with focus returned.

---

## Fixed — SEO, AEO and technical

### TEC-1 · Medium · Dead scroll listener removed

Every page registered a rAF-throttled scroll handler toggling `is-stuck` on the
header. No stylesheet ever defined that class, and the header carries its
hairline unconditionally.

**Fixed:** removed, with a comment recording why it is not coming back.
Confirmed absent from built HTML and CSS.

### TEC-2 · Medium · Fonts subset to Latin — 45 KB saved on every page

Both faces shipped their full character sets — 677 and 385 codepoints for the
~100 characters the site's copy uses. At 94.8 KB they were roughly four times
the gzipped CSS and twenty-eight times the gzipped JavaScript.

**Fixed:** subset with `pyftsubset` to the standard Latin range plus the
punctuation and arrows in use.

| Face      |       Before |        After |          |
| --------- | -----------: | -----------: | -------: |
| Hauora    |     51,612 B |     21,452 B |     −58% |
| Switzer   |     43,220 B |     28,428 B |     −34% |
| **Total** | **94,832 B** | **49,880 B** | **−47%** |

Coverage was verified before the swap, not assumed: every distinct printable
character across the built HTML, the plain-text routes and all source files was
diffed against the original and subset `cmap` tables. **Zero regression** — no
codepoint the site can render was lost. The one gap found, `U+2192` (→) in
Switzer, was already absent from the original face, and the arrow is set in
`font-mono` regardless.

`fonts.css` carries the exact regeneration command and a warning to re-run the
coverage check, since a dropped codepoint renders as tofu silently.

### TEC-3 · Medium · Resume read once instead of twice

`validateResumeDocument(resume)` did `await file.arrayBuffer()` and the endpoint
then called `await resume.arrayBuffer()` again for the base64 encode — two full
5 MiB copies live at once, on top of the buffered body and the DOCX inflate
budget.

**Fixed:** `validateResumeDocument` now takes `Uint8Array`; the endpoint reads
once and reuses. Ten test call sites updated with a `resumeBytes()` helper; all
15 tests still pass.

### TEC-4 · Medium · BreadcrumbList dropped

Four pages emitted `BreadcrumbList` while no page rendered a trail.

**Dropped rather than rendered.** The site is five pages, one level deep.
Breadcrumb rich results add essentially nothing for a flat IA, and a rendered
trail reading "Home / Why us" above an `h1` that says "Why us" is furniture, not
navigation. Removing it also deleted `breadcrumbSchema()` and its four call
sites, and the now-unused `ROUTES` imports that lint caught immediately after.

Verified: no `BreadcrumbList` or `ListItem` remains in any built page.

### TEC-5 · Low · Entity duplication resolved

`Service` was emitted on three URLs with no `@id`, resolving as three distinct
entities, and the employer FAQ set was marked up on two URLs.

**Fixed:** `Service` given a stable `@id` of `{url}/#service`, matching the
pattern already used for `Organization` and `WebSite`. Duplicate `faqSchema`
removed from `/hire-talent/`, leaving the employer set on `/` only. The visible
FAQ accordion on `/hire-talent/` is unchanged.

Verified: two `FAQPage` entities remain in the build — the employer set on `/`
and the candidate set on `/join-talent-network/`. That is correct; they are
different questions on different URLs. An earlier version of this line claimed
`FAQPage` appeared "once across the site", which was simply wrong: only the
_duplicate_ employer set was removed, not one of two legitimate ones.

### TEC-6 · Low · Root images now cached

`_headers` set immutable caching for `/fonts/*` and `/_astro/*` but nothing for
root-level images, which fell back to revalidate-on-every-request.

**Fixed:** each root asset gets `max-age=86400, stale-while-revalidate=604800` —
not `immutable`, because these filenames are not content-hashed and a logo
change has to be able to land.

**Corrected after review.** The first version used extension globs (`/*.webp`).
Those also match nested paths, so any hashed image Astro emits into `/_astro/`
would have matched the weaker rule and silently lost its `immutable` header —
both rules apply and the later one wins. No such image exists today, which is
exactly why it would have gone unnoticed. Now listed one path at a time, with a
note to add a line when a root asset is added.

### TEC-7 · Low · Unreferenced code and assets removed

| Removed                                                                               | Note                                                   |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `public/bg-image.webp`                                                                | 20.6 KB deployed on every build, referenced by nothing |
| `public/cube27_logo.png`                                                              | 6.0 KB; header switched to the existing 3.3 KB WebP    |
| `ROUTES.csr`                                                                          | Defined, never linked                                  |
| `TRUST_MODULE_ENABLED`                                                                | Defined `false`, read nowhere                          |
| `RoleFamily.featured`                                                                 | Set on Leadership, read nowhere                        |
| `headingLevel` prop                                                                   | Never passed by any caller                             |
| Icons `phone`, `cart`, `lock`                                                         | Unused paths; 16 glyphs remain, all used               |
| `--radius-c27-lg`, `--text-label`, `--text-micro`, `--color-c27-deep-2`, `--ease-c27` | Generated into the stylesheet, never applied           |

The four `.c27-card*` classes were the exception — they were the fix for DES-2,
not dead weight, and are now in use.

### TEC-8 · Low · No-JS forms explain themselves

Both forms carried a real `method` and `action`, which read as a working no-JS
path. It is not one: Turnstile needs JavaScript to mint a token and both
endpoints reject a missing token, so a no-JS submit returned a blank page of raw
JSON.

**Fixed:** a `<noscript>` block above both forms states that submission needs
JavaScript and gives `talent@cube27.com` as the alternative. Content and
navigation were already preserved without JS — the tab-panel fallback remains
the best piece of no-JS work in the codebase.

### TEC-9 · Note · HowTo no longer produces rich results

Google deprecated `HowTo` rich results in August 2023, so the markup on
_how-it-works_ will not earn SERP treatment. Kept — LLM crawlers parse it
readily and it is well-formed — but do not expect search visibility from it.

### TEC-11 · Note · Dependency health is clean

`pnpm audit` reports no known vulnerabilities at any severity. Only patch-level
updates pending: astro 7.2.0 → 7.2.1, wrangler 4.120.1 → 4.122.0, globals
17.9.0 → 17.11.0. TypeScript 7.0.2 is a major and should be scheduled
separately. The only dependency worth attention is `pdf-lib`, now recorded in
operations §8.4.

---

## What already held up

Worth keeping in the record, because most of the codebase needed no changes.

**Security.** Every rule that matters is enforced server-side, with field
allow-lists derived from the same `ROLE_FAMILIES` array the forms render.
Request bodies are counted rather than trusted, so a missing, false or chunked
`Content-Length` cannot bypass the budget. Resume validation is real: PDFs
rejected for encryption, trailing polyglot content and any of nine forbidden
actions or ten forbidden keys; DOCX archives checked for zip64, encryption, path
traversal, duplicate names, local/central header mismatch, compression bombs,
macros, ActiveX, OLE and external relationships — with the entry cap enforced
twice, because the central directory only describes what it chooses to declare.
Turnstile fails closed on every failure mode. Email is escaped and header-safe.
`.env` and `.dev.vars` are gitignored, untracked and absent from all 36 commits.
The `pages.dev` duplicate is closed with a 308 rather than a 301, so POST bodies
survive the redirect.

**Design.** Exactly one raw hex value across every component, page and layout.
No hover transform or scale anywhere. No font weight above 600. Ink contrast
13.7–15.4:1 and white-on-accent 7.7:1 rising to 9.4:1 on hover — darker, never
lighter. One `h1` per page with no skipped levels. Focus never removed. The
no-JS panel fallback correctly uses `!important` _inside `@layer base`_, because
the cascade reverses layer order for important declarations.

**Technical.** 7.3 KB of JavaScript across four modules — 3.4 KB gzipped — for
the whole site. Titles 52–69 characters and descriptions 106–132, all in range.
`llms.txt` and `llms-full.txt` both ship, and `robots.txt` names GPTBot,
ClaudeBot, PerplexityBot, Google-Extended and Applebot-Extended explicitly. FAQ
schema and the visible accordion come from the same array, so markup cannot
drift from content. Confirmation pages are excluded three ways. `/thank-you/` is
deliberately not `Disallow`ed, because a blocked URL is never fetched and so its
`noindex` is never read — reasoning most sites get wrong. Preview branches force
`noindex` from `CF_PAGES_BRANCH`. JSON-LD escapes `<`, so a value containing
`</script` cannot break out.

---

## Verification

| Command              | Result                                    |
| -------------------- | ----------------------------------------- |
| `pnpm format:check`  | all files match                           |
| `pnpm content:check` | 41 files pass                             |
| `pnpm lint`          | clean                                     |
| `pnpm check`         | 49 files, 0 errors / 0 warnings / 0 hints |
| `pnpm test`          | 18 / 18 pass                              |
| `pnpm build`         | 8 pages, clean                            |
| `pnpm audit`         | no known vulnerabilities                  |

Also verified after the changes: `.text-body` present in built CSS; `is-stuck`
absent from built HTML and CSS; `border-c27-line-control` generated; header
serving `cube27_logo.webp`; `Service` carrying its `@id`; `FAQPage` appearing
once site-wide; no stale references to any removed token, route or export; font
`cmap` coverage diffed against the originals with zero regression; all four
changed colour tokens recomputed against their real backgrounds.

### Not covered

- **No live browser.** Layout and contrast findings come from source and
  computed values, not a rendered page. No Lighthouse run, no Core Web Vitals
  field data. **The font subset and the card padding consolidation both warrant
  a visual smoke test before merging** — coverage and sizes are verified, but
  nobody has looked at the rendered result.
- **No Cloudflare-side verification.** WAF rules, Turnstile widget hostnames,
  Resend domain verification and production environment bindings live outside
  the repository.
- **No penetration testing** against a deployed endpoint. Security findings come
  from code review plus the existing test suite.
- **No real-device testing.** DES-11 is a source-level reading of the responsive
  rules, not an observation of them running.
