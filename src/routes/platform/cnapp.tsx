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
        "CNAPP posture score across seven pillars (CSPM, CIEM, CWPP, DSPM, network, threat and AppSec) that decomposes from a board-level number to one finding.",
      path: "/platform/cnapp",
      image: "/og/platform-cnapp.png",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
