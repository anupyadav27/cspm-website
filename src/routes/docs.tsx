import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { DOC_SECTIONS, docGroups, type DocProduct } from "@/data/docs";
import { SUITE } from "@/data/product-suite";
import { Search } from "lucide-react";
import { useState } from "react";

const DESCRIPTION =
  "Documentation for the Onam platform — connect a cloud once, then Onam Estate, Onam Security, Onam FinOps, Onam DRM and Onam AIOps.";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Documentation — Onam" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Onam documentation" },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: DocsLayout,
});

/** Product colour for a docs group; platform and shared groups use ink and muted. */
function docProductColor(p: DocProduct): string {
  const suite = SUITE.find((s) => s.key === p);
  if (suite) return suite.color;
  return p === "platform" ? "#0B1220" : "#64748B";
}

function DocsLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const sections = DOC_SECTIONS.map((sec) => ({
    ...sec,
    items: query ? sec.items.filter((i) => i.title.toLowerCase().includes(query)) : sec.items,
  })).filter((sec) => sec.items.length > 0);
  const groups = docGroups(sections);

  return (
    <SiteLayout>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex gap-10 py-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <div className="relative mb-5">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-500" aria-hidden />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search docs"
                  aria-label="Search docs"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-line rounded-lg focus:outline-none focus:border-brand-500"
                />
              </div>
              <nav aria-label="Documentation" className="max-h-[calc(100vh-10rem)] overflow-y-auto pr-2">
                {groups.length === 0 && <p className="px-2 text-sm text-muted-500">No pages match “{q}”.</p>}
                {groups.map((g) => {
                  const color = docProductColor(g.product);
                  return (
                    <div key={g.product} className="mb-6">
                      <div className="flex items-center gap-2 px-2 mb-2">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} aria-hidden />
                        <span className="text-[13px] font-display font-bold text-ink">{g.label}</span>
                      </div>
                      {g.sections.map((sec) => (
                        <div key={sec.heading} className="mb-3">
                          {/* A single-section product repeats its name; show the heading only when it adds something. */}
                          {sec.heading !== g.label && (
                            <div className="text-[11px] uppercase tracking-widest font-semibold text-muted-500 mb-1 px-2">
                              {sec.heading}
                            </div>
                          )}
                          <ul className="space-y-0.5">
                            {sec.items.map((it) => {
                              const active = path === `/docs/${it.slug}`;
                              return (
                                <li key={it.slug}>
                                  <Link
                                    to="/docs/$"
                                    params={{ _splat: it.slug }}
                                    aria-current={active ? "page" : undefined}
                                    className={`block px-2 py-1.5 text-sm rounded-md transition ${
                                      active
                                        ? "bg-tint-blue text-brand-600 font-semibold"
                                        : "text-navy-600 hover:bg-surface hover:text-ink"
                                    }`}
                                  >
                                    {it.title}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </nav>
            </div>
          </aside>
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
