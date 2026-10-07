import { Boxes, Network, Workflow } from "lucide-react";
import { CLOUDS } from "@/lib/product-facts";
import type { Capability } from "./types";

/**
 * Onam Estate capability pages — filled ONLY from the estate docs
 * (src/data/docs-articles/products.ts, estate/*) and productPages.estate.
 *
 * Hard limits, said on the pages: discovery is read-only; the architecture view draws
 * AWS accounts only today; Estate carries no cost (that is Onam FinOps); Estate does
 * not evaluate posture or raise findings (that is Onam Security). The Asset Agent is
 * "early" in src/data/operations.ts and reads the Onam Security inventory today.
 * No Estate console screenshots exist, so none are listed.
 */

const ASSET_AGENT = {
  name: "Asset Agent",
  status: "early" as const,
  href: "/docs/operations/agents/asset-agent",
};

export const capabilities: Capability[] = [
  /* ─────────────────────────────  INVENTORY  ───────────────────────────── */
  {
    product: "estate",
    slug: "inventory",
    name: "Inventory",
    icon: Boxes,
    seoTitle: "Cloud asset inventory — Onam Estate",
    metaDescription:
      "Every cloud resource the discovery pipeline has found, across every account and region, with its state and the time it was last confirmed to exist.",
    question: "What do we run, where, and in which account?",
    lead: "The Inventory view lists every resource Onam Estate's discovery has found, across every connected account and region — each with the time discovery last confirmed it exists.",
    problem:
      "Someone asks how many production databases we run, and in which accounts. We get three answers: one from the CMDB, one from Terraform state, one from the billing export. The CMDB was last reconciled by hand, the state file only covers what went through the pipeline, and nobody can say which list is right. The gap between them is where forgotten infrastructure lives.",
    whatYouSee: [
      {
        title: "Asset and type",
        body: "The resource name with its type, for every resource the discovery pipeline has found.",
      },
      {
        title: "Provider, region and account",
        body: "Which cloud it was discovered in, the region it lives in, and the account or subscription that owns it.",
      },
      {
        title: "Lifecycle state",
        body: "The resource's current state, as discovery last recorded it.",
      },
      {
        title: "Last seen",
        body: "How long ago discovery last confirmed the resource exists. A resource that stops appearing ages instead of silently vanishing.",
      },
      {
        title: `All ${CLOUDS} supported clouds`,
        body: "AWS, Azure, Google Cloud, Oracle Cloud, Alibaba Cloud, IBM Cloud and Kubernetes — from the platform's shared discovery.",
      },
      {
        title: "Quick on very large estates",
        body: "Listings are keyset-paginated, so each page costs the same however deep you are in a list of hundreds of thousands of assets.",
      },
    ],
    steps: [
      {
        title: "Discover",
        body: "A discovery pipeline enumerates resources across your connected accounts and regions with read-only credentials. Nothing is installed and nothing is modified.",
      },
      {
        title: "Record each asset",
        body: "Each resource is written as an asset with provider, region, account, state and last-seen time.",
      },
      {
        title: "Confirm on every run",
        body: "Each run confirms the resources it finds again. A resource that is no longer found keeps its row, and its last-seen time ages.",
      },
      {
        title: "Read the list",
        body: "The Inventory view lists every asset across accounts and regions, paged with keysets so large estates stay quick.",
      },
    ],
    limits: [
      {
        title: "It does not show cost",
        body: "Estate answers what exists and how it is connected, not what a resource costs. Spend, owners, forecasts, budgets and savings are Onam FinOps, a separate product built on your billing data.",
      },
      {
        title: "It does not raise security findings",
        body: "Estate does not evaluate posture rules, score risk or raise findings. That is Onam Security, which reads the same discovery output.",
      },
      {
        title: "As current as the last run",
        body: "The list reflects the last completed discovery run, not a real-time feed. Last-seen times and the run history show how fresh it is.",
      },
    ],
    agent: {
      ...ASSET_AGENT,
      line: "Answers what exists, how it is connected and who owns it — over the resolved estate, never by re-scanning. In early access, it reads the Onam Security inventory today.",
    },
    faqs: [
      {
        q: "What does \"last seen\" tell me?",
        a: "When discovery last confirmed the resource exists. A resource that stops appearing does not silently vanish from the list; its last-seen time ages, which is how decommissioned-but-not-really infrastructure becomes visible.",
      },
      {
        q: "A whole account's last-seen times are ageing together. Was it decommissioned?",
        a: "Probably not. When last-seen times across a whole account age together, that is a pipeline problem rather than a decommissioning event. Check the discovery pipeline's run history before concluding anything about the account.",
      },
      {
        q: "Which clouds does the inventory cover?",
        a: `All ${CLOUDS} clouds Onam supports — AWS, Azure, Google Cloud, Oracle Cloud, Alibaba Cloud, IBM Cloud and Kubernetes — because it comes from the platform's shared discovery.`,
      },
      {
        q: "Can I see what each resource costs?",
        a: "Not in Estate. Estate answers what exists and how it is connected. For cost — what you spent, who owns it, forecast, budgets, anomalies and savings — see Onam FinOps, a separate product built on your billing data.",
      },
      {
        q: "How is this different from the inventory inside Onam Security?",
        a: "It is the same discovery, sold as its own product. Onam Security's inventory answers security questions; Onam Estate is the estate of record — what exists, how it is connected, and when it was last seen. Organisations entitled to both get one inventory feeding both.",
      },
    ],
    docs: "/docs/estate/inventory",
    related: ["architecture", "discovery"],
  },

  /* ────────────────────────────  ARCHITECTURE  ──────────────────────────── */
  {
    product: "estate",
    slug: "architecture",
    name: "Architecture",
    icon: Network,
    seoTitle: "Cloud account architecture view — Onam Estate",
    metaDescription:
      "One AWS account's topology: its assets, the relationships between them, and the external edges that connect it to everything outside it.",
    question: "How is this account wired together, and what reaches outside it?",
    lead: "The Architecture view summarises one account's topology: what it holds, how the pieces connect, and which relationships cross the account boundary. It draws AWS accounts today.",
    problem:
      "We have a diagram of how an account is supposed to look. It was drawn for a design review and has not been touched since. What we need to know is what the account actually holds and what it really connects to — the peering, the cross-account trust, the shared service — because that is what decides whether it is isolated, whatever the diagram says.",
    whatYouSee: [
      {
        title: "Assets",
        body: "The resources discovered in this account.",
      },
      {
        title: "Edges",
        body: "The total of recorded relationships between those resources.",
      },
      {
        title: "Containment edges",
        body: "\"Lives inside\" relationships — a subnet in a VPC, a container in a task.",
      },
      {
        title: "External edges",
        body: "Relationships that cross the account boundary. The number to read first: an account with very few is genuinely isolated; one with many is not.",
      },
      {
        title: "Asset type breakdown",
        body: "Assets by type, so sprawl is visible by shape and not only by total. Two thousand log groups is a different estate from two thousand compute resources.",
      },
    ],
    steps: [
      {
        title: "Discover",
        body: "The discovery pipeline enumerates the account's resources with read-only credentials and writes each one as an asset.",
      },
      {
        title: "Record relationships",
        body: "Relationships are written as edges: containment edges for what lives inside what, external edges for what crosses the account boundary.",
      },
      {
        title: "Build the scene",
        body: "The discovery pipeline builds a scene for the account — what the view renders from.",
      },
      {
        title: "Render the view",
        body: "The Architecture view renders from that scene. An account that has never completed a run has no scene, and the view says so instead of drawing an empty diagram.",
      },
    ],
    limits: [
      {
        title: "AWS accounts only, today",
        body: `The per-account architecture view draws AWS accounts today. The asset inventory itself covers all ${CLOUDS} supported clouds.`,
      },
      {
        title: "Nothing to draw before a completed run",
        body: "The view renders from a scene the discovery pipeline builds. Until an account completes a run, the view says there is no scene rather than showing an empty diagram.",
      },
      {
        title: "It does not judge the topology",
        body: "It shows how the account is connected. It does not evaluate posture or raise findings about it — that is Onam Security.",
      },
    ],
    agent: {
      ...ASSET_AGENT,
      line: "Maps relationships and dependencies between resources, and answers how the estate is connected. In early access, it reads the Onam Security inventory today.",
    },
    faqs: [
      {
        q: "Which clouds does the architecture view draw?",
        a: `AWS accounts today. The asset inventory covers all ${CLOUDS} clouds Onam supports, because it comes from the platform's shared discovery; the per-account topology view is AWS-only for now.`,
      },
      {
        q: "Why read external edges first?",
        a: "They are the account's actual connection to everything outside it — the peering, the cross-account trust, the shared service. An account with very few external edges is genuinely isolated; one with many is not, whatever the architecture diagram says.",
      },
      {
        q: "What is the difference between an edge and a containment edge?",
        a: "Edges are all recorded relationships between the account's assets. Containment edges are the \"lives inside\" subset — a subnet in a VPC, a container in a task. External edges are the ones that cross the account boundary.",
      },
      {
        q: "Why does an account show no diagram?",
        a: "The view renders from a scene the discovery pipeline builds. If the account has never completed a run, there is no scene, and the view says so. Run the pipeline for that account first.",
      },
    ],
    docs: "/docs/estate/architecture",
    related: ["inventory", "discovery"],
  },

  /* ──────────────────────────  DISCOVERY PIPELINE  ────────────────────────── */
  {
    product: "estate",
    slug: "discovery",
    name: "Discovery pipeline",
    icon: Workflow,
    seoTitle: "Read-only cloud discovery pipeline — Onam Estate",
    metaDescription:
      "Every discovery run over your cloud accounts and regions, with its trigger, status, start and completion — so a stale inventory shows as stale.",
    question: "Is our inventory current, and did the last run finish?",
    lead: "The Pipeline view is the run history for discovery: every pass over your accounts and regions, what triggered it and how it ended. Discovery is read-only — nothing is installed and nothing is modified.",
    problem:
      "Someone asks whether a resource is really gone. The honest answer depends on whether the last discovery run over that account actually finished. A failed or partial run leaves an inventory that looks complete and is not, and without the run history nobody can tell the difference. An inventory without provenance is a claim.",
    whatYouSee: [
      {
        title: "Run",
        body: "The identifier of each discovery run.",
      },
      {
        title: "Trigger",
        body: "What started it — the schedule, onboarding, or a manual request.",
      },
      {
        title: "Status",
        body: "How the run ended, so a failed or partial run is visible as one.",
      },
      {
        title: "Started and completed",
        body: "When it ran, and how long it took.",
      },
      {
        title: "Read-only access",
        body: "The same read-only role, service principal or service account as the rest of the platform. Nothing installed on a workload, nothing written to your environment.",
      },
    ],
    steps: [
      {
        title: "Connect read-only",
        body: "Discovery uses the platform's read-only access: an IAM role, a service principal or a service account. No agents, no write permissions.",
      },
      {
        title: "Run on schedule",
        body: "Runs start on the schedule, at onboarding, or on a manual request. Scheduling is automatic and follows the organisation's entitlement.",
      },
      {
        title: "Enumerate and record",
        body: "Each run enumerates resources across connected accounts and regions, and writes assets and their relationships as edges.",
      },
      {
        title: "Record the run",
        body: "Every pass is recorded with its trigger, status, start and completion, so the inventory carries its own provenance.",
      },
    ],
    limits: [
      {
        title: "It never writes to your cloud",
        body: "Discovery reads. It installs nothing on a workload and changes nothing in your environment.",
      },
      {
        title: "Scope follows entitlement, not settings",
        body: "Estate alone runs discovery on its own; Estate with Onam Security runs the full pipeline. There is nothing to configure.",
      },
      {
        title: "Scheduled, not real-time",
        body: "The inventory is as current as the last successful run. The run history shows exactly when that was.",
      },
    ],
    agent: {
      ...ASSET_AGENT,
      line: "Answers questions over the resolved estate, never by re-scanning — it works from what discovery recorded. In early access, it reads the Onam Security inventory today.",
    },
    faqs: [
      {
        q: "Does discovery need agents or write access?",
        a: "Neither. Discovery uses read-only cloud credentials, the same connection model as the rest of the platform. Nothing is installed on a workload and nothing in your environment is modified.",
      },
      {
        q: "What starts a run?",
        a: "The schedule, onboarding, or a manual request. Scheduling is automatic and follows the organisation's entitlement.",
      },
      {
        q: "If I have Onam Security too, do I connect my accounts twice?",
        a: "No. Estate and Onam Security share one discovery pass. An organisation entitled to both runs the full pipeline once, and both products read the same output — so there are not two inventories that disagree.",
      },
      {
        q: "Why is the run history its own view?",
        a: "Because whether a resource is really gone depends on whether the last run over that account finished. Putting run status on its own page means a stale picture is visible as a stale picture.",
      },
    ],
    docs: "/docs/estate/pipeline",
    related: ["inventory", "architecture"],
  },
];
