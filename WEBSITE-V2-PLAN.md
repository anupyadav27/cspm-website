# Onam website v2 — the platform site

Started 2026-10-06. Owner: Anup Yadav. Status: built locally, not pushed.

Onam is now one platform of four products — **Onam Estate, Onam Security, Onam FinOps, Onam DRM** — with
**Onam AIOps** (AI agents, early access) across them. The site was built when Onam was one product
(Onam Security). This plan turns it into the platform's site without losing any of the security depth.

Audits behind this plan (2026-10-06, read-only): information architecture and user flows, visual system
and accessibility, and visual assets. Summaries are in §9.

---

## 1. Principles

1. **Platform first, product second, engine third.** `/` sells the platform; each product has a flagship
   page; Security's 26 engine pages sit under `/platform/*` (indexed URLs, never moved).
2. **Every claim traceable.** Numbers come from `src/lib/product-facts.ts` (gated by `scripts/facts-gate.mjs`).
   AIOps statuses come only from `src/data/operations.ts`. Nothing roadmap is shown without its chip.
3. **Real product over pictures of it.** Real console screenshots where they exist (DRM demo tenant today);
   otherwise drawn illustrations clearly marked *Illustrative*. Hand-made mock screens are not presented as
   the real console.
4. **One system.** Shared components and tokens (§4); no new raw hex values or one-off font sizes.
5. **Accessible by default.** Keyboard-operable menus and tabs, text contrast ≥ 4.5:1, reduced motion
   respected, one h1 per page.

## 2. Information architecture

```
/                         Platform home
├── Products
│   ├── /estate               Onam Estate       1 · Discover
│   ├── /platform             Onam Security     2 · Secure   (hub; engines at /platform/<engine>)
│   ├── /finops               Onam FinOps       3 · Optimise
│   ├── /disaster-recovery    Onam DRM          4 · Recover
│   └── /platform/ai-operations  Onam AIOps     across all four (early access)
├── Solutions   by cloud (/solutions/<cloud>) · by industry (/solutions/<industry>)
├── Docs        /docs — grouped by product
├── Pricing     /pricing — every product, AIOps included
├── Learn       /learn — glossary grouped by product
└── Resources   blog, scenarios, whitepapers, tools, case studies, compare
Company: about, team, careers, contact, trust, security, privacy, terms
```

Top nav: Products · Solutions · Docs · Pricing · Learn · Resources · [Log in] [Request demo].

**Products menu** — five products across the top in lifecycle order, AIOps last and marked *Early*.
Pointing at (or focusing) a product shows its modules beneath, its docs, and the AIOps agent that works on
it with that agent's status. Source of truth: `src/data/product-suite.ts`.

## 3. Page patterns

### 3.1 Platform home (`/`)
Hero (dark) → platform diagram → clouds → **product suite tabs** → **AIOps spotlight** (dark) →
one foundation → trust bar → FAQ (platform) → CTA.

### 3.2 Product flagship page (`/estate`, `/finops`, `/disaster-recovery`; `/platform` and AIOps follow it)
| # | Section | Content |
|---|---|---|
| 1 | Hero | Stage + name, the buyer's question as h1, one-line answer, CTAs (demo with `?product=`, docs), product illustration or real screenshot |
| 2 | Proof strip | 3–4 facts that are true today (no uncleared numbers) |
| 3 | The problem | The pain point, in the buyer's words |
| 4 | Modules | One card per module (same list as the menu) with a link to its doc |
| 5 | Product tour | Real screenshots in a browser frame, tabbed by module, captioned |
| 6 | How it works | Numbered steps diagram |
| 7 | AIOps on this product | The agent, its status, what it will answer |
| 8 | What you get | Outcomes list |
| 9 | Limits, said plainly | What the product does not do |
| 10 | FAQ | With FAQPage JSON-LD |
| 11 | The rest of the platform | `SuiteStrip` |
| 12 | CTA | Demo with the product preselected |

### 3.3 Engine page (`/platform/<engine>`) — `ProductPageTemplate`, unchanged structure, plus a breadcrumb
back to Onam Security.

### 3.4 Solutions pages — lead with the platform for that cloud/industry, then each product's angle.

## 4. Design system

Tokens live in `src/styles.css` (`@theme`). Use them; do not add raw hex.

| Token | Value | Use |
|---|---|---|
| ink | #0B1220 | headings |
| body | #475569 | body text |
| muted | #64748B | secondary text (minimum on white) |
| subtle | #94A3B8 | icons, borders — **never text** |
| line | #E5E9F0 | borders |
| surface | #F7F9FC | alternate sections |
| brand | #2563EB / hover #1D4ED8 | primary actions |
| product colours | estate #7C3AED · security #2563EB · finops #059669 · drm #D97706 · aiops #4F46E5 | icon tiles, accents |

