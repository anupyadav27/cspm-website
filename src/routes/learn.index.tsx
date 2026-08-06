import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { LEARN_ARTICLES } from "@/data/learn-articles";
import { seo, SITE_URL } from "@/lib/seo";

/** The acronym comparison table — the thing people actually arrive looking for. */
const COMPARISON: { acronym: string; expands: string; scope: string; slug: string }[] = [
  { acronym: "CSPM", expands: "Cloud Security Posture Management", scope: "Is the cloud infrastructure configured correctly?", slug: "cspm" },
  { acronym: "CWPP", expands: "Cloud Workload Protection Platform", scope: "Are the running workloads patched and hardened?", slug: "cwpp" },
  { acronym: "CIEM", expands: "Cloud Infrastructure Entitlement Management", scope: "Who can actually do what, and do they still need it?", slug: "ciem" },
  { acronym: "DSPM", expands: "Data Security Posture Management", scope: "Where is the sensitive data and who can reach it?", slug: "dspm" },
  { acronym: "SSPM", expands: "SaaS Security Posture Management", scope: "Are M365, Workspace, GitHub and Snowflake locked down?", slug: "sspm" },
  { acronym: "CNAPP", expands: "Cloud-Native Application Protection Platform", scope: "All of the above, correlated on one data model.", slug: "cnapp" },
];

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Cloud Security Glossary",
  description:
    "Vendor-neutral explanations of cloud security categories: CSPM, CNAPP, CWPP, CIEM, DSPM, SSPM, attack path analysis and agentless scanning.",
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
      title: "Cloud Security Glossary — CSPM, CNAPP, CWPP, CIEM, DSPM Explained",
      description:
        "Plain-English explanations of the cloud security acronyms: CSPM, CNAPP, CWPP, CIEM, DSPM, SSPM, cloud attack paths and agentless scanning — what each covers, and how they differ.",
      path: "/learn",
    }),
  component: LearnIndex,
});

function LearnIndex() {
  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />

      <section className="relative overflow-hidden border-b border-[#E5E9F0] bg-white">
        <div className="absolute inset-0 dot-grid opacity-60" />
        <div className="absolute -top-40 right-0 w-[700px] h-[500px] rounded-full bg-[#2563EB]/10 blur-[140px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
            Learn
          </div>
          <h1 className="mt-6 font-display font-black text-[#0B1220] text-4xl md:text-6xl tracking-tight leading-[1.05]">
            The cloud security <span className="gradient-text">acronyms, explained.</span>
          </h1>
          <p className="mt-6 text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
            CSPM, CNAPP, CWPP, CIEM, DSPM, SSPM. Six acronyms, heavily overlapping marketing, and very
            little agreement on what any of them mean. These are vendor-neutral explanations of what each
            category actually covers — and, more usefully, what it does not.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white border-b border-[#E5E9F0]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-display font-extrabold text-[#0B1220] text-2xl md:text-3xl tracking-tight">
            CSPM vs CNAPP vs CWPP vs CIEM vs DSPM vs SSPM
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
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display font-extrabold text-[#0B1220] text-2xl md:text-3xl tracking-tight mb-8">
            All explainers
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {LEARN_ARTICLES.map((a) => (
              <Link key={a.slug} to="/learn/$slug" params={{ slug: a.slug }} className="group">
                <div className="h-full bg-white border border-[#E5E9F0] rounded-2xl p-6 shadow-[0_1px_2px_rgba(16,24,40,.04)] hover:shadow-[0_12px_28px_rgba(16,24,40,.10)] hover:-translate-y-0.5 transition-all flex flex-col">
                  <h3 className="font-display font-bold text-[#0B1220] text-lg leading-snug group-hover:text-[#2563EB]">
                    {a.question}
                  </h3>
                  <p className="mt-2.5 text-sm text-[#475569] leading-relaxed flex-1">{a.excerpt}</p>
                  <div className="mt-5 pt-4 border-t border-[#E5E9F0] flex items-center justify-between">
                    <span className="text-xs font-medium text-[#2563EB]">Read</span>
                    <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#F7F9FC]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="gradient-border rounded-3xl p-10 md:p-14 text-center">
            <h2 className="font-display font-black text-[#0B1220] text-3xl md:text-4xl tracking-tight">
              Stop reading. <span className="gradient-text">Start scanning.</span>
            </h2>
            <p className="mt-4 text-[#475569] max-w-lg mx-auto">
              Every category on this page is one engine on the Onam platform. Connect a read-only role and
              see all of them against your own cloud.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <BrandButton to="/request-demo" size="lg">Book a live demo →</BrandButton>
              <BrandButton to="/platform" size="lg" variant="secondary">Explore the platform</BrandButton>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
