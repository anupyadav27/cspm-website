import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { ArrowRight, CheckCircle2, ChevronRight, Scale } from "lucide-react";
import { seo } from "@/lib/seo";
import { COMPETITORS, QUESTIONS, VERIFIED_ON, getCompetitor } from "@/data/compare";

export const Route = createFileRoute("/compare/$slug")({
  loader: ({ params }) => {
    const competitor = getCompetitor(params.slug);
    if (!competitor) throw notFound();
    return { competitor };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Not found — Onam Security" }, { name: "robots", content: "noindex" }] };
    }
    const c = loaderData.competitor;
    return seo({
      title: `Onam vs ${c.shortName} — seven questions to ask both — Onam Security`,
      description: `Evaluating Onam Security against ${c.name}? Seven questions that separate cloud security platforms, answered for Onam — plus where ${c.shortName} is genuinely strong, and the honest gap.`,
      path: `/compare/${c.slug}`,
    });
  },
  component: Page,
});

function Page() {
  const { competitor: c } = Route.useLoaderData();
  const others = COMPETITORS.filter((o) => o.slug !== c.slug);

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
          Run these questions against both
        </div>

        <h1 className="mt-4 text-[38px] font-extrabold leading-[1.08] tracking-[-1px] text-[#0B1220] sm:text-[44px]">
          Onam vs {c.shortName}
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-[#475569]">{c.intro}</p>

        <div className="mt-6 rounded-2xl border border-[#E2E8F2] bg-[#F8FAFC] p-6">
          <p className="text-[14.5px] leading-relaxed text-[#475569]">
            <strong className="text-[#0B1220]">How to read this page.</strong> We do not make claims
            about {c.shortName}&rsquo;s product here. Products change monthly and a page full of
            second-hand assertions about someone else ages into a lie. What follows is seven
            questions worth asking any cloud security platform, answered for{" "}
            <strong className="text-[#0B1220]">Onam only</strong> — then, plainly, where{" "}
            {c.shortName} is strong and where we are not. Ask {c.shortName} the same seven.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[900px] px-5 pb-4">
        <h2 className="text-[27px] font-bold tracking-[-0.5px] text-[#0B1220]">
          The seven questions
        </h2>
        <p className="mt-2 text-[15px] text-[#5C6B84]">
          Our answers. Put the same list in front of {c.shortName}.
        </p>

        <ol className="mt-8 space-y-7">
          {QUESTIONS.map((item, i) => (
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
          Where {c.shortName} is genuinely strong
        </h2>
        <p className="mt-2 max-w-[700px] text-[15px] leading-relaxed text-[#5C6B84]">
          A comparison page that finds nothing good to say about the other side is marketing, not
          evaluation. These are real advantages and you should weigh them.
        </p>
        <ul className="mt-6 space-y-3">
          {c.strengths.map((s: string) => (
            <li key={s} className="flex gap-3 text-[15.5px] leading-relaxed text-[#475569]">
              <CheckCircle2 className="mt-[3px] h-[18px] w-[18px] shrink-0 text-[#059669]" />
              {s}
            </li>
          ))}
        </ul>

        <div className="mt-8 rounded-2xl border-l-4 border-[#B45309] bg-[#FFFBEB] p-6">
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
            Run a read-only scan against one account and tell us whether the attack paths we surface
            are real. If they are noise, we want to hear that — it is more useful to us than a
            signature. That is the same offer we make to everyone, and it is the only claim on this
            page you can check yourself today.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <BrandButton to="/request-demo" size="lg">
              Run a scan on one account
              <ArrowRight className="h-4 w-4" />
            </BrandButton>
            <BrandButton
              href="/resources/blog/onam-vs-wiz-orca-prisma-cloud"
              variant="secondary"
              size="lg"
            >
              The full buyer&rsquo;s guide
            </BrandButton>
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

        <p className="mt-10 border-t border-[#E2E8F2] pt-5 text-[12.5px] italic leading-relaxed text-[#5C6B84]">
          Last reviewed {VERIFIED_ON}. Onam&rsquo;s figures come from our published fact set; the
          strengths above are general market observations, not claims about {c.shortName}&rsquo;s
          current capabilities. If anything here is wrong or out of date — including anything about{" "}
          {c.shortName} — tell us at{" "}
          <a className="text-[#2563EB] underline" href="mailto:hello@onamsecurity.com">
            hello@onamsecurity.com
          </a>{" "}
          and we will correct it.
        </p>
      </section>
    </SiteLayout>
  );
}
