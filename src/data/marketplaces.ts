/**
 * Cloud marketplace listings — the ONE place to update when a listing goes live.
 *
 * Status 2026-10-07 (Onam-Service-platform/marketing/onam-assets/marketplaces/ONBOARDING.md):
 * onboarding with all three; no listing is live. While `url` is null the site says
 * "Coming soon" and links nowhere. When a listing is published, paste its public
 * listing URL into `url` — every surface (homepage, Why Onam, pricing, footer)
 * switches to "Available on …" with a link. Do not set a url before the listing is
 * publicly visible: the site must never say "available" for something a buyer
 * cannot find.
 *
 * Names are the marketplaces' own product names, as text. Official "Available in"
 * badges may be added once a listing is live and the provider's badge terms allow it.
 */
export type Marketplace = {
  key: "aws" | "azure" | "gcp";
  name: string;
  short: string;
  /** Public listing URL. null = not live yet. */
  url: string | null;
};

export const MARKETPLACES: Marketplace[] = [
  { key: "aws", name: "AWS Marketplace", short: "AWS", url: null },
  { key: "azure", name: "Microsoft Azure Marketplace", short: "Azure", url: null },
  { key: "gcp", name: "Google Cloud Marketplace", short: "Google Cloud", url: null },
];

export const anyMarketplaceLive = () => MARKETPLACES.some((m) => m.url);
