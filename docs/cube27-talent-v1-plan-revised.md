# Cube27 Talent — V1 Product and Implementation Plan (Revised)

**Status:** Implementation-ready planning baseline  
**Prepared:** 12 August 2026  
**Working public name:** Cube27 Talent  
**Recommended URL:** `talent.cube27.com`  
**Primary stack:** Astro, Cloudflare Pages, Cloudflare Pages Functions, Resend

> This document intentionally excludes visual design direction. It defines the business model, service boundaries, information architecture, content requirements, forms, operating workflows, technical implementation, launch criteria, and unresolved decisions. Visual identity, page composition, typography, colour, imagery, animation, and component styling are separate design decisions.

---

## 1. Executive summary

Cube27 Talent will be a specialist **managed engineering talent and staffing vertical** within Cube27 for global companies that need software, product, design, QA, DevOps, mobile, enterprise content management, or e-commerce engineering talent.

The website has two acquisition goals:

1. Generate qualified hiring requirements from employers.
2. Build an inbound talent pool of candidates interested in employment with Cube27 and assignment to suitable client opportunities.

V1 is a lead-generation and qualification website, not a marketplace or staffing SaaS platform. Recruitment, screening, employment, payroll, client matching, and ongoing coordination will initially be handled manually by Cube27.

The operating model is:

1. A client submits a requirement for one senior hire, several positions, or an ongoing team build-out.
2. Cube27 qualifies the mandate and may accept or reject it.
3. Cube27 sources candidates and runs its screening process.
4. Cube27 presents a small, curated shortlist with structured candidate assessments.
5. The client conducts its preferred final interview process and selects the candidate.
6. Cube27 employs the selected resource and manages payroll and employment administration.
7. The client pays Cube27 under a commercial model containing:
   - a recurring monthly margin/management percentage linked to the resource's monthly compensation; and
   - an additional one-time percentage linked to the first month's salary/compensation.
8. The client retains control over performance assessment, assignment continuation, and whether a resource should remain on the engagement.
9. Cube27 handles the formal employment/payroll consequences of client decisions because Cube27 is the employing entity.
10. Cube27 performs post-placement check-ins and manages the staffing relationship throughout the engagement.

The V1 website succeeds if it creates qualified employer demand and candidate supply while making Cube27's technical screening, employment model, payroll handling, and managed staffing proposition easy to understand.

---

## 2. Product objectives

### 2.1 Primary objective

Generate qualified requirements from global companies seeking engineering and digital-product talent, especially companies making multiple hires or building teams over time.

### 2.2 Secondary objective

Build a reusable inbound candidate pool that Cube27 can screen, employ, and deploy against suitable client requirements.

### 2.3 Supporting objectives

- Establish Cube27 as a specialist engineering talent partner rather than a generic recruitment agency.
- Communicate the differentiator: **technical talent is screened by technical people**.
- Explain that Cube27 can become the employing/payroll layer while clients retain functional control over the resource's work and performance.
- Capture enough information to qualify employer and candidate submissions without immediate back-and-forth.
- Support LinkedIn paid and organic acquisition for both employer and candidate funnels.
- Launch independently on a Cube27 subdomain without disrupting the existing corporate website.
- Keep the V1 implementation simple enough to launch quickly.
- Preserve a technical foundation that can later support job pages, CRM/ATS integrations, candidate records, dashboards, or automation without building them now.

### 2.4 V1 non-goals

V1 does **not** include:

- Employer or candidate accounts.
- Login, authentication, dashboards, or portals.
- A searchable public candidate marketplace.
- Public candidate inventory or fake availability cards.
- A public job board or self-service job-posting system.
- Automated candidate matching.
- An ATS built inside the website.
- Automated interview scheduling.
- Online billing or payments.
- Public pricing percentages or salary markups.
- A client performance-management platform.
- Time tracking software.
- Payroll software built into the website.
- Immigration case-management software.
- Claims of instant matching, 48-hour delivery, or guaranteed hiring speed.

---

## 3. Business and service model

### 3.1 Category

Cube27 Talent is a **managed engineering staffing and talent partner**.

It combines:

- requirement qualification;
- candidate attraction and sourcing;
- HR screening;
- technical assessment;
- technical interviews;
- reference/background checks;
- curated candidate presentation;
- Cube27 employment and payroll;
- ongoing staffing coordination; and
- replacement/redeployment support according to the commercial agreement.

The public positioning should avoid presenting Cube27 as merely a CV-forwarding recruitment agency.

### 3.2 Relationship between Cube27, client, and resource

**Cube27**

