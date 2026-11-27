import { useId, useState, type ReactNode } from "react";

/**
 * :::steps Find your AI estate in the console
 * ### Open AI Security
 * In the console, choose **AI Security** in the menu.
 * ### Read the inventory
 * The Inventory tab lists every AI resource found.
 * :::
 *
 * Each `### ` line starts a step; the markdown under it is the step body.
 * One step is shown at a time with Back / Next and a progress bar. Every step
 * is in the server-rendered HTML; inactive steps are visually hidden (not
 * display:none) so search engines, AI crawlers and screen readers still get them.
 */
export function Walkthrough({ title, steps }: { title?: string; steps: { title: string; content: ReactNode }[] }) {
  const [active, setActive] = useState(0);
  const id = useId();
  const n = steps.length;
  if (!n) return null;
  const pct = Math.round(((active + 1) / n) * 100);

  return (
    <section aria-label={title || "Walkthrough"} className="my-8 overflow-hidden rounded-2xl border border-[#E5E9F0] bg-white shadow-[0_4px_16px_rgba(16,24,40,.06)]">
      <div className="border-b border-[#E5E9F0] bg-[#F7F9FC] px-5 pt-4 pb-3">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#1E40AF]">{title || "Walkthrough"}</span>
          <span className="text-[12px] font-semibold text-[#5A6A80]" aria-live="polite">
            Step {active + 1} of {n}
          </span>
        </div>
        <div
          className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#E5E9F0]"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={n}
          aria-valuenow={active + 1}
          aria-label="Walkthrough progress"
        >
          <div className="h-full rounded-full bg-[#2563EB] transition-[width] duration-300" style={{ width: `${pct}%` }} />
        </div>
        <ol className="mt-3 flex flex-wrap gap-1.5" aria-label="Steps">
          {steps.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-current={i === active ? "step" : undefined}
                aria-controls={`${id}-step-${i}`}
                className={`h-7 min-w-7 rounded-full px-2 text-[12px] font-bold transition ${
                  i === active
                    ? "bg-[#2563EB] text-white"
                    : i < active
                      ? "bg-[#DBE7FE] text-[#1D4ED8]"
                      : "bg-white text-[#5A6A80] border border-[#E5E9F0]"
                }`}
                title={s.title}
              >
                {i + 1}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="px-5 pt-5">
        {steps.map((s, i) => (
          <div
            key={i}
            id={`${id}-step-${i}`}
            className={i === active ? "" : "sr-only"}
            data-step={i + 1}
          >
            <h4 className="mb-3 flex items-center gap-3 font-display text-lg font-bold text-[#0B1220]">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0B1220] text-[13px] font-black text-white">
                {i + 1}
              </span>
              {s.title}
            </h4>
            {s.content}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[#EEF2F6] px-5 py-3">
        <button
          type="button"
          onClick={() => setActive((a) => Math.max(0, a - 1))}
          disabled={active === 0}
          className="rounded-lg border border-[#E5E9F0] bg-white px-3.5 py-1.5 text-sm font-semibold text-[#334155] transition hover:border-[#2563EB] hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => setActive((a) => Math.min(n - 1, a + 1))}
          disabled={active === n - 1}
          className="rounded-lg bg-[#2563EB] px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </section>
  );
}
