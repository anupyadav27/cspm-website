import { createFileRoute, redirect } from "@tanstack/react-router";

/** /platform/drm is the address people guess from /platform/*; the page lives at /disaster-recovery. */
export const Route = createFileRoute("/platform/drm")({
  beforeLoad: () => {
    throw redirect({ to: "/disaster-recovery", statusCode: 301 });
  },
});
