import { useEffect, useState } from "react";
import { Check, ChevronRight, Pause, Play } from "@/components/site/icons";
import type { ProductSections } from "@/data/product-sections.types";

/**
 * "How it works" for product pages, in the interactive-stepper pattern enterprise security sites use:
 * the stages as a list on the left (the active one opens with its description and proof, a progress
 * line runs down it and moves on to the next), and a large product-style visual on the right that
 * follows along: the whole pipeline as connected nodes, the active stage lit, its proof as the metric.
 *
 * All text is in the left list and in the page HTML (collapsed stages are only visually collapsed),
 * so the right panel is decorative (aria-hidden). Auto-advance runs only on wide screens, pauses on
 * hover or focus, stops for good once the visitor picks a stage, never runs with reduced motion, and
 * has a pause button (WCAG 2.2.2).
 */

const STEP_MS = 7000;

/** "7 clouds analysed" -> ["7", "clouds analysed"]; "Assume-role chains traced: 12 hops" -> ["12 hops", ...]. */
function metric(text: string): [string, string] | null {
  const lead = text.match(/^(\d[\d,.–]*%?)\s+(.+)$/);
  if (lead) return [lead[1], lead[2]];
  const tail = text.match(/^(.+?):\s*(\d[\d,.–]*\s*\S+)$/);
  if (tail) return [tail[2], tail[1]];
  return null;
}

function ProofInline({ text }: { text: string }) {
  const m = metric(text);
  if (m)
    return (
      <p className="inline-flex items-baseline gap-2 rounded-lg bg-tint-blue px-3 py-1.5 text-brand-700">
        <span className="font-display text-[20px] font-bold leading-none tabular-nums">{m[0]}</span>
        <span className="text-[13px] font-semibold">{m[1]}</span>
      </p>
    );
  if (text.includes(" · "))
    return (
      <ul className="flex flex-wrap gap-1.5">
        {text.split(" · ").map((t) => (
          <li
            key={t}
            className="rounded-md bg-surface px-2 py-1 text-[12px] font-semibold text-navy-600 ring-1 ring-line"
          >
            {t}
          </li>
        ))}
      </ul>
    );
  return (
    <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0F6B3D]">
      <Check className="h-4 w-4" aria-hidden /> {text}
    </p>
  );
}

