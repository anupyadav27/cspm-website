import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Mail, ShieldAlert, Lock } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { cn } from "@/lib/utils";
import { seo } from "@/lib/seo";
import { submitLead } from "@/lib/lead-capture";

export const Route = createFileRoute("/company/contact")({
  head: () =>
    seo({
      title: "Contact — Onam Security",
      description:
        "Get in touch with Onam Security — general questions, pre-sales, security disclosure, and privacy.",
      path: "/company/contact",
    }),
  component: ContactPage,
});

const reasons = [
  "General question",
  "Pre-sales & pricing",
  "Security concern or second opinion",
  "Partner or integration enquiry",
  "Press or analyst",
];

const inboxes = [
  { icon: Mail, iconColor: "#2563EB", label: "General", email: "hello@onam.security", note: "For everything else." },
  { icon: ShieldAlert, iconColor: "#E32D25", label: "Security disclosure", email: "security@onam.security", note: "Report a vulnerability — see our disclosure policy." },
  { icon: Lock, iconColor: "#05A052", label: "Privacy", email: "privacy@onam.security", note: "Data subject requests and privacy questions." },
];

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", reason: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Please enter your name.";
    if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = "Please enter a valid email.";
    if (!form.reason) errs.reason = "Please pick a reason.";
    if (!form.message.trim()) errs.message = "Please write a short message.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // Only show success once the lead is actually persisted server-side.
    setSending(true);
    try {
      await submitLead({ data: { kind: "contact", ...form } });
      setSubmitted(true);
    } catch {
      setErrors({
        submit: "Something went wrong sending that. Please email sales@onamsecurity.com directly.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-[#E5E9F0] bg-white">
        <div className="absolute inset-0 dot-grid opacity-60" />
        <div className="absolute -top-40 right-1/4 w-[600px] h-[500px] rounded-full bg-[#2563EB]/10 blur-[140px] pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#64748B]">Contact</div>
          <h1 className="mt-5 font-display font-black text-[#0B1220] text-4xl md:text-5xl tracking-tight leading-[1.05]">
            Get in touch.
          </h1>
          <p className="mt-5 text-lg text-[#475569] max-w-2xl">
            One inbox for questions, one for disclosure, one for privacy — and a form below if you'd rather write us that way.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
          <div className="bg-white border border-[#E5E9F0] rounded-2xl p-8 shadow-[0_1px_2px_rgba(16,24,40,.04),0_12px_28px_rgba(16,24,40,.06)]">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-[#EFF4FF] grid place-items-center mx-auto">
                  <CheckCircle2 className="w-7 h-7 text-[#2563EB]" />
                </div>
                <h2 className="mt-5 font-display font-black text-[#0B1220] text-2xl tracking-tight">Message received.</h2>
                <p className="mt-3 text-[#475569]">Thanks — we'll get back to you within one business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#0B1220]">Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Alex Rivera"
                      className={cn("mt-1.5 w-full rounded-[10px] border bg-white px-3.5 py-2.5 text-sm text-[#0B1220] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500/30", errors.name ? "border-[#E32D25]" : "border-[#CBD5E1]")}
                    />
                    {errors.name && <p className="mt-1 text-xs text-[#E32D25]">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0B1220]">Work email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@company.com"
                      className={cn("mt-1.5 w-full rounded-[10px] border bg-white px-3.5 py-2.5 text-sm text-[#0B1220] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500/30", errors.email ? "border-[#E32D25]" : "border-[#CBD5E1]")}
                    />
                    {errors.email && <p className="mt-1 text-xs text-[#E32D25]">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0B1220]">Reason</label>
                  <select
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    className={cn("mt-1.5 w-full rounded-[10px] border bg-white px-3.5 py-2.5 text-sm text-[#0B1220] focus:outline-none focus:ring-2 focus:ring-blue-500/30", errors.reason ? "border-[#E32D25]" : "border-[#CBD5E1]")}
                  >
                    <option value="">Select one…</option>
                    {reasons.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {errors.reason && <p className="mt-1 text-xs text-[#E32D25]">{errors.reason}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0B1220]">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    placeholder="A short note about what you're looking for."
                    className={cn("mt-1.5 w-full rounded-[10px] border bg-white px-3.5 py-2.5 text-sm text-[#0B1220] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500/30", errors.message ? "border-[#E32D25]" : "border-[#CBD5E1]")}
                  />
                  {errors.message && <p className="mt-1 text-xs text-[#E32D25]">{errors.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full inline-flex justify-center items-center rounded-[10px] px-4 py-3 text-sm font-semibold bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-[0_1px_2px_rgba(16,24,40,.06),0_4px_10px_rgba(37,99,235,.20)] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? "Sending…" : "Send message"}
                </button>
                {errors.submit && (
                  <p className="text-xs text-[#E32D25] text-center">{errors.submit}</p>
                )}
              </form>
            )}
          </div>

          <aside className="space-y-4">
            {inboxes.map((i) => {
              const Icon = i.icon;
              return (
                <a
                  key={i.email}
                  href={`mailto:${i.email}`}
                  className="block bg-white border border-[#E5E9F0] rounded-2xl p-5 hover:border-[#2563EB] transition group"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-xl grid place-items-center shrink-0"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${i.iconColor} 12%, #FFFFFF)`,
                        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${i.iconColor} 22%, transparent)`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: i.iconColor }} />
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-widest font-bold text-[#64748B]">{i.label}</div>
                      <div className="mt-1 font-display font-bold text-[#0B1220] group-hover:text-[#2563EB] transition">{i.email}</div>
                      <p className="mt-1.5 text-sm text-[#475569] leading-relaxed">{i.note}</p>
                    </div>
                  </div>
                </a>
              );
            })}
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
