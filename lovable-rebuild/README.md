# Onam Website — Lovable Rebuild (isolated review workspace)

This folder is kept **separate** from the existing Next.js source (`../src`, `../out`, etc.)
so the Lovable rebuild can be reviewed in isolation. Nothing here touches the live Next.js app.

## Lovable project

| | |
|---|---|
| **Name** | Onam Launchpad |
| **Project ID** | `4f82198f-0f9b-4fef-a6cb-1da9a8fdfdb6` |
| **Workspace** | Anup's Lovable (`mw2ViilT8gseptCjKVik`) |
| **Editor** | https://lovable.dev/projects/4f82198f-0f9b-4fef-a6cb-1da9a8fdfdb6 |
| **Live preview** | https://id-preview--4f82198f-0f9b-4fef-a6cb-1da9a8fdfdb6.lovable.app |
| **Stack** | TanStack Start (TypeScript) + Tailwind + shadcn/ui |
| **Created** | 2026-07-18 |

## Source of truth

The rebuild is derived from the existing Next.js site in the parent folder. Design tokens,
navigation, footer, and homepage copy were extracted from:
- `../tailwind.config.ts` (colors, fonts, shadows, gradients)
- `../src/app/globals.css` (glass/gradient effects)
- `../src/components/layout/Navbar.tsx`, `Footer.tsx` (nav + footer structure)
- `../src/components/home/*` (14 homepage sections)
- `../src/lib/config.ts` (stats, cloud providers, compliance frameworks)

## Build #1 scope (done)

Design system + global Navbar (Platform & Solutions mega-menus) + Footer + full homepage
(14 sections) + stub pages for all `/platform/*`, `/solutions/*`, `/pricing`, `/resources`,
`/docs`, `/request-demo`, `/company/*` routes.

## Remaining work (iterations)

- [x] Flesh out `/platform/*` detail pages (16) via shared `ProductPageTemplate` — done 2026-07-18
- [x] `/solutions/*` cloud (7) + industry (3) pages + index — done 2026-07-18
- [x] Pricing page — done 2026-07-18
- [x] Request-demo form + Company (About/Careers/Contact/Security) + Privacy + Terms — done 2026-07-18
- [x] Resources + Blog (list + articles) — done 2026-07-18
- [x] Docs system (sidebar + articles + on-this-page TOC), light theme — done 2026-07-18
- [x] Demo video section (animated, MP4-swap-ready) — done 2026-07-18
- [x] Log-in link → app URL (direct, no redirect) — done 2026-07-18
- [x] Full-site verification — done 2026-07-18

### SITE COMPLETE (all pages built, light enterprise theme). Follow-ups if desired:
- Drop in exact binary assets (logo.svg, screenshots/*.png, video/*.mp4) via the Lovable editor uploads.
- Put HTTPS in front of the login ELB endpoint (currently http://).

## Review log

| Date | Build/iteration | Notes |
|------|-----------------|-------|
| 2026-07-18 | Build #1 — homepage + shell | Initial generation complete. Homepage verified — faithful to original. |
| 2026-07-18 | Build #2 — 16 platform pages | Shared ProductPageTemplate + all /platform/* pages. Verified CSPM page renders correctly. Cost: 7.1 credits. |
| 2026-07-18 | Build #3 — all-light enterprise redesign | Whole site converted to clean light theme (Orca-style). Real multicolor ONAM logo recreated. Product demo rebuilt as a light browser-framed product tour (11 views) from real data. Verified homepage + attack-path page. Cost: 11.1 credits. |
| 2026-07-18 | Build #4 — Solutions | 7 cloud + 3 industry pages + index, shared templates, light theme. Cost: 8.2 credits. |
| 2026-07-18 | Build #5 — Pricing/Company/Legal + Log-in fix | Pricing, Request-demo, Company (About/Careers/Contact/Security), Privacy, Terms. Log-in link → app ELB URL (direct, no redirect). Cost: 7.8 credits. |
| 2026-07-18 | Build #6 — Resources/Blog/Docs | Resources index, blog (list + articles), full docs experience (sidebar + TOC + articles). Cost: 6.8 credits. |
| 2026-07-18 | Build #7 — Demo video section | Animated "Watch the platform in action" (Security Scan / Connect AWS / Attack Path), MP4-swap-ready. Cost: 3.9 credits. |
| 2026-07-18 | Verification | Pricing, Solutions/AWS, Docs, Blog, and Log-in link all confirmed in preview. Full site consistent. |

## Asset note
The exact binary assets (public/logo.svg, screenshots/*.png) could NOT be pushed to Lovable from this sandboxed session (locked-down network). Instead: the logo was faithfully recreated as a colored SVG/JSX component (blue O, red N, amber A, green M + navy SECURITY), and the product demo was built as coded light-theme dashboards using the real captions/badges/data. To use the pixel-exact PNG screenshots, drag them into the Lovable editor's uploads and swap them into the demo tabs.
