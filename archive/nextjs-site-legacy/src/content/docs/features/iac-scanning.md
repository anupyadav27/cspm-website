# IaC Scanning & SecOps

The platform's SecOps engine scans **Infrastructure-as-Code templates, application code, and open-source dependencies** before they reach production — at pull-request time, in CI, and on-demand. The job is to catch security issues at the earliest, cheapest point in the SDLC: in the developer's editor, before the code merges, before the pipeline deploys, before a real cloud resource exists.

<img src="/diagrams/iac-scanning.svg" style="width:100%;max-width:920px;border-radius:10px;" alt="Shift-left IaC scanning pipeline" />

**Why shift-left in 2026 is non-negotiable:** the same misconfiguration costs **50× more to fix in production than in a developer's branch**. By the time a public S3 bucket exists, you've already spent CI minutes deploying it, post-deploy CSPM has fired an alert, an analyst has triaged it, and you've changed three places (the Terraform, the deployed bucket, the rollback plan) instead of one. SecOps catches it once, at the source, before the cost compounds.

---

## The Shift-Left Model

The further left in the SDLC you catch a security issue, the cheaper it is to fix. The numbers below are industry averages from IBM's "Cost of a Data Breach" report and NIST's "Software Cost Estimation" study — they hold across language and team size.

| Stage | Where the issue is found | Average cost to fix | Why the cost grows |
|---|---|---:|---|
| 🟢 **Development** | Developer's IDE / pre-commit hook | **~$80** | One person, one file, one edit |
| 🟡 **Code Review** | Pull-request review | ~$240 | Reviewer + author context-switch |
| 🟡 **CI Pipeline** | Build / test / scan job | ~$960 | Pipeline minutes + re-runs + branch coordination |
| 🟠 **Staging** | Deployed to staging environment | ~$7,600 | Test data state + downstream system impact |
| 🔴 **Production** | Live customer-impacting deployment | ~$7,600+ | Incident response, rollback, post-mortems |
| 💀 **Post-Breach** | After a security incident | **$4M+** | IBM 2024 average — combined detection, response, customer notification, regulatory fines |

**The platform runs at every stage** — IDE plugin (development), GitHub PR / GitLab MR comment (code review), CI integration (pipeline), and the unified posture dashboard (staging + production). One rule catalog evaluates the same misconfiguration consistently across all stages.

---

## Capabilities

The SecOps engine ships **five scan categories** out of the box. You can enable them individually per repository or run them all together in a single integrated scan.

| Category | Acronym | Scope | Scale |
|---|---|---|---|
| **Static Application Security Testing** | SAST | Source code analysis across 14 languages | 2,852 rules · OWASP Top 10 · CWE-mapped |
| **Infrastructure-as-Code scanning** | IaC | Terraform · CloudFormation · ARM · Bicep · Helm · Kustomize · raw K8s YAML · Pulumi · Ansible · Dockerfile | 340+ Terraform rules + per-format coverage |
| **Software Composition Analysis** | SCA | Open-source dependency CVEs · license compliance · transitive analysis · SBOM generation | All major language ecosystems |
| **Dynamic Application Security Testing** | DAST | Runtime fuzzing of HTTP APIs and web apps | 479 attack payloads · OWASP API Top 10 · injection / auth-bypass |
| **Secrets Detection** | Secrets | Hardcoded credentials in any file | 120+ patterns — see "Secrets Detection Patterns" below |

A typical PR scan completes in **30–90 seconds** for a repo of ~50K LOC. Larger monorepos (1M+ LOC) take 5–10 minutes; the platform incrementally scans only the changed files when called via PR webhook.

---

## Supported Languages & Frameworks

### SAST Language Coverage

| Language | Rules | Frameworks detected |
|---|---:|---|
| Python | 380 | Django, Flask, FastAPI, SQLAlchemy |
| JavaScript / TypeScript | 420 | Node.js, React, Express, Next.js, NestJS |
| Java | 310 | Spring Boot, Spring MVC, Hibernate |
| Go | 180 | net/http, Gin, Echo, GORM |
| Ruby | 120 | Rails, Sinatra |
| PHP | 150 | Laravel, Symfony, WordPress |
| C# / .NET | 190 | ASP.NET Core, Entity Framework |
| C / C++ | 210 | Memory safety, buffer overflows |
| Kotlin | 95 | Android, Spring |
| Swift | 80 | iOS SDK patterns |
| Rust | 70 | Memory safety analysis |
| Scala | 85 | Akka, Play Framework |
| Terraform (HCL) | 340 | All major providers |
| Kubernetes YAML | 220 | Pod specs, RBAC, network policies |

