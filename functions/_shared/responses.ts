/**
 * Shared response helpers and security headers for both endpoints.
 * Mirrors the hardening already in place on cube27.com's contact function.
 */

export const SECURITY_HEADERS = {
  "content-security-policy":
    "default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
  // Matches public/_headers. Both hosts serve the same origin, so a visitor
  // whose first request is an API call must get the same HSTS policy as one
  // who lands on a page.
  "strict-transport-security": "max-age=31536000; includeSubDomains",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy":
    "accelerometer=(), autoplay=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
  "cross-origin-opener-policy": "same-origin-allow-popups",
  "cross-origin-resource-policy": "same-origin",
} as const;

export function json(
  body: Record<string, unknown>,
  status = 200,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      ...SECURITY_HEADERS,
      ...extraHeaders,
    },
  });
}

/** Everything except POST. Plan §13.1. */
export function methodNotAllowed(): Response {
  return json({ ok: false, error: "Method not allowed." }, 405, {
    allow: "POST",
  });
}

/**
 * Same-origin enforcement. `ALLOWED_HOSTS` is a comma-separated allow-list so
 * preview deployments can be permitted explicitly rather than by wildcard.
 */
export function isAllowedOrigin(
  request: Request,
  allowedHosts: string | undefined,
): boolean {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");

  if (fetchSite && !["same-origin", "none"].includes(fetchSite)) {
    return false;
  }

  if (!origin) return true;

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }

  if (originHost === requestUrl.host) return true;

  const allowed = (allowedHosts ?? "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);

  return allowed.includes(originHost.toLowerCase());
}

/**
 * Submission reference shown to the user and quoted in the internal email so
 * a lead can be traced through the inbox and the internal tracker. Plan §10.
 */
export function submissionId(prefix: string): string {
  const random = crypto
    .randomUUID()
    .replace(/-/g, "")
    .slice(0, 8)
    .toUpperCase();
  const stamp = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  return `${prefix}-${stamp}-${random}`;
}
