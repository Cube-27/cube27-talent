/**
 * Resend delivery. Plan §13.
 *
 * Two rules encoded here:
 *  - the internal notification is the critical send; if it fails the caller
 *    must not report success (§13.7);
 *  - user input is escaped before it enters HTML email (§14.2).
 */

const RESEND_URL = "https://api.resend.com/emails";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Header-injection guard for anything placed in a subject or address. */
export function headerSafe(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export interface Attachment {
  filename: string;
  /** Base64, no data: prefix. */
  content: string;
}

export interface SendOptions {
  apiKey: string;
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
  attachments?: Attachment[];
}

export async function sendEmail(
  options: SendOptions,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  let response: Response;
  try {
    response = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: options.from,
        to: [options.to],
        reply_to: options.replyTo,
        subject: headerSafe(options.subject),
        text: options.text,
        html: options.html,
        attachments: options.attachments,
      }),
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.name : "network-error",
    };
  }

  if (!response.ok) return { ok: false, reason: `http-${response.status}` };
  return { ok: true };
}

/** Definition-list rows for the internal notification. */
export function htmlRows(fields: [string, string][]): string {
  return fields
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#56617a;font-size:13px;vertical-align:top;white-space:nowrap">${escapeHtml(
          label,
        )}</td><td style="padding:6px 0;color:#0b192c;font-size:14px">${escapeHtml(
          value,
        ).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");
}

export function textRows(fields: [string, string][]): string {
  return fields
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

export function wrapHtml(title: string, bodyHtml: string): string {
  return `<!doctype html><html><body style="margin:0;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<div style="max-width:640px;margin:0 auto;padding:24px">
<h1 style="margin:0 0 16px;font-size:18px;color:#0b192c">${escapeHtml(title)}</h1>
<table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px">${bodyHtml}</table>
</div></body></html>`;
}
