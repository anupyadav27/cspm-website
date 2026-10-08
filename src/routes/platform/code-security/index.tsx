import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { CodeSecurityOverviewExtra } from "@/components/site/CodeSecurityExtra";
import { platformPages } from "@/data/platform-pages";
import { seo } from "@/lib/seo";

const data = platformPages["code-security"];

export const Route = createFileRoute("/platform/code-security/")({
  head: () =>
    seo({
      title: `${data.label} — SAST, SCA, SBOM, IaC and DAST — Onam Security`,
      description: data.metaDescription ?? data.sub,
      path: "/platform/code-security",
    }),
  component: () => <ProductPageTemplate data={data} video="codeSecurity" extra={<CodeSecurityOverviewExtra />} />,
});
