# Integration Catalog

Connect the platform to your existing security toolchain. Every integration is configured under **Settings → Integrations**, takes 2–5 minutes to set up, and uses your existing credentials in the target system — no service accounts to provision separately. The platform pushes findings, scan events, and compliance scores; some integrations (Jira, ServiceNow, GitHub Issues) also sync state back so closures propagate to the right side.

<img src="/diagrams/integrations.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:24px;" alt="Integration catalog showing SIEM and observability, ticketing and workflow, and alerting and CI/CD integrations" />

**Why integrations matter:** the platform is best when its findings show up where your team already lives — in Slack channels, Jira queues, PagerDuty rotations, Splunk dashboards. A finding that gets emailed once and forgotten doesn't get fixed; a finding that lands as a tracked Jira ticket does.

---

## Integration Ecosystem

The integration catalog is grouped into six categories. You typically connect 3–5 of these on first onboarding (Slack + Jira + Splunk are the most common starter set) and add more over time.

| Category | Why connect | Typical integrations |
|---|---|---|
| **🎫 Ticketing & Project Management** | Get findings into the queue your team already works from | Jira · ServiceNow · Azure DevOps · Linear · GitHub Issues |
| **💬 Messaging & Alerting** | Get critical findings to humans within minutes | Slack · Microsoft Teams · PagerDuty · OpsGenie · Email |
| **🔍 SIEM & Observability** | Combine findings with your security telemetry for cross-correlation | Splunk · Azure Sentinel · AWS Security Hub · Datadog · Sumo Logic · IBM QRadar |
| **⚡ SOAR & Automation** | Trigger your playbook automatically on critical findings | Cortex XSOAR · Torq · Tines · Generic Webhook |
| **📋 Compliance & GRC** | Push compliance evidence to your audit-tracking platform | Drata · Vanta · Hyperproof |
| **🔄 CI/CD & Code** | Catch IaC and code issues before merge | GitHub Actions · GitLab CI · Jenkins · Azure Pipelines |

---

## Available Integrations

### Ticketing & Project Management

| Integration | Status | What It Does |
|---|---|---|
| **Jira** | ✅ Available | Auto-create Jira issues for critical/high findings; sync status back to platform |
| **ServiceNow** | ✅ Available | Create ServiceNow incidents for findings; bidirectional status sync |
| **Azure DevOps** | 🔄 Coming Soon | Create work items for security findings |
| **Linear** | 🔄 Coming Soon | Create Linear issues for code security findings |
| **GitHub Issues** | 🔄 Coming Soon | Create issues linked to SecOps findings |

### Messaging & Alerting

| Integration | Status | What It Does |
|---|---|---|
| **Slack** | ✅ Available | Send finding alerts to Slack channels; configure per-severity routing |
| **Microsoft Teams** | ✅ Available | Send alerts to Teams channels |
| **PagerDuty** | ✅ Available | Page on-call for critical findings; auto-resolve when fixed |
| **OpsGenie** | ✅ Available | Create OpsGenie alerts for critical findings |
| **Email / SMTP** | ✅ Available | Daily/weekly digest; real-time critical alerts |

### SIEM & Observability

| Integration | Status | What It Does |
|---|---|---|
| **Splunk** | ✅ Available | Stream findings and scan events to Splunk HEC |
| **Azure Sentinel** | ✅ Available | Forward findings as Sentinel custom logs |
| **AWS Security Hub** | ✅ Available | Push findings in ASFF format to Security Hub |
| **Datadog** | 🔄 Coming Soon | Stream findings as Datadog events |
| **Sumo Logic** | 🔄 Coming Soon | Stream findings to Sumo Logic HTTP source |
| **IBM QRadar** | 🔄 Coming Soon | Push findings via QRadar syslog/CEF |

### SOAR & Automation

| Integration | Status | What It Does |
|---|---|---|
| **Generic Webhook** | ✅ Available | POST findings to any HTTP endpoint |
| **Cortex XSOAR** | 🔄 Coming Soon | Trigger XSOAR playbooks from findings |
| **Torq** | 🔄 Coming Soon | Trigger Torq workflows from findings |
| **Tines** | 🔄 Coming Soon | Trigger Tines stories from findings |

### Compliance & GRC

| Integration | Status | What It Does |
|---|---|---|
| **Drata** | 🔄 Coming Soon | Push compliance evidence to Drata |
| **Vanta** | 🔄 Coming Soon | Push compliance evidence to Vanta |
| **Hyperproof** | 🔄 Coming Soon | Push compliance evidence to Hyperproof |

### CI/CD Pipelines

| Integration | Status | What It Does |
|---|---|---|
| **GitHub Actions** | ✅ Available | Scan IaC and code repos in CI; fail PRs on new critical findings |
| **GitLab CI** | ✅ Available | Same as GitHub Actions for GitLab pipelines |
| **Jenkins** | 🔄 Coming Soon | Jenkins plugin for IaC scanning |
| **Azure Pipelines** | 🔄 Coming Soon | Task for IaC scanning in Azure DevOps pipelines |

---

## Setup Guides

### Jira

The Jira integration is the most-used integration on the platform. It auto-creates Jira issues for findings that match your filters and **bidirectionally syncs status** — closing the Jira issue acknowledges the finding, re-opening the Jira issue re-opens the finding.

<img src="/diagrams/ref-int-jira-flow.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="Jira auto-create flow — critical finding triggers Jira issue, team remediates, scan verifies, finding auto-closes" />

**Reading the flow left-to-right:**

