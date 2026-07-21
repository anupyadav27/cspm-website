import type { Metadata } from 'next'
import { GitBranch } from 'lucide-react'
import { ProductPageTemplate } from '@/components/platform/ProductPageTemplate'
import { AttackPathDiagram } from '@/components/diagrams/AttackPathDiagram'

export const metadata: Metadata = {
  title: 'Attack Path Analysis — Crown Jewels & Toxic Combinations | Onam',
  description: 'Onam builds a security graph across your entire cloud estate to find every chain of misconfigurations and identity paths that lead to crown jewel compromise.',
}

export default function AttackPathPage() {
  return (
    <ProductPageTemplate
      icon={GitBranch}
      iconColor="text-red-400"
      iconBg="bg-red-500/10"
      label="Attack Path Analysis"
      question="Which combination of misconfigurations leads directly to your most critical assets?"
      headline="Attackers chain small issues into catastrophic breaches. Most tools only show you the individual links."
      sub="Onam builds a live security graph across posture, identity, network, and vulnerability data — then runs automated path analysis to show every route an attacker could take from an exposed entry point to your crown jewels."
      painPoint="A single misconfiguration rarely causes a breach. An S3 bucket with public read access is a finding. But that same bucket, combined with an IAM role that can be assumed by any authenticated AWS identity and an EC2 instance with a path to your production database — that is a breach waiting to happen. Traditional CSPM tools surface 400 findings. Security teams have no way to know which three of them, chained together, represent a critical attack path. They fix the highest CVSS scores and hope for the best."
      mechanism="Onam's attack path engine ingests every finding from all 16+ security engines and builds a directed security graph. Nodes are resources — EC2 instances, S3 buckets, IAM roles, Lambda functions, RDS databases, Kubernetes pods. Edges are relationships — can-assume, can-read, can-write, can-reach, can-escalate. The engine runs automated traversal to identify: (1) Crown jewel paths — all routes from any internet-exposed entry point to assets tagged as critical. (2) Toxic combinations — pairs or triples of findings that together create a blast radius far exceeding either alone. (3) Lateral movement chains — how a compromised identity can pivot across your estate. Every path is ranked by the number of steps, the severity of each node, and the blast radius at the target. MITRE ATT&CK technique tags are applied at every step."
      whatYouGet={[
        'Crown jewel path analysis — every route from exposed entry points to critical assets, visualized as interactive graphs',
        'Toxic combination detection — AI-identified pairs of misconfigurations that together create critical blast radius',
        'MITRE ATT&CK tagging — every step in every attack path mapped to the relevant technique and tactic',
        'Blast radius scoring — quantified impact if any given identity, resource, or entry point is compromised',
        'Attack path prioritization — rank findings not by CVSS score but by how many critical paths they appear in',
        'One-click remediation guidance — the single fix that collapses the most attack paths at once',
        'Historical path tracking — see when a path opened, how many findings contributed, and when it was closed',
        'Integration with Risk engine — every attack path carries a dollar-denominated exposure estimate from the FAIR model',
      ]}
      diagram={<AttackPathDiagram />}
      faqs={[
        {
          question: 'How is attack path analysis different from CSPM?',
          answer: 'CSPM surfaces individual misconfigurations — "this S3 bucket is public," "this security group has port 22 open." Attack path analysis connects those findings into chains: public S3 bucket → overprivileged IAM role attached to Lambda → Lambda can invoke production RDS via a permissive security group. The chain is the risk, not any individual finding. Attack path analysis answers "which findings matter most given how they connect to critical assets."',
        },
        {
          question: 'What is a toxic combination?',
          answer: 'A toxic combination is two or more findings that individually score as Medium severity but together create a Critical attack path. For example: an EC2 instance with IMDSv1 enabled (Medium) combined with an overprivileged instance profile that has S3:* permissions (Medium). Together, they enable SSRF → credential theft → full S3 data exfiltration — a Critical impact chain. Onam automatically identifies these combinations and surfaces them as a unified finding with combined severity.',
        },
        {
          question: 'What data sources feed the attack path graph?',
          answer: 'All 16+ Onam engines contribute: CSPM posture findings, CIEM identity paths and permission graphs, network topology (VPC routes, security groups, NACLs), vulnerability data (CVE correlation), container security findings, IAM policy analysis, and data security classification. The graph is rebuilt after every scan — typically within minutes of a new resource being added to your cloud.',
        },
        {
          question: 'How do you define crown jewels?',
          answer: 'You define crown jewels by tagging resources in the Onam platform: production databases, secrets managers, sensitive data stores, business-critical APIs. You can also import tags from your cloud provider. Once tagged, the attack path engine treats them as destination nodes and prioritizes every path that reaches them, regardless of how many hops it takes.',
        },
      ]}
      relatedHrefs={[
        { label: 'Threat Detection',           href: '/platform/threat-detection' },
        { label: 'CDR — Behavioral Detection', href: '/platform/cdr'              },
        { label: 'Risk Quantification',        href: '/platform/risk'             },
        { label: 'CIEM — Identity Paths',      href: '/platform/ciem'             },
      ]}
    />
  )
}
