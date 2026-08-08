import { createFileRoute } from "@tanstack/react-router";
import { MapPin, ArrowRight, Compass, HeartHandshake, Rocket } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/company/careers")({
  head: () =>
    seo({
      title: "Careers — Onam Security",
      description:
        "We're a small, senior team building the cloud security platform we always wanted.",
      path: "/company/careers",
    }),
  component: CareersPage,
});

const roles = [
  { title: "Senior Security Researcher", team: "Research", location: "Remote", blurb: "Own new rule content across AWS, Azure, GCP, OCI, and Kubernetes. Publish research the community respects." },
  { title: "Cloud Detection Engineer", team: "Detection", location: "Remote", blurb: "Build MITRE-mapped detections against cloud-control-plane and identity telemetry at scale." },
  { title: "Full-Stack Engineer — Platform", team: "Engineering", location: "Remote", blurb: "React 19, TypeScript, Postgres, and a graph engine that models the entire cloud." },
  { title: "Developer Advocate", team: "DevRel", location: "Remote", blurb: "Write the docs, code the demos, ship the workshops. Be a bridge between practitioners and product." },
];

const howWeWork = [
  { icon: Compass, iconColor: "#2563EB", title: "Remote-first, async by default", body: "We optimise for deep work. Time-zone overlap, not calendar collisions." },
  { icon: HeartHandshake, iconColor: "#05A052", title: "Senior, small, and kind", body: "No junior gauntlet. No bro-ology. Everyone here has been the person on-call at 2am." },
  { icon: Rocket, iconColor: "#F2AF04", title: "Ship weekly, review honestly", body: "Small changes, fast feedback, clear ownership. No 'design review by committee'." },
];

function CareersPage() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-[#E5E9F0] bg-white">
        <div className="absolute inset-0 dot-grid opacity-60" />
        <div className="absolute -top-40 right-1/4 w-[700px] h-[500px] rounded-full bg-[#2563EB]/10 blur-[140px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#64748B]">Careers</div>
          <h1 className="mt-5 font-display font-black text-[#0B1220] text-4xl md:text-5xl lg:text-[56px] tracking-tight leading-[1.05]">
            Build the cloud security platform we always wanted.
          </h1>
          <p className="mt-6 text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
            We're a small, senior team of security engineers, detection researchers, and platform builders. If you've spent a career being frustrated by cloud security tooling — come fix it with us.
          </p>
        </div>
      </section>

      <section className="bg-[#F7F9FC] border-b border-[#E5E9F0] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">Open roles</div>
              <h2 className="mt-4 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">Where we're hiring</h2>
            </div>
            <p className="text-sm text-[#64748B]">Don't see your role? Email <a href="mailto:careers@onam.security" className="text-[#2563EB] font-semibold hover:underline">careers@onam.security</a>.</p>
          </div>
          <div className="mt-10 space-y-3">
            {roles.map((r) => (
              <div key={r.title} className="bg-white border border-[#E5E9F0] rounded-2xl p-6 shadow-[0_1px_2px_rgba(16,24,40,.04)] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-display font-bold text-[#0B1220] text-lg">{r.title}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F1F5F9] text-[#475569] border border-[#E5E9F0]">{r.team}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#475569] leading-relaxed max-w-2xl">{r.blurb}</p>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B]">
                    <MapPin className="w-3.5 h-3.5" /> {r.location}
                  </div>
                </div>
                <a
                  href={`mailto:careers@onam.security?subject=Application%3A%20${encodeURIComponent(r.title)}`}
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-[10px] px-4 py-2.5 text-sm font-semibold bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-[0_1px_2px_rgba(16,24,40,.06),0_4px_10px_rgba(37,99,235,.20)] transition"
                >
                  Apply <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F7F9FC] py-16 border-y border-[#E3E8F0]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">Before you apply</div>
            <h2 className="mt-4 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">Read the engineering briefing first</h2>
            <p className="mt-4 text-[#5C6B84] text-lg leading-relaxed">
              The same deck we use internally — what the system actually is, what you would
              work on, and the problem we have not solved yet. It names an unsolved data-quality
              problem and the fact that we ship no runtime agent, because you would find both in
              week one anyway.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="/careers/Onam-Engineering-Briefing.pdf"
                 className="inline-flex items-center gap-2 rounded-[10px] px-5 py-3 text-sm font-semibold bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition">
                Engineering briefing (PDF)
              </a>
              <a href="/careers/Onam-Engineering-Briefing.html"
                 className="inline-flex items-center gap-2 rounded-[10px] px-5 py-3 text-sm font-semibold bg-white text-[#0B2545] border border-[#D6DEEA] hover:border-[#2563EB] transition">
                Read in the browser
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">How we work</div>
            <h2 className="mt-4 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">The team, in three lines</h2>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {howWeWork.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="bg-white border border-[#E5E9F0] rounded-2xl p-6 shadow-[0_1px_2px_rgba(16,24,40,.04),0_1px_3px_rgba(16,24,40,.06)]">
                  <div
                    className="w-11 h-11 rounded-xl grid place-items-center"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${v.iconColor} 12%, #FFFFFF)`,
                      boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${v.iconColor} 22%, transparent)`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: v.iconColor }} />
                  </div>
                  <h3 className="mt-5 font-display font-bold text-[#0B1220]">{v.title}</h3>
                  <p className="mt-2 text-sm text-[#475569] leading-relaxed">{v.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
