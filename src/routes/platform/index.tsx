import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { platformPages } from "@/data/platform-pages";
import { seo } from "@/lib/seo";

const groups: { heading: string; slugs: string[] }[] = [
  { heading: "Posture & Identity", slugs: ["cnapp", "cspm", "ciem", "iam", "inventory"] },
  { heading: "Threat & Attack", slugs: ["attack-path", "cdr", "threat-detection", "risk"] },
  { heading: "Data & Network", slugs: ["data-security", "database-security", "encryption", "network-security", "api-security"] },
  { heading: "Workloads & Code", slugs: ["cwpp", "agentless", "container-security", "vulnerability", "secops"] },
  { heading: "SaaS, AI & Governance", slugs: ["saas-security", "ai-security", "ai-assistant", "remediation", "compliance", "technology"] },
];

export const Route = createFileRoute("/platform/")({
  head: () =>
    seo({
      title: "Platform — Onam Security",
      description:
        "One platform, every cloud security layer. CNAPP, CSPM, CIEM, DSPM, CWPP, SSPM, agentless scanning, attack path, threat detection and compliance — 29 engines across every cloud and SaaS platform you run.",
      path: "/platform",
    }),
  component: PlatformIndex,
});

function PlatformIndex() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-[#E5E9F0] bg-white">
        <div className="absolute inset-0 dot-grid opacity-60" />
        <div className="absolute -top-40 right-0 w-[700px] h-[500px] rounded-full bg-[#2563EB]/10 blur-[140px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
            Platform
          </div>
          <h1 className="mt-6 font-display font-black text-[#0B1220] text-5xl md:text-6xl tracking-tight leading-[1.05]">
            One platform. Every <span className="gradient-text">cloud security engine.</span>
          </h1>
          <p className="mt-6 text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
            CNAPP, CSPM, CIEM, DSPM, CWPP and SSPM are not six products here — they are engines running in
            parallel on the same security graph. Findings talk to each other, attackers stop getting a free
            ride between silos, and every risk lands in one prioritised queue.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <BrandButton to="/request-demo" size="lg">Scan my cloud <ArrowRight className="w-4 h-4" /></BrandButton>
            <BrandButton to="/docs" size="lg" variant="secondary">Read the docs</BrandButton>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-14">
          {groups.map((g) => (
            <div key={g.heading}>
              <div className="flex items-end justify-between mb-6">
                <h2 className="font-display font-extrabold text-[#0B1220] text-2xl md:text-3xl tracking-tight">
                  {g.heading}
                </h2>
                <div className="text-[11px] uppercase tracking-widest text-[#64748B] font-semibold">
                  {g.slugs.length} engines
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {g.slugs.map((slug) => {
                  const p = platformPages[slug];
                  const Icon = p.icon;
                  return (
                    <Link key={slug} to={`/platform/${slug}`} className="group">
                      <div className="h-full bg-white border border-[#E5E9F0] rounded-2xl p-6 shadow-[0_1px_2px_rgba(16,24,40,.04),0_1px_3px_rgba(16,24,40,.06)] hover:shadow-[0_12px_28px_rgba(16,24,40,.10)] hover:-translate-y-0.5 transition-all">
                        <div
                          className="w-11 h-11 rounded-xl grid place-items-center"
                          style={{
                            backgroundColor: `color-mix(in srgb, ${p.iconColor} 12%, #FFFFFF)`,
                            boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${p.iconColor} 22%, transparent)`,
                          }}
                        >
                          <Icon className="w-5 h-5" style={{ color: p.iconColor }} />
                        </div>
                        <div className="mt-4 font-display font-bold text-[#0B1220] text-lg">{p.label}</div>
                        <p className="mt-2 text-sm text-[#475569] leading-relaxed">{p.question}</p>
                        <div className="mt-5 pt-4 border-t border-[#E5E9F0] flex items-center justify-between">
                          <span className="text-xs font-medium text-[#2563EB]">Explore</span>
                          <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-[#F7F9FC]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="gradient-border rounded-3xl p-10 md:p-14 text-center">
            <h2 className="font-display font-black text-[#0B1220] text-3xl md:text-4xl tracking-tight">
              See every engine on <span className="gradient-text">your own cloud.</span>
            </h2>
            <p className="mt-4 text-[#475569] max-w-lg mx-auto">
              Connect a read-only role. First findings surface in under five minutes.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <BrandButton to="/request-demo" size="lg">Book a live demo →</BrandButton>
              <BrandButton to="/pricing" size="lg" variant="secondary">See pricing</BrandButton>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
