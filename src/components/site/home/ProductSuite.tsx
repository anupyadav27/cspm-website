import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, BookOpen, Check } from "@/components/site/icons";
import { cn } from "@/lib/utils";
import {
  SUITE,
  getSuite,
  AIOPS_COLOR,
  type SuiteKey,
  type SuiteProduct,
} from "@/data/product-suite";
import { OPS_USE_CASES } from "@/data/operations";
import { StatusBadge } from "@/components/site/ops/OpsUi";

/**
 * Homepage sections built on src/data/product-suite.ts, plus SuiteStrip, which the
 * Onam Security and Onam AI pages use to point at each other.
 *
 * Pictures: a real, redacted console capture for Security (public/screens/cnapp), a flat
 * console-style drawing for Onam AI (public/images/products/onam-ai.svg). Each carries its
 * provenance label from product-suite.ts (imageLabel); never infer it from the file type.
 */

/** Real captures in public/screens/ ship a @2x WebP beside the 1x file. */
function hidpiSrcSet(src: string): string | undefined {
  return src.startsWith("/screens/") && src.endsWith(".webp")
    ? `${src} 1x, ${src.replace(/\.webp$/, "@2x.webp")} 2x`
    : undefined;
}

function IconTile({ p, size = "md" }: { p: SuiteProduct; size?: "sm" | "md" }) {
  const Icon = p.icon;
  return (
    <span
      className={cn(
        "shrink-0 rounded-xl grid place-items-center",
        size === "sm" ? "w-8 h-8" : "w-10 h-10",
      )}
      style={{
        backgroundColor: `color-mix(in srgb, ${p.color} 12%, #FFFFFF)`,
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${p.color} 22%, transparent)`,
      }}
    >
      <Icon className={size === "sm" ? "w-4 h-4" : "w-5 h-5"} style={{ color: p.color }} />
    </span>
  );
}

/* ============================ PRODUCT SUITE (tabs) ============================
 * One panel each for Onam Security and Onam AI. Tabs keep both names in view while
 * one is open. All panels render (hidden ones with `hidden`) so every product's copy
 * is in the HTML for search engines and for no-JS readers.
 */
export function ProductSuite() {
  const [active, setActive] = useState<SuiteKey>("security");

  return (
    <section id="products" className="py-24 bg-white border-b border-[#E5E9F0] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <div className="text-sm font-semibold text-[#1D4ED8]">
            What you get
          </div>
          <h2 className="mt-3 font-display font-black text-[#0B1220] text-3xl md:text-[44px] tracking-tight leading-[1.08] text-balance">
            Onam Security finds the risk. Onam AI helps you work through it.
          </h2>
          <p className="mt-4 text-lg text-[#475569] leading-relaxed">
            Cloud, SaaS and code security on one security graph, and an AI security analyst that
            answers from your own findings.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Onam products"
          className="mt-10 grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#F1F5FB] border border-[#E5E9F0]"
        >
          {SUITE.map((p) => {
            const on = p.key === active;
            return (
              <button
                key={p.key}
                role="tab"
                id={`tab-${p.key}`}
                aria-selected={on}
                aria-controls={`panel-${p.key}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(p.key)}
                onKeyDown={(e) => {
                  // WAI-ARIA tabs: arrows move between tabs, Home/End jump to the ends.
                  const i = SUITE.findIndex((x) => x.key === p.key);
                  const next =
                    e.key === "ArrowRight" ? (i + 1) % SUITE.length
                    : e.key === "ArrowLeft" ? (i - 1 + SUITE.length) % SUITE.length
                    : e.key === "Home" ? 0
                    : e.key === "End" ? SUITE.length - 1
                    : -1;
                  if (next < 0) return;
                  e.preventDefault();
                  setActive(SUITE[next].key);
                  document.getElementById(`tab-${SUITE[next].key}`)?.focus();
                }}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                  on ? "bg-white shadow-[0_4px_14px_rgba(16,24,40,.10)]" : "hover:bg-white/60",
                )}
              >
                <IconTile p={p} size="sm" />
                <span className="min-w-0">
                  <span className="block text-[11px] uppercase tracking-wider font-semibold text-[#64748B]">
                    {p.stage}
                  </span>
                  <span
                    className={cn(
                      "block text-sm font-bold truncate",
                      on ? "text-[#0B1220]" : "text-[#334155]",
                    )}
                  >
                    {p.name}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {SUITE.map((p) => (
          <SuitePanel key={p.key} p={p} hidden={p.key !== active} />
        ))}
      </div>
    </section>
  );
}

