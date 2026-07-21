import type { Metadata } from 'next'
import { ShieldCheck, Users, Eye, Zap, ArrowRight, CheckCircle2, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'About Onam',
  description: 'We built Onam because cloud security tooling was fragmented, noisy, and hard to act on. Here is the story.',
}

const values = [
  {
    icon: ShieldCheck,
    label: 'Security engineers first',
    body: 'Built by people who have run incident response, conducted threat hunts, and reviewed cloud architectures. Every feature is something we would want ourselves.',
  },
  {
    icon: Eye,
    label: 'Depth over surface area',
    body: 'We would rather cover one cloud provider exceptionally well than six providers adequately. Our 10,000+ rules go deep into each service — not just the obvious ones.',
  },
  {
    icon: Users,
    label: 'Honest with customers',
    body: 'If Onam is not right for your environment, we will tell you. We think a customer who trusts us is worth more than a closed deal that does not fit.',
  },
  {
    icon: Zap,
    label: 'Speed without shortcuts',
    body: 'Fast scans matter. So does accuracy. We invest in both. A finding that fires on every resource because the rule is too broad is just noise dressed up as signal.',
  },
]

const stats = [
  { value: '10,000+', label: 'Security rules' },
  { value: '7',       label: 'Cloud providers' },
  { value: '13',      label: 'Compliance frameworks' },
  { value: '200+',    label: 'Cloud services covered' },
]

const team = [
  {
    name: 'Anup Yadav',
    title: 'CEO & Co-founder',
    bio: '15+ years in cloud security and infrastructure. Former security architect at scale-up fintech and enterprise SaaS. Led incident response teams across AWS and Azure multi-cloud environments.',
    linkedin: 'https://linkedin.com/in/anupyadav',
    initials: 'AY',
    color: 'bg-brand-500',
  },
  {
    name: 'Head of Engineering',
    title: 'CTO & Co-founder',
    bio: 'Previously engineering director at a cloud-native infrastructure company. Built distributed scanning systems processing billions of API calls per month. Deep expertise in graph databases and security graph traversal.',
    linkedin: '#',
    initials: 'HE',
    color: 'bg-csm-cyan',
  },
  {
    name: 'Head of Security Research',
    title: 'Chief Security Officer',
    bio: 'Former cloud threat researcher. Published CVEs across AWS and Azure services. Speaker at DEF CON and Black Hat. Deep expertise in MITRE ATT&CK for Cloud and attack path modeling.',
    linkedin: '#',
    initials: 'SR',
    color: 'bg-csm-green',
  },
]

const principles = [
  'Agentless by design — read-only credentials, nothing installed in your environment',
  'Multi-cloud from day one — AWS, Azure, GCP, OCI, AliCloud, IBM Cloud, Kubernetes',
  'Findings that tell you what to do, not just what is wrong',
  'Security posture that updates continuously, not on a weekly scan schedule',
]

export default function CompanyPage() {
  return (
    <main className="pt-20 bg-navy-900 min-h-screen">

      {/* Hero */}
      <section className="py-24 bg-mesh border-b border-white/[0.05]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-4">About Onam</div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
            We built Onam because cloud security tooling was fragmented, noisy, and hard to act on.
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-3xl mb-8">
            Most teams use five or six tools to get a partial picture of their cloud risk. Findings live in different dashboards,
            correlation requires manual work, and by the time something is surfaced it has already been exploited. We wanted one platform
            that connected posture, identity, threats, and compliance — and told you what actually matters.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Button href="/request-demo" size="md">See it live <ArrowRight className="w-4 h-4" /></Button>
            <Button href="/company/contact" variant="secondary" size="md">Get in touch</Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 border-b border-white/[0.05] bg-navy-800/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {stats.map(s => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Origin story */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-4xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-start">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Our story</div>
            <h2 className="text-2xl font-extrabold text-white mb-5">The problem was always the same.</h2>
            <div className="space-y-4 text-slate-400 leading-relaxed text-sm">
              <p>
                Cloud security teams were drowning in alerts from tools that did not talk to each other. A CSPM finding in one dashboard.
                An identity risk in another. A vulnerability in a third. Each tool accurate in isolation — but together they created more
                work, not less.
              </p>
              <p>
                The real risk was in the correlation: the misconfigured S3 bucket that was also accessible to an overprivileged service account,
                that was also running on an instance with a known CVE. No single tool saw all three. No single team could connect them fast enough.
              </p>
              <p>
                Onam was built to be that single picture — across every cloud, every engine, every finding — so that security teams can spend
                their time responding instead of correlating.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">What we stand for</div>
            {principles.map((p, i) => (
              <div key={i} className="flex items-start gap-3 glass-card rounded-xl px-4 py-3">
                <CheckCircle2 className="w-4 h-4 text-csm-green shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300 leading-snug">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 border-t border-white/[0.05] bg-navy-800/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">How we work</div>
          <h2 className="text-2xl font-extrabold text-white mb-10">The principles that shape every decision.</h2>
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

      {/* Leadership */}
      <section className="py-20 border-t border-white/[0.05] bg-navy-900">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">The team</div>
          <h2 className="text-2xl font-extrabold text-white mb-10">Built by security engineers who have been in your shoes.</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {team.map(member => (
              <div key={member.name} className="glass-card rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full ${member.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                    {member.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{member.name}</div>
                    <div className="text-xs text-slate-400">{member.title}</div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed flex-1">{member.bio}</p>
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors">
                  <Linkedin className="w-3 h-3" /> LinkedIn
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy-900 text-center border-t border-white/[0.05]">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl font-extrabold text-white mb-3">Want to see how it works in a real cloud?</h2>
          <p className="text-slate-400 mb-8">
            We will connect to a live account during the call — yours or ours — and walk through actual findings.
            No slides. No scripts.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button href="/request-demo" size="md">Book a demo <ArrowRight className="w-4 h-4" /></Button>
            <Button href="/company/careers" variant="secondary" size="md">We are hiring</Button>
          </div>
        </div>
      </section>

    </main>
  )
}
