import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { platformPages } from "@/data/platform-pages";
import { seo } from "@/lib/seo";

const data = platformPages["risk"];

export const Route = createFileRoute("/platform/risk")({
  head: () =>
    seo({
      title: `${data.label} — Onam Security`,
      description: data.sub,
      path: "/platform/risk",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
