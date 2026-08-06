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
Data Security Posture Management (DSPM) answers two questions security teams cannot answer manually at cloud scale: **where is your sensitive data, and is it properly secured?** Onam's Data Security engine discovers every data store across cloud storage, databases, and data pipelines — managed AND shadow stores — classifies the data inside them as PII, PCI, or PHI, and grades each store for encryption, access control, retention, and logging.

This page explains the four-stage DSPM pipeline, the classification taxonomy, how exposure levels determine severity, and how data-flow analysis catches sensitive data leaking into less-secure downstream stores.

![Data security posture management](/diagrams/data-security.svg)

![The data security view in the Onam console (demo account)](/screenshots/screenshot-datasec.png)

## What DSPM Solves

Every cloud organization hits the same five data-security failure modes. They share a single root cause: **new data stores are created faster than they are reviewed, classified, and secured**.

| Failure mode | What it looks like | Why it happens |
| --- | --- | --- |
| Shadow data stores | An S3 bucket created for a one-off task that quietly accumulates production data | Bucket creation is one API call; governance is a multi-step process |
| Over-exposed data | A public bucket with PII inside, discovered by a third-party researcher | A misclick in bucket settings or IAM copied from a public-asset bucket |
| Unencrypted sensitive data | An RDS instance holding PII without encryption at rest | Default encryption was opt-in for years; legacy databases predate the default-on era |
| Stale sensitive data | An old backup bucket with customer data from a deprecated product, never purged | Lifecycle policies get forgotten when the owner leaves the team |
| Misconfigured access | Developers with direct read access to the production customer database | Incident-response convenience that nobody removed afterward |

DSPM closes the gap by re-evaluating every data store on every scan — managed stores, shadow stores, backups, snapshots, and the pipelines that move data between them.

## How DSPM Works

DSPM runs as a four-stage pipeline against every data store in your connected accounts: **Discover** what exists, **Classify** what's inside, **Evaluate** the security controls, **Emit** prioritized findings. The pipeline is agentless — no database extensions, no inline scanners, no network taps.

![DSPM 4-stage pipeline — Discover, Classify, Evaluate, Findings](/diagrams/feat-datasec-pipeline.svg)

### 1. Discover — find every data store

The engine enumerates every data store reachable from your read-only credential, including ones nobody is tracking:

- **Object storage** — every S3 bucket, Azure Blob container, GCS bucket, OCI Object Storage bucket, Alibaba OSS bucket, and IBM COS bucket, including buckets untouched for a year.
- **Managed databases** — RDS (every engine), Azure SQL, Azure DB for Postgres/MySQL, Cosmos DB, Cloud SQL, BigQuery, DynamoDB, Redshift, Synapse, and more.
- **Shadow stores** — self-managed databases on compute instances, attached volumes containing data files, orphaned RDS snapshots. Detected through instance-metadata pattern matching, security-group inspection, and data-file fingerprinting.

A typical AWS account has 2–3x more shadow stores than the security team is tracking. Surfacing them is half the value of DSPM.

### 2. Classify — identify what's sensitive

For every discovered store, the engine samples a small, statistically valid window of content using your read credential, returns only matched-pattern metadata, and discards the sampled data immediately. **Bulk data never leaves your cloud account.**

Classification combines regex patterns, format validators (Luhn for cards, mod-11 for national IDs), and ML models for ambiguous cases. Each classification carries a confidence score; below a configurable threshold the data is flagged "possibly sensitive" rather than positively classified.

### 3. Evaluate — check the security controls

For every store containing sensitive data, four control axes are evaluated, plus residency for regulated data:

- **Encryption at rest** — is a KMS-managed key in use, is rotation enabled, is the key shared more broadly than it should be?
- **Access controls** — is the store public, reachable from external accounts, or broader than the workload needs? (The [CIEM](/docs/features/ciem) signal feeds in here.)
- **Retention** — is a lifecycle policy in place, and is data older than the policy window flagged?
- **Logging** — are access logs enabled and tamper-proof? Can you reconstruct who read what for the last 90 days?
- **Residency** — PCI cardholder data or GDPR-scoped data outside the approved geographic region is flagged immediately.

### 4. Findings — prioritized, framework-mapped output

Each finding includes the affected store, the data classification, the failed control, the suggested fix, framework citations (GDPR, PCI-DSS, HIPAA, ISO 27001), and the MITRE ATT&CK technique where applicable.

![DSPM platform view — sensitive data discovery, classification, and exposure risk](/diagrams/p-datasec.svg)

## Data Classification

Onam classifies data into five sensitivity categories. Each maps to specific regulations and triggers different finding severities. You can extend the catalog with custom data classes under **Settings → DSPM → Custom Patterns**.

| Category | Examples | Compliance trigger | Severity if exposed |
| --- | --- | --- | --- |
| PII — personal data | Full name, email, phone, address, SSN, DOB, government IDs, passport numbers | GDPR · CCPA · LGPD · PIPL | Critical |
| PCI — payment data | Card PAN (Luhn-validated), CVV, expiry, cardholder name, bank account numbers | PCI-DSS v4.0 | Critical |
| PHI — health data | Medical record IDs, patient name + diagnosis, prescriptions, insurance IDs, lab results | HIPAA · HITECH · GDPR | Critical |
| Confidential — business | Source code, M&A documents, salary data, legally privileged documents | NDA exposure · trade-secret risk | High |
| Credentials — high risk | API keys, plaintext passwords, private keys, connection strings with embedded creds | Universal — every framework | Critical |

