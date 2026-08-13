/**
 * Canonical-host enforcement.
 *
 * Cloudflare assigns every Pages project a `<project>.pages.dev` hostname that
 * serves the same production build as the custom domain. Left alone it is a
 * second live copy of the site and of both API routes, on a host nothing
 * monitors. Operations §7 step 5 requires it be redirected or protected.
 *
 * Per-deployment preview hostnames (`<hash>.cube27-talent.pages.dev`) are
 * deliberately not matched: previews are a legitimate separate environment and
 * redirecting them to production would make them untestable.
 *
 * `_redirects` cannot express this — its source is a path, not a host — so it
 * runs here. The cost is that this middleware executes on every request,
 * including static assets; it is a single string comparison before `next()`.
 */

const PRODUCTION_PAGES_HOST = "cube27-talent.pages.dev";
const CANONICAL_ORIGIN = "https://talent.cube27.com";

// Typed structurally rather than with `PagesFunction`: this project does not
// depend on @cloudflare/workers-types, and both endpoints declare their context
// the same way.
export const onRequest = async ({
  request,
  next,
}: {
  request: Request;
  next: () => Promise<Response>;
}): Promise<Response> => {
  const url = new URL(request.url);

  if (url.hostname === PRODUCTION_PAGES_HOST) {
    const target = new URL(url.pathname + url.search, CANONICAL_ORIGIN);
    // 308, not 301: the two API routes accept POST, and 301 permits a client to
    // replay the redirect as GET, dropping the body. 308 is equally permanent
    // but preserves method and body.
    return Response.redirect(target.toString(), 308);
  }

  return next();
};
