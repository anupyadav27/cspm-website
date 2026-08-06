import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { platformPages } from "@/data/platform-pages";
import { seo } from "@/lib/seo";

const data = platformPages["compliance"];

export const Route = createFileRoute("/platform/compliance")({
  head: () =>
    seo({
      title: `${data.label} — Onam Security`,
      description: data.sub,
      path: "/platform/compliance",
      image: "/og/platform-compliance.png",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
