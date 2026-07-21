import type { Metadata } from 'next'
import { BookOpen, FileText, ArrowRight, Plug, ShieldCheck, Layout, Lock } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Guides, documentation, and technical references for cloud security practitioners.',
}

const docSections = [
  {
    heading: 'Connect Your Cloud',
    Icon: Plug,
    iconColor: 'text-brand-400',
    iconBg: 'bg-brand-500/10',
    description: 'Step-by-step onboarding guides for every supported cloud provider.',
    links: [
      { label: 'Amazon Web Services (AWS)',   href: '/docs/onboarding/aws'      },
      { label: 'Microsoft Azure',             href: '/docs/onboarding/azure'    },
      { label: 'Google Cloud Platform',       href: '/docs/onboarding/gcp'      },
      { label: 'Oracle Cloud (OCI)',          href: '/docs/onboarding/oci'      },
      { label: 'Alibaba Cloud',              href: '/docs/onboarding/alicloud' },
      { label: 'IBM Cloud',                  href: '/docs/onboarding/ibm'      },
    ],
  },
  {
    heading: 'Security Capabilities',
    Icon: ShieldCheck,
    iconColor: 'text-csm-cyan',
    iconBg: 'bg-csm-cyan/10',
    description: 'Deep-dives on each security engine — what it checks, how it works, and how to read results.',
    links: [
      { label: 'CIEM — Identity & Entitlements',  href: '/docs/features/ciem'                    },
      { label: 'Vulnerability Management',         href: '/docs/features/vulnerability-management' },
      { label: 'Container Security',              href: '/docs/features/container-security'       },
      { label: 'Data Security (DSPM)',             href: '/docs/features/data-security'            },
      { label: 'Network Security',                href: '/docs/features/network-security'         },
      { label: 'IaC and SecOps Scanning',         href: '/docs/features/iac-scanning'             },
    ],
  },
  {
    heading: 'Architecture and Reference',
    Icon: Layout,
    iconColor: 'text-violet-400',
    iconBg: 'bg-violet-500/10',
    description: 'Platform architecture, API reference, and integration catalogue for technical teams.',
    links: [
      { label: 'Platform Architecture Overview', href: '/docs/architecture/overview'         },
      { label: 'Compliance Framework Coverage',  href: '/docs/compliance/framework-coverage' },
      { label: 'API Reference',                  href: '/docs/reference/api-reference'        },
      { label: 'RBAC and SSO',                   href: '/docs/reference/rbac-and-sso'         },
      { label: 'Integration Catalogue',          href: '/docs/reference/integration-catalog'  },
    ],
  },
  {
    heading: 'Trust and Security',
    Icon: Lock,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10',
    description: 'How Onam handles your data, our SLA commitments, and our compliance posture.',
    links: [
      { label: 'Trust Center',          href: '/docs/trust/trust-center'   },
      { label: 'Data Retention Policy', href: '/docs/trust/data-retention'  },
      { label: 'SLA and SLO Reference', href: '/docs/trust/sla-and-slo'     },
    ],
  },
]

export default function ResourcesPage() {
  return (
    <main className="pt-20 bg-navy-900 min-h-screen">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            question="What are you looking for?"
            headline="Guides, docs, and technical references"
            sub="Everything you need to connect your cloud, understand your findings, and get the most out of the platform."
            className="mb-14"
          />

          {/* Primary resource cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <a href="/docs" className="group flex items-start gap-4 bg-navy-800 border border-navy-600 hover:border-navy-500 rounded-2xl p-7 card-hover transition-colors">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-brand-400" />
              </div>
              <div>
                <div className="text-base font-semibold text-white mb-1">Full Documentation</div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Platform architecture, onboarding guides for all 6 cloud providers, API reference, RBAC setup, and release notes.
                </p>
                <div className="mt-3 flex items-center gap-1 text-brand-400 text-sm font-medium group-hover:gap-2 transition-all">
                  Browse docs <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </a>

            <a href="/resources/blog" className="group flex items-start gap-4 bg-navy-800 border border-navy-600 hover:border-navy-500 rounded-2xl p-7 card-hover transition-colors">
              <div className="w-12 h-12 rounded-xl bg-csm-cyan/10 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-csm-cyan" />
              </div>
              <div>
                <div className="text-base font-semibold text-white mb-1">Blog</div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Deep dives on cloud security, MITRE ATT&amp;CK cloud mappings, and practical guides for security practitioners.
                </p>
                <div className="mt-3 flex items-center gap-1 text-csm-cyan text-sm font-medium group-hover:gap-2 transition-all">
                  Read articles <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </a>
          </div>

          {/* Documentation category grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {docSections.map(sec => (
              <div key={sec.heading} className="bg-navy-800 border border-navy-600 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-lg ${sec.iconBg} flex items-center justify-center shrink-0`}>
                    <sec.Icon className={`w-4 h-4 ${sec.iconColor}`} />
                  </div>
                  <span className="text-sm font-semibold text-white">{sec.heading}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{sec.description}</p>
                <ul className="space-y-2">
                  {sec.links.map(l => (
                    <li key={l.href}>
                      <a href={l.href} className="text-xs text-slate-400 hover:text-white hover:underline transition-colors">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 border-t border-white/[0.05] bg-navy-800/50 text-center">
        <h2 className="text-xl font-bold text-white mb-3">Can&apos;t find what you need?</h2>
        <p className="text-slate-400 mb-6 text-sm">Our security engineers are happy to help.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button href="/request-demo" size="md">Book a live demo <ArrowRight className="w-4 h-4" /></Button>
          <Button href="/company/contact" size="md" variant="secondary">Contact us</Button>
        </div>
      </section>
    </main>
  )
}
