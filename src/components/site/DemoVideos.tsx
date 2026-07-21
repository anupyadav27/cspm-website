import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";
import { CompassMark } from "./Logo";
import {
  LayoutDashboard, Boxes, GitFork, Bug, Activity, CheckSquare, Shield,
  Users, Eye, Database, FileText, CloudUpload, ShieldCheck, Cloud, Gauge,
  Box, Share2,
} from "lucide-react";

/**
 * ProductDemo — the real Onam console, replicated as an animated demo.
 *
 * The stage is a faithful replica of the production app (sidebar, topbar,
 * demo-account data taken from real product screens). Each clip is a coded
 * animation today; when a real .mp4 screen recording becomes available, set
 * `videoSrc` on the clip below and the component renders a native <video>
 * in its place — no other changes required.
 *
 * Embed on any page:
 *   <ProductDemo />                                    // all five clips
 *   <ProductDemo clips={["scan", "attack"]} compact /> // page-specific
 */

export type ClipKey =
  | "dashboard" | "scan" | "assets" | "attack" | "ciem" | "cdr"
  | "cwpp" | "network" | "datasec" | "risk" | "compliance" | "onboard";

type PillTone = "green" | "blue" | "red" | "amber" | "gray";

type Clip = {
  key: ClipKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  sub: string;
  nav: string; // active sidebar item
  page: {
    title: string;
    chips?: { text: string; tone: PillTone }[];
    action?: string;
  };
  duration: number; // seconds
  /** When set to a real video URL, the animation is replaced by a <video>. */
  videoSrc?: string;
};

const CLIPS: Clip[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: Gauge,
    title: "Your whole cloud on one screen",
    sub: "Risk score, engines, severity and connected clouds — 12,481 assets live",
    nav: "dashboard",
    page: {
      title: "Dashboard",
      chips: [{ text: "aws-prod-main", tone: "gray" }],
      action: "Run Scan",
    },
    duration: 12,
    // videoSrc: "/video/demo-dashboard.mp4",
  },
  {
    key: "scan",
    label: "Security Scan",
    icon: ShieldCheck,
    title: "Watch a full cloud scan",
    sub: "aws-prod-main → 12,481 resources → 1,051 findings ranked by severity",
    nav: "cspm",
    page: {
      title: "Alerts",
      chips: [
        { text: "12 Critical", tone: "red" },
        { text: "89 High", tone: "amber" },
      ],
      action: "Export",
    },
    duration: 11,
    // videoSrc: "/video/demo.mp4",
  },
  {
    key: "assets",
    label: "Assets",
    icon: Boxes,
    title: "Every asset, every cloud, one inventory",
    sub: "12,481 resources across AWS, GCP and Azure — typed, tagged and risk-ranked",
    nav: "assets",
    page: {
      title: "Assets — Inventory",
      chips: [
        { text: "12,481 resources", tone: "gray" },
        { text: "3 clouds", tone: "blue" },
      ],
      action: "Export CSV",
    },
    duration: 10,
    // videoSrc: "/video/demo-assets.mp4",
  },
  {
    key: "attack",
    label: "Attack Path",
    icon: GitFork,
    title: "Watch an attack path build",
    sub: "EC2 → IMDSv1 → OpsAdminRole → S3 crown jewel — 4 hops, fix priority P0",
    nav: "attack",
    page: {
      title: "Attack Path Analysis",
      chips: [{ text: "3 Paths to Crown Jewels", tone: "red" }],
      action: "Export Report",
    },
    duration: 12,
    // videoSrc: "/video/demo-attack-path.mp4",
  },
  {
    key: "ciem",
    label: "CIEM",
    icon: Users,
    title: "Find the identities that can hurt you",
    sub: "189 identities → 47 overprivileged, 3 admins without MFA, 8 wildcard policies",
    nav: "ciem",
    page: {
      title: "IAM Security",
      chips: [{ text: "47 Overprivileged", tone: "amber" }],
      action: "Run IAM Scan",
    },
    duration: 10,
    // videoSrc: "/video/demo-ciem.mp4",
  },
  {
    key: "cdr",
    label: "CDR",
    icon: Eye,
    title: "Detections correlated in real time",
    sub: "2.3M events/hour distilled into 4 active alerts, mapped to MITRE ATT&CK",
    nav: "cdr",
    page: {
      title: "CDR — Detection & Response",
      chips: [
        { text: "4 Active Alerts", tone: "red" },
        { text: "Live · 2.3M events/hr", tone: "green" },
      ],
      action: "Configure Rules",
    },
    duration: 11,
    // videoSrc: "/video/demo-cdr.mp4",
  },
  {
    key: "cwpp",
    label: "CWPP",
    icon: Box,
    title: "Runtime workload protection",
    sub: "3 EKS clusters, 24 nodes — CVEs ranked by CVSS × EPSS with exploit intel",
    nav: "cwpp",
    page: {
      title: "Container Security",
      chips: [{ text: "3 CVEs with Active Exploits", tone: "red" }],
      action: "Scan Clusters",
    },
    duration: 10,
    // videoSrc: "/video/demo-cwpp.mp4",
  },
  {
    key: "network",
    label: "Network",
    icon: Share2,
    title: "Your network edge, mapped",
    sub: "5 VPCs, 47 security groups — 7 internet-exposed resources with exact fix actions",
    nav: "cspm",
    page: {
      title: "Network Security",
      chips: [{ text: "7 Internet-Exposed", tone: "red" }],
      action: "Export Topology",
    },
    duration: 10,
    // videoSrc: "/video/demo-network.mp4",
  },
  {
    key: "datasec",
    label: "Data Security",
    icon: Database,
    title: "Know where your PII lives",
    sub: "847K PII records classified — public buckets and unencrypted stores flagged first",
    nav: "datasec",
    page: {
      title: "Data Security — DSPM",
      chips: [{ text: "3 Public Buckets with PII", tone: "red" }],
      action: "Run Classification",
    },
    duration: 10,
    // videoSrc: "/video/demo-datasec.mp4",
  },
  {
    key: "risk",
    label: "Risk",
    icon: Activity,
    title: "Risk in dollars, not scores",
    sub: "FAIR model: $5.1M annual loss expectancy across 6 scenarios and 3 crown jewels",
    nav: "risk",
    page: {
      title: "Risk — FAIR Model",
      chips: [{ text: "ALE: $2.4M – $8.7M", tone: "blue" }],
      action: "Export Risk Report",
    },
    duration: 11,
    // videoSrc: "/video/demo-risk.mp4",
  },
  {
    key: "compliance",
    label: "Compliance",
    icon: CheckSquare,
    title: "Six frameworks, scored live",
    sub: "CIS · NIST · SOC 2 · PCI · HIPAA · ISO — every failing control mapped to a resource",
    nav: "compliance",
    page: {
      title: "Compliance",
      chips: [
        { text: "6 Frameworks", tone: "blue" },
        { text: "565 Failing Controls", tone: "amber" },
      ],
      action: "Generate Report",
    },
    duration: 11,
    // videoSrc: "/video/demo-compliance.mp4",
  },
  {
    key: "onboard",
    label: "Connect Cloud",
    icon: Cloud,
    title: "Connect your first cloud account",
    sub: "Read-only IAM role — validated and scanning in under 3 minutes",
    nav: "onboarding",
    page: {
      title: "Add Cloud Account",
      chips: [{ text: "Read-only · No agents", tone: "blue" }],
      action: "Docs",
    },
    duration: 9,
    // videoSrc: "/video/demo-onboarding.mp4",
  },
];

const ALL_KEYS: ClipKey[] = CLIPS.map((c) => c.key);

