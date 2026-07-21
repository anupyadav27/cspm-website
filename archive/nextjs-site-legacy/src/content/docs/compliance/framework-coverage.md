# Compliance Framework Coverage

The Onam CSPM platform automatically maps every security finding to the compliance frameworks you care about — **13+ frameworks supported out of the box**, including CIS, NIST, ISO 27001, PCI-DSS, HIPAA, GDPR, SOC 2, FedRAMP, DORA, CCPA, CSA CCM, MAS TRM, and NYDFS. One finding can satisfy controls in many frameworks at once. This page covers what each framework checks, how the platform calculates a score, and how to export an audit-ready report.

<img src="/diagrams/compliance-frameworks.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:24px;" alt="13 Compliance Frameworks full coverage table including CIS, NIST, ISO 27001, PCI-DSS, HIPAA, GDPR, SOC 2, FedRAMP, DORA, CCPA, CSA CCM, MAS TRM and NYDFS" />

**Why this matters:** instead of running a separate compliance scan for each framework, the platform evaluates **every applicable rule once** and then projects the results into the framework views you need. A single failing finding on "S3 public access blocked" is reflected against PCI, HIPAA, ISO, NIST, SOC 2, and CIS simultaneously — **one fix, multiple compliance gains**.

---

## How Compliance Works

A single platform rule can satisfy controls in many frameworks at the same time. When a resource passes or fails a rule, that result updates every framework that maps to it — automatically and in real time. There is no separate "PCI scan" or "HIPAA scan" to schedule; framework scores are derivative of a single underlying check pass.

<img src="/diagrams/compliance-framework.svg" alt="How compliance scoring works" style="width:100%;max-width:960px;border-radius:10px;" />

**The three-layer model:**

1. **Rules** — each rule is a YAML file with a clear assertion (e.g. "S3 buckets must block public access"). All 1,918 rules live in a versioned catalog.
2. **Controls** — every framework has its own control catalog (CIS controls, NIST control families, PCI requirements, etc.). The platform maintains a many-to-many mapping between rules and controls.
3. **Frameworks** — a framework is just a curated bundle of controls. When you select "PCI-DSS v4.0", the platform shows you results filtered to only the rules mapped to PCI-DSS controls.

This means **every new rule you add automatically extends compliance coverage** for every framework that includes the underlying control. You don't update each framework one at a time.

---

## Scoring Methodology

A framework score is a single number from 0 to 100 that summarizes how well your environment meets that framework's controls. The calculation is deterministic — no machine learning, no fuzzy logic, no proprietary "magic". You can audit the math.

<img src="/diagrams/compl-scoring-flow.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="Framework scoring methodology — input rules, evaluate per resource, produce score and threshold status" />

**Reading the diagram left to right:**

1. **Input & Evaluation** — Identify the subset of the 1,918 rules that apply to the framework. Run each one against every resource currently in scope. A typical PCI-DSS scan evaluates ~145 rules across thousands of resources, producing hundreds of thousands of pass/fail decisions.
2. **Outcome per resource × rule** — Each evaluation produces one of three outcomes:
   - **PASS** — the resource satisfies the rule. Counted toward the score numerator. No finding generated.
   - **FAIL** — the resource violates the rule. Counted toward the score denominator. A finding is generated and severity-graded.
   - **NOT APPLICABLE** — the rule does not apply to this resource type or context (e.g. PCI requirement 9 covers physical access — not relevant to cloud). Excluded from scoring.
3. **Framework score & status** — The score is `PASS ÷ (PASS + FAIL) × 100`, rounded to the nearest integer. The score maps to a three-tier status badge: **Compliant** (≥ 80%), **Partially Compliant** (60–79%), **Non-Compliant** (< 60%).

Scores are recalculated after every scan. Historical scores are retained — you can view the trend line for any framework over the last 12 months and prove improvement to your auditor.

<img src="/diagrams/p-compliance.svg" style="width:auto;max-width:100%;display:block;margin-left:auto;margin-right:auto;border-radius:10px;margin-bottom:16px;" alt="Onam CSPM — Compliance platform view showing framework scores, control coverage, and posture trend dashboard" />

**Two important nuances:**

- **Suppressions are auditable.** If you suppress a finding (with a documented justification), it is excluded from the score but tracked in a separate suppression log that exports with every audit report. Auditors see exactly what was suppressed and why.
- **Severity does not weight the score.** A failing CRITICAL finding and a failing LOW finding both count as one failed evaluation. Severity drives prioritization in the findings dashboard, not the framework score itself.

