import { createFileRoute } from "@tanstack/react-router";
import { CloudSolutionTemplate } from "@/components/site/CloudSolutionTemplate";
import { alicloudData } from "@/data/solutions-clouds";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/solutions/alicloud")({
  head: () =>
    seo({
      title: "Alibaba Cloud Security Posture Management (CSPM) — Onam Security",
      description:
        "Agentless Alibaba Cloud security posture management — 1,151 rules across ECS, ACK, OSS, RDS, RAM and VPC, mapped to CIS Alibaba Cloud and CIS ACK benchmarks. Findings on the same graph as your AWS, Azure and GCP posture.",
      path: "/solutions/alicloud",
    }),
  component: () => <CloudSolutionTemplate data={alicloudData} />,
});
