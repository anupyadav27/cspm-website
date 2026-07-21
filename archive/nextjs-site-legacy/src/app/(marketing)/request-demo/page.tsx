'use client'
import type { Metadata } from 'next'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { API_URL } from '@/lib/config'

type FormData = {
  name: string
  email: string
  company: string
  clouds: string[]
  concern: string
  note: string
}

const cloudOptions  = ['AWS', 'Azure', 'GCP', 'OCI', 'AliCloud', 'IBM Cloud', 'Kubernetes']
const concernOptions = [
  'Preparing for a compliance audit',
  'Recent security incident or concern',
  'Need to improve our cloud security posture',
  'CIEM / identity and access risk',
  'Vulnerability prioritisation',
  'Container / Kubernetes security',
  'Evaluating vendors',
  'Other',
]

const whatToExpect = [
  { title: 'You talk to a security engineer — not a sales rep',      sub: 'Someone who has run actual cloud security assessments.'       },
  { title: 'We scan a live account during the call (with your OK)',  sub: 'Real findings from your real environment, not staged data.'   },
  { title: '45 minutes, focused on YOUR situation',                  sub: 'No deck, no generic walkthrough. We go where you need to go.' },
  { title: 'Zero pressure',                                          sub: 'If Onam isn\'t right for you, we\'ll tell you honestly.'     },
]

export default function RequestDemoPage() {
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [selectedClouds, setSelectedClouds] = useState<string[]>([])

  function toggleCloud(cloud: string) {
    setSelectedClouds(prev => {
      const next = prev.includes(cloud) ? prev.filter(c => c !== cloud) : [...prev, cloud]
      setValue('clouds', next)
      return next
    })
  }

  async function onSubmit(data: FormData) {
    setError('')
    try {
      if (API_URL) {
        await fetch(`${API_URL}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, type: 'demo_request' }),
        })
      }
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Email us at hello@onam.security instead.')
    }
  }

  if (submitted) {
    return (
      <main className="pt-20 min-h-screen bg-navy-900 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-csm-green/15 border border-csm-green/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-csm-green" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">You&apos;re booked in.</h1>
          <p className="text-slate-400 mb-6">
            We&apos;ll email you within 1 business day to confirm the time. The security engineer will
            reach out directly — keep an eye on your inbox.
          </p>
          <Button href="/" variant="secondary">Back to home</Button>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-20 bg-navy-900 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-start">
        {/* Left — what to expect */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-3">Book a demo</div>
          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
            See Onam scan your cloud — live, in 45 minutes.
          </h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            This isn&apos;t a pre-recorded walkthrough. We&apos;ll connect to a real account
            (yours if you want, ours if you don&apos;t) and show you exactly what Onam finds.
          </p>
          <div className="space-y-5">
            {whatToExpect.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-500/15 border border-brand-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-brand-400">{i + 1}</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-200">{item.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div className="glass-card gradient-border rounded-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Your name *</label>
                <input {...register('name', { required: true })}
                  placeholder="Alex Kim"
                  className="w-full bg-navy-900/80 border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-500/60 transition-colors" />
                {errors.name && <span className="text-xs text-csm-red mt-1">Required</span>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Work email *</label>
                <input {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })}
                  type="email" placeholder="alex@company.com"
                  className="w-full bg-navy-900/80 border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-500/60 transition-colors" />
                {errors.email && <span className="text-xs text-csm-red mt-1">Valid work email required</span>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Company *</label>
              <input {...register('company', { required: true })}
                placeholder="Acme Corp"
                className="w-full bg-navy-900/80 border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-500/60 transition-colors" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Which clouds do you use? (pick all)</label>
              <div className="flex flex-wrap gap-2">
                {cloudOptions.map(c => {
                  const active = selectedClouds.includes(c)
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCloud(c)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150"
                      style={active ? {
                        background: 'rgba(99,102,241,0.15)',
                        borderColor: 'rgba(99,102,241,0.5)',
                        color: '#a5b4fc',
                      } : {
                        background: 'rgba(255,255,255,0.03)',
                        borderColor: 'rgba(255,255,255,0.08)',
                        color: '#6b7280',
                      }}
                    >
                      {c}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">What&apos;s driving this for you?</label>
              <select {...register('concern')}
                className="w-full bg-navy-900/80 border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-brand-500/60 transition-colors appearance-none cursor-pointer">
                <option value="">Select one...</option>
                {concernOptions.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Anything specific you want to see? <span className="font-normal text-slate-600">(optional)</span></label>
              <textarea {...register('note')} rows={3}
                placeholder="e.g. We have 12 AWS accounts and need to understand our CIEM posture..."
                className="w-full bg-navy-900/80 border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-500/60 transition-colors resize-none" />
            </div>

            {error && <p className="text-sm text-csm-red">{error}</p>}

            <Button type="submit" disabled={isSubmitting} size="lg" className="w-full justify-center">
              {isSubmitting ? 'Sending...' : 'Book the demo'}
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </Button>
            <p className="text-xs text-slate-600 text-center">No credit card · No commitment · Security engineers only</p>
          </form>
        </div>
      </div>
    </main>
  )
}
