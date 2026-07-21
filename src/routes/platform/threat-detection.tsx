import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { platformPages } from "@/data/platform-pages";
import { seo } from "@/lib/seo";

const data = platformPages["threat-detection"];

export const Route = createFileRoute("/platform/threat-detection")({
  head: () =>
    seo({
      title: `${data.label} — Onam Security`,
      description: data.sub,
      path: "/platform/threat-detection",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
