import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { platformPages } from "@/data/platform-pages";
import { seo } from "@/lib/seo";

const data = platformPages["agentless"];

export const Route = createFileRoute("/platform/agentless")({
  head: () =>
    seo({
      title: "Agentless Cloud Scanning — Onam Security",
      description:
        "Onam scans every workload with zero agents — snapshot-based scanning orchestrated inside your own account via AWS Step Functions, Azure Logic Apps and GCP Workflows. Your data never leaves your environment.",
      path: "/platform/agentless",
      image: "/og/platform-agentless.png",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
