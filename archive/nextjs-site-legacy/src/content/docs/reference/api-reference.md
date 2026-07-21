# API Reference

The platform exposes a unified REST API across every security domain. This reference covers authentication, base URLs, pagination, and the key endpoints. Every API call is **tenant-scoped, permission-checked at the engine layer, and idempotent on `scan_run_id`** — you can integrate the platform into any CI/CD pipeline, GRC tool, or custom dashboard with a single set of credentials.

> **Full OpenAPI specs** are available via the gateway at `GET /gateway/api/v1/docs`. The same spec drives the auto-generated `try-it` widget in the portal and any OpenAPI client generator.

<img src="/diagrams/api-reference.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:24px;" alt="REST API reference showing authentication flow, engine endpoint categories, pagination and response format" />

---

## Authentication

All API requests require a valid signed token. The token is issued by the platform's authentication service when you log in, scoped to your tenant ID, and validated on every request.

<img src="/diagrams/ref-api-auth-flow.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="API authentication flow — 6-step path from login to tenant-scoped engine response" />

**Reading the flow top-to-bottom:**

1. **POST /api/auth/login** — client sends credentials.
2. **Set-Cookie: access_token** — platform issues a signed token, scoped to your tenant ID.
3. **GET /gateway/api/v1/...** — client makes an API call, sending the token cookie.
4. **Validate token & build AuthContext** — gateway decodes the token, builds an internal context with tenant ID, role, and permissions.
5. **Forward to engine + X-Auth-Context** — gateway hands the request off to the engine with a signed context header (engines never trust client-supplied identity).
6. **Engine returns scoped response** — engine validates the required permission via `require_permission()`, runs the query with `WHERE tenant_id = ?` filter, returns the data.

**Two important properties:** the token is signed (tampering invalidates it immediately), and the engine layer does its own permission check (the gateway is not the only line of defense — every engine endpoint also validates).

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password"
}
```

Response sets an `access_token` cookie. Include this cookie in all subsequent requests.

### API Key Authentication (coming soon)

Long-lived API keys for programmatic access are on the roadmap. Subscribe to release notes for availability.

---

## Base URLs

All requests route through the API Gateway. Direct engine access is not supported in production.

| Environment | Base URL |
|---|---|
| Production | `https://api.onam.io` |
| Staging | `https://api.staging.onam.io` |
| Local dev | `http://localhost:8000` |

**Gateway prefix**: `/gateway/api/v1/`

---

## Common Patterns

### Pagination

All list endpoints use cursor-based pagination:

```http
GET /gateway/api/v1/findings?page=1&page_size=50&tenant_id={tenant_id}
```

| Parameter | Default | Max | Description |
|---|---|---|---|
| `page` | 1 | — | Page number |
| `page_size` | 50 | 200 | Results per page |

Response envelope:

```json
{
  "data": [...],
  "total": 1247,
  "page": 1,
  "page_size": 50,
  "pages": 25
}
```

### Filtering

Most list endpoints support filtering via query parameters:

```http
GET /gateway/api/v1/findings?severity=CRITICAL&provider=aws&status=FAIL
```

### BFF Views (Dashboard Data)

Dashboard charts and aggregated metrics use the BFF view pattern:

```http
GET /gateway/api/v1/views/{page_name}
```

These return pre-aggregated data for the portal UI but are also usable programmatically.

### Error Responses

```json
{
  "error": "Forbidden",
  "detail": "Missing permission: discoveries:read",
  "status_code": 403
}
```

| Status | Meaning |
|---|---|
| `400` | Bad request — invalid parameters |
| `401` | Unauthenticated — missing or expired token |
| `403` | Forbidden — insufficient permissions |
| `404` | Resource not found |
| `422` | Validation error — see `detail` field |
| `500` | Internal server error |

---

## Endpoints by Domain

The unified API gateway routes to per-domain endpoints. **Every endpoint shares the same response envelope, error envelope, and pagination contract** — once you've integrated one domain, the others work the same way.

<img src="/diagrams/ref-api-endpoints.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="API endpoints by domain — gateway routes to 13 per-domain endpoints under unified contract" />

**The 13 domain endpoints:**