---

## Supported Frameworks

The platform supports **18 distinct framework versions** organized into six categories. Coverage parity is high across CSPs — most frameworks scan the same way against AWS, Azure, GCP, OCI, AliCloud, and IBM Cloud.

| Category | Framework | Version | Why it matters |
|---|---|---|---|
| **Cloud Benchmarks** | CIS AWS Foundations | v3.0 | Industry-standard AWS hardening baseline |
| | CIS Azure Foundations | v2.0 | Azure equivalent — most-cited Azure benchmark |
| | CIS GCP Foundations | v2.0 | GCP equivalent — most-cited GCP benchmark |
| | CIS OCI Foundations | v1.2 | Oracle Cloud hardening |
| | CIS Kubernetes | v1.8 | K8s cluster hardening |
| | CIS Docker | v1.6 | Container runtime hardening |
| **US Federal & Sector** | NIST CSF 2.0 | 2024 | The most adopted federal cybersecurity framework |
| | NIST SP 800-53 | Rev 5 | Federal control catalog — foundation for FedRAMP |
| | FedRAMP Moderate | 2024 baseline | Required to sell to US federal agencies |
| | HIPAA Security Rule | §164.308–318 | Required for healthcare ePHI |
| | SOX IT Controls | 2002 (current) | Public-company financial systems |
| **International** | ISO 27001 | 2022 | Global infosec management standard |
| | ISO 27017 | Cloud-specific | ISO extension for cloud security |
| | GDPR | Articles 5/25/32/33/35 | EU data protection — technical mappings |
| | NIS2 Directive | EU 2022/2555 | EU critical-infrastructure cybersecurity |
| **Payment** | PCI-DSS | v4.0 | Required for cardholder data |
| **Audit** | SOC 2 | Type II — TSC 2017 | The most cited B2B audit standard |
| **Resilience & Risk** | DORA | EU 2022/2554 | EU financial-services operational resilience |
| | CSA CCM | v4 | Cloud Security Alliance Cloud Controls Matrix |

**New framework requests** are welcomed — most additions are completed within 8 weeks. Email `support@onam.io` with the framework name, version, and your business justification.

---

## Framework Details

### CIS Benchmarks

The **Center for Internet Security** publishes the most widely adopted security configuration benchmarks for cloud platforms. The platform supports six CIS benchmark variants and evaluates **every applicable control automatically** — no manual configuration required.

| Benchmark | Version | Cloud Provider | Controls Covered |
|---|---|---|---|
| CIS AWS Foundations | v3.0 | AWS | 58 controls |
| CIS Azure Foundations | v2.0 | Azure | 85 controls |
| CIS GCP Foundations | v2.0 | GCP | 73 controls |
| CIS OCI Foundations | v1.2 | OCI | 47 controls |
| CIS Kubernetes | v1.8 | Any K8s cluster | 112 controls |
| CIS Docker | v1.6 | Container hosts | 28 controls |

**CIS AWS Foundations v3.0 — control distribution by category:**

| Category | Controls | Share |
|---|---:|---:|
| Identity & Access Management | 21 | 36% |
| Monitoring | 16 | 28% |
| Logging | 11 | 19% |
| Storage | 8 | 14% |
| Other | 7 | 12% |
| Networking | 5 | 9% |
| **Total** | **58** | **100%** |

CIS publishes new benchmark versions roughly every 12–18 months. The platform tracks new versions automatically — when CIS AWS Foundations v3.1 ships, the platform adds it as a new framework option (without removing v3.0) so you can migrate when ready.

---

### NIST CSF 2.0

The **NIST Cybersecurity Framework 2.0** organizes controls into **six functions** that map to the lifecycle of cybersecurity risk management. NIST CSF 2.0 (released February 2024) added the new GOVERN function alongside the original five.

The platform's 1,918 rules are tagged to one or more CSF functions. When a rule fails, the corresponding CSF function score drops proportionally.

| Function | Code | Rules Mapped | What it covers |
|---|---|---:|---|
| 🏛️ GOVERN | GV | ~45 rules | Org security policy, roles, risk strategy, supply chain risk |
| 🔍 IDENTIFY | ID | ~180 rules | Asset inventory, risk assessment, vulnerability identification |
| 🛡️ PROTECT | PR | ~890 rules | IAM, data security, configuration hardening, secure SDLC |
| 🔎 DETECT | DE | ~340 rules | Logging, monitoring, anomaly detection, audit trails |
| ⚡ RESPOND | RS | ~85 rules | Incident response readiness, communication plans |
| 🔄 RECOVER | RC | ~60 rules | Backup, resilience, continuity, disaster recovery |

