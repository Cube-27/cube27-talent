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
  /** Icon key, resolved by components/ui/Icon.astro. */
  icon: string;
  /** How this family is assessed. Must stay operationally true. Plan §6.3. */
  blurb: string;
  roles: string[];
  /** Tint token suffix. Cycles the four panel tints — design system §2.1. */
  tint: "violet" | "mint" | "peach" | "sky";
  /** Given its own accented treatment on the homepage. */
  featured?: boolean;
}

export const ROLE_FAMILIES: RoleFamily[] = [
  {
    id: "engineering-product",
    name: "Engineering & Product",
    short: "Engineering",
    icon: "code",
    blurb:
      "Product engineering across the stack, plus the product roles that steer it. Assessed with a build or judgement task matched to the seat.",
    roles: [
      "Frontend",
      "Backend",
      "Full-stack",
      "Mobile — iOS, Android, cross-platform",
      "Product management",
      "Business analysis",
    ],
    tint: "violet",
  },
  {
    id: "cloud-infrastructure",
    name: "Cloud, Infrastructure & Reliability",
    short: "Cloud & Infra",
    icon: "cloud",
    blurb:
      "Platform and reliability work, assessed on failure modes and operational design rather than tool trivia.",
    roles: [
      "DevOps",
      "Cloud engineering",
      "Site reliability",
      "Platform engineering",
      "Infrastructure automation",
    ],
    tint: "mint",
  },
  {
    id: "data-ai",
    name: "Data & AI",
    short: "Data & AI",
    icon: "chart",
    blurb:
      "Pipelines, models and the decisions they feed. Assessed on data reasoning and production realities, not notebook exercises.",
    roles: [
      "Data engineering",
      "Analytics engineering",
      "Machine learning",
      "AI engineering",
    ],
    tint: "peach",
  },
  {
    id: "security-compliance",
    name: "Security & Compliance",
    short: "Security",
    icon: "shield",
    blurb:
      "The people who harden a product and carry an organisation through an audit. Assessed on threat reasoning and real remediation work.",
    roles: [
      "Security engineering",
      "Application security",
      "Security operations",
      "Governance, risk and compliance",
    ],
    tint: "sky",
  },
  {
    id: "quality-delivery",
    name: "Quality & Delivery",
    short: "Quality",
    icon: "check",
    blurb:
      "Test strategy, automation and the people who keep a release moving. Assessed on coverage design and delivery judgement.",
    roles: [
      "QA",
      "Test automation",
      "SDET",
      "Performance testing",
      "Delivery and project management",
    ],
    tint: "violet",
  },
  {
    id: "design-experience",
    name: "Design & Digital Experience",
    short: "Design",
    icon: "pen",
    blurb:
      "Product design and the platforms that carry content and commerce. Assessed through portfolio review and a task from real work.",
    roles: [
      "Product design",
      "UX and UI",
      "Research",
      "Content platforms",
      "Commerce platforms",
    ],
    tint: "mint",
  },
  {
    id: "leadership",
    name: "Leadership",
    short: "Leadership",
    icon: "compass",
    blurb:
      "Senior and executive hires, run discreetly. Assessed on how someone has actually built and held a team together.",
    roles: [
      "CTO",
      "CIO",
      "CISO",
      "VP Engineering",
      "Head of Product",
      "Head of Data",
    ],
    tint: "peach",
    featured: true,
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
  "And the roles around them. Tell us what the team needs — if we can assess it properly, we can hire it.";

/**
 * Compliance frameworks we build teams towards. Homepage security section.
 *
 * HARD RULE — invariant 0.4: these are standards our teams build an
 * organisation towards. They are never a claim that we hold them. They must be
 * set typographically, never as a seal, badge, crest or trust mark, and the
 * section must carry SECURITY_DISCLAIMER.
 */
export const SECURITY_FRAMEWORKS = [
  "ISO 27001",
  "SOC 2",
  "PCI DSS",
  "HIPAA",
  "GDPR",
] as const;

export const SECURITY_DISCLAIMER =
  "These are the standards our teams build towards on client programmes.";
