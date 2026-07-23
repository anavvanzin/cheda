import { defineConfig } from 'astro/config';

// Canonical host is the Cloudflare Worker `cheda`, connected to the GitHub
// repository. The site remains a pure static build, so no SSR adapter or
// Worker entrypoint is required. Cloudflare serves `dist/`; `_redirects` and
// `_headers` in `public/` own the edge routing and security contract.
export default defineConfig({
  site: 'https://patriciacheda.com',
  output: 'static',
  trailingSlash: 'never',
  compressHTML: false,

  build: {
    format: 'file',
  },

  // Keeps the Astro redirect page portable. Cloudflare also enforces this
  // route through the static asset `_redirects` file.
  redirects: {
    '/print/spread': '/',
  },
});
