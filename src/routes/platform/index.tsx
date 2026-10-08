import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { seo } from "@/lib/seo";
import { OpsBand } from "@/components/site/ops/OpsBand";
import { VideoSection } from "@/components/site/VideoEmbed";
import { DemoVideos } from "@/components/site/DemoVideos";
import { SecuritySpotlight } from "@/components/site/home/PlatformHero";
import { SuiteStrip } from "@/components/site/home/ProductSuite";
import {
  CloudBar,
  ComplianceSection,
  Differentiator,
  FAQSection,
  FinalCTA,
  HowItWorks,
  OutcomeStrip,
  PlatformPillars,
  ProductDemo,
  SECURITY_JSONLD,
  StatsSection,
  TrustBar,
  WhyNow,
} from "@/components/site/security/SecurityHome";

/**
 * Onam Security's product page. Until 2026-10-06 this story was the homepage; the
 * homepage now introduces the platform, and the security story lives here in full.
 * Engine pages stay at /platform/* (indexed URLs); this page links to every one
 * of them through PlatformPillars.
 */
export const Route = createFileRoute("/platform/")({
  head: () =>
    seo({
      title: "Onam Security — every cloud security engine on one graph",
      description:
        "Cloud security platform covering CNAPP, CSPM, CIEM, DSPM, CWPP, SSPM, attack paths, threat detection and compliance: 29 engines on one security graph.",
      path: "/platform",
      image: "/og/platform.png",
    }),
  component: SecurityProductPage,
});

function SecurityProductPage() {
  return (
    <SiteLayout>
      <SecuritySpotlight asHero />
      <OutcomeStrip />
      <VideoSection video="overview" title="Onam Security in two minutes" />
      <CloudBar />
      <HowItWorks />
      <ProductDemo />
      <DemoVideos />
      <PlatformPillars />
      <OpsBand />
      <StatsSection />
      <ComplianceSection />
      <WhyNow />
      <Differentiator />
      <TrustBar />
      <FAQSection />
      <SuiteStrip current="security" />
      <FinalCTA />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SECURITY_JSONLD) }}
      />
    </SiteLayout>
  );
}
