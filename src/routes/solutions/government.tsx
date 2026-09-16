import { createFileRoute } from "@tanstack/react-router";
import { IndustrySolutionTemplate } from "@/components/site/IndustrySolutionTemplate";
import { governmentData } from "@/data/solutions-industries";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/solutions/government")({
  head: () =>
    seo({
      // "fedramp conmon tools / software / platform" — 15 query variants, ~660 impressions a
      // month, every one landing on this page (Search Console, 2026-09-14). The page already
      // did continuous monitoring; the title and description now say so in the words used.
      title: "FedRAMP Continuous Monitoring (ConMon) Software for Government — Onam",
      description:
        "FedRAMP continuous monitoring (ConMon) software for federal agencies and contractors: monthly ConMon evidence generated automatically against NIST 800-53, FedRAMP Moderate and High, FISMA and CMMC, across every cloud you operate. Agentless, read-only, 3PAO-ready exports.",
      path: "/solutions/government",
    }),
  component: () => <IndustrySolutionTemplate data={governmentData} />,
});
