import { Bot, type LucideIcon } from "lucide-react";
import { SERVICES, FRAMEWORKS } from "@/lib/product-facts";
import { PRODUCTS, type ProductSummary } from "@/data/products";
import { OPS_STATUS, type OpsStatus } from "@/data/operations";

/**
 * The product suite as a buyer navigates it: four products in lifecycle order, plus
 * Onam AIOps across them. One source for the Products menu, the homepage suite
 * section and the footer, so the menu and the page cannot list different modules.
 *
 * Module copy is taken from the product docs (src/data/docs-articles/products.ts,
 * drm.ts, operations.ts) and says only what those docs say each view does. AIOps
 * statuses come from OPS_AGENTS / OPS_FEATURES — never upgrade one here.
 */

export type SuiteKey = ProductSummary["key"] | "aiops";

export type SuiteModule = {
  title: string;
  href: string;
  desc: string;
  /** AIOps only: shown as a status chip so roadmap items never read as shipped. */
  status?: OpsStatus;
};

export type SuiteGroup = { heading: string; items: SuiteModule[] };

export type SuiteProduct = {
  key: SuiteKey;
  name: string;
  /** Tab label in the menu. */
  short: string;
  /** Lifecycle stage, shown above the name. */
  stage: string;
  href: string;
  icon: LucideIcon;
  color: string;
  question: string;
  blurb: string;
  /** Reviewed product illustration — see IMAGE-REVIEW-CHECKLIST.md. */
  image: string;
  imageAlt: string;
  docs: string;
  badge?: string;
  groups: SuiteGroup[];
  /** The AIOps agent that works on this product, and its honest status. */
  agent?: { name: string; href: string; status: OpsStatus };
};

const p = (k: ProductSummary["key"]) => PRODUCTS.find((x) => x.key === k)!;

export const SECURITY_GROUPS: SuiteGroup[] = [
  {
    heading: "Posture & Identity",
    items: [
      { title: "CNAPP", href: "/platform/cnapp", desc: "Seven pillars, one posture score" },
      { title: "CSPM", href: "/platform/cspm", desc: "Misconfigurations across all clouds" },
      { title: "CIEM", href: "/platform/ciem", desc: "Effective permissions & escalation paths" },
      { title: "IAM Security", href: "/platform/iam", desc: "MFA, keys and policy hygiene" },
      {
        title: "Asset Inventory",
        href: "/platform/inventory",
        desc: `${SERVICES} services, seven clouds, one list`,
      },
    ],
  },
  {
    heading: "Threat & Attack",
    items: [
      {
        title: "Attack Path",
        href: "/platform/attack-path",
        desc: "Routes to crown jewels, choke points",
      },
      {
        title: "CDR — Detection",
        href: "/platform/cdr",
        desc: "L1/L2/L3 behavioral threat detection",
      },
      {
        title: "Threat Detection",
        href: "/platform/threat-detection",
        desc: "MITRE ATT&CK–mapped attack chains",
      },
      {
        title: "Risk Quantification",
        href: "/platform/risk",
        desc: "FAIR-style loss estimate per finding",
      },
    ],
  },
  {
    heading: "Data & Network",
    items: [
      {
        title: "DSPM — Data Security",
        href: "/platform/data-security",
        desc: "Sensitive data, who reaches it, where it flows",
      },
      {
        title: "Database Security",
        href: "/platform/database-security",
        desc: "Managed DBs + CIS engine benchmarks",
      },
      {
        title: "Encryption & Keys",
        href: "/platform/encryption",
        desc: "KMS keys, rotation, and key-policy reach",
      },
      {
        title: "Network Security",
        href: "/platform/network-security",
        desc: "7-layer topology analysis",
      },
      {
        title: "API Security",
        href: "/platform/api-security",
        desc: "Shadow APIs, auth gaps, WAF coverage",
      },
    ],
  },
  {
    heading: "Workloads & Code",
    items: [
      {
        title: "CWPP — Workloads",
        href: "/platform/cwpp",
        desc: "VMs, containers, serverless, hosts",
      },
      {
        title: "Agentless Scanning",
        href: "/platform/agentless",
        desc: "Snapshot scanning inside your account",
      },
      {
        title: "Container Security",
        href: "/platform/container-security",
        desc: "EKS, ECS, and image scanning",
      },
      {
        title: "Vulnerability Mgmt",
        href: "/platform/vulnerability",
        desc: "CVEs in context, not just CVSS",
      },
      { title: "Code Security", href: "/platform/code-security", desc: "SAST, DAST, SCA, IaC" },
      { title: "AI Code Fix", href: "/platform/ai-code-fix", desc: "Fixes pushed to a branch" },
    ],
  },
  {
    heading: "SaaS, AI & Governance",
    items: [
      {
        title: "SaaS Security (SSPM)",
        href: "/platform/saas-security",
        desc: "M365, Workspace, GitHub, Snowflake",
      },
      {
        title: "AI Security",
        href: "/platform/ai-security",
        desc: "SageMaker, Bedrock, and AI/ML risk",
      },
      {
        title: "AI Assistant",
        href: "/platform/ai-assistant",
        desc: "Ask your posture in plain language",
      },
      {
        title: "Remediation",
        href: "/platform/remediation",
        desc: "Fix guidance and an AI fix prompt",
      },
      {
        title: "Compliance",
        href: "/platform/compliance",
        desc: `${FRAMEWORKS} frameworks, evidence per control`,
      },
      {
        title: "Technology Engine",
        href: "/platform/technology",
        desc: "34 technologies, runtime discovery",
      },
    ],
  },
];

