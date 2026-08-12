/**
 * Credibility claims. Invariants 24, 32; plan §6.6.
 *
 * HARD RULE: a claim renders only when `verified` is true. Nothing here may be
 * invented, rounded up, or carried over from marketing copy without a source.
 * `source` records where the number came from so it can be re-checked.
 *
 * Flip `verified` to true only after Cube27 signs off on the exact wording.
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
    source: "Plan §6.6 / invariant 24 — awaiting Cube27 verification",
    verified: false,
  },
  {
    value: "8",
    label: "Role families",
    source: "Derived from src/data/roles.ts — structurally true",
    verified: true,
  },
  {
    value: "100+",
    label: "Brands served",
    source: "cube27.com src/content/site/facts.json (published)",
    verified: true,
  },
  {
    value: "150+",
    label: "Specialists across Cube27",
    source: "cube27.com src/content/site/facts.json (published)",
    verified: true,
  },
];

/** Only verified points reach a template. */
export const VERIFIED_PROOF = PROOF.filter((p) => p.verified);

/**
 * Trust module (logos, testimonials, case studies) stays dark until Cube27
 * approves real evidence. Invariant 23 forbids placeholder substitutes.
 */
export const TRUST_MODULE_ENABLED = false;