> Credentials are graded Critical in every context because a leaked credential cascades: an attacker with an API key pivots into the system it authorizes, exfiltrates more data, and mints more credentials. Onam treats credential leakage as the worst-case category by default.

## Data Exposure Levels

Every classified store is rated against four exposure tiers. The combination of sensitivity and exposure determines severity.

![Data exposure levels — Public, External, Internal, Restricted](/diagrams/feat-datasec-exposure-levels.svg)

| Level | Who can reach it | Default platform response |
| --- | --- | --- |
| Public | Anyone on the internet, no authentication | Critical finding if data is sensitive — immediate alert |
| External | Authenticated users outside your organization (other cloud accounts, partners, contractors) | High finding — trust review prompted |
| Internal | Anyone authenticated within your tenant | Medium finding if scope is broader than the workload needs |
| Restricted | Only specific named principals — least privilege enforced | No finding — this is the target posture |

The combination matrix that determines severity:

| Sensitivity vs exposure | Public | External | Internal | Restricted |
| --- | --- | --- | --- | --- |
| PII / PCI / PHI | Critical | High | Medium | No finding |
| Confidential — business | Critical | High | Medium | No finding |
| Credentials | Critical | Critical | High | Medium |
| Public-class data | No finding | No finding | No finding | No finding |

Intentionally public assets (website images, public docs, marketing content) never produce findings — once you confirm a bucket as intentionally public, Onam stops alerting on it in future scans.

## Supported Data Stores

Both fully managed stores and self-managed stores running on cloud compute are detected.

| Category | Services covered |
| --- | --- |
| Object storage | AWS S3, Azure Blob Storage, GCP Cloud Storage, OCI Object Storage, Alibaba OSS, IBM COS |
| Managed relational | AWS RDS (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, Aurora), Azure SQL, Azure DB for PostgreSQL/MySQL, GCP Cloud SQL, OCI DB Systems |
| Managed NoSQL | DynamoDB, Cosmos DB, Firestore, Bigtable, Alibaba Table Store |
| Data warehouses | Amazon Redshift, Azure Synapse, BigQuery, Snowflake (via connector) |
| Streaming | Amazon Kinesis, Azure Event Hubs, GCP Pub/Sub |
| Secrets and config | AWS Secrets Manager, Azure Key Vault, GCP Secret Manager (metadata only — secret values are never read) |
| Self-managed (shadow) | Postgres / MySQL / MongoDB / Redis on compute instances, attached volumes with data files, RDS and Aurora snapshots, machine images with embedded data |

Snowflake is supported via a read-only connector you authorize on the Snowflake side. Databricks support is on the roadmap.

## Key DSPM Findings

The ten most-encountered DSPM findings. Re-grade per finding type in **Settings → DSPM → Severity Policy**.

| Finding | Severity | Description |
| --- | --- | --- |
| Public S3 bucket contains PII | Critical | Bucket accessible without auth, contains personal data |
| RDS instance with PII — no encryption at rest | Critical | Sensitive data stored unencrypted on disk |
| Database with PII — public endpoint | Critical | Database listening on a public IP, no IP allowlist |
| Bucket with PII — no access logging | High | No audit trail for who read the data |
| Over-privileged access to PII store | High | Developers or shared roles with direct prod-data read |
| Backup bucket with PII — no lifecycle policy | High | Sensitive data not deleted per retention schedule |
| PCI data in non-compliant region | High | Cardholder data stored outside approved geography |
| PHI with unencrypted backups | High | HIPAA violation — automatic backups not encrypted |
| Secrets found in object storage | High | API keys or passwords stored as objects |
| Stale PII — not accessed in 1+ year | Medium | Data exists beyond likely retention requirement |

Each finding includes sample matched-pattern metadata (never the data itself), suggested remediation, and framework citations such as GDPR Art. 32, PCI-DSS Req 3.4, and HIPAA §164.312.

## Data Flow Analysis

Sensitive data rarely stays in one place — it moves through ETL pipelines, backup jobs, analytics exports, and BI tools. **A secure source database means nothing if a downstream pipeline lands the same data in a public bucket.** DSPM follows the flow.

![Data flow analysis — PII from a secure RDS source spreading through downstream stores with different exposure levels](/diagrams/feat-datasec-flow-example.svg)

The worked example: a production RDS instance is configured correctly — encrypted, VPC-only, audit-logged. But three pipelines move its data onward:

| Hop | Destination | Posture | Finding |
| --- | --- | --- | --- |
| ETL pipeline | Staging S3 bucket | Public, no encryption, no logging | Critical — PII exposed to internet |
| Backup job | S3 backup bucket | No lifecycle policy, data stale 18+ months | High — retention violation |
| Analytics export | Redshift warehouse | Broad read access, 47 users, weak access logs | Medium — over-privileged access |
| Redshift to BI tool | Tableau / Power BI | External viewer accounts, no MFA | Medium — external exposure |

