/**
 * The employer-side workflow. Plan §7.1, condensed to nine public steps.
 *
 * `owner` must stay accurate: it is the visible expression of invariants 4-8
 * (who employs, who directs, who decides). Do not soften step 07 or 08.
 */

export interface ProcessStep {
  n: string;
  name: string;
  owner: "Cube27" | "Client" | "Both";
  detail: string;
  points: [string, string];
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    n: "01",
    name: "Qualify",
    owner: "Cube27",
    detail:
      "Role, level, compensation range, location and work model are checked against what Cube27 can credibly recruit and screen.",
    points: [
      "Accept or decline stated up front",
      "Written role brief before sourcing starts",
    ],
  },
  {
    n: "02",
    name: "Source",
    owner: "Cube27",
    detail:
      "Candidates come from the existing network, the inbound talent pool and targeted search.",
    points: ["No mass CV forwarding", "Shortlist sized to the role"],
  },
  {
    n: "03",
    name: "HR screen",
    owner: "Cube27",
    detail:
      "Motivation, communication, notice period, work authorisation and engagement preferences.",
    points: [
      "Availability confirmed early",
      "Compensation expectations captured privately",
    ],
  },
  {
    n: "04",
    name: "Technical assessment",
    owner: "Cube27",
    detail:
      "A task matched to the discipline — a coding exercise, a design task, a test strategy or an infrastructure problem.",
    points: [
      "Role-appropriate, never generic",
      "Result recorded on the candidate snapshot",
    ],
  },
  {
    n: "05",
    name: "Technical interview",
    owner: "Cube27",
    detail:
      "Conducted by Cube27 engineers, technical leadership or the CEO — someone who works in the discipline being assessed.",
    points: ["Written recommendation", "Known gaps stated, not hidden"],
  },
  {
    n: "06",
    name: "References",
    owner: "Cube27",
    detail:
      "Reference and background verification, carried out with the candidate's separate written consent.",
    points: [
      "Consent obtained before any contact",
      "Status shown on the snapshot",
    ],
  },
  {
    n: "07",
    name: "Client interview",
    owner: "Client",
    detail:
      "Whatever process the client runs. Selection is entirely the client's decision.",
    points: [
      "Curated shortlist with assessment context",
      "No pressure to accept a candidate",
    ],
  },
  {
    n: "08",
    name: "Offer and onboarding",
    owner: "Cube27",
    detail:
      "Cube27 issues the employment offer, completes payroll onboarding and arranges work hardware.",
    points: ["Cube27 is the legal employer", "Hardware charged at actual cost"],
  },
  {
    n: "09",
    name: "On assignment",
    owner: "Both",
    detail:
      "The engineer works to the client's priorities. Cube27 runs periodic check-ins and handles employment matters.",
    points: [
      "Client owns performance review",
      "Replacement search if the client requests removal",
    ],
  },
];

/** Division of responsibility. Invariants 3-8, 17. */
export const RESPONSIBILITIES: {
  item: string;
  owner: "cube27" | "client";
  note?: string;
}[] = [
  { item: "Sourcing, screening, technical interview", owner: "cube27" },
  { item: "Final interview and selection", owner: "client" },
  { item: "Employment contract and payroll", owner: "cube27" },
  { item: "Work hardware, at actual cost", owner: "cube27" },
  { item: "Daily work and priorities", owner: "client" },
  { item: "Performance review on the project", owner: "client" },
  {
    item: "Removal from the engagement",
    owner: "client",
    note: "Processed by Cube27",
  },
  { item: "Replacement search", owner: "cube27" },
];

/** Included with every placement. All operationally true today. */
export const INCLUSIONS = [
  "Employment and payroll",
  "Work hardware",
  "Reference and background checks",
  "Periodic check-ins",
];
