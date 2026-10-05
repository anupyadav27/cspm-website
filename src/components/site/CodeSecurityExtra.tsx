import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bug,
  Boxes,
  FileCode2,
  KeyRound,
  Radar,
  Wand2,
  Check,
  Minus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const DOCS_OVERVIEW: string = "/docs/code-security/overview";

type Figure = { src: string; alt: string; caption: string };

function Eyebrow({ children }: { children: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
      {children}
    </div>
  );
}

function DiagramFigure({ fig }: { fig: Figure }) {
  return (
    <figure className="bg-white border border-[#E5E9F0] rounded-2xl p-3 md:p-4 shadow-[0_1px_2px_rgba(16,24,40,.04)]">
      <img src={fig.src} alt={fig.alt} loading="lazy" className="w-full h-auto rounded-lg" />
      <figcaption className="mt-3 text-sm text-[#64748B] text-center">{fig.caption}</figcaption>
    </figure>
  );
}

type ScannerCard = { icon: LucideIcon; title: string; body: string; href: string; cta: string };

const scanners: ScannerCard[] = [
  {
    icon: Bug,
    title: "Static analysis (SAST)",
    body: "Community packs, curated taint rules and reviewed pattern rules. Proven flaws and hotspots in separate lists.",
    href: "/platform/code-security/sast",
    cta: "How SAST works",
  },
  {
    icon: KeyRound,
    title: "Secret detection",
    body: "Cloud keys, private keys, SaaS tokens and hard-coded credentials, found in the same pass as SAST.",
    href: "/platform/code-security/sast",
    cta: "Secrets on the SAST page",
  },
  {
    icon: Boxes,
    title: "Dependencies and SBOM (SCA)",
    body: "Lockfiles parsed natively, OSV and NVD matching, EPSS and KEV risk scoring, CycloneDX 1.5 SBOM.",
    href: "/platform/code-security/sca-sbom",
    cta: "How SCA works",
  },
  {
    icon: FileCode2,
    title: "IaC and Dockerfiles",
    body: "Terraform, Kubernetes YAML, CloudFormation and Dockerfiles in the repository are checked in the same scan.",
    href: "/docs/code-security/iac",
    cta: "IaC in the docs",
  },
  {
    icon: Radar,
    title: "Dynamic testing (DAST)",
    body: "Endpoint discovery and rate-limited test payloads against a running app or API you are authorised to test.",
    href: "/platform/code-security/dast",
    cta: "How DAST works",
  },
  {
    icon: Wand2,
    title: "AI Code Fix",
    body: "Corrected source files on a separate branch for your review. Nothing merges or deploys itself.",
    href: "/platform/ai-code-fix",
    cta: "How AI Code Fix works",
  },
];

const joinedToday = [
  "Code findings sit in the same platform, under the same login and roles, as your cloud findings",
  "SAST and DAST results feed the AppSec pillar of the CNAPP posture score",
  "Dependency advisories come from the same OSV and NVD store the vulnerability engine uses",
  "Static-analysis findings also appear in the platform-wide findings store, tagged as code",
];

const notYet = [
  "Linking a code finding to the container image or workload built from that repository",
  "Reachability — whether the vulnerable function in a dependency is actually called",
  "Tracing a runtime misconfiguration back to the template line that created it",
];