- Sources and screens candidates.
- Makes the employment offer to the selected resource.
- Employs the resource.
- Runs payroll and normal employment administration.
- Provides or procures approved work hardware under the agreed hardware policy.
- Conducts reference/background verification.
- Supports agreed immigration/visa processes where an overseas assignment requires it and where legally/operationally possible.
- Performs periodic employment and engagement check-ins.
- Handles formal employment actions.

**Client**

- Defines role requirements and expected outcomes.
- Conducts the final interview process it considers necessary.
- Selects or rejects candidates.
- Directs the resource's day-to-day project work.
- Conducts or owns functional performance review for work performed on the client engagement.
- Can request removal of a resource or termination of the resource's assignment.
- Retains practical control over whether a resource continues on its engagement, subject to the signed commercial and employment arrangements.

**Resource**

- Is employed and paid by Cube27.
- Works on the assigned client's role/project according to the agreed working model.
- Remains subject to Cube27 employment policies and applicable law.
- Receives client project direction and performance feedback while on assignment.

### 3.3 Client termination / “right to fire” operational rule

The commercial proposition may state that the client retains the right to reject, remove, or discontinue a resource based on performance or business need.

Because Cube27 is the legal employer, implementation and contracts should distinguish between:

- **client assignment termination/removal**, which the client can request; and
- **formal employment termination**, which Cube27 processes under its employment agreement and applicable law.

The website should communicate client control without making inaccurate legal claims about who performs the formal employment act.

### 3.4 Commercial model

The exact percentages are private and may vary by client, volume, seniority, geography, role, or agreement.

V1 commercial structure:

- No public rate card.
- No public markup percentage.
- A recurring monthly Cube27 margin/management fee linked to the resource's monthly compensation.
- A one-time additional fee linked to the first month's salary/compensation.
- Final compensation, billing basis, taxes, statutory costs, insurance, hardware, travel, visa, and other pass-through items must be documented in the client agreement where relevant.
- No explicit minimum number of hires.
- A high-value single senior hire is acceptable.
- Preferred commercial shape: fewer clients with substantial or recurring staffing needs rather than many one-off freelance requests.
- Cube27 may reject requirements that are unrealistic, unethical, technically outside its screening capability, operationally unsuitable, or commercially unattractive.
- Exclusivity is not required by default.

### 3.5 Offer and commercial trigger

Candidate selection remains client-led. Once the client approves a candidate, Cube27 issues the employment offer.

The previously agreed **offer-acceptance milestone** remains the point at which the placement is considered commercially confirmed. Exact invoice timing for the first-month fee and recurring monthly margin must be defined in the service agreement before launch and should not be invented in public website copy.

### 3.6 Replacement model

Replacement support is part of the service direction.

Recommended policy direction:

- replacement rather than cash refund;
- exact guarantee period and exclusions documented contractually;
- 90 days remains the proposed default until approved;
- no public numeric guarantee until the policy is final.

If a client requests resource removal, Cube27 should have an agreed process for transition, replacement search, final payroll treatment, hardware recovery, and any notice obligations.

---

## 4. Talent and role scope

V1 remains tightly focused on engineering and digital-product talent.

### 4.1 Software engineering

- Frontend engineering
- Backend engineering
- Full-stack engineering
- Mobile development
  - iOS
  - Android
  - React Native
  - Flutter
  - other mobile stacks Cube27 can assess credibly
- Data engineering
- AI / ML engineering
- Integration engineering
- Engineering leadership where Cube27 can evaluate the role credibly

### 4.2 Quality engineering

- Manual QA
- QA automation
- SDET
- Performance testing
- Test engineering leadership

### 4.3 Cloud and infrastructure

- DevOps
- Cloud engineering
- Site reliability engineering
- Platform engineering
- Infrastructure automation

### 4.4 Product

- Product management
- Product ownership
- Business analysis directly connected to digital-product delivery

### 4.5 Design

- Product design
- UX design
- UI design
- UX research

### 4.6 Enterprise content management / ECMS

- Enterprise Content Management System specialists
- CMS implementation developers
- Enterprise content platform engineers
- Content workflow/integration specialists
- Platform-specific specialists only where Cube27 can screen the technology credibly

### 4.7 E-commerce and commerce CMS

- E-commerce developers
- E-commerce CMS/platform engineers
- Headless commerce engineers
- Commerce integration specialists
- Frontend/storefront specialists
- Platform-specific specialists where Cube27 has credible screening coverage

Potential platform examples may be added later only after Cube27 confirms actual recruiting and screening capability for them.

### 4.8 Out of scope by default

- Sales
- Marketing
- Finance
- General HR
- Administration
- Generic virtual assistants
- Non-technical mass hiring

Adjacent roles can be accepted case-by-case if Cube27 can recruit and assess them credibly.

---

## 5. Target customers and buyer personas

These are initial market hypotheses for LinkedIn acquisition and sales qualification.

### 5.1 CTO / VP Engineering / Head of Engineering

