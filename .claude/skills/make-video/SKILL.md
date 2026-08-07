---
name: make-video
description: Run the Onam Video Studio (BMAD-style agent pipeline) to produce a Fortune-500-grade marketing ad or technical video from a topic. Use when the user asks for an advertising video, brand video, product video, technical/tutorial video, or "run the studio". Args: topic, optionally "technical:" prefix for the technical track.
---

# Onam Video Studio — orchestrator

Read `/Users/apple/Desktop/onam-platform/studio/studio/STUDIO.md`, then `RUNBOOK.md` (the 14
steps) and `AGENTIC.md` (how they execute). Run the agent passes from
`/Users/apple/Desktop/onam-platform/studio/studio/agents/` — each pass critiques the previous
artifact (one paragraph), produces its own, and declares what it could not verify. Do not
skip or merge passes.

Execution per AGENTIC.md §3: recon fans out one agent per clip; three concepts are
written in parallel by agents that cannot see each other's work; claims are checked one
agent per claim; verification (sync, muted, compliance, audit) runs in **fresh agents
that never see the deliberation that produced the cut** — a verifier sharing the writer's
context audits intent instead of the artifact. Rendering and measuring are code, never
agents. Track progress in `run.md` (`studio/templates/run-state.md`) so an interrupted
run resumes at the first step that is not done.

Package folder: `/Users/apple/Desktop/onam-platform/studio/productions/YYYY-MM-DD-<slug>/` (run from /Users/apple/Desktop/onam-platform/studio; footage at footage/*.mp4); approved finals → /Users/apple/Desktop/onam-platform/studio/releases/<slug>/ → ONE copy to website social-posts/<slug>/ for publishing. Artifacts: brief.md → concept.md →
script.md (with SME fact table) → storyboard.txt → cuts (via
`/Users/apple/Desktop/onam-platform/studio/assets/make-media.sh story`) → audit.md (gate) → copy.md.

Track: default marketing (3-act challenge → turn → happy ending, AD-STUDIO.md);
`technical:` prefix → TEACH structure (STUDIO.md). Doctrine: /Users/apple/Desktop/onam-platform/studio/doctrine/ (STORYTELLING, FILMMAKING, AD-STUDIO).

Gates (hard): G1 concept approved · G2 script table-read · G3 all claims sourced ·
**G3.5 compliance** (agent 10 — claims.md + licenses.md + capture redaction + disclosure
+ accessibility; a veto, not a rubric row) · G4 **machine gate** `assets/qa.sh all <pkg>`
exits 0 **and** audit ≥16/20, no zeros — below either: name the failing agent, fix at
source, re-run. audit.md, qa.txt, claims.md, licenses.md and signoff.md must exist in the
package before reporting done (studio/GOVERNANCE.md §2).

Verification is non-negotiable and is MEASURED, never recalled:
`assets/qa.sh all <pkg> | tee <pkg>/qa.txt`, then quote those numbers in audit.md — an
agent may not report a number it has not measured (studio/QUALITY.md §1). On top of the
machine gate, do the human passes: extract frames per scene (sync + brand check) and
muted-pass the captions.
Interactive moments: pause for user pick at G1 (offer the 3 concepts) when the user is
present; otherwise pick the strongest and note why in concept.md.
