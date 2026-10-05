import type { DocArticle } from "./docs-articles/types";
import { articles as gettingStarted } from "./docs-articles/getting-started";
import { articles as onboarding } from "./docs-articles/onboarding";
import { articles as featuresPosture } from "./docs-articles/features-posture";
import { articles as featuresWorkload } from "./docs-articles/features-workload";
import { articles as architectureCompliance } from "./docs-articles/architecture-compliance";
import { articles as trustReference } from "./docs-articles/trust-reference";
import { articles as releaseNotes } from "./docs-articles/release-notes";
import { articles as products } from "./docs-articles/products";
import { articles as featuresExtra } from "./docs-articles/features-extra";
import { articles as operations } from "./docs-articles/operations";

export type { DocArticle };

export type DocSection = {
  heading: string;
  items: { title: string; slug: string }[];
};

export const DOC_SECTIONS: DocSection[] = [
  {
    heading: "Getting Started",
    items: [
      { title: "Introduction", slug: "getting-started/introduction" },
      { title: "Quickstart", slug: "getting-started/quickstart" },
      { title: "Core Concepts", slug: "getting-started/core-concepts" },
    ],
  },
  {
    heading: "Onboarding",
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
  {
    heading: "Features",
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
    heading: "Architecture",
    items: [
      { title: "Overview", slug: "architecture/overview" },
      { title: "Scanning Engine", slug: "architecture/scanning" },
      { title: "Data Security", slug: "architecture/data-security" },
    ],
  },
  {
    heading: "Compliance",
    items: [{ title: "Framework Coverage", slug: "compliance/frameworks" }],
  },
  {
    heading: "Trust",
    items: [
      { title: "Trust Center", slug: "trust/security" },
      { title: "Data Retention", slug: "trust/data-retention" },
      { title: "SLA & SLO", slug: "trust/sla-and-slo" },
    ],
  },
  {
    heading: "Reference",
    items: [
      { title: "API", slug: "reference/api" },
      { title: "Finding Schema", slug: "reference/finding-schema" },
      { title: "Integration Catalog", slug: "reference/integration-catalog" },
      { title: "RBAC & SSO", slug: "reference/rbac-and-sso" },
    ],
  },
  {
    heading: "Onam Estate",
    items: [
      { title: "Overview", slug: "estate/overview" },
      { title: "Asset Inventory", slug: "estate/inventory" },
      { title: "Architecture", slug: "estate/architecture" },
      { title: "Discovery Pipeline", slug: "estate/pipeline" },
      { title: "Access & Entitlement", slug: "estate/access" },
    ],
  },
  {
    heading: "Onam FinOps",
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
  {
    heading: "Onam Operations",
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
  {
    heading: "Release Notes",
    items: [{ title: "Release Notes", slug: "release-notes" }],
  },
];

const CUSTOM_ARTICLES: DocArticle[] = [
  ...gettingStarted,
  ...onboarding,
  ...featuresPosture,
  ...featuresWorkload,
  ...architectureCompliance,
  ...trustReference,
  ...releaseNotes,
  ...products,
  ...featuresExtra,
  ...operations,
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
