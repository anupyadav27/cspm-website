import { Building2, DollarSign, ShieldHalf, type LucideIcon } from "lucide-react";
import type { ProductPageData } from "@/components/site/ProductPageTemplate";

/**
 * The three products.
 *
 * This file exists because the site used to describe one product with twenty-six
 * engines inside it, while the platform had already shipped three. Onam Estate and
 * Onam FinOps are not security engines and must not be filed as though they were:
 * they are separately entitled products, granted per organisation by a platform
 * admin in `org_product_addons`, and never bundled into a plan tier.
 *
 * NO PRICE IS CLEARED for either add-on — see `proposed[key: products].pricing` in
 * marketing/facts/product.yaml. Every commercial surface says "Contact sales" until
 * a human clears a number there. Do not put a figure next to these two.
 *
 * Engine pages stay at /platform/* — those URLs are indexed and are not moving.
 * /security is the Onam Security product hub that gathers them.
 */

export type ProductSummary = {
  key: "security" | "estate" | "finops";
  name: string;
  href: string;
  icon: LucideIcon;
  color: string;
  /** The question a buyer arrives with. */
  question: string;
  /** One line, on the card. */
  blurb: string;
  /** How it is sold. Shown verbatim on /pricing. */
  packaging: string;
  surfaces: string[];
};

export const PRODUCTS: ProductSummary[] = [
  {
    key: "security",
    name: "Onam Security",
    href: "/security",
    icon: ShieldHalf,
    color: "#2563EB",
    question: "Is my cloud secure, and what do I fix first?",
    blurb:
      "Cloud posture, identity, data, workloads, attack paths and compliance — every engine on one security graph.",
    packaging: "Free, Pro, or Enterprise. The platform itself.",
    surfaces: ["Posture & Identity", "Threat & Attack", "Data & Network", "Workloads & Code", "SaaS, AI & Governance"],
  },
  {
    key: "estate",
    name: "Onam Estate",
    href: "/estate",
    icon: Building2,
    color: "#7C3AED",
    question: "What do we actually run, and how is it wired together?",
    blurb:
      "Continuous discovery of every cloud resource and the relationships between them — the estate of record, with cost on every row.",
    packaging: "Per-organisation add-on. Contact sales.",
    surfaces: ["Overview", "Inventory", "Architecture", "Pipeline"],
  },
  {
    key: "finops",
    name: "Onam FinOps",
    href: "/finops",
    icon: DollarSign,
    color: "#059669",
    question: "Where is the money going, and who owns it?",
    blurb:
      "Cloud cost and commitment management on reconciled billing data — attribution, forecast, budgets, anomalies and savings.",
    packaging: "Per-organisation add-on. Contact sales.",
    surfaces: ["Overview", "Explore", "Ownership", "Plan", "Savings", "Resources", "Runs"],
  },
];

