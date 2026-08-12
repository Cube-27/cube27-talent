/**
 * POST /api/candidate-application — candidate profile with resume. Plan §13.5.
 *
 * Resume handling (§9.3): validated by extension, declared MIME type and file
 * signature; filename sanitised; sent only to the recruitment inbox; never
 * written to disk, logged, or given a public URL.
 */

import {
  json,
  methodNotAllowed,
  isAllowedOrigin,
  submissionId,
} from "../_shared/responses";
import {
  MAX_BODY_BYTES,
  MAX_RESUME_BYTES,
  asText,
  checkLine,
  checkBlock,
  isEmail,
  isPhone,
  inAllowList,
  attribution,
  safeFilename,
} from "../_shared/validation";
import { validateResumeDocument } from "../_shared/documents";
import { parseBoundedFormData } from "../_shared/request-body";
import { verifyTurnstile } from "../_shared/turnstile";
// Single source of truth for the taxonomy — see the note in src/data/roles.ts.
import { ROLE_FAMILY_IDS } from "../../src/data/roles";
import {
  sendEmail,
  htmlRows,
  textRows,
  wrapHtml,
  headerSafe,
} from "../_shared/email";

interface Env {
  ENVIRONMENT?: string;
  ALLOWED_HOSTS?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  RESEND_REPLY_TO?: string;
  CANDIDATE_APPLICATIONS_TO?: string;
  TURNSTILE_SECRET_KEY?: string;
}

const AVAILABILITY = [
  "Immediately",
  "Within 30 days",
  "30–60 days",
  "60–90 days",
  "Just exploring",
] as const;
const WORK_PREFERENCE = ["Remote", "Hybrid", "Onsite", "Flexible"] as const;
const RELOCATION = ["Yes", "No", "Depends on the opportunity"] as const;