export function ProductDemo({
  clips = ALL_KEYS,
  eyebrow = "Product demo",
  title = "Watch the platform in action.",
  gradientWords = "in action.",
  subtitle = "This is the real Onam console — the same views your team gets on day one, running on a live demo account.",
  compact = false,
  tone = "gray",
  id,
}: {
  clips?: ClipKey[];
  eyebrow?: string;
  title?: string;
  gradientWords?: string;
  subtitle?: string;
  compact?: boolean;
  tone?: "gray" | "white";
  id?: string;
}) {
  // Preserve the caller's order so each page's lead clip plays first.
  const list = clips
    .map((k) => CLIPS.find((c) => c.key === k))
    .filter((c): c is Clip => Boolean(c));
  const [i, setI] = useState(0);
  const clip = list[Math.min(i, list.length - 1)];
  if (!clip) return null;

  return (
    <section
      id={id}
      className={cn(
        "relative border-b border-[#E5E9F0]",
        tone === "gray" ? "bg-[#F7F9FC]" : "bg-white",
        compact ? "py-16 md:py-20" : "py-24",
      )}
    >
      {tone === "gray" && <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />}
      <div className="relative max-w-7xl mx-auto px-6">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          gradientWords={gradientWords}
        />

        {/* Tab switcher (pills) */}
        {list.length > 1 && (
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {list.map((c, idx) => {
              const Icon = c.icon;
              const active = idx === i;
              return (
                <button
                  key={c.key}
                  onClick={() => setI(idx)}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition",
                    active
                      ? "bg-[#2563EB] text-white border-[#2563EB] shadow-[0_4px_10px_rgba(37,99,235,.25)]"
                      : "bg-white text-[#0B1220] border-[#E5E9F0] hover:border-[#94A3B8]",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {c.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Console frame */}
        <div className={cn("rounded-2xl border border-[#E5E9F0] bg-white shadow-[0_18px_48px_rgba(16,24,40,.10)] overflow-hidden", list.length > 1 ? "mt-8" : "mt-10")}>
          {/* key resets the animation on tab change so it plays from t=0 */}
          <ConsoleStage key={clip.key} clip={clip} />
        </div>

        {/* Meta row */}
        <div className="mt-6 grid md:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <div className="font-display font-extrabold text-xl text-[#0B1220]">{clip.title}</div>
            <div className="text-sm text-[#475569] mt-1">{clip.sub}</div>
          </div>
          <div className="flex gap-3">
            <MiniStat label="Clip length" value={`${clip.duration}s`} />
            <MiniStat label="Data" value="Demo account" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Homepage section — full clip set. Kept for back-compat. */
export function DemoVideos() {
  return <ProductDemo />;
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#E5E9F0] bg-white px-4 py-2.5 min-w-[120px]">
      <div className="text-[10px] uppercase tracking-widest font-semibold text-[#64748B]">{label}</div>
      <div className="font-display font-extrabold text-[#0B1220] text-base leading-tight mt-0.5">{value}</div>
    </div>
  );
}

/* ============================================================
   The console replica: sidebar + topbar + animated stage
   ============================================================ */

const NAV_GROUPS: { group?: string; items: { key: string; label: string; sub?: string; icon: React.ComponentType<{ className?: string }> }[] }[] = [
  {
    items: [
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { key: "assets", label: "Assets", sub: "Cloud Resources", icon: Boxes },
      { key: "attack", label: "Attack Paths", sub: "Paths · ATT&CK", icon: GitFork },
      { key: "vuln", label: "Vulnerabilities", sub: "VM · CVE · SBOM", icon: Bug },
      { key: "risk", label: "Risk", sub: "FAIR Model", icon: Activity },
      { key: "compliance", label: "Compliance", sub: "CIS · NIST · HIPAA", icon: CheckSquare },
    ],
  },
  {
    group: "Cloud posture",
    items: [{ key: "cspm", label: "Cloud Posture", sub: "CSPM · Alerts", icon: Shield }],
  },
  {
    group: "Detection & data",
    items: [
      { key: "ciem", label: "CIEM", sub: "Identity & Entitlements", icon: Users },
      { key: "cdr", label: "CDR", sub: "Detection & Response", icon: Eye },
      { key: "cwpp", label: "CWPP", sub: "Workload Protection", icon: Box },
      { key: "datasec", label: "Data Security", sub: "DSPM · Database", icon: Database },
    ],
  },
  {
    group: "Platform",
    items: [
      { key: "reports", label: "Reports", icon: FileText },
      { key: "onboarding", label: "Onboarding", sub: "Providers · Users", icon: CloudUpload },
    ],
  },
];

function ConsoleSidebar({ active }: { active: string }) {
  return (
    <div className="hidden md:flex flex-col border-r border-[#E9EDF3] bg-[#F8FAFC] w-[188px] shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-1.5 px-4 pt-4 pb-3">
        <span className="font-display font-extrabold text-[15px] tracking-tight leading-none">
          <span style={{ color: "#2563EB" }}>O</span>
          <span style={{ color: "#E32D25" }}>N</span>
          <span style={{ color: "#F2AF04" }}>A</span>
          <span style={{ color: "#05A052" }}>M</span>
        </span>
        <CompassMark size={13} />
        <span className="font-display font-bold uppercase text-[7px] leading-none mt-[3px]" style={{ color: "#082869", letterSpacing: "0.22em" }}>
          Security
        </span>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-hidden px-2">
        {NAV_GROUPS.map((g, gi) => (
          <div key={gi} className="mb-1">
            {g.group && (
              <div className="px-2 pt-2 pb-1 text-[8px] font-bold uppercase tracking-[0.14em] text-[#94A3B8]">
                {g.group}
              </div>
            )}
            {g.items.map((it) => {
              const Icon = it.icon;
              const isActive = it.key === active;
              return (
                <div
                  key={it.key}
                  className={cn(
                    "flex items-center gap-2 px-2 py-[5px] rounded-lg",
                    isActive ? "bg-[#EEF0FF]" : "opacity-80",
                  )}
                >
                  <Icon className={cn("w-3.5 h-3.5 shrink-0", isActive ? "text-[#4F46E5]" : "text-[#64748B]")} />
                  <div className="min-w-0">
                    <div className={cn("text-[11px] font-semibold leading-tight truncate", isActive ? "text-[#4F46E5]" : "text-[#334155]")}>
                      {it.label}
                    </div>
                    {it.sub && <div className="text-[8px] text-[#94A3B8] leading-tight truncate">{it.sub}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* User */}
      <div className="flex items-center gap-2 px-3 py-3 border-t border-[#E9EDF3]">
        <div className="w-6 h-6 rounded-full bg-[#4F46E5] text-white grid place-items-center text-[9px] font-bold">AY</div>
        <div className="min-w-0">
          <div className="text-[10px] font-semibold text-[#0B1220] leading-tight truncate">Anup Yadav</div>
          <div className="text-[8px] text-[#94A3B8] leading-tight">Security Admin</div>
        </div>
      </div>
    </div>
  );
}

function pillToneCls(tone: PillTone) {
  switch (tone) {
    case "green": return "bg-[#E7F6EF] text-[#05A052] border-[#BFE8D2]";
    case "red": return "bg-[#FCEAEA] text-[#B41F1A] border-[#F4C1BF]";
    case "amber": return "bg-[#FEF3E4] text-[#B45309] border-[#F6DCB8]";
    case "blue": return "bg-[#EFF4FF] text-[#1D4ED8] border-[#DBE7FE]";
    default: return "bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]";
  }
}

function ConsoleTopbar({ page }: { page: Clip["page"] }) {
  return (
    <div className="flex items-center gap-3 px-4 md:px-5 h-12 border-b border-[#E9EDF3] bg-white shrink-0">
      <div className="font-display font-bold text-[#0B1220] text-sm md:text-[15px]">{page.title}</div>
      <div className="flex gap-1.5">
        {page.chips?.map((c, idx) => (
          <span key={idx} className={cn("hidden sm:inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-semibold", pillToneCls(c.tone))}>
            {c.text}
          </span>
        ))}
      </div>
      <div className="flex-1" />
      <span className="hidden lg:inline text-[10px] text-[#94A3B8]">Last scan: 2 min ago</span>
      {page.action && (
        <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#4F46E5] text-white text-[11px] font-semibold shadow-sm">
          {page.action}
        </span>
      )}
    </div>
  );
}

function ConsoleStage({ clip }: { clip: Clip }) {
  const Stage = STAGES[clip.key];
  // Drop-in real screen recording when videoSrc is provided
  if (clip.videoSrc) {
    return (
      <video
        src={clip.videoSrc}
        autoPlay
        muted
        loop
        playsInline
        className="w-full aspect-[16/10] object-cover bg-white"
      />
    );
  }
  return (
    <div className="flex aspect-[4/3] sm:aspect-[16/10] bg-white">
      <ConsoleSidebar active={clip.nav} />
      <div className="flex-1 min-w-0 flex flex-col bg-[#FBFCFE]">
        <ConsoleTopbar page={clip.page} />
        <div className="relative flex-1 min-h-0 overflow-hidden">
          <Stage duration={clip.duration} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------ timeline helpers ------------------------ */
// Returns t in [0,1) looping over `duration` seconds.
function useLoopTime(duration: number) {
  const [t, setT] = useState(0);
  const startRef = useRef<number | null>(null);
  useEffect(() => {
    let raf = 0;
    const tick = (now: number) => {
      if (startRef.current == null) startRef.current = now;
      const elapsed = (now - startRef.current) / 1000;
      const looped = (elapsed % (duration + 1.5)) / duration; // pause between loops
      setT(Math.min(looped, 1));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration]);
  return t;
}

const seg = (t: number, a: number, b: number) => Math.max(0, Math.min(1, (t - a) / (b - a)));
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);

/* ============================================================
   1. DASHBOARD — replica of the real overview screen
   ============================================================ */

const KPIS = [
  { label: "Risk Score", value: 68, suffix: "", color: "#DC7A00", sub: "▲ +4 this week", subColor: "#DC7A00" },
  { label: "Critical Findings", value: 12, suffix: "", color: "#E32D25", sub: "▲ 3 new today", subColor: "#E32D25" },
  { label: "Cloud Assets", value: 12481, suffix: "", color: "#0B1220", sub: "▲ 231 discovered", subColor: "#05A052" },
  { label: "Compliance Score", value: 74, suffix: "%", color: "#05A052", sub: "CIS · NIST · SOC 2", subColor: "#64748B" },
];

const ENGINES = ["IAM", "Network", "Compliance", "CDR", "Risk", "Encryption", "Container", "Data Sec", "Vuln"];

const SEVERITY_BARS = [
  { label: "Critical", n: "12", color: "#E32D25", w: 4 },
  { label: "High", n: "89", color: "#DC7A00", w: 12 },
  { label: "Medium", n: "234", color: "#B45309", w: 24 },
  { label: "Low", n: "512", color: "#2563EB", w: 52 },
  { label: "Info", n: "1,204", color: "#94A3B8", w: 100 },
];

const TOP_FINDINGS = [
  { title: "S3 bucket public read ACL", engine: "DataSec" },
  { title: "Root account has no MFA", engine: "IAM" },
  { title: "SG allows 0.0.0.0/0 on 22", engine: "Network" },
  { title: "IAM role wildcard admin", engine: "IAM" },
  { title: "EKS pod running as root", engine: "Container" },
];

const CLOUDS = [
  { name: "AWS", assets: "12,481 assets", letter: "A", color: "#DC7A00" },
  { name: "GCP", assets: "2,340 assets", letter: "G", color: "#2563EB" },
  { name: "Azure", assets: "1,892 assets", letter: "A", color: "#0EA5E9" },
];

function DashboardAnimation({ duration }: { duration: number }) {
  const t = useLoopTime(duration);
  const kpiT = easeOut(seg(t, 0, 0.25));
  const enginesOn = Math.round(seg(t, 0.18, 0.5) * ENGINES.length);
  const barT = seg(t, 0.35, 0.68);
  const findingsVisible = Math.round(seg(t, 0.5, 0.85) * TOP_FINDINGS.length);
  const cloudsVisible = Math.round(seg(t, 0.8, 0.98) * CLOUDS.length);

  return (
    <div className="absolute inset-0 p-3 md:p-4 flex flex-col gap-2.5">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {KPIS.map((k, idx) => (
          <div key={idx} className="rounded-xl bg-white border border-[#E9EDF3] px-3 py-2.5" style={{ borderLeft: `3px solid ${k.color}` }}>
            <div className="font-display font-black text-lg md:text-xl tabular-nums leading-none" style={{ color: k.color }}>
              {Math.round(k.value * kpiT).toLocaleString()}{k.suffix}
            </div>
            <div className="text-[9px] text-[#64748B] font-medium mt-1">{k.label}</div>
            <div className="text-[8px] font-semibold mt-0.5" style={{ color: k.subColor }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Middle grid */}
      <div className="flex-1 min-h-0 grid grid-cols-2 lg:grid-cols-[1fr_1fr_1.15fr] gap-2.5">
        {/* Engine status */}
        <div className="rounded-xl bg-white border border-[#E9EDF3] p-3 overflow-hidden">
          <div className="text-[10px] font-bold text-[#0B1220] mb-2">Engine Status</div>
          <div className="grid grid-cols-3 gap-1.5">
            {ENGINES.map((e, idx) => {
              const on = idx < enginesOn;
              return (
                <div key={e} className={cn("rounded-lg border px-1.5 py-1.5 text-center transition-colors", on ? "border-[#E9EDF3] bg-[#F8FAFC]" : "border-[#EEF2F6] bg-white opacity-60")}>
                  <span className={cn("inline-block w-1.5 h-1.5 rounded-full mb-0.5", on ? "bg-[#05A052]" : "bg-[#CBD5E1]")} />
                  <div className="text-[8.5px] font-semibold text-[#334155] leading-tight">{e}</div>
                  <div className="text-[7px] text-[#94A3B8]">{on ? "2m ago" : "…"}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Finding severity */}
        <div className="rounded-xl bg-white border border-[#E9EDF3] p-3 overflow-hidden">
          <div className="text-[10px] font-bold text-[#0B1220] mb-2">Finding Severity</div>
          <div className="flex flex-col gap-2">
            {SEVERITY_BARS.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between text-[9px] mb-0.5">
                  <span className="font-semibold" style={{ color: s.color }}>{s.label}</span>
                  <span className="tabular-nums text-[#334155] font-semibold">{s.n}</span>
                </div>
                <div className="h-[5px] rounded-full bg-[#EEF2F6] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.w * barT}%`, background: s.color, transition: "width .1s linear" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top critical findings */}
        <div className="rounded-xl bg-white border border-[#E9EDF3] p-3 overflow-hidden col-span-2 lg:col-span-1">
          <div className="text-[10px] font-bold text-[#0B1220] mb-1.5">Top Critical Findings</div>
          <div>
            {TOP_FINDINGS.slice(0, findingsVisible).map((f, idx) => (
              <div key={idx} className="flex items-center gap-2 py-[5px] border-b border-[#F1F5F9] last:border-b-0 animate-[fade-in_.3s_ease-out_both]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E32D25] shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-medium text-[#0B1220] truncate leading-tight">{f.title}</div>
                  <div className="text-[8px] text-[#94A3B8]">{f.engine}</div>
                </div>
              </div>
            ))}
            {findingsVisible === 0 && (
              <div className="py-4 text-center text-[9px] text-[#94A3B8]">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2563EB] mr-1.5 animate-pulse" />
                Correlating findings…
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Connected clouds */}
      <div className="grid grid-cols-3 gap-2.5">
        {CLOUDS.map((c, idx) => {
          const on = idx < cloudsVisible;
          return (
            <div key={c.name} className={cn("rounded-xl bg-white border border-[#E9EDF3] px-3 py-2 flex items-center gap-2 transition-opacity", on ? "opacity-100" : "opacity-40")}>
              <div className="w-6 h-6 rounded-lg grid place-items-center text-[10px] font-bold text-white shrink-0" style={{ background: c.color }}>
                {c.letter}
              </div>
              <div className="min-w-0 flex-1 hidden sm:block">
                <div className="text-[10px] font-bold text-[#0B1220] leading-tight">{c.name}</div>
                <div className="text-[8px] text-[#94A3B8]">{c.assets}</div>
              </div>
              {on && (
                <span className="text-[8px] font-bold text-[#05A052] bg-[#E7F6EF] border border-[#BFE8D2] rounded-full px-1.5 py-0.5 animate-[fade-in_.3s_ease-out_both]">
                  Connected
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   2. SECURITY SCAN — replica of the real Alerts screen
   ============================================================ */

const SEV_CHIP: Record<string, { color: string; bg: string; border: string }> = {
  CRITICAL: { color: "#B41F1A", bg: "#FCEAEA", border: "#F4C1BF" },
  HIGH: { color: "#B45309", bg: "#FEF3E4", border: "#F6DCB8" },
  MEDIUM: { color: "#A16207", bg: "#FEF9E7", border: "#F1E4A8" },
};

const ALERT_ROWS = [
  { sev: "CRITICAL", title: "S3 bucket public read ACL enabled", res: "acme-prod-data", engine: "Data Security", age: "2h", status: "Open" },
  { sev: "CRITICAL", title: "Root account has no MFA device", res: "root@acme-corp", engine: "IAM Security", age: "14d", status: "Open" },
  { sev: "CRITICAL", title: "Security group allows 0.0.0.0/0:22", res: "sg-0ab1cd234ef", engine: "Network Security", age: "3d", status: "Open" },
  { sev: "HIGH", title: "IAM role with wildcard admin (*:*)", res: "OpsAdminRole", engine: "IAM Security", age: "7d", status: "Open" },
  { sev: "HIGH", title: "EKS pod running as root UID 0", res: "pod/api-server-7d4f", engine: "Container Security", age: "1d", status: "Open" },
  { sev: "HIGH", title: "KMS key rotation disabled", res: "key/prod-rds-2024", engine: "Encryption", age: "21d", status: "Open" },
  { sev: "MEDIUM", title: "EC2 instance metadata IMDSv1 enabled", res: "i-0abc1234def5678", engine: "Network Security", age: "5d", status: "Suppressed" },
];

function ScanAnimation({ duration }: { duration: number }) {
  const t = useLoopTime(duration);
  // resource counter eases to 12,481 by t=0.5
  const resCount = Math.round(12481 * easeOut(seg(t, 0, 0.5)));
  const rowsVisible = Math.round(seg(t, 0.45, 0.92) * ALERT_ROWS.length);
  const total = Math.round(1051 * seg(t, 0.45, 0.92));

  return (
    <div className="absolute inset-0 p-3 md:p-4 flex flex-col gap-2.5">
      {/* Filter pills + live counter */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#0B1220] text-white text-[9px] font-bold tabular-nums">
          All {total.toLocaleString()}
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full border text-[9px] font-semibold tabular-nums" style={{ background: "#FCEAEA", color: "#B41F1A", borderColor: "#F4C1BF" }}>
          Critical {Math.min(12, Math.round(seg(t, 0.45, 0.7) * 12))}
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full border text-[9px] font-semibold tabular-nums" style={{ background: "#FEF3E4", color: "#B45309", borderColor: "#F6DCB8" }}>
          High {Math.min(89, Math.round(seg(t, 0.45, 0.8) * 89))}
        </span>
        <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full border border-[#E2E8F0] bg-white text-[#475569] text-[9px] font-semibold">Open</span>
        <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full border border-[#E2E8F0] bg-white text-[#475569] text-[9px] font-semibold">Suppressed</span>
        <div className="flex-1" />
        <span className="text-[9px] text-[#64748B] tabular-nums">
          Scanning <span className="font-semibold text-[#0B1220]">{resCount.toLocaleString()}</span> / 12,481 resources
        </span>
      </div>

      {/* progress bar */}
      <div className="h-1.5 rounded-full bg-[#EEF2F6] overflow-hidden shrink-0">
        <div
          className="h-full bg-gradient-to-r from-[#2563EB] to-[#05A052]"
          style={{ width: `${Math.min(t / 0.92, 1) * 100}%`, transition: "width .1s linear" }}
        />
      </div>

      {/* Alerts table */}
      <div className="flex-1 min-h-0 rounded-xl border border-[#E9EDF3] bg-white overflow-hidden flex flex-col">
        <div className="grid grid-cols-[74px_1fr_auto] md:grid-cols-[80px_1.6fr_1fr_110px_44px_72px] items-center gap-2 px-3 py-1.5 bg-[#F8FAFC] border-b border-[#E9EDF3] text-[8px] font-bold uppercase tracking-wider text-[#94A3B8]">
          <span>Severity</span><span>Finding</span><span className="hidden md:block">Resource</span><span className="hidden md:block">Engine</span><span className="hidden md:block">Age</span><span className="text-right md:text-left">Status</span>
        </div>
        <div className="flex-1 overflow-hidden">
          {ALERT_ROWS.slice(0, rowsVisible).map((r, idx) => {
            const s = SEV_CHIP[r.sev];
            return (
              <div key={idx} className="grid grid-cols-[74px_1fr_auto] md:grid-cols-[80px_1.6fr_1fr_110px_44px_72px] items-center gap-2 px-3 py-[7px] border-b border-[#F1F5F9] last:border-b-0 animate-[fade-in_.3s_ease-out_both]">
                <span className="inline-flex w-fit items-center px-1.5 py-0.5 rounded text-[8px] font-bold border" style={{ background: s.bg, color: s.color, borderColor: s.border }}>
                  {r.sev}
                </span>
                <span className="text-[10px] font-medium text-[#0B1220] truncate">{r.title}</span>
                <span className="hidden md:block text-[9px] font-mono text-[#64748B] truncate">{r.res}</span>
                <span className="hidden md:inline-flex w-fit items-center px-1.5 py-0.5 rounded-full text-[8px] font-semibold bg-[#F3E8FF] text-[#7C3AED] border border-[#E4D0FB] truncate">
                  {r.engine}
                </span>
                <span className="hidden md:block text-[9px] text-[#94A3B8] tabular-nums">{r.age}</span>
                <span className={cn(
                  "inline-flex w-fit justify-self-end md:justify-self-start items-center px-1.5 py-0.5 rounded-full text-[8px] font-semibold border",
                  r.status === "Open" ? "bg-[#FCEAEA] text-[#B41F1A] border-[#F4C1BF]" : "bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]",
                )}>
                  {r.status}
                </span>
              </div>
            );
          })}
          {rowsVisible === 0 && (
            <div className="px-4 py-8 text-center text-[10px] text-[#94A3B8]">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2563EB] mr-2 animate-pulse" />
              Analyzing resources across us-east-1, us-west-2, eu-west-1, ap-south-1…
            </div>
          )}
        </div>
        {rowsVisible >= ALERT_ROWS.length && (
          <div className="px-3 py-1.5 border-t border-[#E9EDF3] bg-[#F8FAFC] text-[8px] text-[#94A3B8] flex justify-between animate-[fade-in_.3s_ease-out_both]">
            <span>Showing 1–7 of 1,051 findings</span>
            <span className="font-semibold text-[#4F46E5]">1 · 2 · 3 · … · 105</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   3. CONNECT CLOUD — onboarding stepper + console
   ============================================================ */

const STEPS = [
  { title: "Create read-only IAM role", desc: "CloudFormation stack: OnamReadOnly", code: "aws cloudformation create-stack --stack-name onam --template-url ..." },
  { title: "Paste Role ARN", desc: "Copied from stack outputs", code: "arn:aws:iam::****4821:role/OnamReadOnly" },
  { title: "Validated — scanning…", desc: "sts:AssumeRole succeeded across 4 regions", code: "✓ 12,481 resources discovered • scan in progress" },
] as const;

function OnboardAnimation({ duration }: { duration: number }) {
  const t = useLoopTime(duration);
  const activeStep = t < 0.32 ? 0 : t < 0.66 ? 1 : 2;
  const phaseT = activeStep === 0 ? t / 0.32 : activeStep === 1 ? (t - 0.32) / 0.34 : (t - 0.66) / 0.34;

  return (
    <div className="absolute inset-0 p-3 md:p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="font-display font-black text-[#0B1220] text-lg md:text-xl">AWS · Production</div>
        <div className="inline-flex items-center gap-2 text-[10px] text-[#64748B]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
          Read-only • No agents
        </div>
      </div>

      {/* Stepper */}
      <div className="grid grid-cols-3 gap-2.5">
        {STEPS.map((s, idx) => {
          const done = idx < activeStep;
          const active = idx === activeStep;
          return (
            <div
              key={idx}
              className={cn(
                "rounded-xl border p-3 transition-all",
                done ? "border-[#BFE8D2] bg-[#F1FAF4]"
                  : active ? "border-[#4F46E5] bg-[#F5F6FF] shadow-[0_4px_16px_rgba(79,70,229,.14)]"
                  : "border-[#E9EDF3] bg-[#F8FAFC] opacity-70",
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                    done ? "bg-[#05A052] text-white"
                      : active ? "bg-[#4F46E5] text-white"
                      : "bg-white border border-[#CBD5E1] text-[#64748B]",
                  )}
                >
                  {done ? "✓" : idx + 1}
                </div>
                <div className={cn("text-[11px] font-semibold leading-tight", done || active ? "text-[#0B1220]" : "text-[#64748B]")}>
                  {s.title}
                </div>
              </div>
              <div className="mt-1.5 text-[9px] text-[#64748B] leading-relaxed hidden sm:block">{s.desc}</div>
              {active && (
                <div className="mt-2 h-1 rounded-full bg-white overflow-hidden border border-[#DDDEFB]">
                  <div
                    className="h-full bg-[#4F46E5]"
                    style={{ width: `${Math.min(phaseT, 1) * 100}%`, transition: "width .1s linear" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Terminal */}
      <div className="flex-1 min-h-0 rounded-xl bg-[#0B1220] text-[#E2E8F0] font-mono text-[10px] md:text-[11px] p-3.5 overflow-hidden">
        <div className="flex items-center gap-1.5 mb-2 opacity-70">
          <span className="w-2 h-2 rounded-full bg-[#FF5F57]" />
          <span className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
          <span className="w-2 h-2 rounded-full bg-[#28C840]" />
          <span className="ml-2 text-[9px] uppercase tracking-widest">onam · console</span>
        </div>
        {STEPS.slice(0, activeStep + 1).map((s, idx) => (
          <div key={idx} className="flex gap-2 animate-[fade-in_.3s_ease-out_both]">
            <span className="text-[#05A052]">$</span>
            <span className={cn("truncate", idx === activeStep && "text-white")}>{s.code}</span>
          </div>
        ))}
        {activeStep === 2 && phaseT > 0.5 && (
          <div className="mt-1 text-[#05A052] animate-[fade-in_.3s_ease-out_both]">
            → Account arn:aws:iam::****4821 connected. First scan started.
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   4. ATTACK PATH — replica of Attack Path Analysis
   ============================================================ */

const PATHS = [
  { title: "Path to Crown Jewel S3", sub: "EC2 → IMDSv1 → IAM PassRole → S3", sev: "Critical", hops: "4 hops", mitre: "T1552.005" },
  { title: "Admin Escalation via Lambda", sub: "Lambda → env vars → RoleChain → DynamoDB", sev: "High", hops: "3 hops", mitre: "T1552.005" },
  { title: "SG to RDS via Bastion", sub: "Public SG → Bastion EC2 → RDS Master", sev: "High", hops: "3 hops", mitre: "T1552.005" },
];

type PathNode = { x: number; label: string; name: string; sub: string; color: string; mitre: string; crown?: boolean };

const PATH_NODES: PathNode[] = [
  { x: 90, label: "EC2", name: "i-0abc1234", sub: "IMDSv1 enabled", color: "#DC7A00", mitre: "T1552.005 — Credential API" },
  { x: 330, label: "IAM ROLE", name: "OpsAdminRole", sub: "iam:PassRole: *", color: "#7C3AED", mitre: "T1078.004 — Cloud Accounts" },
  { x: 570, label: "S3 · CROWN JEWEL", name: "acme-prod-data", sub: "847K PII · PUBLIC READ", color: "#E32D25", mitre: "T1530 — Data from Cloud Storage", crown: true },
];

const PATH_EDGES = [
  { label: "IMDSv1" },
  { label: "PassRole · GetObject" },
];

function AttackPathAnimation({ duration }: { duration: number }) {
  const t = useLoopTime(duration);
  const pathsVisible = Math.round(seg(t, 0, 0.18) * PATHS.length);
  const nodesVisible = Math.round(seg(t, 0.18, 0.45) * PATH_NODES.length);
  const edgeProgress = seg(t, 0.45, 0.7) * PATH_EDGES.length; // 0..2
  const chipsVisible = Math.round(seg(t, 0.62, 0.78) * PATH_NODES.length);
  const detailOn = t > 0.8;
  const crownPulse = t > 0.72;

  const NODE_W = 150;
  const NODE_H = 54;
  const CY = 84;

  return (
    <div className="absolute inset-0 flex">
      {/* Paths list */}
      <div className="hidden lg:flex flex-col w-[218px] shrink-0 border-r border-[#E9EDF3] bg-white">
        <div className="px-3 py-2 text-[8px] font-bold uppercase tracking-wider text-[#94A3B8] border-b border-[#F1F5F9]">
          3 Attack Paths
        </div>
        {PATHS.slice(0, pathsVisible).map((p, idx) => (
          <div key={idx} className={cn("px-3 py-2.5 border-b border-[#F1F5F9] animate-[fade-in_.3s_ease-out_both]", idx === 0 && "bg-[#F5F6FF] border-l-2 border-l-[#4F46E5]")}>
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-bold text-[#0B1220] truncate">{p.title}</span>
              <span className={cn(
                "shrink-0 px-1.5 py-0.5 rounded text-[7.5px] font-bold border",
                p.sev === "Critical" ? "bg-[#FCEAEA] text-[#B41F1A] border-[#F4C1BF]" : "bg-[#FEF3E4] text-[#B45309] border-[#F6DCB8]",
              )}>
                {p.sev}
              </span>
            </div>
            <div className="text-[8px] text-[#64748B] truncate mt-0.5">{p.sub}</div>
            <div className="flex gap-1 mt-1">
              <span className="px-1.5 py-0.5 rounded border border-[#E2E8F0] bg-white text-[7.5px] font-semibold text-[#475569]">{p.hops}</span>
              <span className="px-1.5 py-0.5 rounded border border-[#E4D0FB] bg-[#F3E8FF] text-[7.5px] font-semibold text-[#7C3AED]">{p.mitre}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Graph canvas */}
      <div className="relative flex-1 min-w-0 overflow-hidden">
        {/* dot backdrop */}
        <svg className="absolute inset-0 w-full h-full opacity-[.35]" aria-hidden>
          <defs>
            <pattern id="dpg2" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="#CBD5E1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dpg2)" />
        </svg>

        <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
          <div className="text-[9px] font-semibold uppercase tracking-widest text-[#64748B]">
            Internet → Crown jewel · 4 hops
          </div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FCEAEA] border border-[#F4C1BF] text-[9px] font-semibold text-[#B41F1A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E32D25] animate-pulse" />
            Reachable
          </div>
        </div>

        <svg viewBox="0 0 720 200" className="absolute inset-x-0 top-8 w-full" preserveAspectRatio="xMidYMin meet">
          {/* Edges */}
          {PATH_EDGES.map((e, idx) => {
            const revealed = idx + 1 <= Math.floor(edgeProgress);
            const drawing = idx === Math.floor(edgeProgress);
            const p = revealed ? 1 : drawing ? edgeProgress - idx : 0;
            if (p <= 0) return null;
            const from = PATH_NODES[idx];
            const to = PATH_NODES[idx + 1];
            const x1 = from.x + NODE_W;
            const x2v = x1 + (to.x - x1) * p;
            const midX = (x1 + to.x) / 2;
            return (
              <g key={idx}>
                <line x1={x1} y1={CY} x2={x2v} y2={CY} stroke="#E32D25" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" opacity={p} />
                {p >= 0.95 && (
                  <g className="animate-[fade-in_.3s_ease-out_both]">
                    <polygon points={`${to.x - 2},${CY} ${to.x - 9},${CY - 4} ${to.x - 9},${CY + 4}`} fill="#E32D25" />
                    <rect x={midX - 44} y={CY - 22} width="88" height="15" rx="7.5" fill="white" stroke="#F4C1BF" />
                    <text x={midX} y={CY - 11} textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#B41F1A" fontFamily="Inter, sans-serif">
                      {e.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Nodes as product-style cards */}
          {PATH_NODES.slice(0, nodesVisible).map((n, idx) => (
            <g key={idx} className="animate-[fade-in_.35s_ease-out_both]">
              {n.crown && crownPulse && (
                <rect x={n.x - 6} y={CY - NODE_H / 2 - 6} width={NODE_W + 12} height={NODE_H + 12} rx="14" fill="none" stroke="#E32D25" strokeWidth="1.5" opacity="0.5">
                  <animate attributeName="opacity" values="0.5;0.1;0.5" dur="1.6s" repeatCount="indefinite" />
                </rect>
              )}
              <rect x={n.x} y={CY - NODE_H / 2} width={NODE_W} height={NODE_H} rx="10" fill="white" stroke={n.color} strokeWidth="1.75" />
              <text x={n.x + NODE_W / 2} y={CY - 9} textAnchor="middle" fontSize="7.5" fontWeight="700" fill={n.color} fontFamily="Inter, sans-serif" letterSpacing="0.06em">
                {n.label}
              </text>
              <text x={n.x + NODE_W / 2} y={CY + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="#0B1220" fontFamily="Inter, sans-serif">
                {n.name}
              </text>
              <text x={n.x + NODE_W / 2} y={CY + 17} textAnchor="middle" fontSize="7.5" fill={n.crown ? "#B41F1A" : "#64748B"} fontWeight={n.crown ? 700 : 400} fontFamily="Inter, sans-serif">
                {n.sub}
              </text>
              {/* severity underline */}
              <rect x={n.x + 10} y={CY + NODE_H / 2 - 6} width={NODE_W - 20} height="3" rx="1.5" fill={n.color} opacity="0.35" />
            </g>
          ))}

          {/* MITRE chips under nodes */}
          {PATH_NODES.slice(0, chipsVisible).map((n, idx) => (
            <g key={`m${idx}`} className="animate-[fade-in_.3s_ease-out_both]">
              <rect x={n.x + NODE_W / 2 - 62} y={CY + 42} width="124" height="16" rx="8" fill={n.crown ? "#FCEAEA" : "#F3E8FF"} stroke={n.crown ? "#F4C1BF" : "#E4D0FB"} />
              <text x={n.x + NODE_W / 2} y={CY + 53} textAnchor="middle" fontSize="7.5" fontWeight="600" fill={n.crown ? "#B41F1A" : "#7C3AED"} fontFamily="Inter, sans-serif">
                {n.mitre}
              </text>
            </g>
          ))}
        </svg>

        {/* Path detail card (like the real product) */}
        <div
          className={cn(
            "absolute bottom-3 right-3 w-[240px] rounded-xl bg-white border border-[#E9EDF3] shadow-[0_10px_30px_rgba(16,24,40,.12)] p-3 transition-all duration-500",
            detailOn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none",
          )}
        >
          <div className="text-[10px] font-bold text-[#0B1220] pb-1.5 border-b border-[#F1F5F9]">Path Detail: EC2 → S3</div>
          {[
            ["MITRE ATT&CK", "T1552.005 · Credentials from APIs"],
            ["Hops", "4 (EC2 → IMDSv1 → IAM → S3)"],
            ["Crown Jewel Risk", "847K PII records at risk"],
            ["Fix Priority", "P0 — Disable IMDSv1"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-2 py-[3px] text-[8.5px] border-b border-[#F8FAFC] last:border-b-0">
              <span className="text-[#94A3B8] shrink-0">{k}</span>
              <span className={cn("font-semibold text-right", k === "Fix Priority" ? "text-[#B41F1A]" : "text-[#0B1220]")}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   5. COMPLIANCE — replica of the frameworks screen
   ============================================================ */

const FRAMEWORKS = [
  { name: "CIS AWS Foundations", pct: 78, sub: "312 passing · 89 failing", color: "#05A052" },
  { name: "NIST CSF 2.0", pct: 82, sub: "428 passing · 92 failing", color: "#05A052" },
  { name: "SOC 2 Type II", pct: 71, sub: "186 passing · 74 failing", color: "#D9A406" },
  { name: "PCI-DSS v4.0", pct: 65, sub: "143 passing · 78 failing", color: "#E32D25" },
  { name: "HIPAA Security", pct: 68, sub: "197 passing · 92 failing", color: "#DC7A00" },
  { name: "ISO 27001:2022", pct: 74, sub: "211 passing · 74 failing", color: "#D9A406" },
];

const CONTROL_ROWS = [
  { id: "CIS 2.1.1", desc: "S3 bucket block public access enabled", fw: "CIS AWS", res: "acme-prod-data", pass: false },
  { id: "NIST AC-2", desc: "Account management — MFA for all users", fw: "NIST CSF", res: "IAM/root", pass: false },
  { id: "SOC2 CC6.1", desc: "Encryption at rest for all data stores", fw: "SOC 2", res: "rds-main", pass: true },
  { id: "HIPAA 164.312", desc: "Audit controls — CloudTrail all regions", fw: "HIPAA", res: "CloudTrail", pass: false },
  { id: "ISO A.12.4", desc: "Monitoring — VPC Flow Logs enabled", fw: "ISO 27001", res: "vpc-prod-01", pass: true },
];

function ComplianceAnimation({ duration }: { duration: number }) {
  const t = useLoopTime(duration);
  const cardsVisible = Math.round(seg(t, 0, 0.4) * FRAMEWORKS.length);
  const pctT = easeOut(seg(t, 0.05, 0.55));
  const rowsVisible = Math.round(seg(t, 0.55, 0.95) * CONTROL_ROWS.length);

  return (
    <div className="absolute inset-0 p-3 md:p-4 flex flex-col gap-2.5">
      {/* Framework score cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
        {FRAMEWORKS.map((f, idx) => {
          const on = idx < cardsVisible;
          const pct = Math.round(f.pct * (on ? pctT : 0));
          return (
            <div key={f.name} className={cn("rounded-xl bg-white border border-[#E9EDF3] px-3 py-2.5 transition-opacity", on ? "opacity-100" : "opacity-35")}>
              <div className="flex items-baseline justify-between gap-2">
                <div className="text-[10px] font-bold text-[#0B1220] truncate">{f.name}</div>
                <div className="font-display font-black text-base md:text-lg tabular-nums" style={{ color: f.color }}>{pct}%</div>
              </div>
              <div className="mt-1.5 h-[5px] rounded-full bg-[#EEF2F6] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: f.color, transition: "width .1s linear" }} />
              </div>
              <div className="mt-1 text-[8px] text-[#94A3B8]">{f.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Controls table */}
      <div className="flex-1 min-h-0 rounded-xl border border-[#E9EDF3] bg-white overflow-hidden flex flex-col">
        <div className="grid grid-cols-[86px_1fr_54px] md:grid-cols-[96px_1.7fr_86px_110px_54px] items-center gap-2 px-3 py-1.5 bg-[#F8FAFC] border-b border-[#E9EDF3] text-[8px] font-bold uppercase tracking-wider text-[#94A3B8]">
          <span>Control</span><span>Description</span><span className="hidden md:block">Framework</span><span className="hidden md:block">Resource</span><span className="text-right">Status</span>
        </div>
        <div className="flex-1 overflow-hidden">
          {CONTROL_ROWS.slice(0, rowsVisible).map((r, idx) => (
            <div key={idx} className="grid grid-cols-[86px_1fr_54px] md:grid-cols-[96px_1.7fr_86px_110px_54px] items-center gap-2 px-3 py-[7px] border-b border-[#F1F5F9] last:border-b-0 animate-[fade-in_.3s_ease-out_both]">
              <span className="text-[9px] font-mono font-semibold text-[#4F46E5] truncate">{r.id}</span>
              <span className="text-[10px] text-[#0B1220] font-medium truncate">{r.desc}</span>
              <span className="hidden md:inline-flex w-fit items-center px-1.5 py-0.5 rounded-full text-[8px] font-semibold bg-[#F3E8FF] text-[#7C3AED] border border-[#E4D0FB]">{r.fw}</span>
              <span className="hidden md:block text-[9px] font-mono text-[#64748B] truncate">{r.res}</span>
              <span className={cn(
                "inline-flex w-fit justify-self-end items-center px-2 py-0.5 rounded text-[8px] font-bold border",
                r.pass ? "bg-[#E7F6EF] text-[#05A052] border-[#BFE8D2]" : "bg-[#FCEAEA] text-[#B41F1A] border-[#F4C1BF]",
              )}>
                {r.pass ? "PASS" : "FAIL"}
              </span>
            </div>
          ))}
          {rowsVisible === 0 && (
            <div className="px-4 py-6 text-center text-[9px] text-[#94A3B8]">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2563EB] mr-1.5 animate-pulse" />
              Evaluating 1,483 controls across 6 frameworks…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Generic KPI + table screen — the real product's layout for
   Assets, CIEM, CWPP, CDR, Network and Data Security views.
   ============================================================ */

type Cell =
  | { t: string; kind?: "text" | "bold" | "mono" }
  | { t: string; kind: "chip"; tone: PillTone }
  | { t: string; kind: "score"; color: string };

type KpiScreenConfig = {
  kpis: { value: string; label: string; color: string }[];
  columns: string[];
  /** CSS grid template for md+; first two columns always visible on mobile. */
  grid: string;
  rows: Cell[][];
  footer?: string;
};

function CellView({ c }: { c: Cell }) {
  if (c.kind === "chip") {
    return (
      <span className={cn("inline-flex w-fit items-center px-1.5 py-0.5 rounded-full text-[8px] font-semibold border truncate", pillToneCls(c.tone))}>
        {c.t}
      </span>
    );
  }
  if (c.kind === "score") {
    return (
      <span className="flex items-center gap-1.5">
        <span className="h-[4px] w-7 rounded-full bg-[#EEF2F6] overflow-hidden shrink-0">
          <span className="block h-full rounded-full" style={{ width: `${Math.min(100, Number(c.t))}%`, background: c.color }} />
        </span>
        <span className="text-[9px] font-bold tabular-nums" style={{ color: c.color }}>{c.t}</span>
      </span>
    );
  }
  if (c.kind === "mono") return <span className="text-[9px] font-mono text-[#64748B] truncate">{c.t}</span>;
  if (c.kind === "bold") return <span className="text-[10px] font-semibold text-[#0B1220] truncate">{c.t}</span>;
  return <span className="text-[9.5px] text-[#334155] truncate">{c.t}</span>;
}

function KpiScreen({ config, duration }: { config: KpiScreenConfig; duration: number }) {
  const t = useLoopTime(duration);
  const kpisVisible = Math.round(seg(t, 0, 0.22) * config.kpis.length);
  const rowsVisible = Math.round(seg(t, 0.25, 0.9) * config.rows.length);

  return (
    <div className="absolute inset-0 p-3 md:p-4 flex flex-col gap-2.5">
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {config.kpis.map((k, idx) => (
          <div
            key={idx}
            className={cn("rounded-xl bg-white border border-[#E9EDF3] px-3 py-2.5 transition-all duration-300", idx < kpisVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1")}
            style={{ borderLeft: `3px solid ${k.color}` }}
          >
            <div className="font-display font-black text-lg md:text-xl tabular-nums leading-none" style={{ color: k.color }}>
              {k.value}
            </div>
            <div className="text-[9px] text-[#64748B] font-medium mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 rounded-xl border border-[#E9EDF3] bg-white overflow-hidden flex flex-col">
        <div
          className="hidden md:grid items-center gap-2 px-3 py-1.5 bg-[#F8FAFC] border-b border-[#E9EDF3] text-[8px] font-bold uppercase tracking-wider text-[#94A3B8]"
          style={{ gridTemplateColumns: config.grid }}
        >
          {config.columns.map((c) => <span key={c}>{c}</span>)}
        </div>
        <div className="flex-1 overflow-hidden">
          {config.rows.slice(0, rowsVisible).map((row, idx) => (
            <div key={idx}>
              {/* md+: full row */}
              <div
                className="hidden md:grid items-center gap-2 px-3 py-[7px] border-b border-[#F1F5F9] animate-[fade-in_.3s_ease-out_both]"
                style={{ gridTemplateColumns: config.grid }}
              >
                {row.map((c, ci) => <CellView key={ci} c={c} />)}
              </div>
              {/* mobile: first two cells + last */}
              <div className="grid md:hidden grid-cols-[1fr_auto] items-center gap-2 px-3 py-[7px] border-b border-[#F1F5F9] animate-[fade-in_.3s_ease-out_both]">
                <CellView c={row[0]} />
                <CellView c={row[row.length - 1]} />
              </div>
            </div>
          ))}
          {rowsVisible === 0 && (
            <div className="px-4 py-8 text-center text-[9px] text-[#94A3B8]">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2563EB] mr-1.5 animate-pulse" />
              Loading live data…
            </div>
          )}
        </div>
        {config.footer && rowsVisible >= config.rows.length && (
          <div className="px-3 py-1.5 border-t border-[#E9EDF3] bg-[#F8FAFC] text-[8px] text-[#94A3B8] animate-[fade-in_.3s_ease-out_both]">
            {config.footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---- Assets — inventory across clouds ---- */
const ASSETS_CONFIG: KpiScreenConfig = {
  kpis: [
    { value: "12,481", label: "Total Assets", color: "#4F46E5" },
    { value: "3", label: "Clouds Connected", color: "#0B1220" },
    { value: "231", label: "New (7 days)", color: "#05A052" },
    { value: "3", label: "Crown Jewels", color: "#E32D25" },
  ],
  columns: ["Resource", "Type", "Cloud · Region", "Account", "Findings", "Risk"],
  grid: "1.25fr 92px 1fr 92px 62px 66px",
  rows: [
    [{ t: "acme-prod-data", kind: "bold" }, { t: "S3 Bucket", kind: "chip", tone: "gray" }, { t: "AWS · us-east-1", kind: "mono" }, { t: "prod-main", kind: "mono" }, { t: "4" }, { t: "Critical", kind: "chip", tone: "red" }],
    [{ t: "i-0abc1234 (bastion)", kind: "bold" }, { t: "EC2", kind: "chip", tone: "gray" }, { t: "AWS · us-east-1", kind: "mono" }, { t: "prod-main", kind: "mono" }, { t: "3" }, { t: "Critical", kind: "chip", tone: "red" }],
    [{ t: "OpsAdminRole", kind: "bold" }, { t: "IAM Role", kind: "chip", tone: "gray" }, { t: "AWS · global", kind: "mono" }, { t: "prod-main", kind: "mono" }, { t: "2" }, { t: "High", kind: "chip", tone: "amber" }],
    [{ t: "rds-main-postgres", kind: "bold" }, { t: "RDS", kind: "chip", tone: "gray" }, { t: "AWS · us-east-1", kind: "mono" }, { t: "prod-main", kind: "mono" }, { t: "2" }, { t: "High", kind: "chip", tone: "amber" }],
    [{ t: "prod-eks-01", kind: "bold" }, { t: "EKS Cluster", kind: "chip", tone: "gray" }, { t: "AWS · us-west-2", kind: "mono" }, { t: "prod-main", kind: "mono" }, { t: "5" }, { t: "High", kind: "chip", tone: "amber" }],
    [{ t: "vpc-prod-01", kind: "bold" }, { t: "VPC", kind: "chip", tone: "gray" }, { t: "AWS · us-east-1", kind: "mono" }, { t: "prod-main", kind: "mono" }, { t: "1" }, { t: "Medium", kind: "chip", tone: "amber" }],
    [{ t: "gke-analytics-prod", kind: "bold" }, { t: "GKE Cluster", kind: "chip", tone: "gray" }, { t: "GCP · us-central1", kind: "mono" }, { t: "gcp-prod", kind: "mono" }, { t: "1" }, { t: "Medium", kind: "chip", tone: "amber" }],
    [{ t: "az-sql-billing", kind: "bold" }, { t: "Azure SQL", kind: "chip", tone: "gray" }, { t: "Azure · eastus", kind: "mono" }, { t: "az-prod", kind: "mono" }, { t: "0" }, { t: "Low", kind: "chip", tone: "green" }],
  ],
  footer: "Showing 1–8 of 12,481 assets · AWS 12,481 · GCP 2,340 · Azure 1,892",
};

/* ---- CIEM / IAM Security — identities ranked by risk ---- */
const CIEM_CONFIG: KpiScreenConfig = {
  kpis: [
    { value: "189", label: "Total Identities", color: "#4F46E5" },
    { value: "47", label: "Overprivileged", color: "#DC7A00" },
    { value: "3", label: "No MFA (Admin)", color: "#E32D25" },
    { value: "8", label: "Wildcard Policies", color: "#B45309" },
  ],
  columns: ["Identity", "Type", "Risk Score", "Issues", "MFA", "Status"],
  grid: "1.05fr 92px 96px 1.35fr 66px 66px",
  rows: [
    [{ t: "root", kind: "mono" }, { t: "Root Account", kind: "chip", tone: "gray" }, { t: "95", kind: "score", color: "#E32D25" }, { t: "No MFA · No hardware key" }, { t: "None", kind: "chip", tone: "red" }, { t: "Critical", kind: "chip", tone: "red" }],
    [{ t: "OpsAdminRole", kind: "mono" }, { t: "IAM Role", kind: "chip", tone: "gray" }, { t: "88", kind: "score", color: "#E32D25" }, { t: "Wildcard admin (iam:*)" }, { t: "N/A", kind: "chip", tone: "gray" }, { t: "High", kind: "chip", tone: "amber" }],
    [{ t: "ci-deploy-key", kind: "mono" }, { t: "Access Key", kind: "chip", tone: "gray" }, { t: "81", kind: "score", color: "#E32D25" }, { t: "Key age 420 days · No rotation" }, { t: "N/A", kind: "chip", tone: "gray" }, { t: "High", kind: "chip", tone: "amber" }],
    [{ t: "john.doe@acme.com", kind: "mono" }, { t: "IAM User", kind: "chip", tone: "gray" }, { t: "74", kind: "score", color: "#DC7A00" }, { t: "No MFA · Unused 90d" }, { t: "None", kind: "chip", tone: "red" }, { t: "High", kind: "chip", tone: "amber" }],
    [{ t: "DeployPipelineRole", kind: "mono" }, { t: "IAM Role", kind: "chip", tone: "gray" }, { t: "62", kind: "score", color: "#DC7A00" }, { t: "iam:PassRole:* scope" }, { t: "N/A", kind: "chip", tone: "gray" }, { t: "Medium", kind: "chip", tone: "amber" }],
    [{ t: "jane.smith@acme.com", kind: "mono" }, { t: "IAM User", kind: "chip", tone: "gray" }, { t: "45", kind: "score", color: "#D9A406" }, { t: "Console + programmatic" }, { t: "Enabled", kind: "chip", tone: "green" }, { t: "Low", kind: "chip", tone: "green" }],
    [{ t: "BackupLambdaRole", kind: "mono" }, { t: "IAM Role", kind: "chip", tone: "gray" }, { t: "38", kind: "score", color: "#05A052" }, { t: "s3:* on *" }, { t: "N/A", kind: "chip", tone: "gray" }, { t: "Medium", kind: "chip", tone: "amber" }],
    [{ t: "ReadOnlyAdmin", kind: "mono" }, { t: "IAM Role", kind: "chip", tone: "gray" }, { t: "22", kind: "score", color: "#05A052" }, { t: "Policy not in use 180d" }, { t: "N/A", kind: "chip", tone: "gray" }, { t: "Low", kind: "chip", tone: "green" }],
  ],
  footer: "189 identities analysed · effective permissions computed across 4 accounts",
};

/* ---- CWPP / Container Security — CVEs ranked by CVSS × EPSS ---- */
const CWPP_CONFIG: KpiScreenConfig = {
  kpis: [
    { value: "3", label: "EKS Clusters", color: "#4F46E5" },
    { value: "24", label: "Nodes", color: "#0B1220" },
    { value: "3", label: "Critical CVEs", color: "#E32D25" },
    { value: "12", label: "RBAC Violations", color: "#DC7A00" },
  ],
  columns: ["CVE ID", "CVSS", "EPSS", "Package", "Image · Cluster", "Status"],
  grid: "108px 52px 52px 1fr 1.1fr 108px",
  rows: [
    [{ t: "CVE-2024-3094", kind: "mono" }, { t: "10.0", kind: "chip", tone: "red" }, { t: "0.998", kind: "bold" }, { t: "liblzma 5.6.0" }, { t: "sidecar:latest · dev-eks-02", kind: "mono" }, { t: "EXPLOIT KNOWN", kind: "chip", tone: "red" }],
    [{ t: "CVE-2024-21626", kind: "mono" }, { t: "9.8", kind: "chip", tone: "red" }, { t: "0.972", kind: "bold" }, { t: "runc 1.1.5" }, { t: "nginx:1.24 · prod-eks-01", kind: "mono" }, { t: "EXPLOIT KNOWN", kind: "chip", tone: "red" }],
    [{ t: "CVE-2023-44487", kind: "mono" }, { t: "7.5", kind: "chip", tone: "amber" }, { t: "0.841", kind: "bold" }, { t: "golang.org/x/net" }, { t: "api-server:v2.1 · prod-eks-01", kind: "mono" }, { t: "KEV Listed", kind: "chip", tone: "red" }],
    [{ t: "CVE-2023-47108", kind: "mono" }, { t: "7.5", kind: "chip", tone: "amber" }, { t: "0.342" }, { t: "go.opentelemetry.io" }, { t: "telemetry:v1.2 · prod-eks-01", kind: "mono" }, { t: "Patch available", kind: "chip", tone: "amber" }],
    [{ t: "CVE-2024-29018", kind: "mono" }, { t: "7.4", kind: "chip", tone: "amber" }, { t: "0.089" }, { t: "docker/compose" }, { t: "tooling:v1.1 · staging-eks-03", kind: "mono" }, { t: "Patch available", kind: "chip", tone: "amber" }],
    [{ t: "CVE-2023-45857", kind: "mono" }, { t: "6.5", kind: "chip", tone: "amber" }, { t: "0.127" }, { t: "axios 1.4.0" }, { t: "frontend:v3.8 · dev-eks-02", kind: "mono" }, { t: "Patch available", kind: "chip", tone: "amber" }],
    [{ t: "CVE-2024-24786", kind: "mono" }, { t: "5.9", kind: "chip", tone: "amber" }, { t: "0.062" }, { t: "google.golang.org/protobuf" }, { t: "grpc-proxy:v1.0 · staging-eks-03", kind: "mono" }, { t: "Under review", kind: "chip", tone: "gray" }],
  ],
  footer: "SBOM generated for 148 images · runtime context applied to prioritisation",
};

/* ---- CDR — live detection stream ---- */
const CDR_CONFIG: KpiScreenConfig = {
  kpis: [
    { value: "2.3M", label: "Events / Hour", color: "#4F46E5" },
    { value: "4", label: "Active Alerts", color: "#E32D25" },
    { value: "847", label: "CloudTrail Events", color: "#0B1220" },
    { value: "12", label: "Blocked IPs", color: "#DC7A00" },
  ],
  columns: ["Time", "Alert", "MITRE Technique", "Resource", "Severity", "Status"],
  grid: "50px 1.5fr 132px 1fr 66px 92px",
  rows: [
    [{ t: "2m" }, { t: "Unusual API call pattern — GetSecretValue spike", kind: "bold" }, { t: "T1552.005 Credential API", kind: "chip", tone: "blue" }, { t: "secretsmanager:prod/*", kind: "mono" }, { t: "Critical", kind: "chip", tone: "red" }, { t: "Investigating", kind: "chip", tone: "red" }],
    [{ t: "7m" }, { t: "Root account console login from unknown IP", kind: "bold" }, { t: "T1078.004 Cloud Accounts", kind: "chip", tone: "blue" }, { t: "AWS Console / root", kind: "mono" }, { t: "Critical", kind: "chip", tone: "red" }, { t: "Alerting", kind: "chip", tone: "amber" }],
    [{ t: "14m" }, { t: "IAM role assumed from unusual region (ap-east-1)", kind: "bold" }, { t: "T1078.004 Cloud Accounts", kind: "chip", tone: "blue" }, { t: "OpsAdminRole", kind: "mono" }, { t: "High", kind: "chip", tone: "amber" }, { t: "Alerting", kind: "chip", tone: "amber" }],
    [{ t: "23m" }, { t: "S3 large data exfiltration — 4.7 GB GetObject", kind: "bold" }, { t: "T1530 Data from Cloud", kind: "chip", tone: "blue" }, { t: "acme-prod-data", kind: "mono" }, { t: "Critical", kind: "chip", tone: "red" }, { t: "Contained", kind: "chip", tone: "amber" }],
    [{ t: "45m" }, { t: "CloudTrail logging stopped in us-west-2", kind: "bold" }, { t: "T1562.008 Impair Logging", kind: "chip", tone: "blue" }, { t: "CloudTrail/main", kind: "mono" }, { t: "High", kind: "chip", tone: "amber" }, { t: "Resolved", kind: "chip", tone: "green" }],
    [{ t: "1h" }, { t: "EC2 metadata service abuse — multiple tokens", kind: "bold" }, { t: "T1552.005 Credential API", kind: "chip", tone: "blue" }, { t: "i-0abc1234def", kind: "mono" }, { t: "Medium", kind: "chip", tone: "amber" }, { t: "Resolved", kind: "chip", tone: "green" }],
    [{ t: "2h" }, { t: "Lambda exec unusual high CPU — crypto-mining sig", kind: "bold" }, { t: "T1496 Resource Hijacking", kind: "chip", tone: "blue" }, { t: "fn-acme-processor", kind: "mono" }, { t: "High", kind: "chip", tone: "amber" }, { t: "Resolved", kind: "chip", tone: "green" }],
  ],
  footer: "Streaming · 2.3M events/hour correlated across CloudTrail, VPC Flow Logs and EKS audit",
};

/* ---- Network Security — internet exposure ---- */
const NETWORK_CONFIG: KpiScreenConfig = {
  kpis: [
    { value: "5", label: "VPCs", color: "#4F46E5" },
    { value: "47", label: "Security Groups", color: "#0B1220" },
    { value: "7", label: "Internet-Exposed", color: "#E32D25" },
    { value: "23", label: "Open Ports", color: "#DC7A00" },
  ],
  columns: ["Resource", "VPC", "Ports Exposed", "Exposure", "Risk", "Action"],
  grid: "1.15fr 92px 108px 92px 62px 1.05fr",
  rows: [
    [{ t: "i-0abc1234 (Bastion)", kind: "bold" }, { t: "vpc-prod-01", kind: "mono" }, { t: "22 (SSH)", kind: "chip", tone: "red" }, { t: "0.0.0.0/0", kind: "mono" }, { t: "Critical", kind: "chip", tone: "red" }, { t: "Restrict to VPN CIDR" }],
    [{ t: "rds-main-postgres", kind: "bold" }, { t: "vpc-prod-01", kind: "mono" }, { t: "5432 (PG)", kind: "chip", tone: "red" }, { t: "0.0.0.0/0", kind: "mono" }, { t: "Critical", kind: "chip", tone: "red" }, { t: "Move to private subnet" }],
    [{ t: "i-0def5678 (Jump)", kind: "bold" }, { t: "vpc-dev-02", kind: "mono" }, { t: "22, 3389", kind: "chip", tone: "amber" }, { t: "0.0.0.0/0", kind: "mono" }, { t: "High", kind: "chip", tone: "amber" }, { t: "Disable RDP (3389)" }],
    [{ t: "elb-api-prod", kind: "bold" }, { t: "vpc-prod-01", kind: "mono" }, { t: "80, 443", kind: "chip", tone: "gray" }, { t: "0.0.0.0/0", kind: "mono" }, { t: "Low", kind: "chip", tone: "green" }, { t: "HTTPS-only ✓" }],
    [{ t: "elasticache-redis", kind: "bold" }, { t: "vpc-prod-01", kind: "mono" }, { t: "6379", kind: "chip", tone: "gray" }, { t: "10.0.0.0/8", kind: "mono" }, { t: "Low", kind: "chip", tone: "green" }, { t: "Internal only ✓" }],
    [{ t: "ecs-fargate-api", kind: "bold" }, { t: "vpc-prod-01", kind: "mono" }, { t: "8080", kind: "chip", tone: "gray" }, { t: "vpc-internal", kind: "mono" }, { t: "Info", kind: "chip", tone: "gray" }, { t: "No external exposure" }],
    [{ t: "s3-endpoint", kind: "bold" }, { t: "vpc-prod-01", kind: "mono" }, { t: "443 (VPC)", kind: "chip", tone: "gray" }, { t: "VPC", kind: "mono" }, { t: "Low", kind: "chip", tone: "green" }, { t: "Gateway endpoint" }],
  ],
  footer: "Topology computed from security groups, NACLs, route tables and load balancers",
};

/* ---- Data Security / DSPM — classified data stores ---- */
const DATASEC_CONFIG: KpiScreenConfig = {
  kpis: [
    { value: "847K", label: "PII Records Found", color: "#E32D25" },
    { value: "3", label: "Public Buckets", color: "#E32D25" },
    { value: "12", label: "Unencrypted Stores", color: "#DC7A00" },
    { value: "5", label: "Cross-Region", color: "#D9A406" },
  ],
  columns: ["Resource", "Classification", "Records", "Encryption", "Access", "Risk"],
  grid: "1.1fr 1.2fr 78px 92px 96px 66px",
  rows: [
    [{ t: "acme-prod-data", kind: "mono" }, { t: "SSN · Credit Card · DOB", kind: "bold" }, { t: "847,234" }, { t: "AES-256", kind: "chip", tone: "green" }, { t: "PUBLIC READ", kind: "chip", tone: "red" }, { t: "Critical", kind: "chip", tone: "red" }],
    [{ t: "acme-user-exports", kind: "mono" }, { t: "PII · Email · Phone", kind: "bold" }, { t: "124,891" }, { t: "None", kind: "chip", tone: "red" }, { t: "Authenticated", kind: "chip", tone: "amber" }, { t: "Critical", kind: "chip", tone: "red" }],
    [{ t: "rds-main-postgres", kind: "mono" }, { t: "PII · Financial · PHI", kind: "bold" }, { t: "2,341,009" }, { t: "AES-256", kind: "chip", tone: "green" }, { t: "Private", kind: "chip", tone: "gray" }, { t: "High", kind: "chip", tone: "amber" }],
    [{ t: "dynamodb-sessions", kind: "mono" }, { t: "Session · Auth Tokens", kind: "bold" }, { t: "8,821" }, { t: "Encrypted", kind: "chip", tone: "green" }, { t: "Private", kind: "chip", tone: "gray" }, { t: "Medium", kind: "chip", tone: "amber" }],
    [{ t: "acme-logs-archive", kind: "mono" }, { t: "Log Data · IP Addresses", kind: "bold" }, { t: "44.2M" }, { t: "AES-256", kind: "chip", tone: "green" }, { t: "Private", kind: "chip", tone: "gray" }, { t: "Low", kind: "chip", tone: "green" }],
    [{ t: "elasticache-cache", kind: "mono" }, { t: "Cached PII (TTL 24h)", kind: "bold" }, { t: "~50K" }, { t: "In-transit only", kind: "chip", tone: "amber" }, { t: "Internal", kind: "chip", tone: "gray" }, { t: "Medium", kind: "chip", tone: "amber" }],
    [{ t: "acme-backup-vault", kind: "mono" }, { t: "Backup · Encrypted PII", kind: "bold" }, { t: "892,341" }, { t: "AES-256 KMS", kind: "chip", tone: "green" }, { t: "Private", kind: "chip", tone: "gray" }, { t: "Low", kind: "chip", tone: "green" }],
  ],
  footer: "Classification: 14 data types · sampled scan, no data leaves your account",
};

/* ============================================================
   RISK — FAIR model with $ exposure (replica of the real screen)
   ============================================================ */

const RISK_SCENARIOS = [
  { name: "Data Breach — S3 Crown Jewel", range: "$2.1M – $6.4M", pct: 82, color: "#E32D25" },
  { name: "IAM Compromise — Admin Escalation", range: "$800K – $3.2M", pct: 74, color: "#DC7A00" },
  { name: "Ransomware via Exposed RDP", range: "$1.2M – $4.8M", pct: 68, color: "#DC7A00" },
  { name: "Insider Threat — Data Exfil", range: "$400K – $1.9M", pct: 55, color: "#D9A406" },
  { name: "CloudTrail Disabled — Audit Gap", range: "$200K – $800K", pct: 42, color: "#D9A406" },
  { name: "Kubernetes Escape — RCE", range: "$600K – $2.3M", pct: 61, color: "#DC7A00" },
];

const CROWN_JEWELS = [
  { name: "acme-prod-data S3", sub: "847K PII records", exposure: "$4.2M exposure" },
  { name: "rds-main-postgres", sub: "Financial · PHI data", exposure: "$3.1M exposure" },
  { name: "OpsAdminRole IAM", sub: "Full AWS access", exposure: "$2.8M exposure" },
];

function RiskAnimation({ duration }: { duration: number }) {
  const t = useLoopTime(duration);
  const kpiT = easeOut(seg(t, 0, 0.22));
  const barT = seg(t, 0.2, 0.6);
  const scenariosVisible = Math.round(seg(t, 0.2, 0.55) * RISK_SCENARIOS.length);
  const jewelsVisible = Math.round(seg(t, 0.55, 0.8) * CROWN_JEWELS.length);
  const actionOn = t > 0.85;

  const kpis = [
    { value: `$${(5.1 * kpiT).toFixed(1)}M`, label: "Annual Loss Exp.", color: "#E32D25" },
    { value: `${Math.round(68 * kpiT)}`, label: "Risk Score", color: "#DC7A00" },
    { value: `${Math.round(3 * kpiT)}`, label: "Crown Jewels", color: "#4F46E5" },
    { value: "$2.4M–$8.7M", label: "95th pct ALE Range", color: "#0EA5E9" },
  ];

  return (
    <div className="absolute inset-0 p-3 md:p-4 flex flex-col gap-2.5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {kpis.map((k, idx) => (
          <div key={idx} className="rounded-xl bg-white border border-[#E9EDF3] px-3 py-2.5" style={{ borderLeft: `3px solid ${k.color}` }}>
            <div className="font-display font-black text-base md:text-lg tabular-nums leading-none" style={{ color: k.color }}>{k.value}</div>
            <div className="text-[9px] text-[#64748B] font-medium mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 min-h-0 grid lg:grid-cols-[1.5fr_1fr] gap-2.5">
        {/* Scenarios */}
        <div className="rounded-xl bg-white border border-[#E9EDF3] p-3 overflow-hidden">
          <div className="text-[10px] font-bold text-[#0B1220] mb-2">Top Risk Scenarios (FAIR)</div>
          <div className="flex flex-col gap-[7px]">
            {RISK_SCENARIOS.slice(0, scenariosVisible).map((s) => (
              <div key={s.name} className="animate-[fade-in_.3s_ease-out_both]">
                <div className="flex items-center justify-between gap-2 text-[9px]">
                  <span className="font-semibold text-[#0B1220] truncate">{s.name}</span>
                  <span className="font-bold tabular-nums shrink-0" style={{ color: s.color }}>{s.range}</span>
                </div>
                <div className="mt-1 h-[4px] rounded-full bg-[#EEF2F6] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.pct * barT}%`, background: s.color, transition: "width .1s linear" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crown jewels + action */}
        <div className="hidden lg:flex flex-col gap-2 overflow-hidden">
          <div className="rounded-xl bg-white border border-[#E9EDF3] p-3 flex-1">
            <div className="text-[10px] font-bold text-[#0B1220] mb-1.5">Crown Jewels</div>
            {CROWN_JEWELS.slice(0, jewelsVisible).map((j) => (
              <div key={j.name} className="rounded-lg border border-[#F1F5F9] bg-[#F8FAFC] px-2.5 py-1.5 mb-1.5 animate-[fade-in_.3s_ease-out_both]">
                <div className="text-[9.5px] font-bold text-[#0B1220]">{j.name}</div>
                <div className="text-[8px] text-[#64748B]">{j.sub}</div>
                <div className="text-[9px] font-bold text-[#E32D25] mt-0.5">{j.exposure}</div>
              </div>
            ))}
          </div>
          <div className={cn("rounded-xl border border-[#F4C1BF] bg-[#FCF5F5] px-3 py-2 transition-all duration-500", actionOn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")}>
            <div className="text-[9px] font-bold text-[#B41F1A]">Recommended Action</div>
            <div className="text-[8.5px] text-[#7F1D1D] leading-relaxed mt-0.5">
              Fix the 12 critical findings to reduce ALE by $3.2M (63%). Prioritise: S3 public access → IAM MFA → SG 0.0.0.0/0.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- stage registry ---- */
function AssetsAnimation({ duration }: { duration: number }) { return <KpiScreen config={ASSETS_CONFIG} duration={duration} />; }
function CiemAnimation({ duration }: { duration: number }) { return <KpiScreen config={CIEM_CONFIG} duration={duration} />; }
function CwppAnimation({ duration }: { duration: number }) { return <KpiScreen config={CWPP_CONFIG} duration={duration} />; }
function CdrAnimation({ duration }: { duration: number }) { return <KpiScreen config={CDR_CONFIG} duration={duration} />; }
function NetworkAnimation({ duration }: { duration: number }) { return <KpiScreen config={NETWORK_CONFIG} duration={duration} />; }
function DatasecAnimation({ duration }: { duration: number }) { return <KpiScreen config={DATASEC_CONFIG} duration={duration} />; }

const STAGES: Record<ClipKey, React.ComponentType<{ duration: number }>> = {
  dashboard: DashboardAnimation,
  scan: ScanAnimation,
  assets: AssetsAnimation,
  attack: AttackPathAnimation,
  ciem: CiemAnimation,
  cdr: CdrAnimation,
  cwpp: CwppAnimation,
  network: NetworkAnimation,
  datasec: DatasecAnimation,
  risk: RiskAnimation,
  compliance: ComplianceAnimation,
  onboard: OnboardAnimation,
};
