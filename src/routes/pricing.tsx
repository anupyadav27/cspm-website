import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, X, HelpCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { cn } from "@/lib/utils";
import { seo, faqJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/pricing")({
  head: () =>
    seo({
      title: "Pricing — Onam Security",
      description:
        "Straightforward pricing for cloud security. Try Onam free — no credit card required.",
      path: "/pricing",
    }),
  component: PricingPage,
});

type Tier = {
  name: string;
  price: string;
  priceSub?: string;
  blurb: string;
  features: string[];
  notIncluded?: string[];
  cta: { label: string; to?: string; href?: string };
  highlight?: boolean;
};

const tiers: Tier[] = [
  {
    name: "Free",
    price: "$0",
    priceSub: "forever",
    blurb: "Connect one account and start finding misconfigurations — no time limit, no credit card.",
    features: [
      "1 cloud account",
      "Up to 500 resources",
      "Core CSPM rules (Critical & High)",
      "CIS benchmark coverage",
      "30-day finding history",
      "Community support",
    ],
    notIncluded: ["CIEM & threat detection", "Compliance report export", "Team access & SSO"],
    cta: { label: "Start free", to: "/request-demo" },
  },
  {
    name: "Pro",
    price: "$22",
    priceSub: "per resource / month",
    blurb: "All 16+ security engines. Unlimited accounts. Platform fee plus $22 per resource, billed monthly.",
    features: [
      "Unlimited cloud accounts",
      "$22 / resource / month, pay-as-you-go",
      "All 16+ security engines",
      "All 13 compliance frameworks",
      "CIEM & identity attack paths",
      "Threat detection — MITRE ATT&CK mapped",
      "Network security — 7-layer topology",
      "Vulnerability management with EPSS scoring",
      "1-year finding history",
      "Email & Slack notifications",
      "REST API access",
      "Email support (< 24h)",
    ],
    cta: { label: "Start 14-day free trial", to: "/request-demo" },
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    priceSub: "annual contract",
    blurb: "For regulated organisations that need contractual SLAs, custom frameworks, and dedicated support.",
    features: [
      "Everything in Pro",
      "Multi-tenant organisation support",
      "Custom compliance framework builder",
      "SSO / SAML 2.0",
      "RBAC with custom roles",
      "Dedicated security engineer",
      "On-premises deployment option",
      "Custom data retention",
      "Contractual 99.9% uptime SLA",
      "Priority support (< 4h)",
      "Quarterly posture review",
      "Custom contract & invoicing",
    ],
    cta: { label: "Contact sales", to: "/company/contact" },
  },
];

const comparison: { label: string; free: string; pro: string; ent: string }[] = [
  { label: "Cloud accounts", free: "1", pro: "Unlimited", ent: "Unlimited + multi-tenant" },
  { label: "Resources scanned", free: "Up to 500", pro: "Pay-as-you-go", ent: "Custom" },
  { label: "Security engines", free: "Core CSPM", pro: "All 16+", ent: "All 16+ · custom rules" },
  { label: "Compliance frameworks", free: "CIS", pro: "All 13 frameworks", ent: "All 13 + custom builder" },
  { label: "Finding history", free: "30 days", pro: "1 year", ent: "Custom retention" },
  { label: "Notifications", free: "—", pro: "Email + Slack", ent: "Email, Slack, webhooks, SIEM" },
  { label: "API access", free: "—", pro: "REST", ent: "REST + Terraform provider" },
  { label: "SSO / SAML 2.0", free: "—", pro: "—", ent: "Included" },
  { label: "RBAC", free: "—", pro: "Basic", ent: "Custom roles" },
  { label: "Support", free: "Community", pro: "Email (< 24h)", ent: "Priority (< 4h) + CSM" },
  { label: "Uptime SLA", free: "—", pro: "—", ent: "99.9% contractual" },
  { label: "Deployment", free: "SaaS", pro: "SaaS", ent: "SaaS or on-prem" },
];

const faqs = [
  {
    q: "How does the $22 / resource / month pricing work?",
    a: "A resource is any billable cloud object we scan — an EC2 instance, an S3 bucket, a Lambda, an IAM user, a Kubernetes pod, and so on. You pay per active resource at the end of each billing period. No overage penalties.",
  },
  { q: "Is there really no credit card required for Free?", a: "None. Connect one account, get findings, keep the plan indefinitely." },
  { q: "Can we switch between Pro and Enterprise mid-contract?", a: "Yes. Pro is month-to-month; upgrading to Enterprise moves you onto an annual contract with SLAs and support commitments." },
  { q: "Do you offer a nonprofit or academic discount?", a: "Yes — contact sales. Verified nonprofits and academic institutions receive a discount on Pro and Enterprise." },
  { q: "How is usage measured for billing?", a: "Onam samples resource counts daily and averages them across the billing period. You are never charged for a resource that no longer exists." },
];

