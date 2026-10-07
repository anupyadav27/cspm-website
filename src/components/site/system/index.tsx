import type { CSSProperties, ElementType, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The website's shared building blocks (WEBSITE-V2-PLAN.md §4). New sections are
 * built from these so spacing, type and colour stay one system. Colours are the
 * @theme tokens in src/styles.css — no raw hex in new code.
 */

export { StatusBadge as StatusChip } from "@/components/site/ops/OpsUi";
export { BrandButton as Button } from "@/components/site/BrandButton";

type Tone = "white" | "surface" | "night";

const TONE: Record<Tone, string> = {
  white: "bg-white",
  surface: "bg-surface",
  night: "bg-night text-white",
};

/** A page band: one vertical rhythm for every section on the site. */
export function Section({
  id,
  tone = "white",
  className,
  children,
  bordered = true,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  children: ReactNode;
  bordered?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-16 md:py-24 scroll-mt-20",
        TONE[tone],
        bordered && (tone === "night" ? "border-b border-white/10" : "border-b border-line"),
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Container({
  className,
  children,
  narrow = false,
}: {
  className?: string;
  children: ReactNode;
  narrow?: boolean;
}) {
  return (
    <div className={cn("mx-auto px-4 sm:px-6", narrow ? "max-w-3xl" : "max-w-7xl", className)}>
      {children}
    </div>
  );
}

/** The small uppercase label above a heading. */
export function Eyebrow({
  children,
  color,
  onNight = false,
  className,
}: {
  children: ReactNode;
  color?: string;
  onNight?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "text-xs uppercase tracking-[0.12em] font-semibold",
        onNight ? "text-on-night-muted" : "text-brand-500",
        className,
      )}
      style={color ? { color } : undefined}
    >
      {children}
    </div>
  );
}

/** Eyebrow + h2 + lead, left or centred. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  onNight = false,
  as: Tag = "h2",
  className,
  eyebrowColor,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  onNight?: boolean;
  as?: ElementType;
  className?: string;
  eyebrowColor?: string;
}) {
  return (
    <div
      className={cn(align === "center" ? "mx-auto text-center max-w-3xl" : "max-w-3xl", className)}
    >
      {eyebrow && (
        <Eyebrow onNight={onNight} color={eyebrowColor}>
          {eyebrow}
        </Eyebrow>
      )}
      <Tag
        className={cn(
          "mt-3 font-display font-extrabold tracking-tight text-balance text-3xl md:text-[40px] leading-[1.1]",
          onNight ? "text-white" : "text-ink",
        )}
      >
        {title}
      </Tag>
      {lead && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed text-pretty",
            onNight ? "text-on-night-muted" : "text-body",
          )}
        >
          {lead}
        </p>
      )}
    </div>
  );
}

/** A tinted square holding a lucide icon in a product or accent colour. */
export function IconTile({
  icon: Icon,
  color,
  size = "md",
  className,
}: {
  icon: LucideIcon;
  color: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const box = { sm: "w-8 h-8 rounded-lg", md: "w-10 h-10 rounded-xl", lg: "w-12 h-12 rounded-xl" }[
    size
  ];
  const ic = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" }[size];
  return (
    <span
      className={cn("shrink-0 grid place-items-center", box, className)}
      style={{
        backgroundColor: `color-mix(in srgb, ${color} 12%, #FFFFFF)`,
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${color} 22%, transparent)`,
      }}
    >
      <Icon className={ic} style={{ color }} aria-hidden />
    </span>
  );
}

/** Card surface with the three elevation steps the plan allows. */
export function Card({
  className,
  children,
  interactive = false,
  style,
}: {
  className?: string;
  children: ReactNode;
  interactive?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      style={style}
      className={cn(
        "rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(16,24,40,.04),0_1px_3px_rgba(16,24,40,.06)]",
        interactive &&
          "transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(16,24,40,.10)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Browser chrome around a real console screenshot. `url` is shown in the address
 * bar exactly as the product serves it, so the reader can tell where the screen lives.
 */
export function BrowserFrame({
  src,
  alt,
  url,
  width = 1440,
  height = 850,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  url: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-white overflow-hidden shadow-[0_24px_64px_rgba(11,18,32,.16)]",
        className,
      )}
    >
      <div className="flex items-center gap-3 px-4 h-10 border-b border-line bg-surface">
        <span className="flex gap-1.5" aria-hidden>
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </span>
        <span className="flex-1 min-w-0 truncate rounded-md bg-white border border-line px-3 py-1 text-xs text-muted-500 font-mono">
          {url}
        </span>
      </div>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        className="block w-full h-auto"
      />
    </div>
  );
}

/** An image with its caption and, when it is not a real screen, an Illustrative label. */
export function Figure({
  children,
  caption,
  illustrative = false,
  className,
}: {
  children: ReactNode;
  caption?: ReactNode;
  illustrative?: boolean;
  className?: string;
}) {
  return (
    <figure className={cn("min-w-0", className)}>
      {children}
      {(caption || illustrative) && (
        <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm text-muted-500">
          {caption && <span>{caption}</span>}
          {illustrative && <span className="text-xs">Illustrative</span>}
        </figcaption>
      )}
    </figure>
  );
}

export { Backdrop, type BackdropPattern } from "./Backdrop";
