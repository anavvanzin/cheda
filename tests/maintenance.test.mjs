import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';

import { MAINTENANCE_MODE, maintenanceNotice } from '../maintenance.config.mjs';

// The offline contract. It is the mirror image of `static-build.test.mjs`:
// these run only while `MAINTENANCE_MODE` is on, and the published-content
// contracts there run only while it is off. Exactly one of the two applies.
const offlineOnly = {
  skip: MAINTENANCE_MODE ? false : 'site is published (MAINTENANCE_MODE is off)',
};

// Every route that renders through a layout. `/print/spread` is excluded: it
// is an Astro redirect page to `/`, so it never reaches `Base`/`Print`.
const canonicalOrigin = 'https://patriciacheda.com';
const noticePages = new Map([
  ['dist/index.html', `${canonicalOrigin}/`],
  ['dist/press-kit.html', `${canonicalOrigin}/press-kit`],
  ['dist/print/ritual.html', `${canonicalOrigin}/print/ritual`],
  ['dist/print/poster.html', `${canonicalOrigin}/print/poster`],
  ['dist/print/morph.html', `${canonicalOrigin}/print/morph`],
]);

const allPages = [...noticePages.keys(), 'dist/print/spread.html'];

// Content that must not survive into the artifact while the site is down.
const withheldContent = new Map([
  ['booking email', /booking@patriciacheda\.com/i],
  ['WhatsApp number', /5548992157396/],
  ['Instagram profile', /instagram\.com\/patriciacheda_/i],
  ['SoundCloud profile', /soundcloud\.com\/patriciacheda/i],
  ['official bio', /Dona de uma presença magnética/i],
  ['manifesto', /encontro de vibrações/i],
  ['structured identity data', /application\/ld\+json/i],
  ['press kit and print scripts', /<script[^>]*\bsrc=/i],
  ['portraits and logo lockups', /\/assets\/(?:portrait|logo)-/i],
]);

function countElements(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b`, 'gi'))].length;
}

test('every route serves the maintenance notice', offlineOnly, async () => {
  for (const [page, canonical] of noticePages) {
    const html = await readFile(page, 'utf8');

    assert.match(html, /<title>CHÊDA · Site em manutenção<\/title>/, `${page} title`);
    assert.ok(
      html.includes(maintenanceNotice.heading),
      `${page} must render the notice heading`,
    );
    assert.ok(
      html.includes(maintenanceNotice.body),
      `${page} must render the notice body`,
    );
    assert.equal(countElements(html, 'main'), 1, `${page} must have exactly one main`);
    assert.equal(countElements(html, 'h1'), 1, `${page} must have exactly one h1`);
    assert.match(
      html,
      /<link\b[^>]*\brel="canonical"[^>]*\bhref="([^"]*)"/i,
      `${page} must keep a canonical link`,
    );
    assert.ok(
      html.includes(`href="${canonical}"`),
      `${page} canonical must stay ${canonical}`,
    );
  }
});

test('keeps the offline site out of search results', offlineOnly, async () => {
  for (const page of allPages) {
    const html = await readFile(page, 'utf8');
    assert.match(
      html,
      /<meta\b[^>]*\bname="robots"[^>]*\bcontent="noindex/i,
      `${page} must be noindex while the site is down`,
    );
  }
});

test('publishes no site content behind the notice', offlineOnly, async () => {
  for (const page of allPages) {
    const html = await readFile(page, 'utf8');
    for (const [label, pattern] of withheldContent) {
      assert.doesNotMatch(html, pattern, `${page} still exposes ${label}`);
    }
    assert.equal(countElements(html, 'img'), 0, `${page} must embed no images`);
    assert.equal(countElements(html, 'iframe'), 0, `${page} must embed no iframes`);
  }
});

test('takes the site down without deleting it', offlineOnly, async () => {
  // Going back online must stay a one-value change, so the full site source
  // has to survive the takedown intact.
  const preserved = [
    'src/pages/index.astro',
    'src/pages/press-kit.astro',
    'src/pages/print/ritual.astro',
    'src/pages/print/poster.astro',
    'src/pages/print/morph.astro',
    'src/components/LandingBody.astro',
    'src/components/PressKitBody.astro',
    'src/data/site.ts',
  ];

  for (const file of preserved) {
    assert.equal((await stat(file)).isFile(), true, `${file} must be preserved`);
  }
});