**Typical company:** SaaS, product, technology-enabled, e-commerce, fintech, AI, platform, or digital business.  
**Trigger:** Team expansion, delivery backlog, new funding, attrition, product launch, or a new engineering initiative.  
**Problem:** Hiring several good technical people consumes leadership time and recruiter-generated CV volume is often poorly qualified.  
**Relevant proposition:** Cube27 handles sourcing, technical screening, employment, and payroll while the client controls the work and final resource decisions.

### 5.2 Head of Talent / Talent Acquisition / People

**Typical company:** Growth-stage organisation with several technical openings or insufficient recruiting bandwidth.  
**Problem:** Internal recruiters need an external partner that can both evaluate technical ability and simplify employment administration.  
**Relevant proposition:** Structured HR + technical screening, curated profiles, and a managed employment/payroll layer.

### 5.3 Agency / consultancy / technology-services leadership

**Typical buyer:** Founder, delivery director, engineering director, resource manager, COO.  
**Trigger:** New client project, fast delivery ramp, capability gap, or temporary team expansion.  
**Problem:** Slow hiring can delay revenue and delivery commitments.  
**Relevant proposition:** Cube27 can help build and employ the required delivery team while the client retains project control.

### 5.4 Funded startup / scale-up founder or COO

**Trigger:** Company needs to build a team before it has a mature recruiting/payroll operation in the talent market.  
**Relevant proposition:** Cube27 can handle the people acquisition and employment layer while the client focuses on product and execution.

### 5.5 Later segment: enterprise / GCC / distributed engineering expansion

Potentially attractive but may introduce heavier procurement, legal, security, compliance, vendor-management, and scale requirements. V1 should not be overbuilt around enterprise needs.

### 5.6 Strong lead characteristics

- Approved or imminent technical roles.
- Real decision-maker or sponsor.
- Credible budget.
- Clear start window.
- Willingness to use Cube27 as employing/payroll entity.
- Multiple hires, recurring needs, or one high-value specialist role.
- Appreciation for technical vetting rather than raw CV volume.

### 5.7 Leads to reject or deprioritise

- One-off gig work better suited to freelancer marketplaces.
- Unpaid trials.
- Non-technical mass hiring.
- Unrealistic compensation.
- Roles with discriminatory or unethical requirements.
- Roles Cube27 cannot technically assess.
- Clients demanding legal/compliance arrangements Cube27 is not equipped to provide.
- Clients unwilling to follow the agreed managed staffing/employment structure.

---

## 6. Positioning and message hierarchy

This section defines message strategy, not final copy or design.

### 6.1 Core proposition

> Engineering talent for global companies.

### 6.2 Primary differentiator

> Engineers screen engineers.

This must remain operationally true: technical interviews are conducted by qualified Cube27 employees, technical leadership, or the CEO.

### 6.3 Primary employer outcome

> Build your engineering team without carrying the full sourcing, screening, employment, and payroll burden yourself.

### 6.4 Supporting employer propositions

- Curated candidates rather than mass CV forwarding.
- HR screening plus role-appropriate technical assessment and technical interview.
- One partner for software, mobile, QA, DevOps, product, design, enterprise content systems, and e-commerce technology roles.
- Cube27 employs and payrolls selected resources.
- Client retains control over final selection, project work, performance review, and resource continuation.
- Remote, hybrid, onsite, and relocation requirements can be considered.
- Single senior roles and multi-person team build-outs are both supported.
- Commercial pricing is tailored rather than published publicly.

### 6.5 Candidate proposition

Candidate messaging should sell Cube27 as an employer and career platform, not merely a recruiter.

Core themes:

- Access to suitable opportunities with global clients.
- Structured technical hiring process.
- Strong employment terms and professional employment administration.
- Stable Cube27 payroll while working on client assignments.
- Opportunities for long-term career development.
- Potential overseas assignments where business requirements permit.
- Visa/process assistance for approved overseas opportunities where Cube27 can legally and operationally support it.
- Equipment/work-hardware support under Cube27 policy.

Do not promise overseas travel, visas, client placement, a minimum compensation level, or continuous assignment availability.

### 6.6 Credibility direction

Approved/identified credibility themes now include:

- **200+ positions filled over the years.**
- More than a decade of experience serving global customers, subject to final approved wording/evidence.
- Existing internal HR and technical teams involved in screening.
- Technical interviews conducted by real engineering practitioners/leadership.
- Candidate employment and payroll managed by Cube27.
- Strong candidate employment terms.
- Potential overseas opportunities and visa support when applicable.

Before public launch, factual proof should be checked for every numeric, superlative, logo, testimonial, and client claim.

The phrase **“best-in-class employment terms”** should be treated as a positioning ambition unless Cube27 can substantiate it with concrete benefits or market comparisons. Prefer specific benefits over an unsupported superlative.

