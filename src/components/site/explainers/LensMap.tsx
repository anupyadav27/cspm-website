import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Box,
  CheckCircle2,
  Circle,
  Cpu,
  Database,
  FileCode2,
  KeyRound,
  LockOpen,
  Server,
  X,
} from "@/components/site/icons";
import {
  AI_ESTATE,
  FRAMEWORKS,
  GUARDRAIL_LINE,
  LANES,
  LENSES,
  type EstateCheck,
  type EstateNode,
  type Lens,
  type Status,
} from "@/data/explainers/ai-estate";

/**
 * :::lensmap ai-estate
 * :::
 *
 * The AI estate map: an illustrative estate in three lanes, seen through three lenses
 * (What you run · What's exposed · What it reaches). Pick any item to see what Onam checks
 * on it and where to read more. Everything is server-rendered: the lens content for every
 * node is in the HTML, and a plain table equivalent sits in a <details> under the map.
 * Default lens is "What's exposed", so the open model server is the first thing seen.
 */

const STATUS: Record<Status, { ring: string; chip: string; Icon: typeof Circle; word: string }> = {
  found: { ring: "ring-[#4D8DFF]/50", chip: "bg-[#4D8DFF]/15 text-[#BFD3FF]", Icon: CheckCircle2, word: "Found" },
  ok: { ring: "ring-[#34D399]/60", chip: "bg-[#34D399]/15 text-[#A7F3D0]", Icon: CheckCircle2, word: "OK" },
  warn: { ring: "ring-[#FBBF24]/70", chip: "bg-[#FBBF24]/15 text-[#FDE68A]", Icon: AlertTriangle, word: "Finding" },
  critical: { ring: "ring-[#F87171]", chip: "bg-[#F87171]/20 text-[#FECACA]", Icon: LockOpen, word: "Critical finding" },
};

function nodeIcon(n: EstateNode) {
  if (n.lane === "software") return FileCode2;
  if (/vector|database/i.test(n.type)) return Database;
  if (/agent/i.test(n.type)) return Bot;
  if (n.lane === "k8s") return Server;
  if (/notebook/i.test(n.type)) return Box;
  return Cpu;
}

/** The badge a node shows under a lens, if any. */
function badgeFor(n: EstateNode, lens: Lens): EstateCheck | null {
  if (lens === "run") return null;
  if (lens === "exposed") return n.exposed ?? null;
  return n.runsAs?.check ?? null;
}

