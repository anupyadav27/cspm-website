import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";
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
import { StepsDiagram } from "@/components/site/flagship/StepsDiagram";
import { AIOPS_COLOR, getSuite } from "@/data/product-suite";
import { OPS_STATUS } from "@/data/operations";
import {
  PRODUCT_BASE,
  getCapability,
  type Capability,
  type CapabilityProduct,
} from "@/data/capabilities";
import { faqJsonLd, seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

/**
 * A capability page (`/estate/<slug>`, `/finops/<slug>`, `/disaster-recovery/<slug>`):
 * one module of a product, sold on its own page the way the Security engines are.
 *
 * banner → problem → what you see → screens (if >1 real capture) → how it works →
 * limits → AIOps agent → FAQ → more in this product → CTA.
 *
 * All copy comes from src/data/capabilities/<product>.ts, which may only say what the
 * product docs say. The agent's status is shown exactly as given (operations.ts).
 */

/** Product colour darkened enough to pass 4.5:1 as text on white. */
const textTone = (c: string) => `color-mix(in srgb, ${c} 72%, var(--color-ink))`;

const PATTERN: Record<CapabilityProduct, BackdropPattern> = {
  estate: "graph",
  finops: "flow",
  drm: "rings",
};

const OG: Record<CapabilityProduct, string> = {
  estate: "/og/estate.png",
  finops: "/og/finops.png",
  drm: "/og/drm.png",
};

export const capabilityPath = (c: Pick<Capability, "product" | "slug">) =>
  `${PRODUCT_BASE[c.product]}/${c.slug}`;

/** `head` for a capability route. */
export function capabilityHead(product: CapabilityProduct, slug: string) {
  const cap = getCapability(product, slug);
  if (!cap) return { meta: [{ title: "Not found — Onam" }, { name: "robots", content: "noindex" }] };
  return seo({
    title: cap.seoTitle,
    description: cap.metaDescription,
    path: capabilityPath(cap),
    image: OG[product],
  });
}

export function CapabilityPage({ cap }: { cap: Capability }) {
  const suite = getSuite(cap.product);
  const shots = cap.screenshots ?? [];
  // Alternate band tones down the page, whichever optional sections are present.
  let n = 0;
  const tone = () => (n++ % 2 === 0 ? "surface" : "white") as "surface" | "white";

  return (
    <SiteLayout>
      <Hero cap={cap} />
      <Problem cap={cap} tone={tone()} />
      <WhatYouSee cap={cap} tone={tone()} />
      {shots.length > 1 && <Screens cap={cap} tone={tone()} />}

      <Section id="how-it-works" tone={tone()}>
        <Container>
          <SectionHeading
            eyebrow="How it works"
            eyebrowColor={textTone(suite.color)}
            title="The mechanism, step by step"
            lead={`What ${cap.name} does, in the order it does it.`}
          />
          <div className="mt-14">
            <StepsDiagram
              titles={cap.steps.map((s) => s.title)}
              steps={cap.steps.map((s) => s.body)}
              color={suite.color}
            />
          </div>
        </Container>
      </Section>

      <Limits cap={cap} tone={tone()} />
      {cap.agent && <Agent cap={cap} tone={tone()} />}
      <Faq cap={cap} tone={tone()} />
      <MoreIn cap={cap} tone={tone()} />
      <ClosingCta cap={cap} />
    </SiteLayout>
  );
}

/* --------------------------------- Banner --------------------------------- */
function Hero({ cap }: { cap: Capability }) {
  const suite = getSuite(cap.product);
  const shot = cap.screenshots?.[0];
  return (
    <section className="relative overflow-hidden border-b border-line bg-white">
      <Backdrop tone="light" color={suite.color} pattern={PATTERN[cap.product]} icon={cap.icon} />
      <Container className="relative pt-8 pb-16 md:pt-12 md:pb-20">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-500">
            <li>
              <Link to="/" className="font-medium hover:text-ink transition">
                Onam platform
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="w-3.5 h-3.5" />
            </li>
            <li>
              <Link to={suite.href} className="font-medium hover:text-ink transition">
                {suite.name}
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="w-3.5 h-3.5" />
            </li>
            <li aria-current="page" className="font-semibold text-ink">
              {cap.name}
            </li>
          </ol>
        </nav>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div className="min-w-0">
            <Link
              to={suite.href}
              className="inline-flex items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
            >
              <IconTile icon={cap.icon} color={suite.color} size="lg" />
              <span>
                <span
                  className="block text-xs font-semibold uppercase tracking-[0.12em]"
                  style={{ color: textTone(suite.color) }}
                >
                  {suite.stage} · {suite.name}
                </span>
                <span className="block font-display text-lg font-bold text-ink">{cap.name}</span>
              </span>
            </Link>
            <h1 className="mt-7 font-display font-extrabold tracking-tight text-ink text-balance text-4xl md:text-5xl lg:text-[52px] leading-[1.06]">
              {cap.question}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-body text-pretty max-w-xl">{cap.lead}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button to="/request-demo" search={{ product: cap.product }} size="lg">
                Request a demo <ArrowRight className="w-4 h-4" aria-hidden />
              </Button>
              <Button to={cap.docs} size="lg" variant="secondary">
                <BookOpen className="w-4 h-4" aria-hidden /> Read the docs
              </Button>
            </div>
          </div>

          <div className="min-w-0">
            {shot ? (
              <Figure caption={shot.caption}>
                <BrowserFrame src={shot.src} alt={shot.alt} url={shot.url} priority />
              </Figure>
            ) : (
              <Figure illustrative>
                <div className="rounded-3xl border border-line bg-white p-4 md:p-6 shadow-[0_24px_64px_rgba(11,18,32,.12)]">
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

type Band = { cap: Capability; tone: "white" | "surface" };

/* -------------------------------- Problem -------------------------------- */
function Problem({ cap, tone }: Band) {
  const suite = getSuite(cap.product);
  return (
    <Section id="problem" tone={tone}>
      <Container className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <div>
          <Eyebrow color={textTone(suite.color)}>The problem</Eyebrow>
          <h2 className="mt-3 font-display font-extrabold tracking-tight text-ink text-3xl md:text-[40px] leading-[1.1]">
            In your words
          </h2>
        </div>
        <blockquote
          className="border-l-4 pl-6 md:pl-8 text-lg md:text-xl leading-relaxed text-ink-2 text-pretty"
          style={{ borderColor: `color-mix(in srgb, ${suite.color} 45%, transparent)` }}
        >
          {cap.problem}
        </blockquote>
      </Container>
    </Section>
  );
}

/* ------------------------------ What you see ------------------------------ */
function WhatYouSee({ cap, tone }: Band) {
  const suite = getSuite(cap.product);
  return (
    <Section id="what-you-see" tone={tone}>
      <Container>
        <SectionHeading
          eyebrow="What you see"
          eyebrowColor={textTone(suite.color)}
          title={`What ${cap.name} shows you`}
          lead="Described from the product documentation — what the view holds, not what we hope it will."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cap.whatYouSee.map((w) => (
            <li key={w.title}>
              <Card className="h-full p-5 sm:p-6 flex gap-4 sm:block">
                <IconTile icon={CheckCircle2} color={suite.color} size="sm" />
                <div className="min-w-0">
                  <h3 className="sm:mt-4 font-display text-lg font-bold text-ink">{w.title}</h3>
                  <p className="mt-1.5 sm:mt-2 text-sm leading-relaxed text-body">{w.body}</p>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

/* --------------------------------- Screens --------------------------------- */
function Screens({ cap, tone }: Band) {
  const suite = getSuite(cap.product);
  const shots = cap.screenshots ?? [];
  const [active, setActive] = useState(0);
  const base = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent, i: number) => {
    const last = shots.length - 1;
    const next =
      e.key === "ArrowRight" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <Section id="screens" tone={tone}>
      <Container>
        <SectionHeading
          eyebrow="Screens"
          eyebrowColor={textTone(suite.color)}
          title={`${cap.name} in the console`}
          lead="Real screens from the console. Each tab shows the address the product serves it at."
        />
        <div
          role="tablist"
          aria-label={`${cap.name} screens`}
          className="mt-10 flex flex-wrap gap-2"
        >
          {shots.map((s, i) => (
            <button
              key={s.src}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-tab-${i}`}
              aria-selected={active === i}
              aria-controls={`${base}-panel-${i}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50",
                active === i
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-white text-body hover:border-muted-500 hover:text-ink",
              )}
            >
              {s.label ?? s.caption.split(/[.—:]/)[0]}
            </button>
          ))}
        </div>
        {shots.map((s, i) => (
          <div
            key={s.src}
            role="tabpanel"
            id={`${base}-panel-${i}`}
            aria-labelledby={`${base}-tab-${i}`}
            hidden={active !== i}
            className="mt-6"
          >
            <Figure caption={s.caption}>
              <BrowserFrame src={s.src} alt={s.alt} url={s.url} />
            </Figure>
          </div>
        ))}
      </Container>
    </Section>
  );
}

/* --------------------------------- Limits --------------------------------- */
function Limits({ cap, tone }: Band) {
  const suite = getSuite(cap.product);
  return (
    <Section id="limits" tone={tone}>
      <Container>
        <SectionHeading
          eyebrow="Limits, said plainly"
          eyebrowColor={textTone(suite.color)}
          title="What it does not do"
          lead="Knowing where a capability stops is part of deciding whether to buy it."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {cap.limits.map((l) => (
            <li
              key={l.title}
              className={cn(
                "flex gap-4 rounded-2xl border border-line p-6",
                tone === "surface" ? "bg-white" : "bg-surface",
              )}
            >
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

/* ------------------------------ AIOps agent ------------------------------ */
function Agent({ cap, tone }: Band) {
  const agent = cap.agent!;
  const status = OPS_STATUS[agent.status];
  return (
    <Section id="aiops" tone={tone}>
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <SectionHeading
          eyebrow="Onam AIOps"
          eyebrowColor={textTone(AIOPS_COLOR)}
          title={`The ${agent.name}`}
          lead="Onam AIOps agents investigate with evidence on every claim and propose changes a person approves. Nothing changes your cloud without that approval."
        />
        <Card className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <IconTile icon={Bot} color={AIOPS_COLOR} />
            <h3 className="font-display text-xl font-bold text-ink">{agent.name}</h3>
            <StatusChip status={agent.status} />
          </div>
          <p className="mt-5 leading-relaxed text-ink-2">{agent.line}</p>
          <p className="mt-4 pt-4 border-t border-line text-sm leading-relaxed text-muted-500">
            <span className="font-semibold text-body">{status.label}:</span> {status.meaning}
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            <Link
              to={agent.href}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500 hover:text-brand-600"
            >
              Read the {agent.name} docs <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              to="/platform/ai-operations"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500 hover:text-brand-600"
            >
              About Onam AIOps <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
        </Card>
      </Container>
    </Section>
  );
}

/* ---------------------------------- FAQ ---------------------------------- */
function Faq({ cap, tone }: Band) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <Section id="faq" tone={tone}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(cap.faqs)) }}
      />
      <Container narrow>
        <SectionHeading
          align="center"
          eyebrow="FAQ"
          eyebrowColor={textTone(getSuite(cap.product).color)}
          title={`Questions about ${cap.name}`}
        />
        <div className="mt-12 divide-y divide-line rounded-2xl border border-line bg-white">
          {cap.faqs.map((f, i) => {
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
                      {isOpen ? <Minus className="w-4 h-4" aria-hidden /> : <Plus className="w-4 h-4" aria-hidden />}
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

/* --------------------------- More in this product --------------------------- */
function MoreIn({ cap, tone }: Band) {
  const suite = getSuite(cap.product);
  const siblings = cap.related
    .map((s) => getCapability(cap.product, s))
    .filter((c): c is Capability => Boolean(c));
  return (
    <Section id="more" tone={tone}>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow={`Part of ${suite.name}`}
            eyebrowColor={textTone(suite.color)}
            title={`More in ${suite.name}`}
          />
          <Link
            to={suite.href}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500 hover:text-brand-600"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden /> Back to {suite.name}
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {siblings.map((s) => (
            <Link
              key={s.slug}
              to={capabilityPath(s)}
              className="group rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
            >
              <Card interactive className="h-full p-6 flex flex-col">
                <IconTile icon={s.icon} color={suite.color} />
                <h3 className="mt-5 font-display text-lg font-bold text-ink">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body flex-1">{s.question}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500 group-hover:text-brand-600">
                  Explore {s.name}
                  <ArrowRight className="w-4 h-4 transition group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Card>
            </Link>
          ))}
          <Link
            to={suite.href}
            className="group rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
          >
            <Card
              interactive
              className="h-full p-6 flex flex-col"
              style={{
                backgroundColor: `color-mix(in srgb, ${suite.color} 6%, #FFFFFF)`,
                borderColor: `color-mix(in srgb, ${suite.color} 22%, #FFFFFF)`,
              }}
            >
              <IconTile icon={suite.icon} color={suite.color} />
              <h3 className="mt-5 font-display text-lg font-bold text-ink">{suite.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body flex-1">{suite.blurb}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500 group-hover:text-brand-600">
                The whole product
                <ArrowRight className="w-4 h-4 transition group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Card>
          </Link>
        </div>
      </Container>
    </Section>
  );
}

/* ---------------------------------- CTA ---------------------------------- */
function ClosingCta({ cap }: { cap: Capability }) {
  const suite = getSuite(cap.product);
  return (
    <Section tone="night" bordered={false}>
      <Container className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
        <SectionHeading
          onNight
          eyebrow={`${suite.stage} · ${suite.name}`}
          title={`See ${cap.name} on your own cloud.`}
          lead={`${suite.name} runs in the same console and login as the rest of Onam, with read-only access to your cloud.`}
        />
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Button to="/request-demo" search={{ product: cap.product }} size="lg">
            Request a demo <ArrowRight className="w-4 h-4" aria-hidden />
          </Button>
          <Button to={cap.docs} size="lg" variant="onDark">
            <BookOpen className="w-4 h-4" aria-hidden /> Read the docs
          </Button>
        </div>
      </Container>
    </Section>
  );
}
