# CHDX — Patrícia Chêda · Digital Press Kit

New repo. Independent of [`pat.archive`](https://github.com/anavvanzin/pat.archive) —
that repo is only the visual template we borrowed from. Palette, type
scale, rhythm lines and tilt system come from `pat.archive/site/style.css`;
everything here is a clean rebuild focused on the press-kit spine.

## Structure

```
cheda/
├── index.html            # Full press kit — Hero, Bio, Sets, Fotos, Rider, Booking
├── styles/
│   ├── tokens.css        # Palette + type + rhythm variables
│   ├── site.css          # Site skin (imports tokens)
│   └── print.css         # A4 skin (imports tokens) — used by both print pages
├── print/
│   ├── ritual.html       # 3a · Ritual — full-canvas strobe rings, orbiting captions, three set cards at the foot
│   └── poster.html       # 3b · Poster — full-page type wall (solid → stroke → fading), photo plate + content card bleeding into each other
└── assets/
    ├── portrait.jpg      # Hero + press portrait
    ├── portrait-crop.jpg # Alternate crop
    └── panther-mark.svg  # Woodcut brand mark (from pat.archive)
```

## Design tokens

| token | value | purpose |
|---|---|---|
| `--ink` | `#0E0B0A` | Page background, deep matte |
| `--paper` | `#F2EAD9` | Primary type / rider surface |
| `--cream` | `#E9E0CE` | Softer body type |
| `--blood` | `#B5221A` | Accent — eyebrow, dividers, spine |
| `--gold` | `#C79A4B` | Borders, secondary accents |
| `--display-font` | `Oswald 400–700` | Headlines, wordmark |
| `--serif-font` | `Cormorant Garamond` | Manifesto italics |
| `--body-font` | `Hanken Grotesk` | Body copy |
| `--tA / --tB` | `-2deg / 1.6deg` | Rhythm tilts (odd/even) |

## Local preview

```bash
cd cheda
python3 -m http.server 8765
open http://localhost:8765
open http://localhost:8765/print/ritual.html
open http://localhost:8765/print/poster.html
```

## Deploy

Static — Vercel, Cloudflare Pages or GitHub Pages. No build step.

## Notes on the two A4 print pages

**3a Ritual** — Eight concentric SVG rings share the portrait's `cx/cy` (397, 494). Radii cascade from 145px to 685px, so the outermost strobe reaches the A4 corners. Each ring pulses on a 3s `ring-pulse` keyframe staggered every 0.25s, so the strobe ripples outward instead of blinking in unison. Eight captions are placed trigonometrically at 45° intervals on a 66%-wide orbit ring, each rotated tangentially. Three set cards sit at 4% from the foot, alternating `-2deg / 1.6deg` tilts.

**3b Poster** — Six type-wall rows fill 100% of the A4 in a `justify-content:space-around` column. The rows cascade through five visual states (solid paper → solid blood → paper stroke → blood ghost → gold whisper → paper barely-there), all done with `color:transparent + -webkit-text-stroke` and progressively reduced opacity. The photo plate (top-right, rotated 1.5°) and content card (bottom-left, raised into the photo bleed) are bound by (a) a matching top/bottom bleed gradient — the photo fades into ink, the card rises out of ink — and (b) a 1px blood spine crossing the gap, so the two masses read as one continuous composite rather than two floating panels.

---

© 2026 CHDX / Patrícia Chêda — Florianópolis, SC
