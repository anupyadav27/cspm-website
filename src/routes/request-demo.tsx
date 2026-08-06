import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, MessageSquare, ShieldCheck, Timer, Users } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductDemo } from "@/components/site/DemoVideos";
import { cn } from "@/lib/utils";
import { seo } from "@/lib/seo";
import { submitLead } from "@/lib/lead-capture";

export const Route = createFileRoute("/request-demo")({
  head: () =>
    seo({
      title: "Request a demo — Onam Security",
      description:
        "Talk to a security engineer, not a sales rep. 45-minute focused demo of Onam in your own cloud.",
      path: "/request-demo",
    }),
  component: RequestDemo,
});

const clouds = ["AWS", "Azure", "GCP", "OCI", "AliCloud", "IBM", "Kubernetes"];
const reasons = [
  "Preparing for a compliance audit",
  "Recent security incident or concern",
  "Need to improve our cloud security posture",
  "CIEM — identity & access risk",
  "Vulnerability prioritisation",
  "Container / Kubernetes security",
  "Evaluating vendors",
];

const expectations = [
  { icon: Users, iconColor: "#2563EB", title: "You talk to a security engineer — not a sales rep", body: "Someone who has run actual cloud security assessments." },
  { icon: ShieldCheck, iconColor: "#05A052", title: "We scan a live account during the call (with your OK)", body: "Real findings from your real environment, not staged data." },
  { icon: Timer, iconColor: "#F2AF04", title: "45 minutes, focused on YOUR situation", body: "No deck, no generic walkthrough." },
  { icon: MessageSquare, iconColor: "#E32D25", title: "Zero pressure", body: "If Onam isn't a fit, we'll tell you honestly." },
];

