import { X, Check } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'

const comparisons = [
  {
    versus: 'Native cloud tools',
    examples: 'AWS Security Hub · Azure Defender · GCP SCC',
    theirs: [
      'Covers only one cloud provider',
      'No cross-cloud attack path analysis',
      'Separate consoles, separate remediation queues',
      'No CIEM or identity behavioral analysis',
      'Compliance evidence requires manual assembly',
    ],
    ours: [
      'All 7 clouds in one unified posture score',
      'Cross-cloud attack paths and toxic combinations',
      'Single remediation queue ranked by blast radius',
      'CIEM with 30-day behavioral baselines',
      'One-click compliance evidence export for 13 frameworks',
    ],
  },
  {
    versus: 'Single-layer security tools',
    examples: 'Standalone CSPM · Config scanners · One-cloud tools',
    theirs: [
      'Posture only — no identity, threat, or code layer',
      'Findings ranked by CVSS, not business impact',
      'No attack path or crown jewel analysis',
      'No FAIR-model financial risk quantification',
      'Separate tools needed for DAST, SCA, and IaC',
    ],
    ours: [
      '16+ engines: posture, identity, threat, code, risk',
      'FAIR model assigns dollar value to every finding',
      'Attack path graph — toxic combos surface automatically',
      'Risk score prioritises by blast radius, not just severity',
      'SAST + DAST + SCA + IaC all in one platform',
    ],
  },
  {
    versus: 'Quarterly pen tests & audits',
    examples: 'Point-in-time assessments · Manual audits',
    theirs: [
      'Snapshot in time — misses what changed yesterday',
      'Results arrive weeks after the assessment',
      'No continuous monitoring between assessments',
      'Evidence gathering for audits is still manual',
      'Findings are not linked to compliance frameworks',
    ],
    ours: [
      'Continuous scanning — finds drift within minutes',
      'Findings appear in under 8 minutes, not weeks',
      'L1/L2/L3 behavioral CDR runs 24/7 between scans',
      'Compliance evidence always current, never stale',
      'Every finding mapped to CIS, NIST, SOC 2, HIPAA, and 9 more',
    ],
  },
]

export function Differentiator() {
  return (
    <section className="py-24 bg-navy-950">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          question="Why Onam?"
          headline="What every other approach gets wrong — and what we do instead."
          sub="Enterprise security teams have tried native tools, point solutions, and annual audits. Here is why they come to Onam after all three."
          className="mb-14"
        />

        <div className="grid lg:grid-cols-3 gap-6">
          {comparisons.map((c) => (
            <div key={c.versus} className="rounded-2xl border border-navy-600 bg-navy-900 overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-navy-600">
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">vs.</div>
                <div className="text-base font-bold text-white font-display mb-1">{c.versus}</div>
                <div className="text-xs text-slate-400">{c.examples}</div>
              </div>

              <div className="p-6 grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Their approach</div>
                  <div className="space-y-2.5">
                    {c.theirs.map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <X className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-300 leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-3">With Onam</div>
                  <div className="space-y-2.5">
                    {c.ours.map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-100 leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          Not convinced? Compare findings side-by-side with your current tool after your first free scan.
        </p>
      </div>
    </section>
  )
}
