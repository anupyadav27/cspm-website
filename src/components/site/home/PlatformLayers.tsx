import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  AppWindow,
  ArrowRight,
  Ban,
  Blocks,
  Boxes,
  Bot,
  Check,
  ClipboardCheck,
  Cloud,
  Container,
  Cpu,
  Crosshair,
  Database,
  FileCode2,
  GitBranch,
  KeyRound,
  Layers,
  ListOrdered,
  Network,
  Package,
  Radar,
  ScanSearch,
  ScrollText,
  Server,
  Share2,
  ShieldCheck,
  ShieldHalf,
  Terminal,
  UserRound,
  Users,
  type LucideIcon,
} from "@/components/site/icons";
import { CloudLogo } from "@/components/site/CloudLogo";
import { CompassMark } from "@/components/site/Logo";
import { useReducedMotion } from "@/components/site/product/DataFlow";
import { CODE_HOSTS, SAAS_APPS, type SliderItem } from "./SourceSlider";

/**
 * How Onam Security fits together: the homepage's first visual.
 *
 *   1 Connect (code, cloud, SaaS) -> 2 Onam Security (one platform on one inventory and graph)
 *   -> 3 Onam AI (works the queue, hands over the real threats) -> then fix one in your editor
 *
 * Look (owner feedback 28 Nov 2026, "looks AI-generated"): flat colours, no gradients, glows,
 * blur blobs, spinning rings or sparkle icons; sentence-case labels; 8-12px corners; Onam AI drawn
 * as a product window with the Onam compass mark. One grid for every width: it stacks on phones and
 * becomes three columns at 1024px, where measured connectors join each source to its line and
 * each line to Onam AI.
 *
 * Facts (threat-engine): AI review only labels likely false positives (secops_fix routers/triage.py);
 * Jira / ServiceNow tickets carry fix steps, commands and the AI fix prompt (bff/_ticket_content.py);
 * the VS Code step uses the customer's own coding agent and the ticketing system's MCP server.
 * Example rows only: no counts, no customer data. Estate, FinOps and DRM are retired.
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
  id: "code" | "cloud" | "saas" | "ai";
  name: string;
  href: string;
  icon: LucideIcon;
  color: string;
  /** A few short points, each with a small icon. */
  points: { label: string; icon: LucideIcon }[];
};

const LINES: Line[] = [
  {
    id: "code",
    name: "Code security",
    href: "/platform/code-security",
    icon: FileCode2,
    color: "#0E7490",
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
    color: "#1D4ED8",
    points: [
      { label: "CSPM", icon: ShieldCheck },
      { label: "CIEM", icon: Users },
      { label: "DSPM", icon: Database },
      { label: "CWPP", icon: Server },
      { label: "KSPM", icon: Container },
      { label: "Attack paths", icon: Network },
      { label: "Compliance", icon: ClipboardCheck },
    ],
  },
  {
    id: "saas",
    name: "SaaS security",
    href: "/platform/saas-security",
    icon: AppWindow,
    color: "#6D28D9",
    points: [
      { label: "Posture", icon: ShieldHalf },
      { label: "Admin roles", icon: UserRound },
      { label: "Sharing settings", icon: Share2 },
    ],
  },
  {
    id: "ai",
    name: "AI security (AI-SPM)",
    href: "/platform/ai-spm",
    icon: Cpu,
    color: "#BE185D",
    points: [
      { label: "AI inventory", icon: Boxes },
      { label: "AI-BOM", icon: Package },
      { label: "Guardrails", icon: ShieldCheck },
      { label: "AI agents", icon: Bot },
      { label: "AI in SaaS", icon: AppWindow },
    ],
  },
];

// Literal classes so Tailwind sees them: each source and its line share a row at 1024px.
const ROW: Record<Line["id"], string> = {
  code: "lg:row-start-2",
  cloud: "lg:row-start-3",
  saas: "lg:row-start-4",
  ai: "lg:row-start-5",
};

