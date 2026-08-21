import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { ArrowRight, Download, FileText, GitBranch, Coins, Layers, ShieldCheck, ClipboardCheck } from "lucide-react";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/whitepapers")({
  head: () =>
    seo({
      title: "Technical Whitepapers — Onam Security",
      description:
        "Five technical whitepapers on cloud attack-path analysis, FAIR risk quantification, the single-graph architecture, the read-only trust model, and compliance mapped once across 78 frameworks. Free, no signup.",
      path: "/whitepapers",
    }),
  component: Page,
});

type Paper = {
  n: string;
  title: string;
  pill: string;
  desc: string;
  points: string[];
  limit: string;
  slug: string;
  Icon: typeof FileText;
  color: string;
  bg: string;
};

const papers: Paper[] = [
  {
    n: "01",
    title: "How Onam finds the paths that matter",
    pill: "Attack paths",
    desc: "From read-only telemetry to a verified, MITRE-mapped, priced attack path — the method, step by step.",
    points: [
      "How primitives compose into a chain, rather than matching a pre-authored shape",
      "Verification: why an unreachable path is not a path",
      "MITRE ATT&CK mapping and how a path gets ranked",
    ],
    limit:
      "A methodology paper, not a benchmark. The examples come from a demo tenant and are illustrations, not customer results.",
    slug: "wp1-attack-path-methodology",
    Icon: GitBranch,
    color: "#2563EB",
    bg: "#EFF4FF",
  },
  {
    n: "02",
    title: "Cloud risk in dollars",
    pill: "FAIR / ALE",
    desc: "How Onam prices a verified attack path using FAIR — with named, external inputs a board can defend.",
    points: [
      "Loss magnitude and frequency, and where each input comes from",
      "Per-record costs drawn from published external research, not our own numbers",
      "Why a priced path beats a severity label in a board conversation",
    ],
    limit:
      "An estimate is only as good as the data classification behind it. This prices exposure; it does not predict a breach.",
    slug: "wp2-risk-quantification",
    Icon: Coins,
    color: "#0891B2",
    bg: "#ECFEFF",
  },
  {
    n: "03",
    title: "One graph, one data model",
    pill: "Architecture",
    desc: "Why every engine writes the same finding contract into one store — and what that makes possible that a drawer of separate tools cannot.",
    points: [
      "The shared finding contract every engine conforms to",
      "Why correlation is a property of the data model, not a feature bolted on later",
      "What a single graph buys you across posture, identity, data and runtime",
    ],
    limit:
      "One data model is an architectural choice with real trade-offs — it constrains how fast any single engine can diverge.",
    slug: "wp3-architecture",
    Icon: Layers,
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    n: "04",
    title: "Security & trust",
    pill: "Trust model",
    desc: "How Onam connects, what it stores, what it never stores, and how tenants stay isolated — the trust case for a read-only platform.",
    points: [
      "Read-only, agentless connection model and the permissions it asks for",
      "What is stored, what is never stored, and where",
      "Tenant isolation and the boundaries between them",
    ],
    limit:
      "Read-only scanning cannot see what happens inside a running process. It is a posture and path view, not a runtime agent.",
    slug: "wp4-security-trust",
    Icon: ShieldCheck,
    color: "#059669",
    bg: "#ECFDF5",
  },
  {
    n: "05",
    title: "Compliance, mapped once",
    pill: "78 frameworks",
    desc: "How Onam evaluates a control once and reports it against 78 frameworks — and connects every gap to a priced attack path.",
    points: [
      "One control evaluation, many framework projections",
      "78 compliance frameworks over a single control set",
      "Why a compliance gap is more useful when it carries a path and a price",
    ],
    limit:
      "Framework mapping is evidence for an audit, not a substitute for one. Your auditor still decides what satisfies a control.",
    slug: "wp5-compliance",
    Icon: ClipboardCheck,
    color: "#B45309",
    bg: "#FFFBEB",
  },
];

function Page() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-[1100px] px-5 pt-14 pb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#CBD5E1] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[2px] text-[#2563EB]">
          <FileText className="h-3.5 w-3.5" />
          No signup. No email. No gate.
        </div>
        <h1 className="mt-4 text-[40px] font-extrabold leading-[1.06] tracking-[-1px] text-[#0B1220] sm:text-[46px]">
          Technical whitepapers
        </h1>
        <p className="mt-4 max-w-[720px] text-[17px] leading-relaxed text-[#475569]">
          Five papers on how the platform actually works — the attack-path method, how a path gets
          priced, why everything writes into one graph, what we store and never store, and how one
          control evaluation reports against 78 frameworks. Written for engineers and architects who
          want the mechanism, not the pitch.
        </p>
        <div className="mt-7">
          <BrandButton href="/whitepapers/Onam-Whitepaper-Library.pdf" variant="secondary" size="lg">
            <Download className="h-4 w-4" />
            All five as one PDF
          </BrandButton>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1100px] gap-6 px-5 pb-16 md:grid-cols-2">
        {papers.map((p) => (
          <div
            key={p.slug}
            className="flex flex-col rounded-2xl border border-[#E2E8F2] bg-white p-7 transition-shadow hover:shadow-[0_8px_24px_rgba(16,24,40,.08)]"
          >
            <div className="flex items-start justify-between">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ background: p.bg }}
              >
                <p.Icon className="h-5 w-5" style={{ color: p.color }} />
              </div>
              <span className="text-[13px] font-bold tracking-[1px] text-[#CBD5E1]">{p.n}</span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <h2 className="text-[21px] font-bold leading-snug tracking-[-0.3px] text-[#0B1220]">
                {p.title}
              </h2>
              <span className="rounded-md border border-[#E2E8F2] bg-[#F8FAFC] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[1.5px] text-[#5C6B84]">
                {p.pill}
              </span>
            </div>

            <p className="mt-3 text-[15px] leading-relaxed text-[#475569]">{p.desc}</p>

            <ul className="mt-4 space-y-2">
              {p.points.map((pt) => (
                <li key={pt} className="flex gap-2.5 text-[14px] text-[#475569]">
                  <span
                    className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: p.color }}
                  />
                  {pt}
                </li>
              ))}
            </ul>

            <p className="mt-5 border-t border-[#E2E8F2] pt-4 text-[12.5px] italic leading-relaxed text-[#5C6B84]">
              {p.limit}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <BrandButton href={`/whitepapers/${p.slug}.html`} size="lg">
                Read in the browser
                <ArrowRight className="h-4 w-4" />
              </BrandButton>
              <BrandButton href={`/whitepapers/${p.slug}.pdf`} variant="secondary" size="lg">
                <Download className="h-4 w-4" />
                PDF
              </BrandButton>
            </div>
          </div>
        ))}
      </section>

      <section className="border-t border-[#E2E8F2] bg-[#F8FAFC]">
        <div className="mx-auto max-w-[1100px] px-5 py-14">
          <h2 className="text-[26px] font-bold tracking-[-0.5px] text-[#0B1220]">
            Why these aren&rsquo;t gated
          </h2>
          <p className="mt-3 max-w-[720px] text-[15.5px] leading-relaxed text-[#475569]">
            A whitepaper behind an email form gets read by nobody and cited by nobody. These are
            written to be forwarded to the colleague who actually has the question, quoted in a
            design review, and argued with. If the method holds up under that, it is worth more to
            us than your email address.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <BrandButton to="/tools" size="lg">
              Free calculators
              <ArrowRight className="h-4 w-4" />
            </BrandButton>
            <BrandButton to="/platform/attack-path" variant="secondary" size="lg">
              How attack paths work
            </BrandButton>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
