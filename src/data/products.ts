import { ShieldHalf, type LucideIcon } from "@/components/site/icons";

/**
 * The product Onam sells: Onam Security, with Onam AI (src/data/operations.ts) as its
 * AI security analyst.
 *
 * Owner decision 17 Nov 2026: Onam Estate, Onam FinOps and Onam DRM are no longer
 * products. Their pages 301 to the closest Security page (src/data/retired-pages.ts).
 * FinSec — cost data used as a security signal inside the AWS scan — is part of Onam
 * Security, not a product.
 *
 * Engine pages stay at /platform/* — those URLs are indexed and are not moving.
 * /platform is the Onam Security product hub that gathers them. (/security now 301s to
 * /trust, so it must not be used as the Security product link.)
 */

export type ProductSummary = {
  key: "security";
  name: string;
  href: string;
  icon: LucideIcon;
  color: string;
  /** The question a buyer arrives with. */
  question: string;
  /** One line, on the card. */
  blurb: string;
  /** How it is sold. Shown verbatim on /pricing. */
  packaging: string;
  surfaces: string[];
};

export const PRODUCTS: ProductSummary[] = [
  {
    key: "security",
    name: "Onam Security",
    href: "/platform",
    icon: ShieldHalf,
    color: "#2563EB",
    question: "Is my cloud secure, and what do I fix first?",
    blurb:
      "Cloud, SaaS and code security: posture, identity, data, workloads, attack paths and compliance. Every engine works from the same security graph.",
    packaging: "Priced per unit for cloud and SaaS and per developer for code, with a free one-time audit scan first.",
    surfaces: [
      "Posture & Identity",
      "Threat & Attack",
      "Data & Network",
      "Workloads & Code",
      "SaaS, AI & Governance",
    ],
  },
];
