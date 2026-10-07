/**
 * Draws the five product illustrations in public/images/products/*.svg.
 *
 * One isometric template, five scenes, so the set stays visually in step: the same
 * light platform, the same light source, each product in its own colour. The scenes
 * are symbolic — no numbers, no screenshots, no third-party logos — so there is
 * nothing in them that can drift from what the products do.
 *
 *   node scripts/generate-product-art.mjs
 *
 * Reviewed under IMAGE-REVIEW-CHECKLIST.md (Onam-Service-platform/marketing/onam-assets).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const out = resolve(dirname(fileURLToPath(import.meta.url)), "..", "public", "images", "products");
mkdirSync(out, { recursive: true });

const W = 640, H = 420, CX = 320, CY = 214, K = 26;
const iso = (x, y, z = 0) => [CX + (x - y) * K * 0.866, CY + (x + y) * K * 0.5 - z * K];
const pts = (a) => a.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

function hex(c) {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mix(c, w, t) {
  const a = hex(c), b = hex(w);
  return "#" + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, "0")).join("");
}
const tint = (c, t) => mix(c, "#FFFFFF", t);
const shade = (c, t) => mix(c, "#0B1220", t);

/** Isometric box with three shaded faces. */
function box(x, y, z, w, d, h, c, { op = 1, stroke = true } = {}) {
  const top = [iso(x, y, z + h), iso(x + w, y, z + h), iso(x + w, y + d, z + h), iso(x, y + d, z + h)];
  const left = [iso(x, y + d, z), iso(x + w, y + d, z), iso(x + w, y + d, z + h), iso(x, y + d, z + h)];
  const right = [iso(x + w, y, z), iso(x + w, y + d, z), iso(x + w, y + d, z + h), iso(x + w, y, z + h)];
  const s = stroke ? ` stroke="${tint(c, 0.55)}" stroke-width="0.8" stroke-linejoin="round"` : "";
  return `<g opacity="${op}">
  <polygon points="${pts(left)}" fill="${c}"${s}/>
  <polygon points="${pts(right)}" fill="${shade(c, 0.22)}"${s}/>
  <polygon points="${pts(top)}" fill="${tint(c, 0.35)}"${s}/>
</g>`;
}

/** Server: a box with two lit slots on the front face. */
function server(x, y, c, h = 1.6) {
  let g = box(x, y, 0, 1.2, 1.2, h, c);
  for (let i = 0; i < 2; i++) {
    const z = 0.45 + i * 0.5;
    const a = iso(x + 0.2, y + 1.2, z), b = iso(x + 0.9, y + 1.2, z);
    g += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${tint(c, 0.75)}" stroke-width="2" stroke-linecap="round"/>`;
  }
  return g;
}

/** Database: a stacked cylinder at a grid point. */
function db(x, y, c, h = 1.5, r = 0.75) {
  const [sx, sy] = iso(x, y, 0);
  const rx = r * K * 1.0, ry = rx * 0.5, hh = h * K;
  let g = `<path d="M${sx - rx},${sy} v${-hh} a${rx},${ry} 0 0 0 ${2 * rx},0 v${hh} a${rx},${ry} 0 0 1 ${-2 * rx},0 z" fill="${shade(c, 0.1)}"/>`;
  g += `<path d="M${sx - rx},${sy} v${-hh} h${rx} v${hh + ry} a${rx},${ry} 0 0 1 ${-rx},${-ry} z" fill="${c}"/>`;
  for (let i = 1; i < 3; i++) {
    const yy = sy - (hh * i) / 3;
    g += `<path d="M${sx - rx},${yy} a${rx},${ry} 0 0 0 ${2 * rx},0" fill="none" stroke="${tint(c, 0.6)}" stroke-width="1.2"/>`;
  }
  g += `<ellipse cx="${sx}" cy="${sy - hh}" rx="${rx}" ry="${ry}" fill="${tint(c, 0.4)}" stroke="${tint(c, 0.65)}" stroke-width="0.8"/>`;
  return g;
}

