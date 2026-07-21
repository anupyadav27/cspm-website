---
title: Code Security (SecOps)
description: SAST, DAST, SCA, and IaC scanning with 2,852 rules across 14 languages. SBOM generation, EPSS enrichment, and AI-powered fix suggestions.
---

# Code Security (SecOps)

## Overview

Onam SecOps brings SAST, DAST, SCA, and IaC scanning into the same platform as your cloud posture data — correlating code vulnerabilities with cloud exposure context to surface the risks that truly matter.

## Coverage

### SAST — Static Application Security Testing

**2,852 rules** across 14 languages:

| Language | Rule Count | Key Coverage |
|---|---|---|
| Python | 340+ | Injection, deserialization, crypto, secrets |
| JavaScript | 380+ | XSS, prototype pollution, ReDoS, SSRF |
| TypeScript | 310+ | Type coercion attacks, injection, auth bypass |
| Java | 280+ | Deserialization, XXE, SSRF, OGNL injection |
| Go | 220+ | Race conditions, crypto misuse, SSRF |
| Ruby | 180+ | Mass assignment, CSRF, template injection |
| PHP | 200+ | SQL injection, LFI/RFI, file upload bypass |
| C / C++ | 260+ | Buffer overflow, use-after-free, format strings |
| C# | 190+ | Deserialization, path traversal, LDAP injection |
| Rust | 120+ | Unsafe blocks, crypto misuse, integer overflow |
| Kotlin | 130+ | Android-specific, intent redirect, crypto |
| Swift | 110+ | Insecure storage, URL scheme hijack |
| Terraform | 180+ | IaC misconfigurations, public resource exposure |
| HCL (generic) | 150+ | Module trust, resource exposure |

Rule sources: OWASP Top 10, CWE Top 25, SANS Top 25, cloud-specific security patterns.

### DAST — Dynamic Application Security Testing

**479 active test payloads** across 12 vulnerability classes:

- SQL injection (MySQL, PostgreSQL, MSSQL, Oracle, SQLite variants)
- Cross-site scripting (reflected, stored, DOM-based)
- Server-side request forgery (internal network, cloud metadata endpoint)
- XML external entity injection
- Template injection (Jinja2, Twig, Freemarker, Pebble, Velocity)
- IDOR / broken object-level authorization
- Authentication bypass (default credentials, forced browsing, JWT attacks)
- Business logic flaws (price manipulation, quantity bypass, coupon stacking)
- HTTP request smuggling
- GraphQL introspection and injection
- API security (broken authentication, excessive data exposure, mass assignment)
- File upload bypass

### SCA — Software Composition Analysis

Scans all third-party dependencies across package managers:
- npm / yarn / pnpm (JavaScript, TypeScript)
- pip / pipenv / poetry (Python)
- Maven / Gradle (Java, Kotlin)
- Go modules
- Cargo (Rust)
- Bundler (Ruby)
- Composer (PHP)
- NuGet (.NET, C#)
- CocoaPods / Swift Package Manager (Swift, Kotlin/iOS)

Vulnerability enrichment:
- **NVD CVE data** — full CVSS v3 scores and vector strings
- **EPSS** — 30-day exploit probability (FIRST.org daily feed)
- **CISA KEV** — active exploitation flag (daily feed)
- **GitHub Security Advisories** — ecosystem-specific advisories
- **OSV.dev** — open source vulnerability database

### IaC Scanning

Supports:
- **Terraform** (.tf files, Terraform plans)
- **AWS CloudFormation** (JSON and YAML templates)
- **Helm charts** (values.yaml and template files)
- **Kubernetes manifests** (YAML — Deployment, StatefulSet, DaemonSet, Pod, etc.)
- **Azure ARM templates** and Bicep
- **Pulumi** (TypeScript, Python, Go)
- **Docker Compose** files

## SBOM Generation

CycloneDX 1.4-format SBOM generated for every repository and service:

- Full component inventory (name, version, package URL, licenses)
- CVE status pre-populated for every component
- EPSS and KEV data embedded
- Signed with provider attestation for supply chain verification
- Exportable as JSON or XML for procurement, regulatory, and audit purposes

## AI-Powered Fix Suggestions

For every SAST finding, Onam generates an AI-powered code fix using the Mistral-based SecOps Fix engine:

1. **Context injection** — the fix engine receives: the vulnerable code snippet, the full file context, the cloud context (is this code running in an internet-exposed function? what IAM permissions does it have?), and the finding description.
2. **Fix generation** — a corrected code diff is generated addressing both the code vulnerability and any amplifying cloud context.
3. **Confidence scoring** — each fix is rated High / Medium / Low confidence based on how similar the pattern is to known-good fix patterns.
4. **PR integration** — fixes can be applied directly as pull request suggestions in GitHub, GitLab, and Bitbucket.

## CI/CD Integration

Onam SecOps integrates as a CI/CD check:

**GitHub Actions:**
```yaml
- uses: onam-security/secops-scan@v2
  with:
    api_key: ${{ secrets.ONAM_API_KEY }}
    fail_on: critical    # critical | high | medium
    exclude_accepted: true
```

**Blocking gates — configurable per environment:**
- Block any deployment to production with a Critical SAST finding
- Block any dependency with a KEV-flagged CVE from reaching staging
- Warn (non-blocking) on Medium findings in development branches

## Frequently Asked Questions

**How does SCA handle transitive dependencies?**
Onam SCA builds the full dependency tree — not just direct dependencies but all transitive dependencies to any depth. CVEs are flagged at the level where they are introduced and attributed back to the direct dependency that brought them in.

**What is the difference between SecOps SAST and IaC scanning in the CSPM engine?**
CSPM scans deployed cloud resources using read-only cloud APIs. SecOps IaC scanning reads the source templates before they are deployed. Running both gives you pre-deploy prevention (IaC) and post-deploy verification (CSPM).

**Can I write custom SAST rules?**
Yes. Custom rules are authored in YAML using the Onam rule DSL (compatible with Semgrep rule format). Custom rules can be applied to any supported language and are version-controlled alongside your other repository content.
