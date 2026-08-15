export interface ProcessPhase {
  id: string;
  name: string;
  summary: string;
  points: string[];
  icon: string;
}

export const PROCESS_HEADING = "Shortlists built for clearer decisions";

export const PROCESS_LEDE =
  "See candidates handle role-specific work before they reach your team.";

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
    name: "Assess real work",
    summary: "Combine recorded assessments with practitioner interviews.",
    points: ["Role-specific work", "Practitioner review", "Clear findings"],
    icon: "spark",
  },
  {
    id: "select",
    name: "Select and start",
    summary: "Compare a focused shortlist with context on strengths and gaps.",
    points: [
      "Focused shortlist",
      "Candidate context",
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
  },
  {
    icon: "briefcase",
    title: "Onboarding",
    body: "Bring selected talent into your culture and ways of working.",
  },
  {
    icon: "shield",
    title: "Payroll and compliance",
    body: "Coordinate contracts, payroll, and applicable local requirements.",
  },
  {
    icon: "chat",
    title: "Performance support",
    body: "Facilitate reviews against criteria defined with your team.",
  },
];
