/**
 * Cloudflare Turnstile verification. Always server-side — a client-side pass
 * proves nothing. Plan §14.1.
 * https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(
  token: string,
  secret: string | undefined,
  remoteIp?: string | null,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  // No secret configured means the challenge cannot be trusted. Fail closed:
  // an unverified submission must not reach the inbox.
  if (!secret) return { ok: false, reason: "missing-secret" };
  if (!token) return { ok: false, reason: "missing-token" };

  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (remoteIp) body.append("remoteip", remoteIp);

  let response: Response;
  try {
    response = await fetch(VERIFY_URL, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    return { ok: false, reason: "verify-unreachable" };
  }

  if (!response.ok)
    return { ok: false, reason: `verify-http-${response.status}` };

  const result = (await response.json().catch(() => null)) as {
    success?: boolean;
    "error-codes"?: string[];
  } | null;

  if (result?.success) return { ok: true };
  return {
    ok: false,
    reason: result?.["error-codes"]?.join(",") || "verify-failed",
  };
}
