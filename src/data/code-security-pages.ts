import { Bug, Boxes, Radar } from "lucide-react";
import type { ProductPageData } from "@/components/site/ProductPageTemplate";

/**
 * Sub-pages of /platform/code-security, one per scanner that has enough real depth to
 * earn its own page. IaC checks and secret detection are covered on the parent page, the
 * SAST page and in the docs: the IaC checker ships inside the scanner image and its rule
 * set cannot be reviewed from source, so it does not get a page of claims.
 *
 * Every statement here is checked against the product code (engines/secops in the
 * threat-engine repo). No counts appear: rule and language counts are not yet cleared in
 * the facts file, so languages and ecosystems are named, never totalled.
 */
export type CodeSecuritySubPage = {
  slug: "sast" | "sca-sbom" | "dast";
  title: string;
  data: ProductPageData;
  diagram: { src: string; alt: string; caption: string };
  illustration?: { src: string; alt: string; caption: string };
  docsHref: string;
};

const violet400 = "#A78BFA";
const blue400 = "#60A5FA";
const orange400 = "#FB923C";

const sharedStats = [
  { v: "SAST", l: "source code" },
  { v: "SCA + SBOM", l: "dependencies" },
  { v: "IaC", l: "templates" },
  { v: "DAST", l: "running apps" },
];

