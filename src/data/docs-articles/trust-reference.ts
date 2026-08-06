import type { DocArticle } from "./types";

export const articles: DocArticle[] = [
  {
    slug: "trust/security",
    title: "Trust Center",
    breadcrumb: "Trust / Trust Center",
    body: `
Security, privacy, and compliance are foundational to the platform. This page is the authoritative source for Onam's certifications, security posture, policies, and compliance artifacts. Every claim below is independently audited or backed by a downloadable artifact.

![Trust center overview — SOC 2 Type II, ISO 27001, data encryption, penetration testing, GDPR compliance, and uptime SLA](/diagrams/trust-center.svg)

## Certifications and compliance status

The platform holds the major enterprise security certifications. Six are achieved, two are in progress, and three are on the roadmap. All achieved certifications are backed by current audit reports available on request.

| Certification | Status | Scope | Audit period |
| --- | --- | --- | --- |
| SOC 2 Type II | Achieved | Security, Availability, Confidentiality | Annual — report on request |
| ISO 27001:2022 | Achieved | ISMS for cloud platform operations | Annual — certificate on request |
| ISO 27017 | Achieved | Cloud-specific security controls | Co-certified with ISO 27001 |
| PCI DSS v4.0 | Achieved | Card data handling in billing pipeline | Annual — attestation on request |
| GDPR | Compliant | EU personal data processing | DPA available — contact \`legal@onam.io\` |
| CSA STAR Level 1 | Achieved | CAIQ self-assessment published | See Downloads below |
| HIPAA BAA | Available | Business Associate Agreement | Contact \`sales@onam.io\` |
| ISO 27018 | In progress | Cloud privacy for PII | Target: Q3 2026 |
| FedRAMP Moderate | In progress | US federal agency use | Target: Q4 2026 |
| ISO 27701 | Planned | Privacy management | Target: 2027 H1 |
| SOC 3 | Planned | Public-facing assurance report | Target: 2027 H1 |
| IRAP (Australia) | Planned | Australian Government use | Target: 2027 H2 |

### Downloads

| Document | Access | Last updated |
| --- | --- | --- |
| SOC 2 Type II Report | On request — NDA required | 2025-12 |
| ISO 27001 Certificate | Public | 2025-09 |
| ISO 27017 Certificate | Public | 2025-09 |
| PCI DSS v4.0 AOC | On request — NDA required | 2025-11 |
| Penetration Test Report (summary) | On request | 2026-03 |
| Penetration Test Report (full) | On request — NDA required | 2026-03 |
| CAIQ Self-Assessment | Public | 2026-04 |
| SIG Lite | On request | 2026-04 |
| Data Flow Diagram | Public | 2026-05 |
| Disaster Recovery Test Report | On request | 2026-01 |
| Subprocessor List | Public | Updated on change |
| Data Processing Agreement (DPA) | Public | 2026-01 |

> To request gated documents, email **trust@onam.io**. NDA-gated documents (SOC 2 report, full pentest report, PCI AOC) are typically turned around within two business days.

## Security program

The security program is organized into five domains. Each domain has named owners, written policies (reviewable under NDA), and quarterly audit cycles. The summary below is the public-facing version; the full policy set is part of the SOC 2 audit report.

| Domain | What it covers |
| --- | --- |
| Infrastructure | SOC 2-certified cloud infrastructure · AES-256 encryption at rest · all traffic over TLS 1.3 · environment isolation per tier · no public database endpoints |
| Application | OWASP Top 10 controls · RBAC at every layer · input validation on every endpoint · dependency scanning in CI/CD · SAST on every pull request |
| Identity | MFA enforced for all staff · privileged access management · quarterly access reviews · SSO for all internal tooling |
| Operational | Annual third-party penetration test · quarterly vulnerability scans · 24/7 security monitoring · SOC 2 annual audit · public bug bounty program |
| Data | Tenant isolation with no shared tables · AES-256 at rest · TLS 1.3 in transit · 30-day backup retention · regional data residency options |

### Penetration testing

Independent third-party security firms conduct annual penetration tests covering:

- External network penetration testing
- Web application security testing (OWASP Top 10)
- API security testing
- Privilege escalation and lateral movement
- Multi-tenant isolation validation
- Subprocessor boundary testing

A summary report is available on request; full reports are available under NDA for enterprise customers. Identified findings are remediated on the same SLA we promise customers — Critical within 7 days, High within 30, Medium within 90.

## Data handling

The platform stores three classes of data: scan and finding data (your security posture), credential references (pointers to your IAM roles, never plaintext keys), and account metadata. Encryption, retention, and isolation rules are explicit per class.

| Data type | Where stored | Encryption | Retention |
| --- | --- | --- | --- |
| Cloud resource configurations | Tenant-scoped database | AES-256 at rest | 12 months |
| Security findings | Tenant-scoped database | AES-256 at rest | 12 months |
| Scan metadata | Tenant-scoped database | AES-256 at rest | 12 months |
| Audit logs | Tenant-scoped database | AES-256 at rest | 7 years |
| Cloud credentials (references only) | Managed secret store | Cloud-provider KMS | Duration of subscription |
| User account data | Identity backend | AES-256 at rest | 90 days post-termination |
| Attack graph data | Managed graph database | AES-256 at rest | 12 months |

We never store:

- **Plaintext cloud credentials.** Only credential references (ARNs, service principal IDs) are stored. The secret material lives in a managed secret store (AWS Secrets Manager, encrypted with KMS) and is fetched at scan time.
- **Customer workload data or file contents.** Data Security (DSPM) samples to classify data types — sample data is discarded immediately after classification metadata is extracted.
- **Personal data from scanned cloud resources.** The platform records that PII, PCI, or PHI exists, where it lives, and how it is protected — never the data itself.

## Subprocessors

| Subprocessor | Purpose | Location |
| --- | --- | --- |
| Cloud infrastructure provider | Compute, storage, secrets management | \`ap-south-1\` (primary), region-configurable |
| Managed graph database service | Security graph (attack paths) | Region-configurable |
| Payment processor | Subscription billing | Global |
| Transactional email provider | System notifications | Global |
| Incident alerting service | Internal on-call rotation | Global |

Customers are notified of material subprocessor changes 30 days in advance. The current list is published and updated whenever a change occurs; subscribe to change notifications at \`trust@onam.io\`.

## Incident response

Security events are handled through a five-stage response process. Severity is classified within 1 hour of detection; customer notifications go out within 72 hours of confirming impact.

![Incident response flow — Detect, Triage, Respond, Notify, Post-Incident Review](/diagrams/trust-incident-response.svg)

| Stage | Target SLA | What happens |
| --- | --- | --- |
| 1. Detect | Continuous (24/7) | Security event detected via 24/7 monitoring, SIEM correlation, or customer report |
| 2. Triage | Under 1 hour | Severity classified; response team paged |
| 3. Respond | Critical: immediate · High: 4 hours · Medium: 24 hours | Incident response team mobilizes; containment begins |
| 4. Notify | Within 72 hours of confirmed customer impact | GDPR Article 33-compliant notification to affected customers |
| 5. Post-incident review | Within 14 days of resolution | PIR shared with affected customers, including root cause and prevention measures |

To report a security issue: \`security@onam.io\`. A GPG public key, a responsible disclosure policy, and a bug bounty program are all published on the website.

## Business continuity

| Metric | Target |
| --- | --- |
| RTO (Recovery Time Objective) | 4 hours for full platform recovery |
| RPO (Recovery Point Objective) | 1 hour (continuous database backups) |
| Backup frequency | Continuous backups; daily snapshots retained 30 days |
| DR test frequency | Semi-annual — last test 2026-01 (report on request) |
| Multi-AZ deployment | All production databases run multi-AZ within your selected region |
| Cross-region failover | Available on Enterprise plans with documented RTO/RPO |

### Security ratings

| Service | Rating | Last updated |
| --- | --- | --- |
| SecurityScorecard | A (94 / 100) | 2026-05 |
| BitSight | 790 (Advanced) | 2026-05 |
| UpGuard | 900+ | 2026-05 |

Live ratings auto-refresh on the trust center web page; score histories are available on request.

## Contact

| Purpose | Contact |
| --- | --- |
| Security issues and vulnerabilities | \`security@onam.io\` |
| Trust document requests (SOC 2, pentest) | \`trust@onam.io\` |
| Data protection, GDPR, DPA | \`legal@onam.io\` |
| HIPAA BAA or FedRAMP questions | \`sales@onam.io\` |
| General compliance questions | \`compliance@onam.io\` |

Trust Center updates are published when certifications are renewed or materially changed. Last updated: 2026-05-09.

## Next steps

- [Data Retention](/docs/trust/data-retention) — what we store, for how long, and how deletion works
- [SLA & SLO](/docs/trust/sla-and-slo) — uptime commitments, scan SLOs, and support response times
- [Framework Coverage](/docs/compliance/frameworks) — the 78 compliance frameworks the platform evaluates for you
- [Book a demo](/request-demo) — walk through the security architecture with our team
`,
  },
  {
    slug: "trust/data-retention",
    title: "Data Retention",
    breadcrumb: "Trust / Data Retention",
    body: `
This document describes what data the platform collects, how long it is retained, how it is deleted, and your rights as a data subject under GDPR and similar regulations. Every retention period below is enforced by automated daily expiry jobs — you don't have to ask us to delete data; the platform deletes on schedule.

Effective date: 2026-01-01. Last reviewed: 2026-05-09.

![Data retention timeline — ingestion, active storage, rollup archive, long-term archive, permanent deletion](/diagrams/data-retention.svg)

## What data we collect

The platform collects two classes of data — scan data (your cloud security posture) and platform data (your account and operations) — and maintains an explicit boundary of never-collected data. Knowing what we don't collect is as important as what we do.

| Class | Examples | Why we keep it |
| --- | --- | --- |
| Scan data — collected by engines | Cloud resource metadata · resource configurations · security findings · compliance scores · attack graph nodes · vulnerability records | Powers the dashboards, reports, and posture trends you pay for |
| Platform data — account and operations | User account data · tenant configuration · credential references (pointers, never secrets) · audit logs · scan history · billing records | Required to operate your account and meet SOC 2 and legal obligations |

We never collect:

- **Plaintext cloud credentials** — only credential references (ARNs, service principal IDs). The secret material lives in a managed secret store and is fetched at scan time.
- **Customer workload data or file contents** — Data Security (DSPM) samples to classify data types, but sample data is discarded immediately after classification metadata is extracted.
- **Personal data from scanned cloud resources** — the platform records that PII, PCI, or PHI exists, where it lives, and how it is protected — never the data itself.
- **Source code content** — SecOps reads code to scan for issues but stores only finding metadata, never the source itself.

## Retention schedule

Each data class has its own retention window. Audit logs and billing records are retained longest (7 years) due to SOC 2 and legal requirements; raw scan configurations are retained shortest (90 days) because they are recomputable from a fresh scan.

| Data category | Retention period | Reason |
| --- | --- | --- |
| Security findings (full detail) | 12 months | Historical trend analysis, compliance evidence |
| Security findings (aggregated scores) | 36 months | Long-term posture trend reporting |
| Raw resource configurations (scan raw data) | 90 days | Debugging, re-evaluation |
| Compliance scores and reports | 12 months | Audit evidence, trend analysis |
| Attack graph nodes and edges | 12 months | Investigation history |
| Vulnerability records | 12 months | Remediation tracking |
| Audit logs | 7 years | SOC 2 requirement, legal hold |
| Billing records | 7 years | Legal and tax requirement |
| User account data (active subscription) | Duration of subscription | Operational |
| User account data (post-termination) | 90 days | Grace period, account recovery |
| Credential references | Duration of subscription | Deleted immediately on credential revocation |
| Application and scan logs | 90 days | Operational debugging |
| Database backup snapshots | 30 days | Disaster recovery |

Custom retention is available on Enterprise plans for compliance regimes that require longer windows (FedRAMP requires 3 years for security findings) or shorter ones (some EU privacy programs cap retention at 6 months).

## Data deletion

### Automatic deletion

Data is automatically deleted when its retention period expires.

![Automatic deletion flow — created, retained, expiry, deleted, audit-log verified](/diagrams/trust-retention-deletion.svg)

Reading the flow:

1. **Created** — every data record is tagged with a retention class and creation timestamp at write time.
2. **Retained** — for the scheduled period (90 days, 12 months, or 7 years depending on class).
3. **Expiry** — a daily expiry job finds eligible records and queues them for deletion.
4. **Permanently deleted** — from production and all backup snapshots.
5. **Audit log** — the deletion event is timestamped in the audit log; a destruction certificate is available on request.

> **Deletion is permanent and irreversible.** Once a record is past its retention window, no support escalation can recover it. Backups follow the same schedule — after the 30-day backup window, data deleted from production is removed from all snapshots too.

### Account termination

When a subscription is terminated:

| Day | What happens |
| --- | --- |
| 0 | Scanning stops immediately. No new data is collected. |
| 0–90 | Data is preserved in read-only state. Export available via API or support request. |
| 30 | A deletion confirmation email is sent with export instructions. |
| 90 | All scan data, findings, configuration data, and user data are permanently deleted. |
| 90+ | Audit logs and billing records are retained per the 7-year legal requirement. |

Customers can request early deletion at any point during the 0–90 day grace window — useful when a regulator requires immediate erasure.

### Right to erasure (GDPR Article 17)

If you are an EU data subject and request erasure of personal data:

1. Submit the request to \`legal@onam.io\`.
2. Identity verification is required.
3. Erasure completes within 30 days of the verified request.
4. Personal data (name, email, login history) is deleted.
5. Anonymized scan data (no personal identifier) is not subject to erasure — it is not personal data under GDPR.
6. Data required for legal or audit purposes (audit logs, billing records) is retained with a note of the erasure request.

## Data residency

Your data is processed and stored exclusively in the region you select during tenant creation. Backups stay in the same region. The platform never replicates findings or inventory across regions without your explicit consent.

![Data residency options — your cloud account to default, EU, or US regions with TLS 1.3 transit](/diagrams/trust-data-residency.svg)

| Region | Coverage | Plans |
| --- | --- | --- |
| India / APAC (default) | Mumbai data center · India and APAC customers | All plans |
| EU residency | Ireland data center · EU and UK customers · GDPR residency requirement | Enterprise |
| US residency | Virginia data center · US and Americas customers | Enterprise |
| Government cloud (FedRAMP / IL5) | US Federal · ITAR · IL5 customers | Government plans |

The four residency guarantees:

- Your data is processed and stored exclusively in the region you select.
- Backups stay in the same region.
- No cross-region replication without your explicit consent.
- Data transit from your cloud account to the platform region is encrypted with TLS 1.3. No data transits unencrypted.

## Data classification

The platform classifies all data it holds into four sensitivity tiers. Each tier has different access controls, encryption posture, and audit requirements.

| Tier | Examples | Controls |
| --- | --- | --- |
| Confidential | Cloud credential references · user passwords (hashed) · SOC 2 reports | Managed secret store · encryption · access logging · NDA required for access |
| Restricted | Security findings · vulnerability details · audit logs | Encrypted · RBAC-gated · tenant-isolated |
| Internal | Scan metadata · compliance scores · application logs | Encrypted · authenticated access required |
| Public | Documentation · architecture diagrams · release notes | Publicly accessible |

## GDPR compliance summary

Every applicable GDPR article is mapped to a specific platform control or process.

| GDPR requirement | How we meet it |
| --- | --- |
| Art. 5 — Lawful processing | Legitimate interest (security service) plus contractual necessity |
| Art. 6 — Legal basis | Contract performance plus legitimate interest |
| Art. 13 / 14 — Transparency | This policy plus the Privacy Policy on the marketing site |
| Art. 17 — Right to erasure | Honored within 30 days — \`legal@onam.io\` |
| Art. 20 — Data portability | Export available via API and support request |
| Art. 25 — Privacy by design | Tenant isolation · minimal data collection · encryption defaults |
| Art. 28 — Processor agreement | DPA available — contact \`legal@onam.io\` |
| Art. 32 — Security measures | SOC 2 Type II · ISO 27001 · encryption · RBAC · annual penetration testing |
| Art. 33 — Breach notification | Within 72 hours of confirmed breach |
| Art. 35 — DPIA | Available on request for Enterprise customers |

## Frequently asked questions

**Can I export my data before cancelling?**
Yes. All findings, compliance reports, and scan history are exportable via the [REST API](/docs/reference/api) (JSON / CSV) or by contacting support. You have 90 days after termination to request an export.

**Do you share my cloud configuration data with third parties?**
No. Your cloud resource configurations and security findings are never shared with third parties. See the subprocessor list in the [Trust Center](/docs/trust/security) for infrastructure providers.

**What happens to my data if you shut down?**
In the event of a platform shutdown, customers receive a minimum of 90 days notice, during which export tools remain available. After that period, all data is permanently deleted, with a destruction certificate available on request.

**Are backups encrypted?**
Yes. All database snapshots are encrypted at rest. Backup data is subject to the same retention and deletion schedules as production data.

**Where is my data physically stored?**
In the region you select at tenant creation — see Data residency above. No data is stored outside the contracted region.

**Can I get a destruction certificate?**
Yes — available on request after account termination or after a verified GDPR Article 17 erasure request. Useful for compliance evidence.

Changes to this policy are communicated via email 30 days before taking effect. Questions: \`legal@onam.io\`.

## Next steps

- [Trust Center](/docs/trust/security) — certifications, incident response, and the full security program
- [SLA & SLO](/docs/trust/sla-and-slo) — uptime commitments and support response times
- [API Reference](/docs/reference/api) — export findings and reports programmatically before any retention window closes
- [Data Security architecture](/docs/architecture/data-security) — how tenant isolation and encryption are implemented
`,
  },
  {
    slug: "trust/sla-and-slo",
    title: "SLA & SLO",
    breadcrumb: "Trust / SLA & SLO",
    body: `
This document defines the Service Level Agreement (SLA) and Service Level Objectives (SLOs) for the platform. SLAs are contractually committed in your subscription. SLOs are internal performance targets we publish for transparency — they tell you what to expect day to day, even where we are not contractually committing.

![SLA and SLO reference — contractual commitments for availability, API response, scan completion, and incident notification alongside internal SLO targets](/diagrams/sla-slo.svg)

> **The key distinction:** an SLA is a contractual commitment with credit consequences if breached (99.9% uptime, 1-hour critical-incident response). An SLO is a published target without contractual penalty (typical scan completion time, P95 API latency).

## Platform uptime SLA

The uptime SLA depends on your subscription plan. Higher-tier plans get tighter commitments and bigger credits if breached.

| Plan | Monthly uptime SLA | Max downtime per month | Credit if breached |
| --- | --- | --- | --- |
| Starter | 99.5% | 3h 36m | 10% of monthly fee |
| Growth | 99.9% | 43 min | 25% of monthly fee |
| Enterprise | 99.95% | 21 min | 50% of monthly fee |
| Enterprise+ (negotiated) | Up to 99.99% | Down to 4 min | Up to 100% of monthly fee |

**How uptime is measured:** synthetic monitors run every 60 seconds from three geographic regions, probing the portal, the API, and the scan trigger endpoint. An outage is declared when 2 of 3 probes fail for 3 consecutive minutes. The 2-of-3 rule prevents a single regional network blip from triggering a false outage.

**Excluded from the SLA:**

- Scheduled maintenance within the published window (4 hours or less per month, with 48-hour notice)
- Force majeure events (natural disaster, war, government action)
- Customer-caused issues (your IAM role broken on the cloud side, your network blocking us)
- Third-party provider outages beyond our control (cloud provider regional outages, your IdP unreachable)

**Credit claims** must be submitted within 30 days of the incident to \`support@onam.io\` with the incident date and impact description. Credits apply to the next billing cycle.

## Scan performance SLOs

Scan duration depends primarily on the number of resources in your cloud account, and secondarily on the number of regions you have enabled. The targets below are published SLOs, not contractual SLAs, unless specified in your enterprise agreement.

| Account size (resources) | Target scan duration | P99 | Notes |
| --- | --- | --- | --- |
| Under 1,000 | 15 minutes | 20 min | Single-region accounts |
| 1,000–10,000 | 60 minutes | 90 min | Standard multi-region |
| 10,000–50,000 | 2 hours | 3 hours | Large accounts with many regions |
| 50,000–100,000 | 3 hours | 4 hours | Enterprise-scale |
| Over 100,000 | 4 hours | 6 hours | Requires Enterprise plan |

**What counts as "scan complete":** all engines (Discovery & Inventory, Check, the domain engines, Attack Path, and Risk) have finished processing and findings are visible in the console.

**Findings-to-console latency:** under 5 minutes from each engine's completion to findings visible in the UI (P99 under 10 minutes). You don't wait for the full scan — findings stream in as each engine completes.

## API performance SLOs

The API is sized to support continuous integration into your existing tooling (SIEM, GRC, dashboards). Latency targets vary by endpoint complexity.

| Endpoint type | P50 | P95 | P99 | Notes |
| --- | --- | --- | --- | --- |
| Gateway health (\`/gateway/health\`) | Under 50 ms | Under 100 ms | Under 200 ms | No database query |
| Single resource lookup | Under 200 ms | Under 500 ms | Under 1 s | Indexed query |
| Findings list (paginated, 50 rows) | Under 500 ms | Under 1 s | Under 2 s | Tenant-scoped |
| Compliance posture score | Under 800 ms | Under 2 s | Under 3 s | Aggregate query |
| Dashboard views (BFF aggregation) | Under 1 s | Under 2 s | Under 3 s | Multi-domain aggregation |
| Attack graph traversal | Under 1.5 s | Under 3 s | Under 5 s | Graph database query |
| Compliance report (full export) | Under 5 s | Under 10 s | Under 30 s | Large data export |

Rate limits apply per plan (see the [API Reference](/docs/reference/api)). Rate-limit headers (\`X-RateLimit-Remaining\`, \`X-RateLimit-Reset\`) are returned on every response so your client can self-throttle.

## Support response SLAs

Support response is governed by severity classification. Severity is set when you submit a ticket; we may upgrade or downgrade it based on observed impact, with notification to you.

![Support response SLA — ticket flow and severity targets for Critical, High, Medium, and Low](/diagrams/trust-sla-support.svg)

| Severity | Definition | First response | Target resolution | Coverage |
| --- | --- | --- | --- | --- |
| Critical | Platform inaccessible · data loss risk · security breach | Under 1 hour | Under 4 hours | 24/7/365 |
| High | Core feature broken with no workaround · scan failures | Under 4 hours | Under 24 hours | Business hours |
| Medium | Feature degraded · workaround available | Under 24 hours | Under 5 business days | Business hours |
| Low | Questions · documentation requests · feature suggestions | Under 72 hours | Under 14 business days | Business hours |

**Business hours:** Monday–Friday, 09:00–18:00 in your account's primary support region (default IST, configurable for Enterprise).

**Critical and High coverage** is 24/7/365 for Growth and Enterprise plans.

**Support channels:** email at \`support@onam.io\` · in-app chat (Growth and Enterprise) · dedicated Slack Connect channel (Enterprise).

## Scheduled maintenance

The platform schedules maintenance windows during low-traffic hours. Maintenance does not count against the uptime SLA provided proper notice is given.

| Window | Schedule | Max duration | Notice |
| --- | --- | --- | --- |
| Weekly | Sunday 02:00–04:00 UTC | 2 hours | 24 hours via status page |
| Monthly | Last Sunday of month, 02:00–06:00 UTC | 4 hours | 72 hours via email and status page |
| Emergency | As required (security-critical patches) | Varies | As soon as possible — email and status page |

The weekly window is applied if needed and skipped if not — most weeks pass without maintenance. The monthly window is reserved for larger updates (schema migrations, dependency upgrades).

Subscribe to maintenance and incident notifications at [status.onam.io](https://status.onam.io) — the status page also carries real-time platform status and incident history, with email or SMS alerts available.

## SLO measurement and reporting

We measure uptime and latency continuously via synthetic monitoring and report results to you monthly. The same metrics drive on-call paging, incident declaration, and post-incident reviews.

![SLO measurement and reporting flow — synthetic probes, metrics, alerting, status page, post-incident review](/diagrams/trust-sla-measurement.svg)

The five-stage measurement pipeline:

1. **Probe** — synthetic monitors run every 60 seconds from 3 geographic regions, hitting the portal, the API, and the scan trigger endpoint.
2. **Collect** — latency, success rate, and scan completion times are stored for 13 months as SLA evidence.
3. **Evaluate** — SLO breach detection (2-of-3 probes failing for 3 minutes) pages on-call automatically.
4. **Publish** — a real-time status page for transparency, plus a monthly SLO report delivered in your account dashboard.
5. **Review** — a post-incident review is published within 5 days of any major incident, including root cause and prevention measures.

### Monthly SLO report

Available in your account under **Settings → SLO Report**. It includes:

- Uptime percentage for the month
- Scan success rate (scans that completed without error)
- P95 / P99 API response times
- Incident count and total downtime minutes
- SLA credit eligibility
- A downloadable PDF for compliance evidence

## Enterprise SLA addendum

Enterprise plans can negotiate custom SLA terms. Common customizations:

| Customizable term | Default | Enterprise range |
| --- | --- | --- |
| Uptime SLA | 99.95% | Up to 99.99% |
| Credit percentage | 50% | Up to 100% |
| Support response (Critical) | Under 1 hour | Under 15 minutes |
| Dedicated support engineer | No | Yes |
| Custom maintenance window | No | Yes |
| Data residency | Account default | EU-only · US-only · Government cloud |
| Scan frequency | Daily | Up to hourly |
| SLA reporting | Monthly in-app | Monthly plus quarterly review call |

Contact \`sales@onam.io\` to discuss Enterprise SLA terms.

> SLAs are subject to the Master Service Agreement (MSA). In case of conflict, the MSA governs. For SLA credit claims: \`support@onam.io\`. Effective 2026-01-01, last reviewed 2026-05-09.

## Next steps

- [Trust Center](/docs/trust/security) — certifications, incident response, and business continuity targets
- [Data Retention](/docs/trust/data-retention) — retention windows and deletion guarantees
- [API Reference](/docs/reference/api) — rate limits and the endpoints these SLOs cover
- [Book a demo](/request-demo) — discuss Enterprise SLA terms with our team
`,
  },
  {
    slug: "reference/api",
    title: "API Reference",
    breadcrumb: "Reference / API",
    body: `
The platform exposes a unified REST API across every security domain: about 166 endpoints across roughly 60 routers, served from a single base path (\`/api/v1\`) behind a FastAPI BFF gateway. Every call is tenant-scoped, permission-checked at the engine layer, and idempotent on \`scan_run_id\` — you can integrate the platform into any CI/CD pipeline, GRC tool, or custom dashboard with a single set of credentials.

This reference covers authentication, base URLs, pagination, error handling, and the endpoint map. For the exact shape of finding objects, see the [Finding Schema](/docs/reference/finding-schema).

![REST API reference — authentication flow, engine endpoint categories, pagination, and response format](/diagrams/api-reference.svg)

## Authentication

All API requests require a valid signed token. The token is issued by the platform's authentication service when you log in, scoped to your tenant ID, and validated on every request.

![API authentication flow — six-step path from login to tenant-scoped engine response](/diagrams/ref-api-auth-flow.svg)

Reading the flow top to bottom:

1. **POST /api/auth/login** — the client sends credentials.
2. **Set-Cookie: access_token** — the platform issues a signed token, scoped to your tenant ID.
3. **GET /api/v1/...** — the client makes an API call, sending the token cookie.
4. **Validate token and build AuthContext** — the gateway decodes the token and builds an internal context with tenant ID, role, and permissions.
5. **Forward to engine with X-Auth-Context** — the gateway hands the request to the engine with a signed context header; engines never trust client-supplied identity.
6. **Engine returns a scoped response** — the engine validates the required permission via \`require_permission()\`, runs the query with a \`WHERE tenant_id = ?\` filter, and returns the data.

> Two properties worth knowing: the token is signed (tampering invalidates it immediately), and the engine layer does its own permission check — the gateway is not the only line of defense. Cross-tenant probes return **404, not 403**, so attackers cannot use response codes to map another tenant's resources.

### Login

\`\`\`
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password"
}
\`\`\`

The response sets an \`access_token\` cookie. Include this cookie in all subsequent requests.

### API key authentication (coming soon)

Long-lived API keys for programmatic access are on the roadmap. Watch the [release notes](/docs/release-notes) for availability.

## Base URLs and gateway operations

All requests route through the BFF gateway under the \`/api/v1\` prefix. Direct engine access is not supported in production.

| Environment | Base URL |
| --- | --- |
| Production | \`https://api.onam.io/api/v1\` |
| Staging | \`https://api.staging.onam.io/api/v1\` |
| Local dev | \`http://localhost:8000/api/v1\` |

The gateway also exposes three operational endpoints outside the versioned prefix:

| Endpoint | Returns |
| --- | --- |
| \`GET /gateway/health\` | Gateway liveness and upstream engine health summary |
| \`GET /gateway/services\` | Registered engine services and their status |
| \`GET /gateway/openapi.json\` | The merged OpenAPI spec for all routed endpoints |

The OpenAPI document drives any client generator — point \`openapi-generator\` or your tooling of choice at \`/gateway/openapi.json\`.

## Common patterns

### Pagination

List endpoints return the standard \`PaginatedList\` envelope:

\`\`\`
GET /api/v1/check/findings?page=1&page_size=50
\`\`\`

| Parameter | Default | Max | Description |
| --- | --- | --- | --- |
| \`page\` | 1 | — | Page number |
| \`page_size\` | 50 | 200 | Results per page |

Response envelope:

\`\`\`
{
  "items": [ ... ],
  "total": 1247,
  "page": 1,
  "page_size": 50,
  "has_more": true
}
\`\`\`

### Filtering

Most list endpoints support filtering via query parameters:

\`\`\`
GET /api/v1/check/findings?severity=critical&provider=aws&status=OPEN
\`\`\`

Common filter fields are \`severity\`, \`provider\` (\`aws\`, \`azure\`, \`gcp\`, \`oci\`, \`alicloud\`, \`ibm\`, \`k8s\`), \`status\`, \`region\`, \`account_id\`, and \`resource_type\`.

### Error responses

Errors return a structured envelope — never a bare string:

\`\`\`
{
  "page": "vulnerability",
  "error_code": "FORBIDDEN",
  "message": "Missing permission: vulnerability:read",
  "detail": null,
  "degraded_engines": []
}
\`\`\`

The \`degraded_engines\` field lists any upstream engines that failed during a multi-engine aggregation, so a dashboard call can succeed partially and tell you which domain is stale.

| Status | Meaning |
| --- | --- |
| \`400\` | Bad request — invalid parameters |
| \`401\` | Unauthenticated — missing or expired token |
| \`403\` | Forbidden — insufficient permissions |
| \`404\` | Not found — includes cross-tenant probes, by design |
| \`422\` | Validation error — see the \`detail\` field |
| \`500\` | Internal server error |
| \`503\` | Upstream engine unavailable — check \`degraded_engines\` |

## Endpoints by engine

The gateway routes \`/api/v1/<prefix>\` to the owning engine. Every endpoint shares the same response envelope, error envelope, and pagination contract — once you've integrated one engine, the others work the same way.

![API endpoints by engine — gateway routes per-engine prefixes under a unified contract](/diagrams/ref-api-endpoints.svg)

| Area | Prefixes |
| --- | --- |
| Discovery and posture | \`/di\` (discovery and inventory) · \`/check\` (CSPM rule findings) · \`/rules\` (rule catalog) · \`/compliance\` (framework scores and reports) |
| Identity and data | \`/iam-security\` · \`/data-security\` · \`/database-security\` · \`/encryption\` |
| Workload and network | \`/network-security\` · \`/container-security\` · \`/cwpp\` · \`/cnapp\` · \`/agent\` (host agents) |
| Threat and detection | \`/cdr\` (behavioral detection) · \`/ai-security\` · \`/apisec\` · \`/secops\` (SAST, DAST, SCA) |
| Risk and reporting | \`/risk\` (FAIR quantification) · \`/billing\` |
| Operations | \`/scans\` · \`/scan-runs\` · \`/schedules\` · \`/pipeline\` (pipeline monitor) · \`/onboarding\` · \`/cloud-accounts\` · \`/accounts\` · \`/tenants\` · \`/technology\` (self-hosted technology scanning) |

Beyond the per-engine prefixes, cross-cutting endpoints live directly under \`/api/v1\` — the dashboard, attack paths, inventory, asset context, and the universal finding-detail views.

## Representative endpoints

A sample of the most-used endpoints across the surface. The full, always-current list is in the OpenAPI spec at \`/gateway/openapi.json\`.

| Method | Path | Returns |
| --- | --- | --- |
| \`GET\` | \`/api/v1/dashboard\` | Aggregated posture overview across all engines |
| \`GET\` | \`/api/v1/attack-paths\` | Attack paths ranked by risk (Attack Path v2) |
| \`GET\` | \`/api/v1/compliance/framework/{framework_id}/report\` | Full per-framework compliance report |
| \`GET\` | \`/api/v1/cdr/heatmap\` | Detection heatmap from behavioral analysis |
| \`GET\` | \`/api/v1/vulnerability/findings/stats\` | Vulnerability statistics by severity, EPSS, and KEV |
| \`GET\` | \`/api/v1/risk/blast-radius\` | Financial blast-radius analysis (FAIR) |
| \`GET\` | \`/api/v1/risk/crown-jewels\` | Crown-jewel assets and their exposure |
| \`GET\` | \`/api/v1/inventory/asset/{resource_uid}/blast-radius\` | Blast radius for a single asset |
| \`GET\` | \`/api/v1/asset-context/{resource_uid}\` | Cross-engine context for one resource |
| \`GET\` | \`/api/v1/views/finding/{engine}/{id}\` | Full finding detail — header, related findings, compliance, remediation |
| \`PATCH\` | \`/api/v1/views/finding/{engine}/{id}/status\` | Update finding status, with audit log |

**Example — per-framework compliance report:**

\`\`\`
GET /api/v1/compliance/framework/cis-aws-v3/report
Cookie: access_token=<token>
\`\`\`

\`\`\`
{
  "framework_id": "cis-aws-v3",
  "framework_name": "CIS AWS Foundations Benchmark v3.0",
  "score": 78.4,
  "pass_count": 312,
  "fail_count": 86,
  "total_controls": 398,
  "last_evaluated": "2026-07-18T10:00:00Z",
  "trend": [
    { "date": "2026-06-01", "score": 74.1 },
    { "date": "2026-07-01", "score": 78.4 }
  ]
}
\`\`\`

**Example — dashboard overview:**

\`\`\`
GET /api/v1/dashboard
\`\`\`

\`\`\`
{
  "posture_score": 72,
  "critical_findings": 12,
  "high_findings": 47,
  "total_resources": 8432,
  "accounts_connected": 3,
  "last_scan": "2026-07-18T10:00:00Z",
  "compliance_summary": {
    "cis-aws-v3": 78.4,
    "nist-csf-2": 81.2
  }
}
\`\`\`

## Rate limits

| Plan | Requests per minute | Requests per hour |
| --- | --- | --- |
| Starter | 60 | 1,000 |
| Growth | 300 | 10,000 |
| Enterprise | 1,000 | 50,000 |

Rate limit headers are returned on every response:

\`\`\`
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 247
X-RateLimit-Reset: 1784548800
\`\`\`

> Build your client to honor \`X-RateLimit-Remaining\` and back off before hitting the limit. Bulk exports should paginate with \`page_size=200\` and respect \`has_more\` rather than issuing parallel page requests.

## SDKs and client libraries

Official clients are in development. Until they ship, generate a client from the OpenAPI spec at \`/gateway/openapi.json\`.

| Language | Status |
| --- | --- |
| Python | Planned |
| Go | Planned |
| Terraform provider | Planned |

## Next steps

- [Finding Schema](/docs/reference/finding-schema) — the exact shape of every finding object the API returns
- [RBAC & SSO](/docs/reference/rbac-and-sso) — the \`feature:action\` permissions each endpoint requires
- [Integration Catalog](/docs/reference/integration-catalog) — push findings to Jira, Slack, Splunk, and webhooks instead of polling
- [Quickstart](/docs/getting-started/quickstart) — connect your first cloud account and run a scan
`,
  },
  {
    slug: "reference/finding-schema",
    title: "Finding Schema",
    breadcrumb: "Reference / Finding Schema",
    body: `
Every engine on the platform — CSPM checks, CIEM, vulnerability, data security, CDR, and the rest of the 29 engines — emits findings normalized to one shared data model. This reference documents that model: the base finding item, the detail response with its compliance and remediation blocks, the list envelopes, the status lifecycle, and the severity scale. If you consume findings through the [REST API](/docs/reference/api) or a [webhook integration](/docs/reference/integration-catalog), this is the contract.

![The findings view in the Onam console (demo account)](/screenshots/screenshot-findings.png)

## Where findings come from

Engines write findings into tenant-scoped engine databases during each scan run. The BFF gateway serves them through two shapes: compact list rows for tables (\`GET /api/v1/<engine>/findings\`) and a full detail document for the finding page (\`GET /api/v1/views/finding/{engine}/{id}\`).

![How data flows from cloud scans through engines to the API](/diagrams/arch-data-flow.svg)

Field naming is cloud-neutral by design, so one integration works across all 7 providers:

| Canonical field | Instead of |
| --- | --- |
| \`resource_uid\` | ARN, instance ID, compartment OCID |
| \`account_id\` | Subscription ID, project ID |
| \`region\` | Availability zone |
| \`provider\` | One of \`aws\`, \`azure\`, \`gcp\`, \`oci\`, \`alicloud\`, \`ibm\`, \`k8s\` |
| \`provider_metadata\` | Opaque dict for CSP-specific fields that don't normalize |

## BaseFindingItem

\`BaseFindingItem\` is the required base for every per-finding list item, regardless of engine.

| Field | Type | Notes |
| --- | --- | --- |
| \`finding_id\` | string | Stable identifier, unique per engine |
| \`resource_uid\` | string | Cloud-neutral resource identifier |
| \`resource_type\` | string | e.g. \`aws_s3_bucket\`, \`azure_storage_account\` |
| \`provider\` | enum | \`aws\`, \`azure\`, \`gcp\`, \`oci\`, \`alicloud\`, \`ibm\`, \`k8s\` |
| \`region\` | string | Region the resource lives in |
| \`severity\` | enum | \`critical\`, \`high\`, \`medium\`, \`low\`, \`info\` |
| \`status\` | string | Lifecycle status — see below |
| \`account_id\` | string, optional | Cloud account, subscription, or project |
| \`scan_run_id\` | string, optional | The scan run that produced or last confirmed the finding |
| \`first_seen_at\` | datetime, optional | First scan run that raised the finding |
| \`last_seen_at\` | datetime, optional | Most recent scan run that still observed it |
| \`provider_metadata\` | object | CSP-specific extras that don't normalize across clouds |

> **Credential fields never reach the API.** \`credential_ref\` and \`credential_type\` are declared on the model but excluded from serialization, and a validator rejects any payload containing credential- or secret-material keys anywhere in its nested structure. This is enforced in the schema layer as defense in depth — not just in the UI.

### Example finding

\`\`\`
{
  "finding_id": "chk-4f9a2c31",
  "resource_uid": "arn:aws:s3:::billing-exports",
  "resource_type": "aws_s3_bucket",
  "provider": "aws",
  "region": "us-east-1",
  "severity": "critical",
  "status": "OPEN",
  "account_id": "123456789012",
  "scan_run_id": "550e8400-e29b-41d4-a716-446655440000",
  "first_seen_at": "2026-06-28T04:12:09Z",
  "last_seen_at": "2026-07-19T04:10:44Z",
  "provider_metadata": {
    "bucket_policy_is_public": true,
    "block_public_access_enabled": false
  }
}
\`\`\`

## Severity levels

Five severity levels apply across all engines. Severity is assigned by the rule (for configuration findings) or computed (for vulnerabilities, where EPSS and CISA KEV feed prioritization).

| Severity | Meaning | Recommended remediation window |
| --- | --- | --- |
| Critical | Exploitable exposure with severe impact — public data, admin-level privilege escalation, actively exploited CVEs | 7 days |
| High | Significant weakness likely to be exploited or with broad blast radius | 30 days |
| Medium | Weakness requiring specific preconditions, or partial control failure | 90 days |
| Low | Hardening gap with limited direct impact | Next maintenance cycle |
| Info | Observation, inventory fact, or best-practice note — no action required | — |

## Status lifecycle

Finding status is mutable through the console and the API. New findings open as \`OPEN\`; every transition is audit-logged.

| Status | Meaning | Set by |
| --- | --- | --- |
| \`OPEN\` | Detected and unresolved — the default for new or regressed findings | Automatic |
| \`IN_PROGRESS\` | Assigned and being remediated | Manual |
| \`RESOLVED\` | Fixed — a subsequent scan verifying the fix also resolves it automatically | Manual or automatic on rescan |
| \`SUPPRESSED\` | Accepted risk — hidden from default views, kept for audit | Manual, note recommended |
| \`FALSE_POSITIVE\` | Judged not a real issue — feeds rule tuning | Manual, note recommended |

Status is updated with a \`StatusUpdateRequest\`:

\`\`\`
PATCH /api/v1/views/finding/{engine}/{id}/status

{
  "status": "SUPPRESSED",
  "note": "Public access is intentional - static website bucket, exception EX-142."
}
\`\`\`

| Field | Type | Notes |
| --- | --- | --- |
| \`status\` | enum | \`OPEN\`, \`IN_PROGRESS\`, \`RESOLVED\`, \`SUPPRESSED\`, \`FALSE_POSITIVE\` |
| \`note\` | string, optional | Free-text justification, stored in the audit log |

> If a resource regresses after being \`RESOLVED\` — the misconfiguration comes back — the next scan reopens the finding as \`OPEN\` and preserves the original \`first_seen_at\`, so your mean-time-to-remediate metrics stay honest.

## FindingDetailResponse

\`GET /api/v1/views/finding/{engine}/{id}\` returns the full detail document that powers the finding page's tabs. The \`engine\` path segment is one of: \`check\`, \`threat\`, \`iam\`, \`network-security\`, \`datasec\`, \`encryption\`, \`container-security\`, \`dbsec\`, \`ai-security\`, \`cdr\`, \`secops\`, \`attack-path\`, \`api-security\`.

| Field | Type | Notes |
| --- | --- | --- |
| \`finding\` | FindingHeader | The full header — also aliased as \`header\` |
| \`relatedFindings\` | RelatedFindingsBlock | Cross-engine findings on the same resource |
| \`compliance\` | ComplianceBlock | Framework control mappings for the rule |
| \`remediation\` | RemediationBlock | Ordered fix steps and references |
| \`resourceContext\` | object, optional | Null here — the UI calls \`/api/v1/asset-context/{resource_uid}\` separately |
| \`engineExtensions\` | object | Engine-specific extra tab payloads |
| \`degradedEngines\` | string list | Engines that timed out during the related-findings fan-out |
| \`restrictedEngines\` | string list | Engines your role may not read (viewer role restrictions) |

### FindingHeader

The header carries identity, rule metadata, taxonomy, and framework mappings. Detail responses use camelCase field names. Key fields:

| Field | Type | Notes |
| --- | --- | --- |
| \`findingId\`, \`engine\`, \`ruleId\` | string | Identity — which rule fired, in which engine |
| \`title\`, \`description\`, \`rationale\` | string | Human-readable summary and why it matters |
| \`severity\`, \`status\`, \`riskScore\` | string, string, int | Triage fields; \`riskScore\` is 0–100 |
| \`resourceUid\`, \`resourceType\`, \`resourceName\` | string | The affected resource |
| \`provider\`, \`accountId\`, \`region\` | string | Where it lives |
| \`firstSeenAt\`, \`lastSeenAt\` | datetime | Lifecycle timestamps |
| \`module\`, \`module_label\`, \`subcategory\`, \`subcategory_label\` | string | Taxonomy codes and display labels for filter grouping |
| \`ruleType\` | string | \`config\`, \`cdr\`, or \`threat\` |
| \`mitreTactics\`, \`mitreTechniques\` | string list | MITRE ATT&CK mappings, when threat-relevant |
| \`cisBenchmark\`, \`cisSection\`, \`nistControls\`, \`soc2Criteria\` | string / list | Direct framework references on the rule |
| \`ticketId\`, \`ticketUrl\` | string | Linked Jira or ServiceNow ticket, if one exists |
| \`standardColumns\` | StandardColumns | The mandatory 14 columns echoed from every finding table |
| \`findingData\` | object | Engine-specific evidence payload |

### ComplianceBlock

Maps the finding's rule to compliance controls across the 78 supported frameworks.

| Field | Type | Notes |
| --- | --- | --- |
| \`available\` | boolean | False when the engine has no rule-to-control mapping |
| \`controlMappings\` | list | Items of \`{ framework, controlId, controlName, status }\` |

### RemediationBlock

| Field | Type | Notes |
| --- | --- | --- |
| \`available\` | boolean | False when no guidance exists for the rule |
| \`steps\` | RemediationStep list | Ordered steps — \`{ order, action, detail }\` |
| \`referenceItems\` | list | \`{ url, title }\` links to vendor documentation |
| \`estimatedEffort\` | string, optional | e.g. "15 minutes" |
| \`slaPriority\` | string, optional | Suggested remediation window from the severity table above |
| \`guidance\`, \`markdown\` | string, optional | Long-form guidance |
| \`runbook_url\` | string, optional | Link to an internal runbook, if configured |

### RelatedFindingsBlock

Cross-engine findings on the same \`resource_uid\`, fetched with a bounded per-engine fan-out.

| Field | Type | Notes |
| --- | --- | --- |
| \`available\` | boolean | Whether the fan-out ran |
| \`items\` | list | \`{ engine, findingId, severity, ruleId, title, status }\` |
| \`perEngineAvailability\` | object | Which engines answered within the time budget |
| \`restrictedEngines\` | string list | Engines omitted because your role lacks \`<engine>:read\` |

## List envelopes

Three container shapes wrap findings in list and aggregate responses.

**PaginatedList** — every scrollable table:

| Field | Type | Notes |
| --- | --- | --- |
| \`items\` | list | Page of finding items |
| \`total\` | int | Total matching rows |
| \`page\`, \`page_size\` | int | Defaults 1 and 50; \`page_size\` max 200 |
| \`has_more\` | boolean | True when further pages exist |

**SeverityCounts** — KPI breakdowns:

| Field | Type | Notes |
| --- | --- | --- |
| \`critical\`, \`high\`, \`medium\`, \`low\`, \`info\` | int | Counts per severity |
| \`by_provider\` | object | Per-provider SeverityCounts — populated only on multi-cloud aggregation pages (dashboard, compliance, risk) |

**ScanRunRef** — lightweight scan-run metadata attached to results:

| Field | Type | Notes |
| --- | --- | --- |
| \`scan_run_id\` | string | The run identifier |
| \`provider\`, \`account_id\` | string, optional | Which account the run covered |
| \`completed_at\` | datetime, optional | Completion time |
| \`total_findings\` | int, optional | Findings produced by the run |

## Next steps

- [API Reference](/docs/reference/api) — authentication, pagination, and the endpoint map these schemas travel through
- [CSPM](/docs/features/cspm) — how the Check engine evaluates 9,853 posture rules to produce configuration findings
- [Integration Catalog](/docs/reference/integration-catalog) — push these finding payloads to Jira, Slack, Splunk, or any webhook
- [Data Retention](/docs/trust/data-retention) — how long findings are stored and when they are deleted
`,
  },
  {
    slug: "reference/integration-catalog",
    title: "Integration Catalog",
    breadcrumb: "Reference / Integration Catalog",
    body: `
Connect the platform to your existing security toolchain. Every integration is configured under **Settings → Integrations**, takes 2–5 minutes to set up, and uses your existing credentials in the target system — no service accounts to provision separately. The platform pushes findings, scan events, and compliance scores; some integrations (Jira, ServiceNow, GitHub Issues) also sync state back so closures propagate to the right side.

![Integration catalog — SIEM and observability, ticketing and workflow, alerting and CI/CD integrations](/diagrams/integrations.svg)

Why integrations matter: the platform is best when its findings show up where your team already lives — in Slack channels, Jira queues, PagerDuty rotations, Splunk dashboards. A finding that gets emailed once and forgotten doesn't get fixed; a finding that lands as a tracked Jira ticket does.

## Integration ecosystem

The catalog is grouped into six categories. Teams typically connect 3–5 on first onboarding (Slack, Jira, and Splunk are the most common starter set) and add more over time.

| Category | Why connect | Typical integrations |
| --- | --- | --- |
| Ticketing and project management | Get findings into the queue your team already works from | Jira · ServiceNow · Azure DevOps · Linear · GitHub Issues |
| Messaging and alerting | Get critical findings to humans within minutes | Slack · Microsoft Teams · PagerDuty · OpsGenie · Email |
| SIEM and observability | Correlate findings with your security telemetry | Splunk · Azure Sentinel · AWS Security Hub · Datadog · Sumo Logic · IBM QRadar |
| SOAR and automation | Trigger your playbook automatically on critical findings | Cortex XSOAR · Torq · Tines · Generic Webhook |
| Compliance and GRC | Push compliance evidence to your audit-tracking platform | Drata · Vanta · Hyperproof |
| CI/CD and code | Catch IaC and code issues before merge | GitHub Actions · GitLab CI · Jenkins · Azure Pipelines |

## Available integrations

### Ticketing and project management

| Integration | Status | What it does |
| --- | --- | --- |
| Jira | Available | Auto-create issues for critical/high findings; sync status back to the platform |
| ServiceNow | Available | Create incidents for findings; bidirectional status sync |
| Azure DevOps | Coming soon | Create work items for security findings |
| Linear | Coming soon | Create Linear issues for code security findings |
| GitHub Issues | Coming soon | Create issues linked to SecOps findings |

### Messaging and alerting

| Integration | Status | What it does |
| --- | --- | --- |
| Slack | Available | Send finding alerts to channels; per-severity routing |
| Microsoft Teams | Available | Send alerts to Teams channels |
| PagerDuty | Available | Page on-call for critical findings; auto-resolve when fixed |
| OpsGenie | Available | Create OpsGenie alerts for critical findings |
| Email / SMTP | Available | Daily or weekly digest; real-time critical alerts |

### SIEM and observability

| Integration | Status | What it does |
| --- | --- | --- |
| Splunk | Available | Stream findings and scan events to Splunk HEC |
| Azure Sentinel | Available | Forward findings as Sentinel custom logs |
| AWS Security Hub | Available | Push findings in ASFF format to Security Hub |
| Datadog | Coming soon | Stream findings as Datadog events |
| Sumo Logic | Coming soon | Stream findings to a Sumo Logic HTTP source |
| IBM QRadar | Coming soon | Push findings via QRadar syslog/CEF |

### SOAR, GRC, and CI/CD

| Integration | Status | What it does |
| --- | --- | --- |
| Generic Webhook | Available | POST findings to any HTTP endpoint |
| GitHub Actions | Available | Scan IaC and code repos in CI; fail PRs on new critical findings |
| GitLab CI | Available | Same as GitHub Actions for GitLab pipelines |
| Cortex XSOAR | Coming soon | Trigger XSOAR playbooks from findings |
| Torq | Coming soon | Trigger Torq workflows from findings |
| Tines | Coming soon | Trigger Tines stories from findings |
| Drata | Coming soon | Push compliance evidence to Drata |
| Vanta | Coming soon | Push compliance evidence to Vanta |
| Hyperproof | Coming soon | Push compliance evidence to Hyperproof |
| Jenkins | Coming soon | Jenkins plugin for IaC scanning |
| Azure Pipelines | Coming soon | Task for IaC scanning in Azure DevOps pipelines |

## Jira setup

The Jira integration is the most-used integration on the platform. It auto-creates Jira issues for findings that match your filters and bidirectionally syncs status — closing the Jira issue acknowledges the finding, and re-opening the Jira issue re-opens the finding.

![Jira auto-create flow — critical finding triggers a Jira issue, the team remediates, a scan verifies, the finding auto-closes](/diagrams/ref-int-jira-flow.svg)

Reading the flow left to right:

1. **Critical finding detected** — for example, an S3 bucket with public access containing PII.
2. **Auto-create rule** — the integration filter decides whether to create an issue (Critical only, Critical + High, or all findings).
3. **Jira issue created** — populated with summary, description, priority, labels, and an Onam deep link.
4. **Team remediates** — standard Jira workflow; move to Done when the cloud config is fixed.
5. **Auto-close** — the next scan verifies the fix and resolves the finding, which also marks the Jira issue done if it isn't already.

Setup steps:

1. Navigate to **Settings → Integrations → Jira → Connect**.
2. Enter your Jira base URL (for example, \`https://yourcompany.atlassian.net\`).
3. Enter a Jira API token (generate one at [id.atlassian.com](https://id.atlassian.com/manage-profile/security/api-tokens)) and your Jira email address.
4. Click **Test Connection**, then configure the options below, then **Save**.

| Option | What to set |
| --- | --- |
| Project key | Which Jira project to create issues in |
| Issue type | Bug, Task, or Story — Bug or a custom Security type recommended |
| Severity mapping | Critical to Priority Highest, High to High, and so on |
| Auto-create threshold | Critical only · Critical + High · All findings |

Jira issue fields populated automatically:

- Summary: \`[Onam] {rule_title} - {resource_uid}\`
- Description: finding detail, affected resource, remediation steps, and a console deep link
- Priority: mapped from finding severity
- Labels: \`onam\`, \`cloud-security\`, and the provider name

## Slack setup

1. Navigate to **Settings → Integrations → Slack → Connect**.
2. Click **Connect to Slack** and authorize the app in your workspace.
3. Map notification channels to severity levels.

| Channel (example) | Receives |
| --- | --- |
| \`#security-critical\` | Critical findings only |
| \`#security-alerts\` | High and above |
| \`#security-digest\` | Daily summary |

Example Slack message:

\`\`\`
CRITICAL finding detected
Rule: S3 Bucket Public Access Not Blocked
Resource: arn:aws:s3:::my-bucket
Account: production-aws (123456789012)
Region: us-east-1
First seen: 2026-07-18 10:00 UTC

Remediation: Enable S3 Block Public Access...
[View in Onam] [Create Jira Issue]
\`\`\`

## Webhooks

The generic webhook sends a POST request to your endpoint for every event that matches your configured filters — the building block for any SOAR playbook or custom automation.

Setup steps:

1. Navigate to **Settings → Integrations → Webhook → Add Webhook**.
2. Enter the endpoint URL.
3. Configure an optional HMAC secret for payload verification.
4. Set filters: severity, provider, resource type, status.
5. Click **Test** to send a sample payload.

Payload format:

\`\`\`
{
  "event": "finding.created",
  "timestamp": "2026-07-18T10:00:00Z",
  "tenant_id": "your-tenant",
  "finding": {
    "finding_id": "chk-4f9a2c31",
    "rule_id": "AWS-S3-001",
    "rule_title": "S3 Bucket Public Access Not Blocked",
    "severity": "critical",
    "status": "OPEN",
    "resource_uid": "arn:aws:s3:::my-bucket",
    "resource_type": "aws_s3_bucket",
    "provider": "aws",
    "region": "us-east-1",
    "account_id": "123456789012",
    "remediation": "Enable S3 Block Public Access...",
    "first_seen_at": "2026-07-18T10:00:00Z"
  }
}
\`\`\`

The \`finding\` object follows the [Finding Schema](/docs/reference/finding-schema).

Verifying the signature:

\`\`\`
import hmac, hashlib

def verify_webhook(payload: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)
\`\`\`

> Always configure the HMAC secret and verify the \`X-Onam-Signature\` header before acting on a webhook. Without verification, anyone who discovers your endpoint URL can inject fake findings into your automation.

Webhook event types:

| Event | Trigger |
| --- | --- |
| \`finding.created\` | New failing finding detected |
| \`finding.resolved\` | Previously failing finding now passes |
| \`finding.severity_changed\` | Finding severity escalated or de-escalated |
| \`scan.completed\` | Full scan pipeline completed |
| \`scan.failed\` | Engine scan failure |
| \`compliance.score_changed\` | Framework score changed by 5% or more |

## SIEM forwarding

### Splunk

1. In Splunk, create an HTTP Event Collector (HEC) token under **Settings → Data Inputs → HTTP Event Collector → New Token**, with source type \`onam:findings\`.
2. In the Onam console, navigate to **Settings → Integrations → Splunk → Connect**.
3. Enter the HEC URL (\`https://your-splunk-instance:8088\`), the HEC token from step 1, and the target index (for example, \`security\`).
4. Click **Test Connection**, then **Save**.

Findings stream to Splunk in real time after each scan completes. Example search:

\`\`\`
index=security sourcetype=onam:findings severity=critical status=OPEN
| table _time, rule_title, resource_uid, provider, region, account_id
| sort -_time
\`\`\`

### AWS Security Hub

1. Enable Security Hub in your AWS account.
2. In the Onam console: **Settings → Integrations → AWS Security Hub → Connect**.
3. Select the AWS region where Security Hub is enabled.
4. Enter the account ID and an IAM role ARN with the \`securityhub:BatchImportFindings\` permission.
5. Click **Save**.

Findings are forwarded in ASFF (AWS Security Finding Format) and appear in Security Hub under the custom product name Onam.

## Request an integration

Don't see an integration you need?

- In-app: **Settings → Integrations → Request Integration**
- Email: \`integrations@onam.io\`

Integration status changes are announced in the [release notes](/docs/release-notes).

## Next steps

- [API Reference](/docs/reference/api) — pull findings programmatically instead of (or alongside) push integrations
- [Finding Schema](/docs/reference/finding-schema) — the exact payload shape webhooks and SIEM streams deliver
- [SecOps](/docs/features/secops) — the SAST, SCA, and IaC scanning that backs the CI/CD integrations
- [RBAC & SSO](/docs/reference/rbac-and-sso) — who on your team can configure integrations
`,
  },
  {
    slug: "reference/rbac-and-sso",
    title: "RBAC & SSO",
    breadcrumb: "Reference / RBAC & SSO",
    body: `
This guide covers user roles, permissions, team management, and single sign-on (SSO) configuration. The model is built around 5 seeded roles with 27 permissions in \`feature:action\` format, three-layer tenant isolation, and SAML 2.0 / Google OAuth SSO with optional group-to-role mapping. Everything below applies tenant by tenant — your roles, your permissions, your audit log.

![RBAC role permission matrix for 5 roles and the SSO SAML 2.0 configuration flow](/diagrams/rbac-sso.svg)

Why RBAC matters: every customer environment combines auditors who need read-only access, analysts who triage findings, and admins who change settings. Mixing those audiences on a single role creates either too-loose access (auditors see sensitive data) or too-tight access (analysts cannot acknowledge findings). The role catalog is designed to fit those audiences without customization for 95% of teams.

## Role model

The platform ships with 5 hierarchical roles. Higher-level roles inherit the read permissions of lower-level roles. You assign one role per user per tenant — a user can hold different roles in different tenants if your org has several.

| Role | Level | Scope | Typical user |
| --- | --- | --- | --- |
| \`platform_admin\` | L1 | Entire platform — all organizations and tenants | Onam support team only — customers never get this role |
| \`org_admin\` | L2 | All tenants within your organization | IT director, CISO |
| \`tenant_admin\` | L4 | Single tenant (cloud environment) | Security team lead, DevSecOps lead |
| \`analyst\` | L4 | Single tenant — read plus triage findings | Day-to-day security analyst, SOC operator |
| \`viewer\` | L4 | Single tenant — read-only, non-sensitive engines only | Auditor, executive, board-reporting reader |

\`platform_admin\` is reserved for Onam SREs. It exists for support workflows that require an explicit, audit-logged impersonation handshake you approve.

The hierarchy is additive on reads and intersection-based on writes: a \`tenant_admin\` can do everything an \`analyst\` can, and an \`analyst\` everything a \`viewer\` can — but writes don't cascade upward, so a \`tenant_admin\` cannot perform \`org_admin\` actions like billing.

## Permission matrix

All permissions follow the \`feature:action\` format: 27 permissions across 18 features and 4 action verbs (\`read\`, \`write\`, \`create\`, \`delete\`).

![RBAC permissions — 27 permissions grouped by domain in feature:action format with role mapping](/diagrams/ref-rbac-permissions.svg)

The permissions fall into four groups:

1. **Base read (every role, including viewer)** — 9 read permissions on non-sensitive engines: \`discoveries\`, \`inventory\`, \`check\`, \`threat\`, \`compliance\`, \`iam\`, \`network\`, \`risk\`, plus \`scans:read\` and \`reports:read\`.
2. **Sensitive read (analyst and above)** — 8 read permissions on engines whose findings carry sensitive detail: \`vulnerability\`, \`datasec\`, \`container\`, \`dbsec\`, \`ai_security\`, \`encryption\`, \`secops\`, \`ciem\`.
3. **Write (tenant_admin and above)** — \`scans:create\`, \`reports:write\`, \`tenants:read\`/\`write\`, \`users:read\`/\`write\`, \`accounts:read\`; \`accounts:write\` and \`billing:read\` are reserved for \`org_admin\`.
4. **Format and granting rules** — the \`feature:action\` convention, role inheritance, and SAML group mapping.

Full role-by-permission matrix:

| Permission | platform_admin | org_admin | tenant_admin | analyst | viewer |
| --- | --- | --- | --- | --- | --- |
| \`discoveries:read\` | Yes | Yes | Yes | Yes | Yes |
| \`inventory:read\` | Yes | Yes | Yes | Yes | Yes |
| \`check:read\` | Yes | Yes | Yes | Yes | Yes |
| \`threat:read\` | Yes | Yes | Yes | Yes | Yes |
| \`compliance:read\` | Yes | Yes | Yes | Yes | Yes |
| \`iam:read\` | Yes | Yes | Yes | Yes | Yes |
| \`network:read\` | Yes | Yes | Yes | Yes | Yes |
| \`risk:read\` | Yes | Yes | Yes | Yes | Yes |
| \`reports:read\` | Yes | Yes | Yes | Yes | Yes |
| \`scans:read\` | Yes | Yes | Yes | Yes | Yes |
| \`vulnerability:read\` | Yes | Yes | Yes | Yes | No |
| \`datasec:read\` | Yes | Yes | Yes | Yes | No |
| \`container:read\` | Yes | Yes | Yes | Yes | No |
| \`dbsec:read\` | Yes | Yes | Yes | Yes | No |
| \`ai_security:read\` | Yes | Yes | Yes | Yes | No |
| \`encryption:read\` | Yes | Yes | Yes | Yes | No |
| \`secops:read\` | Yes | Yes | Yes | Yes | No |
| \`ciem:read\` | Yes | Yes | Yes | Yes | No |
| \`scans:create\` | Yes | Yes | Yes | Yes | No |
| \`reports:write\` | Yes | Yes | Yes | Yes | No |
| \`tenants:read\` | Yes | Yes | Yes | No | No |
| \`users:read\` | Yes | Yes | Yes | No | No |
| \`accounts:read\` | Yes | Yes | Yes | No | No |
| \`tenants:write\` | Yes | Yes | Yes | No | No |
| \`users:write\` | Yes | Yes | Yes | No | No |
| \`accounts:write\` | Yes | Yes | No | No | No |
| \`billing:read\` | Yes | Yes | No | No | No |

> **The viewer role gets HTTP 403 on sensitive engines — by design.** Vulnerability, DataSec, CIEM, Container, DB Security, AI Security, Encryption, and SecOps may include PII column samples, vulnerability paths, or attack chains. The restriction is enforced at the engine endpoint, not just hidden in the UI — auditors with viewer accounts cannot bypass it via direct API call.

![The IAM and RBAC platform view — role assignments, permission matrix, and user management](/diagrams/p-iam.svg)

## Managing users

### Invite a user

The invite flow is a five-step path from admin action to active user with the right permissions.

![User invite flow — admin invites, email sent, user signs in, role applied, access granted](/diagrams/ref-rbac-invite-flow.svg)

1. **Admin sends invite** — **Settings → Users → Invite User**, selecting the role at invite time so the user lands with correct permissions on first login.
2. **Email with signup link** — a signed URL, valid 72 hours, single-use. Lost links must be re-issued, not extended.
3. **User authenticates** — existing accounts log in; new accounts set a password and enroll MFA if your tenant policy requires it.
4. **Role applied** — the permission set is computed and scoped to your tenant ID; an audit-log entry records inviter, invitee, role, and timestamp.
5. **Access granted** — the user lands in the dashboard with the assigned permissions enforced on every API call.

### Change a user's role

1. Navigate to **Settings → Users**, find the user, and click **Edit**.
2. Change the role from the dropdown and click **Save**.

Role changes take effect within 60 seconds via session re-validation. API calls already in flight finish under the old role; the next call uses the new one.

### Remove a user

1. Navigate to **Settings → Users** and click **Remove** next to the user.
2. Confirm the removal.

Removed users lose access immediately. Their findings, audit-log entries, and report attribution are retained — removal does not erase history.

## Single sign-on

The platform supports SAML 2.0 (Okta, Azure AD / Entra ID, Google Workspace, JumpCloud, OneLogin, Ping Identity, ADFS) and Google OAuth (for Google-Workspace-only orgs).

### SAML 2.0

The SAML flow is the standard nine-step SP-initiated handshake. The platform acts as the Service Provider (SP); your IdP authenticates the user.

![SAML 2.0 SSO flow — nine-step handshake from user navigation to authenticated session](/diagrams/ref-rbac-saml-flow.svg)

| Step | Action | Who |
| --- | --- | --- |
| 1 | Navigate to \`/auth/saml/login\` | User |
| 2 | Platform issues a 302 redirect to the IdP with a SAML AuthnRequest | Platform |
| 3 | Browser POSTs the AuthnRequest to the IdP | User |
| 4 | IdP prompts for credentials and MFA | IdP |
| 5 | User authenticates at the IdP | User |
| 6 | IdP returns a signed SAML Response to the browser | IdP |
| 7 | Browser POSTs the response to \`/auth/saml/callback\` | User |
| 8 | Platform validates the signature, extracts the email, maps groups | Platform |
| 9 | Platform sets the \`access_token\` cookie, scoped to your tenant | Platform |

### SAML configuration

Start at **Settings → Authentication → SSO → Configure SAML** and download the Service Provider metadata XML, or configure your IdP with these SP values:

| SP setting | Value |
| --- | --- |
| Entity ID | \`https://api.onam.io/auth/saml/metadata\` |
| ACS URL | \`https://api.onam.io/auth/saml/callback\` |
| Binding | HTTP POST |
| NameID format | \`emailAddress\` |
| Signature algorithm | RSA-SHA256 |

Then enter the IdP values in the platform:

| Platform field | Where to find it in the IdP |
| --- | --- |
| IdP Entity ID | IdP metadata — \`entityID\` attribute |
| IdP SSO URL | IdP metadata — \`SingleSignOnService Location\` |
| IdP Certificate | IdP metadata — \`X509Certificate\` |

Configure attribute mapping:

| Platform attribute | SAML attribute name |
| --- | --- |
| Email | \`email\` or the standard \`emailaddress\` claim URI |
| First name | \`firstName\` or \`givenname\` |
| Last name | \`lastName\` or \`surname\` |
| Groups (optional) | \`groups\` or \`memberOf\` |

Finish with **Test Connection**, then **Save**.

### SAML group-to-role mapping

Map IdP groups to platform roles so role changes in your IdP propagate on the user's next login. Configure under **Settings → Authentication → SSO → Group Mapping**:

| IdP group (example) | Platform role |
| --- | --- |
| \`security-admins\` | \`tenant_admin\` |
| \`security-analysts\` | \`analyst\` |
| \`developers\` | \`viewer\` |

Users get the highest-priority mapped role. Unmapped users can be assigned a default role or blocked entirely.

### Google OAuth

1. Navigate to **Settings → Authentication → SSO → Configure Google OAuth**.
2. In Google Cloud Console, create an OAuth 2.0 Client ID with the authorized redirect URI \`https://api.onam.io/auth/google/callback\`.
3. Enter the Client ID and Client Secret in the platform.
4. Optionally restrict to your Google Workspace domain by entering it (for example, \`yourcompany.com\`) in the Allowed Domain field.
5. Click **Save**.

### Enforce SSO (disable password login)

Once SSO is configured and tested:

1. Navigate to **Settings → Authentication → SSO**.
2. Toggle **Require SSO for all users** and confirm — all non-SSO logins are blocked from this point.

> **Warning:** verify that at least one SSO admin can log in successfully before enabling enforcement. The platform cannot reverse the toggle without a working SSO login.

## Multi-factor authentication

MFA is always enforced for \`platform_admin\` and \`org_admin\` accounts, and can be required for all users in your tenant. Navigate to **Settings → Authentication → MFA** and select who MFA applies to: all users, admins only, or none.

| Method | Details |
| --- | --- |
| TOTP | Google Authenticator, Authy, 1Password — any RFC 6238 app |
| Email OTP | One-time codes via email, for users without a TOTP app |

Users set up MFA on their first login after the policy is enabled. SAML SSO sessions inherit MFA from your IdP — the platform does not require duplicate MFA when the IdP already enforced it.

## Audit logs

Every user-management action is recorded in the audit log and queryable via the API:

\`\`\`
GET /api/v1/audit-logs?action=user.invite&page=1
\`\`\`

\`\`\`
{
  "items": [
    {
      "timestamp": "2026-07-18T10:30:00Z",
      "actor_email": "admin@yourcompany.com",
      "action": "user.invite",
      "target_email": "analyst@yourcompany.com",
      "role": "analyst",
      "ip_address": "203.0.113.1",
      "result": "success"
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 50,
  "has_more": false
}
\`\`\`

Audit events include: login, logout, role change, user invite, user remove, SSO config change, scan trigger, API key create and delete, finding suppression, and framework score export. Audit logs are retained for 7 years (see [Data Retention](/docs/trust/data-retention)) and exportable to your SIEM via webhook or daily S3 sync.

## Troubleshooting

| Issue | Cause | Fix |
| --- | --- | --- |
| HTTP 403 on specific pages | Role lacks the required permission | Check the permission matrix above — upgrade the role or use the right account |
| SAML \`InResponseTo mismatch\` | Clock skew between IdP and SP | Synchronize NTP on the IdP server |
| SAML \`Invalid signature\` | Wrong certificate in SP config | Re-download IdP metadata and update the certificate |
| Google SSO \`redirect_uri_mismatch\` | Wrong redirect URI in Google Console | Set it exactly to \`https://api.onam.io/auth/google/callback\` |
| User not auto-assigned a role via SAML | Group attribute not mapped or not sent | Configure Group Mapping; verify the IdP sends the \`groups\` attribute |
| MFA setup loop | Browser cookies cleared mid-flow | Clear the browser cache fully and retry MFA setup |
| Invite link expired | 72-hour single-use limit hit | Re-issue from **Settings → Users** — links cannot be extended |

For SSO configuration assistance: \`support@onam.io\`.

## Next steps

- [API Reference](/docs/reference/api) — how \`feature:action\` permissions are enforced on every endpoint
- [Trust Center](/docs/trust/security) — the identity and access controls behind the platform itself
- [Quickstart](/docs/getting-started/quickstart) — invite your team after connecting your first cloud account
- [Book a demo](/request-demo) — see role-based views live with our team
`,
  },
];