function SuitePanel({ p, hidden }: { p: SuiteProduct; hidden: boolean }) {
  // Security has five engine groups; the panel shows each group's first entries and
  // the product page carries the full list.
  const groups = p.groups.map((g) => ({
    ...g,
    items: p.key === "security" ? g.items.slice(0, 3) : g.items,
  }));
  return (
    <div
      role="tabpanel"
      id={`panel-${p.key}`}
      aria-labelledby={`tab-${p.key}`}
      hidden={hidden}
      className="mt-6 rounded-3xl border border-[#E5E9F0] bg-[#F7F9FC] overflow-hidden"
    >
      <div className="grid lg:grid-cols-[1fr_1.05fr]">
        <div className="p-6 sm:p-10 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-[11px] uppercase tracking-widest font-bold"
              style={{ color: p.color }}
            >
              {p.name}
            </span>
            {p.badge && <StatusBadge status="early" />}
          </div>
          <h3 className="mt-3 font-display font-extrabold text-[#0B1220] text-2xl md:text-[30px] tracking-tight leading-tight text-balance">
            {p.question}
          </h3>
          <p className="mt-4 text-[#475569] leading-relaxed">{p.blurb}</p>

          <div
            className={cn("mt-7 grid gap-x-6 gap-y-5", groups.length > 2 ? "sm:grid-cols-2" : "")}
          >
            {groups.map((g) => (
              <div key={g.heading} className="min-w-0">
                <div className="text-[11px] uppercase tracking-widest font-semibold text-[#64748B] mb-2">
                  {g.heading}
                </div>
                <ul
                  className={cn(
                    "grid gap-2",
                    groups.length <= 2 && g.items.length > 3 && "sm:grid-cols-2",
                  )}
                >
                  {g.items.map((m) => (
                    <li key={m.title + m.href}>
                      <Link to={m.href} className="group flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: p.color }} />
                        <span className="min-w-0">
                          <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#0B1220] group-hover:text-[#2563EB] transition">
                            {m.title}
                            {m.status && m.status !== "early" && <StatusBadge status={m.status} />}
                          </span>
                          <span className="block text-[13px] text-[#64748B] leading-snug">
                            {m.desc}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {p.agent && (
            <Link
              to={p.agent.href}
              className="mt-7 flex flex-wrap items-center gap-2 rounded-xl border border-[#E0E7FF] bg-white px-4 py-3 text-sm hover:border-[#C7D2FE] transition"
            >
              <span className="font-semibold" style={{ color: AIOPS_COLOR }}>
                Ask it with
              </span>
              <span className="text-[#0B1220] font-semibold">{p.agent.name}</span>
              <StatusBadge status={p.agent.status} />
            </Link>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to={p.href}
              className="inline-flex items-center gap-2 rounded-[10px] bg-[#2563EB] px-5 py-3 text-[15px] font-semibold text-white transition hover:bg-[#1D4ED8]"
            >
              Explore {p.name} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to={p.docs}
              className="inline-flex items-center gap-2 rounded-[10px] border border-[#CBD5E1] bg-white px-5 py-3 text-[15px] font-semibold text-[#0B1220] transition hover:border-[#94A3B8]"
            >
              <BookOpen className="h-4 w-4" /> Documentation
            </Link>
          </div>
        </div>

        <div className="relative min-h-[260px] border-t lg:border-t-0 lg:border-l border-[#E5E9F0] bg-white">
          <img
            src={p.image}
            srcSet={hidpiSrcSet(p.image)}
            alt={p.imageAlt}
            width={640}
            height={420}
            loading="lazy"
            className={cn("w-full h-full", p.image.endsWith(".svg") ? "object-contain bg-[#F7F9FC]" : "object-cover object-[0%_8%]")}
          />
          <p className="absolute bottom-3 left-4 right-4 rounded bg-white/90 px-1.5 py-0.5 text-[11px] leading-snug text-[#64748B] sm:left-auto sm:max-w-[340px]">
            {p.imageLabel}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================ ONAM AI SPOTLIGHT ============================
 * Onam AI, the AI security analyst. Statuses come from operations.ts and are shown on
 * every line; saying what is not ready yet is what makes the rest believable.
 */
export function OnamAiSpotlight() {
  const ai = getSuite("aiops");
  const cases = OPS_USE_CASES.filter((u) => u.status === "early").slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-[#0B1220] border-b border-[#1E293B]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-24">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#A5B4FC]">
                Onam AI
              </span>
              <StatusBadge status="early" />
            </div>
            <h2 className="mt-4 font-display font-black text-white text-3xl md:text-5xl tracking-tight leading-[1.06] text-balance">
              Your AI security analyst.{" "}
              <span className="text-[#A5B4FC]">People make the call.</span>
            </h2>
            <p className="mt-5 text-lg text-[#CBD5E1] leading-relaxed max-w-xl">{ai.blurb}</p>

            <ol className="mt-8 space-y-3 list-decimal pl-5 marker:text-[#A5B4FC] marker:font-semibold text-[15px] text-[#CBD5E1] leading-relaxed max-w-xl">
              {(
                [
                  [
                    "Ask in plain language.",
                    "About findings, attack paths and data security, from your own Onam Security data.",
                  ],
                  ["Numbers come with evidence.", "Each one links to the query and scan behind it."],
                  ["Sensitive values stay masked.", "Secrets, keys and data values are not shown in answers."],
                  [
                    "It suggests; a person approves.",
                    "You see the diff and the rollback first, and the approval covers only that change.",
                  ],
                  [
                    "It can be stopped.",
                    "Autonomy is capped per organisation, and there is a kill switch.",
                  ],
                ] as const
              ).map(([t, b]) => (
                <li key={t} className="pl-1">
                  <span className="font-semibold text-white">{t}</span> {b}
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/onam-ai"
                className="inline-flex items-center gap-2 rounded-[10px] bg-[#4F46E5] px-5 py-3 text-[15px] font-semibold text-white transition hover:bg-[#4338CA]"
              >
                Meet Onam AI <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/request-demo"
                search={{ product: "aiops" }}
                className="inline-flex items-center gap-2 rounded-[10px] border border-[#334155] px-5 py-3 text-[15px] font-semibold text-white transition hover:border-[#64748B]"
              >
                Ask for early access
              </Link>
            </div>
          </div>

          <div className="min-w-0">
            <div className="rounded-3xl overflow-hidden border border-white/10 bg-white shadow-[0_30px_80px_rgba(0,0,0,.45)]">
              <img
                src={ai.image}
                alt={ai.imageAlt}
                width={640}
                height={420}
                loading="lazy"
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="mt-14">
          <div className="text-[11px] uppercase tracking-widest font-semibold text-[#94A3B8]">
            What teams ask it today
          </div>
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            {cases.map((u) => (
              <div key={u.title} className="rounded-2xl border border-[#1E293B] bg-[#0F1729] p-5">
                <div className="text-[15px] font-semibold text-white">{u.title}</div>
                <p className="mt-2 text-sm text-[#CBD5E1] italic">“{u.ask}”</p>
                <p className="mt-3 text-[13px] text-[#94A3B8] leading-relaxed">{u.outcome}</p>
                <div className="mt-4 pt-3 border-t border-[#1E293B] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[#A5B4FC] font-mono">{u.agents}</span>
                  <span className="text-[#94A3B8]">{u.approval}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================ ONE FOUNDATION ============================ */
export function OneFoundation() {
  const items = [
    {
      t: "One security graph",
      b: "Cloud accounts, SaaS platforms and code are connected once. Every engine writes to the same graph, so an attack path can cross clouds and a finding links to everything it touches.",
    },
    {
      t: "One console, one login",
      b: "Cloud, SaaS and code security and the Onam AI workspace run in the same console, behind the same login.",
    },
    {
      t: "Read-only by default",
      b: "Posture and inventory come through read-only cloud roles. Nothing changes your cloud unless a person approves it.",
    },
    {
      t: "Published prices",
      b: "Priced per unit for cloud and SaaS and per developer for code, with a free one-time audit scan first.",
    },
  ];
  return (
    <section className="py-24 bg-[#F7F9FC] border-b border-[#E5E9F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <div className="text-sm font-semibold text-[#1D4ED8]">
            One platform
          </div>
          <h2 className="mt-3 font-display font-black text-[#0B1220] text-3xl md:text-[44px] tracking-tight leading-[1.08] text-balance">
            What every part of Onam shares.
          </h2>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((i, n) => (
            <div key={i.t} className="rounded-2xl bg-white border border-[#E5E9F0] p-6">
              <div className="font-mono text-xs text-[#2563EB]">0{n + 1}</div>
              <div className="mt-3 font-display font-bold text-lg text-[#0B1220]">{i.t}</div>
              <p className="mt-2 text-sm text-[#475569] leading-relaxed">{i.b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ SUITE STRIP ============================
 * The closing band on the Onam Security and Onam AI pages: both cards, with the
 * current one marked.
 */
export function SuiteStrip({ current }: { current: SuiteKey }) {
  return (
    <section className="py-20 bg-[#F7F9FC] border-y border-[#E5E9F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-[11px] uppercase tracking-widest text-[#64748B] font-semibold">
            Onam
          </div>
          <h2 className="mt-3 font-display font-extrabold text-[#0B1220] text-3xl tracking-tight">
            {getSuite(current).name} works with {getSuite(current === "aiops" ? "security" : "aiops").name}.
          </h2>
          <p className="mt-3 text-[#475569]">
            Onam Security finds and ranks risk across cloud, SaaS and code. Onam AI, your AI
            security analyst, answers questions about those findings and suggests fixes.
          </p>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {SUITE.map((p) => {
            const here = p.key === current;
            return (
              <Link
                key={p.key}
                to={p.href}
                className="group"
                aria-current={here ? "page" : undefined}
              >
                <div
                  className={cn(
                    "h-full bg-white border rounded-2xl overflow-hidden transition-all",
                    here
                      ? "border-[#C7D7FE] shadow-[0_0_0_3px_rgba(37,99,235,.08)]"
                      : "border-[#E5E9F0] hover:shadow-[0_12px_28px_rgba(16,24,40,.10)]",
                  )}
                >
                  <img
                    src={p.image}
                    srcSet={hidpiSrcSet(p.image)}
                    alt={p.imageAlt}
                    width={640}
                    height={420}
                    loading="lazy"
                    className="w-full aspect-[16/10] object-cover border-b border-[#E5E9F0]"
                  />
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-[#64748B]">
                        {p.stage}
                      </span>
                      {here ? (
                        <span className="text-[11px] uppercase tracking-widest font-bold text-[#1D4ED8]">
                          You are here
                        </span>
                      ) : (
                        p.badge && <StatusBadge status="early" />
                      )}
                    </div>
                    <div className="mt-1.5 font-display font-bold text-[#0B1220] group-hover:text-[#2563EB] transition">
                      {p.name}
                    </div>
                    <p className="mt-2 text-[13px] text-[#64748B] leading-snug">{p.question}</p>
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
