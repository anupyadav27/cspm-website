import { createFileRoute } from "@tanstack/react-router";
import { CloudSolutionTemplate } from "@/components/site/CloudSolutionTemplate";
import { alicloudData } from "@/data/solutions-clouds";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/solutions/alicloud")({
  head: () =>
    seo({
      title: "Alibaba Cloud Security (CSPM) — Alongside AWS, Azure & GCP — Onam",
      description:
        "Alibaba Cloud security posture management: 1,151 agentless rules across ECS, ACK, OSS, RDS, RAM and VPC, mapped to CIS Alibaba Cloud and CIS ACK.",
      path: "/solutions/alicloud",
      image: "/og/solutions-alicloud.png",
    }),
  component: () => <CloudSolutionTemplate data={alicloudData} />,
});
