import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';

test('every source script has a byte-identical public mirror', async () => {
  const scriptNames = (await readdir('src/scripts'))
    .filter((name) => name.endsWith('.js'))
    .sort();

  assert.ok(scriptNames.length > 0, 'src/scripts must contain mirrored scripts');
  for (const name of scriptNames) {
    const source = await readFile(join('src/scripts', name));
    const mirror = await readFile(join('public/scripts', name));
    assert.deepEqual(mirror, source, `${name} mirror differs byte-for-byte`);
  }
});
