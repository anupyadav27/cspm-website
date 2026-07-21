import { getAllDocSlugs, getDoc } from '@/lib/docs'
import { TableOfContents } from '@/components/docs/TableOfContents'
import { DocsFeedback } from '@/components/docs/DocsFeedback'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const slugs = getAllDocSlugs()
  return slugs.filter((s) => s.length > 0).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const doc = await getDoc(slug)
  if (!doc) return {}
  return {
    title: `${doc.title} — onam Docs`,
    description: doc.description,
  }
}

const SECTION_LABELS: Record<string, string> = {
  architecture: 'Architecture',
  compliance: 'Compliance',
  features: 'Security Capabilities',
  onboarding: 'Connect Your Cloud',
  reference: 'Reference',
  trust: 'Trust & Security',
  'release-notes': 'Release Notes',
}

export default async function DocPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const doc = await getDoc(slug)
  if (!doc) notFound()

  const section = SECTION_LABELS[slug[0]] ?? ''

  return (
    <div className="flex gap-12 px-10 py-10 w-full">
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="mb-8 pb-6" style={{ borderBottom: '1px solid #F3F4F6' }}>
          {section && (
            <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full mb-3"
              style={{ background: '#EEF2FF', color: '#4F46E5', border: '1px solid #C7D2FE' }}>
              {section}
            </span>
          )}
          <h1 className="text-3xl font-extrabold tracking-tight leading-snug" style={{ color: '#0f172a' }}>
            {doc.title}
          </h1>
          {doc.description && (
            <p className="mt-3 text-base leading-relaxed" style={{ color: '#4b5563' }}>
              {doc.description}
            </p>
          )}
        </div>

        <article className="docs-content" dangerouslySetInnerHTML={{ __html: doc.content }} />

        <DocsFeedback pageId={slug.join('/')} />

        {/* Footer */}
        <div className="mt-8 pt-4 flex items-center justify-between text-xs"
          style={{ borderTop: '1px solid #F3F4F6', color: '#9CA3AF' }}>
          <span>Last updated May 2026</span>
          <a href="mailto:support@onam.io" className="hover:text-indigo-500 transition-colors">
            Questions? Contact support →
          </a>
        </div>
      </div>

      <TableOfContents headings={doc.headings} />
    </div>
  )
}
