# CHÊDA Static Site Stabilization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Make `patriciacheda.com` a deterministic GitHub Pages site with one approved editorial source of truth and automated checks that prevent Cloudflare Worker artifacts, identity drift, or basic accessibility regressions from returning.

**Architecture:** Keep the existing Astro 5 static site, visual system, routes, and approved copy. GitHub Pages remains the only repository-driven deployment; Cloudflare remains DNS/proxy only and Vercel remains documented legacy infrastructure. A typed `src/data/site.ts` module supplies stable identity/contact/metadata values to Astro components, while Node's built-in test runner validates source and rendered `dist/` contracts.

**Tech Stack:** Astro 5, TypeScript, Node.js 20 built-in test runner, GitHub Actions, GitHub Pages.

**Global Constraints:** Do not redesign the site, add React/Next.js, AI Elements, an API, a Worker, runtime storage, or generated audio. Do not invent artist facts. Treat the “Textos oficiais” section of `DESIGN_SYSTEM.md` as authoritative when current source drifts from it. Preserve the existing public routes and approved PT/EN prose. External Cloudflare/Vercel dashboard cleanup is reported separately and is not performed by repository code.

---

## Task 1: Restore a pure static GitHub Pages artifact

**Files:**

- Create: `tests/static-build.test.mjs`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `astro.config.mjs`
- Modify: `tsconfig.json`
- Modify: `.gitignore`
- Modify: `.github/workflows/deploy-pages.yml`
- Modify: `AGENTS.md`
- Delete: `wrangler.jsonc`
- Delete: `public/.assetsignore`

- [ ] **Step 1: Write the failing rendered-artifact test**

Create `tests/static-build.test.mjs` with Node `node:test` cases that require:

- `dist/CNAME` to equal `patriciacheda.com`;
- `dist/index.html`, `dist/press-kit.html`, `dist/print/ritual.html`, `dist/print/poster.html`, `dist/print/morph.html`, and `dist/print/spread.html` to exist;
- `dist/_worker.js`, `dist/_routes.json`, and `dist/_redirects` not to exist.

- [ ] **Step 2: Run the test and verify the current Worker build fails**

Run: `npm run build && node --test tests/static-build.test.mjs`

Expected: FAIL because the adapter emits Worker artifacts and does not emit `dist/print/spread.html`.

- [ ] **Step 3: Remove the unused Cloudflare runtime**

Apply the coherent reversal of commit `ba748f1` without reverting later visual commits:

- remove `@astrojs/cloudflare` import and `adapter` from `astro.config.mjs`;
- restore `preview` to `astro preview` and remove `deploy` and `cf-typegen` scripts;
- remove `@astrojs/cloudflare` and `wrangler` dependencies, updating the lockfile with `npm install --package-lock-only`;
- remove the Worker type reference from `tsconfig.json` and Wrangler-only ignore entries from `.gitignore`;
- delete `wrangler.jsonc` and `public/.assetsignore`.

Add scripts:

```json
"test": "npm run build && node --test tests/*.test.mjs",
"test:dist": "node --test tests/static-build.test.mjs"
```

- [ ] **Step 4: Make CI enforce the same contract**

Change the workflow build command to `npm test`. Keep the existing CNAME step and add a concise artifact summary; do not alter the Pages upload/deploy jobs.

Update `AGENTS.md` to state: GitHub Pages is the only deploy target, Cloudflare is DNS/proxy only with no Worker, and Vercel is legacy.

- [ ] **Step 5: Verify static behavior**

Run:

```bash
npm ci
npm test
```

Expected: Astro reports `mode: static`; all tests pass; six required HTML files plus CNAME exist; no Worker artifacts exist.

- [ ] **Step 6: Commit**

```bash
git add .gitignore .github/workflows/deploy-pages.yml AGENTS.md astro.config.mjs package.json package-lock.json tsconfig.json tests/static-build.test.mjs wrangler.jsonc public/.assetsignore
git commit -m "fix: restore pure static Pages build"
```

## Task 2: Establish the approved editorial source of truth

