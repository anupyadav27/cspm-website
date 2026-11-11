import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MarketplaceStrip } from "@/components/site/MarketplaceStrip";
import {
  ArrowRight,
  Building2,
  Check,
  Cloud,
  FileCode2,
  HelpCircle,
  Minus,
  Plus,
  X,
  Users2,
  ShieldCheck,
  KeyRound,
  Coins,
  Layers,
  Server,
  ClipboardCheck,
  LifeBuoy,
  Handshake,
  History,
  ScrollText,
  Landmark,
  Calculator as CalculatorIcon,
} from "@/components/site/icons";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { cn } from "@/lib/utils";
import { seo, faqJsonLd } from "@/lib/seo";
import { ENGINES, FRAMEWORKS } from "@/lib/product-facts";
import { PRODUCTS } from "@/data/products";
import { getSuite } from "@/data/product-suite";
import { OPS_STATUS } from "@/data/operations";
import { IconTile, StatusChip } from "@/components/site/system";
import {
  CLOUD_PLANS,
  CLOUD_RESOURCES,
  DEV_LEVELS,
  UNIT_LEVELS,
  DEV_PRICE,
  FREE_RESOURCES,
  MIN_UNITS,
  SAAS_BANDS,
  SAAS_PLATFORMS,
  volumePrice,
  num,
  usd,
  type CloudPlanKey,
  SIZES,
  sizeFor,
} from "@/data/pricing";

const COMPLETE = CLOUD_PLANS[0];
const POSTURE = CLOUD_PLANS[1];

export const Route = createFileRoute("/pricing")({
  head: () =>
    seo({
      title: "Pricing — Onam",
      description: `Cloud security from ${usd(COMPLETE.unitPrice)} per unit a month with CIEM and DSPM included, code security per developer, SaaS per tenant. Work out your price.`,
      path: "/pricing",
      image: "/og/pricing.png",
    }),
  component: PricingPage,
});

/* ------------------------------------------------------------------ helpers */

function Stepper({
  value,
  onChange,
  label,
  step = 1,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
  step?: number;
}) {
  const set = (n: number) => onChange(Math.max(0, Math.min(1_000_000, Math.round(n))));
  return (
    <div className="inline-flex items-stretch rounded-lg border border-[#CBD5E1] bg-white overflow-hidden">
      <button
        type="button"
        aria-label={`Fewer ${label}`}
        onClick={() => set(value - step)}
        className="px-2.5 text-[#475569] hover:bg-[#F1F5F9]"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        aria-label={label}
        value={value}
        onChange={(e) => set(Number(e.target.value) || 0)}
        className="w-20 text-right px-2 py-1.5 text-sm tabular-nums text-[#0B1220] border-x border-[#E5E9F0] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500/40 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        aria-label={`More ${label}`}
        onClick={() => set(value + step)}
        className="px-2.5 text-[#475569] hover:bg-[#F1F5F9]"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/* --------------------------------------------------------------- calculator */

type CloudRow = { id: number; type: string; count: number };
type SaasRow = { id: number; platform: string; band: string };
let nextId = 1;
const newId = () => nextId++;

const selectCls =
  "w-full min-w-0 rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-2 text-sm text-[#0B1220] focus:outline-none focus:ring-2 focus:ring-blue-500/40";

function RemoveButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="p-2 rounded-md text-[#94A3B8] hover:text-[#B91C1C] hover:bg-[#FEF2F2]"
    >
      <X className="w-4 h-4" />
    </button>
  );
}

