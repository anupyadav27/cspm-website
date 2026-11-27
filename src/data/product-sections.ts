import type { ProductPageData } from "@/components/site/ProductPageTemplate";
import { platformPages } from "./platform-pages";
import { PRODUCT_SCREENS, type ProductScreen } from "./product-screens";
import type { ProductSections } from "./product-sections.types";
import { sectionsA } from "./product-sections-a";
import { sectionsB } from "./product-sections-b";
import { PRODUCT_FLOWS } from "./product-flows";
import type { FlowSpec } from "@/components/site/product/DataFlow";

/** "How it works" / "What you get" content for every /platform/* page, keyed like platform-pages.ts. */
export const PRODUCT_SECTIONS: Record<string, ProductSections> = { ...sectionsA, ...sectionsB };

/** The sections and real console capture for a page, found by its data object. */
export function productExtras(data: ProductPageData): {
  sections?: ProductSections;
  screen?: ProductScreen;
  flow?: FlowSpec;
} {
  const key = Object.keys(platformPages).find((k) => platformPages[k] === data);
  if (!key) return {};
  const screen = PRODUCT_SCREENS[key];
  // A page whose hero already shows the same capture does not repeat it.
  const dup = screen && data.heroImage?.src === screen.src;
  return {
    sections: PRODUCT_SECTIONS[key],
    screen: dup ? undefined : screen,
    flow: PRODUCT_FLOWS[key],
  };
}
