import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "@/components/site/icons";

/**
 * :::story A Tuesday test
 * ### Friday afternoon
 * frame: forgotten                (a built-in illustration key, or a /screens/... image path)
 * Someone started a model server on a spare GPU node to test something. It's still running.
 * ### …
 * :::
 *
 * 3 to 5 beats; each is a frame + a caption of 20 words or fewer. The whole story is an <ol>
 * in the server HTML (every caption visible to crawlers and screen readers); the stepper shows
 * one beat at a time on top of it. Moves only by button or arrow key, never by page scroll.
 */

export type Beat = { title: string; frame: string; caption: ReactNode; alt: string };

const INK = "#0B1220";
const LINE = "#CBD5E1";
const RED = "#E32D25";
const GREEN = "#05A052";
const BLUE = "#2563EB";

/** Loophole: a crumpled policy note with a smug face. Drawn once, reused. */
function Loophole({ x, y, s = 1, note }: { x: number; y: number; s?: number; note?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 6 L52 0 L58 58 L6 64 Z" fill="#FFF7F6" stroke={RED} strokeWidth="2.5" strokeDasharray="5 3" />
      <circle cx="20" cy="26" r="3" fill={INK} />
      <circle cx="38" cy="24" r="3" fill={INK} />
      <path d="M18 40 Q30 48 42 37" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M14 18 L24 16 M34 14 L44 15" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      {note && (
        <text x="29" y="82" textAnchor="middle" fontSize="13" fontWeight="700" fill={RED}>
          {note}
        </text>
      )}
    </g>
  );
}

function Server({ x, y, label, ring }: { x: number; y: number; label: string; ring?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="150" height="110" rx="14" fill="#fff" stroke={ring ?? LINE} strokeWidth={ring ? 3 : 2} />
      {[22, 48, 74].map((yy) => (
        <g key={yy}>
          <rect x="16" y={yy} width="118" height="16" rx="4" fill="#F1F5F9" />
          <circle cx="122" cy={yy + 8} r="3.5" fill={GREEN} />
        </g>
      ))}
      <text x="75" y="134" textAnchor="middle" fontSize="14" fontWeight="700" fill={INK} fontFamily="JetBrains Mono, monospace">
        {label}
      </text>
    </g>
  );
}

const FRAMES: Record<string, ReactNode> = {
  forgotten: (
    <>
      <rect x="300" y="36" width="130" height="96" rx="10" fill="#fff" stroke={LINE} strokeWidth="2" />
      <rect x="300" y="36" width="130" height="24" rx="10" fill={BLUE} />
      <text x="365" y="53" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff">FRIDAY</text>
      <text x="365" y="104" textAnchor="middle" fontSize="36" fontWeight="900" fill={INK}>5:40</text>
      <Server x={90} y={90} label="llm-gpu" />
      <g transform="translate(180 64) rotate(6)">
        <rect width="120" height="52" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
        <text x="60" y="22" textAnchor="middle" fontSize="13" fontWeight="700" fill="#78350F">testing,</text>
        <text x="60" y="40" textAnchor="middle" fontSize="13" fontWeight="700" fill="#78350F">back Monday</text>
      </g>
      <text x="240" y="276" textAnchor="middle" fontSize="13" fill="#475569">A spare GPU node in the ml namespace</text>
    </>
  ),
  loophole: (
    <>
      <Server x={60} y={70} label="llm-gpu" ring={RED} />
      <path d="M215 125 H330" stroke={RED} strokeWidth="3" strokeDasharray="7 5" />
      <circle cx="380" cy="125" r="44" fill="#FDECEA" stroke={RED} strokeWidth="2.5" />
      <text x="380" y="121" textAnchor="middle" fontSize="13" fontWeight="800" fill={RED}>ANYONE</text>
      <text x="380" y="139" textAnchor="middle" fontSize="13" fontWeight="700" fill={RED}>no login</text>
      <Loophole x={232} y={170} s={1} note="Loophole" />
    </>
  ),
  stamp: (
    <>
      <rect x="40" y="40" width="400" height="190" rx="14" fill="#fff" stroke={LINE} strokeWidth="2" />
      <text x="62" y="70" fontSize="13" fontWeight="700" fill="#5A6A80">AI INVENTORY</text>
      {[
        ["support-assistant", "Bedrock agent"],
        ["chat-prod", "Azure OpenAI"],
        ["llm-gpu", "Ollama · Kubernetes"],
      ].map(([n, t], i) => (
        <g key={n} transform={`translate(62 ${88 + i * 42})`}>
          <rect width="356" height="34" rx="8" fill={i === 2 ? "#FDECEA" : "#F7F9FC"} stroke={i === 2 ? RED : "none"} strokeWidth="2" />
          <text x="12" y="22" fontSize="13" fontWeight="600" fill={INK} fontFamily="JetBrains Mono, monospace">{n}</text>
          <text x="190" y="22" fontSize="13" fill="#475569">{t}</text>
        </g>
      ))}
      <g transform="translate(270 196) rotate(-6)">
        <rect width="180" height="40" rx="6" fill="#fff" stroke={RED} strokeWidth="3" />
        <text x="90" y="17" textAnchor="middle" fontSize="12" fontWeight="800" fill={RED}>EXPOSED WITHOUT</text>
        <text x="90" y="32" textAnchor="middle" fontSize="12" fontWeight="800" fill={RED}>AUTHENTICATION</text>
      </g>
    </>
  ),
  closed: (
    <>
      <Server x={60} y={70} label="llm-gpu" ring={GREEN} />
      <rect x="250" y="70" width="70" height="110" rx="6" fill="#E7F6EF" stroke={GREEN} strokeWidth="3" />
      <circle cx="306" cy="128" r="4" fill={GREEN} />
      <text x="285" y="204" textAnchor="middle" fontSize="13" fontWeight="700" fill={GREEN}>login in front</text>
      <g transform="translate(350 60) rotate(18)">
        <Loophole x={0} y={0} s={0.8} />
      </g>
      <text x="395" y="150" textAnchor="middle" fontSize="13" fontWeight="700" fill="#5A6A80">bounced</text>
      <text x="240" y="262" textAnchor="middle" fontSize="13" fill="#475569">Still in the inventory. No longer open.</text>
    </>
  ),
};

