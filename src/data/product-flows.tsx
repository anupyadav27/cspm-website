import {
  Activity,
  BadgeCheck,
  BookOpen,
  ClipboardCheck,
  Clock,
  Crosshair,
  Database,
  Eye,
  FileCheck2,
  Gauge,
  GitBranch,
  Globe,
  Handshake,
  HardDrive,
  KeyRound,
  Layers,
  ListOrdered,
  Lock,
  Network,
  Radar,
  Route,
  Server,
  ShieldAlert,
  ShieldCheck,
  Ban,
  UserRound,
  Wand2,
  Webhook,
} from "@/components/site/icons";
import type { FlowSpec } from "@/components/site/product/DataFlow";
import { renderVisual } from "@/components/site/product/GenericVisuals";
import type { FlowData } from "./product-flows.types";
import { flowsA } from "./product-flows-a";
import { flowsB } from "./product-flows-b";
import {
  ChokePointGraph,
  DataStoreRisk,
  IdentityGraph,
  SeverityRaise,
} from "@/components/site/product/FlowVisuals";

/**
 * "The whole picture" dataflow diagrams, keyed like platform-pages.ts. Labels are a few words each and
 * every claim comes from the product's own entry in platform-pages.ts (mechanism, whatYouGet) and, for
 * CIEM, the owner-cleared limits behind CiemExtra.tsx. Numbers only where the page entry has them.
 */

const CLOUDS = [
  "AWS",
  "Microsoft Azure",
  "Google Cloud",
  "Kubernetes",
  "Oracle Cloud",
  "Alibaba Cloud",
  "IBM Cloud",
];

