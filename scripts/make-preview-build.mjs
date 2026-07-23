#!/usr/bin/env node
/**
 * make-preview-build.mjs
 *
 * Produces a PREVIEW-ONLY copy of the Astro `dist/` output whose asset and
 * internal-link references are RELATIVE, so the site renders correctly when
 * served from an arbitrary nested / private subdirectory (e.g. the sandbox
 * preview host that mounts the build under a protected sub-path).
 *
 * This does NOT touch `dist/` and does NOT change `astro build`, so the normal
 * Cloudflare production build (served from the domain root) is unaffected.
 *
 * What it rewrites, per HTML/CSS/JS/webmanifest file, based on that file's
 * depth relative to the output root:
 *   - HTML  href="/x"  src="/x"  srcset  content="/x" (og/twitter meta)
 *   - CSS   url(/x)
 *   - webmanifest JSON  "src":"/x", "start_url":"/", scope, etc.
 *   - Internal page links that use extensionless routes (/print/morph, /) are
 *     mapped to the actual emitted files (build.format:'file' => *.html).
 *
 * External URLs (http:, https:, //, data:, mailto:, tel:, #, blob:) are left
 * untouched.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'dist');
const OUT = path.join(ROOT, 'preview-dist');

// Extensionless route -> emitted file (build.format: 'file', trailingSlash: never)
// Root "/" maps to index.html.
function routeToFile(route) {
  // strip query/hash first (handled by caller normally, but be safe)
  if (route === '/' || route === '') return 'index.html';
  let r = route.replace(/^\//, '');
  // already has an extension? keep as-is
  if (/\.[a-zA-Z0-9]+$/.test(r)) return r;
  // extensionless route -> file.html
  return r + '.html';
}

// Compute the relative prefix ("", "../", "../../") for a file at `fileRel`
// (path relative to OUT root, using forward slashes).
function prefixForFile(fileRel) {
  const depth = fileRel.split('/').length - 1; // number of directories deep
  return depth === 0 ? './' : '../'.repeat(depth);
}

const SKIP_RE = /^(https?:|\/\/|data:|mailto:|tel:|#|blob:|javascript:)/i;

// Given a root-absolute ref like "/assets/x.png" or "/print/morph",
// return a relative ref appropriate for a file at `prefix`.
function relify(ref, prefix) {
  if (!ref || SKIP_RE.test(ref)) return ref;
  if (!ref.startsWith('/')) return ref; // already relative or something odd
  // split off query/hash
  const m = ref.match(/^([^?#]*)([?#].*)?$/);
  let pathPart = m[1];
  const suffix = m[2] || '';

  // Does this look like a real file (has extension) or a known asset dir?
  const hasExt = /\.[a-zA-Z0-9]+$/.test(pathPart);
  const isAssetish = /^\/(assets|_astro|scripts)\//.test(pathPart);

  let targetRel;
  if (hasExt || isAssetish) {
    targetRel = pathPart.replace(/^\//, '');
  } else {
    // treat as an internal page route
    targetRel = routeToFile(pathPart);
  }

  // prefix is like "./" or "../"; join and normalise
  let out = prefix === './' ? './' + targetRel : prefix + targetRel;
  // collapse any accidental "//"
  out = out.replace(/([^:])\/\/+/g, '$1/');
  return out + suffix;
}

async function copyDir(src, dst) {
  await fs.mkdir(dst, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const e of entries) {
    const s = path.join(src, e.name);
    const d = path.join(dst, e.name);
    if (e.isDirectory()) await copyDir(s, d);
    else if (e.isSymbolicLink()) {
      const link = await fs.readlink(s);
      await fs.symlink(link, d);
    } else await fs.copyFile(s, d);
  }
}

async function walk(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

function rewriteHtml(content, prefix) {
  // attribute-based refs: href, src, poster, data-src (og:image handled below)
  const URL_ATTRS = 'href|src|poster|data-src';
  content = content.replace(
    new RegExp('\\b(' + URL_ATTRS + ')\\s*=\\s*"(\\/[^"]*)"', 'g'),
    (all, attr, val) => `${attr}="${relify(val, prefix)}"`
  );
  content = content.replace(
    new RegExp('\\b(' + URL_ATTRS + ")\\s*=\\s*'(\\/[^']*)'", 'g'),
    (all, attr, val) => `${attr}='${relify(val, prefix)}'`
  );
  // meta content that is a root-absolute URL (og:image, twitter:image, manifest icons)
  content = content.replace(
    /\bcontent\s*=\s*"(\/[^"]*)"/g,
    (all, val) => `content="${relify(val, prefix)}"`
  );
  // srcset: comma-separated list of "url descriptor"
  content = content.replace(/\bsrcset\s*=\s*"([^"]*)"/g, (all, val) => {
    const parts = val.split(',').map((chunk) => {
      const t = chunk.trim();
      if (!t) return t;
      const sp = t.split(/\s+/);
      sp[0] = relify(sp[0], prefix);
      return sp.join(' ');
    });
    return `srcset="${parts.join(', ')}"`;
  });
  // inline style url(/x) and imagesrcset in <link rel=preload>
  content = content.replace(/url\(\s*(\/[^)\s'"]+)\s*\)/g, (all, val) => `url(${relify(val, prefix)})`);
  content = content.replace(/url\(\s*"(\/[^"]+)"\s*\)/g, (all, val) => `url("${relify(val, prefix)}")`);
  content = content.replace(/url\(\s*'(\/[^']+)'\s*\)/g, (all, val) => `url('${relify(val, prefix)}')`);
  return content;
}

function rewriteCss(content, prefix) {
  content = content.replace(/url\(\s*(\/[^)\s'"]+)\s*\)/g, (all, val) => `url(${relify(val, prefix)})`);
  content = content.replace(/url\(\s*"(\/[^"]+)"\s*\)/g, (all, val) => `url("${relify(val, prefix)}")`);
  content = content.replace(/url\(\s*'(\/[^']+)'\s*\)/g, (all, val) => `url('${relify(val, prefix)}')`);
  return content;
}

/**
 * Preview iframes forbid persistent browser-storage APIs. The production
 * intro.js gates the intro with sessionStorage; for the preview copy we swap it
 * for an in-memory store so the SAME behaviour works within a single page view
 * (dismiss / reopen), and — critically — so NO literal forbidden identifier
 * remains anywhere in the file (the validator scans raw content, including
 * comments and strings). Production dist/scripts/intro.js is untouched.
 */
