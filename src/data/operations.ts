/**
 * Onam AI — your AI security analyst, for Onam Security. One source of truth for the
 * flagship page (/onam-ai), the design page (/onam-ai/architecture) and the docs section
 * (/docs/operations/*, URLs kept stable).
 *
 * Owner decision 17 Nov 2026: "Onam AIOps" is renamed "Onam AI" and serves Onam Security
 * only. Estate, FinOps and DRM are retired, so the Asset, FinOps, DR and Architecture agents
 * and every cost, estate-mapping and recovery claim are gone. What Onam AI does: answers
 * questions about findings, attack paths and data security, with sensitive values masked
 * in its answers; suggests fixes; never changes a customer's cloud without approval.
 *
 * SOURCES (read-only, 2026-10-05): "agentic ai platform" repo — README, docs/03 (agents,
 *   levels, permissions, orchestrator), 04 (UX), 05 (block architecture), 08 (security),
 *   09 (governance), 10 (approval model), 11 (MVP), 12 (roadmap), 15 (use cases); agents/*.yaml.
 *
 * HONESTY RULES FOR THIS FILE — read before editing a status:
 *   - "available"   = a customer can use it today in Onam Security. Only the AI Assistant.
 *   - "early"       = running on the Onam platform, enabled per organisation by Onam,
 *                     autonomy starting at "propose". Reads Onam Security inventory and findings.
 *   - "development" = built or specified, but its data feed or enablement is not in place yet.
 *   - "roadmap"     = not offered. Includes executing changes in a customer cloud (built and
 *                     tested, enabled for no customer) and clouds other than AWS for actions.
 *   No counts of skills/tools/tests appear: none is cleared.
 */

export type OpsStatus = "available" | "early" | "development" | "roadmap";

export const OPS_STATUS: Record<
  OpsStatus,
  { label: string; meaning: string; fg: string; bg: string; border: string }
> = {
  available: {
    label: "Available",
    meaning: "In Onam Security today, for every customer.",
    fg: "#047857",
    bg: "#ECFDF5",
    border: "#A7F3D0",
  },
  early: {
    label: "Early access",
    meaning:
      "Running on the Onam platform and enabled per organisation by invitation. Agents answer and propose; nothing changes your cloud.",
    fg: "#1D4ED8",
    bg: "#EFF4FF",
    border: "#C7D7FE",
  },
  development: {
    label: "In development",
    meaning: "Built or specified; its data feed or enablement is not in place yet.",
    fg: "#B45309",
    bg: "#FFFBEB",
    border: "#FDE68A",
  },
  roadmap: {
    label: "On the roadmap",
    meaning: "Designed, not offered. No date is promised.",
    fg: "#475569",
    bg: "#F1F5F9",
    border: "#CBD5E1",
  },
};

export const OPS_PRODUCT = "Onam AI";

export type OpsAgent = {
  id: string;
  slug: string;
  name: string;
  level: "L1" | "L2" | "L3";
  levelName: string;
  authority: string;
  color: string;
  status: OpsStatus;
  statusNote: string;
  question: string;
  purpose: string;
  does: string[];
  skills: string[];
  tools: string[];
  never: string[];
  limits: string;
};

/** Level semantics — docs/03 §4. */
export const OPS_LEVELS: {
  level: string;
  name: string;
  reads: string;
  writes: string;
  approval: string;
}[] = [
  {
    level: "L1",
    name: "Investigator",
    reads: "Any Onam Security data it is granted",
    writes: "Its own investigation notes",
    approval: "None — it cannot change anything",
  },
  {
    level: "L2",
    name: "Proposer",
    reads: "Any Onam Security data it is granted",
    writes: "Change proposals only",
    approval: "Every proposal needs a human decision before anything is applied",
  },
  {
    level: "L3",
    name: "Actor",
    reads: "Any Onam Security data it is granted",
    writes: "The customer cloud, scoped to one approved change",
    approval: "Mandatory, per action. Starts only from an approval record",
  },
  {
    level: "L4",
    name: "Orchestrator",
    reads: "No security data at all",
    writes: "Nothing",
    approval: "Routes work; never answers or acts itself",
  },
];

