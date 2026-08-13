import type { APIRoute } from "astro";
import { INDEXING_ENABLED, SITE_CONFIG } from "@/site-config";

/**
 * The confirmation pages are deliberately NOT disallowed. A disallowed URL is
 * never fetched, so its `noindex` is never read, and it can still be indexed
 * from an external link. Letting the crawler read the meta tag is what
 * actually keeps them out of the index. They are excluded from the sitemap in
 * astro.config.mjs. Plan §16.1.
 *
 * The same reasoning is why the pre-launch build still allows crawling rather
 * than sending `Disallow: /`: the site-wide `noindex` only works if the
 * crawler is allowed to fetch a page and read it. Blocking the crawl instead
 * would leave a linked URL eligible to appear in results with no content. All
 * that changes while INDEXING_ENABLED is false is that the sitemap is no
 * longer advertised.
 */
export const GET: APIRoute = () =>
  new Response(
    [
      "User-agent: *",
      "Allow: /",
      "Disallow: /api/",
      "",
      ...(INDEXING_ENABLED
        ? [`Sitemap: ${SITE_CONFIG.url}/sitemap-index.xml`, ""]
        : []),
    ].join("\n"),
    { headers: { "content-type": "text/plain; charset=utf-8" } },
  );
