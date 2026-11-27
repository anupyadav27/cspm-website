import { useEffect, useState, type ReactNode } from "react";
import * as Icons from "@/components/site/icons";
import type { LucideIcon } from "@/components/site/icons";
import { useReducedMotion } from "./DataFlow";

/**
 * Reusable stage-3 pictures for the product dataflow diagrams, driven by plain data (VisualSpec) so a
 * page's diagram is written as data in src/data/product-flows-*.ts. Each picture is an illustration of
 * the idea: no counts, no real resource names; anything example-like is labelled "Example".
 *
 *   chain   up to 5 steps in a zigzag, edges labelled, the route pulses red; optional tag on one node
 *   finding one example finding whose severity rises as context chips light up, then outcome chips
 *   hub     a centre with up to 4 signals around it; flagged signals pulse red; chips under the centre
 *   bars    example rows whose bars grow (no figures shown)
 *   diff    an example code or config change: removed and added lines type in
 *   chat    an example question and answer, the answer types in
 */

export type IconName = keyof typeof Icons;

export const iconOf = (n: IconName | LucideIcon): LucideIcon =>
  typeof n === "string" ? ((Icons as unknown as Record<string, LucideIcon>)[n] ?? Icons.Circle) : n;

type Tone = "normal" | "warn" | "hot";

export type VisualSpec =
  | {
      kind: "chain";
      /** 3 to 5 nodes, 1–2 words each. */
      nodes: { label: string; tone?: Tone }[];
      /** One label per edge (nodes.length - 1), 1–2 words each. */
      edges: string[];
      /** Optional small tag under one node, e.g. "Choke point". */
      tag?: { node: number; label: string };
    }
  | {
      kind: "finding";
      title: string;
      start: "Low" | "Medium" | "High";
      /** 2–3 context chips that raise the severity. */
      context: string[];
      /** 1–2 chips that appear at the end, e.g. "Fix-by date set". */
      outcomes: string[];
    }
  | {
      kind: "hub";
      center: { label: string; icon: IconName };
      /** Exactly 4 signals around the centre. */
      around: { label: string; icon: IconName; flag?: boolean }[];
      /** At most one short chip under the centre: a label such as "PII", or "Example". */
      chips?: string[];
    }
  | { kind: "bars"; title: string; rows: { label: string; value: number; tone?: Tone }[] }
  | { kind: "diff"; file: string; lines: { op: "-" | "+" | " "; text: string }[]; badge: string }
  | { kind: "chat"; question: string; answer: string };

const INK = "#0B1220";
const TONE = {
  normal: { stroke: INK, fill: "#FFFFFF", dot: "#2563EB", text: INK },
  warn: { stroke: "#D97706", fill: "#FEF3C7", dot: "#D97706", text: "#92400E" },
  hot: { stroke: "#DC2626", fill: "#FEE2E2", dot: "#DC2626", text: "#B42318" },
};

