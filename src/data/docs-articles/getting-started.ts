import type { DocArticle } from "./types";

export const articles: DocArticle[] = [
  {
    slug: "getting-started/introduction",
    title: "Introduction to Onam",
    breadcrumb: "Getting Started / Introduction",
    body: `
Onam is an **agentless cloud-native application protection platform (CNAPP)**. It connects to your cloud accounts with read-only credentials, builds a live inventory of every resource, evaluates that inventory against **10,000+ security rules**, and correlates posture, identity, data, network, workload, and runtime signals on **one security graph**. The result is a single prioritized queue of findings — with attack paths and dollar-denominated risk — instead of eight disconnected consoles.

This page explains what the platform does, which environments it covers, who it is built for, and how the rest of the documentation is organized.

![The Onam dashboard — posture score, severity counts, top risks, and compliance summary in one view (demo account)](/screenshots/screenshot-dashboard.png)

## What Onam does

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
4. Risk Quantification runs last, converting Critical and High findings into annualized loss expectancy in dollars.

![The Onam platform — 7 clouds in, one security graph, prioritized findings out](/diagrams/platform-overview.svg)

Because everything lands on one graph, a public S3 bucket, an over-privileged role that can read it, and the PII inside it surface as **one attack path** — not three unrelated alerts in three tools.

## Coverage: 7 clouds and 40 technologies

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

Beyond the clouds, the **Technology Engine** scans **40 self-hosted technologies in 10 categories** — databases, Linux and OS, network devices, web servers, virtualization, containers, DevOps tooling, collaboration platforms, data platforms, and middleware — so the PostgreSQL server in your datacenter is held to the same standard as the RDS instance next to it.

Findings map to **78 compliance frameworks**, including CIS Benchmarks, NIST CSF 2.0, NIST 800-53, PCI-DSS v4.0, HIPAA, ISO 27001, SOC 2, GDPR, NIS2, DORA, FedRAMP, and CMMC 2.0. See [Framework Coverage](/docs/compliance/frameworks) for the full list.

## Agentless by design

Onam connects through a **read-only IAM role (AWS), service principal (Azure), or service account (GCP and others)** — no agents on your workloads, no network changes, no write access. Credential references are stored in AWS Secrets Manager and encrypted with KMS; the platform never holds long-lived keys when a role-based option exists.

> The one optional exception: OS-level vulnerability scanning can use a lightweight host agent (\`onam-agent\`) on Linux, macOS, or Windows for package-level depth. The cloud connection itself is always agentless — the agent is opt-in and only for host vulnerability data.

## Who Onam is for

- **Security engineers** — one queue of deduplicated, graph-prioritized findings with concrete remediation, instead of alert triage across per-cloud native tools.
- **Compliance and GRC teams** — continuous scoring against 78 frameworks with per-control evidence, replacing quarterly spreadsheet audits.
- **CISOs and leadership** — a posture score, top risks, and FAIR-based dollar exposure that translate directly into board reporting.
- **DevOps and platform teams** — findings tied to the exact resource, region, and account, with CLI, Terraform, or console remediation steps.

## How the documentation is organized

| Section | What you'll find | Start with |
| --- | --- | --- |
| Getting Started | Orientation, a 15-minute setup walkthrough, and the platform's mental model | [Quickstart](/docs/getting-started/quickstart) |
| Onboarding | Step-by-step connection guides for each of the 7 clouds | [Connect AWS](/docs/onboarding/aws) |
| Features | Deep dives on every capability, engine by engine | [CSPM](/docs/features/cspm) |
| Architecture | How the 29 engines, scan pipeline, and data model fit together | [Architecture Overview](/docs/architecture/overview) |
| Compliance | Framework catalog and how control scoring works | [Framework Coverage](/docs/compliance/frameworks) |
| Trust | How Onam secures your data — retention, SLAs, incident response | [Trust Center](/docs/trust/security) |
| Reference | REST API, finding schema, integrations, RBAC and SSO | [API Reference](/docs/reference/api) |
| Release Notes | What shipped, by release | [Release Notes](/docs/release-notes) |

## Next steps

- [Quickstart](/docs/getting-started/quickstart) — go from zero to first findings in about 15 minutes.
- [Core Concepts](/docs/getting-started/core-concepts) — assets, findings, engines, attack paths, and the glossary.
- [Architecture Overview](/docs/architecture/overview) — how a scan actually flows through the platform.
- [Book a demo](/request-demo) — see the platform on your own cloud with an engineer.
`,
  },
  {
    slug: "getting-started/quickstart",
    title: "Quickstart",
    breadcrumb: "Getting Started / Quickstart",
    body: `
This guide takes you from nothing to your first triaged Critical finding in about 15 minutes: create an account, connect a cloud with a read-only role, run the first scan, read the dashboard, triage what it finds, and wire findings into the tool your team already watches.

Most of the steps are clicks. The longest wait is the first scan itself — and it streams findings as it runs, so you will usually be reading results before it finishes. A typical 40-service AWS account completes in around 15 minutes; very large accounts take longer.

## Before you begin

- An Onam account invitation or sign-up link (your admin, or [Book a demo](/request-demo) to get one).
- Credentials for the cloud you're connecting — for AWS, permission to create a CloudFormation stack and an IAM role in the target account.
- 15 minutes. No agents to install, no network changes, no maintenance window.

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
3. **Rule evaluation** — the Check engine evaluates the inventory against the 10,000+ rule registry, producing PASS or FAIL per resource per rule.
4. **Engine fan-out** — the domain engines (CIEM, data security, network, container, vulnerability, and the rest) run in parallel against the same inventory.
5. **Attack path build** — assets, relationships, and findings are loaded into the security graph and traversed from entry points to crown jewels.
6. **Compliance and risk** — findings map onto 78 framework control catalogs, then FAIR risk quantification converts Critical and High findings into dollar exposure.

Watch progress on the **Scans** page. Findings appear in real time as each stage completes — you don't have to wait for the pipeline to finish.

## Step 4: Read the dashboard

When findings start landing, open **Dashboard**. Four things are worth reading in order:

1. **Posture score** — a 0–100 rollup of your pass rate, weighted by severity. Expect it to look worse than you'd like on day one; everyone's does.
2. **Findings by severity** — counts of Critical, High, Medium, Low, and Info. Only the first two columns should drive today's work.
3. **Top risks and attack paths** — the graph-ranked issues, which are usually a much shorter list than the raw finding count.
4. **Compliance summary** — your starting score per enabled framework.

## Step 5: Triage your first Critical findings

1. Open **Findings** and filter to severity **Critical**.
2. Sort or group by rule — ten findings from one rule (say, unencrypted EBS volumes) are one decision, not ten.
3. Open a finding. The detail view shows the affected resource, the failed rule, the frameworks it violates, and step-by-step remediation — a CLI command, Terraform snippet, or console walkthrough.
4. Check **Attack Paths** before fixing in ID order: a Medium finding that sits on a path to a crown jewel usually outranks an isolated Critical. Choke points tell you which single fix severs the most paths.
5. Fix what's real, and use **Suppressions** (with a justification and optional expiry) for accepted risks — suppressed findings stay visible to the security team but leave the active queue.

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
| Check (CSPM core) | The 10,000+ rule registry against every discovered resource — [CSPM](/docs/features/cspm) |
| IAM / CIEM | Effective permissions, unused access, privilege-escalation chains — [CIEM](/docs/features/ciem) |
| Attack Path v2 | Graph traversal from entry points to crown jewels — [Attack Path](/docs/features/attack-path) |
| CDR / Behavioral Analysis | Audit-log threat detection across all 7 providers — [CDR](/docs/features/cdr) |
| Data Security (DSPM) | Data store discovery and PII, PCI, PHI classification — [Data Security](/docs/features/data-security) |
| Vulnerability | CVEs prioritized by EPSS, CISA KEV, and exposure — [Vulnerability Management](/docs/features/vulnerability-management) |
| Network Security | 7-layer network posture and effective exposure — [Network Security](/docs/features/network-security) |
| Container Security | EKS, ECS, AKS, GKE posture, images, and K8s RBAC — [Container Security](/docs/features/container-security) |
| Compliance | Mapping findings onto 78 framework control catalogs — [Compliance](/docs/features/compliance) |
| Risk Quantification | FAIR-based dollar exposure — [Risk Quantification](/docs/features/risk-quantification) |
| SecOps / AppSec | SAST in 7 languages, DAST, SCA and SBOM — [SecOps](/docs/features/secops) |
| Technology Engine | 40 self-hosted technologies in 10 categories |

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

Every rule is mapped to the controls it evidences across **78 frameworks** — CIS Benchmarks, NIST CSF 2.0 and 800-53, PCI-DSS v4.0, HIPAA, ISO 27001, SOC 2, GDPR, FedRAMP, and more. One finding can violate a dozen controls across several frameworks; fixing it moves all of those scores at once. Per-framework reports show control-by-control pass rates with the underlying findings as evidence. Details in [Framework Coverage](/docs/compliance/frameworks).

## Risk in dollars: FAIR

The Risk Quantification engine implements the **FAIR** (Factor Analysis of Information Risk) model, running as the final layer after all other engines. It takes Critical and High findings and computes: Risk = Loss Event Frequency × Loss Magnitude, where frequency comes from threat event frequency and vulnerability, and magnitude combines primary and secondary loss.

The numbers are grounded, not invented: per-record cost benchmarks from the IBM Cost of a Data Breach report (healthcare $10.93, finance $6.08, technology $4.88, retail $3.28, default $4.45), regulatory multipliers where the highest applicable one applies (GDPR ×1.5, SOX ×1.4, HIPAA ×1.3, PCI-DSS ×1.2), and data-sensitivity multipliers (restricted ×3.0 down to public ×0.1) that your tenant can override. The output — risk reports, summaries, and trends — is what turns "1,400 findings" into "an estimated $2.3M of exposure, concentrated in these five issues."

## Glossary

| Term | Definition |
| --- | --- |
| Asset | Any discovered resource — instance, role, bucket, cluster, database |
| Asset relationship | A typed edge between assets: assumes, contains, can-read, exposes |
| Security graph | Assets plus relationships plus findings, stored as a traversable graph |
| Finding | One rule failing on one resource, with evidence and remediation |
| Rule | A single check (10,000+ in the registry), mapped to framework controls |
| Engine | A service that evaluates one security domain and emits findings |
| Scan run | One execution of the pipeline; every finding references its run |
| Severity | Rule-assigned impact level: Critical, High, Medium, Low, Info |
| Attack path | A verified, CONFIRMED chain from an entry point to a crown jewel |
| Entry point | An asset reachable from outside — the start of a path |
| Crown jewel | A catalog-classified high-value asset — the end of a path |
| Choke point | A node many attack paths share; one fix severs all of them |
| Blast radius | Everything reachable from a given asset if it is compromised |
| Suppression | A justified, optionally expiring acceptance of a finding |
| FAIR | The risk model converting findings into annualized dollar exposure |

## Next steps

- [Quickstart](/docs/getting-started/quickstart) — put the model into practice on your first account.
- [Architecture Overview](/docs/architecture/overview) — the 29 engines and the pipeline in full detail.
- [Attack Path](/docs/features/attack-path) — derivation, verification, and choke-point ranking in depth.
- [Risk Quantification](/docs/features/risk-quantification) — the full FAIR methodology and tenant overrides.
`,
  },
];
