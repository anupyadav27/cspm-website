import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { ChevronRight, Linkedin } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { AUTHORS, getAuthor, personJsonLd, authorUrl, RENAMED_SLUGS, type Author } from "@/data/authors";
import { BLOG_POSTS } from "@/data/blog-posts";
import { LEARN_ARTICLES } from "@/data/learn-articles";
import { seo, SITE_URL } from "@/lib/seo";

/**
 * One page per named author. This is the entity page every article's schema points at,
 * so it carries the full Person node (with sameAs when a public profile exists) and lists
 * the pieces the person wrote or reviewed — the same corroboration a human would look for.
 */
function schema(a: Author) {
  return [
    { "@context": "https://schema.org", ...personJsonLd(a) },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "About", item: `${SITE_URL}/company/about` },
        { "@type": "ListItem", position: 3, name: a.name },
      ],
    },
  ];
}

export const Route = createFileRoute("/company/team/$slug")({
  loader: ({ params }) => {
    const author = getAuthor(params.slug);
    if (!author) {
      // A corrected slug: send the indexed URL to the canonical one instead of a 404.
      const renamed = RENAMED_SLUGS[params.slug];
      if (renamed) throw redirect({ to: "/company/team/$slug", params: { slug: renamed } });
      throw notFound();
    }
    return { author };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Not found — Onam Security" }, { name: "robots", content: "noindex" }] };
    }
    const a = loaderData.author;
    return seo({
      title: `${a.name}, ${a.role} — Onam Security`,
      description: a.bio ?? `${a.name} is ${a.role} at Onam Security and writes about ${a.topics.join(", ").toLowerCase()}.`,
      path: `/company/team/${a.slug}`,
      ogType: "profile",
    });
  },
  component: AuthorPage,
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <SiteLayout>
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display font-black text-3xl text-[#0B1220]">Person not found</h1>
        <div className="mt-6">
          <BrandButton to="/company/about">Meet the team</BrandButton>
        </div>
      </div>
    </SiteLayout>
  );
}

function AuthorPage() {
  const { author } = Route.useLoaderData();
  const wrote = BLOG_POSTS.filter((p) => p.author === author.slug);
  const reviewed = BLOG_POSTS.filter((p) => p.reviewedBy === author.slug);
  const explainers = LEARN_ARTICLES.filter((a) => a.author === author.slug);
  const others = AUTHORS.filter((a) => a.slug !== author.slug);

  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema(author)) }} />

      <section className="border-b border-[#E5E9F0] bg-white">
        <div className="max-w-3xl mx-auto px-6 pt-14 pb-12">
          <nav className="flex items-center gap-1.5 text-xs text-[#64748B] mb-8">
            <Link to="/company/about" className="hover:text-[#2563EB]">About</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#0B1220]">{author.name}</span>
          </nav>

          <div className="flex gap-6 items-start">
            <div
              className="w-20 h-20 rounded-2xl grid place-items-center font-display font-black text-white text-2xl shrink-0"
              style={{ backgroundColor: author.color }}
            >
              {author.initials}
            </div>
            <div>
              <h1 className="font-display font-black text-[#0B1220] text-3xl md:text-4xl tracking-tight">{author.name}</h1>
              <div className="mt-1 text-base font-semibold text-[#2563EB]">{author.role}, Onam Security</div>
              {author.bio && <p className="mt-4 text-[#475569] leading-relaxed">{author.bio}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                {author.topics.map((t) => (
                  <span key={t} className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
                    {t}
                  </span>
                ))}
              </div>
              {author.linkedin && (
                <a
                  href={author.linkedin}
                  rel="me noopener"
                  target="_blank"
                  className="mt-5 inline-flex items-center gap-2 rounded-[10px] px-4 py-2 text-sm font-semibold bg-white text-[#0B1220] border border-[#CBD5E1] hover:bg-[#F1F5F9] transition"
                >
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {(explainers.length > 0 || wrote.length > 0 || reviewed.length > 0) && (
        <section className="max-w-3xl mx-auto px-6 py-14 space-y-12">
          {explainers.length > 0 && (
            <div>
              <h2 className="font-display font-extrabold text-2xl text-[#0B1220] mb-5">Explainers</h2>
              <ul className="space-y-3">
                {explainers.map((a) => (
                  <li key={a.slug}>
                    <Link to="/learn/$slug" params={{ slug: a.slug }} className="font-semibold text-[#0B1220] hover:text-[#2563EB]">
                      {a.question}
                    </Link>
                    <div className="text-sm text-[#64748B]">{a.readTime} read</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {wrote.length > 0 && (
            <div>
              <h2 className="font-display font-extrabold text-2xl text-[#0B1220] mb-5">Articles</h2>
              <ul className="space-y-3">
                {wrote.map((p) => (
                  <li key={p.slug}>
                    <Link to="/resources/blog/$slug" params={{ slug: p.slug }} className="font-semibold text-[#0B1220] hover:text-[#2563EB]">
                      {p.title}
                    </Link>
                    <div className="text-sm text-[#64748B]">{p.date} • {p.readTime}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {reviewed.length > 0 && (
            <div>
              <h2 className="font-display font-extrabold text-2xl text-[#0B1220] mb-5">Reviewed</h2>
              <ul className="space-y-3">
                {reviewed.map((p) => (
                  <li key={p.slug}>
                    <Link to="/resources/blog/$slug" params={{ slug: p.slug }} className="font-semibold text-[#0B1220] hover:text-[#2563EB]">
                      {p.title}
                    </Link>
                    <div className="text-sm text-[#64748B]">{p.date}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <section className="bg-[#F7F9FC] border-y border-[#E5E9F0]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="font-display font-extrabold text-xl text-[#0B1220] mb-5">Also at Onam</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {others.map((a) => (
              <Link key={a.slug} to="/company/team/$slug" params={{ slug: a.slug }} className="group bg-white border border-[#E5E9F0] rounded-2xl p-5 flex gap-4 items-center hover:shadow-[0_8px_24px_rgba(16,24,40,.08)] transition">
                <div className="w-12 h-12 rounded-xl grid place-items-center font-display font-black text-white shrink-0" style={{ backgroundColor: a.color }}>
                  {a.initials}
                </div>
                <div>
                  <div className="font-display font-bold text-[#0B1220] group-hover:text-[#2563EB]">{a.name}</div>
                  <div className="text-xs font-semibold text-[#2563EB]">{a.role}</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-sm text-[#64748B]">
            Canonical profile: <a href={authorUrl(author)} className="text-[#2563EB]">{authorUrl(author)}</a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
