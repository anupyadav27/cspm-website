import type { Metadata } from 'next'
import { CheckCircle2, X, Minus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FaqAccordion } from '@/components/ui/FaqAccordion'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Straightforward pricing for cloud security. Try it free, no credit card required.',
}

const tiers = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    tagline: 'Connect one account and start finding misconfigurations — no time limit, no credit card.',
    cta: 'Start free',
    href: '/request-demo',
    highlight: false,
    features: [
      '1 cloud account',
      'Up to 500 resources',
      'Core CSPM rules (Critical & High)',
      'CIS benchmark coverage',
      '30-day finding history',
      'Community support',
    ],
    limitations: [
      'CIEM and threat detection not included',
      'Compliance report export not included',
      'Team access and SSO not included',
    ],
  },
  {
    name: 'Pro',
    price: '$499',
    period: '/month',
    perResource: '$22 / resource / month',
    tagline: 'All 16+ security engines. Unlimited accounts. Platform fee + $22 per resource, billed monthly.',
    cta: 'Start 14-day free trial',
    href: '/request-demo',
    highlight: true,
    features: [
      'Unlimited cloud accounts',
      '$22 / resource / month (pay-as-you-go)',
      'All 16+ security engines',
      'All 13 compliance frameworks',
      'CIEM and identity attack paths',
      'Threat detection — MITRE ATT&CK mapped',
      'Network security — 7-layer topology',
      'Vulnerability management with EPSS scoring',
      '1-year finding history',
      'Email and Slack notifications',
      'REST API access',
      'Email support (< 24 h response)',
    ],
    limitations: [],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    tagline: 'For regulated organisations that need contractual SLAs, custom frameworks, and dedicated support.',
    cta: 'Talk to us',
    href: '/company/contact',
    highlight: false,
    features: [
      'Everything in Pro',
      'Multi-tenant organisation support',
      'Custom compliance framework builder',
      'SSO / SAML 2.0 integration',
      'RBAC with custom roles',
      'Dedicated security engineer',
      'On-premises deployment option',
      'Custom data retention policy',
      'Contractual 99.9% uptime SLA',
      'Priority support (< 4 h response)',
      'Quarterly posture review',
      'Custom contract and invoicing',
    ],
    limitations: [],
  },
]

type Cell = true | false | string

const comparison: { feature: string; starter: Cell; pro: Cell; enterprise: Cell }[] = [
  { feature: 'Cloud accounts',           starter: '1',          pro: 'Unlimited',  enterprise: 'Unlimited'  },
  { feature: 'Resources scanned',        starter: '500',        pro: '$22/resource/mo', enterprise: 'Custom pricing' },
  { feature: 'Security engines',         starter: 'CSPM only',  pro: 'All 16+',    enterprise: 'All 16+'    },
  { feature: 'Compliance frameworks',    starter: 'CIS only',   pro: 'All 13',     enterprise: 'All 13 + custom' },
  { feature: 'CIEM & identity paths',    starter: false,        pro: true,         enterprise: true         },
  { feature: 'Threat detection (MITRE)', starter: false,        pro: true,         enterprise: true         },
  { feature: 'Network topology (7-layer)',starter: false,       pro: true,         enterprise: true         },
  { feature: 'Vulnerability + EPSS',     starter: false,        pro: true,         enterprise: true         },
  { feature: 'Compliance report export', starter: false,        pro: true,         enterprise: true         },
  { feature: 'REST API access',          starter: false,        pro: true,         enterprise: true         },
  { feature: 'SSO / SAML 2.0',          starter: false,        pro: false,        enterprise: true         },
  { feature: 'Custom roles (RBAC)',      starter: false,        pro: false,        enterprise: true         },
  { feature: 'Dedicated engineer',       starter: false,        pro: false,        enterprise: true         },
  { feature: 'Contractual SLA',          starter: false,        pro: false,        enterprise: '99.9%'      },
  { feature: 'Finding history',          starter: '30 days',    pro: '1 year',     enterprise: 'Custom'     },
  { feature: 'Support',                  starter: 'Community',  pro: 'Email <24h', enterprise: 'Dedicated <4h' },
]

const faqs = [
  {
    question: 'Do I need to install any agents or make code changes?',
    answer: 'No. Onam is fully agentless for cloud posture, identity, network, and compliance scanning. You give us read-only access via an IAM role, service principal, or service account. Nothing is installed in your environment. Vulnerability scanning on EC2 instances uses an optional lightweight agent for package-level accuracy.',
  },
  {
    question: 'What happens if I exceed the 500-resource limit on Starter?',
    answer: 'You can still log in and review existing findings. New scans pause until you upgrade or remove cloud accounts. We send a warning when you reach 80% of your limit so you have time to plan.',
  },
  {
    question: 'How long does the Pro free trial last?',
    answer: 'The Pro trial runs for 14 days with full access to all 16+ engines and all 13 compliance frameworks. No credit card is required to start. After 14 days, you choose to subscribe or drop to the Starter plan — your findings and history are preserved either way.',
  },
  {
    question: 'Can I switch plans at any time?',
    answer: 'Yes. Upgrades take effect immediately. Downgrades take effect at the end of your current billing period. There are no early-termination fees on monthly plans.',
  },
  {
    question: 'Does Onam store the contents of my data — files, database records, S3 objects?',
    answer: 'No. Onam stores finding metadata, resource identifiers, and configuration attributes — not the contents of your data. Our read-only access does not extend to data plane operations. See the Trust Center for the full data handling policy.',
  },
  {
    question: 'We have 20 AWS accounts across multiple business units. How does pricing work?',
    answer: "Pro covers unlimited accounts, so 20 accounts is no different from 2. For organisation-level consolidated billing, custom reporting per business unit, and hierarchical account grouping, Enterprise is the right fit. Get in touch and we'll work through the numbers together.",
  },
  {
    question: 'What happens to our data if we cancel?',
    answer: 'We retain your finding metadata for 30 days after cancellation to allow data export. After 30 days, all finding data, asset inventories, and scan history are permanently deleted from our systems. We can provide a deletion confirmation letter for GDPR purposes. Read-only credentials (IAM role ARNs) should be deleted from your cloud accounts — we provide a deletion checklist on offboarding.',
  },
  {
    question: 'Does the Pro plan include SSO?',
    answer: 'SSO / SAML 2.0 is currently available on the Enterprise plan. If your team requires SSO on Pro, contact us — we can discuss an early-access arrangement. We are evaluating adding SSO to Pro in 2026 based on demand.',
  },
]

