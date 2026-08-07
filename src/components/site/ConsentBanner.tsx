/**
 * Cookie consent banner — shown only when the configured analytics provider
 * actually sets cookies (today: GA4).
 *
 * Three rules this implementation exists to satisfy, all of which a decorative
 * "we use cookies" bar fails:
 *
 *  1. Nothing loads before the choice. The GA4 tag is injected by
 *     `loadAnalytics()` after a "granted" verdict, never from the document head.
 *  2. Declining is exactly as easy as accepting — one click, same size, same
 *     prominence, neither styled to be the obvious path.
 *  3. The choice persists, and declining is remembered. Only an unanswered
 *     visitor (`null`) sees the banner.
 *
 * Switching ANALYTICS to Plausible or "none" makes this render nothing, with no
 * other change needed — `analyticsNeedsConsent()` is the single switch.
 */

import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

import { analyticsNeedsConsent, loadAnalytics } from "../../lib/analytics";
import { readConsent, writeConsent, type ConsentState } from "../../lib/consent";

/**
 * "unknown" is the pre-hydration value. The server cannot read localStorage, so
 * it must render the same nothing the client renders on its first pass —
 * otherwise React reports a hydration mismatch and the banner flashes.
 */
type Resolved = ConsentState | null | "unknown";

export function ConsentBanner() {
  const [consent, setConsent] = useState<Resolved>("unknown");

  useEffect(() => {
    if (!analyticsNeedsConsent()) return;
    const stored = readConsent();
    setConsent(stored);
    // A returning visitor who already agreed gets the tag without being asked
    // again; loadAnalytics re-checks consent itself, so this cannot leak.
    if (stored === "granted") loadAnalytics();
  }, []);

  function decide(state: ConsentState) {
    writeConsent(state);
    setConsent(state);
    if (state === "granted") loadAnalytics();
  }

  if (!analyticsNeedsConsent()) return null;
  if (consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E5E9F0] bg-white/95 backdrop-blur-sm shadow-[0_-4px_24px_rgba(11,18,32,0.08)]"
    >
      <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-relaxed text-[#475569]">
          We use Google Analytics to understand which pages are useful. It sets cookies, so we only
          load it if you agree. Decline and nothing is loaded — the site works the same.{" "}
          <Link
            to="/company/privacy"
            className="text-[#2563EB] font-semibold hover:underline whitespace-nowrap"
          >
            Privacy Policy
          </Link>
        </p>

        {/* Equal weight is a legal requirement, not a style choice: if declining
            is visibly harder than accepting, the consent is not freely given. */}
        <div className="flex gap-3 shrink-0">
          <button
            type="button"
            onClick={() => decide("denied")}
            className="flex-1 md:flex-none px-5 py-2.5 rounded-lg border border-[#CBD5E1] text-sm font-semibold text-[#0B1220] hover:bg-[#F1F5F9] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => decide("granted")}
            className="flex-1 md:flex-none px-5 py-2.5 rounded-lg border border-[#CBD5E1] text-sm font-semibold text-[#0B1220] hover:bg-[#F1F5F9] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