function TierCard({ t }: { t: Tier }) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border p-8 flex flex-col bg-white",
        t.highlight
          ? "border-[#2563EB] shadow-[0_20px_50px_rgba(37,99,235,.18)]"
          : "border-[#E5E9F0] shadow-[0_1px_2px_rgba(16,24,40,.04),0_1px_3px_rgba(16,24,40,.06)]",
      )}
    >
      {t.highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#2563EB] text-white text-[11px] font-bold uppercase tracking-widest">
          <Sparkles className="w-3 h-3" /> Most popular
        </div>
      )}
      <div className="font-display font-bold text-[#0B1220] text-lg">{t.name}</div>
      <div className="mt-3 flex items-baseline gap-2">
        <div className="font-display font-black text-[#0B1220] text-4xl md:text-5xl tracking-tight">{t.price}</div>
        {t.priceSub && <div className="text-sm text-[#64748B]">{t.priceSub}</div>}
      </div>
      <p className="mt-3 text-sm text-[#475569] leading-relaxed">{t.blurb}</p>
      <div className="mt-6">
        {t.cta.href ? (
          <a
            href={t.cta.href}
            className={cn(
              "w-full inline-flex justify-center items-center rounded-[10px] px-4 py-2.5 text-sm font-semibold transition",
              t.highlight ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8]" : "bg-white text-[#0B1220] border border-[#CBD5E1] hover:bg-[#F1F5F9]",
            )}
          >
            {t.cta.label}
          </a>
        ) : (
          <BrandButton to={t.cta.to!} variant={t.highlight ? "primary" : "secondary"} className="w-full">
            {t.cta.label}
          </BrandButton>
        )}
      </div>
      <div className="mt-6 pt-6 border-t border-[#E5E9F0] space-y-2.5">
        {t.features.map((f) => (
          <div key={f} className="flex items-start gap-2.5 text-sm text-[#334155]">
            <Check className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
            <span>{f}</span>
          </div>
        ))}
      </div>
      {t.notIncluded && t.notIncluded.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#E5E9F0] space-y-2.5">
          {t.notIncluded.map((f) => (
            <div key={f} className="flex items-start gap-2.5 text-sm text-[#94A3B8]">
              <X className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{f}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PricingPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-[#E5E9F0] bg-white">
        <div className="absolute inset-0 dot-grid opacity-60" />
        <div className="absolute -top-40 right-1/4 w-[700px] h-[500px] rounded-full bg-[#2563EB]/10 blur-[140px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#64748B]">Pricing</div>
          <h1 className="mt-5 font-display font-black text-[#0B1220] text-5xl md:text-6xl tracking-tight leading-[1.05]">
            Straightforward pricing for cloud security.
          </h1>
          <p className="mt-5 text-lg text-[#475569]">Try it free, no credit card required.</p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          {tiers.map((t) => <TierCard key={t.name} t={t} />)}
        </div>
      </section>

      <section className="bg-[#F7F9FC] border-y border-[#E5E9F0] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
              Compare plans
            </div>
            <h2 className="mt-4 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
              What's included in each tier
            </h2>
          </div>
          <div className="mt-10 overflow-x-auto rounded-2xl border border-[#E5E9F0] bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E5E9F0]">
                  <th className="text-left font-display font-bold text-[#0B1220] px-5 py-4">Feature</th>
                  <th className="text-left font-display font-bold text-[#0B1220] px-5 py-4">Free</th>
                  <th className="text-left font-display font-bold text-[#2563EB] px-5 py-4">Pro</th>
                  <th className="text-left font-display font-bold text-[#0B1220] px-5 py-4">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={row.label} className={cn("border-b border-[#E5E9F0]", i % 2 && "bg-[#FBFCFE]")}>
                    <td className="px-5 py-3.5 font-medium text-[#0B1220]">{row.label}</td>
                    <td className="px-5 py-3.5 text-[#475569]">{row.free}</td>
                    <td className="px-5 py-3.5 text-[#475569]">{row.pro}</td>
                    <td className="px-5 py-3.5 text-[#475569]">{row.ent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
        />
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
              <HelpCircle className="w-3.5 h-3.5" /> Pricing FAQ
            </div>
            <h2 className="mt-4 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
              Things people ask before buying
            </h2>
          </div>
          <div className="mt-10 space-y-3">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q} className="bg-white border border-[#E5E9F0] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-[#F8FAFC] transition"
                  >
                    <span className="font-display font-semibold text-[#0B1220]">{f.q}</span>
                    <span className={cn("shrink-0 w-7 h-7 rounded-full grid place-items-center border border-[#E5E9F0] text-[#475569] transition-transform", isOpen && "rotate-45 border-[#2563EB] text-[#2563EB] bg-[#EFF4FF]")}>+</span>
                  </button>
                  {isOpen && <div className="px-6 pb-6 text-[#475569] leading-relaxed">{f.a}</div>}
                </div>
              );
            })}
          </div>
          <div className="mt-14 text-center">
            <p className="text-[#475569]">Need a bespoke quote?</p>
            <div className="mt-4 inline-flex">
              <Link
                to="/company/contact"
                className="inline-flex items-center rounded-[10px] px-5 py-3 text-sm font-semibold bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition"
              >
                Talk to sales →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
