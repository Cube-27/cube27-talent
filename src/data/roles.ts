/**
 * The role taxonomy. Plan §4.
 *
 * These families are ILLUSTRATIVE, not exhaustive — invariant rule 0.3. Every
 * rendering of this list must carry OPEN_SCOPE_LINE, and no copy anywhere may
 * imply that these are the limit of what we recruit.
 *
 * This is the only definition of the families. The expertise selector, the
 * employer form's category chips, the candidate form's dropdown and the
 * server-side validation allow-list all derive from it, so a family cannot
 * exist in a form but not in the validator.
 *
 * Copy rule: no company name in any string in this file. First person plural
 * only — invariant rule 0.1.
 */

export interface RoleFamily {
  /** Stable id. Submitted by the forms and validated on the server. */
  id: string;
  name: string;
  /** Short label for form chips, where the full name is too long. */
  short: string;
  /**
   * The outcome headline for the family, shown as the capability panel's H2.
   * States what hiring into this function achieves — never what the function
   * is. Product principle 1: the commercial outcome before the process.
   */
  statement: string;
  /** One-line commercial scope statement for the family. */
  blurb: string;
  /**
   * A compact scope descriptor for the panel — "24/7", "1→N", "360°",
   * "C-level". It states the shape of the coverage a function needs, never a
   * quantity we have delivered.
   *
   * The boundary is countability: a value a reader could take as a tally of our
   * work ("50+", "200 hires") is an evidence claim, and every one of those has
   * to be an approved figure routed through data/proof.ts. Descriptive values
   * carry no such claim and belong here.
   */
  metric: string;
  metricLabel: string;
  roles: string[];
}

export const ROLE_FAMILIES: RoleFamily[] = [
  {
    id: "engineering-product",
    name: "Engineering & Product",
    short: "Engineering",
    statement: "Build the product team that carries the roadmap.",
    blurb:
      "From core platform engineering to the product leaders who shape what gets built next.",
    metric: "Full-stack",
    metricLabel: "Build coverage",
    roles: [
      "Frontend",
      "Backend",
      "Full-stack",
      "Mobile — iOS, Android, cross-platform",
      "Product management",
      "Business analysis",
    ],
  },
  {
    id: "cloud-infrastructure",
    name: "Cloud, Infrastructure & Reliability",
    short: "Cloud & Infra",
    statement: "Put resilient foundations under the work that matters.",
    blurb:
      "Cloud, DevOps, security, and infrastructure specialists ready for the environment you operate.",
    metric: "24/7",
    metricLabel: "Critical systems",
    roles: [
      "DevOps",
      "Cloud engineering",
      "Site reliability",
      "Platform engineering",
      "Infrastructure automation",
    ],
  },
  {
    id: "data-ai",
    name: "Data & AI",
    short: "Data & AI",
    statement: "Turn scattered signals into teams that create leverage.",
    blurb:
      "Data, analytics, machine learning, and AI expertise assessed against the work in front of you.",
    metric: "AI+",
    metricLabel: "Specialist focus",
    roles: [
      "Data engineering",
      "Analytics engineering",
      "Machine learning",
      "AI engineering",
    ],
  },
  {
    id: "quality-delivery",
    name: "Quality & Delivery",
    short: "Quality",
    statement: "Deliver with the confidence of a team built for release.",
    blurb:
      "Test, delivery, and programme talent that brings clarity from definition through deployment.",
    metric: "1→N",
    metricLabel: "Team readiness",
    roles: [
      "QA",
      "Test automation",
      "SDET",
      "Performance testing",
      "Delivery and project management",
    ],
  },
  {
    id: "design-experience",
    name: "Design & Digital Experience",
    short: "Design",
    statement: "Make the customer experience a competitive advantage.",
    blurb:
      "Product design and research talent that connects strong thinking to useful outcomes.",
    metric: "360°",
    metricLabel: "Experience layers",
    roles: [
      "Product design",
      "UX and UI",
      "Research",
      "Content platforms",
      "Commerce platforms",
    ],
  },
  {
    id: "business-operations",
    name: "Business & Operations",
    short: "Operations",
    statement: "Staff the functions that keep commitments moving.",
    blurb:
      "Revenue, customer, finance, and people operators who hold the day-to-day together as you scale.",
    metric: "End-to-end",
    metricLabel: "Operating cover",
    roles: [
      "Sales and revenue operations",
      "Customer success",
      "Finance operations",
      "People operations",
      "Procurement and supply chain",
      "Business operations",
    ],
  },
  {
    id: "leadership",
    name: "Leadership",
    short: "Leadership",
    statement: "Appoint the people who set the direction.",
    blurb:
      "Executive search for the leaders who own a function and the mandate that comes with it.",
    metric: "C-level",
    metricLabel: "Search mandates",
    roles: [
      "CTO",
      "CIO",
      "COO",
      "VP Engineering",
      "Head of Product",
      "Head of Data",
    ],
  },
];

/** Allow-list for server-side validation of submitted role families. */
export const ROLE_FAMILY_IDS = ROLE_FAMILIES.map((f) => f.id);

/**
 * Required closing line wherever the families are listed. Invariant rule 0.3:
 * the taxonomy is a starting point, never a boundary. Do not remove it, and do
 * not render a role list without it.
 */
export const OPEN_SCOPE_LINE =
  "These roles are examples. We hire beyond these categories.";
