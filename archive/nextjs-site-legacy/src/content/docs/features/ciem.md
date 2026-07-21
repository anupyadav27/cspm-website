# Cloud Identity & Entitlement Management (CIEM)

CIEM analyzes every identity in your cloud — human users, service accounts, IAM roles, federated logins, machine identities — and answers two hard questions: **what can each identity actually do?** and **what does each identity actually need?** The gap between those two answers is your excess permission risk. The platform measures it, prioritizes it, and gives you a least-privilege policy you can apply with confidence.

<img src="/diagrams/ciem.svg" style="width:100%;max-width:920px;border-radius:10px;" alt="CIEM entitlement analysis" />

**Why CIEM matters in 2026:** the average cloud identity has been granted **80% more permissions than it ever uses**. Most cloud breaches now start with a compromised low-privilege identity that is then escalated through unused permissions to admin. CIEM is the discipline of closing that gap — and it is the only practical way to enforce least-privilege at cloud scale, because no human team can review a million entitlements by hand.

---

## The Identity Risk Problem

Modern cloud environments accumulate identities and permissions faster than security teams can review them. Every new microservice creates a new IAM role; every new SaaS integration creates a new federation; every new developer creates a new user. Permissions get added when needed but rarely removed when no longer used.

**The four risks this creates:**

| Risk | What it looks like | Why it's dangerous |
|---|---|---|
| **Overprivileged identities** | A role with `s3:*` that only ever called `s3:GetObject` | If compromised, the attacker inherits the entire blast radius — not just the actually-used permission |
| **Shadow admins** | A role that can `iam:PassRole` to a role that can `iam:CreatePolicyVersion` | Indirect path to admin that no one wrote down — invisible to manual review |
| **Stale identities** | An ex-employee's IAM user with valid access keys 18 months later | A high-trust credential nobody is monitoring |
| **Cross-account trust risks** | A role that trusts `arn:aws:iam::123456789:root` from an unknown account | Lateral movement boundary is wider than you think |

**The industry baseline figure:** **80% of granted permissions are never used.** This isn't a flaw in your design — it's a structural property of cloud IAM. Permissions are granted defensively ("just in case"), workloads change, and nobody goes back to clean up. CIEM is what brings that 80% back down.

---

## How CIEM Works

CIEM is a three-stage pipeline that runs against every identity on every scan: **collect** the raw IAM configuration and usage data, **analyze** what's actually callable vs what's actually used, and **emit** prioritized findings with suggested fixes.

<img src="/diagrams/feat-ciem-pipeline.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="How CIEM works — Collect → Analyze → Findings, three-stage pipeline" />

**Reading the diagram left to right:**

### 1. Collect — what the platform reads from your cloud

Every CIEM scan reads three classes of data through your read-only credential. No agents, no policy changes, no IAM modifications.

- **IAM policies** — every identity-based policy, every resource-based policy (S3 bucket policies, KMS key policies, Lambda permissions), every Service Control Policy at the org level, every permission boundary, every trust relationship.
- **Usage history** — the last 90 days of CloudTrail (AWS), Activity Logs (Azure), Cloud Audit Logs (GCP), or equivalent. The platform reads which identity called which API on which resource.
- **Identity catalog** — every user, group, role, service account, workload identity, federated identity, and cross-account trust. Federation chains and identity center mappings are followed end-to-end.

### 2. Analyze — what the platform calculates per identity

Each scan computes four artifacts for every identity in scope:

- **Effective Permissions** — the resolved intersection of all five AWS policy sources (or the equivalent for Azure / GCP / OCI). This is what the identity *can actually call* — different from what's attached on paper.
- **Used Permissions** — what the identity actually called in the last 90 days, derived from CloudTrail / Activity Logs / Cloud Audit.
- **Unused Permissions** — granted but never exercised. These are the candidates for safe removal.
- **Identity Attack Paths** — multi-hop chains of `sts:AssumeRole` and `iam:PassRole` that lead from this identity to a role with privilege-escalation permissions. The platform follows the chains automatically.

### 3. Findings — what you see in the dashboard

The output is severity-ranked findings, not raw data:

- **Overprivileged identities** with a 0–100 gap score and a generated least-privilege policy ready to apply.
- **Shadow admins** — every indirect path to admin via role assumption.
- **Stale access** — identities inactive 90+ days, unrotated keys, ex-employee accounts.
- **Cross-account risks** — every trust relationship to an account outside your organization.

