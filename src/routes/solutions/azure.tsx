import { createFileRoute } from "@tanstack/react-router";
import { CloudSolutionTemplate } from "@/components/site/CloudSolutionTemplate";
import { azureData } from "@/data/solutions-clouds";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/solutions/azure")({
  head: () =>
    seo({
      title: "Azure Cloud Security — Onam",
      description: azureData.sub,
      path: "/solutions/azure",
    }),
  component: () => <CloudSolutionTemplate data={azureData} />,
});