### 6.7 Claims not permitted in V1

- Guaranteed placement.
- Guaranteed overseas travel or visa approval.
- Guaranteed continuous client allocation.
- Instant matching.
- Fixed delivery time unless operationally proven.
- “Top 1%” or similar unsupported talent-quality claims.
- Fake candidate inventory.
- Unsupported client logos or testimonials.
- Unverified employment-benefit superlatives.

---

## 7. Screening and hiring workflow

### 7.1 Employer-side workflow

1. Client submits requirement.
2. Cube27 qualifies scope, budget, location, timing, work model, and employment feasibility.
3. Cube27 confirms whether it will accept the mandate.
4. Cube27 sources/reviews candidates.
5. HR interview.
6. Coding or role-appropriate technical assessment.
7. Technical interview by Cube27 technical staff/leadership/CEO.
8. Reference/background verification.
9. Cube27 prepares a curated candidate snapshot.
10. Client conducts its preferred final process.
11. Client selects a candidate.
12. Cube27 issues employment offer.
13. Candidate accepts offer.
14. Cube27 completes employment/payroll onboarding.
15. Hardware and assignment setup are completed where applicable.
16. Candidate starts client engagement.
17. Client owns work direction and performance assessment.
18. Cube27 runs periodic check-ins and employment administration.

### 7.2 Candidate snapshot

The employer should receive a concise, structured decision document containing fields such as:

- Candidate name.
- Target role.
- Location/time zone.
- Relevant experience.
- Core skills.
- Cube27 HR assessment summary.
- Technical-assessment outcome.
- Technical-interview summary/rating.
- Communication assessment.
- Reference/background status.
- Availability/notice period.
- Expected compensation or agreed cost basis where appropriate.
- Work-location/relocation preferences.
- Interviewer recommendation.
- Concise strengths, risks, and notes.

Do not expose sensitive information that is not necessary for the client's hiring decision.

### 7.3 Assessment principle

The assessment must be role-appropriate. Developers, QA engineers, DevOps engineers, product managers, designers, ECMS specialists, and commerce-platform specialists should not receive the same generic test.

---

## 8. Employment, payroll, performance, and resource management

### 8.1 Cube27 responsibilities

- Employment contract with resource.
- Payroll processing.
- Normal employment records and administration.
- Statutory/employment obligations applicable to Cube27 as employer.
- Resource onboarding into Cube27.
- Approved hardware process.
- Internal HR contact.
- Periodic resource check-ins.
- Formal employment actions.

### 8.2 Client responsibilities

- Project onboarding.
- Role expectations.
- Work allocation.
- Delivery priorities.
- Day-to-day work supervision.
- Functional performance feedback/reviews.
- Escalation of performance issues.
- Decision on whether the resource should continue on the client assignment.

### 8.3 Performance process

V1 does not need software for performance management, but the operational process should be defined before the first placement.

Recommended manual process:

- Client provides direct ongoing feedback.
- Cube27 schedules periodic check-ins with client and resource.
- Material concerns are documented.
- Cube27 and client agree remediation, replacement, or assignment termination as appropriate.
- The client may request removal of a resource.
- Cube27 handles formal employment consequences according to contract and law.

---

## 9. Hardware policy

### 9.1 Agreed direction

Cube27 will arrange/provide required work hardware for employed resources.

Commercial direction:

- Hardware is procured by Cube27.
- The client is charged the **actual hardware cost**, with no hidden hardware markup unless separately agreed.
- Hardware remains subject to Cube27 asset/control policy during employment/assignment.
- At the end of employment/assignment, Cube27 buys the hardware back at an agreed depreciated value, subject to the minimum-period rule.
- Minimum period for the standard buyback model: **1 year / 12 months**.

### 9.2 Pending hardware mechanics

The operating agreement still needs to define:

- who economically owns the hardware during the engagement;
- depreciation schedule/formula;
- treatment if employment ends before 12 months;
- accidental damage, loss, theft, insurance, repairs, and warranties;
- accessories/peripherals;
- international shipping/import duties;
- return logistics;
- security wipe and asset disposal;
- whether clients can instead provide their own equipment.

These details should be resolved contractually before the first placement but do not need to block website design.

---

## 10. Overseas assignments and visa assistance

Cube27 may use overseas opportunity as a candidate attraction benefit, but it must be framed as conditional.

Permitted direction:

> Selected roles may create opportunities to work with clients overseas. Where an approved assignment requires relocation or travel, Cube27 can assist with the applicable visa/process requirements.

Do not promise:

- visa approval;
- overseas travel for every employee;
- relocation within a fixed timeframe; or
- sponsorship in every country.

