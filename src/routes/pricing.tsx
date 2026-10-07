import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketplaceStrip } from "@/components/site/MarketplaceStrip";
import { Check, X, HelpCircle, Sparkles, ArrowRight, Scale } from "lucide-react";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { cn } from "@/lib/utils";
import { seo, faqJsonLd } from "@/lib/seo";
import { ENGINES, FRAMEWORKS } from "@/lib/product-facts";
import { PRODUCTS } from "@/data/products";
import { getSuite } from "@/data/product-suite";
import { OPS_STATUS } from "@/data/operations";
import { Backdrop, IconTile, StatusChip } from "@/components/site/system";

export const Route = createFileRoute("/pricing")({
  head: () =>
    seo({
      title: "Pricing — Onam",
      description:
        "Pricing for the Onam platform. Onam Security has Free, Pro and Enterprise plans. Onam Estate, FinOps and DRM are stand-alone products granted per organisation — contact sales. Onam AIOps is in early access by invitation.",
      path: "/pricing",
      image: "/og/pricing.png",
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
    blurb: "Every security layer. Unlimited accounts. Platform fee plus $22 per resource, billed monthly.",
    features: [
      "Unlimited cloud accounts",
      "$22 / resource / month, pay-as-you-go",
      `All ${ENGINES} engines — CNAPP, CSPM, CIEM, DSPM, CWPP, SSPM`,
      `All ${FRAMEWORKS} compliance frameworks`,
      "CIEM & identity attack paths",
      "Agentless workload scanning — no agents to deploy",
      "SaaS security — M365, Workspace, GitHub, Snowflake",
      "Threat detection — MITRE ATT&CK mapped",
      "Network, API, database & encryption posture",
      "Vulnerability management with EPSS scoring",
      "AI assistant & per-finding remediation",
      "1-year finding history",
      "Email & Slack notifications",
      "REST API access",
      "Email support",
    ],
    cta: { label: "Start 14-day free trial", to: "/request-demo" },
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    priceSub: "annual contract",
    blurb: "For regulated organisations that need agreed service levels, custom frameworks, and dedicated support.",
    features: [
      "Everything in Pro",
      "Multi-tenant organisation support",
      "Custom compliance framework builder",
      "SSO / SAML 2.0",
      "RBAC with custom roles",
      "Dedicated security engineer",
      "On-premises deployment option",
      "Custom data retention",
      "Service levels agreed in your contract",
      "Priority support",
      "Quarterly posture review",
      "Custom contract & invoicing",
    ],
    cta: { label: "Contact sales", to: "/company/contact" },
  },
];

const comparison: { label: string; free: string; pro: string; ent: string }[] = [
  { label: "Cloud accounts", free: "1", pro: "Unlimited", ent: "Unlimited + multi-tenant" },
  { label: "Resources scanned", free: "Up to 500", pro: "Pay-as-you-go", ent: "Custom" },
  { label: "Security engines", free: "Core CSPM", pro: `All ${ENGINES} engines`, ent: `All ${ENGINES} engines · custom rules` },
  { label: "SaaS security (SSPM)", free: "—", pro: "All 8 platforms", ent: "All 8 + custom connectors" },
  { label: "Agentless workload scanning", free: "—", pro: "Included", ent: "Included · custom schedules" },
  { label: "Compliance frameworks", free: "CIS", pro: `All ${FRAMEWORKS} frameworks`, ent: `All ${FRAMEWORKS} + custom builder` },
  { label: "Finding history", free: "30 days", pro: "1 year", ent: "Custom retention" },
  { label: "Notifications", free: "—", pro: "Email + Slack", ent: "Email, Slack, webhooks, SIEM" },
  { label: "API access", free: "—", pro: "REST", ent: "REST + Terraform provider" },
  { label: "SSO / SAML 2.0", free: "—", pro: "—", ent: "Included" },
  { label: "RBAC", free: "—", pro: "Basic", ent: "Custom roles" },
  { label: "Support", free: "Community", pro: "Email", ent: "Priority + CSM" },
  { label: "Service levels", free: "—", pro: "—", ent: "Agreed in your contract" },
  { label: "Deployment", free: "SaaS", pro: "SaaS", ent: "SaaS or on-prem" },
];

const faqs = [
  {
    q: "How does the $22 / resource / month pricing work?",
    a: "A resource is any billable cloud object we scan — an EC2 instance, an S3 bucket, a Lambda, an IAM user, a Kubernetes pod, and so on. You pay per active resource at the end of each billing period. No overage penalties.",
  },
  { q: "Is there really no credit card required for Free?", a: "None. Connect one account, get findings, keep the plan indefinitely." },
  { q: "Can we switch between Pro and Enterprise mid-contract?", a: "Yes. Pro is month-to-month; upgrading to Enterprise moves you onto an annual contract, with service levels agreed in that contract." },
  { q: "Do you offer a nonprofit or academic discount?", a: "Yes — contact sales. Verified nonprofits and academic institutions receive a discount on Pro and Enterprise." },
  { q: "How is usage measured for billing?", a: "Onam samples resource counts daily and averages them across the billing period. You are never charged for a resource that no longer exists." },
  {
    q: "Are Onam Estate, Onam FinOps and Onam DRM included in Pro or Enterprise?",
    a: "No. Each is a separate product enabled per organisation, not features of a security tier — so upgrading your security plan does not turn them on, and buying one of them does not require a security plan. Talk to sales about any of them.",
  },
  {
    q: "Can we buy Onam FinOps without Onam Security?",
    a: "Yes. Each product stands alone. If you do run more than one they share the same login, the same console and the same discovery, so you are not connecting your cloud accounts twice.",
  },
  {
    q: "How do we get Onam AIOps?",
    a: "Onam AIOps is in early access, by invitation. Onam enables it for your organisation, connects the agents to your Onam Security data, and sets the autonomy ceiling to \"propose\" — agents answer and propose, and nothing changes your cloud. There is no published price; ask us for an invitation.",
  },
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
      {/* flex-wrap: at tablet the three cards get narrow enough that
          "Custom" + "annual contract" overflowed the card and was cut off. */}
      <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
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
          <BrandButton
            to={t.cta.to!}
            search={t.cta.to === "/request-demo" ? { product: "security" } : undefined}
            variant={t.highlight ? "primary" : "secondary"}
            className="w-full"
          >
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
            <div key={f} className="flex items-start gap-2.5 text-sm text-muted-500">
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
  const security = getSuite("security");
  const aiops = getSuite("aiops");
  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-[#E5E9F0] bg-white">
        <Backdrop tone="light" color="#059669" pattern="dots" icon={Scale} />
        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-20 text-center">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#64748B]">Pricing</div>
          <h1 className="mt-5 font-display font-black text-[#0B1220] text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.05]">
            Four products. Buy the ones you need.
          </h1>
          <p className="mt-5 text-lg text-[#475569]">
            Onam Security has published plans and a free tier, no credit card required. Onam Estate, FinOps and DRM
            are stand-alone products granted per organisation. Onam AIOps is in early access.
          </p>
          <nav aria-label="Jump to a product" className="mt-8 flex flex-wrap justify-center gap-2">
            {[
              { href: "#security", label: "Onam Security" },
              { href: "#products", label: "Estate · FinOps · DRM" },
              { href: "#aiops", label: "Onam AIOps" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3.5 py-1.5 rounded-full text-sm font-semibold border border-[#CBD5E1] text-[#0B1220] hover:border-[#2563EB] hover:text-[#2563EB] transition"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section id="security" className="bg-white pt-16 pb-16 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-start gap-4 max-w-3xl">
            <IconTile icon={security.icon} color={security.color} size="lg" />
            <div>
              <h2 className="font-display font-extrabold text-[#0B1220] text-2xl md:text-3xl tracking-tight">
                Onam Security plans
              </h2>
              <p className="mt-2 text-[#475569] leading-relaxed">
                {security.blurb}{" "}
                <Link to="/platform" className="font-medium text-[#2563EB] hover:underline">
                  What Onam Security does
                </Link>
              </p>
            </div>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {tiers.map((t) => <TierCard key={t.name} t={t} />)}
          </div>
        </div>
      </section>

      <section id="products" className="bg-white pb-16 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl border border-[#E5E9F0] bg-[#FBFCFE] p-6 sm:p-8 md:p-10">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-display font-extrabold text-[#0B1220] text-2xl md:text-3xl tracking-tight">
                Onam Estate, FinOps and DRM
              </h2>
              <div className="text-xs uppercase tracking-widest text-[#64748B] font-semibold">
                Stand-alone · granted per organisation
              </div>
            </div>
            <p className="mt-3 text-sm text-[#475569] max-w-2xl leading-relaxed">
              Each is its own product, granted per organisation — not a tier or feature of Onam Security. None of
              them requires a security plan, and upgrading a security plan does not turn them on. If you run more
              than one product, they share one login, one console and one discovery, so your cloud accounts are
              connected once. No price is published yet; talk to us.
            </p>

            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRODUCTS.filter((p) => p.key !== "security").map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.key} className="rounded-xl border border-[#E5E9F0] bg-white p-6 flex flex-col">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg grid place-items-center"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${p.color} 12%, #FFFFFF)`,
                          boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${p.color} 22%, transparent)`,
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: p.color }} />
                      </div>
                      <div>
                        <div className="font-display font-bold text-[#0B1220]">{p.name}</div>
                        <div className="text-xs text-[#64748B]">{p.question}</div>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-[#475569] leading-relaxed flex-1">{getSuite(p.key).blurb}</p>
                    <div className="mt-5 pt-4 border-t border-[#E5E9F0] flex items-center justify-between gap-4">
                      <div className="font-display font-black text-[#0B1220] text-xl">Contact sales</div>
                      <Link
                        to="/request-demo"
                        search={{ product: p.key }}
                        className="text-sm font-semibold px-4 py-2 rounded-[10px] border border-[#CBD5E1] text-[#0B1220] hover:border-[#2563EB] hover:text-[#2563EB] transition"
                      >
                        Talk to us
                      </Link>
                    </div>
                    <Link to={p.href} className="mt-3 text-xs font-medium text-[#2563EB] hover:underline">
                      What {p.name} does →
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="aiops" className="bg-white pb-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl border border-[#E5E9F0] bg-white p-6 sm:p-8 md:p-10 grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div className="flex items-start gap-4">
              <IconTile icon={aiops.icon} color={aiops.color} size="lg" />
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display font-extrabold text-[#0B1220] text-2xl md:text-3xl tracking-tight">
                    {aiops.name}
                  </h2>
                  <StatusChip status="early" />
                </div>
                <p className="mt-2 text-[#475569] leading-relaxed max-w-2xl">{aiops.blurb}</p>
                <p className="mt-3 text-sm text-[#475569] leading-relaxed max-w-2xl">
                  By invitation. {OPS_STATUS.early.meaning} Agents work on your Onam Security data today. No price is
                  published.
                </p>
                <Link to="/platform/ai-operations" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#2563EB] hover:underline">
                  What Onam AIOps does <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                </Link>
              </div>
            </div>
            <BrandButton to="/request-demo" search={{ product: "aiops" }} variant="secondary">
              Ask for an invitation
            </BrandButton>
          </div>
        </div>
      </section>

      <MarketplaceStrip tone="surface" />

      <section className="bg-[#F7F9FC] border-y border-[#E5E9F0] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
              Compare plans
            </div>
            <h2 className="mt-4 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
              What's included in each Onam Security plan
            </h2>
            <p className="mt-3 text-[#475569]">
              The plans below cover Onam Security only. Onam Estate, FinOps and DRM are granted separately, per
              organisation, and are not part of any plan.
            </p>
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
