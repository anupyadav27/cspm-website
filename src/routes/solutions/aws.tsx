import { createFileRoute } from "@tanstack/react-router";
import { CloudSolutionTemplate } from "@/components/site/CloudSolutionTemplate";
import { awsData } from "@/data/solutions-clouds";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/solutions/aws")({
  head: () =>
    seo({
      title: "AWS Cloud Security Posture Management (CSPM) — Onam Security",
      description:
        "Agentless AWS cloud security posture management — 2,018 posture rules across 123 AWS services, CIS AWS Foundations benchmark scoring, IAM entitlement analysis and attack-path detection. Read-only role, first findings in five minutes.",
      path: "/solutions/aws",
    }),
  component: () => <CloudSolutionTemplate data={awsData} />,
});
