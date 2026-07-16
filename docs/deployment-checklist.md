# Deployment checklist

GitHub Pages is the only canonical repository deployment target for
`patriciacheda.com`. The contract requires Cloudflare to provide DNS/proxy only;
Vercel is legacy infrastructure. The repository verifies the static artifact,
not the current external dashboard state. This checklist separates those
guarantees from external actions that require an explicit manual handoff.

## Repository checks already automated

The repository and `.github/workflows/deploy-pages.yml` already enforce these
checks. `npm test` builds `dist/` and verifies the same static contract before
the Pages artifact is uploaded.

- `npm test` completes successfully.
- Pull requests to `main` build and test without deploying; pushes to `main`
  build, test, and deploy through GitHub Pages.
- `dist/CNAME` exists and contains exactly `patriciacheda.com`.
- Required static routes exist: `/`, `/press-kit`, `/print/ritual`,
  `/print/poster`, `/print/morph`, and the `/print/spread` redirect artifact.
- The built artifact contains no Cloudflare Worker runtime; the forbidden files
  `dist/_worker.js`, `dist/_routes.json`, and `dist/_redirects` do not exist.

## Manual dashboard checks — not completed by this change

The repository does not verify the current DNS, proxy, Worker-route,
Worker-build, or Vercel dashboard state. The items below are external, manual,
and reversible. None is authorized or marked complete by this repository
change. Record the current dashboard state before changing it so each action
can be restored if necessary.

- [ ] In Cloudflare DNS, confirm that the records for `patriciacheda.com` point
  to GitHub Pages and that Cloudflare is acting only as DNS/proxy. Reversal:
  restore the recorded DNS targets and proxy state.
- [ ] In Cloudflare Workers, check for any Worker route or Worker build attached
  to `patriciacheda.com`; disable it if present. Reversal: re-enable the recorded
  route/build configuration.
- [ ] In Vercel, first confirm that the legacy preview at
  `cheda-six.vercel.app` is no longer needed; only then disconnect Git
  auto-deploy. Reversal: reconnect the repository/integration using the recorded
  project settings.
