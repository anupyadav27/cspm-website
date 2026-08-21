import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { ShieldCheck, Award, Youtube, Twitter, Linkedin, Github, type LucideIcon } from "lucide-react";

/** Official brand profiles. Mirrored in the Organization `sameAs` array. */
const SOCIALS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Onam Security on LinkedIn", href: "https://www.linkedin.com/company/onamsecurity/", icon: Linkedin },
  { label: "Onam Security on GitHub", href: "https://github.com/onamsecurity", icon: Github },
  { label: "Onam Security on YouTube", href: "https://www.youtube.com/@Onamsecurity", icon: Youtube },
  { label: "Onam Security on X", href: "https://x.com/onamsecurity", icon: Twitter },
];

type Col = { title: string; links: { label: string; to?: string; href?: string }[] };

const cols: Col[] = [
  {
    title: "Platform",
    links: [
      { label: "CNAPP", to: "/platform/cnapp" },
      { label: "CSPM", to: "/platform/cspm" },
      { label: "CIEM", to: "/platform/ciem" },
      { label: "IAM Security", to: "/platform/iam" },
      { label: "Asset Inventory", to: "/platform/inventory" },
      { label: "Attack Path", to: "/platform/attack-path" },
      { label: "CDR", to: "/platform/cdr" },
      { label: "Threat Detection", to: "/platform/threat-detection" },
      { label: "Risk Quantification", to: "/platform/risk" },
      { label: "Compliance", to: "/platform/compliance" },
      { label: "Technology Engine", to: "/platform/technology" },
      { label: "AI Assistant", to: "/platform/ai-assistant" },
    ],
  },
  {
    title: "Workloads & data",
    links: [
      { label: "CWPP — Workloads", to: "/platform/cwpp" },
      { label: "Agentless Scanning", to: "/platform/agentless" },
      { label: "Container Security", to: "/platform/container-security" },
      { label: "Vulnerability Mgmt", to: "/platform/vulnerability" },
      { label: "Code Security", to: "/platform/secops" },
      { label: "DSPM — Data Security", to: "/platform/data-security" },
      { label: "Database Security", to: "/platform/database-security" },
      { label: "Encryption & Keys", to: "/platform/encryption" },
      { label: "Network Security", to: "/platform/network-security" },
      { label: "API Security", to: "/platform/api-security" },
      { label: "SaaS Security (SSPM)", to: "/platform/saas-security" },
      { label: "AI Security", to: "/platform/ai-security" },
      { label: "Remediation", to: "/platform/remediation" },
    ],
  },
  {
    title: "By cloud",
    links: [
      { label: "AWS", to: "/solutions/aws" },
      { label: "Azure", to: "/solutions/azure" },
      { label: "Google Cloud", to: "/solutions/gcp" },
      { label: "Oracle Cloud", to: "/solutions/oci" },
      { label: "Alibaba Cloud", to: "/solutions/alicloud" },
      { label: "Kubernetes", to: "/solutions/kubernetes" },
    ],
  },
  {
    title: "By industry",
    links: [
      { label: "Financial Services", to: "/solutions/financial" },
      { label: "Healthcare", to: "/solutions/healthcare" },
      { label: "Government", to: "/solutions/government" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", to: "/docs" },
      { label: "Blog", to: "/resources/blog" },
      { label: "All Resources", to: "/resources" },
      { label: "What is CSPM?", to: "/learn/cspm" },
      { label: "What is CNAPP?", to: "/learn/cnapp" },
      { label: "What is CWPP?", to: "/learn/cwpp" },
      { label: "What is DSPM?", to: "/learn/dspm" },
      { label: "Cloud attack paths", to: "/learn/cloud-attack-path" },
      { label: "Glossary", to: "/learn" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/company/about" },
      { label: "Careers", to: "/company/careers" },
      { label: "Contact", to: "/company/contact" },
      { label: "Security", to: "/company/security" },
      { label: "Pricing", to: "/pricing" },
      { label: "Privacy", to: "/company/privacy" },
      { label: "Terms", to: "/company/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[#E5E9F0] bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 lg:gap-8">
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-[11px] uppercase tracking-widest font-semibold text-[#0B1220] mb-4">
                {c.title}
              </div>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    {l.to ? (
                      <Link to={l.to} className="text-sm text-[#475569] hover:text-[#2563EB] transition">
                        {l.label}
                      </Link>
                    ) : (
                      <a href={l.href} className="text-sm text-[#475569] hover:text-[#2563EB] transition">
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-[#E5E9F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
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
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#E5E9F0] bg-white">
              <ShieldCheck className="w-3.5 h-3.5 text-[#05A052]" />
              <span className="text-xs font-medium text-[#0B1220]">SOC 2 Type II</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#E5E9F0] bg-white">
              <Award className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="text-xs font-medium text-[#0B1220]">ISO 27001</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
