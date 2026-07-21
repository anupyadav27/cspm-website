# Onam Security — SEO / AEO Runbook

Status: **on-site SEO + AEO complete** as of v18 (2026-07-21).
Automated on every build/deploy: sitemap.xml, llms.txt, llms-full.txt, all structured data.
Automated on every `/publish-post`: deploy, IndexNow ping, social kit.

---

## Part 1 — One-time setup (~2 hours, needs YOUR accounts)

Do these once, in order. When done, tell Claude **"one-time SEO setup done, here are the profile
URLs"** — the profile URLs get added to the site's Organization schema (`sameAs`) and redeployed.

### 1. Bing Webmaster Tools (~15 min) — feeds ChatGPT & Copilot answers
1. Go to https://www.bing.com/webmasters and sign in (any Microsoft account).
2. Click **"Import from Google Search Console"** → sign in with the Google account that
   verified onamsecurity.com → select the property → Import.
3. Confirm the sitemap (`https://www.onamsecurity.com/sitemap.xml`) shows under Sitemaps.

### 2. Google Search Console — request indexing (~10 min) — same-day crawl
1. Open https://search.google.com/search-console → onamsecurity.com property.
2. Paste each URL below into the top **URL Inspection** bar → **Request Indexing**:
   - `https://www.onamsecurity.com/`
   - `https://www.onamsecurity.com/platform/cspm`
   - `https://www.onamsecurity.com/resources/blog/onam-vs-wiz-orca-prisma-cloud`
   - `https://www.onamsecurity.com/pricing`
3. (Repeat for every new cornerstone post — the biweekly checkup will remind you.)

### 3. Entity profiles (~90 min) — how AI engines corroborate "who is Onam Security"
- **LinkedIn company page**: linkedin.com → Work icon → Create a Company Page.
  Name "Onam Security", website `https://www.onamsecurity.com`, industry "Computer & Network
  Security", logo = `public/logo.svg` (export PNG). Reuse the homepage description.
- **X**: confirm `x.com/onamsecurity` exists and is yours (the site's meta tags + schema
  already reference it — if the handle isn't registered, register it now before someone else does).
- **Crunchbase**: crunchbase.com → Add a Company → same details.
- **G2**: sell.g2.com → claim a vendor profile → category "Cloud Security Posture Management
  (CSPM)". Reviews come later; the listing itself is the entity signal.

---

## Part 2 — Recurring work

### Every 2 weeks — paste this prompt (or run `/seo-checkup`)

> Run the biweekly SEO/AEO checkup from SEO-RUNBOOK.md:
> 1. Site health: key pages 200 on https, titles/canonicals intact, structured data present,
>    sitemap URL count vs last run.
> 2. Indexing: check how much of the site Google/Bing have indexed; re-ping IndexNow for
>    anything new or changed.
> 3. AI visibility: search the web for "Onam Security", "best CSPM tools", "Wiz alternatives"
>    and report whether/where we appear, including AI answers.
> 4. If I've exported a Search Console Performance→Queries CSV to ~/Downloads, analyse it:
>    find queries at position 8–20 with impressions and propose the specific page changes
>    to move them up. Apply the ones you can do on-site.
> 5. Propose the next 2 blog topics based on coverage gaps, ready for /publish-post.
> 6. Finish with a short scorecard vs the last checkup (use the seo memory).

**Before running it (2 min, optional but high-value):** GSC → Performance → Export → CSV →
save to `~/Downloads` so step 4 has data. Without it the checkup still does steps 1–3, 5–6.

### Every 2 weeks (same session, your half)
- Publish 1 post: `/publish-post <topic from last checkup>`.
- Post the social kit to LinkedIn/X (paste from `social-kits/<slug>.md`).
- GSC → Request Indexing on the new post URL.

### Quarterly — paste this prompt
> Quarterly SEO refresh per SEO-RUNBOOK.md: update the Wiz/Orca/Prisma comparison post
> (dates, numbers, anything stale), refresh homepage stats if product numbers changed,
> re-validate structured data on the 5 most important pages with Google's Rich Results
> test approach, and review llms.txt facts for accuracy. Deploy the result.

### Ongoing, opportunistic (only you can)
- Ask happy customers for G2 reviews (2–3 reviews unlocks the category grid — a page AI
  engines cite directly for "best CSPM" queries).
- Say yes to podcasts/guest posts/webinars — each is a backlink + entity mention.

---

## Cadence summary

| When | What | Who |
|---|---|---|
| Every 2 weeks | `/seo-checkup` + 1 `/publish-post` + social kit paste + GSC request-index | Claude + you (~30 min of your time) |
| Quarterly | Refresh prompt above | Claude |
| Ongoing | G2 reviews, backlinks, podcasts | You |
