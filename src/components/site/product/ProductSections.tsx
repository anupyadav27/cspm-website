import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check } from "@/components/site/icons";
import type { Outcome, ProductSections } from "@/data/product-sections.types";
import type { ProductScreen } from "@/data/product-screens";

/**
 * "What you get" for product pages (How it works lives in HowItWorksStepper.tsx and is deliberately
 * a different shape: dark, list + panel. This one is light, centred and plays as you arrive).
 *
 *  - The outcome cards fly in from the centre, one after another, when the section scrolls into view.
 *  - Each card opens with a small animated picture of what you get, chosen from its own tags:
 *      severities        -> a queue sorting itself Critical, High, Medium, Low (what "ranked" means)
 *      other tags        -> the tags pop in and light up in turn (integrations, formats, frameworks)
 *      no tags           -> the outcome's icon with a pulse and a check that draws itself
 *  - The real console capture sits wide underneath and scrolls slowly like a live screen.
 * Text stays short: a title and one line. Everything is static with reduced motion; all text is in
 * the HTML from the start (the animation only moves it). Keyframes: wyg-* in src/styles.css.
 */

const SEV = ["critical", "high", "medium", "low"] as const;
const SEV_STYLE: Record<string, { bar: string; chip: string; label: string }> = {
  critical: { bar: "#DC2626", chip: "bg-[#FDECEA] text-[#B42318]", label: "Critical" },
  high: { bar: "#EA580C", chip: "bg-[#FFF1E6] text-[#B54708]", label: "High" },
  medium: { bar: "#CA8A04", chip: "bg-[#FEF7E0] text-[#8A6100]", label: "Medium" },
  low: { bar: "#2563EB", chip: "bg-[#EFF4FF] text-[#1D4ED8]", label: "Low" },
};

function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

const isSeverityList = (chips?: string[]) =>
  !!chips?.length && chips.every((c) => (SEV as readonly string[]).includes(c.toLowerCase()));

const playState = (play: boolean) => (play ? "running" : "paused");

/** Severities: rows arrive shuffled, then settle into rank order. */
function RankedQueue({ play }: { play: boolean }) {
  const shuffled = [2, 0, 3, 1]; // starting slot of each severity before it sorts
  return (
    <div className="relative mx-auto h-[132px] w-full max-w-[260px]" aria-hidden>
      {SEV.map((s, i) => {
        const st = SEV_STYLE[s];
        return (
          <div
            key={s}
            className="wyg-sort absolute inset-x-0 flex h-7 items-center gap-2 rounded-lg bg-white px-2.5 shadow-[0_1px_2px_rgba(16,24,40,.06)] ring-1 ring-line"
            style={
              {
                top: i * 34,
                "--from": `${(shuffled[i] - i) * 34}px`,
                animationDelay: `${300 + i * 120}ms`,
                animationPlayState: playState(play),
              } as React.CSSProperties
            }
          >
            <span className="h-4 w-1 rounded-full" style={{ background: st.bar }} />
            <span className={`rounded px-1.5 text-[12px] font-bold ${st.chip}`}>{st.label}</span>
            <span className="h-1.5 flex-1 rounded-full bg-[#E8EDF5]" />
          </div>
        );
      })}
    </div>
  );
}

