# Mermaid → Draw.io Migration Audit

**Goal:** replace every Mermaid diagram in the docs with a hand-built draw.io SVG that follows our locked visual standard, OR delete duplicates, OR convert to a clearer markdown table.

**Total Mermaid blocks:** 78 across 22 files
**Process:** one block at a time. No batch work. Each new SVG gets its own focused build session.

## Decision categories

| Code | Action | When |
|---|---|---|
| **D** | Delete the Mermaid block | A sibling SVG already shows the same concept |
| **R** | Replace with new draw.io SVG | Concept is unique or sibling SVG covers a different angle |
| **T** | Convert to markdown table | Mind maps, pie charts, mostly-text content; tables are clearer |

## Visual standard (locked) — every new SVG must obey

| Property | Value |
|---|---|
| Canvas — hero / horizontal flow | 920 × 430 |
| Canvas — detailed component map | 920 × 640 |
| Canvas — narrow process / chain | 920 × 280 |
| Canvas — vertical pillar | 380 × 444 |
| Background | `#F8FAFC` rounded 10px |
| Section labels | Arial 9pt 700 letter-spaced 1.2 |
| Box titles | Arial 11pt 700 |
| Sub-text | Arial 8–9pt 400 |
| Stroke | 1.5px primary boxes, 1px section frames |
| Palette | `#1E40AF` primary, `#2563EB` accent, `#10B981` success, `#F59E0B` warn, `#EF4444` critical, `#64748B` muted |
| Source file | `.drawio` saved alongside `.svg` in `public/diagrams/sources/` |
| Naming | `<area>-<concept>.svg` (e.g. `feat-ciem-privesc-chain.svg`) |

---

## Registry — 78 entries

Status legend: ☐ pending · 🔨 in-progress · ✅ done

### architecture/overview.md (6 blocks — all duplicates)

| # | Line | Section | Mermaid type | Action | Sibling SVG | New asset name | Size | Status |
|---|---:|---|---|:-:|---|---|---|:-:|
| A1 | 37 | Scan Pipeline | sequenceDiagram | **D** | arch-scan-pipeline.svg | — | — | ✅ |
| A2 | 80 | Multi-Cloud Coverage | graph LR (7 clouds) | **D** | arch-multi-cloud.svg | — | — | ✅ |
| A3 | 151 | Security Pillars | mindmap | **D** | arch-security-pillars.svg | — | — | ✅ |
| A4 | 217 | Multi-Tenant Isolation | flowchart LR | **D** | arch-multi-tenant.svg | — | — | ✅ |
| A5 | 256 | Data Flow → Posture | flowchart TD | **D** | arch-data-flow.svg | — | — | ✅ |
| A6 | 314 | Deployment Architecture | graph TB | **D** | arch-deployment.svg | — | — | ✅ |

### compliance/framework-coverage.md (8 blocks)

| # | Line | Section | Mermaid type | Action | Sibling SVG | New asset name | Size | Status |
|---|---:|---|---|:-:|---|---|---|:-:|
| C1 | 19 | Scoring Methodology | graph TD (decision tree) | **R** | compliance-framework.svg (different) | `compl-scoring-flow.svg` | 920×430 | ✅ |
| C2 | 45 | Supported Frameworks | mindmap | **D** | p-compliance.svg + new category table | — | — | ✅ |
| C3 | 93 | CIS Benchmarks | pie | **T** | — | control distribution table (with %) | — | ✅ |
| C4 | 109 | NIST CSF 2.0 | graph LR (6 functions) | **T** | — | function-mapping table + "why PROTECT dominates" prose | — | ✅ |
| C5 | 166 | PCI-DSS v4.0 | graph TD (12 reqs ↔ coverage) | **T** | — | 7-pillar coverage table + Req-9 explanation | — | ✅ |
| C6 | 251 | SOC 2 Type II | graph LR (TSC ↔ rules) | **T** | — | TSC criteria table with rule counts and evidence column | — | ✅ |
| C7 | 303 | Cross-Framework Map | graph TD (rule → frameworks) | **T** | — | worked-example table (S3 rule → 8 framework citations) | — | ✅ |
| C8 | 347 | Compliance Reports | flowchart LR | **T** | — | format-comparison table + 5-section breakdown list | — | ✅ |

