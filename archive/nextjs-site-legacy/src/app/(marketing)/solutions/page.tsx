import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Cloud, Shield, Building2, Heart, Landmark, Layers } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Solutions — Onam',
  description: 'Onam for every cloud provider and every industry. AWS, Azure, GCP, OCI, AliCloud, Kubernetes, Financial Services, Healthcare, Government.',
}

const clouds = [
  {
    label: 'Amazon Web Services',
    href: '/solutions/aws',
    rules: '800+ rules',
    services: '40+ services',
    highlight: 'IAM graph · S3 exposure · Organizations-aware',
    color: 'from-orange-500/10 to-orange-500/5',
    border: 'hover:border-orange-500/30',
    badge: 'bg-orange-500/15 text-orange-400',
    abbr: 'AWS',
  },
  {
    label: 'Microsoft Azure',
    href: '/solutions/azure',
    rules: '350+ rules',
    services: '35+ services',
    highlight: 'Entra ID · Conditional Access · RBAC drift',
    color: 'from-blue-500/10 to-blue-500/5',
    border: 'hover:border-blue-500/30',
    badge: 'bg-blue-500/15 text-blue-400',
    abbr: 'Azure',
  },
  {
    label: 'Google Cloud Platform',
    href: '/solutions/gcp',
    rules: '300+ rules',
    services: '30+ services',
    highlight: 'Org-wide · BigQuery exposure · Workload Identity',
    color: 'from-green-500/10 to-green-500/5',
    border: 'hover:border-green-500/30',
    badge: 'bg-green-500/15 text-green-400',
    abbr: 'GCP',
  },
  {
    label: 'Oracle Cloud (OCI)',
    href: '/solutions/oci',
    rules: '200+ rules',
    services: '25+ services',
    highlight: 'Compartment hierarchy · PAR URLs · Autonomous DB',
    color: 'from-red-500/10 to-red-500/5',
    border: 'hover:border-red-500/30',
    badge: 'bg-red-500/15 text-red-400',
    abbr: 'OCI',
  },
  {
    label: 'Alibaba Cloud',
    href: '/solutions/alicloud',
    rules: '150+ rules',
    services: '20+ services',
    highlight: 'RAM policies · OSS replication · ActionTrail gaps',
    color: 'from-orange-400/10 to-orange-400/5',
    border: 'hover:border-orange-400/30',
    badge: 'bg-orange-400/15 text-orange-300',
    abbr: 'ALI',
  },
  {
    label: 'IBM Cloud',
    href: '/solutions/ibm',
    rules: '100+ rules',
    services: '15+ services',
    highlight: 'IAM policies · COS exposure · VPC security groups',
    color: 'from-violet-500/10 to-violet-500/5',
    border: 'hover:border-violet-500/30',
    badge: 'bg-violet-500/15 text-violet-400',
    abbr: 'IBM',
  },
  {
    label: 'Kubernetes / EKS / AKS',
    href: '/solutions/kubernetes',
    rules: '250+ rules',
    services: '14 object types',
    highlight: 'RBAC escalation · Network policy · Workload IAM',
    color: 'from-brand-500/10 to-brand-500/5',
    border: 'hover:border-brand-500/30',
    badge: 'bg-brand-500/15 text-brand-400',
    abbr: 'K8s',
  },
]

const industries = [
  {
    label: 'Financial Services',
    href: '/solutions/financial',
    icon: Building2,
    sub: 'Banks, fintechs, insurers, and asset managers',
    frameworks: 'PCI-DSS · SOX · NIST 800-53 · ISO 27001',
    highlight: 'CDE isolation · SOD enforcement · Audit evidence',
  },
  {
    label: 'Healthcare',
    href: '/solutions/healthcare',
    icon: Heart,
    sub: 'Health systems, payers, and digital health companies',
    frameworks: 'HIPAA · HITRUST · NIST CSF · SOC 2',
    highlight: 'PHI datastore discovery · OCR-ready reporting',
  },
  {
    label: 'Government',
    href: '/solutions/government',
    icon: Landmark,
    sub: 'Federal agencies and defense contractors',
    frameworks: 'FedRAMP · NIST 800-53 · FISMA · CMMC',
    highlight: 'ConMon automation · ATO drift · CMMC evidence',
  },
]

export default function SolutionsPage() {
  return (
    <main className="pt-20 bg-navy-900 min-h-screen">

      {/* ── Hero ── */}
      <section className="py-20 bg-mesh border-b border-white/[0.05]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-4">Solutions</div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6 max-w-3xl">
            Built for every cloud.<br />Built for every team.
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mb-8">
            Whether you run AWS, Azure, GCP, or all of the above — and whether your team answers to a QSA,
            an OCR investigator, or a FedRAMP AO — Onam covers your environment with rules built specifically
            for your cloud and your compliance obligations.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/request-demo" size="lg">Book a live demo <ArrowRight className="w-4 h-4" /></Button>
            <Button href="/pricing" variant="secondary" size="lg">See pricing</Button>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="border-b border-white/[0.05] bg-navy-800/50">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: '10,000+', label: 'Security rules' },
            { value: '7',      label: 'Cloud providers' },
            { value: '13',     label: 'Compliance frameworks' },
            { value: '< 5 min',label: 'To first finding' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold text-white mb-1">{s.value}</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── By Cloud Provider ── */}
      <section className="py-20 border-b border-white/[0.05]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">By cloud provider</div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-10">
            Deep coverage for every cloud you run.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clouds.map(c => (
              <Link key={c.href} href={c.href}
                className={`group glass-card rounded-2xl p-6 bg-gradient-to-br ${c.color} border border-white/[0.08] ${c.border} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]`}>
                <div className="flex items-start justify-between mb-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${c.badge}`}>{c.abbr}</span>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="text-sm font-semibold text-white mb-1 group-hover:text-white">{c.label}</div>
                <div className="flex gap-3 mb-3">
                  <span className="text-xs text-slate-400">{c.rules}</span>
                  <span className="text-xs text-slate-600">·</span>
                  <span className="text-xs text-slate-400">{c.services}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{c.highlight}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── By Industry ── */}
      <section className="py-20 border-b border-white/[0.05] bg-navy-800/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">By industry</div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-10">
            Compliance obligations mapped. Audit evidence ready.
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {industries.map(ind => (
              <Link key={ind.href} href={ind.href}
                className="group glass-card rounded-2xl p-6 card-hover transition-all duration-200 hover:-translate-y-0.5">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 ring-1 ring-white/[0.06] flex items-center justify-center mb-4">
                  <ind.icon className="w-5 h-5 text-brand-400" />
                </div>
                <div className="text-sm font-semibold text-white mb-1 group-hover:text-brand-300 transition-colors">{ind.label}</div>
                <div className="text-xs text-slate-400 mb-3">{ind.sub}</div>
                <div className="text-xs text-brand-400/70 mb-3 font-mono">{ind.frameworks}</div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                  {ind.highlight} <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">Not sure where to start?</h2>
          <p className="text-slate-400 mb-7 leading-relaxed">
            Connect one account in under 5 minutes. We will show you exactly what we find —
            no prep needed, no agents, no commitment.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button href="/request-demo" size="lg">Book a live demo <ArrowRight className="w-4 h-4" /></Button>
            <Button href="/company/contact" variant="secondary" size="md">Talk to an engineer</Button>
          </div>
        </div>
      </section>

    </main>
  )
}
