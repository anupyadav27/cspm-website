# Data Security Posture Management (DSPM)

DSPM answers two questions security teams cannot answer manually at cloud scale: **where is your sensitive data, and is it properly secured?** The platform discovers every data store across cloud storage, databases, and data pipelines — managed AND shadow stores — classifies the data inside them, and grades each one for encryption, access control, retention, and logging. You get a prioritized list of "where PII / PCI / PHI is at risk and what to do about it" instead of a static spreadsheet that's stale the moment it ships.

<img src="/diagrams/data-security.svg" style="width:100%;max-width:920px;border-radius:10px;" alt="Data security posture management" />

**Why DSPM matters in 2026:** the average enterprise has **30–60% more data stores than its security team knows about**, and the bulk of recent regulated-data breaches have come from "shadow" data — buckets, snapshots, and dev databases that nobody owned. DSPM is what turns "we think we know where customer data lives" into a continuous, auditable inventory.

---

## What DSPM Solves

Every cloud organization runs into the same five data-security failure modes. They look different on the surface but they share a single root cause: **the rate at which new data stores are created is faster than the rate at which they are reviewed, classified, and secured**.

| Failure mode | What it looks like | Why it happens |
|---|---|---|
| **Shadow data stores** | An S3 bucket created by a developer for a one-off task that quietly accumulates production data | Bucket creation is a single API call; governance is a multi-step process |
| **Over-exposed data** | A public S3 bucket with PII inside, discovered by a third-party security researcher | A misclick in the bucket settings, a misconfigured CloudFront origin, or copied IAM from a public-asset bucket |
| **Unencrypted sensitive data** | An RDS instance holding PII without encryption at rest | Default-encryption was opt-in for years; legacy databases predate the default-on era |
| **Stale sensitive data** | An old backup bucket with customer data from a deprecated product, never purged | Lifecycle policies are easy to forget when the original owner leaves the team |
| **Misconfigured access** | Developers with direct read access to the production customer database | Convenience during incident response that nobody removed afterward |

The common thread is **lack of continuous visibility**. DSPM closes that gap by re-evaluating every data store on every scan — managed stores, shadow stores, backups, snapshots, and the data pipelines that move data between them.

---

## How DSPM Works

DSPM runs as a four-stage pipeline against every data store in your connected cloud accounts: **Discover** what exists, **Classify** what's inside, **Evaluate** the security controls, **Emit** prioritized findings. The pipeline is fully agentless — no databases need installing, no inline scanners, no tap on your network.

<img src="/diagrams/feat-datasec-pipeline.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="DSPM 4-stage pipeline — Discover → Classify → Evaluate → Findings" />

### 1. Discover — find every data store

The platform enumerates **every data store reachable from your read-only credential**, including ones nobody is tracking:

- **Object storage** — every S3 bucket, Azure Blob container, GCS bucket, OCI Object, AliCloud OSS bucket, IBM COS bucket. Including buckets that have never been touched in a year.
- **Managed databases** — RDS (every engine), Azure SQL, Azure DB for Postgres / MySQL, Cosmos DB, Cloud SQL, BigQuery, DynamoDB, Redshift, Synapse, and the rest.
- **Shadow stores** — EC2 instances running self-managed databases, attached EBS volumes containing data files, RDS snapshots that became orphaned. Detected through pattern matching on instance metadata, port scans (read-only via security group inspection), and data-file fingerprinting.

A typical AWS account has **2–3× more shadow stores than the security team is tracking**. Surfacing them is half the value of DSPM.

### 2. Classify — identify what's sensitive

For every data store discovered, the platform takes representative samples and classifies the content. **The platform never copies your bulk data** — it samples on a small, statistically valid window using your read credential, returns only matched-pattern metadata, and discards the sampled data immediately.

| Data class | Patterns detected |
|---|---|
| **PII** | Full name, email, phone, address, SSN, national ID, date of birth, IP-with-name, passport numbers |
| **PCI** | PAN (with Luhn validation), CVV, cardholder name, expiry date, bank account numbers |
| **PHI** | Medical record numbers, patient names paired with diagnoses, prescriptions, insurance IDs, lab results |
| **Confidential business** | Source code patterns, M&A keywords, salary tables, legally privileged document markers |
| **Credentials** | API keys (AWS, GCP, Stripe, GitHub, etc.), private keys, password fields, connection strings with embedded creds |

