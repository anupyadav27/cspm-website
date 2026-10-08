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
      title: "FedRAMP Continuous Monitoring (ConMon) Tools & Evidence — Onam",
      description: governmentData.metaDescription ?? governmentData.sub,
      path: "/solutions/government",
    }),
  component: () => <IndustrySolutionTemplate data={governmentData} />,
});
