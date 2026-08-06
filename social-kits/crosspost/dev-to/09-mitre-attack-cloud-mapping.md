---
title: "MITRE ATT&CK for Cloud: mapping real attacks to your posture score"
published: false
description: "How MITRE ATT&CK for Cloud translates abstract threat techniques into concrete cloud misconfigurations — and how your posture score tracks each one."
tags: security, cloud, devsecops, aws
canonical_url: https://www.onamsecurity.com/resources/blog/mitre-attack-cloud-mapping
---
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
- Service accounts with `iam:PassRole` to roles with higher privileges.
- Lambda functions with execution roles that include `iam:CreatePolicyVersion`.
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
- Overly permissive IAM policies that grant `s3:GetObject` on `*` resources.

## How posture score maps to technique coverage

When we assign a posture score to your cloud environment, each rule that contributes to the score is tagged with the ATT&CK techniques it relates to. A score of 87 out of 100 means 13% of your rules are failing — but it also means there is a specific set of ATT&CK techniques whose preconditions are currently satisfied in your environment.

> This framing changes how you should prioritise remediation. A rule failure that maps to T1562.008 (Disable Cloud Logs) or T1078.004 (Valid Cloud Accounts) should be treated more urgently than one mapping to a technique that requires prior compromise of a privileged identity. The first set is accessible with minimal prior access; the second requires steps the attacker has not yet taken.

## Putting it into practice

The practical application of ATT&CK for Cloud is not to implement every mitigation in the matrix simultaneously. It is to use the technique-to-misconfiguration mapping to answer: "If an attacker is already in my environment with basic credentials, which techniques can they execute today?"

Walk through the privilege escalation techniques first. Then defense evasion. Then collection and exfiltration. Fix the rules that open the door to these techniques, and your posture score becomes a leading indicator of how hard your environment is to attack — not just a compliance checkbox.

---

*Originally published on the [Onam Security blog](https://www.onamsecurity.com/resources/blog/mitre-attack-cloud-mapping). Onam is a unified cloud security platform — CSPM, attack-path analysis, identity, data, and detection on one security graph across AWS, Azure, GCP and more. [See the platform.](https://www.onamsecurity.com/platform)*