const STEPS: { name: string; icon: LucideIcon; doing: string }[] = [
  { name: "Triage", icon: ListOrdered, doing: "Ranking every alert by real risk" },
  { name: "Assign", icon: Users, doing: "Routing each finding to its owner" },
  { name: "False positives", icon: Ban, doing: "Flagging likely false positives" },
  { name: "Focus", icon: Crosshair, doing: "Cutting the queue to what needs you" },
  { name: "Fix prompt", icon: ScrollText, doing: "Writing a fix prompt into each ticket" },
];

type Threat = { title: string; sev: "Critical" | "High"; owner: string };
// Example rows only.
const THREATS: Threat[] = [
  { title: "Public storage bucket", sev: "Critical", owner: "Cloud team" },
  { title: "SQL injection in checkout", sev: "Critical", owner: "Dev team" },
  { title: "Guest user with admin rights", sev: "High", owner: "IT team" },
];
const SEV: Record<Threat["sev"], string> = {
  Critical: "bg-[#FEF3F2] text-[#B42318] ring-[#FECDCA]",
  High: "bg-[#FFFAEB] text-[#B54708] ring-[#FEDF89]",
};

/* ---------------------------------------------------------------- the AI clock */

/** Steps 0..4, a short hold on the last, then again. Still: the finished state. */
function useAiStep(still: boolean) {
  const [step, setStep] = useState(4);
  useEffect(() => {
    if (still) return setStep(4);
    setStep(0);
    const id = setInterval(() => setStep((x) => (x >= 6 ? 0 : x + 1)), 1800);
    return () => clearInterval(id);
  }, [still]);
  return Math.min(step, 4);
}

/* ---------------------------------------------------------------- connectors (>= 1024px) */

type Wire = {
  from: string;
  to: string;
  color: string;
  delay: number;
  ty?: number;
  /** "right" (default): right edge -> left edge; "down": bottom -> top; "back": left edge -> right edge. */
  kind?: "right" | "down" | "back" | "under";
  label?: string;
};
type Drawn = { d: string; color: string; delay: number; label?: string; lx?: number; ly?: number };

const WIRES: Wire[] = [
  { from: "src-code", to: "line-code", color: "#0E7490", delay: 0 },
  { from: "src-cloud", to: "line-cloud", color: "#1D4ED8", delay: 0.5 },
  { from: "src-saas", to: "line-saas", color: "#6D28D9", delay: 1 },
  { from: "src-cloud", to: "line-ai", color: "#BE185D", delay: 1.4 },
  { from: "line-code", to: "ai", color: "#0E7490", delay: 0.3, ty: 0.2 },
  { from: "line-cloud", to: "ai", color: "#1D4ED8", delay: 0.8, ty: 0.4 },
  { from: "line-saas", to: "ai", color: "#6D28D9", delay: 1.3, ty: 0.6 },
  { from: "line-ai", to: "ai", color: "#BE185D", delay: 1.7, ty: 0.8 },
  { from: "ai", to: "ide", color: "#2563EB", delay: 0.2, kind: "down" },
  {
    from: "ide",
    to: "done",
    color: "#16A34A",
    delay: 0.4,
    kind: "under",
    label: "Fixes go back to where they live",
  },
];

