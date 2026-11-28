import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { platformPages } from "@/data/platform-pages";
import { seo } from "@/lib/seo";

const data = platformPages["ai-spm-inventory"];

export const Route = createFileRoute("/platform/ai-spm/inventory")({
  head: () =>
    seo({
      title: `${data.label} — AI-SPM — Onam Security`,
      description: data.metaDescription ?? data.sub,
      path: "/platform/ai-spm/inventory",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