**Files:**

- Create: `src/data/site.ts`
- Create: `tests/editorial-source.test.mjs`
- Modify: `src/layouts/Base.astro`
- Modify: `src/components/LandingBody.astro`
- Modify: `src/components/PressKitBody.astro`
- Modify: `src/pages/press-kit.astro`
- Modify: `src/components/PrintPosterBody.astro`
- Modify: `src/components/PrintMorphBody.astro`

- [ ] **Step 1: Write the failing source-contract test**

Create `tests/editorial-source.test.mjs`. Read `src/data/site.ts` and scan relevant Astro files. Assert that the source module contains the exact canonical URL, stage name, artist name, booking email, Instagram URL/handle, SoundCloud URL, location, role `DJ e selectora`, genres, manifesto, and official short bio from `DESIGN_SYSTEM.md`. Assert that contact URLs and the official bio no longer appear independently in consuming files.

The test must also reject `CHDX`, unaccented standalone `CHEDA`, `DJ e seletora`, the removed fake set titles/durations, placeholder/example emails, private/planner copy, and localhost URLs in public source.

- [ ] **Step 2: Run the test and verify duplicated literals fail**

Run: `node --test tests/editorial-source.test.mjs`

Expected: FAIL because the approved identity and contact values are duplicated across components and metadata.

- [ ] **Step 3: Create a typed immutable content module**

Create `src/data/site.ts` exporting one `as const` object with these sections:

- `identity`: `stageName`, `artistName`, `rolePt`, `roleEn`;
- `contact`: `bookingEmail`, `bookingMailto`, `instagramHandle`, `instagramUrl`, `soundcloudUrl`;
- `location`: `city`, `state`, `country`, `displayPt`, `displayShort`;
- `site`: `canonicalUrl`, `defaultTitle`, `defaultDescription`, `ogImage`;
- `editorial`: official short bio, manifesto, genres, and tagline;
- `pressKit`: existing title, description, and approved short PT/EN bios.

Copy identity and official language exactly from `DESIGN_SYSTEM.md`; retain current press-kit PT/EN copy only where it does not conflict. In particular, replace the landing's unsupported promotional paragraphs with the official short bio; do not editorialize it.

- [ ] **Step 4: Replace duplicated facts with imports**

Use the module in `Base.astro`, `LandingBody.astro`, `PressKitBody.astro`, `press-kit.astro`, `PrintPosterBody.astro`, and `PrintMorphBody.astro`. Build JSON-LD with `JSON.stringify()` from a JavaScript object instead of a hand-authored JSON string. Preserve rendered wording, markup, CSS classes, and layout.

- [ ] **Step 5: Verify source and rendering**

Run:

```bash
npm test
rg -n "patriciavchedach@gmail.com|instagram.com/patriciacheda_|soundcloud.com/patriciacheda" src --glob '!data/site.ts'
```

Expected: all tests pass; `rg` returns no duplicated contact literals outside the source module.

- [ ] **Step 6: Commit**

```bash
git add src/data/site.ts src/layouts/Base.astro src/components/LandingBody.astro src/components/PressKitBody.astro src/pages/press-kit.astro src/components/PrintPosterBody.astro src/components/PrintMorphBody.astro tests/editorial-source.test.mjs
git commit -m "refactor: centralize approved artist content"
```

## Task 3: Lock metadata, landmarks, and accessible controls

**Files:**

- Modify: `tests/static-build.test.mjs`
- Create: `tests/script-mirrors.test.mjs`
- Modify: `src/layouts/Base.astro`
- Modify: `src/pages/press-kit.astro`
- Modify: `src/components/LandingBody.astro`
- Modify: `src/components/PressKitBody.astro`
- Modify: `src/components/PrintRitualBody.astro`
- Modify: `src/components/PrintPosterBody.astro`
- Modify: `src/components/PrintMorphBody.astro`
- Modify: `src/scripts/print-morph.js`
- Modify: `public/scripts/print-morph.js`
- Modify: `src/styles/morph.css`
- Modify: `src/styles/tokens.css`

