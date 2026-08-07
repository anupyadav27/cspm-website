import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { SERVICES, FRAMEWORKS } from "@/lib/product-facts";

export { Logo } from "./Logo";

type MenuItem = { title: string; href: string; desc: string };

const platformGroups: { heading: string; items: MenuItem[] }[] = [
  {
    heading: "Posture & Identity",
    items: [
      { title: "CNAPP", href: "/platform/cnapp", desc: "Seven pillars, one posture score" },
      { title: "CSPM", href: "/platform/cspm", desc: "Misconfigurations across all clouds" },
      { title: "CIEM", href: "/platform/ciem", desc: "Identity & entitlement analysis" },
      { title: "IAM Security", href: "/platform/iam", desc: "Policies, users, and privilege risk" },
      { title: "Asset Inventory", href: "/platform/inventory", desc: `${SERVICES} services, seven clouds, one list` },
    ],
  },
  {
    heading: "Threat & Attack",
    items: [
      { title: "Attack Path", href: "/platform/attack-path", desc: "Crown jewels, toxic combos, attack graphs" },
      { title: "CDR — Detection", href: "/platform/cdr", desc: "L1/L2/L3 behavioral threat detection" },
      { title: "Threat Detection", href: "/platform/threat-detection", desc: "MITRE ATT&CK–mapped attack chains" },
      { title: "Risk Quantification", href: "/platform/risk", desc: "FAIR model — dollar-value exposure" },
    ],
  },
  {
    heading: "Data & Network",
    items: [
      { title: "DSPM — Data Security", href: "/platform/data-security", desc: "Where your sensitive data lives" },
      { title: "Database Security", href: "/platform/database-security", desc: "Managed DBs + CIS engine benchmarks" },
      { title: "Encryption & Keys", href: "/platform/encryption", desc: "KMS, rotation, and the decrypt set" },
      { title: "Network Security", href: "/platform/network-security", desc: "7-layer topology analysis" },
      { title: "API Security", href: "/platform/api-security", desc: "Shadow APIs, auth gaps, WAF coverage" },
    ],
  },
  {
    heading: "Workloads & Code",
    items: [
      { title: "CWPP — Workloads", href: "/platform/cwpp", desc: "VMs, containers, serverless, hosts" },
      { title: "Agentless Scanning", href: "/platform/agentless", desc: "Snapshot-based — nothing to install" },
      { title: "Container Security", href: "/platform/container-security", desc: "EKS, ECS, and image scanning" },
      { title: "Vulnerability Mgmt", href: "/platform/vulnerability", desc: "CVEs in context, not just CVSS" },
      { title: "Code Security", href: "/platform/secops", desc: "SAST, DAST, SCA, IaC" },
    ],
  },
  {
    heading: "SaaS, AI & Governance",
    items: [
      { title: "SaaS Security (SSPM)", href: "/platform/saas-security", desc: "M365, Workspace, GitHub, Snowflake" },
      { title: "AI Security", href: "/platform/ai-security", desc: "SageMaker, Bedrock, and AI/ML risk" },
      { title: "AI Assistant", href: "/platform/ai-assistant", desc: "Ask your posture in plain language" },
      { title: "Remediation", href: "/platform/remediation", desc: "Every finding ships with its fix" },
      { title: "Compliance", href: "/platform/compliance", desc: `${FRAMEWORKS} frameworks, always audit-ready` },
      { title: "Technology Engine", href: "/platform/technology", desc: "34 technologies, runtime discovery" },
    ],
  },
];

const solutionsClouds: MenuItem[] = [
  { title: "AWS", href: "/solutions/aws", desc: "Amazon Web Services" },
  { title: "Azure", href: "/solutions/azure", desc: "Microsoft Azure" },
  { title: "Google Cloud", href: "/solutions/gcp", desc: "GCP posture & threats" },
  { title: "Oracle Cloud (OCI)", href: "/solutions/oci", desc: "OCI security" },
  { title: "Alibaba Cloud", href: "/solutions/alicloud", desc: "AliCloud coverage" },
  { title: "IBM Cloud", href: "/solutions/ibm", desc: "Enterprise workloads" },
  { title: "Kubernetes / EKS", href: "/solutions/kubernetes", desc: "Cluster hardening" },
];

const solutionsIndustries: MenuItem[] = [
  { title: "Financial Services", href: "/solutions/financial", desc: "PCI-DSS, SOX-ready" },
  { title: "Healthcare", href: "/solutions/healthcare", desc: "HIPAA-first controls" },
  { title: "Government", href: "/solutions/government", desc: "FedRAMP alignment" },
];

function MegaWrap({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50 transition-all duration-200",
        open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none",
      )}
    >
      <div className="bg-white rounded-2xl border border-[#E5E9F0] shadow-[0_18px_48px_rgba(16,24,40,.14)] p-6">
        {children}
      </div>
    </div>
  );
}

function TriggerBtn({ label, open }: { label: string; open: boolean }) {
  return (
    <button
      className={cn(
        "flex items-center gap-1 text-sm font-medium transition-colors py-2",
        open ? "text-[#2563EB]" : "text-[#334155] hover:text-[#2563EB]",
      )}
    >
      {label}
      <ChevronDown className={cn("w-4 h-4 transition-transform", open && "rotate-180")} />
    </button>
  );
}

