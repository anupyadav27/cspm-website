import { createFileRoute } from "@tanstack/react-router";
import { IndustrySolutionTemplate } from "@/components/site/IndustrySolutionTemplate";
import { healthcareData } from "@/data/solutions-industries";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/solutions/healthcare")({
  head: () =>
    seo({
      title: "Cloud Security for Healthcare — HIPAA Compliance — Onam",
      description: healthcareData.metaDescription ?? healthcareData.sub,
      path: "/solutions/healthcare",
    }),
  component: () => <IndustrySolutionTemplate data={healthcareData} />,
});
