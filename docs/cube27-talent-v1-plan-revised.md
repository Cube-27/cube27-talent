# Talent — V1 Product and Implementation Plan

**Status:** Implementation-ready
**Prepared:** 13 August 2026
**Supersedes:** the 12 August 2026 revision in full
**Stack:** Astro · Cloudflare Pages · Pages Functions · Resend · Turnstile

> Read `cube27-talent-product-invariants-revised.md` first. Its four governing rules — the naming rule, the no-contract rule, the scope rule and the certification rule — bind every word of copy specified here. Visual specification lives in `design-system.md`.

---

## 1. What this is

A managed talent and team-building partner for global companies. We find people, assess them properly, place them, and handle the employee lifecycle around them so the client's team gets a working person rather than a hiring project.

The website has two jobs:

1. generate qualified hiring requirements from employers;
2. build an inbound pool of candidates.

It is a lead-generation and qualification site. Sourcing, screening, placement and coordination are handled manually.

**Reference set for tone and structure:** Toptal, Gun.io, Andela, Turing. Plain, confident, buyer-facing sentences. Short paragraphs. Concrete nouns. No narrative arc, no invented customer stories, no "imagine a world where", no em-dash-heavy essayistic voice. If a sentence would not survive being read aloud to a CTO, it is wrong.

---

## 2. Objectives

**Primary.** Qualified requirements from global companies building teams — particularly companies making several hires, growing over time, or standing up a new function such as a security or leadership team.

**Secondary.** A reusable inbound candidate pool.

**Supporting.**

- Position as a partner that builds teams, not an agency that forwards CVs.
- Land the differentiator: people who do the work assess the candidates, and the technical assessment is recorded.
- Make "we handle the employee lifecycle" land as relief, without a word of contractual detail.
- Advertise breadth — leadership and CXO hiring, security team build-outs, and everything around the core disciplines.
- Capture enough in the forms to qualify without a round of back-and-forth.
- Support LinkedIn paid and organic acquisition on both sides.

**Non-goals for V1.** Accounts, login, dashboards, portals, a candidate marketplace, public candidate inventory, a job board, automated matching, an ATS, scheduling, payments, published pricing, or any claim of instant matching or guaranteed hiring speed.

---

## 3. Positioning and message hierarchy

### 3.1 Core proposition

> **Build the team. Then keep building it.**

### 3.2 Primary differentiator

> Every candidate is assessed by people who do the work — and the technical assessment is recorded, so the client sees how they think, not just what a CV says.

This has to stay operationally true. Technical interviews are conducted by practitioners or technical leadership.

### 3.3 Employer propositions, in priority order

1. **We help you scale.** One specialist or a team of thirty, on the same route.
2. **Assessed by people who do the work**, with recorded technical assessments.
3. **The whole employee lifecycle handled** — hiring, onboarding, payroll and administration, ongoing support. Benefit-led. No mechanics. No contract terms.
4. **Building the right team**, not filling a seat. Curated shortlists, assessment context, no CV dump.
5. **Leadership hiring up to CXO** — CTO, CIO, CISO, VP Engineering, Head of Product.
6. **Build the security team that takes you to certification** — ISO 27001, SOC 2, PCI DSS, HIPAA, GDPR. Per invariant rule 0.4: we build the team, we do not hold the certification.
7. **Breadth.** The disciplines listed are where we start, not where we stop.
8. **You stay in control of your team.** Stated positively, once, and never as a matrix.

### 3.4 Candidate proposition

A career and an employer, not a job board.

- Work with global clients on real products.
- A structured, respectful process where the assessment is relevant to the discipline.
- Real employment, not gig work.
- Long-term development, and opportunities that grow.
- Some assignments involve overseas work, with assistance where an approved assignment requires it.

Never promise overseas travel, a visa, placement, a compensation level or continuous assignment.

### 3.5 AI and recorded assessment

Permitted, and woven into the process steps rather than given its own section:

> AI tooling helps us search and shortlist at volume. Every decision is made by a person, and the technical assessment is recorded.

Never: AI screening, AI matching, AI-selected candidates, or any framing where the tooling is doing the hiring.

### 3.6 Claims not permitted

Guaranteed placement · guaranteed overseas travel or visa approval · guaranteed continuous allocation · instant matching · a fixed shortlist or delivery time · "top 1%" · fake candidate inventory · unsupported logos or testimonials · any certification claim about ourselves · anything on the invariants' never-say list.

---

## 4. Talent scope

Broad, illustrative families. Per invariant rule 0.3 these are a starting point, and every rendering of this list carries the closing line _"and the roles around them — tell us what the team needs."_

