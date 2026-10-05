import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { platformPages } from "@/data/platform-pages";
import { seo } from "@/lib/seo";

const data = platformPages["saas-security"];

export const Route = createFileRoute("/platform/saas-security")({
  head: () =>
    seo({
      title: "SaaS Security Posture Management (SSPM) — Onam Security",
      description:
        "SSPM for Microsoft 365, Google Workspace, GitHub, GitLab, Snowflake, SharePoint, Dynamics 365 and Okta, on the same graph as your cloud posture.",
      path: "/platform/saas-security",
      image: "/og/platform-saas-security.png",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
