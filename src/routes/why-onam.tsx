import { createFileRoute, Link } from "@tanstack/react-router";
import { VideoSection } from "@/components/site/VideoEmbed";
import { MarketplaceStrip } from "@/components/site/MarketplaceStrip";
import { ArrowRight, Check, FileSearch, Layers, Lock, Power, Unplug } from "@/components/site/icons";
import { SiteLayout } from "@/components/site/SiteLayout";
import { seo } from "@/lib/seo";
import { CLOUDS } from "@/lib/product-facts";
import { Backdrop, Button, Card, Container, IconTile, Section, SectionHeading, StatusChip } from "@/components/site/system";
import { OneFoundation } from "@/components/site/home/ProductSuite";
import { Differentiator, TrustBar } from "@/components/site/security/SecurityHome";
import { OPS_AGENTS } from "@/data/operations";

/**
 * /why-onam — the buying argument, in the top bar where Pricing used to be (owner
 * decision 2026-10-07: enterprise cloud security vendors sell through a demo, not a
 * price list; /pricing stays, under Resources › Evaluate).
 *
 * Built only from claims already cleared elsewhere on the site: the shared
 * foundation (ProductSuite), the security comparison (SecurityHome), Onam AI statuses
 * (operations.ts via OPS_AGENTS). No competitor is named outside the /compare pages.
 */
export const Route = createFileRoute("/why-onam")({
  head: () =>
    seo({
      title: "Why Onam — cloud, SaaS and code security on one graph",
      description:
        "Why Onam: cloud, SaaS and code security on one security graph, an AI security analyst that needs a person's approval for any change, and read-only access to your cloud.",
      path: "/why-onam",
      image: "/og/home.png",
    }),
  component: WhyOnam,
});

const PROBLEMS = [
  {
    icon: Unplug,
    pain: "Several tools, several inventories",
    detail: "The posture tool, the SaaS tool and the code scanner each keep their own list of what exists, and the lists disagree.",
    answer: "Onam Security keeps one inventory and one security graph, and every engine reads it. A cloud account is connected once.",
  },
  {
    icon: Layers,
    pain: "Findings without context",
    detail: "A risk arrives without the identity that can reach it, the data behind it or the path an attacker would take, so every decision starts with a research project.",
    answer: "Posture, identity, data and attack paths sit on the same graph, so the route to your data is one click away.",
  },
  {
    icon: Lock,
    pain: "AI you cannot audit",
    detail: "Automation that acts on its own is a change nobody approved and nobody can explain afterwards.",
    answer: "Onam AI, your AI security analyst, answers with evidence on every claim and suggests fixes; a person approves every change.",
  },
];

const COMPARE = [
  { name: "Wiz", href: "/compare/onam-vs-wiz.html" },
  { name: "Orca", href: "/compare/onam-vs-orca.html" },
  { name: "Cortex Cloud", href: "/compare/onam-vs-cortex-cloud.html" },
  { name: "Microsoft Defender for Cloud", href: "/compare/onam-vs-defender-for-cloud.html" },
];

function WhyOnam() {
  const agents = OPS_AGENTS.filter((a) => a.id !== "automation_actor");
  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-night">
        <Backdrop tone="night" color="#2563EB" pattern="graph" />
        <Container className="relative py-20 md:py-28 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-on-night-muted">Why Onam</div>
          <h1 className="mx-auto mt-5 max-w-4xl font-display text-4xl font-black leading-[1.05] tracking-tight text-white text-balance md:text-6xl">
            Cloud, SaaS and code security on one graph,{" "}
            <span className="text-[#4D8DFF]">with an AI analyst you can audit.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-on-night-muted">
            Most teams stitch this together from separate tools across {CLOUDS} clouds. Onam does it on one
            security graph, in one console, with an AI security analyst that never changes your cloud without a
            person's approval.
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
            lead="Each tool answers its own question well. The work is in joining the answers, and nobody owns that part."
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
              title="Every Onam AI answer has evidence, and every change waits for a person."
              lead="Every Onam AI answer links to the query and scan behind it and masks sensitive values. Every suggested fix shows its diff and rollback, and waits in an approval centre. Autonomy is capped per organisation and can be stopped."
            />
            <Card className="p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-500">Where each agent is today</div>
              <ul className="mt-3 divide-y divide-line">
                {agents.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <div className="text-sm font-semibold text-ink">{a.name}</div>
                      <div className="text-xs text-muted-500">{a.question}</div>
                    </div>
                    <StatusChip status={a.status} />
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

      <VideoSection
        video="whichAlert"
        title="Which alert do you fix first?"
        lead="When four tools disagree about the same cloud, Onam ranks the alerts against a single inventory of what you run."
      />

      <Section tone="surface">
        <Container>
          <SectionHeading
            eyebrow="Side by side"
            title="How Onam Security compares"
            lead="Sourced comparisons with four widely used cloud security tools."
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
            Comparisons cover Onam Security. Onam AI is best compared in a demo, on your own cloud.{" "}
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
            A working session with someone who knows the product you pick. No slide deck.
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
