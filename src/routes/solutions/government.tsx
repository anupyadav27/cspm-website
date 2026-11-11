import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Building2, CheckCircle2, ShieldCheck } from "@/components/site/icons";
import { Backdrop } from "@/components/site/system";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { ProductDemo } from "@/components/site/DemoVideos";
import { AcrossThePlatform, industryPlatformNotes } from "@/components/site/CloudSolutionTemplate";
import type { IndustryFaq } from "@/components/site/IndustrySolutionTemplate";
import { governmentData } from "@/data/solutions-industries";
import { cn } from "@/lib/utils";
import { faqJsonLd, seo } from "@/lib/seo";

// Search Console (28 days to 2026-11-11): 1,310 impressions, 0 clicks, avg position 47.
// Head terms "fedramp conmon tools / fedramp conmon / fedramp conmon platform" sit at
// positions 18-25; question queries ("what is conmon in fedramp?") already rank 3-4.
// This route composes the industry sections itself so it can add a direct answer and a
// deliverables table near the top (the shared template has no slot for them).
//
// FedRAMP facts on this page come only from fedramp.gov:
//   https://fedramp.gov/legacy/playbook/csp/continuous-monitoring/overview/
//   https://fedramp.gov/legacy/playbook/csp/continuous-monitoring/vulnerability-scanning/
//   https://www.fedramp.gov/resources/documents/Continuous_Monitoring_Playbook.pdf
// and NIST SP 800-137. Onam claims are the ones already on this page (governmentData).
// Onam is never described as FedRAMP authorized or as producing an authorization.

const TITLE = "FedRAMP ConMon Tools: Continuous Monitoring Evidence | Onam";
const DESCRIPTION =
  "FedRAMP ConMon tools for the cloud-configuration part: NIST 800-53 Rev 5 and FedRAMP Moderate/High evidence each scan, and what Onam does not do.";

const DIRECT_ANSWER =
  "FedRAMP continuous monitoring (ConMon) is the work a cloud service provider does after authorization to show its controls still hold. Each month it uploads an updated POA&M and inventory and scans its inventory for vulnerabilities. An independent assessor performs an annual assessment, and significant changes go to the agency Authorizing Official for approval.";

type DeliverableRow = { deliverable: string; fedramp: string; onam: string; notOnam: string };

const DELIVERABLES: DeliverableRow[] = [
  {
    deliverable: "Monthly vulnerability scans",
    fedramp: "At least monthly scans of all inventory components: operating systems, web interfaces, databases and containers.",
    onam: "Cloud-configuration findings re-checked on every scan, mapped to NIST 800-53 Rev 5 controls; vulnerability findings carry EPSS and KEV context.",
    notOnam: "Does not replace the authenticated operating-system, database and web-application scans your authorization specifies, or the raw scanner files an agency may ask for.",
  },
  {
    deliverable: "POA&M (monthly)",
    fedramp: "An up-to-date POA&M uploaded each month, with each unique vulnerability tracked as its own item.",
    onam: "Each failing control lists the resources that fail it, with severity and remediation guidance, exportable as PDF, CSV, Excel or JSON.",
    notOnam: "Does not generate or maintain your POA&M; your team tracks the items and their deadlines there.",
  },
  {
    deliverable: "System inventory (monthly)",
    fedramp: "An up-to-date inventory of the components inside the authorization boundary, uploaded each month.",
    onam: "Discovers the resources in each connected account on every scan, so a new asset shows up with its findings.",
    notOnam: "Does not fill in the FedRAMP Integrated Inventory Workbook; your team maps the discovered resources into it.",
  },
  {
    deliverable: "Deviation requests",
    fedramp: "Reviewed and approved by the agency Authorizing Official.",
    onam: "Records an exception or compensating control with its justification, approver and target date, and flags it as the date nears.",
    notOnam: "Does not write or submit the deviation request.",
  },
  {
    deliverable: "Significant change requests",
    fedramp: "A security impact analysis before the change, and approval by the Authorizing Official.",
    onam: "The next scan re-checks the affected accounts against the same mapped controls; the score and trend per framework show status before and after.",
    notOnam: "Does not write the significant change request or its security impact analysis.",
  },
  {
    deliverable: "Annual assessment",
    fedramp: "Performed by an independent assessor (3PAO).",
    onam: "Per-control evidence (resources evaluated, results, timestamps) for automated cloud-configuration controls; process controls marked for manual review.",
    notOnam: "Onam is not a 3PAO. It does not perform the annual assessment or penetration test.",
  },
  {
    deliverable: "Monthly upload to the secure repository",
    fedramp: "The CSP uploads the monthly deliverables for its agency customers.",
    onam: "Exports (PDF, CSV, Excel or JSON) your team assembles into the monthly package.",
    notOnam: "Does not upload or submit ConMon deliverables for you.",
  },
  {
    deliverable: "FedRAMP 20x",
    fedramp: "FedRAMP's newer authorization approach, with its own Key Security Indicators.",
    onam: "Control status re-checked on every scan and exported as JSON: machine-readable evidence.",
    notOnam: "Does not map the 20x Key Security Indicators today, and its export is not a 20x submission.",
  },
  {
    deliverable: "The authorization itself",
    fedramp: "Granted by an agency Authorizing Official, based on the assessed package.",
    onam: "Nothing. Mapping the FedRAMP baselines is not an authorization.",
    notOnam: "Does not produce or grant an authorization, and this page claims no FedRAMP authorization for Onam.",
  },
];