Exact visa sponsorship, legal entity, cost allocation, travel, insurance, tax, and immigration responsibilities remain engagement-specific.

---

## 11. Information architecture

Recommended V1 routes:

| Route                   | Primary purpose                            | Audience               | Primary action                     |
| ----------------------- | ------------------------------------------ | ---------------------- | ---------------------------------- |
| `/`                     | Explain Cube27 Talent and route visitors   | Both                   | Start hiring / Join talent network |
| `/hire-talent/`         | Convert employer traffic                   | Employers              | Submit hiring requirement          |
| `/join-talent-network/` | Acquire candidate profiles                 | Candidates             | Submit application                 |
| `/how-it-works/`        | Explain screening + managed staffing model | Employers / candidates | Relevant funnel CTA                |
| `/expertise/`           | Explain supported role families            | Both                   | Relevant funnel CTA                |
| `/privacy/`             | Explain data processing                    | Both                   | —                                  |
| `/terms/`               | General website/service terms as approved  | Both                   | —                                  |
| `/thank-you/employer/`  | Employer submission confirmation           | Employers              | —                                  |
| `/thank-you/candidate/` | Candidate submission confirmation          | Candidates             | —                                  |

Optional later routes:

- `/hire/mobile-developers/`
- `/hire/devops-engineers/`
- `/hire/qa-engineers/`
- `/hire/product-designers/`
- `/hire/ecommerce-developers/`
- `/hire/ecm-developers/`
- technology/platform-specific SEO pages after genuine operating capability exists.

Do not create programmatic pages simply to inflate site size.

---

## 12. Page content requirements

### 12.1 Homepage

Must establish:

- Cube27 Talent category.
- Global employer scope.
- Role families.
- Technical-screening differentiation.
- Cube27 employment/payroll model.
- Client control over resource performance and continuation.
- High-level hiring process.
- Candidate proposition.
- Credibility proof once approved.
- Clear routes to employer and candidate forms.

### 12.2 Hire Talent

Must explain:

- Who Cube27 serves.
- What roles Cube27 supports.
- Single hire vs multi-hire/team build-out.
- Cube27 sourcing and screening process.
- What a curated candidate profile contains.
- Cube27 employment and payroll handling.
- Client responsibility for project direction and performance assessment.
- Remote/hybrid/onsite/relocation flexibility.
- Tailored commercial terms without public percentages.
- Replacement direction only after terms are approved.
- Employer requirement form.
- FAQ.

### 12.3 Join Talent Network

Must explain:

- Candidate role scope.
- Screening process.
- Cube27 employment model.
- Global client opportunities.
- Employment/career proposition.
- Conditional overseas/visa-support opportunity.
- Hardware support at role/assignment level.
- Application form.
- Clear non-guarantee language.

### 12.4 How It Works

Show both flows clearly:

**Employer:** requirement → qualification → screening → curated shortlist → client final interview → selection → Cube27 employment/payroll → deployment → ongoing check-ins.

**Candidate:** application → review → HR screen → technical assessment/interview → reference/background check → matching → client interview → Cube27 offer → employment onboarding → client assignment.

### 12.5 Expertise

Use the complete role taxonomy from Section 4. Keep the role list centrally configurable for reuse in forms and content.

---

## 13. Employer acquisition funnel

### 13.1 Funnel

```text
LinkedIn paid/organic, referrals, direct outreach, search
  → employer landing page
  → service/process understanding
  → structured requirement form
  → server-side validation
  → internal Cube27 notification
  → acknowledgement to employer
  → manual qualification
  → accepted hiring mandate
```

### 13.2 Employer form fields

**Contact**

- Name — required.
- Work email — required.
- Phone — optional.
- Company — required.
- Company website — optional.
- Job title — optional.
- Country/time zone — recommended.

**Requirement**

- Role category/categories — required, multi-select.
- Role title(s) / requirement — required.
- Number of people — required: `1`, `2–5`, `6–10`, `11–25`, `25+`.
- Seniority — optional/multi-select.
- Target start — required: `ASAP`, `<30 days`, `1–3 months`, `planning ahead`.
- Work model — remote, hybrid, onsite, relocation, flexible.
- Primary work location/time-zone requirements — optional.
- Expected engagement duration — optional.
- Compensation/budget range — optional, private.
- Required skills/stack — free text.
- Additional context — free text.

**Attribution/consent**

- Marketing/source fields such as UTM values captured server-side or hidden.
- Privacy acknowledgement/consent according to approved policy.
- Turnstile token.

Do not ask the employer to calculate Cube27's fee or markup.

### 13.3 Employer acknowledgement

Acknowledge receipt and explain that Cube27 will review the requirement. Do not promise a shortlist date until operational data supports one.

---

## 14. Candidate acquisition funnel

### 14.1 Funnel

