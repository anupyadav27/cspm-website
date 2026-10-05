import type { DocArticle } from "./types";

/**
 * The Code Security docs section (/docs/code-security/*), plus the two older feature
 * slugs that cover the same ground (features/secops, features/iac-scanning), rewritten
 * as short accurate summaries that point here.
 *
 * Source of truth: engines/secops and engines/fix/secops_fix in the threat-engine repo,
 * and the console screens under frontend/src/app/secops. Where the product is partial
 * these pages say so. No rule or language COUNTS appear — those are not yet cleared in
 * the facts file; languages and ecosystems are named instead.
 */
export const articles: DocArticle[] = [
  {
    slug: "code-security/overview",
    title: "Code Security — overview",
    breadcrumb: "Code Security / Overview",
    body: `
Onam Code Security scans the things that build your applications: source code, dependencies, infrastructure-as-code templates and — if you give it a URL — the running application itself. It lives in the same console as Onam's cloud posture, identity and data engines, under the same login and roles.

![How a code scan flows, from repository to reviewed fix](/diagrams/code-sec-pipeline.svg)

## What a scan does

| Scanner | What it reads | What it produces |
| --- | --- | --- |
| [Static analysis (SAST)](/docs/code-security/sast) | Source files in Python, JavaScript, TypeScript, Java, C#, Go, C, C++ and Ruby | Security issues (proven by taint or AST rules) and hotspots to review (pattern matches) |
| [Secret detection](/docs/code-security/secrets) | Every file in the clone | Hard-coded credentials, keys and tokens |
| [IaC checks](/docs/code-security/iac) | Terraform, YAML (Kubernetes, CloudFormation), JSON and Dockerfiles | Misconfigurations in templates and images |
| [Dependencies and SBOM (SCA)](/docs/code-security/sca-sbom) | Manifests and lockfiles, or an uploaded SBOM | Vulnerable packages with a 0–10 risk score, and a CycloneDX 1.5 SBOM |
| [Dynamic testing (DAST)](/docs/code-security/dast) | A running web app or API, from its URL | Findings per endpoint, exportable as JSON, HTML or SARIF |

Static analysis, secret detection, IaC checks and dependency analysis run on every repository scan. Dynamic testing runs only when the scan includes a target URL.

## How it fits with the rest of Onam

- **Same platform, same roles.** Code findings are read and scans started with the same role-based access as every other engine.
- **Posture score.** SAST and DAST results feed the AppSec pillar of the [CNAPP posture score](/docs/features/cnapp).
- **Shared advisories.** Dependency findings are matched against the same OSV and NVD advisory store the [Vulnerability engine](/docs/features/vulnerability-management) uses.
- **Findings store.** Static-analysis findings are also written to the platform-wide findings store, tagged as code, with the file path as the resource.

What it does **not** do yet: link a code finding to the container image or cloud workload built from that repository, tell you whether a vulnerable dependency function is actually called, or trace a runtime misconfiguration back to its template line. Plan around those gaps rather than assume them away.

## Fixing what it finds

Every finding carries the rule's guidance and an AI fix prompt you can copy into your own assistant. For static-analysis findings, [AI Code Fix](/docs/code-security/ai-code-fix) can rewrite the affected files and push them to a separate branch for your review.

## Where to go next

1. [Connect a repository](/docs/code-security/connect-repository)
2. [Run a scan](/docs/code-security/run-a-scan)
3. [Read the results](/docs/code-security/reading-results)
4. [Use it from CI](/docs/code-security/ci)
`,
  },
  {
    slug: "code-security/connect-repository",
    title: "Connect a repository",
    breadcrumb: "Code Security / Connect a repository",
    body: `
There are two ways to point Onam at code: connect the repository as an account during onboarding, or give its address directly when you start a scan.

## Option 1 — connect it as an account

In **Onboarding**, choose the code repository type and the provider (GitHub or GitLab in the form today; Bitbucket addresses are also accepted by the scanner). The form asks for:

| Field | Required | Notes |
| --- | --- | --- |
| Repository URL | Yes | The HTTPS clone address, for example \`https://github.com/org/repo\` |
| Branch | No | Leave blank to use the repository's default branch, detected on connect |
| Access token | No | GitHub personal access token or GitLab access token |

A connected repository can be scanned by account, so its URL, branch and scan settings come from the connection rather than being typed each time.

## Option 2 — give the address when you scan

The **New Security Scan** dialog in Code Security takes a repository URL and branch directly. See [Run a scan](/docs/code-security/run-a-scan).

## Address rules

- **HTTPS only.** SSH addresses are not accepted.
- **Allowed hosts.** github.com, gitlab.com and bitbucket.org by default.
- **No internal addresses.** Private-network and cluster-internal hosts are refused.

## Private repositories

> Public repositories scan without a token. The connection form accepts a token for private repositories, but scanning a private repository is not reliable today: check that the first scan reaches **completed** rather than **failed**, and contact support if it fails to clone. We will update this page when private-repository scanning is fully supported.

## What happens to your code

Each scan makes a shallow clone of one branch inside an isolated scan job and deletes it when the scan ends. Onam keeps the findings — file path, line, rule, message and a short code snippet — and the dependency list and SBOM. Vendored dependencies, build output, minified files and files over 512 KB are removed before scanning.
`,
  },
  {
    slug: "code-security/run-a-scan",
    title: "Run a scan",
    breadcrumb: "Code Security / Run a scan",
    body: `
## From the console

1. Open **Code Security** and choose **New Scan Pipeline** (or **New Security Scan** on the Projects page).
2. Enter the **Repository URL** and, optionally, a **Branch** (default \`main\`).
3. Optionally enter a **DAST Target URL** — a running app or API you are authorised to test.
4. Choose **Start Pipeline**.

Static analysis and dependency analysis start together. Dynamic testing starts as well if you gave a target URL. Each runs as its own job, so one can finish before the others.

## How the branch is chosen

If you name a branch other than \`main\`, that branch is scanned. Otherwise Onam uses the default branch recorded on the connected account, then asks the repository for its default branch, and falls back to \`main\`.

## What a scan costs in time

Scan time depends mostly on repository size. Each scan job has a one-hour limit; a scan that runs past it is marked failed. Watch progress on the **Scan History** tab.

## From the API

The console calls the same API you can call yourself. See [Use it from CI](/docs/code-security/ci) for a worked example, and the [API reference](/docs/reference/api) for authentication.

| Call | Purpose |
| --- | --- |
| \`POST /api/v1/secops/sast/scan\` | Start a repository scan (static analysis; dependency analysis starts alongside) |
| \`GET /api/v1/secops/sast/scan/{scan_id}/status\` | Poll status |
| \`GET /api/v1/secops/sast/scan/{scan_id}/findings\` | Read findings, optionally filtered by \`severity\` or \`language\` |
| \`POST /api/v1/secops/dast/scan\` | Start a dynamic test of a target URL |

## Who can start a scan

Viewing results needs read access to code security (\`secops:read\`). Starting scans needs a role that can create scans; read-only roles cannot.
`,
  },
  {
    slug: "code-security/reading-results",
    title: "Read the results",
    breadcrumb: "Code Security / Reading results",
    body: `
## The Code Security home

The home page has six tabs: **Overview**, **Alerts**, **Scan History**, **SAST**, **DAST** and **SCA**.

- **Overview** — security issues, total findings, repositories scanned and the last scan, with a risk table per project.
- **Alerts** — every finding across scanners. Filter by type (security issues, hotspots to review, informational), severity, scanner and status.
- **Scan History** — every scan, its target, status, finding count and date.
- **SAST / DAST / SCA** — one row per scan for that scanner, with its own summary numbers.

## A static-analysis scan

![Illustrative layout of a scan result — a stylised view, not a screenshot](/diagrams/ui-code-sec-scan-detail.svg)

*Illustrative — a stylised view of the layout, not a screenshot. Names and findings are invented.*

A scan opens on four numbers: **Total Findings**, **Security Issues**, **Hotspots to Review** and **Languages**. Below them are a severity chart, the most-triggered rules, and two panels:

- **Security Findings** — results from taint and AST rules. These are the findings to work first. Severity is whatever the rule asserts.
- **Hotspots to Review** — results from pattern rules. They are capped at medium (low if the rule has not been reviewed) and need a person to confirm them. They are not counted as alerts.

Each row shows severity, rule, file and line, message, language and status. Selecting a finding opens its detail: the rule's explanation and recommendation, a code example where the rule has one, and an **AI fix prompt** you can copy into an assistant.

## Projects

**Projects** lists every scanned repository with a risk score, critical and high counts, languages and last scan. A project opens to its security issues, dependencies (package, CVEs, risk and recommendation) and scan history.

## Dependencies and SBOM

![Illustrative layout of an SBOM result — a stylised view, not a screenshot](/diagrams/ui-code-sec-sbom.svg)

*Illustrative — a stylised view of the layout, not a screenshot. Package names and figures are invented.*

An SBOM view shows total components, vulnerable packages, total CVEs and license types, a **Vulnerable Packages** table (package, package URL, CVE count, risk level, CVE IDs, license) and a **License Analysis** tab.

## Reports

**Reports & Trends** charts findings over time across all scanners, with per-scanner trend tabs. Export as CSV or PDF.

## Severity, in one table

| Source | Shown as | Severity |
| --- | --- | --- |
| Curated taint rule, community rule | Security issue | As the rule asserts — can be critical |
| Reviewed pattern rule | Hotspot to review | Medium at most |
| Unreviewed pattern rule | Hotspot to review | Low at most |
| Dependency advisory | Vulnerable package | Risk level from the 0–10 composite score |
| DAST check | DAST finding | Per check, with CVSS |

## Things to know

- Each scan produces a fresh list of findings. Triage decisions are not yet carried from one scan to the next.
- Within a scan, the same rule on the same file and line is reported once, and several pattern rules firing on one line are collapsed.
`,
  },
  {
    slug: "code-security/sast",
    title: "Static analysis (SAST)",
    breadcrumb: "Code Security / SAST",
    body: `
Onam's static analysis runs on the open-source Semgrep engine with three rule sources, and grades every result by how much its rule can prove.

![Three rule sources, two kinds of result](/diagrams/code-sec-sast-tiers.svg)

## Languages

| Language | File extensions | Curated taint rules | Pattern rules |
| --- | --- | --- | --- |
| Python | \`.py\` | Yes | — |
| JavaScript | \`.js\` \`.mjs\` \`.jsx\` | Yes | Yes |
| TypeScript | \`.ts\` \`.tsx\` | Yes (shared with JavaScript) | Yes |
| Java | \`.java\` | Yes | Yes |
| C# | \`.cs\` | Yes | Yes |
| Go | \`.go\` | Yes | Yes |
| Ruby | \`.rb\` | Yes | — |
| C | \`.c\` \`.h\` | — | Yes |
| C++ | \`.cpp\` \`.cxx\` \`.cc\` \`.hpp\` \`.hxx\` | — | Yes |

Community security packs apply across all of them. PHP, Kotlin, Rust, Swift and Scala are not analysed today.

## The three rule sources

1. **Community security packs** — OWASP Top 10, a general security audit, secrets and Node.js, pulled from the Semgrep registry. General-purpose packs that mix security with code style are deliberately not used.
2. **Onam curated taint rules** — hand-written rules that follow untrusted input (a request parameter, a header, a file) to a dangerous sink (a query, a shell, a file path, an outbound request). Each carries its own CWE, OWASP category and severity, and has tests in the rule repository.
3. **Onam reviewed pattern rules** — broader pattern rules, each triaged by hand into security, code-quality, accessibility or not-applicable. Only the security ones run; the rest are dropped before a scan.

## Severity follows evidence

| Result from | Listed as | Severity cap |
| --- | --- | --- |
| Community or curated rule | Security issue | None — the rule's own severity |
| Pattern rule triaged as security | Hotspot to review | Medium |
| Pattern rule not yet triaged | Hotspot to review | Low |

This is the core design choice: a pattern match cannot show that untrusted input reaches the code it matched, so it is never allowed to outrank a finding that can.

## What is skipped

Before scanning, the clone is pruned of \`node_modules\`, \`vendor\`, build output, static and documentation folders, minified \`*.min.js\` files and any file over 512 KB. That keeps third-party code — covered by [dependency analysis](/docs/code-security/sca-sbom) — out of the static results.

## What each finding carries

| Field | Example |
| --- | --- |
| File and line | \`app/db/orders.py\`, line 88 |
| Rule | \`sql-injection-fstring\` |
| Severity | critical, high, medium or low |
| Message | What the rule found |
| CWE / OWASP | CWE-89 · A03 Injection |
| Confidence and tier | Security issue or hotspot |
| Code snippet | A few lines of context |

## Limits worth knowing

- Analysis is per scan of one branch. There is no incremental or changed-files-only mode.
- Custom rules cannot be added from the console.
- If the community packs cannot be loaded for a scan, the scan still runs with Onam's own rules and is flagged as having reduced coverage.
`,
  },
  {
    slug: "code-security/secrets",
    title: "Secret detection",
    breadcrumb: "Code Security / Secrets",
    body: `
Secret detection runs in the same pass as [static analysis](/docs/code-security/sast), over every file in the clone, so there is nothing separate to switch on.

## What it looks for

Two sources run together:

- **The community secrets pack** from the Semgrep registry.
- **Onam's own secret patterns**, which work on any file type:

| Pattern | Typical form |
| --- | --- |
| AWS access key ID | \`AKIA…\` |
| AWS secret access key | 40-character key next to an AWS key name |
| Private key block | \`-----BEGIN … PRIVATE KEY-----\` |
| GitHub token | \`ghp_…\`, \`gho_…\` and related prefixes |
| Slack token | \`xox…\` |
| Stripe key | \`sk_live_…\` |
| Google API key | \`AIza…\` |
| Google service-account key | JSON with a private key field |
| Hard-coded JWT | Three base64url segments in source |
| Generic secret assignment | \`password = "…"\`, \`secret = "…"\` and similar |

Findings are tagged CWE-798 (use of hard-coded credentials) and appear with the other static-analysis results.

## What it does not do

- **No git history.** The scan reads the current state of the branch from a shallow clone. A secret committed and later deleted is not found.
- **No live verification.** Onam does not test whether a detected credential still works.
- **No pre-commit hook.** Detection happens when a scan runs, not on a developer's machine.

> If a secret has ever been pushed, rotate it. Deleting it from the file, or even rewriting history, does not undo the exposure.
`,
  },
  {
    slug: "code-security/iac",
    title: "IaC and Dockerfile checks",
    breadcrumb: "Code Security / IaC",
    body: `
Infrastructure-as-code files in a scanned repository are checked in the same scan job as the source code.

## What is routed to the IaC checker

| File | Typical content |
| --- | --- |
| \`*.tf\` | Terraform |
| \`*.yaml\`, \`*.yml\` | Kubernetes manifests, CloudFormation templates |
| \`*.json\` | CloudFormation templates and other JSON configuration |
| \`Dockerfile\`, \`Dockerfile.*\`, \`*.dockerfile\` | Container build files |

Each file has a short per-file time limit, so one pathological file cannot stall the scan.

## What it checks

For Kubernetes manifests, checks look for the misconfigurations that recur in workload definitions: privileged containers and privilege escalation, host namespaces, added Linux capabilities, sensitive host paths and Docker socket mounts, hard-coded credentials, wildcard RBAC rules, cleartext protocols and mutable image tags. Dockerfiles are checked for build hygiene. Findings appear with the other scan results, with file and line.

## Limits worth knowing

- **Helm charts are not rendered.** Templates are read as files; values are not substituted.
- **Not supported:** Bicep, Pulumi programs and Kustomize builds.
- **Separate from the posture rules.** IaC checks use their own rule set. They are not the same rules the cloud posture (CSPM) engine evaluates against running resources, so a template result and a runtime result are not guaranteed to agree.
- The IaC checker ships inside the scanner image. Ask us for its current rule list against your templates before relying on a specific check.

To check running Kubernetes clusters rather than their manifests, see [Container Security](/docs/features/container-security).
`,
  },
  {
    slug: "code-security/sca-sbom",
    title: "Dependencies and SBOM (SCA)",
    breadcrumb: "Code Security / SCA and SBOM",
    body: `
Dependency analysis runs on every repository scan. It reads manifests and lockfiles itself — no external scanner — matches each component to known advisories, and writes a CycloneDX SBOM.

![From lockfile to risk score](/diagrams/code-sec-sca-sbom.svg)

## Supported manifests and lockfiles

| Ecosystem | Files read |
| --- | --- |
| Python | \`requirements*.txt\`, \`Pipfile.lock\`, \`pyproject.toml\`, \`setup.cfg\` |
| npm | \`package.json\`, \`package-lock.json\`, \`yarn.lock\` |
| Java | \`pom.xml\`, \`build.gradle\`, \`build.gradle.kts\` |
| Go | \`go.mod\` |
| Rust | \`Cargo.toml\`, \`Cargo.lock\` |
| Ruby | \`Gemfile.lock\` |
| .NET | \`*.csproj\`, \`packages.config\` |
| PHP | \`composer.lock\` |

Where a lockfile and its manifest are both present, the lockfile's pinned versions are used. A lockfile also lists transitive packages, so those are covered; from a manifest alone, only declared dependencies are known.

Not read today: \`poetry.lock\`, \`pnpm-lock.yaml\`, \`go.sum\`, Gradle lockfiles, and a \`Pipfile\` without its lock. For those stacks, generate an SBOM with your build tool and upload it.

## Matching and enrichment

1. **Advisories** — each component is matched against the OSV database, with the NVD as a fallback, from the same store the [Vulnerability engine](/docs/features/vulnerability-management) maintains.
2. **Exploit signals** — each match gets its EPSS score and CISA KEV membership, cached and refreshed daily.
3. **Risk score** — a composite 0–10 score from CVSS, EPSS, KEV and fix availability.

| Score | Priority |
| --- | --- |
| 8.0–10.0 | Immediate |
| 6.0–7.9 | High |
| 3.0–5.9 | Medium |
| 0.0–2.9 | Low |

EPSS and KEV move the score in both directions: a vulnerability with very low exploitation probability is scored down, and one on the KEV list is scored up. Onam does not perform call-graph reachability analysis.

## SBOM

- **Output:** CycloneDX 1.5, JSON, with package URLs.
- **Input:** upload CycloneDX 1.4 or 1.5, or SPDX 2.3, in JSON. Uploaded SBOMs get the same enrichment.
- **Diff:** compare any two SBOMs to see what was added, removed or changed.

SPDX export and XML formats are not available today.

## VEX

Record a VEX statement against a component and vulnerability — **not affected**, **affected**, **fixed** or **under investigation** — with a justification. Advisories marked not affected are left out of that component's results.

## License and policy checks

Licenses are classified as permissive, weak copyleft or strong copyleft. Built-in policies cover: no unmitigated critical vulnerabilities, no high vulnerabilities with a known fix left unpatched, no strong copyleft, every component licensed, no unrecognised licenses, and a maximum critical count.

> License checks need license data. Uploaded SBOMs usually carry it; components found by parsing lockfiles usually do not, so run license policy on uploaded SBOMs.

## NTIA minimum elements

Each SBOM can be checked against the NTIA minimum elements for an SBOM and scored 0–100, which is useful before sending one to a customer or regulator.

## Not covered here

Container images are not scanned by Code Security today. Vulnerabilities in images and running workloads are covered by the [Vulnerability](/docs/features/vulnerability-management) and [Container Security](/docs/features/container-security) engines.
`,
  },
  {
    slug: "code-security/dast",
    title: "Dynamic testing (DAST)",
    breadcrumb: "Code Security / DAST",
    body: `
Dynamic testing exercises a running web application or API from the outside, the way an attacker would.

![Discover, test, report](/diagrams/code-sec-dast.svg)

> Only test applications you own or are explicitly authorised to test. The payloads are real injection attempts. Use a staging environment that mirrors production.

## Starting a test

- **Console:** add a **DAST Target URL** in the New Security Scan dialog. The test runs alongside the repository scan.
- **API:** \`POST /api/v1/secops/dast/scan\` with the target URL, a profile and optional authentication.

| Setting | Options |
| --- | --- |
| Profile | \`quick\` (default), \`normal\`, \`deep\` |
| Authentication | none, basic, bearer token, cookie, OAuth2, custom header |

Targets on private networks are refused by default.

## Discovery

The scanner builds an endpoint inventory from link and form crawling, analysis of the app's JavaScript, an OpenAPI description if the app publishes one, and common path patterns. Requests are rate-limited. Full browser rendering of single-page apps is not part of the deployed scanner, so publishing an OpenAPI description gives the most complete coverage.

## Checks

| Kind | Checks |
| --- | --- |
| Injection | SQL (error-based and time-based blind), NoSQL, command, server-side template injection, cross-site scripting |
| Server-side | Path traversal, XXE, SSRF |
| Application logic | Open redirect, file upload handling, parameter and method tampering, forced browsing |
| Passive | Security headers, cookie flags, CSRF protection, error and stack-trace disclosure |

## Results

Each finding records the endpoint, vulnerability type, severity, CVSS and a description. Results show on the **DAST** tab and the DAST scan page (total findings, critical and high, endpoints, attacks sent). Reports are available as JSON, HTML or SARIF from \`GET /api/v1/secops/dast/scan/{scan_id}/report?format=json|html|sarif\`.

## Credentials for the target

Authentication details are passed to the scan job that tests your app. Use a dedicated test account with the least access the test needs.

DAST findings are about endpoints, not source files, so they are not traced to a line of code and [AI Code Fix](/docs/code-security/ai-code-fix) does not apply to them.
`,
  },
  {
    slug: "code-security/ai-code-fix",
    title: "AI Code Fix",
    breadcrumb: "Code Security / AI Code Fix",
    body: `
AI Code Fix turns static-analysis findings into corrected source files on a separate branch, for your team to review and merge.

![A scan goes in, a branch comes out, people decide the rest](/diagrams/code-sec-ai-fix.svg)

## How you use it today

AI Code Fix is run with you on request — it is not yet a button in the console. You choose a completed scan and the severities to include, and supply a Git token for that run. In the console, every code finding already has an **AI fix prompt** you can copy into the assistant your team uses.

## What it does, step by step

1. **Select.** Findings from the chosen static-analysis scan are filtered by severity. Findings marked as false positive or not applicable are skipped. The rest are grouped by file.
2. **Clone.** The repository is shallow-cloned using the Git token sent with this request. The token travels in a request header, is never written to the database or logs, and the clone is deleted when the run ends.
3. **Rewrite.** For each file, a large language model receives the whole file, every finding in it, and the rule's guidance — what the issue is, how to fix it, and a safe example where the rule has one. It is told to fix only the listed issues and keep everything else — names, imports, indentation and style — unchanged, and to return the complete file. One call per file means several findings in one file are fixed together.
4. **Write.** A corrected file is written back only if it differs from the original and the path already exists inside the repository.
5. **Push.** Changed files are committed to a new branch named \`secops-fix/<first 8 characters of the scan ID>\` and pushed. The commit message asks for review before merging.

## What it never does

- Open, approve or merge a pull request.
- Write to your default branch.
- Deploy anything.
- Write tests, IaC patches or dependency upgrades.
- Fix DAST or dependency findings — they have no source line to rewrite.

## What it does not check

Onam does not compile, lint or test the rewritten file. Your normal pipeline should run on the fix branch before anyone merges it.

## Status per finding

Each finding in the run ends as one of: **applied** (committed to the branch), **fix generated** (a fix was produced but not committed), **failed**, or **skipped**, with the reason.

## Data handling

- The **full content of each affected file** is sent to the language model. Only files with findings are sent.
- The Git token needs read access and permission to push a branch. It is not stored.
- Each run is audit-logged: who asked, for which scan and which repository.
- Runs are limited in concurrency and time; a busy or over-long run is rejected rather than queued indefinitely.

See also the [AI Code Fix product page](/platform/ai-code-fix).
`,
  },
  {
    slug: "code-security/ci",
    title: "Use it from CI",
    breadcrumb: "Code Security / CI usage",
    body: `
Onam does not ship a CI plugin, GitHub Action, command-line tool or pull-request check today, and it does not post comments on pull requests. A scan **reports**; it does not fail anything on its own.

If you want a pipeline step that scans and decides, call the same API the console uses.

## The pattern

1. **Start** a scan of the branch you built.
2. **Poll** its status until it is no longer \`queued\` or \`running\`.
3. **Read** the findings, filtered to the severities you care about.
4. **Decide** in your own script whether to fail the job.

## Example

Authenticate as described in the [API reference](/docs/reference/api), using an account whose role can start scans. Then:

\`\`\`
# 1. Start a scan — the response includes secops_scan_id and status "queued"
POST /api/v1/secops/sast/scan
Content-Type: application/json

{"tenant_id": "<your tenant id>", "repo_url": "https://github.com/org/repo", "branch": "release-2.4"}

# 2. Poll until status is completed or failed
GET /api/v1/secops/sast/scan/{secops_scan_id}/status

# 3. Read high-severity findings — the response has "total" and "findings"
GET /api/v1/secops/sast/scan/{secops_scan_id}/findings?severity=high
\`\`\`

Your script then fails the job if \`total\` is above the threshold you choose — for example, any high or critical security issue. Because hotspots are capped at medium, a gate on high and critical only acts on proven findings.

## About the fail switch

The scan service has a \`fail_on_findings\` option, and it is **off by default**. It applies only to the service's older folder-scan endpoint, not to repository scans started as above — so for repository scans, the pass/fail decision belongs in your pipeline script.

## Things to plan for

- **Whole-branch scans.** Each scan analyses the full branch; there is no changed-files-only or new-findings-only mode. A gate on "any high finding" will fail on findings that already existed. Start in report-only mode, work the backlog down, then turn the gate on.
- **Scan time.** Repository size drives it, and the scan job has a one-hour limit. Give the polling step a generous timeout.
- **Public repositories.** See the note on private repositories in [Connect a repository](/docs/code-security/connect-repository).
`,
  },

  // ── Older feature slugs, kept because other pages link to them ───────────────
  {
    slug: "features/secops",
    title: "SecOps — code and application security",
    breadcrumb: "Features / SecOps",
    body: `
SecOps is the engine behind Onam Code Security. It runs static analysis, secret detection, IaC checks, dependency and SBOM analysis, and dynamic testing, and reports them in the Code Security area of the console.

The full documentation now lives in the **Code Security** section:

| Topic | Page |
| --- | --- |
| What it does and how it fits with the rest of Onam | [Overview](/docs/code-security/overview) |
| Static analysis — Python, JavaScript, TypeScript, Java, C#, Go, C, C++ and Ruby | [SAST](/docs/code-security/sast) |
| Hard-coded credentials and keys | [Secret detection](/docs/code-security/secrets) |
| Terraform, Kubernetes YAML, CloudFormation and Dockerfiles | [IaC checks](/docs/code-security/iac) |
| Dependencies, risk scoring, CycloneDX SBOM, VEX and NTIA | [SCA and SBOM](/docs/code-security/sca-sbom) |
| Testing a running app or API | [DAST](/docs/code-security/dast) |
| Corrected files on a fix branch | [AI Code Fix](/docs/code-security/ai-code-fix) |
| Calling scans from a pipeline | [CI usage](/docs/code-security/ci) |

## In one paragraph

Static analysis runs community security packs, Onam-curated taint rules and Onam-reviewed pattern rules, and keeps proven **security issues** apart from **hotspots to review**, which are capped at medium. Dependency analysis parses manifests and lockfiles natively, matches OSV and NVD advisories, and scores each one 0–10 from CVSS, EPSS, CISA KEV and fix availability. Dynamic testing discovers and attacks the endpoints of a running app you are authorised to test. AI Code Fix rewrites files flagged by static analysis onto a separate branch; nothing merges itself. There is no CI plugin today — pipelines call the API.

![How a code scan flows, from repository to reviewed fix](/diagrams/code-sec-pipeline.svg)
`,
  },
  {
    slug: "features/iac-scanning",
    title: "IaC Scanning",
    breadcrumb: "Features / IaC Scanning",
    body: `
Infrastructure-as-code templates are checked by Onam Code Security as part of every repository scan. Terraform (\`.tf\`), YAML (Kubernetes manifests, CloudFormation), JSON and Dockerfiles found in the repository go to the IaC checker in the same scan job as static analysis and dependency analysis.

Full detail, including what is not supported, is on [IaC and Dockerfile checks](/docs/code-security/iac).

## In brief

- **Formats:** Terraform, Kubernetes YAML, CloudFormation (YAML or JSON) and Dockerfiles.
- **Not supported:** rendered Helm charts (templates are read as files), Bicep, Pulumi programs and Kustomize builds.
- **Separate rules from posture.** IaC checks use their own rule set, distinct from the rules the [CSPM engine](/docs/features/cspm) evaluates against running resources.
- **No CI plugin.** Scans run from the console or the API; see [CI usage](/docs/code-security/ci).

For running Kubernetes clusters rather than manifests, see [Container Security](/docs/features/container-security).

![How a code scan flows, from repository to reviewed fix](/diagrams/code-sec-pipeline.svg)
`,
  },
];
