import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, GraduationCap } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { LEARN_ARTICLES, LEARN_PRODUCT_LABEL, learnProduct, type LearnProduct } from "@/data/learn-articles";
import { seo, SITE_URL } from "@/lib/seo";
import { Backdrop } from "@/components/site/system";

/** The acronym comparison table — the thing people actually arrive looking for. */
const COMPARISON: { acronym: string; expands: string; scope: string; slug: string }[] = [
  { acronym: "CSPM", expands: "Cloud Security Posture Management", scope: "Is the cloud infrastructure configured correctly?", slug: "cspm" },
  { acronym: "CWPP", expands: "Cloud Workload Protection Platform", scope: "Are the running workloads patched and hardened?", slug: "cwpp" },
  { acronym: "CIEM", expands: "Cloud Infrastructure Entitlement Management", scope: "Who can actually do what, and do they still need it?", slug: "ciem" },
  { acronym: "DSPM", expands: "Data Security Posture Management", scope: "Where is the sensitive data and who can reach it?", slug: "dspm" },
  { acronym: "SSPM", expands: "SaaS Security Posture Management", scope: "Are M365, Workspace, GitHub and Snowflake locked down?", slug: "sspm" },
  { acronym: "CNAPP", expands: "Cloud-Native Application Protection Platform", scope: "All of the above, correlated on one data model.", slug: "cnapp" },
];

/** Glossary groups, in platform lifecycle order, with the product page each one leads to. */
const GROUPS: { product: LearnProduct; lead: string; href: string; cta: string }[] = [
  { product: "platform", lead: "Knowing what you run — the inventory every other discipline starts from.", href: "/estate", cta: "Onam Estate" },
  { product: "security", lead: "Posture, identity, data, workloads and code — and how the categories overlap.", href: "/platform", cta: "Onam Security" },
  { product: "finops", lead: "Who spends what, who owns it, and how cloud cost is managed as a practice.", href: "/finops", cta: "Onam FinOps" },
  { product: "drm", lead: "Recovery objectives, recovery strategies, and what makes a plan hold up.", href: "/disaster-recovery", cta: "Onam DRM" },
  { product: "aiops", lead: "AI agents in operations, and how people stay in control of them.", href: "/platform/ai-operations", cta: "Onam AIOps" },
];

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Cloud Platform Glossary",
  description:
    "Vendor-neutral explanations of cloud asset inventory, cloud security, FinOps, disaster recovery and agentic AIOps.",
  url: `${SITE_URL}/learn`,
  hasPart: LEARN_ARTICLES.map((a) => ({
    "@type": "Article",
    headline: a.question,
    url: `${SITE_URL}/learn/${a.slug}`,
  })),
};

export const Route = createFileRoute("/learn/")({
  head: () =>
    seo({
      title: "Cloud Platform Glossary — Security, FinOps, DR and AIOps Explained",
      description:
        "Cloud glossary in plain English: asset inventory, CSPM, CNAPP, CIEM, DSPM, FinOps, cost allocation, RTO vs RPO, disaster recovery and agentic AIOps.",
      path: "/learn",
      image: "/og/learn.png",
    }),
  component: LearnIndex,
});

function LearnIndex() {
  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />

      <section className="relative overflow-hidden border-b border-[#E5E9F0] bg-white">
        <Backdrop tone="light" color="#2563EB" pattern="dots" icon={GraduationCap} />
        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
            Learn
          </div>
          <h1 className="mt-6 font-display font-black text-[#0B1220] text-4xl md:text-6xl tracking-tight leading-[1.05]">
            Cloud platform terms, <span className="gradient-text">explained.</span>
          </h1>
          <p className="mt-6 text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
            Asset inventory, security posture, FinOps, disaster recovery and AI agents in operations — each with its
            own vocabulary and plenty of overlapping marketing. These are vendor-neutral explanations of what each
            term actually covers, and what it does not.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white border-b border-[#E5E9F0]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-display font-extrabold text-[#0B1220] text-2xl md:text-3xl tracking-tight">
            Security: CSPM vs CNAPP vs CWPP vs CIEM vs DSPM vs SSPM
          </h2>
          <p className="mt-3 text-[#475569]">
            The short version: five of these are components, and one is the umbrella.
          </p>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-[#E5E9F0]">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="bg-[#F7F9FC]">
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest text-[#64748B]">Acronym</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest text-[#64748B]">Stands for</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest text-[#64748B]">Question it answers</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((r) => (
                  <tr key={r.acronym} className="border-t border-[#E5E9F0] hover:bg-[#F7F9FC] transition">
                    <td className="px-5 py-4">
                      <Link
                        to="/learn/$slug"
                        params={{ slug: r.slug }}
                        className="font-display font-bold text-[#2563EB] hover:underline"
                      >
                        {r.acronym}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#0B1220] font-medium">{r.expands}</td>
                    <td className="px-5 py-4 text-sm text-[#475569]">{r.scope}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-display font-extrabold text-ink text-2xl md:text-3xl tracking-tight">
            All explainers, by topic
          </h2>
          {GROUPS.map((g) => {
            const articles = LEARN_ARTICLES.filter((a) => learnProduct(a) === g.product);
            if (articles.length === 0) return null;
            return (
              <div key={g.product} id={g.product} className="mt-12 scroll-mt-24">
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3 mb-6">
                  <div>
                    <h3 className="font-display font-bold text-ink text-xl">{LEARN_PRODUCT_LABEL[g.product]}</h3>
                    <p className="mt-1 text-sm text-body">{g.lead}</p>
                  </div>
                  <a href={g.href} className="text-sm font-semibold text-brand-600 hover:text-ink">
                    {g.cta} →
                  </a>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {articles.map((a) => (
                    <Link key={a.slug} to="/learn/$slug" params={{ slug: a.slug }} className="group">
                      <div className="h-full bg-white border border-line rounded-2xl p-6 shadow-[0_1px_2px_rgba(16,24,40,.04)] hover:shadow-[0_12px_28px_rgba(16,24,40,.10)] hover:-translate-y-0.5 transition-all flex flex-col">
                        <h4 className="font-display font-bold text-ink text-lg leading-snug group-hover:text-brand-500">
                          {a.question}
                        </h4>
                        <p className="mt-2.5 text-sm text-body leading-relaxed flex-1">{a.excerpt}</p>
                        <div className="mt-5 pt-4 border-t border-line flex items-center justify-between">
                          <span className="text-xs font-medium text-brand-600">Read</span>
                          <ArrowRight className="w-4 h-4 text-muted-500 group-hover:text-brand-500 group-hover:translate-x-0.5 transition" aria-hidden />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-24 bg-[#F7F9FC]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="gradient-border rounded-3xl p-10 md:p-14 text-center">
            <h2 className="font-display font-black text-[#0B1220] text-3xl md:text-4xl tracking-tight">
              Stop reading. <span className="gradient-text">See your own cloud.</span>
            </h2>
            <p className="mt-4 text-[#475569] max-w-lg mx-auto">
              Estate, Security, FinOps and DRM run on one Onam platform, with AIOps agents across them. Connect a
              read-only role once and see your own cloud.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <BrandButton to="/request-demo" size="lg">Book a live demo →</BrandButton>
              <BrandButton to="/" size="lg" variant="secondary">Explore the platform</BrandButton>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