export const AIOPS_COLOR = "#4F46E5";

export const SUITE: SuiteProduct[] = [
  {
    ...pick("estate"),
    // Not PRODUCTS' blurb: its "cost on every row" is unconfirmed in code (see a2daff7).
    blurb:
      "Continuous discovery of every cloud resource and the relationships between them — one estate of record that every other product works from.",
    short: "Estate",
    stage: "1 · Discover",
    image: "/images/products/estate.svg",
    imageAlt:
      "Illustration: cloud resources on one platform, joined by relationship lines into a single asset graph.",
    docs: "/docs/estate/overview",
    groups: [
      {
        heading: "Inside Onam Estate",
        items: [
          {
            title: "Inventory",
            href: "/estate/inventory",
            desc: "Every discovered resource, across accounts and regions",
          },
          {
            title: "Architecture",
            href: "/estate/architecture",
            desc: "One account's topology: what it holds and how it connects",
          },
          {
            title: "Discovery pipeline",
            href: "/estate/discovery",
            desc: "Every discovery run, its trigger and how it ended",
          },
        ],
      },
    ],
    agent: { name: "Asset Agent", href: "/platform/ai-operations#agents", status: "early" },
  },
  {
    ...pick("security"),
    short: "Security",
    stage: "2 · Secure",
    image: "/images/products/security.svg",
    imageAlt:
      "Illustration: a shield over a protected database, with an attack route to it cut at one point.",
    docs: "/docs/security/overview",
    groups: SECURITY_GROUPS,
    agent: {
      name: "Security Agent",
      href: "/platform/ai-operations#agents",
      status: "early",
    },
  },
  {
    ...pick("finops"),
    short: "FinOps",
    stage: "3 · Optimise",
    image: "/images/products/finops.svg",
    imageAlt: "Illustration: daily cost bars beside a stack of coins and an ownership tag.",
    docs: "/docs/finops/overview",
    groups: [
      {
        heading: "Inside Onam FinOps",
        items: [
          {
            title: "Cost explorer",
            href: "/finops/explore",
            desc: "Daily cost, billed and effective, period over period",
          },
          {
            title: "Ownership & attribution",
            href: "/finops/ownership",
            desc: "Cost by owner and cost centre, with what is unattributed",
          },
          {
            title: "Forecast, budgets & anomalies",
            href: "/finops/plan",
            desc: "Forecast as low, expected and high; budgets; anomalies",
          },
          {
            title: "Savings",
            href: "/finops/savings",
            desc: "Recommendations, each with a decision attached",
          },
          {
            title: "Reconciled billing",
            href: "/finops/reconciliation",
            desc: "Whether each period is final — the provenance behind every figure",
          },
        ],
      },
    ],
    agent: {
      name: "FinOps Agent",
      href: "/platform/ai-operations#agents",
      status: "roadmap",
    },
  },
  {
    ...pick("drm"),
    short: "DRM",
    stage: "4 · Recover",
    image: "/images/products/drm.svg",
    imageAlt:
      "Illustration: two cloud regions with a replication link between them and a recovery clock.",
    docs: "/docs/drm/overview",
    groups: [
      {
        heading: "Inside Onam DRM",
        items: [
          {
            title: "Applications & dependencies",
            href: "/disaster-recovery/applications",
            desc: "Applications proposed from your tags, with what they depend on",
          },
          {
            title: "Protection",
            href: "/disaster-recovery/protection",
            desc: "Backup, snapshot and replication read from cloud configuration",
          },
          {
            title: "Recovery plans",
            href: "/disaster-recovery/recovery-plans",
            desc: "The order each application comes back, from approved items",
          },
          {
            title: "RTO, RPO & drills",
            href: "/disaster-recovery/objectives",
            desc: "Predicted recovery time and data loss against your targets",
          },
          {
            title: "Baselines & drift",
            href: "/disaster-recovery/drift",
            desc: "What changed since the model you approved",
          },
        ],
      },
    ],
    agent: { name: "DR Agent", href: "/platform/ai-operations#agents", status: "roadmap" },
  },
  {
    key: "aiops",
    name: "Onam AIOps",
    short: "AIOps",
    stage: "Across all four",
    href: "/platform/ai-operations",
    icon: Bot,
    color: AIOPS_COLOR,
    badge: OPS_STATUS.early.label,
    question: "Can AI agents do the investigation — and leave every change to a person?",
    blurb:
      "AI agents that investigate across the platform with evidence on every claim, and propose changes a person approves. Nothing changes your cloud without that approval.",
    image: "/images/products/aiops.svg",
    imageAlt:
      "Illustration: specialist AI agents connected to one approval point where a person signs off.",
    docs: "/docs/operations/overview",
    groups: [
      {
        heading: "Agents",
        items: [
          {
            title: "Asset Agent",
            href: "/platform/ai-operations#agents",
            desc: "What we have, how it connects, who owns it",
            status: "early",
          },
          {
            title: "Security Agent",
            href: "/platform/ai-operations#agents",
            desc: "What is exposed, how it is reached, how bad it is",
            status: "early",
          },
          {
            title: "Compliance Agent",
            href: "/platform/ai-operations#agents",
            desc: "Which controls hold, and where the evidence is",
            status: "development",
          },
          {
            title: "Data Agent",
            href: "/platform/ai-operations#agents",
            desc: "What data is where, and who can reach it",
            status: "development",
          },
          {
            title: "FinOps, DR & Architecture agents",
            href: "/platform/ai-operations#agents",
            desc: "Cost, recovery and design questions",
            status: "roadmap",
          },
        ],
      },
      {
        heading: "How people stay in control",
        items: [
          {
            title: "Agent workspace",
            href: "/platform/ai-operations#workspace",
            desc: "Ask in plain language; see the plan before it runs",
            status: "early",
          },
          {
            title: "Orchestrator",
            href: "/platform/ai-operations#orchestrator",
            desc: "Routes a question to the right agents, visibly",
            status: "early",
          },
          {
            title: "Approval centre",
            href: "/platform/ai-operations#approvals",
            desc: "Every proposed change waits for a person",
            status: "early",
          },
          {
            title: "Audit trail & kill switch",
            href: "/platform/ai-operations#evidence",
            desc: "Every step recorded; autonomy capped and stoppable",
            status: "early",
          },
        ],
      },
    ],
  },
];

function pick(k: ProductSummary["key"]) {
  const x = p(k);
  return {
    key: x.key,
    name: x.name,
    href: x.href,
    icon: x.icon,
    color: x.color,
    question: x.question,
    blurb: x.blurb,
  };
}

export const getSuite = (k: SuiteKey) => SUITE.find((s) => s.key === k)!;
