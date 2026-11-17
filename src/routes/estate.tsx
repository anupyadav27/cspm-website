import { createFileRoute, redirect } from "@tanstack/react-router";
import { retiredTarget } from "@/data/retired-pages";

/** Onam Estate is no longer a product; its address goes to the Security asset inventory. Retired 17 Nov 2026 — see src/data/retired-pages.ts. */
export const Route = createFileRoute("/estate")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: retiredTarget(location.pathname) ?? "/platform", statusCode: 301 });
  },
});