function Chain({ v }: { v: Extract<VisualSpec, { kind: "chain" }> }) {
  const n = v.nodes.length;
  const pts = v.nodes.map((_, i) => ({
    x: 38 + (i * (320 - 76)) / Math.max(1, n - 1),
    y: i % 2 === 0 ? 70 : 165,
  }));
  return (
    <svg viewBox="0 0 320 235" className="h-auto w-full" aria-hidden>
      {pts.slice(1).map((b, i) => {
        const a = pts[i];
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        return (
          <g key={i}>
            <line
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="#94A3B8"
              strokeWidth="2"
              pathLength={1}
              className="cf-edge"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
            <line
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="#DC2626"
              strokeWidth="3"
              strokeLinecap="round"
              className="cf-hot"
              style={{ animationDelay: `${2.2 + i * 0.35}s` }}
            />
            <text
              x={mx}
              y={my + (i % 2 === 0 ? -10 : 18)}
              textAnchor="middle"
              fontSize="13"
              fontWeight="600"
              fill="#475569"
              paintOrder="stroke"
              stroke="#FFFFFF"
              strokeWidth="4"
            >
              {v.edges[i]}
            </text>
          </g>
        );
      })}
      {v.nodes.map((nd, i) => {
        const p = pts[i];
        const t = TONE[nd.tone ?? "normal"];
        const above = p.y < 100;
        return (
          <g key={i}>
            {nd.tone && nd.tone !== "normal" && (
              <circle cx={p.x} cy={p.y} r="22" fill={t.dot} className="cf-alarm" />
            )}
            <circle cx={p.x} cy={p.y} r="18" fill={t.fill} stroke={t.stroke} strokeWidth="2.2" />
            <circle cx={p.x} cy={p.y} r="5" fill={t.dot} />
            <text
              x={i === 0 ? p.x - 20 : i === n - 1 ? p.x + 20 : p.x}
              y={above ? p.y - 28 : p.y + 38}
              textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}
              fontSize="14"
              fontWeight="700"
              fill={t.text}
            >
              {nd.label}
            </text>
          </g>
        );
      })}
      {v.tag && pts[v.tag.node] && (
        <g className="cf-tag">
          <rect
            x={Math.min(222, Math.max(2, pts[v.tag.node].x - 48))}
            y={pts[v.tag.node].y < 100 ? 6 : 208}
            width="96"
            height="22"
            rx="11"
            fill="#FEF3C7"
            stroke="#D97706"
            strokeWidth="1.5"
          />
          <text
            x={Math.min(270, Math.max(50, pts[v.tag.node].x))}
            y={pts[v.tag.node].y < 100 ? 21 : 223}
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fill="#92400E"
          >
            {v.tag.label}
          </text>
        </g>
      )}
    </svg>
  );
}

const SEV = {
  Low: "bg-[#EFF4FF] text-[#1D4ED8] ring-[#C7D7FE]",
  Medium: "bg-[#FEF7E0] text-[#8A6100] ring-[#F2DC9B]",
  High: "bg-[#FFF1E6] text-[#B54708] ring-[#F9D0AE]",
  Critical: "bg-[#FDECEA] text-[#B42318] ring-[#F5C2BD]",
} as const;
const ORDER = ["Low", "Medium", "High", "Critical"] as const;

function useTicker(max: number, ms = 1000, hold = 2) {
  const reduced = useReducedMotion();
  const [t, setT] = useState(max);
  useEffect(() => {
    if (reduced) return setT(max);
    setT(0);
    const id = setInterval(() => setT((x) => (x >= max + hold ? 0 : x + 1)), ms);
    return () => clearInterval(id);
  }, [reduced, max, ms, hold]);
  return Math.min(t, max);
}

