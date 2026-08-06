import { createFileRoute } from "@tanstack/react-router";
import { CloudSolutionTemplate } from "@/components/site/CloudSolutionTemplate";
import { gcpData } from "@/data/solutions-clouds";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/solutions/gcp")({
  head: () =>
    seo({
      title: "Google Cloud (GCP) Security Posture Management — Onam Security",
      description: gcpData.sub,
      path: "/solutions/gcp",
    }),
  component: () => <CloudSolutionTemplate data={gcpData} />,
});