const EXTRA_FAQS: IndustryFaq[] = [
  {
    q: "What is ConMon (continuous monitoring) in FedRAMP?",
    a: DIRECT_ANSWER + " FedRAMP bases ConMon on the continuous monitoring process in NIST SP 800-137.",
  },
  {
    q: "What are the monthly FedRAMP ConMon deliverables?",
    a: "Each month the cloud service provider uploads an updated POA&M and an updated inventory, and scans all inventory components (operating systems, web interfaces, databases and containers). Raw scan files go up when an agency agreement asks for them. Deviation requests and significant change requests are raised as needed. The annual assessment is done by a 3PAO.",
  },
  {
    q: "Which cloud security tool generates FedRAMP continuous monitoring evidence?",
    a: "Usually no single tool covers it all: teams combine vulnerability scanners, an inventory, a POA&M tracker and a GRC workspace. Onam covers the cloud-configuration part: findings mapped to NIST 800-53 Rev 5 and the FedRAMP Moderate and High baselines, re-checked on every scan, with per-control evidence exported as PDF, CSV, Excel or JSON.",
  },
  {
    q: "Which evidence collection platforms suit FedRAMP and CUI-handling contractors?",
    a: "Look for one that maps the frameworks you answer to, keeps evidence per control with timestamps, and is honest about the controls it cannot prove from a cloud API. Onam maps FedRAMP Moderate and High, NIST 800-53 Rev 5 and NIST 800-171 (for contractors handling CUI) to cloud checks, and marks process controls for manual review.",
  },
  {
    q: "Does Onam replace our 3PAO or submit our ConMon deliverables?",
    a: "No. Onam is not a 3PAO and does not perform the annual assessment. It does not write or upload the POA&M, inventory workbook, deviation requests or significant change requests. It gives your team the cloud-configuration findings and evidence that go into them.",
  },
];

const FAQS: IndustryFaq[] = [
  ...EXTRA_FAQS,
  // The original deliverables question is now answered by the table and the new FAQs above.
  ...governmentData.faqs.filter((f) => f.q !== "Which FedRAMP continuous monitoring deliverables does Onam help with?"),
];

export const Route = createFileRoute("/solutions/government")({
  head: () =>
    seo({
      title: TITLE,
      description: DESCRIPTION,
      path: "/solutions/government",
    }),
  component: GovernmentPage,
});

