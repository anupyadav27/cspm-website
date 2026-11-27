import { useEffect, useState } from "react";
import { Check, Database, GitBranch, Globe, Lock, Sparkles, Users } from "@/components/site/icons";
import { useReducedMotion } from "./DataFlow";

/**
 * Stage-3 pictures for the product dataflow diagrams (DataFlow.tsx). Each is a small illustration of
 * the idea, not data: no counts, no real resource names. Animations: cf-* in src/styles.css.
 */

const INK = "#0B1220";

type Node = {
  x: number;
  y: number;
  label: string;
  lx: number;
  ly: number;
  tone?: "hot" | "warn" | "target";
};

function Nodes({ nodes }: { nodes: Record<string, Node> }) {
  return (
    <>
      {Object.entries(nodes).map(([k, n]) => {
        const red = n.tone === "hot" || n.tone === "target";
        const amber = n.tone === "warn";
        const stroke = red ? "#DC2626" : amber ? "#D97706" : INK;
        const fill = red ? "#FEE2E2" : amber ? "#FEF3C7" : "#FFFFFF";
        const dot = red ? "#DC2626" : amber ? "#D97706" : "#2563EB";
        return (
          <g key={k}>
            {(red || amber) && <circle cx={n.x} cy={n.y} r="22" fill={dot} className="cf-alarm" />}
            <circle cx={n.x} cy={n.y} r="18" fill={fill} stroke={stroke} strokeWidth="2.2" />
            <circle cx={n.x} cy={n.y} r="5" fill={dot} />
            <text
              x={n.lx}
              y={n.ly}
              textAnchor="middle"
              fontSize="14"
              fontWeight="700"
              fill={red ? "#B42318" : amber ? "#92400E" : INK}
            >
              {n.label}
            </text>
          </g>
        );
      })}
    </>
  );
}

type Edge<K extends string> = {
  a: K;
  b: K;
  t: string;
  tx: number;
  ty: number;
  anchor?: "start" | "middle";
  hot?: number;
};

function Edges<K extends string>({ nodes, edges }: { nodes: Record<K, Node>; edges: Edge<K>[] }) {
  return (
    <>
      {edges.map((e, k) => {
        const a = nodes[e.a];
        const b = nodes[e.b];
        return (
          <g key={k}>
            <line
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="#94A3B8"
              strokeWidth="2"
              pathLength={1}
              className="cf-edge"
              style={{ animationDelay: `${k * 0.3}s` }}
            />
            {e.hot !== undefined && (
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="#DC2626"
                strokeWidth="3"
                strokeLinecap="round"
                className="cf-hot"
                style={{ animationDelay: `${2.2 + e.hot}s` }}
              />
            )}
            <text
              x={e.tx}
              y={e.ty}
              textAnchor={e.anchor ?? "middle"}
              fontSize="13"
              fontWeight="600"
              fill="#475569"
              paintOrder="stroke"
              stroke="#FFFFFF"
              strokeWidth="4"
            >
              {e.t}
            </text>
          </g>
        );
      })}
    </>
  );
}

/** CIEM: an identity graph that draws itself, then lights a route to admin. */
export function IdentityGraph() {
  const N = {
    user: { x: 45, y: 50, label: "User", lx: 45, ly: 22 },
    group: { x: 45, y: 185, label: "Group", lx: 45, ly: 222 },
    role: { x: 175, y: 115, label: "Role", lx: 175, ly: 87 },
    vm: { x: 175, y: 215, label: "VM", lx: 210, ly: 220 },
    admin: { x: 285, y: 115, label: "Admin", lx: 285, ly: 152, tone: "target" as const },
  };
  const E: Edge<keyof typeof N>[] = [
    { a: "user", b: "group", t: "member of", tx: 53, ty: 121, anchor: "start" },
    { a: "user", b: "role", t: "assumes", tx: 118, ty: 70 },
    { a: "group", b: "role", t: "assumes", tx: 98, ty: 172, hot: 0 },
    { a: "vm", b: "role", t: "runs as", tx: 183, ty: 170, anchor: "start" },
    { a: "role", b: "admin", t: "can reach", tx: 230, ty: 104, hot: 0 },
  ];
  return (
    <svg viewBox="0 0 320 235" className="h-auto w-full" aria-hidden>
      <Edges nodes={N} edges={E} />
      <Nodes nodes={N} />
    </svg>
  );
}