<img src="/diagrams/p-ciem.svg" style="width:auto;max-width:100%;display:block;margin-left:auto;margin-right:auto;border-radius:10px;margin-bottom:16px;" alt="Onam CSPM — CIEM platform view showing entitlement analysis and identity risk dashboard" />

---

## Effective Permissions — what an identity can actually do

Cloud IAM is one of the most complex systems in your stack. Permissions don't come from a single source — they come from **five overlapping policy types** that interact through a precise resolution algorithm. The platform computes the resolved set for every identity automatically.

<img src="/diagrams/feat-ciem-effective-perms.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="Effective permissions — 5 AWS policy sources intersected to produce what an identity can actually call" />

**The five permission sources, in precedence order:**

| # | Source | What it does | Can grant? | Can deny? |
|---|---|---|:---:|:---:|
| 1 | **Identity-based policies** | Attached directly to user, group, or role | ✅ | ✅ |
| 2 | **Resource-based policies** | Attached to a resource (S3 bucket policy, KMS key policy, Lambda permissions) | ✅ | ✅ |
| 3 | **Service Control Policies (SCPs)** | Org-level guardrails — apply to every account and identity in the org | ❌ | ✅ |
| 4 | **Permission boundaries** | Cap the *maximum* effective permissions for an identity | ❌ | ✅ |
| 5 | **Session policies** | Apply only during the specific STS session | ❌ | ✅ |

**The resolution rule in plain English:** an action is allowed only if there's an explicit Allow somewhere AND no Explicit Deny anywhere. Explicit Deny always wins. SCPs and permission boundaries can never grant — they can only restrict.

**Why this matters for CIEM:** "what's attached" can be wildly different from "what's actually callable". A role might appear to have `s3:*` in its identity policy, but a permission boundary caps it to `s3:GetObject`. The platform shows you the truly callable set — that's the basis for the gap score and the suggested least-privilege policy. Manual reviews of "what's attached" miss this every time.

**Cross-CSP coverage:** the same effective-permission resolution runs for Azure RBAC (role assignments × scope inheritance × deny assignments), GCP IAM (allow policies × deny policies × organization policies), OCI IAM (compartment hierarchy × policy statements), and the others. The mechanism varies; the goal is the same.

---

## Least Privilege Gap Score

Each identity receives a single **Least Privilege Gap Score** from 0 to 100. The score is a direct measure of "how much excess permission does this identity carry?" — higher is worse.

| Score range | Meaning | Recommended action |
|---|---|---|
| **0–20** | Minimal excess | Low priority — monitor on the next scan |
| **21–50** | Moderate excess | Review at the next quarterly access review |
| **51–80** | Significant excess | Remediate within 30 days |
| **81–100** | Extreme excess — admin or near-admin without justification | Remediate immediately |

**The score formula:**

```
Gap Score = (unused_permissions / total_permissions) × severity_weight × exposure_weight
```

Where:

- **`unused_permissions / total_permissions`** is the basic ratio of how much of the granted permission set is never exercised.
- **`severity_weight`** is higher for write/admin permissions than for read — being able to delete S3 buckets weighs more than being able to list them.
- **`exposure_weight`** is higher for identities reachable from the internet (Lambda functions behind a public API gateway, EC2 instances with public IPs) than for purely-internal identities.

**Why this isn't a simple percentage:** treating "80% of permissions unused" the same way regardless of which permissions you're talking about creates false equivalence. An identity with 80% of its `s3:GetObject`-only permissions unused is materially different from an identity with 80% of its `iam:*` permissions unused. The weighting captures that.

---

## Identity Attack Paths

CIEM doesn't stop at single-identity analysis. It traces **multi-hop permission chains** — paths an attacker could follow to escalate from a low-privileged starting identity all the way to full admin. Most real-world cloud breaches use chains exactly like the one below; almost none of them are visible from looking at any single identity in isolation.

<img src="/diagrams/feat-ciem-privesc-chain.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="Identity attack path — privilege escalation from compromised Lambda to full admin via 5-hop role chain" />

**Walking the example chain hop by hop:**

