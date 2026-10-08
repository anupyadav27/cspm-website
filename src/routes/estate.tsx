import { createFileRoute } from "@tanstack/react-router";
import { ProductFlagship } from "@/components/site/ProductFlagship";
import { productFlagships } from "@/data/products";
import { seo } from "@/lib/seo";

const data = productFlagships.estate;

export const Route = createFileRoute("/estate")({
  head: () =>
    seo({
      title: "Onam Estate — the cloud estate of record",
      description: data.page.metaDescription ?? data.page.sub,
      path: "/estate",
      image: "/og/estate.png",
    }),
  component: () => <ProductFlagship data={data} video="estate" />,
});
