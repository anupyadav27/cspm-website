import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Boxes,
  Check,
  Cpu,
  Database,
  KeyRound,
  Network,
  Radar,
  Users,
  Layers,
  type LucideIcon,
} from "@/components/site/icons";
import { FRAMEWORKS, fmt } from "@/lib/product-facts";

/**
 * Solution-page Coverage and Compliance (UX spec: research_notes/Product update Nov 2026/reviews/
 * product_sections_design.md §3).
 *
 * Coverage groups a cloud's services by what a security team owns (identity, compute, data, ...), so
 * the reader finds their estate in seconds instead of scanning a flat list of tick boxes.
 * Compliance shows each framework as a typographic badge with its kind and issuer. Never the issuer's
 * logo: the AICPA SOC and ISO marks are reserved for audited or certified organisations, and a logo
 * here would read as a certification claim. Every framework named on a solution page sits in the
 * automated tier of marketing/facts (frameworks.tiers), which is what the "Automated checks" badge says.
 */

/* ------------------------------- Coverage ------------------------------- */

type Category = { key: string; label: string; icon: LucideIcon; match: RegExp };

// Order matters: the first match wins (EKS is containers before "clusters"; KMS is keys before "encryption").
const CATEGORIES: Category[] = [
  { key: "containers", label: "Containers & Kubernetes", icon: Boxes, match: /\b(EKS|AKS|GKE|OKE|ACK|IKS|OpenShift|Kubernetes|Container Images|Admission|CRDs)\b/i },
  { key: "keys", label: "Keys & secrets", icon: KeyRound, match: /\b(KMS|Key Vault|Secrets?|Vault|Key Protect|Parameter Store)\b/i },
  { key: "detect", label: "Logging & security services", icon: Radar, match: /\b(CloudTrail|CloudWatch|Monitor|GuardDuty|Defender|Security Command Center|Cloud Guard|Security Zones|Logging|ActionTrail|Activity Tracker|Log Service)\b/i },
  { key: "identity", label: "Identity & organisation", icon: Users, match: /\b(IAM|Entra|RAM|RBAC|ServiceAccounts?|Access Groups|Management Groups|Organization|Compartments|Resource Groups)\b/i },
  { key: "compute", label: "Compute & workloads", icon: Cpu, match: /\b(EC2|Virtual Machines|Compute|ECS|Lambda|Functions|App Service|Cloud Run|Deployments|Pods|SNS|SQS)\b/i },
  { key: "data", label: "Data & storage", icon: Database, match: /\b(S3|Storage|Blob|OSS|COS|RDS|Aurora|SQL|Cosmos|BigQuery|Spanner|Database|Databases|PolarDB|MySQL)\b/i },
  { key: "network", label: "Network & edge", icon: Network, match: /\b(VPC|NACLs?|Load Balancers?|Front Door|Route 53|CloudFront|NSGs?|Network Security Groups|NetworkPolicies|VSwitch|VCNs?|NAT|Firewall|Internet Services|Ingress)\b/i },
];
const OTHER: Category = { key: "other", label: "More services", icon: Layers, match: /./ };

export function groupServices(services: string[]) {
  const groups = new Map<string, { cat: Category; items: string[] }>();
  for (const s of services) {
    const cat = CATEGORIES.find((c) => c.match.test(s)) ?? OTHER;
    if (!groups.has(cat.key)) groups.set(cat.key, { cat, items: [] });
    groups.get(cat.key)!.items.push(s);
  }
  // Present in a stable, reader-friendly order.
  const order = ["identity", "compute", "containers", "data", "network", "keys", "detect", "other"];
  return [...groups.values()].sort((a, b) => order.indexOf(a.cat.key) - order.indexOf(b.cat.key));
}

