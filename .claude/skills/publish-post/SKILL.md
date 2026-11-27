---
name: publish-post
description: Write, publish, and distribute a new Onam Security blog post end-to-end — draft in house voice grounded in real product facts, run the facts check and the marketing machine gates, STOP for the owner's explicit approval, then wire into blog-posts.ts, build + deploy to EKS, ping IndexNow, and generate a paste-ready social kit for LinkedIn/X/Reddit/Dev.to. Use when the user asks to publish a post, write a blog article, or run the content pipeline. Args: topic (required), optional target keyword.
---

# Publish a blog post (end-to-end)

Input: a topic, optionally a target keyword/query. If no topic given, propose 3 grounded in
what the site doesn't cover yet and ask the user to pick.

> **Hard rule: nothing is built or deployed until step 3 has passed and the owner has
> approved this exact draft in this conversation.** Steps 1–3 only write the draft file
> and run checks. Step 3 ends in a STOP. `npm run build`, `docker`/`crane`, `kubectl` and
> IndexNow (steps 5–6) are not run before the owner's explicit approval, and an approval
> covers one draft: if the text changes afterwards, run step 3 again and ask again.

## 1. Research the angle (before writing)

- Read `src/data/blog-posts.ts` slugs/titles — avoid overlap with existing posts.
- Pick ONE primary query the post should rank for, phrased the way a person searches
  (e.g. "how to detect s3 bucket misconfiguration"). Prefer question phrasings — they feed
  Google AI Overviews and chat-engine answers.
- Collect grounding facts ONLY from repo sources: `src/data/platform-pages.ts`,
  `src/data/docs-articles/*`, `src/routes/index.tsx` stats, existing posts. Every number comes from
  `../marketing/facts/product.yaml` (and limits from `limits.yaml`); do not copy numbers from this file or older posts. NEVER invent product numbers,
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
- Author: a real person from `src/data/authors.ts` who owns the piece (never invent a byline).

Save the draft as a file, not only in chat — the gates run on a file and the audit log
names it: `../marketing/output/blog/<slug>.md` (title, excerpt, author, then the body
exactly as it will go into `blog-posts.ts`). Do **not** edit `src/` yet.

## 3. Gate the draft — REQUIRED, ends in a STOP

Run from the website repo root. Paths assume the workspace layout `onam-live/{website,marketing}`.

**3a. Facts check.** Every number in the draft against the cleared values in
`marketing/facts/product.yaml`:

```bash
python3 ../marketing/facts/check-facts.py ../marketing/output/blog/<slug>.md
```

Exit 0 = clean (read any advisories). Exit 1 = a claim contradicts the facts: fix the
draft and re-run. Exit 2 = the checker is broken: STOP and tell the owner — an
unverifiable claim is not a cleared claim. Also confirm the site as a whole is clean
before you touch it: `npm run facts:check` (the same check `npm run build` runs).

**3b. Judge the three reasoning gates.** Using the rubric in
`../marketing/.claude/skills/run-machine-gates/SKILL.md`, decide `quality`, `brand` and
`disclosure` as `pass` or `bounce`. A bounce needs a specific `--reason` (quote the line)
and a `--fix`. Judge honestly: the verdict is recorded under your run.

**3c. Dry run while you revise.** It runs the real claims gate and every refusal, and
writes nothing to `gates/audit.jsonl` or the human queue:

```bash
python3 ../marketing/gates/gates.py run ../marketing/output/blog/<slug>.md \
    --audience public --dry-run --quality pass --brand pass --disclosure pass
```

On a bounce, fix the draft and dry-run again. Do not proceed on a bounce.

**3d. The recorded run.** When the dry run passes, run it once for the record:

```bash
python3 ../marketing/gates/gates.py run ../marketing/output/blog/<slug>.md \
    --audience public --quality pass --brand pass --disclosure pass
```

It must end `queued-for-human` (exit 0). It can never say approved — only a person can.
If `manager/queue/waiting-on-you.md` does not exist in this workspace the queue line is
silently skipped; the STOP below is then the only queue, which is why it is mandatory.

**3e. STOP — ask for explicit approval.** End your turn with:

- the draft path, title, slug, author and word count, and the full draft (or a link to the file);
- the facts-check result (exit code and any advisories);
- the gate result: each gate's verdict and the `audit.jsonl` timestamp from 3d;
- the exact question: *"Reply `approve <slug>` to build and deploy this draft, or tell me what to change."*

Do not continue until the owner replies with an explicit approval naming this post.
"Looks good", silence, an approval given before the gates ran, or approval of a different
draft is not approval. Any change to the text after approval → back to 3a.

## 4. Wire it in (only after approval)

- Add the post object at the TOP of `BLOG_POSTS` in `src/data/blog-posts.ts`
  (newest first). Fields: slug (kebab, keyword-bearing, no dates), title, category
  (reuse an existing category when one fits), excerpt (~2 sentences, the search snippet),
  author, date (today, "Month D, YYYY"), readTime, body. The body is the approved draft,
  verbatim.

