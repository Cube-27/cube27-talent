export interface ProcessPhase {
  id: string;
  name: string;
  summary: string;
  points: string[];
  icon: string;
}

export const PROCESS_HEADING = "Evidence-backed shortlists";

export const PROCESS_LEDE =
  "Every shortlist includes evidence from role-specific work and expert review.";

export const PROCESS_PHASES: ProcessPhase[] = [
  {
    id: "define",
    name: "Define the team",
    summary: "Set the outcome, skills, and seniority.",
    points: ["Role outcomes", "Seniority and location", "Assessment standard"],
    icon: "target",
  },
  {
    id: "find",
    name: "Find the right people",
    summary: "Search across roles, industries, and markets.",
    points: ["Targeted sourcing", "Human screening", "Candidate communication"],
    icon: "search",
  },
  {
    id: "assess",
    name: "Assess with evidence",
    summary: "Recorded assessments and practitioner interviews.",
    points: ["Role-specific work", "Practitioner review", "Verified evidence"],
    icon: "spark",
  },
  {
    id: "select",
    name: "Select and start",
    summary: "Review a focused shortlist with expert context.",
    points: [
      "Focused shortlist",
      "Evidence summary",
      "Final decision stays yours",
    ],
    icon: "briefcase",
  },
];

export const LIFECYCLE = [
  {
    icon: "search",
    title: "Hiring",
    body: "Search, screen, and assess for the role.",
    tint: "violet" as const,
  },
  {
    icon: "briefcase",
    title: "Onboarding",
    body: "Move selected talent into the team.",
    tint: "mint" as const,
  },
  {
    icon: "shield",
    title: "Payroll and administration",
    body: "Keep recurring administration covered.",
    tint: "peach" as const,
  },
  {
    icon: "chat",
    title: "Ongoing support",
    body: "Support people as the team evolves.",
    tint: "sky" as const,
  },
];
