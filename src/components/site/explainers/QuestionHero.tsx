import type { ReactNode } from "react";
import { Backdrop } from "@/components/site/system";
import { ArrowRight, ArrowDown } from "@/components/site/icons";

/**
 * :::hero night            (or `light` for deep pages)
 * pill: AI SECURITY · AI-SPM
 * eyebrow: How does Onam find AI we didn't list?      (light variant: the customer's question)
 * title: AI Security: find every AI you run, see what's exposed and what it can reach.
 * lead: One or two sentences, ≤ 30 words.
 * chips: AWS · Azure · Google Cloud · Kubernetes
 * cta: Run a free audit scan | /audit-scan
 * secondary: See the 2-minute story | #story
 * visual: lensmap ai-estate        (optional: any explainer the page's Prose can render)
 * :::
 *
 * Renders the page's only <h1>; docs.$.tsx skips its own H1 when a body starts with :::hero.
 */
export function QuestionHero({
  variant,
  pill,
  eyebrow,
  title,
  lead,
  chips,
  cta,
  secondary,
  visual,
}: {
  variant: "night" | "light";
  pill?: string;
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  chips?: string[];
  cta?: { label: string; href: string } | null;
  secondary?: { label: string; href: string } | null;
  visual?: ReactNode;
}) {
  const night = variant === "night";
  return (
    <header
      className={`relative isolate overflow-hidden -mx-4 sm:mx-0 sm:rounded-2xl ${
        night ? "bg-night text-white" : "bg-surface text-ink border border-line"
      } px-5 py-7 sm:px-8 md:py-8`}
    >
      <Backdrop tone={night ? "night" : "light"} pattern="graph" />
      <div className={`relative grid gap-8 ${visual ? "xl:grid-cols-[0.82fr_1.18fr] xl:items-center" : ""}`}>
        <div className="max-w-[60ch]">
          {pill && (
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-bold uppercase tracking-[0.12em] ${
                night ? "bg-white/10 text-[#BFD3FF] ring-1 ring-white/15" : "bg-tint-blue text-brand-700"
              }`}
            >
              {pill}
            </span>
          )}
          {eyebrow && (
            <p className={`mt-4 text-[15px] font-semibold ${night ? "text-[#BFD3FF]" : "text-brand-700"}`}>{eyebrow}</p>
          )}
          <h1
            className={`mt-3 font-display font-black tracking-tight text-[32px] leading-[36px] md:text-[44px] md:leading-[48px] ${
              night ? "text-white" : "text-ink"
            }`}
          >
            {title}
          </h1>
          {lead && (
            <p className={`mt-4 text-[17px] leading-[28px] md:text-[18px] md:leading-[30px] ${night ? "text-on-night-muted" : "text-body"}`}>
              {lead}
            </p>
          )}
          {chips && chips.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Covers">
              {chips.map((c) => (
                <li
                  key={c}
                  className={`rounded-full px-3 py-1 text-[13px] font-semibold ${
                    night ? "bg-night-2 text-[#DCE6F7] ring-1 ring-white/10" : "bg-white text-navy-600 ring-1 ring-line"
                  }`}
                >
                  {c}
                </li>
              ))}
            </ul>
          )}
          {(cta || secondary) && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {cta && (
                <a
                  href={cta.href}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand-500 px-5 text-[15px] font-semibold text-white transition hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4D8DFF]"
                >
                  {cta.label} <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              )}
              {secondary && (
                <a
                  href={secondary.href}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-4 text-[15px] font-semibold transition ${
                    night ? "text-white ring-1 ring-white/25 hover:bg-white/10" : "text-ink ring-1 ring-line-strong hover:bg-white"
                  }`}
                >
                  {secondary.label} <ArrowDown className="h-4 w-4" aria-hidden />
                </a>
              )}
            </div>
          )}
        </div>
        {visual && <div className="min-w-0">{visual}</div>}
      </div>
    </header>
  );
}