| Hop | Where you are | The permission that lets you advance | Why this hop is dangerous |
|---|---|---|---|
| 1. Start | Compromised Lambda function (low-priv) | `sts:AssumeRole` on `app-processor` | Lambda function code is the attacker's foothold; they execute with the function's role |
| 2. → app-processor role | Has `iam:PassRole` on `data-pipeline-role` | `iam:PassRole` | The role can hand off another role — without `PassRole`, the chain stops here |
| 3. → data-pipeline-role | Has S3 admin AND `iam:CreatePolicyVersion` | `iam:CreatePolicyVersion` | The killer permission — lets the attacker write a brand-new admin policy |
| 4. Privilege escalation | Attacker creates an `Allow *:*` policy version and attaches it | `iam:AttachUserPolicy` | One API call from new policy to attached admin |
| 5. Full admin | All services, all regions | — | Game over: data exfil, key rotation, account takeover, billing changes |

**The platform finds these chains by:**

1. **Enumerating every reachable role** from each identity — following `sts:AssumeRole` and `iam:PassRole` edges in the security graph.
2. **Tagging every permission** that enables self-escalation — `iam:CreatePolicyVersion`, `iam:AttachUserPolicy`, `iam:PutRolePolicy`, `iam:CreateAccessKey`, `iam:UpdateAssumeRolePolicy`, plus equivalent permissions in Azure/GCP/OCI.
3. **Flagging any chain** that ends in one of those self-escalation permissions, regardless of how many hops in between.
4. **Showing you which control would have prevented it** — usually a permission boundary on the intermediate role, or removing `iam:PassRole` if it's not actually used in production.

**Common chains the platform catches:**

- Lambda → role with `iam:PassRole` → role with admin
- EC2 instance role → role with `iam:CreatePolicyVersion`
- Cross-account trust to an account that itself has weak controls
- Federated user → SSO role with `iam:UpdateAssumeRolePolicy` on org-management roles
- Service account in GKE → workload identity that maps to a GCP service account with `iam.serviceAccountKeys.create`

**Two MITRE ATT&CK techniques** map to this finding type: `T1098.001 Account Manipulation: Additional Cloud Credentials` and `T1078.004 Valid Accounts: Cloud Accounts`. Each finding is mapped automatically.

---

## Supported Identity Types

CIEM coverage spans every identity type that exists in your cloud — humans, machines, federations, and cross-account trusts. Coverage parity is high across CSPs for the common types; some advanced types are AWS-only today and on the roadmap for the others.

| Identity Type | AWS | Azure | GCP | OCI | AliCloud | IBM |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Human users | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Service accounts / managed identities | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| IAM roles / app registrations | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Federated identities (SAML / OIDC) | ✅ | ✅ | ✅ | — | — | — |
| Workload identities (EC2 instance roles, AKS pod identity, GKE workload identity) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Serverless identities (Lambda execution roles, Functions) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Third-party cross-account access | ✅ | — | — | — | — | — |

A "—" doesn't mean unsupported in principle — it means the CSP either doesn't implement that identity type natively or implements it through a different mechanism that the platform handles via a different identity row in the table.

---

## Key CIEM Findings

These are the ten most-encountered CIEM findings across customer environments. Severity is set per finding type — you can re-grade in your tenant settings if your risk tolerance differs.

| Finding | Severity | What it means | Why it's dangerous |
|---|---|---|---|
| Root account used recently | CRITICAL | AWS root account had activity in the last 90 days | Root has every permission and bypasses every guardrail — should be locked away |
| `AdministratorAccess` attached directly to a user | CRITICAL | A human user has admin without role assumption | Admin should always be assumable, never permanent — assumption creates an audit log |
| MFA not enabled for privileged user | HIGH | Admin or high-permission user has no MFA enrolled | Single factor for a high-impact identity |
| Service account with owner / admin role | HIGH | A machine identity has cloud-level admin | If the machine is compromised, so is the cloud account |
| Cross-account trust with unknown account | HIGH | A role trusts an external AWS account ID not in your organization | Lateral movement boundary — could be a partner, could be an attacker |
| Unused IAM user with active access keys | HIGH | Ex-employee or orphaned account with valid credentials | Highest-trust credential class with no monitoring |
| 90+ days inactive access key | MEDIUM | Key not rotated and not in use | Probably abandoned — unrotated abandoned keys are a top breach precursor |
| Overprivileged role — gap score > 80 | HIGH | Role has extensive unused permissions | Compromise blast radius is far larger than its actual job |
| Shadow admin path detected | HIGH | Indirect path to admin via role assumption chain | Invisible without graph analysis — usually unintentional |
| Wildcard resource on sensitive actions | HIGH | `iam:*` or `s3:*` on `Resource: *` in a policy | Worst-case scope on the most-abused permissions |

