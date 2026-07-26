# CHÊDA — Patrícia Chêda · Digital Press Kit

Astro SSG rebuild of the digital press kit (independent of
[`pat.archive`](https://github.com/anavvanzin/pat.archive)). Palette, type
scale, rhythm and VHS language live in `DESIGN_SYSTEM.md`.

## Structure

```
cheda/
├── src/
│   ├── pages/           # Astro routes → static HTML
│   │   ├── index.astro          # Landing pública orientada a booking
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

GitHub is the source of truth and the Cloudflare Worker `cheda` is the
canonical deployment target. Its Git integration builds the static `dist/`
artifact: pull requests and feature branches receive Worker preview URLs,
while `main` deploys production to `https://patriciacheda.com` via Worker
Custom Domains on the apex and `www`.

Cloudflare Git Build settings:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: `/`

`.github/workflows/ci.yml` runs `npm test` on pull requests and pushes to
`main`. It validates the same static artifact without publishing a second
production. Astro remains in static mode; `wrangler.jsonc` owns the Worker
assets configuration, and `public/_redirects` plus `public/_headers` preserve
the public routing and security contract.

Automatic Vercel Git deployments are disabled in `vercel.json`; the legacy
project remains available only as rollback history during the cutover.

The handoff and rollback checks are documented in
[`docs/deployment-checklist.md`](docs/deployment-checklist.md).

## Taking the site offline

`maintenance.config.mjs` holds a single switch:

```js
export const MAINTENANCE_MODE = true;   // site is down
export const MAINTENANCE_MODE = false;  // site is published
```

While it is `true`, `Base.astro` and `Print.astro` drop the page content and
every route (`/`, `/press-kit`, `/print/*`) serves the same `noindex`
maintenance notice. No bio, booking contact, social link, portrait, JSON-LD
or client script reaches the published HTML.

Nothing is deleted: the full site source stays in `src/`. To bring the site
back, flip the switch to `false`, run `npm test` and merge to `main` — the
Worker redeploys the complete press kit from that commit.

`npm test` covers both states. `tests/maintenance.test.mjs` asserts the
offline artifact, and the published-content contracts in
`tests/static-build.test.mjs` skip while the site is down; when the switch is
`false` the two swap over.

Note that files under `public/` (portraits, favicons, `/scripts/*.js`) are
still served at their direct URLs while the site is offline. They are not
linked from the notice, but they are not withdrawn either.

---

© 2026 CHÊDA / Patrícia Chêda — Florianópolis, SC
