import { createFileRoute } from "@tanstack/react-router";
import { CloudSolutionTemplate } from "@/components/site/CloudSolutionTemplate";
import { ibmData } from "@/data/solutions-clouds";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/solutions/ibm")({
  head: () =>
    seo({
      title: "IBM Cloud Security — VPC, Network & Posture Management — Onam",
      description:
        "IBM Cloud security posture management: VPC, security groups, Cloud Internet Services, IKS, OpenShift, Object Storage, Db2 and IAM, mapped to CIS.",
      path: "/solutions/ibm",
      image: "/og/solutions-ibm.png",
    }),
  component: () => <CloudSolutionTemplate data={ibmData} />,
});
