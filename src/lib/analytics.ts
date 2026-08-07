/**
 * Site analytics — off by default.
 *
 * The site had no analytics of any kind. Search Console shows pre-click data
 * (impressions, positions, queries) and nothing about what happens after
 * someone lands: which pages hold attention, where they drop, what precedes a
 * demo request. Everything shipped this month is unmeasurable on-site without
 * this.
 *
 * To switch on, set ANALYTICS below to one of:
 *
 *   { provider: "plausible" }                       // recommended
 *   { provider: "ga4", measurementId: "G-XXXXXXX" }
 *
 * Plausible is the recommendation for a security brand: no cookies, so no
 * consent banner is required in the EU, and the banner itself costs
 * conversions. It is ~$9/mo and needs an account at plausible.io with
 * onamsecurity.com added as a site. GA4 is free and deeper, but sets cookies
 * and therefore requires a consent banner to be lawful in the EU/UK.
 *
 * Nothing is emitted while provider is "none" — no script tag, no third-party
 * request. That is deliberate: shipping a tracker before the account exists
 * would add a request on every page load that does nothing.
 */

export type AnalyticsConfig =
  | { provider: "none" }
  | { provider: "plausible"; domain?: string }
  | { provider: "ga4"; measurementId: string };

export const ANALYTICS: AnalyticsConfig = { provider: "none" };

/** Script tags for the configured provider, in TanStack `head.scripts` shape. */
export function analyticsScripts(): Array<Record<string, unknown>> {
  if (ANALYTICS.provider === "plausible") {
    return [
      {
        defer: true,
        "data-domain": ANALYTICS.domain ?? "onamsecurity.com",
        src: "https://plausible.io/js/script.js",
      },
    ];
  }

  if (ANALYTICS.provider === "ga4") {
    return [
      { async: true, src: `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS.measurementId}` },
      {
        children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${ANALYTICS.measurementId}');`,
      },
    ];
  }

  return [];
}
