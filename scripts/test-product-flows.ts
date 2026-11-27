/**
 * Truth test for the "The whole picture" dataflow diagrams (src/data/product-flows*.ts).
 *  1. Every page in platform-pages.ts has a diagram; every diagram key is a real page.
 *  2. Shape and word limits from product-flows.types.ts (data-driven diagrams).
 *  3. No new numbers: every number in a diagram's text appears in that page's own entry
 *     (example code lines in a "diff" picture and bar widths are exempt; both are labelled Example).
 *  4. No banned wording; every icon name is a real icon.
 * Run: npx tsx scripts/test-product-flows.ts
 */
import * as Icons from "../src/components/site/icons";
import { platformPages } from "../src/data/platform-pages";
import { PRODUCT_FLOWS, PRODUCT_FLOW_DATA } from "../src/data/product-flows";

let failed = 0;
const fail = (m: string) => {
  failed++;
  console.error("FAIL", m);
};
const words = (s = "") =>
  s
    .trim()
    .split(/\s+/)
    .filter((w) => w && w !== "·" && w !== "→" && w !== "×").length;
const numbers = (s: string) =>
  (s.match(/\d[\d,.]*\d|\d/g) ?? []).map((n) => n.replace(/[.,]$/, "").replace(/,/g, ""));
const BANNED: RegExp[] = [
  /\bseamless(ly)?\b/i,
  /\brobust\b/i,
  /cutting-edge/i,
  /best-in-class/i,
  /\bunparalleled\b/i,
  /\ball clouds\b/i,
  /nothing (else )?(is|to) install/i,
  /144 (supported|automated)/i,
  /\bguarantee/i,
  /\breal-time\b/i,
  /!/,
];
const isIcon = (n: string) =>
  typeof (Icons as Record<string, unknown>)[n] === "object" ||
  typeof (Icons as Record<string, unknown>)[n] === "function";
const HEX = /^#[0-9A-Fa-f]{6}$/;

for (const key of Object.keys(platformPages))
  if (!PRODUCT_FLOWS[key]) fail(`${key}: no dataflow diagram`);
for (const key of Object.keys(PRODUCT_FLOWS))
  if (!platformPages[key]) fail(`${key}: not a page in platform-pages.ts`);

