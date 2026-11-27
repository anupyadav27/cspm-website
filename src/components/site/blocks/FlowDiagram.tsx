import { useId } from "react";
import { wrapText, plainText } from "./shared";

/**
 * :::flow How AI security posture works
 * Cloud AI services | SageMaker, Bedrock, Azure AI, Vertex AI || Self-hosted AI | Ollama, vLLM on Kubernetes
 * Read-only discovery | Cloud roles and cluster reads
 * AI inventory | Every AI resource, one list
 * Findings | In your queue
 * :::
 *
 * One line per stage, drawn left to right (top to bottom on phones).
 * `Label | sublabel`; the sublabel is optional. Several nodes in one stage are
 * separated by ` || ` and every node fans in/out to the next stage.
 * The text after `:::flow` is the diagram's accessible name.
 *
 * Rendered as inline SVG: role="img" + aria-label, plus a visually hidden
 * ordered list of the stages so search engines and AI crawlers can read it.
 * Connectors carry a moving dash (CSS, class onam-flow-dash in styles.css),
 * switched off under prefers-reduced-motion.
 */
export type FlowNode = { label: string; sub: string };
export type FlowSpec = { title: string; stages: FlowNode[][] };

export function parseFlow(title: string, body: string): FlowSpec {
  const stages = body
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && l !== "->" && l !== "→")
    .map((l) =>
      l.split(/\s+\|\|\s+/).map((n) => {
        const [label, ...sub] = n.split(/\s+\|\s+/);
        return { label: plainText(label), sub: plainText(sub.join(" | ")) };
      }),
    );
  return { title: title || "Data flow", stages };
}

type Box = { x: number; y: number; w: number; h: number; node: FlowNode; stage: number; label: string[]; sub: string[] };

const LABEL_LH = 16;
const SUB_LH = 14;

function measure(node: FlowNode, w: number) {
  const label = wrapText(node.label, Math.max(8, Math.floor((w - 20) / 7.6)), 3);
  const sub = node.sub ? wrapText(node.sub, Math.max(10, Math.floor((w - 20) / 6.1)), 4) : [];
  const h = 34 + label.length * LABEL_LH + (sub.length ? 6 + sub.length * SUB_LH : 0);
  return { label, sub, h };
}

function layoutHorizontal(spec: FlowSpec) {
  const W = 960, pad = 16, gap = 40, nodeGap = 14;
  const k = spec.stages.length;
  const colW = (W - 2 * pad - (k - 1) * gap) / k;
  const cols = spec.stages.map((stage, s) =>
    stage.map((node) => ({ node, stage: s, ...measure(node, colW) })),
  );
  const colH = cols.map((c) => c.reduce((a, b) => a + b.h, 0) + (c.length - 1) * nodeGap);
  const H = Math.max(...colH) + 2 * pad;
  const boxes: Box[][] = cols.map((c, s) => {
    let y = (H - colH[s]) / 2;
    return c.map((m) => {
      const b = { x: pad + s * (colW + gap), y, w: colW, h: m.h, node: m.node, stage: s, label: m.label, sub: m.sub };
      y += m.h + nodeGap;
      return b;
    });
  });
  const links: string[] = [];
  for (let s = 0; s < boxes.length - 1; s++) {
    for (const [a, b] of pairs(boxes[s], boxes[s + 1])) {
      const x1 = a.x + a.w, y1 = a.y + a.h / 2, x2 = b.x - 2, y2 = b.y + b.h / 2, mx = (x1 + x2) / 2;
      links.push(`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`);
    }
  }
  return { W, H, boxes, links };
}

function layoutVertical(spec: FlowSpec) {
  const W = 360, pad = 12, gap = 34, nodeGap = 10;
  let y = pad;
  const boxes: Box[][] = spec.stages.map((stage, s) => {
    const m = stage.length;
    const w = (W - 2 * pad - (m - 1) * nodeGap) / m;
    const ms = stage.map((node) => ({ node, ...measure(node, w) }));
    const rowH = Math.max(...ms.map((x) => x.h));
    const row = ms.map((x, i) => ({ x: pad + i * (w + nodeGap), y, w, h: rowH, node: x.node, stage: s, label: x.label, sub: x.sub }));
    y += rowH + gap;
    return row;
  });
  const H = y - gap + pad;
  const links: string[] = [];
  for (let s = 0; s < boxes.length - 1; s++) {
    for (const [a, b] of pairs(boxes[s], boxes[s + 1])) {
      const x1 = a.x + a.w / 2, y1 = a.y + a.h, x2 = b.x + b.w / 2, y2 = b.y - 2, my = (y1 + y2) / 2;
      links.push(`M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`);
    }
  }
  return { W, H, boxes, links };
}

