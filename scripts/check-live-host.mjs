#!/usr/bin/env node
/**
 * check-live-host.mjs
 *
 * Production regression guard for the Cloudflare Worker cutover.
 *
 * Background: `patriciacheda.com` used to be served by GitHub Pages (through
 * Fastly). The apex and `www` are now Cloudflare Worker Custom Domains for the
 * Worker `cheda`. If the apex Custom Domain is ever detached — or a stale
 * proxied DNS record repoints it — the hostname silently falls back to the old
 * GitHub Pages origin, which answers `Site not found · GitHub Pages` (HTTP 404).
 * That is exactly how the apex went "down" once already.
 *
 * This script probes the live production hosts and fails if any of them:
 *   - does not answer HTTP 200, or
 *   - is served by GitHub Pages / Fastly instead of the Cloudflare Worker.
 *
 * It has NO dependencies (Node 18+ global fetch) and does NOT touch the build,
 * so it runs as a standalone scheduled monitor rather than a build gate.
 *
 * Usage:
 *   node scripts/check-live-host.mjs
 *   node scripts/check-live-host.mjs patriciacheda.com www.patriciacheda.com
 */

const DEFAULT_HOSTS = ['patriciacheda.com', 'www.patriciacheda.com'];
const TIMEOUT_MS = 20_000;

// Header/body fingerprints of the legacy GitHub Pages (Fastly) origin. If any
// of these appear, the hostname is NOT hitting the Cloudflare Worker.
const GITHUB_PAGES_HEADERS = [
  'x-github-request-id',
  'x-served-by',
  'x-fastly-request-id',
  'x-cache',
];
const GITHUB_PAGES_BODY = /Site not found\s*(?:&middot;|·)\s*GitHub Pages|<title>Site not found/i;

async function probe(host) {
  const url = `https://${host}/`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, { redirect: 'follow', signal: controller.signal });
  } catch (error) {
    return { host, url, ok: false, reasons: [`request failed: ${error.message}`] };
  } finally {
    clearTimeout(timer);
  }

  const reasons = [];
  if (response.status !== 200) {
    reasons.push(`expected HTTP 200, got ${response.status}`);
  }

  const server = (response.headers.get('server') || '').toLowerCase();
  if (!server.includes('cloudflare')) {
    reasons.push(`expected "server: cloudflare", got "${response.headers.get('server') || '(none)'}"`);
  }

  const via = (response.headers.get('via') || '').toLowerCase();
  if (via.includes('varnish')) {
    reasons.push(`Fastly signature in "via" header: "${response.headers.get('via')}"`);
  }
  for (const name of GITHUB_PAGES_HEADERS) {
    if (response.headers.has(name)) {
      reasons.push(`GitHub Pages / Fastly header present: "${name}: ${response.headers.get(name)}"`);
    }
  }

  const body = await response.text().catch(() => '');
  if (GITHUB_PAGES_BODY.test(body)) {
    reasons.push('body is the "Site not found · GitHub Pages" error page');
  }

  return { host, url, ok: reasons.length === 0, reasons, status: response.status };
}

async function main() {
  const hosts = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_HOSTS;
  const results = await Promise.all(hosts.map(probe));

  let failed = false;
  for (const result of results) {
    if (result.ok) {
      console.log(`✓ ${result.url} — HTTP ${result.status}, served by the Cloudflare Worker`);
    } else {
      failed = true;
      console.error(`✗ ${result.url} — regression detected:`);
      for (const reason of result.reasons) {
        console.error(`    - ${reason}`);
      }
    }
  }

  if (failed) {
    console.error('');
    console.error('A production host is not being served by the Cloudflare Worker `cheda`.');
    console.error('This usually means an apex/www Custom Domain was detached or a stale DNS');
    console.error('record repointed the hostname at the legacy GitHub Pages origin.');
    console.error('Remediation: docs/deployment-checklist.md → "Live host regression".');
    process.exit(1);
  }

  console.log('\nAll production hosts are served by the Cloudflare Worker.');
}

await main();