export const codeSecuritySubPages: Record<CodeSecuritySubPage["slug"], CodeSecuritySubPage> = {
  sast: {
    slug: "sast",
    title: "Static analysis (SAST) and secret detection — Onam Security",
    docsHref: "/docs/code-security/sast",
    diagram: {
      src: "/diagrams/code-sec-sast-tiers.svg",
      alt: "Three rule sources — community security packs, curated taint rules and reviewed pattern rules — produce two lists: security issues and hotspots to review",
      caption:
        "Three rule sources, two kinds of result. Only rules that can show a flaw produce a security issue.",
    },
    illustration: {
      src: "/diagrams/ui-code-sec-scan-detail.svg",
      alt: "Illustrative layout of a code scan result: summary tiles, a security findings table and a finding detail with a copyable AI fix prompt",
      caption:
        "Illustrative — a stylised view of a scan result, not a screenshot. Names and findings are invented.",
    },
    data: {
      hideDemo: true,
      stats: sharedStats,
      risk: {
        title: "When every match is an alert",
        body: "A scanner that gives a regex hit the same severity as a proven injection teaches the team to ignore both. The fix is not fewer rules — it is being honest about what each rule can prove.",
        tagline: "Severity follows evidence",
      },
      ctaWhere: "on your code",
      ctaLine:
        "Give us a repository and we will scan it with you, then go through the security issues and the hotspots together.",
      icon: Bug,
      iconColor: violet400,
      label: "Static Analysis (SAST)",
      question: "Which findings in this scan are real, and which only look suspicious?",
      headline: "Static analysis that tells you what it can prove — and what it cannot.",
      metaDescription:
        "SAST for Python, JavaScript, TypeScript, Java, C#, Go, C, C++ and Ruby: taint-confirmed issues kept apart from hotspots, with CWE and OWASP on each.",
      sub: "Onam's static analysis runs community security packs, curated taint rules and reviewed pattern rules over your source, then splits the result: security issues it can show, and hotspots a person needs to confirm. Secret detection runs in the same pass.",
      painPoint:
        "A pattern rule flags every call to eval, every string that looks like SQL, every file that mentions a password. Some of those are real. Most are not, and the scanner cannot tell which, so it calls all of them high. The developer opens the report, sees the noise, and closes it — along with the one finding that was a genuine injection path from a request parameter to a database query.",
      mechanism: [
        "The scanner makes a shallow clone of the branch you chose and skips what is not your code: dependency and vendor folders, build output, minified files and anything over half a megabyte.",
        "Files are routed by extension. Python, JavaScript, TypeScript, Java, C#, Go, C, C++ and Ruby go to static analysis on the open-source Semgrep engine; Terraform, YAML, JSON and Dockerfiles go to the IaC checker in the same job.",
        "Three rule sources run together. Community security packs cover the OWASP Top 10, a general security audit, secrets and Node.js. Onam-curated taint rules follow untrusted input to a dangerous sink in Python, JavaScript/TypeScript, Java, C#, Go and Ruby. Onam-reviewed pattern rules add breadth, each one triaged by hand — rules judged code-quality or accessibility are dropped, not shown.",
        "Severity follows evidence. Taint and AST findings keep the severity their rule asserts. A pattern match is capped at medium, or low if its rule has not been reviewed, and is listed as a hotspot rather than a security issue. Several pattern rules firing on the same line are collapsed into one.",
        "Secret detection runs in the same pass: the community secrets pack plus Onam's own patterns for cloud keys, private-key blocks, GitHub, Slack and Stripe tokens, Google credentials, hard-coded JWTs and generic secret assignments.",
        "Each finding is stored with its file, line, rule, message, CWE, OWASP category, confidence and a short code snippet, and appears in the scan view, the project view and the platform-wide alerts list.",
      ],
      whatYouGet: [
        "Two lists, not one — Security issues you can act on now, Hotspots to review when you have time",
        "Severity you can trust — pattern matches can never be rated high or critical",
        "Taint rules where they matter most — Python, JavaScript/TypeScript, Java, C#, Go and Ruby",
        "CWE and OWASP mapping — on every finding where the rule records them",
        "Secrets in the same scan — cloud keys, private keys, SaaS tokens and hard-coded credentials",
        "Less noise by design — vendored code, build output and minified files are not scanned",
        "Rule guidance per finding — what the issue is, why it matters and a safe example",
        "An AI fix prompt per finding — copy it into the assistant your team already uses",
        "Fix branches on request — AI Code Fix rewrites flagged files onto a separate branch",
      ],
      faqs: [
        {
          q: "Which languages are covered, and how deeply?",
          a: "Python, JavaScript, TypeScript, Java, C#, Go, C, C++ and Ruby. Python, JavaScript/TypeScript, Java, C#, Go and Ruby have Onam-curated taint rules in addition to community and pattern rules. C and C++ are covered by community and pattern rules only, so more of their results land in the hotspot list. Other languages, such as PHP, Kotlin, Rust, Swift and Scala, are not analysed today.",
        },
        {
          q: "Why are hotspots capped at medium?",
          a: "Because a pattern rule cannot prove that untrusted input reaches the code it matched. Rating it high would put a guess on the same level as a demonstrated flaw. Hotspots are still worth reviewing — they are just not allowed to crowd out the findings that are proven.",
        },
        {
          q: "Does secret detection look at git history?",
          a: "No. The scan reads the current state of the branch from a shallow clone, so a secret that was committed and later removed is not found. It also does not test whether a detected credential is live. If a secret has ever been pushed, rotate it — removing it from the file is not enough.",
        },
        {
          q: "Can we write our own rules?",
          a: "Not from the console today. The rule set is maintained by Onam; tell us about patterns specific to your codebase and we can discuss adding them.",
        },
        {
          q: "Will a new scan remember the findings we already triaged?",
          a: "Not reliably today. Each scan produces its own list of findings and the console shows the latest scan per project; triage decisions are not yet carried from one scan to the next.",
        },
      ],
      related: [
        { label: "Onam Code Security", href: "/platform/code-security" },
        { label: "Dependencies and SBOM (SCA)", href: "/platform/code-security/sca-sbom" },
        { label: "Dynamic testing (DAST)", href: "/platform/code-security/dast" },
        { label: "Onam AI Code Fix", href: "/platform/ai-code-fix" },
        { label: "SAST docs", href: "/docs/code-security/sast" },
      ],
    },
  },

  "sca-sbom": {
    slug: "sca-sbom",
    title: "Dependency analysis (SCA) and SBOM — Onam Security",
    docsHref: "/docs/code-security/sca-sbom",
    diagram: {
      src: "/diagrams/code-sec-sca-sbom.svg",
      alt: "Manifests and lockfiles become a component list, enriched with OSV, NVD, EPSS and CISA KEV into a 0–10 risk score, with SBOM, license, NTIA, VEX and diff outputs",
      caption: "From lockfile to risk score. The same component list becomes the SBOM.",
    },
    illustration: {
      src: "/diagrams/ui-code-sec-sbom.svg",
      alt: "Illustrative layout of an SBOM result: component and CVE tiles above a vulnerable packages table",
      caption:
        "Illustrative — a stylised view of an SBOM result, not a screenshot. Package names and figures are invented.",
    },
    data: {
      hideDemo: true,
      stats: sharedStats,
      risk: {
        title: "CVSS is not a to-do list",
        body: "Severity describes the vulnerability, not how likely anyone is to use it against you. A queue sorted by CVSS alone spends the week on theoretical criticals while an actively exploited medium waits.",
        tagline: "Ranked by exploitation, not only severity",
      },
      ctaWhere: "on your dependencies",
      ctaLine:
        "Send us a repository or an existing SBOM. We will show you the risk-ranked component list and the SBOM it produces.",
      icon: Boxes,
      iconColor: blue400,
      label: "Dependencies & SBOM (SCA)",
      question:
        "Which of our dependencies are actually being exploited, and can we prove what we ship?",
      headline: "Know what you ship, and which of it attackers are using right now.",
      metaDescription:
        "Dependency analysis with a CycloneDX 1.5 SBOM: OSV and NVD matching, EPSS and CISA KEV risk scoring, license policy, VEX and NTIA checks.",
      sub: "Onam reads your manifests and lockfiles, matches every component against OSV and NVD, ranks each vulnerability by exploitation signals as well as severity, and gives you a CycloneDX SBOM with license, VEX and NTIA checks on top.",
      painPoint:
        "A customer's procurement team asks for an SBOM. Engineering exports a list of packages from one service, by hand, in a format nobody agreed on. The same week a dependency report lands with dozens of CVEs sorted by CVSS, and the team patches the top of the list — a 9.8 nobody has ever exploited — while a medium-rated library on CISA's known-exploited list ships in every build.",
      mechanism: [
        "Onam parses manifests and lockfiles itself, without an external scanner: Python (requirements files, Pipfile.lock, pyproject.toml, setup.cfg), npm (package.json, package-lock.json, yarn.lock), Java (pom.xml, Gradle build files), Go (go.mod), Rust (Cargo.toml, Cargo.lock), Ruby (Gemfile.lock), .NET (project files, packages.config) and PHP (composer.lock). Where a lockfile exists, its pinned versions win over the manifest.",
        "Each component is matched to known advisories — the OSV database first, the NVD as a fallback — using the same advisory store as Onam's vulnerability engine.",
        "Every match is enriched with its EPSS score (the probability of exploitation in the next 30 days) and whether it is on CISA's Known Exploited Vulnerabilities list, both refreshed daily.",
        "A composite 0–10 risk score combines CVSS, EPSS, KEV membership and whether a fixed version exists, and maps it to a priority: Immediate, High, Medium or Low. An actively exploited medium can outrank an unexploited critical — which is the point.",
        "The component list is written out as a CycloneDX 1.5 SBOM with package URLs. You can also upload an existing CycloneDX (1.4 or 1.5) or SPDX 2.3 SBOM in JSON and get the same enrichment, compare two SBOMs, record VEX statements, and run license-policy and NTIA minimum-elements checks.",
      ],
      whatYouGet: [
        "Native parsing across ecosystems — Python, npm, Java, Go, Rust, Ruby, .NET and PHP",
        "Exploitation-aware ranking — EPSS and CISA KEV next to CVSS, in one 0–10 score",
        "Fixed-version awareness — a vulnerability with an upgrade available is ranked as actionable",
        "CycloneDX 1.5 SBOM — generated from the repository, JSON, with package URLs",
        "SBOM import — bring CycloneDX or SPDX JSON from another tool and enrich it",
        "SBOM diff — what was added, removed or changed between two SBOMs",
        "VEX statements — record not affected, affected, fixed or under investigation, with a reason",
        "License policy — permissive, weak-copyleft and strong-copyleft classification and built-in policies",
        "NTIA minimum elements — each SBOM scored against the US baseline for SBOM content",
      ],
      faqs: [
        {
          q: "Does it resolve transitive dependencies?",
          a: "It records what the lockfile pins, and a lockfile lists transitive packages as well as direct ones — so with package-lock.json, yarn.lock, Pipfile.lock, Cargo.lock, Gemfile.lock or composer.lock, transitive dependencies are covered. From a manifest alone (for example a requirements file without pins, or go.mod), only what the manifest declares is known.",
        },
        {
          q: "Does it tell us whether the vulnerable function is actually called?",
          a: "No. Onam ranks by exploitation signals — EPSS and CISA KEV — and fix availability, not by call-graph reachability. A package is reported if it is present at an affected version.",
        },
        {
          q: "Which lockfiles are not supported yet?",
          a: "poetry.lock, pnpm-lock.yaml, go.sum, Gradle lockfiles and a Pipfile without its lock. If your stack relies on one of these, generate an SBOM with your build tool and upload it instead.",
        },
        {
          q: "What does the license check need?",
          a: "License data. SBOMs you upload usually carry it; components found by parsing lockfiles often do not, so license policy is most useful on uploaded SBOMs.",
        },
        {
          q: "Can we export the SBOM in SPDX?",
          a: "Not today. Onam exports CycloneDX 1.5 JSON, and accepts both CycloneDX and SPDX JSON as input.",
        },
        {
          q: "Does it scan container images?",
          a: "Not in Code Security today — it works from source manifests and SBOM files. Image vulnerabilities in running workloads are covered by Onam's vulnerability and agentless workload scanning.",
        },
      ],
      related: [
        { label: "Onam Code Security", href: "/platform/code-security" },
        { label: "Static analysis (SAST) and secrets", href: "/platform/code-security/sast" },
        { label: "Onam Vulnerability Management", href: "/platform/vulnerability" },
        { label: "SCA and SBOM docs", href: "/docs/code-security/sca-sbom" },
      ],
    },
  },

  dast: {
    slug: "dast",
    title: "Dynamic application testing (DAST) — Onam Security",
    docsHref: "/docs/code-security/dast",
    diagram: {
      src: "/diagrams/code-sec-dast.svg",
      alt: "A target URL with optional authentication is crawled and parsed for endpoints, which receive active payloads and passive checks; findings export as JSON, HTML or SARIF",
      caption:
        "Discover, test, report. Only run it against applications you own or are authorised to test.",
    },
    data: {
      hideDemo: true,
      stats: sharedStats,
      risk: {
        title: "What the code review cannot see",
        body: "Static analysis reads the code you wrote. It does not see the reverse proxy that drops a security header, the framework default that leaks a stack trace, or the endpoint nobody documented.",
        tagline: "Test the app as it actually runs",
      },
      ctaWhere: "on your app",
      ctaLine:
        "Give us a staging URL you are authorised to test. We will run a scan with you and go through what it found.",
      icon: Radar,
      iconColor: orange400,
      label: "Dynamic Testing (DAST)",
      question: "What does our application look like to someone attacking it from outside?",
      headline: "Test the running application, not just the code that built it.",
      metaDescription:
        "DAST for web apps and APIs: OpenAPI-aware discovery, injection, XSS, SSRF and XXE payloads, header and cookie checks, with JSON, HTML or SARIF reports.",
      sub: "Onam's dynamic testing discovers the endpoints of a running web app or API, sends rate-limited test payloads at them, checks headers, cookies and CSRF protection, and reports what it could actually trigger.",
      painPoint:
        "The code passed static analysis. Then the app went behind a load balancer that strips the HSTS header, a debug setting left stack traces switched on in staging, and an older endpoint still takes a URL parameter and fetches it server-side. None of that is visible in the repository. It is only visible to something that talks to the running app the way an attacker would.",
      mechanism: [
        "You give a target URL you are authorised to test, a scan profile (quick, normal or deep) and, if the app needs it, authentication: basic, bearer token, cookie, OAuth2 or a custom header. Targets on private networks are refused unless that is explicitly enabled.",
        "Discovery builds an endpoint inventory from link and form crawling, JavaScript analysis, an OpenAPI description if the app publishes one, and common path patterns. All requests are rate-limited.",
        "Active tests send payloads for SQL injection (error-based and time-based blind), NoSQL injection, cross-site scripting, command injection, server-side template injection, path traversal, XXE, SSRF, open redirect, file upload and business-logic tampering.",
        "Passive checks look at every response for missing or weak security headers, cookie flags, CSRF protection and error messages that disclose internals.",
        "Findings are stored with the endpoint, severity, CVSS and description, shown on the DAST tab and scan page, and can be exported as JSON, HTML or SARIF. A DAST scan starts from the console when you add a target URL to a new scan, or through the API.",
      ],
      whatYouGet: [
        "Endpoint discovery — crawling, JavaScript analysis, OpenAPI parsing and path patterns",
        "Injection coverage — SQL, NoSQL, command and template injection, and XSS",
        "Server-side request checks — SSRF, XXE and path traversal",
        "Logic and upload checks — open redirect, file upload handling and parameter tampering",
        "Passive hygiene checks — security headers, cookie flags, CSRF and error disclosure",
        "Authenticated scanning — basic, bearer, cookie, OAuth2 or custom header",
        "Scan profiles — quick, normal or deep, chosen per scan",
        "Portable reports — JSON, HTML and SARIF",
        "Guard rails — rate-limited requests and private-network targets refused by default",
      ],
      faqs: [
        {
          q: "Is it safe to point at production?",
          a: "Treat it as you would any active test: the payloads are real injection attempts and can create data or trigger errors. Run it against a staging environment that mirrors production, and only against applications you own or are authorised to test.",
        },
        {
          q: "Does it render JavaScript-heavy single-page apps?",
          a: "Discovery analyses JavaScript files for endpoints, but full browser rendering is not part of the deployed scanner today. For single-page apps, publishing an OpenAPI description gives discovery the most complete picture.",
        },
        {
          q: "How are DAST results connected to the code findings?",
          a: "They appear side by side in the Code Security console and count towards the same AppSec score, but a DAST finding is about an endpoint, not a file. It is not traced back to the line of code that caused it, and AI Code Fix does not apply to it.",
        },
        {
          q: "Where do credentials for the target go?",
          a: "They are passed to the scan job that tests your app. Use a dedicated test account with the least access the scan needs, not a real user's credentials.",
        },
      ],
      related: [
        { label: "Onam Code Security", href: "/platform/code-security" },
        { label: "Static analysis (SAST) and secrets", href: "/platform/code-security/sast" },
        { label: "Onam API Security", href: "/platform/api-security" },
        { label: "DAST docs", href: "/docs/code-security/dast" },
      ],
    },
  },
};
