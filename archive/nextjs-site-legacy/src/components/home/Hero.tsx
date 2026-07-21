import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SecurityDashboard } from '@/components/diagrams/SecurityDashboard'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-mesh pt-16">
      {/* Dot grid background */}
      <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />

      {/* Ambient glow blobs */}
      <div className="absolute top-[-10%] left-[10%] w-[800px] h-[600px] bg-brand-500/8 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] bg-csm-cyan/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left — copy */}
        <div className="animate-fade-in">
          {/* Context badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-500/25 bg-brand-500/8 backdrop-blur-sm text-brand-400 text-xs font-semibold mb-7 shadow-[0_0_20px_rgba(99,102,241,0.12)]">
            <span className="relative w-1.5 h-1.5 rounded-full bg-brand-400 pulse-dot" />
            Cloud Security Platform
          </div>

          {/* Headline — asks the visitor's first question back at them */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tighter mb-6 font-display heading-tighter">
            Is your cloud secure,<br />
            or does it just{' '}
            <span className="gradient-text">feel that way?</span>
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed max-w-lg mb-8">
            Most teams discover cloud attacks from a breach notification — or a compliance audit.
            Onam maps every misconfiguration, identity risk, and attack path across all 7 clouds
            into one complete security picture — with AI-powered remediation built in.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <Button href="/request-demo" size="lg">
              Scan my cloud
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Link href="/docs/architecture/overview"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-medium text-slate-300 hover:text-white border border-white/[0.08] hover:border-white/[0.14] bg-white/[0.03] rounded-lg transition-all hover:bg-white/[0.06]">
              <Play className="w-4 h-4 text-brand-400" fill="currentColor" />
              See how it works
            </Link>
          </div>

          {/* Trust stats — glass pills */}
          <div className="flex flex-wrap gap-2.5">
            {[
              '10,000+ security rules',
              '7 cloud providers',
              '16+ security engines',
              '100% agentless',
            ].map(stat => (
              <span key={stat} className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-white/[0.04] border border-white/[0.06] rounded-full px-3 py-1 backdrop-blur-sm">
                <span className="w-1 h-1 rounded-full bg-brand-400 shrink-0" />
                {stat}
              </span>
            ))}
          </div>
        </div>

        {/* Right — live dashboard mock */}
        <div className="hidden lg:flex justify-center items-center">
          <SecurityDashboard />
        </div>
      </div>
    </section>
  )
}
