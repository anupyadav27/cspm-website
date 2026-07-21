import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Cloud, Cloudy, Server, Container, Landmark, HeartPulse, Building2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { seo } from "@/lib/seo";

type CardDef = { name: string; href: string; blurb: string; color: string; abbr: string };

const clouds: CardDef[] = [
  { name: "Amazon Web Services", href: "/solutions/aws", blurb: "800+ rules across every AWS account and region.", color: "#F2AF04", abbr: "AWS" },
  { name: "Microsoft Azure", href: "/solutions/azure", blurb: "Every subscription, tenant, and Entra ID policy — mapped.", color: "#2563EB", abbr: "AZ" },
  { name: "Google Cloud", href: "/solutions/gcp", blurb: "Org-wide traversal from IAM to BigQuery to GKE.", color: "#05A052", abbr: "GCP" },
  { name: "Oracle Cloud (OCI)", href: "/solutions/oci", blurb: "Compartment-tree depth for regulated enterprise workloads.", color: "#E32D25", abbr: "OCI" },
  { name: "Alibaba Cloud", href: "/solutions/alicloud", blurb: "RAM, OSS, RDS, and VPC coverage across China and international.", color: "#F2AF04", abbr: "ALI" },
  { name: "IBM Cloud", href: "/solutions/ibm", blurb: "Enterprise workloads on IBM Cloud FS Framework and NIST 800-53.", color: "#2563EB", abbr: "IBM" },
  { name: "Kubernetes", href: "/solutions/kubernetes", blurb: "EKS, AKS, GKE, and self-managed clusters — agentless.", color: "#05A052", abbr: "K8s" },
];

const industries: CardDef[] = [
  { name: "Financial Services", href: "/solutions/financial", blurb: "PCI-DSS, SOX, SOC 2, ISO 27001 evidence — continuously.", color: "#2563EB", abbr: "FSI" },
  { name: "Healthcare", href: "/solutions/healthcare", blurb: "HIPAA and HITRUST controls that survive an OCR audit.", color: "#E32D25", abbr: "HC" },
  { name: "Government", href: "/solutions/government", blurb: "FedRAMP, FISMA, CMMC — continuous ATO evidence.", color: "#05A052", abbr: "GOV" },
];

const cloudIcons: Record<string, typeof Cloud> = {
  AWS: Cloud, AZ: Cloudy, GCP: Cloud, OCI: Server, ALI: Cloud, IBM: Server, K8s: Container,
};
const industryIcons: Record<string, typeof Landmark> = { FSI: Landmark, HC: HeartPulse, GOV: Building2 };

function Card({ item, Icon }: { item: CardDef; Icon: typeof Cloud }) {
  return (
    <Link
      to={item.href}
      className="group bg-white border border-[#E5E9F0] rounded-2xl p-6 shadow-[0_1px_2px_rgba(16,24,40,.04),0_1px_3px_rgba(16,24,40,.06)] hover:shadow-[0_12px_28px_rgba(16,24,40,.10)] hover:-translate-y-0.5 transition-all flex flex-col"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-xl grid place-items-center"
          style={{
            backgroundColor: `color-mix(in srgb, ${item.color} 12%, #FFFFFF)`,
            boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${item.color} 22%, transparent)`,
          }}
        >
          <Icon className="w-5 h-5" style={{ color: item.color }} />
        </div>
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#64748B]">{item.abbr}</div>
      </div>
      <h3 className="mt-5 font-display font-bold text-[#0B1220] text-lg">{item.name}</h3>
      <p className="mt-2 text-sm text-[#475569] leading-relaxed flex-1">{item.blurb}</p>
      <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB]">
        Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
      </div>
    </Link>
  );
}

export const Route = createFileRoute("/solutions/")({
  head: () =>
    seo({
      title: "Solutions — Onam Security",
      description:
        "Security for every cloud and every industry — AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud, Kubernetes; financial services, healthcare, government.",
      path: "/solutions",
    }),
  component: SolutionsIndex,
});

function SolutionsIndex() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-[#E5E9F0] bg-white">
        <div className="absolute inset-0 dot-grid opacity-60" />
        <div className="absolute -top-40 right-1/4 w-[700px] h-[500px] rounded-full bg-[#2563EB]/10 blur-[140px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#64748B]">Solutions</div>
          <h1 className="mt-5 font-display font-black text-[#0B1220] text-5xl md:text-6xl tracking-tight leading-[1.05]">
            Security for every cloud and every industry.
          </h1>
          <p className="mt-6 text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
            One control set. Seven clouds. Every framework your auditor cares about — continuously monitored, agentless, read-only.
          </p>
        </div>
      </section>

      <section className="bg-[#F7F9FC] border-b border-[#E5E9F0] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
              By cloud
            </div>
            <h2 className="mt-4 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
              Deep coverage for every cloud you run
            </h2>
          </div>
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {clouds.map((c) => <Card key={c.href} item={c} Icon={cloudIcons[c.abbr] ?? Cloud} />)}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
              By industry
            </div>
            <h2 className="mt-4 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
              Built for the frameworks your industry lives by
            </h2>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {industries.map((c) => <Card key={c.href} item={c} Icon={industryIcons[c.abbr] ?? Landmark} />)}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