Type scale: display 64 / 48, h2 40, h3 24, h4 18, lead 18, body 16, small 14, micro 12. Nothing under 12px
outside product mock-ups. Section rhythm: `py-16 md:py-24`; container `max-w-7xl px-4 sm:px-6`.

Shared components — `src/components/site/system/`:
`Section`, `Container`, `Eyebrow`, `SectionHeading`, `IconTile`, `StatusChip` (re-exports AIOps
`StatusBadge`), `BrowserFrame` (screenshot chrome), `Figure` (image + caption + Illustrative label),
`CTABand`.

## 5. Imagery

| Kind | Where | Source |
|---|---|---|
| Product illustrations (isometric, one template) | home suite, product heroes, suite strip | `scripts/generate-product-art.mjs` → `public/images/products/*.svg` |
| Real console screenshots | product tours | DRM demo tenant: `drm/screenshots` (cropped, no session bar). Security, Estate, FinOps, AIOps: to capture from the live console after the owner signs in; account ids masked |
| Smart-art diagrams | how-it-works, platform layers | inline SVG components, brand tokens |
| Icons | everywhere | lucide-react only |
| Product overview sheets | downloadable from each product page | `onam-assets/brand/products/*.gen.py`, regenerated with platform naming |

Every image goes through `Onam-Service-platform/marketing/onam-assets/IMAGE-REVIEW-CHECKLIST.md` before
use: shows only what the product does, labelled illustrative/roadmap where needed, no fake numbers, no
third-party logos, source recorded.

## 6. Content changes outside the product pages
- **Request demo**: `?product=` param, product choice, reasons per product, product in the lead payload.
- **Pricing**: platform pricing page; Estate, FinOps and DRM described as stand-alone per-organisation
  products (contact sales); AIOps listed as early access. No new prices.
- **Site identity**: organisation name "Onam", titles end "— Onam".
- **Docs**: sidebar grouped by product; docs home with a card per product.
- **Learn**: grouped by product; new vendor-neutral articles for asset inventory, FinOps, disaster
  recovery (RTO/RPO) and AI agents with human approval.
- **Footer**: one column per product, AIOps included; duplicates removed.

## 7. Workstreams

| # | Workstream | Owns (files) |
|---|---|---|
| A | Foundation: tokens, system components, nav accessibility, site identity | `src/styles.css`, `src/components/site/system/*`, `Navbar.tsx`, `__root.tsx` |
| B | Product flagship pages + screenshots | `ProductFlagship*.tsx`, `src/data/products.ts`, `/estate`, `/finops`, `/disaster-recovery`, `public/screenshots/console/*` |
| C | Platform-wide pages | `request-demo`, `pricing`, `Footer`, solutions templates, about, trust, compare index, contact |
| D | Docs + Learn | `src/data/docs.ts`, `docs*.tsx`, `src/data/learn-articles.ts`, `learn*.tsx` |
| E | Homepage polish, smart art, AIOps page | `routes/index.tsx`, `components/site/home/*`, `ai-operations*` |
| F | Accessibility + token sweep, QA, review log | all, last |

## 8. Done when
- `npx tsc --noEmit` clean; `npm run build` passes (facts gate included, or skipped only where the marketing
  repo is absent, and said so).
- Every internal link returns 200 on the local server.
- Each persona path (security lead, FinOps lead, DR owner, CTO) reaches a demo form that knows the product.
- Every page checked at 1440px and 390px wide.
- Every new image logged in the review checklist.

## 9. Audit summary (2026-10-06)
- **Structure**: only the homepage, the three new product pages, AIOps, `llms.txt` and the sitemap
  described the platform; the demo form, pricing, solutions, learn, about, trust and ~60 page titles were
  security-only. Broken links: 5 (case-study images).
- **Visual system**: 149 hard-coded colours, 30+ font sizes, 4 status-badge variants, 26 ad-hoc buttons;
  menus hover-only; ~40 low-contrast text uses; no reduced-motion support.
- **Assets**: Estate/FinOps/DRM pages had no visuals; site "screenshots" are hand-made mock screens with
  invented figures; DRM has 40 real captures from its demo tenant; approved one-page product overviews exist
  but were unused.

## 10. Status — 2026-10-06 (built locally, not committed or pushed)

