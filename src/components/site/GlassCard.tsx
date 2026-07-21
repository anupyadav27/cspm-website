import { cn } from "@/lib/utils";
import { forwardRef, type HTMLAttributes } from "react";

// Renamed conceptually to a light enterprise card, but exported name kept
// for compatibility with existing imports across the site.
export const GlassCard = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { hover?: boolean; gradientBorder?: boolean }
>(({ className, hover = true, gradientBorder = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-white border border-[#E5E9F0] rounded-2xl p-6",
        "shadow-[0_1px_2px_rgba(16,24,40,.04),0_1px_3px_rgba(16,24,40,.06)]",
        hover && "transition-all duration-300 hover:-translate-y-0.5 hover:border-[#CBD5E1] hover:shadow-[0_12px_28px_rgba(16,24,40,.10)]",
        gradientBorder && "gradient-border",
        className,
      )}
      {...props}
    />
  );
});
GlassCard.displayName = "GlassCard";
