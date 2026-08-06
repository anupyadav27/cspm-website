import type { DocArticle } from "./types";

export const articles: DocArticle[] = [
  {
    slug: "release-notes",
    title: "Release Notes",
    breadcrumb: "Release Notes",
    body: `
Everything that shipped in the Onam platform, newest first. Each month covers new engines and features, changed behavior, fixes, deprecations, and anything that requires action on your side (almost nothing does — Onam is SaaS-deployed and upgrades are transparent).

> **Release cadence:** monthly, published on the first business day of each month. **Changelog format:** New · Changed · Fixed · Deprecated · Breaking. For real-time deployment progress, see [status.onam.io](https://status.onam.io).

![The Onam console dashboard after the July 2026 release (demo account)](/screenshots/screenshot-dashboard.png)

## July 2026

Headline changes this month: Attack Path v2 on a Neo4j graph with a first-class choke-points view, CDR relaunched as Behavioral Analysis with three-tier detection across all 7 providers, the master rule registry crossing 10,000 rules with 78 framework mappings, regulatory and breach-cost modeling in the FAIR risk engine, and a completely new website and documentation portal.

### Attack Path v2

Attack Path v2 replaces the June 2026 graph engine with a rebuilt architecture on a Neo4j property graph. Paths are computed by BFS traversal from exposed entry points to crown jewels, with edges derived from a catalog of ~25 derivers (IAM policy, network exposure, security-group rule match, KMS access, CDR behavioral signals, public exposure, and more).

**What's new:**

- Neo4j property graph replaces the previous relational graph store — path queries that took seconds now return interactively
- Every edge is verified across 5 security domains before it is marked **CONFIRMED**; unverified edges never appear in a path
- Per-hop MITRE ATT&CK technique chains — each hop in a path carries the specific techniques an attacker would use, with capability accumulation along the path
- **Choke points** are now first-class: the new choke-points view ranks the **Top 5 choke points** — single fixes that sever the largest number of attack paths
- Crown-jewel and entry-point classification is catalog-driven, so newly discovered asset types are classified automatically
- New console views: attack path list, full path detail, and choke points, served by \`GET /api/v1/attack-paths\`

![The Attack Path v2 graph view in the Onam console (demo account)](/screenshots/screenshot-attack-path.png)

> Pro tip: start remediation from the choke-points view, not the path list. Fixing the #1 choke point typically severs more paths than fixing the five highest-severity individual findings.

### CDR is now Behavioral Analysis

The CDR engine has been renamed **Behavioral Analysis** and expanded from a subset of log sources to audit and activity logs from **all 7 providers**. Console navigation and the \`/api/v1/cdr\` API prefix are unchanged — only the product name and coverage changed.

Detection runs in three tiers:

- **L1 — single-event rules**: individual audit events matched against threat, CIEM, and data-security detection rules
- **L2 — multi-event correlation**: scenarios that correlate sequences of events into a single detection
- **L3 — statistical baselines**: per-entity behavior baselines that flag deviations without a predefined rule

Log source coverage:

| Provider | Audit log source |
| --- | --- |
| AWS | CloudTrail (via CloudWatch and S3) |
| Azure | Azure Monitor + Blob Storage |
| GCP | Cloud Audit Logs (via GCS) |
| OCI | OCI Audit |
| Alibaba Cloud | ActionTrail |
| IBM Cloud | IBM Cloud Object Storage |
| Kubernetes | Kubernetes audit logs (via Discovery & Inventory) |

![The Behavioral Analysis view in the Onam console (demo account)](/screenshots/screenshot-cdr.png)

### Rule catalog passes 10,000 rules; framework mappings reach 78

The master rule registry now contains **10,864 rules**:

| Target | Rules | Coverage |
| --- | --- | --- |
| AWS | 2,278 | 157 services |
| Azure | 3,741 | 112 services |
| GCP | 2,676 | 47 services |
| OCI | 1,451 | 42 services |
| Kubernetes | 718 | 51 resource kinds |

Rule metadata additionally covers Alibaba Cloud (1,541 rules) and IBM Cloud (613 rules), and the CIEM engine ships its own identity-specific rule set: AWS 530, Azure 202, GCP 176, Alibaba Cloud 114, IBM Cloud 110, OCI 107, Kubernetes 103.

Framework mappings expanded to **78 compliance frameworks**, including CIS Benchmarks, NIST CSF 2.0, NIST 800-53 R4/R5, NIST 800-171, PCI-DSS v4.0/4.0.1, HIPAA/HITRUST CSF v11.3, ISO 27001/27002/27017 (2022), SOC 2, GDPR, NIS2, EU AI Act, DORA, FedRAMP High/Moderate, CMMC 2.0, SWIFT CSCF, and CSA CCM v4. See [Framework Coverage](/docs/compliance/frameworks) for the full list.

### FAIR risk engine: regulatory multipliers and per-record cost benchmarks

The Risk Quantification engine (Risk = LEF × LM, per the FAIR standard) now models regulatory exposure and industry breach costs directly in every loss estimate. It runs as Layer 4 after all other engines: ETL over Critical and High findings, then Evaluate, then Report.

Regulatory multipliers — the highest single applicable multiplier is applied:

| Regulation | Multiplier |
| --- | --- |
| GDPR | ×1.5 |
| SOX | ×1.4 |
| HIPAA | ×1.3 |
| PCI-DSS | ×1.2 |
| CCPA / APPI / PDPA / PIPEDA | ×1.1 |

Per-record cost benchmarks, sourced from the IBM Cost of a Data Breach Report 2024:

| Industry | Cost per record |
| --- | --- |
| Healthcare | $10.93 |
| Finance | $6.08 |
| Technology | $4.88 |
| Retail | $3.28 |
| Default (all others) | $4.45 |

Data-sensitivity multipliers remain tenant-overridable: restricted ×3.0, confidential ×2.0, internal ×1.0, public ×0.1. See [Risk Quantification](/docs/features/risk-quantification) for the full model.

### New website and documentation portal

- Completely new marketing site and this documentation portal, replacing the legacy Next.js site
- An **interactive product tour** is embedded on every product page — walk through the console without creating an account, or [Book a demo](/request-demo) for a guided session
- Release notes are now a single consolidated page (this one), newest first

---

## June 2026

A major platform release: four new security engines, a unified findings architecture, and a complete overhaul of the posture snapshot and data pipeline — the consolidation from 11 single-purpose engines toward today's 29-engine platform.

### New engine: Attack Path Analysis

The Attack Path engine replaced the retired threat-v1 engine with a ground-up rewrite purpose-built for graph-based security analysis.

**What's new:**

- Security graph built from all posture, identity, network, and vulnerability findings
- Crown jewel path analysis — every route from exposed entry points to tagged critical assets
- Toxic combination detection — automatically surfaces pairs and triples of Medium findings that together create Critical blast radius
- MITRE ATT&CK technique tagging on every graph node and edge
- Interactive attack path visualizer in the Onam console
- Integration with the Risk engine — every attack path terminus carries a FAIR dollar exposure estimate

> **Migration note:** the retired \`engine-threat\` and \`engine-threat-v1\` deployments were removed. Attack path findings moved to the \`attack_paths\` table in the \`threat_engine_attack_path\` database. This engine was itself superseded by Attack Path v2 in July 2026 — see the July entry above.

### New engine: CDR — Cloud Detection & Response

Three-tier behavioral threat detection running as an independent continuous pipeline, outside the main scan DAG. (Renamed **Behavioral Analysis** in July 2026.)

**What's new:**

- L1 single-event detection rules across CloudTrail, VPC Flow, and Kubernetes audit logs
- L2 multi-event correlation scenarios that stitch related events into one detection
- L3 statistical behavior baselines for novel threats with no predefined signature
- Full MITRE ATT&CK for Cloud mapping on all detections
- Automatic incident correlation across detection tiers
- Slack, PagerDuty, and email alerting with full context
- Response playbooks linked from every incident

### New engine: Risk Quantification (FAIR model)

The Risk engine runs the full FAIR pipeline on every finding, outputting dollar-denominated financial exposure estimates.

**What's new:**

- FAIR model scoring: P50 and P90 loss estimates for every open finding
- Regulatory fine projection: GDPR, HIPAA, PCI-DSS, and SOX exposure per finding
- Data-sensitivity loss multipliers: restricted ×3.0, confidential ×2.0, internal ×1.0, public ×0.1 (tenant-overridable)
- Blast radius quantification: assets, users, and data records at risk
- Risk reduction ranking: remediation queue ordered by dollar exposure eliminated
- Executive dashboard: total exposure, top-10 risks, 90-day trend
- Full integration with the Attack Path engine

### New engine: Code Security (SecOps)

Unified code security platform with SAST, DAST, SCA, and IaC scanning.

**What's new:**

- SAST: semgrep-based static analysis across 7 languages
- DAST: 479 active test payloads across 12 vulnerability classes
- SCA: full dependency graph with CVE + EPSS + KEV enrichment
- IaC: Terraform, CloudFormation, Helm, Kubernetes manifests, ARM templates, Bicep, Pulumi
- CycloneDX SBOM generation for all repositories and services
- AI-powered fix suggestions with cloud-context awareness
- CI/CD blocking gates for GitHub Actions, GitLab CI, Jenkins, CircleCI
- Findings correlated with cloud posture for context-aware severity boosting

### Technology Engine v2

The Technology Engine was significantly expanded.

**What's new:**

- **5,025 detection rules** (up from ~2,000) across 40 self-hosted technologies in 10 categories — databases, Linux/OS, network devices, web servers, virtualization, containers, DevOps, collaboration, data platforms, and middleware
- 4 sub-engines now running independently: tech-discovery, tech-inventory, tech-check, tech-ciem
- CIEM behavioral analysis integrated via the tech-ciem sub-engine
- Runtime technology inventory correlated with CVE data for version-aware vulnerability detection
- Supported technologies include Java, Python, Node.js, Go, Ruby, PHP, .NET, Nginx, Apache, Redis, PostgreSQL, MySQL, MongoDB, Elasticsearch, Kafka, and RabbitMQ

### Unified security findings layer

All engines now write to a single \`security_findings\` table in the DI database, replacing the previous per-engine report tables (all retired).

**Impact:**

- Unified findings view across all engines in a single query
- Cross-engine finding correlation — for example, a CVE finding plus an IAM finding on the same resource
- Consistent \`last_seen_at\` tracking across all finding types
- The BFF layer reads exclusively from \`security_findings\` — no engine-specific report tables

Retired tables (all dropped June 2026):

\`\`\`
iam_report, network_report, datasec_report, compliance_report,
cdr_report, container_sec_report, dbsec_report, encryption_report,
ai_security_report, risk_report, risk_summary, risk_trends,
risk_input_transformed
\`\`\`

### Discovery & Inventory consolidation

Shipped in May 2026, documented in June: the DI engine is the single source of truth for all asset inventory, replacing the retired discoveries and inventory engines.

- \`asset_inventory_*\` tables replace all retired discovery and inventory tables
- \`asset_relationships\` stores all cross-engine relationship data
- \`posture_snapshot\` replaces all \`*_report\` tables for engine status
- \`resource_security_posture\` stores per-resource posture scores
- Retired engines \`engine-discoveries\`, \`engine-inventory\`, \`engine-threat\`, and \`engine-threat-v1\`: Kubernetes deployments removed and databases dropped

### Scope column standardization

All findings tables now carry 6 mandatory scope columns. Findings tables without all 6 are rejected at the quality gate.

| Column | Description |
| --- | --- |
| \`tenant_id\` | NOT NULL — primary isolation key |
| \`customer_id\` | Customer within tenant |
| \`account_id\` | Cloud account ID |
| \`provider\` | aws / azure / gcp / oci / alibaba / ibm / k8s |
| \`region\` | Cloud region (DEFAULT 'global' for global services) |
| \`scan_run_id\` | Argo DAG run ID for traceability |

### Rule count

With June's engine additions, the combined catalog crossed **10,000 active detection rules**. Counts that remain stable as of this release:

| Engine | Rules |
| --- | --- |
| Cloud posture (master rule registry) | 10,000+ |
| Technology Engine | 5,025 |
| DAST payloads | 479 |
| IAM Security | 57 |
| Data Security | 62 |

Behavioral detection content (CDR) is database-managed and updated continuously, so it is not counted here. See the July 2026 entry above for the current per-provider registry breakdown.

### Fixed

- **Attack path**: fixed duplicate node naming in the attack path graph causing display errors in the path visualizer
- **Compliance**: fixed stuck scans caused by a rule-control-mapping data gap — 565 previously invisible failing controls now visible
- **AI Security**: fixed Bedrock API error handling (4-bug chain); 510 AI findings now flowing to \`security_findings\`
- **Network Security**: fixed INSERT-only path for network findings — now upserts with \`last_seen_at\` tracking
- **Narrative engine**: fixed infinite scan poll loop; fixed the discoveries-to-DI database migration; silenced rule-control-mapping noise

---

## May 2026

This month's release focused on three themes: **discovery catalog completeness** (165 cloud resources backfilled), **investigation journey UX** for inventory and the threat center, and the **SecOps engine** (code-repo onboarding, account-ID propagation, security-blocker remediation).

| Highlight | What changed | Where it shows up |
| --- | --- | --- |
| 165 cloud resources backfilled | IBM Cloud (99 types) and Kubernetes (66 types) now have complete catalog entries — every discovery emits a normalized item record | Inventory asset list shows full type coverage for IBM and K8s |
| Investigation journeys | Asset-centric journey for Inventory · attack-path-first journey for Threat Center · 5 new tabs per asset | Click any asset or attack path for the new side-panel view |
| SecOps engine | VCS provider tiles for GitHub / GitLab / Bitbucket / Azure Repos · account-ID propagation across SAST, DAST, and SCA findings · Q1 audit blockers cleared | Onboarding → Code Repositories shows VCS tiles with status |
| Technology engine | Linux support — package managers, installed software inventory, OS config, kernel parameters · ~150 new tech rules | Tech Discovery and Tech Check now include Linux workloads |
| Billing engine | Commercial subscription management, payment integration, audit trail | Settings → Billing shows the full subscription lifecycle |

### Discovery engine

**New**

- **IBM Cloud catalog backfill** — 99 IBM Cloud resource types that previously lacked a canonical catalog entry now emit a complete record, including VPC, VSI, Cloud Object Storage, IAM, Key Protect, Activity Tracker, and IBM Kubernetes Service workloads
- **Kubernetes catalog backfill** — 66 Kubernetes resource types (ClusterRoles, NetworkPolicies, PersistentVolumes, Ingress, HPA, PodDisruptionBudgets, and others) now emit complete catalog items

**Changed**

- Catalog-completeness check added to internal release validation — the release fails if any new discovery type is missing a catalog entry, preventing this regression class entirely
- 5 nested-envelope bugs fixed where discovery payloads were double-wrapped, affecting payload structure for some Kubernetes and IBM resource types

### Inventory engine

**New**

- **Asset investigation journey** — clicking any asset in the inventory table opens a side panel with 5 tabs: Overview, Findings, Relationships, CIEM, and History. Replaces the previous flat detail view.

**Changed**

- **CIEM tab** added to the asset side panel — shows effective permissions and unused entitlements for identity resources (users, roles, service accounts)

### Threat engine

**New**

- **Threat center investigation journey** — attack-path-first view. Clicking an attack path opens a full-screen investigation panel with the attack path graph plus Techniques (MITRE ATT&CK detail), Affected Resources, and Remediation tabs.
- **Node investigation panel** — click any node in the security graph for a contextual panel showing the node's findings, connected nodes, and blast radius
- **Technique detail modal** — drill into any MITRE ATT&CK technique for description, detection logic, and remediation guidance

**Fixed**

- **Security graph build endpoint** — resolved a high-priority issue where graph build could return findings from other tenants under specific timing conditions. Tenant-isolation tests added to the regression suite.

### SecOps engine

**New**

- **VCS provider tiles** — the onboarding UI shows GitHub, GitLab, Bitbucket, and Azure Repos as visual tiles with connection status
- **Account ID flow** — \`account_id\` is now correctly propagated through all SAST, DAST, and SCA finding records, enabling cross-domain correlation with discovery and check findings

**Fixed**

- Security blockers from the Q1 audit resolved — input validation on repository URLs, SSRF prevention on webhook callbacks, tenant isolation on shared scanner workloads

### Technology engine

**New**

- **Linux technology support** — technology discovery and check now scan Linux-based workloads: package managers (apt, yum, rpm), installed software inventory, OS configuration, and kernel parameters. Adds ~150 new technology rules.

### Billing engine

**New**

- **Commercial subscription management** — full subscription lifecycle (create, upgrade, downgrade, cancel, refund) with audit trail
- **Payment integration** — secure tokenized payment processing with PCI DSS-compliant handling
- **Audit trail** — every billing action is recorded in the audit log per SOC 2 requirements and is available for export

### API, integrations, and platform fixes

- **Encryption enrichment loops resolved** — dashboard views no longer time out on tenants with large numbers of KMS keys
- **Security group fallback corrected** — the network topology view now returns correct effective exposure when security-group rules reference other security groups rather than CIDR blocks
- **Platform admin default tenant** — \`platform_admin\` users with no explicit tenant assignment no longer receive a 500 error on first login
- **Container Security permission key corrected** — \`container_security:read\` renamed to \`container:read\`; the RBAC gate was blocking the \`analyst\` role from accessing container findings
- **CWPP null-handling** — \`rule_id\` and \`title\` can be null for certain resource types in serverless and runtime aggregation; the engine now handles null values cleanly

### Breaking changes and deprecations

None this month.

### Upgrade notes

All engines deploy independently. Customers take no upgrade action — the platform handles deployments transparently during the published maintenance window. The internal deploy order (for transparency):

| Order | Engine | Notes |
| --- | --- | --- |
| 1 | Discovery | Catalog backfill — must precede inventory |
| 2 | Inventory | Asset investigation journey · consumes new catalog items |
| 3 | Check | No changes — included for ordering hygiene |
| 4 | Threat | Investigation journey + tenant-isolation fix |
| 5 | All domain engines | Order-independent after Threat |
| 6 | API Gateway / BFF | Consumes new domain engine outputs |

Self-hosted Enterprise customers: your account manager coordinates the deploy window with your team.

### Previewed at the time as "Upcoming in June 2026"

As published in May; most of these shipped in the June and July releases above.

| Feature | Surface | Status in May |
| --- | --- | --- |
| Auth & registration wizard | Platform | Planned |
| Onboarding revamp — tenant-first flow | Onboarding | Design |
| Security graph — CVE nodes integration | Threat | In development |
| Config-based discovery (cloud-native event-driven scanning) | Discovery | Design |
| Onam CLI scanner | SecOps | Planned |
| Trust Center automation | Platform | In development |

> Published 2026-05-09. For questions about a specific change, contact support@onam.io; to report a regression, open a support ticket from your account dashboard.

---

## Next steps

- [Attack Path](/docs/features/attack-path) — how the v2 graph, choke points, and MITRE chains work
- [CDR / Behavioral Analysis](/docs/features/cdr) — the three-tier detection model in depth
- [Risk Quantification](/docs/features/risk-quantification) — the full FAIR model, multipliers, and benchmarks
- [Quickstart](/docs/getting-started/quickstart) — connect your first cloud account in about 15 minutes
`,
  },
];
