/**
 * "Talk to us" — a contact launcher fixed bottom-right on every page (owner request, 13 Nov 2026;
 * restyled 14 Nov 2026 to read like an enterprise sales contact panel).
 *
 * Step 1: the visitor picks what they need (demo, pricing, partnership, technical question).
 * Step 2: a short form (name, work email, company, message) that goes through the same lead capture as
 *         /company/contact — stored in S3 first, then emailed to sales@ with a copy to Anup.
 * Footer: direct email and WhatsApp.
 *
 * Deliberately not a live-chat widget yet: nobody can promise an answer within minutes, and an unanswered
 * chat window does more harm than a form with an honest reply time. It never opens on its own, loads no
 * third-party script and sets no cookie, so it needs no consent. It sits above the cookie banner (z-50).
 */

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Code2,
  Handshake,
  Mail,
  MessageSquare,
  MonitorPlay,
  Receipt,
  X,
} from "lucide-react";

import { submitLead } from "@/lib/lead-capture";

const WHATSAPP = "919871585677";
const SALES = "sales@onamsecurity.com";
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const NAVY = "#082869";

type Topic = { key: string; title: string; detail: string; icon: typeof Receipt };
const TOPICS: Topic[] = [
  { key: "pricing", title: "Pricing and plans", detail: "Get a quote for your cloud estate", icon: Receipt },
  { key: "partner", title: "Partner with us", detail: "MSSPs, resellers and cloud partners", icon: Handshake },
  { key: "technical", title: "Technical question", detail: "Clouds, integrations, deployment", icon: Code2 },
  { key: "other", title: "Something else", detail: "Anything we can help with", icon: MessageSquare },
];

function Mark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      <polygon points="40,6 48.5,40 40,74 31.5,40" fill={NAVY} />
      <polygon points="12,40 40,31.5 68,40 40,48.5" fill="#2563EB" />
      <circle cx="40" cy="40" r="3" fill="#FFFFFF" />
    </svg>
  );
}

