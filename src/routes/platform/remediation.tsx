import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { platformPages } from "@/data/platform-pages";
import { seo } from "@/lib/seo";

const data = platformPages["remediation"];

export const Route = createFileRoute("/platform/remediation")({
  head: () =>
    seo({
      title: "Remediation & AI Fix — Onam Security",
      description:
        "Cloud security remediation: fix guidance per rule, an AI fix prompt on every finding, fix branches for source code, and verification on the next scan.",
      path: "/platform/remediation",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
