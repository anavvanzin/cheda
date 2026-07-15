# CHÊDA — Patrícia Chêda · Digital Press Kit

Astro SSG rebuild of the digital press kit (independent of
[`pat.archive`](https://github.com/anavvanzin/pat.archive)). Palette, type
scale, rhythm and VHS language live in `DESIGN_SYSTEM.md`.

## Structure

```
cheda/
├── src/
│   ├── pages/           # Astro routes → static HTML
│   │   ├── index.astro          # Landing (Ritual → seam → Poster)
│   │   ├── press-kit.astro      # Printable multi-sheet press kit
│   │   └── print/{ritual,poster,morph}.astro
│   ├── components/      # Markup fragments ported from the old HTML
│   ├── layouts/         # Base + Print document shells
│   ├── styles/          # tokens, landing, cursor, print, press-kit
│   └── scripts/         # Source copies of client JS
├── public/
│   ├── assets/          # Portraits, logos, favicon/PWA
│   └── scripts/         # Served client JS
├── astro.config.mjs
└── package.json
```

## Design tokens

| token | value | purpose |
|---|---|---|
| `--ink` | `#0E0B0A` | Page background, deep matte |
| `--paper` | `#F2EAD9` | Primary type / rider surface |
| `--cream` | `#E9E0CE` | Softer body type |
| `--blood` | `#B5221A` | Accent — eyebrow, dividers, spine |
| `--gold` | `#C79A4B` | Borders, secondary accents |
| `--display-font` | `Montserrat 500` | Headlines, wordmark |
| `--serif-font` | `Cormorant Garamond` | Manifesto italics |
| `--body-font` | `Hanken Grotesk` | Body copy |
| `--tA / --tB` | `-2deg / 1.6deg` | Rhythm tilts (odd/even) |

## Local development

```bash
npm ci
npm run dev          # http://127.0.0.1:8765
npm test             # build + static artifact contracts
npm run build && npm run preview
```

Key routes: `/`, `/press-kit`, `/print/ritual`, `/print/poster`, `/print/morph`.

## Deploy

GitHub Pages is the only canonical repository deployment target. Pull requests
to `main` run the static artifact checks; a push to `main` runs
`.github/workflows/deploy-pages.yml`: `npm ci` → `npm test` → upload `dist/` →
deploy to Pages.

The canonical host is `https://patriciacheda.com`. `public/CNAME` is copied to
the build artifact and is verified by the workflow. The repository contract
requires Cloudflare to act only as DNS/proxy in front of GitHub Pages. The
verified static build contains no Cloudflare Worker runtime or Worker artifacts.
Vercel (`cheda-six.vercel.app`) is legacy and is not a canonical deployment
target.

Dashboard handoff steps are documented in
[`docs/deployment-checklist.md`](docs/deployment-checklist.md). They are manual,
reversible, and are not performed by repository changes; current external DNS,
proxy, Worker-route, Worker-build, and Vercel states are not presumed here.

---

© 2026 CHÊDA / Patrícia Chêda — Florianópolis, SC
