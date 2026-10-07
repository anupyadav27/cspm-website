import type { LucideIcon } from "lucide-react";
import type { ProductPageData } from "@/components/site/ProductPageTemplate";

/** A real console capture, cropped of session chrome. Never a hand-made mock. */
export type ConsoleShot = {
  src: string;
  /** Path as the product serves it, shown in the BrowserFrame address bar. */
  url: string;
  alt: string;
  width: number;
  height: number;
};

/** One tab in the product tour. `shot` only when a real capture exists. */
export type TourStop = {
  /** Must match a module title in SUITE (src/data/product-suite.ts). */
  module: string;
  title: string;
  body: string;
  /** What the reader sees in this view — from the product docs, not invented. */
  shows: string[];
  shot?: ConsoleShot;
};

export type FlagshipData = {
  key: "estate" | "finops" | "drm";
  /** The product's copy — shared with the earlier template and the docs. */
  page: ProductPageData;
  /** One-line answer under the h1. */
  answer: string;
  /** Hero visual: a real screenshot when one exists, else the product illustration. */
  heroShot?: ConsoleShot;
  /** Caption under every real screenshot. */
  shotCaption?: string;
  /** Icon per module title; falls back to the product icon. */
  moduleIcons: Record<string, LucideIcon>;
  tour: TourStop[];
  /** Short titles for `page.mechanism`, same length and order. */
  stepTitles: string[];
  limits: { title: string; body: string }[];
};
