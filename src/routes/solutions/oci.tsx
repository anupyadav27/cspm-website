import { createFileRoute } from "@tanstack/react-router";
import { CloudSolutionTemplate } from "@/components/site/CloudSolutionTemplate";
import { ociData } from "@/data/solutions-clouds";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/solutions/oci")({
  head: () =>
    seo({
      title: "Oracle Cloud (OCI) Cloud Security — Onam",
      description: ociData.sub,
      path: "/solutions/oci",
    }),
  component: () => <CloudSolutionTemplate data={ociData} />,
});
