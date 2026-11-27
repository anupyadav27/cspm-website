/**
 * Truth test for the product pages' "How it works" / "What you get" content (src/data/product-sections*.ts).
 *  1. Every page in platform-pages.ts has sections, and every sections key is a real page.
 *  2. Shape and word limits from product-sections.types.ts.
 *  3. No new numbers: every number in a page's sections appears in that page's own entry.
 *  4. No banned wording.
 *  5. Every real console screen named in product-screens.ts exists (1x and 2x).
 * Run: npx tsx scripts/test-product-sections.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { platformPages } from "../src/data/platform-pages";
import { PRODUCT_SECTIONS } from "../src/data/product-sections";
import { PRODUCT_SCREENS } from "../src/data/product-screens";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let failed = 0;
const fail = (m: string) => {
  failed++;
  console.error("FAIL", m);
};
const words = (s: string) => s.trim().split(/\s+/).filter((w) => w && w !== "·").length;
const numbers = (s: string) => (s.match(/\d[\d,.]*\d|\d/g) ?? []).map((n) => n.replace(/[.,]$/, ""));

const BANNED: RegExp[] = [
  /\bseamless(ly)?\b/i,
  /\brobust\b/i,
  /cutting-edge/i,
  /best-in-class/i,
  /\bunparalleled\b/i,
  /\ball clouds\b/i,
  /nothing (else )?is installed/i,
  /144 (supported|automated)/i,
  /!/,
];

for (const key of Object.keys(platformPages))
  if (!PRODUCT_SECTIONS[key]) fail(`${key}: no How it works / What you get content`);

for (const [key, s] of Object.entries(PRODUCT_SECTIONS)) {
  const page = platformPages[key];
  if (!page) {
    fail(`${key}: not a page in platform-pages.ts`);
    continue;
  }
  const source = JSON.stringify(page);
  const sourceNums = new Set(numbers(source).map((n) => n.replace(/,/g, "")));

  if (words(s.stepsHeading) > 8) fail(`${key}: stepsHeading over 8 words`);
  if (words(s.outcomesHeading) > 8) fail(`${key}: outcomesHeading over 8 words`);
  if (s.steps.length < 4 || s.steps.length > 5) fail(`${key}: ${s.steps.length} steps (want 4 or 5)`);
  if (s.outcomes.length < 4 || s.outcomes.length > 6) fail(`${key}: ${s.outcomes.length} outcomes (want 4 to 6)`);

  for (const st of s.steps) {
    if (!st.icon) fail(`${key}: step "${st.title}" has no icon`);
    if (words(st.title) > 5) fail(`${key}: step title over 5 words: ${st.title}`);
    if (words(st.body) > 28) fail(`${key}: step body over 28 words: ${st.title}`);
    if (st.proof && words(st.proof) > 6) fail(`${key}: proof over 6 words: ${st.proof}`);
  }
  for (const o of s.outcomes) {
    if (!o.icon) fail(`${key}: outcome "${o.title}" has no icon`);
    if (words(o.title) > 6) fail(`${key}: outcome title over 6 words: ${o.title}`);
    if (words(o.body) > 22) fail(`${key}: outcome body over 22 words: ${o.title}`);
    if ((o.chips?.length ?? 0) > 6) fail(`${key}: more than 6 chips on ${o.title}`);
  }

  const text = [
    s.stepsHeading,
    s.outcomesHeading,
    ...s.steps.flatMap((x) => [x.title, x.body, x.proof ?? ""]),
    ...s.outcomes.flatMap((x) => [x.title, x.body, ...(x.chips ?? [])]),
  ].join("\n");
  for (const n of numbers(text)) if (!sourceNums.has(n.replace(/,/g, ""))) fail(`${key}: number "${n}" is not in the page's entry`);
  for (const re of BANNED) {
    const m = text.match(re);
    if (m) fail(`${key}: banned wording "${m[0]}"`);
  }
}

for (const [key, sc] of Object.entries(PRODUCT_SCREENS)) {
  if (!platformPages[key]) fail(`screen for unknown page ${key}`);
  for (const f of [sc.src, sc.src.replace(/\.webp$/, "@2x.webp")])
    if (!fs.existsSync(path.resolve(__dirname, "../public", f.replace(/^\//, "")))) fail(`${key}: missing ${f}`);
  if (!/captured \d{1,2} \w{3} \d{4}/.test(sc.caption)) fail(`${key}: screen caption has no capture date`);
  if (sc.alt.length < 40) fail(`${key}: screen alt text too short`);
}

if (failed) {
  console.error(`test-product-sections: ${failed} failure(s)`);
  process.exit(1);
}
console.log(
  `test-product-sections: OK (${Object.keys(PRODUCT_SECTIONS).length} pages, ${Object.keys(PRODUCT_SCREENS).length} real screens)`,
);
