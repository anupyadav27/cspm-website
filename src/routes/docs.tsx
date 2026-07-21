import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { DOC_SECTIONS } from "@/data/docs";
import { Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Documentation — Onam Security" },
      { name: "description", content: "Everything you need to connect a cloud, tune findings, and integrate Onam into your workflows." },
      { property: "og:title", content: "Onam documentation" },
      { property: "og:description", content: "Everything you need to connect a cloud, tune findings, and integrate Onam into your workflows." },
    ],
  }),
  component: DocsLayout,
});

function DocsLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  return (
    <SiteLayout>
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex gap-10 py-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <div className="relative mb-5">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search docs"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E5E9F0] rounded-lg focus:outline-none focus:border-[#2563EB]"
                />
              </div>
              <nav className="max-h-[calc(100vh-10rem)] overflow-y-auto pr-2">
                {DOC_SECTIONS.map((sec) => {
                  const items = query
                    ? sec.items.filter((i) => i.title.toLowerCase().includes(query))
                    : sec.items;
                  if (items.length === 0) return null;
                  return (
                    <div key={sec.heading} className="mb-5">
                      <div className="text-[11px] uppercase tracking-widest font-semibold text-[#64748B] mb-2 px-2">
                        {sec.heading}
                      </div>
                      <ul className="space-y-0.5">
                        {items.map((it) => {
                          const to = `/docs/${it.slug}`;
                          const active = path === to;
                          return (
                            <li key={it.slug}>
                              <Link
                                to="/docs/$"
                                params={{ _splat: it.slug }}
                                className={`block px-2 py-1.5 text-sm rounded-md transition ${
                                  active
                                    ? "bg-[#EFF4FF] text-[#1D4ED8] font-semibold"
                                    : "text-[#334155] hover:bg-[#F5F8FF] hover:text-[#0B1220]"
                                }`}
                              >
                                {it.title}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
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
