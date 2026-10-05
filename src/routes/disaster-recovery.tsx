import { createFileRoute } from "@tanstack/react-router";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { productPages } from "@/data/products";
import { seo } from "@/lib/seo";

/**
 * Onam DRM's marketing page. Top level, like /estate and /finops, because DRM is a
 * product rather than a security engine. NOT /drm: on www that path is routed to the
 * DRM app's login. /platform/drm 301s here.
 */
const data = productPages.drm;

export const Route = createFileRoute("/disaster-recovery")({
  head: () =>
    seo({
      title: "Onam DRM — cloud disaster recovery management",
      description: data.metaDescription ?? data.sub,
      path: "/disaster-recovery",
    }),
  component: () => <ProductPageTemplate data={data} />,
});
