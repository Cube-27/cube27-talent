import { readFileSync } from "node:fs";
import { globSync } from "node:fs";
import { certificationFixtures } from "./check-content.fixtures.mjs";

const sourceFiles = globSync("src/**/*.{astro,ts,css}");
const source = sourceFiles.map((file) => [file, readFileSync(file, "utf8")]);

const certificationPositioningPattern =
  /\bcertification (?:ownership|program(?:me)?s?)\b/gi;
const certificationBoundaryPattern =
  /\b(?:compliance|this) coordination does not (?:imply|constitute) legal advice, certification ownership, or universal legal liability\./gi;

const forbiddenSourcePatterns = [
  [/nine[ -]step/gi, "count-based hiring-process terminology"],
  [/step\s+\d+\s+of\s+\d+/gi, "numbered accessible process labels"],
  [
    /work hardware|laptop(?:s)? provided|equipment procurement/gi,
    "hardware terms",
  ],
  [/removal from|replacement search|guarantee period/gi, "contractual terms"],
  [
    /employer of record|legal employer|employment (?:contract|agreement|terms?)/gi,
    "employment-contract mechanics",
  ],
  [
    /\bfees?\b|\bmark-?ups?\b|\bpercent(?:age)? fees?\b|\brate cards?\b/gi,
    "fees, markups and rate cards",
  ],
  [
    /\btermination\b|\bdismissal\b|\bnotice (?:period|terms?)\b/gi,
    "termination, dismissal and notice terms",
  ],
  [
    /responsibility (?:matrix|matrices)|division[- ]of[- ]dut(?:y|ies)/gi,
    "responsibility matrices",
  ],
  [/managed engineering staffing/gi, "engineering-only positioning"],
  [
    /\bsecurity hiring\b|\bsecurity teams?\b|\bsecurity functions?\b/gi,
    "obsolete security-hiring positioning",
  ],
  [
    certificationPositioningPattern,
    "obsolete certification-programme positioning",
  ],
  [/\/expertise\//gi, "retired expertise route"],
];

const staleDocumentationPatterns = [
  /The nine steps — public/gi,
  /motion budget goes to the nine steps/gi,
  /\bstep\s+\d+\b/gi,
  /rounded-card rules/gi,
  /candidate snapshot.*hero/gi,
  /managed engineering staffing/gi,
  /laptop provided|replacement guarantee|employer of record/gi,
];

const failures = [];

for (const fixture of certificationFixtures) {
  const matcher = new RegExp(
    certificationPositioningPattern.source,
    certificationPositioningPattern.flags,
  );
  if (!matcher.test(fixture.text)) {
    failures.push(`content fixture not rejected: ${fixture.name}`);
  }
}

for (const [file, text] of source) {
  for (const [pattern, label] of forbiddenSourcePatterns) {
    const content =
      pattern === certificationPositioningPattern
        ? text.replace(certificationBoundaryPattern, "")
        : text;
    const matches = content.match(pattern);
    if (matches) failures.push(`${file}: ${label}: ${matches.join(", ")}`);
  }
}

for (const file of [
  "docs/cube27-talent-product-invariants-revised.md",
  "docs/cube27-talent-v1-plan-revised.md",
  "docs/design-system.md",
]) {
  const text = readFileSync(file, "utf8");
  for (const pattern of staleDocumentationPatterns) {
    const matches = text.match(pattern);
    if (matches)
      failures.push(`${file}: stale instruction: ${matches.join(", ")}`);
  }
}

if (failures.length) {
  console.error(
    "Content gate failed:\n" + failures.map((item) => `- ${item}`).join("\n"),
  );
  process.exit(1);
}

console.log(`Content gate passed across ${sourceFiles.length} source files.`);
