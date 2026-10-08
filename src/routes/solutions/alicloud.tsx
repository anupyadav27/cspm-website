import { createFileRoute } from "@tanstack/react-router";
import { CloudSolutionTemplate } from "@/components/site/CloudSolutionTemplate";
import { alicloudData } from "@/data/solutions-clouds";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/solutions/alicloud")({
  head: () =>
    seo({
      title: "Alibaba Cloud CSPM: Security Posture Management — Onam",
      description: alicloudData.metaDescription ?? alicloudData.sub,
      path: "/solutions/alicloud",
      image: "/og/solutions-alicloud.png",
    }),
  component: () => <CloudSolutionTemplate data={alicloudData} />,
});