**Why PROTECT dominates** — most cloud configuration findings (encryption, IAM, network controls) live in PROTECT. This is normal: a CSPM platform is fundamentally a PROTECT-function tool. RESPOND and RECOVER are lighter because they require process and runbooks, not just configuration — the platform validates that the technical preconditions (backups exist, logs are enabled, alerts route somewhere) are in place.

---

### NIST SP 800-53 Rev 5

The **federal security control catalog** — 20 control families, ~1,000 controls. This is the foundation that FedRAMP Moderate and FedRAMP High build on. The platform maps to **the 12 most cloud-relevant control families**.

| Control Family | Code | Rules Mapped | Examples |
|---|---|---:|---|
| Access Control | AC | 145 rules | Least privilege, separation of duties, account inactivity |
| Audit and Accountability | AU | 89 rules | Audit log content, audit log retention, log review |
| Configuration Management | CM | 178 rules | Baseline configurations, secure deployment, drift |
| Contingency Planning | CP | 34 rules | Backup integrity, alternate processing site readiness |
| Identification and Authentication | IA | 112 rules | MFA, password policies, federation, key rotation |
| Incident Response | IR | 28 rules | IR plan validation, log forwarding to SIEM |
| Maintenance | MA | 15 rules | Maintenance access controls, tool authentication |
| Media Protection | MP | 22 rules | Storage encryption, media destruction (cloud-applicable subset) |
| Personnel Security | PS | 8 rules | Account termination on offboarding |
| Risk Assessment | RA | 67 rules | Vulnerability scanning, risk-based authentication |
| System & Comm Protection | SC | 134 rules | Encryption in transit, network segmentation, key management |
| System & Info Integrity | SI | 98 rules | Patch currency, malware protection, input validation |

The eight remaining 800-53 families (PE Physical/Environmental, AT Awareness/Training, CA Assessment, PL Planning, PM Program Management, PT PII Processing, SA System Acquisition, SR Supply Chain Risk) include controls that cannot be evaluated from cloud configuration alone — they require process, documentation, or external evidence. The platform notes these as "not in scope for automated evaluation" rather than failing them silently.

---

### PCI-DSS v4.0

The **Payment Card Industry Data Security Standard** — required for any organization that stores, processes, or transmits cardholder data. PCI-DSS v4.0 (effective March 2024) replaced v3.2.1 and added new requirements around customized approach, targeted risk analysis, and authentication.

PCI-DSS organizes its 12 requirements into four pillars. The platform automates **everything except Requirement 9 (Restrict Physical Access)**, which is intentionally not cloud-applicable.

| Pillar | Requirements | What the platform checks | Coverage |
|---|---|---|:---:|
| **Build & Maintain a Secure Network** | Req 1–2 | VPC isolation, security group rules, NACL configurations, secure baseline configs | ✅ |
| **Protect Account Data** | Req 3–4 | Encryption at rest (KMS), TLS 1.2+ enforcement in transit, key rotation policies | ✅ |
| **Maintain a Vulnerability Management Program** | Req 5–6 | Anti-malware on workloads, secure SDLC checks, IaC scanning, dependency CVEs | ✅ |
| **Implement Strong Access Control** | Req 7–8 | IAM least privilege, MFA enforcement, session policies, identity federation | ✅ |
| **Restrict Physical Access** | Req 9 | Physical security — handled by your cloud provider's data center certification | — |
| **Regularly Monitor and Test Networks** | Req 10–11 | CloudTrail / Activity Logs / Audit Logs enabled, WAF, IDS/IPS readiness | ✅ |
| **Maintain an Information Security Policy** | Req 12 | Policy compliance signals — config drift, baseline deviation, suppression governance | ✅ |

**The Req-9 gap is healthy.** Your cloud provider (AWS, Azure, GCP) is responsible for physical security and is independently audited for it — they publish their own PCI Attestation of Compliance (AOC). You inherit Req-9 compliance from your cloud provider's AOC, not from us.

---

### HIPAA Security Rule

