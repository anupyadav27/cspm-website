---
title: Cloud Detection & Response (CDR)
description: Three-tier behavioral threat detection over CloudTrail, VPC Flow Logs, and Kubernetes audit logs with MITRE ATT&CK mapping.
---

# Cloud Detection & Response (CDR)

## Overview

Onam CDR provides continuous behavioral threat detection across your cloud audit logs — running three simultaneous detection tiers to catch everything from known attack signatures to novel techniques that have never been seen before.

Unlike rule-only detection systems, CDR combines signature matching (L1), statistical behavioral profiling (L2), and unsupervised machine learning (L3) to surface real incidents instead of alert noise.

## Detection Architecture

### L1 — Rule-Based Detection

200+ curated signatures covering the most common and dangerous cloud attack patterns:

**AWS CloudTrail:**
- Root account login / root API calls
- Credential exfiltration via EC2 metadata API
- Unusual cross-account role assumptions
- CloudTrail log disabling or tampering
- Security group modifications that open broad internet access
- S3 bucket policy changes that enable public access
- GuardDuty finding correlation

**VPC Flow Logs:**
- Port scanning patterns (sequential port hits from a single source)
- Data exfiltration indicators (large outbound volume to new destinations)
- Internal lateral movement patterns (east-west traffic to unusual ports)

**Kubernetes Audit Logs:**
- Privileged pod creation
- ClusterRole / ClusterRoleBinding creation by non-admin principals
- Exec into production pods
- Unauthorized secret reads
- Container image pull from non-approved registries

### L2 — Statistical Behavioral Baselines

Onam CDR builds per-entity behavioral profiles over a 30-day rolling window:

**Per-entity baselines include:**
- Typical API call frequency and distribution
- Normal geographic regions of API calls (for IAM users and roles)
- Standard hours of activity
- Usual services accessed
- Typical data transfer volumes

**Anomaly detection fires when:**
- API call rate deviates more than 3σ from the entity's baseline
- Activity occurs at an unusual time (outside normal operating hours)
- New geographic region appears in API call source
- A new service is accessed that the entity has never touched before
- Incremental permission escalation detected across multiple sessions

### L3 — ML-Based Anomaly Detection

Unsupervised anomaly detection across the full behavioral graph using isolation forest and autoencoder models trained on normal cloud activity patterns:

- Detects novel attack patterns with no prior signature
- Identifies coordinated multi-entity attacks (several compromised accounts acting in concert)
- Surfaces behavioral correlations across CloudTrail, VPC Flow, and K8s logs simultaneously
- Auto-ranks anomalies by severity using the attack path graph as context

## Log Sources

| Cloud | Sources |
|---|---|
| AWS | CloudTrail (management + data events), VPC Flow Logs, GuardDuty findings, S3 access logs |
| Azure | Activity Logs, Azure Defender alerts, NSG Flow Logs |
| GCP | Cloud Audit Logs (Admin Activity, Data Access), VPC Flow Logs |
| Kubernetes | API server audit logs (EKS, AKS, GKE, self-managed) |
| IBM Cloud | Activity Tracker, Flow Logs |

All log sources are accessed using the same read-only credentials used for CSPM scanning. No additional agents, collectors, or network changes are required.

## Incident Correlation

Individual detections across L1, L2, and L3 are automatically correlated into incidents using temporal proximity and shared entity analysis:

**Example:** Three separate detections fire within 4 minutes:
1. L1: Unusual IAM role assumption from external IP
2. L2: Same role's API call rate 12× above baseline
3. L1: S3 bucket accessed that this role has never touched before

Onam correlates these into a single incident: "Suspected credential compromise — external IAM assumption followed by data access anomaly."

## MITRE ATT&CK Mapping

Every detection fires with a MITRE ATT&CK for Cloud tag:

| Detection | Tactic | Technique |
|---|---|---|
| Root login | Initial Access | T1078 — Valid Accounts |
| Unusual role assumption from new IP | Credential Access | T1528 — Steal Application Token |
| API call to new region | Defense Evasion | T1535 — Unused/Unsupported Cloud Regions |
| Bulk S3 download | Exfiltration | T1530 — Data from Cloud Storage |
| Security group opened to 0.0.0.0/0 | Defense Evasion | T1578 — Modify Cloud Compute Infrastructure |

## Response Playbooks

Each incident type ships with a response playbook:

1. **Alert triage** — context summary, affected resources, estimated blast radius
2. **Containment** — one-click actions: quarantine IAM role, revoke session tokens, block IP in WAF
3. **Investigation** — linked CloudTrail query to pull the full event timeline
4. **Remediation** — CSPM findings that contributed to the incident, with fix guidance

## Configuration

CDR is enabled per cloud account. Configuration options:

```yaml
cdr:
  log_sources:
    cloudtrail: enabled
    vpc_flow_logs: enabled
    guardduty: enabled
  detection_tiers:
    l1_rules: enabled
    l2_baselines: enabled
    l3_ml: enabled
  alerting:
    min_severity: medium       # low | medium | high | critical
    channels: [slack, pagerduty, email]
  baseline_window_days: 30
```

## Frequently Asked Questions

**How long does L2 baseline training take?**
Initial baselines are established within 7 days of activation. L2 detections begin firing after 7 days; L3 ML models reach full accuracy after 14 days of behavioral data.

**Does CDR consume GuardDuty findings?**
Yes. GuardDuty findings are ingested as L1 detections, enriched with posture and identity context from Onam's other engines, and correlated into the unified incident stream.

**How do I reduce false positives?**
Onam CDR includes an entity allowlist for each detection type. For example, you can suppress "unusual region" detections for a specific IAM role that legitimately operates globally. Suppressed detections are logged but do not create alerts.
