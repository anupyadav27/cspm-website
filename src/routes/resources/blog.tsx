import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/data/blog-posts";
import { useState } from "react";

export const Route = createFileRoute("/resources/blog")({
  head: () => ({
    meta: [
      { title: "The Onam blog — Onam Security" },
      { name: "description", content: "New findings, deep dives on cloud attacks, and product updates from the Onam team." },
      { property: "og:title", content: "The Onam blog — Onam Security" },
      { property: "og:description", content: "New findings, deep dives on cloud attacks, and product updates from the Onam team." },
    ],
  }),
  component: BlogLayout,
});

function BlogLayout() {
  const matches = useMatches();
  const isChild = matches.some((m) => m.routeId === "/resources/blog/$slug");
  if (isChild) return <Outlet />;
  return <BlogIndex />;
}

function BlogIndex() {
  const [active, setActive] = useState<string | null>(null);
  const featured = BLOG_POSTS[0];
  const rest = BLOG_POSTS.slice(1);
  const filtered = active ? rest.filter((p) => p.category === active) : rest;

  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-[#E5E9F0] bg-white">
        <div className="absolute -top-32 right-0 w-[600px] h-[400px] rounded-full bg-[#2563EB]/10 blur-[140px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-12">
          <div className="text-[11px] uppercase tracking-widest font-semibold text-[#1D4ED8] mb-3">Blog</div>
          <h1 className="font-display font-black text-[#0B1220] text-4xl md:text-5xl tracking-tight max-w-3xl leading-[1.05]">
            The Onam blog
          </h1>
          <p className="mt-4 text-lg text-[#475569] max-w-2xl">
            New findings, deep dives on cloud attacks, and product updates from the Onam team.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActive(null)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
              active === null
                ? "bg-[#2563EB] text-white border-[#2563EB]"
                : "bg-white text-[#0B1220] border-[#E5E9F0] hover:border-[#94A3B8]"
            }`}
          >
            All posts
          </button>
          {BLOG_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                active === c
                  ? "bg-[#2563EB] text-white border-[#2563EB]"
                  : "bg-white text-[#0B1220] border-[#E5E9F0] hover:border-[#94A3B8]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {(!active || active === featured.category) && (
        <section className="max-w-7xl mx-auto px-6 pt-10">
          <Link
            to="/resources/blog/$slug"
            params={{ slug: featured.slug }}
            className="group block bg-white border border-[#E5E9F0] rounded-3xl p-8 md:p-10 hover:shadow-[0_12px_36px_rgba(16,24,40,.10)] transition"
          >
            <div className="grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
                    {featured.category}
                  </span>
                  <span className="text-[11px] uppercase tracking-widest font-semibold text-[#64748B]">Featured</span>
                </div>
                <h2 className="mt-4 font-display font-black text-[#0B1220] text-3xl md:text-4xl leading-tight tracking-tight group-hover:text-[#2563EB]">
                  {featured.title}
                </h2>
                <p className="mt-4 text-[#475569] leading-relaxed">{featured.excerpt}</p>
                <div className="mt-6 text-sm text-[#64748B]">
                  {featured.author} • {featured.date} • {featured.readTime} read
                </div>
              </div>
              <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#EFF4FF] via-white to-[#E7F6EF] border border-[#E5E9F0] overflow-hidden">
                <div className="absolute inset-0 dot-grid opacity-40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl font-black font-display tracking-tight text-[#0B1220]/10 select-none">
                    {featured.category}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <Link
              key={p.slug}
              to="/resources/blog/$slug"
              params={{ slug: p.slug }}
              className="group bg-white border border-[#E5E9F0] rounded-2xl p-6 hover:shadow-[0_8px_24px_rgba(16,24,40,.08)] transition flex flex-col"
            >
              <span className="inline-flex self-start items-center px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
                {p.category}
              </span>
              <h3 className="mt-3 font-display font-bold text-[18px] text-[#0B1220] leading-snug group-hover:text-[#2563EB]">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-[#475569] line-clamp-3 flex-1">{p.excerpt}</p>
              <div className="mt-5 pt-4 border-t border-[#EEF2F6] text-xs text-[#64748B] flex items-center justify-between">
                <span>{p.author}</span>
                <span>{p.date} • {p.readTime}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
