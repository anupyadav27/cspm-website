// Draw.io-style attack path diagram — used on Threat Detection page
export function AttackPathDiagram() {
  const steps = [
    {
      phase: 'Initial Access',
      color: '#EF4444',
      bg: '#2D1515',
      border: '#EF444450',
      icon: '🪣',
      title: 'Misconfigured S3 Bucket',
      detail: 'Public read enabled\nno bucket policy',
      mitre: 'T1530',
    },
    {
      phase: 'Credential Access',
      color: '#F59E0B',
      bg: '#2D2010',
      border: '#F59E0B50',
      icon: '🔑',
      title: 'AWS Credentials Exposed',
      detail: 'access_key_id found\nin bucket contents',
      mitre: 'T1552.005',
    },
    {
      phase: 'Lateral Movement',
      color: '#A855F7',
      bg: '#1E1530',
      border: '#A855F750',
      icon: '🖥',
      title: 'EC2 Instance Assumed',
      detail: 'sts:AssumeRole via\noverprivileged key',
      mitre: 'T1548.005',
    },
    {
      phase: 'Data Exfiltration',
      color: '#EF4444',
      bg: '#2D1515',
      border: '#EF444450',
      icon: '🗄',
      title: 'RDS Database Reached',
      detail: 'RDS in same VPC\nno network isolation',
      mitre: 'T1537',
    },
  ]

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[640px] flex items-start gap-0">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start flex-1">
            {/* Node */}
            <div className="flex-1">
              {/* Phase label */}
              <div className="text-xs font-semibold uppercase tracking-widest mb-2 text-center"
                style={{ color: step.color }}>
                {step.phase}
              </div>

              {/* Card */}
              <div className="rounded-xl border p-3 text-center"
                style={{ backgroundColor: step.bg, borderColor: step.border }}>
                <div className="text-2xl mb-1">{step.icon}</div>
                <div className="text-xs font-semibold text-white leading-tight">{step.title}</div>
                <div className="text-xs text-slate-400 mt-1 whitespace-pre-line leading-snug">{step.detail}</div>
                <div className="mt-2 inline-block px-1.5 py-0.5 rounded text-xs font-mono border"
                  style={{ color: step.color, borderColor: step.border, backgroundColor: step.bg }}>
                  MITRE {step.mitre}
                </div>
              </div>
            </div>

            {/* Arrow connector */}
            {i < steps.length - 1 && (
              <div className="flex items-center pt-10 px-1">
                <svg width="32" height="16" viewBox="0 0 32 16">
                  <line x1="0" y1="8" x2="24" y2="8" stroke="#2D4070" strokeWidth="1.5" strokeDasharray="3 2" />
                  <polygon points="24,4 32,8 24,12" fill="#2D4070" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Onam detection callout */}
      <div className="mt-4 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2.5">
        <div className="w-2 h-2 rounded-full bg-csm-green animate-pulse-slow shrink-0" />
        <span className="text-xs text-emerald-400 font-medium">
          Onam detects this chain at step 1 — the misconfigured S3 bucket triggers a CRITICAL finding
          before credentials are ever exposed.
        </span>
      </div>
    </div>
  )
}
