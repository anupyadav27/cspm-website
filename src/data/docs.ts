import type { DocArticle } from "./docs-articles/types";
import { articles as gettingStarted } from "./docs-articles/getting-started";
import { articles as onboarding } from "./docs-articles/onboarding";
import { articles as featuresPosture } from "./docs-articles/features-posture";
import { articles as featuresWorkload } from "./docs-articles/features-workload";
import { articles as architectureCompliance } from "./docs-articles/architecture-compliance";
import { articles as trustReference } from "./docs-articles/trust-reference";
import { articles as releaseNotes } from "./docs-articles/release-notes";

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
      { title: "CSPM", slug: "features/cspm" },
      { title: "CIEM", slug: "features/ciem" },
      { title: "IAM Security", slug: "features/iam-security" },
      { title: "Attack Path", slug: "features/attack-path" },
      { title: "Threat Detection", slug: "features/threat-detection" },
      { title: "CDR", slug: "features/cdr" },
      { title: "SecOps", slug: "features/secops" },
      { title: "Network Security", slug: "features/network-security" },
      { title: "Data Security", slug: "features/data-security" },
      { title: "Vulnerability Management", slug: "features/vulnerability-management" },
      { title: "Container Security", slug: "features/container-security" },
      { title: "IaC Scanning", slug: "features/iac-scanning" },
      { title: "Compliance", slug: "features/compliance" },
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
