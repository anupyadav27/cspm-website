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
        "Encryption and key management security: 502 secrets and KMS rules across AWS KMS, Azure Key Vault, GCP Cloud KMS and OCI Vault, including key rotation.",
      path: "/platform/encryption",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