/** A line on the top plane of the platform, between two grid points. */
function edge(a, b, c, { dash = false, w = 2.2, z = 0.02 } = {}) {
  const [x1, y1] = iso(a[0], a[1], z), [x2, y2] = iso(b[0], b[1], z);
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash ? ' stroke-dasharray="5 6"' : ""}/>`;
}
function node(a, c, r = 5) {
  const [x, y] = iso(a[0], a[1], 0.02);
  return `<ellipse cx="${x}" cy="${y}" rx="${r * 1.4}" ry="${r * 0.8}" fill="${c}" stroke="#FFFFFF" stroke-width="1.5"/>`;
}

/** A floating badge (screen-space disc with a glyph), with a soft drop line to the platform. */
function badge(gx, gy, z, c, glyph) {
  const [x, y] = iso(gx, gy, z);
  const [fx, fy] = iso(gx, gy, 0);
  return `<line x1="${x}" y1="${y + 30}" x2="${fx}" y2="${fy}" stroke="${tint(c, 0.4)}" stroke-width="1.5" stroke-dasharray="2 4"/>
<ellipse cx="${fx}" cy="${fy}" rx="20" ry="10" fill="${tint(c, 0.7)}" opacity=".7"/>
<g transform="translate(${x},${y})" filter="url(#glow)">
  <circle r="30" fill="url(#badge-${c.slice(1)})" stroke="#FFFFFF" stroke-width="3"/>
  ${glyph}
</g>`;
}

const G = {
  check: `<path d="M-11,1 l7,7 l15,-16" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,
  shield: `<path d="M0,-17 l14,5 v9 c0,10 -6,17 -14,20 c-8,-3 -14,-10 -14,-20 v-9 z" fill="#FFFFFF"/><path d="M-6,1 l4,4 l8,-9" fill="none" stroke="#2563EB" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  clock: `<circle r="15" fill="none" stroke="#FFFFFF" stroke-width="4"/><path d="M0,-8 v8 l6,5" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>`,
  coin: `<text x="0" y="9" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="800" font-size="26" fill="#FFFFFF">$</text>`,
  graph: `<circle cx="-9" cy="-7" r="4.5" fill="#FFFFFF"/><circle cx="10" cy="-9" r="4.5" fill="#FFFFFF"/><circle cx="0" cy="10" r="4.5" fill="#FFFFFF"/><path d="M-9,-7 L10,-9 L0,10 Z" fill="none" stroke="#FFFFFF" stroke-width="2.5"/>`,
  person: `<circle cx="0" cy="-7" r="7" fill="#FFFFFF"/><path d="M-13,15 c0,-10 6,-14 13,-14 c7,0 13,4 13,14 z" fill="#FFFFFF"/>`,
};

/** Agent pod: rounded head with two eyes, on a small plinth. */
function agent(gx, gy, c) {
  let g = box(gx - 0.7, gy - 0.7, 0, 1.4, 1.4, 0.35, tint(c, 0.35));
  const [x, y] = iso(gx, gy, 1.35);
  g += `<rect x="${x - 17}" y="${y - 13}" width="34" height="26" rx="11" fill="#FFFFFF" stroke="${tint(c, 0.4)}" stroke-width="1.5"/>
<rect x="${x - 12}" y="${y - 7}" width="24" height="13" rx="6.5" fill="${shade(c, 0.35)}"/>
<circle cx="${x - 5}" cy="${y - 0.5}" r="2.6" fill="#7DD3FC"/><circle cx="${x + 5}" cy="${y - 0.5}" r="2.6" fill="#7DD3FC"/>
<rect x="${x - 10}" y="${y + 13}" width="20" height="9" rx="4" fill="#FFFFFF" stroke="${tint(c, 0.4)}" stroke-width="1.5"/>`;
  return g;
}

function frame(id, title, desc, accent, scene) {
  const plat = box(-5.2, -5.2, -0.5, 10.4, 10.4, 0.5, "#DCE7FB", { stroke: false });
  let grid = "";
  for (let i = -4; i <= 4; i += 2) {
    grid += edge([i, -5.2], [i, 5.2], "#C9D8F5", { w: 0.8 }) + edge([-5.2, i], [5.2, i], "#C9D8F5", { w: 0.8 });
  }
  const bid = accent.slice(1);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="${id}-t ${id}-d">
<title id="${id}-t">${title}</title>
<desc id="${id}-d">${desc} Illustrative; generated by scripts/generate-product-art.mjs.</desc>
<defs>
  <radialGradient id="bg-${id}" cx="50%" cy="42%" r="70%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#F3F7FF"/><stop offset="1" stop-color="${tint(accent, 0.86)}"/></radialGradient>
  <linearGradient id="badge-${bid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${tint(accent, 0.15)}"/><stop offset="1" stop-color="${shade(accent, 0.15)}"/></linearGradient>
  <filter id="glow" x="-60%" y="-60%" width="220%" height="220%"><feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="${accent}" flood-opacity=".35"/></filter>
  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#1E3A8A" flood-opacity=".14"/></filter>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg-${id})"/>
<g filter="url(#soft)">${plat}</g>
${grid}
${scene}
</svg>
`;
}

