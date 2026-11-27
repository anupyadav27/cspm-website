import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { CheckCircle2, Circle, AlertTriangle } from "@/components/site/icons";

/**
 * :::switchboard Pick a cloud
 * ### AWS | yes
 * Amazon SageMaker and Amazon Bedrock …          (markdown body)
 * ### Oracle Cloud | no
 * Not covered today.
 * ### Kubernetes | partial          (or `auto` for "Partly automated")
 * …
 * :::
 *
 * A row of switches; picking one shows exactly what applies to it. State words (yes / partial /
 * no) always come with an icon and a word, never colour alone. Every panel is in the server
 * HTML; inactive panels are visually hidden, not removed, so crawlers read all of them.
 */
export type SwitchItem = { label: string; state: "yes" | "partial" | "auto" | "no" | "info"; body: ReactNode };

const STATE = {
  yes: { Icon: CheckCircle2, word: "Covered", cls: "text-onam-green" },
  partial: { Icon: AlertTriangle, word: "Partly covered", cls: "text-[#B45309]" },
  auto: { Icon: AlertTriangle, word: "Partly automated", cls: "text-[#B45309]" },
  no: { Icon: Circle, word: "Not covered today", cls: "text-muted-500" },
  info: { Icon: CheckCircle2, word: "", cls: "text-brand-600" },
} as const;

export function Switchboard({ title, items }: { title?: string; items: SwitchItem[] }) {
  const [i, setI] = useState(0);
  const id = useId();
  function onKey(e: KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const n = (i + (e.key === "ArrowRight" ? 1 : items.length - 1)) % items.length;
    setI(n);
    document.getElementById(`${id}-t-${n}`)?.focus();
  }
  return (
    <section aria-label={title || "Pick one"} className="my-8 rounded-2xl border border-line bg-white p-4 sm:p-5">
      {title && <div className="text-[13px] font-semibold text-brand-700">{title}</div>}
      <div role="tablist" aria-label={title || "Pick one"} className="mt-3 flex flex-wrap gap-2" onKeyDown={onKey}>
        {items.map((it, k) => {
          const s = STATE[it.state];
          return (
            <button
              key={it.label}
              id={`${id}-t-${k}`}
              role="tab"
              type="button"
              aria-selected={k === i}
              aria-controls={`${id}-p-${k}`}
              tabIndex={k === i ? 0 : -1}
              onClick={() => setI(k)}
              className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-[14px] font-semibold transition ${
                k === i ? "bg-ink text-white" : "bg-surface text-navy-600 ring-1 ring-line hover:ring-brand-500"
              }`}
            >
              <s.Icon className={`h-4 w-4 ${k === i ? "text-white" : s.cls}`} aria-hidden />
              {it.label}
              {s.word && <span className="sr-only">({s.word})</span>}
            </button>
          );
        })}
      </div>
      {items.map((it, k) => {
        const s = STATE[it.state];
        return (
          <div
            key={it.label}
            id={`${id}-p-${k}`}
            role="tabpanel"
            aria-labelledby={`${id}-t-${k}`}
            className={k === i ? "ex-fade mt-4 border-t border-line pt-4" : "sr-only"}
          >
            <div className="flex items-center gap-2">
              <span className="font-display text-[18px] font-bold text-ink">{it.label}</span>
              {s.word && (
                <span className={`inline-flex items-center gap-1 text-[13px] font-semibold ${s.cls}`}>
                  <s.Icon className="h-4 w-4" aria-hidden /> {s.word}
                </span>
              )}
            </div>
            <div className="mt-2 [&_p]:mb-3 [&_ul]:mb-3">{it.body}</div>
          </div>
        );
      })}
    </section>
  );
}
