import { createFileRoute } from "@tanstack/react-router";
import { CloudSolutionTemplate } from "@/components/site/CloudSolutionTemplate";
import { ibmData } from "@/data/solutions-clouds";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/solutions/ibm")({
  head: () =>
    seo({
      title: "IBM Cloud Security Posture Management (CSPM) — Onam Security",
      description:
        "Agentless IBM Cloud security posture management — 613 rules across VSI, IKS, Cloud Object Storage, Db2 and IAM, mapped to CIS IBM Cloud and CIS IBM Db2 benchmarks. Full CSPM depth, not a checkbox integration.",
      path: "/solutions/ibm",
      image: "/og/solutions-ibm.png",
    }),
  component: () => <CloudSolutionTemplate data={ibmData} />,
});
