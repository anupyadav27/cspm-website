import type { DocArticle } from "./docs-articles/types";
import { articles as gettingStarted } from "./docs-articles/getting-started";
import { articles as onboarding } from "./docs-articles/onboarding";
import { articles as featuresPosture } from "./docs-articles/features-posture";
import { articles as featuresWorkload } from "./docs-articles/features-workload";
import { articles as architectureCompliance } from "./docs-articles/architecture-compliance";
import { articles as trustReference } from "./docs-articles/trust-reference";
import { articles as releaseNotes } from "./docs-articles/release-notes";
import { articles as products } from "./docs-articles/products";
import { articles as drm } from "./docs-articles/drm";
import { articles as featuresExtra } from "./docs-articles/features-extra";
import { articles as operations } from "./docs-articles/operations";
import { articles as dspm } from "./docs-articles/dspm";
import { articles as codeSecurity } from "./docs-articles/code-security";
import { articles as ciem } from "./docs-articles/ciem";
import { articles as security } from "./docs-articles/security";

export type { DocArticle };

/** The product a docs section belongs to. The sidebar groups sections by it. */
export type DocProduct = "platform" | "estate" | "security" | "finops" | "drm" | "aiops" | "shared";

export const DOC_PRODUCT_LABEL: Record<DocProduct, string> = {
  platform: "Platform",
  estate: "Onam Estate",
  security: "Onam Security",
  finops: "Onam FinOps",
  drm: "Onam DRM",
  aiops: "Onam AIOps",
  shared: "Trust & reference",
};

export type DocSection = {
  heading: string;
  /** Product group, rendered as a title above its sections. Order follows DOC_SECTIONS. */
  product: DocProduct;
  items: { title: string; slug: string }[];
};

