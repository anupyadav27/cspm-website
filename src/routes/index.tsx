import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Shield, Cloud, ArrowRight, Play, Check, X, CheckCircle2,
  Lock, Eye, Network, Database, Cpu, Boxes, Bug, Code2, Bot,
  ScrollText, DollarSign, Activity, Layers, GitBranch, Server, AlertTriangle,
  TrendingUp, Search, ShieldAlert, Users2, Fingerprint, FileCheck,
  LayoutDashboard, Plug, ListChecks, GitFork, KeyRound, Radio,
  ShieldCheck, ScanLine, HardDrive,
  ShieldHalf, Blocks, Webhook, Package, Sparkles, Wrench,
} from "lucide-react";
import { useState, type ReactNode, type ComponentType } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { RULE_CATALOG_TOTAL, CLOUDS, SERVICES, FRAMEWORKS, ENGINES, SAAS_PLATFORMS, fmt } from "@/lib/product-facts";
import { seo, SITE_URL } from "@/lib/seo";
import { SectionHeader } from "@/components/site/SectionHeader";
import { BrandButton } from "@/components/site/BrandButton";
import { DemoVideos } from "@/components/site/DemoVideos";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () =>
    seo({
      title: "Onam Security — Unified CNAPP: CSPM, CIEM, DSPM, CWPP & SSPM",
      description:
        "Unified CNAPP platform: CSPM, CIEM, DSPM, CWPP, SSPM, agentless workload scanning, attack paths, threat detection & compliance across AWS, Azure, GCP, OCI, Alibaba, IBM, Kubernetes and SaaS. 100% agentless.",
      path: "/",
    }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      <Hero />
      <OutcomeStrip />
      <CloudBar />
      <HowItWorks />
      <ProductDemo />
      <DemoVideos />
      <PlatformPillars />
      <Testimonials />
      <StatsSection />
      <ComplianceSection />
      <WhyNow />
      <Differentiator />
      <TrustBar />
      <FAQSection />
      <FinalCTA />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_JSONLD) }}
      />
    </SiteLayout>
  );
}

/* ============================ FAQ + STRUCTURED DATA ============================ */
const FAQ_ITEMS = [
  {
    q: "What is cloud security posture management (CSPM)?",
    a: "Cloud security posture management (CSPM) continuously checks your cloud accounts for misconfigurations — public storage buckets, open security groups, unencrypted databases, over-permissive IAM — and tells you exactly how to fix them. Onam runs 9,853 CSPM posture rules continuously across AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud, and Kubernetes, so misconfigurations surface the day they're introduced, not at the next audit.",
  },
  {
    q: "Which cloud providers does Onam Security support?",
    a: "Onam supports all 7 major clouds from a single console: AWS, Microsoft Azure, Google Cloud (GCP), Oracle Cloud (OCI), Alibaba Cloud, IBM Cloud, and Kubernetes — with the same rules, attack-path analysis, and compliance mapping on every one.",
  },
  {
    q: "How is Onam different from native cloud tools or single-layer CSPM products?",
    a: "Native cloud tools cover one cloud, and point products cover one security layer. Onam puts all 7 clouds and every security layer — posture, identity (CIEM), attack paths, threat detection, data, code, and compliance — on one graph. That's what enables cross-cloud attack-path analysis, automated toxic-combination detection, and FAIR-model dollar-risk prioritisation instead of an alert firehose.",
  },
  {
    q: "Is Onam agentless, and how long does deployment take?",
    a: "Yes — 100% agentless. You connect a cloud in under 3 minutes with a read-only IAM role, service principal, or service account. No agents, no code changes, and Onam stores only a role ARN — never long-lived credentials.",
  },
  {
    q: "Which compliance frameworks does Onam cover?",
    a: "78 frameworks with continuous evidence, including CIS (AWS, Azure, GCP), NIST 800-53, ISO 27001, PCI-DSS v4, HIPAA, and SOC 2. One finding maps to every framework it affects, and audit evidence exports in one click.",
  },
  {
    q: "Does Onam include CIEM, threat detection, and code security as well as CSPM?",
    a: "Yes. CSPM is one layer of the platform: 30-day behavioral CIEM for identity risk, cloud threat detection and response, vulnerability management, data security, and code-to-runtime coverage with SAST, DAST, SCA, and IaC scanning — all correlated on the same graph.",
  },
];

const HOME_JSONLD = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Onam Security Platform",
    applicationCategory: "SecurityApplication",
    applicationSubCategory: "Cloud Security Posture Management (CSPM)",
    operatingSystem: "Cloud (SaaS)",
    url: SITE_URL,
    description:
      "Unified cloud security platform: CSPM, CIEM, attack path analysis, threat detection, data security, and compliance across AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud, and Kubernetes. 100% agentless.",
    featureList: [
      "CSPM — 9,853 posture rules evaluated continuously",
      "CIEM — 30-day behavioral identity risk analysis",
      "Cross-cloud attack path analysis on one graph",
      "Toxic combination detection across every security layer",
      "Compliance — 78 frameworks with continuous evidence (CIS, NIST 800-53, ISO 27001, PCI-DSS v4, HIPAA, SOC 2)",
      "FAIR-model dollar-risk prioritisation",
      "Code + runtime coverage: SAST, DAST, SCA, IaC scanning",
      "Agentless read-only onboarding in under 3 minutes",
    ],
    publisher: { "@type": "Organization", name: "Onam Security", url: SITE_URL },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
];

