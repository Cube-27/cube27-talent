# Talent — V1 Product and Implementation Plan

**Status:** Approved rebuild plan
**Updated:** 13 August 2026

## 1. Product objective

Create an enterprise-facing lead-generation site for a managed talent and team-building service. A visitor must understand within the first viewport:

- what we do;
- who it is for;
- why our assessment is credible;
- what action to take next.

The primary conversion is a completed employer requirement. Candidate applications remain a complete secondary funnel.

## 2. Positioning and message sequence

The homepage leads with “Build the team your business needs.” It then proves scale, states the commercial value, shows the hiring evidence, lists lifecycle coverage, presents expertise, and ends with a direct requirement CTA.

The sales story is:

1. Build specialist capacity without carrying the full hiring operation.
2. Meet people who have already been assessed with evidence.
3. Use one partner for hiring, onboarding, administration, and ongoing support.
4. Scale from a specialist role to a broader team across functions and seniority.

## 3. Information architecture

Existing routes remain stable:

- `/` — employer-focused homepage
- `/how-it-works/` — deeper explanation of how we hire and support teams
- `/expertise/` — cross-functional talent scope, security teams, and leadership search
- `/hire-talent/` — employer requirement and conversion page
- `/join-talent-network/` — candidate proposition and application
- existing thank-you and error routes

Primary navigation is **How we hire**, **Expertise**, **For talent**, and the persistent **Build your team** CTA.

## 4. Homepage requirements

Render sections in this order:

1. Full-width copy-led hero with primary employer CTA and secondary candidate link.
2. Approved proof strip: positions filled, brands served, and years serving global clients.
3. Managed-team proposition focused on business outcomes and reduced operational load.
4. Signature four-phase hiring-process rail.
5. Employee lifecycle management: hiring, onboarding, payroll and administration, ongoing support.
6. Broad expertise with focused security and leadership modules.
7. Employer FAQ.
8. Final “Tell us what you need to build” conversion band.

The hero contains no fake candidate, dashboard, product mockup, decorative right column, or unsupported logo wall.

## 5. Hiring-process behavior

The four phases are Define the team, Find the right people, Assess real work, and Select and start.

On desktop, every phase remains visible in a scroll-linked vertical rail. The current phase receives the accent colour and the connecting line advances as the visitor scrolls. On mobile the rail becomes a static vertical sequence. With JavaScript disabled or reduced motion enabled, every phase remains visible and understandable.

No visible, accessible, metadata, or documentation copy numbers the phases or calls them steps.

## 6. Supporting pages

- **How we hire:** expand the four phases, explain assessment evidence and human judgment, then show ongoing lifecycle coverage.
- **Expertise:** present disciplines as examples, not a catalogue boundary. Give security and executive hiring dedicated emphasis.
- **Build your team:** use a concise enterprise proposition beside the existing structured requirement form.
- **For talent:** explain career value, discipline-specific assessment, process clarity, and global work without promises.
- **Thank-you and error pages:** use direct, specific headings and next actions consistent with the new shell.

## 7. Forms and integrations

Preserve payloads, endpoints, Turnstile actions, Resend delivery, upload validation, consent fields, hidden attribution fields, rate limiting, and redirects.

Employer fields remain structured around role, scale, start window, engagement, arrangement, role families, and requirement detail. Candidate fields retain the optional LinkedIn and GitHub/portfolio URLs and resume upload.

## 8. Content constraints

- First-person plural marketing voice; brand name only in identity and legal contexts.
- No contractual terms, pricing, guarantees, fake candidates, unapproved proof, or engineering-only framing.
- AI-assisted sourcing and screening must be paired with explicit human decision-making.
- Certification frameworks are context for teams we build, never accreditations we claim.
- Headings state outcomes or capabilities rather than abstract transitions.

## 9. Implementation sequence

1. Align product, content, and design documentation.
2. Replace tokens and shared components with the sharp flat system.
3. Replace process data and interaction.
4. Rebuild the shared shell and homepage.
5. Rewrite supporting pages and metadata.
6. Verify forms and the GitHub field end to end.
7. Run static, functional, accessibility, content, and visual QA.

## 10. Acceptance criteria

- The first viewport explains the offer and exposes **Build your team**.
- Every public heading is specific and commercially useful.
- No count-based hiring-process terminology remains.
- Marketing surfaces are square; controls use no more than 4px radius.
- The homepage contains no fake product or candidate interface.
- The three approved metrics appear with exact wording and no unsupported proof appears.
- All public routes work at mobile and desktop widths with keyboard, reduced motion, and no JavaScript.
- Both forms retain their current security and delivery behavior.
- Formatting, lint, Astro checks, tests, production build, content gate, and bounded visual QA pass.
