import { type ReactNode } from "react";

// Ultra-small "markdown-ish" renderer for our in-house doc/blog copy.
// Supports: ## headings, ### headings, paragraphs, - lists, 1. lists, > callouts,
// fenced ``` code blocks, inline `code`, simple pipe tables, links [t](u), **bold**,
// block images ![alt](src) on their own line, and --- horizontal rules.

type Block =
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "quote"; text: string }
  | { kind: "code"; text: string }
  | { kind: "img"; alt: string; src: string }
  | { kind: "hr" }
  | { kind: "table"; rows: string[][] };

function parse(src: string): Block[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (line.startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) { buf.push(lines[i]); i++; }
      i++;
      blocks.push({ kind: "code", text: buf.join("\n") });
      continue;
    }
    if (line.startsWith("## ")) { blocks.push({ kind: "h2", text: line.slice(3) }); i++; continue; }
    if (line.startsWith("### ")) { blocks.push({ kind: "h3", text: line.slice(4) }); i++; continue; }
    if (line.startsWith("> ")) {
      const buf = [line.slice(2)];
      i++;
      while (i < lines.length && lines[i].startsWith("> ")) { buf.push(lines[i].slice(2)); i++; }
      blocks.push({ kind: "quote", text: buf.join(" ") });
      continue;
    }
    if (/^-{3,}\s*$/.test(line.trim())) { blocks.push({ kind: "hr" }); i++; continue; }
    {
      const img = /^!\[([^\]]*)\]\(([^)]+)\)\s*$/.exec(line.trim());
      if (img) { blocks.push({ kind: "img", alt: img[1], src: img[2] }); i++; continue; }
    }
    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) { items.push(lines[i].replace(/^[-*] /, "")); i++; }
      blocks.push({ kind: "ul", items });
      continue;
    }
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) { items.push(lines[i].replace(/^\d+\. /, "")); i++; }
      blocks.push({ kind: "ol", items });
      continue;
    }
    if (line.trim().startsWith("|") && lines[i + 1]?.trim().startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const cells = lines[i].trim().slice(1, -1).split("|").map((s) => s.trim());
        // skip alignment row like |---|---|
        if (!cells.every((c) => /^:?-+:?$/.test(c))) rows.push(cells);
        i++;
      }
      blocks.push({ kind: "table", rows });
      continue;
    }
    // paragraph: consume until blank
    const buf = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !/^([-*] |\d+\. |> |## |### |```|\||!\[|-{3,}\s*$)/.test(lines[i])) {
      buf.push(lines[i]); i++;
    }
    blocks.push({ kind: "p", text: buf.join(" ") });
  }
  return blocks;
}

function renderInline(text: string): ReactNode[] {
  // order: code, bold, links
  const nodes: ReactNode[] = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("`")) {
      nodes.push(<code key={key++} className="rounded bg-[#F1F5F9] px-1.5 py-0.5 font-mono text-[0.85em] text-[#0B1220]">{tok.slice(1, -1)}</code>);
    } else if (tok.startsWith("**")) {
      nodes.push(<strong key={key++} className="font-semibold text-[#0B1220]">{tok.slice(2, -2)}</strong>);
    } else {
      const mm = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(tok);
      if (mm) nodes.push(<a key={key++} href={mm[2]} className="text-[#2563EB] hover:underline">{mm[1]}</a>);
    }
    last = m.index + tok.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function slugifyHeading(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function extractHeadings(src: string): { text: string; id: string }[] {
  return parse(src)
    .filter((b): b is { kind: "h2"; text: string } => b.kind === "h2")
    .map((b) => ({ text: b.text, id: slugifyHeading(b.text) }));
}

export function Prose({ source }: { source: string }) {
  const blocks = parse(source);
  return (
    <div className="max-w-none">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "h2":
            return (
              <h2 key={i} id={slugifyHeading(b.text)} className="font-display font-extrabold text-2xl md:text-[28px] tracking-tight text-[#0B1220] mt-12 mb-4 scroll-mt-24">
                {b.text}
              </h2>
            );
          case "h3":
            return <h3 key={i} className="font-display font-bold text-lg text-[#0B1220] mt-8 mb-3">{b.text}</h3>;
          case "p":
            return <p key={i} className="text-[16px] leading-[1.75] text-[#334155] mb-5">{renderInline(b.text)}</p>;
          case "ul":
            return (
              <ul key={i} className="list-disc pl-6 mb-6 space-y-2 text-[#334155]">
                {b.items.map((it, j) => <li key={j} className="leading-[1.7]">{renderInline(it)}</li>)}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="list-decimal pl-6 mb-6 space-y-2 text-[#334155]">
                {b.items.map((it, j) => <li key={j} className="leading-[1.7]">{renderInline(it)}</li>)}
              </ol>
            );
          case "hr":
            return <hr key={i} className="my-10 border-t border-[#E5E9F0]" />;
          case "img":
            return (
              <figure key={i} className="my-8">
                <img
                  src={b.src}
                  alt={b.alt}
                  loading="lazy"
                  className="w-full rounded-xl border border-[#E5E9F0] shadow-[0_4px_16px_rgba(16,24,40,.06)] bg-white"
                />
                {b.alt && <figcaption className="mt-2.5 text-center text-[13px] text-[#64748B]">{b.alt}</figcaption>}
              </figure>
            );
          case "quote":
            return (
              <blockquote key={i} className="my-6 border-l-4 border-[#2563EB] bg-[#F5F8FF] pl-5 pr-4 py-4 rounded-r-lg text-[#0B1220] italic">
                {renderInline(b.text)}
              </blockquote>
            );
          case "code":
            return (
              <pre key={i} className="my-6 rounded-xl bg-[#0B1220] text-[#E2E8F0] p-4 overflow-x-auto text-[13px] leading-[1.6] font-mono">
                <code>{b.text}</code>
              </pre>
            );
          case "table":
            return (
              <div key={i} className="my-6 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      {b.rows[0]?.map((c, j) => (
                        <th key={j} className="text-left font-semibold text-[#0B1220] border-b border-[#E5E9F0] px-3 py-2 bg-[#F7F9FC]">{renderInline(c)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.slice(1).map((r, j) => (
                      <tr key={j}>
                        {r.map((c, k) => (
                          <td key={k} className="border-b border-[#EEF2F6] px-3 py-2 text-[#334155] align-top">{renderInline(c)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </div>
  );
}
