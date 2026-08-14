/**
 * schema.org payloads, built in one place so every page emits the same entity
 * shape and a change lands once. Passed to `Layout`'s `jsonLd` prop, which
 * hands them to `Seo.astro`.
 *
 * Claim rules from plan §16.1 apply here exactly as they do to visible copy:
 * only verified facts, no employee counts, ratings, awards or delivery-time
 * promises. Structured data is a claim to a search engine and is held to the
 * same standard as a claim to a reader.
 */

import { ROUTES, SITE_CONFIG } from "@/site-config";
import type { Faq } from "@/data/faqs";
import { ROLE_FAMILIES } from "@/data/roles";
import { PROCESS_PHASES } from "@/data/process";

type Schema = Record<string, unknown>;

const absolute = (path: string) =>
  path.startsWith("http") ? path : `${SITE_CONFIG.url}${path}`;

/** Stable @id so the other schemas can reference the same entity. */
const ORGANIZATION_ID = `${SITE_CONFIG.url}/#organization`;
const WEBSITE_ID = `${SITE_CONFIG.url}/#website`;
const SERVICE_ID = `${SITE_CONFIG.url}/#service`;

export function organizationSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_CONFIG.brand,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/og-image.png`,
    description: SITE_CONFIG.description,
    email: SITE_CONFIG.organization.email,
    knowsAbout: [
      "Managed Talent Acquisition",
      "Executive Search",
      "Software Engineering Staffing",
      "Cloud & Platform Engineering",
      "Data & AI Talent",
      "Workforce Compliance Coordination",
      "Payroll & Workforce Administration",
      "Culture Onboarding",
      "Cross-Functional Team Scaling",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: SITE_CONFIG.organization.email,
      contactType: "customer service",
      availableLanguage: ["English"],
    },
    parentOrganization: {
      "@type": "Organization",
      name: SITE_CONFIG.organization.legalName,
      url: SITE_CONFIG.organization.parentSite,
    },
    address: {
      "@type": "PostalAddress",
      ...SITE_CONFIG.organization.address,
    },
    sameAs: SITE_CONFIG.organization.sameAs,
  };
}

/**
 * No SearchAction: the site has no search endpoint, and claiming one that does
 * not exist is the most common way this schema is got wrong.
 */
export function websiteSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_CONFIG.brand,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    inLanguage: "en",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/**
 * Mirrors the FAQ block rendered on the page. Marking up an answer that is not
 * visible is a guidelines violation, so both must come from the same array.
 */
export function faqSchema(items: Faq[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/**
 * The service, described without pricing or turnaround claims. `Service`
 * rather than `Product` because nothing here is a purchasable unit.
 */
export function serviceSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": SERVICE_ID,
    name: "Managed talent and team building",
    serviceType: "Managed talent acquisition and team building",
    provider: { "@id": ORGANIZATION_ID },
    areaServed: "Worldwide",
    description:
      "Specialists, complete teams and leaders assessed through role-specific work and practitioner interviews, with ongoing workforce compliance support.",
    url: absolute(ROUTES.hire),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Talent Acquisition & Team Building Disciplines",
      itemListElement: ROLE_FAMILIES.map((family) => ({
        "@type": "OfferCatalog",
        name: family.name,
        description: family.blurb,
      })),
    },
  };
}

/**
 * The 4-phase assessment and shortlisting process marked up with HowTo schema.
 */
export function howToHiringProcessSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Evidence-Based Candidate Assessment & Shortlisting",
    description:
      "A structured 4-phase process to assess candidates through role-specific work and practitioner interviews.",
    step: PROCESS_PHASES.map((phase, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: phase.name,
      itemListElement: [
        {
          "@type": "HowToDirection",
          text: `${phase.summary} Key elements: ${phase.points.join(", ")}.`,
        },
      ],
    })),
  };
}