Covers the **administrative, physical, and technical safeguards for electronic Protected Health Information (ePHI)**. The platform automates the technical safeguards (§164.312) and provides evidence for several administrative safeguards (§164.308) that have a technical implementation footprint.

| Safeguard Category | Mapped Rules | Key Areas |
|---|---:|---|
| Technical — Access Control (§164.312a) | 95 rules | IAM, MFA enforcement, least privilege, role assignment |
| Technical — Audit Controls (§164.312b) | 67 rules | CloudTrail, database audit logs, access logs, log retention |
| Technical — Integrity (§164.312c) | 44 rules | Checksums, encryption integrity, tamper detection, immutable logs |
| Technical — Transmission Security (§164.312e) | 38 rules | TLS 1.2+ enforcement, in-transit encryption for inter-service calls |
| Administrative — Risk Analysis (§164.308a1) | 52 rules | Vulnerability scanning frequency, risk-based scoring |
| Administrative — Access Management (§164.308a4) | 71 rules | IAM access reviews, account provisioning workflows, dormancy |

Physical safeguards (§164.310) are inherited from your cloud provider's HIPAA-eligible Business Associate Agreement (BAA). Onam is a HIPAA-aware platform — we sign a BAA with healthcare customers on the Enterprise plan. Contact `legal@onam.io`.

---

### ISO 27001:2022

The **international standard for information security management** — replaces ISO 27001:2013 with a refreshed Annex A. The 2022 version reorganized the original 114 controls into **93 controls across four domains**. Platform coverage is heaviest in A.8 (Technological Controls) — the cloud-applicable domain.

| Annex A Domain | Controls | Rules Mapped | Why coverage is what it is |
|---|---:|---:|---|
| A.5 — Organizational Controls | 37 | ~90 rules | Policies, roles, supplier governance — partially evidenced via configuration |
| A.6 — People Controls | 8 | ~15 rules | Mostly process — limited platform evidence (account dormancy, offboarding) |
| A.7 — Physical Controls | 14 | ~20 rules | Mostly inherited from your cloud provider — platform validates the residual cloud-applicable subset |
| A.8 — Technological Controls | 34 | ~380 rules | Platform's primary coverage area — encryption, network, IAM, vulnerability, secure SDLC |

ISO 27001:2022 also introduces **11 new controls** that didn't exist in 2013, including A.5.7 (Threat Intelligence), A.5.23 (Information security for cloud services), A.8.9 (Configuration management), A.8.16 (Monitoring activities), and A.8.28 (Secure coding). All 11 are mapped in the platform.

---

### GDPR — Article Mapping

GDPR is **a regulatory framework, not a technical checklist**. The platform maps technical controls to the GDPR articles that have a direct technical implementation requirement. Controls beyond the technical layer (lawful basis, data subject rights, DPIAs, processor contracts) are tracked in your governance system, not the platform.

| GDPR Article | Description | Technical Controls Mapped |
|---|---|---|
| Art. 5 | Principles of data processing — including data minimisation | Data classification, access controls, retention enforcement |
| Art. 25 | Data protection by design and by default | Encryption defaults, private-by-default storage, sensible IAM defaults |
| Art. 32 | Security of processing | Encryption at rest and in transit, MFA, logging, vulnerability mgmt |
| Art. 33/34 | Personal data breach notification | Logging completeness, alert routing readiness, incident-response evidence |
| Art. 35 | Data protection impact assessment (DPIA) | Risk scoring inputs, sensitive data discovery (DSPM), exposure analysis |

GDPR Articles 12–23 (data subject rights) and Articles 44–50 (international transfers) require process and documentation outside the platform. Onam supports these workflows with data export and audit-logging features but does not "score" them.

---

### SOC 2 Type II

SOC 2 maps to the **five Trust Services Criteria (TSC)**. Most cloud customers select **Security, Availability, and Confidentiality** for their SOC 2 report. The platform provides evidence for technical controls that support each criterion.

| Trust Service Criteria | Code | Rules Mapped | What the platform evidences |
|---|---|---:|---|
| **Security** (Common Criteria) | CC6 · CC7 · CC8 · CC9 | ~620 rules | Access control, encryption, logical security, change management, vulnerability management |
| **Availability** | A1 | ~85 rules | Backup configurations, multi-AZ readiness, autoscaling, alarm coverage |
| **Processing Integrity** | PI1 | ~40 rules | Data validation configurations, error-handling instrumentation |
| **Confidentiality** | C1 | ~120 rules | Encryption coverage, data classification, access restriction |
| **Privacy** | P1–P8 | ~75 rules | Data classification, retention enforcement, consent records integrity |