function Badge({ c }: { c: EstateCheck }) {
  const s = STATUS[c.status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-semibold leading-[18px] ${s.chip}`}>
      <s.Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {c.label}
    </span>
  );
}

function ReachChips({ n }: { n: EstateNode }) {
  if (n.ingredients)
    return (
      <span className="flex flex-wrap gap-1">
        {n.ingredients.map((i) => (
          <span key={i} className="rounded-full bg-white/8 px-2 py-0.5 text-[12px] font-semibold text-[#DCE6F7] ring-1 ring-white/15">
            {i}
          </span>
        ))}
      </span>
    );
  if (!n.runsAs && !n.reads)
    return n.reachNote ? (
      <span className="text-[12px] italic text-on-night-muted">{n.reachNote}</span>
    ) : (
      <span className="text-[12px] text-on-night-muted">No identity or data link in this example.</span>
    );
  return (
    <span className="flex flex-wrap gap-1">
      {n.runsAs && (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#C7D2E4]/12 px-2 py-0.5 text-[12px] font-semibold text-[#E2E8F0]">
          <KeyRound className="h-3.5 w-3.5" aria-hidden /> runs as <span className="font-mono font-medium">{n.runsAs.name}</span>
        </span>
      )}
      {n.reads && (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#38BDF8]/15 px-2 py-0.5 text-[12px] font-semibold text-[#BAE6FD]">
          <Database className="h-3.5 w-3.5" aria-hidden /> reads <span className="font-mono font-medium">{n.reads.name}</span>
        </span>
      )}
    </span>
  );
}

function CheckRow({ c }: { c: EstateCheck }) {
  const s = STATUS[c.status];
  return (
    <li className="flex gap-3">
      <s.Icon className="mt-0.5 h-4 w-4 shrink-0 text-white" aria-hidden />
      <div>
        <div className="text-[14px] font-semibold text-white">
          <span className="sr-only">{s.word}: </span>
          {c.label}
        </div>
        <div className="text-[14px] leading-[22px] text-on-night-muted">{c.meaning}</div>
        {c.mapped && (
          <div className="mt-1 text-[12px] text-on-night-muted">
            Maps to: {FRAMEWORKS}{" "}
            <a href="/docs/ai-security/compliance" className="underline decoration-white/30 underline-offset-2 hover:text-white">
              (mapped, not full coverage)
            </a>
          </div>
        )}
      </div>
    </li>
  );
}

function Panel({ n, onClose, headingRef }: { n: EstateNode; onClose: () => void; headingRef: React.RefObject<HTMLHeadingElement | null> }) {
  const checks: EstateCheck[] = [];
  if (n.exposed) checks.push(n.exposed);
  if (n.runsAs?.check) checks.push(n.runsAs.check);
  const guardrail = n.exposed && /guardrail|filter|armor/i.test(n.exposed.label);
  return (
    <div className="relative rounded-xl bg-night p-4 ring-1 ring-white/10">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-lg text-on-night-muted hover:bg-white/10 hover:text-white"
        aria-label="Close details"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
      <div className="text-[12px] font-semibold uppercase tracking-[0.1em] text-on-night-muted">
        {n.type} · {n.where}
      </div>
      <h4 ref={headingRef} tabIndex={-1} aria-live="polite" className="mt-1 font-mono text-[15px] font-semibold text-white outline-none">
        {n.name}
      </h4>
      <ul className="mt-3 space-y-3">
        <CheckRow c={{ status: "found", label: "In the AI inventory", meaning: inventoryMeaning(n), fact: "" }} />
        {checks.map((c) => (
          <CheckRow key={c.label} c={c} />
        ))}
      </ul>
      {guardrail && <p className="mt-3 text-[13px] italic text-on-night-muted">{GUARDRAIL_LINE}</p>}
      {(n.runsAs || n.reads || n.ingredients || n.reachNote) && (
        <div className="mt-3">
          <ReachChips n={n} />
        </div>
      )}
      <a
        href={n.deepLink.href}
        className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-[#8FB5FF] hover:text-white"
      >
        Read more: {n.deepLink.question} <ArrowRight className="h-4 w-4" aria-hidden />
      </a>
    </div>
  );
}

function inventoryMeaning(n: EstateNode) {
  if (n.lane === "software") return "Its AI components are read from the SBOM Onam already holds for it.";
  if (n.lane === "k8s") return "Recognised from the workload in a connected cluster, read-only.";
  return "Recorded by the posture scan through your read-only cloud role.";
}

export function LensMap() {
  const [lens, setLens] = useState<Lens>("exposed");
  const [sel, setSel] = useState<string | null>(null);
  const [entered, setEntered] = useState(false);
  const [armed, setArmed] = useState(false); // hide-then-animate only once JS runs; SSR shows everything
  const [tableOpen, setTableOpen] = useState(true); // open without JS; closed once hydrated
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lastNode = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setTableOpen(false);
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight && el.getBoundingClientRect().bottom > 0) {
      // Already on screen at hydration: play once from here.
      setArmed(true);
      requestAnimationFrame(() => setEntered(true));
      return;
    }
    setArmed(true);
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setEntered(true);
          io.disconnect();
        }
      },
      { threshold: 0 },
    );
    io.observe(el);
    // Never leave items hidden: play anyway after 4 s.
    const t = window.setTimeout(() => setEntered(true), 4000);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    if (sel) headingRef.current?.focus();
  }, [sel]);

  const selected = AI_ESTATE.find((n) => n.id === sel) ?? null;
  const lensIdx = LENSES.findIndex((l) => l.id === lens);

  function onTabKey(e: KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (lensIdx + (e.key === "ArrowRight" ? 1 : LENSES.length - 1)) % LENSES.length;
    setLens(LENSES[next].id);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  }

  function close() {
    setSel(null);
    lastNode.current?.focus();
  }

  return (
    <figure
      ref={rootRef}
      className={`ex-map rounded-2xl bg-night-2 p-3 ring-1 ring-white/10 shadow-[0_24px_64px_rgba(0,0,0,.35)] sm:p-4 ${armed ? "ex-armed" : ""} ${entered ? "ex-entered" : ""}`}
      onKeyDown={(e) => {
        if (e.key === "Escape" && sel) close();
      }}
    >
      <div className="flex items-center justify-between gap-3 px-1">
        <span className="text-[13px] font-bold text-white">AI estate</span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[12px] font-semibold text-on-night-muted">Illustrative</span>
      </div>

      <div role="tablist" aria-label="Look at the estate by" className="mt-2 grid grid-cols-3 gap-1 rounded-full bg-night p-1" onKeyDown={onTabKey}>
        {LENSES.map((l, i) => (
          <button
            key={l.id}
            id={`${id}-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={lens === l.id}
            aria-controls={`${id}-lanes`}
            tabIndex={lens === l.id ? 0 : -1}
            onClick={() => setLens(l.id)}
            className={`min-h-11 rounded-full px-2 text-[13px] font-semibold leading-[16px] transition-colors duration-200 ${
              lens === l.id ? "bg-[#4D8DFF]/20 text-white ring-2 ring-[#4D8DFF]" : "text-on-night-muted hover:text-white"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
      <p className="mt-1.5 px-1 text-[13px] text-on-night-muted" aria-live="polite">
        {LENSES[lensIdx].hint}
      </p>

      <div id={`${id}-lanes`} role="tabpanel" aria-labelledby={`${id}-tab-${lensIdx}`} className="mt-2 space-y-2.5">
        {LANES.map((lane) => {
          const nodes = AI_ESTATE.filter((n) => n.lane === lane.id);
          return (
            <div key={lane.id}>
              <div className="px-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-on-night-muted">{lane.label}</div>
              <ul aria-label={lane.label} className="mt-1.5 grid gap-1.5 sm:grid-cols-2">
                {nodes.map((n, i) => {
                  const b = badgeFor(n, lens);
                  const dim = lens === "exposed" && !b;
                  const Icon = nodeIcon(n);
                  const isSel = sel === n.id;
                  return (
                    <li key={n.id} className={lane.id === "software" ? "sm:col-span-2" : ""}>
                      <button
                        type="button"
                        aria-expanded={isSel}
                        aria-controls={`${id}-panel`}
                        onClick={(e) => {
                          lastNode.current = e.currentTarget;
                          setSel(isSel ? null : n.id);
                        }}
                        style={{ animationDelay: `${(LANES.findIndex((l) => l.id === lane.id) * 3 + i) * 90}ms` }}
                        className={`ex-node group flex min-h-11 w-full items-start gap-2.5 rounded-xl bg-night px-3 py-1.5 text-left ring-1 transition duration-200 hover:ring-2 hover:ring-[#4D8DFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4D8DFF] ${
                          isSel ? "ring-2 ring-[#4D8DFF]" : b ? STATUS[b.status].ring : "ring-white/10"
                        } ${dim ? "ex-dim" : ""}`}
                      >
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#8FB5FF]" aria-hidden />
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-baseline gap-x-2">
                            <span className="font-mono text-[13px] font-medium text-white">{n.name}</span>
                            <span className="text-[12px] text-on-night-muted">
                              {n.type} · {n.where}
                            </span>
                          </span>
                          <span className="mt-1 block">
                            {lens === "reaches" ? (
                              <ReachChips n={n} />
                            ) : b ? (
                              <span className="ex-stamp inline-block">
                                <Badge c={b} />
                              </span>
                            ) : lens === "run" ? (
                              <span className="text-[12px] text-on-night-muted">In the inventory</span>
                            ) : (
                              <span className="sr-only">Nothing flagged</span>
                            )}
                          </span>
                          {n.loophole && lens === "exposed" && (
                            <span className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-[#F87171]/10 px-1.5 py-0.5 text-[12px] font-semibold text-[#FECACA] ring-1 ring-dashed ring-[#F87171]/50">
                              Loophole: “testing, back Monday”
                            </span>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div id={`${id}-panel`} role="region" aria-label="Item details" className="mt-3">
        {selected ? (
          <Panel n={selected} onClose={close} headingRef={headingRef} />
        ) : (
          <p className="px-1 text-[13px] text-on-night-muted">Pick any item to see what Onam checks on it.</p>
        )}
      </div>

      <details
        open={tableOpen}
        onToggle={(e) => setTableOpen((e.target as HTMLDetailsElement).open)}
        className="mt-3 rounded-xl bg-night px-3 py-2 text-[13px] text-on-night-muted"
      >
        <summary className="cursor-pointer select-none font-semibold text-white">View as table</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <caption className="pb-2 text-left text-[12px]">Illustrative demo estate. Every check shown is one AI Security runs today.</caption>
            <thead>
              <tr className="text-white">
                <th className="py-1 pr-3 font-semibold">Resource</th>
                <th className="py-1 pr-3 font-semibold">Type</th>
                <th className="py-1 pr-3 font-semibold">What Onam flags</th>
                <th className="py-1 font-semibold">What it reaches</th>
              </tr>
            </thead>
            <tbody>
              {AI_ESTATE.map((n) => (
                <tr key={n.id} className="border-t border-white/10 align-top">
                  <td className="py-1.5 pr-3 font-mono text-white">{n.name}</td>
                  <td className="py-1.5 pr-3">
                    {n.type} ({n.where})
                  </td>
                  <td className="py-1.5 pr-3">
                    {[n.exposed?.label, n.runsAs?.check?.label].filter(Boolean).join("; ") || "Nothing (in the inventory)"}
                  </td>
                  <td className="py-1.5">
                    {n.ingredients
                      ? `AI ingredients: ${n.ingredients.join(", ")}`
                      : [n.runsAs && `runs as ${n.runsAs.name}`, n.reads && `reads ${n.reads.name} (${n.reads.store})`].filter(Boolean).join("; ") ||
                        n.reachNote ||
                        "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <figcaption className="mt-2 px-1 text-[12px] text-on-night-muted">
        Illustrative demo estate. Every check shown is one AI Security runs today.
      </figcaption>
    </figure>
  );
}
