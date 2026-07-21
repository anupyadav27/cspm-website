# SLA & SLO Reference

This document defines the **Service Level Agreement (SLA)** and **Service Level Objectives (SLOs)** for the platform. SLAs are contractually committed in your subscription. SLOs are internal performance targets that we publish for transparency — they tell you what to expect day to day, even when we're not contractually committing to them.

<img src="/diagrams/sla-slo.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:24px;" alt="SLA and SLO reference showing contractual commitments for availability, API response, scan completion and incident notification alongside internal SLO targets" />

**Key distinction:**

- **SLA** = contractual commitment with credit consequences if breached. Examples: 99.9% uptime, 1-hour critical-incident response.
- **SLO** = published target without contractual penalty. Examples: typical scan completion time, P95 API latency.

---

## Platform Uptime SLA

The uptime SLA depends on your subscription plan. Higher-tier plans get tighter commitments and bigger credits if breached.

| Plan | Monthly Uptime SLA | Max downtime / month | Credit if breached |
|---|:---:|---|---|
| **Starter** | 99.5% | 3h 36m | 10% of monthly fee |
| **Growth** | 99.9% | 43 min | 25% of monthly fee |
| **Enterprise** | 99.95% | 21 min | 50% of monthly fee |
| **Enterprise+** (negotiated) | Up to 99.99% | Up to 4 min | Up to 100% of monthly fee |

**How uptime is measured:** the platform runs synthetic monitors every 60 seconds from three geographic regions, probing the portal, the API, and the scan trigger endpoint. **An outage is declared when 2 of 3 probes fail for 3 consecutive minutes.** The 2-of-3 rule prevents a single regional network blip from triggering a false outage.

**Excluded from the SLA:**

- **Scheduled maintenance** within the published window (≤ 4 hrs/month with 48-hour notice)
- **Force majeure events** (natural disaster, war, government action)
- **Customer-caused issues** (e.g., your IAM role broken on the cloud side, your network blocking us)
- **Third-party provider outages** beyond our control (cloud provider regional outages, your IdP unreachable)

**Credit claims:** must be submitted within 30 days of the incident at `support@onam.io` with the incident date and impact description. Credits apply to the next billing cycle.

---

## Scan Performance SLOs

Scan duration depends primarily on **the number of resources in your cloud account** and secondarily on the number of regions you've enabled. The targets below are published SLOs (not contractual SLAs unless specified in your enterprise agreement).

| Account size (resources) | Target scan duration | P99 | Notes |
|---|---|---|---|
| **< 1,000** | 15 minutes | 20 min | Single-region accounts |
| **1,000–10,000** | 60 minutes | 90 min | Standard multi-region |
| **10,000–50,000** | 2 hours | 3 hours | Large accounts with many regions |
| **50,000–100,000** | 3 hours | 4 hours | Enterprise-scale |
| **> 100,000** | 4 hours | 6 hours | Requires Enterprise plan |

**What counts as "scan complete":** all engines (Discovery → Inventory → Check → Threat → all domain engines → Risk) have finished processing and findings are visible in the portal.

**Findings-to-portal latency:** less than **5 minutes** from each engine completion to findings visible in UI (P99: < 10 min). You don't wait for the full scan — findings stream in as each engine completes.

---

## API Performance SLOs

The API is sized to support continuous integration into your existing tooling (SIEM, GRC, dashboards). Latency targets vary by endpoint complexity.

| Endpoint type | P50 | P95 | P99 | Notes |
|---|---|---|---|---|
| Health checks (`/health/live`, `/health/ready`) | < 50 ms | < 100 ms | < 200 ms | No DB query |
| Single resource lookup | < 200 ms | < 500 ms | < 1 s | Indexed query |
| Findings list (paginated, 50 rows) | < 500 ms | < 1 s | < 2 s | Tenant-scoped |
| Compliance posture score | < 800 ms | < 2 s | < 3 s | Aggregate query |
| BFF view (dashboard charts) | < 1 s | < 2 s | < 3 s | Multi-domain aggregation |
| Attack graph traversal | < 1.5 s | < 3 s | < 5 s | Graph DB query |
| Compliance report (full export) | < 5 s | < 10 s | < 30 s | Large data export |

**Rate limits** apply per plan (see [API Reference](/docs/reference/api-reference/)). Rate-limit headers (`X-RateLimit-Remaining`, `X-RateLimit-Reset`) are returned on every response so your client can self-throttle.

