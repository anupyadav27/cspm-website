import { createFileRoute } from "@tanstack/react-router";
import { CloudSolutionTemplate } from "@/components/site/CloudSolutionTemplate";
import { awsData } from "@/data/solutions-clouds";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/solutions/aws")({
  head: () =>
    seo({
      title: "AWS Cloud Security — Onam",
      description: awsData.sub,
      path: "/solutions/aws",
    }),
  component: () => <CloudSolutionTemplate data={awsData} />,
});
