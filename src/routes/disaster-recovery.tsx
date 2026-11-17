import { createFileRoute, redirect } from "@tanstack/react-router";
import { retiredTarget } from "@/data/retired-pages";

/** Onam DRM is no longer a product. Retired 17 Nov 2026 — see src/data/retired-pages.ts. */
export const Route = createFileRoute("/disaster-recovery")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: retiredTarget(location.pathname) ?? "/platform", statusCode: 301 });
  },
});
