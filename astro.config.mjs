import { defineConfig } from 'astro/config';

// Canonical host is the Vercel project `cheda`, connected to the GitHub
// repository. The site remains a pure static build, so no SSR adapter is
// required: Vercel serves `dist/` and applies redirects/headers from
// vercel.json while Astro keeps the canonical metadata on the custom domain.
export default defineConfig({
  site: 'https://patriciacheda.com',
  output: 'static',
  trailingSlash: 'never',
  compressHTML: false,

  build: {
    format: 'file',
  },

  // Keeps a static redirect artifact for portable previews and non-Vercel
  // hosting. Vercel also enforces this route through vercel.json.
  redirects: {
    '/print/spread': '/',
  },
});
