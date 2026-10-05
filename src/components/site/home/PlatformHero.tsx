import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, Bot, ExternalLink, Play, Shield, ShieldHalf } from "lucide-react";
import type { ComponentType, CSSProperties } from "react";
import { BrandButton } from "@/components/site/BrandButton";
import { CLOUDS } from "@/lib/product-facts";
import { cn } from "@/lib/utils";
import { PRODUCTS } from "@/data/products";

/**
 * Homepage top: the end-to-end hero, the reviewed platform diagram with the five-card
 * product strip, and the Onam Security spotlight (the priced attack path that used to
 * be the hero visual). Kept out of routes/index.tsx so the page file stays a list of
 * sections.
 */

/* ============================ HERO ============================
 * The end-to-end story, said first (owner-cleared 2026-10-05, product.yaml
 * `availability_cleared`): one platform — Estate -> Security -> FinOps -> DRM, with
 * Onam Operations (early access) across them.
 *
 * Dark and single-column on purpose. The reviewed platform diagram sits directly
 * under it and IS the hero visual; a second picture beside the headline would compete
 * with it. The priced attack path that used to sit here moved to SecuritySpotlight,
 * where it still makes the security argument — it just no longer makes the platform's.
 *
 * Colours are the brand's dark theme, already checked against #0B1220 for WCAG AA
 * (blue_lt #4D8DFF 5.86:1, sub_dk #9FB0CC 8.52:1).
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0B1220]">
      <div className="pointer-events-none absolute -top-52 -right-40 w-[820px] h-[620px] rounded-full bg-[#2563EB]/20 blur-[160px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 w-[560px] h-[460px] rounded-full bg-[#4D8DFF]/10 blur-[150px]" />

      <div className="relative max-w-5xl mx-auto px-6 pt-14 md:pt-20 pb-28 md:pb-36 text-center animate-slide-up">
        <div className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider bg-white/[0.06] border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
          <span className="text-[#9FB0CC] uppercase">Estate · Security · FinOps · DRM</span>
        </div>

        <h1 className="mt-6 font-display font-black text-white text-[40px] leading-[1.05] sm:text-5xl md:text-6xl lg:text-[68px] tracking-tight md:leading-[1.02] text-balance">
          From assets to a secure, optimised and{" "}
          <span className="text-[#4D8DFF]">resilient cloud.</span>
        </h1>

        <p className="mt-6 text-lg text-[#9FB0CC] leading-relaxed max-w-2xl mx-auto text-pretty">
          Onam finds everything you run across {CLOUDS} clouds, secures it, explains what it costs
          and plans how it comes back after an outage — one platform, one inventory, one console. AI
          agents work across it in early access, and a person approves every change they propose.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <BrandButton to="/request-demo" size="lg">
            Request a demo <ArrowRight className="w-4 h-4" />
          </BrandButton>
          <a
            href="#platform"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-base font-semibold text-white border border-white/20 hover:bg-white/[0.06] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4D8DFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]"
          >
            See the platform <ArrowDown className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================ PLATFORM OVERVIEW ============================
 * The reviewed diagram (IMAGE-REVIEW-CHECKLIST.md, "brand/onam-platform-overview.svg"),
 * pulled up into the hero's dark band so the two read as one statement.
 *
 * The diagram is 1536x1024 and dense: legible full-screen, not as a phone thumbnail.
 * On small screens it runs edge to edge and the "Open full size" link opens the SVG
 * itself, which pinch-zooms without losing sharpness. Alt text is the SVG's own
 * <title>, so the image and its description cannot drift apart.
 */
type StripItem = {
  key: string;
  name: string;
  stage: string;
  href: string;
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  color: string;
  line: string;
  badge?: string;
};

const STAGE: Record<string, string> = {
  estate: "1 · Discover",
  security: "2 · Secure",
  finops: "3 · Optimise",
  drm: "4 · Recover",
};

const ORDER = ["estate", "security", "finops", "drm"] as const;

const STRIP: StripItem[] = [
  ...ORDER.map((k) => {
    const p = PRODUCTS.find((x) => x.key === k)!;
    return {
      key: p.key,
      name: p.name,
      stage: STAGE[k],
      href: p.href,
      icon: p.icon,
      color: p.color,
      line: p.question,
    };
  }),
  {
    key: "operations",
    name: "Onam Operations",
    stage: "Across all four",
    href: "/platform/ai-operations",
    icon: Bot,
    color: "#4F46E5",
    line: "AI agents investigate with evidence and propose changes — a person approves each one.",
    badge: "Early access",
  },
];

