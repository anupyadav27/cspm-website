import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { platformPages } from "@/data/platform-pages";
import { seo } from "@/lib/seo";

const data = platformPages["ai-code-fix"];

export const Route = createFileRoute("/platform/ai-code-fix")({
  head: () =>
    seo({
      title: "AI Code Fix — Onam Security",
      description:
        "Onam Security AI Code Fix rewrites files flagged by a code scan and pushes the fix to a separate branch for review. Nothing merges or deploys itself.",
      path: "/platform/ai-code-fix",
    }),
  component: () => <ProductPageTemplate data={data} video="codeSecurity" />,
});
