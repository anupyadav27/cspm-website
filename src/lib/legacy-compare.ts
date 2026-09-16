import { redirect } from "@tanstack/react-router";

/**
 * 301 for the retired /compare/onam-vs-*.html addresses.
 *
 * From 2026-08-08 to 2026-09-14 those addresses served the competitor one-pagers copied
 * straight out of the marketing pipeline: 1400px fixed-width print cards with no
 * navigation, built to be rendered to PNG, never cleared as web pages. They were shared
 * on LinkedIn and linked from /resources, so the addresses must keep working — but the
 * page a visitor should land on is the real comparison route.
 *
 * A permanent redirect, not a stub page: search engines move the ranking to the target
 * and the duplicate "Onam vs Wiz" that competed with itself disappears from the index.
 * Each route file under src/routes/compare/*[.]html.tsx is one line calling this.
 */
export function legacyCompareRedirect(slug: string) {
  return () => {
    throw redirect({ to: "/compare/$slug", params: { slug }, statusCode: 301 });
  };
}
