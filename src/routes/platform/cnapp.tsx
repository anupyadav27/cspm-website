import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { platformPages } from "@/data/platform-pages";
import { seo } from "@/lib/seo";

const data = platformPages["cnapp"];

export const Route = createFileRoute("/platform/cnapp")({
  head: () =>
    seo({
      title: "CNAPP — Unified Cloud-Native Application Protection — Onam Security",
      description:
        "One posture score across seven pillars — CSPM, CIEM, CWPP, DSPM, network, threat and AppSec. Severity- and exposure-weighted scoring that decomposes from board-level number to individual finding.",
      path: "/platform/cnapp",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
