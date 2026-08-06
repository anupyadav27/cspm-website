import { createFileRoute } from "@tanstack/react-router";
import { CloudSolutionTemplate } from "@/components/site/CloudSolutionTemplate";
import { azureData } from "@/data/solutions-clouds";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/solutions/azure")({
  head: () =>
    seo({
      title: "Azure Cloud Security Posture Management (CSPM) — Onam Security",
      description: azureData.sub,
      path: "/solutions/azure",
      image: "/og/solutions-azure.png",
    }),
  component: () => <CloudSolutionTemplate data={azureData} />,
});
