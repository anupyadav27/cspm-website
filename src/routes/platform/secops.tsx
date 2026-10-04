import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * 301 for the retired /platform/secops page.
 *
 * Until 2026-10 two pages described the same code-scanning capability:
 * /platform/secops and /platform/code-security. They competed with each other in search
 * and disagreed on detail. Finding issues in code now lives only at /platform/code-security;
 * fixing them lives at /platform/ai-code-fix. The address is kept as a permanent redirect
 * because nav, footer and external links pointed here.
 */
export const Route = createFileRoute("/platform/secops")({
  beforeLoad: () => {
    throw redirect({ to: "/platform/code-security", statusCode: 301 });
  },
});
