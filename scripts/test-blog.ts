/**
 * Truth and plumbing test for the blog (blog review, 27 Nov 2026).
 *  1. Every post ends with the free plan CTA (Start free -> /start-free?from=<post>, Book a demo).
 *  2. No superseded number, retired product or retired wording appears in a post.
 *  3. FAQ sections use :::faq, so FAQPage JSON-LD is emitted.
 *  4. Related posts are picked by topic and never include the post itself.
 *  5. Retired posts are gone from the list and 301 to a live post.
 * Run: npx tsx scripts/test-blog.ts
 */
import { BLOG_POSTS, freePlanCta, relatedPosts, getPost } from "../src/data/blog-posts";
import { faqJsonLd } from "../src/components/site/Prose";
import { retiredTarget } from "../src/data/retired-pages";

let failed = 0;
const fail = (m: string) => {
  failed++;
  console.error("FAIL", m);
};

const NEVER: [RegExp, string][] = [
  [/11,433|11433|9,853|9853/, "superseded rule count (use 12,912 definitions / 11,856 CSPM posture)"],
  [/\b549\b/, "superseded service count (use 672)"],
  [/\b78 (compliance )?frameworks\b/i, "superseded framework count (use 144: 119 automated, 25 attestation-only)"],
  [/\b(8|eight) (SaaS )?platforms\b/i, "superseded SaaS count (use 9)"],
  [/144 (supported|automated)|supports 144/i, "only the 119 automated tier may be called supported"],
  [/\b50 units\b/i, "the free plan is up to 25 units"],
  [/Onam (Estate|FinOps|DRM)\b|\bdisaster recovery\b/i, "retired products"],
  [/nothing (else )?is installed|without installing anything|nothing to install/i, "retired wording: say what posture and workload scanning deploy"],
  [/everything else Onam does is read-only|Onam is read-only|whole product is read-only/i, "never call the whole product read-only"],
  [/optional host agent/i, "host agent is an open owner question: do not claim one"],
  [/sensor on your hosts/i, "host agent is an open owner question: do not claim either way"],
  [/AWS (identities|only) today|Onam does this for AWS today|is AWS-only today/i, "stale CIEM limit (changed 26 Nov)"],
  [/does not yet trace a runtime finding|reported on their own today/i, "stale code-to-cloud limit (lifted 26 Nov)"],
  [/screenshot-cdr\.png/, "CDR screenshot needs retaking (threats_area caution)"],
  [/\*\*\*\*\d{4}/, "masked account IDs read as real; use 123456789012"],
  [/governance score|0–10 risk score/i, "unsourced mechanism (cut per review T8)"],
  [/ThreatFox|URLhaus|MalwareBazaar/, "threat-intel sources that must not be named"],
  [/ISO\/IEC[- ]approved/i, "FAIR is not ISO/IEC-approved"],
  [/\{\{[A-Z_]+\}\}/, "unexpanded shared-copy marker"],
];

for (const p of BLOG_POSTS) {
  const body = p.body ?? "";
  // 1. CTA
  if (!body.trimEnd().endsWith(freePlanCta(p.slug).trimEnd())) fail(`${p.slug}: body does not end with the free plan CTA`);
  if (!body.includes(`/start-free?from=/resources/blog/${p.slug}`)) fail(`${p.slug}: CTA has no from= for this post`);
  // 2. Truth
  for (const [re, why] of NEVER) {
    const m = re.exec(body) ?? re.exec(p.title) ?? re.exec(p.excerpt);
    if (m) fail(`${p.slug}: "${m[0]}" — ${why}`);
  }
  // 3. FAQ
  if (/^## (Frequently asked questions|FAQ)/m.test(body)) fail(`${p.slug}: FAQ heading outside :::faq (no FAQPage JSON-LD)`);
  if (body.includes(":::faq") && !faqJsonLd(body)) fail(`${p.slug}: :::faq block produced no FAQPage JSON-LD`);
  // dates
  for (const d of [p.date, p.updated].filter(Boolean) as string[])
    if (Number.isNaN(new Date(d).getTime())) fail(`${p.slug}: unparseable date ${d}`);
  // 4. Related
  const rel = relatedPosts(p);
  if (rel.length !== 3) fail(`${p.slug}: ${rel.length} related posts`);
  if (rel.some((r) => r.slug === p.slug)) fail(`${p.slug}: related includes itself`);
}

const k8s = getPost("kubernetes-rbac-pitfalls");
if (k8s && relatedPosts(k8s).every((r) => r.category === "Buyer's Guide")) fail("RBAC post is still offered only vendor lists");

// 5. Retired posts
for (const slug of ["onam-vs-wiz-orca-prisma-cloud", "ai-powered-cloud-remediation"]) {
  if (getPost(slug)) fail(`${slug}: retired post still listed`);
  const t = retiredTarget(`/resources/blog/${slug}`);
  if (!t) fail(`${slug}: no 301 in retired-pages.ts`);
  else if (!getPost(t.replace("/resources/blog/", ""))) fail(`${slug}: 301 target ${t} is not a live post`);
}
for (const p of BLOG_POSTS)
  for (const m of (p.body ?? "").matchAll(/\]\(\/resources\/blog\/([a-z0-9-]+)\)/g))
    if (!getPost(m[1])) fail(`${p.slug}: links to missing post ${m[1]}`);

if (!getPost("aws-security-hub-what-would-onam-add")) fail("Security Hub post missing");

console.log(failed ? `test-blog: ${failed} failure(s)` : `test-blog: OK (${BLOG_POSTS.length} posts)`);
process.exit(failed ? 1 : 0);
