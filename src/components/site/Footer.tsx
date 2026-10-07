import { Link } from "@tanstack/react-router";
import { MarketplaceLine } from "@/components/site/MarketplaceStrip";
import { Logo } from "./Logo";
import { Youtube, Twitter, Linkedin, Github, type LucideIcon } from "lucide-react";

/** Official brand profiles. Mirrored in the Organization `sameAs` array. */
const SOCIALS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Onam Security on LinkedIn", href: "https://www.linkedin.com/company/onamsecurity/", icon: Linkedin },
  { label: "Onam Security on GitHub", href: "https://github.com/onamsecurity", icon: Github },
  { label: "Onam Security on YouTube", href: "https://www.youtube.com/@Onamsecurity", icon: Youtube },
  { label: "Onam Security on X", href: "https://x.com/onamsecurity", icon: Twitter },
];

type FootLink = { label: string; to?: string; href?: string };
type Col = { title: string; to?: string; badge?: string; links: FootLink[] };

/** One column per product, in lifecycle order. The column title links to the product page. */
const productCols: Col[] = [
  {
    title: "Onam Estate",
    to: "/estate",
    links: [
      { label: "Inventory", to: "/estate/inventory" },
      { label: "Architecture", to: "/estate/architecture" },
      { label: "Discovery pipeline", to: "/estate/discovery" },
      { label: "Estate docs", to: "/docs/estate/overview" },
    ],
  },
  {
    title: "Onam Security",
    to: "/platform",
    links: [
      { label: "CNAPP", to: "/platform/cnapp" },
      { label: "CSPM", to: "/platform/cspm" },
      { label: "CIEM", to: "/platform/ciem" },
      { label: "DSPM — Data Security", to: "/platform/data-security" },
      { label: "CWPP — Workloads", to: "/platform/cwpp" },
      { label: "Attack Path", to: "/platform/attack-path" },
      { label: "Code Security", to: "/platform/code-security" },
      { label: "Compliance", to: "/platform/compliance" },
      { label: "All security engines →", to: "/platform" },
    ],
  },
  {
    title: "Onam FinOps",
    to: "/finops",
    links: [
      { label: "Cost explorer", to: "/finops/explore" },
      { label: "Ownership", to: "/finops/ownership" },
      { label: "Forecast & budgets", to: "/finops/plan" },
      { label: "Savings", to: "/finops/savings" },
      { label: "FinOps docs", to: "/docs/finops/overview" },
    ],
  },
  {
    title: "Onam DRM",
    to: "/disaster-recovery",
    links: [
      { label: "Applications", to: "/disaster-recovery/applications" },
      { label: "Protection", to: "/disaster-recovery/protection" },
      { label: "Recovery plans", to: "/disaster-recovery/recovery-plans" },
      { label: "RTO, RPO & drills", to: "/disaster-recovery/objectives" },
      { label: "Baselines & drift", to: "/disaster-recovery/drift" },
      { label: "DRM docs", to: "/docs/drm/overview" },
    ],
  },
  {
    title: "Onam AIOps",
    to: "/platform/ai-operations",
    badge: "Early access",
    links: [
      { label: "Agents", to: "/docs/operations/agents" },
      { label: "Approvals & governance", to: "/docs/operations/governance" },
      { label: "Security & AI safety", to: "/docs/operations/security" },
      { label: "What's available today", to: "/docs/operations/availability" },
      { label: "Architecture", to: "/platform/ai-operations/architecture" },
    ],
  },
];

const siteCols: Col[] = [
  {
    title: "By cloud",
    links: [
      { label: "AWS", to: "/solutions/aws" },
      { label: "Azure", to: "/solutions/azure" },
      { label: "Google Cloud", to: "/solutions/gcp" },
      { label: "Oracle Cloud", to: "/solutions/oci" },
      { label: "Alibaba Cloud", to: "/solutions/alicloud" },
      { label: "IBM Cloud", to: "/solutions/ibm" },
      { label: "Kubernetes", to: "/solutions/kubernetes" },
    ],
  },
  {
    title: "By industry",
    links: [
      { label: "Financial services", to: "/solutions/financial" },
      { label: "Healthcare", to: "/solutions/healthcare" },
      { label: "Government", to: "/solutions/government" },
      { label: "All solutions", to: "/solutions" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", to: "/docs" },
      { label: "Learn — glossary", to: "/learn" },
      { label: "Blog", to: "/resources/blog" },
      { label: "All resources", to: "/resources" },
      { label: "Compare", to: "/compare" },
      { label: "Release notes", to: "/docs/release-notes" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/company/about" },
      { label: "Careers", to: "/company/careers" },
      { label: "Contact", to: "/company/contact" },
      { label: "Pricing", to: "/pricing" },
      { label: "Trust Center", to: "/trust" },
      { label: "Privacy", to: "/company/privacy" },
      { label: "Terms", to: "/company/terms" },
    ],
  },
];

const linkCls = "text-sm text-[#475569] hover:text-[#2563EB] transition";

function FooterCol({ c }: { c: Col }) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1">
        {c.to ? (
          <Link
            to={c.to}
            className="text-xs uppercase tracking-widest font-semibold text-[#0B1220] hover:text-[#2563EB] transition"
          >
            {c.title}
          </Link>
        ) : (
          <div className="text-xs uppercase tracking-widest font-semibold text-[#0B1220]">{c.title}</div>
        )}
        {c.badge && (
          <span className="rounded-full border border-[#C7D7FE] bg-[#EFF4FF] px-1.5 py-0.5 text-[11px] font-semibold text-[#1D4ED8]">
            {c.badge}
          </span>
        )}
      </div>
      <ul className="space-y-2.5">
        {c.links.map((l) => (
          <li key={l.label}>
            {l.to ? (
              <Link to={l.to} className={linkCls}>
                {l.label}
              </Link>
            ) : (
              <a href={l.href} className={linkCls}>
                {l.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[#E5E9F0] bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <nav aria-label="Products" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-6">
          {productCols.map((c) => (
            <FooterCol key={c.title} c={c} />
          ))}
        </nav>
        <nav
          aria-label="Site"
          className="mt-12 pt-10 border-t border-[#E5E9F0] grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-6"
        >
          {siteCols.map((c) => (
            <FooterCol key={c.title} c={c} />
          ))}
        </nav>

        <MarketplaceLine className="mt-12" />
        <div className="mt-6 pt-8 border-t border-[#E5E9F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-6">
            <Logo />
            <span className="text-xs text-[#64748B]">© 2026 Onam Security, Inc.</span>
            {/* Keep in sync with the Organization `sameAs` array in __root.tsx. */}
            <div className="flex items-center gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="w-8 h-8 grid place-items-center rounded-md border border-[#E5E9F0] bg-white text-[#64748B] hover:text-[#2563EB] hover:border-[#CBD5E1] transition"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
