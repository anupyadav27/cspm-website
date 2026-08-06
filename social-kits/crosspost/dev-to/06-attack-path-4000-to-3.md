---
title: "Attack paths vs. misconfigurations: why toxic combinations are your real cloud risk"
published: false
description: "Most CSPM tools surface hundreds of misconfigurations. The ones that actually lead to breaches are the ones that chain together — and most tools can't"
tags: cloudsecurity, security, cloud, devops
canonical_url: https://www.onamsecurity.com/resources/blog/attack-path-4000-to-3
---
The average enterprise cloud account has 400 to 600 CSPM findings at any given time. Security teams triage by severity, work through the Critical queue, and ship patches. Three months later, the finding count is roughly the same. The board asks why the environment is still at risk.

The answer is that severity scores do not tell you which findings actually lead to breaches. They tell you how bad an individual misconfiguration is in isolation. But attackers do not exploit individual misconfigurations in isolation — they chain them together.

> The finding that causes a breach is rarely the most severe finding on your list. It is the one that connects to five other findings in a path that reaches your most critical assets.

## What an attack path actually is

An attack path is a sequence of exploitation steps that an attacker could take to move from an initial foothold to a target resource. Each step in the path exploits a specific misconfiguration or vulnerability. No single step requires extraordinary attacker capability — each one is a logical consequence of the previous.

A typical AWS attack path might look like this:

1. A Lambda function is exposed to the internet via an API Gateway without authentication. An attacker sends a crafted request that triggers an SSRF vulnerability in the application code.
2. The SSRF reaches the EC2 Instance Metadata Service (IMDSv1) and retrieves temporary credentials for the Lambda execution role.
3. The Lambda execution role has `iam:PassRole` permission on a deployment role used by the CI/CD pipeline.
4. Using `iam:PassRole`, the attacker creates a new Lambda function and assigns the deployment role, giving them pipeline-level permissions.
5. The deployment role has `s3:GetObject` on the S3 bucket where customer PII exports are staged for the data warehouse ETL pipeline.

At step one, the attacker is an anonymous internet user. At step five, they are reading customer PII. None of the individual misconfigurations — IMDSv1 enabled, overly permissive execution role, unscoped PassRole — are rated Critical in isolation. Together, they form a breach.

![The attack path view in the Onam console (demo account)](/screenshots/screenshot-attack-path.png)

## Toxic combinations: when 2 + 2 = 10

The term "toxic combination" describes a set of findings that, in combination, produce a risk orders of magnitude larger than the sum of the individual risk scores. The concept has become standard terminology across the CNAPP space — for good reason.

A concrete example: suppose you have an EC2 instance that is internet-facing (a High finding) running a web application with a known CVE in its web framework (a Medium finding). Neither finding is marked Critical. But the CVE provides remote code execution, and the internet-facing exposure means the instance can be reached directly. The combination is Critical — a direct RCE entry point with no network controls in between.

Add one more element: suppose the instance profile grants `ec2:DescribeInstances` and `ssm:SendCommand` across the entire account. Now the attacker who exploited the CVE can run commands on every EC2 instance in the account. Three Medium/High findings. One account-wide compromise.

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
| `CAN_ASSUME` | One IAM principal can assume another role (the trust policy allows it) |
| `HAS_PERMISSION` | An IAM principal has a specific action on a resource |
| `NETWORK_REACHABLE` | A resource is network-accessible from another resource or from the internet |
| `RUNS_ON` | A workload runs on a compute resource and inherits its instance role |
| `EXPOSES` | A load balancer or API Gateway exposes another resource to a broader network scope |

Attack path discovery runs a breadth-first search across this graph, starting from external entry points — internet-accessible endpoints, publicly accessible storage, misconfigured STS endpoints — and traversing the graph to find all reachable crown jewel nodes. Each discovered path is scored using a composite function of:

- Number of hops — shorter paths are higher priority.
- Exploitability of each step — a CVE with a public exploit vs. a step requiring valid credentials.
- Sensitivity of the target resource.
- Whether compensating controls exist along the path — monitoring, WAF, threat detection.

![A privilege escalation chain modeled as a graph of identities and permissions](/diagrams/feat-ciem-privesc-chain.svg)

## MITRE ATT&CK tagging on every path step

Each step in an attack path is tagged with the MITRE ATT&CK technique it represents. This does two things: it grounds the abstract graph traversal in threat intelligence that security teams and CISOs recognize, and it connects your attack path findings to your compliance posture for frameworks like NIST CSF and CIS Controls that reference ATT&CK.

A path step that exploits IMDSv1 to steal credentials is tagged T1552.005 (Unsecured Credentials: Cloud Instance Metadata API). A step that uses `iam:PassRole` for privilege escalation is tagged T1548.005. A step that exfiltrates data from S3 is tagged T1530.

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

---

*Originally published on the [Onam Security blog](https://www.onamsecurity.com/resources/blog/attack-path-4000-to-3). Onam is a unified cloud security platform — CSPM, attack-path analysis, identity, data, and detection on one security graph across AWS, Azure, GCP and more. [See the platform.](https://www.onamsecurity.com/platform)*
