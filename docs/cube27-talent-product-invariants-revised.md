# Cube27 Talent — Product Invariants (Revised)

**Status:** Locked baseline with explicit pending decisions  
**Prepared:** 12 August 2026

> This is the highest-priority product reference for Figma, copywriting, Codex/Claude implementation, and review. Presentation may evolve, but a design or implementation must not silently change these decisions. Priority when documents conflict: **invariants → V1 plan → approved design → implementation detail**.

## Locked decisions

1. **Category:** Cube27 Talent is a managed engineering staffing/talent service, not merely a recruitment agency, freelance marketplace, job board, or candidate marketplace.
2. **Audiences:** The site serves global employers and candidates. Employer acquisition is the commercial priority, but both funnels launch together.
3. **Employment model:** Selected resources are employed by Cube27. Cube27 manages payroll and normal employment administration.
4. **Client control:** The client selects candidates, directs day-to-day project work, owns functional performance review, and can request removal/discontinuation of a resource from its engagement.
5. **Formal employment actions:** Because Cube27 is the legal employer, Cube27 processes formal employment actions arising from client removal/termination decisions in accordance with the employment agreement and applicable law.
6. **Role scope:** Software engineering, mobile development, QA/quality engineering, DevOps/cloud/infrastructure, product, product/UX/UI design, enterprise content management systems (ECMS), and e-commerce CMS/platform engineering.
7. **Geography/work model:** Global client scope. Requirements may be remote, hybrid, onsite, or relocation-based; no single-country positioning is required.
8. **Engagement size:** No explicit minimum. Cube27 may serve one valuable senior role, several simultaneous roles, or an ongoing team build-out. Preferred business shape is fewer clients with larger or recurring talent needs.
9. **Screening:** HR interview → role-appropriate coding/technical assessment → technical interview by Cube27 technical staff/leadership/CEO → reference/background verification → curated candidate profile → client final process.
10. **Differentiator:** Technical candidates are evaluated by people who understand the work. “Engineers screen engineers” remains the central employer proposition where role-appropriate.
11. **Candidate presentation:** Clients receive a curated shortlist and structured Cube27 assessment context, not a bulk CV dump.
12. **Employment offer:** After client selection, Cube27 issues the employment offer to the candidate.
13. **Commercial confirmation:** Offer acceptance remains the milestone at which the placement/engagement is treated as commercially confirmed; detailed invoice timing remains contractual.
14. **Commercial model:** Cube27 earns (a) a recurring monthly margin/management percentage linked to the resource's monthly compensation and (b) an additional one-time percentage linked to the first month's compensation. Exact percentages are private and are not published on the website.
15. **Pricing flexibility:** Commercial terms may vary by client, volume, geography, seniority, role, employment cost, and engagement structure.
16. **Mandate control:** Exclusivity is not required. Cube27 may reject any requirement it cannot or should not serve.
17. **Resource management boundary:** Cube27 manages employment/payroll and the staffing relationship; the client manages project delivery, work priorities, and functional performance assessment. Cube27 is not automatically taking responsibility for the client's project outcome.
18. **Post-start relationship:** Cube27 performs periodic check-ins and handles employment/staffing escalations rather than exiting after placement.
19. **Replacement:** Replacement support is part of the service direction. Replacement, not cash refund, is the preferred model; exact duration/conditions remain pending.
20. **Hardware:** Cube27 procures/provides required work hardware. The client is charged actual hardware cost under the agreed engagement terms. Standard direction is Cube27 buyback at an agreed depreciated value at end of employment/assignment after a minimum 12-month period.
21. **Hardware unknowns:** Depreciation formula, sub-12-month treatment, damage/loss, insurance, logistics, and ownership mechanics must not be invented during design or implementation.
22. **Candidate proposition:** Cube27 is an employer/career opportunity, not just a recruiter. Candidate messaging may highlight strong employment terms, global-client exposure, professional payroll/employment administration, hardware support, and potential overseas opportunities.
23. **Overseas/visa:** Cube27 may assist with visa/process requirements for approved overseas assignments where legally and operationally possible. Overseas travel, sponsorship, relocation, and visa approval are never guaranteed.
24. **Credibility:** `200+ positions filled over the years` is an identified credibility claim to verify and use. Additional proof may include 10+ years serving global customers, existing HR/technical screening capability, and approved client evidence.
25. **Employment-superlative rule:** “Best-in-class employment terms” is not automatically a publishable factual claim. Prefer concrete benefits; use the superlative only if Cube27 can substantiate it.
26. **Initial acquisition:** LinkedIn paid and organic promotion supports both employer and candidate acquisition.
27. **V1 product:** The website is a lead generator feeding a manual recruiting/staffing operation. No accounts, dashboards, portals, ATS, matching engine, public candidate marketplace, public candidate inventory, payment system, scheduling system, payroll application, or performance-management software is built in V1.
28. **Employer form:** V1 has a structured hiring-requirement form, not a generic name/email/message contact form.
29. **Candidate form:** V1 has a structured candidate application with resume upload.
30. **Technology:** Astro frontend, independent Cloudflare Pages deployment on a Cube27 subdomain, server-side Cloudflare Pages Functions for forms, Resend for email delivery, and server-side anti-spam verification.
31. **Brand/design:** Cube27 Talent may use a distinct visual identity; the current Cube27 website design is not a constraint. Visual design is handled separately from these documents.
32. **Truthfulness:** No fake candidates, fake availability, invented testimonials, unsupported client logos, unverified metrics, “top 1%” claims, guaranteed hiring speed, guaranteed visa/travel, or other unsupported claims.
33. **No public percentages:** Candidate salary, Cube27 recurring margin, and first-month fee percentages are not exposed publicly by default.
34. **No salary-history requirement:** Do not collect candidate current salary/history by default. Expected compensation may be collected according to final operating policy.
35. **Scope discipline:** V1 validates employer demand and candidate supply before Cube27 builds a talent platform or staffing SaaS product.

