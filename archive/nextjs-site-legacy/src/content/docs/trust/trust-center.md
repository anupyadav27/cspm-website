# Trust Center

Security, privacy, and compliance are foundational to the platform. This page is the **authoritative source** for our certifications, security posture, policies, and compliance artifacts. Every claim below is independently audited or backed by a downloadable artifact.

<img src="/diagrams/trust-center.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:24px;" alt="Trust center showing SOC 2 Type II, ISO 27001, data encryption, penetration testing, GDPR compliance and uptime SLA certifications" />

---

## Certifications & Compliance Status

The platform holds the major enterprise security certifications. Six are achieved, three are in progress, and three are on the roadmap. All achieved certifications are backed by current audit reports available on request.

| Certification | Status | Scope | Audit period |
|---|:---:|---|---|
| **SOC 2 Type II** | ✅ Achieved | Security, Availability, Confidentiality | Annual — report available on request |
| **ISO 27001:2022** | ✅ Achieved | ISMS for cloud platform operations | Annual — certificate available on request |
| **ISO 27017** | ✅ Achieved | Cloud-specific security controls | Co-certified with ISO 27001 |
| **PCI DSS v4.0** | ✅ Achieved | Card data handling in billing pipeline | Annual — attestation available on request |
| **GDPR** | ✅ Compliant | EU personal data processing | DPA available — contact `legal@onam.io` |
| **CSA STAR Level 1** | ✅ Achieved | CAIQ self-assessment published | See Downloads section below |
| **ISO 27018** | 🔄 In Progress | Cloud privacy for PII | Target: Q3 2026 |
| **FedRAMP Moderate** | 🔄 In Progress | US federal agency use | Target: Q4 2026 |
| **HIPAA BAA** | ✅ Available | Business Associate Agreement | Contact `sales@onam.io` |
| **ISO 27701** | 📋 Planned | Privacy management | Target: 2027 H1 |
| **SOC 3** | 📋 Planned | Public-facing assurance report | Target: 2027 H1 |
| **IRAP (Australia)** | 📋 Planned | Australian Government use | Target: 2027 H2 |

---

## Downloads

| Document | Access | Last updated |
|---|---|---|
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
| Subprocessor List | Public | See below |
| Data Processing Agreement (DPA) | Public | 2026-01 |

> To request gated documents: **trust@onam.io**

---

## Security Overview

The security program is organized into **five domains**. Each domain has named owners, written policies (reviewable under NDA), and quarterly audit cycles. The summary below is the public-facing version; the full policy set is part of the SOC 2 audit report.

| Domain | What it covers |
|---|---|
| **Infrastructure** | SOC 2-certified cloud infrastructure · encryption at rest (AES-256) · all traffic over TLS 1.3 · environment isolation per tier · no public database endpoints |
| **Application** | OWASP Top 10 controls · RBAC at every layer · input validation on every endpoint · dependency scanning in CI/CD · SAST on every pull request |
| **Identity** | MFA enforced for all staff · privileged access management · quarterly access reviews · SSO for all internal tooling |
| **Operational** | Annual third-party penetration test · quarterly vulnerability scans · 24/7 security monitoring · SOC 2 annual audit · public bug bounty program |
| **Data** | Tenant isolation with no shared tables · encryption at rest AES-256 · encryption in transit TLS 1.3 · 30-day backup retention · regional data residency options |

### Penetration Testing

We conduct **annual penetration tests** performed by independent third-party security firms. Tests cover:

- External network penetration testing
- Web application security testing (OWASP Top 10)
- API security testing
- Privilege escalation and lateral movement
- Multi-tenant isolation validation
- Subprocessor boundary testing

A summary report is available on request. Full reports are available under NDA for enterprise customers. Identified findings are remediated on the same SLA we promise customers — CRITICAL within 7 days, HIGH within 30, MEDIUM within 90.

---

## Data Handling

The platform stores three classes of data: scan and finding data (your security posture), credential references (pointers to your IAM roles, never plaintext keys), and account metadata. Encryption, retention, and isolation rules are explicit per class.

