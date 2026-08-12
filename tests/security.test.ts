import assert from "node:assert/strict";
import test from "node:test";
import { zipSync, strToU8 } from "fflate";
import { PDFDocument, PDFName, PDFString } from "pdf-lib";
import { validateResumeDocument } from "../functions/_shared/documents.ts";
import { parseBoundedFormData } from "../functions/_shared/request-body.ts";

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

  assert.deepEqual(await validateResumeDocument(file), {
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

  const result = await validateResumeDocument(file);

  assert.equal(result.ok, false);
});

test("resume validation accepts a structurally valid DOCX", async () => {
  assert.deepEqual(await validateResumeDocument(docx()), {
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

  const result = await validateResumeDocument(file);

  assert.equal(result.ok, false);
});

test("resume validation rejects a compressed DOCX expansion bomb", async () => {
  const file = docx({
    "word/media/padding.bin": "a".repeat(1024 * 1024),
  });

  const result = await validateResumeDocument(file);

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

  assert.deepEqual(await validateResumeDocument(file), {
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

  assert.deepEqual(await validateResumeDocument(file), {
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

  const result = await validateResumeDocument(file);

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

  const result = await validateResumeDocument(file);

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

  assert.deepEqual(await validateResumeDocument(file), {
    ok: false,
    reason: "too-many-entries",
  });
});
