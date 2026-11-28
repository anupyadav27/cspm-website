import { createFileRoute } from "@tanstack/react-router";
import { MarketplaceStrip } from "@/components/site/MarketplaceStrip";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { seo, SITE_URL } from "@/lib/seo";
import { CLOUDS } from "@/lib/product-facts";
import { Hero } from "@/components/site/home/PlatformHero";
import { PlatformLayers } from "@/components/site/home/PlatformLayers";
import { OnamAiSpotlight, OneFoundation, ProductSuite } from "@/components/site/home/ProductSuite";
import { TrustBar } from "@/components/site/security/SecurityHome";
import { ComicFaq } from "@/components/site/ComicFaq";

/**
 * The homepage. Owner decision 17 Nov 2026: Onam is Onam Security — cloud, SaaS and
 * code security — with Onam AI, the AI security analyst. Estate, FinOps and DRM are
 * retired (their addresses 301, see src/data/retired-pages.ts).
 *
 * Order: what Onam is (hero + layers, which name the clouds) -> Security and Onam AI
 * (tabs) -> Onam AI highlighted -> what they share -> FAQ -> CTA. The security
 * spotlight (attack path) lives on /platform only.
 */
export const Route = createFileRoute("/")({
  head: () =>
    seo({
      title: "Onam Security — cloud, SaaS and code security with an AI security analyst",
      description:
        "Onam Security: CSPM, CIEM, DSPM, workload, SaaS and code security on one security graph, with Onam AI, your AI security analyst, in early access.",
      path: "/",
      image: "/og/home.png",
    }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      <Hero />
      <PlatformLayers />
      <ProductSuite />
      <OnamAiSpotlight />
      <OneFoundation />
      <MarketplaceStrip />
      <TrustBar />
      <ComicFaq faqs={PLATFORM_FAQ} />
      <PlatformCTA />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_JSONLD) }}
      />
    </SiteLayout>
  );
}

// Facts: marketing facts/product.yaml (ai_spm_live_items, plan wording), threat-engine
// secops_fix routers/triage.py (AI review only labels likely false positives) and
// bff/_ticket_content.py (tickets carry fix steps, commands and the AI fix prompt).
const PLATFORM_FAQ = [
  {
    q: "What is Onam?",
    a: "Onam is Onam Security: code security, cloud security, SaaS security and AI security (AI-SPM) on one inventory and one security graph, so findings from different engines join up. On top of it, Onam AI, your AI security analyst, works through the findings with you. Onam AI is in early access.",
  },
  {
    q: "What does Onam AI do with all those alerts?",
    a: "It works the queue: it ranks alerts by real risk (exposure, attack paths, sensitive data), routes each finding to the team that owns it, flags likely false positives for your team to confirm, and cuts the list to what needs a person. For the real threats it raises a Jira or ServiceNow ticket that carries the fix steps and an AI fix prompt. It suggests; a person approves every change.",
  },
  {
    q: "How do my developers fix what Onam AI hands over?",
    a: "Each ticket carries the fix steps, ready-to-run commands where the rule has them, and an AI fix prompt. A developer's own coding agent in VS Code can read the ticket through the Jira or ServiceNow MCP server and draft the fix in your code. Your team reviews and merges as usual, and the next scan re-checks the resource and confirms the fix.",
  },
  {
    q: "What does AI-SPM cover?",
    a: "The AI in your estate: an AI inventory and an AI bill of materials built from your SBOMs, whether a provider guardrail is attached (Bedrock Guardrails, Azure content filters, Google Model Armor), which data each AI service can reach, AI agents as identities with findings for admin or wide write access, and AI apps found in your connected SaaS platforms. Self-hosted AI on Kubernetes is found and checked for exposure.",
  },
  {
    q: "Which clouds, code hosts and SaaS apps does Onam connect to?",
    a: `Posture scanning covers ${CLOUDS} clouds: AWS, Microsoft Azure, Google Cloud, Oracle Cloud, Alibaba Cloud, IBM Cloud and Kubernetes. Code comes from GitHub, GitLab and Bitbucket, and SaaS security covers platforms such as Microsoft 365, Google Workspace, GitHub and Snowflake. Some features are narrower today, and the documentation says where.`,
  },
  {
    q: "How is Onam priced?",
    a: "Prices are published in three lines: cloud security at $20 per unit a month on the Complete plan, with CIEM and DSPM included; SaaS security priced per unit; and code security priced per developer. The free plan covers up to 25 units of cloud security through your cloud's APIs, with no card.",
  },
  {
    q: "Does Onam change anything in my cloud accounts?",
    a: "No. Posture scanning and discovery use read-only cloud roles, and agentless workload scanning runs inside your own account. Onam AI suggests fixes for a person to approve and does not change anything in your cloud.",
  },
];

const HOME_JSONLD = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Onam Security",
    applicationCategory: "SecurityApplication",
    applicationSubCategory: "Cloud, SaaS and code security (CNAPP)",
    operatingSystem: "Cloud (SaaS)",
    url: SITE_URL,
    description:
      "Onam Security: cloud security (CSPM, CIEM, DSPM, AI security, vulnerability and workload protection), SaaS security and code security on one security graph, with Onam AI, the AI security analyst, in early access.",
    featureList: [
      "Cloud security: CSPM, CIEM, DSPM, CWPP, vulnerability management, AI security, attack paths, threat detection and compliance",
      "SaaS security (SSPM): Microsoft 365, Google Workspace, GitHub, Snowflake and more",
      "Code security: SAST, secrets, IaC, SCA with SBOM, and DAST",
      "Onam AI (early access): an AI security analyst that answers questions about findings, attack paths and data security, masks sensitive values and suggests fixes for human approval",
    ],
    publisher: { "@type": "Organization", name: "Onam", url: SITE_URL },
  },
];

function PlatformCTA() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="gradient-border rounded-3xl p-8 sm:p-10 md:p-16 text-center">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#1D4ED8]">
            Where to start
          </div>
          <h2 className="mt-5 font-display font-black text-4xl md:text-5xl text-[#0B1220] tracking-tight">
            Start with a free scan of <span className="gradient-text">one cloud account.</span>
          </h2>
          <p className="mt-5 text-lg text-[#475569] max-w-2xl mx-auto">
            The scan is a one-time audit. We go through the results with you, and then you decide
            whether Onam is right for you.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <BrandButton to="/audit-scan" size="lg">
              Request the free scan →
            </BrandButton>
          </div>
        </div>
      </div>
    </section>
  );
}
