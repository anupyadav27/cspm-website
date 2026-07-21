---
title: Risk Quantification (FAIR Model)
description: How Onam converts cloud security findings into dollar-denominated financial risk estimates using the FAIR model.
---

# Risk Quantification

## Overview

Onam's Risk engine converts every security finding in your cloud environment into a dollar-denominated financial risk estimate using the FAIR (Factor Analysis of Information Risk) model — the only internationally standardized quantitative risk framework for information security.

The output: a business-language risk view showing total financial exposure, the top risks ranked by dollar impact, and the remediation actions that will reduce exposure the most per engineering hour.

## The FAIR Model

FAIR decomposes risk into two dimensions:

**Loss Event Frequency (LEF):** How often does a threat event occur AND result in a loss?
- Threat Event Frequency (TEF): How often does the threat actor attempt an action?
- Vulnerability (Vuln): Given an attempt, what is the probability it succeeds?

**Loss Magnitude (LM):** How much does a successful event cost?
- Primary Loss: Direct costs — data recovery, incident response, notification, forensics
- Secondary Loss: Indirect costs — regulatory fines, reputational damage, customer churn

**Risk = LEF × LM**

Onam automates both dimensions using:
- KEV and EPSS data to calibrate Threat Event Frequency
- Finding type and cloud exposure to calibrate Vulnerability probability
- IBM/Ponemon industry breach cost data to calibrate Primary Loss
- Applicable compliance framework fine schedules for Secondary Loss regulatory fines

## Risk Scoring Pipeline

For each finding, Onam computes:

### 1. Exposure Surface
- Is the affected resource internet-exposed? (from network security engine)
- What is the blast radius if compromised? (from attack path engine)
- Is this a crown jewel asset? (user-defined or inferred from classification)

### 2. Threat Probability
- Is this finding type actively exploited in the wild? (KEV flag)
- What is the exploit probability in the next 30 days? (EPSS score)
- Is there a known PoC exploit? (NVD / exploit-db correlation)

### 3. Loss Estimation

**Primary loss components:**
| Component | Basis |
|---|---|
| Incident response | $150/hour × estimated IR hours by breach type |
| Data recovery | $250/record × affected record estimate |
| Breach notification | $5/notification × estimated notification count |
| Business interruption | Daily revenue × estimated downtime |

**Secondary loss — regulatory fines:**
| Framework | Maximum Exposure |
|---|---|
| GDPR | €20M or 4% of global annual turnover |
| HIPAA | $1.9M per violation category per year |
| PCI-DSS | $5,000–$500,000 per month until compliant |
| SOX | $5M + 20 years imprisonment for willful violations |

Onam uses the applicable frameworks from your compliance configuration to determine which fine schedules apply to each finding.

## Output Metrics

For each finding:
- **P50 Financial Exposure** — median loss estimate
- **P90 Financial Exposure** — 90th percentile loss estimate (worst plausible outcome)
- **Risk Reduction Value** — how much exposure is eliminated by fixing this finding
- **Blast Radius** — number of assets, users, and data records at risk

For the portfolio:
- **Total Exposure** — aggregate risk across all open findings
- **Top-10 Risks** — ranked by P50 financial exposure
- **Risk Trend** — total exposure over the last 90 days
- **Exposure by Domain** — breakdown by posture, identity, code, and vulnerability risk

## Crown Jewel Risk Multipliers

Assets designated as crown jewels receive risk multipliers:

| Crown Jewel Type | Multiplier |
|---|---|
| Production database | 3× |
| Secrets / credentials store | 4× |
| PII-containing data store | 3× |
| Business-critical API | 2× |
| Payment processing service | 5× |

Multipliers are applied to the Loss Magnitude component, reflecting that a breach affecting a crown jewel has substantially higher primary and secondary loss than the same breach affecting a development resource.

## Remediation Prioritization

The Risk engine outputs a remediation queue ranked by **Risk Reduction Value per fix**:

1. Identify the 10 fixes with the highest risk reduction value
2. For each fix, show: estimated engineering effort (T-shirt sized S/M/L) and dollar exposure eliminated
3. Surface the minimum-cut fix (one change that collapses the most attack paths and eliminates the most dollar exposure)

This enables security teams to present a business case to engineering: "These 5 fixes eliminate $12M in potential exposure and will take 3 engineering days."

## Frequently Asked Questions

**Can I calibrate the model with our own financial data?**
Yes. You can provide: annual revenue, total data records processed, and breach cost assumptions from your cyber insurance policy. These inputs override the industry-average defaults and produce more accurate estimates for your specific organization.

**Does this replace a formal risk assessment?**
No — Onam Risk Quantification is continuous automated estimation, not a formal FAIR assessment conducted by a risk practitioner. It is designed to inform prioritization decisions and provide a baseline for board reporting. For SOC 2, ISO 27001, or regulatory audit purposes, formal assessments conducted by practitioners remain required.

**How often are risk scores updated?**
Risk scores are recalculated after every scan (typically daily) and whenever the KEV or EPSS databases are updated (daily feeds from CISA and FIRST.org).