/** Left-to-right curves from the right edge of one [data-port] to the left edge of another. */
function useWires(box: React.RefObject<HTMLElement | null>) {
  const [s, setS] = useState<{ w: number; h: number; links: Drawn[] }>({ w: 0, h: 0, links: [] });
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      if (window.innerWidth < 1024) return setS({ w: 0, h: 0, links: [] });
      const r = el.getBoundingClientRect();
      const at = (id: string) =>
        el.querySelector<HTMLElement>(`[data-port="${id}"]`)?.getBoundingClientRect();
      const links: Drawn[] = [];
      for (const w of WIRES) {
        const a = at(w.from);
        const b = at(w.to);
        if (!a || !b) continue;
        if (w.kind === "under") {
          // Below everything: down from the bottom of `from`, left, then up into the bottom of `to`.
          const x1 = a.left + a.width * 0.3 - r.left;
          const x2 = b.left + b.width / 2 - r.left;
          const y1 = a.bottom - r.top;
          const y2 = b.bottom - r.top;
          const frame = el.querySelector<HTMLElement>("[data-frame]")?.getBoundingClientRect();
          const lowest = Math.max(y1, y2, frame ? frame.bottom - r.top : 0);
          const Y = lowest + 28;
          const c = 10;
          links.push({
            d: `M${x1} ${y1} L${x1} ${Y - c} Q${x1} ${Y} ${x1 - c} ${Y} L${x2 + c} ${Y} Q${x2} ${Y} ${x2} ${Y - c} L${x2} ${y2}`,
            ...w,
            lx: (x1 + x2) / 2,
            ly: Y,
          });
          continue;
        }
        if (w.kind === "down") {
          const x1 = a.left + a.width / 2 - r.left;
          const y1 = a.bottom - r.top;
          const x2 = b.left + b.width / 2 - r.left;
          const y2 = b.top - r.top;
          const my = (y1 + y2) / 2;
          links.push({ d: `M${x1} ${y1} C${x1} ${my} ${x2} ${my} ${x2} ${y2}`, ...w });
          continue;
        }
        const back = w.kind === "back";
        const x1 = (back ? a.left : a.right) - r.left;
        const y1 = a.top + a.height / 2 - r.top;
        const x2 = (back ? b.right : b.left) - r.left;
        const y2 = b.top + b.height * (w.ty ?? 0.5) - r.top;
        const mx = (x1 + x2) / 2;
        links.push({ d: `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`, ...w });
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
  }, [box]);
  return s;
}

/* ---------------------------------------------------------------- small parts */

function ColHead({
  n,
  title,
  sub,
  className = "",
  children,
}: {
  n: string;
  title: string;
  sub: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`flex items-end justify-between gap-3 ${className}`}>
      <div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[13px] text-muted-500">{n}</span>
          <span className="font-display text-[19px] font-semibold text-ink">{title}</span>
        </div>
        <div className="text-[13.5px] text-muted-500">{sub}</div>
      </div>
      {children}
    </div>
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
        <span className="text-[12px] font-medium leading-tight text-ink-2">{item.name}</span>
      )}
    </span>
  );
}

const tile =
  "flex h-[50px] items-center justify-center rounded-md border border-line bg-white px-1 text-center";

/** One section of the Connect box: icon, name, hint, then its logos. */
function SourceSection({
  port,
  icon: Icon,
  name,
  hint,
  color,
  children,
}: {
  port: string;
  icon: LucideIcon;
  name: string;
  hint: string;
  color: string;
  children: ReactNode;
}) {
  return (
    <div data-port={port} className="flex flex-1 flex-col justify-center p-3">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4" style={{ color }} />
        <span className="text-[14px] font-semibold text-ink">{name}</span>
        <span className="text-[13px] text-muted-500">{hint}</span>
      </div>
      {children}
    </div>
  );
}

