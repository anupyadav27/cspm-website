/**
 * Per-page Open Graph card generator.
 *
 * Every page shared the one generic /og-image.png, so a link to a Learn
 * explainer looked identical to a link to the pricing page. This renders a
 * branded 1200x630 card per page — the eyebrow, title and accent colour vary,
 * the brand furniture does not.
 *
 * Run:  node screenshots/generate-og.cjs
 * Out:  public/og/<slug>.png   (referenced via seo({ image }) per route)
 *
 * CommonJS on purpose — package.json is "type": "module".
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, '..', 'public', 'og');

// Brand palette, matching src/styles.css and the site header.
const INK = '#0B1220';
const MUTED = '#475569';
const BORDER = '#E5E9F0';

// The real "True North" mark, inlined as a data URI. A strict CSP and the
// file:// context both make external/relative image loads unreliable here.
const LOGO_DATA_URI =
  'data:image/svg+xml;base64,' +
  fs.readFileSync(path.join(__dirname, '..', 'public', 'logo.svg')).toString('base64');

/** One card. `accent` tints the eyebrow, rule and glow. */
function card({ eyebrow, title, sub, accent }) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:630px;font-family:Inter,-apple-system,sans-serif;background:#fff;
       position:relative;overflow:hidden}
  .glow{position:absolute;top:-260px;right:-160px;width:760px;height:560px;border-radius:50%;
        background:${accent};opacity:.13;filter:blur(120px)}
  .grid{position:absolute;inset:0;
        background-image:radial-gradient(${BORDER} 1px,transparent 1px);background-size:26px 26px;opacity:.5}
  .wrap{position:relative;height:100%;display:flex;flex-direction:column;padding:64px 72px}
  /* Content is centred in the space above the footer — space-between left a
     dead gap in the middle of every card. */
  .main{flex:1;display:flex;flex-direction:column;justify-content:center}
  .eyebrow{display:inline-flex;align-items:center;gap:9px;font-size:15px;font-weight:800;
           letter-spacing:.16em;text-transform:uppercase;color:${accent}}
  .dot{width:9px;height:9px;border-radius:50%;background:${accent}}
  h1{font-size:${title.length > 62 ? 52 : title.length > 42 ? 60 : 68}px;font-weight:900;color:${INK};
     line-height:1.08;letter-spacing:-.022em;margin-top:26px;max-width:1010px}
  .sub{font-size:23px;color:${MUTED};line-height:1.45;margin-top:22px;max-width:900px}
  .rule{height:5px;width:104px;background:${accent};border-radius:3px;margin-top:30px}
  .foot{display:flex;align-items:center;justify-content:space-between;
        border-top:1px solid ${BORDER};padding-top:26px}
  .brand{display:flex;align-items:center;gap:13px}
  .mark{width:44px;height:44px}
  .name{font-size:21px;font-weight:800;color:${INK};letter-spacing:-.01em}
  .url{font-size:17px;color:${MUTED};font-weight:600}
</style></head><body>
  <div class="glow"></div><div class="grid"></div>
  <div class="wrap">
    <div class="main">
      <div class="eyebrow"><span class="dot"></span>${eyebrow}</div>
      <h1>${title}</h1>
      ${sub ? `<div class="sub">${sub}</div>` : ''}
      <div class="rule"></div>
    </div>
    <div class="foot">
      <div class="brand">
        <img class="mark" src="${LOGO_DATA_URI}" alt=""/>
        <div class="name">Onam Security</div>
      </div>
      <div class="url">onamsecurity.com</div>
    </div>
  </div>
