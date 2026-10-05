import {
  ShieldCheck, Users, KeyRound, GitBranch, Activity, Crosshair, Network, Database,
  Cpu, Box, Bug, Terminal, TrendingUp, CheckSquare, Layers,
  Radar, Blocks, Server, Webhook, HardDrive, Lock, Bot, Wrench, Boxes, ShieldHalf, Wand2,
} from "lucide-react";
import type { ProductPageData } from "@/components/site/ProductPageTemplate";

const brand400 = "#818CF8";
const cyan = "#22D3EE";
const yellow = "#FACC15";
const red400 = "#F87171";
const orange400 = "#FB923C";
const csmRed = "#EF4444";
const csmPurple = "#A855F7";
const csmAmber = "#F59E0B";
const csmGreen = "#10B981";
const violet400 = "#A78BFA";
const blue400 = "#60A5FA";
const slate300 = "#CBD5E1";
const slate400 = "#94A3B8";
const pink400 = "#F472B6";
const emerald400 = "#34D399";

export const platformPages: Record<string, ProductPageData> = {
  "code-security": {
    hideDemo: true,
    stats: [
      { v: "SAST", l: "source code" },
      { v: "SCA + SBOM", l: "dependencies" },
      { v: "IaC", l: "templates" },
      { v: "DAST", l: "running apps" },
    ],
    risk: {
      title: "The cost of a noisy scanner",
      body: "When every pattern match is reported as an alert, the real injection flaw sits on page four. Teams stop reading the report, and the scanner becomes a compliance checkbox instead of a control.",
      tagline: "Confirmed issues first, hotspots kept separate",
    },
    ctaWhere: "on your code",
    ctaLine:
      "Point us at a repository and a test URL. We will run the scan with you and walk your team through what it found.",
    icon: GitBranch,
    iconColor: violet400,
    label: "Code Security",
    question: "Which of the problems in this repository actually need fixing first?",
    headline:
      "Scan the code, the dependencies and the running app — and see the real issues first.",
    metaDescription:
      "Code security in one console: SAST, dependency analysis with CycloneDX SBOM, IaC checks, secret detection and DAST, with confirmed issues kept apart.",
    sub: "Onam Code Security runs static analysis, dependency and SBOM analysis, IaC checks, secret detection and dynamic testing against your repositories and web apps — and keeps findings it can confirm apart from the ones a person needs to review.",
    painPoint:
      "The first scan of a mature repository returns a wall of findings, and most of them are pattern matches nobody can act on without reading the code. The one real injection flaw is in there somewhere, ranked next to a hundred hotspots with the same severity. The dependency report is no better: sorted by CVSS, it puts a theoretical 9.8 above a medium-rated bug that attackers are exploiting this week. The team triages for a day, fixes nothing important, and stops opening the report.",
    mechanism: [
      "You give Onam a repository's HTTPS address and a branch — GitHub, GitLab or Bitbucket — and, if you want dynamic testing, the URL of a running app you are authorised to test. Each scan runs as its own isolated job against a shallow clone of that branch, and the clone is deleted when the scan ends.",
      "Static analysis runs on the open-source Semgrep engine with three rule sources: community security packs (OWASP Top 10, security audit, secrets, Node.js), Onam-curated taint rules that follow untrusted input to a dangerous call, and Onam-reviewed pattern rules. Pattern rules that were judged code-quality rather than security are dropped before a scan runs.",
      "Every result is graded by how much the rule can prove. Taint and AST matches become Security issues and keep the severity the rule asserts; pattern matches become Hotspots to review, capped at medium, so they can never outrank a confirmed flaw. Each finding carries the file, line, rule, CWE and OWASP category.",
      "Dependency analysis reads manifests and lockfiles itself, matches each component against OSV and NVD advisories, adds EPSS exploit probability and CISA KEV membership, and turns them into a single 0–10 risk score. The same pass produces a CycloneDX 1.5 SBOM for the repository.",
      "IaC templates and Dockerfiles in the same clone are checked in the same scan, and secret rules run over every file. If you gave a target URL, dynamic testing discovers the app's endpoints and sends rate-limited test payloads at them.",
      "Results land in the Code Security console — projects, alerts, scan history, per-scanner tabs and trend reports — and static and dynamic scan results also feed the AppSec pillar of the platform's CNAPP posture score, next to your cloud posture.",
    ],
    whatYouGet: [
      "Confirmed issues kept apart from hotspots — taint-backed findings first, pattern matches in a separate review list capped at medium",
      "CWE and OWASP on every code finding — with the file, line and rule that produced it",
      "Coverage for mainstream languages — Python, JavaScript, TypeScript, Java, C#, Go, C, C++ and Ruby",
      "Dependency risk beyond CVSS — a 0–10 score built from CVSS, EPSS, CISA KEV and whether a fixed version exists",
      "A CycloneDX 1.5 SBOM per repository — and import of existing CycloneDX or SPDX JSON SBOMs",
      "SBOM governance — license classification and policy checks, an NTIA minimum-elements check, VEX statements and SBOM diffs",
      "Dynamic testing of a running app — endpoint discovery, injection and SSRF payloads, header and cookie checks, JSON, HTML and SARIF reports",
      "A fix path for every finding — rule guidance and a copyable AI fix prompt, plus AI Code Fix to put corrected files on a branch",
      "Reports and trends — scan history per project, with CSV and PDF export",
    ],
    faqs: [
      {
        q: "Which languages does static analysis cover?",
        a: "Python, JavaScript, TypeScript, Java, C#, Go, C, C++ and Ruby. Depth varies by language: Python, JavaScript/TypeScript, Java, C#, Go and Ruby have Onam-curated taint rules as well as community and pattern rules; C and C++ rely on community and pattern rules, so expect more of their results in the hotspot list. Other languages are not analysed today.",
      },
      {
        q: "What is the difference between a security issue and a hotspot?",
        a: "A security issue comes from a rule that can show the flaw — usually by following untrusted input to a dangerous call. A hotspot comes from a pattern rule that found something worth a look but cannot prove it is exploitable. Hotspots are capped at medium severity and listed separately, so they never bury a confirmed finding.",
      },
      {
        q: "Will this break our builds?",
        a: "No. Onam has no CI plugin, GitHub Action or pull-request check today, so nothing blocks a build. A scan reports its findings in the console and through the API. If you want a pipeline gate, a pipeline step can start a scan through the API, read the findings and decide for itself whether to fail.",
      },
      {
        q: "Does it trace a code finding to the workload running that code?",
        a: "Not today. Code findings live in the same platform as your cloud findings and count towards the same posture score, but Onam does not yet link a finding to the specific container image or cloud workload built from that repository. We would rather say so than imply a join that is not there.",
      },
      {
        q: "Can it fix what it finds?",
        a: "Every finding comes with rule guidance and an AI fix prompt you can copy into your own assistant. For static-analysis findings, AI Code Fix can rewrite the affected files and push them to a separate branch for your team to review — today it is run with you on request rather than from a console button. Nothing merges or deploys itself.",
      },
      {
        q: "What is kept from our repository?",
        a: "The findings: file path, line, rule, message and a short code snippet for context, plus the dependency list and SBOM. The clone itself is deleted when the scan ends.",
      },
    ],
    related: [
      { label: "Static analysis (SAST) and secrets", href: "/platform/code-security/sast" },
      { label: "Dependencies and SBOM (SCA)", href: "/platform/code-security/sca-sbom" },
      { label: "Dynamic testing (DAST)", href: "/platform/code-security/dast" },
      { label: "Onam AI Code Fix", href: "/platform/ai-code-fix" },
      { label: "Code Security docs", href: "/docs/code-security/overview" },
      { label: "What is code security?", href: "/learn/code-security" },
    ],
  },
  cspm: {
    demoClips: ["scan", "dashboard"],
    icon: ShieldCheck,
    iconColor: brand400,
    label: "CSPM",
    question: "Are my cloud configs actually secure right now?",
    headline: "Misconfigurations are the #1 cause of cloud breaches. We find yours first.",
    sub: "Every resource your team deploys is a potential gap. Onam checks 9,853 CSPM posture rules continuously — across all your clouds — so you know about misconfigurations the same day they're introduced, not six months later.",
    painPoint:
      "Your DevOps team ships 50 new resources this week. By Friday, three of them are misconfigured — a security group open to the internet, an S3 bucket with public read, an RDS instance with no encryption. None intentional; they're just defaults nobody changed. The problem isn't careless engineers — it's that manual audits can't keep pace with cloud deployment.",
    mechanism: [
      "When you connect a cloud account, Onam enumerates every resource across 549 services using read-only IAM roles, service principals, or service accounts.",
      "Each resource is evaluated against 9,853 posture rules — OCI 2,059, AWS 2,018, Azure 1,926, GCP 1,322, Alibaba 1,151, Kubernetes 824, IBM 553 — categorised by severity and mapped to compliance frameworks like CIS, NIST, and PCI-DSS.",
      "The scan is read-only — we never modify your environment and store only a role ARN, no long-lived keys.",
      "Findings update continuously as infrastructure changes, not weekly. New findings surface within minutes of a misconfigured resource being deployed.",
      "Every finding ships with exact remediation — a CLI command, Terraform snippet, or console walkthrough — so engineers fix instead of triage.",
    ],
    whatYouGet: [
      "Every misconfiguration ranked by severity — Critical, High, Medium, Low",
      "Exact remediation for each finding: CLI command, Terraform snippet, or console steps",
      "Compliance mapping — which frameworks each finding violates (CIS, NIST, PCI)",
      "Historical trending — is your posture improving or degrading",
      "Resource-level drilldown — every finding linked to the specific resource and region",
      "New finding notifications when critical issues are introduced",
      "Suppression and exceptions workflow for accepted risks",
      "Coverage report — how much of your account is actually being scanned",
    ],
    faqs: [
      {
        q: "How is Onam CSPM different from AWS Security Hub or Azure Defender for Cloud?",
        a: "Native tools only see the cloud they run in and only correlate within that provider. Onam runs the same 9,853 rules — plus attack path, CIEM, and data context — across all seven clouds on one graph. That means a public S3 bucket, an over-privileged role, and a cross-account trust chain surface as one finding, not three disconnected alerts.",
      },
      {
        q: "Does connecting my cloud account require write access?",
        a: "No. Onam uses read-only IAM roles, service principals, or service accounts. We never modify your environment; the platform stores only a role ARN — no long-lived keys.",
      },
      {
        q: "How quickly do findings appear after I connect an account?",
        a: "First critical findings typically surface in under five minutes. A complete first-pass evaluation across every service and rule usually completes within 30–60 minutes depending on account size.",
      },
      {
        q: "Can I suppress findings I have accepted as a business risk?",
        a: "Yes. Suppressions require a justification and optional expiry date, and they are recorded in the compliance evidence trail. Suppressed findings stay visible to the security team but are excluded from the active queue and dashboards.",
      },
      {
        q: "Does CSPM cover Kubernetes manifests or Terraform before deployment?",
        a: "The CSPM engine evaluates deployed cloud state. Pre-deploy IaC scanning (Terraform, CloudFormation, Helm, Kubernetes manifests) is handled by the Code Security engine, which shares the same rule graph — so a finding that would be created in production is caught in the pull request.",
      },
    ],
    related: [
      { label: "What is CSPM?", href: "/learn/cspm" },
      { label: "CIEM — Identity risk", href: "/platform/ciem" },
      { label: "Compliance frameworks", href: "/platform/compliance" },
      { label: "Network Security — topology", href: "/platform/network-security" },
    ],
  },

  ciem: {
    demoClips: ["ciem", "attack"],
    icon: Users,
    iconColor: cyan,
    label: "CIEM",
    question: "Who can access what — and should they still have that access?",
    headline: "80% of cloud permissions are never used. Every unused permission is a door that doesn't need to exist.",
    metaDescription:
      "CIEM resolves the effective permissions of every human and machine identity across your clouds, then compares them with what was used in the last 90 days.",
    sub: "Identity is the new perimeter. CIEM resolves the effective permissions of every human user, service account, and machine identity across all your clouds — then compares them against what was actually used in the last 90 days. The gap is your attack surface.",
    painPoint:
      "Your team ships a new IAM role for a Lambda function. Someone attaches AdministratorAccess because it's Friday. Two years later it's still there — the Lambda has been retired, but the role still exists, still trusts every principal, and still has full write access to production. Multiply that by every service, every team, every environment. That is your real identity attack surface.",
    mechanism: [
      "Onam ingests every IAM object across your clouds — users, roles, groups, service accounts, policies, and trust relationships — via read-only APIs.",
      "The engine resolves effective permissions per identity, walking every policy, group membership, and cross-account trust to compute what an identity can actually do.",
      "Recent activity from CloudTrail, Azure Activity Log, and GCP Cloud Audit Logs is joined against granted permissions to expose the unused surface.",
      "The result is a per-identity least-privilege gap score, plus prioritised recommendations that generate a right-sized policy from real 90-day usage.",
      "Privilege-escalation paths are searched on the identity graph and cross-checked against Cloud Detection & Response, so a path that has actually been walked is separated from one that is merely reachable.",
      "Findings refresh continuously so new identities, new grants, and new activity are reflected within minutes — no manual re-scan.",
      "Access reviews turn the output into an attestation workflow: each identity is put in front of an owner with a state — pending, needs remediation, reviewed, or deferred — so the review is a tracked decision rather than a spreadsheet emailed once a quarter.",
    ],
    whatYouGet: [
      "Effective permissions resolved for every identity — not just what's attached",
      "Least-privilege gap score (0–100) for each user, role, and service account",
      "Shadow admin detection — identities that reach admin without an admin role",
      "Stale identity list — accounts and keys unused for 90+ days",
      "Cross-account trust chain analysis — external access you may not know about",
      "Suggested least-privilege policies based on 90-day actual usage",
      "MFA coverage report for privileged identities",
      "Attack path visualisation — how a low-privilege identity reaches admin",
      "Escalation paths cross-confirmed against CDR — which of them have actually been walked",
      "Zombie identities — accounts with no activity for over 90 days, listed as their own class",
      "Access reviews — an attestation and remediation workflow with a state on every identity",
      "Database CIEM — grants inside managed databases, not only the cloud IAM layer around them",
      "Per-identity-type breakdown, so users, roles and service accounts are not averaged together",
    ],
    faqs: [
      {
        q: "Does CIEM require CloudTrail or activity logs to be enabled?",
        a: "For usage-based recommendations, yes — CloudTrail (AWS), Activity Log (Azure), or Cloud Audit Logs (GCP) provide the 90-day baseline. Static findings like shadow admin, cross-account trust, and MFA gaps do not require logs and work immediately on connection.",
      },
      {
        q: "What's the difference between CIEM and IAM Security?",
        a: "IAM Security audits static configuration — access keys, policies, group membership, root usage. CIEM goes further: it resolves effective permissions, joins them to real behaviour over time, and flags the gap. IAM Security asks 'is this configured correctly?'; CIEM asks 'should this identity still exist?'.",
      },
      {
        q: "Are service accounts and machine identities (Lambda roles, instance profiles) included?",
        a: "Yes. Non-human identities are analysed the same way as users — effective permissions resolved, usage tracked, unused surface reported. Lambda execution roles, EC2 instance profiles, EKS pod identities, GCP workload identities, and Azure managed identities are all first-class.",
      },
      {
        q: "Can CIEM detect if an external party has access to our accounts?",
        a: "Yes. Onam walks every trust policy and cross-account role chain, flags external principals, and highlights any external identity that can assume a privileged role in your production accounts. Third-party SaaS integrations are surfaced separately with an inventory view.",
      },
      {
        q: "Can CIEM run an access review or attestation campaign?",
        a: "Yes, and it is the part most teams actually need. Every identity carries a review state — pending, needs remediation, reviewed, or deferred — so an access review is a tracked workflow with an owner and an outcome rather than a spreadsheet that gets emailed once a quarter and answered by nobody. The finding that triggered the review stays attached to it, so the reviewer sees why the identity was flagged.",
      },
      {
        q: "Does CIEM cover permissions inside databases, or only cloud IAM?",
        a: "Both. Cloud IAM tells you who can reach a database; database CIEM looks at the grants inside it. An identity with no IAM path to production data and a standing grant on the database itself is invisible to a tool that only reads the cloud provider's IAM layer.",
      },
      {
        q: "What is the difference between an escalation path and one that has been walked?",
        a: "Reachability says a chain of assumes exists. CDR confirmation says the chain was actually used. Onam reports both and distinguishes them, because a queue that treats every theoretical path as urgent is a queue that gets ignored — and the confirmed ones are the incident.",
      },
      {
        q: "How does multi-hop privilege escalation detection work?",
        a: "The identity graph models roles as nodes and assume-role edges. Onam runs a reachability search from every low-privilege identity to sensitive permissions like iam:PassRole or admin-equivalent actions, showing the exact chain of assumes and any conditions on the way.",
      },
    ],
    related: [
      { label: "What is CIEM?", href: "/learn/ciem" },
      { label: "CIEM vs IAM security — the practical difference", href: "/resources/blog/ciem-vs-iam-security" },
      { label: "IAM Security", href: "/platform/iam" },
      { label: "Threat Detection", href: "/platform/threat-detection" },
      { label: "CSPM", href: "/platform/cspm" },
    ],
  },

  iam: {
    demoClips: ["ciem", "scan"],
    icon: KeyRound,
    iconColor: yellow,
    label: "IAM Security",
    question: "Are the right people — and only the right people — able to access my cloud?",
    headline: "IAM misconfigurations are in every breach postmortem. Let's fix yours now.",
    sub: "IAM Security gives you a complete view of every user, role, policy, and access key across your cloud accounts — and flags everything that doesn't belong.",
    painPoint:
      "An engineer leaves the company. Six months later their access key still works. Root account MFA was disabled during a migration and never re-enabled. A wildcard policy attached in 2022 for a one-off script is still granting admin to a shared role. None of this is on anyone's dashboard — it lives in the gap between IT, security, and DevOps. That gap is where breaches start.",
    mechanism: [
      "Onam enumerates every IAM object across AWS, Azure, GCP, OCI, AliCloud, IBM, and Kubernetes — via read-only integrations.",
      "The engine evaluates users, roles, policies, groups, and access keys against a curated ruleset built from CIS, NIST, and Onam's own field-tested benchmarks.",
      "Access keys, passwords, and role trust relationships are correlated with last-used telemetry to expose the stale surface no one has touched in months.",
      "AWS Organizations, Azure management groups, and GCP resource hierarchy are traversed so SCP and policy inheritance are analysed in full context.",
      "Every finding lands in the same queue as CSPM, CIEM, and Network Security, so a single remediation ticket can address several linked risks at once.",
    ],
    whatYouGet: [
      "Root account activity detection and MFA enforcement status",
      "Access key age and last-used reporting for every IAM user",
      "Policy attachment analysis — direct policies, wildcard permissions, unused policies",
      "Group membership audit",
      "Cross-account trust review",
      "Password policy compliance vs CIS and NIST",
      "Inactive user list (90+ days)",
      "Service control policy (SCP) inheritance analysis for AWS Organizations",
    ],
    faqs: [
      {
        q: "How is IAM Security different from CIEM?",
        a: "IAM Security is a configuration audit — is MFA on, are keys rotated, are policies compliant. CIEM is a behavioural analysis — given what this identity actually did in 90 days, what permissions should it have. They are complementary, and in Onam they share the same identity graph.",
      },
      {
        q: "Which cloud IAM systems are covered?",
        a: "AWS IAM (users, roles, policies, SCPs, Identity Center), Azure Entra ID and RBAC, GCP IAM, Oracle Cloud IAM, Alibaba RAM, IBM Cloud IAM, and Kubernetes RBAC. All under one unified identity model.",
      },
      {
        q: "Can IAM Security detect if an access key has been compromised?",
        a: "IAM Security flags high-risk key configurations — long-lived, unused, shared, or embedded in code repositories via the Code Security integration. Detection of actual credential abuse in flight is handled by the CDR and Threat Detection engines using CloudTrail behavioural analysis.",
      },
      {
        q: "How does AWS Organizations support work?",
        a: "Onam reads the org structure, all OUs, member accounts, and every SCP. Policy inheritance is resolved so you see the effective permission boundary at each account, and org-wide risks like a missing MFA baseline show up once, not per account.",
      },
    ],
    related: [
      { label: "CIEM — Entitlement analysis", href: "/platform/ciem" },
      { label: "CSPM", href: "/platform/cspm" },
      { label: "Threat Detection", href: "/platform/threat-detection" },
    ],
  },

  "attack-path": {
    demoClips: ["attack", "risk"],
    icon: GitBranch,
    iconColor: red400,
    label: "Attack Path Analysis",
    question: "Which combination of misconfigurations leads directly to your most critical assets?",
    headline: "Attackers chain small issues into catastrophic breaches. Most tools only show you the individual links.",
    metaDescription:
      "Attack path analysis on a live security graph: Onam traces every route from an exposed entry point to your crown jewels across posture, identity, network.",
    sub: "Onam builds a live security graph across posture, identity, network, and vulnerability data — then runs automated path analysis to show every route an attacker could take from an exposed entry point to your crown jewels. (Attack path analysis maps chains of cloud risk — it is unrelated to an \"on-path attack\", the interception technique formerly called man-in-the-middle.)",
    painPoint:
      "A medium-severity SSRF on an EC2 instance. A dormant IAM role with S3 write. A subnet with an over-permissive NACL. Three findings, three teams, three sprints. Individually they are noise; chained together they exfiltrate your customer database in under an hour. Standard tools list them separately — an attacker sees the path.",
    mechanism: [
      "Onam builds a unified graph across posture, identity, network, data, and vulnerability findings — every resource is a node, every relationship is an edge.",
      "Crown jewels are identified automatically (sensitive data, prod databases, cross-account admin) and can be tagged manually for business-specific assets.",
      "A graph traversal engine enumerates every path from an internet-reachable entry point to those crown jewels, scoring each by number of hops, blast radius, and exploit availability.",
      "Every node is then scored by convergence — how many distinct paths run through it, weighted by the value of the targets those paths reach. The highest-convergence nodes are choke points: usually an over-privileged identity or a shared network hop where one fix severs many routes at once.",
      "Toxic combinations — pairs of individually medium findings that create a critical path together — are surfaced separately and ranked by how many paths they enable.",
      "Every step is tagged with MITRE ATT&CK for Cloud, so responders see the technique, and remediation guidance points to the single fix that collapses the most paths.",
    ],
    whatYouGet: [
      "Crown jewel path analysis — every route from exposed entry points to critical assets, as interactive graphs",
      "Toxic combination detection — AI-identified pairs of misconfigurations that together create critical blast radius",
      "MITRE ATT&CK tagging on every step",
      "Blast radius scoring",
      "Attack path prioritisation — rank by how many critical paths a finding appears in, not CVSS",
      "One-click remediation guidance — the single fix that collapses the most paths",
      "Choke-point ranking — the top nodes where a single fix severs the most paths, so the queue is a short list instead of a backlog",
      "Historical path tracking",
      "Integration with Risk engine — dollar-denominated exposure per path",
    ],
    chips: [
      "Choke points", "Toxic combinations", "Blast radius", "Crown jewels", "Graph traversal",
      "MITRE ATT&CK for Cloud", "Initial Access", "Privilege Escalation", "Lateral Movement",
      "Credential Access", "Exfiltration", "Cross-account trust",
    ],
    faqs: [
      {
        q: "How is attack path analysis different from CSPM?",
        a: "CSPM tells you which resources are misconfigured. Attack path tells you which combinations of misconfigurations reach something you actually care about. A public bucket is a CSPM finding; a public bucket reachable from a lambda that can be triggered by an anonymous SNS topic is an attack path.",
      },
      {
        q: "What is a toxic combination?",
        a: "A pair (or set) of findings that are individually medium severity but together enable a critical impact — for example, an SSRF-vulnerable EC2 plus an over-privileged instance profile plus an unrestricted egress. Onam surfaces these explicitly so you can fix the smallest link that breaks the chain.",
      },
      {
        q: "What data sources feed the attack path graph?",
        a: "All Onam engines: CSPM posture, CIEM effective permissions, network topology, data classification, vulnerability findings, and code-security context. Because every source writes to the same graph, correlations happen automatically — no external SIEM stitching required.",
      },
      {
        q: "How do you define crown jewels?",
        a: "Onam auto-identifies obvious candidates: databases containing classified PII/PHI/PCI, prod production accounts, roles with admin equivalence, and secrets stores. Teams can also tag specific resources or resource groups as crown jewels, which promotes any path reaching them to the top of the queue.",
      },
      {
        q: "What is a choke point, and why fix it before the critical findings?",
        a: "A choke point is a single resource that sits on a large number of distinct attack paths. Severity describes a finding in isolation; convergence describes leverage. A medium-severity role that every path routes through removes far more real risk when fixed than a critical finding on a resource an attacker cannot reach — and because the graph is recomputed on the next scan, the fix is verifiable: the paths that depended on that node are simply gone.",
      },
      {
        q: "What is attack path analysis?",
        a: "Attack path analysis is reachability reasoning over a graph of your cloud, rather than a list of findings. It starts from what an attacker can touch — an internet-facing service, a compromised identity — and walks the relationships that actually exist between resources until it reaches something worth protecting. The output is a route with an entry point, a set of hops and a destination, which is a thing you can fix. A severity list cannot express that, because severity describes one finding in isolation and a route is a property of the connections between them.",
      },
      {
        q: "Is attack path mapping the same as attack path analysis?",
        a: "In practice yes — the two terms are used interchangeably across the industry, and no standards body distinguishes them. Where people do draw a line, mapping tends to mean building the graph of what connects to what, and analysis means searching that graph for routes to crown jewels. Onam does both in one pass: the graph is built from read-only telemetry across 7 clouds, then traversed breadth-first from reachable entry points. If a vendor tells you these are different products, ask which one you are being sold.",
      },
      {
        q: "What is attack path management, and how is it different from finding paths?",
        a: "Finding a path is a point-in-time result. Managing them is the operational loop around it: ranking the paths that matter, choosing the change that removes the most of them at once, verifying the route is actually gone on the next scan, and watching for the new ones that appear as the estate changes. The verification step is the one most often missing — a path you cannot confirm is closed is a path you have to keep worrying about. Onam recomputes the graph every scan, so a fixed route disappears rather than being marked resolved by hand.",
      },
      {
        q: "How do I know a path is real and not a theoretical graph traversal?",
        a: "This is the right question to ask any vendor, including us. A graph will happily produce routes that cannot be walked in practice. Onam verifies every edge across five independent security domains before a path is called confirmed, and an unverified path is never priced — because a dollar figure attached to a route that does not exist is worse than no figure at all. The full method is documented in our attack-path methodology whitepaper.",
      },
    ],
    related: [
      { label: "Attack-path methodology (whitepaper)", href: "/whitepapers/wp1-attack-path-methodology.pdf" },
      { label: "What is a cloud attack path?", href: "/learn/cloud-attack-path" },
      { label: "CIEM vs IAM security — the practical difference", href: "/resources/blog/ciem-vs-iam-security" },
      { label: "What is a choke point?", href: "/learn/choke-point" },
      { label: "What is cloud risk quantification?", href: "/learn/cloud-risk-quantification" },
      { label: "Threat Detection", href: "/platform/threat-detection" },
      { label: "CDR — Behavioral Detection", href: "/platform/cdr" },
      { label: "Risk Quantification", href: "/platform/risk" },
      { label: "CIEM — Identity Paths", href: "/platform/ciem" },
    ],
  },

  cdr: {
    demoClips: ["cdr", "scan"],
    icon: Activity,
    iconColor: orange400,
    label: "CDR — Cloud Detection & Response",
    question: "Is an attacker operating inside your cloud environment right now?",
    headline: "By the time a SIEM fires an alert, the attacker has already moved. CDR closes the gap.",
    metaDescription:
      "Cloud detection and response (CDR): three-tier behavioral analysis of cloud audit logs, correlated with your posture and identity graph for context.",
    sub: "Onam CDR runs continuous three-tier behavioral analysis over your cloud audit logs — detecting everything from known attack patterns to novel techniques no signature has seen, and correlating every finding with your posture and identity graph for instant context.",
    painPoint:
      "An access key ends up in a public code repo. The SIEM ingests CloudTrail on a 15-minute batch. By the time the correlation rule fires, an attacker has already listed every bucket, enumerated your IAM policies, and started staging data in a scratch account. Ninety percent of cloud breaches involve valid credentials — traditional log tools were not built for that speed or shape.",
    mechanism: [
      "Onam streams cloud audit logs — CloudTrail, VPC Flow, Azure Activity Log, GCP Cloud Audit, Kubernetes audit — in near real time, no external SIEM required.",
      "L1 rule-based detection matches 200+ known-bad signatures aligned to MITRE ATT&CK for Cloud, covering credential abuse, persistence, exfiltration and defense evasion.",
      "L2 behavioural analysis maintains 30-day per-entity baselines, so an identity behaving unlike itself (new region, new API, off-hours) fires an anomaly even without a rule.",
      "L3 unsupervised ML surfaces novel techniques by clustering rare event sequences that never match known signatures — the class of threat traditional detection misses entirely.",
      "Every alert is auto-enriched with posture, identity, and network context from the Onam graph and routed to Slack, PagerDuty, or email with response playbooks attached.",
    ],
    whatYouGet: [
      "L1 rule-based detection — 200+ known-bad signatures across CloudTrail, VPC Flow, and K8s audit logs",
      "L2 statistical behavioral baselines — per-entity anomaly detection over 30-day windows",
      "L3 ML anomaly detection — novel threats with no prior signature",
      "MITRE ATT&CK for Cloud mapping",
      "Posture + identity enrichment on every alert",
      "Incident correlation into unified incidents",
      "Real-time alerting — Slack, PagerDuty, email with full context",
      "Response playbooks — quarantine, revoke, block",
    ],
    faqs: [
      {
        q: "What log sources does CDR consume?",
        a: "AWS CloudTrail (management and data events), VPC Flow Logs, GuardDuty findings, Azure Activity Log and Entra ID sign-in logs, GCP Cloud Audit Logs, Kubernetes audit logs, and container runtime events. All ingested via read-only integrations.",
      },
      {
        q: "How is CDR different from AWS GuardDuty or Microsoft Defender?",
        a: "Native tools only see their own cloud and produce alerts without posture context. Onam CDR ingests their findings as one of many signals, adds cross-cloud behavioural and ML detection, and enriches every alert with identity, network, and data context — so a GuardDuty signal about a suspicious API call arrives already correlated to the specific identity and the assets it can reach.",
      },
      {
        q: "What is the latency from event to alert?",
        a: "Typically under two minutes from log emission to alert delivery for L1 and L2 detection. L3 ML detection runs on rolling windows and can surface novel patterns within 5–15 minutes depending on event volume.",
      },
      {
        q: "Does CDR require us to change our log retention settings?",
        a: "No. CDR reads logs at ingest and stores its own detection state; you keep your existing retention. Onam recommends at least 90 days of CloudTrail for baseline construction, but detection works with whatever retention you have.",
      },
    ],
    related: [
      { label: "Attack Path Analysis", href: "/platform/attack-path" },
      { label: "Threat Detection", href: "/platform/threat-detection" },
      { label: "CIEM — Identity", href: "/platform/ciem" },
      { label: "Network Security", href: "/platform/network-security" },
    ],
  },

  "threat-detection": {
    demoClips: ["cdr", "attack"],
    icon: Crosshair,
    iconColor: csmRed,
    label: "Threat Detection",
    question: "Is something suspicious happening in my cloud right now?",
    headline: "Attacks don't announce themselves. They look like normal cloud activity — until they don't.",
    metaDescription:
      "Cloud threat detection mapped to MITRE ATT&CK for Cloud, so your team knows the technique, the likely next move and how to respond.",
    sub: "Onam maps every suspicious event to MITRE ATT&CK for Cloud — so when something unusual happens, your team already knows the technique, the likely next move, and how to respond.",
    painPoint:
      "Your alerting fires seventeen times an hour. Half are false positives from a batch job that runs during off-hours; the other half look identical to each other. Somewhere in that stream is a real attacker using valid credentials to enumerate S3 buckets from a country you don't operate in. Nobody has time to tell which is which — which is exactly what the attacker is counting on.",
    mechanism: [
      "Onam ingests cloud audit, identity, and network logs across every connected cloud and runs the events through a detection graph, not a flat rule engine.",
      "Every finding is mapped to a MITRE ATT&CK for Cloud tactic and technique, so responders see the technique, likely next steps, and playbook — not just an event.",
      "Related detections are automatically grouped into attack chains: initial access → discovery → privilege escalation → impact, visualised as a connected graph.",
      "Alerts are ranked by exploitability and actual reachability of the resources involved — the same reachability model that powers Attack Path Analysis.",
      "Correlation collapses redundant alerts into single incidents, so a 300-event brute-force burst arrives as one incident with all the evidence attached.",
    ],
    whatYouGet: [
      "Every threat finding mapped to a MITRE ATT&CK tactic and technique",
      "Attack chain visualisation as connected graphs",
      "Toxic combination detection",
      "Blast radius analysis",
      "Severity ranking by CVSS, exploitability, and actual reachability",
      "Alert fatigue reduction via correlation",
      "Response guidance per technique",
      "Historical attack timeline",
      "Full integration with the Attack Path engine",
    ],
    faqs: [
      {
        q: "How is this different from a SIEM like Splunk or Microsoft Sentinel?",
        a: "A SIEM is a log lake with search — you write the correlation rules. Onam ships with cloud-native detections mapped to MITRE ATT&CK, correlated to your posture and identity graph, and pre-tuned for cloud audit shapes. If you already run a SIEM, Onam forwards enriched incidents into it via webhook so you get both.",
      },
      {
        q: "What log sources power threat detection?",
        a: "AWS CloudTrail, VPC Flow, GuardDuty, IAM Access Analyzer; Azure Activity Log, Entra ID sign-ins, Defender findings; GCP Cloud Audit Logs and SCC; Kubernetes audit logs and container runtime events. All ingested read-only.",
      },
      {
        q: "What's the difference between an attack path and an alert?",
        a: "An alert fires on an event that already happened. An attack path is the pre-computed route an attacker could take right now given your current posture. Onam does both — and joins them, so an alert on a suspicious API call automatically shows which paths it accelerates.",
      },
      {
        q: "Does Onam replace GuardDuty or Microsoft Defender?",
        a: "No — it consumes and enriches them. Onam correlates their signals with cross-cloud posture, identity, and network context, so you keep your provider-native investment and get one prioritised queue on top.",
      },
    ],
    related: [
      { label: "Attack Path Analysis", href: "/platform/attack-path" },
      { label: "CDR — Behavioral Detection", href: "/platform/cdr" },
      { label: "CIEM — Identity paths", href: "/platform/ciem" },
      { label: "Network Security", href: "/platform/network-security" },
      { label: "Vulnerability Management", href: "/platform/vulnerability" },
    ],
  },

  "network-security": {
    demoClips: ["network", "attack"],
    icon: Network,
    iconColor: csmPurple,
    label: "Network Security",
    question: "What's actually reachable from the internet in my cloud?",
    headline: "Security groups are one layer. Your attack surface has seven.",
    metaDescription:
      "Cloud network security that traces the full path, from VPC isolation to WAF coverage and flow logs, to show what is actually reachable from the internet.",
    sub: "Most tools tell you which security groups have port 22 open. Onam traces the full 7-layer network path — from VPC isolation to WAF coverage and flow log monitoring — and shows what's actually reachable from the internet, not just what the rules say.",
    painPoint:
      "Your security group review says port 22 is closed. But the instance sits in a public subnet, behind a load balancer that terminates TLS, in a VPC peered to a shared network where a jump host has SSH open to the world. On paper you are safe. In practice a single hop reaches the database. Rules alone lie; only reachability tells the truth.",
    mechanism: [
      "Onam pulls every network object across your clouds — VPCs, subnets, route tables, NACLs, security groups, load balancers, WAFs, transit gateways, peerings.",
      "The engine models them as a graph and runs reachability analysis: given an internet source, what resources can actually receive traffic, on which ports, over how many hops.",
      "Each resource gets an effective exposure score that reflects the true path, not just the closest security group.",
      "Coverage gaps — subnets without flow logs, load balancers without WAFs, missing TLS enforcement — are surfaced separately.",
      "Findings refresh continuously as networks change, so a new peering or a shifted route table shows up within minutes.",
    ],
    whatYouGet: [
      "Effective exposure score for every resource",
      "Security group audit — overly permissive inbound on SSH, RDP, DB ports",
      "Subnet classification — truly private vs publicly accessible",
      "NACL analysis",
      "Load balancer security — TLS version, HTTP→HTTPS redirect, internet-facing exposure",
      "WAF coverage map",
      "Flow log coverage gaps",
      "VPC peering and transit gateway exposure analysis",
    ],
    faqs: [
      {
        q: "Does Network Security only work for AWS VPCs?",
        a: "No. AWS VPCs, Azure VNets, GCP VPCs, OCI VCNs, Alibaba VPCs, and Kubernetes network policies are all analysed on the same reachability graph. Peering, transit, and cross-cloud connectivity are modelled end to end.",
      },
      {
        q: "What's the difference between this and a network vulnerability scanner like Nessus?",
        a: "Nessus probes hosts. Onam analyses configuration. We tell you which paths exist and whether a resource is reachable; a scanner tells you what services respond on those ports. They are complementary — Onam highlights the reachable surface so a scanner can be pointed there deliberately.",
      },
      {
        q: "Do I need agents installed on instances?",
        a: "No. Network Security is fully agentless. It reads cloud provider metadata via read-only IAM roles, plus flow log summaries where enabled, to construct the reachability graph.",
      },
      {
        q: "What does 'effective exposure' mean in practice?",
        a: "It is the resource's real reachability from the internet given every layer in front of it — routes, NACLs, security groups, load balancers, WAFs. A public IP behind a WAF with strict rules scores very differently from a public IP behind an open security group, even if both look 'internet-facing' in a spreadsheet.",
      },
    ],
    related: [
      { label: "CSPM — Config rules", href: "/platform/cspm" },
      { label: "Threat Detection", href: "/platform/threat-detection" },
      { label: "Container Security", href: "/platform/container-security" },
    ],
  },

  "data-security": {
    demoClips: ["datasec", "attack"],
    icon: Database,
    iconColor: csmAmber,
    label: "DSPM — Data Security Posture Management",
    question: "Where is your sensitive data — and who can reach it?",
    headline: "Every data store, what it likely holds, and every way in.",
    metaDescription:
      "DSPM from Onam Security: find every cloud data store, label it from metadata, and see who can reach it, how it is exposed and where its data flows.",
    sub: "Onam's DSPM inventories every data store across your clouds, labels it from metadata, and joins it to exposure, identity, encryption and lineage — so a sensitive store is never judged alone.",
    stats: [
      { v: "1,321", l: "data protection rules" },
      { v: "310", l: "storage & database rules" },
      { v: "7", l: "clouds" },
      { v: "Metadata", l: "classification — contents not read" },
    ],
    risk: {
      title: "A store is only as safe as its weakest grant",
      body: "One wildcard principal, one ACL grant to all users, one bucket policy that trusts a partner account — any of them turns a well-encrypted store into an exposed one. The setting that matters is rarely on the store's summary page.",
      tagline: "Exposure explained by the grant that causes it",
    },
    painPoint:
      "You had one production database in 2019. Today you have that database, three read replicas, an analytics warehouse, a dozen buckets holding exports, a stream feeding a data lake, and a disaster-recovery copy in another region. Each was created for a good reason by someone who has since moved teams. Nobody can say which of them hold customer data, which are reachable from outside, or where the nightly export actually lands — until an auditor asks for the map.",
    mechanism: [
      "Discovery: the posture scan inventories every data store through read-only cloud roles — object storage, managed databases, warehouses, streams, Kubernetes secrets and ConfigMaps — and records encryption, bucket policy, ACLs, public-access settings, logging, versioning, backup retention, region and the store's relationships to other resources. Self-hosted databases you onboard as technology accounts join the same inventory.",
      "Classification from metadata: store names, descriptions, tags, database and schema names, and the metadata on matching rules are turned into PII, PHI, PCI, financial and confidential labels. No object is opened and no row is queried — because every signal is something you can read in the store's own configuration, the reason for a label is never a black box.",
      "Exposure: a store is public only when an actual grant makes it so — the provider's own policy verdict, an ACL grant to all users, or a wildcard principal — each checked against the matching public-access block. Bucket policies that let another account in are flagged separately, and write access from outside is ranked critical.",
      "Who reaches it: observed access from cloud audit events over the last 30 days — which principals touched each store, with which operations, and when — sits next to the policy view. Classification, public access and encryption are written to the security graph, so attack paths that end at a sensitive store are scored as reaching a crown jewel.",
      "Lineage: relationships discovery already records — replication, backup, ETL writes, streaming, export and import — are linked into chains from the original source, up to eight hops, with every cross-region and cross-account hop flagged.",
      "Findings, every scan: each store is checked for classification, encryption, access, residency, logging, lifecycle and lineage, and given a 0–100 governance score. The same labels rank Database Security findings and drive the Encryption engine's sensitive-data checks.",
    ],
    whatYouGet: [
      "Data store catalog — every store with type, region, account and its sensitivity labels",
      "Metadata classification — PII, PHI, PCI, financial and confidential labels from names, tags and schema, never from contents",
      "Public exposure, explained — which grant made a store public: policy verdict, ACL or wildcard principal",
      "Cross-account access — bucket policies that let another account in, with write access ranked critical",
      "Observed access — who touched each store in the last 30 days, with operations and time of last access",
      "Encryption and keys — unencrypted stores, and sensitive data on provider-managed keys, from the Encryption engine",
      "Residency view — every store's region checked against the regions your data is allowed to live in",
      "Logging, versioning and backup — access logs, lifecycle rules, backup retention and point-in-time restore per store",
      "Data lineage — chains of replication, backup, ETL, streaming and export hops, cross-region and cross-account flagged",
      "Governance score — one 0–100 figure per store from encryption, public exposure and access logging",
      "Attack-path context — sensitive stores become the targets attack paths are scored against",
    ],
    faqs: [
      {
        q: "Does Onam read the actual contents of my data?",
        a: "No. Classification uses metadata — store names, descriptions, tags, database and schema names, and configuration. It does not open objects, query rows or sample files. That keeps your data where it is, and it has a cost worth knowing: a store whose name and tags say nothing about its contents gets no label until someone tags it.",
      },
      {
        q: "What decides whether a store is labelled PII?",
        a: "Tokens in its name, description and tags (for example customer, patient, billing, payment), database and schema names for self-hosted databases, and the metadata on rules that matched it. Because those signals are names and tags, a wrong label is easy to explain and a missing one is easy to fix with a tag.",
      },
      {
        q: "Which data stores are covered?",
        a: "Object storage on every cloud Onam scans (S3, Azure Storage, Cloud Storage, OCI Object Storage, Alibaba OSS, IBM Cloud Object Storage); managed databases and warehouses such as RDS and Aurora, DynamoDB, Redshift, Azure SQL, Cosmos DB, Synapse, Cloud SQL, BigQuery, Spanner, Firestore, Autonomous Database and PolarDB; streams such as Kinesis; Kubernetes secrets and ConfigMaps; and self-hosted databases including Snowflake when you onboard them. The full per-cloud list is in the DSPM docs.",
      },
      {
        q: "Does it list every identity that could read a store?",
        a: "Not as a single computed list today. What you get is the grants that make a store public, the other accounts a bucket policy lets in, the principals actually seen accessing it in the last 30 days, and the attack paths that end at it. Identity-by-identity effective permissions live in CIEM, on the same graph.",
      },
      {
        q: "Does it show where data goes after it lands?",
        a: "Yes, as far as the cloud's own resource relationships describe it. Replication, backup, ETL, streaming and export hops are linked into chains from the original source, and every hop that crosses a region or an account is flagged. Movement that leaves no relationship in the cloud's configuration — a script copying files on a schedule, say — is not visible to it.",
      },
      {
        q: "How do DSPM, Database Security and Encryption fit together?",
        a: "DSPM answers what data you hold, where, and how exposed it is, across every kind of store. Database Security goes deep on databases — engine hardening, backups, network placement — and ranks findings higher when DSPM has labelled the database sensitive. Encryption covers the keys, certificates and secrets themselves, and flags sensitive stores that are unencrypted or on provider-managed keys. One scan feeds all three.",
      },
    ],
    related: [
      { label: "DSPM documentation", href: "/docs/dspm/overview" },
      { label: "What is DSPM?", href: "/learn/dspm" },
      { label: "Database Security", href: "/platform/database-security" },
      { label: "Encryption & Keys", href: "/platform/encryption" },
      { label: "CIEM — Who has access", href: "/platform/ciem" },
      { label: "Attack Path", href: "/platform/attack-path" },
    ],
    ctaLine:
      "Posture scanning connects through read-only cloud roles. Your data catalog fills in on the first scan.",
  },

  "ai-security": {
    demoClips: ["scan", "dashboard"],
    icon: Cpu,
    iconColor: violet400,
    label: "AI Security",
    question: "Are my AI workloads introducing security risks I haven't thought about?",
    headline: "The SEC, EU AI Act, and NIST AI RMF now require AI security posture. Most CSPM tools don't check it.",
    metaDescription:
      "AI security posture for SageMaker models, Bedrock endpoints, training pipelines and inference workloads, a surface standard CSPM rules miss.",
    sub: "SageMaker models, Bedrock endpoints, training pipelines, and inference workloads have a distinct security surface — misconfigured by default and invisible to standard CSPM rules. Onam checks all of it.",
    painPoint:
      "A data scientist spins up a SageMaker endpoint to test a model. It's public by default, the notebook has a full-admin execution role attached, and training data is being pulled from a bucket the security team has never seen. Multiply that by every experimental model in your organisation. Traditional CSPM doesn't have a rule for it — AI security is the shadow IT nobody is watching.",
    mechanism: [
      "Onam enumerates AI-specific resources — SageMaker endpoints, notebooks, training jobs, Bedrock invocations, model artifacts — via read-only APIs.",
      "Each resource is evaluated against AI-native rules that cover network isolation, IAM scope on execution roles, encryption of artifacts, and logging of inference and training events.",
      "Training data lineage is walked back through the storage graph so you see which datasets flow into which models and who has access along the way.",
      "Findings integrate with the identity, network, and data engines, so an over-permissive endpoint reachable from the internet ranks alongside the equivalent web-app risk.",
      "Rules refresh continuously as new AI services and features ship, and compliance mappings track the EU AI Act and NIST AI RMF as those frameworks evolve.",
    ],
    whatYouGet: [
      "SageMaker endpoint access control — public vs VPC-only",
      "Bedrock model invocation audit",
      "Training job isolation (VPC + security groups)",
      "Model artifact encryption at rest",
      "Training data access analysis",
      "SageMaker Studio network isolation",
      "ML service role scoping",
      "Logging and monitoring for inference and training",
    ],
    faqs: [
      {
        q: "Which AWS AI services are covered today?",
        a: "SageMaker (endpoints, notebooks, Studio, training jobs, models, feature store), Bedrock (models, provisioned throughput, agents, knowledge bases), Comprehend, Textract, Rekognition, and Kendra. Coverage expands as new services and features ship.",
      },
      {
        q: "Why does AI security need a separate engine if I already have CSPM?",
        a: "AI services have configuration surfaces standard CSPM rules do not cover — network mode of endpoints, execution role scoping, artifact encryption, dataset lineage, invocation logging. AI Security applies AI-native rules and joins the findings to the same graph so risk shows up in the same queue.",
      },
      {
        q: "What Azure and GCP AI services are on the roadmap?",
        a: "Azure OpenAI, Azure Machine Learning, and Cognitive Services on Azure; Vertex AI, Model Garden, and Gemini on GCP. Roadmap follows customer signal — coverage of a service is prioritised by usage in the fleet.",
      },
      {
        q: "Do AI security findings appear in compliance reports?",
        a: "Yes. AI findings map to the same 78 compliance frameworks as the rest of the platform, plus dedicated mappings to the EU AI Act and NIST AI RMF. Auditor-ready exports include AI-specific evidence.",
      },
    ],
    related: [
      { label: "CSPM", href: "/platform/cspm" },
      { label: "Data Security", href: "/platform/data-security" },
      { label: "IAM Security", href: "/platform/iam" },
    ],
  },

  "container-security": {
    demoClips: ["cwpp", "scan"],
    icon: Box,
    iconColor: blue400,
    label: "Container & Kubernetes Security (KSPM)",
    chips: ["KSPM", "CIS Kubernetes Benchmark", "RBAC", "Pod Security", "Image scanning", "Admission control"],
    question: "Are my Kubernetes clusters and containers configured safely?",
    headline: "Containers move fast. Misconfigurations move faster.",
    metaDescription:
      "Container security and KSPM: image vulnerabilities, Kubernetes RBAC, network policies, pod security and CIS benchmarks for EKS, ECS and self-managed.",
    sub:
      "Kubernetes Security Posture Management (KSPM) and container security in one place — covers your full container estate — image vulnerabilities, Kubernetes RBAC, network policies, pod security standards, and cluster CIS benchmarks — across EKS, ECS, and self-managed clusters.",
    painPoint:
      "A pod runs as root. Its service account can list secrets across the namespace. The base image was pulled from an unofficial registry three releases ago and hasn't been scanned since. Meanwhile the cluster is CIS-non-compliant in seven places nobody has flagged. Every one of those is fine on its own — until an attacker gets shell access on that pod.",
    mechanism: [
      "Onam connects to EKS, AKS, GKE, ECS, and self-managed clusters via read-only Kubernetes RBAC or the equivalent cloud service integration.",
      "The engine evaluates cluster, node, and workload configuration against CIS Kubernetes Benchmark plus Onam's cloud-native container rules.",
      "Container images referenced by running workloads are scanned for CVEs in base and application layers, correlated with EPSS and CISA KEV.",
      "Pod-level analysis flags privileged containers, host mounts, root users, missing security contexts, and over-scoped service accounts.",
      "Findings feed the same attack-path graph as posture and identity, so a vulnerable image on a pod with a permissive service account shows up as one prioritised risk.",
    ],
    whatYouGet: [
      "Image vulnerability scanning — CVEs in base and app layers",
      "Kubernetes CIS benchmark — cluster, node, RBAC",
      "Service account privilege analysis",
      "Pod security analysis — privileged containers, host mounts, root users",
      "Network policy coverage",
      "Registry security — pull policies, unsigned images, image age",
      "ECS task definition security",
      "Runtime anomaly indicators",
    ],
    faqs: [
      {
        q: "Which Kubernetes distributions are supported?",
        a: "EKS, AKS, GKE, OpenShift, Rancher, and self-managed clusters (kubeadm, kops). ECS Fargate and EC2-based ECS clusters are covered separately. Coverage focuses on the control plane, node configuration, workloads, and RBAC — the same regardless of distribution.",
      },
      {
        q: "Do I need to install anything inside my clusters?",
        a: "No. Onam uses a read-only service account to enumerate cluster state and workloads. Image scanning is done by fetching image layers from the registry — the platform is fully agentless.",
      },
      {
        q: "What does the CIS Kubernetes Benchmark cover?",
        a: "The CIS Kubernetes Benchmark defines ~120 controls across the control plane (etcd, API server, scheduler), worker nodes, RBAC, pod security policies, and audit logging. Onam maps findings to the specific control ID so evidence exports directly to the framework.",
      },
      {
        q: "How does container image scanning work?",
        a: "The engine identifies every image referenced by running workloads, resolves image digests, and inspects each layer for OS packages and application dependencies. Vulnerabilities are matched against NVD, EPSS, and CISA KEV, so the queue is ranked by exploitability, not just CVSS.",
      },
    ],
    related: [
      { label: "Vulnerability Management", href: "/platform/vulnerability" },
      { label: "Network Security", href: "/platform/network-security" },
      { label: "CSPM", href: "/platform/cspm" },
    ],
  },

  vulnerability: {
    demoClips: ["cwpp", "scan"],
    icon: Bug,
    iconColor: csmGreen,
    label: "Vulnerability Management",
    question: "Which CVEs in my environment actually matter?",
    headline: "Your scanner found 4,000 CVEs. Maybe 40 are actually reachable. We show you which 40.",
    metaDescription:
      "Vulnerability prioritisation with EPSS, network reachability and CISA KEV, so you fix the CVEs most likely to be exploited, not the top CVSS score.",
    sub: "EPSS probability, network reachability, and CISA KEV status combined — so you fix the CVEs most likely to be exploited in your specific environment, not just the highest CVSS number.",
    painPoint:
      "Your monthly vulnerability report has 4,127 findings. Two teams spend the sprint on the highest CVSS numbers — most of which are on internal hosts that can't be reached, or in libraries that never load. The one that actually gets exploited is a mid-CVSS bug in a public-facing service that nobody flagged as reachable. Prioritisation by score alone punishes teams and misses breaches.",
    mechanism: [
      "Onam builds an SBOM for every workload by inspecting container images, EC2 AMIs, Lambda packages, and serverless dependencies through read-only APIs.",
      "Each package is matched against NVD, then enriched with EPSS probability, CISA KEV membership, and Onam's exploit intelligence.",
      "Network reachability from the internet — and from internal identities — is joined onto every finding, so unreachable CVEs are down-ranked.",
      "The priority queue ranks vulnerabilities by real exploitability in your environment, not by CVSS alone.",
      "Remediation guidance identifies the exact upgrade version that closes the CVE, and links to affected workloads for one-ticket cleanup.",
    ],
    whatYouGet: [
      "SBOM generation for every workload",
      "EPSS-enriched prioritisation",
      "KEV integration — CISA Known Exploited Vulnerabilities flagged",
      "Network reachability correlation",
      "Container image scanning",
      "Lambda/serverless dependency coverage",
      "OS-level findings across your EC2 fleet",
      "Remediation guidance — exact upgrade version",
    ],
    faqs: [
      {
        q: "What's the difference between CVSS and EPSS, and which should I prioritise?",
        a: "CVSS scores potential severity; EPSS estimates the probability that a CVE is exploited in the wild in the next 30 days. Neither alone is enough — CVSS says how bad it could be, EPSS says how likely, and reachability says whether it applies to you. Onam ranks on all three together.",
      },
      {
        q: "Does vulnerability scanning require an agent on each host?",
        a: "No. Onam inspects images, AMIs, Lambda packages, and dependency manifests via read-only cloud APIs. There is nothing to install on hosts.",
      },
      {
        q: "What is the SBOM output format, and can I export it?",
        a: "SBOMs are generated in CycloneDX (and SPDX on request). Export is available per workload or as a fleet-wide bundle for supply-chain audit or regulator submission.",
      },
      {
        q: "What is the CISA KEV list and why does it matter?",
        a: "The Known Exploited Vulnerabilities list, published by CISA, tracks CVEs that are actively exploited in the wild. A CVE on KEV is not theoretical — it is happening. Onam flags KEV findings distinctly so response teams can act on them ahead of the general queue.",
      },
    ],
    related: [
      { label: "Container Security", href: "/platform/container-security" },
      { label: "Network Security", href: "/platform/network-security" },
      { label: "Threat Detection", href: "/platform/threat-detection" },
    ],
  },

  "ai-code-fix": {
    hideDemo: true,
    stats: [
      { v: "1 pass", l: "per file" },
      { v: "Branch", l: "never your main" },
      { v: "None", l: "auto-merges" },
      { v: "Never", l: "Git token stored" },
    ],
    risk: {
      title: "The cost of a backlog",
      body: "A finding that is known but not fixed is still exposed. Every week it waits is a week an attacker can use it — and an auditor can ask why.",
      tagline: "Fixes proposed as code, reviewed by your team",
    },
    ctaWhere: "on your code",
    ctaLine: "We will run a scan and a fix on a repository you choose, and walk your team through the branch it produces.",
    demoClips: ["scan", "dashboard"],
    icon: Wand2,
    iconColor: emerald400,
    label: "AI Code Fix",
    question: "Who actually rewrites the code once the scanner has flagged it?",
    headline: "The scanner says what is wrong. AI Code Fix writes the corrected file and hands it to you on a branch.",
    sub: "AI Code Fix takes the findings from a completed code scan, rewrites each affected source file with a large language model, and commits the result to a separate branch for your team to review, test and merge.",
    painPoint:
      "A code scan reports a hardcoded password on line 47 of a configuration file. The finding is correct, the rule explains the safe pattern, and the ticket still sits for weeks — because someone has to open the file, work out how this codebase reads its configuration, make the change without breaking the import next to it, and push it. Multiply that by every finding in the scan and the backlog is not a knowledge problem. It is a typing problem nobody has time for.",
    mechanism: [
      "Fixing runs on demand against a completed code scan. You choose which severities to include, and findings your team has already marked as false positives are left out.",
      "The engine makes a shallow clone of the scanned repository using a Git token passed with that request only. The token is never written to the database or the logs, and is removed from the clone's configuration after the push.",
      "Findings are grouped by file. For each file, a large language model receives the whole file, every finding in it, and the rule's guidance — what the issue is, how to fix it, and a safe example in the same language where the rule library has one. If a rule has no guidance on record, the scanner's own message is used instead.",
      "The model is instructed to fix only the listed issues and to keep the rest of the file — indentation, names, imports and style — exactly as it was. It returns the complete corrected file, so several findings in one file are fixed in one coherent pass rather than as separate line edits.",
      "Corrected files are written back only if they already exist inside the repository, then committed to a new fix branch and pushed. Nothing is merged and nothing is deployed: your normal pull-request review and CI run before any of it reaches your main branch.",
    ],
    whatYouGet: [
      "Corrected files, not advice — the full rewritten file for each affected path",
      "One pass per file — every finding in a file fixed together, with the surrounding code in view",
      "Rule-guided fixes — the rule's recommendation and a language-matched safe example go to the model with each finding",
      "A separate fix branch — your main branch is never written to",
      "Per-finding status — fixed and committed, fix generated, failed or skipped, with the reason",
      "Severity filter — fix the critical and high findings first and leave the rest for later",
      "False positives respected — findings your team dismissed are not touched",
      "Token handling — the Git token is used for one request and never stored or logged",
    ],
    faqs: [
      {
        q: "How do we start a fix run?",
        a: "Today AI Code Fix is run with you on request: you choose a completed scan and the severities to include, supply a Git token for that run, and the fix branch appears in your repository. It is not yet a button in the console. In the console, every code finding already carries rule guidance and an AI fix prompt you can copy into your own assistant.",
      },
      {
        q: "Does AI Code Fix merge or deploy anything?",
        a: "No. It pushes a new branch and stops. It does not open or merge a pull request and does not trigger a deploy — a developer reviews the diff, runs the test suite and merges through your normal process.",
      },
      {
        q: "Which findings can it fix?",
        a: "Source files flagged by static analysis (SAST). It does not write tests, does not generate infrastructure-as-code patches and does not fix findings from testing a running application (DAST) — those have no source file to rewrite.",
      },
      {
        q: "Is my source code sent anywhere?",
        a: "Yes, and it is worth knowing before you turn it on. To produce a fix, the full content of each affected file is sent to a large language model. Only files that have findings are sent, and the repository clone is deleted when the run finishes.",
      },
      {
        q: "What access does it need to my repository?",
        a: "A Git token that can read the repository and push a branch to it. The token travels in a request header for that run only; it is never part of the request body, never written to the database and never logged. Repository addresses must use HTTPS, and private network and cloud metadata addresses are refused.",
      },
      {
        q: "Who can start a fix run?",
        a: "Only users whose role allows them to start scans. Read-only roles cannot trigger it, and every request is written to an audit log with who asked, for which scan and which repository.",
      },
      {
        q: "What if the generated fix is wrong?",
        a: "Treat it as a proposed change from a fast colleague, not a verdict. Onam does not compile or test the rewritten file — your pipeline does that on the branch. The fix sits on its own branch, so a wrong fix costs a review comment and a deleted branch. The scan that runs after you merge confirms whether the finding actually closed.",
      },
    ],
    related: [
      { label: "Onam Code Security", href: "/platform/code-security" },
      { label: "Remediation & Auto-Fix", href: "/platform/remediation" },
      { label: "AI Assistant", href: "/platform/ai-assistant" },
      { label: "What is code security?", href: "/learn/code-security" },
    ],
  },

  risk: {
    demoClips: ["risk", "compliance"],
    icon: TrendingUp,
    iconColor: pink400,
    label: "Risk Quantification",
    question: "What does your current cloud attack surface actually cost if it is breached?",
    headline: "CVSS scores tell you severity. FAIR tells you the dollar amount on the table.",
    metaDescription:
      "Cloud risk quantification with FAIR: Onam turns technical misconfigurations into financial exposure estimates your board can act on.",
    sub: "Onam's Risk engine applies the FAIR model to every finding — converting technical misconfigurations into business-language financial exposure estimates your board can act on.",
    painPoint:
      "Security is asking for two more headcount and a bigger tooling budget. The CFO asks: what does that spend actually prevent? Nobody has a number. A wall of 12,000 CVEs and a stack of CVSS scores is not an answer a board can approve. Without dollar-denominated risk, security lives on a hunch — and hunches lose budget fights every year.",
    mechanism: [
      "Every finding in the Onam graph is scored using the FAIR (Factor Analysis of Information Risk) model — the open standard for quantitative risk analysis, published by The Open Group as O-RT and O-RA.",
      "FAIR states exposure as Loss Event Frequency × Loss Magnitude, which produces an Annualized Loss Expectancy — a dollar figure per year of exposure, not a proprietary score between 0 and 100.",
      "Loss estimates combine primary loss (response, downtime) with secondary loss (regulatory fines, brand impact) sized to your industry and data sensitivity.",
      "Magnitude is built from named, external inputs — a published per-record breach cost, a data-sensitivity multiplier, and the strictest applicable regime — so an auditor can follow the arithmetic instead of trusting a black box.",
      "Regulatory exposure is projected against the frameworks that apply to your data — GDPR, HIPAA, PCI-DSS, SOX — using published fine bands, not hand-waved multipliers.",
      "Crown-jewel multipliers weight findings that touch high-value assets, so a public bucket over customer PII scores very differently from a public bucket in dev.",
      "Blast radius comes from the security graph rather than an assumption: a finding that sits on an attack path to a large sensitive store is priced above the identical finding on a resource that reaches nothing.",
      "The engine ranks remediations by dollar exposure reduced per engineering hour — so the security queue and the business case are the same list.",
    ],
    whatYouGet: [
      "FAIR model scoring — dollar-denominated primary and secondary loss per finding",
      "Regulatory fine projection (GDPR, HIPAA, PCI-DSS, SOX)",
      "Blast radius quantification",
      "Risk reduction ranking — most dollar exposure reduced per engineering hour",
      "Crown jewel risk multipliers",
      "Trend analysis over time",
      "Executive risk dashboard — board-ready top-10 by dollar value",
      "Compliance cost mapping",
      "Inspectable inputs — every figure traces back to a published benchmark times named multipliers, so it can be challenged",
    ],
    chips: [
      "Open FAIR (O-RT / O-RA)", "Loss Event Frequency", "Loss Magnitude", "Annualized Loss Expectancy",
      "IBM Cost of a Data Breach", "Verizon DBIR", "Crown-jewel multipliers", "Blast radius",
      "GDPR", "HIPAA", "PCI-DSS v4", "SOX",
    ],
    faqs: [
      {
        q: "What is the FAIR model and why does Onam use it?",
        a: "FAIR (Factor Analysis of Information Risk) is the open standard for quantitative cyber risk, published by The Open Group as the O-RT (Risk Taxonomy) and O-RA (Risk Analysis) standards. It decomposes risk into loss event frequency and loss magnitude, each with defensible ranges, and complements the largely qualitative treatment in ISO/IEC 27005. It is the language boards and CFOs already use for other business risk — so Onam speaks it too.",
      },
      {
        q: "How is the dollar figure actually built?",
        a: "From named inputs rather than a black box: a published per-record breach cost for your industry, a multiplier for how sensitive the exposed data is, the strictest regulatory regime that applies, and the blast radius the security graph computes for that specific resource. Multiply through and you get annualized exposure. Because every input is visible, it can be challenged and retuned — which is exactly how a credible risk number should behave.",
      },
      {
        q: "Are the figures shown in a demo my numbers?",
        a: "No — any figure in a demo or a sample model is illustrative. Real numbers are computed against your environment once accounts are connected, using your data footprint, jurisdictions, and crown jewels. Quantification produces a defensible estimate for prioritisation and board reporting, not a prediction of what a specific future breach will cost.",
      },
      {
        q: "How accurate are the dollar estimates?",
        a: "FAIR produces ranges, not point estimates — every number is expressed as a distribution with confidence bounds. Onam parameters are seeded from industry breach data (IBM Cost of a Breach, Verizon DBIR) and can be tuned with your own incident history for better fit.",
      },
      {
        q: "Do I need to provide financial data about my company?",
        a: "For a baseline, no — industry defaults for your sector, data footprint, and jurisdictions are used. Adding revenue, customer count, and past incident costs sharpens the estimate but is optional.",
      },
      {
        q: "How does risk quantification integrate with the rest of Onam?",
        a: "Every posture, identity, network, data, code, and attack-path finding automatically receives a FAIR score. The queue can be sorted by dollar exposure instead of severity, and executive dashboards roll up per business unit, per cloud, or per crown-jewel program.",
      },
    ],
    related: [
      { label: "What is cloud risk quantification?", href: "/learn/cloud-risk-quantification" },
      { label: "What is a choke point?", href: "/learn/choke-point" },
      { label: "Attack Path Analysis", href: "/platform/attack-path" },
      { label: "Compliance", href: "/platform/compliance" },
      { label: "CSPM — Posture", href: "/platform/cspm" },
      { label: "CDR — Detection", href: "/platform/cdr" },
    ],
  },

  compliance: {
    demoClips: ["compliance", "dashboard"],
    icon: CheckSquare,
    iconColor: emerald400,
    label: "Compliance",
    question: "Am I ready for my next audit — right now, not in 3 weeks?",
    headline: "Your auditor wants evidence. We have it ready before they ask.",
    metaDescription:
      "Continuous compliance: Onam maps every security finding to 78 compliance frameworks in real time, so you see today's posture, not last quarter's.",
    sub: "Onam maps every security finding to 78 compliance frameworks in real time. You always know your exact posture — not where you were last quarter, where you are today.",
    painPoint:
      "The auditor arrives on Monday. Your team spent last week screenshotting console pages and stitching evidence into a spreadsheet. Meanwhile prod deployed 40 new resources — none of which are in the evidence pack. The gap between what you can prove and what is actually running is where audits fail and remediation plans balloon.",
    mechanism: [
      "Every finding across every Onam engine is tagged with the specific controls it satisfies or violates across 78 frameworks, in real time.",
      "A per-framework posture score is maintained continuously, so you always know exactly which controls you are meeting today, not last quarter.",
      "Evidence is generated automatically per control — resource state, configuration, timestamps, and the underlying finding — no manual screenshots.",
      "Auditor-ready exports produce PDF and CSV bundles with linked evidence, and can be scoped by framework, cloud, or business unit.",
      "Exceptions and accepted risks are tracked with justifications and expiry, so suppressed findings never disappear silently from the audit trail.",
    ],
    whatYouGet: [
      "One-click auditor export — PDF and CSV with finding evidence attached",
      "Exception management with justification",
      "Remediation roadmap per framework",
      "Control mapping matrix — findings that violate multiple frameworks at once",
      "Real-time per-framework posture score",
    ],
    chips: [
      "CIS AWS v2", "CIS Azure", "CIS GCP", "NIST 800-53", "ISO 27001", "PCI-DSS v4",
      "HIPAA", "GDPR", "SOC 2", "FedRAMP", "CIS K8s", "MITRE ATT&CK", "CSA CCM v4",
    ],
    faqs: [
      {
        q: "How does evidence collection work — do I need to export anything manually?",
        a: "No. Evidence is collected continuously by the same read-only integrations that power the rest of the platform. When you generate an audit export, Onam bundles the resource state, configuration snapshot, and finding history per control — no screenshots required.",
      },
      {
        q: "Which frameworks are supported, and what versions?",
        a: "CIS AWS v2.0, CIS Azure v2.0, CIS GCP v2.0, CIS Kubernetes v1.9, NIST 800-53 Rev 5, ISO 27001:2022, PCI-DSS v4.0, HIPAA, GDPR, SOC 2 (2017 TSC), FedRAMP Moderate/High, MITRE ATT&CK for Cloud, and CSA CCM v4.0. Framework updates roll out within 30 days of publication.",
      },
      {
        q: "What happens to suppressed findings in compliance reports?",
        a: "Suppressed findings remain in the audit trail with the justification and expiry. Exports separately list active findings, suppressed findings with justification, and control coverage — so auditors see the complete picture including accepted risks.",
      },
      {
        q: "How often is the compliance posture score updated?",
        a: "Continuously. New findings, remediations, and configuration changes flow into the score within minutes — there is no scheduled recompute and no daily-refresh gap between reality and report.",
      },
      {
        q: "Can I export a report an auditor can review directly?",
        a: "Yes. PDF exports are auditor-formatted with framework, control ID, evidence, and finding history for each control. CSV exports feed GRC platforms directly. Both are scoped to whatever combination of framework, cloud, and business unit you choose.",
      },
    ],
    related: [
      { label: "CSPM — Config rules", href: "/platform/cspm" },
      { label: "IAM Security", href: "/platform/iam" },
      { label: "Data Security", href: "/platform/data-security" },
    ],
  },

  technology: {
    demoClips: ["onboard", "assets"],
    icon: Layers,
    iconColor: slate400,
    label: "Technology Engine",
    question: "What technology is actually running in my cloud?",
    headline: "Shadow IT and forgotten services are everywhere. Let's find yours.",
    metaDescription:
      "Technology posture: discover the runtime stack (databases, OSes, web servers, container runtimes, appliances) and check each against its own CIS benchmark.",
    sub: "The technology engine discovers the actual runtime stack across your fleet — databases, operating systems, web servers, container runtimes, network appliances and SaaS platforms — and holds each one to the CIS benchmark written for that specific product, not to a generic cloud rule.",
    painPoint:
      "The CMDB says you run PostgreSQL and Nginx. Reality: three teams run Redis 4 that hit EOL in 2020, one team pinned Node 12 in a legacy Lambda, and a forgotten instance is running an outdated Elasticsearch open on port 9200. Every one of those has known exploits, and none of them are in your asset inventory.",
    mechanism: [
      "Onam probes running workloads through cloud metadata, container image inspection, and process metadata — read-only, no agents.",
      "The engine identifies the technology running on each workload and evaluates it against the CIS benchmark for that specific product — 34 of them, from PostgreSQL and Nginx to RHEL, Docker, Cisco IOS XE and VMware ESXi.",
      "Each detected technology is checked against version-specific security rules covering defaults, hardening, and end-of-life status.",
      "Findings are joined to the identity, network, and vulnerability graph so an EOL database that is internet-reachable ranks appropriately.",
      "New technologies and versions are added continuously as they appear in customer environments — so shadow IT is discovered without a rule-writing sprint.",
    ],
    whatYouGet: [
      "Runtime technology inventory — what's actually running, not what was deployed",
      "Version currency analysis",
      "End-of-life detection",
      "Default configuration checks (databases, web servers, frameworks)",
      "34 CIS technology benchmarks — named products, not vague categories",
      "8,991 technology control rows across those benchmarks",
      "Shadow IT surface area",
      "Technology risk scoring",
    ],
    faqs: [
      {
        q: "What's the difference between Technology Engine and CSPM?",
        a: "CSPM checks cloud-provider configuration — is a bucket public, is an RDS encrypted. Technology Engine goes one layer deeper: given that you run PostgreSQL 12 on that instance, is the version supported, are the defaults hardened, and does it end-of-life next quarter. Together they cover both the cloud and what runs on top of it.",
      },
      {
        q: "Which technologies are covered?",
        a: "34 CIS benchmarks, grouped into nine families. Databases: PostgreSQL, MySQL, MariaDB, MongoDB, Cassandra, Oracle DB, SQL Server, IBM Db2. Operating systems: RHEL, Ubuntu, Debian, CentOS, SUSE. Web and application servers: Nginx, Apache HTTP, IIS, Tomcat, WebSphere. Containers and virtualisation: Docker, VMware ESXi. Network appliances: Cisco ASA, Cisco IOS XE, Cisco IOS XR, Cisco NX-OS, Palo Alto, FortiGate, Check Point. SaaS and DevOps: Microsoft 365, SharePoint, Google Workspace, Dynamics 365, Snowflake, GitLab.",
      },
      {
        q: "Does the Technology Engine need agents?",
        a: "No. Detection uses cloud metadata, image inspection, and read-only process metadata — the same integrations that power the rest of Onam.",
      },
      {
        q: "Is this the same as running the CIS benchmark for PostgreSQL by hand?",
        a: "It is that benchmark, evaluated continuously and joined to the rest of the graph. Running it by hand gives you a point-in-time report for one host. Here the same controls run across every instance of that technology in the fleet, and each finding carries whether the workload is internet-reachable and what identity it holds — so an unhardened database on an isolated subnet and one behind a public load balancer do not rank the same.",
      },
      {
        q: "How does shadow IT detection work?",
        a: "By enumerating what is actually running instead of what was formally provisioned, the engine surfaces workloads that appear in no CMDB, no Terraform module, and no team ownership record. Those workloads receive owner-suggestion signals based on tags, IAM, and network neighbours.",
      },
    ],
    related: [
      { label: "Vulnerability Management", href: "/platform/vulnerability" },
      { label: "Container Security", href: "/platform/container-security" },
      { label: "Database Security", href: "/platform/database-security" },
      { label: "SaaS Security (SSPM)", href: "/platform/saas-security" },
      { label: "CSPM", href: "/platform/cspm" },
      { label: "Onam Estate — the assets underneath", href: "/estate" },
    ],
  },

  "saas-security": {
    demoClips: ["dashboard", "compliance"],
    icon: Blocks,
    iconColor: violet400,
    label: "SaaS Security (SSPM)",
    question: "Who can reach your data in Microsoft 365, Google Workspace, and GitHub?",
    headline: "Your CSPM stops at the cloud account. Your attackers don't.",
    sub: "SaaS Security posture management extends the same rule graph to the platforms your company actually runs on — Microsoft 365, Google Workspace, GitHub, GitLab, Snowflake, SharePoint, Dynamics 365 and Okta — with 433 CIS Benchmark rules across six SaaS benchmarks.",
    painPoint:
      "A cloud posture tool will tell you an S3 bucket is public. It will say nothing about the SharePoint site shared with 'anyone with the link', the Microsoft 365 global admin without MFA, the stale Google Workspace guest account from a contractor who left in 2023, or the Snowflake service account holding ACCOUNTADMIN. These are the accounts attackers actually compromise — and on most platforms they are simply invisible.",
    mechanism: [
      "Each SaaS platform is connected through a dedicated read-only connector — Microsoft Graph with OAuth 2.0, Google Admin SDK with service-account impersonation, Snowflake private-key JWT, GitHub and GitLab app tokens.",
      "Discovery enumerates tenants, users, admin roles, sharing settings, audit-log configuration, and data-exposure surfaces without any agent or browser extension.",
      "Findings are evaluated against 433 CIS rules — Microsoft 365 (130), GitLab (122), Google Workspace (89), Snowflake (39), SharePoint (37) and Dynamics 365 (16).",
      "SaaS findings write into the same findings model as cloud findings, so a SaaS identity risk and a cloud identity risk appear in one queue rather than two consoles.",
      "Because identity is shared, an Okta or Entra ID account that federates into AWS is traced through to the cloud permissions it unlocks on the attack-path graph.",
    ],
    whatYouGet: [
      "SaaS tenant inventory — every user, admin, guest, and service account across connected platforms",
      "MFA and conditional-access gaps on privileged SaaS accounts",
      "External sharing exposure — SharePoint, OneDrive and Google Drive links open to anyone",
      "Audit-log configuration checks — M365 Unified Audit Log, GWS retention, Snowflake QUERY_HISTORY",
      "DevOps platform posture — GitHub and GitLab org settings, branch protection, token hygiene",
      "Data warehouse posture — Snowflake roles, network policies, and grant sprawl",
      "CIS Benchmark scoring per SaaS platform with per-control evidence",
      "Stale and orphaned SaaS identity report",
    ],
    faqs: [
      {
        q: "Which SaaS platforms does Onam support today?",
        a: "Microsoft 365, SharePoint, Google Workspace, GitHub, GitLab, Snowflake, Dynamics 365, and Okta. Each is a read-only connector using the platform's official API. Adding a platform is a connector plus a rule pack, so the list grows without changes to how you consume findings.",
      },
      {
        q: "Is this a separate product from CSPM?",
        a: "No. SaaS findings land in the same findings model, the same severity scale, and the same compliance mapping as cloud findings. That is the point — an M365 admin without MFA and an over-privileged AWS role are the same class of risk, and they belong in one queue.",
      },
      {
        q: "What permissions does a SaaS connector need?",
        a: "Read-only application permissions scoped to directory, audit and configuration data — for example Microsoft Graph Directory.Read.All and AuditLog.Read.All. Connectors never request write scopes and never read message or document contents.",
      },
      {
        q: "How is SSPM different from CIEM?",
        a: "CIEM resolves effective permissions inside cloud providers. SSPM evaluates the configuration and identity posture of SaaS applications. They meet on the identity graph: a federated identity provider is where a SaaS compromise turns into cloud access, and Onam models that hop explicitly.",
      },
    ],
    related: [
      { label: "What is SSPM?", href: "/learn/sspm" },
      { label: "Technology Engine", href: "/platform/technology" },
      { label: "CIEM — Identity risk", href: "/platform/ciem" },
      { label: "Compliance frameworks", href: "/platform/compliance" },
    ],
  },

  cwpp: {
    demoClips: ["cwpp", "dashboard"],
    icon: Server,
    iconColor: emerald400,
    label: "CWPP — Workload Protection",
    question: "Are the workloads actually running in production hardened?",
    headline: "Posture tells you how a workload was configured. CWPP tells you what it is running.",
    sub: "Cloud Workload Protection covers every compute form factor you run — virtual machines, containers, serverless functions and managed hosts — scored on one workload posture model, and collected without installing a single agent.",
    painPoint:
      "Configuration scanning sees an EC2 instance with a sensible security group and calls it healthy. It cannot see the unpatched OpenSSL inside the AMI, the root-owned SSH key baked into the image, the container running as privileged, or the Lambda with an outdated runtime. The workload is where the exploit actually lands, and it is the layer most posture tools never open.",
    mechanism: [
      "Workload discovery inventories every VM, container, serverless function and managed host across all seven supported clouds via read-only APIs.",
      "The agentless scanner takes point-in-time volume snapshots inside your own account and analyses them out-of-band, so no software runs on the workload itself.",
      "Each workload is evaluated against the compute and workload rule set — 219 dedicated posture rules — plus operating-system CIS benchmarks for Ubuntu, RHEL, SUSE, Debian and CentOS.",
      "Vulnerability, container image, and host signal data is joined onto the same workload record, so one view shows configuration, packages, and exposure together.",
      "Workload health rolls up into a single CWPP pillar score that trends over time and feeds the unified CNAPP score.",
    ],
    whatYouGet: [
      "Unified workload inventory — VMs, containers, serverless, and hosts in one list",
      "Per-workload posture score with severity-ranked findings",
      "OS hardening results against CIS benchmarks for five Linux distributions",
      "Package and vulnerability inventory collected without agents",
      "Privileged and root-running workload detection",
      "Runtime exposure — which workloads are internet-reachable",
      "Serverless posture — runtime versions, execution roles, and environment secrets",
      "CWPP pillar score trending, feeding the platform-wide CNAPP score",
    ],
    faqs: [
      {
        q: "Do I need to install an agent for CWPP?",
        a: "No. Workload data is collected agentlessly using snapshot-based scanning that runs inside your own cloud account. There is no daemon, no sidecar, and no kernel module — and therefore no performance impact on production workloads.",
      },
      {
        q: "How is CWPP different from Container Security?",
        a: "Container Security focuses on the container-specific layer: images, registries, Kubernetes clusters and admission policy. CWPP is the umbrella across every compute form factor — including the VMs and serverless functions that are not containers at all. They share the same underlying findings.",
      },
      {
        q: "What counts as a workload?",
        a: "EC2 and equivalent virtual machines, container workloads on EKS/AKS/GKE/OKE/ACK, serverless functions such as Lambda and Azure Functions, and managed hosts. Each is discovered automatically — you do not maintain a workload list by hand.",
      },
      {
        q: "How current is workload data?",
        a: "Workload inventory refreshes on every discovery cycle. Snapshot-based deep scans run on a schedule you control, because they consume snapshot capacity in your account; most teams run them daily for production and weekly elsewhere.",
      },
    ],
    related: [
      { label: "What is CWPP?", href: "/learn/cwpp" },
      { label: "Agentless Scanning", href: "/platform/agentless" },
      { label: "Container Security", href: "/platform/container-security" },
      { label: "Vulnerability Management", href: "/platform/vulnerability" },
    ],
  },

  agentless: {
    demoClips: ["scan", "onboard"],
    icon: Radar,
    iconColor: cyan,
    label: "Agentless Scanning",
    question: "How do you scan every workload without deploying anything?",
    headline: "Nothing to install. Nothing to maintain. Nothing running in production.",
    sub: "Onam scans workloads using point-in-time volume snapshots orchestrated inside your own cloud account with native services — AWS Step Functions, Azure Logic Apps and GCP Workflows. Your data never leaves your environment, and no software ever runs on the workload being scanned.",
    painPoint:
      "Agent rollouts are where security programmes go to die. Every agent needs a package, a version, a rollout plan, an exception list for the machines that break, and a renewed argument with the platform team every quarter. Six months in, coverage sits at 60%, the uncovered 40% is the legacy estate that most needs scanning, and nobody can say which is which.",
    mechanism: [
      "Onam assumes a read-only role and enumerates the volumes attached to every workload across your accounts.",
      "A snapshot is created and analysed by a short-lived scan worker that runs inside your own account — orchestrated by AWS Step Functions, Azure Logic Apps, or GCP Workflows depending on the cloud.",
      "Results are relayed through a storage bucket in your account; raw disk contents are never transferred to Onam. Only structured findings leave your environment.",
      "A capacity manager per cloud throttles concurrent snapshots so scanning never competes with production for quota or IOPS.",
      "Snapshots are deleted automatically once analysis completes, and a reconciler sweeps orphaned artefacts so nothing is left behind or billed.",
    ],
    whatYouGet: [
      "100% workload coverage without a deployment project",
      "Package and OS inventory from every scanned volume",
      "Vulnerability detection against the workload's real installed software",
      "Host configuration signals — users, keys, services, and hardening state",
      "Secrets and credential discovery on disk",
      "Zero production impact — no agent, no CPU, no memory, no kernel module",
      "Automatic snapshot cleanup with orphan reconciliation",
      "Per-cloud capacity controls so scanning respects your quotas",
    ],
    faqs: [
      {
        q: "Does my data leave my cloud account?",
        a: "No. Snapshot analysis runs inside your own account and results are relayed through a bucket you own. Onam receives structured findings — package lists, configuration signals, finding records — never raw disk images or file contents.",
      },
      {
        q: "Which clouds support agentless scanning?",
        a: "AWS, Azure, GCP, OCI, IBM Cloud and Alibaba Cloud, each using that provider's native orchestration and snapshot primitives with a dedicated capacity manager.",
      },
      {
        q: "Will snapshots increase my cloud bill?",
        a: "Marginally and briefly. Snapshots are point-in-time, incremental, and deleted as soon as analysis finishes. A reconciler sweeps for orphaned snapshots so a failed scan cannot leave storage accruing cost.",
      },
      {
        q: "Is anything lost compared to an agent?",
        a: "Snapshot scanning is point-in-time, so it does not provide continuous runtime process telemetry. That gap is covered by the CDR engine, which reads cloud-native audit and flow logs for behavioural detection — again with no agent.",
      },
    ],
    related: [
      { label: "What is agentless cloud security?", href: "/learn/agentless-cloud-security" },
      { label: "CWPP — Workload Protection", href: "/platform/cwpp" },
      { label: "Vulnerability Management", href: "/platform/vulnerability" },
      { label: "CDR — Detection & Response", href: "/platform/cdr" },
    ],
  },

  "api-security": {
    demoClips: ["network", "dashboard"],
    icon: Webhook,
    iconColor: pink400,
    label: "API Security",
    question: "Which of your APIs are exposed, unauthenticated, or unmonitored?",
    headline: "Every API gateway you forgot about is still accepting requests.",
    sub: "API Security discovers every API surface across your clouds — gateways, load-balanced endpoints, function URLs and ingress routes — and evaluates them against 241 application and API posture rules, then correlates them with runtime detection signals.",
    painPoint:
      "APIs multiply faster than anything else in a cloud estate. A team ships an API Gateway for a prototype, wires it to a Lambda, disables the authoriser 'just for testing', and moves on. Two years later it is still public, still unauthenticated, still has no WAF, still has no logging — and it is the single cheapest way into your account. Nobody removed it because nobody knew it existed.",
    mechanism: [
      "Discovery enumerates API surfaces across AWS, Azure, GCP, OCI, Alibaba and Kubernetes — API Gateway, App Gateway, Apigee, function URLs, ALB/NLB listeners and ingress resources.",
      "Each endpoint is evaluated against 241 application and API security rules covering authentication, authorisation, throttling, WAF association, TLS policy and logging.",
      "Endpoints are cross-referenced with the network graph so an API that is technically protected but reachable through an open path is treated as exposed.",
      "A CDR enricher joins runtime signals onto each endpoint — so an unauthenticated API that is also seeing anomalous request volume is escalated rather than queued.",
      "Shadow and orphaned APIs — endpoints with no recent traffic or no owning tag — are flagged for decommissioning.",
    ],
    whatYouGet: [
      "Complete API inventory across every cloud and cluster",
      "Unauthenticated and open-endpoint detection",
      "WAF coverage gaps on internet-facing APIs",
      "TLS and cipher policy validation per endpoint",
      "Rate limiting and throttling configuration checks",
      "API access logging and monitoring coverage",
      "Shadow API detection — endpoints nobody owns",
      "Runtime correlation — API posture joined to live CDR detection signals",
    ],
    faqs: [
      {
        q: "Does Onam send traffic to my APIs to test them?",
        a: "Not as part of posture scanning. API Security reads configuration through read-only cloud APIs. Active testing against running endpoints is handled separately by the DAST scanner in the Code Security engine, which you point at targets explicitly.",
      },
      {
        q: "Does this cover APIs running inside Kubernetes?",
        a: "Yes. Ingress resources, services of type LoadBalancer, and gateway API objects are discovered alongside cloud-native gateways, so a cluster-hosted API is inventoried the same way a managed one is.",
      },
      {
        q: "How do you find APIs nobody documented?",
        a: "Discovery works from cloud resource state rather than from your API catalogue or an OpenAPI spec. If the endpoint exists in the account, it is inventoried — which is precisely how shadow APIs surface.",
      },
      {
        q: "What is the overlap with Network Security?",
        a: "Network Security answers whether a path exists to a resource. API Security answers whether the endpoint at the end of that path authenticates, throttles, logs, and terminates TLS correctly. Both run on the same graph, so the combined finding is one story, not two alerts.",
      },
    ],
    related: [
      { label: "Network Security", href: "/platform/network-security" },
      { label: "Code Security", href: "/platform/code-security" },
      { label: "CDR — Detection & Response", href: "/platform/cdr" },
    ],
  },

  "database-security": {
    demoClips: ["datasec", "dashboard"],
    icon: HardDrive,
    iconColor: orange400,
    label: "Database Security",
    question: "Are your databases encrypted, private, audited, and backed up?",
    headline: "The database is where the breach gets expensive.",
    sub: "Database Security evaluates every managed and self-hosted database across your estate — RDS, Aurora, Azure SQL, Cloud SQL, DynamoDB, Redshift, OCI DB Systems and more — against 310 storage and database posture rules, plus CIS benchmarks for the database engines themselves.",
    painPoint:
      "Nobody intends to leave a database public. It happens because a read replica inherits a subnet group nobody reviewed, or a snapshot gets shared to make a staging refresh easier and never gets unshared, or audit logging was on in the original instance but not the one restored from backup. Each step was reasonable. The result is a production database with customer data and a path in from the internet.",
    mechanism: [
      "Every database resource is discovered across AWS, Azure, GCP, OCI, IBM Cloud, Alibaba and Kubernetes through read-only APIs.",
      "Cloud-level posture is evaluated against 310 storage and database rules — encryption at rest and in transit, public accessibility, backup retention, deletion protection, and audit configuration.",
      "Engine-level hardening is evaluated against CIS benchmarks for the database software itself: PostgreSQL, MySQL, MariaDB, MSSQL, Oracle, IBM Db2, MongoDB and Cassandra.",
      "Database findings are joined with the labels DSPM assigns from metadata, so a public or unencrypted database labelled as holding PII is raised to critical, above the same misconfiguration on a scratch database.",
      "Each database gets a posture score across six domains — access control, encryption, network, audit logging, backup and recovery, and configuration — so the weakest area is visible at a glance.",
    ],
    whatYouGet: [
      "Complete database inventory — managed services and self-hosted engines",
      "Encryption coverage at rest and in transit, per instance",
      "Public accessibility and network exposure detection",
      "Snapshot and backup exposure — including snapshots shared outside your account",
      "Audit logging configuration against CIS engine benchmarks",
      "Backup retention and point-in-time recovery compliance",
      "Privileged database account and grant review",
      "Sensitivity-weighted ranking — databases holding regulated data ranked first",
    ],
    faqs: [
      {
        q: "Does Onam connect to my databases and run queries?",
        a: "For cloud posture, no — everything comes from cloud control-plane APIs. Engine-level CIS benchmark evaluation is optional and uses a read-only database account you provision explicitly if you want that depth.",
      },
      {
        q: "Which database engines are covered by CIS benchmarks?",
        a: "PostgreSQL, MySQL, MariaDB, Microsoft SQL Server, Oracle Database, IBM Db2, MongoDB and Cassandra, alongside the cloud-native database posture rules.",
      },
      {
        q: "How is this different from Data Security (DSPM)?",
        a: "DSPM answers what data you hold, where, and how exposed it is, across every kind of store — buckets, databases, streams and more. Database Security goes deep on databases specifically: engine hardening, backup posture, network placement and authentication. The labels DSPM assigns raise the severity of database findings, so the two reinforce each other.",
      },
      {
        q: "Are self-hosted databases on VMs covered?",
        a: "Yes, when you onboard them as technology accounts with a database credential. They are then evaluated against the same CIS engine benchmarks, and their database and schema names feed DSPM classification.",
      },
    ],
    related: [
      { label: "Data Security (DSPM)", href: "/platform/data-security" },
      { label: "DSPM docs — databases", href: "/docs/dspm/coverage" },
      { label: "Encryption & Key Management", href: "/platform/encryption" },
      { label: "CIEM — Who has access", href: "/platform/ciem" },
    ],
  },

  encryption: {
    demoClips: ["datasec", "compliance"],
    icon: Lock,
    iconColor: yellow,
    label: "Encryption & Key Management",
    question: "Is everything actually encrypted — and who can decrypt it?",
    headline: "Encryption at rest is meaningless if the wrong principal holds the key.",
    sub: "The encryption engine evaluates 502 secrets and key-management rules across every cloud — KMS, Key Vault, Cloud KMS and OCI Vault — then answers the questions that matter more than the checkbox: who a key policy lets in, and whether your most sensitive data sits behind a key you control.",
    painPoint:
      "Your compliance report says 100% encryption at rest. It is technically true and nearly useless. The bucket is encrypted with an AWS-managed key that every principal in the account can use. The key that protects your customer database has no rotation policy and a key policy with a wildcard principal. A certificate on your main load balancer expires in nine days. 'Encrypted' passed the audit; none of this did.",
    mechanism: [
      "Every key, vault, secret and certificate is discovered across AWS KMS, Azure Key Vault, GCP Cloud KMS, OCI Vault and their equivalents.",
      "A coverage analyzer walks the resource inventory and identifies which resources are unencrypted, encrypted with provider-managed keys, or encrypted with customer-managed keys.",
      "Key policies are parsed for wildcard principals, other accounts and grants, so a key that more than its owners can use is flagged — and each key is mapped to the resources that depend on it, so the impact of disabling or deleting it is known before anyone does.",
      "Certificate inventory tracks issuer, algorithm, and expiry across ACM and equivalent services, with lead-time alerting before expiry.",
      "Rotation state, deletion protection, and key-material origin are checked against 502 secrets and key-management rules mapped to CIS, NIST and PCI-DSS controls.",
      "DSPM labels are joined in: sensitive data on an unencrypted store is critical, sensitive data on a provider-managed key is high, and changes between scans — encryption removed, rotation switched off, a key scheduled for deletion — are caught as drift.",
    ],
    whatYouGet: [
      "Encryption coverage report — unencrypted, provider-managed, and customer-managed, per resource",
      "Key policy reach — wildcard principals, other accounts and grants on every key",
      "Sensitive-data cross-check — DSPM-labelled stores that are unencrypted or on provider-managed keys",
      "Key blast radius — the resources that depend on each key",
      "Encryption drift — encryption removed, rotation disabled or a key scheduled for deletion since the last scan",
      "Key rotation compliance and overdue rotation alerts",
      "Certificate inventory with expiry lead-time warnings",
      "Secrets manager posture — rotation, versioning, and access scope",
      "In-transit enforcement gaps — TLS policy on endpoints and load balancers",
      "Framework mapping for encryption controls across CIS, NIST 800-53 and PCI-DSS v4",
    ],
    faqs: [
      {
        q: "Can Onam see my key material or decrypt my data?",
        a: "No. The engine reads key metadata and policy through read-only APIs — algorithm, rotation state, policy document, and expiry. It never requests decrypt permission and never handles key material or plaintext.",
      },
      {
        q: "Why does customer-managed vs provider-managed matter?",
        a: "A provider-managed key is usable by a broad set of principals in the account and its policy is not yours to control. For regulated data, most frameworks expect a customer-managed key with an explicit policy and a rotation schedule. The coverage report separates the two so the distinction is visible rather than hidden behind one 'encrypted' flag.",
      },
      {
        q: "How far ahead are certificate expiries flagged?",
        a: "Certificates are tracked continuously with escalating severity as expiry approaches, so renewal work surfaces weeks ahead rather than as an outage.",
      },
      {
        q: "Does this cover secrets in code or environment variables?",
        a: "Secrets in source code and IaC are detected by the Code Security engine, and secrets on disk are found by agentless scanning. This engine covers the managed key and secret services themselves. All three write to the same findings model.",
      },
    ],
    related: [
      { label: "Data Security (DSPM)", href: "/platform/data-security" },
      { label: "DSPM docs — encryption and residency", href: "/docs/dspm/exposure-and-residency" },
      { label: "Database Security", href: "/platform/database-security" },
      { label: "Compliance frameworks", href: "/platform/compliance" },
    ],
  },

  "ai-assistant": {
    demoClips: ["dashboard", "attack"],
    icon: Bot,
    iconColor: csmPurple,
    label: "AI Assistant",
    question: "Can I just ask what my security posture looks like?",
    headline: "Ask a question. Get an answer grounded in your actual findings.",
    sub: "The AI assistant is a multi-agent system with thirteen domain specialists — IAM, compliance, encryption, containers, network, CDR, risk, vulnerability, data security and more — each able to query your real findings rather than guess from a document.",
    painPoint:
      "The answer to 'which of our production databases are exposed to the internet and hold customer data' exists in your platform. Getting it out means knowing which console to open, which filters to combine, and how the data model joins databases to classification to network reachability. So the question gets asked in Slack, someone spends forty minutes on it, and the next person asks it again next month.",
    mechanism: [
      "An orchestrator interprets your question and routes it to the domain specialists that can answer it — often several at once for a cross-domain question.",
      "Each specialist queries your live findings through the same APIs the console uses, scoped to your tenant and your permissions.",
      "Answers cite the findings they were derived from, so every claim links back to the specific resource, rule, and severity behind it.",
      "Cross-domain questions are composed from multiple specialists — an exposure question joins network, data, and identity results into one answer.",
      "The assistant reads; it does not change your cloud. Remediation is proposed as a reviewable action, never executed silently.",
    ],
    whatYouGet: [
      "Natural-language querying across every engine's findings",
      "Thirteen domain specialists — IAM, compliance, encryption, database, container, network, CDR, risk, threat, vulnerability, data security, AI security, and findings",
      "Cited answers — every claim links to the underlying finding",
      "Cross-domain synthesis in a single question",
      "Tenant-scoped and permission-scoped — the assistant sees only what you can see",
      "Attack path explanation in plain language",
      "Remediation guidance drawn from the finding's own remediation record",
      "Read-only by design — no silent changes to your environment",
    ],
    faqs: [
      {
        q: "Is my security data used to train a model?",
        a: "No. Your findings are used to answer your questions within your tenant and are not used as training data.",
      },
      {
        q: "Can the assistant change my cloud configuration?",
        a: "No. It is read-only. It can explain a finding and surface the remediation the platform already generated, but applying a fix goes through the normal remediation workflow with human approval.",
      },
      {
        q: "How accurate are the answers?",
        a: "Answers are generated from queries against your real findings rather than from a general model's recollection, and each answer cites the findings behind it — so you can verify any claim by following the link. Where the data does not support an answer, the assistant says so instead of estimating.",
      },
      {
        q: "Can it see other tenants' data?",
        a: "No. Every specialist query is scoped to your tenant and to your user's permissions, using the same authorisation path as the console.",
      },
    ],
    related: [
      { label: "Remediation & Auto-Fix", href: "/platform/remediation" },
      { label: "Attack Path Analysis", href: "/platform/attack-path" },
      { label: "Risk Quantification", href: "/platform/risk" },
    ],
  },

  remediation: {
    demoClips: ["dashboard", "scan"],
    icon: Wrench,
    iconColor: csmGreen,
    label: "Remediation & Auto-Fix",
    question: "How do findings actually get fixed instead of just counted?",
    headline: "A finding without a fix is just a well-formatted complaint.",
    sub: "The remediation engine generates the specific fix for each finding — CLI command, Terraform snippet, or — for SAST findings in source code — a fix branch pushed to your repository — and explains why it matters in language an engineer will act on.",
    painPoint:
      "Security tools are very good at producing findings and very bad at producing outcomes. The queue grows, the dashboard turns red, and the engineering team receives a ticket saying 'S3 bucket policy is overly permissive' with a link back to the tool. Nobody disagrees that it should be fixed. It does not get fixed, because turning that sentence into a correct change against a specific bucket in a specific account is the actual work, and the tool left it undone.",
    mechanism: [
      "Every finding carries a remediation record generated for that specific resource — not a generic knowledge-base article.",
      "Cloud misconfigurations produce an exact CLI command, a Terraform snippet matching your resource, or console steps.",
      "SAST findings in source code are handled by AI Code Fix, which rewrites the affected file and pushes the change to a separate fix branch in the repository the finding came from, for your team to review and merge.",
      "Vulnerability findings produce a version-targeted upgrade path, checked against the dependency graph so the suggested bump does not break a transitive constraint.",
      "A threat narrative generator explains the finding as an attack story — what an attacker gains, and what the fix removes — so prioritisation conversations are about impact rather than severity labels.",
    ],
    whatYouGet: [
      "Per-resource remediation for every finding — CLI, Terraform, or console steps",
      "Pull-request generation for code and IaC findings",
      "Version-targeted dependency upgrade paths for vulnerabilities",
      "Threat narratives explaining attacker impact in plain language",
      "Bulk remediation for findings sharing a root cause",
      "Suppression workflow with justification and expiry for accepted risk",
      "Remediation tracking — what was fixed, by whom, and when",
      "Verification on the next scan that the fix actually landed",
    ],
    faqs: [
      {
        q: "Does Onam apply fixes to my cloud automatically?",
        a: "Not without your explicit action. The platform connects with read-only credentials by default and generates remediation for you to review and apply. Automated application is opt-in, per finding type, and always leaves an audit trail.",
      },
      {
        q: "How do code fixes reach my repository?",
        a: "For SAST findings in source code, AI Code Fix commits the corrected files to a separate fix branch and pushes it to the source repository; you open the pull request and your normal review and CI process applies. Nothing merges itself.",
      },
      {
        q: "What if a fix would break something?",
        a: "Remediation is a proposal, not an action. Dependency upgrades are checked against the dependency graph before being suggested, and every remediation shows the resource and blast radius it affects so you can judge before applying.",
      },
      {
        q: "How do I know a fix worked?",
        a: "The next scan re-evaluates the resource against the same rule. Findings close on evidence rather than on someone marking a ticket done, and reopened findings are flagged as regressions.",
      },
    ],
    related: [
      { label: "AI Assistant", href: "/platform/ai-assistant" },
      { label: "AI Code Fix", href: "/platform/ai-code-fix" },
      { label: "Vulnerability Management", href: "/platform/vulnerability" },
    ],
  },

  inventory: {
    demoClips: ["assets", "scan"],
    icon: Boxes,
    iconColor: blue400,
    label: "Asset Inventory & Discovery",
    question: "What do you actually run — across every cloud, in one list?",
    headline: "You cannot secure what nobody has counted.",
    sub: "The discovery engine is the foundation every other engine reads from: continuous, read-only enumeration of every resource across seven clouds and 549 services, with the relationships between them modelled as a graph.",
    painPoint:
      "Ask three teams how many cloud accounts the company has and you will get three numbers. The spreadsheet is a year old, the tagging standard was adopted by two of nine teams, and the account someone opened for a proof of concept in 2022 is still running, still billed, and still has a production database in it. Every security control you own applies only to the resources you know about.",
    mechanism: [
      "Discovery enumerates every resource across AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud and Kubernetes — 549 services in total — using read-only credentials.",
      "Each resource is normalised into a shared model, so an AWS security group and an Azure network security group are comparable objects rather than two vendor formats.",
      "Relationships are modelled explicitly — which instance sits in which subnet, which role is assumed by which function, which volume is attached where — forming the graph that attack-path analysis walks.",
      "Discovery runs continuously, so new resources appear in inventory within minutes of creation and deleted resources are retired rather than lingering.",
      "Every other engine reads from this inventory, which is why a resource cannot be evaluated by one engine and invisible to another.",
    ],
    whatYouGet: [
      "Unified inventory across seven clouds and 549 services",
      "Normalised resource model — comparable objects across providers",
      "Relationship graph — the dependency map attack paths are computed on",
      "Continuous refresh with new-resource detection in minutes",
      "Untagged, unowned and orphaned resource reports",
      "Multi-account and multi-subscription rollup in one view",
      "Resource history — what changed, and when",
      "Coverage reporting — which accounts and regions are actually being scanned",
    ],
    faqs: [
      {
        q: "How many services does discovery cover?",
        a: "549 services across seven providers — 123 on AWS, 95 on Azure, 71 on GCP, 68 on Alibaba Cloud, 68 on Kubernetes, 63 on IBM Cloud and 61 on OCI. Coverage expands with each rule-catalogue release.",
      },
      {
        q: "Does discovery need write access?",
        a: "No. Enumeration uses read-only IAM roles, service principals, or service accounts. The platform stores a role reference rather than long-lived keys.",
      },
      {
        q: "How quickly does a new resource appear?",
        a: "Typically within minutes. Discovery runs continuously rather than on a nightly batch, which is what makes same-day misconfiguration detection possible.",
      },
      {
        q: "Can I query the inventory programmatically?",
        a: "Yes. Inventory is available through the REST API with the same normalised model the console uses, so it can feed a CMDB, a data warehouse, or your own tooling.",
      },
    ],
    related: [
      { label: "CSPM — Misconfigurations", href: "/platform/cspm" },
      { label: "Attack Path Analysis", href: "/platform/attack-path" },
      { label: "Technology Engine", href: "/platform/technology" },
    ],
  },

  cnapp: {
    demoClips: ["dashboard", "compliance"],
    icon: ShieldHalf,
    iconColor: brand400,
    label: "CNAPP",
    question: "What is our overall cloud security posture, in one number?",
    headline: "Seven pillars. One score. No spreadsheet required.",
    sub: "CNAPP is the unified view across everything Onam runs — CSPM, CIEM, CWPP, DSPM, network, threat and AppSec — each scored as a pillar, rolled into a single posture score that a board can read and an engineer can drill into.",
    painPoint:
      "Every security tool reports its own number. Posture says 74. The vulnerability scanner says 12,000 open CVEs. The compliance tool says 88% CIS. The identity tool says 400 over-privileged roles. None of them are wrong and none of them combine, so the answer to 'are we getting better' becomes a quarterly slide someone assembles by hand from four exports.",
    mechanism: [
      "Each of the seven pillars — CSPM, CIEM, CWPP, DSPM, network, threat and AppSec — is scored from the findings its engines produced, on a common 0–100 scale.",
      "Pillar scores are weighted by severity and by exposure, so a critical finding on an internet-reachable resource moves the score more than the same finding on an isolated one.",
      "Scores roll into one overall posture score with a risk band, trended over time so improvement is measurable rather than asserted.",
      "Every score decomposes — click a pillar to see the findings behind it, click a finding to see the resource and the remediation.",
      "Because all pillars read the same findings model, the same resource is never counted twice or scored inconsistently between views.",
    ],
    whatYouGet: [
      "One posture score with a risk band, trended over time",
      "Seven pillar scores — CSPM, CIEM, CWPP, DSPM, network, threat, AppSec",
      "Severity- and exposure-weighted scoring rather than raw finding counts",
      "Full decomposition — score to pillar to finding to resource",
      "Trend analysis showing whether posture is improving or degrading",
      "Executive reporting that does not require manual assembly",
      "Per-account and per-environment score breakdown",
      "Consistent scoring across every engine on one findings model",
    ],
    faqs: [
      {
        q: "How is the posture score calculated?",
        a: "Each pillar scores its own findings on a 0–100 scale weighted by severity and by exposure, and those pillar scores roll into an overall score with a risk band. The calculation is transparent — every score decomposes to the findings behind it.",
      },
      {
        q: "Is CNAPP a separate product I buy?",
        a: "No. It is the unified view over the engines you already run. There is nothing extra to deploy — connecting a cloud account populates the pillars automatically.",
      },
      {
        q: "Why does my score move when I did not change anything?",
        a: "Because your environment changes. New resources are discovered continuously, and a newly deployed misconfigured resource lowers the score the same day it appears. Score history shows exactly which findings caused a movement.",
      },
      {
        q: "Can I compare scores across accounts or business units?",
        a: "Yes. Scores break down per account, per subscription, and per environment, which is how most teams drive accountability without arguing about whose findings belong to whom.",
      },
      {
        q: "Do Onam Estate and Onam FinOps appear in the CNAPP score?",
        a: "No, deliberately. CNAPP scores security posture. Estate is the inventory of record and FinOps is cost and commitment management — both are separately entitled products, and folding a cost figure into a security score would make the number mean nothing. They share the same discovery and the same console; they do not share a score.",
      },
    ],
    related: [
      { label: "What is CNAPP?", href: "/learn/cnapp" },
      { label: "CSPM — Misconfigurations", href: "/platform/cspm" },
      { label: "CIEM — Identity & entitlements", href: "/platform/ciem" },
      { label: "DSPM — Data security posture", href: "/platform/data-security" },
      { label: "CWPP — Workload protection", href: "/platform/cwpp" },
      { label: "Risk Quantification", href: "/platform/risk" },
      { label: "Compliance frameworks", href: "/platform/compliance" },
    ],
  },
};
