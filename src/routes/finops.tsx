import { createFileRoute } from "@tanstack/react-router";
import { ProductFlagship } from "@/components/site/ProductFlagship";
import { productFlagships } from "@/data/products";
import { seo } from "@/lib/seo";

const data = productFlagships.finops;

export const Route = createFileRoute("/finops")({
  head: () =>
    seo({
      title: "Onam FinOps — cloud cost and commitment management",
      description: data.page.metaDescription ?? data.page.sub,
      path: "/finops",
      image: "/og/finops.png",
    }),
  component: () => <ProductFlagship data={data} />,
});
