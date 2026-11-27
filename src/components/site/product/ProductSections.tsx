import { Check } from "@/components/site/icons";
import type { Outcome, ProductSections } from "@/data/product-sections.types";
import type { ProductScreen } from "@/data/product-screens";

/**
 * "How it works" and "What you get" for product pages (UX spec: research_notes/Product update Nov 2026/
 * reviews/product_sections_design.md).
 *
 * How it works: a numbered flow, one verb-led step per stage, each with an optional proof chip, laid out
 * left to right on desktop and as a timeline on phones.
 * What you get: outcome cards, then the real console capture for the product (when one exists), wide
 * enough to read, so the claims and the screen that proves them sit in the same section.
 */

const SEVERITY: Record<string, string> = {
  critical: "bg-[#FDECEA] text-[#B42318] ring-[#F5C2BD]",
  high: "bg-[#FFF1E6] text-[#B54708] ring-[#F9D0AE]",
  medium: "bg-[#FEF7E0] text-[#8A6100] ring-[#F2DC9B]",
  low: "bg-[#EFF4FF] text-[#1D4ED8] ring-[#C7D7FE]",
};

function Chip({ label }: { label: string }) {
  const sev = SEVERITY[label.toLowerCase()];
  return (
    <li
      className={`rounded-md px-2 py-1 text-[12px] font-semibold ring-1 ${
        sev ?? "bg-surface text-navy-600 ring-line"
      }`}
    >
      {label}
    </li>
  );
}

export function HowItWorksFlow({ label, sections }: { label: string; sections: ProductSections }) {
  const n = sections.steps.length;
  const cols = n >= 5 ? "lg:grid-cols-5" : n === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  return (
    <section id="how-it-works" className="border-b border-line bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-brand-700">How {label} works</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            {sections.stepsHeading}
          </h2>
        </div>

        <ol className={`relative mt-12 grid gap-0 lg:gap-6 ${cols}`}>
          {sections.steps.map((s, i) => {
            const Icon = s.icon;
            const last = i === n - 1;
            return (
              <li key={s.title} className="relative flex gap-5 pb-10 last:pb-0 lg:flex-col lg:gap-0 lg:pb-0">
                {/* Connector to the next step: a vertical rail on phones, a line across the gap on desktop. */}
                {!last && (
                  <>
                    <div aria-hidden className="absolute bottom-0 left-7 top-14 w-px bg-line lg:hidden" />
                    <div
                      aria-hidden
                      className="absolute -right-6 left-[72px] top-7 hidden h-px bg-gradient-to-r from-[#BFD3FF] to-[#DCE6F7] lg:block"
                    />
                  </>
                )}
                <div className="relative z-10 w-14 shrink-0">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-brand-600 shadow-[0_1px_2px_rgba(16,24,40,.06),0_8px_20px_rgba(37,99,235,.10)] ring-1 ring-[#D6E2FB]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-ink text-[12px] font-bold text-white ring-2 ring-white">
                    {i + 1}
                  </span>
                </div>
                <div className="min-w-0 lg:mt-6 lg:pr-2">
                  <h3 className="font-display text-[18px] font-bold leading-snug text-ink">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-body">{s.body}</p>
                  {s.proof && (
                    <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-tint-blue px-3 py-1 text-[13px] font-semibold text-brand-700">
                      <Check className="h-3.5 w-3.5" aria-hidden />
                      {s.proof}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function OutcomeCard({ o }: { o: Outcome }) {
  const Icon = o.icon;
  return (
    <li
      className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,.04)] transition hover:border-[#C7D7FE] hover:shadow-[0_8px_24px_rgba(16,24,40,.06)]"
    >
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-tint-blue text-brand-600">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-[17px] font-bold leading-snug text-ink">{o.title}</h3>
        <p className="mt-1.5 text-[14.5px] leading-relaxed text-body">{o.body}</p>
        {o.chips && o.chips.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`${o.title}: examples`}>
            {o.chips.map((c) => (
              <Chip key={c} label={c} />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

export function WhatYouGetGrid({
  label,
  sections,
  screen,
}: {
  label: string;
  sections: ProductSections;
  screen?: ProductScreen;
}) {
  return (
    <section id="what-you-get" className="border-b border-line bg-surface py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-brand-700">What you get</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            {sections.outcomesHeading}
          </h2>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sections.outcomes.map((o) => (
            <OutcomeCard key={o.title} o={o} />
          ))}
        </ul>

        {screen && (
          <figure className="mx-auto mt-14 max-w-6xl">
            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(16,24,40,.04),0_24px_48px_rgba(16,24,40,.10)]">
              <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#E2E8F0]" aria-hidden />
                <span className="h-2.5 w-2.5 rounded-full bg-[#E2E8F0]" aria-hidden />
                <span className="h-2.5 w-2.5 rounded-full bg-[#E2E8F0]" aria-hidden />
                <span className="ml-2 truncate text-[12px] font-semibold text-navy-600">Onam console · {label}</span>
                <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-[#E7F6EE] px-2 py-0.5 text-[12px] font-bold text-[#0F6B3D]">
                  <Check className="h-3 w-3" aria-hidden /> Real capture
                </span>
              </div>
              <img
                src={screen.src}
                srcSet={`${screen.src} 1x, ${screen.src.replace(/\.webp$/, "@2x.webp")} 2x`}
                width={screen.width}
                height={screen.height}
                alt={screen.alt}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full"
              />
            </div>
            <figcaption className="mt-3 text-center text-[13px] leading-relaxed text-muted-500">{screen.caption}</figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}