### features/ciem.md (5 blocks)

| # | Line | Section | Mermaid type | Action | Sibling SVG | New asset name | Size | Status |
|---|---:|---|---|:-:|---|---|---|:-:|
| F-CI1 | 11 | Identity Risk Problem | graph LR | **T** | ciem.svg + new 4-row risk table | — | — | ✅ |
| F-CI2 | 37 | How CIEM Works | flowchart TD (Collect→Analyze→Output) | **R** | — | `feat-ciem-pipeline.svg` | 920×430 | ✅ |
| F-CI3 | 74 | Effective Permissions | graph TD (5 AWS sources → intersect) | **R** | p-ciem.svg (different — UI) | `feat-ciem-effective-perms.svg` | 920×360 | ✅ |
| F-CI4 | 124 | Identity Attack Paths | graph LR (priv-esc chain) | **R** | — | `feat-ciem-privesc-chain.svg` | 920×280 | ✅ |
| F-CI5 | 174 | Remediation Workflow | flowchart LR | **R** | — | `feat-ciem-remediation.svg` | 920×280 | ✅ |

### features/container-security.md (4 blocks)

| # | Line | Section | Mermaid type | Action | Sibling SVG | New asset name | Size | Status |
|---|---:|---|---|:-:|---|---|---|:-:|
| F-CT1 | 11 | Coverage at a Glance | mindmap | **T** | container-security.svg + 6-surface table | — | — | ✅ |
| F-CT2 | 66 | How Security Check Works | flowchart TD | **R** | — | `feat-container-pipeline.svg` | 920×430 | ✅ |
| F-CT3 | 102 | RBAC Analysis | graph LR (SA→RB→Role) | **R** | p-container.svg (different — UI) | `feat-container-rbac.svg` | 920×360 | ✅ |
| F-CT4 | 145 | Network Policy Coverage | graph LR (with/without) | **R** | — | `feat-container-netpol.svg` | 920×360 | ✅ |

### features/data-security.md (5 blocks)

| # | Line | Section | Mermaid type | Action | Sibling SVG | New asset name | Size | Status |
|---|---:|---|---|:-:|---|---|---|:-:|
| F-DS1 | 11 | What DSPM Solves | graph TD | **T** | data-security.svg + 5-row failure-mode table | — | — | ✅ |
| F-DS2 | 29 | How DSPM Works | flowchart LR (4 steps) | **R** | — | `feat-datasec-pipeline.svg` | 920×430 | ✅ |
| F-DS3 | 72 | Data Classification | mindmap | **T** | p-datasec.svg + 5-class severity table | — | — | ✅ |
| F-DS4 | 114 | Data Exposure Levels | graph LR | **R** | — | `feat-datasec-exposure-levels.svg` | 920×280 | ✅ |
| F-DS5 | 167 | Data Flow Analysis | graph LR (PII → ETL → public S3) | **R** | — | `feat-datasec-flow-example.svg` | 920×360 | ✅ |

### features/iac-scanning.md (4 blocks)

| # | Line | Section | Mermaid type | Action | Sibling SVG | New asset name | Size | Status |
|---|---:|---|---|:-:|---|---|---|:-:|
| F-IA1 | 11 | Shift-Left Model | graph LR (cost timeline) | **T** | iac-scanning.svg + 6-stage cost table | — | — | ✅ |
| F-IA2 | 38 | Capabilities | mindmap | **T** | — | 5-category capabilities table | — | ✅ |
| F-IA3 | 103 | IaC Framework Coverage | graph LR (TF/CFN/ARM/etc) | **R** | — | `feat-iac-frameworks.svg` | 920×500 | ✅ |
| F-IA4 | 276 | Secrets Detection Patterns | mindmap | **T** | — | 5-category secrets pattern table | — | ✅ |