**Most SOC 2 audits cover Security + Availability + Confidentiality**. The platform's coverage of CC6 (Logical and Physical Access Controls) is particularly deep — it directly maps to the day-to-day cloud security findings auditors expect.

---

### FedRAMP Moderate

Built on **NIST SP 800-53 Rev 5**. Required for any cloud service used by US federal agencies. The platform evaluates the **~325 controls in the FedRAMP Moderate baseline** and produces a System Security Plan (SSP) appendix that maps your environment to each control's status.

Key controls the platform checks:

| Control | Category | What the platform validates |
|---|---|---|
| AC-2 | Account Management | Inactive account detection, periodic account reviews |
| AC-6 | Least Privilege | Effective-permission analysis, unused entitlement detection |
| AU-2 | Audit Events | CloudTrail / Activity Logs / Audit enabled across all in-scope services |
| AU-9 | Protection of Audit Information | Log immutability, log destination access controls |
| CM-6 | Configuration Settings | CIS-hardened baseline, drift detection from approved baseline |
| IA-2 | Identification & Authentication | MFA enforcement on privileged accounts |
| IA-5 | Authenticator Management | Password policy, key rotation, certificate expiry |
| RA-5 | Vulnerability Scanning | Scan frequency, vulnerability remediation SLAs |
| SC-8 | Transmission Confidentiality | TLS 1.2+ enforcement |
| SC-13 | Cryptographic Protection | Approved cryptographic modules in use |
| SI-2 | Flaw Remediation | Patch currency, unpatched CVE inventory |
| SI-4 | System Monitoring | Detection coverage across in-scope systems |

FedRAMP **High** baseline (~410 controls) is supported on Government plans. Contact `support@onam.io` for FedRAMP-specific deployment options.

---

## Cross-Framework Coverage Map

Many platform rules satisfy controls across multiple frameworks at once. This is the **multiplier effect** — fixing one finding closes gaps across several frameworks simultaneously, which is why the platform's per-fix ROI is high.

**A worked example — the rule "S3 bucket public access not blocked":**

| Framework | Control | What the control says |
|---|---|---|
| CIS AWS v3.0 | 2.1.5 | "Ensure that S3 Buckets are configured with 'Block public access (bucket settings)'" |
| NIST CSF 2.0 | PR.DS-1 · PR.AA-5 | "Data-at-rest is protected" / "Access permissions are defined" |
| NIST 800-53 Rev 5 | AC-3 · SC-7 | "Access Enforcement" / "Boundary Protection" |
| PCI-DSS v4.0 | Req 1.3 · Req 3.4 | "Restrict outbound traffic" / "Render PAN unreadable in storage" |
| HIPAA | §164.312(a) · §164.312(e) | "Access Control" / "Transmission Security" |
| ISO 27001:2022 | A.8.3 · A.8.20 | "Information access restriction" / "Network controls" |
| SOC 2 | CC6.1 · CC6.6 | "Logical access security software, infrastructure, and architectures" |
| GDPR | Art. 25 · Art. 32 | "Data protection by design" / "Security of processing" |

**One finding, eight framework citations.** Fixing the bucket once closes the audit gap across every framework above.

---

## Framework Coverage by Cloud Provider

Not every framework has the same depth across every CSP — partly because some CSPs have fewer services to evaluate, partly because some frameworks have CSP-specific control variants, and partly because some certifications (FedRAMP, SOX) only apply to AWS / Azure / GCP today.

| Framework | AWS | Azure | GCP | OCI | AliCloud | IBM | K8s |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| CIS Foundations | ✅ v3.0 | ✅ v2.0 | ✅ v2.0 | ✅ v1.2 | ✅ | ✅ | — |
| CIS Kubernetes | — | — | — | — | — | — | ✅ v1.8 |
| NIST CSF 2.0 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| NIST 800-53 Rev 5 | ✅ | ✅ | ✅ | Partial | Partial | Partial | Partial |
| PCI-DSS v4.0 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| HIPAA | ✅ | ✅ | ✅ | Partial | Partial | Partial | — |
| ISO 27001:2022 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GDPR | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| SOC 2 Type II | ✅ | ✅ | ✅ | Partial | Partial | Partial | Partial |
| FedRAMP Moderate | ✅ | ✅ | ✅ | — | — | — | — |
| SOX IT Controls | ✅ | ✅ | ✅ | — | — | — | — |
| DORA | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| CSA CCM v4 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Legend:** ✅ Full coverage · **Partial** = key controls covered, not 100% · **—** = framework does not apply to this CSP or surface

