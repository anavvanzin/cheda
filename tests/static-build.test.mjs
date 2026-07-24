import assert from 'node:assert/strict';
import { lstat, readFile, stat } from 'node:fs/promises';
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
];

const introAssetBudgets = new Map([
  ['dist/assets/intro/intro.mp4', 3 * 1024 * 1024],
  ['dist/assets/intro/intro-poster.jpg', 100 * 1024],
]);

const canonicalOrigin = 'https://patriciacheda.com';
const socialMetadata = new Map([
  ['dist/index.html', {
    image: `${canonicalOrigin}/assets/favicon/og-image.jpg`,
    width: '1200',
    height: '630',
  }],
  ['dist/press-kit.html', {
    image: `${canonicalOrigin}/assets/portrait-ritual.jpg`,
    width: '1080',
    height: '1080',
  }],
]);
const realPages = new Map([
  ['dist/index.html', { canonical: `${canonicalOrigin}/`, activeHref: '/' }],
  ['dist/press-kit.html', { canonical: `${canonicalOrigin}/press-kit`, activeHref: null }],
  ['dist/print/ritual.html', { canonical: `${canonicalOrigin}/print/ritual`, activeHref: '/print/ritual' }],
  ['dist/print/poster.html', { canonical: `${canonicalOrigin}/print/poster`, activeHref: '/print/poster' }],
  ['dist/print/morph.html', { canonical: `${canonicalOrigin}/print/morph`, activeHref: '/print/morph' }],
]);

function countElements(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b`, 'gi'))].length;
}

function attributeValue(html, selectorPattern, attribute) {
  const element = html.match(selectorPattern)?.[0];
  return element?.match(new RegExp(`\\b${attribute}=["']([^"']*)["']`, 'i'))?.[1];
}

test('does not ship a GitHub Pages CNAME in the Worker artifact', async () => {
  await assert.rejects(
    lstat('dist/CNAME'),
    { code: 'ENOENT' },
    'dist/CNAME should not exist — the apex is a Worker Custom Domain',
  );
});

test('emits every required static HTML page', async () => {
  for (const page of requiredPages) {
    assert.equal((await stat(page)).isFile(), true, `${page} should be a regular file`);
    assert.equal((await lstat(page)).isSymbolicLink(), false, `${page} should not be a symlink`);
  }
});

test('does not emit Cloudflare Worker artifacts', async () => {
  for (const artifact of forbiddenWorkerArtifacts) {
    await assert.rejects(
      lstat(artifact),
      { code: 'ENOENT' },
      `${artifact} should not exist`,
    );
  }
});

test('keeps the cinematic intro inside its web delivery budget', async () => {
  for (const [asset, maxBytes] of introAssetBudgets) {
    const info = await stat(asset);
    assert.equal(info.isFile(), true, `${asset} should be a regular file`);
    assert.ok(info.size <= maxBytes, `${asset} should stay at or below ${maxBytes} bytes`);
  }
});

test('renders approved production metadata and public identity', async () => {
  const home = await readFile('dist/index.html', 'utf8');
  const pressKit = await readFile('dist/press-kit.html', 'utf8');

  assert.equal(attributeValue(home, /<html\b[^>]*>/i, 'lang'), 'pt-BR');
  assert.match(home, /<title>CHÊDA · Patrícia Chêda<\/title>/);
  assert.match(home, /<meta\s+name="description"\s+content="Dona de uma presença magnética/);
  assert.match(home, /Patrícia Chêda/);
  assert.match(home, /booking@patriciacheda\.com/);
  assert.match(home, /https:\/\/www\.instagram\.com\/patriciacheda_\//);
  assert.match(home, /https:\/\/soundcloud\.com\/patriciacheda/);
  assert.match(home, /\/assets\/logo-patricia-blackletter-black\.png/);
  assert.match(home, /\/assets\/logo-patricia-blackletter-cream\.png/);
  assert.doesNotMatch(home, /logo-patricia-blackletter-white\.png/);

  assert.match(pressKit, /<title>CHÊDA · Patrícia Chêda · Press Kit A4<\/title>/);
  assert.match(pressKit, /name="description"\s+content="Press kit A4 — CHÊDA \/ Patrícia Chêda/);

  for (const [page, html, canonical] of [
    ['dist/index.html', home, `${canonicalOrigin}/`],
    ['dist/press-kit.html', pressKit, `${canonicalOrigin}/press-kit`],
  ]) {
    assert.equal(attributeValue(html, /<link\b(?=[^>]*\brel="canonical")[^>]*>/i, 'href'), canonical);
    assert.equal(attributeValue(html, /<meta\b(?=[^>]*\bproperty="og:url")[^>]*>/i, 'content'), canonical);
    const expected = socialMetadata.get(page);
    assert.equal(attributeValue(html, /<meta\b(?=[^>]*\bproperty="og:image")[^>]*>/i, 'content'), expected.image);
    assert.equal(attributeValue(html, /<meta\b(?=[^>]*\bname="twitter:image")[^>]*>/i, 'content'), expected.image);
    assert.equal(attributeValue(html, /<meta\b(?=[^>]*\bproperty="og:image:width")[^>]*>/i, 'content'), expected.width);
    assert.equal(attributeValue(html, /<meta\b(?=[^>]*\bproperty="og:image:height")[^>]*>/i, 'content'), expected.height);
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
  assert.equal(data.jobTitle, 'DJ e seletora');
  assert.equal(data.email, 'mailto:booking@patriciacheda.com');
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
  for (const [page, { canonical, activeHref }] of realPages) {
    const html = await readFile(page, 'utf8');
    const renderedHtml = html.replace(/<!--[\s\S]*?-->/g, '');
    assert.equal(countElements(renderedHtml, 'main'), 1, `${page} must have exactly one main`);
    assert.equal(countElements(renderedHtml, 'h1'), 1, `${page} must have exactly one h1`);
    assert.match(renderedHtml, /<h1\b[^>]*>[\s\S]*?\S[\s\S]*?<\/h1>/i, `${page} h1 must not be empty`);
    assert.match(html, /<title>\s*\S[\s\S]*?<\/title>/i, `${page} title must not be empty`);
    assert.equal(
      attributeValue(html, /<link\b(?=[^>]*\brel="canonical")[^>]*>/i, 'href'),
      canonical,
      `${page} must expose its exact canonical route`,
    );

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

test('print pages expose canonical only, without social metadata', async () => {
  for (const [page] of [...realPages].filter(([path]) => path.includes('/print/'))) {
    const html = await readFile(page, 'utf8');
    assert.doesNotMatch(html, /<meta\b[^>]*(?:property="og:|name="twitter:)/i, page);
  }
});

test('landing footer sits outside main', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  const mainEnd = html.indexOf('</main>');
  const footerStart = html.indexOf('<footer');

  assert.ok(mainEnd > -1 && footerStart > mainEnd, 'landing footer must follow the closed main');
});

test('hidden focusable content has a visible focus recovery utility', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  const tokens = await readFile('src/styles/tokens.css', 'utf8');

  const focusableSrOnly = html.match(
    /<(?:a|button|input|select|textarea)\b(?=[^>]*\bclass="[^"]*\bsr-only\b)[^>]*>/gi,
  ) ?? [];
  assert.ok(focusableSrOnly.length > 0, 'contract requires a focusable sr-only control');
  for (const element of focusableSrOnly) {
    assert.match(element, /\bclass="[^"]*\bsr-only-focusable\b/i, `invisible focus target: ${element}`);
  }
  assert.match(tokens, /\.sr-only-focusable:focus\s*,\s*\.sr-only-focusable:active\s*\{/);
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
