export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  body?: string; // markdown-ish plain content is rendered by the article page
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "onam-vs-wiz-orca-prisma-cloud",
    title: "Onam vs. Wiz vs. Orca vs. Prisma Cloud: how to actually evaluate a cloud security platform",
    category: "Buyer's Guide",
    excerpt:
      "Wiz, Orca Security, and Prisma Cloud dominate every CSPM shortlist. Here are the seven questions that actually separate platforms — with Onam's answers on the record, and a checklist to run against every vendor on your list.",
    author: "Onam Security Team",
    date: "July 20, 2026",
    readTime: "9 min",
    body: `
If you're evaluating cloud security platforms in 2026, your shortlist probably reads: Wiz, Orca Security, Palo Alto Prisma Cloud — and maybe us. All three are mature, well-funded products with broad ecosystems, and if a vendor tells you their competitors are bad products, stop trusting that vendor.

So this is not that post. Instead, here are the seven questions we believe actually separate cloud security platforms — the ones that predict whether the tool still works for you two years in. We'll give you Onam's answer to each, on the record. Then run the same checklist against every vendor on your shortlist and compare answers side by side.

## The seven questions that separate platforms

### 1. How many clouds get *first-class* treatment?

Every platform says "multi-cloud." The question is which clouds get the full engine depth and which get a check-the-box connector. If you run anything on Oracle Cloud (OCI), Alibaba Cloud, or IBM Cloud — common in finance, manufacturing, and Asia-Pacific enterprises — ask each vendor to demo *those* clouds, not AWS.

**Onam's answer:** all 7 clouds — AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud, and Kubernetes — run the same rules, the same graph, the same attack-path analysis, and the same compliance mapping. No second-tier clouds.

### 2. Is the analysis cross-cloud, or per-cloud silos side by side?

Real attack paths cross boundaries: an exposed GCP service account key that can assume a role into your AWS production account is invisible to any tool that analyses each cloud separately. A dashboard that *displays* seven clouds is not the same as a graph that *correlates* them.

**Onam's answer:** one graph across all clouds and every security layer. Attack-path analysis follows the identity chain wherever it goes — including across cloud providers.

### 3. Agentless — and how long to first finding?

Deployment friction predicts coverage: if connecting an account takes a change-management ticket, half your estate never gets connected. Ask for the exact onboarding steps and the time from connection to first critical finding.

**Onam's answer:** 100% agentless. A read-only IAM role, service principal, or service account connects a cloud in under 3 minutes; we store only a role ARN, never long-lived credentials. First critical alert typically surfaces in under 5 minutes.

### 4. How does it prioritise — severity labels or business impact?

An alert firehose with 4,000 "critical" findings is operationally identical to no prioritisation at all. Ask *how* the platform decides what's first, and whether that reasoning is explainable to your CFO.

**Onam's answer:** FAIR-model risk quantification — findings are ranked by estimated dollar exposure, computed from asset value, exposure, and exploitability, so the top of the queue is defensible in business terms, not just CVSS arithmetic.

### 5. Does it catch toxic combinations across engines?

A public subnet is medium. An over-privileged identity is medium. A workload with a critical CVE is high. The same three on one attack path is a breach waiting to happen. This correlation is the whole point of a unified platform — ask each vendor to show it live.

**Onam's answer:** automated toxic-combination detection across every layer — posture, identity, vulnerabilities, network, data — because everything already lives on one graph.

### 6. Is compliance evidence continuous or point-in-time?

If evidence is generated when you click "export report," you are audit-ready one day per quarter. Ask whether framework mappings update as infrastructure changes.

**Onam's answer:** 78 frameworks — CIS (AWS, Azure, GCP), NIST 800-53, ISO 27001, PCI-DSS v4, HIPAA, SOC 2, and more — with continuous evidence. One finding maps to every framework it affects; auditors get exports, not screenshots.

### 7. Does coverage span code to runtime?

Fixing a misconfiguration in the console while the Terraform that created it stays broken means the finding comes back on the next deploy. Ask whether the platform sees IaC, code, and runtime as one pipeline.

**Onam's answer:** SAST, DAST, SCA, and IaC scanning correlated with runtime findings — so the fix lands where the resource is defined, not just where it's running.

## The checklist, in one table

| Evaluation criterion | Ask every vendor | Onam's answer |
| --- | --- | --- |
| Cloud coverage | Which clouds are first-class? Demo OCI/Alibaba/IBM. | All 7 clouds, same engine depth everywhere |
| Cross-cloud analysis | One graph or per-cloud silos? | Single graph, cross-cloud attack paths |
| Deployment | Agents? Time to first finding? | 100% agentless, < 3 min connect, < 5 min first alert |
| Prioritisation | How is "what's first" decided? | FAIR-model dollar-risk ranking |
| Toxic combinations | Cross-engine correlation, live demo | Automated across every layer |
| Compliance | Continuous or point-in-time evidence? | 78 frameworks, continuous, one-click export |
| Code + runtime | IaC/code linked to runtime findings? | SAST · DAST · SCA · IaC · runtime, correlated |
| Pricing model | Per-resource? Per-engine add-ons? | One platform, no per-engine add-ons |

## Where the big names are genuinely strong

Wiz, Orca, and Prisma Cloud earned their market position: strong products, large integration ecosystems, big security-research teams. If your estate is a single cloud and you have the budget and headcount to operate a large platform, any of them can serve you well.

Onam's bet is different: that the next generation of cloud security is won on **breadth of first-class coverage** (all 7 clouds, not 3), **one graph instead of bolted-together modules**, and **prioritisation a CFO can read**. That's what we built, and it's why teams running more than just the big-three clouds — or teams tired of triaging severity labels — pick us.

The honest way to decide is the checklist above. Run it against all four of us. We'll take our chances.

*Want Onam's answers demonstrated on your own environment instead of a slide deck? [Request a demo](/request-demo) — connecting your first cloud takes about 3 minutes.*
`,
  },
  {
    slug: "cdr-behavioral-threat-detection",
    title: "Beyond GuardDuty: how three-tier behavioral detection catches what rules miss",
    category: "CDR",
    excerpt:
      "Rule-based detection catches known attack signatures. Statistical behavioral baselines catch incremental privilege escalation. ML anomaly detection catches the rest. Here's why you need all three.",
    author: "Onam Security Team",
    date: "July 15, 2026",
    readTime: "10 min",
    body: `
AWS GuardDuty is a good product. It detects known malicious IP addresses, known cryptocurrency mining domains, known port scanning patterns, and a catalogue of documented attack signatures. If an attacker uses infrastructure that has appeared in threat feeds, GuardDuty will catch it.

The problem is that sophisticated attackers do not use infrastructure that appears in threat feeds. They use compromised legitimate accounts, new cloud instances with clean IP addresses, and legitimate cloud services as their command-and-control channel. They operate slowly enough to avoid rate-based anomaly rules. They escalate privileges incrementally — one permission at a time — over days or weeks.

Rule-based detection catches what you already know to look for. The question is how to catch what you do not.

## The three-tier detection architecture

Onam's CDR (Cloud Detection and Response) engine operates on three detection tiers that complement each other. Each tier catches a different class of attacker behavior, and together they close the gaps that any single tier leaves open.

| Tier | Approach | What it catches |
| --- | --- | --- |
| L1 | Rule-based signature detection | Known-bad indicators, documented exploit signatures, SSRF against the metadata service, mining indicators |
| L2 | Statistical behavioral baselines per identity | Legitimate credentials behaving unlike their own history |
| L3 | ML anomaly detection across the environment | Novel techniques and insider threats anomalous at the population level |

**L1 — Rule-based signature detection.** Exactly what GuardDuty does, extended to cover multi-cloud environments — Azure, GCP, OCI, Alibaba Cloud, IBM Cloud — with a single unified alert schema. Rules are mapped to MITRE ATT&CK techniques so each alert comes with context about which phase of the attack chain it represents.

**L2 — Statistical behavioral baseline detection.** For each IAM identity, compute role, and workload in your environment, Onam builds a statistical model of normal behavior. Normal means: which API calls does this identity make, at what time of day, from which IP ranges, in which regions, against which resources? L2 alerts when observed behavior deviates from the baseline beyond a configurable threshold. This catches attackers who are using legitimate credentials and behaving differently from the identity's established pattern.

**L3 — ML anomaly detection.** Where L2 looks at the behavior of individual identities against their own history, L3 looks at behavior across the entire environment and flags anomalies that do not match patterns anywhere in the account. This is particularly effective for detecting novel attack techniques and insider threats — cases where the attacker knows the environment well enough to mimic an individual identity's patterns, but whose behavior is still anomalous at the population level.

![The CDR alert view in the Onam console (demo account)](/screenshots/screenshot-cdr.png)

## How L2 catches what L1 misses: incremental privilege escalation

The canonical example of what L1 cannot detect is incremental privilege escalation. Here is a real pattern observed in cloud intrusions.

**Day 1.** The attacker gains access to a developer's AWS credentials — likely through phishing or an access key committed to a public GitHub repository. The developer's account can read from S3 buckets and invoke Lambda functions. The attacker reads the environment: lists resources, describes IAM policies, maps the account structure. All of these calls are legitimate API operations. No threat intelligence flags fire. GuardDuty sees nothing unusual.

**Day 3.** The attacker notices that the developer's role has \`iam:ListRolePolicies\` and uses it to map roles with elevated permissions. They find a CI/CD role that can deploy CloudFormation stacks. They call \`iam:AssumeRole\` to take on the CI/CD role — a call the developer legitimately makes for manual deployments. No rule fires.

**Day 7.** Using the CI/CD role, the attacker deploys a CloudFormation stack that creates a new IAM role with administrator access. The stack deployment is indistinguishable from legitimate CI/CD activity. The administrator role is now available.

At no point did the attacker trigger a signature-based rule. They used legitimate credentials to call legitimate APIs in a legitimate sequence — just not the developer's usual sequence.

L2 catches this because the behavioral baseline for the developer account shows API call patterns concentrated in us-east-1 between 9am and 6pm on weekdays. The attacker's activity happens at 2am UTC from an unusual IP range, covers nine regions in sequence (consistent with environment mapping), and includes \`iam:ListRolePolicies\` calls the developer has never made before. The deviation score exceeds the threshold on Day 1. By Day 3, the anomaly score has accumulated across multiple sessions and an L2 alert fires with the full session timeline.

## What "normal" means for a cloud identity

Building a behavioral baseline that is specific enough to be useful without generating constant false positives requires care about which signals you model. Onam's L2 baseline captures:

- **API call distribution** — which services and specific operations this identity calls, and in what frequency distribution. A Lambda execution role that calls DynamoDB and Secrets Manager but never touches IAM has a narrow, predictable profile.
- **Temporal patterns** — when the identity makes calls. Human users show strong daytime concentration; scheduled functions fire at consistent intervals. A 9-to-6 identity making calls at 2am is a strong signal.
- **Source IP and ASN patterns** — does this identity always call from the corporate CIDR block, a specific region, or cloud service IP ranges? New source ASNs, especially cloud VPS providers, are anomalous for human users.
- **Region distribution** — most deployments operate in one or two regions. An identity suddenly making calls across six regions in sequence is consistent with discovery behavior.
- **Resource access patterns** — which specific resources the identity touches. A service account that only ever writes to one DynamoDB table suddenly reading a different table is anomalous regardless of what the IAM policy technically allows.

> The baseline window is 30 days by default. New identities get a 14-day warm-up period during which L2 does not alert — it is building the baseline. This prevents false positives during service launches, when an identity's behavior naturally looks anomalous because it has no history.

## MITRE ATT&CK mapping in CDR context

Every CDR alert — regardless of which tier generated it — is tagged with the MITRE ATT&CK techniques it corresponds to. This matters for two reasons.

First, it puts the alert in attack chain context. A single L2 alert for an unusual API call from a new IP is low severity in isolation. But if the same identity triggered an L1 alert for metadata service enumeration two hours earlier, the two alerts together represent Initial Access (T1078.004) followed by Discovery (T1082). The ATT&CK tagging makes this correlation visible in the alert timeline without manual analysis.

Second, it connects CDR findings to posture findings. If your CDR alert is tagged T1548.005 — privilege escalation via role assumption — the posture engine can immediately surface the IAM misconfigurations that made the technique possible: the overly permissive trust policy, the missing condition key on AssumeRole. The CDR alert becomes a force multiplier for CSPM remediation.

## Cross-cloud correlation

Multi-cloud environments create a detection gap that single-cloud tools cannot address: an attacker who compromises an AWS identity can use that access to pivot to Azure or GCP workloads, and no single-cloud detection tool sees the full picture.

A pattern Onam's CDR engine is designed to catch: an attacker compromises AWS credentials and uses them to read Secrets Manager entries that contain Azure service principal credentials — a common pattern in cross-cloud deployments where one provider's secrets manager holds credentials for another. The AWS activity triggers an L2 alert because the identity has never accessed that specific secret. Ten minutes later, the Azure service principal makes unusual RBAC modification calls in Azure. Neither alert in isolation points to a cross-cloud attack. Together, with the 10-minute timestamp correlation, they tell a clear story.

Cross-cloud correlation requires a unified identity model that maps AWS IAM principals, Azure Managed Identities, and GCP Service Accounts into a single graph. Onam builds this model during the discovery phase; CDR alert correlation runs against it to surface cross-cloud attack chains that would be invisible to single-cloud tools.

## What to expect in the first 14 days

The first two weeks of CDR deployment are primarily about baseline calibration and tuning out operational noise.

**Days 1–3.** L1 rules begin firing immediately. The most common early findings are not active threats — they are configuration patterns that look like threats: instances making repeated metadata calls (legitimate credential refresh), Lambda functions calling APIs across regions (legitimate global services), CI/CD pipelines creating IAM roles during provisioning.

**Days 4–7.** Review and tune the L1 false positives. Mark legitimate patterns as suppressed with an expiry date — suppression should never be permanent for a cloud detection rule. The goal is alert volume a human can review in 30 minutes per day.

**Days 8–14.** L2 baselines finish their initial calibration. The first L2 alerts appear — typically flagging maintenance windows, pipelines that run at unusual hours, and identities with legitimate but irregular usage. Each alert requires a decision: suppress (with expiry and owner), investigate, or escalate.

By day 15, alert volume should be manageable and signal quality high enough for a 30-minute daily triage. The value of L3 becomes apparent after 30–60 days, when the model has enough history to distinguish population-level anomalies from operational variance.

> CDR is not a "set it and forget it" product. It requires sustained analyst engagement to tune baselines and investigate alerts. The return on that investment is coverage of the attacker behaviors no signature-based tool can detect — the class of behavior responsible for most significant cloud breaches.

To see the three tiers against your own telemetry, [book a demo](/request-demo).
`,
  },
  {
    slug: "aws-misconfigurations-first-scan",
    title: "The 5 AWS misconfigurations we find in 90% of first scans",
    category: "CSPM",
    excerpt:
      "After thousands of first-time AWS scans, the same five misconfigurations show up in nearly every environment. Here's what they are — and how to fix them fast.",
    author: "The Onam Security Team",
    date: "July 10, 2026",
    readTime: "6 min",
    body: `
## Why the same five keep showing up

Cloud teams move fast, and defaults rarely favor the defender. Across the AWS accounts we onboard, five misconfigurations recur with astonishing consistency — often in accounts operated by teams that consider themselves mature. Each one is easy to introduce, easy to miss, and each one can quietly widen the blast radius of a routine credential leak into a full compromise.

## 1. S3 buckets exposed via bucket policies (not ACLs)

Everyone knows to block public ACLs. Fewer teams audit **bucket policies** that grant \`s3:GetObject\` to \`Principal: "*"\`. The AWS console labels these buckets "Public" only when the policy resource is the bucket itself — not when it's \`arn:aws:s3:::acme-corp-uploads/public/*\`.

- Enable **Block Public Access** at the account level.
- Alert on any new bucket policy statement whose principal is \`*\` or whose condition allows broad IPs.
- Treat any \`s3:*\` grant to \`arn:aws:iam::****4821:root\` from another account as a finding until proven intentional.

## 2. Over-privileged IAM roles attached to EC2

We routinely find \`AdministratorAccess\` on instance profiles that only need to read from one S3 prefix. Combined with an SSRF bug or an exposed metadata endpoint (IMDSv1), that role becomes an admin foothold.

- Enforce **IMDSv2** across the fleet.
- Replace \`*\` policies on instance profiles with least-privilege equivalents generated from IAM Access Analyzer.
- In Onam, this pattern shows up as a red edge in the attack graph the moment a public-facing workload reaches the role.

## 3. Public RDS snapshots

RDS snapshot sharing is a per-snapshot ACL — flipping it to "public" makes the entire database available to any AWS account. Teams do this to move data between environments and forget to revert.

## 4. Security groups with 0.0.0.0/0 on non-web ports

SSH (22), RDP (3389), database ports, and \`ANY\`-protocol rules facing the internet are still the single most common initial-access vector we detect during onboarding. Most are legacy — a rule opened for a demo three years ago on an account no one owns anymore.

## 5. CloudTrail gaps

CloudTrail is either not enabled in every region, not covering S3 data events, or writing to a bucket in the same account with no MFA delete. Any attacker with account-level access rewinds the tape.

## What "fix it fast" actually looks like

Prioritization matters more than volume. Onam's attack-path engine ranks these five findings by **actual reachability from an internet-exposed resource to a crown jewel** — so the SSH-open bastion in front of an admin IAM role beats the internal-only bucket policy every time.

> "Coverage is table stakes. What we sell is the order you fix things in."

If you're onboarding a new AWS org, expect at least three of the five above on day one. That's not a failure of your team — it's the shape of AWS defaults.
`,
  },
  {
    slug: "ciem-vs-iam-security",
    title: "CIEM vs IAM Security: what's actually the difference?",
    category: "Identity",
    excerpt:
      "They sound identical. They aren't. Here's the practical split between IAM Security and Cloud Infrastructure Entitlement Management — and why you need both.",
    author: "The Onam Security Team",
    date: "July 3, 2026",
    readTime: "5 min",
    body: `
## Two acronyms, one confused market

Vendors — us included — throw "IAM Security" and "CIEM" around interchangeably. In practice they answer different questions, and mature security programs run both.

## IAM Security answers: is this identity configured safely?

IAM Security is about the **static shape** of your identity plane:

- Are there IAM users with console access and no MFA?
- Are access keys older than 90 days?
- Are there inline policies with \`Action: "*"\` and \`Resource: "*"\`?
- Are service accounts stored in plaintext anywhere in your repos?

It's essentially a posture check against identity best practices. Every CSPM does some of this. Good ones do a lot of it.

## CIEM answers: what could this identity actually do?

CIEM starts where IAM Security stops. It reconciles **who has which entitlements**, **what those entitlements evaluate to** given every trust policy, permission boundary, and SCP in the chain, and — most importantly — **what was actually used** in the last 90 days.

The output isn't "this user has AdministratorAccess." Every scanner will tell you that. The output is:

- \`user@example.com\` has effective \`s3:PutObject\` on 412 buckets across 3 accounts, but has only ever written to 4 of them.
- \`OnamReadOnly\` in account \`****4821\` is assumable by 17 principals in 6 other accounts through a chain of two roles.
- The service account \`acme-corp-ci\` has never used 91% of its granted permissions since it was created.

That third bullet is where CIEM stops being interesting and starts being urgent. **Unused entitlements are the single largest source of over-privilege in most environments.**

## Where the two overlap

- Detecting IAM users without MFA — IAM Security.
- Detecting an IAM user without MFA whose permissions include \`iam:PassRole\` on an admin role — that's CIEM. IAM Security tells you the user is unsafe. CIEM tells you what it will cost when the user is compromised.

## The rule we use internally

If the finding can be answered by looking at one resource in isolation, it's IAM Security. If it requires stitching together identity, trust, and behavior across accounts, it's CIEM.

You need both. IAM Security keeps the door from being obviously open. CIEM makes sure that if it opens, the blast radius is bounded.
`,
  },
  {
    slug: "ai-powered-cloud-remediation",
    title: "AI-powered cloud remediation: from finding to fix in minutes",
    category: "Engineering",
    excerpt:
      "The average MTTR for cloud security findings is 47 days. AI-powered remediation — context-aware code fixes, Ansible playbooks for CVEs, and threat narratives — is how we close that gap.",
    author: "Onam Security Team",
    date: "June 30, 2026",
    readTime: "8 min",
    body: `
The average mean time to remediate (MTTR) for cloud security findings is 47 days, according to data collected across enterprise cloud programs. That number has not changed meaningfully in five years, despite cloud security tooling improving substantially over the same period.

The tools got better at finding things. The bottleneck was never finding — it was fixing. A security team that surfaces 500 findings per week and has engineering bandwidth to fix 20 will always have an accumulating backlog, no matter how well-tuned the detection is.

AI-powered remediation addresses the bottleneck directly. Not by reducing finding volume — the findings are real and need to be fixed — but by reducing the time between "identified" and "resolved" for each one.

## Why generic LLM suggestions fail

The obvious approach is to pipe findings into a general-purpose LLM and ask it to produce a fix. This works poorly in practice, for a specific reason: cloud security remediation is context-dependent in ways a general LLM cannot know without being told.

Consider a finding: "Lambda function \`payment-processor-prod\` has a role with \`s3:GetObject\` on \`*\`." A generic LLM will suggest: "Restrict the IAM role to only the specific S3 bucket the function needs to access." Technically correct. But which bucket? What is the ARN? Are there multiple buckets? Is the function deployed by Terraform, CloudFormation, or CDK? Is the role shared with other functions?

A context-aware fix engine knows the answers because it has already discovered the Lambda function, its associated role, the S3 buckets it actually accesses (from CloudTrail analysis), the IaC stack that deployed it, and the other resources that share the role. The fix it generates is not generic guidance — it is a specific, deployable policy change with the correct ARN, condition keys, and IaC format.

![AI-assisted remediation in the Onam platform](/diagrams/p-ai-security.svg)

## SecOps Fix: cloud-aware code fixes for misconfigurations

SecOps Fix generates remediation for cloud misconfigurations — the findings that come from CSPM posture evaluation. Each generated fix is context-aware in four dimensions.

| Context | What the fix engine knows |
| --- | --- |
| IAM | The full effective permission set, what is actually used per CloudTrail, and the least-privilege replacement policy |
| Network | Internet exposure, governing security groups, WAF presence, and the exact rule change to make |
| IaC | Whether the resource is managed by Terraform, CloudFormation, CDK, or Pulumi — and the fix in that format |
| Blast radius | Whether the resource is shared with other workloads and whether the change would break a dependency |

For a "port 22 open to 0.0.0.0/0" finding, the fix generates the specific security group rule to remove and, if a VPN CIDR is detected in other rules, suggests the replacement rule scoped to that CIDR. For a CloudFormation-managed S3 bucket without versioning, it generates the CloudFormation properties diff; for a Terraform-managed bucket, the HCL stanza change. The fix can go directly into a pull request.

If a proposed change would affect other workloads sharing the resource, the fix notes this and offers an alternative approach rather than shipping a change that breaks a dependency.

## Vulnerability Fix: Ansible playbooks for CVE remediation

The traditional workflow for CVE remediation in cloud workloads is: CVSS alert appears, security team sends it to DevOps, DevOps writes a runbook, the runbook is reviewed, the runbook is executed. For a team managing hundreds of CVEs per month, the runbook-writing step alone is a significant bottleneck.

Onam's Vulnerability Fix engine generates Ansible playbooks that remediate CVEs without manual runbook writing. For each CVE finding, it:

1. Identifies the affected package and version from the vulnerability scan results.
2. Looks up the target version (the patched release) from the NVD advisory.
3. Generates an Ansible playbook that updates the specific package on the affected host.
4. Includes pre-flight checks (the package exists, the host is the right OS family) and post-flight validation (the patched version is installed).
5. Annotates the playbook with the CVE ID, CVSS score, and KEV status so the audit trail is self-documenting.

The generated playbook is idempotent — running it multiple times produces the same result. It is also scoped to minimum required privilege: it does not request root unless the package manager requires it, and it does not restart services unless the patch requires it.

For container image vulnerabilities, the output is different: instead of an Ansible playbook, it generates a Dockerfile patch that updates the base image or specific package layer, and can open a pull request to the image repository with the change.

## Threat Narratives: attack chain stories for CISOs and boards

The third capability addresses a different kind of bottleneck: communication.

Attack path analysis produces a graph — nodes and edges, resource IDs, MITRE technique codes. This output is precise and actionable for a security engineer. It is impenetrable to a CISO preparing a board presentation or a GRC team filing a regulatory response.

Threat Narratives converts the attack path graph into a natural-language description of the attack chain. Given a graph subpath representing a five-step privilege escalation, the engine generates:

> "An attacker who gains access to the API Gateway endpoint for the **checkout-service** Lambda function can exploit the SSRF vulnerability in the Node.js web framework (CVE-2024-37890) to retrieve temporary credentials from the EC2 Instance Metadata Service. These credentials belong to the **checkout-lambda-exec** execution role, which holds IAM PassRole permission on the **platform-deploy** role. Using this permission, the attacker can create a new Lambda function with the deployment role attached, gaining the ability to read from all S3 buckets in the account — including **customer-data-prod**, which contains 2.3 million customer records. This path combines Initial Access (T1078.004), Credential Access (T1552.005), and Privilege Escalation (T1548.005) into a five-step chain requiring no prior account access."

This narrative can be copied directly into a CISO report, an incident response ticket, or a regulatory filing. It requires no translation by a security engineer. The graph data and the human-readable story are generated from the same source, so they are always in sync.

## Typical MTTR reduction

Measuring the MTTR impact requires separating finding types, because the reduction varies significantly by category.

| Finding type | Before | With AI remediation |
| --- | --- | --- |
| IAM misconfiguration | 4–8 hours of investigation and policy authoring | 15–30 minutes of review and approval |
| OS-level CVE | 1–4 hours of runbook writing per CVE | Near-zero generation, 15 minutes of review |
| Escalation communication | An hour of engineer time per board-ready summary | A 10-minute review of the generated narrative |

Most of the reduction comes from eliminating the investigation phase — the engineer receives a specific, justified change rather than an abstract "reduce scope" recommendation.

## Privacy and safety: no code leaves your VPC

AI remediation generates fixes that reference your specific resource IDs, ARNs, IAM role names, and IaC configurations. These are sensitive artifacts. Sending them to a third-party LLM API is not acceptable for most enterprise cloud programs operating under SOC 2, ISO 27001, or government cloud frameworks.

All fix generation in Onam runs on dedicated model inference endpoints deployed in your cloud environment. The inference endpoint has no outbound internet access — it can only receive API calls from within your VPC and return responses. No cloud configuration data, no resource identifiers, and no generated fix content is transmitted to Onam's infrastructure or to any third-party LLM provider.

This is not a product constraint — it is an architectural requirement. The inference endpoint is part of the security boundary, not outside it.

## Making AI remediation part of the workflow

The most common mistake in AI remediation rollout is treating it as a replacement for security engineering judgment. It is not. Every generated fix requires review before deployment. The AI understands the IaC format, the least-privilege scope, and the resource context — it does not understand your team's operational constraints, your change management process, or the business reasons a particular configuration might be intentional.

> The right workflow is: AI generates, an engineer reviews, an engineer approves, automation deploys. The AI eliminates the generation phase. It does not eliminate the judgment phase — and it should not.

For teams that implement this workflow rigorously, the 47-day MTTR becomes an artefact of the pre-AI era. The remaining cycle time is review, approval, and change management — timelines bounded by process, not by engineer capacity. And process timelines can be shortened through policy, not headcount.
`,
  },
  {
    slug: "attack-path-4000-to-3",
    title: "Attack paths vs. misconfigurations: why toxic combinations are your real cloud risk",
    category: "Attack Path",
    excerpt:
      "Most CSPM tools surface hundreds of misconfigurations. The ones that actually lead to breaches are the ones that chain together — and most tools can't show you which chains are dangerous.",
    author: "The Onam Security Team",
    date: "June 24, 2026",
    readTime: "11 min",
    body: `
The average enterprise cloud account has 400 to 600 CSPM findings at any given time. Security teams triage by severity, work through the Critical queue, and ship patches. Three months later, the finding count is roughly the same. The board asks why the environment is still at risk.

The answer is that severity scores do not tell you which findings actually lead to breaches. They tell you how bad an individual misconfiguration is in isolation. But attackers do not exploit individual misconfigurations in isolation — they chain them together.

> The finding that causes a breach is rarely the most severe finding on your list. It is the one that connects to five other findings in a path that reaches your most critical assets.

## What an attack path actually is

An attack path is a sequence of exploitation steps that an attacker could take to move from an initial foothold to a target resource. Each step in the path exploits a specific misconfiguration or vulnerability. No single step requires extraordinary attacker capability — each one is a logical consequence of the previous.

A typical AWS attack path might look like this:

1. A Lambda function is exposed to the internet via an API Gateway without authentication. An attacker sends a crafted request that triggers an SSRF vulnerability in the application code.
2. The SSRF reaches the EC2 Instance Metadata Service (IMDSv1) and retrieves temporary credentials for the Lambda execution role.
3. The Lambda execution role has \`iam:PassRole\` permission on a deployment role used by the CI/CD pipeline.
4. Using \`iam:PassRole\`, the attacker creates a new Lambda function and assigns the deployment role, giving them pipeline-level permissions.
5. The deployment role has \`s3:GetObject\` on the S3 bucket where customer PII exports are staged for the data warehouse ETL pipeline.

At step one, the attacker is an anonymous internet user. At step five, they are reading customer PII. None of the individual misconfigurations — IMDSv1 enabled, overly permissive execution role, unscoped PassRole — are rated Critical in isolation. Together, they form a breach.

![The attack path view in the Onam console (demo account)](/screenshots/screenshot-attack-path.png)

## Toxic combinations: when 2 + 2 = 10

The term "toxic combination" describes a set of findings that, in combination, produce a risk orders of magnitude larger than the sum of the individual risk scores. The concept has become standard terminology across the CNAPP space — for good reason.

A concrete example: suppose you have an EC2 instance that is internet-facing (a High finding) running a web application with a known CVE in its web framework (a Medium finding). Neither finding is marked Critical. But the CVE provides remote code execution, and the internet-facing exposure means the instance can be reached directly. The combination is Critical — a direct RCE entry point with no network controls in between.

Add one more element: suppose the instance profile grants \`ec2:DescribeInstances\` and \`ssm:SendCommand\` across the entire account. Now the attacker who exploited the CVE can run commands on every EC2 instance in the account. Three Medium/High findings. One account-wide compromise.

## Crown jewel path analysis

Not all attack paths matter equally. A path that reaches a development environment with synthetic test data is not the same as a path that reaches your production payment processor or customer data lake. Crown jewel path analysis starts from the resources you care most about — your crown jewels — and works backwards to find every path that leads to them.

Crown jewels are identified through a combination of:

- **Resource tags** — if your team already tags production databases and PII stores, those tags can automatically designate crown jewels.
- **Data classification signals** — S3 buckets with names matching PII or financial data patterns, RDS instances serving production applications.
- **Manual designation** — security teams can explicitly mark specific resources as crown jewels during onboarding.
- **Risk scoring** — resources that aggregate connections, like databases serving multiple services, score higher automatically.

Once crown jewels are designated, attack path analysis runs a reverse graph traversal: starting from each crown jewel, what resources can reach it, and through what chain of permissions and network paths? The result is a ranked list of paths sorted by likelihood of exploitation and blast radius.

## How Onam implements attack path analysis

Onam's attack path engine is built on a property graph. Every cloud resource — EC2 instances, IAM roles, S3 buckets, Lambda functions, security groups, VPCs, subnets, load balancers — is represented as a node. Relationships between resources are represented as typed edges.

| Edge type | Meaning |
| --- | --- |
| \`CAN_ASSUME\` | One IAM principal can assume another role (the trust policy allows it) |
| \`HAS_PERMISSION\` | An IAM principal has a specific action on a resource |
| \`NETWORK_REACHABLE\` | A resource is network-accessible from another resource or from the internet |
| \`RUNS_ON\` | A workload runs on a compute resource and inherits its instance role |
| \`EXPOSES\` | A load balancer or API Gateway exposes another resource to a broader network scope |

Attack path discovery runs a breadth-first search across this graph, starting from external entry points — internet-accessible endpoints, publicly accessible storage, misconfigured STS endpoints — and traversing the graph to find all reachable crown jewel nodes. Each discovered path is scored using a composite function of:

- Number of hops — shorter paths are higher priority.
- Exploitability of each step — a CVE with a public exploit vs. a step requiring valid credentials.
- Sensitivity of the target resource.
- Whether compensating controls exist along the path — monitoring, WAF, threat detection.

![A privilege escalation chain modeled as a graph of identities and permissions](/diagrams/feat-ciem-privesc-chain.svg)

## MITRE ATT&CK tagging on every path step

Each step in an attack path is tagged with the MITRE ATT&CK technique it represents. This does two things: it grounds the abstract graph traversal in threat intelligence that security teams and CISOs recognize, and it connects your attack path findings to your compliance posture for frameworks like NIST CSF and CIS Controls that reference ATT&CK.

A path step that exploits IMDSv1 to steal credentials is tagged T1552.005 (Unsecured Credentials: Cloud Instance Metadata API). A step that uses \`iam:PassRole\` for privilege escalation is tagged T1548.005. A step that exfiltrates data from S3 is tagged T1530.

This tagging means that when you present an attack path finding to an engineering team, you can say: "This is a five-step privilege escalation path from an internet-exposed Lambda to your production database, using T1078 to T1548 to T1530. Here are the three changes that break the path at step two."

## What to fix first: breaking the chain vs. hardening the target

When you have an identified attack path, you have two remediation strategies. You can harden the target — make the crown jewel harder to access — or you can break the chain: remove a link in the path so the attacker cannot traverse it.

Breaking the chain is almost always the right answer. Hardening the target is valuable — encryption, access logging, strict IAM policies on the database itself — but it does not eliminate the path. If the chain is intact, a sufficiently motivated attacker will find a way to the end.

Finding the optimal break point means identifying the link that:

- Has the lowest remediation cost — a one-line IAM policy change beats a network re-architecture.
- Blocks the most paths simultaneously — a single overly permissive role may appear in a dozen paths.
- Has no compensating control already in place.

> Onam's path analysis surfaces exactly this: for each discovered attack path, it identifies the minimum cut — the smallest set of changes that severs all paths to a given crown jewel.

## Making the case to engineering

The practical challenge in attack path remediation is not technical — it is organisational. A Medium severity finding does not motivate an engineering team to drop their sprint work. An attack path that demonstrates a five-step route from the internet to production customer data does.

Attack path visualisations exist precisely for this reason. When you can show an engineer an interactive graph where each node is a resource they recognise and each edge is a permission they can verify in the AWS console, the remediation priority becomes self-evident. You are not asking them to trust a risk score. You are showing them the exact sequence an attacker would follow.

This is why attack path analysis is not a CSPM feature — it is a communication tool. It translates the abstract language of cloud misconfiguration into the concrete language of "here is how you get breached, here is what to change."
`,
  },
  {
    slug: "fair-model-cloud-risk",
    title: "The FAIR model for cloud security: putting a dollar value on your attack surface",
    category: "Risk",
    excerpt:
      "CVSS scores rank vulnerability severity. FAIR answers the question your board actually cares about: what does this attack surface cost if it's breached? Here's how we apply it at Onam.",
    author: "The Onam Security Team",
    date: "June 17, 2026",
    readTime: "9 min",
    body: `
Every cloud security tool produces a list of findings ranked by CVSS score. Critical findings go to the top of the queue; engineers fix them in order. This approach has an intuitive appeal — surely the highest-severity vulnerability is the most urgent.

The problem is that CVSS measures the exploitability and impact of a vulnerability in isolation. It does not know whether your environment has compensating controls. It does not know whether the vulnerable resource is a developer's test server or your payment processing API. It does not know whether you process ten thousand transactions per day or ten million. Two organisations with identical CVSS scores can face risks that differ by three orders of magnitude.

FAIR — Factor Analysis of Information Risk — is the framework that fills this gap. It does not replace CVSS. It uses it as one input in a model that produces what your board actually cares about: the dollar value of your attack surface.

## The developer server vs. the payment processor

Consider two findings, both rated CVSS 9.1 (Critical):

- An unauthenticated RCE vulnerability in a web framework running on a developer's personal EC2 instance used for feature testing. The instance has no production data and can only be reached from the corporate VPN.
- The same vulnerability in the same web framework running on the API servers that process payment authorisations for your e-commerce platform, directly accessible from the internet.

CVSS says these are equivalent. Any security engineer knows they are not. FAIR makes that difference numerically explicit.

## FAIR fundamentals: frequency times magnitude

FAIR models risk as the product of two variables: Loss Event Frequency — how often will a loss event occur? — and Loss Magnitude — how much will it cost when it does?

Loss Event Frequency has two components:

- **Threat Event Frequency** — how often will a threat actor attempt to exploit this?
- **Vulnerability** — when a threat actor attempts exploitation, what is the probability of success?

Loss Magnitude breaks down into primary and secondary losses:

- **Primary losses** — incident response costs, forensics, data recovery, business downtime.
- **Secondary losses** — regulatory fines, legal liability, reputation damage, customer churn.

The model is probabilistic — each variable is expressed as a range with a confidence interval, and Monte Carlo simulation produces a distribution of annualised loss exposure (ALE) rather than a single point estimate. This is important: it makes uncertainty explicit rather than hiding it behind a precise-looking score.

## How Onam automates FAIR inputs

The traditional objection to FAIR is that it requires too many manual inputs to scale. Estimating threat event frequency for a specific vulnerability in a specific environment has historically required expert judgment for every finding. Onam automates the inputs where data is available.

**Threat probability from KEV and EPSS.** The CISA Known Exploited Vulnerabilities (KEV) catalog identifies vulnerabilities that have been actively exploited in the wild. FIRST's Exploit Prediction Scoring System (EPSS) provides a 30-day probability that a given CVE will be exploited. For a CVE on the KEV list with EPSS above 0.5, we set the threat event frequency high — this is a vulnerability attackers are actively targeting. For a CVE with EPSS below 0.01, the frequency is set low regardless of CVSS score.

**Vulnerability score from compensating controls.** A CVSS 9.1 vulnerability behind a WAF that blocks known exploit patterns is harder to exploit than the same vulnerability with no WAF. A public-facing resource is more vulnerable than one protected by VPN. Onam maps each finding's network exposure, WAF configuration, and authentication state to adjust the vulnerability component of the FAIR model.

**Loss magnitude from industry benchmarks.** IBM Cost of a Data Breach and Ponemon Institute publish per-record breach cost estimates by industry:

| Industry | Cost per exposed record |
| --- | --- |
| Healthcare | $499 |
| Financial services | $183 |
| Retail | $105 |

For a finding that exposes customer PII, Onam uses the record count (or an estimate based on database size), the industry classification, and the data sensitivity tier to compute a baseline loss magnitude.

![Risk quantification in the Onam console (demo account)](/screenshots/screenshot-risk.png)

## Regulatory fine projections

Secondary losses from regulatory exposure are often larger than primary incident response costs. Onam projects three regulatory fine structures for findings that involve personal data:

| Framework | Fine structure |
| --- | --- |
| GDPR | Up to €20M or 4% of global annual revenue, whichever is greater — a €2M cap per incident for a mid-size SaaS company with €50M revenue |
| HIPAA | $1.9M per violation category per year for wilful neglect; settlements for large breaches have reached $16M (Anthem) and $5.5M (Memorial Healthcare System) |
| PCI-DSS | $5,000–$500,000 per month for non-compliance, plus per-transaction liability after a breach; post-breach assessments average $1.2M for mid-tier merchants |

These fine projections are added to the loss magnitude estimate and allocated to each finding that contributes to the regulatory exposure. A single RDS database with unencrypted customer PII carries not just the breach cost of the records it contains, but a proportional share of the potential regulatory liability.

## Crown jewel risk multipliers

Standard FAIR analysis treats all resources of a given type equivalently. Crown jewel analysis applies multipliers that reflect the actual business value of specific resources.

A resource is designated as a crown jewel — and its risk magnitude multiplied — based on:

- Whether it is tagged as production and sensitive.
- Whether it is the endpoint of attack paths that reach other high-value resources.
- Whether it processes financial transactions, health records, or PII at scale.
- Whether it hosts intellectual property — source code, model weights, proprietary datasets.

The multiplier for a crown jewel finding ranges from 2x to 10x the base loss magnitude, depending on how central the resource is to your business operations and the sensitivity of the data it holds.

## Converting a finding list into a ranked remediation queue

The practical output of FAIR analysis is a dollar-ranked remediation queue. Instead of forty Critical findings and eighty High findings sorted by CVSS, you get a ranked list where each item has:

- **Annualised Loss Exposure (ALE)** — expected loss per year if this finding is not remediated.
- **Remediation cost estimate** — person-hours and infrastructure cost to fix.
- **Risk reduction ratio** — ALE divided by remediation cost: the return on security investment.
- **Regulatory exposure** — the portion of ALE attributable to regulatory fine risk.

A finding with ALE of $2.4M and a two-hour fix should be done today. A finding with ALE of $15K and three weeks of re-architecture goes on the backlog. A CVSS 9.1 finding on a development sandbox with ALE of $800 should be closed as accepted risk with a documented exception.

> This reordering often surprises security teams. The highest-ALE finding is rarely the highest-CVSS finding. It is frequently a Medium-severity misconfiguration — an S3 bucket with misconfigured access logging, an RDS instance missing encryption at rest — on a resource that never received attention because its CVSS score never made it to the top of the queue.

## Making the business case to engineering management

Security teams have historically struggled to translate findings into language that resonates with engineering managers and financial stakeholders. "We have a Critical finding" does not answer the question an engineering manager is actually asking: "What is the cost of not fixing this right now compared to shipping the feature we have committed to?"

FAIR makes this conversation tractable. "If this finding is not remediated in the next 30 days, our expected annual loss from this single exposure is $1.8M, of which $600K is attributable to GDPR fine risk. The fix is a two-hour IAM policy change. The return on that two hours is $1.8M in expected loss avoided." That is a conversation an engineering manager can act on.

The goal of FAIR is not to produce a precise dollar figure — the uncertainty ranges in the model make that clear. It is to produce a defensible, data-grounded estimate that turns security prioritisation from an argument about severity scores into a business decision with quantified stakes.
`,
  },
  {
    slug: "kubernetes-rbac-pitfalls",
    title: "Kubernetes RBAC pitfalls that grant cluster-admin by accident",
    category: "Containers",
    excerpt:
      "A ClusterRoleBinding here, an aggregated role there — and suddenly your read-only role can create pods that mount the host filesystem. Six patterns to audit today.",
    author: "The Onam Security Team",
    date: "June 10, 2026",
    readTime: "6 min",
  },
  {
    slug: "epss-over-cvss",
    title: "EPSS over CVSS: prioritising the CVEs attackers actually exploit",
    category: "Vulnerability",
    excerpt:
      "CVSS tells you how bad a vulnerability could be. EPSS tells you how likely it is to be exploited in the next 30 days. Guess which one predicts breaches.",
    author: "The Onam Security Team",
    date: "June 3, 2026",
    readTime: "5 min",
  },
  {
    slug: "why-cloud-iam-permissions-are-never-used",
    title: "Why 90% of cloud IAM permissions are never used — and why that matters",
    category: "Identity",
    excerpt:
      "Your IAM policies are accumulating unused permissions faster than your team can audit them. Here's what the data shows and how to close the gap.",
    author: "Onam Security Team",
    date: "May 28, 2026",
    readTime: "8 min",
    body: `
Every cloud security team has the same conversation at some point: "We have too many IAM policies to audit manually." What they rarely say out loud is that the vast majority of the permissions in those policies have never been used once.

Across the cloud accounts we analyse, **more than 90% of granted IAM permissions are never exercised in a 90-day window.** For AWS, that figure is consistent across account sizes, industries, and engineering team maturity. It is not a failure of individual teams — it is the natural consequence of how cloud IAM actually works in practice.

![The IAM security view in the Onam console (demo account)](/screenshots/screenshot-iam.png)

## How permissions accumulate

Cloud IAM permissions grow through three mechanisms, none of which are intentionally malicious.

**Copy-paste onboarding.** When a new service account or role is needed quickly, engineers copy an existing role and modify it. The source role has permissions that were useful once — a temporary migration, a debugging session, a feature that was later removed. Those permissions carry forward into every derivative role.

**Managed policy breadth.** AWS managed policies like \`AmazonS3FullAccess\` and \`AmazonEC2FullAccess\` cover entire service surfaces. A Lambda function that only reads from one S3 bucket gets full S3 permissions because attaching a managed policy is three clicks and writing a custom policy is forty minutes. The path of least resistance is also the path of least privilege violation.

**Permission creep without cleanup.** Role permissions accumulate as features get added. Nobody removes permissions when features are deprecated. A role that started with five specific permissions in 2022 has thirty by 2026, and the engineers who added the original five have moved to other teams.

## Why unused permissions matter

An unused permission is not harmless. It is a door that does not need to exist. From an attacker's perspective, the difference between a compromised Lambda execution role that can only read from one S3 bucket and one that has full S3 access is the difference between a minor incident and a data breach.

Consider the MITRE ATT&CK technique T1078.004 (Valid Cloud Accounts). When an attacker compromises a service account — through a misconfigured endpoint, a leaked credential in source code, or a supply chain attack — they inherit exactly the permissions that account holds. If that account has permissions it never uses, the attacker has capabilities the account's legitimate owners never intended to grant.

The SolarWinds attack demonstrated this at scale: compromised service accounts with broad cloud permissions allowed lateral movement that would have been impossible with properly scoped access. Every permission that exists but is not needed is a pivot point that should not exist.

## How CIEM measures the gap

CIEM (Cloud Infrastructure Entitlement Management) addresses this by computing the least-privilege gap — the difference between what an identity is permitted to do and what it actually does. The process has three steps.

**1. Effective permission resolution.** Attached policies alone do not tell you what a principal can actually do. Service Control Policies (SCPs) at the organization level can restrict what managed policies allow. Permission boundaries limit IAM users and roles. Resource-based policies on S3 buckets or KMS keys can grant access that is not reflected in identity-based policies. CIEM resolves all of these layers into a single effective permission set.

![How effective permissions are resolved from identity policies, boundaries, SCPs, and resource policies](/diagrams/feat-ciem-effective-perms.svg)

**2. Usage analysis from activity logs.** CloudTrail records every API call made in your AWS account. CIEM reads these logs — or their equivalents on Azure, GCP, and the other supported clouds — and builds a map of which permissions were exercised, by which identity, and when. A permission that appears in the effective permission set but has not appeared in any CloudTrail event in 90 days is flagged as unused.

**3. Least-privilege policy generation.** For each identity with unused permissions, CIEM can generate a suggested replacement policy that contains only the permissions that were actually used. This gives engineers a concrete, actionable change rather than an abstract "reduce permissions" recommendation.

## The numbers in practice

Across accounts we have analysed, the average gap between granted and used permissions breaks down as follows:

| Identity type | Granted permissions unused |
| --- | --- |
| Service accounts (Lambda, ECS, EC2 instance profiles) | 94% |
| Cross-account roles | 91% |
| Human IAM users | 87% |
| Federated identities (SAML, OIDC) | 83% |

The highest gap is consistently in service accounts — the identities most often forgotten after the feature they were created for is deployed and the team moves on to the next thing.

## What to do about it

The goal is not to achieve zero unused permissions immediately. That would require rewriting every IAM policy in your account simultaneously, which is operationally infeasible and will break things. Instead:

**Start with the highest-risk identities.** Shadow admins — identities that can reach admin-level access without holding an admin role — are the highest priority. A service account that can assume a role that can assume another role with \`iam:*\` permissions is a three-hop privilege escalation path. CIEM surfaces these chains; fix them first.

**Enforce for new identities.** The easiest permission to remediate is one that was never granted. Add a review gate to your IAM policy creation process that requires justification for any permission that has not been used in the last 90 days in a similar role. This does not fix existing debt, but it stops new debt from accumulating.

**Automate the generation, not the application.** CIEM can generate least-privilege replacement policies automatically. Do not apply them automatically — have a human review the suggestion for operational correctness before switching. What looks unused over 90 days may be used on a quarterly or annual cycle.

> The cost of a false-positive access removal is a production incident. Generate automatically, apply carefully.

The 90% figure is not a problem you can fix in a sprint. It is a long-running hygiene practice, and the right tool makes continuous progress measurable instead of invisible.
`,
  },
  {
    slug: "mitre-attack-cloud-mapping",
    title: "MITRE ATT&CK for Cloud: mapping real attacks to your posture score",
    category: "Threat Detection",
    excerpt:
      "How MITRE ATT&CK for Cloud translates abstract threat techniques into concrete cloud misconfigurations — and how your posture score tracks each one.",
    author: "Onam Security Team",
    date: "May 20, 2026",
    readTime: "10 min",
    body: `
MITRE ATT&CK for Cloud is a framework that catalogues the tactics, techniques, and procedures (TTPs) that adversaries use to attack cloud environments. It is maintained by MITRE, peer-reviewed by threat intelligence teams at major security vendors, and updated as new cloud attack techniques are observed in the wild.

Most discussions of MITRE ATT&CK treat it as an abstract threat intelligence reference. This post is about something more practical: how individual ATT&CK techniques translate into specific cloud misconfigurations that a CSPM tool can detect and score — and what that means for how you should read your posture score.

## How ATT&CK for Cloud is structured

ATT&CK for Cloud covers four platforms: AWS, Azure, GCP, and Office 365. Each platform has a matrix of tactics (the adversary's goal) and techniques (the method used to achieve that goal).

| Tactic | Adversary goal |
| --- | --- |
| Initial Access | Getting into the environment |
| Execution | Running code |
| Persistence | Maintaining access after the initial foothold |
| Privilege Escalation | Gaining higher-level permissions |
| Defense Evasion | Hiding activity from detection |
| Credential Access | Stealing credentials for further use |
| Discovery | Mapping the environment |
| Lateral Movement | Moving from one resource to another |
| Collection | Gathering data of interest |
| Exfiltration | Removing data from the environment |
| Impact | Disrupting availability or integrity |

## Misconfigurations as enablers

Here is the key insight: most ATT&CK techniques require a precondition — a misconfiguration, gap, or overly permissive setting that the attacker can exploit. CSPM rules are, in effect, precondition detectors. When your posture score flags a finding, it is identifying a configuration that makes a specific technique easier to execute.

![Findings tagged with ATT&CK techniques in the Onam console (demo account)](/screenshots/screenshot-findings.png)

Let us walk through specific examples.

### T1078.004 — Valid Cloud Accounts (Initial Access)

This technique covers attackers using legitimately issued cloud credentials — obtained through phishing, credential stuffing, or exposure in source code — to access cloud resources. The CSPM rules that map to T1078.004:

- IAM access keys not rotated in 90+ days — stale credentials increase the exposure window.
- MFA not enforced on IAM users with console access — reduces the attacker's cost to exploit a credential.
- Long-lived GCP service account keys or Azure service principal secrets not rotated.
- EC2 instance metadata service (IMDSv1) accessible without authentication — credential theft via SSRF.

When your posture score degrades on any of these rules, it means T1078.004 is now easier to execute against your environment.

### T1548.005 — Temporary Elevated Cloud Access (Privilege Escalation)

Attackers with limited initial access use misconfigured IAM role assumption chains to escalate privileges to administrator level. The CSPM rules that map to T1548.005:

- IAM roles with overly permissive trust policies that allow any principal in the account to assume them.
- Service accounts with \`iam:PassRole\` to roles with higher privileges.
- Lambda functions with execution roles that include \`iam:CreatePolicyVersion\`.
- Cross-account trust relationships with external accounts without external ID requirements.

### T1562.008 — Disable Cloud Logs (Defense Evasion)

Before exfiltrating data or moving laterally, sophisticated attackers disable or tamper with logging to reduce the chance of detection. The CSPM rules that map to T1562.008:

- CloudTrail not enabled in all regions — gaps that create blind spots.
- CloudTrail log file validation not enabled — logs can be tampered with undetected.
- S3 buckets holding CloudTrail logs without MFA delete protection — an attacker can delete evidence.
- GuardDuty not enabled — the primary anomaly detection layer is disabled.

### T1530 — Data from Cloud Storage (Collection)

Attackers access cloud object storage that holds sensitive data — customer PII, source code, secrets, financial records. The CSPM rules that map to T1530:

- S3 buckets with public read access — no authentication required.
- S3 buckets without server-side encryption — data accessible in plain text if the bucket policy is bypassed.
- S3 access logging disabled — collection activity leaves no trace.
- Overly permissive IAM policies that grant \`s3:GetObject\` on \`*\` resources.

## How posture score maps to technique coverage

When we assign a posture score to your cloud environment, each rule that contributes to the score is tagged with the ATT&CK techniques it relates to. A score of 87 out of 100 means 13% of your rules are failing — but it also means there is a specific set of ATT&CK techniques whose preconditions are currently satisfied in your environment.

> This framing changes how you should prioritise remediation. A rule failure that maps to T1562.008 (Disable Cloud Logs) or T1078.004 (Valid Cloud Accounts) should be treated more urgently than one mapping to a technique that requires prior compromise of a privileged identity. The first set is accessible with minimal prior access; the second requires steps the attacker has not yet taken.

## Putting it into practice

The practical application of ATT&CK for Cloud is not to implement every mitigation in the matrix simultaneously. It is to use the technique-to-misconfiguration mapping to answer: "If an attacker is already in my environment with basic credentials, which techniques can they execute today?"

Walk through the privilege escalation techniques first. Then defense evasion. Then collection and exfiltration. Fix the rules that open the door to these techniques, and your posture score becomes a leading indicator of how hard your environment is to attack — not just a compliance checkbox.
`,
  },
  {
    slug: "agentless-cloud-security-architecture",
    title: "How we check thousands of rules without agents: the architecture behind Onam",
    category: "Engineering",
    excerpt:
      "A technical deep-dive into how Onam scans dozens of cloud services across 7 clouds using only read-only access — no agents, no network changes, no configuration drift.",
    author: "Onam Security Team",
    date: "May 6, 2026",
    readTime: "10 min",
    body: `
The most common question we get from security engineers evaluating Onam is some variation of: "How can you possibly check thousands of rules across dozens of cloud services without installing anything?"

It is a reasonable question. Most security tools that claim "agentless" operation are either scanning at a shallow level, missing entire service categories, or quietly requiring agents for the rules that actually matter. This post explains exactly how Onam's agentless architecture works across all seven supported clouds — AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud, and Kubernetes — and where its limits are.

## The core principle: cloud control planes are APIs

Everything in a cloud environment has a configuration state. That state is stored and served by the cloud provider's control plane — the management layer that sits above your actual workloads. AWS, Azure, GCP, and the other clouds expose this configuration state through read-only APIs.

An S3 bucket's public access settings, encryption configuration, and lifecycle policy are all returned by \`GetBucketAcl\`, \`GetBucketEncryption\`, and \`GetBucketLifecycleConfiguration\`. A security group's inbound rules are returned by \`DescribeSecurityGroups\`. An IAM user's MFA status is returned by \`GetLoginProfile\` and \`ListMFADevices\`.

Nearly every security configuration that matters can be read from these control plane APIs. That is the foundation of agentless CSPM: Onam connects with a read-only IAM role, service principal, or service account — nothing is installed in your environment.

![Onam's agentless architecture: read-only API access to each cloud control plane](/diagrams/arch-overview.svg)

## How the discovery phase works

Before we can check rules, we need to know what resources exist. The discovery phase enumerates every resource across all configured cloud accounts.

For AWS, this means calling the List/Describe APIs for each service category in each region across every account: \`DescribeInstances\` for EC2, \`ListBuckets\` for S3, \`DescribeDBInstances\` for RDS, \`ListFunctions\` for Lambda, and so on across dozens of service categories. For an account with a couple of thousand resources across five regions, this generates a few hundred API calls.

Discovery output is normalised into a unified resource schema — a standard representation that captures the resource type, region, account, ARN, and all configuration attributes relevant to security evaluation. This normalised schema is what the rule evaluation engine operates against.

![The scan pipeline: discovery, normalisation, rule evaluation, and correlation](/diagrams/arch-scan-pipeline.svg)

## How rule evaluation works

Each rule in Onam's library is a declarative check against one or more attributes in the normalised resource schema. The check returns PASS, FAIL, or NOT_APPLICABLE.

A rule like "S3 buckets must have server-side encryption enabled" evaluates the \`encryption.rules[0].apply_server_side_encryption_by_default.sse_algorithm\` attribute in the normalised S3 bucket schema. If the attribute is present and set to AES256 or aws:kms, the rule passes. If it is absent or set to NONE, it fails.

Rules are authored in YAML — a human-readable format that non-engineers can review. Each rule specifies:

- The resource type it applies to.
- The condition expression that determines PASS or FAIL.
- The severity (Critical, High, Medium, Low, Info) and compliance framework mappings.
- The remediation steps — CLI, Terraform, console.

This YAML-first approach means adding a new rule for a new cloud service does not require changes to the core evaluation engine — just a new YAML file with the right schema.

## Network topology requires cross-resource correlation

Simple single-resource checks — is this bucket encrypted? is MFA enabled for this user? — can be evaluated purely from the resource's own configuration. But effective network exposure — whether a resource is actually reachable from the internet — requires correlating multiple resources.

Determining whether an EC2 instance is internet-accessible requires knowing: is it in a public subnet? Does its subnet's route table have a route to an internet gateway? Do the NACLs on that subnet allow inbound traffic on the relevant port? Does the security group allow inbound traffic from 0.0.0.0/0? Is there a load balancer in front of it?

This is why network security analysis runs as a separate phase after discovery, with access to the full normalised resource graph. The graph allows us to traverse VPC, subnet, route table, and internet gateway relationships and compute effective exposure rather than just checking individual resource configurations.

## Where agentless has limits

Agentless works for everything that lives in the cloud control plane. It does not work for everything, and it is worth being precise about the boundaries.

**OS-level vulnerability scanning** requires enumerating installed packages and kernel versions — information that is not exposed by cloud APIs. For EC2 instances, this requires a lightweight agent, deployed via AWS Systems Manager. Container image scanning, by contrast, can be done agentlessly by pulling and analysing the image from the registry.

**Runtime workload behavior** — what processes are running, what network connections are active, what system calls a container is making — requires an agent or eBPF-based monitor running on the host. CSPM rule evaluation covers the configuration surface; runtime behavior is a different, complementary layer.

**Data plane access patterns** — reading the actual contents of S3 objects, database rows, or file system data — is not something Onam does. Data classification is based on metadata signals: naming patterns, tags, schema metadata, and resource configuration. This is sufficient for most DSPM use cases, but it will not detect sensitive data stored in an unexpectedly named bucket.

## Why agentless matters for security teams

The operational argument for agentless is usually framed around deployment complexity: no agents to install, no software versions to manage, no compatibility issues with operating systems. That is true, but there is a more important argument.

Agents expand your attack surface. An agent running on every EC2 instance in your fleet is a piece of software with elevated privileges that needs to be patched, monitored, and secured. If the agent itself has a vulnerability — and security tool agents have had plenty — every host it runs on is at risk.

> An agentless scanner that never touches your hosts has exactly zero footprint to exploit.

For organisations that operate in regulated environments — healthcare, financial services, government — this is not an abstract concern. It is a compliance question: does this tool expand my system boundary in a way that requires additional controls? Agentless architecture answers that question with a clear no.

To see the scan pipeline against one of your own accounts, [book a demo](/request-demo).
`,
  },
];

export const BLOG_CATEGORIES = Array.from(new Set(BLOG_POSTS.map((p) => p.category)));

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
