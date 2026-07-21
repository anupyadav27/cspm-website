# CSPM Platform Documentation

Welcome to the documentation for the Cloud Security Posture Management (CSPM) platform — a unified multi-cloud security platform that continuously monitors, detects, and remediates security risks across your cloud environments.

## How It Works

The platform continuously discovers resources across your cloud environments, evaluates them against 10,000+ security rules across 16+ engines, and delivers prioritized findings across identity, data, network, container, and compliance domains — all without any agents.

<img src="/diagrams/p-cspm.svg" style="width:auto;max-width:100%;display:block;margin-left:auto;margin-right:auto;border-radius:10px;margin-top:16px;margin-bottom:16px;" alt="CSPM platform — 5-step flow from connecting cloud accounts to posture score" />

## Documentation Sections

The documentation is organized into sections covering platform architecture, compliance, onboarding, security capabilities, and reference material. Start with the architecture overview to understand how the platform works end-to-end, then dive into the section most relevant to your role.

| Section | Description |
|---|---|
| [Architecture Overview](architecture/overview/) | How the platform works — data flow, engines, security model |
| [Compliance Framework Coverage](compliance/framework-coverage/) | Supported frameworks, rule counts, scoring methodology |
| [Release Notes](release-notes/2026-05/) | Monthly changelog — what's new, what changed |

## Quick Links

Jump directly to the most frequently accessed pages. The onboarding guides walk you through connecting your first cloud account in under 5 minutes. The API reference and integration catalog are useful once your accounts are connected and you want to automate or route findings.

- [Connect Your Cloud](onboarding/aws/) — AWS, Azure, GCP, OCI, AliCloud, IBM
- [API Reference](reference/api-reference/) — REST API for all engines
- [Integration Catalog](reference/integration-catalog/) — Jira, Splunk, Slack, and more
- [RBAC & SSO](reference/rbac-and-sso/) — Roles, permissions, SAML 2.0
- [Trust Center](trust/trust-center/) — SOC 2, ISO 27001, pentest report

## Supported Cloud Providers

The platform connects to seven cloud providers using read-only credentials — no agents, no software to install. Each provider is onboarded via IAM role or service account, and scanning begins automatically once the connection is established.

| Provider | Resources Discovered | Security Rules |
|---|---|---|
| Amazon Web Services (AWS) | 40+ services | 800+ rules |
| Microsoft Azure | 30+ services | 400+ rules |
| Google Cloud Platform (GCP) | 30+ services | 300+ rules |
| Oracle Cloud Infrastructure (OCI) | 20+ services | 200+ rules |
| Alibaba Cloud (AliCloud) | 20+ services | 150+ rules |
| IBM Cloud | 15+ services | 70+ rules |
| Kubernetes | Clusters, workloads, RBAC | 100+ rules |

## Security Capabilities

The platform ships ten security engines that run in parallel across all connected cloud accounts. Each engine is independently deployable and contributes findings to a unified posture score. You do not need to enable capabilities individually — all engines are active by default once a cloud account is connected.

| Capability | Description |
|---|---|
| **CSPM** | Cloud Security Posture Management — configuration compliance across 1,918 CSPM rules |
| **CIEM** | Cloud Identity & Entitlement Management — overprivileged identities, unused permissions |
| **DSPM** | Data Security Posture Management — sensitive data discovery, encryption compliance |
| **Network Security** | 7-layer topology analysis — exposure, reachability, WAF, flow logs |
| **Container Security** | EKS/ECS/K8s posture, workload security, image scanning |
| **Vulnerability** | Agentless CVE scanning, SBOM generation, EPSS scoring |
| **AI Security** | SageMaker, Bedrock, Vertex AI posture and risk |
| **Threat Detection** | MITRE ATT&CK mapping, attack path analysis, blast radius scoring |
| **SecOps** | SAST, DAST, SCA, IaC scanning across 14 languages |
| **Compliance** | 13+ frameworks — CIS, NIST, ISO 27001, PCI-DSS, HIPAA, GDPR, SOC 2 |

---

*Platform version: see [Release Notes](release-notes/2026-05/)*
*For support: support@onam.io*
