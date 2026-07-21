import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Users, Crosshair, Network, Database, Bug, Box, Cpu, CheckSquare, Layers, KeyRound, GitBranch, Activity, TrendingUp, Terminal } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { MultiCloudDiagram } from '@/components/diagrams/MultiCloudDiagram'

export const metadata: Metadata = {
  title: 'Platform Overview',
  description: '16+ security engines in one platform — CSPM, CIEM, IAM, Attack Path, CDR, Risk (FAIR model), Code Security, Network, Data, Vulnerability, Container, AI, Compliance, and Technology Engine.',
}

const capabilities = [
  { icon: ShieldCheck, label: 'CSPM',               href: '/platform/cspm',               color: 'text-brand-400',   bg: 'bg-brand-500/10',   desc: '1,918 CSPM rules'               },
  { icon: Users,       label: 'CIEM',               href: '/platform/ciem',               color: 'text-csm-cyan',    bg: 'bg-csm-cyan/10',    desc: 'Identity & entitlement'          },
  { icon: KeyRound,    label: 'IAM Security',       href: '/platform/iam',                color: 'text-yellow-400',  bg: 'bg-yellow-500/10',  desc: 'Users, roles, policies'          },
  { icon: Crosshair,   label: 'Threat Detection',   href: '/platform/threat-detection',   color: 'text-csm-red',     bg: 'bg-csm-red/10',     desc: 'MITRE ATT&CK–mapped'             },
  { icon: GitBranch,   label: 'Attack Path',        href: '/platform/attack-path',        color: 'text-red-400',     bg: 'bg-red-500/10',     desc: 'Crown jewels · Toxic combos'     },
  { icon: Activity,    label: 'CDR — Detection',    href: '/platform/cdr',                color: 'text-orange-400',  bg: 'bg-orange-500/10',  desc: 'L1/L2/L3 behavioral detection'  },
  { icon: TrendingUp,  label: 'Risk Quantification',href: '/platform/risk',               color: 'text-pink-400',    bg: 'bg-pink-500/10',    desc: 'FAIR model · Dollar exposure'    },
  { icon: Terminal,    label: 'Code Security',      href: '/platform/secops',             color: 'text-slate-300',   bg: 'bg-slate-500/10',   desc: 'SAST · DAST · SCA · 2,852 rules'},
  { icon: Network,     label: 'Network Security',   href: '/platform/network-security',   color: 'text-csm-purple',  bg: 'bg-csm-purple/10',  desc: '7-layer topology'                },
  { icon: Database,    label: 'Data Security',      href: '/platform/data-security',      color: 'text-csm-amber',   bg: 'bg-csm-amber/10',   desc: '62 data security rules'          },
  { icon: Bug,         label: 'Vulnerability',      href: '/platform/vulnerability',      color: 'text-csm-green',   bg: 'bg-csm-green/10',   desc: 'Context-aware CVE priority'      },
  { icon: Box,         label: 'Container Security', href: '/platform/container-security', color: 'text-blue-400',    bg: 'bg-blue-500/10',    desc: 'EKS, ECS, K8s'                  },
  { icon: Cpu,         label: 'AI Security',        href: '/platform/ai-security',        color: 'text-violet-400',  bg: 'bg-violet-500/10',  desc: 'SageMaker, Bedrock'              },
  { icon: CheckSquare, label: 'Compliance',         href: '/platform/compliance',         color: 'text-emerald-400', bg: 'bg-emerald-500/10', desc: '13 compliance frameworks'        },
  { icon: Layers,      label: 'Technology',         href: '/platform/technology',         color: 'text-slate-400',   bg: 'bg-slate-500/10',   desc: '34 tech categories, 5k rules'    },
]

export default function PlatformPage() {
  return (
    <main className="pt-20 bg-navy-900 min-h-screen">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
            One platform. Every angle<br />
            <span className="gradient-text">your cloud is exposed from.</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Security tools usually cover one layer well. Attackers don&apos;t stay in one layer.
            Onam&apos;s 16+ security engines — covering posture, identity, attack paths, behavioral
            detection, financial risk, code security, and compliance — connect into a single
            picture of your actual attack surface.
          </p>
          <Button href="/request-demo" size="lg">See it scan my cloud <ArrowRight className="w-4 h-4" /></Button>
        </div>
      </section>

      {/* Architecture diagram */}
      <section className="py-12 border-t border-navy-600 bg-navy-800/50">
        <div className="max-w-2xl mx-auto px-6">
          <SectionHeader
            question="How does everything connect?"
            headline="A connected platform, not a collection of tools"
            align="center"
            className="mb-10"
          />
          <MultiCloudDiagram />
        </div>
      </section>

      {/* Capability grid */}
      <section className="py-16 bg-navy-900">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            question="What does the platform cover?"
            headline="16+ security engines in one platform"
            align="center"
            className="mb-10"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {capabilities.map(c => {
              const Icon = c.icon
              return (
                <Link key={c.label} href={c.href}
                  className="group flex items-start gap-3 bg-navy-800 border border-navy-600 rounded-xl p-5 hover:border-navy-500 card-hover transition-colors">
                  <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4.5 h-4.5 ${c.color}`} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors">{c.label}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{c.desc}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 ml-auto shrink-0 mt-0.5 transition-colors" />
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-navy-600 bg-navy-800/50">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to see your full picture?</h2>
          <p className="text-slate-400 mb-7">Connect your cloud account in under 5 minutes. No agents, no commitment.</p>
          <div className="flex gap-3 justify-center">
            <Button href="/request-demo" size="md">Request demo</Button>
            <Button href="/pricing" variant="secondary" size="md">See pricing</Button>
          </div>
        </div>
      </section>
    </main>
  )
}
