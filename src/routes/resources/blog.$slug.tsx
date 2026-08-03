import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { Prose } from "@/components/site/Prose";
import { BLOG_POSTS, getPost, type BlogPost } from "@/data/blog-posts";
import { seo, SITE_URL } from "@/lib/seo";
import { ChevronRight } from "lucide-react";

function articleJsonLd(p: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.excerpt,
    author: { "@type": "Organization", name: p.author },
    datePublished: new Date(p.date).toISOString().slice(0, 10),
    mainEntityOfPage: `${SITE_URL}/resources/blog/${p.slug}`,
    image: `${SITE_URL}/og-image.png`,
    publisher: {
      "@type": "Organization",
      name: "Onam Security",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-512.png` },
    },
  };
}

export const Route = createFileRoute("/resources/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Not found — Onam Security" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.post;
    return seo({
      title: `${p.title} — Onam Security`,
      description: p.excerpt,
      path: `/resources/blog/${p.slug}`,
      ogType: "article",
    });
  },
  component: Article,
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <SiteLayout>
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display font-black text-3xl text-[#0B1220]">Post not found</h1>
        <p className="mt-3 text-[#475569]">This article may have been moved or unpublished.</p>
        <div className="mt-6">
          <BrandButton to="/resources/blog">Back to the blog</BrandButton>
        </div>
      </div>
    </SiteLayout>
  );
}

function fallbackBody(p: BlogPost) {
  return `
This post explores **${p.title.toLowerCase()}** — a topic that comes up in almost every conversation we have with cloud security teams.

## The short version

Most teams inherit an environment that has been growing for years. The result is a mix of legacy defaults, ad-hoc exceptions, and controls that were right at the time and haven't been reviewed since. The category this post covers — **${p.category}** — sits at exactly that intersection: high leverage if you get it right, high blast radius if you don't.

## What we see in the wild

- Findings that look identical on paper but have wildly different real-world impact.
- Controls that pass every audit but leave the door open to a chained attack.
- Prioritization based on severity alone, which quietly buries the findings that matter.

## A better approach

Think of security posture as a graph, not a list. A misconfiguration in isolation is a data point; a misconfiguration that sits on a path from the public internet to your most sensitive data is an incident waiting to happen. That's the shift Onam is built around.

> "The right question isn't 'how many findings do I have?' It's 'which two findings turn into a breach if I don't fix them this week?'"

## Where to go next

- Book time with the team via [Request a demo](/request-demo).
- Read the [platform overview](/docs/architecture/overview) for how Onam models this internally.
- Explore related capabilities in the [documentation](/docs).
`;
}

function Article() {
  const { post } = Route.useLoaderData();
  const body = post.body ?? fallbackBody(post);
  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <SiteLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            articleJsonLd(post),
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/resources/blog` },
                { "@type": "ListItem", position: 3, name: post.title },
              ],
            },
          ]),
        }}
      />
      <article>
        <section className="border-b border-[#E5E9F0] bg-white">
          <div className="max-w-3xl mx-auto px-6 pt-14 pb-10">
            <nav className="flex items-center gap-1.5 text-xs text-[#64748B] mb-6">
              <Link to="/resources" className="hover:text-[#2563EB]">Resources</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link to="/resources/blog" className="hover:text-[#2563EB]">Blog</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#0B1220]">{post.category}</span>
            </nav>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
              {post.category}
            </span>
            <h1 className="mt-4 font-display font-black text-[#0B1220] text-3xl md:text-[44px] tracking-tight leading-[1.1]">
              {post.title}
            </h1>
            <div className="mt-6 flex items-center gap-3 text-sm text-[#64748B]">
              <span className="font-medium text-[#0B1220]">{post.author}</span>
              <span>•</span>
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime} read</span>
            </div>
          </div>
          <div className="max-w-3xl mx-auto px-6">
            <div className="h-px bg-gradient-to-r from-transparent via-[#E5E9F0] to-transparent" />
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 py-14">
          <Prose source={body} />
        </section>
      </article>

      <section className="bg-[#F7F9FC] border-y border-[#E5E9F0]">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <h2 className="font-display font-extrabold text-2xl text-[#0B1220] mb-6">Related posts</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {related.map((p) => (
              <Link
                key={p.slug}
                to="/resources/blog/$slug"
                params={{ slug: p.slug }}
                className="group bg-white border border-[#E5E9F0] rounded-2xl p-6 hover:shadow-[0_8px_24px_rgba(16,24,40,.08)] transition"
              >
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
                  {p.category}
                </span>
                <h3 className="mt-3 font-display font-bold text-[17px] text-[#0B1220] leading-snug group-hover:text-[#2563EB]">
                  {p.title}
                </h3>
                <div className="mt-4 text-xs text-[#64748B]">{p.date} • {p.readTime}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white border border-[#E5E9F0] rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_1px_3px_rgba(16,24,40,.04)]">
          <div>
            <h3 className="font-display font-extrabold text-2xl text-[#0B1220]">See how this looks on your cloud</h3>
            <p className="mt-2 text-[#475569] max-w-2xl">
              A live 30-minute walkthrough of Onam against a sample environment that mirrors yours.
            </p>
          </div>
          <div className="flex gap-3">
            <BrandButton to="/request-demo">Request demo</BrandButton>
            <BrandButton to="/resources/blog" variant="secondary">More posts</BrandButton>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
