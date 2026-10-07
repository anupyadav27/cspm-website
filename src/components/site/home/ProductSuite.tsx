import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, BookOpen, Check, FileSearch, ListChecks, Lock, Power } from "lucide-react";
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
 * Platform homepage sections built on src/data/product-suite.ts, plus SuiteStrip,
 * which every product page uses to show where it sits in the platform.
 *
 * Product illustrations are public/images/products/*.svg (scripts/generate-product-art.mjs):
 * one isometric template, so the five read as a set.
 */

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
 * One panel per product. Tabs, not five stacked sections: a buyer compares the
 * products against each other, and the tab row keeps all five names in view while
 * one is open. All panels render (hidden ones with `hidden`) so every product's copy
 * is in the HTML for search engines and for no-JS readers.
 */
export function ProductSuite() {
  const [active, setActive] = useState<SuiteKey>("estate");

  return (
    <section id="products" className="py-24 bg-white border-b border-[#E5E9F0] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <div className="text-[11px] uppercase tracking-widest font-semibold text-[#2563EB]">
            The products
          </div>
          <h2 className="mt-3 font-display font-black text-[#0B1220] text-3xl md:text-[44px] tracking-tight leading-[1.08] text-balance">
            Four products, one inventory — and AI agents across all of them.
          </h2>
          <p className="mt-4 text-lg text-[#475569] leading-relaxed">
            Each product answers one question a team already asks. Buy the one you need today; the
            others work from the same discovery the day you add them.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Onam products"
          className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-1.5 rounded-2xl bg-[#F1F5FB] border border-[#E5E9F0]"
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
                  p.key === "aiops" && "col-span-2 sm:col-span-1",
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
                With Onam AIOps:
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
            alt={p.imageAlt}
            width={640}
            height={420}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <p className="absolute bottom-3 right-4 text-[11px] text-[#64748B]">Illustrative</p>
        </div>
      </div>
    </div>
  );
}

/* ============================ AIOPS SPOTLIGHT ============================
 * The highlight the platform story leads to. Statuses come from operations.ts and
 * are shown on every line: Asset and Security agents are early access; the FinOps and
 * DR agents are roadmap, and saying so is what makes the rest believable.
 */
export function AIOpsSpotlight() {
  const ai = getSuite("aiops");
  const perProduct = SUITE.filter((s) => s.agent);
  const cases = OPS_USE_CASES.filter((u) => u.status === "early").slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-[#0B1220] border-b border-[#1E293B]">
      <div className="pointer-events-none absolute -top-48 right-[-10%] w-[760px] h-[560px] rounded-full bg-[#4F46E5]/25 blur-[160px]" />
      <div className="pointer-events-none absolute bottom-[-30%] left-[-10%] w-[560px] h-[460px] rounded-full bg-[#2563EB]/15 blur-[150px]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-24">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#A5B4FC]">
                Onam AIOps
              </span>
              <StatusBadge status="early" />
            </div>
            <h2 className="mt-4 font-display font-black text-white text-3xl md:text-5xl tracking-tight leading-[1.06] text-balance">
              AI agents that do the investigation.{" "}
              <span className="text-[#A5B4FC]">People make the call.</span>
            </h2>
            <p className="mt-5 text-lg text-[#CBD5E1] leading-relaxed max-w-xl">{ai.blurb}</p>

            <ul className="mt-8 grid sm:grid-cols-2 gap-3">
              {(
                [
                  [
                    ListChecks,
                    "A plan you can see",
                    "Which agent does what, in which order — before it runs.",
                  ],
                  [
                    FileSearch,
                    "Evidence on every claim",
                    "Each number links to the query and scan behind it.",
                  ],
                  [
                    Lock,
                    "A person approves every change",
                    "Diff first, rollback shown, bound to that exact change.",
                  ],
                  [
                    Power,
                    "A kill switch and a ceiling",
                    "Autonomy is capped per organisation and can be stopped.",
                  ],
                ] as const
              ).map(([Icon, t, b]) => (
                <li
                  key={t}
                  className="flex gap-3 rounded-2xl border border-[#1E293B] bg-[#111A2E] p-4"
                >
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#A5B4FC]" />
                  <div>
                    <div className="font-semibold text-white text-[15px]">{t}</div>
                    <div className="mt-0.5 text-[13.5px] text-[#94A3B8]">{b}</div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/platform/ai-operations"
                className="inline-flex items-center gap-2 rounded-[10px] bg-[#4F46E5] px-5 py-3 text-[15px] font-semibold text-white transition hover:bg-[#4338CA]"
              >
                Meet the agents <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/request-demo"
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
            <div className="mt-4 rounded-2xl border border-[#1E293B] bg-[#111A2E] p-5">
              <div className="text-[11px] uppercase tracking-widest font-semibold text-[#94A3B8]">
                One agent per product
              </div>
              <ul className="mt-3 divide-y divide-[#1E293B]">
                {perProduct.map((p) => (
                  <li key={p.key} className="flex items-center justify-between gap-3 py-2.5">
                    <Link to={p.agent!.href} className="min-w-0 group">
                      <span className="block text-sm font-semibold text-white group-hover:text-[#A5B4FC] transition">
                        {p.agent!.name}
                      </span>
                      <span className="block text-xs text-[#94A3B8]">works on {p.name}</span>
                    </Link>
                    <StatusBadge status={p.agent!.status} />
                  </li>
                ))}
              </ul>
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
      t: "One discovery",
      b: "Cloud accounts are connected once. Every product reads the inventory Onam Estate keeps current, so the four never disagree about what exists.",
    },
    {
      t: "One console, one login",
      b: "Estate, Security, FinOps, DRM and the AIOps workspace run in the same console, behind the same login.",
    },
    {
      t: "Read-only by default",
      b: "Posture and inventory come through read-only cloud roles. Nothing changes your cloud unless a person approves it.",
    },
    {
      t: "Buy what you need",
      b: "Onam Security comes in Free, Pro and Enterprise. Estate, FinOps and DRM are added per organisation.",
    },
  ];
  return (
    <section className="py-24 bg-[#F7F9FC] border-b border-[#E5E9F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <div className="text-[11px] uppercase tracking-widest font-semibold text-[#2563EB]">
            One platform
          </div>
          <h2 className="mt-3 font-display font-black text-[#0B1220] text-3xl md:text-[44px] tracking-tight leading-[1.08] text-balance">
            Built once, underneath every product.
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
 * The closing "rest of the platform" band on every product page: the same five
 * cards and illustrations as the homepage, with the current product marked.
 */
export function SuiteStrip({ current }: { current: SuiteKey }) {
  return (
    <section className="py-20 bg-[#F7F9FC] border-y border-[#E5E9F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-[11px] uppercase tracking-widest text-[#64748B] font-semibold">
            The rest of the platform
          </div>
          <h2 className="mt-3 font-display font-extrabold text-[#0B1220] text-3xl tracking-tight">
            {getSuite(current).name} is one part of one platform.
          </h2>
          <p className="mt-3 text-[#475569]">
            Estate finds what you run, Security protects it, FinOps explains what it costs and DRM
            plans how it comes back — with Onam AIOps agents across them, on the same discovery.
          </p>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                      : "border-[#E5E9F0] hover:shadow-[0_12px_28px_rgba(16,24,40,.10)] hover:-translate-y-0.5",
                  )}
                >
                  <img
                    src={p.image}
                    alt=""
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
