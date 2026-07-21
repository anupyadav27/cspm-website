const stats = [
  {
    value: '847',
    suffix: '',
    label: 'avg. findings on first scan',
    sub: 'Typical 40-account AWS org — 2025 Onam benchmark',
    color: 'from-brand-400 to-brand-600',
  },
  {
    value: '< 8',
    suffix: 'min',
    label: 'to first critical alert',
    sub: 'Account connected → finding in your inbox',
    color: 'from-cyan-400 to-cyan-600',
  },
  {
    value: '10,000',
    suffix: '+',
    label: 'security rules',
    sub: 'Check · SecOps · Technology — continuously updated',
    color: 'from-violet-400 to-violet-600',
  },
  {
    value: '13',
    suffix: '',
    label: 'compliance frameworks',
    sub: 'CIS · NIST · ISO 27001 · PCI-DSS · HIPAA · SOC 2',
    color: 'from-emerald-400 to-emerald-600',
  },
  {
    value: '7',
    suffix: '',
    label: 'cloud providers',
    sub: 'AWS · Azure · GCP · OCI · AliCloud · IBM · Kubernetes',
    color: 'from-amber-400 to-amber-500',
  },
  {
    value: '90',
    suffix: '%',
    label: 'faster SOC 2 prep',
    sub: 'Continuous evidence vs. manual screenshot gathering',
    color: 'from-rose-400 to-pink-500',
  },
]

export function StatsSection() {
  return (
    <section className="py-20 bg-navy-950 border-y border-navy-800 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(99,102,241,0.06),transparent)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-14">
          By the numbers
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
          {stats.map(s => (
            <div key={s.label} className="text-center group">
              <div className="flex items-end justify-center gap-1 mb-3">
                <span
                  className={`text-5xl sm:text-6xl font-black tracking-tighter leading-none bg-gradient-to-br ${s.color} bg-clip-text text-transparent`}
                >
                  {s.value}
                </span>
                {s.suffix && (
                  <span className="text-2xl font-bold text-slate-400 mb-1">{s.suffix}</span>
                )}
              </div>
              <div className="text-sm font-semibold text-slate-100 mb-1.5">{s.label}</div>
              <div className="text-xs text-slate-400 leading-snug max-w-[180px] mx-auto">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
