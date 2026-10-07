import { AppWindow, GitCompareArrows, ListOrdered, ShieldCheck, Timer } from "lucide-react";
import type { Capability } from "./types";

/**
 * Onam DRM capability pages — filled from the DRM docs (src/data/docs-articles/drm.ts)
 * and productPages.drm in src/data/products.ts. DRM plans, predicts and records: it does
 * not execute a recovery, run a DR test or connect to a backup product.
 *
 * Screenshots are the real demo-tenant captures in public/screenshots/console/drm-*.webp.
 * The figures visible in them are seeded demo data and are never quoted in the copy.
 */

const CAPTION = "Onam DRM console — demo tenant data.";
const shot = (file: string, path: string, alt: string, label?: string) => ({
  src: `/screenshots/console/drm-${file}.webp`,
  url: `app.onamsecurity.com/drm${path}`,
  alt,
  caption: CAPTION,
  // Tab name when a page shows more than one screen.
  ...(label ? { label } : {}),
});

const DR_AGENT_HREF = "/docs/operations/agents/dr-agent";

const LIMIT_NO_RECOVERY = {
  title: "It does not execute a recovery",
  body: "DRM plans, predicts and records. It does not fail anything over or start a recovery in your environment — your own tools and runbooks do that.",
};
const LIMIT_NO_TESTS = {
  title: "It does not run DR tests",
  body: "Drills run with your own tools are recorded in DRM, with the measured result set against the prediction captured when the drill was planned.",
};
const LIMIT_NO_CONNECTORS = {
  title: "It has no connectors to backup products",
  body: "Protection is read from cloud configuration and reported as discovered, not protected. Configuration shows a mechanism is set up — not that last night's job succeeded or that a restore works.",
};
const LIMIT_BLANK = {
  title: "It does not guess a figure it cannot derive",
  body: "With no approved plan, or backup-only protection with no recorded frequency, the predicted RTO or RPO stays blank rather than showing zero or a guess.",
};