function CellValue({ val }: { val: Cell }) {
  if (val === true)  return <CheckCircle2 className="w-5 h-5 text-csm-green mx-auto" />
  if (val === false) return <X className="w-4 h-4 text-slate-700 mx-auto" />
  if (val === '')    return <Minus className="w-4 h-4 text-slate-700 mx-auto" />
  return <span className="text-xs text-slate-200 text-center block">{val}</span>
}

export default function PricingPage() {
  return (
    <main className="pt-20 bg-navy-900 min-h-screen">

      {/* Header */}
      <section className="py-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-3">Pricing</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
          Straightforward pricing.<br className="hidden sm:block" /> Platform fee + pay per resource.
        </h1>
        <p className="text-lg text-slate-300 max-w-xl mx-auto leading-relaxed mb-6">
          Start free with no time limit. Scale to Pro when you need all 16+ engines. Enterprise for regulated organisations with SLA requirements.
        </p>
        {/* Annual billing callout */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-csm-green/30 bg-csm-green/10 text-csm-green text-sm font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-csm-green"></span>
          Annual billing saves 20% — Pro at $399/month ($4,788/year) · Enterprise custom
        </div>
      </section>

      {/* Tier cards */}
      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-6 items-start">
          {tiers.map(tier => (
            <div key={tier.name} className="relative">
              {tier.highlight && (
                <div className="absolute inset-0 -z-10 rounded-2xl bg-brand-500/20 blur-2xl scale-110 pointer-events-none" />
              )}
              <div
                className={`rounded-2xl p-7 flex flex-col gap-5 ${
                  tier.highlight
                    ? 'bg-white/[0.06] backdrop-blur-md border border-brand-500/60 shadow-[0_0_40px_rgba(99,102,241,0.25),inset_0_1px_0_rgba(255,255,255,0.1)]'
                    : 'glass-card'
                }`}>
                {tier.highlight && (
                  <div className="text-xs font-bold uppercase tracking-widest text-brand-300 bg-brand-500/20 border border-brand-500/40 rounded-full px-3 py-1 self-start">
                    Most popular
                  </div>
                )}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">{tier.name}</div>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold text-white">{tier.price}</span>
                    {tier.period && <span className="text-slate-300 text-sm mb-1">{tier.period}</span>}
                  </div>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(tier as any).perResource && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-500/10 border border-brand-500/25">
                      <span className="text-[11px] font-bold text-brand-300">+</span>
                      <span className="text-[11px] font-semibold text-brand-300 tracking-tight">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {(tier as any).perResource}
                      </span>
                    </div>
                  )}
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">{tier.tagline}</p>
                </div>
                <Button href={tier.href} variant={tier.highlight ? 'primary' : 'secondary'} className="w-full justify-center">
                  {tier.cta} <ArrowRight className="w-4 h-4" />
                </Button>
                <ul className="space-y-2 flex-1">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-csm-green shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                  {tier.limitations.map(l => (
                    <li key={l} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5 text-slate-700">–</span>
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="pb-20 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto px-6 pt-16">
          <h2 className="text-2xl font-bold text-white text-center mb-10">Full feature comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-xs font-semibold uppercase tracking-widest text-slate-400 pb-4 pr-6 w-1/2">Feature</th>
                  {['Starter', 'Pro', 'Enterprise'].map((t, i) => (
                    <th key={t} className={`text-center pb-4 px-4 text-sm font-bold ${i === 1 ? 'text-brand-300' : 'text-white'}`}>{t}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={row.feature} className={`border-t ${i % 2 === 0 ? 'border-white/[0.04] bg-navy-800/20' : 'border-white/[0.04]'}`}>
                    <td className="py-3 pr-6 text-slate-300">{row.feature}</td>
                    <td className="py-3 px-4 text-center"><CellValue val={row.starter} /></td>
                    <td className="py-3 px-4 text-center bg-brand-500/[0.04]"><CellValue val={row.pro} /></td>
                    <td className="py-3 px-4 text-center"><CellValue val={row.enterprise} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t border-white/[0.05] bg-navy-800/50">
        <div className="max-w-3xl mx-auto px-6">
          <FaqAccordion
            eyebrow="Pricing questions"
            title="Things people ask before they sign up"
            items={faqs}
            variant="dark"
            className="mb-0"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy-900 text-center border-t border-white/[0.05]">
        <h2 className="text-2xl font-bold text-white mb-3">Still not sure which plan fits?</h2>
        <p className="text-slate-300 mb-7 max-w-md mx-auto text-sm">
          Talk to a security engineer. We will look at your environment together and tell you exactly what makes sense — no sales pressure.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Button href="/request-demo" size="md">
            Start free — no credit card <ArrowRight className="w-4 h-4" />
          </Button>
          <Button href="/company/contact" variant="secondary" size="md">
            Talk to an engineer
          </Button>
        </div>
      </section>

    </main>
  )
}
