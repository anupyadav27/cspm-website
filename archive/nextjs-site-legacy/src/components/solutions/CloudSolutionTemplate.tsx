import { CheckCircle2, ArrowRight, Plug, ShieldCheck, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FaqAccordion } from '@/components/ui/FaqAccordion'

interface Stat     { value: string; label: string }
interface Step     { title: string; body: string }
interface Feature  { title: string; body: string }
interface Framework { name: string }
interface FaqItem  { question: string; answer: string }

export interface CloudSolutionProps {
  breadcrumb: string
  headline: string
  sub: string
  docsHref: string
  stats: Stat[]
  services: string[]
  serviceNote?: string
  frameworks: Framework[]
  setupSteps: Step[]
  uniqueFeatures: Feature[]
  faqs?: FaqItem[]
  accentHex?: string
}

export function CloudSolutionTemplate({
  breadcrumb, headline, sub, docsHref,
  stats, services, serviceNote,
  frameworks, setupSteps, uniqueFeatures, faqs,
}: CloudSolutionProps) {
  return (
    <main style={{ background: '#f8fafc', minHeight: '100vh', paddingTop: 80 }}>

      {/* ── Hero ── */}
      <section style={{
        background: 'linear-gradient(135deg, #eef2ff 0%, #f8fafc 60%)',
        borderBottom: '1px solid #e2e8f0',
        padding: '64px 0',
      }}>
        <div style={{ maxWidth: 1024, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6366f1', marginBottom: 14 }}>
            {breadcrumb}
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em', color: '#0f172a', marginBottom: 20, maxWidth: 700 }}>
            {headline}
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: '#475569', maxWidth: 620, marginBottom: 32 }}>{sub}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Button href="/request-demo" size="lg">
              See a live scan <ArrowRight className="w-4 h-4" />
            </Button>
            <Button href={docsHref} variant="secondary" size="lg">
              Onboarding guide
            </Button>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section style={{ background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1024, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#4f46e5', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Service coverage ── */}
      <section style={{ padding: '64px 0', borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
        <div style={{ maxWidth: 1024, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck style={{ width: 18, height: 18, color: '#6366f1' }} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>What we check</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10, marginBottom: 12 }}>
            {services.map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, borderRadius: 8, padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <CheckCircle2 style={{ width: 14, height: 14, color: '#10b981', flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.4 }}>{s}</span>
              </div>
            ))}
          </div>
          {serviceNote && <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 8 }}>{serviceNote}</p>}
        </div>
      </section>

      {/* ── Compliance frameworks ── */}
      <section style={{ padding: '64px 0', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1024, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BarChart3 style={{ width: 18, height: 18, color: '#6366f1' }} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Compliance frameworks covered</h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {frameworks.map(f => (
              <div key={f.name} style={{
                padding: '8px 18px', borderRadius: 9999, fontSize: 13, fontWeight: 600,
                color: '#4f46e5', background: '#eef2ff', border: '1px solid #c7d2fe',
              }}>
                {f.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How to connect ── */}
      <section style={{ padding: '64px 0', borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
        <div style={{ maxWidth: 1024, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Plug style={{ width: 18, height: 18, color: '#6366f1' }} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>How to connect — 3 steps</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {setupSteps.map((step, i) => (
              <div key={i} style={{ borderRadius: 12, padding: '24px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, background: '#eef2ff', border: '1px solid #c7d2fe' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#4f46e5' }}>{i + 1}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>{step.title}</div>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Unique features ── */}
      <section style={{ padding: '64px 0', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1024, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6366f1', marginBottom: 8 }}>Why it matters</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 28 }}>Capabilities specific to this cloud</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {uniqueFeatures.map((f, i) => (
              <div key={i} style={{ borderRadius: 12, padding: '24px', background: '#fff', border: '1px solid #e2e8f0' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', marginBottom: 16 }} />
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>{f.title}</div>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      {faqs && faqs.length > 0 && (
        <section style={{ padding: '64px 0', borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
          <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 28 }}>Frequently asked questions</h2>
            <FaqAccordion variant="light" items={faqs} />
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section style={{ padding: '80px 0', textAlign: 'center', background: '#f8fafc' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
            See exactly what Onam finds in your environment.
          </h2>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28, lineHeight: 1.7 }}>
            Connect your first account in under 5 minutes. Read-only access, no agents, no commitment.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button href="/request-demo" size="lg">Book a live demo <ArrowRight className="w-4 h-4" /></Button>
            <Button href="/pricing" variant="secondary" size="md">See pricing</Button>
          </div>
        </div>
      </section>

    </main>
  )
}