/** The big proof in the visual panel. */
function ProofSpotlight({ text }: { text: string }) {
  const m = metric(text);
  if (m)
    return (
      <div>
        <div className="font-display text-[56px] font-bold leading-none tracking-tight text-white tabular-nums">
          {m[0]}
        </div>
        <div className="mt-2 text-[15px] font-medium text-on-night-muted">{m[1]}</div>
      </div>
    );
  if (text.includes(" · "))
    return (
      <ul className="flex flex-wrap gap-2">
        {text.split(" · ").map((t) => (
          <li
            key={t}
            className="rounded-lg bg-white/[0.07] px-3 py-2 text-[15px] font-semibold text-white ring-1 ring-white/15"
          >
            {t}
          </li>
        ))}
      </ul>
    );
  return (
    <p className="flex items-center gap-2 text-[17px] font-semibold text-white">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-[#10B981]/20 text-[#6EE7B7]">
        <Check className="h-4 w-4" />
      </span>
      {text}
    </p>
  );
}

function PipelinePanel({
  label,
  sections,
  active,
}: {
  label: string;
  sections: ProductSections;
  active: number;
}) {
  const steps = sections.steps;
  const n = steps.length;
  const s = steps[active];
  const Icon = s.icon;
  const next = steps[active + 1];
  return (
    <div
      aria-hidden
      className="relative overflow-hidden rounded-2xl bg-night shadow-[0_30px_80px_rgba(11,18,32,.35)] ring-1 ring-[#1E2A44]"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-night-2 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-2 text-[12px] font-semibold text-on-night-muted">
          Onam · {label} pipeline
        </span>
        <span className="ml-auto font-mono text-[12px] font-semibold text-[#93C5FD]">
          Stage {active + 1} of {n}
        </span>
      </div>

      <div className="relative p-6 sm:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.10) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Pipeline map: every stage as a node, done stages checked, the active one lit. */}
        <ol className="relative flex items-start">
          {steps.map((st, i) => {
            const NodeIcon = st.icon;
            const done = i < active;
            const on = i === active;
            return (
              <li key={st.title} className="relative flex flex-1 flex-col items-center text-center">
                {i < n - 1 && (
                  <span
                    className="absolute top-6 h-0.5 rounded"
                    style={{
                      left: "calc(50% + 32px)",
                      right: "calc(-50% + 32px)",
                      background:
                        i < active
                          ? "#60A5FA"
                          : i === active
                            ? "repeating-linear-gradient(90deg,#60A5FA 0 6px,transparent 6px 14px)"
                            : "rgba(148,163,184,.25)",
                      backgroundSize: i === active ? "28px 2px" : undefined,
                      animation: i === active ? "hiw-dash 0.9s linear infinite" : undefined,
                    }}
                  />
                )}
                <span
                  className={`relative z-10 grid h-12 w-12 place-items-center rounded-xl transition-all duration-500 ${
                    on
                      ? "bg-gradient-to-b from-[#3B82F6] to-[#1D4ED8] text-white shadow-[0_0_0_6px_rgba(59,130,246,.18),0_0_32px_rgba(59,130,246,.55)]"
                      : done
                        ? "bg-[#1E3A8A]/60 text-[#93C5FD] ring-1 ring-[#3B82F6]/50"
                        : "bg-night-2 text-[#64748B] ring-1 ring-white/10"
                  }`}
                >
                  {done ? <Check className="h-5 w-5" /> : <NodeIcon className="h-5 w-5" />}
                </span>
                <span
                  className={`mt-3 hidden px-1 text-[12px] font-semibold leading-tight sm:block ${
                    on ? "text-white" : done ? "text-[#93C5FD]" : "text-[#64748B]"
                  }`}
                >
                  {st.title}
                </span>
              </li>
            );
          })}
        </ol>

        {/* Spotlight on the active stage. key= restarts the entrance animation on every change. */}
        <div
          key={active}
          className="relative mt-8 rounded-xl bg-night-2/90 p-6 ring-1 ring-white/10 animate-[ex-pop_.45s_ease-out] motion-reduce:animate-none"
        >
          <div className="flex items-start gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#3B82F6]/15 text-[#93C5FD] ring-1 ring-[#3B82F6]/40">
              <Icon className="h-7 w-7" />
            </span>
            <div className="min-w-0">
              <div className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-[#93C5FD]">
                Stage {String(active + 1).padStart(2, "0")}
              </div>
              <div className="mt-1 font-display text-[22px] font-bold leading-snug text-white">
                {s.title}
              </div>
            </div>
          </div>
          <div className="mt-6 flex min-h-[124px] items-center border-t border-white/10 pt-6">
            {s.proof ? (
              <ProofSpotlight text={s.proof} />
            ) : (
              <p className="text-[15px] leading-relaxed text-[#CBD5E1]">{s.body}</p>
            )}
          </div>
        </div>

        <div className="relative mt-4 flex items-center justify-between text-[13px] font-medium text-on-night-muted">
          <span>{next ? "Next" : "Last stage"}</span>
          {next && (
            <span className="inline-flex items-center gap-1 text-[#DCE6F7]">
              {next.title} <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function HowItWorksStepper({
  label,
  sections,
}: {
  label: string;
  sections: ProductSections;
}) {
  const steps = sections.steps;
  const n = steps.length;
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(false); // turned on after mount, wide screens, motion allowed
  const [hold, setHold] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setAuto(wide && !calm);
  }, []);

  const pick = (i: number) => {
    setActive(i);
    setAuto(false);
  };
  const running = auto && !paused;

  return (
    <section id="how-it-works" className="relative border-b border-line bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-brand-700">How {label} works</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
              {sections.stepsHeading}
            </h2>
          </div>
          {auto && (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              className="hidden min-h-9 items-center gap-1.5 rounded-full border border-line px-3.5 text-[13px] font-semibold text-ink-2 hover:bg-surface lg:inline-flex"
            >
              {paused ? (
                <Play className="h-4 w-4" aria-hidden />
              ) : (
                <Pause className="h-4 w-4" aria-hidden />
              )}
              {paused ? "Play the walkthrough" : "Pause the walkthrough"}
            </button>
          )}
        </div>

        <div
          className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14"
          onMouseEnter={() => setHold(true)}
          onMouseLeave={() => setHold(false)}
          onFocusCapture={() => setHold(true)}
          onBlurCapture={() => setHold(false)}
        >
          <ol className="relative">
            {steps.map((s, i) => {
              const on = i === active;
              const done = i < active;
              const last = i === n - 1;
              return (
                <li key={s.title} className="relative pl-14">
                  {/* Rail between markers, with the progress line on the active stage. */}
                  {!last && (
                    <span
                      aria-hidden
                      className="absolute bottom-0 left-[19px] top-11 w-0.5 rounded bg-line"
                    />
                  )}
                  {on && running && !last && (
                    <span
                      aria-hidden
                      key={`p${active}`}
                      className="absolute bottom-0 left-[19px] top-11 w-0.5 origin-top rounded bg-brand-500"
                      style={{
                        animation: `hiw-progress ${STEP_MS}ms linear forwards`,
                        animationPlayState: hold ? "paused" : "running",
                      }}
                      onAnimationEnd={() => setActive((a) => (a + 1) % n)}
                    />
                  )}
                  {on && running && last && (
                    <span
                      aria-hidden
                      key={`p${active}`}
                      className="absolute left-[19px] top-11 h-0 w-0"
                      style={{
                        animation: `hiw-progress ${STEP_MS}ms linear forwards`,
                        animationPlayState: hold ? "paused" : "running",
                      }}
                      onAnimationEnd={() => setActive(0)}
                    />
                  )}
                  {done && !last && (
                    <span
                      aria-hidden
                      className="absolute bottom-0 left-[19px] top-11 w-0.5 rounded bg-brand-500"
                    />
                  )}

                  <span
                    aria-hidden
                    className={`absolute left-0 top-1 grid h-10 w-10 place-items-center rounded-full font-display text-[15px] font-bold transition-colors ${
                      on
                        ? "bg-brand-600 text-white shadow-[0_0_0_5px_rgba(37,99,235,.15)]"
                        : done
                          ? "bg-tint-blue text-brand-700 ring-1 ring-[#C7D7FE]"
                          : "bg-white text-navy-600 ring-1 ring-line"
                    }`}
                  >
                    {done ? <Check className="h-4 w-4" /> : i + 1}
                  </span>

                  <h3>
                    <button
                      type="button"
                      onClick={() => pick(i)}
                      aria-expanded={on}
                      aria-controls={`hiw-step-${i}`}
                      className={`flex min-h-12 w-full items-center text-left font-display text-[18px] font-bold leading-snug transition-colors ${
                        on ? "text-ink" : "text-navy-600 hover:text-ink"
                      }`}
                    >
                      <span className="sr-only">Stage {i + 1}: </span>
                      {s.title}
                    </button>
                  </h3>
                  <div
                    id={`hiw-step-${i}`}
                    className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                      on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden" inert={!on || undefined}>
                      <p className="pt-1 text-[15.5px] leading-relaxed text-body">{s.body}</p>
                      {s.proof && (
                        <div className="mt-3">
                          <ProofInline text={s.proof} />
                        </div>
                      )}
                      <div className="h-6" />
                    </div>
                  </div>
                  {!on && <div className="h-3" />}
                </li>
              );
            })}
          </ol>

          <div className="hidden lg:sticky lg:top-28 lg:block">
            <PipelinePanel label={label} sections={sections} active={active} />
          </div>
        </div>
      </div>
    </section>
  );
}