export const DOC_SECTIONS: DocSection[] = [
  /* ── Platform ── */
  {
    heading: "Getting started",
    product: "platform",
    items: [
      { title: "Introduction", slug: "getting-started/introduction" },
      { title: "Quickstart", slug: "getting-started/quickstart" },
      { title: "Core Concepts", slug: "getting-started/core-concepts" },
    ],
  },
  {
    heading: "Connect a cloud",
    product: "platform",
    items: [
      { title: "AWS", slug: "onboarding/aws" },
      { title: "Azure", slug: "onboarding/azure" },
      { title: "Google Cloud", slug: "onboarding/gcp" },
      { title: "Oracle Cloud (OCI)", slug: "onboarding/oci" },
      { title: "Alibaba Cloud", slug: "onboarding/alicloud" },
      { title: "IBM Cloud", slug: "onboarding/ibm" },
      { title: "Kubernetes", slug: "onboarding/kubernetes" },
    ],
  },
  /* ── Onam Estate ── */
  {
    heading: "Onam Estate",
    product: "estate",
    items: [
      { title: "Overview", slug: "estate/overview" },
      { title: "Asset Inventory", slug: "estate/inventory" },
      { title: "Architecture", slug: "estate/architecture" },
      { title: "Discovery Pipeline", slug: "estate/pipeline" },
      { title: "Access & Entitlement", slug: "estate/access" },
    ],
  },
  /* ── Onam Security ── */
  {
    heading: "Onam Security",
    product: "security",
    items: [{ title: "Overview", slug: "security/overview" }],
  },
  {
    heading: "Security features",
    product: "security",
    items: [
      { title: "CNAPP — posture score", slug: "features/cnapp" },
      { title: "CSPM", slug: "features/cspm" },
      { title: "CIEM", slug: "features/ciem" },
      { title: "Access Reviews", slug: "features/access-reviews" },
      { title: "IAM Security", slug: "features/iam-security" },
      { title: "Attack Path", slug: "features/attack-path" },
      { title: "Choke Points", slug: "features/choke-points" },
      { title: "Threat Detection", slug: "features/threat-detection" },
      { title: "CDR", slug: "features/cdr" },
      { title: "SecOps", slug: "features/secops" },
      { title: "Network Security", slug: "features/network-security" },
      { title: "Data Security", slug: "features/data-security" },
      { title: "Vulnerability Management", slug: "features/vulnerability-management" },
      { title: "Container Security", slug: "features/container-security" },
      { title: "IaC Scanning", slug: "features/iac-scanning" },
      { title: "Compliance", slug: "features/compliance" },
      { title: "Compliance Coverage", slug: "features/compliance-coverage" },
      { title: "Technology Engine", slug: "features/technology-engine" },
      { title: "Risk Quantification", slug: "features/risk-quantification" },
    ],
  },
  {
    heading: "Data security (DSPM)",
    product: "security",
    items: [
      { title: "Overview", slug: "dspm/overview" },
      { title: "Discovery", slug: "dspm/discovery" },
      { title: "Classification and its limits", slug: "dspm/classification" },
      { title: "Access mapping", slug: "dspm/access-mapping" },
      { title: "Exposure, encryption and residency", slug: "dspm/exposure-and-residency" },
      { title: "Data lineage", slug: "dspm/lineage" },
      { title: "Findings reference", slug: "dspm/findings-reference" },
      { title: "Coverage by cloud", slug: "dspm/coverage" },
    ],
  },
  {
    heading: "Code security",
    product: "security",
    items: [
      { title: "Overview", slug: "code-security/overview" },
      { title: "Connect a repository", slug: "code-security/connect-repository" },
      { title: "Run a scan", slug: "code-security/run-a-scan" },
      { title: "Read the results", slug: "code-security/reading-results" },
      { title: "Static analysis (SAST)", slug: "code-security/sast" },
      { title: "Secret detection", slug: "code-security/secrets" },
      { title: "IaC and Dockerfiles", slug: "code-security/iac" },
      { title: "Dependencies and SBOM", slug: "code-security/sca-sbom" },
      { title: "Dynamic testing (DAST)", slug: "code-security/dast" },
      { title: "AI Code Fix", slug: "code-security/ai-code-fix" },
      { title: "CI usage", slug: "code-security/ci" },
    ],
  },
  {
    heading: "Identity (CIEM)",
    product: "security",
    items: [
      { title: "Overview", slug: "ciem/overview" },
      { title: "How effective permissions are computed", slug: "ciem/effective-permissions" },
      { title: "Finding types", slug: "ciem/finding-types" },
      { title: "Reading the identity graph", slug: "ciem/identity-graph" },
      { title: "Right-sizing workflow", slug: "ciem/right-sizing" },
      { title: "Per-cloud notes", slug: "ciem/per-cloud" },
    ],
  },
  {
    heading: "Compliance",
    product: "security",
    items: [{ title: "Framework Coverage", slug: "compliance/frameworks" }],
  },
  {
    heading: "Security architecture",
    product: "security",
    items: [
      { title: "Overview", slug: "architecture/overview" },
      { title: "Scanning Engine", slug: "architecture/scanning" },
      { title: "Data Security", slug: "architecture/data-security" },
    ],
  },
  /* ── Onam FinOps ── */
  {
    heading: "Onam FinOps",
    product: "finops",
    items: [
      { title: "Overview", slug: "finops/overview" },
      { title: "The Cost Model", slug: "finops/cost-model" },
      { title: "Explore", slug: "finops/explore" },
      { title: "Ownership & Attribution", slug: "finops/ownership" },
      { title: "Forecast, Budgets & Anomalies", slug: "finops/plan" },
      { title: "Savings", slug: "finops/savings" },
      { title: "Runs & Reconciliation", slug: "finops/runs" },
      { title: "Access & Entitlement", slug: "finops/access" },
    ],
  },
  /* ── Onam DRM ── */
  {
    heading: "Onam DRM",
    product: "drm",
    items: [
      { title: "Overview", slug: "drm/overview" },
      { title: "Applications & Dependencies", slug: "drm/applications" },
      { title: "Protection", slug: "drm/protection" },
      { title: "Recovery Plans & Readiness", slug: "drm/recovery-plans" },
      { title: "RTO, RPO & Drills", slug: "drm/objectives" },
      { title: "Approvals, Baselines & Drift", slug: "drm/governance" },
      { title: "Access & Entitlement", slug: "drm/access" },
    ],
  },
  /* ── Onam AIOps ── */
  {
    heading: "Onam AIOps",
    product: "aiops",
    items: [
      { title: "Overview", slug: "operations/overview" },
      { title: "Availability & Status", slug: "operations/availability" },
      { title: "Concepts", slug: "operations/concepts" },
      { title: "The Workspace", slug: "operations/workspace" },
      { title: "The Orchestrator", slug: "operations/orchestrator" },
      { title: "The Agents", slug: "operations/agents" },
      { title: "Asset Agent", slug: "operations/agents/asset-agent" },
      { title: "Security Agent", slug: "operations/agents/security-agent" },
      { title: "Compliance Agent", slug: "operations/agents/compliance-agent" },
      { title: "Data Agent", slug: "operations/agents/data-agent" },
      { title: "Automation Agent", slug: "operations/agents/automation-agent" },
      { title: "FinOps Agent", slug: "operations/agents/finops-agent" },
      { title: "DR Agent", slug: "operations/agents/dr-agent" },
      { title: "Architecture Agent", slug: "operations/agents/architecture-agent" },
      { title: "Governance & Approvals", slug: "operations/governance" },
      { title: "Security & AI Safety", slug: "operations/security" },
      { title: "Architecture", slug: "operations/architecture" },
    ],
  },
  /* ── Platform-wide ── */
  {
    heading: "Trust",
    product: "shared",
    items: [
      { title: "Trust Center", slug: "trust/security" },
      { title: "Data Retention", slug: "trust/data-retention" },
      { title: "Service Levels", slug: "trust/sla-and-slo" },
    ],
  },
  {
    heading: "Reference",
    product: "shared",
    items: [
      { title: "API", slug: "reference/api" },
      { title: "Finding Schema", slug: "reference/finding-schema" },
      { title: "Integration Catalog", slug: "reference/integration-catalog" },
      { title: "RBAC & SSO", slug: "reference/rbac-and-sso" },
    ],
  },
  {
    heading: "Release notes",
    product: "shared",
    items: [{ title: "Release Notes", slug: "release-notes" }],
  },
];

