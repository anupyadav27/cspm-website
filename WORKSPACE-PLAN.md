# Onam Workspace Consolidation — Plan

Drafted 2026-08-06. **Stages 0–2 executed 2026-08-07** — see §0 below. The rest of this
document is the original proposal and remains the reference for what has not been done yet.

## 0. Executed 2026-08-07

| Step | Result |
|---|---|
| Backup | `s3://onam-platform-588989875114/backup/2026-08-07/` — **1,240 MB**, 795 + 159 objects. Matches 1,188 MB on disk (S3 counts every object; nothing missing). |
| Workspace | `~/Desktop/onam-platform/` created |
| Moves | `onam-studio` → `onam-platform/studio`; `cspm-marketing` → `onam-platform/marketing` (**out of Google Drive's sync scope**) |
| studio repo | `git init`, 91 files, **624 KB** — from a 1.2 GB directory. Renders excluded. |
| marketing repo | `git init`, 69 files, 5.1 MB. PDFs, docx, images and the 5 MB HTML flipbook excluded. |
| Skill paths | 25 hardcoded `onam-studio` references updated across 4 skills; targets verified to resolve |
| Stale facts | `publish-post` and `social-post` skills still quoted 1,918 CSPM rules / 13 frameworks / 16 engines — corrected to 9,853 / 78 / 29 |

**Drive caveat:** only `cspm-marketing` was Drive-synced, not all of Desktop (`cspm-website` has always been a working git repo there). Moving a Drive-mirrored folder can make Drive treat the original as deleted in the cloud — the S3 backup covers that, but the stale sync entry should be removed in Google Drive preferences.

**`.cache/` was nearly lost.** It is 659 MB named like a disposable build cache but actually holds generated voiceovers and music beds. It was excluded from the first backup pass and then explicitly re-synced. Do not treat it as regenerable without checking.

**Not yet done:** `git remote add` (Anup creates the GitHub repos), the `media/` split of renders out of `studio/`, `brands/onam/` extraction, `$ONAM_STUDIO_HOME`, and the `facts/product.yaml` alignment layer (§5).

## 1. What exists today

| Location | Size | Versioned? | What it really is |
|---|---|---|---|
| `~/Desktop/cspm-website` | 428 MB | **Yes** (git) | The TanStack site + deploy pipeline |
| `~/Desktop/onam-studio` | **1.0 GB** | No | Video/deck studio: ~1 MB of system, ~1 GB of renders |
| `~/Desktop/cspm-marketing` | 79 MB | No | Marketing content, **inside Google Drive** |

### Three risks, in order

1. **Two of the three are not under version control.** Months of doctrine, agent definitions, strategy and positioning with no history, no diff, no rollback. A bad overwrite is unrecoverable.
2. **`cspm-marketing` lives in a Google Drive synced folder.** Never put a `.git` directory inside Drive — Drive syncs `.git` internals mid-write and corrupts the object store. It must move out of Drive *before* it becomes a repo.
3. **The skills hardcode absolute paths.** `make-video`, `make-deck` and `studio-qa` all contain `/Users/apple/Desktop/onam-studio/...`. This is what will break the day you build site #2.

## 2. The split that actually matters

The instinct is to divide by *project* — website, studio, marketing. The division that matters is **system vs. output**:

| | System | Output |
|---|---|---|
| Examples | doctrine, agent definitions, QUALITY.md, brand tokens | renders, footage, exported decks, PDFs |
| Size | Under 1 MB | ~1 GB and growing |
| Changes | Deliberately, reviewed | Constantly, disposably |
| Reusable for the next brand? | **Yes** | No |
| Belongs in git? | **Yes** | **No** |

`onam-studio` is 99.9% output by volume and 100% valuable as system. `studio/` (404 KB), `doctrine/` (32 KB) and `brand/src` are the assets worth versioning. `productions/` (267 MB), `assets/` (142 MB), `footage/` (67 MB) and `releases/` (30 MB) are renders.

Putting renders in git makes the repo unusable within months — every clone drags the full history of every video you ever made.

## 3. Why not one repo

Your stated goal — *"the video studio can be my department for different websites I build tomorrow"* — is the argument against merging.

The moment the studio engine and Onam's marketing content share a repo, the engine stops being portable. Tomorrow's client project would clone Onam's battlecards, competitive positioning and customer case studies to get the storytelling doctrine. That is both awkward and a confidentiality problem.

The engine has to be **brand-agnostic**, with brands as swappable inputs.

## 4. Proposed structure

```
~/Desktop/onam-platform/                 ← workspace folder, NOT a repo
│
├── studio/                    git ·  brand-agnostic engine  (~1 MB)
│   ├── doctrine/              STORYTELLING · FILMMAKING · AD-STUDIO · PRESENTING
│   ├── specs/                 QUALITY · RUNBOOK · DECKS · FRAMEWORK · GOVERNANCE · …
│   ├── agents/                the BMAD pipeline agent definitions
│   └── brands/
│       ├── onam/              tokens, logo kit, voice, cast     ← today
│       └── _template/         what a new brand must supply      ← tomorrow
│
├── website/                   git ·  today's cspm-website, unchanged
│
├── marketing/                 git ·  Onam-specific SOURCE, markdown only  (~1 MB)
│   ├── facts/                 ★ the shared truth layer — see §5
│   ├── messaging/  strategy/  battlecards/  case-studies/  whitepapers/
│   └── social/                copy only, no rendered images
│
└── media/                     NOT git ·  Drive or S3
    ├── productions/  footage/  releases/  rendered-decks/  brochures/
```

**Rules that keep it working**

- Git tracks **sources**. Renders go to `media/`, which is Drive-synced or S3.
- `studio/` never mentions Onam outside `brands/onam/`. That is the portability test — if you cannot swap `brands/onam` for `brands/acme` and get an Acme video, the boundary has leaked.
- `.docx` files are **outputs**, not sources. `cspm-marketing/agents/` currently holds both `onam-agent-*.md` and `Onam-Agent-*.docx` of the same content. Markdown is the source; the docx belongs in `media/`.
- Skills reference `$ONAM_STUDIO_HOME`, never an absolute path.

## 5. The alignment mechanism — `marketing/facts/`

This is the part that delivers what you actually asked for: website, video and marketing saying the same thing.

The recurring failure has not been tone or design. It has been **numbers**. In the last two days alone: "1,918 posture rules" (unsourced, wrong, and baked into four SVG diagrams), "13 frameworks" vs "70+ frameworks" vs the real 78, and "16 engines" vs 29. Each was correct somewhere once, then drifted independently across the website, the decks and the social kits.

One machine-readable source fixes it structurally:

```yaml
# marketing/facts/product.yaml — single source of truth, cite the derivation
rules:
  cspm_posture:   { value: 9853,  source: "catalog/rule/{csp}_rule_check unique rule_ids" }
  catalog_total:  { value: 11346, source: "catalog/rule/{csp}_rule_metadata" }
frameworks:       { value: 78,    source: "distinct framework in catalog/complaince_csv" }
engines:          { value: 29,    source: "non-empty dirs in engines/" }
clouds:           { value: 7 }
services:         { value: 549 }
```

Then: the website imports it, deck and video scripts read it, and a lint step fails the build when a hardcoded number contradicts it. Change a number once, everywhere follows — instead of the four-surface hunt we just did.

Seed it from `~/.claude/.../memory/product-fact-sheet.md`, which already has every verified figure and its derivation command.

## 6. Execution — staged, reversible

Nothing here is urgent enough to risk. Do it in this order; stop anywhere.

**Stage 0 — Safety net (do this today, 10 minutes)**
1. Copy `onam-studio` and `cspm-marketing` to an external/backup location. Un-versioned 1 GB with no history is the current standing risk.

**Stage 1 — Version the two unversioned repos**
2. Create `~/Desktop/onam-platform/`.
3. **Move `cspm-marketing` out of Google Drive first**, then `git init`. Do not init inside Drive.
4. `git init` the studio engine with a `.gitignore` that excludes `productions/ footage/ releases/ assets/`.
5. First commit each. Push to a private remote.

**Stage 2 — Separate system from output**
6. Move renders into `media/`. Point Drive sync at `media/` only.
7. Split `studio/brands/onam/` out of the engine; confirm nothing else references Onam.

**Stage 3 — Make it portable**
8. Replace hardcoded paths in `make-video`, `make-deck`, `studio-qa` with `$ONAM_STUDIO_HOME`.
9. Create `studio/brands/_template/` documenting what a new brand supplies.

**Stage 4 — Alignment**
10. Create `marketing/facts/product.yaml` from the verified fact sheet.
11. Make the website import it instead of hardcoding numbers.
12. Add the lint step that fails the build on contradiction.

**Stage 5 — Optional**
13. Move `website/social-kits/` and `social-posts/` into `marketing/social/`, leaving the website to only serve the site.

## 6a. Decisions taken 2026-08-06

| Question | Decision |
|---|---|
| Git remote | **Local repos only.** Anup creates the GitHub repos and runs `git remote add` himself. First commits land locally regardless, so history starts immediately. |
| `media/` location | **Drive stays, S3 becomes the durable copy.** Everything is retrievable from S3. |
| Marketing agents vs studio agents | **Separate systems.** `cspm-marketing/agents/` (8 strategy roles) stays in `marketing/`; `onam-studio/studio/agents/` (video pipeline) stays in `studio/`. No merge. |
| Naming (my call) | Workspace `~/Desktop/onam-platform/`. Repos: `studio/`, `website/`, `marketing/`. `studio` drops the `onam-` prefix because it is brand-agnostic — that name is the reminder. |
| S3 store | **Dedicated bucket `onam-platform-588989875114`**, ap-south-1. Created 2026-08-06. The shared `anup-backup` bucket was rejected — a dedicated bucket keeps lifecycle, versioning and access policy independent of unrelated personal archives. |

### S3 bucket configuration (verified at creation)

| Setting | Value | Why |
|---|---|---|
| Region | `ap-south-1` | Same region as the EKS cluster — no cross-region transfer cost |
| Versioning | **Enabled** | An accidental `rm` or `sync --delete` is recoverable. This is the whole point of a backup target, and it was not possible on the shared bucket without affecting unrelated data. |
| Public access | **Fully blocked** (all four flags) | Marketing sources and unreleased media |
| Default encryption | SSE-S3 (AES256), bucket keys on | Encrypted at rest by default; bucket keys cut KMS request cost |

Layout: `backup/<YYYY-MM-DD>/` for write-once point-in-time snapshots, `media/` for the live render store. A README at the bucket root documents the rules.

**Follow-up worth doing:** versioning has no lifecycle rule yet, so noncurrent versions accumulate and cost storage forever. Add an expiry (e.g. delete noncurrent versions after 90 days) once the media store has real volume.

The three placeholder objects briefly created under `s3://anup-backup/onam-platform/` were removed; that bucket is untouched otherwise.

**Blocked on:** Anup is actively working in `onam-studio` and `cspm-marketing`. No file moves until he confirms his session is closed. A 1 GB upload mid-edit produces an inconsistent snapshot, so even the backup waits.

## 7. Open questions for you

1. **Private git remote** — GitHub org, or local-only for now? The studio engine holds your methodology; treat it as IP.
2. **Where should `media/` live** — keep Drive, or move to S3? Drive is fine for a solo operator; S3 wins once someone else needs programmatic access.
3. **Is `cspm-marketing/agents/` the same pipeline as `onam-studio/studio/agents/`, or a different one?** If they overlap, they should merge into the engine. If the marketing agents are Onam-specific strategy roles, they stay in `marketing/`. This needs a read of both before deciding.
4. **Repo naming** — `studio` reads generic once it is brand-agnostic. `onam-studio` would be a misnomer for a tool serving other brands.
