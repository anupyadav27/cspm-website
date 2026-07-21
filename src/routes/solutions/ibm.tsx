import { createFileRoute } from "@tanstack/react-router";
import { CloudSolutionTemplate } from "@/components/site/CloudSolutionTemplate";
import { ibmData } from "@/data/solutions-clouds";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/solutions/ibm")({
  head: () =>
    seo({
      title: "IBM Cloud Cloud Security — Onam",
      description: ibmData.sub,
      path: "/solutions/ibm",
    }),
  component: () => <CloudSolutionTemplate data={ibmData} />,
});
