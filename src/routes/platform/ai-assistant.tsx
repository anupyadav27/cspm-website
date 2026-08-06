import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { platformPages } from "@/data/platform-pages";
import { seo } from "@/lib/seo";

const data = platformPages["ai-assistant"];

export const Route = createFileRoute("/platform/ai-assistant")({
  head: () =>
    seo({
      title: "AI Security Assistant — Onam Security",
      description:
        "Ask your cloud security questions in plain language. Onam's AI assistant routes to thirteen domain specialists that query your real findings and cite every answer — read-only, tenant-scoped, never trained on your data.",
      path: "/platform/ai-assistant",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
