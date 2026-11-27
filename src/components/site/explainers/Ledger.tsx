import type { ReactNode } from "react";
import { CheckCircle2, Circle } from "@/components/site/icons";

/**
 * :::ledger
 * + Finds managed AI services on AWS, Azure and Google Cloud
 * - Send prompts to your models or red-team them
 * :::
 *
 * Claims and limits side by side, in neutral ink ("What it checks" / "What it does not do").
 * Replaces the amber :::limits callout on pages that use the visual format.
 */
export function Ledger({
  yes,
  no,
  yesTitle = "What it checks",
  noTitle = "What it does not do (today)",
  renderInline,
}: {
  yes: string[];
  no: string[];
  yesTitle?: string;
  noTitle?: string;
  renderInline: (s: string) => ReactNode;
}) {
  return (
    <div className="my-8 grid gap-8 md:grid-cols-2 md:gap-10">
      <div>
        <h3 className="flex items-center gap-2 font-display text-[18px] font-bold text-ink">
          <CheckCircle2 className="h-5 w-5 text-onam-green" aria-hidden /> {yesTitle}
        </h3>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {yes.map((t, i) => (
            <li key={i} className="flex gap-3 py-3 text-[15px] leading-[24px] text-navy-600">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-onam-green" aria-hidden />
              <span>{renderInline(t)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="flex items-center gap-2 font-display text-[18px] font-bold text-ink">
          <Circle className="h-5 w-5 text-muted-500" aria-hidden /> {noTitle}
        </h3>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {no.map((t, i) => (
            <li key={i} className="flex gap-3 py-3 text-[15px] leading-[24px] text-navy-600">
              <Circle className="mt-1 h-4 w-4 shrink-0 text-muted-500" aria-hidden />
              <span>{renderInline(t)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
