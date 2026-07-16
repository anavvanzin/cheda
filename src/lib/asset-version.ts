import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const PUBLIC_ROOT = new URL('../../public/', import.meta.url);
const versionCache = new Map<string, string>();

function resolvePublicAsset(publicRelPath: string): URL {
  if (!publicRelPath || publicRelPath.startsWith('/') || publicRelPath.startsWith('\\')) {
    throw new TypeError('Asset path must be relative to public/');
  }

  const assetUrl = new URL(publicRelPath, PUBLIC_ROOT);

  if (
    !assetUrl.href.startsWith(PUBLIC_ROOT.href) ||
    assetUrl.search ||
    assetUrl.hash
  ) {
    throw new TypeError(`Asset path escapes public/: ${publicRelPath}`);
  }

  return assetUrl;
}

/**
 * Build-time cache-buster for raw files under public/. Returns a short
 * content hash of the asset so a versioned reference (e.g. `?v=<hash>`)
 * changes automatically whenever the bytes change — letting a CDN/browser
 * cache the file aggressively while never serving a stale cut after a swap.
 *
 * @param publicRelPath path relative to the public/ dir, e.g. "assets/intro/intro.mp4"
 */
export function assetVersion(publicRelPath: string): string {
  const assetUrl = resolvePublicAsset(publicRelPath);
  const cacheKey = assetUrl.href;
  const cached = versionCache.get(cacheKey);
  if (cached) return cached;

  const version = createHash('sha256')
    .update(readFileSync(assetUrl))
    .digest('hex')
    .slice(0, 10);

  versionCache.set(cacheKey, version);
  return version;
}