/** Attack Path: two routes from different entry points meet at one choke point before the data. */
export function ChokePointGraph() {
  const N = {
    internet: { x: 40, y: 50, label: "Internet", lx: 40, ly: 22 },
    vm: { x: 140, y: 50, label: "VM", lx: 140, ly: 22 },
    cicd: { x: 40, y: 185, label: "CI/CD", lx: 40, ly: 222 },
    role: { x: 190, y: 125, label: "Role", lx: 190, ly: 165, tone: "warn" as const },
    data: { x: 285, y: 125, label: "Data", lx: 285, ly: 165, tone: "target" as const },
  };
  const E: Edge<keyof typeof N>[] = [
    { a: "internet", b: "vm", t: "open port", tx: 90, ty: 41, hot: 0 },
    { a: "vm", b: "role", t: "runs as", tx: 172, ty: 84, anchor: "start", hot: 0.4 },
    { a: "cicd", b: "role", t: "assumes", tx: 110, ty: 172, hot: 1.6 },
    { a: "role", b: "data", t: "can read", tx: 238, ty: 114, hot: 0.8 },
  ];
  return (
    <svg viewBox="0 0 320 235" className="h-auto w-full" aria-hidden>
      <Edges nodes={N} edges={E} />
      <Nodes nodes={N} />
      <g className="cf-tag">
        <rect
          x="150"
          y="176"
          width="80"
          height="22"
          rx="11"
          fill="#FEF3C7"
          stroke="#D97706"
          strokeWidth="1.5"
        />
        <text x="190" y="191" textAnchor="middle" fontSize="13" fontWeight="700" fill="#92400E">
          Choke point
        </text>
      </g>
    </svg>
  );
}

const SEV = [
  { label: "Medium", cls: "bg-[#FEF7E0] text-[#8A6100] ring-[#F2DC9B]" },
  { label: "High", cls: "bg-[#FFF1E6] text-[#B54708] ring-[#F9D0AE]" },
  { label: "Critical", cls: "bg-[#FDECEA] text-[#B42318] ring-[#F5C2BD]" },
];
const CONTEXT = ["Internet exposed", "On an attack path", "Valuable asset"];

