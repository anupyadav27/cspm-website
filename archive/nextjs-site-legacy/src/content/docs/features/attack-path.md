---
title: Attack Path Analysis
description: How Onam builds a security graph and identifies crown jewel paths and toxic combinations across your cloud estate.
---

# Attack Path Analysis

## Overview

Attack Path Analysis connects individual security findings — misconfigurations, identity risks, network exposures, and vulnerabilities — into chains that reveal exactly how an attacker would move from an exposed entry point to your most critical assets.

Rather than presenting 847 disconnected findings, Onam builds a directed security graph and runs automated traversal to surface the paths that actually represent existential risk.

## How It Works

### 1. Security Graph Construction

After every scan, Onam ingests findings from all 16+ engines and builds a directed graph:

**Nodes:** Every resource in your cloud estate — EC2 instances, S3 buckets, IAM roles, Lambda functions, RDS databases, EKS pods, secrets, and more.

**Edges:** Every relationship that represents possible attacker movement:
- `can-assume` — an identity can assume this role
- `can-read` / `can-write` — a resource has read or write access to another
- `can-reach` — network connectivity exists (from VPC topology analysis)
- `can-escalate` — a finding enables privilege escalation
- `is-exposed` — a resource has a public-facing entry point

### 2. Path Traversal

The engine runs bidirectional BFS from all entry nodes (internet-exposed endpoints, publicly readable S3 buckets, externally accessible IAM roles) toward all crown jewel nodes (production databases, secrets managers, critical data stores).

Every path found is ranked by:
- **Step count** — shorter paths = higher priority
- **Node severity** — paths traversing Critical findings rank higher
- **Blast radius** — paths that reach high-value assets rank higher
- **Exploitability** — EPSS and KEV data incorporated for CVE-adjacent paths

### 3. Toxic Combination Detection

Toxic combinations are pairs (or triples) of findings that individually score as Medium but together enable a Critical attack chain.

**Example:**
- Finding A: EC2 instance has IMDSv1 enabled (Medium — SSRF vector)
- Finding B: Instance profile has `s3:*` permissions (Medium — overprivileged)
- Together: SSRF → IMDSv1 credential theft → full S3 access = Critical breach

Onam automatically detects these combinations and surfaces them as unified findings with an aggregate severity of Critical.

### 4. MITRE ATT&CK Mapping

Every node and edge in the attack path graph is tagged with the relevant MITRE ATT&CK for Cloud technique:

| Graph Element | MITRE Technique |
|---|---|
| Public S3 bucket → IAM credential exposure | T1552.005 — Cloud Instance Metadata API |
| IAM role → lateral movement | T1078.004 — Valid Accounts: Cloud Accounts |
| EC2 → RDS network path | T1021 — Remote Services |
| Secrets Manager access | T1555 — Credentials from Password Stores |

## Crown Jewel Configuration

Define crown jewels in the Onam platform by:
1. Tagging resources directly in the platform UI
2. Importing existing cloud provider tags (`env=production`, `classification=critical`)
3. Using data security classification results to auto-tag PII-containing stores

Crown jewel assets receive a risk multiplier in the FAIR risk engine — every attack path terminating at a crown jewel carries a boosted exposure score.

## Integration With Other Engines

| Engine | Contribution to Attack Path |
|---|---|
| CSPM | Entry point misconfigurations, node-level findings |
| CIEM | Identity edges (`can-assume`, permission graphs) |
| Network Security | Reachability edges (`can-reach`) |
| Vulnerability | CVE nodes with EPSS/KEV data |
| CDR | Active detections overlaid on the graph |
| Risk | Dollar exposure score at each path terminus |

## Remediation Guidance

For each attack path, Onam identifies the **minimum cut** — the single fix that collapses the most attack paths simultaneously. This is typically one of:
- Removing a public entry point (S3 bucket policy, security group rule)
- Restricting an overprivileged IAM role or policy
- Patching a Critical CVE on a pivoting node

The remediation view shows: fix description → number of attack paths it closes → estimated risk reduction in dollars.

## Frequently Asked Questions

**How long does graph construction take?**
Graph construction runs automatically after every scan — typically 3–8 minutes for estates with up to 10,000 resources. For very large environments (100,000+ resources), incremental updates apply only to changed nodes.

**Can I export attack paths for reporting?**
Yes. Attack paths export as PDF reports (executive summary + technical detail) or as JSON for SIEM/SOAR ingestion.

**What if I have no crown jewels tagged?**
Without crown jewels, the engine still runs path analysis using heuristics: RDS instances, Secrets Manager secrets, and any resource tagged `env=production` or `env=prod` are treated as implicit crown jewels.
