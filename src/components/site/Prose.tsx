import { type ReactNode } from "react";
import { SummaryCard, parseCardRows } from "./blocks/SummaryCard";
import { FlowDiagram, parseFlow } from "./blocks/FlowDiagram";
import { CoverageMatrix, parseMatrix } from "./blocks/CoverageMatrix";
import { Walkthrough } from "./blocks/Walkthrough";
import { LimitsCallout } from "./blocks/LimitsCallout";
import { FaqList } from "./blocks/FaqList";
import { splitByH3, plainText } from "./blocks/shared";
import { parseFields, splitLink, parseHotspots, parseLedger } from "./explainers/parse";
import { QuestionHero } from "./explainers/QuestionHero";
import { LensMap } from "./explainers/LensMap";
import { StoryStepper } from "./explainers/StoryStepper";
import { AnnotatedScreen } from "./explainers/AnnotatedScreen";
import { Ledger } from "./explainers/Ledger";
import { NextQuestions } from "./explainers/NextQuestions";
import { Switchboard } from "./explainers/Switchboard";
import { GuardrailXray } from "./explainers/GuardrailXray";
import { ReachRings } from "./explainers/ReachRings";

// Ultra-small "markdown-ish" renderer for our in-house doc/blog copy.
// Supports: ## headings, ### headings, paragraphs, - lists, 1. lists, > callouts,
// fenced ``` code blocks, inline `code`, simple pipe tables, links [t](u), **bold**,
// block images ![alt](src) on their own line, and --- horizontal rules.
//
// Visual blocks (fenced directives, closed by a line that is exactly `:::`;
// the text after the block name is its title). Syntax reference:
// header comment of each file in src/components/site/blocks/.
//   :::card [title]      "In 60 seconds" card. Lines `Label: text`.
//   :::flow [aria label] Animated flow. One line per stage, `Label | sublabel`;
//                        parallel nodes in a stage are separated by ` || `.
//   :::matrix [title]    Coverage matrix. A pipe table; cells start with
//                        yes | partial | no | planned (or ✓ ✗), optional (note).
//   :::steps [title]     Walkthrough. `### Step title` + markdown body per step.
//   :::limits [title]    Amber "Honest limits" callout; markdown body.
//   :::faq [title]       Q/A list. `### Question` + markdown answer; emits FAQPage JSON-LD.
//
// Explainers (src/components/site/explainers/; syntax in each file's header comment):
//   :::hero night|light  Page hero with the page's only <h1> (docs.$.tsx then skips its own).
//   :::lensmap ai-estate The AI estate map (data in src/data/explainers/ai-estate.ts).
//   :::story [title]     Story stepper. `### Beat` + `frame: key|/path.png` + caption.
//   :::screen /path.png  Real console screen with numbered hotspots `n @ x,y: text`.
//   :::ledger            "What it checks" (+ lines) / "What it does not do" (- lines).
//   :::next [title]      Night band of question cards: `### Question | /href [| cta]` + preview.
//   :::switchboard [t]   Pick-one panels: `### Label | yes|partial|no|info` + markdown body.
//   :::xray / :::rings   Guardrail X-ray / one-hop reach (illustrative, no body).
// An unknown block name renders its body as ordinary prose.

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
  | { kind: "table"; rows: string[][] }
  | { kind: "directive"; name: string; title: string; body: string };

const DIRECTIVE_OPEN = /^:::([a-z]+)\s*(.*)$/;

function parse(src: string): Block[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    {
      const d = DIRECTIVE_OPEN.exec(line.trim());
      if (d) {
        const buf: string[] = [];
        i++;
        while (i < lines.length && lines[i].trim() !== ":::") { buf.push(lines[i]); i++; }
        i++;
        blocks.push({ kind: "directive", name: d[1], title: d[2].trim(), body: buf.join("\n") });
        continue;
      }
    }
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
    while (i < lines.length && lines[i].trim() && !/^([-*] |\d+\. |> |## |### |```|\||!\[|-{3,}\s*$|:::)/.test(lines[i])) {
      buf.push(lines[i]); i++;
    }
    blocks.push({ kind: "p", text: buf.join(" ") });
  }
  return blocks;
}

