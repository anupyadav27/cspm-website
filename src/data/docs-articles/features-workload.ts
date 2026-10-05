import type { DocArticle } from "./types";

export const articles: DocArticle[] = [
  {
    slug: "features/network-security",
    title: "Network Security — 7-Layer Exposure Analysis",
    breadcrumb: "Features / Network Security",
    body: `
Onam analyzes your cloud network topology across **seven layers** — from VPC isolation at the top to flow-log monitoring at the bottom — to identify exposure paths, misconfigured firewall rules, and unprotected internet-facing resources. The output is a prioritized list of **effectively exposed** resources, not a static dump of open security-group ports: a port that is open in a security group but unreachable through the other layers is a low-priority finding, while a port reachable through every layer is a critical one.

This page explains the 7-layer model, how effective-exposure analysis works gate by gate, what each layer checks across all supported clouds, and which findings to fix first.

![7-layer network security analysis](/diagrams/network-security.svg)

![The network security view in the Onam console (demo account)](/screenshots/screenshot-network.png)

## The 7-Layer Analysis Model

Every modern cloud has 5–10 overlapping network controls — VPC peering, transit gateways, route tables, NACLs, security groups, load balancers, WAFs, flow logs. A single layer in isolation tells you almost nothing about real risk, so the Network Security engine evaluates all seven layers top-to-bottom on every scan. Each layer asks a different question; together they answer the only question that matters: **can the internet actually reach this resource, and if so, with what protection?**

| Layer | Name | Question it answers |
| --- | --- | --- |
| L1 | Network Isolation | Are environments (prod, dev, shared services) properly segmented at the VPC and account level? |
| L2 | Network Reachability | What can reach what — across route tables, NAT, and public/private subnet markings? |
| L3 | Network ACLs | Do subnet-level stateless rules permit or block the traffic? |
| L4 | Security Groups | Do instance-level stateful rules permit traffic on the requested port? |
| L5 | Load Balancer Security | If an LB sits in front, does it terminate TLS correctly and only on accepted versions? |
| L6 | WAF Protection | Is application-layer filtering attached to internet-facing resources? |
| L7 | Network Monitoring | Is there log visibility into the traffic that did pass through? |

Why seven and not three? Older CSPM tools only check L4 (security groups). That misses the most common misconfiguration patterns — over-broad transit gateways (L1), orphaned route tables (L2), default NACLs (L3), TLS 1.0 still accepted on a public ALB (L5), missing WAF on a CloudFront distribution (L6), and disabled VPC Flow Logs (L7). The network checks are part of Onam's 10,000+ rule registry and are framework-mapped to CIS, NIST, PCI-DSS, and SOC 2.

## Effective Exposure

Onam's signature network capability is **effective-exposure analysis**. Instead of treating "port open in security group" as a finding, the engine traces the full path the internet would have to take to reach the resource — and only flags the resource as exposed if **every gate on the path permits the traffic**.

![Effective exposure — all gates between the internet and your resource must permit traffic for the resource to be effectively exposed](/diagrams/feat-network-effective-exposure.svg)

Reading the chain left to right:

1. **Internet** — the source of every untrusted attacker; the starting state of the analysis.
2. **Gate 1 — Internet Gateway** — does the VPC even have an IGW attached? No IGW, no path. (For Azure this is a public IP / Front Door check; for GCP an external IP / Cloud NAT check.)
3. **Gate 2 — Route Table** — is there a route to \`0.0.0.0/0\` pointing at the IGW from the relevant subnet? Without it, traffic cannot enter via the IGW.
4. **Gate 3 — Subnet Type** — is the subnet public (associated with a route table that has the IGW route)? Resources in private subnets are not directly reachable even if their security group allows it.
5. **Gate 4 — Network ACL** — does the subnet's NACL permit inbound on the requested port? NACLs are stateless and apply at the subnet boundary.
6. **Gate 5 — Security Group** — does the instance's SG inbound rule permit traffic from \`0.0.0.0/0\` on the port? This is what most tools check; Onam checks it last.

If all gates permit the path, the resource is **effectively exposed** and the finding is Critical. If any gate blocks the path, the finding is recorded at low priority — the policy text is still suboptimal, but the actual risk is contained.

> A typical large AWS account has hundreds of security groups with \`0.0.0.0/0\` rules — most sit on instances in private subnets with no IGW path. Old tools alert on all of them. Effective-exposure analysis ranks only the truly reachable ones as Critical, which is why alert volume drops sharply in the first scan.

Each effectively-exposed finding shows the full path with the specific permit at each gate, so you see exactly what to change to break the chain — and you spend remediation time on the small fraction of open-port rules that attackers can actually use.

![Network security platform view — 7-layer topology analysis, exposure paths, and firewall findings](/diagrams/p-network.svg)

## Layer-by-Layer Coverage

Every scan evaluates all seven layers for every cloud account in scope.

### Layer 1 — Network Isolation

Most lateral-movement attack paths trace back to a Layer 1 gap.

| Check | What Onam evaluates |
| --- | --- |
| VPC / VCN peer connectivity | Are production and dev VPCs peered without restrictive routing? |
| Transit Gateway routes | Does the TGW route table allow unrestricted cross-account traffic? |
| VPC sharing | Are shared VPCs granting broader access than the consumer needs? |
| Default VPC usage | Is the default VPC (no security controls by default) in use for production resources? |
| PrivateLink vs public endpoints | Are cloud services accessed via PrivateLink or via the public service endpoint? |

### Layer 2 — Network Reachability

L2 is where "I thought this was private" findings live.

| Check | What Onam evaluates |
| --- | --- |
| Public subnet identification | Subnets with both an IGW route AND public-IP allocation = effective internet exposure |
| NAT Gateway placement | Is NAT outbound-only (correct) or also providing inbound paths (misconfigured)? |
| Route table anomalies | Routes to unexpected destinations — \`0.0.0.0/0\` in subnets you intended to be private |
| VPC Endpoints | Are S3 / DynamoDB accessed via VPC Endpoints (private) or via the public service endpoint? |

### Layer 3 — Network ACLs

NACLs and security groups don't always agree — when they conflict, the NACL wins for matching traffic.

| Check | What Onam evaluates |
| --- | --- |
| Inbound rules allowing all traffic | \`0.0.0.0/0\` allow on any port in NACL inbound rules |
| Outbound unrestricted | Outbound \`0.0.0.0/0\` allows data exfiltration even if inbound is blocked |
| Default NACL in use | Default NACLs allow all traffic — production should use custom NACLs with explicit rules |
| Conflicting NACL / SG rules | Stateless NACLs and stateful SGs misaligned cause both false-positive and false-negative findings if treated separately |

### Layer 4 — Security Groups

The most-cited layer in cloud-breach post-mortems. Findings split into two severity bands.

![Security group findings — Critical (open to 0.0.0.0/0) and High (overly broad rules)](/diagrams/feat-network-sg-findings.svg)

Critical findings — inbound open to \`0.0.0.0/0\`:

| Finding | Why it's Critical | Recommended fix |
| --- | --- | --- |
| SSH — port 22 | Direct shell access to Linux instances; brute-force target | Use AWS Session Manager / GCP IAP / Azure Bastion, or a bastion host with VPN-only ingress |
| RDP — port 3389 | Windows remote desktop; BlueKeep and ransomware target | Restrict to VPN CIDRs only or use a jump host |
| Database ports (3306 MySQL · 5432 Postgres · 1433 MSSQL · 27017 Mongo) | Direct data-exfiltration path | Databases should never be internet-reachable — private subnets + VPC Endpoint patterns |
| Cache / KV stores (6379 Redis · 11211 Memcached) | Default no-auth; session theft and RCE risk | Restrict to application security groups only |
| Kubernetes (6443 API · 10250 kubelet) | Cluster takeover | Use private clusters or authorized-networks lists |

High findings — overly broad or orphaned rules:

| Finding | Why it's a problem | Recommended fix |
| --- | --- | --- |
| Admin / management ports (8080 · 8443 · 9090 open to large CIDR) | Often dashboard or metric endpoints with weak auth | Restrict to specific source IPs / SGs |
| All TCP / UDP allowed inbound | Equivalent to "no firewall" for that source CIDR | Specify ports explicitly; remove the catch-all rule |
| Orphaned security group | Rules but no attached resources — risk of future accidental attachment with stale rules | Delete or document the intended purpose |

### Layer 5 — Load Balancer Security

| Check | What Onam evaluates |
| --- | --- |
| HTTP listener on internet-facing LB | Missing HTTPS redirect — plaintext on a public endpoint |
| TLS version | TLS 1.0 / 1.1 still accepted — only TLS 1.2+ should be allowed, TLS 1.3 preferred |
| SSL policy | Outdated policies with weak cipher suites (RC4, 3DES) |
| Access logging disabled | No request-level audit trail |
| Health check over HTTP | Plaintext health checks on an HTTPS application leak app structure |

### Layer 6 — WAF Protection

Network firewalls block by IP and port; WAFs block by request content (SQL injection, XSS, OWASP Top 10).

| Check | What Onam evaluates |
| --- | --- |
| Internet-facing ALB without WAF | Application Load Balancer with no WAF attached |
| CloudFront without WAF | CDN distribution serving app traffic without WAF |
| API Gateway without WAF | REST / HTTP API exposed without WAF |
| WAF rule sets | OWASP Core Rule Set missing, rate limiting missing |
| WAF in COUNT mode | WAF deployed in detection-only mode, not blocking |

### Layer 7 — Network Monitoring

Without flow logs you can't investigate a breach after the fact.

| Check | What Onam evaluates |
| --- | --- |
| VPC Flow Logs disabled | No traffic visibility for the VPC — investigation impossible |
| Flow logs not centralized | Logs stuck in CloudWatch instead of shipped to SIEM / S3 / data lake |
| DNS query logging disabled | Resolver query logging off — DNS-based exfiltration invisible |
| WAF logging disabled | Blocking decisions not logged — rules can't be tuned |
| Network Firewall logging | AWS Network Firewall log settings missing or partial |

## Supported Cloud Providers

The 7-layer model applies across every supported cloud, with CSP-specific service mappings (Azure NSGs play the role of AWS security groups; GCP firewall rules play both the NACL and SG roles). Kubernetes cluster networking (NetworkPolicies, exposed Services) is covered by [Container Security](/docs/features/container-security).

| Provider | L1 | L2 | L3 | L4 | L5 | L6 | L7 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AWS | Full | Full | Full | Full | Full | Full | Full |
| Azure | Full | Full | Full | Full | Full | Full | Full |
| GCP | Full | Full | Full | Full | Full | Full | Full |
| OCI | Full | Full | Full | Full | Full | Partial | Full |
| Alibaba Cloud | Full | Full | Full | Full | Full | Full | Partial |
| IBM Cloud | Full | Full | Full | Full | Full | Partial | Partial |

Partial means key controls are covered but not 100% of the layer's scope: OCI's native WAF service is newer and has fewer rule sets to audit, and IBM's L7 flow-log integration is being migrated as IBM Cloud retires its older monitoring service.

## Key Findings to Prioritize

The ten most-encountered network findings, with default severities. Re-grade per finding type in **Settings → Network Security → Severity Policy**.

| Finding | Severity | Layer | Why it matters |
| --- | --- | --- | --- |
| SSH open to internet on production instance | Critical | L4 | Brute-force target with full shell on success |
| Database port open to \`0.0.0.0/0\` | Critical | L4 | Direct data-exfiltration path |
| Internet-facing application with no WAF | High | L6 | OWASP Top 10 unblocked |
| VPC Flow Logs disabled | High | L7 | No forensic capability after a breach |
| HTTP-only load balancer (no TLS) | High | L5 | Plaintext credentials and sessions |
| TLS 1.0 / 1.1 accepted on public endpoint | High | L5 | Known-broken cipher suites |
| Default VPC in use with resources | Medium | L1 | No customized network controls |
| Default NACL in use (allows all) | Medium | L3 | Subnet boundary not enforced |
| Outbound unrestricted in NACL | Medium | L3 | Data-exfiltration path open |
| Orphaned security group | Low | L4 | Latent risk of future accidental attachment |

Every finding includes the affected resource, the full effective-exposure path where applicable, the suggested fix, and the framework controls it satisfies.

## API

Network Security endpoints live under the unified platform API (\`/api/v1\`, behind the BFF gateway). All endpoints require an authenticated session and are scoped to your tenant.

\`\`\`http
# List network security findings
GET /api/v1/network-security/findings?severity=CRITICAL

# Get findings for a specific VPC
GET /api/v1/network-security/findings?resource_uid=vpc-12345678

# Get the effective-exposure path for a specific resource
GET /api/v1/network-security/exposure-path?resource_uid={uid}
\`\`\`

Full request and response schemas are in the [API reference](/docs/reference/api). Webhook delivery on new Critical network findings can be configured under **Settings → Notifications**.

## FAQ

**How does effective-exposure analysis differ from a port scan?**
A port scan sees only what's reachable from where the scanner sits. Effective-exposure analysis evaluates the configuration of every network gate to determine reachability without sending any traffic. Onam never scans your environment from outside — analysis is purely configuration-based, agentless, and read-only.

**Can a finding be both Critical and not actually exploitable?**
No — that's exactly what effective-exposure analysis prevents. A security-group rule open to the internet on a private-subnet instance with no IGW route is graded low priority, not Critical. Severity reflects actual reachability.

**Does Onam check IPv6 paths?**
Yes. IPv6 routes, IPv6 security-group rules, and IPv6 NACL entries are evaluated alongside IPv4. A common finding is "IPv4 properly restricted but IPv6 open" — Onam flags both.

**What about AWS Network Firewall and Azure Firewall?**
Supported on AWS and Azure. Onam evaluates rule groups, stateful vs stateless policy, log delivery, and rule-order anomalies (deny rules placed below allow rules that would never be reached).

**Can I export the topology for offline analysis?**
Yes. The full topology graph (VPCs, subnets, route tables, peerings, transit gateways, security groups, load balancers, WAFs) exports as JSON or GraphML.

## Next steps

- [Attack Path](/docs/features/attack-path) — see how network exposure combines with IAM and data findings into full attack chains
- [Container Security](/docs/features/container-security) — NetworkPolicy coverage and exposed Kubernetes Services
- [API reference](/docs/reference/api) — query network findings programmatically
- [Book a demo](/request-demo) — see effective-exposure analysis on your own topology
`,
  },
  {
    slug: "features/data-security",
    title: "Data Security (DSPM)",
    breadcrumb: "Features / Data Security",
    body: `
Data Security (DSPM): every cloud data store, labelled from metadata and joined to exposure, access, encryption and lineage. The short version.

This page is the short version. The full documentation has its own section: start at the [DSPM overview](/docs/dspm/overview).

![How DSPM works — data stores, discovery, metadata classification, the access and exposure join, findings](/diagrams/dspm-pipeline.svg)

## What it answers

- **What data do we hold, and where?** Every data store across the connected clouds — object storage, managed databases and warehouses, streams, Kubernetes secrets and ConfigMaps — plus self-hosted databases you onboard. See [Discovery](/docs/dspm/discovery) and [Coverage by cloud](/docs/dspm/coverage).
- **Which stores look sensitive?** PII, PHI, PCI, financial and confidential labels inferred from names, descriptions, tags and schema. Contents are not read. See [Classification and its limits](/docs/dspm/classification).
- **How can each store be reached?** Public grants, other accounts in bucket policies, principals seen in the last 30 days of audit events, encryption and keys, and attack paths that end at the store. See [Access mapping](/docs/dspm/access-mapping).
- **Is it protected?** Encryption at rest, access logging, versioning and backup, residency, and a 0–100 governance score per store. See [Exposure, encryption and residency](/docs/dspm/exposure-and-residency).
- **Where does the data go next?** Replication, backup, ETL, streaming and export hops linked into chains, with cross-region and cross-account hops flagged. See [Data lineage](/docs/dspm/lineage).

## What it does not do

- It does not read objects, rows, messages or secret values, so it cannot count records or prove what an unlabelled store contains.
- It does not compute a per-store list of every identity whose effective permissions allow a read; that is answered per identity in [CIEM](/docs/features/ciem).
- It is not DLP: it does not inspect or block data in motion.

## Every check

The complete list of checks, what passes them and their severities is in the [DSPM findings reference](/docs/dspm/findings-reference).
`,
  },
  {
    slug: "features/vulnerability-management",
    title: "Vulnerability Management",
    breadcrumb: "Features / Vulnerability Management",
    body: `
Onam's Vulnerability engine scans every cloud workload — virtual machines, container images, serverless functions, and Kubernetes nodes — and correlates each CVE with the workload's actual runtime context (network exposure, exploitation activity in the wild, blast radius) to produce a prioritized list of what to patch first. Cloud-side scanning is agentless; optional host agents add OS-level depth on Linux, macOS, and Windows servers.

This page covers the scan pipeline, the four intelligence sources (NVD, EPSS, CISA KEV, OSV), the Effective Risk Score model, SBOM generation, the optional host agents, and the finding lifecycle.

![Agentless vulnerability management](/diagrams/vulnerability.svg)

## Why Prioritization Is the Product

The NVD now publishes 25,000+ new CVEs per year, and a typical mid-size cloud estate carries thousands of open CVE findings at any time. CVSS alone is a poor predictor of exploitation — **less than 5% of all CVEs are ever observed exploited in the wild**. The engine's job is to surface that 5%, ranked by your exposure, ahead of the noise.

## How It Works

Vulnerability management runs as a single end-to-end pipeline on every scan. Workloads are analyzed through your read-only cloud credential and the Agentless Scanner engine's snapshot scanning — no code runs inside your workloads.

| Stage | What happens | Outputs |
| --- | --- | --- |
| 1. Scan | Discovery enumerates workloads; package analysis generates a per-workload SBOM; CVE matching against NVD and OSV produces raw findings | Raw CVE findings (one per CVE per workload) |
| 2. Enrich | Each finding gains five context signals — CVSS, EPSS, KEV, network exposure, blast radius | Enriched findings |
| 3. Output | Findings emerge ranked by Effective Risk Score, with package-version remediation guidance and exportable SBOMs | Prioritized list + SBOM exports + API |

![Vulnerability management platform view — CVE findings, EPSS scores, and risk prioritization](/diagrams/p-vuln.svg)

Agentless-by-default matters: there is no fleet of scanners to upgrade, no agent compatibility matrix, and no high-value agent channel for attackers to target. Lambda functions, Fargate tasks, and ephemeral spot instances get scanned the same way as long-running instances — there is no "we couldn't install the agent" coverage gap.

## Vulnerability Intelligence Sources

Four curated sources feed detection and prioritization:

| Source | What it provides | Refresh cadence |
| --- | --- | --- |
| NVD | CVE metadata and CVSS v3.1 base scores | Every 4 hours |
| EPSS (FIRST.org) | Probability each CVE is exploited in the next 30 days | Daily |
| CISA KEV | Catalog of vulnerabilities confirmed exploited in the wild | Within an hour of CISA publication |
| OSV | Open-source package advisories keyed by ecosystem and affected version range | Continuous |

Vendor advisories (Microsoft MSRC, Red Hat, GitHub Security Advisories) are also tracked — they often run ahead of NVD, so new zero-days typically appear within hours.

## Supported Workload Types

| Workload | AWS | Azure | GCP | OCI | Alibaba | IBM |
| --- | --- | --- | --- | --- | --- | --- |
| Virtual machines / compute instances | Yes | Yes | Yes | Yes | Yes | Yes |
| Container images (in registries) | Yes | Yes | Yes | Yes | Yes | Yes |
| EKS / AKS / GKE node OS | Yes | Yes | Yes | Yes | — | Yes |
| Lambda / Functions | Yes | Yes | Yes | Yes | Yes | Yes |
| ECS / container instances | Yes | Yes | — | — | — | — |

For registries, every image in ECR, ACR, GCR, OCIR, Alibaba ACR, and IBM Cloud Container Registry is scanned — both pushed images and images currently deployed.

![Cloud workload protection across VMs, containers, serverless, and managed hosts (demo account)](/screenshots/screenshot-cwpp.png)

Every workload type above is collected agentlessly. The agentless scanner creates a point-in-time volume snapshot inside your own cloud account, analyses it out-of-band, and deletes the snapshot when the scan completes — so package inventory and host configuration are captured with no daemon, no sidecar, and no impact on the running workload.

## Risk Prioritization Model

Four input signals combine into a single **Effective Risk Score** from 0 to 100. Findings sort by this score by default.

![Risk prioritization model — four signals combine into one Effective Risk Score](/diagrams/feat-vuln-prioritization.svg)

| Signal | Source | What it tells you |
| --- | --- | --- |
| CVSS v3.1 base score | NVD | Published severity at disclosure (0–10) |
| EPSS score | FIRST.org | Probability of exploitation in the next 30 days |
| CISA KEV | KEV catalog | Is this currently being exploited in the wild? |
| Network exposure | Onam topology analysis | Internet-facing, internal-only, or air-gapped? |

Worked example — three CVEs ranked:

| CVE | CVSS | EPSS | KEV | Exposure | Effective Score | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| CVE-2024-0001 | 9.8 Critical | 0.5% | No | Internal-only | 42 | Medium |
| CVE-2024-0002 | 6.5 Medium | 85% | Yes | Internet-facing | 94 | Critical |
| CVE-2024-0003 | 7.2 High | 2% | No | Internal-only | 28 | Low |

The middle row is the lesson: CVE-2024-0002 has the lowest CVSS of the three, but it is actively exploited (KEV), highly likely to be exploited again (EPSS 85%), and lives on an internet-facing workload — so it ranks first. **CVSS alone would have ordered these wrong.** Adjust the per-signal weights in **Settings → Vulnerability → Risk Model** if your environment needs different priorities.

## SBOM Generation

Onam generates Software Bills of Materials for every scanned workload in **CycloneDX** (OWASP; used by GitHub and FedRAMP) and **SPDX** (Linux Foundation; required by US EO 14028). SBOMs are required for FedRAMP, the EU Cyber Resilience Act, and most supply-chain audit programs — and they answer "which of my workloads have log4j on them" instantly during the next supply-chain incident.

![SBOM generation — workload analysis to CycloneDX / SPDX export](/diagrams/feat-vuln-sbom.svg)

Two SBOM engines run in the platform: the **infrastructure SBOM engine** described here (workloads, images, snapshots) and the **SecOps SCA engine** that builds SBOMs from repository dependency manifests at PR time — see [IaC Scanning & SecOps](/docs/features/iac-scanning). Both export the same formats, so evidence pipelines consume one schema.

| Ecosystem | Tools / manifests parsed |
| --- | --- |
| OS — Debian / Ubuntu | dpkg, apt |
| OS — RHEL / CentOS / Amazon Linux | rpm, yum, dnf |
| OS — Alpine | apk |
| Python | pip, poetry, pipenv |
| Node.js | npm, yarn, pnpm |
| Java | Maven, Gradle, JAR manifests |
| Go | go.mod, go.sum |
| Ruby | Gemfile, gemspec |
| .NET | NuGet |
| PHP | Composer |
| Rust | Cargo |

\`\`\`http
GET /api/v1/vulnerability/sbom?resource_uid={uid}&format=cyclonedx
\`\`\`

SBOMs auto-update on every scan and can be delivered via webhook on update — useful for compliance evidence pipelines that retain SBOM history.

## Optional Host Agents

For servers where you want OS-level depth beyond what snapshot scanning sees, Onam ships an optional host agent (\`onam-agent\`) for **Linux, macOS, and Windows**. The agent is a server-side vulnerability scanner that discovers installed system components and reports to the central Vulnerability engine, with a hybrid mode that performs analysis locally before reporting.

- Discovers OS packages, kernels, and installed software on the host itself
- Reports component inventory to the central engine for CVE matching and scoring
- Hybrid mode: local analysis on the host, centralized prioritization and reporting
- Useful for hosts outside the cloud accounts (on-prem, colo) and the [Technology Engine](/docs/features/secops)'s self-hosted estate

> Agents are never required for cloud posture. The cloud connection itself stays agentless and read-only — agents only add OS-level vulnerability depth on hosts where you choose to install them.

## DAST

A DAST scanner is included in the platform via the SecOps engine — runtime testing of HTTP APIs and web applications against the OWASP API Top 10, complementing the configuration- and package-based analysis on this page. Setup and payload details are in [IaC Scanning & SecOps](/docs/features/iac-scanning).

## Finding Lifecycle

Every finding moves through defined states, and each transition is logged in the audit trail. Closures are verified by the next scan, not by an analyst self-reporting "fixed".

![Vulnerability finding lifecycle — Detected, Open, Acknowledged, Remediated, Closed, with a Suppressed branch](/diagrams/feat-vuln-finding-lifecycle.svg)

| State | When entered | Notes |
| --- | --- | --- |
| Detected | CVE matched to workload via SBOM | Internal — promoted to Open immediately |
| Open | Finding visible in the console; SLA timer running | Stays Open until acknowledged, suppressed, or remediated |
| Acknowledged | Analyst acknowledges; SLA timer pauses | Optional "we're working on it" marker |
| Remediated | Package upgraded; next scan no longer matches | Auto-detected — no manual close needed |
| Closed | Next scan confirms remediation | Full state history retained |
| Suppressed | Risk accepted with documented justification | Excluded from severity counts; tracked for auditor review |

Auto-closure prevents "ghost findings" — patches applied months ago whose findings never closed because nobody clicked a button. Suppressions require a justification, optionally an expiry and an approver; on expiry the suppression auto-reverts to Open, so risk acceptance never silently becomes permanent.

## Key Metrics to Track

| Metric | Description | Where |
| --- | --- | --- |
| Mean Time to Remediate (MTTR) | Finding open to finding resolved | Vulnerability dashboard |
| Critical CVE count | Active Critical findings by workload | Findings list, filter \`severity=CRITICAL\` |
| KEV exposure | Workloads with CISA KEV CVEs | Findings list, filter \`kev=true\` |
| SBOM coverage | Percent of workloads with a generated SBOM | SBOM report page |
| Mean Effective Risk Score | Average score across Open findings | Posture dashboard |

## API

\`\`\`http
# List vulnerability findings, sorted by effective risk score
GET /api/v1/vulnerability/findings?sort=risk_score&order=desc&status=OPEN

# Aggregate statistics by severity, KEV, and exposure
GET /api/v1/vulnerability/findings/stats

# Get the SBOM for a specific resource
GET /api/v1/vulnerability/sbom?resource_uid={uid}&format=cyclonedx
\`\`\`

Webhook delivery on new Critical findings (Effective Score at or above 90, or KEV match) can be configured in **Settings → Notifications**.

## FAQ

**Does Onam scan workloads while they're running?**
Yes — agentlessly. The Agentless Scanner engine reads workload metadata, manifests, and attached snapshots through your cloud API to enumerate installed packages. No code runs inside your workload unless you opt into the host agent.

**When should I install the host agent?**
When you need OS-level component discovery beyond snapshot analysis — long-lived servers, hosts outside your cloud accounts, or fleets where local (hybrid) analysis is preferred. For most cloud estates, agentless coverage is sufficient.

**Does Onam support custom CVE feeds?**
Yes — on Enterprise plans you can ingest your organization's internal advisory feed; it merges with NVD, OSV, and vendor data in scoring.

**Can I customize the Effective Risk Score formula?**
Yes. **Settings → Vulnerability → Risk Model** exposes per-signal weights (CVSS, EPSS, KEV, exposure) and severity range overrides.

**Does Onam support container layer attribution?**
Yes. When a CVE is detected in a container image, the finding identifies which layer introduced the vulnerable package — so you fix it once, at the Dockerfile or base image.

## Next steps

- [Container Security](/docs/features/container-security) — image scanning in registries and clusters
- [IaC Scanning & SecOps](/docs/features/iac-scanning) — catch vulnerable dependencies at PR time with SCA
- [Risk Quantification](/docs/features/risk-quantification) — convert CVE exposure into dollar terms
- [API reference](/docs/reference/api) — findings, stats, and SBOM endpoints
`,
  },
  {
    slug: "features/container-security",
    title: "Container & Kubernetes Security",
    breadcrumb: "Features / Container Security",
    body: `
Onam's Container Security engine evaluates every container surface in your cloud — Kubernetes clusters (EKS, AKS, GKE, OKE, IKS, ACK, self-managed), ECS task definitions, container registries, and the workloads running on top — without installing anything on your nodes. The output is a prioritized list of cluster-takeover risks, workload misconfigurations, image vulnerabilities, and missing network controls, mapped to CIS and NSA/CISA hardening guidance.

This page covers the six coverage surfaces, the scan pipeline, Kubernetes RBAC analysis, Pod Security Standards, NetworkPolicy coverage, and image/supply-chain checks.

![Container and Kubernetes security](/diagrams/container-security.svg)

![The container security view in the Onam console (demo account)](/screenshots/screenshot-container.png)

## Coverage at a Glance

The Kubernetes attack surface is uniquely large: every cluster has a control plane, a workload plane, an image supply chain, an RBAC system, and a network policy system. A single weak default in any one of them gives an attacker who compromises one pod a path to every other pod. Onam covers **six surfaces**, and once a cluster is connected every applicable check runs on every scan — surfaces are not enabled individually.

| Surface | What's checked |
| --- | --- |
| Kubernetes posture | RBAC analysis · network policies · Pod Security Standards · privileged containers · hostPath mounts · service-account permissions |
| Node security | OS vulnerability scanning · node configuration benchmarks · CIS Kubernetes Benchmark compliance |
| Workload security | Pod-spec misconfigurations · resource limits · dangerous capability grants · read-only filesystem · non-root enforcement |
| Image security | Registry image scanning · known CVEs · base-image age · secrets in image layers |
| Network | Ingress exposure · LoadBalancer service types · missing network policies · cluster-to-cluster peering |
| Registry and supply chain | ECR / ACR / GCR / Docker Hub / GHCR / OCIR scanning · image-signature verification · unsigned images in production |

## Supported Platforms

The Kubernetes rule set — 718 rules across 51 resource kinds in Onam's master registry — applies across every supported distribution. ECS is covered via task-definition analysis.

| Platform | Provider | Coverage |
| --- | --- | --- |
| EKS (Elastic Kubernetes Service) | AWS | Full — RBAC, workloads, nodes, images, network |
| AKS (Azure Kubernetes Service) | Azure | Full — RBAC, workloads, nodes, images, network |
| GKE (Google Kubernetes Engine) | GCP | Full — RBAC, workloads, nodes, images, network |
| OKE (Oracle Kubernetes Engine) | OCI | Full — RBAC, workloads, nodes, images |
| IKS (IBM Kubernetes Service) | IBM | Full — RBAC, workloads, nodes, images |
| ACK (Alibaba Container Service) | Alibaba Cloud | Partial — RBAC, workloads |
| ECS (Elastic Container Service) | AWS | Task-definition security · IAM roles · network mode |
| Self-managed Kubernetes | Any | Via kubeconfig connection |

## How the Security Check Works

Every scan runs three stages: discover cluster state, evaluate against rule catalogs, emit prioritized findings. No agents on nodes — every check uses your read-only kubeconfig or IAM-based cluster access.

![Container security pipeline — Discovery, Evaluation, Findings](/diagrams/feat-container-pipeline.svg)

1. **Discovery.** Onam reads cluster state through the Kubernetes API server with your read-only credential: Pods, Deployments, Services, Roles, RoleBindings, NetworkPolicies, Namespaces, ConfigMaps (Secret references only — never values), Nodes, and the images running on each. In parallel, container registries are scanned for image inventory.
2. **Evaluation.** Three rule catalogs apply: the **CIS Kubernetes Benchmark v1.8** (112 controls), **NSA/CISA Kubernetes Hardening Guidance** (2024 edition), and **custom rules** — YAML rules you define for org-specific policies via the Rule Builder.
3. **Findings.** Output is categorized into RBAC findings (over-privileged service accounts, cluster-admin bindings), workload findings (privileged pods, missing limits), network findings (no policies, exposed services), and image findings (CVEs, unsigned images). Each is severity-graded and CIS-mapped.

![Container security platform view — cluster posture, RBAC findings, and workload risk](/diagrams/p-container.svg)

## Kubernetes RBAC Analysis

RBAC misconfiguration is **the single most common path to cluster compromise**. Onam traces the full chain — service account, RoleBinding, Role, effective verbs × resources × apiGroups — and computes the resolved effective permission set per service account.

![Kubernetes RBAC analysis — service account to effective permissions chain with high-risk patterns](/diagrams/feat-container-rbac.svg)

The five high-risk patterns flagged:

| Pattern | Severity | Why it's dangerous |
| --- | --- | --- |
| \`cluster-admin\` bound to a service account | Critical | Pod compromise = cluster takeover; only fix is rebinding |
| Wildcard verbs (\`*\`) on sensitive resources | High | \`verbs: ["*"]\` on secrets, pods, or clusterroles enables secret read plus arbitrary exec |
| \`exec\` / \`attach\` in production | High | \`pods/exec\` and \`pods/attach\` allow shells into running pods, bypassing image immutability |
| Default service account with non-default bindings | Medium | Every pod in the namespace silently inherits the extra access |

> Worked example: ClusterRoleBinding \`dev-admin\` grants \`cluster-admin\` to service account \`default/app-runner\` in namespace \`production\` — a Critical finding. Suggested fix: create a least-privilege ClusterRole limited to the resources and verbs the app needs, bind that, then remove the cluster-admin binding.

## Pod Security Standards

Every pod is graded against the official Kubernetes Pod Security Standards (the replacement for the deprecated PodSecurityPolicy):

| Standard | What's required | Recommended for |
| --- | --- | --- |
| Privileged | Any configuration allowed | Legacy clusters only — flagged by Onam |
| Baseline | No host namespaces · no privileged containers · restricted capabilities | Minimum baseline for non-prod |
| Restricted | Baseline plus non-root user · read-only filesystem · drop ALL capabilities | Production workloads |

Findings are tagged with the violated level, so you can roll out enforcement via your admission controller (Kyverno, OPA, or native Pod Security Admission) without trial and error.

## Network Policy Coverage

By default, **Kubernetes allows all pod-to-pod traffic across the cluster**. Without NetworkPolicy resources there is no firewall between pods — one compromised pod can reach every database, queue, and admin service in the namespace.

![Network policy coverage — lateral movement without policies vs least privilege with policies](/diagrams/feat-container-netpol.svg)

| Posture | Pod-to-pod reachability | Risk if Pod A is compromised |
| --- | --- | --- |
| Without NetworkPolicy (default) | Pod A ↔ Pod B ↔ Database on any port | Attacker reaches the DB on 5432, 22, 6379 — anything |
| With NetworkPolicy (desired) | Pod A to Pod B on 8080 only · Pod B to DB on 5432 only | Blast radius contained to Pod B's exposed port |

What Onam flags:

- Namespaces with **zero NetworkPolicy resources** — likely never configured
- Pods with **no matching NetworkPolicy** — policies exist but selectors miss the pod
- **Unrestricted egress** — pods that can reach the internet, a precursor to exfiltration paths
- **Cluster-wide allow-all policies** — usually added during debugging and never removed

The fix is rarely "deny everything". Onam suggests policy templates based on the traffic that actually flows in the namespace, derived from VPC Flow Logs or service-mesh telemetry where available.

## Image Security

Images are scanned in two contexts — at rest in registries and at runtime in the cluster — for four classes of issues:

| Check | What's flagged |
| --- | --- |
| Known CVEs | Matched against NVD, OSV, Red Hat, Debian, Ubuntu, Alpine, and GitHub Security advisories |
| Secrets in layers | API keys, passwords, and tokens baked into image history |
| Base-image age | EOL base OS versions (Debian 9, Ubuntu 18.04, Alpine 3.12) |
| Image signing | Unsigned images deployed to production (Cosign / Notary v2 / sigstore verification) |

Supported registries: ECR (AWS), ACR (Azure), GCR / Artifact Registry (GCP), OCIR (OCI), Docker Hub, GitHub Container Registry, and Quay. If your CI pipeline signs images at build, Onam verifies the signature is intact at deploy time and flags tampered images at runtime.

## CIS Kubernetes Benchmark Coverage

Findings map to the CIS Kubernetes Benchmark v1.8 — 112 controls in six sections. New CIS versions are added within 60 days of publication; previous versions stay available for migration.

| Section | Controls | Examples |
| --- | --- | --- |
| Control plane components | 30 | API server flags, etcd config, scheduler settings |
| etcd | 7 | Data encryption, peer authentication, client cert auth |
| Control plane configuration | 4 | Audit log policy, profiling disabled |
| Worker nodes | 28 | Kubelet config, node authorization, file permissions |
| Kubernetes policies | 28 | RBAC, network policies, pod security |
| Managed K8s (EKS / AKS / GKE) | 15 | Provider-specific hardening |

CIS coverage is a strict subset of the broader rule catalog — a finding usually carries CIS, NSA, and custom-rule mappings simultaneously.

## Key Findings to Prioritize

Re-grade per finding type in **Settings → Container Security → Severity Policy**.

| Finding | Severity | Why it matters |
| --- | --- | --- |
| \`cluster-admin\` bound to pod service account | Critical | Full cluster takeover if the pod is compromised |
| Privileged container running in production | Critical | Container can escape to the host node |
| Secrets mounted as environment variables | High | Secrets exposed in pod spec, stdout, and container logs |
| No network policies in namespace | High | Lateral movement across all pods |
| Missing resource limits on pods | Medium | Resource exhaustion / DoS vector |
| Image using \`latest\` tag | Medium | Unpredictable deployments, no version pinning |
| Read-write root filesystem | Medium | Persistence after compromise |
| Default service account with non-empty RBAC | Medium | Unintended access escalation across pods |

## API

\`\`\`http
# List container security findings
GET /api/v1/container-security/findings?provider=aws&severity=CRITICAL

# Get findings for a specific cluster
GET /api/v1/container-security/findings?resource_uid=arn:aws:eks:us-east-1:123456789012:cluster/prod
\`\`\`

Full schemas are in the [API reference](/docs/reference/api). Webhook delivery on new Critical findings can be configured under **Settings → Notifications**.

## FAQ

**Does Onam install anything on my nodes?**
No. Cluster state is read via the Kubernetes API with read-only credentials. No DaemonSets, no sidecars, no node agents.

**How does Onam get image-CVE data without a scanner inside the cluster?**
Registries are scanned at the registry level; the cluster only tells Onam which images are deployed where, and the registry tells Onam what's inside them via SBOM generation and CVE matching.

**Can I scan air-gapped clusters?**
Yes. A connector mode runs a small read-only collector in your network that forwards cluster state. Image scanning still requires registry access — typically your internal registry mirror.

**Does Onam support Pod Security Admission (PSA)?**
Yes. PSA labels on namespaces are read and reflected in findings — namespaces enforcing \`restricted\` produce fewer findings than namespaces enforcing \`privileged\`.

**What about service mesh (Istio / Linkerd)?**
VirtualServices, DestinationRules, and AuthorizationPolicies are read alongside core resources; mTLS posture and authorization-policy gaps surface as findings.

**Can I export the cluster topology?**
Yes — namespaces, workloads, services, the RBAC graph, and network policies export as JSON for incident-response runbooks.

## Next steps

- [Onboard a Kubernetes cluster](/docs/onboarding/kubernetes) — connect EKS, AKS, GKE, or self-managed clusters
- [Vulnerability Management](/docs/features/vulnerability-management) — how image CVEs are prioritized
- [IaC Scanning & SecOps](/docs/features/iac-scanning) — catch pod-spec and Helm issues before deploy
- [Network Security](/docs/features/network-security) — the cloud-network side of cluster exposure
`,
  },
  {
    slug: "features/compliance",
    title: "Compliance",
    breadcrumb: "Features / Compliance",
    body: `
Onam's Compliance engine turns security findings into compliance posture: findings are mapped to the controls they affect across **78 frameworks**, each control is assessed, and each framework gets a 0–100% score you can track, drill into and export.

This page explains where the findings come from, how controls are assessed and scored, and how to export reports. For the framework list, see [Framework Coverage](/docs/compliance/frameworks).

![The compliance view in the Onam console (demo account)](/screenshots/screenshot-compliance.png)

## From Findings to Scores

Compliance runs after a scan. No separate "compliance scan" is needed — the same scan that finds a public bucket also updates your PCI DSS score.

![Compliance scoring flow — findings mapped to controls, aggregated into pass rates and framework scores](/diagrams/compl-scoring-flow.svg)

1. **Load.** The engine reads the latest findings from four sources: posture checks, threat detection, vulnerabilities, and technology checks.
2. **Map.** Each rule is resolved against the rule-to-control mapping catalog. One rule can cite controls in several frameworks, so a single check produces evidence for many frameworks at once.
3. **Assess.** Each control is assessed from the resources evaluated against it.
4. **Score.** Control results roll up into a 0–100% score per framework, and each result is kept for the trend.
5. **Report.** Reports are assembled with evidence per control; exporters produce PDF, CSV, Excel and JSON.

## Control Mapping

Because the mapping is many-to-many, one failed check counts against every framework that cites it. Every control page lists the resources that passed and failed, and every resource can be looked up to see the controls it affects across frameworks.

## Control Status and Scores

Each control is assessed as one of five statuses:

| Control status | Meaning |
| --- | --- |
| Pass | Every evaluated resource passed the checks mapped to the control |
| Fail | Every evaluated resource failed — the failing resources are listed on the control |
| Partial | Some evaluated resources passed and some failed |
| Manual review | The control cannot be assessed automatically and needs a person to review it |
| Not applicable | No resources were evaluated against the control in the scanned scope |

The framework score (0–100%) rolls up the control results. Scores are recomputed from the latest findings and kept over time, so the trends view shows whether posture is improving.

> Automated scanning evaluates technical controls — encryption, logging, access policies, network exposure. Frameworks also contain administrative and process controls (security training, vendor management) that no scanner can assess. Those controls are marked for manual review rather than scored as passing, so the score shows exactly what was checked.

## Framework Catalog

The catalog covers **78 frameworks**: CIS benchmarks for AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud and Kubernetes (including managed Kubernetes services), CIS benchmarks for operating systems, databases, web servers, network devices and SaaS platforms, NIST 800-53, NIST 800-171, ISO 27001:2022, PCI DSS, HIPAA, GDPR, SOC 2, FedRAMP Moderate and High, RBI frameworks for banks and NBFCs, and Canada PBMM.

The full list is on [Framework Coverage](/docs/compliance/frameworks). Custom rules built in the Rule Builder can carry their own framework mappings.

## Evidence

Evidence is collected per control from the scan that produced the result — the resources evaluated, their results, and when the evidence was collected. You do not take screenshots or assemble evidence by hand.

## Exceptions

An exception or compensating control is recorded against a control with a justification, an approver and a target date. Exceptions stay visible in compliance views and are flagged as their expiry nears, so an accepted risk never disappears silently. Rule-level suppressions in [CSPM](/docs/features/cspm) are separate and carry their own reason and expiry.

## Reports and Exports

| Report | What it contains | Audience |
| --- | --- | --- |
| Executive summary | Score per framework and the overall picture | Leadership, board reporting |
| Framework report | Control-by-control breakdown for one framework, with failing resources | Compliance team, auditors |
| Resource drilldown | Framework → control → resource, and every control citation for a resource | Engineers fixing findings |
| Account view | Compliance for one cloud account | Account owners |

Reports export as **PDF and CSV**, and also as **Excel and JSON**.

## Running Compliance Reports

1. Open **Compliance** in the Onam console and select a framework.
2. Review the per-control breakdown — each failed control lists its failing resources.
3. Fix findings (or record an exception with a justification) and re-scan; the score updates on the next run.
4. Export the framework report as PDF or Excel for evidence.

## API

\`\`\`http
# List supported frameworks
GET /api/v1/compliance/frameworks

# Full report for one framework
GET /api/v1/compliance/framework/{framework_id}/report

# Executive dashboard across frameworks
GET /api/v1/compliance/dashboard

# Historical score trends
GET /api/v1/compliance/trends
\`\`\`

Report exports accept a format parameter (\`json\`, \`pdf\` or \`csv\`), and each framework has PDF and Excel downloads. Full schemas are in the [API reference](/docs/reference/api).

## FAQ

**How often do scores update?**
Each time compliance runs after a scan, including scans you start on demand. Every result is kept for trend reporting.

**Can I score a single account?**
Yes. Compliance can be viewed per cloud account as well as across all accounts.

**Do custom rules affect compliance scores?**
Yes, when you assign framework mappings to them in the Rule Builder. Unmapped custom rules produce findings but do not change framework scores.

**What does a score of 100% mean?**
Every automatically assessed control passed in the latest results. Controls marked for manual review still need a person to review them.

## Next steps

- [Framework Coverage](/docs/compliance/frameworks) — the 78 frameworks
- [CSPM](/docs/features/cspm) — the posture rules that generate most of the underlying findings
- [Data Security](/docs/features/data-security) — data findings and sensitive stores
- [Book a demo](/request-demo) — see your framework scores on a live connected account
`,
  },
  {
    slug: "features/risk-quantification",
    title: "Risk Quantification (FAIR)",
    breadcrumb: "Features / Risk Quantification",
    body: `
Onam's Risk engine gives critical and high findings a **FAIR-style loss estimate** in dollars. FAIR (Factor Analysis of Information Risk) breaks risk into how likely a loss event is and how large the loss would be; Onam follows that structure per finding. The output is a business-language view: total exposure, the top scenarios ranked by likely loss, and how exposure is trending.

This page explains the formula, the inputs it uses, how attack-path context raises an estimate, and where the engine runs in the platform pipeline.

![The risk view in the Onam console (demo account)](/screenshots/screenshot-risk.png)

## The Model

\`\`\`
Risk = Loss Event Frequency × Loss Magnitude
Loss Event Frequency = exploit probability (EPSS) × exposure factor
Loss Magnitude       = records × per-record cost × sensitivity × asset value × regulation
\`\`\`

| Factor | Question it answers | Where Onam gets it |
| --- | --- | --- |
| Exploit probability | How likely is this weakness to be exploited? | EPSS scores for the finding |
| Exposure factor | How reachable is the resource? | Public or internal exposure, raised by attack-path signals (below) |
| Records and per-record cost | How much data is at risk, and what does each record cost in a breach? | Record estimates and industry per-record breach-cost benchmarks, overridable per tenant |
| Sensitivity | How sensitive is the data? | The [DSPM classification](/docs/features/data-security) of the affected store — restricted, confidential, internal or public |
| Asset value | How valuable is the resource? | An asset catalog, with crown jewels from the [Attack Path](/docs/features/attack-path) engine weighted highest |
| Regulation | Which regulations apply? | The data and the region — GDPR is applied automatically to resources in EU regions |

## Where the Engine Runs

Risk Quantification runs after discovery, checks and the domain engines have completed, so it prices the finished picture rather than raw signals:

| Stage | What happens | Output |
| --- | --- | --- |
| 1. ETL | Pulls critical and high findings once the scan completes | Normalized risk input set |
| 2. Evaluate | Applies the computation per finding — likelihood, loss, multipliers, attack-path signals | Low, likely and high exposure per finding |
| 3. Report | Writes portfolio rollups and trends | Dashboard, trends and API views |

Estimates are recomputed after every scan.

## Regulatory Exposure

When a finding touches regulated data, the engine applies the **single strictest** regulatory multiplier — they never stack — and adds an estimated regulatory fine. Regimes include GDPR, HIPAA, PCI DSS, SOX, CCPA, LGPD, APPI, PDPA, PIPEDA and POPIA.

## Attack-Path Signals

The [Attack Path](/docs/features/attack-path) engine writes signals onto each resource, and the Risk engine uses them to raise the likelihood side of the estimate:

- the finding is **on an attack path**
- the resource is on **many attack paths**
- the resource is a **choke point**
- an **active threat actor** is touching the resource — highest of all when it is an admin role
- a certificate on the resource is close to expiry

A **large blast radius** raises the estimate further. The estimate stays per finding — attack paths raise it; they are not priced on their own.

## Output Metrics

Per finding:

- **Low, likely and high exposure** — a dollar range rather than a single point
- **Primary loss and regulatory fine** — shown separately
- **Risk tier** — critical, high, medium or low, from the likely exposure
- **Blast radius** — a sample of the resources reachable from it

Per portfolio:

- **Total exposure** — across all open critical and high findings
- **Top scenarios** — ranked by likely exposure
- **Exposure by engine** and by scenario type — data exfiltration, privilege escalation, credential theft, ransomware and others
- **Risk trend** — exposure over time

## API

\`\`\`http
# Risk dashboard
GET /api/v1/risk/dashboard

# Scenarios, ranked by exposure
GET /api/v1/risk/scenarios

# Exposure over time
GET /api/v1/risk/trends

# Highest-risk assets
GET /api/v1/risk/assets/top
\`\`\`

Full schemas are in the [API reference](/docs/reference/api).

## FAQ

**Can I calibrate the model with our own financial data?**
Yes. Per-record cost, annual revenue and the data-sensitivity multipliers can be set per tenant, overriding the industry defaults.

**Does this replace a formal risk assessment?**
No. Onam Risk Quantification is automated estimation, designed to drive prioritization and board reporting. It does not replace a formal risk assessment carried out by a practitioner.

**How often are estimates updated?**
After every scan.

## Next steps

- [Attack Path](/docs/features/attack-path) — the reachability and choke-point signals behind the boosts
- [Vulnerability Management](/docs/features/vulnerability-management) — the EPSS signal behind likelihood
- [Data Security](/docs/features/data-security) — the classification behind sensitivity
- [Book a demo](/request-demo) — see your estate's exposure in dollars
`,
  },
];
