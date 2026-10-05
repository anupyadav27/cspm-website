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
        "Cloud asset inventory across seven clouds and 549 services, normalised into one resource model with the relationship graph attack paths run on.",
      path: "/platform/inventory",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
