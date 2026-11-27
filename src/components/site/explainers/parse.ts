/**
 * Parsing helpers for the explainer directives (:::hero, :::screen, :::story, :::ledger,
 * :::next, :::switchboard). No React here, so Prose and the components can both import it.
 * Directive bodies stay plain text so writers edit `src/data/docs-articles/*.ts`, not components.
 */

/** `key: value` lines at the top of a body, until the first line that is not one. */
export function parseFields(body: string): { fields: Record<string, string>; rest: string } {
  const lines = body.split("\n");
  const fields: Record<string, string> = {};
  let i = 0;
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const m = /^([a-z][a-z0-9-]*):\s?(.*)$/.exec(line.trim());
    if (!m) break;
    fields[m[1]] = m[2].trim();
  }
  return { fields, rest: lines.slice(i).join("\n").trim() };
}

/** `Label | target` → { label, href }. */
export function splitLink(v: string | undefined): { label: string; href: string } | null {
  if (!v) return null;
  const [label, href] = v.split("|").map((s) => s.trim());
  return label && href ? { label, href } : null;
}

export type Hotspot = { n: number; x: number; y: number; text: string };

/** Lines `1 @ 33.7,26.4: text` → hotspots in % of the image. */
export function parseHotspots(src: string): Hotspot[] {
  const out: Hotspot[] = [];
  for (const line of src.split("\n")) {
    const m = /^\s*(\d+)\s*@\s*([\d.]+)\s*,\s*([\d.]+)\s*:\s*(.+)$/.exec(line);
    if (m) out.push({ n: Number(m[1]), x: Number(m[2]), y: Number(m[3]), text: m[4].trim() });
  }
  return out;
}

/** Ledger lines: `+ checks` and `- does not`. */
export function parseLedger(src: string): { yes: string[]; no: string[] } {
  const yes: string[] = [];
  const no: string[] = [];
  for (const line of src.split("\n")) {
    const t = line.trim();
    if (t.startsWith("+ ")) yes.push(t.slice(2));
    else if (t.startsWith("- ")) no.push(t.slice(2));
  }
  return { yes, no };
}