function Frame({ frame, alt }: { frame: string; alt: string }) {
  if (frame.startsWith("/")) {
    return <img src={frame} alt={alt} loading="lazy" className="h-full w-full rounded-xl object-cover object-top" />;
  }
  return (
    <svg viewBox="0 0 480 300" role="img" aria-label={alt} className="h-full w-full">
      <rect width="480" height="300" rx="16" fill="#F7F9FC" />
      {FRAMES[frame] ?? null}
    </svg>
  );
}

export function StoryStepper({ title, beats, end }: { title?: string; beats: Beat[]; end?: { label: string; href: string } | null }) {
  const [i, setI] = useState(0);
  const id = useId();
  const n = beats.length;
  if (!n) return null;
  const last = i === n - 1;

  function onKey(e: KeyboardEvent) {
    if (e.key === "ArrowRight") setI((v) => Math.min(n - 1, v + 1));
    if (e.key === "ArrowLeft") setI((v) => Math.max(0, v - 1));
  }

  return (
    <section aria-label={title || "Story"} className="my-8" onKeyDown={onKey}>
      <ol className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        {beats.map((b, k) => (
          <li
            key={k}
            id={`story-${k + 1}`}
            className={k === i ? "contents" : "sr-only"}
            aria-current={k === i ? "step" : undefined}
          >
            <div className="ex-fade aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-surface md:aspect-[16/10]">
              <Frame frame={b.frame} alt={b.alt} />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-brand-700">
                {k + 1} of {n} · {b.title}
              </div>
              <p className="mt-2 font-display text-[22px] font-bold leading-[30px] text-ink md:text-[24px] md:leading-[32px]">{b.caption}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Story beats" className="flex gap-2">
          {beats.map((b, k) => (
            <button
              key={k}
              role="tab"
              type="button"
              aria-selected={k === i}
              aria-controls={`story-${k + 1}`}
              aria-label={`Beat ${k + 1}: ${b.title}`}
              onClick={() => setI(k)}
              className="flex h-11 w-11 items-center justify-center"
              id={`${id}-dot-${k}`}
            >
              <span className={`block h-2.5 rounded-full transition-all duration-200 ${k === i ? "w-7 bg-brand-500" : "w-2.5 bg-line-strong"}`} />
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setI((v) => Math.max(0, v - 1))}
            disabled={i === 0}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-line bg-white px-4 text-[14px] font-semibold text-navy-600 hover:border-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back
          </button>
          {last && end ? (
            <a href={end.href} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-brand-500 px-4 text-[14px] font-semibold text-white hover:bg-brand-600">
              {end.label} <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          ) : (
            <button
              type="button"
              onClick={() => setI((v) => Math.min(n - 1, v + 1))}
              disabled={last}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-brand-500 px-4 text-[14px] font-semibold text-white hover:bg-brand-600 disabled:opacity-40"
            >
              Next <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
