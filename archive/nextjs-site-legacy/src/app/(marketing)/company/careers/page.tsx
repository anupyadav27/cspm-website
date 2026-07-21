import type { Metadata } from 'next'
import { ArrowRight, Heart, Code2, MessageSquare, Telescope, Coffee, Globe, Clock, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Careers — Onam',
  description: 'Join a small team building the cloud security platform that security engineers actually want to use.',
}

const values = [
  { icon: Code2,        label: 'You ship, full stop',         body: 'No proxy layers. No waiting for a separate team. Engineers own the full stack from design to production.' },
  { icon: Telescope,    label: 'Hard problems welcome',       body: 'Multi-cloud identity graphs. Real-time threat correlation. Attack path analysis. The problems here are legitimately interesting.' },
  { icon: Heart,        label: 'We care about the mission',   body: 'Cloud security matters. The teams using this platform are protecting real infrastructure. That keeps the work meaningful.' },
  { icon: MessageSquare,label: 'Small, senior, direct',       body: 'No bureaucracy. No consensus meetings for every small decision. You will hear honest feedback and give it in return.' },
]

const perks = [
  { icon: Globe,       label: 'Remote-first',          body: 'Work from wherever you do your best thinking. Async by default, synchronous when it helps.' },
  { icon: Clock,       label: 'Flexible hours',        body: 'We care about output, not when you are online. Build the schedule that works for how you work.' },
  { icon: TrendingUp,  label: 'Equity from day one',   body: 'Early stage means real ownership. We structure equity fairly and explain it clearly.' },
  { icon: Coffee,      label: 'Hardware budget',       body: 'Get the machine you need to do the work. No forms, no approvals for standard kit.' },
  { icon: Heart,       label: 'Health coverage',       body: 'Medical, dental, and vision for you and your family. Geography-appropriate coverage.' },
  { icon: Code2,       label: 'Learning stipend',      body: 'Conferences, courses, books — we invest in your growth because it comes back to the product.' },
]

const hiringSteps = [
  { step: '01', title: 'Intro call', body: '30 minutes with an engineer. No trick questions. We want to understand what you have worked on and what you are looking for.' },
  { step: '02', title: 'Technical conversation', body: 'A real problem from our domain — not a whiteboard puzzle. We care about how you think, not whether you memorised algorithms.' },
  { step: '03', title: 'Team conversation', body: 'Meet the people you would actually work with. Ask anything. We want you to know exactly what you are signing up for.' },
  { step: '04', title: 'Offer', body: 'Clear compensation, equity breakdown, and time to decide. No exploding deadlines.' },
]

export default function CareersPage() {
  return (
    <main className="pt-20 bg-navy-900 min-h-screen">

      {/* Hero */}
      <section className="py-24 bg-mesh border-b border-white/[0.05]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-4">Careers</div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
            Build security tools that security engineers actually want to use.
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mb-8">
            We are a small team that takes cloud security seriously. The work is technically hard, the problems are genuinely important,
            and you will have real ownership from day one.
          </p>
          <Button href="#openings" size="md">See open roles <ArrowRight className="w-4 h-4" /></Button>
        </div>
      </section>

      {/* Why work here */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Why Onam</div>
          <h2 className="text-2xl font-extrabold text-white mb-10">What working here is actually like.</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {values.map(v => (
              <div key={v.label} className="glass-card rounded-2xl p-6 card-hover">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4 ring-1 ring-white/[0.06]">
                  <v.icon className="w-5 h-5 text-brand-400" />
                </div>
                <div className="text-sm font-semibold text-white mb-2">{v.label}</div>
                <p className="text-sm text-slate-300 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-20 border-t border-white/[0.05] bg-navy-800/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">What we offer</div>
          <h2 className="text-2xl font-extrabold text-white mb-10">The things that matter beyond salary.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {perks.map(p => (
              <div key={p.label} className="glass-card rounded-xl p-5">
                <p.icon className="w-5 h-5 text-brand-400 mb-3" />
                <div className="text-sm font-semibold text-white mb-1">{p.label}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring process */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">How we hire</div>
          <h2 className="text-2xl font-extrabold text-white mb-10">Four steps. No surprises.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {hiringSteps.map(s => (
              <div key={s.step} className="glass-card rounded-xl p-5">
                <div className="text-2xl font-bold text-brand-500/40 mb-3 font-mono">{s.step}</div>
                <div className="text-sm font-semibold text-white mb-2">{s.title}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section id="openings" className="py-20 border-t border-white/[0.05] bg-navy-800/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Open roles</div>
          <h2 className="text-2xl font-extrabold text-white mb-4">We are hiring carefully.</h2>
          <p className="text-slate-400 mb-10 max-w-xl">
            We do not hire to fill headcount. When we open a role, it is because we have a clear gap and the work to support it.
          </p>
          <div className="glass-card gradient-border rounded-2xl p-10 text-center">
            <div className="text-lg font-bold text-white mb-3">No roles currently posted.</div>
            <p className="text-slate-400 mb-7 max-w-md mx-auto text-sm leading-relaxed">
              If you are a security engineer, cloud architect, or product-minded developer who wants to work on this problem —
              send us a note anyway. The best conversations do not wait for a job listing.
            </p>
            <Button href="/company/contact" size="lg">
              Introduce yourself <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

    </main>
  )
}
