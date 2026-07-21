import type { Metadata } from 'next'
import { TrendingUp } from 'lucide-react'
import { ProductPageTemplate } from '@/components/platform/ProductPageTemplate'

export const metadata: Metadata = {
  title: 'Risk Quantification — FAIR Model Cloud Exposure Scoring | Onam',
  description: 'Put a dollar value on every cloud security finding. Onam uses the FAIR model to estimate financial exposure, regulatory fines, and blast radius for every risk in your environment.',
}

export default function RiskPage() {
  return (
    <ProductPageTemplate
      icon={TrendingUp}
      iconColor="text-pink-400"
      iconBg="bg-pink-500/10"
      label="Risk Quantification"
      question="What does your current cloud attack surface actually cost if it is breached?"
      headline="CVSS scores tell you severity. FAIR tells you the dollar amount on the table."
      sub="Onam's Risk engine applies the FAIR (Factor Analysis of Information Risk) model to every finding in your cloud environment — converting technical misconfigurations into business-language financial exposure estimates your board can act on."
      painPoint="Your CSPM tool has 847 open findings. Your vulnerability scanner added 2,300 CVEs. Your security team has capacity to fix 40 issues this sprint. Which 40? CVSS scores rank vulnerabilities by technical severity — a 9.8 is worse than a 7.4. But a 9.8 on an isolated development server with no network path to production carries almost zero business risk. Meanwhile, a 5.9 misconfiguration in your payment processing flow could expose you to a $50 million regulatory fine. The CVSS score alone cannot tell you that. Risk quantification does."
      mechanism="Onam's Risk engine reads every finding from CSPM, attack path, CIEM, vulnerability, and CDR engines and runs each one through a FAIR model pipeline. The pipeline estimates: (1) Threat event frequency — how often this type of finding is actually exploited in the wild, using KEV and EPSS data. (2) Vulnerability probability — given the finding, what is the probability a threat actor would succeed. (3) Primary loss magnitude — direct costs of a successful exploit: data recovery, incident response, breach notification. (4) Secondary loss magnitude — regulatory fines estimated per applicable compliance framework (GDPR €20M, HIPAA $1.9M per category, PCI-DSS up to $500K per month), reputational damage, and customer churn models. The output: every finding gets a dollar-value risk score with confidence intervals, a blast radius asset count, and a normalized risk reduction score so you can compare and rank across entirely different finding types."
      whatYouGet={[
        'FAIR model scoring — dollar-denominated primary and secondary loss estimates for every finding',
        'Regulatory fine projection — per-framework fine exposure (GDPR, HIPAA, PCI-DSS, SOX) linked to specific findings',
        'Blast radius quantification — how many assets, users, and data records are affected if this finding is exploited',
        'Risk reduction ranking — prioritize the fix that reduces the most dollar exposure per engineering hour',
        'Crown jewel risk multipliers — findings that touch crown jewel assets carry boosted exposure scores',
        'Trend analysis — track your total dollar exposure over time as fixes close and new findings open',
        'Executive risk dashboard — board-ready summary: total exposure, top-10 risks by dollar value, trend over 90 days',
        'Compliance cost mapping — see exactly which regulatory frameworks apply to each finding and what the fine exposure is',
      ]}
      faqs={[
        {
          question: 'What is the FAIR model and why does Onam use it?',
          answer: 'FAIR (Factor Analysis of Information Risk) is the only internationally recognized quantitative model for information security risk. It is the standard behind the Open FAIR standard published by The Open Group, and it is what risk-mature organizations use to translate technical findings into financial terms. Onam uses FAIR because CVSS scores measure technical exploitability, not business impact — and business impact is what actually drives prioritization decisions at the board level.',
        },
        {
          question: 'How accurate are the dollar estimates?',
          answer: 'Risk estimates are probabilistic ranges, not point predictions — FAIR outputs a loss exceedance curve showing the 10th, 50th, and 90th percentile outcomes. The inputs are calibrated using: industry breach cost data from IBM/Ponemon studies, regulatory fine history from public enforcement actions, and your environment-specific factors (cloud spend, data record counts, revenue). The goal is defensible prioritization, not forensic accounting — and for that purpose, even order-of-magnitude accuracy dramatically outperforms CVSS-only ranking.',
        },
        {
          question: 'Do I need to provide financial data about my company?',
          answer: 'No. Onam uses industry-average estimates calibrated to your cloud footprint size, data classification results, and applicable compliance frameworks. You can optionally provide revenue, data record counts, and crown jewel asset designations to increase accuracy — but the engine produces useful estimates from day one without any additional input.',
        },
        {
          question: 'How does risk quantification integrate with the rest of Onam?',
          answer: 'The Risk engine reads findings from all other engines and writes risk scores back to the unified findings layer. This means risk context is visible throughout the platform: attack path analysis shows the dollar exposure at the end of each path, CIEM shows the financial blast radius of each overprivileged identity, and the vulnerability engine ranks CVEs by dollar exposure rather than CVSS score alone.',
        },
      ]}
      relatedHrefs={[
        { label: 'Attack Path Analysis', href: '/platform/attack-path' },
        { label: 'Compliance',           href: '/platform/compliance'  },
        { label: 'CSPM — Posture',       href: '/platform/cspm'        },
        { label: 'CDR — Detection',      href: '/platform/cdr'         },
      ]}
    />
  )
}
