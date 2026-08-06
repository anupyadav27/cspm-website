import type { DocArticle } from "./types";

export const articles: DocArticle[] = [
  {
    slug: "features/cspm",
    title: "CSPM — Cloud Security Posture Management",
    breadcrumb: "Features / CSPM",
    body: `
CSPM is the core posture engine of the Onam platform. It evaluates every resource in your connected clouds against a registry of **10,000+ configuration rules**, produces a PASS or FAIL result for each rule-resource pair, and turns every FAIL into a severity-ranked finding with remediation steps, MITRE ATT&CK mapping, and compliance citations.

This page explains what the rule registry covers per cloud, how a single rule is evaluated, how the severity model works, how to suppress findings you have accepted, and how PASS/FAIL results roll up into compliance scores.

![The Findings view in the Onam console (demo account)](/screenshots/screenshot-findings.png)

## What CSPM checks

CSPM answers one question continuously: **is every resource configured the way it should be?** Public buckets, unencrypted databases, permissive security groups, disabled audit logging, missing MFA, stale credentials — each is a rule, and each rule is evaluated on every scan.

- **Agentless and read-only.** Scans run through the same read-only credential you created at onboarding (IAM role, service principal, or service account). Nothing is installed and nothing in your cloud is modified.
- **All 7 clouds.** AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud, and Kubernetes are covered by the same rule format and the same finding schema.
- **Every finding is actionable.** A finding carries the failing resource, the rule rationale, step-by-step remediation, the MITRE ATT&CK technique it maps to, and the compliance controls it affects.

> CSPM checks deployed resources through cloud APIs. To catch the same misconfigurations before deployment, pair it with [IaC Scanning](/docs/features/iac-scanning) — the two engines share rule intent, so a policy blocked in CI is the same policy flagged in production.

## Rule coverage by cloud

The master rule registry contains **10,864 rules** across the five primary scan targets:

| Cloud | Rules | Coverage |
| --- | --- | --- |
| AWS | 2,278 | 157 services |
| Azure | 3,741 | 112 services |
| GCP | 2,676 | 47 services |
| OCI | 1,451 | 42 services |
| Kubernetes | 718 | 51 resource kinds |

The rule-metadata corpus is larger still — **11,372 rule definition files** — and additionally covers Alibaba Cloud (1,541 rules) and IBM Cloud (613 rules). Every rule ships with metadata: severity, domain, rationale, remediation steps, references, and MITRE mapping.

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

Every rule carries one of five severities. Severity is set per rule and can be re-graded per tenant if your risk tolerance differs.

| Severity | Meaning | Example |
| --- | --- | --- |
| Critical | Direct, exploitable exposure of data or control plane | Public S3 bucket containing data, root account access key exists |
| High | Serious weakness likely to contribute to a breach | Security group open to 0.0.0.0/0 on a database port, admin without MFA |
| Medium | Defense-in-depth gap or hygiene failure | Access key not rotated in 90 days, missing resource logging |
| Low | Minor deviation from best practice | Non-sensitive resource missing tags, verbose defaults |
| Info | Observation with no direct risk | Inventory facts, deprecated-but-safe settings |

Severity feeds everything downstream: finding sort order, alerting thresholds, the posture score, and the [FAIR risk engine](/docs/features/risk-quantification), which only quantifies Critical and High findings in dollar terms.

## Suppressions and exceptions

Not every FAIL is a problem you intend to fix. A sandbox account, a compensating control, or a vendor requirement can make a finding acceptable. Suppressions record that decision without deleting the evidence:

- **Scope it precisely** — suppress a single resource-rule pair, a rule for one account, or a rule tenant-wide.
- **Justify it** — every suppression requires a reason, which is stored in the audit trail.
- **Expire it** — set an expiry date so exceptions are re-reviewed instead of becoming permanent.
- **Review it** — the Suppressions view in the console lists every active suppression, who created it, and when it lapses.

Suppressed findings are excluded from posture scores and alert routing but remain queryable, so auditors can see both the finding and the documented exception.

> Prefer expiring suppressions over permanent ones. A suppression with no expiry is how "temporary" exceptions become invisible permanent risk. The console flags suppressions older than 12 months.

## Compliance mapping

Every rule is mapped to the controls it satisfies across **78 compliance frameworks** — including CIS Benchmarks, NIST CSF 2.0, NIST 800-53, PCI-DSS v4.0, HIPAA, ISO 27001, SOC 2, GDPR, FedRAMP, DORA, and NIS2. The mapping is maintained in a single policy-to-framework catalog, so one scan produces evidence for every framework simultaneously:

1. A rule evaluates PASS or FAIL per resource.
2. Each result is attributed to every control the rule maps to.
3. Per-control pass rates roll up into framework scores in the [Compliance](/docs/features/compliance) view.

There is no separate "compliance scan" — posture and compliance are the same evaluation viewed through different lenses. See [Framework Coverage](/docs/compliance/frameworks) for the full framework list.

## Next steps

- [Onboard your first AWS account](/docs/onboarding/aws) — connect a cloud in about 10 minutes
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
CIEM analyzes every identity in your cloud — human users, service accounts, IAM roles, federated logins, machine identities — and answers two hard questions: **what can each identity actually do?** and **what does each identity actually need?** The gap between those two answers is your excess permission risk. The platform measures it, prioritizes it, and gives you a least-privilege policy you can apply with confidence.

![CIEM entitlement analysis](/diagrams/ciem.svg)

**Why CIEM matters:** the average cloud identity has been granted **80% more permissions than it ever uses**. Most cloud breaches now start with a compromised low-privilege identity that is then escalated through unused permissions to admin. CIEM is the discipline of closing that gap — and it is the only practical way to enforce least privilege at cloud scale, because no human team can review a million entitlements by hand.

## The identity risk problem

Modern cloud environments accumulate identities and permissions faster than security teams can review them. Every new microservice creates a new IAM role; every new SaaS integration creates a new federation; every new developer creates a new user. Permissions get added when needed but rarely removed when no longer used.

| Risk | What it looks like | Why it is dangerous |
| --- | --- | --- |
| Overprivileged identities | A role with \`s3:*\` that only ever called \`s3:GetObject\` | If compromised, the attacker inherits the entire blast radius — not just the actually-used permission |
| Shadow admins | A role that can \`iam:PassRole\` to a role that can \`iam:CreatePolicyVersion\` | Indirect path to admin that no one wrote down — invisible to manual review |
| Stale identities | An ex-employee's IAM user with valid access keys 18 months later | A high-trust credential nobody is monitoring |
| Cross-account trust risks | A role that trusts an unknown external account | Lateral movement boundary is wider than you think |

**The industry baseline figure:** 80% of granted permissions are never used. This is not a flaw in your design — it is a structural property of cloud IAM. Permissions are granted defensively, workloads change, and nobody goes back to clean up. CIEM is what brings that 80% back down.

## Coverage: rules and identity types

### CIEM rule packs

On top of the shared posture rule registry, CIEM ships its own dedicated entitlement rule packs per cloud — **1,342 CIEM-specific rules** in total:

| Cloud | CIEM rules |
| --- | --- |
| AWS | 530 |
| Azure | 202 |
| GCP | 176 |
| Alibaba Cloud | 114 |
| IBM Cloud | 110 |
| OCI | 107 |
| Kubernetes | 103 |

These cover entitlement-specific conditions — wildcard grants, escalation-capable permission combinations, risky trust policies, unused entitlements — that plain configuration rules cannot express.

### Supported identity types

| Identity type | AWS | Azure | GCP | OCI | Alibaba | IBM |
| --- | --- | --- | --- | --- | --- | --- |
| Human users | Yes | Yes | Yes | Yes | Yes | Yes |
| Service accounts / managed identities | Yes | Yes | Yes | Yes | Yes | Yes |
| IAM roles / app registrations | Yes | Yes | Yes | Yes | Yes | Yes |
| Federated identities (SAML / OIDC) | Yes | Yes | Yes | — | — | — |
| Workload identities (instance roles, pod identity) | Yes | Yes | Yes | Yes | Yes | Yes |
| Serverless execution identities | Yes | Yes | Yes | Yes | Yes | Yes |
| Third-party cross-account access | Yes | — | — | — | — | — |

A "—" does not always mean unsupported in principle — some providers implement the identity type through a different mechanism that the platform covers under a different row.

## How CIEM works

CIEM is a three-stage pipeline that runs against every identity on every scan: **collect** the raw IAM configuration and usage data, **analyze** what is actually callable vs what is actually used, and **emit** prioritized findings with suggested fixes.

![How CIEM works — Collect, Analyze, Findings: the three-stage pipeline](/diagrams/feat-ciem-pipeline.svg)

### 1. Collect — what the platform reads from your cloud

Every CIEM scan reads three classes of data through your read-only credential. No agents, no policy changes, no IAM modifications.

- **IAM policies** — every identity-based policy, every resource-based policy (S3 bucket policies, KMS key policies, Lambda permissions), every Service Control Policy at the org level, every permission boundary, every trust relationship.
- **Usage history** — the last 90 days of CloudTrail (AWS), Azure Monitor activity logs, Cloud Audit Logs (GCP), or equivalent. The platform reads which identity called which API on which resource.
- **Identity catalog** — every user, group, role, service account, workload identity, federated identity, and cross-account trust. Federation chains and identity center mappings are followed end-to-end.

### 2. Analyze — what the platform calculates per identity

- **Effective permissions** — the resolved intersection of all policy sources. This is what the identity can actually call — different from what is attached on paper.
- **Used permissions** — what the identity actually called in the last 90 days.
- **Unused permissions** — granted but never exercised. These are the candidates for safe removal.
- **Identity attack paths** — multi-hop chains of \`sts:AssumeRole\` and \`iam:PassRole\` that lead from this identity to a role with privilege-escalation permissions.

### 3. Findings — what you see in the console

The output is severity-ranked findings, not raw data: overprivileged identities with a 0–100 gap score and a generated least-privilege policy, shadow admins, stale access, and cross-account risks.

![The CIEM posture view — entitlement analysis and identity risk rollup](/diagrams/p-ciem.svg)

## Effective permissions — what an identity can actually do

Cloud IAM permissions do not come from a single source — on AWS they come from **five overlapping policy types** that interact through a precise resolution algorithm. The platform computes the resolved set for every identity automatically.

![Effective permissions — five AWS policy sources intersect to produce what an identity can actually call](/diagrams/feat-ciem-effective-perms.svg)

| # | Source | What it does | Can grant? | Can deny? |
| --- | --- | --- | --- | --- |
| 1 | Identity-based policies | Attached directly to user, group, or role | Yes | Yes |
| 2 | Resource-based policies | Attached to a resource (S3 bucket policy, KMS key policy) | Yes | Yes |
| 3 | Service Control Policies | Org-level guardrails for every account and identity | No | Yes |
| 4 | Permission boundaries | Cap the maximum effective permissions for an identity | No | Yes |
| 5 | Session policies | Apply only during the specific STS session | No | Yes |

**The resolution rule in plain English:** an action is allowed only if there is an explicit Allow somewhere AND no explicit Deny anywhere. Explicit Deny always wins. SCPs and permission boundaries can never grant — they can only restrict.

**Why this matters:** "what's attached" can be wildly different from "what's actually callable". A role might appear to have \`s3:*\` in its identity policy, but a permission boundary caps it to \`s3:GetObject\`. The platform shows you the truly callable set — that is the basis for the gap score and the suggested least-privilege policy. Manual reviews of "what's attached" miss this every time.

**Cross-cloud coverage:** the same effective-permission resolution runs for Azure RBAC (role assignments, scope inheritance, deny assignments), GCP IAM (allow policies, deny policies, organization policies), OCI IAM (compartment hierarchy, policy statements), and the others. The mechanism varies; the goal is the same.

### Least Privilege Gap Score

Each identity receives a single **Least Privilege Gap Score** from 0 to 100 — a direct measure of how much excess permission the identity carries. Higher is worse.

| Score range | Meaning | Recommended action |
| --- | --- | --- |
| 0–20 | Minimal excess | Low priority — monitor on the next scan |
| 21–50 | Moderate excess | Review at the next quarterly access review |
| 51–80 | Significant excess | Remediate within 30 days |
| 81–100 | Extreme excess — admin or near-admin without justification | Remediate immediately |

\`\`\`
Gap Score = (unused_permissions / total_permissions) × severity_weight × exposure_weight
\`\`\`

- \`unused_permissions / total_permissions\` is the basic ratio of granted permissions never exercised.
- \`severity_weight\` is higher for write/admin permissions than for read — deleting S3 buckets weighs more than listing them.
- \`exposure_weight\` is higher for identities reachable from the internet than for purely internal identities.

**Why this is not a simple percentage:** an identity with 80% of its \`s3:GetObject\`-only permissions unused is materially different from an identity with 80% of its \`iam:*\` permissions unused. The weighting captures that.

## Identity attack paths

CIEM does not stop at single-identity analysis. It traces **multi-hop permission chains** — paths an attacker could follow to escalate from a low-privileged starting identity all the way to full admin. Most real-world cloud breaches use chains exactly like the one below; almost none are visible from any single identity in isolation.

![Identity attack path — privilege escalation from a compromised Lambda to full admin via a role chain](/diagrams/feat-ciem-privesc-chain.svg)

| Hop | Where you are | The permission that lets you advance | Why this hop is dangerous |
| --- | --- | --- | --- |
| 1. Start | Compromised Lambda function (low-priv) | \`sts:AssumeRole\` on \`app-processor\` | The function's code is the attacker's foothold; they execute with its role |
| 2. app-processor role | Has \`iam:PassRole\` on \`data-pipeline-role\` | \`iam:PassRole\` | The role can hand off another role — without PassRole, the chain stops here |
| 3. data-pipeline-role | Has S3 admin AND \`iam:CreatePolicyVersion\` | \`iam:CreatePolicyVersion\` | The killer permission — lets the attacker write a brand-new admin policy |
| 4. Privilege escalation | Attacker creates an Allow-all policy version and attaches it | \`iam:AttachUserPolicy\` | One API call from new policy to attached admin |
| 5. Full admin | All services, all regions | — | Data exfiltration, key rotation, account takeover |

**How the platform finds these chains:**

1. Enumerates every reachable role from each identity — following \`sts:AssumeRole\` and \`iam:PassRole\` edges in the security graph.
2. Tags every permission that enables self-escalation — \`iam:CreatePolicyVersion\`, \`iam:AttachUserPolicy\`, \`iam:PutRolePolicy\`, \`iam:CreateAccessKey\`, \`iam:UpdateAssumeRolePolicy\`, plus equivalents in Azure, GCP, and OCI.
3. Flags any chain that ends in one of those permissions, regardless of hop count.
4. Shows which control would have prevented it — usually a permission boundary on the intermediate role, or removing an unused \`iam:PassRole\`.

Common chains the platform catches: Lambda to admin via PassRole, EC2 instance role to \`iam:CreatePolicyVersion\`, cross-account trust into a weaker account, federated SSO roles with \`iam:UpdateAssumeRolePolicy\`, and GKE service accounts mapping to GCP service accounts with \`iam.serviceAccountKeys.create\`. Each finding is mapped to MITRE \`T1098.001\` (Additional Cloud Credentials) and \`T1078.004\` (Valid Accounts: Cloud Accounts). These chains also feed the platform-wide [Attack Path graph](/docs/features/attack-path) as identity edges.

## Findings and remediation

### Key CIEM findings

The ten most-encountered CIEM findings across customer environments:

| Finding | Severity | Why it is dangerous |
| --- | --- | --- |
| Root account used recently | Critical | Root has every permission and bypasses every guardrail |
| \`AdministratorAccess\` attached directly to a user | Critical | Admin should be assumable, never permanent — assumption creates an audit trail |
| MFA not enabled for privileged user | High | Single factor protecting a high-impact identity |
| Service account with owner / admin role | High | If the machine is compromised, so is the cloud account |
| Cross-account trust with unknown account | High | Could be a partner, could be an attacker |
| Unused IAM user with active access keys | High | Highest-trust credential class with no monitoring |
| 90+ days inactive access key | Medium | Abandoned, unrotated keys are a top breach precursor |
| Overprivileged role — gap score above 80 | High | Compromise blast radius far larger than its actual job |
| Shadow admin path detected | High | Invisible without graph analysis — usually unintentional |
| Wildcard resource on sensitive actions | High | \`iam:*\` or \`s3:*\` on all resources — worst-case scope on the most-abused permissions |

Every finding includes the affected identity, the specific policy or trust at fault, the suggested fix, and the framework controls it satisfies (CIS IAM controls, NIST AC family, ISO 27001 A.5.15/A.5.18, SOC 2 CC6.1).

### Remediation workflow

CIEM findings come with **a generated least-privilege policy** ready to apply — not just a flag. The platform synthesizes the policy from what the identity actually used in the last 90 days and never modifies your IAM without your explicit approval.

![CIEM remediation workflow — from finding to verified fix in five stages](/diagrams/feat-ciem-remediation.svg)

1. **Detected.** A finding fires on the next scan — for example "role \`data-pipeline-role\` has gap score 87/100, 12 unused services". Severity, MITRE technique, and framework citations are attached.
2. **Review.** The console shows a side-by-side diff of effective vs used permissions over the last 90 days, down to specific actions and resources.
3. **Suggested policy.** The platform generates a least-privilege policy in JSON, scoped exactly to what was actually used. You can adjust it — expand a wildcard if seasonal usage was missed, or add a deny for a sensitive action.
4. **Apply.** You decide how — copy to the cloud console, hand off to your IaC pipeline (Terraform or CloudFormation), or trigger an approved automation hook. The platform never auto-applies.
5. **Verify.** The next scan re-evaluates the identity. The gap score should drop and the finding auto-closes. If it did not improve, the platform tells you why — for example, "policy was applied but a permission boundary still allows the wildcard".

> Why we never auto-apply: least-privilege errors break production. Removing a permission used only during quarterly batch jobs can cause an outage the 90-day window never saw. You get the suggested policy with full context; you make the call.

Bulk remediation is supported — review and apply a batch of suggested policies through your CI/CD pipeline with a single approval. Every approval is recorded in the audit log. Suggested policies export as Terraform \`aws_iam_policy\` blocks, CloudFormation snippets, or raw JSON; CIEM findings export as CSV.

### API

CIEM endpoints are part of the unified platform API under the \`/api/v1/iam-security\` prefix. All endpoints require an authenticated session and are scoped to your tenant.

\`\`\`
# List CIEM findings
GET /api/v1/iam-security/findings?severity=HIGH&status=OPEN

# Effective permissions for one identity
GET /api/v1/iam-security/identity/{identity_id}/permissions

# Attack paths originating from one identity
GET /api/v1/iam-security/identity/{identity_id}/attack-paths

# Suggested least-privilege policy for one identity
GET /api/v1/iam-security/identity/{identity_id}/suggested-policy
\`\`\`

Full request/response schemas are in the [API Reference](/docs/reference/api). Webhook delivery on new High/Critical CIEM findings is configured under Settings, then Notifications.

## FAQ

**How long does CIEM analysis take per account?** A typical AWS account with 200 identities and 90 days of CloudTrail history completes the CIEM stage in under 90 seconds. Larger accounts (1,000+ identities) take 3–5 minutes.

**Does CIEM modify any IAM in my account?** No. The platform reads IAM configuration and usage data and generates suggested policies. Applying them is always your action.

**What if I don't have 90 days of audit history?** The platform uses whatever history is available and notes the lookback window on every finding. With under 30 days, gap scores are more conservative.

**Can I customize what counts as an escalation permission?** Yes. Extend the default set with org-specific permissions under Settings, then CIEM, then Escalation Definitions.

**Does CIEM cover AWS Identity Center (formerly SSO)?** Yes. Permission sets, federated user assignments, and the resulting per-account roles are all enumerated; SAML and OIDC federations are followed end-to-end.

## Next steps

- [IAM Security](/docs/features/iam-security) — configuration posture of identities (MFA, key rotation, policy hygiene)
- [Attack Path Analysis](/docs/features/attack-path) — identity chains combined with network and data exposure
- [CDR](/docs/features/cdr) — detect when an identity starts behaving abnormally
- [Book a demo](/request-demo) — see your own entitlement gap measured live
`,
  },
  {
    slug: "features/iam-security",
    title: "IAM Security",
    breadcrumb: "Features / IAM Security",
    body: `
IAM Security is the identity posture engine. Where [CIEM](/docs/features/ciem) analyzes entitlements — what identities can do vs what they use — IAM Security audits the **configuration hygiene of the identities themselves**: MFA enrollment, access key age, password policy, root account usage, wildcard admin policies, and identities nobody has touched in months. The result is a risk-scored view of every identity in every connected cloud.

This page covers what the engine checks, how findings are classified into six IAM security modules, and how to read the identity risk table in the console.

![The IAM Security view in the Onam console (demo account)](/screenshots/screenshot-iam.png)

## What IAM Security covers

The engine classifies identity-relevant findings from every posture scan into six modules. Each module gets its own summary, its own pass rate, and its own contribution to the overall IAM posture score.

| Module | What it checks | Example findings |
| --- | --- | --- |
| Least privilege | Over-permission, wildcard grants, privilege escalation | \`wildcard_admin\` policies, full-admin roles |
| Policy analysis | IAM policy structure and versioning | Inline policies, missing policy conditions |
| MFA | Multi-factor enforcement | MFA not enabled, no hardware MFA for root |
| Role management | Role trust and session settings | Overly broad trust principals, long max session duration |
| Password policy | Account password strength and rotation | Minimum length too short, passwords never expire |
| Access control | Console access, root usage, key rotation | Root account activity, access keys older than 90 days |

Coverage spans all 7 clouds. On AWS that means IAM users, roles, and policies; on Azure it includes Entra ID, service principals, managed identities, RBAC assignments, and PIM configuration; on GCP it includes service accounts, workload identity, and organization policies; equivalents apply for OCI, Alibaba Cloud, IBM Cloud, and Kubernetes RBAC.

## How it works

IAM Security runs after the posture scan, as a classification and enrichment pass over the findings corpus:

1. **Read.** The engine loads the scan's findings from the shared findings store.
2. **Classify.** Each finding's \`rule_id\` is matched against 15 identity patterns — \`.iam.\`, \`.mfa\`, \`.password\`, \`.root\`, \`.sso\`, plus Azure-specific patterns (\`.entraid.\`, \`.rbac.\`, \`.pim.\`, \`.serviceprincipal.\`, \`.managedidentity.\`) and GCP-specific ones (\`.serviceaccount.\`, \`.workloadidentity.\`, \`.orgpolicy.\`).
3. **Enrich.** Identity-relevant findings are tagged with the IAM modules they belong to.
4. **Report.** The engine assembles an IAM report: per-module summaries, per-identity rollups, and a tenant-wide IAM posture score.

Because it reuses the full rule registry rather than a separate rule set, IAM Security stays automatically in sync with rule updates — a new Entra ID rule in the registry is an IAM Security finding on the next scan with zero configuration.

![How the IAM Security engine fits into the platform](/diagrams/p-iam.svg)

## The identity risk table

The console presents identities the way an analyst triages them — one row per identity, risk-scored and sortable:

| Identity | Type | Cloud | Risk score | MFA | Oldest key | Open findings |
| --- | --- | --- | --- | --- | --- | --- |
| ci-deploy-user | IAM user | AWS | 94 | No | 412 days | 7 |
| svc-backup | Service principal | Azure | 81 | — | 180 days | 5 |
| admin@corp | Entra ID user | Azure | 76 | No | — | 4 |
| etl-runner@prod | Service account | GCP | 58 | — | 97 days | 3 |
| dev-alice | IAM user | AWS | 22 | Yes | 30 days | 1 |

The risk score (0–100) weights each identity's open findings by severity, privilege level, and exposure — an admin without MFA outranks a read-only user without MFA, and an internet-reachable service identity outranks an internal one. Clicking a row opens the identity's findings, its policies, and its activity summary.

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

> Fixing the IAM Security layer first makes every other engine's numbers better. MFA enforcement and key rotation are the cheapest risk reduction in cloud security — most tenants can clear their Critical identity findings in a single afternoon.

## IAM Security vs CIEM

The two engines are complementary and share the same identity inventory:

| | IAM Security | CIEM |
| --- | --- | --- |
| Question answered | Is this identity configured safely? | Does this identity have more permission than it uses? |
| Data analyzed | Identity configuration (MFA, keys, policies, trust) | Effective permissions vs 90 days of usage history |
| Typical finding | User without MFA, key not rotated | Gap score 87, shadow admin path, unused entitlements |
| Output | Risk-scored identity table, module posture scores | Least-privilege policy suggestions, escalation chains |

Start with IAM Security to fix hygiene, then use [CIEM](/docs/features/ciem) to shrink entitlements toward least privilege.

## Next steps

- [CIEM](/docs/features/ciem) — entitlement analysis and least-privilege remediation
- [CSPM](/docs/features/cspm) — the rule registry that feeds IAM Security's classification
- [Attack Path Analysis](/docs/features/attack-path) — how identity weaknesses chain with network and data exposure
- [Book a demo](/request-demo) — see your identity risk table live
`,
  },
  {
    slug: "features/attack-path",
    title: "Attack Path Analysis",
    breadcrumb: "Features / Attack Path",
    body: `
Attack Path Analysis connects individual security findings — misconfigurations, identity risks, network exposures, and vulnerabilities — into chains that reveal exactly how an attacker would move from an exposed entry point to your most critical assets. Rather than presenting 847 disconnected findings, Onam builds a property graph of your estate and runs automated traversal to surface the paths that actually represent existential risk.

This page explains how the graph is built and verified, how paths are found and ranked, how MITRE techniques are attached per hop, and how **choke points** tell you the one fix that severs the most paths.

![The Attack Path view in the Onam console (demo account)](/screenshots/screenshot-attack-path.png)

## How the graph is built

After every scan, the Attack Path engine ingests results from the platform's 29 engines into a **Neo4j property graph**:

**Nodes** are every resource in the asset inventory — EC2 instances, S3 buckets, IAM roles, Lambda functions, RDS databases, Kubernetes pods, secrets, and the rest — carrying their properties, findings, and classification.

**Edges** are relationships that represent possible attacker movement. They are produced by **~25 catalog-driven edge derivers**, each specialized in one kind of evidence:

- IAM policy derivation — role assumption, PassRole, resource-policy access
- Network exposure — internet-facing endpoints, load balancer chains
- Security group rule matching — which sources can actually reach which ports
- KMS and encryption relationships — who can decrypt what
- CDR behavioral edges — movement actually observed in audit logs
- Public-exposure classification — \`is-public\` on buckets, snapshots, images

The resulting edge types read like attacker verbs: \`can-assume\`, \`can-read\`, \`can-write\`, \`can-reach\`, \`can-escalate\`, \`is-exposed\`.

### Edge verification across five domains

A candidate edge is not enough — a security group may permit traffic that IAM forbids, or a policy may grant access a network path never reaches. Before an edge is marked **CONFIRMED**, it is cross-checked against evidence from five security domains: identity, network, configuration, data, and behavioral signals. Only confirmed edges participate in path traversal, which is why the engine produces short lists of real paths instead of thousands of theoretical ones.

## Path traversal

The engine runs **BFS traversal from entry points toward crown jewels**:

- **Entry points** — internet-exposed endpoints, publicly readable storage, externally assumable roles. Classification is catalog-driven, so new exposure patterns are added without code changes.
- **Crown jewels** — production databases, secrets managers, classified data stores. Also catalog-driven, plus your own tags (see below).

Every discovered path is ranked by:

- **Step count** — shorter paths rank higher
- **Node severity** — paths traversing Critical findings rank higher
- **Blast radius** — paths reaching high-value assets rank higher
- **Exploitability** — EPSS probability and CISA KEV data are incorporated for CVE-adjacent hops

### Crown jewel configuration

Define crown jewels in three ways:

1. Tag resources directly in the console
2. Import existing cloud provider tags (\`env=production\`, \`classification=critical\`)
3. Let [Data Security](/docs/features/data-security) classification auto-tag stores containing PII, PCI, or PHI

Crown jewel assets receive a risk multiplier in the FAIR risk engine — every attack path terminating at a crown jewel carries a boosted exposure score. Without any tags, the engine falls back to heuristics: managed databases, secrets managers, and resources tagged \`env=prod\` are treated as implicit crown jewels.

## Per-hop MITRE ATT&CK chains

Every hop in a path is tagged with the MITRE ATT&CK technique an attacker would use to take it, and the engine tracks **capability accumulation** along the path — what the attacker holds (credentials, network position, data access) after each hop. The result reads like a red-team narrative: entry, escalation, lateral movement, objective.

| Graph element | MITRE technique |
| --- | --- |
| Public S3 bucket to IAM credential exposure | T1552.005 — Cloud Instance Metadata API |
| IAM role to lateral movement | T1078.004 — Valid Accounts: Cloud Accounts |
| EC2 to RDS network path | T1021 — Remote Services |
| Secrets Manager access | T1555 — Credentials from Password Stores |

![An identity escalation chain — one class of edges the graph traverses](/diagrams/feat-ciem-privesc-chain.svg)

## Toxic combinations

Toxic combinations are pairs (or triples) of findings that individually score as Medium but together enable a Critical attack chain.

- Finding A: EC2 instance has IMDSv1 enabled (Medium — SSRF vector)
- Finding B: Instance profile has \`s3:*\` permissions (Medium — overprivileged)
- Together: SSRF, then IMDSv1 credential theft, then full S3 access — a Critical breach path

Onam detects these combinations automatically and surfaces them as unified findings with an aggregate severity of Critical.

## Choke points

Choke points are first-class objects in the graph: nodes or edges that many attack paths share. Fixing one choke point severs every path that runs through it. The console ranks them as the **Top 5 choke points** for your estate, and for each one shows:

1. The fix — for example, remove a public entry point, restrict an overprivileged role, or patch a Critical CVE on a pivot node
2. The number of attack paths it severs
3. The estimated risk reduction in dollars, from the [FAIR risk engine](/docs/features/risk-quantification)

> Remediate choke points before individual paths. One choke-point fix routinely closes 10+ paths at once — it is the highest-leverage action the platform can recommend, and the Top 5 list is the best default agenda for your weekly security review.

## Integration with other engines

| Engine | Contribution to the graph |
| --- | --- |
| [CSPM](/docs/features/cspm) | Entry-point misconfigurations, node-level findings |
| [CIEM](/docs/features/ciem) | Identity edges — assumption chains, permission graphs |
| [Network Security](/docs/features/network-security) | Reachability edges from effective exposure analysis |
| [Vulnerability](/docs/features/vulnerability-management) | CVE nodes enriched with EPSS and KEV |
| [CDR](/docs/features/cdr) | Behavioral edges — movement actually observed in logs |
| [Data Security](/docs/features/data-security) | Crown-jewel classification from data discovery |
| [Risk Quantification](/docs/features/risk-quantification) | Dollar exposure at each path terminus |

## FAQ

**How long does graph construction take?** Graph construction runs automatically after every scan — typically 3–8 minutes for estates up to 10,000 resources. For very large environments (100,000+ resources), incremental updates apply only to changed nodes.

**Can I export attack paths for reporting?** Yes. Paths export as PDF reports (executive summary plus technical detail) or as JSON for SIEM/SOAR ingestion via \`GET /api/v1/attack-paths\`.

**What if I have no crown jewels tagged?** The engine still runs using its catalog heuristics — managed databases, secrets stores, and production-tagged resources are implicit crown jewels until you refine the list.

## Next steps

- [Threat Detection](/docs/features/threat-detection) — how posture, behavior, and correlation fit together
- [Risk Quantification](/docs/features/risk-quantification) — the dollar figures behind path ranking
- [CIEM](/docs/features/ciem) — the identity chains that become graph edges
- [Book a demo](/request-demo) — see your own Top 5 choke points
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
| Correlation | [Attack Path](/docs/features/attack-path) and Investigation | Findings plus detections | Attack paths, toxic combinations, choke points |

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
- **Toxic combinations.** Two Medium findings that together enable a Critical chain are detected and re-scored automatically.
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
  {
    slug: "features/secops",
    title: "SecOps — Code & Application Security",
    breadcrumb: "Features / SecOps",
    body: `
Onam SecOps brings SAST, DAST, and SCA/SBOM scanning into the same platform as your cloud posture data — correlating code vulnerabilities with cloud exposure context to surface the risks that truly matter. A SQL injection in an internet-exposed function with broad IAM permissions is not the same risk as the identical bug in an internal batch job; SecOps scores them accordingly.

This page covers the three scan types, SBOM generation, the AI-powered fix engine, and CI/CD integration.

## SAST — static application security testing

The SAST engine analyzes source code across **7 languages** using dedicated per-language scanners plus a Semgrep-based rule engine with curated rule packs:

| Language | Coverage focus |
| --- | --- |
| Python | Injection, unsafe deserialization, crypto misuse, hardcoded secrets |
| JavaScript / TypeScript | XSS, prototype pollution, ReDoS, SSRF |
| Java | Deserialization, XXE, SSRF, expression-language injection |
| Go | Race conditions, crypto misuse, SSRF |
| C | Buffer overflows, format strings, memory safety |
| C++ | Use-after-free, integer overflow, unsafe casts |
| C# | Deserialization, path traversal, LDAP injection |

A dedicated Kubernetes manifest scanner covers workload definitions alongside application code. Rule content draws on the OWASP Top 10, CWE Top 25, and cloud-specific security patterns, and custom rules are authored in Semgrep-compatible YAML — version-controlled alongside your repository content.

## DAST — dynamic application security testing

The DAST scanner exercises running applications with active test payloads across 12 vulnerability classes:

- SQL injection (MySQL, PostgreSQL, MSSQL, Oracle, SQLite variants)
- Cross-site scripting (reflected, stored, DOM-based)
- Server-side request forgery (internal network, cloud metadata endpoints)
- XML external entity injection
- Template injection (Jinja2, Twig, Freemarker, Pebble, Velocity)
- IDOR / broken object-level authorization
- Authentication bypass (default credentials, forced browsing, JWT attacks)
- Business logic flaws (price manipulation, quantity bypass)
- HTTP request smuggling
- GraphQL introspection and injection
- API security (broken authentication, excessive data exposure, mass assignment)
- File upload bypass

> Point DAST only at environments you own and are authorized to test. Payloads are active — they exercise real injection and authentication paths. Staging environments with production-like configuration give the best signal.

## SCA — software composition analysis

SCA scans third-party dependencies across the major package managers — npm/yarn/pnpm, pip/poetry, Maven/Gradle, Go modules, Cargo, Bundler, Composer, and NuGet — and builds the **full transitive dependency tree**, not just direct dependencies. CVEs are flagged at the level where they are introduced and attributed back to the direct dependency that brought them in.

Every component is enriched from the same intelligence feeds the [Vulnerability engine](/docs/features/vulnerability-management) uses:

| Source | What it adds |
| --- | --- |
| NVD | CVE records with CVSS v3 scores and vectors |
| EPSS | 30-day exploit probability (FIRST.org daily feed) |
| CISA KEV | Active-exploitation flag (daily feed) |
| OSV / GitHub Security Advisories | Ecosystem-specific advisories |

## SBOM generation

The SBOM engine generates a complete Software Bill of Materials from a Git repository URL — it clones the repo, reads every dependency file directly from source, and builds the component inventory. No external tooling required.

- Output is **CycloneDX 1.5**, the OWASP standard format required by US Executive Order 14028 for federal software contracts
- Full component inventory: name, version, package URL, licenses, checksums
- CVE status pre-populated for every component, with EPSS and KEV data embedded
- **VEX support** — record "this CVE exists in our dependency but we are not affected because..." with a documented reason, so known-safe findings stay silenced with an audit trail
- Accepts pre-built CycloneDX or SPDX files as an alternative input path
- Exportable as JSON or XML for procurement, regulatory, and audit purposes

![How SBOM components map to vulnerability intelligence](/diagrams/feat-vuln-sbom.svg)

## AI-powered fixes

For SAST findings, the platform's Remediation engine generates a source-code fix — not just a description of the problem:

1. **Context injection** — the engine receives the vulnerable snippet, the surrounding file context, the finding description, and the cloud context: is this code running in an internet-exposed function, and what IAM permissions does it hold?
2. **Fix generation** — a corrected code diff is produced that addresses both the code vulnerability and any amplifying cloud context.
3. **Confidence scoring** — each fix is rated High, Medium, or Low confidence based on similarity to known-good fix patterns.
4. **PR integration** — fixes can be applied directly as pull request suggestions in GitHub, GitLab, and Bitbucket.

## CI/CD integration

SecOps runs as a CI/CD check, so vulnerable code and dependencies are blocked before they ship:

\`\`\`
- uses: onam-security/secops-scan@v2
  with:
    api_key: \${{ secrets.ONAM_API_KEY }}
    fail_on: critical    # critical | high | medium
    exclude_accepted: true
\`\`\`

Blocking gates are configurable per environment:

- Block any deployment to production with a Critical SAST finding
- Block any dependency with a KEV-flagged CVE from reaching staging
- Warn (non-blocking) on Medium findings in development branches

For infrastructure templates — Terraform, CloudFormation, Helm charts, Kubernetes manifests, ARM/Bicep, Pulumi, and Docker Compose — see [IaC Scanning](/docs/features/iac-scanning), which runs in the same CI/CD flow.

## FAQ

**How does SCA handle transitive dependencies?** The full dependency tree is resolved to any depth. A CVE in a transitive dependency is flagged where it is introduced and attributed to the direct dependency that pulled it in, so you know exactly what to upgrade.

**What is the difference between SecOps scanning and the CSPM engine?** CSPM scans deployed cloud resources through read-only cloud APIs. SecOps scans source code, running applications, and dependencies before and after deployment. Running both gives you pre-deploy prevention and post-deploy verification.

**Can I write custom SAST rules?** Yes. Custom rules use Semgrep-compatible YAML, apply to any supported language, and are version-controlled alongside your repository content.

## Next steps

- [IaC Scanning](/docs/features/iac-scanning) — catch misconfigurations in templates before deployment
- [Vulnerability Management](/docs/features/vulnerability-management) — the shared CVE, EPSS, and KEV intelligence pipeline
- [Container Security](/docs/features/container-security) — image scanning and Kubernetes posture
- [Book a demo](/request-demo) — see a repository scanned end to end
`,
  },
];
