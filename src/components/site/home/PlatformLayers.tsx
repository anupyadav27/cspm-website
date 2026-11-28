import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  AppWindow,
  Bot,
  Check,
  Cloud,
  FileCode2,
  GitPullRequest,
  Layers,
  ScrollText,
  Sparkles,
  Terminal,
  type LucideIcon,
  ArrowRight,
  ShieldCheck,
  GitBranch,
  ScanSearch,
  KeyRound,
  Blocks,
  Package,
  Radar,
  Users,
  Database,
  Server,
  ClipboardCheck,
  ShieldHalf,
  UserRound,
  Share2,
  Globe,
  Network,
  Wand2,
} from "@/components/site/icons";
import { AIOPS_COLOR } from "@/data/product-suite";
import { IconTile } from "@/components/site/system";
import { CloudLogo } from "@/components/site/CloudLogo";
import { SAAS_PLATFORMS } from "@/lib/product-facts";
import { useReducedMotion } from "@/components/site/product/DataFlow";
import { CODE_HOSTS, SAAS_APPS, SourceSlider, type SliderItem } from "./SourceSlider";
import { AiMark, GRAD, GUARDS, LANE, OnamAiShowcase, STEPS, useAiStep } from "./OnamAiShowcase";

/**
 * How Onam Security fits together — the homepage's first visual, animated like the product
 * pages' dataflow diagrams (DataFlow.tsx).
 *
 *   code -> cloud -> SaaS  (what you connect)
 *   -> one Onam Security platform: code, cloud and SaaS security on one shared inventory and graph
 *   -> Onam AI decides with you: triage, assign, false positives, focus, a fix prompt in the ticket
 *   -> from the ticket to your code: your VS Code agent reads it through MCP and drafts the fix
 *
 * Owner direction 28 Nov 2026: sequence code -> cloud -> SaaS; the inventory and graph is the base of
 * the one platform, not a separate product; Onam AI is the headline feature.
 * Facts behind the AI and ticket wording (threat-engine):
 *   - AI review labels likely false positives; it never closes or re-grades a finding
 *     (engines/fix/secops_fix/engine/routers/triage.py).
 *   - Jira / ServiceNow tickets carry the fix steps, commands and the AI fix prompt
 *     (shared/api_gateway/bff/_ticket_content.py).
 *   - Onam's MCP server is read-only, on paid plans (documentation/mcp/SETUP.md, pricing.tsx).
 *   - The VS Code step uses the customer's own coding agent and the ticketing system's MCP server.
 * Connectors are measured from the real cards (>= 1024px) and carry packets; below that the layers
 * stack with animated arrows. Reduced motion or the pause button: everything still.
 * Estate, FinOps and DRM are retired (17 Nov 2026) and never appear here.
 */

const CLOUDS = [
  "AWS",
  "Microsoft Azure",
  "Google Cloud",
  "Oracle Cloud",
  "Alibaba Cloud",
  "IBM Cloud",
  "Kubernetes",
];

type Line = {
  id: string;
  name: string;
  href: string;
  icon: LucideIcon;
  color: string;
  does: string[];
  /** A few short points, each with a small icon: what the card shows instead of sentences. */
  points: { label: string; icon: LucideIcon }[];
};

const LINES: Line[] = [
  {
    id: "code",
    name: "Code security",
    href: "/platform/code-security",
    icon: FileCode2,
    color: "#0891B2",
    does: ["SAST, secrets, IaC and SCA with an SBOM", "DAST against running applications"],
    points: [
      { label: "SAST", icon: ScanSearch },
      { label: "Secrets", icon: KeyRound },
      { label: "IaC", icon: Blocks },
      { label: "SCA + SBOM", icon: Package },
      { label: "DAST", icon: Radar },
    ],
  },
  {
    id: "cloud",
    name: "Cloud security",
    href: "/platform/cnapp",
    icon: Cloud,
    color: "#2563EB",
    does: [
      "Posture (CSPM), identity (CIEM) and data (DSPM)",
      "Vulnerabilities and workloads (CWPP), AI services",
      "Attack paths to sensitive data, compliance evidence",
    ],
    points: [
      { label: "CSPM", icon: ShieldCheck },
      { label: "CIEM", icon: Users },
      { label: "DSPM", icon: Database },
      { label: "CWPP", icon: Server },
      { label: "Attack paths", icon: Network },
      { label: "Compliance", icon: ClipboardCheck },
    ],
  },
  {
    id: "saas",
    name: "SaaS security",
    href: "/platform/saas-security",
    icon: AppWindow,
    color: "#8B5CF6",
    does: [
      `Posture checks for ${SAAS_PLATFORMS} SaaS platforms`,
      "Microsoft 365, Google Workspace, GitHub, Snowflake and more",
    ],
    points: [
      { label: "Posture", icon: ShieldHalf },
      { label: "Admin roles", icon: UserRound },
      { label: "Sharing settings", icon: Share2 },
      { label: "AI in SaaS", icon: Bot },
    ],
  },
];

