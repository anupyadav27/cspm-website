import type { Metadata } from 'next'
import { ShieldCheck } from 'lucide-react'
import { ProductPageTemplate } from '@/components/platform/ProductPageTemplate'

export const metadata: Metadata = {
  title: 'CSPM — Cloud Security Posture Management',
  description: 'Find and fix cloud misconfigurations before attackers do. 1,918 CSPM rules across AWS, Azure, GCP, OCI, AliCloud, IBM, and Kubernetes.',
}

export default function CSPMPage() {
  return (
    <ProductPageTemplate
      icon={ShieldCheck}
      iconColor="text-brand-400"
      iconBg="bg-brand-500/10"
      label="CSPM"
      question="Are my cloud configs actually secure right now?"
      headline="Misconfigurations are the #1 cause of cloud breaches. We find yours first."
      sub="Every resource your team deploys is a potential gap. Onam checks 1,918 CSPM posture rules continuously — across all your clouds — so you know about misconfigurations the same day they're introduced, not six months later."
      painPoint="Your DevOps team ships 50 new resources this week. By Friday, three of them are misconfigured. A security group is open to the internet, an S3 bucket has public read access, and an RDS instance has no encryption. None of these are intentional — they're just the defaults that nobody changed. The problem isn't that your team is careless. It's that manual audits can't keep pace with the speed of cloud deployment."
      mechanism="When you connect a cloud account, Onam enumerates every resource across 40+ services — compute, storage, networking, identity, and security configurations. Each resource is evaluated against a library of 1,918 CSPM posture rules, categorised by severity and mapped to compliance frameworks. The scan is read-only: we never modify your environment. Findings are updated continuously as your infrastructure changes, not on a weekly or monthly schedule. New findings surface within minutes of a misconfiguration being introduced."
      whatYouGet={[
        'Every misconfiguration ranked by severity — Critical, High, Medium, Low',
        'Exact remediation for each finding: CLI command, Terraform snippet, or console steps',
        'Compliance mapping: which frameworks each finding violates (CIS, NIST, PCI, etc.)',
        'Historical trending: see whether your posture is improving or degrading over time',
        'Resource-level drilldown: every finding linked to the specific resource and region',
        'New finding notifications: alerts when new critical issues are introduced',
        'Suppression and exceptions workflow: document accepted risks for audit purposes',
        'Coverage report: how much of your account is actually being scanned',
      ]}
      diagram={<img src="/diagrams/p-cspm.svg" style={{ width: '100%' }} alt="CSPM pipeline" />}
      faqs={[
        {
          question: 'How is Onam CSPM different from AWS Security Hub or Azure Defender for Cloud?',
          answer: 'Native tools check only their own cloud and have limited rule sets (~250 checks in Security Hub). Onam checks all 7 clouds — AWS, Azure, GCP, OCI, AliCloud, IBM Cloud, and Kubernetes — against 1,918 CSPM rules, plus 10,000+ total checks across all 16 engines, in a single unified view. You get one posture score, one remediation queue, and one compliance report, regardless of which clouds you run.',
        },
        {
          question: 'Does connecting my cloud account require write access?',
          answer: 'No. Onam uses read-only IAM roles, service principals, or service accounts. We never modify your environment. The platform stores only a role ARN or equivalent reference — no long-lived access keys are ever stored.',
        },
        {
          question: 'How quickly do findings appear after I connect an account?',
          answer: 'The first scan completes in under 5 minutes. Subsequent scans run continuously — new misconfigurations surface within minutes of being introduced, not at your next scheduled scan.',
        },
        {
          question: 'Can I suppress findings I have accepted as a business risk?',
          answer: 'Yes. Every finding has a suppression workflow that records the business justification, the approver, and an expiry date. This creates an auditable exception trail — auditors can see suppressed findings alongside the documented rationale.',
        },
        {
          question: 'Does CSPM cover Kubernetes manifests or Terraform before deployment?',
          answer: 'CSPM covers live cloud resources — the deployed state of your infrastructure. For IaC scanning before deployment (Terraform, CloudFormation, Helm charts), see the SecOps engine. For running Kubernetes workloads, see Container Security.',
        },
      ]}
      relatedHrefs={[
        { label: 'CIEM — Identity risk',        href: '/platform/ciem'           },
        { label: 'Compliance frameworks',        href: '/platform/compliance'     },
        { label: 'Network Security — topology',  href: '/platform/network-security'},
      ]}
    />
  )
}
