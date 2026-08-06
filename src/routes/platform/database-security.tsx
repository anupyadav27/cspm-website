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
        "Onam secures every managed and self-hosted database — RDS, Aurora, Azure SQL, Cloud SQL, DynamoDB, Redshift and more — with 310 cloud database rules plus 1,364 CIS engine benchmarks for PostgreSQL, MySQL, Oracle, MSSQL and MongoDB.",
      path: "/platform/database-security",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