function MenuLink({ item }: { item: MenuItem }) {
  return (
    <Link to={item.href} className="block p-2 -mx-2 rounded-lg hover:bg-[#F5F8FF] transition group">
      <div className="text-sm font-semibold text-[#0B1220] group-hover:text-[#2563EB] transition">
        {item.title}
      </div>
      <div className="text-xs text-[#64748B] mt-0.5">{item.desc}</div>
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState<"platform" | "solutions" | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-white border-b",
        scrolled ? "border-[#E5E9F0] shadow-[0_1px_3px_rgba(16,24,40,.06)]" : "border-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />

        <nav className="hidden lg:flex items-center gap-1">
          <div
            className="relative"
            onMouseEnter={() => setOpen("platform")}
            onMouseLeave={() => setOpen(null)}
          >
            <div className="px-3">
              <TriggerBtn label="Platform" open={open === "platform"} />
            </div>
            <MegaWrap open={open === "platform"}>
              <div className="grid grid-cols-5 gap-5 w-[1180px] max-w-[calc(100vw-3rem)]">
                {platformGroups.map((g) => (
                  <div key={g.heading}>
                    <div className="text-[11px] uppercase tracking-widest font-semibold text-[#64748B] mb-3">
                      {g.heading}
                    </div>
                    <div className="space-y-1">
                      {g.items.map((i) => <MenuLink key={i.href} item={i} />)}
                    </div>
                  </div>
                ))}
              </div>
            </MegaWrap>
          </div>

          <div
            className="relative"
            onMouseEnter={() => setOpen("solutions")}
            onMouseLeave={() => setOpen(null)}
          >
            <div className="px-3">
              <TriggerBtn label="Solutions" open={open === "solutions"} />
            </div>
            <MegaWrap open={open === "solutions"}>
              <div className="grid grid-cols-2 gap-8 w-[640px]">
                <div>
                  <div className="text-[11px] uppercase tracking-widest font-semibold text-[#64748B] mb-3">
                    By cloud
                  </div>
                  <div className="space-y-1">
                    {solutionsClouds.map((i) => <MenuLink key={i.href} item={i} />)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-widest font-semibold text-[#64748B] mb-3">
                    By industry
                  </div>
                  <div className="space-y-1">
                    {solutionsIndustries.map((i) => <MenuLink key={i.href} item={i} />)}
                  </div>
                </div>
              </div>
            </MegaWrap>
          </div>

          <Link to="/platform/compliance" className="px-3 py-2 text-sm font-medium text-[#334155] hover:text-[#2563EB] transition">
            Compliance
          </Link>
          <Link to="/pricing" className="px-3 py-2 text-sm font-medium text-[#334155] hover:text-[#2563EB] transition">
            Pricing
          </Link>
          <Link to="/learn" className="px-3 py-2 text-sm font-medium text-[#334155] hover:text-[#2563EB] transition">
            Learn
          </Link>
          <Link to="/resources" className="px-3 py-2 text-sm font-medium text-[#334155] hover:text-[#2563EB] transition">
            Resources
          </Link>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="http://a3e22be456af44b03b31800c6a49ae89-349bf801ed209557.elb.ap-south-1.amazonaws.com/ui/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[#334155] hover:text-[#2563EB] transition"
          >
            Log in
          </a>
          <Link
            to="/request-demo"
            className="text-sm font-semibold px-4 py-2 rounded-[10px] bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-[0_1px_2px_rgba(16,24,40,.06),0_4px_10px_rgba(37,99,235,.20)] transition"
          >
            Request demo
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-[#0B1220]"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#E5E9F0] max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-6 space-y-6">
            {platformGroups.map((g) => (
              <div key={g.heading}>
                <div className="text-[11px] uppercase tracking-widest font-semibold text-[#64748B] mb-2">
                  {g.heading}
                </div>
                <div className="space-y-1">
                  {g.items.map((i) => (
                    <Link key={i.href} to={i.href} onClick={() => setMobileOpen(false)} className="block text-sm text-[#0B1220] py-1.5">
                      {i.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <div className="text-[11px] uppercase tracking-widest font-semibold text-[#64748B] mb-2">By cloud</div>
              <div className="grid grid-cols-2 gap-1">
                {solutionsClouds.map((i) => (
                  <Link key={i.href} to={i.href} onClick={() => setMobileOpen(false)} className="text-sm text-[#0B1220] py-1.5">
                    {i.title}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-widest font-semibold text-[#64748B] mb-2">By industry</div>
              {solutionsIndustries.map((i) => (
                <Link key={i.href} to={i.href} onClick={() => setMobileOpen(false)} className="block text-sm text-[#0B1220] py-1.5">
                  {i.title}
                </Link>
              ))}
            </div>
            <div className="pt-4 border-t border-[#E5E9F0] space-y-2">
              <Link to="/pricing" onClick={() => setMobileOpen(false)} className="block text-sm text-[#0B1220] py-1.5">Pricing</Link>
              <Link to="/learn" onClick={() => setMobileOpen(false)} className="block text-sm text-[#0B1220] py-1.5">Learn</Link>
              <Link to="/resources" onClick={() => setMobileOpen(false)} className="block text-sm text-[#0B1220] py-1.5">Resources</Link>
              <a
                href="http://a3e22be456af44b03b31800c6a49ae89-349bf801ed209557.elb.ap-south-1.amazonaws.com/ui/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-[#0B1220] py-1.5"
              >
                Log in
              </a>
              <Link
                to="/request-demo"
                onClick={() => setMobileOpen(false)}
                className="block text-center text-sm font-semibold px-4 py-3 rounded-[10px] bg-[#2563EB] text-white mt-3"
              >
                Request demo
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