function renderInline(text: string): ReactNode[] {
  // order: code, bold, italic, links
  // italic requires non-space just inside the asterisks so `5 * 3 * 2` stays literal;
  // code is matched first so `s3:*` inside backticks is never read as emphasis.
  const nodes: ReactNode[] = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^\s*](?:[^*\n]*[^\s*])?\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("`")) {
      nodes.push(<code key={key++} className="rounded bg-[#F1F5F9] px-1.5 py-0.5 font-mono text-[max(12px,0.85em)] text-[#0B1220]">{tok.slice(1, -1)}</code>);
    } else if (tok.startsWith("**")) {
      nodes.push(<strong key={key++} className="font-semibold text-[#0B1220]">{renderInline(tok.slice(2, -2))}</strong>);
    } else if (tok.startsWith("*")) {
      nodes.push(<em key={key++} className="italic">{renderInline(tok.slice(1, -1))}</em>);
    } else {
      const mm = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(tok);
      if (mm) nodes.push(<a key={key++} href={mm[2]} className="text-[#2563EB] hover:underline">{renderInline(mm[1])}</a>);
    }
    last = m.index + tok.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function slugifyHeading(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Q/A pairs from every :::faq block, as plain text, for FAQPage JSON-LD. */
export function extractFaq(src: string): { q: string; a: string }[] {
  return parse(src)
    .filter((b): b is Extract<Block, { kind: "directive" }> => b.kind === "directive" && b.name === "faq")
    .flatMap((b) => splitByH3(b.body))
    .filter((x) => x.title && x.body.trim())
    .map((x) => ({ q: plainText(x.title), a: plainText(x.body) }));
}

/** schema.org FAQPage for a body that contains a :::faq block, else null. */
export function faqJsonLd(src: string) {
  const faq = extractFaq(src);
  if (!faq.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function namedVisual(v: string | undefined, key?: number): ReactNode {
  if (!v) return null;
  if (v.startsWith("lensmap")) return <LensMap key={key} />;
  if (v === "xray") return <GuardrailXray key={key} />;
  if (v === "rings") return <ReachRings key={key} />;
  return null;
}

function renderDirective(b: Extract<Block, { kind: "directive" }>, key: number): ReactNode {
  switch (b.name) {
    case "hero": {
      const { fields: f } = parseFields(b.body);
      return (
        <QuestionHero
          key={key}
          variant={b.title === "light" ? "light" : "night"}
          pill={f.pill}
          eyebrow={f.eyebrow}
          title={f.title ?? ""}
          lead={f.lead ? renderInline(f.lead) : undefined}
          chips={f.chips ? f.chips.split("·").map((c) => c.trim()).filter(Boolean) : undefined}
          cta={splitLink(f.cta)}
          secondary={splitLink(f.secondary)}
          visual={namedVisual(f.visual)}
        />
      );
    }
    case "lensmap":
      return <div key={key} className="my-8"><LensMap /></div>;
    case "xray":
    case "rings":
      return namedVisual(b.name, key);
    case "story": {
      const parts = splitByH3(b.body).filter((s) => s.title);
      const beats = parts.map((p) => {
        const { fields, rest } = parseFields(p.body);
        return { title: p.title, frame: fields.frame ?? "", alt: fields.alt ?? plainText(rest), caption: renderInline(rest) };
      });
      const end = splitLink(parseFields(splitByH3(b.body)[0]?.title ? "" : splitByH3(b.body)[0]?.body ?? "").fields.end);
      return <StoryStepper key={key} title={b.title} beats={beats} end={end} />;
    }
    case "screen": {
      const { fields: f, rest } = parseFields(b.body);
      const [w, h] = (f.size ?? "1440x900").split("x").map(Number);
      return (
        <AnnotatedScreen
          key={key}
          src={b.title}
          url={f.url ?? ""}
          alt={f.alt ?? ""}
          width={w}
          height={h}
          caption={f.caption}
          hidpi={f.hidpi === "yes"}
          hotspots={parseHotspots(rest)}
          renderInline={renderInline}
        />
      );
    }
    case "ledger": {
      const { fields: f, rest } = parseFields(b.body);
      const l = parseLedger(rest);
      return <Ledger key={key} yes={l.yes} no={l.no} yesTitle={f.yes} noTitle={f.no} renderInline={renderInline} />;
    }
    case "next":
      return (
        <NextQuestions
          key={key}
          title={b.title}
          renderInline={renderInline}
          cards={splitByH3(b.body)
            .filter((s) => s.title)
            .map((s) => {
              const [q, href, flag] = s.title.split("|").map((x) => x.trim());
              return { q, href: href ?? "#", cta: flag === "cta", preview: s.body };
            })}
        />
      );
    case "switchboard":
      return (
        <Switchboard
          key={key}
          title={b.title}
          items={splitByH3(b.body)
            .filter((s) => s.title)
            .map((s) => {
              const [label, state] = s.title.split("|").map((x) => x.trim());
              const st = (["yes", "partial", "auto", "no", "info"].includes(state) ? state : "info") as "yes" | "partial" | "auto" | "no" | "info";
              return { label, state: st, body: <Prose source={s.body} /> };
            })}
        />
      );
    case "card":
      return <SummaryCard key={key} title={b.title || "In 60 seconds"} rows={parseCardRows(b.body).map((r) => ({ label: r.label, content: renderInline(r.text) }))} />;
    case "flow":
      return <FlowDiagram key={key} spec={parseFlow(b.title, b.body)} />;
    case "matrix":
      return <CoverageMatrix key={key} spec={parseMatrix(b.title, b.body)} renderInline={renderInline} />;
    case "steps":
      return (
        <Walkthrough
          key={key}
          title={b.title}
          steps={splitByH3(b.body).filter((s) => s.title).map((s) => ({ title: s.title, content: <Prose source={s.body} /> }))}
        />
      );
    case "limits":
      return <LimitsCallout key={key} title={b.title || "Honest limits"}><Prose source={b.body} /></LimitsCallout>;
    case "faq":
      return (
        <FaqList
          key={key}
          title={b.title}
          items={splitByH3(b.body).filter((s) => s.title).map((s) => ({ q: s.title, a: <Prose source={s.body} /> }))}
        />
      );
    default:
      return <Prose key={key} source={b.body} />;
  }
}

/** True when the body opens with a :::hero block (the page's <h1> then comes from it). */
export function hasHero(src: string): boolean {
  return /^\s*:::hero\b/.test(src);
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
          case "directive":
            return renderDirective(b, i);
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
                {b.alt && <figcaption className="mt-2.5 text-center text-[13px] text-[#5A6A80]">{b.alt}</figcaption>}
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
