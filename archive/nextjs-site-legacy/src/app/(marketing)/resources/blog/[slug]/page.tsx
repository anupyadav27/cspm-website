import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRight, Clock, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { getPost, BLOG_POSTS } from '@/lib/blog'
import { IamPermissionsPost } from '@/components/blog/IamPermissionsPost'
import { MitreAttackPost } from '@/components/blog/MitreAttackPost'
import { AgentlessArchPost } from '@/components/blog/AgentlessArchPost'
import { AttackPathsPost }  from '@/components/blog/AttackPathsPost'
import { FairRiskPost }     from '@/components/blog/FairRiskPost'
import { CdrBehavioralPost } from '@/components/blog/CdrBehavioralPost'
import { AiRemediationPost } from '@/components/blog/AiRemediationPost'

export async function generateStaticParams() {
  return BLOG_POSTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return { title: `${post.title} — Onam Blog`, description: post.description }
}

const POST_COMPONENTS: Record<string, React.ComponentType> = {
  'attack-paths-vs-misconfigurations': AttackPathsPost,
  'fair-model-cloud-risk-quantification': FairRiskPost,
  'cdr-behavioral-threat-detection': CdrBehavioralPost,
  'ai-powered-cloud-remediation': AiRemediationPost,
  'why-cloud-iam-permissions-are-never-used': IamPermissionsPost,
  'mitre-attack-cloud-mapping': MitreAttackPost,
  'agentless-cloud-security-architecture': AgentlessArchPost,
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const PostContent = POST_COMPONENTS[slug]
  if (!PostContent) notFound()

  return (
    <main className="pt-20 min-h-screen" style={{ background: '#fff' }}>
      {/* Hero band */}
      <div style={{ background: '#060B18', paddingTop: '3rem', paddingBottom: '3.5rem' }}>
        <div className="max-w-3xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs mb-6" style={{ color: '#64748B' }}>
            <a href="/resources/blog" style={{ color: '#64748B' }} className="hover:text-indigo-400 transition-colors">Blog</a>
            <span>/</span>
            <span style={{ color: '#818CF8' }}>{post.tag}</span>
          </div>
          <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-4" style={{ color: '#818CF8', background: 'rgba(99,102,241,0.12)' }}>
            {post.tag}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight mb-4" style={{ color: '#fff' }}>
            {post.title}
          </h1>
          <p className="text-lg leading-relaxed mb-6" style={{ color: '#94A3B8' }}>{post.description}</p>
          <div className="flex items-center gap-5 text-sm" style={{ color: '#64748B' }}>
            <div>
              <span className="font-medium" style={{ color: '#CBD5E1' }}>{post.author}</span>
              <span className="ml-1" style={{ color: '#475569' }}>· {post.authorTitle}</span>
            </div>
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{formatDate(post.date)}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.readMin} min read</span>
          </div>
        </div>
      </div>

      {/* Article body — white background, dark text */}
      <article className="max-w-3xl mx-auto px-6 py-14 blog-content">
        <PostContent />
      </article>

      {/* Footer nav */}
      <div className="max-w-3xl mx-auto px-6 pb-10 border-t" style={{ borderColor: '#E5E7EB', paddingTop: '2rem' }}>
        <a href="/resources/blog" className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-500 transition-colors font-medium">
          <ArrowRight className="w-3.5 h-3.5 rotate-180" /> All articles
        </a>
      </div>

      {/* Demo CTA */}
      <section className="py-14 text-center" style={{ background: '#060B18' }}>
        <div className="max-w-xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-white mb-3">See this in your own cloud</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Book a 45-minute live scan with a security engineer. Real findings from your real environment — no slides, no pitch.
          </p>
          <Button href="/request-demo" size="lg">Book a live demo <ArrowRight className="w-4 h-4" /></Button>
        </div>
      </section>
    </main>
  )
}
