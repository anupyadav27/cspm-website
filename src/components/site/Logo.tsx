import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const BLUE = "#2563EB";
const RED = "#E32D25";
const AMBER = "#F2AF04";
const GREEN = "#05A052";
const NAVY = "#082869";

export function CompassMark({ size = 18, className }: { size?: number; className?: string }) {
  // Four-point compass star, colored quadrants, inside a thin circle.
  const s = size;
  const c = s / 2;
  const r = s / 2 - 1;
  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      className={className}
      aria-hidden
    >
      <circle cx={c} cy={c} r={r} fill="none" stroke={NAVY} strokeWidth="1.25" />
      {/* Top petal (blue) */}
      <polygon points={`${c},${c - r + 1} ${c + 2},${c} ${c},${c} ${c - 2},${c}`} fill={BLUE} />
      {/* Right petal (red) */}
      <polygon points={`${c + r - 1},${c} ${c},${c + 2} ${c},${c} ${c},${c - 2}`} fill={RED} />
      {/* Bottom petal (amber) */}
      <polygon points={`${c},${c + r - 1} ${c - 2},${c} ${c},${c} ${c + 2},${c}`} fill={AMBER} />
      {/* Left petal (green) */}
      <polygon points={`${c - r + 1},${c} ${c},${c - 2} ${c},${c} ${c},${c + 2}`} fill={GREEN} />
      <circle cx={c} cy={c} r="1.2" fill={NAVY} />
    </svg>
  );
}

export function Logo({
  className,
  stacked = false,
  size = "md",
}: {
  className?: string;
  stacked?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const wordSize =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-xl";
  const subSize =
    size === "lg" ? "text-[10px]" : size === "sm" ? "text-[8px]" : "text-[9px]";
  const mark = size === "lg" ? 22 : size === "sm" ? 15 : 18;

  return (
    <Link to="/" className={cn("inline-flex items-center gap-2 group", className)}>
      <div className={cn("flex", stacked ? "flex-col items-start gap-0.5" : "items-center gap-2")}>
        <div className="flex items-center gap-1">
          <span className={cn("font-display font-extrabold tracking-tight leading-none", wordSize)}>
            <span style={{ color: BLUE }}>O</span>
            <span style={{ color: RED }}>N</span>
            <span style={{ color: AMBER }}>A</span>
            <span style={{ color: GREEN }}>M</span>
          </span>
          <CompassMark size={mark} className="translate-y-[1px]" />
        </div>
        <div
          className={cn(
            "font-display font-bold uppercase leading-none",
            subSize,
          )}
          style={{ color: NAVY, letterSpacing: "0.25em" }}
        >
          {stacked ? "" : <span aria-hidden className="mr-1.5 text-slate-400">–</span>}
          Security
        </div>
      </div>
    </Link>
  );
}
