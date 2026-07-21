import type { Metadata } from 'next'
import { ShieldCheck, Mail, Clock, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Security & Responsible Disclosure',
  description: 'Onam Security responsible disclosure policy, security practices, and vulnerability reporting. We take security seriously and respond within 24 hours.',
}

const practices = [
  { label: 'SOC 2 Type II',        body: 'Audited annually by an independent third party. Report available to enterprise customers under NDA.'            },
  { label: 'Encryption at rest',   body: 'All finding data, credentials, and customer metadata encrypted at rest using AES-256.'                          },
  { label: 'Encryption in transit', body: 'All API and browser traffic enforces TLS 1.2 minimum. TLS 1.3 preferred where supported.'                       },
  { label: 'Read-only credentials', body: 'Onam never requests write, delete, or modify permissions. All cloud connections use read-only IAM roles/service principals.' },
  { label: 'No credential storage', body: 'We store IAM role ARNs and service account identifiers — never static credentials, access keys, or passwords.'  },
  { label: 'Penetration testing',  body: 'Annual third-party penetration test. Findings remediated within SLA. Summary report available on request.'       },
  { label: 'Bug bounty program',   body: 'We reward responsible disclosure for valid vulnerability reports. See scope and rewards below.'                   },
  { label: 'GDPR compliant',       body: 'Data Processing Agreement (DPA) available. EU data residency option for Enterprise customers. Sub-processor list published.' },
]

const scope = [
  'Authentication and authorization flaws in the Onam platform (app.onam.security)',
  'Multi-tenant data isolation — any path to access another tenant\'s findings or configuration',
  'SSRF, RCE, or SQL injection in any Onam API endpoint',
  'Credential leakage or exposure of customer cloud credentials',
  'Privilege escalation within the Onam platform RBAC system',
]

const outOfScope = [
  'Social engineering attacks against Onam employees',
  'Physical attacks against Onam infrastructure',
  'Denial of service (DoS/DDoS) attacks',
  'Vulnerabilities in third-party services not under Onam control',
  'Issues in non-production or test environments without prior written approval',
]

export default function SecurityPage() {
  return (
    <main className="pt-20 bg-navy-900 min-h-screen">

      {/* Hero */}
      <section className="py-20 bg-mesh border-b border-white/[0.05]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-4">Security</div>
          <h1 className="text-5xl font-extrabold text-white leading-tight tracking-tight mb-5">
            We take security as seriously as you do.
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mb-8">
            Onam is built by security engineers for security teams. Our security posture, disclosure program,
            and data handling practices are held to the same standard we help our customers meet.
          </p>
          <Button href="mailto:security@onam.security" size="md">
            <Mail className="w-4 h-4" />
            Report a vulnerability — security@onam.security
          </Button>
        </div>
      </section>

      {/* Response SLA */}
      <section className="border-b border-white/[0.05] bg-navy-800/50">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div className="glass-card rounded-xl p-5">
              <div className="text-2xl font-extrabold text-brand-300 mb-1">24 hours</div>
              <div className="text-xs text-slate-400">Initial response to every report</div>
            </div>
            <div className="glass-card rounded-xl p-5">
              <div className="text-2xl font-extrabold text-csm-green mb-1">5 days</div>
              <div className="text-xs text-slate-400">Triage and severity assessment</div>
            </div>
            <div className="glass-card rounded-xl p-5">
              <div className="text-2xl font-extrabold text-csm-cyan mb-1">90 days</div>
              <div className="text-xs text-slate-400">Remediation target for critical findings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Security practices */}
      <section className="py-16 bg-navy-900">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-extrabold text-white mb-8">Our security practices</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {practices.map(p => (
              <div key={p.label} className="glass-card rounded-xl p-5 flex gap-3">
                <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-white mb-1">{p.label}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsible Disclosure */}
      <section className="py-16 border-t border-white/[0.05] bg-navy-800/50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-extrabold text-white mb-3">Responsible disclosure program</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-10 max-w-2xl">
            We welcome security researchers who identify vulnerabilities in Onam systems. If you discover a vulnerability,
            we ask that you report it to us responsibly before public disclosure. We commit to acknowledging your report
            within 24 hours and working with you toward resolution.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-csm-green" />
                <span className="text-sm font-semibold text-white">In scope</span>
              </div>
              <ul className="space-y-2">
                {scope.map(item => (
                  <li key={item} className="flex items-start gap-2 text-xs text-slate-400">
                    <span className="text-csm-green mt-0.5">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-csm-amber" />
                <span className="text-sm font-semibold text-white">Out of scope</span>
              </div>
              <ul className="space-y-2">
                {outOfScope.map(item => (
                  <li key={item} className="flex items-start gap-2 text-xs text-slate-400">
                    <span className="text-slate-600 mt-0.5">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-brand-400" />
              <span className="text-sm font-semibold text-white">How to report</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Email <a href="mailto:security@onam.security" className="text-brand-400 hover:text-brand-300">security@onam.security</a> with
              a description of the vulnerability, steps to reproduce, and your assessment of impact. Encrypt sensitive reports
              using our PGP key (available at the link below). We will acknowledge within 24 hours and keep you updated throughout the remediation process.
            </p>
            <p className="text-xs text-slate-400">
              We do not take legal action against researchers who follow this policy and act in good faith.
              We will credit researchers in our release notes unless they prefer to remain anonymous.
            </p>
          </div>
        </div>
      </section>

    </main>
  )
}
