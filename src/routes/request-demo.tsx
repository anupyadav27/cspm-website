import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, MessageSquare, Timer, Users, Cloud, CalendarCheck } from "@/components/site/icons";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductDemo } from "@/components/site/DemoVideos";
import { Backdrop, IconTile } from "@/components/site/system";
import { cn } from "@/lib/utils";
import { seo } from "@/lib/seo";
import { submitLead } from "@/lib/lead-capture";
import { SUITE, type SuiteKey } from "@/data/product-suite";

const PRODUCT_KEYS: SuiteKey[] = ["security", "aiops"];

type DemoSearch = { product?: SuiteKey };

export const Route = createFileRoute("/request-demo")({
  validateSearch: (search: Record<string, unknown>): DemoSearch => {
    const raw = typeof search.product === "string" ? search.product.toLowerCase() : "";
    return PRODUCT_KEYS.includes(raw as SuiteKey) ? { product: raw as SuiteKey } : {};
  },
  head: () =>
    seo({
      title: "Request a demo — Onam",
      description:
        "Book a 45-minute demo of Onam Security or Onam AI, your AI security analyst, with someone who knows the product. No deck, no generic walkthrough.",
      path: "/request-demo",
    }),
  component: RequestDemo,
});

const clouds = ["AWS", "Azure", "GCP", "OCI", "AliCloud", "IBM", "Kubernetes"];

/** Cloud accounts, subscriptions or projects in scope — sizes the call and the quote. */
const SIZES = ["1–10 accounts", "11–50 accounts", "51–200 accounts", "More than 200 accounts", "Not sure yet"];
/** Used to schedule the call in the visitor's working hours. */
const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "United Arab Emirates",
  "Saudi Arabia",
  "Singapore",
  "Australia",
  "Canada",
  "Germany",
  "Other",
];

const expectations = [
  {
    icon: Users,
    iconColor: "#2563EB",
    title: "Talk to someone who knows the product you picked",
    body: "Not a sales script. The person on the call works with that product and the problem it solves.",
  },
  {
    icon: Cloud,
    iconColor: "#059669",
    title: "Your environment, if you want it",
    body: "With your OK, we look at your own cloud during the call rather than staged data. If you would rather not, we use a demo account.",
  },
  {
    icon: Timer,
    iconColor: "#D97706",
    title: "45 minutes, focused on your situation",
    body: "No deck, no generic walkthrough. We start from the question you came with.",
  },
  {
    icon: MessageSquare,
    iconColor: "#7C3AED",
    title: "Zero pressure",
    body: "If Onam isn't a fit, we'll tell you honestly.",
  },
];

const inputCls =
  "mt-1.5 w-full rounded-[10px] border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30";