### IaC Framework Coverage

A single rule like "S3 bucket public access not blocked" fires identically against Terraform, CloudFormation, Pulumi, and Helm — wherever the template surfaces the misconfiguration. **The rule catalog is unified across template languages** so you don't have to maintain four separate rule sets.

<img src="/diagrams/feat-iac-frameworks.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="IaC framework coverage — Terraform, CloudFormation, Kubernetes, ARM/Bicep/Pulumi/Ansible/Docker, all converging on one engine" />

**The four template-language families covered:**

| Family | Variants supported | Notes |
|---|---|---|
| **Terraform / OpenTofu** | AWS (200+ resources), Azure (150+), GCP (130+), Kubernetes provider | Module recursion supported · `.tf` and `.tf.json` |
| **AWS CloudFormation** | SAM, native CFN (YAML / JSON), CDK synth output | CDK is scanned post-synth, not the TypeScript / Python source |
| **Kubernetes** | Helm charts (`.tgz` + `values.yaml` + rendered manifests), Kustomize overlays + bases, raw YAML, CRDs | Helm rendering is performed by the scanner — pass the chart, not the rendered output |
| **Other** | Azure ARM + Bicep, Pulumi (Python / TypeScript), Ansible Playbooks + Roles, Dockerfiles + Containerfiles | Pulumi requires the synthesized state for full coverage |

---

## CI/CD Integration

The engine ships first-class integrations with the four most common CI/CD systems. Each integration runs the same scanner with the same rule catalog — only the orchestration mechanics differ.

### GitHub Actions

```yaml
# .github/workflows/cspm-scan.yml
name: Onam Security Scan

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Onam IaC + SAST Scan
        uses: onam-io/secops-scan-action@v1
        with:
          api-key: ${{ secrets.ONAM_API_KEY }}
          scan-types: iac,sast,sca,secrets
          fail-on: CRITICAL,HIGH
          paths: |
            terraform/
            k8s/
            src/

      - name: Upload SARIF Results
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: onam-results.sarif
        if: always()
```

**What the action does:**
1. Scans IaC templates in `terraform/` and `k8s/`
2. Runs SAST on application code in `src/`
3. Checks dependencies for CVEs (SCA)
4. Detects secrets in any file
5. Fails the CI job if CRITICAL or HIGH findings are found
6. Uploads results to GitHub Security tab (via SARIF)

### GitLab CI

```yaml
# .gitlab-ci.yml
onam-security-scan:
  stage: test
  image: onam/secops-scanner:latest
  script:
    - onam scan --type iac,sast,sca,secrets
                --api-key $ONAM_API_KEY
                --fail-on CRITICAL,HIGH
                --output sarif
  artifacts:
    reports:
      sast: onam-results.sarif
    when: always
  rules:
    - if: $CI_MERGE_REQUEST_IID
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
```

### Jenkins

```groovy
// Jenkinsfile
pipeline {
    agent any
    stages {
        stage('Onam Security Scan') {
            steps {
                sh '''
                    onam scan \
                      --type iac,sast,sca,secrets \
                      --api-key ${ONAM_API_KEY} \
                      --fail-on CRITICAL,HIGH \
                      --output junit \
                      --output-file onam-results.xml
                '''
            }
            post {
                always {
                    junit 'onam-results.xml'
                }
            }
        }
    }
}
```

**Other CI systems** — Azure DevOps, CircleCI, Bitbucket Pipelines, Buildkite — use the same `onam` CLI. Examples in the platform docs.

---

## Finding Categories

The engine produces findings in two main dimensions: **SAST findings** (issues in application code) and **IaC findings** (issues in infrastructure templates). Each carries severity, CWE / CIS mapping, and a remediation suggestion.

### SAST Finding Examples

| Finding | Severity | CWE | Language |
|---|---|---|---|
| SQL Injection via f-string | CRITICAL | CWE-89 | Python |
| Command injection via subprocess | CRITICAL | CWE-78 | Python, Node.js |
| Hardcoded credentials | HIGH | CWE-798 | All |
| Path traversal | HIGH | CWE-22 | All |
| XSS via unescaped output | HIGH | CWE-79 | JS/TS, PHP, Ruby |
| Insecure deserialization | HIGH | CWE-502 | Java, Python |
| SSRF via unvalidated URL | HIGH | CWE-918 | All |
| JWT secret hardcoded | HIGH | CWE-798 | All |
| Weak cryptography (MD5/SHA1) | MEDIUM | CWE-327 | All |
| Missing CSRF protection | MEDIUM | CWE-352 | Web frameworks |

### IaC Finding Examples

