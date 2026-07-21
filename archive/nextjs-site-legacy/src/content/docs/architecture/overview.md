# Architecture Overview

The Onam CSPM platform is a multi-tenant SaaS that continuously discovers, evaluates, and monitors cloud resources across **seven cloud providers** using **read-only credentials** — no agents to install, no changes to your environment. This page explains how the platform is organized, how a scan flows from end to end, and how your data is isolated from every other tenant.

<img src="/diagrams/arch-overview.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:24px;" alt="Onam CSPM Platform Architecture — Cloud Scan Pipeline showing 7 cloud providers, 5 pipeline stages, 8 security engines, data platform and output layer" />

**What you're looking at, top to bottom:**

1. **Your cloud environments** — AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud, and any Kubernetes cluster connect via a read-only IAM role or service principal.
2. **The scan pipeline** — every connected account flows through the same five stages in order: **Discover → Inventory → Check → Threat → Analysis**.
3. **Security domains** — IAM, Network, Data Security, CIEM, Compliance, Vulnerability, Container Security, and Risk run after the core pipeline finishes.
4. **The data platform** — your findings, your inventory, and your security graph are stored in tenant-isolated databases that only your authenticated users can read.
5. **Outputs** — a single posture score (0–100), compliance reports for 13+ frameworks, prioritized findings, and step-by-step remediation guidance.

A typical scan of a 40-service AWS account completes in around **15 minutes**. Findings appear in real time as each stage completes — you don't wait for the full pipeline to see results.

---

## Security Engines

The platform runs **16+ independent security engines** organized into five pipeline stages. Each engine is a dedicated microservice responsible for one area of cloud security.

| Stage | Pipeline Order | Engine | Purpose |
|---|---|---|---|
| Onboarding | 0 | Onboarding | Credential validation, scan orchestration, account management |
| Discovery & Inventory | 1 | DI (Discovery & Inventory) | Resource enumeration, asset normalization, relationship building, posture snapshots |
| Check | 3 | Check | Rule evaluation — 1,918 CSPM rules producing PASS/FAIL per resource |
| Attack Path | 4 | Attack Path | Security graph construction, crown jewel path traversal, toxic combination detection |
| Domain Analysis | 5 | Compliance | Framework control mapping (13+ frameworks: CIS, NIST, ISO, PCI, HIPAA, SOC 2, GDPR, FedRAMP, DORA, CCPA, CSA CCM, MAS TRM, NYDFS) |
| Domain Analysis | 5 | IAM Security | Effective-permission analysis, unused access, privilege escalation paths |
| Domain Analysis | 5 | Data Security (DSPM) | PII/PCI/PHI classification across S3, RDS, BigQuery, Blob |
| Domain Analysis | 5 | Network Security | 7-layer topology analysis, VPC exposure, security group reachability |
| Domain Analysis | 5 | Encryption Security | KMS key policies, TLS configuration, certificate expiry, at-rest encryption |
| Domain Analysis | 5 | Container Security | EKS/ECS/AKS/GKE posture, K8s RBAC, image scanning |
| Domain Analysis | 5 | AI Security | SageMaker, Bedrock, Vertex AI posture and model exposure |
| Domain Analysis | 5 | Database Security | RDS, DynamoDB, Cloud SQL configuration and access control |
| Domain Analysis | 5 | CDR | Three-tier behavioral threat detection (L1 signatures, L2 baselines, L3 ML) |
| Domain Analysis | 5 | Vulnerability | Agentless CVE scanning, EPSS enrichment, KEV flagging, SBOM generation |
| Intelligence | 7 | Risk | FAIR model — dollar-denominated financial exposure scoring |
| Intelligence | 8 | Narrative | AI-generated threat narrative for each attack path |
| Code Security | — | SecOps | SAST (2,852 rules / 14 languages), DAST (479 payloads), SCA, IaC scanning |
| Technology | — | Technology Engine | 5,025 rules across 34 technologies (4 sub-engines: discovery, inventory, check, ciem) |
| Platform | — | CNAPP | Unified CNAPP posture aggregation |
| Platform | — | CWPP | Cloud workload protection posture |
| Platform | — | Pipeline Monitor | Real-time scan pipeline status and log streaming |
| Platform | — | Platform Admin | Multi-tenant org management, billing, user administration |

