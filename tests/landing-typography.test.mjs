import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('limits the landing typography to Montserrat, Space Mono, and the blackletter lockup', async () => {
  const layout = await readFile('src/layouts/Base.astro', 'utf8');
  const body = await readFile('src/components/LandingBody.astro', 'utf8');
  const landing = await readFile('src/styles/landing.css', 'utf8');
  const intro = await readFile('src/styles/intro.css', 'utf8');

  assert.match(
    layout,
    /const landingFontHref = '[^']*family=Montserrat[^']*family=Space\+Mono[^']*'/,
  );
  assert.match(
    landing,
    /--landing-sans-font:\s*'Montserrat',\s*'Helvetica Neue',\s*sans-serif/,
  );
  assert.match(
    landing,
    /--landing-technical-font:\s*'Space Mono',\s*ui-monospace,\s*'SFMono-Regular',\s*monospace/,
  );
  assert.match(
    landing,
    /body\s*\{[\s\S]*?font-family:\s*var\(--landing-sans-font\)/,
  );
  assert.match(
    landing,
    /\.public-nav a\s*\{[\s\S]*?font-family:\s*var\(--landing-technical-font\)/,
  );
  assert.match(
    landing,
    /\.hero-title span\s*\{[\s\S]*?font-family:\s*var\(--landing-sans-font\)/,
  );
  assert.match(
    landing,
    /\.listen-heading h2,[\s\S]*?\.booking-content h2\s*\{[\s\S]*?font-family:\s*var\(--landing-sans-font\)/,
  );
  assert.match(body, /class="artist-name-lockup"[\s\S]*?logo-patricia-blackletter-cream\.png/);
  assert.doesNotMatch(landing, /IM Fell English SC|Special Elite|Unbounded|Hanken Grotesk/);
  assert.match(intro, /\.intro__skip\s*\{[\s\S]*?font-family:var\(--landing-technical-font\)/);
  assert.match(intro, /\.intro__enter\s*\{[\s\S]*?font-family:var\(--landing-sans-font\)/);
  assert.match(intro, /\.intro-reopen\s*\{[\s\S]*?font-family:var\(--landing-technical-font\)/);
});