const OUTCOMES = [
  "Which risks to fix first",
  "How an attacker would reach your data",
  "A fix ready in every ticket",
  "Evidence for auditors",
];

/* ---------------------------------------------------------------- connectors */

type Wire = {
  from: string;
  to: string;
  color: string;
  delay: number;
  fx?: number;
  tx?: number;
  /** Left to right: right edge of `from` (at height fy) to left edge of `to` (at height ty). */
  h?: { fy?: number; ty?: number };
};
type Drawn = { d: string; color: string; delay: number };

/** Bezier wires between [data-port]s, at >= 1024px: top-to-bottom, or left-to-right when `h` is set. */
function useWires(box: React.RefObject<HTMLElement | null>, wires: Wire[]) {
  const [s, setS] = useState<{ w: number; h: number; links: Drawn[] }>({ w: 0, h: 0, links: [] });
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (window.innerWidth < 1024) return setS({ w: 0, h: 0, links: [] });
      const at = (id: string) =>
        el.querySelector<HTMLElement>(`[data-port="${id}"]`)?.getBoundingClientRect();
      const links: Drawn[] = [];
      for (const w of wires) {
        const a = at(w.from);
        const b = at(w.to);
        if (!a || !b) continue;
        if (w.h) {
          const x1 = a.right - r.left;
          const y1 = a.top + a.height * (w.h.fy ?? 0.5) - r.top;
          const x2 = b.left - r.left;
          const y2 = b.top + b.height * (w.h.ty ?? 0.5) - r.top;
          const mx = (x1 + x2) / 2;
          links.push({ d: `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`, ...w });
          continue;
        }
        const x1 = a.left + a.width * (w.fx ?? 0.5) - r.left;
        const y1 = a.bottom - r.top;
        const x2 = b.left + b.width * (w.tx ?? 0.5) - r.left;
        const y2 = b.top - r.top;
        const my = (y1 + y2) / 2;
        links.push({ d: `M${x1} ${y1} C${x1} ${my} ${x2} ${my} ${x2} ${y2}`, ...w });
      }
      setS({ w: r.width, h: r.height, links });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [box, wires]);
  return s;
}

const WIRES: Wire[] = [
  { from: "src-code", to: "line-code", color: "#0891B2", delay: 0 },
  { from: "src-cloud", to: "line-cloud", color: "#2563EB", delay: 0.5 },
  { from: "src-saas", to: "line-saas", color: "#8B5CF6", delay: 1 },
  { from: "platform", to: "ai", color: "#0891B2", delay: 0.3, fx: 1 / 6, tx: 0.42 },
  { from: "platform", to: "ai", color: "#2563EB", delay: 0.8 },
  { from: "platform", to: "ai", color: "#8B5CF6", delay: 1.3, fx: 5 / 6, tx: 0.58 },
];

