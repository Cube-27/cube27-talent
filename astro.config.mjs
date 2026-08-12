// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// Separate vite cache dirs so `astro dev` and `astro build`/`check` don't conflict.
const astroCommand = process.argv.slice(2).find((arg) => !arg.startsWith("-"));
const viteCacheDir =
  astroCommand === "dev" || astroCommand === "preview"
    ? "node_modules/.vite-dev"
    : "node_modules/.vite-build";

// https://astro.build/config
export default defineConfig({
  site: "https://talent.cube27.com",
  // Static output. The only dynamic surface is the two Cloudflare Pages
  // Functions under `functions/`, which deploy alongside the static build and
  // need no Astro adapter. Plan §12.2.
  output: "static",
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  integrations: [
    sitemap({
      // Confirmation pages are noindex and must never enter the sitemap.
      // /privacy/ and /terms/ are unreviewed drafts carrying noindex — drop
      // them from this list once the approved notices ship.
      filter: (page) =>
        !["/thank-you/", "/privacy/", "/terms/"].some((path) =>
          page.includes(path),
        ),
    }),
  ],
  vite: {
    cacheDir: viteCacheDir,
    plugins: [tailwindcss()],
    server: {
      strictPort: true,
    },
  },
  server: {
    port: 3100,
    open: false,
  },
  devToolbar: {
    enabled: false,
  },
});
