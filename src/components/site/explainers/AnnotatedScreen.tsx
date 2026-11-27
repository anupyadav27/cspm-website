import { useState, type ReactNode } from "react";
import { Maximize2 } from "@/components/site/icons";
import type { Hotspot } from "./parse";

/**
 * :::screen /screens/ai-security/ais-findings.png
 * url: app.onamsecurity.com/ui/ai-security?tab=findings
 * alt: The AI Security Findings tab …
 * size: 1440x1004
 * caption: Real console, Onam's internal test tenant, captured 26 Nov 2026. Account IDs redacted.
 * 1 @ 29.2,35.9: No guardrail: models and agents without a provider guardrail, counted at the top.
 * 2 @ 11.5,62.3: …
 * :::
 *
 * A real, redacted console capture in browser chrome with numbered hotspots. Pressing a
 * hotspot (or its line in the list) zooms to that region; "Show whole screen" resets.
 * The numbered list under the image is always visible: it is the text equivalent.
 * A `@2x` file next to the image is used for high-density screens when present (`hidpi: yes`).
 */
export function AnnotatedScreen({
  src,
  url,
  alt,
  width,
  height,
  caption,
  hotspots,
  hidpi,
  renderInline,
}: {
  src: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  hotspots: Hotspot[];
  hidpi?: boolean;
  renderInline: (s: string) => ReactNode;
}) {
  const [active, setActive] = useState<number | null>(null);
  const h = hotspots.find((x) => x.n === active);
  const scale = 2;
  // Keep the zoomed region inside the frame.
  const ox = h ? Math.min(Math.max(h.x, 25), 75) : 50;
  const oy = h ? Math.min(Math.max(h.y, 25), 75) : 50;
  const srcSet = hidpi ? `${src} 1x, ${src.replace(/\.(png|webp)$/, "@2x.$1")} 2x` : undefined;

  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_64px_rgba(11,18,32,.14)]">
        <div className="flex h-10 items-center gap-3 border-b border-line bg-surface px-4">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
          </span>
          <span className="min-w-0 flex-1 truncate rounded-md border border-line bg-white px-3 py-1 font-mono text-xs text-muted-500">{url}</span>
          {active !== null && (
            <button
              type="button"
              onClick={() => setActive(null)}
              className="inline-flex min-h-8 items-center gap-1 rounded-md px-2 text-[12px] font-semibold text-brand-600 hover:bg-white"
            >
              <Maximize2 className="h-3.5 w-3.5" aria-hidden /> Show whole screen
            </button>
          )}
        </div>
        <div className="relative overflow-hidden">
          <div
            className="ex-zoom relative"
            style={{
              transform: active !== null ? `scale(${scale})` : "none",
              transformOrigin: `${ox}% ${oy}%`,
            }}
          >
            <img src={src} srcSet={srcSet} alt={alt} width={width} height={height} loading="lazy" className="block h-auto w-full" />
            {hotspots.map((p) => (
              <button
                key={p.n}
                type="button"
                onClick={() => setActive(active === p.n ? null : p.n)}
                aria-pressed={active === p.n}
                aria-label={`Callout ${p.n}: ${p.text}`}
                className={`absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[13px] font-black text-white shadow-[0_0_0_4px_rgba(37,99,235,.25)] ring-2 ring-white transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
                  active === p.n ? "bg-onam-red" : "bg-brand-500 hover:bg-brand-600"
                }`}
                style={{ left: `${p.x}%`, top: `${p.y}%`, ...(active !== null ? { scale: `${1 / scale}` } : {}) }}
              >
                {p.n}
              </button>
            ))}
          </div>
        </div>
      </div>
      <ol className="mt-4 grid gap-2 md:grid-cols-2">
        {hotspots.map((p) => (
          <li key={p.n}>
            <button
              type="button"
              onClick={() => setActive(active === p.n ? null : p.n)}
              className={`flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left transition ${active === p.n ? "bg-tint-blue" : "hover:bg-surface"}`}
            >
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-[12px] font-black text-white">{p.n}</span>
              <span className="text-[15px] leading-[24px] text-navy-600">{renderInline(p.text)}</span>
            </button>
          </li>
        ))}
      </ol>
      {caption && <figcaption className="mt-3 text-[13px] text-muted-500">{caption}</figcaption>}
    </figure>
  );
}