| Finding | Severity | Resource type |
|---|---|---|
| S3 bucket with public ACL | CRITICAL | `aws_s3_bucket` |
| Security group: SSH open to `0.0.0.0/0` | CRITICAL | `aws_security_group` |
| RDS instance not encrypted | HIGH | `aws_db_instance` |
| EKS node group with public endpoint | HIGH | `aws_eks_cluster` |
| Privileged container in pod spec | HIGH | Kubernetes Pod |
| `cluster-admin` binding in Helm chart | HIGH | Kubernetes ClusterRoleBinding |
| Lambda function with admin role | HIGH | `aws_iam_role` |
| Terraform state in unencrypted S3 | MEDIUM | `terraform_backend` |
| Missing resource limits in K8s | MEDIUM | Kubernetes Deployment |
| Docker image using `latest` tag | MEDIUM | Dockerfile |

---

## Secrets Detection Patterns

The engine ships **120+ secret patterns** across five categories. Each pattern combines a regex with an entropy / format check — high-entropy strings that don't match a known pattern are also flagged as "possible generic secret".

| Category | Patterns include | Why each is dangerous |
|---|---|---|
| **Cloud Credentials** | AWS Access Key ID, AWS Secret Access Key, GCP Service Account JSON, Azure Client Secret, OCI API Key | Full account compromise possible |
| **API Keys** | GitHub PAT, GitLab PAT, Slack Token, Stripe Secret Key, Twilio Auth Token, SendGrid API Key, OpenAI API Key, Anthropic API Key | Direct service abuse / billing fraud |
| **Database Credentials** | PostgreSQL connection strings, MySQL connection strings, MongoDB connection strings, Redis URLs with auth | Direct data access |
| **Certificates & Keys** | RSA Private Key PEM, EC Private Key, PKCS12 Certificate, SSH private keys | TLS termination / client-cert auth bypass |
| **Generic Patterns** | High-entropy strings, `password=` in code, `secret=` assignments, Bearer tokens in code | Catch-all for secrets that don't match known formats |

**Pre-commit hook** integration is supported via `pre-commit-onam-secrets` — same pattern set, runs locally on every commit, blocks commits before they hit the remote.

---

## Output Formats

| Format | Use case |
|---|---|
| **SARIF** | GitHub Security tab, VS Code, any SARIF-compatible tool — recommended default |
| **JUnit XML** | Jenkins, Azure DevOps test reports |
| **JSON** | API consumption, custom dashboards, SIEM ingestion |
| **HTML** | Human-readable report — useful for sharing with non-developer stakeholders |
| **PDF** | Audit and compliance evidence |

---

## API

The SecOps API is part of the unified platform API. All endpoints require an authenticated session and are scoped to your tenant.

```http
# List SecOps findings for a repository
GET /gateway/api/v1/secops/findings?repo=github.com/org/repo&severity=CRITICAL

# Trigger a scan on a repository
POST /gateway/api/v1/secops/scan
Content-Type: application/json
{"repo_url": "https://github.com/org/repo", "branch": "main", "scan_types": ["iac", "sast", "sca"]}

# Get scan results by scan ID
GET /gateway/api/v1/secops/scans/{scan_id}/findings

# SecOps posture summary
GET /gateway/api/v1/views/secops
```

Webhook delivery on every completed scan can be configured under **Settings → Notifications**.

---

## Frequently Asked Questions

**How does SecOps integrate with my existing branch protection rules?**
The PR / MR comment integration posts a status check that you can require in your branch protection rules. CRITICAL or HIGH findings cause the check to fail, blocking merge until resolved or suppressed.

**Can I suppress a finding I've reviewed and accepted?**
Yes. Suppressions are file-and-line-anchored and require a documented justification. Suppressions follow the file even if it moves; they expire by default after 90 days unless renewed.

**Does SecOps scan dependencies recursively?**
Yes. SCA performs full transitive dependency analysis — a vulnerability in a dependency-of-a-dependency surfaces with the full path so you can decide whether to update the direct dependency or wait for the upstream.

**Can I run SecOps on monorepos?**
Yes. Path-based scoping lets you scan only the changed paths on PRs, with per-path rule profiles (e.g. stricter rules for `production/` than `playground/`).

**What about my AI-generated code?**
SAST treats AI-generated code identically to human-written code. We've found that AI-generated code has a slightly higher hardcoded-credentials and incomplete-input-validation rate, so the same rule catalog catches both.

**Can I use SecOps in air-gapped environments?**
Yes — on-premises deployment is supported on Enterprise plans. The scanner runs entirely in your network with rule catalog updates pulled via a one-way mirror.

---

*Last updated: 2026-05-09*
*For questions: support@onam.io*
