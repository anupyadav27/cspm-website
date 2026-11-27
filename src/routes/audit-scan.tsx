import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  Handshake,
  KeyRound,
  Lock,
  ScanSearch,
  Ban,
} from "@/components/site/icons";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Backdrop, IconTile } from "@/components/site/system";
import { cn } from "@/lib/utils";
import { seo } from "@/lib/seo";
import { submitLead } from "@/lib/lead-capture";
import { errorSummary, fieldA11y, focusFirstInvalid } from "@/lib/form-a11y";

/**
 * /audit-scan — the free one-time audit scan, self-serve.
 *
 * Content follows Part A of the sales kit's audit scan and pilot plan
 * (marketing/onam-assets/sales-kit-2026-10/audit-and-pilot/AUDIT-SCAN-AND-PILOT-PLAN.md)
 * and only cleared facts (onam-live/marketing/facts/product.yaml, limits.yaml).
 * Wording rules that apply here: posture scanning is read-only through cloud roles;
 * agentless workload scanning runs inside the customer's account and is not part of
 * the scan unless agreed. No time to first findings is promised.
 *
 * Positioning (conversion audit F1, owner 27 Nov 2026): the free plan (up to 25 units,
 * self-serve) is the default free start. This page is for estates over 25 units, regulated
 * buyers, and anyone who wants a person to run the scan and read out the results. It links
 * smaller estates to /start-free. The scan's own facts below are unchanged.
 */
export const Route = createFileRoute("/audit-scan")({
  head: () =>
    seo({
      title: "Free cloud security audit scan, with a readout — Onam",
      description:
        "For estates over 25 units, regulated teams, or anyone who wants a readout: a one-time scan of one cloud account through read-only roles, at no charge, with ranked findings, fixes and a 45-minute readout.",
      path: "/audit-scan",
    }),
  component: AuditScanPage,
});

const CLOUDS = ["AWS", "Azure", "Google Cloud", "Oracle Cloud", "Alibaba Cloud", "IBM Cloud", "Kubernetes"];
const RESOURCES = ["Under 100", "100–500", "500–2,000", "More than 2,000", "Not sure"];
const ENVIRONMENTS = ["Production", "Non-production", "Mixed", "Not sure yet"];
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

const ACCESS = [
  { cloud: "AWS", create: "An IAM role that Onam assumes with an External ID", level: "AWS-managed SecurityAudit and ReadOnlyAccess policies", why: "To read how services are configured. Onam stores no secret for AWS; it assumes your role." },
  { cloud: "Azure", create: "Role assignments for Onam's service principal", level: "Reader and Storage Blob Data Reader", why: "To read configuration, and to find where sensitive data lives" },
  { cloud: "Google Cloud", create: "A service account", level: "Viewer, Cloud Asset Viewer, Security Reviewer", why: "To read configuration and asset lists" },
  { cloud: "Oracle Cloud", create: "A dedicated user and group", level: "read policies across the tenancy", why: "To read configuration, identity and key settings" },
  { cloud: "Alibaba Cloud", create: "A dedicated RAM user", level: "A dedicated read-only RAM policy", why: "To read configuration" },
  { cloud: "IBM Cloud", create: "A service ID", level: "Viewer-level access, scoped to a resource group", why: "To read configuration" },
];

const COVERS = [
  "Posture scanning (CSPM) of one cloud account, subscription or project, through read-only cloud roles",
  "Identity and data views from the same scan: who can reach what, and where sensitive data appears to sit",
  "Attack paths: the routes an attacker could take to reach what matters",
  "Mapping of findings to the compliance frameworks you name, from the 144 Onam maps to",
];

const NOT_COVERED = [
  "Agentless workload scanning. It runs inside your account and creates short-lived scan resources there, so it needs more than read access. We add it only if you ask and agree in writing.",
  "Code repositories, SaaS platforms and any other cloud accounts",
  "Reading data contents. The audit scan labels data from metadata (store names, tags, column names); content classification needs Onam's DSPM scanner deployed in your account.",
  "A compliance verdict. Framework mapping says which findings map to which controls; it is not a certification.",
];

const RECEIVE = [
  { icon: FileSearch, color: "#2563EB", title: "A findings report", body: "Every risk ranked, with the exact setting and its fix, and a fix order for this week, 30 days and 90 days. You keep the report." },
  { icon: ScanSearch, color: "#7C3AED", title: "Attack paths", body: "How two or more findings combine into a route, and which single fix breaks it. Routes are worked out from configuration, not tested." },
  { icon: KeyRound, color: "#059669", title: "Identity and data views", body: "Who can reach what, and where sensitive data appears to sit, from metadata." },
  { icon: ClipboardCheck, color: "#D97706", title: "Framework mapping", body: "For the frameworks you name. Controls with no automated check are marked for manual review." },
];

