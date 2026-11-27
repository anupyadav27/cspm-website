/**
 * Truth test for the AI Security docs (design AC-10).
 *  1. Every check in src/data/explainers/ai-estate.ts names a fact that exists in
 *     marketing/facts/product.yaml or limits.yaml (when the marketing repo is checked out beside website/).
 *  2. The AI Security pages and the estate contain none of the "must never appear" claims.
 *  3. "Illustrative" labels the demo estate.
 * Run: npx tsx scripts/test-ai-estate.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AI_ESTATE, INVENTORY_FACT, type EstateCheck } from "../src/data/explainers/ai-estate";
import { articles } from "../src/data/docs-articles/ai-security";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let failed = 0;
const fail = (m: string) => {
  failed++;
  console.error("FAIL", m);
};

// 1. Facts resolve.
const factsDir = path.resolve(__dirname, "../../marketing/facts");
const yamlText = fs.existsSync(factsDir)
  ? fs.readFileSync(path.join(factsDir, "product.yaml"), "utf8") + fs.readFileSync(path.join(factsDir, "limits.yaml"), "utf8")
  : null;
const checks: EstateCheck[] = AI_ESTATE.flatMap((n) => [n.exposed, n.runsAs?.check].filter(Boolean) as EstateCheck[]);
const factRefs = [...checks.map((c) => c.fact), ...Object.values(INVENTORY_FACT)];
for (const ref of factRefs) {
  if (!ref) fail("a check has no fact");
  const key = ref.replace(/\[\d+\]$/, "").split(/[ .]/).pop()!;
  if (yamlText && !new RegExp(`(^|\\s)(${key}:|key: ${key}\\b)`, "m").test(yamlText)) fail(`fact not found in facts/: ${ref}`);
}
if (!yamlText) console.warn("SKIP fact lookup: ../marketing/facts not found");

// 2. Never-appear claims.
const NEVER: RegExp[] = [
  /\ball clouds\b/i,
  /shadow AI (detection|is flagged|from audit)/i,
  /AI (findings |services )?(are |appear )?on attack paths(?! (is|are) not| yet| isn't)/i,
  /\bred-teams? (your|the) models\b(?! or)/i,
  /compliant with the EU AI Act/i,
  /\b\d{2,}\s+AI (rules|checks|detectors)\b/i,
  /(OCI|Oracle Cloud|Alibaba Cloud|IBM Cloud)[^.]{0,40}\bare covered\b/i,
  /does not read prompts/i, // superseded: prompt-text detection exists (off by default)
  /nothing (else )?is installed/i, // retired 27 Sep: say "deploys no agent or scanner"
];
const corpus = [
  ...articles.map((a) => [`docs:${a.slug}`, a.body] as const),
  ["estate", JSON.stringify(AI_ESTATE)] as const,
];
for (const [where, text] of corpus)
  for (const re of NEVER) {
    for (const m of text.matchAll(new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g"))) {
      // The sentence (or ledger/list line) around the match; a denial or a question is allowed.
      const start = Math.max(text.lastIndexOf("\n", m.index), text.lastIndexOf(". ", m.index)) + 1;
      const endNl = text.indexOf("\n", m.index);
      const sentence = text.slice(start, endNl < 0 ? undefined : endNl);
      const negated = /\b(not|no|never|nor|doesn't|isn't|aren't)\b|\?|^\s*- /.test(sentence);
      if (!negated) fail(`${where}: forbidden claim "${m[0]}" in: ${sentence.trim().slice(0, 120)}`);
    }
  }

// 3. Illustrative label and real-screen captions.
const overview = articles.find((a) => a.slug === "ai-security/overview")!;
if (!overview.body.includes(":::hero") || !overview.body.includes("lensmap")) fail("overview lost its hero estate map");
for (const a of articles)
  for (const m of a.body.matchAll(/:::screen (\S+)\n([\s\S]*?)\n:::/g)) {
    if (!/caption: .*captured \d{1,2} \w{3} \d{4}/.test(m[2]) && !/\$\{CAPTURED\}/.test(m[2])) fail(`${a.slug}: screen ${m[1]} has no capture-date caption`);
    const file = path.resolve(__dirname, "../public", m[1].replace(/^\//, ""));
    if (!fs.existsSync(file)) fail(`${a.slug}: missing screen file ${m[1]}`);
  }

if (failed) {
  console.error(`test-ai-estate: ${failed} failure(s)`);
  process.exit(1);
}
console.log(`test-ai-estate: OK (${checks.length} checks traced, ${articles.length} pages scanned)`);
