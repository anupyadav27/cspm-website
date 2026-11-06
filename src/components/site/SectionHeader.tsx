import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  gradientWords,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  light?: boolean;
  gradientWords?: string;
}) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  const renderTitle = () => {
    if (!gradientWords) return title;
    const parts = title.split(gradientWords);
    return (
      <>
        {parts[0]}
        <span className="gradient-text">{gradientWords}</span>
        {parts[1]}
      </>
    );
  };
  return (
    <div className={cn("max-w-3xl", alignCls)}>
      {eyebrow && (
        <div className="mb-3 text-sm font-semibold text-[#1D4ED8]">
          {eyebrow}
        </div>
      )}
      <h2 className="font-display font-bold tracking-tight text-3xl md:text-[38px] leading-[1.1] text-[#0B1220]">
        {renderTitle()}
      </h2>
      {subtitle && (
        <p className="mt-4 text-[17px] leading-relaxed text-[#475569]">{subtitle}</p>
      )}
    </div>
  );
}