function Down({ color = "#3B82F6" }: { color?: string }) {
  return (
    <div className="flex justify-center py-2 lg:hidden" aria-hidden>
      <span
        className="cf-down h-8 w-0.5 rounded bg-[length:2px_24px]"
        style={{
          backgroundImage: `repeating-linear-gradient(180deg,${color} 0 6px,transparent 6px 12px)`,
        }}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- sources */

function SourceGroup({
  port,
  label,
  color,
  children,
  className = "",
  style,
}: {
  port: string;
  label: string;
  color: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      data-port={port}
      className={`flex flex-col rounded-2xl border border-line bg-surface p-3 ${className}`}
      style={{ borderTop: `3px solid ${color}`, ...style }}
    >
      <div className="mb-2 text-[12px] font-bold uppercase tracking-[0.12em] text-muted-500">
        {label}
      </div>
      {children}
    </div>
  );
}

/** A line's short points as small chips (owner, 28 Nov 2026: points, not sentences). */
function Points({ line, small = false }: { line: Line; small?: boolean }) {
  return (
    <ul className={`flex flex-wrap gap-1.5 ${small ? "mt-2.5" : "mt-4"}`}>
      {line.points.map((p) => (
        <li
          key={p.label}
          className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[12.5px] font-semibold"
          style={{
            background: `${line.color}14`,
            color: `color-mix(in srgb, ${line.color} 68%, #000)`,
          }}
        >
          <p.icon className="h-3.5 w-3.5 shrink-0" />
          {p.label}
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------------------------------------- horizontal (>= 1024px) */

const H_WIRES: Wire[] = [
  { from: "h-src-code", to: "h-line-code", color: "#0891B2", delay: 0, h: {} },
  { from: "h-src-cloud", to: "h-line-cloud", color: "#2563EB", delay: 0.5, h: {} },
  { from: "h-src-saas", to: "h-line-saas", color: "#8B5CF6", delay: 1, h: {} },
  { from: "h-line-code", to: "h-ai", color: "#0891B2", delay: 0.3, h: { ty: 0.22 } },
  { from: "h-line-cloud", to: "h-ai", color: "#2563EB", delay: 0.8, h: { ty: 0.5 } },
  { from: "h-line-saas", to: "h-ai", color: "#8B5CF6", delay: 1.3, h: { ty: 0.78 } },
];

const H_GUARDS = ["Shows its evidence", "Masks sensitive values", "You approve changes"];

/** Column header: one pattern for all three columns (number, title, one-line subtitle). */
function ColHead({
  n,
  title,
  sub,
  tone,
  children,
}: {
  n: number;
  title: string;
  sub: string;
  tone: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-3 pb-1">
      <div className="flex items-center gap-3">
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full font-display text-[14px] font-extrabold text-white"
          style={{ background: tone }}
        >
          {n}
        </span>
        <div className="leading-tight">
          <div className="font-display text-[19px] font-extrabold text-ink">{title}</div>
          <div className="text-[13px] text-muted-500">{sub}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

/** One logo tile, the same size for code hosts, clouds and SaaS apps. */
function LogoTile({ children }: { children: ReactNode }) {
  return (
    <li className="flex h-[50px] items-center justify-center rounded-lg bg-white px-1 text-center ring-1 ring-line">
      {children}
    </li>
  );
}

function AppLogo({ item }: { item: SliderItem }) {
  const h = Math.min(22, 96 / item.ratio);
  return (
    <span className="flex flex-col items-center gap-0.5">
      <img
        src={`/logos/saas/${item.file}`}
        alt={item.wordmark ? item.name : ""}
        height={Math.round(h)}
        width={Math.round(h * item.ratio)}
        style={{ height: h, width: "auto" }}
        loading="lazy"
        decoding="async"
      />
      {!item.wordmark && (
        <span className="text-[12px] font-semibold leading-tight text-ink-2">{item.name}</span>
      )}
    </span>
  );
}

/** A source card: coloured icon, name, hint, then its logo tiles. */
function SourceCard({
  port,
  row,
  icon: Icon,
  name,
  hint,
  color,
  children,
  bare = false,
}: {
  port: string;
  row: number;
  bare?: boolean;
  icon: LucideIcon;
  name: string;
  hint: string;
  color: string;
  children: ReactNode;
}) {
  return (
    <div
      data-port={port}
      className="relative flex flex-col justify-center rounded-2xl bg-surface p-3 ring-1 ring-line"
      style={{ gridColumn: "1", gridRow: String(row) }}
    >
      <div className="mb-2.5 flex items-center gap-2">
        <span
          className="grid h-7 w-7 place-items-center rounded-lg"
          style={{ background: `${color}1A`, color }}
        >
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-[14px] font-bold text-ink">{name}</span>
        <span className="text-[12.5px] text-muted-500">· {hint}</span>
      </div>
      {bare ? children : <ul className="grid grid-cols-3 gap-1.5">{children}</ul>}
    </div>
  );
}

/** SaaS apps keep growing, so they move: one row of tiles sliding left, paused on hover. */
function SaasMarquee({ still }: { still: boolean }) {
  const items = [...SAAS_APPS, ...SAAS_APPS];
  return (
    <div
      className="group relative overflow-hidden"
      style={{
        maskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)",
        WebkitMaskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)",
      }}
    >
      <span className="sr-only">{SAAS_APPS.map((a) => a.name).join(", ")}</span>
      <ul className={`flex w-max gap-1.5 ${still ? "" : "saas-marquee"}`} aria-hidden>
        {items.map((c, k) => (
          <li
            key={k}
            className="flex h-[50px] w-[92px] shrink-0 items-center justify-center rounded-lg bg-white px-1 text-center ring-1 ring-line"
          >
            <AppLogo item={c} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** What Onam AI is doing at each step, shown as a live status line. */
const AI_DOING = [
  "Ranking every alert by real risk",
  "Routing each finding to its owner",
  "Flagging likely false positives",
  "Cutting the queue to what needs you",
  "Writing a fix prompt into each ticket",
];

type Threat = { title: string; sev: "Critical" | "High"; why: LucideIcon[]; owner: string };
// Example rows only: no counts, no customer data.
const THREATS: Threat[] = [
  {
    title: "Public storage bucket",
    sev: "Critical",
    why: [Globe, Network, Database],
    owner: "Cloud team",
  },
  { title: "SQL injection in checkout", sev: "Critical", why: [Globe, Network], owner: "Dev team" },
  { title: "Guest user with admin rights", sev: "High", why: [Network], owner: "IT team" },
];
const SEV_TAG = {
  Critical: "bg-[#FDECEA] text-[#B42318]",
  High: "bg-[#FFF1E6] text-[#B54708]",
};

/** The steps, with the Onam AI orb moving along them and a status line saying what it is doing. */
function AiAtWork({ step, still }: { step: number; still: boolean }) {
  const s = still ? 4 : step;
  return (
    <div>
      <div className="relative">
        <ol className="grid grid-cols-5 gap-1.5">
          {STEPS.map((st, k) => {
            const Icon = st.icon;
            const on = k === s && !still;
            const done = k < s || still;
            return (
              <li
                key={st.name}
                className={`relative flex flex-col items-center gap-1 rounded-lg px-1 pb-1.5 pt-4 text-center text-[12.5px] font-semibold leading-tight transition-all duration-500 ${
                  on
                    ? "bg-[#4F46E5] text-white shadow-[0_0_0_3px_rgba(79,70,229,.3)]"
                    : done
                      ? "bg-white/[0.07] text-white"
                      : "bg-white/[0.03] text-[#94A3B8]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {st.name}
                {done && !on && <Check className="absolute right-1 top-1 h-3 w-3 text-[#4ADE80]" />}
              </li>
            );
          })}
        </ol>
        {/* the Onam AI orb, sitting on the step it is working */}
        <span
          className="absolute -top-3 grid h-7 w-7 -translate-x-1/2 place-items-center rounded-full shadow-[0_0_18px_rgba(129,140,248,.8)] transition-[left] duration-700 ease-out"
          style={{
            left: `${((s + 0.5) / 5) * 100}%`,
            background: "conic-gradient(#22D3EE,#818CF8,#C084FC,#22D3EE)",
          }}
          aria-hidden
        >
          <span className="grid h-[24px] w-[24px] place-items-center rounded-full bg-night">
            <AiMark className="h-3.5 w-3.5 text-white" />
          </span>
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2 text-[13px] text-[#C7D2FE]" aria-live="off">
        <AiMark className="h-3.5 w-3.5 shrink-0 text-[#A5B4FC]" />
        <span>
          <b className="font-semibold text-white">Onam AI</b> · {AI_DOING[s]}
        </span>
        {!still && (
          <span className="flex gap-0.5" aria-hidden>
            {[0, 1, 2].map((d) => (
              <span
                key={d}
                className="comic-dot h-1 w-1 rounded-full bg-[#A5B4FC]"
                style={{ animationDelay: `${d * 0.15}s` }}
              />
            ))}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * The handover: until Onam AI reaches Focus, placeholder rows show it working; then the real
 * threats (true positives) land in a compact table, and tickets appear at Fix prompt. What was
 * set aside is one muted line.
 */
function Handover({ step, still }: { step: number; still: boolean }) {
  const s = still ? 4 : step;
  const ready = s >= 3;
  return (
    <div className="overflow-hidden rounded-xl bg-white text-ink" aria-hidden>
      <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2">
        <span className="flex items-center gap-2 text-[13.5px] font-bold">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-[#DCFCE7] text-[#15803D]">
            <Check className="h-3 w-3" />
          </span>
          Handed to you: real threats to fix
        </span>
        <span className="rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[12px] font-bold text-[#4338CA]">
          True positives
        </span>
      </div>
      <ul>
        {THREATS.map((t, k) =>
          ready ? (
            <li
              key={t.title}
              className="cf-pop grid grid-cols-[auto_minmax(0,1fr)_auto_auto_auto] items-center gap-2 border-b border-line px-3 py-1.5 text-[13px]"
              style={{ animationDelay: `${k * 0.15}s` }}
            >
              <span className={`rounded px-1.5 py-px text-[12px] font-bold ${SEV_TAG[t.sev]}`}>
                {t.sev}
              </span>
              <span className="truncate font-semibold">{t.title}</span>
              <span className="flex gap-0.5 text-[#B42318]">
                {t.why.map((I, j) => (
                  <I key={j} className="h-3.5 w-3.5" />
                ))}
              </span>
              <span className="w-[74px] truncate text-[12.5px] text-[#475467]">{t.owner}</span>
              <span
                className="inline-flex w-[58px] items-center gap-1 text-[12.5px] font-semibold text-brand-700 transition-opacity duration-500"
                style={{ opacity: s >= 4 ? 1 : 0 }}
              >
                <ScrollText className="h-3.5 w-3.5" /> Ticket
              </span>
            </li>
          ) : (
            <li
              key={t.title}
              className="flex items-center gap-2 border-b border-line px-3 py-[9px]"
            >
              <span className="h-3 w-14 animate-pulse rounded bg-[#E2E8F0] motion-reduce:animate-none" />
              <span className="h-3 flex-1 animate-pulse rounded bg-[#EEF2F6] motion-reduce:animate-none" />
            </li>
          ),
        )}
      </ul>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 bg-[#F8FAFC] px-3 py-1.5 text-[12px] text-[#475467]">
        <span className="inline-flex items-center gap-1">
          <Globe className="h-3.5 w-3.5 text-[#B42318]" /> Internet
        </span>
        <span className="inline-flex items-center gap-1">
          <Network className="h-3.5 w-3.5 text-[#B42318]" /> Attack path
        </span>
        <span className="inline-flex items-center gap-1">
          <Database className="h-3.5 w-3.5 text-[#B42318]" /> Data
        </span>
        <span className="ml-auto">Set aside: false positives, low risk</span>
      </div>
    </div>
  );
}

/** Fix one: the first threat, from its ticket to a change in your own code (example). */
function FixOne({ still }: { still: boolean }) {
  const steps = [
    { icon: ScrollText, t: "Open ticket" },
    { icon: Terminal, t: "Agent via MCP" },
    { icon: Wand2, t: "Drafts fix" },
    { icon: GitPullRequest, t: "You merge" },
  ];
  return (
    <div className="rounded-xl bg-white/[0.04] p-3 ring-1 ring-white/10">
      <ol className="grid grid-cols-4 gap-1.5">
        {steps.map((x, k) => (
          <li
            key={x.t}
            className="flex items-center gap-1.5 text-[12.5px] font-semibold leading-tight text-white"
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#312E81] text-[12px] font-bold text-[#C7D2FE]">
              {k + 1}
            </span>
            {x.t}
          </li>
        ))}
      </ol>
      <div
        className="mt-2.5 overflow-hidden rounded-lg bg-[#0F172A] ring-1 ring-white/10"
        aria-hidden
      >
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5 text-[12px] text-[#94A3B8]">
          <span className="flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5" /> VS Code · storage.tf
          </span>
          <span>Example · ready for your review</span>
        </div>
        <div className="space-y-0.5 px-3 py-2 font-mono text-[12.5px] leading-relaxed">
          <div className="text-[#A5B4FC]">
            <AiMark className="mr-1 inline h-3 w-3" />
            Your agent: read the ticket and its AI fix prompt
          </div>
          <div className="rounded bg-[#450A0A]/60 px-1.5 text-[#FCA5A5]">- acl = "public-read"</div>
          <div className={`rounded bg-[#052E16]/70 px-1.5 text-[#86EFAC] ${still ? "" : "cf-pop"}`}>
            + acl = "private"
          </div>
        </div>
      </div>
    </div>
  );
}

const subLabel = "text-[12px] font-bold uppercase tracking-[0.12em] text-[#94A3B8]";

/**
 * Left to right: 1 Connect -> 2 Secure (one Onam Security platform) -> 3 Decide and fix (Onam AI).
 * One CSS grid: row 1 holds the three column headers; rows 2-4 put each source on the same row as
 * its security line; row 5 is the platform's foundation. The platform frame and the Onam AI panel
 * span rows 2-5, so all three columns start and end together.
 */
function PlatformRow({
  still,
  stopped,
  onToggle,
}: {
  still: boolean;
  stopped: boolean;
  onToggle: () => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const { w, h, links } = useWires(box, H_WIRES);
  const step = useAiStep(still);
  return (
    <div
      ref={box}
      className="relative grid grid-cols-[minmax(0,1fr)_minmax(0,0.86fr)_minmax(0,1.62fr)] gap-x-12 gap-y-3"
    >
      {w > 0 && (
        <svg className="pointer-events-none absolute inset-0 z-20" width={w} height={h} aria-hidden>
          {links.map((l, k) => (
            <g key={k}>
              <path d={l.d} fill="none" stroke={l.color} strokeOpacity=".18" strokeWidth="2" />
              <path
                d={l.d}
                fill="none"
                stroke={l.color}
                strokeWidth="2"
                strokeDasharray="4 10"
                strokeOpacity=".75"
                className={still ? "" : "cf-dash"}
              />
              {!still && (
                <circle r="4.5" fill={l.color}>
                  <animateMotion
                    dur="2.2s"
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

      {/* Row 1 · the three column headers, one pattern */}
      <div style={{ gridColumn: "1", gridRow: "1" }}>
        <ColHead n={1} title="Connect" sub="Your code, clouds and SaaS" tone="#64748B" />
      </div>
      <div style={{ gridColumn: "2", gridRow: "1" }}>
        <ColHead n={2} title="Onam Security" sub="Secures code, cloud and SaaS" tone="#2563EB" />
      </div>
      <div style={{ gridColumn: "3", gridRow: "1" }}>
        <ColHead n={3} title="Onam AI" sub="Decides what to fix, then helps fix it" tone="#4F46E5">
          <button
            type="button"
            onClick={onToggle}
            aria-pressed={stopped}
            className="inline-flex min-h-6 items-center rounded-md px-2 text-[12px] font-semibold text-navy-600 hover:bg-surface hover:text-ink"
          >
            {stopped ? "Play animation" : "Pause animation"}
          </button>
        </ColHead>
      </div>

      {/* Column 1 · sources: one card shape, one tile size */}
      <SourceCard
        port="h-src-code"
        row={2}
        icon={GitBranch}
        name="Code"
        hint="repositories"
        color="#0891B2"
      >
        {CODE_HOSTS.map((c) => (
          <LogoTile key={c.name}>
            <AppLogo item={c} />
          </LogoTile>
        ))}
      </SourceCard>
      <SourceCard
        port="h-src-cloud"
        row={3}
        icon={Cloud}
        name="Cloud"
        hint="accounts and clusters"
        color="#2563EB"
      >
        {CLOUDS.map((c) => (
          <LogoTile key={c}>
            <CloudLogo
              name={c}
              height={20}
              maxWidth={96}
              stack
              nameClassName="text-[12px] font-semibold leading-tight text-ink-2"
            />
          </LogoTile>
        ))}
      </SourceCard>
      <SourceCard
        port="h-src-saas"
        row={4}
        icon={AppWindow}
        name="SaaS"
        hint="apps your teams use"
        color="#8B5CF6"
        bare
      >
        <SaasMarquee still={still} />
      </SourceCard>

      {/* Column 2 · one platform: frame, three lines, the foundation */}
      <div
        className="-mx-3 -mb-3 -mt-3 rounded-3xl bg-[#F5F8FF] ring-1 ring-[#C7D7FE]"
        style={{ gridColumn: "2", gridRow: "2 / 6" }}
        aria-hidden
      />
      {LINES.map((l, k) => (
        <Link
          key={l.id}
          to={l.href}
          data-port={`h-line-${l.id}`}
          className="group relative flex flex-col justify-center rounded-2xl bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,.06)] ring-1 ring-line transition hover:shadow-[0_12px_28px_rgba(16,24,40,.12)]"
          style={{ gridColumn: "2", gridRow: String(k + 2) }}
        >
          <div className="flex items-center gap-3">
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white shadow-[0_4px_12px_rgba(16,24,40,.15)]"
              style={{ background: l.color }}
            >
              <l.icon className="h-5 w-5" />
            </span>
            <span className="font-display text-[16px] font-bold text-ink transition group-hover:text-brand-600">
              {l.name}
            </span>
            <ArrowRight className="ml-auto h-4 w-4 text-subtle opacity-0 transition group-hover:opacity-100" />
          </div>
          <Points line={l} small />
        </Link>
      ))}
      <div
        className="relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-white"
        style={{
          gridColumn: "2",
          gridRow: "5",
          background: "linear-gradient(90deg,#1D4ED8,#4F46E5)",
        }}
      >
        <Layers className="h-5 w-5 shrink-0 text-[#C7D2FE]" />
        <span className="text-[13px] leading-snug">
          <b className="font-bold">Foundation:</b> one inventory, one security graph
        </span>
      </div>

      {/* Column 3 · Onam AI: works the queue -> hands you a short list -> your editor */}
      <div
        data-port="h-ai"
        className="relative flex flex-col overflow-hidden rounded-3xl bg-night px-5 py-5 text-white shadow-[0_24px_60px_rgba(11,18,32,.35)] ring-1 ring-[#1E2A44]"
        style={{ gridColumn: "3", gridRow: "2 / 6" }}
      >
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-35 blur-3xl"
          style={{ background: "radial-gradient(#818CF8,#C084FC 60%,transparent)" }}
          aria-hidden
        />
        <div className="relative flex items-center gap-3">
          <span className="relative grid h-12 w-12 shrink-0 place-items-center" aria-hidden>
            <span
              className={`absolute inset-0 rounded-full ${still ? "" : "ai-spin"}`}
              style={{ background: "conic-gradient(#22D3EE,#818CF8,#C084FC,#22D3EE)" }}
            />
            <span className="absolute inset-[2px] rounded-full bg-night" />
            <AiMark className="relative h-5 w-5 text-white" />
          </span>
          <div className="leading-tight">
            <div className="font-display text-[24px] font-extrabold text-white">Onam AI</div>
            <div
              className="bg-clip-text text-[15px] font-bold text-transparent"
              style={{ backgroundImage: GRAD }}
            >
              From alert overload to the fixes that matter
            </div>
          </div>
        </div>

        <div className={`relative mt-4 ${subLabel}`}>1 · Onam AI works the queue</div>
        <div className="relative mt-4">
          <AiAtWork step={step} still={still} />
        </div>

        <div className={`relative mt-4 ${subLabel}`}>2 · Hands over the real threats</div>
        <div className="relative mt-2">
          <Handover step={step} still={still} />
        </div>

        <div className={`relative mt-4 ${subLabel}`}>3 · Fix one in your editor</div>
        <div className="relative mt-2">
          <FixOne still={still} />
        </div>
        <ul className="relative mt-auto flex flex-wrap gap-x-3.5 gap-y-1 pt-3">
          {H_GUARDS.map((g) => (
            <li key={g} className="flex items-center gap-1 text-[12px] text-[#CBD5E1]">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#4ADE80]" /> {g}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- the figure */

export function PlatformLayers() {
  const reduced = useReducedMotion();
  const [hover, setHover] = useState(false);
  const [stopped, setStopped] = useState(false);
  const still = reduced || stopped;
  const box = useRef<HTMLDivElement>(null);
  const { w, h, links } = useWires(box, WIRES);

  return (
    <section id="platform" className="relative scroll-mt-20 border-b border-line bg-white">
      <div className="absolute inset-x-0 top-0 h-24 bg-night md:h-40" aria-hidden />
      <div className="relative mx-auto -mt-16 max-w-7xl px-4 pb-16 sm:px-6 md:-mt-24 md:pb-20">
        <figure className="relative rounded-3xl border border-line bg-white p-4 shadow-[0_24px_64px_rgba(11,18,32,.18)] sm:p-8">
          <figcaption className="sr-only">
            How Onam Security fits together. You connect your code repositories, your clouds and
            your SaaS apps. One Onam Security platform checks them with code, cloud and SaaS
            security, all on one shared inventory and security graph. Onam AI then helps you decide:
            it ranks alerts by real risk, routes each finding to its owner, flags likely false
            positives for your team to confirm, cuts the queue to what needs you, and raises a Jira
            or ServiceNow ticket with the fix steps and an AI fix prompt. Your coding agent in VS
            Code reads that ticket through MCP and drafts the fix in your own code, and a person
            reviews every change.
          </figcaption>

          <div className="flex items-center justify-between gap-3 lg:hidden">
            <div className="text-[12px] font-bold uppercase tracking-[0.12em] text-navy-600 lg:hidden">
              What you connect
            </div>
            <button
              type="button"
              onClick={() => setStopped((v) => !v)}
              aria-pressed={stopped}
              className="inline-flex min-h-6 items-center rounded-md px-2 text-[12px] font-semibold text-navy-600 hover:bg-surface hover:text-ink"
            >
              {stopped ? "Play animation" : "Pause animation"}
            </button>
          </div>

          <div className="hidden lg:mt-4 lg:block">
            <PlatformRow still={still} stopped={stopped} onToggle={() => setStopped((v) => !v)} />
          </div>

          <div ref={box} className="relative mt-3 lg:hidden">
            {w > 0 && (
              <svg
                className="pointer-events-none absolute inset-0 z-0"
                width={w}
                height={h}
                aria-hidden
              >
                {links.map((l, k) => (
                  <g key={k}>
                    <path d={l.d} fill="none" stroke={l.color} strokeOpacity=".2" strokeWidth="2" />
                    <path
                      d={l.d}
                      fill="none"
                      stroke={l.color}
                      strokeWidth="2"
                      strokeDasharray="4 10"
                      strokeOpacity=".7"
                      className={still ? "" : "cf-dash"}
                    />
                    {!still && (
                      <circle r="4.5" fill={l.color}>
                        <animateMotion
                          dur="2.4s"
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

            {/* 1 · Sources, in order: code, cloud, SaaS */}
            <div
              className="relative z-10 grid gap-3 lg:grid-cols-[1fr_2.2fr_1fr]"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onFocus={() => setHover(true)}
              onBlur={() => setHover(false)}
            >
              <SourceGroup port="src-code" label="Code" color="#0891B2">
                <div className="grid flex-1 place-items-center rounded-lg border border-line bg-white">
                  <div className="w-full">
                    <SourceSlider
                      label="Code repositories"
                      items={CODE_HOSTS}
                      paused={hover || still}
                    />
                  </div>
                </div>
              </SourceGroup>
              <SourceGroup port="src-cloud" label="Cloud" color="#2563EB">
                <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {CLOUDS.map((c) => (
                    <li
                      key={c}
                      className="flex min-h-[84px] items-center justify-center rounded-lg border border-line bg-white px-1.5 py-2 text-center"
                    >
                      <CloudLogo
                        name={c}
                        height={24}
                        maxWidth={104}
                        stack
                        nameClassName="text-[12px] font-semibold leading-tight text-ink-2"
                      />
                    </li>
                  ))}
                </ul>
              </SourceGroup>
              <SourceGroup port="src-saas" label="SaaS" color="#8B5CF6">
                <div className="grid flex-1 place-items-center rounded-lg border border-line bg-white">
                  <div className="w-full">
                    <SourceSlider
                      label="SaaS apps"
                      items={SAAS_APPS}
                      paused={hover || still}
                      offset={1}
                    />
                  </div>
                </div>
              </SourceGroup>
            </div>
            <Down />

            {/* 2 · One platform; the inventory and graph is its base, not a product of its own */}
            <div
              data-port="platform"
              className="relative z-10 mt-0 rounded-3xl border-2 border-[#C7D7FE] bg-[#F7F9FF] p-3 sm:p-4 lg:mt-14"
            >
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 px-1">
                <span className="font-display text-lg font-extrabold text-ink">Onam Security</span>
                <span className="text-[14px] text-ink-2">
                  One platform for code, cloud and SaaS
                </span>
              </div>
              <div className="grid gap-3 lg:grid-cols-3">
                {LINES.map((l) => (
                  <Link
                    key={l.id}
                    to={l.href}
                    data-port={`line-${l.id}`}
                    className="group rounded-2xl border border-line bg-white p-5 transition hover:shadow-[0_12px_28px_rgba(16,24,40,.10)]"
                    style={{ borderTop: `3px solid ${l.color}` }}
                  >
                    <div className="flex items-center gap-3">
                      <IconTile icon={l.icon} color={l.color} size="sm" />
                      <div className="font-display font-bold text-ink transition group-hover:text-brand-500">
                        {l.name}
                      </div>
                    </div>
                    <Points line={l} />
                  </Link>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-3 rounded-xl bg-white px-4 py-2.5 ring-1 ring-[#DCE4FB]">
                <Layers className="h-4 w-4 shrink-0 text-brand-600" />
                <span className="text-[13.5px] text-ink-2">
                  <b className="font-semibold text-ink">
                    Underneath: one inventory and one security graph.
                  </b>{" "}
                  Every engine reads it, so a finding in code, cloud or SaaS joins up with the rest.
                </span>
              </div>
            </div>
            <Down color={AIOPS_COLOR} />

            {/* 3 · Onam AI, the headline feature */}
            <div
              data-port="ai"
              className="relative z-10 overflow-hidden rounded-3xl bg-night p-5 text-white shadow-[0_24px_60px_rgba(11,18,32,.35)] ring-1 ring-[#1E2A44] sm:p-6 lg:mt-14"
            >
              <div
                className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-35 blur-3xl"
                style={{ background: "radial-gradient(#818CF8,#C084FC 60%,transparent)" }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full opacity-25 blur-3xl"
                style={{ background: "#22D3EE" }}
                aria-hidden
              />
              <OnamAiShowcase still={still} />
            </div>
          </div>

          {/* 4 · Outcomes */}
          <ul className="mt-5 flex flex-wrap justify-center gap-2 lg:hidden">
            {OUTCOMES.map((o) => (
              <li
                key={o}
                className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink"
              >
                {o}
              </li>
            ))}
          </ul>
        </figure>
      </div>
    </section>
  );
}
