import { createFileRoute } from "@tanstack/react-router";
import { CloudSolutionTemplate } from "@/components/site/CloudSolutionTemplate";
import { ibmData } from "@/data/solutions-clouds";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/solutions/ibm")({
  head: () =>
    seo({
      title: "IBM Cloud Security: Network & Posture Management (CSPM) — Onam",
      description: ibmData.metaDescription ?? ibmData.sub,
      path: "/solutions/ibm",
      image: "/og/solutions-ibm.png",
    }),
  component: () => <CloudSolutionTemplate data={ibmData} />,
});