const STEPS = [
  { title: "Send the form", body: "Tell us which cloud and roughly how big the account is. Anup, our founder, replies within one working day." },
  { title: "30-minute scoping call", body: "We agree the account, what is in scope, the frameworks to map to and who sees the results. We can sign a mutual NDA first." },
  { title: "You run our template", body: "You deploy a template in your own account. You can read every permission before you deploy it. We confirm the connection works." },
  { title: "The scan runs once", body: "How long it takes depends on how much runs in the account, so we do not promise a time. We tell you when it has finished." },
  { title: "45-minute readout", body: "We go through the top items, the attack paths and the framework mapping with your team. The report and a short summary follow." },
  { title: "You decide", body: "Stop, or talk about a 60-day pilot. If you stop, you remove the role and we deactivate the account." },
];

const DATA = [
  "What Onam reads: configuration and metadata from the connected account.",
  "What Onam stores: configuration and metadata, findings, and the asset and attack-path graph.",
  "Credentials: where a cloud needs a stored credential (for example Oracle Cloud or Alibaba Cloud), it is kept in AWS Secrets Manager and encrypted with AWS KMS. For AWS, no secret is stored.",
  "Encryption: encrypted at rest; encrypted in transit for all customer-facing and service-to-service traffic, with one internal job being moved to TLS.",
  "Hosting region: agreed with you at the scoping call.",
  "Who sees the results: only the named people agreed at scoping.",
  "Retention: after the readout we deactivate the account. Your data is kept for 30 days after deactivation, then deleted.",
  "Ending access: remove the role or service account at any time. That stops all access at once.",
];

const inputCls =
  "mt-1.5 w-full rounded-[10px] border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30";