## 5. Build, check, deploy, verify (only after approval)

**Before pushing an image**, build and check the page locally. The build re-runs the facts
gate (`scripts/facts-gate.mjs`) and fails on drift. Then serve the build and record
accessibility and performance evidence with the AEOS checker (it uses this repo's
installed Playwright; it installs nothing):

```bash
NITRO_PRESET=node-server npm run build
PORT=4173 node .output/server/index.mjs &          # local preview of the built server
AEOS=../../development-platform/aeos
python3 $AEOS/96-tools/check_web_quality.py all --url http://localhost:4173/resources/blog/<slug> \
    --playwright node_modules --out-dir ../marketing/output/blog/<slug>-webcheck
kill %1
```

Exit 0 = pass. Exit 1 = a real defect (low contrast, text under 12 px, small tap targets,
sideways scroll on mobile, not exactly one `h1`, an image without `alt`, or a budget over):
fix it, or report it to the owner and get a decision before deploying. Exit 2 = nothing was
measured — say so; it is not a pass. If the work is tracked in AEOS (`aeos open "Write a
blog post about …"` routes to `WF-CONTENT-PAGE`), record the same commands with
`aeos gate <task> G11 --run "…a11y…"` and `aeos gate <task> G09 --run "…perf…"`.

Check the deployment memory for the current image number; use the next vN.

