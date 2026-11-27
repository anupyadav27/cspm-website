import { useEffect, useState } from "react";

/**
 * A "What you connect" tile that slides through the platforms of one kind (SaaS apps, code hosts),
 * one logo at a time with its name under it, so the row of sources stays one row.
 *
 * Motion: one step every 2.4 s, paused while the pointer or focus is in the row, when the visitor
 * asks for reduced motion, or when the row's pause button is pressed (WCAG 2.2.2). The full list is
 * always in the accessible name, so screen readers never depend on the animation.
 * Logos: public/logos/saas/*.svg, sources in public/logos/saas/NOTICE.md (on trial).
 */
export type SliderItem = {
  name: string;
  file: string;
  /** width / height */ ratio: number;
  wordmark?: boolean;
};

export const SAAS_APPS: SliderItem[] = [
  { name: "Microsoft 365", file: "microsoft-365.svg", ratio: 0.91 },
  { name: "Google Workspace", file: "google-workspace.svg", ratio: 7.8, wordmark: true },
  { name: "GitHub", file: "github.svg", ratio: 1 },
  { name: "Okta", file: "okta.svg", ratio: 3.03, wordmark: true },
  { name: "Snowflake", file: "snowflake.svg", ratio: 4.18, wordmark: true },
  { name: "SharePoint", file: "sharepoint.svg", ratio: 1.02 },
  { name: "GitLab", file: "gitlab.svg", ratio: 1.04 },
  { name: "Dynamics 365", file: "dynamics-365.svg", ratio: 1 },
  { name: "Bitbucket Cloud", file: "bitbucket.svg", ratio: 1 },
];

export const CODE_HOSTS: SliderItem[] = [
  { name: "GitHub", file: "github.svg", ratio: 1 },
  { name: "GitLab", file: "gitlab.svg", ratio: 1.04 },
  { name: "Bitbucket", file: "bitbucket.svg", ratio: 1 },
];

function Logo({ item, height, maxWidth }: { item: SliderItem; height: number; maxWidth: number }) {
  const h = Math.min(height, maxWidth / item.ratio);
  return (
    <img
      src={`/logos/saas/${item.file}`}
      alt=""
      height={Math.round(h)}
      width={Math.round(h * item.ratio)}
      style={{ height: h, width: "auto" }}
      loading="lazy"
      decoding="async"
    />
  );
}

export function SourceSlider({
  label,
  items,
  paused,
  offset = 0,
}: {
  label: string;
  items: SliderItem[];
  paused: boolean;
  /** Start delay in steps, so two sliders in a row do not move in lockstep. */
  offset?: number;
}) {
  const [i, setI] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    let t: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      t = setInterval(() => {
        setAnimate(true);
        setI((x) => x + 1);
      }, 2400);
    }, offset * 1200);
    return () => {
      clearTimeout(start);
      if (t) clearInterval(t);
    };
  }, [paused, reduced, offset]);

  // The track ends with a copy of the first logo; after sliding onto it, jump back to the start unseen.
  const onEnd = () => {
    if (i >= items.length) {
      setAnimate(false);
      setI(0);
    }
  };
  const track = [...items, items[0]];
  const shown = items[i % items.length];

  return (
    <div className="flex h-full min-h-[84px] flex-col items-center justify-between gap-1 overflow-hidden px-1 py-2">
      <span className="sr-only">
        {label}: {items.map((x) => x.name).join(", ")}
      </span>
      <div className="relative w-full overflow-hidden" aria-hidden>
        <div
          className={`flex ${animate ? "transition-transform duration-500 ease-out" : ""}`}
          style={{ transform: `translateX(-${i * 100}%)` }}
          onTransitionEnd={onEnd}
        >
          {track.map((it, k) => (
            <div key={k} className="flex h-9 w-full shrink-0 items-center justify-center">
              <Logo item={it} height={it.wordmark ? 22 : 28} maxWidth={92} />
            </div>
          ))}
        </div>
      </div>
      <div className="text-center leading-tight" aria-hidden>
        <div className="text-[12px] font-semibold text-ink-2">{shown.name}</div>
        <div className="mt-0.5 text-[12px] font-medium text-muted-500">{label}</div>
      </div>
    </div>
  );
}