export const productPages: Record<"estate" | "finops", ProductPageData> = {
  estate: {
    icon: Building2,
    iconColor: "#7C3AED",
    label: "Onam Estate",
    question: "What do we actually run, and how is it wired together?",
    headline: "You cannot secure, bill, or decommission a resource nobody knows exists.",
    metaDescription:
      "Onam Estate is a continuous cloud asset inventory: it discovers every resource, records how they connect, and keeps the picture current run after run.",
    sub:
      "Onam Estate discovers every resource across your cloud accounts, records the relationships between them, and keeps that picture current run after run — so the inventory is a live system of record rather than a spreadsheet somebody exported in March.",
    painPoint:
      "Someone asks a question that should take a minute: how many production databases do we have, in which accounts, and who pays for them. Four hours later there are three answers — one from the CMDB, one from a Terraform state file, one from a billing export — and none of them agree. The CMDB was last reconciled by hand, the state file only covers what was provisioned through the pipeline, and the billing export knows cost but not what a resource is connected to. The gap between those three is where forgotten infrastructure lives, and it is where both the security surprise and the cost surprise come from.",
    mechanism: [
      "A discovery pipeline enumerates resources across your connected accounts and regions using read-only credentials, and records what it found as assets with provider, region, account, state and last-seen time.",
      "Relationships are captured as first-class edges rather than inferred later — containment edges describe what lives inside what, external edges describe what reaches outside the boundary.",
      "Every run is recorded with its trigger, status, start and completion, so the inventory carries its own provenance and a stale or partial run is visible instead of silently degrading the picture.",
      "Assets are stamped with monthly cost as they are discovered, which is what makes the estate answerable to a finance question and not only to an engineering one.",
      "The same discovery output feeds Onam Security's graph, so an account entitled to both products gets one inventory rather than two that disagree.",
    ],
    whatYouGet: [
      "Asset inventory — every discovered resource with provider, region, account, state and last-seen time",
      "Monthly cost on every asset row, so the estate answers finance questions as well as engineering ones",
      "Architecture view — per-account topology with assets, edges, containment edges and external edges",
      "Relationship graph — what contains what, and what reaches outside the account boundary",
      "Pipeline history — every discovery run with its trigger, status and duration",
      "Asset type breakdown per account, so sprawl is visible by shape and not just by count",
      "Read-only discovery — no agents, no write permissions, nothing installed on a workload",
      "One shared inventory with Onam Security for organisations entitled to both",
    ],
    faqs: [
      {
        q: "How is this different from the asset inventory inside Onam Security?",
        a: "It is the same discovery, sold as its own product. Onam Security's inventory exists to answer security questions — what is exposed, what is over-permissioned, what sits on an attack path. Onam Estate is the estate of record: what exists, how it is connected, what it costs, and when it was last seen. Organisations entitled to both get one inventory feeding both, which is the point — a second inventory that disagrees with the first is worse than none.",
      },
      {
        q: "Do I need Onam Security to buy Onam Estate?",
        a: "No. Estate is granted per organisation as its own add-on. An Estate-only organisation gets discovery-only scans; an organisation with both gets the full pipeline. Neither one is bundled into a security plan tier.",
      },
      {
        q: "How is it deployed?",
        a: "It is not separately deployed at all from your point of view. Estate runs at /estate inside the same console, behind the same login, on the same session — you switch products from the product switcher, not by signing in somewhere else.",
      },
      {
        q: "Does discovery need agents or write access?",
        a: "Neither. Discovery uses read-only cloud credentials, the same connection model as the rest of the platform. Nothing is installed on a workload and nothing in your environment is modified.",
      },
      {
        q: "How current is the inventory?",
        a: "As current as the last successful run, and the console tells you when that was rather than presenting an undated picture. Every asset carries a last-seen time and every run carries its status, so a partial or failed run is visible instead of quietly leaving stale rows behind.",
      },
    ],
    related: [
      { label: "Onam FinOps — cost and commitments", href: "/finops" },
      { label: "Asset Inventory in Onam Security", href: "/platform/inventory" },
      { label: "Technology Engine — what is running on those assets", href: "/platform/technology" },
      { label: "CSPM — is any of it misconfigured", href: "/platform/cspm" },
    ],
  },

  finops: {
    icon: DollarSign,
    iconColor: "#059669",
    label: "Onam FinOps",
    question: "Where is the money going, and who owns it?",
    headline: "The bill arrives every month. The explanation does not.",
    metaDescription:
      "Onam FinOps turns reconciled cloud billing into what finance asks: what we spent, who owns it, what we will spend next, and what we can stop spending.",
    sub:
      "Onam FinOps turns reconciled billing data into the four answers finance actually asks for: what did we spend, who owns it, what will we spend next, and what can we stop spending — with the reconciliation history on the page so you can tell whether the number is trustworthy yet.",
    painPoint:
      "Cost went up eleven percent and nobody can say why before the next board meeting. The provider console shows the total but attributes it by account, not by team. The tagging strategy covers about two thirds of resources, so a third of the bill belongs to nobody. Savings recommendations arrive as a list with no owner attached, so they are read, agreed with, and never actioned. Meanwhile the finance team is reconciling against an export that landed mid-close, and no one is sure whether this month's figure is final or still moving.",
    mechanism: [
      "Billing data is ingested on a daily cadence with a separate monthly-close run, and each cost period reports both its billed cost and its effective cost so discounts and commitments are not silently flattened into one figure.",
      "Every ingestion run is recorded with its reconciliation state, so the console can tell you whether a period is settled or still moving instead of presenting a partial month as if it were final.",
      "Ownership rules attribute cost to owners and cost centres, and the attribution coverage is reported as a number alongside the unattributed amount — the honest version of tag-based allocation, which is never complete.",
      "Costs are decomposed by category, by owner, by resource and by day, with period-over-period movement so a change is traced to what moved rather than asserted.",
      "Forecasting produces a low, expected and high figure rather than a single line, budgets are tracked against it, and anomalies are surfaced against the daily series.",
      "Savings recommendations carry a portfolio upper bound and an explicit accept-or-dismiss decision, so a recommendation has a state and a person rather than being a row on a list.",
    ],
    whatYouGet: [
      "Billed cost and effective cost per period, with the difference visible rather than flattened",
      "Reconciliation status on every period — is this month settled, or still moving",
      "Cost by category, by owner, by resource and by day",
      "Period-over-period movement analysis — what actually changed, not just that it changed",
      "Attribution coverage percentage and the unattributed amount, stated plainly",
      "Ownership rules that map cost to owners and cost centres",
      "Forecast with low, expected and high bounds instead of a single false-precision line",
      "Budget tracking and anomaly detection against the daily cost series",
      "Savings recommendations with a portfolio upper bound and an accept or dismiss decision",
      "Ingestion and reconciliation run history, so the provenance of every figure is on the page",
    ],
    faqs: [
      {
        q: "What is the difference between billed cost and effective cost?",
        a: "Billed cost is what the provider invoiced. Effective cost spreads commitments and amortised charges across the periods they actually cover. Reporting only one of them is how a month with a large upfront reservation looks like a crisis, or how a discounted month looks like an efficiency win. Onam FinOps reports both.",
      },
      {
        q: "Do I need Onam Security to buy Onam FinOps?",
        a: "No. FinOps is granted per organisation as its own add-on and stands alone. It runs at /finops inside the same console behind the same login, so if you do have the other products it is a product switch rather than a separate tool.",
      },
      {
        q: "Our tagging is incomplete. Is the attribution useless?",
        a: "No, but you should expect the tool to tell you the truth about it. Attribution coverage is reported as a percentage with the unattributed amount beside it, so an incomplete tagging strategy shows up as a measured gap you can close rather than as a confident allocation that is quietly wrong.",
      },
      {
        q: "How often does cost data refresh?",
        a: "Ingestion runs daily, with a separate monthly-close run for the finalised period. The Runs view shows every ingestion and reconciliation with its outcome, so you can see when a figure last moved.",
      },
      {
        q: "Does it change anything in my cloud accounts?",
        a: "No. Savings recommendations are proposals with an accept or dismiss decision recorded against them. Accepting one records the decision; it does not reach into your account and resize or terminate a resource.",
      },
      {
        q: "How does it relate to Onam Estate?",
        a: "Estate stamps monthly cost onto every discovered asset, so the two answer adjacent halves of the same question — Estate tells you what exists and how it is connected, FinOps tells you what it costs, who owns it and where it is going. They are sold separately and each stands on its own.",
      },
    ],
    related: [
      { label: "Onam Estate — what you actually run", href: "/estate" },
      { label: "Asset Inventory in Onam Security", href: "/platform/inventory" },
      { label: "Pricing and packaging", href: "/pricing" },
      { label: "Book a demo", href: "/request-demo" },
    ],
  },
};