/** Tags pop in one by one, then a highlight walks across them. */
function TagBurst({ o, play }: { o: Outcome; play: boolean }) {
  const Icon = o.icon;
  const chips = o.chips ?? [];
  return (
    <div className="flex h-[132px] flex-col items-center justify-center gap-4" aria-hidden>
      <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-brand-600 text-white shadow-[0_8px_24px_rgba(37,99,235,.35)]">
        <span
          className="wyg-ping absolute inset-0 rounded-2xl ring-2 ring-brand-500"
          style={{ animationPlayState: playState(play) }}
        />
        <Icon className="h-6 w-6" />
      </span>
      <ul className="flex max-w-[300px] flex-wrap justify-center gap-1.5">
        {chips.map((c, k) => (
          <li
            key={c}
            className="wyg-pop rounded-full bg-white px-2.5 py-1 text-[12px] font-semibold text-ink-2 shadow-[0_1px_2px_rgba(16,24,40,.06)] ring-1 ring-line"
            style={
              {
                animationDelay: `${400 + k * 110}ms, ${1400 + k * 700}ms`,
                animationDuration: `.45s, ${chips.length * 700}ms`,
                animationPlayState: `${playState(play)}, ${playState(play)}`,
              } as React.CSSProperties
            }
          >
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** No tags: the icon, a pulse, and a check that draws itself. */
function CheckPulse({ o, play }: { o: Outcome; play: boolean }) {
  const Icon = o.icon;
  return (
    <div className="flex h-[132px] items-center justify-center" aria-hidden>
      <div className="relative">
        <span
          className="wyg-ring absolute inset-0 rounded-full bg-brand-500/20"
          style={{ animationPlayState: playState(play) }}
        />
        <span
          className="wyg-ring absolute inset-0 rounded-full bg-brand-500/15"
          style={{ animationDelay: "1.2s", animationPlayState: playState(play) }}
        />
        <span className="relative grid h-16 w-16 place-items-center rounded-full bg-white text-brand-600 shadow-[0_8px_24px_rgba(37,99,235,.18)] ring-1 ring-[#D6E2FB]">
          <Icon className="h-7 w-7" />
        </span>
        <svg
          viewBox="0 0 24 24"
          className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-[#10B981] p-1 text-white shadow ring-2 ring-white"
        >
          <path
            d="M5 12.5l4.2 4.2L19 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="wyg-draw"
            style={{ animationPlayState: playState(play) }}
          />
        </svg>
      </div>
    </div>
  );
}

function OutcomeCard({ o, i, play }: { o: Outcome; i: number; play: boolean }) {
  const sev = isSeverityList(o.chips);
  const col = i % 3; // where the card lands in the 3-across grid; it flies in from the centre column
  return (
    <li
      className="wyg-fly group flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(16,24,40,.04)] ring-1 ring-line transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(16,24,40,.10)] hover:ring-[#C7D7FE]"
      style={
        {
          "--dx": `${(1 - col) * 60}%`,
          animationDelay: `${i * 110}ms`,
          animationPlayState: playState(play),
        } as React.CSSProperties
      }
    >
      <div
        className="relative border-b border-line px-6 py-5"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, #EEF4FF 0%, transparent 70%), radial-gradient(#DCE6F7 1px, transparent 1px) 0 0/16px 16px, #FAFCFF",
        }}
      >
        {sev ? (
          <RankedQueue play={play} />
        ) : o.chips?.length ? (
          <TagBurst o={o} play={play} />
        ) : (
          <CheckPulse o={o} play={play} />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-[19px] font-bold leading-snug text-ink">{o.title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-body">{o.body}</p>
        {/* The tags as text for screen readers and search; the picture above shows them visually. */}
        {o.chips?.length ? <p className="sr-only">Includes: {o.chips.join(", ")}.</p> : null}
      </div>
    </li>
  );
}

function LiveScreen({
  label,
  screen,
  play,
}: {
  label: string;
  screen: ProductScreen;
  play: boolean;
}) {
  const big = screen.src.replace(/\.webp$/, "@2x.webp");
  return (
    <figure className="mx-auto mt-16 max-w-6xl">
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(16,24,40,.04),0_40px_80px_-20px_rgba(16,24,40,.18)] ring-1 ring-line">
        <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#E2E8F0]" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-[#E2E8F0]" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-[#E2E8F0]" aria-hidden />
          <span className="ml-2 truncate text-[12px] font-semibold text-navy-600">
            Onam console · {label}
          </span>
          <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#E7F6EE] px-2 py-0.5 text-[12px] font-bold text-[#0F6B3D]">
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]" />
            </span>
            Real capture
          </span>
        </div>
        <div className="relative overflow-hidden sm:h-[420px] lg:h-[520px]">
          <img
            src={screen.src}
            srcSet={`${screen.src} 1x, ${big} 2x`}
            width={screen.width}
            height={screen.height}
            alt={screen.alt}
            loading="lazy"
            decoding="async"
            className="wyg-pan block h-auto w-full"
            style={{ animationPlayState: playState(play) }}
          />
        </div>
      </div>
      <figcaption className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-[13px] leading-relaxed text-muted-500">
        <span>{screen.caption}</span>
        <a
          href={big}
          target="_blank"
          rel="noopener"
          className="inline-flex min-h-6 items-center gap-1 font-semibold text-brand-700 hover:text-brand-600"
        >
          Open full size <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </a>
      </figcaption>
    </figure>
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
  const [ref, play] = useInView<HTMLElement>();
  const n = sections.outcomes.length;
  const cols = n === 4 ? "lg:grid-cols-2 xl:grid-cols-4" : "lg:grid-cols-3";
  return (
    <section
      ref={ref}
      id="what-you-get"
      className="relative overflow-hidden border-b border-line bg-surface py-20 md:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(closest-side, #DCE7FF, transparent)" }}
      />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[13px] font-semibold text-brand-700 ring-1 ring-[#D6E2FB]">
            <Check className="h-3.5 w-3.5" aria-hidden /> What you get
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink md:text-[44px] md:leading-[1.1]">
            {sections.outcomesHeading}
          </h2>
        </div>

        <ul className={`mt-14 grid gap-6 md:grid-cols-2 ${cols}`}>
          {sections.outcomes.map((o, i) => (
            <OutcomeCard key={o.title} o={o} i={i} play={play} />
          ))}
        </ul>

        {screen && <LiveScreen label={label} screen={screen} play={play} />}
      </div>
    </section>
  );
}
