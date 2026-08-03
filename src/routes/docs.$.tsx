import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Prose } from "@/components/site/Prose";
import { BrandButton } from "@/components/site/BrandButton";
import { getDocArticle, DOC_SECTIONS, allDocSlugs } from "@/data/docs";
import { seo, descriptionFromMarkdown, SITE_URL } from "@/lib/seo";
import { extractHeadings, slugifyHeading } from "@/components/site/Prose";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/docs/$")({
  loader: ({ params }) => {
    const slug = params._splat ?? "";
    if (!slug || !allDocSlugs().includes(slug)) throw notFound();
    return { article: getDocArticle(slug) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Not found — Onam docs" }, { name: "robots", content: "noindex" }] };
    }
    const { article } = loaderData;
    return seo({
      title: `${article.title} — Onam docs`,
      description:
        descriptionFromMarkdown(article.body) || `${article.title} — Onam documentation.`,
      path: `/docs/${article.slug}`,
    });
  },
  component: DocArticle,
  notFoundComponent: DocNotFound,
});

function DocNotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="font-display font-black text-3xl text-[#0B1220]">Page not found</h1>
      <p className="mt-3 text-[#475569]">This documentation page doesn't exist yet.</p>
      <div className="mt-6">
        <BrandButton to="/docs">Back to docs</BrandButton>
      </div>
    </div>
  );
}

function findNeighbors(slug: string) {
  const flat = DOC_SECTIONS.flatMap((s) => s.items);
  const i = flat.findIndex((f) => f.slug === slug);
  return {
    prev: i > 0 ? flat[i - 1] : null,
    next: i >= 0 && i < flat.length - 1 ? flat[i + 1] : null,
  };
}

function docJsonLd(article: { title: string; slug: string; body: string }) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: article.title,
      description: descriptionFromMarkdown(article.body) || article.title,
      mainEntityOfPage: `${SITE_URL}/docs/${article.slug}`,
      author: { "@type": "Organization", name: "Onam Security" },
      publisher: {
        "@type": "Organization",
        name: "Onam Security",
        logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-512.png` },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Docs", item: `${SITE_URL}/docs` },
        { "@type": "ListItem", position: 3, name: article.title },
      ],
    },
  ];
}

function DocArticle() {
  const { article } = Route.useLoaderData();
  const headings = extractHeadings(article.body);
  const { prev, next } = findNeighbors(article.slug);

  return (
    <div className="flex gap-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(docJsonLd(article)) }}
      />
      <div className="flex-1 min-w-0 pb-16">
        <nav className="flex items-center gap-1.5 text-xs text-[#64748B] mb-4">
          <Link to="/docs" className="hover:text-[#2563EB]">Docs</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#0B1220]">{article.breadcrumb}</span>
        </nav>
        <h1 className="font-display font-black text-[#0B1220] text-3xl md:text-[40px] tracking-tight leading-[1.1]">
          {article.title}
        </h1>
        <Prose source={article.body} />

        <div className="mt-16 pt-8 border-t border-[#E5E9F0] grid sm:grid-cols-2 gap-4">
          {prev ? (
            <Link
              to="/docs/$"
              params={{ _splat: prev.slug }}
              className="group bg-white border border-[#E5E9F0] rounded-xl p-4 hover:border-[#2563EB] transition"
            >
              <div className="text-[11px] uppercase tracking-widest font-semibold text-[#64748B]">Previous</div>
              <div className="mt-1 font-semibold text-[#0B1220] group-hover:text-[#2563EB]">{prev.title}</div>
            </Link>
          ) : <span />}
          {next ? (
            <Link
              to="/docs/$"
              params={{ _splat: next.slug }}
              className="group bg-white border border-[#E5E9F0] rounded-xl p-4 hover:border-[#2563EB] transition text-right"
            >
              <div className="text-[11px] uppercase tracking-widest font-semibold text-[#64748B]">Next</div>
              <div className="mt-1 font-semibold text-[#0B1220] group-hover:text-[#2563EB]">{next.title}</div>
            </Link>
          ) : <span />}
        </div>
      </div>

      {headings.length > 0 && (
        <aside className="hidden xl:block w-56 shrink-0">
          <div className="sticky top-24">
            <div className="text-[11px] uppercase tracking-widest font-semibold text-[#64748B] mb-3">On this page</div>
            <ul className="space-y-1.5 border-l border-[#E5E9F0] pl-4">
              {headings.map((h) => (
                <li key={h.id}>
                  <a
                    href={`#${slugifyHeading(h.text)}`}
                    className="text-sm text-[#475569] hover:text-[#2563EB] leading-snug block"
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </div>
  );
}
