import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

/**
 * Build-time cache-buster for raw files under public/. Returns a short
 * content hash of the asset so a versioned reference (e.g. `?v=<hash>`)
 * changes automatically whenever the bytes change — letting a CDN/browser
 * cache the file aggressively while never serving a stale cut after a swap.
 *
 * @param publicRelPath path relative to the public/ dir, e.g. "assets/intro/intro.mp4"
 */
export function assetVersion(publicRelPath: string): string {
  const buf = readFileSync(new URL('../../public/' + publicRelPath, import.meta.url));
  return createHash('sha256').update(buf).digest('hex').slice(0, 10);
}
