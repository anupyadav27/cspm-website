import type { ReactNode } from "react";
import { ArrowRight } from "@/components/site/icons";

/**
 * :::next Where do you want to go next?
 * ### How does Onam find AI we didn't list? | /docs/ai-security/discovery-and-bom
 * Cloud roles, a read-only ServiceAccount and your SBOMs.
 * ### Run a free audit scan | /audit-scan | cta
 * One read-only scan, no commitment.
 * :::
 *
 * A night band of question cards. The whole card is the link. A third `| cta` field marks
 * the call-to-action card (shown in brand blue).
 */
export type NextCard = { q: string; href: string; cta: boolean; preview: string };

export function NextQuestions({ title, cards, renderInline }: { title?: string; cards: NextCard[]; renderInline: (s: string) => ReactNode }) {
  return (
    <section aria-label={title || "Next questions"} className="relative -mx-4 my-12 bg-night px-5 py-8 sm:mx-0 sm:rounded-2xl sm:px-8 md:py-10">
      {title && <h2 className="font-display text-[26px] font-bold leading-[32px] text-white md:text-[32px] md:leading-[38px]">{title}</h2>}
      <ul className="mt-6 grid gap-3 md:grid-cols-2">
        {cards.map((c) => (
          <li key={c.href + c.q}>
            <a
              href={c.href}
              className={`group flex h-full min-h-11 items-start justify-between gap-4 rounded-xl p-4 ring-1 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4D8DFF] ${
                c.cta ? "bg-brand-500 ring-brand-400 hover:bg-brand-600" : "bg-night-2 ring-white/10 hover:ring-[#4D8DFF]"
              }`}
            >
              <span>
                <span className="block font-display text-[17px] font-bold leading-[24px] text-white">{c.q}</span>
                {c.preview && <span className={`mt-1 block text-[14px] leading-[22px] ${c.cta ? "text-white/85" : "text-on-night-muted"}`}>{renderInline(c.preview)}</span>}
              </span>
              <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-white transition group-hover:translate-x-0.5" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
