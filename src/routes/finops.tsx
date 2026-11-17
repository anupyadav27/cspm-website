import { createFileRoute, redirect } from "@tanstack/react-router";
import { retiredTarget } from "@/data/retired-pages";

/** Onam FinOps is no longer a product. Retired 17 Nov 2026 — see src/data/retired-pages.ts. */
export const Route = createFileRoute("/finops")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: retiredTarget(location.pathname) ?? "/platform", statusCode: 301 });
  },
});
