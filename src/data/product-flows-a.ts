import type { FlowData } from "./product-flows.types";

/** Dataflow diagrams, batch a. See product-flows.types.ts for the rules. */
export const flowsA: Record<string, FlowData> = {
  // code-security: sub, mechanism (repo + branch, shallow clone deleted, issues vs hotspots, OSV/NVD/EPSS/KEV,
  // IaC, secrets, DAST), whatYouGet (0–10 dependency score, SBOM, fix path), faqs (no CI plugin or PR check).
  "code-security": {
    heading: "From a repository to confirmed issues first",
    intro:
      "Onam scans your code, dependencies, templates and running app, keeps the issues it can confirm apart from hotspots, and gives each one a fix path.",
    stages: ["Your code and apps", "Scan every layer", "Grade by proof", "What you get"],
    inputs: [
      { label: "Repository and branch", icon: "GitBranch", hint: "GitHub, GitLab or Bitbucket" },
      { label: "Manifests and lockfiles", icon: "Package", hint: "Your dependencies" },
      { label: "IaC and Dockerfiles", icon: "FileCode2", hint: "In the same clone" },
      { label: "Existing SBOMs", icon: "FileText", hint: "CycloneDX or SPDX JSON" },
      {
        label: "Running app URL",
        icon: "Globe",
        hint: "Optional, for dynamic testing",
        accent: true,
      },
    ],
    engine: {
      name: "Onam Code Security",
      sub: "Scans a shallow clone, then deletes it",
      steps: [
        "Static analysis",
        "Dependency and SBOM analysis",
        "IaC and secret checks",
        "Dynamic testing",
      ],
      footer: "Confirmed issues first, hotspots kept separate",
    },
    visual: {
      kind: "diff",
      file: "app/users.py",
      lines: [
        { op: " ", text: 'uid = request.args.get("id")' },
        { op: "-", text: 'cur.execute("SELECT * FROM users WHERE id = " + uid)' },
        { op: "+", text: 'cur.execute("SELECT * FROM users WHERE id = %s", (uid,))' },
        { op: " ", text: "row = cur.fetchone()" },
      ],
      badge: "The safe pattern from guidance",
    },
    visualNote: { text: "Untrusted input traced to a query", color: "#B42318" },
    outputs: [
      {
        id: "issues",
        icon: "ShieldAlert",
        label: "Security issues",
        hint: "Confirmed by data flow",
        color: "#DC2626",
      },
      {
        id: "hotspots",
        icon: "ScanSearch",
        label: "Hotspots to review",
        hint: "Capped at medium",
        color: "#D97706",
      },
      {
        id: "deps",
        icon: "Gauge",
        label: "Dependency risk",
        hint: "0–10 score, beyond CVSS",
        color: "#7C3AED",
      },
      {
        id: "sbom",
        icon: "Package",
        label: "SBOM per repository",
        hint: "CycloneDX, with license checks",
        color: "#0891B2",
      },
      {
        id: "dast",
        icon: "Globe",
        label: "Dynamic test results",
        hint: "Endpoints, injection, SSRF",
        color: "#2563EB",
      },
      {
        id: "fix",
        icon: "Wand2",
        label: "A fix path",
        hint: "Guidance and AI prompt",
        color: "#059669",
      },
    ],
    footnote:
      "No CI plugin or pull-request check today: a pipeline step can start a scan through the API and decide whether to fail.",
    caption:
      "How Onam Code Security works: a repository and branch from GitHub, GitLab or Bitbucket, its manifests and lockfiles, IaC templates and Dockerfiles, existing SBOMs and, optionally, the URL of a running app go into Onam Code Security, which scans a shallow clone and deletes it afterwards. It runs static analysis, dependency and SBOM analysis, IaC and secret checks and dynamic testing. The example shows a query built from untrusted input and the safe pattern from the rule guidance. The outputs are confirmed security issues, hotspots to review capped at medium, a 0 to 10 dependency risk score, an SBOM per repository, dynamic test results and a fix path for every finding.",
  },

  // iam: sub, mechanism (identity-scoped rules, six modules, provider analysers, posture score, feeds CIEM),
  // whatYouGet (MFA, key age, root, policy hygiene, trust, Effective Access), faqs (clouds covered, key abuse is CDR).
  iam: {
    heading: "From every identity setting to a hygiene score",
    intro:
      "Onam checks each identity's configuration on every scan, in each connected cloud, and sorts what it finds into six modules with a score.",
    stages: ["Your clouds", "Check every identity", "Sort into modules", "What you get"],
    inputs: [
      { label: "AWS" },
      { label: "Microsoft Azure" },
      { label: "Google Cloud" },
      { label: "Kubernetes" },
      { label: "Oracle Cloud" },
      { label: "Alibaba Cloud" },
      { label: "IBM Cloud" },
      { label: "Posture scan findings", hint: "Identity-scoped rules", accent: true },
    ],
    engine: {
      name: "Onam IAM Security",
      sub: "The hygiene view of the identity engine",
      steps: [
        "Load identity findings",
        "Add its own detections",
        "Sort into six modules",
        "Score each module",
      ],
      footer: "Same identities and findings as CIEM",
    },
    visual: {
      kind: "hub",
      center: { label: "One identity", icon: "UserRound" },
      around: [
        { label: "No MFA", icon: "ShieldAlert", flag: true },
        { label: "Old access key", icon: "KeyRound", flag: true },
        { label: "Wildcard policy", icon: "LockOpen", flag: true },
        { label: "Password policy", icon: "Lock" },
      ],
    },
    visualNote: { text: "One identity, several hygiene gaps", color: "#B42318" },
    outputs: [
      {
        id: "mfa",
        icon: "ShieldCheck",
        label: "MFA coverage",
        hint: "Who has no MFA",
        color: "#DC2626",
      },
      {
        id: "keys",
        icon: "KeyRound",
        label: "Key and credential age",
        hint: "Past rotation thresholds",
        color: "#EA580C",
      },
      {
        id: "root",
        icon: "UserRound",
        label: "Root account usage",
        hint: "Activity and root keys",
        color: "#CA8A04",
      },
      {
        id: "policy",
        icon: "ScrollText",
        label: "Policy hygiene",
        hint: "Wildcards, admin, inline",
        color: "#7C3AED",
      },
      {
        id: "trust",
        icon: "Handshake",
        label: "Trust settings",
        hint: "Wildcards, missing ExternalId",
        color: "#0891B2",
      },
      {
        id: "lookup",
        icon: "Search",
        label: "Effective Access lookup",
        hint: "Any principal, after denies",
        color: "#2563EB",
      },
    ],
    footnote:
      "IAM Security flags risky key settings; spotting a key being abused is the job of threat detection and CDR.",
    caption:
      "How Onam IAM Security works: identities in AWS, Azure, Google Cloud, Kubernetes, Oracle Cloud, Alibaba Cloud and IBM Cloud, plus the identity-scoped findings of each posture scan, go into Onam IAM Security. It loads those findings, adds its own detections, sorts them into six modules and scores each module. The example shows one identity with no MFA, an old access key and a wildcard policy. The outputs are MFA coverage, key and credential age, root account usage, policy hygiene, trust settings and an Effective Access lookup. The same identities and findings feed CIEM.",
  },

  // cdr: sub, painPoint (leaked key, ordinary-looking calls), mechanism (audit log sources, levels 1–3, four
  // sequence shapes, MITRE, graph context), whatYouGet, faqs (retention unchanged).
  cdr: {
    heading: "From audit logs to attacker behaviour, with context",
    intro:
      "Onam reads the audit logs your clouds already produce, finds attacker behaviour in single events, sequences and baselines, and joins each detection to what that identity can reach.",
    stages: ["Your audit logs", "Three detection levels", "Read the sequence", "What you get"],
    inputs: [
      { label: "CloudTrail", icon: "ScrollText", hint: "AWS" },
      { label: "Activity Log", icon: "ScrollText", hint: "Azure" },
      { label: "Cloud Audit Logs", icon: "ScrollText", hint: "Google Cloud" },
      { label: "OCI Audit", icon: "ScrollText", hint: "Oracle Cloud" },
      { label: "ActionTrail", icon: "ScrollText", hint: "Alibaba Cloud" },
      { label: "Activity Tracker", icon: "ScrollText", hint: "IBM Cloud" },
      { label: "Kubernetes audit logs", icon: "Container", hint: "Including EKS" },
      { label: "Onam graph", icon: "Layers", hint: "Posture and identity context", accent: true },
    ],
    engine: {
      name: "Onam CDR",
      sub: "Finds attacker behaviour in your audit logs",
      steps: [
        "Judge single events",
        "Correlate within a window",
        "Compare with baselines",
        "Match attack sequences",
      ],
      footer: "Mapped to MITRE ATT&CK, joined to the graph",
    },
    visual: {
      kind: "chain",
      nodes: [
        { label: "Leaked key", tone: "warn" },
        { label: "Identity check" },
        { label: "Bucket listing" },
        { label: "Role lookup" },
        { label: "Copy out", tone: "hot" },
      ],
      edges: ["Looks normal", "Looks normal", "Looks normal", "Exfiltration"],
      tag: { node: 4, label: "Sequence found" },
    },
    visualNote: { text: "Ordinary calls, one exfiltration shape", color: "#B42318" },
    outputs: [
      {
        id: "single",
        icon: "AlertTriangle",
        label: "Single-event detections",
        hint: "Suspicious on its own",
        color: "#DC2626",
      },
      {
        id: "corr",
        icon: "Workflow",
        label: "Correlated patterns",
        hint: "Across several events",
        color: "#EA580C",
      },
      {
        id: "anomaly",
        icon: "Activity",
        label: "Identity anomalies",
        hint: "Unlike its own baseline",
        color: "#D97706",
      },
      {
        id: "seq",
        icon: "Route",
        label: "Attack sequences",
        hint: "Exfiltration, pivot, staging, hijack",
        color: "#7C3AED",
      },
      {
        id: "mitre",
        icon: "Crosshair",
        label: "MITRE ATT&CK",
        hint: "Mapped on detections",
        color: "#2563EB",
      },
      {
        id: "context",
        icon: "Layers",
        label: "Posture and identity context",
        hint: "In the alerts view",
        color: "#0891B2",
      },
    ],
    footnote:
      "CDR reads logs where they already are and keeps your retention as it is; longer history gives baselines more to learn from.",
    caption:
      "How Onam CDR works: audit logs from AWS CloudTrail, Azure Activity Log, Google Cloud Audit Logs, OCI Audit, Alibaba Cloud ActionTrail, IBM Cloud Activity Tracker and Kubernetes, plus posture and identity context from the Onam graph, go into Onam CDR. It judges single events, correlates events within a time window, compares each identity with its own baseline and matches attack sequences. The example shows a leaked key followed by an identity check, a bucket listing and a role lookup that each look normal, then a copy out that completes an exfiltration sequence. The outputs are single-event detections, correlated patterns, identity anomalies, attack sequences, MITRE ATT&CK mapping and posture and identity context in the alerts view.",
  },

  // threat-detection: sub, mechanism (audit logs, flow logs on three clouds, GuardDuty via S3, MITRE mapping,
  // attack chains, reachability ranking, correlation into incidents), whatYouGet, faqs (log sources).
  "threat-detection": {
    heading: "From cloud logs to a ranked attack chain",
    intro:
      "Onam runs cloud logs through rules, correlation and baselines, maps each finding to MITRE ATT&CK for Cloud, and groups related detections into one attack chain.",
    stages: ["Your logs", "Detect and map", "Group into chains", "What you get"],
    inputs: [
      { label: "Cloud audit logs", icon: "ScrollText", hint: "Every connected cloud" },
      { label: "Network flow logs", icon: "Network", hint: "AWS, Azure, Google Cloud" },
      { label: "GuardDuty findings", icon: "ShieldAlert", hint: "AWS, when exported to S3" },
      { label: "Kubernetes audit logs", icon: "Container", hint: "Plus Kubernetes events" },
      { label: "Attack Path engine", icon: "Route", hint: "Same reachability model", accent: true },
    ],
    engine: {
      name: "Onam Threat Detection",
      sub: "Maps each event to MITRE ATT&CK",
      steps: [
        "Rules, correlation, baselines",
        "Map tactic and technique",
        "Group into attack chains",
        "Rank by reachability",
      ],
      footer: "Redundant alerts collapse into one incident",
    },
    visual: {
      kind: "chain",
      nodes: [
        { label: "Initial access", tone: "warn" },
        { label: "Discovery" },
        { label: "Privilege escalation" },
        { label: "Impact", tone: "hot" },
      ],
      edges: ["Next step", "Next step", "Next step"],
      tag: { node: 3, label: "Attack chain" },
    },
    visualNote: { text: "Related detections, one attack chain", color: "#B42318" },
    outputs: [
      {
        id: "mitre",
        icon: "Crosshair",
        label: "MITRE ATT&CK mapping",
        hint: "Tactic and technique",
        color: "#2563EB",
      },
      {
        id: "chains",
        icon: "Route",
        label: "Attack chains",
        hint: "As connected graphs",
        color: "#DC2626",
      },
      {
        id: "blast",
        icon: "Radar",
        label: "Blast radius",
        hint: "Analysis per threat",
        color: "#EA580C",
      },
      {
        id: "rank",
        icon: "ListOrdered",
        label: "Ranked severity",
        hint: "CVSS, exploitability, reachability",
        color: "#7C3AED",
      },
      {
        id: "incidents",
        icon: "Layers",
        label: "Fewer alerts",
        hint: "Bursts become one incident",
        color: "#0891B2",
      },
      {
        id: "guide",
        icon: "BookOpen",
        label: "Response guidance",
        hint: "A playbook per technique",
        color: "#059669",
      },
    ],
    footnote:
      "Flow logs are read on AWS, Azure and Google Cloud; GuardDuty findings only when GuardDuty exports them to S3.",
    caption:
      "How Onam Threat Detection works: cloud audit logs from every connected cloud, network flow logs from AWS, Azure and Google Cloud, GuardDuty findings exported to S3, and Kubernetes audit logs and events go into Onam Threat Detection, which also uses the Attack Path engine's reachability model. It runs single-event rules, correlation and per-identity baselines, maps each finding to a MITRE ATT&CK for Cloud tactic and technique, groups related detections into attack chains and ranks them by reachability. The example shows a chain from initial access through discovery and privilege escalation to impact. The outputs are MITRE ATT&CK mapping, attack chains, blast radius, ranked severity, fewer alerts through correlation and response guidance per technique.",
  },

  // network-security: sub, painPoint (public subnet, load balancer, peered VPC, jump host with SSH open, database),
  // mechanism (network objects, reachability graph, effective exposure, coverage gaps), whatYouGet, faqs (clouds, agentless, not a host scanner).
  "network-security": {
    heading: "From network rules to what the internet reaches",
    intro:
      "Onam pulls every network object in your clouds, traces the path from the internet through each layer, and scores how exposed each resource really is.",
    stages: ["Your clouds", "Model the network", "Trace the path", "What you get"],
    inputs: [
      { label: "AWS" },
      { label: "Microsoft Azure" },
      { label: "Google Cloud" },
      { label: "Oracle Cloud" },
      { label: "Alibaba Cloud" },
      { label: "Kubernetes" },
      { label: "Flow log summaries", icon: "Activity", hint: "Where enabled", accent: true },
    ],
    engine: {
      name: "Onam Network Security",
      sub: "Traces the whole path, not one rule",
      steps: [
        "Pull every network object",
        "Build a reachability graph",
        "Trace from the internet",
        "Score effective exposure",
      ],
      footer: "VPCs, subnets, routes, NACLs, groups, WAFs, peerings",
    },
    visual: {
      kind: "chain",
      nodes: [
        { label: "Internet" },
        { label: "Load balancer" },
        { label: "Peered VPC" },
        { label: "Jump host", tone: "warn" },
        { label: "Database", tone: "hot" },
      ],
      edges: ["TLS", "Peering", "SSH open", "One hop"],
      tag: { node: 4, label: "Reachable" },
    },
    visualNote: { text: "Rules look fine; the path does not", color: "#B42318" },
    outputs: [
      {
        id: "exposure",
        icon: "Gauge",
        label: "Effective exposure",
        hint: "A score per resource",
        color: "#DC2626",
      },
      {
        id: "sg",
        icon: "Shield",
        label: "Security group audit",
        hint: "SSH, RDP, DB ports",
        color: "#EA580C",
      },
      {
        id: "subnet",
        icon: "Network",
        label: "Subnet classification",
        hint: "Truly private or public",
        color: "#2563EB",
      },
      {
        id: "lb",
        icon: "Server",
        label: "Load balancer checks",
        hint: "TLS, HTTPS redirect, exposure",
        color: "#7C3AED",
      },
      {
        id: "waf",
        icon: "ShieldCheck",
        label: "WAF coverage map",
        hint: "Where WAFs are missing",
        color: "#059669",
      },
      {
        id: "flow",
        icon: "Activity",
        label: "Flow log gaps",
        hint: "Subnets without flow logs",
        color: "#0891B2",
      },
    ],
    footnote:
      "Onam analyses configuration and does not probe hosts; a network scanner can then be pointed at the reachable surface.",
    caption:
      "How Onam Network Security works: network objects from AWS, Azure, Google Cloud, Oracle Cloud, Alibaba Cloud and Kubernetes, plus flow log summaries where enabled, go into Onam Network Security. It pulls every network object, builds a reachability graph, traces paths from the internet and scores each resource's effective exposure. The example shows a path from the internet through a load balancer and a peered VPC to a jump host with SSH open, one hop from a database. The outputs are an effective exposure score, a security group audit, subnet classification, load balancer checks, a WAF coverage map and flow log gaps.",
  },

  // ai-security: sub, stats (3 clouds, K8s, read-only), mechanism (AI inventory, K8s classifier, AI BOM,
  // AI-native rules, guardrails, data and identity links, prompt text off by default), whatYouGet, faqs (not OCI/Alibaba/IBM).
  "ai-security": {
    heading: "From the AI in your clouds to its risky settings",
    intro:
      "Onam finds the AI in your clouds and on your clusters, checks how each piece is set up, and links it to the data and identity it uses.",
    stages: ["Your AI", "Find every AI piece", "Check its setup", "What you get"],
    inputs: [
      { label: "AWS", hint: "SageMaker and Bedrock" },
      { label: "Microsoft Azure", hint: "Azure OpenAI, Machine Learning" },
      { label: "Google Cloud", hint: "Vertex AI" },
      { label: "Kubernetes", hint: "Self-hosted AI" },
      { label: "Your SBOMs", icon: "Package", hint: "For the AI BOM", accent: true },
    ],
    engine: {
      name: "Onam AI Security",
      sub: "Finds the AI and checks its setup",
      steps: [
        "Inventory AI resources",
        "Build the AI BOM",
        "Run AI-native rules",
        "Join data and identity",
      ],
      footer: "Configuration checks, read-only, no agent",
    },
    visual: {
      kind: "hub",
      center: { label: "AI service", icon: "Cpu" },
      around: [
        { label: "Public endpoint", icon: "Globe", flag: true },
        { label: "No guardrail", icon: "ShieldAlert", flag: true },
        { label: "Data store", icon: "Database" },
        { label: "Execution identity", icon: "KeyRound" },
      ],
    },
    visualNote: { text: "Exposed, unguarded, and reading data", color: "#B42318" },
    outputs: [
      {
        id: "inventory",
        icon: "Boxes",
        label: "AI inventory",
        hint: "Cloud and self-hosted",
        color: "#2563EB",
      },
      {
        id: "bom",
        icon: "Package",
        label: "AI bill of materials",
        hint: "Libraries, servers, MCP SDKs",
        color: "#0891B2",
      },
      {
        id: "guard",
        icon: "ShieldCheck",
        label: "Guardrail presence",
        hint: "Models, deployments, agents",
        color: "#059669",
      },
      {
        id: "exposed",
        icon: "Globe",
        label: "Exposed self-hosted AI",
        hint: "No authentication",
        color: "#DC2626",
      },
      {
        id: "data",
        icon: "Database",
        label: "AI-to-data links",
        hint: "Which stores each reads",
        color: "#D97706",
      },
      {
        id: "agents",
        icon: "Bot",
        label: "AI agents as identities",
        hint: "Admin and wide write",
        color: "#7C3AED",
      },
    ],
    footnote:
      "Covers AWS, Azure, Google Cloud and Kubernetes; not Oracle, Alibaba or IBM Cloud. Prompt-text detection is off by default.",
    caption:
      "How Onam AI Security works: SageMaker and Bedrock on AWS, Azure OpenAI and Azure Machine Learning on Azure, Vertex AI on Google Cloud, self-hosted AI on Kubernetes, and the SBOMs Onam already builds go into Onam AI Security. It inventories AI resources, builds an AI bill of materials, runs AI-native rules and joins each AI service to the data it reads and the identity it runs as, read-only and with no agent. The example shows an AI service with a public endpoint and no guardrail, linked to a data store and an execution identity. The outputs are an AI inventory, an AI bill of materials, guardrail presence, exposed self-hosted AI, AI-to-data links and AI agents as identities.",
  },

  // container-security: sub, painPoint (root pod, service account listing secrets, old image), mechanism
  // (EKS/AKS/GKE/ECS/self-managed, read-only RBAC, image CVEs, pod analysis, attack-path graph), whatYouGet, faqs (partial control-plane checks).
  "container-security": {
    heading: "From cluster state to one prioritised risk",
    intro:
      "Onam reads your clusters and the images they run, checks pods, RBAC and network policy, and joins small issues into one prioritised risk.",
    stages: ["Your clusters", "Check config and images", "Join the risks", "What you get"],
    inputs: [
      { label: "Amazon EKS", icon: "Container" },
      { label: "Azure AKS", icon: "Container" },
      { label: "Google GKE", icon: "Container" },
      { label: "Oracle OKE", icon: "Container" },
      { label: "Self-managed clusters", icon: "Server" },
      { label: "Amazon ECS", icon: "Boxes", hint: "Fargate and EC2" },
      {
        label: "Container registries",
        icon: "Package",
        hint: "Image layers fetched",
        accent: true,
      },
    ],
    engine: {
      name: "Onam Container Security",
      sub: "Reads clusters through read-only RBAC",
      steps: [
        "Check workloads and RBAC",
        "Check network policies",
        "Scan running images",
        "Analyse pod settings",
      ],
      footer: "CIS Kubernetes links where a rule exists",
    },
    visual: {
      kind: "finding",
      title: "Vulnerable image on a running pod",
      start: "Medium",
      context: ["Runs as root", "Service account lists secrets"],
      outcomes: ["One prioritised risk", "On the attack-path graph"],
    },
    visualNote: { text: "Small issues add up to one risk", color: "#B42318" },
    outputs: [
      {
        id: "images",
        icon: "Bug",
        label: "Image vulnerabilities",
        hint: "Base and app layers",
        color: "#DC2626",
      },
      {
        id: "pods",
        icon: "Box",
        label: "Pod security",
        hint: "Privileged, host mounts, root",
        color: "#EA580C",
      },
      {
        id: "sa",
        icon: "KeyRound",
        label: "Service account privilege",
        hint: "Over-scoped accounts",
        color: "#CA8A04",
      },
      {
        id: "netpol",
        icon: "Network",
        label: "Network policy coverage",
        hint: "Across your workloads",
        color: "#0891B2",
      },
      {
        id: "cis",
        icon: "ClipboardCheck",
        label: "CIS benchmark mapping",
        hint: "Workload, RBAC, network controls",
        color: "#7C3AED",
      },
      {
        id: "registry",
        icon: "Package",
        label: "Registry security",
        hint: "Pull policies, image age",
        color: "#2563EB",
      },
    ],
    footnote:
      "Control-plane, etcd and kubelet settings are checked only in part; many CIS controls cannot be read through the Kubernetes API.",
    caption:
      "How Onam Container Security works: EKS, AKS, GKE, OKE and self-managed Kubernetes clusters, Amazon ECS on Fargate and EC2, and the registries their images come from go into Onam Container Security, which reads cluster state through read-only RBAC. It checks workloads, RBAC and network policies, scans the images running workloads use and analyses pod settings. The example shows a vulnerable image on a pod that runs as root with a service account that can list secrets, joined into one prioritised risk on the attack-path graph. The outputs are image vulnerabilities, pod security, service account privilege, network policy coverage, CIS benchmark mapping and registry security.",
  },

  // vulnerability: sub, painPoint (mid-CVSS bug in a public-facing service), mechanism (disk snapshots, SBOMs,
  // NVD + EPSS + KEV, reachability, upgrade version), whatYouGet, faqs (CycloneDX export, SPDX import only).
  vulnerability: {
    heading: "From thousands of CVEs to the ones to fix first",
    intro:
      "Onam matches every package to known CVEs, adds exploit likelihood, CISA KEV status and network reachability, and ranks the queue by what is likely to be exploited.",
    stages: ["Your packages", "Match and enrich", "Rank by exploitability", "What you get"],
    inputs: [
      { label: "Host disk snapshots", icon: "HardDrive", hint: "Taken in your account" },
      { label: "Repository manifests", icon: "GitBranch", hint: "Dependencies per repository" },
      { label: "Container images", icon: "Box", hint: "Image scanning" },
      { label: "Imported SBOMs", icon: "FileText", hint: "CycloneDX or SPDX JSON" },
      {
        label: "Network reachability",
        icon: "Network",
        hint: "Internet and internal identities",
        accent: true,
      },
    ],
    engine: {
      name: "Onam Vulnerability Management",
      sub: "Ranks CVEs by likely exploitation, not CVSS",
      steps: [
        "Build package inventory",
        "Match against NVD",
        "Add EPSS and KEV",
        "Join network reachability",
      ],
      footer: "CVSS, EPSS and reachability, ranked together",
    },
    visual: {
      kind: "finding",
      title: "Mid-CVSS bug in a public-facing service",
      start: "Medium",
      context: ["Likely exploited (EPSS)", "On CISA KEV", "Reachable from internet"],
      outcomes: ["Exact upgrade version", "Affected workloads linked"],
    },
    visualNote: { text: "Context raises a mid-CVSS bug", color: "#B42318" },
    outputs: [
      {
        id: "queue",
        icon: "ListOrdered",
        label: "Priority queue",
        hint: "By real exploitability",
        color: "#DC2626",
      },
      {
        id: "kev",
        icon: "AlertTriangle",
        label: "KEV flags",
        hint: "Exploited in the wild",
        color: "#EA580C",
      },
      {
        id: "reach",
        icon: "Network",
        label: "Reachability correlation",
        hint: "Unreachable CVEs down-ranked",
        color: "#2563EB",
      },
      {
        id: "sbom",
        icon: "Package",
        label: "SBOMs",
        hint: "Per repository and host",
        color: "#0891B2",
      },
      {
        id: "upgrade",
        icon: "Wrench",
        label: "Upgrade guidance",
        hint: "The exact fixing version",
        color: "#059669",
      },
      {
        id: "os",
        icon: "Server",
        label: "OS-level findings",
        hint: "Across your EC2 fleet",
        color: "#7C3AED",
      },
    ],
    footnote:
      "SBOMs export as CycloneDX JSON; SPDX export is not available today, though SPDX JSON can be imported.",
    caption:
      "How Onam Vulnerability Management works: packages from host disk snapshots taken in your own account, dependencies from repository manifests, container images and imported SBOMs go into Onam Vulnerability Management, together with network reachability from the internet and internal identities. It builds a package inventory, matches it against NVD, adds EPSS probability and CISA KEV status and joins reachability. The example shows a mid-CVSS bug in a public-facing service whose severity rises because it is likely to be exploited, is on CISA KEV and is reachable from the internet, ending with the exact upgrade version and the affected workloads. The outputs are a priority queue, KEV flags, reachability correlation, SBOMs, upgrade guidance and OS-level findings across your EC2 fleet.",
  },

  // ai-code-fix: sub, stats (branch, no auto-merge, token never stored), mechanism (severity choice, false
  // positives skipped, per-file LLM pass with rule guidance, fix branch), whatYouGet, faqs (on request, files sent to an LLM, not tested).
  "ai-code-fix": {
    heading: "From a flagged file to a fix on a branch",
    intro:
      "Onam takes the findings from a completed code scan, rewrites each affected file in one pass, and pushes the result to a branch for your team to review.",
    stages: ["Scan results in", "Rewrite each file", "Push for review", "What you get"],
    inputs: [
      { label: "Completed code scan", icon: "ScanSearch", hint: "Static analysis findings" },
      { label: "Severities to include", icon: "ListChecks", hint: "You choose" },
      { label: "Rule guidance", icon: "BookOpen", hint: "Fix and safe example" },
      { label: "Repository", icon: "GitBranch", hint: "Shallow clone over HTTPS" },
      { label: "Git token", icon: "KeyRound", hint: "For this run only", accent: true },
    ],
    engine: {
      name: "Onam AI Code Fix",
      sub: "Rewrites flagged files, one pass each",
      steps: [
        "Skip false positives",
        "Group findings by file",
        "Rewrite the whole file",
        "Push a fix branch",
      ],
      footer: "Nothing merged, nothing deployed",
    },
    visual: {
      kind: "diff",
      file: "config/settings.py",
      lines: [
        { op: " ", text: "import os" },
        { op: "-", text: 'DB_PASSWORD = "changeme"' },
        { op: "+", text: 'DB_PASSWORD = os.environ["DB_PASSWORD"]' },
        { op: " ", text: 'DB_HOST = os.environ["DB_HOST"]' },
      ],
      badge: "Fix on a branch",
    },
    visualNote: { text: "Only the flagged line changes", color: "#047857" },
    outputs: [
      {
        id: "files",
        icon: "FileCode2",
        label: "Corrected files",
        hint: "The full rewritten file",
        color: "#2563EB",
      },
      {
        id: "pass",
        icon: "Layers",
        label: "One pass per file",
        hint: "All its findings together",
        color: "#7C3AED",
      },
      {
        id: "branch",
        icon: "GitBranch",
        label: "A fix branch",
        hint: "Main never written to",
        color: "#059669",
      },
      {
        id: "status",
        icon: "ListChecks",
        label: "Per-finding status",
        hint: "Fixed, failed or skipped",
        color: "#D97706",
      },
      {
        id: "sev",
        icon: "ListOrdered",
        label: "Severity filter",
        hint: "Critical and high first",
        color: "#DC2626",
      },
      {
        id: "token",
        icon: "Lock",
        label: "Token handling",
        hint: "Never stored or logged",
        color: "#0891B2",
      },
    ],
    footnote:
      "Run with you on request today. Affected files go to a large language model, and Onam does not compile or test the fix.",
    caption:
      "How Onam AI Code Fix works: the findings from a completed code scan, the severities you choose, the rule guidance for each finding, the repository and a Git token for this run only go into Onam AI Code Fix. It skips findings marked as false positives, groups findings by file, has a large language model rewrite each whole file in one pass, and pushes the result to a new fix branch. The example shows a hardcoded password replaced with a value read from the environment, on a branch. The outputs are corrected files, one pass per file, a fix branch, per-finding status, a severity filter and a Git token that is never stored or logged. Nothing is merged or deployed.",
  },

  // risk: sub, mechanism (FAIR-style likelihood x loss, EPSS and exposure, records and per-record cost,
  // multipliers, strictest regulation, attack-path signals, low/likely/high), whatYouGet, faqs (estimate, not a prediction; defaults are benchmarks).
  risk: {
    heading: "From critical findings to a dollar loss estimate",
    intro:
      "Onam models each critical and high finding FAIR-style, from inputs you can see and tune, and gives it a low, likely and high dollar figure.",
    stages: ["Your findings", "Model the loss", "Add path context", "What you get"],
    inputs: [
      { label: "Critical and high findings", icon: "ShieldAlert" },
      { label: "EPSS and exposure", icon: "Activity", hint: "How likely a loss is" },
      { label: "Records and breach cost", icon: "Database", hint: "Per-record, by industry" },
      { label: "Sensitivity and asset value", icon: "Layers", hint: "Multipliers you can tune" },
      { label: "Regulations", icon: "Scale", hint: "GDPR, HIPAA, PCI DSS, SOX" },
      {
        label: "Attack-path signals",
        icon: "Route",
        hint: "Paths, choke points, blast radius",
        accent: true,
      },
    ],
    engine: {
      name: "Onam Risk",
      sub: "FAIR-style: likelihood times loss size",
      steps: [
        "Estimate likelihood",
        "Size the loss",
        "Apply the strictest regulation",
        "Raise for attack paths",
      ],
      footer: "Low, likely and high, in dollars",
    },
    visual: {
      kind: "bars",
      title: "Likely exposure by finding",
      rows: [
        { label: "On a choke point", value: 92, tone: "hot" },
        { label: "On an attack path", value: 70, tone: "warn" },
        { label: "Public, sensitive data", value: 48 },
        { label: "Reaches nothing", value: 18 },
      ],
    },
    visualNote: { text: "Attack-path context raises the estimate", color: "#B42318" },
    outputs: [
      {
        id: "loss",
        icon: "DollarSign",
        label: "Loss per finding",
        hint: "Low, likely and high",
        color: "#DC2626",
      },
      {
        id: "total",
        icon: "Calculator",
        label: "Total exposure",
        hint: "Rolled up across findings",
        color: "#7C3AED",
      },
      {
        id: "top",
        icon: "ListOrdered",
        label: "Top scenarios",
        hint: "Ranked by likely exposure",
        color: "#EA580C",
      },
      {
        id: "reg",
        icon: "Scale",
        label: "Regulatory exposure",
        hint: "Estimated fine added",
        color: "#2563EB",
      },
      {
        id: "trend",
        icon: "TrendingUp",
        label: "Exposure by engine",
        hint: "Trended over time",
        color: "#0891B2",
      },
      {
        id: "tune",
        icon: "Wrench",
        label: "Tunable inputs",
        hint: "Your own figures, optional",
        color: "#059669",
      },
    ],
    footnote:
      "Defaults are industry benchmarks. Each figure is an estimate for prioritisation and board reporting, not a prediction of a breach's cost.",
    caption:
      "How Onam Risk works: each critical and high finding goes into Onam Risk with its exploit probability and exposure, the records at risk and a per-record breach cost for your industry, data-sensitivity and asset-value multipliers, the regulations that apply, and attack-path signals such as paths, choke points and blast radius. It estimates likelihood, sizes the loss, applies the single strictest regulatory multiplier and raises the estimate for findings on attack paths. The example bars show findings on a choke point or attack path getting higher estimates than one that reaches nothing. The outputs are a low, likely and high loss per finding, total exposure, top scenarios, regulatory exposure, exposure by engine over time and tunable inputs.",
  },

  // compliance: sub, mechanism (144 frameworks: 119 automated, 25 attestation-only; control status; 0–100% score;
  // evidence per control; drill-down; exports; exceptions), whatYouGet, chips (framework names).
  compliance: {
    heading: "From findings to a current score per framework",
    intro:
      "Onam maps posture, threat, vulnerability and technology findings to framework controls, collects evidence per control, and recomputes each framework's score from the latest findings.",
    stages: ["Your findings", "Map to controls", "Score and collect evidence", "What you get"],
    inputs: [
      { label: "Posture findings", icon: "ShieldCheck" },
      { label: "Threat-detection findings", icon: "Radar" },
      { label: "Vulnerability findings", icon: "Bug" },
      { label: "Technology findings", icon: "Server" },
      {
        label: "Your own evidence",
        icon: "ClipboardList",
        hint: "For attestation-only frameworks",
        accent: true,
      },
    ],
    engine: {
      name: "Onam Compliance",
      sub: "Maps findings to the controls they affect",
      steps: [
        "Map findings to controls",
        "Assess each control",
        "Collect evidence per control",
        "Score each framework",
      ],
      footer: "Recomputed from the latest findings",
    },
    visual: {
      kind: "bars",
      title: "Score per framework",
      rows: [
        { label: "CIS AWS", value: 84 },
        { label: "SOC 2", value: 76 },
        { label: "ISO 27001", value: 68 },
        { label: "PCI DSS", value: 57, tone: "warn" },
        { label: "HIPAA", value: 43, tone: "hot" },
      ],
    },
    visualNote: { text: "Scores show where you stand today", color: "#047857" },
    outputs: [
      {
        id: "score",
        icon: "Gauge",
        label: "Framework scores",
        hint: "0–100%, with a trend",
        color: "#059669",
      },
      {
        id: "status",
        icon: "CheckSquare",
        label: "Control status",
        hint: "Pass, fail, partial, manual",
        color: "#2563EB",
      },
      {
        id: "evidence",
        icon: "FileCheck2",
        label: "Evidence per control",
        hint: "Resources, results, timestamps",
        color: "#7C3AED",
      },
      {
        id: "drill",
        icon: "Search",
        label: "Drill-down",
        hint: "Framework, control, resource",
        color: "#0891B2",
      },
      {
        id: "reports",
        icon: "Download",
        label: "Exportable reports",
        hint: "PDF, CSV, Excel, JSON",
        color: "#D97706",
      },
      {
        id: "exceptions",
        icon: "Clock",
        label: "Exceptions",
        hint: "Justification, approver, expiry",
        color: "#DC2626",
      },
    ],
    footnote:
      "144 compliance frameworks: 119 with automated checks, 25 attestation-only. Onam gives evidence for an audit; it does not certify.",
    caption:
      "How Onam Compliance works: posture, threat-detection, vulnerability and technology findings, plus your own evidence for attestation-only frameworks, go into Onam Compliance. It maps findings to the controls they affect across 144 compliance frameworks, 119 with automated checks and 25 attestation-only, assesses each control, collects evidence per control and scores each framework from the latest findings. The example bars show scores for CIS AWS, SOC 2, ISO 27001, PCI DSS and HIPAA. The outputs are a 0 to 100% score per framework with a trend, control status, evidence per control, drill-down from framework to control to resource, PDF, CSV, Excel and JSON reports, and exceptions with justification and expiry. Onam gives evidence for an audit; it does not certify.",
  },
};
