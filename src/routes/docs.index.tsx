import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Cloud, BookOpen } from "lucide-react";
import { BrandButton } from "@/components/site/BrandButton";
import { Backdrop, Card, IconTile, StatusChip } from "@/components/site/system";
import { SUITE, type SuiteKey } from "@/data/product-suite";
import { DOC_SECTIONS } from "@/data/docs";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/docs/")({
  head: () =>
    seo({
      title: "Documentation — Onam",
      description:
        "Onam platform docs: connect a cloud once, then guides for Onam Estate, Onam Security, Onam FinOps, Onam DRM and Onam AIOps.",
      path: "/docs",
      image: "/og/docs.png",
    }),
  component: DocsHome,
});

/** Where each product's docs start, and the three pages most readers need next. */
const PRODUCT_DOCS: Record<SuiteKey, { overview: string; key: { title: string; slug: string }[] }> =
  {
    estate: {
      overview: "estate/overview",
      key: [
        { title: "Asset inventory", slug: "estate/inventory" },
        { title: "Architecture view", slug: "estate/architecture" },
        { title: "Discovery pipeline", slug: "estate/pipeline" },
      ],
    },
    security: {
      overview: "security/overview",
      key: [
        { title: "CSPM", slug: "features/cspm" },
        { title: "Attack path", slug: "features/attack-path" },
        { title: "Compliance frameworks", slug: "compliance/frameworks" },
      ],
    },
    finops: {
      overview: "finops/overview",
      key: [
        { title: "The cost model", slug: "finops/cost-model" },
        { title: "Ownership & attribution", slug: "finops/ownership" },
        { title: "Savings", slug: "finops/savings" },
      ],
    },
    drm: {
      overview: "drm/overview",
      key: [
        { title: "Applications & dependencies", slug: "drm/applications" },
        { title: "Recovery plans & readiness", slug: "drm/recovery-plans" },
        { title: "RTO, RPO & drills", slug: "drm/objectives" },
      ],
    },
    aiops: {
      overview: "operations/overview",
      key: [
        { title: "Availability & status", slug: "operations/availability" },
        { title: "The agents", slug: "operations/agents" },
        { title: "Governance & approvals", slug: "operations/governance" },
      ],
    },
  };

const docCount = (slugPrefix: string) =>
  DOC_SECTIONS.flatMap((s) => s.items).filter((i) => i.slug.startsWith(slugPrefix)).length;

function DocsHome() {
  const shared = DOC_SECTIONS.filter((s) => s.product === "shared");

  return (
    <div className="pb-16">
      <div className="relative overflow-hidden rounded-2xl border border-line bg-white px-6 py-12 md:px-10 md:py-16">
        <Backdrop tone="light" color="#2563EB" pattern="flow" icon={BookOpen} />
        <div className="relative">
          <div className="text-xs uppercase tracking-[0.12em] font-semibold text-brand-600 mb-3">
            Documentation
          </div>
          <h1 className="font-display font-black text-ink text-4xl md:text-5xl tracking-tight leading-[1.05]">
            Onam documentation
          </h1>
          <p className="mt-4 text-lg text-body max-w-2xl">
            One platform, four products and AI agents across them. Connect a cloud once, then pick
            the product you are working in. Not sure where to begin? Read the{" "}
            <Link
              to="/docs/$"
              params={{ _splat: "getting-started/introduction" }}
              className="text-brand-600 underline underline-offset-4 hover:text-ink"
            >
              platform introduction
            </Link>
            .
          </p>
        </div>
      </div>

      <h2 className="mt-12 font-display font-extrabold text-2xl text-ink">Docs by product</h2>
      <div className="mt-6 grid md:grid-cols-2 gap-5">
        {SUITE.map((p) => {
          const d = PRODUCT_DOCS[p.key];
          const prefix = d.overview.split("/")[0] + "/";
          const count = p.key === "security" ? null : docCount(prefix);
          return (
            <Card
              key={p.key}
              className="p-6 flex flex-col"
              style={{ borderTop: `3px solid ${p.color}` }}
            >
              <div className="flex items-start gap-4">
                <IconTile icon={p.icon} color={p.color} />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display font-bold text-lg text-ink">{p.name}</h3>
                    {p.key === "aiops" && <StatusChip status="early" />}
                  </div>
                  <div className="text-xs text-muted-500 mt-0.5">{p.stage}</div>
                </div>
              </div>
              <p className="mt-4 text-[15px] text-ink font-medium leading-snug">{p.question}</p>
              <ul className="mt-4 border-t border-line pt-3 flex-1">
                {d.key.map((k) => (
                  <li key={k.slug}>
                    <Link
                      to="/docs/$"
                      params={{ _splat: k.slug }}
                      className="group flex items-center justify-between py-1.5 text-sm text-navy-600 hover:text-brand-600"
                    >
                      <span>{k.title}</span>
                      <ArrowRight
                        className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between gap-3">
                <Link
                  to="/docs/$"
                  params={{ _splat: d.overview }}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-ink"
                >
                  Start with the {p.short} overview <ArrowRight className="w-4 h-4" aria-hidden />
                </Link>
                {count !== null && <span className="text-xs text-muted-500">{count} pages</span>}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 bg-gradient-to-br from-tint-blue to-white border border-line rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex items-start gap-4 flex-1">
          <IconTile icon={Cloud} color="#2563EB" />
          <div>
            <div className="text-xs uppercase tracking-[0.12em] font-semibold text-brand-600 mb-1">
              Every product starts here
            </div>
            <h2 className="font-display font-extrabold text-xl text-ink">
              Connect your first cloud
            </h2>
            <p className="mt-1.5 text-sm text-body max-w-xl">
              One read-only connection per cloud account serves every product you use. On AWS,
              deploy a read-only CloudFormation stack and paste the Role ARN into Onam. Guides cover
              AWS, Azure, Google Cloud, Oracle Cloud, Alibaba Cloud, IBM Cloud and Kubernetes.
            </p>
          </div>
        </div>
        <BrandButton to="/docs/onboarding/aws">Start with AWS →</BrandButton>
      </div>

      <div className="mt-12">
        <h2 className="font-display font-extrabold text-2xl text-ink">Trust & reference</h2>
        <div className="mt-6 grid sm:grid-cols-3 gap-5">
          {shared.map((sec) => (
            <Card key={sec.heading} className="p-5">
              <h3 className="font-display font-bold text-ink">{sec.heading}</h3>
              <ul className="mt-2">
                {sec.items.map((it) => (
                  <li key={it.slug}>
                    <Link
                      to="/docs/$"
                      params={{ _splat: it.slug }}
                      className="block py-1 text-sm text-navy-600 hover:text-brand-600"
                    >
                      {it.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
