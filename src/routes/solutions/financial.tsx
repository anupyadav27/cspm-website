import { createFileRoute } from "@tanstack/react-router";
import { IndustrySolutionTemplate } from "@/components/site/IndustrySolutionTemplate";
import { financialData } from "@/data/solutions-industries";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/solutions/financial")({
  head: () =>
    seo({
      title: "Cloud Security for Financial Services — Onam",
      description: financialData.sub,
      path: "/solutions/financial",
    }),
  component: () => <IndustrySolutionTemplate data={financialData} />,
});
