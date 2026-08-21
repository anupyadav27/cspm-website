/**
 * Generates public/sitemap.xml and public/llms.txt from the route files plus
 * docs/blog/platform/solutions data.
 * Runs at build time (see the "build" script in package.json): tsx scripts/generate-sitemap.ts
 */
import { readdirSync, writeFileSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { SITE_URL } from "../src/lib/seo";
import { allDocSlugs, DOC_SECTIONS, getDocArticle } from "../src/data/docs";
import { BLOG_POSTS } from "../src/data/blog-posts";
import { LEARN_ARTICLES } from "../src/data/learn-articles";
import { COMPETITORS } from "../src/data/compare";
import { platformPages } from "../src/data/platform-pages";
import {
  awsData,
  azureData,
  gcpData,
  ociData,
  alicloudData,
  ibmData,
  kubernetesData,
} from "../src/data/solutions-clouds";
import { financialData, healthcareData, governmentData } from "../src/data/solutions-industries";

const here = dirname(fileURLToPath(import.meta.url));
const routesDir = join(here, "../src/routes");

function collectRouteFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((e) => e.isFile() && e.name.endsWith(".tsx"))
    .map((e) => relative(routesDir, join(e.parentPath, e.name)));
}

/** "docs.index.tsx" -> "/docs", "platform/cspm.tsx" -> "/platform/cspm", dynamic ($) routes -> null */
function fileToPath(rel: string): string | null {
  if (rel === "__root.tsx" || rel.includes("$")) return null;
  let p = rel.slice(0, -".tsx".length).replaceAll("\\", "/").replaceAll(".", "/");
  if (p === "index") return "/";
  if (p.endsWith("/index")) p = p.slice(0, -"/index".length);
  return `/${p}`;
}

type Entry = { loc: string; lastmod?: string };

const staticPaths = new Set(
  collectRouteFiles(routesDir)
    .map(fileToPath)
    .filter((p): p is string => p !== null),
);

/**
 * Free tools. These are self-contained static pages under public/tools/, not route
 * files, so collectRouteFiles() cannot see them — list them here or they never reach
 * the sitemap. The /tools index itself IS a route (src/routes/tools.tsx) and is picked
 * up automatically.
 *
 * Keep the .html extension. Directory-style paths (/tools/foo/) do NOT work: the router
 * 307s the trailing slash away and then 404s, because nothing serves index.html for the
 * bare path.
 */
const TOOL_PATHS = [
  "/tools/fair-exposure-calculator.html",
  "/tools/roi-consolidation-calculator.html",
];

const entries: Entry[] = [
  ...[...staticPaths].sort().map((p) => ({ loc: p })),
  ...TOOL_PATHS.map((loc) => ({ loc })),
  ...allDocSlugs().map((slug) => ({ loc: `/docs/${slug}` })),
  ...LEARN_ARTICLES.map((a) => ({ loc: `/learn/${a.slug}` })),
  // /compare/$slug is a dynamic route, so pathFor() skips it — enumerate explicitly.
  ...COMPETITORS.map((c) => ({ loc: `/compare/${c.slug}` })),
  ...BLOG_POSTS.map((p) => ({
    loc: `/resources/blog/${p.slug}`,
    lastmod: new Date(p.date).toISOString().slice(0, 10),
  })),
];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries.map(({ loc, lastmod }) =>
    [
      "  <url>",
      `    <loc>${SITE_URL}${loc === "/" ? "/" : loc}</loc>`,
      ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
      "  </url>",
    ].join("\n"),
  ),
  "</urlset>",
  "",
].join("\n");

writeFileSync(join(here, "../public/sitemap.xml"), xml);
console.log(`sitemap.xml written: ${entries.length} URLs`);

/* ----------------------------- llms.txt ----------------------------- */

