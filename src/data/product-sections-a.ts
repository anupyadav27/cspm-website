import type { ProductSections } from "./product-sections.types";
import {
  Activity, AlertTriangle, BarChart3, BookOpen, Box, Boxes, Bug, Calculator, CheckCircle2, CheckSquare,
  ClipboardCheck, ClipboardList, Clock, Cloud, Container, Crosshair, Database, Eye, FileCheck2, FileCode2,
  FileSearch, FileText, GitBranch, GitCompareArrows, GitFork, GitPullRequest, Globe, Handshake, KeyRound,
  Layers, LayoutDashboard, ListChecks, ListOrdered, Lock, LockOpen, Network, Package, Plug, RotateCcw, Route,
  ScanLine, ScanSearch, Search, Server, Share2, Shield, ShieldAlert, ShieldCheck, TrendingDown, TrendingUp,
  UserRound, Users, Wand2, Webhook, Workflow, Wrench, Gauge,
} from "@/components/site/icons";

/**
 * Structured "How it works" / "What you get" content for product pages, group A.
 * Every line is condensed from the same page's entry in platform-pages.ts: no new claims, no new numbers.
 */
export const sectionsA: Record<string, ProductSections> = {
  "code-security": {
    stepsHeading: "From a branch clone to graded findings",
    steps: [
      {
        title: "Point Onam at a branch",
        body: "Give Onam a repository's HTTPS address and branch. Each scan runs as an isolated job on a shallow clone, deleted when the scan ends.",
        proof: "GitHub · GitLab · Bitbucket",
        icon: GitBranch,
      },
      {
        title: "Analyse code with Onam rules",
        body: "Onam's own engine runs data-flow, code-structure and reviewed pattern rules. No third-party rule packs are used.",
        proof: "835 SAST security rules",
        icon: ScanSearch,
      },
      {
        title: "Grade each result by proof",
        body: "Data-flow and code-structure matches become Security issues. Pattern matches become Hotspots to review, capped at medium, so they never outrank a confirmed flaw.",
        proof: "CWE and OWASP on every finding",
        icon: ListChecks,
      },
      {
        title: "Score dependencies beyond CVSS",
        body: "Manifests and lockfiles are matched to OSV and NVD advisories, enriched with EPSS and CISA KEV, scored 0–10 and written out as a CycloneDX 1.5 SBOM.",
        proof: "OSV, NVD, EPSS, CISA KEV",
        icon: Gauge,
      },
      {
        title: "Check IaC, secrets and apps",
        body: "The same scan checks IaC templates, Dockerfiles and every file for secrets. Given a URL, dynamic testing discovers endpoints and sends rate-limited test payloads.",
        proof: "479 DAST test payloads",
        icon: Crosshair,
      },
    ],
    outcomesHeading: "What your AppSec team gets from each scan",
    outcomes: [
      {
        title: "Confirmed flaws ahead of hotspots",
        body: "Data-flow and code-structure findings come first. Pattern matches sit in a separate review list, capped at medium.",
        icon: ShieldCheck,
        chips: ["CWE", "OWASP", "File and line"],
      },
      {
        title: "Coverage across 13 languages",
        body: "Python, JavaScript, TypeScript, Java, C#, Go, C, C++, Ruby, PHP, Kotlin, Swift and Scala. Depth varies by language.",
        icon: FileCode2,
      },
      {
        title: "Dependency risk beyond CVSS",
        body: "A 0–10 score built from CVSS, EPSS, CISA KEV and whether a fixed version exists.",
        icon: TrendingUp,
        chips: ["CVSS", "EPSS", "CISA KEV"],
      },
      {
        title: "SBOMs you can govern",
        body: "A CycloneDX 1.5 SBOM per repository, import of CycloneDX or SPDX JSON, license policy checks, an NTIA minimum-elements check and SBOM diffs.",
        icon: Package,
        chips: ["CycloneDX 1.5", "SPDX import", "NTIA", "VEX"],
      },
      {
        title: "Running apps tested, not only code",
        body: "Endpoint discovery, injection and SSRF payloads, and header and cookie checks against a running app you are authorised to test.",
        icon: Globe,
        chips: ["JSON", "HTML", "SARIF"],
      },
      {
        title: "A fix path for every finding",
        body: "Rule guidance and a copyable AI fix prompt per finding. AI Code Fix, run on request, puts corrected files on a branch.",
        icon: Wand2,
      },
    ],
  },

  cspm: {
    stepsHeading: "From a read-only connection to a verified fix",
    steps: [
      {
        title: "Connect through read-only roles",
        body: "Onam discovers each connected account's resources across 672 services, with region and account recorded. Posture scanning uses read-only IAM roles, service principals or service accounts.",
        proof: "Resources across 672 services",
        icon: Plug,
      },
      {
        title: "Evaluate every rule and resource",
        body: "One cloud-agnostic engine records PASS, FAIL or ERROR per rule and resource. Definitions switched off or without a check are counted, so not all run today.",
        proof: "11,856 posture rule definitions",
        icon: ListChecks,
      },
      {
        title: "Attach the why and fix",
        body: "Every rule carries severity, rationale, remediation guidance, compliance mappings and MITRE ATT&CK techniques. Each finding adds an AI fix prompt for your cloud's tooling.",
        icon: FileText,
      },
      {
        title: "Raise severity with context",
        body: "Severity rises when a resource is exposed on an attack path, is one of your most valuable assets, or an active threat touches it.",
        proof: "A fix-by date per finding",
        icon: TrendingUp,
      },
      {
        title: "Route, fix and re-check",
        body: "Findings open Jira or ServiceNow tickets and alert through Slack, PagerDuty, email or webhook. The next scan re-checks the resource and confirms the fix.",
        proof: "Jira · ServiceNow · Slack",
        icon: RotateCcw,
      },
    ],
    outcomesHeading: "What lands in your posture queue",
    outcomes: [
      {
        title: "Misconfigurations ranked by severity",
        body: "Each finding is linked to its resource, account and region, with severity raised by context and a fix-by date.",
        icon: AlertTriangle,
        chips: ["Critical", "High", "Medium", "Low"],
      },
      {
        title: "A fix drafted for your tooling",
        body: "Remediation guidance on every rule, and an AI fix prompt that drafts the CLI command, Terraform change or console steps.",
        icon: Wand2,
        chips: ["CLI", "Terraform", "Console steps"],
      },
      {
        title: "Compliance impact per finding",
        body: "See which of the 144 frameworks each finding affects.",
        icon: ClipboardCheck,
      },
      {
        title: "Attacker context on every rule",
        body: "MITRE ATT&CK tactics and techniques are attached to each rule, so they arrive with every finding.",
        icon: Crosshair,
        chips: ["MITRE ATT&CK"],
      },
      {
        title: "Findings in the tools you use",
        body: "Open tickets and send alerts straight from a finding.",
        icon: Webhook,
        chips: ["Jira", "ServiceNow", "Slack", "PagerDuty", "Email", "Webhook"],
      },
      {
        title: "Accepted risk, recorded and time-boxed",
        body: "Suppress a rule with a reason and an optional expiry. Onam records who created each suppression and when.",
        icon: Clock,
      },
    ],
  },

  ciem: {
    stepsHeading: "From cloud inventory to an access review",
    steps: [
      {
        title: "Load identities from inventory",
        body: "Identities and policies come from the inventory the posture scan already builds: AWS, Azure, Google Cloud, Kubernetes, OCI, Alibaba Cloud and IBM Cloud.",
        proof: "7 clouds analysed",
        icon: ScanSearch,
      },
      {
        title: "Resolve effective access",
        body: "On AWS, group policies, conditions, explicit denies and SCP denies are resolved per identity; Azure, GCP and Kubernetes grants join the same table.",
        icon: KeyRound,
      },
      {
        title: "Grade and graph each grant",
        body: "Each grant gets an access level from admin to tagging, flagged when admin-equivalent, cross-account or SCP-blocked. Relationships go into the security graph Attack Path reads.",
        icon: Network,
      },
      {
        title: "Trace paths to admin",
        body: "Detectors trace PassRole, assume-role chains and boundary removal on AWS, impersonation chains of up to 4 hops on Google Cloud, plus Azure, Kubernetes, OCI and IBM Cloud vectors.",
        proof: "Assume-role chains traced: 12 hops",
        icon: Route,
      },
      {
        title: "Measure use, open reviews",
        body: "On AWS and Google Cloud, audit logs show which granted actions go unused. AWS identities get a 0–100 risk score; high-tier ones open an access review.",
        proof: "4 states per access review",
        icon: ClipboardCheck,
      },
    ],
    outcomesHeading: "What you can answer about every identity",
    outcomes: [
      {
        title: "Know what each identity can do",
        body: "Effective permissions per identity, after group inheritance, conditions, explicit denies and SCP denies are applied.",
        icon: KeyRound,
      },
      {
        title: "Shadow admins and escalation paths surfaced",
        body: "Identities that can attach, rewrite or create their way to admin, and the PassRole, assume-role and impersonation chains behind them.",
        icon: ShieldAlert,
        chips: ["AWS", "Azure", "Google Cloud", "Kubernetes"],
      },
      {
        title: "Risky trusts and machine identities mapped",
        body: "External accounts, wildcard principals, missing ExternalId and federation, plus non-human identities classified by who can assume them.",
        icon: Handshake,
        chips: ["OIDC", "SAML", "ExternalId"],
      },
      {
        title: "Unused access, found from activity",
        body: "Granted actions never seen in AWS or Google Cloud audit logs, with high-risk ones called out, and stale AWS roles flagged.",
        icon: TrendingDown,
      },
      {
        title: "A risk score with its reasons",
        body: "A 0–100 score per AWS identity from escalation paths, recent escalation activity, blast radius and permission gap, with the breakdown shown.",
        icon: Gauge,
      },
      {
        title: "Access reviews with an audit trail",
        body: "Reviews on AWS, Azure and Google Cloud, with every change recorded and decisions that expire.",
        icon: ClipboardList,
        chips: ["Pending", "Needs remediation", "Reviewed", "Deferred"],
      },
    ],
  },

  iam: {
    stepsHeading: "From posture scan to identity hygiene scores",
    steps: [
      {
        title: "Collect identity findings",
        body: "After each posture scan, the identity engine loads findings from every identity-scoped rule, such as MFA, root, SSO and RBAC, and adds its own detections.",
        icon: ScanSearch,
      },
      {
        title: "Sort into six modules",
        body: "Each finding lands in one module: least privilege, policy analysis, MFA, role management, password policy or access control.",
        icon: Layers,
      },
      {
        title: "Add per-cloud checks",
        body: "Provider analysers add checks such as key and token rotation on OCI, RAM trust and MFA conditions on Alibaba Cloud, and trusted profiles on IBM Cloud.",
        icon: Cloud,
      },
      {
        title: "Roll up a posture score",
        body: "The IAM Security screen shows a posture score, findings by severity, an identity risk trend and an Effective Access panel for any single principal.",
        icon: Gauge,
      },
      {
        title: "Hand off to CIEM",
        body: "The same identities and findings feed CIEM, which works out effective permissions, escalation paths, unused access and access reviews.",
        icon: Share2,
      },
    ],
    outcomesHeading: "Identity hygiene your team can act on",
    outcomes: [
      {
        title: "MFA and root gaps found",
        body: "Users and privileged identities without MFA, plus root account activity and root access keys.",
        icon: Lock,
      },
      {
        title: "Stale keys and tokens flagged",
        body: "Access keys, tokens and other credentials past their rotation thresholds.",
        icon: KeyRound,
      },
      {
        title: "Overly broad policies called out",
        body: "Wildcard actions and resources, admin and inline policies, plus wildcard trust principals and cross-account roles without ExternalId.",
        icon: FileSearch,
      },
      {
        title: "Password policy checked against guidance",
        body: "Minimum length and expiry, checked against CIS and NIST guidance.",
        icon: CheckSquare,
        chips: ["CIS", "NIST"],
      },
      {
        title: "A pass rate per module",
        body: "Six IAM modules, each with its own summary and pass rate.",
        icon: BarChart3,
        chips: ["Least privilege", "Policy analysis", "MFA", "Role management", "Password policy", "Access control"],
      },
      {
        title: "Any principal, looked up",
        body: "Search any principal in Effective Access and see what it can do after explicit denies and SCP denies.",
        icon: Search,
      },
    ],
  },

  "attack-path": {
    stepsHeading: "From scan evidence to the choke point",
    steps: [
      {
        title: "Build the graph from evidence",
        body: "Resources load into a graph database. Edges come from IAM policies, network exposure and security-group rules, data access and movement seen by threat detection.",
        icon: Network,
      },
      {
        title: "Walk only confirmed edges",
        body: "Each edge is marked confirmed, blocked or gap. Only confirmed edges are walked, so a route a security group or policy blocks never becomes a path.",
        proof: "Confirmed · Blocked · Gap",
        icon: CheckCircle2,
      },
      {
        title: "Search from entry points",
        body: "Breadth-first search runs from the internet, identities, CI/CD, third parties and other clouds towards critical assets such as data stores and encryption keys.",
        proof: "Likelihood decays every hop",
        icon: Route,
      },
      {
        title: "Score likelihood times impact",
        body: "Each path gets a severity. Controls such as a WAF or MFA lower the score; a hop with a high-EPSS vulnerability raises it.",
        icon: Gauge,
      },
      {
        title: "Rank choke points, re-check",
        body: "Onam shows how many paths each shared resource would block if fixed. The graph is rebuilt every scan, so a fixed route is gone at the next one.",
        icon: RotateCcw,
      },
    ],
    outcomesHeading: "What each attack path gives your team",
    outcomes: [
      {
        title: "Routes to your critical assets",
        body: "Interactive graphs of each route from an entry point to a critical asset, built only from evidence-checked edges.",
        icon: GitFork,
        chips: ["Entry points", "Critical assets", "Confirmed edges"],
      },
      {
        title: "Severity that reflects your controls",
        body: "Path severity from likelihood × impact, adjusted for controls such as a WAF or MFA and for exploitability.",
        icon: Gauge,
      },
      {
        title: "The fix that blocks most paths",
        body: "Choke points ranked by how many paths a single fix would block.",
        icon: Crosshair,
        chips: ["Choke points"],
      },
      {
        title: "Every hop explained and fixable",
        body: "Each hop carries its MITRE ATT&CK tactic and technique and a remediation step.",
        icon: ListOrdered,
        chips: ["Initial Access", "Privilege Escalation", "Lateral Movement", "Credential Access", "Exfiltration"],
      },
      {
        title: "Fixes verified by the next scan",
        body: "The graph is rebuilt every scan, so a fixed route disappears instead of being closed by hand.",
        icon: RotateCcw,
      },
      {
        title: "Path context in loss estimates",
        body: "Findings on attack paths get a higher loss estimate in Risk Quantification.",
        icon: Calculator,
      },
    ],
  },

  cdr: {
    stepsHeading: "From audit logs to detections with context",
    steps: [
      {
        title: "Read your existing audit logs",
        body: "Onam reads the audit logs your clouds already produce, through the same cloud connection as the rest of the platform.",
        proof: "CloudTrail, Activity Log, Cloud Audit Logs",
        icon: FileSearch,
      },
      {
        title: "Match events and patterns",
        body: "Level 1 rules flag single suspicious actions, such as disabling logging. Level 2 scenarios match patterns across several events within a time window.",
        icon: ListChecks,
      },
      {
        title: "Baseline each identity",
        body: "Level 3 learns what is normal for each identity and flags a statistical departure, even when no rule names the action.",
        icon: UserRound,
      },
      {
        title: "Spot attack sequences",
        body: "A sequence detector looks for data exfiltration, identity pivot, secrets staging and compute hijack, in each supported cloud's own vocabulary.",
        icon: Workflow,
      },
      {
        title: "Map, alert and add context",
        body: "Detections are mapped to MITRE ATT&CK, written to platform alerts and joined to posture and identity context. A confirmed exfiltration path feeds back into posture.",
        proof: "MITRE ATT&CK mapped",
        icon: Share2,
      },
    ],
    outcomesHeading: "What your responders get from each detection",
    outcomes: [
      {
        title: "Single events, patterns and drift",
        body: "Single-event rules, multi-event correlation within a time window, and per-identity behaviour baselines with anomaly detection.",
        icon: Layers,
        chips: ["Level 1", "Level 2", "Level 3"],
      },
      {
        title: "Attack sequences named",
        body: "Sequence detection for data exfiltration, identity pivot, secrets staging and compute hijack.",
        icon: Workflow,
      },
      {
        title: "Detections that arrive with context",
        body: "Every detection carries posture and identity context and its MITRE ATT&CK mapping, linked to the identity that acted.",
        icon: Network,
        chips: ["MITRE ATT&CK"],
      },
      {
        title: "Audit logs across your clouds",
        body: "Cloud and Kubernetes audit logs, read through the cloud connection you already set up.",
        icon: Cloud,
        chips: ["AWS", "Azure", "Google Cloud", "OCI", "Alibaba Cloud", "IBM Cloud"],
      },
      {
        title: "Detections where you already look",
        body: "Detections land in the same alerts view as the rest of Onam Security.",
        icon: LayoutDashboard,
      },
    ],
  },

  "threat-detection": {
    stepsHeading: "From raw cloud events to ranked incidents",
    steps: [
      {
        title: "Ingest logs and findings",
        body: "Onam reads audit logs from every connected cloud, flow logs on AWS, Azure and Google Cloud, and GuardDuty findings when exported to S3.",
        proof: "All sources read-only",
        icon: FileSearch,
      },
      {
        title: "Map to MITRE ATT&CK",
        body: "Every finding gets a MITRE ATT&CK for Cloud tactic and technique, so responders see the technique, likely next steps and a playbook.",
        icon: Crosshair,
      },
      {
        title: "Group into attack chains",
        body: "Related detections are grouped into chains, from initial access through discovery and privilege escalation to impact, shown as a connected graph.",
        icon: GitBranch,
      },
      {
        title: "Rank by reachability",
        body: "Alerts are ranked by exploitability and whether the resources involved can be reached, using the same reachability model as Attack Path Analysis.",
        icon: TrendingUp,
      },
      {
        title: "Collapse noise into incidents",
        body: "Correlation folds redundant alerts into single incidents, so a long brute-force burst arrives as one incident with all its evidence attached.",
        icon: Layers,
      },
    ],
    outcomesHeading: "What your responders get with every alert",
    outcomes: [
      {
        title: "Every alert tied to a technique",
        body: "Each threat finding is mapped to a MITRE ATT&CK tactic and technique, with response guidance per technique.",
        icon: Crosshair,
        chips: ["MITRE ATT&CK"],
      },
      {
        title: "Attack chains you can follow",
        body: "Related detections drawn as connected graphs, with an ordered event timeline for each multi-step detection.",
        icon: GitFork,
      },
      {
        title: "Reachable threats ranked first",
        body: "Severity ranked by CVSS, exploitability and reachability, plus blast radius analysis.",
        icon: Gauge,
        chips: ["CVSS", "Exploitability", "Reachability"],
      },
      {
        title: "Fewer alerts, fuller incidents",
        body: "Correlation collapses redundant alerts into incidents that keep all their evidence attached.",
        icon: Layers,
      },
      {
        title: "Threats joined to attack paths",
        body: "Full integration with the Attack Path engine, so an alert shows which paths it accelerates.",
        icon: Route,
      },
    ],
  },

  "network-security": {
    stepsHeading: "From network objects to real internet exposure",
    steps: [
      {
        title: "Pull every network object",
        body: "Onam reads VPCs, subnets, route tables, NACLs, security groups, load balancers, WAFs, transit gateways and peerings across your clouds.",
        proof: "Read-only IAM roles",
        icon: Cloud,
      },
      {
        title: "Model reachability as a graph",
        body: "From an internet source, the engine works out which resources can receive traffic, on which ports and over how many hops.",
        proof: "The full 7-layer network path",
        icon: Network,
      },
      {
        title: "Score effective exposure",
        body: "Each resource gets an exposure score that reflects the whole path, not only the closest security group.",
        icon: Gauge,
      },
      {
        title: "List coverage gaps",
        body: "Subnets without flow logs, load balancers without WAFs and missing TLS enforcement are listed separately.",
        icon: ListChecks,
      },
      {
        title: "Refresh on every scan",
        body: "A new peering or a shifted route table shows up at the next scan.",
        icon: RotateCcw,
      },
    ],
    outcomesHeading: "What your network review gets every scan",
    outcomes: [
      {
        title: "Real exposure per resource",
        body: "An effective exposure score for every resource, reflecting the routes, NACLs, security groups, load balancers and WAFs in front of it.",
        icon: Gauge,
      },
      {
        title: "Risky open ports found",
        body: "Security groups with overly permissive inbound access on SSH, RDP and database ports.",
        icon: LockOpen,
        chips: ["SSH", "RDP", "DB ports"],
      },
      {
        title: "Private and public subnets classified",
        body: "Each subnet classified as truly private or publicly accessible, with NACL analysis alongside.",
        icon: Layers,
      },
      {
        title: "Load balancers and WAFs checked",
        body: "TLS version, HTTP to HTTPS redirect and internet-facing exposure for load balancers, plus a WAF coverage map.",
        icon: Shield,
        chips: ["TLS", "WAF"],
      },
      {
        title: "Flow log blind spots listed",
        body: "Flow log coverage gaps, so you know where traffic is not being recorded.",
        icon: Eye,
      },
      {
        title: "Peering and transit exposure traced",
        body: "VPC peering and transit gateway exposure analysis, so a hop through a shared network shows up.",
        icon: GitCompareArrows,
      },
    ],
  },

  "data-security": {
    stepsHeading: "From data store inventory to a governance score",
    steps: [
      {
        title: "Discover every data store",
        body: "The posture scan inventories object storage, managed databases, warehouses, streams and Kubernetes secrets through read-only cloud roles, with encryption, policies, ACLs and relationships.",
        icon: Database,
      },
      {
        title: "Classify what it holds",
        body: "Names, tags and schema become sensitivity labels. Where you deploy Onam's DSPM scanner or on-prem collector, sampled contents are classified too.",
        proof: "PII · PHI · PCI",
        icon: ScanSearch,
      },
      {
        title: "Explain public exposure",
        body: "A store counts as public only when a grant makes it so, checked against the public-access block. Write access from outside is ranked critical.",
        icon: Globe,
      },
      {
        title: "Show who reaches it",
        body: "Observed access from cloud audit events sits beside the policy view. Sensitive stores become critical assets when attack paths are scored.",
        proof: "30 days of observed access",
        icon: Users,
      },
      {
        title: "Trace lineage and score",
        body: "Replication, backup, ETL, streaming and export links are chained up to eight hops, cross-region and cross-account hops flagged. Each store gets a 0–100 governance score.",
        icon: GitBranch,
      },
    ],
    outcomesHeading: "What you know about every data store",
    outcomes: [
      {
        title: "A data catalog with sensitivity labels",
        body: "Every store with its type, region, account and labels, from metadata and, where the scanner or collector runs, sampled contents.",
        icon: Database,
        chips: ["PII", "PHI", "PCI", "Financial", "Confidential"],
      },
      {
        title: "Exposure traced to its grant",
        body: "See which grant made a store public, and which bucket policies let another account in, with write access ranked critical.",
        icon: Globe,
        chips: ["Policy verdict", "ACL", "Wildcard principal"],
      },
      {
        title: "Who touched each store",
        body: "Principals seen accessing each store in the last 30 days, with operations and time of last access.",
        icon: Users,
      },
      {
        title: "Encryption, residency and backups checked",
        body: "Unencrypted stores, sensitive data on provider-managed keys, regions outside your allowed list, and logging, versioning and backup per store.",
        icon: Lock,
      },
      {
        title: "Where your data flows",
        body: "Lineage chains of replication, backup, ETL, streaming and export hops, with cross-region and cross-account hops flagged.",
        icon: GitBranch,
      },
      {
        title: "One score per store",
        body: "A 0–100 governance score from encryption, public exposure and access logging, and sensitive stores set as attack-path targets.",
        icon: Gauge,
      },
    ],
  },

  "ai-spm": {
    stepsHeading: "From AI discovery to one findings queue",
    steps: [
      {
        title: "Find cloud AI resources",
        body: "Read-only APIs find SageMaker, Bedrock and model artifacts on AWS, Azure OpenAI and Azure Machine Learning, and Vertex AI endpoints, datasets and Workbench on Google Cloud.",
        proof: "AWS · Azure · Google Cloud",
        icon: Cloud,
      },
      {
        title: "Classify self-hosted AI",
        body: "In each connected Kubernetes cluster, read through a read-only ServiceAccount, a classifier finds model servers, notebooks and vector databases and checks for exposure without authentication.",
        proof: "Ollama · vLLM · Qdrant",
        icon: Boxes,
      },
      {
        title: "List AI libraries and servers",
        body: "AI libraries, model servers and MCP SDKs are picked out of the SBOMs Onam already builds for your code and images.",
        icon: Package,
      },
      {
        title: "Check configuration and guardrails",
        body: "AI-native rules check network isolation, execution-role scope, artifact encryption and inference and training logging, and whether a provider guardrail is attached.",
        proof: "Guardrail presence, not strength",
        icon: ShieldCheck,
      },
      {
        title: "Link identities, data and findings",
        body: "Each AI service is joined to the data stores it reads and the identity it runs as, and findings join the platform's findings queue.",
        proof: "Prompt-text detection off by default",
        icon: Share2,
      },
    ],
    outcomesHeading: "What AI security posture shows your team",
    outcomes: [
      {
        title: "One AI inventory, cloud and cluster",
        body: "Cloud AI services, self-hosted AI on Kubernetes and AI apps in connected SaaS in one inventory, plus an AI bill of materials.",
        icon: Boxes,
        chips: ["AWS", "Azure", "Google Cloud", "Kubernetes"],
      },
      {
        title: "Guardrail presence in one view",
        body: "Whether a provider guardrail is attached to your models, deployments and agents. This shows presence, not strength.",
        icon: ShieldCheck,
        chips: ["Bedrock Guardrails", "Azure content filters", "Google Model Armor"],
      },
      {
        title: "Exposed self-hosted AI found",
        body: "Model servers, notebooks and vector databases on Kubernetes that are exposed without authentication.",
        icon: LockOpen,
      },
      {
        title: "AI identity and data links",
        body: "The data stores each AI service reads, and AI execution identities marked as AI agents, with admin and wide-write findings.",
        icon: Users,
      },
      {
        title: "Coverage you can check",
        body: "A Coverage tab shows, per AI product, what Onam can and cannot see.",
        icon: Eye,
      },
      {
        title: "Findings mapped to AI frameworks",
        body: "Mapped to OWASP Top 10 for LLM Applications 2025 and three more. A mapping is evidence for some controls, not a verdict.",
        icon: ClipboardCheck,
        chips: ["NIST AI RMF", "ISO/IEC 42001", "EU AI Act"],
      },
    ],
  },

  "ai-spm-inventory": {
    stepsHeading: "From accounts and code to one AI inventory",
    steps: [
      {
        title: "Read managed AI services",
        body: "The same read-only cloud roles that feed CSPM record SageMaker and Bedrock, Azure OpenAI and Azure Machine Learning, and Vertex AI resources.",
        proof: "AWS · Azure · Google Cloud",
        icon: Cloud,
      },
      {
        title: "Filter your SBOMs for AI",
        body: "The SBOMs Onam builds for your repositories and images are filtered to AI libraries, model servers and MCP SDKs.",
        proof: "Inventory › Libraries (AI-BOM)",
        icon: Package,
      },
      {
        title: "Add cluster and SaaS AI",
        body: "Self-hosted AI on connected Kubernetes clusters and AI apps in your connected SaaS join the same inventory.",
        icon: Boxes,
      },
      {
        title: "Group AI into applications",
        body: "The onam-ai-app tag and the links Onam finds between AI assets and code group your AI into applications. Onam never adds the tag.",
        icon: Layers,
      },
      {
        title: "Show what is covered",
        body: "The Coverage tab lists each AI product with its connection state, how Onam reads it, and its checks active or waiting.",
        proof: "175 products in catalogue 1.0",
        icon: Eye,
      },
    ],
    outcomesHeading: "What the AI inventory gives your team",
    outcomes: [
      {
        title: "Managed AI in one list",
        body: "Every SageMaker, Bedrock, Azure OpenAI, Azure Machine Learning and Vertex AI resource Onam can read, with its settings.",
        icon: Boxes,
        chips: ["AWS", "Azure", "Google Cloud"],
      },
      {
        title: "The AI software you ship",
        body: "An AI bill of materials from your SBOMs: AI libraries, model servers and MCP SDKs, with the image they came from.",
        icon: Package,
      },
      {
        title: "AI grouped by application",
        body: "Applications built from the onam-ai-app tag and from links between AI assets and code.",
        icon: Layers,
      },
      {
        title: "Honest coverage per product",
        body: "Per AI product, the connection state and which checks are active. Connected with no active checks is not coverage.",
        icon: Eye,
      },
    ],
  },

  "ai-spm-ai-in-saas": {
    stepsHeading: "From connected SaaS to the AI inventory",
    steps: [
      {
        title: "Connect your SaaS once",
        body: "Your SaaS platforms connect through the same read-only connectors SaaS security uses, with no agent or browser extension.",
        icon: Plug,
      },
      {
        title: "Find the AI apps",
        body: "Onam lists the AI apps it finds in those platforms, such as Microsoft Copilot or Claude in Google Workspace.",
        proof: "Inventory › AI in SaaS",
        icon: Search,
      },
      {
        title: "Join the AI inventory",
        body: "The apps sit in the same AI inventory as managed AI services, self-hosted AI and the AI bill of materials.",
        icon: Boxes,
      },
      {
        title: "Keep platform settings separate",
        body: "Admin roles and sharing stay in SaaS security. The AI apps found there belong to AI security posture.",
        icon: Layers,
      },
    ],
    outcomesHeading: "What AI in SaaS shows your team",
    outcomes: [
      {
        title: "AI apps nobody listed",
        body: "The AI apps found in the SaaS platforms you connected, such as Microsoft Copilot or Claude in Google Workspace.",
        icon: Search,
        chips: ["Microsoft Copilot", "Claude", "Google Workspace"],
      },
      {
        title: "One inventory for all AI",
        body: "SaaS AI next to your managed AI, self-hosted AI and AI bill of materials.",
        icon: Boxes,
      },
      {
        title: "No prompts read by default",
        body: "Prompt or answer text is read only if an admin turns on prompt-text detection, which is off by default.",
        icon: Lock,
      },
      {
        title: "Exports like the rest",
        body: "The inventory exports to PDF and Excel or CSV, like the rest of the console.",
        icon: FileText,
      },
    ],
  },

  "ai-spm-self-hosted": {
    stepsHeading: "From a connected cluster to exposed AI",
    steps: [
      {
        title: "Connect the cluster read-only",
        body: "A read-only ServiceAccount reads the cluster. Onam deploys no agent or scanner and changes no object.",
        proof: "API server reachable from Onam",
        icon: KeyRound,
      },
      {
        title: "Classify the workloads",
        body: "A classifier reads images and custom resources and recognises model servers, notebooks, vector databases and serving platforms.",
        proof: "Ollama · vLLM · Qdrant · KServe",
        icon: ScanSearch,
      },
      {
        title: "Check for open access",
        body: "Each AI workload is joined with the network exposure from the same scan to find servers that answer without authentication.",
        icon: Globe,
      },
      {
        title: "Raise findings in your queue",
        body: "Exposed self-hosted AI raises a finding next to the rest. Configuration rules for self-hosted AI are written, not yet switched on.",
        proof: "Inventory and exposure only today",
        icon: ShieldAlert,
      },
    ],
    outcomesHeading: "What your team sees for self-hosted AI",
    outcomes: [
      {
        title: "Self-hosted AI in the inventory",
        body: "Model servers, notebooks, vector databases and serving platforms on every connected cluster.",
        icon: Server,
        chips: ["Ollama", "vLLM", "Jupyter", "Qdrant", "KServe"],
      },
      {
        title: "Open AI servers found",
        body: "Self-hosted AI exposed without authentication, as findings in your usual queue.",
        icon: LockOpen,
      },
      {
        title: "Nothing installed in the cluster",
        body: "A read-only ServiceAccount, no agent or scanner, no object changed.",
        icon: ShieldCheck,
      },
      {
        title: "One inventory for all AI",
        body: "Cluster AI next to your managed AI, AI in SaaS and AI bill of materials.",
        icon: Boxes,
      },
    ],
  },

  "ai-spm-agents": {
    stepsHeading: "From an AI service to its reach",
    steps: [
      {
        title: "Mark AI agents in CIEM",
        body: "Bedrock and SageMaker roles and other AI execution identities are marked as AI agents and reviewed as a group.",
        icon: Users,
      },
      {
        title: "Flag over-powered agents",
        body: "An agent with admin access, wide write access, or more tools than the limit in Settings gets a finding.",
        icon: ShieldAlert,
      },
      {
        title: "Link AI to its data",
        body: "Each AI service is linked to the data stores it reads, from its configuration. DSPM labels show which stores are sensitive.",
        proof: "Data is never read",
        icon: Database,
      },
      {
        title: "Check guardrail presence",
        body: "Onam checks that a provider guardrail is attached to your models, deployments and agents. It checks presence, not strength.",
        proof: "No prompts sent to models",
        icon: ShieldCheck,
      },
      {
        title: "Watch AI activity",
        body: "The Threats tab shows suspicious activity on AI assets, found in your AI activity logs by Onam threat detection.",
        icon: Activity,
      },
    ],
    outcomesHeading: "What your team sees around each AI",
    outcomes: [
      {
        title: "AI agents as identities",
        body: "AI execution identities marked as AI agents, with admin and wide-write findings, and identity risk on AI workloads.",
        icon: KeyRound,
      },
      {
        title: "Which data each AI reads",
        body: "Links from each AI service to the stores it reads, with DSPM's sensitivity labels.",
        icon: Database,
      },
      {
        title: "Guardrail attached or not",
        body: "Presence on every model, deployment and agent, every scan.",
        icon: ShieldCheck,
        chips: ["Bedrock Guardrails", "Azure content filters", "Google Model Armor"],
      },
      {
        title: "Suspicious activity on AI",
        body: "Threats on AI assets counted on their own, with the detection that raised each one.",
        icon: Activity,
      },
    ],
  },

  "container-security": {
    stepsHeading: "From cluster access to one prioritised risk",
    steps: [
      {
        title: "Connect clusters read-only",
        body: "Onam connects to EKS, AKS, GKE, ECS and self-managed clusters through read-only Kubernetes RBAC or the equivalent cloud service integration.",
        proof: "EKS · AKS · GKE",
        icon: Plug,
      },
      {
        title: "Evaluate workloads and RBAC",
        body: "Workload, RBAC and network-policy configuration is checked and linked to CIS Kubernetes Benchmark controls where a working rule exists. Control-plane settings are checked only in part.",
        icon: ListChecks,
      },
      {
        title: "Scan running images",
        body: "Images referenced by running workloads are scanned for CVEs in base and application layers, with EPSS and CISA KEV context where available.",
        proof: "EPSS · CISA KEV",
        icon: ScanLine,
      },
      {
        title: "Inspect pod security",
        body: "Pod-level analysis flags privileged containers, host mounts, root users, missing security contexts and over-scoped service accounts.",
        icon: Box,
      },
      {
        title: "Join the attack-path graph",
        body: "Findings feed the same graph as posture and identity, so a vulnerable image on a pod with a permissive service account becomes one prioritised risk.",
        icon: Route,
      },
    ],
    outcomesHeading: "What your platform team gets per cluster",
    outcomes: [
      {
        title: "Image CVEs in every layer",
        body: "CVEs in the base and application layers of images your workloads run, plus registry pull policies and image age.",
        icon: Bug,
        chips: ["Image scanning"],
      },
      {
        title: "Workload controls mapped to CIS",
        body: "CIS Kubernetes Benchmark mapping for workload, RBAC and network-policy controls; control-plane and node settings are checked only in part.",
        icon: ClipboardCheck,
        chips: ["CIS Kubernetes Benchmark"],
      },
      {
        title: "Over-privileged pods and accounts flagged",
        body: "Privileged containers, host mounts and root users, plus service account privilege analysis.",
        icon: ShieldAlert,
        chips: ["Pod Security", "RBAC"],
      },
      {
        title: "Network policy gaps visible",
        body: "Network policy coverage across your clusters.",
        icon: Network,
      },
      {
        title: "ECS tasks covered too",
        body: "ECS task definition security, checked alongside your Kubernetes workloads.",
        icon: Container,
      },
      {
        title: "Runtime signals from audit logs",
        body: "Kubernetes audit-log detections arrive through CDR.",
        icon: Activity,
      },
    ],
  },

  vulnerability: {
    stepsHeading: "From package inventory to the CVEs that matter",
    steps: [
      {
        title: "Build a package inventory",
        body: "Onam reads each scanned host's packages from a disk snapshot taken inside your account, and each repository's dependencies from its manifests. Other tools' SBOMs can be uploaded.",
        icon: Package,
      },
      {
        title: "Match and enrich CVEs",
        body: "Each package is matched against NVD, then enriched with EPSS exploit probability and CISA KEV membership.",
        proof: "NVD · EPSS · CISA KEV",
        icon: Search,
      },
      {
        title: "Join network reachability",
        body: "Reachability from the internet and from internal identities is joined onto every finding, so unreachable CVEs are down-ranked.",
        icon: Network,
      },
      {
        title: "Rank by exploitability",
        body: "The priority queue ranks vulnerabilities by real exploitability in your environment, not by CVSS alone.",
        icon: TrendingUp,
      },
      {
        title: "Point to the exact upgrade",
        body: "Remediation guidance names the upgrade version that closes the CVE and links to affected workloads, so cleanup can go in one ticket.",
        icon: Wrench,
      },
    ],
    outcomesHeading: "What your vulnerability queue looks like",
    outcomes: [
      {
        title: "A ranked queue, not CVSS",
        body: "Prioritisation with EPSS, CISA KEV and network reachability, so the CVEs most likely to be exploited come first.",
        icon: Gauge,
        chips: ["EPSS", "CISA KEV", "Reachability"],
      },
      {
        title: "Known-exploited CVEs flagged",
        body: "CVEs on the CISA Known Exploited Vulnerabilities list are flagged distinctly, so responders can act ahead of the general queue.",
        icon: AlertTriangle,
      },
      {
        title: "SBOMs per repository and host",
        body: "SBOM generation per repository and per scanned host, plus import of CycloneDX or SPDX JSON from other tools.",
        icon: FileText,
        chips: ["CycloneDX", "SPDX import"],
      },
      {
        title: "Hosts and images covered",
        body: "OS-level findings across your EC2 fleet and container image scanning, with no agent on each host.",
        icon: Server,
      },
      {
        title: "The exact upgrade to apply",
        body: "Remediation guidance with the exact upgrade version that closes each CVE.",
        icon: Wrench,
      },
    ],
  },

  "ai-code-fix": {
    stepsHeading: "From a completed scan to a review branch",
    steps: [
      {
        title: "Pick a scan and severities",
        body: "Today a fix run is started with you, on request, against a completed code scan. You pick severities; findings marked false positives are left out.",
        icon: ListChecks,
      },
      {
        title: "Clone with a one-run token",
        body: "The engine shallow-clones the repository with a Git token passed for that request only. The token is never written to the database or logs.",
        proof: "Git token never stored",
        icon: GitBranch,
      },
      {
        title: "Group findings by file",
        body: "For each file, a large language model receives the whole file, every finding in it, and the rule's guidance with a safe example where one exists.",
        icon: FileCode2,
      },
      {
        title: "Rewrite in one pass",
        body: "The model fixes only the listed issues, keeps indentation, names, imports and style, and returns the complete corrected file in one pass.",
        proof: "1 pass per file",
        icon: Wand2,
      },
      {
        title: "Push to a fix branch",
        body: "Corrected files that already exist in the repository are committed to a new branch and pushed. Nothing is merged or deployed; your review and CI decide.",
        proof: "Never your main branch",
        icon: GitPullRequest,
      },
    ],
    outcomesHeading: "What your developers get from each fix run",
    outcomes: [
      {
        title: "Corrected files, not only advice",
        body: "The full rewritten file for each affected path, with every finding in that file fixed together in one pass.",
        icon: FileCheck2,
      },
      {
        title: "Fixes guided by the rule",
        body: "Each finding goes to the model with the rule's recommendation and, where one exists, a safe example in the same language.",
        icon: BookOpen,
      },
      {
        title: "Your main branch left alone",
        body: "Fixes land on a separate branch. Nothing merges or deploys; your review and CI run first.",
        icon: GitBranch,
      },
      {
        title: "A status for every finding",
        body: "Each finding is reported with its outcome and, where it was not fixed, the reason.",
        icon: ListChecks,
        chips: ["Fixed and committed", "Fix generated", "Failed", "Skipped"],
      },
      {
        title: "Critical and high first",
        body: "Filter by severity to fix critical and high findings first, while findings your team dismissed stay untouched.",
        icon: Gauge,
        chips: ["Critical", "High"],
      },
      {
        title: "A token used once",
        body: "The Git token is used for one request and never stored or logged.",
        icon: KeyRound,
      },
    ],
  },
};
