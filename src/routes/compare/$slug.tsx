import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { ArrowRight, ChevronRight, ExternalLink, Quote, Scale } from "lucide-react";
import { seo } from "@/lib/seo";
import { COMPETITORS, VERIFIED_ON, countWord, getCompetitor, questionsFor } from "@/data/compare";

export const Route = createFileRoute("/compare/$slug")({
  loader: ({ params }) => {
    const competitor = getCompetitor(params.slug);
    if (!competitor) throw notFound();
    return { competitor };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Not found — Onam Security" }, { name: "robots", content: "noindex" }],
      };
    }
    const c = loaderData.competitor;
    const n = countWord(questionsFor(c).length);
    return seo({
      title: c.metaTitle ?? `Onam vs ${c.shortName} — ${n} questions to ask both — Onam Security`,
      description:
        c.metaDescription ??
        `Onam vs ${c.shortName}: ${c.shortName} in its own published words, and seven questions to ask both cloud security platforms, answered for Onam.`,
      path: `/compare/${c.slug}`,
    });
  },
  component: Page,
});

function Page() {
  const { competitor: c } = Route.useLoaderData();
  const others = COMPETITORS.filter((o) => o.slug !== c.slug);
  const questions = questionsFor(c);
  const n = countWord(questions.length);
  const quoted = c.inTheirWords ?? [];
  const who = c.referAs ?? c.shortName;
  const Who = who.charAt(0).toUpperCase() + who.slice(1);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-[900px] px-5 pt-12 pb-8">
        <nav className="flex items-center gap-1.5 text-[13px] text-[#5C6B84]">
          <Link to="/compare" className="hover:text-[#2563EB]">
            Compare
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[#0B1220]">Onam vs {c.shortName}</span>
        </nav>

        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#CBD5E1] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[2px] text-[#2563EB]">
          <Scale className="h-3.5 w-3.5" />
          {c.domain ? `${c.domain} · ask both` : "Run these questions against both"}
        </div>

        <h1 className="mt-4 text-[38px] font-extrabold leading-[1.08] tracking-[-1px] text-[#0B1220] sm:text-[44px]">
          Onam vs {c.shortName}
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-[#475569]">{c.intro}</p>

        <div className="mt-6 rounded-2xl border border-[#E2E8F2] bg-[#F8FAFC] p-6">
          <p className="text-[14.5px] leading-relaxed text-[#475569]">
            <strong className="text-[#0B1220]">How to read this page.</strong>{" "}
            {quoted.length > 0 ? (
              <>
                Everything said about {who} here is a quotation from their own public pages, with
                the address and the date we read it. We do not say what anyone else&rsquo;s product
                cannot do — products change monthly, and second-hand assertions age into lies. Then{" "}
                {n} questions, answered for <strong className="text-[#0B1220]">Onam only</strong>,
                and plainly where we are not the right choice. Ask {who} the same {n}.
              </>
            ) : (
              <>
                We do not make claims about {c.shortName}&rsquo;s product here. Products change
                monthly and a page full of second-hand assertions about someone else ages into a
                lie. What follows is {n} questions worth asking any cloud security platform,
                answered for <strong className="text-[#0B1220]">Onam only</strong> — then, plainly,
                where we are not the right choice. Ask {c.shortName} the same {n}.
              </>
            )}
          </p>
        </div>
      </section>

      {quoted.length > 0 && (
        <section className="mx-auto max-w-[900px] px-5 pb-10">
          <h2 className="text-[27px] font-bold tracking-[-0.5px] text-[#0B1220]">
            {Who}, in their own words
          </h2>
          <p className="mt-2 text-[15px] text-[#5C6B84]">
            Quoted verbatim from their public pages. If a page has changed, the quote is out of
            date, not invented — tell us and we will update it.
          </p>
          <div className="mt-6 space-y-5">
            {quoted.map((v) => (
              <figure key={v.url} className="rounded-2xl border border-[#E2E8F2] bg-white p-6">
                <figcaption className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[1.2px] text-[#5C6B84]">
                  <Quote className="h-4 w-4 text-[#2563EB]" />
                  {v.vendor}
                </figcaption>
                {v.quotes.map((q) => (
                  <blockquote
                    key={q}
                    className="mt-3 border-l-2 border-[#CBD5E1] pl-4 text-[15.5px] leading-relaxed text-[#334155]"
                  >
                    &ldquo;{q}&rdquo;
                  </blockquote>
                ))}
                {v.note && (
                  <p className="mt-3 text-[14.5px] leading-relaxed text-[#475569]">{v.note}</p>
                )}
                <p className="mt-4 text-[13px] text-[#5C6B84]">
                  Source:{" "}
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-[#2563EB] underline"
                  >
                    {v.source}
                    <ExternalLink className="ml-1 inline h-3 w-3 align-[-1px]" />
                  </a>
                  , accessed {v.accessed}.
                </p>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[900px] px-5 pb-4">
        <h2 className="text-[27px] font-bold tracking-[-0.5px] text-[#0B1220]">
          The {n} questions
        </h2>
        <p className="mt-2 text-[15px] text-[#5C6B84]">
          Our answers. Put the same list in front of {who}.
        </p>

        <ol className="mt-8 space-y-7">
          {questions.map((item, i) => (
            <li key={item.q} className="flex gap-4">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EFF4FF] text-[14px] font-bold text-[#2563EB]">
                {i + 1}
              </span>
              <div>
                <h3 className="text-[18px] font-bold leading-snug text-[#0B1220]">{item.q}</h3>
                <p className="mt-2 text-[15.5px] leading-relaxed text-[#475569]">{item.onam}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-[900px] px-5 pt-12 pb-4">
        <h2 className="text-[27px] font-bold tracking-[-0.5px] text-[#0B1220]">
          Where we are not the right choice
        </h2>
        <p className="mt-2 max-w-[700px] text-[15px] leading-relaxed text-[#5C6B84]">
          A comparison page that hides its own limits is marketing, not evaluation. Weigh this one.
        </p>

        <div className="mt-6 rounded-2xl border-l-4 border-[#B45309] bg-[#FFFBEB] p-6">
          <h3 className="text-[16px] font-bold text-[#7C2D12]">The honest gap</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-[#7C2D12]">{c.honestLimit}</p>
        </div>
      </section>

      <section className="mx-auto max-w-[900px] px-5 pt-12 pb-6">
        <div className="rounded-2xl border border-[#E2E8F2] bg-white p-7">
          <h2 className="text-[21px] font-bold tracking-[-0.3px] text-[#0B1220]">
            Do not take our word for any of it
          </h2>
          <p className="mt-3 text-[15.5px] leading-relaxed text-[#475569]">
            Run a scan against one account and tell us whether the attack paths we surface
            are real. If they are noise, we want to hear that — it is more useful to us than a
            signature. That is the same offer we make to everyone, and it is the only claim on this
            page you can check yourself today.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <BrandButton to="/request-demo" size="lg">
              Run a scan on one account
              <ArrowRight className="h-4 w-4" />
            </BrandButton>
            {c.platformHref ? (
              <BrandButton href={c.platformHref} variant="secondary" size="lg">
                How Onam does it
              </BrandButton>
            ) : (
              <BrandButton
                href="/resources/blog/onam-vs-wiz-orca-prisma-cloud"
                variant="secondary"
                size="lg"
              >
                The full buyer&rsquo;s guide
              </BrandButton>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[900px] px-5 pb-16">
        <h2 className="text-[15px] font-bold uppercase tracking-[1.5px] text-[#5C6B84]">
          Other comparisons
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {others.map((o) => (
            <Link
              key={o.slug}
              to="/compare/$slug"
              params={{ slug: o.slug }}
              className="rounded-xl border border-[#E2E8F2] bg-white px-4 py-2.5 text-[14px] font-semibold text-[#0B1220] transition-colors hover:border-[#2563EB] hover:text-[#2563EB]"
            >
              Onam vs {o.shortName}
            </Link>
          ))}
        </div>

        <p className="mt-6 text-[14px] text-[#5C6B84]">
          Building a shortlist instead?{" "}
          <Link
            to="/resources/blog/$slug"
            params={{ slug: "wiz-alternatives" }}
            className="text-[#2563EB] underline"
          >
            Wiz alternatives in 2026
          </Link>{" "}
          and{" "}
          <Link
            to="/resources/blog/$slug"
            params={{ slug: "best-cspm-tools" }}
            className="text-[#2563EB] underline"
          >
            the best CSPM tools in 2026
          </Link>
          , every vendor in its own published words.
        </p>

        <p className="mt-10 border-t border-[#E2E8F2] pt-5 text-[12.5px] italic leading-relaxed text-[#5C6B84]">
          Last reviewed {quoted.length > 0 ? quoted[0].accessed : VERIFIED_ON}. Onam&rsquo;s figures
          come from our published fact set.{" "}
          {quoted.length > 0
            ? `Quotations are from ${c.plural ? "each vendor" : c.name}'s own pages on the dates shown.`
            : `Nothing on this page is a claim about ${c.shortName}'s current capabilities.`}{" "}
          If anything here is wrong or out of date — including anything about {who} — tell us at{" "}
          <a className="text-[#2563EB] underline" href="mailto:hello@onamsecurity.com">
            hello@onamsecurity.com
          </a>{" "}
          and we will correct it.
        </p>
      </section>
    </SiteLayout>
  );
}
