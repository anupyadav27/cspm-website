import { createFileRoute, redirect } from "@tanstack/react-router";
import { retiredTarget } from "@/data/retired-pages";

/** Old Onam FinOps module pages. Retired 17 Nov 2026 — see src/data/retired-pages.ts. */
export const Route = createFileRoute("/finops_/$module")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: retiredTarget(location.pathname) ?? "/platform", statusCode: 301 });
  },
});
