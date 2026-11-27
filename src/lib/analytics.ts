/**
 * Site analytics.
 *
 * Search Console shows pre-click data (impressions, positions, queries) and
 * nothing about what happens after someone lands: which pages hold attention,
 * where they drop, what precedes a demo request. This fills that in.
 *
 * To change provider, set ANALYTICS below to one of:
 *
 *   { provider: "none" }                            // nothing loads at all
 *   { provider: "plausible" }                       // no cookies, no banner
 *   { provider: "ga4", measurementId: "G-XXXXXXX" } // cookies, needs consent
 *
 * The provider decides whether a consent banner appears. Plausible sets no
 * cookies, so it is exempt from GDPR/PECR consent and loads immediately from
 * the document head. GA4 does set cookies, so it must not load until the
 * visitor opts in — see ./consent and ConsentBanner.
 *
 * That asymmetry is the whole reason for the two code paths below. Do not
 * "simplify" them into one: server-rendering the GA4 tag is exactly the bug
 * that makes a consent banner decorative.
 */

import { readConsent } from "./consent";

export type AnalyticsConfig =
  | { provider: "none" }
  | { provider: "plausible"; domain?: string }
  | { provider: "ga4"; measurementId: string };

export const ANALYTICS: AnalyticsConfig = {
  provider: "ga4",
  measurementId: "G-9PBXSJ69NH",
};

/** True when the configured provider sets cookies and therefore needs opt-in. */
export function analyticsNeedsConsent(): boolean {
  return ANALYTICS.provider === "ga4";
}

/**
 * Script tags rendered into the document head on every response.
 *
 * Consent-free providers only. GA4 returns nothing here by design — it is
 * injected from the client after opt-in by `loadAnalytics()`.
 */
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

  return [];
}

/** Set once the tag has been injected, so remounts and re-renders cannot double-count. */
let loaded = false;

/**
 * Inject the consent-gated tag. Safe to call repeatedly and safe to call
 * without consent — it checks, and does nothing unless the answer is "granted".
 *
 * SPA route changes are covered by GA4 enhanced measurement, which listens to
 * History API events by default, so there is no manual page_view to send here.
 */
export function loadAnalytics(): void {
  if (loaded) return;
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (ANALYTICS.provider !== "ga4") return;
  if (readConsent() !== "granted") return;

  loaded = true;
  const id = ANALYTICS.measurementId;

  const tag = document.createElement("script");
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(tag);

  gtag("js", new Date());
  gtag("config", id);
}

/**
 * gtag pushes to dataLayer synchronously; the queue is drained once the async
 * script arrives, so calls made before it loads are not lost.
 *
 * This MUST push the `arguments` object, not a rest-parameter array. gtag.js
 * treats an Arguments object as a gtag command and a plain array as a raw
 * dataLayer entry, so `push([...args])` silently records nothing. That is why
 * this is a function declaration rather than an arrow.
 */
function gtag(..._args: unknown[]) {
  const w = window as unknown as { dataLayer?: IArguments[] };
  w.dataLayer = w.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  w.dataLayer.push(arguments);
}

/** A path or host short enough for a GA4 parameter (100 characters), with no query string. */
function shortSource(source: string): string {
  if (!source) return "(direct)";
  try {
    const u = new URL(source, "https://www.onamsecurity.com");
    const own = /(^|\.)onamsecurity\.com$/.test(u.hostname);
    return (own ? u.pathname : u.hostname).slice(0, 100);
  } catch {
    return source.split("?")[0].slice(0, 100);
  }
}

/**
 * Count a completed form as a GA4 `generate_lead` event (conversion audit F4).
 *
 * Consent is checked here, at the moment of the event: with GA4 nothing is sent
 * unless the visitor said yes. No personal data goes in the event — only which
 * form it was and the page (path or referring host) that sent the visitor.
 * Called by `submitLead` after the server has stored the lead.
 */
export function trackLead(form: string, source = ""): void {
  if (typeof window === "undefined") return;
  const params = { form_kind: form.slice(0, 40), lead_source: shortSource(source) };

  if (ANALYTICS.provider === "plausible") {
    const w = window as unknown as { plausible?: (e: string, o?: unknown) => void };
    w.plausible?.("generate_lead", { props: params });
    return;
  }
  if (ANALYTICS.provider !== "ga4") return;
  if (readConsent() !== "granted") return;
  loadAnalytics();
  gtag("event", "generate_lead", params);
}
