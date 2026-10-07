import { useId, useState } from "react";
import { OverviewSheet } from "@/components/site/OverviewSheet";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Ban,
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import {
  Backdrop,
  type BackdropPattern,
  BrowserFrame,
  Button,
  Card,
  Container,
  Eyebrow,
  Figure,
  IconTile,
  Section,
  SectionHeading,
  StatusChip,
} from "@/components/site/system";
import { SuiteStrip } from "@/components/site/home/ProductSuite";
import { ProductTour } from "@/components/site/flagship/ProductTour";
import { StepsDiagram } from "@/components/site/flagship/StepsDiagram";
import type { FlagshipData } from "@/components/site/flagship/types";
import { getSuite } from "@/data/product-suite";
import { OPS_AGENTS, OPS_STATUS } from "@/data/operations";
import { faqJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

/**
 * The flagship product page (WEBSITE-V2-PLAN.md §3.2) for Onam Estate, FinOps and DRM:
 * hero → proof → problem → modules → tour → how it works → AIOps → what you get →
 * limits → FAQ → the rest of the platform → CTA.
 *
 * Modules and the AIOps agent come from src/data/product-suite.ts (the same source as
 * the Products menu); the agent's status from src/data/operations.ts — never upgraded
 * here. Copy comes from src/data/products.ts.
 */

/** Product colour darkened enough to pass 4.5:1 as text on white. */
const textTone = (c: string) => `color-mix(in srgb, ${c} 72%, var(--color-ink))`;

function splitBullet(b: string): { title: string; desc: string } {
  const i = b.indexOf(" — ");
  return i === -1 ? { title: b, desc: "" } : { title: b.slice(0, i), desc: b.slice(i + 3) };
}

export function ProductFlagship({ data }: { data: FlagshipData }) {
  const suite = getSuite(data.key);
  const modules = suite.groups.flatMap((g) => g.items);
  const docsFor = (m: string) => modules.find((x) => x.title === m)?.href;
  const iconFor = (m: string): LucideIcon => data.moduleIcons[m] ?? suite.icon;

  return (
    <SiteLayout>
      <Hero data={data} />
      <ProofStrip data={data} />
      <Problem data={data} />

      {/* 4 · Modules */}
      <Section id="modules">
        <Container>
          <SectionHeading
            eyebrow={`Inside ${suite.name}`}
            eyebrowColor={textTone(suite.color)}
            title={`${modules.length} modules, one product`}
            lead="The same modules as the Products menu. Each card opens its own page, with the documentation one click further."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m) => (
              <Link
                key={m.title}
                to={m.href}
                className="group rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
              >
                <Card interactive className="h-full p-6 flex flex-col">
                  <IconTile icon={iconFor(m.title)} color={suite.color} />
                  <h3 className="mt-5 font-display text-lg font-bold text-ink">{m.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-body flex-1">{m.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500 group-hover:text-brand-600">
                    Explore{" "}
                    <ArrowRight
                      className="w-4 h-4 transition group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* 5 · Product tour */}
      <Section id="tour" tone="surface">
        <Container>
          <SectionHeading
            eyebrow={data.heroShot ? "Product tour" : "Inside the console"}
            eyebrowColor={textTone(suite.color)}
            title={
              data.heroShot
                ? `${suite.name}, screen by screen`
                : `What each view of ${suite.short} shows`
            }
            lead={
              data.heroShot
                ? "Real screens from the console, running on a demo tenant's seeded data."
                : `Each view of ${suite.name}, described from the product documentation.`
            }
          />
          <div className="mt-10">
            <ProductTour
              stops={data.tour}
              color={suite.color}
              docsFor={docsFor}
              iconFor={iconFor}
              caption={data.shotCaption}
              illustration={data.heroShot ? undefined : { src: suite.image, alt: suite.imageAlt }}
            />
          </div>
        </Container>
      </Section>

      {/* 6 · How it works */}
      <Section id="how-it-works">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            eyebrowColor={textTone(suite.color)}
            title="The mechanism, step by step"
            lead={`What ${suite.name} actually does, in the order it does it.`}
          />
          <div className="mt-14">
            <StepsDiagram
              titles={data.stepTitles}
              steps={data.page.mechanism}
              color={suite.color}
            />
          </div>
        </Container>
      </Section>

      <AgentBand data={data} />
      <WhatYouGet data={data} />
      <Limits data={data} />
      <OverviewSheet />
      <Faq data={data} />
      <SuiteStrip current={data.key} />
      <ClosingCta data={data} />
    </SiteLayout>
  );
}

/* ---------------------------------- 1 · Hero ---------------------------------- */
/** Product colour lightened enough to pass 4.5:1 as text on the night band. */
const nightTone = (c: string) => `color-mix(in srgb, ${c} 55%, #FFFFFF)`;

const HERO_PATTERN: Record<FlagshipData["key"], BackdropPattern> = {
  estate: "graph",
  finops: "flow",
  drm: "rings",
};

function Hero({ data }: { data: FlagshipData }) {
  const suite = getSuite(data.key);
  return (
    <section className="relative overflow-hidden bg-night text-white">
      <Backdrop tone="night" color={suite.color} pattern={HERO_PATTERN[data.key]} />
      <Container className="relative pt-10 pb-16 md:pt-14 md:pb-24">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-on-night-muted">
            <li>
              <Link to="/" className="font-medium hover:text-white transition">
                Onam platform
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="w-3.5 h-3.5 text-on-night-muted/70" />
            </li>
            <li aria-current="page" className="font-semibold text-white">
              {suite.name}
            </li>
          </ol>
        </nav>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <IconTile icon={suite.icon} color={suite.color} size="lg" />
              <div>
                <div
                  className="text-xs font-semibold uppercase tracking-[0.12em]"
                  style={{ color: nightTone(suite.color) }}
                >
                  {suite.stage}
                </div>
                <div className="font-display text-lg font-bold text-white">{suite.name}</div>
              </div>
            </div>
            <h1 className="mt-7 font-display font-extrabold tracking-tight text-white text-balance text-4xl md:text-5xl lg:text-[56px] leading-[1.05]">
              {suite.question}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-on-night-muted text-pretty max-w-xl">
              {data.answer}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button to="/request-demo" search={{ product: data.key }} size="lg">
                Request {/^[AEIOU]/.test(suite.short) ? "an" : "a"} {suite.short} demo{" "}
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Button>
              <Button to={suite.docs} size="lg" variant="onDark">
                <BookOpen className="w-4 h-4" aria-hidden /> Read the {suite.short} docs
              </Button>
            </div>
            <p className="mt-6 text-sm text-on-night-muted">
              Stand-alone, granted per organisation · same console and login as the rest of Onam ·
              read-only access to your cloud
            </p>
          </div>

          <div className="min-w-0">
            {data.heroShot ? (
              <Figure caption={data.shotCaption} className="[&_figcaption]:text-on-night-muted">
                <BrowserFrame
                  src={data.heroShot.src}
                  alt={data.heroShot.alt}
                  url={data.heroShot.url}
                  width={data.heroShot.width}
                  height={data.heroShot.height}
                  priority
                  className="border-white/10 shadow-[0_32px_80px_rgba(0,0,0,.55)]"
                />
              </Figure>
            ) : (
              <Figure illustrative className="[&_figcaption]:text-on-night-muted">
                <div className="rounded-3xl border border-white/10 bg-white p-4 md:p-6 shadow-[0_32px_80px_rgba(0,0,0,.55)] ring-1 ring-white/5">
                  <img
                    src={suite.image}
                    alt={suite.imageAlt}
                    width={640}
                    height={420}
                    loading="eager"
                    className="block w-full h-auto"
                  />
                </div>
              </Figure>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------- 2 · Proof strip ------------------------------- */
function ProofStrip({ data }: { data: FlagshipData }) {
  const stats = data.page.stats ?? [];
  if (!stats.length) return null;
  return (
    <section
      aria-label={`${data.page.label} at a glance`}
      className="border-b border-line bg-white"
    >
      <Container>
        <dl className="grid grid-cols-2 lg:grid-cols-4 divide-line [&>div]:border-line">
          {stats.map((s, i) => (
            <div
              key={s.l}
              className={cn(
                "py-7 px-4 sm:px-6",
                i % 2 === 1 && "border-l",
                i >= 2 && "border-t lg:border-t-0",
                i === 2 && "lg:border-l",
              )}
            >
              <dt className="sr-only">{s.l}</dt>
              <dd>
                <div className="font-display text-xl md:text-2xl font-extrabold tracking-tight text-ink">
                  {s.v}
                </div>
                <div className="mt-1 text-sm text-muted-500">{s.l}</div>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

/* -------------------------------- 3 · Problem -------------------------------- */
function Problem({ data }: { data: FlagshipData }) {
  const [first, ...rest] = data.page.painPoint.split(/(?<=[.!?])\s+/);
  const risk = data.page.risk;
  return (
    <Section id="problem" tone="surface">
      <Container className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Eyebrow>The problem</Eyebrow>
          <h2 className="mt-3 font-display font-extrabold tracking-tight text-ink text-balance text-3xl md:text-[40px] leading-[1.1]">
            {data.page.headline}
          </h2>
          <p className="mt-6 text-lg font-medium leading-relaxed text-ink-2">{first}</p>
          <p className="mt-4 leading-relaxed text-body">{rest.join(" ")}</p>
        </div>
        {risk && (
          <div className="lg:col-span-2">
            <Card className="h-full p-6 md:p-8">
              <span className="w-11 h-11 rounded-xl grid place-items-center bg-tint-red">
                <AlertTriangle className="w-5 h-5 text-onam-red" aria-hidden />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-ink">{risk.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-body">{risk.body}</p>
              <p className="mt-6 pt-5 border-t border-line text-sm font-medium text-body">
                {risk.tagline}
              </p>
            </Card>
          </div>
        )}
      </Container>
    </Section>
  );
}

/* --------------------------------- 7 · AIOps --------------------------------- */
function AgentBand({ data }: { data: FlagshipData }) {
  const suite = getSuite(data.key);
  if (!suite.agent) return null;
  const slug = suite.agent.href.split("/").pop();
  const agent = OPS_AGENTS.find((a) => a.slug === slug);
  const status = suite.agent.status;
  const meaning = OPS_STATUS[status].meaning;
  const shipped = status === "early" || status === "available";

  return (
    <Section id="aiops" tone="night">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div>
          <SectionHeading
            onNight
            eyebrow={`Onam AIOps on ${suite.short}`}
            title={agent?.question ?? suite.agent.name}
            lead={agent?.purpose}
          />
          <p className="mt-6 text-sm leading-relaxed text-on-night-muted max-w-xl">
            Onam AIOps agents investigate with evidence on every claim and propose changes a person
            approves. Nothing changes your cloud without that approval.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/platform/ai-operations" variant="onDark">
              About Onam AIOps <ArrowRight className="w-4 h-4" aria-hidden />
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-night-2 p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="w-10 h-10 rounded-xl grid place-items-center bg-white/[0.06] border border-white/10">
              <Bot className="w-5 h-5 text-white" aria-hidden />
            </span>
            <div className="font-display text-xl font-bold text-white">{suite.agent.name}</div>
            <StatusChip status={status} />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-on-night-muted">
            {meaning}
            {agent?.statusNote ? ` ${agent.statusNote}` : ""}
          </p>

          {agent && (
            <>
              <div className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-on-night-muted">
                {shipped ? "What it does" : "What it is designed to do"}
              </div>
              <ul className="mt-3 space-y-2.5">
                {agent.does.map((d) => (
                  <li key={d} className="flex gap-3 text-sm leading-relaxed text-white/90">
                    <CheckCircle2
                      className="mt-0.5 w-4 h-4 shrink-0 text-on-night-muted"
                      aria-hidden
                    />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
              {agent.never.length > 0 && (
                <>
                  <div className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-on-night-muted">
                    What it will never do
                  </div>
                  <ul className="mt-3 space-y-2.5">
                    {agent.never.map((d) => (
                      <li key={d} className="flex gap-3 text-sm leading-relaxed text-white/90">
                        <Ban className="mt-0.5 w-4 h-4 shrink-0 text-on-night-muted" aria-hidden />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}

          <Link
            to={suite.agent.href}
            className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:underline underline-offset-4"
          >
            Read the {suite.agent.name} docs <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </div>
      </Container>
    </Section>
  );
}

/* ------------------------------ 8 · What you get ------------------------------ */
function WhatYouGet({ data }: { data: FlagshipData }) {
  const suite = getSuite(data.key);
  return (
    <Section id="what-you-get" tone="surface">
      <Container>
        <SectionHeading
          eyebrow="What you get"
          eyebrowColor={textTone(suite.color)}
          title="Specific outputs, not a dashboard of promises"
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.page.whatYouGet.map((b) => {
            const { title, desc } = splitBullet(b);
            return (
              <li key={b}>
                <Card className="h-full p-6 flex gap-4">
                  <CheckCircle2
                    className="mt-0.5 w-5 h-5 shrink-0"
                    style={{ color: textTone(suite.color) }}
                    aria-hidden
                  />
                  <div>
                    <div className="font-display font-bold leading-snug text-ink">{title}</div>
                    {desc && <p className="mt-1.5 text-sm leading-relaxed text-body">{desc}</p>}
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}

/* --------------------------- 9 · Limits, said plainly --------------------------- */
function Limits({ data }: { data: FlagshipData }) {
  const suite = getSuite(data.key);
  return (
    <Section id="limits">
      <Container>
        <SectionHeading
          eyebrow="Limits, said plainly"
          eyebrowColor={textTone(suite.color)}
          title={`What ${suite.name} does not do`}
          lead="Knowing where a product stops is part of deciding whether to buy it."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {data.limits.map((l) => (
            <li key={l.title} className="flex gap-4 rounded-2xl border border-line bg-surface p-6">
              <span className="w-9 h-9 shrink-0 rounded-lg grid place-items-center bg-white border border-line">
                <Minus className="w-4 h-4 text-body" aria-hidden />
              </span>
              <div>
                <h3 className="font-display font-bold text-ink">{l.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-body">{l.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

/* ---------------------------------- 10 · FAQ ---------------------------------- */
function Faq({ data }: { data: FlagshipData }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  const faqs = data.page.faqs;
  return (
    <Section id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
      />
      <Container narrow>
        <SectionHeading align="center" eyebrow="FAQ" title={`Questions about ${data.page.label}`} />
        <div className="mt-12 divide-y divide-line rounded-2xl border border-line bg-white">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <h3>
                  <button
                    type="button"
                    id={`${base}-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${base}-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-5 text-left transition hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500/50"
                  >
                    <span className="font-display font-semibold text-ink md:text-lg">{f.q}</span>
                    <span className="shrink-0 w-7 h-7 rounded-full grid place-items-center border border-line text-body">
                      {isOpen ? (
                        <Minus className="w-4 h-4" aria-hidden />
                      ) : (
                        <Plus className="w-4 h-4" aria-hidden />
                      )}
                    </span>
                  </button>
                </h3>
                <div
                  id={`${base}-a-${i}`}
                  role="region"
                  aria-labelledby={`${base}-q-${i}`}
                  hidden={!isOpen}
                  className="px-5 md:px-6 pb-6 -mt-1 leading-relaxed text-body"
                >
                  {f.a}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

/* ---------------------------------- 12 · CTA ---------------------------------- */
function ClosingCta({ data }: { data: FlagshipData }) {
  const suite = getSuite(data.key);
  return (
    <Section tone="night" bordered={false}>
      <Container className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
        <div>
          <SectionHeading
            onNight
            eyebrow={suite.stage}
            title={`See ${suite.name} ${data.page.ctaWhere ?? "in your cloud"}.`}
            lead={data.page.ctaLine}
          />
        </div>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Button to="/request-demo" search={{ product: data.key }} size="lg">
            Request {/^[AEIOU]/.test(suite.short) ? "an" : "a"} {suite.short} demo{" "}
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Button>
          <Button to="/pricing" size="lg" variant="onDark">
            Pricing
          </Button>
        </div>
      </Container>
    </Section>
  );
}
