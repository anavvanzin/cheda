import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

function parseJsonc(source) {
  return JSON.parse(source.replace(/^\s*\/\/.*$/gm, ''));
}

test('deploys the static Astro artifact through the Cloudflare Worker', async () => {
  const config = parseJsonc(await readFile('wrangler.jsonc', 'utf8'));
  const headers = await readFile('public/_headers', 'utf8');
  const redirects = await readFile('public/_redirects', 'utf8');

  assert.equal(config.name, 'cheda');
  assert.equal(config.assets.directory, './dist');
  assert.equal(config.assets.html_handling, 'auto-trailing-slash');
  assert.match(headers, /X-Content-Type-Options:\s*nosniff/);
  assert.match(headers, /Referrer-Policy:\s*strict-origin-when-cross-origin/);
  assert.match(redirects, /\/press-kit\.html\s+\/press-kit\s+301/);
  assert.match(redirects, /\/index\.html\s+\/\s+301/);
});

test('disables automatic Vercel Git deployments after the Cloudflare cutover', async () => {
  const config = JSON.parse(await readFile('vercel.json', 'utf8'));

  assert.equal(config.git?.deploymentEnabled, false);
});

test('documents Cloudflare Workers as the single canonical deployment', async () => {
  const readme = await readFile('README.md', 'utf8');
  const files = await Promise.all([
    Promise.resolve(readme),
    readFile('AGENTS.md', 'utf8'),
    readFile('docs/deployment-checklist.md', 'utf8'),
    readFile('astro.config.mjs', 'utf8'),
    readFile('.github/workflows/ci.yml', 'utf8'),
  ]);

  assert.match(readme, /Build command:\s*`npm run build`/);
  assert.match(readme, /Deploy command:\s*`npx wrangler deploy`/);

  for (const contents of files) {
    assert.match(contents, /Cloudflare/i);
    assert.doesNotMatch(contents, /Vercel (?:is|project `cheda` is) the canonical/i);
  }
});
