import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowDown, CheckCircle2, Circle, Globe, KeyRound, Lock, Mail, ShieldCheck, UserRound } from "@/components/site/icons";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Backdrop } from "@/components/site/system";
import { cn } from "@/lib/utils";
import { seo } from "@/lib/seo";
import { submitLead } from "@/lib/lead-capture";

/**
 * /start-free — sign-up for the free plan (owner decision, 27 Nov 2026).
 *
 * Facts: onam-live/marketing/facts/product.yaml company.free_plan — up to 25 units of cloud security, API-based
 * cloud API scanning only; excludes KSPM, data-content classification and vulnerability/malware
 * scanning. There is no self-serve provisioning: the form becomes a "free" lead (S3 + sales@),
 * the team creates the tenant in the backend and emails the login details to the visitor.
 * Do not promise a provisioning time here until the owner commits to one.
 */
export const Route = createFileRoute("/start-free")({
  head: () =>
    seo({
      title: "Start free: cloud security for up to 25 units — Onam",
      description:
        "Onam's free plan: cloud posture, identity, data and AI security checks through your cloud's APIs, for up to 25 units. No agent, no card.",
      path: "/start-free",
    }),
  component: StartFreePage,
});

const CLOUDS = ["AWS", "Azure", "Google Cloud", "Oracle Cloud", "Alibaba Cloud", "IBM Cloud"];
const RESOURCES = ["Under 50 resources", "50–200", "200–1,000", "More than 1,000", "Not sure"];
const COUNTRIES = [
  "India",
  "Australia",
  "United States",
  "Canada",
  "United Kingdom",
  "United Arab Emirates",
  "Saudi Arabia",
  "Singapore",
  "Germany",
  "Other",
];

const INCLUDED = [
  "Cloud posture (CSPM): misconfigurations and what is open to the internet, ranked with fixes",
  "Compliance reports against the frameworks Onam supports",
  "Identity and permissions (CIEM): who and what can do too much",
  "Data security (DSPM) through your cloud's APIs: where your data stores are and how they are set up",
  "AI security (AI-SPM): the AI services in your cloud, missing guardrails and what they can reach",
];
const NOT_INCLUDED = [
  "Kubernetes posture (KSPM)",
  "Reading the contents of data stores to classify sensitive data",
  "Vulnerability and malware scanning of workloads",
];

const STEPS = [
  { Icon: UserRound, title: "Register", body: "Tell us who you are and which cloud you use. No card." },
  { Icon: Mail, title: "We email your login", body: "Our team creates your Onam workspace and sends the login details to the address you register with." },
  { Icon: KeyRound, title: "Connect read-only", body: "Connect a cloud account with a read-only role. You can read every permission first. Onam deploys no agent or scanner." },
];

const inputCls =
  "mt-1.5 w-full rounded-[10px] border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30";

