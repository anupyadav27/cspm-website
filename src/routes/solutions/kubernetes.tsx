import { createFileRoute } from "@tanstack/react-router";
import { CloudSolutionTemplate } from "@/components/site/CloudSolutionTemplate";
import { kubernetesData } from "@/data/solutions-clouds";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/solutions/kubernetes")({
  head: () =>
    seo({
      title: "Kubernetes Cloud Security — Onam",
      description: kubernetesData.sub,
      path: "/solutions/kubernetes",
    }),
  component: () => <CloudSolutionTemplate data={kubernetesData} />,
});