</body></html>`;
}

// Cards to render. Kept explicit rather than derived so copy can be tuned
// per card — an OG title is not always the same as the page <title>.
const CARDS = [
  // ── Learn glossary ────────────────────────────────────────────────────────
  ['learn',                       'Cloud Security Glossary', 'CSPM, CNAPP, CWPP, CIEM, DSPM — explained', 'Vendor-neutral definitions of every cloud security acronym.', '#2563EB'],
  ['learn-cspm',                  'Learn', 'What is CSPM?', 'Cloud Security Posture Management — what it catches, and what it misses.', '#2563EB'],
  ['learn-cnapp',                 'Learn', 'What is CNAPP?', 'The umbrella category — and how to spot a bundle pretending to be one.', '#4F46E5'],
  ['learn-cwpp',                  'Learn', 'What is CWPP?', 'Workload protection across VMs, containers, serverless and hosts.', '#059669'],
  ['learn-ciem',                  'Learn', 'What is CIEM?', 'Effective permissions, after role chains, SCPs and boundaries resolve.', '#F2AF04'],
  ['learn-dspm',                  'Learn', 'What is DSPM?', 'Where sensitive data lives — and who can actually reach it.', '#7C3AED'],
  ['learn-sspm',                  'Learn', 'What is SSPM?', 'Securing M365, Google Workspace, GitHub and Snowflake.', '#8B5CF6'],
  ['learn-cloud-attack-path',     'Learn', 'What is a cloud attack path?', 'Why a list of findings is not a priority.', '#E32D25'],
  ['learn-agentless-cloud-security','Learn','What is agentless cloud security?', 'Full coverage with nothing installed. Honest about the limits.', '#06B6D4'],
  ['learn-cloud-risk-quantification','Learn','What is cloud risk quantification?', 'FAIR — turning findings into dollar-denominated exposure.', '#05A052'],
  ['learn-choke-point',           'Learn', 'What is a choke point?', 'Fix one node, eliminate hundreds of attack paths.', '#EA580C'],

  // ── Platform ──────────────────────────────────────────────────────────────
  ['platform',                    'Platform', 'One platform. Every cloud security engine.', '29 engines on one graph, across seven clouds and your SaaS.', '#2563EB'],
  ['platform-cspm',               'Platform', 'Cloud Security Posture Management', '9,853 posture rules across seven clouds. 100% agentless.', '#2563EB'],
  ['platform-cnapp',              'Platform', 'CNAPP — one posture score', 'Seven scored pillars that decompose to a single finding.', '#4F46E5'],
  ['platform-cwpp',               'Platform', 'CWPP — Workload Protection', 'VMs, containers, serverless and hosts. No agents.', '#059669'],
  ['platform-saas-security',      'Platform', 'SaaS Security (SSPM)', 'M365, Workspace, GitHub, Snowflake — 433 CIS SaaS rules.', '#8B5CF6'],
  ['platform-attack-path',        'Platform', 'Cloud Attack Path Analysis', 'Toxic combinations and choke points across your estate.', '#E32D25'],
  ['platform-agentless',          'Platform', 'Agentless Scanning', 'Snapshot-based, inside your own account. Nothing to install.', '#06B6D4'],
  ['platform-ciem',               'Platform', 'CIEM — Identity & Entitlements', '80% of cloud permissions are never used.', '#F2AF04'],
  ['platform-data-security',      'Platform', 'DSPM — Data Security', 'Where your sensitive data lives, and who can reach it.', '#7C3AED'],
  ['platform-compliance',         'Platform', 'Compliance — 78 frameworks', 'Continuous evidence. Export in one click.', '#059669'],

  // ── Solutions (Tier 1 clouds first) ───────────────────────────────────────
  ['solutions-oci',               'Solutions', 'Oracle Cloud (OCI) Security', '2,059 posture rules — more than most vendors ship for AWS.', '#C74634'],
  ['solutions-alicloud',          'Solutions', 'Alibaba Cloud Security', '1,151 rules across ECS, ACK, OSS, RDS, RAM and VPC.', '#FF6A00'],
  ['solutions-ibm',               'Solutions', 'IBM Cloud Security', 'Full CSPM depth — not a checkbox integration.', '#0F62FE'],
  ['solutions-aws',               'Solutions', 'AWS Cloud Security', '2,018 posture rules across 123 AWS services.', '#FF9900'],
  ['solutions-azure',             'Solutions', 'Azure Cloud Security', 'Every subscription and tenant, continuously.', '#0078D4'],
  ['solutions-gcp',               'Solutions', 'Google Cloud Security', 'Projects, folders and org policy on one graph.', '#4285F4'],
  ['solutions-kubernetes',        'Solutions', 'Kubernetes Security', 'EKS, AKS, GKE, OKE and any conformant cluster.', '#326CE5'],

  // ── Other ─────────────────────────────────────────────────────────────────
  ['resources',                   'Resources', 'Whitepapers, tools & explainers', 'The FAIR calculator, capability brochures and attack-path deep dives.', '#0891B2'],
  ['pricing',                     'Pricing', 'Straightforward cloud security pricing', 'Start free. $22 per resource per month on Pro.', '#05A052'],
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

  for (const [slug, eyebrow, title, sub, accent] of CARDS) {
    await page.setContent(card({ eyebrow, title, sub, accent }), { waitUntil: 'networkidle' });
    const out = path.join(OUT, `${slug}.png`);
    await page.screenshot({ path: out });
    console.log(`  ${slug}.png  ${Math.round(fs.statSync(out).size / 1024)}K`);
  }

  await browser.close();
  console.log(`\n✓ ${CARDS.length} OG cards written to public/og/`);
})();
