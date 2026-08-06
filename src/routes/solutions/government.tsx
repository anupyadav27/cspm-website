import { createFileRoute } from "@tanstack/react-router";
import { IndustrySolutionTemplate } from "@/components/site/IndustrySolutionTemplate";
import { governmentData } from "@/data/solutions-industries";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/solutions/government")({
  head: () =>
    seo({
      title: "Cloud Security for Government — FedRAMP & PBMM — Onam Security",
      description: governmentData.sub,
      path: "/solutions/government",
    }),
  component: () => <IndustrySolutionTemplate data={governmentData} />,
});
