import type { APIRoute } from "astro";
import { SITE_CONFIG } from "@/site-config";

/**
 * Confirmation pages are noindex via meta as well, but disallowing them here
 * keeps them out of crawl budget entirely. Plan §16.1.
 */
export const GET: APIRoute = () =>
  new Response(
    [
      "User-agent: *",
      "Allow: /",
      "Disallow: /thank-you/",
      "Disallow: /api/",
      "",
      `Sitemap: ${SITE_CONFIG.url}/sitemap-index.xml`,
      "",
    ].join("\n"),
    { headers: { "content-type": "text/plain; charset=utf-8" } },
  );
