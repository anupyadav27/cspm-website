import { Link } from "@tanstack/react-router";
import { AppWindow, ArrowDown, Cloud, FileCode2 } from "@/components/site/icons";
import { getSuite, AIOPS_COLOR } from "@/data/product-suite";
import { StatusBadge } from "@/components/site/ops/OpsUi";
import { IconTile } from "@/components/site/system";
import { CloudLogo, cloudLogoKey } from "@/components/site/CloudLogo";
import { SAAS_PLATFORMS } from "@/lib/product-facts";

/**
 * How Onam Security fits together — the homepage's first visual.
 *
 *   your clouds, SaaS and code -> one inventory and security graph (Onam Security)
 *   -> cloud security | SaaS security | code security -> Onam AI across them -> outcomes
 *
 * Owner decision 17 Nov 2026: Estate, FinOps and DRM are retired, so the former
 * "assets -> security -> cost -> recovery" layers are gone. The three lines match the
 * three priced lines in src/data/pricing.ts.
 *
 * Built in HTML rather than SVG so it reflows: at 390px every label is still 13px+.
 */

const SOURCES = [
  "AWS",
  "Microsoft Azure",
  "Google Cloud",
  "Oracle Cloud",
  "Alibaba Cloud",
  "IBM Cloud",
  "Kubernetes",
  "SaaS apps",
  "Code repositories",
];

const LINES = [
  {
    name: "Cloud security",
    href: "/platform/cnapp",
    icon: Cloud,
    color: "#2563EB",
    does: [
      "Posture (CSPM), identity (CIEM) and data (DSPM)",
      "Vulnerabilities and workloads (CWPP), AI services",
      "Attack paths to sensitive data, compliance evidence",
    ],
  },
  {
    name: "SaaS security",
    href: "/platform/saas-security",
    icon: AppWindow,
    color: "#8B5CF6",
    does: [
      `Posture checks for ${SAAS_PLATFORMS} SaaS platforms`,
      "Microsoft 365, Google Workspace, GitHub, Snowflake and more",
    ],
  },
  {
    name: "Code security",
    href: "/platform/code-security",
    icon: FileCode2,
    color: "#0891B2",
    does: ["SAST, secrets, IaC and SCA with an SBOM", "DAST against running applications"],
  },
];

// What each team gets out of it, in plain words.
const OUTCOMES = [
  "Which risks to fix first",
  "How an attacker would reach your data",
  "A suggested fix for each finding",
  "Evidence for auditors",
];

function Down() {
  return (
    <div className="flex justify-center py-2" aria-hidden>
      <ArrowDown className="w-4 h-4 text-subtle" />
    </div>
  );
}

export function PlatformLayers() {
  const security = getSuite("security");
  const ai = getSuite("aiops");
  return (
    <section id="platform" className="relative bg-white border-b border-line scroll-mt-20">
      <div className="absolute inset-x-0 top-0 h-24 md:h-40 bg-night" aria-hidden />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 -mt-16 md:-mt-24 pb-16 md:pb-20">
        <figure className="rounded-3xl border border-line bg-white shadow-[0_24px_64px_rgba(11,18,32,.18)] p-4 sm:p-8">
          <figcaption className="sr-only">
            How Onam Security fits together: your clouds, SaaS apps and code feed one inventory
            and security graph; cloud, SaaS and code security act on it; Onam AI, your AI security
            analyst, works across them with a person approving every change.
          </figcaption>

          {/* 1 · Sources */}
          <div className="rounded-2xl bg-surface border border-line p-4">
            <div className="text-xs uppercase tracking-[0.12em] font-semibold text-muted-500">
              What you connect
            </div>
            <ul className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
              {SOURCES.map((c) => (
                <li
                  key={c}
                  className="flex min-h-14 items-center justify-center rounded-lg bg-white border border-line px-2 py-2 text-center text-[13px] font-semibold text-ink-2"
                >
                  {cloudLogoKey(c) ? <CloudLogo name={c} height={24} maxWidth={96} stack nameClassName="text-[12px] font-semibold leading-tight text-ink-2" /> : c}
                </li>
              ))}
            </ul>
          </div>
          <Down />

          {/* 2 · One graph */}
          <Link
            to={security.href}
            className="group flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl px-5 py-4 text-white transition hover:brightness-110"
            style={{ background: security.color }}
          >
            <span className="font-display font-extrabold text-lg">Onam Security</span>
            <span className="text-[15px] text-white/90">
              One inventory and one security graph. Every engine reads it, so findings from different
              engines join up.
            </span>
          </Link>
          <Down />

          {/* 3 · The three lines */}
          <div className="grid md:grid-cols-3 gap-3">
            {LINES.map((l) => (
              <Link
                key={l.name}
                to={l.href}
                className="group rounded-2xl border border-line bg-white p-5 transition hover:shadow-[0_12px_28px_rgba(16,24,40,.10)]"
                style={{ borderTop: `3px solid ${l.color}` }}
              >
                <div className="flex items-center gap-3">
                  <IconTile icon={l.icon} color={l.color} size="sm" />
                  <div className="font-display font-bold text-ink group-hover:text-brand-500 transition">
                    {l.name}
                  </div>
                </div>
                <ul className="mt-4 space-y-1.5">
                  {l.does.map((d) => (
                    <li key={d} className="flex gap-2 text-sm text-body">
                      <span
                        className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: l.color }}
                        aria-hidden
                      />
                      {d}
                    </li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>

          {/* 4 · Across them */}
          <Link
            to={ai.href}
            className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border px-5 py-4 transition hover:brightness-[0.98]"
            style={{ borderColor: "#C7D2FE", background: "#EEF2FF" }}
          >
            <span className="font-display font-extrabold text-lg" style={{ color: AIOPS_COLOR }}>
              Onam AI
            </span>
            <StatusBadge status="early" />
            <span className="text-[15px] text-ink-2">
              Your AI security analyst: ask about findings, attack paths and data security. It
              suggests fixes; a person approves each change.
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
      </div>
    </section>
  );
}
