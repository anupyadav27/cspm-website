---
title: "The 5 AWS misconfigurations we find in 90% of first scans"
published: false
description: "After thousands of first-time AWS scans, the same five misconfigurations show up in nearly every environment. Here's what they are — and how to fix th"
tags: aws, security, cloud, devops
canonical_url: https://www.onamsecurity.com/resources/blog/aws-misconfigurations-first-scan
---
## Why the same five keep showing up

Cloud teams move fast, and defaults rarely favor the defender. Across the AWS accounts we onboard, five misconfigurations recur with astonishing consistency — often in accounts operated by teams that consider themselves mature. Each one is easy to introduce, easy to miss, and each one can quietly widen the blast radius of a routine credential leak into a full compromise.

## 1. S3 buckets exposed via bucket policies (not ACLs)

Everyone knows to block public ACLs. Fewer teams audit **bucket policies** that grant `s3:GetObject` to `Principal: "*"`. The AWS console labels these buckets "Public" only when the policy resource is the bucket itself — not when it's `arn:aws:s3:::acme-corp-uploads/public/*`.

- Enable **Block Public Access** at the account level.
- Alert on any new bucket policy statement whose principal is `*` or whose condition allows broad IPs.
- Treat any `s3:*` grant to `arn:aws:iam::****4821:root` from another account as a finding until proven intentional.

## 2. Over-privileged IAM roles attached to EC2

We routinely find `AdministratorAccess` on instance profiles that only need to read from one S3 prefix. Combined with an SSRF bug or an exposed metadata endpoint (IMDSv1), that role becomes an admin foothold.

- Enforce **IMDSv2** across the fleet.
- Replace `*` policies on instance profiles with least-privilege equivalents generated from IAM Access Analyzer.
- In Onam, this pattern shows up as a red edge in the attack graph the moment a public-facing workload reaches the role.

## 3. Public RDS snapshots

RDS snapshot sharing is a per-snapshot ACL — flipping it to "public" makes the entire database available to any AWS account. Teams do this to move data between environments and forget to revert.

## 4. Security groups with 0.0.0.0/0 on non-web ports

SSH (22), RDP (3389), database ports, and `ANY`-protocol rules facing the internet are still the single most common initial-access vector we detect during onboarding. Most are legacy — a rule opened for a demo three years ago on an account no one owns anymore.

## 5. CloudTrail gaps

CloudTrail is either not enabled in every region, not covering S3 data events, or writing to a bucket in the same account with no MFA delete. Any attacker with account-level access rewinds the tape.

## What "fix it fast" actually looks like

Prioritization matters more than volume. Onam's attack-path engine ranks these five findings by **actual reachability from an internet-exposed resource to a crown jewel** — so the SSH-open bastion in front of an admin IAM role beats the internal-only bucket policy every time.

> "Coverage is table stakes. What we sell is the order you fix things in."

If you're onboarding a new AWS org, expect at least three of the five above on day one. That's not a failure of your team — it's the shape of AWS defaults.

---

*Originally published on the [Onam Security blog](https://www.onamsecurity.com/resources/blog/aws-misconfigurations-first-scan). Onam is a unified cloud security platform — CSPM, attack-path analysis, identity, data, and detection on one security graph across AWS, Azure, GCP and more. [See the platform.](https://www.onamsecurity.com/platform)*
