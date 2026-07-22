import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';

test('uses the transparent panther seal without the generated portrait', async () => {
  const component = await readFile('src/components/LandingBody.astro', 'utf8');
  const landing = await readFile('src/styles/landing.css', 'utf8');

  assert.match(component, /src="\/assets\/panther-cutout\.webp"/);
  assert.doesNotMatch(component, /portrait-pixel\.webp/);
  assert.match(landing, /\.booking-flash::before\s*\{/);
  assert.match(landing, /\.booking-flash::before\s*\{[\s\S]*?border-radius:\s*50%/);
  assert.equal((await stat('public/assets/panther-cutout.webp')).isFile(), true);
});