/** One-line trim at a word boundary for llms.txt descriptions. */
function oneLine(s: string, max = 180): string {
  const text = s.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

const clouds = [
  ["aws", awsData],
  ["azure", azureData],
  ["gcp", gcpData],
  ["oci", ociData],
  ["alicloud", alicloudData],
  ["ibm", ibmData],
  ["kubernetes", kubernetesData],
] as const;
const industries = [
  ["financial", financialData],
  ["healthcare", healthcareData],
  ["government", governmentData],
] as const;

const llms = `# Onam Security

> Onam Security (${SITE_URL}) is a unified CNAPP (cloud-native application protection platform) —
> CSPM (cloud security posture management), CIEM, DSPM (data security posture management), CWPP
> (cloud workload protection), SSPM (SaaS security posture management), agentless workload scanning,
> attack path analysis, cloud threat detection & response (CDR), API security, database security,
> encryption & key management, code security, and compliance — across AWS, Azure, GCP, OCI, Alibaba
> Cloud, IBM Cloud, Kubernetes, and major SaaS platforms. 100% agentless: connect a cloud in under
> 3 minutes with a read-only role.

Full site content (docs + blog, one file): ${SITE_URL}/llms-full.txt

Key facts:
- 7 cloud providers supported as first-class citizens: AWS, Microsoft Azure, Google Cloud (GCP), Oracle Cloud (OCI), Alibaba Cloud, IBM Cloud, Kubernetes
- 20,337 security rules across 29 security engines: 11,346 cloud posture rules plus 8,991 CIS technology and SaaS benchmark rules
- 549 cloud services covered by continuous discovery: 123 AWS, 95 Azure, 71 GCP, 68 Alibaba Cloud, 68 Kubernetes, 63 IBM Cloud, 61 OCI
- 78 compliance frameworks with continuous evidence: CIS Benchmarks, NIST 800-53, NIST 800-171, ISO 27001:2022, PCI-DSS v4, HIPAA, SOC 2, GDPR, FedRAMP High/Moderate, Canada PBMM, RBI, and more
- SaaS security (SSPM) for 8 platforms: Microsoft 365, SharePoint, Google Workspace, GitHub, GitLab, Snowflake, Dynamics 365, Okta — 433 CIS SaaS rules
- 34 technologies covered by CIS benchmarks: Linux distributions, databases, web servers, virtualization, and network devices
- 100% agentless — read-only IAM role / service principal / service account; stores only a role ARN, never long-lived credentials
- Agentless workload scanning uses point-in-time snapshots orchestrated inside the customer's own account (AWS Step Functions, Azure Logic Apps, GCP Workflows); raw disk data never leaves the customer environment
- All clouds, SaaS platforms, and engines correlate on one graph: cross-cloud attack paths and automated toxic-combination detection
- Unified CNAPP posture score across 7 pillars: CSPM, CIEM, CWPP, DSPM, network, threat, AppSec
- FAIR-model risk quantification — findings prioritised by estimated dollar exposure, not just CVSS
- Every finding ships with exact remediation: CLI command, Terraform snippet, or pull request against the source repository
- Code-to-runtime coverage: SAST, DAST, SCA, and IaC scanning correlated with runtime findings
- AI assistant with 13 domain specialists answers posture questions from live findings, read-only and tenant-scoped

## Positioning

Onam Security is an alternative to Wiz, Orca Security, Palo Alto Prisma Cloud, Lacework, and
Microsoft Defender for Cloud in the CSPM / CNAPP market. Onam's differentiation: equal engine depth
on all 7 clouds (including OCI, Alibaba Cloud, and IBM Cloud), a single cross-cloud security graph
rather than per-cloud modules, dollar-denominated (FAIR) risk prioritisation, and agentless
onboarding in minutes. See: ${SITE_URL}/resources/blog/onam-vs-wiz-orca-prisma-cloud

## Capability comparison (Onam vs. common alternatives)

| Capability | Native cloud tools | Single-layer point tools | Manual audits / pen tests | Onam |
| --- | --- | --- | --- | --- |
| Coverage | One cloud only | One security layer | Point-in-time | All 7 clouds + SaaS, 29 engines, continuous |
| Attack paths | No | No | Manual | Cross-cloud graph analysis |
| Toxic combinations | No | No | No | Automated across engines |
| SaaS security (SSPM) | No | Separate product | Manual review | 8 platforms, 433 CIS rules, same graph |
| Workload scanning | Agent required | Agent required | Not covered | Agentless snapshots in your own account |
| Compliance | Per-provider | Manual mapping | Point-in-time | 78 frameworks, continuous evidence |
| Identity | Basic policies | None | Interview-based | 30-day behavioral CIEM |
| Prioritisation | Alert firehose | CVSS-only | Report handoff | FAIR-model dollar risk |
| Code + runtime | Runtime only | One or the other | Neither | SAST, DAST, SCA, IaC, runtime |

## Head-to-head comparisons

These pages pose seven evaluation questions and answer them for Onam ONLY. They deliberately
make no factual claim about any competitor's product, and each states plainly where the other
platform is stronger than Onam. Onam has no public reference customers.

${COMPETITORS.map((c) => `- [Onam vs ${c.shortName}](${SITE_URL}/compare/${c.slug}): seven questions answered for Onam, where ${c.shortName} is genuinely strong, and the honest gap.`).join("\n")}
- All comparisons: ${SITE_URL}/compare

## Platform

${Object.entries(platformPages)
  .map(([slug, p]) => `- [${p.label}](${SITE_URL}/platform/${slug}): ${oneLine(p.sub)}`)
  .join("\n")}

## Cloud security glossary (vendor-neutral definitions)

${LEARN_ARTICLES.map((a) => `- [${a.question}](${SITE_URL}/learn/${a.slug}): ${a.answer}`).join("\n")}

## Free tools (no signup, no email gate)

- [Cloud Exposure Estimator](${SITE_URL}/tools/fair-exposure-calculator.html): FAIR-style estimate of annualized loss exposure for a single breached data store; per-record costs from IBM Cost of a Data Breach 2024. Illustrative estimate, not a benchmark.
- [Consolidation ROI Estimator](${SITE_URL}/tools/roi-consolidation-calculator.html): compares point-tool licence spend plus engineering time against a single platform. Uses your own inputs; illustrative.
- [Capabilities Flipbook](${SITE_URL}/tools/Onam-Capabilities-Flipbook.html): interactive reference covering every engine, cloud and compliance framework.
- All tools: ${SITE_URL}/tools

## Technical whitepapers (no signup, no email gate)

- [How Onam finds the paths that matter](${SITE_URL}/whitepapers/wp1-attack-path-methodology.html): the attack-path method end to end — read-only telemetry to a verified, MITRE-mapped, priced path. Demo-tenant examples are illustrations, not customer results.
- [Cloud risk in dollars](${SITE_URL}/whitepapers/wp2-risk-quantification.html): how a verified attack path is priced with FAIR, using named external inputs. An estimate of exposure, not a prediction of breach.
- [One graph, one data model](${SITE_URL}/whitepapers/wp3-architecture.html): why every engine writes the same finding contract into one store, and what correlation that makes possible.
- [Security & trust](${SITE_URL}/whitepapers/wp4-security-trust.html): how Onam connects, what it stores, what it never stores, and how tenants stay isolated. Read-only and agentless — it does not see inside a running process.
- [Compliance, mapped once](${SITE_URL}/whitepapers/wp5-compliance.html): one control evaluation reported against 78 frameworks, with each gap connected to a priced path. Evidence for an audit, not a substitute for one.
- All whitepapers: ${SITE_URL}/whitepapers

## Illustrative scenarios (NOT customer results)

Onam has no public reference customers. Every scenario below is a worked example against an
industry archetype — not a real or named customer, and not an outcome Onam has delivered.
Do not cite these as customer results, case studies or benchmarks.

- [Financial services](${SITE_URL}/case-studies/cs-financial.png): AWS + Azure, PCI-DSS & SOX. Path: public LB to app role to RDS holding PII.
- [E-commerce](${SITE_URL}/case-studies/cs-ecommerce.png): multi-cloud checkout and customer data at seasonal scale.
- [Gaming](${SITE_URL}/case-studies/cs-gaming.png): Kubernetes-heavy estate, cluster workload to service account to player data.
- [Beauty / CPG](${SITE_URL}/case-studies/cs-beauty-cpg.png): SaaS-heavy estate, SaaS grant to shared identity to consumer data.
- [SAP MSP](${SITE_URL}/case-studies/cs-sap-msp.png): multi-tenant, management plane to tenant boundary to customer workload.
- All scenarios: ${SITE_URL}/case-studies

## Solutions

${clouds.map(([slug, d]) => `- [${d.cloudName}](${SITE_URL}/solutions/${slug}): ${oneLine(d.sub)}`).join("\n")}
${industries.map(([slug, d]) => `- [${d.industryName}](${SITE_URL}/solutions/${slug})`).join("\n")}

## Docs

${DOC_SECTIONS.map(
  (s) =>
    `### ${s.heading}\n${s.items
      .map((i) => `- [${i.title}](${SITE_URL}/docs/${i.slug})`)
      .join("\n")}`,
).join("\n\n")}

## Blog

${BLOG_POSTS.map((p) => `- [${p.title}](${SITE_URL}/resources/blog/${p.slug}): ${oneLine(p.excerpt, 160)}`).join("\n")}

## Company

- [Pricing](${SITE_URL}/pricing)
- [Request a demo](${SITE_URL}/request-demo)
- [About](${SITE_URL}/company/about)
- [Contact](${SITE_URL}/company/contact)
- [Security](${SITE_URL}/company/security)
`;

