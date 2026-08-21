import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { ArrowRight, Download, Info, ShoppingCart, Sparkles, Landmark, Gamepad2, Server } from "lucide-react";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/case-studies")({
  head: () =>
    seo({
      title: "Illustrative Scenarios — Onam Security",
      description:
        "Five worked cloud-security scenarios by industry archetype — financial services, e-commerce, gaming, beauty/CPG and SAP MSP. Illustrative scenarios, not customer results: Onam has no public reference customers yet.",
      path: "/case-studies",
    }),
  component: Page,
});

type Scenario = {
  title: string;
  sector: string;
  path: string;
  question: string;
  slug: string;
  Icon: typeof Landmark;
  color: string;
  bg: string;
};

const scenarios: Scenario[] = [
  {
    title: "A leading financial-services firm",
    sector: "AWS + Azure · trading apps, PII, payment data · PCI-DSS & SOX",
    path: "Public LB → app role → RDS (PII)",
    question: "Audit season means assembling evidence from many tools, and the board asks the one question the stack cannot answer: how exposed are we, in dollars?",
    slug: "cs-financial",
    Icon: Landmark,
    color: "#2563EB",
    bg: "#EFF4FF",
  },
  {
    title: "A high-growth e-commerce platform",
    sector: "Multi-cloud · checkout, customer data, seasonal scale",
    path: "Exposed service → over-privileged role → customer data store",
    question: "Peak season doubles the footprint in a week. Which of the new findings actually reach checkout data?",
    slug: "cs-ecommerce",
    Icon: ShoppingCart,
    color: "#0891B2",
    bg: "#ECFEFF",
  },
  {
    title: "A global gaming studio",
    sector: "Kubernetes-heavy · player data, live services",
    path: "Cluster workload → service account → player data",
    question: "Hundreds of namespaces and constant deploys. Which RBAC grant is the one that matters this week?",
    slug: "cs-gaming",
    Icon: Gamepad2,
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    title: "A beauty and CPG brand",
    sector: "SaaS-heavy · marketing stack, consumer PII",
    path: "SaaS grant → shared identity → consumer data",
    question: "Most of the estate is SaaS the security team never provisioned. Where does consumer data actually sit?",
    slug: "cs-beauty-cpg",
    Icon: Sparkles,
    color: "#DB2777",
    bg: "#FDF2F8",
  },
  {
    title: "An SAP managed-service provider",
    sector: "Multi-tenant · regulated workloads, customer estates",
    path: "Management plane → tenant boundary → customer workload",
    question: "Every tenant is someone else's audit. How do you prove isolation holds across all of them at once?",
    slug: "cs-sap-msp",
    Icon: Server,
    color: "#059669",
    bg: "#ECFDF5",
  },
];

function Page() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-[1100px] px-5 pt-14 pb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#FCD34D] bg-[#FFFBEB] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[2px] text-[#B45309]">
          <Info className="h-3.5 w-3.5" />
          Illustrative scenarios — not customer results
        </div>
        <h1 className="mt-4 text-[40px] font-extrabold leading-[1.06] tracking-[-1px] text-[#0B1220] sm:text-[46px]">
          Five worked scenarios
        </h1>
        <p className="mt-4 max-w-[720px] text-[17px] leading-relaxed text-[#475569]">
          What an attack path looks like in five different estates — the chain, the choke point, and
          the question the security team is actually being asked. Each one is a worked example
          against an industry archetype.
        </p>

        <div className="mt-7 rounded-2xl border border-[#FCD34D] bg-[#FFFBEB] p-6">
          <h2 className="text-[16px] font-bold text-[#7C2D12]">
            Read this before you quote anything on this page
          </h2>
          <p className="mt-2.5 max-w-[760px] text-[14.5px] leading-relaxed text-[#7C2D12]">
            <strong>Onam has no public reference customers.</strong> Every scenario below is an
            illustration built against an industry archetype — not a real or named customer, and
            not an outcome we have delivered. The paths and figures show how the method works, not
            what it achieved for someone. When we have a named customer and real results, we will
            publish those instead and say so plainly.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1100px] gap-6 px-5 pb-16 md:grid-cols-2">
        {scenarios.map((s) => (
          <div
            key={s.slug}
            className="flex flex-col rounded-2xl border border-[#E2E8F2] bg-white p-7 transition-shadow hover:shadow-[0_8px_24px_rgba(16,24,40,.08)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{ background: s.bg }}
              >
                <s.Icon className="h-5 w-5" style={{ color: s.color }} />
              </div>
              <span className="rounded-md border border-[#FCD34D] bg-[#FFFBEB] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[1.2px] text-[#B45309]">
                Illustrative
              </span>
            </div>

            <h2 className="mt-5 text-[21px] font-bold leading-snug tracking-[-0.3px] text-[#0B1220]">
              {s.title}
            </h2>
            <p className="mt-1.5 text-[13px] text-[#5C6B84]">{s.sector}</p>

            <div className="mt-4 rounded-xl bg-[#F8FAFC] px-4 py-3">
              <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#5C6B84]">
                The path
              </div>
              <div className="mt-1 text-[14px] font-semibold text-[#0B1220]">{s.path}</div>
            </div>

            <p className="mt-4 text-[15px] leading-relaxed text-[#475569]">{s.question}</p>

            <div className="mt-6">
              <BrandButton href={`/case-studies/${s.slug}.png`} size="lg">
                View the scenario
                <ArrowRight className="h-4 w-4" />
              </BrandButton>
            </div>
          </div>
        ))}
      </section>

      <section className="border-t border-[#E2E8F2] bg-[#F8FAFC]">
        <div className="mx-auto max-w-[1100px] px-5 py-14">
          <h2 className="text-[26px] font-bold tracking-[-0.5px] text-[#0B1220]">
            We would rather have your estate than an archetype
          </h2>
          <p className="mt-3 max-w-[760px] text-[15.5px] leading-relaxed text-[#475569]">
            These scenarios exist because we have not earned real ones yet. If you run cloud
            infrastructure and want to know whether the paths we surface are real, run a read-only
            scan against a single account and tell us what you find — including if the answer is
            that it is noise. That is more useful to us than a signature.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <BrandButton to="/request-demo" size="lg">
              Run a scan on one account
              <ArrowRight className="h-4 w-4" />
            </BrandButton>
            <BrandButton href="/case-studies/Onam-Case-Studies.pdf" variant="secondary" size="lg">
              <Download className="h-4 w-4" />
              All five as one PDF
            </BrandButton>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
