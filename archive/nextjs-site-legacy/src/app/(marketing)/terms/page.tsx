import type { Metadata } from 'next'
import { FileText, Shield, Key, Database, Activity, AlertTriangle, RefreshCw, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Use — Onam',
  description: 'Onam Terms of Use — the agreement governing your use of the Onam platform.',
}

const sections = [
  {
    id: 'acceptance',
    icon: FileText,
    heading: 'Acceptance',
    body: 'By accessing or using the Onam platform ("Service"), you agree to these Terms of Use. If you are using the Service on behalf of an organisation, you represent that you have the authority to bind that organisation to these terms. If you do not agree, do not use the Service.',
  },
  {
    id: 'use-of-service',
    icon: Activity,
    heading: 'Use of the Service',
    body: 'Onam grants you a limited, non-exclusive, non-transferable licence to use the Service for your internal security operations. You must not: attempt to access cloud accounts other than your own; use the Service to perform offensive security assessments against infrastructure you do not own or are not authorised to test; reverse engineer the platform; or resell access to the Service.',
  },
  {
    id: 'credentials',
    icon: Key,
    heading: 'Your cloud credentials',
    body: 'You are responsible for the security of the cloud credentials you provide to Onam. We require read-only permissions and document the minimum required policy for each cloud provider in our documentation. You should not grant Onam credentials with write or destructive permissions. We store credentials encrypted at rest and access them only for the purpose of performing authorised scans.',
  },
  {
    id: 'data-ownership',
    icon: Database,
    heading: 'Data ownership',
    body: 'You own all cloud configuration data and security findings associated with your account. Onam does not claim any ownership over your data. You may export or delete your data at any time through the platform or by contacting us. Upon account termination, your data is deleted within 30 days.',
  },
  {
    id: 'availability',
    icon: Activity,
    heading: 'Service availability',
    body: 'We target 99.5% uptime for the Onam platform on Pro and Enterprise plans. Scheduled maintenance is announced at least 48 hours in advance. We are not liable for downtime caused by upstream cloud provider outages, network failures outside our control, or force majeure events. Historical uptime is published at our status page.',
  },
  {
    id: 'liability',
    icon: AlertTriangle,
    heading: 'Limitation of liability',
    body: 'The Service is provided for informational and operational security purposes. Security findings represent Onam\'s assessment based on configuration data at the time of scan and should not be the sole basis for security decisions. Onam\'s aggregate liability to you shall not exceed the fees you paid in the 12 months preceding the claim.',
  },
  {
    id: 'changes',
    icon: RefreshCw,
    heading: 'Changes to terms',
    body: 'We may update these terms from time to time. Material changes will be notified by email at least 30 days in advance. Changes to address legal requirements or correct errors may take effect immediately. Continued use of the Service after changes take effect constitutes acceptance of the updated terms.',
  },
  {
    id: 'contact',
    icon: Mail,
    heading: 'Contact',
    body: 'For questions about these terms: legal@onam.security. For security disclosures: security@onam.security. For all other enquiries: hello@onam.security. We aim to respond to all enquiries within 2 business days.',
  },
]

export default function TermsPage() {
  return (
    <main className="pt-20 bg-navy-900 min-h-screen">

      {/* Header */}
      <section className="py-16 border-b border-white/[0.05] bg-mesh">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-3">Legal</div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Terms of Use</h1>
          <p className="text-slate-400 text-sm">Last updated: May 2026 · Effective: May 2026</p>
          <p className="text-slate-400 mt-4 max-w-2xl text-sm leading-relaxed">
            These terms govern your use of the Onam platform. They are written to be readable, not to obscure what you are agreeing to.
            If you have questions, email <a href="mailto:legal@onam.security" className="text-brand-400 hover:underline">legal@onam.security</a>.
          </p>
        </div>
      </section>

      {/* Content with sidebar */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6 grid lg:grid-cols-4 gap-12 items-start">

          {/* Sticky TOC */}
          <nav className="hidden lg:block sticky top-24 glass-card rounded-xl p-5">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Contents</div>
            <ul className="space-y-1">
              {sections.map(s => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-xs text-slate-400 hover:text-brand-400 transition-colors block py-1 leading-snug">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sections */}
          <div className="lg:col-span-3 space-y-12">
            {sections.map(s => (
              <div key={s.id} id={s.id} className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
                    <s.icon className="w-4 h-4 text-brand-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">{s.heading}</h2>
                </div>
                <p className="text-slate-400 leading-relaxed text-sm pl-11">{s.body}</p>
              </div>
            ))}

            <div className="glass-card rounded-xl p-5 border-l-2 border-brand-500/40">
              <p className="text-xs text-slate-400 leading-relaxed">
                Questions about these terms? Email <a href="mailto:legal@onam.security" className="text-brand-400 hover:underline">legal@onam.security</a>.
                See also our <a href="/privacy" className="text-brand-400 hover:underline">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