/** Sections grouped by product, in sidebar order. */
export function docGroups(sections: DocSection[] = DOC_SECTIONS) {
  const groups: { product: DocProduct; label: string; sections: DocSection[] }[] = [];
  for (const s of sections) {
    const last = groups[groups.length - 1];
    if (last && last.product === s.product) last.sections.push(s);
    else groups.push({ product: s.product, label: DOC_PRODUCT_LABEL[s.product], sections: [s] });
  }
  return groups;
}

const CUSTOM_ARTICLES: DocArticle[] = [
  ...gettingStarted,
  ...onboarding,
  ...featuresPosture,
  ...featuresWorkload,
  ...architectureCompliance,
  ...trustReference,
  ...releaseNotes,
  ...products,
  ...drm,
  ...featuresExtra,
  ...operations,
  ...dspm,
  ...codeSecurity,
  ...ciem,
  ...security,
];

function titleFromSlug(slug: string) {
  const last = slug.split("/").pop() ?? slug;
  return last
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

function breadcrumbFromSlug(slug: string) {
  return slug
    .split("/")
    .map((s) =>
      s
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
    )
    .join(" / ");
}

// Fallback for any slug without a written article yet.
function genericBody(title: string) {
  return `
This page covers **${title}** — what it does, when to use it, and how it fits into the rest of Onam.

## Overview

${title} is one of the capabilities Onam runs against every connected cloud. It is enabled by default the moment an account is onboarded, and results appear in the console within the first scan cycle.

## How it works

Onam ingests the configuration and activity signals it needs through the same read-only role you deployed during [onboarding](/docs/onboarding/aws). Evaluation runs in the Onam control plane; no agents run in your account.

> Need to talk to a human about this feature? [Book a demo](/request-demo) and we'll walk through it on your data.
`;
}

export function getDocArticle(slug: string): DocArticle {
  const custom = CUSTOM_ARTICLES.find((a) => a.slug === slug);
  if (custom) return custom;
  const title = titleFromSlug(slug);
  return {
    slug,
    title,
    breadcrumb: breadcrumbFromSlug(slug),
    body: genericBody(title),
  };
}

export function allDocSlugs(): string[] {
  return DOC_SECTIONS.flatMap((s) => s.items.map((i) => i.slug));
}
