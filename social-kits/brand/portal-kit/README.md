# Onam Security — Portal Brand Kit ("True North")

Rebrand handoff for the Onam console (`cspm-portal` / `/ui` app). The marketing site
(www.onamsecurity.com) shipped this identity on 2026-07-29 — the portal must match.

## The identity

- **Mark**: four-point compass star. Two-tone: vertical navy `#082869`, horizontal blue
  `#2563EB`, white center dot. Never the old multicolor O-N-A-M letters, never the old
  blue shield.
- **Wordmark**: "Onam Security" — "Onam" weight 800, "Security" weight 600.
  On light backgrounds: **blue `#2563EB` on white**. On dark: white `#F2F6FC` with
  "Security" at `#9FB0CB`, star switches to the dark variant (`#E9EFFA` / `#6AA2FF`).
- **Font**: Plus Jakarta Sans (Google Fonts). Fallback: Inter, system-ui.

## Files

| File | Use |
|---|---|
| `OnamLogo.tsx` | Drop-in React component — `<OnamLogo variant="dark"/>` for the console header/sidebar, `<OnamMark/>` for icon-only spots. Zero dependencies. |
| `logo-mark.svg` / `logo-mark-dark.svg` / `logo-mark-mono-white.svg` | Vector mark: light bg / dark bg / single-color white |
| `lockup-light.png` / `lockup-dark.png` (+ `.svg`) | Full lockup renders — login screen, emails, splash |
| `favicon.svg` | Star on white disc — replace the portal favicon with this exact file |
| `logo-512.png`, `logo-112.png` | Square raster logo (white bg) — manifest icons, admin metadata |
| `apple-touch-icon.png` | 180×180, white star on brand blue |
| `avatar-blue-400.png` | Square avatar (white star on blue) — in-app default org avatar if needed |
| `logo-mark-512.png`, `logo-mark-dark-512.png` | High-res transparent mark renders |

## Implementation checklist for the portal

1. **Favicon**: replace the current favicon with `favicon.svg` (add `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`); replace any `.ico`/PNG favicons with renders of it.
2. **App header / sidebar logo**: use `<OnamLogo variant="dark" />` (console is dark-themed). Icon-only collapsed sidebar: `<OnamMark variant="dark" size={22} />`.
3. **Login page**: `lockup-dark.png` (or the component at `fontSize≈24, markSize≈30`).
4. **Loading / splash screens**: `logo-mark-mono-white.svg` or `<OnamMark variant="mono" />`.
5. **Browser tab title**: keep "Onam Security" naming as-is.
6. **PWA manifest** (if any): icons → `logo-512.png` / `logo-112.png`, `theme_color: "#2563EB"`.
7. **Emails / PDF reports** (if the engine sends them): header → `lockup-light.png` on white.
8. **Remove old assets**: any multicolor ONAM wordmark, 4-color compass, or blue shield
   images shipped with the portal. Search for hex `#E32D25`, `#F2AF04`, `#05A052`
   in logo contexts (these were the old logo letter colors — they remain valid as
   severity/status colors elsewhere; only remove them from brand marks).
9. **Font**: if Plus Jakarta Sans isn't already loaded, add
   `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap`
   (or self-host). Only needed for the wordmark if using the component.

## Rules

- Min mark size 14 px; below that use nothing rather than a blurry star.
- Clear space around the lockup ≥ the star's width ÷ 2.
- Don't recolor, rotate, outline, or add effects to the mark.
- Don't set the wordmark in any other font or weight combination.
