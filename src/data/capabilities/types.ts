import type { LucideIcon } from "lucide-react";
import type { OpsStatus } from "@/data/operations";

/**
 * A capability page: one module of Onam Estate, Onam FinOps or Onam DRM, sold on its
 * own page (`/estate/<slug>`, `/finops/<slug>`, `/disaster-recovery/<slug>`), the way
 * the 26 Onam Security engines are. The Products menu links here; each page links on
 * to its documentation for the detail.
 *
 * EVERY statement must already be true in the product docs (src/data/docs-articles/*)
 * or src/data/products.ts — a capability page sells what the docs say, never more.
 */
export type CapabilityProduct = "estate" | "finops" | "drm";

export type Capability = {
  product: CapabilityProduct;
  /** URL segment under the product, e.g. "inventory" -> /estate/inventory. */
  slug: string;
  /** Menu / breadcrumb name, e.g. "Inventory". */
  name: string;
  icon: LucideIcon;
  /** <title> and meta description (≤155 chars). */
  seoTitle: string;
  metaDescription: string;
  /** The buyer's question — the page h1. */
  question: string;
  /** One or two sentences under the h1. */
  lead: string;
  /** The problem, in the buyer's words (one paragraph). */
  problem: string;
  /** What you see / what it does — 4–6 short items. */
  whatYouSee: { title: string; body: string }[];
  /** How it works — 3–5 numbered steps. */
  steps: { title: string; body: string }[];
  /** Real console screenshot(s), if any exist. Never a mock-up. */
  screenshots?: {
    src: string;
    alt: string;
    url: string;
    caption: string;
    /** Optional short tab label (2–3 words) when there is more than one screen. Defaults to the caption's first clause. */
    label?: string;
  }[];
  /** What it does not do — said plainly. 1–3 items. */
  limits: { title: string; body: string }[];
  /** Optional AIOps angle — status must match src/data/operations.ts. */
  agent?: { name: string; status: OpsStatus; line: string; href: string };
  faqs: { q: string; a: string }[];
  /** Doc page for the detail, e.g. "/docs/estate/inventory". */
  docs: string;
  /** Slugs of sibling capabilities to cross-link (same product). */
  related: string[];
};
