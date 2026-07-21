import { type LucideIcon, AlertTriangle, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { ProductDemo, type ClipKey } from "@/components/site/DemoVideos";
import { cn } from "@/lib/utils";
import { faqJsonLd } from "@/lib/seo";

export type FaqItem = { q: string; a: string };
export type RelatedLink = { label: string; href: string };

export type ProductPageData = {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  question: string;
  headline: string;
  sub: string;
  painPoint: string;
  mechanism: string[];
  whatYouGet: string[];
  faqs: FaqItem[];
  related: RelatedLink[];
  chips?: string[];
  /** Which product-demo clips to show in the "See it live" section. */
  demoClips?: ClipKey[];
};

const anchors = [
  { id: "why-it-matters", label: "Why it matters" },
  { id: "how-it-works", label: "How it works" },
  { id: "what-you-get", label: "What you get" },
  { id: "live-demo", label: "See it live" },
  { id: "faq", label: "FAQ" },
];

function splitBullet(b: string): { title: string; desc: string } {
  const idx = Math.min(
    ...[" — ", ": "].map((s) => {
      const i = b.indexOf(s);
      return i === -1 ? Number.POSITIVE_INFINITY : i;
    }),
  );
  if (!Number.isFinite(idx)) return { title: b, desc: "" };
  const sep = b.slice(idx, idx + (b.slice(idx).startsWith(" — ") ? 3 : 2));
  return { title: b.slice(0, idx).trim(), desc: b.slice(idx + sep.length).trim() };
}

function IconTile({ Icon, color, size = "lg" }: { Icon: LucideIcon; color: string; size?: "lg" | "sm" }) {
  const dim = size === "lg" ? "w-16 h-16" : "w-10 h-10";
  const iconSize = size === "lg" ? "w-7 h-7" : "w-5 h-5";
  return (
    <div
      className={cn(dim, "rounded-2xl grid place-items-center")}
      style={{
        backgroundColor: `color-mix(in srgb, ${color} 12%, #FFFFFF)`,
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${color} 22%, transparent)`,
      }}
    >
      <Icon className={iconSize} style={{ color }} strokeWidth={2} />
    </div>
  );
}

function Hero({ data }: { data: ProductPageData }) {
  return (
    <section className="relative overflow-hidden border-b border-[#E5E9F0] bg-white">
      <div className="absolute inset-0 dot-grid opacity-60" />
      <div className="absolute -top-40 right-1/4 w-[600px] h-[500px] rounded-full blur-[140px] opacity-40 pointer-events-none"
           style={{ backgroundColor: data.iconColor + "22" }} />
      <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-16 text-center animate-slide-up">
        <div className="flex justify-center">
          <IconTile Icon={data.icon} color={data.iconColor} />
        </div>
        <div className="mt-6 inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#F1F5F9] text-[#334155] border border-[#E5E9F0]">
          {data.label}
        </div>
        <p className="mt-6 text-[#2563EB] text-lg font-semibold tracking-tight">{data.question}</p>
        <h1 className="mt-3 font-display font-black text-[#0B1220] text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
          {data.headline}
        </h1>
        <p className="mt-6 text-lg text-[#475569] leading-relaxed max-w-2xl mx-auto">{data.sub}</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <BrandButton to="/request-demo" size="lg">See it in my cloud <ArrowRight className="w-4 h-4" /></BrandButton>
          <BrandButton to="/docs" size="lg" variant="secondary">Read the docs</BrandButton>
        </div>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { v: "10,000+", l: "security rules" },
            { v: "7", l: "cloud providers" },
            { v: "< 5 min", l: "to first finding" },
            { v: "100%", l: "agentless" },
          ].map((s) => (
            <div key={s.l} className="bg-white border border-[#E5E9F0] rounded-xl px-4 py-4 shadow-[0_1px_2px_rgba(16,24,40,.04)]">
              <div className="text-xl md:text-2xl font-display font-black text-[#0B1220]">{s.v}</div>
              <div className="text-[11px] uppercase tracking-widest text-[#64748B] mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StickyNav() {
  return (
    <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-xl border-b border-[#E5E9F0]">
      <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-center gap-1 overflow-x-auto">
        {anchors.map((a) => (
          <a key={a.id} href={`#${a.id}`}
             className="px-3 py-1.5 text-xs md:text-sm font-medium text-[#64748B] hover:text-[#2563EB] transition whitespace-nowrap">
            {a.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function WhyItMatters({ data }: { data: ProductPageData }) {
  const [first, ...rest] = data.painPoint.split(/(?<=[.!?])\s+/);
  return (
    <section id="why-it-matters" className="bg-[#F7F9FC] border-b border-[#E5E9F0] py-24">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
            Why this matters
          </div>
          <p className="mt-5 font-display font-extrabold text-[#0B1220] text-2xl md:text-3xl leading-tight tracking-tight">
            {first}
          </p>
          <p className="mt-5 text-[#475569] leading-relaxed text-base">{rest.join(" ")}</p>
        </div>
        <div className="lg:col-span-2">
          <div className="h-full bg-white border border-[#E5E9F0] rounded-2xl p-6 shadow-[0_1px_2px_rgba(16,24,40,.04),0_1px_3px_rgba(16,24,40,.06)]">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl grid place-items-center shrink-0 bg-[#FDECEA]">
                <AlertTriangle className="w-5 h-5 text-[#E32D25]" />
              </div>
              <div>
                <h3 className="font-display font-bold text-[#0B1220] text-lg">The risk of not knowing</h3>
                <p className="mt-2 text-sm text-[#475569] leading-relaxed">
                  If it is not surfaced today, it is exposed today. Attackers do not wait for your quarterly review — and neither do auditors.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-[#E5E9F0] flex items-center gap-2 text-xs text-[#475569]">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-[#E32D25] opacity-70 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-[#E32D25]" />
              </span>
              <span className="font-medium">Real-time detection, not periodic audits</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks({ data }: { data: ProductPageData }) {
  return (
    <section id="how-it-works" className="py-24 border-b border-[#E5E9F0] bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
          How does it actually work?
        </div>
        <h2 className="mt-5 font-display font-extrabold text-[#0B1220] text-4xl md:text-5xl tracking-tight">
          The mechanism, <span className="gradient-text">not the marketing</span>
        </h2>
      </div>
      <div className="mt-14 max-w-4xl mx-auto px-6">
        <ol className="space-y-4">
          {data.mechanism.map((step, i) => (
            <li key={i} className="bg-white border border-[#E5E9F0] rounded-xl p-5 flex gap-4 items-start shadow-[0_1px_2px_rgba(16,24,40,.04)]">
              <div className="w-9 h-9 shrink-0 rounded-full grid place-items-center bg-[#2563EB] text-white font-display font-black text-sm">
                {i + 1}
              </div>
              <p className="text-[#334155] leading-relaxed pt-1.5">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function WhatYouGet({ data }: { data: ProductPageData }) {
  return (
    <section id="what-you-get" className="bg-[#F7F9FC] border-b border-[#E5E9F0] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
            What do you actually get?
          </div>
          <h2 className="mt-5 font-display font-extrabold text-[#0B1220] text-4xl md:text-5xl tracking-tight">
            Specific outputs, <span className="gradient-text">measurable outcomes</span>
          </h2>
        </div>

        {data.chips && data.chips.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 justify-center">
            {data.chips.map((c) => (
              <span key={c} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0B1220] bg-white border border-[#E5E9F0]">
                {c}
              </span>
            ))}
          </div>
        )}

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.whatYouGet.map((b) => {
            const { title, desc } = splitBullet(b);
            return (
              <div key={b} className="bg-white border border-[#E5E9F0] rounded-2xl p-6 shadow-[0_1px_2px_rgba(16,24,40,.04),0_1px_3px_rgba(16,24,40,.06)] hover:shadow-[0_12px_28px_rgba(16,24,40,.10)] hover:-translate-y-0.5 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg grid place-items-center bg-[#EFF4FF] shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-[#0B1220] leading-snug">{title}</div>
                    {desc && <div className="mt-1.5 text-sm text-[#475569] leading-relaxed">{desc}</div>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Faqs({ data }: { data: ProductPageData }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24 border-b border-[#E5E9F0] bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(data.faqs)) }}
      />
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
            FAQ
          </div>
          <h2 className="mt-5 font-display font-extrabold text-[#0B1220] text-4xl md:text-5xl tracking-tight">
            Questions we get a lot
          </h2>
        </div>
        <div className="mt-12 space-y-3">
          {data.faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="bg-white border border-[#E5E9F0] rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-[#F8FAFC] transition"
                >
                  <span className="font-display font-semibold text-[#0B1220] text-base md:text-lg">{f.q}</span>
                  <span
                    className={cn(
                      "shrink-0 w-7 h-7 rounded-full grid place-items-center border border-[#E5E9F0] text-[#475569] transition-transform",
                      isOpen && "rotate-45 border-[#2563EB] text-[#2563EB] bg-[#EFF4FF]",
                    )}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 -mt-1 text-[#475569] leading-relaxed animate-fade-in">{f.a}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CtaAndRelated({ data }: { data: ProductPageData }) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.4fr_1fr] gap-8">
        <div className="gradient-border rounded-3xl p-10 md:p-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
            <Sparkles className="w-3.5 h-3.5" /> Ready to see it live
          </div>
          <h2 className="mt-5 font-display font-black text-[#0B1220] text-3xl md:text-4xl tracking-tight">
            Ready to see <span className="gradient-text">{data.label}</span> in your cloud?
          </h2>
          <p className="mt-4 text-[#475569] max-w-lg">
            Connect a read-only role in three minutes. Your first findings surface in under five.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <BrandButton to="/request-demo" size="lg">Book a live demo →</BrandButton>
            <BrandButton to="/pricing" size="lg" variant="secondary">See pricing</BrandButton>
          </div>
        </div>

        <div className="bg-white border border-[#E5E9F0] rounded-2xl p-6 shadow-[0_1px_2px_rgba(16,24,40,.04),0_1px_3px_rgba(16,24,40,.06)] flex flex-col">
          <div className="text-[11px] uppercase tracking-widest text-[#64748B] font-bold">Related capabilities</div>
          <div className="mt-5 divide-y divide-[#E5E9F0] flex-1">
            {data.related.map((r) => (
              <Link key={r.href} to={r.href} className="group flex items-center justify-between py-3.5 gap-4 first:pt-0">
                <span className="text-sm font-medium text-[#0B1220] group-hover:text-[#2563EB] transition">
                  {r.label}
                </span>
                <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductPageTemplate({ data, extra }: { data: ProductPageData; extra?: ReactNode }) {
  return (
    <SiteLayout>
      <Hero data={data} />
      <StickyNav />
      <WhyItMatters data={data} />
      <HowItWorks data={data} />
      <WhatYouGet data={data} />
      <ProductDemo
        id="live-demo"
        compact
        tone="white"
        clips={data.demoClips ?? ["dashboard", "scan"]}
        eyebrow="See it live"
        title={`${data.label} in the real console.`}
        gradientWords="real console."
        subtitle="Not a mockup — the actual Onam console on a live demo account, showing exactly what your team sees."
      />
      {extra}
      <Faqs data={data} />
      <CtaAndRelated data={data} />
    </SiteLayout>
  );
}
