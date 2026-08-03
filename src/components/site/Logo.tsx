import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const BLUE = "#2563EB";
const NAVY = "#082869";

export function CompassMark({ size = 18, className }: { size?: number; className?: string }) {
  // "True North" mark: two-tone four-point star (navy N–S, blue E–W).
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" className={className} aria-hidden>
      <polygon points="40,6 48.5,40 40,74 31.5,40" fill={NAVY} />
      <polygon points="12,40 40,31.5 68,40 40,48.5" fill={BLUE} />
      <circle cx="40" cy="40" r="3" fill="#FFFFFF" />
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
  const mark = size === "lg" ? 28 : size === "sm" ? 18 : 23;

  return (
    <Link to="/" className={cn("inline-flex items-center group", className)}>
      <div className={cn("flex", stacked ? "flex-col items-start gap-1" : "items-center gap-2")}>
        <CompassMark size={mark} />
        <span
          className={cn("font-display font-extrabold tracking-tight leading-none", wordSize)}
          style={{ color: BLUE }}
        >
          Onam <span className="font-semibold">Security</span>
        </span>
      </div>
    </Link>
  );
}
