/**
 * Analytics consent — storage and state.
 *
 * GA4 sets cookies, so under GDPR/PECR it may not run in the EU/UK until the
 * visitor opts in. "Opt in" has a specific meaning: the tag must not load
 * before the choice is made, and declining must be exactly as easy as
 * accepting. A banner that merely announces cookies while the tracker is
 * already running is not consent — it is a notice, and it does not comply.
 *
 * So consent is stored here and the GA4 tag is injected from the client only
 * after a "granted" verdict — see `loadAnalytics()` in ./analytics. Nothing
 * about analytics is server-rendered into the document head.
 *
 * Deliberately localStorage and not a cookie: a consent cookie would itself be
 * a cookie set before consent. Strictly it would be exempt as "necessary", but
 * localStorage sidesteps the argument entirely and survives just as long.
 *
 * `null` means "not yet asked" and is distinct from "denied" — only `null`
 * shows the banner, so a visitor who declines is not asked again on the next
 * page.
 */

export type ConsentState = "granted" | "denied";

/** Bumping this re-asks everyone — use it if the set of tags materially changes. */
const STORAGE_KEY = "onam.analytics-consent.v1";

export function readConsent(): ConsentState | null {
  // Guard for SSR: this module is imported by a component that renders on the
  // server, where localStorage does not exist.
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === "granted" || raw === "denied" ? raw : null;
  } catch {
    // Safari private mode and hardened browsers throw on localStorage access.
    // Failing closed (treat as "not asked") is the privacy-safe default: worst
    // case the visitor sees the banner again, and no tag loads meanwhile.
    return null;
  }
}

export function writeConsent(state: ConsentState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, state);
  } catch {
    // If we cannot persist the choice we still honour it for this page view;
    // the banner simply returns on the next navigation.
  }
}
