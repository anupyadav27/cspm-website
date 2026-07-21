// Realistic mock of the Onam security dashboard — used as hero visual
import { Badge } from '@/components/ui/Badge'
import { ShieldAlert, Database, KeyRound, Network, Server } from 'lucide-react'

const findings = [
  { id: 1, icon: Database,    title: 'S3 bucket: public read access enabled',   resource: 'prod-data-bucket',  severity: 'CRITICAL' },
  { id: 2, icon: KeyRound,    title: 'Root account active in last 30 days',      resource: 'aws account root',  severity: 'CRITICAL' },
  { id: 3, icon: Network,     title: 'Security group: SSH open to 0.0.0.0/0',    resource: 'sg-0abc123def',     severity: 'HIGH'     },
  { id: 4, icon: Server,      title: 'RDS instance has no encryption at rest',   resource: 'prod-db-01',        severity: 'HIGH'     },
]

const compliance = [
  { name: 'CIS AWS v2',  score: 67, color: 'bg-brand-500'    },
  { name: 'NIST 800-53', score: 72, color: 'bg-csm-cyan'     },
  { name: 'SOC 2',       score: 81, color: 'bg-csm-green'    },
]

export function SecurityDashboard() {
  return (
    <div className="relative w-full max-w-[520px] animate-float">
      {/* Ambient glow behind card */}
      <div className="absolute -inset-4 bg-brand-500/10 blur-3xl rounded-3xl pointer-events-none" />

      {/* Main card */}
      <div className="relative bg-navy-800 border border-navy-600 rounded-2xl overflow-hidden shadow-card">
        {/* Top bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-navy-600 bg-navy-900/60">
          <div className="w-2.5 h-2.5 rounded-full bg-csm-red"   />
          <div className="w-2.5 h-2.5 rounded-full bg-csm-amber" />
          <div className="w-2.5 h-2.5 rounded-full bg-csm-green" />
          <div className="ml-3 flex-1 bg-navy-700 rounded text-xs text-slate-400 px-2 py-0.5">
            onam.security · Security Overview
          </div>
          <span className="flex items-center gap-1 text-xs text-csm-green">
            <span className="w-1.5 h-1.5 rounded-full bg-csm-green animate-pulse-slow" />
            Live
          </span>
        </div>

        <div className="p-5">
          {/* Header row */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Workspace</div>
              <div className="text-sm font-semibold text-white">acme-corp / production</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400 uppercase tracking-wide">Last scan</div>
              <div className="text-sm text-slate-300">6 min ago</div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            <div className="col-span-1 bg-navy-900 rounded-xl p-3 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-csm-amber">68</div>
              <div className="text-xs text-slate-400 uppercase tracking-wide mt-0.5">Risk</div>
            </div>
            <div className="col-span-4 grid grid-cols-4 gap-2">
              {[
                { label: 'Critical', count: 12, cls: 'text-csm-red'     },
                { label: 'High',     count: 47, cls: 'text-csm-amber'   },
                { label: 'Medium',   count: 89, cls: 'text-yellow-400'  },
                { label: 'Low',      count: 134, cls: 'text-slate-400'  },
              ].map(s => (
                <div key={s.label} className="bg-navy-900 rounded-lg p-2 text-center">
                  <div className={`text-base font-bold ${s.cls}`}>{s.count}</div>
                  <div className="text-xs text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Findings */}
          <div className="space-y-2 mb-4">
            <div className="text-xs uppercase tracking-widest text-slate-400 mb-1">Latest findings</div>
            {findings.map(f => {
              const Icon = f.icon
              return (
                <div key={f.id} className="flex items-start gap-2.5 bg-navy-900 rounded-lg p-2.5 border border-navy-600">
                  <div className="mt-0.5 text-slate-500">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-200 leading-tight truncate">{f.title}</div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">{f.resource}</div>
                  </div>
                  <Badge label={f.severity} severity={f.severity} />
                </div>
              )
            })}
          </div>

          {/* Compliance */}
          <div className="border-t border-navy-600 pt-3">
            <div className="text-xs uppercase tracking-widest text-slate-400 mb-2">Compliance posture</div>
            <div className="space-y-1.5">
              {compliance.map(c => (
                <div key={c.name} className="flex items-center gap-2">
                  <div className="text-xs text-slate-400 w-24 shrink-0">{c.name}</div>
                  <div className="flex-1 h-1.5 bg-navy-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${c.color}`}
                      style={{ width: `${c.score}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-400 w-6 text-right">{c.score}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
