import { type ReactNode } from "react";

/**
 * :::faq Questions customers ask
 * ### Does Onam read our prompts?
 * No. It reads configuration through read-only roles.
 * ### Which clouds are covered?
 * AWS, Azure and Google Cloud.
 * :::
 *
 * Each `### ` line is a question; the markdown under it is the answer.
 * Pages that contain one also emit FAQPage JSON-LD (see faqJsonLd in Prose.tsx).
 */
export function FaqList({ title, items }: { title?: string; items: { q: string; a: ReactNode }[] }) {
  return (
    <section aria-label={title || "Frequently asked questions"} className="my-8">
      {title && <h3 className="font-display font-bold text-lg text-[#0B1220] mb-3">{title}</h3>}
      <div className="divide-y divide-[#E5E9F0] overflow-hidden rounded-xl border border-[#E5E9F0] bg-white">
        {items.map((it, i) => (
          <details key={i} className="group" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 text-[15.5px] font-semibold text-[#0B1220] hover:bg-[#F7F9FC] [&::-webkit-details-marker]:hidden">
              <span>{it.q}</span>
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className="mt-1 h-4 w-4 shrink-0 text-[#5A6A80] transition-transform group-open:rotate-45"
              >
                <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </summary>
            <div className="px-5 pb-1 [&_p]:text-[15px]">{it.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