### features/network-security.md (3 blocks)

| # | Line | Section | Mermaid type | Action | Sibling SVG | New asset name | Size | Status |
|---|---:|---|---|:-:|---|---|---|:-:|
| F-NW1 | 11 | 7-Layer Model | graph TD | **T** | network-security.svg + 7-layer Q&A table | — | — | ✅ |
| F-NW2 | 38 | Effective Exposure | flowchart LR (Internet→IGW→...) | **R** | — | `feat-network-effective-exposure.svg` | 920×280 | ✅ |
| F-NW3 | 89 | SG Findings | graph LR (critical/med/low rules) | **R** | p-network.svg (different — UI) | `feat-network-sg-findings.svg` | 920×430 | ✅ |

### features/vulnerability-management.md (4 blocks)

| # | Line | Section | Mermaid type | Action | Sibling SVG | New asset name | Size | Status |
|---|---:|---|---|:-:|---|---|---|:-:|
| F-VM1 | 11 | How It Works | flowchart TD (agentless scan) | **T** | vulnerability.svg + 3-stage table | — | — | ✅ |
| F-VM2 | 63 | Risk Prioritization Model | graph LR (signals→score) | **R** | p-vuln.svg (different — UI) | `feat-vuln-prioritization.svg` | 920×360 | ✅ |
| F-VM3 | 98 | SBOM Generation | flowchart LR | **R** | — | `feat-vuln-sbom.svg` | 920×280 | ✅ |
| F-VM4 | 136 | Finding Lifecycle | stateDiagram-v2 | **R** | — | `feat-vuln-finding-lifecycle.svg` | 920×280 | ✅ |

### onboarding/aws.md (3 blocks)

| # | Line | Section | Mermaid type | Action | Sibling SVG | New asset name | Size | Status |
|---|---:|---|---|:-:|---|---|---|:-:|
| O-AWS1 | 14 | How It Works | sequenceDiagram (auth flow) | **D** | onboard-aws.svg + 3 properties walkthrough | — | — | ✅ |
| O-AWS2 | 159 | Permissions | mindmap | **T** | — | (permission groups table) | — | ✅ |
| O-AWS3 | 239 | Services Scanned | graph LR | **T** | — | (services-by-category table) | — | ✅ |

### onboarding/azure.md (3 blocks)

| # | Line | Section | Mermaid type | Action | Sibling SVG | New asset name | Size | Status |
|---|---:|---|---|:-:|---|---|---|:-:|
| O-AZ1 | 14 | How It Works | sequenceDiagram | **D** | onboard-azure.svg | — | — | ✅ |
| O-AZ2 | 99 | Reader Role Scope | graph LR (SP→Subscription) | **R** | — | `onboard-azure-perms.svg` | 920×280 | ✅ |
| O-AZ3 | 187 | Services Scanned | mindmap | **T** | — | (services table) | — | ✅ |

### onboarding/gcp.md (3 blocks)

| # | Line | Section | Mermaid type | Action | Sibling SVG | New asset name | Size | Status |
|---|---:|---|---|:-:|---|---|---|:-:|
| O-GCP1 | 14 | How It Works | sequenceDiagram | **D** | onboard-gcp.svg | — | — | ✅ |
| O-GCP2 | 101 | Read-Only Roles | graph LR | **R** | — | `onboard-gcp-perms.svg` | 920×280 | ✅ |
| O-GCP3 | 184 | Services Scanned | mindmap | **T** | — | (services table) | — | ✅ |

### onboarding/oci.md (2 blocks)

| # | Line | Section | Mermaid type | Action | Sibling SVG | New asset name | Size | Status |
|---|---:|---|---|:-:|---|---|---|:-:|
| O-OCI1 | 14 | How It Works | sequenceDiagram | **D** | onboard-oci.svg | — | — | ✅ |
| O-OCI2 | 183 | Services Scanned | mindmap | **T** | — | (services table) | — | ✅ |