const HANDMADE: Record<string, FlowSpec> = {
  ciem: {
    heading: "From identity sources to a decision",
    intro:
      "Onam reads every identity in your clouds, works out what each one can really do, maps who can reach what, and tells you what to fix.",
    stages: ["Your clouds", "Work out real access", "Map who can reach what", "What you get"],
    inputs: [
      ...CLOUDS.map((label) => ({ label })),
      { label: "Audit logs", hint: "AWS · Google Cloud", accent: true },
    ],
    engine: {
      name: "Onam CIEM",
      sub: "Works out what each identity can really do",
      steps: ["Expand groups", "Check conditions", "Apply denies and SCPs", "Grade each grant"],
      footer: "Admin · IAM control · write · read · list",
    },
    visual: <IdentityGraph />,
    visualNote: { text: "A route to admin, flagged", color: "#B42318" },
    outputs: [
      {
        id: "esc",
        icon: ShieldAlert,
        label: "Escalation paths",
        hint: "Routes to admin",
        color: "#DC2626",
      },
      {
        id: "shadow",
        icon: UserRound,
        label: "Shadow admins",
        hint: "Hidden admin power",
        color: "#EA580C",
      },
      {
        id: "trust",
        icon: Handshake,
        label: "Risky trust",
        hint: "Foreign accounts, wildcards",
        color: "#CA8A04",
      },
      {
        id: "unused",
        icon: Clock,
        label: "Unused permissions",
        hint: "Granted, never used",
        color: "#0891B2",
      },
      {
        id: "score",
        icon: Gauge,
        label: "Risk score 0–100",
        hint: "Per identity, on AWS",
        color: "#7C3AED",
      },
      {
        id: "review",
        icon: ClipboardCheck,
        label: "Access reviews",
        hint: "Pending to reviewed",
        color: "#059669",
      },
    ],
    footnote: "AWS has the deepest coverage. The table below shows what runs on each cloud today.",
    caption:
      "How Onam CIEM works: identities from AWS, Azure, Google Cloud, Kubernetes, OCI, Alibaba Cloud and IBM Cloud, plus audit-log activity from AWS and Google Cloud, go into Onam CIEM, which expands groups, checks conditions, applies denies and SCPs and grades each grant. The result is an identity graph, which produces escalation paths, shadow admins, risky trust, unused permissions, a 0 to 100 risk score and access reviews.",
  },

  "attack-path": {
    heading: "From scan evidence to the one fix that blocks the most",
    intro:
      "Onam joins what every engine found into one graph, walks only the routes the evidence confirms, and shows where a single fix cuts the most paths.",
    stages: ["Evidence in", "Walk the graph", "Find the routes", "What you get"],
    inputs: [
      { label: "IAM policies", icon: KeyRound, hint: "Who can assume what" },
      { label: "Network exposure", icon: Globe, hint: "What the internet reaches" },
      { label: "Security-group rules", icon: Network, hint: "What is open, what is blocked" },
      { label: "Data access", icon: Database, hint: "Who can read the data" },
      { label: "Threat detection", icon: Radar, hint: "Movement seen in logs" },
    ],
    engine: {
      name: "Onam Attack Path",
      sub: "Walks only what the evidence confirms",
      steps: [
        "Build the security graph",
        "Keep confirmed edges",
        "Search from entry points",
        "Score likelihood × impact",
      ],
      footer: "Every edge: confirmed · blocked · gap",
    },
    visual: <ChokePointGraph />,
    visualNote: { text: "Two routes, one choke point", color: "#B45309" },
    outputs: [
      {
        id: "paths",
        icon: Route,
        label: "Attack paths",
        hint: "Entry point to crown jewel",
        color: "#DC2626",
      },
      {
        id: "choke",
        icon: Ban,
        label: "Choke points",
        hint: "One fix, many paths blocked",
        color: "#D97706",
      },
      {
        id: "sev",
        icon: Gauge,
        label: "Path severity",
        hint: "Likelihood × impact",
        color: "#7C3AED",
      },
      {
        id: "mitre",
        icon: Crosshair,
        label: "MITRE ATT&CK",
        hint: "Tactic on every hop",
        color: "#2563EB",
      },
      {
        id: "fix",
        icon: Wand2,
        label: "Fix per hop",
        hint: "A remediation step",
        color: "#059669",
      },
      {
        id: "fresh",
        icon: Activity,
        label: "Rebuilt every scan",
        hint: "Fixed routes disappear",
        color: "#0891B2",
      },
    ],
    footnote: "A route a security group or policy blocks never becomes a path.",
    caption:
      "How Onam Attack Path works: evidence from IAM policies, network exposure, security-group rules, data access and threat detection goes into Onam Attack Path, which builds the security graph, keeps only confirmed edges, searches from entry points and scores each path by likelihood times impact. Routes from different entry points that share a resource meet at a choke point. The outputs are attack paths, choke points, path severity, MITRE ATT&CK on every hop, a fix per hop, and a graph rebuilt on every scan.",
  },

  cspm: {
    heading: "From a read-only connection to a ranked fix",
    intro:
      "Onam checks every resource in your clouds on each scan, raises the severity when context makes it worse, and hands your team the fix.",
    stages: ["Your clouds", "Check every resource", "Rank what matters", "What you get"],
    inputs: [
      ...CLOUDS.map((label) => ({ label })),
      { label: "Read-only roles", hint: "IAM roles, service principals", accent: true },
    ],
    engine: {
      name: "Onam CSPM",
      sub: "One engine for every cloud",
      steps: [
        "Discover resources",
        "Run posture rules",
        "Raise severity by context",
        "Draft the fix",
      ],
      footer: "Resources across 672 services",
    },
    visual: <SeverityRaise />,
    visualNote: { text: "Context raises the severity", color: "#B42318" },
    outputs: [
      {
        id: "ranked",
        icon: ListOrdered,
        label: "Ranked findings",
        hint: "Critical to Low",
        color: "#DC2626",
      },
      {
        id: "fix",
        icon: Wand2,
        label: "Fix guidance",
        hint: "CLI, Terraform, console",
        color: "#059669",
      },
      {
        id: "comp",
        icon: FileCheck2,
        label: "Compliance impact",
        hint: "Frameworks it affects",
        color: "#7C3AED",
      },
      {
        id: "mitre",
        icon: Crosshair,
        label: "MITRE ATT&CK",
        hint: "On every rule",
        color: "#2563EB",
      },
      {
        id: "tickets",
        icon: Webhook,
        label: "Tickets and alerts",
        hint: "Jira, ServiceNow, Slack",
        color: "#D97706",
      },
      {
        id: "verify",
        icon: BadgeCheck,
        label: "Verified fixes",
        hint: "Re-checked next scan",
        color: "#0891B2",
      },
    ],
    footnote:
      "Posture scanning connects through read-only roles: IAM roles, service principals or service accounts.",
    caption:
      "How Onam CSPM works: AWS, Azure, Google Cloud, Kubernetes, OCI, Alibaba Cloud and IBM Cloud connect through read-only roles. Onam CSPM discovers resources, runs posture rules, raises severity by context and drafts the fix. A finding's severity rises when the resource is internet exposed, on an attack path or a valuable asset, and it gets a fix-by date and an AI fix prompt. The outputs are ranked findings, fix guidance, compliance impact, MITRE ATT&CK on every rule, tickets and alerts, and fixes verified on the next scan.",
  },

  "data-security": {
    heading: "From a list of stores to the risk around them",
    intro:
      "Onam finds every data store, works out what it holds, and joins it to who can reach it, so a sensitive store is never judged on its own.",
    stages: ["Your data stores", "Know what it holds", "See the risk around it", "What you get"],
    inputs: [
      { label: "Object storage", icon: HardDrive, hint: "Buckets and blobs" },
      { label: "Managed databases", icon: Database, hint: "Cloud database services" },
      { label: "Warehouses", icon: Layers, hint: "Analytics stores" },
      { label: "Streams", icon: Activity, hint: "Data streams" },
      { label: "Kubernetes secrets", icon: Lock, hint: "Secrets and ConfigMaps" },
      { label: "File shares", icon: Server, hint: "On-prem collector", accent: true },
    ],
    engine: {
      name: "Onam DSPM",
      sub: "Knows what each store holds",
      steps: [
        "Discover every store",
        "Classify from metadata",
        "Sample contents",
        "Join exposure and access",
      ],
      footer: "Contents sampled only where you deploy the scanner",
    },
    visual: <DataStoreRisk />,
    visualNote: { text: "Sensitive and public: first in line", color: "#B42318" },
    outputs: [
      {
        id: "catalog",
        icon: BookOpen,
        label: "Data catalog",
        hint: "Every store, labelled",
        color: "#2563EB",
      },
      {
        id: "public",
        icon: Globe,
        label: "Public exposure",
        hint: "Which grant made it public",
        color: "#DC2626",
      },
      {
        id: "access",
        icon: Eye,
        label: "Observed access",
        hint: "Who touched it, 30 days",
        color: "#D97706",
      },
      {
        id: "enc",
        icon: ShieldCheck,
        label: "Encryption gaps",
        hint: "Unencrypted, provider keys",
        color: "#7C3AED",
      },
      {
        id: "lineage",
        icon: GitBranch,
        label: "Data lineage",
        hint: "Copies, up to eight hops",
        color: "#0891B2",
      },
      {
        id: "score",
        icon: Gauge,
        label: "Governance score",
        hint: "0–100 per store",
        color: "#059669",
      },
    ],
    footnote:
      "Classification uses metadata by default. Contents are read only where you deploy Onam's DSPM scanner or on-prem collector.",
    caption:
      "How Onam DSPM works: object storage, managed databases, warehouses, streams, Kubernetes secrets and, with the on-prem collector, file shares go into Onam DSPM, which discovers every store, classifies it from metadata, samples contents where the scanner is deployed and joins exposure and access. Around each store it shows public grants, encryption, who touched it and its copies. The outputs are a data catalog, public exposure, observed access, encryption gaps, data lineage and a 0 to 100 governance score.",
  },
};

const fromData = (d: FlowData): FlowSpec => ({ ...d, visual: renderVisual(d.visual) });

/** Every product page's diagram: the four hand-drawn ones above, the rest from plain data. */
export const PRODUCT_FLOWS: Record<string, FlowSpec> = {
  ...Object.fromEntries(Object.entries({ ...flowsA, ...flowsB }).map(([k, d]) => [k, fromData(d)])),
  ...HANDMADE,
};

/** The data behind the generated diagrams, for scripts/test-product-flows.ts. */
export const PRODUCT_FLOW_DATA: Record<string, FlowData> = { ...flowsA, ...flowsB };
