import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { platformPages } from "@/data/platform-pages";
import { seo } from "@/lib/seo";

const data = platformPages["remediation"];

export const Route = createFileRoute("/platform/remediation")({
  head: () =>
    seo({
      title: "Remediation & Auto-Fix — Onam Security",
      description:
        "Cloud security remediation: every Onam finding ships with its fix, an exact CLI command or Terraform snippet, and is verified on the next scan.",
      path: "/platform/remediation",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