const eyebrow = "inline-flex items-center gap-2 text-sm font-semibold text-[#1D4ED8]";
const h2 = "mt-4 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight";
const card = "bg-white border border-[#E5E9F0] rounded-2xl p-6 shadow-[0_1px_2px_rgba(16,24,40,.04),0_1px_3px_rgba(16,24,40,.06)]";

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[#E5E9F0] bg-white">
      <Backdrop tone="light" color="#4F46E5" pattern="rings" icon={Building2} />
      <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24 text-center">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#64748B]">{governmentData.breadcrumb}</div>
        <h1 className="mt-5 font-display font-black text-[#0B1220] text-4xl md:text-5xl lg:text-[56px] tracking-tight leading-[1.05]">
          FedRAMP ConMon tools: continuous monitoring evidence, re-checked on every scan
        </h1>
        <p className="mt-6 text-lg text-[#475569] max-w-3xl mx-auto leading-relaxed">
          Onam covers the cloud-configuration part of FedRAMP continuous monitoring: findings mapped to NIST 800-53
          Rev 5, NIST 800-171 and the FedRAMP Moderate and High baselines, re-checked on every scan across the cloud
          accounts in your boundary, with evidence your team exports into the monthly package.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <BrandButton to="/request-demo" size="lg">Book a live demo <ArrowRight className="w-4 h-4" /></BrandButton>
          <BrandButton href="#conmon-deliverables" size="lg" variant="secondary">See what Onam does and does not do</BrandButton>
        </div>
      </div>
    </section>
  );
}

function DirectAnswer() {
  return (
    <section className="bg-white border-b border-[#E5E9F0] py-16">
      <div className="max-w-3xl mx-auto px-6">
        <div className={eyebrow}>The short answer</div>
        <h2 className={h2}>What is FedRAMP ConMon (continuous monitoring)?</h2>
        <p className="mt-5 text-lg text-[#334155] leading-relaxed">{DIRECT_ANSWER}</p>
        <p className="mt-4 text-sm text-[#64748B] leading-relaxed">
          Sources: the{" "}
          <a className="underline" href="https://www.fedramp.gov/resources/documents/Continuous_Monitoring_Playbook.pdf" rel="noopener" target="_blank">
            FedRAMP Continuous Monitoring Playbook
          </a>{" "}
          and{" "}
          <a className="underline" href="https://csrc.nist.gov/pubs/sp/800/137/final" rel="noopener" target="_blank">
            NIST SP 800-137
          </a>
          , which FedRAMP ConMon is based on. FedRAMP is moving to new rules, so check fedramp.gov for the current
          requirements of your authorization.
        </p>
      </div>
    </section>
  );
}

