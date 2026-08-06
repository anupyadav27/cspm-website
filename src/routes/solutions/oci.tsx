import { createFileRoute } from "@tanstack/react-router";
import { CloudSolutionTemplate } from "@/components/site/CloudSolutionTemplate";
import { ociData } from "@/data/solutions-clouds";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/solutions/oci")({
  head: () =>
    seo({
      title: "Oracle Cloud (OCI) Security Posture Management — Onam Security",
      description:
        "Onam brings 2,059 posture rules to Oracle Cloud — more than most vendors ship for AWS. Agentless OCI CSPM across Compute, OKE, Object Storage, Autonomous DB, IAM and VCN, mapped to CIS OCI, ISO 27001 and PCI-DSS.",
      path: "/solutions/oci",
    }),
  component: () => <CloudSolutionTemplate data={ociData} />,
});
