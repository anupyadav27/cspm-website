import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { productPages } from "@/data/products";
import { seo } from "@/lib/seo";

const data = productPages.estate;

export const Route = createFileRoute("/estate")({
  head: () =>
    seo({
      title: "Onam Estate — the cloud estate of record",
      description: data.sub,
      path: "/estate",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