function StatStrip() {
  return (
    <section className="bg-white border-b border-[#E5E9F0]">
      <div className="max-w-7xl mx-auto px-6 py-10 grid divide-x divide-[#E5E9F0] grid-cols-2 md:grid-cols-4">
        {governmentData.stats.map((s, i) => (
          <div key={i} className="px-6 first:pl-0 last:pr-0 text-center md:text-left">
            <div className="text-2xl md:text-3xl font-display font-black text-[#0B1220]">{s.value}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-[#64748B] font-semibold">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DeliverablesTable() {
  return (
    <section id="conmon-deliverables" className="bg-[#F7F9FC] border-b border-[#E5E9F0] py-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <div className={eyebrow}>ConMon deliverables</div>
          <h2 className={h2}>FedRAMP ConMon deliverables: what Onam provides and what it does not</h2>
          <p className="mt-4 text-[#475569] leading-relaxed">
            Onam is one tool in a ConMon stack, not the whole stack. This is where it helps, deliverable by
            deliverable, and where your team, your scanners and your 3PAO still do the work.
          </p>
        </div>
        <div className="mt-10 overflow-x-auto rounded-2xl border border-[#E5E9F0] bg-white">
          <table className="w-full min-w-[760px] text-sm text-left">
            <thead className="bg-[#F1F5F9] text-[#0B1220]">
              <tr>
                <th scope="col" className="px-4 py-3 font-display font-bold">Deliverable</th>
                <th scope="col" className="px-4 py-3 font-display font-bold">What FedRAMP asks</th>
                <th scope="col" className="px-4 py-3 font-display font-bold">What Onam provides</th>
                <th scope="col" className="px-4 py-3 font-display font-bold">What Onam does not do</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E9F0] text-[#475569] align-top">
              {DELIVERABLES.map((r) => (
                <tr key={r.deliverable}>
                  <th scope="row" className="px-4 py-4 font-semibold text-[#0B1220]">{r.deliverable}</th>
                  <td className="px-4 py-4 leading-relaxed">{r.fedramp}</td>
                  <td className="px-4 py-4 leading-relaxed">{r.onam}</td>
                  <td className="px-4 py-4 leading-relaxed">{r.notOnam}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function UseCases() {
  return (
    <section className="bg-white border-b border-[#E5E9F0] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <div className={eyebrow}>Use cases</div>
          <h2 className={h2}>How Onam fits each FedRAMP continuous monitoring activity</h2>
        </div>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {governmentData.useCases.map((u) => {
            const Icon = u.icon;
            return (
              <div key={u.title} className={card}>
                <div
                  className="w-12 h-12 rounded-xl grid place-items-center"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${u.iconColor} 12%, #FFFFFF)`,
                    boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${u.iconColor} 22%, transparent)`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: u.iconColor }} />
                </div>
                <h3 className="mt-5 font-display font-bold text-[#0B1220] text-lg">{u.title}</h3>
                <p className="mt-2 text-sm text-[#475569] leading-relaxed">{u.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Regulations() {
  return (
    <section className="bg-[#F8FAFC] border-b border-[#E5E9F0] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <div className={eyebrow}>Compliance</div>
          <h2 className={h2}>Frameworks mapped: NIST 800-53 Rev 5, FedRAMP Moderate and High, NIST 800-171</h2>
        </div>
        <div className="mt-10 grid md:grid-cols-2 gap-4">
          {governmentData.regulations.map((r) => (
            <div key={r.name} className="border border-[#E5E9F0] rounded-xl p-5 bg-white">
              <h3 className="font-display font-bold text-[#0B1220]">{r.name}</h3>
              <p className="mt-1.5 text-sm text-[#475569] leading-relaxed">{r.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChoose() {
  return (
    <section className="bg-white border-b border-[#E5E9F0] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <div className={eyebrow}>Why Onam</div>
          <h2 className={h2}>What Onam brings to a FedRAMP ConMon platform stack</h2>
        </div>
        <div className="mt-12 grid md:grid-cols-2 gap-4">
          {governmentData.whyChoose.map((f) => (
            <div key={f.title} className="bg-white border border-[#E5E9F0] rounded-2xl p-6 flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-[#EFF4FF] grid place-items-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <h3 className="font-display font-bold text-[#0B1220]">{f.title}</h3>
                <p className="mt-1.5 text-sm text-[#475569] leading-relaxed">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faqs() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-white border-b border-[#E5E9F0] py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center">
          <div className={eyebrow}>FAQ</div>
          <h2 className={h2}>FedRAMP ConMon questions</h2>
        </div>
        <div className="mt-10 space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="bg-white border border-[#E5E9F0] rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-[#F8FAFC] transition"
                >
                  <span className="font-display font-semibold text-[#0B1220]">{f.q}</span>
                  <span
                    className={cn(
                      "shrink-0 w-7 h-7 rounded-full grid place-items-center border border-[#E5E9F0] text-[#475569] transition-transform",
                      isOpen && "rotate-45 border-[#2563EB] text-[#2563EB] bg-[#EFF4FF]",
                    )}
                  >
                    +
                  </span>
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

function CTA() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="rounded-3xl border border-[#DBE7FE] bg-gradient-to-br from-[#EFF4FF] to-white p-10 md:p-14 text-center">
          <div className="inline-flex w-12 h-12 rounded-xl bg-[#2563EB] text-white items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="mt-5 font-display font-black text-[#0B1220] text-3xl md:text-4xl tracking-tight">
            See Onam on your government cloud
          </h2>
          <p className="mt-4 text-[#475569] max-w-xl mx-auto">
            Security evidence mapped to your frameworks, one inventory of what you run, cost you can attribute, and a
            recovery plan you can check, all in one platform.
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

function GovernmentPage() {
  return (
    <SiteLayout>
      <Hero />
      <DirectAnswer />
      <StatStrip />
      <DeliverablesTable />
      <UseCases />
      <Regulations />
      <WhyChoose />
      <AcrossThePlatform
        title="One platform for government teams"
        lead="Security evidence is covered in detail above. Inventory, cost and recovery work from the same discovery, so your cloud accounts are connected once."
        notes={{ ...industryPlatformNotes(governmentData.industryName), ...governmentData.platform }}
      />
      <ProductDemo
        compact
        tone="white"
        clips={["compliance", "risk", "datasec"]}
        eyebrow="See it live"
        title="Evidence, in the Onam Security console."
        gradientWords="Onam Security console."
        subtitle="An animated walkthrough of Onam console views with demo-account data: compliance scores, FAIR-style risk estimates and data classification."
      />
      <Faqs />
      <CTA />
    </SiteLayout>
  );
}
