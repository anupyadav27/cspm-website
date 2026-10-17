/**
 * Cloud marketplace listings — the ONE place to update when a listing goes live.
 *
 * Status: Onam-Service-platform/marketing/onam-assets/marketplaces/ONBOARDING.md.
 * While `url` is null the site says
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
  /**
   * Public partner-directory profile, shown while the marketplace listing is not live.
   * It is not a listing: the site says "<partnerLabel>", never "Available".
   */
  partner?: { label: string; url: string };
};

/**
 * 2026-10-17: Microsoft listing live (published 13 Oct). Google Cloud: partner profile
 * published 17 Oct; Marketplace listing not started. AWS: seller registration blocked.
 */
export const MARKETPLACES: Marketplace[] = [
  {
    key: "azure",
    name: "Microsoft Marketplace",
    short: "Azure",
    url: "https://marketplace.microsoft.com/en-us/product/onamsecurity.onam-cloud-security",
  },
  {
    key: "gcp",
    name: "Google Cloud Marketplace",
    short: "Google Cloud",
    url: null,
    partner: {
      label: "Google Cloud Partner",
      url: "https://cloud.google.com/find-a-partner/partner/candc-technology-solutions-private-limited",
    },
  },
  { key: "aws", name: "AWS Marketplace", short: "AWS", url: null },
];

export const anyMarketplaceLive = () => MARKETPLACES.some((m) => m.url);
export const liveMarketplaces = () => MARKETPLACES.filter((m) => m.url);
