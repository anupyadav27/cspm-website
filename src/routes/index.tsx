import { createFileRoute } from "@tanstack/react-router";
import { MarketplaceStrip } from "@/components/site/MarketplaceStrip";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { seo, SITE_URL } from "@/lib/seo";
import { CLOUDS } from "@/lib/product-facts";
import { Hero } from "@/components/site/home/PlatformHero";
import { PlatformLayers } from "@/components/site/home/PlatformLayers";
import { OnamAiSpotlight, OneFoundation, ProductSuite } from "@/components/site/home/ProductSuite";
import { FAQSection, TrustBar } from "@/components/site/security/SecurityHome";

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
      <FAQSection items={PLATFORM_FAQ} subtitle="" />
      <PlatformCTA />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_JSONLD) }}
      />
    </SiteLayout>
  );
}

const PLATFORM_FAQ = [
  {
    q: "What is Onam?",
    a: "Onam is Onam Security: cloud security (CSPM, CIEM, DSPM, AI security, vulnerability and workload protection), SaaS security and code security on one security graph, across attack paths, threat detection and compliance. Onam AI, your AI security analyst, answers questions about your findings and suggests fixes; it is in early access.",
  },
  {
    q: "How is Onam priced?",
    a: "Onam Security has published prices in three lines: cloud security at $20 per unit a month on the Complete plan, with CIEM and DSPM included; SaaS security priced per unit; and code security priced per developer. A free one-time audit scan of one cloud account comes first, so you can decide with your own results.",
  },
  {
    q: "What is Onam AI, and can I use it today?",
    a: "Onam AI is your AI security analyst for Onam Security. Ask about findings, attack paths and data security in plain language; answers cite their evidence and mask sensitive values. It is in early access, enabled per organisation by invitation, starting on AWS. It suggests fixes and never changes your cloud without a person's approval. The AI Assistant inside Onam Security is available to every customer today.",
  },
  {
    q: "Which clouds does Onam cover?",
    a: `Posture scanning covers ${CLOUDS} clouds: AWS, Microsoft Azure, Google Cloud, Oracle Cloud, Alibaba Cloud, IBM Cloud and Kubernetes, plus major SaaS platforms. Some features are narrower today (for example, some identity analysis is AWS-only), and the documentation says where.`,
  },
  {
    q: "Does Onam change anything in my cloud accounts?",
    a: "No. Posture scanning and discovery use read-only cloud roles, and agentless workload scanning runs inside your own account. Onam AI suggests fixes for a person to approve and does not execute them in a customer cloud.",
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
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PLATFORM_FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
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
            Start with a free scan of{" "}
            <span className="gradient-text">one cloud account.</span>
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
