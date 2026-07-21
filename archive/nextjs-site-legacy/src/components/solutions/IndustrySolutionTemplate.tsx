import { ArrowRight, AlertTriangle, BookOpen, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FaqAccordion } from '@/components/ui/FaqAccordion'

interface Stat      { value: string; label: string }
interface Framework { name: string; description: string }
interface UseCase   { title: string; body: string }
interface Capability{ title: string; body: string }
interface FaqItem   { question: string; answer: string }

export interface IndustrySolutionProps {
  breadcrumb: string
  headline: string
  sub: string
  challenge: string
  stats: Stat[]
  frameworks: Framework[]
  useCases: UseCase[]
  capabilities: Capability[]
  faqs?: FaqItem[]
}

export function IndustrySolutionTemplate({
  breadcrumb, headline, sub, challenge,
  stats, frameworks, useCases, capabilities, faqs,
}: IndustrySolutionProps) {
  return (
    <main className="pt-20 bg-navy-900 min-h-screen">

      {/* ── Hero ── */}
      <section className="py-20 bg-mesh border-b border-white/[0.05]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-4">{breadcrumb}</div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6 max-w-3xl">
            {headline}
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mb-8">{sub}</p>
          <div className="flex flex-wrap gap-3">
            <Button href="/request-demo" size="lg">
              Book a demo <ArrowRight className="w-4 h-4" />
            </Button>
            <Button href="/pricing" variant="secondary" size="lg">See pricing</Button>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="border-b border-white/[0.05] bg-navy-800/50">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-white mb-1">{s.value}</div>
              <div className="text-xs text-slate-500 leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Regulatory challenge ── */}
      <section className="py-16 border-b border-white/[0.05]">
        <div className="max-w-5xl mx-auto px-6 grid lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-brand-400" />
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">The regulatory challenge</h2>
            </div>
            <p className="text-slate-400 leading-relaxed">{challenge}</p>
          </div>
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 border-l-2 border-brand-500/40">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Onam covers</div>
            <div className="space-y-2">
              {frameworks.map(f => (
                <div key={f.name} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0" />
                  <div>
                    <span className="text-sm font-semibold text-white">{f.name}</span>
                    <span className="text-xs text-slate-500"> — {f.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Use cases ── */}
      <section className="py-16 border-b border-white/[0.05] bg-navy-800/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-brand-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Real-world use cases</h2>
          </div>
          <div className="space-y-5">
            {useCases.map((u, i) => (
              <div key={i} className="glass-card rounded-xl p-6 grid sm:grid-cols-4 gap-4 items-start">
                <div className="sm:col-span-1">
                  <div className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-1">Use case {i + 1}</div>
                  <div className="text-sm font-semibold text-white leading-snug">{u.title}</div>
                </div>
                <p className="sm:col-span-3 text-sm text-slate-400 leading-relaxed">{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Capabilities ── */}
      <section className="py-16 border-b border-white/[0.05]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-brand-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">How Onam helps</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {capabilities.map((c, i) => (
              <div key={i} className="glass-card rounded-xl p-6 card-hover">
                <div className="w-2 h-2 rounded-full bg-csm-green mb-4" />
                <div className="text-sm font-semibold text-white mb-2">{c.title}</div>
                <p className="text-xs text-slate-500 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      {faqs && faqs.length > 0 && (
        <section className="py-16 border-b border-white/[0.05] bg-navy-800/30">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-2xl font-extrabold text-white tracking-tight mb-8">Frequently asked questions</h2>
            <FaqAccordion variant="dark" items={faqs} />
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-20 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="text-2xl font-extrabold text-white tracking-tight mb-3">
            Ready to close your compliance gaps?
          </h2>
          <p className="text-slate-400 text-sm mb-7">
            Connect your first cloud account in under 5 minutes. 100% agentless, read-only credentials, no commitment.
          </p>
          <div className="flex gap-3 justify-center">
            <Button href="/request-demo" size="lg">Book a live demo <ArrowRight className="w-4 h-4" /></Button>
            <Button href="/company/contact" variant="secondary" size="md">Talk to an engineer</Button>
          </div>
        </div>
      </section>

    </main>
  )
}