function AuditScanPage() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-line bg-white">
        <Backdrop tone="light" color="#2563EB" pattern="grid" icon={ScanSearch} />
        {/* Three blocks so that on a phone the form follows the heading (audit F5); at lg the intro
            and the scope lists share the left column and the form sits on the right. */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 md:pt-24 md:pb-20 grid lg:grid-cols-2 lg:grid-rows-[auto_1fr] gap-x-12 gap-y-8 items-start">
          <div className="lg:col-start-1 lg:row-start-1">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-500">Free audit scan, with a readout</div>
            <h1 className="mt-5 font-display font-black text-ink text-4xl md:text-5xl tracking-tight leading-[1.05]">
              Bigger estate or regulated? We'll run the scan with you.
            </h1>
            <p className="mt-5 text-lg text-body leading-relaxed">
              For estates over 25 units, teams that answer to a regulator or an auditor, and anyone who wants a
              person to walk them through the results. We scan one cloud account once, through read-only cloud
              roles, and go through what we found with you. There is no charge and no commitment. You keep the
              findings report.
            </p>
            <div className="mt-6 rounded-xl border border-line bg-[#F7F9FC] px-4 py-3 text-sm text-body leading-relaxed">
              <strong className="text-ink">Under 25 units?</strong>{" "}
              <Link to="/start-free" search={{ from: "/audit-scan" } as never} className="text-brand-500 font-semibold hover:underline">
                Start free
              </Link>{" "}
              and see your own results without a meeting. No card.
            </div>
          </div>

          <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-24">
            <AuditForm />
          </div>
          <div className="lg:col-start-1 lg:row-start-2">
            <h2 className="font-display font-bold text-ink text-xl">What the scan covers</h2>
            <ul className="mt-4 space-y-2.5">
              {COVERS.map((c) => (
                <li key={c} className="flex gap-3 text-sm text-body leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-brand-500" aria-hidden />
                  <span>{c}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-10 font-display font-bold text-ink text-xl">What it does not cover</h2>
            <ul className="mt-4 space-y-2.5">
              {NOT_COVERED.map((c) => (
                <li key={c} className="flex gap-3 text-sm text-body leading-relaxed">
                  <Ban className="w-4 h-4 mt-0.5 shrink-0 text-muted-500" aria-hidden />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      <section className="bg-[#F7F9FC] border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="font-display font-black text-ink text-3xl tracking-tight">What you receive</h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {RECEIVE.map((r) => (
              <div key={r.title} className="bg-white border border-line rounded-2xl p-5">
                <IconTile icon={r.icon} color={r.color} />
                <div className="mt-4 font-display font-bold text-ink">{r.title}</div>
                <p className="mt-1.5 text-sm text-body leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-body leading-relaxed max-w-3xl">
            Plus a 45-minute readout with your team and a short written summary of the top items. Dollar
            figures in the report are loss estimates per finding, used for ranking. They are not a price for a
            whole route, and not predictions. Want to see the format first? Ask us for the sample report, built
            from a test environment, when you send the form.
          </p>
        </div>
      </section>

      <section className="bg-white border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="font-display font-black text-ink text-3xl tracking-tight">What access we need</h2>
          <p className="mt-3 text-body max-w-3xl leading-relaxed">
            You run a template we give you, in your own account. Posture scanning connects through read-only
            cloud roles and changes nothing in your cloud. For Kubernetes, we agree access at the scoping call.
          </p>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-line">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F7F9FC] text-ink">
                <tr>
                  <th className="px-4 py-3 font-semibold">Cloud</th>
                  <th className="px-4 py-3 font-semibold">What you create</th>
                  <th className="px-4 py-3 font-semibold">Access level</th>
                  <th className="px-4 py-3 font-semibold">Why we need it</th>
                </tr>
              </thead>
              <tbody>
                {ACCESS.map((a) => (
                  <tr key={a.cloud} className="border-t border-line align-top">
                    <td className="px-4 py-3 font-semibold text-ink whitespace-nowrap">{a.cloud}</td>
                    <td className="px-4 py-3 text-body">{a.create}</td>
                    <td className="px-4 py-3 text-body">{a.level}</td>
                    <td className="px-4 py-3 text-body">{a.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F9FC] border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display font-black text-ink text-3xl tracking-tight">How it works</h2>
            <ol className="mt-8 space-y-5">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="w-8 h-8 shrink-0 rounded-full bg-brand-500 text-white grid place-items-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-display font-bold text-ink">{s.title}</div>
                    <p className="mt-1 text-sm text-body leading-relaxed">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="font-display font-black text-ink text-3xl tracking-tight flex items-center gap-3">
              <Lock className="w-6 h-6 text-brand-500" aria-hidden /> How we handle your data
            </h2>
            <ul className="mt-8 space-y-3">
              {DATA.map((d) => (
                <li key={d} className="text-sm text-body leading-relaxed bg-white border border-line rounded-xl px-4 py-3">
                  {d}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-body">
              More detail in the{" "}
              <Link to="/trust" className="text-brand-500 font-semibold hover:underline">
                Trust Center
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="border border-line rounded-2xl p-6 sm:p-8 flex gap-5 items-start">
            <IconTile icon={Handshake} color="#2563EB" />
            <div>
              <h2 className="font-display font-bold text-ink text-xl">After the readout</h2>
              <p className="mt-2 text-sm text-body leading-relaxed">
                If both sides want to continue, the next step can be a 60-day pilot on the accounts you choose,
                measured against success criteria you write before it starts. If not, you remove the role and
                that is the end of it.
              </p>
              <p className="mt-3 text-sm text-body leading-relaxed">
                We are taking up to 10 design partners: a pilot, a first-year price in return for honest feedback
                and, if it works, a reference. Ask us.
              </p>
              <p className="mt-3 text-sm text-body">
                Prefer a conversation first?{" "}
                <Link to="/request-demo" search={{ product: "security", from: "/audit-scan" }} className="text-brand-500 font-semibold hover:underline">
                  Book a demo
                </Link>{" "}
                or see{" "}
                <Link to="/pricing" className="text-brand-500 font-semibold hover:underline">
                  pricing
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function AuditForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    title: "",
    country: "",
    size: "",
    environment: "",
    message: "",
  });
  const [selectedClouds, setSelectedClouds] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  /** Hidden honeypot field — see submitLead. */
  const [website, setWebsite] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const toggleCloud = (c: string) =>
    setSelectedClouds((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = "Please enter a valid work email.";
    if (!form.name.trim()) errs.name = "Please enter your name.";
    if (!form.company.trim()) errs.company = "Please enter your company.";
    if (!form.country) errs.country = "Please pick your country.";
    if (selectedClouds.length === 0) errs.clouds = "Select the cloud the account is in.";
    if (!form.size) errs.size = "Please pick a rough size.";
    if (!form.environment) errs.environment = "Please pick one.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      focusFirstInvalid(formRef.current);
      return;
    }

    setSending(true);
    try {
      await submitLead({
        data: { kind: "audit", ...form, clouds: selectedClouds, products: ["security"], website },
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

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [key]: e.target.value }),
  });
  const border = (key: string) => (errors[key] ? "border-[#E32D25]" : "border-[#CBD5E1]");
  const err = (key: string) =>
    errors[key] && (
      <p id={`audit-${key}-error`} className="mt-1 text-xs text-[#C81E1E]">
        {errors[key]}
      </p>
    );
  /** aria-invalid / aria-describedby for the field whose error key is `key`. */
  const a11y = (key: string) => fieldA11y(`audit-${key}`, errors[key]);

  return (
    <div className="bg-white border border-line rounded-2xl p-6 sm:p-8 shadow-[0_1px_2px_rgba(16,24,40,.04),0_12px_28px_rgba(16,24,40,.06)]">
      {submitted ? (
        <div className="text-center py-8" role="status">
          <div className="w-14 h-14 rounded-full bg-tint-blue grid place-items-center mx-auto">
            <CheckCircle2 className="w-7 h-7 text-brand-500" />
          </div>
          <h2 className="mt-5 font-display font-black text-ink text-2xl tracking-tight">Thank you. We have it.</h2>
          <p className="mt-3 text-body leading-relaxed">
            Anup, our founder, will reply within one working day to set up a short scoping call. We have also
            sent you a confirmation email.
          </p>
        </div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div aria-live="polite" className="sr-only">
            {errorSummary(Object.keys(errors).filter((k) => k !== "submit").length)}
          </div>
          <div>
            <h2 className="font-display font-black text-ink text-2xl tracking-tight">Request your audit scan</h2>
            <p className="mt-1 text-sm text-body">One cloud account, once, at no charge.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="audit-name" className="block text-sm font-semibold text-ink">Name</label>
              <input id="audit-name" {...a11y("name")} {...field("name")} placeholder="Alex Rivera" className={cn(inputCls, border("name"))} />
              {err("name")}
            </div>
            <div>
              <label htmlFor="audit-email" className="block text-sm font-semibold text-ink">Work email</label>
              <input id="audit-email" {...a11y("email")} type="email" {...field("email")} placeholder="you@company.com" className={cn(inputCls, border("email"))} />
              {err("email")}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="audit-company" className="block text-sm font-semibold text-ink">Company</label>
              <input id="audit-company" {...a11y("company")} {...field("company")} placeholder="Acme Corp" className={cn(inputCls, border("company"))} />
              {err("company")}
            </div>
            <div>
              <label htmlFor="audit-title" className="block text-sm font-semibold text-ink">
                Job title <span className="text-muted-500 font-normal">(optional)</span>
              </label>
              <input id="audit-title" {...field("title")} placeholder="Head of Cloud Security" className={cn(inputCls, "border-[#CBD5E1]")} />
            </div>
          </div>
          <div>
            <label htmlFor="audit-country" className="block text-sm font-semibold text-ink">Country</label>
            <select id="audit-country" {...a11y("country")} {...field("country")} className={cn(inputCls, border("country"))}>
              <option value="">Select…</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {err("country")}
          </div>
          <fieldset>
            <legend className="block text-sm font-semibold text-ink">Which cloud is the account in?</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {CLOUDS.map((c) => {
                const active = selectedClouds.includes(c);
                return (
                  <button
                    type="button"
                    key={c}
                    aria-pressed={active}
                    {...(c === CLOUDS[0] ? a11y("clouds") : {})}
                    onClick={() => toggleCloud(c)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold border transition",
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="audit-size" className="block text-sm font-semibold text-ink">Roughly how many resources?</label>
              <select id="audit-size" {...a11y("size")} {...field("size")} className={cn(inputCls, border("size"))}>
                <option value="">Select…</option>
                {RESOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {err("size")}
            </div>
            <div>
              <label htmlFor="audit-env" className="block text-sm font-semibold text-ink">Which environment?</label>
              <select id="audit-env" {...a11y("environment")} {...field("environment")} className={cn(inputCls, border("environment"))}>
                <option value="">Select…</option>
                {ENVIRONMENTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {err("environment")}
            </div>
          </div>
          <div>
            <label htmlFor="audit-message" className="block text-sm font-semibold text-ink">
              Anything we should know? <span className="text-muted-500 font-normal">(optional)</span>
            </label>
            <textarea
              id="audit-message"
              {...field("message")}
              rows={3}
              placeholder="Frameworks you report against, an audit coming up, or a worry you want checked."
              className={cn(inputCls, "border-[#CBD5E1]")}
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="w-full inline-flex justify-center items-center rounded-[10px] px-4 py-3 text-sm font-semibold bg-brand-500 text-white hover:bg-brand-600 shadow-[0_1px_2px_rgba(16,24,40,.06),0_4px_10px_rgba(37,99,235,.20)] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sending ? "Sending…" : "Request the audit scan"}
          </button>
          {errors.submit && (
            <p role="alert" className="text-xs text-[#C81E1E] text-center">
              {errors.submit}
            </p>
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
          <p className="text-xs text-muted-500 text-center">
            By submitting, you agree to be contacted by Onam about the audit scan. No spam.
          </p>
        </form>
      )}
    </div>
  );
}
