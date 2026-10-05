import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { CodeSecuritySubPageExtra } from "@/components/site/CodeSecurityExtra";
import { codeSecuritySubPages } from "@/data/code-security-pages";
import { seo } from "@/lib/seo";

const page = codeSecuritySubPages["dast"];

export const Route = createFileRoute("/platform/code-security/dast")({
  head: () =>
    seo({
      title: page.title,
      description: page.data.metaDescription ?? page.data.sub,
      path: "/platform/code-security/dast",
    }),
  component: () => (
    <ProductPageTemplate
      data={page.data}
      extra={
        <CodeSecuritySubPageExtra
          diagram={page.diagram}
          illustration={page.illustration}
          docsHref={page.docsHref}
          label={page.data.label}
        />
      }
    />
  ),
});