### onboarding/alicloud.md (2 blocks)

| # | Line | Section | Mermaid type | Action | Sibling SVG | New asset name | Size | Status |
|---|---:|---|---|:-:|---|---|---|:-:|
| O-AL1 | 14 | How It Works | sequenceDiagram | **D** | onboard-alicloud.svg | — | — | ✅ |
| O-AL2 | 159 | Services Scanned | mindmap | **T** | — | (services table) | — | ✅ |

### onboarding/ibm.md (2 blocks)

| # | Line | Section | Mermaid type | Action | Sibling SVG | New asset name | Size | Status |
|---|---:|---|---|:-:|---|---|---|:-:|
| O-IBM1 | 14 | How It Works | sequenceDiagram | **D** | onboard-ibm.svg | — | — | ✅ |
| O-IBM2 | 182 | Services Scanned | mindmap | **T** | — | (services table) | — | ✅ |

### reference/api-reference.md (2 blocks)

| # | Line | Section | Mermaid type | Action | Sibling SVG | New asset name | Size | Status |
|---|---:|---|---|:-:|---|---|---|:-:|
| R-API1 | 15 | Authentication | sequenceDiagram | **R** | api-reference.svg (different) | `ref-api-auth-flow.svg` | 920×280 | ✅ |
| R-API2 | 133 | Endpoints by Engine | graph LR | **R** | — | `ref-api-endpoints.svg` | 920×500 | ✅ |

### reference/integration-catalog.md (2 blocks)

| # | Line | Section | Mermaid type | Action | Sibling SVG | New asset name | Size | Status |
|---|---:|---|---|:-:|---|---|---|:-:|
| R-INT1 | 11 | Integration Ecosystem | graph TB | **D** | integrations.svg + 6-category table | — | — | ✅ |
| R-INT2 | 130 | Jira Auto-Create | flowchart LR | **R** | — | `ref-int-jira-flow.svg` | 920×280 | ✅ |

### reference/rbac-and-sso.md (4 blocks)

| # | Line | Section | Mermaid type | Action | Sibling SVG | New asset name | Size | Status |
|---|---:|---|---|:-:|---|---|---|:-:|
| R-RB1 | 11 | Role Hierarchy | graph TD | **T** | rbac-sso.svg + 5-role table | — | — | ✅ |
| R-RB2 | 45 | Permission Matrix | graph LR (27 perms) | **R** | — | `ref-rbac-permissions.svg` | 920×500 | ✅ |
| R-RB3 | 124 | Invite a User | flowchart LR | **R** | p-iam.svg (different) | `ref-rbac-invite-flow.svg` | 920×280 | ✅ |
| R-RB4 | 160 | SAML 2.0 | sequenceDiagram | **R** | — | `ref-rbac-saml-flow.svg` | 920×360 | ✅ |

### release-notes/2026-05.md (2 blocks)

| # | Line | Section | Mermaid type | Action | Sibling SVG | New asset name | Size | Status |
|---|---:|---|---|:-:|---|---|---|:-:|
| RN1 | 13 | Highlights | graph LR | **T** | — | (highlights table) | — | ✅ |
| RN2 | 154 | Upgrade Notes | graph LR | **T** | — | (image tag table) | — | ✅ |

### trust/data-retention.md (4 blocks)

| # | Line | Section | Mermaid type | Action | Sibling SVG | New asset name | Size | Status |
|---|---:|---|---|:-:|---|---|---|:-:|
| T-DR1 | 14 | What Data We Collect | graph TD | **T** | data-retention.svg + 3-class data table | — | — | ✅ |
| T-DR2 | 50 | Retention Schedule | gantt | **T** | — | retention period table | — | ✅ |
| T-DR3 | 99 | Automatic Deletion | flowchart LR | **R** | — | `trust-retention-deletion.svg` | 920×280 | ✅ |
| T-DR4 | 138 | Data Residency | graph LR | **R** | — | `trust-data-residency.svg` | 920×280 | ✅ |

