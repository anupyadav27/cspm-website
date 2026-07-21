import { SectionHeader } from '@/components/ui/SectionHeader'

const testimonials = [
  {
    quote: 'We connected our AWS org on a Tuesday morning. By lunch we had a prioritised list of 340 findings — including three criticals we had no idea about. The CIEM analysis alone justified the entire evaluation.',
    outcome: '340 findings · 3 criticals · 10 minutes',
    role: 'Head of Cloud Security',
    company: 'Series B FinTech · AWS · 300 engineers',
    initials: 'HC',
    accentFrom: 'from-brand-500',
    accentTo: 'to-brand-700',
    outcomeColor: 'text-brand-300',
    outcomeBg: 'bg-brand-500/10 border-brand-500/20',
  },
  {
    quote: "Six IAM roles with full admin access that hadn't been used in over a year. Our manual reviews never caught that — we simply didn't have visibility at that level. They were removed before end of day.",
    outcome: '6 dormant admin roles — removed day one',
    role: 'DevSecOps Lead',
    company: 'SaaS Platform · AWS + GCP · 120 engineers',
    initials: 'DL',
    accentFrom: 'from-cyan-500',
    accentTo: 'to-cyan-700',
    outcomeColor: 'text-cyan-300',
    outcomeBg: 'bg-cyan-500/10 border-cyan-500/20',
  },
  {
    quote: 'Our previous SOC 2 cycle was three weeks of manual evidence gathering. With Onam the compliance report was already populated — our auditor asked how we had everything ready so quickly. Audit prep down 90%.',
    outcome: 'SOC 2 evidence ready in 48 hours',
    role: 'CISO',
    company: 'Healthcare Platform · HIPAA-regulated · Series C',
    initials: 'CI',
    accentFrom: 'from-emerald-500',
    accentTo: 'to-emerald-700',
    outcomeColor: 'text-emerald-300',
    outcomeBg: 'bg-emerald-500/10 border-emerald-500/20',
  },
]

export function Testimonials() {
  return (
    <section className="py-24 bg-navy-900 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          question="What teams find after their first scan"
          headline="Real findings. Real timelines."
          sub="What security teams discover in the first 24 hours with Onam."
          className="mb-14"
        />

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="flex flex-col rounded-2xl bg-navy-800 border border-navy-700 overflow-hidden"
              style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)' }}
            >
              {/* Gradient top accent bar */}
              <div className={`h-[3px] bg-gradient-to-r ${t.accentFrom} ${t.accentTo}`} />

              {/* Quote body */}
              <div className="px-6 pt-6 pb-5 flex-1">
                {/* Opening quote mark — large, colored */}
                <div
                  className={`text-4xl font-black leading-none mb-3 bg-gradient-to-br ${t.accentFrom} ${t.accentTo} bg-clip-text text-transparent`}
                  aria-hidden
                >
                  &ldquo;
                </div>
                <p className="text-[15px] text-slate-100 leading-[1.7] font-[450]">
                  {t.quote}
                </p>
                <div
                  className={`text-4xl font-black leading-none mt-2 text-right bg-gradient-to-br ${t.accentFrom} ${t.accentTo} bg-clip-text text-transparent`}
                  aria-hidden
                >
                  &rdquo;
                </div>
              </div>

              {/* Outcome badge */}
              <div className={`mx-6 mb-5 px-4 py-2.5 rounded-xl border text-xs font-bold leading-snug ${t.outcomeBg} ${t.outcomeColor}`}>
                <span className="uppercase tracking-widest text-xs font-semibold block opacity-60 mb-0.5">Outcome</span>
                {t.outcome}
              </div>

              {/* Attribution row */}
              <div className="px-6 py-4 border-t border-navy-700 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.accentFrom} ${t.accentTo} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white leading-snug">{t.role}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
