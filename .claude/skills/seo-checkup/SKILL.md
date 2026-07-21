---
name: seo-checkup
description: Biweekly SEO/AEO health check for www.onamsecurity.com — site health, indexing status, AI-answer visibility, GSC query analysis (if CSV in ~/Downloads), next blog topics, scorecard vs last run. Use when the user asks for the SEO checkup, biweekly SEO review, or ranking status.
---

# Biweekly SEO/AEO checkup

Work through all six steps; finish with the scorecard. Compare against the previous checkup
recorded in the `seo` memory and update that memory with this run's numbers at the end.

## 1. Site health (all via curl, no deploy needed)

- `https://www.onamsecurity.com` + 5 key pages (/platform/cspm, /pricing, a solutions page,
  a docs article, newest blog post): expect 200, correct `<title>`, canonical present.
- Structured data spot check: fetch 2 of them and confirm `application/ld+json` parses and
  expected @types are present (FAQPage on product/pricing pages).
- `robots.txt`, `sitemap.xml` (note URL count), `llms.txt`, `llms-full.txt`: all 200.
- http→https and apex→www redirect script still present on `/`.

## 2. Indexing status

- WebSearch `site:onamsecurity.com` — note roughly how many pages Google shows and whether
  key pages (homepage, /platform/cspm, comparison post) are among them.
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

## 5. Next content

Propose 2 blog topics ready for `/publish-post`, chosen from: striking-distance queries
(step 4), AI-visibility gaps (step 3), or platform areas with no supporting post yet.
One sentence each on why now.

## 6. Scorecard

Short table vs last checkup: indexed pages, brand-query result, AI-answer appearances,
striking-distance queries actioned, posts published since last run. Then update the `seo`
memory with this run's date + numbers, and list the user's manual to-dos (request indexing
on new URLs, any profile/backlink items).