| Domain | Path | What it returns |
|---|---|---|
| Discovery | `/discoveries` | Cloud resource enumeration |
| Inventory | `/inventory` | Normalized assets with relationships |
| Check | `/check` | Rule evaluation findings (PASS / FAIL) |
| Threat | `/threat` | MITRE ATT&CK-mapped attack paths |
| Compliance | `/compliance` | Per-framework scores and reports |
| IAM | `/iam` | IAM posture findings |
| CIEM | `/ciem` | Identity entitlement findings |
| Network Security | `/network-security` | 7-layer network findings |
| Data Security | `/datasec` | DSPM findings |
| Vulnerability | `/vulnerability` | CVE findings + SBOM |
| Container Security | `/container-security` | Kubernetes posture |
| Risk | `/risk` | FAIR risk scoring |
| SecOps | `/secops` | SAST · DAST · SCA · IaC scanning |
| BFF Views | `/views/{page}` | Aggregated dashboard data |

---

### Discovery Engine

**Base**: `/gateway/api/v1/discoveries`

| Method | Path | Description | Permission |
|---|---|---|---|
| `GET` | `/` | List all discovery findings | `discoveries:read` |
| `GET` | `/{finding_id}` | Get a single discovery finding | `discoveries:read` |
| `GET` | `/summary` | Summary counts by resource type | `discoveries:read` |
| `POST` | `/scan` | Trigger a new discovery scan | `scans:create` |
| `GET` | `/health/live` | Liveness probe | Public |
| `GET` | `/health/ready` | Readiness probe | Public |

**Example — list discovery findings:**

```http
GET /gateway/api/v1/discoveries/?provider=aws&resource_type=aws_s3_bucket&page=1&page_size=50
Cookie: access_token=<token>
```

```json
{
  "data": [
    {
      "finding_id": "a1b2c3d4",
      "scan_run_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "my-tenant",
      "resource_uid": "arn:aws:s3:::my-bucket",
      "resource_type": "aws_s3_bucket",
      "provider": "aws",
      "region": "us-east-1",
      "account_id": "123456789012",
      "raw_config": { ... },
      "last_seen_at": "2026-05-08T10:00:00Z"
    }
  ],
  "total": 342,
  "page": 1,
  "page_size": 50
}
```

---

### Check Engine (Security Findings)

**Base**: `/gateway/api/v1/check`

| Method | Path | Description | Permission |
|---|---|---|---|
| `GET` | `/findings` | List PASS/FAIL rule findings | `check:read` |
| `GET` | `/findings/{finding_id}` | Single finding detail | `check:read` |
| `GET` | `/findings/summary` | Count by severity and status | `check:read` |
| `GET` | `/rules` | List all active check rules | `check:read` |
| `GET` | `/rules/{rule_id}` | Rule metadata and description | `check:read` |
| `POST` | `/scan` | Trigger check evaluation | `scans:create` |

**Example — get critical failing findings:**

```http
GET /gateway/api/v1/check/findings?severity=CRITICAL&status=FAIL&page=1
```

```json
{
  "data": [
    {
      "finding_id": "e5f6a7b8",
      "rule_id": "AWS-S3-001",
      "rule_title": "S3 Bucket Public Access Not Blocked",
      "resource_uid": "arn:aws:s3:::my-public-bucket",
      "resource_type": "aws_s3_bucket",
      "severity": "CRITICAL",
      "status": "FAIL",
      "provider": "aws",
      "region": "us-east-1",
      "remediation": "Enable S3 Block Public Access settings...",
      "first_seen_at": "2026-04-01T00:00:00Z",
      "last_seen_at": "2026-05-08T10:00:00Z"
    }
  ],
  "total": 47
}
```

---

### Compliance Engine

**Base**: `/gateway/api/v1/compliance`

| Method | Path | Description | Permission |
|---|---|---|---|
| `GET` | `/frameworks` | List all compliance frameworks | `compliance:read` |
| `GET` | `/frameworks/{framework_id}/score` | Score for a framework | `compliance:read` |
| `GET` | `/frameworks/{framework_id}/controls` | Controls with pass/fail counts | `compliance:read` |
| `GET` | `/reports` | List generated reports | `compliance:read` |
| `POST` | `/reports` | Generate a new report | `compliance:read` |
| `GET` | `/reports/{report_id}` | Download a report (JSON/CSV) | `compliance:read` |

