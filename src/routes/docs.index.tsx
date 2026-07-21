import { createFileRoute, Link } from "@tanstack/react-router";
import { BrandButton } from "@/components/site/BrandButton";
import { DOC_SECTIONS } from "@/data/docs";
import { Zap, ArrowRight } from "lucide-react";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/docs/")({
  head: () =>
    seo({
      title: "Documentation — Onam Security",
      description:
        "The Onam documentation home — quickstart, onboarding, features, architecture, and reference.",
      path: "/docs",
    }),
  component: DocsHome,
});

function DocsHome() {
  return (
    <div className="pb-16">
      <div className="text-[11px] uppercase tracking-widest font-semibold text-[#1D4ED8] mb-3">Documentation</div>
      <h1 className="font-display font-black text-[#0B1220] text-4xl md:text-5xl tracking-tight leading-[1.05]">
        Welcome to Onam docs
      </h1>
      <p className="mt-4 text-lg text-[#475569] max-w-2xl">
        Everything you need to connect a cloud, tune findings, and integrate Onam into the tools your team already uses.
      </p>

      <div className="mt-10 bg-gradient-to-br from-[#EFF4FF] to-white border border-[#DBE7FE] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-11 h-11 rounded-xl bg-[#2563EB] flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-widest font-semibold text-[#1D4ED8] mb-1">Quickstart</div>
            <h2 className="font-display font-extrabold text-xl text-[#0B1220]">Connect your first cloud in under 5 minutes</h2>
            <p className="mt-1.5 text-sm text-[#475569]">
              Deploy a read-only CloudFormation stack, paste the Role ARN into Onam, and watch the first scan roll in.
            </p>
          </div>
        </div>
        <BrandButton to="/docs/$" >Start with AWS →</BrandButton>
      </div>

      <div className="mt-12">
        <h2 className="font-display font-extrabold text-2xl text-[#0B1220]">Browse the docs</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-5">
          {DOC_SECTIONS.map((sec) => (
            <div key={sec.heading} className="bg-white border border-[#E5E9F0] rounded-2xl p-6 hover:shadow-[0_8px_24px_rgba(16,24,40,.06)] transition">
              <h3 className="font-display font-bold text-lg text-[#0B1220]">{sec.heading}</h3>
              <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                {sec.items.map((it) => (
                  <li key={it.slug}>
                    <Link
                      to="/docs/$"
                      params={{ _splat: it.slug }}
                      className="group flex items-center justify-between py-1.5 text-sm text-[#334155] hover:text-[#2563EB]"
                    >
                      <span>{it.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
