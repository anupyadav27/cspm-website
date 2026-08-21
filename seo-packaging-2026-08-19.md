# SEO packaging rewrites — 2026-08-19

> ## ⚠️ Amended the same day — read this first
>
> [measure/report/assets.py](../measure/report/assets.md) graded every page and found that
> **all three targets below sit past position 20**, where a title rewrite cannot produce a
> click because nobody is shown the result in the first place. Of 96 site pages, **51 are
> DARK and 39 are BURIED; exactly 2 are genuine packaging failures**, and neither is on
> this page.
>
> **What still stands:** the IBM change is a *relevance* fix, not a click fix. The query
> `ibm cloud network security` draws 92 impressions at position 28.1 and the page never
> uses the word "network" while covering VPC, Security Groups and Cloud Internet Services.
> Naming what the page contains is how a page earns a better position. Expect movement in
> **ranking**, over weeks — not in CTR, next week.
>
> **The two actual packaging failures**, both in clickable range with zero clicks:
> `/docs/onboarding/alicloud` (15 impr, **position 13**) and
> `/resources/blog/onam-vs-wiz-orca-prisma-cloud` (10 impr, **position 11.2**). Those are
> the cheap wins. This document targeted the wrong pages because it was written before
> anything graded position.

Answers the `web-growth` ACT findings from the 2026-08-19 scan. **Titles and meta
descriptions only — no page content changes**, which keeps this inside the 60-day
collateral freeze.

Every proposed line describes something the page already contains. Nothing here promises
coverage that is not on the page; that would trade a click problem for a bounce problem,
which is the PROMISE failure the manager flagged on video this same week.

Not applied. Each is a two-line edit and reverts by reverting the line.

---

## 1 · `/solutions/ibm` — the biggest single miss on the site

`src/routes/solutions/ibm.tsx`

**The evidence.** `ibm cloud network security` draws **92 impressions at position 28.1** —
the largest non-brand query the site has. The page sits at position 28.6 with 143
impressions and **zero clicks**. It covers *VPC Infrastructure & Security Groups*, *Cloud
Internet Services* and *Activity Tracker Events*, and its title never says "network".

```diff
- title: "IBM Cloud Security Posture Management (CSPM) — Onam Security",
+ title: "IBM Cloud Security — VPC, Network & Posture Management — Onam",

- description:
-   "Agentless IBM Cloud security posture management — 613 rules across VSI, IKS, Cloud Object Storage, Db2 and IAM, mapped to CIS IBM Cloud and CIS IBM Db2 benchmarks. Full CSPM depth, not a checkbox integration."
+ description:
+   "Agentless IBM Cloud security — VPC infrastructure and security groups, Cloud Internet Services, IKS and OpenShift, Cloud Object Storage, Db2 and IAM. 613 rules mapped to CIS IBM Cloud and CIS IBM Db2 benchmarks. Full CSPM depth, not a checkbox integration."
```

Every added term names a service already in the page's `services` list. The 613 figure is
unchanged and still traces to `facts/product.yaml`.

## 2 · `/resources/blog/ciem-vs-iam-security` — three queries, one already on page 1

`src/data/blog-posts.ts`

**The evidence.** Three variants of the same intent, 16 impressions, zero clicks:

| Query | Impr | Position |
|---|---|---|
| `what's the difference between ciem and traditional iam?` | 5 | **8.2** |
| `ciem vs iam difference` | 7 | 25.6 |
| `ciem vs iam differences` | 4 | 27.0 |

Position 8.2 is page one. A page-one result with zero clicks over 28 days is a title
problem, not a ranking problem — and the query is phrased as a question the title does not
visibly answer.

```diff
- title: "CIEM vs IAM: What Cloud Identity Security Actually Adds"
+ title: "CIEM vs Traditional IAM: What's the Difference?"
```

Mirroring the searcher's own phrasing is the entire change. Verify the current line before
applying — the exact string above is from the GSC page record, not read from the file.

## 3 · `/solutions/alicloud` — multi-cloud intent

`src/routes/solutions/alicloud.tsx`

**The evidence.** 105 impressions at position 26.3. The query is
`alibaba cloud security aws` (15 impr, position 28.5) — someone running both clouds and
looking for one tool. The description already answers this well; the title does not.

```diff
- title: "Alibaba Cloud Security Posture Management (CSPM) — Onam Security",
+ title: "Alibaba Cloud Security (CSPM) — Alongside AWS, Azure & GCP — Onam",
```

The description already says *"findings on the same graph as your AWS, Azure and GCP
posture"*, so the title is now consistent with it rather than adding a new claim.

---

## Two targets I could not finish, and why

**`cloud native application` — position 8.8, 6 impressions, 0 clicks.** I could not
identify which page ranks for it. `gsc_query` and `gsc_page` are separate tables in
`measure.db` with no join between query and landing page, so the mapping is not derivable
from what was pulled. Get it from the Search Console UI (Performance → that query → Pages)
before drafting, rather than guessing at `/learn/cnapp`.

**`what questions should i ask during a wiz vs orca security poc?` — position 11.0, 5
impressions.** Strong buying intent and worth owning, but the honest answer is a page that
does not exist. That is new collateral and the freeze says no until ~2026-10-09. Recorded
here so it is not lost.

## After applying

```bash
python3 marketing/facts/check-facts.py src/routes/solutions src/data   # claims gate
npm run build && npm run preview                                       # build gates
```

Then wait a full GSC cycle — the API finalises about three days late, so nothing before
**2026-08-26** means anything. Bind the result to the trace afterwards.
