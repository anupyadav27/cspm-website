import { type LucideIcon, AlertTriangle, ArrowRight, ChevronRight } from "@/components/site/icons";
import { OverviewSheet } from "@/components/site/OverviewSheet";
import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { ProductDemo, type ClipKey } from "@/components/site/DemoVideos";
import { HeroIllustration, type HeroImage } from "@/components/site/HeroIllustration";
import { VideoSection } from "@/components/site/VideoEmbed";
import type { VideoKey } from "@/data/videos";
import { cn } from "@/lib/utils";
import { faqJsonLd } from "@/lib/seo";
import { CLOUDS, CSPM_POSTURE_RULES, FRAMEWORKS, SERVICES, fmt } from "@/lib/product-facts";

export type FaqItem = { q: string; a: string };
export type RelatedLink = { label: string; href: string };

export type ProductPageData = {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  question: string;
  headline: string;
  sub: string;
  /** <meta name="description">, max 155 chars, keyword first. Falls back to `sub`. */
  metaDescription?: string;
  painPoint: string;
  mechanism: string[];
  whatYouGet: string[];
  faqs: FaqItem[];
  related: RelatedLink[];
  chips?: string[];
  /** Which product-demo clips to show in the "See it live" section. */
  demoClips?: ClipKey[];
  /** Hide the "See it live" section when no console clip shows this capability. */
  hideDemo?: boolean;
  /** Reviewed header illustration shown under the hero stats. */
  heroImage?: HeroImage;
  /** Hero stat tiles; defaults to the platform-wide four. */
  stats?: { v: string; l: string }[];
  /** Side card in "Why it matters"; defaults to the detection framing. */
  risk?: { title: string; body: string; tagline: string };
  /** Closing CTA heading suffix and line; default to the connect-your-cloud framing. */
  ctaWhere?: string;
  ctaLine?: string;
  /** The product's own docs; engine pages (/platform/*) default to Onam Security's. */
  docsHref?: string;
  /** Preselects the product on /request-demo; engine pages default to "security". */
  demoProduct?: "security" | "estate" | "finops" | "drm" | "aiops";
};

/** Onam Security's docs home — the same link the Products menu uses for Security. */
const SECURITY_DOCS = "/docs/security/overview";

/** Engine pages live under /platform/*; they belong to Onam Security. */
function useEngineContext(data: ProductPageData) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isEngine = pathname.startsWith("/platform/");
  const product = data.demoProduct ?? (isEngine ? "security" : undefined);
  return {
    isEngine,
    docsHref: data.docsHref ?? (isEngine ? SECURITY_DOCS : "/docs"),
    demoSearch: product ? { product } : undefined,
  };
}

const defaultStats = [
  { v: fmt(CSPM_POSTURE_RULES), l: "posture rules" },
  { v: String(CLOUDS), l: "cloud providers" },
  { v: String(SERVICES), l: "cloud services" },
  { v: String(FRAMEWORKS), l: "compliance frameworks" },
];

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

