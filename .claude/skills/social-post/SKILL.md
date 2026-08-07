---
name: social-post
description: Generate a complete, upload-ready social media post package (per-platform copy + branded card images) into social-posts/. Use when the user asks for a social post, LinkedIn/X/Instagram content, or to promote something on social media. Args: topic (required), optionally prefixed with type (e.g. "stat: 9853 CSPM rules" or "announcement: AWS Marketplace listing").
---

# Generate a social post package

## 1. Brief

- Pick the content type: explicit prefix in args, else infer (new blog post → blog-promo;
  a number → stat-card; a launch → announcement; educational ask → thread).
- Read the matching structure in `/Users/apple/Desktop/onam-platform/studio/studio/content-types/<type>.md` and the rules in
  `social-posts/README.md`.
- Fill a brief from `/Users/apple/Desktop/onam-platform/studio/studio/briefs/TEMPLATE.md`. Facts ONLY from repo sources
  (`src/data/*`, docs, blog, homepage stats). Never invent numbers.

## 2. Copy

Write per-platform copy following the template's structure and the house voice
(enterprise but human, opinionated, ≤4 hashtags, no "excited to announce", no engagement
bait). Default platforms: LinkedIn + X; add Reddit only when the type says so, always
marked **HUMAN-POST-ONLY** with a "(disclosure: I work on Onam)" line.

## 3. Media (images / video / GIF)

**Read `/Users/apple/Desktop/onam-platform/studio/doctrine/STORYTELLING.md` FIRST** (5-beat arc, emotional core, VO pacing,
slide rules) **and `/Users/apple/Desktop/onam-platform/studio/doctrine/FILMMAKING.md` for videos** (7-phase production process,
format patterns, casting). Default video format: the **two-hander dialogue** — character A
(customer-side skeptic) asks, character B (expert guide) shows — voices auto-select
ElevenLabs neural when ~/.onam-secrets has a key (see make-media.sh header), else macOS; dialogue
syntax `A: … ~ B: …` in the storyboard VO field. Pick another pattern (narrator, demo
walkthrough, incident drama, Q&A) when suitability says so.

For narrative videos, prefer STORY mode — write `<folder>/storyboard.txt` from the
actual footage (extract frames, name what's visible), then:

```bash
/Users/apple/Desktop/onam-platform/studio/assets/make-media.sh story social-posts/<folder>/storyboard.txt social-posts/<folder>
# storyboard lines:  intro|L1~L2~SUB|narration   clip|path.mp4|narration|caption   outro||narration
# Scene length adapts to narration (never sped up); captions auto-burned.
```

For carousel slides / highlighted screenshots:

```bash
/Users/apple/Desktop/onam-platform/studio/assets/make-media.sh annotate public/screenshots/<s>.png <folder>/images/slide-N.png "x,y,w,h" "Caption" [--zoom]
```

After generating, run the **delivery check** from STORYTELLING.md §5 (frame audit,
muted test, 3-second test, emotion test, one-CTA test) — regenerate on any failure.

Legacy single-clip mode:

```bash
# images: X/LinkedIn 1200x675, square 1080x1080, story/Reels 1080x1920, YT thumb 1280x720
/Users/apple/Desktop/onam-platform/studio/assets/make-media.sh card "Line one" "Line two" "Supporting sentence" social-posts/<folder>

# video package: branded intro + demo clip (watermarked, dark pad, TIMED CAPTIONS)
# + CTA outro (has sales@ contact), VOICEOVER via macOS TTS, in 16:9 + 1:1 + 9:16,
# plus a captioned GIF teaser with brand bar
/Users/apple/Desktop/onam-platform/studio/assets/make-media.sh video /Users/apple/Desktop/onam-platform/studio/footage/<clip>.mp4 "Line one" "Line two" "Sub" social-posts/<folder> \
  --vo "35-40 word narration: problem, mechanism, brand, CTA — reads in ~13s" \
  --caps "0.5|3.2|Caption one;3.6|6.4|Caption two;6.8|9.4|Caption three"
```

Always write --vo and --caps for videos (muted-autoplay captions are mandatory; see the
playbook sections now in /Users/apple/Desktop/onam-platform/studio/doctrine/). Captions: ≤42 chars, times relative to the raw clip,
matched to what's actually on screen at that moment (extract frames to check). All links
in copy get UTM tags: `?utm_source=<platform>&utm_medium=organic&utm_campaign=<slug>`.

Rules: LINE1/LINE2 ≤ 18 chars (pass "" to skip LINE2; for stat cards LINE1 = the number);
avoid `/`, `|`, `&` in text (script strips/escapes, but prefer "and"). Source clips live in
`/Users/apple/Desktop/onam-platform/studio/footage/` (attack-path, onboarding, full demo — pick the one matching the topic).
**Always Read a rendered PNG and 1–2 extracted video frames**
(`ffmpeg -ss N -i out.mp4 -frames:v 1 f.png`) to verify no clipping/overflow — that is
the human half of the gate. The machine half is not optional:

```bash
/Users/apple/Desktop/onam-platform/studio/assets/qa.sh all <pkg> | tee <pkg>/qa.txt
```

It measures resolution, fps, loudness (−16 ±1 LUFS), true peak (≤ −1.5 dBFS), clipping,
black frames, freezes and dead air against `studio/QUALITY.md`. A FAIL blocks the post;
quote its numbers rather than restating them from memory. Cards get
`qa.sh image <file.png>`. Governance record per `studio/GOVERNANCE.md` §2 —
claims.md and licenses.md before anything is published, and note that a free-tier voice
render is evaluation-only, not licensed to publish.

Platform fit: X/LinkedIn → video-16x9 or card-1200x675; Instagram feed → 1x1;
Reels/Shorts/TikTok → 9x16; YouTube → 16x9 + thumb; Reddit/README → gif.

## 4. Package

Produce in `/Users/apple/Desktop/onam-platform/studio/productions/YYYY-MM-DD-<slug>/` (run make-media.sh from /Users/apple/Desktop/onam-platform/studio so footage/ paths resolve); after approval copy FINALS ONLY to `social-posts/<slug>/` in the website repo:
- `brief.md` — the filled brief
- `copy.md` — sections per platform, ready to paste
- `images/` — rendered cards + thumbnail
- `video/` — video-16x9.mp4, video-1x1.mp4, video-9x16.mp4 (when a clip fits the topic)
- `gif/` — teaser.gif

## 5. Report

Final message: folder path, which platforms, card preview note, and the manual steps
(what to paste where; GSC/scheduler notes if relevant). If a Postiz/Buffer setup exists
(check memory), mention loading it there.
