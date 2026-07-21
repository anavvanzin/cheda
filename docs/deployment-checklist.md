# Deployment checklist

GitHub is the source of truth and the Vercel project `cheda` is the canonical
deployment target for `patriciacheda.com`.

## Automated path

- Pull requests to `main` run `.github/workflows/ci.yml` and receive a Vercel
  Preview Deployment.
- Pushes to `main` run the same static checks and trigger a Vercel Production
  Deployment.
- `npm test` builds `dist/`, verifies every public route, metadata, media
  budget, accessibility landmark and script mirror.
- `vercel.json` owns production redirects and security headers.
- The built artifact contains no Cloudflare Worker runtime.

## Preview review

- [ ] Open the Preview Deployment from the pull request.
- [ ] Review `/` at 1440×900 and 390×844.
- [ ] Confirm the short first-visit opening, then use `↺ Abertura` to watch the
  complete film.
- [ ] Test “Ouvir”, “Fotos”, “Press kit” and “Booking”.
- [ ] Confirm the SoundCloud widget loads and the booking email opens the mail
  client.
- [ ] Check `/press-kit` and the three `/print/*` routes.

## Production and rollback

- [ ] Merge only after preview approval and green CI.
- [ ] Confirm the resulting Production Deployment is `READY` and assigned to
  `patriciacheda.com`.
- [ ] If production regresses, use Vercel's rollback/promote flow to restore the
  previous READY deployment, then fix forward through a new branch.
- [ ] Keep the unused `cheda-site` Vercel project detached from the domain so it
  cannot compete with `cheda`.