Every engine writes to the unified `security_findings` table (see [Unified Findings Layer](#unified-findings-layer) below). The BFF layer reads exclusively from this table — there are no per-engine report tables in the current architecture.

---

## Core Design Principles

Five non-negotiable principles drive every decision in the platform. Together they make the platform safe to deploy in regulated environments, easy to integrate, and predictable to operate.

### 1. Agentless by default

You install nothing. The platform never deploys agents on your VMs, never injects sidecars into your containers, and never adds a daemon to your Kubernetes nodes. Every scan is performed externally over read-only cloud APIs (AWS SDK, Azure Management API, GCP Cloud Asset API, etc.) using credentials you control.

**Why this matters for you:** zero blast radius from the platform itself. If you revoke our access tomorrow, your environment keeps running unchanged. There is nothing to uninstall.

### 2. Multi-tenant always

Every database query is filtered by your tenant identifier taken from the authenticated request. There are no shared tables, no cross-tenant views, and no admin "see-everything" mode. Tenant isolation is enforced independently at three layers — the API gateway, the security engines, and the database — so a bug in any one layer cannot expose another tenant's data.

**Why this matters for you:** SOC 2 and ISO 27001 auditors look for defense-in-depth on data isolation. Three independent enforcement points satisfy that requirement.

### 3. Pipeline-driven with a single scan ID

Every cloud account scan is assigned a single UUID called `scan_run_id`. That ID flows through every stage and is stamped on every finding the scan produces. Two scans of the same account produce two completely separate finding sets, each tagged by its own `scan_run_id`.

**Why this matters for you:** when you investigate "why did the score change last Tuesday?", you can pull every finding from that exact run, compare to the previous run, and see precisely what changed. Findings never "leak" between scans.

### 4. Standardized finding contract

Every security domain produces findings using the same standard fields — `finding_id`, `scan_run_id`, `account_id`, `resource_uid`, `resource_type`, `severity`, `status`, `first_seen_at`, `last_seen_at`. The contract is consistent across all CSPs and all security pillars.

**Why this matters for you:** a single API call, a single export, a single CSV download gives you the same shape of data whether the finding came from CSPM, CIEM, DSPM, or vulnerability management. There's nothing per-domain to learn.

### 5. Rule-as-code in YAML

All **10,000+ security rules** are defined in human-readable YAML and versioned in a public catalog. Each rule declares its CSP, service, severity, MITRE ATT&CK mapping, framework controls, and remediation guidance. The platform only loads and evaluates rules — it never hardcodes them in software. The catalog spans CSPM (1,918 rules), Technology Engine (5,025 rules), Code Security SAST (2,852 rules), DAST payloads (479), and domain-engine rules for IAM, CDR, data security, and more.

**Why this matters for you:** auditors can read the YAML to verify exactly what the platform checks. You can request new rules, propose changes, and see the diff between rule versions over time.

---

## Platform Components

A connected cloud account flows through a five-stage value pipeline that turns raw cloud configuration into prioritized, framework-mapped findings. This is the loop the platform repeats for every account on every scan.

<img src="/diagrams/platform-overview.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:24px;" alt="Onam CSPM — platform value flow: 7 cloud environments → 5-stage pipeline → posture dashboard, compliance reports, actionable findings" />

**Reading the diagram left to right:**

| Stage | What happens | Time per stage (40-service AWS account) |
|---|---|---|
| **1. Discover All Resources** | Enumerate every resource across 40+ services per CSP. Capture configuration. | 3–5 min |
| **2. Evaluate Security Rules** | Run all 1,918 CSPM rules against the captured configuration. Mark each as PASS or FAIL. | 4–6 min |
| **3. Detect Threats** | Map FAIL findings to MITRE ATT&CK techniques. Build attack chains. | 1–2 min |
| **4. Map to Frameworks** | Each finding is mapped to the controls it violates across CIS, NIST, ISO, PCI, HIPAA, SOC 2, and 7 more frameworks. | <1 min |
| **5. Score Risk** | Apply the FAIR model — calculate dollar-denominated exposure and a 0–100 posture score. | <1 min |

The output is three deliverables for three audiences: a **posture dashboard** for security engineers, **compliance reports** for auditors, and **actionable findings** with remediation steps for the cloud account owner.

### The ten security domains

The platform covers ten independent security domains. Each domain owns one area of cloud security and produces its own findings — together they roll up into a single posture score.

<img src="/diagrams/platform-components.svg" alt="Platform components — ten security domains" style="width:100%;max-width:960px;border-radius:10px;" />

**Domains by layer in the diagram:**

- **Web tier** — a security portal where you investigate findings, run scans, and configure your tenant; protected by SSO, RBAC, and tenant-scoped routing.
- **Core pipeline (sequential)** — Onboarding (credential validation), Discovery (resource enumeration), Inventory (asset normalization), Check (rule evaluation), Threat (MITRE mapping). These run in order because each consumes the previous stage's output.
- **Security domains (parallel)** — Compliance, IAM, Network Security, Data Security, Vulnerability, CIEM, Container Security, DB Security, AI Security, Encryption. These run simultaneously after the core pipeline finishes.
- **Intelligence layer** — Risk scoring (FAIR model), the security graph (attack-path reasoning), and an AI-generated threat narrative.

You don't enable domains individually. Once a cloud account is connected, every applicable domain runs on every scan.

---

## Scan Pipeline — How a Scan Works

A scan is a deterministic sequence of stages, each consuming the previous stage's output and producing its own findings. Every stage receives the same `scan_run_id` so all findings from a single scan can be correlated, compared to history, and rolled up into a single posture score.

<img src="/diagrams/arch-scan-pipeline.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="Scan pipeline — 7-step ordered execution with scan_run_id" />

**Walking through the pipeline step by step:**

| Step | Stage | What it does | What it produces |
|---|---|---|---|
| 1 | **Onboarding** | Validates the credential reference. Generates a `scan_run_id`. | Stored credential reference (no secret material in transit) |
| 2 | **Discovery** | Calls 40+ cloud service APIs in parallel. Captures configuration per resource. | Discovery findings — one record per resource |
| 3 | **Inventory** | Normalizes discovery output. Builds resource relationships. Detects drift vs the previous scan. | Inventory assets with parent/child links |
| 4 | **Check** | Runs all 1,918 CSPM rules against the inventory. Each rule outputs PASS or FAIL per resource. | Check findings — one record per rule × resource |
| 5 | **Threat** | Maps every FAIL to its MITRE ATT&CK technique. Builds attack chains in the security graph. | Threat findings and graph edges |
| 6 | **Security domains (parallel)** | Compliance scoring, IAM analysis, network exposure, CIEM, vulnerability correlation, container security, etc. — all read from check findings and produce domain-specific output. | Per-domain finding sets |
| 7 | **Risk** | Applies the FAIR financial model. Computes blast radius from the graph. Outputs the unified 0–100 posture score. | Risk summary with dollar exposure |

**Two important guarantees:**

- **All stages receive the same `scan_run_id`** — that single UUID is what lets you query "show me everything Onam found in the scan that ran at 09:00 UTC last Tuesday".
- **Agentless throughout** — every stage reads from cloud APIs only. Nothing executes inside your cloud account. Outbound traffic from your account to ours is zero — Onam pulls; your account does not push.

A complete pipeline for a typical AWS account with 40 services and ~5,000 resources takes around **15 minutes** end to end. Results stream into your dashboard as each stage completes — you can start triaging from minute 5.

---

## Multi-Cloud Coverage

The platform supports seven cloud providers using a read-only IAM role (AWS, OCI, Alibaba Cloud, IBM Cloud), service principal (Azure), service account (GCP), or kubeconfig (Kubernetes). The same scan pipeline and the same 1,918 CSPM rules run against every CSP — what differs is the per-CSP service catalog and the credential model.

<img src="/diagrams/arch-multi-cloud.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="Multi-cloud coverage — 7 providers with resource categories" />

**What's shown for each provider in the diagram:**

| Provider | Compute | Storage & Data | Identity & Security | Network |
|---|---|---|---|---|
| **AWS** | EC2 · EKS · Lambda · ECS · Fargate | S3 · RDS · DynamoDB · Redshift | IAM · KMS · Secrets Manager · WAF | VPC · SG · NACL · ALB · CloudFront |
| **Microsoft Azure** | VMs · AKS · Functions · Container Inst | Blob · SQL · Cosmos DB · ADX | AAD · Key Vault · Defender · NSG | VNet · NSG · Front Door · App Gateway |
| **Google Cloud** | GCE · GKE · Cloud Run · App Engine | GCS · Cloud SQL · BigQuery | IAM · KMS · Cloud Audit · Armor | VPC · Firewall · Load Balancer |
| **Oracle Cloud (OCI)** | Compute · OKE · Functions | Object Storage · DB Systems · Autonomous DB | IAM · Vault · Audit Service | VCN · Security Lists · WAF |
| **Alibaba Cloud** | ECS · ACK · Function Compute | OSS · RDS · Table Store · MaxCompute | RAM · KMS · ActionTrail · Anti-DDoS | VPC · Security Groups · WAF |
| **IBM Cloud** | VSI · IKS (IBM Kubernetes) · Code Engine | Cloud Object Storage · Db2 · Cloudant | IAM · Key Protect · Activity Tracker | VPC · Security Groups · Internet Svc |
| **Kubernetes (any)** | Clusters · Nodes · Pods · Deployments | Persistent Volumes · ConfigMaps | RBAC · Roles · ServiceAccounts | Network Policies · Ingress · Container CVEs |

**Coverage parity:** the same finding contract, the same severity grading, and the same MITRE mapping apply across all seven providers. A "publicly exposed object storage" finding on AWS S3 and on Azure Blob shows up identically in your dashboard — same severity, same control mapping, same remediation pattern.

**What we don't do:** the platform never writes, deletes, or modifies anything in your cloud account. Read-only is enforced by the IAM policy you grant — you can audit it before you enable scanning.

---

## Security Pillars

The platform covers **ten security domains**. Each one answers a specific question, produces its own findings, and feeds into the unified posture score.

<img src="/diagrams/arch-security-pillars.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="10 security pillars — independent engines unified into one posture score" />

**The ten pillars and what each one answers:**

| Pillar | Question it answers | Scale |
|---|---|---|
| **CSPM** | Are my cloud configurations compliant with my baselines? | 1,918 rules (part of 10,000+ platform-wide) |
| **CIEM** | Which identities have more access than they actually use? | Effective-permission analysis across IAM, SCPs, permission boundaries |
| **DSPM** | Where is my sensitive data and is it exposed? | PII · PCI · PHI classification across S3, RDS, BigQuery, Blob |
| **Network Security** | Which paths from the internet to my crown jewels are still reachable? | 7-layer topology analysis |
| **Container Security** | Are my Kubernetes clusters and images compromised or misconfigured? | EKS · ECS · AKS · GKE · self-managed K8s |
| **Vulnerability Management** | Which CVEs are exploitable in my live workloads? | Agentless scan · SBOM generation · EPSS · KEV |
| **AI Security** | Are my AI/ML services safe? | SageMaker · Bedrock · Vertex AI posture |
| **Attack Path & CDR** | How would an attacker move through my environment? Are there active threats? | Security graph traversal · MITRE ATT&CK + D3FEND · L1/L2/L3 detection |
| **SecOps (SAST/DAST/SCA/IaC)** | Are vulnerabilities entering my code before deploy? | 14 languages · 2,852 SAST rules · 479 DAST payloads · pre-merge gating |
| **Compliance** | What's my pass rate against my framework obligations? | 13+ frameworks (CIS, NIST, ISO, PCI, HIPAA, SOC 2, GDPR, FedRAMP, DORA, CCPA, CSA CCM, MAS TRM, NYDFS) |

**The unified posture score** is a weighted roll-up across all ten pillars, normalized to 0–100. A score of 80 means "you're materially better than 80% of comparable cloud estates we benchmark against". Each pillar contributes proportionally to its severity-weighted findings — fixing a single CRITICAL finding moves the score more than fixing 10 LOW findings.

---

## Security Model

The platform protects your data with **defense-in-depth across three independent layers** — tenant isolation, role-based access control, and read-only credential handling. Any single layer's failure cannot cause a data exposure because the other two still hold.

### Multi-Tenant Isolation

Every API request to the platform carries an `AuthContext` — a server-built object with the caller's tenant ID, role, and permissions. The platform enforces tenant isolation at three independent points so a bug in any one cannot leak another tenant's data.

<img src="/diagrams/arch-multi-tenant.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="Multi-tenant isolation — three-layer enforcement at gateway, engine, and database" />

**Reading the diagram left to right — what happens to every request:**

1. **Layer 1 — API Gateway.** The auth middleware validates your access token, looks up the user, and constructs the `AuthContext`. The token is signed; tampering invalidates it immediately. Engines never trust client-supplied identity.
2. **Layer 2 — Security Engine.** Every API route is protected by a permission check that validates the caller has the right `feature:action` permission for the operation (e.g. `findings:read`, `scans:create`). Unauthorized callers receive HTTP 403 with no data leakage in the error body.
3. **Layer 3 — Database Query.** Every read or write is filtered by your tenant ID. There is no global query path. There is no admin bypass.

**The two no-bypass guarantees:**

- **No auth-skipping flag.** There is no environment variable, no debug toggle, no support-mode switch that bypasses authentication. Reintroducing one would fail our pull-request gates.
- **No shared tables.** Findings, assets, scans, and credentials are isolated per tenant — there is no global view. Onam support staff cannot read into your tenant's findings without an explicit, fully audit-logged impersonation handshake that you must approve.

### Role-Based Access Control (RBAC)

The platform ships with **five seeded roles** and **27 permissions** in the `feature:action` format (e.g. `discoveries:read`, `scans:create`, `tenants:write`). Roles are hierarchical — higher levels inherit the read permissions of lower levels.

<img src="/diagrams/arch-rbac.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="RBAC — 5 roles with 27 permissions in feature:action format" />

**The five roles and what each can do:**

| Role | Level | Scope | Typical user |
|---|---|---|---|
| `platform_admin` | L1 | Every tenant on the platform | Onam support team only |
| `org_admin` | L2 | Every tenant within your organization | Your CISO or VP Security |
| `tenant_admin` | L4 | Full read/write within one tenant | Cloud security team lead |
| `analyst` | L4 | Read all findings, acknowledge, comment | Day-to-day security engineer |
| `viewer` | L4 | Read-only — limited to 9 non-sensitive permissions | Auditors, board reporting |

**Sensitive capabilities require the `tenant_admin` or higher role.** The `viewer` role receives HTTP 403 on Data Security, AI Security, Encryption, DB Security, Container Security, SecOps, and Vulnerability — these contain sensitive resource details (PII column samples, credential references, vulnerability paths) that should not be exposed to read-only auditors.

**SAML 2.0 SSO and SCIM provisioning** are supported on Enterprise plans. Group-to-role mappings sync from your identity provider on every login, so role changes in your directory propagate to the platform without manual user maintenance.

---

## Data Flow — Finding to Posture Score

A single cloud resource — say one S3 bucket — flows through the platform from raw configuration to a posture-score contribution. Understanding this flow tells you where every piece of information in your dashboard came from and how to trace any finding back to its source data.

<img src="/diagrams/arch-data-flow.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="Data flow — from cloud resource to finding record to unified posture score" />

**Following one S3 bucket through the pipeline:**

1. **Discovery** captures the raw bucket configuration — every property the AWS API exposes. Nothing is filtered or summarized at this stage.
2. **Inventory** normalizes the bucket into a standard asset record — common fields like `resource_uid`, `region`, and tags become first-class. Relationships are extracted (e.g. "this bucket is referenced by these Lambda functions"). Drift vs the prior scan is tagged.
3. **Check** evaluates every applicable rule (e.g. "S3 public access blocked", "S3 default encryption enabled", "S3 versioning enabled") against the configuration. Each rule produces a PASS or FAIL.
4. **Threat** takes every FAIL and asks: does this map to a MITRE ATT&CK technique? If "S3 public access blocked = FAIL" and the bucket holds PII, that's a candidate for technique `T1530 Data from Cloud Storage Object`. The threat engine writes this into the security graph.
5. **Compliance** maps the FAIL to framework controls. The same single FAIL on "S3 public access blocked" appears in **CIS AWS 2.1.5**, **NIST SP 800-53 SC-7**, **PCI-DSS 1.3.4**, **HIPAA §164.312**, and **SOC 2 CC6.1** — one finding, five framework citations, all auto-mapped.
6. **Risk** weights the finding by severity, blast radius (how many other resources depend on this bucket), and asset criticality (does this resource expose PII?). The result contributes to the 0–100 posture score and a dollar-exposure estimate using the FAIR model.

**Every finding record carries a standard set of fields** regardless of which security domain produced it. This is what enables cross-domain queries, exports, and a unified dashboard:

| Field | What it is | Why it matters |
|---|---|---|
| `finding_id` | Deterministic SHA-256 hash of (rule_id, resource_uid, scan_run_id) | Same finding gets the same ID across re-scans → ack/snooze/suppress survive rescans |
| `scan_run_id` | UUID tagging every finding from a single scan | "What changed between Tuesday's scan and today's?" answerable with one diff |
| `account_id` | The cloud account this finding belongs to | Filter by account in multi-cloud organizations |
| `resource_uid` | Globally unique cloud resource identifier (ARN, Resource ID, etc.) | Click-through navigation to the resource in your cloud console |
| `resource_type` | Normalized type (e.g. `aws_s3_bucket`, `azure_storage_account`) | Filter "show me all S3 issues" cross-account |
| `severity` | `CRITICAL` · `HIGH` · `MEDIUM` · `LOW` · `INFO` | Drives default sort order in dashboards |
| `status` | `PASS` · `FAIL` · `UNKNOWN` | `UNKNOWN` flags resources where data was insufficient — never silently skipped |
| `first_seen_at` | When this finding was first detected | Aging analysis — "this has been open 47 days" |
| `last_seen_at` | Most recent scan that observed this state | Auto-resolution — finding closes when no longer observed |

You can pull any of these fields via the API, CSV/Parquet export, or webhook delivery. See the [API Reference](/docs/reference/api-reference/) for the full schema.

---

## Unified Findings Layer

All 16+ engines write to a single `security_findings` table in the DI database (`threat_engine_di`). This is the canonical source of truth for every finding on the platform. The BFF layer reads exclusively from this table — there are no per-engine report tables in the current architecture (all were retired in June 2026).

### security_findings Table

Every engine upserts findings into this table using a shared helper (`shared/common/security_findings_writer.py`). The upsert key is `(tenant_id, account_id, rule_id, resource_uid)`:

| Column | Description |
|---|---|
| `finding_id` | Deterministic UUID — stable across re-scans |
| `tenant_id` | NOT NULL — primary multi-tenant isolation key |
| `customer_id` | Customer within the tenant |
| `account_id` | Cloud account ID |
| `provider` | aws / azure / gcp / oci / alibaba / ibm / k8s |
| `region` | Cloud region (DEFAULT `'global'` for IAM/S3/global services) |
| `scan_run_id` | Argo DAG run ID — traceability to the exact pipeline execution |
| `engine` | Source engine name (e.g. `iam`, `network`, `container`) |
| `rule_id` | Rule catalog ID |
| `resource_uid` | Globally unique resource identifier (ARN, resource ID, etc.) |
| `resource_type` | Normalized type (e.g. `aws_s3_bucket`) |
| `severity` | CRITICAL / HIGH / MEDIUM / LOW / INFO |
| `status` | PASS / FAIL / UNKNOWN |
| `title` | Human-readable finding title |
| `description` | Full finding description |
| `remediation` | Step-by-step fix guidance |
| `first_seen_at` | When first detected |
| `last_seen_at` | Most recent scan that observed this state — auto-closes when no longer observed |
| `mitre_technique` | MITRE ATT&CK technique ID (e.g. `T1530`) |

**Auto-resolution:** a finding is marked `PASS` when the next scan of the same resource no longer triggers the rule. The `last_seen_at` timestamp is updated on every scan; findings not seen for 30 days are auto-closed.

### posture_snapshot Table

Engine-level posture summaries are stored in `posture_snapshot` (also in `threat_engine_di`). This replaces all retired `*_report` tables. Every engine writes one row per scan using `write_posture_snapshot(conn=di_conn, engine='<name>')`.

| Column | Description |
|---|---|
| `engine` | Engine name |
| `tenant_id` | Tenant |
| `scan_run_id` | Run that produced this snapshot |
| `total_findings` | Total findings from this engine in this run |
| `critical_count` | Count of CRITICAL severity findings |
| `high_count` | Count of HIGH severity findings |
| `posture_score` | 0–100 score for this engine domain |
| `snapshot_at` | Timestamp |

Engine status endpoints (`/api/v1/{engine}/status`) read from `posture_snapshot WHERE engine=X` — never from dropped report tables.

---

## Platform Reliability & Data Residency

The platform is delivered as managed SaaS — you don't operate any infrastructure, install any agents, or manage any servers. What you control is your tenant configuration, your users, your SSO settings, and your cloud account connections.

### Reliability

| Component | Target |
|---|---|
| Platform availability | **99.9%** monthly uptime SLA on Pro and Enterprise plans (99.95% on Enterprise+) |
| Scan completion (40-service AWS account) | **≤ 15 minutes** end to end (SLO) |
| API p95 latency | **≤ 500 ms** for read endpoints |
| Findings delivery | Real-time stream as each domain completes — full results within the 15-minute SLO |

A live status page and historical incident reports are available at [status.onam.io](https://status.onam.io). Maintenance windows are announced 7 days in advance and scheduled outside business hours for your region.

### Data Residency

The platform supports tenant-scoped data residency — your findings, inventory, and security graph data are stored in the region you select. Available regions:

| Region | Coverage | Plans |
|---|---|---|
| `ap-south-1` (Mumbai) | India · APAC | All plans |
| `eu-west-1` (Ireland) | EU · UK · GDPR-residency requirement | Enterprise |
| `us-east-1` (N. Virginia) | US · Americas | All plans |
| `us-gov-west-1` | US Federal · ITAR · FedRAMP | Government / FedRAMP plans |

Cross-region data access is blocked by tenant policy. Backups stay within the same region as primary storage. We never replicate findings or inventory across regions without your explicit consent.

### Disaster Recovery

| Metric | Target |
|---|---|
| Recovery Point Objective (RPO) | **15 minutes** — backups every 15 min |
| Recovery Time Objective (RTO) | **2 hours** — full restore window |
| DR test cadence | Quarterly, with a public report on the [Trust Center](/docs/trust/trust-center/) |

---

## Frequently Asked Questions

**Does the scanner modify any cloud resources?**
No. Every stage uses read-only IAM roles or API credentials. The platform never writes to, deletes from, or modifies your cloud environment. The IAM policy you grant explicitly excludes write actions — you can audit it before enabling.

**How is my data isolated from other tenants?**
Three independent enforcement layers: (1) the API gateway verifies the request and builds the auth context, (2) the security engine validates required permissions, (3) every database query filters by your tenant ID. There are no shared tables, no cross-tenant views, and no admin bypass.

**How often does the platform scan?**
Default is once per day per cloud account. You can configure scans up to four times per day on Pro plans, and on demand at any time. Real-time event-driven scanning is on the roadmap for late 2026.

**What credentials does the platform need?**
A read-only IAM role (AWS), service principal (Azure), service account (GCP), or equivalent per provider. Credentials are stored encrypted in a managed secret store and rotated on the policy you set. We never store cloud account passwords or long-lived access keys in databases.

**Where is my data stored?**
In the region you select during tenant creation — see [Data Residency](#data-residency) above. Backups stay within the same region. No cross-region replication without your explicit consent.

**What happens when a scan fails?**
The pipeline marks the failed stage and continues. Findings from successful stages are still surfaced. Failed scans are logged with full root-cause context. You can re-trigger a failed scan from the UI without affecting the prior scan's data.

**Can I export my data?**
Yes. The full finding history and inventory can be exported as JSON, CSV, or Parquet via the API. Compliance reports export as PDF. You retain ownership of all data — see the [Data Retention Policy](/docs/trust/data-retention/) for retention windows and deletion mechanics.

**Is the platform SOC 2 / ISO 27001 certified?**
SOC 2 Type II ✅, ISO 27001 ✅, ISO 27701 ✅, PCI DSS v4 ✅. Pentest report and CAIQ available under NDA. See the [Trust Center](/docs/trust/trust-center/).

---

*Last updated: 2026-06-24*
*For questions: support@onam.io*