/** SaaS apps keep growing, so they slide: one row of tiles, paused on hover. */
function SaasMarquee({ still }: { still: boolean }) {
  const items = [...SAAS_APPS, ...SAAS_APPS];
  return (
    <div
      className="group relative overflow-hidden"
      style={{
        maskImage: "linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)",
        WebkitMaskImage: "linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)",
      }}
    >
      <span className="sr-only">{SAAS_APPS.map((a) => a.name).join(", ")}</span>
      <ul className={`flex w-max gap-1.5 ${still ? "" : "saas-marquee"}`} aria-hidden>
        {items.map((c, k) => (
          <li key={k} className={`${tile} w-[92px] shrink-0`}>
            <AppLogo item={c} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function LineCard({ line }: { line: Line }) {
  return (
    <Link
      to={line.href}
      data-port={`line-${line.id}`}
      className={`group relative flex flex-col justify-center rounded-lg border border-line bg-white px-4 py-3 transition hover:border-[#98A2B3] lg:col-start-2 ${ROW[line.id]}`}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-white"
          style={{ background: line.color }}
        >
          <line.icon className="h-[18px] w-[18px]" />
        </span>
        <span className="font-display text-[16px] font-semibold text-ink group-hover:underline">
          {line.name}
        </span>
        <ArrowRight className="ml-auto h-4 w-4 text-muted-500" />
      </div>
      <ul className="mt-2.5 flex flex-wrap gap-1.5">
        {line.points.map((p) => (
          <li
            key={p.label}
            className="inline-flex items-center gap-1 rounded border border-line bg-surface px-1.5 py-0.5 text-[12.5px] font-medium text-ink-2"
          >
            <p.icon className="h-3.5 w-3.5 shrink-0" style={{ color: line.color }} />
            {p.label}
          </li>
        ))}
      </ul>
    </Link>
  );
}

/* ---------------------------------------------------------------- Onam AI window */

/** A plain stepper: numbered steps on a line, the active one filled, a status line under it. */
function Stepper({ step, still }: { step: number; still: boolean }) {
  return (
    <div>
      <ol className="relative grid grid-cols-5">
        <span className="absolute left-[10%] right-[10%] top-[15px] h-0.5 bg-line" aria-hidden />
        <span
          className="absolute left-[10%] top-[15px] h-0.5 bg-[#2563EB] transition-[width] duration-700 ease-out"
          style={{ width: `${(step / 4) * 80}%` }}
          aria-hidden
        />
        {STEPS.map((st, k) => {
          const on = k === step && !still;
          const done = k < step || still;
          return (
            <li key={st.name} className="relative flex flex-col items-center text-center">
              <span
                className={`grid h-8 w-8 place-items-center rounded-full border-2 transition-colors duration-500 ${
                  on
                    ? "border-[#2563EB] bg-[#2563EB] text-white"
                    : done
                      ? "border-[#2563EB] bg-white text-[#2563EB]"
                      : "border-line bg-white text-muted-500"
                }`}
              >
                {done && !on ? <Check className="h-4 w-4" /> : <st.icon className="h-4 w-4" />}
              </span>
              <span
                className={`mt-1.5 text-[12.5px] leading-tight ${on ? "font-semibold text-ink" : "text-ink-2"}`}
              >
                {st.name}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-2.5 flex h-8 items-center gap-2 overflow-hidden whitespace-nowrap rounded-md bg-surface px-3 text-[13px] text-ink-2">
        <span
          className={`h-2 w-2 shrink-0 rounded-full bg-[#2563EB] ${still ? "" : "animate-pulse motion-reduce:animate-none"}`}
          aria-hidden
        />
        <span className="truncate">
          <b className="font-semibold text-ink">Onam AI:</b>{" "}
          {still ? "Done. The real threats are handed to you." : `${STEPS[step].doing}…`}
        </span>
      </p>
    </div>
  );
}

/** The handover: placeholder rows while Onam AI works, then the real threats as a small table. */
function Handover({ step, still }: { step: number; still: boolean }) {
  const s = still ? 4 : step;
  const ready = s >= 3;
  const th = "px-3 py-1.5 text-left text-[12px] font-semibold text-muted-500";
  const td = "px-3 py-1.5 align-middle";
  return (
    <div className="overflow-hidden rounded-md border border-line" aria-hidden>
      <table className="w-full table-fixed border-collapse text-[13px]">
        <thead className="bg-surface">
          <tr>
            <th className={`${th} w-[80px]`}>Severity</th>
            <th className={th}>Finding</th>
            <th className={`${th} hidden w-[96px] sm:table-cell`}>Owner</th>
            <th className={`${th} w-[80px]`}>Ticket</th>
          </tr>
        </thead>
        <tbody>
          {THREATS.map((t) => (
            <tr key={t.title} className="h-[52px] border-t border-line sm:h-[32px]">
              {ready ? (
                <>
                  <td className={td}>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[12px] font-semibold ring-1 ${SEV[t.sev]}`}
                    >
                      {t.sev}
                    </span>
                  </td>
                  <td className={`${td} font-medium leading-snug text-ink sm:truncate`}>
                    {t.title}
                  </td>
                  <td className={`${td} hidden truncate text-ink-2 sm:table-cell`}>{t.owner}</td>
                  <td className={td}>
                    <span
                      className="inline-flex items-center gap-1 font-medium text-[#1D4ED8] transition-opacity duration-500"
                      style={{ opacity: s >= 4 ? 1 : 0 }}
                    >
                      <Check className="h-3.5 w-3.5" /> Raised
                    </span>
                  </td>
                </>
              ) : (
                <td colSpan={4} className="px-3">
                  <span className="block h-3 w-3/4 animate-pulse rounded bg-[#EAECF0] motion-reduce:animate-none" />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-t border-line bg-surface px-3 py-1.5 text-[12.5px] text-muted-500">
        Set aside for your review: likely false positives and low-risk findings.
      </div>
    </div>
  );
}

function AiWindow({ step, still }: { step: number; still: boolean }) {
  return (
    <div
      data-port="ai"
      className="relative flex flex-col overflow-hidden rounded-xl border border-[#D0D5DD] bg-white shadow-[0_12px_32px_rgba(16,24,40,.10)] lg:col-start-3 lg:row-span-3 lg:row-start-2"
    >
      <div className="flex items-center gap-3 bg-ink px-4 py-2 text-white">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-white">
          <CompassMark size={20} />
        </span>
        <div className="leading-tight">
          <div className="font-display text-[17px] font-semibold">Onam AI</div>
          <div className="text-[13px] text-on-night-muted">Your AI security analyst</div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-3.5">
        <section>
          <h3 className="mb-2.5 text-[14px] font-semibold text-ink">Works the queue for you</h3>
          <Stepper step={step} still={still} />
        </section>
        <section>
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <h3 className="text-[14px] font-semibold text-ink">Hands you the real threats</h3>
            <span className="text-[12.5px] text-muted-500">True positives only</span>
          </div>
          <Handover step={step} still={still} />
        </section>
      </div>
    </div>
  );
}

type Fix = { title: string; file: string; minus: string; plus: string };
// Example tickets a developer fixes in the editor (code and IaC). Generic, no real values.
const FIXES: Fix[] = [
  {
    title: "Public storage bucket",
    file: "storage.tf",
    minus: 'acl = "public-read"',
    plus: 'acl = "private"',
  },
  {
    title: "SQL injection in checkout",
    file: "checkout.py",
    minus: 'db.query("... WHERE id=" + order_id)',
    plus: 'db.query("... WHERE id = %s", [order_id])',
  },
  {
    title: "Hard-coded API key",
    file: "config.py",
    minus: 'API_KEY = "hard-coded-value"',
    plus: 'API_KEY = os.environ["API_KEY"]',
  },
];

const SUBSTEPS = ["Ticket opened", "Agent read it via MCP", "Fix drafted", "Ready for review"];

/** t counts sub-steps: ticket = t / 4, sub-step = t % 4; 12+ is "all fixed" (held). Still: done. */
function useFixClock(still: boolean) {
  const [t, setT] = useState(15);
  useEffect(() => {
    if (still) return setT(15);
    setT(0);
    const id = setInterval(() => setT((x) => (x >= 16 ? 0 : x + 1)), 700);
    return () => clearInterval(id);
  }, [still]);
  return Math.min(t, 12);
}

/** A developer seen from behind, with a headset: flat shapes, no gradients. */
function Developer({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 112" className={`dev-bob ${className}`} aria-hidden>
      <path d="M2 112 C4 84 24 70 60 70 C96 70 116 84 118 112 Z" fill="#334155" />
      <path d="M44 72 C50 80 70 80 76 72" fill="none" stroke="#1E293B" strokeWidth="3" />
      <rect x="52" y="56" width="16" height="14" rx="3" fill="#B9825A" />
      <ellipse cx="36.5" cy="40" rx="5" ry="7" fill="#B9825A" />
      <ellipse cx="83.5" cy="40" rx="5" ry="7" fill="#B9825A" />
      <circle cx="60" cy="36" r="24" fill="#1E293B" />
      <path d="M33 38 C33 14 87 14 87 38" fill="none" stroke="#64748B" strokeWidth="4" />
      <rect x="29" y="34" width="8" height="14" rx="3" fill="#475569" />
      <rect x="83" y="34" width="8" height="14" rx="3" fill="#475569" />
    </svg>
  );
}

/** The laptop: VS Code, tickets from Onam AI on the left, the current ticket's steps on the right. */
function LaptopIde({ t }: { t: number }) {
  const ticket = Math.floor(t / 4);
  const sub = t % 4;
  const done = ticket >= 3;
  const cur = FIXES[Math.min(ticket, 2)];
  return (
    <div className="relative" aria-hidden>
      <div className="rounded-t-xl border border-[#1F2937] bg-[#1F2937] p-1.5 pb-2">
        <div className="overflow-hidden rounded-md bg-[#0F172A] text-[12.5px] text-[#CBD5E1]">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-[#111827] px-3 py-1.5 text-[12px] text-[#9CA3AF]">
            <span className="flex items-center gap-1.5 truncate">
              <Terminal className="h-3.5 w-3.5 shrink-0" /> VS Code · your repository
            </span>
            <span
              className={`whitespace-nowrap rounded px-1.5 py-0.5 font-semibold ${done ? "bg-[#14532D] text-[#86EFAC]" : "bg-white/10 text-[#CBD5E1]"}`}
            >
              {done ? "All fixed" : "Your agent · via MCP"}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:h-[124px] sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="border-b border-white/10 p-2 sm:border-b-0 sm:border-r">
              <div className="mb-1 px-1 text-[12px] text-[#9CA3AF]">Tickets from Onam AI</div>
              <ul className="space-y-0.5">
                {FIXES.map((f, k) => {
                  const fixed = k < ticket;
                  const now = k === ticket;
                  return (
                    <li
                      key={f.title}
                      className={`flex items-center gap-1.5 rounded px-1.5 py-[3px] transition-colors duration-300 ${now ? "bg-white/10 text-white" : ""}`}
                    >
                      {fixed ? (
                        <Check className="h-3.5 w-3.5 shrink-0 text-[#4ADE80]" />
                      ) : now ? (
                        <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#60A5FA] motion-reduce:animate-none" />
                      ) : (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-[#F87171]" />
                      )}
                      <span
                        className={`min-w-0 flex-1 truncate ${fixed ? "text-[#94A3B8] line-through" : ""}`}
                      >
                        {f.title}
                      </span>
                      <span
                        className={`shrink-0 text-[12px] ${fixed ? "text-[#4ADE80]" : now ? "text-[#93C5FD]" : "text-[#F87171]"}`}
                      >
                        {fixed ? "Fixed" : now ? "Fixing" : "Open"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="h-[124px] overflow-hidden p-2 sm:h-auto">
              {done ? (
                <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#14532D]">
                    <Check className="h-4 w-4 text-[#86EFAC]" />
                  </span>
                  <span className="text-[13.5px] font-semibold text-white">All fixed</span>
                  <span className="text-[12px] text-[#9CA3AF]">
                    Ready for your review and merge
                  </span>
                </div>
              ) : (
                <>
                  <div className="mb-1 truncate px-1 text-[12px] text-[#9CA3AF]">{cur.title}</div>
                  <ol className="space-y-0.5 px-1">
                    {SUBSTEPS.map((x, k) => (
                      <li
                        key={x}
                        className={`flex items-center gap-1.5 ${k < sub ? "text-[#CBD5E1]" : k === sub ? "text-white" : "text-[#64748B]"}`}
                      >
                        {k < sub ? (
                          <Check className="h-3.5 w-3.5 shrink-0 text-[#4ADE80]" />
                        ) : (
                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${k === sub ? "bg-[#60A5FA]" : "bg-[#475569]"}`}
                          />
                        )}
                        {x}
                      </li>
                    ))}
                  </ol>
                  {sub >= 2 ? (
                    <div className="cf-pop mt-1.5 font-mono text-[12px]">
                      <div className="truncate rounded-sm bg-[#3B1219] px-1.5 text-[#FDA4AF]">
                        - {cur.minus}
                      </div>
                      <div className="mt-0.5 truncate rounded-sm bg-[#0F2E1D] px-1.5 text-[#86EFAC]">
                        + {cur.plus}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1.5 h-[38px]" />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto h-2 w-[106%] -translate-x-[3%] rounded-b-lg bg-[#9CA3AF]" />
      <div className="mx-auto h-1 w-24 rounded-b bg-[#6B7280]" />
    </div>
  );
}

/** Under Onam AI: the developer at the laptop, fixing the tickets Onam AI raised. */
function DevBox({ t }: { t: number }) {
  return (
    <div
      data-port="ide"
      className="relative mt-3 rounded-xl border border-line bg-surface p-3 lg:col-start-3 lg:row-span-2 lg:row-start-5 lg:mt-4"
    >
      <div className="mb-2 flex items-baseline justify-between gap-2 px-1">
        <h3 className="text-[14px] font-semibold text-ink">Your developer fixes them</h3>
        <span className="text-[12.5px] text-muted-500">A person reviews every change</span>
      </div>
      <div className="relative pb-1 sm:pl-16">
        <LaptopIde t={t} />
        <Developer className="absolute -bottom-1 -left-1 hidden w-[84px] sm:block" />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- the figure */

export function PlatformLayers() {
  const reduced = useReducedMotion();
  const [stopped, setStopped] = useState(false);
  const still = reduced || stopped;
  const step = useAiStep(still);
  const fixT = useFixClock(still);
  const fixDone = fixT >= 12;
  const box = useRef<HTMLDivElement>(null);
  const { w, h, links } = useWires(box);

  return (
    <section id="platform" className="relative scroll-mt-20 border-b border-line bg-white">
      <div className="absolute inset-x-0 top-0 h-24 bg-night md:h-40" aria-hidden />
      <div className="relative mx-auto -mt-16 max-w-7xl px-4 pb-16 sm:px-6 md:-mt-24 md:pb-20">
        <figure className="relative rounded-2xl border border-line bg-white p-4 shadow-[0_16px_48px_rgba(11,18,32,.14)] sm:p-6 lg:px-8 lg:pb-3 lg:pt-5">
          <figcaption className="sr-only">
            How Onam Security fits together. 1, connect your code repositories, your clouds and your
            SaaS apps. 2, Onam Security checks them with code, cloud and SaaS security, on one
            shared inventory and security graph. 3, Onam AI works the queue: it ranks alerts by real
            risk, routes each finding to its owner, flags likely false positives for your team to
            confirm, cuts the queue to what needs you, and raises a Jira or ServiceNow ticket with
            an AI fix prompt. Your coding agent in VS Code reads the ticket through MCP and drafts
            the fix in your own code, and a person reviews every change.
          </figcaption>

          <div
            ref={box}
            className="relative grid grid-cols-[minmax(0,1fr)] gap-3 lg:pb-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.86fr)_minmax(0,1.5fr)] lg:gap-x-12"
          >
            {w > 0 && (
              <svg
                className="pointer-events-none absolute inset-0 z-20 overflow-visible"
                width={w}
                height={h}
                aria-hidden
              >
                <defs>
                  <marker
                    id="fix-arrow"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                  >
                    <path d="M0 0 L10 5 L0 10 z" fill="#16A34A" />
                  </marker>
                </defs>
                {links.map((l, k) => (
                  <g key={k}>
                    <path
                      d={l.d}
                      fill="none"
                      stroke={l.color}
                      strokeOpacity={l.label ? 1 : 0.35}
                      strokeWidth={l.label ? 2 : 1.5}
                      markerEnd={l.label ? "url(#fix-arrow)" : undefined}
                    />
                    {l.label && (
                      <g>
                        <rect
                          x={(l.lx ?? 0) - 128}
                          y={(l.ly ?? 0) - 13}
                          width="256"
                          height="26"
                          rx="13"
                          fill="#ECFDF3"
                          stroke="#16A34A"
                        />
                        <text
                          x={l.lx}
                          y={(l.ly ?? 0) + 4.5}
                          textAnchor="middle"
                          fontSize="13"
                          fontWeight="600"
                          fill="#067647"
                        >
                          ← {l.label}
                        </text>
                      </g>
                    )}
                    {!still && (
                      <circle r="3.5" fill={l.color}>
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

            {/* 1 · Connect */}
            <ColHead
              n="01"
              title="Connect"
              sub="Your code, clouds and SaaS"
              className="lg:col-start-1 lg:row-start-1"
            />
            <div className="relative flex flex-col divide-y divide-line rounded-lg border border-line bg-surface lg:col-start-1 lg:row-span-5 lg:row-start-2">
              <SourceSection
                port="src-code"
                icon={GitBranch}
                name="Code"
                hint="repositories"
                color="#0E7490"
              >
                <ul className="grid grid-cols-3 gap-1.5">
                  {CODE_HOSTS.map((c) => (
                    <li key={c.name} className={tile}>
                      <AppLogo item={c} />
                    </li>
                  ))}
                </ul>
              </SourceSection>
              <SourceSection
                port="src-cloud"
                icon={Cloud}
                name="Cloud"
                hint="accounts and clusters"
                color="#1D4ED8"
              >
                <ul className="grid grid-cols-3 gap-1.5">
                  {CLOUDS.map((c) => (
                    <li key={c} className={tile}>
                      <CloudLogo
                        name={c}
                        height={20}
                        maxWidth={96}
                        stack
                        nameClassName="text-[12px] font-medium leading-tight text-ink-2"
                      />
                    </li>
                  ))}
                </ul>
              </SourceSection>
              <SourceSection
                port="src-saas"
                icon={AppWindow}
                name="SaaS"
                hint="apps your teams use"
                color="#6D28D9"
              >
                <SaasMarquee still={still} />
              </SourceSection>
              <div
                data-port="done"
                className={`flex items-center gap-2 rounded-b-lg px-3 py-2.5 text-[13px] font-semibold transition-colors duration-500 ${
                  fixDone ? "bg-[#ECFDF3] text-[#067647]" : "text-muted-500"
                }`}
              >
                <ShieldCheck className="h-4 w-4 shrink-0" />
                {fixDone ? "Fixed here. The next scan confirms it." : "Fixes land back here"}
              </div>
            </div>

            {/* 2 · Onam Security: frame, three lines, the foundation */}
            <ColHead
              n="02"
              title="Onam Security"
              sub="One platform for code, cloud and SaaS"
              className="mt-5 lg:col-start-2 lg:row-start-1 lg:mt-0"
            />
            <div
              data-frame
              className="-m-2.5 hidden rounded-xl border border-dashed border-[#B2CCFF] bg-[#F5F8FF] lg:col-start-2 lg:row-span-5 lg:row-start-2 lg:block"
              aria-hidden
            />
            {LINES.map((l) => (
              <LineCard key={l.id} line={l} />
            ))}
            <div className="relative flex items-center gap-2.5 rounded-lg bg-ink px-3.5 py-2.5 text-[13px] text-white lg:col-start-2 lg:row-start-6 lg:self-end">
              <Layers className="h-4 w-4 shrink-0 text-[#B2CCFF]" />
              <span>
                <b className="font-semibold">Foundation:</b> one inventory, one security graph
              </span>
            </div>

            {/* 3 · Onam AI */}
            <ColHead
              n="03"
              title="Onam AI"
              sub="Decides what to fix first, and who fixes it"
              className="mt-5 lg:col-start-3 lg:row-start-1 lg:mt-0"
            >
              <button
                type="button"
                onClick={() => setStopped((v) => !v)}
                aria-pressed={stopped}
                className="inline-flex min-h-6 shrink-0 items-center rounded-md px-2 text-[12.5px] font-medium text-navy-600 hover:bg-surface hover:text-ink"
              >
                {stopped ? "Play animation" : "Pause animation"}
              </button>
            </ColHead>
            <AiWindow step={step} still={still} />

            <DevBox t={fixT} />
          </div>
        </figure>
      </div>
    </section>
  );
}
