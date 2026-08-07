import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, GitBranch, TrendingUp, Star, ArrowRight, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { SCENARIOS, type Scenario } from "@/data/scenarios";
import { seo, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/resources/scenarios")({
  head: () =>
    seo({
      title: "Industry Scenarios — The Attack Path, Priced, By Sector — Onam Security",
      description:
        "Five illustrative sector scenarios — financial services, e-commerce, gaming, SAP MSP and beauty/CPG. Each shows the route to a crown jewel, the single choke point that cuts it, and why exposure in dollars changes the conversation.",
      path: "/resources/scenarios",
    }),
  component: ScenariosPage,
});

/** Left-to-right path with the choke point highlighted. Scrolls on narrow screens. */
function AttackPath({ s }: { s: Scenario }) {
  return (
    <div className="rounded-2xl border border-[#E5E9F0] bg-[#F7F9FC] p-5">
      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#64748B]">
        The attack path Onam surfaces
      </div>
      <div className="mt-4 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max pb-1">
          {s.path.map((n, i) => (
            <div key={n.label} className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <div
                  className="px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap border-2"
                  style={
                    n.chokePoint
                      ? { background: "#FEF6E7", borderColor: "#B45309", color: "#7C2D12" }
                      : { background: "#FFFFFF", borderColor: "#CBD5E1", color: "#0B1220" }
                  }
                >
                  {n.label}
                </div>
                {n.chokePoint && (
                  <span className="mt-1.5 px-2 py-0.5 rounded-full bg-[#B45309] text-white text-[9px] font-bold uppercase tracking-wider">
                    Choke point
                  </span>
                )}
              </div>
              {i < s.path.length - 1 && <ArrowRight className="w-4 h-4 text-[#2563EB] shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Quadrant({
  icon: Icon,
  label,
  color,
  body,
  highlight,
}: {
  icon: typeof AlertTriangle;
  label: string;
  color: string;
  body: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        highlight
          ? "rounded-2xl border border-[#DBE7FE] bg-[#F5F8FF] p-5"
          : "rounded-2xl border border-[#E5E9F0] bg-white p-5"
      }
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" style={{ color }} />
        <span className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color }}>
          {label}
        </span>
      </div>
      <p className={`mt-2.5 text-sm leading-relaxed ${highlight ? "text-[#0B1220] font-medium" : "text-[#475569]"}`}>
        {body}
      </p>
    </div>
  );
}

function ScenariosPage() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-[#E5E9F0] bg-white">
        <div className="absolute inset-0 dot-grid opacity-60" />
        <div className="absolute -top-40 right-0 w-[700px] h-[500px] rounded-full bg-[#2563EB]/10 blur-[140px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-14">
          <nav className="flex items-center gap-1.5 text-xs text-[#64748B] mb-6">
            <Link to="/resources" className="hover:text-[#2563EB]">Resources</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#0B1220]">Industry scenarios</span>
          </nav>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#FEF6E7] text-[#B45309] border border-[#FCD9A4]">
            Illustrative scenarios
          </div>
          <h1 className="mt-6 font-display font-black text-[#0B1220] text-4xl md:text-5xl tracking-tight leading-[1.06]">
            The attack path, priced — by sector.
          </h1>
          <p className="mt-5 text-lg text-[#475569] leading-relaxed">
            Five industry archetypes showing the same story in each: the route to a crown jewel, the
            single choke point that cuts it, and the board-ready dollar figure.
          </p>
          <p className="mt-5 text-sm text-[#64748B] leading-relaxed border-l-2 border-[#E5E9F0] pl-4">
            These are <strong className="text-[#0B1220] font-semibold">illustrative archetypes, not customers</strong>.
            The paths and figures show how the platform reasons about sector-specific risk — they are
            not reported outcomes from named engagements.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 space-y-12">
          {SCENARIOS.map((s) => (
            <article
              key={s.slug}
              id={s.slug}
              className="rounded-3xl border border-[#E5E9F0] bg-white p-6 md:p-8 shadow-[0_1px_3px_rgba(16,24,40,.04)] scroll-mt-24"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display font-black text-[#0B1220] text-2xl md:text-3xl tracking-tight">
                    {s.title}
                  </h2>
                  <p className="mt-1.5 text-sm text-[#64748B]">{s.context}</p>
                </div>
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0"
                  style={{ color: s.accent, borderColor: `${s.accent}44`, background: `${s.accent}0F` }}
                >
                  Illustrative
                </span>
              </div>

              <div className="mt-6">
                <AttackPath s={s} />
              </div>

              <div className="mt-5 grid md:grid-cols-2 gap-4">
                <Quadrant icon={AlertTriangle} label="The challenge" color="#BE123C" body={s.challenge} />
                <Quadrant icon={GitBranch} label="What Onam brings" color="#2563EB" body={s.brings} />
                <Quadrant icon={TrendingUp} label="The advantage" color="#15803D" body={s.advantage} />
                <Quadrant icon={Star} label="The differentiator" color="#B45309" body={s.differentiator} highlight />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="py-20 bg-[#F7F9FC] border-t border-[#E5E9F0]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="gradient-border rounded-3xl p-10 md:p-14 text-center">
            <h2 className="font-display font-black text-[#0B1220] text-3xl md:text-4xl tracking-tight">
              Your sector. Your path. <span className="gradient-text">Your number.</span>
            </h2>
            <p className="mt-4 text-[#475569] max-w-xl mx-auto leading-relaxed">
              These are archetypes. The real version takes minutes — connect one account read-only and
              Onam surfaces your actual attack paths, choke points and priced exposure.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <BrandButton to="/request-demo" size="lg">See your own case →</BrandButton>
              <a
                href="/case-studies/Onam-Case-Studies.pdf"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center rounded-[10px] px-5 py-3 text-sm font-semibold bg-white text-[#0B1220] border border-[#CBD5E1] hover:bg-[#F1F5F9] transition"
              >
                Download the collection (PDF)
              </a>
            </div>
          </div>
          <div className="mt-10 grid sm:grid-cols-3 gap-4">
            {[
              { label: "What is a cloud attack path?", href: "/learn/cloud-attack-path" },
              { label: "What is a choke point?", href: "/learn/choke-point" },
              { label: "Risk quantification (FAIR)", href: "/learn/cloud-risk-quantification" },
            ].map((l) => (
              <Link key={l.href} to={l.href} className="group">
                <div className="h-full bg-white border border-[#E5E9F0] rounded-2xl p-5 hover:shadow-[0_8px_24px_rgba(16,24,40,.08)] transition">
                  <div className="font-display font-bold text-[15px] text-[#0B1220] group-hover:text-[#2563EB]">
                    {l.label}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
