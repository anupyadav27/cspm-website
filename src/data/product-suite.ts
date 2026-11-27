import { Bot, type LucideIcon } from "@/components/site/icons";
import { SERVICES, FRAMEWORKS } from "@/lib/product-facts";
import { PRODUCTS, type ProductSummary } from "@/data/products";
import { OPS_STATUS, type OpsStatus } from "@/data/operations";

/**
 * What a buyer navigates: Onam Security, and Onam AI — its AI security analyst.
 * One source for the Products menu, the homepage product section and the footer, so the
 * menu and the page cannot list different modules.
 *
 * Owner decision 17 Nov 2026: Estate, FinOps and DRM are retired; "Onam AIOps" is now
 * "Onam AI" and serves Onam Security only. Onam AI statuses come from OPS_AGENTS /
 * OPS_FEATURES (src/data/operations.ts) — never upgrade one here.
 */

export type SuiteKey = ProductSummary["key"] | "aiops";

export type SuiteModule = {
  title: string;
  href: string;
  desc: string;
  /** Onam AI only: shown as a status chip so roadmap items never read as shipped. */
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
  /** Provenance shown on the picture: "Real console, …" for a capture, "Drawing, sample data" for a drawing. */
  imageLabel: string;
  docs: string;
  badge?: string;
  groups: SuiteGroup[];
  /** The AI analyst that works on this product, and its honest status. */
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
        title: "Threats — Detection",
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
        desc: "SageMaker, Bedrock, Azure OpenAI and Google Agent Platform (Vertex AI) risk",
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
    ...pick("security"),
    short: "Security",
    stage: "Cloud · SaaS · Code",
    image: "/screens/cnapp/cnapp-areas.webp",
    imageAlt:
      "The CNAPP page in the Onam console: one CNAPP score out of 100 and a card for each security area, such as cloud posture, threat detection, workloads, data, network, attack paths, code and AI, each with its findings and critical and high counts.",
    imageLabel: "Real console, Onam's internal test workspace, captured 26 Nov 2026. Account and tenant IDs redacted.",
    docs: "/docs/security/overview",
    groups: SECURITY_GROUPS,
    agent: {
      name: "Onam AI",
      href: "/onam-ai",
      status: "early",
    },
  },
  {
    // Key stays "aiops" so demo-form leads and ?product= links keep their value; the
    // name a visitor sees is "Onam AI".
    key: "aiops",
    name: "Onam AI",
    short: "Onam AI",
    stage: "Your AI security analyst",
    href: "/onam-ai",
    icon: Bot,
    color: AIOPS_COLOR,
    badge: OPS_STATUS.early.label,
    question: "Can I ask my security data a question and get an answer I can check?",
    blurb:
      "Your AI security analyst for Onam Security. Ask about findings, attack paths and data security; every answer cites its evidence and masks sensitive values. It suggests fixes and never changes your cloud without a person's approval.",
    image: "/images/products/onam-ai.svg",
    imageAlt:
      "Drawing of Onam AI's suggested fixes: each fix, the evidence behind it, and whether a person approved it.",
    imageLabel: "Drawing, sample data",
    docs: "/docs/operations/overview",
    groups: [
      {
        heading: "Ask",
        items: [
          {
            title: "Assets & blast radius",
            href: "/onam-ai#agents",
            desc: "What you run, how it connects, which assets are crown jewels",
            status: "early",
          },
          {
            title: "Findings & exposure",
            href: "/onam-ai#agents",
            desc: "What is exposed, how it is reached, how bad it is",
            status: "early",
          },
          {
            title: "Attack paths",
            href: "/onam-ai#use-cases",
            desc: "A route to a crown-jewel asset, in plain language",
            status: "early",
          },
          {
            title: "Data security",
            href: "/onam-ai#agents",
            desc: "What data is where, and who can reach it",
            status: "development",
          },
          {
            title: "Compliance evidence",
            href: "/onam-ai#agents",
            desc: "Which controls hold, and where the evidence is",
            status: "development",
          },
        ],
      },
      {
        heading: "How people stay in control",
        items: [
          {
            title: "Workspace",
            href: "/onam-ai#workspace",
            desc: "Ask in plain language; see the plan before it runs",
            status: "early",
          },
          {
            title: "Suggested fixes & approvals",
            href: "/onam-ai#approvals",
            desc: "Every proposed change waits for a person",
            status: "early",
          },
          {
            title: "Audit trail & kill switch",
            href: "/onam-ai#evidence",
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
