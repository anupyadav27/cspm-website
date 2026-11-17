import { createFileRoute, redirect } from "@tanstack/react-router";
import { retiredTarget } from "@/data/retired-pages";

/** Onam AIOps is now Onam AI, at /onam-ai. Retired 17 Nov 2026 — see src/data/retired-pages.ts. */
export const Route = createFileRoute("/platform/ai-operations/")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: retiredTarget(location.pathname) ?? "/platform", statusCode: 301 });
  },
});
