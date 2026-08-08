import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { BLOG_POSTS } from "@/data/blog-posts";
import { ArrowRight, Cloud, ShieldCheck, Layers, BadgeCheck } from "lucide-react";
import { seo } from "@/lib/seo";
import { ResourceSignup } from "@/components/site/ResourceSignup";

export const Route = createFileRoute("/resources/")({
  head: () =>
    seo({
      title: "Resources — Onam Security",
      description:
        "Guides, documentation, and technical references for cloud security practitioners.",
      path: "/resources",
      image: "/og/resources.png",
    }),
  component: Page,
});

type CardLink = { label: string; to: string };
type Category = {
  title: string;
  desc: string;
  color: string;
  bg: string;
  Icon: typeof Cloud;
  links: CardLink[];
};

const categories: Category[] = [
  {
    title: "Connect Your Cloud",
    desc: "Step-by-step onboarding guides for every supported cloud provider.",
    color: "#2563EB",
    bg: "#EFF4FF",
    Icon: Cloud,
    links: [
      { label: "AWS", to: "/docs/onboarding/aws" },
      { label: "Microsoft Azure", to: "/docs/onboarding/azure" },
      { label: "Google Cloud", to: "/docs/onboarding/gcp" },
      { label: "Oracle Cloud (OCI)", to: "/docs/onboarding/oci" },
      { label: "Alibaba Cloud", to: "/docs/onboarding/alicloud" },
      { label: "Kubernetes", to: "/docs/onboarding/kubernetes" },
    ],
  },
  {
    title: "Security Capabilities",
    desc: "Deep-dives on each security engine — what it checks, how it works, and how to read results.",
    color: "#0891B2",
    bg: "#ECFEFF",
    Icon: ShieldCheck,
    links: [
      { label: "CSPM", to: "/docs/features/cspm" },
      { label: "CIEM — Identity & Entitlements", to: "/docs/features/ciem" },
      { label: "Vulnerability Management", to: "/docs/features/vulnerability-management" },
      { label: "Container Security", to: "/docs/features/container-security" },
      { label: "Attack Path", to: "/docs/features/attack-path" },
    ],
  },
  {
    title: "Architecture",
    desc: "How Onam scans, stores, and secures your data.",
    color: "#05A052",
    bg: "#E7F6EF",
    Icon: Layers,
    links: [
      { label: "Platform Overview", to: "/docs/architecture/overview" },
      { label: "Scanning Engine", to: "/docs/architecture/scanning" },
      { label: "Data Security", to: "/docs/architecture/data-security" },
    ],
  },
  {
    title: "Compliance & Trust",
    desc: "Framework coverage and our security posture.",
    color: "#B45309",
    bg: "#FEF6E4",
    Icon: BadgeCheck,
    links: [
      { label: "Framework Coverage", to: "/docs/compliance/frameworks" },
      { label: "Trust & Security", to: "/docs/trust/security" },
    ],
  },
];

const LIBRARY: { title: string; items: { label: string; href: string }[] }[] = [
  {
    title: "Technical whitepapers",
    items: [
      { label: "The full library (all five)", href: "/whitepapers/Onam-Whitepaper-Library.pdf" },
      { label: "How Onam finds the attack path", href: "/whitepapers/wp1-attack-path-methodology.pdf" },
      { label: "Cloud risk in dollars (FAIR)", href: "/whitepapers/wp2-risk-quantification.pdf" },
      { label: "One graph, one data model", href: "/whitepapers/wp3-architecture.pdf" },
      { label: "Security & trust", href: "/whitepapers/wp4-security-trust.pdf" },
      { label: "Compliance, mapped once", href: "/whitepapers/wp5-compliance.pdf" },
    ],
  },
  {
    title: "Brochures & case studies",
    items: [
      { label: "Capabilities brochure (PDF)", href: "/brochures/Onam-Capabilities-Brochure.pdf" },
      { label: "Capabilities flipbook (interactive)", href: "/tools/Onam-Capabilities-Flipbook.html" },
      { label: "Industry scenarios (5 sectors)", href: "/resources/scenarios" },
      { label: "Case study collection (PDF)", href: "/case-studies/Onam-Case-Studies.pdf" },
    ],
  },
  {
    title: "Capability one-pagers",
    items: [
      { label: "Platform overview", href: "/brochures/capabilities/br-platform-overview.png" },
      { label: "Attack paths", href: "/brochures/capabilities/br-attack-paths.png" },
      { label: "Identity & entitlements (CIEM)", href: "/brochures/capabilities/br-ciem.png" },
      { label: "Data security posture (DSPM)", href: "/brochures/capabilities/br-dspm.png" },
      { label: "SaaS security posture (SSPM)", href: "/brochures/capabilities/br-sspm.png" },
      { label: "Cloud detection & response (CDR)", href: "/brochures/capabilities/br-cdr.png" },
      { label: "Workload protection (CWPP)", href: "/brochures/capabilities/br-cwpp.png" },
      { label: "Container & Kubernetes", href: "/brochures/capabilities/br-container.png" },
      { label: "Vulnerability management", href: "/brochures/capabilities/br-vulnerability.png" },
      { label: "Code security", href: "/brochures/capabilities/br-code.png" },
    ],
  },
  {
    title: "By industry",
    items: [
      { label: "Healthcare", href: "/brochures/capabilities/br-industry-healthcare.png" },
      { label: "Government & public sector", href: "/brochures/capabilities/br-industry-government.png" },
      { label: "All five sectors (scenarios)", href: "/resources/scenarios" },
    ],
  },
  {
    title: "Interactive tools",
    items: [
      { label: "Cloud exposure estimator (FAIR)", href: "/tools/fair-exposure-calculator.html" },
      { label: "Consolidation ROI calculator", href: "/tools/roi-consolidation-calculator.html" },
    ],
  },
  {
    title: "Explainer videos",
    items: [
      { label: "How an attack path forms", href: "/videos/Onam-Attack-Path.mp4" },
      { label: "Cloud risk in dollars (FAIR)", href: "/videos/Onam-FAIR-Dollars.mp4" },
      { label: "One choke point, many attacks", href: "/videos/Onam-Choke-Point.mp4" },
    ],
  },
];

