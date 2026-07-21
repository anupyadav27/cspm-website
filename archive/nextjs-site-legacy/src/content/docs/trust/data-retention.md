# Data Retention Policy

This document describes **what data the platform collects, how long it is retained, how it is deleted, and your rights as a data subject** under GDPR and similar regulations. Every retention period below is enforced by automated daily expiry jobs — you don't have to ask us to delete data; the platform deletes on schedule.

**Effective date**: 2026-01-01
**Last reviewed**: 2026-05-09

<img src="/diagrams/data-retention.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:24px;" alt="Data retention timeline from ingestion through active storage, rollup archive, long-term archive to permanent deletion, with policy table" />

---

## What Data We Collect

The platform collects three classes of data: **scan data** (your cloud security posture), **platform data** (your account and operations), and **never-collected data** (the explicit boundary). Knowing what we *don't* collect is as important as what we do.

| Class | Examples | Why we keep it |
|---|---|---|
| **Scan data** — collected by engines | Cloud resource metadata · resource configurations · security findings · compliance scores · attack graph nodes · vulnerability records | Powers the dashboards, reports, and posture trend you pay for |
| **Platform data** — account & operations | User account data · tenant configuration · credential references (pointers, never secrets) · audit logs · scan history · billing records | Required to operate your account and meet our SOC 2 / legal obligations |

**We never collect:**

- **Plaintext cloud credentials** — only credential references (e.g. ARNs, service principal IDs). The actual secret material lives in a managed secret store and is fetched at scan time.
- **Customer workload data or file contents** — DSPM samples to classify data types, but sample data is discarded immediately after classification metadata is extracted.
- **Personal data from scanned cloud resources** — the platform records *that* PII / PCI / PHI exists, *where* it lives, and *how it's protected* — never the data itself.
- **Source code content** — SecOps reads code to scan for issues but stores only finding metadata, never the source code.

---

## Retention Schedule

Each data class has its own retention window. Audit logs and billing records are retained longest (7 years) due to SOC 2 and legal requirements; raw scan configurations are retained shortest (90 days) because they're recomputable from a fresh scan.

| Data Category | Retention Period | Reason |
|---|---|---|
| Security findings (full detail) | **12 months** | Historical trend analysis, compliance evidence |
| Security findings (aggregated scores) | **36 months** | Long-term posture trend reporting |
| Raw resource configurations (scan raw data) | **90 days** | Debugging, re-evaluation |
| Compliance scores and reports | **12 months** | Audit evidence, trend analysis |
| Attack graph nodes and edges | **12 months** | Investigation history |
| Vulnerability records | **12 months** | Remediation tracking |
| Audit logs | **7 years** | SOC 2 requirement, legal hold |
| Billing records | **7 years** | Legal / tax requirement |
| User account data (active subscription) | **Duration of subscription** | — |
| User account data (post-termination) | **90 days** | Grace period, account recovery |
| Credential references | **Duration of subscription** | Deleted immediately on credential revocation |
| Application and scan logs | **90 days** | Operational debugging |
| Database backup snapshots | **30 days** | Disaster recovery |

**Custom retention** is available on Enterprise plans for compliance regimes that require longer (e.g. FedRAMP requires 3 years for security findings) or shorter (some EU privacy programs require 6 months max).

---

## Data Deletion

### Automatic Deletion

Data is automatically deleted when its retention period expires. **Deletion is permanent and irreversible** — once a record is past its retention window, no support escalation can recover it.

<img src="/diagrams/trust-retention-deletion.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="Automatic deletion flow — created, retained, expiry, deleted, audit log verified" />

**Reading the flow:**

1. **Created** — every data record is tagged with a retention class and a creation timestamp at write time.
2. **Retained** — for the scheduled period (90 days, 12 months, 7 years depending on class).
3. **Expiry** — a daily expiry job finds eligible records and queues them for deletion.
4. **Permanently deleted** — from production AND all backup snapshots. Irreversible.
5. **Audit log** — the deletion event is timestamped in the audit log; a destruction certificate is available on request.

**Backups follow the same schedule.** After the 30-day backup retention window, data deleted from production is also removed from all backup snapshots.

### Account Termination

When a subscription is terminated:

| Day | What happens |
|---|---|
| **0** | Scanning stops immediately. No new data is collected. |
| **0–90** | Data is preserved in read-only state. Export available via API or support request. |
| **30** | A deletion confirmation email is sent with export instructions. |
| **90** | All scan data, findings, configuration data, and user data are permanently deleted. |
| **90+** | Audit logs and billing records are retained per the 7-year legal requirement. |

