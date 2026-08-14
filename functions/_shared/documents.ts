import {
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFName,
  type PDFObject,
} from "pdf-lib";
import { Unzip, UnzipInflate } from "fflate";

export type ResumeFormat = "pdf" | "docx";

export type ResumeValidation =
  { ok: true; format: ResumeFormat } | { ok: false; reason: string };

const MAX_DOCX_ENTRIES = 500;
const MAX_DOCX_EXPANDED_BYTES = 25 * 1024 * 1024;
const MAX_DOCX_ENTRY_BYTES = 10 * 1024 * 1024;
const MAX_DOCX_COMPRESSION_RATIO = 100;
const MAX_PDF_OBJECTS = 10_000;
const MAX_PDF_PAGES = 200;

const FORBIDDEN_DOCX_PATHS = [
  /^word\/vbaProject\.bin$/i,
  /^word\/embeddings\//i,
  /^word\/activeX\//i,
  /^word\/webExtensions\//i,
  /^customUI\//i,
  /\.(?:exe|dll|com|scr|msi|hta|js|vbs|ps1|bat|cmd|jar)$/i,
];

const FORBIDDEN_RELATIONSHIP_TYPES = new Set([
  "attachedtemplate",
  "control",
  "customui",
  "externallink",
  "oleobject",
  "package",
  "vbaproject",
  "webextension",
]);

const FORBIDDEN_PDF_KEYS = new Set([
  "AA",
  "EF",
  "EmbeddedFiles",
  "JavaScript",
  "JS",
  "Launch",
  "RichMedia",
  "RichMediaContent",
  "RichMediaSettings",
  "XFA",
]);

const FORBIDDEN_PDF_ACTIONS = new Set([
  "GoToR",
  "ImportData",
  "JavaScript",
  "Launch",
  "Movie",
  "Rendition",
  "RichMediaExecute",
  "Sound",
  "SubmitForm",
]);

function readU16(view: DataView, offset: number): number {
  return view.getUint16(offset, true);
}

function readU32(view: DataView, offset: number): number {
  return view.getUint32(offset, true);
}

function findEndOfCentralDirectory(bytes: Uint8Array): number {
  const minimumOffset = Math.max(0, bytes.length - 65_557);
  for (let offset = bytes.length - 22; offset >= minimumOffset; offset--) {
    if (
      bytes[offset] === 0x50 &&
      bytes[offset + 1] === 0x4b &&
      bytes[offset + 2] === 0x05 &&
      bytes[offset + 3] === 0x06
    ) {
      return offset;
    }
  }
  return -1;
}