function Page() {
  const latest = BLOG_POSTS.slice(0, 3);
  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-[#E5E9F0] bg-white">
        <div className="absolute -top-32 right-0 w-[600px] h-[400px] rounded-full bg-[#2563EB]/10 blur-[140px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-14">
          <div className="text-[11px] uppercase tracking-widest font-semibold text-[#1D4ED8] mb-3">Resources</div>
          <h1 className="font-display font-black text-[#0B1220] text-4xl md:text-5xl tracking-tight max-w-3xl leading-[1.05]">Resources</h1>
          <p className="mt-4 text-lg text-[#475569] max-w-2xl">
            Guides, documentation, and technical references for cloud security practitioners.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pt-14">
        <a
          href="/decks/attack-path-story.html"
          target="_blank"
          rel="noopener"
          className="group block rounded-2xl border border-[#DBE7FE] bg-gradient-to-br from-[#0A1E4D] to-[#123A8A] p-8 md:p-10 text-white shadow-[0_8px_24px_rgba(16,24,40,.08)] hover:shadow-[0_14px_40px_rgba(16,24,40,.18)] transition"
        >
          <div className="text-[11px] uppercase tracking-widest font-semibold text-[#9FC0FF] mb-3">Interactive · New</div>
          <h2 className="font-display font-black text-2xl md:text-[32px] leading-[1.1] tracking-tight">
            Four hops. Three tools blind. One breach.
          </h2>
          <p className="mt-3 text-[#CFE0FF] max-w-2xl">
            Walk one real attack path — from a forgotten instance to your crown-jewel data — and watch a single fix break the whole chain. An animated, self-guided walkthrough.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 font-semibold text-white">
            Open the interactive deck
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </span>
        </a>
      </section>

      <section className="max-w-7xl mx-auto px-6 pt-14">
        <div className="text-[11px] uppercase tracking-widest font-semibold text-[#1D4ED8] mb-2">Library</div>
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#0B1220]">Whitepapers, brochures &amp; tools</h2>
        <p className="mt-2 text-[#475569] max-w-2xl">
          Technical whitepapers, the capabilities brochure, illustrative calculators, and short
          explainer videos — free to download and share.
        </p>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {LIBRARY.map((g) => (
            <div key={g.title} className="bg-white border border-[#E5E9F0] rounded-2xl p-6 shadow-[0_1px_3px_rgba(16,24,40,.04)]">
              <h3 className="font-display font-bold text-[16px] text-[#0B1220]">{g.title}</h3>
              <ul className="mt-3 space-y-1">
                {g.items.map((it) => (
                  <li key={it.href}>
                    <a
                      href={it.href}
                      target="_blank"
                      rel="noopener"
                      className="group flex items-center justify-between gap-2 py-2 border-b border-[#EEF2F6] text-sm text-[#0B1220] hover:text-[#2563EB]"
                    >
                      <span>{it.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 max-w-2xl">
          <ResourceSignup />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((c) => (
            <div key={c.title} className="bg-white border border-[#E5E9F0] rounded-2xl p-7 shadow-[0_1px_3px_rgba(16,24,40,.04)] hover:shadow-[0_8px_24px_rgba(16,24,40,.08)] transition">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: c.bg }}>
                  <c.Icon className="w-5 h-5" style={{ color: c.color }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-extrabold text-xl text-[#0B1220]">{c.title}</h3>
                  <p className="text-sm text-[#475569] mt-1.5">{c.desc}</p>
                </div>
              </div>
              <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                {c.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="group flex items-center justify-between py-2 border-b border-[#EEF2F6] text-sm text-[#0B1220] hover:text-[#2563EB]"
                    >
                      <span>{l.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#F7F9FC] border-y border-[#E5E9F0]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-[11px] uppercase tracking-widest font-semibold text-[#1D4ED8] mb-2">From the blog</div>
              <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#0B1220]">Latest posts</h2>
            </div>
            <Link to="/resources/blog" className="text-sm font-medium text-[#2563EB] hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {latest.map((p) => (
              <Link
                key={p.slug}
                to="/resources/blog/$slug"
                params={{ slug: p.slug }}
                className="group bg-white border border-[#E5E9F0] rounded-2xl p-6 hover:shadow-[0_8px_24px_rgba(16,24,40,.08)] transition"
              >
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
                  {p.category}
                </span>
                <h3 className="mt-3 font-display font-bold text-[17px] text-[#0B1220] leading-snug group-hover:text-[#2563EB]">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-[#475569] line-clamp-2">{p.excerpt}</p>
                <div className="mt-4 text-xs text-[#64748B]">{p.date} • {p.readTime} read</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white border border-[#E5E9F0] rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_1px_3px_rgba(16,24,40,.04)]">
          <div>
            <h3 className="font-display font-extrabold text-2xl text-[#0B1220]">Read the docs</h3>
            <p className="mt-2 text-[#475569] max-w-2xl">Everything from onboarding your first account to tuning findings and hitting the API.</p>
          </div>
          <div className="flex gap-3">
            <BrandButton to="/docs">Open documentation</BrandButton>
            <BrandButton to="/request-demo" variant="secondary">Book a demo</BrandButton>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