export const capabilities: Capability[] = [
  {
    product: "drm",
    slug: "applications",
    name: "Applications & dependencies",
    icon: AppWindow,
    seoTitle: "Applications & Dependencies for Disaster Recovery | Onam DRM",
    metaDescription:
      "Onam DRM proposes applications from your tags and classifies every dependency by what it means for recovery — order, protection or shared failure domain.",
    question: "Which applications do we actually recover, and what does each one depend on?",
    lead: "You recover an application, not a volume. Onam DRM proposes your applications from the tags you already use and classifies every dependency between their parts by what it means for recovery.",
    problem:
      "The recovery plan names applications, but nobody can say with confidence which databases, queues and storage each one really uses today. The list was drawn up by hand for an audit, and every new resource since has been added to the estate without being added to the plan. When the outage comes, the first hour goes on working out what belongs to what.",
    whatYouSee: [
      {
        title: "Applications proposed from your tags",
        body: "An application tag, a CloudFormation stack, a Helm release or a Kubernetes cluster — each proposed application shows the tag it came from and a confidence in what that tag means.",
      },
      {
        title: "Components that recover together",
        body: "Resources within an application are organised into components. The application is the unit that carries your required RTO and RPO and gets a recovery plan.",
      },
      {
        title: "Dependencies classified by kind",
        body: "Every edge is recovery order, protection (proves a copy exists) or placement (shares a failure domain). Only recovery-order edges decide the order of a plan.",
      },
      {
        title: "Gaps kept visible",
        body: "Resources that could not be grouped are shown as plainly as those that could, and a dependency DRM could not resolve stays on the graph as unresolved instead of being dropped.",
      },
      {
        title: "Placement the provider states",
        body: "The Topology view places each resource in its availability zone where the provider gives one, its region otherwise. DRM does not guess a placement the provider does not state.",
      },
      {
        title: "Readiness in one table",
        body: "Primary and recovery site, required against predicted RTO and RPO, last drill, baseline, drift and readiness for every application.",
      },
    ],
    steps: [
      {
        title: "Start from the platform inventory",
        body: "DRM reads the Onam platform's cloud inventory — the same discovery Onam Estate reads — so your accounts are connected once and DRM runs no scan of its own.",
      },
      {
        title: "Propose applications from tags",
        body: "Resources are grouped by the tags they carry. Infrastructure groupings such as a Kubernetes cluster are labelled as such rather than presented as business applications.",
      },
      {
        title: "Classify the dependencies",
        body: "Edges come from a catalogue of how cloud resources relate to each other, and each is labelled recovery order, protection or placement.",
      },
      {
        title: "A person approves",
        body: "Every proposed application and dependency arrives in the Approval Center. Nothing enters a recovery plan or a baseline until someone with approval rights accepts it.",
      },
    ],
    screenshots: [
      shot(
        "applications",
        "/applications",
        "Onam DRM Applications table: counts of applications, DR-ready, at risk and RTO breached, then each application's business group, criticality, primary and recovery site, required and predicted RTO and RPO, last drill, baseline, drift and readiness.",
      ),
    ],
    limits: [
      {
        title: "Grouping is only as good as your tags",
        body: "Applications are proposed from tags. An estate where only compute is tagged will produce applications that contain only compute, with databases or storage left ungrouped — tagging what an application uses is the most direct fix.",
      },
      LIMIT_NO_RECOVERY,
    ],
    faqs: [
      {
        q: "Does DRM run its own discovery scan?",
        a: "No. It reads the Onam platform's cloud inventory, the same discovery Onam Estate reads, so your cloud accounts are connected once and every product works from the same list of resources.",
      },
      {
        q: "What if our tags are incomplete?",
        a: "DRM proposes what the tags support and shows ungrouped resources plainly, as a gap to look at rather than something hidden. Tagging the databases and storage an application uses is the most direct way to improve what DRM proposes.",
      },
      {
        q: "Why are dependencies split into three kinds?",
        a: "Because they mean different things for recovery. A recovery-order edge says one part must come back before another; a protection edge says a copy exists; a placement edge says two resources share a failure domain. Only recovery-order edges set the order of a plan.",
      },
      {
        q: "Can an engine add an application to our plan on its own?",
        a: "No. Every application and dependency an engine finds arrives as a proposal in the Approval Center. A rejected proposal is recorded and is not proposed again.",
      },
    ],
    docs: "/docs/drm/applications",
    related: ["protection", "recovery-plans", "drift"],
  },

  {
    product: "drm",
    slug: "protection",
    name: "Protection",
    icon: ShieldCheck,
    seoTitle: "Backup & Replication Coverage from Cloud Configuration | Onam DRM",
    metaDescription:
      "Onam DRM reads backup, snapshot and replication from cloud configuration, per resource and per application — reported as discovered, never as protected.",
    question: "What does our cloud configuration say is actually backed up or replicated?",
    lead: "Onam DRM reads backup plans, snapshots, replicas and replication from your cloud configuration and reports each one as discovered — never as protected or tested, because those are statements a person makes.",
    problem:
      "Everyone assumes the important databases are backed up and replicated. Some are; some had their replica removed in a cost review; some were created after the backup policy was written. The only list of what is protected is a spreadsheet that was right when it was made. A protection report that overstates is worse than none, because it is the one people will trust during an outage.",
    whatYouSee: [
      {
        title: "Protection read from configuration",
        body: "Backup plans and retention, database automated backups and multi-zone deployments, snapshots, read replicas and storage replication, including cross-region replication.",
      },
      {
        title: "Discovered, not protected",
        body: "A configured mechanism is reported as discovered. Configuration does not show whether a job succeeded, whether a restore has worked or whether a copy is complete, and DRM does not pretend it does.",
      },
      {
        title: "Per resource, grouped or not",
        body: "Protection is a property of a resource, so a database nobody has tagged into an application still shows the backup its configuration has.",
      },
      {
        title: "Per application, pairing by pairing",
        body: "A resource used by two applications gets one pairing for each — the same replica can be critical to one and incidental to another, and approving it for one is not approving it for the other.",
      },
      {
        title: "Coverage by resource type",
        body: "Protection broken down by resource type, counted over resources so a type with no protection record at all still appears. Gaps in the model are shown as gaps, not as a score of zero.",
      },
    ],
    steps: [
      {
        title: "Read the control plane",
        body: "Protection is read from cloud configuration through the platform's read-only connection. Which mechanisms are recognised varies by cloud and resource type.",
      },
      {
        title: "Record it per resource",
        body: "Every mechanism found is attached to the resource it protects, whether or not that resource belongs to an application yet.",
      },
      {
        title: "Pair it with applications",
        body: "Where a resource belongs to an application, a protection pairing is proposed for that application and goes to the Approval Center.",
      },
      {
        title: "Feed plans, RPO and drift",
        body: "Recovery plans use only approved pairings, predicted RPO comes from replication links, and drift reports protection that changed since the baseline was approved.",
      },
    ],
    screenshots: [
      shot(
        "protection",
        "/protection",
        "Onam DRM Protection Overview: protection, backup and replication record counts, coverage bars for backup, replication, storage and traffic each measured against its own population, and protection by resource type.",
      ),
    ],
    limits: [
      LIMIT_NO_CONNECTORS,
      {
        title: "It cannot see inside a server",
        body: "DRM reads the cloud provider's control plane. A database dump or backup job scheduled inside a virtual machine is invisible to it, so a resource with no visible mechanism is a question for its owner, not a verdict.",
      },
    ],
    agent: {
      name: "DR Agent",
      status: "roadmap",
      line: "On the roadmap: the DR Agent is designed to find backup coverage for a business service and separate protection that exists from recovery that was validated.",
      href: DR_AGENT_HREF,
    },
    faqs: [
      {
        q: "Does DRM connect to our backup product?",
        a: "No. There are no connectors to backup products. DRM reads protection from cloud configuration, which shows that a mechanism is configured — not the job history of a third-party backup tool.",
      },
      {
        q: "Why does DRM say 'discovered' rather than 'protected'?",
        a: "Because configuration does not show whether last night's backup succeeded or whether a restore works. Protected and tested are statements a person makes; the way to prove a recovery works is a drill run with your own tools and recorded in DRM.",
      },
      {
        q: "A resource shows no protection, but we know it is backed up. Why?",
        a: "It may be protected by something DRM cannot see — for example a backup job scheduled inside a virtual machine, or a third-party backup product. Treat it as a question for the resource's owner rather than a verdict.",
      },
      {
        q: "Does DRM change any backup or replication settings?",
        a: "No. It reads configuration and inventory only. Approvals, baselines and pairings are records inside DRM, not changes to your cloud accounts.",
      },
    ],
    docs: "/docs/drm/protection",
    related: ["applications", "objectives", "drift"],
  },

  {
    product: "drm",
    slug: "recovery-plans",
    name: "Recovery plans",
    icon: ListOrdered,
    seoTitle: "Recovery Plans, Critical Path & Readiness | Onam DRM",
    metaDescription:
      "Onam DRM composes recovery plans from approved items — ordered steps, parallel groups and the critical path — and rates readiness against your RTO and RPO.",
    question: "In what order does each application come back — and is that fast enough?",
    lead: "Onam DRM composes each application's recovery plan from approved applications, dependencies and protection: ordered steps, the steps that can run at the same time, and the critical path that sets how long it should take.",
    problem:
      "The runbook lists a start-up order someone wrote down years ago. Since then services have moved, new dependencies have appeared and nobody has re-checked the sequence. The plan says the application comes back in an hour, but nobody can show where that hour comes from — or which step will hold everything else up.",
    whatYouSee: [
      {
        title: "Ordered steps",
        body: "Steps follow the recovery-order dependencies between the application's parts, grouped into phases in the order they run.",
      },
      {
        title: "Parallel groups and the critical path",
        body: "Steps that can run at the same time are grouped, and the critical path — the longest chain that must run one after another — is shown against the fully serial time.",
      },
      {
        title: "Where each step's position came from",
        body: "Every step says whether its place came from a discovered dependency or from convention. A step placed by convention is a prompt to check the order with the application's owner.",
      },
      {
        title: "Readiness against your targets",
        body: "Each application is rated ready, warning, at risk or not ready, setting its predicted figures against the required RTO and RPO you entered.",
      },
      {
        title: "An executive resilience scorecard",
        body: "Four plain questions per application: does a plan exist, is it within the required RTO, is it governed by a baseline, and has it been proven by a drill?",
      },
    ],
    steps: [
      {
        title: "Approve the inputs",
        body: "Plans are composed from approved items only. Nothing an engine has merely proposed can shape a plan.",
      },
      {
        title: "Compose the order",
        body: "DRM orders the steps from recovery-order dependencies, groups those that can run in parallel and finds the critical path.",
      },
      {
        title: "Approve the plan",
        body: "A composed plan arrives in the Approval Center like any other proposal, and is approved by someone with approval rights.",
      },
      {
        title: "Predict and rate",
        body: "Predicted RTO is the critical path through the approved plan, and readiness compares it with the required RTO and RPO you set.",
      },
      {
        title: "Carry it out with your own tools",
        body: "The recovery itself, and any test of it, runs in your own tooling and runbooks. Record the drill in DRM to compare what happened with what was predicted.",
      },
    ],
    screenshots: [
      shot(
        "recovery-plan",
        "/recovery/plans/00678a1a-e018-4c96-9576-d4f1a2803632",
        "Onam DRM approved recovery plan: phase count, critical path, fully serial time and required RTO, steps whose automation nobody has assessed, and a recovery flow of numbered phases from pre-checks through storage, database and DNS to validation.",
      ),
    ],
    limits: [LIMIT_NO_RECOVERY, LIMIT_NO_TESTS],
    faqs: [
      {
        q: "Does DRM execute the recovery plan?",
        a: "No. A DRM plan is the order and the expectation. The recovery is carried out with your own tools and runbooks; DRM does not fail anything over.",
      },
      {
        q: "How is the predicted recovery time calculated?",
        a: "It is the critical path through the approved plan. Steps that run in parallel cost the longest of them, not the sum, and a step nobody has timed keeps its default duration so it never drops off the path.",
      },
      {
        q: "What does 'placed by convention' mean on a step?",
        a: "That DRM had no discovered dependency to set that step's position and used a conventional order instead. It is a prompt to confirm the order with the application's owner.",
      },
      {
        q: "What happens if an application has no approved plan?",
        a: "It has no predicted RTO. The field is left blank rather than showing zero.",
      },
    ],
    docs: "/docs/drm/recovery-plans",
    related: ["applications", "objectives", "drift"],
  },

  {
    product: "drm",
    slug: "objectives",
    name: "RTO, RPO & drills",
    icon: Timer,
    seoTitle: "Predicted RTO & RPO and DR Drill Records | Onam DRM",
    metaDescription:
      "Onam DRM keeps required, predicted and actual RTO and RPO apart, explains each prediction, and records drills against the figure promised at planning.",
    question: "Could we recover in time — and how do we know the number is right?",
    lead: "Onam DRM keeps three kinds of recovery figure apart — the targets you require, the figures it predicts from the approved plan, and the actual results of drills you record — because mixing them is how a plan looks better than it is.",
    problem:
      "The recovery time in the business continuity plan was agreed in a meeting, and it has been quoted ever since as if it were measured. Nobody can say whether the current architecture would meet it, and the last drill result was compared with whatever the plan said on the day of the report, not what was promised beforehand.",
    whatYouSee: [
      {
        title: "Required, predicted and actual, side by side",
        body: "Required figures are what you enter per application. Predicted figures are calculated by DRM. Actual figures come from drills you recorded.",
      },
      {
        title: "Why a prediction is that number",
        body: "The RTO critical path is shown phase by phase, so you can see which part of the plan is worth shortening first.",
      },
      {
        title: "Predicted RPO from the worst link",
        body: "The worst data-loss window across the application's replication links, taking the larger of the lag last observed and the configured target so a quiet moment does not flatter the figure.",
      },
      {
        title: "Breaches and blanks",
        body: "Applications breaching RTO or RPO, those within both, and those whose figures cannot be calculated yet — with the reason, such as no approved plan or no replication link.",
      },
      {
        title: "Drill records",
        body: "Drills planned, started and completed in DRM, with the measured recovery time, data loss, success and issues found entered by the person who ran them.",
      },
    ],
    steps: [
      {
        title: "Enter the required targets",
        body: "You set the required RTO and RPO for each application. A calculated value never overwrites them.",
      },
      {
        title: "DRM predicts from approved inputs",
        body: "Predicted RTO is the critical path through the approved recovery plan; predicted RPO is the worst replication link.",
      },
      {
        title: "Plan a drill",
        body: "When you plan a drill in DRM, the prediction at that moment is captured on it.",
      },
      {
        title: "Run it with your own tools, then record it",
        body: "The person who ran the drill enters the measured results, and DRM compares them with the prediction captured at planning — not with whatever the model says today.",
      },
    ],
    screenshots: [
      shot(
        "objectives",
        "/recovery/objectives",
        "Onam DRM RTO / RPO view: applications breaching RTO, breaching RPO, within both and not yet calculable; an RTO analysis with required, predicted and actual figures and the critical path by phase; and an RPO analysis left blank because no replication link exists.",
      ),
    ],
    limits: [
      LIMIT_BLANK,
      {
        title: "Your targets are never overwritten",
        body: "Required RTO and RPO are your inputs. DRM sets its predictions against them; it never replaces them with a calculated value.",
      },
      LIMIT_NO_TESTS,
    ],
    agent: {
      name: "DR Agent",
      status: "roadmap",
      line: "On the roadmap: the DR Agent is designed to calculate realistic recovery time and recovery point, and find business-critical assets with no recovery plan.",
      href: DR_AGENT_HREF,
    },
    faqs: [
      {
        q: "Why is our predicted RTO blank?",
        a: "Predicted RTO comes from the critical path through an approved recovery plan. With no approved plan there is nothing to derive it from, so the field is left blank rather than showing zero.",
      },
      {
        q: "Why is our predicted RPO blank?",
        a: "Predicted RPO comes from replication links. An application protected only by backups, with no backup frequency recorded, gets no predicted RPO rather than a guess.",
      },
      {
        q: "Does DRM run the drill?",
        a: "No. You run the drill with your own tools and runbooks. DRM records it — planned, running, completed — and compares the measured result with the prediction captured when the drill was planned.",
      },
      {
        q: "Can a calculated figure change the target we set?",
        a: "No. Required RTO and RPO are your inputs and a calculated value never overwrites them.",
      },
    ],
    docs: "/docs/drm/objectives",
    related: ["recovery-plans", "protection", "drift"],
  },

  {
    product: "drm",
    slug: "drift",
    name: "Baselines & drift",
    icon: GitCompareArrows,
    seoTitle: "DR Baselines & Drift from Approved Recovery Model | Onam DRM",
    metaDescription:
      "Onam DRM freezes your approved recovery model as a baseline and measures drift against it — not scan against scan — ranked by consequence for recovery.",
    question: "Has anything changed since we signed off the recovery plan?",
    lead: "Onam DRM freezes each approved recovery model as a baseline and measures drift against it, so you see every difference from what you signed off — ranked by what it does to recoverability.",
    problem:
      "The recovery plan was approved for last year's audit. Since then a team added a database without a replica, another tightened a target, and a dependency moved. A change feed that compares each scan with the previous one quietly accepts all of it: a change on Tuesday looks normal by Wednesday. The question an auditor asks is different — has anything changed since the plan was approved?",
    whatYouSee: [
      {
        title: "Drift against the approved baseline",
        body: "Every difference between the active baseline and the current state — never between last week's scan and this one.",
      },
      {
        title: "Ranked by consequence",
        body: "Drift is ranked by what it does to recovery: one changed recovery target outranks ten renamed steps.",
      },
      {
        title: "Approved against current",
        body: "For each drift event: the application, what changed, the approved state and the current state, side by side.",
      },
      {
        title: "Kept until resolved",
        body: "A difference stays open until someone resolves it, rather than disappearing when the next scan treats it as normal.",
      },
      {
        title: "Structure, not noise",
        body: "Baselines hold components, dependencies, protection pairings, plan steps and required targets. Live readings such as replication lag are deliberately left out of the baseline.",
      },
      {
        title: "An enterprise view",
        body: "The overview brings open drift together with applications under management, readiness and a resilience score.",
      },
    ],
    steps: [
      {
        title: "Engines propose",
        body: "Applications, dependencies, protection pairings and plans arrive as proposals in the Approval Center.",
      },
      {
        title: "People approve",
        body: "Someone with approval rights accepts or rejects each one. A rejected proposal is recorded and not proposed again.",
      },
      {
        title: "Freeze the baseline",
        body: "Approving an application's recovery model freezes its structure and intent as a baseline.",
      },
      {
        title: "Measure drift against it",
        body: "DRM compares the current state with the active baseline and ranks every difference by its consequence for recovery.",
      },
    ],
    screenshots: [
      shot(
        "drift",
        "/monitor/drift",
        "Onam DRM Drift view: open drift by severity and applications affected, a note on why drift is not a change feed, and a table of what changed for each application with its approved and current state.",
        "Drift",
      ),
      shot(
        "overview",
        "",
        "Onam DRM Enterprise Resilience Overview: applications under management, DR-ready, at risk, not ready and open drift, with an enterprise resilience score, application readiness breakdown and resilience trend.",
        "Overview",
      ),
    ],
    limits: [
      {
        title: "It does not reverse the change",
        body: "DRM reads configuration and inventory and changes nothing in your cloud. Drift shows what moved since sign-off; putting it right is done by your own teams in your own environment.",
      },
      LIMIT_NO_RECOVERY,
    ],
    faqs: [
      {
        q: "Why compare against a baseline rather than the previous scan?",
        a: "Comparing each scan with the last one ratifies drift silently — a change made on Tuesday looks normal by Wednesday. Comparing against the baseline you signed off answers the question an auditor asks: has anything changed since the plan was approved?",
      },
      {
        q: "What goes into a baseline?",
        a: "The structure and intent you approved: components, dependencies, protection pairings, plan steps and required targets. Live readings such as replication lag are left out, because they change constantly and are not what was approved.",
      },
      {
        q: "Who can approve a baseline?",
        a: "Approving is a separate permission from viewing, granted through the roles your platform administrator already manages. Reaching a DRM page does not let you approve anything on it.",
      },
    ],
    docs: "/docs/drm/governance",
    related: ["applications", "recovery-plans", "objectives"],
  },
];
