import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Layers, MessageSquareHeart, Zap, User, Compass } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { seo, SITE_URL } from "@/lib/seo";
import { AUTHORS, personJsonLd } from "@/data/authors";
import { FRAMEWORKS, RULE_CATALOG_TOTAL, SERVICES, fmt } from "@/lib/product-facts";
import { SUITE } from "@/data/product-suite";
import { Backdrop, Section, Container, SectionHeading, IconTile, Card, StatusChip } from "@/components/site/system";

export const Route = createFileRoute("/company/about")({
  head: () =>
    seo({
      title: "About — Onam",
      description:
        "Onam is one cloud platform of four products — Estate, Security, FinOps and DRM — with AI agents across them. It started with security; here is why it grew.",
      path: "/company/about",
    }),
  component: AboutPage,
});

const values = [
  { icon: ShieldCheck, iconColor: "#2563EB", title: "Practitioners first", body: "Built by people who've run incident response, threat hunts, and cloud architecture reviews — not by a marketing team that later hired engineers." },
  { icon: Layers, iconColor: "#F2AF04", title: "Depth over surface area", body: `In Onam Security, ${fmt(RULE_CATALOG_TOTAL)} rules go deep into each service. Across every product, we would rather cover something completely than list it.` },
  { icon: MessageSquareHeart, iconColor: "#05A052", title: "Honest with customers", body: "If Onam isn't right for your environment, we'll tell you on the first call. Every product page says what it does not do, and anything not yet offered is labelled as such." },
  { icon: Zap, iconColor: "#E32D25", title: "Speed without shortcuts", body: "Fast scans and accuracy are not a trade-off. We invested years in the graph and the rule engine so you don't have to choose." },
];

const stats = [
  // From the cleared fact set. Until 2026-09-15 the framework count here was a retired figure
  // and the other two were stale understatements. Constants, so it cannot recur.
  { value: "4", label: "Products on one discovery" },
  { value: fmt(RULE_CATALOG_TOTAL), label: "Security rules" },
  { value: fmt(SERVICES), label: "Cloud services covered" },
  { value: fmt(FRAMEWORKS), label: "Compliance frameworks" },
  { value: "7", label: "Clouds supported" },
];

function AboutPage() {
  return (
    <SiteLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            url: `${SITE_URL}/company/about`,
            mainEntity: { "@id": `${SITE_URL}/#organization` },
            // The leadership team as Person nodes — the same @ids the article schema uses.
            about: AUTHORS.map(personJsonLd),
          }),
        }}
      />
      <section className="relative overflow-hidden border-b border-[#E5E9F0] bg-white">
        <Backdrop tone="light" color="#2563EB" pattern="graph" icon={Compass} />
        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-20 text-center">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#64748B]">About Onam</div>
          <h1 className="mt-5 font-display font-black text-[#0B1220] text-4xl md:text-5xl lg:text-[56px] tracking-tight leading-[1.05]">
            One discovery of your cloud, answering the questions every team asks of it.
          </h1>
          <p className="mt-6 text-lg text-[#475569] max-w-3xl mx-auto leading-relaxed">
            Security, finance and the people responsible for recovery all ask questions of the same cloud — and each
            used to buy a separate tool that discovered it again, and disagreed with the others. Onam discovers your
            cloud once and answers all of them: what you run, whether it is secure, what it costs, and whether it
            would come back after a failure.
          </p>
        </div>
      </section>

      <Section tone="white">
        <Container>
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 items-start">
            <SectionHeading
              eyebrow="How Onam grew"
              title="It started with security."
              lead="We built Onam Security because cloud security tooling was fragmented, noisy and hard to act on: teams paid for several products, wired several dashboards, and still missed the finding that mattered."
            />
            <div className="space-y-4 text-body leading-relaxed">
              <p>
                Doing that well meant building a complete, continuously refreshed picture of every resource and how it
                connects. Once that picture existed, it was clear the security team was not the only one asking for it.
                Finance wanted to know what the same resources cost and who owned them. The people responsible for
                recovery wanted to know which applications depended on them, and whether they would come back.
              </p>
              <p>
                So Onam became a platform of four products on one discovery — Onam Estate, Onam Security, Onam FinOps
                and Onam DRM — with Onam AIOps, in early access, adding AI agents that investigate across them and
                leave every change to a person. Each product is sold on its own; together they share one login, one
                console and one inventory, so your cloud accounts are connected once.
              </p>
            </div>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {SUITE.map((p) => (
              <Link key={p.key} to={p.href} className="group">
                <Card interactive className="h-full p-5">
                  <IconTile icon={p.icon} color={p.color} />
                  <div className="mt-4 text-xs font-semibold uppercase tracking-widest text-muted-500">{p.stage}</div>
                  <div className="mt-1 font-display font-bold text-ink group-hover:text-brand-500">{p.name}</div>
                  {p.key === "aiops" && <StatusChip status="early" className="mt-2" />}
                  <p className="mt-2 text-sm text-body leading-relaxed">{p.question}</p>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <section className="bg-[#F7F9FC] border-b border-[#E5E9F0] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">Values</div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-5 gap-y-8 md:divide-x divide-[#E5E9F0]">
          {stats.map((s) => (
            <div key={s.label} className="px-6 first:pl-0 last:pr-0 text-center md:text-left">
              <div className="text-3xl md:text-4xl font-display font-black text-[#0B1220]">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-[#64748B] font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#F8FAFC] border-b border-[#E5E9F0] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">Team</div>
            <h2 className="mt-4 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">The people behind Onam</h2>
          </div>
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {AUTHORS.map((p) => (
              <Link
                key={p.slug}
                to="/company/team/$slug"
                params={{ slug: p.slug }}
                className="group bg-white border border-[#E5E9F0] rounded-2xl p-6 shadow-[0_1px_2px_rgba(16,24,40,.04),0_1px_3px_rgba(16,24,40,.06)] flex gap-5 items-start hover:shadow-[0_8px_24px_rgba(16,24,40,.08)] transition"
              >
                <div
                  className="w-16 h-16 rounded-2xl grid place-items-center font-display font-black text-white text-lg shrink-0"
                  style={{ backgroundColor: p.color }}
                >
                  {p.initials}
                </div>
                <div>
                  <div className="font-display font-bold text-[#0B1220] text-lg group-hover:text-[#2563EB]">{p.name}</div>
                  <div className="text-sm font-semibold text-[#2563EB]">{p.role}</div>
                  {p.bio && <p className="mt-3 text-sm text-[#475569] leading-relaxed">{p.bio}</p>}
                  <div className="mt-3 text-xs text-[#64748B]">{p.topics.join(" · ")}</div>
                </div>
              </Link>
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
            <p className="mt-4 text-[#475569] max-w-xl mx-auto">45 minutes with someone who knows the product you pick, using your own cloud if you want.</p>
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
