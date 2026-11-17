import { createFileRoute, redirect } from "@tanstack/react-router";
import { retiredTarget } from "@/data/retired-pages";

/** Onam AIOps design page, now /onam-ai/architecture. Retired 17 Nov 2026 — see src/data/retired-pages.ts. */
export const Route = createFileRoute("/platform/ai-operations/architecture")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: retiredTarget(location.pathname) ?? "/platform", statusCode: 301 });
  },
});
