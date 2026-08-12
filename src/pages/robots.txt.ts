import type { APIRoute } from "astro";
import { SITE_CONFIG } from "@/site-config";

/**
 * The confirmation pages are deliberately NOT disallowed. A disallowed URL is
 * never fetched, so its `noindex` is never read, and it can still be indexed
 * from an external link. Letting the crawler read the meta tag is what
 * actually keeps them out of the index. They are excluded from the sitemap in
 * astro.config.mjs. Plan §16.1.
 */
export const GET: APIRoute = () =>
  new Response(
    [
      "User-agent: *",
      "Allow: /",
      "Disallow: /api/",
      "",
      `Sitemap: ${SITE_CONFIG.url}/sitemap-index.xml`,
      "",
    ].join("\n"),
    { headers: { "content-type": "text/plain; charset=utf-8" } },
  );
