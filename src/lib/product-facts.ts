/**
 * GENERATED — do not edit.
 *
 * Source of truth: marketing/facts/product.yaml (last verified 2026-08-05).
 * Regenerate: npm run facts:generate   (also runs as part of npm run build)
 *
 * Only facts marked `status: cleared` appear here. Disputed numbers are
 * deliberately absent rather than exported with a warning comment nobody reads.
 *
 * These constants cover the places a number is a VALUE. Numbers inside prose and
 * inside SVG diagrams are not importable — an SVG cannot import a constant, and
 * rewriting marketing copy into template literals costs more than it protects.
 * Those surfaces are covered by the fact gate instead, which greps what a human
 * would read. Between the two, every surface is checked.
 */

/** detection/analysis engines in the platform */
export const ENGINES = 29;

/** cloud services covered — the full definition catalog, all 7 clouds */
export const SERVICES = 549;

/** AWS · Azure · GCP · OCI · Alibaba Cloud · IBM Cloud · Kubernetes */
export const CLOUDS = 7;

/** distinct compliance frameworks */
export const FRAMEWORKS = 78;

/** SSPM connectors — M365, SharePoint, Google Workspace, GitHub, GitLab, Snowflake, Dynamics 365, Okta */
export const SAAS_PLATFORMS = 8;

/** CSPM posture rules — the Check engine scope per CSPM_CONSTITUTION.md §11.2 */
export const CSPM_POSTURE_RULES = 9853;

/** all posture rule definitions across 7 clouds */
export const RULE_CATALOG_TOTAL = 11346;

/** Thousands-separated, for display. */
export const fmt = (n: number): string => n.toLocaleString("en-US");
