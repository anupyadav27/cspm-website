import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { platformPages } from "@/data/platform-pages";
import { seo } from "@/lib/seo";

const data = platformPages["ciem"];

export const Route = createFileRoute("/platform/ciem")({
  head: () =>
    seo({
      title: `${data.label} — Onam Security`,
      description: data.sub,
      path: "/platform/ciem",
      image: "/og/platform-ciem.png",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
