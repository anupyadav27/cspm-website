import { type ReactNode } from "react";

/**
 * :::matrix Coverage by cloud
 * | Capability | AWS | Azure | Google Cloud |
 * | --- | --- | --- | --- |
 * | AI inventory | yes | yes | yes |
 * | Guardrail presence | yes (Bedrock Guardrails) | partial | planned |
 * | Other clouds | no | no | no |
 * :::
 *
 * A pipe table. The first row is the header, the first column the row label.
 * A cell starts with a state word — yes / ✓, partial / ◐, no / ✗, planned —
 * optionally followed by a note: `yes (Bedrock Guardrails)` or `partial — exposure only`.
 * Any other cell text renders as plain text. A legend lists the states used.
 */
export type CellState = "yes" | "partial" | "no" | "planned";
export type MatrixSpec = {
  title: string;
  header: string[];
  rows: { label: string; cells: { state: CellState | null; note: string; raw: string }[] }[];
};

const STATE_WORDS: [RegExp, CellState][] = [
  [/^(yes|✓|✔)/i, "yes"],
  [/^(partial|◐)/i, "partial"],
  [/^(no|✗|✕|×)(?![a-z])/i, "no"],
  [/^planned/i, "planned"],
];

function parseCell(raw: string) {
  for (const [re, state] of STATE_WORDS) {
    const m = re.exec(raw);
    if (m) {
      const note = raw
        .slice(m[0].length)
        .trim()
        .replace(/^[—–\-:]\s*/, "")
        .replace(/^\((.*)\)$/, "$1")
        .trim();
      return { state, note, raw };
    }
  }
  return { state: null, note: "", raw };
}

export function parseMatrix(title: string, body: string): MatrixSpec {
  const rows: string[][] = [];
  for (const line of body.split("\n")) {
    const t = line.trim();
    if (!t.startsWith("|")) continue;
    const cells = t.replace(/^\|/, "").replace(/\|$/, "").split("|").map((s) => s.trim());
    if (cells.every((c) => /^:?-+:?$/.test(c))) continue;
    rows.push(cells);
  }
  const [header = [], ...rest] = rows;
  return {
    title,
    header,
    rows: rest.map((r) => ({ label: r[0] ?? "", cells: r.slice(1).map(parseCell) })),
  };
}

const STYLE: Record<CellState, { label: string; icon: string; cls: string }> = {
  yes: { label: "Covered", icon: "✓", cls: "bg-[#DCFCE7] text-[#166534] border-[#86EFAC]" },
  partial: { label: "Partial", icon: "◐", cls: "bg-[#FEF3C7] text-[#92400E] border-[#FCD34D]" },
  no: { label: "Not covered", icon: "✗", cls: "bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]" },
  planned: { label: "Planned", icon: "◷", cls: "bg-[#EDE9FE] text-[#5B21B6] border-[#C4B5FD]" },
};

function Pill({ state }: { state: CellState }) {
  const s = STYLE[state];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[12px] font-semibold whitespace-nowrap ${s.cls}`}>
      <span aria-hidden>{s.icon}</span>
      {s.label}
    </span>
  );
}

export function CoverageMatrix({
  spec,
  renderInline,
}: {
  spec: MatrixSpec;
  renderInline: (t: string) => ReactNode;
}) {
  const used = (Object.keys(STYLE) as CellState[]).filter((k) =>
    spec.rows.some((r) => r.cells.some((c) => c.state === k)),
  );
  return (
    <figure className="my-8">
      {spec.title && (
        <figcaption className="mb-3 text-[12px] font-bold uppercase tracking-[0.12em] text-[#1E40AF]">{spec.title}</figcaption>
      )}
      <div className="overflow-x-auto rounded-xl border border-[#E5E9F0] bg-white">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {spec.header.map((h, i) => (
                <th
                  key={i}
                  scope="col"
                  className={`border-b border-[#E5E9F0] bg-[#F7F9FC] px-3 py-2.5 font-semibold text-[#0B1220] ${i === 0 ? "text-left min-w-[160px]" : "text-center min-w-[110px]"}`}
                >
                  {renderInline(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {spec.rows.map((r, i) => (
              <tr key={i} className="odd:bg-white even:bg-[#FBFCFE]">
                <th scope="row" className="border-b border-[#EEF2F6] px-3 py-2.5 text-left align-top font-medium text-[#0B1220]">
                  {renderInline(r.label)}
                </th>
                {r.cells.map((c, j) => (
                  <td key={j} className="border-b border-[#EEF2F6] px-3 py-2.5 text-center align-top">
                    {c.state ? (
                      <>
                        <Pill state={c.state} />
                        {c.note && <div className="mt-1 text-[12px] leading-snug text-[#5A6A80]">{renderInline(c.note)}</div>}
                      </>
                    ) : (
                      <span className="text-[#334155]">{renderInline(c.raw)}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {used.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-[#5A6A80]" aria-label="Legend">
          <span className="font-semibold text-[#475569]">Legend</span>
          {used.map((k) => (
            <Pill key={k} state={k} />
          ))}
        </div>
      )}
    </figure>
  );
}
