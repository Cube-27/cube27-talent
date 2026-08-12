/**
 * The V1 role taxonomy. Plan §4.
 *
 * This is the only definition of the role families. The expertise selector,
 * the employer form's category chips, the candidate form, and the server-side
 * validation allow-list all derive from it, so a family cannot exist in the
 * form but not in the validator.
 */

export interface RoleFamily {
  /** Stable id. Submitted by the forms and validated on the server. */
  id: string;
  name: string;
  /** Short label for form chips, where the full name is too long. */
  short: string;
  /** Icon key, resolved by components/ui/Icon.astro. */
  icon: string;
  /** How this family is assessed. Must stay operationally true. Plan §7.3. */
  blurb: string;
  roles: string[];
}

export const ROLE_FAMILIES: RoleFamily[] = [
  {
    id: "software-engineering",
    name: "Software engineering",
    short: "Engineering",
    icon: "code",
    blurb:
      "Product engineering across the stack, assessed with a build task matched to the role.",
    roles: [
      "Frontend",
      "Backend",
      "Full-stack",
      "Data engineering",
      "AI / ML",
      "Integration",
      "Engineering leadership",
    ],
  },
  {
    id: "mobile",
    name: "Mobile",
    short: "Mobile",
    icon: "phone",
    blurb:
      "Native and cross-platform mobile, assessed on real device and release concerns.",
    roles: ["iOS", "Android", "React Native", "Flutter"],
  },
  {
    id: "quality-engineering",
    name: "Quality engineering",
    short: "QA",
    icon: "check",
    blurb:
      "Test strategy and automation, assessed on coverage design rather than tool trivia.",
    roles: [
      "Manual QA",
      "QA automation",
      "SDET",
      "Performance testing",
      "Test leadership",
    ],
  },
  {
    id: "cloud-infrastructure",
    name: "Cloud and infrastructure",
    short: "DevOps",
    icon: "cloud",
    blurb:
      "Platform and reliability work, assessed on failure modes and operational design.",
    roles: [
      "DevOps",
      "Cloud engineering",
      "Site reliability engineering",
      "Platform engineering",
      "Infrastructure automation",
    ],
  },
  {
    id: "product",
    name: "Product",
    short: "Product",
    icon: "board",
    blurb:
      "Delivery-connected product roles, assessed with a product judgement exercise.",
    roles: ["Product management", "Product ownership", "Business analysis"],
  },
  {
    id: "design",
    name: "Design",
    short: "Design",
    icon: "pen",
    blurb:
      "Product design roles, assessed through portfolio review and a design task.",
    roles: ["Product design", "UX design", "UI design", "UX research"],
  },
  {
    id: "enterprise-content",
    name: "Enterprise content",
    short: "ECMS",
    icon: "doc",
    blurb:
      "Content platform engineering, assessed only where Cube27 has credible screening coverage.",
    roles: [
      "ECMS specialists",
      "CMS implementation",
      "Content platform engineering",
      "Workflow integration",
    ],
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    short: "E-commerce",
    icon: "cart",
    blurb:
      "Commerce platform and storefront engineering, assessed on integration and scale concerns.",
    roles: [
      "E-commerce developers",
      "Headless commerce",
      "Storefront engineering",
      "Commerce integration",
    ],
  },
];

/** Allow-list for server-side validation of submitted role families. */
export const ROLE_FAMILY_IDS = ROLE_FAMILIES.map((f) => f.id);

/** Out of scope by default. Plan §4.8. */
export const OUT_OF_SCOPE = [
  "Sales",
  "Marketing",
  "Finance",
  "General HR",
  "Administration",
  "Non-technical mass hiring",
];
