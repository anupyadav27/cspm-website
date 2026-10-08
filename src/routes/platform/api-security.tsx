import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { platformPages } from "@/data/platform-pages";
import { seo } from "@/lib/seo";

const data = platformPages["api-security"];

export const Route = createFileRoute("/platform/api-security")({
  head: () =>
    seo({
      title: "API Security Posture Management for Cloud APIs | Onam Security",
      description: data.metaDescription ?? data.sub,
      path: "/platform/api-security",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
