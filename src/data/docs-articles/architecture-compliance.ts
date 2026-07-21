import type { DocArticle } from "./types";

export const articles: DocArticle[] = [
  {
    slug: "architecture/overview",
    title: "Architecture Overview",
    breadcrumb: "Architecture / Overview",
    body: `
The Onam platform is a multi-tenant SaaS that continuously discovers, evaluates, and monitors cloud resources across **seven cloud providers** — AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud, and Kubernetes — using **read-only credentials**. There are no agents to install for cloud scanning and no changes to your environment. This page explains how the platform is organized: the 29 engines, the pipeline a scan flows through, the unified data model behind every finding, and how your data is isolated from every other tenant.

By the end you will be able to trace any number in the Onam console — a posture score, a compliance percentage, an attack path — back to the exact engine, table, and scan run that produced it.

![Onam platform architecture — 7 cloud providers, the scan pipeline, security engines, data platform, and output layer](/diagrams/arch-overview.svg)

**What you're looking at, top to bottom:**

1. **Your cloud environments** — AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud, and any Kubernetes cluster connect via a read-only IAM role, service principal, or service account.
2. **The scan pipeline** — every connected account flows through the same ordered stages: credential validation, Discovery & Inventory (DI), rule evaluation, domain-engine fan-out, attack-path graph build, compliance mapping, and FAIR risk quantification.
3. **Security engines** — 29 engines cover posture, identity, data, network, container, AI, vulnerability, and behavioral detection.
4. **The data platform** — findings, inventory, relationships, and the attack-path graph are stored in tenant-isolated databases that only your authenticated users can read.
5. **Outputs** — a posture score (0–100), compliance reports for 70+ frameworks, prioritized findings, attack paths with choke points, and step-by-step remediation guidance.

A typical scan of a 40-service AWS account completes in around **15 minutes**. Findings appear in real time as each stage completes — you don't wait for the full pipeline to see results.

---

## The 29 security engines

The platform runs **29 engines**, each a dedicated microservice responsible for one area of cloud security. (Attack Path v1 remains in maintenance for legacy tenants; Attack Path v2 is the active engine.)

| Engine | Group | Purpose |
| --- | --- | --- |
| Onboarding | Pipeline | Credential validation, cloud-account management, scan orchestration |
| Discovery & Inventory (DI) | Pipeline | Multi-phase enumeration and enrichment; writes \`asset_inventory\` and \`asset_relationships\` |
| Check | Pipeline | CSPM core — evaluates the 10,000+ rule registry, PASS/FAIL per resource |
| Check Engine API | Pipeline | Rule-execution service: YAML rules in, PASS/FAIL results out |
| Attack Path v2 | Pipeline | Neo4j security graph, entry-point-to-crown-jewel traversal, choke-point ranking |
| Compliance | Pipeline | Maps findings to 70+ framework control catalogs, per-control scoring |
| Risk Quantification | Pipeline | FAIR model — runs as Layer 4 after all engines, dollar-denominated exposure |
| IAM / CIEM | Domain | Effective permissions, unused access, privilege-escalation chains |
| Data Security (DSPM) | Domain | Discovers data stores, classifies PII / PCI / PHI |
| Database Security | Domain | RDS, Aurora, DynamoDB, Redshift configuration and access control |
| Network Security | Domain | 7-layer network posture model, exposure and reachability analysis |
| Encryption Security | Domain | KMS key rotation, TLS certificates, at-rest encryption coverage |
| Container Security | Domain | EKS / ECS / AKS / GKE posture, pod security, image scanning, K8s RBAC |
| AI Security | Domain | Bedrock, SageMaker, Azure OpenAI, Vertex configuration; prompt-injection and model-poisoning exposure; AI governance |
| API Security | Domain | API gateway and endpoint posture |
| Vulnerability | Domain | NVD CVEs, EPSS, CISA KEV, OSV; SBOM generation; DAST scanning |
| Agentless Scanner | Domain | Snapshot-based workload scanning — no agent on the host |
| CDR / Behavioral Analysis | Domain | Audit-log threat detection across all 7 providers (L1 / L2 / L3 tiers) |
| CWPP | Domain | Cloud workload protection posture |
| CNAPP | Domain | Unified CNAPP posture aggregation |
| SecOps / AppSec | Code | SAST across 7 languages, DAST, SCA / SBOM, semgrep-based scanning |
| Technology Engine | Technology | 40 self-hosted technologies in 10 categories (databases, OS, network devices, web servers, and more) |
| Remediation / Fix | Intelligence | AI-generated source-code fixes, SAST fixes, threat narratives |
| Chat | Intelligence | The AI assistant built into the Onam console |
| Rule Builder | Platform | Author, version, and test custom rules |
| Pipeline Monitor | Platform | Real-time scan pipeline status and log streaming |
| Platform Admin | Platform | Multi-tenant organization management and user administration |
| Billing | Platform | Usage metering and plan management |

Every engine writes to the unified \`security_findings\` table (see [the finding contract](#data-flow-and-the-finding-contract) below). The API layer reads exclusively from this table — there are no per-engine report tables in the current architecture.

### The API layer — BFF gateway

All console and programmatic access goes through a single **BFF (backend-for-frontend) API gateway** built on FastAPI. It exposes roughly **166 endpoints across ~60 routers** under the \`/api/v1\` base path, with a per-engine prefix for each domain (\`/api/v1/di\`, \`/api/v1/check\`, \`/api/v1/compliance\`, \`/api/v1/iam-security\`, \`/api/v1/data-security\`, \`/api/v1/network-security\`, \`/api/v1/container-security\`, \`/api/v1/cdr\`, \`/api/v1/risk\`, and so on).

Representative endpoints:

\`\`\`
GET /api/v1/dashboard
GET /api/v1/attack-paths
GET /api/v1/compliance/framework/{framework_id}/report
GET /api/v1/cdr/heatmap
GET /api/v1/vulnerability/findings/stats
GET /api/v1/risk/blast-radius
GET /api/v1/inventory/asset/{resource_uid}/blast-radius
GET /gateway/health
GET /gateway/services
GET /gateway/openapi.json
\`\`\`

The gateway enforces authentication and tenant scoping before any request reaches an engine — see [Platform data security and tenancy](/docs/architecture/data-security).

---

## Core design principles

Five non-negotiable principles drive every decision in the platform. Together they make it safe to deploy in regulated environments, easy to integrate, and predictable to operate.

### 1. Agentless by default

You install nothing to scan your clouds. The platform never deploys agents on your VMs, never injects sidecars into your containers, and never adds a daemon to your Kubernetes nodes. Every scan is performed externally over read-only cloud APIs (AWS SDK, Azure Management API, GCP Cloud Asset API, and equivalents) using credentials you control.

The one deliberate exception is opt-in: the optional \`onam-agent\` for Linux, macOS, and Windows performs OS-level vulnerability scanning on hosts you choose and reports outbound to the central engine. The cloud connection itself always stays agentless.

**Why this matters for you:** zero blast radius from the platform itself. If you revoke access tomorrow, your environment keeps running unchanged. There is nothing to uninstall.

### 2. Multi-tenant always

Every database query is filtered by your tenant identifier taken from the authenticated request. There are no shared tables, no cross-tenant views, and no admin "see-everything" mode. Tenant isolation is enforced independently at three layers — the API gateway, the security engines, and the database — so a bug in any one layer cannot expose another tenant's data.

**Why this matters for you:** SOC 2 and ISO 27001 auditors look for defense-in-depth on data isolation. Three independent enforcement points satisfy that requirement.

### 3. Pipeline-driven with a single scan ID

Every cloud account scan is assigned a single UUID called \`scan_run_id\`. That ID flows through every stage and is stamped on every finding the scan produces. Two scans of the same account produce two completely separate finding sets, each tagged by its own \`scan_run_id\`.

**Why this matters for you:** when you investigate "why did the score change last Tuesday?", you can pull every finding from that exact run, compare it to the previous run, and see precisely what changed. Findings never leak between scans.

### 4. Standardized finding contract

Every security domain produces findings using the same standard fields — \`finding_id\`, \`scan_run_id\`, \`account_id\`, \`resource_uid\`, \`resource_type\`, \`severity\`, \`status\`, \`first_seen_at\`, \`last_seen_at\`. The contract is consistent across all clouds and all security pillars.

**Why this matters for you:** a single API call, a single export, a single CSV download gives you the same shape of data whether the finding came from CSPM, CIEM, DSPM, or vulnerability management. There's nothing per-domain to learn.

### 5. Rule-as-code in YAML

All **10,000+ security rules** are defined in human-readable YAML and versioned in a catalog. The master rule registry holds 10,864 rules: AWS 2,278 (157 services), Azure 3,741 (112 services), GCP 2,676 (47 services), OCI 1,451 (42 services), and Kubernetes 718 (51 resource kinds), with rule-metadata coverage extending to Alibaba Cloud (1,541) and IBM Cloud (613). Dedicated CIEM rule packs, Technology Engine rules, and SecOps rules add further coverage. Each rule declares its cloud, service, severity, MITRE ATT&CK mapping, framework controls, and remediation guidance. The platform only loads and evaluates rules — it never hardcodes them in software.

**Why this matters for you:** auditors can read the YAML to verify exactly what the platform checks. You can request new rules, propose changes, and see the diff between rule versions over time.

---

## From cloud account to posture score

A connected cloud account flows through a value pipeline that turns raw cloud configuration into prioritized, framework-mapped, dollar-quantified findings. This is the loop the platform repeats for every account on every scan.

![Onam platform value flow — 7 cloud environments through the pipeline to posture dashboard, compliance reports, and actionable findings](/diagrams/platform-overview.svg)

| Stage | What happens | Time (40-service AWS account) |
| --- | --- | --- |
| **1. Discover all resources** | DI enumerates every resource across the provider's covered services and captures configuration | 3–5 min |
| **2. Evaluate security rules** | Check runs every applicable rule from the 10,000+ registry; each is marked PASS or FAIL | 4–6 min |
| **3. Build the attack graph** | FAIL findings and asset relationships become nodes and edges in the Neo4j attack-path graph, with MITRE ATT&CK techniques per hop | 1–2 min |
| **4. Map to frameworks** | Each finding is mapped to the controls it violates across 70+ compliance frameworks | Under 1 min |
| **5. Score risk** | The FAIR model computes dollar-denominated exposure and the 0–100 posture score | Under 1 min |

The output serves three audiences: a **posture dashboard** for security engineers, **compliance reports** for auditors, and **actionable findings** with remediation steps for the cloud account owner.

![Platform components — security domains layered over the core pipeline](/diagrams/platform-components.svg)

**Domains by layer in the diagram:**

- **Web tier** — the Onam console, where you investigate findings, run scans, and configure your tenant; protected by SSO, RBAC, and tenant-scoped routing.
- **Core pipeline (sequential)** — Onboarding (credential validation), DI (enumeration and enrichment), Check (rule evaluation), Attack Path (graph build). These run in order because each consumes the previous stage's output.
- **Security domains (parallel)** — IAM/CIEM, Network, Data Security, Database Security, Encryption, Container, AI Security, API Security, Vulnerability, CDR, CWPP, CNAPP. These run simultaneously after inventory completes.
- **Intelligence layer** — Compliance mapping, FAIR risk scoring, and AI-generated threat narratives from the Remediation/Fix engine.

You don't enable domains individually. Once a cloud account is connected, every applicable domain runs on every scan.

![Ten security pillars — independent engines unified into one posture score](/diagrams/arch-security-pillars.svg)

**The ten security pillars and what each one answers:**

| Pillar | Question it answers | Scale |
| --- | --- | --- |
| **CSPM** | Are my cloud configurations compliant with my baselines? | 10,000+ rules across 7 providers |
| **CIEM** | Which identities have more access than they actually use? | Effective-permission analysis incl. SCPs and permission boundaries; per-cloud CIEM rule packs |
| **DSPM** | Where is my sensitive data and is it exposed? | PII · PCI · PHI classification across object stores, databases, and warehouses |
| **Network Security** | Which paths from the internet to my crown jewels are still reachable? | 7-layer network posture model |
| **Container Security** | Are my clusters and images compromised or misconfigured? | EKS · ECS · AKS · GKE · any K8s |
| **Vulnerability Management** | Which CVEs are exploitable in my live workloads? | NVD · EPSS · CISA KEV · OSV · SBOM · DAST |
| **AI Security** | Are my AI/ML services safe? | Bedrock · SageMaker · Azure OpenAI · Vertex |
| **Attack Path & CDR** | How would an attacker move through my environment? Are there active threats? | Neo4j graph traversal · per-hop MITRE ATT&CK · L1/L2/L3 detection |
| **SecOps (SAST/DAST/SCA/IaC)** | Are vulnerabilities entering my code before deploy? | SAST in 7 languages · DAST · SCA/SBOM · IaC scanning |
| **Compliance** | What's my pass rate against my framework obligations? | 70+ frameworks incl. CIS, NIST, PCI-DSS, HIPAA, ISO 27001, SOC 2, GDPR, FedRAMP |

**The unified posture score** is a weighted roll-up across all pillars, normalized to 0–100. Each pillar contributes proportionally to its severity-weighted findings — fixing a single Critical finding moves the score more than fixing ten Low findings.

For the stage-by-stage walkthrough of a scan — triggers, DI phases, engine fan-out, graph build, and monitoring — see [The scan pipeline](/docs/architecture/scanning).

---

## Multi-cloud coverage

The platform supports seven cloud providers using a read-only IAM role (AWS, OCI, Alibaba Cloud, IBM Cloud), service principal (Azure), service account (GCP), or kubeconfig (Kubernetes). The same pipeline and the same rule registry run against every provider — what differs is the per-cloud service catalog and the credential model.

![Multi-cloud coverage — 7 providers with resource categories](/diagrams/arch-multi-cloud.svg)

| Provider | Compute | Storage & Data | Identity & Security | Network |
| --- | --- | --- | --- | --- |
| **AWS** | EC2 · EKS · Lambda · ECS · Fargate | S3 · RDS · DynamoDB · Redshift | IAM · KMS · Secrets Manager · WAF | VPC · SG · NACL · ALB · CloudFront |
| **Microsoft Azure** | VMs · AKS · Functions · Container Inst | Blob · SQL · Cosmos DB · ADX | AAD · Key Vault · Defender · NSG | VNet · NSG · Front Door · App Gateway |
| **Google Cloud** | GCE · GKE · Cloud Run · App Engine | GCS · Cloud SQL · BigQuery | IAM · KMS · Cloud Audit · Armor | VPC · Firewall · Load Balancer |
| **Oracle Cloud (OCI)** | Compute · OKE · Functions | Object Storage · DB Systems · Autonomous DB | IAM · Vault · Audit Service | VCN · Security Lists · WAF |
| **Alibaba Cloud** | ECS · ACK · Function Compute | OSS · RDS · Table Store · MaxCompute | RAM · KMS · ActionTrail · Anti-DDoS | VPC · Security Groups · WAF |
| **IBM Cloud** | VSI · IKS · Code Engine | Cloud Object Storage · Db2 · Cloudant | IAM · Key Protect · Activity Tracker | VPC · Security Groups · Internet Svc |
| **Kubernetes (any)** | Clusters · Nodes · Pods · Deployments | Persistent Volumes · ConfigMaps | RBAC · Roles · ServiceAccounts | Network Policies · Ingress |

**Rule depth per provider** (master registry, plus rule-metadata coverage for Alibaba and IBM):

| Provider | Rules | Coverage |
| --- | --- | --- |
| AWS | 2,278 | 157 services |
| Azure | 3,741 | 112 services |
| GCP | 2,676 | 47 services |
| OCI | 1,451 | 42 services |
| Kubernetes | 718 | 51 resource kinds |
| Alibaba Cloud | 1,541 | Rule-metadata catalog |
| IBM Cloud | 613 | Rule-metadata catalog |

Dedicated CIEM rule files add identity-specific coverage on top: AWS 530, Azure 202, GCP 176, Alibaba 114, IBM 110, OCI 107, and Kubernetes 103. Beyond the clouds, the **Technology Engine** extends the same model to **40 self-hosted technologies in 10 categories** — databases, Linux/OS, network devices, web servers, virtualization, containers, DevOps, collaboration, data platforms, and middleware.

**Coverage parity:** the same finding contract, the same severity grading (Critical, High, Medium, Low, Info), and the same MITRE mapping apply across all seven providers. A "publicly exposed object storage" finding on AWS S3 and on Azure Blob shows up identically in your dashboard — same severity, same control mapping, same remediation pattern.

> The platform never writes, deletes, or modifies anything in your cloud account. Read-only is enforced by the IAM policy you grant — you can audit it before you enable scanning. See [Platform data security and tenancy](/docs/architecture/data-security).

---

## Data flow and the finding contract

A single cloud resource — say one S3 bucket — flows through the platform from raw configuration to a posture-score contribution. Understanding this flow tells you where every piece of information in your dashboard came from and how to trace any finding back to its source data.

![Data flow — from cloud resource to finding record to unified posture score](/diagrams/arch-data-flow.svg)

**Following one S3 bucket through the pipeline:**

1. **DI enumeration** captures the raw bucket configuration — every property the AWS API exposes. Nothing is filtered or summarized at this stage.
2. **DI enrichment and normalization** turns the bucket into a standard asset record in \`asset_inventory\` — common fields like \`resource_uid\`, \`region\`, and tags become first-class. Relationships (for example "this bucket is read by these Lambda functions") are written to \`asset_relationships\`. Drift vs the prior scan is tagged.
3. **Check** evaluates every applicable rule ("S3 public access blocked", "S3 default encryption enabled", "S3 versioning enabled") against the configuration. Each rule produces a PASS or FAIL.
4. **Attack Path v2** loads assets and relationships into the Neo4j graph and derives edges through ~25 catalog-driven derivers (IAM policy, network exposure, security-group rule match, KMS, CDR behavioral, is-public). If "S3 public access blocked = FAIL" and the bucket holds PII, the graph gains a candidate edge toward MITRE technique \`T1530\` (Data from Cloud Storage Object).
5. **Compliance** maps the FAIL to framework controls. The same single FAIL on "S3 public access blocked" appears in **CIS AWS 2.1.5**, **NIST SP 800-53 SC-7**, **PCI-DSS 1.3.4**, **HIPAA §164.312**, and **SOC 2 CC6.1** — one finding, five framework citations, all auto-mapped.
6. **Risk** weights the finding by severity, blast radius (how many resources depend on this bucket, straight from the graph), and asset criticality (does this resource expose PII?). The FAIR model converts that into a dollar-exposure estimate and a posture-score contribution.

**Every finding record carries a standard set of fields** regardless of which engine produced it. This is what enables cross-domain queries, exports, and a unified dashboard:

| Field | What it is | Why it matters |
| --- | --- | --- |
| \`finding_id\` | Deterministic hash of rule, resource, and account | Same finding keeps the same ID across re-scans, so ack/snooze/suppress survive rescans |
| \`scan_run_id\` | UUID tagging every finding from a single scan | "What changed between Tuesday's scan and today's?" is answerable with one diff |
| \`account_id\` | The cloud account this finding belongs to | Filter by account in multi-cloud organizations |
| \`resource_uid\` | Globally unique cloud resource identifier (ARN, resource ID) | Click-through navigation to the resource in your cloud console |
| \`resource_type\` | Normalized type (e.g. \`aws_s3_bucket\`, \`azure_storage_account\`) | Filter "show me all S3 issues" cross-account |
| \`severity\` | \`CRITICAL\` · \`HIGH\` · \`MEDIUM\` · \`LOW\` · \`INFO\` | Drives default sort order in dashboards |
| \`status\` | \`PASS\` · \`FAIL\` · \`UNKNOWN\` | \`UNKNOWN\` flags resources where data was insufficient — never silently skipped |
| \`first_seen_at\` | When this finding was first detected | Aging analysis — "this has been open 47 days" |
| \`last_seen_at\` | Most recent scan that observed this state | Auto-resolution — a finding closes when no longer observed |

### The security_findings table

All 29 engines write to a single \`security_findings\` table in the DI database. This is the canonical source of truth for every finding on the platform; the BFF gateway reads exclusively from it. Every engine upserts findings using a shared writer, keyed on \`(tenant_id, account_id, rule_id, resource_uid)\`:

| Column | Description |
| --- | --- |
| \`finding_id\` | Deterministic ID — stable across re-scans |
| \`tenant_id\` | NOT NULL — primary multi-tenant isolation key |
| \`account_id\` | Cloud account ID |
| \`provider\` | aws / azure / gcp / oci / alibaba / ibm / k8s |
| \`region\` | Cloud region (defaults to \`global\` for IAM and other global services) |
| \`scan_run_id\` | Pipeline run ID — traceability to the exact execution |
| \`engine\` | Source engine name (e.g. \`iam\`, \`network\`, \`container\`) |
| \`rule_id\` | Rule catalog ID |
| \`resource_uid\` | Globally unique resource identifier |
| \`resource_type\` | Normalized type (e.g. \`aws_s3_bucket\`) |
| \`severity\` | CRITICAL / HIGH / MEDIUM / LOW / INFO |
| \`status\` | PASS / FAIL / UNKNOWN |
| \`title\` and \`description\` | Human-readable finding summary and detail |
| \`remediation\` | Step-by-step fix guidance |
| \`first_seen_at\` / \`last_seen_at\` | Detection lifecycle timestamps |
| \`mitre_technique\` | MITRE ATT&CK technique ID (e.g. \`T1530\`) |

**Auto-resolution:** a finding is marked \`PASS\` when the next scan of the same resource no longer triggers the rule. The \`last_seen_at\` timestamp is updated on every scan; findings not seen for 30 days are auto-closed.

### Inventory and posture tables

Two more tables complete the data model. \`asset_inventory\` and \`asset_relationships\` are produced by DI — normalized asset records plus typed edges (containment, attachment, network reachability, IAM trust) that feed the attack-path graph and the blast-radius APIs. \`posture_snapshot\` stores one row per engine per scan — total findings, Critical and High counts, and a 0–100 domain score — and backs every engine's \`/api/v1/{engine}/status\` endpoint.

---

## Platform security, reliability, and data residency

The platform protects your data with defense-in-depth across independent layers — tenant isolation, role-based access control, and read-only credential handling. Any single layer's failure cannot cause a data exposure because the others still hold.

### Multi-tenant isolation

Every API request carries an \`AuthContext\` — a server-built object with the caller's tenant ID, role, and permissions. Tenant isolation is enforced at three independent points so a bug in any one cannot leak another tenant's data.

![Multi-tenant isolation — three-layer enforcement at gateway, engine, and database](/diagrams/arch-multi-tenant.svg)

1. **Layer 1 — API gateway.** The auth middleware validates your access token, looks up the user, and constructs the \`AuthContext\`. The token is signed; tampering invalidates it immediately. Engines never trust client-supplied identity.
2. **Layer 2 — security engine.** Every route validates that the caller holds the right \`feature:action\` permission (e.g. \`findings:read\`, \`scans:create\`). Unauthorized callers receive HTTP 403 with no data leakage in the error body.
3. **Layer 3 — database query.** Every read and write is filtered by your tenant ID. There is no global query path and no admin bypass.

> There is no environment variable, debug toggle, or support-mode switch that bypasses authentication, and there are no shared tables. Onam support staff cannot read your tenant's findings without an explicit, fully audit-logged impersonation handshake that you must approve. The full storage, credential, and residency model is documented in [Platform data security and tenancy](/docs/architecture/data-security).

### Role-based access control

The platform ships with **five seeded roles** and **27 permissions** in the \`feature:action\` format. Roles are hierarchical — higher levels inherit the read permissions of lower levels.

![RBAC — 5 roles with 27 permissions in feature:action format](/diagrams/arch-rbac.svg)

| Role | Level | Scope | Typical user |
| --- | --- | --- | --- |
| \`platform_admin\` | L1 | Every tenant on the platform | Onam support team only |
| \`org_admin\` | L2 | Every tenant within your organization | Your CISO or VP Security |
| \`tenant_admin\` | L4 | Full read/write within one tenant | Cloud security team lead |
| \`analyst\` | L4 | Read all findings, acknowledge, comment | Day-to-day security engineer |
| \`viewer\` | L4 | Read-only — limited to 9 non-sensitive permissions | Auditors, board reporting |

Sensitive areas — Data Security, AI Security, Encryption, Database Security, Container Security, SecOps, and Vulnerability — require \`tenant_admin\` or higher, because they contain sensitive resource details that should not be exposed to read-only auditors. SAML 2.0 SSO and SCIM provisioning are supported on Enterprise plans; group-to-role mappings sync from your identity provider on every login.

### Reliability

| Component | Target |
| --- | --- |
| Platform availability | 99.9% monthly uptime SLA on Pro and Enterprise (99.95% on Enterprise+) |
| Scan completion (40-service AWS account) | 15 minutes end to end (SLO) |
| API p95 latency | 500 ms or less for read endpoints |
| Findings delivery | Real-time stream as each domain completes |

A live status page and historical incident reports are available at [status.onam.io](https://status.onam.io). Maintenance windows are announced 7 days in advance.

### Data residency and disaster recovery

Your findings, inventory, and graph data are stored in the region you select: \`ap-south-1\` (Mumbai, all plans), \`eu-west-1\` (Ireland, Enterprise), \`us-east-1\` (N. Virginia, all plans), and \`us-gov-west-1\` (Government/FedRAMP plans). Cross-region access is blocked by tenant policy and backups stay in-region. Recovery targets: **RPO 15 minutes** (backups every 15 minutes), **RTO 2 hours**, with quarterly DR tests reported publicly.

---

## Frequently asked questions

**Does the scanner modify any cloud resources?**
No. Every stage uses read-only IAM roles or API credentials. The platform never writes to, deletes from, or modifies your cloud environment. The IAM policy you grant explicitly excludes write actions — you can audit it before enabling.

**How is my data isolated from other tenants?**
Three independent enforcement layers: the API gateway builds the auth context, the engine validates permissions, and every database query filters by tenant ID. There are no shared tables, no cross-tenant views, and no admin bypass.

**How often does the platform scan?**
Default is once per day per cloud account. You can configure up to four scans per day on Pro plans, and run ad-hoc scans at any time from the console or the API.

**What credentials does the platform need?**
A read-only IAM role (AWS, launched via CloudFormation with an ExternalId), service principal (Azure), service account (GCP), or equivalent per provider. Credential references are stored in AWS Secrets Manager, encrypted with KMS. We never store cloud account passwords.

**What happens when a scan fails?**
The pipeline marks the failed stage and continues. Findings from successful stages are still surfaced, failures are logged with root-cause context, and you can re-trigger from the console without affecting the prior scan's data. The Pipeline Monitor engine streams live status throughout.

**Can I export my data?**
Yes. Finding history and inventory export as JSON, CSV, or Parquet via the API; compliance reports export as PDF. You retain ownership of all data.

**Is the platform SOC 2 / ISO 27001 certified?**
SOC 2 Type II, ISO 27001, ISO 27701, and PCI DSS v4 — all current. Pentest report and CAIQ are available under NDA.

---

## Next steps

- [The scan pipeline — end to end](/docs/architecture/scanning) — triggers, DI phases, engine fan-out, graph build, and monitoring
- [Platform data security and tenancy](/docs/architecture/data-security) — what is stored, credential handling, and read-only enforcement
- [Compliance framework coverage](/docs/compliance/frameworks) — 70+ frameworks, per-control scoring, audit-ready reports
- [Book a demo](/request-demo) — see the full pipeline run against a live demo account
`,
  },
  {
    slug: "architecture/scanning",
    title: "The Scan Pipeline — End to End",
    breadcrumb: "Architecture / Scan Pipeline",
    body: `
This page walks through everything that happens between the moment a scan starts and the moment findings appear in the Onam console: how scans are triggered, how Discovery & Inventory (DI) enumerates your estate, how the 29 engines fan out, how the attack-path graph is built, and how compliance mapping and FAIR risk quantification finish the run.

You will also learn how to schedule scans, run them ad hoc, and watch a live pipeline through the Pipeline Monitor.

## Triggers — onboarding, scheduled, and ad hoc

Every scan is a **scan run** with its own \`scan_run_id\` UUID. There are three ways a run starts:

| Trigger | How it starts | Typical use |
| --- | --- | --- |
| **Onboarding** | Connecting a cloud account validates the credential and immediately kicks off the first full scan | First posture baseline, minutes after connect |
| **Scheduled** | A schedule attached to the account — daily by default, up to four times per day on Pro plans | Continuous posture monitoring and compliance evidence |
| **Ad hoc** | The Scans page in the console, or \`POST /api/v1/scans\` | Verifying a fix, pre-audit dry runs, incident response |

Schedules are managed in the console under **Scans → Schedules** or via \`/api/v1/schedules\`; individual runs are tracked under \`/api/v1/scan-runs\`.

> Scans are safe to run at any time, including business hours. Every stage reads from cloud APIs with read-only credentials — nothing executes inside your account and nothing is modified. See [Platform data security and tenancy](/docs/architecture/data-security).

## The pipeline at a glance

![Scan pipeline — ordered stages from credential validation to risk quantification, all stamped with one scan_run_id](/diagrams/arch-scan-pipeline.svg)

| Order | Stage | Engine(s) | Output |
| --- | --- | --- | --- |
| 1 | Credential validation | Onboarding | Verified credential reference; \`scan_run_id\` issued |
| 2 | Enumeration & enrichment | Discovery & Inventory (DI) | \`asset_inventory\` records and \`asset_relationships\` edges |
| 3 | Rule evaluation | Check + Check Engine API | PASS/FAIL per rule per resource from the 10,000+ registry |
| 4 | Domain fan-out (parallel) | IAM/CIEM, Data Security, Network, Container, Encryption, Database, AI Security, API Security, Vulnerability, Agentless Scanner, CDR, CWPP, CNAPP | Per-domain findings in \`security_findings\` |
| 5 | Attack-path graph build | Attack Path v2 | Neo4j graph, confirmed paths, choke-point ranking |
| 6 | Compliance mapping | Compliance | Per-control results and scores across 70+ frameworks |
| 7 | Risk quantification | Risk (FAIR, Layer 4) | \`risk_report\`, \`risk_summary\`, \`risk_trends\` |

Every stage receives the same \`scan_run_id\`, so every finding, graph edge, compliance result, and risk figure from one run can be correlated — and diffed against the previous run. A typical 40-service AWS account with ~5,000 resources completes in about **15 minutes**, and findings stream into the console as each stage finishes.

## Stage 2 — Discovery and Inventory (DI)

DI is the foundation every other engine builds on. It runs as a **multi-phase enumeration and enrichment** process:

1. **Enumeration** — parallel read-only API calls across every covered service and region for the provider: 157 services on AWS, 112 on Azure, 47 on GCP, 42 on OCI, and 51 resource kinds on Kubernetes.
2. **Enrichment** — per-resource configuration detail: policies, encryption settings, tags, public-access flags, attached identities.
3. **Normalization** — every resource becomes a standard record in \`asset_inventory\` with a globally unique \`resource_uid\`, and typed edges (containment, attachment, IAM trust, network reachability) are written to \`asset_relationships\`.
4. **Drift detection** — the new snapshot is compared to the previous scan; created, changed, and deleted assets are tagged.

DI also handles Kubernetes audit-log collection, which feeds the CDR engine's behavioral detection. The result is a queryable inventory — the same one behind the console's Inventory area and the \`GET /api/v1/inventory/asset/{resource_uid}/blast-radius\` API.

## Stages 3–4 — Rule evaluation and engine fan-out

The Check engine evaluates every applicable YAML rule against the inventory via the Check Engine API — each evaluation produces PASS or FAIL per resource, severity-graded Critical, High, Medium, Low, or Info.

Then the **domain engines fan out in parallel**, each reading the same inventory snapshot and writing to the same \`security_findings\` table:

- **IAM / CIEM** — effective permissions, unused access, privilege-escalation chains
- **Data Security (DSPM)** — data-store discovery and PII/PCI/PHI classification
- **Network Security** — 7-layer exposure model, reachability from the internet
- **Container Security** — EKS/ECS/AKS/GKE posture, pod security, image scanning, K8s RBAC
- **Encryption Security** — KMS rotation, TLS certificates, at-rest coverage
- **Database Security** — RDS, Aurora, DynamoDB, Redshift configuration
- **AI Security** — Bedrock, SageMaker, Azure OpenAI, Vertex posture
- **API Security** — gateway and endpoint exposure
- **Vulnerability** — CVE correlation against NVD, EPSS, CISA KEV, and OSV; SBOM generation
- **Agentless Scanner** — snapshot-based workload scanning
- **CDR** — audit-log detection in three tiers: L1 single-event rules, L2 multi-event correlation scenarios, L3 statistical behavior baselines
- **CWPP / CNAPP** — workload protection and unified posture aggregation

Because every engine emits the same finding contract, the fan-out is invisible in the console — you see one prioritized queue, filterable by engine, severity, account, or resource type. (SecOps code scanning and the Technology Engine's 40 self-hosted technologies run on their own triggers, outside the cloud-account pipeline.)

## Stage 5 — Attack-path graph construction

Attack Path v2 loads the scan's assets, relationships, and FAIL findings into a **Neo4j property graph**, then:

1. Derives edges through **~25 catalog-driven derivers** — IAM policy analysis, network exposure, security-group rule matching, KMS access, CDR behavioral signals, public-exposure flags.
2. Classifies **entry points** (internet-reachable, anonymously accessible) and **crown jewels** (sensitive data stores, admin identities) from the catalog.
3. Runs **BFS traversal** from entry points toward crown jewels, accumulating attacker capability along each hop.
4. Verifies each edge across **five security domains** before marking it CONFIRMED — a path is never reported on a single signal.
5. Attaches a **MITRE ATT&CK technique chain** to every hop.

The output includes the **Top 5 choke points** — single resources whose remediation severs the largest number of attack paths.

> Pro tip: triage choke points before individual findings. One choke-point fix routinely eliminates dozens of paths, which moves your posture score and your risk dollar-figure far more than fixing findings in severity order.

## Stages 6–7 — Compliance mapping and FAIR risk

**Compliance** projects the run's findings onto **70+ frameworks** through the rule-to-control mapping catalog. Each control gets its own pass rate, rolled up to category and framework scores — no separate per-framework scans. Details in [Compliance framework coverage](/docs/compliance/frameworks).

**Risk Quantification** runs as **Layer 4**, after all engines complete, in three steps: **ETL** (pulls Critical and High findings from the engine outputs), **Evaluate** (applies the FAIR model), and **Report** (writes \`risk_report\`, \`risk_summary\`, and \`risk_trends\`).

\`\`\`
Risk = LEF x LM
LEF  = TEF x Vulnerability          (Loss Event Frequency)
LM   = Primary + Secondary loss     (Loss Magnitude)
\`\`\`

Loss magnitude uses per-record cost benchmarks from the IBM Cost of a Data Breach 2024 study (healthcare $10.93, finance $6.08, technology $4.88, retail $3.28, default $4.45 per record), data-sensitivity multipliers (restricted ×3.0, confidential ×2.0, internal ×1.0, public ×0.1 — tenant-overridable), and a regulatory multiplier where the highest single applicable regulation applies:

| Regulation | Multiplier |
| --- | --- |
| GDPR | ×1.5 |
| SOX | ×1.4 |
| HIPAA | ×1.3 |
| PCI-DSS | ×1.2 |
| CCPA / APPI / PDPA / PIPEDA | ×1.1 |

The result is a dollar-denominated exposure figure per finding, per asset, and per account — the number your board actually understands.

## Watching a scan — console, monitoring, and failure handling

Findings stream into the console as each stage completes — you can start triaging from around minute 5 of a typical run. Results land in the area that matches their engine (Findings, Inventory, Attack Paths, Compliance, Risk), all filtered to the current \`scan_run_id\` or aggregated across runs.

![Findings streaming into the Onam console during a scan (demo account)](/screenshots/screenshot-findings.png)

The **Pipeline Monitor** engine gives you live visibility into every run — per-stage status, timing, and log streaming — in the console under **Scans**, or via \`/api/v1/pipeline\` and \`/api/v1/scan-runs\`.

**When a stage fails**, the pipeline marks it and continues: findings from successful stages are still surfaced, the failure is logged with root-cause context, and you can re-trigger the run without affecting the prior scan's data. Findings auto-resolve on subsequent runs — a finding flips to PASS when the rule no longer triggers, and findings unseen for 30 days are auto-closed.

![Horizontal scaling — parallel workers per account, service, and region keep large estates inside the scan SLO](/diagrams/arch-scaling.svg)

Scanning scales horizontally: enumeration and rule evaluation parallelize per account, per service, and per region, so a 50-account organization scans in roughly the same wall-clock time as a single account. Accounts are always scanned independently — one account's failure never blocks another's results.

## Next steps

- [Architecture overview](/docs/architecture/overview) — the 29 engines, the data model, and the finding contract
- [Platform data security and tenancy](/docs/architecture/data-security) — credential handling and read-only enforcement behind every scan
- [Compliance framework coverage](/docs/compliance/frameworks) — how scan results become framework scores and audit evidence
- [Book a demo](/request-demo) — watch a live scan run end to end
`,
  },
  {
    slug: "architecture/data-security",
    title: "Platform Data Security & Tenancy",
    breadcrumb: "Architecture / Data Security",
    body: `
This page describes how the Onam platform itself protects **your** data: how tenants are isolated, exactly what is stored (and what never is), how your cloud credentials are handled, and how read-only access is enforced. It is the page to hand your security reviewer during vendor assessment.

> Looking for the product feature that classifies PII in your buckets and databases? That is **Data Security (DSPM)** — a scanning engine, documented under Features in the sidebar. This page is about the security of the platform, not a feature of it.

## Tenancy and isolation

Every tenant's data lives in **tenant-scoped databases encrypted with per-tenant keys**. On top of that physical separation, every request is checked at three independent layers, so a bug in any single layer cannot expose another tenant's data.

![Multi-tenant isolation — three-layer enforcement at gateway, engine, and database](/diagrams/arch-multi-tenant.svg)

1. **API gateway.** The BFF gateway validates the signed access token and constructs an \`AuthContext\` — tenant ID, role, permissions — on the server. Engines never trust client-supplied identity.
2. **Engine permission check.** Every route requires the matching \`feature:action\` permission (e.g. \`findings:read\`, \`scans:create\`). Unauthorized calls get HTTP 403 with no data in the error body.
3. **Database filter.** Every query is scoped to the caller's tenant ID. There is no global query path, no cross-tenant view, and no admin bypass.

Two guarantees worth repeating to your auditor: there is **no auth-skipping flag** anywhere in the platform (no environment variable, no debug toggle, no support mode), and there are **no shared data tables**. Onam support staff cannot read your findings without an explicit, fully audit-logged impersonation handshake that you approve first.

## What is stored — and what never is

The platform stores security **metadata about** your cloud estate, not the data **inside** it.

| Data | Stored? | Details |
| --- | --- | --- |
| Resource configuration metadata | Yes | Settings, policies, tags, public-access flags — what the read-only APIs return |
| Asset inventory and relationships | Yes | Normalized records in \`asset_inventory\` and typed edges in \`asset_relationships\` |
| Findings and posture snapshots | Yes | The \`security_findings\` and \`posture_snapshot\` tables, tenant-scoped |
| Attack-path graph | Yes | Neo4j property graph, per tenant |
| CDR detections | Yes | Detection results from audit-log analysis; raw log events follow your retention window |
| DSPM classification results | Yes | Labels and match locations only — never copies of the classified data |
| Credential references | Yes — encrypted | Stored in AWS Secrets Manager, encrypted with KMS; see below |
| Object and file contents | **Never** | S3 objects, blobs, GCS files — contents are never copied out |
| Database rows | **Never** | Table data never leaves your account; only configuration and classification metadata |
| Workload disk or memory | **Never persisted** | Agentless snapshot analysis is ephemeral — artifacts are discarded after the scan |
| Cloud account passwords | **Never** | The platform uses roles and service principals, not console passwords |

> The DSPM engine classifies data **in place**, inside your cloud account, using the same read-only access as every other engine. What crosses the boundary is a classification result ("this column matches PCI"), never the column's contents.

## Credential handling

Cloud credentials are the most sensitive thing you give the platform, and they are handled accordingly:

- **AWS** — a CloudFormation-launched, **read-only IAM role** assumed cross-account via \`sts:AssumeRole\` with a unique **ExternalId** per tenant, which prevents confused-deputy attacks. An access-key option exists, but the role is recommended.
- **Azure** — a service principal with a client secret, scoped to Reader.
- **GCP, OCI, Alibaba Cloud, IBM Cloud, Kubernetes** — equivalent read-only credentials (service account, read-only user, kubeconfig).
- **Storage** — credential references are stored in **AWS Secrets Manager**, encrypted with **KMS**. Secret material is fetched at scan time, used in memory, and never written to logs or findings.

The AWS trust policy your CloudFormation stack creates looks like this — note the ExternalId condition:

\`\`\`
{
  "Effect": "Allow",
  "Principal": { "AWS": "arn:aws:iam::<ONAM_ACCOUNT_ID>:root" },
  "Action": "sts:AssumeRole",
  "Condition": {
    "StringEquals": { "sts:ExternalId": "<your-unique-external-id>" }
  }
}
\`\`\`

Rotation follows the policy you set on your side (rotating a role's ExternalId or a service principal's secret takes effect on the next scan). Revoking the role or secret in your cloud cuts off all platform access instantly — there is nothing to uninstall.

## Read-only enforcement

Read-only is not a promise — it is a property of the IAM policy **you** grant, which you can audit before enabling scanning:

- The role/service principal includes only read, list, and describe actions. No write, delete, or modify action is requested, ever.
- Every scan stage — enumeration, rule evaluation, engine fan-out, graph build — consumes API responses only. Nothing executes inside your account.
- The platform **pulls**; your account pushes nothing. Even CDR log analysis reads CloudTrail, Azure Monitor, GCP Audit Logs, OCI Audit, ActionTrail, and IBM COS through the same read-only credentials.
- The one opt-in exception is the optional \`onam-agent\` for OS-level vulnerability scanning on Linux/macOS/Windows hosts you choose. It reports outbound to the central engine and can be removed at any time; the cloud connection itself stays agentless.

## One security model across every engine

All 29 engines — from CSPM checks to the attack-path graph — operate under the same guarantees described on this page: tenant-tagged writes through a shared findings writer, per-tenant encryption, read-only cloud access, and gateway-enforced \`AuthContext\` on every read.

![The security domains all inherit the same tenancy, encryption, and read-only guarantees](/diagrams/arch-security-pillars.svg)

Data in transit is protected with TLS 1.2+ on every hop — cloud API to scanner, engine to database, database to console. Data at rest is encrypted with KMS-managed, per-tenant keys. Backups are encrypted with the same keys and never leave the tenant's region.

## Data residency, retention, and deletion

You choose your data region at tenant creation, and everything — findings, inventory, graph, backups — stays there.

![Data residency — tenant-selected regions with in-region backups and no cross-region replication](/diagrams/trust-data-residency.svg)

| Region | Coverage | Plans |
| --- | --- | --- |
| \`ap-south-1\` (Mumbai) | India · APAC | All plans |
| \`eu-west-1\` (Ireland) | EU · UK · GDPR residency | Enterprise |
| \`us-east-1\` (N. Virginia) | US · Americas | All plans |
| \`us-gov-west-1\` | US Federal · ITAR · FedRAMP | Government plans |

Cross-region data access is blocked by tenant policy. Backups run every 15 minutes (RPO 15 minutes; RTO 2 hours) and stay in-region. When you offboard, your tenant's databases, secrets, and graph are deleted on a documented schedule, with a deletion certificate available on request.

## Frequently asked questions

**Can Onam employees see my findings?**
Not without your approval. Support access requires an explicit impersonation handshake that you approve, and every action taken during it is audit-logged to your tenant.

**Do you ever store samples of my data?**
No. DSPM classification stores labels and locations, never content. Object stores, database rows, and workload disks are analyzed in place or via ephemeral snapshots and never persisted.

**What exactly can you do in my cloud account?**
Only what the read-only policy you granted allows: read, list, describe. You can audit the CloudFormation template or service-principal scope before connecting, and revoke it at any time for instant cutoff.

**Where are my credentials kept?**
As references in AWS Secrets Manager, encrypted with KMS, fetched only at scan time. Role-based access with ExternalId is recommended over static keys on every provider that supports it.

## Next steps

- [Architecture overview](/docs/architecture/overview) — the 29 engines and the tenant-isolated data model in context
- [The scan pipeline](/docs/architecture/scanning) — what those read-only credentials are used for, stage by stage
- [Compliance framework coverage](/docs/compliance/frameworks) — turn platform guarantees into audit evidence
- [Book a demo](/request-demo) — bring your security reviewer; we'll walk the trust boundary live
`,
  },
  {
    slug: "compliance/frameworks",
    title: "Compliance Framework Coverage",
    breadcrumb: "Compliance / Frameworks",
    body: `
The Onam platform automatically maps every security finding to the compliance frameworks you care about — **70+ frameworks supported out of the box**, including CIS Benchmarks, NIST CSF 2.0, NIST 800-53, PCI-DSS v4, HIPAA/HITRUST, ISO 27001:2022, SOC 2, GDPR, NIS2, DORA, the EU AI Act, FedRAMP, and CMMC 2.0. One finding can satisfy controls in many frameworks at once. This page covers how the mapping works, how per-control scores are calculated, what each major framework checks, and how to export an audit-ready report.

![The Compliance view in the Onam console (demo account)](/screenshots/screenshot-compliance.png)

Instead of running a separate compliance scan for each framework, the platform evaluates **every applicable rule once** and projects the results into the framework views you need. A single failing finding on "S3 public access blocked" is reflected against PCI, HIPAA, ISO, NIST, SOC 2, and CIS simultaneously — **one fix, multiple compliance gains**.

---

## How compliance mapping works

A single platform rule can satisfy controls in many frameworks at the same time. When a resource passes or fails a rule, that result updates every framework mapped to it — automatically, on every scan. There is no separate "PCI scan" or "HIPAA scan" to schedule.

![How compliance scoring works — rules map to controls, controls roll up to frameworks](/diagrams/compliance-framework.svg)

**The three-layer model:**

1. **Rules** — each of the **10,000+ rules** is a YAML file with a clear assertion (e.g. "S3 buckets must block public access"), versioned in the catalog.
2. **Controls** — every framework has its own control catalog (CIS controls, NIST control families, PCI requirements). The platform maintains a many-to-many rule-to-control mapping in \`policy_to_frameworks\`.
3. **Frameworks** — a framework is a curated bundle of controls. Selecting "PCI-DSS v4.0" filters results to the rules mapped to PCI-DSS controls.

Every new rule added to the catalog automatically extends coverage for every framework that includes the underlying control — frameworks are never updated one at a time.

**The multiplier effect, worked example** — the rule "S3 bucket public access not blocked":

| Framework | Control | What the control says |
| --- | --- | --- |
| CIS AWS v3.0 | 2.1.5 | Ensure S3 buckets are configured with Block Public Access |
| NIST CSF 2.0 | PR.DS-1 · PR.AA-5 | Data-at-rest is protected; access permissions are defined |
| NIST 800-53 Rev 5 | AC-3 · SC-7 | Access Enforcement; Boundary Protection |
| PCI-DSS v4.0 | Req 1.3 · Req 3.4 | Restrict traffic; render account data unreadable in storage |
| HIPAA | §164.312(a) · §164.312(e) | Access Control; Transmission Security |
| ISO 27001:2022 | A.8.3 · A.8.20 | Information access restriction; network controls |
| SOC 2 | CC6.1 · CC6.6 | Logical access security architecture |
| GDPR | Art. 25 · Art. 32 | Data protection by design; security of processing |

**One finding, eight framework citations.** Fixing the bucket once closes the audit gap across every framework above.

---

## Scoring methodology

Framework scores are deterministic — no machine learning, no fuzzy logic. You can audit the math, and so can your auditor.

![Framework scoring — evaluate rules per resource, roll up per control, produce score and threshold status](/diagrams/compl-scoring-flow.svg)

**Scoring is per-control first.** Each control's score is computed from the rule × resource evaluations mapped to it; controls roll up to categories, and categories to the framework score:

| Step | What is computed |
| --- | --- |
| 1. Evaluate | Every rule mapped to the framework runs against every in-scope resource. A typical PCI-DSS run produces hundreds of thousands of pass/fail decisions. |
| 2. Per-control score | For each control: \`PASS ÷ (PASS + FAIL) × 100\` across its mapped evaluations |
| 3. Category roll-up | Controls aggregate to their framework category (CIS section, NIST family, PCI requirement) |
| 4. Framework score | The overall score, 0–100, with a status badge |

Each evaluation lands in one of three outcomes:

| Outcome | Meaning | Effect on score |
| --- | --- | --- |
| **PASS** | The resource satisfies the rule | Counts toward the numerator |
| **FAIL** | The resource violates the rule; a severity-graded finding is generated | Counts toward the denominator |
| **NOT APPLICABLE** | The rule does not apply to this resource type or context (e.g. physical-access requirements in cloud) | Excluded from scoring |

The framework score maps to a three-tier badge: **Compliant** (80% or above), **Partially Compliant** (60–79%), **Non-Compliant** (below 60%). Scores are recalculated after every scan, and historical scores are retained — you can show your auditor a 12-month trend line for any framework.

![Compliance platform view — framework scores, control coverage, and posture trend](/diagrams/p-compliance.svg)

> Two nuances auditors ask about. **Suppressions are auditable:** a suppressed finding (with documented justification) is excluded from the score but tracked in a suppression log that exports with every report. **Severity does not weight the score:** a failing Critical and a failing Low each count as one failed evaluation — severity drives prioritization in the findings queue, not the compliance math.

---

## Supported frameworks

The platform ships **70+ frameworks**, spanning global standards, regional regulation, and sector-specific mandates. Coverage parity is high across clouds — most frameworks evaluate the same way against AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud, and Kubernetes.

![Compliance framework coverage across categories and clouds](/diagrams/compliance-frameworks.svg)

A representative selection, grouped by region and type:

| Group | Frameworks |
| --- | --- |
| **Global standards** | CIS Benchmarks (AWS, Azure, GCP — multiple versions) · ISO 27001:2022 · ISO 27002 · ISO 27017 · SOC 2 Type II · CSA CCM v4 |
| **US federal & defense** | NIST CSF 2.0 · NIST 800-53 Rev 4 & Rev 5 · NIST 800-171 · FedRAMP Moderate & High · CMMC 2.0 Level 2 & Level 3 |
| **US sector** | HIPAA · HITRUST CSF v11.3 · SOX IT controls · NYDFS |
| **EU & UK** | GDPR · NIS2 · DORA · EU AI Act · UK NCSC CAF · Cyber Essentials |
| **Financial services** | PCI-DSS v4.0 & v4.0.1 · SWIFT CSCF · DORA · SOX |
| **APAC & Americas** | RBI ITF (India) · APRA CPS 234 (Australia) · MAS TRM (Singapore) · LGPD (Brazil) · CCPA (California) |

**New framework requests** are welcomed — most additions complete within 8 weeks. Email support@onam.io with the framework name, version, and business justification.

### Coverage by cloud provider

| Framework | AWS | Azure | GCP | OCI | AliCloud | IBM | K8s |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CIS Foundations | Full | Full | Full | Full | Full | Full | — |
| CIS Kubernetes | — | — | — | — | — | — | Full |
| NIST CSF 2.0 | Full | Full | Full | Full | Full | Full | Full |
| NIST 800-53 Rev 5 | Full | Full | Full | Partial | Partial | Partial | Partial |
| PCI-DSS v4 | Full | Full | Full | Full | Full | Full | Full |
| HIPAA / HITRUST | Full | Full | Full | Partial | Partial | Partial | — |
| ISO 27001:2022 | Full | Full | Full | Full | Full | Full | Full |
| GDPR | Full | Full | Full | Full | Full | Full | — |
| SOC 2 Type II | Full | Full | Full | Partial | Partial | Partial | Partial |
| FedRAMP | Full | Full | Full | — | — | — | — |
| DORA | Full | Full | Full | Full | Full | Full | Full |
| CSA CCM v4 | Full | Full | Full | Full | Full | Full | Full |

**Partial doesn't mean weak.** It means the framework's full breadth includes controls not yet automated on that cloud — typically because the provider's own service catalog is narrower. The covered controls are the ones that move audit outcomes.

---

## Framework details

### CIS Benchmarks

The Center for Internet Security publishes the most widely adopted configuration benchmarks for cloud platforms. The platform evaluates every applicable control automatically — no manual configuration required.

| Benchmark | Version | Target | Controls |
| --- | --- | --- | --- |
| CIS AWS Foundations | v3.0 | AWS | 58 controls |
| CIS Azure Foundations | v2.0 | Azure | 85 controls |
| CIS GCP Foundations | v2.0 | GCP | 73 controls |
| CIS OCI Foundations | v1.2 | OCI | 47 controls |
| CIS Kubernetes | v1.8 | Any K8s cluster | 112 controls |
| CIS Docker | v1.6 | Container hosts | 28 controls |

CIS publishes new versions roughly every 12–18 months. When a new version ships, the platform adds it as a new framework option without removing the old one, so you migrate when ready — multiple versions can be active simultaneously.

### NIST CSF 2.0

The NIST Cybersecurity Framework 2.0 (February 2024) organizes controls into six functions, adding GOVERN alongside the original five. Platform rules are tagged to one or more functions; a failing rule pulls down the corresponding function score.

| Function | Code | What it covers |
| --- | --- | --- |
| GOVERN | GV | Security policy, roles, risk strategy, supply-chain risk |
| IDENTIFY | ID | Asset inventory, risk assessment, vulnerability identification |
| PROTECT | PR | IAM, data security, configuration hardening, secure SDLC |
| DETECT | DE | Logging, monitoring, anomaly detection, audit trails |
| RESPOND | RS | Incident-response readiness, communication plans |
| RECOVER | RC | Backup, resilience, continuity, disaster recovery |

Coverage is deepest in PROTECT — most cloud configuration findings (encryption, IAM, network) live there, which is normal for a posture platform. For RESPOND and RECOVER, the platform validates the technical preconditions: backups exist, logs are enabled, alerts route somewhere.

### NIST SP 800-53 (Rev 4 and Rev 5)

The federal control catalog — 20 families, roughly 1,000 controls — and the foundation FedRAMP builds on. Both Rev 4 and Rev 5 are supported. The platform maps to the 12 most cloud-relevant families:

| Control family | Code | Example checks |
| --- | --- | --- |
| Access Control | AC | Least privilege, separation of duties, account inactivity |
| Audit and Accountability | AU | Audit-log content, retention, log review |
| Configuration Management | CM | Baseline configurations, drift detection |
| Contingency Planning | CP | Backup integrity, alternate-site readiness |
| Identification and Authentication | IA | MFA, password policies, key rotation |
| Incident Response | IR | IR-plan validation, log forwarding to SIEM |
| Maintenance | MA | Maintenance access controls |
| Media Protection | MP | Storage encryption (cloud-applicable subset) |
| Personnel Security | PS | Account termination on offboarding |
| Risk Assessment | RA | Vulnerability scanning, risk-based scoring |
| System & Comm Protection | SC | Encryption in transit, segmentation, key management |
| System & Info Integrity | SI | Patch currency, malware protection |

The eight remaining families (PE, AT, CA, PL, PM, PT, SA, SR) include controls that cannot be evaluated from cloud configuration alone — they need process, documentation, or external evidence. The platform marks these "not in scope for automated evaluation" rather than failing them silently. **NIST 800-171** and **CMMC 2.0 (Level 2 and Level 3)** are supported as their own frameworks for CUI-handling and defense-industrial-base customers.

### PCI-DSS v4.0 / v4.0.1

Required for any organization that stores, processes, or transmits cardholder data. The platform automates everything except Requirement 9 (physical access), which is inherited from your cloud provider.

| Pillar | Requirements | What the platform checks | Status |
| --- | --- | --- | --- |
| Build & maintain a secure network | Req 1–2 | VPC isolation, security-group rules, NACLs, secure baselines | Automated |
| Protect account data | Req 3–4 | Encryption at rest (KMS), TLS 1.2+ in transit, key rotation | Automated |
| Vulnerability management program | Req 5–6 | Anti-malware, secure SDLC, IaC scanning, dependency CVEs | Automated |
| Strong access control | Req 7–8 | IAM least privilege, MFA, session policies, federation | Automated |
| Restrict physical access | Req 9 | Data-center physical security | Inherited from your cloud provider's AOC |
| Monitor and test networks | Req 10–11 | CloudTrail / Activity Logs / Audit Logs, WAF, IDS readiness | Automated |
| Information security policy | Req 12 | Config drift, baseline deviation, suppression governance | Automated |

The Req-9 gap is healthy: AWS, Azure, and GCP are independently audited for physical security and publish their own PCI Attestation of Compliance, which you inherit.

### HIPAA and HITRUST CSF v11.3

The platform automates the HIPAA Security Rule technical safeguards (§164.312) and evidences the administrative safeguards (§164.308) that have a technical footprint:

| Safeguard | Key areas |
| --- | --- |
| Technical — Access Control (§164.312a) | IAM, MFA enforcement, least privilege |
| Technical — Audit Controls (§164.312b) | CloudTrail, database audit logs, log retention |
| Technical — Integrity (§164.312c) | Encryption integrity, tamper detection, immutable logs |
| Technical — Transmission Security (§164.312e) | TLS 1.2+ enforcement, in-transit encryption |
| Administrative — Risk Analysis (§164.308a1) | Vulnerability scanning cadence, risk scoring |
| Administrative — Access Management (§164.308a4) | Access reviews, provisioning workflows, dormancy |

Physical safeguards (§164.310) are inherited from your cloud provider's HIPAA-eligible BAA. **HITRUST CSF v11.3** is supported as a separate framework for organizations certifying against HITRUST. Onam signs a BAA with healthcare customers on the Enterprise plan — contact legal@onam.io.

### ISO 27001:2022 family

ISO 27001:2022 reorganized the control set into 93 controls across four Annex A domains. The platform also maps **ISO 27002** (implementation guidance) and **ISO 27017** (cloud-specific controls).

| Annex A domain | Controls | Coverage character |
| --- | --- | --- |
| A.5 — Organizational | 37 | Partially evidenced via configuration (policies, supplier governance) |
| A.6 — People | 8 | Limited platform evidence (account dormancy, offboarding) |
| A.7 — Physical | 14 | Mostly inherited from your cloud provider |
| A.8 — Technological | 34 | Primary coverage — encryption, network, IAM, vulnerability, secure SDLC |

All 11 controls new in the 2022 revision are mapped, including A.5.7 (Threat Intelligence), A.5.23 (Cloud services security), A.8.9 (Configuration management), A.8.16 (Monitoring activities), and A.8.28 (Secure coding).

### GDPR and privacy regulation

GDPR is a regulatory framework, not a technical checklist. The platform maps technical controls to the articles with a direct technical implementation requirement:

| Article | Description | Technical controls mapped |
| --- | --- | --- |
| Art. 5 | Processing principles, data minimisation | Data classification, access controls, retention enforcement |
| Art. 25 | Data protection by design and by default | Encryption defaults, private-by-default storage, IAM defaults |
| Art. 32 | Security of processing | Encryption at rest and in transit, MFA, logging, vulnerability mgmt |
| Art. 33/34 | Breach notification | Logging completeness, alert routing, IR evidence |
| Art. 35 | DPIA | Risk-scoring inputs, DSPM sensitive-data discovery, exposure analysis |

Articles 12–23 (data-subject rights) and 44–50 (transfers) require process outside the platform. **LGPD** (Brazil) and **CCPA** (California) follow the same technical-mapping model.

### SOC 2 Type II

SOC 2 maps to the five Trust Services Criteria. Most cloud customers select Security, Availability, and Confidentiality.

| Criteria | Code | What the platform evidences |
| --- | --- | --- |
| Security (Common Criteria) | CC6–CC9 | Access control, encryption, change management, vulnerability management |
| Availability | A1 | Backup configuration, multi-AZ readiness, autoscaling, alarms |
| Processing Integrity | PI1 | Data-validation configuration, error-handling instrumentation |
| Confidentiality | C1 | Encryption coverage, data classification, access restriction |
| Privacy | P1–P8 | Classification, retention enforcement, consent-record integrity |

Coverage of CC6 (logical access controls) is particularly deep — it maps directly to the day-to-day cloud findings auditors expect to sample.

### FedRAMP and CMMC

FedRAMP builds on NIST 800-53. The platform evaluates the **~325 controls in the FedRAMP Moderate baseline** and supports **FedRAMP High** on Government plans, producing an SSP appendix that maps your environment to each control's status. Key automated controls include AC-2 (account management), AC-6 (least privilege), AU-2/AU-9 (audit events and protection), CM-6 (configuration settings), IA-2/IA-5 (MFA and authenticator management), RA-5 (vulnerability scanning), SC-8/SC-13 (transmission and cryptographic protection), and SI-2/SI-4 (flaw remediation and monitoring). **CMMC 2.0 Levels 2 and 3** reuse the same 800-171-derived control set for defense contractors.

### EU operational resilience — DORA, NIS2, EU AI Act

**DORA** (EU 2022/2554, enforced since January 2025) is mapped across ICT risk management, incident reporting, resilience testing, and third-party risk. **NIS2** (EU 2022/2555) covers critical-infrastructure cybersecurity obligations. The **EU AI Act** mapping draws on the AI Security engine's posture findings for Bedrock, SageMaker, Azure OpenAI, and Vertex — governance, logging, and exposure controls for AI systems.

---

## Reports and evidence

The platform produces audit-ready output in four formats, all from the same underlying data:

| Format | Best for | What it includes |
| --- | --- | --- |
| **PDF** | Hand-off to external auditor | Executive summary · per-control breakdown · evidence appendix · per-resource detail · signed timestamp |
| **CSV** | Spreadsheet review, GRC import | One row per finding × applicable framework control |
| **JSON** | SIEM / GRC tooling | Same data as CSV, structured for programmatic use |
| **Live API** | Continuous monitoring | Real-time score, trend, and drill-down |

Programmatic access uses the compliance API:

\`\`\`
GET /api/v1/compliance/framework/{framework_id}/report
\`\`\`

**Every report contains the same five sections:** the overall score with pass/fail breakdown; per-control results grouped by category so gaps are obvious; top failing rules with remediation steps; the trend over the last six scans; and resource-level detail per failing control with cloud-console links. The suppression log — every suppressed finding with its documented justification — exports alongside.

### Report schedules

| Schedule | Trigger | Use case |
| --- | --- | --- |
| On-demand | Generate immediately from the console or API | Pre-audit dry runs |
| Post-scan | Auto-generate after every scan | Daily continuous evidence — recommended |
| Weekly | Every Monday | Compliance review meetings |
| Monthly | 1st of each month | Board and executive reporting |

Reports deliver to email, Slack, S3, or any webhook endpoint you configure.

---

## Custom frameworks

Beyond the built-in catalog, you can define custom frameworks by mapping your own internal controls to platform rules — useful for proprietary standards or customer-contractual requirements.

1. Navigate to **Compliance → Frameworks → Create Custom**.
2. Define control groups (e.g. "Internal Security Standard — Section 3 — Encryption").
3. Map each control to one or more platform rules by rule ID — a rule can serve many controls.
4. Save and run a scan — the custom framework scores alongside the built-ins.

Custom frameworks get the same per-control scoring, reporting, and export capabilities as built-in frameworks.

---

## Frequently asked questions

**Can I export a framework report for my auditor?**
Yes — PDF and CSV from the Compliance Reports page, JSON and live scores from the API. PDF reports include the executive summary, control-by-control breakdown, and per-resource detail.

**What happens to my compliance score between scans?**
Scores reflect the most recent completed scan (daily by default). Run an ad-hoc scan any time to refresh — see [The scan pipeline](/docs/architecture/scanning).

**What if a control doesn't apply to my environment?**
Suppress the specific findings with a documented justification. Suppressed findings are excluded from the score and tracked in the exported suppression log — auditors see exactly what was suppressed and why.

**Can I track an older framework version?**
Yes. Multiple versions run simultaneously (e.g. NIST 800-53 Rev 4 and Rev 5, PCI-DSS v4.0 and v4.0.1). When a new version ships, the previous one stays available so you migrate without losing history.

**Are framework mappings audited?**
Every mapping is reviewed annually by an external compliance consultant, and the mapping rationale is stored alongside each rule's YAML — your auditor can read exactly why a rule maps to a control.

---

## Next steps

- [The scan pipeline](/docs/architecture/scanning) — how findings are produced before they become compliance evidence
- [Architecture overview](/docs/architecture/overview) — the Compliance engine in the context of all 29 engines
- [Platform data security and tenancy](/docs/architecture/data-security) — residency and isolation guarantees auditors ask about
- [Book a demo](/request-demo) — generate a framework report against a live demo account
`,
  },
];