**"Partial" doesn't mean weak.** It means the framework's full breadth includes controls we don't yet automate on that CSP — typically because the CSP's own service catalog is narrower. The "key controls" we cover are the ones that move audit outcomes; the "missing" ones are usually edge-case guidance.

---

## Compliance Reports

The platform produces audit-ready reports in four formats — **PDF, CSV, JSON, and live API** — and every format contains the same underlying data. Pick the format that matches your auditor's preference.

| Format | Best for | What it includes |
|---|---|---|
| **PDF** | Hand-off to external auditor | Executive summary · per-control breakdown · evidence appendix · per-resource detail · signed timestamp |
| **CSV** | Spreadsheet review · GRC import | Every finding × every applicable framework control, one row per pair |
| **JSON** | SIEM / GRC tooling | Same data as CSV, structured for programmatic consumption |
| **Live API** | Continuous monitoring | Real-time score, trend, and drill-down — see [API Reference](/docs/reference/api-reference/) |

**Every report includes the same five sections:**

1. **Overall score** with the pass / fail breakdown.
2. **Controls by category** with per-category pass rates so you can see exactly where the gaps are.
3. **Top failing rules** with remediation steps — the auditor sees exactly what to fix and how.
4. **Trend over the last 6 scans** so the auditor can see your trajectory, not just a single point in time.
5. **Resource-level detail** per failing control — every affected resource, with cloud-console links.

### Report Schedule Options

| Schedule | Trigger | Use case |
|---|---|---|
| **On-demand** | Generate immediately from the UI or API | Pre-audit dry runs, ad-hoc requests |
| **Post-scan** | Auto-generate after every scan | Daily continuous evidence — recommended |
| **Weekly** | Scheduled delivery every Monday | Weekly compliance review meetings |
| **Monthly** | Scheduled delivery on the 1st of each month | Board / executive reporting |

Reports can be delivered to email, Slack, S3, or any webhook endpoint you configure.

---

## Adding a Custom Framework

Beyond the 18 built-in frameworks, you can define **custom compliance frameworks** by mapping your own internal controls to platform rules. This is useful for proprietary security standards, customer-specific contractual requirements, or industry-specific frameworks not yet in the catalog.

**To create a custom framework:**

1. Navigate to **Compliance → Frameworks → Create Custom**
2. Define **control groups** (e.g. "Internal Security Standard — Section 3 — Encryption Requirements")
3. Map each control to one or more platform rules by rule ID — you can reuse a rule across many controls
4. Save and run a scan — your custom framework score appears alongside the built-in frameworks

Custom frameworks support the **same scoring, reporting, and export capabilities** as built-in frameworks. They show up in the cross-framework coverage map automatically.

---

## Frequently Asked Questions

**Can I export a framework report for my auditor?**
Yes. PDF and CSV exports are available from the Compliance Reports page. PDF reports include an executive summary, control-by-control breakdown, and per-resource finding details.

**What happens to my compliance score between scans?**
Scores reflect the most recent completed scan. The score does not change between scans unless you manually re-trigger a scan. Default cadence is daily.

**Does the platform cover DORA (Digital Operational Resilience Act)?**
Yes. DORA controls are mapped across ICT risk management, incident reporting, resilience testing, and third-party risk — aligned to the five DORA pillars. DORA enforcement began January 17, 2025 for in-scope EU financial entities.

**What if a control doesn't apply to my environment?**
You can suppress specific findings with a documented justification. Suppressed findings are excluded from the compliance score and tracked in a separate suppression log that exports with every audit report — auditors see exactly what was suppressed and why.

**Can I track a specific framework version (e.g. CIS AWS v2.0 instead of v3.0)?**
Yes. Multiple versions can be active simultaneously. When a new version ships, the previous one stays available so you can migrate at your own pace without losing history.

**Are framework mappings audited?**
Every mapping in the catalog is reviewed annually by an external compliance consultant. The mapping rationale is stored alongside each rule's YAML in the catalog, so your auditor can read exactly why a given rule maps to a given control.

---

*Last updated: 2026-05-08*
*Framework versions are reviewed and updated quarterly.*
*For custom framework requests: support@onam.io*
