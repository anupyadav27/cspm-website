import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { Prose, faqJsonLd } from "@/components/site/Prose";
import { getPost, relatedPosts, type BlogPost } from "@/data/blog-posts";
import { retiredTarget } from "@/data/retired-pages";
import { seo, SITE_URL } from "@/lib/seo";
import { getAuthor, personJsonLd } from "@/data/authors";
import { ArrowRight, ChevronRight, Newspaper } from "@/components/site/icons";
import { Backdrop } from "@/components/site/system";

/** "November 27, 2026" -> "2026-11-27", from the local calendar date (toISOString would shift it a day in UTC+ zones). */
const isoDate = (d: string) => {
  const t = new Date(d);
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
};

/**
 * A body may open with an `:::answer` block: the short answer, shown in a box above the
 * article and used as the meta description. Blog-only; Prose never sees it.
 */
function splitAnswer(body: string): { answer?: string; rest: string } {
  const m = /^\s*:::answer[^\n]*\n([\s\S]*?)\n:::\s*\n/.exec(body);
  if (!m) return { rest: body };
  return { answer: m[1].trim(), rest: body.slice(m[0].length) };
}

function plainAnswer(md: string) {
  return md.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*`]/g, "").replace(/\s+/g, " ").trim();
}

function articleJsonLd(p: BlogPost) {
  const author = getAuthor(p.author);
  const reviewer = p.reviewedBy ? getAuthor(p.reviewedBy) : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.excerpt,
    // A named Person with an @id that resolves to /company/team/<slug>, not an
    // anonymous Organization — the entity Google can corroborate.
    author: author ? personJsonLd(author) : { "@type": "Organization", name: "Onam Security" },
    ...(reviewer ? { reviewedBy: personJsonLd(reviewer) } : {}),
    datePublished: isoDate(p.date),
    dateModified: isoDate(p.updated ?? p.date),
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
    // Retired or merged posts 301 to the post that absorbed them (src/data/retired-pages.ts).
    const moved = retiredTarget(`/resources/blog/${params.slug}`);
    if (moved) throw redirect({ href: moved, statusCode: 301 });
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Not found — Onam Security" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.post;
    const answer = p.body ? splitAnswer(p.body).answer : undefined;
    return seo({
      title: `${p.title} — Onam Security`,
      description: answer ? plainAnswer(answer) : p.excerpt,
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
${p.excerpt}

The full article is not published yet. In the meantime:

- Read the [platform overview](/docs/architecture/overview) for how Onam works.
- Browse the [documentation](/docs).
- Book time with the team via [Request a demo](/request-demo).
`;
}

function Article() {
  const { post } = Route.useLoaderData();
  const { answer, rest: body } = splitAnswer(post.body ?? fallbackBody(post));
  const related = relatedPosts(post);
  const ctaFrom = `/resources/blog/${post.slug}`;
  const author = getAuthor(post.author);
  const reviewer = post.reviewedBy ? getAuthor(post.reviewedBy) : undefined;

  return (
    <SiteLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            articleJsonLd(post),
            // A post with a :::faq block also gets FAQPage structured data.
            ...(post.body && faqJsonLd(post.body) ? [faqJsonLd(post.body)] : []),
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
        <section className="relative overflow-hidden border-b border-[#E5E9F0] bg-white">
          <Backdrop tone="light" color="#2563EB" pattern="dots" icon={Newspaper} className="opacity-80" />
          <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-12 md:pt-20 md:pb-14">
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
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[#64748B]">
              {author ? (
                <Link to="/company/team/$slug" params={{ slug: author.slug }} className="font-medium text-[#0B1220] hover:text-[#2563EB]">
                  By {author.name}, {author.role}
                </Link>
              ) : (
                <span className="font-medium text-[#0B1220]">Onam Security</span>
              )}
              {reviewer && (
                <>
                  <span>•</span>
                  <Link to="/company/team/$slug" params={{ slug: reviewer.slug }} className="hover:text-[#2563EB]">
                    Reviewed by {reviewer.name}
                  </Link>
                </>
              )}
              <span>•</span>
              <span>{post.date}</span>
              {post.updated && post.updated !== post.date && (
                <>
                  <span>•</span>
                  <span>Updated {post.updated}</span>
                </>
              )}
              <span>•</span>
              <span>{post.readTime} read</span>
            </div>
          </div>
          <div className="relative max-w-3xl mx-auto px-6">
            <div className="h-px bg-gradient-to-r from-transparent via-[#E5E9F0] to-transparent" />
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 pt-8">
          <div className="bg-[#F7F9FC] border border-[#E5E9F0] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm text-[#475569]">
              <span className="font-semibold text-[#0B1220]">Would rather we looked for you?</span>{" "}
              We run a free one-time audit scan of one cloud account and go through the results with you. No charge, no commitment.
            </p>
            <BrandButton to="/audit-scan" variant="secondary">
              Free audit scan
            </BrandButton>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 py-14">
          {answer && <AnswerBox source={answer} />}
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
            <h3 className="font-display font-extrabold text-2xl text-[#0B1220]">See this on your own cloud, free</h3>
            <p className="mt-2 text-[#475569] max-w-2xl">
              The free plan covers up to 25 units of cloud security with read-only cloud API scanning. It deploys no agent or
              scanner and needs no card. Register, and the team emails you the login.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <BrandButton to="/start-free" search={{ from: ctaFrom }}>
              Start free <ArrowRight className="w-4 h-4" />
            </BrandButton>
            <BrandButton to="/request-demo" variant="secondary">Book a demo</BrandButton>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

/** The short answer at the top of a customer-question post (`:::answer`). */
function AnswerBox({ source }: { source: string }) {
  return (
    <aside aria-label="Short answer" className="mb-10 rounded-xl border border-[#DBE7FE] bg-[#F5F8FF] px-5 pt-4 pb-1">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-[#1D4ED8] mb-2">The short answer</div>
      <Prose source={source} />
    </aside>
  );
}