Done
- New platform homepage: hero, layered platform diagram, product tabs, Onam AIOps spotlight, shared foundation, platform FAQ.
- Onam Security page (`/platform`) carries the former security homepage in full.
- Products menu: five products across the top with their modules, docs and AIOps agent; click, keyboard and Escape work.
- Flagship pages for Estate, FinOps and DRM (`ProductFlagship.tsx`); DRM uses six real console screenshots (demo tenant).
- "Onam Operations" renamed "Onam AIOps" everywhere (site, docs, diagrams, product overview sheets).
- Demo form knows the product (`?product=`); pricing, footer, solutions, about, trust, contact, resources made platform-wide.
- Docs grouped by product, new platform introduction, Security overview and four DRM docs; Learn grouped by product with six new explainers.
- Estate "monthly cost" claim removed everywhere (never populated in code).
- Animated console demos labelled illustrative.
- Checks: type check clean; claims checker clean (no contradictions); 250 internal URLs crawled, none broken; production build passes
  (its built-in claims step skipped only because `../marketing` is a broken link on this machine — the same checker was run directly
  from `../onam-marketing/facts`).

Added 2026-10-07 (owner: "decide and finish")
- Logo wordmark is now "Onam" on the site and on every product/security overview sheet; company stays Onam Security, Inc.
- Approved one-page overviews published (`public/overviews/`, `OverviewSheet.tsx`) with download, on the 4 product pages and 7 Security engine pages.
- Social share cards regenerated (brand "Onam"; home, Estate, FinOps, DRM, AIOps, docs, 9 new learn cards); unsourced "80%" and "100% agentless" removed.
- FinOps wording aligned with code: it produces showback and chargeback statements; it does not move money.
- Accessibility sweep: low-contrast text on light backgrounds, tiny text, heading order fixed on older pages; every page one h1.
- Re-checked: type check clean, claims check clean, 261 internal URLs OK, production build passes.

Open (decided, deferred)
- Real screenshots for Security, Estate, FinOps and AIOps: only from the live console once the owner signs in; no local data exists to capture honestly.
- Paid generated imagery (Figma): not used; the drawn set is on brand.
- Converting older pages' hard-coded colours to tokens: no visible change for visitors; do it when those pages are next edited.
- Estate console shows an empty "Monthly Cost" column (product, not website).

### Navigation and marketplaces — 2026-10-07
- Top bar: **Products · Solutions · Why Onam · Resources · Company**; right: Docs, Log in, Request demo. Learn, Docs and the
  resource library are one Resources menu (Learn / Build / Evaluate). Pricing left the top bar (enterprise cloud security sells
  through a demo) and lives under Resources › Evaluate; the page is unchanged.
- New `/why-onam`: the buying argument, built from claims already on the site.
- Cloud marketplaces: AWS, Microsoft Azure and Google Cloud shown as "Coming soon" on the homepage, Why Onam, pricing and the
  footer. **When a listing is live, paste its public URL into `src/data/marketplaces.ts`** — every surface switches to
  "Available on …" with the link. Never set a URL before the listing is publicly visible.

### Banners — 2026-10-07
- One backdrop component (`src/components/site/system/Backdrop.tsx`): tint/glow in the page colour, a context pattern
  (graph, grid, flow, rings, dots), an optional faint oversized icon, and a fade.
- **Dark** banners: homepage, Why Onam and the five product pages (Estate, Security, FinOps, DRM, AIOps) — one product family,
  each in its own colour with its illustration or real screenshot framed on the right.
- **Light** banners: the 26 Security engine pages (engine colour + icon), cloud and industry solutions (provider/industry colour +
  icon), pricing, docs, learn, resources, blog, scenarios, whitepapers, tools, case studies, compare, company pages, trust,
  request demo. Privacy and terms deliberately faint.
- Re-checked: type check, claims check, 267 internal URLs, production build — all pass.

### Capability pages — 2026-10-07
- Every Estate, FinOps and DRM module now has its own marketing page (13): `/estate/{inventory,architecture,discovery}`,
  `/finops/{explore,ownership,plan,savings,reconciliation}`, `/disaster-recovery/{applications,protection,recovery-plans,objectives,drift}`.
  Template `CapabilityPage.tsx`; content in `src/data/capabilities/*.ts` (from the docs only); routes `*_.$module.tsx`.
- Products menu, product-page module cards and footer now open these pages; each page links on to its docs.
  AIOps menu items open sections of the AIOps page. Only "Documentation" links go to docs.
- In the sitemap and llms.txt. Checks: type, claims, 285 internal URLs, build — all pass.
