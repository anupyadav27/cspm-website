import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * 301 for the retired /company/security page.
 *
 * Replaced on 2026-10-05 by the Trust Center at /trust, which is checked against the
 * product repository line by line. The old page made claims that were not true of the
 * product — per-tenant HSM-backed keys, an annual third-party penetration test, "no
 * credential storage", "never writes to your cloud" — and must not come back. The address
 * is kept as a permanent redirect because the footer, the privacy policy and external
 * links pointed here.
 */
export const Route = createFileRoute("/company/security")({
  beforeLoad: () => {
    throw redirect({ to: "/trust", statusCode: 301 });
  },
});