function Finding({ v }: { v: Extract<VisualSpec, { kind: "finding" }> }) {
  const steps = v.context.length + v.outcomes.length;
  const t = useTicker(steps);
  const from = ORDER.indexOf(v.start);
  const sev = ORDER[Math.min(3, from + Math.min(t, v.context.length))];
  return (
    <div className="space-y-3 py-1" aria-hidden>
      <div className="rounded-xl bg-surface p-3 ring-1 ring-line">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] font-bold uppercase tracking-wide text-muted-500">
            Example finding
          </span>
          <span
            key={sev}
            className={`cf-pop rounded-md px-2 py-0.5 text-[12px] font-bold ring-1 ${SEV[sev]}`}
          >
            {sev}
          </span>
        </div>
        <div className="mt-2 text-[14px] font-bold leading-snug text-ink">{v.title}</div>
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {v.context.map((c, k) => (
          <li
            key={c}
            className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ring-1 transition-all duration-300 ${
              t > k
                ? "bg-[#FDECEA] text-[#B42318] ring-[#F5C2BD]"
                : "bg-white text-muted-500 ring-line"
            }`}
          >
            + {c}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-1.5">
        {v.outcomes.map((o, k) => (
          <span
            key={o}
            className={`inline-flex items-center gap-1 rounded-full bg-tint-blue px-2.5 py-1 text-[12px] font-semibold text-brand-700 transition-opacity duration-500 ${
              t > v.context.length + k ? "opacity-100" : "opacity-0"
            }`}
          >
            <Icons.Check className="h-3.5 w-3.5" /> {o}
          </span>
        ))}
      </div>
    </div>
  );
}

const SAT = [
  { x: 58, y: 48, top: true },
  { x: 262, y: 48, top: true },
  { x: 58, y: 182, top: false },
  { x: 262, y: 182, top: false },
];

function Hub({ v }: { v: Extract<VisualSpec, { kind: "hub" }> }) {
  const Center = iconOf(v.center.icon);
  return (
    <div className="relative" aria-hidden>
      <svg viewBox="0 0 320 235" className="h-auto w-full">
        {v.around.slice(0, 4).map((s, k) => (
          <g key={k}>
            <line
              x1="160"
              y1="110"
              x2={SAT[k].x}
              y2={SAT[k].y}
              stroke="#94A3B8"
              strokeWidth="2"
              pathLength={1}
              className="cf-edge"
              style={{ animationDelay: `${k * 0.3}s` }}
            />
            {s.flag && (
              <line
                x1="160"
                y1="110"
                x2={SAT[k].x}
                y2={SAT[k].y}
                stroke="#DC2626"
                strokeWidth="3"
                strokeLinecap="round"
                className="cf-hot"
                style={{ animationDelay: `${2.2 + k * 0.4}s` }}
              />
            )}
          </g>
        ))}
        {v.around.some((s) => s.flag) && (
          <circle cx="160" cy="110" r="30" fill="#DC2626" className="cf-alarm" />
        )}
        <circle cx="160" cy="110" r="26" fill="#EFF4FF" stroke={INK} strokeWidth="2.2" />
      </svg>
      <div className="absolute inset-0">
        <span
          className="absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center text-brand-600"
          style={{ left: "50%", top: `${(110 / 235) * 100}%` }}
        >
          <Center className="h-6 w-6" />
        </span>
        <span
          className="absolute -translate-x-1/2 whitespace-nowrap text-[12px] font-bold text-ink"
          style={{ left: "50%", top: `${(62 / 235) * 100}%` }}
        >
          {v.center.label}
        </span>
        {v.chips && v.chips.length > 0 && (
          <div
            className="absolute flex -translate-x-1/2 gap-1"
            style={{ left: "50%", top: `${(146 / 235) * 100}%` }}
          >
            {v.chips.slice(0, 1).map((l, k) => (
              <span
                key={l}
                className={`cf-pop whitespace-nowrap rounded-md px-1.5 py-0.5 text-[12px] font-bold ring-1 ${l === "Example" ? "bg-white text-muted-500 ring-line" : "bg-[#FDECEA] text-[#B42318] ring-[#F5C2BD]"}`}
                style={{ animationDelay: `${0.6 + k * 0.25}s` }}
              >
                {l}
              </span>
            ))}
          </div>
        )}
        {v.around.slice(0, 4).map((s, k) => {
          const Icon = iconOf(s.icon);
          return (
            <span
              key={s.label}
              className={`absolute flex -translate-x-1/2 -translate-y-1/2 ${SAT[k].top ? "flex-col-reverse" : "flex-col"} items-center gap-1 whitespace-nowrap text-[12px] font-bold ${s.flag ? "text-[#B42318]" : "text-ink-2"}`}
              style={{ left: `${(SAT[k].x / 320) * 100}%`, top: `${(SAT[k].y / 235) * 100}%` }}
            >
              <span
                className={`grid h-9 w-9 place-items-center rounded-full bg-white ring-2 ${s.flag ? "text-[#DC2626] ring-[#DC2626]" : "text-brand-600 ring-ink"}`}
              >
                <Icon className="h-4 w-4" />
              </span>
              {s.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

const BAR = { normal: "#2563EB", warn: "#D97706", hot: "#DC2626" };

function Bars({ v }: { v: Extract<VisualSpec, { kind: "bars" }> }) {
  const t = useTicker(1, 1400, 3);
  return (
    <div className="space-y-3 py-1" aria-hidden>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-bold text-ink">{v.title}</span>
        <span className="rounded bg-surface px-1.5 text-[12px] font-semibold text-muted-500 ring-1 ring-line">
          Example
        </span>
      </div>
      {v.rows.slice(0, 5).map((r) => (
        <div key={r.label}>
          <div className="text-[12.5px] font-semibold text-ink-2">{r.label}</div>
          <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-[#EEF2F7]">
            <div
              className="h-full rounded-full transition-[width] duration-1000 ease-out"
              style={{
                width: `${t ? Math.max(4, Math.min(100, r.value)) : 4}%`,
                background: BAR[r.tone ?? "normal"],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Diff({ v }: { v: Extract<VisualSpec, { kind: "diff" }> }) {
  const t = useTicker(v.lines.length + 1, 650, 4);
  return (
    <div
      className="overflow-hidden rounded-xl bg-night font-mono text-[12px] ring-1 ring-[#1E2A44]"
      aria-hidden
    >
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-on-night-muted">
        <span className="truncate">{v.file}</span>
        <span className="rounded bg-white/10 px-1.5 text-[12px] text-[#DCE6F7]">Example</span>
      </div>
      <div className="space-y-0.5 p-3">
        {v.lines.map((l, k) => (
          <div
            key={k}
            className={`whitespace-pre-wrap break-all rounded px-1.5 py-0.5 transition-opacity duration-300 ${
              l.op === "-"
                ? "bg-[#7F1D1D]/50 text-[#FECACA]"
                : l.op === "+"
                  ? "bg-[#14532D]/50 text-[#BBF7D0]"
                  : "text-[#CBD5E1]"
            } ${t > k ? "opacity-100" : "opacity-0"}`}
          >
            {l.op === " " ? "  " : `${l.op} `}
            {l.text}
          </div>
        ))}
      </div>
      <div
        className={`border-t border-white/10 px-3 py-2 text-[12px] font-semibold text-[#6EE7B7] transition-opacity duration-500 ${t > v.lines.length ? "opacity-100" : "opacity-0"}`}
      >
        ✓ {v.badge}
      </div>
    </div>
  );
}

function Chat({ v }: { v: Extract<VisualSpec, { kind: "chat" }> }) {
  const words = v.answer.split(" ");
  const t = useTicker(words.length + 2, 120, 25);
  return (
    <div className="space-y-3 py-1" aria-hidden>
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-brand-600 px-3 py-2 text-[13px] font-semibold text-white">
          {v.question}
        </div>
      </div>
      <div className="flex items-start gap-2">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-night text-[#93C5FD]">
          <Icons.Sparkles className="h-4 w-4" />
        </span>
        <div className="min-h-[64px] max-w-[85%] rounded-2xl rounded-tl-md bg-surface px-3 py-2 text-[13px] leading-relaxed text-ink-2 ring-1 ring-line">
          {t < 2 ? <span className="text-muted-500">…</span> : words.slice(0, t - 1).join(" ")}
        </div>
      </div>
      <div className="text-right text-[12px] font-semibold text-muted-500">Example</div>
    </div>
  );
}

export function renderVisual(v: VisualSpec): ReactNode {
  switch (v.kind) {
    case "chain":
      return <Chain v={v} />;
    case "finding":
      return <Finding v={v} />;
    case "hub":
      return <Hub v={v} />;
    case "bars":
      return <Bars v={v} />;
    case "diff":
      return <Diff v={v} />;
    case "chat":
      return <Chat v={v} />;
  }
}
