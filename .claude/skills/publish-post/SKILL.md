---
name: publish-post
description: Write, publish, and distribute a new Onam Security blog post end-to-end — draft in house voice grounded in real product facts, wire into blog-posts.ts, build + deploy to EKS, ping IndexNow, and generate a paste-ready social kit for LinkedIn/X/Reddit/Dev.to. Use when the user asks to publish a post, write a blog article, or run the content pipeline. Args: topic (required), optional target keyword.
---

# Publish a blog post (end-to-end)

Input: a topic, optionally a target keyword/query. If no topic given, propose 3 grounded in
what the site doesn't cover yet and ask the user to pick.

## 1. Research the angle (before writing)

- Read `src/data/blog-posts.ts` slugs/titles — avoid overlap with existing posts.
- Pick ONE primary query the post should rank for, phrased the way a person searches
  (e.g. "how to detect s3 bucket misconfiguration"). Prefer question phrasings — they feed
  Google AI Overviews and chat-engine answers.
- Collect grounding facts ONLY from repo sources: `src/data/platform-pages.ts`,
  `src/data/docs-articles/*`, `src/routes/index.tsx` stats, existing posts. Canonical numbers:
  7 clouds, 16 engines, 10,000+ rules (1,918 CSPM), 13 frameworks, 100% agentless, <3 min
  connect, <5 min first alert, FAIR-model prioritisation. NEVER invent product numbers,
  customer names, benchmarks, or claims about named competitors.

## 2. Draft in the house voice

Enterprise but human — the voice that survives Google's quality systems:

- Opinionated stance stated early; no "In today's rapidly evolving cloud landscape" openers.
- Concrete numbers and named mechanisms, not adjectives. Show a real scenario or walkthrough
  (day-by-day, step-by-step) where possible — experience signals beat keyword density.
- Admit tradeoffs and where alternatives are genuinely fine. One honest concession per post
  minimum; it's what makes the rest credible (to readers AND to AI engines).
- Tables for anything comparative. Markdown-ish body (same conventions as existing posts:
  `##`/`###`, `**bold**`, `| tables |`, `![alt](/screenshots/….png)` where a real screenshot fits).
- 7–12 min read. End with a soft CTA linking `/request-demo` plus 1–2 internal links to
  relevant `/platform/*` or `/docs/*` pages inline.
- Author: "Onam Security Team" (never invent a human byline).

## 3. Wire it in

- Add the post object at the TOP of `BLOG_POSTS` in `src/data/blog-posts.ts`
  (newest first). Fields: slug (kebab, keyword-bearing, no dates), title, category
  (reuse an existing category when one fits), excerpt (~2 sentences, the search snippet),
  author, date (today, "Month D, YYYY"), readTime, body.

## 4. Build, deploy, verify

Check the deployment memory for the current image number; use the next vN.

```bash
NITRO_PRESET=node-server npm run build        # also regenerates sitemap.xml + llms.txt
docker build --platform linux/amd64 -t yadavanup84/cspm-docs-website:vN .
docker push yadavanup84/cspm-docs-website:vN
kubectl set image deployment/cspm-docs-website cspm-docs-website=yadavanup84/cspm-docs-website:vN -n threat-engine-engines
kubectl rollout status deployment/cspm-docs-website -n threat-engine-engines
curl -s -o /dev/null -w '%{http_code}' https://www.onamsecurity.com/resources/blog/<slug>
```

Update the deployment memory's current-image line after a successful rollout.

## 5. Ping search engines

```bash
npx tsx scripts/indexnow.ts /resources/blog/<slug> /resources/blog /
```

(IndexNow → Bing/Yandex; Bing feeds ChatGPT search + Copilot. Google discovers via the
sitemap already registered in Search Console — for cornerstone posts, remind the user to
"Request indexing" on the URL in GSC for a same-day crawl.)

## 6. Social kit

Write `social-kits/<slug>.md` with paste-ready copy per platform. Rules:

- **LinkedIn** (company + personal): 120–200 words. Hook line, 3 short takeaways, link,
  2–4 hashtags max (#CloudSecurity #CSPM). No engagement-bait.
- **X/Twitter**: a 5–7 post thread. Post 1 = the hook (no link); link goes in the final post.
  Each post standalone-readable.
- **Reddit** (pick the fitting subs: r/cybersecurity, r/devops, r/aws, r/AZURE, r/googlecloud,
  r/kubernetes): discussion-first title phrased as the underlying question, 2–3 paragraph
  text post that gives the answer's core BEFORE the link, and an explicit "(disclosure: I
  work on Onam)" line. Flag in the kit: Reddit/HN must be posted by a human who sticks
  around to reply — automated or drive-by posting gets banned and damages the brand.
- **Hacker News**: only for genuinely technical deep-dives (architecture, detection
  engineering). Skip vendor-comparison or marketing-angle posts — say so in the kit.
- **Dev.to / Medium cross-post**: note to republish the full body with `canonical_url`
  set to the onamsecurity.com URL (free reach, no duplicate-content risk).
- If the user has a scheduler (Buffer/Postiz) connected, note the kit is ready to load there.

## 7. Report

Final message: live URL, IndexNow result, kit file path, and the one manual step list
(GSC request-indexing, human-posted Reddit/HN if applicable).
