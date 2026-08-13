# Talent — Product Invariants

**Status:** Locked baseline
**Prepared:** 13 August 2026
**Supersedes:** the 12 August 2026 revision in full

> This is the highest-priority product reference for copywriting, design and implementation. Presentation may evolve; these decisions may not be changed silently. Priority when documents conflict: **invariants → V1 plan → design system → implementation detail**.

---

## 0. The four rules that govern all public copy

These four override everything else in this document. If a sentence on the website breaks one of them, the sentence is wrong, no matter how true it is.

### 0.1 Naming rule — we, not the company name

Public prose is written in the **first person plural**. "We assess every candidate." "Our engineers run the interview." "Our team handles onboarding."

The company name appears in exactly five places and nowhere else:

1. the header wordmark,
2. the document `<title>` and meta description,
3. the footer legal line,
4. the privacy/contact details,
5. structured data (`schema.org` `legalName`, `Organization`).

It never appears in a heading, a body paragraph, a card label, a table header, an FAQ answer, a form label or a button.

### 0.2 No-contract rule — nothing contractual is public

The following never appear on a public page, in any form, however softened:

- work hardware, laptops, equipment procurement, buyback, depreciation;
- removal, replacement, termination, dismissal, notice periods;
- who the legal employer is, employment contracts, statutory obligations;
- percentages, markups, margins, fees, rate cards, guarantee periods;
- any division-of-responsibility matrix between us and the client.

These are sales-conversation and contract matters. Publishing them makes the site read like a vendor agreement instead of a partner. The website's job is to make a buyer want the conversation, not to pre-negotiate it.

What may be said instead is **benefit-led and vague**: we handle hiring, onboarding, payroll and the employee lifecycle so the client's team gets a person and not a project.

### 0.3 Scope rule — never sound like an engineering-only shop

Role families shown on the site are **illustrative, not exhaustive**. Every list of disciplines carries an explicit opening — "and the roles around them" — and no copy may state or imply that we only staff engineering, or that the listed families are the limit of what we recruit.

### 0.4 Certification rule

We may say we **build the team that takes an organisation to a certification** — ISO 27001, SOC 2, PCI DSS, HIPAA, GDPR and similar.

We may **never** state, imply or visually suggest that we hold any of those certifications ourselves. Framework names are set **typographically** — as a wordmark in the site's own type — and never as an official certification seal, badge, crest or trust mark, because a seal reads as an accreditation claim. Any section showing framework names carries a caption making the distinction explicit.

---

## 1. Locked decisions

1. **Category.** A managed talent and team-building partner. Not a recruitment agency, a freelance marketplace, a job board or a candidate marketplace.

2. **Audiences.** Global employers and candidates. Employer acquisition is the commercial priority; both funnels launch together.

3. **What we do, publicly.** We find, assess and place people, and we handle the employee lifecycle around them — hiring, onboarding, payroll and administration, and ongoing support — so the client's team receives a working person and carries none of the operational overhead. This is stated as a benefit and never elaborated into contractual mechanics (rule 0.2).

4. **Client control.** The client selects the people, directs the work and sets priorities. This is stated positively — the client stays in control of their team — and never expressed as a responsibility matrix or a removal right.

5. **Role scope.** Illustrative broad families, currently: Engineering & Product; Cloud, Infrastructure & Reliability; Data & AI; Security & Compliance; Quality & Delivery; Design & Digital Experience; Leadership. Explicitly open-ended per rule 0.3. Leadership hiring up to CXO — CTO, CIO, CISO, VP Engineering — is an advertised capability, not an afterthought.

6. **Geography and work model.** Global. Remote, hybrid, onsite or relocation-based. No single-country positioning.

7. **Engagement size.** No minimum. One senior specialist, several simultaneous roles, or a team built out over time. The preferred shape is fewer clients with larger or recurring needs, and the copy leans on **scale** — "we help you scale", "build the right team" — rather than on transaction volume.

8. **Assessment sequence.** Screen → role-appropriate technical assessment → technical interview conducted by people who do the work → reference and background verification → curated shortlist with assessment context → the client's own final process.

9. **Differentiator.** Candidates are assessed by people who do the work, and the technical assessment is **recorded** and available as part of the candidate's assessment context. This is the single strongest employer proposition on the site.

10. **AI in the process.** We may say that AI tooling assists sourcing and screening, provided the same sentence makes clear that **people make every decision**. AI is never presented as the thing doing the hiring.

11. **Candidate presentation.** Clients receive a curated shortlist with structured assessment context, never a bulk CV dump.

12. **Commercials are private.** No rate card, no percentages, no markup, no fee structure, no guarantee period on any public page. Commercial terms vary by client, volume, geography, seniority and engagement shape, and are discussed directly.

13. **Mandate control.** Exclusivity is not required. We may decline any requirement we cannot or should not serve.

14. **After the placement.** We stay involved — periodic check-ins and ongoing support through the engagement. Stated as continuity and care, not as an escalation or performance-management process.

15. **Candidate proposition.** A career and an employer, not a recruiter and not a job board. Candidate messaging may highlight global client work, a structured and respectful process, real employment rather than gig work, and long-term career development.

