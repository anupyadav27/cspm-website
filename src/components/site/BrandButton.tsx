import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  to?: string;
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  className?: string;
};

export function BrandButton({ to, href, children, variant = "primary", size = "md", className }: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-[10px] transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/40";
  const sizes = { md: "px-4 py-2.5 text-sm", lg: "px-5 py-3 text-[15px]" };
  const variants = {
    primary:
      "bg-[#2563EB] text-white shadow-[0_1px_2px_rgba(16,24,40,.06),0_4px_10px_rgba(37,99,235,.20)] hover:bg-[#1D4ED8] hover:shadow-[0_2px_4px_rgba(16,24,40,.08),0_8px_18px_rgba(37,99,235,.28)] hover:-translate-y-[1px]",
    secondary:
      "bg-white text-[#0B1220] border border-[#CBD5E1] hover:bg-[#F1F5F9] hover:border-[#94A3B8]",
    ghost: "text-slate-600 hover:text-[#2563EB]",
  };
  const cls = cn(base, sizes[size], variants[variant], className);
  if (href) return <a href={href} className={cls}>{children}</a>;
  return (
    <Link to={to ?? "/"} className={cls}>
      {children}
    </Link>
  );
}
