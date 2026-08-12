/**
 * FAQ content. Answers are bound by the claim rules in plan §6.7 — no
 * percentages, no guarantee periods, no delivery-time promises.
 */

export interface Faq {
  q: string;
  a: string;
}

export const EMPLOYER_FAQS: Faq[] = [
  {
    q: "Who employs the engineer?",
    a: "Cube27. The employment offer is issued after the client selects the candidate, and Cube27 runs payroll and employment administration for the duration of the engagement.",
  },
  {
    q: "Can a client remove someone who is not working out?",
    a: "Yes — that decision belongs to the client. Because Cube27 is the legal employer, Cube27 processes the formal employment side under its agreement and applicable law, and starts the replacement search.",
  },
  {
    q: "Who runs the technical interview?",
    a: "Cube27 engineers, technical leadership or the CEO — someone who works in the discipline being assessed.",
  },
  {
    q: "Who provides the laptop?",
    a: "Cube27 procures it and the client is charged the actual cost, with buyback at an agreed depreciated value after a minimum of twelve months.",
  },
  {
    q: "Is there a minimum number of hires?",
    a: "No. A single senior role is a valid mandate, though the service works best for clients hiring several people or building a team over time.",
  },
  {
    q: "Which roles fall outside the scope?",
    a: "Sales, marketing, finance, general HR, administration and non-technical mass hiring. Adjacent technical roles are considered case by case.",
  },
];

export const CANDIDATE_FAQS: Faq[] = [
  {
    q: "Who is the employer?",
    a: "Cube27. Successful candidates join Cube27 as employees on Cube27 payroll, and are assigned to client engagements.",
  },
  {
    q: "What does the assessment involve?",
    a: "An HR screen, a task matched to the discipline, and a technical interview with Cube27 engineers or technical leadership. References follow, with separate written consent.",
  },
  {
    q: "Are overseas assignments available?",
    a: "Some assignments involve overseas work, and Cube27 assists with the applicable visa process where an approved assignment requires it. Overseas travel and visa approval are never guaranteed.",
  },
  {
    q: "Is equipment provided?",
    a: "Yes. Work hardware is provided under Cube27 policy.",
  },
  {
    q: "Does an application guarantee a role?",
    a: "No. Submitting a profile does not guarantee screening, an interview, employment or an assignment.",
  },
];
