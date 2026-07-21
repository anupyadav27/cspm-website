import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function CtaBanner() {
  return (
    <section className="py-24 bg-navy-900">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Glow */}
        <div className="relative">
          <div className="absolute inset-[-20%] bg-brand-500/8 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute inset-[-20%] bg-csm-cyan/4 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative glass-card gradient-border rounded-3xl px-8 py-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-5 leading-tight tracking-tight">
              Your cloud has findings right now.<br className="hidden sm:block" />
              Most teams don&apos;t know.
            </h2>
            <p className="text-lg text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
              The average AWS organisation has 847 open security findings.
              Connect your account in 5 minutes — we&apos;ll show you yours,
              ranked by real blast radius. No agents, no code changes, no commitment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button href="/request-demo" size="lg">
                See my cloud findings
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button href="/company/contact" variant="secondary" size="lg">
                Talk to a security engineer
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {[
                'No credit card required',
                'Read-only IAM role',
                'SOC 2 Type II certified',
                'Delete access anytime',
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="w-1 h-1 rounded-full bg-slate-500 flex-shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
