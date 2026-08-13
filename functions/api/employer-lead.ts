/**
 * POST /api/employer-lead — structured hiring requirement. Plan §13.4.
 *
 * Sequence: method → origin → size → parse → honeypot → Turnstile →
 * validate → id → internal email (critical) → acknowledgement (best effort).
 */

import {
  json,
  methodNotAllowed,
  isAllowedOrigin,
  submissionId,
} from "../_shared/responses.ts";
import {
  MAX_BODY_BYTES,
  asText,
  checkLine,
  checkBlock,
  isEmail,
  inAllowList,
  attribution,
} from "../_shared/validation.ts";
import { parseBoundedFormData } from "../_shared/request-body.ts";
import { verifyTurnstile } from "../_shared/turnstile.ts";
// Single source of truth for the taxonomy — see the note in src/data/roles.ts.
import { ROLE_FAMILY_IDS } from "../../src/data/roles.ts";
import {
  sendEmail,
  htmlRows,
  textRows,
  wrapHtml,
  headerSafe,
} from "../_shared/email.ts";

interface Env {
  ENVIRONMENT?: string;
  ALLOWED_HOSTS?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  RESEND_REPLY_TO?: string;
  EMPLOYER_LEADS_TO?: string;
  TURNSTILE_SECRET_KEY?: string;
}

const HIRE_COUNTS = ["1", "2–5", "6–10", "11–25", "25+"] as const;
const START_WINDOWS = [
  "As soon as possible",
  "Within 30 days",
  "1–3 months",
  "Planning ahead",
] as const;
const ENGAGEMENTS = ["Full-time employment", "Either", "Contract"] as const;
const ARRANGEMENTS = [
  "Remote",
  "Hybrid",
  "Onsite",
  "Relocation",
  "Flexible",
] as const;
const GENERIC_ERROR = "We could not send your requirement. Please try again.";

