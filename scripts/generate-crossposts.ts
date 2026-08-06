// Generates dev.to-ready markdown files (front matter + body + canonical footer)
// for every blog post into social-kits/crosspost/dev-to/.
// Run: npx tsx scripts/generate-crossposts.ts
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { BLOG_POSTS } from "../src/data/blog-posts";

const SITE = "https://www.onamsecurity.com";
const OUT = join(process.cwd(), "social-kits", "crosspost", "dev-to");
mkdirSync(OUT, { recursive: true });

// dev.to allows max 4 tags, lowercase alphanumeric
const TAG_OVERRIDES: Record<string, string[]> = {
  "kubernetes-rbac-pitfalls": ["kubernetes", "security", "devops", "cloud"],
  "aws-misconfigurations-first-scan": ["aws", "security", "cloud", "devops"],
  "ciem-vs-iam-security": ["security", "aws", "cloud", "iam"],
  "why-cloud-iam-permissions-are-never-used": ["security", "aws", "cloud", "iam"],
  "epss-over-cvss": ["security", "vulnerability", "devops", "cloud"],
  "mitre-attack-cloud-mapping": ["security", "cloud", "devsecops", "aws"],
};
const DEFAULT_TAGS = ["cloudsecurity", "security", "cloud", "devops"];

let n = 0;
const skipped: string[] = [];
for (const post of BLOG_POSTS) {
  if (!post.body?.trim()) {
    skipped.push(post.slug);
    continue;
  }
  n++;
  const canonical = `${SITE}/resources/blog/${post.slug}`;
  const tags = (TAG_OVERRIDES[post.slug] ?? DEFAULT_TAGS).join(", ");
  const fm = [
    "---",
    `title: "${post.title.replace(/"/g, '\\"')}"`,
    "published: false",
    `description: "${post.excerpt.replace(/"/g, '\\"').slice(0, 150)}"`,
    `tags: ${tags}`,
    `canonical_url: ${canonical}`,
    "---",
  ].join("\n");
  const footer = `\n\n---\n\n*Originally published on the [Onam Security blog](${canonical}). Onam is a unified cloud security platform — CSPM, attack-path analysis, identity, data, and detection on one security graph across AWS, Azure, GCP and more. [See the platform.](${SITE}/platform)*\n`;
  const file = join(OUT, `${String(n).padStart(2, "0")}-${post.slug}.md`);
  writeFileSync(file, `${fm}\n${post.body.trim()}${footer}`);
  console.log(`wrote ${file}`);
}
if (skipped.length) console.log(`skipped (no body): ${skipped.join(", ")}`);
console.log(`${n} cross-post files generated in ${OUT}`);
