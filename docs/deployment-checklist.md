# Deployment checklist

GitHub is the source of truth and the Cloudflare Worker `cheda` is the
canonical deployment target for `patriciacheda.com`.

## Automated path

- Pull requests to `main` run `.github/workflows/ci.yml` and receive a
  Cloudflare Worker preview.
- Pushes to `main` run the same static checks and trigger the active Worker
  production deployment.
- `npm test` builds `dist/`, verifies every public route, metadata, media
  budget, accessibility landmark and script mirror.
- `wrangler.jsonc` publishes `dist/` as Worker Static Assets.
- `public/_redirects` and `public/_headers` own production redirects and
  security headers.
- `vercel.json` disables automatic Vercel Git deployments.
- The built artifact contains no custom Worker runtime.

## Preview review

- [ ] Open the Worker preview from the pull request.
- [ ] Review `/` at 1440×900 and 390×844.
- [ ] Confirm the short first-visit opening, then use `↺ Abertura` to watch the
  complete film.
- [ ] Test “Ouvir”, “Fotos”, “Press kit” and “Booking”.
- [ ] Confirm the SoundCloud widget loads and the WhatsApp booking CTA opens
  the prefilled conversation.
- [ ] Check `/press-kit` and the three `/print/*` routes.
- [ ] Confirm `/press-kit.html` and `/index.html` redirect to clean URLs.
- [ ] Confirm `X-Content-Type-Options` and `Referrer-Policy` are present.

## Production and rollback

- [ ] Merge only after preview approval and green CI.
- [ ] Confirm the resulting Worker deployment is active on
  `patriciacheda.com`, with `www` redirected to the apex.
- [ ] Confirm the apex no longer resolves to the legacy GitHub Pages origin.
- [ ] If production regresses, use Cloudflare Workers rollback to restore the
  previous active version, then fix forward through a new branch.
- [ ] Keep automatic Vercel Git deployments disabled and remove its domain
  assignment after the Cloudflare cutover is confirmed.
