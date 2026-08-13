/**
 * The nine steps. Plan §6.1. This is the centrepiece of the site.
 *
 * Copy rules that bind every string in this file:
 *  - No company name. First person plural only — invariant rule 0.1.
 *  - Nothing contractual — invariant rule 0.2. No hardware, no legal-employer
 *    language, no removal, replacement, termination, notice or percentages.
 *    Steps 08 and 09 are where that pressure lands; keep them benefit-led.
 *  - AI is only ever mentioned alongside the fact that people decide —
 *    invariant 10.
 */

export interface ProcessStep {
  n: string;
  name: string;
  /** Short verb phrase under the rail node. */
  short: string;
  detail: string;
  points: [string, string];
}

export const PROCESS_HEADING = "Nine steps. One team that stays.";

export const PROCESS_LEDE =
  "Every hire runs the same route, whether it is one specialist or a team of thirty.";

export const PROCESS_STEPS: ProcessStep[] = [
  {
    n: "01",
    name: "Brief",
    short: "Brief",
    detail:
      "We agree the role, the level, the budget range, the location and the working model in writing before anything else happens. If it is not a role we can assess properly, we say so on the first call.",
    points: [
      "A written brief before the search starts",
      "A straight answer on fit, early",
    ],
  },
  {
    n: "02",
    name: "Search",
    short: "Search",
    detail:
      "We work our network, our inbound pool and a targeted search. AI tooling helps us cover ground at volume; every call about who is worth talking to is made by a person.",
    points: ["No mass CV forwarding", "A shortlist sized to the role"],
  },
  {
    n: "03",
    name: "Screen",
    short: "Screen",
    detail:
      "A conversation about motivation, communication, availability and what someone actually wants next. It is where most of the noise comes out.",
    points: [
      "Availability confirmed up front",
      "Expectations captured before anyone's time is spent",
    ],
  },
  {
    n: "04",
    name: "Assessment",
    short: "Assessment",
    detail:
      "A task matched to the discipline — a build problem, a design task, a test strategy, an infrastructure failure, a threat model. It is recorded, so you see how someone works through it rather than only what they scored.",
    points: [
      "Role-appropriate, never a generic test",
      "Recorded and shared with the shortlist",
    ],
  },
  {
    n: "05",
    name: "Technical interview",
    short: "Interview",
    detail:
      "Run by people who do the work — engineers, technical leadership, specialists in the discipline being assessed. You get a written recommendation with the gaps stated, not hidden.",
    points: [
      "Assessed by practitioners, not recruiters",
      "Known gaps written down",
    ],
  },
  {
    n: "06",
    name: "References",
    short: "References",
    detail:
      "Background and reference verification, carried out with the candidate's separate written consent and reported plainly.",
    points: [
      "Consent obtained before any contact",
      "Status shown alongside the profile",
    ],
  },
  {
    n: "07",
    name: "Your interview",
    short: "Your call",
    detail:
      "Whatever process you run, run it. You get a short, curated shortlist with the full assessment context behind each person, and the choice is entirely yours.",
    points: [
      "A curated shortlist, not a CV dump",
      "No pressure to accept anyone",
    ],
  },
  {
    n: "08",
    name: "Offer and onboarding",
    short: "Onboarding",
    detail:
      "We handle the offer, the paperwork and everything around the start date, so the first day is a working day rather than an admin day.",
    points: [
      "Hiring and onboarding handled end to end",
      "Ready to work from day one",
    ],
  },
  {
    n: "09",
    name: "Scale and support",
    short: "Scale",
    // "Most of our work comes from teams we already built" was here and has
    // been removed: it is a repeat-business claim with no approved source
    // behind it (invariant 18).
    detail:
      "We stay involved — regular check-ins through the engagement, and the next hire ready when the team grows.",
    points: [
      "Check-ins for as long as the engagement runs",
      "The next role starts from what we already know",
    ],
  },
];

/**
 * What we take off a client's plate. Homepage §9.1.3 — benefit-led, no
 * mechanics. Invariant rule 0.2 governs every word here: this is the section
 * where contractual detail would most naturally creep back in.
 */
export const LIFECYCLE = [
  {
    icon: "search",
    title: "Hiring",
    body: "Search, screening, assessment and interviews — the part that quietly eats your leadership's calendar.",
    tint: "violet" as const,
  },
  {
    icon: "briefcase",
    title: "Onboarding",
    body: "Offer through start date, arranged so your team gets a person who is ready to work rather than a project to set up.",
    tint: "mint" as const,
  },
  {
    icon: "shield",
    title: "Payroll and admin",
    body: "Payroll and the employment administration around it, handled by us. You direct the work; we carry the paperwork.",
    tint: "peach" as const,
  },
  {
    icon: "chat",
    title: "Ongoing support",
    body: "Regular check-ins for as long as the engagement runs, and someone to call when something needs sorting out.",
    tint: "sky" as const,
  },
];
