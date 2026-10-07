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
];