---

## Support Response SLAs

Support response is governed by **severity classification**. Severity is set when you submit a ticket; we may upgrade or downgrade based on observed impact, with notification to you.

<img src="/diagrams/trust-sla-support.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="Support response SLA — ticket flow and severity targets for Critical / High / Medium / Low" />

**The four severity bands:**

| Severity | Definition | First response | Target resolution | Coverage |
|---|---|---|---|---|
| 🔴 **Critical** | Platform inaccessible · data loss risk · security breach | < 1 hour | < 4 hours | 24/7/365 |
| 🟠 **High** | Core feature broken with no workaround · scan failures | < 4 hours | < 24 hours | Business hours |
| 🟡 **Medium** | Feature degraded · workaround available | < 24 hours | < 5 business days | Business hours |
| 🟢 **Low** | Questions · documentation requests · feature suggestions | < 72 hours | < 14 business days | Business hours |

**Business hours:** Monday–Friday, 09:00–18:00 in your account's primary support region (default IST, configurable for Enterprise).

**Critical / High support coverage:** available 24/7/365 for Growth and Enterprise plans.

**Support channels:** email at `support@onam.io` · in-app chat (Growth + Enterprise) · dedicated Slack Connect channel (Enterprise).

---

## Scheduled Maintenance

The platform schedules maintenance windows during low-traffic hours. Maintenance does not count against the uptime SLA provided proper notice is given.

| Window | Schedule | Max duration | Notice |
|---|---|---|---|
| **Weekly** | Sunday 02:00–04:00 UTC | 2 hours | 24 hours via status page |
| **Monthly** | Last Sunday of month, 02:00–06:00 UTC | 4 hours | 72 hours via email + status page |
| **Emergency** | As required (security-critical patches) | Varies | As soon as possible — email + status page |

The weekly window is **applied if needed, skipped if not** — most weeks pass without maintenance. The monthly window is reserved for larger updates (schema migrations, dependency upgrades).

Subscribe to maintenance and incident notifications: **[status.onam.io](https://status.onam.io)**

---

## SLO Measurement & Reporting

We measure uptime and latency continuously via synthetic monitoring and report results to you monthly. The same metrics drive on-call paging, incident declaration, and post-incident reviews.

<img src="/diagrams/trust-sla-measurement.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="SLO measurement and reporting flow — synthetic probes, metrics, alerting, status page, post-incident review" />

**The five-stage measurement pipeline:**

1. **Probe** — synthetic monitors run every 60 seconds from 3 geographic regions, hitting the portal, the API, and the scan trigger endpoint.
2. **Metrics collected** — latency, success rate, scan completion times. Stored 13 months for SLA evidence.
3. **Evaluate** — SLO breach detection (2-of-3 probes failing for 3 minutes). Pages on-call automatically.
4. **Status page + monthly report** — real-time status page for transparency · monthly SLO report delivered in your account dashboard.
5. **Post-incident review** — published within 5 days of any major incident, including root cause and prevention measures.

### Monthly SLO Report

Available in your account under **Settings → SLO Report**. Includes:

- Uptime percentage for the month
- Scan success rate (scans that completed without error)
- P95 / P99 API response times
- Incident count and total downtime minutes
- SLA credit eligibility
- Downloadable as PDF for compliance evidence

---

## Enterprise SLA Addendum

Enterprise plans can negotiate custom SLA terms. Common customizations:

| Customizable term | Default | Enterprise range |
|---|---|---|
| Uptime SLA | 99.95% | Up to 99.99% |
| Credit percentage | 50% | Up to 100% |
| Support response (Critical) | < 1 hour | < 15 minutes |
| Dedicated support engineer | No | Yes |
| Custom maintenance window | No | Yes |
| Data residency | Account default | EU-only · US-only · Government cloud |
| Scan frequency | Daily | Up to hourly |
| SLA reporting | Monthly in-app | Monthly + quarterly review call |

Contact `sales@onam.io` to discuss Enterprise SLA terms.

---

## Status Page

Real-time platform status, incident history, and maintenance schedules: **[status.onam.io](https://status.onam.io)**

Subscribe to receive email or SMS alerts for incidents and maintenance.

---

*Effective: 2026-01-01 · Last reviewed: 2026-05-09*
*SLAs are subject to the Master Service Agreement (MSA). In case of conflict, the MSA governs.*
*For SLA credit claims: support@onam.io*
