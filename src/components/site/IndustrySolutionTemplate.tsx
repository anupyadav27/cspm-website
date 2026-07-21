import { useState } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, type LucideIcon } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { ProductDemo } from "@/components/site/DemoVideos";
import { cn } from "@/lib/utils";
import { faqJsonLd } from "@/lib/seo";

export type IndustryUseCase = { icon: LucideIcon; iconColor: string; title: string; body: string };
export type IndustryFeature = { title: string; body: string };
export type IndustryRegulation = { name: string; note: string };
export type IndustryStat = { value: string; label: string };
export type IndustryFaq = { q: string; a: string };

export type IndustrySolutionData = {
  breadcrumb: string;
  headline: string;
  sub: string;
  industryName: string;
  stats: IndustryStat[];
  useCases: IndustryUseCase[];
  regulations: IndustryRegulation[];
  whyChoose: IndustryFeature[];
  faqs: IndustryFaq[];
};

function Hero({ data }: { data: IndustrySolutionData }) {
  return (
    <section className="relative overflow-hidden border-b border-[#E5E9F0] bg-white">
      <div className="absolute inset-0 dot-grid opacity-60" />
      <div className="absolute -top-40 right-1/4 w-[600px] h-[500px] rounded-full bg-[#2563EB]/10 blur-[140px] pointer-events-none" />
      <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#64748B]">{data.breadcrumb}</div>
        <h1 className="mt-5 font-display font-black text-[#0B1220] text-4xl md:text-5xl lg:text-[56px] tracking-tight leading-[1.05]">
          {data.headline}
        </h1>
        <p className="mt-6 text-lg text-[#475569] max-w-3xl mx-auto leading-relaxed">{data.sub}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <BrandButton to="/request-demo" size="lg">Book a live demo <ArrowRight className="w-4 h-4" /></BrandButton>
          <BrandButton to="/platform" size="lg" variant="secondary">Explore the platform</BrandButton>
        </div>
      </div>
    </section>
  );
}

function StatStrip({ stats }: { stats: IndustryStat[] }) {
  return (
    <section className="bg-white border-b border-[#E5E9F0]">
      <div className={cn("max-w-7xl mx-auto px-6 py-10 grid divide-x divide-[#E5E9F0]", stats.length === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-2 md:grid-cols-4")}>
        {stats.map((s, i) => (
          <div key={i} className="px-6 first:pl-0 last:pr-0 text-center md:text-left">
            <div className="text-2xl md:text-3xl font-display font-black text-[#0B1220]">{s.value}</div>
            <div className="mt-1 text-[11px] uppercase tracking-widest text-[#64748B] font-semibold">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function UseCases({ data }: { data: IndustrySolutionData }) {
  return (
    <section className="bg-[#F7F9FC] border-b border-[#E5E9F0] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
            Use cases
          </div>
          <h2 className="mt-4 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
            What {data.industryName} teams solve with Onam
          </h2>
        </div>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.useCases.map((u) => {
            const Icon = u.icon;
            return (
              <div key={u.title} className="bg-white border border-[#E5E9F0] rounded-2xl p-6 shadow-[0_1px_2px_rgba(16,24,40,.04),0_1px_3px_rgba(16,24,40,.06)]">
                <div
                  className="w-12 h-12 rounded-xl grid place-items-center"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${u.iconColor} 12%, #FFFFFF)`,
                    boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${u.iconColor} 22%, transparent)`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: u.iconColor }} />
                </div>
                <h3 className="mt-5 font-display font-bold text-[#0B1220] text-lg">{u.title}</h3>
                <p className="mt-2 text-sm text-[#475569] leading-relaxed">{u.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Regulations({ data }: { data: IndustrySolutionData }) {
  return (
    <section className="bg-white border-b border-[#E5E9F0] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
            Compliance
          </div>
          <h2 className="mt-4 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
            Regulations & frameworks we map to
          </h2>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {data.regulations.map((r) => (
            <span key={r.name} className="px-3 py-2 rounded-lg text-xs font-semibold text-[#0B1220] bg-[#F1F5F9] border border-[#E5E9F0]">
              {r.name}
            </span>
          ))}
        </div>
        <div className="mt-10 grid md:grid-cols-2 gap-4">
          {data.regulations.map((r) => (
            <div key={r.name} className="border border-[#E5E9F0] rounded-xl p-5 bg-white">
              <div className="font-display font-bold text-[#0B1220]">{r.name}</div>
              <p className="mt-1.5 text-sm text-[#475569] leading-relaxed">{r.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChoose({ data }: { data: IndustrySolutionData }) {
  return (
    <section className="bg-[#F8FAFC] border-b border-[#E5E9F0] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
            Why Onam
          </div>
          <h2 className="mt-4 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
            Why {data.industryName} teams choose Onam
          </h2>
        </div>
        <div className="mt-12 grid md:grid-cols-2 gap-4">
          {data.whyChoose.map((f) => (
            <div key={f.title} className="bg-white border border-[#E5E9F0] rounded-2xl p-6 flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-[#EFF4FF] grid place-items-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <h3 className="font-display font-bold text-[#0B1220]">{f.title}</h3>
                <p className="mt-1.5 text-sm text-[#475569] leading-relaxed">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faqs({ faqs }: { faqs: IndustryFaq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-white border-b border-[#E5E9F0] py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
      />
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
            FAQ
          </div>
          <h2 className="mt-4 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">Questions we get a lot</h2>
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
                  <span className={cn(
                    "shrink-0 w-7 h-7 rounded-full grid place-items-center border border-[#E5E9F0] text-[#475569] transition-transform",
                    isOpen && "rotate-45 border-[#2563EB] text-[#2563EB] bg-[#EFF4FF]",
                  )}>+</span>
                </button>
                {isOpen && <div className="px-6 pb-6 text-[#475569] leading-relaxed">{f.a}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CTA({ data }: { data: IndustrySolutionData }) {
  return (
    <section className="bg-white py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="rounded-3xl border border-[#DBE7FE] bg-gradient-to-br from-[#EFF4FF] to-white p-10 md:p-14 text-center">
          <div className="inline-flex w-12 h-12 rounded-xl bg-[#2563EB] text-white items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="mt-5 font-display font-black text-[#0B1220] text-3xl md:text-4xl tracking-tight">
            Bring continuous compliance to your {data.industryName} cloud
          </h2>
          <p className="mt-4 text-[#475569] max-w-xl mx-auto">Continuous evidence, mapped to your frameworks, ready before your next audit.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <BrandButton to="/request-demo" size="lg">Book a demo →</BrandButton>
            <BrandButton to="/pricing" size="lg" variant="secondary">See pricing</BrandButton>
          </div>
        </div>
      </div>
    </section>
  );
}

export function IndustrySolutionTemplate({ data }: { data: IndustrySolutionData }) {
  return (
    <SiteLayout>
      <Hero data={data} />
      <StatStrip stats={data.stats} />
      <UseCases data={data} />
      <Regulations data={data} />
      <WhyChoose data={data} />
      <ProductDemo
        compact
        tone="white"
        clips={["compliance", "risk", "datasec"]}
        eyebrow="See it live"
        title="Evidence, in the real console."
        gradientWords="real console."
        subtitle="The actual Onam console on a live demo account — compliance scores, dollar-quantified risk and data classification."
      />
      <Faqs faqs={data.faqs} />
      <CTA data={data} />
    </SiteLayout>
  );
}
