# AGENTS.md

## Cursor Cloud specific instructions

This repository is the **CHÊDA digital press kit**, built with **Astro (static SSG)**.
Vanilla HTML/CSS/JS ports live under `src/`; assets under `public/assets/`.

### Running the site (dev)

```bash
npm install
npm run dev          # http://127.0.0.1:8765 — from repo root
```

- Serve via Astro, not `python3 -m http.server` on raw files — routes are compiled from `src/pages/`.
- Key pages: `/`, `/press-kit`, `/print/ritual`, `/print/poster`, `/print/morph`.

### Lint / test / build

```bash
npm run build        # writes static HTML to dist/
```

`npm test` builds the site and verifies the static Pages artifact. Visual QA = open the pages (dev or preview) on desktop 1440×900 and mobile 390×844. See `DESIGN_SYSTEM.md` §6.

### Non-obvious notes

- Design tokens: `src/styles/tokens.css`. Landing-specific CSS: `src/styles/landing.css` (extracted from the former root `index.html` inline block).
- Client scripts are copied to `public/scripts/` and loaded with `is:inline` so they stay classic IIFEs (orbit captions, custom cursor, print helpers).
- Legacy root `index.html` / `print/*.html` were removed after the Astro migration — do not recreate them at the repo root.
- External integrations degrade gracefully: Google Fonts CDN, SoundCloud iframe, Instagram link.
- Deploy path: GitHub repository → Cloudflare Workers Git integration. Pull requests and feature branches receive Worker previews; `main` deploys production to `https://patriciacheda.com` through the Worker `cheda`. `.github/workflows/ci.yml` validates the static artifact but does not deploy. Keep Astro in static mode; no SSR adapter or Worker entrypoint is needed.
