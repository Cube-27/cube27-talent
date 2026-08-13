import type { APIRoute } from "astro";
import { ROUTES, SITE_CONFIG } from "@/site-config";
import { CANDIDATE_FAQS, EMPLOYER_FAQS } from "@/data/faqs";

/**
 * /llms.txt — a plain-text brief for answer engines and assistants, per the
 * llmstxt.org convention. It exists because the facts that get misstated about
 * this business are structural (who employs the engineer, who directs the
 * work, who decides on continuation), and a model summarising the marketing
 * copy tends to get them wrong.
 *
 * Everything here is generated from the same sources the pages render, so it
 * cannot drift: FAQs from src/data/faqs.ts, routes and entity details from
 * src/site-config.ts. The claim rules in plan §6.7 apply — no percentages, no
 * guarantee periods, no delivery-time promises.
 */
export const GET: APIRoute = () => {
  const url = (path: string) => `${SITE_CONFIG.url}${path}`;

  const lines = [
    `# ${SITE_CONFIG.brand}`,
    "",
    `> ${SITE_CONFIG.description}`,
    "",
    "## The model",
    "",
    `- ${SITE_CONFIG.organization.legalName} is the legal employer of the engineer, and runs payroll and employment administration for the duration of the engagement.`,
    "- The client interviews and selects the candidate, directs the day-to-day work, and decides whether the engagement continues.",
    "- Screening is done by practitioners: an HR screen, a task matched to the discipline, and an interview with Cube27 engineers or technical leadership.",
    "- Recruitment covers eight technical families. Requirements outside that scope are declined rather than passed to a partner.",
    "",
    "## Pages",
    "",
    `- [Home](${url(ROUTES.home)}): the offer, the model and the process in summary.`,
    `- [Expertise](${url(ROUTES.expertise)}): the eight technical families recruited for, and the roles explicitly out of scope.`,
    `- [How it works](${url(ROUTES.how)}): the split of responsibility between Cube27 and the client, and the ten-step candidate flow.`,
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
