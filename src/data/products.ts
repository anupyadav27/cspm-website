import { Building2, DollarSign, LifeBuoy, ShieldHalf, type LucideIcon } from "lucide-react";
import type { ProductPageData } from "@/components/site/ProductPageTemplate";

/**
 * The four products, plus Onam Operations (early access) across them.
 *
 * Owner-cleared positioning (product.yaml `availability_cleared`, 2026-10-05): Onam is ONE
 * end-to-end platform — Estate (assets) -> Security -> FinOps (cost) -> DRM (recovery).
 * Estate, FinOps and DRM are available; each product is described only by what its code does.
 *
 * This file exists because the site used to describe one product with twenty-six
 * engines inside it, while the platform had already shipped three. Onam Estate and
 * Onam FinOps are not security engines and must not be filed as though they were:
 * they are separately entitled products, granted per organisation by a platform
 * admin in `org_product_addons`, and never bundled into a plan tier.
 *
 * NO PRICE IS CLEARED for any add-on — see `proposed[key: products].pricing` in
 * marketing/facts/product.yaml. Every commercial surface says "Contact sales" until
 * a human clears a number there. Do not put a figure next to any of them.
 *
 * Engine pages stay at /platform/* — those URLs are indexed and are not moving.
 * /platform is the Onam Security product hub that gathers them. (/security now 301s to
 * /trust, so it must not be used as the Security product link.)
 */

export type ProductSummary = {
  key: "security" | "estate" | "finops" | "drm";
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
    href: "/platform",
    icon: ShieldHalf,
    color: "#2563EB",
    question: "Is my cloud secure, and what do I fix first?",
    blurb:
      "Cloud posture, identity, data, workloads, attack paths and compliance — every engine on one security graph.",
    packaging: "Free, Pro, or Enterprise. The platform itself.",
    surfaces: [
      "Posture & Identity",
      "Threat & Attack",
      "Data & Network",
      "Workloads & Code",
      "SaaS, AI & Governance",
    ],
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
  {
    key: "drm",
    name: "Onam DRM",
    href: "/disaster-recovery",
    icon: LifeBuoy,
    color: "#D97706",
    question: "If a region fails tonight, what comes back, in what order, and how fast?",
    blurb:
      "Disaster recovery management — applications and dependencies mapped, protection read from cloud configuration, predicted RTO and RPO against your targets, and drift from the plan you approved.",
    packaging: "Per-organisation add-on. Contact sales.",
    surfaces: ["Applications", "Protection", "Recovery plans", "Objectives", "Drills", "Drift"],
  },
];

/** Hero tiles for the add-on pages: what the product does, in words — no uncleared figures. */
const ESTATE_STATS = [
  { v: "7 clouds", l: "in the shared inventory" },
  { v: "Every run", l: "recorded with its status" },
  { v: "Cost", l: "on every asset row" },
  { v: "One", l: "inventory for every product" },
];

