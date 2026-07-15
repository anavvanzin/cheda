import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  trailingSlash: 'never',
  compressHTML: false,
  build: {
    format: 'file',
  },
});
