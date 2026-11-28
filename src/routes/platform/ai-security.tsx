import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * 301 for the old AI Security address. Owner, 28 Nov 2026: AI-SPM is its own product group with
 * an overview at /platform/ai-spm and sub-pages under /platform/ai-spm/*. The old address is kept
 * as a permanent redirect because nav, footer, docs and external links pointed here.
 */
export const Route = createFileRoute("/platform/ai-security")({
  beforeLoad: () => {
    throw redirect({ to: "/platform/ai-spm", statusCode: 301 });
  },
});