1. **Critical finding** detected — e.g. an S3 bucket with public access containing PII.
2. **Auto-create rule** — the integration filter decides whether to create a Jira issue (CRITICAL only / CRITICAL+HIGH / all findings).
3. **Jira issue created** — populated with summary, description, priority, labels, and an Onam deep-link.
4. **Team remediates** — standard Jira workflow; move to Done when the cloud config is fixed.
5. **Auto-close** — the next platform scan verifies the fix and closes the finding (which also marks the Jira issue done if not already).

**Bidirectional sync:** resolving the Jira issue acknowledges the finding in the platform; re-opening the Jira issue re-opens the finding. State stays consistent across both systems.

**Steps:**
1. Navigate to **Settings → Integrations → Jira → Connect**
2. Enter your Jira base URL (e.g., `https://yourcompany.atlassian.net`)
3. Enter a Jira **API token** (generate at [id.atlassian.com](https://id.atlassian.com/manage-profile/security/api-tokens))
4. Enter your Jira **email address**
5. Click **Test Connection**
6. Configure:
   - **Project Key** — which Jira project to create issues in
   - **Issue Type** — Bug / Task / Story (recommend: Bug or Security)
   - **Severity mapping** — CRITICAL → Priority: Highest, HIGH → High, etc.
   - **Auto-create threshold** — create issues for CRITICAL only / CRITICAL+HIGH / All
7. Click **Save**

**Jira issue fields populated automatically:**
- Summary: `[CSPM] {rule_title} — {resource_uid}`
- Description: finding detail, affected resource, remediation steps, CSPM deep link
- Priority: mapped from finding severity
- Labels: `cspm`, `cloud-security`, `{provider}`

---

### Slack

**Steps:**
1. Navigate to **Settings → Integrations → Slack → Connect**
2. Click **Connect to Slack** — authorize the Slack app in your workspace
3. Select **Notification Channels**:
   - `#security-critical` → CRITICAL findings only
   - `#security-alerts` → HIGH and above
   - `#security-digest` → Daily summary

**Example Slack message:**

```
🔴 CRITICAL Finding Detected
Rule: S3 Bucket Public Access Not Blocked
Resource: arn:aws:s3:::my-bucket
Account: production-aws (123456789012)
Region: us-east-1
First seen: 2026-05-08 10:00 UTC

Remediation: Enable S3 Block Public Access...
[View in CSPM] [Create Jira Issue]
```

---

### Generic Webhook

The webhook integration sends a POST request to your endpoint for every finding that matches your configured filters.

**Steps:**
1. Navigate to **Settings → Integrations → Webhook → Add Webhook**
2. Enter the **Endpoint URL**
3. Configure optional **HMAC Secret** for payload verification
4. Set **Filters**: severity, provider, resource_type, status
5. Click **Test** to send a sample payload

**Payload format:**

```json
{
  "event": "finding.created",
  "timestamp": "2026-05-08T10:00:00Z",
  "tenant_id": "your-tenant",
  "finding": {
    "finding_id": "a1b2c3d4",
    "rule_id": "AWS-S3-001",
    "rule_title": "S3 Bucket Public Access Not Blocked",
    "severity": "CRITICAL",
    "status": "FAIL",
    "resource_uid": "arn:aws:s3:::my-bucket",
    "resource_type": "aws_s3_bucket",
    "provider": "aws",
    "region": "us-east-1",
    "account_id": "123456789012",
    "remediation": "Enable S3 Block Public Access...",
    "first_seen_at": "2026-05-08T10:00:00Z"
  }
}
```

**Verifying the signature:**

```python
import hmac, hashlib

def verify_webhook(payload: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)
```

---

### Splunk

**Steps:**
1. In Splunk, create an **HTTP Event Collector (HEC) token**:
   - Settings → Data Inputs → HTTP Event Collector → New Token
   - Source type: `cspm:findings`
2. In the CSPM platform, navigate to **Settings → Integrations → Splunk → Connect**
3. Enter:
   - **HEC URL**: `https://your-splunk-instance:8088`
   - **HEC Token**: from Step 1
   - **Index**: `security` (or your preferred index)
4. Click **Test Connection → Save**

Findings are streamed to Splunk in real time after each scan completes.

**Splunk search example:**

```spl
index=security sourcetype=cspm:findings severity=CRITICAL status=FAIL
| table _time, rule_title, resource_uid, provider, region, account_id
| sort -_time
```

---

### AWS Security Hub

**Steps:**
1. Enable Security Hub in your AWS account
2. In the CSPM platform: **Settings → Integrations → AWS Security Hub → Connect**
3. Select the AWS **Region** where Security Hub is enabled
4. Enter the **Account ID** and IAM **Role ARN** with `securityhub:BatchImportFindings` permission
5. Click **Save**

Findings are forwarded in ASFF (Amazon Security Finding Format) and appear in Security Hub under the custom product `CSPM Platform`.

---

## Webhook Event Types

| Event | Trigger |
|---|---|
| `finding.created` | New FAIL finding detected |
| `finding.resolved` | Previously FAIL finding now PASS |
| `finding.severity_changed` | Finding severity escalated or de-escalated |
| `scan.completed` | Full scan pipeline completed |
| `scan.failed` | Engine scan failure |
| `compliance.score_changed` | Framework score changed by ≥ 5% |

---

## Request an Integration

Don't see an integration you need? Submit a request:

- **In-app**: Settings → Integrations → Request Integration
- **Email**: integrations@onam.io
- **GitHub**: Open an issue with label `integration-request`

---

*Last updated: 2026-05-09*
*Integration status is updated monthly in release notes.*
