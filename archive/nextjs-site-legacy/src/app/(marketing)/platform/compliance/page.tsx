import type { Metadata } from 'next'
import { CheckSquare } from 'lucide-react'
import { ProductPageTemplate } from '@/components/platform/ProductPageTemplate'
import { COMPLIANCE_FRAMEWORKS } from '@/lib/config'

export const metadata: Metadata = { title: 'Compliance — 13 Frameworks', description: 'Real-time compliance posture across CIS, NIST, ISO 27001, PCI-DSS, HIPAA, GDPR, SOC 2, FedRAMP and more.' }

export default function CompliancePage() {
  return (
    <ProductPageTemplate
      icon={CheckSquare}
      iconColor="text-emerald-400"
      iconBg="bg-emerald-500/10"
      label="Compliance"
      question="Am I ready for my next audit — right now, not in 3 weeks?"
      headline="Your auditor wants evidence. We have it ready before they ask."
      sub="Onam maps every security finding to 13 compliance frameworks in real time. You always know your exact posture — not where you were last quarter, where you are today."
      painPoint="The week before a compliance audit, your team scrambles: pulling screenshots from CloudTrail, cross-referencing findings against framework controls, writing exception justifications. This should take hours, not weeks. And it's entirely avoidable — if your security findings are already mapped to the relevant controls."
      mechanism="Every finding Onam generates is tagged with the compliance controls it violates, across all applicable frameworks simultaneously. When you open the compliance dashboard for PCI-DSS, you see exactly which controls are failing, which are passing, and which have accepted exceptions — with evidence links to the specific findings. Reports can be exported for auditor review. Coverage is continuous: as you remediate findings, your compliance posture updates in real time."
      whatYouGet={[
        ...COMPLIANCE_FRAMEWORKS.map(f => `${f.name}: real-time control pass/fail with evidence links`),
        'One-click auditor export: PDF and CSV reports with finding evidence attached',
        'Exception management: document accepted risks with justification for audit purposes',
        'Remediation roadmap: prioritised list of what to fix to improve each framework score',
        'Control mapping matrix: see which findings violate multiple frameworks simultaneously',
      ]}
      diagram={<img src="/diagrams/p-compliance.svg" style={{ width: '100%' }} alt="Compliance framework coverage" />}
      faqs={[
        {
          question: 'How does evidence collection work — do I need to export anything manually?',
          answer: 'No manual exports needed. Evidence is collected automatically from scan results. Every finding maps to specific framework controls. When you run a compliance report, Onam generates a control-by-control evidence report in real time — pulling the current finding state, remediation status, and any accepted exceptions with documented justifications.',
        },
        {
          question: 'Which frameworks are supported, and what versions?',
          answer: 'CIS AWS/Azure/GCP (v1.5+), NIST 800-53 Rev 5, ISO 27001:2022, PCI-DSS v4.0, HIPAA Security Rule, GDPR Article 32, SOC 2 (Trust Services Criteria), FedRAMP Moderate, CSA CCM v4, DORA (Digital Operational Resilience Act), and MAS TRM (Singapore). A custom framework builder is also available for internal control sets.',
        },
        {
          question: "What happens to suppressed findings in compliance reports?",
          answer: "Suppressed findings appear in the compliance report as 'accepted risk' with the documented business justification, the approver's identity, and the expiry date. This is the correct audit representation — suppression doesn't hide the finding from the report; it documents the risk acceptance decision that an auditor needs to see.",
        },
        {
          question: 'How often is the compliance posture score updated?',
          answer: 'Continuously. Unlike point-in-time audit tools that generate a quarterly snapshot, Onam compliance scores update as findings are introduced or remediated. Your dashboard always shows the current control status — so if a developer introduces a misconfiguration at 2pm, the compliance posture reflects it by 2:05pm.',
        },
        {
          question: 'Can I export a report that an auditor can review directly?',
          answer: 'Yes. Reports export as PDF (designed for auditor review — shows control status, evidence descriptions, and failing finding details) or JSON (for integration with GRC tools like Vanta, Drata, or ServiceNow GRC). Both formats are available per-framework or as a combined multi-framework export.',
        },
      ]}
      relatedHrefs={[
        { label: 'CSPM — Config rules',  href: '/platform/cspm'       },
        { label: 'IAM Security',         href: '/platform/iam'         },
        { label: 'Data Security',        href: '/platform/data-security'},
      ]}
    />
  )
}
