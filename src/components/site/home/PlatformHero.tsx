import { AppWindow, ArrowDown, ArrowRight, Bot, Cloud, FileCode2, Play, Shield, ShieldHalf } from "@/components/site/icons";
import { BrandButton } from "@/components/site/BrandButton";
import { Backdrop } from "@/components/site/system";
import { CLOUDS } from "@/lib/product-facts";
import { cn } from "@/lib/utils";

/**
 * Homepage top: the hero and the Onam Security spotlight (the priced attack path, used
 * as the /platform hero). Kept out of routes/index.tsx so the page file stays a list of
 * sections.
 */

/* ============================ HERO ============================
 * Owner decision 17 Nov 2026: Onam is Onam Security — cloud, SaaS and code security —
 * with Onam AI, the AI security analyst. Estate, FinOps and DRM are retired.
 *
 * Dark and single-column on purpose. The layered platform picture (PlatformLayers) sits
 * directly under it and IS the hero visual.
 *
 * Colours are the brand's dark theme, already checked against #0B1220 for WCAG AA
 * (blue_lt #4D8DFF 5.86:1, sub_dk #9FB0CC 8.52:1).
 */
/** What Onam sells, in the order of src/data/pricing.ts, plus Onam AI. */
const HERO_LINES = [
  { label: "Cloud security", Icon: Cloud, color: "#2563EB" },
  { label: "SaaS security", Icon: AppWindow, color: "#8B5CF6" },
  { label: "Code security", Icon: FileCode2, color: "#0891B2" },
  { label: "Onam AI", Icon: Bot, color: "#4F46E5" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0B1220]">
      <Backdrop tone="night" color="#2563EB" pattern="grid" />
      {/* Settle to flat night so the hero meets the dark top band of the platform overview without a seam. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-[linear-gradient(180deg,transparent_0%,#0B1220_62%)]" aria-hidden />

      <div className="relative max-w-5xl mx-auto px-6 pt-14 md:pt-20 pb-28 md:pb-36 text-center animate-slide-up">
        <ul className="inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium text-[#C7D2E4]">
          {HERO_LINES.map(({ label, Icon, color }) => (
            <li key={label} className="inline-flex items-center gap-1.5">
              <Icon className="w-[18px] h-[18px]" style={{ color: `color-mix(in srgb, ${color} 55%, #FFFFFF)` }} />
              {label}
            </li>
          ))}
        </ul>

        {/* Conversion audit F6 (27 Nov 2026): the H1 says the outcome, not the product list, and
            makes no claim that needs a number. */}
        <h1 className="mt-6 font-display font-black text-white text-[40px] leading-[1.05] sm:text-5xl md:text-6xl lg:text-[68px] tracking-tight md:leading-[1.02] text-balance">
          Find what's exposed in your cloud and{" "}
          <span className="text-[#4D8DFF]">fix the risks that matter first.</span>
        </h1>

        <p className="mt-6 text-lg text-[#9FB0CC] leading-relaxed max-w-2xl mx-auto text-pretty">
          For teams on AWS, Azure, Google Cloud, Oracle Cloud, Alibaba Cloud or IBM Cloud. Onam ranks
          what an attacker could actually use and shows the fix. Onam AI, your AI security analyst, answers
          questions about your findings.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <BrandButton to="/start-free" search={{ from: "/" }} size="lg">
            Start free <ArrowRight className="w-4 h-4" />
          </BrandButton>
          <BrandButton to="/request-demo" search={{ from: "/" }} size="lg" variant="onDark">
            Book a demo
          </BrandButton>
        </div>
        <p className="mt-4 text-sm text-[#9FB0CC]">
          Free for up to 25 units, with read-only scanning. No card.{" "}
          <a href="/pricing" className="font-semibold text-white underline-offset-4 hover:underline">
            See pricing
          </a>{" "}
          ·{" "}
          <a href="#platform" className="inline-flex items-center gap-1 font-semibold text-white underline-offset-4 hover:underline">
            How it fits together <ArrowDown className="w-3.5 h-3.5" />
          </a>
        </p>
      </div>
    </section>
  );
}

/* ============================ SECURITY SPOTLIGHT ============================
 * Security is still the biggest product, so it gets the first deep section — and the
 * priced attack path that used to be the hero visual. Copy is the former hero's,
 * re-scoped to Onam Security.
 */
/** `asHero`: the top of /platform — the heading becomes the page's h1 and the primary
 *  button asks for a demo instead of linking to the page the reader is already on. */
export function SecuritySpotlight({ asHero = false }: { asHero?: boolean } = {}) {
  const Heading = asHero ? "h1" : "h2";
  return (
    <section className="relative overflow-hidden bg-[#0B1220]">
      <Backdrop tone="night" color="#2563EB" pattern="graph" />
      <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-12 items-center">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider bg-white/[0.06] border border-white/10">
            <ShieldHalf className="w-3.5 h-3.5 text-[#4D8DFF]" />
            <span className="text-[#9FB0CC] uppercase">Onam Security</span>
          </div>
          <Heading className="mt-6 font-display font-black text-white text-4xl md:text-5xl tracking-tight leading-[1.05] text-balance">
            Find the misconfigurations and identity risks that{" "}
            <span className="text-[#4D8DFF]">lead to your data.</span>
          </Heading>
          <p className="mt-6 text-lg text-[#9FB0CC] leading-relaxed max-w-xl">
            Onam Security links misconfigurations, identity risks and attack paths across{" "}
            {CLOUDS} clouds, then puts an estimated cost on the route an attacker would take. It
            covers CSPM, CIEM, DSPM, workloads, SaaS, code security, attack paths and detection, from
            one inventory of your accounts.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <BrandButton
              to={asHero ? "/start-free" : "/platform"}
              search={asHero ? { from: "/" } : undefined}
              size="lg"
            >
              {asHero ? "Start free" : "Explore Onam Security"} <ArrowRight className="w-4 h-4" />
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
      note: "IMDSv1 enabled, so credentials are readable from the instance",
      tag: "T1552.005",
      dot: "#4D8DFF",
      role: "Entry point",
    },
    {
      n: 2,
      kind: "IAM role",
      id: "OpsAdminRole",
      note: "iam:PassRole:* lets it escalate to any role in the account",
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
              Attack path to customer data
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
                Disable IMDSv1: cuts all 3 paths
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Required by the marketing guardrails: demo-tenant numbers are
          illustrations and are never presented as customer outcomes. */}
      <p className="mt-3 text-[11px] text-[#7C8CA8] text-center">
        Illustrative, from a demo tenant. FAIR-based range, not a customer result.
      </p>
    </div>
  );
}
