import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { platformPages } from "@/data/platform-pages";
import { seo } from "@/lib/seo";

const data = platformPages["cwpp"];

export const Route = createFileRoute("/platform/cwpp")({
  head: () =>
    seo({
      title: "Cloud Workload Protection Platform (CWPP) — Onam Security",
      description:
        "CWPP for VMs, containers, serverless and hosts across seven clouds: 219 workload posture rules plus CIS OS benchmarks, collected without agents.",
      path: "/platform/cwpp",
      image: "/og/platform-cwpp.png",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
