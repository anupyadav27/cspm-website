import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Ban,
  Check,
  GitPullRequest,
  ListOrdered,
  ScrollText,
  ShieldCheck,
  Crosshair,
  Wand2,
  Terminal,
  TrendingDown,
  Users,
  type LucideIcon,
} from "@/components/site/icons";

/**
 * Onam AI on the homepage: the headline feature of the platform diagram (PlatformLayers.tsx).
 *
 * Built the way enterprise security vendors present their AI analysts:
 *   1. a promise in one line (from alert overload to the few fixes that matter);
 *   2. a noise-to-signal picture: every alert streams in, the AI core works through five steps,
 *      and only what needs a person comes out, with the reasoning shown (explainable AI);
 *   3. four benefits in plain words; 4. the guardrails (evidence, masking, a person approves);
 *   5. where the work lands: the ticket, then the customer's own coding agent in VS Code via MCP.
 *
 * Facts (threat-engine): AI review only labels likely false positives (secops_fix routers/triage.py);
 * Jira / ServiceNow tickets carry fix steps, commands and the AI fix prompt (bff/_ticket_content.py);
 * answers cite evidence and mask sensitive values; nothing changes without a person (product-suite.ts).
 * Example rows only: no counts, no customer data. Animations: ai-* in src/styles.css.
 */

export const STEPS: { name: string; icon: LucideIcon }[] = [
  { name: "Triage", icon: ListOrdered },
  { name: "Assign", icon: Users },
  { name: "False positives", icon: Ban },
  { name: "Focus", icon: Crosshair },
  { name: "Fix prompt", icon: ScrollText },
];

// The noisy stream going in. Generic examples only.
const STREAM: { t: string; c: string }[] = [
  { t: "Port 22 open to the internet", c: "#F97316" },
  { t: "Debug logging left on", c: "#94A3B8" },
  { t: "Old library in an image", c: "#EAB308" },
  { t: "Storage bucket open to the internet", c: "#DC2626" },
  { t: "Unused access key", c: "#EAB308" },
  { t: "Test key in a sample file", c: "#F97316" },
  { t: "Guest user with admin rights", c: "#F97316" },
  { t: "SQL injection in checkout", c: "#DC2626" },
  { t: "MFA off for a service user", c: "#F97316" },
  { t: "Log retention too short", c: "#94A3B8" },
  { t: "Wildcard IAM policy", c: "#F97316" },
  { t: "Outdated runtime on a function", c: "#EAB308" },
];

const WHY = ["Internet-facing", "On an attack path", "Customer data"];

export const BENEFITS: { icon: LucideIcon; title: string; color: string }[] = [
  {
    icon: TrendingDown,
    title: "Less noise",
    color: "#22D3EE",
  },
  {
    icon: ListOrdered,
    title: "Clear priorities",
    color: "#818CF8",
  },
  {
    icon: Users,
    title: "The right owner",
    color: "#C084FC",
  },
  {
    icon: GitPullRequest,
    title: "Faster fixes",
    color: "#4ADE80",
  },
];

export const GUARDS = [
  "Shows the evidence for every answer",
  "Masks sensitive values",
  "A person approves every change",
];

export const LANE: { icon: LucideIcon; title: string }[] = [
  { icon: ScrollText, title: "Jira or ServiceNow ticket" },
  { icon: Terminal, title: "VS Code agent via MCP" },
  { icon: Wand2, title: "Best fix for your code" },
  { icon: GitPullRequest, title: "You review and merge" },
];

/** The AI sparkle (the icon set's "Sparkles" is a lightbulb). */
export function AiMark({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M10 2.5c.6 3.9 2.6 5.9 6.5 6.5-3.9.6-5.9 2.6-6.5 6.5-.6-3.9-2.6-5.9-6.5-6.5 3.9-.6 5.9-2.6 6.5-6.5Z" />
      <path d="M18 13c.35 2.2 1.3 3.15 3.5 3.5-2.2.35-3.15 1.3-3.5 3.5-.35-2.2-1.3-3.15-3.5-3.5 2.2-.35 3.15-1.3 3.5-3.5Z" />
    </svg>
  );
}

export const GRAD = "linear-gradient(90deg,#22D3EE,#818CF8 45%,#C084FC)";

/** A short beam between the columns with light moving along it (lg and up). */
function Beam({ still }: { still: boolean }) {
  return (
    <div className="relative hidden w-10 self-center lg:block" aria-hidden>
      <div className="h-0.5 w-full rounded bg-white/15" />
      {!still &&
        [0, 0.7, 1.4].map((d) => (
          <span
            key={d}
            className="ai-packet absolute -top-[3px] h-2 w-2 rounded-full bg-[#A5B4FC] shadow-[0_0_10px_#A5B4FC]"
            style={{ animationDelay: `${d}s` }}
          />
        ))}
    </div>
  );
}

