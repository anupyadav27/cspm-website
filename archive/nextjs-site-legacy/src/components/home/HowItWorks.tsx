import { SectionHeader } from '@/components/ui/SectionHeader'
import { PlugZap, ScanLine, ListChecks } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: PlugZap,
    gradient: 'from-brand-500 to-violet-600',
    title: 'Connect your cloud — takes 3 minutes',
    body: 'Give Onam read-only access via an IAM role, service principal, or service account. No agents to install, no code changes, no infrastructure to manage. The platform stores only a role ARN — no long-lived credentials, ever.',
    detail: 'Works with AWS IAM role assumption, Azure service principals, GCP service accounts, OCI, AliCloud, IBM Cloud, and Kubernetes clusters.',
  },
  {
    number: '02',
    icon: ScanLine,
    gradient: 'from-cyan-500 to-brand-500',
    title: 'We scan everything — including what you forgot about',
    body: 'Onam enumerates every resource across 200+ cloud services and checks each one against 10,000+ security rules across 16+ engines. First findings appear in under 5 minutes. A full attack graph completes within 60 minutes for accounts with 10,000+ resources.',
    detail: 'Subsequent scans run continuously. You see drift the moment it happens, not at your next quarterly review.',
  },
  {
    number: '03',
    icon: ListChecks,
    gradient: 'from-emerald-500 to-cyan-500',
    title: 'You get a prioritised list, not a wall of alerts',
    body: 'Critical findings appear first. Every finding tells you what it is, why it matters, which compliance frameworks it affects, and the exact remediation — a CLI command, a Terraform snippet, or a step-by-step console walkthrough.',
    detail: 'Risk scoring factors in: reachability from the internet, data sensitivity, identity access paths, and active exploit evidence (EPSS).',
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          question="How does Onam work?"
          headline="Simple enough to explain in 3 steps. Deep enough to find what others miss."
          sub="No agent to deploy, no code to change. You connect your account, we do the rest."
          theme="light"
          className="mb-16"
        />

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-7 hover:border-slate-300 hover:shadow-md transition-all"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.04)' }}
              >
                {/* Step indicator */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-sm flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div
                    className={`text-5xl font-black tracking-tighter leading-none select-none text-slate-100`}
                  >
                    {step.number}
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-3 leading-snug">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{step.body}</p>
                <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3.5 italic">
                  {step.detail}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
