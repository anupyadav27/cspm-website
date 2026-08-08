# Enterprise-grade UI — findings and plan

**Feedback received (2026-08-08):** the site should look like a Fortune 500 vendor's
— best-in-class, able to stand next to the category leaders.

Everything below was measured against the live site (v39) with Playwright, not
assessed by eye. Where a number appears, it is reproducible.

---

## The headline finding

**The site is not badly built. It is under-proved.**

| Measured | Result |
|---|---|
| Homepage load event | **870 ms**, 26 requests, 1.39 MB |
| `<html lang>`, single `<h1>`, heading-level skips | correct · 1 · **0** |
| Links/buttons with no accessible name | **0** |
| WCAG AA contrast failures | **2** (both 10px labels inside the decorative console mock) |

That is a competent, fast, accessible site. Wiz and Prisma Cloud do not beat it on
page weight or markup hygiene. So "make it look enterprise" is **not** an
engineering problem, and a restyle alone will not close the gap.

What a Fortune 500 buyer's shortlist actually turns on is **proof** — and that is
where the site is thin:

| Enterprise signal | Present |
|---|---|
| SOC 2 · ISO 27001 · GDPR named | yes |
| `/company/security` page | yes (200) |
| **Named customers / logos** | **no** — an earlier audit reported "yes"; that was a false positive matching the word "Customers" |
| **Case studies / testimonials** | **no** on the site — *6 already written* in `marketing/output/case-studies/` |
| **Analyst placement (Gartner / Forrester)** | no |
| **Trust centre** (`/trust`) | no — 404 |
| **Status page** | no — 404 |

A security vendor with no public trust centre and no status page is the specific
thing a CISO's team notices, because they are evaluating *your* security posture,
not only your product's.

---

## A · Defects — no design decision required

**A1. The hero is clipped on mobile.** The `h1` and the paragraph under it overhang
the viewport and are cut off, not scrollable:

```
mobile-390: h1 right edge 410px in a 390px viewport   (+20px lost)
mobile-360: +50px lost
ancestor chain ends in section.overflow-hidden, scrollWidth 518 — unreachable
container content box is 342px; the column renders at 386px
```

Readers lose the end of lines — *"or a compliance audi…"*, *"identit…"*. Likely a
grid item resolving to `min-content` wider than its column; the usual fix is
`min-w-0` on the grid children.

> **Note for whoever picks this up:** `scrollWidth === clientWidth` does **not**
> prove a layout fits. An `overflow:hidden` ancestor absorbs the overflow and
> reports no scroll while still clipping. A first pass of this audit used that
> check and declared every page clean. Compare element `getBoundingClientRect().right`
> against `documentElement.clientWidth` instead.

**A2. Two WCAG AA contrast failures**, both inside the hero's console mock:
`1.78:1` on "Risk score 68" (needs 4.5) and `2.56:1` on "Last scan: 2 min ago".
Accessibility conformance is a literal line item in large-enterprise RFPs.

**A3. `Is your cloud secure ,`** — a visible gap before the comma at display size,
desktop and mobile. On the largest text on the site.

**A4. Smallest rendered body text is 12px.** Fine for captions, thin for an
audience that reads on a laptop docked to a 27" monitor.

## B · Brand consistency

**B1. The hero gradient uses a colour the brand does not define.** The headline
runs black → blue → teal-green. `brands/onam/brand.yaml` defines navy `#082869`
and blue `#2563EB`; there is no teal in the palette. The studio's palette was
consolidated into one file specifically so decks and video could not drift — the
website is now the surface that drifts.

**B2. Hero claims "10,000+ security rules."** True against the 11,346 catalog,
ambiguous against the cleared 9,853 CSPM figure. The fact gate already flags 25
similar understatements (`services: says 40+, cleared value is 549`).

## C · The enterprise gap — proof, not polish

Ranked by what moves a shortlist, most first.

**C1. Put customers on the page.** Logos, or named references, or anonymised ones
("a Fortune 100 insurer"). Nothing else on this list matters as much. If none can
be named yet, that is a business constraint to solve, not a design one.

**C2. Publish the 6 case studies that already exist.** They are written and sitting
in `marketing/output/case-studies/`, unpublished. This is the cheapest credibility
on the list.

**C3. Build a trust centre at `/trust`.** SOC 2 report request, ISO certificate,
pen-test summary, sub-processor list, DPA, security contact, disclosure policy —
one page, linked from the footer. Today this is scattered or absent.

**C4. Status page.** `status.onamsecurity.com`. Enterprise buyers check whether one
exists before they check what it says.

**C5. Analyst placement**, when there is one to cite. Cannot be manufactured.

## D · Visual maturity — the actual "looks" work

Do this **after** A and C. Restyling an under-proved page produces a prettier
under-proved page.

**D1. Density and restraint.** The current hero is generous with whitespace and
large type. Enterprise leaders trend tighter: more information per screen, smaller
display sizes, a muted palette, colour reserved for state and action rather than
decoration.

**D2. Real product over stylised mock.** The hero shows an illustrated console.
Real captures — which the studio already produces into `media/footage/` — read as a
shipping product; an illustration reads as a prototype.

**D3. One type scale and one spacing rhythm**, enforced. The palette now has a
single source in `brand.yaml`; type and spacing do not.

**D4. Motion language.** Currently `animate-slide-up` on the hero. Either commit to
a consistent, restrained motion system or remove it.

---

## Suggested order

1. **A1** — a defect on every phone visit, no decision needed
2. **A2, A3, B1** — an afternoon, all unambiguous
3. **C2, C3, C4** — proof, and mostly content that already exists
4. **C1** — the highest-value item and the one needing a business decision
5. **D** — the visual pass, once the page has something to be proud of

**A restyle without C is the trap.** The feedback says "looks"; the gap is proof.