function RequestDemo() {
  const { product } = Route.useSearch();
  const [form, setForm] = useState({ email: "", name: "", title: "", company: "", country: "", size: "", message: "" });
  const [selectedClouds, setSelectedClouds] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SuiteKey[]>(product ? [product] : []);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  /** Hidden honeypot field — see submitLead. */
  const [website, setWebsite] = useState("");

  const toggleCloud = (c: string) =>
    setSelectedClouds((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const toggleProduct = (k: SuiteKey) =>
    setSelectedProducts((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  const picked = SUITE.filter((s) => selectedProducts.includes(s.key));
  const heading =
    picked.length === 1
      ? `See ${picked[0].name} on your own cloud in 45 minutes.`
      : "See Onam running against your own cloud in 45 minutes.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = "Please enter a valid work email.";
    if (!form.name.trim()) errs.name = "Please enter your name.";
    if (!form.company.trim()) errs.company = "Please enter your company.";
    if (!form.country) errs.country = "Please pick your country.";
    if (selectedClouds.length === 0) errs.clouds = "Select at least one cloud.";
    if (!form.size) errs.size = "Please pick a size.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // Only show success once the lead is actually persisted server-side.
    setSending(true);
    try {
      await submitLead({
        data: {
          kind: "demo",
          ...form,
          // No product picked means the visitor wants the whole platform.
          products: selectedProducts.length ? selectedProducts : PRODUCT_KEYS,
          clouds: selectedClouds,
          website,
        },
      });
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
      <section className="relative overflow-hidden border-b border-line bg-white">
        <Backdrop tone="light" color="#2563EB" pattern="grid" icon={CalendarCheck} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 md:pt-24 md:pb-20 grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-500">Request a demo</div>
            <h1 className="mt-5 font-display font-black text-ink text-4xl md:text-5xl tracking-tight leading-[1.05]">
              {heading}
            </h1>
            <p className="mt-5 text-lg text-body leading-relaxed">
              No deck. No generic walkthrough. A working session with someone who knows the product —
              cloud, SaaS and code security, or Onam AI, your AI security analyst — and the problem it is
              meant to solve.
            </p>
            <p className="mt-4 text-sm text-body leading-relaxed">
              Would you rather see findings from one of your own cloud accounts first?{" "}
              <Link to="/audit-scan" className="text-brand-500 font-semibold hover:underline">
                Ask for a free audit scan
              </Link>
              . One account, once, at no charge.
            </p>
            <div className="mt-10 space-y-4">
              {expectations.map((e) => (
                <div
                  key={e.title}
                  className="bg-white border border-line rounded-2xl p-5 flex gap-4 items-start shadow-[0_1px_2px_rgba(16,24,40,.04)]"
                >
                  <IconTile icon={e.icon} color={e.iconColor} />
                  <div>
                    <div className="font-display font-bold text-ink">{e.title}</div>
                    <p className="mt-1 text-sm text-body leading-relaxed">{e.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-line rounded-2xl p-6 sm:p-8 shadow-[0_1px_2px_rgba(16,24,40,.04),0_12px_28px_rgba(16,24,40,.06)] lg:sticky lg:top-24">
            {submitted ? (
              <div className="text-center py-8" role="status">
                <div className="w-14 h-14 rounded-full bg-tint-blue grid place-items-center mx-auto">
                  <CheckCircle2 className="w-7 h-7 text-brand-500" />
                </div>
                <h2 className="mt-5 font-display font-black text-ink text-2xl tracking-tight">Thanks — you're in.</h2>
                <p className="mt-3 text-body leading-relaxed">
                  Someone who knows {picked.length === 1 ? picked[0].name : "the products you picked"} will reach out
                  within one business day to schedule your 45-minute session.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Order (owner, 14 Nov 2026): who you are, then your cloud, then optional notes. */}
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-500">1 · About you</div>
                <div>
                  <label htmlFor="demo-email" className="block text-sm font-semibold text-ink">Work email</label>
                  <input
                    id="demo-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@company.com"
                    className={cn(inputCls, errors.email ? "border-[#E32D25]" : "border-[#CBD5E1]")}
                  />
                  {errors.email && <p className="mt-1 text-xs text-[#C81E1E]">{errors.email}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="demo-name" className="block text-sm font-semibold text-ink">Name</label>
                    <input
                      id="demo-name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Alex Rivera"
                      className={cn(inputCls, errors.name ? "border-[#E32D25]" : "border-[#CBD5E1]")}
                    />
                    {errors.name && <p className="mt-1 text-xs text-[#C81E1E]">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="demo-title" className="block text-sm font-semibold text-ink">
                      Job title <span className="text-muted-500 font-normal">(optional)</span>
                    </label>
                    <input
                      id="demo-title"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Head of Cloud Security"
                      className={cn(inputCls, "border-[#CBD5E1]")}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="demo-company" className="block text-sm font-semibold text-ink">Company</label>
                    <input
                      id="demo-company"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Acme Corp"
                      className={cn(inputCls, errors.company ? "border-[#E32D25]" : "border-[#CBD5E1]")}
                    />
                    {errors.company && <p className="mt-1 text-xs text-[#C81E1E]">{errors.company}</p>}
                  </div>
                  <div>
                    <label htmlFor="demo-country" className="block text-sm font-semibold text-ink">Country</label>
                    <select
                      id="demo-country"
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      className={cn(inputCls, errors.country ? "border-[#E32D25]" : "border-[#CBD5E1]")}
                    >
                      <option value="">Select…</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {errors.country && <p className="mt-1 text-xs text-[#C81E1E]">{errors.country}</p>}
                  </div>
                </div>

                <div className="pt-2 text-xs font-bold uppercase tracking-[0.16em] text-muted-500">2 · Your cloud</div>
                <fieldset>
                  <legend className="block text-sm font-semibold text-ink">Cloud provider(s)</legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {clouds.map((c) => {
                      const active = selectedClouds.includes(c);
                      return (
                        <button
                          type="button"
                          key={c}
                          aria-pressed={active}
                          onClick={() => toggleCloud(c)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-semibold border transition",
                            active
                              ? "bg-brand-500 text-white border-brand-500"
                              : "bg-white text-ink border-[#CBD5E1] hover:border-muted-500",
                          )}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                  {errors.clouds && <p className="mt-1 text-xs text-[#C81E1E]">{errors.clouds}</p>}
                </fieldset>
                <div>
                  <label htmlFor="demo-size" className="block text-sm font-semibold text-ink">
                    How many cloud accounts, subscriptions or projects?
                  </label>
                  <select
                    id="demo-size"
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    className={cn(inputCls, errors.size ? "border-[#E32D25]" : "border-[#CBD5E1]")}
                  >
                    <option value="">Select…</option>
                    {SIZES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.size && <p className="mt-1 text-xs text-[#C81E1E]">{errors.size}</p>}
                </div>
                <fieldset>
                  <legend className="block text-sm font-semibold text-ink">
                    Products to see <span className="text-muted-500 font-normal">(optional — leave empty for both)</span>
                  </legend>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SUITE.map((s) => {
                      const active = selectedProducts.includes(s.key);
                      const Icon = s.icon;
                      return (
                        <button
                          type="button"
                          key={s.key}
                          aria-pressed={active}
                          onClick={() => toggleProduct(s.key)}
                          className={cn(
                            "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm transition",
                            active ? "bg-tint-blue border-brand-500" : "bg-white border-[#CBD5E1] hover:border-muted-500",
                          )}
                        >
                          <Icon className="w-4 h-4 shrink-0" style={{ color: s.color }} aria-hidden />
                          <span className="font-semibold text-ink">{s.name}</span>
                          {s.badge && (
                            <span className="ml-auto text-[11px] font-semibold text-muted-500">{s.badge}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="pt-2 text-xs font-bold uppercase tracking-[0.16em] text-muted-500">3 · Anything else</div>
                <div>
                  <label htmlFor="demo-message" className="block text-sm font-semibold text-ink">
                    What would you like us to focus on? <span className="text-muted-500 font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="demo-message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={3}
                    placeholder="Tell us a bit about your environment or what you'd like to focus on."
                    className={cn(inputCls, "border-[#CBD5E1]")}
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full inline-flex justify-center items-center rounded-[10px] px-4 py-3 text-sm font-semibold bg-brand-500 text-white hover:bg-brand-600 shadow-[0_1px_2px_rgba(16,24,40,.06),0_4px_10px_rgba(37,99,235,.20)] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? "Sending…" : "Book my demo"}
                </button>
                {errors.submit && <p className="text-xs text-[#C81E1E] text-center">{errors.submit}</p>}
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
                <p className="text-xs text-muted-500 text-center">
                  By submitting, you agree to be contacted by the Onam team about the products you picked. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
      {(selectedProducts.length === 0 || selectedProducts.includes("security")) && (
        <ProductDemo
          compact
          clips={["dashboard", "scan", "attack"]}
          eyebrow="While you wait"
          title="A look at the Onam Security console."
          gradientWords="Onam Security console."
          subtitle="An illustrative preview of Onam Security console views. Figures are examples; the live demo uses your cloud or a demo account."
        />
      )}
    </SiteLayout>
  );
}
