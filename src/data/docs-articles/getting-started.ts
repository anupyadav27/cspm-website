import type { DocArticle } from "./types";

export const articles: DocArticle[] = [
  {
    slug: "getting-started/introduction",
    title: "Introduction to Onam",
    breadcrumb: "Platform / Introduction",
    body: `

Onam is one cloud platform with four products — **Onam Estate**, **Onam Security**, **Onam FinOps** and **Onam DRM** — and **Onam AIOps**, AI agents that work across them (early access). You connect each cloud account once, and every product you are entitled to works from that connection — in the same console, behind the same login.

This page explains what each product answers, how they share one connection, and how the documentation is organised.

## Four products, one platform

| Product | The question it answers | Start here |
| --- | --- | --- |
| **Onam Estate** | What do we actually run, and how is it wired together? | [Estate overview](/docs/estate/overview) |
| **Onam Security** | Is my cloud secure, and what do I fix first? | [Security overview](/docs/security/overview) |
| **Onam FinOps** | Where is the money going, and who owns it? | [FinOps overview](/docs/finops/overview) |
| **Onam DRM** | If a region fails tonight, what comes back, in what order, and how fast? | [DRM overview](/docs/drm/overview) |
| **Onam AIOps** *(early access)* | Can AI agents do the investigation — and leave every change to a person? | [AIOps overview](/docs/operations/overview) |

They follow the life of a cloud estate: **discover** what exists (Estate), **secure** it (Security), **optimise** what it costs (FinOps), and make sure it can **recover** (DRM).

- **Onam Estate** is the estate of record: every resource across your connected accounts, the relationships between them, and a discovery pipeline that keeps the picture current.
- **Onam Security** evaluates that inventory for misconfiguration, identity, data, network, workload and runtime risk, and correlates the results on one security graph — see the [Security overview](/docs/security/overview).
- **Onam FinOps** is cost and commitment management on reconciled billing data: what you spent, who owns it, what you will spend, and what you can stop spending.
- **Onam DRM** maps applications and their dependencies, reads the backup and replication your cloud configuration has, predicts recovery time and data loss against your targets, and flags drift from the recovery model you approved. It plans and records; it does not run a failover.
- **Onam AIOps** puts AI agents on the platform's data. They investigate with evidence and propose; a person approves. It is in [early access](/docs/operations/availability) — the Asset and Security agents first, others in development or on the roadmap.

## Connect once

Every product works from **one connection per cloud account**. Onboarding uses a read-only role (AWS), service principal (Azure) or service account (Google Cloud and others) — nothing is installed on your workloads and nothing is written to your environment. The [connection guides](/docs/onboarding/aws) cover seven targets: AWS, Azure, Google Cloud, Oracle Cloud, Alibaba Cloud, IBM Cloud and Kubernetes.

Estate, Security and DRM work from one discovery pass over those accounts, so an organisation entitled to more than one does not connect its accounts twice and does not get two inventories that disagree. FinOps reads your billing data and never writes to your accounts.

## Entitlement: each product is granted on its own

Onam Security is sold in plan tiers. Onam Estate, Onam FinOps and Onam DRM are **separate products**, each granted per organisation — upgrading a security plan does not turn them on. A product your organisation has not been granted is hidden from the console, and the API enforces the same grant on every request. Each product's *Access & entitlement* page explains its own permissions:

- [Estate access](/docs/estate/access) · [FinOps access](/docs/finops/access) · [DRM access](/docs/drm/access) · [AIOps availability](/docs/operations/availability)

## How the documentation is organised

| Group | What you'll find | Start with |
| --- | --- | --- |
| Platform | This introduction, a quickstart, core concepts, and connection guides for every cloud | [Quickstart](/docs/getting-started/quickstart) |
| Onam Estate | Inventory, architecture view, discovery pipeline, access | [Estate overview](/docs/estate/overview) |
| Onam Security | Features, data security (DSPM), code security, identity (CIEM), compliance, security architecture | [Security overview](/docs/security/overview) |
| Onam FinOps | The cost model, explore, ownership, plan, savings, runs | [FinOps overview](/docs/finops/overview) |
| Onam DRM | Applications, protection, recovery plans, RTO/RPO and drills, baselines and drift | [DRM overview](/docs/drm/overview) |
| Onam AIOps | Agents, workspace, orchestrator, approvals and AI safety — with each capability's status | [AIOps overview](/docs/operations/overview) |
| Trust & reference | How Onam secures your data, the REST API, finding schema, integrations, RBAC and SSO, release notes | [Trust Center](/docs/trust/security) |

## Next steps

- [Quickstart](/docs/getting-started/quickstart) — connect a cloud and see your first results.
- [Core Concepts](/docs/getting-started/core-concepts) — assets, findings, engines and the glossary.
- [Connect AWS](/docs/onboarding/aws) — or pick your cloud from the sidebar.
- [Book a demo](/request-demo) — see the platform on your own cloud with an engineer.
`,
  },
  {
    slug: "getting-started/quickstart",
    title: "Quickstart",
    breadcrumb: "Getting Started / Quickstart",
    body: `
This guide takes you from nothing to your first triaged Critical finding: create an account, connect a cloud with a read-only role, run the first scan, read the dashboard, triage what it finds, and wire findings into the tool your team already watches.

Most of the steps are clicks. The longest wait is the first scan itself — and it streams findings as it runs, so you will usually be reading results before it finishes. How long it takes depends on how many accounts, regions and resources you connect.

## Before you begin

- An Onam account invitation or sign-up link (your admin, or [Book a demo](/request-demo) to get one).
- Credentials for the cloud you're connecting — for AWS, permission to create a CloudFormation stack and an IAM role in the target account.
- No agents to install for posture scanning, no network changes, no maintenance window.

## Step 1: Create your account

1. Open the Onam console and sign up with your work email, or accept your organization's invite.
2. Verify your email and set a password — or use SSO if your organization has [SAML configured](/docs/reference/rbac-and-sso).
3. On first login you land on the onboarding screen with zero connected accounts.

## Step 2: Connect your first cloud

Each provider has a dedicated guide: [AWS](/docs/onboarding/aws), [Azure](/docs/onboarding/azure), [Google Cloud](/docs/onboarding/gcp), [OCI](/docs/onboarding/oci), [Alibaba Cloud](/docs/onboarding/alicloud), [IBM Cloud](/docs/onboarding/ibm), and [Kubernetes](/docs/onboarding/kubernetes). All of them follow the same pattern: create a read-only credential in your environment, hand Onam the reference, never share a long-lived admin key.

![The onboarding flow in the Onam console (demo account)](/screenshots/screenshot-onboarding.png)

Here is the AWS flow end to end — it is the most common first connection:

1. In the console, go to **Onboarding**, choose **Add cloud account**, and select **AWS**.
2. Onam generates a CloudFormation quick-create link pre-filled with a unique **ExternalId** for your tenant.
3. Launch the stack in your AWS account. It creates one read-only IAM role whose trust policy only allows Onam's account to assume it — and only when the ExternalId matches.
4. Paste the created role ARN back into the console.
5. Onam validates the connection with a \`sts:AssumeRole\` call and stores the role reference in AWS Secrets Manager, encrypted with KMS. No keys ever leave your account.

![AWS onboarding — CloudFormation stack creates a read-only role with ExternalId; Onam assumes it cross-account](/diagrams/onboard-aws.svg)

> The ExternalId is what prevents the confused-deputy attack — a third party can't trick Onam into assuming your role on their behalf. Don't edit it out of the template, and don't reuse a role created for another vendor. An access-key option exists for AWS, but the role is strongly recommended: it's revocable in one click and grants nothing writable.

## Step 3: Run the first scan

The first scan starts automatically once validation passes (you can also trigger one from **Scans**). Under the hood it runs as an ordered pipeline:

1. **Credential validation** — the role is assumed and its permissions confirmed.
2. **Discovery and Inventory (DI)** — multi-phase enumeration of every resource in the account, written to \`asset_inventory\` with cross-resource links in \`asset_relationships\`.
3. **Rule evaluation** — the posture engine evaluates the inventory against 9,853 posture rules, producing PASS, FAIL or ERROR per resource per rule.
4. **Engine fan-out** — the domain engines (CIEM, data security, network, container, vulnerability, and the rest) run in parallel against the same inventory.
5. **Attack path build** — assets, relationships, and findings are loaded into the security graph and traversed from entry points to crown jewels.
6. **Compliance and risk** — findings map onto 78 framework control catalogs, then risk quantification gives Critical and High findings a FAIR-style loss estimate in dollars.

Watch progress on the **Scans** page. Findings appear as each stage completes — you don't have to wait for the pipeline to finish.

## Step 4: Read the dashboard

When findings start landing, open **Dashboard**. Four things are worth reading in order:

1. **Posture score** — a 0–100 rollup of your posture. Expect it to look worse than you'd like on day one; everyone's does.
2. **Findings by severity** — counts of Critical, High, Medium, Low, and Info. Only the first two columns should drive today's work.
3. **Top risks and attack paths** — the graph-ranked issues, which are usually a much shorter list than the raw finding count.
4. **Compliance summary** — your starting score per enabled framework.

## Step 5: Triage your first Critical findings

1. Open **Findings** and filter to severity **Critical**.
2. Sort or group by rule — ten findings from one rule (say, unencrypted EBS volumes) are one decision, not ten.
3. Open a finding. The detail view shows the affected resource, the failed rule, the frameworks it violates, the rule's remediation guidance, and an AI fix prompt you can paste into an assistant to draft the CLI command, Terraform change or console steps.
4. Check **Attack Paths** before fixing in ID order: a Medium finding that sits on a path to a crown jewel usually outranks an isolated Critical. Choke points tell you which single fix blocks the most paths.
5. Fix what's real, and use **Suppressions** (with a reason and optional expiry) for accepted risks.

## Step 6: Set up an integration

Findings your team never sees don't get fixed. From **Notifications** and the [Integration Catalog](/docs/reference/integration-catalog):

1. Connect Slack or email and route new Critical findings to your security channel.
2. Connect Jira to create tickets from findings — assignments and status sync back to the console.
3. If you have a SIEM, forward findings via the [REST API](/docs/reference/api) or a webhook.

> Start with one noise-proof route — Critical findings only, one channel. Widen the funnel after the first cleanup week, not before, or the channel gets muted by Friday.

## Next steps

- [Core Concepts](/docs/getting-started/core-concepts) — the mental model behind everything you just clicked through.
- [Connect your remaining accounts](/docs/onboarding/aws) — coverage gaps are where incidents live; connect all accounts, not just production.
- [Attack Path](/docs/features/attack-path) — how path-based prioritization actually works.
- [Framework Coverage](/docs/compliance/frameworks) — enable the frameworks your auditors care about.
`,
  },
  {
    slug: "getting-started/core-concepts",
    title: "Core Concepts",
    breadcrumb: "Getting Started / Core Concepts",
    body: `
Every screen in the Onam console is built from a small set of ideas: assets connected in a graph, findings raised by engines, scans that refresh both, and three layers of interpretation on top — attack paths, compliance mappings, and dollar-denominated risk. This page gives you that mental model once, so the rest of the docs read as detail rather than mystery.

It ends with a glossary of the terms used everywhere else.

## Assets and the security graph

An **asset** is any resource Onam discovers: an EC2 instance, an IAM role, a storage bucket, a Kubernetes deployment, a self-hosted database. Discovery and Inventory (DI) enumerates assets in multi-phase passes and writes two tables that everything else builds on: \`asset_inventory\` (the resources) and \`asset_relationships\` (how they connect — this role can assume that role, this instance sits in that subnet, this bucket is readable by that principal).

Those relationships are what make Onam a **security graph** rather than a resource list. Findings attach to nodes; attack paths are walks across the edges; blast radius is the neighborhood you can reach from a node.

![The Onam architecture — clouds in, DI and engines in the middle, graph and findings out](/diagrams/arch-overview.svg)

## Findings and severities

A **finding** is one rule failing on one resource: rule, resource, severity, evidence, violated frameworks, and remediation steps, in a consistent shape across all engines (see the [Finding Schema](/docs/reference/finding-schema)). Findings carry one of five severities:

| Severity | Meaning | Expected response |
| --- | --- | --- |
| Critical | Directly exploitable or exposing sensitive data now | Fix within 24–48 hours |
| High | Serious weakness, typically one step from exploitable | Fix within the week |
| Medium | Defense-in-depth gap or policy violation | Schedule into normal work |
| Low | Hardening opportunity | Batch with related changes |
| Info | Observation, no action required | Awareness only |

![The findings queue in the Onam console (demo account)](/screenshots/screenshot-findings.png)

> Severity is a property of the rule; **priority** is a property of the graph. A Medium finding on an attack path to a crown jewel routinely outranks an isolated Critical. Triage from the Attack Paths and Risk views, not from raw severity counts.

Findings you accept as business risk can be **suppressed** with a justification and optional expiry — they leave the active queue but remain visible and recorded in the compliance evidence trail.

## Engines

The platform runs 29 engines; each is a service responsible for one security domain, and each writes findings to the same data model. The ones you will interact with directly:

| Engine | What it evaluates |
| --- | --- |
| Check (CSPM core) | The 9,853 posture rules against every discovered resource — [CSPM](/docs/features/cspm) |
| IAM / CIEM | Effective permissions, unused access, privilege-escalation chains — [CIEM](/docs/features/ciem) |
| Attack Path v2 | Graph traversal from entry points to crown jewels — [Attack Path](/docs/features/attack-path) |
| CDR / Behavioral Analysis | Audit-log threat detection across all 7 providers — [CDR](/docs/features/cdr) |
| Data Security (DSPM) | Data store discovery and PII, PCI, PHI classification — [Data Security](/docs/features/data-security) |
| Vulnerability | CVEs prioritized by EPSS, CISA KEV, and exposure — [Vulnerability Management](/docs/features/vulnerability-management) |
| Network Security | 7-layer network posture and effective exposure — [Network Security](/docs/features/network-security) |
| Container Security | EKS, ECS, AKS, GKE posture, images, and K8s RBAC — [Container Security](/docs/features/container-security) |
| Compliance | Mapping findings onto 78 framework control catalogs — [Compliance](/docs/features/compliance) |
| Risk Quantification | FAIR-based dollar exposure — [Risk Quantification](/docs/features/risk-quantification) |
| Code Security | SAST, secret detection, IaC checks, SCA with CycloneDX SBOM, and DAST — [Code Security](/docs/code-security/overview) |
| Technology Engine | 34 self-hosted technologies in 9 categories |

Encryption, database security, AI security, API security, agentless workload scanning, and the platform services (rule builder, remediation, the AI assistant) round out the full list in the [Architecture Overview](/docs/architecture/overview).

## Scan cycles

- A **full scan** re-runs the whole pipeline: DI enumeration, rule evaluation, engine fan-out, graph rebuild, compliance and risk. Your first scan is always full, and scheduled scans (daily is typical) keep the baseline fresh.
- An **incremental scan** re-evaluates what changed since the last run rather than re-enumerating everything, so new misconfigurations surface quickly between full scans.
- **Ad-hoc scans** can be triggered any time from the Scans page or the [API](/docs/reference/api) — useful right after a remediation sprint to confirm findings closed.
- **CDR is continuous**, not cyclical: it ingests audit and activity logs from all seven providers as they arrive, with three detection tiers — single-event rules, multi-event correlation scenarios, and statistical behavior baselines.

Every finding records the **scan run** that produced it, so you can always answer "as of when?"

## Attack paths, choke points, and crown jewels

An **attack path** is a verified chain of steps from an **entry point** (an internet-reachable or externally exposed asset) to a **crown jewel** (a high-value asset — production data stores, admin identities, KMS keys — classified by catalog rules you can tune). Attack Path v2 derives edges from about 25 catalog-driven sources (IAM policy analysis, network exposure, security-group matches, KMS grants, CDR behavior, public exposure) and verifies each edge across five security domains before marking it CONFIRMED. Each hop is annotated with MITRE ATT&CK techniques, and capability accumulates along the path — what the attacker can do grows hop by hop.

A **choke point** is a node that many paths pass through. The console ranks the top 5 — fixing one choke point severs every path through it, which is why choke points are usually the highest-leverage work on the board.

## Compliance mapping

Rules are mapped to the controls they evidence across **78 frameworks** — CIS Benchmarks, NIST 800-53, PCI DSS, HIPAA, ISO 27001:2022, SOC 2, GDPR, FedRAMP, and more. One finding can count against controls in several frameworks; fixing it moves all of those scores at once. Per-framework reports show control-by-control pass rates with the underlying findings as evidence. Details in [Framework Coverage](/docs/compliance/frameworks).

## Risk in dollars: FAIR

The Risk Quantification engine implements the **FAIR** (Factor Analysis of Information Risk) model, running as the final layer after all other engines. It takes Critical and High findings and computes: Risk = Loss Event Frequency × Loss Magnitude, where frequency comes from threat event frequency and vulnerability, and magnitude combines primary and secondary loss.

Every input is visible: default per-record costs by industry (healthcare $10.93, finance $6.08, technology $4.88, retail $3.28, default $4.45) that you can replace with your own figures, regulatory multipliers where the highest applicable one applies (GDPR ×1.5, SOX ×1.4, HIPAA ×1.3, PCI-DSS ×1.2), and data-sensitivity multipliers (restricted ×3.0 down to public ×0.1) that your tenant can override. The output — risk reports, summaries, and trends — is what turns "1,400 findings" into "an estimated $2.3M of exposure, concentrated in these five issues."

## Glossary

| Term | Definition |
| --- | --- |
| Asset | Any discovered resource — instance, role, bucket, cluster, database |
| Asset relationship | A typed edge between assets: assumes, contains, can-read, exposes |
| Security graph | Assets plus relationships plus findings, stored as a traversable graph |
| Finding | One rule failing on one resource, with evidence and remediation |
| Rule | A single check (9,853 posture rules), mapped to framework controls |
| Engine | A service that evaluates one security domain and emits findings |
| Scan run | One execution of the pipeline; every finding references its run |
| Severity | Rule-assigned impact level: Critical, High, Medium, Low, Info |
| Attack path | A verified, CONFIRMED chain from an entry point to a crown jewel |
| Entry point | An asset reachable from outside — the start of a path |
| Crown jewel | A catalog-classified high-value asset — the end of a path |
| Choke point | A node many attack paths share; one fix severs all of them |
| Blast radius | Everything reachable from a given asset if it is compromised |
| Suppression | A justified, optionally expiring acceptance of a finding |
| FAIR | The risk model behind Onam's dollar loss estimate per finding — low, likely and high |

## Next steps

- [Quickstart](/docs/getting-started/quickstart) — put the model into practice on your first account.
- [Architecture Overview](/docs/architecture/overview) — the 29 engines and the pipeline in full detail.
- [Attack Path](/docs/features/attack-path) — derivation, verification, and choke-point ranking in depth.
- [Risk Quantification](/docs/features/risk-quantification) — the full FAIR methodology and tenant overrides.
`,
  },
];