const BLUE = "#2563EB";

/**
 * Scenes return [depth, svg] pairs; depth is x + y of the object's front corner, so
 * painting in ascending depth puts nearer objects over farther ones. Lines on the
 * platform floor use -99 so every object stands on top of them.
 */
const FLOOR = -99;
const paint = (items) => items.sort((a, b) => a[0] - b[0]).map((i) => i[1]).join("\n");

const scenes = {
  estate: {
    accent: "#7C3AED",
    title: "Onam Estate — one asset graph",
    desc: "Cloud resources of different kinds sit on one platform, joined by relationship lines into a single asset graph.",
    draw(c) {
      const n = { a: [-3.4, -1], b: [-1, -3.4], c: [3, 0.6], d: [0.6, 3], e: [3, -3], f: [-3, 3], h: [0, 0] };
      const L = [];
      [["a", "h"], ["b", "h"], ["c", "h"], ["d", "h"], ["e", "b"], ["e", "c"], ["f", "a"], ["f", "d"]].forEach(([x, y]) =>
        L.push([FLOOR, edge(n[x], n[y], tint(c, 0.25), { w: 2.4 })]),
      );
      Object.values(n).forEach((p) => L.push([FLOOR + 1, node(p, c, 4)]));
      L.push([-2.8, server(-4, -1.6, BLUE)]);
      L.push([-2.8, server(-1.6, -4, "#3B82F6", 2)]);
      L.push([3.6, db(3, 0.6, c)]);
      L.push([3.6, db(0.6, 3, BLUE, 1.2)]);
      L.push([1, server(2.4, -3.6, "#3B82F6", 1.2)]);
      L.push([1, db(-3, 3, "#8B5CF6", 1)]);
      L.push([50, badge(0, 0, 3.4, c, G.graph)]);
      return paint(L);
    },
  },
  security: {
    accent: BLUE,
    title: "Onam Security — the route to a crown jewel, cut",
    desc: "A shield above a protected database; an attack route across the platform is cut at one point.",
    draw(c) {
      const atk = [-3, 3], hop = [-3.6, -0.6], gem = [2, 1];
      const L = [];
      L.push([FLOOR, edge(atk, hop, "#F97316", { dash: true, w: 2.6 })]);
      L.push([FLOOR, edge(hop, [-0.4, 0.2], "#F97316", { dash: true, w: 2.6 })]);
      L.push([FLOOR, edge([-0.4, 0.2], gem, "#CBD5E1", { dash: true, w: 2.6 })]);
      L.push([0.4, server(atk[0] - 0.6, atk[1] - 0.6, "#94A3B8", 1.2)]);
      L.push([-3.6, server(hop[0] - 0.6, hop[1] - 0.6, "#3B82F6", 1.4)]);
      L.push([-0.5, server(2.2, -3.4, "#3B82F6", 1.6)]);
      L.push([5.6, box(0.7, -0.3, 0, 2.6, 2.6, 0.3, tint(c, 0.5))]);
      L.push([5.7, db(gem[0], gem[1], c, 1.8, 0.85)]);
      const [mx, my] = iso(-0.4, 0.2, 0.4);
      L.push([0, `<g transform="translate(${mx},${my})"><circle r="13" fill="#10B981" stroke="#FFFFFF" stroke-width="3"/><path d="M-5,0 l3.5,3.5 l6.5,-7" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>`]);
      L.push([50, badge(gem[0], gem[1], 4.2, c, G.shield.replace("#2563EB", c))]);
      return paint(L);
    },
  },
  finops: {
    accent: "#059669",
    title: "Onam FinOps — what it costs, and who owns it",
    desc: "Daily cost bars rise across the platform beside a stack of coins and an ownership tag.",
    draw(c) {
      const L = [];
      [0.6, 1.1, 0.9, 1.6, 1.3, 2.1].forEach((h, i) => {
        const x = -4.2 + i * 1.05, y = 1.2;
        L.push([x + y + 0.75, box(x, y, 0, 0.75, 0.75, h, i === 5 ? c : tint(c, 0.25))]);
      });
      L.push([-4, box(-3, -4, 0, 2.6, 1.6, 0.25, tint(BLUE, 0.6))]);
      const [tx, ty] = iso(-1.7, -3.2, 0.6);
      L.push([-3.9, `<g transform="translate(${tx},${ty})"><path d="M-26,-12 h38 l14,12 l-14,12 h-38 z" fill="#FFFFFF" stroke="${tint(c, 0.3)}" stroke-width="2"/><circle cx="12" cy="0" r="3.5" fill="${c}"/><rect x="-19" y="-4" width="22" height="3" rx="1.5" fill="${tint(c, 0.4)}"/><rect x="-19" y="2" width="14" height="3" rx="1.5" fill="${tint(c, 0.6)}"/></g>`]);
      let coins = "";
      [0, 0.32, 0.64, 0.96].forEach((z) => {
        const [x, y] = iso(3.4, -3.6, z);
        coins += `<ellipse cx="${x}" cy="${y}" rx="22" ry="11" fill="${shade("#F59E0B", 0.1)}"/><ellipse cx="${x}" cy="${y - 5}" rx="22" ry="11" fill="#FBBF24" stroke="#FDE68A" stroke-width="1"/>`;
      });
      L.push([1, coins]);
      L.push([50, badge(4, 1.6, 2.6, c, G.coin)]);
      return paint(L);
    },
  },
  drm: {
    accent: "#D97706",
    title: "Onam DRM — what comes back, in what order",
    desc: "Two cloud regions on one platform with a replication link from the primary to the recovery region, and a recovery clock.",
    draw(c) {
      const L = [];
      L.push([-90, box(-4.6, -4.6, 0, 4, 4, 0.3, "#BFD3F6")]);
      L.push([-89, box(0.6, 0.6, 0, 4, 4, 0.3, tint(c, 0.55))]);
      L.push([-88, edge([-1.4, -1.4], [1.4, 1.4], c, { dash: true, w: 3, z: 0.4 })]);
      const [ax, ay] = iso(1.1, 1.1, 0.4);
      L.push([-87, `<path d="M${ax - 10},${ay - 9} L${ax + 3},${ay + 1} L${ax - 12},${ay + 4} z" fill="${c}"/>`]);
      L.push([-5.2, server(-3.8, -3.8, "#3B82F6", 1.5)]);
      L.push([-3.4, db(-1.6, -1.8, BLUE, 1.2, 0.6)]);
      L.push([5.2, server(1.4, 1.4, tint(c, 0.15), 1.5)]);
      L.push([7, db(3.6, 3.4, c, 1.2, 0.6)]);
      L.push([50, badge(3, -3, 3, c, G.clock)]);
      return paint(L);
    },
  },
  aiops: {
    accent: "#4F46E5",
    title: "Onam AIOps — agents propose, a person approves",
    desc: "Specialist AI agents around the platform are connected to one approval point, where a person signs off before anything changes.",
    draw(c) {
      const pods = [[-3.6, 0], [0, -3.6], [2.7, -2.5], [3.4, 0.6], [0.6, 3.4], [-2.5, 2.7]];
      const L = [[-90, box(-1.2, -1.2, 0, 2.4, 2.4, 0.4, tint("#F59E0B", 0.55))]];
      pods.forEach((p) => L.push([FLOOR, edge(p, [0, 0], tint(c, 0.3), { w: 2.2 })]));
      L.push([FLOOR + 1, node([0, 0], "#F59E0B", 5)]);
      pods.forEach((p) => L.push([p[0] + p[1], agent(p[0], p[1], c)]));
      const [x, y] = iso(0, 0, 3.6);
      L.push([50, badge(0, 0, 3.6, c, G.person)]);
      L.push([51, `<g transform="translate(${x + 24},${y + 20})"><circle r="11" fill="#10B981" stroke="#FFFFFF" stroke-width="2.5"/><path d="M-4.5,0 l3,3 l6,-6.5" fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></g>`]);
      return paint(L);
    },
  },
};

for (const [id, sc] of Object.entries(scenes)) {
  writeFileSync(resolve(out, `${id}.svg`), frame(id, sc.title, sc.desc, sc.accent, sc.draw(sc.accent)));
  console.log(`wrote public/images/products/${id}.svg`);
}
