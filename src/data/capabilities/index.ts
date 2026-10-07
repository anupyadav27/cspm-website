import { capabilities as estate } from "./estate";
import { capabilities as finops } from "./finops";
import { capabilities as drm } from "./drm";
import type { Capability, CapabilityProduct } from "./types";

export type { Capability, CapabilityProduct } from "./types";

export const CAPABILITIES: Capability[] = [...estate, ...finops, ...drm];

export const getCapability = (product: CapabilityProduct, slug: string) =>
  CAPABILITIES.find((c) => c.product === product && c.slug === slug);

export const capabilitiesOf = (product: CapabilityProduct) => CAPABILITIES.filter((c) => c.product === product);

/** Route base per product. DRM's marketing page is /disaster-recovery (/drm is the app). */
export const PRODUCT_BASE: Record<CapabilityProduct, string> = {
  estate: "/estate",
  finops: "/finops",
  drm: "/disaster-recovery",
};
