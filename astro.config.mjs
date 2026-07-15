import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/static';

export default defineConfig({
  site: 'https://patriciacheda.com',
  output: 'static',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  trailingSlash: 'never',
  compressHTML: false,
  build: {
    format: 'file',
  },
  // Pages serves spread.html for both /print/spread and /print/spread.html.
  // Only one entry — a second "/print/spread.html" key would emit spread.html.html.
  redirects: {
    '/print/spread': '/',
  },
});
