/**
 * Social-preview gate — refuse to build a page that will share badly.
 *
 * WHY THIS EXISTS. On 2026-08-11 the four /compare/ pages were shared on LinkedIn and
 * rendered as bare text tiles, because they carried og:title, og:description, og:url and
 * robots — but no og:image. Nothing caught it. The pages were built, reviewed, deployed,
 * verified live, and the defect only surfaced when a human pasted a link into LinkedIn and
 * looked at the preview.
 *
 * A missing og:image is invisible to every check we had: the page returns 200, the HTML is
 * valid, the facts gate passes, and the content is correct. It is only wrong at the moment
 * someone shares it — which is the moment the page exists for.
 *
 * So this checks the standalone HTML under public/ that the app router never renders and
 * therefore never gets SEO defaults from. Route-driven pages get their tags from
 * src/lib/seo.ts and are not the risk.
 *
 * Exit 0 = fine. Exit 1 = a page would share badly.
 */
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const PUBLIC = new URL("../public", import.meta.url).pathname;

/** Standalone HTML that is meant to be shared. Rendered artifacts are exempt. */
const EXEMPT = [
  /Flipbook\.html$/i, // 5.9MB base64 export, not a shareable landing page
];

const REQUIRED = [
  { name: "og:title", re: /property=["']og:title["'][^>]*content=["']([^"']+)/i },
  { name: "og:description", re: /property=["']og:description["'][^>]*content=["']([^"']+)/i },
  { name: "og:image", re: /property=["']og:image["'][^>]*content=["']([^"']+)/i },
  { name: "og:url", re: /property=["']og:url["'][^>]*content=["']([^"']+)/i },
  { name: "<title>", re: /<title>([^<]+)<\/title>/i },
];

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

const problems = [];
for (const file of walk(PUBLIC)) {
  const rel = relative(PUBLIC, file);
  if (EXEMPT.some((r) => r.test(rel))) continue;
  const html = readFileSync(file, "utf8");

  const missing = REQUIRED.filter((r) => !r.re.test(html)).map((r) => r.name);
  if (missing.length) {
    problems.push(`${rel}: missing ${missing.join(", ")}`);
    continue;
  }

  // An og:image that 404s is worse than none — the tile silently falls back to text.
  const img = html.match(REQUIRED[2].re)[1];
  const path = img.replace(/^https?:\/\/[^/]+/, "");
  if (path.startsWith("/") && !existsSync(join(PUBLIC, path))) {
    problems.push(`${rel}: og:image does not exist in public/ → ${path}`);
  } else if (path.startsWith("/")) {
    const { size } = statSync(join(PUBLIC, path));
    if (size > 5 * 1024 * 1024) problems.push(`${rel}: og:image is ${Math.round(size / 1024 / 1024)}MB — LinkedIn ignores >5MB`);
  }
}

if (problems.length) {
  console.error("\nsocial-preview-gate: these pages would share badly\n");
  for (const p of problems) console.error("  " + p);
  console.error(
    "\nEvery standalone page in public/ needs og:title, og:description, og:image and og:url.\n" +
      "A page that returns 200 with correct content can still be broken at the only moment\n" +
      "that matters — when someone pastes the link somewhere.\n",
  );
  process.exit(1);
}
console.log("social-preview-gate: clean");
