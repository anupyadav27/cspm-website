import { getDoc } from '@/lib/docs'
import { TableOfContents } from '@/components/docs/TableOfContents'
import { notFound } from 'next/navigation'

export default async function DocsHomePage() {
  const doc = await getDoc([])
  if (!doc) notFound()

  return (
    <div className="flex gap-12 px-10 py-10 w-full">
      <div className="flex-1 min-w-0">
        <div className="mb-8 pb-6" style={{ borderBottom: '1px solid #F3F4F6' }}>
          <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full mb-3"
            style={{ background: '#EEF2FF', color: '#4F46E5', border: '1px solid #C7D2FE' }}>
            Overview
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight leading-snug" style={{ color: '#0f172a' }}>
            {doc.title}
          </h1>
        </div>

        <article className="docs-content" dangerouslySetInnerHTML={{ __html: doc.content }} />
      </div>

      <TableOfContents headings={doc.headings} />
    </div>
  )
}
