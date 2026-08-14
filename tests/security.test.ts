import assert from "node:assert/strict";
import test from "node:test";
import { zipSync, strToU8 } from "fflate";
import { PDFDocument, PDFName, PDFString } from "pdf-lib";
import { validateResumeDocument } from "../functions/_shared/documents.ts";
import { parseBoundedFormData } from "../functions/_shared/request-body.ts";
import { onRequest as submitCandidate } from "../functions/api/candidate-application.ts";
import { onRequest as submitEmployer } from "../functions/api/employer-lead.ts";

function asArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

function streamedRequest(
  bytes: Uint8Array,
  headers: Record<string, string>,
): Request {
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      const midpoint = Math.floor(bytes.byteLength / 2);
      controller.enqueue(bytes.subarray(0, midpoint));
      controller.enqueue(bytes.subarray(midpoint));
      controller.close();
    },
  });

  return new Request("https://talent.cube27.com/api/test", {
    method: "POST",
    headers,
    body,
    duplex: "half",
  } as RequestInit & { duplex: "half" });
}

function docxBytes(parts: Record<string, string> = {}): Uint8Array {
  const files: Record<string, Uint8Array> = {
    "[Content_Types].xml": strToU8(
      '<?xml version="1.0" encoding="UTF-8"?>' +
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
        "</Types>",
    ),
    "_rels/.rels": strToU8(
      '<?xml version="1.0" encoding="UTF-8"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
        "</Relationships>",
    ),
    "word/document.xml": strToU8(
      '<?xml version="1.0" encoding="UTF-8"?>' +
        '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Resume</w:t></w:r></w:p></w:body></w:document>',
    ),
  };
  for (const [path, content] of Object.entries(parts)) {
    files[path] = strToU8(content);
  }
  return zipSync(files);
}