export const productPages: Record<"estate" | "finops" | "drm", ProductPageData> = {
  estate: {
    icon: Building2,
    iconColor: "#7C3AED",
    label: "Onam Estate",
    question: "What do we actually run, and how is it wired together?",
    headline: "You cannot secure, bill, or decommission a resource nobody knows exists.",
    metaDescription:
      "Onam Estate is a continuous cloud asset inventory: it discovers every resource, records how they connect, and keeps the picture current run after run.",
    sub: "Onam Estate discovers every resource across your cloud accounts, records the relationships between them, and keeps that picture current run after run — so the inventory is a live system of record rather than a spreadsheet somebody exported in March.",
    painPoint:
      "Someone asks a question that should take a minute: how many production databases do we have, in which accounts, and who pays for them. Four hours later there are three answers — one from the CMDB, one from a Terraform state file, one from a billing export — and none of them agree. The CMDB was last reconciled by hand, the state file only covers what was provisioned through the pipeline, and the billing export knows cost but not what a resource is connected to. The gap between those three is where forgotten infrastructure lives, and it is where both the security surprise and the cost surprise come from.",
    mechanism: [
      "A discovery pipeline enumerates resources across your connected accounts and regions using read-only credentials, and records what it found as assets with provider, region, account, state and last-seen time.",
      "Relationships are captured as first-class edges rather than inferred later — containment edges describe what lives inside what, external edges describe what reaches outside the boundary.",
      "Every run is recorded with its trigger, status, start and completion, so the inventory carries its own provenance and a stale or partial run is visible instead of silently degrading the picture.",
      "Assets are stamped with monthly cost as they are discovered, which is what makes the estate answerable to a finance question and not only to an engineering one.",
      "The same inventory feeds Onam Security's graph and Onam DRM's application map, so an organisation running more than one product gets one inventory rather than several that disagree.",
    ],
    whatYouGet: [
      "Asset inventory — every discovered resource with provider, region, account, state and last-seen time",
      "Monthly cost on every asset row, so the estate answers finance questions as well as engineering ones",
      "Architecture view — per-account topology with assets, edges, containment edges and external edges (AWS accounts today)",
      "Relationship graph — what contains what, and what reaches outside the account boundary",
      "Pipeline history — every discovery run with its trigger, status and duration",
      "Asset type breakdown per account, so sprawl is visible by shape and not just by count",
      "Read-only discovery — no agents, no write permissions, nothing installed on a workload",
      "One shared inventory with Onam Security and Onam DRM",
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
        q: "Which clouds does Estate cover?",
        a: "The asset inventory covers all seven clouds Onam supports — AWS, Azure, Google Cloud, Oracle Cloud, Alibaba Cloud, IBM Cloud and Kubernetes — because it comes from the platform's shared discovery. The per-account architecture view draws AWS accounts today.",
      },
      {
        q: "How current is the inventory?",
        a: "As current as the last successful run, and the console tells you when that was rather than presenting an undated picture. Every asset carries a last-seen time and every run carries its status, so a partial or failed run is visible instead of quietly leaving stale rows behind.",
      },
    ],
    stats: ESTATE_STATS,
    hideDemo: true,
    risk: {
      title: "The cost of an inventory nobody trusts",
      body: "Every other answer — what is exposed, what it costs, what has to come back first after an outage — starts from the list of what exists. If that list is wrong, every answer built on it is wrong too.",
      tagline: "The first stage of the Onam platform",
    },
    ctaLine:
      "Connect your cloud once. Estate, Security, FinOps and DRM all read the same discovery.",
    related: [
      { label: "The Onam platform — from assets to a resilient cloud", href: "/" },
      { label: "Onam FinOps — cost and commitments", href: "/finops" },
      { label: "Onam DRM — disaster recovery on the same inventory", href: "/disaster-recovery" },
      { label: "Asset Inventory in Onam Security", href: "/platform/inventory" },
      {
        label: "Technology Engine — what is running on those assets",
        href: "/platform/technology",
      },
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
    sub: "Onam FinOps turns reconciled billing data into the four answers finance actually asks for: what did we spend, who owns it, what will we spend next, and what can we stop spending — with the reconciliation history on the page so you can tell whether the number is trustworthy yet.",
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
    stats: [
      { v: "Daily", l: "cost ingestion" },
      { v: "Billed + effective", l: "cost, side by side" },
      { v: "Low · expected · high", l: "forecast range" },
      { v: "Accept / dismiss", l: "on every saving" },
    ],
    hideDemo: true,
    risk: {
      title: "The cost of an unexplained bill",
      body: "Spend nobody owns is spend nobody reduces. Without attribution and a settled number, every cost conversation starts with an argument about whose figure is right.",
      tagline: "The cost stage of the Onam platform",
    },
    ctaWhere: "on your billing data",
    ctaLine:
      "FinOps reads billing data and changes nothing in your accounts. It runs in the same console as Estate, Security and DRM.",
    related: [
      { label: "The Onam platform — from assets to a resilient cloud", href: "/" },
      { label: "Onam Estate — what you actually run", href: "/estate" },
      { label: "Asset Inventory in Onam Security", href: "/platform/inventory" },
      { label: "Pricing and packaging", href: "/pricing" },
      { label: "Book a demo", href: "/request-demo" },
    ],
  },

  /*
   * Onam DRM. Every claim below is grounded in /Users/apple/Desktop/SECAIOPS/drm (code and
   * API routes, not READMEs). What it does NOT do matters as much: it does not execute a
   * recovery, does not run DR tests, and has no connector to any backup product. Drills
   * are RECORDED (drill-engine ENGINE_SPEC §5); protection is read from cloud
   * configuration only (protection-engine/services/classify.js).
   */
  drm: {
    icon: LifeBuoy,
    iconColor: "#D97706",
    label: "Onam DRM",
    question: "If a region fails tonight, what comes back, in what order, and how fast?",
    headline: "Your recovery plan was right the day it was signed. The cloud has moved since.",
    metaDescription:
      "Onam DRM maps applications and dependencies, reads backup and replication coverage, predicts RTO and RPO against your targets and flags drift from plan.",
    sub: "Onam DRM maps your applications and what they depend on, reads the backup and replication your cloud configuration actually has, predicts recovery time and data loss against the targets you set, and tells you when the estate drifts from the recovery model you approved.",
    painPoint:
      "The recovery plan lives in a document that was reviewed for last year's audit. Since then a team added a database without a replica, another moved a service to a new region, and the runbook still lists the old order of start-up. Nobody is hiding anything; nobody is checking either. The plan says the application comes back in an hour. The only way to find out it will not is the outage itself, or a drill nobody has had time to schedule.",
    mechanism: [
      "DRM starts from the Onam platform's cloud inventory rather than a separate scan, and places each resource where the provider says it lives — its availability zone where one is given, its region otherwise. It does not guess a placement the provider does not state.",
      "Applications are proposed from your tags, each with the tag it came from and a confidence in what that tag means. An infrastructure grouping such as a Kubernetes cluster is labelled as one, and resources that could not be grouped are shown as plainly as those that could.",
      "Dependencies come from a catalogue of how cloud resources relate, and each edge says what kind it is: something that must recover first, something that proves a copy exists, or something that shares a failure domain. Only the first kind sets recovery order.",
      "Protection is read from cloud configuration — backup plans and retention, snapshots, replicas, multi-zone and cross-region replication. A configured mechanism is reported as found, never as proven: configuration does not show whether last night's backup succeeded or whether a restore has ever worked, and DRM does not pretend it does. There are no connectors to backup products.",
      "Recovery plans are composed from approved applications, dependencies and protection: ordered steps, work that can run in parallel, and for every step whether its position came from a discovered dependency or from convention.",
      "Predicted RTO is the critical path through the approved plan; predicted RPO is the worst replication link, taking the larger of observed lag and configured target. Where a figure cannot be derived — no plan, or backup-only protection with no recorded frequency — it is left blank rather than guessed. Required RTO and RPO are your inputs, and a calculated value never overwrites them.",
      "Engines propose and people approve. Approved models are frozen as baselines, and drift is measured against the baseline you signed off — not against last week's scan — and ranked by what it does to recoverability. A rejected proposal is remembered and not proposed again.",
      "DR drills run in your own tooling are recorded in DRM — planned, running, completed — with the measured recovery time and data loss set against the prediction captured when the drill was planned. DRM records drills; it does not run them or execute a failover.",
    ],
    whatYouGet: [
      "Application map — applications, components and resources, with the tag and confidence behind every grouping",
      "Dependency graph — recovery-order, protection and failure-domain edges, with unresolved edges kept visible",
      "Protection coverage — backup, snapshot and replication as configured, per resource and per application",
      "Recovery readiness — each application rated ready, warning, at risk or not ready",
      "Predicted RTO and RPO — set against the required targets you enter",
      "Ordered recovery plans — steps, parallel groups and the critical path",
      "Approval center — nothing enters a plan or baseline until a person approves it",
      "Drift from baseline — what changed since sign-off, ranked by consequence for recovery",
      "Drill records — planned against actual recovery time and data loss, with issues found",
      "Executive resilience scorecard — plan exists, within required RTO, governed by a baseline, proven by a drill",
    ],
    stats: [
      { v: "Predicted", l: "RTO and RPO" },
      { v: "Your targets", l: "never overwritten" },
      { v: "Baseline", l: "drift measured against sign-off" },
      { v: "Drills", l: "recorded, prediction vs actual" },
    ],
    hideDemo: true,
    risk: {
      title: "The cost of an untested plan",
      body: "A recovery time that is wrong on the high side is a nuisance. Wrong on the low side, you find out during the outage. DRM is built to show the gaps before then.",
      tagline: "The recovery stage of the Onam platform",
    },
    ctaWhere: "on your applications",
    ctaLine:
      "DRM runs in the same console as Estate, Security and FinOps, on the same inventory — your cloud accounts are connected once.",
    faqs: [
      {
        q: "Does Onam DRM run the failover or the DR test?",
        a: "No. DRM plans, predicts and records. It composes the recovery order, predicts how long it should take and how much data could be lost, and records the drills you run with your own tools and runbooks — comparing what happened with what was predicted. It does not execute a recovery or start a test in your environment.",
      },
      {
        q: "Does it connect to our backup product?",
        a: "No. DRM reads protection from your cloud configuration — for example database automated backups and multi-zone deployments, storage replication, snapshots and cloud backup plans. That shows a mechanism is configured. It does not show that last night's job succeeded or that a restore works, and DRM reports it as configured rather than as protected.",
      },
      {
        q: "Where do the RTO and RPO numbers come from?",
        a: "Three places, kept apart. Required RTO and RPO are what you enter for each application. Predicted values are calculated: recovery time from the critical path through the approved plan, data loss from the worst replication link. Actual values come from the drills you record. A calculated figure never overwrites one you entered, and where a prediction cannot be derived the field stays blank rather than showing a guess.",
      },
      {
        q: "What is drift, and why against a baseline?",
        a: "When you approve an application's recovery model, DRM freezes it as a baseline. Drift is any later difference between that baseline and the current state — a new resource without protection, a changed recovery site, a dependency that moved. Comparing against what you signed off, rather than last week's scan, answers the question an auditor asks: has anything changed since the plan was approved?",
      },
      {
        q: "Do I need Onam Security or Onam Estate to buy DRM?",
        a: "DRM is granted per organisation as its own add-on. It reads the platform's cloud inventory, so your cloud accounts are connected once and every product you use works from the same list of resources. It runs inside the same console, behind the same login.",
      },
      {
        q: "Does DRM change anything in our cloud accounts?",
        a: "No. It reads configuration and inventory, and the changes it tracks — approvals, baselines, drill records — are records inside DRM, not changes to your cloud.",
      },
    ],
    related: [
      { label: "The Onam platform — from assets to a resilient cloud", href: "/" },
      { label: "Onam Estate — the inventory DRM builds on", href: "/estate" },
      { label: "Onam FinOps — what it all costs", href: "/finops" },
      { label: "DRM documentation", href: "/docs/drm/overview" },
    ],
  },
};