- [ ] **Step 1: Add failing HTML contract assertions**

Extend `tests/static-build.test.mjs` to read the home and press-kit HTML and assert:

- canonical production URL and absolute Open Graph image URLs;
- correct title, description, `lang`, artist name, booking email, and social links;
- valid JSON-LD in press kit with the approved identity and contact;
- no Worker script/config references, placeholders, or legacy Vercel host in public HTML.

For every real page, assert exactly one `<main>` and one `<h1>`, non-empty title, all images with `alt`, all iframes with `title`, and the active route switcher with `aria-current="page"`.

Create `tests/script-mirrors.test.mjs` asserting byte equality for every mirrored `src/scripts/*.js` and `public/scripts/*.js` pair.

- [ ] **Step 2: Run and observe any metadata failures**

Run: `npm test`

Expected: any relative or missing metadata contract fails before documentation changes.

- [ ] **Step 3: Fix metadata and document structure**

Adjust metadata through `src/data/site.ts` and the existing layouts/pages. Derive canonical and `og:url` from `Astro.site` plus the current pathname; make Open Graph/Twitter images absolute. Add `<main>` and `<h1>` without changing the visual hierarchy (use an existing screen-reader-only utility where a visible heading would alter the composition). Add `aria-current="page"` to active switcher links.

- [ ] **Step 4: Make the morph controls keyboard-safe**

Replace the two anchor-without-`href` morph controls with `<button type="button">`, preserve their visual styling, and synchronize `aria-pressed` in both mirrored scripts. Add a shared `:focus-visible` rule using an existing approved palette token.

- [ ] **Step 5: Verify contracts**

Run:

```bash
npm test
git diff --check
```

Expected: all rendered, editorial, metadata, structural, and script-mirror tests pass; no whitespace errors.

- [ ] **Step 6: Commit**

```bash
git add tests/static-build.test.mjs tests/script-mirrors.test.mjs src/layouts/Base.astro src/pages/press-kit.astro src/components/LandingBody.astro src/components/PressKitBody.astro src/components/PrintRitualBody.astro src/components/PrintPosterBody.astro src/components/PrintMorphBody.astro src/scripts/print-morph.js public/scripts/print-morph.js src/styles/morph.css src/styles/tokens.css
git commit -m "fix: strengthen public page accessibility"
```

## Task 4: Document deployment ownership and handoff external checks

**Files:**

- Modify: `README.md`
- Modify: `DESIGN_SYSTEM.md`
- Create: `docs/deployment-checklist.md`

- [ ] **Step 1: Correct stale internal documentation**

Update `README.md` with local commands and the GitHub Pages deployment contract. In `DESIGN_SYSTEM.md`, remove only the stale claim that placeholders remain and align the deploy section with the automated static contract; preserve all design and language rules.

- [ ] **Step 2: Document reversible external actions**

Create `docs/deployment-checklist.md` with two sections:

1. Repository checks already automated (`npm test`, Pages workflow, CNAME, required routes, forbidden Worker artifacts).
2. Manual dashboard checks not authorized by this code change: confirm Cloudflare DNS/proxy points to GitHub Pages; disable any Worker route/build attached to `patriciacheda.com`; disconnect Vercel Git auto-deploy only after confirming the legacy preview is no longer needed.

Mark all dashboard actions as reversible/manual and do not claim they were completed.

- [ ] **Step 3: Final verification**

Run:

```bash
npm ci
npm test
git diff --check
git status --short
```

Expected: clean install and all contracts pass; no whitespace errors; only intended plan/implementation files are changed.

- [ ] **Step 4: Commit**

```bash
git add README.md DESIGN_SYSTEM.md docs/deployment-checklist.md
git commit -m "docs: clarify canonical deployment ownership"
```

## Completion Gate

- Review the complete branch diff against `7f8d993` for scope, secrets, invented claims, and visual drift.
- Run `npm ci && npm test` once more from a clean dependency state.
- Do not merge, push, modify DNS, delete a Worker, or disconnect Vercel without a separate explicit handoff decision.