function inspectZipDirectory(bytes: Uint8Array): string | null {
  const eocdOffset = findEndOfCentralDirectory(bytes);
  if (eocdOffset < 0) return "missing-zip-directory";

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const entryCount = readU16(view, eocdOffset + 10);
  const directorySize = readU32(view, eocdOffset + 12);
  const directoryOffset = readU32(view, eocdOffset + 16);

  if (
    entryCount === 0xffff ||
    directorySize === 0xffffffff ||
    directoryOffset === 0xffffffff
  ) {
    return "zip64-not-allowed";
  }
  if (entryCount === 0 || entryCount > MAX_DOCX_ENTRIES) {
    return "invalid-entry-count";
  }
  if (directoryOffset + directorySize > eocdOffset) {
    return "invalid-zip-directory";
  }

  const decoder = new TextDecoder("utf-8", { fatal: true });
  const names = new Set<string>();
  let cursor = directoryOffset;
  let expandedBytes = 0;

  for (let index = 0; index < entryCount; index++) {
    if (cursor + 46 > eocdOffset || readU32(view, cursor) !== 0x02014b50) {
      return "invalid-central-entry";
    }

    const flags = readU16(view, cursor + 8);
    const method = readU16(view, cursor + 10);
    const compressedBytes = readU32(view, cursor + 20);
    const uncompressedBytes = readU32(view, cursor + 24);
    const nameLength = readU16(view, cursor + 28);
    const extraLength = readU16(view, cursor + 30);
    const commentLength = readU16(view, cursor + 32);
    const localOffset = readU32(view, cursor + 42);
    const nextCursor = cursor + 46 + nameLength + extraLength + commentLength;

    if (nextCursor > eocdOffset) return "invalid-central-entry";
    if ((flags & 0x0001) !== 0) return "encrypted-archive";
    if (method !== 0 && method !== 8) return "unsupported-compression";
    if (uncompressedBytes > MAX_DOCX_ENTRY_BYTES) return "entry-too-large";
    if (compressedBytes === 0 && uncompressedBytes > 0) {
      return "invalid-compression-ratio";
    }
    if (
      compressedBytes > 0 &&
      uncompressedBytes / compressedBytes > MAX_DOCX_COMPRESSION_RATIO
    ) {
      return "compression-ratio-too-high";
    }

    expandedBytes += uncompressedBytes;
    if (expandedBytes > MAX_DOCX_EXPANDED_BYTES) {
      return "expanded-document-too-large";
    }

    let name: string;
    try {
      name = decoder.decode(
        bytes.subarray(cursor + 46, cursor + 46 + nameLength),
      );
    } catch {
      return "invalid-entry-name";
    }
    const normalizedName = name.toLowerCase();
    if (
      !name ||
      name.includes("\\") ||
      name.includes("\0") ||
      name.startsWith("/") ||
      name.split("/").includes("..") ||
      names.has(normalizedName)
    ) {
      return "unsafe-entry-name";
    }
    names.add(normalizedName);

    if (
      localOffset + 30 > directoryOffset ||
      readU32(view, localOffset) !== 0x04034b50
    ) {
      return "invalid-local-entry";
    }
    const localNameLength = readU16(view, localOffset + 26);
    const localExtraLength = readU16(view, localOffset + 28);
    const localNameStart = localOffset + 30;
    const localDataStart = localNameStart + localNameLength + localExtraLength;
    let localName: string;
    try {
      localName = decoder.decode(
        bytes.subarray(localNameStart, localNameStart + localNameLength),
      );
    } catch {
      return "invalid-local-entry";
    }
    if (
      localName !== name ||
      localDataStart + compressedBytes > directoryOffset
    ) {
      return "mismatched-local-entry";
    }

    cursor = nextCursor;
  }

  return cursor === directoryOffset + directorySize
    ? null
    : "invalid-zip-directory-size";
}

function decodeXml(bytes: Uint8Array): string | null {
  if (bytes.byteLength > 2 * 1024 * 1024) return null;
  try {
    const xml = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    if (/<!DOCTYPE|<!ENTITY/i.test(xml)) return null;
    return xml;
  } catch {
    return null;
  }
}

function xmlAttribute(tag: string, name: string): string | null {
  const match = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, "i"));
  return match?.[1] ?? null;
}