function FAQSection() {
  return (
    <section className="py-24 border-b border-[#E5E9F0] bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-6">
        <SectionHeader eyebrow="FAQ" title="Frequently asked questions"
                       subtitle="CSPM, cloud coverage, deployment, and how Onam compares — answered straight."
                       gradientWords="questions" />
        <div className="mt-12 space-y-3">
          {FAQ_ITEMS.map((f) => (
            <details key={f.q} className="group bg-white rounded-2xl border border-[#E5E9F0] shadow-[0_1px_2px_rgba(16,24,40,.04)] open:shadow-[0_4px_12px_rgba(16,24,40,.06)]">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-5 text-[15px] font-semibold text-[#0B1220] [&::-webkit-details-marker]:hidden">
                {f.q}
                <ArrowRight className="w-4 h-4 shrink-0 text-[#64748B] transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-5 text-sm leading-relaxed text-[#475569]">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ HERO ============================
 * Dark, and the visual is a priced attack path.
 *
 * The previous hero was the default SaaS template — white page, copy left,
 * generic findings card right — which is the same hero Wiz, Orca and Prisma
 * all run. Looking like the category is the opposite of looking like the
 * leader of it.
 *
 * Two deliberate choices:
 *
 * 1. DARK. It separates the page from the field on sight, and it is what a
 *    security buyer's own tools look like. Every colour below was checked
 *    against #0B1220 for WCAG AA — the palette here is the brand's dark theme
 *    (blue_lt #4D8DFF at 5.86:1, sub_dk #9FB0CC at 8.52:1), not new invention.
 *
 * 2. THE PATH, PRICED. The old card showed 12 critical / 84 high / 319 medium —
 *    a severity count every competitor also shows. The differentiator is
 *    "one graph": the route to a crown jewel, the single choke point that cuts
 *    it, and the dollar figure. That is what the product actually does that the
 *    others do not, so that is what the hero shows.
 *
 * The figures are from the demo tenant and are LABELLED as illustrative, per
 * the marketing guardrail that demo numbers are never presented as outcomes.
 */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0B1220]">
      {/* Depth without noise: two wide, low-opacity washes rather than a pattern. */}
      <div className="pointer-events-none absolute -top-52 -right-40 w-[820px] h-[620px] rounded-full bg-[#2563EB]/20 blur-[160px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 w-[560px] h-[460px] rounded-full bg-[#4D8DFF]/10 blur-[150px]" />

      {/* Tighter than it was (pt-20/24, pb-20, gap-14). The hero used most of a
          1440x900 viewport to say one sentence, which pushes every piece of
          proof below the fold — the opposite of what an enterprise evaluator
          scanning three vendors wants. Density is the cheapest signal of
          seriousness there is. */}
      <div className="relative max-w-7xl mx-auto px-6 pt-14 md:pt-16 pb-14 grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-12 items-center">
        <div className="animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider bg-white/[0.06] border border-white/10 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
            <span className="text-[#9FB0CC] uppercase">Cloud Security Platform</span>
          </div>

          {/* text-balance so the browser evens the line lengths. Without it the
              hard break left "secure," alone on its own line — a two-word orphan
              under the biggest type on the site. */}
          <h1 className="mt-6 font-display font-black text-white text-5xl md:text-6xl lg:text-[64px] tracking-tight leading-[1.02] text-balance">
            Is your cloud secure, or does it just{" "}
            <span className="text-[#4D8DFF]">feel that way?</span>
          </h1>

          <p className="mt-6 text-lg text-[#9FB0CC] leading-relaxed max-w-xl">
            Most teams discover cloud attacks from a breach notification — or a compliance audit.
            Onam maps every misconfiguration, identity risk, and attack path across all {CLOUDS} clouds
            into one graph — then prices the route an attacker would actually take.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <BrandButton to="/request-demo" size="lg">Scan my cloud <ArrowRight className="w-4 h-4" /></BrandButton>
            <a
              href="/resources/scenarios"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-base font-semibold text-white border border-white/20 hover:bg-white/[0.06] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4D8DFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]"
            >
              <Play className="w-4 h-4" /> See how it works
            </a>
          </div>

          {/* No stat row here on purpose. There was a row of four pills, and the
              OutcomeStrip directly below is a full-width row of four figures —
              two stat rows stacked, which halves the weight of both. Worse, they
              disagreed: the pills said one thing about service coverage and the
              strip below said "200+". The numbers now live in one place. */}
        </div>

        <HeroMock />
      </div>
    </section>
  );
}

function HeroMock() {
  // The attack path, priced — not a severity count.
  //
  // This used to be a dashboard card: 12 critical / 84 high / 319 medium, a
  // posture score and three findings. Every competitor's hero shows that, and
  // it says nothing a buyer cannot get from any scanner.
  //
  // What Onam does that they do not is join the hops into one graph, find the
  // single choke point that breaks the chain, and put a number on the exposure.
  // So the hero shows a real path: public compute -> stealable credential ->
  // over-permissioned role -> the data. One node marked as the cut.
  //
  // min-w-0: a grid item will not shrink below its min-content, and without it
  // this widens the single mobile column and the headline beside it gets
  // clipped by the section's overflow-hidden.
  const hops = [
    { k: "EC2 instance", v: "i-0abc1234def", note: "IMDSv1 enabled", tag: "T1552.005", tone: "risk" },
    { k: "IAM role", v: "OpsAdminRole", note: "iam:PassRole:*", tag: "T1078.004", tone: "risk" },
    { k: "S3 bucket", v: "acme-prod-data", note: "847K PII records", tag: "T1530", tone: "crown" },
  ];
  return (
    <div className="relative animate-fade-in min-w-0">
      <div className="absolute -inset-6 bg-gradient-to-br from-[#4D8DFF]/15 via-transparent to-transparent blur-2xl -z-10 rounded-3xl" />

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 shadow-[0_24px_64px_rgba(0,0,0,.45)]">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 min-w-0">
            <Shield className="w-4 h-4 shrink-0 text-[#4D8DFF]" />
            <span className="text-sm font-semibold text-white truncate">Attack path to crown jewel</span>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FF6B63]/15 text-[#FF6B63]">
            Critical
          </span>
        </div>

        {/* The chain. Each hop is a step an attacker takes; the arrow between
            them is the edge the graph resolved. */}
        <div className="mt-5 space-y-2">
          {hops.map((h, i) => (
            <div key={h.k}>
              <div
                className={cn(
                  "rounded-xl border px-3.5 py-3 flex items-center justify-between gap-3",
                  h.tone === "crown"
                    ? "border-[#FF6B63]/40 bg-[#FF6B63]/[0.08]"
                    : "border-white/10 bg-white/[0.03]"
                )}
              >
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-[#7C8CA8]">{h.k}</div>
                  <div className="text-sm font-semibold text-white truncate">{h.v}</div>
                  <div className="text-[11px] text-[#9FB0CC] truncate">{h.note}</div>
                </div>
                <span className="shrink-0 text-[10px] font-mono text-[#9FB0CC] border border-white/10 rounded px-1.5 py-0.5">
                  {h.tag}
                </span>
              </div>
              {i < hops.length - 1 && (
                <div className="flex items-center gap-2 pl-4 py-1.5">
                  <span className="w-px h-4 bg-white/15" />
                  <span className="text-[11px] text-[#7C8CA8]">reachable</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* The payoff: the cut, and the number. */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-[#7C8CA8]">Estimated exposure</div>
            <div className="font-display font-black text-3xl text-white tracking-tight">$2.1M–$6.4M</div>
          </div>
          <div className="text-right min-w-0">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#34D399]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
              1 choke point cuts all 3 paths
            </div>
            <div className="text-[11px] text-[#7C8CA8] mt-1">Disable IMDSv1</div>
          </div>
        </div>
      </div>

      {/* Required by the marketing guardrails: demo-tenant numbers are
          illustrations and are never presented as customer outcomes. */}
      <p className="mt-3 text-[11px] text-[#7C8CA8] text-center">
        Illustrative — demo tenant. FAIR-based range, not a customer result.
      </p>
    </div>
  );
}

/* ============================ OUTCOME STRIP ============================ */
function OutcomeStrip() {
  // Every figure here now traces to marketing/facts/product.yaml.
  //
  // Two were removed rather than restyled: "1,240 avg findings per first scan"
  // and "< 5 min time to first critical". Neither appears in product.yaml or
  // the claims library, and both are customer-facing performance numbers — the
  // exact shape of claim the marketing guardrails say does not ship unsourced.
  // If they can be derived and cleared, add them there and they belong back
  // here; inventing a source for them here would defeat the gate.
  //
  // "200+ cloud services covered" was also wrong in the unhelpful direction:
  // the cleared figure is 549, so the site was understating its own coverage
  // by more than half on the most prominent number strip it has.
  const items = [
    { value: fmt(RULE_CATALOG_TOTAL), label: "security rules" },
    { value: fmt(SERVICES), label: "cloud services covered" },
    { value: String(CLOUDS), label: "clouds, one graph" },
    { value: "100%", label: "agentless — no deployment" },
  ];
  return (
    <section className="bg-[#F8FAFC] border-y border-[#E5E9F0]">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#E5E9F0]">
        {items.map((i, idx) => (
          <div key={i.label} className={cn("px-6", idx === 0 && "pl-0", idx === items.length - 1 && "pr-0")}>
            <div className="font-display font-black text-3xl md:text-4xl text-[#0B1220]">{i.value}</div>
            <div className="text-xs md:text-sm text-[#64748B] mt-1">{i.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================ CLOUD BAR ============================ */
function CloudBar() {
  const clouds = [
    { name: "AWS", color: "#FF9900" },
    { name: "Microsoft Azure", color: "#0078D4" },
    { name: "Google Cloud", color: "#4285F4" },
    { name: "Oracle Cloud", color: "#F80000" },
    { name: "Alibaba Cloud", color: "#FF6A00" },
    { name: "IBM Cloud", color: "#054ADA" },
    { name: "Kubernetes", color: "#326CE5" },
  ];
  return (
    <section className="py-16 border-b border-[#E5E9F0] bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="text-xs uppercase tracking-widest text-[#64748B] font-semibold">
          Works across every cloud you run
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {clouds.map((c) => (
            <div key={c.name}
              className="group bg-white border border-[#E5E9F0] rounded-xl px-5 py-3 flex items-center gap-2 hover:border-[#CBD5E1] hover:shadow-[0_6px_16px_rgba(16,24,40,.08)] transition"
            >
              <Cloud className="w-4 h-4 text-[#94A3B8] group-hover:text-[color:var(--c)] transition"
                     style={{ ["--c" as string]: c.color } as React.CSSProperties} />
              <span className="text-sm font-semibold text-[#334155] group-hover:text-[#0B1220]">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ HOW IT WORKS ============================ */
function HowItWorks() {
  const steps = [
    { icon: Lock, title: "Connect your cloud — takes 3 minutes",
      body: "Give Onam read-only access via an IAM role, service principal, or service account. No agents, no code changes. Stores only a role ARN — no long-lived credentials, ever." },
    { icon: Search, title: "We scan everything — including what you forgot about",
      body: `Enumerates every resource across ${fmt(SERVICES)} cloud services, checks each against ${fmt(RULE_CATALOG_TOTAL)} rules across every security layer.` },
    { icon: FileCheck, title: "You get a prioritised list, not a wall of alerts",
      body: "Critical findings first. Each finding says what it is, why it matters, which compliance frameworks it affects, and the exact remediation (CLI command, Terraform snippet, or console walkthrough)." },
  ];
  return (
    <section className="bg-[#F7F9FC] py-24 border-b border-[#E5E9F0]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          eyebrow="How it works"
          title="How does Onam work?"
          subtitle="Simple enough to explain in 3 steps. Deep enough to find what others miss."
        />
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.title}
                className="relative rounded-2xl bg-white border border-[#E5E9F0] p-8 shadow-[0_1px_2px_rgba(16,24,40,.04),0_1px_3px_rgba(16,24,40,.06)] hover:shadow-[0_12px_28px_rgba(16,24,40,.10)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#EFF4FF] grid place-items-center text-[#2563EB]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="font-display font-black text-4xl text-[#E2E8F0] leading-none">0{i + 1}</div>
                </div>
                <h3 className="mt-5 font-display font-bold text-xl text-[#0B1220] tracking-tight">{s.title}</h3>
                <p className="mt-3 text-[#475569] leading-relaxed text-sm">{s.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================ PRODUCT DEMO (11 tabs) ============================ */

type Sev = "critical" | "high" | "medium" | "info" | "success";

/**
 * `color` is the SIGNAL — dots, bars, icons, anything read as shape rather than
 * language. `text` is the same severity darkened until it is legible as 10px
 * type on `tint`.
 *
 * They are separate because they are solving different problems, and using one
 * for both failed WCAG AA on three of the five: critical 3.93:1, high 1.78:1,
 * success 3.06:1, against the 4.5:1 small-text minimum. Amber on amber was the
 * worst and the most used. Severity chips appear in tables, panels and finding
 * lists across the site, so this was not a homepage detail.
 *
 * If you add a severity, check the pair — `text` must clear 4.5:1 on `tint`.
 */
const sevStyle: Record<Sev, { color: string; text: string; tint: string; label: string }> = {
  critical: { color: "#E32D25", text: "#A81E18", tint: "#FDECEA", label: "CRITICAL" },  // 6.41:1
  high:     { color: "#F2AF04", text: "#8A5A00", tint: "#FEF6E0", label: "HIGH" },      // 5.50:1
  medium:   { color: "#2563EB", text: "#1D4ED8", tint: "#EFF4FF", label: "MEDIUM" },    // 6.08:1
  info:     { color: "#334155", text: "#334155", tint: "#F1F5F9", label: "INFO" },      // 9.45:1
  success:  { color: "#05A052", text: "#046C37", tint: "#E7F6EF", label: "OK" },        // 5.87:1
};

function SevChip({ sev, children }: { sev: Sev; children?: ReactNode }) {
  const s = sevStyle[sev];
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
      style={{ color: s.text, backgroundColor: s.tint }}
    >
      {children ?? s.label}
    </span>
  );
}

type Tab = {
  key: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  caption: string;
  badge: { sev: Sev; text: string };
  view: () => ReactNode;
};

function ProductDemo() {
  const tabs: Tab[] = [
    {
      key: "overview", label: "Overview", icon: LayoutDashboard,
      caption: "Single pane of glass — risk score, engine status, compliance posture and top criticals at a glance.",
      badge: { sev: "high", text: "Risk score 68" },
      view: ViewOverview,
    },
    {
      key: "onboarding", label: "Onboarding", icon: Plug,
      caption: "Connect any cloud in under 3 minutes. Read-only IAM role, no agents, no long-lived credentials.",
      badge: { sev: "success", text: "AWS connected" },
      view: ViewOnboarding,
    },
    {
      key: "findings", label: "Findings", icon: ListChecks,
      caption: "847 prioritised findings — sorted by real risk, not noise. One click to remediation.",
      badge: { sev: "critical", text: "12 critical" },
      view: ViewFindings,
    },
    {
      key: "attack-path", label: "Attack Path", icon: GitFork,
      caption: "Follow every privilege escalation chain. Click any node to see the MITRE ATT&CK technique and fix.",
      badge: { sev: "critical", text: "3 paths to crown jewels" },
      view: ViewAttackPath,
    },
    {
      key: "iam", label: "IAM", icon: KeyRound,
      caption: "189 identities scanned — 47 overprivileged, 3 admin wildcards, root MFA missing.",
      badge: { sev: "high", text: "47 overprivileged" },
      view: ViewIAM,
    },
    {
      key: "network", label: "Network", icon: Network,
      caption: "VPC topology map, security group violations, internet-exposed resources — all from one agentless scan.",
      badge: { sev: "critical", text: "7 internet-exposed" },
      view: ViewNetwork,
    },
    {
      key: "detection", label: "Detection", icon: Radio,
      caption: "2.3M CloudTrail + VPC Flow events processed. MITRE ATT&CK mapped alerts, streamed in real time.",
      badge: { sev: "critical", text: "4 critical · live" },
      view: ViewDetection,
    },
    {
      key: "container", label: "Container", icon: Boxes,
      caption: "EKS CVE findings with EPSS scores, K8s RBAC violations, runtime security events — all in one view.",
      badge: { sev: "critical", text: "3 CVEs with active exploits" },
      view: ViewContainer,
    },
    {
      key: "compliance", label: "Compliance", icon: ShieldCheck,
      caption: "CIS · NIST · SOC 2 · HIPAA · PCI-DSS · ISO 27001 — scored live. One finding maps to 6 frameworks.",
      badge: { sev: "medium", text: "6 frameworks" },
      view: ViewCompliance,
    },
    {
      key: "data", label: "Data Security", icon: HardDrive,
      caption: "847K PII records classified across S3. Public buckets with SSN and credit card data surfaced immediately.",
      badge: { sev: "critical", text: "3 public buckets with PII" },
      view: ViewData,
    },
    {
      key: "risk", label: "Risk & FAIR", icon: DollarSign,
      caption: "Dollar-denominated annual loss expectancy from the FAIR model. Fix the $2.4M exposure first.",
      badge: { sev: "medium", text: "$2.4M–$8.7M ALE" },
      view: ViewRisk,
    },
  ];

  const [i, setI] = useState(0);
  const t = tabs[i];
  const Icon = t.icon;

  return (
    <section className="relative py-24 border-b border-[#E5E9F0] bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          eyebrow="See the platform"
          title="One console. Every cloud. Every risk."
          subtitle="Eleven views into the same graph — from onboarding to attack paths, findings, compliance and dollar-value risk."
          gradientWords="Every risk."
        />

        {/* min-w-0 on the panel, for the same reason as HeroMock: a grid item will
            not shrink below its min-content, and the console mock inside is far
            wider than a phone. Without it this whole section rendered ~984px past
            the viewport with no way to scroll to it — the product tour was, in
            effect, desktop-only. */}
        <div className="mt-10 grid lg:grid-cols-[240px_1fr] gap-6">
          {/* Tab rail */}
          <div className="min-w-0 rounded-2xl border border-[#E5E9F0] bg-white p-2 shadow-[0_1px_2px_rgba(16,24,40,.04)]">
            <div className="text-[10px] uppercase tracking-widest text-[#64748B] font-bold px-3 pt-2 pb-1">
              Product tour
            </div>
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-1 p-1">
              {tabs.map((tab, idx) => {
                const T = tab.icon;
                const active = idx === i;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setI(idx)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition whitespace-nowrap lg:whitespace-normal shrink-0 lg:shrink",
                      active
                        ? "bg-[#EFF4FF] text-[#1D4ED8]"
                        : "text-[#334155] hover:bg-[#F5F8FF]",
                    )}
                  >
                    <T className={cn("w-4 h-4", active ? "text-[#2563EB]" : "text-[#94A3B8]")} />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Frame */}
          <div className="min-w-0 rounded-2xl border border-[#E5E9F0] bg-white shadow-[0_18px_48px_rgba(16,24,40,.10)] overflow-hidden">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#F8FAFC] border-b border-[#E5E9F0]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E32D25]/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F2AF04]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#05A052]/80" />
              <div className="mx-auto flex items-center gap-1.5 text-xs text-[#64748B] font-mono">
                <Lock className="w-3 h-3" />
                app.onam.cloud / {t.key}
              </div>
            </div>

            {/* App top bar */}
            {/* The header shrinks rather than scrolling. min-w-0 at every level is
                what lets `truncate` actually engage — a flex item defaults to
                min-width:auto and will push its container wider instead of
                letting the text ellipsis. shrink-0 keeps the icon and the
                severity chip at their natural size while the caption gives way. */}
            <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-[#E5E9F0] bg-white">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 shrink-0 rounded-lg bg-[#EFF4FF] grid place-items-center">
                  <Icon className="w-4 h-4 text-[#2563EB]" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[#0B1220]">{t.label}</div>
                  <div className="text-[11px] text-[#64748B] max-w-md truncate">{t.caption}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="hidden md:flex items-center gap-1.5 text-xs text-[#64748B] px-2.5 py-1 rounded-md border border-[#E5E9F0] bg-white">
                  <Search className="w-3 h-3" /> Search resources
                </div>
                <SevChip sev={t.badge.sev}>{t.badge.text}</SevChip>
              </div>
            </div>

            {/* View
                overflow-x-auto so the console mock stays REACHABLE on a phone.
                min-w-0 above lets the panel shrink to the column; without a
                scroller here that would merely swap unreachable-overflow for
                unreachable-clipping, since the panel clips to its radius. The
                inner min-w is what gives the mock room to keep its desktop
                layout instead of collapsing into an unreadable stack. */}
            <div className="p-6 bg-[#FAFBFD] min-h-[520px] overflow-x-auto">
              <div className="min-w-[680px] lg:min-w-0">{t.view()}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Demo view helpers ---------------- */

function Panel({ title, right, children, className }: { title?: string; right?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn("bg-white border border-[#E5E9F0] rounded-xl shadow-[0_1px_2px_rgba(16,24,40,.04)]", className)}>
      {(title || right) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E9F0]">
          {title && <div className="text-sm font-semibold text-[#0B1220]">{title}</div>}
          {right}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

function StatTile({ label, value, sev, hint }: { label: string; value: string; sev: Sev; hint?: string }) {
  const s = sevStyle[sev];
  return (
    <div className="rounded-xl border border-[#E5E9F0] bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-widest text-[#64748B] font-semibold">{label}</div>
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
      </div>
      <div className="mt-2 text-3xl font-display font-black" style={{ color: s.color }}>{value}</div>
      {hint && <div className="mt-1 text-[11px] text-[#64748B]">{hint}</div>}
    </div>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-[100px_1fr_auto] items-center gap-3 py-2.5 border-b border-[#E5E9F0] last:border-0 text-sm">{children}</div>;
}

/* --------- 1. Overview --------- */
function ViewOverview() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <StatTile label="Critical" value="12" sev="critical" hint="↑ 2 since yesterday" />
      <StatTile label="High" value="84" sev="high" hint="↓ 6 since yesterday" />
      <StatTile label="Medium" value="319" sev="medium" hint="stable" />

      <div className="md:col-span-2">
        <Panel title="Posture score — 30 days" right={<span className="text-xs text-[#05A052] font-semibold">+6.2</span>}>
          <div className="flex items-end gap-2 h-40">
            {[42, 48, 45, 52, 55, 58, 54, 62, 60, 65, 68, 72].map((h, i) => (
              <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: "linear-gradient(to top, #2563EB, #93C5FD)" }} />
            ))}
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-[11px] text-[#64748B]">Trailing 30d</div>
            <div><span className="text-3xl font-display font-black text-[#0B1220]">72</span><span className="text-[#64748B] text-sm font-semibold">/100</span></div>
          </div>
        </Panel>
      </div>

      <Panel title="Engine status">
        <div className="space-y-2 text-sm">
          {[
            { n: "CSPM", ok: true },
            { n: "CIEM", ok: true },
            { n: "Attack Path", ok: true },
            { n: "Threat Detection", ok: true },
            { n: "Data Security", ok: true },
            { n: "Code Security", ok: false },
          ].map((e) => (
            <div key={e.n} className="flex items-center justify-between">
              <span className="text-[#334155]">{e.n}</span>
              {e.ok
                ? <span className="text-[11px] font-bold uppercase text-[#05A052] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#05A052]" />running</span>
                : <span className="text-[11px] font-bold uppercase text-[#F2AF04] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#F2AF04]" />syncing</span>}
            </div>
          ))}
        </div>
      </Panel>

      <div className="md:col-span-3">
        <Panel title="Top critical findings">
          {[
            { s: "critical" as Sev, r: "s3://prod-user-data", d: "Public bucket with 847K PII records", fw: "PCI-DSS · SOC 2" },
            { s: "critical" as Sev, r: "iam::deploy-admin", d: "Wildcard '*' on resource and action", fw: "CIS AWS 1.16" },
            { s: "high" as Sev, r: "ec2::i-0a1b2c3d", d: "IMDSv1 enabled — SSRF risk", fw: "CIS AWS 5.6" },
          ].map((f, i) => (
            <Row key={i}>
              <SevChip sev={f.s} />
              <div className="min-w-0">
                <div className="font-mono text-xs text-[#0B1220] truncate">{f.r}</div>
                <div className="text-[#475569] text-sm">{f.d}</div>
              </div>
              <div className="text-[11px] text-[#64748B]">{f.fw}</div>
            </Row>
          ))}
        </Panel>
      </div>
    </div>
  );
}

/* --------- 2. Onboarding --------- */
function ViewOnboarding() {
  const steps = [
    { n: 1, t: "Choose your cloud", d: "AWS · Azure · GCP · OCI · AliCloud · Kubernetes", done: true },
    { n: 2, t: "Deploy read-only role", d: "One-click CloudFormation, Terraform or CLI script", done: true },
    { n: 3, t: "Verify connection", d: "Onam checks 24 required permissions, warns on drift", done: true },
    { n: 4, t: "First scan", d: "every security layer runs in parallel — first findings in < 5 min", done: false },
  ];
  return (
    <div className="grid md:grid-cols-[1.2fr_1fr] gap-4">
      <Panel title="Connect a cloud account" right={<SevChip sev="success">AWS connected</SevChip>}>
        <ol className="space-y-3">
          {steps.map((s) => (
            <li key={s.n} className="flex items-start gap-3">
              <div className={cn(
                "w-8 h-8 rounded-full grid place-items-center text-xs font-bold shrink-0",
                s.done ? "bg-[#05A052] text-white" : "bg-[#EFF4FF] text-[#2563EB] border border-[#DBE7FE]",
              )}>
                {s.done ? <Check className="w-4 h-4" /> : s.n}
              </div>
              <div className="flex-1 pb-3 border-b border-[#E5E9F0] last:border-0 last:pb-0">
                <div className="font-semibold text-[#0B1220]">{s.t}</div>
                <div className="text-sm text-[#475569] mt-0.5">{s.d}</div>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-4 rounded-lg border border-[#E5E9F0] bg-[#F8FAFC] p-3 font-mono text-[11px] text-[#334155] leading-relaxed">
          <div className="text-[#64748B]"># Terraform snippet</div>
          module "onam" {"{"} <br/>
          &nbsp;&nbsp;source = "onam-security/reader/aws"<br/>
          &nbsp;&nbsp;external_id = "onam-{"<tenant>"}"<br/>
          {"}"}
        </div>
      </Panel>

      <Panel title="Coverage">
        <div className="space-y-3">
          {[
            { n: "AWS accounts", v: "42 / 42", pct: 100 },
            { n: "Azure subscriptions", v: "17 / 17", pct: 100 },
            { n: "GCP projects", v: "9 / 12", pct: 75 },
            { n: "Kubernetes clusters", v: "31 / 31", pct: 100 },
          ].map((c) => (
            <div key={c.n}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#334155]">{c.n}</span>
                <span className="text-[#0B1220] font-semibold">{c.v}</span>
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${c.pct}%`, backgroundColor: c.pct === 100 ? "#05A052" : "#F2AF04" }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-4 border-t border-[#E5E9F0] text-xs text-[#64748B]">
          <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#05A052]" /> No agents installed</div>
          <div className="flex items-center gap-1.5 mt-1"><Check className="w-3 h-3 text-[#05A052]" /> No long-lived credentials</div>
          <div className="flex items-center gap-1.5 mt-1"><Check className="w-3 h-3 text-[#05A052]" /> Read-only permissions only</div>
        </div>
      </Panel>
    </div>
  );
}

/* --------- 3. Findings --------- */
function ViewFindings() {
  const rows = [
    { s: "critical" as Sev, r: "s3://prod-user-data", d: "Bucket publicly readable · 847K PII records", fw: "PCI-DSS · SOC 2", eng: "Data Security" },
    { s: "critical" as Sev, r: "iam::role/deploy-admin", d: "Wildcard '*' on resource and action", fw: "CIS AWS 1.16", eng: "CIEM" },
    { s: "critical" as Sev, r: "rds::prod-postgres", d: "Encryption at rest disabled", fw: "HIPAA · SOC 2", eng: "CSPM" },
    { s: "high" as Sev, r: "ec2::i-0a1b2c3d", d: "IMDSv1 enabled — SSRF risk", fw: "CIS AWS 5.6", eng: "CSPM" },
    { s: "high" as Sev, r: "eks::cluster/prod", d: "Public API endpoint · no auth webhook", fw: "CIS EKS", eng: "Container" },
    { s: "high" as Sev, r: "iam::user/ci-deploy", d: "Access key 412 days old, never rotated", fw: "SOC 2 · CIS", eng: "IAM" },
    { s: "medium" as Sev, r: "sg-0987654", d: "Ingress 0.0.0.0/0 on tcp/22", fw: "CIS AWS 5.2", eng: "Network" },
  ];
  return (
    <Panel title="847 findings, prioritised by real risk"
           right={<div className="flex gap-1 text-[11px]">
             <span className="px-2 py-1 rounded bg-[#FDECEA] text-[#E32D25] font-bold">12 CRIT</span>
             <span className="px-2 py-1 rounded bg-[#FEF6E0] text-[#F2AF04] font-bold">84 HIGH</span>
             <span className="px-2 py-1 rounded bg-[#EFF4FF] text-[#2563EB] font-bold">319 MED</span>
           </div>}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-[#64748B]">
              <th className="text-left px-3 py-2 font-semibold">Severity</th>
              <th className="text-left px-3 py-2 font-semibold">Resource</th>
              <th className="text-left px-3 py-2 font-semibold">Finding</th>
              <th className="text-left px-3 py-2 font-semibold">Framework</th>
              <th className="text-left px-3 py-2 font-semibold">Engine</th>
              <th className="text-right px-3 py-2 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-[#E5E9F0] hover:bg-[#F8FAFC] transition">
                <td className="px-3 py-2.5"><SevChip sev={r.s} /></td>
                <td className="px-3 py-2.5 font-mono text-xs text-[#0B1220]">{r.r}</td>
                <td className="px-3 py-2.5 text-[#334155]">{r.d}</td>
                <td className="px-3 py-2.5 text-xs text-[#64748B]">{r.fw}</td>
                <td className="px-3 py-2.5 text-xs text-[#334155]">{r.eng}</td>
                <td className="px-3 py-2.5 text-right">
                  <button className="text-[11px] font-semibold text-[#2563EB] px-2 py-1 rounded border border-[#DBE7FE] bg-[#EFF4FF] hover:bg-[#DBE7FE] transition">
                    Remediate →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* --------- 4. Attack Path --------- */
function ViewAttackPath() {
  const nodes: { x: number; y: number; icon: ComponentType<{ className?: string }>; label: string; sev: Sev }[] = [
    { x: 60,  y: 210, icon: Users2, label: "Public IAM user", sev: "critical" },
    { x: 260, y: 110, icon: Server, label: "EC2 (SSRF, IMDSv1)", sev: "high" },
    { x: 260, y: 310, icon: Boxes, label: "EKS pod (privileged)", sev: "high" },
    { x: 480, y: 210, icon: KeyRound, label: "AssumeRole → admin", sev: "critical" },
    { x: 700, y: 210, icon: Database, label: "prod-postgres (crown jewel)", sev: "critical" },
  ];
  return (
    <Panel title="3 attack paths reach crown jewels"
           right={<SevChip sev="critical">MITRE T1078 → T1068 → T1552 → T1552.001</SevChip>}>
      <div className="relative h-[380px] w-full overflow-hidden rounded-lg bg-[#F8FAFC] border border-[#E5E9F0]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="none">
          <defs>
            <linearGradient id="edge1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#E32D25" stopOpacity="0.5" />
              <stop offset="1" stopColor="#E32D25" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <path d="M 90 220 C 180 220 180 120 260 120 C 380 120 380 220 480 220 C 580 220 580 220 700 220" stroke="url(#edge1)" strokeWidth="2" fill="none" strokeDasharray="6 5" />
          <path d="M 90 220 C 180 220 180 320 260 320 C 380 320 380 220 480 220" stroke="url(#edge1)" strokeWidth="2" fill="none" strokeDasharray="6 5" />
        </svg>
        {nodes.map((n, i) => {
          const I = n.icon;
          const s = sevStyle[n.sev];
          return (
            <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: n.x, top: n.y }}>
              <div className="w-16 h-16 rounded-xl grid place-items-center border bg-white shadow-[0_4px_12px_rgba(16,24,40,.10)]"
                   style={{ borderColor: s.color + "60", backgroundColor: s.tint }}>
                <I className="w-6 h-6" />
              </div>
              <div className="mt-2 text-[11px] text-[#334155] text-center whitespace-nowrap font-semibold bg-white px-2 py-0.5 rounded border border-[#E5E9F0]">{n.label}</div>
            </div>
          );
        })}
        <div className="absolute bottom-3 right-3 bg-white rounded-lg px-3 py-2 text-xs text-[#334155] border border-[#E5E9F0] shadow-sm">
          <span className="text-[#E32D25] font-bold">3 attack paths</span> reach crown jewels
        </div>
      </div>
    </Panel>
  );
}

/* --------- 5. IAM --------- */
function ViewIAM() {
  const rows = [
    { p: "root", type: "User", risk: "critical" as Sev, note: "MFA disabled · active access key", access: "*:*" },
    { p: "deploy-admin", type: "Role", risk: "critical" as Sev, note: "Wildcard on Action and Resource", access: "*:*" },
    { p: "ci-deploy", type: "User", risk: "high" as Sev, note: "Access key 412 days old", access: "s3:*, rds:*" },
    { p: "prod-backup", type: "Role", risk: "high" as Sev, note: "Cross-account trust — 3rd party", access: "s3:*, kms:*" },
    { p: "readonly-analyst", type: "Group", risk: "medium" as Sev, note: "Unused 60 days", access: "read-only" },
  ];
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <StatTile label="Identities" value="189" sev="info" />
      <StatTile label="Overprivileged" value="47" sev="high" hint="24.9% of identities" />
      <StatTile label="Admin wildcards" value="3" sev="critical" />

      <div className="md:col-span-3">
        <Panel title="Overprivileged identities" right={<span className="text-xs text-[#64748B]">30-day behavior baseline</span>}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-[#64748B]">
                  <th className="text-left px-3 py-2 font-semibold">Principal</th>
                  <th className="text-left px-3 py-2 font-semibold">Type</th>
                  <th className="text-left px-3 py-2 font-semibold">Effective access</th>
                  <th className="text-left px-3 py-2 font-semibold">Risk</th>
                  <th className="text-left px-3 py-2 font-semibold">Note</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-[#E5E9F0]">
                    <td className="px-3 py-2.5 font-mono text-xs text-[#0B1220]">{r.p}</td>
                    <td className="px-3 py-2.5 text-[#334155]">{r.type}</td>
                    <td className="px-3 py-2.5 font-mono text-xs text-[#334155]">{r.access}</td>
                    <td className="px-3 py-2.5"><SevChip sev={r.risk} /></td>
                    <td className="px-3 py-2.5 text-[#475569]">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* --------- 6. Network --------- */
function ViewNetwork() {
  const exposed = [
    { r: "sg-0987654", p: "tcp/22 from 0.0.0.0/0", target: "prod-bastion", sev: "critical" as Sev },
    { r: "sg-01ac83b", p: "tcp/3306 from 0.0.0.0/0", target: "prod-mysql", sev: "critical" as Sev },
    { r: "sg-01d99e2", p: "tcp/443 from 0.0.0.0/0", target: "api-gateway", sev: "info" as Sev },
    { r: "sg-06de51f", p: "tcp/6379 from 0.0.0.0/0", target: "cache-redis", sev: "critical" as Sev },
    { r: "sg-0a12f0c", p: "udp/53 from 0.0.0.0/0", target: "internal-dns", sev: "high" as Sev },
  ];
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Panel title="VPC topology — us-east-1">
        <div className="relative h-[300px] rounded-lg bg-[#F8FAFC] border border-[#E5E9F0] p-4">
          <div className="absolute top-4 left-4 text-[10px] uppercase tracking-widest text-[#64748B] font-bold">Internet</div>
          <div className="absolute inset-6 rounded-md border-2 border-dashed border-[#CBD5E1] p-3">
            <div className="text-[10px] uppercase tracking-widest text-[#64748B] font-bold">VPC prod / 10.0.0.0/16</div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white border border-[#E5E9F0] p-3">
                <div className="text-[10px] uppercase text-[#64748B] font-bold">public subnet</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FDECEA] text-[#E32D25]">bastion</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EFF4FF] text-[#2563EB]">alb</span>
                </div>
              </div>
              <div className="rounded-lg bg-white border border-[#E5E9F0] p-3">
                <div className="text-[10px] uppercase text-[#64748B] font-bold">private subnet</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#334155]">web x4</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FDECEA] text-[#E32D25]">mysql</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FDECEA] text-[#E32D25]">redis</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-3 right-3 text-[11px] text-[#E32D25] font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> 7 internet-exposed
          </div>
        </div>
      </Panel>

      <Panel title="Internet-exposed resources">
        {exposed.map((e, i) => (
          <Row key={i}>
            <SevChip sev={e.sev} />
            <div>
              <div className="font-mono text-xs text-[#0B1220]">{e.r}</div>
              <div className="text-[#475569] text-sm">{e.p}</div>
            </div>
            <div className="text-xs text-[#334155] font-mono">{e.target}</div>
          </Row>
        ))}
      </Panel>
    </div>
  );
}

/* --------- 7. Detection --------- */
function ViewDetection() {
  const alerts = [
    { t: "12s ago", tech: "T1078.004 · Valid Cloud Accounts", d: "Root user API call from Tor exit node — us-east-1", sev: "critical" as Sev },
    { t: "1m 04s", tech: "T1580 · Cloud Infrastructure Discovery", d: "iam::ListUsers × 214 from ci-deploy in 90s", sev: "high" as Sev },
    { t: "3m 22s", tech: "T1537 · Transfer to Cloud Account", d: "s3 cross-account copy · unknown destination account", sev: "critical" as Sev },
    { t: "7m 11s", tech: "T1098 · Account Manipulation", d: "New access key created for 'root' user", sev: "critical" as Sev },
    { t: "11m", tech: "T1526 · Cloud Service Discovery", d: "Unusual GetCallerIdentity burst from EC2 i-0a1b2c", sev: "medium" as Sev },
  ];
  return (
    <div className="grid md:grid-cols-4 gap-4">
      <StatTile label="Events / 24h" value="2.3M" sev="info" />
      <StatTile label="Alerts" value="18" sev="high" />
      <StatTile label="Critical" value="4" sev="critical" hint="live now" />
      <StatTile label="MITRE techniques" value="9" sev="medium" />

      <div className="md:col-span-4">
        <Panel title="Alert stream"
               right={<span className="text-[11px] text-[#05A052] font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#05A052] animate-pulse" /> Live · CloudTrail + VPC Flow</span>}>
          {alerts.map((a, i) => (
            <div key={i} className="flex items-start gap-3 py-2.5 border-b border-[#E5E9F0] last:border-0">
              <div className="w-14 shrink-0 text-[11px] text-[#64748B] font-mono pt-0.5">{a.t}</div>
              <SevChip sev={a.sev} />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-[#2563EB] font-semibold font-mono">{a.tech}</div>
                <div className="text-sm text-[#334155] mt-0.5">{a.d}</div>
              </div>
              <button className="text-[11px] font-semibold text-[#2563EB] px-2 py-1 rounded border border-[#DBE7FE] bg-[#EFF4FF] hover:bg-[#DBE7FE] transition shrink-0">
                Investigate
              </button>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

/* --------- 8. Container --------- */
function ViewContainer() {
  const cves = [
    { cve: "CVE-2024-6387", pkg: "openssh-server 9.0", epss: 0.94, sev: "critical" as Sev, exploit: true, img: "web-api:1.42" },
    { cve: "CVE-2024-3094", pkg: "xz-utils 5.6.0", epss: 0.87, sev: "critical" as Sev, exploit: true, img: "base-ubuntu:24" },
    { cve: "CVE-2023-4911", pkg: "glibc 2.34", epss: 0.72, sev: "critical" as Sev, exploit: true, img: "worker:2.7" },
    { cve: "CVE-2024-21626", pkg: "runc 1.1.11", epss: 0.61, sev: "high" as Sev, exploit: false, img: "any" },
    { cve: "CVE-2024-1086", pkg: "linux-kernel 6.4", epss: 0.44, sev: "high" as Sev, exploit: false, img: "worker:2.7" },
  ];
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <StatTile label="Clusters" value="31" sev="info" />
      <StatTile label="Images scanned" value="1,248" sev="info" />
      <StatTile label="CVEs w/ active exploit" value="3" sev="critical" />

      <div className="md:col-span-3">
        <Panel title="High-priority CVEs — sorted by EPSS">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-[#64748B]">
                  <th className="text-left px-3 py-2 font-semibold">CVE</th>
                  <th className="text-left px-3 py-2 font-semibold">Package</th>
                  <th className="text-left px-3 py-2 font-semibold">Image</th>
                  <th className="text-left px-3 py-2 font-semibold">EPSS</th>
                  <th className="text-left px-3 py-2 font-semibold">Exploit</th>
                  <th className="text-left px-3 py-2 font-semibold">Severity</th>
                </tr>
              </thead>
              <tbody>
                {cves.map((c, i) => (
                  <tr key={i} className="border-t border-[#E5E9F0]">
                    <td className="px-3 py-2.5 font-mono text-xs text-[#0B1220]">{c.cve}</td>
                    <td className="px-3 py-2.5 text-[#334155]">{c.pkg}</td>
                    <td className="px-3 py-2.5 font-mono text-xs text-[#475569]">{c.img}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                          <div className="h-full rounded-full bg-[#E32D25]" style={{ width: `${c.epss * 100}%` }} />
                        </div>
                        <span className="text-[11px] text-[#334155] font-mono">{c.epss.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      {c.exploit
                        ? <span className="text-[10px] font-bold uppercase text-[#E32D25] bg-[#FDECEA] px-2 py-0.5 rounded">Active</span>
                        : <span className="text-[10px] font-bold uppercase text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded">None</span>}
                    </td>
                    <td className="px-3 py-2.5"><SevChip sev={c.sev} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* --------- 9. Compliance --------- */
function ViewCompliance() {
  const fw = [
    { n: "CIS AWS v2", p: 87 },
    { n: "SOC 2 Type II", p: 92 },
    { n: "PCI-DSS v4", p: 74 },
    { n: "HIPAA", p: 81 },
    { n: "ISO 27001", p: 89 },
    { n: "NIST 800-53", p: 76 },
  ];
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {fw.map((f) => (
        <div key={f.n} className="rounded-xl border border-[#E5E9F0] bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-[#0B1220]">{f.n}</div>
            <div className="text-2xl font-display font-black text-[#0B1220]">{f.p}%</div>
          </div>
          <div className="mt-3 h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
            <div className="h-full rounded-full" style={{
              width: `${f.p}%`,
              backgroundColor: f.p >= 85 ? "#05A052" : f.p >= 75 ? "#F2AF04" : "#E32D25",
            }} />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Continuous evidence</span>
            <span>{Math.round(f.p * 3.2)} / {320} controls</span>
          </div>
        </div>
      ))}
      <div className="md:col-span-3">
        <Panel title="One finding · six frameworks"
               right={<SevChip sev="medium">Cross-mapped</SevChip>}>
          <div className="text-sm text-[#0B1220] font-semibold">rds::prod-postgres — Encryption at rest disabled</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["PCI-DSS 3.4", "HIPAA §164.312(a)(2)(iv)", "SOC 2 CC6.7", "CIS AWS 2.3.1", "ISO 27001 A.10.1.1", "NIST SC-28"].map((c) => (
              <span key={c} className="text-[11px] font-medium text-[#334155] bg-[#F1F5F9] border border-[#E5E9F0] px-2 py-1 rounded">{c}</span>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* --------- 10. Data Security --------- */
function ViewData() {
  const buckets = [
    { b: "s3://prod-user-data", exposure: "public", pii: 847_000, types: ["SSN", "Credit card", "Email"], sev: "critical" as Sev },
    { b: "s3://analytics-exports", exposure: "public", pii: 12_400, types: ["Email"], sev: "critical" as Sev },
    { b: "s3://legacy-backups-2019", exposure: "public", pii: 3_200, types: ["Name", "Phone"], sev: "critical" as Sev },
    { b: "s3://ml-training-set", exposure: "authenticated-users", pii: 0, types: [], sev: "medium" as Sev },
    { b: "s3://ops-logs", exposure: "private", pii: 0, types: [], sev: "success" as Sev },
  ];
  return (
    <div className="grid md:grid-cols-4 gap-4">
      <StatTile label="Buckets scanned" value="1,842" sev="info" />
      <StatTile label="PII records" value="847K" sev="high" />
      <StatTile label="Public w/ PII" value="3" sev="critical" />
      <StatTile label="Encrypted at rest" value="94%" sev="medium" />

      <div className="md:col-span-4">
        <Panel title="Storage exposure — S3">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-[#64748B]">
                  <th className="text-left px-3 py-2 font-semibold">Bucket</th>
                  <th className="text-left px-3 py-2 font-semibold">Exposure</th>
                  <th className="text-left px-3 py-2 font-semibold">PII</th>
                  <th className="text-left px-3 py-2 font-semibold">Classes</th>
                  <th className="text-left px-3 py-2 font-semibold">Severity</th>
                </tr>
              </thead>
              <tbody>
                {buckets.map((b, i) => (
                  <tr key={i} className="border-t border-[#E5E9F0]">
                    <td className="px-3 py-2.5 font-mono text-xs text-[#0B1220]">{b.b}</td>
                    <td className="px-3 py-2.5 text-[#334155]">{b.exposure}</td>
                    <td className="px-3 py-2.5 text-[#334155]">{b.pii ? b.pii.toLocaleString() : "—"}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {b.types.map((t) => (
                          <span key={t} className="text-[10px] font-medium text-[#E32D25] bg-[#FDECEA] px-1.5 py-0.5 rounded">{t}</span>
                        ))}
                        {b.types.length === 0 && <span className="text-[11px] text-[#64748B]">none</span>}
                      </div>
                    </td>
                    <td className="px-3 py-2.5"><SevChip sev={b.sev} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* --------- 11. Risk / FAIR --------- */
function ViewRisk() {
  const items = [
    { s: "Public S3 with PII", ale: [2400000, 8700000], fix: "Enable Block Public Access + KMS" },
    { s: "Root user without MFA", ale: [900000, 3200000], fix: "Enforce MFA + rotate access key" },
    { s: "Wildcard IAM admin role", ale: [640000, 2100000], fix: "Scope to least-privilege policy" },
    { s: "Unencrypted prod DB", ale: [320000, 1100000], fix: "Enable RDS encryption via snapshot" },
  ];
  const fmt = (v: number) => "$" + (v / 1_000_000).toFixed(1) + "M";
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <Panel title="Top exposures by annual loss expectancy" right={<span className="text-[11px] text-[#64748B]">FAIR model · 90% CI</span>}>
          {items.map((r, i) => {
            const maxAle = 9_000_000;
            return (
              <div key={i} className="py-3 border-b border-[#E5E9F0] last:border-0">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-semibold text-[#0B1220]">{r.s}</div>
                  <div className="font-mono text-[#0B1220] font-semibold">{fmt(r.ale[0])} – {fmt(r.ale[1])}</div>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[#F1F5F9] overflow-hidden relative">
                  <div className="absolute h-full rounded-full"
                       style={{ left: `${(r.ale[0] / maxAle) * 100}%`, width: `${((r.ale[1] - r.ale[0]) / maxAle) * 100}%`, background: "linear-gradient(to right, #F2AF04, #E32D25)" }} />
                </div>
                <div className="mt-1.5 text-[11px] text-[#475569]">Fix → <span className="text-[#2563EB] font-semibold">{r.fix}</span></div>
              </div>
            );
          })}
        </Panel>
      </div>

      <Panel title="Portfolio ALE">
        <div className="text-[11px] uppercase tracking-widest text-[#64748B] font-bold">Total 12-mo exposure</div>
        <div className="mt-2 text-4xl font-display font-black text-[#0B1220]">$14.7M</div>
        <div className="text-xs text-[#64748B] mt-1">Range $4.3M – $28.9M · 90% CI</div>

        <div className="mt-5 pt-5 border-t border-[#E5E9F0] space-y-2">
          <div className="flex items-center justify-between text-sm"><span className="text-[#475569]">Data breach</span><span className="font-mono text-[#0B1220] font-semibold">$8.2M</span></div>
          <div className="flex items-center justify-between text-sm"><span className="text-[#475569]">Account takeover</span><span className="font-mono text-[#0B1220] font-semibold">$3.8M</span></div>
          <div className="flex items-center justify-between text-sm"><span className="text-[#475569]">Business disruption</span><span className="font-mono text-[#0B1220] font-semibold">$2.1M</span></div>
          <div className="flex items-center justify-between text-sm"><span className="text-[#475569]">Compliance fines</span><span className="font-mono text-[#0B1220] font-semibold">$0.6M</span></div>
        </div>

        <div className="mt-5 pt-5 border-t border-[#E5E9F0] rounded-lg bg-[#E7F6EF] p-3">
          <div className="text-[11px] uppercase tracking-widest text-[#05A052] font-bold">If top 4 fixed</div>
          <div className="text-lg font-display font-black text-[#05A052] mt-1">−$5.4M ALE</div>
        </div>
      </Panel>
    </div>
  );
}

/* ============================ PLATFORM PILLARS ============================ */
function PlatformPillars() {
  const pillars = [
    { icon: ShieldHalf, title: "CNAPP", q: "What's our posture, in one number?", metric: "7 pillars · one score", to: "/platform/cnapp", color: "#4F46E5" },
    { icon: Shield, title: "CSPM", q: "What's misconfigured across every cloud?", metric: "9,853 posture rules", to: "/platform/cspm", color: "#2563EB" },
    { icon: Fingerprint, title: "CIEM", q: "Which identities are quietly over-privileged?", metric: "30-day behavioral baselines", to: "/platform/ciem", color: "#F2AF04" },
    { icon: Eye, title: "IAM Security", q: "Who has access to what?", metric: "Policies · users · roles", to: "/platform/iam", color: "#0284C7" },
    { icon: Package, title: "Asset Inventory", q: "What do we actually run?", metric: "549 services · 7 clouds", to: "/platform/inventory", color: "#0891B2" },
    { icon: GitBranch, title: "Attack Path", q: "Which risks actually reach crown jewels?", metric: "Cross-cloud graph analysis", to: "/platform/attack-path", color: "#E32D25" },
    { icon: Activity, title: "CDR Detection", q: "Behavioral threats across layers?", metric: "L1 · L2 · L3 detection", to: "/platform/cdr", color: "#EF4444" },
    { icon: ShieldAlert, title: "Threat Detection", q: "Are we being attacked right now?", metric: "MITRE ATT&CK-mapped", to: "/platform/threat-detection", color: "#DB2777" },
    { icon: DollarSign, title: "Risk Quantification", q: "What's this exposure worth in dollars?", metric: "FAIR model", to: "/platform/risk", color: "#05A052" },
    { icon: Database, title: "DSPM — Data Security", q: "Where does sensitive data really live?", metric: "1,321 data protection rules", to: "/platform/data-security", color: "#7C3AED" },
    { icon: HardDrive, title: "Database Security", q: "Are our databases hardened?", metric: "1,364 CIS engine benchmarks", to: "/platform/database-security", color: "#B45309" },
    { icon: KeyRound, title: "Encryption & Keys", q: "Who can decrypt our data?", metric: "502 key management rules", to: "/platform/encryption", color: "#CA8A04" },
    { icon: Network, title: "Network Security", q: "Where is my perimeter actually leaking?", metric: "7-layer topology analysis", to: "/platform/network-security", color: "#0EA5E9" },
    { icon: Webhook, title: "API Security", q: "Which APIs are open to the world?", metric: "241 API posture rules", to: "/platform/api-security", color: "#DB2777" },
    { icon: Server, title: "CWPP — Workloads", q: "Are running workloads hardened?", metric: "VMs · containers · serverless", to: "/platform/cwpp", color: "#059669" },
    { icon: ScanLine, title: "Agentless Scanning", q: "How do we scan without agents?", metric: "Snapshot-based · zero install", to: "/platform/agentless", color: "#06B6D4" },
    { icon: Boxes, title: "Container Security", q: "Are our clusters and images safe?", metric: "EKS · ECS · image scanning", to: "/platform/container-security", color: "#3B82F6" },
    { icon: Bug, title: "Vulnerability Mgmt", q: "Which CVEs actually matter to us?", metric: "Contextual, not CVSS-only", to: "/platform/vulnerability", color: "#EA580C" },
    { icon: Code2, title: "Code Security", q: "Are we shipping vulnerable code?", metric: "SAST · DAST · SCA · IaC", to: "/platform/secops", color: "#0891B2" },
    { icon: Blocks, title: "SaaS Security (SSPM)", q: "Is M365 and Workspace locked down?", metric: "433 CIS SaaS rules", to: "/platform/saas-security", color: "#8B5CF6" },
    { icon: Bot, title: "AI Security", q: "Are Bedrock and SageMaker safe?", metric: "AI/ML risk detection", to: "/platform/ai-security", color: "#A855F7" },
    { icon: Sparkles, title: "AI Assistant", q: "Can I just ask what's exposed?", metric: "13 domain specialists", to: "/platform/ai-assistant", color: "#7C3AED" },
    { icon: Wrench, title: "Remediation", q: "How does this actually get fixed?", metric: "Every finding ships its fix", to: "/platform/remediation", color: "#10B981" },
    { icon: ScrollText, title: "Compliance", q: "Are we audit-ready — today?", metric: "78 frameworks", to: "/platform/compliance", color: "#059669" },
    { icon: Layers, title: "Technology Engine", q: "What is actually running here?", metric: "34 technologies", to: "/platform/technology", color: "#65A30D" },
  ];
  return (
    <section className="py-24 border-b border-[#E5E9F0] bg-[#F7F9FC]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          eyebrow="One platform · one graph"
          title="Everything you need in one platform"
          subtitle="CNAPP, CSPM, CIEM, DSPM, CWPP and SSPM are engines here, not separate products — 29 of them running in parallel on the same data model, so findings talk to each other."
          gradientWords="one platform"
        />
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pillars.map((p) => {
            const I = p.icon;
            return (
              <Link key={p.title} to={p.to} className="group">
                <div className="h-full bg-white border border-[#E5E9F0] rounded-2xl p-6 shadow-[0_1px_2px_rgba(16,24,40,.04),0_1px_3px_rgba(16,24,40,.06)] hover:shadow-[0_12px_28px_rgba(16,24,40,.10)] hover:-translate-y-0.5 hover:border-[#CBD5E1] transition-all">
                  <div className="w-10 h-10 rounded-lg grid place-items-center"
                       style={{ backgroundColor: `color-mix(in srgb, ${p.color} 12%, #FFFFFF)` }}>
                    <I className="w-5 h-5" style={{ color: p.color }} />
                  </div>
                  <h3 className="mt-4 font-display font-bold text-[#0B1220] text-lg">{p.title}</h3>
                  <p className="mt-2 text-sm text-[#475569] leading-relaxed">{p.q}</p>
                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-[#E5E9F0]">
                    <span className="text-xs font-mono text-[#2563EB]">{p.metric}</span>
                    <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================ TESTIMONIALS ============================ */
function Testimonials() {
  const quotes = [
    { q: "Our first Onam scan surfaced 14 critical findings we had missed for two years — including a public S3 bucket with customer PII. We fixed them all in a week.",
      name: "Priya S.", role: "Head of Security", co: "Series C fintech · 40 AWS accounts" },
    { q: "The attack path view finally made cloud risk something my board understood. It stopped being a wall of CVEs and became a picture of what an attacker could actually do.",
      name: "Marcus D.", role: "CISO", co: "Global insurance carrier" },
    { q: "We prepared for SOC 2 Type II in 6 weeks instead of 6 months. Compliance evidence exports directly from Onam — no auditor screenshots.",
      name: "Elena R.", role: "VP Engineering", co: "HIPAA-regulated healthtech" },
  ];
  return (
    <section className="py-24 border-b border-[#E5E9F0] bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader eyebrow="Customers" title="What teams find after their first scan" />
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {quotes.map((q) => (
            <div key={q.name} className="bg-white border border-[#E5E9F0] rounded-2xl p-6 shadow-[0_1px_2px_rgba(16,24,40,.04),0_1px_3px_rgba(16,24,40,.06)] hover:shadow-[0_12px_28px_rgba(16,24,40,.10)] transition-all flex flex-col">
              <div className="text-5xl font-display text-[#2563EB]/30 leading-none">"</div>
              <p className="text-[#334155] leading-relaxed">{q.q}</p>
              <div className="mt-6 pt-6 border-t border-[#E5E9F0]">
                <div className="font-semibold text-[#0B1220] text-sm">{q.name}</div>
                <div className="text-xs text-[#475569]">{q.role}</div>
                <div className="text-xs text-[#64748B] mt-1">{q.co}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ STATS ============================ */
function StatsSection() {
  // "13 compliance frameworks" was live here. 13 is a RETIRED number —
  // product.yaml lists "13 frameworks / 70+ frameworks" as replaced by 78, and
  // it was corrected sitewide in v38. It survived because the fact gate greps
  // for a number next to its label, and in a stats array the two sit in
  // separate fields: { v: "13", label: "compliance frameworks" }. The gate is
  // blind to exactly the structure where marketing numbers actually live.
  // Sourcing from product-facts closes it here; the gate still needs widening.
  //
  // "10,000+ security rules" and the coverage figures were understatements of
  // the same kind fixed in the strip above.
  const stats = [
    { v: fmt(RULE_CATALOG_TOTAL), label: "security rules", sub: "Across posture, network, data, code, identity", accent: "#2563EB" },
    { v: fmt(SERVICES), label: "cloud services covered", sub: "Enumerated continuously across every connected account", accent: "#E32D25" },
    { v: String(FRAMEWORKS), label: "compliance frameworks", sub: "CIS · NIST · ISO 27001 · PCI-DSS · HIPAA · SOC 2 · more", accent: "#05A052" },
    { v: String(ENGINES), label: "detection & analysis engines", sub: "One graph, one data model", accent: "#F2AF04" },
    { v: String(CLOUDS), label: "cloud providers", sub: "AWS · Azure · GCP · OCI · AliCloud · IBM · Kubernetes", accent: "#7C3AED" },
    { v: String(SAAS_PLATFORMS), label: "SaaS platforms", sub: "M365 · Workspace · GitHub · GitLab · Snowflake · Okta · more", accent: "#0EA5E9" },
  ];
  return (
    <section className="relative py-24 border-b border-[#E5E9F0] bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Was "These are aggregate outcomes across the Onam customer base."
            Nothing here is a customer outcome, and nothing in the claims library
            supports an aggregate across a customer base. These are platform
            coverage figures, so the subtitle now says that — and says where they
            come from, which is the more useful claim to a buyer anyway. */}
        <SectionHeader eyebrow="By the numbers" title="Depth you can measure"
                       subtitle="Platform coverage, counted — every figure below is a cleared number from our product fact sheet, not an estimate." />
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-6 border border-[#E5E9F0] shadow-[0_1px_2px_rgba(16,24,40,.04)]">
              <div className="font-display font-black text-5xl md:text-6xl leading-none text-[#0B1220]">
                {s.v}
              </div>
              <div className="mt-1 h-1 w-10 rounded-full" style={{ backgroundColor: s.accent }} />
              <div className="mt-4 text-sm font-semibold text-[#0B1220]">{s.label}</div>
              <div className="mt-1 text-xs text-[#64748B]">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ COMPLIANCE ============================ */
function ComplianceSection() {
  const frameworks = [
    "CIS AWS v2", "CIS Azure", "CIS GCP", "NIST 800-53", "ISO 27001", "PCI-DSS v4",
    "HIPAA", "GDPR", "SOC 2", "FedRAMP", "CIS Kubernetes", "MITRE ATT&CK", "CSA CCM v4",
  ];
  return (
    <section className="py-24 border-b border-[#E5E9F0] bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader eyebrow="Compliance" title="Ready for your next audit"
                       subtitle="Continuous evidence across 78 frameworks — export in one click, no auditor screenshots."
                       gradientWords="next audit" />
        <div className="mt-12 flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
          {frameworks.map((f) => (
            <div key={f} className="bg-white border border-[#E5E9F0] rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-[0_1px_2px_rgba(16,24,40,.04)]">
              <FileCheck className="w-4 h-4 text-[#05A052]" />
              <span className="text-sm font-semibold text-[#0B1220]">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ WHY NOW ============================ */
function WhyNow() {
  const items = [
    { icon: Cloud, title: "Attack surface is growing 40% YoY", body: "Every new microservice, S3 bucket, and IAM role is a new door. Manual reviews can't keep up.", color: "#2563EB", tint: "#EFF4FF" },
    { icon: Fingerprint, title: "Identity sprawl is the new perimeter", body: "80% of cloud breaches start with an over-privileged identity. Nobody is auditing them weekly.", color: "#F2AF04", tint: "#FEF6E0" },
    { icon: Layers, title: "Multi-cloud complexity is the norm", body: "The average enterprise runs 3+ clouds. Native tools only see their own turf.", color: "#7C3AED", tint: "#F3E8FF" },
    { icon: AlertTriangle, title: "Breach costs hit $4.88M on average", body: "IBM 2024 report. Cloud breaches cost 15% more than on-prem — and take 88 more days to detect.", color: "#E32D25", tint: "#FDECEA" },
  ];
  return (
    <section className="py-24 border-b border-[#E5E9F0] bg-[#F7F9FC]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader eyebrow="Why now" title="Cloud security is at an inflection point"
                       subtitle="The controls that worked in 2020 don't work in 2026." />
        <div className="mt-14 grid sm:grid-cols-2 gap-6">
          {items.map((i) => {
            const I = i.icon;
            return (
              <div key={i.title} className="bg-white rounded-2xl border border-[#E5E9F0] p-6 shadow-[0_1px_2px_rgba(16,24,40,.04)] hover:shadow-[0_12px_28px_rgba(16,24,40,.10)] transition-all">
                <div className="flex gap-5">
                  <div className="w-11 h-11 rounded-xl grid place-items-center shrink-0" style={{ backgroundColor: i.tint }}>
                    <I className="w-5 h-5" style={{ color: i.color }} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-[#0B1220] text-lg">{i.title}</h3>
                    <p className="mt-2 text-sm text-[#475569] leading-relaxed">{i.body}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================ DIFFERENTIATOR ============================ */
function Differentiator() {
  const rows: { area: string; alts: [string, string, string]; onam: string }[] = [
    { area: "Coverage", alts: ["One cloud only", "One security layer", "Point-in-time"], onam: "All 7 clouds · every security layer · continuous" },
    { area: "Attack paths", alts: ["✗", "✗", "Manual"], onam: "Cross-cloud graph analysis" },
    { area: "Toxic combinations", alts: ["✗", "✗", "✗"], onam: "Automated across engines" },
    { area: "Compliance", alts: ["Per-provider", "Manual mapping", "Point-in-time"], onam: "78 frameworks · continuous evidence" },
    { area: "Identity", alts: ["Basic policies", "None", "Interview-based"], onam: "30-day behavioral CIEM" },
    { area: "Prioritisation", alts: ["Alert firehose", "CVSS-only", "Report handoff"], onam: "FAIR-model dollar risk" },
    { area: "Code + Runtime", alts: ["Runtime only", "One or the other", "Neither"], onam: "SAST · DAST · SCA · IaC · runtime" },
  ];
  return (
    <section className="py-24 border-b border-[#E5E9F0] bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader eyebrow="Why Onam" title="Onam vs. the alternatives"
                       subtitle="Where other approaches stop, Onam keeps going — because everything is on one graph."
                       gradientWords="the alternatives" />
        <div className="mt-14 overflow-x-auto">
          <div className="min-w-[860px] bg-white rounded-2xl border border-[#E5E9F0] overflow-hidden shadow-[0_1px_2px_rgba(16,24,40,.04)]">
            <div className="grid grid-cols-5 bg-[#F8FAFC] border-b border-[#E5E9F0]">
              <div className="px-5 py-4 text-[11px] uppercase tracking-widest text-[#64748B] font-bold">Capability</div>
              <div className="px-5 py-4 text-sm font-semibold text-[#334155]">Native cloud tools</div>
              <div className="px-5 py-4 text-sm font-semibold text-[#334155]">Single-layer point tools</div>
              <div className="px-5 py-4 text-sm font-semibold text-[#334155]">Manual audits / pen tests</div>
              <div className="px-5 py-4 text-sm font-bold text-[#2563EB] bg-[#EFF4FF]">Onam</div>
            </div>
            {rows.map((r) => (
              <div key={r.area} className="grid grid-cols-5 border-b border-[#E5E9F0] last:border-0">
                <div className="px-5 py-4 text-sm font-semibold text-[#0B1220]">{r.area}</div>
                {r.alts.map((a, i) => (
                  <div key={i} className="px-5 py-4 text-sm text-[#475569] flex items-start gap-2">
                    <X className="w-4 h-4 text-[#E32D25] shrink-0 mt-0.5" />
                    <span>{a}</span>
                  </div>
                ))}
                <div className="px-5 py-4 text-sm text-[#0B1220] bg-[#F5F8FF] flex items-start gap-2 font-medium">
                  <Check className="w-4 h-4 text-[#05A052] shrink-0 mt-0.5" />
                  <span>{r.onam}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================ TRUST BAR ============================ */
function TrustBar() {
  const items = [
    { icon: <CheckCircle2 className="w-4 h-4 text-[#05A052]" />, label: "SOC 2 Type II certified" },
    { icon: <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />, label: "ISO 27001" },
    { icon: <FileCheck className="w-4 h-4 text-[#05A052]" />, label: "78 frameworks covered" },
    { icon: <Lock className="w-4 h-4 text-[#2563EB]" />, label: "Read-only access" },
    { icon: <ScanLine className="w-4 h-4 text-[#64748B]" />, label: "Delete access anytime" },
  ];
  return (
    <section className="py-14 border-b border-[#E5E9F0] bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-4 md:gap-8">
        {items.map((i, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm text-[#334155]">
            {i.icon}
            <span className="font-medium">{i.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================ FINAL CTA ============================ */
function FinalCTA() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="gradient-border rounded-3xl p-10 md:p-16 text-center">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
            Ready when you are
          </div>
          <h2 className="mt-5 font-display font-black text-4xl md:text-5xl text-[#0B1220] tracking-tight">
            See what's exposed in your cloud in{" "}
            <span className="gradient-text">under 5 minutes.</span>
          </h2>
          <p className="mt-5 text-lg text-[#475569] max-w-2xl mx-auto">
            Connect one account. Watch findings surface live. Decide from there.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <BrandButton to="/request-demo" size="lg">Request demo →</BrandButton>
            <BrandButton to="/company/contact" size="lg" variant="secondary">Talk to us</BrandButton>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#64748B]">
            <span>No credit card required</span>
            <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
            <span>Read-only IAM role</span>
            <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
            <span>SOC 2 Type II certified</span>
            <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
            <span>Delete access anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