export function TalkToUs() {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "", website: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  function reset() {
    setTopic(null);
    setState("idle");
    setError("");
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return setError("Please add your name.");
    if (!EMAIL_RE.test(form.email.trim())) return setError("Please add a valid work email.");
    if (!form.message.trim()) return setError("Please add a short message.");
    setError("");
    setState("sending");
    try {
      const page = typeof window !== "undefined" ? window.location.pathname : "";
      await submitLead({
        data: {
          kind: "contact",
          name: form.name,
          email: form.email,
          company: form.company,
          reason: `Talk to us: ${topic?.title ?? "General"}`,
          message: `${form.message}\n\n(Sent from the Talk to us panel on ${page || "/"})`,
          website: form.website,
        },
      });
      setState("sent");
    } catch {
      setState("error");
    }
  }

  const field =
    "mt-1.5 w-full rounded-md border border-[#D6DCE5] bg-white px-3 py-2 text-sm text-[#0B1220] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB]";
  const label = "block text-[13px] font-medium text-[#334155]";

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 print:hidden">
      {open && (
        <div
          role="dialog"
          aria-label="Talk to the Onam team"
          className="flex max-h-[calc(100vh-6.5rem)] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-xl border border-[#D6DCE5] bg-white shadow-[0_24px_64px_rgba(8,40,105,0.22)]"
        >
          {/* Header */}
          <div className="relative px-6 pb-6 pt-5 text-white" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1E3A8A 100%)` }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white">
                  <Mark className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold tracking-tight">Onam Security</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-md p-1 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <h2 className="mt-5 font-display text-[22px] font-semibold leading-tight tracking-tight !text-white">
              {state === "sent" ? "Thank you" : topic ? topic.title : "How can we help?"}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-white/75">
              Talk to a cloud security specialist. We reply within one business day.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {state === "sent" ? (
              <div className="px-6 py-10 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-[#16A34A]" />
                <p className="mt-4 font-semibold text-[#0B1220]">Your message is with our team.</p>
                <p className="mt-1.5 text-sm text-[#475569]">
                  We'll reply to {form.email || "you"} within one business day.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-6 text-sm font-semibold text-[#2563EB] hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : !topic ? (
              <div className="px-4 py-4">
                <Link
                  to="/request-demo"
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-3 rounded-lg bg-[#2563EB] px-4 py-3.5 text-white hover:bg-[#1D4ED8]"
                >
                  <MonitorPlay className="h-5 w-5 shrink-0" />
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">Book a demo</span>
                    <span className="block text-xs text-white/80">See Onam on your own cloud estate</span>
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <ul className="mt-3 divide-y divide-[#EEF1F5] rounded-lg border border-[#E5E9F0]">
                  {TOPICS.map((t) => (
                    <li key={t.key}>
                      <button
                        type="button"
                        onClick={() => setTopic(t)}
                        className="group flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#F8FAFC]"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#EFF4FF] text-[#2563EB]">
                          <t.icon className="h-4 w-4" />
                        </span>
                        <span className="flex-1">
                          <span className="block text-sm font-semibold text-[#0B1220]">{t.title}</span>
                          <span className="block text-xs text-[#64748B]">{t.detail}</span>
                        </span>
                        <ChevronRight className="h-4 w-4 text-[#94A3B8] group-hover:text-[#2563EB]" />
                      </button>
                    </li>
                  ))}
                </ul>
                {/* Job seekers were writing to sales (Nov 2026); send them straight to careers. */}
                <Link
                  to="/company/careers"
                  onClick={() => setOpen(false)}
                  className="mt-3 flex items-center justify-between px-1 text-xs text-[#64748B] hover:text-[#0B1220]"
                >
                  <span>Looking for a job? See open roles</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <form onSubmit={send} noValidate className="space-y-3.5 px-6 py-5">
                <button
                  type="button"
                  onClick={reset}
                  className="-mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#64748B] hover:text-[#0B1220]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> All topics
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <label className={label}>
                    Full name
                    <input className={field} value={form.name} autoComplete="name"
                      onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </label>
                  <label className={label}>
                    Company
                    <input className={field} value={form.company} autoComplete="organization"
                      onChange={(e) => setForm({ ...form, company: e.target.value })} />
                  </label>
                </div>
                <label className={label}>
                  Work email
                  <input className={field} type="email" value={form.email} autoComplete="email" placeholder="you@company.com"
                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </label>
                <label className={label}>
                  How can we help?
                  <textarea className={`${field} min-h-[92px] resize-y`} value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </label>
                {/* Honeypot: hidden from people, filled by bots. */}
                <input tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden"
                  value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                {error && <p className="text-xs text-[#DC2626]">{error}</p>}
                {state === "error" && (
                  <p className="text-xs text-[#DC2626]">
                    Sorry, that didn't send. Please email <a className="underline" href={`mailto:${SALES}`}>{SALES}</a>.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                  style={{ background: NAVY }}
                >
                  {state === "sending" ? "Sending…" : "Send to our team"}
                  {state !== "sending" && <ArrowRight className="h-4 w-4" />}
                </button>
                <p className="text-[11px] leading-relaxed text-[#64748B]">
                  We use these details only to reply to you. See our{" "}
                  <Link to="/company/privacy" className="underline hover:text-[#0B1220]" onClick={() => setOpen(false)}>
                    privacy policy
                  </Link>
                  .
                </p>
              </form>
            )}
          </div>

          {/* Direct contact */}
          <div className="flex items-center justify-between gap-3 border-t border-[#E5E9F0] bg-[#F8FAFC] px-6 py-3 text-xs">
            <a href={`mailto:${SALES}`} className="inline-flex items-center gap-1.5 font-medium text-[#334155] hover:text-[#2563EB]">
              <Mail className="h-3.5 w-3.5" /> {SALES}
            </a>
            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hello Onam team, ")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#15803D] hover:underline"
            >
              WhatsApp
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close contact panel" : "Talk to our team"}
        className="group inline-flex items-center gap-2.5 rounded-full py-2 pl-2 pr-5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(8,40,105,0.35)] transition-transform hover:-translate-y-0.5"
        style={{ background: NAVY }}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
          {open ? <X className="h-4 w-4 text-[#082869]" /> : <Mark className="h-5 w-5" />}
        </span>
        {open ? "Close" : "Talk to our team"}
      </button>
    </div>
  );
}