16. **Overseas work.** Some assignments involve overseas work, and we assist with the applicable process where an approved assignment requires it. Overseas travel, sponsorship, relocation and visa approval are **never** guaranteed.

17. **Credibility.** Only verified claims render. `200+ positions filled` and `10+ years serving global customers` require sign-off on exact wording before publication. `150+ brands served` is sourced from the published parent-site figure. Any claim without a source does not appear.

18. **Truthfulness.** No fake candidates, no fake availability, no invented testimonials, no unsupported client logos, no unverified metrics, no "top 1%", no guaranteed hiring speed, no guaranteed placement, no guaranteed visa or travel, and no certification claims about ourselves (rule 0.4).

19. **V1 product.** The website is a lead generator feeding a manual recruiting operation. No accounts, dashboards, portals, ATS, matching engine, public candidate inventory, payment system, scheduling system, payroll application or performance-management software.

20. **Employer form.** A structured hiring-requirement form, not a generic name/email/message contact form.

21. **Candidate form.** A structured application with resume upload, including **LinkedIn and GitHub/portfolio** profile fields.

22. **Technology.** Astro frontend, independent Cloudflare Pages deployment on a subdomain, server-side Pages Functions for both forms, Resend for email delivery, server-side anti-spam verification.

23. **Canonical origin.** `https://talent.cube27.com`. This is settled, not pending: it is committed in `astro.config.mjs`, `wrangler.jsonc` (`SITE_URL`, `ALLOWED_HOSTS`), `src/site-config.ts`, the production Turnstile widget's hostname binding and the footer. Changing it means changing all five together and re-issuing the Turnstile widget.

24. **Assessment recordings.** The recorded assessment may be advertised, but recording delivery to clients must not be implemented until consent, storage, access, retention and deletion controls are decided — see plan §6.3. Recording consent is separate and explicit, never bundled into the application form's privacy acknowledgement, and declining it must not remove a candidate from consideration.

25. **Scope discipline.** V1 validates employer demand and candidate supply before any platform or SaaS product is built.

---

## 2. Design invariants

The visual system is **flat, vibrant and professional** — the Superhuman and Toptal school. These are hard constraints, not preferences.

1. **No hover lift.** No `translateY`, no `scale`, no transform of any kind on hover, anywhere on the site.
2. **Elevation is colour.** A raised surface is expressed as a tint step — a white card on a tinted ground, a tinted card on a white ground — never as a drop shadow.
3. **Shadows are for overlays only.** One shadow token exists and it belongs to things that genuinely float: the stuck header, select menus, the mobile nav sheet. A content card never carries one.
4. **One accent.** A single indigo carries every action, link and active state. Tints carry grouping and rhythm. Nothing else is coloured.
5. **Hairlines.** A 1px line is the default boundary between surfaces.
6. **No gradients** on content surfaces.
7. **Motion budget goes to the nine steps.** With hover motion gone, the process section is where the site spends its animation, and it must be readable without the visitor doing anything.
8. **Accessibility is not traded for style.** Focus is never removed, contrast floors are measured and recorded next to each token, and `prefers-reduced-motion` disables all motion.

---

## 3. Public claim boundaries

**Safe to say:** global talent; we find, assess and place; we handle hiring, onboarding, payroll and the employee lifecycle; assessed by people who do the work; recorded technical assessments; AI-assisted sourcing and screening with human decisions; curated shortlists; the client stays in control of their team; flexible work models; we help you scale; building the right team; leadership and CXO hiring; building the team that takes you to a certification; conditional overseas assistance; ongoing support after the placement; verified credibility figures once signed off.

**Never say:** who the legal employer is; hardware, laptops or equipment terms; removal, replacement, termination or notice; any percentage, fee or markup; any guarantee period; a division-of-responsibility matrix; instant availability; a fixed shortlist or delivery time; guaranteed placement, travel or visa approval; that we hold any certification; anything about a live bench of pre-vetted people.

---

## 4. Pending decisions

Not to be invented during design or implementation:

- Verification and exact wording for `200+ positions filled` and `10+ years serving global customers`.
- Approved logos, testimonials, case studies and client names.
- Candidate-data retention period and resume storage mechanism.
- Assessment-recording consent, storage, access, retention and deletion (invariant 24, plan §6.3). Resolve this together with the two items above — they are the same decision about candidate data, taken three times.
- Whether expected compensation is collected at all, and if so whether it is required.
- Production employer and candidate inboxes, and their internal owners.
- Any public response-time or hiring-speed commitment (currently: none).

---

## 5. Scope-change rule

The following require an explicit product decision and must never be inferred by design or implementation:

- turning the website into a job board or marketplace;
- exposing candidate inventory;
- publishing any pricing or percentage;
- adding a candidate or employer portal;
- building payroll, HRIS, ATS, time-tracking, performance-management or matching software;
- taking responsibility for the client's project outcome;
- guaranteeing visas, travel, placement or delivery speed;
- reintroducing contractual language to a public page (rule 0.2);
- claiming a certification for ourselves (rule 0.4).
