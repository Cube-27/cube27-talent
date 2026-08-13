/**
 * FAQ content.
 *
 * Rewritten in full. Every question in the previous version was unusable under
 * the current copy rules — they named the company, named the legal employer,
 * and answered questions about equipment and removing people.
 *
 * Bound by invariant rules 0.1 and 0.2: first person plural, no company name,
 * and nothing contractual. No percentages, no guarantee periods, no delivery
 * times, no equipment, no removal or replacement.
 */

export interface Faq {
  q: string;
  a: string;
}

export const EMPLOYER_FAQS: Faq[] = [
  {
    q: "How do you assess people?",
    a: "A screen, then a task matched to the discipline, then a technical interview run by someone who does that work. The assessment is recorded and comes to you with the shortlist, so you can see how a person thinks rather than take our word for it.",
  },
  {
    q: "Do you use AI in the process?",
    a: "For search and for covering ground at volume, yes. Every decision about who is worth your time is made by a person, and every technical interview is run by one.",
  },
  {
    q: "Can you help with one hire, or do we need a team?",
    a: "Either. A single senior specialist is a perfectly good place to start. The work tends to be most useful to teams hiring several people or growing steadily over a year or two.",
  },
  {
    q: "Which roles do you cover?",
    a: "Engineering and product, cloud and infrastructure, data and AI, security and compliance, quality and delivery, design, and leadership up to CXO. That list is where we start, not where we stop — if we can assess a role properly, we can hire for it.",
  },
  {
    q: "Can you build a security team for a certification programme?",
    a: "Yes. It is one of the things we are asked for most: the security and compliance people an organisation needs to work towards ISO 27001, SOC 2, PCI DSS, HIPAA or GDPR. We build the team; the certification is yours to earn.",
  },
  {
    q: "What happens after someone starts?",
    a: "We handle onboarding, payroll and the administration around it, and we keep checking in for as long as the engagement runs. Your team directs the work.",
  },
  {
    q: "What does it cost?",
    a: "Terms depend on the roles, the seniority, the location and how many people you are hiring, so we price each engagement directly rather than publishing a rate card. It is a short conversation.",
  },
  {
    q: "How quickly can you move?",
    a: "It depends entirely on the role and the market for it, and we would rather tell you that honestly than quote a number we cannot stand behind. We will give you a realistic window on the first call, once we know what you are hiring for.",
  },
];

export const CANDIDATE_FAQS: Faq[] = [
  {
    q: "What kind of work is this?",
    a: "Real employment with real clients — global companies building product teams — not gig work and not a job board listing. It is a role with a team behind it, and someone to call while you are in it.",
  },
  {
    q: "What does the process involve?",
    a: "A screen, a task matched to your discipline, and a technical interview with someone who does the work you do. References follow with your separate written consent. You will know where you stand at each stage.",
  },
  {
    q: "Is the assessment recorded?",
    a: "Yes, and it works in your favour. It means your reasoning goes to the client alongside the result, instead of a CV and a score.",
  },
  {
    q: "What kind of roles do you recruit for?",
    a: "Engineering and product, cloud and infrastructure, data and AI, security and compliance, quality and delivery, design, and senior leadership roles. If your discipline is not on that list, apply anyway and tell us what you do.",
  },
  {
    q: "Are there opportunities to work overseas?",
    a: "Some assignments involve overseas work, and we assist with the applicable process where an approved assignment requires it. It depends on the role and the client, and it is never guaranteed.",
  },
  {
    q: "Does applying guarantee anything?",
    a: "No. Sending us a profile does not guarantee screening, an interview, employment or an assignment. What we will do is read it properly and be straight with you.",
  },
];
