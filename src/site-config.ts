/**
 * Site-wide constants. Routes, contact details and metadata live here so a
 * change lands in one file rather than across page templates. Plan §11.1.
 */

export const SITE_CONFIG = {
  /** Long descriptive name — homepage <title> and default page title. */
  name: "Cube27 Talent — Managed engineering talent for global companies",
  /** Short brand, appended to sub-page titles: "Expertise | Cube27 Talent". */
  brand: "Cube27 Talent",
  /** Canonical production origin, no trailing slash. Matches astro.config `site`. */
  url: "https://talent.cube27.com",
  description:
    "Cube27 Talent screens and technically interviews engineering, QA, DevOps, product and design talent, employs them, and runs their payroll. The client directs the work and decides who stays.",
  organization: {
    /** PENDING: confirm the exact contracting entity before legal pages ship. */
    legalName: "Cube27 IT Pvt. Ltd.",
    parentSite: "https://www.cube27.com",
    email: "talent@cube27.com",
    /** PENDING: confirm the privacy contact address. */
    privacyEmail: "privacy@cube27.com",
    address: {
      streetAddress: "Plot 12, Mulberry Garden 1, Magarpatta City, Hadapsar",
      addressLocality: "Pune",
      addressRegion: "Maharashtra",
      postalCode: "411013",
      addressCountry: "IN",
    },
    sameAs: ["https://www.linkedin.com/company/cube27ltd"],
  },
} as const;

/** Every route in V1. Plan §11. */
export const ROUTES = {
  home: "/",
  hire: "/hire-talent/",
  join: "/join-talent-network/",
  how: "/how-it-works/",
  expertise: "/expertise/",
  privacy: "/privacy/",
  terms: "/terms/",
  thankYouEmployer: "/thank-you/employer/",
  thankYouCandidate: "/thank-you/candidate/",
} as const;

export const NAV_LINKS = [
  { label: "Expertise", href: ROUTES.expertise },
  { label: "How it works", href: ROUTES.how },
  { label: "Hire talent", href: ROUTES.hire },
  { label: "Careers", href: ROUTES.join },
] as const;

/** API endpoints served by Cloudflare Pages Functions. Plan §13.1. */
export const ENDPOINTS = {
  employerLead: "/api/employer-lead",
  candidateApplication: "/api/candidate-application",
} as const;
