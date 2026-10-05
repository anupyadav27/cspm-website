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
];
