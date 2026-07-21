import type { LucideIcon } from 'lucide-react'
import { ArrowRight, CheckCircle2, Zap, Eye, ShieldCheck, BarChart2, Clock, Bell, Search, Lock, AlertTriangle, Activity } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FaqAccordion, type FaqItem } from '@/components/ui/FaqAccordion'
import { PageOverviewStrip } from '@/components/ui/PageOverviewStrip'

export type { FaqItem }

export interface ProductPageData {
  icon: LucideIcon
  iconColor: string
  iconBg: string
  label: string
  question: string
  headline: string
  sub: string
  painPoint: string
  mechanism: string
  whatYouGet: string[]
  faqs?: FaqItem[]
  diagram?: React.ReactNode
  videoTitle?: string
  relatedHrefs?: { label: string; href: string }[]
}

const FEATURE_ICONS = [Zap, Eye, ShieldCheck, BarChart2, Clock, Bell, Search, Lock, AlertTriangle, Activity, CheckCircle2, CheckCircle2]

function parseFeature(item: string): { title: string; desc?: string } {
  const dashIdx = item.indexOf(' — ')
  if (dashIdx !== -1) return { title: item.slice(0, dashIdx), desc: item.slice(dashIdx + 3) }
  const colonIdx = item.indexOf(': ')
  if (colonIdx !== -1) return { title: item.slice(0, colonIdx), desc: item.slice(colonIdx + 2) }
  return { title: item }
}

