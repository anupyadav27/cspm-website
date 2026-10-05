import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { platformPages } from "@/data/platform-pages";
import { seo } from "@/lib/seo";

const data = platformPages["database-security"];

export const Route = createFileRoute("/platform/database-security")({
  head: () =>
    seo({
      title: "Database Security Posture — Onam Security",
      description:
        "Cloud database security for RDS, Aurora, Azure SQL, Cloud SQL, DynamoDB, Redshift and more: 310 database rules plus CIS benchmarks for major engines.",
      path: "/platform/database-security",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
