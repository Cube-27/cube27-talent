/**
 * POST /api/employer-lead — streamlined employer enquiry.
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
  attribution,
} from "../_shared/validation.ts";
import { parseBoundedFormData } from "../_shared/request-body.ts";
import { verifyTurnstile } from "../_shared/turnstile.ts";
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

const GENERIC_ERROR = "We could not send your enquiry. Please try again.";

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
  const requirement = asText(form.get("requirement"));

  const valid =
    checkLine(name, 100) &&
    isEmail(email) &&
    checkLine(company, 200) &&
    (!requirement || checkBlock(requirement, 1, 4000));

  if (!valid) {
    return json(
      {
        ok: false,
        error: "Please enter your name, company, and a valid work email.",
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
    ["Company", company],
    ["Requirement", requirement || "Not provided"],
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
    subject: `${envTag}[Employer] ${headerSafe(company)} — ${id}`,
    text: textRows(fields),
    html: wrapHtml(`New employer enquiry — ${id}`, htmlRows(fields)),
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
    subject: `Cube27 Talent — enquiry received (${id})`,
    text: [
      `Hello ${name},`,
      "",
      "Thank you for your interest in Cube27 Talent. Your enquiry has reached us.",
      "",
      "We will review your enquiry and come back to you using the details you supplied. Sending an enquiry does not by itself start an engagement.",
      "",
      `Your reference is ${id}.`,
      "",
      "— Cube27 Talent",
    ].join("\n"),
    html: wrapHtml(
      "Thank you — Enquiry received",
      htmlRows([
        ["Reference", id],
        ["Company", company],
        [
          "Status",
          "Thank you for your interest in Cube27 Talent. We have received your enquiry.",
        ],
        [
          "Next",
          "We will review your enquiry and come back to you using the details you supplied. Sending an enquiry does not by itself start an engagement.",
        ],
      ]),
    ),
  });

  if (!ack.ok) {
    console.error(`employer-lead: ack send failed (${ack.reason}) ${id}`);
  }

  return json({ ok: true, id });
};
