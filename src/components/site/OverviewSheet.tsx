import { useRouterState } from "@tanstack/react-router";
import { Download, Maximize2 } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/site/system";

/**
 * The approved one-page product overview for the current page, when one exists.
 *
 * Source: Onam-Service-platform/marketing/onam-assets/brand/{products,security}/*.gen.py,
 * every label traced in their SOURCES.md and signed off in IMAGE-REVIEW-CHECKLIST.md.
 * public/overviews/ holds a 1536px WebP for the page and the 3072px PNG to download.
 * Keyed by path so neither template's data needs a new field; a page without a
 * sheet renders nothing.
 */
const SHEETS: Record<string, { key: string; name: string }> = {
  "/estate": { key: "estate", name: "Onam Estate" },
  "/finops": { key: "finops", name: "Onam FinOps" },
  "/disaster-recovery": { key: "drm", name: "Onam DRM" },
  "/platform/ai-operations": { key: "aiops", name: "Onam AIOps" },
  "/platform/code-security": { key: "code-security", name: "Code security" },
  "/platform/cspm": { key: "cspm", name: "CSPM" },
  "/platform/ciem": { key: "ciem", name: "CIEM" },
  "/platform/cnapp": { key: "cnapp", name: "CNAPP" },
  "/platform/data-security": { key: "data-security", name: "Data security (DSPM)" },
  "/platform/attack-path": { key: "attack-path", name: "Attack paths" },
  "/platform/compliance": { key: "compliance", name: "Compliance" },
};

export function OverviewSheet() {
  const path = useRouterState({ select: (s) => s.location.pathname.replace(/\/$/, "") || "/" });
  const sheet = SHEETS[path];
  if (!sheet) return null;
  const base = `/overviews/onam-${sheet.key}-overview`;
  return (
    <Section tone="surface" id="overview">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="One-page overview"
            title={`${sheet.name} on one page`}
            lead="Inputs, how it works, what you get and the limits — the same sheet our team uses in briefings."
          />
          <a
            href={`${base}.png`}
            download
            className="inline-flex items-center gap-2 rounded-[10px] border border-line-strong bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-subtle"
          >
            <Download className="h-4 w-4" aria-hidden /> Download (PNG)
          </a>
        </div>
        <a
          href={`${base}.png`}
          target="_blank"
          rel="noopener"
          className="group relative mt-10 block overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_64px_rgba(11,18,32,.12)]"
        >
          <img
            src={`${base}.webp`}
            alt={`${sheet.name} one-page overview: inputs, how it works, what you get, outcomes and limits.`}
            width={1536}
            height={1024}
            loading="lazy"
            className="block w-full h-auto"
          />
          <span className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-lg bg-night/80 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
            <Maximize2 className="h-3.5 w-3.5" aria-hidden /> Open full size
          </span>
        </a>
      </Container>
    </Section>
  );
}
