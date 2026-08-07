import { useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitLead } from "@/lib/lead-capture";

/**
 * Low-friction email capture for the resource library.
 *
 * Deliberately NOT a gate. The whitepapers stay directly downloadable — they
 * are indexable that way, and walling off content that can rank is a bad
 * trade for a site with no authority yet. This sits alongside the downloads
 * for people who want to hear about new research, which is the only
 * commitment level between "read a page" and "book a sales call".
 *
 * Submits through the same `submitLead` pipeline as the demo and contact
 * forms — S3 first, email notification best-effort — so there is one lead
 * path to maintain, not three.
 */
export function ResourceSignup() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setState("error");
      return;
    }
    setState("sending");
    try {
      await submitLead({ data: { kind: "subscribe", email, name: "", website } });
      setState("done");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-[#DBE7FE] bg-[#F5F8FF] p-6 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
        <div>
          <div className="font-display font-bold text-[#0B1220]">You're on the list.</div>
          <p className="mt-1 text-sm text-[#475569]">
            We'll send new research as it's published — no more than monthly, and nothing else.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E5E9F0] bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,.04)]">
      <div className="flex items-center gap-2">
        <Mail className="w-4 h-4 text-[#2563EB]" />
        <div className="font-display font-bold text-[#0B1220]">Get new research by email</div>
      </div>
      <p className="mt-1.5 text-sm text-[#475569] leading-relaxed">
        Everything above is free to download, no form required. If you'd like the next whitepaper
        when it lands, leave an address.
      </p>
      <form onSubmit={onSubmit} className="mt-4 flex flex-col sm:flex-row gap-2.5" noValidate>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          placeholder="you@company.com"
          aria-label="Work email"
          className={cn(
            "flex-1 rounded-[10px] border bg-white px-3.5 py-2.5 text-sm text-[#0B1220] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500/30",
            state === "error" ? "border-[#E32D25]" : "border-[#CBD5E1]",
          )}
        />
        {/* Honeypot — hidden from humans. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex justify-center items-center rounded-[10px] px-4 py-2.5 text-sm font-semibold bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
        >
          {state === "sending" ? "Adding…" : "Keep me posted"}
        </button>
      </form>
      {state === "error" && (
        <p className="mt-2 text-xs text-[#E32D25]">
          That didn't go through. Check the address, or email sales@onamsecurity.com.
        </p>
      )}
    </div>
  );
}