export const OPS_AGENTS: OpsAgent[] = [
  {
    id: "security_agent",
    slug: "security-agent",
    name: "Security Agent",
    level: "L1",
    levelName: "Investigator",
    authority: "Read and recommend",
    color: "#1D4ED8",
    status: "early",
    statusNote: "Reads findings today; exposure and attack-path context are being connected.",
    question: "What is exposed, how can it be reached, and how bad is it?",
    purpose:
      "Determines what is exposed, how it can be reached, how bad that is and what should be done — always over Onam Security findings and inventory.",
    does: [
      "Queries and triages findings across the Onam Security engines",
      "Explains exposure, identity and network risk for a set of assets",
      "Ranks risk and suggests a fix, which it hands to the Automation Planner",
      "Explains an attack path to a crown-jewel asset in plain language",
    ],
    skills: [
      "query_findings",
      "find_public_exposure",
      "analyze_attack_path",
      "analyze_security_group",
      "analyze_iam_permission",
      "analyze_vulnerabilities",
      "assess_posture",
      "calculate_risk",
      "recommend_remediation",
    ],
    tools: [
      "cei.query",
      "cei.graph_traverse",
      "engine.risk",
      "engine.policy",
      "cloud.findings.read",
      "cloud.config.read",
      "cloud.identity.read",
      "cloud.audit.read",
    ],
    never: ["Apply a fix", "Probe your network itself", "Report a finding it cannot cite"],
    limits:
      "Exposure is as the engines computed it at the last scan; a rule changed since then is not reflected.",
  },
  {
    id: "compliance_agent",
    slug: "compliance-agent",
    name: "Compliance Agent",
    level: "L1",
    levelName: "Investigator",
    authority: "Read and recommend",
    color: "#4338CA",
    status: "development",
    statusNote: "Waits on the compliance-results feed.",
    question: "Which controls hold, which do not, and where is the evidence?",
    purpose:
      "States which controls hold and which do not, and produces evidence an auditor can follow — dated, retained and re-derivable.",
    does: [
      "Assesses posture against a framework and maps controls to policies",
      "Validates one control across your cloud accounts",
      "Collects dated evidence and assembles an audit package",
    ],
    skills: [
      "assess_compliance_posture",
      "map_control_to_policy",
      "collect_evidence",
      "validate_control",
      "prepare_audit_package",
    ],
    tools: [
      "cei.query",
      "engine.compliance",
      "engine.policy",
      "evidence.store",
      "cloud.config.read",
      "cloud.audit.read",
    ],
    never: [
      "Mark a control as passing without evidence",
      "Report a framework it does not cover as compliant",
    ],
    limits:
      "Control status is as the compliance engine evaluated it at its last run; a framework not in the rule library is reported as not covered.",
  },
  {
    id: "data_agent",
    slug: "data-agent",
    name: "Data Agent",
    level: "L1",
    levelName: "Investigator",
    authority: "Read and recommend",
    color: "#7C3AED",
    status: "development",
    statusNote: "Waits on the exposure and relationship feeds.",
    question: "What data is where, how sensitive is it, and who can reach it?",
    purpose:
      "Says what data exists where, how sensitive it is, who can reach it and where it flows — classifications, counts and locations, never the values.",
    does: [
      "Finds sensitive data stores and their classification",
      "Analyses who and what can reach a data store",
      "Traces where regulated data flows",
    ],
    skills: [
      "discover_sensitive_data",
      "classify_data",
      "analyze_data_exposure",
      "trace_data_flow",
      "assess_data_risk",
    ],
    tools: [
      "cei.query",
      "cei.graph_traverse",
      "engine.datasec",
      "engine.risk",
      "cloud.identity.read",
    ],
    never: ["Read the content of your data", "Report an unscanned store as clean"],
    limits: "Sees classifications and counts from the data security scans only, never content.",
  },
  {
    id: "automation_planner",
    slug: "automation-agent",
    name: "Automation Agent — planner",
    level: "L2",
    levelName: "Proposer",
    authority: "Propose",
    color: "#BE185D",
    status: "development",
    statusNote: "Proposal flow is built; blast-radius inputs are being connected.",
    question: "How exactly should this be changed, and how do we undo it?",
    purpose:
      "Turns an accepted recommendation into a precise, reversible change proposal: the exact change, its rollback, its blast radius and a dry run — writing nothing outside the proposal.",
    does: [
      "Builds the exact change artifact and its rollback artifact",
      "Assesses blast radius from recorded dependencies and recent activity",
      "Simulates the change with no side effect",
      "Raises the proposal to the approval queue",
    ],
    skills: [
      "generate_remediation_plan",
      "build_change_artifact",
      "build_rollback_artifact",
      "assess_blast_radius",
      "simulate_change",
    ],
    tools: [
      "cei.query",
      "cei.graph_traverse",
      "engine.policy",
      "cloud.config.read",
      "cloud.audit.read",
      "cloud.change.plan",
    ],
    never: ["Apply a change", "Approve anything — agents cannot hold approval authority"],
    limits:
      "Blast radius comes from recorded dependencies and recent activity and may miss traffic the platform does not observe.",
  },
  {
    id: "automation_actor",
    slug: "automation-agent",
    name: "Automation Agent — actor",
    level: "L3",
    levelName: "Actor",
    authority: "Execute an approved change",
    color: "#BE185D",
    status: "roadmap",
    statusNote: "Built and tested in the platform; not enabled for any customer.",
    question: "Apply exactly what was approved, check it worked, undo it if not.",
    purpose:
      "Executes an approved change against an unchanged target inside an isolated sandbox, validates the result, rolls back on failure and produces the evidence package.",
    does: [
      "Re-reads the target and aborts if it changed since approval",
      "Applies the approved artifact — nothing wider — with short-lived, scoped credentials",
      "Validates the result and rolls back automatically on failure",
      "Stores the before state, the commands and the after state as evidence",
    ],
    skills: ["execute_change", "validate_change", "rollback_change", "produce_execution_evidence"],
    tools: [
      "cloud.*.write (scoped, one hour)",
      "repo.pull_request",
      "cloud.change.plan",
      "evidence.store",
    ],
    never: [
      "Start from chat — only from an approval record",
      "Widen a change beyond the approved artifact",
      "Continue past a failed validation",
    ],
    limits:
      "Requires you to create a write role in your own cloud account and to raise your autonomy ceiling past “propose”.",
  },
];

