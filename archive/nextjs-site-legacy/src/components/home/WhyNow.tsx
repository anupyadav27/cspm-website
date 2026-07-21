import { AlertTriangle, TrendingUp, FileText } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'

const reasons = [
  {
    Icon: AlertTriangle,
    color: 'text-red-500',
    bg: 'bg-red-50',
    stat: '$4.88M',
    headline: 'average cost of a cloud misconfiguration breach',
    body: 'Misconfiguration and inadequate identity controls are the top two initial attack vectors in cloud breaches, according to the IBM Cost of a Data Breach Report 2024. The average breach now costs $4.88M — up 10% year over year.',
  },
  {
    Icon: TrendingUp,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    stat: '45 days',
    headline: 'average time to discover a misconfiguration in production',
    body: 'Verizon DBIR 2024 reports that the median time between initial access and detection in cloud environments is 45 days — enough time for attackers to establish persistence, exfiltrate data, and cover their tracks.',
  },
  {
    Icon: FileText,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    stat: '2026',
    headline: 'SEC, EU AI Act, and DORA all tighten cloud disclosure rules',
    body: 'The SEC now requires material cybersecurity incident disclosure within 4 business days. The EU AI Act mandates security posture reporting for AI systems. DORA enforces cloud resilience for financial services. Continuous visibility is no longer optional.',
  },
]

export function WhyNow() {
  return (
    <section className="py-20 bg-slate-50 border-y border-slate-100">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          question="Why this matters now"
          headline="Cloud security can't wait for your next audit."
          sub="The threat landscape, regulatory environment, and attacker tooling have all shifted. Here is what changed."
          theme="light"
          className="mb-12"
        />

        <div className="grid md:grid-cols-3 gap-6">
          {reasons.map(({ Icon, color, bg, stat, headline, body }) => (
            <div
              key={stat}
              className="rounded-2xl border border-slate-200 bg-white p-7 flex flex-col gap-4 hover:shadow-md hover:border-slate-300 transition-all"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
            >
              <div className={`w-11 h-11 rounded-xl ${bg} border border-slate-100 flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <div className={`text-4xl font-black tracking-tighter ${color} mb-1.5 leading-none`}>{stat}</div>
                <div className="text-sm font-bold text-slate-900 leading-snug">{headline}</div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