```text
LinkedIn paid/organic, referrals, search
  → candidate proposition
  → application
  → server-side validation + resume upload handling
  → internal Cube27 notification
  → acknowledgement
  → manual review
  → screening/matching when appropriate
```

### 14.2 Candidate form fields

- Full name — required.
- Email — required.
- Phone — required or strongly recommended.
- Current location — required.
- Primary role category — required.
- Primary role/title — required.
- Years of experience — required.
- Core skills — required.
- Current company — optional.
- LinkedIn URL — recommended.
- GitHub / portfolio / personal site — optional and role-dependent.
- Notice period / availability — required.
- Expected compensation — configurable; do not ask current salary by default.
- Work preference — remote/hybrid/onsite/flexible.
- Open to relocation — yes/no.
- Open to overseas assignment — yes/no.
- Resume — required.
- Candidate notes / desired roles — optional.
- Privacy acknowledgement.
- Turnstile token.

### 14.3 Resume handling

Recommended V1 limits:

- PDF and DOCX only.
- Maximum 5 MiB.
- Validate MIME type, extension, and size server-side.
- Generate a safe internal filename.
- Never execute or render uploads.
- Never place uploads in public Astro assets.
- Avoid including resumes in analytics/log payloads.

### 14.4 Candidate acknowledgement language

Submission does not guarantee screening, interview, employment, client assignment, visa/relocation, timing, or compensation.

---

## 15. Manual operating workflow

### 15.1 Employer lead handling

1. Lead arrives in shared employer-leads inbox.
2. Assign internal owner.
3. Review scope, buyer authority, budget, role clarity, work model, location, staffing duration, and employment feasibility.
4. Accept / reject / request additional information.
5. For accepted mandates, create internal role brief.
6. Agree commercial terms before candidate placement.
7. Begin candidate sourcing and screening.

### 15.2 Candidate handling

1. Application arrives in candidate inbox.
2. Review for scope fit.
3. Store in the approved internal recruiting workflow/database/spreadsheet/ATS used operationally; website itself does not become the ATS.
4. Tag by role, skills, level, location, notice period, expected compensation, relocation/overseas preference.
5. Screen when appropriate for a mandate or reusable talent pool.
6. Keep candidate communication respectful and realistic.

### 15.3 Placement/onboarding workflow

1. Client approves candidate.
2. Cube27 confirms final employment/assignment terms.
3. Cube27 issues employment offer.
4. Candidate accepts.
5. Commercial milestone is recorded.
6. Employment documentation completed.
7. Payroll setup completed.
8. Background/reference checks confirmed.
9. Hardware arranged.
10. Client project onboarding completed.
11. Resource starts assignment.
12. Cube27 schedules post-start check-ins.

---

## 16. Technical implementation

### 16.1 Architecture

Recommended V1:

- Astro static site.
- Independent Cloudflare Pages deployment for the Talent subdomain.
- Cloudflare Pages Functions for form endpoints.
- Resend for internal notification and acknowledgement email.
- Cloudflare Turnstile for anti-spam protection.
- No database required for V1 if email/manual operations are acceptable.
- No frontend framework dependency unless a specific form interaction genuinely needs it.

### 16.2 Suggested project structure

```text
src/
  components/
    EmployerLeadForm.astro
    CandidateApplicationForm.astro
  data/
    roles.ts
    faqs.ts
    credibility.ts
  pages/
    index.astro
    hire-talent.astro
    join-talent-network.astro
    how-it-works.astro
    expertise.astro
    privacy.astro
    terms.astro
    thank-you/
      employer.astro
      candidate.astro

functions/
  api/
    employer-lead.ts
    candidate-application.ts
```

Adapt this to the existing Cube27 repository structure instead of forcing a new structure if one already exists.

### 16.3 Employer endpoint

`POST /api/employer-lead`

Sequence:

1. Validate request method/content type.
2. Apply body-size limit.
3. Validate Turnstile server-side.
4. Validate and normalise fields.
5. Reject malformed/spam submissions.
6. Generate submission reference.
7. Build structured internal email.
8. Send critical internal notification via Resend.
9. Send best-effort acknowledgement.
10. Return minimal JSON success response.

### 16.4 Candidate endpoint

`POST /api/candidate-application`

Sequence:

1. Validate method and multipart request.
2. Apply total request/body-size limit.
3. Validate Turnstile.
4. Validate fields.
5. Validate resume file.
6. Generate submission reference and safe filename.
7. Build structured internal notification.
8. Deliver resume using the selected secure V1 approach.
9. Send internal email via Resend.
10. Send best-effort acknowledgement.
11. Return minimal JSON success response.

### 16.5 Environment variables

At minimum:

