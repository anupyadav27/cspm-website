/**
 * Pages retired on 17 Nov 2026 (owner decision): Onam Estate, Onam FinOps and Onam DRM are
 * no longer products, and "Onam AIOps" is now "Onam AI" — the AI security analyst for
 * Onam Security. Every retired address 301s to the closest live page.
 *
 * One map for every route that redirects (the product routes, the docs and learn splats)
 * and for the sitemap generator, which leaves these addresses out. Add to it; do not
 * delete an entry — an old address that 404s loses whatever links still point at it.
 */

/** Exact old path -> new path. */
export const RETIRED_PAGES: Record<string, string> = {
  // Onam Estate -> the asset inventory inside Onam Security
  "/estate": "/platform/inventory",
  "/estate/inventory": "/platform/inventory",
  "/estate/architecture": "/platform/inventory",
  "/estate/discovery": "/platform/inventory",
  // Onam FinOps -> the Onam Security overview
  "/finops": "/platform",
  "/finops/explore": "/platform",
  "/finops/ownership": "/platform",
  "/finops/plan": "/platform",
  "/finops/savings": "/platform",
  "/finops/reconciliation": "/platform",
  // Onam DRM -> the Onam Security overview
  "/disaster-recovery": "/platform",
  "/disaster-recovery/applications": "/platform",
  "/disaster-recovery/protection": "/platform",
  "/disaster-recovery/recovery-plans": "/platform",
  "/disaster-recovery/objectives": "/platform",
  "/disaster-recovery/drift": "/platform",
  "/platform/drm": "/platform",
  // Onam AIOps -> Onam AI
  "/platform/ai-operations": "/onam-ai",
  "/platform/ai-operations/architecture": "/onam-ai/architecture",
  // Docs: retired agents -> the agent list
  "/docs/operations/agents/asset-agent": "/docs/operations/agents",
  "/docs/operations/agents/finops-agent": "/docs/operations/agents",
  "/docs/operations/agents/dr-agent": "/docs/operations/agents",
  "/docs/operations/agents/architecture-agent": "/docs/operations/agents",
  // Learn explainers that only sold a retired product
  "/learn/finops": "/learn",
  "/learn/cloud-cost-allocation": "/learn",
  "/learn/rto-vs-rpo": "/learn",
  "/learn/cloud-disaster-recovery": "/learn",
  "/learn/agentic-aiops": "/onam-ai",
};

/** Whole retired sections: any path under the prefix goes to the target. */
const RETIRED_PREFIXES: [prefix: string, target: string][] = [
  ["/estate/", "/platform/inventory"],
  ["/finops/", "/platform"],
  ["/disaster-recovery/", "/platform"],
  ["/docs/estate/", "/docs/security/overview"],
  ["/docs/finops/", "/docs/security/overview"],
  ["/docs/drm/", "/docs/security/overview"],
];

/** Where a retired path now lives, or undefined when the path is not retired. */
export function retiredTarget(path: string): string | undefined {
  const p = path.length > 1 ? path.replace(/\/+$/, "") : path;
  if (RETIRED_PAGES[p]) return RETIRED_PAGES[p];
  for (const [prefix, target] of RETIRED_PREFIXES) if (p.startsWith(prefix)) return target;
  return undefined;
}