Every finding includes the affected identity, the specific policy or trust at fault, the suggested fix, and the framework controls it satisfies (CIS IAM controls, NIST AC family, ISO A.5.15/A.5.18, SOC 2 CC6.1, etc.).

---

## Remediation Workflow

CIEM findings come with **a generated least-privilege policy** ready to apply — not just a flag. The platform synthesizes the suggested policy from what the identity actually used in the last 90 days, presents it for your review, and never modifies your IAM without your explicit approval.

<img src="/diagrams/feat-ciem-remediation.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="CIEM remediation workflow — finding to verified fix in 5 stages" />

**The five-stage workflow:**

1. **Detected.** A CIEM finding fires on the next scan — e.g. "role `data-pipeline-role` has gap score 87 / 100, 12 unused services". Severity is set, MITRE technique is mapped, framework citations are attached.
2. **Review.** Your analyst opens the finding. The UI shows a side-by-side diff of *effective* vs *used* permissions over the last 90 days. You can drill into specific actions, specific resources, specific times of day.
3. **Suggested policy.** The platform generates a least-privilege policy in JSON, scoped exactly to the actions and resources actually used. You can adjust it — for example, expand a wildcard if seasonal usage was missed, or add a deny for a sensitive action.
4. **Apply.** You decide how — copy to the AWS Console, hand off to your IaC pipeline (Terraform / CloudFormation), or trigger an approved automation hook. **The platform never auto-applies.**
5. **Verify.** The next scheduled scan re-evaluates the identity. The gap score should drop, the finding should auto-close, and the framework score should improve. If the score didn't improve as expected, the platform tells you why — for example, "policy was applied but a permission boundary still allows the wildcard".

**Why we never auto-apply:** least-privilege errors break production. Removing a permission an identity uses only during quarterly batch jobs, or only during a specific code path, or only for a particular workload, can cause an outage. The 90-day window catches most patterns but cannot catch all of them. We give you the suggested policy with full context so you make the call.

**Bulk remediation** is supported on Pro and Enterprise plans — you can review and apply a batch of suggested policies through your CI/CD pipeline with a single approval. The platform records every approval in the audit log for your auditor.

---

## API

The CIEM API is part of the unified platform API. All endpoints require an authenticated session and are scoped to your tenant.

```http
# List CIEM findings
GET /gateway/api/v1/ciem/findings?severity=HIGH&status=OPEN

# Get effective permissions for one identity
GET /gateway/api/v1/ciem/identity/{identity_id}/permissions

# Get every attack path that originates from one identity
GET /gateway/api/v1/ciem/identity/{identity_id}/attack-paths

# CIEM posture summary (rolled-up score across the tenant)
GET /gateway/api/v1/views/iam

# Generate / fetch the suggested least-privilege policy for one identity
GET /gateway/api/v1/ciem/identity/{identity_id}/suggested-policy
```

Full request/response schemas in the [API Reference](/docs/reference/api-reference/). Webhook delivery on new HIGH/CRITICAL CIEM findings can be configured under **Settings → Notifications**.

---

## Frequently Asked Questions

**How long does CIEM analysis take per account?**
A typical AWS account with 200 identities and 90 days of CloudTrail history completes the CIEM stage of a scan in under 90 seconds. Larger accounts (1,000+ identities) take 3–5 minutes.

**Does CIEM modify any IAM in my account?**
No. The platform reads IAM configuration and usage data, generates suggested policies, and presents them for your approval. Application of policies is always your action — manually, via IaC, or via an automation hook you configure.

**What if I don't have 90 days of CloudTrail history?**
The platform uses whatever history is available and notes the lookback window on every finding. With less than 30 days of history, the gap scores are more conservative — the platform errs on the side of "this might be used during a longer cycle".

**Can I customize what counts as a privilege-escalation permission?**
Yes. The default set covers the well-known escalation permissions across AWS / Azure / GCP / OCI. You can extend the set with org-specific permissions in **Settings → CIEM → Escalation Definitions**.

**Does CIEM cover AWS Identity Center (formerly SSO)?**
Yes. Identity Center permission sets, federated user assignments, and the resulting per-account roles are all enumerated. SAML and OIDC federations are followed end-to-end.

**Can I export the suggested policies?**
Yes. Suggested policies export as Terraform `aws_iam_policy` blocks, CloudFormation snippets, raw JSON, or directly to your existing IaC repository via webhook. CSV export of all CIEM findings is also supported.

---

*Last updated: 2026-05-08*
*For questions: support@onam.io*
