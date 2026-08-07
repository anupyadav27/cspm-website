/**
 * Generates src/lib/product-facts.ts from marketing/facts/product.yaml.
 *
 * Runs at build time, before vite (see the "build" script). The generated file
 * IS committed, so `npm run dev` and a type-check work without having run the
 * generator, and so a diff shows when a cleared number changed.
 *
 * Only `status: cleared` facts are emitted. A disputed or scheduled number has
 * no business being importable — if it cannot be quoted, it should not be one
 * autocomplete away from a component.
 *
 * Shells out to python3 for the YAML rather than adding a Node YAML dependency:
 * the fact gate already requires python3, so this adds no new requirement, and
 * one parser means the generator and the checker cannot disagree about what the
 * file says.
 */
import { spawnSync } from "node:child_process";
import { existsSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "..");
const yamlPath = resolve(repo, "..", "marketing", "facts", "product.yaml");
const outPath = resolve(repo, "src", "lib", "product-facts.ts");

if (!existsSync(yamlPath)) {
  if (process.env.FACTS_CHECK === "skip") {
    console.warn(`generate-facts: SKIPPED — ${yamlPath} not found, keeping the committed file.`);
    process.exit(0);
  }
  console.error(
    `generate-facts: cannot find ${yamlPath}\n` +
      `  Clone the marketing repo beside this one, or FACTS_CHECK=skip to keep the\n` +
      `  committed src/lib/product-facts.ts as-is.`
  );
  process.exit(2);
}

// default=str because product.yaml's meta.last_verified parses as a date object,
// which json.dump refuses.
const r = spawnSync(
  "python3",
  ["-c", "import sys,yaml,json;json.dump(yaml.safe_load(open(sys.argv[1])),sys.stdout,default=str)", yamlPath],
  { encoding: "utf8" }
);
if (r.status !== 0) {
  console.error(`generate-facts: could not parse ${yamlPath}\n${r.stderr}`);
  process.exit(2);
}
const facts = JSON.parse(r.stdout);

/** Pull a cleared scalar, refusing anything not cleared. */
function cleared(node, path) {
  if (!node || node.value === undefined) throw new Error(`${path}: no value in product.yaml`);
  if (node.status !== "cleared") throw new Error(`${path}: status is "${node.status}", not cleared`);
  return { value: node.value, scope: node.scope ?? "" };
}

const out = [
  cleared(facts.engines, "engines").value !== undefined && ["ENGINES", cleared(facts.engines, "engines")],
  ["SERVICES", cleared(facts.services, "services")],
  ["CLOUDS", cleared(facts.clouds, "clouds")],
  ["FRAMEWORKS", cleared(facts.frameworks, "frameworks")],
  ["SAAS_PLATFORMS", cleared(facts.saas_platforms, "saas_platforms")],
  ["CSPM_POSTURE_RULES", cleared(facts.rules.cspm_posture, "rules.cspm_posture")],
  ["RULE_CATALOG_TOTAL", cleared(facts.rules.catalog_total, "rules.catalog_total")],
].filter(Boolean);

const verified = facts.meta?.last_verified ?? "unknown";

const body = `/**
 * GENERATED — do not edit.
 *
 * Source of truth: marketing/facts/product.yaml (last verified ${verified}).
 * Regenerate: npm run facts:generate   (also runs as part of npm run build)
 *
 * Only facts marked \`status: cleared\` appear here. Disputed numbers are
 * deliberately absent rather than exported with a warning comment nobody reads.
 *
 * These constants cover the places a number is a VALUE. Numbers inside prose and
 * inside SVG diagrams are not importable — an SVG cannot import a constant, and
 * rewriting marketing copy into template literals costs more than it protects.
 * Those surfaces are covered by the fact gate instead, which greps what a human
 * would read. Between the two, every surface is checked.
 */

${out
  .map(
    ([name, f]) =>
      `/** ${f.scope} */\nexport const ${name} = ${f.value};`
  )
  .join("\n\n")}

/** Thousands-separated, for display. */
export const fmt = (n: number): string => n.toLocaleString("en-US");
`;

const prev = existsSync(outPath) ? readFileSync(outPath, "utf8") : "";
if (prev !== body) {
  writeFileSync(outPath, body);
  console.log(`generate-facts: wrote ${out.length} cleared facts -> src/lib/product-facts.ts`);
} else {
  console.log(`generate-facts: ${out.length} cleared facts, unchanged`);
}
