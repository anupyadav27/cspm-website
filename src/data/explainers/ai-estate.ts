/**
 * The illustrative AI estate drawn by `:::lensmap ai-estate` on /docs/ai-security/overview.
 *
 * Every name here is made up. Every *check* is one AI Security runs today, and carries the
 * fact it rests on (`fact`, a key in marketing/facts/product.yaml or limits.yaml). The test
 * in ai-estate.test.ts fails if a check has no fact or a node uses a "must never appear" claim.
 *
 * Truth guards (research_notes/Product update Nov 2026/ai_security_console_validation.md):
 *  - No data link or identity is drawn on Azure or Google nodes (O1 not confirmed per type).
 *  - Self-hosted AI shows inventory and exposure only; its reach is not drawn.
 *  - Reach is one hop (runs as / reads); AI is not on attack paths, so nothing is chained.
 */

export type Lens = "run" | "exposed" | "reaches";
export type Status = "found" | "ok" | "warn" | "critical";

export type EstateCheck = {
  status: Status;
  /** ≤ 5 words, shown as the badge. */
  label: string;
  /** One line on what it means. */
  meaning: string;
  fact: string;
  /** Show "Maps to: …" on finding rows. */
  mapped?: boolean;
};

export type EstateNode = {
  id: string;
  lane: "cloud" | "k8s" | "software";
  name: string;
  type: string;
  where: string;
  /** Badge under the "What's exposed" lens; absent = nothing to flag. */
  exposed?: EstateCheck;
  runsAs?: { name: string; check?: EstateCheck };
  reads?: { name: string; store: string };
  /** For software nodes: AI ingredients read from its SBOM. */
  ingredients?: string[];
  /** A sentence shown under "What it reaches" when reach is not drawn. */
  reachNote?: string;
  loophole?: boolean;
  deepLink: { question: string; href: string };
};

export const LANES: { id: EstateNode["lane"]; label: string }[] = [
  { id: "cloud", label: "Cloud AI services" },
  { id: "k8s", label: "Self-hosted on Kubernetes" },
  { id: "software", label: "In your software" },
];

export const LENSES: { id: Lens; label: string; hint: string }[] = [
  { id: "run", label: "What you run", hint: "Every AI resource the last scan found, in one inventory." },
  { id: "exposed", label: "What's exposed", hint: "Missing guardrails and AI open to anyone, flagged each scan." },
  { id: "reaches", label: "What it reaches", hint: "The identity each AI runs as, and the data stores it reads. One hop each." },
];

export const GUARDRAIL_LINE = "Onam checks that a guardrail is attached. It does not test what it blocks.";
export const FRAMEWORKS = "OWASP Top 10 for LLM 2025 · NIST AI RMF · ISO/IEC 42001 · EU AI Act";

const SPM = "product.yaml capabilities.ai_spm_live_items";

export const AI_ESTATE: EstateNode[] = [
  {
    id: "support-assistant",
    lane: "cloud",
    name: "support-assistant",
    type: "Bedrock agent",
    where: "AWS",
    exposed: {
      status: "warn",
      label: "No guardrail attached",
      meaning: "No Amazon Bedrock guardrail is attached to this agent.",
      fact: `${SPM}[2]`,
      mapped: true,
    },
    runsAs: {
      name: "support-agent-role",
      check: {
        status: "warn",
        label: "Wide write access",
        meaning: "The role it runs as is marked as an AI agent and can write across many resources.",
        fact: `${SPM}[4]`,
        mapped: true,
      },
    },
    reads: { name: "customer-tickets", store: "S3 bucket" },
    deepLink: { question: "Which of our AI has no guardrail?", href: "/docs/ai-security/guardrails-and-exposure" },
  },
  {
    id: "churn-notebook",
    lane: "cloud",
    name: "churn-notebook",
    type: "SageMaker notebook",
    where: "AWS",
    runsAs: {
      name: "ml-exec-role",
      check: {
        status: "critical",
        label: "Admin access",
        meaning: "The execution role is marked as an AI agent and has admin access.",
        fact: `${SPM}[4]`,
        mapped: true,
      },
    },
    deepLink: { question: "What can our AI agents do?", href: "/docs/ai-security/data-and-agents" },
  },
  {
    id: "chat-prod",
    lane: "cloud",
    name: "chat-prod",
    type: "Azure OpenAI deployment",
    where: "Azure",
    exposed: {
      status: "ok",
      label: "Content filter attached",
      meaning: "An Azure AI content filter is in front of this deployment.",
      fact: `${SPM}[2]`,
    },
    deepLink: { question: "Which of our AI has no guardrail?", href: "/docs/ai-security/guardrails-and-exposure" },
  },
  {
    id: "pricing-model",
    lane: "cloud",
    name: "pricing-model",
    type: "Vertex AI endpoint",
    where: "Google Cloud",
    exposed: {
      status: "warn",
      label: "No Model Armor",
      meaning: "No Google Model Armor template protects this endpoint.",
      fact: `${SPM}[2]`,
      mapped: true,
    },
    deepLink: { question: "Which of our AI has no guardrail?", href: "/docs/ai-security/guardrails-and-exposure" },
  },
  {
    id: "llm-gpu",
    lane: "k8s",
    name: "llm-gpu",
    type: "Ollama model server",
    where: "Kubernetes · ns ml",
    exposed: {
      status: "critical",
      label: "Open, no login",
      meaning: "A self-hosted model server that answers anyone, with no authentication in front.",
      fact: `${SPM}[0]`,
      mapped: true,
    },
    reachNote: "Reach is not drawn for self-hosted AI today.",
    loophole: true,
    deepLink: { question: "Is any of our AI open to the internet?", href: "/docs/ai-security/guardrails-and-exposure" },
  },
  {
    id: "vectors",
    lane: "k8s",
    name: "vectors",
    type: "Qdrant vector database",
    where: "Kubernetes",
    reachNote: "Reach is not drawn for self-hosted AI today.",
    deepLink: { question: "How does Onam find AI we didn't list?", href: "/docs/ai-security/discovery-and-bom" },
  },
  {
    id: "research",
    lane: "k8s",
    name: "research",
    type: "Jupyter notebook",
    where: "Kubernetes",
    reachNote: "Reach is not drawn for self-hosted AI today.",
    deepLink: { question: "How does Onam find AI we didn't list?", href: "/docs/ai-security/discovery-and-bom" },
  },
  {
    id: "support-api",
    lane: "software",
    name: "support-api",
    type: "Repository",
    where: "From its SBOM",
    ingredients: ["AI library", "Model SDK", "MCP SDK"],
    deepLink: { question: "Which AI software do we ship?", href: "/docs/ai-security/discovery-and-bom" },
  },
];

/** Inventory facts every node rests on under "What you run". */
export const INVENTORY_FACT: Record<EstateNode["lane"], string> = {
  cloud: "limits.yaml ai_security_aws_only",
  k8s: `${SPM}[0]`,
  software: `${SPM}[1]`,
};
