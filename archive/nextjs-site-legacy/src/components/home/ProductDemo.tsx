'use client'

import { useState } from 'react'
import Image from 'next/image'
import { SectionHeader } from '@/components/ui/SectionHeader'

const tabs = [
  {
    id: 'dashboard',
    label: 'Overview',
    group: 'Platform',
    caption: 'Single pane of glass — risk score, engine status, compliance posture and top criticals at a glance.',
    img: '/screenshots/screenshot-dashboard.png',
    badge: { text: 'Risk Score: 68', color: '#f97316' },
  },
  {
    id: 'onboarding',
    label: 'Onboarding',
    group: 'Platform',
    caption: 'Connect any cloud in under 3 minutes. Read-only IAM role, no agents, no long-lived credentials.',
    img: '/screenshots/screenshot-onboarding.png',
    badge: { text: 'AWS connected', color: '#10b981' },
  },
  {
    id: 'findings',
    label: 'Findings',
    group: 'Security',
    caption: '847 prioritised findings from 9 engines — sorted by real risk, not noise. One click to remediation.',
    img: '/screenshots/screenshot-findings.png',
    badge: { text: '12 CRITICAL', color: '#dc2626' },
  },
  {
    id: 'attack-path',
    label: 'Attack Path',
    group: 'Security',
    caption: 'Follow every privilege escalation chain. Click any node to see the MITRE ATT&CK technique and fix.',
    img: '/screenshots/screenshot-attack-path.png',
    badge: { text: '3 paths to crown jewels', color: '#dc2626' },
  },
  {
    id: 'iam',
    label: 'IAM',
    group: 'Security',
    caption: '189 identities scanned — 47 overprivileged, 3 admin wildcards, root MFA missing. Fix list included.',
    img: '/screenshots/screenshot-iam.png',
    badge: { text: '47 overprivileged roles', color: '#f97316' },
  },
  {
    id: 'network',
    label: 'Network',
    group: 'Security',
    caption: 'VPC topology map, security group violations, internet-exposed resources — all from one agentless scan.',
    img: '/screenshots/screenshot-network.png',
    badge: { text: '7 internet-exposed', color: '#dc2626' },
  },
  {
    id: 'cdr',
    label: 'Detection',
    group: 'Security',
    caption: '2.3M CloudTrail + VPC Flow events processed. MITRE ATT&CK mapped alerts, streamed in real time.',
    img: '/screenshots/screenshot-cdr.png',
    badge: { text: '4 critical alerts · Live', color: '#dc2626' },
  },
  {
    id: 'container',
    label: 'Container',
    group: 'Security',
    caption: 'EKS CVE findings with EPSS scores, K8s RBAC violations, runtime security events — all in one view.',
    img: '/screenshots/screenshot-container.png',
    badge: { text: '3 CVEs with active exploits', color: '#dc2626' },
  },
  {
    id: 'compliance',
    label: 'Compliance',
    group: 'Governance',
    caption: 'CIS · NIST · SOC 2 · HIPAA · PCI-DSS · ISO 27001 — scored live. One finding maps to 6 frameworks.',
    img: '/screenshots/screenshot-compliance.png',
    badge: { text: '6 frameworks', color: '#6366f1' },
  },
  {
    id: 'datasec',
    label: 'Data Security',
    group: 'Governance',
    caption: '847K PII records classified across S3. Public buckets with SSN and credit card data surfaced immediately.',
    img: '/screenshots/screenshot-datasec.png',
    badge: { text: '3 public buckets with PII', color: '#dc2626' },
  },
  {
    id: 'risk',
    label: 'Risk & FAIR',
    group: 'Governance',
    caption: 'Dollar-denominated annual loss expectancy from the FAIR model. Fix the $2.4M exposure first.',
    img: '/screenshots/screenshot-risk.png',
    badge: { text: '$2.4M–$8.7M ALE', color: '#0ea5e9' },
  },
]

const groups = ['Platform', 'Security', 'Governance']

export function ProductDemo() {
  const [active, setActive] = useState(0)
  const tab = tabs[active]

  return (
    <section className="py-20 bg-slate-50/70 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          question="See it in action"
          headline="Every security view your team needs."
          sub="Real product screenshots — Acme Corp test tenant with dummy data. Click any tab."
          theme="light"
          className="mb-10"
        />

        {/* Group tabs */}
        <div className="flex flex-col gap-3 mb-8">
          {groups.map(group => {
            const groupTabs = tabs.filter(t => t.group === group)
            return (
              <div key={group} className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest w-20 flex-shrink-0 text-right">
                  {group}
                </span>
                <div className="flex gap-1 flex-wrap">
                  {groupTabs.map((t) => {
                    const i = tabs.indexOf(t)
                    return (
                      <button
                        key={t.id}
                        onClick={() => setActive(i)}
                        className={[
                          'px-4 py-2 rounded-lg text-sm font-semibold transition-all border',
                          i === active
                            ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900',
                        ].join(' ')}
                      >
                        {t.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Screenshot frame */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-slate-50">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 border-b border-slate-200">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <div className="ml-3 flex-1 max-w-sm bg-white rounded-md text-xs text-slate-400 px-3 py-1 border border-slate-200">
              app.onam.security / {tab.id}
            </div>
            <span
              className="ml-auto text-xs font-bold px-3 py-1 rounded-full text-white"
              style={{ background: tab.badge.color }}
            >
              {tab.badge.text}
            </span>
          </div>

          {/* Screenshot */}
          <div className="relative w-full" style={{ aspectRatio: '1440/900' }}>
            <Image
              src={tab.img}
              alt={`Onam Security — ${tab.label}`}
              fill
              className="object-cover object-top"
              quality={95}
              priority={active === 0}
            />
          </div>
        </div>

        {/* Caption */}
        <div className="flex items-center justify-between mt-5 px-1">
          <p className="text-slate-400 text-sm max-w-2xl">{tab.caption}</p>
          <a
            href="/platform"
            className="text-brand-500 text-sm font-semibold hover:underline whitespace-nowrap ml-4"
          >
            Explore platform →
          </a>
        </div>
      </div>
    </section>
  )
}
