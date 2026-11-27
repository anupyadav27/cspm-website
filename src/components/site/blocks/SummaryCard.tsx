import { type ReactNode } from "react";

/**
 * :::card In 60 seconds
 * What it does: Finds AI services and checks how they are set up.
 * What it needs from you: The read-only role you already deployed.
 * What you get: An AI inventory and findings in your queue.
 * :::
 *
 * One row per `Label: text` line. Lines without a colon join the previous row.
 */
export function parseCardRows(body: string): { label: string; text: string }[] {
  const rows: { label: string; text: string }[] = [];
  for (const raw of body.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const m = /^([^:]{1,40}):\s+(.*)$/.exec(line);
    if (m && !m[1].includes("`") && !m[1].includes("](")) rows.push({ label: m[1].trim(), text: m[2] });
    else if (rows.length) rows[rows.length - 1].text += ` ${line}`;
    else rows.push({ label: "", text: line });
  }
  return rows;
}

const ACCENTS = ["#2563EB", "#0EA5E9", "#16A34A", "#7C3AED"];

export function SummaryCard({ title, rows }: { title: string; rows: { label: string; content: ReactNode }[] }) {
  return (
    <section
      aria-label={title}
      className="my-8 overflow-hidden rounded-2xl border border-[#C7D2FE] bg-gradient-to-br from-[#EFF4FF] via-white to-white shadow-[0_8px_24px_rgba(37,99,235,.08)]"
    >
      <div className="flex items-center gap-2 border-b border-[#DBE7FE] bg-[#0B1220] px-5 py-3">
        <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-[#60A5FA]" />
        <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-white">{title}</span>
      </div>
      <dl className="divide-y divide-[#E5E9F0]">
        {rows.map((r, i) => (
          <div key={i} className="grid gap-1 px-5 py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
            <dt className="flex items-start gap-2 text-[13px] font-bold uppercase tracking-wide text-[#0B1220]">
              <span
                aria-hidden
                className="mt-[3px] inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[12px] font-black text-white"
                style={{ background: ACCENTS[i % ACCENTS.length] }}
              >
                {i + 1}
              </span>
              {r.label}
            </dt>
            <dd className="text-[15.5px] leading-[1.65] text-[#334155]">{r.content}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