Customers can request **early deletion** at any point during the 0–90 day grace window — useful when a regulator requires immediate erasure.

### Right to Erasure (GDPR Article 17)

If you are an EU data subject and request erasure of personal data:

1. Submit request to: `legal@onam.io`
2. Identity verification is required.
3. We complete erasure within **30 days** of verified request.
4. Personal data (name, email, login history) is deleted.
5. Anonymized scan data (no personal identifier) is not subject to erasure — it's not personal data under GDPR.
6. Data required for legal or audit purposes (audit logs, billing records) is retained with a note of the erasure request.

---

## Data Residency

Your data is processed and stored **exclusively in the region you select during tenant creation**. Backups stay in the same region. The platform never replicates findings or inventory across regions without your explicit consent.

<img src="/diagrams/trust-data-residency.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="Data residency options — your cloud account to default / EU / US regions, with TLS 1.3 transit and residency guarantees" />

**Three residency options:**

| Region | Coverage | Plans |
|---|---|---|
| **🇮🇳 India / APAC** (default) | Mumbai data center · India + APAC customers | All plans |
| **🇪🇺 EU residency** | Ireland data center · EU + UK customers · GDPR-residency requirement | Enterprise |
| **🇺🇸 US residency** | Virginia data center · US + Americas customers | Enterprise |
| **🇺🇸 Government cloud** (FedRAMP / IL5) | US Federal · ITAR · IL5 customers | Government plans |

**The four residency guarantees:**

- Your data is processed and stored exclusively in the region you select.
- Backups stay in the same region.
- No cross-region replication without your explicit consent.
- Data transit from your cloud account to the platform region is encrypted with **TLS 1.3**. No data transits unencrypted.

---

## Data Classification

The platform classifies all data it holds into **four sensitivity tiers**. Each tier has different access controls, encryption posture, and audit requirements.

| Tier | Examples | Controls |
|---|---|---|
| **Confidential** | Cloud credential references · user passwords (hashed) · SOC 2 reports | Managed secret store · encryption · access logging · NDA required for access |
| **Restricted** | Security findings · vulnerability details · audit logs | Encrypted · RBAC-gated · tenant-isolated |
| **Internal** | Scan metadata · compliance scores · application logs | Encrypted · authenticated access required |
| **Public** | Documentation · architecture diagrams · release notes | Publicly accessible |

---

## GDPR Compliance Summary

Every applicable GDPR article is mapped to a specific platform control or process.

| GDPR Requirement | How we meet it |
|---|---|
| Art. 5 — Lawful processing | Legitimate interest (security service) + contractual necessity |
| Art. 6 — Legal basis | Contract performance + legitimate interest |
| Art. 13 / 14 — Transparency | This policy + Privacy Policy on the marketing site |
| Art. 17 — Right to erasure | Honored within 30 days — `legal@onam.io` |
| Art. 20 — Data portability | Export available via API and support request |
| Art. 25 — Privacy by design | Tenant isolation · minimal data collection · encryption defaults |
| Art. 32 — Security measures | SOC 2 Type II · ISO 27001 · encryption · RBAC · annual penetration testing |
| Art. 33 — Breach notification | Within 72 hours of confirmed breach |
| Art. 35 — DPIA | Available on request for Enterprise customers |
| Art. 28 — Processor agreement | DPA available — contact `legal@onam.io` |

---

## Frequently Asked Questions

**Can I export my data before cancelling?**
Yes. All findings, compliance reports, and scan history are exportable via API (JSON / CSV) or by contacting support. You have 90 days after termination to request an export.

**Do you share my cloud configuration data with third parties?**
No. Your cloud resource configurations and security findings are never shared with third parties. See the Subprocessor list in the [Trust Center](/docs/trust/trust-center/) for infrastructure providers.

**What happens to my data if you shut down?**
In the event of a platform shutdown, customers receive a minimum of 90 days notice, during which export tools remain available. After that period, all data is permanently deleted with a destruction certificate available on request.

**Are backups encrypted?**
Yes. All database snapshots are encrypted at rest. Backup data is subject to the same retention and deletion schedules as production data.

**Where is my data physically stored?**
In the region you select at tenant creation — see the Data Residency section above. No data is stored outside the contracted region.

**Can I get a destruction certificate?**
Yes. Available on request after account termination or after a verified GDPR Article 17 erasure request. Useful for compliance evidence.

---

*Effective: 2026-01-01 · Last reviewed: 2026-05-09*
*For questions: legal@onam.io*
*Changes to this policy are communicated via email 30 days before taking effect.*
