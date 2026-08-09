---
name: seo-checkup
description: Biweekly SEO/AEO health check for www.onamsecurity.com — site health, indexing status, AI-answer visibility, GSC query analysis (if CSV in ~/Downloads), next blog topics, scorecard vs last run. Use when the user asks for the SEO checkup, biweekly SEO review, or ranking status.
---

# Biweekly SEO/AEO checkup

Work through all six steps; finish with the scorecard. Compare against the previous checkup
recorded in the `seo` memory and update that memory with this run's numbers at the end.

## 1. Site health (all via curl, no deploy needed)

> **Use `grep -a` on anything curled from the live site.** The HTML trips grep's binary
> detection and a plain `grep -c` silently returns nothing, which reads as "the link is
> missing" when it is present. This has now caused a false negative twice.
>
> **A 200 is reachability, not function.** For the three interactive tools especially,
> check the page *works* — the calculators returned 200 for months while their CTA pointed
> at an apex that did not resolve.

- `https://www.onamsecurity.com` + 5 key pages (/platform/cspm, /pricing, a solutions page,
  a docs article, newest blog post): expect 200, correct `<title>`, canonical present.
- Structured data spot check: fetch 2 of them and confirm `application/ld+json` parses and
  expected @types are present (FAQPage on product/pricing pages).
- `robots.txt`, `sitemap.xml` (note URL count), `llms.txt`, `llms-full.txt`: all 200.
- http→https and apex→www redirect script still present on `/`.

## 2. Indexing status

**Do step 4 FIRST if a GSC export exists — it is the only reliable source here.**

- ⛔ **`site:onamsecurity.com` via WebSearch is NOT evidence.** It returns other companies
  entirely (ObjectSecurity, OnSecurity, Core Security) and returned zero for this domain on
  2026-08-03 while GSC showed the site indexed and ranking across 41 pages. The 2026-08-03
  checkup recorded "ZERO indexed" on that basis and was wrong. Run it if you like, but never
  conclude anything from it — a null result means the operator is unsupported, not that the
  site is missing.
- **GSC is the authority.** Indexed-and-ranking is proven by impressions in the export, not
  by a search operator.
- If any new/changed URLs since last checkup: `npx tsx scripts/indexnow.ts <paths>` (or
  `--all` if many changed). Record the response code.

## 3. AI-answer visibility

WebSearch (and read the AI-answer boxes where surfaced) for:
- `Onam Security` (brand — expect us to dominate)
- `best CSPM tools 2026`
- `Wiz alternatives`
- `cloud security posture management platform`

Report where Onam appears (position, AI answer inclusion, cited page). Absence is a data
point, not a failure — track the trend.

## 4. Search Console analysis (only if the user exported data)

Look for a fresh GSC export in `~/Downloads` (Queries.csv or similar, check file dates).
If present: rank queries by impressions where position is 8–20 ("striking distance").
For the top 3–5: identify the matching page and apply the on-site fix now — title/description
tweak, a new FAQ entry answering that query's phrasing, or an internal link from a
high-traffic page. Deploy if changes were made (next vN, see deployment memory).
If no export: skip, and remind the user it takes 2 minutes and makes this step possible.

**An empty striking-distance band is a valid, common outcome on a young domain.** On
2026-08-09 it held two queries at one impression each, both junk. Do not manufacture work
to fill this step. When it is empty, say so and spend the effort on the highest-impression
cluster instead, whatever its position — that run's real finding was /platform/attack-path
drawing 144 impressions at position 82.

## 5. Next content

Propose 2 blog topics ready for `/publish-post`, chosen from: striking-distance queries
(step 4), AI-visibility gaps (step 3), or platform areas with no supporting post yet.
One sentence each on why now.

## 6. Scorecard

Short table vs last checkup: indexed pages, brand-query result, AI-answer appearances,
striking-distance queries actioned, posts published since last run. Then update the `seo`
memory with this run's date + numbers, and list the user's manual to-dos (request indexing
on new URLs, any profile/backlink items).

## 7. Performance (added 2026-08-09 — this was missing and hid a real defect)

- **Compression:** `curl -sI -H 'Accept-Encoding: gzip, br' <url>` on an HTML page, a JS
  asset and `llms-full.txt`. Expect `content-encoding` on all three. Its absence went
  unnoticed until 2026-08-09, when the homepage was shipping 189KB that gzips to 28KB.
  If missing, check `kubectl get configmap ingress-nginx-controller -n ingress-nginx` —
  an empty ConfigMap means `use-gzip` is at the chart default of **false**.
- **TTFB:** 5 warm runs per key page via `curl -w '%{time_starttransfer}'`. Under ~500ms.
- **Cache-Control:** HTML should be `no-cache` (revalidate), hashed assets
  `public, max-age=31536000, immutable`.
- **HSTS:** `strict-transport-security` present on HTML responses.
