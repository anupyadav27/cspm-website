import type { IconName, VisualSpec } from "@/components/site/product/GenericVisuals";

/**
 * A product page's "The whole picture" dataflow diagram, as plain data (rendered by DataFlow.tsx).
 * Written from the page's own entry in platform-pages.ts only: no new claims, no new numbers.
 * scripts/test-product-flows.ts enforces the limits below and that every number is in the entry.
 *
 *   heading   at most 10 words, "From X to Y" style
 *   intro     one plain sentence, at most 30 words
 *   stages    four short stage names (at most 5 words each); the last is usually "What you get"
 *   inputs    4 to 8 things that go in; label at most 4 words, hint at most 5 words. A cloud name
 *             ("AWS", "Microsoft Azure", "Google Cloud", "Kubernetes", "Oracle Cloud", "Alibaba Cloud",
 *             "IBM Cloud") with no icon renders as the provider's logo. accent marks one special input.
 *   engine    name "Onam <Product>", sub at most 8 words, exactly 4 steps of at most 5 words, footer at
 *             most 8 words
 *   visual    a VisualSpec (GenericVisuals.tsx); labels 1–3 words; example text is labelled Example
 *   visualNote one line at most 7 words, with a colour
 *   outputs   exactly 6; label at most 4 words, hint at most 5 words; a distinct colour each
 *   footnote  one honest limit or qualifier from the entry, at most 25 words
 *   caption   plain-text description of the whole diagram for screen readers
 */
export type FlowData = {
  heading: string;
  intro: string;
  stages: [string, string, string, string];
  inputs: { label: string; icon?: IconName; hint?: string; accent?: boolean }[];
  engine: { name: string; sub: string; steps: string[]; footer?: string };
  visual: VisualSpec;
  visualNote: { text: string; color: string };
  outputs: { id: string; icon: IconName; label: string; hint: string; color: string }[];
  footnote: string;
  caption: string;
};
