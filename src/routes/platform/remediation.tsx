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
        "Every Onam finding ships with its fix — an exact CLI command, a Terraform snippet, or a pull request against your repo. Version-targeted dependency upgrades, threat narratives, and verification on the next scan.",
      path: "/platform/remediation",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
