/**
 * Site-wide constants. Routes, contact details and metadata live here so a
 * change lands in one file rather than across page templates. Plan §11.1.
 */

export const SITE_CONFIG = {
  /**
   * Long descriptive name — homepage <title> and default page title.
   *
   * The brand strings and the organisation block below are the ONLY places the
   * company name is allowed to appear (invariant rule 0.1). Everything the
   * visitor reads as prose is first person plural.
   */
  name: "Cube27 Talent — build the team your business needs",
  /** Short brand, appended to sub-page titles: "Expertise | Cube27 Talent". */
  brand: "Cube27 Talent",
  /** Canonical production origin, no trailing slash. Matches astro.config `site`. */
  url: "https://talent.cube27.com",
  description:
    "We build specialists, complete teams, and leaders assessed through role-specific work and practitioner interviews.",
  // Entity, privacy contact and address all match the published policy at
  // ROUTES.privacy, which is the notice this site links to from both consent
  // checkboxes. Change them only alongside that page.
  organization: {
    legalName: "Cube27 IT Pvt. Ltd.",
    parentSite: "https://www.cube27.com",
    email: "talent@cube27.com",
    /** The contact the published privacy policy names for data requests. */
    privacyEmail: "contact@cube27.com",
    address: {
      streetAddress:
        "Plot No. 12, Mulberry Gardens 1, Magarpatta City, Hadapsar",
      addressLocality: "Pune",
      addressRegion: "Maharashtra",
      postalCode: "411013",
      addressCountry: "IN",
    },
    sameAs: ["https://www.linkedin.com/company/cube27ltd"],
  },
} as const;

/**
 * Master switch for search indexing. `false` until the site is launched: every
 * page renders `noindex, nofollow` and robots.txt stops advertising the
 * sitemap, on production as well as preview.
 *
 * To go live, flip this to `true` AND remove the `X-Robots-Tag` line from the
 * `/*` block in `public/_headers`. The header is a backstop that covers
 * non-HTML responses (sitemap, images), and it wins over the meta tag — leaving
 * it in place would keep the whole site out of the index no matter what this
 * flag says. The `/thank-you/*` header block stays either way.
 */
export const INDEXING_ENABLED = false;

/** Every route in V1. Plan §11. */
export const ROUTES = {
  home: "/",
  hire: "/hire-talent/",
  join: "/join-talent-network/",
  how: "/how-it-works/",
  expertise: "/expertise/",
  csr: "https://www.cube27.com/csr/",
  privacy: "https://www.cube27.com/privacy-policy/",
  terms: "https://www.cube27.com/terms-of-service/",
  thankYouEmployer: "/thank-you/employer/",
  thankYouCandidate: "/thank-you/candidate/",
} as const;

export const NAV_LINKS = [
  { label: "How we hire", href: ROUTES.how },
  { label: "Expertise", href: ROUTES.expertise },
  { label: "For talent", href: ROUTES.join },
] as const;

/**
 * Security and leadership are homepage and expertise-page
 * sections rather than routes — adding them here would push the bar past what
 * fits at the `lg` breakpoint, and neither has enough content to justify a page
 * of its own yet.
 */

/**
 * Turnstile site keys, one per deployment environment.
 *
 * These are public: they are rendered into the HTML of every page carrying a
 * form, so keeping them in the repository costs nothing and removes the build's
 * dependency on a dashboard value that has to be set correctly, in the right
 * section, for two environments, before the site will build at all. Only the
 * matching secret keys are confidential, and those stay in Cloudflare.
 *
 * Take each value from its widget in the Cloudflare dashboard (operations §4).
 * A site key is bound to the hostnames its widget lists, which is what keeps
 * production and preview isolated.
 */
const TURNSTILE_SITE_KEYS = {
  /** `cube27-talent-production` widget — hostname `talent.cube27.com`. */
  production: "0x4AAAAAAEOp3L5wZhbsNFJq",
  /**
   * `cube27-talent-preview` widget — hostname `talent-preview.cube27.com`.
   * Currently Cloudflare's documented always-pass test key, so preview branches
   * build and submit before the real widget exists. It accepts every caller,
   * including bots, which is tolerable only because preview is access-protected
   * and points at test inboxes. Replace it with the preview widget's real site
   * key, and set that widget's secret as `TURNSTILE_SECRET_KEY` in the Preview
   * environment at the same time — a mismatched pair fails every submission.
   */
  preview: "1x00000000000000000000AA",
} as const;

/** Pages production branch. Every other branch builds a preview deployment. */
const PRODUCTION_BRANCH = "main";

/**
 * `CF_PAGES_BRANCH` is set by Cloudflare Pages on every build, so the branch
 * being deployed selects the key. An explicit `PUBLIC_TURNSTILE_SITE_KEY` still
 * wins where it is set, which keeps local builds working from `.env` and leaves
 * a one-off override available without a commit.
 */
function resolveTurnstileSiteKey(): string {
  const override = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;
  if (override) return override;

  const branch = process.env.CF_PAGES_BRANCH;
  if (!branch) return "";

  return branch === PRODUCTION_BRANCH
    ? TURNSTILE_SITE_KEYS.production
    : TURNSTILE_SITE_KEYS.preview;
}

/**
 * Both endpoints fail closed on a missing token, so a build without a key would
 * ship forms that silently cannot be submitted. Fail the build instead — never
 * render a configuration message to visitors. `astro dev` is exempt so pages
 * still render locally without secrets.
 */
export const TURNSTILE_SITE_KEY = resolveTurnstileSiteKey();

if (!TURNSTILE_SITE_KEY && import.meta.env.PROD) {
  const branch = process.env.CF_PAGES_BRANCH ?? "(not a Pages build)";
  throw new Error(
    `No Turnstile site key resolved for branch ${branch}. Fill in the matching ` +
      "entry in TURNSTILE_SITE_KEYS in src/site-config.ts and commit it, or " +
      "set PUBLIC_TURNSTILE_SITE_KEY to override (see .env.example).",
  );
}

/** API endpoints served by Cloudflare Pages Functions. Plan §13.1. */
export const ENDPOINTS = {
  employerLead: "/api/employer-lead",
  candidateApplication: "/api/candidate-application",
} as const;
