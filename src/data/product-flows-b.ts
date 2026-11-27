import type { FlowData } from "./product-flows.types";

/** Dataflow diagrams, batch b. See product-flows.types.ts for the rules. */
export const flowsB: Record<string, FlowData> = {
  // technology: sub, mechanism (SQL/SSH/API, scan agent, CIS per product, graph join), whatYouGet, faqs (families, agents, shadow IT).
  technology: {
    heading: "From the software you run to its own benchmark",
    intro:
      "Onam finds the databases, servers and appliances running in your fleet and checks each one against the CIS benchmark written for that product.",
    stages: ["Your technology", "Identify what runs", "Check its benchmark", "What you get"],
    inputs: [
      { label: "Databases", icon: "Database", hint: "Checked over SQL" },
      { label: "Operating systems", icon: "Server", hint: "Checked over SSH" },
      { label: "Web servers", icon: "Globe", hint: "Nginx, Apache, IIS, Tomcat" },
      { label: "Containers and virtualisation", icon: "Container", hint: "Docker, VMware ESXi" },
      { label: "Network appliances", icon: "Network", hint: "Cisco, Palo Alto, FortiGate" },
      { label: "SaaS and DevOps", icon: "Blocks", hint: "Through their API" },
      { label: "Unreachable hosts", icon: "Cpu", hint: "Small scan agent", accent: true },
    ],
    engine: {
      name: "Onam Technology Engine",
      sub: "Holds each product to its own benchmark",
      steps: [
        "Connect over SQL, SSH, API",
        "Identify product and version",
        "Run its CIS benchmark",
        "Join to the graph",
      ],
      footer: "34 CIS benchmarks, each for a named product",
    },
    visual: {
      kind: "bars",
      title: "Hardening gaps by family",
      rows: [
        { label: "Databases", value: 78, tone: "hot" },
        { label: "Operating systems", value: 52, tone: "warn" },
        { label: "Web servers", value: 40, tone: "warn" },
        { label: "Network appliances", value: 26 },
        { label: "SaaS and DevOps", value: 18 },
      ],
    },
    visualNote: { text: "Each family, its own benchmark", color: "#B45309" },
    outputs: [
      {
        id: "inventory",
        icon: "Boxes",
        label: "Runtime inventory",
        hint: "What is running today",
        color: "#2563EB",
      },
      {
        id: "version",
        icon: "History",
        label: "Version currency",
        hint: "Is the version supported",
        color: "#0891B2",
      },
      {
        id: "eol",
        icon: "AlertTriangle",
        label: "End-of-life detection",
        hint: "Products past end of life",
        color: "#DC2626",
      },
      {
        id: "defaults",
        icon: "ListChecks",
        label: "Default configuration checks",
        hint: "Databases, web servers, frameworks",
        color: "#D97706",
      },
      {
        id: "shadow",
        icon: "Eye",
        label: "Shadow IT",
        hint: "Products in no inventory",
        color: "#7C3AED",
      },
      {
        id: "risk",
        icon: "Gauge",
        label: "Technology risk score",
        hint: "Internet-reachable ranks higher",
        color: "#059669",
      },
    ],
    footnote:
      "Hosts the central engine cannot reach need a small scan agent. SaaS platforms are checked through their API with no agent.",
    caption:
      "How the Onam Technology Engine works: databases, operating systems, web servers, containers and virtualisation, network appliances, SaaS and DevOps platforms, and hosts reached through a small scan agent go into the engine. It connects over SQL, SSH or the product's API, identifies the product and version, runs the CIS benchmark written for that product and joins each finding to the identity, network and vulnerability graph. There are 34 such benchmarks. An example chart shows hardening gaps by technology family. The outputs are a runtime inventory, version currency, end-of-life detection, default configuration checks, shadow IT and a technology risk score that ranks internet-reachable workloads higher.",
  },

  // saas-security: sub (platforms, 433 rules, six benchmarks), mechanism (read-only connectors, discovery, one queue, federation), whatYouGet, faqs (no CIS pack for GitHub, Bitbucket, Okta; read-only scopes).
  "saas-security": {
    heading: "From SaaS tenants to one queue of findings",
    intro:
      "Onam connects to your SaaS platforms with read-only connectors, checks admins, sharing and audit settings, and puts the findings in the same queue as cloud findings.",
    stages: ["Your SaaS platforms", "Read tenant settings", "Check against CIS", "What you get"],
    inputs: [
      { label: "Microsoft 365", icon: "AppWindow", hint: "Microsoft Graph, OAuth" },
      { label: "Google Workspace", icon: "Mail", hint: "Admin SDK" },
      { label: "SharePoint and Dynamics 365", icon: "FileText", hint: "Read-only connectors" },
      { label: "GitHub, GitLab, Bitbucket", icon: "GitBranch", hint: "DevOps platforms" },
      { label: "Snowflake", icon: "Database", hint: "Private-key JWT" },
      { label: "Okta", icon: "KeyRound", hint: "Traced into cloud access", accent: true },
    ],
    engine: {
      name: "Onam SSPM",
      sub: "Read-only connectors, no agent or extension",
      steps: [
        "Enumerate users and admins",
        "Read sharing and audit settings",
        "Run CIS rules",
        "Join the identity graph",
      ],
      footer: "433 CIS rules across six SaaS benchmarks",
    },
    visual: {
      kind: "hub",
      center: { label: "SaaS tenant", icon: "Blocks" },
      around: [
        { label: "Admin without MFA", icon: "UserRound", flag: true },
        { label: "Public share link", icon: "Share2", flag: true },
        { label: "Audit log gaps", icon: "ScrollText", flag: true },
        { label: "Stale guest", icon: "Users" },
      ],
      chips: ["Example"],
    },
    visualNote: { text: "Identity risks attackers go after", color: "#B42318" },
    outputs: [
      {
        id: "tenants",
        icon: "Users",
        label: "SaaS tenant inventory",
        hint: "Users, admins, guests, services",
        color: "#2563EB",
      },
      {
        id: "mfa",
        icon: "ShieldAlert",
        label: "MFA gaps",
        hint: "On privileged accounts",
        color: "#DC2626",
      },
      {
        id: "sharing",
        icon: "Share2",
        label: "External sharing",
        hint: "Links open to anyone",
        color: "#EA580C",
      },
      {
        id: "audit",
        icon: "ScrollText",
        label: "Audit-log checks",
        hint: "Logging and retention settings",
        color: "#7C3AED",
      },
      {
        id: "stale",
        icon: "Clock",
        label: "Stale identities",
        hint: "Orphaned SaaS accounts",
        color: "#D97706",
      },
      {
        id: "cis",
        icon: "ClipboardCheck",
        label: "CIS score per platform",
        hint: "With per-control evidence",
        color: "#059669",
      },
    ],
    footnote:
      "GitHub, Bitbucket Cloud and Okta have posture checks but no CIS rule pack yet. Connectors never request write scopes or read message contents.",
    caption:
      "How Onam SSPM works: Microsoft 365, Google Workspace, SharePoint, Dynamics 365, GitHub, GitLab, Bitbucket Cloud, Snowflake and Okta connect through read-only connectors. Onam enumerates users and admins, reads sharing and audit settings, runs 433 CIS rules across six SaaS benchmarks and joins the identity graph, so an Okta account that federates into the cloud is traced to the access it unlocks. An example tenant shows an admin without MFA, a public share link, audit log gaps and a stale guest. The outputs are a SaaS tenant inventory, MFA gaps, external sharing, audit-log checks, stale identities and a CIS score per platform, all in the same queue as cloud findings.",
  },

  // cwpp: sub (four form factors, no agent), mechanism (discovery, snapshots, 219 rules, OS CIS, joined signals, pillar score), whatYouGet, faqs (schedule for deep scans).
  cwpp: {
    heading: "From every workload to one posture score",
    intro:
      "Onam finds every VM, container, serverless function and managed host, looks inside it from a snapshot, and scores each one on the same workload posture model.",
    stages: ["Your workloads", "Look inside each one", "Score the workload", "What you get"],
    inputs: [
      { label: "Virtual machines", icon: "Server", hint: "EC2 and equivalents" },
      { label: "Containers", icon: "Container", hint: "On managed Kubernetes" },
      { label: "Serverless functions", icon: "Cpu", hint: "Lambda, Azure Functions" },
      { label: "Managed hosts", icon: "HardDrive", hint: "Discovered automatically" },
      {
        label: "Volume snapshots",
        icon: "ScanLine",
        hint: "Inside your own account",
        accent: true,
      },
    ],
    engine: {
      name: "Onam CWPP",
      sub: "One posture model for every workload",
      steps: [
        "Discover every workload",
        "Scan volume snapshots",
        "Run workload posture rules",
        "Join vulnerabilities and exposure",
      ],
      footer: "219 workload rules plus OS CIS benchmarks",
    },
    visual: {
      kind: "hub",
      center: { label: "Workload", icon: "Server" },
      around: [
        { label: "Runs as root", icon: "ShieldAlert", flag: true },
        { label: "Vulnerable package", icon: "Bug", flag: true },
        { label: "Internet-reachable", icon: "Globe", flag: true },
        { label: "Outdated runtime", icon: "Clock" },
      ],
      chips: ["Example"],
    },
    visualNote: { text: "Configuration, packages and exposure together", color: "#B42318" },
    outputs: [
      {
        id: "inventory",
        icon: "Boxes",
        label: "Workload inventory",
        hint: "Every form factor, one list",
        color: "#2563EB",
      },
      {
        id: "score",
        icon: "Gauge",
        label: "Workload posture score",
        hint: "Severity-ranked findings",
        color: "#7C3AED",
      },
      {
        id: "os",
        icon: "ShieldCheck",
        label: "OS hardening",
        hint: "CIS for five Linux distributions",
        color: "#059669",
      },
      {
        id: "packages",
        icon: "Package",
        label: "Packages and vulnerabilities",
        hint: "Collected without agents",
        color: "#D97706",
      },
      {
        id: "root",
        icon: "ShieldAlert",
        label: "Privileged workloads",
        hint: "Running as root or privileged",
        color: "#DC2626",
      },
      {
        id: "serverless",
        icon: "Cpu",
        label: "Serverless posture",
        hint: "Runtimes, roles, environment secrets",
        color: "#0891B2",
      },
    ],
    footnote:
      "Deep snapshot scans run on a schedule you set, because they use snapshot capacity in your account.",
    caption:
      "How Onam CWPP works: virtual machines, containers, serverless functions and managed hosts are discovered through read-only APIs, and volume snapshots taken inside your own account let Onam look inside them with no agent. Onam CWPP runs 219 workload posture rules plus operating-system CIS benchmarks and joins vulnerability and exposure data onto each workload. An example workload runs as root, has a vulnerable package, is internet-reachable and has an outdated runtime. The outputs are a workload inventory, a workload posture score, OS hardening results, packages and vulnerabilities, privileged workloads and serverless posture.",
  },

  // agentless: sub (snapshots, native orchestration, data stays), mechanism (read-only role, scan worker, bucket relay, capacity manager, deletion and reconciler), whatYouGet, faqs (six clouds, point-in-time gap covered by CDR).
  agentless: {
    heading: "From a disk snapshot to findings, inside your account",
    intro:
      "Onam snapshots each workload's volumes, scans the snapshot with a short-lived worker in your own account, sends back only structured findings, then deletes the snapshot.",
    stages: ["Your clouds", "Snapshot and scan", "Keep raw data home", "What you get"],
    inputs: [
      { label: "AWS", hint: "Step Functions" },
      { label: "Microsoft Azure", hint: "Logic Apps" },
      { label: "Google Cloud", hint: "Workflows" },
      { label: "Oracle Cloud" },
      { label: "IBM Cloud" },
      { label: "Alibaba Cloud" },
      { label: "Read-only role", icon: "KeyRound", hint: "Lists attached volumes", accent: true },
    ],
    engine: {
      name: "Onam Agentless Scanning",
      sub: "Scans disk snapshots inside your own account",
      steps: [
        "Enumerate attached volumes",
        "Snapshot each volume",
        "Analyse in a scan worker",
        "Delete the snapshot",
      ],
      footer: "Orchestrated by your cloud's native services",
    },
    visual: {
      kind: "chain",
      nodes: [
        { label: "Volume" },
        { label: "Snapshot" },
        { label: "Scan worker" },
        { label: "Your bucket" },
        { label: "Findings", tone: "warn" },
      ],
      edges: ["Snapshot", "Analyse", "Relay", "Structured only"],
      tag: { node: 1, label: "Auto-deleted" },
    },
    visualNote: { text: "Raw disk never leaves your account", color: "#047857" },
    outputs: [
      {
        id: "inventory",
        icon: "Package",
        label: "Package and OS inventory",
        hint: "From every scanned volume",
        color: "#2563EB",
      },
      {
        id: "vulns",
        icon: "Bug",
        label: "Vulnerabilities",
        hint: "Real installed software",
        color: "#DC2626",
      },
      {
        id: "host",
        icon: "Server",
        label: "Host configuration",
        hint: "Users, keys, services, hardening",
        color: "#7C3AED",
      },
      {
        id: "secrets",
        icon: "KeyRound",
        label: "Secrets on disk",
        hint: "Credentials found on volumes",
        color: "#EA580C",
      },
      {
        id: "cleanup",
        icon: "RotateCcw",
        label: "Snapshot cleanup",
        hint: "Orphans swept automatically",
        color: "#059669",
      },
      {
        id: "capacity",
        icon: "Gauge",
        label: "Capacity controls",
        hint: "Respects your quotas",
        color: "#0891B2",
      },
    ],
    footnote:
      "Snapshot scanning is point-in-time, so it gives no continuous runtime process telemetry. The CDR engine covers that from audit and flow logs.",
    caption:
      "How Onam Agentless Scanning works: on AWS, Azure, Google Cloud, Oracle Cloud, IBM Cloud and Alibaba Cloud, Onam uses a read-only role to list the volumes attached to each workload. Each volume is snapshotted and analysed by a short-lived scan worker inside your own account, orchestrated by that cloud's native services. Results are relayed through a bucket you own, only structured findings leave your environment, and the snapshot is deleted automatically. The outputs are package and OS inventory, vulnerabilities, host configuration, secrets on disk, snapshot cleanup and per-cloud capacity controls.",
  },

  // api-security: sub (posture from config, not in traffic), mechanism (gateways per cloud, posture rules, gateway checks incl. SSRF pivot, AWS widest), whatYouGet, faqs (no traffic, no gateway means not inventoried).
  "api-security": {
    heading: "From gateway configuration to the APIs left open",
    intro:
      "Onam reads how your API gateways and ingress routes are configured and flags the APIs that are public without authentication, unthrottled, missing a WAF or not enforcing TLS.",
    stages: ["Your API gateways", "Read the configuration", "Check each API", "What you get"],
    inputs: [
      { label: "AWS", hint: "Widest set of checks" },
      { label: "Microsoft Azure", hint: "API Management" },
      { label: "Google Cloud", hint: "API Gateway, Apigee" },
      { label: "Oracle Cloud", hint: "OCI API Gateway" },
      { label: "Alibaba Cloud", hint: "API Gateway" },
      { label: "Kubernetes", hint: "Ingress, Gateway API" },
    ],
    engine: {
      name: "Onam API Security",
      sub: "Reads gateway configuration, not API traffic",
      steps: [
        "Inventory gateway-managed APIs",
        "Run API posture rules",
        "Check each gateway in context",
        "Name a fix per API",
      ],
      footer: "Read-only access, outside your API traffic",
    },
    visual: {
      kind: "chain",
      nodes: [
        { label: "Internet" },
        { label: "Gateway", tone: "hot" },
        { label: "Backend" },
        { label: "Metadata endpoint", tone: "hot" },
      ],
      edges: ["Public stage", "No auth", "Points at"],
      tag: { node: 1, label: "No throttling" },
    },
    visualNote: { text: "Public, unauthenticated, reaching metadata", color: "#B42318" },
    outputs: [
      {
        id: "inventory",
        icon: "Webhook",
        label: "API inventory",
        hint: "Every gateway-managed API",
        color: "#2563EB",
      },
      {
        id: "auth",
        icon: "LockOpen",
        label: "No authentication",
        hint: "Public, no authoriser",
        color: "#DC2626",
      },
      {
        id: "rate",
        icon: "Timer",
        label: "Rate-limit gaps",
        hint: "No rate, burst, quota",
        color: "#D97706",
      },
      {
        id: "waf",
        icon: "Shield",
        label: "WAF gaps",
        hint: "AWS and Azure gateways",
        color: "#7C3AED",
      },
      {
        id: "tls",
        icon: "Lock",
        label: "TLS gaps",
        hint: "HTTPS-only and mutual TLS",
        color: "#0891B2",
      },
      {
        id: "keys",
        icon: "KeyRound",
        label: "Ageing keys, risky backends",
        hint: "Private or metadata targets",
        color: "#EA580C",
      },
    ],
    footnote:
      "Posture, not runtime: Onam does not inspect API traffic, and an API with no gateway or ingress in front is not inventoried.",
    caption:
      "How Onam API Security works: API gateways on AWS, Azure, Google Cloud (API Gateway and Apigee), Oracle Cloud and Alibaba Cloud, plus Kubernetes Ingress and Gateway API objects, are read through read-only access. Onam inventories gateway-managed APIs, runs API posture rules, checks each gateway in context and names a fix for each finding. AWS API Gateway has the widest set of checks. An example shows an API reachable from the internet through a public gateway stage with no authentication and no throttling, whose backend points at a cloud metadata endpoint. The outputs are an API inventory, missing authentication, rate-limit gaps, WAF gaps, TLS gaps, and ageing keys and risky backends.",
  },

  // database-security: sub (310 rules), mechanism (clouds, cloud posture, engine CIS, DSPM labels raise to critical, six-domain score), whatYouGet, faqs (control-plane only; engine checks need a read-only DB account).
  "database-security": {
    heading: "From every database to the ones that matter most",
    intro:
      "Onam checks every managed and self-hosted database for encryption, exposure, backups and audit logging, then ranks the ones holding sensitive data first.",
    stages: ["Your databases", "Check cloud and engine", "Weigh what it holds", "What you get"],
    inputs: [
      { label: "AWS" },
      { label: "Microsoft Azure" },
      { label: "Google Cloud" },
      { label: "Oracle Cloud" },
      { label: "IBM Cloud" },
      { label: "Alibaba Cloud" },
      { label: "Kubernetes" },
      {
        label: "Self-hosted engines",
        icon: "Server",
        hint: "Optional read-only account",
        accent: true,
      },
    ],
    engine: {
      name: "Onam Database Security",
      sub: "Cloud posture plus engine hardening",
      steps: [
        "Discover every database",
        "Run cloud posture rules",
        "Run engine CIS benchmarks",
        "Weight by DSPM labels",
      ],
      footer: "310 storage and database posture rules",
    },
    visual: {
      kind: "hub",
      center: { label: "Database", icon: "Database" },
      around: [
        { label: "Public access", icon: "Globe", flag: true },
        { label: "Unencrypted", icon: "LockOpen", flag: true },
        { label: "Labelled PII", icon: "FileSearch", flag: true },
        { label: "Short backup retention", icon: "History" },
      ],
      chips: ["Critical"],
    },
    visualNote: { text: "Public and holding PII: critical", color: "#B42318" },
    outputs: [
      {
        id: "inventory",
        icon: "Boxes",
        label: "Database inventory",
        hint: "Managed and self-hosted",
        color: "#2563EB",
      },
      {
        id: "enc",
        icon: "Lock",
        label: "Encryption coverage",
        hint: "At rest and in transit",
        color: "#7C3AED",
      },
      {
        id: "public",
        icon: "Globe",
        label: "Public exposure",
        hint: "Accessibility and network placement",
        color: "#DC2626",
      },
      {
        id: "snapshots",
        icon: "Share2",
        label: "Snapshot exposure",
        hint: "Shared outside your account",
        color: "#EA580C",
      },
      {
        id: "backup",
        icon: "RotateCcw",
        label: "Backup and recovery",
        hint: "Retention, point-in-time recovery",
        color: "#059669",
      },
      {
        id: "grants",
        icon: "UserRound",
        label: "Privileged accounts",
        hint: "Database grants reviewed",
        color: "#CA8A04",
      },
    ],
    footnote:
      "Cloud posture comes from control-plane APIs. Engine-level CIS checks are optional and need a read-only database account you provide.",
    caption:
      "How Onam Database Security works: databases on AWS, Azure, Google Cloud, Oracle Cloud, IBM Cloud, Alibaba Cloud and Kubernetes are discovered through read-only APIs, and self-hosted engines can be added with an optional read-only database account. Onam runs 310 storage and database posture rules, CIS benchmarks for the database engines, and weights each finding by the labels DSPM assigns. An example database that is public, unencrypted and labelled as holding PII is raised to critical. The outputs are a database inventory, encryption coverage, public exposure, snapshot exposure, backup and recovery, and privileged account review.",
  },

  // encryption: sub (502 rules, who a key lets in), mechanism (key services, coverage analyzer, policy parsing, key-to-resource map, certificates, rotation, DSPM labels, drift), whatYouGet, faqs (metadata only, no decrypt).
  encryption: {
    heading: "From encrypted to who can actually decrypt",
    intro:
      "Onam finds every key, secret and certificate, works out which resources use which key, and shows who a key policy lets in and what changed since the last scan.",
    stages: ["Your keys and secrets", "Map keys to resources", "Read who gets in", "What you get"],
    inputs: [
      { label: "AWS KMS", icon: "KeyRound", hint: "Key metadata and policies" },
      { label: "Azure Key Vault", icon: "Lock" },
      { label: "GCP Cloud KMS", icon: "KeyRound" },
      { label: "OCI Vault", icon: "Lock" },
      { label: "Certificates", icon: "FileCheck2", hint: "ACM and equivalents" },
      { label: "Secrets managers", icon: "ShieldHalf", hint: "Rotation, versioning, access" },
      { label: "DSPM labels", icon: "Database", hint: "Which data is sensitive", accent: true },
    ],
    engine: {
      name: "Onam Encryption",
      sub: "Who can decrypt, and with whose key",
      steps: [
        "Map encryption coverage",
        "Parse key policies",
        "Map keys to resources",
        "Check rotation and expiry",
      ],
      footer: "502 secrets and key-management rules",
    },
    visual: {
      kind: "hub",
      center: { label: "Key", icon: "KeyRound" },
      around: [
        { label: "Wildcard principal", icon: "Users", flag: true },
        { label: "Rotation off", icon: "RotateCcw", flag: true },
        { label: "Dependent resources", icon: "Database" },
        { label: "Scheduled deletion", icon: "Clock", flag: true },
      ],
      chips: ["Example"],
    },
    visualNote: { text: "A key too many can use", color: "#B42318" },
    outputs: [
      {
        id: "coverage",
        icon: "ShieldCheck",
        label: "Coverage report",
        hint: "Unencrypted, provider, customer keys",
        color: "#2563EB",
      },
      {
        id: "reach",
        icon: "Users",
        label: "Key policy reach",
        hint: "Wildcards, other accounts, grants",
        color: "#DC2626",
      },
      {
        id: "blast",
        icon: "Share2",
        label: "Key blast radius",
        hint: "Resources that depend on it",
        color: "#EA580C",
      },
      {
        id: "drift",
        icon: "GitCompareArrows",
        label: "Encryption drift",
        hint: "Changed since last scan",
        color: "#7C3AED",
      },
      {
        id: "rotation",
        icon: "RotateCcw",
        label: "Rotation compliance",
        hint: "Overdue rotation alerts",
        color: "#059669",
      },
      {
        id: "certs",
        icon: "FileCheck2",
        label: "Certificate expiry",
        hint: "Warned ahead of expiry",
        color: "#D97706",
      },
    ],
    footnote:
      "Onam reads key metadata and policy only. It never requests decrypt permission and never handles key material.",
    caption:
      "How Onam Encryption works: keys, secrets and certificates from AWS KMS, Azure Key Vault, GCP Cloud KMS, OCI Vault, certificate services and secrets managers go into the engine, with DSPM labels showing which data is sensitive. Onam maps encryption coverage, parses key policies, maps each key to the resources that depend on it and checks rotation and expiry against 502 secrets and key-management rules. An example key has a wildcard principal, rotation switched off and is scheduled for deletion. The outputs are a coverage report, key policy reach, key blast radius, encryption drift, rotation compliance and certificate expiry warnings.",
  },

  // ai-assistant: sub (specialists query real findings), mechanism (orchestrator, tenant scope, citations, cross-domain, read-only), whatYouGet, faqs (human approval for fixes, says so when data does not support an answer).
  "ai-assistant": {
    heading: "From a plain question to a cited answer",
    intro:
      "Ask a question in plain language. Onam routes it to domain specialists that query your own findings and answer with a link to every finding behind each claim.",
    stages: ["Your findings", "Route the question", "Query and combine", "What you get"],
    inputs: [
      { label: "Posture findings", icon: "ShieldCheck", hint: "Misconfigured resources" },
      { label: "Identity findings", icon: "KeyRound", hint: "IAM and access" },
      { label: "Network findings", icon: "Network", hint: "What is exposed" },
      { label: "Data findings", icon: "Database", hint: "What data is held" },
      { label: "Vulnerabilities", icon: "Bug", hint: "Known CVEs" },
      { label: "Attack paths", icon: "Route", hint: "Routes to assets" },
      { label: "Your permissions", icon: "UserRound", hint: "Scope every query", accent: true },
    ],
    engine: {
      name: "Onam AI Assistant",
      sub: "Specialists query your real findings",
      steps: [
        "Route the question",
        "Query live findings",
        "Combine across domains",
        "Cite every claim",
      ],
      footer: "Thirteen domain specialists, read-only",
    },
    visual: {
      kind: "chat",
      question: "Which production databases are exposed to the internet and hold customer data?",
      answer:
        "I joined network, data and identity findings. Each match links to the findings behind it. I can show the remediation already generated; applying it goes through your remediation workflow with human approval.",
    },
    visualNote: { text: "Cited answer, no silent changes", color: "#047857" },
    outputs: [
      {
        id: "answers",
        icon: "MessageSquare",
        label: "Plain-language answers",
        hint: "Across every engine",
        color: "#2563EB",
      },
      {
        id: "cited",
        icon: "Quote",
        label: "Cited claims",
        hint: "Linked to the finding",
        color: "#7C3AED",
      },
      {
        id: "cross",
        icon: "Workflow",
        label: "Cross-domain answers",
        hint: "Several specialists, one answer",
        color: "#0891B2",
      },
      {
        id: "paths",
        icon: "Route",
        label: "Attack paths explained",
        hint: "In plain language",
        color: "#DC2626",
      },
      {
        id: "fix",
        icon: "Wand2",
        label: "Remediation guidance",
        hint: "From the finding's record",
        color: "#059669",
      },
      {
        id: "scope",
        icon: "Lock",
        label: "Tenant-scoped",
        hint: "Only what you can see",
        color: "#D97706",
      },
    ],
    footnote:
      "The assistant is read-only. Applying a fix goes through the normal remediation workflow with human approval.",
    caption:
      "How the Onam AI Assistant works: your posture, identity, network, data, vulnerability and attack path findings, scoped by your own permissions, are what the assistant reads. An orchestrator routes each question to domain specialists, which query your live findings, combine results across domains and cite every claim. In an example, a question about production databases exposed to the internet and holding customer data gets an answer that links to the findings behind it and notes that applying a fix needs human approval. The outputs are plain-language answers, cited claims, cross-domain answers, attack paths explained, remediation guidance and tenant-scoped results.",
  },

  // remediation: sub (guidance, AI fix prompt, fix branches for SAST), mechanism (rule guidance, prompt, AI Code Fix branch, advisory versions, attack-path hops), whatYouGet (tickets, verification), faqs (never applied automatically).
  remediation: {
    heading: "From a finding to a fix your team reviews",
    intro:
      "Every finding comes with fix guidance and an AI fix prompt; source-code findings get a fix branch; the next scan checks that the fix landed.",
    stages: ["Your findings", "Draft the fix", "Review and apply", "What you get"],
    inputs: [
      { label: "Posture findings", icon: "ShieldAlert", hint: "Each with written guidance" },
      { label: "SAST findings", icon: "FileCode2", hint: "In your source code" },
      { label: "Vulnerable dependencies", icon: "Package", hint: "With advisory data" },
      { label: "Attack paths", icon: "Route", hint: "Hop by hop" },
      {
        label: "Your repositories",
        icon: "GitBranch",
        hint: "Fix branches land here",
        accent: true,
      },
    ],
    engine: {
      name: "Onam Remediation",
      sub: "Turns each finding into a reviewable fix",
      steps: [
        "Attach rule guidance",
        "Write an AI fix prompt",
        "Push SAST fix branches",
        "Re-check on next scan",
      ],
      footer: "Proposals you review, never auto-applied",
    },
    visual: {
      kind: "diff",
      file: "storage.tf",
      lines: [
        { op: " ", text: 'resource "aws_s3_bucket_public_access_block" "logs" {' },
        { op: "-", text: "  block_public_policy     = false" },
        { op: "+", text: "  block_public_policy     = true" },
        { op: "-", text: "  restrict_public_buckets = false" },
        { op: "+", text: "  restrict_public_buckets = true" },
        { op: " ", text: "}" },
      ],
      badge: "Re-checked on the next scan",
    },
    visualNote: { text: "A drafted change, reviewed before applying", color: "#047857" },
    outputs: [
      {
        id: "guidance",
        icon: "BookOpenText",
        label: "Fix guidance",
        hint: "CLI, Terraform, console steps",
        color: "#2563EB",
      },
      {
        id: "prompt",
        icon: "Sparkles",
        label: "AI fix prompt",
        hint: "Names the resource",
        color: "#7C3AED",
      },
      {
        id: "branch",
        icon: "GitPullRequest",
        label: "Fix branches",
        hint: "SAST fixes to review",
        color: "#059669",
      },
      {
        id: "versions",
        icon: "Package",
        label: "Fixed versions",
        hint: "From the advisory",
        color: "#D97706",
      },
      {
        id: "tickets",
        icon: "Webhook",
        label: "Tickets and alerts",
        hint: "Jira, ServiceNow, Slack, PagerDuty",
        color: "#EA580C",
      },
      {
        id: "verify",
        icon: "BadgeCheck",
        label: "Verified fixes",
        hint: "Closed on evidence",
        color: "#0891B2",
      },
    ],
    footnote:
      "Onam does not apply fixes to your cloud. Your team reviews each change, and code fixes arrive as a branch you merge.",
    caption:
      "How Onam Remediation works: posture findings, SAST findings in source code, vulnerable dependencies and attack paths go into Onam Remediation, which attaches each rule's written guidance, writes an AI fix prompt naming the resource, pushes fix branches for SAST findings to your repositories and re-checks the resource on the next scan. An example shows a Terraform change that blocks public access to a storage bucket. The outputs are fix guidance for CLI, Terraform or console, an AI fix prompt, fix branches, fixed versions from the advisory, tickets and alerts, and fixes verified on the next scan. Onam never applies a fix to your cloud itself.",
  },

  // inventory: sub (seven clouds, 672 services, graph), mechanism (read-only enumeration, normalised model, relationships, every scan, every engine reads it), whatYouGet, faqs (read-only, next scan, REST API).
  inventory: {
    heading: "From every cloud account to one connected inventory",
    intro:
      "Onam lists every resource in your clouds with read-only access, puts each one in a shared model, and maps how resources connect, so every other engine reads the same list.",
    stages: ["Your clouds", "List every resource", "Map the connections", "What you get"],
    inputs: [
      { label: "AWS" },
      { label: "Microsoft Azure" },
      { label: "Google Cloud" },
      { label: "Oracle Cloud" },
      { label: "Alibaba Cloud" },
      { label: "IBM Cloud" },
      { label: "Kubernetes" },
      {
        label: "Read-only credentials",
        icon: "KeyRound",
        hint: "Roles, principals, service accounts",
        accent: true,
      },
    ],
    engine: {
      name: "Onam Discovery",
      sub: "The inventory every engine reads from",
      steps: [
        "Enumerate every resource",
        "Normalise into one model",
        "Map relationships",
        "Refresh every scan",
      ],
      footer: "672 services across seven clouds",
    },
    visual: {
      kind: "hub",
      center: { label: "Resource", icon: "Box" },
      around: [
        { label: "Subnet", icon: "Network" },
        { label: "Assumed role", icon: "KeyRound" },
        { label: "Attached volume", icon: "HardDrive" },
        { label: "No owner tag", icon: "AlertTriangle", flag: true },
      ],
      chips: ["Example"],
    },
    visualNote: { text: "One resource and what it touches", color: "#1D4ED8" },
    outputs: [
      {
        id: "unified",
        icon: "Boxes",
        label: "Unified inventory",
        hint: "Every cloud, one list",
        color: "#2563EB",
      },
      {
        id: "graph",
        icon: "Share2",
        label: "Relationship graph",
        hint: "What attack paths walk",
        color: "#7C3AED",
      },
      {
        id: "orphans",
        icon: "AlertTriangle",
        label: "Untagged and orphaned",
        hint: "Unowned resources reported",
        color: "#DC2626",
      },
      {
        id: "history",
        icon: "History",
        label: "Resource history",
        hint: "What changed, and when",
        color: "#D97706",
      },
      {
        id: "coverage",
        icon: "MapPin",
        label: "Coverage reporting",
        hint: "Accounts and regions scanned",
        color: "#059669",
      },
      {
        id: "api",
        icon: "Plug",
        label: "REST API",
        hint: "Feed a CMDB or warehouse",
        color: "#0891B2",
      },
    ],
    footnote:
      "New resources appear at the next scan, not instantly. Discovery runs as the first stage of every scan.",
    caption:
      "How Onam Discovery works: AWS, Azure, Google Cloud, Oracle Cloud, Alibaba Cloud, IBM Cloud and Kubernetes are enumerated with read-only roles, service principals or service accounts, covering 672 services. Onam normalises each resource into a shared model, maps the relationships between resources and refreshes the inventory on every scan. An example resource sits in a subnet, has an assumed role and an attached volume, and has no owner tag. The outputs are a unified inventory, a relationship graph that attack paths walk, untagged and orphaned resource reports, resource history, coverage reporting and access through the REST API.",
  },

  // cnapp: sub (seven pillars, one score), mechanism (0–100 pillars, fixed weights, risk band, rebalancing, trend, one findings model with context-raised severity and fix-by date), whatYouGet, faqs (CIEM is not a pillar).
  cnapp: {
    heading: "From seven pillar scores to one posture score",
    intro:
      "Onam scores posture, threat detection and identity, workloads, data, network, threat and code as separate pillars, then combines them into one score you can trend and drill into.",
    stages: ["Your engines", "Score each pillar", "Combine with weights", "What you get"],
    inputs: [
      { label: "Posture (CSPM)", icon: "ShieldCheck", hint: "Share of checks passing" },
      { label: "Threat detection and IAM", icon: "Radar", hint: "CDR" },
      { label: "Workloads (CWPP)", icon: "Server" },
      { label: "Data (DSPM)", icon: "Database" },
      { label: "Network", icon: "Network" },
      { label: "Threat", icon: "Crosshair" },
      { label: "Code (AppSec)", icon: "FileCode2" },
    ],
    engine: {
      name: "Onam CNAPP",
      sub: "Seven pillars, one posture score",
      steps: [
        "Score each pillar 0–100",
        "Apply fixed weights",
        "Rebalance missing pillars",
        "Assign a risk band",
      ],
      footer: "Low, medium, high or critical",
    },
    visual: {
      kind: "bars",
      title: "Pillar scores",
      rows: [
        { label: "Posture", value: 82 },
        { label: "Workloads", value: 64 },
        { label: "Data", value: 48, tone: "warn" },
        { label: "Network", value: 71 },
        { label: "Code", value: 35, tone: "hot" },
      ],
    },
    visualNote: { text: "Pillars roll up into one score", color: "#1D4ED8" },
    outputs: [
      {
        id: "score",
        icon: "Gauge",
        label: "One posture score",
        hint: "With a risk band",
        color: "#2563EB",
      },
      {
        id: "pillars",
        icon: "BarChart3",
        label: "Pillar scores",
        hint: "Seven, each 0–100",
        color: "#7C3AED",
      },
      {
        id: "trend",
        icon: "TrendingUp",
        label: "Trend over time",
        hint: "Is posture improving",
        color: "#059669",
      },
      {
        id: "drill",
        icon: "Search",
        label: "Drill-down",
        hint: "Pillar to its findings",
        color: "#0891B2",
      },
      {
        id: "severity",
        icon: "ShieldAlert",
        label: "Context-raised severity",
        hint: "Exposure, attack paths, threats",
        color: "#DC2626",
      },
      {
        id: "fixby",
        icon: "CalendarCheck",
        label: "Fix-by date",
        hint: "On every finding",
        color: "#D97706",
      },
    ],
    footnote:
      "A pillar with no data is left out and the other weights are rebalanced. CIEM feeds the attack path graph, not a pillar.",
    caption:
      "How Onam CNAPP works: seven pillars, each scored by its own engine on a 0 to 100 scale, go in: posture from CSPM, threat detection with IAM posture from CDR, workloads from CWPP, data from DSPM, network, threat, and code from AppSec. Onam combines them with fixed weights, rebalances when a pillar has no data and assigns a risk band of low, medium, high or critical. An example chart shows pillar scores side by side. The outputs are one posture score with a risk band, the pillar scores, a trend over time, drill-down to findings, context-raised severity and a fix-by date on every finding.",
  },
};
