import { createFileRoute } from "@tanstack/react-router";
import { MarketplaceStrip } from "@/components/site/MarketplaceStrip";
import { VideoSection } from "@/components/site/VideoEmbed";
import { PLAYLISTS, playlistUrl } from "@/data/videos";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { seo, SITE_URL } from "@/lib/seo";
import { CLOUDS } from "@/lib/product-facts";
import { Hero } from "@/components/site/home/PlatformHero";
import { PlatformLayers } from "@/components/site/home/PlatformLayers";
import { AIOpsSpotlight, OneFoundation, ProductSuite } from "@/components/site/home/ProductSuite";
import { FAQSection, TrustBar } from "@/components/site/security/SecurityHome";

/**
 * The platform homepage (2026-10-06). It introduces Onam as one platform — Estate,
 * Security, FinOps and DRM, with Onam AIOps across them — and hands each product to its
 * own page. The security-only story that used to live here is now /platform, in full.
 *
 * Order: what Onam is (hero + platform layers, which name the clouds) -> the four
 * products and AIOps (tabs) -> AIOps highlighted -> what they share -> FAQ -> CTA.
 * The security spotlight (attack path) lives on /platform only — on both pages it
 * was the same section twice in one click.
 */
export const Route = createFileRoute("/")({
  head: () =>
    seo({
      title: "Onam — one cloud platform for assets, security, cost and recovery",
      description:
        "One cloud platform: asset inventory, CNAPP security, FinOps and disaster recovery on one discovery, with Onam AIOps agents in early access across them.",
      path: "/",
      image: "/og/home.png",
    }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      <Hero />
      <VideoSection
        video="pitch"
        eyebrow="Overview"
        title="See it in two minutes"
        lead="What Onam is and how the products fit together, in one short video."
      >
        <div className="mt-6 flex justify-center">
          <BrandButton href={playlistUrl(PLAYLISTS.startHere)} variant="secondary">
            All Q&amp;A videos →
          </BrandButton>
        </div>
      </VideoSection>
      <PlatformLayers />
      <ProductSuite />
      <AIOpsSpotlight />
      <OneFoundation />
      <MarketplaceStrip />
      <TrustBar />
      <FAQSection
        items={PLATFORM_FAQ}
        subtitle="The platform, the products, AI agents and how you buy them — answered straight."
      />
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
    a: "Onam is one end-to-end cloud platform. Onam Estate discovers and maps everything you run; Onam Security finds and prioritises risk across posture, identity, data, code, attack paths and threat detection; Onam FinOps explains what it costs and who owns it; Onam DRM maps applications, predicts recovery time against your targets and flags drift from the approved plan. All four share one discovery and one console, and Onam AIOps — AI agents that investigate with evidence and propose changes for a person to approve — is in early access across them.",
  },
  {
    q: "Do I have to buy all four products?",
    a: "No. Onam Security is sold in Free, Pro and Enterprise plans. Onam Estate, Onam FinOps and Onam DRM are added per organisation — contact sales. Whatever you start with, your cloud accounts are connected once and every product you add later works from the same inventory.",
  },
  {
    q: "What is Onam AIOps, and can I use it today?",
    a: "Onam AIOps is a workspace where your team works with specialist AI agents. The Asset Agent and Security Agent are in early access, enabled per organisation by invitation; the Compliance and Data agents are in development; FinOps, DR and Architecture agents are on the roadmap. Agents answer questions and propose changes with evidence attached — they do not change your cloud, and every proposed change waits for a person to approve it.",
  },
  {
    q: "Which clouds does Onam cover?",
    a: `The shared inventory covers ${CLOUDS} clouds: AWS, Microsoft Azure, Google Cloud, Oracle Cloud, Alibaba Cloud, IBM Cloud and Kubernetes. Some views are narrower today — for example, Onam Estate's architecture view draws AWS accounts — and each product's documentation says where.`,
  },
  {
    q: "Does Onam change anything in my cloud accounts?",
    a: "Posture scanning and discovery use read-only cloud roles, and agentless workload scanning runs inside your own account. Onam DRM reads configuration and records approvals, baselines and drills inside DRM; it does not fail anything over. Onam AIOps proposes changes for a person to approve and does not execute them in a customer cloud.",
  },
];

const HOME_JSONLD = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Onam",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Cloud asset, security, cost and disaster recovery management",
    operatingSystem: "Cloud (SaaS)",
    url: SITE_URL,
    description:
      "One end-to-end cloud platform: Onam Estate (asset intelligence), Onam Security (CSPM, CIEM, attack paths, threat detection, data and code security, compliance), Onam FinOps (cloud cost) and Onam DRM (disaster recovery management) on one discovery, with Onam AIOps agents in early access across them.",
    featureList: [
      "Onam Estate — continuous cloud asset inventory and relationship mapping",
      "Onam Security — CSPM, CIEM, DSPM, CWPP, SSPM, attack paths, threat detection and compliance on one graph",
      "Onam FinOps — billed and effective cost, ownership attribution, forecast, budgets and savings",
      "Onam DRM — application mapping, protection coverage, predicted RTO/RPO, recovery plans and drift from baseline",
      "Onam AIOps (early access) — specialist AI agents that investigate with evidence and propose changes for human approval",
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
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
            Ready when you are
          </div>
          <h2 className="mt-5 font-display font-black text-4xl md:text-5xl text-[#0B1220] tracking-tight">
            See your cloud <span className="gradient-text">end to end.</span>
          </h2>
          <p className="mt-5 text-lg text-[#475569] max-w-2xl mx-auto">
            Connect one account once. See what you run, what is exposed, what it costs and how it
            comes back — then decide which products you need.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <BrandButton to="/request-demo" size="lg">
              Request demo →
            </BrandButton>
            <BrandButton to="/company/contact" size="lg" variant="secondary">
              Talk to us
            </BrandButton>
          </div>
        </div>
      </div>
    </section>
  );
}
