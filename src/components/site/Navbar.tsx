import { Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { SUITE, AIOPS_COLOR, type SuiteKey, type SuiteProduct } from "@/data/product-suite";
import { StatusBadge } from "@/components/site/ops/OpsUi";

export { Logo } from "./Logo";

type MenuItem = { title: string; href: string; desc: string };

type MenuKey = "products" | "solutions" | "resources" | "company";

/**
 * Top bar (owner decision 2026-10-07): Products · Solutions · Why Onam · Resources ·
 * Company, with Docs, Log in and Request demo on the right. Pricing is under
 * Resources › Evaluate: enterprise buyers start with a demo, not a price list. Learn, Docs and the
 * resource library used to be three separate top-level links; they are one
 * Resources menu now, grouped by what the visitor is doing.
 */
const resourceGroups: { heading: string; items: MenuItem[] }[] = [
  {
    heading: "Learn",
    items: [
      { title: "Learn — glossary", href: "/learn", desc: "Asset inventory, security, FinOps, DR and AI agents, explained" },
      { title: "Blog", href: "/resources/blog", desc: "Engineering and product writing" },
      { title: "Scenarios", href: "/resources/scenarios", desc: "Real situations, step by step" },
    ],
  },
  {
    heading: "Build",
    items: [
      { title: "Documentation", href: "/docs", desc: "Every product, from first connection" },
      { title: "Connect a cloud", href: "/docs/onboarding/aws", desc: "Onboarding guides for all seven clouds" },
      { title: "Release notes", href: "/docs/release-notes", desc: "What changed, and when" },
    ],
  },
  {
    heading: "Evaluate",
    items: [
      { title: "Whitepapers", href: "/whitepapers", desc: "Architecture, methodology and trust" },
      { title: "Tools & calculators", href: "/tools", desc: "Exposure and consolidation calculators" },
      { title: "Case studies", href: "/case-studies", desc: "How teams use Onam" },
      { title: "Compare", href: "/compare", desc: "Onam Security side by side with others" },
      { title: "Plans & pricing", href: "/pricing", desc: "Onam Security plans; other products per organisation" },
      { title: "Cloud marketplaces", href: "/why-onam#marketplaces", desc: "AWS, Azure and Google Cloud listings" },
    ],
  },
];

const companyItems: MenuItem[] = [
  { title: "About", href: "/company/about", desc: "Who we are and why Onam exists" },
  { title: "Trust Center", href: "/trust", desc: "Security, data handling and what each product stores" },
  { title: "Careers", href: "/company/careers", desc: "Build the platform with us" },
  { title: "Contact", href: "/company/contact", desc: "Talk to the team" },
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
  { title: "Financial Services", href: "/solutions/financial", desc: "PCI DSS and RBI mappings" },
  { title: "Healthcare", href: "/solutions/healthcare", desc: "HIPAA-first controls" },
  { title: "Government", href: "/solutions/government", desc: "FedRAMP control mapping" },
];

/**
 * `wide` centres the panel on the VIEWPORT rather than on its trigger.
 * The products panel is 1180px and its trigger sits left of centre, so
 * trigger-centring pushed roughly a hundred pixels of it off the left edge at
 * 1440 — the first column was unreadable and the first product card was clipped.
 * The header is fixed and h-16, so `fixed top-16` lands the panel directly under it.
 */
function MegaWrap({ id, open, wide, children }: { id: string; open: boolean; wide?: boolean; children: React.ReactNode }) {
  // `invisible` when closed: opacity alone leaves every link in the tab order.
  return (
    <div
      id={id}
      className={cn(
        "left-1/2 -translate-x-1/2 pt-3 z-50 transition-all duration-200",
        wide ? "fixed top-16" : "absolute top-full",
        open ? "opacity-100 translate-y-0 pointer-events-auto visible" : "opacity-0 -translate-y-1 pointer-events-none invisible",
      )}
    >
      <div className="bg-white rounded-2xl border border-[#E5E9F0] shadow-[0_18px_48px_rgba(16,24,40,.14)] p-6">
        {children}
      </div>
    </div>
  );
}

function TriggerBtn({
  label,
  open,
  controls,
  onToggle,
}: {
  label: string;
  open: boolean;
  controls: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={controls}
      onClick={onToggle}
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

/**
 * Products menu: the five products across the top (four in lifecycle order, then
 * Onam AIOps), and the modules of whichever one is pointed at underneath. Estate,
 * FinOps and DRM are separately entitled products, not security engines, so each
 * gets its own panel rather than a column inside Onam Security's.
 */
function SuiteTab({ p, active, onActivate }: { p: SuiteProduct; active: boolean; onActivate: () => void }) {
  const Icon = p.icon;
  return (
    <Link
      to={p.href}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      aria-current={active ? "true" : undefined}
      className={cn(
        "relative flex items-start gap-3 p-3 rounded-xl border transition",
        active ? "bg-[#F5F8FF] border-[#C7D7FE]" : "border-[#E5E9F0] hover:border-[#C7D7FE]",
      )}
    >
      <span
        aria-hidden
        className="absolute inset-x-3 -top-px h-[3px] rounded-b-full transition-opacity"
        style={{ backgroundColor: p.color, opacity: active ? 1 : 0 }}
      />
      <span
        className="w-9 h-9 shrink-0 rounded-lg grid place-items-center"
        style={{
          backgroundColor: `color-mix(in srgb, ${p.color} 12%, #FFFFFF)`,
          boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${p.color} 22%, transparent)`,
        }}
      >
        <Icon className="w-[18px] h-[18px]" style={{ color: p.color }} />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] uppercase tracking-wider font-semibold text-[#64748B]">{p.stage}</span>
        <span className="flex items-center gap-1.5 text-sm font-bold text-[#0B1220]">
          {p.name}
          {p.badge && (
            <span
              className="text-[11px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded"
              style={{ color: AIOPS_COLOR, backgroundColor: "#EEF2FF" }}
            >
              Early
            </span>
          )}
        </span>
      </span>
    </Link>
  );
}

function SuitePanel({ p }: { p: SuiteProduct }) {
  const cols = p.groups.length >= 5 ? "grid-cols-5" : p.groups.length === 2 ? "grid-cols-2" : "grid-cols-1";
  return (
    <div className="mt-4 grid grid-cols-[250px_1fr] gap-6 pt-5 border-t border-[#E5E9F0]">
      <div className="pr-6 border-r border-[#E5E9F0]">
        <div className="text-sm font-semibold text-[#0B1220] leading-snug">{p.question}</div>
        <p className="mt-2 text-xs text-[#64748B] leading-relaxed">{p.blurb}</p>
        <div className="mt-4 flex flex-col gap-2">
          <Link to={p.href} className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
            Explore {p.name} →
          </Link>
          <Link to={p.docs} className="text-sm font-medium text-[#334155] hover:text-[#2563EB]">
            Documentation →
          </Link>
        </div>
        {p.agent && (
          <Link to={p.agent.href} className="mt-4 block rounded-lg border border-[#E0E7FF] bg-[#F8F9FF] p-2.5 hover:border-[#C7D2FE] transition">
            <span className="block text-[11px] uppercase tracking-wider font-bold" style={{ color: AIOPS_COLOR }}>
              With Onam AIOps
            </span>
            <span className="mt-1 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-[#0B1220]">
              {p.agent.name} <StatusBadge status={p.agent.status} />
            </span>
          </Link>
        )}
      </div>
      <div className={cn("grid gap-5", cols)}>
        {p.groups.map((g) => (
          <div key={g.heading}>
            <div className="text-[11px] uppercase tracking-widest font-semibold text-[#64748B] mb-3">{g.heading}</div>
            <div className={cn("gap-x-6", p.groups.length === 1 ? "grid grid-cols-2 gap-y-1" : "space-y-1")}>
              {g.items.map((i) => (
                <MenuLink key={i.title + i.href} item={i} status={i.status} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MenuLink({ item, status }: { item: MenuItem; status?: SuiteProduct["groups"][number]["items"][number]["status"] }) {
  return (
    <Link to={item.href} className="block p-2 -mx-2 rounded-lg hover:bg-[#F5F8FF] transition group">
      <div className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-[#0B1220] group-hover:text-[#2563EB] transition">
        {item.title}
        {status && status !== "early" && <StatusBadge status={status} />}
      </div>
      <div className="text-xs text-[#64748B] mt-0.5">{item.desc}</div>
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState<MenuKey | null>(null);
  // Hover intent: the pointer crosses a strip of header between the trigger and the
  // panel, and diagonal moves clip the trigger's box. Closing after a short delay —
  // cancelled the moment the pointer re-enters — keeps the menu open on the way.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  //
  // Switching is delayed too: a diagonal move from "Products" down into its panel
  // crosses the "Solutions" trigger, and switching on contact closed Products under
  // the pointer. Another menu takes over only if the pointer rests on its trigger.
  const openRef = useRef(open);
  openRef.current = open;
  const hoverOpen = (k: MenuKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    const cur = openRef.current;
    if (cur === null || cur === k) setOpen(k);
    else closeTimer.current = setTimeout(() => setOpen(k), 200);
  };
  const hoverClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 250);
  };
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tab, setTab] = useState<SuiteKey>("estate");
  const [mobileProduct, setMobileProduct] = useState<SuiteKey | null>(null);
  const activeProduct = SUITE.find((p) => p.key === tab)!;

  useEffect(() => {
    // A click on "Products" only ever opens the menu: hovering opens it a moment
    // before the click lands, so a toggle closed it under the pointer. It closes on
    // Escape, on a click anywhere outside the header, or when the pointer leaves.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    const onDown = (e: MouseEvent) => {
      if (!(e.target as Element | null)?.closest?.("header")) setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
    };
  }, []);

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
            className="relative h-16 flex items-center"
            onMouseEnter={() => hoverOpen("products")}
            onMouseLeave={hoverClose}
          >
            <div className="px-3">
              <TriggerBtn label="Products" open={open === "products"} controls="menu-products" onToggle={() => setOpen("products")} />
            </div>
            <MegaWrap id="menu-products" open={open === "products"} wide>
              <div className="w-[1180px] max-w-[calc(100vw-3rem)]" onClick={() => setOpen(null)}>
                <div className="grid grid-cols-5 gap-3">
                  {SUITE.map((p) => (
                    <SuiteTab key={p.key} p={p} active={p.key === tab} onActivate={() => setTab(p.key)} />
                  ))}
                </div>
                <SuitePanel p={activeProduct} />
              </div>
            </MegaWrap>
          </div>

          <div
            className="relative h-16 flex items-center"
            onMouseEnter={() => hoverOpen("solutions")}
            onMouseLeave={hoverClose}
          >
            <div className="px-3">
              <TriggerBtn label="Solutions" open={open === "solutions"} controls="menu-solutions" onToggle={() => setOpen("solutions")} />
            </div>
            <MegaWrap id="menu-solutions" open={open === "solutions"}>
              <div className="grid grid-cols-2 gap-8 w-[640px]" onClick={() => setOpen(null)}>
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

          <Link to="/why-onam" className="px-3 py-2 text-sm font-medium text-[#334155] hover:text-[#2563EB] transition">
            Why Onam
          </Link>

          <div
            className="relative h-16 flex items-center"
            onMouseEnter={() => hoverOpen("resources")}
            onMouseLeave={hoverClose}
          >
            <div className="px-3">
              <TriggerBtn label="Resources" open={open === "resources"} controls="menu-resources" onToggle={() => setOpen("resources")} />
            </div>
            <MegaWrap id="menu-resources" open={open === "resources"}>
              <div className="grid grid-cols-3 gap-8 w-[840px] max-w-[calc(100vw-3rem)]" onClick={() => setOpen(null)}>
                {resourceGroups.map((g) => (
                  <div key={g.heading}>
                    <div className="text-[11px] uppercase tracking-widest font-semibold text-[#64748B] mb-3">{g.heading}</div>
                    <div className="space-y-1">
                      {g.items.map((i) => <MenuLink key={i.href} item={i} />)}
                    </div>
                  </div>
                ))}
              </div>
            </MegaWrap>
          </div>

          <div
            className="relative h-16 flex items-center"
            onMouseEnter={() => hoverOpen("company")}
            onMouseLeave={hoverClose}
          >
            <div className="px-3">
              <TriggerBtn label="Company" open={open === "company"} controls="menu-company" onToggle={() => setOpen("company")} />
            </div>
            <MegaWrap id="menu-company" open={open === "company"}>
              <div className="w-[320px] space-y-1" onClick={() => setOpen(null)}>
                {companyItems.map((i) => <MenuLink key={i.href} item={i} />)}
              </div>
            </MegaWrap>
          </div>

        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link to="/docs" className="text-sm font-medium text-[#334155] hover:text-[#2563EB] transition">
            Docs
          </Link>
          <a
            href="https://app.onamsecurity.com/ui/dashboard"
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
            <div>
              <div className="text-[11px] uppercase tracking-widest font-semibold text-[#64748B] mb-2">Products</div>
              <div className="divide-y divide-[#E5E9F0] border-y border-[#E5E9F0]">
                {SUITE.map((p) => {
                  const open = mobileProduct === p.key;
                  const Icon = p.icon;
                  return (
                    <div key={p.key}>
                      <button
                        onClick={() => setMobileProduct(open ? null : p.key)}
                        aria-expanded={open}
                        className="w-full flex items-center gap-3 py-3 text-left"
                      >
                        <Icon className="w-5 h-5 shrink-0" style={{ color: p.color }} />
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm font-bold text-[#0B1220]">{p.name}</span>
                          <span className="block text-xs text-[#64748B]">{p.stage}</span>
                        </span>
                        {p.badge && <StatusBadge status="early" />}
                        <ChevronDown className={cn("w-4 h-4 text-[#64748B] transition-transform", open && "rotate-180")} />
                      </button>
                      {open && (
                        <div className="pb-4 pl-8 space-y-3">
                          <Link to={p.href} onClick={() => setMobileOpen(false)} className="block text-sm font-semibold text-[#2563EB]">
                            Explore {p.name} →
                          </Link>
                          {p.groups.map((g) => (
                            <div key={g.heading}>
                              <div className="text-[11px] uppercase tracking-widest font-semibold text-[#64748B] mb-1">{g.heading}</div>
                              {g.items.map((i) => (
                                <Link
                                  key={i.title + i.href}
                                  to={i.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex flex-wrap items-center gap-2 text-sm text-[#0B1220] py-1.5"
                                >
                                  {i.title}
                                  {i.status && i.status !== "early" && <StatusBadge status={i.status} />}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
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
              {[...resourceGroups, { heading: "Company", items: companyItems }].map((g) => (
                <div key={g.heading} className="pb-2">
                  <div className="text-[11px] uppercase tracking-widest font-semibold text-[#64748B] mb-1">{g.heading}</div>
                  {g.items.map((i) => (
                    <Link key={i.href} to={i.href} onClick={() => setMobileOpen(false)} className="block text-sm text-[#0B1220] py-1.5">
                      {i.title}
                    </Link>
                  ))}
                </div>
              ))}
              <Link to="/why-onam" onClick={() => setMobileOpen(false)} className="block text-sm font-semibold text-[#0B1220] py-1.5">Why Onam</Link>
              <a
                href="https://app.onamsecurity.com/ui/dashboard"
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
