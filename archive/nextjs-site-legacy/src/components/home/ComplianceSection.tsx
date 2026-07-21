import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { COMPLIANCE_FRAMEWORKS } from '@/lib/config'

const categoryColors: Record<string, string> = {
  Benchmark:  'border-brand-500/30 bg-brand-500/5  text-brand-400',
  Regulation: 'border-csm-red/30  bg-csm-red/5    text-csm-red',
  Standard:   'border-csm-green/30 bg-csm-green/5 text-csm-green',
  Framework:  'border-csm-amber/30 bg-csm-amber/5 text-csm-amber',
}

export function ComplianceSection() {
  return (
    <section className="py-24 bg-navy-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <div>
            <SectionHeader
              question="Will this help with my audit?"
              headline="Your auditor wants evidence. We give you the report."
              align="left"
            />
            <p className="mt-5 text-slate-300 leading-relaxed">
              Three weeks before your SOC 2 audit, you shouldn&apos;t be manually pulling screenshots
              from five different tools. Onam maps every finding to your compliance frameworks in
              real time, so you always know your exact posture — and can export the evidence your
              auditor needs in one click.
            </p>
            <p className="mt-4 text-slate-300 leading-relaxed">
              You&apos;ll also know <em className="text-white">why</em> something is failing,
              not just that it is — with the exact remediation step alongside the control reference.
            </p>
            <div className="mt-8 flex gap-3">
              <Button href="/platform/compliance" variant="primary" size="md">
                See compliance coverage
              </Button>
              <Button href="/docs/compliance/framework-coverage" variant="ghost" size="md">
                Framework details →
              </Button>
            </div>
          </div>

          {/* Right — framework grid */}
          <div>
            <div className="grid grid-cols-3 gap-2">
              {COMPLIANCE_FRAMEWORKS.map(f => (
                <div key={f.name}
                  className={`rounded-xl border px-3 py-3 text-center text-xs font-semibold ${categoryColors[f.category]}`}>
                  {f.name}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-4 flex-wrap">
              {Object.entries(categoryColors).map(([cat, cls]) => (
                <span key={cat} className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded border ${cls}`}>
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
