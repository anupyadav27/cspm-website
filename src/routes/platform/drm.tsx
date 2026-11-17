import { createFileRoute, redirect } from "@tanstack/react-router";
import { retiredTarget } from "@/data/retired-pages";

/** Old guessable address for Onam DRM. Retired 17 Nov 2026 — see src/data/retired-pages.ts. */
export const Route = createFileRoute("/platform/drm")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: retiredTarget(location.pathname) ?? "/platform", statusCode: 301 });
  },
});
