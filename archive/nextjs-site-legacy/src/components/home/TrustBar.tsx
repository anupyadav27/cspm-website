import Link from 'next/link'
import { ShieldCheck, Lock, Globe, Clock } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'

const trust = [
  { Icon: ShieldCheck, label: 'SOC 2 Type II',    sub: 'Audited annually · report on request',   href: '/docs/trust/trust-center'        },
  { Icon: Lock,        label: 'ISO 27001',         sub: 'Information security certified',          href: '/docs/trust/trust-center'        },
  { Icon: Globe,       label: 'GDPR compliant',    sub: 'EU data residency · DPA available',       href: '/privacy'                        },
  { Icon: Clock,       label: '99.9% uptime SLA',  sub: 'status.onam.security — live status',     href: 'https://status.onam.security'    },
]

const frameworks = [
  'CIS AWS', 'CIS Azure', 'CIS GCP', 'NIST 800-53',
  'ISO 27001', 'PCI-DSS v4', 'HIPAA', 'GDPR',
  'SOC 2', 'FedRAMP', 'CSA CCM v4', 'DORA', 'MAS TRM',
]

export function TrustBar() {
  return (
    <section className="py-20 bg-slate-50 border-y border-slate-100">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          question="Security and compliance"
          headline="Built to meet your security team's requirements."
          sub="Onam is designed for security-conscious organisations. We hold ourselves to the same standards we help you meet."
          theme="light"
          className="mb-12"
        />

        {/* Trust badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {trust.map(({ Icon, label, sub, href }) => (
            <Link
              key={label}
              href={href}
              className="group bg-white rounded-2xl border border-slate-200 px-5 py-6 flex flex-col items-center text-center gap-3 hover:border-brand-300 hover:shadow-md transition-all"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                <Icon className="w-6 h-6 text-brand-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">{label}</div>
                <div className="text-xs text-slate-600 mt-1 leading-snug">{sub}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Compliance framework grid */}
        <div className="text-center mb-5">
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
            Compliance frameworks — always audit-ready
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {frameworks.map(f => (
            <span
              key={f}
              className="px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:border-brand-200 hover:text-brand-600 transition-colors cursor-default"
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