function docx(parts: Record<string, string> = {}): File {
  return new File([asArrayBuffer(docxBytes(parts))], "resume.docx", {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

/**
 * `validateResumeDocument` takes bytes, not a `File`, so the endpoint reads the
 * upload once. These tests still build `File`s because the endpoint tests below
 * need them, so unwrap here.
 */
async function resumeBytes(file: File): Promise<Uint8Array> {
  return new Uint8Array(await file.arrayBuffer());
}

/**
 * Rewrites the end-of-central-directory record so the archive only declares
 * its first `keepCount` entries. The local records left behind are still in
 * the stream, which is how a crafted DOCX gets more entries past a directory
 * check than it admits to.
 */
function hideZipEntriesFromDirectory(
  archive: Uint8Array,
  keepCount: number,
): Uint8Array {
  const bytes = archive.slice();
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  let eocd = -1;
  for (let offset = bytes.byteLength - 22; offset >= 0; offset--) {
    if (view.getUint32(offset, true) === 0x06054b50) {
      eocd = offset;
      break;
    }
  }
  assert.ok(eocd >= 0, "fixture archive has no end-of-central-directory");

  const directoryOffset = view.getUint32(eocd + 16, true);
  let cursor = directoryOffset;
  for (let index = 0; index < keepCount; index++) {
    const nameLength = view.getUint16(cursor + 28, true);
    const extraLength = view.getUint16(cursor + 30, true);
    const commentLength = view.getUint16(cursor + 32, true);
    cursor += 46 + nameLength + extraLength + commentLength;
  }

  view.setUint16(eocd + 8, keepCount, true);
  view.setUint16(eocd + 10, keepCount, true);
  view.setUint32(eocd + 12, cursor - directoryOffset, true);
  return bytes;
}

function underreportZipEntrySize(
  archive: Uint8Array,
  targetPath: string,
  reportedSize = 1,
): Uint8Array {
  const bytes = archive.slice();
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const decoder = new TextDecoder();

  for (let offset = 0; offset + 30 <= bytes.byteLength; offset++) {
    const signature = view.getUint32(offset, true);
    const isLocal = signature === 0x04034b50;
    const isCentral = signature === 0x02014b50;
    if (!isLocal && !isCentral) continue;

    const nameLength = view.getUint16(offset + (isLocal ? 26 : 28), true);
    const nameOffset = offset + (isLocal ? 30 : 46);
    const name = decoder.decode(
      bytes.subarray(nameOffset, nameOffset + nameLength),
    );
    if (name === targetPath) {
      view.setUint32(offset + (isLocal ? 22 : 24), reportedSize, true);
    }
  }

  return bytes;
}

test("bounded form parsing preserves a valid form submission", async () => {
  const request = new Request("https://talent.cube27.com/api/test", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: "name=Candidate&consent=yes",
  });

  const result = await parseBoundedFormData(request, 1024);

  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.form.get("name"), "Candidate");
});

test("bounded form parsing rejects a chunked body after the actual byte limit", async () => {
  const request = streamedRequest(
    new TextEncoder().encode(`name=${"a".repeat(128)}`),
    {
      "content-type": "application/x-www-form-urlencoded",
    },
  );

  const result = await parseBoundedFormData(request, 32);

  assert.deepEqual(result, { ok: false, reason: "too-large" });
});

test("bounded form parsing does not trust a falsely small Content-Length", async () => {
  const request = streamedRequest(
    new TextEncoder().encode(`name=${"a".repeat(128)}`),
    {
      "content-length": "8",
      "content-type": "application/x-www-form-urlencoded",
    },
  );

  const result = await parseBoundedFormData(request, 32);

  assert.deepEqual(result, { ok: false, reason: "too-large" });
});

test("resume validation accepts a clean generated PDF", async () => {
  const pdf = await PDFDocument.create();
  pdf.addPage().drawText("Candidate resume");
  const file = new File([asArrayBuffer(await pdf.save())], "resume.pdf", {
    type: "application/pdf",
  });

  assert.deepEqual(await validateResumeDocument(await resumeBytes(file)), {
    ok: true,
    format: "pdf",
  });
});

test("resume validation rejects an active PDF open action", async () => {
  const pdf = await PDFDocument.create();
  pdf.addPage();
  pdf.catalog.set(
    PDFName.of("OpenAction"),
    pdf.context.obj({
      S: PDFName.of("JavaScript"),
      JS: PDFString.of("app.alert('opened')"),
    }),
  );
  const file = new File([asArrayBuffer(await pdf.save())], "resume.pdf", {
    type: "application/pdf",
  });

  const result = await validateResumeDocument(await resumeBytes(file));

  assert.equal(result.ok, false);
});

test("resume validation rejects a PDF launch action", async () => {
  const pdf = await PDFDocument.create();
  pdf.addPage();
  pdf.catalog.set(
    PDFName.of("OpenAction"),
    pdf.context.obj({
      S: PDFName.of("Launch"),
      F: PDFString.of("cmd.exe"),
    }),
  );
  const file = new File([asArrayBuffer(await pdf.save())], "resume.pdf", {
    type: "application/pdf",
  });

  assert.deepEqual(await validateResumeDocument(await resumeBytes(file)), {
    ok: false,
    reason: "active-pdf-action",
  });
});

test("resume validation rejects an embedded-files entry", async () => {
  const pdf = await PDFDocument.create();
  pdf.addPage();
  pdf.catalog.set(
    PDFName.of("Names"),
    pdf.context.obj({ EmbeddedFiles: pdf.context.obj({ Names: [] }) }),
  );
  const file = new File([asArrayBuffer(await pdf.save())], "resume.pdf", {
    type: "application/pdf",
  });

  assert.deepEqual(await validateResumeDocument(await resumeBytes(file)), {
    ok: false,
    reason: "active-pdf-content",
  });
});

/**
 * The object walk exists precisely because a scan over raw bytes cannot see
 * names inside compressed object streams. `useObjectStreams: true` puts the
 * catalog into one, so this asserts two things at once: that the forbidden key
 * really is invisible in the raw bytes, and that validation catches it anyway.
 * If this test ever fails, the argument in operations.md §8.4 against replacing
 * the parser with pattern matching has stopped being true.
 */
test("resume validation sees forbidden keys inside a compressed object stream", async () => {
  const pdf = await PDFDocument.create();
  pdf.addPage();
  pdf.catalog.set(
    PDFName.of("OpenAction"),
    pdf.context.obj({
      S: PDFName.of("JavaScript"),
      JS: PDFString.of("app.alert('opened')"),
    }),
  );
  const bytes = await pdf.save({ useObjectStreams: true });

  const raw = new TextDecoder("latin1").decode(bytes);
  assert.ok(
    !raw.includes("/JavaScript"),
    "expected /JavaScript to be hidden inside a compressed object stream; " +
      "if it is visible in the raw bytes this test proves nothing",
  );

  const file = new File([asArrayBuffer(bytes)], "resume.pdf", {
    type: "application/pdf",
  });

  const result = await validateResumeDocument(await resumeBytes(file));
  assert.equal(result.ok, false);
});

test("resume validation accepts a structurally valid DOCX", async () => {
  assert.deepEqual(await validateResumeDocument(await resumeBytes(docx())), {
    ok: true,
    format: "docx",
  });
});

test("resume validation rejects an arbitrary ZIP renamed as DOCX", async () => {
  const file = new File(
    [asArrayBuffer(zipSync({ "payload.txt": strToU8("not a docx") }))],
    "resume.docx",
    {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
  );

  const result = await validateResumeDocument(await resumeBytes(file));

  assert.equal(result.ok, false);
});

test("resume validation rejects a compressed DOCX expansion bomb", async () => {
  const file = docx({
    "word/media/padding.bin": "a".repeat(1024 * 1024),
  });

  const result = await validateResumeDocument(await resumeBytes(file));

  assert.equal(result.ok, false);
});

test("resume validation bounds actual DOCX entry output when ZIP metadata lies", async () => {
  const path = "word/media/padding.bin";
  const archive = underreportZipEntrySize(
    docxBytes({ [path]: "a".repeat(10 * 1024 * 1024 + 1) }),
    path,
  );
  const file = new File([asArrayBuffer(archive)], "resume.docx", {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  assert.deepEqual(await validateResumeDocument(await resumeBytes(file)), {
    ok: false,
    reason: "entry-too-large",
  });
});

test("resume validation bounds cumulative DOCX output when ZIP metadata lies", async () => {
  const paths = [
    "word/media/padding-1.bin",
    "word/media/padding-2.bin",
    "word/media/padding-3.bin",
  ];
  let archive = docxBytes(
    Object.fromEntries(
      paths.map((path) => [path, "a".repeat(9 * 1024 * 1024)]),
    ),
  );
  for (const path of paths) archive = underreportZipEntrySize(archive, path);
  const file = new File([asArrayBuffer(archive)], "resume.docx", {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  assert.deepEqual(await validateResumeDocument(await resumeBytes(file)), {
    ok: false,
    reason: "expanded-document-too-large",
  });
});

test("resume validation rejects active or externally loaded DOCX relationships", async () => {
  const file = docx({
    "word/_rels/document.xml.rels":
      '<?xml version="1.0" encoding="UTF-8"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/attachedTemplate" Target="https://attacker.invalid/template.dotm" TargetMode="External"/>' +
      "</Relationships>",
  });

  const result = await validateResumeDocument(await resumeBytes(file));

  assert.equal(result.ok, false);
});

test("resume validation rejects trailing PDF polyglot content", async () => {
  const pdf = await PDFDocument.create();
  pdf.addPage();
  const validBytes = await pdf.save();
  const payload = new TextEncoder().encode("PKpayload");
  const polyglot = new Uint8Array(validBytes.byteLength + payload.byteLength);
  polyglot.set(validBytes);
  polyglot.set(payload, validBytes.byteLength);
  const file = new File([asArrayBuffer(polyglot)], "resume.pdf", {
    type: "application/pdf",
  });

  const result = await validateResumeDocument(await resumeBytes(file));

  assert.equal(result.ok, false);
});

test("resume validation rejects a DOCX streaming more entries than it declares", async () => {
  const filler: Record<string, string> = {};
  for (let index = 0; index < 520; index++) {
    filler[`word/filler-${index}.xml`] = `<f>entry ${index}</f>`;
  }
  // Declares 400 entries; the stream still carries all 523 local records.
  const archive = hideZipEntriesFromDirectory(docxBytes(filler), 400);
  const file = new File([asArrayBuffer(archive)], "resume.docx", {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  assert.deepEqual(await validateResumeDocument(await resumeBytes(file)), {
    ok: false,
    reason: "too-many-entries",
  });
});

test("candidate submission carries the optional GitHub profile into the recruitment email", async () => {
  const pdf = await PDFDocument.create();
  pdf.addPage().drawText("Candidate resume");

  const form = new FormData();
  form.set("name", "Alex Candidate");
  form.set("email", "alex@example.com");
  form.set("phone", "+44 20 7946 0958");
  form.set("location", "London, UK");
  form.set("roleFamily", "leadership");
  form.set("roleTitle", "Chief Technology Officer");
  form.set("skills", "Technology strategy, platform leadership");
  form.set("experience", "15");
  form.set("linkedin", "https://www.linkedin.com/in/alex-candidate");
  form.set("github", "https://github.com/alex-candidate");
  form.set("availability", "Within 30 days");
  form.set("workPreference", "Flexible");
  form.set("relocation", "Depends on the opportunity");
  form.set("consent", "yes");
  form.set("cf-turnstile-response", "verified-test-token");
  form.set(
    "resume",
    new File([asArrayBuffer(await pdf.save())], "alex-resume.pdf", {
      type: "application/pdf",
    }),
  );

  const resendPayloads: Array<Record<string, unknown>> = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : input.url;
    if (url.includes("challenges.cloudflare.com")) {
      return Response.json({ success: true });
    }
    if (url === "https://api.resend.com/emails") {
      resendPayloads.push(JSON.parse(String(init?.body)));
      return Response.json({ id: "email-test" });
    }
    throw new Error(`Unexpected request to ${url}`);
  };

  try {
    const response = await submitCandidate({
      request: new Request(
        "https://talent.cube27.com/api/candidate-application",
        {
          method: "POST",
          headers: {
            origin: "https://talent.cube27.com",
            "sec-fetch-site": "same-origin",
          },
          body: form,
        },
      ),
      env: {
        ENVIRONMENT: "test",
        RESEND_API_KEY: "test-key",
        RESEND_FROM: "Talent <talent@example.com>",
        RESEND_REPLY_TO: "talent@example.com",
        CANDIDATE_APPLICATIONS_TO: "recruitment@example.com",
        TURNSTILE_SECRET_KEY: "test-secret",
      },
    });

    assert.equal(response.status, 200);
    assert.equal(resendPayloads.length, 2);
    assert.match(
      String(resendPayloads[0]?.text),
      /GitHub \/ portfolio: https:\/\/github\.com\/alex-candidate/,
    );
    assert.match(
      String(resendPayloads[0]?.html),
      /https:\/\/github\.com\/alex-candidate/,
    );
    assert.equal(resendPayloads[1]?.attachments, undefined);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("employer submission carries a managed-team requirement into the sales email", async () => {
  const form = new FormData();
  form.set("name", "Priya Raghavan");
  form.set("email", "priya@example.com");
  form.set("company", "Example Global");
  form.set("jobTitle", "VP Talent Acquisition");
  form.set("country", "Netherlands");
  form.set("hires", "6–10");
  form.set("startWindow", "Within 30 days");
  form.set("engagement", "Full-time employment");
  form.set("arrangement", "Hybrid");
  form.append("roleFamilies", "business-operations");
  form.append("roleFamilies", "leadership");
  form.set(
    "requirement",
    "Build an operations leadership team across multiple markets.",
  );
  form.set("consent", "yes");
  form.set("cf-turnstile-response", "verified-test-token");

  const resendPayloads: Array<Record<string, unknown>> = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : input.url;
    if (url.includes("challenges.cloudflare.com")) {
      return Response.json({ success: true });
    }
    if (url === "https://api.resend.com/emails") {
      resendPayloads.push(JSON.parse(String(init?.body)));
      return Response.json({ id: "email-test" });
    }
    throw new Error(`Unexpected request to ${url}`);
  };

  try {
    const response = await submitEmployer({
      request: new Request("https://talent.cube27.com/api/employer-lead", {
        method: "POST",
        headers: {
          origin: "https://talent.cube27.com",
          "sec-fetch-site": "same-origin",
        },
        body: form,
      }),
      env: {
        ENVIRONMENT: "test",
        RESEND_API_KEY: "test-key",
        RESEND_FROM: "Talent <talent@example.com>",
        RESEND_REPLY_TO: "talent@example.com",
        EMPLOYER_LEADS_TO: "sales@example.com",
        TURNSTILE_SECRET_KEY: "test-secret",
      },
    });

    assert.equal(response.status, 200);
    assert.equal(resendPayloads.length, 2);
    assert.match(
      String(resendPayloads[0]?.text),
      /Role families: business-operations, leadership/,
    );
    assert.match(
      String(resendPayloads[0]?.text),
      /Build an operations leadership team across multiple markets\./,
    );
    assert.deepEqual(resendPayloads[0]?.to, ["sales@example.com"]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
