import { cn } from "@/lib/utils";

/**
 * How-it-works "smart art": a numbered rail drawn as inline SVG (md and up), with
 * the full step text beneath it. On a phone the rail gives way to a vertical
 * timeline. The rail is decorative (aria-hidden); the ordered list carries the content.
 */
export function StepsDiagram({
  titles,
  steps,
  color,
}: {
  titles: string[];
  steps: string[];
  color: string;
}) {
  const n = steps.length;
  const col = 200;
  const w = n * col;
  const h = 72;
  const r = 22;
  const cx = (i: number) => i * col + col / 2;
  const tone = `color-mix(in srgb, ${color} 72%, var(--color-ink))`;
  const markerId = `steps-arrow-${n}-${color.replace(/[^a-z0-9]/gi, "")}`;
  const cols = n <= 4 ? "lg:grid-cols-4" : n === 6 ? "lg:grid-cols-3" : "lg:grid-cols-4";

  return (
    <div>
      {/* Rail: md+ */}
      <div className="hidden md:block" aria-hidden>
        <svg viewBox={`0 0 ${w} ${h}`} className="block w-full h-auto" role="presentation">
          <defs>
            <marker
              id={markerId}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path d="M0,0 L10,5 L0,10 z" fill={color} opacity="0.55" />
            </marker>
            <linearGradient id={`${markerId}-g`} x1="0" x2="1">
              <stop offset="0" stopColor={color} stopOpacity="0.25" />
              <stop offset="1" stopColor={color} stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {Array.from({ length: n - 1 }, (_, i) => (
            <line
              key={i}
              x1={cx(i) + r + 6}
              y1={h / 2}
              x2={cx(i + 1) - r - 8}
              y2={h / 2}
              stroke={`url(#${markerId}-g)`}
              strokeWidth="2"
              strokeDasharray="4 5"
              markerEnd={`url(#${markerId})`}
            />
          ))}
          {Array.from({ length: n }, (_, i) => (
            <g key={i}>
              <circle cx={cx(i)} cy={h / 2} r={r + 8} fill={color} opacity="0.08" />
              <circle cx={cx(i)} cy={h / 2} r={r} fill="white" stroke={color} strokeWidth="2" />
              <text
                x={cx(i)}
                y={h / 2}
                dy="0.36em"
                textAnchor="middle"
                fontSize="18"
                fontWeight="800"
                fill={tone}
                fontFamily="inherit"
              >
                {i + 1}
              </text>
            </g>
          ))}
        </svg>
        <div className="grid mt-2" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {titles.map((t) => (
            <div
              key={t}
              className="px-2 text-center text-sm font-semibold text-ink leading-snug text-balance"
            >
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* Detail: a timeline on phones, a card grid from md */}
      <ol className={cn("mt-0 md:mt-12 grid gap-4 md:grid-cols-2", cols)}>
        {steps.map((s, i) => (
          <li
            key={i}
            className="relative flex gap-4 md:block rounded-2xl md:border md:border-line md:bg-white md:p-5 md:shadow-[0_1px_2px_rgba(16,24,40,.04)]"
          >
            {i < n - 1 && (
              <span
                aria-hidden
                className="md:hidden absolute left-[17px] top-10 bottom-[-16px] w-px"
                style={{ backgroundColor: `color-mix(in srgb, ${color} 30%, transparent)` }}
              />
            )}
            <span
              className="relative z-10 shrink-0 w-9 h-9 rounded-full grid place-items-center text-sm font-extrabold bg-white"
              style={{ color: tone, boxShadow: `inset 0 0 0 2px ${color}` }}
            >
              {i + 1}
            </span>
            <div className="min-w-0 pb-2 md:pb-0">
              <div className="md:mt-4 font-display font-bold text-ink">{titles[i]}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-body">{s}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
