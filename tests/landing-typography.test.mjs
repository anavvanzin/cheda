import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('keeps the contractor-first layout with the atelier typography', async () => {
  const layout = await readFile('src/layouts/Base.astro', 'utf8');
  const landing = await readFile('src/styles/landing.css', 'utf8');

  assert.match(layout, /family=IM\+Fell\+English\+SC&family=Special\+Elite/);
  assert.match(
    landing,
    /--landing-editorial-font:\s*'IM Fell English SC',\s*'Cormorant Garamond',\s*serif/,
  );
  assert.match(
    landing,
    /--landing-technical-font:\s*'Special Elite',\s*'Space Mono',\s*monospace/,
  );
  assert.match(
    landing,
    /\.artist-copy h2,[\s\S]*?\.booking-content h2\s*\{[\s\S]*?font-family:\s*var\(--landing-editorial-font\)[\s\S]*?font-weight:\s*400[\s\S]*?font-style:\s*normal/,
  );
  assert.match(
    landing,
    /\.public-nav a\s*\{[\s\S]*?font-family:\s*var\(--landing-technical-font\)/,
  );
  assert.match(
    landing,
    /\.hero-title span\s*\{[\s\S]*?font-family:\s*var\(--wordmark-font\)/,
  );
});
