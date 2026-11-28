import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { platformPages } from "@/data/platform-pages";
import { seo } from "@/lib/seo";

/** AI Security (AI-SPM) overview. Sub-pages: inventory, ai-in-saas, self-hosted, agents. */
const data = platformPages["ai-spm"];

export const Route = createFileRoute("/platform/ai-spm/")({
  head: () =>
    seo({
      title: `${data.label} — Onam Security`,
      description: data.metaDescription ?? data.sub,
      path: "/platform/ai-spm",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
