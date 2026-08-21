# Brand kit — the canonical mark, and where each file goes

**`src/*.svg` is the source of truth.** Every PNG here is rendered from it. If a PNG and
the SVG disagree, the SVG is right and the PNG is stale.

```bash
rsvg-convert -w 800 -h 800 src/avatar-blue-400.svg -o avatar-blue-800.png
```

## The palette

Extracted from `src/*.svg` on 2026-08-15 — these are the only four colours the brand uses.
Recorded here because they were not written down anywhere, which is precisely how a third
logo variant appeared with a `#0B1220` background nobody had approved.

| Colour | Hex | Role | Contrast vs white |
|---|---|---|---|
| **Brand blue** | `#2563EB` | Primary — avatar ground, diamond, banner accents | 5.1 : 1 ✅ AA |
| **Deep navy** | `#082869` | Secondary — logo spike, banner grounds | 13.8 : 1 ✅ AAA |
| **White** | `#FFFFFF` | The mark | — |
| **Slate** | `#5C6B84` | Muted text on banners | — |

**Picking a "brand colour" on a third-party profile** (Dev.to, Hashnode and similar render
it as a band behind your avatar):

- Avatar is the **logo** → use **`#082869`**. A `#2563EB` band behind a `#2563EB` avatar
  dissolves the mark into the background with no edge.
- Avatar is a **photo** → use **`#2563EB`**, the stronger identity colour.
- Two colours or a gradient → `#2563EB` → `#082869`.

## The mark

A four-point true-north star: white vertical spike, pale horizontal diamond at 85%
opacity, and a **centre dot in brand blue**. Background `#2563EB`.

The centre dot is not optional. It is the element that distinguishes the mark from a
generic compass star, and it is the first thing that goes missing when someone redraws it
by hand.

## Upload map

| Platform | Avatar | Banner |
|---|---|---|
| LinkedIn company page | `avatar-blue-800.png` | `banner-linkedin-1128x191.png` |
| YouTube channel | `avatar-blue-800.png` | `banner-youtube-2560x1440.png` |
| X | `avatar-blue-400.png` | `banner-x-1500x500.png` |
| GitHub org | `avatar-blue-512.png` | — |
| Crunchbase | `avatar-blue-512.png` | — |
| G2 | `avatar-blue-512.png` | — |

`avatar-white-*.png` is for dark surfaces only. Do not use it as a profile avatar —
consistency across profiles is what makes the Organization `sameAs` corroboration work,
and a different-looking avatar on one platform weakens the entity signal on all of them.

## Files

| | |
|---|---|
| `avatar-blue-{400,512,800,1024}.png` | the profile avatar, brand blue background |
| `avatar-white-{400,800}.png` | dark-surface variant |
| `banner-linkedin-1128x191.png` · `banner-x-1500x500.png` · `banner-youtube-2560x1440.png` | header images |
| `src/*.svg` | **sources** — edit these, never the PNGs |

## Drift, 2026-08-14

A third variant existed at `studio/assets/brand/avatar-800.png`, rendered 2026-08-02 from
`studio/assets/brand/avatar.html`: dark `#0B1220` background, `#4D8DFF` diamond, **no
centre dot**, mark at 46% of frame. Nothing referenced it, so it was never shipped — but
it was one upload away from going onto YouTube while LinkedIn and the site carried the
real mark.

Its stated rationale was that YouTube crops avatars to a circle so the mark had to shrink.
That was wrong twice: the canonical mark already sits inside the inscribed circle
(furthest point 272px of a 400px radius at 800×800), and shrinking a mark makes it *less*
legible at 48px, not more.

Both `avatar.html` and the PNG now render the canonical geometry, and `avatar.html` points
back here. **Do not redraw the mark in a new file — render it from `src/`.**