/** Extra sections for /platform/code-security. */
export function CodeSecurityOverviewExtra() {
  return (
    <>
      <section id="pipeline" className="py-24 border-b border-[#E5E9F0] bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Eyebrow>From repository to reviewed fix</Eyebrow>
            <h2 className="mt-5 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
              One scan, five scanners,{" "}
              <span className="gradient-text">one place to read the result</span>
            </h2>
            <p className="mt-4 text-[#475569] leading-relaxed">
              Static analysis, dependency analysis and IaC checks run together on every repository
              scan. Dynamic testing joins in when you give it a URL. Fixes come back as a branch,
              never as a merge.
            </p>
          </div>
          <div className="mt-12">
            <DiagramFigure
              fig={{
                src: "/diagrams/code-sec-pipeline.svg",
                alt: "Repository and optional target URL feed one scan job running SAST and secrets, SCA and SBOM, IaC and Dockerfile checks, and DAST; results are triaged into security issues, hotspots, dependency risk and runtime findings, then shown in the console, the posture score, an AI fix prompt and AI Code Fix branches",
                caption:
                  "How a code scan flows. Each scan is an isolated job; the clone is deleted when it ends.",
              }}
            />
          </div>
        </div>
      </section>

      <section id="scanners" className="py-24 border-b border-[#E5E9F0] bg-[#F7F9FC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Eyebrow>What each scanner does</Eyebrow>
            <h2 className="mt-5 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
              Pick a scanner to see <span className="gradient-text">how it really works</span>
            </h2>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scanners.map((s) => (
              <Link
                key={s.title}
                to={s.href}
                className="group bg-white border border-[#E5E9F0] rounded-2xl p-6 shadow-[0_1px_2px_rgba(16,24,40,.04)] hover:shadow-[0_12px_28px_rgba(16,24,40,.10)] hover:-translate-y-0.5 transition-all flex flex-col"
              >
                <div className="w-10 h-10 rounded-xl grid place-items-center bg-[#EFF4FF]">
                  <s.icon className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div className="mt-4 font-display font-bold text-[#0B1220] text-lg">{s.title}</div>
                <p className="mt-2 text-sm text-[#475569] leading-relaxed flex-1">{s.body}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB]">
                  {s.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="in-the-console" className="py-24 border-b border-[#E5E9F0] bg-white">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[1fr_1.4fr] gap-10 items-center">
          <div>
            <Eyebrow>In the console</Eyebrow>
            <h2 className="mt-5 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
              The proven findings come first
            </h2>
            <p className="mt-4 text-[#475569] leading-relaxed">
              A scan result opens on four numbers — total findings, security issues, hotspots to
              review and the languages found — then the security issues table, with file and line
              for each. Hotspots have their own panel. Every finding opens to the rule's guidance
              and an AI fix prompt you can copy.
            </p>
            <p className="mt-4 text-[#475569] leading-relaxed">
              Around it: a projects view with a risk score per repository, an alerts list across
              SAST, DAST and SCA, scan history, and trend reports you can export as CSV or PDF.
            </p>
          </div>
          <DiagramFigure
            fig={{
              src: "/diagrams/ui-code-sec-scan-detail.svg",
              alt: "Illustrative layout of a scan result: summary tiles for total findings, security issues, hotspots and languages, a security findings table, and a finding detail with a copyable AI fix prompt",
              caption:
                "Illustrative — a stylised view of the layout, not a screenshot. Repository names and findings are invented.",
            }}
          />
        </div>
      </section>

      <section id="code-and-cloud" className="py-24 border-b border-[#E5E9F0] bg-[#F7F9FC]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Eyebrow>Code and cloud</Eyebrow>
            <h2 className="mt-5 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
              What is joined today, <span className="gradient-text">and what is not yet</span>
            </h2>
            <p className="mt-4 text-[#475569] leading-relaxed">
              Code security lives in the same platform as Onam's cloud posture, identity and data
              engines. Here is exactly how far that connection goes today.
            </p>
          </div>
          <div className="mt-12 grid md:grid-cols-2 gap-5">
            <div className="bg-white border border-[#E5E9F0] rounded-2xl p-6">
              <div className="font-display font-bold text-[#0B1220] text-lg">Joined today</div>
              <ul className="mt-4 space-y-3">
                {joinedToday.map((t) => (
                  <li key={t} className="flex gap-3 text-sm text-[#334155] leading-relaxed">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#059669]" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-[#E5E9F0] rounded-2xl p-6">
              <div className="font-display font-bold text-[#0B1220] text-lg">Not yet</div>
              <ul className="mt-4 space-y-3">
                {notYet.map((t) => (
                  <li key={t} className="flex gap-3 text-sm text-[#334155] leading-relaxed">
                    <Minus className="w-4 h-4 mt-0.5 shrink-0 text-[#94A3B8]" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-[#64748B]">
            Full detail is in the{" "}
            <Link to={DOCS_OVERVIEW} className="text-[#2563EB] underline">
              Code Security documentation
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}

/** Extra sections for a scanner sub-page: its diagram, an optional illustration, and onward links. */
export function CodeSecuritySubPageExtra({
  diagram,
  illustration,
  docsHref,
  label,
}: {
  diagram: Figure;
  illustration?: Figure;
  docsHref: string;
  label: string;
}) {
  return (
    <section id="diagram" className="py-24 border-b border-[#E5E9F0] bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Eyebrow>The flow, in one picture</Eyebrow>
          <h2 className="mt-5 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
            How {label} <span className="gradient-text">fits together</span>
          </h2>
        </div>
        <div className="mt-12 space-y-8">
          <DiagramFigure fig={diagram} />
          {illustration && <DiagramFigure fig={illustration} />}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3 text-sm">
          <Link
            to={docsHref}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#DBE7FE] bg-[#EFF4FF] font-semibold text-[#1D4ED8] hover:bg-[#DBE7FE] transition"
          >
            Read the docs <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/platform/code-security"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#E5E9F0] bg-white font-semibold text-[#0B1220] hover:border-[#2563EB] transition"
          >
            All of Code Security <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
