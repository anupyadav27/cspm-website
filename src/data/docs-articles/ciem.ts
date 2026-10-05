import type { DocArticle } from "./types";

/**
 * The CIEM documentation section (/docs/ciem/*).
 *
 * Ground truth: threat-engine engines/iam (run_scan.py, writers/, detectors/,
 * analyzers/, scoring/, storage/access_review_store.py) and frontend/src/app/ciem,
 * checked 2026-10-05. Rules for editing:
 *   - Say which cloud a capability runs on. AWS is the deepest; do not let a
 *     sentence imply the others match it.
 *   - No product numbers unless they are `status: cleared` in the marketing
 *     facts file (product.yaml). The CIEM catalogue count is NOT cleared.
 *   - Do not describe the least-privilege policy generator as a shipped feature:
 *     the pipeline does not store a generated policy today.
 */
export const articles: DocArticle[] = [
  {
    slug: "ciem/overview",
    title: "CIEM overview",
    breadcrumb: "CIEM / Overview",
    body: `
Onam CIEM resolves what each cloud identity can do, finds its escalation paths, and turns the riskiest into tracked access reviews.

![How Onam CIEM works — identity sources, effective-permission resolver, identity graph, findings and access reviews](/diagrams/ciem-architecture.svg)

## What CIEM answers

| Question | Where you find the answer |
| --- | --- |
| What can this identity actually do? | The **Effective Access** panel on the IAM Security screen — search any principal |
| Can it make itself an admin? | **Escalation** findings and the **Shadow Admins** count on the CIEM screen |
| Who outside my account can get in? | **Cross-Account** findings — external, wildcard and federated trust |
| What has it been granted but never used? | **Least Privilege** column and the identity detail dialog (AWS) |
| Which identities should a person look at first? | **Risk Score** column and the **Access Reviews** view (AWS) |

## How it fits together

1. **Identity sources.** CIEM reads identities, policies and trust settings from the cloud inventory that Onam's posture scan already builds. It makes no extra calls into your cloud. On AWS it also reads CloudTrail activity collected by Onam's threat detection.
2. **Effective-permission resolver.** Per identity: group expansion, condition classification, explicit-deny netting and SCP deny checks, producing one effective-access row per identity, resource scope and access level. See [How effective permissions are computed](/docs/ciem/effective-permissions).
3. **Identity graph.** Identity relationships are written to the platform's security graph, where escalation, blast radius and Attack Path analysis read them. See [Reading the identity graph](/docs/ciem/identity-graph).
4. **Findings and reviews.** Escalation paths, shadow admins, risky trust, unused permissions and stale roles become findings; AWS identities get a 0–100 risk score, and high-tier identities open an access review. See [Finding types](/docs/ciem/finding-types) and [Right-sizing workflow](/docs/ciem/right-sizing).

## CIEM and IAM Security

Both are views of one identity engine and share one inventory.

| | IAM Security | CIEM |
| --- | --- | --- |
| Question | Is this identity configured safely? | What can it do, how could it escalate, what does it never use? |
| Typical finding | User without MFA, access key past rotation, wildcard policy | PassRole to an admin role, external trust without ExternalId, high permission gap |
| Unit of analysis | One setting on one identity | The identity after policies, groups, denies and trust are resolved |
| Console | IAM Security screen (with the Effective Access panel) | CIEM screen: Identities, Findings, Access Reviews |

Start with [IAM Security](/docs/features/iam-security) to clear hygiene; use CIEM to shrink access and close escalation paths.

## The CIEM screen

The console's CIEM screen has three views:

- **Identities.** Headline counts for identities at risk, escalation paths (with how many are CDR-confirmed), shadow admins and zombie identities; a breakdown by identity type — roles, users, service accounts, root; and a table with risk score, least-privilege gap, blast radius, admin access and zombie status per identity. Clicking a row shows the score breakdown and the high-risk unused actions.
- **Findings.** One table for escalation, policy, cross-account and database identity findings, with bulk suppress, export and ticket creation.
- **Access Reviews.** The attestation queue — see [Right-sizing workflow](/docs/ciem/right-sizing).

## Coverage at a glance

AWS has the deepest coverage: full effective-permission resolution, multi-hop assume-role chains, shadow admins, unused permissions, risk scoring and access reviews. Azure, GCP and Kubernetes have effective access and escalation detection; OCI and IBM Cloud have escalation detection; trust checks run on every cloud except Kubernetes. Details are in [Per-cloud notes](/docs/ciem/per-cloud).

## What CIEM does not do

- **It never changes your IAM.** Findings and reviews tell you what to remove; you remove it.
- **Unused-permission analysis is AWS-only today**, and needs CloudTrail activity to be flowing into Onam's threat detection.
- **There is no separate identity-graph screen.** You read the graph through the Effective Access panel, escalation findings and the [Attack Path](/docs/features/attack-path) view.
`,
  },
  {
    slug: "ciem/effective-permissions",
    title: "How effective permissions are computed",
    breadcrumb: "CIEM / Effective permissions",
    body: `
An identity's effective permissions are what it can do once group membership, conditions, explicit denies and organisation guardrails are applied.

Reading the policy attached to a role does not tell you that. Onam resolves it per identity and stores the result in one effective-access table that the console, the escalation detectors and Attack Path all read.

![Effective permissions on AWS — statements, group expansion, condition classes, deny and SCP checks, result](/diagrams/ciem-effective-access.svg)

## AWS: the five steps

### 1. Collect statements

Every identity-based policy statement — managed and inline, on users, roles and groups — is recorded with its effect, actions, resources and conditions.

### 2. Expand groups

Statements attached to a group are copied onto each member user and tagged *inherited via* that group, so a user's effective access includes what it gets through its groups. Admin access that arrives this way raises its own finding.

### 3. Classify conditions

Each condition is classed from an attacker's point of view, and the worst class across a statement's keys wins:

| Class | Meaning | Examples |
| --- | --- | --- |
| Always true | An attacker meets it trivially | \`aws:SecureTransport\`, \`aws:RequestedRegion\`, \`aws:UserAgent\` |
| Context-dependent | Met if the attacker controls the principal | \`aws:MultiFactorAuthPresent\`, session tags |
| Effectively blocking | Needs out-of-band access | source IP, VPC endpoint, organisation membership, \`sts:ExternalId\` |

### 4. Net out denies and check SCPs

An explicit deny overrides an overlapping allow, unless the deny's own condition is one an attacker cannot meet. Overridden rows are kept and marked, so you can see that a grant exists but is denied. Where Onam can read your AWS Organization, SCP deny statements are checked and blocked grants are marked *SCP-blocked*.

### 5. Record access level and flags

Each resulting row carries:

| Field | Values |
| --- | --- |
| Access level | admin · IAM control · write · read · list · tagging |
| Admin | the grant is admin-equivalent |
| Cross-account | the grant crosses an account boundary |
| Net allow | false when a deny overrides it |
| SCP-blocked | an SCP deny statement blocks it |

## What is not modelled yet

Say this out loud before you rely on the result:

- **Granularity.** Rows are kept per statement and service, not per individual API action.
- **Allow-list SCPs** (an SCP that permits only listed services) are not modelled; only SCP deny statements are.
- **Permission boundaries** are recorded but do not yet reduce effective access.
- **Resource-based policies** (S3 bucket policies, KMS key policies and similar) are collected and feed Attack Path, but are not folded into the effective-access table.
- **Session policies** are not modelled.

## Azure, GCP and Kubernetes

- **Azure.** Role assignments are joined to their role definitions, the scope is classified — management group, subscription, resource group or resource — and ABAC conditions on assignments are evaluated. Entra group membership is not expanded.
- **GCP.** IAM bindings on projects, service accounts and data resources (buckets, BigQuery datasets, Pub/Sub topics) become effective-access rows, with GCP roles mapped onto the same access levels.
- **Kubernetes.** RoleBindings and ClusterRoleBindings are resolved to service accounts and their rules; secrets access and pods/exec are treated as their own high-risk levels.

OCI, Alibaba Cloud and IBM Cloud are analysed at the policy level for escalation and hygiene, without an effective-access table.

## Looking it up in the console

Open **IAM Security → Effective Access** and search for a principal by name, ARN or service account. The detail view groups the identity's access by resource type and shows the access level, allow or deny, the first actions, where a grant was inherited from, and the admin, cross-account and SCP-blocked flags.
`,
  },
  {
    slug: "ciem/finding-types",
    title: "CIEM finding types",
    breadcrumb: "CIEM / Finding types",
    body: `
Every CIEM finding type, what triggers it, and the clouds it runs on today. Severities shown are the defaults the detectors assign.

## Privilege escalation

| Finding | Trigger | Severity | Cloud |
| --- | --- | --- | --- |
| Escalation via PassRole | \`iam:PassRole\` on \`*\`, with an admin role present in the account | Critical | AWS |
| Escalation via assume-role chain | A chain of trust relationships — searched over many hops — leads from the identity to an admin role | High | AWS |
| Escalation via boundary bypass | The identity can delete or replace permission boundaries | High | AWS |
| Escalation via service-linked role | The identity can create service-linked roles | High | AWS |
| Escalation via RBAC owner, PIM activation, service principal owner rights | Owner-level or activatable privileged assignments | High–Critical | Azure |
| Escalation via key creation, primitive role, workload identity | Service-account key creation, owner/editor bindings, broad workload identity | High–Critical | GCP |
| Escalation via policy, group or user management; tenancy admin; secret access; broad dynamic groups; instance principals | OCI policy statements that let an identity widen its own access | High–Critical | OCI |
| Escalation via IAM identity admin, access-group management, API-key creation, secrets access | IBM Cloud policies that let an identity widen its own access | High–Critical | IBM Cloud |
| RBAC escalation | Service account bound to cluster-admin, able to write Roles or ClusterRoles, exec into pods, or read secrets cluster-wide | High–Critical | Kubernetes |

Escalation findings are marked *SCP-blocked* and lowered to informational when an SCP deny statement blocks the action they rely on.

**CDR-confirmed.** When Onam's cloud detection and response has seen the same identity call escalation operations in the last month — AssumeRole, PassRole, CreatePolicyVersion, AttachRolePolicy, AttachUserPolicy, DeleteRolePermissionsBoundary, CreateServiceLinkedRole — the AWS finding is raised to critical and marked confirmed. This shows the identity has been exercising escalation operations. It does not prove every hop of the path was walked.

## Shadow admins (AWS)

Identities that are not admins on paper but can make themselves one. Admin is recognised as AdministratorAccess, PowerUserAccess or IAMFullAccess.

| Pattern | Trigger | Severity |
| --- | --- | --- |
| Policy attachment | \`iam:AttachRolePolicy\` or \`iam:AttachUserPolicy\` on \`*\` | Critical |
| Policy version rewrite | \`iam:CreatePolicyVersion\` with \`iam:SetDefaultPolicyVersion\` | Critical |
| Role creation | \`iam:CreateRole\` with \`iam:AttachRolePolicy\` | High |
| Group membership | \`iam:AddUserToGroup\` where a group holds an admin policy | High |

## Trust and access

| Finding | Trigger | Cloud |
| --- | --- | --- |
| Wildcard trust principal | A role trust policy allows \`*\` | AWS |
| Cross-account role without ExternalId | A foreign account can assume the role and there is no \`sts:ExternalId\` condition | AWS |
| User with admin access | A user has admin-equivalent effective access | AWS |
| Admin via group membership | Admin access is inherited from a group | AWS |
| Policy allows what an SCP denies | A grant that an SCP deny statement blocks | AWS |
| Cross-tenant access without conditional access | External identity-provider access without conditional access | Azure |
| Service principal or managed identity at broad scope | Owner, Contributor or User Access Administrator at subscription or management-group scope | Azure |
| Workload identity pool without attribute condition | Any token from the federated issuer can map in | GCP |
| Trusted profile trusting another account | Trusted profile policy scoped to an external account | IBM Cloud |
| RAM role with wildcard trust, or assumable without MFA | Broad or unprotected RAM role trust | Alibaba Cloud |
| Dynamic group matching a whole compartment | Matching rule wider than a specific resource | OCI |

## Usage-based (AWS)

| Finding | Trigger |
| --- | --- |
| Stale role | No CloudTrail activity for the role in the recent activity window |
| Permission gap | Granted actions the identity has not called; the high-risk unused ones — such as \`iam:PassRole\`, \`iam:CreatePolicyVersion\`, \`s3:PutBucketPolicy\`, \`kms:ScheduleKeyDeletion\`, \`sts:AssumeRole\` — are listed separately |

## Database identity activity

Detections from credentialed database connections (for example PostgreSQL, MySQL, SQL Server, Oracle, MongoDB, Snowflake): new superuser or admin role grants, failed-login spikes, logins from unexpected addresses, bulk reads and audit-configuration changes. They appear under the **Database CIEM** module in the CIEM findings table. This is activity detection, not an analysis of table-level grants.

## Identity posture rules

CIEM findings sit alongside the identity rules in Onam's posture catalogue — 1,459 rules in the identity domain — which the [IAM Security](/docs/features/iam-security) view covers: MFA, key age, password policy, root usage and wildcard policies.
`,
  },
  {
    slug: "ciem/identity-graph",
    title: "Reading the identity graph",
    breadcrumb: "CIEM / Identity graph",
    body: `
CIEM writes identity relationships into Onam's security graph, so "who can reach this role?" becomes a graph question.

## Edges CIEM writes

| Edge | From → to | Cloud |
| --- | --- | --- |
| has-policy | User or role → managed policy | AWS |
| member-of | User → group | AWS |
| assumes | Trusted principal → role (marked when it crosses accounts) | AWS |
| can-access | Identity → a specific resource named in its policy | AWS |
| runs-as | Compute instance → service account; pod → Kubernetes service account | GCP, Kubernetes |
| uses-identity | Virtual machine → managed identity | Azure |

On Kubernetes, workload-identity annotations (EKS IRSA, GKE Workload Identity, AKS Workload Identity) link a service account to the cloud identity it maps to.

## Where you read it

There is no separate identity-graph screen. The graph shows up in four places:

1. **Effective Access panel** (IAM Security screen) — one identity's resolved access, with where each grant was inherited from.
2. **Escalation findings** (CIEM screen) — the assume-role chain behind an *escalation via assume-role chain* finding is a path through the assumes edges; the finding names the start and the admin role it reaches.
3. **Blast radius** (CIEM Identities table) — the number of resources with open high or critical findings that an identity can reach within a few hops of assumes and has-policy edges.
4. **[Attack Path](/docs/features/attack-path)** — identity edges join network and data edges, so a path can run from an internet-exposed workload through the identity it runs as to the data that identity can read.

## Reading an escalation chain

For an assume-role chain finding, read it left to right:

- **Start identity** — the identity that holds the first trust relationship.
- **Hops** — each role it can assume in turn. Service, wildcard and federated principals are not followed as hops; they are reported as trust findings instead.
- **End** — a role holding an admin policy or admin-equivalent actions.

To break the chain, remove the cheapest hop: usually the trust relationship on an intermediate role, or an unused \`sts:AssumeRole\` grant on the start identity.
`,
  },
  {
    slug: "ciem/right-sizing",
    title: "Right-sizing workflow",
    breadcrumb: "CIEM / Right-sizing",
    body: `
Right-sizing turns a CIEM finding into a smaller grant: pick who to review, see what they use, decide, change it, then check the next scan.

![From identity risk score to access review](/diagrams/ciem-review-flow.svg)

## 1. Find who to review

On AWS, every role and user gets a 0–100 risk score. The parts:

| Part | Points |
| --- | --- |
| Escalation paths | 10 per path, up to 30 |
| Recent escalation activity seen by CDR | 40 |
| Blast radius | 2 per reachable resource with an open high or critical finding, up to 20 |
| Permission gap | gap percentage ÷ 5, up to 20 |

Tiers: **critical** 80 and above, **high** 60 and above, **medium** 30 and above, otherwise **low**. Identities in the high tier or above open an access review automatically, with the highest-scoring first.

## 2. See what it uses (AWS)

The permission gap compares the actions an identity has been granted with the actions CloudTrail shows it calling in the recent activity window. The review row shows:

- **Least privilege** — the share of granted actions not called;
- **Granted** and **Used** — the counts behind it;
- **High-risk unused** — unused grants that matter most, such as \`iam:PassRole\`, \`iam:CreatePolicyVersion\`, \`iam:AttachRolePolicy\`, \`s3:DeleteBucket\`, \`s3:PutBucketPolicy\`, \`kms:ScheduleKeyDeletion\`, \`sts:AssumeRole\`.

Usage comes from CloudTrail events collected by Onam's threat detection. With no CloudTrail flowing, every grant looks unused — check that first.

## 3. Decide

In **CIEM → Access Reviews**, a reviewer with the \`review:decide\` permission marks each identity:

| State | Meaning |
| --- | --- |
| Pending | Waiting for a decision |
| Needs remediation | Something must change |
| Reviewed | Decision recorded, no change needed |
| Deferred | Postponed, and the postponement recorded |

Every change is written to an audit trail with the reviewer and time. Decisions expire after a set period and return to pending, and if a reviewed or deferred identity is flagged again it goes back to pending.

## 4. Change it

Onam does not edit your IAM. Remove the high-risk unused actions first — they cut the most risk per change — in your own console or infrastructure-as-code. Before removing anything, allow for jobs that run less often than the activity window, such as quarter-end batch jobs and disaster-recovery roles.

A suggested least-privilege policy is in development. Until it ships, build the replacement from the **Used** actions.

## 5. Check the next scan

On the next scan the gap, escalation and score are recomputed. A closed escalation path drops its points and the finding resolves; a reduced grant lowers the gap.

## Over the API

The access-review workflow is available on the platform API:

\`\`\`
GET  /api/v1/iam-security/access-review              # list reviews (filter by status)
POST /api/v1/iam-security/access-review/{identity}    # record a decision: reviewed | needs_remediation | deferred
\`\`\`

The decision endpoint requires the \`review:decide\` permission. See the [API reference](/docs/reference/api) for authentication.
`,
  },
  {
    slug: "ciem/per-cloud",
    title: "CIEM per-cloud notes",
    breadcrumb: "CIEM / Per-cloud notes",
    body: `
What CIEM does on each cloud today. AWS has the deepest coverage; the other clouds are honest subsets, and this page is where we say which.

## AWS

- **Identities:** IAM users, roles, groups, instance profiles, managed and inline policies, trust policies.
- **Effective access:** full chain — group expansion, condition classes, explicit-deny netting, SCP deny checks. See [effective permissions](/docs/ciem/effective-permissions) for what is not modelled yet.
- **Escalation:** PassRole, multi-hop assume-role chains, boundary bypass, service-linked role creation; shadow admins (four patterns); CDR confirmation.
- **Trust:** foreign accounts, wildcard principals, missing ExternalId, SAML and OIDC federation — including GitHub, GitLab, GCP and Azure issuers.
- **Non-human identities:** roles classified as service-linked, AWS service, execution (Lambda, ECS and similar), CI/CD over OIDC, EKS service account (IRSA), cross-account, user-assumable or wildcard.
- **Usage:** CloudTrail-based permission gap and stale roles.
- **Scoring and reviews:** risk score, blast radius and access reviews.
- **Needs:** CloudTrail flowing into Onam's threat detection for the usage-based findings; read access to AWS Organizations for SCP checks.

## Azure

- **Identities:** role definitions and assignments, Entra service principals, managed identities (user- and system-assigned).
- **Effective access:** assignments joined to role definitions, scope classified, ABAC conditions evaluated. Entra group membership is not expanded.
- **Escalation:** RBAC Owner, PIM activation, service principal owner rights.
- **Trust and scope:** cross-tenant access without conditional access; service principals and managed identities with Owner, Contributor or User Access Administrator at broad scope; guests with privileged roles.
- **Graph:** VM → managed identity links.

## Google Cloud

- **Identities:** IAM bindings, service accounts, workload identity pools.
- **Effective access:** bindings on projects, service accounts, buckets, BigQuery datasets and Pub/Sub topics, mapped onto the shared access levels.
- **Escalation:** service-account key creation, primitive (owner/editor) roles, broad workload identity.
- **Findings:** service accounts with Owner, keys past rotation age, public principals in bindings, workload identity pools without an attribute condition, service-account chaining.
- **Graph:** compute instance → service account links.

## Kubernetes

- **Identities:** service accounts, Roles and ClusterRoles, RoleBindings and ClusterRoleBindings, pods.
- **Effective access:** bindings resolved to service accounts and their rules.
- **Escalation:** cluster-admin bindings, Role and ClusterRole write, pods/exec and pods/attach, cluster-wide secrets read, node access, cross-namespace escalation.
- **Graph:** pod → service account links; workload-identity annotations to the cloud identity.

## OCI

- **Identities:** users, groups, policies, dynamic groups, API keys, auth tokens, customer secret keys.
- **Escalation:** policy, group or user management; tenancy admin; secret access; broad dynamic-group matching rules; instance principals.
- **Hygiene:** MFA, key and token rotation, Administrators group membership, inactive users with credentials.

## Alibaba Cloud

- **Identities:** RAM users, roles, groups, policies, access keys.
- **Findings:** wildcard or admin policies, RAM roles with wildcard trust or assumable without MFA, broad OSS and KMS grants, access-key rotation, console MFA.

## IBM Cloud

- **Identities:** API keys, service IDs, trusted profiles, access groups, policies.
- **Escalation:** IAM identity admin, access-group management, API-key creation for service IDs, secrets access.
- **Trust:** trusted profiles that trust another account.
- **Hygiene:** account MFA enforcement, API-key rotation.

## Not yet on these clouds

Unused-permission analysis, shadow-admin detection, the risk score and automatic access reviews run on AWS identities today. Multi-hop assume-role chains are AWS-only.
`,
  },
];
