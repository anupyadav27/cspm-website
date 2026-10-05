import type { DocArticle } from "./types";

/**
 * Feature docs for capabilities that shipped in the product before the docs
 * caught up. Each one existed in the console and was documented nowhere, which
 * meant the fallback generic body was being served under a real slug.
 */
export const articles: DocArticle[] = [
  {
    slug: "features/cnapp",
    title: "CNAPP — the unified posture score",
    breadcrumb: "Features / CNAPP",
    body: `
**CNAPP** is not a separate engine. It is the unified view across everything Onam Security runs: seven pillars, each scored from the findings its engines produced, rolled into one posture score.

## The seven pillars

| Pillar | What it scores |
| --- | --- |
| CSPM | Cloud configuration posture |
| CIEM | Identity and entitlement risk |
| CWPP | Workload protection |
| DSPM | Data security posture |
| Network | Network posture across the seven layers |
| Threat | Attack paths and MITRE-mapped activity |
| AppSec | SAST, DAST and SCA findings |

## How scoring works

1. Each pillar scores its own findings on a common 0–100 scale.
2. Scores are weighted by **severity** and by **exposure** — a critical finding on an internet-reachable resource moves the score more than the same finding on an isolated one.
3. Pillar scores roll into one overall score with a risk band, trended over time.
4. Every score decomposes: score → pillar → finding → resource → remediation.

Because all pillars read the same findings model, the same resource is never counted twice or scored inconsistently between views.

## Why the score moves when nothing changed

Because the estate changed. New resources are discovered continuously, and a newly deployed misconfigured resource lowers the score the same day it appears. Score history shows which findings caused any movement.

## What is not in the score

[Onam Estate](/docs/estate/overview) and [Onam FinOps](/docs/finops/overview) are separate products and do not contribute to the CNAPP score. Folding a cost figure into a security score would make the number mean nothing.
`,
  },
  {
    slug: "features/technology-engine",
    title: "Technology Engine",
    breadcrumb: "Features / Technology Engine",
    body: `
Cloud posture rules judge the cloud's configuration — is the bucket public, is the database encrypted. The **Technology Engine** goes one layer deeper: given that a PostgreSQL 12 instance is running on that host, is the version supported, are its defaults hardened, and does it reach end of life next quarter?

## Coverage: 34 CIS technology benchmarks

Thirty-four benchmarks across nine families. These are **named products**, not vague categories:

| Family | Technologies |
| --- | --- |
| Databases | PostgreSQL, MySQL, MariaDB, MongoDB, Cassandra, Oracle DB, SQL Server, IBM Db2 |
| Operating systems | RHEL, Ubuntu, Debian, CentOS, SUSE |
| Web & app servers | Nginx, Apache HTTP, IIS, Tomcat, WebSphere |
| Containers & virtualisation | Docker, VMware ESXi |
| Network appliances | Cisco ASA, Cisco IOS XE, Cisco IOS XR, Cisco NX-OS, Palo Alto, FortiGate, Check Point |
| SaaS & DevOps | Microsoft 365, SharePoint, Google Workspace, Dynamics 365, Snowflake, GitLab |

Together these carry **8,991 technology control rows**.

## How detection works

Detection is agentless. The engine identifies running technology through cloud metadata, container image inspection and read-only process metadata — the same integrations that power the rest of the platform.

1. Enumerate what is actually running, rather than what was formally provisioned.
2. Match each detected technology and version to its CIS benchmark.
3. Evaluate the benchmark's controls against the running configuration.
4. Join the result to the identity, network and vulnerability graph.

## Why the graph join matters

An unhardened database on an isolated subnet and one behind a public load balancer fail the same controls and are not the same problem. Because technology findings land on the same graph as everything else, each one carries whether the workload is internet-reachable and what identity it holds — which is what separates the two.

## Shadow IT

By enumerating what runs rather than what was provisioned, the engine surfaces workloads that appear in no CMDB, no Terraform module and no ownership record. Those receive owner-suggestion signals from tags, IAM and network neighbours.

## Collection method

Controls are marked by how they are collected — via **API**, or requiring an **agent**. Controls that can only be evaluated at the host level, and hardware-level controls that no remote collector can reach, are classified as **manual** rather than being reported as passing. A control that cannot be checked is never scored as if it were.

> Related: [CSPM](/docs/features/cspm) covers the cloud's own configuration; the Technology Engine covers what runs on top of it. Most estates need both.
`,
  },
  {
    slug: "features/access-reviews",
    title: "Access Reviews",
    breadcrumb: "Features / Access Reviews",
    body: `
**Access reviews** turn CIEM output into an attestation workflow. Each flagged identity gets a state, a reviewer and an outcome — so a review is a tracked decision rather than a spreadsheet emailed once a quarter.

## Review states

| State | Meaning |
| --- | --- |
| Pending | Awaiting a reviewer's decision |
| Needs remediation | Reviewed, and something must change |
| Reviewed | Decision recorded, no change needed |
| Deferred | Explicitly postponed, with the deferral recorded |

**Deferred is a first-class state on purpose.** A review process without one produces reviewers who mark things "reviewed" to clear the queue, which is worse than an honest backlog.

## The finding stays attached

Each identity under review carries the [CIEM](/docs/ciem/overview) evidence that flagged it — its permission gap, granted and used counts, and high-risk unused actions. A reviewer who cannot see why an identity was flagged approves it, every time.

## What reviews cover

Reviews open automatically for AWS identities whose CIEM risk score reaches the high tier. Decisions are written to an audit trail, expire after a set period, and return to pending if a reviewed or deferred identity is flagged again. The full workflow is in [Right-sizing workflow](/docs/ciem/right-sizing).

## Auditor evidence

Because each review carries its state, its reviewer and its timestamp, the review history is the evidence an access-review control asks for — rather than a screenshot of a spreadsheet assembled the week before the audit.

> Related: [CIEM](/docs/ciem/overview) produces the findings; access reviews are how they get decided.
`,
  },
  {
    slug: "features/choke-points",
    title: "Choke Points",
    breadcrumb: "Features / Choke Points",
    body: `
A **choke point** is a real entry node that serves as a gateway to a large part of your attack surface. Each one is scored by everything reachable from it.

## Why choke points rather than paths

Attack path analysis produces a lot of paths, and paths overlap heavily — the same internet-facing node is usually the first hop in hundreds of them. A queue of individual paths asks you to fix the same node hundreds of times.

Choke points invert the view. Instead of ranking paths, they rank the **nodes that paths run through**, so the work is ordered by how much of the surface each fix removes.

## What each row carries

| Column | Meaning |
| --- | --- |
| Entry node | The real resource that serves as the gateway |
| Severity | Critical or high, by what is reachable |
| Paths | Every attack path that runs through this node |
| Crown jewels | Every crown-jewel asset reachable from it |

## Reading the view

The strip above the table gives entry-node count, the critical and high splits, total paths and total crown jewels reachable. A small number of entry nodes carrying a large share of total paths is the normal and useful shape — it means a handful of fixes collapse most of the graph.

## Deduplication

Choke points are deduplicated by real entry node. Without that, the same gateway appears once per path it participates in, and the ranking becomes a popularity contest between duplicates of one resource.

> Related: [Attack Path](/docs/features/attack-path) for the full paths behind each choke point.
`,
  },
  {
    slug: "features/compliance-coverage",
    title: "Compliance Coverage",
    breadcrumb: "Features / Compliance Coverage",
    body: `
**Compliance coverage** answers a question a framework score cannot: how much of this framework can Onam actually assess, and what is left for you?

## Score versus coverage

A compliance score says what proportion of assessed controls pass. Coverage says what proportion of the framework's controls were assessed at all. Reporting the first without the second is how a framework with a third of its controls unmapped shows a reassuring score.

The view reports both: **framework assessment scores** and **control coverage**.

## Why a control might not be automatically assessed

| Reason | What it means |
| --- | --- |
| Requires an agent | The control is evaluated at host level, not through a cloud API |
| Hardware-level | Physical or hardware controls no remote collector can reach |
| Process control | The control is about a documented process, not a configuration |
| Not applicable | The control's technology is not present in this estate |

Controls in the first three groups are classified as **manual** rather than reported as passing. A control nothing checked is never scored as if it passed.

## Collection method

Every control records whether it is collected via **API** or requires an **agent**. This is the honest version of coverage: it tells an auditor exactly which assertions are continuously verified and which rest on a documented process.

## Coverage across frameworks

Onam maps **78 frameworks**. Coverage varies between them — a cloud-native benchmark maps almost entirely to automated checks, while a broad control framework like NIST 800-53 has substantial process content that no scanner can assess. The coverage view makes that difference visible per framework instead of averaging it away.

> Related: [Compliance](/docs/features/compliance) for the framework list and evidence export.
`,
  },
];
