import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { platformPages } from "@/data/platform-pages";
import { seo } from "@/lib/seo";

const data = platformPages["ai-spm-self-hosted"];

export const Route = createFileRoute("/platform/ai-spm/self-hosted")({
  head: () =>
    seo({
      title: `${data.label} — AI-SPM — Onam Security`,
      description: data.metaDescription ?? data.sub,
      path: "/platform/ai-spm/self-hosted",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
