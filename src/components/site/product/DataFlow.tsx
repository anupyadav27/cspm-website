import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { LucideIcon } from "@/components/site/icons";
import { iconOf, type IconName } from "./GenericVisuals";
import { CloudLogo, cloudLogoKey } from "@/components/site/CloudLogo";

/**
 * "The whole picture" on product pages: an animated dataflow diagram in four stages.
 *
 *   inputs  ->  the Onam engine (its steps light up in turn)  ->  a small live picture  ->  what you get
 *
 * Connectors are measured from the real card positions, so they stay attached at any width, and carry
 * moving packets. Below 1024px the stages stack with animated arrows. Reduced motion: still.
 * Each product's content is a FlowSpec in src/data/product-flows.tsx; keep labels to a few words and
 * every claim inside the product's own page entry and facts.
 */

export type FlowInput = {
  /** A cloud name (rendered as the provider's logo) or a plain label. */
  label: string;
  icon?: LucideIcon | IconName;
  hint?: string;
  /** Highlighted input, e.g. audit logs. */
  accent?: boolean;
};

export type FlowOutput = {
  id: string;
  icon: LucideIcon | IconName;
  label: string;
  hint: string;
  color: string;
};

export type FlowSpec = {
  heading: string;
  intro: string;
  stages: [string, string, string, string];
  inputs: FlowInput[];
  engine: { name: string; sub: string; steps: string[]; footer?: string };
  /** The small animated picture in stage 3, and the line under it. */
  visual: ReactNode;
  visualNote: { text: string; color: string };
  outputs: FlowOutput[];
  footnote: string;
  /** Plain-text description of the whole diagram, for screen readers. */
  caption: string;
};

type Link = { d: string; color: string; delay: number };

export function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(mq.matches);
    const on = () => setR(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return r;
}

