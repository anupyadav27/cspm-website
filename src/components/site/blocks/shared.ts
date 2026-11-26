/** Helpers shared by the Prose visual blocks. No React here, so Prose and the blocks can both import it. */

/** Split a block body at `### ` lines into { title, body } sections. Text before the first heading gets title "". */
export function splitByH3(body: string): { title: string; body: string }[] {
  const out: { title: string; body: string[] }[] = [];
  let cur: { title: string; body: string[] } = { title: "", body: [] };
  for (const line of body.split("\n")) {
    if (line.startsWith("### ")) {
      if (cur.title || cur.body.some((l) => l.trim())) out.push(cur);
      cur = { title: line.slice(4).trim(), body: [] };
    } else {
      cur.body.push(line);
    }
  }
  if (cur.title || cur.body.some((l) => l.trim())) out.push(cur);
  return out.map((s) => ({ title: s.title, body: s.body.join("\n").trim() }));
}

/** Markdown-ish text to plain text (links keep their label, emphasis and code marks dropped). */
export function plainText(md: string): string {
  return md
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s*([-*]|\d+\.)\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/[*`_]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Greedy word wrap for SVG text, by character budget. */
export function wrapText(text: string, maxChars: number, maxLines = 3): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = `${kept[maxLines - 1].replace(/[\s,.;:]+$/, "")}…`;
    return kept;
  }
  return lines;
}