const ALLOWED_EXTENSIONS = [".pdf", ".docx"];
const ALLOWED_MIME = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const GENERIC_ERROR = "We could not send your application. Please try again.";

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

  const parsed = await parseBoundedFormData(
    request,
    MAX_RESUME_BYTES + MAX_BODY_BYTES,
  );
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

  if (asText(form.get("website"))) return json({ ok: true });

  const turnstile = await verifyTurnstile(
    asText(form.get("cf-turnstile-response")),
    env.TURNSTILE_SECRET_KEY,
    request.headers.get("cf-connecting-ip"),
  );
  if (!turnstile.ok) {
    console.error(`candidate: turnstile rejected (${turnstile.reason})`);
    return json(
      { ok: false, error: "Verification failed. Please try again." },
      403,
    );
  }

  const name = asText(form.get("name"));
  const email = asText(form.get("email"));
  const phone = asText(form.get("phone"));
  const location = asText(form.get("location"));
  const roleFamily = asText(form.get("roleFamily"));
  const roleTitle = asText(form.get("roleTitle"));
  const skills = asText(form.get("skills"));
  const experience = asText(form.get("experience"));
  const linkedin = asText(form.get("linkedin"));
  const availability = asText(form.get("availability"));
  const workPreference = asText(form.get("workPreference"));
  const relocation = asText(form.get("relocation"));
  const note = asText(form.get("note"));
  const consent = asText(form.get("consent"));
  // Separate, unticked-by-default consent to keep the profile on file.
  // Plan §9.2 — must never be pre-selected or bundled with the first consent.
  const retentionConsent = asText(form.get("retentionConsent")) === "yes";

  const experienceYears = Number(experience);

  const valid =
    checkLine(name, 100) &&
    isEmail(email) &&
    isPhone(phone) &&
    checkLine(location, 120) &&
    inAllowList(roleFamily, ROLE_FAMILY_IDS) &&
    checkLine(roleTitle, 120) &&
    checkLine(skills, 300) &&
    Number.isFinite(experienceYears) &&
    experienceYears >= 0 &&
    experienceYears <= 60 &&
    checkLine(linkedin, 300, { required: false }) &&
    inAllowList(availability, AVAILABILITY) &&
    inAllowList(workPreference, WORK_PREFERENCE) &&
    inAllowList(relocation, RELOCATION) &&
    (!note || checkBlock(note, 0, 1500)) &&
    consent === "yes";

  if (!valid) {
    return json(
      { ok: false, error: "Please complete every required field." },
      422,
    );
  }

  const resume = form.get("resume");
  if (!(resume instanceof File) || resume.size === 0) {
    return json({ ok: false, error: "Please attach a resume." }, 422);
  }
  if (resume.size > MAX_RESUME_BYTES) {
    return json(
      { ok: false, error: "The resume must be 5 MB or smaller." },
      413,
    );
  }

  const lowerName = resume.name.toLowerCase();
  const extensionOk = ALLOWED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
  const mimeOk = ALLOWED_MIME.includes(resume.type);
  const document = await validateResumeDocument(resume);
  const formatMatchesExtension =
    document.ok &&
    ((document.format === "pdf" && lowerName.endsWith(".pdf")) ||
      (document.format === "docx" && lowerName.endsWith(".docx")));

  if (!extensionOk || !mimeOk || !document.ok || !formatMatchesExtension) {
    if (!document.ok) {
      console.warn(`candidate: resume rejected (${document.reason})`);
    }
    return json({ ok: false, error: "Please attach a PDF or DOCX file." }, 415);
  }

  const missing = [
    !env.RESEND_API_KEY && "RESEND_API_KEY",
    !env.RESEND_FROM && "RESEND_FROM",
    !env.CANDIDATE_APPLICATIONS_TO && "CANDIDATE_APPLICATIONS_TO",
  ].filter(Boolean);
  if (missing.length) {
    console.error(`candidate: missing env ${missing.join(", ")}`);
    return json({ ok: false, error: "The form is not configured." }, 503);
  }

  const id = submissionId("CAN");
  const attr = attribution(form);
  const environment = env.ENVIRONMENT ?? "unknown";
  const envTag =
    environment === "production" ? "" : `[${environment.toUpperCase()}]`;

  // Base64 in chunks — String.fromCharCode(...bytes) on a 5 MiB array blows
  // the argument limit.
  const bytes = new Uint8Array(await resume.arrayBuffer());
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  const encoded = btoa(binary);

  const filename = safeFilename(
    resume.name,
    `${id}${document.format === "pdf" ? ".pdf" : ".docx"}`,
  );

  const fields: [string, string][] = [
    ["Submission", id],
    ["Name", name],
    ["Email", email],
    ["Phone", phone],
    ["Location", location],
    ["Role family", roleFamily],
    ["Target role", roleTitle],
    ["Core skills", skills],
    ["Experience (years)", String(experienceYears)],
    ["LinkedIn", linkedin],
    ["Availability", availability],
    ["Work preference", workPreference],
    ["Open to relocation", relocation],
    ["Note", note],
    ["Retention consent", retentionConsent ? "Yes" : "No"],
    ["Landing page", attr.landingPage],
    ["Referrer", attr.referrer],
    ["utm_source", attr.utmSource],
    ["utm_campaign", attr.utmCampaign],
    ["Received", new Date().toISOString()],
    ["Environment", environment],
  ];

  const internal = await sendEmail({
    apiKey: env.RESEND_API_KEY!,
    from: env.RESEND_FROM!,
    to: env.CANDIDATE_APPLICATIONS_TO!,
    replyTo: headerSafe(email),
    subject: `${envTag}[Candidate][${roleFamily}] ${headerSafe(name)} — ${id}`,
    text: textRows(fields),
    html: wrapHtml(`New candidate application — ${id}`, htmlRows(fields)),
    attachments: [{ filename, content: encoded }],
  });

  if (!internal.ok) {
    console.error(`candidate: internal send failed (${internal.reason}) ${id}`);
    return json({ ok: false, error: GENERIC_ERROR }, 502);
  }

  // Acknowledgement never carries the resume back to the applicant.
  const ack = await sendEmail({
    apiKey: env.RESEND_API_KEY!,
    from: env.RESEND_FROM!,
    to: headerSafe(email),
    replyTo: env.RESEND_REPLY_TO,
    subject: `Cube27 Talent — application received (${id})`,
    text: [
      `Hello ${name},`,
      "",
      "Your profile has reached Cube27 Talent.",
      "",
      "Cube27 will consider it against suitable client requirements and will contact you if there is a relevant next step. Submitting a profile does not guarantee screening, an interview, employment or an assignment.",
      "",
      "To correct or delete your profile, reply to this address.",
      "",
      `Your reference is ${id}.`,
      "",
      "— Cube27 Talent",
    ].join("\n"),
    html: wrapHtml(
      "Application received",
      htmlRows([
        ["Reference", id],
        ["Target role", roleTitle],
        [
          "Next",
          "Cube27 will consider your profile against suitable client requirements and will contact you if there is a relevant next step. Submitting a profile does not guarantee screening, an interview, employment or an assignment.",
        ],
      ]),
    ),
  });

  if (!ack.ok) {
    console.error(`candidate: ack send failed (${ack.reason}) ${id}`);
  }

  return json({ ok: true, id });
};
