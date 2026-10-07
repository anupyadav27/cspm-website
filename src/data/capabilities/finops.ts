import { BarChart3, History, PiggyBank, TrendingUp, Users } from "lucide-react";
import type { Capability } from "./types";

/**
 * Onam FinOps capability pages — filled from the finops docs
 * (src/data/docs-articles/products.ts, finops/*) and productPages.finops.
 * The FinOps Agent is "roadmap" in src/data/operations.ts, so any agent line says
 * "designed to", never "does".
 */

const FINOPS_AGENT_HREF = "/docs/operations/agents/finops-agent";

export const capabilities: Capability[] = [
  /* ─────────────────────────────  EXPLORE  ───────────────────────────── */
  {
    product: "finops",
    slug: "explore",
    name: "Cost explorer",
    icon: BarChart3,
    seoTitle: "Cloud cost explorer — Onam FinOps",
    metaDescription:
      "See cloud spend by day, with billed and effective cost side by side, and trace every period-over-period change to what actually moved.",
    question: "Why did our cloud bill go up, and what moved?",
    lead: "Onam FinOps shows spend as a daily series and ranks what changed since the last period. You see billed and effective cost side by side, so the number matches the invoice and the reality.",
    problem:
      "The bill went up and the board wants to know why. The provider console gives us a monthly total, which tells us spend rose but not where or when. Reserved purchases make one month look like a crisis and the next like a win. By the time someone has exported the data and built a pivot table, the meeting has happened.",
    whatYouSee: [
      {
        title: "Daily cost series",
        body: "Spend by day, the level at which cost questions can actually be answered. Not just that spend rose — that it rose on a specific day.",
      },
      {
        title: "Ranked movers",
        body: "Period-over-period movement along a dimension you choose, listed by contribution. A list of what changed, not a single percentage.",
      },
      {
        title: "Billed and effective cost",
        body: "What the provider invoiced, and cost with commitments and amortised charges spread across the periods they cover. Both, side by side.",
      },
      {
        title: "Four ways to cut it",
        body: "Cost by category, by owner, by resource and by day.",
      },
      {
        title: "Balance checks",
        body: "Category totals are checked against the whole. If the parts do not add up, the console says so instead of dropping the remainder.",
      },
      {
        title: "Partial data flagged",
        body: "A period that has not closed is labelled as partial, so an early-month comparison is not mistaken for a settled one.",
      },
    ],
    steps: [
      {
        title: "Billing data is ingested",
        body: "A daily run keeps the current period up to date. A separate monthly-close run settles each completed period.",
      },
      {
        title: "Cost is decomposed",
        body: "Each period breaks down by category, owner, resource and day, with billed and effective cost reported for both.",
      },
      {
        title: "Movement is ranked",
        body: "The current period is compared with the previous one along your chosen dimension, and the movers are ranked by contribution.",
      },
      {
        title: "You check how settled it is",
        body: "Before you quote a figure, the Runs view shows whether the period has closed or is still moving.",
      },
    ],
    limits: [
      {
        title: "An open period is still moving",
        body: "Comparing a period that has not closed against a closed one compares partial data with complete data. The console flags it; read Runs before drawing a conclusion.",
      },
      {
        title: "It explains cost, it does not change it",
        body: "Explore reads billing data. It does not touch anything in your cloud accounts.",
      },
    ],
    faqs: [
      {
        q: "What is the difference between billed cost and effective cost?",
        a: "Billed cost is what the provider invoiced in the period. Effective cost spreads commitments and amortised charges across the periods they actually cover. Billed cost reconciles to the invoice; effective cost shows what each period really consumed. Onam FinOps reports both.",
      },
      {
        q: "Why daily rather than monthly?",
        a: "A monthly total tells you spend went up. The daily series tells you when, which is a question with an answer. A short spike that starts and ends within a month does not show up in a monthly figure at all.",
      },
      {
        q: "How often does the data refresh?",
        a: "Ingestion runs daily, with a separate monthly-close run for each completed period. The Runs view shows when a figure last moved.",
      },
      {
        q: "Why is this month's figure still changing?",
        a: "Because the current period is still being ingested. It is a working estimate until the monthly close, and the console labels it as one.",
      },
    ],
    docs: "/docs/finops/explore",
    related: ["reconciliation", "ownership", "plan"],
  },

  /* ─────────────────────────────  OWNERSHIP  ───────────────────────────── */
  {
    product: "finops",
    slug: "ownership",
    name: "Ownership & attribution",
    icon: Users,
    seoTitle: "Cloud cost ownership and attribution — Onam FinOps",
    metaDescription:
      "Attribute cloud cost to owners and cost centres. Onam FinOps states attribution coverage and the unattributed amount, so the gap is measured, not hidden.",
    question: "Who owns this cloud spend?",
    lead: "Onam FinOps attributes cost to owners and cost centres with rules you control. It tells you how much of the bill it could attribute, and shows the amount it could not.",
    problem:
      "Finance wants each team to own its share of the bill. Our tagging covers most resources, but not all of them, so part of the spend belongs to nobody. Allocation tools hide that gap and hand us confident numbers that are quietly wrong. Then we spend the meeting arguing about whose cost it really is.",
    whatYouSee: [
      {
        title: "Attribution coverage",
        body: "The share of spend your ownership rules could assign, stated as a number rather than implied to be complete.",
      },
      {
        title: "The unattributed amount",
        body: "The spend no rule matched, shown beside coverage and the period total. This is your working list for better rules.",
      },
      {
        title: "Owners and cost centres",
        body: "Cost mapped to the people and cost centres responsible for it.",
      },
      {
        title: "Ownership rules",
        body: "Rules that map resources to owners and cost centres. Add one and coverage tells you straight away whether it worked.",
      },
      {
        title: "Showback and chargeback figures",
        body: "Statements of what each cost centre is responsible for, ready for your finance process.",
      },
    ],
    steps: [
      {
        title: "Define ownership rules",
        body: "Map resources to owners and cost centres.",
      },
      {
        title: "Cost is attributed",
        body: "Each period's spend is assigned by your rules. Whatever no rule matches is reported as unattributed.",
      },
      {
        title: "Read the three figures",
        body: "Attribution coverage, the unattributed amount and the period total, side by side.",
      },
      {
        title: "Close the gap",
        body: "Work through unattributed spend and add rules. Each rule moves a slice into coverage, and the number shows the result.",
      },
    ],
    limits: [
      {
        title: "Only as complete as your rules and tags",
        body: "Tag-based allocation is never complete. Onam FinOps shows the gap; closing it depends on the rules you write.",
      },
      {
        title: "It does not move money",
        body: "Showback and chargeback statements say what each cost centre is responsible for. FinOps does not move money between ledgers, issue internal invoices or enforce anything. It gives your finance process the figures, not the process.",
      },
    ],
    faqs: [
      {
        q: "Our tagging is incomplete. Is attribution still useful?",
        a: "Yes, as long as the tool is honest about it. Coverage is reported as a percentage with the unattributed amount beside it, so incomplete tagging shows up as a measured gap you can close.",
      },
      {
        q: "Does Onam FinOps do chargeback?",
        a: "It produces the figures. Showback and chargeback statements say what each cost centre is responsible for. Moving money between ledgers or issuing internal invoices stays with your finance process.",
      },
      {
        q: "How do I improve coverage?",
        a: "Use the unattributed spend as your list. Each ownership rule you add moves a slice of it into coverage, and the coverage figure tells you immediately whether the rule worked.",
      },
    ],
    docs: "/docs/finops/ownership",
    related: ["explore", "plan", "reconciliation"],
  },

  /* ─────────────────────────────  PLAN  ───────────────────────────── */
  {
    product: "finops",
    slug: "plan",
    name: "Forecast, budgets & anomalies",
    icon: TrendingUp,
    seoTitle: "Cloud cost forecast, budgets and anomalies — Onam FinOps",
    metaDescription:
      "Forecast cloud spend as a low, expected and high figure, track budgets against forecast and actuals, and catch anomalies in the daily cost series.",
    question: "What will we spend, and are we going over budget?",
    lead: "Onam FinOps forecasts spend as a range, not a single line. Budgets are tracked against the forecast as well as actuals, and anomalies are found in the daily series.",
    problem:
      "Our forecast is one line, and it is wrong every month, so nobody reads it any more. We find out about a budget overrun after it has happened. A spike that started and was fixed inside a week never shows up in the monthly numbers, so we cannot tell whether it was real or what it cost.",
    whatYouSee: [
      {
        title: "A forecast range",
        body: "A low, an expected and a high figure. A period that lands outside the band is a genuine signal, not routine noise.",
      },
      {
        title: "Budgets against forecast",
        body: "Budgets compared with where spend is heading, so the warning comes early enough to act on.",
      },
      {
        title: "Budgets against actuals",
        body: "Budgets compared with what has actually been spent so far.",
      },
      {
        title: "Anomalies in the daily series",
        body: "Unusual spend detected day by day, not against monthly totals, so short spikes are not averaged away.",
      },
    ],
    steps: [
      {
        title: "The daily series builds up",
        body: "Daily ingestion gives forecasting and anomaly detection a history to work from.",
      },
      {
        title: "A forecast band is produced",
        body: "Low, expected and high figures for the period ahead.",
      },
      {
        title: "Budgets are tracked",
        body: "Each budget is compared with both the forecast and actuals.",
      },
      {
        title: "Anomalies are surfaced",
        body: "Spend that departs from the daily baseline is flagged for review.",
      },
    ],
    limits: [
      {
        title: "Anomalies need history",
        body: "Detection needs enough daily history to have a baseline. A newly connected account produces few useful anomalies until the series has a shape.",
      },
      {
        title: "A forecast is a range, not a promise",
        body: "The band says what the forecast knows. Spend can still land outside it, and when it does, that is worth looking at.",
      },
    ],
    agent: {
      name: "FinOps Agent",
      status: "roadmap",
      line: "On the roadmap: the FinOps Agent is designed to analyse cost, waste, idle resources and anomalies, and to explain where the waste is.",
      href: FINOPS_AGENT_HREF,
    },
    faqs: [
      {
        q: "Why three forecast figures instead of one?",
        a: "A single line is false precision. It is wrong every month, and a forecast that is always wrong stops being read. A low, expected and high band shows what the forecast actually knows.",
      },
      {
        q: "Why compare budgets with the forecast?",
        a: "Comparing only with actuals tells you about an overrun after it has happened. Comparing with the forecast warns you while there is still time to act.",
      },
      {
        q: "Why are anomalies detected daily?",
        a: "A spike that starts on one day and is corrected two days later can vanish inside a monthly total. The daily series keeps it visible.",
      },
      {
        q: "We have just connected. Why are there so few anomalies?",
        a: "Anomaly detection needs enough daily history to establish a baseline. Results improve as the series grows.",
      },
    ],
    docs: "/docs/finops/plan",
    related: ["explore", "savings", "reconciliation"],
  },

  /* ─────────────────────────────  SAVINGS  ───────────────────────────── */
  {
    product: "finops",
    slug: "savings",
    name: "Savings",
    icon: PiggyBank,
    seoTitle: "Cloud cost savings recommendations — Onam FinOps",
    metaDescription:
      "Cost-reduction recommendations with an accept or dismiss decision on each. The headline is an upper bound, and nothing is changed in your account.",
    question: "What can we stop spending — and who decided?",
    lead: "Onam FinOps holds cost-reduction recommendations, each with a recorded decision. The headline figure is labelled as an upper bound, not a promise.",
    problem:
      "We get savings recommendations as a long list. Everyone reads it and agrees, and nothing happens, because no item has an owner or an outcome. The headline savings number is so optimistic that we have learned to ignore it. And we will not let a cost tool resize production on its own.",
    whatYouSee: [
      {
        title: "Recommendations with a state",
        body: "Each recommendation is accepted or dismissed, and the decision is recorded. A saving has an outcome, not just a row.",
      },
      {
        title: "A portfolio upper bound",
        body: "The most the open recommendations could save if every one were accepted and realised — labelled as a bound, not a projection.",
      },
      {
        title: "A record for change management",
        body: "The accepted decision is what your own change process works from when it carries the change out.",
      },
      {
        title: "Read-only by design",
        body: "Onam FinOps holds read-only billing access. Accepting a recommendation changes nothing in your cloud account.",
      },
    ],
    steps: [
      {
        title: "Recommendations are listed",
        body: "Cost-reduction recommendations appear with the portfolio upper bound above them.",
      },
      {
        title: "You decide",
        body: "Accept or dismiss each one. The decision is recorded.",
      },
      {
        title: "Your process acts",
        body: "If a recommendation should be carried out, your own change-management process makes the change, working from the recorded decision.",
      },
    ],
    limits: [
      {
        title: "It does not act on a saving",
        body: "Accepting records the decision. It does not resize, stop or delete anything in your account.",
      },
      {
        title: "The headline is a ceiling",
        body: "The upper bound assumes every open recommendation is accepted and realised. Treat it as the most you could save, not what you will save.",
      },
    ],
    agent: {
      name: "FinOps Agent",
      status: "roadmap",
      line: "On the roadmap: the FinOps Agent is designed to check dependencies and recovery protection before calling anything safe to remove — read and recommend only.",
      href: FINOPS_AGENT_HREF,
    },
    faqs: [
      {
        q: "Will Onam FinOps change anything in my cloud account?",
        a: "No. It holds read-only billing access and acts on nothing. Accepting a recommendation records your decision; it does not resize, stop or delete a resource.",
      },
      {
        q: "Why is the savings figure called an upper bound?",
        a: "Because it assumes every open recommendation is accepted and realised. Presenting a ceiling as an expectation teaches people to ignore the number, so it is labelled for what it is.",
      },
      {
        q: "What happens after I accept a recommendation?",
        a: "The decision is recorded. If you want the change made, your own change-management process makes it, working from that record.",
      },
      {
        q: "Why record dismissals too?",
        a: "A dismissed recommendation is a decision as well. Recording both is what turns a savings list into a record of what was decided.",
      },
    ],
    docs: "/docs/finops/savings",
    related: ["plan", "ownership", "explore"],
  },

  /* ─────────────────────────────  RECONCILIATION  ───────────────────────────── */
  {
    product: "finops",
    slug: "reconciliation",
    name: "Reconciled billing",
    icon: History,
    seoTitle: "Reconciled cloud billing and run history — Onam FinOps",
    metaDescription:
      "Every ingestion run recorded, a reconciliation state on every period, and billed and effective cost side by side — so you know when a figure is final.",
    question: "Can we trust this month's cloud cost figure yet?",
    lead: "Onam FinOps records every ingestion run and shows the reconciliation state of every period. You can see whether a number is settled before you quote it.",
    problem:
      "We quoted a cost figure to the board, and a week later it changed. Finance reconciles against an export that landed mid-close, and nobody can say whether this month's figure is final or still moving. Our cost tool shows the number with the same confidence either way.",
    whatYouSee: [
      {
        title: "Run history",
        body: "Each run records what it ingested, when, and how it ended — the provenance behind every figure.",
      },
      {
        title: "Reconciliation state per period",
        body: "How well the ingested records agree with the source billing data. An unreconciled period is labelled as a working estimate.",
      },
      {
        title: "Daily and monthly-close runs",
        body: "Daily runs keep the current period live. The monthly close settles a completed period.",
      },
      {
        title: "The cost model",
        body: "Billed cost and effective cost reported for every period, side by side, never flattened into one figure.",
      },
      {
        title: "Gaps made visible",
        body: "A gap in the run history means the figures for that window are incomplete, whatever the charts show.",
      },
    ],
    steps: [
      {
        title: "Daily runs ingest the current period",
        body: "The running picture of this period, which keeps moving until it closes.",
      },
      {
        title: "A monthly-close run finalises the period",
        body: "Once it completes, the period's figure is settled and quotable.",
      },
      {
        title: "Reconciliation is recorded",
        body: "Each period carries a state describing how well the ingested records agree with the source billing data.",
      },
      {
        title: "You read it before you quote it",
        body: "Recent daily runs mean the figure is live. A completed monthly close means it is settled. A gap means it is incomplete.",
      },
    ],
    limits: [
      {
        title: "The current period is an estimate",
        body: "Until the monthly close, the figure will keep moving. The console labels it as a working estimate rather than presenting it as settled.",
      },
      {
        title: "It reports billing; it does not fix it",
        body: "Runs show how settled the data is. They do not correct the provider's billing data or move money.",
      },
    ],
    faqs: [
      {
        q: "How do I know a period's figure is final?",
        a: "Look for a completed monthly-close run. A period with only recent daily runs is still live and will keep moving.",
      },
      {
        q: "What does the reconciliation state mean?",
        a: "It describes how well the ingested records agree with the source billing data. An unreconciled current period is a working estimate, and the console labels it as one.",
      },
      {
        q: "Why report both billed and effective cost?",
        a: "Billed cost reconciles to the invoice finance received. Effective cost spreads commitments across the periods they cover. Reporting only one makes either the invoice or the trend impossible to read.",
      },
      {
        q: "Why is this a page and not a footnote?",
        a: "Every other view presents a number. This one tells you how much to trust it. Without visible ingestion history, every figure is taken on faith.",
      },
    ],
    docs: "/docs/finops/runs",
    related: ["explore", "ownership", "plan"],
  },
];