/** Fan in/out when either side has one node; otherwise pair by position. */
function pairs(a: Box[], b: Box[]): [Box, Box][] {
  if (a.length === 1 || b.length === 1) return a.flatMap((x) => b.map((y) => [x, y] as [Box, Box]));
  return a.map((x, i) => [x, b[Math.min(i, b.length - 1)]] as [Box, Box]);
}

function tone(stage: number, last: number) {
  if (stage === last) return { fill: "#0B1220", stroke: "#0B1220", label: "#FFFFFF", sub: "#CBD5E1", badge: "#2563EB", badgeText: "#FFFFFF" };
  if (stage === 0) return { fill: "#FFFFFF", stroke: "#CBD5E1", label: "#1E3A8A", sub: "#5A6A80", badge: "#E2E8F0", badgeText: "#334155" };
  return { fill: "#EFF4FF", stroke: "#C7D2FE", label: "#1E3A8A", sub: "#475569", badge: "#2563EB", badgeText: "#FFFFFF" };
}

function Svg({ spec, layout, uid, className }: { spec: FlowSpec; layout: ReturnType<typeof layoutHorizontal>; uid: string; className: string }) {
  const { W, H, boxes, links } = layout;
  const last = spec.stages.length - 1;
  const arrow = `${uid}-arrow`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="img" aria-label={spec.title} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id={arrow} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#94A3B8" />
        </marker>
      </defs>
      <rect width={W} height={H} rx="12" fill="#F8FAFC" />
      {links.map((d, i) => (
        <g key={i}>
          <path d={d} fill="none" stroke="#CBD5E1" strokeWidth="2" markerEnd={`url(#${arrow})`} />
          <path d={d} fill="none" stroke="#2563EB" strokeWidth="2.25" strokeLinecap="round" className="onam-flow-dash" style={{ animationDelay: `${(i % 5) * -0.35}s` }} />
        </g>
      ))}
      {boxes.flat().map((b, i) => {
        const t = tone(b.stage, last);
        const cx = b.x + b.w / 2;
        let ty = b.y + 26;
        return (
          <g key={i}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="10" fill={t.fill} stroke={t.stroke} strokeWidth="1.5" />
            <circle cx={b.x + 14} cy={b.y + 14} r="8" fill={t.badge} />
            <text x={b.x + 14} y={b.y + 17.5} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={t.badgeText}>
              {b.stage + 1}
            </text>
            {b.label.map((l, j) => {
              const el = (
                <text key={`l${j}`} x={cx} y={ty + 6} textAnchor="middle" fontSize="13" fontWeight="700" fill={t.label}>
                  {l}
                </text>
              );
              ty += LABEL_LH;
              return el;
            })}
            {b.sub.length > 0 &&
              b.sub.map((l, j) => (
                <text key={`s${j}`} x={cx} y={ty + 10 + j * SUB_LH} textAnchor="middle" fontSize="11" fill={t.sub}>
                  {l}
                </text>
              ))}
          </g>
        );
      })}
    </svg>
  );
}

export function FlowDiagram({ spec }: { spec: FlowSpec }) {
  const uid = `flow${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  if (!spec.stages.length) return null;
  return (
    <figure className="my-8">
      <Svg spec={spec} layout={layoutHorizontal(spec)} uid={`${uid}h`} className="hidden md:block w-full h-auto rounded-xl border border-[#E5E9F0]" />
      <Svg spec={spec} layout={layoutVertical(spec)} uid={`${uid}v`} className="md:hidden w-full h-auto rounded-xl border border-[#E5E9F0]" />
      <figcaption className="mt-2.5 text-center text-[13px] text-[#5A6A80]">{spec.title}</figcaption>
      <ol className="sr-only">
        {spec.stages.map((stage, s) => (
          <li key={s}>
            {`Step ${s + 1}: `}
            {stage.map((n) => (n.sub ? `${n.label} (${n.sub})` : n.label)).join("; ")}
          </li>
        ))}
      </ol>
    </figure>
  );
}
