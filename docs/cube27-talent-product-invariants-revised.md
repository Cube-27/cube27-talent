# Talent — Product Invariants

**Status:** Locked implementation baseline
**Updated:** 13 August 2026

This is the highest-priority reference for public copy and product behavior. When documents conflict, use this order: product invariants, V1 plan, content strategy, design system, implementation.

## Product position

1. We are a managed talent and team-building partner for enterprise talent-acquisition and workforce leaders.
2. We are not presented as a marketplace, job board, SaaS platform, freelance network, or transactional recruitment agency.
3. We find, assess, onboard, and support talent while the client selects the people and leads their work.
4. Employer acquisition is the commercial priority. The candidate journey remains complete but secondary.
5. We support one specialist, several concurrent roles, leadership search, or a team built over time.
6. Our scope is global and cross-functional. Role lists are illustrative and always leave room for adjacent disciplines.

## Public message hierarchy

1. **Core promise:** Build the team your business needs.
2. **Primary proof of quality:** role-appropriate recorded assessments and interviews conducted by people who do the work.
3. **Managed support:** hiring, onboarding, payroll, administration, and ongoing employee lifecycle support.
4. **Scale:** we help enterprise teams add specialist capability without building a separate hiring operation around every role.
5. **Control:** clients choose the people, set priorities, and lead the work.

## Public copy rules

### First-person voice

Marketing prose uses “we,” “our team,” and “you.” The Cube27 name appears only in:

- the header logo;
- document titles and metadata;
- contact and privacy details;
- the footer legal identity;
- structured organization data.

It does not appear in marketing headings, paragraphs, cards, FAQs, labels, or buttons.

### Benefit-led, not contractual

Public pages may say that we manage hiring, onboarding, payroll, administration, and the employee lifecycle, and that we coordinate contracts, applicable local labor and IP requirements, culture onboarding, and client-defined performance reviews. They must not publish:

- hardware or equipment terms;
- removal, replacement, termination, dismissal, or notice terms;
- legal-employer or employment-contract mechanics;
- fees, markups, percentages, rate cards, or guarantee periods;
- responsibility matrices or contractual division-of-duty tables.

### Broad talent scope

Engineering, product, cloud, data, AI, quality, delivery, design, operations, business functions, and leadership are examples rather than limits. Compliance is an operating service across hires rather than a recruitment role family. No page describes the company as engineering-only.

### Compliance language

We may say that we manage and coordinate benefit-level workforce compliance across contracts, payroll, applicable local labor and IP requirements, culture onboarding, and client-defined performance reviews. We do not publish contractual mechanics, provide legal advice, imply universal legal liability, or claim certification ownership.

### AI and human judgment

AI may be described as assisting sourcing and screening only when the same context makes clear that people make every hiring decision.

## Approved proof

The following exact claims are approved for public use:

- **200+** — Positions filled
- **150+** — Brands served
- **15+ years** — Serving global clients

Do not add client logos, testimonials, case studies, ratings, delivery-time claims, or other metrics without an approved source.

## Hiring model

The public hiring journey has four named phases and no numeric framing:

- **Define the team:** establish the role, hiring context, outcomes, location, and working model.
- **Find the right people:** source against the agreed brief and confirm interest and fit.
- **Assess real work:** use a role-appropriate recorded assessment, practitioner interview, and verification.
- **Select and start:** present a curated shortlist with assessment context, support the client’s decision, and coordinate onboarding.

The words “nine steps,” numbered stages, and count-based process claims are prohibited. Ongoing support is presented separately as employee lifecycle management.

## Candidate commitments

1. Candidate messaging describes a career relationship rather than gig work or a job-board transaction.
2. Assessments match the discipline and communicate the process clearly.
3. The application retains separate required processing consent and optional future-opportunity retention consent.
4. LinkedIn and GitHub/portfolio remain optional profile fields.
5. Applying never guarantees screening, interview, employment, assignment, travel, relocation, or visa approval.

## Product and technical boundaries

- The site is a lead generator for a manual recruiting operation.
- V1 has no accounts, marketplace, candidate inventory, dashboards, ATS, matching engine, scheduling, payments, or payroll product.
- Existing Astro, Cloudflare Pages Functions, Turnstile, Resend, upload validation, attribution, consent, and redirect behavior remain intact.
- Recorded assessments may be marketed, but any recording workflow requires separately approved consent, storage, access, retention, and deletion controls.
- Canonical origin remains `https://talent.cube27.com`.

## Design invariants

1. Marketing surfaces, section boundaries, and functional controls are square.
2. Colour fields and hairlines establish hierarchy; content panels do not use shadows.
3. Shadows are reserved for genuine overlays.
4. One cobalt accent carries actions, links, focus, and active state.
5. Selective surface gradients follow the design system. No gradient text, decorative pills, hover lifts, or autoplay carousels. The documented image-panel crop zoom is the only hover-scale exception.
6. Meaningful motion is concentrated in the hiring-process rail, image crop zoom, and restrained entry transitions.
7. All content remains readable without JavaScript and with reduced motion.
8. Contrast, focus visibility, keyboard navigation, and responsive readability are not traded for style.

## Change control

The following require an explicit product decision: pricing, guarantees, named customers, new metrics, client logos, testimonials, public candidate inventory, new engagement models, portals, platform features, contractual detail, or responsibility for client delivery outcomes.
