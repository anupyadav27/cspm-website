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
        "AI security assistant: ask cloud security questions in plain language. Thirteen domain specialists query your real findings and cite every answer.",
      path: "/platform/ai-assistant",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
