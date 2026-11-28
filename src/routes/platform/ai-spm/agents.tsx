import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { platformPages } from "@/data/platform-pages";
import { seo } from "@/lib/seo";

const data = platformPages["ai-spm-agents"];

export const Route = createFileRoute("/platform/ai-spm/agents")({
  head: () =>
    seo({
      title: `${data.label} — AI-SPM — Onam Security`,
      description: data.metaDescription ?? data.sub,
      path: "/platform/ai-spm/agents",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
