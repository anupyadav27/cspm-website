/**
 * Fact gate — refuse to build a site whose numbers contradict the cleared ones.
 *
 * The cleared values live in marketing/facts/product.yaml and the checker that
 * reads them lives beside it, because the numbers are marketing's to clear, not
 * the website's to invent. This wrapper is what makes that checker load-bearing
 * rather than a thing someone remembers to run.
 *
 * Why this exists at all: "1,918 posture rules" shipped on this site for months,
 * survived four rounds of review, and was wrong. Ten of the surfaces carrying a
 * product number are SVG diagrams, which cannot import a constant — so the check
 * has to read what a human would read, and it has to run every build.
 *
 * Exit codes come straight from check-facts.py:
 *   0  clean (advisories may be printed — an understatement is not a blocker)
 *   1  a surface contradicts a cleared value, or states a retired one
 *   2  the checker itself is broken
 *
 * If the marketing repo is not checked out beside this one the gate FAILS rather
 * than passing quietly. A build that skipped its own gate looks exactly like a
 * build that passed it, which is the failure this whole mechanism exists to stop.
 * Deliberate escape hatch, for a machine that genuinely has only this repo:
 *
 *   FACTS_CHECK=skip npm run build
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "..");
const checker = resolve(repo, "..", "marketing", "facts", "check-facts.py");

if (process.env.FACTS_CHECK === "skip") {
  console.warn("facts-gate: SKIPPED via FACTS_CHECK=skip — numbers are unverified in this build.");
  process.exit(0);
}

if (!existsSync(checker)) {
  console.error(
    `facts-gate: cannot find the checker at ${checker}\n` +
      `\n` +
      `  The cleared product numbers live in the marketing repo, which is expected\n` +
      `  to sit beside this one:\n` +
      `\n` +
      `      onam-platform/\n` +
      `        marketing/facts/product.yaml\n` +
      `        website/            <- you are here\n` +
      `\n` +
      `  Clone it (github.com/anupyadav27/onam-marketing), or build without the\n` +
      `  gate on purpose:  FACTS_CHECK=skip npm run build\n`
  );
  process.exit(2);
}

const r = spawnSync("python3", [checker, "src", "public"], {
  cwd: repo,
  stdio: "inherit",
});

if (r.error) {
  console.error(`facts-gate: could not run python3 — ${r.error.message}`);
  process.exit(2);
}
process.exit(r.status ?? 2);
