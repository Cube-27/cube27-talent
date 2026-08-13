import type { APIRoute } from "astro";
import { ROUTES, SITE_CONFIG } from "@/site-config";
import { CANDIDATE_FAQS, EMPLOYER_FAQS } from "@/data/faqs";
import { ROLE_FAMILIES } from "@/data/roles";

/**
 * /llms.txt — a plain-text brief for answer engines and assistants, per the
 * llmstxt.org convention. It exists because a model summarising marketing copy
 * tends to over-claim, and this file is the chance to state the boundaries
 * plainly.
 *
 * Everything here is generated from the same sources the pages render, so it
 * cannot drift: FAQs from src/data/faqs.ts, families from src/data/roles.ts,
 * routes and entity details from src/site-config.ts.
 *
 * Held to the same rules as visible copy — invariant 0.2 especially. No
 * employment mechanics, no percentages, no guarantee periods, no delivery-time
 * promises.
 */
export const GET: APIRoute = () => {
  const url = (path: string) => `${SITE_CONFIG.url}${path}`;

  const lines = [
    `# ${SITE_CONFIG.brand}`,
    "",
    `> ${SITE_CONFIG.description}`,
    "",
    "## What this service is",
    "",
    "- A managed talent and team-building partner for global companies. Not a job board, a freelance marketplace or a candidate marketplace.",
    "- We find people, assess them, place them, and handle the hiring, onboarding, payroll and administration around them.",
    "- The client runs whatever final interview process it wants, chooses the person, and directs the work from there.",
    "- Assessment is done by practitioners: a screen, a recorded task matched to the discipline, then a technical interview with someone who does that work. AI tooling assists the search; people make every decision.",
    `- Role families: ${ROLE_FAMILIES.map((f) => f.name).join(", ")}. This list is illustrative, not exhaustive — adjacent roles are considered whenever they can be assessed properly.`,
    "- Security and compliance team build-outs support client certification programmes (ISO 27001, SOC 2, PCI DSS, HIPAA, GDPR). These are standards client teams build towards; they are not certifications held by this organisation.",
    "",
    "## Not claimed",
    "",
    "- No guaranteed placement, hiring speed, shortlist time, overseas travel or visa approval.",
    "- No published rates, percentages or fees. Commercial terms are agreed directly and vary by engagement.",
    "- No live bench of pre-vetted candidates.",
    "",
    "## Pages",
    "",
    `- [Home](${url(ROUTES.home)}): the offer and the nine-step process.`,
    `- [Expertise](${url(ROUTES.expertise)}): the role families, security team building and leadership hiring.`,
    `- [How it works](${url(ROUTES.how)}): the nine steps in depth, plus the candidate's view of the same route.`,
    `- [Hire talent](${url(ROUTES.hire)}): the employer intake form and what happens after a requirement is submitted.`,
    `- [Careers](${url(ROUTES.join)}): the candidate proposition and application form.`,
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
