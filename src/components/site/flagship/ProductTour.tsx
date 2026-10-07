import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BrowserFrame, Figure, IconTile } from "@/components/site/system";
import { cn } from "@/lib/utils";
import type { TourStop } from "./types";

/**
 * The product tour, tabbed by module. WAI-ARIA tabs: arrow keys, Home and End move
 * between tabs (roving tabindex); every panel is rendered, hidden ones with `hidden`,
 * so all of the copy is in the HTML.
 *
 * A stop with a `shot` shows the real console capture in a BrowserFrame. A stop
 * without one shows the view in words — never a hand-made mock screen.
 */
export function ProductTour({
  stops,
  color,
  docsFor,
  iconFor,
  caption,
  illustration,
}: {
  stops: TourStop[];
  color: string;
  docsFor: (module: string) => string | undefined;
  iconFor: (module: string) => LucideIcon;
  caption?: string;
  /** Shown beside the words when the product has no real captures yet. */
  illustration?: { src: string; alt: string };
}) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const base = useId();
  const tone = `color-mix(in srgb, ${color} 72%, var(--color-ink))`;

  const focus = (i: number) => {
    const n = (i + stops.length) % stops.length;
    setActive(n);
    tabs.current[n]?.focus();
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const map: Record<string, number> = {
      ArrowRight: i + 1,
      ArrowDown: i + 1,
      ArrowLeft: i - 1,
      ArrowUp: i - 1,
      Home: 0,
      End: stops.length - 1,
    };
    if (e.key in map) {
      e.preventDefault();
      focus(map[e.key]);
    }
  };

  const hasShots = stops.some((s) => s.shot);

  return (
    <div>
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
        <div
          role="tablist"
          aria-label="Views in the console"
          aria-orientation="horizontal"
          className="inline-flex min-w-full sm:min-w-0 gap-1 rounded-xl border border-line bg-surface p-1"
        >
          {stops.map((s, i) => {
            const Icon = iconFor(s.module);
            const selected = i === active;
            return (
              <button
                key={s.module}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`${base}-tab-${i}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`${base}-panel-${i}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKey(e, i)}
                className={cn(
                  "inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-semibold transition",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50",
                  selected
                    ? "bg-white text-ink shadow-[0_1px_3px_rgba(16,24,40,.10)]"
                    : "text-body hover:text-ink",
                )}
              >
                <Icon
                  className="w-4 h-4"
                  style={{ color: selected ? color : undefined }}
                  aria-hidden
                />
                {s.module}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={cn(
          "mt-8",
          !hasShots && illustration && "lg:grid lg:grid-cols-[1fr_1.1fr] lg:gap-10 lg:items-start",
        )}
      >
        {!hasShots && illustration && (
          <Figure
            illustrative
            caption="The views below are described from the product documentation."
            className="hidden lg:block"
          >
            <div className="rounded-2xl border border-line bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,.04),0_12px_32px_rgba(16,24,40,.06)]">
              <img
                src={illustration.src}
                alt={illustration.alt}
                width={640}
                height={420}
                loading="lazy"
                className="block w-full h-auto"
              />
            </div>
          </Figure>
        )}

        <div>
          {stops.map((s, i) => {
            const docs = docsFor(s.module);
            const words = (
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <IconTile icon={iconFor(s.module)} color={color} size="sm" />
                  <div
                    className="text-xs font-semibold uppercase tracking-[0.12em]"
                    style={{ color: tone }}
                  >
                    {s.module}
                  </div>
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink">
                  {s.title}
                </h3>
                <p className="mt-3 text-body leading-relaxed">{s.body}</p>
                <ul className="mt-5 space-y-3">
                  {s.shows.map((x) => (
                    <li key={x} className="flex gap-3 text-sm leading-relaxed text-body">
                      <Check
                        className="mt-0.5 w-4 h-4 shrink-0"
                        style={{ color: tone }}
                        aria-hidden
                      />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
                {docs && (
                  <Link
                    to={docs}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500 hover:text-brand-600"
                  >
                    Read about {s.module} in the docs <ArrowRight className="w-4 h-4" aria-hidden />
                  </Link>
                )}
              </div>
            );
            return (
              <div
                key={s.module}
                id={`${base}-panel-${i}`}
                role="tabpanel"
                aria-labelledby={`${base}-tab-${i}`}
                tabIndex={0}
                hidden={i !== active}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 rounded-2xl"
              >
                {s.shot ? (
                  <div className="grid gap-8 lg:grid-cols-[1fr_2.2fr] lg:items-start">
                    {words}
                    <Figure caption={caption}>
                      <BrowserFrame
                        src={s.shot.src}
                        alt={s.shot.alt}
                        url={s.shot.url}
                        width={s.shot.width}
                        height={s.shot.height}
                      />
                    </Figure>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-line bg-white p-6 md:p-8 shadow-[0_1px_2px_rgba(16,24,40,.04),0_1px_3px_rgba(16,24,40,.06)]">
                    {words}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
