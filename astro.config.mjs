import { defineConfig } from 'astro/config';

// No @astrojs/vercel adapter: canonical host is GitHub Pages.
// The Vercel adapter forces build.format "directory", copies assets into
// .vercel/output, and drops Astro redirect pages from dist/ — so Pages
// never received /print/spread and clean URLs broke.
export default defineConfig({
  site: 'https://patriciacheda.com',
  output: 'static',
  trailingSlash: 'never',
  compressHTML: false,

  build: {
    format: 'file',
  },

  // Emits dist/print/spread.html (meta-refresh). Pages serves it for
  // both /print/spread and /print/spread.html.
  redirects: {
    '/print/spread': '/',
  },
});