function AddButton({
  onClick,
  children,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] disabled:text-[#94A3B8] disabled:cursor-not-allowed"
    >
      <Plus className="w-4 h-4" /> {children}
    </button>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  meta,
  hint,
}: {
  icon: typeof Cloud;
  title: string;
  meta: string;
  hint: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-[#2563EB]" />
        <h3 className="font-display font-bold text-[#0B1220]">{title}</h3>
      </div>
      <span className="text-xs text-[#64748B] tabular-nums">{meta}</span>
      <p className="basis-full text-xs text-[#64748B]">{hint}</p>
    </div>
  );
}

function PriceCalculator() {
  const [plan, setPlan] = useState<CloudPlanKey>("complete");
  const [cloud, setCloud] = useState<CloudRow[]>(() => [{ id: newId(), type: "vm", count: 0 }]);
  const [saas, setSaas] = useState<SaasRow[]>([]);
  const [devs, setDevs] = useState(0);

  const active = CLOUD_PLANS.find((p) => p.key === plan)!;
  const res = (key: string) => CLOUD_RESOURCES.find((r) => r.key === key)!;
  const used = new Set(cloud.map((r) => r.type));
  const unused = CLOUD_RESOURCES.filter((r) => !used.has(r.key));

  const est = useMemo(() => {
    const cloudUnits = cloud.reduce((s, r) => s + r.count * res(r.type).factor, 0);
    let saasUnits = 0;
    let saasQuote = false;
    for (const r of saas) {
      const band = SAAS_BANDS.find((b) => b.key === r.band)!;
      if (band.units === null) saasQuote = true;
      else saasUnits += band.units;
    }
    const units = cloudUnits + saasUnits;
    const billed = units > 0 ? Math.max(units, MIN_UNITS) : 0;
    const unitPrice = volumePrice(billed, active.unitPrice, UNIT_LEVELS);
    const code = volumePrice(devs, DEV_PRICE, DEV_LEVELS);
    return {
      cloudUnits,
      saasUnits,
      saasQuote,
      units,
      billed,
      size: sizeFor(units),
      minApplied: units > 0 && units < MIN_UNITS,
      listUnits: unitPrice.list,
      listCode: code.list,
      unitDisc: unitPrice,
      codeDisc: code,
      list: Math.round((unitPrice.list + code.list) * 100) / 100,
      discount: Math.round((unitPrice.discount + code.discount) * 100) / 100,
      monthly: unitPrice.total + code.total,
      empty: units === 0 && devs === 0 && !saasQuote,
    };
  }, [cloud, saas, devs, active.unitPrice]);

  const setRow = (id: number, patch: Partial<CloudRow>) =>
    setCloud((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const setSaasRow = (id: number, patch: Partial<SaasRow>) =>
    setSaas((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-6 items-start">
      <div className="rounded-lg border border-[#E5E9F0] bg-white divide-y divide-[#E5E9F0]">
        {/* Plan */}
        <fieldset className="p-5 sm:p-6">
          <legend className="sr-only">Cloud plan</legend>
          <div className="font-display font-bold text-[#0B1220]">1. Choose a cloud plan</div>
          <div className="mt-3 grid sm:grid-cols-2 gap-3">
            {CLOUD_PLANS.map((p) => (
              <label
                key={p.key}
                className={cn(
                  "cursor-pointer rounded-lg border p-4 transition",
                  plan === p.key
                    ? "border-[#2563EB] bg-[#F5F8FF]"
                    : "border-[#E5E9F0] hover:border-[#94A3B8]",
                )}
              >
                <input
                  type="radio"
                  name="plan"
                  value={p.key}
                  checked={plan === p.key}
                  onChange={() => setPlan(p.key)}
                  className="sr-only"
                />
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-display font-bold text-[#0B1220]">{p.name}</span>
                  <span className="text-sm tabular-nums text-[#0B1220]">
                    <b>{usd(p.unitPrice)}</b> <span className="text-[#64748B]">/ unit / month</span>
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-[#475569] leading-relaxed">{p.summary}</p>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Cloud rows */}
        <div className="p-5 sm:p-6">
          <SectionTitle
            icon={Cloud}
            title="2. Add your cloud resources"
            meta={`${num(est.cloudUnits)} units`}
            hint="Pick a resource type and enter the average count over a month, across all your accounts on AWS, Azure, Google Cloud, Oracle, Alibaba, IBM and Kubernetes."
          />
          <ul className="mt-4 space-y-2">
            {cloud.map((row) => {
              const r = res(row.type);
              return (
                <li key={row.id} className="rounded-lg border border-[#EEF1F5] p-3">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2">
                    <select
                      aria-label="Resource type"
                      value={row.type}
                      onChange={(e) => setRow(row.id, { type: e.target.value })}
                      className={selectCls}
                    >
                      {CLOUD_RESOURCES.map((o) => (
                        <option
                          key={o.key}
                          value={o.key}
                          disabled={o.key !== row.type && used.has(o.key)}
                        >
                          {o.label} ({o.ratio})
                        </option>
                      ))}
                    </select>
                    <Stepper
                      value={row.count}
                      onChange={(n) => setRow(row.id, { count: n })}
                      label={r.label}
                      step={r.factor < 0.1 ? 10 : 1}
                    />
                    <RemoveButton
                      onClick={() => setCloud((rows) => rows.filter((x) => x.id !== row.id))}
                      label={`Remove ${r.label}`}
                    />
                  </div>
                  <div className="mt-1.5 flex justify-between gap-3 text-xs text-[#64748B]">
                    <span className="truncate" title={r.examples}>
                      {r.examples}
                    </span>
                    <span className="shrink-0 tabular-nums">{num(row.count * r.factor)} units</span>
                  </div>
                </li>
              );
            })}
          </ul>
          <AddButton
            disabled={unused.length === 0}
            onClick={() =>
              setCloud((rows) => [...rows, { id: newId(), type: unused[0].key, count: 0 }])
            }
          >
            Add a resource type
          </AddButton>
          <p className="mt-3 text-xs text-[#475569] leading-relaxed">
            <b className="text-[#0B1220]">Free, never counted:</b> {FREE_RESOURCES}. They are still
            scanned and reported.
          </p>
        </div>

        {/* SaaS rows */}
        <div className="p-5 sm:p-6">
          <SectionTitle
            icon={Layers}
            title="3. Add SaaS tenants (optional)"
            meta={`${num(est.saasUnits)} units`}
            hint="One row per tenant. Each counts as units by its number of licensed users and shares the cloud volume discount."
          />
          {saas.length > 0 && (
            <ul className="mt-4 space-y-2">
              {saas.map((row) => {
                const band = SAAS_BANDS.find((b) => b.key === row.band)!;
                const platform = SAAS_PLATFORMS.find((p) => p.key === row.platform)!;
                return (
                  <li key={row.id} className="rounded-lg border border-[#EEF1F5] p-3">
                    <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-2">
                      <select
                        aria-label="SaaS platform"
                        value={row.platform}
                        onChange={(e) => setSaasRow(row.id, { platform: e.target.value })}
                        className={selectCls}
                      >
                        {SAAS_PLATFORMS.map((p) => (
                          <option key={p.key} value={p.key}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                      <div className="flex items-center gap-2">
                        <select
                          aria-label="Licensed users"
                          value={row.band}
                          onChange={(e) => setSaasRow(row.id, { band: e.target.value })}
                          className={selectCls}
                        >
                          {SAAS_BANDS.filter((b) => b.key !== "none").map((b) => (
                            <option key={b.key} value={b.key}>
                              {b.label}
                              {b.units ? ` (${b.units} units)` : " (quote)"}
                            </option>
                          ))}
                        </select>
                        <RemoveButton
                          onClick={() => setSaas((rows) => rows.filter((x) => x.id !== row.id))}
                          label={`Remove ${platform.label}`}
                        />
                      </div>
                    </div>
                    <div className="mt-1.5 flex justify-between gap-3 text-xs text-[#64748B]">
                      <span className="truncate">{platform.note}</span>
                      <span className="shrink-0 tabular-nums">
                        {band.units === null ? "quote" : `${band.units} units`}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <AddButton
            onClick={() =>
              setSaas((rows) => [
                ...rows,
                {
                  id: newId(),
                  platform: SAAS_PLATFORMS[rows.length % SAAS_PLATFORMS.length].key,
                  band: "b100",
                },
              ])
            }
          >
            Add a SaaS tenant
          </AddButton>
        </div>

        {/* Code */}
        <div className="p-5 sm:p-6">
          <SectionTitle
            icon={FileCode2}
            title="4. Code security (optional)"
            meta={`${devs} developers`}
            hint="Active developers: anyone who committed to a scanned private repository in the last 90 days. GitHub and GitLab."
          />
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Stepper value={devs} onChange={setDevs} label="developers" />
            <input
              type="range"
              min={0}
              max={500}
              step={5}
              value={Math.min(devs, 500)}
              onChange={(e) => setDevs(Number(e.target.value))}
              aria-label="Active developers"
              className="flex-1 min-w-[160px] accent-[#2563EB]"
            />
          </div>
          <p className="mt-3 text-xs text-[#475569]">
            SAST, dependency checks with SBOM, secrets and infrastructure-as-code checks. App
            testing (DAST) and AI Code Fix are priced on request.
          </p>
        </div>

        {/* Running total */}
        <div className="sticky bottom-0 rounded-b-lg bg-[#F5F8FF] px-5 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 text-sm">
          <span className="text-[#0B1220]">
            <b className="tabular-nums">{num(est.units)}</b> units
            {est.units > 0 && <span className="text-[#64748B]"> · {est.size.label}</span>}
            {devs > 0 && <span className="text-[#64748B]"> · {devs} developers</span>}
          </span>
          <span className="text-[#0B1220]">
            <b className="tabular-nums">{usd(est.monthly)}</b>{" "}
            <span className="text-[#64748B]">a month after discount</span>
          </span>
        </div>
      </div>

      {/* Summary */}
      <aside
        aria-live="polite"
        className="lg:sticky lg:top-24 rounded-lg bg-[#0B1220] text-white p-6"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">
            <CalculatorIcon className="w-3.5 h-3.5" /> Your estimate
          </div>
          {est.units > 0 && (
            <span
              className="rounded-md bg-white/10 px-2 py-0.5 text-xs font-semibold text-white"
              title={est.size.note}
            >
              {est.size.label}
            </span>
          )}
        </div>
        <div className="mt-4">
          <div className="text-xs text-[#94A3B8]">Total units</div>
          <div className="font-display font-bold text-3xl tabular-nums">{num(est.units)}</div>
          <div className="text-xs text-[#94A3B8] tabular-nums">
            Cloud {num(est.cloudUnits)} + SaaS {num(est.saasUnits)}
            {devs > 0 && ` · ${devs} developers`}
          </div>
        </div>
        {est.empty && (
          <p className="mt-3 text-xs text-[#94A3B8]">
            Add your resources on the left to see a price.
          </p>
        )}

        <dl className="mt-5 pt-4 border-t border-white/10 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[#CBD5E1]">
              {active.name}: {num(est.billed)} units × {usd(active.unitPrice)}
            </dt>
            <dd className="tabular-nums">{usd(est.listUnits)}</dd>
          </div>
          {est.minApplied && (
            <p className="text-xs text-[#94A3B8]">Smallest bill is {MIN_UNITS} units.</p>
          )}
          {devs > 0 && (
            <div className="flex justify-between gap-4">
              <dt className="text-[#CBD5E1]">
                Code: {devs} developers × {usd(DEV_PRICE)}
              </dt>
              <dd className="tabular-nums">{usd(est.listCode)}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4 pt-2 border-t border-white/10">
            <dt className="text-[#94A3B8]">List price</dt>
            <dd className="tabular-nums">{usd(est.list)}</dd>
          </div>
          {[
            { k: "units", d: est.unitDisc },
            { k: "developers", d: est.codeDisc },
          ]
            .filter((x) => x.d.discount > 0)
            .map((x) => (
              <div key={x.k} className="flex justify-between gap-4">
                <dt className="text-[#86EFAC]">
                  Volume discount, {x.d.level.label} ({Math.round(x.d.level.off * 1000) / 10}%
                  {x.d.capped ? ", capped" : ""})
                </dt>
                <dd className="tabular-nums whitespace-nowrap text-[#86EFAC]">−{usd(x.d.discount, true)}</dd>
              </div>
            ))}
          {est.discount === 0 && (
            <div className="flex justify-between gap-4">
              <dt className="text-[#94A3B8]">Volume discount</dt>
              <dd className="tabular-nums text-[#94A3B8]">{usd(0)}</dd>
            </div>
          )}
          {(est.unitDisc.capped || est.codeDisc.capped) && (
            <p className="text-xs text-[#94A3B8]">
              Capped: you never pay more than the price at the next volume level.
            </p>
          )}
        </dl>

        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-semibold text-white">Total per month</span>
            <span className="font-display font-bold text-4xl tabular-nums">{usd(est.monthly)}</span>
          </div>
          <div className="text-right text-sm text-[#CBD5E1] tabular-nums">
            {usd(est.monthly * 12)} a year
          </div>
          {est.discount === 0 && est.units > 0 && (
            <p className="mt-2 text-xs text-[#94A3B8]">
              Volume discount starts at 500 units or 50 developers.
            </p>
          )}
        </div>

        {est.saasQuote && (
          <p className="mt-4 text-xs text-[#FCD34D]">
            Plus a quote for tenants with more than 10,000 users.
          </p>
        )}
        {est.size.label === "Enterprise" && (
          <p className="mt-4 text-xs text-[#FCD34D]">
            At this size an Enterprise contract usually costs less. Ask us.
          </p>
        )}

        <div className="mt-6 grid gap-2">
          <BrandButton to="/company/contact" className="w-full">
            Get a quote for this estimate <ArrowRight className="w-4 h-4" />
          </BrandButton>
          <BrandButton
            to="/request-demo"
            search={{ product: "security" }}
            variant="onDark"
            className="w-full"
          >
            Start with a free audit scan
          </BrandButton>
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-[#94A3B8]">
          List prices in US dollars, before tax. Your quote confirms the final price. Size is worked
          out from your units: {SIZES.map((s) => `${s.label} ${s.note.toLowerCase()}`).join("; ")}.
        </p>
      </aside>
    </div>
  );
}

/* -------------------------------------------------------------- page data */

const cloudCommon = [
  `${ENGINES} engines across seven clouds: posture (CSPM, KSPM), identity (CIEM), data (DSPM)`,
  `All ${FRAMEWORKS} compliance frameworks`,
  "CIEM and identity attack paths",
  "Threat detection mapped to MITRE ATT&CK",
  "Network, API, database and encryption posture",
  "AI assistant and a fix for every finding",
  "1-year finding history, email and Slack alerts",
  "Reports and exports in CSV, JSON and PDF",
];

const included = [
  {
    icon: Cloud,
    title: "Cloud security",
    price: `${usd(COMPLETE.unitPrice)}`,
    unit: "per unit a month",
    sub: `Posture plan ${usd(POSTURE.unitPrice)} per unit, without vulnerability scanning`,
    items: [
      ...cloudCommon,
      "Complete plan: agentless vulnerability and malware scanning with EPSS scoring",
    ],
  },
  {
    icon: Layers,
    title: "SaaS security",
    price: usd(5 * COMPLETE.unitPrice),
    unit: "a month per tenant, up to 100 users",
    sub: "Counted in units by licensed users; shares the cloud volume discount",
    items: [
      "Microsoft 365 with SharePoint, Dynamics 365, Google Workspace",
      "Okta, GitHub and GitLab organisation settings, Snowflake",
      "SaaS posture checks (SSPM) on each platform's settings",
      "Findings in the same console and reports as your clouds",
    ],
  },
  {
    icon: FileCode2,
    title: "Code security",
    price: usd(DEV_PRICE),
    unit: "per active developer a month",
    sub: "Lower rate above 50 and 200 developers",
    items: [
      "Static analysis (SAST)",
      "Dependency checks with SBOM (SCA)",
      "Secrets detection",
      "Infrastructure-as-code checks",
      "GitHub and GitLab repositories",
    ],
  },
];

const enterprise = [
  {
    icon: Building2,
    t: "Multi-tenant organisations",
    d: "For groups and for security providers running Onam for clients",
  },
  {
    icon: ClipboardCheck,
    t: "Custom compliance frameworks",
    d: "Build your own controls beside the standard frameworks",
  },
  { icon: KeyRound, t: "SSO / SAML 2.0", d: "Sign in through your identity provider" },
  { icon: Users2, t: "RBAC with custom roles", d: "Scope people to accounts, teams and products" },
  {
    icon: History,
    t: "Custom data retention",
    d: "Keep finding history as long as your policy needs",
  },
  {
    icon: Landmark,
    t: "Your region",
    d: "Hosting in the US, Europe, India or another region you choose",
  },
  { icon: Server, t: "On-premises deployment", d: "On request" },
  {
    icon: ShieldCheck,
    t: "Dedicated security engineer",
    d: "On request, plus a quarterly posture review",
  },
  { icon: LifeBuoy, t: "Priority support", d: "Service levels agreed in your contract" },
  {
    icon: ScrollText,
    t: "Custom contract and invoicing",
    d: "Terms and invoicing that fit your procurement",
  },
  {
    icon: Handshake,
    t: "Partner and marketplace buying",
    d: "Through a partner or a Microsoft Marketplace private offer",
  },
  { icon: Coins, t: "Volume pricing", d: "Contract rates above 10,000 units or 500 developers" },
];

type Cell = string | boolean;
const comparison: { label: string; cells: [Cell, Cell, Cell, Cell] }[] = [
  {
    label: "Price",
    cells: [
      "Free, once",
      `${usd(POSTURE.unitPrice)} / unit / month`,
      `${usd(COMPLETE.unitPrice)} / unit / month`,
      "Contract",
    ],
  },
  { label: "Cloud accounts", cells: ["1", "Unlimited", "Unlimited", "Unlimited, multi-tenant"] },
  { label: "Posture (CSPM, KSPM) and compliance", cells: [true, true, true, true] },
  { label: "Identity and permissions (CIEM)", cells: [false, true, true, true] },
  { label: "Sensitive data (DSPM)", cells: [false, true, true, true] },
  { label: "Agentless vulnerability and malware scanning", cells: [false, false, true, true] },
  {
    label: "SaaS and code security",
    cells: [
      false,
      "Add per tenant or developer",
      "Add per tenant or developer",
      "Included in contract",
    ],
  },
  { label: "Continuous monitoring", cells: ["Scanned once", true, true, true] },
  { label: "Finding history", cells: ["The report you keep", "1 year", "1 year", "Custom"] },
  { label: "SSO / SAML 2.0 and custom roles", cells: [false, false, false, true] },
  {
    label: "Support",
    cells: ["Readout with our team", "Email", "Email", "Priority, agreed service levels"],
  },
];

const faqs = [
  {
    q: "What is a unit?",
    a: `A unit is how Onam counts what it protects. A virtual machine, a Kubernetes node or a cluster is 1 unit. Two databases are 1 unit, ten buckets are 1 unit and fifty functions are 1 unit. Identities, networks, security groups, disks, keys and logs count nothing. A unit costs ${usd(COMPLETE.unitPrice)} a month on the Complete plan and ${usd(POSTURE.unitPrice)} on the Posture plan.`,
  },
  {
    q: "We already have a vulnerability scanner. Do we have to pay for ours?",
    a: `No. Choose the Posture plan at ${usd(POSTURE.unitPrice)} per unit a month. You keep posture, compliance, identity (CIEM) and data (DSPM) checks; Onam does not run vulnerability or malware scans on your machines. You can move to Complete at any time.`,
  },
  {
    q: "How do you count resources that come and go?",
    a: "By the average over the month, not the peak. Autoscaling groups, short-lived containers and functions count at their average. Before you start you give us your numbers; after go-live we check them against Onam's daily scans.",
  },
  {
    q: "How do volume discounts work?",
    a: "Once your total reaches a level, every unit is cheaper: 8.3% off from 500 units, 16.7% from 1,000, 25% from 5,000 and 33% from 10,000. Code security is 8.3% off from 50 developers and 16.7% from 200. Just below a level, the price is capped at what the next level costs, so adding resources never lowers your bill.",
  },
  {
    q: "Is there a minimum?",
    a: `The smallest cloud and SaaS bill is ${MIN_UNITS} units a month (${usd(MIN_UNITS * COMPLETE.unitPrice)} on Complete). Before that, a free one-time audit scan of one cloud account lets you see the findings first.`,
  },
  {
    q: "What does the free audit scan include?",
    a: "We connect to one cloud account through read-only posture scanning, run the checks once and walk you through the results in a 45-minute readout. Each finding is ranked by risk and comes with its fix and the compliance frameworks it affects. You keep the report. There is no charge and no commitment.",
  },
  {
    q: "Can we buy through our existing security or cloud partner?",
    a: "Often, yes. Onam works with security service providers and cloud partners who resell or run Onam for their clients, and Onam Security is available as a private offer on Microsoft Marketplace.",
  },
  {
    q: "Do you offer a nonprofit or academic discount?",
    a: "Yes. Contact sales. Verified nonprofits and academic institutions receive a discount.",
  },
  {
    q: "Are Onam Estate, Onam FinOps and Onam DRM included?",
    a: "No. Each is a separate product enabled per organisation, not a feature of the security subscription. Buying Onam Security does not turn them on, and buying one of them does not require Onam Security. If you run more than one, they share one login, one console and one discovery.",
  },
  {
    q: "How do we get Onam AIOps?",
    a: 'Onam AIOps is in early access, by invitation. Onam enables it for your organisation, connects the agents to your Onam Security data, and sets the autonomy ceiling to "propose": agents answer and propose, and nothing changes your cloud. There is no published price; ask us for an invitation.',
  },
];

/* ------------------------------------------------------------------- page */

function CellView({ v }: { v: Cell }) {
  if (v === true) return <Check className="w-4 h-4 text-[#2563EB]" aria-label="Included" />;
  if (v === false) return <X className="w-4 h-4 text-[#CBD5E1]" aria-label="Not included" />;
  return <span>{v}</span>;
}

function PricingPage() {
  const [open, setOpen] = useState<number | null>(0);
  const aiops = getSuite("aiops");

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="border-b border-[#E5E9F0] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">
            Pricing
          </div>
          <h1 className="mt-4 max-w-3xl font-display font-bold text-[#0B1220] text-4xl sm:text-5xl tracking-tight leading-[1.08]">
            Prices you can work out before you call us
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[#475569] leading-relaxed">
            Onam Security is priced per unit for cloud and SaaS, and per developer for code.
            Identity (CIEM) and data (DSPM) checks are in every cloud unit, with no add-ons. Enter
            your numbers below for a monthly estimate.
          </p>
          <dl className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 border border-[#E5E9F0] rounded-lg divide-y sm:divide-y-0 sm:divide-x divide-[#E5E9F0]">
            {[
              {
                k: "Cloud, Complete",
                v: usd(COMPLETE.unitPrice),
                u: "per unit a month",
                d: "Posture, CIEM, DSPM and vulnerability scanning",
              },
              {
                k: "Cloud, Posture",
                v: usd(POSTURE.unitPrice),
                u: "per unit a month",
                d: "For teams that already run a scanner",
              },
              {
                k: "SaaS",
                v: usd(5 * COMPLETE.unitPrice),
                u: "a month per tenant",
                d: "Up to 100 users; larger tenants in bands",
              },
              {
                k: "Code",
                v: usd(DEV_PRICE),
                u: "per developer a month",
                d: "SAST, SCA with SBOM, secrets, IaC",
              },
            ].map((x) => (
              <div key={x.k} className="p-5">
                <dt className="text-xs font-semibold text-[#64748B]">{x.k}</dt>
                <dd className="mt-2">
                  <span className="font-display font-bold text-3xl text-[#0B1220] tabular-nums">
                    {x.v}
                  </span>{" "}
                  <span className="text-sm text-[#64748B]">{x.u}</span>
                  <div className="mt-1.5 text-xs text-[#475569]">{x.d}</div>
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <BrandButton href="#calculator" size="lg">
              Work out your price <ArrowRight className="w-4 h-4" />
            </BrandButton>
            <BrandButton
              to="/request-demo"
              search={{ product: "security" }}
              variant="secondary"
              size="lg"
            >
              Request a free audit scan
            </BrandButton>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section
        id="calculator"
        className="bg-[#F7F9FC] border-b border-[#E5E9F0] py-16 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-display font-bold text-[#0B1220] text-2xl md:text-3xl tracking-tight">
            Price calculator
          </h2>
          <p className="mt-2 max-w-2xl text-[#475569]">
            Choose a plan, add each type of resource you run, then any SaaS tenants and developers.
            Your size and price update as you go.
          </p>
          <div className="mt-8">
            <PriceCalculator />
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-display font-bold text-[#0B1220] text-2xl md:text-3xl tracking-tight">
            What each price includes
          </h2>
          <div className="mt-8 grid md:grid-cols-3 gap-5">
            {included.map((c) => (
              <div key={c.title} className="rounded-lg border border-[#E5E9F0] p-6 flex flex-col">
                <div className="flex items-center gap-2.5 text-[#0B1220]">
                  <c.icon className="w-5 h-5 text-[#2563EB]" />
                  <h3 className="font-display font-bold text-lg">{c.title}</h3>
                </div>
                <div className="mt-4">
                  <span className="font-display font-bold text-3xl text-[#0B1220] tabular-nums">
                    {c.price}
                  </span>{" "}
                  <span className="text-sm text-[#64748B]">{c.unit}</span>
                </div>
                <p className="mt-1.5 text-xs text-[#475569]">{c.sub}</p>
                <ul className="mt-5 pt-5 border-t border-[#E5E9F0] space-y-2.5">
                  {c.items.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[#334155]">
                      <Check className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise */}
      <section id="enterprise" className="bg-[#0B1220] text-white py-16 md:py-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">
              Enterprise
            </div>
            <h2 className="mt-3 font-display font-bold text-white text-3xl md:text-4xl tracking-tight">
              One contract for large and regulated estates
            </h2>
            <p className="mt-4 text-[#CBD5E1] leading-relaxed">
              For organisations above 10,000 units or 500 developers, regulated industries, and
              security providers who run Onam for their own clients. Everything in Complete, plus
              SaaS and code security in one contract, with the controls and terms your procurement
              team expects.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <BrandButton to="/company/contact" size="lg">
                Talk to sales <ArrowRight className="w-4 h-4" />
              </BrandButton>
              <BrandButton
                to="/request-demo"
                search={{ product: "security" }}
                variant="onDark"
                size="lg"
              >
                Book a demo
              </BrandButton>
            </div>
          </div>
          <ul className="grid sm:grid-cols-2 gap-px bg-white/10 rounded-lg overflow-hidden">
            {enterprise.map((e) => (
              <li key={e.t} className="bg-[#0B1220] p-5 flex gap-3">
                <e.icon className="w-5 h-5 text-[#60A5FA] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm text-white">{e.t}</div>
                  <div className="mt-0.5 text-xs text-[#94A3B8] leading-relaxed">{e.d}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Compare */}
      <section className="bg-[#F7F9FC] border-b border-[#E5E9F0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-display font-bold text-[#0B1220] text-2xl md:text-3xl tracking-tight">
            Compare plans
          </h2>
          <p className="mt-2 text-[#475569]">
            Onam Security only. Estate, FinOps and DRM are separate products.
          </p>
          <div className="mt-8 overflow-x-auto rounded-lg border border-[#E5E9F0] bg-white">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E5E9F0] text-left">
                  <th className="px-5 py-4 font-semibold text-[#0B1220]"> </th>
                  {["Audit scan", "Posture", "Complete", "Enterprise"].map((h) => (
                    <th
                      key={h}
                      className={cn(
                        "px-5 py-4 font-display font-bold",
                        h === "Complete" ? "text-[#2563EB]" : "text-[#0B1220]",
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.label} className="border-b border-[#EEF1F5] last:border-0">
                    <td className="px-5 py-3 font-medium text-[#0B1220]">{row.label}</td>
                    {row.cells.map((c, i) => (
                      <td key={i} className="px-5 py-3 text-[#475569]">
                        <CellView v={c} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Other products */}
      <section id="products" className="bg-white pt-16 pb-10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-display font-bold text-[#0B1220] text-2xl md:text-3xl tracking-tight">
            Onam Estate, FinOps and DRM
          </h2>
          <p className="mt-2 text-sm text-[#475569] max-w-2xl leading-relaxed">
            Each is its own product, granted per organisation, not a tier of Onam Security. If you
            run more than one, they share one login, one console and one discovery, so your cloud
            accounts are connected once. No price is published yet; talk to us.
          </p>
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {PRODUCTS.filter((p) => p.key !== "security").map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.key} className="rounded-lg border border-[#E5E9F0] p-6 flex flex-col">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" style={{ color: p.color }} />
                    <div>
                      <div className="font-display font-bold text-[#0B1220]">{p.name}</div>
                      <div className="text-xs text-[#64748B]">{p.question}</div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-[#475569] leading-relaxed flex-1">
                    {getSuite(p.key).blurb}
                  </p>
                  <div className="mt-5 pt-4 border-t border-[#E5E9F0] flex items-center justify-between gap-4">
                    <Link
                      to={p.href}
                      className="text-sm font-medium text-[#2563EB] hover:underline"
                    >
                      What {p.name} does
                    </Link>
                    <Link
                      to="/request-demo"
                      search={{ product: p.key }}
                      className="text-sm font-semibold text-[#0B1220] hover:text-[#2563EB]"
                    >
                      Talk to us →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="aiops" className="bg-white pb-16 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-lg border border-[#E5E9F0] p-6 sm:p-8 grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div className="flex items-start gap-4">
              <IconTile icon={aiops.icon} color={aiops.color} size="lg" />
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display font-bold text-[#0B1220] text-2xl tracking-tight">
                    {aiops.name}
                  </h2>
                  <StatusChip status="early" />
                </div>
                <p className="mt-2 text-sm text-[#475569] leading-relaxed max-w-2xl">
                  By invitation. {OPS_STATUS.early.meaning} Agents work on your Onam Security data
                  today. No price is published.
                </p>
                <Link
                  to="/platform/ai-operations"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#2563EB] hover:underline"
                >
                  What Onam AIOps does <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                </Link>
              </div>
            </div>
            <BrandButton to="/request-demo" search={{ product: "aiops" }} variant="secondary">
              Ask for an invitation
            </BrandButton>
          </div>
        </div>
      </section>

      <MarketplaceStrip tone="surface" />

      {/* FAQ */}
      <section className="bg-white py-16 md:py-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
        />
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#1D4ED8]">
            <HelpCircle className="w-3.5 h-3.5" /> Pricing questions
          </div>
          <h2 className="mt-3 font-display font-bold text-[#0B1220] text-3xl tracking-tight">
            Things people ask before buying
          </h2>
          <div className="mt-8 divide-y divide-[#E5E9F0] border-y border-[#E5E9F0]">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full text-left py-5 flex items-center justify-between gap-4"
                  >
                    <span className="font-display font-semibold text-[#0B1220]">{f.q}</span>
                    <span
                      className={cn(
                        "shrink-0 text-[#64748B] transition-transform",
                        isOpen && "rotate-45 text-[#2563EB]",
                      )}
                    >
                      <Plus className="w-4 h-4" />
                    </span>
                  </button>
                  {isOpen && <div className="pb-5 text-[#475569] leading-relaxed">{f.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
