---
title: "Beyond GuardDuty: how three-tier behavioral detection catches what rules miss"
published: false
description: "Rule-based detection catches known attack signatures. Statistical behavioral baselines catch incremental privilege escalation. ML anomaly detection ca"
tags: cloudsecurity, security, cloud, devops
canonical_url: https://www.onamsecurity.com/resources/blog/cdr-behavioral-threat-detection
---
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

**Day 3.** The attacker notices that the developer's role has `iam:ListRolePolicies` and uses it to map roles with elevated permissions. They find a CI/CD role that can deploy CloudFormation stacks. They call `iam:AssumeRole` to take on the CI/CD role — a call the developer legitimately makes for manual deployments. No rule fires.

**Day 7.** Using the CI/CD role, the attacker deploys a CloudFormation stack that creates a new IAM role with administrator access. The stack deployment is indistinguishable from legitimate CI/CD activity. The administrator role is now available.

At no point did the attacker trigger a signature-based rule. They used legitimate credentials to call legitimate APIs in a legitimate sequence — just not the developer's usual sequence.

L2 catches this because the behavioral baseline for the developer account shows API call patterns concentrated in us-east-1 between 9am and 6pm on weekdays. The attacker's activity happens at 2am UTC from an unusual IP range, covers nine regions in sequence (consistent with environment mapping), and includes `iam:ListRolePolicies` calls the developer has never made before. The deviation score exceeds the threshold on Day 1. By Day 3, the anomaly score has accumulated across multiple sessions and an L2 alert fires with the full session timeline.

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

---

*Originally published on the [Onam Security blog](https://www.onamsecurity.com/resources/blog/cdr-behavioral-threat-detection). Onam is a unified cloud security platform — CSPM, attack-path analysis, identity, data, and detection on one security graph across AWS, Azure, GCP and more. [See the platform.](https://www.onamsecurity.com/platform)*
