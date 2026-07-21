import type { Metadata } from 'next'
import { KeyRound } from 'lucide-react'
import { ProductPageTemplate } from '@/components/platform/ProductPageTemplate'

export const metadata: Metadata = { title: 'IAM Security', description: 'Analyse IAM policies, users, roles, and privilege risk across all your cloud accounts.' }

export default function IAMPage() {
  return (
    <ProductPageTemplate
      icon={KeyRound}
      iconColor="text-yellow-400"
      iconBg="bg-yellow-500/10"
      label="IAM Security"
      question="Are the right people — and only the right people — able to access my cloud?"
      headline="IAM misconfigurations are in every breach postmortem. Let's fix yours now."
      sub="IAM Security gives you a complete view of every user, role, policy, and access key across your cloud accounts — and flags everything that doesn't belong."
      painPoint="IAM is the layer where most post-breach investigations find the real problem. An old access key that was never rotated. A root account that didn't have MFA. A user who left the company 6 months ago and still has active credentials. These aren't exotic vulnerabilities — they're the routine mistakes that happen when IAM grows faster than anyone can audit manually."
      mechanism="The IAM engine scans every user, role, group, policy, and access key across your cloud accounts. It checks against 57 IAM-specific security rules — covering MFA enforcement, root account hygiene, key rotation, policy attachment patterns, cross-account trust, and permission boundary usage. Findings are mapped to CIS benchmarks, NIST controls, and best-practice guidance. The engine also feeds into CIEM for deeper entitlement analysis and into the threat detection graph for identity attack paths."
      whatYouGet={[
        'Root account activity detection and MFA enforcement status',
        'Access key age and last-used reporting for every IAM user',
        'Policy attachment analysis: direct policies, wildcard permissions, unused policies',
        'Group membership audit: who\'s in what groups and what those groups can do',
        'Cross-account trust review: external accounts with IAM access to your environment',
        'Password policy compliance check against CIS and NIST baselines',
        'Inactive user list: accounts with no activity in 90+ days',
        'Service control policy (SCP) inheritance analysis for AWS Organizations',
      ]}
      diagram={<img src="/diagrams/p-iam.svg" style={{ width: '100%' }} alt="IAM security analysis" />}
      faqs={[
        {
          question: 'How is IAM Security different from CIEM?',
          answer: 'IAM Security checks IAM configurations against rules — MFA status, key age, root account hygiene, password policy. CIEM analyses entitlement behaviour — the gap between what is granted and what is actually used, multi-hop privilege escalation paths, and least-privilege scoring. IAM Security is configuration compliance; CIEM is behavioural analysis. Both are needed for a complete identity security programme.',
        },
        {
          question: 'Which cloud IAM systems are covered?',
          answer: 'AWS IAM (users, roles, groups, policies, SCPs), Azure Active Directory and RBAC (users, service principals, managed identities, role assignments), GCP IAM (service accounts, bindings, org policies), and OCI IAM. Kubernetes RBAC is covered by the Container Security engine.',
        },
        {
          question: 'Can IAM Security detect if an access key has been compromised?',
          answer: "IAM Security flags access keys that are old, unused, or belong to root accounts — which are indicators of risk. Active compromise detection (keys being used from unusual IPs, at unusual times, calling unusual APIs) is covered by Threat Detection, which ingests CloudTrail and correlates activity with MITRE ATT&CK patterns.",
        },
        {
          question: 'How does AWS Organizations support work?',
          answer: 'IAM Security analyses Service Control Policies (SCPs) across your AWS Organization — showing which SCPs are attached, what they restrict, and where permissions are being inherited from parent OUs. This is important for understanding the effective permission boundary of every account in the org, not just the individual account policies.',
        },
      ]}
      relatedHrefs={[
        { label: 'CIEM — Entitlement analysis', href: '/platform/ciem'            },
        { label: 'CSPM',                        href: '/platform/cspm'            },
        { label: 'Threat Detection',            href: '/platform/threat-detection'},
      ]}
    />
  )
}