function Hero({ data }: { data: ProductPageData }) {
  const ctx = useEngineContext(data);
  return (
    <section className="relative overflow-hidden border-b border-[#E5E9F0] bg-white">
      
      <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-16 md:pt-28 md:pb-20">
        {ctx.isEngine && (
          <nav aria-label="Breadcrumb" className="-mt-12 mb-10 flex">
            <ol className="flex items-center gap-1.5 text-sm text-muted-500">
              <li>
                <Link to="/platform" className="font-medium hover:text-brand-500 transition">
                  Onam Security
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="w-3.5 h-3.5 text-subtle" />
              </li>
              <li aria-current="page" className="font-semibold text-ink">
                {data.label}
              </li>
            </ol>
          </nav>
        )}
        <div className="max-w-3xl">
        <p className="text-[15px] font-semibold text-[#1D4ED8]">{data.question}</p>
        <h1 className="mt-3 font-display font-bold text-[#0B1220] text-4xl md:text-5xl tracking-tight leading-[1.1]">
          {data.headline}
        </h1>
        <p className="mt-6 text-lg text-[#475569] leading-relaxed">{data.sub}</p>
        </div>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <BrandButton to="/request-demo" search={ctx.demoSearch} size="lg">See it in my cloud <ArrowRight className="w-4 h-4" /></BrandButton>
          <BrandButton to={ctx.docsHref} size="lg" variant="secondary">Read the docs</BrandButton>
        </div>

        <dl className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-y-6 border-t border-[#E5E9F0] pt-6">
          {(data.stats ?? defaultStats).map((s) => (
            <div key={s.l} className="pr-6">
              <dt className="order-2 text-sm text-[#64748B] mt-1">{s.l}</dt>
              <dd className="text-2xl font-display font-bold text-[#0B1220]">{s.v}</dd>
            </div>
          ))}
        </dl>
      </div>
      {data.heroImage && (
        <div className="relative px-6 pb-16">
          <HeroIllustration image={data.heroImage} />
        </div>
      )}
    </section>
  );
}

function StickyNav({ data }: { data: ProductPageData }) {
  const visible = anchors.filter((a) => !(data.hideDemo && a.id === "live-demo"));
  return (
    <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-xl border-b border-[#E5E9F0]">
      <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-center gap-1 overflow-x-auto">
        {visible.map((a) => (
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
  const risk = data.risk;
  return (
    <section id="why-it-matters" className="bg-[#F7F9FC] border-b border-[#E5E9F0] py-24">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-5 gap-10">
        <div className={risk ? "lg:col-span-3" : "lg:col-span-5 max-w-3xl"}>
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#1D4ED8]">
            Why this matters
          </div>
          <h2 className="mt-2 font-display font-bold text-[#0B1220] text-2xl md:text-3xl leading-tight tracking-tight">
            {first}
          </h2>
          <p className="mt-5 text-[#475569] leading-relaxed text-base">{rest.join(" ")}</p>
        </div>
        {risk && <div className="lg:col-span-2">
          <div className="h-full bg-white border border-[#E5E9F0] rounded-2xl p-6 shadow-[0_1px_2px_rgba(16,24,40,.04),0_1px_3px_rgba(16,24,40,.06)]">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl grid place-items-center shrink-0 bg-[#FDECEA]">
                <AlertTriangle className="w-5 h-5 text-[#E32D25]" />
              </div>
              <div>
                <h3 className="font-display font-bold text-[#0B1220] text-lg">{risk.title}</h3>
                <p className="mt-2 text-sm text-[#475569] leading-relaxed">{risk.body}</p>
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-[#E5E9F0] flex items-center gap-2 text-xs text-[#475569]">
              <span className="inline-flex w-2 h-2 rounded-full bg-[#E32D25]" />
              <span className="font-medium">{risk.tagline}</span>
            </div>
          </div>
        </div>}
      </div>
    </section>
  );
}

function HowItWorks({ data }: { data: ProductPageData }) {
  return (
    <section id="how-it-works" className="py-24 border-b border-[#E5E9F0] bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#1D4ED8]">
          How it works
        </div>
        <h2 className="mt-2 font-display font-bold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
          How {data.label} works
        </h2>
      </div>
      <div className="mt-10 max-w-4xl mx-auto px-6">
        <ol className="divide-y divide-[#E5E9F0] border-y border-[#E5E9F0]">
          {data.mechanism.map((step, i) => (
            <li key={i} className="py-5 flex gap-5 items-start">
              <div className="w-6 shrink-0 pt-1.5 font-mono text-sm text-[#64748B]">
                {String(i + 1).padStart(2, "0")}
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
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#1D4ED8]">
            What you get
          </div>
          <h2 className="mt-2 font-display font-bold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
            What you see in the console
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

        <dl className="mt-12 max-w-5xl mx-auto bg-white border border-[#E5E9F0] rounded-2xl divide-y divide-[#E5E9F0]">
          {data.whatYouGet.map((b) => {
            const { title, desc } = splitBullet(b);
            return (
              <div key={b} className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-1 md:gap-8 px-6 py-5">
                <dt className="font-display font-bold text-[#0B1220] leading-snug">{title}</dt>
                <dd className="text-sm text-[#475569] leading-relaxed">{desc}</dd>
              </div>
            );
          })}
        </dl>
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
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#1D4ED8]">
            FAQ
          </div>
          <h2 className="mt-2 font-display font-bold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
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
  const ctx = useEngineContext(data);
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.4fr_1fr] gap-8">
        <div className="gradient-border rounded-3xl p-10 md:p-12">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#1D4ED8]">
            Next step
          </div>
          <h2 className="mt-2 font-display font-bold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
            See {data.label} {data.ctaWhere ?? "on your own cloud"}
          </h2>
          <p className="mt-4 text-[#475569] max-w-lg">
            {data.ctaLine ?? "Book a 30-minute demo. We walk through it on sample data, or on one of your accounts if you want to connect it."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <BrandButton to="/request-demo" search={ctx.demoSearch} size="lg">Book a live demo →</BrandButton>
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

export function ProductPageTemplate({
  data,
  extra,
  video,
}: {
  data: ProductPageData;
  extra?: ReactNode;
  /** Short Q&A video (click-to-play) shown after "Why it matters". */
  video?: VideoKey;
}) {
  return (
    <SiteLayout>
      <Hero data={data} />
      <StickyNav data={data} />
      <WhyItMatters data={data} />
      {video && <VideoSection video={video} title={`${data.label} in two minutes`} />}
      <HowItWorks data={data} />
      <WhatYouGet data={data} />
      {!data.hideDemo && (
        <ProductDemo
          id="live-demo"
          compact
          tone="white"
          clips={data.demoClips ?? ["dashboard", "scan"]}
          eyebrow="See it live"
          title={`${data.label} in the real console.`}
          gradientWords="real console."
          subtitle="A recreation of the Onam console with sample data — the screens and finding types your team works with."
        />
      )}
      {extra}
      <OverviewSheet />
      <Faqs data={data} />
      <CtaAndRelated data={data} />
    </SiteLayout>
  );
}
