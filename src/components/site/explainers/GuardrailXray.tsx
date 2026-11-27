import { useId, useState } from "react";
import { AlertTriangle, CheckCircle2, Cpu, LockOpen, Server } from "@/components/site/icons";

/**
 * :::xray
 * :::
 *
 * Guardrail X-ray (illustrative). Drag the slider across four AI resources: the X-ray side
 * shows what Onam sees — whether a guardrail is attached, or whether a self-hosted server is
 * open with no login. The guardrail itself stays closed: Onam sees that it is there, and does
 * not test what it blocks. All states are in the server HTML as a list.
 */
const MODELS = [
  { name: "support-assistant", type: "Bedrock agent", seen: "No guardrail attached", status: "warn" as const },
  { name: "chat-prod", type: "Azure OpenAI deployment", seen: "Content filter attached", status: "ok" as const },
  { name: "pricing-model", type: "Vertex AI endpoint", seen: "No Model Armor template", status: "warn" as const },
  { name: "llm-gpu", type: "Ollama on Kubernetes", seen: "Open, no login in front", status: "critical" as const },
];

const LOOK = {
  ok: { Icon: CheckCircle2, cls: "text-[#A7F3D0]", ring: "ring-[#34D399]/60" },
  warn: { Icon: AlertTriangle, cls: "text-[#FDE68A]", ring: "ring-[#FBBF24]/70" },
  critical: { Icon: LockOpen, cls: "text-[#FECACA]", ring: "ring-[#F87171]" },
};

export function GuardrailXray() {
  const [pct, setPct] = useState(55);
  const id = useId();
  return (
    <figure className="my-8 overflow-hidden rounded-2xl bg-night p-4 text-white sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-bold">Guardrail X-ray</span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[12px] font-semibold text-on-night-muted">Illustrative</span>
      </div>
      <div className="relative mt-4" aria-hidden>
        {/* Plain view */}
        <ul className="grid gap-2 sm:grid-cols-2">
          {MODELS.map((m) => (
            <li key={m.name} className="flex min-h-[72px] items-center gap-3 rounded-xl bg-night-2 px-3 py-2 ring-1 ring-white/10">
              {m.type.includes("Ollama") ? <Server className="h-5 w-5 text-[#8FB5FF]" /> : <Cpu className="h-5 w-5 text-[#8FB5FF]" />}
              <span>
                <span className="block font-mono text-[13px]">{m.name}</span>
                <span className="block text-[12px] text-on-night-muted">{m.type}</span>
              </span>
            </li>
          ))}
        </ul>
        {/* X-ray view, revealed left of the slider */}
        <ul className="absolute inset-0 grid gap-2 sm:grid-cols-2" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
          {MODELS.map((m) => {
            const L = LOOK[m.status];
            return (
              <li key={m.name} className={`flex min-h-[72px] items-center gap-3 rounded-xl bg-[#0E2A5C] px-3 py-2 ring-2 ${L.ring}`}>
                <L.Icon className={`h-5 w-5 ${L.cls}`} />
                <span>
                  <span className="block font-mono text-[13px]">{m.name}</span>
                  <span className={`block text-[12px] font-semibold ${L.cls}`}>{m.seen}</span>
                </span>
              </li>
            );
          })}
        </ul>
        <div className="pointer-events-none absolute inset-y-[-6px] w-0.5 bg-[#4D8DFF]" style={{ left: `${pct}%` }} />
      </div>
      <label htmlFor={id} className="mt-4 block text-[13px] font-semibold text-on-night-muted">
        Drag to see what Onam sees
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={pct}
        onChange={(e) => setPct(Number(e.target.value))}
        className="mt-1 h-11 w-full cursor-ew-resize accent-[#4D8DFF]"
      />
      <ul className="sr-only">
        {MODELS.map((m) => (
          <li key={m.name}>
            {m.name} ({m.type}): {m.seen}
          </li>
        ))}
      </ul>
      <figcaption className="mt-2 text-[13px] text-on-night-muted">
        Onam sees whether a guardrail is attached and whether a self-hosted server is open. It does not open the guardrail to test what it blocks.
      </figcaption>
    </figure>
  );
}
