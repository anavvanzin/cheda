import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { access } from 'node:fs/promises';
import test from 'node:test';

const requiredPages = [
  'dist/index.html',
  'dist/press-kit.html',
  'dist/print/ritual.html',
  'dist/print/poster.html',
  'dist/print/morph.html',
  'dist/print/spread.html',
];

const forbiddenWorkerArtifacts = [
  'dist/_worker.js',
  'dist/_routes.json',
  'dist/_redirects',
];

const canonicalOrigin = 'https://patriciacheda.com';
const realPages = new Map([
  ['dist/index.html', { canonical: `${canonicalOrigin}/`, activeHref: '/' }],
  ['dist/press-kit.html', { canonical: `${canonicalOrigin}/press-kit`, activeHref: null }],
  ['dist/print/ritual.html', { canonical: null, activeHref: '/print/ritual' }],
  ['dist/print/poster.html', { canonical: null, activeHref: '/print/poster' }],
  ['dist/print/morph.html', { canonical: null, activeHref: '/print/morph' }],
]);

function countElements(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b`, 'gi'))].length;
}

function attributeValue(html, selectorPattern, attribute) {
  const element = html.match(selectorPattern)?.[0];
  return element?.match(new RegExp(`\\b${attribute}=["']([^"']*)["']`, 'i'))?.[1];
}

test('writes the canonical custom domain to dist/CNAME', async () => {
  assert.equal(await readFile('dist/CNAME', 'utf8'), 'patriciacheda.com');
});

test('emits every required static HTML page', async () => {
  for (const page of requiredPages) {
    await assert.doesNotReject(access(page), `${page} should exist`);
  }
});

test('does not emit Cloudflare Worker artifacts', async () => {
  for (const artifact of forbiddenWorkerArtifacts) {
    await assert.rejects(
      access(artifact),
      { code: 'ENOENT' },
      `${artifact} should not exist`,
    );
  }
});

test('renders approved production metadata and public identity', async () => {
  const home = await readFile('dist/index.html', 'utf8');
  const pressKit = await readFile('dist/press-kit.html', 'utf8');

  assert.equal(attributeValue(home, /<html\b[^>]*>/i, 'lang'), 'pt-BR');
  assert.match(home, /<title>CHÊDA · Patrícia Chêda<\/title>/);
  assert.match(home, /<meta\s+name="description"\s+content="Patrícia Chêda — DJ e selectora/);
  assert.match(home, /Patrícia Chêda/);
  assert.match(home, /patriciavchedach@gmail\.com/);
  assert.match(home, /https:\/\/www\.instagram\.com\/patriciacheda_\//);
  assert.match(home, /https:\/\/soundcloud\.com\/patriciacheda/);

  assert.match(pressKit, /<title>CHÊDA · Patrícia Chêda · Press Kit A4<\/title>/);
  assert.match(pressKit, /name="description"\s+content="Press kit A4 — CHÊDA \/ Patrícia Chêda/);

  for (const [html, canonical] of [[home, `${canonicalOrigin}/`], [pressKit, `${canonicalOrigin}/press-kit`]]) {
    assert.equal(attributeValue(html, /<link\b(?=[^>]*\brel="canonical")[^>]*>/i, 'href'), canonical);
    assert.equal(attributeValue(html, /<meta\b(?=[^>]*\bproperty="og:url")[^>]*>/i, 'content'), canonical);
    for (const pattern of [
      /<meta\b(?=[^>]*\bproperty="og:image")[^>]*>/i,
      /<meta\b(?=[^>]*\bname="twitter:image")[^>]*>/i,
    ]) {
      assert.match(attributeValue(html, pattern, 'content') ?? '', /^https:\/\//);
    }
  }
});

test('renders valid approved JSON-LD in the press kit', async () => {
  const html = await readFile('dist/press-kit.html', 'utf8');
  const rawJson = html.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(rawJson, 'press kit must render JSON-LD');
  const data = JSON.parse(rawJson);

  assert.equal(data['@context'], 'https://schema.org');
  assert.equal(data['@type'], 'Person');
  assert.equal(data.name, 'Patrícia Chêda');
  assert.equal(data.alternateName, 'CHÊDA');
  assert.equal(data.jobTitle, 'DJ e selectora');
  assert.equal(data.email, 'mailto:patriciavchedach@gmail.com');
  assert.equal(data.url, `${canonicalOrigin}/press-kit`);
  assert.deepEqual(data.sameAs, [
    'https://www.instagram.com/patriciacheda_/',
    'https://soundcloud.com/patriciacheda',
  ]);
});

test('public HTML excludes deployment leaks, placeholders, and the legacy host', async () => {
  for (const page of requiredPages) {
    const html = await readFile(page, 'utf8');
    assert.doesNotMatch(html, /(?:_worker\.js|_routes\.json|wrangler|cloudflare\s+worker)/i, page);
    assert.doesNotMatch(html, /(?:placeholder|example\.(?:com|org|net)|to be replaced)/i, page);
    assert.doesNotMatch(html, /cheda-six\.vercel\.app/i, page);
  }
});

test('every real page has one main landmark, one h1, and accessible media', async () => {
  for (const [page, { activeHref }] of realPages) {
    const html = await readFile(page, 'utf8');
    const renderedHtml = html.replace(/<!--[\s\S]*?-->/g, '');
    assert.equal(countElements(renderedHtml, 'main'), 1, `${page} must have exactly one main`);
    assert.equal(countElements(renderedHtml, 'h1'), 1, `${page} must have exactly one h1`);
    assert.match(renderedHtml, /<h1\b[^>]*>[\s\S]*?\S[\s\S]*?<\/h1>/i, `${page} h1 must not be empty`);
    assert.match(html, /<title>\s*\S[\s\S]*?<\/title>/i, `${page} title must not be empty`);

    for (const image of renderedHtml.match(/<img(?=\s|\/?>)[^>]*>/gi) ?? []) {
      assert.match(image, /\balt=["'][^"']*["']/i, `${page} image is missing alt: ${image}`);
    }
    for (const iframe of renderedHtml.match(/<iframe(?=\s|\/?>)[^>]*>/gi) ?? []) {
      assert.match(iframe, /\btitle=["']\S[^"']*["']/i, `${page} iframe is missing title: ${iframe}`);
    }

    if (activeHref) {
      const activeLink = (html.match(/<a\b[^>]*\baria-current="page"[^>]*>/gi) ?? []);
      assert.equal(activeLink.length, 1, `${page} must expose one current route`);
      assert.equal(attributeValue(activeLink[0], /<a\b[^>]*>/i, 'href'), activeHref);
    }
  }
});

test('morph state controls are real buttons with synchronized pressed state', async () => {
  const html = await readFile('dist/print/morph.html', 'utf8');
  const sourceScript = await readFile('src/scripts/print-morph.js', 'utf8');

  assert.match(html, /<button\s+type="button"\s+id="btn-ritual"[^>]*aria-pressed="true"/);
  assert.match(html, /<button\s+type="button"\s+id="btn-poster"[^>]*aria-pressed="false"/);
  assert.doesNotMatch(html, /<a\b[^>]*\bid="btn-(?:ritual|poster)"/);
  assert.match(sourceScript, /btnR\.setAttribute\('aria-pressed','false'\)/);
  assert.match(sourceScript, /btnP\.setAttribute\('aria-pressed','true'\)/);
  assert.match(sourceScript, /btnP\.setAttribute\('aria-pressed','false'\)/);
  assert.match(sourceScript, /btnR\.setAttribute\('aria-pressed','true'\)/);
});
