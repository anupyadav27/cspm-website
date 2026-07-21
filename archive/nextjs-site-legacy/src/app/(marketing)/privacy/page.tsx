import type { Metadata } from 'next'
import { Shield, Lock, Eye, Trash2, Mail, Server } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy — Onam',
  description: 'Onam Privacy Policy — how we collect, use, and protect your data.',
}

const sections = [
  {
    id: 'what-we-collect',
    icon: Eye,
    heading: 'What we collect',
    body: 'When you sign up for Onam, we collect your name, work email, and company name. When you connect a cloud account, we store the minimal credentials needed to perform read-only enumeration — cross-account IAM role ARNs, service principals, or service accounts — not long-lived access keys. We also collect usage logs, scan metadata, and any information you provide when contacting our team.',
  },
  {
    id: 'what-we-dont-collect',
    icon: Shield,
    heading: 'What we do not collect',
    body: 'We do not store the contents of your cloud resources — only their configuration metadata (resource IDs, configuration properties, policy documents). We do not read, store, or process the actual data inside your S3 buckets, databases, or other storage services. We do not sell your data to third parties. Ever.',
  },
  {
    id: 'how-we-use',
    icon: Server,
    heading: 'How we use your data',
    body: 'We use your data to operate the Onam platform, provide security findings and compliance reports, send product updates and security alerts you have opted into, and improve the accuracy of our detection rules. We do not use your cloud configuration data to train machine learning models that are shared with other customers.',
  },
  {
    id: 'storage-security',
    icon: Lock,
    heading: 'Data storage and security',
    body: 'All data is stored in AWS (ap-south-1 region). Data at rest is encrypted using AES-256. Data in transit uses TLS 1.2 or higher. Access to production systems is restricted by role-based controls and requires MFA. We retain scan data for 90 days by default. Enterprise customers can configure custom retention periods.',
  },
  {
    id: 'data-sharing',
    icon: Server,
    heading: 'Data sharing',
    body: 'We share data with: (1) AWS, for infrastructure hosting; (2) Stripe, for payment processing — no cloud data is shared with Stripe; (3) third parties only when required by law or with your explicit consent. We do not share your configuration findings, resource inventory, or security posture data with any third parties.',
  },
  {
    id: 'your-rights',
    icon: Shield,
    heading: 'Your rights',
    body: 'You can request a copy of all data we hold about your organisation, request deletion of your data (subject to legal retention requirements), and opt out of non-essential communications at any time. GDPR and CCPA rights apply where relevant. Contact privacy@onam.security for any of these requests.',
  },
  {
    id: 'data-deletion',
    icon: Trash2,
    heading: 'Data deletion',
    body: 'When you terminate your Onam account, all cloud configuration data, scan findings, and associated metadata are deleted within 30 days. Billing records are retained as required by law. You can request immediate deletion by contacting privacy@onam.security with subject line "Data Deletion Request".',
  },
  {
    id: 'contact',
    icon: Mail,
    heading: 'Contact',
    body: 'For privacy questions: privacy@onam.security. For data deletion requests: privacy@onam.security with subject line "Data Deletion Request". For security disclosures: security@onam.security. We respond to all requests within 5 business days.',
  },
]

export default function PrivacyPage() {
  return (
    <main className="pt-20 bg-navy-900 min-h-screen">

      {/* Header */}
      <section className="py-16 border-b border-white/[0.05] bg-mesh">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-3">Legal</div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-slate-400 text-sm">Last updated: May 2026 · Effective: May 2026</p>
          <p className="text-slate-400 mt-4 max-w-2xl text-sm leading-relaxed">
            We are a cloud security company. We take data privacy seriously — especially for a product that touches your cloud infrastructure.
            This policy explains clearly what we collect, why, and what we do not do with it.
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
                Questions about this policy? Email <a href="mailto:privacy@onam.security" className="text-brand-400 hover:underline">privacy@onam.security</a>.
                For security-related disclosures, use <a href="mailto:security@onam.security" className="text-brand-400 hover:underline">security@onam.security</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
