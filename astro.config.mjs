import { defineConfig } from 'astro/config';

// Canonical host is GitHub Pages (Cloudflare is DNS/CDN only). This is a
// pure static build — no SSR adapter. The Cloudflare adapter forced the
// build into "server" mode, emitting a dead dist/_worker.js bundle plus
// _routes.json / _redirects into the Pages artifact and dropping the
// static redirect page. The Vercel adapter is likewise avoided (it forces
// build.format "directory" and drops redirect pages from dist/).
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