export function PlatformOverview() {
  return (
    <section id="platform" className="relative bg-white border-b border-[#E5E9F0] scroll-mt-20">
      {/* The dark band continues behind the top of the diagram card. */}
      <div className="absolute inset-x-0 top-0 h-24 md:h-40 bg-[#0B1220]" aria-hidden />
      <div className="relative max-w-7xl mx-auto px-0 sm:px-6 -mt-16 md:-mt-24">
        <figure className="bg-[#F7F9FC] sm:rounded-2xl border-y sm:border border-[#E5E9F0] shadow-[0_24px_64px_rgba(11,18,32,.18)] overflow-hidden">
          <a
            href="/diagrams/onam-platform-overview.svg"
            target="_blank"
            rel="noopener"
            className="block"
          >
            <img
              src="/diagrams/onam-platform-overview.svg"
              width={1536}
              height={1024}
              alt="Onam platform overview: from assets to a secure, optimised and resilient cloud. Cloud and SaaS data flows into Onam Estate's unified asset graph; Onam Security, Onam FinOps and Onam DRM act on it; Onam Operations (early access) puts AI agents across the platform with human approval."
              className="block w-full h-auto"
              decoding="async"
            />
          </a>
          <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 sm:px-6 py-3 border-t border-[#E5E9F0] bg-white text-xs text-[#64748B]">
            <span>One discovery feeds every product. Onam Operations is in early access.</span>
            <a
              href="/diagrams/onam-platform-overview.svg"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 font-semibold text-[#2563EB] hover:underline"
            >
              Open full size <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </figcaption>
        </figure>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-14 pb-20">
        <div className="max-w-2xl">
          <div className="text-[11px] uppercase tracking-widest text-[#64748B] font-semibold">
            One platform, four products
          </div>
          <h2 className="mt-3 font-display font-black text-[#0B1220] text-3xl md:text-4xl tracking-tight">
            Each stage builds on <span className="gradient-text">the one before it.</span>
          </h2>
          <p className="mt-4 text-[#475569] leading-relaxed">
            Your cloud accounts are connected once. Every product reads the same inventory, runs in
            the same console behind the same login, and is granted per organisation — start with the
            one you need and add the rest when you are ready.
          </p>
        </div>

        <ol className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {STRIP.map((p) => {
            const Icon = p.icon;
            return (
              <li key={p.key} className="min-w-0">
                <Link to={p.href} className="group block h-full">
                  <div className="h-full flex flex-col bg-white border border-[#E5E9F0] rounded-2xl p-5 shadow-[0_1px_2px_rgba(16,24,40,.04),0_1px_3px_rgba(16,24,40,.06)] hover:shadow-[0_16px_36px_rgba(16,24,40,.10)] hover:-translate-y-0.5 transition-all">
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className="w-10 h-10 rounded-xl grid place-items-center shrink-0"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${p.color} 12%, #FFFFFF)`,
                          boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${p.color} 22%, transparent)`,
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: p.color }} />
                      </div>
                      {p.badge ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EEF2FF] text-[#4338CA] border border-[#E0E7FF]">
                          {p.badge}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                          {p.stage}
                        </span>
                      )}
                    </div>
                    <div className="mt-4 font-display font-black text-[#0B1220] text-lg tracking-tight">
                      {p.name}
                    </div>
                    <p className="mt-1.5 text-sm text-[#475569] leading-relaxed flex-1">{p.line}</p>
                    <div className="mt-4 pt-3 border-t border-[#E5E9F0] flex items-center justify-between text-xs font-semibold text-[#2563EB]">
                      <span>{p.badge ? p.stage : "Learn more"}</span>
                      <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition" />
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ============================ SECURITY SPOTLIGHT ============================
 * Security is still the biggest product, so it gets the first deep section — and the
 * priced attack path that used to be the hero visual. Copy is the former hero's,
 * re-scoped to Onam Security.
 */
export function SecuritySpotlight() {
  return (
    <section className="relative overflow-hidden bg-[#0B1220]">
      <div className="pointer-events-none absolute -top-40 -left-40 w-[640px] h-[520px] rounded-full bg-[#2563EB]/15 blur-[150px]" />
      <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-12 items-center">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider bg-white/[0.06] border border-white/10">
            <ShieldHalf className="w-3.5 h-3.5 text-[#4D8DFF]" />
            <span className="text-[#9FB0CC] uppercase">Onam Security</span>
          </div>
          <h2 className="mt-6 font-display font-black text-white text-4xl md:text-5xl tracking-tight leading-[1.05] text-balance">
            Is your cloud secure, or does it just{" "}
            <span className="text-[#4D8DFF]">feel that way?</span>
          </h2>
          <p className="mt-6 text-lg text-[#9FB0CC] leading-relaxed max-w-xl">
            Onam Security maps every misconfiguration, identity risk, and attack path across all{" "}
            {CLOUDS} clouds into one graph — then prices the route an attacker would actually take.
            CSPM, CIEM, DSPM, code security, attack paths and detection, on the inventory Onam
            Estate keeps current.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <BrandButton to="/platform" size="lg">
              Explore Onam Security <ArrowRight className="w-4 h-4" />
            </BrandButton>
            <a
              href="/resources/scenarios"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-base font-semibold text-white border border-white/20 hover:bg-white/[0.06] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4D8DFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]"
            >
              <Play className="w-4 h-4" /> See how it works
            </a>
          </div>
        </div>
        <HeroMock />
      </div>
    </section>
  );
}

function HeroMock() {
  // The attack path, priced — and drawn as a path.
  //
  // First version of this was three stacked boxes in near-identical slate. It
  // read as a LIST, and the one thing that matters here is that these hops are
  // CONNECTED and ESCALATING. Two changes fix that:
  //
  //   * a rail with numbered nodes, so the eye follows one thread top to bottom
  //   * colour that means something — blue at the entry point, amber at the
  //     pivot where privilege is gained, red at the crown jewel. The ramp is the
  //     story: a benign-looking instance becomes a data breach in two hops.
  //
  // Colour is doing semantic work here, never decoration, and it is never the
  // only signal: each node is also numbered, and the crown jewel carries a
  // border and a label. That matters for the ~8% of men with a colour-vision
  // deficiency, who are heavily represented in this audience.
  //
  // Every value checked against the surfaces it sits on: node markers 5.31 /
  // 10.18 / 6.10:1, hop text 15.46:1, notes 7.03:1, labels 4.54:1.
  //
  // min-w-0: a grid item will not shrink below min-content, and without it this
  // widens the single mobile column and clips the headline beside it.
  const hops = [
    {
      n: 1,
      kind: "EC2 instance",
      id: "i-0abc1234def",
      note: "IMDSv1 enabled — credentials readable from the instance",
      tag: "T1552.005",
      dot: "#4D8DFF",
      role: "Entry point",
    },
    {
      n: 2,
      kind: "IAM role",
      id: "OpsAdminRole",
      note: "iam:PassRole:* — escalates to any role in the account",
      tag: "T1078.004",
      dot: "#FBBF24",
      role: "Privilege gained",
    },
    {
      n: 3,
      kind: "S3 bucket",
      id: "acme-prod-data",
      note: "847,000 PII records, readable once the role is assumed",
      tag: "T1530",
      dot: "#FF6B63",
      role: "Crown jewel",
      crown: true,
    },
  ];
  return (
    <div className="relative animate-fade-in min-w-0">
      <div className="absolute -inset-6 bg-gradient-to-br from-[#4D8DFF]/15 via-transparent to-transparent blur-2xl -z-10 rounded-3xl" />

      <div className="rounded-2xl border border-white/10 bg-[#121C31] p-5 shadow-[0_24px_64px_rgba(0,0,0,.5)]">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 min-w-0">
            <Shield className="w-4 h-4 shrink-0 text-[#4D8DFF]" />
            <span className="text-sm font-semibold text-white truncate">
              Attack path to crown jewel
            </span>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FF6B63]/15 text-[#FF6B63]">
            Critical
          </span>
        </div>

        {/* The rail. The absolutely-positioned line sits behind the numbered
            markers so the hops read as one continuous route rather than three
            cards that happen to be adjacent. */}
        <div className="relative mt-5 pl-9">
          <div className="space-y-3">
            {hops.map((h, i) => (
              <div key={h.n} className="relative">
                {/* Connector drawn PER GAP, not as one rail down the whole
                    column. A single absolute rail has no way to know where the
                    last marker is, so it ran past node 3 and left a dangling
                    tail below the crown jewel — a line implying a fourth hop
                    that does not exist. Each segment instead starts under its
                    own marker and ends exactly at the next one: 39px is the
                    marker's bottom edge (top-3 + 27px), -24px is the 12px gap
                    plus the 12px inset of the following marker. */}
                {i < hops.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute w-px"
                    style={{
                      left: "-23px",
                      top: "39px",
                      bottom: "-24px",
                      background: `linear-gradient(180deg, ${h.dot} 0%, ${hops[i + 1].dot} 100%)`,
                    }}
                  />
                )}
                <span
                  className="absolute -left-9 top-3 grid place-items-center w-[27px] h-[27px] rounded-full text-[11px] font-bold text-[#0B1220] ring-4 ring-[#121C31]"
                  style={{ background: h.dot }}
                >
                  {h.n}
                </span>
                <div
                  className={cn(
                    "rounded-xl border px-3.5 py-3",
                    h.crown
                      ? "border-[#FF6B63]/45 bg-[#FF6B63]/[0.07]"
                      : "border-white/10 bg-[#18243D]",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider text-[#7C8CA8]">
                          {h.kind}
                        </span>
                        <span className="text-[10px] font-semibold" style={{ color: h.dot }}>
                          {h.role}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-white truncate">{h.id}</div>
                    </div>
                    <span className="shrink-0 text-[10px] font-mono text-[#8FA0BC]">{h.tag}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-[#9FB0CC]">{h.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The payoff: the cut, and the number. */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-[#7C8CA8]">
              Estimated exposure
            </div>
            <div className="font-display font-black text-3xl text-white tracking-tight">
              $2.1M–$6.4M
            </div>
          </div>
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-lg border border-[#34D399]/30 bg-[#34D399]/10 px-2.5 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
              <span className="text-[11px] font-semibold text-[#34D399]">
                Disable IMDSv1 — cuts all 3 paths
              </span>
            </div>
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
