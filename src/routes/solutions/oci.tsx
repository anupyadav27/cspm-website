import { createFileRoute } from "@tanstack/react-router";
import { CloudSolutionTemplate } from "@/components/site/CloudSolutionTemplate";
import { ociData } from "@/data/solutions-clouds";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/solutions/oci")({
  head: () =>
    seo({
      title: "Oracle Cloud (OCI) Security Posture Management — Onam",
      description:
        "Oracle Cloud (OCI) security posture management: 2,059 agentless rules across Compute, OKE, Object Storage, Autonomous DB, IAM and VCN, mapped to CIS OCI.",
      path: "/solutions/oci",
      image: "/og/solutions-oci.png",
    }),
  component: () => <CloudSolutionTemplate data={ociData} />,
});