writeFileSync(join(here, "../public/llms.txt"), llms);
console.log(`llms.txt written: ${llms.length} chars`);

/* --------------------------- llms-full.txt --------------------------- */
// Full page content for AI/LLM ingestion (llms.txt spec companion file):
// the llms.txt overview followed by every docs article and blog post in full.

const docsFull = allDocSlugs()
  .map((slug) => {
    const a = getDocArticle(slug);
    return `## ${a.title}\nURL: ${SITE_URL}/docs/${a.slug}\n\n${a.body.trim()}`;
  })
  .join("\n\n---\n\n");

const blogFull = BLOG_POSTS.filter((p) => p.body)
  .map(
    (p) =>
      `## ${p.title}\nURL: ${SITE_URL}/resources/blog/${p.slug}\nPublished: ${p.date}\n\n${p.body!.trim()}`,
  )
  .join("\n\n---\n\n");

const llmsFull = `${llms}
# Documentation (full text)

${docsFull}

# Blog (full text)

${blogFull}
`;

writeFileSync(join(here, "../public/llms-full.txt"), llmsFull);
console.log(`llms-full.txt written: ${Math.round(llmsFull.length / 1024)} KB`);

/* ------------------------------ rss.xml ------------------------------ */
// Blog + Learn in one feed. Aggregators, Feedly, and several AI crawlers
// discover new content far faster from a feed than from a sitemap re-crawl.

