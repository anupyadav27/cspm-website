import type { DocArticle } from "./types";

/**
 * Onam Security — the product overview. This was the body of
 * getting-started/introduction until 2026-10-06, when the introduction became the
 * platform's (four products plus AIOps). The security depth moved here unchanged.
 */
export const articles: DocArticle[] = [
  {
    slug: "security/overview",
    title: "Onam Security",
    breadcrumb: "Onam Security / Overview",
    body: `
**Onam Security** is the security product of the Onam platform — a **cloud-native application protection platform (CNAPP)**. Posture scanning connects through read-only cloud roles; agentless workload scanning runs inside your account. Onam builds an inventory of every resource, evaluates it against **9,853 posture rules**, and correlates posture, identity, data, network, workload, and runtime signals on **one security graph**. The result is a single prioritized queue of findings — with attack paths and FAIR-style dollar loss estimates — instead of eight disconnected consoles.

This page explains what Onam Security does, which environments it covers, who it is built for, and where its documentation lives. For the platform as a whole — Estate, Security, FinOps, DRM and AIOps — start with the [Introduction](/docs/getting-started/introduction).

![The Onam dashboard — posture score, severity counts, top risks, and compliance summary in one view (demo account)](/screenshots/screenshot-dashboard.png)

## What Onam Security does

Connecting one cloud account activates every capability — there are no per-module agents, sidecars, or separate deployments. Each capability is a set of engines reading from the same inventory and writing findings to the same data model.

| Capability | Question it answers | Docs |
| --- | --- | --- |
| CSPM | Which of my cloud configurations are insecure right now? | [CSPM](/docs/features/cspm) |
| CIEM | Who can access what — and should they still be able to? | [CIEM](/docs/features/ciem) |
| CDR | Is someone actively doing something malicious in my accounts? | [CDR](/docs/features/cdr) |
| Attack Path | Which combinations of issues let an attacker reach my crown jewels? | [Attack Path](/docs/features/attack-path) |
| Data Security (DSPM) | Where is my sensitive data, and what is it exposed to? | [Data Security](/docs/features/data-security) |
| Vulnerability Management | Which CVEs matter, ranked by real exploitability? | [Vulnerability Management](/docs/features/vulnerability-management) |
| Compliance | How do I score against CIS, NIST, PCI-DSS, and 78 other frameworks? | [Compliance](/docs/features/compliance) |
| Risk Quantification | What is my exposure in dollars, using the FAIR model? | [Risk Quantification](/docs/features/risk-quantification) |

Supporting these are container security, network security, encryption, database security, AI security, API security, IaC scanning, and application security (SAST, DAST, SCA) — the full engine list is in the [Architecture Overview](/docs/architecture/overview).

## One platform, one graph

Most security stacks bolt together a posture scanner, an identity tool, a data classifier, and a log-analytics product — then leave you to correlate their alerts by hand. Onam runs **29 engines** against one shared data model instead:

1. Discovery and Inventory (DI) enumerates every resource and writes \`asset_inventory\` and \`asset_relationships\`.
2. Every engine — posture, identity, data, network, runtime — evaluates the same inventory and attaches findings to the same resource identifiers.
3. Attack Path v2 loads assets, relationships, and findings into a Neo4j property graph and traverses it from internet-facing entry points to crown-jewel assets.
4. Risk Quantification runs last, giving Critical and High findings a FAIR-style loss estimate in dollars — low, likely and high — raised for findings on attack paths.

![The Onam platform — 7 clouds in, one security graph, prioritized findings out](/diagrams/platform-overview.svg)

Because everything lands on one graph, a public S3 bucket, an over-privileged role that can read it, and the PII inside it surface as **one attack path** — not three unrelated alerts in three tools.

## Coverage: 7 clouds and 34 technologies

Onam scans seven cloud targets with provider-specific rule sets:

| Cloud | Posture rules | Coverage |
| --- | --- | --- |
| AWS | 2,278 | 157 services |
| Azure | 3,319 | 112 services |
| Google Cloud | 2,676 | 47 services |
| Oracle Cloud (OCI) | 1,451 | 42 services |
| Alibaba Cloud | 1,541 | Core services |
| IBM Cloud | 613 | Core services |
| Kubernetes | 718 | 51 resource kinds |

Beyond the clouds, the **Technology Engine** scans **34 self-hosted technologies in 9 categories** — databases, Linux and OS, network devices, web servers, virtualization, containers, DevOps tooling, SaaS platforms, and data platforms — so the PostgreSQL server in your datacenter is held to the same standard as the RDS instance next to it.

Findings map to **78 compliance frameworks**, including CIS Benchmarks, NIST 800-53, NIST 800-171, PCI DSS, HIPAA, ISO 27001:2022, SOC 2, GDPR, FedRAMP Moderate and High, RBI and Canada PBMM. See [Framework Coverage](/docs/compliance/frameworks) for the full list.

## Agentless by design

Onam connects through a **read-only IAM role (AWS), service principal (Azure), or service account (GCP and others)** — no agents on your workloads, no network changes, no write access. Credential references are stored in AWS Secrets Manager and encrypted with KMS; the platform never holds long-lived keys when a role-based option exists.

> The one optional exception: OS-level vulnerability scanning can use a lightweight host agent (\`onam-agent\`) on Linux, macOS, or Windows for package-level depth. The cloud connection itself is always agentless — the agent is opt-in and only for host vulnerability data.

## Who Onam Security is for

- **Security engineers** — one queue of deduplicated, graph-prioritized findings with concrete remediation, instead of alert triage across per-cloud native tools.
- **Compliance and GRC teams** — continuous scoring against 78 frameworks with per-control evidence, replacing quarterly spreadsheet audits.
- **CISOs and leadership** — a posture score, top risks, and FAIR-based dollar exposure that translate directly into board reporting.
- **DevOps and platform teams** — findings tied to the exact resource, region, and account, with CLI, Terraform, or console remediation steps.

## Where the security documentation lives

| Section | What you'll find | Start with |
| --- | --- | --- |
| Security features | Deep dives on every capability, engine by engine | [CSPM](/docs/features/cspm) |
| Data security (DSPM) | Discovery, classification, access mapping and lineage for sensitive data | [DSPM overview](/docs/dspm/overview) |
| Code security | SAST, secrets, IaC, dependencies, DAST and AI Code Fix | [Code security overview](/docs/code-security/overview) |
| Identity (CIEM) | Effective permissions, finding types and right-sizing | [CIEM overview](/docs/ciem/overview) |
| Compliance | Framework catalog and how control scoring works | [Framework Coverage](/docs/compliance/frameworks) |
| Security architecture | How the engines, scan pipeline, and data model fit together | [Architecture Overview](/docs/architecture/overview) |
| Reference | REST API, finding schema, integrations, RBAC and SSO | [API Reference](/docs/reference/api) |

## Next steps

- [Quickstart](/docs/getting-started/quickstart) — go from zero to your first findings.
- [Core Concepts](/docs/getting-started/core-concepts) — assets, findings, engines, attack paths, and the glossary.
- [Architecture Overview](/docs/architecture/overview) — how a scan actually flows through the platform.
- [Book a demo](/request-demo) — see the platform on your own cloud with an engineer.
`,
  },
  {
    slug: "security/capability-matrix",
    title: "Onam Security capability matrix",
    breadcrumb: "Onam Security / Capability matrix",
    body: `
The 26 capabilities of Onam Security in one table: what each does, how far it reaches, and the limit we state openly.

Each row links to its product page. **Available with limits** means the capability ships today and has a boundary a buyer should know before relying on it. For the features inside each capability, see [Features by capability](/docs/security/features-by-capability).

## Posture & Identity

| Capability | What it does | Status | Reach | Stated limit |
| --- | --- | --- | --- | --- |
| [CNAPP](/platform/cnapp) | Combines seven pillar scores (misconfiguration, detection and identity, workloads, data, network, threat, application security) into one 0–100 posture score. | Available | One score per tenant | Cloud cost is not part of the score. |
| [CSPM](/platform/cspm) | Finds misconfigurations in what is deployed. | Available | 9,853 posture checks across 7 clouds | Checks deployed resources, not Terraform templates (Code Security covers templates). On AWS, no secret is stored: Onam assumes a read-only role. |
| [CIEM](/platform/ciem) | Works out effective permissions and escalation paths. | Available with limits | Unused access, access reviews, shadow admins and role chains: AWS only | Those four parts run on AWS only today. Unused-access analysis also needs cloud audit logs flowing into Onam. |
| [IAM Security](/platform/iam) | Checks MFA, access keys and policy hygiene. | Available | 1,459 identity rules in the catalogue, 7 clouds | — |
| [Asset Inventory](/platform/inventory) | Lists every discovered resource in one place. | Available | 549 services across 7 clouds | — |

## Threat & Attack

| Capability | What it does | Status | Reach | Stated limit |
| --- | --- | --- | --- | --- |
| [Attack Path](/platform/attack-path) | Shows routes to the most valuable assets and the choke points that cut them. | Available | — | Dollar figures are loss estimates per finding, for ranking. They are not a price for a whole route and not predictions. |
| [CDR (Detection)](/platform/cdr) | Behavioural threat detection at three levels. | Available | Audit logs from all 7 clouds | — |
| [Threat Detection](/platform/threat-detection) | Attack chains mapped to MITRE ATT&CK. | Available | — | — |
| [Risk Quantification](/platform/risk) | A FAIR-style loss estimate on each finding. | Available | — | Estimates for ranking, not predictions. |

## Data & Network

| Capability | What it does | Status | Reach | Stated limit |
| --- | --- | --- | --- | --- |
| [DSPM (Data Security)](/platform/data-security) | Labels sensitive data stores, shows who can reach them and where data flows. | Available with limits | 7 clouds, cloud data stores | Labels come from metadata only (store names, tags, column names). It never opens a file or reads a row. A store with uninformative names and no tags gets no label. Copies made by scripts are not visible. |
| [Database Security](/platform/database-security) | Managed database posture plus CIS database benchmarks. | Available | 1,321 data-protection rules in the catalogue | — |
| [Encryption & Keys](/platform/encryption) | Key inventory, rotation and who a key policy lets in. | Available | 502 secrets and key rules in the catalogue | — |
| [Network Security](/platform/network-security) | Seven-layer network topology analysis. | Available | 1,166 network rules in the catalogue | — |
| [API Security](/platform/api-security) | Shadow APIs, authentication gaps and firewall coverage. | Available | Gateway APIs on AWS, Azure, Google Cloud, OCI, Alibaba Cloud and Kubernetes | — |

## Workloads & Code

| Capability | What it does | Status | Reach | Stated limit |
| --- | --- | --- | --- | --- |
| [CWPP (Workloads)](/platform/cwpp) | Protection view for virtual machines, containers, serverless and hosts. | Available | — | — |
| [Agentless Scanning](/platform/agentless) | Scans disk snapshots inside the customer’s own account. | Available | — | — |
| [Container Security](/platform/container-security) | Cluster, container service and image scanning. | Available | 1,508 container and Kubernetes rules in the catalogue | — |
| [Vulnerability Management](/platform/vulnerability) | Known vulnerabilities ranked with context, not only by severity score. | Available | — | — |
| [Code Security](/platform/code-security) | Static analysis, live-app testing, library checks and infrastructure-template checks. | Available with limits | Code repositories | No pull-request comments. No IDE plugin. Cannot gate a build on new findings only (a pipeline can start a scan instead). Code findings are not yet linked to the running workload. |
| [AI Code Fix](/platform/ai-code-fix) | Writes a fix and pushes it to a branch. | Available with limits | Static-analysis findings | Library and live-app findings are not rewritten. The affected file is sent to a language model (Mistral). |

## SaaS, AI & Governance

| Capability | What it does | Status | Reach | Stated limit |
| --- | --- | --- | --- | --- |
| [SaaS Security (SSPM)](/platform/saas-security) | Posture checks for business SaaS platforms. | Available with limits | 8 platforms; 433 CIS rules across 6 of them | GitHub and Okta have posture checks but no CIS rule pack yet. |
| [AI Security](/platform/ai-security) | Risk checks for AI and machine-learning services such as SageMaker and Bedrock. | Available | AWS AI services (SageMaker, Bedrock) | Checks cover AWS AI services only. |
| [AI Assistant](/platform/ai-assistant) | Answers posture questions asked in plain language. | Available | — | — |
| [Remediation](/platform/remediation) | Fix guidance and a ready-made AI fix prompt for each finding. | Available | — | Guidance only. Onam does not change the customer’s cloud. |
| [Compliance](/platform/compliance) | Maps findings to frameworks with evidence per control. | Available with limits | 78 frameworks | Controls with no automated check are marked for manual review. |
| [Technology Engine](/platform/technology) | Discovers running technology and checks it against CIS benchmarks. | Available | 34 CIS technology benchmarks in 9 categories | — |

## Coverage by cloud

"All rules" is the full rule catalogue. "Posture checks" is the subset the CSPM scanner runs.

| Cloud | All rules | Posture checks | Services |
| --- | --- | --- | --- |
| AWS | 2,568 | 2,018 | 123 |
| Oracle Cloud (OCI) | 2,157 | 2,059 | 61 |
| Azure | 2,101 | 1,926 | 95 |
| Alibaba Cloud | 1,585 | 1,151 | 68 |
| Google Cloud | 1,479 | 1,322 | 71 |
| Kubernetes | 927 | 824 | 68 |
| IBM Cloud | 616 | 553 | 63 |
| **Total** | **11,433** | **9,853** | **549** |

## Rules by security area

| Area | Rules |
| --- | --- |
| Configuration | 2,689 |
| Containers and Kubernetes | 1,508 |
| Identity and access | 1,459 |
| Data protection | 1,321 |
| Logging | 1,295 |
| Network | 1,166 |
| Secrets and keys | 502 |
| Storage and databases | 310 |
| Applications and APIs | 241 |
| Compute and workloads | 219 |

## SaaS platforms

| Platform | CIS rules |
| --- | --- |
| Microsoft 365 | 130 |
| GitLab | 122 |
| Google Workspace | 89 |
| Snowflake | 39 |
| SharePoint | 37 |
| Dynamics 365 | 16 |
| GitHub | Posture checks, no CIS rule pack yet |
| Okta | Posture checks, no CIS rule pack yet |

## Not in the product today

Things a buyer may expect that Onam Security does not do yet.

| Not available | Where it stands |
| --- | --- |
| Reading file or row contents to classify data | DSPM labels from metadata only |
| Data loss prevention and data labelling | Not offered |
| Unused access, access reviews, shadow admins and role chains outside AWS | AWS only today |
| Pull-request comments and an IDE plugin | Code Security |
| Failing a build on new findings only | Code Security |
| Linking a code finding to the workload built from it | Code Security |
| AI fixes for library and live-app findings | AI Code Fix covers static analysis only |
| Template scanning inside the misconfiguration scanner | Handled by Code Security instead |
| Making changes in the customer’s cloud | Onam reads and recommends |
| A CIS rule pack for GitHub and Okta | Posture checks only |

Dollar figures in Attack Path and Risk Quantification are loss estimates for ranking, in the FAIR style published by The Open Group.
`,
  },
  {
    slug: "security/features-by-capability",
    title: "Features by capability",
    breadcrumb: "Onam Security / Features by capability",
    body: `
Every feature inside each Onam Security capability: 211 features across 26 capabilities, grouped the way the product is.

Where a feature names one cloud, it works on that cloud only. For status, reach and stated limits per capability, see the [Capability matrix](/docs/security/capability-matrix).

## Posture & Identity

### CNAPP

Combines seven pillar scores (misconfiguration, detection and identity, workloads, data, network, threat, application security) into one 0–100 posture score. Available. [Product page](/platform/cnapp).

| Feature | Detail |
| --- | --- |
| One posture score | with a risk band, trended over time |
| Seven pillar scores | posture, threat detection and IAM, workloads, data, network, threat, code |
| Fixed pillar weights | rebalanced when a pillar has no data |
| Drill-down | from a pillar to the findings behind it |
| Context-raised severity | and a fix-by date per finding |

### CSPM

Finds misconfigurations in what is deployed. Available. [Product page](/platform/cspm).

| Feature | Detail |
| --- | --- |
| Severity ranking | every misconfiguration ranked Critical, High, Medium or Low |
| Remediation guidance | per rule, plus an AI fix prompt for CLI, Terraform or console steps |
| Compliance mapping | which of the 78 frameworks each finding affects |
| MITRE ATT&CK | tactics and techniques on every rule |
| Resource-level drilldown | every finding linked to the resource, account and region |
| Context-raised severity | and a fix-by date per finding |
| Ticketing and alerting | Jira, ServiceNow, Slack, PagerDuty, email, webhook |
| Rule suppressions | with a reason and an optional expiry |

### CIEM

Works out effective permissions and escalation paths. Available with limits. [Product page](/platform/ciem).

| Feature | Detail |
| --- | --- |
| Effective permissions per identity | after group inheritance, conditions, explicit denies and SCP denies |
| Shadow admin detection | AWS identities that can attach, rewrite or create their way to an admin policy |
| Privilege escalation paths | PassRole, multi-hop assume-role chains and boundary removal on AWS; vectors for Azure, GCP, OCI, IBM Cloud and Kubernetes |
| Cross-account and federated trust | external accounts, wildcard principals, missing ExternalId, OIDC and SAML federation |
| Non-human identities | roles classified by who can assume them: AWS service, execution, CI/CD over OIDC, EKS service account, cross-account |
| Unused permissions on AWS | granted actions never seen in CloudTrail, with the high-risk ones called out |
| Identity risk score | 0–100 per AWS identity, with the breakdown behind it |
| Blast radius | how many resources with open high or critical findings an identity can reach |
| Stale roles | AWS roles with no recent API activity |
| Access reviews | pending, needs remediation, reviewed or deferred, with an audit trail and decisions that expire (AWS) |
| Kubernetes RBAC | service accounts bound to cluster-admin, able to read secrets, exec into pods or rewrite roles |
| Database identity activity | superuser and role-grant changes and login anomalies, from credentialed database connections |

### IAM Security

Checks MFA, access keys and policy hygiene. Available. [Product page](/platform/iam).

| Feature | Detail |
| --- | --- |
| MFA coverage | users and privileged identities without MFA |
| Access-key and credential age | keys and tokens past rotation thresholds |
| Root account usage | root activity and root access keys |
| Policy hygiene | wildcard actions and resources, admin policies, inline policies |
| Password policy | minimum length and expiry against CIS and NIST guidance |
| Trust settings | wildcard trust principals and cross-account roles without ExternalId |
| Six IAM modules | each with its own summary and pass rate |
| Effective Access lookup | search any principal and see what it can do after explicit denies and SCP denies |

### Asset Inventory

Lists every discovered resource in one place. Available. [Product page](/platform/inventory).

| Feature | Detail |
| --- | --- |
| Unified inventory | seven clouds and 549 services |
| Normalised resource model | comparable objects across providers |
| Relationship graph | the dependency map attack paths are computed on |
| Refresh on every scan | new resources picked up at the next scan |
| Hygiene reports | untagged, unowned and orphaned resources |
| Multi-account rollup | accounts and subscriptions in one view |
| Resource history | what changed, and when |
| Coverage reporting | which accounts and regions are actually being scanned |

## Threat & Attack

### Attack Path

Shows routes to the most valuable assets and the choke points that cut them. Available. [Product page](/platform/attack-path).

| Feature | Detail |
| --- | --- |
| Crown jewel path analysis | routes from entry points to critical assets, as interactive graphs |
| Evidence-checked edges | only confirmed relationships are walked |
| MITRE ATT&CK | tactic and technique on every hop |
| Path severity | likelihood × impact, adjusted for controls and exploitability |
| Choke-point ranking | the resources where one fix blocks the most paths |
| Remediation | a step per hop |
| Rebuilt every scan | fixed routes disappear |
| Feeds Risk Quantification | findings on attack paths get a higher loss estimate |

### CDR (Detection)

Behavioural threat detection at three levels. Available. [Product page](/platform/cdr).

| Feature | Detail |
| --- | --- |
| Single-event detection | rules over cloud audit logs |
| Multi-event correlation | scenarios within a time window |
| Behaviour baselines | per identity, with anomaly detection |
| Attack-sequence detection | exfiltration, identity pivot, secrets staging, compute hijack |
| MITRE ATT&CK | mapping on detections |
| Context | posture and identity context on every detection |
| Audit-log coverage | AWS, Azure, Google Cloud, OCI, Alibaba Cloud, IBM Cloud and Kubernetes |
| One alerts view | detections sit with the rest of Onam Security |

### Threat Detection

Attack chains mapped to MITRE ATT&CK. Available. [Product page](/platform/threat-detection).

| Feature | Detail |
| --- | --- |
| MITRE ATT&CK | every threat finding mapped to a tactic and technique |
| Attack chain visualisation | connected graphs |
| Blast radius analysis | — |
| Severity ranking | by CVSS, exploitability and actual reachability |
| Correlation | fewer duplicate alerts |
| Response guidance | per technique |
| Historical attack timeline | — |
| Attack Path integration | shares the Attack Path engine |

### Risk Quantification

A FAIR-style loss estimate on each finding. Available. [Product page](/platform/risk).

| Feature | Detail |
| --- | --- |
| Loss estimate | FAIR-style, per critical and high finding: low, likely and high |
| Regulatory exposure | GDPR, HIPAA, PCI DSS, SOX and other regimes |
| Attack-path uplift | higher estimates for findings on attack paths and choke points |
| Multipliers | crown jewel and data sensitivity |
| Top scenarios | ranked by likely exposure |
| Breakdown | exposure by engine, trended over time |
| Tunable inputs | per-record cost, revenue and sensitivity multipliers per tenant |

## Data & Network

### DSPM (Data Security)

Labels sensitive data stores, shows who can reach them and where data flows. Available with limits. [Product page](/platform/data-security).

| Feature | Detail |
| --- | --- |
| Data store catalog | every store with type, region, account and sensitivity labels |
| Metadata classification | PII, PHI, PCI, financial and confidential labels from names, tags and schema, never from contents |
| Public exposure, explained | which grant made a store public: policy verdict, ACL or wildcard principal |
| Cross-account access | bucket policies that let another account in, with write access ranked critical |
| Observed access | who touched each store in the last 30 days, with operations and time of last access |
| Encryption and keys | unencrypted stores, and sensitive data on provider-managed keys |
| Residency view | every store's region checked against the regions data is allowed to live in |
| Logging, versioning and backup | access logs, lifecycle rules, backup retention and point-in-time restore per store |
| Data lineage | chains of replication, backup, ETL, streaming and export hops, cross-region and cross-account flagged |
| Governance score | one 0–100 figure per store from encryption, public exposure and access logging |
| Attack-path context | sensitive stores become the targets attack paths are scored against |

### Database Security

Managed database posture plus CIS database benchmarks. Available. [Product page](/platform/database-security).

| Feature | Detail |
| --- | --- |
| Database inventory | managed services and self-hosted engines |
| Encryption coverage | at rest and in transit, per instance |
| Exposure detection | public accessibility and network exposure |
| Snapshot and backup exposure | including snapshots shared outside the account |
| Audit logging | configuration checked against CIS engine benchmarks |
| Backup compliance | retention and point-in-time recovery |
| Privileged accounts | database account and grant review |
| Sensitivity-weighted ranking | databases holding regulated data ranked first |

### Encryption & Keys

Key inventory, rotation and who a key policy lets in. Available. [Product page](/platform/encryption).

| Feature | Detail |
| --- | --- |
| Encryption coverage report | unencrypted, provider-managed and customer-managed, per resource |
| Key policy reach | wildcard principals, other accounts and grants on every key |
| Sensitive-data cross-check | labelled data stores that are unencrypted or on provider-managed keys |
| Key blast radius | the resources that depend on each key |
| Encryption drift | encryption removed, rotation disabled or a key scheduled for deletion since the last scan |
| Key rotation | compliance and overdue rotation alerts |
| Certificate inventory | with expiry lead-time warnings |
| Secrets manager posture | rotation, versioning and access scope |
| In-transit gaps | TLS policy on endpoints and load balancers |
| Framework mapping | encryption controls across CIS, NIST 800-53 and PCI-DSS v4 |

### Network Security

Seven-layer network topology analysis. Available. [Product page](/platform/network-security).

| Feature | Detail |
| --- | --- |
| Effective exposure score | for every resource |
| Security group audit | overly permissive inbound on SSH, RDP and database ports |
| Subnet classification | truly private versus publicly accessible |
| NACL analysis | — |
| Load balancer security | TLS version, HTTP to HTTPS redirect, internet-facing exposure |
| WAF coverage map | — |
| Flow log coverage gaps | — |
| Peering exposure | VPC peering and transit gateway analysis |

### API Security

Shadow APIs, authentication gaps and firewall coverage. Available. [Product page](/platform/api-security).

| Feature | Detail |
| --- | --- |
| API inventory | gateway-managed APIs across AWS, Azure, GCP, OCI, Alibaba Cloud and Kubernetes |
| Unauthenticated endpoints | public endpoints with no authentication or authoriser |
| Throttling gaps | missing rate limiting, burst limits and quotas |
| WAF coverage gaps | AWS API Gateway stages and Azure API Management |
| Transport gaps | TLS, HTTPS-only and mutual TLS |
| Logging coverage | access logging and tracing |
| Keys and backends | ageing API keys, and backend integrations that reach private addresses or metadata endpoints |
| Legacy APIs | name or version marks them as legacy, beta or test, still live |

## Workloads & Code

### CWPP (Workloads)

Protection view for virtual machines, containers, serverless and hosts. Available. [Product page](/platform/cwpp).

| Feature | Detail |
| --- | --- |
| Unified workload inventory | VMs, containers, serverless and hosts in one list |
| Per-workload posture score | with severity-ranked findings |
| OS hardening | results against CIS benchmarks for five Linux distributions |
| Package and vulnerability inventory | collected without agents |
| Privileged workloads | privileged and root-running workload detection |
| Runtime exposure | which workloads are internet-reachable |
| Serverless posture | runtime versions, execution roles and environment secrets |
| Pillar score trend | feeds the platform-wide CNAPP score |

### Agentless Scanning

Scans disk snapshots inside the customer’s own account. Available. [Product page](/platform/agentless).

| Feature | Detail |
| --- | --- |
| No agent rollout | workloads are covered without a deployment project |
| Package and OS inventory | from every scanned volume |
| Vulnerability detection | against the workload's real installed software |
| Host configuration signals | users, keys, services and hardening state |
| Secrets on disk | secrets and credential discovery |
| No production impact | no agent, no CPU, no memory, no kernel module |
| Snapshot cleanup | automatic, with orphan reconciliation |
| Capacity controls | per cloud, so scanning respects quotas |

### Container Security

Cluster, container service and image scanning. Available. [Product page](/platform/container-security).

| Feature | Detail |
| --- | --- |
| Image vulnerability scanning | CVEs in base and app layers |
| Kubernetes CIS benchmark | cluster, node, RBAC |
| Service account privilege analysis | — |
| Pod security analysis | privileged containers, host mounts, root users |
| Network policy coverage | — |
| Registry security | pull policies, unsigned images, image age |
| ECS task definition security | — |
| Runtime anomaly indicators | — |

### Vulnerability Management

Known vulnerabilities ranked with context, not only by severity score. Available. [Product page](/platform/vulnerability).

| Feature | Detail |
| --- | --- |
| SBOM generation | for every workload |
| EPSS-enriched prioritisation | — |
| KEV integration | CISA Known Exploited Vulnerabilities flagged |
| Network reachability correlation | — |
| Container image scanning | — |
| Serverless coverage | Lambda dependency scanning |
| OS-level findings | across the EC2 fleet |
| Remediation guidance | the exact upgrade version |

### Code Security

Static analysis, live-app testing, library checks and infrastructure-template checks. Available with limits. [Product page](/platform/code-security).

| Feature | Detail |
| --- | --- |
| Confirmed issues kept apart from hotspots | taint-backed findings first, pattern matches in a separate review list capped at medium |
| CWE and OWASP on every code finding | with the file, line and rule that produced it |
| Language coverage | Python, JavaScript, TypeScript, Java, C#, Go, C, C++ and Ruby |
| Dependency risk beyond CVSS | a 0–10 score built from CVSS, EPSS, CISA KEV and whether a fixed version exists |
| SBOM per repository | CycloneDX 1.5, plus import of existing CycloneDX or SPDX JSON SBOMs |
| SBOM governance | license classification and policy checks, an NTIA minimum-elements check, VEX statements and SBOM diffs |
| Dynamic testing of a running app | endpoint discovery, injection and SSRF payloads, header and cookie checks, JSON, HTML and SARIF reports |
| A fix path for every finding | rule guidance and a copyable AI fix prompt, plus AI Code Fix to put corrected files on a branch |
| Reports and trends | scan history per project, with CSV and PDF export |

### AI Code Fix

Writes a fix and pushes it to a branch. Available with limits. [Product page](/platform/ai-code-fix).

| Feature | Detail |
| --- | --- |
| Corrected files, not advice | the full rewritten file for each affected path |
| One pass per file | every finding in a file fixed together, with the surrounding code in view |
| Rule-guided fixes | the rule's recommendation and a language-matched safe example go to the model with each finding |
| A separate fix branch | the main branch is never written to |
| Per-finding status | fixed and committed, fix generated, failed or skipped, with the reason |
| Severity filter | fix the critical and high findings first and leave the rest for later |
| False positives respected | findings the team dismissed are not touched |
| Token handling | the Git token is used for one request and never stored or logged |

## SaaS, AI & Governance

### SaaS Security (SSPM)

Posture checks for business SaaS platforms. Available with limits. [Product page](/platform/saas-security).

| Feature | Detail |
| --- | --- |
| SaaS tenant inventory | every user, admin, guest and service account across connected platforms |
| MFA and conditional-access gaps | on privileged SaaS accounts |
| External sharing exposure | SharePoint, OneDrive and Google Drive links open to anyone |
| Audit-log configuration checks | M365 Unified Audit Log, Google Workspace retention, Snowflake QUERY_HISTORY |
| DevOps platform posture | GitHub and GitLab org settings, branch protection, token hygiene |
| Data warehouse posture | Snowflake roles, network policies and grant sprawl |
| CIS Benchmark scoring | per SaaS platform, with per-control evidence |
| Stale identities | stale and orphaned SaaS identity report |

### AI Security

Risk checks for AI and machine-learning services such as SageMaker and Bedrock. Available. [Product page](/platform/ai-security).

| Feature | Detail |
| --- | --- |
| SageMaker endpoint access control | public versus VPC-only |
| Bedrock model invocation audit | — |
| Training job isolation | VPC and security groups |
| Model artifact encryption at rest | — |
| Shadow AI detection | AWS, from audit logs |
| SageMaker Studio network isolation | — |
| ML service role scoping | — |
| Logging and monitoring | for inference and training |

### AI Assistant

Answers posture questions asked in plain language. Available. [Product page](/platform/ai-assistant).

| Feature | Detail |
| --- | --- |
| Natural-language querying | across every engine's findings |
| Thirteen domain specialists | IAM, compliance, encryption, database, container, network, CDR, risk, threat, vulnerability, data security, AI security and findings |
| Cited answers | every claim links to the underlying finding |
| Cross-domain synthesis | in a single question |
| Tenant-scoped and permission-scoped | the assistant sees only what the user can see |
| Attack path explanation | in plain language |
| Remediation guidance | drawn from the finding's own remediation record |
| Read-only by design | no silent changes to the environment |

### Remediation

Fix guidance and a ready-made AI fix prompt for each finding. Available. [Product page](/platform/remediation).

| Feature | Detail |
| --- | --- |
| Remediation guidance per rule | plus an AI fix prompt for CLI, Terraform or console steps |
| Fix branches | for static-analysis findings in source code, for the team to review and merge |
| Fixed versions | from the advisory, for vulnerable dependencies |
| Attack-path stories | with a remediation step on each hop |
| Suppression | for one finding or a whole rule, with reason, author and expiry |
| Tickets and alerts | Jira or ServiceNow; Slack, PagerDuty, email or webhook |
| Verification | the next scan confirms the fix actually landed |

### Compliance

Maps findings to frameworks with evidence per control. Available with limits. [Product page](/platform/compliance).

| Feature | Detail |
| --- | --- |
| 78 frameworks mapped | — |
| Continuous score | 0–100% per framework, with a trend |
| Evidence per control | with timestamps |
| Drill-down | from framework to control to resource |
| Export | PDF and CSV, plus Excel and JSON |
| Exceptions | with justification and expiry |

### Technology Engine

Discovers running technology and checks it against CIS benchmarks. Available. [Product page](/platform/technology).

| Feature | Detail |
| --- | --- |
| Runtime technology inventory | what is actually running, not what was deployed |
| Version currency analysis | — |
| End-of-life detection | — |
| Default configuration checks | databases, web servers, frameworks |
| 34 CIS technology benchmarks | named products, not vague categories |
| 8,991 technology control rows | across those benchmarks |
| Shadow IT surface area | — |
| Technology risk scoring | — |
`,
  },
];
