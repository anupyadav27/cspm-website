/**
 * Pure helpers for inbound lead handling, kept apart from the server function in
 * lead-capture.ts so they can be tested without a server runtime
 * (scripts/test-lead-capture.ts).
 *
 *  - replyByDate:  the next working day (Mon–Fri) in India time, for the internal
 *                  notification's "Reply by" line.
 *  - routeTag:     demo / audit / partner / investor / other, from the form and the
 *                  message, so the reply goes to the right template in the playbook.
 *  - ackEmail:     the short plain acknowledgement sent to the visitor.
 *  - AckThrottle:  at most one acknowledgement per address per window, so the form
 *                  cannot be used to flood someone's inbox with our mail.
 */

export type LeadKind = "demo" | "audit" | "contact" | "subscribe" | "free";
export type RouteTag = "demo" | "audit" | "partner" | "investor" | "free" | "other";

/** India Standard Time is UTC+5:30 all year (no daylight saving). */
const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * The next working day after `now`, as a calendar date in IST.
 * A lead on Friday (or at the weekend) is due on Monday. Public holidays are not
 * modelled; the playbook says to treat them as working days for this promise.
 * Returns the IST calendar date as a UTC-midnight Date plus a display label.
 */
export function replyByDate(now: Date): { date: Date; label: string } {
  const ist = new Date(now.getTime() + IST_OFFSET_MS);
  const d = new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate()));
  do {
    d.setUTCDate(d.getUTCDate() + 1);
  } while (d.getUTCDay() === 0 || d.getUTCDay() === 6);
  const label = `${DAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}, end of day IST`;
  return { date: d, label };
}

const INVESTOR_RE =
  /\b(investors?|investing in (onam|you|your company)|funding round|fundrais\w*|venture capital|vc fund|\bvc\b|angel investor|seed round|pre-seed|cap table|term sheet)\b/i;
const PARTNER_RE =
  /\b(partner(s|ship|ships)?|resell(er|ers|ing)?|msp|mssp|alliance|white[- ]label|referral|distributor|system integrator)\b/i;
const AUDIT_RE = /\b(audit scan|free scan|free audit|one-time audit|second opinion)\b/i;
const DEMO_RE = /\b(demo|walkthrough|walk-through)\b/i;

/**
 * Best guess at what the enquiry is, for the internal email only. Investor and
 * partner win over the form used, because a partner often fills in the demo form.
 */
export function routeTag(input: { kind: LeadKind; reason?: string; message?: string; title?: string }): RouteTag {
  const text = `${input.reason ?? ""}\n${input.message ?? ""}`;
  if (INVESTOR_RE.test(text)) return "investor";
  if (/partner/i.test(input.reason ?? "") || PARTNER_RE.test(input.message ?? "")) return "partner";
  if (input.kind === "free") return "free";
  if (input.kind === "audit") return "audit";
  if (input.kind === "demo") return "demo";
  if (AUDIT_RE.test(text)) return "audit";
  if (DEMO_RE.test(text) || /pre-sales|pricing/i.test(input.reason ?? "")) return "demo";
  return "other";
}

/** Only these forms get an acknowledgement; a newsletter signup does not. */
export function wantsAck(kind: LeadKind): boolean {
  return kind === "demo" || kind === "audit" || kind === "contact" || kind === "free";
}

function firstName(name: string): string {
  const first = name.trim().split(/\s+/)[0] ?? "";
  return first.length > 0 && first.length <= 40 ? first : "";
}

/** The short, plain acknowledgement. `bookingUrl` adds the booking line only when set. */
export function ackEmail(
  input: { kind: LeadKind; name: string },
  bookingUrl?: string,
): { subject: string; body: string } {
  const hello = firstName(input.name) ? `Hello ${firstName(input.name)},` : "Hello,";
  const asked =
    input.kind === "free"
      ? "signing up for Onam's free plan"
      : input.kind === "audit"
      ? "asking for a free audit scan"
      : input.kind === "demo"
        ? "asking for a demo of Onam"
        : "getting in touch";

  const next: string[] =
    input.kind === "free"
      ? [
          "- We create your Onam workspace on the free plan (up to 50 units, read-only scanning) and email your login details to this address.",
          "- You connect a cloud account with a read-only role. You can read every permission before you deploy it, and nothing is installed.",
          "- If you would like, we walk you through your first results on a short call.",
          "- There is no charge and no card. You can move to a paid plan when you need more.",
        ]
      : input.kind === "audit"
      ? [
          "- A short scoping call to agree which cloud account we scan and what is in scope.",
          "- We send you a template to run in your own account. You can read every permission before you deploy it.",
          "- The scan runs once. Then we go through the findings with you in a 45-minute readout, and you keep the report.",
          "- There is no charge and no commitment.",
        ]
      : input.kind === "demo"
        ? [
            "- We agree a time for a 45-minute session, starting from the question you came with.",
            "- With your OK we can look at your own cloud during the call. If you would rather not, we use a demo account.",
          ]
        : ["- Anup reads your message and replies to you by email."];

  const url = bookingUrl?.trim();
  const lines = [
    hello,
    "",
    `Thank you for ${asked}. We have your request.`,
    "",
    "Anup, Onam's founder, will reply to you himself within one working day.",
    "",
    "What happens next:",
    ...next,
    ...(url ? ["", `If you would like to pick a time now: ${url}`] : []),
    "",
    "If you have anything to add, just reply to this email.",
    "",
    "Onam Security",
    "sales@onamsecurity.com · https://www.onamsecurity.com",
    "",
    "You are receiving this one email because this address was entered on a form at onamsecurity.com. If that was not you, please ignore it.",
  ];

  const subject =
    input.kind === "free"
      ? "Your Onam free plan: we are setting it up"
      : input.kind === "audit"
      ? "Your audit scan request: we have it"
      : input.kind === "demo"
        ? "Your demo request: we have it"
        : "Your message to Onam: we have it";

  return { subject, body: lines.join("\n") };
}

/**
 * In-memory, per-process limit: one acknowledgement per address per window.
 * Not a security boundary (each pod has its own map, and a restart clears it),
 * but enough to stop a repeated submission turning into repeated mail.
 */
export class AckThrottle {
  private seen = new Map<string, number>();
  constructor(
    private windowMs = 24 * 60 * 60 * 1000,
    private max = 5000,
  ) {}

  /** True if an acknowledgement may be sent now; records it if so. */
  allow(email: string, now = Date.now()): boolean {
    const key = email.trim().toLowerCase();
    const last = this.seen.get(key);
    if (last !== undefined && now - last < this.windowMs) return false;
    if (this.seen.size >= this.max) {
      for (const [k, t] of this.seen) if (now - t >= this.windowMs) this.seen.delete(k);
      if (this.seen.size >= this.max) this.seen.clear();
    }
    this.seen.set(key, now);
    return true;
  }
}
