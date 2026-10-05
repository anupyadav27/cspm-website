import type { DocArticle } from "./types";

export const articles: DocArticle[] = [
  {
    slug: "features/cspm",
    title: "CSPM — Cloud Security Posture Management",
    breadcrumb: "Features / CSPM",
    body: `
CSPM is the core posture engine of the Onam platform. It evaluates every resource in your connected clouds against **9,853 posture rules**, records a PASS, FAIL or ERROR result for each rule-resource pair, and turns every FAIL into a severity-ranked finding with remediation guidance, MITRE ATT&CK mapping, and compliance citations.

This page explains what the rule registry covers per cloud, how a single rule is evaluated, how the severity model works, how to suppress findings you have accepted, and how PASS/FAIL results roll up into compliance scores.

![The Findings view in the Onam console (demo account)](/screenshots/screenshot-findings.png)

## What CSPM checks

CSPM answers one question on every scan: **is every resource configured the way it should be?** Public buckets, unencrypted databases, permissive security groups, disabled audit logging, missing MFA, stale credentials — each is a rule, and each rule is evaluated on every scan.

- **Read-only.** Posture scanning connects through read-only cloud roles — the IAM role, service principal, or service account you created at onboarding. Posture scanning installs nothing and modifies nothing in your cloud.
- **All 7 clouds.** AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud, and Kubernetes are covered by the same rule format and the same finding schema.
- **Every finding is actionable.** A finding carries the failing resource, the rule rationale, the rule's remediation guidance, the MITRE ATT&CK technique it maps to, the compliance controls it affects, and an AI fix prompt that drafts the CLI command, Terraform change or console steps for your cloud.

> CSPM checks deployed resources through cloud APIs. Templates — Terraform, CloudFormation, Kubernetes manifests and Dockerfiles — are scanned before deployment by [IaC Scanning](/docs/features/iac-scanning) in Code Security, which has its own rules, separate from the posture rules.

## Rule coverage by cloud

The posture engine runs **9,853 rules** across seven clouds:

| Cloud | Posture rules |
| --- | --- |
| OCI | 2,059 |
| AWS | 2,018 |
| Azure | 1,926 |
| GCP | 1,322 |
| Alibaba Cloud | 1,151 |
| Kubernetes | 824 |
| IBM Cloud | 553 |

Every rule ships with metadata: severity, domain, rationale, remediation guidance, references, compliance mappings, and MITRE ATT&CK tactics and techniques.

![How the CSPM engine fits into the platform](/diagrams/p-cspm.svg)

## How a rule evaluates

CSPM evaluation is a deterministic pipeline, not a heuristic:

1. **Discovery.** The Discovery & Inventory engine enumerates every resource in the account and records its full configuration in the asset inventory.
2. **Scoping.** The Check engine selects the rules whose scope matches each discovered resource — an S3 bucket is evaluated against S3 rules, a Cognito user pool against Cognito rules.
3. **Assertion.** Each rule references an assertion — a precise condition tested against the recorded configuration. The result is binary: **PASS** or **FAIL**.
4. **Finding creation.** Every FAIL becomes a finding with the rule's severity, remediation, MITRE technique, and compliance mappings attached. PASS results are retained too — they are the evidence behind your compliance scores.

Every rule is defined in YAML. This is a real (trimmed) rule from the AWS registry:

\`\`\`
rule_id: aws.cognito.userpool.access_keys_rotated_90_days_or_less_when_present
service: cognito
resource: userpool
scope: cognito.userpool.configuration
domain: configuration_and_change_management
severity: medium
assertion_id: security.configuration.cognito_userpool_access_keys_rotated_90_days_or_less_when_present
description: >
  Verifies security configuration for AWS Cognito user pools to ensure
  alignment with security best practices and compliance requirements.
remediation: |
  1. Open the Cognito console and select the user pool
  2. Review current permissions and key usage
  3. Rotate any access key older than 90 days
  4. Prefer IAM roles over long-lived access keys
mitre_techniques:
  - T1098.001
mitre_tactics:
  - persistence
\`\`\`

The naming convention is stable across all clouds — \`<cloud>.<service>.<resource>.<requirement>\` — so \`azure.storage.account.secure_transfer_required\` and \`gcp.gcs.bucket.uniform_access_enabled\` are immediately recognizable, filterable, and scriptable.

### Custom rules

The Rule Builder lets you author tenant-specific rules in the same YAML format — for example, enforcing your organization's tagging standard or a stricter TLS minimum. Custom rules evaluate in the same pipeline and appear in the same findings stream as built-in rules.

## Severity model

Every rule carries one of five severities, set per rule. A finding's severity is then raised when context makes it worse — the resource is on an attack path and exposed, it is a crown jewel, or an active threat touches it — and each finding gets a fix-by date.

| Severity | Meaning | Example |
| --- | --- | --- |
| Critical | Direct, exploitable exposure of data or control plane | Public S3 bucket containing data, root account access key exists |
| High | Serious weakness likely to contribute to a breach | Security group open to 0.0.0.0/0 on a database port, admin without MFA |
| Medium | Defense-in-depth gap or hygiene failure | Access key not rotated in 90 days, missing resource logging |
| Low | Minor deviation from best practice | Non-sensitive resource missing tags, verbose defaults |
| Info | Observation with no direct risk | Inventory facts, deprecated-but-safe settings |

Severity feeds everything downstream: finding sort order, alerting thresholds, the posture score, and the [FAIR risk engine](/docs/features/risk-quantification), which only quantifies Critical and High findings in dollar terms.

## Suppressions and exceptions

Not every FAIL is a problem you intend to fix. A sandbox account, a compensating control, or a vendor requirement can make a finding acceptable. Suppressions record that decision:

- **Scope it** — suppress by rule, service, technology or provider, for the whole tenant or for one account.
- **Explain it** — record the reason with the suppression; Onam stores who created it and when.
- **Expire it** — set an expiry date so the suppression lapses on its own instead of becoming permanent.
- **Review it** — list active suppressions, or include expired ones, at any time.

Creating a suppression requires admin rights. At the compliance level, exceptions and compensating controls are tracked separately with a justification, an approver and a target date — see [Compliance](/docs/features/compliance).

> Prefer expiring suppressions over permanent ones. A suppression with no expiry is how "temporary" exceptions become invisible permanent risk.

## Compliance mapping

Rules are mapped to the controls they evidence across **78 compliance frameworks** — including CIS Benchmarks, NIST 800-53, NIST 800-171, PCI DSS, HIPAA, ISO 27001:2022, SOC 2, GDPR and FedRAMP. The mapping is maintained in one catalog, so one scan produces evidence for every mapped framework at once:

1. A rule evaluates PASS or FAIL per resource.
2. Each result is attributed to every control the rule maps to.
3. Per-control pass rates roll up into framework scores in the [Compliance](/docs/features/compliance) view.

There is no separate "compliance scan" — posture and compliance are the same evaluation viewed through different lenses. See [Framework Coverage](/docs/compliance/frameworks) for the full framework list.

## Next steps

- [Onboard your first AWS account](/docs/onboarding/aws) — connect your first cloud
- [Compliance](/docs/features/compliance) — how PASS/FAIL results become framework scores
- [Attack Path Analysis](/docs/features/attack-path) — how individual findings chain into attack paths
- [Book a demo](/request-demo) — see the rule registry against your own environment
`,
  },
  {
    slug: "features/ciem",
    title: "CIEM — Cloud Identity & Entitlement Management",
    breadcrumb: "Features / CIEM",
    body: `
CIEM works out what each cloud identity can do, how it could escalate, who outside your account can get in and, on AWS, what it never uses.

![How Onam CIEM works — identity sources, effective-permission resolver, identity graph, findings and access reviews](/diagrams/ciem-architecture.svg)

CIEM has its own documentation section. Start here:

| Page | What it covers |
| --- | --- |
| [CIEM overview](/docs/ciem/overview) | What CIEM answers, the CIEM screen, how it relates to IAM Security |
| [How effective permissions are computed](/docs/ciem/effective-permissions) | Group expansion, condition classes, deny netting, SCP checks — and what is not modelled yet |
| [Finding types](/docs/ciem/finding-types) | Escalation, shadow admins, trust, usage-based and database identity findings, by cloud |
| [Reading the identity graph](/docs/ciem/identity-graph) | The edges CIEM writes and where you read them |
| [Right-sizing workflow](/docs/ciem/right-sizing) | Risk score, permission gap, access reviews and making the change |
| [Per-cloud notes](/docs/ciem/per-cloud) | What runs on AWS, Azure, GCP, Kubernetes, OCI, Alibaba Cloud and IBM Cloud |

## In one paragraph

CIEM reads identities, policies and trust settings from the inventory Onam's posture scan already builds. It resolves each identity's effective access — on AWS through group expansion, condition classification, explicit-deny netting and SCP deny checks — and writes identity relationships into the platform's security graph. Detectors then find escalation paths, shadow admins and risky trust. On AWS, CloudTrail activity collected by threat detection is compared with granted actions to measure each identity's permission gap, every identity gets a 0–100 risk score, and high-tier identities open an [access review](/docs/features/access-reviews). CIEM never changes your IAM.

## Next steps

- [IAM Security](/docs/features/iam-security) — identity hygiene: MFA, keys, password policy, root usage
- [Attack Path Analysis](/docs/features/attack-path) — identity edges combined with network and data exposure
- [CDR](/docs/features/cdr) — the activity that confirms escalation and feeds unused-permission analysis
`,
  },
  {
    slug: "features/iam-security",
    title: "IAM Security",
    breadcrumb: "Features / IAM Security",
    body: `
IAM Security is the identity-hygiene view of Onam's identity engine: MFA, access-key age, password policy, root usage and wildcard policies, on every scan.

It shares its engine and inventory with [CIEM](/docs/ciem/overview). IAM Security checks each identity's configuration; CIEM works out what the identity can actually do and how it could escalate.

![Illustrative IAM Security view — stylised, with demo data](/screenshots/screenshot-iam.png)

## What IAM Security covers

Identity findings are grouped into six modules, each with its own summary and pass rate.

| Module | What it checks | Example findings |
| --- | --- | --- |
| Least privilege | Over-permission, wildcard grants, privilege escalation | Wildcard admin policies, full-admin roles |
| Policy analysis | IAM policy structure | Inline policies, missing policy conditions |
| MFA | Multi-factor enforcement | MFA not enabled, no hardware MFA for root |
| Role management | Role trust and session settings | Overly broad trust principals, long max session duration |
| Password policy | Account password strength and rotation | Minimum length too short, passwords never expire |
| Access control | Console access, root usage, key rotation | Root account activity, old access keys |

Coverage spans all seven clouds: AWS IAM; Azure Entra ID, service principals, managed identities, RBAC and PIM; GCP service accounts and workload identity; OCI IAM; Alibaba Cloud RAM; IBM Cloud IAM; and Kubernetes RBAC.

## How it works

1. **Load.** After each posture scan, the engine loads the findings of every rule scoped to identity security.
2. **Add provider checks.** Per-cloud analysers add their own identity findings — for example key and token rotation on OCI, Alibaba Cloud and IBM Cloud, and RAM trust and MFA conditions on Alibaba Cloud.
3. **Group.** Each finding is assigned to its IAM modules.
4. **Report.** The IAM Security screen shows a posture score, findings by severity, an identity risk trend, the findings table (filterable by severity, module and status, with MFA, key-rotation and privilege-escalation shortcuts) and the **Effective Access** panel.

Because it uses the shared rule catalogue rather than a separate rule set, a new identity rule becomes an IAM Security finding on the next scan with no configuration.

![How the IAM Security engine fits into the platform](/diagrams/p-iam.svg)

## The Effective Access panel

Search any principal by name, ARN or service account to see what it can do after explicit denies and SCP denies: access grouped by resource type, with access level, allow or deny, where a grant was inherited from, and admin, cross-account and SCP-blocked flags. How the table behind it is built is in [How effective permissions are computed](/docs/ciem/effective-permissions).

## Common findings

| Finding | Severity | Why it matters |
| --- | --- | --- |
| Root account access key exists | Critical | Root credentials should never exist as long-lived keys |
| Privileged user without MFA | Critical | One phished password away from admin |
| Console user without MFA | High | Single-factor interactive access |
| Wildcard admin policy (\`iam:*\` on all resources) | High | Worst-case scope on the most-abused permissions |
| Access key not rotated in 90 days | Medium | Stale credentials accumulate exposure |
| Identity inactive 90+ days | Medium | Unused identities are unmonitored attack surface |
| Weak password policy | Medium | Short or non-expiring passwords weaken every account |

Each finding carries remediation steps, MITRE ATT&CK mapping, and the compliance controls it affects — MFA and key-rotation checks map directly to CIS IAM sections, NIST 800-53 AC/IA families, PCI-DSS requirement 8, and SOC 2 CC6.

> Fix the IAM Security layer first. MFA enforcement and key rotation are among the cheapest risk reductions in cloud security, and they make every CIEM finding less exploitable.

## IAM Security vs CIEM

They are two views of one identity engine and share one inventory:

| | IAM Security | CIEM |
| --- | --- | --- |
| Question answered | Is this identity configured safely? | What can it do, how could it escalate, what does it never use? |
| Data analysed | Identity configuration: MFA, keys, password policy, policies, trust settings | Resolved effective access, trust relationships and, on AWS, CloudTrail activity |
| Typical finding | User without MFA, key not rotated | PassRole to an admin role, shadow admin, high permission gap |
| Output | Module posture scores, identity findings | Escalation and trust findings, risk scores, access reviews |

Start with IAM Security to fix hygiene, then use [CIEM](/docs/ciem/overview) to shrink access and close escalation paths.

## Next steps

- [CIEM overview](/docs/ciem/overview) — effective permissions, escalation paths and access reviews
- [CSPM](/docs/features/cspm) — the rule catalogue IAM Security draws on
- [Attack Path Analysis](/docs/features/attack-path) — how identity weaknesses chain with network and data exposure
- [Book a demo](/request-demo) — see your identities on a live walkthrough
`,
  },
  {
    slug: "features/attack-path",
    title: "Attack Path Analysis",
    breadcrumb: "Features / Attack Path",
    body: `
Attack Path Analysis connects individual security findings — misconfigurations, identity risks, network exposures, and vulnerabilities — into chains that reveal exactly how an attacker would move from an exposed entry point to your most critical assets. Rather than presenting a long list of disconnected findings, Onam builds a graph of your estate and searches it for the routes that actually reach something worth protecting.

This page explains how the graph is built and verified, how paths are found and ranked, how MITRE techniques are attached per hop, and how **choke points** tell you the one fix that severs the most paths.

![The Attack Path view in the Onam console (demo account)](/screenshots/screenshot-attack-path.png)

## How the graph is built

After every scan, the Attack Path engine rebuilds a **graph database** of your estate from the scan's results:

**Nodes** are every resource in the asset inventory — EC2 instances, S3 buckets, IAM roles, Lambda functions, RDS databases, Kubernetes pods, secrets, and the rest — carrying their properties, findings, and classification.

**Edges** are relationships that represent possible attacker movement. They are produced by catalog-driven **edge derivers**, each specialized in one kind of evidence:

- IAM policy derivation — role assumption, PassRole, resource-policy access
- Network exposure — internet-facing endpoints, load balancer chains
- Security group rule matching — which sources can actually reach which ports
- KMS and encryption relationships — who can decrypt what
- CDR behavioral edges — movement actually observed in audit logs
- Public-exposure classification — \`is-public\` on buckets, snapshots, images

The resulting edge types read like attacker verbs: \`CAN_ASSUME\`, \`CAN_REACH\`, \`CAN_READ_SECRET\`, \`CAN_READ_OBJECT\`, \`CAN_DECRYPT\`, \`CAN_INVOKE\`.

### Edge verification

A candidate edge is not enough — a security group may permit traffic that IAM forbids, or a policy may grant access a network path never reaches. Every edge is marked **CONFIRMED**, **BLOCKED** or **GAP** from the evidence behind it. Only confirmed edges are walked, which is why the engine produces paths that can actually be taken instead of every theoretical route.

## Path traversal

The engine runs **BFS traversal from entry points toward crown jewels**:

- **Entry points** — the internet, admin and other identities, CI/CD, third parties, and other clouds, each with its own starting likelihood. Classification is catalog-driven, so new exposure patterns are added without code changes.
- **Crown jewels** — data stores such as S3 buckets, RDS and DynamoDB, encryption keys, and other targets the catalog marks as high value. Stores that [Data Security](/docs/features/data-security) finds sensitive are flagged as crown jewels too.

Likelihood decays with every hop. Each path is then scored:

- **Likelihood × impact** — the path's likelihood times the value of the crown jewel it reaches gives a 0–100 score and a severity
- **Controls** — a WAF or MFA on the route lowers the score
- **Exploitability** — a hop with a high-EPSS vulnerability raises it

Crown jewels also feed the [Risk Quantification](/docs/features/risk-quantification) engine: a finding on a crown jewel gets a higher asset multiplier in its loss estimate.

## Per-hop MITRE ATT&CK chains

Every hop in a path is tagged with the MITRE ATT&CK technique an attacker would use to take it, and the engine tracks **capability accumulation** along the path — what the attacker holds (credentials, network position, data access) after each hop. The result reads like a red-team narrative: entry, escalation, lateral movement, objective.

| Graph element | MITRE technique |
| --- | --- |
| Public S3 bucket to IAM credential exposure | T1552.005 — Cloud Instance Metadata API |
| IAM role to lateral movement | T1078.004 — Valid Accounts: Cloud Accounts |
| EC2 to RDS network path | T1021 — Remote Services |
| Secrets Manager access | T1555 — Credentials from Password Stores |

![An identity escalation chain — one class of edges the graph traverses](/diagrams/feat-ciem-privesc-chain.svg)

## Choke points

Choke points are the resources that many attack paths share. Fixing one choke point blocks every path that runs through it. For each choke point, the engine records how many paths would be blocked if it were fixed, and every hop on a path carries its own remediation step. Findings on choke points also get a higher loss estimate in [Risk Quantification](/docs/features/risk-quantification). See [Choke Points](/docs/features/choke-points) for the console view.

> Remediate choke points before individual paths. One choke-point fix can close many paths at once — it is the highest-leverage action the platform can recommend.

## Integration with other engines

| Engine | Contribution to the graph |
| --- | --- |
| [CSPM](/docs/features/cspm) | Entry-point misconfigurations, node-level findings |
| [CIEM](/docs/features/ciem) | Identity edges — assumption chains, permission graphs |
| [Network Security](/docs/features/network-security) | Reachability edges from effective exposure analysis |
| [Vulnerability](/docs/features/vulnerability-management) | CVE nodes enriched with EPSS and KEV |
| [CDR](/docs/features/cdr) | Behavioral edges — movement actually observed in logs |
| [Data Security](/docs/features/data-security) | Crown-jewel classification from data discovery |
| [Risk Quantification](/docs/features/risk-quantification) | Reads attack-path signals to raise the loss estimate of findings on paths |

## FAQ

**When is the graph built?** Automatically after every scan. The graph is rebuilt in full each time, so a route you have fixed is simply absent from the next result.

**Do I need to tag crown jewels?** No. Crown jewels come from the catalog of high-value targets and from data-security classification, so paths are found without any tagging.

## Next steps

- [Threat Detection](/docs/features/threat-detection) — how posture, behavior, and correlation fit together
- [Risk Quantification](/docs/features/risk-quantification) — how attack-path signals raise loss estimates
- [CIEM](/docs/features/ciem) — the identity chains that become graph edges
- [Book a demo](/request-demo) — see the choke points in your own estate
`,
  },
  {
    slug: "features/threat-detection",
    title: "Threat Detection",
    breadcrumb: "Features / Threat Detection",
    body: `
Onam detects threats on three planes at once: **posture rules** that find exploitable configuration before an attacker does, **behavioral detection** that watches audit logs for active attack activity, and **correlation** that stitches findings and detections into attack paths and incidents. This page explains how the three planes divide the work, how MITRE ATT&CK ties every result together, and how an analyst moves from alert to resolution in the console.

![The detection view in the Onam console (demo account)](/screenshots/screenshot-cdr.png)

## The three detection planes

| Plane | Engine | Input | Output |
| --- | --- | --- | --- |
| Posture | [CSPM](/docs/features/cspm) and the domain engines | Resource configuration snapshots | PASS/FAIL findings — what could be exploited |
| Behavioral | [CDR](/docs/features/cdr) | Audit and activity logs from all 7 clouds | Detections and incidents — what is being exploited |
| Correlation | [Attack Path](/docs/features/attack-path) and Investigation | Findings plus detections | Attack paths, choke points |

The planes are complementary by design. Posture without behavior tells you where you are weak but not whether anyone is acting on it. Behavior without posture buries you in alerts with no context. Correlation is what turns both into a decision: this detection, on this misconfigured resource, on a confirmed path to a crown jewel — act now.

## Posture detection

The posture plane evaluates **10,000+ rules** against every resource on every scan across AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud, and Kubernetes. Rules are YAML-defined, deterministic, and binary — PASS or FAIL — so results are reproducible and auditable. Domain engines extend the same model into their specialties: network exposure, data classification, container and Kubernetes posture, encryption, databases, and AI services.

![The scan pipeline — discovery, per-engine evaluation, findings](/diagrams/arch-scan-pipeline.svg)

Posture findings are pre-breach signals: a public snapshot, an admin role without MFA, a security group open to the internet. They are ranked by severity (Critical to Info) and feed the risk engine, the compliance engine, and the attack path graph.

## Behavioral detection

The behavioral plane ingests audit logs from all seven providers — CloudTrail, Azure Monitor, GCP Cloud Audit Logs, OCI Audit, Alibaba ActionTrail, IBM activity logs, and Kubernetes audit events — and runs a three-tier detection model:

- **L1 — single-event rules.** One log event matches a known-bad pattern: root login, CloudTrail tampering, privileged pod creation.
- **L2 — multi-event correlation scenarios.** A sequence of events forms an attack narrative: new key created, used from a new IP, followed by mass data reads.
- **L3 — statistical baselines.** Per-entity behavioral profiles flag deviations: API rates, active hours, regions, first-touched services.

See [CDR](/docs/features/cdr) for the full detection model, log source configuration, and response playbooks.

## Correlation

The correlation plane merges both worlds:

- **Behavioral edges on the graph.** When CDR observes real movement — an assumption, a data access — it becomes an edge in the attack path graph, upgrading a theoretical path to an active one.
- **Choke points.** The graph identifies single fixes that sever many paths at once — the highest-leverage remediation available.
- **Incidents.** Related detections are grouped by shared entities and temporal proximity, so three alerts become one investigation.

## MITRE ATT&CK across the platform

MITRE ATT&CK is the common language of every detection plane:

- Every posture rule's metadata carries \`mitre_techniques\` and \`mitre_tactics\` — a failed rule tells you which technique it would enable.
- Every CDR detection fires with a technique tag — T1078 Valid Accounts, T1530 Data from Cloud Storage, T1098.001 Additional Cloud Credentials.
- Every attack path hop is tagged with the technique an attacker would use to take it.

The console renders this as an ATT&CK heatmap (\`GET /api/v1/cdr/heatmap\`) showing which tactics and techniques your environment is exposed to and where activity has been observed — a single view that answers "where are we weak?" in the vocabulary your SOC already speaks.

## Investigation workflow

A typical analyst flow from alert to resolution:

1. **Triage.** Start in the Findings or CDR view, sorted by severity and incident grouping. The finding header shows the affected asset, when it fired, and its MITRE technique.
2. **Context.** Open the finding detail: full description, evidence, related findings on the same asset, compliance impact, and remediation steps.
3. **Blast radius.** Pivot to the asset in Inventory and its blast radius (\`GET /api/v1/inventory/asset/{resource_uid}/blast-radius\`) — what an attacker could reach from here.
4. **Correlate.** Check whether the asset sits on an attack path or a choke point; an active detection on a confirmed path is your priority incident.
5. **Remediate.** Apply the finding's remediation steps, or let the Remediation engine generate the fix; route to the owning team via your ticketing integration.
6. **Verify.** The next scan re-evaluates the rule; the finding auto-closes when the fix is confirmed.

> Prioritize the intersection, not the volume. A Medium posture finding on a choke point with an active L2 detection outranks a hundred isolated Highs. The correlation plane exists precisely so you can work this way.

## Tuning and noise control

- **Severity thresholds** — alert routing has a minimum-severity gate per channel, so pagers only fire for what matters.
- **Suppressions** — accepted posture findings are suppressed with justification and expiry, keeping scores honest without deleting evidence.
- **Entity allowlists** — CDR detections support per-entity allowlisting, for example a role that legitimately operates from many regions.
- **Custom rules** — the Rule Builder adds tenant-specific posture rules; CDR scenario tuning adjusts behavioral sensitivity.

## Next steps

- [CDR](/docs/features/cdr) — the behavioral detection plane in depth
- [Attack Path Analysis](/docs/features/attack-path) — the correlation plane in depth
- [CSPM](/docs/features/cspm) — the posture plane in depth
- [Book a demo](/request-demo) — walk through a live investigation
`,
  },
  {
    slug: "features/cdr",
    title: "CDR — Cloud Detection & Response",
    breadcrumb: "Features / CDR",
    body: `
Onam CDR provides continuous behavioral threat detection across your cloud audit logs — ingesting activity from **all 7 supported providers** and running a three-tier detection model that catches everything from known attack signatures to multi-step attack sequences to subtle deviations from an entity's normal behavior.

This page covers the log sources per provider, the L1/L2/L3 detection model, how detections correlate into incidents, and how to configure and tune CDR for your accounts.

![The CDR view in the Onam console (demo account)](/screenshots/screenshot-cdr.png)

## Log sources

CDR ingests audit and activity logs from every connected provider using the same read-only credentials used for posture scanning. No additional agents, collectors, or network changes are required.

| Provider | Audit source | Ingestion path |
| --- | --- | --- |
| AWS | CloudTrail (management + data events) | CloudWatch Logs and S3 |
| Azure | Azure Monitor activity logs | Blob Storage export |
| GCP | Cloud Audit Logs (Admin Activity, Data Access) | GCS export |
| OCI | OCI Audit service | Audit API |
| Alibaba Cloud | ActionTrail | ActionTrail delivery |
| IBM Cloud | Activity logs | IBM Cloud Object Storage |
| Kubernetes | API server audit events | Collected via Discovery & Inventory |

On AWS, supplemental sources — VPC Flow Logs and GuardDuty findings — can be enabled to enrich detections with network telemetry and Amazon's native alerts.

## The three-tier detection model

CDR layers three detection tiers over the same log stream. Detection content is managed server-side and updated continuously, so new attack techniques are covered without any action on your part.

| Tier | Model | What it catches |
| --- | --- | --- |
| L1 | Single-event rules | One log event matches a known-bad pattern |
| L2 | Multi-event correlation scenarios | A sequence of events forms an attack narrative |
| L3 | Statistical behavior baselines | An entity deviates from its own learned normal |

### L1 — single-event rules

Curated rules across threat, identity, and data-security packs fire on individual events. Representative coverage:

- Root account login or root API calls
- CloudTrail, activity log, or audit log disabling and tampering
- Security group or firewall changes that open broad internet access
- Storage policy changes that enable public access
- Credential theft indicators, including metadata-service access patterns
- Kubernetes: privileged pod creation, ClusterRole grants by non-admin principals, exec into production pods, secret reads, image pulls from non-approved registries

### L2 — multi-event correlation scenarios

L2 scenarios watch for sequences that are individually unremarkable but damning together. Example: an access key is created, first used minutes later from an IP range never seen before, and immediately enumerates and bulk-reads storage buckets. No single event is an alert; the sequence is a credential-compromise scenario. L2 draws on threat, CIEM, and data-security context, so scenarios can require conditions like "identity is privileged" or "bucket is classified sensitive".

### L3 — statistical behavior baselines

L3 builds a per-entity behavioral profile over a 30-day rolling window — typical API call rate and distribution, normal geographic regions, standard hours of activity, usual services accessed, and typical data transfer volumes. Detections fire when behavior deviates sharply:

- API call rate deviates more than 3 standard deviations from baseline
- Activity at unusual hours or from a new geographic region
- First-ever access to a service or resource class
- Incremental permission escalation across multiple sessions

## Incident correlation

Individual detections are automatically grouped into incidents using temporal proximity and shared-entity analysis. Example — three detections within four minutes:

1. L1: unusual cross-account role assumption from an external IP
2. L3: the same role's API call rate at 12x its baseline
3. L3: first-ever access to a sensitive S3 bucket by that role

CDR correlates these into a single incident: "Suspected credential compromise — external role assumption followed by data access anomaly." One incident to investigate, not three alerts to triage separately.

## MITRE ATT&CK mapping

Every detection fires with a MITRE ATT&CK tag:

| Detection | Tactic | Technique |
| --- | --- | --- |
| Root login | Initial Access | T1078 — Valid Accounts |
| Unusual role assumption from new IP | Credential Access | T1528 — Steal Application Access Token |
| API call to new region | Defense Evasion | T1535 — Unused/Unsupported Cloud Regions |
| Bulk storage download | Exfiltration | T1530 — Data from Cloud Storage |
| Security group opened to 0.0.0.0/0 | Defense Evasion | T1578 — Modify Cloud Compute Infrastructure |

Detections aggregate into the ATT&CK heatmap in the console (\`GET /api/v1/cdr/heatmap\`), showing observed activity by tactic and technique across your estate.

## Response playbooks

Each incident type ships with a response playbook:

1. **Alert triage** — context summary, affected resources, estimated blast radius
2. **Containment** — one-click actions: quarantine IAM role, revoke session tokens, block IP
3. **Investigation** — a linked audit-log query pulls the full event timeline for the entities involved
4. **Remediation** — the posture findings that contributed to the incident, with fix guidance from the [CSPM](/docs/features/cspm) engine

Because CDR shares the platform's asset and identity inventory, every incident is pre-enriched with posture context: the role's entitlements from [CIEM](/docs/features/ciem), the resource's exposure from [Network Security](/docs/features/network-security), and its position on any [attack path](/docs/features/attack-path).

## Configuration

CDR is enabled per cloud account:

\`\`\`
cdr:
  log_sources:
    cloudtrail: enabled
    vpc_flow_logs: enabled
    guardduty: enabled
  detection_tiers:
    l1_rules: enabled
    l2_scenarios: enabled
    l3_baselines: enabled
  alerting:
    min_severity: medium       # low | medium | high | critical
    channels: [slack, pagerduty, email]
  baseline_window_days: 30
\`\`\`

> L3 baselines need history before they are trustworthy. Initial baselines are established within 7 days of activation and reach full accuracy after about 14 days. L1 and L2 detections fire from the first ingested event — do not delay enabling CDR waiting for baselines.

## FAQ

**Does CDR consume GuardDuty findings?** Yes. GuardDuty findings are ingested alongside L1 detections, enriched with posture and identity context from Onam's other engines, and correlated into the unified incident stream.

**How do I reduce false positives?** Use the per-detection entity allowlist. For example, suppress "unusual region" detections for a specific IAM role that legitimately operates globally. Suppressed detections are still logged but do not create alerts.

**What latency should I expect from event to detection?** Ingestion follows each provider's log delivery cadence (typically minutes). L1 and L2 evaluation happens on ingest; L3 evaluates against the rolling baseline continuously.

## Next steps

- [Threat Detection](/docs/features/threat-detection) — how CDR fits with posture and correlation
- [Attack Path Analysis](/docs/features/attack-path) — behavioral edges on the security graph
- [CIEM](/docs/features/ciem) — the entitlement context behind identity detections
- [Book a demo](/request-demo) — see live detections on a demo estate
`,
  },
];
