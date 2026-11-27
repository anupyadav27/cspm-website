/**
 * Where a lead came from: the page that sent the visitor to the form, the first page of
 * their visit, and any UTM tags (conversion audit F4, 27 Nov 2026).
 *
 * Three values travel with every form submission (see `submitLead` in ./lead-capture,
 * which fills them in when a form does not):
 *
 *  - `page`:    the page that sent the visitor to the form. The CTA's `?from=` wins; then
 *               the previous page of this visit on our own site; then the external
 *               referrer. `document.referrer` alone is not enough: in a single-page app it
 *               stays the first external referrer for the whole visit.
 *  - `landing`: the first page of this visit, plus the external site that sent them, so a
 *               visitor who lands on a blog post and converts three pages later is credited
 *               to the blog post.
 *  - `utm`:     UTM tags on the current URL, else the ones the visit started with.
 *
 * Storage is sessionStorage only: it is first-party, ends with the tab, is never read by a
 * third party, and leaves the browser only inside a form the visitor chooses to send. Every
 * access is wrapped, because private modes and hardened browsers throw; the form still
 * works, with less attribution.
 *
 * The functions without "window" in them are pure, so scripts/test-lead-capture.ts can
 * test them in Node.
 */

export type LeadSource = { page: string; utm: string; landing: string };

/** What the visit remembers between pages. */
export type VisitState = {
  /** First path (with query) of the visit. */
  landing: string;
  /** Host of the external site that sent the visitor, if any. */
  referrer: string;
  /** UTM tags the visit started with. */
  utm: string;
  /** The path before the current one, on our own site. */
  prev: string;
  /** The current path. */
  current: string;
};

const STORAGE_KEY = "onam.lead-source.v1";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

/** `utm_source=x&utm_medium=y` from a query string, or "". */
export function utmFrom(search: string): string {
  const q = new URLSearchParams(search);
  return UTM_KEYS.map((k) => (q.get(k) ? `${k}=${q.get(k)}` : ""))
    .filter(Boolean)
    .join("&")
    .slice(0, 300);
}

/** The referrer's host when it is another site; "" for none, our own site or junk. */
export function externalHost(referrer: string, ownHost: string): string {
  if (!referrer) return "";
  try {
    const host = new URL(referrer).hostname;
    const bare = (h: string) => h.replace(/^www\./, "");
    return bare(host) === bare(ownHost) ? "" : host;
  } catch {
    return "";
  }
}

/** The visit state after arriving at `path`. Pure: the caller reads and writes storage. */
export function nextVisit(
  prev: VisitState | null,
  at: { path: string; search: string },
  referrer: string,
  ownHost: string,
): VisitState {
  if (!prev) {
    return {
      landing: `${at.path}${at.search}`.slice(0, 500),
      referrer: externalHost(referrer, ownHost),
      utm: utmFrom(at.search),
      prev: "",
      current: at.path,
    };
  }
  if (prev.current === at.path) return prev;
  return { ...prev, utm: prev.utm || utmFrom(at.search), prev: prev.current, current: at.path };
}

/** The three lead fields, from the current URL, the visit state and the referrer. Pure. */
export function sourceFor(
  at: { path: string; search: string },
  visit: VisitState | null,
  referrer: string,
  ownHost: string,
): LeadSource {
  const q = new URLSearchParams(at.search);
  const from = q.get("from") || "";
  const ext = externalHost(referrer, ownHost);
  // `visit.prev` is only trusted if the visit state is for this page.
  const prevPage = visit && visit.current === at.path ? visit.prev : "";
  const page = (from || prevPage || (ext ? referrer : "")).slice(0, 500);
  const utm = utmFrom(at.search) || visit?.utm || "";
  const landing = visit
    ? `${visit.landing}${visit.referrer ? ` (referred by ${visit.referrer})` : ""}`.slice(0, 500)
    : "";
  return { page, utm, landing };
}

function readVisit(): VisitState | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<VisitState>;
    return typeof v.landing === "string" && typeof v.current === "string"
      ? {
          landing: v.landing,
          current: v.current,
          referrer: v.referrer ?? "",
          utm: v.utm ?? "",
          prev: v.prev ?? "",
        }
      : null;
  } catch {
    return null;
  }
}

/**
 * Record a page view in the visit state. Call on every route change from a component
 * that is mounted on every page (TalkToUs does this).
 */
export function recordVisitInWindow(): void {
  if (typeof window === "undefined") return;
  const next = nextVisit(
    readVisit(),
    { path: window.location.pathname, search: window.location.search },
    document.referrer,
    window.location.hostname,
  );
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage blocked: the form still sends `?from=` and the referrer.
  }
}

/** The lead fields for a form on the current page. Empty strings on the server. */
export function leadSourceFromWindow(): LeadSource {
  if (typeof window === "undefined") return { page: "", utm: "", landing: "" };
  const at = { path: window.location.pathname, search: window.location.search };
  // Make sure the current page is in the visit state, even if the tracker has not run yet.
  recordVisitInWindow();
  return sourceFor(at, readVisit(), document.referrer, window.location.hostname);
}