```text
RESEND_API_KEY
RESEND_FROM
EMPLOYER_LEADS_TO
CANDIDATE_APPLICATIONS_TO
TALENT_REPLY_TO
TURNSTILE_SECRET_KEY
```

Do not commit production secrets to the repository.

### 16.6 Email subjects

Examples:

```text
[Cube27 Talent][Employer][6–10 hires] Company Name — ABC123
[Cube27 Talent][Candidate][Mobile Developer] Candidate Name — XYZ456
```

Internal emails should be structured for manual triage.

### 16.7 Failure rules

- Internal lead/application delivery is critical.
- Do not show success if the critical internal notification fails.
- Acknowledgement-email failure must not discard a successfully delivered lead.
- Never expose Resend/Cloudflare secrets or raw provider errors to the browser.

---

## 17. Privacy, employment data, and security

Before production launch, Cube27 should finalise:

- Legal entity name used for employment and client contracts.
- Privacy-policy owner/contact.
- Candidate-data retention period.
- Deletion/access process.
- Resume-storage process.
- Cross-border data handling where relevant.
- Employee privacy notices.
- Background/reference-check consent.
- Marketing-cookie/LinkedIn tracking consent approach.
- Rules for sharing candidate information with clients.

Website requirements:

- HTTPS only.
- Server-side validation.
- Turnstile verification.
- No secrets in client JS.
- No PII in analytics events.
- No resume content in logs.
- No unnecessary salary history collection.
- Clear consent/notice for candidate information passed to prospective clients.

---

## 18. Analytics and acquisition measurement

Employer acquisition is the commercial priority, but candidate acquisition launches simultaneously.

Recommended tracked events:

- Employer landing-page visit.
- Employer form start.
- Employer successful submission.
- Candidate landing-page visit.
- Candidate form start.
- Candidate successful submission.
- CTA click by funnel.

Operational metrics outside the website:

**Employer**

- Qualified employer leads.
- Accepted mandates.
- Roles opened.
- Average roles per client.
- Interview-to-selection rate.
- Placement rate.
- Time to shortlist.
- Time to placement.
- Average monthly gross margin per deployed resource.
- Client retention / repeat mandates.

**Candidate**

- Applications.
- In-scope candidates.
- HR-screen pass rate.
- Technical-assessment pass rate.
- Technical-interview pass rate.
- Client interview rate.
- Offer-acceptance rate.
- Assignment start rate.
- Retention.
- Replacement/removal rate.

Do not send PII, compensation, resume data, or free-text requirements into advertising analytics.

---

## 19. SEO/content strategy for V1

V1 should prioritise a small number of strong service pages over a large programmatic SEO footprint.

Initial indexable pages:

- Home.
- Hire Talent.
- Join Talent Network.
- How It Works.
- Expertise.

Later, after real recruiting/screening capability is established:

- role-specific pages;
- technology/platform-specific pages;
- country/location pages where there is an actual service proposition;
- hiring guides;
- salary/talent-market insights based on real data;
- case studies and verified client stories.

Do not publish thin SEO pages or pretend Cube27 has a live bench of pre-vetted candidates unless that becomes true.

---

## 20. Accessibility, performance, and quality

- Mobile and desktop flows must both be fully usable.
- Keyboard-accessible forms.
- Proper labels and validation messages.
- Error summaries where useful.
- No horizontal mobile overflow.
- Fast static delivery.
- Minimise client-side JavaScript.
- Optimise images/assets.
- Confirmation pages should be `noindex`.
- Form success must only appear after critical delivery succeeds.
- Test all live forms from outside the developer environment before launch.

---

## 21. Build phases

### Phase 0 — commercial/legal readiness

Before coding final production logic:

- Confirm employing Cube27 legal entity.
- Confirm payroll process.
- Confirm client commercial agreement.
- Define recurring monthly margin calculation.
- Define one-time first-month fee calculation and invoice trigger.
- Define replacement terms.
- Define client removal/termination process.
- Define hardware agreement and depreciation policy.
- Define background/reference-check process.
- Define overseas/visa-support boundaries.
- Approve factual credibility claims.

These items do not all need to be shown publicly, but operations must know how the service works before first placement.

### Phase 1 — Figma/product design

Design from this plan and the invariants document.

Required states to cover:

- Every public route.
- Employer form default/validation/loading/error/success.
- Candidate form default/upload/validation/loading/error/success.
- Mobile layouts.
- Credibility modules with only approved content.
- Conditional visa/overseas messaging.

Visual direction is intentionally outside this plan.

### Phase 2 — Astro implementation

- Implement approved designs.
- Centralise role data and content constants.
- Build forms.
- Build Cloudflare Functions.
- Integrate Resend.
- Add Turnstile.
- Add privacy/terms pages.
- Implement analytics/consent as approved.

### Phase 3 — deployment

