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