export function CoverageMap({
  heading,
  cloudName,
  services,
  plusNote,
}: {
  heading: string;
  cloudName: string;
  services: string[];
  plusNote?: string;
}) {
  const groups = groupServices(services);
  return (
    <section className="border-b border-line bg-surface py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-brand-700">Coverage</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">{heading}</h2>
          <p className="mt-3 text-[16px] leading-relaxed text-body">
            Every service below is scanned continuously. Posture scanning connects through read-only cloud roles;
            agentless workload scanning runs inside your account.
          </p>
        </div>
        <ul
          className="mt-10 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(16,24,40,.04)]"
          aria-label={`${cloudName} services by area`}
        >
          {groups.map(({ cat, items }) => {
            const Icon = cat.icon;
            return (
              <li key={cat.key} className="grid gap-3 px-5 py-4 md:grid-cols-[260px_minmax(0,1fr)] md:items-center md:gap-6 md:px-6">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-tint-blue text-brand-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-[16px] font-bold text-ink">{cat.label}</h3>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {items.map((s) => (
                    <li
                      key={s}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-1.5 text-[14px] font-medium text-ink-2 ring-1 ring-line"
                    >
                      <Check className="h-3.5 w-3.5 shrink-0 text-brand-600" aria-hidden />
                      {s}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
        {plusNote && (
          <p className="mt-5 rounded-2xl border border-dashed border-line-strong bg-white/60 px-5 py-4 text-[14.5px] leading-relaxed text-body">
            <span className="font-semibold text-ink">Also checked: </span>
            {plusNote}
          </p>
        )}
      </div>
    </section>
  );
}

/* ------------------------------ Compliance ------------------------------ */

type FrameworkMeta = { badge: string; kind: string; issuer: string };

const FRAMEWORK_META: { match: RegExp; meta: FrameworkMeta }[] = [
  { match: /^CIS\b/i, meta: { badge: "CIS", kind: "Configuration benchmark", issuer: "Center for Internet Security" } },
  { match: /NIST 800-171/i, meta: { badge: "NIST", kind: "Protecting CUI", issuer: "NIST · US" } },
  { match: /NIST 800-53/i, meta: { badge: "NIST", kind: "Security control catalogue", issuer: "NIST · US" } },
  { match: /FedRAMP/i, meta: { badge: "FedRAMP", kind: "US government cloud baseline", issuer: "GSA · US" } },
  { match: /PCI/i, meta: { badge: "PCI", kind: "Card payments", issuer: "PCI Security Standards Council" } },
  { match: /SOC 2/i, meta: { badge: "SOC 2", kind: "Trust Services Criteria", issuer: "AICPA" } },
  { match: /ISO 27001/i, meta: { badge: "ISO", kind: "Information security management", issuer: "ISO/IEC" } },
  { match: /GDPR/i, meta: { badge: "GDPR", kind: "Data protection law", issuer: "European Union" } },
  { match: /HIPAA/i, meta: { badge: "HIPAA", kind: "Health data security", issuer: "US HHS" } },
  { match: /RBI/i, meta: { badge: "RBI", kind: "Banking regulation", issuer: "Reserve Bank of India" } },
];

export function frameworkMeta(name: string): FrameworkMeta {
  return FRAMEWORK_META.find((f) => f.match.test(name))?.meta ?? { badge: name.split(/\s/)[0], kind: "Framework", issuer: "" };
}

export function FrameworkWall({
  heading,
  lead,
  frameworks,
}: {
  heading: string;
  lead: string;
  frameworks: { name: string; note?: string }[];
}) {
  return (
    <section className="border-b border-line bg-white py-20 md:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)] lg:gap-14">
        <div>
          <p className="text-sm font-semibold text-brand-700">Compliance</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">{heading}</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-body">{lead}</p>
          <div className="mt-8 rounded-2xl bg-night p-6 text-white">
            <div className="font-display text-[44px] font-black leading-none">{fmt(FRAMEWORKS)}</div>
            <div className="mt-2 text-[15px] font-semibold">compliance frameworks in Onam</div>
            <div className="mt-4 flex flex-wrap gap-2 text-[13px]">
              <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">119 with automated checks</span>
              <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">25 attestation-only</span>
            </div>
            <Link
              to="/platform/compliance"
              className="mt-6 inline-flex min-h-6 items-center gap-1.5 text-[14px] font-semibold text-[#BFD3FF] hover:text-white"
            >
              See how compliance works <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-muted-500">
            Mapping shows which findings affect each control. It is evidence for your audit, not a certification.
          </p>
        </div>
        <ul className={`grid content-start gap-3 ${frameworks.some((f) => f.note) ? "md:grid-cols-2" : "sm:grid-cols-2"}`}>
          {frameworks.map((f) => {
            const m = frameworkMeta(f.name);
            return (
              <li key={f.name} className="flex gap-4 rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,.04)]">
                <div
                  aria-hidden
                  className="grid h-12 w-16 shrink-0 place-items-center self-start rounded-xl bg-ink px-1 text-center font-display text-[12px] font-black leading-tight tracking-tight text-white"
                >
                  {m.badge}
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-[16px] font-bold leading-snug text-ink">{f.name}</h3>
                  <p className="mt-0.5 text-[13px] text-muted-500">
                    {m.kind}
                    {m.issuer && ` · ${m.issuer}`}
                  </p>
                  {f.note && <p className="mt-2 text-[14px] leading-relaxed text-body">{f.note}</p>}
                  <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#E7F6EE] px-2 py-0.5 text-[12px] font-bold text-[#0F6B3D]">
                    <Check className="h-3 w-3" aria-hidden /> Automated checks
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
