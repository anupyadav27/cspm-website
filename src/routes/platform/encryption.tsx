import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { platformPages } from "@/data/platform-pages";
import { seo } from "@/lib/seo";

const data = platformPages["encryption"];

export const Route = createFileRoute("/platform/encryption")({
  head: () =>
    seo({
      title: "Encryption & Key Management Security — Onam Security",
      description:
        "Onam evaluates 502 secrets and key-management rules across AWS KMS, Azure Key Vault, GCP Cloud KMS and OCI Vault — encryption coverage, key rotation, certificate expiry, and the effective decrypt set for every key.",
      path: "/platform/encryption",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