function rewritePreviewJs(content) {
  const FORBIDDEN = /sessionStorage/g;
  if (!FORBIDDEN.test(content)) return content;

  // Inject a tiny in-memory shim at the top of the IIFE body. It mimics the
  // getItem/setItem/removeItem surface the script uses. Named to avoid the
  // forbidden token entirely.
  const shim =
    '\n  /* preview build: in-memory gate (no persistent browser storage) */\n' +
    '  var __introMemStore = (function () {\n' +
    '    var m = {};\n' +
    '    return {\n' +
    '      getItem: function (k) { return Object.prototype.hasOwnProperty.call(m, k) ? m[k] : null; },\n' +
    '      setItem: function (k, v) { m[k] = String(v); },\n' +
    '      removeItem: function (k) { delete m[k]; }\n' +
    '    };\n' +
    '  })();\n';

  // Insert the shim right after the IIFE opener "(function () {".
  let out = content.replace(/\(function\s*\(\)\s*\{/, function (m) { return m + shim; });

  // Replace every remaining reference (code + comments) to the forbidden
  // identifier with the shim name, so the literal token is fully absent.
  out = out.replace(FORBIDDEN, '__introMemStore');

  return out;
}

function rewriteWebmanifest(content, prefix) {
  try {
    const json = JSON.parse(content);
    const fixUrl = (u) => (typeof u === 'string' && u.startsWith('/') ? relify(u, prefix) : u);
    if (Array.isArray(json.icons)) json.icons.forEach((ic) => { if (ic && ic.src) ic.src = fixUrl(ic.src); });
    if (json.start_url) json.start_url = fixUrl(json.start_url);
    if (json.scope) json.scope = fixUrl(json.scope);
    return JSON.stringify(json, null, 2);
  } catch {
    return content; // leave untouched if not parseable
  }
}

async function main() {
  // fresh output
  await fs.rm(OUT, { recursive: true, force: true });
  await copyDir(SRC, OUT);

  const files = await walk(OUT);
  let touched = 0;
  for (const abs of files) {
    const rel = path.relative(OUT, abs).split(path.sep).join('/');
    const prefix = prefixForFile(rel);
    const ext = path.extname(abs).toLowerCase();

    let content;
    if (ext === '.html') {
      content = await fs.readFile(abs, 'utf8');
      const next = rewriteHtml(content, prefix);
      if (next !== content) { await fs.writeFile(abs, next); touched++; }
    } else if (ext === '.css') {
      content = await fs.readFile(abs, 'utf8');
      const next = rewriteCss(content, prefix);
      if (next !== content) { await fs.writeFile(abs, next); touched++; }
    } else if (rel.endsWith('.webmanifest') || rel.endsWith('site.webmanifest')) {
      content = await fs.readFile(abs, 'utf8');
      const next = rewriteWebmanifest(content, prefix);
      if (next !== content) { await fs.writeFile(abs, next); touched++; }
    } else if (ext === '.js') {
      // JS has no root-absolute asset paths in this project (verified), but the
      // intro controller uses sessionStorage which is forbidden in the preview
      // iframe. Swap it for an in-memory shim in the preview copy only.
      content = await fs.readFile(abs, 'utf8');
      const next = rewritePreviewJs(content);
      if (next !== content) { await fs.writeFile(abs, next); touched++; }
    }
  }

  console.log(`preview-dist ready: ${OUT}`);
  console.log(`files rewritten: ${touched}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
