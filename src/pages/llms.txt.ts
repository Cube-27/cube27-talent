import type { APIRoute } from "astro";
import { ROUTES, SITE_CONFIG } from "@/site-config";
import { CANDIDATE_FAQS, EMPLOYER_FAQS } from "@/data/faqs";
import { ROLE_FAMILIES } from "@/data/roles";

export const GET: APIRoute = () => {
  const url = (path: string) => `${SITE_CONFIG.url}${path}`;

  const lines = [
    `# ${SITE_CONFIG.brand}`,
    "",
    `> ${SITE_CONFIG.description}`,
    "",
    "## What this service is",
    "",
    "- Managed hiring for specialists, complete teams, and leaders.",
    "- Recorded role-specific assessments and practitioner interviews.",
    "- Focused shortlists with evidence.",
    "- AI supports sourcing and screening. People make every decision.",
    "- Optional onboarding and employee lifecycle support.",
    `- Example areas: ${ROLE_FAMILIES.map((family) => family.name).join(", ")}. The list is illustrative rather than exhaustive.`,
    "- We build security and compliance teams that help clients work toward ISO 27001, SOC 2, PCI DSS, HIPAA, GDPR, and related standards. These are not certifications held by this organization.",
    "",
    "## Approved proof",
    "",
    "- 200+ positions filled.",
    "- 150+ brands served.",
    "- 10+ years serving global clients.",
    "",
    "## Not claimed",
    "",
    "- No assured placement, hiring speed, shortlist timing, overseas travel, relocation, or visa approval.",
    "- No published pricing or commercial structure.",
    "- No live candidate inventory, marketplace, or software platform.",
    "",
    "## Pages",
    "",
    `- [Home](${url(ROUTES.home)}): managed hiring, proof, expertise, and support.`,
    `- [How we hire](${url(ROUTES.how)}): role-specific assessment and selection.`,
    `- [Expertise](${url(ROUTES.expertise)}): cross-functional hiring, security teams, and leadership search.`,
    `- [Build your team](${url(ROUTES.hire)}): the employer requirement form.`,
    `- [For talent](${url(ROUTES.join)}): the candidate proposition and application.`,
    "",
    "## Questions from employers",
    "",
    ...EMPLOYER_FAQS.flatMap((faq) => [`### ${faq.q}`, "", faq.a, ""]),
    "## Questions from candidates",
    "",
    ...CANDIDATE_FAQS.flatMap((faq) => [`### ${faq.q}`, "", faq.a, ""]),
    "## Contact",
    "",
    `- General and candidate enquiries: ${SITE_CONFIG.organization.email}`,
    `- Data protection and privacy requests: ${SITE_CONFIG.organization.privacyEmail}`,
    `- Parent company: ${SITE_CONFIG.organization.parentSite}`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};
