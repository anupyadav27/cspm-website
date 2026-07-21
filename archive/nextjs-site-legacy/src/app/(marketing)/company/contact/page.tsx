'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CheckCircle2, ArrowRight, Mail, Clock, MessageSquare, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { API_URL } from '@/lib/config'

type FormData = { name: string; email: string; company: string; message: string; topic: string }

const topics = ['General question', 'Pre-sales / pricing', 'Security concern / second opinion', 'Partner or integration enquiry', 'Press or analyst', 'Other']

const contactInfo = [
  { icon: Mail,           label: 'General',  value: 'hello@onam.security',   href: 'mailto:hello@onam.security'   },
  { icon: Shield,         label: 'Security', value: 'security@onam.security', href: 'mailto:security@onam.security' },
  { icon: MessageSquare,  label: 'Privacy',  value: 'privacy@onam.security',  href: 'mailto:privacy@onam.security'  },
]

const whatToExpect = [
  { icon: Clock, label: 'Reply within 1 business day', body: 'You will hear from a security engineer — not a sales development rep.' },
  { icon: Shield, label: 'Genuine help', body: 'If we are not the right fit, we will say so honestly and point you somewhere that might be.' },
  { icon: MessageSquare, label: 'No pitch', body: 'We answer your question first. Whether a demo follows is completely up to you.' },
]

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(data: FormData) {
    setError('')
    try {
      if (API_URL) {
        await fetch(`${API_URL}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, type: 'contact' }),
        })
      }
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Email us directly at hello@onam.security')
    }
  }

  const inputCls = 'w-full bg-navy-900/80 border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-500/60 transition-colors'

  return (
    <main className="pt-20 bg-navy-900 min-h-screen">

      {/* Hero */}
      <section className="py-16 bg-mesh border-b border-white/[0.05]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-4">Contact</div>
          <h1 className="text-5xl font-extrabold text-white tracking-tight mb-4">Talk to a security engineer.</h1>
          <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
            Whether you have a pre-sales question, a security concern you want a second opinion on, or just want to understand
            how Onam would fit your environment — reach out. You will hear from an engineer, not a BDR.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6 grid lg:grid-cols-5 gap-12 items-start">

          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="glass-card rounded-2xl p-10 text-center">
                <div className="w-14 h-14 rounded-full bg-csm-green/15 border border-csm-green/30 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-7 h-7 text-csm-green" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Message sent.</h2>
                <p className="text-slate-400 text-sm">A security engineer will reply within 1 business day.</p>
              </div>
            ) : (
              <div className="glass-card gradient-border rounded-2xl p-8">
                <h2 className="text-lg font-semibold text-white mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Name *</label>
                      <input {...register('name', { required: true })} placeholder="Alex Kim" className={inputCls} />
                      {errors.name && <span className="text-xs text-csm-red mt-1 block">Required</span>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Work email *</label>
                      <input {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })} type="email" placeholder="alex@company.com" className={inputCls} />
                      {errors.email && <span className="text-xs text-csm-red mt-1 block">Valid email required</span>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Company</label>
                    <input {...register('company')} placeholder="Acme Corp" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Topic</label>
                    <select {...register('topic')} className={`${inputCls} appearance-none cursor-pointer`}>
                      <option value="">Select a topic...</option>
                      {topics.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">How can we help? *</label>
                    <textarea {...register('message', { required: true })} rows={5}
                      placeholder="Tell us what you are working on or what questions you have..."
                      className={`${inputCls} resize-none`} />
                    {errors.message && <span className="text-xs text-csm-red mt-1 block">Required</span>}
                  </div>
                  {error && <p className="text-sm text-csm-red">{error}</p>}
                  <Button type="submit" disabled={isSubmitting} size="md" className="w-full justify-center">
                    {isSubmitting ? 'Sending...' : 'Send message'}
                    {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                  </Button>
                  <p className="text-xs text-slate-600 text-center">We respond within 1 business day · Engineers only</p>
                </form>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-6">
            {/* What to expect */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">What to expect</div>
              <div className="space-y-4">
                {whatToExpect.map(w => (
                  <div key={w.label} className="flex gap-3 glass-card rounded-xl p-4">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
                      <w.icon className="w-4 h-4 text-brand-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white mb-0.5">{w.label}</div>
                      <p className="text-xs text-slate-400 leading-relaxed">{w.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct email */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Or email directly</div>
              <div className="space-y-2">
                {contactInfo.map(c => (
                  <a key={c.label} href={c.href} className="flex items-center gap-3 glass-card rounded-xl px-4 py-3 hover:border-brand-500/30 transition-colors group">
                    <c.icon className="w-4 h-4 text-brand-400 shrink-0" />
                    <div>
                      <div className="text-xs text-slate-400 uppercase tracking-wider">{c.label}</div>
                      <div className="text-sm text-slate-300 group-hover:text-brand-300 transition-colors">{c.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="glass-card rounded-xl p-5">
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Quick links</div>
              <div className="space-y-2 text-sm">
                <a href="/request-demo" className="flex items-center justify-between text-slate-300 hover:text-brand-300 transition-colors py-1">
                  Book a live demo <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <a href="/docs" className="flex items-center justify-between text-slate-300 hover:text-brand-300 transition-colors py-1">
                  Browse documentation <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <a href="/pricing" className="flex items-center justify-between text-slate-300 hover:text-brand-300 transition-colors py-1">
                  See pricing <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