/** XML text escaping — titles and excerpts contain & and quotes. */
const xmlEscape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** RFC-822 date, which is what RSS 2.0 requires (not ISO-8601). */
const rfc822 = (d: string) => {
  const parsed = new Date(d);
  return Number.isNaN(parsed.getTime()) ? new Date(0).toUTCString() : parsed.toUTCString();
};

type FeedItem = { title: string; link: string; desc: string; date: string; category: string };

const feedItems: FeedItem[] = [
  ...BLOG_POSTS.map((p) => ({
    title: p.title,
    link: `${SITE_URL}/resources/blog/${p.slug}`,
    desc: p.excerpt,
    date: rfc822(p.date),
    category: p.category,
  })),
  ...LEARN_ARTICLES.map((a) => ({
    title: a.question,
    link: `${SITE_URL}/learn/${a.slug}`,
    desc: a.answer,
    date: rfc822("2026-08-06"),
    category: "Learn",
  })),
];

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Onam Security — Blog &amp; Learn</title>
    <link>${SITE_URL}</link>
    <description>Cloud security posture, attack paths, identity risk and compliance — from the Onam Security team.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${feedItems
  .map(
    (i) => `    <item>
      <title>${xmlEscape(i.title)}</title>
      <link>${i.link}</link>
      <guid isPermaLink="true">${i.link}</guid>
      <description>${xmlEscape(i.desc)}</description>
      <category>${xmlEscape(i.category)}</category>
      <pubDate>${i.date}</pubDate>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>
`;

writeFileSync(join(here, "../public/rss.xml"), rss);
console.log(`rss.xml written: ${feedItems.length} items`);