Classification combines **regex patterns**, **format validators** (Luhn for cards, mod-11 for SSNs), and **ML models** for ambiguous cases. Each classification carries a confidence score; below a configurable threshold the data is flagged "possibly sensitive" rather than positively classified.

### 3. Evaluate — check the security controls

For every store that contains sensitive data, the platform evaluates four control axes:

- **Encryption at rest** — is a KMS-managed key in use? Is rotation enabled? Is the key shared across more resources than it should be?
- **Access controls** — is the store public? Reachable from external accounts? Is the access policy broader than the workload actually needs (CIEM signal feeds in here)?
- **Retention** — is a lifecycle policy in place? Is data older than the policy window flagged for deletion?
- **Logging** — are access logs enabled? Are they tamper-proof? Can you reconstruct who read what for the last 90 days?

Plus a fifth check on regulated data: **residency**. PCI cardholder data outside the approved geographic region is flagged immediately.

### 4. Findings — prioritized, framework-mapped output

Each finding includes the affected data store, the data classification, the failed control, the suggested fix, the framework citations (GDPR, PCI, HIPAA, ISO, etc.), and the MITRE ATT&CK technique if applicable. Critical findings (public + sensitive data) page on-call.

<img src="/diagrams/p-datasec.svg" style="width:auto;max-width:100%;display:block;margin-left:auto;margin-right:auto;border-radius:10px;margin-bottom:16px;" alt="Onam CSPM — DSPM platform view showing sensitive data discovery, classification, and exposure risk dashboard" />

---

## Data Classification

The platform classifies data into **five sensitivity categories**. Each category maps to specific compliance regulations and triggers different finding severities. You can extend the catalog with custom data classes (e.g. "Customer Contract Numbers") through the **Settings → DSPM → Custom Patterns** UI.

| Category | Examples | Compliance trigger | Default severity if exposed |
|---|---|---|---|
| **PII — Personal Data** | Full name, email, phone, address, SSN, DOB, government IDs, IP-with-name, passport numbers | GDPR · CCPA · LGPD · PIPL | CRITICAL |
| **PCI — Payment Data** | Card PAN, CVV, expiry, cardholder name, bank account numbers | PCI-DSS v4.0 | CRITICAL |
| **PHI — Health Data** | Medical record IDs, patient name + diagnosis, prescriptions, health insurance IDs, lab results | HIPAA · HITECH · GDPR | CRITICAL |
| **Confidential — Business** | Source code, M&A documents, salary/comp data, legal-privileged documents | NDA exposure · trade-secret risk | HIGH |
| **Credentials — High Risk** | API keys, plaintext passwords, private keys, connection strings with creds | Universal — every framework | CRITICAL |

**Why credentials are graded CRITICAL across every category** — a leaked credential cascades. Once an attacker has an API key, they can pivot into the system that key authorizes, exfiltrate more data, and create more credentials. We treat credential leakage as the worst-case finding category by default.

**Customizing the classification taxonomy** is supported on Pro and Enterprise plans. Common additions: customer-specific document IDs, regulatory program-specific markers (FERPA student records, ITAR export-controlled content, FedRAMP CUI markings), and proprietary product identifiers.

---

## Data Exposure Levels

Every classified data store is rated against **four exposure tiers**. The combination of *sensitivity* (PII / PCI / PHI / etc.) and *exposure* (Public / External / Internal / Restricted) determines the finding severity. A public data store with PII is the worst-case combination; a restricted data store with credentials is still flagged but at lower severity.

<img src="/diagrams/feat-datasec-exposure-levels.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="Data exposure levels — Public, External, Internal, Restricted with platform response" />

**Reading the exposure ladder top-to-bottom (worst to best):**

| Level | Who can reach it | Default platform response |
|---|---|---|
| **🔴 Public** | Anyone on the internet — no authentication required | CRITICAL finding if data is sensitive — immediate alert on call |
| **🟠 External** | Authenticated users outside your organization (other AWS accounts, SaaS partners, contractors with named federations) | HIGH finding — trust review prompted; likely scope-reduction needed |
| **🟡 Internal** | Anyone authenticated within your tenant | MEDIUM finding if scope is broader than the workload needs |
| **🟢 Restricted** | Only specific named principals — least-privilege enforced | No finding — this is the desired posture target |

**The combination matrix** that determines severity:

| Sensitivity ↓ / Exposure → | Public | External | Internal | Restricted |
|---|:---:|:---:|:---:|:---:|
| PII / PCI / PHI | 🔴 CRITICAL | 🟠 HIGH | 🟡 MEDIUM | ✓ no finding |
| Confidential — Business | 🔴 CRITICAL | 🟠 HIGH | 🟡 MEDIUM | ✓ no finding |
| Credentials | 🔴 CRITICAL | 🔴 CRITICAL | 🟠 HIGH | 🟡 MEDIUM |
| Public-class data | 🟢 no finding | 🟢 no finding | 🟢 no finding | 🟢 no finding |

**Public-class data** (intentionally public assets like website images, public docs, marketing content) never produces a finding — the platform learns the pattern from your own data classification policy and stops alerting on intentionally-public buckets after the first scan you confirm them on.

---

## Supported Data Stores

DSPM coverage spans the major cloud data services. Both **fully managed** stores (RDS, Cosmos, Cloud SQL, BigQuery, etc.) and **self-managed** stores running on cloud compute are detected.

| Category | Services covered |
|---|---|
| **Object Storage** | AWS S3, Azure Blob Storage, GCP Cloud Storage, OCI Object Storage, AliCloud OSS, IBM COS |
| **Managed Relational DB** | AWS RDS (all engines: MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, Aurora), Azure SQL, Azure Database for PostgreSQL/MySQL, GCP Cloud SQL, OCI DB Systems |
| **Managed NoSQL** | DynamoDB, Cosmos DB, Firestore, Bigtable, AliCloud Table Store |
| **Data Warehouses** | Amazon Redshift, Azure Synapse, BigQuery, Snowflake (via connector) |
| **Streaming** | Amazon Kinesis, Azure Event Hub, GCP Pub/Sub |
| **Secrets & Config** | AWS Secrets Manager, Azure Key Vault, GCP Secret Manager (metadata only — never reads secret values) |
| **Self-managed (shadow)** | Postgres / MySQL / MongoDB / Redis on EC2 / Azure VM / GCE / OCI Compute, EBS / Azure Disk / GCE PD with attached data, RDS / Aurora snapshots, AMIs / managed images with embedded data |

**Snowflake** is supported via a read-only connector that you authorize on the Snowflake side — the platform does not require Snowflake credentials in shared infrastructure. **Databricks** support is on the roadmap for Q3 2026.

---

## Key DSPM Findings

The ten most-encountered DSPM findings across customer environments. Default severities reflect the worst-case impact assumption; you can re-grade per finding type in **Settings → DSPM → Severity Policy**.

| Finding | Severity | Description |
|---|---|---|
| Public S3 bucket contains PII | CRITICAL | Bucket accessible without auth, contains personal data |
| RDS instance with PII — no encryption at rest | CRITICAL | Sensitive data stored unencrypted on disk |
| Database with PII — public endpoint | CRITICAL | Database listening on public IP, no IP allowlist |
| Bucket with PII — no access logging | HIGH | No audit trail for who read the data |
| Over-privileged access to PII store | HIGH | Developers / shared roles with direct prod-data read |
| Backup bucket with PII — no lifecycle policy | HIGH | Sensitive data not deleted per retention schedule |
| PCI data in non-compliant region | HIGH | Cardholder data stored outside approved geography |
| PHI data with unencrypted backups | HIGH | HIPAA violation — automatic backups not encrypted |
| Secrets found in object storage | HIGH | API keys or passwords stored as objects in S3 / Blob |
| Stale PII data — not accessed in 1+ year | MEDIUM | Data exists beyond likely retention requirement |

Each finding includes the affected resource, sample matched-pattern metadata (never the data itself), suggested remediation, and the framework citations (GDPR Art. 32, PCI Req 3.4, HIPAA §164.312, etc.).

---

## Data Flow Analysis

Sensitive data rarely lives in just one place. It moves — through ETL pipelines, backup jobs, analytics exports, and BI tools. **A secure source database means nothing if the downstream pipeline lands the data in a public bucket.** DSPM follows the flow.

<img src="/diagrams/feat-datasec-flow-example.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="Data flow analysis — PII from secure RDS source spreading through 4 downstream data stores with different exposure levels" />

**Reading the worked example:**

A production RDS instance is configured securely — encrypted at rest, VPC-only access, audit logging on. By itself, this is the desired state. But the data does not stay in RDS. Three downstream pipelines move it to other stores, each with its own posture:

| Hop | Destination | Posture | Finding |
|---|---|---|---|
| ETL pipeline → | **Staging S3 bucket** | 🔴 PUBLIC, no encryption, no logging | **CRITICAL — PII exposed to internet** |
| Backup job → | **S3 backup bucket** | 🟠 No lifecycle policy, stale data 18+ months | **HIGH — retention violation** |
| Analytics export → | **Redshift Data Warehouse** | 🟡 Broad read access, 47 users, weak access logs | **MEDIUM — over-privileged access** |
| Redshift → BI tool | **Tableau / Power BI** | 🟡 External viewer accounts, no MFA | **MEDIUM — external exposure** |

**The platform automatically traces these flows** by reading IAM permissions (which identities can read from which source), Lambda / Glue / Data Factory / Dataflow definitions (which pipelines connect what), and snapshot / backup configuration (which destinations get scheduled copies). Every downstream store inherits the source's data classification — when sensitive data lands in a less-secure store, that's the finding.

**Why this matters more than point-in-time scans:** scanning each store in isolation misses the fact that data moves. A weekly DSPM scan on the production RDS in isolation says "this DB is secure" — and is misleading because the same data is sitting in a public staging bucket downstream. Flow analysis is what catches that.

---

## Compliance Mapping

DSPM findings map directly to the data-protection clauses in every major regulation. One finding usually triggers controls in three or more frameworks at once.

| Finding type | GDPR | PCI-DSS | HIPAA | ISO 27001 |
|---|---|---|---|---|
| Public PII exposure | Art. 32 | Req 1.3 | §164.312(e) | A.8.20 |
| Unencrypted PII at rest | Art. 32 | Req 3.4 | §164.312(a) | A.8.24 |
| Missing access logging | Art. 30 | Req 10.2 | §164.312(b) | A.8.15 |
| Over-privileged data access | Art. 5(f) | Req 7.1 | §164.312(a) | A.8.3 |
| No data retention policy | Art. 5(e) | Req 3.1 | §164.530(j) | A.8.10 |
| Data residency violation | Art. 44–50 | Req 3.5 | n/a | A.5.34 |
| Unencrypted PHI backups | n/a | n/a | §164.308(a)(7) | A.8.13 |

The platform shows you the **per-framework citation** on every finding, and the [Compliance page](/docs/compliance/framework-coverage/) rolls these up into per-framework scores.

---

## API

The DSPM API is part of the unified platform API. All endpoints require an authenticated session and are scoped to your tenant.

```http
# List data security findings
GET /gateway/api/v1/datasec/findings?severity=CRITICAL&classification=PII

# Get data stores with sensitive data
GET /gateway/api/v1/datasec/stores?has_sensitive_data=true&exposure=public

# Get the data flow graph from a specific source
GET /gateway/api/v1/datasec/flow?source_resource_uid={uid}

# DSPM posture summary (rolled-up score across the tenant)
GET /gateway/api/v1/views/datasec
```

Full request / response schemas in the [API Reference](/docs/reference/api-reference/). Webhook delivery on new CRITICAL DSPM findings can be configured under **Settings → Notifications**.

---

## Frequently Asked Questions

**Does the platform copy our data to scan it?**
No. Classification samples a small, statistically valid window using your read credential, returns only matched-pattern metadata to the platform, and discards the sampled data immediately. Bulk data never leaves your cloud account.

**How does the platform handle false positives?**
Every classification carries a confidence score. Below a configurable threshold the data is flagged "possibly sensitive" rather than positively classified. You can mark a specific data store, file, or column as "not sensitive" with a documented justification — the suppression carries through every future scan.

**Can I exclude certain data stores from DSPM scanning?**
Yes. Tag-based exclusion is supported (e.g. `dspm:scan=false`). Excluded stores still appear in the inventory but are not classified or graded.

**How often does the platform re-classify data?**
Default is once per scan cycle (daily). Sample-based classification is fast — a typical AWS account with 200 buckets and 50 databases completes the DSPM stage in 5–8 minutes.

**Does DSPM cover Snowflake or Databricks?**
Snowflake is supported via a read-only connector you authorize on the Snowflake side. Databricks support is on the roadmap for Q3 2026.

**Can I use DSPM findings in my data residency compliance reports?**
Yes. Residency violations (PCI data in non-compliant region, GDPR data outside the EU, etc.) are tagged with the violated regulation and exportable as PDF audit evidence with one click.

---

*Last updated: 2026-05-09*
*For questions: support@onam.io*