- Create/confirm independent Cloudflare Pages project.
- Configure Talent subdomain.
- Configure environment variables.
- Verify Resend sending domain.
- Configure DNS.
- Run production build.
- Run live employer/candidate smoke tests.

### Phase 4 — launch and manual operations

- Begin employer and candidate LinkedIn promotion.
- Track lead quality by campaign.
- Refine forms from real submissions.
- Build operating discipline before adding software complexity.

---

## 22. Launch checklist

### Business

- [ ] Employing Cube27 entity confirmed.
- [ ] Payroll owner/process confirmed.
- [ ] Client service agreement approved.
- [ ] Monthly margin model documented.
- [ ] First-month fee model documented.
- [ ] Offer-acceptance and invoice triggers documented.
- [ ] Replacement terms approved.
- [ ] Client resource-removal process approved.
- [ ] Hardware procurement/buyback policy approved.
- [ ] Visa/overseas-assistance boundaries approved.
- [ ] 200+ positions claim verified for publication.
- [ ] Other trust claims approved.

### Recruitment operations

- [ ] Employer lead owner assigned.
- [ ] Candidate application owner assigned.
- [ ] HR screening script/process defined.
- [ ] Technical interviewers agreed by role family.
- [ ] Assessment methods agreed by role family.
- [ ] Reference/background-check process defined.
- [ ] Candidate snapshot template defined.
- [ ] Post-placement check-in process defined.
- [ ] Performance escalation workflow defined.

### Technical

- [ ] Astro production build passes.
- [ ] Cloudflare Pages project configured.
- [ ] Talent subdomain configured.
- [ ] Resend production domain verified.
- [ ] Environment variables configured.
- [ ] Employer form live-tested.
- [ ] Candidate form live-tested with PDF and DOCX.
- [ ] Turnstile validated server-side.
- [ ] Error states tested.
- [ ] Analytics does not capture PII.
- [ ] Privacy and terms routes live.
- [ ] No fake trust proof or candidate inventory in production.

---

## 23. Explicitly pending decisions

These remain unresolved and must not be invented during Figma or implementation:

1. Final public name and exact subdomain; `talent.cube27.com` remains recommended.
2. Exact recurring monthly Cube27 margin percentage/formula.
3. Exact one-time first-month fee percentage/formula.
4. Exact invoicing timing and payment terms.
5. Taxes/statutory-cost presentation and pass-through rules.
6. Exact replacement guarantee period/exclusions; 90 days remains proposed.
7. Hardware depreciation formula.
8. Hardware treatment when employment/assignment ends before 12 months.
9. Hardware damage/loss/insurance rules.
10. Exact candidate employment benefits that justify “best-in-class” or similar language.
11. Exact visa/immigration support by geography.
12. Approved trust proof beyond the user-confirmed `200+ positions filled` direction.
13. Exact wording/evidence for “10+ years serving global customers.”
14. Candidate data-retention policy and resume storage mechanism.
15. Whether expected compensation is mandatory or optional.
16. Production employer/candidate inboxes and internal owners.
17. Any public shortlist or response-time commitment.

---

## 24. Future expansion — not V1

Potential later additions only after the manual model is validated:

- ATS/CRM integration.
- Internal candidate database and search.
- Candidate profile generation tools.
- Employer dashboard.
- Candidate dashboard.
- Assignment/time-sheet tooling.
- Payroll/HRIS integration.
- Availability tracking.
- Automated matching/ranking.
- Interview scheduling.
- Job pages.
- Candidate referral programme.
- Skill-specific landing pages.
- Country hiring pages.
- Salary and market intelligence.
- Client case studies.
- Deployment and retention reporting.

---

## 25. Definition of done for V1

V1 is complete only when:

1. The website accurately describes Cube27 as a managed engineering talent/staffing partner.
2. It clearly states or implies correctly that selected resources are employed/payrolled by Cube27.
3. It does not incorrectly imply that clients become the formal employer.
4. Client authority over final selection, project direction, performance review, and resource continuation is clear.
5. Both employer and candidate funnels are functional.
6. Employer submissions reliably reach Cube27.
7. Candidate applications and resumes reliably reach Cube27 through the approved secure process.
8. Resend acknowledgement flow works.
9. Turnstile is validated server-side.
10. Mobile and desktop flows are production-ready.
11. Role scope includes mobile, ECMS/enterprise content management, and e-commerce CMS/platform talent.
12. Hardware and overseas/visa messaging stay within approved boundaries.
13. Public credibility claims are verified.
14. No public pricing percentages are exposed.
15. No portal, ATS, marketplace, fake candidate inventory, or unnecessary SaaS functionality has slipped into V1.
16. The site can be deployed independently to Cloudflare Pages and connected to the chosen Cube27 Talent subdomain.
