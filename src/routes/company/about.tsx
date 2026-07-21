import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Layers, MessageSquareHeart, Zap, User } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/company/about")({
  head: () =>
    seo({
      title: "About — Onam Security",
      description:
        "We built Onam because cloud security tooling was fragmented, noisy, and hard to act on.",
      path: "/company/about",
    }),
  component: AboutPage,
});

const values = [
  { icon: ShieldCheck, iconColor: "#2563EB", title: "Security engineers first", body: "Built by people who've run incident response, threat hunts, and cloud architecture reviews — not by a marketing team that later hired security." },
  { icon: Layers, iconColor: "#F2AF04", title: "Depth over surface area", body: "10,000+ rules go deep into each service. We would rather cover 40 services perfectly than 400 superficially." },
  { icon: MessageSquareHeart, iconColor: "#05A052", title: "Honest with customers", body: "If Onam isn't right for your environment, we'll tell you on the first call. Trust compounds; a bad-fit customer never does." },
  { icon: Zap, iconColor: "#E32D25", title: "Speed without shortcuts", body: "Fast scans and accuracy are not a trade-off. We invested years in the graph and the rule engine so you don't have to choose." },
];

const stats = [
  { value: "10,000+", label: "Security rules" },
  { value: "200+", label: "Cloud services covered" },
  { value: "13", label: "Compliance frameworks" },
  { value: "16+", label: "Security engines" },
];

const team = [
  {
    name: "Anup Yadav",
    role: "CEO & Co-founder",
    bio: "15+ years in cloud security and infrastructure. Former security architect at a scale-up fintech and enterprise SaaS. Led incident response across AWS and Azure multi-cloud.",
    initials: "AY",
    color: "#2563EB",
  },
  {
    name: "Co-founder — Head of Engineering",
    role: "CTO & Co-founder",
    bio: "Previously engineering director at a cloud-native infrastructure company. Built distributed scanning systems processing billions of API calls per month. Deep in graph databases and security-graph traversal.",
    initials: "CT",
    color: "#05A052",
  },
];

function AboutPage() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-[#E5E9F0] bg-white">
        <div className="absolute inset-0 dot-grid opacity-60" />
        <div className="absolute -top-40 right-1/4 w-[700px] h-[500px] rounded-full bg-[#2563EB]/10 blur-[140px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#64748B]">About Onam</div>
          <h1 className="mt-5 font-display font-black text-[#0B1220] text-4xl md:text-5xl lg:text-[56px] tracking-tight leading-[1.05]">
            We built Onam because cloud security tooling was fragmented, noisy, and hard to act on.
          </h1>
          <p className="mt-6 text-lg text-[#475569] max-w-3xl mx-auto leading-relaxed">
            Security teams were paying for six products, wiring five dashboards, and still missing the finding that mattered. Onam is one platform, one graph, one prioritized list — with the depth to survive a real audit and the honesty to tell you when we can't help.
          </p>
        </div>
      </section>

      <section className="bg-[#F7F9FC] border-b border-[#E5E9F0] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">Values</div>
            <h2 className="mt-4 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">What we optimise for</h2>
          </div>
          <div className="mt-12 grid md:grid-cols-2 gap-5">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="bg-white border border-[#E5E9F0] rounded-2xl p-6 shadow-[0_1px_2px_rgba(16,24,40,.04),0_1px_3px_rgba(16,24,40,.06)]">
                  <div
                    className="w-12 h-12 rounded-xl grid place-items-center"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${v.iconColor} 12%, #FFFFFF)`,
                      boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${v.iconColor} 22%, transparent)`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: v.iconColor }} />
                  </div>
                  <h3 className="mt-5 font-display font-bold text-[#0B1220] text-lg">{v.title}</h3>
                  <p className="mt-2 text-sm text-[#475569] leading-relaxed">{v.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-[#E5E9F0] py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-[#E5E9F0]">
          {stats.map((s) => (
            <div key={s.label} className="px-6 first:pl-0 last:pr-0 text-center md:text-left">
              <div className="text-3xl md:text-4xl font-display font-black text-[#0B1220]">{s.value}</div>
              <div className="mt-1 text-[11px] uppercase tracking-widest text-[#64748B] font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#F8FAFC] border-b border-[#E5E9F0] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">Team</div>
            <h2 className="mt-4 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">The people behind Onam</h2>
          </div>
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {team.map((p) => (
              <div key={p.name} className="bg-white border border-[#E5E9F0] rounded-2xl p-6 shadow-[0_1px_2px_rgba(16,24,40,.04),0_1px_3px_rgba(16,24,40,.06)] flex gap-5 items-start">
                <div
                  className="w-16 h-16 rounded-2xl grid place-items-center font-display font-black text-white text-lg shrink-0"
                  style={{ backgroundColor: p.color }}
                >
                  {p.initials}
                </div>
                <div>
                  <div className="font-display font-bold text-[#0B1220] text-lg">{p.name}</div>
                  <div className="text-sm font-semibold text-[#2563EB]">{p.role}</div>
                  <p className="mt-3 text-sm text-[#475569] leading-relaxed">{p.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-3xl border border-[#DBE7FE] bg-gradient-to-br from-[#EFF4FF] to-white p-10 md:p-14 text-center">
            <div className="inline-flex w-12 h-12 rounded-xl bg-[#2563EB] text-white items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <h2 className="mt-5 font-display font-black text-[#0B1220] text-3xl md:text-4xl tracking-tight">
              Come see the platform we built.
            </h2>
            <p className="mt-4 text-[#475569] max-w-xl mx-auto">45 minutes with a security engineer, using your own cloud.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <BrandButton to="/request-demo" size="lg">Book a demo →</BrandButton>
              <Link to="/company/careers" className="inline-flex items-center rounded-[10px] px-5 py-3 text-sm font-semibold bg-white text-[#0B1220] border border-[#CBD5E1] hover:bg-[#F1F5F9] transition">
                Join the team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
