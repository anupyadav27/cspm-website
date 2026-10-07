import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Cloud, Container as ContainerIcon, ShieldCheck, type LucideIcon } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { ProductDemo } from "@/components/site/DemoVideos";
import { cn } from "@/lib/utils";
import { faqJsonLd } from "@/lib/seo";
import { Backdrop, Section, Container, SectionHeading, IconTile, Card, StatusChip } from "@/components/site/system";
import { getSuite, type SuiteKey } from "@/data/product-suite";

export type CloudFeature = { icon: LucideIcon; iconColor: string; title: string; body: string };
export type CloudStep = { title: string; body: string };
export type CloudStat = { value: string; label: string };
export type CloudFaq = { q: string; a: string };
export type CloudRelated = { label: string; href: string; blurb: string };

export type CloudSolutionData = {
  breadcrumb: string;
  headline: string;
  sub: string;
  /** <meta name="description">, max 155 chars, keyword first. Falls back to `sub`. */
  metaDescription?: string;
  docsHref: string;
  stats: CloudStat[];
  servicesHeading?: string;
  services: string[];
  servicesPlusNote?: string;
  frameworks: string[];
  setupSteps: CloudStep[];
  featuresHeading: string;
  features: CloudFeature[];
  faqs: CloudFaq[];
  /**
   * Internal links out to the platform and glossary clusters. These exist for
   * topical clustering as much as for readers — GSC showed the cloud pages
   * ranking at position 23–30 with almost no internal links pointing between
   * them and the concept pages that share their intent.
   */
  related?: CloudRelated[];
  cloudName: string;
  /** Overrides for the "Across the platform" cards. Defaults come from cloudPlatformNotes. */
  platform?: Partial<PlatformNotes>;
};

/** Each provider's own brand colour, used only as the banner tint. */
const CLOUD_ACCENT: Record<string, string> = {
  AWS: "#FF9900",
  Azure: "#0078D4",
  "Google Cloud": "#4285F4",
  OCI: "#C74634",
  "Alibaba Cloud": "#FF6A00",
  "IBM Cloud": "#0F62FE",
  Kubernetes: "#326CE5",
};

function Hero({ data }: { data: CloudSolutionData }) {
  return (
    <section className="relative overflow-hidden border-b border-[#E5E9F0] bg-white">
      <Backdrop
        tone="light"
        color={CLOUD_ACCENT[data.cloudName] ?? "#2563EB"}
        pattern="grid"
        icon={data.cloudName === "Kubernetes" ? ContainerIcon : Cloud}
      />
      <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24 text-center">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#64748B]">{data.breadcrumb}</div>
        <h1 className="mt-5 font-display font-black text-[#0B1220] text-4xl md:text-5xl lg:text-[56px] tracking-tight leading-[1.05]">
          {data.headline}
        </h1>
        <p className="mt-6 text-lg text-[#475569] max-w-3xl mx-auto leading-relaxed">{data.sub}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <BrandButton to="/request-demo" size="lg">Book a live demo <ArrowRight className="w-4 h-4" /></BrandButton>
          <BrandButton href={data.docsHref} size="lg" variant="secondary">How to connect {data.cloudName}</BrandButton>
        </div>
      </div>
    </section>
  );
}