function validateRelationships(path: string, xml: string): string | null {
  let hasOfficeDocument = path === "_rels/.rels" ? false : undefined;

  for (const match of xml.matchAll(/<Relationship\b[^>]*>/gi)) {
    const tag = match[0];
    const type = xmlAttribute(tag, "Type") ?? "";
    const target = xmlAttribute(tag, "Target") ?? "";
    const targetMode = xmlAttribute(tag, "TargetMode") ?? "";
    const relationshipName = type.split("/").pop()?.toLowerCase() ?? "";

    if (FORBIDDEN_RELATIONSHIP_TYPES.has(relationshipName)) {
      return "unsafe-relationship";
    }
    if (
      targetMode.toLowerCase() === "external" &&
      relationshipName !== "hyperlink"
    ) {
      return "unsafe-external-relationship";
    }
    if (
      path === "_rels/.rels" &&
      relationshipName === "officedocument" &&
      target.replace(/^\//, "").toLowerCase() === "word/document.xml" &&
      targetMode.toLowerCase() !== "external"
    ) {
      hasOfficeDocument = true;
    }
  }

  return hasOfficeDocument === false
    ? "missing-office-document-relationship"
    : null;
}

type DocxExtraction =
  | { ok: true; entries: Record<string, Uint8Array> }
  | { ok: false; reason: string };

function unzipDocxBounded(bytes: Uint8Array): DocxExtraction {
  const entries: Record<string, Uint8Array> = {};
  let expandedBytes = 0;
  let discoveredEntries = 0;
  let completedEntries = 0;
  let failure: string | null = null;

  const unzip = new Unzip((file) => {
    discoveredEntries++;
    // The central directory is checked against the same cap, but it only
    // describes the entries it chooses to declare. The stream can still carry
    // unreferenced local records, so the cap is enforced here too — before
    // any of this entry's bytes are inflated.
    if (discoveredEntries > MAX_DOCX_ENTRIES) {
      failure = "too-many-entries";
      throw new Error(failure);
    }

    let entryBytes = 0;
    const chunks: Uint8Array[] = [];

    file.ondata = (error, chunk, final) => {
      // Throwing stops the synchronous decoder immediately. UnzipInflate
      // reports callback errors once more, so preserve the original reason.
      if (failure) throw new Error(failure);
      if (error) {
        failure = "invalid-zip";
        throw error;
      }

      entryBytes += chunk.byteLength;
      if (entryBytes > MAX_DOCX_ENTRY_BYTES) {
        failure = "entry-too-large";
        throw new Error(failure);
      }

      expandedBytes += chunk.byteLength;
      if (expandedBytes > MAX_DOCX_EXPANDED_BYTES) {
        failure = "expanded-document-too-large";
        throw new Error(failure);
      }

      chunks.push(chunk);
      if (!final) return;

      const entry = new Uint8Array(entryBytes);
      let offset = 0;
      for (const part of chunks) {
        entry.set(part, offset);
        offset += part.byteLength;
      }
      entries[file.name] = entry;
      completedEntries++;
    };
    file.start();
  });
  unzip.register(UnzipInflate);

  try {
    unzip.push(bytes, true);
  } catch {
    return { ok: false, reason: failure ?? "invalid-zip" };
  }

  if (failure) return { ok: false, reason: failure };
  if (discoveredEntries === 0 || completedEntries !== discoveredEntries) {
    return { ok: false, reason: "invalid-zip" };
  }
  return { ok: true, entries };
}

function validateDocx(bytes: Uint8Array): ResumeValidation {
  const directoryError = inspectZipDirectory(bytes);
  if (directoryError) return { ok: false, reason: directoryError };

  const extraction = unzipDocxBounded(bytes);
  if (!extraction.ok) return extraction;
  const { entries } = extraction;

  const required = ["[Content_Types].xml", "_rels/.rels", "word/document.xml"];
  if (required.some((path) => !entries[path])) {
    return { ok: false, reason: "missing-docx-parts" };
  }

  for (const path of Object.keys(entries)) {
    if (FORBIDDEN_DOCX_PATHS.some((pattern) => pattern.test(path))) {
      return { ok: false, reason: "unsafe-docx-part" };
    }
    if (
      !path.toLowerCase().endsWith(".xml") &&
      !path.toLowerCase().endsWith(".rels")
    ) {
      continue;
    }
    const xml = decodeXml(entries[path]);
    if (xml === null) return { ok: false, reason: "invalid-docx-xml" };
    if (/macroEnabled|vbaProject|activeX|oleObject/i.test(xml)) {
      return { ok: false, reason: "active-docx-content" };
    }
    if (path.toLowerCase().endsWith(".rels")) {
      const relationshipError = validateRelationships(path, xml);
      if (relationshipError) return { ok: false, reason: relationshipError };
    }
  }

  const contentTypes = decodeXml(entries["[Content_Types].xml"]);
  if (
    contentTypes === null ||
    !/ContentType\s*=\s*["']application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document\.main\+xml["']/i.test(
      contentTypes,
    )
  ) {
    return { ok: false, reason: "invalid-docx-content-types" };
  }

  return { ok: true, format: "docx" };
}

function lastIndexOfAscii(bytes: Uint8Array, text: string): number {
  const pattern = new TextEncoder().encode(text);
  outer: for (
    let offset = bytes.length - pattern.length;
    offset >= 0;
    offset--
  ) {
    for (let index = 0; index < pattern.length; index++) {
      if (bytes[offset + index] !== pattern[index]) continue outer;
    }
    return offset;
  }
  return -1;
}

function inspectPdfObject(object: PDFObject): string | null {
  if (object instanceof PDFDict) {
    for (const [key, value] of object.entries()) {
      const keyName = key.asString().replace(/^\//, "");
      if (FORBIDDEN_PDF_KEYS.has(keyName)) return "active-pdf-content";
      if (
        keyName === "S" &&
        value instanceof PDFName &&
        FORBIDDEN_PDF_ACTIONS.has(value.asString().replace(/^\//, ""))
      ) {
        return "active-pdf-action";
      }
      if (value instanceof PDFDict || value instanceof PDFArray) {
        const nestedError = inspectPdfObject(value);
        if (nestedError) return nestedError;
      }
    }
  } else if (object instanceof PDFArray) {
    for (let index = 0; index < object.size(); index++) {
      const value = object.get(index);
      if (value instanceof PDFDict || value instanceof PDFArray) {
        const nestedError = inspectPdfObject(value);
        if (nestedError) return nestedError;
      }
    }
  }
  return null;
}

async function validatePdf(bytes: Uint8Array): Promise<ResumeValidation> {
  if (
    bytes.byteLength < 8 ||
    new TextDecoder("ascii")
      .decode(bytes.subarray(0, 8))
      .match(/^%PDF-[12]\.[0-9]/) === null
  ) {
    return { ok: false, reason: "invalid-pdf-header" };
  }

  const eofOffset = lastIndexOfAscii(bytes, "%%EOF");
  if (eofOffset < 0) return { ok: false, reason: "missing-pdf-eof" };
  for (const byte of bytes.subarray(eofOffset + 5)) {
    if (![0x00, 0x09, 0x0a, 0x0c, 0x0d, 0x20].includes(byte)) {
      return { ok: false, reason: "trailing-pdf-content" };
    }
  }

  try {
    const document = await PDFDocument.load(bytes, {
      ignoreEncryption: false,
      updateMetadata: false,
    });
    if (document.isEncrypted) return { ok: false, reason: "encrypted-pdf" };
    if (
      document.getPageCount() === 0 ||
      document.getPageCount() > MAX_PDF_PAGES
    ) {
      return { ok: false, reason: "invalid-pdf-page-count" };
    }

    const objects = document.context.enumerateIndirectObjects();
    if (objects.length > MAX_PDF_OBJECTS) {
      return { ok: false, reason: "too-many-pdf-objects" };
    }
    for (const [, object] of objects) {
      const objectError = inspectPdfObject(object);
      if (objectError) return { ok: false, reason: objectError };
    }
  } catch {
    return { ok: false, reason: "invalid-pdf" };
  }

  return { ok: true, format: "pdf" };
}

/**
 * Validate bounded resume bytes as a structurally safe PDF or DOCX.
 *
 * Takes the bytes rather than the `File` so the caller reads the upload once.
 * Reading it here and again for the base64 encode meant two full 5 MiB copies
 * live at the same time, on top of the buffered request body and the DOCX
 * inflate budget.
 */
export async function validateResumeDocument(
  bytes: Uint8Array,
): Promise<ResumeValidation> {
  if (bytes[0] === 0x25 && bytes[1] === 0x50) return validatePdf(bytes);
  if (bytes[0] === 0x50 && bytes[1] === 0x4b) return validateDocx(bytes);
  return { ok: false, reason: "unsupported-document" };
}
