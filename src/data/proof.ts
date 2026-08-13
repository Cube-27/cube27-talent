/**
 * Credibility claims. Invariant 17.
 *
 * HARD RULE: a claim renders only when `verified` is true. Nothing here may be
 * invented, rounded up, or carried over from marketing copy without a source.
 * `source` records where the number came from so it can be re-checked.
 *
 * Flip `verified` to true only after the exact wording is signed off. Two of
 * the three below are waiting on that sign-off, and unblocking them is a launch
 * checklist item — the hero is thin with one stat and strong with three.
 *
 * Labels carry no company name — invariant rule 0.1.
 */

export interface ProofPoint {
  value: string;
  label: string;
  source: string;
  verified: boolean;
}

export const PROOF: ProofPoint[] = [
  {
    value: "200+",
    label: "Positions filled",
    source: "Invariant 17 — awaiting sign-off on exact wording",
    verified: false,
  },
  {
    value: "10+",
    label: "Years serving global clients",
    source: "Invariant 17 — awaiting sign-off on exact wording",
    verified: false,
  },
  {
    value: "150+",
    label: "Brands served",
    source:
      "cube27.com src/content/site/facts.json (published as 'Brands we helped')",
    verified: true,
  },
  // Removed: "8 role families". The count is now 7 and, more importantly, a
  // published count of disciplines contradicts invariant rule 0.3 — it reads as
  // a boundary on what we recruit. Do not re-add it.
  //
  // Removed: "150+ specialists". The parent site publishes 150+ as "brands we
  // helped", a brands figure and not a headcount. It is already the source for
  // the stat above. Do not re-add it without a headcount we will stand behind.
];

/** Only verified points reach a template. */
export const VERIFIED_PROOF = PROOF.filter((p) => p.verified);

/**
 * Trust module (logos, testimonials, case studies) stays dark until real
 * evidence is approved. Invariant 18 forbids placeholder substitutes.
 */
export const TRUST_MODULE_ENABLED = false;
