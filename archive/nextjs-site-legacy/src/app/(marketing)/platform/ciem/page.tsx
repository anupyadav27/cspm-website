import type { Metadata } from 'next'
import { Users } from 'lucide-react'
import { ProductPageTemplate } from '@/components/platform/ProductPageTemplate'

export const metadata: Metadata = {
  title: 'CIEM — Cloud Identity & Entitlement Management',
  description: '80% of cloud permissions are never used. Find every overprivileged identity and unused entitlement before attackers exploit them.',
}

export default function CIEMPage() {
  return (
    <ProductPageTemplate
      icon={Users}
      iconColor="text-csm-cyan"
      iconBg="bg-csm-cyan/10"
      label="CIEM"
      question="Who can access what — and should they still have that access?"
      headline="80% of cloud permissions are never used. Every unused permission is a door that doesn't need to exist."
      sub="Identity is the new perimeter. CIEM resolves the effective permissions of every human user, service account, and machine identity across all your clouds — then compares them against what was actually used in the last 90 days. The gap is your attack surface."
      painPoint="Your cloud IAM grows faster than your team can audit it. Service accounts get created for one-off tasks and never cleaned up. Developers get admin access to unblock a release and it never gets revoked. A Lambda execution role gets S3 full access because it was easier than figuring out the exact permissions. None of this is malicious — it's just how cloud IAM accumulates over time. And every unused permission is a door that doesn't need to exist."
      mechanism="CIEM collects every IAM policy attached to every identity across your cloud accounts, then resolves the effective permissions — accounting for service control policies, permission boundaries, resource-based policies, and session policies. It compares what each identity is allowed to do against what it actually did in the last 90 days (via CloudTrail and activity logs). The gap between 'granted' and 'used' is your least-privilege gap score. CIEM also traces multi-hop role assumption chains — paths an attacker could take from a low-privilege identity to full admin by chaining together multiple role assumptions."
      whatYouGet={[
        'Effective permissions resolved for every identity — not just what\'s attached',
        'Least-privilege gap score (0–100) for each user, role, and service account',
        'Shadow admin detection: identities that can reach admin without an admin role',
        'Stale identity list: accounts and keys unused for 90+ days',
        'Cross-account trust chain analysis: external access your org may not know about',
        'Suggested least-privilege policies based on 90-day actual usage',
        'MFA coverage report: privileged identities without multi-factor authentication',
        'Attack path visualisation: step-by-step how a low-privilege identity reaches admin',
      ]}
      diagram={<img src="/diagrams/p-ciem.svg" style={{ width: '100%' }} alt="CIEM entitlement analysis" />}
      faqs={[
        {
          question: 'Does CIEM require CloudTrail or activity logs to be enabled?',
          answer: 'CIEM uses activity logs (CloudTrail on AWS, Azure Activity Logs, GCP Cloud Audit Logs) to determine which permissions have been used in the last 90 days. If activity logs are disabled, CIEM still resolves effective permissions and shows the full entitlement picture — but cannot compute least-privilege gap scores based on actual usage.',
        },
        {
          question: "What's the difference between CIEM and IAM Security?",
          answer: 'IAM Security checks individual IAM configurations against rules — things like MFA enforcement, key rotation age, and root account usage. CIEM analyses entitlement behaviour across your entire identity estate: it resolves effective permissions, compares them against actual usage, and surfaces the gap. Think of IAM Security as configuration compliance; CIEM as behavioural analysis.',
        },
        {
          question: 'Are service accounts and machine identities (Lambda roles, instance profiles) included?',
          answer: 'Yes. CIEM covers all identity types: human users, federated identities, service accounts, Lambda execution roles, EC2 instance profiles, ECS task roles, and any other cloud principal. The least-privilege gap score and stale-identity detection apply equally to machine identities.',
        },
        {
          question: 'Can CIEM detect if an external party has access to our accounts?',
          answer: 'Yes. Cross-account trust chain analysis shows every external AWS account, Azure tenant, or GCP project that has any form of trust relationship with your environment — including resource-based policies that grant cross-account access to S3 buckets, KMS keys, and other resources.',
        },
        {
          question: 'How does multi-hop privilege escalation detection work?',
          answer: "CIEM traces every possible role-assumption chain. If identity A can assume role B, and role B can assume role C with administrator privileges, CIEM surfaces the full attack path — even if no individual step looks alarming when viewed in isolation. This is the detection that standard IAM audits miss.",
        },
      ]}
      relatedHrefs={[
        { label: 'IAM Security',         href: '/platform/iam'            },
        { label: 'Threat Detection',     href: '/platform/threat-detection'},
        { label: 'CSPM',                 href: '/platform/cspm'           },
      ]}
    />
  )
}
