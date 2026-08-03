---
name: make-deck
description: Run the Onam Deck Studio (BMAD-style agent pipeline) to produce a consultant-grade slide deck — pitch, technical briefing, exec update, or conference talk — from a topic. Use when the user asks for a deck, slides, a presentation, a pitch deck, or "build me slides". Args: topic, optionally an archetype prefix ("technical:", "exec:", "talk:").
---

# Onam Deck Studio — orchestrator

Read `/Users/apple/Desktop/onam-studio/studio/DECKS.md` and
`/Users/apple/Desktop/onam-studio/doctrine/PRESENTING.md` first. Then run the agent
passes IN ORDER from `/Users/apple/Desktop/onam-studio/studio/agents/` — CD → Strategist
→ Copywriter → 09 Presentation Consultant → SME → Design Architect → QA. Each pass
critiques the previous artifact (one paragraph) before producing its own. Editor and
Sound are skipped unless the deck becomes a narrated video.

Package: `/Users/apple/Desktop/onam-studio/decks/YYYY-MM-DD-<slug>/` (run all commands
from `/Users/apple/Desktop/onam-studio`). Artifacts: brief.md → concept.md (spine + the
one argument) → outline.md (every slide title, in order) → **deck.md** (the source) →
`assets/make-deck.sh decks/<pkg>/deck.md` → audit.md → release.

Archetype: default pitch; `technical:` → technical-briefing, `exec:` → exec-update,
`talk:` → conference-talk. Each has a shape in `studio/content-types/deck-*.md`.
Syntax reference: `studio/templates/deck-source.md`. Templates: `deck-brief.md`,
`deck-audit.md`.

Gates (hard): G1 concept — spine named, argument in one sentence · G2 **headline read**
— titles alone tell the whole argument, zero topic-titles · G3 every number sourced with
a `source:` line · **G3.5 compliance** (agent 10 — claims.md, licenses.md, screenshot
redaction, alt text, contrast; a veto) · G4 **machine gate** `assets/qa.sh deck <pkg>`
exits 0 **and** audit ≥16/20, no zeros. Below either: name the failing agent, fix at
source, re-run. audit.md, qa.txt, claims.md, licenses.md, signoff.md must exist before
reporting done (studio/GOVERNANCE.md §2).

Verification is MEASURED, not recalled: `assets/qa.sh deck <pkg> | tee <pkg>/qa.txt`
catches truncated headlines, dropped bullets, type shrunk to minimum, word-budget
overruns, unsourced numbers, missing notes, and PDF/PNG/slide count mismatches. Then do
what the machine can't: LOOK at every slide in `png/` (composition, brand, screenshot
legibility) and run the PRESENTING §6 delivery check. Iterate with `--png-only` (fast),
then the full build. Interactive moments: pause for the user's pick at G1 (offer 3 concepts) when
they are present; otherwise pick the strongest and say why in concept.md.

Approved decks: copy deck.pdf + deck.pptx + deck.html + notes.md + audit.md into
`/Users/apple/Desktop/onam-studio/releases/<slug>/`. Only then, if it is being published,
one clean copy goes to the website repo.