function StatStrip({ stats }: { stats: CloudStat[] }) {
  return (
    <section className="bg-white border-b border-[#E5E9F0]">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-[#E5E9F0]">
        {stats.map((s, i) => (
          <div key={i} className="px-6 first:pl-0 last:pr-0 text-center md:text-left">
            <div className="text-2xl md:text-3xl font-display font-black text-[#0B1220]">{s.value}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-[#64748B] font-semibold">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Services({ data }: { data: CloudSolutionData }) {
  return (
    <section className="bg-[#F7F9FC] border-b border-[#E5E9F0] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
            Coverage
          </div>
          <h2 className="mt-4 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
            {data.servicesHeading ?? `Services we monitor on ${data.cloudName}`}
          </h2>
          <p className="mt-3 text-[#475569]">Every service below is scanned continuously — no agents, no network changes, read-only.</p>
        </div>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {data.services.map((s) => (
            <div key={s} className="bg-white border border-[#E5E9F0] rounded-xl px-4 py-3 text-sm font-medium text-[#0B1220] flex items-center gap-2 shadow-[0_1px_2px_rgba(16,24,40,.04)]">
              <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>{s}</span>
            </div>
          ))}
        </div>
        {data.servicesPlusNote && (
          <p className="mt-6 text-sm text-[#64748B]"><span className="font-semibold text-[#475569]">Plus:</span> {data.servicesPlusNote}</p>
        )}
      </div>
    </section>
  );
}

function Frameworks({ data }: { data: CloudSolutionData }) {
  return (
    <section className="bg-white border-b border-[#E5E9F0] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
              Compliance
            </div>
            <h2 className="mt-3 font-display font-extrabold text-[#0B1220] text-2xl md:text-3xl tracking-tight">
              Compliance frameworks
            </h2>
            <p className="mt-2 text-[#475569] max-w-xl">Onam maps every {data.cloudName} finding to the frameworks your auditors care about.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.frameworks.map((f) => (
              <span key={f} className="px-3 py-2 rounded-lg text-xs font-semibold text-[#0B1220] bg-[#F1F5F9] border border-[#E5E9F0]">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SetupSteps({ data }: { data: CloudSolutionData }) {
  return (
    <section className="bg-[#F8FAFC] border-b border-[#E5E9F0] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
            Onboarding
          </div>
          <h2 className="mt-4 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">Connect in 3 steps</h2>
          <p className="mt-3 text-[#475569]">From consent to your first findings, with no agents to install for posture scanning.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {data.setupSteps.map((s, i) => (
            <div key={i} className="bg-white border border-[#E5E9F0] rounded-2xl p-6 shadow-[0_1px_2px_rgba(16,24,40,.04),0_1px_3px_rgba(16,24,40,.06)]">
              <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white grid place-items-center font-display font-black">{i + 1}</div>
              <h3 className="mt-5 font-display font-bold text-[#0B1220] text-lg">{s.title}</h3>
              <p className="mt-2 text-sm text-[#475569] leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features({ data }: { data: CloudSolutionData }) {
  return (
    <section className="bg-white border-b border-[#E5E9F0] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
            Differentiators
          </div>
          <h2 className="mt-4 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
            {data.featuresHeading}
          </h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {data.features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-white border border-[#E5E9F0] rounded-2xl p-6 shadow-[0_1px_2px_rgba(16,24,40,.04),0_1px_3px_rgba(16,24,40,.06)] hover:shadow-[0_12px_28px_rgba(16,24,40,.10)] hover:-translate-y-0.5 transition-all">
                <div
                  className="w-12 h-12 rounded-xl grid place-items-center"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${f.iconColor} 12%, #FFFFFF)`,
                    boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${f.iconColor} 22%, transparent)`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: f.iconColor }} />
                </div>
                <h3 className="mt-5 font-display font-bold text-[#0B1220] text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-[#475569] leading-relaxed">{f.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Faqs({ faqs }: { faqs: CloudFaq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-[#F7F9FC] border-b border-[#E5E9F0] py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
      />
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
            FAQ
          </div>
          <h2 className="mt-4 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">Questions we get a lot</h2>
        </div>
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="bg-white border border-[#E5E9F0] rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-[#F8FAFC] transition"
                >
                  <span className="font-display font-semibold text-[#0B1220]">{f.q}</span>
                  <span className={cn(
                    "shrink-0 w-7 h-7 rounded-full grid place-items-center border border-[#E5E9F0] text-[#475569] transition-transform",
                    isOpen && "rotate-45 border-[#2563EB] text-[#2563EB] bg-[#EFF4FF]",
                  )}>+</span>
                </button>
                {isOpen && <div className="px-6 pb-6 text-[#475569] leading-relaxed">{f.a}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CTA({ data }: { data: CloudSolutionData }) {
  return (
    <section className="bg-white py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="rounded-3xl border border-[#DBE7FE] bg-gradient-to-br from-[#EFF4FF] to-white p-10 md:p-14 text-center">
          <div className="inline-flex w-12 h-12 rounded-xl bg-[#2563EB] text-white items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="mt-5 font-display font-black text-[#0B1220] text-3xl md:text-4xl tracking-tight">
            See Onam on your {data.cloudName} environment
          </h2>
          <p className="mt-4 text-[#475569] max-w-xl mx-auto">
            Connect once with read-only access. Every Onam product you use works from the same discovery, so your
            accounts are connected once.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <BrandButton to="/request-demo" size="lg">Book a demo →</BrandButton>
            <BrandButton to="/pricing" size="lg" variant="secondary">See pricing</BrandButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function RelatedReading({ items, cloudName }: { items: CloudRelated[]; cloudName: string }) {
  if (!items.length) return null;
  return (
    <section className="py-20 bg-white border-t border-[#E5E9F0]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display font-extrabold text-[#0B1220] text-2xl md:text-3xl tracking-tight">
          {cloudName} security — related reading
        </h2>
        <p className="mt-3 text-[#475569] max-w-2xl">
          How the engines behind {cloudName} coverage work, and what the categories actually mean.
        </p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((r) => (
            <Link key={r.href} to={r.href} className="group">
              <div className="h-full bg-white border border-[#E5E9F0] rounded-2xl p-5 shadow-[0_1px_2px_rgba(16,24,40,.04)] hover:shadow-[0_12px_28px_rgba(16,24,40,.10)] hover:-translate-y-0.5 transition-all">
                <div className="font-display font-bold text-[#0B1220] text-[15px] group-hover:text-[#2563EB]">
                  {r.label}
                </div>
                <p className="mt-1.5 text-sm text-[#475569] leading-relaxed">{r.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Across the platform ─────────────────────────
 * The other Onam products on this cloud or industry. Every sentence here is taken
 * from src/data/product-suite.ts, src/data/products.ts and the product docs
 * (src/data/docs-articles/products.ts, drm.ts, operations.ts, trust-reference.ts).
 * Do not add a cloud-specific claim the docs do not make — where coverage for a
 * cloud is not documented, the card says to ask rather than implying support.
 */

export type PlatformNotes = { security: string; estate: string; finops: string; drm: string; aiops: string };

export function cloudPlatformNotes(cloudName: string): PlatformNotes {
  const isAws = cloudName === "AWS";
  return {
    security: `Posture, identity, attack paths, workloads and compliance for ${cloudName}. The detail is on the rest of this page.`,
    estate: `Every ${cloudName} resource Onam discovers lands in one inventory, with provider, region, account, state and last-seen time, through the same read-only access. Every discovery run is recorded with its trigger and status. ${
      isAws
        ? "The per-account architecture view draws each AWS account's topology: what it holds and how it connects."
        : `The per-account architecture view draws AWS accounts today, not ${cloudName}.`
    }`,
    finops: `Onam FinOps works on reconciled billing data: billed and effective cost, ownership, forecast, budgets, anomalies and savings. It holds read-only billing access and changes nothing in your accounts.${
      cloudName === "Google Cloud" ? " On Google Cloud, billing is read only if you opt in when you grant access." : ""
    } Ask us which ${cloudName} billing data applies to your accounts.`,
    drm: `Onam DRM works from the same inventory: it proposes applications from your tags, reads backup, snapshot and replication from cloud configuration, and predicts RTO and RPO against your targets. It plans and records — it does not run a failover or a DR test. Ask us about DRM coverage for ${cloudName}.`,
    aiops: isAws
      ? "AI agents investigate your Onam Security inventory and findings and propose changes a person approves. Executing a change in your AWS account is built but not offered — it is on the roadmap."
      : `AI agents investigate your Onam Security inventory and findings and propose changes a person approves. Executing a change in a customer cloud is on the roadmap, with AWS first; nothing is executed in ${cloudName} today.`,
  };
}

export function industryPlatformNotes(industryName: string): PlatformNotes {
  const who = industryName.toLowerCase();
  return {
    security: `Posture, identity, data security and compliance evidence for ${who} workloads. The detail is on the rest of this page.`,
    estate:
      "Auditors start with what you run. Onam Estate keeps one inventory of every discovered resource across accounts and regions, and records every discovery run — so the asset list carries its own provenance instead of being an export from last quarter.",
    finops:
      "Billed and effective cost side by side, cost attributed to owners and cost centres with the unattributed amount stated plainly, and forecasts as low, expected and high figures. Read-only: accepting a saving records a decision and changes nothing in your accounts.",
    drm: "Regulators expect tested recovery plans. Onam DRM maps applications and what they depend on, predicts RTO and RPO against the targets you set, records the drills you run with your own tools, and measures drift from the recovery model you approved. It plans and records; it does not run the failover.",
    aiops:
      "AI agents that investigate your Onam Security data with evidence on every claim, and propose changes a person approves. Nothing changes your cloud without that approval.",
  };
}

const PLATFORM_ORDER: SuiteKey[] = ["estate", "security", "finops", "drm", "aiops"];

export function AcrossThePlatform({
  title,
  lead,
  notes,
}: {
  title: string;
  lead: string;
  notes: PlatformNotes;
}) {
  return (
    <Section id="platform" tone="surface">
      <Container>
        <SectionHeading eyebrow="Across the platform" title={title} lead={lead} />
        <div className="mt-12 grid md:grid-cols-2 gap-5">
          {PLATFORM_ORDER.map((key) => {
            const p = getSuite(key);
            return (
              <Card key={key} className={cn("p-6 flex flex-col", key === "aiops" && "md:col-span-2")}>
                <div className="flex items-start gap-4">
                  <IconTile icon={p.icon} color={p.color} />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-widest text-muted-500">{p.stage}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <h3 className="font-display font-bold text-ink text-lg">
                        <Link to={p.href} className="hover:text-brand-500">
                          {p.name}
                        </Link>
                      </h3>
                      {key === "aiops" && <StatusChip status="early" />}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-body leading-relaxed flex-1">{notes[key]}</p>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
                  <Link to={p.href} className="inline-flex items-center gap-1 text-brand-500 hover:underline">
                    {key === "security" ? "All security engines" : `About ${p.name}`}
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                  </Link>
                  <Link to={p.docs} className="text-body hover:text-brand-500">
                    Docs
                  </Link>
                  <Link to="/request-demo" search={{ product: key }} className="text-body hover:text-brand-500">
                    {key === "aiops" ? "Ask for early access" : "Book a demo"}
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

export function CloudSolutionTemplate({ data }: { data: CloudSolutionData }) {
  return (
    <SiteLayout>
      <Hero data={data} />
      <StatStrip stats={data.stats} />
      <AcrossThePlatform
        title={`One platform on ${data.cloudName}`}
        lead={`Connect ${data.cloudName} once. Onam Security is covered in detail below; the rest of the platform works from the same discovery.`}
        notes={{ ...cloudPlatformNotes(data.cloudName), ...data.platform }}
      />
      <Services data={data} />
      <Frameworks data={data} />
      <SetupSteps data={data} />
      <ProductDemo
        compact
        tone="white"
        clips={["onboard", "assets", "dashboard"]}
        eyebrow="See it live"
        title={`${data.cloudName} in the Onam Security console.`}
        gradientWords="Onam Security console."
        subtitle="A recreation of the Onam console with sample data: connect, inventory and posture in one view."
      />
      <Features data={data} />
      <Faqs faqs={data.faqs} />
      <RelatedReading items={data.related ?? []} cloudName={data.cloudName} />
      <CTA data={data} />
    </SiteLayout>
  );
}
