import type { Metadata } from 'next'
import { Activity } from 'lucide-react'
import { ProductPageTemplate } from '@/components/platform/ProductPageTemplate'

export const metadata: Metadata = {
  title: 'Cloud Detection & Response (CDR) — Behavioral Threat Detection | Onam',
  description: 'Three-tier behavioral detection over CloudTrail, VPC Flow Logs, and K8s audit logs. Real-time cloud threat response with MITRE ATT&CK mapping.',
}

export default function CdrPage() {
  return (
    <ProductPageTemplate
      icon={Activity}
      iconColor="text-orange-400"
      iconBg="bg-orange-500/10"
      label="CDR — Cloud Detection & Response"
      question="Is an attacker operating inside your cloud environment right now?"
      headline="By the time a SIEM fires an alert, the attacker has already moved. CDR closes the gap."
      sub="Onam CDR runs continuous three-tier behavioral analysis over your cloud audit logs — detecting everything from known attack patterns to novel techniques that no signature has ever seen, and correlating every finding with your posture and identity graph for instant context."
      painPoint="Cloud audit logs are a goldmine for attackers who know what normal looks like — because they can stay just inside the threshold that triggers your detection rules. Rule-based detection catches the obvious: root login, unusual region, known malicious IP. It misses the sophisticated: incremental permission escalation over 72 hours, API calls that are individually normal but statistically anomalous as a sequence, exfiltration disguised as scheduled data transfers. Meanwhile, your security team is drowning in hundreds of daily SIEM alerts from a system that was never designed for cloud-scale log volumes."
      mechanism="Onam CDR operates on three detection tiers simultaneously. L1 (rule-based) applies 200+ known-bad signatures — the patterns that every security team has documented across CloudTrail, VPC Flow, and K8s audit logs. L2 (statistical) builds per-entity behavioral baselines over a 30-day rolling window and fires when any entity deviates significantly from its own normal — catching incremental privilege escalation, time-of-day anomalies, and unusual API sequence patterns. L3 (ML-based) runs unsupervised anomaly detection across the full behavioral graph, surfacing novel attack patterns that have no prior signature. All three tiers feed into a unified finding stream mapped to MITRE ATT&CK for Cloud, enriched with context from CSPM, CIEM, and network topology, and de-duplicated so you see coherent incidents — not hundreds of individual alerts."
      whatYouGet={[
        'L1 rule-based detection — 200+ known-bad signatures across CloudTrail, VPC Flow, and K8s audit logs',
        'L2 statistical behavioral baselines — per-entity anomaly detection over 30-day rolling windows',
        'L3 ML anomaly detection — novel threat patterns with no prior signature, auto-ranked by severity',
        'MITRE ATT&CK for Cloud mapping — every detection tagged with tactic, technique, and procedure',
        'Posture + identity enrichment — every alert shows the resource posture, IAM permissions, and network exposure of the affected entity',
        'Incident correlation — multi-step attack chains grouped into unified incidents, not isolated alerts',
        'Real-time alerting — Slack, PagerDuty, and email notifications with full context in the first message',
        'Response playbooks — cloud-native containment actions (quarantine, revoke, block) linked from every incident',
      ]}
      faqs={[
        {
          question: 'What log sources does CDR consume?',
          answer: 'AWS: CloudTrail (management and data events), VPC Flow Logs, AWS GuardDuty findings, S3 access logs. Azure: Activity Logs, Azure Defender alerts, NSG Flow Logs. GCP: Cloud Audit Logs, VPC Flow Logs. Kubernetes: K8s API server audit logs across EKS, AKS, GKE, and self-managed clusters. All sources are automatically collected using the same read-only IAM roles used for CSPM scanning — no additional agents or collectors required.',
        },
        {
          question: 'How is CDR different from AWS GuardDuty or Microsoft Defender?',
          answer: 'GuardDuty and Defender are excellent at detecting known threats within their own cloud. Onam CDR adds three things they cannot: (1) Cross-cloud correlation — an attacker pivoting from compromised AWS credentials to Azure RBAC manipulation shows up as one incident. (2) Posture enrichment — every detection is automatically enriched with the CSPM and CIEM context of the affected resource. (3) Attack path correlation — CDR detections are mapped to the same security graph as attack path analysis, so you see immediately which attack paths the detected activity is traversing.',
        },
        {
          question: 'What is the latency from event to alert?',
          answer: 'L1 detections fire within 60 seconds of a log event landing in your configured log store. L2 statistical detections run on a 5-minute aggregation window — alerts typically fire within 6-8 minutes of a threshold crossing. L3 ML detections run on a 15-minute cycle. All three feed the same unified alert stream.',
        },
        {
          question: 'Does CDR require us to change our log retention settings?',
          answer: 'No. Onam CDR reads from your existing CloudTrail, VPC Flow, and audit log stores using read-only access. We recommend 90-day retention for full L2 baseline accuracy, but CDR will operate with whatever retention you currently have configured. Initial L2 baselines are established within 7 days of activation.',
        },
      ]}
      relatedHrefs={[
        { label: 'Attack Path Analysis', href: '/platform/attack-path'      },
        { label: 'Threat Detection',     href: '/platform/threat-detection'  },
        { label: 'CIEM — Identity',      href: '/platform/ciem'              },
        { label: 'Network Security',     href: '/platform/network-security'  },
      ]}
    />
  )
}
