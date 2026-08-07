---
name: studio-qa
description: Run the Onam Studio quality gateway on a package or file — measures video, audio, decks, images and process/governance compliance against studio/QUALITY.md, then reports PASS or BLOCKED with the failing parameter. Use when asked to QA, audit, verify, or check whether something is ready to ship, and before any release.
---

# Onam quality gateway — runner

> **`$ONAM_STUDIO_HOME`** is the studio repo — a sibling of this website repo, so
> `../studio` from the repo root, which is `~/Desktop/onam-platform/studio` today.
> Export `ONAM_STUDIO_HOME` to point somewhere else. Resolve it before using any
> path below; never write the absolute path back into this file.

Read `$ONAM_STUDIO_HOME/studio/QUALITY.md` (the specs) and
`GOVERNANCE.md` (the record) first. Run from `$ONAM_STUDIO_HOME`.

```bash
assets/qa.sh all <package-dir>              # start here — package + every video + deck
assets/qa.sh video <file.mp4> [--track marketing|technical|social]
assets/qa.sh audio <file.wav>
assets/qa.sh deck <deckdir>
assets/qa.sh image <file.png> [WxH]
assets/qa.sh package <dir>                  # process + governance artefacts
```

Save the output into the package as `qa.txt` — it is the machine gate's receipt and the
audit must quote it (`assets/qa.sh all <pkg> | tee <pkg>/qa.txt`).

**Reporting rules — these are the point of the tool:**
- Never restate a measured number from memory. Quote `qa.sh`.
- A FAIL is BLOCKED. Name the failing parameter and the owning agent, propose the fix at
  source (re-record, re-cut, rewrite) — never propose loosening the spec.
- A WARN is not a pass-through: each one is either fixed or explained in `audit.md`.
- A machine PASS is only half the gate. The human rubric (QUALITY §4 — the rows a machine
  cannot judge: recognition, happy ending, sync, muted comprehension, brand, hook, action
  titles, so-what, screenshot legibility, voice believability) still has to score ≥16/20
  with no zeros in `audit.md`.
- Check the governance record too: `claims.md`, `licenses.md`, `signoff.md`
  (GOVERNANCE §2). Missing files are warnings from the tool but blocks from agent 10.

If the user asks "is this ready to ship?", the answer is the QUALITY §5 Definition of
Done — all four conditions, each verified, not three of four.
