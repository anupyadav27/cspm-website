import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
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
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-5 bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
          {eyebrow}
        </div>
      )}
      <h2 className="font-display font-extrabold tracking-tight text-3xl md:text-[42px] leading-[1.1] text-[#0B1220]">
        {renderTitle()}
      </h2>
      {subtitle && (
        <p className="mt-4 text-[17px] leading-relaxed text-[#475569]">{subtitle}</p>
      )}
    </div>
  );
}