| Family                                  | Covers                                                                                 |
| --------------------------------------- | -------------------------------------------------------------------------------------- |
| **Engineering & Product**               | Frontend · Backend · Full-stack · Mobile · Product management · Business analysis      |
| **Cloud, Infrastructure & Reliability** | DevOps · Cloud engineering · Site reliability · Platform · Infrastructure automation   |
| **Data & AI**                           | Data engineering · Analytics · Machine learning · AI engineering                       |
| **Security & Compliance**               | Security engineering · Application security · Security operations · GRC and compliance |
| **Quality & Delivery**                  | QA · Automation · SDET · Performance testing · Delivery and project management         |
| **Design & Digital Experience**         | Product design · UX · UI · Research · Content and commerce platforms                   |
| **Leadership**                          | CTO · CIO · CISO · VP Engineering · Head of Product · Head of Data                     |

Single source of truth: `src/data/roles.ts`. The expertise section, both forms' category options and the server-side validation allow-list all derive from it — `functions/api/candidate-application.ts` imports `ROLE_FAMILY_IDS` directly, so a family cannot exist in a form but not in the validator.

There is no published out-of-scope list. Requirements we cannot serve are declined in conversation, not pre-empted on the website.

---

## 5. Target buyers

- **CTO / VP Engineering / Head of Engineering.** Trigger: expansion, backlog, funding, attrition, a new initiative. Pain: hiring several good people eats leadership time, and recruiter CV volume is poorly qualified.
- **Head of Talent / People.** Trigger: more openings than recruiting bandwidth. Pain: needs a partner who can actually evaluate the work, not just forward profiles.
- **Founder / COO at a funded startup or scale-up.** Trigger: needs a team before it has a hiring function. Pain: everything at once.
- **Agency, consultancy and services leadership.** Trigger: a new client project or a delivery ramp. Pain: slow hiring delays revenue.
- **CISO / security and compliance owner.** Trigger: a certification programme, an audit finding, a customer security requirement. Pain: security hiring is a specialist market they hire in rarely.
- **Board or founder hiring a CXO.** Trigger: a leadership gap. Pain: needs discretion and a real assessment, not a contingency search.

**Strong lead signals:** approved roles · a real sponsor · credible budget · a start window · several hires, recurring need, or one high-value specialist · values assessment over CV volume.

**Deprioritise:** one-off gig work · unpaid trials · unrealistic compensation · discriminatory requirements · anything we cannot assess credibly.

---

## 6. Assessment and hiring workflow

### 6.1 The nine steps — public

This is the site's centrepiece. Source of truth: `src/data/process.ts`. Public headline: **"Nine steps. One team that stays."**

1. **Brief** — role, level, budget range, location and working model, agreed in writing before anything starts.
2. **Search** — network, inbound pool and targeted search; AI tooling assists the search, people make the calls.
3. **Screen** — motivation, communication, availability and what the person actually wants next.
4. **Assessment** — a task matched to the discipline, **recorded**, so the client sees the working and not just the result.
5. **Technical interview** — run by people who do the work, with a written recommendation and the gaps stated.
6. **References** — background and reference verification, with the candidate's separate written consent.
7. **Your interview** — whatever process the client runs. The choice is theirs.
8. **Offer and onboarding** — we handle the offer, the paperwork and the start, so day one is a working day.
9. **Scale and support** — check-ins through the engagement, and the next hire when the team grows.

Steps 8 and 9 carry **no** hardware, no employment-entity language and no removal or replacement language (invariant rule 0.2).

### 6.2 Candidate snapshot — internal

The structured document the client receives: name · target role · location and time zone · relevant experience · core skills · screen summary · assessment outcome and recording · interview summary and rating · communication assessment · reference status · availability · work-location preferences · interviewer recommendation · strengths, risks and notes.

Nothing sensitive beyond what the hiring decision needs.

### 6.3 Assessment recordings — controls required before launch

The recorded assessment is the site's headline differentiator and it is also the most sensitive thing the service creates: a video or screen capture of an identifiable person, shared outside the organisation. The website may advertise it, but **recording delivery must not be implemented until the controls below are decided and written down.** They are a launch blocker, not a nice-to-have.

**Consent.** Recording consent is its own consent, captured separately and explicitly before the assessment starts — never bundled into the general privacy acknowledgement on the application form, and never implied by having applied. It must state what is captured, that it is shared with prospective clients, and how long it is kept. A candidate who declines must still be able to go through the process; the recording is a benefit to them, not a condition of being considered.

**Storage.** Where recordings live, who the processor is, whether the store is in the same jurisdiction as the candidate, and how it is secured at rest.

**Access.** Who internally can open a recording, how a client is given access, whether client access is time-limited, and whether it is viewable-only rather than downloadable. Client access should expire with the hiring decision.

