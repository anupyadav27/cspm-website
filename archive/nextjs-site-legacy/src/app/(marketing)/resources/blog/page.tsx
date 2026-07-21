import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { BLOG_POSTS } from '@/lib/blog'

export const metadata: Metadata = { title: 'Blog — Onam', description: 'Cloud security insights, real-world attack analysis, and technical deep-dives from the Onam team.' }

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogPage() {
  return (
    <main className="pt-20 bg-navy-900 min-h-screen">
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-3">Blog</div>
          <h1 className="text-4xl font-bold text-white mb-4">Security insights from the team.</h1>
          <p className="text-slate-300 text-lg mb-12 max-w-2xl">
            Cloud security research, real-world attack analysis, and technical deep-dives — written by engineers who build detection rules every day.
          </p>

          <div className="space-y-6 mb-16">
            {BLOG_POSTS.map(post => (
              <Link key={post.slug} href={`/resources/blog/${post.slug}`}
                className="block glass-card rounded-2xl p-7 hover:border-brand-500/30 transition-colors group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full">
                    {post.tag}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Calendar className="w-3 h-3" />{formatDate(post.date)}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />{post.readMin} min read
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mb-2 group-hover:text-brand-300 transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">{post.description}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-400 group-hover:gap-2 transition-all">
                  Read article <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-4">
            <Link href="/resources" className="inline-flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 transition-colors">
              <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Back to resources
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 border-t border-white/[0.05] bg-navy-800/50 text-center">
        <h2 className="text-xl font-bold text-white mb-3">Want to see this in your environment?</h2>
        <p className="text-slate-400 mb-6 text-sm">Book a 45-minute live scan with a security engineer — no slides, no pitch.</p>
        <Button href="/request-demo" size="md">Book a live demo <ArrowRight className="w-4 h-4" /></Button>
      </section>
    </main>
  )
}