/** The four specialist roles (Automation counted once, in two modes). */
export const OPS_AGENT_ROLES = ["Security", "Compliance", "Data", "Automation"] as const;

export type OpsFeature = { name: string; status: OpsStatus; detail: string };

export const OPS_FEATURES: OpsFeature[] = [
  {
    name: "AI Assistant in Onam Security",
    status: "available",
    detail:
      "Ask questions about your posture in plain language; specialists query your findings and cite them. Read-only.",
  },
  {
    name: "Workspace",
    status: "early",
    detail:
      "Ask Onam AI in plain language, each reply attributed to the agent that produced it, with a context panel for evidence, tasks and suggested fixes.",
  },
  {
    name: "Orchestrator and visible plans",
    status: "early",
    detail:
      "A multi-step question becomes a plan you can see — which agent, which skill, in which order — before and while it runs.",
  },
  {
    name: "Security Agent",
    status: "early",
    detail: "Findings, exposure and attack paths over the Onam Security inventory, on AWS first.",
  },
  {
    name: "Sensitive values masked",
    status: "early",
    detail:
      "Answers name the resource and the finding; secrets, keys and sensitive data values are masked.",
  },
  {
    name: "Evidence on every claim",
    status: "early",
    detail: "Each number cites the skill, tool, query, rows and scan time that produced it.",
  },
  {
    name: "Approval centre",
    status: "early",
    detail:
      "One queue for every suggested change, diff first, with rollback and blast radius shown before the decision.",
  },
  {
    name: "Activity and audit trail",
    status: "early",
    detail:
      "Every turn, tool call, decision and approval recorded append-only, with a hash-chain check that nothing was edited.",
  },
  {
    name: "Reports",
    status: "early",
    detail: "A conversation or task exported with its evidence preserved.",
  },
  {
    name: "Kill switch and autonomy ceiling",
    status: "early",
    detail:
      "Stop all agent activity for your organisation; cap how far agents may go — read, analyse, recommend, simulate, propose.",
  },
  {
    name: "Compliance Agent and Data Agent",
    status: "development",
    detail: "Built; waiting on the compliance-results, exposure and relationship feeds.",
  },
  {
    name: "Change proposals with rollback",
    status: "development",
    detail:
      "Automation Planner proposals with exact change, rollback and dry run; blast-radius inputs are being connected.",
  },
  {
    name: "Pre-built workflows",
    status: "development",
    detail:
      "Multi-step procedures such as audit preparation and exposure remediation, with approval steps built in.",
  },
  {
    name: "Executing approved changes",
    status: "roadmap",
    detail:
      "The actor applies an approved change in an isolated sandbox, validates it and rolls back on failure. Built and tested; enabled for no customer.",
  },
  {
    name: "Azure, Google Cloud and Kubernetes actions",
    status: "roadmap",
    detail: "AWS first; the design keeps provider specifics inside tools so agents do not change.",
  },
  {
    name: "Event triggers and a workflow builder",
    status: "roadmap",
    detail:
      "Start investigations from events; compose workflows that cannot publish an execute step without an approval step.",
  },
  {
    name: "Customer-authored agents",
    status: "roadmap",
    detail: "Needs a sandbox and certification model that does not exist yet.",
  },
];

