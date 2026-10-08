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
        "One CNAPP posture score across seven pillars — posture, threat detection and IAM, workloads, data, network, threat and code — with a risk band and a trend.",
      path: "/platform/cnapp",
      image: "/og/platform-cnapp.png",
    }),
  component: () => <ProductPageTemplate data={data} video="cnapp" />,
});