/** One of the three equal panels: same width, same height, header on top. */
function Panel({
  n,
  title,
  tone,
  children,
}: {
  n: number;
  title: string;
  tone: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl bg-white/[0.04] p-3.5 ring-1 ring-white/10">
      <div className="mb-3 flex items-center gap-2">
        <span
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[12px] font-bold text-night"
          style={{ background: tone }}
        >
          {n}
        </span>
        <span className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: tone }}>
          {title}
        </span>
      </div>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}

function Stream({ still }: { still: boolean }) {
  const rows = [...STREAM, ...STREAM];
  return (
    <div
      className="relative min-h-[240px] flex-1 overflow-hidden"
      style={{
        maskImage: "linear-gradient(180deg,transparent,#000 10%,#000 90%,transparent)",
        WebkitMaskImage: "linear-gradient(180deg,transparent,#000 10%,#000 90%,transparent)",
      }}
      aria-hidden
    >
      <ul className={`absolute inset-x-0 top-0 space-y-2 ${still ? "" : "ai-stream"}`}>
        {rows.map((r, k) => (
          <li
            key={k}
            className="flex items-center gap-2 rounded-lg bg-white/[0.06] px-2.5 py-2 text-[13px] text-[#CBD5E1]"
          >
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: r.c }} />
            <span className="truncate">{r.t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Core({ step, still }: { step: number; still: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-evenly gap-3">
      <div className="relative grid h-24 w-24 place-items-center" aria-hidden>
        <span
          className={`absolute inset-0 rounded-full ${still ? "" : "ai-spin"}`}
          style={{
            background: "conic-gradient(from 0deg,#22D3EE,#818CF8,#C084FC,#22D3EE)",
          }}
        />
        <span className="absolute inset-[3px] rounded-full bg-night" />
        {!still && <span className="ai-breathe absolute inset-3 rounded-full bg-[#6366F1]/25" />}
        <span className="relative flex flex-col items-center">
          <AiMark className="h-6 w-6 text-white" />
          <span className="mt-1 font-display text-[14px] font-extrabold text-white">Onam AI</span>
        </span>
      </div>
      <ol className="w-full space-y-1">
        {STEPS.map((s, k) => {
          const Icon = s.icon;
          const on = k === step && !still;
          const done = k < step || still;
          return (
            <li
              key={s.name}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[14px] font-semibold transition-all duration-500 ${
                on
                  ? "bg-[#4F46E5] text-white shadow-[0_0_0_4px_rgba(79,70,229,.28)]"
                  : done
                    ? "bg-white/[0.06] text-white"
                    : "bg-white/[0.03] text-[#94A3B8]"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{s.name}</span>
              {done && !on && <Check className="h-4 w-4 text-[#4ADE80]" />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/**
 * What reaches you: the noise on the left becomes a short focus list. Signal is bright (white cards),
 * everything else is quiet (dim rows). A meter shows the queue shrinking to what needs a person.
 * Steps: 0 triage (ranked, reasons), 1 assign (owners), 2 false positives set aside, 3 focus (the
 * meter shrinks), 4 fix prompt (tickets ready).
 */
export function FocusList({ step, still }: { step: number; still: boolean }) {
  const s = still ? 4 : step;
  const fade = (n: number): CSSProperties => ({
    opacity: s >= n ? 1 : 0.15,
    transition: "opacity .5s",
  });
  const card = (title: string, owner: string, why?: string[]) => (
    <div
      className={`rounded-xl bg-white px-3 py-2.5 text-ink transition-shadow duration-500 ${
        s >= 3 ? "shadow-[0_0_0_2px_#6366F1,0_10px_30px_rgba(99,102,241,.35)]" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="rounded-md bg-[#FDECEA] px-1.5 py-0.5 text-[12px] font-bold text-[#B42318] ring-1 ring-[#F5C2BD]">
          Critical
        </span>
        <span className="min-w-0 flex-1 text-[14px] font-bold leading-snug">{title}</span>
      </div>
      {why && (
        <div className="mt-2 flex flex-wrap gap-1">
          {why.map((w) => (
            <span
              key={w}
              className="inline-flex items-center gap-1 rounded-md bg-[#F0FDF4] px-1.5 py-0.5 text-[12px] font-semibold text-[#166534]"
            >
              <Check className="h-3 w-3" />
              {w}
            </span>
          ))}
        </div>
      )}
      <div className="mt-2 flex flex-wrap gap-1.5">
        <span
          className="rounded-full bg-[#F4F3FF] px-2 py-0.5 text-[12px] font-semibold text-[#5925DC]"
          style={fade(1)}
        >
          {owner}
        </span>
        <span
          className="inline-flex items-center gap-1 rounded-full bg-tint-blue px-2 py-0.5 text-[12px] font-semibold text-brand-700"
          style={fade(4)}
        >
          <ScrollText className="h-3 w-3" /> Ticket with fix prompt
        </span>
      </div>
    </div>
  );
  return (
    <div className="flex flex-1 flex-col gap-2" aria-hidden>
      {/* The queue shrinking to what needs you */}
      <div>
        <div className="flex justify-between text-[12px] font-semibold text-[#94A3B8]">
          <span>Your queue</span>
          <span className={s >= 3 ? "text-[#4ADE80]" : ""}>
            {s >= 3 ? "Only what needs you" : "Everything"}
          </span>
        </div>
        <div className="mt-1.5 h-2 rounded-full bg-white/10">
          <div
            className="h-2 rounded-full transition-all duration-1000 ease-out"
            style={{
              width: s >= 3 ? "18%" : "100%",
              background: s >= 3 ? GRAD : "#64748B",
            }}
          />
        </div>
      </div>
      {card("Storage bucket open to the internet", "Cloud team", WHY)}
      {card("SQL injection in checkout", "Dev team")}
      <div className="mt-auto space-y-1.5">
        <div
          className="flex items-center gap-2 rounded-lg bg-white/[0.05] px-3 py-1.5 text-[13px] text-[#CBD5E1]"
          style={fade(1)}
        >
          <Users className="h-4 w-4 shrink-0 text-[#C084FC]" />
          <span>
            <b className="font-semibold text-white">Lower risk:</b> sent to owners
          </span>
        </div>
        <div
          className="flex items-center gap-2 rounded-lg bg-white/[0.05] px-3 py-1.5 text-[13px] text-[#CBD5E1]"
          style={fade(2)}
        >
          <Ban className="h-4 w-4 shrink-0 text-[#94A3B8]" />
          <span>
            <b className="font-semibold text-white">Likely false positives:</b> set aside to confirm
          </span>
        </div>
      </div>
    </div>
  );
}

/** The AI walkthrough clock: steps 0..4, a short hold on the last, then again. Still: 4. */
export function useAiStep(still: boolean) {
  const [step, setStep] = useState(4);
  useEffect(() => {
    if (still) return setStep(4);
    setStep(0);
    const id = setInterval(() => setStep((x) => (x >= 6 ? 0 : x + 1)), 1700);
    return () => clearInterval(id);
  }, [still]);
  return Math.min(step, 4);
}

export function OnamAiShowcase({ still }: { still: boolean }) {
  const s = useAiStep(still);

  return (
    <div className="relative">
      {/* 1 · The promise, with the four benefits beside it */}
      <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
        <div>
          <span
            className="inline-flex items-center gap-1.5 rounded-full p-px"
            style={{ background: GRAD }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-night px-3 py-1 text-[12px] font-bold uppercase tracking-[0.12em] text-white">
              <AiMark className="h-3.5 w-3.5 text-[#A5B4FC]" /> Onam AI · your AI security analyst
            </span>
          </span>
          <h3 className="mt-3 font-display text-[28px] font-extrabold leading-tight text-white sm:text-[32px]">
            From alert overload to{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: GRAD }}>
              the fixes that matter.
            </span>
          </h3>
          <p className="mt-2 text-[15.5px] text-[#CBD5E1]">
            It works through every finding from code, cloud and SaaS, and tells you what to fix
            first, why, who owns it and how.{" "}
            <Link
              to="/onam-ai"
              className="inline-flex items-center gap-1 font-semibold text-white underline-offset-4 hover:underline"
            >
              See Onam AI <ArrowRight className="h-4 w-4" />
            </Link>
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-4">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <li key={b.title} className="flex items-center gap-3">
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-night"
                  style={{
                    color: b.color,
                    boxShadow: `0 0 0 1.5px ${b.color}, 0 0 22px ${b.color}55`,
                  }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-display text-[16px] font-bold text-white">{b.title}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 2 · Noise in, signal out: three equal panels */}
      <div className="mt-6 grid items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-0">
        <Panel n={1} title="Every alert comes in" tone="#94A3B8">
          <Stream still={still} />
        </Panel>
        <Beam still={still} />
        <Panel n={2} title="Onam AI works the queue" tone="#A5B4FC">
          <Core step={s} still={still} />
        </Panel>
        <Beam still={still} />
        <Panel n={3} title="Only what matters reaches you" tone="#4ADE80">
          <FocusList step={s} still={still} />
        </Panel>
      </div>

      {/* 3 · Where the fix lands, with the guardrails on the same line */}
      <div className="mt-5 border-t border-white/10 pt-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-1.5">
          <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#A5B4FC]">
            Then, in your editor
          </span>
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            {GUARDS.map((g) => (
              <li key={g} className="flex items-center gap-1.5 text-[13px] text-[#CBD5E1]">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#4ADE80]" /> {g}
              </li>
            ))}
          </ul>
        </div>
        <ol className="flex flex-col gap-2 md:flex-row md:items-center">
          {LANE.map((d, k) => {
            const Icon = d.icon;
            return (
              <li key={d.title} className="flex items-center gap-2 md:flex-1">
                <span className="flex flex-1 items-center gap-2 rounded-xl bg-white/[0.06] px-3 py-2 text-[14px] font-semibold text-white ring-1 ring-white/10">
                  <Icon className="h-4 w-4 shrink-0 text-[#A5B4FC]" />
                  {d.title}
                </span>
                {k < LANE.length - 1 && (
                  <ArrowRight className="hidden h-4 w-4 shrink-0 text-[#818CF8] md:block" />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
