import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/static';

export default defineConfig({
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
});
