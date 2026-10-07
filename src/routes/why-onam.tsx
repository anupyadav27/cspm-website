import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketplaceStrip } from "@/components/site/MarketplaceStrip";
import { ArrowRight, Check, FileSearch, Layers, Lock, Power, Unplug } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { seo } from "@/lib/seo";
import { CLOUDS } from "@/lib/product-facts";
import { Backdrop, Button, Card, Container, IconTile, Section, SectionHeading, StatusChip } from "@/components/site/system";
import { OneFoundation } from "@/components/site/home/ProductSuite";
import { Differentiator, TrustBar } from "@/components/site/security/SecurityHome";
import { SUITE } from "@/data/product-suite";

/**
 * /why-onam — the buying argument, in the top bar where Pricing used to be (owner
 * decision 2026-10-07: enterprise cloud security vendors sell through a demo, not a
 * price list; /pricing stays, under Resources › Evaluate).
 *
 * Built only from claims already cleared elsewhere on the site: the shared
 * foundation (ProductSuite), the security comparison (SecurityHome), AIOps statuses
 * (operations.ts via SUITE). No competitor is named outside the /compare pages.
 */
export const Route = createFileRoute("/why-onam")({
  head: () =>
    seo({
      title: "Why Onam — one platform instead of five tools",
      description:
        "Why teams choose Onam: one inventory for security, cost and recovery, AI agents that need a person's approval, and read-only access to your cloud.",
      path: "/why-onam",
      image: "/og/home.png",
    }),
  component: WhyOnam,
});

const PROBLEMS = [
  {
    icon: Unplug,
    pain: "Five tools, five inventories",
    detail: "The security tool, the cost tool, the CMDB and the DR runbook each keep their own list of what exists — and they disagree.",
    answer: "Onam Estate keeps one inventory, and every Onam product reads it. A cloud account is connected once.",
  },
  {
    icon: Layers,
    pain: "Findings without context",
    detail: "A risk arrives without its owner, its cost or what depends on it, so every decision starts with a research project.",
    answer: "Security, cost and recovery sit on the same resources, so the owner, the spend and the dependencies are one click away.",
  },
  {
    icon: Lock,
    pain: "AI you cannot audit",
    detail: "Automation that acts on its own is a change nobody approved and nobody can explain afterwards.",
    answer: "Onam AIOps agents investigate with evidence on every claim and propose changes; a person approves every one.",
  },
];

const COMPARE = [
  { name: "Wiz", href: "/compare/onam-vs-wiz.html" },
  { name: "Orca", href: "/compare/onam-vs-orca.html" },
  { name: "Cortex Cloud", href: "/compare/onam-vs-cortex-cloud.html" },
  { name: "Microsoft Defender for Cloud", href: "/compare/onam-vs-defender-for-cloud.html" },
];

function WhyOnam() {
  const agents = SUITE.filter((s) => s.agent);
  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-night">
        <Backdrop tone="night" color="#2563EB" pattern="graph" />
        <Container className="relative py-20 md:py-28 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-on-night-muted">Why Onam</div>
          <h1 className="mx-auto mt-5 max-w-4xl font-display text-4xl font-black leading-[1.05] tracking-tight text-white text-balance md:text-6xl">
            One platform for what you run, what it risks, what it costs and{" "}
            <span className="text-[#4D8DFF]">how it comes back.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-on-night-muted">
            Most teams stitch this together from separate tools across {CLOUDS} clouds. Onam does it on one
            inventory, in one console, with AI agents that never change your cloud without a person's approval.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button to="/request-demo" size="lg">
              Request a demo <ArrowRight className="h-4 w-4" />
            </Button>
            <Button to="/" variant="onDark" size="lg">
              See the platform
            </Button>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="The problem"
            title="Separate tools leave the hard part to your team."
            lead="Each tool answers its own question well. The work is in joining the answers — and that is the part nobody owns."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {PROBLEMS.map((p) => (
              <Card key={p.pain} className="flex flex-col p-6">
                <IconTile icon={p.icon} color="#2563EB" />
                <h3 className="mt-4 font-display text-lg font-bold text-ink">{p.pain}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body">{p.detail}</p>
                <div className="mt-5 flex gap-2 border-t border-line pt-4 text-sm font-medium text-ink">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#047857]" aria-hidden />
                  {p.answer}
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <OneFoundation />

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <SectionHeading
              eyebrow="AI you can audit"
              title="Agents that show their work — and wait for a person."
              lead="Every Onam AIOps answer links to the query and scan behind it. Every proposed change shows its diff and rollback, and waits in an approval centre. Autonomy is capped per organisation and can be stopped."
            />
            <Card className="p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-500">Where each agent is today</div>
              <ul className="mt-3 divide-y divide-line">
                {agents.map((p) => (
                  <li key={p.key} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <div className="text-sm font-semibold text-ink">{p.agent!.name}</div>
                      <div className="text-xs text-muted-500">works on {p.name}</div>
                    </div>
                    <StatusChip status={p.agent!.status} />
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-4 border-t border-line pt-4 text-sm text-body">
                <span className="inline-flex items-center gap-1.5"><FileSearch className="h-4 w-4 text-brand-500" aria-hidden /> Evidence on every claim</span>
                <span className="inline-flex items-center gap-1.5"><Power className="h-4 w-4 text-brand-500" aria-hidden /> Kill switch</span>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      <Differentiator />

      <Section tone="surface">
        <Container>
          <SectionHeading
            eyebrow="Side by side"
            title="How Onam Security compares"
            lead="Detailed, sourced comparisons with the tools buyers most often evaluate alongside us."
          />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {COMPARE.map((c) => (
              <a key={c.href} href={c.href} className="group">
                <Card interactive className="flex items-center justify-between p-5">
                  <span className="font-semibold text-ink">Onam vs {c.name}</span>
                  <ArrowRight className="h-4 w-4 text-subtle transition group-hover:text-brand-500" aria-hidden />
                </Card>
              </a>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-500">
            Comparisons cover Onam Security. Estate, FinOps, DRM and AIOps are compared in a demo, on your own cloud.{" "}
            <Link to="/pricing" className="font-semibold text-brand-500 hover:text-brand-600">
              Plans and pricing →
            </Link>
          </p>
        </Container>
      </Section>

      <MarketplaceStrip />
      <TrustBar />

      <Section bordered={false}>
        <Container narrow className="text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-[40px]">
            See it on your own cloud.
          </h2>
          <p className="mt-4 text-lg text-body">
            A working session with someone who knows the product you pick — not a slide deck.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/request-demo" size="lg">
              Request a demo <ArrowRight className="h-4 w-4" />
            </Button>
            <Button to="/trust" variant="secondary" size="lg">
              Visit the Trust Center
            </Button>
          </div>
        </Container>
      </Section>
    </SiteLayout>
  );
}
