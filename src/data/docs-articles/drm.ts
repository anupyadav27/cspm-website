import type { DocArticle } from "./types";

/**
 * Onam DRM — disaster recovery management.
 *
 * Grounded in the DRM code (/Users/apple/Desktop/SECAIOPS/drm): engines under drm/engines,
 * API routes under app/api/drm. DRM plans, predicts and RECORDS; it does not execute a
 * recovery, run a DR test, or connect to a backup product. No price appears here.
 */
export const articles: DocArticle[] = [
  {
    slug: "drm/overview",
    title: "Onam DRM",
    breadcrumb: "Onam DRM / Overview",
    body: `
**Onam DRM** is disaster recovery management for your cloud. It maps your applications and what they depend on, reads the backup and replication your cloud configuration has, predicts recovery time (RTO) and data loss (RPO) against the targets you set, composes the order in which each application comes back, and flags drift from the recovery model you approved.

It is a **separate product**, granted per organisation, and runs inside the same console as Onam Estate, Onam Security and Onam FinOps. It works from the platform's cloud inventory, so your accounts are connected once.

## What it answers

| Question | Where in DRM |
| --- | --- |
| Which applications do we run, and what do they depend on? | Applications, Dependencies, Topology |
| What is protected, and by what? | Protection |
| Could we recover in time? | Recovery — readiness and objectives |
| In what order does it come back? | Recovery — plans |
| Has anything changed since we signed off? | Monitor — drift; Governance — baselines |
| Did the last drill meet the target? | Drills |

## The stages

1. **Understand.** Resources come from the platform inventory and are placed where the provider says they live — the availability zone where one is given, the region otherwise. Applications are proposed from your tags, each with the tag it came from and a confidence. Dependencies are classified as recovery order, protection (proves a copy exists) or placement (shares a failure domain).
2. **Protect.** Backup, snapshot and replication are read from cloud configuration. A configured mechanism is reported as *discovered*, never as *protected* or *tested* — those are statements a person makes.
3. **Recover.** Recovery plans are composed from approved items only. Predicted RTO is the critical path through the plan; predicted RPO is the worst replication link.
4. **Govern.** Engines propose and people approve. The approved model is frozen as a baseline, and drift is measured against it.

## What DRM does not do

- It does **not execute a recovery** or fail anything over.
- It does **not run DR tests.** Drills run with your own tools are recorded in DRM.
- It has **no connectors to backup products.** Protection is read from cloud configuration, which shows that a mechanism is configured — not that last night's job succeeded or that a restore works.
`,
  },
  {
    slug: "drm/objectives",
    title: "RTO, RPO & Drills",
    breadcrumb: "Onam DRM / RTO, RPO & Drills",
    body: `
DRM keeps three kinds of recovery figure apart, because mixing them is how a plan looks better than it is.

| Kind | Where it comes from |
| --- | --- |
| **Required** | You enter it per application. A calculated value never overwrites it. |
| **Predicted** | Calculated by DRM from the approved plan and protection. |
| **Actual** | Recorded from a drill you ran. |

## Predicted RTO

The critical path through the application's approved recovery plan. Steps that can run at the same time cost the longest of them, not the sum. A step nobody has timed still carries its default duration, so it never drops off the path. With no approved plan, there is no predicted RTO — the field is left blank rather than showing zero.

## Predicted RPO

The worst data-loss window across the application's replication links. For each link DRM takes the larger of the lag last observed and the configured target, so a quiet moment does not improve the reported figure. An application protected only by backups, with no backup frequency recorded, gets no predicted RPO rather than a guess.

## Drills

A drill is planned, started and completed in DRM, and the prediction at planning time is captured on it — so the result is compared with what was promised then, not with whatever the model says today. The measured recovery time, data loss, success and issues found are entered by the person who ran it. DRM does not run the drill; it records it.
`,
  },
  {
    slug: "drm/governance",
    title: "Approvals, Baselines & Drift",
    breadcrumb: "Onam DRM / Governance",
    body: `
## Engines propose, people approve

Every application, dependency, protection pairing and plan an engine finds arrives as a **proposal** in the Approval Center. Nothing enters a recovery plan or a baseline until someone with approval rights accepts it. A rejected proposal is recorded and is not proposed again.

## Baselines

Approving an application's recovery model freezes it as a **baseline**: its structure and intent — components, dependencies, protection pairings, plan steps, required targets. Live readings such as replication lag are deliberately left out, because they change constantly and are not what was approved.

## Drift

Drift is the difference between the active baseline and the current state, **not** between last week's scan and this one. That answers the question an auditor asks — has anything changed since the plan was approved? Drift is ranked by its consequence for recovery: one changed recovery target outranks ten renamed steps.

## Access

DRM runs inside the same console and behind the same login as the rest of the platform. It is granted per organisation; organisations without it do not get access to DRM's pages or API. Approving and authoring are separate permissions from viewing.
`,
  },
  {
    slug: "drm/applications",
    title: "Applications & Dependencies",
    breadcrumb: "Onam DRM / Applications & Dependencies",
    body: `
You recover an **application**, not a volume. Everything else in DRM — required targets, recovery plans, predicted RTO and RPO, baselines — hangs off the applications you approve and the dependencies between their parts. This page explains where both come from.

## Where the resources come from

DRM does not run its own scan. It reads the **Onam platform's cloud inventory** — the same discovery Onam Estate reads — so your accounts are connected once and every product sees the same list of resources.

Each resource is placed where the provider says it lives: its **availability zone** where the provider gives one, its **region** otherwise. DRM does not guess a placement the provider does not state.

## How applications are proposed

Applications are proposed from your **tags** — for example an application tag, a CloudFormation stack, a Helm release or a Kubernetes cluster. Every proposed application shows:

- the **tag it came from**, so you can see why these resources were grouped together;
- a **confidence** in what that tag means.

An infrastructure grouping such as a Kubernetes cluster is labelled as one, rather than presented as a business application. Resources that could not be grouped are shown as plainly as those that could — an ungrouped resource is a gap to look at, not something to hide.

Within an application, resources are organised into **components** — the parts of the application that recover together. The application is the unit that carries your required RTO and RPO and gets a recovery plan.

> Grouping reads tags. An estate where only compute is tagged will produce applications that contain only compute, and databases or storage left ungrouped. Tagging what an application uses is the most direct way to improve what DRM proposes.

## How dependencies are classified

Dependencies come from a catalogue of how cloud resources relate to each other. Every edge says what **kind** of dependency it is, because the kinds mean different things for recovery:

| Kind | What it means | Sets recovery order? |
| --- | --- | --- |
| **Recovery order** | This must be recovered before that | Yes |
| **Protection** | This proves a copy of that exists (a replica, a snapshot) | No |
| **Placement** | These share a failure domain, so they can fail together | No |

Only recovery-order edges decide the order of a recovery plan. An edge DRM could not resolve is **kept visible** as unresolved rather than dropped, so a missing link shows up as a question instead of disappearing.

## Where to see them

| View | What it shows |
| --- | --- |
| Applications | Applications, their components and resources, with the tag and confidence behind every grouping |
| Dependencies | The dependency graph, by edge kind, with unresolved edges kept visible |
| Topology | Where each application's resources sit — by region and availability zone |

## Nothing counts until a person approves it

Every proposed application and dependency arrives in the **Approval Center** as a proposal. Nothing enters a recovery plan or a baseline until someone with approval rights accepts it. A rejected proposal is recorded and is not proposed again. See [Approvals, Baselines & Drift](/docs/drm/governance).

## Next

- [Protection](/docs/drm/protection) — what the configuration says is backed up or replicated.
- [Recovery Plans & Readiness](/docs/drm/recovery-plans) — how approved applications become an ordered plan.
`,
  },
  {
    slug: "drm/protection",
    title: "Protection",
    breadcrumb: "Onam DRM / Protection",
    body: `
The **Protection** view answers one question: what does the cloud configuration say is backed up, snapshotted or replicated? It answers it carefully, because a protection report that overstates is worse than none.

## What DRM reads

Protection is read from **cloud configuration** through the platform's read-only connection. That includes, for example:

- backup plans and their retention;
- database automated backups and multi-zone deployments;
- snapshots;
- read replicas;
- storage replication, including cross-region replication.

Which mechanisms DRM recognises varies by cloud and by resource type.

## Configured is not protected

A configured mechanism is reported as **discovered** — never as *protected* or *tested*. Those are statements a person makes.

Configuration shows that a mechanism is set up. It does **not** show:

- whether last night's backup job succeeded;
- whether a restore has ever worked;
- whether the copy is complete or usable.

DRM does not pretend otherwise. The way to prove a recovery works is a drill run with your own tools and recorded in DRM — see [RTO, RPO & Drills](/docs/drm/objectives).

## What DRM cannot see

DRM reads the cloud provider's control plane. Anything that only happens **inside** a server is invisible to it:

- a database dump or backup job scheduled inside a virtual machine;
- the job history of a third-party backup product.

There are **no connectors to backup products**. A resource with no configured mechanism that DRM can see may still be protected by something it cannot — treat it as a question for the resource's owner, not as a verdict.

## Per resource and per application

Protection is a property of a **resource**, so DRM records it whether or not the resource has been grouped into an application yet. A database nobody has tagged still shows the backup its configuration has.

Where a resource belongs to an application, protection is also shown **per application**. A resource used by two applications gets one pairing for each: the same replica can be critical to one application and incidental to another, and approving it for one is not approving it for the other.

## How protection feeds the rest of DRM

- **Recovery plans** use only approved protection pairings.
- **Predicted RPO** comes from replication links — the worst link, taking the larger of the lag last observed and the configured target. An application protected only by backups, with no backup frequency recorded, gets no predicted RPO rather than a guess. See [RTO, RPO & Drills](/docs/drm/objectives).
- **Drift** reports protection that changed since you approved the baseline — for example a new resource without protection. See [Approvals, Baselines & Drift](/docs/drm/governance).
`,
  },
  {
    slug: "drm/recovery-plans",
    title: "Recovery Plans & Readiness",
    breadcrumb: "Onam DRM / Recovery Plans",
    body: `
A **recovery plan** is the order in which an application comes back: which steps, in what sequence, which can run at the same time, and how long the whole thing should take. DRM composes it; a person approves it; your own tools and runbooks carry it out.

## How a plan is composed

Plans are composed from **approved items only** — approved applications, approved dependencies and approved protection pairings. Nothing an engine has merely proposed can shape a plan.

Each plan has:

- **Ordered steps**, following the recovery-order dependencies between the application's parts.
- **Parallel groups** — steps that can run at the same time.
- **The critical path** — the longest chain of steps that must run one after another.
- For every step, **where its position came from**: a discovered dependency, or convention. A step placed by convention is a prompt to check the order with the application's owner.

A composed plan arrives in the Approval Center like any other proposal.

## Predicted RTO

Predicted recovery time is the **critical path** through the approved plan. Steps that run in parallel cost the longest of them, not the sum. A step nobody has timed still carries its default duration, so it never drops off the path. With no approved plan there is no predicted RTO — the field is left blank rather than showing zero. The detail is in [RTO, RPO & Drills](/docs/drm/objectives).

## Readiness

Each application is rated on recovery readiness as **ready**, **warning**, **at risk** or **not ready**.

Readiness sets the application's predicted figures against the **required** RTO and RPO you entered for it. A required target is your input, and a calculated value never overwrites it.

## The executive resilience scorecard

For leadership, DRM summarises each application against four plain questions:

1. Does a recovery **plan exist**?
2. Is the predicted recovery **within the required RTO**?
3. Is it **governed by a baseline** — an approved model that drift is measured against?
4. Has it been **proven by a drill**?

## What a plan is not

- DRM does **not execute** the plan or fail anything over. It is the order and the expectation; the recovery is carried out with your own tools.
- DRM does **not run DR tests.** When you test the plan, record the drill in DRM and it is compared with the prediction captured when the drill was planned.
`,
  },
  {
    slug: "drm/access",
    title: "Access & Entitlement",
    breadcrumb: "Onam DRM / Access",
    body: `
## One login, one console

Onam DRM runs at **/drm** inside the same console as the rest of the Onam platform, behind the same login. There is no second credential and no separate set of cloud connections — DRM reads the platform's cloud inventory, so your accounts are connected once.

## Entitlement

DRM is a **separate product**, granted per organisation as its own add-on. Organisations without the grant do not get access to DRM's pages or its API.

## Who can do what

Seeing DRM, approving what it proposes and authoring records in it are **separate permissions**. Reaching a page does not let you approve anything on it.

| Permission | What it allows |
| --- | --- |
| **View** | Read applications, dependencies, protection, plans, readiness, drift and drills |
| **Approve** | Accept or reject proposals in the Approval Center — the act that lets an item into a plan or a baseline |
| **Author** | Create and edit what people write in DRM, such as drill records |
| **Modify rules** | Change the rules DRM's engines use |

Permissions come from the roles and grants your platform administrator already manages — DRM does not keep its own user list. A grant carries the **scope** it was made at: a permission granted for one cloud account allows nothing across the whole organisation.

## What DRM changes in your cloud

Nothing. DRM reads configuration and inventory. Approvals, baselines, required targets and drill records are records **inside DRM**, not changes to your cloud accounts. It does not execute a recovery, run a DR test or connect to a backup product.

> **"Why can't I see DRM?"** Either your organisation has not been granted it, or your role does not include it. Ask your platform administrator, or [talk to us](/request-demo?product=drm).
`,
  },
];