Onam traces these flows automatically by reading IAM permissions (which identities can read which source), pipeline definitions (Lambda, Glue, Data Factory, Dataflow), and snapshot/backup configuration. Every downstream store inherits the source's classification — when sensitive data lands in a less-secure store, that is the finding.

## Compliance Mapping

One DSPM finding usually triggers controls in three or more frameworks at once. Per-framework rollups live on the [Framework Coverage](/docs/compliance/frameworks) page.

| Finding type | GDPR | PCI-DSS | HIPAA | ISO 27001 |
| --- | --- | --- | --- | --- |
| Public PII exposure | Art. 32 | Req 1.3 | §164.312(e) | A.8.20 |
| Unencrypted PII at rest | Art. 32 | Req 3.4 | §164.312(a) | A.8.24 |
| Missing access logging | Art. 30 | Req 10.2 | §164.312(b) | A.8.15 |
| Over-privileged data access | Art. 5(f) | Req 7.1 | §164.312(a) | A.8.3 |
| No data retention policy | Art. 5(e) | Req 3.1 | §164.530(j) | A.8.10 |
| Data residency violation | Art. 44–50 | Req 3.5 | n/a | A.5.34 |
| Unencrypted PHI backups | n/a | n/a | §164.308(a)(7) | A.8.13 |

## API

