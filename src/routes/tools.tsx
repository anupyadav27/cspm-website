import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { ArrowRight, BookOpen, Calculator, TrendingDown, LockOpen } from "lucide-react";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/tools")({
  head: () =>
    seo({
      title: "Free Cloud Security Tools — Onam Security",
      description:
        "Free, ungated calculators for cloud security teams: a FAIR-style cloud exposure estimator and a tool-consolidation ROI estimator. No signup, no email required.",
      path: "/tools",
    }),
  component: Page,
});

type Tool = {
  title: string;
  pill: string;
  desc: string;
  points: string[];
  limit: string;
  href: string;
  Icon: typeof Calculator;
  color: string;
  bg: string;
};

const tools: Tool[] = [
  {
    title: "Cloud Exposure Estimator",
    pill: "FAIR method",
    desc: "Estimate the annualized loss exposure of a single breached data store, using inputs you can defend in front of a CFO.",
    points: [
      "FAIR-style loss magnitude × likelihood",
      "Per-record costs from IBM's Cost of a Data Breach 2024",
      "Sensitivity and regulatory multipliers you control",
    ],
    limit:
      "Illustrative estimate, not a prediction or a benchmark. It is only as good as the data classification behind it.",
    href: "/tools/fair-exposure-calculator.html",
    Icon: Calculator,
    color: "#2563EB",
    bg: "#EFF4FF",
  },
  {
    title: "Consolidation ROI Estimator",
    pill: "Tool spend",
    desc: "Compare what a stack of point tools costs you today — licences plus the team time spent stitching them — against one platform.",
    points: [
      "Licence savings across the tools you would drop",
      "Reclaimed engineering hours priced at your rate",
      "Every input editable; the arithmetic is shown, not hidden",
    ],
    limit:
      "Your result depends entirely on which tools you would genuinely retire. The default inputs are illustrative.",
    href: "/tools/roi-consolidation-calculator.html",
    Icon: TrendingDown,
    color: "#0891B2",
    bg: "#ECFEFF",
  },
  {
    title: "Capabilities Flipbook",
    pill: "Interactive",
    desc: "The full platform capability set as an interactive flipbook — every engine, every cloud, every compliance framework, page by page.",
    points: [
      "All 7 clouds and every security engine",
      "Compliance coverage per framework",
      "Readable in the browser, nothing to download",
    ],
    limit:
      "A capabilities reference, not a benchmark or a comparison. Verify anything you plan to quote against the current product.",
    href: "/tools/Onam-Capabilities-Flipbook.html",
    Icon: BookOpen,
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
];

function Page() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-[1100px] px-5 pt-14 pb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#CBD5E1] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[2px] text-[#2563EB]">
          <LockOpen className="h-3.5 w-3.5" />
          No signup. No email. No gate.
        </div>
        <h1 className="mt-4 text-[40px] font-extrabold leading-[1.06] tracking-[-1px] text-[#0B1220] sm:text-[46px]">
          Free tools for cloud security teams
        </h1>
        <p className="mt-4 max-w-[680px] text-[17px] leading-relaxed text-[#475569]">
          Two calculators we built because our own team kept getting asked the same two questions by
          finance: what would this actually cost us if it went wrong, and what are we paying for the
          tools we already own. They run entirely in your browser — nothing you type is sent
          anywhere.
        </p>
      </section>

      <section className="mx-auto grid max-w-[1100px] gap-6 px-5 pb-16 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <div
            key={t.title}
            className="flex flex-col rounded-2xl border border-[#E2E8F2] bg-white p-7 transition-shadow hover:shadow-[0_8px_24px_rgba(16,24,40,.08)]"
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ background: t.bg }}
            >
              <t.Icon className="h-5 w-5" style={{ color: t.color }} />
            </div>

            <div className="mt-5 flex items-center gap-3">
              <h2 className="text-[22px] font-bold tracking-[-0.3px] text-[#0B1220]">{t.title}</h2>
              <span className="rounded-md border border-[#E2E8F2] bg-[#F8FAFC] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[1.5px] text-[#5C6B84]">
                {t.pill}
              </span>
            </div>

            <p className="mt-3 text-[15px] leading-relaxed text-[#475569]">{t.desc}</p>

            <ul className="mt-4 space-y-2">
              {t.points.map((p) => (
                <li key={p} className="flex gap-2.5 text-[14px] text-[#475569]">
                  <span
                    className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: t.color }}
                  />
                  {p}
                </li>
              ))}
            </ul>

            <p className="mt-5 border-t border-[#E2E8F2] pt-4 text-[12.5px] italic leading-relaxed text-[#5C6B84]">
              {t.limit}
            </p>

            <div className="mt-6">
              <BrandButton href={t.href} size="lg">
                Open the estimator
                <ArrowRight className="h-4 w-4" />
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
            A calculator behind an email form is worth less to you and less to us. These are useful
            on their own, they are free to share, and you can send the link to a colleague without
            signing them up for anything. If the numbers make you curious about your real
            environment, the platform runs read-only and agentless — but that is your call to make,
            not a toll on the way in.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <BrandButton to="/request-demo" size="lg">
              See your real exposure
              <ArrowRight className="h-4 w-4" />
            </BrandButton>
            <BrandButton to="/platform/cspm" variant="secondary" size="lg">
              How the platform works
            </BrandButton>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
