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
        "Onam CSPM finds cloud misconfigurations across AWS, Azure, GCP, OCI, Alibaba, IBM and Kubernetes: 9,853 posture rules, each finding with its exact fix.",
      path: "/platform/cspm",
      image: "/og/platform-cspm.png",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
