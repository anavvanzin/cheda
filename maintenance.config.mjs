// Single switch that takes patriciacheda.com offline.
//
//   true  -> every route (`/`, `/press-kit`, `/print/*`) serves the
//            maintenance notice. No landing, press kit or print content is
//            published, and every page is marked `noindex`.
//   false -> the full press kit is published again, exactly as before.
//
// The site source is never removed: `src/pages/**` and `src/components/**`
// stay intact and the two layouts (`Base.astro`, `Print.astro`) decide at
// build time which document to emit.
//
// To bring the site back: flip this to `false`, run `npm test`, and merge to
// `main`. The Cloudflare Worker `cheda` redeploys from that commit.
const OFFLINE = true;

// `SITE_ONLINE=1` builds the full site even while it is offline in
// production, so the press kit stays developable and testable during the
// takedown. `npm run dev`, `npm run preview` and `npm run test:online` set
// it; nothing in the deploy path does. It can only reveal the site locally —
// once `OFFLINE` is `false` the site is simply published.
export const MAINTENANCE_MODE = OFFLINE && process.env.SITE_ONLINE !== '1';

// Copy for the offline notice. Deliberately minimal — no booking contact,
// no social links, no portraits.
export const maintenanceNotice = {
  documentTitle: 'CHÊDA · Site em manutenção',
  description: 'O site está temporariamente fora do ar.',
  eyebrow: 'CHÊDA',
  heading: 'Site em manutenção',
  body: 'Voltamos em breve.',
};