function StartFreePage() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <Backdrop tone="light" pattern="graph" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-20 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <span className="inline-flex rounded-full bg-tint-blue px-3 py-1 text-[12px] font-bold uppercase tracking-[0.12em] text-brand-700">
              Free plan · up to 25 units
            </span>
            <h1 className="mt-5 font-display font-black text-ink text-4xl md:text-5xl tracking-tight leading-[1.05]">
              See what your auditor would flag in your cloud, before they do.
            </h1>
            <p className="mt-5 text-lg text-body leading-relaxed max-w-xl">
              Misconfigurations, what is open to the internet and who can do too much, mapped to the compliance
              controls you are tested on. Free for up to 25 units of cloud security, through{" "}
              <strong className="text-ink">read-only cloud roles</strong>. No agent, no card.
            </p>
            <a
              href="#signup"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-[10px] bg-brand-500 px-5 text-sm font-semibold text-white lg:hidden"
            >
              Start free <ArrowDown className="h-4 w-4" aria-hidden />
            </a>

            <ol className="mt-8 space-y-4">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white ring-1 ring-line">
                    <s.Icon className="h-5 w-5 text-brand-600" aria-hidden />
                  </span>
                  <div>
                    <div className="font-display font-bold text-ink">
                      {i + 1}. {s.title}
                    </div>
                    <p className="mt-0.5 text-sm text-body leading-relaxed">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="font-display font-bold text-ink">What's included</h2>
                <ul className="mt-3 space-y-2.5">
                  {INCLUDED.map((t) => (
                    <li key={t} className="flex gap-2.5 text-sm text-body leading-relaxed">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-onam-green" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-display font-bold text-ink">On paid plans</h2>
                <ul className="mt-3 space-y-2.5">
                  {NOT_INCLUDED.map((t) => (
                    <li key={t} className="flex gap-2.5 text-sm text-body leading-relaxed">
                      <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-500" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-body">
                  These need a scanner or access inside your environment. See{" "}
                  <Link to="/pricing" className="text-brand-600 hover:underline">pricing</Link>.
                </p>
              </div>
            </div>

            <div className="mt-10 rounded-2xl bg-white ring-1 ring-line p-5">
              <h2 className="font-display font-bold text-ink">What is a unit?</h2>
              <p className="mt-1.5 text-sm text-body leading-relaxed">
                The same unit the paid plans use: for example, one virtual machine is one unit, and several smaller
                resources such as storage buckets share one. Everything else is scanned and reported at no charge.
                The <Link to="/pricing" className="text-brand-600 hover:underline">pricing calculator</Link> shows how
                your estate counts.
              </p>
            </div>
          </div>

          <div id="signup" className="scroll-mt-24 lg:sticky lg:top-24 space-y-4">
            <SignUpForm />
            <TrustBox />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

/** Where the visitor came from, so sales can see which pages produce sign-ups. */
function useSource() {
  const [src, setSrc] = useState({ page: "", utm: "" });
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const utm = ["utm_source", "utm_medium", "utm_campaign", "utm_content"]
      .map((k) => (q.get(k) ? `${k}=${q.get(k)}` : ""))
      .filter(Boolean)
      .join("&");
    const from = q.get("from") || document.referrer || "";
    setSrc({ page: from.slice(0, 500), utm });
  }, []);
  return src;
}

function SignUpForm() {
  const [form, setForm] = useState({ name: "", email: "", company: "", title: "", country: "", size: "", message: "" });
  const [selectedClouds, setSelectedClouds] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [website, setWebsite] = useState("");
  const source = useSource();
  const navigate = useNavigate();

  const toggleCloud = (c: string) =>
    setSelectedClouds((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = "Please enter a valid work email.";
    if (!form.name.trim()) errs.name = "Please enter your name.";
    if (!form.company.trim()) errs.company = "Please enter your company.";
    if (!form.country) errs.country = "Please pick your country.";
    if (selectedClouds.length === 0) errs.clouds = "Select at least one cloud.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSending(true);
    try {
      await submitLead({
        data: {
          kind: "free",
          ...form,
          clouds: selectedClouds,
          products: ["security"],
          page: source.page,
          utm: source.utm,
          website,
        },
      });
      setSubmitted(true);
      navigate({ to: "/start-free/thanks" });
    } catch {
      setErrors({ submit: "Something went wrong sending that. Please email sales@onamsecurity.com and we'll set you up." });
    } finally {
      setSending(false);
    }
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [key]: e.target.value }),
  });
  const border = (key: string) => (errors[key] ? "border-[#E32D25]" : "border-[#CBD5E1]");
  const err = (key: string) => errors[key] && <p className="mt-1 text-xs text-[#C81E1E]">{errors[key]}</p>;

  return (
    <div className="bg-white border border-line rounded-2xl p-6 sm:p-8 shadow-[0_1px_2px_rgba(16,24,40,.04),0_12px_28px_rgba(16,24,40,.06)]">
      {submitted ? (
        <div className="text-center py-8" role="status">
          <div className="w-14 h-14 rounded-full bg-tint-blue grid place-items-center mx-auto">
            <CheckCircle2 className="w-7 h-7 text-brand-500" />
          </div>
          <h2 className="mt-5 font-display font-black text-ink text-2xl tracking-tight">You're registered.</h2>
          <p className="mt-3 text-body leading-relaxed">
            We're creating your Onam workspace and will email your login details to{" "}
            <strong className="text-ink">{form.email}</strong>. We've also sent you a confirmation email with what
            happens next.
          </p>
          <p className="mt-4 text-sm text-body">
            While you wait: read how{" "}
            <Link to="/docs/$" params={{ _splat: "onboarding/aws" }} className="text-brand-600 hover:underline">
              the read-only connection works
            </Link>
            .
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <h2 className="font-display font-black text-ink text-2xl tracking-tight">Start free</h2>
            <p className="mt-1 text-sm text-body">Up to 25 units. No card. We email your login.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="free-name" className="block text-sm font-semibold text-ink">Name</label>
              <input id="free-name" autoComplete="name" {...field("name")} placeholder="Alex Rivera" className={cn(inputCls, border("name"))} />
              {err("name")}
            </div>
            <div>
              <label htmlFor="free-email" className="block text-sm font-semibold text-ink">Work email</label>
              <input id="free-email" type="email" autoComplete="email" {...field("email")} placeholder="you@company.com" className={cn(inputCls, border("email"))} />
              {err("email")}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="free-company" className="block text-sm font-semibold text-ink">Company</label>
              <input id="free-company" autoComplete="organization" {...field("company")} placeholder="Acme Corp" className={cn(inputCls, border("company"))} />
              {err("company")}
            </div>
            <div>
              <label htmlFor="free-country" className="block text-sm font-semibold text-ink">Country</label>
              <select id="free-country" {...field("country")} className={cn(inputCls, border("country"))}>
                <option value="">Select…</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {err("country")}
            </div>
          </div>
          <fieldset>
            <legend className="block text-sm font-semibold text-ink">Which cloud do you use?</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {CLOUDS.map((c) => {
                const active = selectedClouds.includes(c);
                return (
                  <button
                    type="button"
                    key={c}
                    aria-pressed={active}
                    onClick={() => toggleCloud(c)}
                    className={cn(
                      "min-h-9 px-3 py-1.5 rounded-full text-xs font-semibold border transition",
                      active ? "bg-brand-500 text-white border-brand-500" : "bg-white text-ink border-[#CBD5E1] hover:border-muted-500",
                    )}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
            {err("clouds")}
          </fieldset>
          <div>
            <label htmlFor="free-size" className="block text-sm font-semibold text-ink">
              Roughly how many cloud resources? <span className="text-muted-500 font-normal">(optional)</span>
            </label>
            <select id="free-size" {...field("size")} className={cn(inputCls, "border-[#CBD5E1]")}>
              <option value="">Select…</option>
              {RESOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button
            type="submit"
            disabled={sending}
            className="w-full inline-flex justify-center items-center rounded-[10px] px-4 py-3 text-sm font-semibold bg-brand-500 text-white hover:bg-brand-600 shadow-[0_1px_2px_rgba(16,24,40,.06),0_4px_10px_rgba(37,99,235,.20)] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sending ? "Sending…" : "Start free"}
          </button>
          {errors.submit && <p className="text-xs text-[#C81E1E] text-center">{errors.submit}</p>}
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
            By registering, you agree to the <Link to="/company/terms" className="underline">terms</Link> and to be contacted by Onam
            about your account. No spam.
          </p>
        </form>
      )}
    </div>
  );
}

/** Cleared facts only (product.yaml company.hosting, retention_after_deactivation_days; tenant wording rule). */
function TrustBox() {
  const items = [
    { Icon: KeyRound, t: "Read-only roles", d: "Posture scanning connects through read-only cloud roles. Read every permission before you deploy it." },
    { Icon: Globe, t: "Your region", d: "Your data is hosted in the region you choose, such as the US, Europe or India." },
    { Icon: Lock, t: "30 days, then gone", d: "If you leave, your data is kept for 30 days after deactivation." },
  ];
  return (
    <div className="rounded-2xl bg-white ring-1 ring-line p-5">
      <div className="flex items-center gap-2 font-display font-bold text-ink">
        <ShieldCheck className="h-5 w-5 text-brand-600" aria-hidden /> Before you connect
      </div>
      <ul className="mt-3 space-y-3">
        {items.map((x) => (
          <li key={x.t} className="flex gap-3">
            <x.Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-500" aria-hidden />
            <div className="text-sm leading-relaxed">
              <span className="font-semibold text-ink">{x.t}.</span> <span className="text-body">{x.d}</span>
            </div>
          </li>
        ))}
      </ul>
      <Link to="/trust" className="mt-3 inline-block text-sm font-semibold text-brand-600 hover:underline">
        How we handle your data
      </Link>
    </div>
  );
}
