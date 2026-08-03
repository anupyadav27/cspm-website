/**
 * Onam Security "True North" brand mark + lockup.
 * Self-contained — no router or CSS dependencies. Drop into any React app.
 *
 * variant="light" → for light backgrounds (navy + blue star, blue wordmark)
 * variant="dark"  → for dark backgrounds  (ice + light-blue star, white wordmark)
 * variant="mono"  → single-color white (overlays, loading screens)
 */
import type { CSSProperties } from "react";

const C = {
  light: { v: "#082869", h: "#2563EB", dot: "#FFFFFF", word: "#2563EB", sub: "#2563EB" },
  dark: { v: "#E9EFFA", h: "#6AA2FF", dot: "#0B1220", word: "#F2F6FC", sub: "#9FB0CB" },
  mono: { v: "#FFFFFF", h: "#FFFFFF", dot: "#2563EB", word: "#FFFFFF", sub: "#FFFFFF" },
} as const;

export type OnamVariant = keyof typeof C;

export function OnamMark({
  size = 22,
  variant = "light",
  className,
}: {
  size?: number;
  variant?: OnamVariant;
  className?: string;
}) {
  const c = C[variant];
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" className={className} aria-hidden>
      <polygon points="40,6 48.5,40 40,74 31.5,40" fill={c.v} />
      <polygon points="12,40 40,31.5 68,40 40,48.5" fill={c.h} opacity={variant === "mono" ? 0.85 : 1} />
      <circle cx="40" cy="40" r="3" fill={c.dot} />
    </svg>
  );
}

export function OnamLogo({
  markSize = 23,
  fontSize = 19,
  variant = "light",
  className,
  style,
}: {
  markSize?: number;
  fontSize?: number;
  variant?: OnamVariant;
  className?: string;
  style?: CSSProperties;
}) {
  const c = C[variant];
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: Math.round(markSize * 0.35),
        fontFamily: '"Plus Jakarta Sans", Inter, system-ui, sans-serif',
        fontWeight: 800,
        fontSize,
        letterSpacing: "-0.01em",
        lineHeight: 1,
        color: c.word,
        ...style,
      }}
    >
      <OnamMark size={markSize} variant={variant} />
      <span>
        Onam <span style={{ fontWeight: 600, color: c.sub }}>Security</span>
      </span>
    </span>
  );
}
