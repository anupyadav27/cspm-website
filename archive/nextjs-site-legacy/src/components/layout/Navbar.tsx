'use client'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ChevronDown, Menu, X, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PLATFORM_URL } from '@/lib/config'

/* ── nav data ─────────────────────────────────────────────────────── */

const platform = {
  label: 'Platform',
  columns: [
    {
      heading: 'Security Posture',
      items: [
        { label: 'CSPM',              href: '/platform/cspm',              sub: 'Misconfigurations across all clouds'    },
        { label: 'CIEM',              href: '/platform/ciem',              sub: 'Identity & entitlement analysis'        },
        { label: 'IAM Security',      href: '/platform/iam',               sub: 'Policies, users, and privilege risk'    },
      ],
    },
    {
      heading: 'Threat & Attack',
      items: [
        { label: 'Attack Path',       href: '/platform/attack-path',       sub: 'Crown jewels, toxic combos, attack graphs'  },
        { label: 'CDR — Detection',   href: '/platform/cdr',               sub: 'L1/L2/L3 behavioral threat detection'       },
        { label: 'Threat Detection',  href: '/platform/threat-detection',  sub: 'MITRE ATT&CK–mapped attack chains'          },
      ],
    },
    {
      heading: 'Network & Data',
      items: [
        { label: 'Network Security',  href: '/platform/network-security',  sub: '7-layer topology analysis'             },
        { label: 'Data Security',     href: '/platform/data-security',     sub: 'Where your sensitive data lives'       },
        { label: 'AI Security',       href: '/platform/ai-security',       sub: 'SageMaker, Bedrock, and AI/ML risk'    },
      ],
    },
    {
      heading: 'Workloads & Code',
      items: [
        { label: 'Container Security',href: '/platform/container-security',sub: 'EKS, ECS, and image scanning'          },
        { label: 'Vulnerability Mgmt',href: '/platform/vulnerability',     sub: 'CVEs in context, not just CVSS scores' },
        { label: 'Code Security',     href: '/platform/secops',            sub: 'SAST, DAST, SCA, IaC — 2,852 rules'   },
      ],
    },
    {
      heading: 'Risk & Governance',
      items: [
        { label: 'Risk Quantification',href: '/platform/risk',             sub: 'FAIR model — dollar-value exposure'    },
        { label: 'Compliance',         href: '/platform/compliance',       sub: '13 frameworks, always audit-ready'     },
        { label: 'Technology Engine',  href: '/platform/technology',       sub: '34 technologies, runtime discovery'    },
      ],
    },
  ],
}

const solutions = {
  label: 'Solutions',
  sections: [
    {
      heading: 'By cloud',
      items: [
        { label: 'Amazon Web Services', href: '/solutions/aws'        },
        { label: 'Microsoft Azure',     href: '/solutions/azure'      },
        { label: 'Google Cloud',        href: '/solutions/gcp'        },
        { label: 'Oracle Cloud (OCI)',   href: '/solutions/oci'        },
        { label: 'Alibaba Cloud',       href: '/solutions/alicloud'   },
        { label: 'Kubernetes / EKS',    href: '/solutions/kubernetes' },
      ],
    },
    {
      heading: 'By industry',
      items: [
        { label: 'Financial Services',  href: '/solutions/financial'   },
        { label: 'Healthcare',          href: '/solutions/healthcare'  },
        { label: 'Government',          href: '/solutions/government'  },
      ],
    },
  ],
}

const topLinks = [
  { label: 'Compliance', href: '/platform/compliance' },
  { label: 'Pricing',    href: '/pricing'             },
  { label: 'Resources',  href: '/resources'           },
]

/* ── component ───────────────────────────────────────────────────── */

