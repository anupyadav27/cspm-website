import { createFileRoute } from "@tanstack/react-router";
import { CloudSolutionTemplate } from "@/components/site/CloudSolutionTemplate";
import { ociData } from "@/data/solutions-clouds";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/solutions/oci")({
  head: () =>
    seo({
      title: "OCI CSPM: Oracle Cloud Security Posture Management — Onam",
      description: ociData.metaDescription ?? ociData.sub,
      path: "/solutions/oci",
      image: "/og/solutions-oci.png",
    }),
  component: () => <CloudSolutionTemplate data={ociData} />,
});
