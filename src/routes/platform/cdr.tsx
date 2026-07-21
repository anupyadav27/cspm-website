import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { platformPages } from "@/data/platform-pages";
import { seo } from "@/lib/seo";

const data = platformPages["cdr"];

export const Route = createFileRoute("/platform/cdr")({
  head: () =>
    seo({
      title: `${data.label} — Onam Security`,
      description: data.sub,
      path: "/platform/cdr",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
