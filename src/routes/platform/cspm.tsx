import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { platformPages } from "@/data/platform-pages";
import { seo } from "@/lib/seo";

const data = platformPages["cspm"];

export const Route = createFileRoute("/platform/cspm")({
  head: () =>
    seo({
      title: "Cloud Security Posture Management (CSPM) — Onam Security",
      description:
        "Onam CSPM finds cloud misconfigurations across AWS, Azure, GCP, OCI, Alibaba, IBM & Kubernetes — 1,918 posture rules, 100% agentless, continuous scanning, exact remediation for every finding.",
      path: "/platform/cspm",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
