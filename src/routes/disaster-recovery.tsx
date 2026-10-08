import { createFileRoute } from "@tanstack/react-router";
import { ProductFlagship } from "@/components/site/ProductFlagship";
import { productFlagships } from "@/data/products";
import { seo } from "@/lib/seo";

/**
 * Onam DRM's marketing page. Top level, like /estate and /finops, because DRM is a
 * product rather than a security engine. NOT /drm: on www that path is routed to the
 * DRM app's login. /platform/drm 301s here.
 */
const data = productFlagships.drm;

export const Route = createFileRoute("/disaster-recovery")({
  head: () =>
    seo({
      title: "Onam DRM — cloud disaster recovery management",
      description: data.page.metaDescription ?? data.page.sub,
      path: "/disaster-recovery",
      image: "/og/drm.png",
    }),
  component: () => <ProductFlagship data={data} video="drm" />,
});
