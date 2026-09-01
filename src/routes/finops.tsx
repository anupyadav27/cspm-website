import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { productPages } from "@/data/products";
import { seo } from "@/lib/seo";

const data = productPages.finops;

export const Route = createFileRoute("/finops")({
  head: () =>
    seo({
      title: "Onam FinOps — cloud cost and commitment management",
      description: data.sub,
      path: "/finops",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