**Retention and deletion.** A defined retention period, an owner for deletion, and a working route for a candidate to withdraw consent and have the recording removed — including copies already shared.

Until these are settled, the safe position is that assessments are recorded for internal assessment purposes and summarised to the client in the snapshot. This is consistent with the pending candidate-data retention and resume-storage decisions in the invariants, and those three should be resolved together.

### 6.4 Assessment principle

Role-appropriate, always. A QA lead, a product designer, an SRE and a CISO do not sit the same test. Generic tests are the thing we are differentiating against.

---

## 7. Operating model — internal only, never public

> Everything in this section is confidential and is excluded from the website by invariant rule 0.2. It is recorded here so operations know how the service runs.

**Our side.** Sourcing and screening · technical assessment and interview · reference and background verification · employment contract and payroll for placed people · onboarding · equipment arrangement · periodic check-ins · formal employment administration.

**Client side.** Role definition · final interview and selection · day-to-day direction and priorities · functional performance feedback · continuation decisions.

**Commercials.** A recurring monthly management percentage linked to monthly compensation, plus a one-time percentage linked to the first month. Percentages are private, vary by engagement, and never appear publicly. Offer acceptance is the commercial confirmation milestone; invoice timing is contractual.

**Replacement, hardware, overseas and immigration** arrangements remain contractual and engagement-specific. None of it is website content.

---

## 8. Information architecture

| Route                   | Purpose                                    | Audience   | Action                    |
| ----------------------- | ------------------------------------------ | ---------- | ------------------------- |
| `/`                     | Position, the nine steps, breadth, routing | Both       | Hire talent / Find a role |
| `/hire-talent/`         | Convert employer traffic                   | Employers  | Submit a requirement      |
| `/join-talent-network/` | Acquire candidates                         | Candidates | Submit an application     |
| `/how-it-works/`        | The nine steps in depth                    | Both       | Funnel CTA                |
| `/expertise/`           | The role families in full                  | Both       | Funnel CTA                |
| `/thank-you/employer/`  | Confirmation                               | Employers  | —                         |
| `/thank-you/candidate/` | Confirmation                               | Candidates | —                         |

Privacy and terms link to the parent site. Confirmation pages are `noindex`.

No programmatic or thin SEO pages. Role-specific and location pages come later, after real operating capability exists.

---

## 9. Page content requirements

### 9.1 Homepage

Sections, in order:

1. **Hero.** The core proposition, two CTAs, and only verified proof figures.
2. **The nine steps.** The centrepiece — the largest and most designed section on the site, on a deep panel, with a rail that both autoplays and responds to interaction. Everything above and below supports it.
3. **What we take off your plate.** Hiring · onboarding · payroll and administration · ongoing support. Four benefit statements. Zero mechanics.
4. **Expertise.** The seven families with the open-ended closing line.
5. **Security teams.** Build the team that takes you to ISO 27001, SOC 2, PCI DSS, HIPAA, GDPR — with the rule 0.4 caption.
6. **Leadership hiring.** CTO, CIO, CISO, VP Engineering. Short and confident.
7. **Two ways in.** Employer and candidate split.
8. **FAQ.**

### 9.2 Hire talent

Who we serve · what we recruit and that it is not limited to it · one hire or a team · how we assess, including the recorded assessment · what we handle after the hire, benefit-led · flexible working models · that commercial terms are tailored and discussed directly · the requirement form · FAQ.

### 9.3 Join the talent network

What we recruit · what the process is and what to expect at each stage · working with global clients · career development · conditional overseas opportunity · the application form, including LinkedIn and GitHub · clear non-guarantee language.

### 9.4 How it works

The nine steps expanded, with what the client sees and does at each stage. Does not simply repeat the homepage.

### 9.5 Expertise

The full taxonomy from §4, with the open-ended line. Each family states how that discipline is assessed.

---

## 10. Forms

### 10.1 Employer requirement form

**Contact:** name (required) · work email (required) · company (required) · job title · country or time zone.

**Requirement:** role families (required, multi-select) · number of hires (required: 1 · 2–5 · 6–10 · 11–25 · 25+) · target start (required) · engagement shape · working arrangement · the requirement itself (required, free text).

**Attribution:** UTM values captured in hidden fields · privacy consent · Turnstile token.

Never ask the employer to state or calculate a fee.

### 10.2 Candidate application form

Full name · email · phone · city and country · role family · target role · core skills · years of experience · **LinkedIn (optional)** · **GitHub or portfolio (optional)** · availability · work preference · open to relocation · resume (required) · free-text note · privacy consent · optional retention consent · Turnstile token.

Do not collect salary history.

### 10.3 Resume handling

PDF and DOCX only · 5 MiB maximum · MIME type, extension and size validated server-side · safe generated filename · never executed, rendered or placed in public assets · never included in logs or analytics payloads.

