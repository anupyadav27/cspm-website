import type { DocArticle } from "./types";

/**
 * Onam Estate and Onam FinOps.
 *
 * These are separate PRODUCTS, not features of Onam Security, and the docs say so on
 * every page — because the first support question either one generates is "I have Pro,
 * why can't I see it", and the answer is entitlement, not a bug.
 *
 * No price appears anywhere in this file. None is cleared in
 * marketing/facts/product.yaml; see `proposed[key: products].pricing`.
 */
export const articles: DocArticle[] = [
  /* ─────────────────────────────  ONAM ESTATE  ───────────────────────────── */
  {
    slug: "estate/overview",
    title: "Onam Estate",
    breadcrumb: "Onam Estate / Overview",
    body: `
**Onam Estate** is the cloud estate of record. It discovers every resource across your connected accounts, records the relationships between them, and keeps that picture current run after run — so the inventory is a live system rather than a spreadsheet somebody exported once.

It is a **separate product**, not a feature of Onam Security. It is granted per organisation and is never bundled into a security plan tier.

## What it answers

| Question | Where |
| --- | --- |
| What do we run, where, and in which account? | [Inventory](/docs/estate/inventory) |
| How is it wired together, and what reaches outside? | [Architecture](/docs/estate/architecture) |
| Is the picture current, and did the last run finish? | [Pipeline](/docs/estate/pipeline) |
| Why can't I see any of this? | [Access & entitlement](/docs/estate/access) |

## Why an estate product exists at all

Ask how many production databases you run and you will get three answers: one from the CMDB, one from Terraform state, one from the billing export. The CMDB was last reconciled by hand. The state file only covers what was provisioned through the pipeline. The billing export knows cost but not what a resource connects to.

The gap between those three is where forgotten infrastructure lives — and it is the same gap that produces both the security surprise and the cost surprise. Estate closes it by making discovery the source, not reconciliation.

## How discovery works

1. A discovery pipeline enumerates resources across your connected accounts and regions using the **same read-only credentials** as the rest of the platform. Nothing is installed and nothing is modified.
2. Each resource is written as an **asset** with provider, region, account, state, last-seen time and monthly cost.
3. Relationships are written as **edges** — containment edges describe what lives inside what, external edges describe what crosses the account boundary.
4. Every pass is recorded as a **run** with its trigger, status, start and completion, so the inventory carries its own provenance.

> Estate and Onam Security share one discovery pass. An organisation entitled to both does not connect its cloud accounts twice, and does not get two inventories that disagree.

## What it is not

Estate does not evaluate posture rules, score risk, or raise security findings — that is [Onam Security](/docs/getting-started/introduction). Estate answers what exists and how it is connected. The two products read the same discovery output and answer different questions from it.
`,
  },
  {
    slug: "estate/inventory",
    title: "Asset Inventory",
    breadcrumb: "Onam Estate / Inventory",
    body: `
The **Inventory** view lists every resource the discovery pipeline has found, across every connected account and region.

## Columns

| Column | What it holds |
| --- | --- |
| Asset | The resource name, with its type |
| Provider | Which cloud it was discovered in |
| Region | The region it lives in |
| Account | The account or subscription that owns it |
| Monthly cost | What the resource costs per month |
| State | The resource's current lifecycle state |
| Last seen | How long ago discovery last confirmed it exists |

## Why cost is on a security-adjacent inventory

Because the two questions are asked by the same person about the same resource, ten minutes apart. An inventory that cannot answer "what does this cost" sends its user to the billing console, where the resource is identified differently and connected to nothing. Estate stamps monthly cost onto the asset row so the estate is answerable to a finance question without leaving the page.

For the full cost picture — attribution, forecast, budgets, anomalies and savings — see [Onam FinOps](/docs/finops/overview), which is a separate product.

## Last seen, and why it matters

Every asset carries the time discovery last confirmed it. A resource that stops appearing does not silently vanish from the list; its last-seen time ages, which is how decommissioned-but-not-really infrastructure becomes visible.

> If last-seen times across a whole account are ageing together, that is a pipeline problem rather than a decommissioning event. Check [Pipeline](/docs/estate/pipeline) before concluding anything about the account.

## Pagination on large estates

Inventory listings are keyset-paginated. On estates past a few hundred thousand assets, offset pagination degrades badly enough to exceed the query timeout — keyset paging holds a constant cost per page regardless of how deep you are in the list.
`,
  },
  {
    slug: "estate/architecture",
    title: "Architecture",
    breadcrumb: "Onam Estate / Architecture",
    body: `
The **Architecture** view summarises the topology of a single account: what it holds, and how the pieces connect.

## The four figures

| Figure | Meaning |
| --- | --- |
| Assets | Resources discovered in this account |
| Edges | Total recorded relationships between them |
| Containment edges | "Lives inside" relationships — a subnet in a VPC, a container in a task |
| External edges | Relationships that cross the account boundary |

**External edges are the number to read first.** They are the account's actual connection to everything outside it — the peering, the cross-account trust, the shared service. An account with very few external edges is genuinely isolated; one with many is not, whatever the architecture diagram says.

## Asset type breakdown

Alongside the counts, the view breaks assets down by type, so sprawl is visible by shape rather than only by total. Two thousand assets that are mostly log groups is a very different estate from two thousand that are mostly compute.

## Scenes are built by the pipeline

The architecture view renders from a scene the discovery pipeline builds. If an account has never completed a run, there is no scene and the view says so rather than drawing an empty diagram that reads as "nothing here". Run the pipeline from the [Pipeline](/docs/estate/pipeline) view first.
`,
  },
  {
    slug: "estate/pipeline",
    title: "Discovery Pipeline",
    breadcrumb: "Onam Estate / Pipeline",
    body: `
The **Pipeline** view is the run history for discovery — every pass over your accounts and regions, with what triggered it and how it ended.

## Run record

| Field | Meaning |
| --- | --- |
| Run | The scan run identifier |
| Trigger | What started it — schedule, onboarding, or a manual request |
| Status | How it ended |
| Started / Completed | When it ran, and how long it took |

## Why the run history is a first-class view

An inventory without provenance is a claim. When someone asks whether a resource is really gone, the answer depends entirely on whether the last run over that account actually finished — and a failed or partial run leaves an inventory that looks complete and is not. Putting run status on its own page means a stale picture is visible as a stale picture.

## Scan scope follows entitlement

What the pipeline runs depends on which products the organisation has:

- **Estate only** — discovery runs on its own.
- **Estate and Onam Security** — the full pipeline runs, and both products read the same output.

There is nothing to configure for this. Scheduling is automatic and follows the entitlement.
`,
  },
  {
    slug: "estate/access",
    title: "Access & Entitlement",
    breadcrumb: "Onam Estate / Access",
    body: `
## One login, one console

Onam Estate runs at **/estate** inside the same console as the rest of the platform, behind the same session. You switch to it from the product switcher — there is no second login, no second URL to remember and no separate credential.

## Entitlement

Estate is a **per-organisation add-on**, granted individually. It is not part of any Onam Security plan tier, so upgrading a security plan does not turn it on.

- Organisations without the grant do not see the Estate link at all — it is hidden rather than shown greyed-out.
- The API gateway enforces the same grant server-side on every Estate request, so hiding the link is a user-experience choice and not the security boundary.

> **"I'm on Enterprise, why can't I see Estate?"** Because it is not a tier feature. Ask your platform administrator to grant the add-on for your organisation, or [talk to us](/request-demo).

## Permissions

Discovery uses the same read-only posture-scanning access as the rest of the platform — a read-only IAM role, service principal, or service account. Discovery installs nothing on a workload and never writes to your environment.
`,
  },

  /* ─────────────────────────────  ONAM FINOPS  ───────────────────────────── */
  {
    slug: "finops/overview",
    title: "Onam FinOps",
    breadcrumb: "Onam FinOps / Overview",
    body: `
**Onam FinOps** is cloud cost and commitment management built on reconciled billing data. It answers four questions: what did we spend, who owns it, what will we spend next, and what can we stop spending.

It is a **separate product**, not a feature of Onam Security. It is granted per organisation and is never bundled into a security plan tier.

## What it answers

| Question | Where |
| --- | --- |
| What did we spend, and is the number final? | [Cost model](/docs/finops/cost-model) |
| What changed since last period, and where? | [Explore](/docs/finops/explore) |
| Who owns this spend? | [Ownership](/docs/finops/ownership) |
| What will we spend, and are we over budget? | [Plan](/docs/finops/plan) |
| What can we stop spending? | [Savings](/docs/finops/savings) |
| Can I trust this month's figure yet? | [Runs](/docs/finops/runs) |
| Why can't I see any of this? | [Access & entitlement](/docs/finops/access) |

## The design principle: say how settled the number is

Most cost tools present a figure without saying whether it is final. A partial month rendered like a closed one is how a team spends a week explaining a spike that reconciliation would have removed on its own.

Onam FinOps reports the reconciliation state alongside every period, reports **both** billed and effective cost rather than flattening them into one, and states attribution coverage as a percentage instead of implying that allocation is complete. The figures are less tidy and considerably more useful.
`,
  },
  {
    slug: "finops/cost-model",
    title: "The Cost Model",
    breadcrumb: "Onam FinOps / Cost model",
    body: `
## Billed cost and effective cost

Every period reports two figures, and they are different on purpose.

| Figure | What it is |
| --- | --- |
| **Billed cost** | What the provider invoiced in this period |
| **Effective cost** | Cost with commitments and amortised charges spread across the periods they actually cover |

Reporting only billed cost makes the month you buy a three-year reservation look like a crisis, and the following thirty-five months look like an efficiency programme. Reporting only effective cost makes it impossible to reconcile against the invoice finance actually received. So both are reported, side by side.

## Ingestion cadence

Cost data is ingested on two schedules:

- **Daily** — the running picture of the current period.
- **Monthly close** — the finalised run for a completed period.

Because the current period is still being ingested, its figure moves. The [Runs](/docs/finops/runs) view shows when it last moved and whether the period has closed.

## Reconciliation

Each period carries a reconciliation state describing how well the ingested records agree with the source billing data. Read it before quoting a figure to anyone: an unreconciled current period is a working estimate, and the console labels it as one rather than presenting it as settled.

## Categories and dimensions

Cost decomposes by **category**, by **owner**, by **resource** and by **day**. Category partitioning is checked for balance — if the parts do not add to the whole, the console says so rather than rendering a chart that quietly drops the remainder.
`,
  },
  {
    slug: "finops/explore",
    title: "Explore",
    breadcrumb: "Onam FinOps / Explore",
    body: `
**Explore** is the daily cost series and period-over-period movement.

## Daily trend

The daily series is the granularity at which cost questions are actually answerable. A monthly total tells you spend went up; the daily series tells you it went up on the fourteenth, which is a question with an answer.

## Movement

Movement compares the current period against the previous one along a chosen dimension and reports what changed, ranked by contribution. The output is a list of movers rather than a single delta, because "cost rose eleven percent" is not actionable and "one service in one account accounts for nine of those points" is.

> Movement on a period that has not closed compares a partial period against a complete one. The console flags partial data; read the [Runs](/docs/finops/runs) view before drawing a conclusion from an early-month comparison.
`,
  },
  {
    slug: "finops/ownership",
    title: "Ownership & Attribution",
    breadcrumb: "Onam FinOps / Ownership",
    body: `
**Ownership** attributes cost to owners and cost centres, and is honest about how much of the bill it could not attribute.

## The three figures

| Figure | Meaning |
| --- | --- |
| **Attribution coverage** | The share of spend that ownership rules could assign |
| **Unattributed** | The amount that no rule matched |
| **Total** | The period's total spend |

Coverage is reported as a number because tag-based allocation is never complete, and a tool that hides the gap produces confident allocations that are quietly wrong. A coverage figure of seventy percent is a measurable problem you can close. An unstated one is a problem you argue about in a meeting.

## Ownership rules

Rules map resources to owners and cost centres. Unattributed spend is the working list for improving them — each rule you add moves a slice from unattributed into coverage, and the number tells you immediately whether it worked.

## Attribution is not chargeback

Ownership answers who is responsible for spend. It does not move money between ledgers, issue internal invoices, or enforce anything. It is the input a chargeback process needs, not the process itself.
`,
  },
  {
    slug: "finops/plan",
    title: "Forecast, Budgets & Anomalies",
    breadcrumb: "Onam FinOps / Plan",
    body: `
**Plan** covers the forward-looking half of cost management.

## Forecast: three numbers, not one

The forecast reports a **low**, an **expected** and a **high** figure.

A single forecast line is false precision — it is wrong every month, and being wrong every month is how a forecast stops being read. A band communicates what a forecast actually knows, and a period that lands outside it is genuinely informative rather than routine.

## Budgets

Budgets are tracked against the forecast and against actuals. A budget that only compares against actuals tells you about the overrun after it has happened; comparing against the forecast is what makes the warning early enough to act on.

## Anomalies

Anomalies are detected against the daily cost series rather than against monthly totals — a spike that starts on the ninth and is corrected on the eleventh does not exist in a monthly figure at all.

> Anomaly detection needs enough daily history to have a baseline. A newly connected account produces few useful anomalies until the series is long enough to have a shape.
`,
  },
  {
    slug: "finops/savings",
    title: "Savings",
    breadcrumb: "Onam FinOps / Savings",
    body: `
**Savings** holds cost-reduction recommendations, each with a decision attached.

## Portfolio upper bound

The headline figure is an **upper bound** on what the open recommendations could save if every one of them were accepted and realised. It is deliberately labelled as a bound rather than a projection — every savings tool that presents its ceiling as an expectation trains its users to ignore the number within two quarters.

## Every recommendation has a state

A recommendation is **accepted** or **dismissed**, and the decision is recorded. This is the difference between a savings feature and a savings list: a list gets read, agreed with, and never actioned, because nothing in it has an owner or an outcome.

## Nothing is changed in your account

Accepting a recommendation records the decision. It does not reach into your cloud account and resize, stop, or delete anything. Onam FinOps holds read-only billing access and acts on nothing.

> If you want the recommendation executed, that is a change your own change-management process makes. The record of the accepted decision is what it works from.
`,
  },
  {
    slug: "finops/runs",
    title: "Runs & Reconciliation",
    breadcrumb: "Onam FinOps / Runs",
    body: `
**Runs** is the ingestion and reconciliation history — the provenance behind every figure in the product.

## What a run records

Each run records what it ingested, when, and how it ended. Between them, the daily runs and the monthly-close runs describe exactly how settled any given period is.

## How to read it

- **A current period with recent daily runs** — the figure is live and will keep moving.
- **A period with a completed monthly close** — the figure is settled, and quotable.
- **A gap in the run history** — the figures for that window are incomplete, whatever the charts show.

## Why this is a page and not a footnote

Every other view in Onam FinOps presents a number. This is the view that tells you how much to trust it. A cost tool without visible ingestion history asks its users to take every figure on faith, and the first time a figure moves after someone has quoted it, faith is what they lose.
`,
  },
  {
    slug: "finops/access",
    title: "Access & Entitlement",
    breadcrumb: "Onam FinOps / Access",
    body: `
## One login, one console

Onam FinOps runs at **/finops** inside the same console as the rest of the platform, behind the same session. You switch to it from the product switcher — no second login, no separate credential.

## Entitlement

FinOps is a **per-organisation add-on**, granted individually. It is not part of any Onam Security plan tier, so upgrading a security plan does not turn it on.

- Organisations without the grant do not see the FinOps link.
- The API gateway enforces the same grant server-side on every FinOps request. Hiding the link is a user-experience choice; the gateway is the boundary.

> **"I'm on Enterprise, why can't I see FinOps?"** Because it is not a tier feature. Ask your platform administrator to grant the add-on for your organisation, or [talk to us](/request-demo).

## Can I buy FinOps on its own?

Yes. It stands alone and does not require Onam Security. If you do run more than one product they share the same console and the same discovery, so your cloud accounts are connected once.

## Permissions

FinOps reads billing data. It holds no write access to your cloud accounts and changes nothing in them — including when a savings recommendation is accepted, which records a decision and nothing more.
`,
  },
];
