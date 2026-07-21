import { createFileRoute } from "@tanstack/react-router";
import { CloudSolutionTemplate } from "@/components/site/CloudSolutionTemplate";
import { alicloudData } from "@/data/solutions-clouds";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/solutions/alicloud")({
  head: () =>
    seo({
      title: "Alibaba Cloud Cloud Security — Onam",
      description: alicloudData.sub,
      path: "/solutions/alicloud",
    }),
  component: () => <CloudSolutionTemplate data={alicloudData} />,
});