export function Navbar() {
  const [open, setOpen] = useState<'platform' | 'solutions' | null>(null)
  const [mobile, setMobile] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <header ref={ref} className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] bg-navy-900/75 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.04)]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-20 gap-6">
        {/* Logo */}
        <a href="/" className="shrink-0 flex items-center" onClick={() => setOpen(null)}>
          <Image src="/logo.svg" alt="Onam Security" width={180} height={62} priority />
        </a>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-1 flex-1">
          {/* Platform dropdown */}
          <button
            className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition-colors ${open === 'platform' ? 'bg-navy-700 text-white' : 'text-slate-300 hover:text-white hover:bg-navy-700'}`}
            onClick={() => setOpen(open === 'platform' ? null : 'platform')}
          >
            {platform.label} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open === 'platform' ? 'rotate-180' : ''}`} />
          </button>

          {/* Solutions dropdown */}
          <button
            className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition-colors ${open === 'solutions' ? 'bg-navy-700 text-white' : 'text-slate-300 hover:text-white hover:bg-navy-700'}`}
            onClick={() => setOpen(open === 'solutions' ? null : 'solutions')}
          >
            {solutions.label} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open === 'solutions' ? 'rotate-180' : ''}`} />
          </button>

          {topLinks.map(l => (
            <a key={l.label} href={l.href}
              className="px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-navy-700 rounded-lg transition-colors"
              onClick={() => setOpen(null)}>
              {l.label}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-2 ml-auto">
          <a href={PLATFORM_URL} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors px-2">
            Log in <ExternalLink className="w-3 h-3" />
          </a>
          <Button href="/request-demo" size="sm">Request demo</Button>
        </div>

        {/* Mobile hamburger */}
        <button className="lg:hidden ml-auto p-2 text-slate-400 hover:text-white" onClick={() => setMobile(m => !m)}>
          {mobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Platform mega dropdown */}
      {open === 'platform' && (
        <div className="hidden lg:block border-t border-white/[0.06] bg-navy-950/90 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-5 gap-8">
            {platform.columns.map(col => (
              <div key={col.heading}>
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">{col.heading}</div>
                <div className="space-y-1">
                  {col.items.map(item => (
                    <a key={item.href} href={item.href} onClick={() => setOpen(null)}
                      className="block px-3 py-2 rounded-lg hover:bg-navy-700 group transition-colors">
                      <div className="text-sm font-medium text-slate-100 group-hover:text-white">{item.label}</div>
                      <div className="text-xs text-slate-400 group-hover:text-slate-300 mt-0.5">{item.sub}</div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Solutions dropdown */}
      {open === 'solutions' && (
        <div className="hidden lg:block border-t border-white/[0.06] bg-navy-950/90 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 gap-12 max-w-xl">
            {solutions.sections.map(sec => (
              <div key={sec.heading}>
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">{sec.heading}</div>
                <div className="space-y-1">
                  {sec.items.map(item => (
                    <a key={item.href} href={item.href} onClick={() => setOpen(null)}
                      className="block px-3 py-2 rounded-lg hover:bg-navy-700 text-sm text-slate-200 hover:text-white transition-colors">
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobile && (
        <div className="lg:hidden border-t border-navy-600 bg-navy-900 px-4 py-4 space-y-1">
          <div className="text-xs uppercase tracking-widest text-slate-400 px-3 mb-2">Platform</div>
          {platform.columns.flatMap(c => c.items).map(item => (
            <a key={item.href} href={item.href} onClick={() => setMobile(false)}
              className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-navy-700 rounded-lg transition-colors">
              {item.label}
            </a>
          ))}
          <div className="text-xs uppercase tracking-widest text-slate-400 px-3 mt-3 mb-2">Solutions</div>
          {solutions.sections.flatMap(s => s.items).map(item => (
            <a key={item.href} href={item.href} onClick={() => setMobile(false)}
              className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-navy-700 rounded-lg transition-colors">
              {item.label}
            </a>
          ))}
          {topLinks.map(l => (
            <a key={l.label} href={l.href} onClick={() => setMobile(false)}
              className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-navy-700 rounded-lg transition-colors">
              {l.label}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <a href={PLATFORM_URL} target="_blank" rel="noopener noreferrer"
              className="w-full text-center px-4 py-2.5 text-sm text-slate-300 border border-navy-600 rounded-lg hover:bg-navy-700 transition-colors">
              Log in
            </a>
            <Button href="/request-demo" className="w-full justify-center" onClick={() => setMobile(false)}>
              Request demo
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