### trust/sla-and-slo.md (6 blocks)

| # | Line | Section | Mermaid type | Action | Sibling SVG | New asset name | Size | Status |
|---|---:|---|---|:-:|---|---|---|:-:|
| T-SLA1 | 11 | Uptime SLA Tiers | graph LR | **T** | sla-slo.svg + 4-tier SLA table | — | — | ✅ |
| T-SLA2 | 48 | Scan Performance | xychart-beta | **T** | — | scan-time-by-account-size table | — | ✅ |
| T-SLA3 | 72 | API Performance | quadrantChart | **T** | — | latency target table per endpoint | — | ✅ |
| T-SLA4 | 103 | Support Response | flowchart TD | **R** | — | `trust-sla-support.svg` | 920×360 | ✅ |
| T-SLA5 | 138 | Maintenance Windows | timeline | **T** | — | window schedule table | — | ✅ |
| T-SLA6 | 165 | SLO Measurement | flowchart LR | **R** | — | `trust-sla-measurement.svg` | 920×280 | ✅ |

### trust/trust-center.md (3 blocks)

| # | Line | Section | Mermaid type | Action | Sibling SVG | New asset name | Size | Status |
|---|---:|---|---|:-:|---|---|---|:-:|
| T-TC1 | 11 | Certifications Status | graph LR | **T** | trust-center.svg + 12-row certs table | — | — | ✅ |
| T-TC2 | 74 | Security Program | mindmap | **T** | — | 5-domain program table | — | ✅ |
| T-TC3 | 157 | Incident Response | flowchart LR | **R** | — | `trust-incident-response.svg` | 920×280 | ✅ |

---

## Roll-up

| Action | Count | Effort estimate |
|---|---:|---|
| **D** Delete (sibling SVG covers it) | 24 | ~2 hours total — bulk edit |
| **R** Replace with new draw.io SVG | 38 | ~30 min per SVG focused build → ~19 hours total |
| **T** Convert to markdown table | 16 | ~10 min per table → ~3 hours total |
| **TOTAL** | 78 | ~24 hours of focused work |

---

## Working order (priority)

1. **Wave 1 — Quick wins (D + T category)** ~5 hours
   - All 24 deletes (low risk, instant page improvement)
   - All 16 table conversions (also lower risk than building images)
   - After wave 1: 38 Mermaid blocks remain, all category R

2. **Wave 2 — Foundation R diagrams** ~9 hours (18 SVGs)
   - Start with high-traffic/high-value pages
   - architecture/overview already clean post-wave-1
   - Order: ciem (5), datasec (4), network (2), vuln (3), container (3), iac (1)

3. **Wave 3 — Compliance & onboarding R diagrams** ~5 hours (10 SVGs)
   - compliance (6 — biggest single page)
   - onboarding perms (azure/gcp = 2)
   - rbac (3)
   - api-reference (2)

4. **Wave 4 — Trust & integrations R diagrams** ~5 hours (10 SVGs)
   - trust/data-retention (2)
   - trust/sla-slo (2)
   - trust/trust-center (1)
   - integrations (1)

---

## Per-SVG build process (one at a time)

For every Category R item:

1. **Read the Mermaid source** — understand exactly what it conveys
2. **Sketch the layout** — pick canvas size, decide block layout
3. **Build the .drawio source** — use draw.io desktop or web
4. **Export SVG** — save to `public/diagrams/<filename>.svg`
5. **Save .drawio source** — save to `public/diagrams/sources/<filename>.drawio`
6. **Update markdown** — replace Mermaid block with `<img>` tag, matching the existing pattern
7. **Visual verify in browser** — load the page, screenshot, confirm
8. **User review** — share screenshot, get sign-off
9. **Tick the registry** — mark status ✅
10. **Move to next**

---

*Last updated: 2026-05-08 — registry created*