Data Security endpoints live under the unified platform API (\`/api/v1\`, behind the BFF gateway).

\`\`\`http
# List data security findings
GET /api/v1/data-security/findings?severity=CRITICAL&classification=PII

# Get data stores with sensitive data
GET /api/v1/data-security/stores?has_sensitive_data=true&exposure=public

# Get the data flow graph from a specific source
GET /api/v1/data-security/flow?source_resource_uid={uid}
\`\`\`

Full schemas are in the [API reference](/docs/reference/api). Webhook delivery on new Critical DSPM findings can be configured under **Settings → Notifications**.

## FAQ

**Does Onam copy our data to scan it?**
No. Classification samples a small window using your read credential, returns only matched-pattern metadata, and discards the sample immediately. Bulk data never leaves your cloud account.

**How are false positives handled?**
Every classification carries a confidence score; low-confidence matches are flagged "possibly sensitive" instead of positively classified. You can mark a store, file, or column "not sensitive" with a documented justification — the suppression carries through every future scan.

**Can I exclude certain data stores from DSPM scanning?**
Yes, via tag-based exclusion (for example \`dspm:scan=false\`). Excluded stores still appear in inventory but are not classified or graded.

**How often is data re-classified?**
Once per scan cycle (daily by default). A typical account with 200 buckets and 50 databases completes the DSPM stage in 5–8 minutes.

**Can I use DSPM findings for residency compliance reports?**
Yes. Residency violations are tagged with the violated regulation and export as PDF audit evidence in one click.

## Next steps

- [Compliance](/docs/features/compliance) — how DSPM findings roll up into per-control pass rates
- [CIEM](/docs/features/ciem) — the identity side of "who can read this data"
- [Risk Quantification](/docs/features/risk-quantification) — what exposed data costs in dollar terms
- [Framework Coverage](/docs/compliance/frameworks) — the full framework catalog
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
| Unused service accounts with broad permissions | Medium | Cluster-wide grants unused for 90 days — shrink the entitlement footprint |
| Default service account with non-default bindings | Medium | Every pod in the namespace silently inherits the extra access |

> Worked example: ClusterRoleBinding \`dev-admin\` grants \`cluster-admin\` to service account \`default/app-runner\` in namespace \`production\` — a Critical finding. Suggested fix: create a least-privilege ClusterRole limited to the permissions the app actually used in the last 90 days, bind that, then remove the cluster-admin binding.

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
    slug: "features/iac-scanning",
    title: "IaC Scanning & SecOps",
    breadcrumb: "Features / IaC Scanning",
    body: `
Onam's SecOps engine scans **Infrastructure-as-Code templates, application code, and open-source dependencies** before they reach production — at pull-request time, in CI, and on demand. The goal is to catch security issues at the earliest, cheapest point in the SDLC: in the editor, before merge, before the pipeline deploys, before a real cloud resource exists.

This page covers the shift-left cost model, the five scan categories (SAST, IaC, SCA, DAST, secrets), language and template coverage, CI/CD integration with working configs, and the finding catalog.

![Shift-left IaC scanning pipeline](/diagrams/iac-scanning.svg)

## The Shift-Left Model

The further left you catch an issue, the cheaper the fix. These are industry averages from IBM's Cost of a Data Breach report and NIST's software cost estimation studies:

| Stage | Where the issue is found | Average cost to fix | Why the cost grows |
| --- | --- | --- | --- |
| Development | Developer's IDE / pre-commit hook | ~$80 | One person, one file, one edit |
| Code review | Pull-request review | ~$240 | Reviewer plus author context-switch |
| CI pipeline | Build / test / scan job | ~$960 | Pipeline minutes, re-runs, branch coordination |
| Staging | Deployed to staging | ~$7,600 | Test-data state and downstream system impact |
| Production | Live customer-impacting deployment | ~$7,600+ | Incident response, rollback, post-mortems |
| Post-breach | After a security incident | $4M+ | IBM 2024 average — detection, response, notification, fines |

Onam runs at every stage — IDE plugin, GitHub PR / GitLab MR comments, CI integration, and the unified posture dashboard. One rule catalog evaluates the same misconfiguration consistently across all stages, so a rule that fires in production CSPM also fires on the Terraform that would create it.

## Capabilities

Five scan categories ship out of the box. Enable them individually per repository or run them together in one integrated scan.

| Category | Acronym | Scope | Notes |
| --- | --- | --- | --- |
| Static Application Security Testing | SAST | Source code in 7 languages plus Kubernetes manifests | semgrep-based analysis plus dedicated per-language scanners · OWASP Top 10 · CWE-mapped |
| Infrastructure-as-Code scanning | IaC | Terraform · CloudFormation · ARM · Bicep · Helm · Kustomize · raw K8s YAML · Pulumi · Ansible · Dockerfile | 340+ Terraform rules plus per-format coverage |
| Software Composition Analysis | SCA | Open-source dependency CVEs · license compliance · transitive analysis · SBOM generation | All major language ecosystems |
| Dynamic Application Security Testing | DAST | Runtime fuzzing of HTTP APIs and web apps | 479 attack payloads · OWASP API Top 10 · injection and auth-bypass |
| Secrets detection | Secrets | Hardcoded credentials in any file | 120+ patterns — see below |

A typical PR scan completes in 30–90 seconds for a ~50K LOC repo. Monorepos of 1M+ LOC take 5–10 minutes; PR-webhook scans are incremental and only analyze changed files.

## SAST Language Coverage

SAST covers **seven languages**, each with a dedicated scanner plus shared semgrep rules, and additionally scans Kubernetes YAML manifests:

| Language | Frameworks and focus |
| --- | --- |
| Python | Django, Flask, FastAPI, SQLAlchemy |
| JavaScript / TypeScript | Node.js, React, Express, Next.js, NestJS |
| Java | Spring Boot, Spring MVC, Hibernate |
| Go | net/http, Gin, Echo, GORM |
| C# / .NET | ASP.NET Core, Entity Framework |
| C | Memory safety, buffer overflows |
| C++ | Memory safety, buffer overflows |
| Kubernetes YAML | Pod specs, RBAC, network policies |

## IaC Framework Coverage

A rule like "S3 bucket public access not blocked" fires identically against Terraform, CloudFormation, Pulumi, and Helm — wherever the template surfaces the misconfiguration. **The rule catalog is unified across template languages**, so there are not four rule sets to maintain.

![IaC framework coverage — Terraform, CloudFormation, Kubernetes, and other template families converging on one engine](/diagrams/feat-iac-frameworks.svg)

| Family | Variants supported | Notes |
| --- | --- | --- |
| Terraform / OpenTofu | AWS (200+ resources), Azure (150+), GCP (130+), Kubernetes provider | Module recursion supported · \`.tf\` and \`.tf.json\` |
| AWS CloudFormation | SAM, native CFN (YAML / JSON), CDK synth output | CDK is scanned post-synth, not the TypeScript / Python source |
| Kubernetes | Helm charts (\`.tgz\` plus \`values.yaml\` plus rendered manifests), Kustomize overlays and bases, raw YAML, CRDs | Helm rendering is performed by the scanner — pass the chart, not the rendered output |
| Other | Azure ARM and Bicep, Pulumi (Python / TypeScript), Ansible playbooks and roles, Dockerfiles / Containerfiles | Pulumi requires the synthesized state for full coverage |

## CI/CD Integration

First-class integrations ship for the most common CI systems. Each runs the same scanner with the same rule catalog — only the orchestration differs.

### GitHub Actions

\`\`\`yaml
# .github/workflows/onam-scan.yml
name: Onam Security Scan

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Onam IaC + SAST Scan
        uses: onam-io/secops-scan-action@v1
        with:
          api-key: \${{ secrets.ONAM_API_KEY }}
          scan-types: iac,sast,sca,secrets
          fail-on: CRITICAL,HIGH
          paths: |
            terraform/
            k8s/
            src/

      - name: Upload SARIF Results
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: onam-results.sarif
        if: always()
\`\`\`

The action scans IaC templates and application code, checks dependencies (SCA), detects secrets, fails the job on Critical or High findings, and uploads SARIF to the GitHub Security tab.

### GitLab CI

\`\`\`yaml
# .gitlab-ci.yml
onam-security-scan:
  stage: test
  image: onam/secops-scanner:latest
  script:
    - onam scan --type iac,sast,sca,secrets
                --api-key $ONAM_API_KEY
                --fail-on CRITICAL,HIGH
                --output sarif
  artifacts:
    reports:
      sast: onam-results.sarif
    when: always
  rules:
    - if: $CI_MERGE_REQUEST_IID
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
\`\`\`

### Jenkins

\`\`\`groovy
// Jenkinsfile
pipeline {
    agent any
    stages {
        stage('Onam Security Scan') {
            steps {
                sh '''
                    onam scan \\
                      --type iac,sast,sca,secrets \\
                      --api-key \${ONAM_API_KEY} \\
                      --fail-on CRITICAL,HIGH \\
                      --output junit \\
                      --output-file onam-results.xml
                '''
            }
            post {
                always {
                    junit 'onam-results.xml'
                }
            }
        }
    }
}
\`\`\`

Azure DevOps, CircleCI, Bitbucket Pipelines, and Buildkite use the same \`onam\` CLI.

## Finding Categories

Findings come in two main dimensions — SAST findings (application code) and IaC findings (infrastructure templates). Each carries severity, CWE / CIS mappings, and a remediation suggestion.

### SAST finding examples

| Finding | Severity | CWE | Language |
| --- | --- | --- | --- |
| SQL injection via f-string | Critical | CWE-89 | Python |
| Command injection via subprocess | Critical | CWE-78 | Python, Node.js |
| Hardcoded credentials | High | CWE-798 | All |
| Path traversal | High | CWE-22 | All |
| XSS via unescaped output | High | CWE-79 | JS/TS |
| Insecure deserialization | High | CWE-502 | Java, Python |
| SSRF via unvalidated URL | High | CWE-918 | All |
| JWT secret hardcoded | High | CWE-798 | All |
| Weak cryptography (MD5/SHA1) | Medium | CWE-327 | All |
| Missing CSRF protection | Medium | CWE-352 | Web frameworks |

### IaC finding examples

| Finding | Severity | Resource type |
| --- | --- | --- |
| S3 bucket with public ACL | Critical | \`aws_s3_bucket\` |
| Security group: SSH open to \`0.0.0.0/0\` | Critical | \`aws_security_group\` |
| RDS instance not encrypted | High | \`aws_db_instance\` |
| EKS node group with public endpoint | High | \`aws_eks_cluster\` |
| Privileged container in pod spec | High | Kubernetes Pod |
| \`cluster-admin\` binding in Helm chart | High | Kubernetes ClusterRoleBinding |
| Lambda function with admin role | High | \`aws_iam_role\` |
| Terraform state in unencrypted S3 | Medium | \`terraform_backend\` |
| Missing resource limits in K8s | Medium | Kubernetes Deployment |
| Docker image using \`latest\` tag | Medium | Dockerfile |

## Secrets Detection Patterns

120+ secret patterns across five categories. Each pattern combines a regex with an entropy or format check — high-entropy strings that match no known pattern are also flagged as "possible generic secret".

| Category | Patterns include | Why it's dangerous |
| --- | --- | --- |
| Cloud credentials | AWS access keys, GCP service account JSON, Azure client secrets, OCI API keys | Full account compromise |
| API keys | GitHub PAT, GitLab PAT, Slack, Stripe, Twilio, SendGrid, OpenAI, Anthropic | Direct service abuse and billing fraud |
| Database credentials | PostgreSQL / MySQL / MongoDB connection strings, Redis URLs with auth | Direct data access |
| Certificates and keys | RSA / EC private key PEM, PKCS12, SSH private keys | TLS termination and client-cert bypass |
| Generic patterns | High-entropy strings, \`password=\` and \`secret=\` assignments, bearer tokens in code | Catch-all for unknown formats |

> Pre-commit integration is available via \`pre-commit-onam-secrets\` — the same pattern set runs locally on every commit and blocks secrets before they ever reach the remote. Once a secret is pushed, rotating it is the only safe remediation; scrubbing git history is not enough.

## Output Formats

| Format | Use case |
| --- | --- |
| SARIF | GitHub Security tab, VS Code, any SARIF-compatible tool — recommended default |
| JUnit XML | Jenkins, Azure DevOps test reports |
| JSON | API consumption, custom dashboards, SIEM ingestion |
| HTML | Human-readable report for non-developer stakeholders |
| PDF | Audit and compliance evidence |

## API

\`\`\`http
# List SecOps findings for a repository
GET /api/v1/secops/findings?repo=github.com/org/repo&severity=CRITICAL

# Trigger a scan on a repository
POST /api/v1/secops/scan
Content-Type: application/json
{"repo_url": "https://github.com/org/repo", "branch": "main", "scan_types": ["iac", "sast", "sca"]}

# Get scan results by scan ID
GET /api/v1/secops/scans/{scan_id}/findings
\`\`\`

Webhook delivery on every completed scan can be configured under **Settings → Notifications**.

## FAQ

**How does SecOps integrate with branch protection?**
The PR / MR integration posts a status check you can require in branch protection. Critical or High findings fail the check, blocking merge until resolved or suppressed.

**Can I suppress a finding I've reviewed and accepted?**
Yes. Suppressions are file-and-line-anchored, require a documented justification, follow the file if it moves, and expire after 90 days by default unless renewed.

**Does SCA scan dependencies recursively?**
Yes — full transitive analysis. A vulnerability in a dependency-of-a-dependency surfaces with its full path, so you can decide whether to bump the direct dependency or wait upstream.

**Can I run SecOps on monorepos?**
Yes. Path-based scoping scans only changed paths on PRs, with per-path rule profiles (stricter for \`production/\` than \`playground/\`).

**What about AI-generated code?**
SAST treats it identically to human-written code. AI-generated code shows a slightly higher rate of hardcoded credentials and incomplete input validation — the same catalog catches both.

**Can I use SecOps in air-gapped environments?**
Yes — on-premises deployment on Enterprise plans. The scanner runs entirely in your network, with rule updates pulled via a one-way mirror.

## Next steps

- [Vulnerability Management](/docs/features/vulnerability-management) — the runtime side of the same CVE data
- [Container Security](/docs/features/container-security) — what happens to Helm and pod-spec issues after deploy
- [Integration catalog](/docs/reference/integration-catalog) — every supported CI, ticketing, and notification integration
- [CSPM](/docs/features/cspm) — the production-side rule catalog that mirrors these IaC rules
`,
  },
  {
    slug: "features/compliance",
    title: "Compliance",
    breadcrumb: "Features / Compliance",
    body: `
Onam's Compliance engine turns raw security findings into audit-ready compliance posture: every finding is mapped to the controls it violates across **78 regulatory frameworks**, every control gets a pass rate computed from live scan data, and every framework gets a 0–100 score you can track, export, and hand to an auditor.

This page explains how the mapping works, how per-control pass rates and framework scores are computed, and how to generate reports. For the full framework catalog and per-framework coverage tables, see [Framework Coverage](/docs/compliance/frameworks).

![The compliance view in the Onam console (demo account)](/screenshots/screenshot-compliance.png)

## From Findings to Scores

Compliance runs as a pipeline stage after every scan: the Check engine and the domain engines (network, data, container, IAM) produce findings, and the Compliance engine aggregates them into control-level evidence. No separate "compliance scan" is needed — the same scan that finds a public bucket also updates your PCI-DSS score.

![Compliance scoring flow — findings mapped to controls, aggregated into pass rates and framework scores](/diagrams/compl-scoring-flow.svg)

1. **Load.** The engine reads every finding from the completed scan run — misconfigurations, plus domain findings from data security, network, container, and IAM.
2. **Map.** Each rule ID is resolved against the rule-to-control mapping catalog. One rule typically cites controls in several frameworks at once, so a single check produces evidence for many frameworks simultaneously.
3. **Aggregate.** Findings are grouped by framework, control, and resource, and pass/fail counts are computed per control.
4. **Score.** Per-control pass rates roll up into a weighted 0–100 compliance score per framework.
5. **Report.** The reporter assembles deduplicated findings, evidence, and asset snapshots into a stored report; exporters produce JSON, CSV, Excel, and PDF.

## Control Mapping

The mapping catalog links each of Onam's 10,000+ rules to the specific controls it evidences. Because the mapping is many-to-many, one failed check propagates to every framework that cares about it:

| Example finding | Frameworks cited |
| --- | --- |
| S3 bucket public access not blocked | CIS AWS 2.1.4 · PCI-DSS Req 1.3 · GDPR Art. 32 · ISO 27001 A.8.20 |
| CloudTrail not enabled in all regions | CIS AWS 3.1 · NIST CSF DE.AE · SOC 2 CC7.2 |
| RDS storage unencrypted | PCI-DSS Req 3.4 · HIPAA §164.312(a) · ISO 27001 A.8.24 |

Every finding detail page in the console shows its full list of framework citations, and every control page lists the exact resources that passed and failed.

## Pass Rates and Scores

Each control's pass rate is computed from the resources evaluated against it in the latest scan:

| Control status | Meaning |
| --- | --- |
| Pass | Every evaluated resource passed every check mapped to the control |
| Fail | At least one resource failed a mapped check — the failing resources are listed on the control |
| Not applicable | No resources of the relevant type exist in the scanned scope |

The framework score (0–100) is a weighted rollup of its control pass rates. Scores are recomputed on every scan and recorded historically, so the trends view shows whether posture is improving release over release — per framework, per account, and per cloud.

> Automated scanning evaluates technical controls — encryption, logging, access policies, network exposure. Frameworks also contain administrative and process controls (security training, vendor management) that no scanner can assess. Framework reports mark which controls are auto-assessed so auditors see exactly what the score covers.

## Framework Catalog

The catalog covers **78 frameworks**, including CIS Benchmarks (AWS, Azure, GCP — multiple versions), NIST CSF 2.0, NIST 800-53 R4/R5, NIST 800-171, PCI-DSS v4.0/4.0.1, HIPAA and HITRUST CSF v11.3, ISO 27001/27002/27017 (2022), SOC 2, GDPR, NIS2, the EU AI Act, DORA, FedRAMP High and Moderate, CMMC 2.0 L2/L3, SWIFT CSCF, RBI ITF, APRA CPS 234, UK NCSC CAF, Cyber Essentials, LGPD, SOX, and CSA CCM v4.

Representative control counts:

| Framework | Controls evaluated |
| --- | --- |
| CIS AWS Foundations Benchmark | 58 controls |
| ISO/IEC 27001:2022 | 93 controls |
| NIST CSF | 108 subcategories |
| NIST 800-53 R5 | 20 control families |
| PCI-DSS v4.0 | 12 requirements |
| HIPAA Security Rule | 18 standards |
| GDPR | 24 articles |
| SOC 2 | 5 trust service criteria |
| FedRAMP | 325 controls |

The full list with per-framework coverage tables is on [Framework Coverage](/docs/compliance/frameworks). Custom rules built in the Rule Builder carry their own framework mappings, so organization-specific policies feed the same scores.

## Reports and Exports

Four report shapes cover the audiences that consume compliance data:

| Report | What it contains | Audience |
| --- | --- | --- |
| Executive dashboard | Cross-framework summary — score per framework, deltas since last scan, worst controls | Leadership, board reporting |
| Framework report | Control-by-control breakdown for one framework, with pass rates and failing resources | Compliance team, auditors |
| Resource drilldown | Every control citation for a single resource | Engineers fixing findings |
| Enterprise report | Full audit package — deduplicated findings, evidence, asset snapshots | External audit submission |

All reports export as **PDF, Excel, CSV, and JSON**. You can scope any report to specific frameworks, cloud accounts, or providers, and optionally include passing controls for full-evidence audits.

## Running Compliance Reports

Reports generate automatically after every scheduled scan. You can also generate ad-hoc reports at any time — pick a scan run, select frameworks, and export:

1. Open **Compliance** in the Onam console and select a framework.
2. Review the per-control breakdown — each failed control lists its failing resources and the finding that caused the failure.
3. Fix findings (or suppress with justification) and re-scan; the score updates on the next run.
4. Export the framework report as PDF or Excel for evidence.

## API

\`\`\`http
# List all supported frameworks with metadata
GET /api/v1/compliance/frameworks

# Full report for one framework
GET /api/v1/compliance/framework/{framework_id}/report

# Executive dashboard across frameworks
GET /api/v1/compliance/dashboard

# Historical score trends
GET /api/v1/compliance/trends
\`\`\`

Report exports accept a format parameter (\`pdf\`, \`csv\`, \`excel\`, or \`json\`). Full schemas are in the [API reference](/docs/reference/api).

## FAQ

**How often do scores update?**
After every scan (typically daily), plus whenever you trigger an ad-hoc scan. Every score snapshot is retained for trend reporting.

**Can I score a single account or business unit?**
Yes. Reports scope by cloud account, provider, or account group — useful when different business units are audited against different frameworks.

**Do custom rules affect compliance scores?**
Yes, when you assign framework mappings to them in the Rule Builder. Unmapped custom rules produce findings but do not change framework scores.

**Is a 100 score the same as being certified?**
No. The score means every automatically-assessed technical control passed in the latest scan. Certification also requires process controls and an accredited auditor — Onam's exports are designed to be the technical-evidence package for that audit.

## Next steps

- [Framework Coverage](/docs/compliance/frameworks) — the full 78 framework catalog with coverage tables
- [CSPM](/docs/features/cspm) — the rule registry that generates the underlying findings
- [Data Security](/docs/features/data-security) — where GDPR / PCI / HIPAA data findings come from
- [Book a demo](/request-demo) — see your framework scores on a live connected account
`,
  },
  {
    slug: "features/risk-quantification",
    title: "Risk Quantification (FAIR)",
    breadcrumb: "Features / Risk Quantification",
    body: `
Onam's Risk engine converts security findings into dollar-denominated financial risk using **FAIR (Factor Analysis of Information Risk)** — the only internationally standardized quantitative model for information risk. The output is a business-language view: total financial exposure, the top risks ranked by dollar impact, and the remediation actions that reduce the most exposure per engineering hour.

This page explains the FAIR formula chain, how Onam calibrates each factor from live scan data, the multiplier and cost tables the model uses, and where the engine runs in the platform pipeline.

![The risk view in the Onam console (demo account)](/screenshots/screenshot-risk.png)

## The FAIR Model

FAIR decomposes risk into frequency and magnitude:

\`\`\`
Risk = LEF × LM
LEF  = TEF × Vulnerability      (Loss Event Frequency)
LM   = Primary + Secondary Loss (Loss Magnitude)
\`\`\`

| Factor | Question it answers | How Onam calibrates it |
| --- | --- | --- |
| Threat Event Frequency (TEF) | How often does a threat actor attempt the action? | CISA KEV flags and EPSS exploitation probabilities |
| Vulnerability | Given an attempt, how likely does it succeed? | Finding type, effective exposure from the Network engine, attack-path reachability |
| Primary Loss | Direct cost of a successful event | IBM/Ponemon per-record breach costs, IR hours, notification counts |
| Secondary Loss | Indirect cost — fines, churn, reputation | The fine schedules of the frameworks in your compliance configuration |

## Where the Engine Runs

Risk Quantification runs as **Layer 4** of the platform — after discovery, checks, and the domain engines have all completed, so it prices the finished picture rather than raw signals:

| Stage | What happens | Output |
| --- | --- | --- |
| 1. ETL | Pulls Critical and High findings from every engine database once the scan completes | Normalized risk input set |
| 2. Evaluate | Applies the FAIR computation per finding — exposure, threat probability, loss, multipliers | P50 / P90 exposure per finding |
| 3. Report | Writes portfolio rollups to \`risk_report\`, \`risk_summary\`, and \`risk_trends\` | Dashboard, trends, and API views |

Scores recalculate after every scan (typically daily) and whenever the KEV or EPSS feeds update.

## Per-Finding Computation

### 1. Exposure surface

- Is the affected resource internet-exposed? (from the [Network Security](/docs/features/network-security) engine)
- What is the blast radius if compromised? (from the [Attack Path](/docs/features/attack-path) engine)
- Is this a crown-jewel asset? (user-designated or inferred from data classification)

### 2. Threat probability

- Is this finding type actively exploited in the wild? (CISA KEV flag)
- What is the exploitation probability in the next 30 days? (EPSS score)
- Is there a known PoC exploit? (NVD / exploit-db correlation)

### 3. Loss estimation

Primary loss builds from four components:

| Component | Basis |
| --- | --- |
| Incident response | $150/hour × estimated IR hours by breach type |
| Data recovery | Per-record cost × affected record estimate |
| Breach notification | $5/notification × estimated notification count |
| Business interruption | Daily revenue × estimated downtime |

Per-record costs come from the IBM Cost of a Data Breach 2024 benchmarks, selected by your industry:

| Industry | Cost per record |
| --- | --- |
| Healthcare | $10.93 |
| Financial services | $6.08 |
| Technology | $4.88 |
| Retail | $3.28 |
| All other industries (default) | $4.45 |

Secondary loss uses the fine schedules of the frameworks in your compliance configuration:

| Framework | Maximum exposure |
| --- | --- |
| GDPR | €20M or 4% of global annual turnover |
| HIPAA | $1.9M per violation category per year |
| PCI-DSS | $5,000–$500,000 per month until compliant |
| SOX | $5M plus criminal liability for willful violations |

## Multipliers

Three multiplier systems adjust Loss Magnitude to your environment.

**Regulatory multipliers** — when a finding touches regulated data, the highest single applicable multiplier applies (they do not stack):

| Regulation | Multiplier |
| --- | --- |
| GDPR | ×1.5 |
| SOX | ×1.4 |
| HIPAA | ×1.3 |
| PCI-DSS | ×1.2 |
| CCPA, APPI, PDPA, PIPEDA | ×1.1 |

**Data-sensitivity multipliers** — driven by the [DSPM classification](/docs/features/data-security) of the affected store, and overridable per tenant:

| Data classification | Multiplier |
| --- | --- |
| Restricted | ×3.0 |
| Confidential | ×2.0 |
| Internal | ×1.0 |
| Public | ×0.1 |

**Crown-jewel multipliers** — assets designated as crown jewels reflect that the same breach costs far more on a production system than on a dev resource:

| Crown jewel type | Multiplier |
| --- | --- |
| Payment processing service | 5× |
| Secrets / credentials store | 4× |
| Production database | 3× |
| PII-containing data store | 3× |
| Business-critical API | 2× |

> Multipliers apply to the Loss Magnitude side of the equation only — they never inflate the probability side. A public dev bucket with test data and a public prod bucket with PHI have similar LEF but very different LM, which is exactly what the dollar figures should show.

## Output Metrics

Per finding:

- **P50 financial exposure** — median loss estimate
- **P90 financial exposure** — 90th-percentile loss estimate, the worst plausible outcome
- **Risk Reduction Value** — exposure eliminated by fixing this finding
- **Blast radius** — assets, users, and data records at risk

Per portfolio:

- **Total exposure** — aggregate risk across all open findings
- **Top-10 risks** — ranked by P50 exposure
- **Risk trend** — total exposure over the last 90 days
- **Exposure by domain** — posture, identity, code, and vulnerability risk

## Remediation Prioritization

The engine outputs a remediation queue ranked by **Risk Reduction Value per fix**:

1. The ten fixes with the highest risk-reduction value, each with estimated engineering effort (T-shirt sized S/M/L) and the dollar exposure eliminated.
2. The minimum-cut fix — the single change that collapses the most attack paths and removes the most exposure, cross-referenced with the Attack Path engine's choke-point ranking.
3. A business-case summary for engineering: "these 5 fixes eliminate $12M in potential exposure and take 3 engineering days."

## API

\`\`\`http
# Blast radius for the current environment
GET /api/v1/risk/blast-radius

# Crown-jewel assets and their exposure
GET /api/v1/risk/crown-jewels
\`\`\`

Full schemas are in the [API reference](/docs/reference/api).

## FAQ

**Can I calibrate the model with our own financial data?**
Yes. Provide annual revenue, total data records processed, and breach-cost assumptions from your cyber-insurance policy — these override the industry-average defaults and sharpen the estimates for your organization.

**Does this replace a formal risk assessment?**
No. Onam Risk Quantification is continuous automated estimation, designed to drive prioritization and board reporting. For SOC 2, ISO 27001, or regulatory audits, a formal FAIR assessment by a practitioner is still required.

**How often are risk scores updated?**
After every scan (typically daily) and whenever the KEV or EPSS databases update — both are daily feeds from CISA and FIRST.org.

## Next steps

- [Attack Path](/docs/features/attack-path) — the reachability and choke-point data behind blast radius
- [Vulnerability Management](/docs/features/vulnerability-management) — the KEV and EPSS signals that calibrate TEF
- [Compliance](/docs/features/compliance) — the framework configuration that selects fine schedules
- [Book a demo](/request-demo) — see your estate's exposure in dollars
`,
  },
];
