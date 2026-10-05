import { createFileRoute } from "@tanstack/react-router";
import { CloudSolutionTemplate } from "@/components/site/CloudSolutionTemplate";
import { awsData } from "@/data/solutions-clouds";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/solutions/aws")({
  head: () =>
    seo({
      title: "AWS Cloud Security Posture Management (CSPM) — Onam Security",
      description:
        "AWS security posture management: 2,018 posture rules across 123 AWS services, CIS AWS Foundations scoring, IAM entitlement analysis and attack paths.",
      path: "/solutions/aws",
      image: "/og/solutions-aws.png",
    }),
  component: () => <CloudSolutionTemplate data={awsData} />,
});
