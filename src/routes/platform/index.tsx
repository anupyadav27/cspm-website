import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { platformPages } from "@/data/platform-pages";
import { PRODUCTS } from "@/data/products";
import { seo } from "@/lib/seo";
import { OpsBand } from "@/components/site/ops/OpsBand";

// `as const` keeps the slugs as string literals so `/platform/${slug}` resolves to a
// union of real route paths — a widened string[] here makes <Link to> untypeable.
const groups = [
  { heading: "Posture & Identity", slugs: ["cnapp", "cspm", "ciem", "iam", "inventory"] },
  { heading: "Threat & Attack", slugs: ["attack-path", "cdr", "threat-detection", "risk"] },
  { heading: "Data & Network", slugs: ["data-security", "database-security", "encryption", "network-security", "api-security"] },
  { heading: "Workloads & Code", slugs: ["cwpp", "agentless", "container-security", "vulnerability", "code-security", "ai-code-fix"] },
  { heading: "SaaS, AI & Governance", slugs: ["saas-security", "ai-security", "ai-assistant", "remediation", "compliance", "technology"] },
] as const;

export const Route = createFileRoute("/platform/")({
  head: () =>
    seo({
      title: "Onam Security — every cloud security engine on one graph",
      description:
        "Cloud security platform covering CNAPP, CSPM, CIEM, DSPM, CWPP, SSPM, attack paths, threat detection and compliance: 29 engines on one security graph.",
      path: "/platform",
      image: "/og/platform.png",
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
            Onam Security
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

      <OpsBand />

      <section className="py-20 bg-[#F7F9FC] border-t border-[#E5E9F0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-[11px] uppercase tracking-widest text-[#64748B] font-semibold">The rest of the platform</div>
            <h2 className="mt-3 font-display font-extrabold text-[#0B1220] text-3xl tracking-tight">
              Onam Security is one stage of one platform.
            </h2>
            <p className="mt-3 text-[#475569]">
              Estate finds what you run, Security protects it, FinOps explains what it costs and DRM
              plans how it comes back — in the same console, behind the same login, on the same discovery.
            </p>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRODUCTS.map((p) => {
              const Icon = p.icon;
              const isCurrent = p.key === "security";
              return (
                <Link key={p.key} to={p.href} className="group">
                  <div
                    className={`h-full bg-white border rounded-2xl p-6 transition-all ${
                      isCurrent
                        ? "border-[#C7D7FE] shadow-[0_0_0_3px_rgba(37,99,235,.06)]"
                        : "border-[#E5E9F0] hover:shadow-[0_12px_28px_rgba(16,24,40,.10)] hover:-translate-y-0.5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl grid place-items-center"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${p.color} 12%, #FFFFFF)`,
                          boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${p.color} 22%, transparent)`,
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: p.color }} />
                      </div>
                      <div className="font-display font-bold text-[#0B1220]">{p.name}</div>
                      {isCurrent && (
                        <span className="ml-auto text-[10px] uppercase tracking-widest font-bold text-[#1D4ED8]">
                          You are here
                        </span>
                      )}
                    </div>
                    <p className="mt-4 text-sm text-[#475569] leading-relaxed">{p.blurb}</p>
                    <div className="mt-4 pt-4 border-t border-[#E5E9F0] text-xs text-[#64748B]">{p.packaging}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="gradient-border rounded-3xl p-10 md:p-14 text-center">
            <h2 className="font-display font-black text-[#0B1220] text-3xl md:text-4xl tracking-tight">
              See every engine on <span className="gradient-text">your own cloud.</span>
            </h2>
            <p className="mt-4 text-[#475569] max-w-lg mx-auto">
              Connect a read-only role for posture scanning. Your first findings arrive with the first scan.
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
