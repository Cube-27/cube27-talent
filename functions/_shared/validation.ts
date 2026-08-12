/**
 * Server-side validation. The browser's constraints are for usability only —
 * every rule that matters is enforced here. Plan §11.2, §14.1.
 */

export const MAX_BODY_BYTES = 32_768;
export const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5 MiB. Plan §9.2.

export function asText(value: FormDataEntryValue | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Rejects control characters, which are the usual vehicle for header
 * injection when a value is interpolated into an email subject or address.
 */
export function hasControlCharacters(value: string, allowLineBreaks = false) {
  for (const character of value) {
    const code = character.charCodeAt(0);
    if (
      code === 127 ||
      (code < 32 && (!allowLineBreaks || ![9, 10, 13].includes(code)))
    ) {
      return true;
    }
  }
  return false;
}

export function isEmail(value: string): boolean {
  return value.length <= 320 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isPhone(value: string): boolean {
  return /^[+()0-9.\s-]{7,50}$/.test(value);
}

/** Single-line field: required, length-capped, no control characters. */
export function checkLine(
  value: string,
  max: number,
  { required = true }: { required?: boolean } = {},
): boolean {
  if (!value) return !required;
  return value.length <= max && !hasControlCharacters(value);
}

/** Multi-line field: line breaks allowed, min and max length enforced. */
export function checkBlock(value: string, min: number, max: number): boolean {
  return (
    value.length >= min &&
    value.length <= max &&
    !hasControlCharacters(value, true)
  );
}

/** Values must come from a known list — never trusted from the client. */
export function inAllowList(
  value: string,
  allowed: readonly string[],
): boolean {
  return allowed.includes(value);
}

/** Attribution: truncated, sanitised, and never used for anything but reporting. */
export function attribution(form: FormData) {
  const clean = (name: string) =>
    asText(form.get(name))
      .replace(/[\r\n]+/g, " ")
      .slice(0, 200);

  return {
    landingPage: clean("landingPage"),
    referrer: clean("referrer"),
    utmSource: clean("utmSource"),
    utmMedium: clean("utmMedium"),
    utmCampaign: clean("utmCampaign"),
    utmContent: clean("utmContent"),
    utmTerm: clean("utmTerm"),
  };
}

/** File-signature check. Extension and MIME type alone are trivially forged. */
export async function looksLikeAllowedDocument(
  file: File,
): Promise<"pdf" | "docx" | null> {
  const header = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  // %PDF
  if (
    header[0] === 0x25 &&
    header[1] === 0x50 &&
    header[2] === 0x44 &&
    header[3] === 0x46
  ) {
    return "pdf";
  }
  // PK.. — docx is a zip container. Narrowed further by extension + MIME.
  if (header[0] === 0x50 && header[1] === 0x4b) return "docx";
  return null;
}

/** Strips path components and anything that could confuse a mail client. */
export function safeFilename(name: string, fallback: string): string {
  const base = name.split(/[\\/]/).pop() ?? "";
  const cleaned = base
    .replace(/[^\w.\- ]+/g, "_")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
  return cleaned && /\.[a-z0-9]{2,5}$/i.test(cleaned) ? cleaned : fallback;
}
