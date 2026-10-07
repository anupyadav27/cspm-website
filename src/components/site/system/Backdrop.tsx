import { useId } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Banner backdrop — the one background treatment for every page hero
 * (WEBSITE-V2-PLAN.md §4, "Banners"). Drop it as the FIRST child of a hero
 * section that is `relative overflow-hidden`; it paints behind the content.
 *
 *   tone="night"  dark band: homepage, Why Onam, the five product pages
 *   tone="light"  tinted band: engine, solution, resource and company pages
 *
 * Layers, back to front: tint/glow in the page's colour -> a pattern that says
 * what the page is about -> an optional oversized icon, faint, on the right ->
 * a fade so the next section starts clean. Purely decorative (aria-hidden), no
 * text, no numbers, so nothing in it can drift from the product.
 */
export type BackdropPattern = "graph" | "grid" | "dots" | "flow" | "rings";

function Pattern({ kind, id, stroke, opacity }: { kind: BackdropPattern; id: string; stroke: string; opacity: number }) {
  // Each pattern is a tile repeated across the band.
  const tiles: Record<BackdropPattern, { w: number; h: number; body: React.ReactNode }> = {
    // A network: nodes joined by edges — inventory, attack paths, agents.
    graph: {
      w: 220,
      h: 180,
      body: (
        <g fill="none" stroke={stroke} strokeWidth="1">
          <path d="M20 30 L95 70 L170 25 M95 70 L120 150 L200 130 M95 70 L40 140 L120 150" />
          {[[20, 30], [95, 70], [170, 25], [120, 150], [200, 130], [40, 140]].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="3.2" fill={stroke} stroke="none" />
          ))}
        </g>
      ),
    },
    // Isometric lattice — the platform floor the product art stands on.
    grid: {
      w: 64,
      h: 37,
      body: <path d="M0 18.5 L32 0 L64 18.5 L32 37 Z" fill="none" stroke={stroke} strokeWidth="1" />,
    },
    dots: {
      w: 24,
      h: 24,
      body: <circle cx="2" cy="2" r="1.3" fill={stroke} />,
    },
    // Flowing lines — pipelines, cost over time, docs.
    flow: {
      w: 240,
      h: 60,
      body: <path d="M0 40 C60 10, 120 70, 180 30 S 240 20, 240 40" fill="none" stroke={stroke} strokeWidth="1.2" />,
    },
    // Concentric rings — recovery, reach, coverage.
    rings: {
      w: 260,
      h: 260,
      body: (
        <g fill="none" stroke={stroke} strokeWidth="1">
          <circle cx="130" cy="130" r="40" />
          <circle cx="130" cy="130" r="80" />
          <circle cx="130" cy="130" r="120" />
        </g>
      ),
    },
  };
  const t = tiles[kind];
  return (
    <svg className="absolute inset-0 h-full w-full" style={{ opacity }} aria-hidden>
      <defs>
        <pattern id={id} width={t.w} height={t.h} patternUnits="userSpaceOnUse">
          {t.body}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export function Backdrop({
  tone = "light",
  color = "#2563EB",
  pattern = "graph",
  icon: Icon,
  className,
}: {
  tone?: "light" | "night";
  /** The page's accent: a product colour, a cloud colour, or brand blue. */
  color?: string;
  pattern?: BackdropPattern;
  /** Oversized faint watermark on the right — the page's subject at a glance. */
  icon?: LucideIcon;
  className?: string;
}) {
  const id = `bp-${useId().replace(/[:]/g, "")}`;
  const night = tone === "night";
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {night ? (
        <>
          <div className="absolute inset-0 bg-night" />
          <div
            className="absolute -top-48 -right-40 h-[640px] w-[860px] rounded-full blur-[150px]"
            style={{ background: color, opacity: 0.28 }}
          />
          <div
            className="absolute -bottom-56 -left-40 h-[520px] w-[640px] rounded-full blur-[150px]"
            style={{ background: "#2563EB", opacity: 0.14 }}
          />
        </>
      ) : (
        <>
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, color-mix(in srgb, ${color} 7%, #FFFFFF) 0%, #FFFFFF 85%)`,
            }}
          />
          <div
            className="absolute -top-40 -right-32 h-[520px] w-[720px] rounded-full blur-[140px]"
            style={{ background: color, opacity: 0.16 }}
          />
        </>
      )}

      {/* The pattern fades out toward the content side and the bottom edge. */}
      <div
        className="absolute inset-0"
        style={{
          maskImage: "radial-gradient(ellipse 70% 90% at 85% 20%, #000 0%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 90% at 85% 20%, #000 0%, transparent 75%)",
        }}
      >
        <Pattern kind={pattern} id={id} stroke={night ? "#FFFFFF" : color} opacity={night ? 0.09 : 0.16} />
      </div>

      {Icon && (
        <Icon
          className="absolute -right-10 top-1/2 hidden h-[420px] w-[420px] -translate-y-1/2 rotate-[-8deg] md:block"
          style={{ color: night ? "#FFFFFF" : color, opacity: night ? 0.05 : 0.07 }}
          strokeWidth={0.9}
        />
      )}

      <div
        className="absolute inset-x-0 bottom-0 h-16"
        style={{
          background: night ? "linear-gradient(180deg, transparent, rgba(11,18,32,.6))" : "linear-gradient(180deg, transparent, #FFFFFF)",
        }}
      />
    </div>
  );
}
