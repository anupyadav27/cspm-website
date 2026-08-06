---
title: "AI-powered cloud remediation: from finding to fix in minutes"
published: false
description: "The average MTTR for cloud security findings is 47 days. AI-powered remediation — context-aware code fixes, Ansible playbooks for CVEs, and threat nar"
tags: cloudsecurity, security, cloud, devops
canonical_url: https://www.onamsecurity.com/resources/blog/ai-powered-cloud-remediation
---
The average mean time to remediate (MTTR) for cloud security findings is 47 days, according to data collected across enterprise cloud programs. That number has not changed meaningfully in five years, despite cloud security tooling improving substantially over the same period.

The tools got better at finding things. The bottleneck was never finding — it was fixing. A security team that surfaces 500 findings per week and has engineering bandwidth to fix 20 will always have an accumulating backlog, no matter how well-tuned the detection is.

AI-powered remediation addresses the bottleneck directly. Not by reducing finding volume — the findings are real and need to be fixed — but by reducing the time between "identified" and "resolved" for each one.

## Why generic LLM suggestions fail

The obvious approach is to pipe findings into a general-purpose LLM and ask it to produce a fix. This works poorly in practice, for a specific reason: cloud security remediation is context-dependent in ways a general LLM cannot know without being told.

Consider a finding: "Lambda function `payment-processor-prod` has a role with `s3:GetObject` on `*`." A generic LLM will suggest: "Restrict the IAM role to only the specific S3 bucket the function needs to access." Technically correct. But which bucket? What is the ARN? Are there multiple buckets? Is the function deployed by Terraform, CloudFormation, or CDK? Is the role shared with other functions?

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

---

*Originally published on the [Onam Security blog](https://www.onamsecurity.com/resources/blog/ai-powered-cloud-remediation). Onam is a unified cloud security platform — CSPM, attack-path analysis, identity, data, and detection on one security graph across AWS, Azure, GCP and more. [See the platform.](https://www.onamsecurity.com/platform)*