| Data type | Where stored | Encryption | Retention |
|---|---|---|---|
| Cloud resource configurations | Tenant-scoped database | AES-256 at rest | 12 months |
| Security findings | Tenant-scoped database | AES-256 at rest | 12 months |
| Scan metadata | Tenant-scoped database | AES-256 at rest | 12 months |
| Audit logs | Tenant-scoped database | AES-256 at rest | 7 years |
| Cloud credentials (refs only) | Managed secret store | Cloud-provider KMS | Duration of subscription |
| User account data | Identity backend | AES-256 at rest | 90 days post-termination |
| Attack graph data | Managed graph database | AES-256 at rest | 12 months |

**We never store:**

- **Plaintext cloud credentials.** The platform stores only credential references (e.g. ARNs, service principal IDs). The actual secret material lives in a managed secret store (AWS Secrets Manager / Azure Key Vault / GCP Secret Manager) and is fetched at scan time.
- **Customer workload data or file contents.** DSPM samples to classify data types — sample data is discarded immediately after classification metadata is extracted.
- **Personal data from scanned cloud resources.** The platform records *that* PII / PCI / PHI exists, *where* it lives, and *how it's protected* — never the data itself.

---

## Subprocessors

| Subprocessor | Purpose | Location |
|---|---|---|
| Cloud infrastructure provider | Compute, storage, secrets management | `ap-south-1` (primary), region-configurable |
| Managed graph database service | Security graph (attack paths) | Region-configurable |
| Payment processor | Subscription billing | Global |
| Transactional email provider | System notifications | Global |
| Incident alerting service | Internal on-call rotation | Global |

Customers are notified of **material subprocessor changes 30 days in advance**. The current subprocessor list is published at the URL above and updated whenever a change occurs. Subscribe to subprocessor change notifications at `trust@onam.io`.

---

## Incident Response

Security events are handled through a **five-stage response process**. Severity is classified within 1 hour of detection; customer notifications go out within 72 hours of confirming impact.

<img src="/diagrams/trust-incident-response.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="Incident response flow — Detect → Triage → Respond → Notify → Post-Incident Review" />

**The five stages:**

| Stage | Target SLA | What happens |
|---|---|---|
| **1. Detect** | Continuous (24/7) | Security event detected via 24/7 monitoring, SIEM correlation, or customer report |
| **2. Triage** | < 1 hour | Severity classified; response team paged |
| **3. Respond** | CRITICAL: immediate · HIGH: 4 hours · MEDIUM: 24 hours | Incident response team mobilizes; containment begins |
| **4. Notify** | Within 72 hours of confirmed customer impact | GDPR Article 33-compliant notification to affected customers |
| **5. Post-incident review** | Within 14 days of resolution | PIR shared with affected customers including root cause and prevention measures |

**To report a security issue:** `security@onam.io` — GPG public key available at the website, responsible disclosure policy and bug bounty program both published.

---

## Business Continuity

| Metric | Target |
|---|---|
| **RTO** (Recovery Time Objective) | 4 hours for full platform recovery |
| **RPO** (Recovery Point Objective) | 1 hour (continuous database backups) |
| **Backup frequency** | Continuous backups, daily snapshots retained 30 days |
| **DR test frequency** | Semi-annual — last test: 2026-01 (report available on request) |
| **Multi-AZ deployment** | All production databases run multi-AZ within the customer's selected region |
| **Cross-region failover** | Available on Enterprise plans with documented RTO/RPO |

---

## Security Ratings

| Service | Rating | Last updated |
|---|---|---|
| SecurityScorecard | A (94 / 100) | 2026-05 |
| BitSight | 790 (Advanced) | 2026-05 |
| UpGuard | 900+ | 2026-05 |

Live ratings auto-refresh on the trust center web page. Score histories are available on request.

---

## Contact

| Purpose | Contact |
|---|---|
| Security issues / vulnerabilities | `security@onam.io` |
| Trust document requests (SOC 2, pentest) | `trust@onam.io` |
| Data protection / GDPR / DPA | `legal@onam.io` |
| HIPAA BAA or FedRAMP questions | `sales@onam.io` |
| General compliance questions | `compliance@onam.io` |

---

*Last updated: 2026-05-09*
*Trust Center updates are published when certifications are renewed or materially changed.*
