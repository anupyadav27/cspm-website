import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { ArrowRight, Scale } from "lucide-react";
import { seo } from "@/lib/seo";
import { COMPETITORS, QUESTIONS, VERIFIED_ON } from "@/data/compare";

export const Route = createFileRoute("/compare/")({
  head: () =>
    seo({
      title: "Compare cloud security platforms — Onam Security",
      description:
        "Seven questions that separate cloud security platforms, answered for Onam — with honest comparisons against Wiz, Orca Security, Prisma Cloud and Microsoft Defender for Cloud, including where each of them is stronger than us.",
      path: "/compare",
    }),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-[1000px] px-5 pt-14 pb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#CBD5E1] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[2px] text-[#2563EB]">
          <Scale className="h-3.5 w-3.5" />
          Seven questions. Ask them of us too.
        </div>
        <h1 className="mt-4 text-[40px] font-extrabold leading-[1.06] tracking-[-1px] text-[#0B1220] sm:text-[46px]">
          Comparing cloud security platforms
        </h1>
        <p className="mt-4 max-w-[720px] text-[17px] leading-relaxed text-[#475569]">
          Every vendor on your shortlist claims attack paths, agentless scanning and multi-cloud
          coverage. The words are identical; the products are not. These are the seven questions
          that actually separate them — and we answer them for ourselves, in public, including the
          places where the answer does not flatter us.
        </p>
      </section>

      <section className="mx-auto max-w-[1000px] px-5 pb-14">
        <div className="rounded-2xl border border-[#E2E8F2] bg-[#F8FAFC] p-7">
          <h2 className="text-[19px] font-bold text-[#0B1220]">
            What you will not find on these pages
          </h2>
          <p className="mt-3 max-w-[760px] text-[15px] leading-relaxed text-[#475569]">
            Claims about what anyone else&rsquo;s product can or cannot do. Cloud security platforms
            ship weekly, and a page asserting a competitor&rsquo;s gap is out of date within a
            quarter — at which point it is simply wrong, and everyone who checks will know. So we
            ask the questions and answer only for Onam. Take the same seven to every vendor on your
            list, including us.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1000px] px-5 pb-14">
        <h2 className="text-[27px] font-bold tracking-[-0.5px] text-[#0B1220]">
          The seven questions
        </h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-2">
          {QUESTIONS.map((item, i) => (
            <li
              key={item.q}
              className="flex gap-3.5 rounded-xl border border-[#E2E8F2] bg-white p-5"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EFF4FF] text-[13px] font-bold text-[#2563EB]">
                {i + 1}
              </span>
              <span className="text-[15px] font-semibold leading-snug text-[#0B1220]">{item.q}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-[1000px] px-5 pb-16">
        <h2 className="text-[27px] font-bold tracking-[-0.5px] text-[#0B1220]">
          Head to head
        </h2>
        <p className="mt-2 text-[15px] text-[#5C6B84]">
          Each page answers the seven for Onam, then says where they are stronger than us.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {COMPETITORS.map((c) => (
            <Link
              key={c.slug}
              to="/compare/$slug"
              params={{ slug: c.slug }}
              className="group flex flex-col rounded-2xl border border-[#E2E8F2] bg-white p-7 transition-shadow hover:shadow-[0_8px_24px_rgba(16,24,40,.08)]"
            >
              <h3 className="text-[21px] font-bold tracking-[-0.3px] text-[#0B1220]">
                Onam vs {c.shortName}
              </h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[#475569]">{c.intro}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#2563EB]">
                Read the comparison
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-[#E2E8F2] bg-[#F8FAFC]">
        <div className="mx-auto max-w-[1000px] px-5 py-14">
          <h2 className="text-[26px] font-bold tracking-[-0.5px] text-[#0B1220]">
            The only claim you can check today
          </h2>
          <p className="mt-3 max-w-[740px] text-[15.5px] leading-relaxed text-[#475569]">
            We have no public reference customers. Rather than ask you to believe a comparison
            table, run a read-only scan against a single account and tell us whether the attack
            paths are real. If they are noise, say so — that is worth more to us than a signature.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <BrandButton to="/request-demo" size="lg">
              Run a scan on one account
              <ArrowRight className="h-4 w-4" />
            </BrandButton>
            <BrandButton to="/whitepapers" variant="secondary" size="lg">
              How the method works
            </BrandButton>
          </div>
          <p className="mt-8 text-[12.5px] italic text-[#5C6B84]">Last reviewed {VERIFIED_ON}.</p>
        </div>
      </section>
    </SiteLayout>
  );
}
