export type ParsedFormData =
  { ok: true; form: FormData } | { ok: false; reason: "invalid" | "too-large" };

const FORM_CONTENT_TYPES = [
  "application/x-www-form-urlencoded",
  "multipart/form-data",
];

/**
 * Read and count the actual request bytes before parsing form data. This keeps
 * a missing, false, or chunked Content-Length value from bypassing the route's
 * resource budget.
 */
export async function parseBoundedFormData(
  request: Request,
  maxBytes: number,
): Promise<ParsedFormData> {
  const contentType = request.headers.get("content-type") ?? "";
  const mediaType = contentType.split(";", 1)[0].trim().toLowerCase();
  if (!FORM_CONTENT_TYPES.includes(mediaType)) {
    return { ok: false, reason: "invalid" };
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength !== null) {
    if (!/^\d+$/.test(contentLength)) return { ok: false, reason: "invalid" };
    const declaredBytes = Number(contentLength);
    if (!Number.isSafeInteger(declaredBytes)) {
      return { ok: false, reason: "invalid" };
    }
    if (declaredBytes > maxBytes) return { ok: false, reason: "too-large" };
  }

  if (!request.body) return { ok: false, reason: "invalid" };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel("request-body-limit").catch(() => undefined);
        return { ok: false, reason: "too-large" };
      }
      chunks.push(value);
    }
  } catch {
    return { ok: false, reason: "invalid" };
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const boundedRequest = new Request(request.url, {
      method: "POST",
      headers: { "content-type": contentType },
      body,
    });
    return { ok: true, form: await boundedRequest.formData() };
  } catch {
    return { ok: false, reason: "invalid" };
  }
}
