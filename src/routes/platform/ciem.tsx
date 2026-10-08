import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { CiemExtra } from "@/components/site/CiemExtra";
import { platformPages } from "@/data/platform-pages";
import { seo } from "@/lib/seo";

const data = platformPages["ciem"];

export const Route = createFileRoute("/platform/ciem")({
  head: () =>
    seo({
      title: `${data.label} — Cloud Identity & Entitlement Management — Onam Security`,
      description: data.metaDescription ?? data.sub,
      path: "/platform/ciem",
      image: "/og/platform-ciem.png",
    }),
  component: () => <ProductPageTemplate data={data} video="ciem" extra={<CiemExtra />} />,
});