export function ProductPageTemplate({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  question,
  headline,
  sub,
  painPoint,
  mechanism,
  whatYouGet,
  faqs,
  diagram,
  relatedHrefs,
}: ProductPageData) {
  const firstSentence = painPoint.split('. ')[0] + '.'

  const overviewItems = [
    { label: 'Why it matters', anchor: 'why-it-matters' },
    { label: 'How it works',   anchor: 'how-it-works'   },
    { label: 'What you get',   anchor: 'what-you-get'   },
    ...(faqs?.length ? [{ label: 'FAQ', anchor: 'faq' }] : []),
  ]

  return (
    <main className="pt-20 bg-navy-900 min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative py-20 overflow-hidden bg-mesh">
        <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-brand-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className={`inline-flex w-16 h-16 rounded-2xl ${iconBg} items-center justify-center mb-6 ring-1 ring-white/[0.08] shadow-[0_0_40px_rgba(99,102,241,0.18)]`}>
              <Icon className={`w-8 h-8 ${iconColor}`} />
            </div>

            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 bg-white/[0.04] border border-white/[0.06] rounded-full px-3 py-1">{label}</span>
            </div>
            <p className="text-sm text-brand-400 font-medium mb-3">{question}</p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5">{headline}</h1>
            <p className="text-lg text-slate-400 leading-relaxed mb-8">{sub}</p>

            <div className="flex justify-center gap-3 flex-wrap">
              <Button href="/request-demo" size="lg">
                See it in my cloud <ArrowRight className="w-4 h-4" />
              </Button>
              <Button href="/docs" variant="secondary" size="lg">Read the docs</Button>
            </div>
          </div>

          {/* Stat strip */}
          <div className="mt-14 pt-10 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-6 text-center max-w-2xl mx-auto">
            {[
              { value: '10,000+', label: 'security rules'   },
              { value: '7',       label: 'cloud providers'  },
              { value: '< 5 min', label: 'to first finding' },
              { value: '100%',    label: 'agentless'        },
            ].map(s => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-white mb-0.5">{s.value}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Page overview nav ────────────────────────────────────────────── */}
      <div className="sticky top-16 z-20 border-b border-white/[0.05] bg-navy-900/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 py-2.5">
          <PageOverviewStrip items={overviewItems} variant="dark" />
        </div>
      </div>

      {/* ── The problem ──────────────────────────────────────────────────── */}
      <section id="why-it-matters" className="py-16 border-t border-white/[0.05] bg-navy-800/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-8 items-start">

            <div className="lg:col-span-3">
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Why this matters</div>
              <p className="text-2xl font-semibold text-white leading-snug mb-6">{firstSentence}</p>
              <p className="text-slate-400 leading-relaxed text-sm">{painPoint.slice(firstSentence.length).trim()}</p>
            </div>

            <div className="lg:col-span-2">
              <div className="glass-card rounded-2xl p-6 border-l-2 border-brand-500/50">
                <div className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-4 h-4 text-brand-400" />
                </div>
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">The risk of not knowing</div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Security teams that lack visibility into {label.toLowerCase()} posture are typically the last to know about exposure —
                  often because they hear about it in a post-incident review.
                </p>
                <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-csm-red animate-pulse" />
                  <span className="text-xs text-slate-500">Real-time detection, not periodic audits</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-navy-900">
        <div className="max-w-5xl mx-auto px-6">
          <SectionHeader
            question="How does it actually work?"
            headline="The mechanism, not the marketing"
            align="left"
            className="mb-10"
          />

          <div className={`grid gap-10 ${diagram ? 'lg:grid-cols-5' : 'lg:grid-cols-1'}`}>
            <div className={diagram ? 'lg:col-span-3' : 'max-w-3xl'}>
              {mechanism.split('. ').filter(s => s.trim().length > 0).map((sentence, i) => (
                <div key={i} className="flex gap-4 mb-6 last:mb-0">
                  <div className="shrink-0 w-7 h-7 rounded-full bg-brand-500/15 border border-brand-500/25 flex items-center justify-center mt-0.5">
                    <span className="text-[11px] font-bold text-brand-400">{i + 1}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-sm pt-0.5">
                    {sentence.endsWith('.') ? sentence : sentence + '.'}
                  </p>
                </div>
              ))}
            </div>

            {diagram && (
              <div className="lg:col-span-2">
                <div className="glass-card rounded-2xl p-5 sticky top-24">
                  {diagram}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── What you get ─────────────────────────────────────────────────── */}
      <section id="what-you-get" className="py-20 border-t border-white/[0.05] bg-navy-800/50">
        <div className="max-w-5xl mx-auto px-6">
          <SectionHeader
            question="What do you actually get?"
            headline="Specific outputs, measurable outcomes"
            align="left"
            className="mb-10"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whatYouGet.map((item, i) => {
              const { title, desc } = parseFeature(item)
              const FeatureIcon = FEATURE_ICONS[i % FEATURE_ICONS.length]
              return (
                <div key={i} className="glass-card rounded-xl p-5 flex flex-col gap-3 card-hover">
                  <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0 ring-1 ring-white/[0.06]`}>
                    <FeatureIcon className={`w-4 h-4 ${iconColor}`} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white leading-snug mb-1">{title}</div>
                    {desc && <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      {faqs && faqs.length > 0 && (
        <section id="faq" className="py-20 bg-navy-900">
          <div className="max-w-3xl mx-auto px-6">
            <FaqAccordion
              eyebrow="Common questions"
              title="Frequently asked questions"
              items={faqs}
              variant="dark"
            />
          </div>
        </section>
      )}

      {/* ── CTA + Related ────────────────────────────────────────────────── */}
      <section className="py-20 bg-navy-900 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            <div className="glass-card gradient-border rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-2">Ready to see {label} in your cloud?</h2>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Connect your account in under 5 minutes. No agents. No commitment. A security engineer will walk you through the findings live.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button href="/request-demo" size="md">
                  Book a live demo <ArrowRight className="w-4 h-4" />
                </Button>
                <Button href="/pricing" variant="secondary" size="md">See pricing</Button>
              </div>
            </div>

            {relatedHrefs && relatedHrefs.length > 0 && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-5">Related capabilities</div>
                <div className="space-y-2">
                  {relatedHrefs.map(r => (
                    <a key={r.href} href={r.href}
                      className="flex items-center justify-between px-4 py-3 rounded-xl glass-card-hover border border-white/[0.06] group transition-all">
                      <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{r.label}</span>
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

    </main>
  )
}