export const onRequest = async ({
  request,
  env,
}: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  if (request.method !== "POST") return methodNotAllowed();

  if (!isAllowedOrigin(request, env.ALLOWED_HOSTS)) {
    return json({ ok: false, error: "Cross-origin submission denied." }, 403);
  }

  const parsed = await parseBoundedFormData(request, MAX_BODY_BYTES);
  if (!parsed.ok) {
    if (parsed.reason === "too-large") {
      return json({ ok: false, error: "Submission is too large." }, 413);
    }
    return json(
      { ok: false, error: "Please send a valid form submission." },
      400,
    );
  }
  const form = parsed.form;

  // Honeypot: report success so a bot has no signal to tune against, but
  // send nothing.
  if (asText(form.get("website"))) return json({ ok: true });

  const turnstile = await verifyTurnstile(
    asText(form.get("cf-turnstile-response")),
    env.TURNSTILE_SECRET_KEY,
    request.headers.get("cf-connecting-ip"),
  );
  if (!turnstile.ok) {
    console.error(`employer-lead: turnstile rejected (${turnstile.reason})`);
    return json(
      { ok: false, error: "Verification failed. Please try again." },
      403,
    );
  }

  const name = asText(form.get("name"));
  const email = asText(form.get("email"));
  const company = asText(form.get("company"));
  const jobTitle = asText(form.get("jobTitle"));
  const country = asText(form.get("country"));
  const hires = asText(form.get("hires"));
  const startWindow = asText(form.get("startWindow"));
  const engagement = asText(form.get("engagement"));
  const arrangement = asText(form.get("arrangement"));
  const requirement = asText(form.get("requirement"));
  const consent = asText(form.get("consent"));
  const roleFamilies = form
    .getAll("roleFamilies")
    .map((value) => asText(value))
    .filter((value) => inAllowList(value, ROLE_FAMILY_IDS));

  const valid =
    checkLine(name, 100) &&
    isEmail(email) &&
    checkLine(company, 200) &&
    checkLine(jobTitle, 120) &&
    checkLine(country, 80) &&
    inAllowList(hires, HIRE_COUNTS) &&
    inAllowList(startWindow, START_WINDOWS) &&
    inAllowList(engagement, ENGAGEMENTS) &&
    inAllowList(arrangement, ARRANGEMENTS) &&
    checkBlock(requirement, 20, 4000) &&
    roleFamilies.length > 0 &&
    consent === "yes";

  if (!valid) {
    return json(
      {
        ok: false,
        error:
          "Please complete every required field, including at least one role family and the privacy acknowledgement.",
      },
      422,
    );
  }

  const missing = [
    !env.RESEND_API_KEY && "RESEND_API_KEY",
    !env.RESEND_FROM && "RESEND_FROM",
    !env.EMPLOYER_LEADS_TO && "EMPLOYER_LEADS_TO",
  ].filter(Boolean);
  if (missing.length) {
    console.error(`employer-lead: missing env ${missing.join(", ")}`);
    return json({ ok: false, error: "The form is not configured." }, 503);
  }

  const id = submissionId("EMP");
  const attr = attribution(form);
  const environment = env.ENVIRONMENT ?? "unknown";
  const envTag =
    environment === "production" ? "" : `[${environment.toUpperCase()}]`;

  const fields: [string, string][] = [
    ["Submission", id],
    ["Name", name],
    ["Email", email],
    ["Job title", jobTitle],
    ["Company", company],
    ["Country", country],
    ["Positions", hires],
    ["Role families", roleFamilies.join(", ")],
    ["Engagement", engagement],
    ["Arrangement", arrangement],
    ["Target start", startWindow],
    ["Requirement", requirement],
    ["Landing page", attr.landingPage],
    ["Referrer", attr.referrer],
    ["utm_source", attr.utmSource],
    ["utm_medium", attr.utmMedium],
    ["utm_campaign", attr.utmCampaign],
    ["utm_content", attr.utmContent],
    ["utm_term", attr.utmTerm],
    ["Received", new Date().toISOString()],
    ["Environment", environment],
  ];

  // Critical send. If this fails the lead is lost, so the user must see an
  // error rather than a confirmation page. Plan §13.7.
  const internal = await sendEmail({
    apiKey: env.RESEND_API_KEY!,
    from: env.RESEND_FROM!,
    to: env.EMPLOYER_LEADS_TO!,
    replyTo: headerSafe(email),
    subject: `${envTag}[Employer][${hires}] ${headerSafe(company)} — ${id}`,
    text: textRows(fields),
    html: wrapHtml(`New hiring requirement — ${id}`, htmlRows(fields)),
  });

  if (!internal.ok) {
    console.error(
      `employer-lead: internal send failed (${internal.reason}) ${id}`,
    );
    return json({ ok: false, error: GENERIC_ERROR }, 502);
  }

  // Acknowledgement is best effort — a failure here is logged but must not
  // discard a lead that already reached the inbox. Plan §8.3.
  const ack = await sendEmail({
    apiKey: env.RESEND_API_KEY!,
    from: env.RESEND_FROM!,
    to: headerSafe(email),
    replyTo: env.RESEND_REPLY_TO,
    subject: `Cube27 Talent — requirement received (${id})`,
    text: [
      `Hello ${name},`,
      "",
      "Your hiring requirement has reached us.",
      "",
      "We will read it properly, work out whether we can assess the role well, and come back to you either way using the details you supplied. Sending a requirement does not by itself start an engagement.",
      "",
      `Your reference is ${id}.`,
      "",
      "— Cube27 Talent",
    ].join("\n"),
    html: wrapHtml(
      "Requirement received",
      htmlRows([
        ["Reference", id],
        ["Company", company],
        [
          "Next",
          "We will read it properly, work out whether we can assess the role well, and come back to you either way using the details you supplied. Sending a requirement does not by itself start an engagement.",
        ],
      ]),
    ),
  });

  if (!ack.ok) {
    console.error(`employer-lead: ack send failed (${ack.reason}) ${id}`);
  }

  return json({ ok: true, id });
};
