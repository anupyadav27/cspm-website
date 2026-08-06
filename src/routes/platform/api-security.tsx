import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { platformPages } from "@/data/platform-pages";
import { seo } from "@/lib/seo";

const data = platformPages["api-security"];

export const Route = createFileRoute("/platform/api-security")({
  head: () =>
    seo({
      title: "API Security Posture Management — Onam Security",
      description:
        "Onam discovers every API surface across AWS, Azure, GCP, OCI, Alibaba and Kubernetes — gateways, function URLs and ingress — and evaluates 241 API posture rules for auth, WAF, TLS, throttling and shadow APIs.",
      path: "/platform/api-security",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