function RequestDemo() {
  const [form, setForm] = useState({ email: "", name: "", company: "", reason: "", message: "" });
  const [selectedClouds, setSelectedClouds] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  /** Hidden honeypot field — see submitLead. */
  const [website, setWebsite] = useState("");

  const toggleCloud = (c: string) =>
    setSelectedClouds((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = "Please enter a valid work email.";
    if (!form.name.trim()) errs.name = "Please enter your name.";
    if (!form.company.trim()) errs.company = "Please enter your company.";
    if (selectedClouds.length === 0) errs.clouds = "Select at least one cloud.";
    if (!form.reason) errs.reason = "Please pick what brings you here.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // Only show success once the lead is actually persisted server-side.
    setSending(true);
    try {
      await submitLead({ data: { kind: "demo", ...form, clouds: selectedClouds, website } });
      setSubmitted(true);
    } catch {
      setErrors({
        submit: "Something went wrong sending that. Please email sales@onamsecurity.com and we'll pick it up.",
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
        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-20 grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#64748B]">Request a demo</div>
            <h1 className="mt-5 font-display font-black text-[#0B1220] text-4xl md:text-5xl tracking-tight leading-[1.05]">
              See Onam running against your own cloud in 45 minutes.
            </h1>
            <p className="mt-5 text-lg text-[#475569] leading-relaxed">
              No deck. No generic walkthrough. A working session with a security engineer who has spent their career finding what you're worried about.
            </p>
            <div className="mt-10 space-y-4">
              {expectations.map((e) => {
                const Icon = e.icon;
                return (
                  <div key={e.title} className="bg-white border border-[#E5E9F0] rounded-2xl p-5 flex gap-4 items-start shadow-[0_1px_2px_rgba(16,24,40,.04)]">
                    <div
                      className="w-10 h-10 rounded-xl grid place-items-center shrink-0"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${e.iconColor} 12%, #FFFFFF)`,
                        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${e.iconColor} 22%, transparent)`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: e.iconColor }} />
                    </div>
                    <div>
                      <div className="font-display font-bold text-[#0B1220]">{e.title}</div>
                      <p className="mt-1 text-sm text-[#475569] leading-relaxed">{e.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-[#E5E9F0] rounded-2xl p-8 shadow-[0_1px_2px_rgba(16,24,40,.04),0_12px_28px_rgba(16,24,40,.06)] lg:sticky lg:top-24">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-[#EFF4FF] grid place-items-center mx-auto">
                  <CheckCircle2 className="w-7 h-7 text-[#2563EB]" />
                </div>
                <h2 className="mt-5 font-display font-black text-[#0B1220] text-2xl tracking-tight">Thanks — you're in.</h2>
                <p className="mt-3 text-[#475569] leading-relaxed">
                  A security engineer will reach out within one business day to schedule your 45-minute session.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label className="block text-sm font-semibold text-[#0B1220]">Work email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@company.com"
                    className={cn(
                      "mt-1.5 w-full rounded-[10px] border bg-white px-3.5 py-2.5 text-sm text-[#0B1220] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500/30",
                      errors.email ? "border-[#E32D25]" : "border-[#CBD5E1]",
                    )}
                  />
                  {errors.email && <p className="mt-1 text-xs text-[#E32D25]">{errors.email}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#0B1220]">Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Alex Rivera"
                      className={cn(
                        "mt-1.5 w-full rounded-[10px] border bg-white px-3.5 py-2.5 text-sm text-[#0B1220] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500/30",
                        errors.name ? "border-[#E32D25]" : "border-[#CBD5E1]",
                      )}
                    />
                    {errors.name && <p className="mt-1 text-xs text-[#E32D25]">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0B1220]">Company</label>
                    <input
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Acme Corp"
                      className={cn(
                        "mt-1.5 w-full rounded-[10px] border bg-white px-3.5 py-2.5 text-sm text-[#0B1220] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500/30",
                        errors.company ? "border-[#E32D25]" : "border-[#CBD5E1]",
                      )}
                    />
                    {errors.company && <p className="mt-1 text-xs text-[#E32D25]">{errors.company}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0B1220]">Cloud provider(s)</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {clouds.map((c) => {
                      const active = selectedClouds.includes(c);
                      return (
                        <button
                          type="button"
                          key={c}
                          onClick={() => toggleCloud(c)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-semibold border transition",
                            active
                              ? "bg-[#2563EB] text-white border-[#2563EB]"
                              : "bg-white text-[#0B1220] border-[#CBD5E1] hover:border-[#94A3B8]",
                          )}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                  {errors.clouds && <p className="mt-1 text-xs text-[#E32D25]">{errors.clouds}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0B1220]">What brings you here?</label>
                  <select
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    className={cn(
                      "mt-1.5 w-full rounded-[10px] border bg-white px-3.5 py-2.5 text-sm text-[#0B1220] focus:outline-none focus:ring-2 focus:ring-blue-500/30",
                      errors.reason ? "border-[#E32D25]" : "border-[#CBD5E1]",
                    )}
                  >
                    <option value="">Select one…</option>
                    {reasons.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {errors.reason && <p className="mt-1 text-xs text-[#E32D25]">{errors.reason}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0B1220]">Anything else? <span className="text-[#94A3B8] font-normal">(optional)</span></label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={3}
                    placeholder="Tell us a bit about your environment or what you'd like to focus on."
                    className="mt-1.5 w-full rounded-[10px] border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#0B1220] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full inline-flex justify-center items-center rounded-[10px] px-4 py-3 text-sm font-semibold bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-[0_1px_2px_rgba(16,24,40,.06),0_4px_10px_rgba(37,99,235,.20)] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? "Sending…" : "Book my demo"}
                </button>
                {errors.submit && (
                  <p className="text-xs text-[#E32D25] text-center">{errors.submit}</p>
                )}
                {/* Honeypot: hidden from humans, irresistible to bots. */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
                />
                <p className="text-xs text-[#64748B] text-center">
                  By submitting, you agree to be contacted by a security engineer at Onam. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
      <ProductDemo
        compact
        clips={["dashboard", "scan", "attack"]}
        eyebrow="While you wait"
        title="The console you'll be looking at."
        gradientWords="looking at."
        subtitle="A preview of the live demo — the real Onam console running on a demo account."
      />
    </SiteLayout>
  );
}
