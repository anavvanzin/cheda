# Deployment checklist

GitHub is the source of truth and the Cloudflare Worker `cheda` is the
canonical deployment target for `patriciacheda.com`.

## Automated path

- Pull requests to `main` run `.github/workflows/ci.yml` and receive a
  Cloudflare Worker preview.
- Pushes to `main` run the same static checks and trigger the active Worker
  production deployment.
- Cloudflare Git Build uses `npm run build`, then `npx wrangler deploy`, from
  the repository root.
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
- [ ] Confirm `wrangler.jsonc` lists Worker Custom Domains for
  `patriciacheda.com` and `www.patriciacheda.com` (`custom_domain: true`).
- [ ] Confirm the resulting Worker deployment is active on
  `patriciacheda.com` (response has Worker cache headers, no
  `x-github-request-id` / Fastly `x-served-by`).
- [ ] Confirm the home page shows the contractor-first CHÊDA hero and the
  WhatsApp “Consultar disponibilidade” CTA — not the legacy hollow-wordmark
  ritual layout.
- [ ] Confirm `www.patriciacheda.com` also serves the Worker. Prefer a
  Cloudflare Redirect Rule from `www` → apex once both hostnames work.
- [ ] In GitHub → Settings → Pages, remove the custom domain
  `patriciacheda.com` (and disable Pages if unused) so it cannot reclaim the
  apex.
- [ ] If production regresses, use Cloudflare Workers rollback to restore the
  previous active version, then fix forward through a new branch.
- [ ] Keep automatic Vercel Git deployments disabled and remove its domain
  assignment after the Cloudflare cutover is confirmed.

## Live host regression

`scripts/check-live-host.mjs` probes the live hosts and fails if the apex or
`www` is served by the legacy GitHub Pages (Fastly) origin instead of the
Worker. Run it on demand with `node scripts/check-live-host.mjs`.

To run it automatically every 30 minutes, copy the workflow template into place
once — `cp docs/uptime-workflow.yml .github/workflows/uptime.yml`, then commit.
It is shipped under `docs/` because GitHub rejects workflow writes from a
credential without the `workflow` scope.

When it fails, a hostname has fallen back to GitHub Pages — typically the apex
answering `Site not found · GitHub Pages` (HTTP 404). Fix it in Cloudflare:

- [ ] DNS → Records: delete any stale proxied record for the failing hostname
  that points at GitHub Pages (`*.github.io` or the GitHub Pages IPs). A
  leftover apex record blocks the Worker Custom Domain from provisioning.
- [ ] Workers & Pages → `cheda` → Settings → Domains & Routes: confirm the
  hostname is an **Active** Custom Domain. Re-add it if it is missing or stuck
  once the conflicting DNS record is gone.
- [ ] Re-run the monitor (or `curl -I https://patriciacheda.com/`) and confirm
  `server: cloudflare` with no `x-github-request-id` / Fastly `x-served-by`.
- [ ] GitHub → Settings → Pages: ensure `patriciacheda.com` is not set as a
  Pages custom domain so it cannot reclaim the apex.