function useLinks(row: React.RefObject<HTMLDivElement | null>, spec: FlowSpec) {
  const [state, setState] = useState<{ w: number; h: number; links: Link[] }>({
    w: 0,
    h: 0,
    links: [],
  });
  useLayoutEffect(() => {
    const el = row.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      // Same breakpoint as the @4xl container variant (56rem): below it the stages stack.
      if (r.width < 896) return setState({ w: 0, h: 0, links: [] });
      const at = (id: string) =>
        el.querySelector<HTMLElement>(`[data-port="${id}"]`)?.getBoundingClientRect();
      const curve = (a: DOMRect, b: DOMRect) => {
        const x1 = a.right - r.left;
        const y1 = a.top + a.height / 2 - r.top;
        const x2 = b.left - r.left;
        const y2 = b.top + b.height / 2 - r.top;
        const mx = (x1 + x2) / 2;
        return `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
      };
      const engine = at("engine");
      const visual = at("visual");
      if (!engine || !visual) return;
      const links: Link[] = [];
      spec.inputs.forEach((inp, k) => {
        const a = at(`in-${k}`);
        if (a)
          links.push({
            d: curve(a, engine),
            color: inp.accent ? "#0891B2" : "#3B82F6",
            delay: k * 0.33,
          });
      });
      links.push({ d: curve(engine, visual), color: "#2563EB", delay: 0.2 });
      links.push({ d: curve(engine, visual), color: "#2563EB", delay: 1.1 });
      spec.outputs.forEach((o, k) => {
        const b = at(`out-${o.id}`);
        if (b) links.push({ d: curve(visual, b), color: o.color, delay: 0.4 + k * 0.3 });
      });
      setState({ w: r.width, h: r.height, links });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [row, spec]);
  return state;
}

function StageLabel({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-navy-600">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-[12px] text-white">
        {n}
      </span>
      {children}
    </div>
  );
}

function DownFlow() {
  return (
    <div className="flex justify-center py-3 @4xl:hidden" aria-hidden>
      <span className="cf-down h-10 w-0.5 rounded bg-[repeating-linear-gradient(180deg,#3B82F6_0_6px,transparent_6px_12px)] bg-[length:2px_24px]" />
    </div>
  );
}

function Engine({ engine, reduced }: { engine: FlowSpec["engine"]; reduced: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setI((x) => (x + 1) % engine.steps.length), 1300);
    return () => clearInterval(t);
  }, [reduced, engine.steps.length]);
  return (
    <div
      data-port="engine"
      className="relative rounded-2xl bg-night p-5 text-white shadow-[0_20px_50px_rgba(11,18,32,.25)] ring-1 ring-[#1E2A44]"
    >
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#60A5FA] opacity-70 motion-reduce:animate-none" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#60A5FA]" />
        </span>
        <span className="font-display text-[16px] font-bold">{engine.name}</span>
      </div>
      <p className="mt-1 text-[13px] text-on-night-muted">{engine.sub}</p>
      <ol className="mt-4 space-y-2">
        {engine.steps.map((s, k) => (
          <li
            key={s}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-semibold transition-all duration-500 ${
              k === i && !reduced
                ? "bg-[#2563EB] text-white shadow-[0_0_0_4px_rgba(37,99,235,.25)]"
                : "bg-white/[0.05] text-[#DCE6F7]"
            }`}
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/15 text-[12px]">
              {k + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>
      {engine.footer && <p className="mt-3 text-[12px] text-on-night-muted">{engine.footer}</p>}
    </div>
  );
}

function Input({ inp, k }: { inp: FlowInput; k: number }) {
  const Icon = inp.icon ? iconOf(inp.icon) : undefined;
  const logo = !Icon && cloudLogoKey(inp.label);
  if (inp.accent)
    return (
      <li
        data-port={`in-${k}`}
        className="flex min-h-11 flex-col justify-center rounded-xl bg-[#ECFEFF] px-3 py-1.5 leading-tight ring-1 ring-[#A5F3FC]"
      >
        <span className="text-[13px] font-semibold text-[#0E7490]">{inp.label}</span>
        {inp.hint && <span className="text-[12px] font-medium text-[#155E75]">{inp.hint}</span>}
      </li>
    );
  return (
    <li
      data-port={`in-${k}`}
      className="flex min-h-11 items-center gap-2.5 rounded-xl bg-white px-3 py-1.5 shadow-[0_1px_2px_rgba(16,24,40,.05)] ring-1 ring-line"
    >
      {logo ? (
        <CloudLogo
          name={inp.label}
          height={18}
          maxWidth={92}
          nameClassName="text-[13px] font-semibold text-ink-2"
        />
      ) : (
        <>
          {Icon && (
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-tint-blue text-brand-600">
              <Icon className="h-4 w-4" />
            </span>
          )}
          <span className="min-w-0 leading-tight">
            <span className="block text-[13.5px] font-semibold text-ink-2">{inp.label}</span>
            {inp.hint && <span className="block text-[12px] text-muted-500">{inp.hint}</span>}
          </span>
        </>
      )}
    </li>
  );
}

export function DataFlowDiagram({ spec }: { spec: FlowSpec }) {
  const row = useRef<HTMLDivElement>(null);
  const { w, h, links } = useLinks(row, spec);
  const reduced = useReducedMotion();

  return (
    <figure className="@container relative my-10 overflow-hidden rounded-3xl border border-line p-5 sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(#D5DFEE 1px, transparent 1.2px) 0 0/18px 18px, linear-gradient(180deg,#FBFCFF,#F4F7FC)",
        }}
      />
      <figcaption className="sr-only">{spec.caption}</figcaption>

      <div
        ref={row}
        className="relative grid items-center gap-0 @4xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1.15fr)_minmax(0,1fr)] @4xl:gap-14"
      >
        {w > 0 && (
          <svg
            className="pointer-events-none absolute inset-0 z-0 hidden @4xl:block"
            width={w}
            height={h}
            aria-hidden
          >
            {links.map((l, k) => (
              <g key={k}>
                <path d={l.d} fill="none" stroke={l.color} strokeOpacity=".22" strokeWidth="2" />
                <path
                  d={l.d}
                  fill="none"
                  stroke={l.color}
                  strokeWidth="2"
                  strokeDasharray="4 10"
                  className="cf-dash"
                  strokeOpacity=".7"
                />
                {!reduced && (
                  <circle r="4" fill={l.color}>
                    <animateMotion
                      dur="2.6s"
                      repeatCount="indefinite"
                      begin={`${l.delay}s`}
                      path={l.d}
                    />
                  </circle>
                )}
              </g>
            ))}
          </svg>
        )}

        <div className="relative z-10">
          <StageLabel n={1}>{spec.stages[0]}</StageLabel>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 @4xl:grid-cols-1">
            {spec.inputs.map((inp, k) => (
              <Input key={inp.label} inp={inp} k={k} />
            ))}
          </ul>
        </div>
        <DownFlow />

        <div className="relative z-10">
          <StageLabel n={2}>{spec.stages[1]}</StageLabel>
          <Engine engine={spec.engine} reduced={reduced} />
        </div>
        <DownFlow />

        <div className="relative z-10">
          <StageLabel n={3}>{spec.stages[2]}</StageLabel>
          <div
            data-port="visual"
            className="mx-auto max-w-[400px] rounded-2xl bg-white p-4 @4xl:max-w-none shadow-[0_10px_30px_rgba(16,24,40,.08)] ring-1 ring-line"
          >
            {spec.visual}
            <p
              className="mt-2 flex items-center gap-2 text-[12.5px] font-semibold"
              style={{ color: spec.visualNote.color }}
            >
              <span
                className="h-0.5 w-5 rounded"
                style={{ background: spec.visualNote.color }}
                aria-hidden
              />
              {spec.visualNote.text}
            </p>
          </div>
        </div>
        <DownFlow />

        <div className="relative z-10">
          <StageLabel n={4}>{spec.stages[3]}</StageLabel>
          <ul className="grid gap-2 sm:grid-cols-2 @4xl:grid-cols-1">
            {spec.outputs.map((o, k) => {
              const Icon = iconOf(o.icon);
              return (
                <li
                  key={o.id}
                  data-port={`out-${o.id}`}
                  className="cf-out flex items-center gap-3 rounded-xl bg-white px-3 py-2 shadow-[0_1px_2px_rgba(16,24,40,.05)] ring-1 ring-line"
                  style={{ animationDelay: `${0.8 + k * 0.45}s` }}
                >
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
                    style={{ background: `${o.color}14`, color: o.color }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 leading-tight">
                    <span className="block text-[14px] font-bold text-ink">{o.label}</span>
                    <span className="block text-[12px] text-muted-500">{o.hint}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <p className="relative mt-6 text-center text-[13px] text-muted-500">{spec.footnote}</p>
    </figure>
  );
}

/** The section wrapper used by the product template. */
export function WholePicture({ spec }: { spec: FlowSpec }) {
  return (
    <section id="architecture" className="border-b border-line bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold text-brand-700">The whole picture</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink md:text-[44px] md:leading-[1.1]">
            {spec.heading}
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-body">{spec.intro}</p>
        </div>
        <DataFlowDiagram spec={spec} />
      </div>
    </section>
  );
}
