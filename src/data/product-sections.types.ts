import type { LucideIcon } from "@/components/site/icons";

/**
 * Structured "How it works" and "What you get" content for a product page (/platform/*).
 * Written from the page's own entry in platform-pages.ts: no new claims, no new numbers.
 * scripts/test-product-sections.ts enforces that every number here appears in that entry.
 */
export type FlowStep = {
  /** Verb-led, at most 5 words: "Connect read-only". */
  title: string;
  /** One or two plain sentences, at most 28 words. */
  body: string;
  /** Optional proof chip, at most 6 words, numbers copied from the page entry: "11,856 rule definitions". */
  proof?: string;
  icon: LucideIcon;
};

export type Outcome = {
  /** Outcome-led, at most 6 words: "Misconfigurations ranked by severity". */
  title: string;
  /** At most 22 words. */
  body: string;
  icon: LucideIcon;
  /** Concrete items named in the page entry: severities, integrations, frameworks, clouds. */
  chips?: string[];
};

export type ProductSections = {
  /** At most 8 words, e.g. "From a read-only connection to a verified fix". */
  stepsHeading: string;
  /** 4 or 5 steps, in the order of the entry's `mechanism`. */
  steps: FlowStep[];
  /** At most 8 words, e.g. "What your team works with every day". */
  outcomesHeading: string;
  /** 4 to 6 outcomes. */
  outcomes: Outcome[];
};