## Public claim boundaries

**Safe direction:** global engineering talent, Cube27-employed resources, Cube27-managed payroll, curated technical screening, engineers screening engineers, client-controlled performance/assignment, flexible work models, managed staffing, 200+ roles/positions filled once verified, global-client opportunities, conditional overseas/visa assistance, hardware support.

**Do not claim:** instant availability, fixed shortlist time, guaranteed placement, guaranteed overseas travel, guaranteed visa approval, global legal/EOR capability beyond what Cube27 actually supports, guaranteed project outcomes, fake live talent inventory, public markup percentages, or unverified employment-benefit superlatives.

## Explicitly pending decisions

- Final public name and exact subdomain; `talent.cube27.com` remains recommended.
- Exact recurring monthly margin percentage/formula.
- Exact one-time first-month fee percentage/formula.
- Exact invoice/payment timing and taxes/statutory pass-through treatment.
- Exact replacement-guarantee duration/exclusions; 90 days remains proposed.
- Exact employment benefits that can be publicly claimed.
- Exact visa/relocation assistance by geography and assignment type.
- Hardware depreciation formula and ownership treatment.
- Hardware treatment if employment/assignment ends before 12 months.
- Hardware damage/loss/insurance/logistics policy.
- Exact legal entity and employment-contract structure.
- Candidate-data retention and resume storage policy.
- Whether expected compensation is required or optional.
- Approved logos, testimonials, case studies, client names, and supporting proof.
- Verification and final wording for `200+ positions filled over the years` and `10+ years serving global customers`.
- Production employer/candidate inboxes and internal owners.
- Any public response-time, shortlist-time, or hiring-speed commitment.

## Scope-change rule

The following require an explicit product/business decision and must never be inferred by Figma, Codex, Claude, or implementation:

- turning the website into a job board or marketplace;
- exposing live candidate inventory;
- adding public pricing/markup percentages;
- adding a candidate or employer portal;
- building payroll, HRIS, ATS, time tracking, performance management, or matching software;
- shifting responsibility for client project outcomes to Cube27;
- guaranteeing visas, travel, placement, or delivery speed;
- materially changing who employs the resource or who controls performance/assignment decisions.
