import { Link } from "@tanstack/react-router";
import { ArrowDown, ExternalLink } from "lucide-react";
import { getSuite, AIOPS_COLOR, type SuiteKey } from "@/data/product-suite";
import { StatusBadge } from "@/components/site/ops/OpsUi";
import { IconTile } from "@/components/site/system";

/**
 * The platform as layers — the homepage's first visual, in place of the dense
 * 1536px diagram (about 60 labels, unreadable on a phone). Same story, same facts as
 * the reviewed diagram (public/diagrams/onam-platform-overview.svg), which stays one
 * click away for anyone who wants the detail:
 *
 *   your clouds -> Onam Estate (one inventory) -> Security | FinOps | DRM
 *   Onam AIOps across every layer -> outcomes
 *
 * Built in HTML rather than SVG so it reflows: at 390px every label is still 13px+.
 */

const CLOUDS = [
  "AWS",
  "Microsoft Azure",
  "Google Cloud",
  "Oracle Cloud",
  "Alibaba Cloud",
  "IBM Cloud",
  "Kubernetes",
  "SaaS apps",
];

const ACT: { key: SuiteKey; does: string[] }[] = [
  {
    key: "security",
    does: [
      "Posture, identity, data and code",
      "Attack paths to crown jewels",
      "Compliance evidence per control",
    ],
  },
  {
    key: "finops",
    does: [
      "Billed and effective cost",
      "Ownership and attribution",
      "Forecast, budgets and savings",
    ],
  },
  {
    key: "drm",
    does: [
      "Applications and dependencies",
      "Predicted RTO and RPO",
      "Drift from the approved plan",
    ],
  },
];

// The outcomes the reviewed diagram names, verbatim.
const OUTCOMES = [
  "Reduced risk",
  "Lower cloud costs",
  "Recovery readiness",
  "Audit readiness",
  "One view for every team",
];

function Down() {
  return (
    <div className="flex justify-center py-2" aria-hidden>
      <ArrowDown className="w-4 h-4 text-subtle" />
    </div>
  );
}

export function PlatformLayers() {
  const estate = getSuite("estate");
  return (
    <section id="platform" className="relative bg-white border-b border-line scroll-mt-20">
      <div className="absolute inset-x-0 top-0 h-24 md:h-40 bg-night" aria-hidden />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 -mt-16 md:-mt-24 pb-16 md:pb-20">
        <figure className="rounded-3xl border border-line bg-white shadow-[0_24px_64px_rgba(11,18,32,.18)] p-4 sm:p-8">
          <figcaption className="sr-only">
            How the Onam platform fits together: your clouds feed Onam Estate's single inventory;
            Onam Security, Onam FinOps and Onam DRM act on it; Onam AIOps agents work across every
            layer with a person approving every change.
          </figcaption>

          {/* 1 · Sources */}
          <div className="rounded-2xl bg-surface border border-line p-4">
            <div className="text-xs uppercase tracking-[0.12em] font-semibold text-muted-500">
              Your clouds
            </div>
            <ul className="mt-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {CLOUDS.map((c) => (
                <li
                  key={c}
                  className="rounded-lg bg-white border border-line px-2 py-2 text-center text-[13px] font-semibold text-ink-2"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <Down />

          {/* 2 · One inventory */}
          <Link
            to={estate.href}
            className="group flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl px-5 py-4 text-white transition hover:brightness-110"
            style={{ background: `linear-gradient(90deg, ${estate.color}, #4F46E5)` }}
          >
            <span className="text-xs uppercase tracking-[0.12em] font-semibold text-white/80">
              {estate.stage}
            </span>
            <span className="font-display font-extrabold text-lg">Onam Estate</span>
            <span className="text-[15px] text-white/90">
              One inventory every product reads — discover, map, keep current.
            </span>
          </Link>
          <Down />

          {/* 3 · Products that act on it */}
          <div className="grid md:grid-cols-3 gap-3">
            {ACT.map(({ key, does }) => {
              const p = getSuite(key);
              return (
                <Link
                  key={key}
                  to={p.href}
                  className="group rounded-2xl border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(16,24,40,.10)]"
                  style={{ borderTop: `3px solid ${p.color}` }}
                >
                  <div className="flex items-center gap-3">
                    <IconTile icon={p.icon} color={p.color} size="sm" />
                    <div>
                      <div className="text-xs uppercase tracking-[0.12em] font-semibold text-muted-500">
                        {p.stage}
                      </div>
                      <div className="font-display font-bold text-ink group-hover:text-brand-500 transition">
                        {p.name}
                      </div>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-1.5">
                    {does.map((d) => (
                      <li key={d} className="flex gap-2 text-sm text-body">
                        <span
                          className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: p.color }}
                          aria-hidden
                        />
                        {d}
                      </li>
                    ))}
                  </ul>
                </Link>
              );
            })}
          </div>

          {/* 4 · Across every layer */}
          <Link
            to="/platform/ai-operations"
            className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border px-5 py-4 transition hover:brightness-[0.98]"
            style={{ borderColor: "#C7D2FE", background: "#EEF2FF" }}
          >
            <span className="font-display font-extrabold text-lg" style={{ color: AIOPS_COLOR }}>
              Onam AIOps
            </span>
            <StatusBadge status="early" />
            <span className="text-[15px] text-ink-2">
              AI agents across every layer — they investigate with evidence; a person approves every
              change.
            </span>
          </Link>
          <Down />

          {/* 5 · Outcomes */}
          <ul className="flex flex-wrap justify-center gap-2">
            {OUTCOMES.map((o) => (
              <li
                key={o}
                className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink"
              >
                {o}
              </li>
            ))}
          </ul>
        </figure>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1 text-sm text-muted-500">
          <span>One discovery feeds every product. Onam AIOps is in early access.</span>
          <a
            href="/diagrams/onam-platform-overview.svg"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 font-semibold text-brand-500 hover:text-brand-600"
          >
            Detailed platform diagram <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