/** CSPM: one finding whose severity rises as context is added, then gets a fix-by date and a fix prompt. */
export function SeverityRaise() {
  const reduced = useReducedMotion();
  const [t, setT] = useState(5);
  useEffect(() => {
    if (reduced) return setT(5);
    setT(0);
    const id = setInterval(() => setT((x) => (x >= 7 ? 0 : x + 1)), 1000);
    return () => clearInterval(id);
  }, [reduced]);
  const step = Math.min(t, 5);
  const sev = SEV[Math.max(0, Math.min(2, step - 1))];
  return (
    <div className="space-y-3 py-1" aria-hidden>
      <div className="rounded-xl bg-surface p-3 ring-1 ring-line">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] font-bold uppercase tracking-wide text-muted-500">
            Example finding
          </span>
          <span
            key={sev.label}
            className={`cf-pop rounded-md px-2 py-0.5 text-[12px] font-bold ring-1 ${sev.cls}`}
          >
            {sev.label}
          </span>
        </div>
        <div className="mt-2 text-[14px] font-bold text-ink">Storage bucket allows public read</div>
        <div className="mt-0.5 font-mono text-[12px] text-muted-500">FAIL · rule and resource</div>
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {CONTEXT.map((c, k) => (
          <li
            key={c}
            className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ring-1 transition-all duration-300 ${
              step > k
                ? "bg-[#FDECEA] text-[#B42318] ring-[#F5C2BD]"
                : "bg-white text-muted-500 ring-line"
            }`}
          >
            + {c}
          </li>
        ))}
      </ul>
      <div
        className={`flex flex-wrap gap-1.5 transition-opacity duration-500 ${step >= 4 ? "opacity-100" : "opacity-0"}`}
      >
        <span className="inline-flex items-center gap-1 rounded-full bg-tint-blue px-2.5 py-1 text-[12px] font-semibold text-brand-700">
          <Check className="h-3.5 w-3.5" /> Fix-by date set
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-[#F3E8FF] px-2.5 py-1 text-[12px] font-semibold text-[#6B21A8] transition-opacity duration-500 ${step >= 5 ? "opacity-100" : "opacity-0"}`}
        >
          <Sparkles className="h-3.5 w-3.5" /> AI fix prompt
        </span>
      </div>
    </div>
  );
}

/** Data Security: a store gets its labels, then the risk signals around it light up. */
export function DataStoreRisk() {
  const sat = [
    { x: 58, y: 48, icon: Globe, label: "Public grant", red: true, d: 0, top: true },
    { x: 262, y: 48, icon: Lock, label: "Encryption", d: 0.4, top: true },
    { x: 58, y: 182, icon: Users, label: "Who touched it", d: 0.8 },
    { x: 262, y: 182, icon: GitBranch, label: "Copies", d: 1.2 },
  ];
  return (
    <div className="relative" aria-hidden>
      <svg viewBox="0 0 320 235" className="h-auto w-full">
        {sat.map((s, k) => (
          <g key={k}>
            <line
              x1="160"
              y1="110"
              x2={s.x}
              y2={s.y}
              stroke="#94A3B8"
              strokeWidth="2"
              pathLength={1}
              className="cf-edge"
              style={{ animationDelay: `${k * 0.3}s` }}
            />
            {s.red && (
              <line
                x1="160"
                y1="110"
                x2={s.x}
                y2={s.y}
                stroke="#DC2626"
                strokeWidth="3"
                strokeLinecap="round"
                className="cf-hot"
                style={{ animationDelay: "2.2s" }}
              />
            )}
          </g>
        ))}
        <circle cx="160" cy="110" r="30" fill="#DC2626" className="cf-alarm" />
        <circle cx="160" cy="110" r="26" fill="#EFF4FF" stroke={INK} strokeWidth="2.2" />
      </svg>
      {/* HTML on top for crisp icons and the label chips */}
      <div className="absolute inset-0">
        <span
          className="absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center text-brand-600"
          style={{ left: "50%", top: `${(110 / 235) * 100}%` }}
        >
          <Database className="h-6 w-6" />
        </span>
        <div
          className="absolute flex -translate-x-1/2 gap-1"
          style={{ left: "50%", top: `${(146 / 235) * 100}%` }}
        >
          {["PII", "PCI"].map((l, k) => (
            <span
              key={l}
              className="cf-pop rounded-md bg-[#FDECEA] px-1.5 py-0.5 text-[12px] font-bold text-[#B42318] ring-1 ring-[#F5C2BD]"
              style={{ animationDelay: `${0.6 + k * 0.25}s` }}
            >
              {l}
            </span>
          ))}
        </div>
        {sat.map((s) => {
          const Icon = s.icon;
          return (
            <span
              key={s.label}
              className={`absolute flex -translate-x-1/2 -translate-y-1/2 ${"top" in s && s.top ? "flex-col-reverse" : "flex-col"} items-center gap-1 whitespace-nowrap text-[12px] font-bold ${s.red ? "text-[#B42318]" : "text-ink-2"}`}
              style={{ left: `${(s.x / 320) * 100}%`, top: `${(s.y / 235) * 100}%` }}
            >
              <span
                className={`grid h-9 w-9 place-items-center rounded-full bg-white ring-2 ${s.red ? "ring-[#DC2626] text-[#DC2626]" : "ring-ink text-brand-600"}`}
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
