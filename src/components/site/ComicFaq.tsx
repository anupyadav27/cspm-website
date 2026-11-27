import { useEffect, useRef, useState } from "react";
import { CompassMark } from "@/components/site/Logo";
import { faqJsonLd } from "@/lib/seo";

/**
 * "Questions we get a lot" as a comic-strip conversation: "You" asks, Onam answers, in speech
 * bubbles with ink outlines and hard offset shadows, on a halftone comic panel.
 *
 * Each exchange plays when it scrolls into view: the question pops in, Onam "types" for a moment,
 * then the answer pops in. Every question and answer is in the HTML from the start (the animation
 * only reveals it) and in the FAQPage structured data. Long lists show the first five exchanges and
 * an "Ask more" button. Reduced motion: everything is shown at once. Keyframes: comic-* in styles.css.
 */

type Faq = { q: string; a: string };
const FIRST = 5;
const INK = "#0B1220";

function useSeen<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return setSeen(true);
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

/** A simple drawn person: a customer, not anyone in particular. */
function YouAvatar() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
      <rect width="64" height="64" fill="#FFE27A" />
      <path d="M10 64c2-13 11-19 22-19s20 6 22 19z" fill="#2563EB" stroke={INK} strokeWidth="2.5" />
      <circle cx="32" cy="28" r="13" fill="#F6C9A8" stroke={INK} strokeWidth="2.5" />
      <path d="M19 26c0-9 6-14 13-14s13 5 13 13c-4-1-9-4-11-8-3 5-9 8-15 9z" fill={INK} />
      <circle cx="27.5" cy="29" r="1.6" fill={INK} />
      <circle cx="36.5" cy="29" r="1.6" fill={INK} />
      <path d="M28 34.5q4 3 8 0" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Avatar({ who }: { who: "you" | "onam" }) {
  return (
    <div className="flex w-12 shrink-0 flex-col items-center gap-1 sm:w-14" aria-hidden>
      <div
        className={`grid h-12 w-12 place-items-center overflow-hidden rounded-full border-[2.5px] border-ink shadow-[3px_3px_0_#0B1220] sm:h-14 sm:w-14 ${
          who === "onam" ? "bg-white" : ""
        }`}
      >
        {who === "you" ? <YouAvatar /> : <CompassMark size={28} />}
      </div>
      <span className="font-display text-[12px] font-extrabold uppercase tracking-wide text-ink">
        {who === "you" ? "You" : "Onam"}
      </span>
    </div>
  );
}

/** Bubble tail: filled to match the bubble, outlined on its two outer edges only, so it joins cleanly. */
function Tail({ side, fill }: { side: "left" | "right"; fill: string }) {
  const flip = side === "right" ? "scale(-1,1) translate(-24,0)" : undefined;
  return (
    <svg
      viewBox="0 0 24 22"
      className={`absolute top-5 h-[22px] w-6 ${side === "left" ? "-left-[21px]" : "-right-[21px]"}`}
      aria-hidden
    >
      <g transform={flip}>
        <path d="M24 2 L1 9 L24 17 Z" fill={fill} />
        <path
          d="M24 2 L1 9 L24 17"
          fill="none"
          stroke={INK}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

function Typing() {
  return (
    <span className="inline-flex items-center gap-1.5 py-1" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="comic-dot h-2.5 w-2.5 rounded-full bg-ink"
          style={{ animationDelay: `${i * 160}ms` }}
        />
      ))}
    </span>
  );
}

function Exchange({ f, i }: { f: Faq; i: number }) {
  const [ref, seen] = useSeen<HTMLLIElement>();
  const [answered, setAnswered] = useState(false);
  useEffect(() => {
    if (!seen) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setAnswered(true), calm ? 0 : 1100);
    return () => clearTimeout(t);
  }, [seen]);
  const qId = `faq-q-${i}`;
  return (
    <li ref={ref} className="space-y-5" aria-labelledby={qId}>
      {/* Question: You, on the left */}
      <div className={`flex items-start gap-4 sm:gap-6 ${seen ? "comic-pop" : "opacity-0"}`}>
        <Avatar who="you" />
        <div className="relative max-w-[640px] rounded-[22px] border-[2.5px] border-ink bg-white px-5 py-4 shadow-[4px_4px_0_#0B1220]">
          <Tail side="left" fill="#FFFFFF" />
          <h3
            id={qId}
            className="font-display text-[17px] font-bold leading-snug text-ink md:text-[18px]"
          >
            {f.q}
          </h3>
        </div>
      </div>

      {/* Answer: Onam, on the right; typing dots first, then the reply */}
      <div
        className={`flex items-start justify-end gap-4 sm:gap-6 ${seen ? "comic-pop" : "opacity-0"}`}
        style={{ animationDelay: "350ms" }}
      >
        {/* While Onam "types", the bubble is just the dots; the answer stays in the HTML (visually hidden)
            and the bubble grows into it. */}
        <div
          key={answered ? "a" : "t"}
          className={`relative max-w-[680px] rounded-[22px] border-[2.5px] border-ink bg-[#E3ECFF] px-5 py-4 shadow-[4px_4px_0_#0B1220] ${
            answered && seen ? "comic-grow" : ""
          }`}
        >
          <Tail side="right" fill="#E3ECFF" />
          {!answered && <Typing />}
          <p className={answered ? "text-[15.5px] leading-relaxed text-ink-2" : "sr-only"}>{f.a}</p>
        </div>
        <Avatar who="onam" />
      </div>
    </li>
  );
}

export function ComicFaq({
  faqs,
  title = "Questions we get a lot",
}: {
  faqs: Faq[];
  title?: string;
}) {
  const [all, setAll] = useState(false);
  const shown = all ? faqs : faqs.slice(0, FIRST);
  const more = faqs.length - FIRST;
  return (
    <section id="faq" className="border-b border-line bg-surface py-20 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div
          className="relative rounded-[28px] border-[3px] border-ink px-4 pb-10 pt-16 shadow-[8px_8px_0_#0B1220] sm:px-10 md:pb-12"
          style={{
            background:
              "radial-gradient(#C9D8FB 1.3px, transparent 1.5px) 0 0/14px 14px, linear-gradient(160deg, #F4F8FF 0%, #EAF1FF 55%, #FFF6D8 100%)",
          }}
        >
          {/* Narration caption, like the box at the top of a comic panel */}
          <div className="absolute -top-5 left-5 -rotate-1 rounded-md border-[2.5px] border-ink bg-[#FFE27A] px-4 py-2 shadow-[4px_4px_0_#0B1220] sm:left-10">
            <h2 className="font-display text-[20px] font-extrabold tracking-tight text-ink md:text-[24px]">
              {title}
            </h2>
          </div>

          <ol className="space-y-10">
            {shown.map((f, i) => (
              <Exchange key={f.q} f={f} i={i} />
            ))}
          </ol>

          {!all && more > 0 && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setAll(true)}
                className="min-h-11 rounded-full border-[2.5px] border-ink bg-white px-5 font-display text-[15px] font-extrabold text-ink shadow-[4px_4px_0_#0B1220] transition hover:-translate-y-0.5 hover:bg-[#FFE27A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_#0B1220]"
              >
                Ask {more} more question{more === 1 ? "" : "s"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
