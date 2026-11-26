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
        "Onam CSPM finds cloud misconfigurations across AWS, Azure, GCP, OCI, Alibaba, IBM and Kubernetes: 11,856 posture rule definitions, with fix guidance and an AI fix prompt on every finding.",
      path: "/platform/cspm",
      image: "/og/platform-cspm.png",
    }),
  component: () => <ProductPageTemplate data={data} video="cspm" />,
});
