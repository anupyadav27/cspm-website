import { type ReactNode } from "react";

/**
 * :::limits Honest limits
 * - Onam checks configuration. It does not test prompts.
 * - Other clouds are not covered.
 * :::
 *
 * Body is ordinary markdown (paragraphs and lists).
 */
export function LimitsCallout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside
      aria-label={title}
      className="my-8 rounded-xl border border-[#FCD34D] border-l-4 border-l-[#D97706] bg-[#FFFBEB] px-5 pt-4 pb-1 [&_li]:text-[#78350F] [&_p]:text-[#78350F] [&_ul]:marker:text-[#D97706]"
    >
      <div className="mb-3 flex items-center gap-2">
        <svg aria-hidden viewBox="0 0 20 20" className="h-5 w-5 shrink-0" fill="none">
          <path d="M10 2.5 18 17H2L10 2.5Z" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M10 8v4" stroke="#92400E" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="10" cy="14.4" r="1" fill="#92400E" />
        </svg>
        <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#92400E]">{title}</span>
      </div>
      {children}
    </aside>
  );
}
