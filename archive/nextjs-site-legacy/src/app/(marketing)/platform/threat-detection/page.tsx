import type { Metadata } from 'next'
import { Crosshair } from 'lucide-react'
import { ProductPageTemplate } from '@/components/platform/ProductPageTemplate'
import { AttackPathDiagram } from '@/components/diagrams/AttackPathDiagram'

export const metadata: Metadata = {
  title: 'Threat Detection — MITRE ATT&CK Cloud',
  description: 'Map suspicious cloud activity to MITRE ATT&CK techniques. See attack chains before they become incidents.',
}

export default function ThreatDetectionPage() {
  return (
    <ProductPageTemplate
      icon={Crosshair}
      iconColor="text-csm-red"
      iconBg="bg-csm-red/10"
      label="Threat Detection"
      question="Is something suspicious happening in my cloud right now?"
      headline="Attacks don't announce themselves. They look like normal cloud activity — until they don't."
      sub="Onam maps every suspicious event across your cloud environment to MITRE ATT&CK for Cloud — so when something unusual happens, your team already knows what technique is being used, what the attacker's next move likely is, and how to respond. For graph-based attack path analysis and crown jewel paths, see Attack Path Analysis."
      painPoint="A developer leaves a port open. An IAM role gets assumed from an unusual IP. A Lambda function starts making API calls it never made before. Individually, each of these looks like routine noise. Together, they're an active attack. The challenge isn't detecting individual events — it's connecting them into a coherent story fast enough to do something about it."
      mechanism="The threat engine aggregates findings from CSPM, CIEM, network, and identity analysis to build a graph of your cloud environment. When suspicious patterns emerge — unusual role assumptions, anomalous API calls, lateral movement indicators, privilege escalation paths — they're correlated and mapped to the relevant MITRE ATT&CK for Cloud technique. Each finding includes the tactic, technique, and procedure, the affected resources, the severity, and a recommended response. Attack chains are visualised as graphs so you can see exactly how far an attacker has progressed and where to cut the chain."
      whatYouGet={[
        'Every threat finding mapped to a MITRE ATT&CK tactic and technique',
        'Attack chain visualisation: multi-step threat paths shown as connected graphs',
        'Toxic combination detection: pairs of misconfigurations that together create critical risk',
        'Blast radius analysis: which resources are reachable if this identity is compromised',
        'Severity ranking based on CVSS, exploitability, and actual network reachability',
        'Alert fatigue reduction: correlated findings, not one alert per rule match',
        'Response guidance: specific steps to contain and remediate each technique',
        'Historical attack timeline: when did each step in the chain first appear?',
        'Full integration with Attack Path engine — MITRE-mapped events automatically appear in your attack path graph',
      ]}
      diagram={<AttackPathDiagram />}
      faqs={[
        {
          question: 'How is this different from a SIEM like Splunk or Microsoft Sentinel?',
          answer: 'SIEMs ingest raw logs and require you to write and tune detection rules. Onam Threat Detection is pre-built for cloud environments — it already maps events to MITRE ATT&CK techniques and correlates them with your posture, identity, and network data. You see full attack paths instead of isolated log events, with zero rule-writing required to get started.',
        },
        {
          question: 'What log sources power threat detection?',
          answer: 'CloudTrail, VPC Flow Logs, and AWS GuardDuty findings on AWS; Azure Activity Logs and Microsoft Defender alerts on Azure; GCP Cloud Audit Logs on GCP; Kubernetes audit logs for container workloads. These are enriched with posture findings from the CSPM and CIEM engines.',
        },
        {
          question: "What's the difference between an attack path and an alert?",
          answer: "An alert is a single suspicious event: 'role assumed from unusual IP.' An attack path is the sequence of steps: IAM credential exposed in S3 object → role assumption from external IP → lateral movement to EC2 → S3 data exfiltration attempt. Attack paths connect the dots so your team can see the full picture and cut the chain at the right point.",
        },
        {
          question: 'Does Onam replace GuardDuty or Microsoft Defender?',
          answer: 'No — we consume their findings and enrich them. GuardDuty and Defender are excellent at individual event detection. Onam adds the correlation layer: it combines their findings with your posture data, identity paths, and network topology to show attack chains that native tools cannot surface on their own.',
        },
      ]}
      relatedHrefs={[
        { label: 'Attack Path Analysis',       href: '/platform/attack-path'      },
        { label: 'CDR — Behavioral Detection', href: '/platform/cdr'              },
        { label: 'CIEM — Identity paths',      href: '/platform/ciem'             },
        { label: 'Network Security',           href: '/platform/network-security' },
        { label: 'Vulnerability Management',   href: '/platform/vulnerability'    },
      ]}
    />
  )
}
