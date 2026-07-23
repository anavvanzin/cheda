import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('percent-encodes the booking email subject at runtime', async () => {
  const component = await readFile('src/components/LandingBody.astro', 'utf8');

  assert.match(component, /const bookingSubject = 'Booking · Chêda';/);
  assert.match(
    component,
    /const bookingHref = `\$\{siteContent\.contact\.bookingMailto\}\?subject=\$\{encodeURIComponent\(bookingSubject\)\}`;/,
  );
});

test('provides matching vh fallbacks before every svh minimum height', async () => {
  const landing = await readFile('src/styles/landing.css', 'utf8');
  const svhDeclarations = [...landing.matchAll(/min-height:\s*(\d+)svh;/g)];

  assert.ok(svhDeclarations.length > 0, 'expected the landing to use svh minimum heights');
  for (const declaration of svhDeclarations) {
    const precedingCss = landing.slice(0, declaration.index);
    const previousDeclaration = precedingCss.match(/min-height:\s*([^;]+);\s*$/)?.[1];
    assert.equal(previousDeclaration, `${declaration[1]}vh`);
  }
});

test('hides mobile navigation links by semantic class instead of DOM position', async () => {
  const component = await readFile('src/components/LandingBody.astro', 'utf8');
  const landing = await readFile('src/styles/landing.css', 'utf8');

  assert.match(component, /<a class="nav-fotos" href="#fotos">Fotos<\/a>/);
  assert.match(component, /<a class="nav-press-kit" href="\/press-kit">Press kit<\/a>/);
  assert.match(
    landing,
    /@media \(max-width: 720px\)[\s\S]*?\.public-nav \.nav-fotos\s*\{\s*display:\s*none;/,
  );
  assert.match(
    landing,
    /@media \(max-width: 390px\)[\s\S]*?\.public-nav \.nav-press-kit\s*\{\s*display:\s*none;/,
  );
  assert.doesNotMatch(landing, /\.public-nav a:nth-child\(/);
});