**Example — get framework score:**

```http
GET /gateway/api/v1/compliance/frameworks/cis-aws-v3/score
```

```json
{
  "framework_id": "cis-aws-v3",
  "framework_name": "CIS AWS Foundations Benchmark v3.0",
  "score": 78.4,
  "pass_count": 312,
  "fail_count": 86,
  "total_controls": 398,
  "last_evaluated": "2026-05-08T10:00:00Z",
  "trend": [
    {"date": "2026-04-01", "score": 74.1},
    {"date": "2026-05-01", "score": 78.4}
  ]
}
```

---

### Threat Engine

**Base**: `/gateway/api/v1/threat`

| Method | Path | Description | Permission |
|---|---|---|---|
| `GET` | `/findings` | List threat findings | `threat:read` |
| `GET` | `/findings/{finding_id}` | Threat finding detail | `threat:read` |
| `GET` | `/attack-paths` | List attack paths | `threat:read` |
| `GET` | `/attack-paths/{path_id}` | Attack path detail with graph | `threat:read` |
| `GET` | `/techniques` | MITRE ATT&CK techniques detected | `threat:read` |
| `POST` | `/graph/build` | Trigger security graph build | `scans:create` |
| `GET` | `/graph/build/status/{job_id}` | Graph build status | `threat:read` |

---

### IAM Engine

**Base**: `/gateway/api/v1/iam`

| Method | Path | Description | Permission |
|---|---|---|---|
| `GET` | `/findings` | IAM posture findings | `iam:read` |
| `GET` | `/users` | IAM users with risk scores | `iam:read` |
| `GET` | `/roles` | IAM roles and effective permissions | `iam:read` |
| `GET` | `/summary` | IAM posture summary | `iam:read` |

---

### Vulnerability Engine

**Base**: `/gateway/api/v1/vulnerability`

| Method | Path | Description | Permission |
|---|---|---|---|
| `GET` | `/findings` | CVE findings | `vulnerability:read` |
| `GET` | `/findings/{finding_id}` | CVE detail with EPSS/CVSS | `vulnerability:read` |
| `GET` | `/sbom` | Software Bill of Materials | `vulnerability:read` |
| `GET` | `/summary` | Vulnerability summary by severity | `vulnerability:read` |

---

### BFF Views (Aggregated Dashboard Data)

**Base**: `/gateway/api/v1/views`

| Path | Description |
|---|---|
| `/views/dashboard` | Top-level posture overview |
| `/views/discoveries` | Discovery summary and resource counts |
| `/views/inventory` | Asset inventory overview |
| `/views/threat` | Threat center summary |
| `/views/compliance` | Compliance scores per framework |
| `/views/network` | Network topology summary |
| `/views/iam` | IAM posture summary |
| `/views/vulnerability` | Vulnerability summary |
| `/views/container` | Container security overview |
| `/views/datasec` | Data security overview |
| `/views/risk` | Risk posture overview |

**Example:**

```http
GET /gateway/api/v1/views/dashboard
```

```json
{
  "posture_score": 72,
  "critical_findings": 12,
  "high_findings": 47,
  "total_resources": 8432,
  "accounts_connected": 3,
  "last_scan": "2026-05-08T10:00:00Z",
  "compliance_summary": {
    "cis-aws-v3": 78.4,
    "nist-csf-2": 81.2
  }
}
```

---

## Rate Limits

| Plan | Requests/minute | Requests/hour |
|---|---|---|
| Starter | 60 | 1,000 |
| Growth | 300 | 10,000 |
| Enterprise | 1,000 | 50,000 |

Rate limit headers are returned on every response:

```
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 247
X-RateLimit-Reset: 1746691200
```

---

## SDK & Client Libraries

Official clients are in development. Community-maintained clients:

| Language | Repository | Status |
|---|---|---|
| Python | coming soon | Planned |
| Go | coming soon | Planned |
| Terraform Provider | coming soon | Planned |

---

*Last updated: 2026-05-09*
*Full OpenAPI specs at `/gateway/api/v1/docs`*
