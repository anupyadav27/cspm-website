export function OutcomeStrip() {
  const outcomes = [
    { metric: '847',      unit: 'avg. findings', context: 'per first scan' },
    { metric: '< 8 min',  unit: 'to first critical', context: 'alert' },
    { metric: '16+',      unit: 'security engines', context: 'running in parallel' },
    { metric: '100%',     unit: 'agentless', context: 'no deployment required' },
  ]

  return (
    <section className="border-y border-white/[0.07] bg-navy-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/[0.06]">
          {outcomes.map((o, i) => (
            <div key={i} className="px-8 py-6 flex items-center gap-4">
              <div>
                <div className="text-2xl font-black text-white tracking-tight leading-none tabular-nums">
                  {o.metric}
                </div>
                <div className="text-[11px] text-slate-300 mt-1.5">
                  <span className="font-semibold text-slate-200">{o.unit}</span>{' '}
                  <span className="text-slate-400">{o.context}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
