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
        "Agentless workload scanning: Onam scans snapshots inside your own account via AWS Step Functions, Azure Logic Apps and GCP Workflows. No agents to run.",
      path: "/platform/agentless",
      image: "/og/platform-agentless.png",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
