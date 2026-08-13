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

type Schema = Record<string, unknown>;

const absolute = (path: string) =>
  path.startsWith("http") ? path : `${SITE_CONFIG.url}${path}`;

/** Stable @id so the other schemas can reference the same entity. */
const ORGANIZATION_ID = `${SITE_CONFIG.url}/#organization`;
const WEBSITE_ID = `${SITE_CONFIG.url}/#website`;

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
 * The trail always starts at the home page; pass only the pages below it.
 * Every route in V1 is one level deep, so this is normally a single entry.
 */
export function breadcrumbSchema(
  trail: { name: string; path: string }[],
): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: ROUTES.home }, ...trail].map(
      (crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: absolute(crumb.path),
      }),
    ),
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
 * What Cube27 sells, described without pricing or turnaround claims. `Service`
 * rather than `Product` because nothing here is a purchasable unit.
 */
export function serviceSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Managed engineering talent",
    serviceType: "Technical recruitment and employer of record",
    provider: { "@id": ORGANIZATION_ID },
    areaServed: "Worldwide",
    description:
      "Cube27 screens and technically interviews engineering, QA, DevOps, product and design talent, employs them, and runs their payroll. The client directs the work and decides who stays.",
    url: absolute(ROUTES.hire),
  };
}
