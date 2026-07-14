# AGENTS.md

## Cursor Cloud specific instructions

This repository is a **static website** (the CHÊDA digital press kit): plain HTML/CSS/vanilla JS
with **no dependencies, no package manager, and no build step**. There is nothing to install.

### Running the site (dev)

Serve the repo root with any static file server, e.g. the one documented in `README.md`:

```bash
python3 -m http.server 8765   # run from the repo root, then open http://localhost:8765
```

- Serve from the **repo root**, not from a subfolder — pages use root-absolute paths
  (`/styles/...`, `/assets/...`), so `file://` opening or serving from `print/` breaks CSS/assets.
- Key pages: `/` (`index.html`), `/press-kit.html`, `/print/ritual.html`, `/print/poster.html`.

### Lint / test / build

There is **no lint, no automated test suite, and no build**. "Testing" means loading the pages in a
browser and confirming they render. `vercel.json` configures static hosting only (clean URLs,
redirects, security headers).

### Non-obvious notes

- `.github/workflows/jekyll-docker.yml` runs a Jekyll build in CI, but there is no `_config.yml`
  or `Gemfile`, so it just copies the static files — it is effectively vestigial, not a real build.
- External integrations degrade gracefully and are not required locally: Google Fonts CDN
  (typography), the SoundCloud embed (featured set player), and the outbound Instagram link.
