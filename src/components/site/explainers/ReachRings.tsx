import { useState } from "react";
import { Bot, Database, KeyRound } from "@/components/site/icons";

/**
 * :::rings
 * :::
 *
 * Keyring and library card (illustrative). Pick an AI agent: on the left, the identity it runs
 * as and what that identity may do; on the right, the data stores it reads. Each is one hop:
 * AI is not on attack paths yet, so nothing is chained beyond the first link.
 */
const AGENTS = [
  {
    id: "support-assistant",
    type: "Bedrock agent · AWS",
    role: "support-agent-role",
    rights: [{ t: "Wide write access", bad: true }, { t: "Marked as an AI agent in CIEM", bad: false }],
    reads: [{ t: "customer-tickets", s: "S3 · holds personal data (DSPM label)", bad: true }],
  },
  {
    id: "churn-notebook",
    type: "SageMaker notebook · AWS",
    role: "ml-exec-role",
    rights: [{ t: "Admin access", bad: true }, { t: "Marked as an AI agent in CIEM", bad: false }],
    reads: [{ t: "churn-training", s: "S3 · no sensitive label", bad: false }],
  },
];

export function ReachRings() {
  const [k, setK] = useState(0);
  const a = AGENTS[k];
  return (
    <figure className="my-8 rounded-2xl border border-line bg-white p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="radiogroup" aria-label="Pick an AI agent" className="flex flex-wrap gap-2">
          {AGENTS.map((x, i) => (
            <button
              key={x.id}
              type="button"
              role="radio"
              aria-checked={i === k}
              onClick={() => setK(i)}
              className={`min-h-11 rounded-full px-4 font-mono text-[13px] font-medium transition ${i === k ? "bg-ink text-white" : "bg-surface text-navy-600 ring-1 ring-line hover:ring-brand-500"}`}
            >
              {x.id}
            </button>
          ))}
        </div>
        <span className="rounded-full bg-tint-slate px-2 py-0.5 text-[12px] font-semibold text-muted-500">Illustrative</span>
      </div>

      <div className="ex-fade mt-5 grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]" key={a.id}>
        <div className="rounded-xl bg-surface p-4 md:order-1">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-navy-600">
            <KeyRound className="h-4 w-4" aria-hidden /> Runs as
          </div>
          <div className="mt-1 font-mono text-[14px] font-semibold text-ink">{a.role}</div>
          <ul className="mt-2 space-y-1">
            {a.rights.map((r) => (
              <li key={r.t} className={`text-[14px] ${r.bad ? "font-semibold text-[#B45309]" : "text-body"}`}>
                {r.bad ? "⚠ Finding: " : ""}
                {r.t}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-center gap-1 md:order-2">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-night text-white ring-4 ring-tint-blue">
            <Bot className="h-7 w-7" aria-hidden />
          </span>
          <span className="font-mono text-[13px] font-semibold text-ink">{a.id}</span>
          <span className="text-[12px] text-muted-500">{a.type}</span>
        </div>
        <div className="rounded-xl bg-surface p-4 md:order-3">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-navy-600">
            <Database className="h-4 w-4 text-cyan-bright" aria-hidden /> Reads
          </div>
          <ul className="mt-1 space-y-1">
            {a.reads.map((r) => (
              <li key={r.t}>
                <div className="font-mono text-[14px] font-semibold text-ink">{r.t}</div>
                <div className={`text-[14px] ${r.bad ? "font-semibold text-[#B45309]" : "text-body"}`}>{r.s}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <figcaption className="mt-4 text-[13px] text-muted-500">
        One hop each: the identity it runs as, and the stores it reads. AI is not drawn on attack paths yet.
      </figcaption>
    </figure>
  );
}