### 10.4 Acknowledgements

Confirm receipt and that a person will review it. Promise no timeline. Candidate acknowledgement states plainly that submitting a profile does not guarantee screening, an interview, employment or an assignment.

---

## 11. Technical implementation

Unchanged from the shipped build and not part of this rebuild:

- Astro static site, independent Cloudflare Pages deployment on the talent subdomain.
- `functions/api/employer-lead.ts` and `functions/api/candidate-application.ts` — method and content-type checks, body-size limits, server-side Turnstile verification, field validation and allow-lists, submission reference, structured internal email via Resend, best-effort acknowledgement, minimal JSON response.
- Shared helpers in `functions/_shared/` for validation, documents, request bodies, responses and Turnstile.
- `src/lib/form-client.ts` for progressive-enhancement submission.
- Environment: `RESEND_API_KEY`, `RESEND_FROM`, `EMPLOYER_LEADS_TO`, `CANDIDATE_APPLICATIONS_TO`, `TALENT_REPLY_TO`, `TURNSTILE_SECRET_KEY`.

**Failure rules.** Internal delivery is critical — never show success if it fails. Acknowledgement failure never discards a delivered lead. Provider errors and secrets never reach the browser.

**The only server-side change in this rebuild** is the `github` field on the candidate endpoint: read alongside `linkedin`, validated with the existing optional-line check, and added to the internal email rows.

---

## 12. Privacy, analytics and quality

**Privacy.** HTTPS only · server-side validation · Turnstile verified server-side · no secrets in client JS · no PII in analytics · no resume content in logs · no salary history · explicit consent for candidate information shared with prospective clients.

**Analytics events.** Landing-page visit, form start and successful submission, per funnel, plus CTA clicks by funnel. Never send PII, compensation, resume data or free-text requirements to advertising analytics.

**Quality bar.** Mobile and desktop both fully usable · keyboard-accessible forms with proper labels and validation messages · no horizontal overflow at any width · minimal client-side JavaScript · optimised assets · confirmation pages `noindex` · success shown only after critical delivery · every form live-tested from outside the development environment before launch.

---

## 13. Build phases

**Phase 1 — documents.** This plan, the invariants and the design system, rewritten and approved. _(Complete.)_

**Phase 2 — design system.** `tokens.css` and `globals.css` replaced with the flat indigo system; the flat rules enforced in the base layer; every consumer of a removed token updated in the same pass.

**Phase 3 — the nine steps.** `ProcessRail.astro` built: deep panel, filling progress rail, cross-fading panels, autoplay that stops on first interaction, full keyboard and ARIA support ported from the previous component, and a readable stacked fallback under reduced motion and without JavaScript.

**Phase 4 — content.** `roles.ts`, `process.ts`, `faqs.ts` rewritten; homepage rebuilt to the §9.1 inventory; the security and leadership sections built; the four content pages rewritten; every string checked against the four governing rules.

**Phase 5 — forms.** GitHub field added client and server side; both forms restyled flat; no other server-side change.

**Phase 6 — verification.** §14.

---

## 14. Launch checklist

**Content**

- [ ] No company name in any heading, paragraph, label, table header, FAQ answer or button.
- [ ] No hardware, removal, replacement, termination, legal-employer, percentage or guarantee language anywhere public.
- [ ] Every role list carries the open-ended line.
- [ ] The security section claims team-building, never accreditation, and framework names are typographic, not seals.
- [ ] Every credibility figure is verified or hidden.
- [ ] Copy reads like Toptal or Gun.io, not like a generated essay.
- [ ] Assessment-recording consent, storage, access, retention and deletion decided and written down (§6.3) **before** any recording is delivered to a client.

**Design**

- [ ] No transform on hover anywhere in `src/`.
- [ ] No shadow on a content card.
- [ ] Every token's contrast ratio measured and recorded.
- [ ] Nine-step section readable without interaction, and under reduced motion, and without JavaScript.

**Technical**

- [ ] Production build passes.
- [ ] Both forms live-tested, candidate with PDF and DOCX.
- [ ] GitHub value reaches the internal email; an invalid URL is rejected server-side.
- [ ] Turnstile validated server-side.
- [ ] Error and success states tested.
- [ ] No PII in analytics.
- [ ] No horizontal overflow at 375, 768 and 1440px.

---

## 15. Later, not now

ATS or CRM integration · internal candidate database and search · employer or candidate dashboards · assignment and timesheet tooling · payroll or HRIS integration · automated matching · interview scheduling · job pages · a referral programme · skill and location landing pages · salary and market intelligence · client case studies · retention reporting.

Each requires an explicit decision under the invariants' scope-change rule.