> **Current image: `v93`** — deployed 2026-11-27 (v93: AI Security docs rebuilt as visual explainers with real console screens; free plan up to 25 units with /start-free and /start-free/thanks; conversion fixes (source attribution on every form, consent-gated generate_lead, Book a demo label, Pricing in nav, audit scan for estates over 25 units); blog truth refresh + Security Hub post + FAQ schema + /blog redirects; real screens replace mock-ups; diagrams/OG truth sweep; 30 engines. Built from a clean worktree of main 8cf2cb8 with the marketing repo symlinked beside it for the facts gate; image assembled with crane append onto node:22-alpine + crane mutate (copied v92 config), clean DOCKER_CONFIG. Next is v94. Previous — v92: deployed 2026-11-24 (v92: combined release = v90 choke-point Short + AI-answers fixes: Organization data with Noida address, founder and unit prices, llms.txt opening, 3 buyer's guides /resources/blog/cspm-tools-public-pricing, prisma-cloud-alternatives, orca-security-alternatives, current Cortex/CrowdStrike quotes; built and pushed with crane (crane append onto node:22-alpine + mutate workdir/env/cmd) because Docker Desktop hung. v91 = AI-answers build without the choke-point change, never deployed. Two sessions both released v90 within minutes on 24 Nov: always run `crane ls` and take the next free tag right before pushing. v90: choke-point animated Short (YouTube dLHhQLfZV38) embedded on /platform/attack-path, /learn/choke-point, /learn/cloud-attack-path — vertical 9:16 facade, own cover /videos/choke-point-short.jpg, VideoObject; built from clean main a179186 in a worktree because main had another session's uncommitted edits; Docker Desktop hung, so the image was assembled with `crane append -b node:22-alpine` + `crane mutate` (workdir /app, NODE_ENV, PORT=80, cmd node .output/server/index.mjs) and a clean DOCKER_CONFIG. v89 was deployed by another session without a note here. v88: v88: pricing page — Estate/FinOps/DRM removed, AI assessment, CWPP and MCP rows added, SaaS and code security sold separately; pushed with crane using a clean DOCKER_CONFIG (Docker Desktop's credential helper hung `docker login` and `crane auth login`). v87 crashed — built without NITRO_PRESET=node-server, rolled back. v86: /audit-scan page + "audit" lead kind, visitor thank-you email (LEAD_BOOKING_URL, LEAD_ACK=off), reply-by and route lines in lead emails; all "free audit scan" buttons link to /audit-scan. v85: v85: claims fix — Code Security 597 SAST rules (413 gone), old one-page overview sheets removed, approved scanning wording, Onam AIOps naming, Google Agent Platform (formerly Vertex AI); v82–v84 working-tree changes committed. v84: "Talk to our team" panel bottom-right on every page (demo, pricing, partner, technical, other, careers link); demo form reordered into About you / Your cloud / Anything else with job title, country and account count, "What brings you here?" removed. v83: website form emails also copied to anup.yadav@onamsecurity.com (LEAD_CC). v82: Aadrika homepage /aadrika.html and a Google data section in the Aadrika privacy policy, for Google's app verification. v81: SEO cycle — Wiz alternatives, best CSPM, CIEM vs IAM, cloud asset inventory, FedRAMP ConMon pages; free audit scan box at top of every blog post; llms.txt plan names fixed; pushed to ECR. v80: pricing calculator — volume discount on all units from 500 with a no-drop cap, estimate box shows list price, discount and total; scripts/test-pricing.ts. v79: pricing page with published unit prices ($20 Complete, $14 Posture per unit a month, $39 per developer), add-a-row calculator, Enterprise section; built with docker and pushed straight to ECR. v78: human-voice copy and look across the site: plain headings, claims checked against product code, IBM Plex Sans, Google Material Symbols icons, real console screenshots, no colour blobs or AI art; pushed with crane because Docker's registry proxy failed. v77 (2026-10-31): v77: Aadrika privacy/terms/data-deletion pages under /legal/aadrika, noindex. v76 (2026-10-30): founder bio. v75 (2026-10-29): team page. v74 crashed — built without NITRO_PRESET. v73: pricing = annual subscription per cloud account with a free one-time audit scan (Free/Pro/$22 and 14-day trial removed); Integration Catalog matches the code; image now in ECR 588989875114.dkr.ecr.ap-south-1.amazonaws.com/onam/cspm-docs-website. v72: Code Security video embed -> re-recorded sj_DK_xJqrA. v71: Code Security on Onam's own engine (Semgrep removed), AI Security on AWS, Azure and Google Cloud, engine-change docs note. v70 (2026-10-17): marketplace strip — Microsoft Marketplace listing live, Google Cloud Partner profile link, AWS coming soon. v69 (2026-10-13): docs pages /docs/security/capability-matrix and /docs/security/features-by-capability. v68 (2026-10-08): click-to-play Q&A video embeds (youtube-nocookie facade + VideoObject JSON-LD) on home, /platform, /why-onam, Estate/FinOps/DRM, AIOps and 9 security product pages. v67: SEO cycle 2 — DSPM, code security, attack path learn pages; attack path + API security product pages. v65–v66: SEO push — KSPM/CWPP/CIEM learn pages, Wiz alternatives + best CSPM refresh, new Wiz vs Orca POC post, FedRAMP ConMon + OCI/Alibaba/IBM/Azure pages. v64: AI-security page claims only what the product does. v63: website v2: Onam as a platform — new homepage, Products menu, Estate/FinOps/DRM flagship + 13 capability pages, /why-onam, marketplace strip, banners, docs/learn by product, logo "Onam", Onam AIOps naming; built FROM the local v62 image because Docker Desktop's registry proxy was failing — same node:22-alpine base). v62 — deployed 2026-10-05 (final accuracy sweep: government, blogs, learn, compare, tools, whitepapers, demo captions; stale brochure/case-study files retired; v61: CSPM, attack path, risk, compliance, CNAPP pages + docs reconciled with code; v60: homepage = end-to-end platform story with overview diagram; /disaster-recovery DRM page + docs; CDR claims trimmed; v59: /security → /trust 301; v58: owner-cleared code-security + CIEM figures; v57: reviewed ChatGPT header images on Code Security, CIEM, DSPM, AI Operations; v56: AI Code Fix page; code security, CIEM, DSPM and
> Onam Operations sections with docs and diagrams; Trust Center; comparison pages vs Snyk, Cyera and
> CIEM tools; six blog posts; meta descriptions ≤155; all Onam-own certification/SLA claims, onam.io
> addresses, "100% agentless" and unverified testimonials removed). Next is v81.
> Cluster:
> `deployment/cspm-docs-website` in `threat-engine-engines`, EKS
> `onam-eks-cluster` (ap-south-1). **Build with `NITRO_PRESET=node-server`**. The deployment has a 10 s preStop
> pause (added 2026-10-05) so rollouts serve no 502s — keep it if the deployment is recreated. The
> default preset emits a Cloudflare worker bundle, not the node server the image runs.

```bash
NITRO_PRESET=node-server npm run build        # also regenerates sitemap.xml + llms.txt
# Image lives in Onam's private ECR (Docker Hub is no longer used for the site; only engine-dspm stays there).
ECR=588989875114.dkr.ecr.ap-south-1.amazonaws.com/onam/cspm-docs-website
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 588989875114.dkr.ecr.ap-south-1.amazonaws.com
docker build --platform linux/amd64 -t $ECR:vN .
docker push $ECR:vN        # if Docker Desktop's login/push hangs, push with crane and a clean DOCKER_CONFIG
kubectl set image deployment/cspm-docs-website cspm-docs-website=$ECR:vN -n threat-engine-engines
kubectl rollout status deployment/cspm-docs-website -n threat-engine-engines
curl -s -o /dev/null -w '%{http_code}' https://www.onamsecurity.com/resources/blog/<slug>
```

Update the deployment memory's current-image line after a successful rollout.

## 6. Ping search engines

```bash
npx tsx scripts/indexnow.ts /resources/blog/<slug> /resources/blog /
```

(IndexNow → Bing/Yandex; Bing feeds ChatGPT search + Copilot. Google discovers via the
sitemap already registered in Search Console — for cornerstone posts, remind the user to
"Request indexing" on the URL in GSC for a same-day crawl.)

## 7. Social kit

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

## 8. Report

Final message: live URL, IndexNow result, kit file path, the approval you acted on (who,
and the `audit.jsonl` timestamp of the gate run it approved), the web-check verdicts, and
the one manual step list (GSC request-indexing, human-posted Reddit/HN if applicable).