export type OpsUseCase = {
  title: string;
  ask: string;
  agents: string;
  outcome: string;
  approval: string;
  status: OpsStatus;
};

/** From docs/15, re-stated for customers; status reflects what a customer can run today. */
export const OPS_USE_CASES: OpsUseCase[] = [
  {
    title: "Find internet-exposed critical assets",
    ask: "Show me critical production assets reachable from the internet.",
    agents: "Security",
    outcome:
      "A table of assets with exposure type and severity, with evidence on every row.",
    approval: "None — read only",
    status: "early",
  },
  {
    title: "Triage a new critical finding",
    ask: "Is this finding real, and what does it actually reach?",
    agents: "Security",
    outcome:
      "The finding in context: the resource, what can reach it, the attack paths it sits on and a suggested fix.",
    approval: "None — read only",
    status: "early",
  },
  {
    title: "Identify excessive IAM permissions",
    ask: "Which identities have far more access than they use?",
    agents: "Security",
    outcome:
      "Identities ranked by unused privilege, each with the policy and finding that shows it.",
    approval: "None — read only",
    status: "early",
  },
  {
    title: "Review a newly connected cloud account",
    ask: "We just connected this account. What should I worry about first?",
    agents: "Security",
    outcome: "The highest-risk findings for the new account, ready to export as a report.",
    approval: "None — read only",
    status: "early",
  },
  {
    title: "Prepare compliance evidence for an audit",
    ask: "Prove control 8.2 held all quarter.",
    agents: "Compliance → Data → Security",
    outcome: "Control status with dated evidence assembled into an audit package.",
    approval: "None — read only",
    status: "development",
  },
  {
    title: "Find sensitive data exposed publicly",
    ask: "Which public buckets hold regulated data?",
    agents: "Data → Security",
    outcome: "Data stores by classification and exposure, without ever reading the data itself.",
    approval: "None — read only",
    status: "development",
  },
  {
    title: "Create a remediation plan",
    ask: "Plan the fix for SSH open to the internet on these instances.",
    agents: "Security → Automation planner",
    outcome:
      "An exact change, its rollback, its blast radius and a dry run, waiting in the approval queue.",
    approval: "A human decides",
    status: "development",
  },
  {
    title: "Execute an approved security remediation",
    ask: "Apply the approved change to the production security group.",
    agents: "Automation actor",
    outcome:
      "Applied in a sandbox, validated, rolled back automatically if validation fails, with the evidence package stored.",
    approval: "Required; two people for critical changes",
    status: "roadmap",
  },
];

/** docs/03 §8.3 — risk classes, assigned by policy, never by the agent. */
export const OPS_RISK_CLASSES: {
  cls: string;
  approval: string;
  examples: string;
  color: string;
}[] = [
  {
    cls: "Low",
    approval: "None",
    examples: "Any read or analysis; adding a tag; enabling a log",
    color: "#16A34A",
  },
  {
    cls: "Medium",
    approval: "One approver",
    examples: "Resizing a non-production instance; encrypting a new bucket",
    color: "#CA8A04",
  },
  {
    cls: "High",
    approval: "One approver plus a dry run",
    examples: "Narrowing a production security group; changing a production IAM policy",
    color: "#EA580C",
  },
  {
    cls: "Critical",
    approval: "Two distinct approvers, one an organisation admin; dry run; change window",
    examples: "Deleting a production database; changing an organisation-level policy",
    color: "#DC2626",
  },
];

/** docs/01 §3.1 — design commitments, stated as such. */
export const OPS_COMMITMENTS: string[] = [
  "No change to your cloud without a human approval recorded against a named person. There is no autonomy setting that removes it.",
  "No data derived from another customer, ever — not in a query, a cache, a prompt, a memory or a log line.",
  "No answer it cannot ground in a tool call. “Unable to verify” is a designed answer, not an error.",
  "No agent can widen its own permissions, call an unregistered tool or use a model that is not approved.",
  "No workflow continues past a failed validation step.",
];
