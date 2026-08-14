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
    source: "Approved for publication on 13 August 2026",
    verified: true,
  },
  {
    value: "150+",
    label: "Brands served",
    source: "Published parent-site figure and approved for talent-site use",
    verified: true,
  },
  {
    value: "10+ years",
    label: "Serving global clients",
    source: "Approved for publication on 13 August 2026",
    verified: true,
  },
];

export const VERIFIED_PROOF = PROOF.filter((point) => point.verified);