for (const [key, d] of Object.entries(PRODUCT_FLOW_DATA)) {
  const page = platformPages[key];
  if (!page) continue;
  const lim = (what: string, s: string | undefined, max: number) => {
    if (s !== undefined && words(s) > max) fail(`${key}: ${what} over ${max} words: "${s}"`);
  };
  lim("heading", d.heading, 10);
  lim("intro", d.intro, 30);
  d.stages.forEach((s, i) => lim(`stage ${i + 1}`, s, 5));
  if (d.inputs.length < 4 || d.inputs.length > 8)
    fail(`${key}: ${d.inputs.length} inputs (want 4 to 8)`);
  for (const i of d.inputs) {
    lim("input label", i.label, 4);
    lim("input hint", i.hint, 5);
    if (i.icon && !isIcon(i.icon)) fail(`${key}: unknown icon ${i.icon}`);
  }
  if (!d.engine.name.startsWith("Onam ")) fail(`${key}: engine name should start "Onam "`);
  lim("engine sub", d.engine.sub, 8);
  lim("engine footer", d.engine.footer, 8);
  if (d.engine.steps.length !== 4) fail(`${key}: ${d.engine.steps.length} engine steps (want 4)`);
  d.engine.steps.forEach((s) => lim("engine step", s, 5));
  lim("visual note", d.visualNote.text, 7);
  if (!HEX.test(d.visualNote.color)) fail(`${key}: visual note colour ${d.visualNote.color}`);
  if (d.outputs.length !== 6) fail(`${key}: ${d.outputs.length} outputs (want 6)`);
  if (new Set(d.outputs.map((o) => o.id)).size !== d.outputs.length)
    fail(`${key}: duplicate output ids`);
  for (const o of d.outputs) {
    lim("output label", o.label, 4);
    lim("output hint", o.hint, 5);
    if (!isIcon(o.icon)) fail(`${key}: unknown icon ${o.icon}`);
    if (!HEX.test(o.color)) fail(`${key}: output colour ${o.color}`);
  }
  lim("footnote", d.footnote, 25);

  const v = d.visual;
  const vText: string[] = [];
  if (v.kind === "chain") {
    if (v.nodes.length < 3 || v.nodes.length > 5) fail(`${key}: chain has ${v.nodes.length} nodes`);
    if (v.edges.length !== v.nodes.length - 1)
      fail(`${key}: chain needs ${v.nodes.length - 1} edge labels`);
    v.nodes.forEach((n) => (lim("chain node", n.label, 2), vText.push(n.label)));
    v.edges.forEach((e) => (lim("chain edge", e, 2), vText.push(e)));
    if (v.tag) vText.push(v.tag.label);
  } else if (v.kind === "finding") {
    lim("finding title", v.title, 7);
    if (v.context.length < 2 || v.context.length > 3)
      fail(`${key}: finding needs 2–3 context chips`);
    [...v.context, ...v.outcomes].forEach((c) => lim("finding chip", c, 4));
    vText.push(v.title, ...v.context, ...v.outcomes);
  } else if (v.kind === "hub") {
    if (v.around.length !== 4) fail(`${key}: hub needs exactly 4 signals`);
    lim("hub centre", v.center.label, 2);
    v.around.forEach(
      (a) => (
        lim("hub signal", a.label, 3),
        isIcon(a.icon) || fail(`${key}: unknown icon ${a.icon}`),
        vText.push(a.label)
      ),
    );
    if (!isIcon(v.center.icon)) fail(`${key}: unknown icon ${v.center.icon}`);
    if ((v.chips ?? []).length > 1) fail(`${key}: hub takes at most one chip`);
    (v.chips ?? []).forEach((c) => (lim("hub chip", c, 2), vText.push(c)));
    vText.push(v.center.label);
  } else if (v.kind === "bars") {
    lim("bars title", v.title, 6);
    if (v.rows.length < 3 || v.rows.length > 5) fail(`${key}: bars need 3–5 rows`);
    v.rows.forEach((r) => (lim("bar label", r.label, 4), vText.push(r.label)));
    vText.push(v.title);
  } else if (v.kind === "diff") {
    if (v.lines.length < 3 || v.lines.length > 7) fail(`${key}: diff needs 3–7 lines`);
    lim("diff badge", v.badge, 6);
    vText.push(v.badge);
  } else if (v.kind === "chat") {
    lim("chat question", v.question, 14);
    lim("chat answer", v.answer, 40);
    vText.push(v.question, v.answer);
  }

  const text = [
    d.heading,
    d.intro,
    ...d.stages,
    ...d.inputs.flatMap((i) => [i.label, i.hint ?? ""]),
    d.engine.name,
    d.engine.sub,
    ...d.engine.steps,
    d.engine.footer ?? "",
    d.visualNote.text,
    ...d.outputs.flatMap((o) => [o.label, o.hint]),
    d.footnote,
    d.caption,
    ...vText,
  ].join("\n");
  const sourceNums = new Set(numbers(JSON.stringify(page)));
  for (const n of numbers(text))
    if (!sourceNums.has(n)) fail(`${key}: number "${n}" is not in the page's entry`);
  for (const re of BANNED) {
    const m = text.match(re);
    if (m) fail(`${key}: banned wording "${m[0]}"`);
  }
}

if (failed) {
  console.error(`test-product-flows: ${failed} failure(s)`);
  process.exit(1);
}
console.log(
  `test-product-flows: OK (${Object.keys(PRODUCT_FLOWS).length} diagrams, ${Object.keys(PRODUCT_FLOW_DATA).length} from data)`,
);
