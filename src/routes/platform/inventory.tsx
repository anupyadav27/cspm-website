import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { platformPages } from "@/data/platform-pages";
import { seo } from "@/lib/seo";

const data = platformPages["inventory"];

export const Route = createFileRoute("/platform/inventory")({
  head: () =>
    seo({
      title: "Cloud Asset Inventory & Discovery — Onam Security",
      description:
        "Continuous read-only discovery across seven clouds and 549 services — AWS, Azure, GCP, OCI, Alibaba, IBM and Kubernetes — normalised into one resource model with the relationship graph attack paths are computed on.",
      path: "/platform/inventory",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
