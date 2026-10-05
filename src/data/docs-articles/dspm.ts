import type { DocArticle } from "./types";

/**
 * DSPM documentation section (/docs/dspm/*).
 *
 * Ground truth: threat-engine engines/datasec (providers/*.py analyze(),
 * posture_signals.py, tech_resource_classifier.py, edge_signals/writer.py,
 * input/inventory_reader.py), shared/api_gateway/bff/datasec.py (lineage
 * chains), engines/database-security and engines/encryption-security.
 * Classification is metadata-based. Do not add a claim here that those files
 * do not support, and do not add a product number that is not `status: cleared`
 * in marketing/facts/product.yaml.
 *
 * The first paragraph of each body becomes the page's meta description
 * (descriptionFromMarkdown, 155 chars) — keep it short and self-contained.
 */
export const articles: DocArticle[] = [
  {
    slug: "dspm/overview",
    title: "DSPM overview",
    breadcrumb: "Data Security (DSPM) / Overview",
    body: `
DSPM in Onam Security: find every cloud data store, label it from metadata, and see how it is exposed, who reaches it and where its data flows.

Data security posture management answers three questions continuously rather than once before an audit: **what data do we hold, where is it, and how exposed is it?** Onam's DSPM runs inside every scan, alongside posture, identity and attack-path analysis, and writes its results onto the same security graph.

![How DSPM works — data stores, discovery, metadata classification, the access and exposure join, findings](/diagrams/dspm-pipeline.svg)

## The five stages

| Stage | What happens | Read more |
| --- | --- | --- |
| 1. Data stores | Object storage, managed databases and warehouses, streams, Kubernetes secrets and ConfigMaps, and self-hosted databases you onboard | [Coverage by cloud](/docs/dspm/coverage) |
| 2. Discover | The posture scan records each store and its settings: encryption, policies, ACLs, public-access block, logging, versioning, backup, region, relationships | [Discovery](/docs/dspm/discovery) |
| 3. Classify | Names, descriptions, tags, database and schema names become PII, PHI, PCI, financial and confidential labels. Contents are not read | [Classification](/docs/dspm/classification) |
| 4. Join | Public grants, cross-account grants, observed access, encryption and keys, attack paths | [Access mapping](/docs/dspm/access-mapping) |
| 5. Findings | Per store, every scan: classification, encryption, access, residency, logging, lifecycle, lineage and a 0–100 governance score | [Findings reference](/docs/dspm/findings-reference) |

## What DSPM is, and is not

- **It is** an always-current catalog of your data stores, with a sensitivity label you can trace to its source, and the exposure that makes each label matter.
- **It is** metadata-based. It does not open objects, query rows, read stream messages or read secret values. Posture scanning connects through read-only cloud roles.
- **It is not** a content scanner. A store whose name and tags say nothing about what it holds gets no label until someone tags it. See [Classification and its limits](/docs/dspm/classification).
- **It is not** a DLP tool. It does not watch data in motion or block transfers.

## How it connects to the rest of Onam

DSPM, [Database Security](/platform/database-security) and [Encryption & Keys](/platform/encryption) share one scan and answer different questions about the same data.

| Engine | Question | What it takes from DSPM | What it gives back |
| --- | --- | --- | --- |
| DSPM | What data do we hold, where, how exposed? | — | Labels, exposure, lineage, governance score |
| Database Security | Is each database hardened, private, audited, backed up? | Labels on each database | A sensitive database that is public or unencrypted is raised to critical |
| Encryption & Keys | Is it encrypted with a key we control? | Labels on each store | Sensitive data unencrypted (critical) or on a provider-managed key (high) |
| Attack Path | Which chains of findings reach something valuable? | Sensitive, public and unencrypted flags per store | Paths that end at a sensitive store are scored as reaching a crown jewel |
| CIEM | Who can do what? | — | Data-related identity findings merged into the DSPM view |

## Where to find it in the console

- **Data Security** — the catalog, findings, residency and access-monitoring tabs.
- **Data Security → Lineage** (\`/ui/datasec/lineage\`) — reconstructed chains with cross-region and cross-account hops flagged.
- **Database Security** and **Encryption** — their own pages, with DSPM labels already applied.
`,
  },
  {
    slug: "dspm/discovery",
    title: "DSPM discovery",
    breadcrumb: "Data Security (DSPM) / Discovery",
    body: `
How DSPM finds data stores: the posture scan inventories each store and its settings through read-only cloud roles. Nothing extra is installed for it.

## What is discovered

DSPM does not run a separate crawl. The same discovery pass that feeds CSPM records every resource in the connected accounts, and DSPM selects the ones that hold data: object storage, managed databases and warehouses, streams, and Kubernetes secrets, ConfigMaps, persistent volume claims and StatefulSets. The full per-cloud list is in [Coverage by cloud](/docs/dspm/coverage).

Self-hosted databases — PostgreSQL, MySQL, MariaDB, SQL Server, MongoDB, Oracle, Cassandra, IBM Db2 and Snowflake — join the catalog when you onboard them as technology accounts with a database credential. Without that onboarding they are not visible to DSPM.

## What is recorded per store

| Recorded | Used for |
| --- | --- |
| Name, description, tags | Classification |
| Encryption settings and key reference | Encryption checks; the Encryption engine's coverage and sensitive-data cross-check |
| Bucket policy, ACL grants, public-access block, provider public flags | Public exposure and cross-account grants |
| Access logging configuration | Activity-logging check and governance score |
| Versioning, lifecycle rules, backup retention, point-in-time restore, deletion protection | Lifecycle and backup checks |
| Region and account | Residency, and cross-region or cross-account lineage hops |
| Relationships to other resources | Lineage chains |
| Event notifications (S3) and stream consumers (Kinesis) | Per-store lineage records |

## How often

Every scan. A store created since the last scan appears in the catalog on the next one, with its labels and checks; a store that has been deleted drops out. Findings are tied to the scan that produced them.

## Access needed

Posture scanning connects through read-only cloud roles: list and describe calls on the storage and database services, plus reading bucket policies and ACLs. DSPM needs no permission to read objects, rows or secret values, because it never does. (Agentless workload scanning is a separate capability that runs inside your account; DSPM does not depend on it.)
`,
  },
  {
    slug: "dspm/classification",
    title: "Classification and its limits",
    breadcrumb: "Data Security (DSPM) / Classification",
    body: `
How DSPM labels a store PII, PHI, PCI, financial or confidential from metadata — names, tags and schema — and what that approach cannot see.

## The labels

| Label | Meaning | Typical signal |
| --- | --- | --- |
| PII | Personal data | Name or tag tokens such as customer, user, member, employee, contact, profile, patient |
| PHI | Health data | Tokens such as patient, health, medical, clinical, HIPAA, EHR |
| PCI | Payment card data | Tokens such as PCI, card number, CVV, payment card (self-hosted databases) |
| FINANCIAL | Financial data | Tokens such as billing, payment, bank, transaction, revenue, finance |
| CONFIDENTIAL | Secrets and restricted material | Tokens such as secret, credential, password, token, private; every Kubernetes Secret; ConfigMaps with credential-like key names |

A store can carry more than one label — a table called \`patient-intake\` is labelled both PII and PHI.

## The signals

1. **Store name and description.** Split into words on dashes, underscores and dots, then matched against the token lists above.
2. **Tags.** Used when a store has no description, so a tag such as \`data-class=customer\` is picked up.
3. **Database and schema names** for self-hosted databases discovered by the technology engine, matched against PII and PCI patterns.
4. **Kubernetes ConfigMap key names** — a key named like a password or token marks the ConfigMap confidential. The values are not inspected.
5. **Rule metadata.** When a posture rule with a data-classification context fails on a store, its context contributes a label.

Because every signal is metadata you can read — a name, a tag, a schema — the reason for a label is visible in the store's own configuration.

## What classification does not read

- Objects or files in buckets
- Rows or columns of data in tables
- Messages on streams or queues
- Secret values in vaults, secrets managers or Kubernetes Secrets

## The limits, stated plainly

- **False negatives.** A bucket called \`nightly-exports\` holding customer records gets no label, because nothing in its metadata says what it holds. Fix: tag it, or name it for its contents.
- **False positives.** A bucket called \`user-avatars-thumbnails\` is labelled PII because of the token *user*. Fix: rename it, or accept the label; the reason is in the name.
- **No record counts.** Because contents are not read, DSPM cannot tell you how many personal records a store holds, or which columns hold them.
- **No content-level PCI proof.** A PCI label means the metadata points to card data, not that a card number was found.

> If you need to know exactly what is inside unlabelled files, that requires a content scanner, which Onam's DSPM is not. The design choice is deliberate: your data stays where it is, and no permission to read it is needed.

## Making classification better

- Tag data stores with what they hold. A consistent tag such as \`data-class\` with values like \`customer\`, \`payment\` or \`health\` gives DSPM a reliable signal on every store.
- Name new stores for their contents.
- Review stores with no label but high exposure first: public, cross-account or unencrypted stores where classification has nothing to go on.
`,
  },
  {
    slug: "dspm/access-mapping",
    title: "Access mapping",
    breadcrumb: "Data Security (DSPM) / Access mapping",
    body: `
How DSPM shows who and what can reach a data store: public grants, other accounts, access seen in audit events, encryption and keys, and attack paths.

Each store carries five views of access. They answer different questions, and the combination is what turns a label into a priority.

## 1. Public exposure

A store is treated as public only when an actual grant makes it so. For S3 the engine combines three signals, each suppressed by the matching public-access block setting:

- the provider's own policy verdict that the bucket is public,
- an ACL grant to all users or to all authenticated users,
- a bucket-policy statement with a wildcard principal.

A bucket with no public-access block configured but no public grant is **not** reported as public. For databases, the provider's publicly-accessible flag is used.

## 2. Other accounts

Bucket policies are read statement by statement. An \`Allow\` to a principal in an account other than the store's own is a finding:

| Grant | Severity |
| --- | --- |
| Write, delete or modify from another account | Critical |
| Policy-related actions from another account | High |
| Read from another account | High — raised to critical if object reads on the bucket were seen in the last 24 hours |

On AWS, Lake Formation grants are also checked for broad defaults and wildcard administrative grants.

## 3. Observed access

From cloud audit events over the last 30 days, grouped per store: the number of accesses, the number of distinct principals, the operations used and the time of last access. This is what actually happened, which is often narrower than what policy allows — and occasionally wider than anyone expected.

## 4. Encryption and keys

The Encryption engine reads DSPM's labels and flags sensitive data that is unencrypted (critical) or protected only by a provider-managed key (high). Key policies are parsed separately for wildcard principals, other accounts and grants. See [Exposure, encryption and residency](/docs/dspm/exposure-and-residency).

## 5. Attack paths

DSPM writes three facts about every store to the security graph — its top classification, whether it is public, and whether it is unencrypted at rest. The attack-path engine uses them to confirm paths whose last step reaches a sensitive store, so a chain of findings that ends at customer data is scored above one that ends at a scratch bucket. Each account also gets a count of the PII stores in it.

## What access mapping does not do

It does not compute, for each store, the complete list of identities whose effective permissions allow a read. That is an identity question, answered per principal in [CIEM](/docs/features/ciem) on the same graph. CIEM findings that concern data access are merged into the DSPM findings view.
`,
  },
  {
    slug: "dspm/exposure-and-residency",
    title: "Exposure, encryption and residency",
    breadcrumb: "Data Security (DSPM) / Exposure, encryption and residency",
    body: `
DSPM's per-store protection checks: encryption at rest, access logging, versioning and backup, the 0–100 governance score, and region residency.

## Encryption at rest

Each store's own encryption setting is checked: default encryption on S3 buckets, storage encryption or a KMS key on RDS, server-side encryption on DynamoDB, the encrypted flag on Redshift, encryption at rest on OpenSearch, and the equivalents on other clouds. Kinesis streams are treated as encrypted.

The [Encryption & Keys](/platform/encryption) engine goes further on the same stores: which key protects each one (provider-managed or customer-managed), whether the key rotates, who its policy lets in, and what depends on it. It reads DSPM's labels, so:

| Condition | Severity |
| --- | --- |
| Sensitive data on an unencrypted store | Critical |
| Sensitive data on a provider-managed key rather than a customer-managed one | High |
| Public store with sensitive data and no encryption in transit | Critical |

## Activity logging

Server access logging on buckets, log exports or enhanced monitoring on RDS, streams or contributor insights on DynamoDB, audit logging on Redshift and OpenSearch. A store with no access log has no record of who read it.

## Lifecycle and backup

Versioning or lifecycle rules on buckets; backup retention and deletion protection on RDS; point-in-time recovery on DynamoDB; automated snapshot retention on Redshift.

## The governance score

Every store gets a 0–100 score from three checks of equal weight: **encrypted at rest**, **not public**, **access logging on**. The possible values are 0, 33, 66 and 100. A score below 80 — that is, any store missing one of the three — is a finding: high below 50, medium otherwise.

## Residency

Every store's region is recorded and shown in the residency view. The default residency check in scheduled scans flags stores held outside EU and US regions. The engine also accepts an explicit list of allowed regions for residency evaluation, which flags any store outside that list instead.

Residency is about where the primary copy lives. Copies made by replication to another region are visible as cross-region hops in [Data lineage](/docs/dspm/lineage).

> The default EU-or-US rule will not suit every organisation — a team whose data must stay in one country needs an allowed-region list. Talk to us about setting your residency rules.
`,
  },
  {
    slug: "dspm/lineage",
    title: "Data lineage",
    breadcrumb: "Data Security (DSPM) / Data lineage",
    body: `
How Onam links replication, backup, ETL, streaming and export hops into data lineage chains, and flags copies that cross regions or accounts.

![An illustrative lineage chain with a cross-region replication hop and a cross-account export hop](/diagrams/dspm-lineage-chain.svg)

## How a chain is built

1. **Edges come from the inventory.** Discovery records relationships between resources. Those that move data — *replicates to, backs up to, stores data in, publishes to, subscribes to, reads from, writes to, exports to, imports from* — become lineage edges.
2. **Each hop is typed and flagged.** The relationship maps to a transfer type: replication, backup, ETL, streaming, read, write, export or import. Source and destination regions and accounts are read from their identifiers; a hop between two regions is flagged cross-region, a hop between two accounts is flagged cross-account.
3. **Edges are walked into chains.** Chains start at stores nothing feeds — the true origins — and follow each path up to eight hops, which stops a cycle from running forever. If no multi-hop chain exists, each edge is shown on its own.

Chains appear in the console under **Data Security → Lineage** (\`/ui/datasec/lineage\`).

## Per-store lineage records

Alongside chains, each store records its own outbound flows where the configuration shows them: S3 event notifications to Lambda, SQS or SNS, and the registered consumers of a Kinesis stream. These are informational — they describe where data goes, not a misconfiguration.

## Why the flags matter

A copy is protected by the controls where it lands, not where it started. A replication hop into another region can move regulated data out of its permitted geography even when the source bucket passes every residency check; an export hop into another account hands the copy to that account's controls. The flags mark exactly those moments.

## What lineage cannot see

- **Movement with no configuration trace.** A script, notebook or scheduled job that copies files using its own credentials leaves no relationship in the cloud's resource configuration.
- **Transformations inside a job.** Lineage records that an ETL job writes to a store, not which fields it carried.
- **Volumes.** Records per day are shown only where a source provides them; most do not.

> Encryption in transit and a per-chain risk grade appear in the lineage view where the underlying relationship records them. Most relationships do not carry those fields yet, so treat the cross-region and cross-account flags as the dependable signal today.
`,
  },
  {
    slug: "dspm/findings-reference",
    title: "DSPM findings reference",
    breadcrumb: "Data Security (DSPM) / Findings reference",
    body: `
Every DSPM check: what it looks at, what passes, and the severity when a data store fails it. AWS severities shown; other clouds follow the same model.

Each store is evaluated against the checks below on every scan. Rule identifiers follow the pattern \`<cloud>.dspm.<check>.<store type>\` — for example \`aws.dspm.encryption_posture.s3_bucket\`. Every finding carries the store's classification labels, so findings can be filtered to sensitive stores only.

## Per-store checks

| Check | Looks at | Passes when | Severity on failure (AWS) |
| --- | --- | --- | --- |
| Classification | Name, description, tags | No sensitive label is inferred — a labelled store is a finding so it can be reviewed | High |
| Encryption posture | Store encryption setting | Encryption at rest is on | Critical — S3 buckets, RDS · High — DynamoDB, Redshift, OpenSearch, Glue |
| Access control | Public grants, provider public flag | No grant makes the store public | Critical — public S3 bucket or public RDS · High — DynamoDB, Redshift |
| Data residency | Region | Region is inside the allowed set | Medium |
| Activity logging | Access or audit logging | Logging is on | High — S3, RDS · Medium — DynamoDB, Redshift, OpenSearch |
| Lifecycle and backup | Versioning, lifecycle, retention, point-in-time restore | The relevant protection is on | High — RDS · Medium — S3, DynamoDB · Low — Redshift |
| Lineage | Event notifications, stream consumers | Always passes — informational | — |
| Governance score | Encryption, public exposure, logging | Score is 80 or more | High below 50 · Medium otherwise |

## Account- and grant-level checks (AWS)

| Rule | Severity |
| --- | --- |
| \`aws.s3.bucket.no_cross_account_write_access\` — another account can write | Critical |
| \`aws.s3.bucket.cross_account_read_access_reviewed\` — another account can read | High; critical if object reads were seen in the last 24 hours |
| \`aws.s3.bucket.cross_account_replication_reviewed\` — another account has policy actions | High |
| \`aws.s3.bucket.bucket_owner_enforced\` — object ownership is not owner-enforced | Medium |
| Lake Formation broad default or wildcard admin grants | Per rule |

## Kubernetes

ConfigMaps with credential-like key names are classification findings (high); every Secret is labelled confidential. ConfigMaps are not encrypted at rest by default. Under access control, a Secret in the \`default\` namespace is high (medium elsewhere), and a credential-bearing ConfigMap in \`default\` is high.

## Posture rules mapped to data security

Separately from the checks above, posture rules that carry data-security metadata are grouped into DSPM modules — encryption, access governance, activity monitoring, residency, compliance and classification — with GDPR, HIPAA and PCI DSS references where the rule defines them. They appear in the same findings list.

## Where findings go

- The **Data Security** findings view, filterable by label, module and severity.
- The shared findings list and compliance mapping, alongside every other engine.
- The security graph, for attack paths — see [Access mapping](/docs/dspm/access-mapping).
`,
  },
  {
    slug: "dspm/coverage",
    title: "DSPM coverage by cloud",
    breadcrumb: "Data Security (DSPM) / Coverage by cloud",
    body: `
Which data store types DSPM analyses on each cloud and for self-hosted databases, with per-service notes on what is checked and what is not.

The stores below receive the full set of DSPM checks. Other data services — on AWS, for example DocumentDB, Neptune, Timestream, Keyspaces, ElastiCache, SQS, SNS and MSK — are evaluated by the storage and database posture rules and their findings are grouped into DSPM modules, but they do not get the per-store classification and governance score.

## AWS

| Store | Notes |
| --- | --- |
| S3 buckets | Full checks; multi-signal public determination; bucket-policy cross-account analysis; object ownership; event-notification lineage |
| RDS instances and Aurora clusters | Encryption (storage encryption or KMS key), public accessibility, log exports or enhanced monitoring, backup retention and deletion protection |
| DynamoDB tables | Server-side encryption, point-in-time recovery, streams; not publicly reachable by design |
| Redshift clusters | Encrypted flag, public accessibility, audit logging, snapshot retention |
| Glue databases | Encryption and classification |
| OpenSearch domains | Encryption at rest, log publishing |
| Kinesis streams | Treated as encrypted; consumers recorded as lineage |
| Lake Formation | Broad default and wildcard admin grants |

## Azure

Storage accounts, Data Lake Storage, Azure SQL servers, Cosmos DB, Synapse workspaces and Key Vault.

## Google Cloud

Cloud Storage buckets, Cloud SQL instances, BigQuery datasets, Spanner instances, Firestore databases and Secret Manager secrets. Residency treats \`europe-*\` locations as EU and \`us-*\` as US.

## Oracle Cloud (OCI)

Object Storage buckets, Autonomous Databases, NoSQL tables and Streaming streams.

## Alibaba Cloud

OSS buckets, ApsaraDB RDS instances, PolarDB clusters, Tablestore instances and MaxCompute projects.

## IBM Cloud

Cloud Object Storage buckets, IBM Cloud Databases instances (for example Databases for PostgreSQL), Cloudant and Event Streams.

## Kubernetes

Secrets (always labelled confidential), ConfigMaps (confidential when a key name looks like a credential), persistent volume claims and StatefulSets.

## Self-hosted databases

PostgreSQL, MySQL, MariaDB, SQL Server, MongoDB, Oracle, Cassandra, IBM Db2 and Snowflake, once onboarded as technology accounts. DSPM classifies them from their resource, database and schema names; it only adds labels and never overwrites a label from the cloud path. Engine-level hardening for the same databases is covered by [Database Security](/platform/database-security) through CIS benchmarks.

## Not covered

- Data inside SaaS applications other than Snowflake.
- On-premises file shares and storage arrays.
- Databricks.
`,
  },
];
