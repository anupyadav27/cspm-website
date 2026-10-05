import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * /security was linked from older pages and is still in Google's index as a 404.
 * The security story now lives at /trust.
 */
export const Route = createFileRoute("/security")({
  beforeLoad: () => {
    throw redirect({ to: "/trust", statusCode: 301 });
  },
});
