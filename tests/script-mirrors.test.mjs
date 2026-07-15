import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';

test('every source script has a byte-identical public mirror', async () => {
  const sourceScriptNames = (await readdir('src/scripts'))
    .filter((name) => name.endsWith('.js'))
    .sort();
  const publicScriptNames = (await readdir('public/scripts'))
    .filter((name) => name.endsWith('.js'))
    .sort();

  assert.ok(sourceScriptNames.length > 0, 'src/scripts must contain mirrored scripts');
  assert.deepEqual(publicScriptNames, sourceScriptNames, 'script mirror filename sets differ');
  for (const name of sourceScriptNames) {
    const source = await readFile(join('src/scripts', name));
    const mirror = await readFile(join('public/scripts', name));
    assert.deepEqual(mirror, source, `${name} mirror differs byte-for-byte`);
  }
});
