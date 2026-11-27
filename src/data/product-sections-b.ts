import type { ProductSections } from "./product-sections.types";
import {
  AlertTriangle, BarChart3, BookOpenText, Boxes, Calculator, CalendarCheck, ClipboardCheck,
  ClipboardList, Clock, Cloud, Database, DollarSign, Download, Eye, FileCheck, FileCheck2,
  GitBranch, GitCompareArrows, GitPullRequest, Globe, Gauge, HardDrive, History, KeyRound, Layers,
  ListChecks, Lock, LockOpen, MessageSquare, Network, Package, Plug, Quote, Radar, RotateCcw, Route,
  Scale, ScanLine, ScanSearch, ScrollText, Search, Share2, Shield, ShieldAlert, ShieldCheck,
  TrendingUp, Users, Wand2, Workflow, Wrench, BadgeCheck,
} from "@/components/site/icons";

export const sectionsB: Record<string, ProductSections> = {
  risk: {
    stepsHeading: "From a finding to a dollar estimate",
    steps: [
      {
        title: "Model each serious finding",
        body: "Each critical and high finding is modelled FAIR-style: how likely a loss event is, times how large the loss would be.",
        proof: "FAIR-style model",
        icon: ListChecks,
      },
      {
        title: "Estimate how likely loss is",
        body: "Likelihood starts from the exploit probability (EPSS) and how exposed the resource is. A public resource counts for more than an internal one.",
        proof: "EPSS · resource exposure",
        icon: Gauge,
      },
      {
        title: "Size the potential loss",
        body: "Records at risk times your industry's per-record breach cost, scaled for data sensitivity and asset value. Regulated data adds the strictest multiplier and an estimated fine.",
        proof: "GDPR · HIPAA · PCI DSS · SOX",
        icon: DollarSign,
      },
      {
        title: "Raise it for attack paths",
        body: "A finding on an attack path, a choke point or many paths, or on a resource an active threat actor touches, gets a higher likelihood.",
        proof: "Blast radius raises it further",
        icon: Route,
      },
      {
        title: "Report low, likely and high",
        body: "Each finding gets a low, likely and high dollar figure, rolled up into total exposure, top scenarios, a breakdown by engine and a trend.",
        icon: BarChart3,
      },
    ],
    outcomesHeading: "Loss figures your board can weigh",
    outcomes: [
      {
        title: "A dollar range per finding",
        body: "A FAIR-style loss estimate for every critical and high finding, given as a low, likely and high figure.",
        icon: DollarSign,
        chips: ["Critical", "High", "FAIR-style model"],
      },
      {
        title: "Regulatory exposure, priced in",
        body: "Findings on regulated data carry the single strictest regulatory multiplier, never stacked, and an estimated fine.",
        icon: Scale,
        chips: ["GDPR", "HIPAA", "PCI DSS", "SOX"],
      },
      {
        title: "Attack-path context in the estimate",
        body: "Findings on attack paths and choke points get higher estimates than the same finding on a resource that reaches nothing.",
        icon: Route,
        chips: ["Attack-path signals", "Blast radius"],
      },
      {
        title: "Top scenarios, ranked by exposure",
        body: "Total exposure, the top scenarios ranked by likely exposure, a breakdown by engine and the trend over time.",
        icon: TrendingUp,
      },
      {
        title: "Inputs you can see and tune",
        body: "Per-record cost, revenue and sensitivity multipliers are set per tenant. Industry defaults apply until you replace them.",
        icon: Calculator,
        chips: ["EPSS", "Asset-value multipliers", "Data sensitivity"],
      },
    ],
  },

  compliance: {
    stepsHeading: "From live findings to an auditor's report",
    steps: [
      {
        title: "Map findings to controls",
        body: "Posture, threat-detection, vulnerability and technology findings are mapped to the controls they affect, across CIS benchmarks, NIST, ISO 27001:2022, PCI DSS, SOC 2 and more.",
        proof: "144 compliance frameworks",
        icon: Layers,
      },
      {
        title: "Separate automated from attested",
        body: "Of the 144 frameworks, 119 have automated checks (at least one working Onam check linked, not every control automated). The other 25 are attestation-only, no scan claim.",
        proof: "119 with automated checks",
        icon: ListChecks,
      },
      {
        title: "Score each framework continuously",
        body: "Each control is assessed as pass, fail, partial, manual review or not applicable. Each framework gets a 0–100% score, recomputed from the latest findings and trended.",
        proof: "0–100% score per framework",
        icon: Gauge,
      },
      {
        title: "Collect evidence per control",
        body: "Each control keeps the resources evaluated, their results and timestamps, and drills down from framework to control to resource. Nobody assembles screenshots.",
        icon: FileCheck,
      },
      {
        title: "Export reports for auditors",
        body: "Reports export as PDF and CSV, with Excel and JSON too, including an executive summary and a report per framework.",
        proof: "PDF · CSV · Excel · JSON",
        icon: Download,
      },
    ],
    outcomesHeading: "What you bring to the next audit",
    outcomes: [
      {
        title: "Know which frameworks are automated",
        body: "144 frameworks mapped: 119 with automated checks, and 25 attestation-only where Onam tracks status, owners and evidence.",
        icon: ShieldCheck,
        chips: ["CIS AWS", "NIST 800-53", "ISO 27001:2022", "PCI DSS", "SOC 2", "FedRAMP"],
      },
      {
        title: "A score that reflects today",
        body: "A continuous 0–100% score per framework, recomputed from the latest findings and kept as a trend.",
        icon: Gauge,
      },
      {
        title: "Evidence without screenshots",
        body: "Evidence per control, with the resources, their results and timestamps, collected from the same scans that produce your findings.",
        icon: FileCheck2,
      },
      {
        title: "Drill from framework to resource",
        body: "Every framework drills down from framework to control to resource, so a failing control leads to the resources behind it.",
        icon: Search,
      },
      {
        title: "Reports ready to hand over",
        body: "PDF and CSV export, plus Excel and JSON, with an executive summary and per-framework detail down to controls and resources.",
        icon: Download,
        chips: ["PDF", "CSV", "Excel", "JSON"],
      },
      {
        title: "Exceptions that stay on record",
        body: "Exceptions and compensating controls keep a justification, approver and target date, and are flagged as their expiry nears.",
        icon: CalendarCheck,
      },
    ],
  },

  technology: {
    stepsHeading: "From registered technology to a ranked finding",
    steps: [
      {
        title: "Connect to each technology",
        body: "Onam connects over SQL, SSH or the product's own API, with credentials in a secrets store. Hosts the engine cannot reach run a small scan agent.",
        proof: "SQL · SSH · product API",
        icon: Plug,
      },
      {
        title: "Identify what is running",
        body: "The engine identifies the technology running on each workload and evaluates it against the CIS benchmark for that specific product.",
        proof: "34 CIS technology benchmarks",
        icon: ScanSearch,
      },
      {
        title: "Check versions, defaults, end-of-life",
        body: "Version-specific security rules check each detected technology for defaults, hardening and end-of-life status.",
        proof: "8,991 technology control rows",
        icon: ListChecks,
      },
      {
        title: "Rank by reachability and identity",
        body: "Findings join the identity, network and vulnerability graph, so an end-of-life database that is internet-reachable ranks appropriately.",
        icon: Network,
      },
      {
        title: "Add products by benchmark pack",
        body: "Each benchmark is written for a named product, so adding a technology means adding its benchmark pack, not writing rules from scratch.",
        icon: Package,
      },
    ],
    outcomesHeading: "What is really running, and how hardened",
    outcomes: [
      {
        title: "An inventory of what actually runs",
        body: "Product, version and operating system on each connected host, recorded from what is running rather than what the CMDB says.",
        icon: Boxes,
        chips: ["Databases", "Operating systems", "Web servers", "Container runtimes", "Network appliances", "SaaS platforms"],
      },
      {
        title: "Outdated and end-of-life versions flagged",
        body: "Version currency analysis and end-of-life detection for each detected technology.",
        icon: Clock,
      },
      {
        title: "Defaults held to product benchmarks",
        body: "Default configuration checks for databases, web servers and frameworks, across 34 CIS benchmarks and 8,991 control rows.",
        icon: ShieldCheck,
        chips: ["PostgreSQL", "Nginx", "RHEL", "Docker", "Cisco IOS XE", "VMware ESXi"],
      },
      {
        title: "Shadow IT made visible",
        body: "Products and versions that appear in no inventory stand out in the discovery list.",
        icon: Eye,
      },
      {
        title: "Technology risk, ranked in context",
        body: "Technology risk scoring joined to the graph, so internet reachability and identity shape where each finding ranks.",
        icon: TrendingUp,
      },
    ],
  },

  "saas-security": {
    stepsHeading: "From a read-only connector to one queue",
    steps: [
      {
        title: "Connect each platform read-only",
        body: "Each SaaS platform connects through a dedicated read-only connector on its official API, such as Microsoft Graph with OAuth 2.0 or Snowflake private-key JWT.",
        proof: "Microsoft Graph · Admin SDK · app tokens",
        icon: Plug,
      },
      {
        title: "Discover tenants, users and sharing",
        body: "Discovery enumerates tenants, users, admin roles, sharing settings, audit-log configuration and data-exposure surfaces, without any agent or browser extension.",
        icon: ScanSearch,
      },
      {
        title: "Evaluate against CIS rules",
        body: "Findings are evaluated against CIS rules for Microsoft 365, GitLab, Google Workspace, Snowflake, SharePoint and Dynamics 365.",
        proof: "433 CIS rules",
        icon: ListChecks,
      },
      {
        title: "Land in one findings queue",
        body: "SaaS findings write into the same findings model as cloud findings, so SaaS and cloud identity risks share one queue.",
        icon: Layers,
      },
      {
        title: "Trace federation into the cloud",
        body: "An Okta or Entra ID account that federates into AWS is traced through to the cloud permissions it unlocks on the attack-path graph.",
        icon: Route,
      },
    ],
    outcomesHeading: "Who can reach your SaaS data, and how",
    outcomes: [
      {
        title: "Every SaaS identity in one list",
        body: "Users, admins, guests and service accounts across connected platforms, with stale and orphaned identities reported.",
        icon: Users,
        chips: ["Microsoft 365", "Google Workspace", "GitHub", "Snowflake", "Okta"],
      },
      {
        title: "Privileged accounts without MFA found",
        body: "MFA and conditional-access gaps on privileged SaaS accounts, such as a Microsoft 365 global admin without MFA.",
        icon: KeyRound,
      },
      {
        title: "Links open to anyone surfaced",
        body: "External sharing exposure: SharePoint, OneDrive and Google Drive links open to anyone.",
        icon: Share2,
        chips: ["SharePoint", "OneDrive", "Google Drive"],
      },
      {
        title: "Audit-log gaps caught",
        body: "Audit-log configuration checks, including the Microsoft 365 Unified Audit Log, Google Workspace retention and Snowflake QUERY_HISTORY.",
        icon: ScrollText,
      },
      {
        title: "DevOps and warehouse posture covered",
        body: "Branch protection and token hygiene in GitHub, GitLab and Bitbucket Cloud; roles, network policies and grant sprawl in Snowflake.",
        icon: GitBranch,
        chips: ["GitHub", "GitLab", "Bitbucket Cloud", "Snowflake"],
      },
      {
        title: "CIS scores with per-control evidence",
        body: "CIS scoring with per-control evidence for the six benchmarked platforms. GitHub, Bitbucket Cloud and Okta have posture checks, no CIS pack yet.",
        icon: ClipboardCheck,
      },
    ],
  },

  cwpp: {
    stepsHeading: "From discovery to a workload posture score",
    steps: [
      {
        title: "Discover every compute workload",
        body: "VMs, containers, serverless functions and managed hosts are inventoried across the seven supported clouds through read-only APIs.",
        proof: "VMs · containers · serverless · hosts",
        icon: ScanSearch,
      },
      {
        title: "Snapshot and scan out-of-band",
        body: "The agentless scanner takes point-in-time volume snapshots inside your own account and analyses them out-of-band, so no software runs on the workload itself.",
        icon: Radar,
      },
      {
        title: "Evaluate posture and OS hardening",
        body: "Each workload is checked against the compute and workload rule set, plus CIS benchmarks for Ubuntu, RHEL, SUSE, Debian and CentOS.",
        proof: "219 dedicated posture rules",
        icon: ListChecks,
      },
      {
        title: "Join vulnerability and host data",
        body: "Vulnerability, container image and host signal data join the same workload record, so configuration, packages and exposure show in one view.",
        icon: Layers,
      },
      {
        title: "Roll up into CWPP score",
        body: "Workload health rolls up into a single CWPP pillar score that trends over time and feeds the unified CNAPP score.",
        icon: Gauge,
      },
    ],
    outcomesHeading: "What you see inside each workload",
    outcomes: [
      {
        title: "Every workload in one list",
        body: "VMs, containers, serverless functions and hosts in one inventory, each with a posture score and severity-ranked findings.",
        icon: Boxes,
      },
      {
        title: "OS hardening measured against CIS",
        body: "Hardening results against CIS benchmarks for five Linux distributions.",
        icon: ShieldCheck,
        chips: ["Ubuntu", "RHEL", "SUSE", "Debian", "CentOS"],
      },
      {
        title: "Real package and vulnerability inventory",
        body: "Package and vulnerability inventory collected from snapshots, without agents on the workload.",
        icon: Package,
      },
      {
        title: "Privileged and exposed workloads flagged",
        body: "Privileged and root-running workloads detected, and the workloads that are internet-reachable called out.",
        icon: ShieldAlert,
      },
      {
        title: "Serverless functions checked too",
        body: "Serverless posture: runtime versions, execution roles and environment secrets.",
        icon: Cloud,
        chips: ["Lambda", "Azure Functions"],
      },
      {
        title: "A trended CWPP pillar score",
        body: "The CWPP pillar score trends over time and feeds the platform-wide CNAPP score.",
        icon: TrendingUp,
      },
    ],
  },

  agentless: {
    stepsHeading: "From snapshot to findings, inside your account",
    steps: [
      {
        title: "Enumerate attached volumes",
        body: "Onam assumes a read-only role and enumerates the volumes attached to every workload across your accounts.",
        icon: Search,
      },
      {
        title: "Snapshot and scan in-account",
        body: "A snapshot is analysed by a short-lived scan worker inside your own account, orchestrated by the cloud's native workflow service.",
        proof: "Step Functions · Logic Apps · Workflows",
        icon: ScanLine,
      },
      {
        title: "Return findings, not disk contents",
        body: "Results are relayed through a storage bucket in your account. Raw disk contents are never transferred to Onam; only structured findings leave your environment.",
        icon: Lock,
      },
      {
        title: "Throttle to protect production",
        body: "A capacity manager per cloud throttles concurrent snapshots, so scanning never competes with production for quota or IOPS.",
        icon: Gauge,
      },
      {
        title: "Delete snapshots, sweep orphans",
        body: "Snapshots are deleted once analysis completes, and a reconciler sweeps orphaned artefacts so nothing is left behind or billed.",
        icon: RotateCcw,
      },
    ],
    outcomesHeading: "Workload coverage without an agent rollout",
    outcomes: [
      {
        title: "Coverage without an agent rollout",
        body: "Every volume the read-only role can see can be scanned, with no agent, daemon or kernel module on the workload.",
        icon: Radar,
        chips: ["AWS", "Azure", "GCP", "OCI", "IBM Cloud", "Alibaba Cloud"],
      },
      {
        title: "Installed software and its vulnerabilities",
        body: "Package and OS inventory from every scanned volume, with vulnerabilities detected against the software actually installed.",
        icon: Package,
      },
      {
        title: "Host configuration and secrets on disk",
        body: "Users, keys, services and hardening state for each host, plus secrets and credentials found on disk.",
        icon: KeyRound,
      },
      {
        title: "Raw disk data stays with you",
        body: "Onam receives structured findings such as package lists and configuration signals, never raw disk images or file contents.",
        icon: Lock,
      },
      {
        title: "Clean-up and quota controls built in",
        body: "Automatic snapshot cleanup with orphan reconciliation, and per-cloud capacity controls so scanning respects your quotas.",
        icon: Shield,
      },
    ],
  },

  "api-security": {
    stepsHeading: "From gateway configuration to a fix step",
    steps: [
      {
        title: "Read API gateway inventory",
        body: "Onam reads API gateways, stages, keys and ingress routes from the cloud inventory it already collects through read-only roles. It does not sit in your traffic.",
        proof: "API Gateway · API Management · Apigee",
        icon: Cloud,
      },
      {
        title: "Apply API posture rules",
        body: "Rules check authentication and authorisers, rate, burst and quota limits, request validation, access logging and tracing, private networking and Lambda function URLs.",
        proof: "241 application and API rules",
        icon: ListChecks,
      },
      {
        title: "Check AWS gateways in context",
        body: "A public stage with no authoriser, throttling or WAF; API keys older than 90 days; backends that reach private IPs or metadata endpoints; missing mutual TLS.",
        icon: ScanSearch,
      },
      {
        title: "Cover the other clouds",
        body: "Azure API Management, Apigee, OCI, Alibaba Cloud and Kubernetes ingresses and gateways are checked for gaps such as missing auth, rate limiting or TLS.",
        icon: Globe,
      },
      {
        title: "Name the resource and fix",
        body: "Each finding names the API resource, a severity and a remediation step. Depth varies by cloud; AWS API Gateway has the widest checks today.",
        icon: Wrench,
      },
    ],
    outcomesHeading: "Which APIs are open, unthrottled or unlogged",
    outcomes: [
      {
        title: "Every gateway-managed API, inventoried",
        body: "APIs defined in a gateway or ingress in a connected account are inventoried, whether or not anyone documented them.",
        icon: Boxes,
        chips: ["AWS", "Azure", "GCP", "OCI", "Alibaba Cloud", "Kubernetes"],
      },
      {
        title: "Unauthenticated public endpoints found",
        body: "Public endpoints with no authentication or authoriser, each listed with a severity and a remediation step.",
        icon: LockOpen,
      },
      {
        title: "Throttling and WAF gaps surfaced",
        body: "Missing rate limits, burst limits and quotas, and WAF coverage gaps on AWS API Gateway stages and Azure API Management.",
        icon: Shield,
        chips: ["Rate limiting", "WAF"],
      },
      {
        title: "TLS and logging gaps visible",
        body: "TLS, HTTPS-only and mutual TLS gaps, plus access logging and tracing coverage.",
        icon: Lock,
        chips: ["Mutual TLS"],
      },
      {
        title: "Stale keys and forgotten APIs flagged",
        body: "Ageing API keys, backends that reach private addresses or metadata endpoints, and legacy, beta or test APIs still live.",
        icon: History,
      },
    ],
  },

  "database-security": {
    stepsHeading: "From discovery to a per-database posture score",
    steps: [
      {
        title: "Discover every database",
        body: "Managed and self-hosted databases are discovered across AWS, Azure, GCP, OCI, IBM Cloud, Alibaba and Kubernetes through read-only APIs.",
        proof: "RDS · Aurora · Cloud SQL · DynamoDB",
        icon: ScanSearch,
      },
      {
        title: "Check cloud-level posture",
        body: "Encryption at rest and in transit, public accessibility, backup retention, deletion protection and audit configuration are evaluated for each database.",
        proof: "310 storage and database rules",
        icon: ListChecks,
      },
      {
        title: "Check engine hardening",
        body: "CIS benchmarks check the database software: PostgreSQL, MySQL, MariaDB, MSSQL, Oracle, IBM Db2, MongoDB and Cassandra. This uses an optional read-only database account.",
        icon: Database,
      },
      {
        title: "Raise risk for sensitive data",
        body: "Findings join the labels DSPM assigns, so a public or unencrypted database labelled as holding PII is raised to critical.",
        icon: AlertTriangle,
      },
      {
        title: "Score six posture domains",
        body: "Each database is scored across access control, encryption, network, audit logging, backup and recovery, and configuration, so the weakest area stands out.",
        icon: Gauge,
      },
    ],
    outcomesHeading: "Which databases are exposed, unencrypted or unaudited",
    outcomes: [
      {
        title: "Every database in one inventory",
        body: "Managed services and self-hosted engines in one database inventory.",
        icon: Database,
        chips: ["RDS", "Aurora", "Azure SQL", "Cloud SQL", "DynamoDB", "Redshift"],
      },
      {
        title: "Encryption and exposure per instance",
        body: "Encryption coverage at rest and in transit per instance, plus public accessibility and network exposure detection.",
        icon: Lock,
      },
      {
        title: "Shared snapshots and weak backups caught",
        body: "Snapshots shared outside your account, plus backup retention and point-in-time recovery checks.",
        icon: HardDrive,
      },
      {
        title: "Audit logging and privileged grants reviewed",
        body: "Audit logging checked against CIS engine benchmarks, and privileged database accounts and grants reviewed.",
        icon: ScrollText,
      },
      {
        title: "Regulated data ranked first",
        body: "Databases holding regulated data rank first, using the labels DSPM assigns.",
        icon: TrendingUp,
        chips: ["PII", "Critical"],
      },
    ],
  },

  encryption: {
    stepsHeading: "From key inventory to who can decrypt",
    steps: [
      {
        title: "Discover keys, secrets and certificates",
        body: "Every key, vault, secret and certificate is discovered across AWS KMS, Azure Key Vault, GCP Cloud KMS, OCI Vault and their equivalents.",
        proof: "KMS · Key Vault · OCI Vault",
        icon: ScanSearch,
      },
      {
        title: "Map encryption coverage",
        body: "A coverage analyzer sorts each resource into unencrypted, encrypted with provider-managed keys, or encrypted with customer-managed keys.",
        icon: Layers,
      },
      {
        title: "Parse key policies and reach",
        body: "Key policies are parsed for wildcard principals, other accounts and grants. Each key is mapped to the resources that depend on it.",
        icon: KeyRound,
      },
      {
        title: "Check rotation and certificate expiry",
        body: "Certificate expiry is tracked with lead-time alerts, and rotation state, deletion protection and key-material origin are checked against CIS, NIST and PCI-DSS controls.",
        proof: "502 secrets and key-management rules",
        icon: CalendarCheck,
      },
      {
        title: "Weigh sensitivity, catch drift",
        body: "DSPM labels raise sensitive data on an unencrypted store to critical. Encryption removed, rotation switched off or a key scheduled for deletion is caught as drift.",
        icon: GitCompareArrows,
      },
    ],
    outcomesHeading: "Whether data is encrypted, and who can decrypt",
    outcomes: [
      {
        title: "Coverage beyond the encrypted checkbox",
        body: "Each resource reported as unencrypted, provider-managed or customer-managed, so one 'encrypted' flag no longer hides the difference.",
        icon: Layers,
      },
      {
        title: "Who each key lets in",
        body: "Wildcard principals, other accounts and grants on every key, plus the resources that depend on each key.",
        icon: KeyRound,
      },
      {
        title: "Sensitive data on weak keys flagged",
        body: "DSPM-labelled stores that are unencrypted or on provider-managed keys, raised to critical and high.",
        icon: ShieldAlert,
        chips: ["Critical", "High"],
      },
      {
        title: "Drift caught between scans",
        body: "Encryption removed, rotation disabled or a key scheduled for deletion since the last scan.",
        icon: GitCompareArrows,
      },
      {
        title: "Rotation, certificates and TLS in view",
        body: "Overdue rotation alerts, certificate expiry warnings, secrets manager posture, and TLS policy gaps on endpoints and load balancers.",
        icon: CalendarCheck,
      },
      {
        title: "Encryption controls mapped to frameworks",
        body: "Framework mapping for encryption controls across CIS, NIST 800-53 and PCI-DSS v4.",
        icon: ClipboardCheck,
        chips: ["CIS", "NIST 800-53", "PCI-DSS v4"],
      },
    ],
  },

  "ai-assistant": {
    stepsHeading: "From a plain question to a cited answer",
    steps: [
      {
        title: "Route the question",
        body: "An orchestrator interprets your question and routes it to the domain specialists that can answer it, often several at once.",
        proof: "Thirteen domain specialists",
        icon: Workflow,
      },
      {
        title: "Query your live findings",
        body: "Each specialist queries your live findings through the same APIs the console uses, scoped to your tenant and your permissions.",
        icon: Search,
      },
      {
        title: "Cite every claim",
        body: "Answers cite the findings they were derived from, so each claim links to the specific resource, rule and severity behind it.",
        icon: Quote,
      },
      {
        title: "Combine across domains",
        body: "Cross-domain questions are composed from several specialists. An exposure question joins network, data and identity results into one answer.",
        icon: Network,
      },
      {
        title: "Propose, never change silently",
        body: "The assistant reads; it does not change your cloud. Remediation is proposed as a reviewable action, never executed silently.",
        icon: ShieldCheck,
      },
    ],
    outcomesHeading: "Answers from your findings, not guesses",
    outcomes: [
      {
        title: "Ask in plain language",
        body: "Natural-language questions across every engine's findings, without knowing which console to open or which filters to combine.",
        icon: MessageSquare,
      },
      {
        title: "Answers you can check",
        body: "Every claim links to the underlying finding. Where the data does not support an answer, the assistant says so.",
        icon: BadgeCheck,
      },
      {
        title: "A specialist for each domain",
        body: "Thirteen domain specialists, with cross-domain questions answered in a single question.",
        icon: Users,
        chips: ["IAM", "Compliance", "Encryption", "Network", "CDR", "Vulnerability"],
      },
      {
        title: "Scoped to what you see",
        body: "Tenant-scoped and permission-scoped: the assistant sees only what you can see. Your findings are not used as training data.",
        icon: Lock,
      },
      {
        title: "Attack paths explained plainly",
        body: "Attack paths explained in plain language, with remediation guidance drawn from the finding's own remediation record.",
        icon: Route,
      },
      {
        title: "Read-only by design",
        body: "No silent changes to your environment. Applying a fix goes through the normal remediation workflow with human approval.",
        icon: ShieldCheck,
      },
    ],
  },

  remediation: {
    stepsHeading: "From a finding to a reviewed fix",
    steps: [
      {
        title: "Attach fix guidance",
        body: "Every posture rule carries written remediation guidance, so each finding arrives with its own steps to fix it.",
        icon: BookOpenText,
      },
      {
        title: "Draft the change with AI",
        body: "Each finding carries an AI fix prompt naming the resource and your cloud's tooling. Paste it into an assistant to draft the change, then review before applying.",
        proof: "CLI · Terraform · console steps",
        icon: Wand2,
      },
      {
        title: "Push code fixes to branches",
        body: "For SAST findings in source code, AI Code Fix rewrites the affected file and pushes it to a separate fix branch for your team to review and merge.",
        proof: "Nothing merges itself",
        icon: GitBranch,
      },
      {
        title: "Name the fixed version",
        body: "Vulnerable dependencies show the fixed version from the advisory where one exists, so the upgrade is named rather than left to research.",
        icon: Package,
      },
      {
        title: "Tell the attack-path story",
        body: "Attack paths open as a step-by-step story, with each hop's MITRE ATT&CK technique and remediation step.",
        icon: Route,
      },
    ],
    outcomesHeading: "Findings that turn into reviewed changes",
    outcomes: [
      {
        title: "A fix ready on every finding",
        body: "Remediation guidance per rule, plus an AI fix prompt for CLI, Terraform or console steps that you review before applying.",
        icon: Wrench,
        chips: ["CLI", "Terraform", "Console steps"],
      },
      {
        title: "Code fixes as reviewable branches",
        body: "Fix branches for SAST findings in source code; your normal review and CI process applies before anything merges.",
        icon: GitPullRequest,
      },
      {
        title: "The exact upgrade to make",
        body: "Fixed versions from the advisory for vulnerable dependencies, where one exists.",
        icon: Package,
      },
      {
        title: "Accepted risk with a record",
        body: "Suppress one finding or a whole rule, with the reason, author and expiry kept.",
        icon: ClipboardList,
      },
      {
        title: "Work routed to your tools",
        body: "Tickets in Jira or ServiceNow; alerts to Slack, PagerDuty, email or webhook.",
        icon: Share2,
        chips: ["Jira", "ServiceNow", "Slack", "PagerDuty", "Email", "Webhook"],
      },
      {
        title: "Fixes verified on the next scan",
        body: "The next scan re-evaluates the resource against the same rule, so findings close on evidence, not on a ticket marked done.",
        icon: RotateCcw,
      },
    ],
  },

  inventory: {
    stepsHeading: "From read-only enumeration to a resource graph",
    steps: [
      {
        title: "Enumerate every resource",
        body: "Discovery enumerates resources across AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud and Kubernetes using read-only credentials.",
        proof: "672 services, seven clouds",
        icon: ScanSearch,
      },
      {
        title: "Normalise into one model",
        body: "Each resource is normalised into a shared model, so an AWS security group and an Azure network security group are comparable objects.",
        icon: Layers,
      },
      {
        title: "Map the relationships",
        body: "Which instance sits in which subnet, which role a function assumes, which volume is attached where. Together they form the graph attack-path analysis walks.",
        icon: Network,
      },
      {
        title: "Refresh on every scan",
        body: "Discovery runs on every scan, so new resources appear at the next scan and deleted ones are retired rather than lingering.",
        icon: RotateCcw,
      },
      {
        title: "Feed every other engine",
        body: "Every other engine reads from this inventory, so a resource cannot be evaluated by one engine and invisible to another.",
        icon: Share2,
      },
    ],
    outcomesHeading: "One list of what runs across seven clouds",
    outcomes: [
      {
        title: "One inventory across seven clouds",
        body: "Resources across seven clouds and 672 services in one view, with multi-account and multi-subscription rollup.",
        icon: Boxes,
      },
      {
        title: "Resources compared like for like",
        body: "A normalised resource model makes objects comparable across providers rather than two vendor formats.",
        icon: GitCompareArrows,
      },
      {
        title: "The graph attack paths use",
        body: "A relationship graph: the dependency map attack paths are computed on.",
        icon: Network,
      },
      {
        title: "Orphaned and unowned resources surfaced",
        body: "Reports on untagged, unowned and orphaned resources.",
        icon: Search,
      },
      {
        title: "A history of what changed",
        body: "Resource history shows what changed and when, refreshed on every scan.",
        icon: History,
      },
      {
        title: "Know what is being scanned",
        body: "Coverage reporting shows which accounts and regions are being scanned.",
        icon: Radar,
      },
    ],
  },

  cnapp: {
    stepsHeading: "From seven pillars to one posture score",
    steps: [
      {
        title: "Score seven pillars",
        body: "Posture, threat detection with IAM posture, workloads, data, network, threat and code are each scored on a common 0–100 scale.",
        proof: "CSPM · CDR · CWPP · DSPM · AppSec",
        icon: Layers,
      },
      {
        title: "Score each from its engine",
        body: "Each pillar's score comes from its own engine. For posture, it is the share of checks that pass.",
        icon: Gauge,
      },
      {
        title: "Combine with fixed weights",
        body: "Pillars combine with fixed weights into one score with a risk band. A pillar with no data is left out and the remaining weights rebalance.",
        proof: "Low · medium · high · critical",
        icon: Scale,
      },
      {
        title: "Store the trend",
        body: "Each overall score is stored, so the trend over time shows whether posture is improving.",
        icon: TrendingUp,
      },
      {
        title: "Raise severity with context",
        body: "Every engine's findings share one model. Severity rises on an internet-exposed attack path, a high-value asset, a likely-exploited CVE or active threat-actor activity.",
        proof: "Fix-by date per finding",
        icon: AlertTriangle,
      },
    ],
    outcomesHeading: "One number a board reads, an engineer drills",
    outcomes: [
      {
        title: "One score, trended over time",
        body: "One posture score with a risk band, stored each time so you can see whether posture is improving.",
        icon: Gauge,
        chips: ["Low", "Medium", "High", "Critical"],
      },
      {
        title: "Seven pillar scores side by side",
        body: "Separate scores for posture, threat detection and IAM, workloads, data, network, threat and code.",
        icon: Layers,
        chips: ["CSPM", "CDR", "CWPP", "DSPM", "AppSec"],
      },
      {
        title: "Weights that stay predictable",
        body: "Fixed pillar weights, rebalanced when a pillar has no data, so the score stays on the same 0–100 scale.",
        icon: Scale,
      },
      {
        title: "Drill from pillar to finding",
        body: "Every pillar drills down to the findings behind it, so a score movement can be traced to its cause.",
        icon: Search,
      },
      {
        title: "Context-raised severity and fix-by dates",
        body: "Findings rise in severity with attack-path, exposure and threat context, and each carries a fix-by date.",
        icon: CalendarCheck,
      },
    ],
  },
};
