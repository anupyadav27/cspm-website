import type { AuthorSlug } from "./authors";

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  /** Who put their name on it — see src/data/authors.ts. */
  author: AuthorSlug;
  /** Optional second name: checked the piece, did not write it. */
  reviewedBy?: AuthorSlug;
  date: string;
  readTime: string;
  body?: string; // markdown-ish plain content is rendered by the article page
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "wiz-vs-orca-poc-questions",
    title: "Wiz vs Orca POC: 30 questions to ask in any CNAPP trial",
    category: "Buyer's Guide",
    excerpt:
      "Running a Wiz vs Orca (or any CNAPP) POC? 30 vendor-neutral questions grouped by week: access, coverage, accuracy, prioritisation, remediation and cost.",
    author: "anup-yadav",
    date: "October 7, 2026",
    readTime: "9 min",
    body: `
A cloud security proof of concept usually ends with two vendors who both found plenty, both demoed well, and a team that still cannot say which one to buy. That is not the buyer's fault. Point any CNAPP at a messy cloud account and findings appear. The questions below are designed to separate platforms that look identical in a demo, whether your shortlist is Wiz vs Orca, Wiz vs Cortex Cloud, or anything else.

They are vendor-neutral on purpose. Onam Security wrote this, and Onam sells a cloud security platform, so where we mention ourselves it is labelled. Every question works just as well with us left off your list.

## Before the POC: set it up so the answers mean something

Most POCs are decided before the first scan, by how they are set up.

- **Use the same accounts for every vendor.** Two or three non-production accounts you know have real problems, connected to every platform in the same week. Different accounts produce incomparable results.
- **Plant known issues.** Before connecting anyone, create five to ten misconfigurations you can name: a public storage bucket, a role with a wildcard policy, a security group open to the internet, an unencrypted database, a workload with a known vulnerable package and a path from it to sensitive data. You now have an answer key.
- **Write the success criteria down first.** Three to five outcomes, agreed with whoever signs the purchase, before any vendor is in the room.
- **Name one scorer per criterion,** so the platform with the best sales engineer does not win by default.

Two weeks is enough for everything below. A POC that needs longer is usually missing an answer key.

## Week 1, days 1–2: access and deployment

1. **Exactly what permissions does onboarding grant?** Ask for the policy or template before you run it, and read every action. Read-only should mean read-only.
2. **What runs in my account, and who pays for it?** Some scanning creates resources in your account, such as snapshots or scanner compute. Ask what, where, and whether it shows on your cloud bill.
3. **Which features need an agent or sensor, and on which workloads?** Both Wiz and Orca describe agentless scanning plus an optional runtime sensor on their own pages, so ask both precisely what the sensor adds and what a workload without it receives.
4. **Where does my data go?** Which region stores findings and metadata, what leaves the account, and how long it is retained.
5. **How long until the inventory is complete?** Do not ask, measure. Note when each account was connected and when its inventory stopped growing.

## Week 1, days 2–4: coverage

6. **Which of my clouds get the full engine?** Ask for the per-cloud rule breakdown, not the headline total, and a live demo on your second and third clouds, not only AWS.
7. **Which of my services are covered?** Export the inventory and compare it with your own list of services in use. The missing ones matter more than the count.
8. **How is Kubernetes covered?** Cluster configuration, workload configuration, RBAC, and whether a container finding links to the cloud identity the pod can assume. See [KSPM](/learn/kspm).
9. **What about identity?** Effective permissions, unused permissions, and cross-account trust. Ask on which clouds each of those works. See [CIEM](/learn/ciem).
10. **Does it see code and infrastructure as code?** And can it trace a runtime finding back to the Terraform or template that created it, so the fix is not undone on the next deploy?

## Week 1, day 5: accuracy

11. **Did it find every planted issue?** Score against your answer key. This is the single most objective test in the POC.
12. **How many of the top 50 findings are real?** Have an engineer mark each as real, false positive, or accepted risk. Compare the false-positive rate across vendors.
13. **How many findings are the same problem counted twice?** One public bucket can surface as a posture finding, a data finding and an exposure finding. Duplicates inflate counts and waste triage time.
14. **How fast does a change show up?** Make a configuration change and time how long until it appears as a finding, and how long until it closes after you fix it.
15. **How are exceptions handled?** Can you accept a risk with an owner, a reason and an expiry date, and does it come back when it expires?

## Week 2, days 1–2: prioritisation

16. **What does it rank first, and why?** Ask the vendor to explain the top three findings in your accounts, live, without slides.
17. **What unit is the ranking in?** A severity label, a score, or business impact? Ask how you would explain the number to a CFO. See [cloud risk quantification](/learn/cloud-risk-quantification).
18. **Does it connect findings across engines?** A public subnet, an over-privileged role and a vulnerable workload are each medium alone and serious together. Ask it to show that chain in your accounts. See [cloud attack paths](/learn/cloud-attack-path).
19. **Can an attack path cross a cloud boundary?** If you run more than one cloud, ask whether federation between them is modelled, and demo it.
20. **How are vulnerabilities weighted?** CVSS alone, or exploit likelihood such as EPSS and known-exploited status, and reachability? See [EPSS over CVSS](/resources/blog/epss-over-cvss).

## Week 2, days 3–4: remediation and workflow

21. **What does the fix guidance look like?** Console steps, CLI, and an infrastructure-as-code change. The IaC fix is the one that lasts.
22. **Does it route findings to the right owner?** By account, tag or team, into the ticketing tool you already use, without opening one ticket per duplicate.
23. **If it auto-remediates, with what permissions?** Any write access is a new attack surface. Ask what it can change, who approves, and how it is audited.
24. **Does a fix get verified?** The finding should close on the next scan, with evidence, not when someone ticks a box.
25. **Can each team see only its own estate?** Role-based access, scoped views, and SSO with group mapping.

## Week 2, day 5: compliance, cost and exit

26. **Which frameworks are mapped, and is evidence continuous?** Ask whether framework scores update as infrastructure changes or only when a report is exported.
27. **What does an auditor actually receive?** Export a report for one framework and ask your auditor whether it is usable.
28. **What unit does the price grow with?** Workloads, resources, accounts or spend, and what happens to the bill when your estate doubles.
29. **What is in the base package and what is an add-on?** Get it in writing against the features you used in the POC.
30. **How do I get my data out?** API access, bulk export, and what happens to your data when the contract ends.

## A scoring sheet you can copy

| Area | Weight (example) | Evidence to collect |
| --- | --- | --- |
| Access and deployment | 15% | Permission review, time to complete inventory |
| Coverage | 20% | Per-cloud breakdown, missing services |
| Accuracy | 25% | Planted issues found, false-positive rate in top 50 |
| Prioritisation | 20% | Top three explained live, cross-engine and cross-cloud paths |
| Remediation and workflow | 10% | IaC fix quality, ticket routing, fix verification |
| Compliance, cost and exit | 10% | Auditor feedback, pricing unit, export test |

Change the weights to match your success criteria, but fix them before the POC starts, not after you have a favourite.

## Wiz vs Orca specifically

Both vendors describe a similar shape on their own pages. Wiz says it "connects in minutes via API" with "Runtime protection from the Wiz Sensor" (wiz.io/platform, 7 October 2026). Orca describes "Agentless scanning across every workload" through SideScanning and "Runtime observability & protection" from the Orca Sensor (orca.security/platform, 7 October 2026). Because the architectures are close, the differences will show up in questions 11 to 20: what each finds in your accounts, how much is noise, and what each ranks first. That is where to spend your scoring time. For more options beyond these two, see [Wiz alternatives in 2026](/resources/blog/wiz-alternatives) and [the best CSPM tools](/resources/blog/best-cspm-tools).

## Warning signs during a POC

None of these proves a product is wrong for you, but each deserves a direct question.

- The demo only ever runs in the vendor's own tenant, never yours.
- The top findings are generic benchmark checks with no context about your environment.
- Rule counts are given as one total with no per-cloud breakdown.
- Nobody can explain, live, why the first finding is ranked first.
- Pricing arrives only after the POC is "won".

## Where Onam fits (our section)

If you include us, these are our answers, stated so you can check them. Posture scanning connects through read-only cloud roles you can read before you run them; workload scanning runs inside your account, and there is no Onam sensor on your hosts. Posture rules cover seven clouds, including OCI, Alibaba Cloud and IBM Cloud, and we publish the per-cloud counts. Findings sit on one graph, so a path can cross clouds, and each finding carries a FAIR-style loss estimate with its inputs shown. Compliance is recomputed on every scan against 78 frameworks.

The honest limit: we have no public reference customers yet and no runtime enforcement. If inline blocking is one of your success criteria, we will not meet it. Our answers to the seven questions that matter most are in [Wiz vs Orca vs Prisma Cloud: 7 questions that decide a POC](/resources/blog/onam-vs-wiz-orca-prisma-cloud), and the head-to-heads are on the [Onam vs Wiz](/compare/onam-vs-wiz) and [Onam vs Orca](/compare/onam-vs-orca) pages.

## Frequently asked questions

### What questions should I ask during a Wiz vs Orca POC?

Ask what onboarding grants, what the runtime sensor adds, whether each platform found your planted issues, its false-positive rate in the top 50 findings, what it ranks first and why, how it routes and verifies fixes, and what unit the price grows with. The 30 questions above cover each week of a two-week POC.

### How long should a CNAPP POC take?

Two weeks is enough if you prepare an answer key of planted issues and agreed success criteria before the first vendor connects. Longer POCs usually signal unclear criteria rather than a harder evaluation.

### How many vendors should be in a POC?

Two or three, including your incumbent if you have one. More than three in the same accounts and the same fortnight is hard for one team to score fairly.

### Should a POC use production accounts?

Start with non-production accounts that mirror production and contain known issues. Add a production account only once the permission review in question 1 is complete and signed off.

### What success criteria should a cloud security POC have?

Three to five measurable outcomes agreed before it starts, for example: finds all planted issues, false-positive rate below an agreed level in the top 50, top three findings explained live, and a fix verified automatically on rescan.

*Read next: [What is CNAPP](/learn/cnapp), [What is CSPM](/learn/cspm), and [how attack paths work](/learn/cloud-attack-path).*
`,
  },
  {
    slug: "dspm-implementation-checklist",
    title: "DSPM implementation checklist: a practical rollout for cloud data",
    category: "Data Security",
    excerpt:
      "A step-by-step DSPM implementation checklist: inventory every data store, classify it, map who can reach it, and fix exposure in a sensible order.",
    author: "anup-yadav",
    date: "October 5, 2026",
    readTime: "6 min",
    body: `
Most teams do not decide to buy data security posture management in the abstract. Something forces the question. An auditor asks for a map of where customer data lives. A data export turns up in a bucket nobody remembers creating. A new analytics platform arrives and nobody can say which identities can read it. DSPM is the discipline of answering those questions continuously instead of once, in a panic, the week before an audit.

This post is the checklist we would use to roll it out. It is deliberately tool-neutral until the last section.

## The problem DSPM exists to solve

Cloud data does not stay where it was put. A single production database becomes read replicas, warehouse copies, nightly exports to object storage, a staging copy for testing, and a cache that outlived the feature it served. Each copy is created by a different team for a good reason, and each one inherits whatever access and encryption settings were convenient on the day.

Three things go wrong at once:

- **Nobody has a complete inventory.** The data stores the security team knows about are a subset of the ones that exist.
- **Sensitivity is unknown.** A bucket called \`exports-2024\` might hold marketing images or a full customer table.
- **Access is decided elsewhere.** Who can read a store is the product of identity policies, resource policies and network paths, none of which live next to the data.

DSPM brings those three together: what data you have, how sensitive it is, and who or what can reach it.

## How teams usually handle it today

Before a DSPM programme, data security is usually a mix of:

- A spreadsheet of "crown jewel" databases maintained by hand and out of date within a quarter.
- Per-service checks from the cloud provider: is this bucket public, is this volume encrypted.
- Periodic manual reviews of who has access to production data, often driven by a compliance deadline.

None of these is wrong. The gap is that each answers one question about one resource. Exposure is usually a combination: a store that is encrypted, private, and still readable by an over-privileged role that is itself reachable from the internet.

## The rollout checklist

Work through these in order. Each step makes the next one cheaper.

### 1. Define what "sensitive" means for you

Before scanning anything, agree on the categories you care about. Most organisations start with:

- Personal data (names, emails, national identifiers, dates of birth)
- Health data
- Payment card data
- Secrets and credentials stored as data (keys in config exports, tokens in logs)

Write down which regulations and contracts apply to each. That list decides your priorities later.

### 2. Inventory every data store, across every account

Cover object storage, managed relational databases, NoSQL stores, warehouses, data lakes, block and file volumes, and any SaaS data platforms you run. Include non-production accounts: test copies of production data are one of the most common places sensitive data ends up with weak controls.

Checklist for this step:

- Every cloud account and subscription is connected, not just production.
- Every region is covered, including ones you do not think you use.
- Each store has an owner, even if the first owner is "unknown, needs triage".

### 3. Classify, and record your confidence

Classification can be done by reading contents or by reading metadata: names, tags, schemas, column names and configuration. Each has trade-offs. Content inspection is more precise but means a tool reads your data. Metadata classification is less intrusive and faster, but it can be wrong when names are vague.

Whatever approach you use, keep a confidence level on each label. A table with columns named \`ssn\` and \`dob\` is high confidence. A bucket called \`data-backup\` is not, and should be flagged for a human to confirm.

### 4. Map who can reach each sensitive store

This is the step most programmes skip, and it is the one that matters most. For each store labelled sensitive, answer:

- Which human users, roles and service accounts can read it?
- Which can write or delete?
- Is it reachable from the internet, directly or through a public endpoint?
- Are there cross-account or external principals in that list?

Access is rarely granted on the store itself. It comes through role policies, group memberships and trust relationships, so this step needs identity analysis, not just a resource check.

### 5. Check the basic controls on every sensitive store

For each sensitive store, verify:

- Encryption at rest is enabled, with a key you control where policy requires it.
- Encryption in transit is enforced.
- Public access is blocked unless there is a documented reason.
- Access logging is on, so you can answer "who read this?" after the fact.
- Retention and lifecycle rules match your data retention policy.
- The store is in a region your residency commitments allow.

### 6. Prioritise by exposure, not by count

You will find more issues than you can fix in a sprint. Rank them by combining sensitivity, reachability and identity:

1. Sensitive data reachable from the internet.
2. Sensitive data readable by identities that are themselves over-privileged or unused.
3. Sensitive data without encryption or logging.
4. Everything else.

### 7. Make it continuous

A one-off DSPM assessment is out of date within weeks. Set a cadence for re-classification, alert on new stores and on permission changes to sensitive ones, and track the trend, not just the current count.

## Common mistakes

- **Scanning production only.** Copies in development and test accounts are where weak controls live.
- **Treating classification as the finish line.** A labelled store with unknown access is still an unknown risk.
- **Fixing per bucket instead of per root cause.** If one template creates every export bucket, fix the template.
- **No owner.** A finding without an owner does not get fixed.

## How Onam approaches it

[Onam's Data Security engine](/platform/data-security) is its DSPM implementation. It inventories data stores across your connected clouds through read-only posture roles — object storage, managed databases and warehouses, streams and Kubernetes secrets — plus self-hosted databases, including Snowflake, that you onboard.

Classification is metadata-based: Onam labels each store PII, PHI, PCI, financial or confidential from its name, description, tags and schema, without reading the contents. Because the labels come from names and tags, the reason is readable in the store's own metadata, and a missing label is fixed with a tag.

Each store then carries the ways it can be reached: the grants that make it public, the other accounts its bucket policy lets in, the principals seen accessing it in the last 30 days, and the attack paths on the shared security graph that end at it. Alongside that you get encryption, logging, lifecycle and residency checks, a 0–100 governance score per store, and data lineage across replication, backup, ETL, streaming and export hops. Everything is re-evaluated on every scan. The detail is in the [DSPM documentation](/docs/dspm/overview).

If you want to see what this looks like on your own accounts, a [14-day trial](/request-demo) is the quickest way to find out.
`,
  },
  {
    slug: "data-lineage-security-unencrypted-hops",
    title: "Data lineage security: why encryption is a property of the flow, not the bucket",
    category: "Data Security",
    excerpt:
      "Every bucket passes its encryption check, yet the data still lands somewhere unprotected. How data lineage security finds the weak hop in a pipeline.",
    author: "anup-yadav",
    date: "October 5, 2026",
    readTime: "6 min",
    body: `
Here is a pattern that turns up in almost every data platform review. The source database is encrypted with a customer-managed key. The data lake it feeds is encrypted. The warehouse is encrypted. Every individual resource passes its encryption check. And yet, somewhere in the middle, a nightly job writes an intermediate extract to a staging location that has default settings, broad read access and no lifecycle rule. The data is sitting there in a form nobody intended.

No per-resource check will flag this as a data protection problem in context, because each resource is judged alone. The weakness is in the path. That is what data lineage security is about.

## What data lineage security means

Data lineage is the record of where data comes from, what transforms it, and where it ends up. Data teams have used lineage for years to debug pipelines and answer "where did this number come from?". Data lineage security applies the same idea to protection: for every route sensitive data takes, are the controls consistent from the first hop to the last?

The questions change from "is this bucket encrypted?" to:

- Where does data from this sensitive source end up?
- Is every hop along that route encrypted, at rest and in transit?
- Does access widen as data moves downstream?
- Does any hop cross a region or account boundary that your commitments do not allow?

## Why pipelines create exposure

Pipelines are built for correctness and speed, not for consistent controls. The common causes:

- **Intermediate stores.** Staging buckets, temporary tables and export folders are created for one job and configured with whatever defaults applied.
- **Different owners per hop.** The application team owns the source, the data engineering team owns the transforms, the analytics team owns the destination. Each secures its own piece.
- **Access widens downstream.** Production databases are usually tightly controlled. Analytics destinations are designed to be read by many people. Sensitive columns that were never meant to leave the source travel with the rest.
- **Copies outlive their purpose.** A one-off migration or backfill leaves a full copy behind, and nothing deletes it.

## How teams handle it today

Most teams handle this partly, through a mix of:

- Data catalogue tools maintained by the data team, which describe lineage for analytics but rarely carry security context.
- Per-resource posture checks, which confirm each store is encrypted and private but do not connect them.
- Architecture reviews when a pipeline is first built, which are accurate on the day and drift afterwards.

The gap is the join. The data team knows the flow. The security team knows the controls. Nobody has both on one page, so the weak hop sits between two teams' responsibilities.

## A checklist for securing data flows

### Map the flows that carry sensitive data

- Start from the stores you have classified as sensitive, not from every pipeline.
- For each, list the downstream destinations: replicas, exports, warehouse tables, lake partitions, caches, and SaaS destinations.
- Include scheduled jobs, event-driven functions and manual export processes. Manual exports are the ones most often forgotten.

### Check controls hop by hop

For each hop on a sensitive route:

- Encryption at rest is on, and the key policy is no weaker than at the source.
- Transport between hops is encrypted.
- Read access is no broader than the data's sensitivity justifies.
- Public access is blocked.
- Logging is enabled, so you can see who read the data at that hop.
- A retention rule exists, especially for staging and intermediate stores.

### Look for widening and crossing

- Flag any hop where the set of identities that can read the data grows sharply compared with the source.
- Flag any hop that moves data into another account, another cloud, or another region.
- Flag any hop that writes to a store with no owner.

### Grade the route, not just the resources

Give each route a single risk grade based on its weakest hop. A route with four strong hops and one weak one is a weak route. Ranking by route rather than by store also cuts duplicate work: one finding about one flow, instead of separate tickets for each store it touches.

### Fix at the point of creation

Most weak hops are created by pipeline code or infrastructure templates. Fix the job definition or the template that creates the staging location, not just the instance of it you found today, or it will be recreated on the next run.

### Re-check after every pipeline change

New jobs, new destinations and new consumers change the route. Treat a new downstream destination for a sensitive source as something that should trigger a review.

## A short worked example

A customer table lives in an encrypted managed database. A nightly job exports it to an object storage folder, then loads it into a warehouse.

- Source: encrypted, private, access limited to the application role.
- Export folder: encrypted with a default key, readable by a broad data engineering role, no lifecycle rule.
- Warehouse: encrypted, readable by the analytics group.

Every resource passes a basic encryption check. The route still has a problem: the export folder keeps every night's full copy forever, readable by more identities than the source. The fix is a lifecycle rule and a narrower role on the export location, made in the template that creates it.

## How Onam approaches it

Data lineage is part of [Onam's Data Security engine](/platform/data-security), its DSPM implementation. Onam links the relationships your cloud's configuration already records — replication, backup, ETL writes, streaming, export and import — into chains that start at the original source and follow each path up to eight hops. Every hop that crosses a region or an account is flagged, because those are the moments a copy leaves the controls on the original.

Each store in a chain carries its own DSPM checks — encryption, public access, logging, lifecycle — and its metadata-based classification, so the route and the state of each stop on it can be read together. Lineage sees what configuration describes: a copy made by a script with its own credentials leaves no relationship to follow. How chains are built is set out in the [lineage documentation](/docs/dspm/lineage).

To see the chains in your own environment, [request a demo](/request-demo) or start a 14-day trial.
`,
  },
  {
    slug: "iac-security-scanning-fix-at-source",
    title: "IaC security scanning: fix the template, or the finding comes back",
    category: "Code Security",
    excerpt:
      "Console fixes are undone by the next terraform apply. A practical guide to IaC security scanning that traces cloud findings back to the template line.",
    author: "anup-yadav",
    date: "October 5, 2026",
    readTime: "6 min",
    body: `
An engineer gets a ticket: a storage bucket allows public access. They open the cloud console, turn public access off, and close the ticket. A week later the same finding is back. Nobody re-opened the bucket by hand. The next \`terraform apply\` recreated it exactly as the template describes it, because the template was never changed.

This loop is one of the most common reasons cloud security programmes feel busy without improving. The fix is not working harder on the console. It is scanning and fixing infrastructure as code (IaC), and connecting runtime findings back to the code that created them.

## Why console fixes do not stick

When infrastructure is managed as code, the code is the source of truth. Terraform, CloudFormation, Helm charts and Kubernetes manifests describe the desired state, and every apply pushes the cloud back towards that state. A manual change in the console is drift. Depending on how the resource is managed, the next deployment either reverts it silently or shows it as an unexpected diff that someone "fixes" by re-applying.

The result is a finding that keeps coming back, gets triaged again, and wears down trust in the security tool that keeps reporting it.

## What IaC security scanning does

IaC security scanning evaluates infrastructure templates against security policy before anything is created. Typical checks include:

- Storage with public access or without encryption.
- Network rules open to \`0.0.0.0/0\` on sensitive ports.
- Databases without encryption, backups or deletion protection.
- Identity policies with wildcard actions or resources.
- Kubernetes workloads running privileged, as root, or with host mounts.
- Logging turned off on services that should be audited.

Scanning can run in three places, and mature teams use all three:

1. **In the editor or pre-commit**, so the engineer sees the issue while writing the code.
2. **In the pull request**, so the reviewer sees it and the pipeline can gate on it.
3. **Against the plan**, so what is checked is what will actually change, including values from variables and modules.

## How teams handle it today

The usual starting point is a standalone IaC scanner added to CI. It helps, but three gaps show up quickly:

- **Different rules in code and in the cloud.** The IaC scanner and the runtime posture tool each have their own policy set. A template passes in CI and the resource it creates fails in production, or the reverse, and engineers stop trusting either.
- **No link back from runtime.** When a runtime finding appears, nobody can say which repository, file and resource block created it, so the fix lands in the console again.
- **Everything fails the build.** The first scan of an existing repository finds hundreds of issues. If the pipeline blocks on all of them, the gate is disabled within weeks.

## A checklist for IaC security that holds

### Coverage

- All IaC formats in use are scanned: Terraform, CloudFormation, Helm, raw Kubernetes manifests, and any others your teams use.
- Modules and shared templates are scanned at their source, since one bad module spreads to every consumer.
- Scans run on every pull request, not only on the main branch.

### Policy

- One policy set for code and for runtime, so a pass in CI means the same thing as a pass in production.
- Every rule has a clear explanation and an example of the compliant configuration.
- Exceptions are recorded with a reason and an expiry, not by deleting the rule.

### Gating

- Gate on newly introduced findings. Work the existing backlog separately, on a schedule.
- Start with a small set of high-severity rules as blocking. Add more as the backlog shrinks.
- Make the gate's output readable in the pull request, with the file and line.

### Provenance

- Every runtime finding on an IaC-managed resource records which repository, template and resource block created it.
- Tickets for those findings go to the code owner, not to whoever has console access.
- The ticket asks for a code change. A console-only fix on a managed resource is treated as incomplete.

### Verification

- After the code fix merges and deploys, the runtime finding is re-evaluated and closes on evidence.
- If the finding reappears, it is flagged as a regression, and the provenance shows which change brought it back.

## Handling the backlog

The first full scan of a mature codebase is usually discouraging. Some practical ways through it:

- Group findings by module or template. One shared module is often responsible for a large share of them.
- Fix the modules first. Every consumer improves on its next apply.
- Leave findings in abandoned or archived code until last, or retire that code.
- Track the trend of new findings per week. That number should fall first, and it is the one that shows the gate is working.

## How Onam approaches it

[Onam's Code Security engine](/platform/code-security) checks Terraform, Kubernetes manifests, CloudFormation templates and Dockerfiles in a repository as part of every scan, alongside static analysis, dependency analysis and secret detection. The IaC checks use their own rule set, separate from the rules the runtime posture engine applies to deployed resources, and Onam does not yet trace a runtime finding back to the template line that created it — so the discipline described above, fixing in code rather than the console, is still yours to enforce.

On gating, Onam has no CI plugin today: a scan reports, and a pipeline that wants a gate calls the scan API and decides for itself ([CI usage](/docs/code-security/ci)). For static-analysis findings in application code, [AI Code Fix](/platform/ai-code-fix) can rewrite the affected files on a separate branch for your team to review; nothing merges itself.

[Request a demo](/request-demo) to see a repository scanned end to end.
`,
  },
  {
    slug: "ci-cd-security-gates-delta-gating",
    title: "CI/CD security gates that engineers do not bypass",
    category: "Code Security",
    excerpt:
      "Security gates that fail every build get switched off. How to design CI/CD security gates around new findings, clear output and an exception path.",
    author: "anup-yadav",
    date: "October 5, 2026",
    readTime: "6 min",
    body: `
Most security teams have lived through this. A scanner is added to the pipeline with every rule set to block. On day one it fails every build in the organisation, because the codebase already has hundreds of findings. By the end of the week there is an urgent request to make the step non-blocking "just for now". A month later nobody looks at its output.

A CI/CD security gate is only useful if it stays switched on. This post covers how to design one that does.

## What a security gate is for

A gate is a pipeline step that can stop a change from merging or deploying when it introduces a security problem. It usually combines several kinds of scanning:

- **Static analysis (SAST)** of application source, for issues such as injection, unsafe deserialisation and hard-coded credentials.
- **Software composition analysis (SCA)** of dependencies, including transitive ones, for known vulnerabilities.
- **IaC scanning** of Terraform, CloudFormation, Helm and Kubernetes manifests, for misconfiguration before it is deployed.
- **Secret detection**, for keys and tokens committed to source or pipeline configuration.
- In some pipelines, **dynamic testing (DAST)** of a running build in a test environment.

The gate's job is narrow: stop new problems from entering. It is not the place to fix every problem that already exists.

## Why gates get bypassed

The reasons are predictable:

- **They block on old findings.** An engineer changing one line is blocked by an issue introduced three years ago in a file they did not touch.
- **They are noisy.** A dependency scan that returns hundreds of findings ranked only by CVSS gives no way to tell which ones matter.
- **The output is unreadable.** A link to an external dashboard, rather than the file, line and reason in the pull request.
- **There is no exception path.** When a finding is a false positive or an accepted risk, the only way through is to disable the step.
- **They are slow.** A gate that adds a long wait to every pull request gets moved to a nightly job, where it no longer gates anything.

## How teams handle it today

The common patterns, roughly in order of maturity:

1. **Report-only scanning**, with results in a dashboard nobody checks.
2. **Blocking on critical severity only**, which helps but still blocks on pre-existing criticals.
3. **Baseline-and-diff**, where existing findings are recorded as a baseline and only new findings block.
4. **Context-aware gating**, where the decision also considers whether the affected code or workload is reachable and exposed in production.

Most teams get real value from moving from step 2 to step 3. Step 4 is where noise drops further.

## A checklist for a gate that stays on

### Scope the decision to the change

- Block only on findings introduced by this change. Pre-existing findings go to a backlog with owners and a schedule.
- Keep the baseline honest: findings in the baseline still need tracking and fixing, just not in this pull request.

### Start small, then tighten

- Begin with a short list of blocking rules: high-confidence, high-impact issues such as committed secrets, critical injection flaws, and public storage or open admin ports in IaC.
- Run the rest in report-only mode and promote rules to blocking once their false positive rate is known.
- Allow different policies per repository or branch where risk genuinely differs, with the security team owning the policy.

### Make the output actionable

- Show findings in the pull request, with file, line, rule and a short explanation.
- Include a compliant example or a suggested fix where possible.
- For dependency findings, show the version that resolves the issue.

### Add context to dependency findings

- Prefer reachability over presence: is the vulnerable function actually called by your code?
- Consider exploitation signals such as EPSS and the CISA Known Exploited Vulnerabilities list alongside CVSS.
- Consider runtime context: is the workload that ships this package internet-reachable, and what identity does it run as?

### Provide an exception path

- Allow a finding to be marked as a false positive or accepted risk, with a reason and an approver.
- Give exceptions an expiry date so they are reviewed.
- Keep exceptions visible to the security team, not hidden.

### Keep it fast

- Run incremental scans on the changed files where the scanner supports it.
- Run heavier scans, such as full DAST, on a schedule or before release, not on every commit.

### Measure the gate itself

- Track new findings introduced per week, findings blocked, exceptions granted, and time to fix the backlog.
- If exceptions climb, the policy is too strict or the rules are noisy. Fix the policy rather than letting the gate be bypassed.

## How Onam approaches it

[Onam's Code Security engine](/platform/code-security) brings static analysis, dependency analysis, IaC checks and secret detection into the same platform as its cloud posture. Static analysis keeps proven security issues apart from pattern-match hotspots, and dependency findings are ranked by EPSS and CISA KEV as well as CVSS — two ways of keeping a gate from firing on noise.

On gating, Onam is deliberately conservative: a scan reports its findings and nothing fails on its own. Onam has no CI plugin today; a pipeline step calls the scan API, reads the findings and decides ([CI usage](/docs/code-security/ci)). Scans cover the whole branch rather than only new findings, so the practical route to the delta-gating pattern described above is to start in report-only mode, work the backlog down, and turn your gate on once the baseline is small.

For SAST findings, [AI Code Fix](/platform/ai-code-fix) can rewrite the affected files and push them to a separate branch for your team to review; nothing merges itself.

[Request a demo](/request-demo) to see the gate on one of your repositories.
`,
  },
  {
    slug: "ai-sast-remediation-fix-branch",
    title: "AI SAST remediation: what an AI code fix should and should not do",
    category: "Code Security",
    excerpt:
      "AI can draft fixes for SAST findings, but it should never merge its own code. A practical look at safe AI SAST remediation, with a review checklist.",
    author: "anup-yadav",
    date: "October 5, 2026",
    readTime: "6 min",
    body: `
Static analysis tools are good at finding problems and poor at getting them fixed. A typical SAST run produces a list of findings, each with a rule, a file, a line and a severity. Turning each one into a correct code change is still a developer's job, and that is where the backlog grows.

AI code-fix tools promise to close that gap by drafting the change. They can help. They can also introduce subtle bugs, change behaviour nobody asked them to change, or create a false sense that something has been fixed. This post covers what a safe AI SAST remediation workflow looks like, and what to check before trusting one.

## Why SAST findings do not get fixed

The barriers are rarely about whether a finding is real. They are about effort and context:

- **The fix needs the whole file.** A SQL injection on one line may need a change to how a query helper is called, an import, or a parameter list elsewhere in the file.
- **The developer is not the author.** Findings land on whoever owns the repository now, not whoever wrote the code.
- **Guidance is generic.** "Use parameterised queries" is correct and still leaves the actual change to be worked out for this codebase, in this language, with this library.
- **Many findings, one file.** A legacy file can carry several findings at once, and fixing them one by one produces conflicting changes.

## What AI can reasonably do

A language model given the right context can draft a plausible fix for many common SAST rule types: injection, unsafe use of cryptographic functions, hard-coded credentials, insecure deserialisation and similar. The quality depends heavily on what it is given:

- **The full file**, not a snippet, so it can see imports, helper functions and code style.
- **All the findings in that file at once**, so the changes are consistent.
- **The rule's own guidance**: what the issue is, the recommended fix, and a compliant example in the same language.

What AI should not do is decide on its own that a change is correct and ship it. A model can produce code that compiles, looks right and changes behaviour in a way only a test or a reviewer will catch.

## Design principles for safe AI code fixes

### The output is a proposal, not a merge

The fix should arrive as a branch or a diff that goes through your normal review and CI process. Nothing should merge or deploy itself.

### Fix only what was flagged

The instruction to the model should be explicit: change the listed issues and nothing else, keep variable names, indentation and style, and do not add imports unless the fix requires them. Small, focused diffs are reviewable. Large rewrites are not.

### Ground the model in rule metadata

Pass the rule's recommendation and a compliant example in the target language. This narrows the model towards the known-good pattern instead of improvising.

### Respect suppressions

Findings already marked as false positives should be skipped, so the tool does not keep "fixing" code that was reviewed and accepted.

### Handle credentials carefully

A tool that writes to your repository needs a credential with write access. It should be passed per request, never stored or logged, and scoped to the repository being fixed.

### Fall back gracefully

When the model is unavailable or returns nothing useful, the developer should still get the rule's guidance and compliant example, rather than nothing.

## A review checklist for AI-generated fixes

Before merging any AI-drafted fix, check:

- The diff touches only the lines needed to address the listed findings.
- The fix uses the safe pattern the rule describes, such as parameterised queries rather than escaping input by hand.
- No new dependencies or imports were added without a reason.
- Error handling and return values are unchanged unless the fix requires it.
- Existing tests pass, and there is a test that covers the fixed path.
- A re-scan of the branch no longer reports the original findings.
- A re-scan does not report new findings introduced by the change.
- The change has a human reviewer who understands the code, not only the security rule.

## Rolling it out

- Start with one or two repositories and the rule types that produce the most findings.
- Track how many AI-drafted fixes are merged as-is, merged after edits, or rejected. That ratio tells you where the tool helps.
- Keep severity filters in mind: running AI fixes on critical and high findings first keeps review effort where it matters.

## How Onam approaches it

[Onam's code-fix engine](/platform/remediation) works on the findings produced by its static analysis scanner. For a completed scan, it reads the findings, skipping any already marked as false positives, and can be limited to chosen severities. It looks up each rule's metadata (title, description, recommendation and a compliant example matched to the language where one exists) and makes a shallow clone of the source repository.

Findings are grouped by file. For each file, the engine sends the full file content and every finding in it, with the rule guidance, to a large language model, with instructions to fix only the listed issues and preserve everything else, including style and indentation. The corrected files are committed to a separate fix branch named after the scan and pushed to your repository for review. The engine does not merge or deploy anything; your team reviews the diff, runs tests and merges through your normal process.

The Git token needed to push the branch is passed per request in a header, and is not stored or logged. Each finding's outcome is recorded with a status, so you can see which were patched on the branch and which were not. If AI generation is not available, findings still carry the rule's explanation and compliant example as guidance.

[Request a demo](/request-demo) to see a fix branch generated from one of your scans.
`,
  },
  {
    slug: "cloud-access-review-checklist",
    title: "Cloud access reviews: a checklist that ends in decisions, not spreadsheets",
    category: "Identity",
    excerpt:
      "Most cloud access reviews are a spreadsheet nobody answers. A practical checklist for reviewing cloud entitlements, including machine identities.",
    author: "anup-yadav",
    date: "October 5, 2026",
    readTime: "6 min",
    body: `
Once a quarter, someone exports a list of users and their roles, splits it by team, and emails each manager a spreadsheet with a column headed "Still needed? Y/N". Most rows come back "Y". Some do not come back at all. The spreadsheet is filed as audit evidence, and the access stays exactly as it was.

That is the typical cloud access review. It satisfies an auditor's checkbox and changes very little. This post covers why, and a checklist for a review that actually removes access that should not exist.

## Why cloud access reviews are harder than they look

Access reviews were designed for applications with a handful of roles and a list of human users. Cloud accounts break that model in several ways:

- **Most identities are not people.** Service accounts, function execution roles, instance profiles, pod identities and managed identities often outnumber human users, and none of them has a manager to ask.
- **Attached is not effective.** What an identity can actually do depends on its policies, group memberships, permission boundaries, organisation-level guardrails and the roles it can assume. A reviewer looking at the attached policy names sees only part of it.
- **Access crosses accounts.** A role in one account may be assumable from another, or by an external party. That access does not appear in the target account's user list at all.
- **Reviewers lack evidence.** Asking "is this still needed?" without showing whether the access has been used invites a reflexive yes.
- **Nothing tracks the outcome.** A "no" in a spreadsheet does not remove anything. Someone has to turn it into a change, and that step is often lost.

## What a good review needs to answer

For each identity in scope, the reviewer should be able to see:

1. Who or what is this identity, and who owns it?
2. What can it effectively do, after all policies and role chains are resolved?
3. What has it actually used recently?
4. Can it reach admin-level permissions, directly or through a chain of roles?
5. Can anyone outside this account or organisation use it?
6. Has it been active at all?

With those answers on the page, most decisions become obvious.

## A checklist for cloud access reviews

### Before the review: set scope and ownership

- Include every cloud account and subscription, not only production.
- Include non-human identities explicitly. They need an owning team, not a manager.
- Assign an owner to every identity. Identities with no identifiable owner are a finding in their own right.
- Define the usage window you will use as evidence, and confirm the activity logs that cover it are enabled.

### Prioritise what gets reviewed first

You cannot review everything with the same care. Put these at the top:

- **Identities that can reach admin without holding an admin role**, often called shadow admins, usually through a chain of role assumptions or a permission such as the ability to pass a role to a service.
- **External and cross-account access** to privileged roles in production.
- **Zombie identities**: users, roles and keys with no recent activity at all.
- **Privileged identities without MFA.**
- **Identities with a large gap** between what they are granted and what they use.

### During the review: give reviewers evidence

- Show effective permissions, not policy names.
- Show recent usage next to granted permissions, so the gap is visible.
- Show why the identity was flagged, if it was.
- Offer concrete outcomes rather than yes or no: keep, reduce to a suggested policy, remove, or defer with a reason.

### Record decisions as states, not answers

Each identity should end the review in a clear state, for example:

- **Reviewed**: access confirmed as appropriate.
- **Needs remediation**: access should change, with a ticket or change attached.
- **Deferred**: a decision is postponed, with a reason and a date.
- **Pending**: not yet reviewed, and visible as such.

States make the review measurable. You can see what was decided, what is outstanding and what changed since last quarter.

### After the review: close the loop

- Turn every "needs remediation" decision into a change in IAM, ideally a reduced policy based on observed usage rather than a manual edit.
- Remove zombie identities and stale keys, after confirming nothing depends on them.
- Re-check after the change, so the review evidence reflects what is actually in place.
- Keep the review record, with decisions and reasons, as audit evidence.

### Between reviews: keep it continuous

- Alert on new privileged grants and new cross-account trust to production.
- Re-flag identities that become inactive.
- Shorten the cycle for the highest-risk identities rather than reviewing everything quarterly.

## Common mistakes

- **Reviewing humans only.** Machine identities often hold the broadest standing access.
- **Approving by default.** Without usage evidence, reviewers say yes.
- **Ignoring database grants.** An identity with no cloud IAM path to production data can still hold a standing grant inside the database.
- **Treating the review as the outcome.** The outcome is reduced access. The review is how you get there.

## How Onam approaches it

[Onam's CIEM engine](/platform/ciem) resolves effective permissions for users, roles and service accounts from the posture inventory, walking policies, group memberships, conditions, explicit denies and cross-account trust. On AWS, CloudTrail activity over the last 30 days is joined against granted permissions, which produces the used and unused actions per identity, a high-risk unused list and a 0–100 risk score; a suggested right-sized policy is in development, so today the replacement policy is built from the used actions. Machine identities such as Lambda execution roles, instance profiles, CI/CD roles over OIDC and EKS service accounts are classified and analysed alongside users. Unused-permission analysis, shadow-admin detection, the risk score and automatic access reviews run on AWS identities today.

For review, Onam lists shadow admins, zombie identities, stale keys, external principals that can assume privileged roles, and MFA coverage for privileged identities. Escalation paths are searched on the identity graph and cross-checked against Onam's cloud detection and response, so a path that has actually been used is separated from one that is only reachable. Database CIEM extends this to grants inside managed databases.

Access reviews in Onam are an attestation and remediation workflow: every identity carries a state (pending, needs remediation, reviewed or deferred), and the finding that triggered the review stays attached, so the reviewer can see why it was flagged.

[Request a demo](/request-demo) to run a review against your own accounts. For the background on CIEM itself, see [CIEM vs IAM security](/resources/blog/ciem-vs-iam-security).
`,
  },
  {
    slug: "wiz-alternatives",
    title: "Wiz alternatives in 2026: 8 cloud security platforms compared",
    category: "Buyer's Guide",
    excerpt:
      "Wiz alternatives in 2026 compared: Orca, Cortex Cloud, Defender for Cloud, CrowdStrike, Tenable, Sysdig and more. Who each fits, how it deploys, pricing.",
    author: "anup-yadav",
    date: "September 15, 2026",
    readTime: "12 min",
    body: `
*Updated 7 October 2026. Onam Security wrote this list, and Onam is on it.* Read everything below with that in mind. We have tried to make it useful anyway: every vendor is described in its own published words, with the page we read and the date we read it, and nobody is scored. Where we add a view of our own, it is labelled as ours.

## The short answer

The most common Wiz alternatives in 2026 are **Orca Security**, **Palo Alto Networks Cortex Cloud** (formerly sold as Prisma Cloud), **Microsoft Defender for Cloud**, **CrowdStrike Falcon Cloud Security**, **Tenable Cloud Security**, **SentinelOne Singularity Cloud Security**, **Sysdig Secure** and **Fortinet's Lacework FortiCNAPP**. Which one fits depends less on feature lists than on four things you already know: which security vendor you are standardised on, which cloud you run most, whether you need runtime blocking, and what unit you want risk ranked in.

## Wiz alternatives at a glance

Each cell in the deployment and ranking columns is what the vendor's own page says, on the date shown further down. "Best fit" is our view. Pricing says only what is public.

| Platform | Best fit, in our view | Deployment, as the vendor describes it | Ranking, as described | Public pricing |
| --- | --- | --- | --- | --- |
| Orca Security | Teams that want Wiz's agentless-first shape from another vendor | Agentless SideScanning; optional Orca Sensor | Dynamic scoring and attack path analysis | Ask for a quote |
| Cortex Cloud (Palo Alto) | Estates standardised on Palo Alto | Performance-optimised agent for runtime | SmartScore, exposure and production behaviour | Ask for a quote |
| Defender for Cloud | Azure-centred estates | Agentless connectors for AWS and GCP; Defender for Endpoint for servers | Secure score; attack paths in the paid Defender CSPM plan | Published; foundational CSPM is free |
| CrowdStrike Falcon Cloud Security | Teams already running the Falcon sensor | Agent and agentless | Adversary intelligence and graph context | Ask for a quote |
| Tenable Cloud Security | Tenable vulnerability management customers | Integrates with AWS, Azure, GCP; in-account scanning add-on | Toxic combinations, attack path visualisations | Ask for a quote |
| SentinelOne Singularity Cloud Security | SentinelOne endpoint customers | Not stated on the page we read; ask | "Verified, exploitable risk" | Ask for a quote |
| Sysdig Secure | Container and Kubernetes-heavy teams that want runtime depth | Agentless posture plus an agent | Runtime insights with cloud context | Ask for a quote |
| Lacework FortiCNAPP (Fortinet) | Fortinet network estates | Not stated on the page we read; ask | Attack path visualisation | Ask for a quote |
| Onam Security (us) | Multi-cloud estates including OCI, Alibaba or IBM Cloud; teams that want risk in money | Read-only cloud roles; workload scanning in your account; no sensor | FAIR-style loss estimate per finding, raised on attack paths | Published on our [pricing page](/pricing), with a free plan |

## Why teams look for a Wiz alternative

People search for Wiz alternatives for ordinary reasons. A renewal quote landed. Google completed its acquisition of Wiz in March 2026, and some buyers with a cloud-neutrality policy want to re-check their vendor mix; Google has said Wiz will keep supporting other clouds. A second or third cloud arrived. The security team wants a ranking the finance team can read. Someone decided that runtime blocking matters, or that nothing more should be installed on workloads.

None of those is a verdict on Wiz, which is on nearly every cloud security shortlist for good reason. They are questions, and the honest way to answer them is to put the same questions to every platform on the list, including Wiz and including us.

## First, be clear what you would be replacing

Wiz describes its platform as "Built for cloud and AI, Wiz AI-APP is the platform to secure your AI applications from code to runtime." On prioritisation it promises "A single list of prioritized issues of toxic combinations of cloud and AI risk that have a high probability of being exploited." On deployment: "Wiz connects in minutes via API and achieves full coverage across cloud and AI resources", and "Runtime protection from the Wiz Sensor stops threats and provides deep, real-time threat detection." Source: wiz.io/platform, re-checked 7 October 2026. Wiz does not publish list prices; its pricing page describes packages called Wiz One and Wiz Go plus à la carte options, quoted on request (wiz.io/pricing, 7 October 2026).

Two things in that description matter for a shortlist. The ranking unit is a prioritised list of combined risks, and runtime coverage comes from a sensor. Neither is a weakness. They are design choices, and the alternatives below make different ones.

## How this list was built

- Each vendor is quoted from its own public page, verbatim, with the address and the date. If the page changes, the quote is out of date, not wrong, and we will fix it when told.
- Nothing here says what any product cannot do. We did not test them. "Trade-off to check" means a design choice stated on the vendor's own page that you should confirm fits you, not a gap.
- No ranking. Alternatives are listed alphabetically, with our own entry last.
- Corrections go to hello@onamsecurity.com and are applied, not argued with.

## Eight alternatives to Wiz

### 1. CrowdStrike Falcon Cloud Security

In its own words, Falcon Cloud Security "unifies agentless visibility with the CrowdStrike Falcon sensor, combining real-time detection, AI-driven insights, and automated response in a single platform." On prioritisation, it "enriches cloud risk detections with adversary intelligence and graph-based context, enabling you to prioritize exploitable exposures and prevent breaches." On deployment it describes "a proven agent and agentless solution." Source: crowdstrike.com/platform/cloud-security, accessed 15 September 2026.

- **Best for, in our view:** organisations already running the Falcon sensor on endpoints, where cloud runtime protection extends an agent the operations team knows.
- **Trade-off to check:** which protections need the sensor deployed, and what a workload without it receives.
- **Ask them:** how a posture finding is ranked when no adversary intelligence applies to it.

### 2. Cortex Cloud (Palo Alto Networks)

If your shortlist says Prisma Cloud, check which product name is on the quote. The Cortex Cloud page describes it as "a Cloud-Native Application Protection Platform (CNAPP) designed to secure cloud-native applications across multi-cloud environments." On prioritisation: "SmartScore prioritizes them by real-world exposure and production behavior, replacing volume-driven alerts with decisions grounded in actual risk." On deployment: "Our performance-optimized agent captures deep behavioral telemetry to understand attacker intent and contain threats." Source: paloaltonetworks.com/cortex/cloud, accessed 15 September 2026.

- **Best for, in our view:** estates standardised on Palo Alto, where one commercial relationship covers network, endpoint and cloud.
- **Trade-off to check:** which workloads the agent must reach, and who owns that rollout.
- **Ask them:** what a workload without the agent receives, and how existing Prisma Cloud contracts map to Cortex Cloud.

### 3. Lacework FortiCNAPP (Fortinet)

Fortinet's page says "FortiCNAPP provides unmatched visibility and context to simplify securing everything from code to cloud", and on attack paths: "Quickly visualize complex relationships between entities, risks, and threats to gain deeper insight into potential attack paths." The page names AWS, Azure, Google Cloud and private clouds. Source: fortinet.com/products/forticnapp, accessed 15 September 2026.

- **Best for, in our view:** Fortinet estates that want cloud posture from the vendor already in the network.
- **Trade-off to check:** the deployment model is not stated on that page, so confirm agent or agentless per workload type.
- **Ask them:** what unit the ranking is denominated in.

### 4. Microsoft Defender for Cloud

Microsoft describes Defender for Cloud as "a Cloud Native Application Protection Platform (CNAPP), which is a unified solution that combines multiple cloud security tools to protect applications across their entire lifecycle." Posture is summarised by Secure score, which will "Summarize your security posture based on the security recommendations." For other clouds: "Connect to your multicloud environments by using agentless methods for CSPM insight and CWPP protection", with connectors for AWS and GCP. Server protection comes "through Microsoft Defender for Endpoint." Source: learn.microsoft.com, Defender for Cloud overview, accessed 14 September 2026.

- **Best for, in our view:** Azure-centred estates, where it is frequently already licensed and native integration depth is hard for any third party to match.
- **Trade-off to check:** foundational CSPM is free, while attack path analysis and the cloud security graph sit in the paid Defender CSPM plan, which Microsoft prices publicly per billable resource (azure.microsoft.com, Defender for Cloud pricing, 7 October 2026).
- **Ask them:** how AWS and GCP resources are treated relative to Azure ones.

### 5. Orca Security

Orca's page says "Orca Security is the complete Cloud Security Platform that detects, prioritizes, and remediates security risks and compliance issues across your cloud estate." Prioritisation is "Dynamic scoring & attack path analysis." Deployment is "Agentless scanning across every workload" through SideScanning, with "Runtime observability & protection" from the Orca Sensor. Source: orca.security/platform, re-checked 7 October 2026.

- **Best for, in our view:** the closest architectural neighbour to Wiz on this list, agentless first with an optional runtime sensor, for teams that want that shape from a different vendor.
- **Trade-off to check:** what the sensor adds over SideScanning, and on which workloads you would need it.
- **Ask them:** how a finding on one cloud is ranked against a finding on another. For a direct Wiz vs Orca evaluation, use our [POC question list](/resources/blog/wiz-vs-orca-poc-questions).

### 6. SentinelOne Singularity Cloud Security

SentinelOne's page says Singularity Cloud Security will "Unify posture, runtime, and data protection into a single platform", and on prioritisation: "Verified, exploitable risk replaces theoretical findings. Fix what actually matters, early, before it reaches production." Source: sentinelone.com/platform/cloud-security, accessed 7 October 2026.

- **Best for, in our view:** organisations already running SentinelOne on endpoints.
- **Trade-off to check:** the page we read does not state the deployment model, so ask which parts need an agent.
- **Ask them:** how "verified" is established for a finding, and whether you can see that evidence.

### 7. Sysdig Secure

Sysdig calls itself "The real-time cloud defense platform for teams who will not compromise on security." On prioritisation: "Sysdig prioritizes risk by combining runtime insights with cloud context to focus your team on what's truly exploitable." On deployment: "Our agentless approach delivers comprehensive visibility into your cloud security posture, complemented by a scalable, performant agent." Source: sysdig.com/platform/secure, accessed 7 October 2026.

- **Best for, in our view:** container and Kubernetes-heavy teams that want runtime insight to drive prioritisation.
- **Trade-off to check:** which prioritisation signals depend on the agent being deployed.
- **Ask them:** what the ranking looks like for accounts where the agent is not running.

### 8. Tenable Cloud Security

Tenable positions the product to "Prevent cloud breaches and reduce cloud risk by closing gaps that misconfigurations, risky entitlements, and vulnerabilities create across multi-cloud and hybrid environments." On prioritisation: "Identify toxic combinations of risk first, with clear attack path visualizations and remediation workflows most likely to result in material damage." It "integrates with all major cloud providers (AWS, Azure, GCP)", and in-account scanning is available as an add-on where "the data never leaves the environment." Source: tenable.com/products/tenable-cloud-security, accessed 15 September 2026.

- **Best for, in our view:** organisations already using Tenable for vulnerability management who want cloud posture in the same exposure view.
- **Trade-off to check:** which scanning mode is in the base product and which is the add-on.
- **Ask them:** how cloud findings rank against on-premises vulnerabilities in one queue.

### And Onam Security (that is us)

We are the newest company on this list, so here are the facts rather than the adjectives. Posture scanning connects through read-only cloud roles; workload scanning runs inside your account, and there is no Onam sensor on your hosts. Posture rules cover seven clouds, AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud and Kubernetes, with 11,433 posture rule definitions across 549 cloud services as the all-cloud totals, and we publish the per-cloud breakdown. Engines write into one security graph, so an attack path can start in one cloud and end in another. Each finding gets a FAIR-style loss estimate — FAIR being The Open Group's risk analysis standard — raised for findings on attack paths. Compliance is recomputed on every scan against 78 frameworks, and SaaS posture covers 8 platforms. These figures come from our published fact set.

- **Best for, in our view:** estates that run OCI, Alibaba Cloud or IBM Cloud alongside AWS, Azure or GCP, and teams that need to rank risk in money for a board.
- **The honest gap:** we have no public reference customers yet, and no live runtime enforcement. Without a sensor, read-only scanning cannot see inside a running process. If inline blocking is what you are buying, buy it from someone above who sells it.
- **Ask us:** the same questions as everyone else. Our answers are on the record on the [Onam vs Wiz](/compare/onam-vs-wiz) page.

## How to choose a Wiz alternative

Start from your situation, not the feature grid:

- **You are Azure-first and already pay for Microsoft security.** Price Defender CSPM before anything else; it may already be part of what you own.
- **You run CrowdStrike, SentinelOne or Palo Alto on endpoints and network.** Their cloud products extend an agent and a console your team already operates. Test the cloud posture side as hard as the runtime side.
- **You want Wiz's architecture from a different vendor.** Put Orca against Wiz in the same accounts, in the same two weeks.
- **Containers and Kubernetes are most of your estate and runtime matters most.** Shortlist the runtime-first platforms, such as Sysdig.
- **You run more than the big three clouds, or the board wants risk in money.** That is the case we built Onam for; test us against the incumbent.

Then score every finalist on the same seven questions:

| Question | Why it separates platforms |
| --- | --- |
| How many clouds get first-class treatment? | Every vendor says multi-cloud. Ask for the per-cloud rule breakdown, not the headline. |
| Is the analysis cross-cloud, or per-cloud silos side by side? | A path that crosses a cloud boundary is invisible to anything that analyses each cloud separately. |
| What does onboarding grant, and what needs an agent? | Deployment friction predicts coverage. Whatever needs a rollout will not reach the whole estate. |
| What unit is the ranking denominated in? | A score ranks findings against each other. A money figure ranks them against everything else you fund. |
| Does it connect findings across engines? | The chain that reaches data is usually four ordinary findings in a row. |
| Is compliance evidence continuous or point-in-time? | Point-in-time evidence means you are audit-ready one day a quarter. |
| Does coverage span code to runtime? | A console fix that the Terraform re-creates on the next deploy is not a fix. |

## Run the shortlist as a two-week POC

Pick two vendors plus the incumbent. Give each read-only access to the same non-production accounts that you know have real problems. Compare what each ranks first, what unit that ranking is expressed in, and how many of the top findings are the same problem seen from different angles. Our [CNAPP POC question list](/resources/blog/wiz-vs-orca-poc-questions) has the full set of questions, grouped by week.

If you want to include us, [request a scan](/request-demo) and we will run it against one account. If the attack paths we surface are noise, tell us. That is more useful to us than a signature.

## Frequently asked questions

### What are the best Wiz alternatives in 2026?

The platforms most often compared with Wiz are Orca Security, Palo Alto Networks Cortex Cloud, Microsoft Defender for Cloud, CrowdStrike Falcon Cloud Security, Tenable Cloud Security, SentinelOne Singularity Cloud Security, Sysdig Secure and Lacework FortiCNAPP. "Best" depends on your clouds, your existing security vendor and whether you need runtime blocking; run the same POC against two or three of them.

### Who are Wiz's main competitors?

In cloud security posture and CNAPP, Wiz most often competes with Orca Security, Palo Alto Networks, Microsoft, CrowdStrike, Tenable, SentinelOne, Sysdig, Fortinet and Check Point, plus newer platforms such as Onam.

### What is the difference between Wiz and Orca?

On their own pages, both describe agentless scanning with an optional runtime sensor (the Wiz Sensor and the Orca Sensor) and attack-path-based prioritisation. The differences that matter show up in your own accounts, so test both side by side; see [Wiz vs Orca: what to ask in a POC](/resources/blog/wiz-vs-orca-poc-questions).

### Is there a free alternative to Wiz?

Microsoft's foundational CSPM tier in Defender for Cloud is free, open-source scanners such as Prowler cover posture checks for the main clouds, and Onam has a free plan for one cloud account. None of these is a like-for-like replacement for a full CNAPP, so compare what each covers.

### How much does Wiz cost?

Wiz does not publish list prices. Its pricing page describes the Wiz One and Wiz Go packages plus à la carte options, priced by quote. Ask every vendor the same question: what unit the price grows with, and what is an add-on.

### Is Wiz owned by Google?

Yes. Google completed its acquisition of Wiz in March 2026. Google has said Wiz will continue to support other clouds, including AWS, Azure and Oracle Cloud.

## Corrections

Last updated 7 October 2026. Wiz, Orca, SentinelOne and Sysdig were read on 7 October 2026; the others on the dates shown. Every statement about another vendor is a quotation from that vendor's own public page. If any of it is wrong or out of date, including anything about us, email hello@onamsecurity.com and it will be corrected.

*Read next: [Best CSPM tools in 2026](/resources/blog/best-cspm-tools), [Wiz vs Orca vs Prisma Cloud: 7 questions that decide a POC](/resources/blog/onam-vs-wiz-orca-prisma-cloud), and [what a CNAPP is](/learn/cnapp).*
`,
  },
  {
    slug: "best-cspm-tools",
    title: "Best CSPM tools in 2026: 9 compared, with a buyer's checklist",
    category: "Buyer's Guide",
    excerpt:
      "Best CSPM tools in 2026 compared: Wiz, Orca, Defender for Cloud, Cortex Cloud, CrowdStrike, Tenable and more. Who each fits, deployment, how to choose.",
    author: "anup-yadav",
    date: "September 15, 2026",
    readTime: "12 min",
    body: `
*Updated 7 October 2026. Onam Security wrote this list, and Onam is on it.* That is the first thing to know. The second is that every other tool below is described in its vendor's own published words, with the page and the date, and nobody is scored. A "best tools" list written by a vendor is only worth reading if it is honest about both of those things.

## The short answer

The CSPM tools most worth shortlisting in 2026 are **Wiz**, **Orca Security**, **Microsoft Defender for Cloud**, **Palo Alto Networks Cortex Cloud** (formerly Prisma Cloud), **CrowdStrike Falcon Cloud Security**, **Tenable Cloud Security**, **SentinelOne Singularity Cloud Security** and **Sysdig Secure**, with Onam as a newer option. Almost all of them are now sold as CNAPPs, platforms where posture management is one engine among several. The right one depends on your clouds, your existing security vendor, whether you need runtime blocking, and how you want risk ranked.

## What a CSPM tool is, in one paragraph

Cloud security posture management checks the configuration of your cloud estate against rules, continuously, and tells you where it is wrong: the public bucket, the role with wildcard permissions, the database with no encryption, the security group open to the world. A longer explanation is on our [What is CSPM](/learn/cspm) page, and how CSPM sits inside a wider platform is on [What is CNAPP](/learn/cnapp).

## The best CSPM tools at a glance

Deployment and ranking are what each vendor's own page says, on the date read. "Best fit" is our view. Pricing says only what is public.

| Tool | Best fit, in our view | Deployment, as described | Ranking, as described | Public pricing |
| --- | --- | --- | --- | --- |
| Cortex Cloud | Palo Alto estates | Performance-optimised agent for runtime | SmartScore, exposure and production behaviour | Ask for a quote |
| Falcon Cloud Security | Falcon endpoint customers | Agent and agentless | Adversary intelligence and graph context | Ask for a quote |
| Defender for Cloud | Azure-centred estates | Agentless connectors for AWS and GCP; Defender for Endpoint for servers | Secure score; attack paths in the paid Defender CSPM plan | Published; foundational CSPM is free |
| Orca Security | Agentless-first teams | Agentless SideScanning; optional Orca Sensor | Dynamic scoring and attack path analysis | Ask for a quote |
| Singularity Cloud Security | SentinelOne endpoint customers | Not stated on the page we read | "Verified, exploitable risk" | Ask for a quote |
| Sysdig Secure | Container and Kubernetes-heavy teams | Agentless posture plus an agent | Runtime insights with cloud context | Ask for a quote |
| Tenable Cloud Security | Tenable VM customers | Integrates with AWS, Azure, GCP; in-account scanning add-on | Toxic combinations, attack path visualisations | Ask for a quote |
| Wiz | Almost any shortlist; the category reference point | API connection; Wiz Sensor for runtime | "Prioritized issues of toxic combinations" | Packages quoted on request |
| Onam Security (us) | Estates beyond the big three clouds; risk in money | Read-only roles; workload scanning in your account; no sensor | FAIR-style loss estimate, raised on attack paths | Published on our [pricing page](/pricing), with a free plan |

## How to evaluate CSPM tools: five criteria that still separate them

Every tool on this list finds misconfigurations. That stopped being a differentiator years ago. Five things still separate them.

1. **Depth per cloud.** The headline rule count hides whether your third cloud gets the same engine as your first. Ask for the per-cloud breakdown.
2. **One graph or several silos.** A path that starts in one cloud and ends in another is invisible to a tool that analyses each cloud on its own. See [cloud attack paths](/learn/cloud-attack-path).
3. **Deployment.** What onboarding grants, and which features need an agent or sensor. Anything that needs a rollout reaches part of the estate.
4. **The ranking unit.** Severity labels rank findings against each other. Business impact, ideally in money, ranks them against everything else the company could fund. See [cloud risk quantification](/learn/cloud-risk-quantification).
5. **Continuous compliance evidence.** Evidence generated when someone clicks export is evidence for one day a quarter.

## How this list was built

Vendors' own public pages, quoted verbatim, with the address and the date read. No claims about what any product cannot do, because we did not test them. "Check" lines are design choices stated on the vendor's own page that you should confirm fit you. Alphabetical order, with our own entry last. Corrections to hello@onamsecurity.com.

## The CSPM tools worth shortlisting in 2026

### 1. Cortex Cloud (Palo Alto Networks)

Palo Alto describes Cortex Cloud as "a Cloud-Native Application Protection Platform (CNAPP) designed to secure cloud-native applications across multi-cloud environments." On prioritisation: "SmartScore prioritizes them by real-world exposure and production behavior, replacing volume-driven alerts with decisions grounded in actual risk." On deployment: "Our performance-optimized agent captures deep behavioral telemetry to understand attacker intent and contain threats." Source: paloaltonetworks.com/cortex/cloud, accessed 15 September 2026.

- **Best for:** estates already on Palo Alto for network and endpoint.
- **Check:** which workloads the agent must reach. If you were quoted Prisma Cloud, ask which product name applies.

### 2. CrowdStrike Falcon Cloud Security

CrowdStrike says Falcon Cloud Security "unifies agentless visibility with the CrowdStrike Falcon sensor, combining real-time detection, AI-driven insights, and automated response in a single platform", and that it "enriches cloud risk detections with adversary intelligence and graph-based context, enabling you to prioritize exploitable exposures and prevent breaches." Deployment is "a proven agent and agentless solution." Source: crowdstrike.com/platform/cloud-security, accessed 15 September 2026.

- **Best for:** organisations already running the Falcon sensor on endpoints.
- **Check:** which protections need the sensor, and what posture-only accounts receive.

### 3. Microsoft Defender for Cloud

Microsoft's documentation describes it as "a Cloud Native Application Protection Platform (CNAPP), which is a unified solution that combines multiple cloud security tools to protect applications across their entire lifecycle", with cloud security posture management as one of three core components. Secure score will "Summarize your security posture based on the security recommendations." For AWS and GCP: "Connect to your multicloud environments by using agentless methods for CSPM insight and CWPP protection." Source: learn.microsoft.com, Defender for Cloud overview, accessed 14 September 2026.

- **Best for:** Azure-centred estates, where it is often already licensed.
- **Check:** foundational CSPM is free; attack path analysis and the cloud security graph are in the paid Defender CSPM plan, which Microsoft prices publicly per billable resource (azure.microsoft.com, Defender for Cloud pricing, 7 October 2026).

### 4. Orca Security

"Orca Security is the complete Cloud Security Platform that detects, prioritizes, and remediates security risks and compliance issues across your cloud estate." Prioritisation: "Dynamic scoring & attack path analysis." Deployment: "Agentless scanning across every workload" through SideScanning, with an optional Orca Sensor for "Runtime observability & protection." Source: orca.security/platform, re-checked 7 October 2026.

- **Best for:** teams that want agentless-first posture with a runtime sensor available when they need it.
- **Check:** what the sensor adds over SideScanning for your workloads.

### 5. SentinelOne Singularity Cloud Security

SentinelOne's page says the platform will "Unify posture, runtime, and data protection into a single platform", and "Verified, exploitable risk replaces theoretical findings. Fix what actually matters, early, before it reaches production." Source: sentinelone.com/platform/cloud-security, accessed 7 October 2026.

- **Best for:** organisations already on SentinelOne for endpoints.
- **Check:** the deployment model is not stated on that page; ask which parts need an agent.

### 6. Sysdig Secure

"The real-time cloud defense platform for teams who will not compromise on security." On prioritisation: "Sysdig prioritizes risk by combining runtime insights with cloud context to focus your team on what's truly exploitable." On deployment: "Our agentless approach delivers comprehensive visibility into your cloud security posture, complemented by a scalable, performant agent." Source: sysdig.com/platform/secure, accessed 7 October 2026.

- **Best for:** container and Kubernetes-heavy teams that want runtime insight to drive prioritisation.
- **Check:** which prioritisation signals depend on the agent.

### 7. Tenable Cloud Security

Tenable's page positions the product to "Prevent cloud breaches and reduce cloud risk by closing gaps that misconfigurations, risky entitlements, and vulnerabilities create across multi-cloud and hybrid environments." Prioritisation: "Identify toxic combinations of risk first, with clear attack path visualizations and remediation workflows most likely to result in material damage." It "integrates with all major cloud providers (AWS, Azure, GCP)", and in-account scanning is available as an add-on where "the data never leaves the environment." Source: tenable.com/products/tenable-cloud-security, accessed 15 September 2026.

- **Best for:** organisations already using Tenable for vulnerability management.
- **Check:** which scanning mode is base product and which is the add-on.

### 8. Wiz

Wiz describes its platform as "Built for cloud and AI, Wiz AI-APP is the platform to secure your AI applications from code to runtime", promising "A single list of prioritized issues of toxic combinations of cloud and AI risk that have a high probability of being exploited." Deployment: "Wiz connects in minutes via API and achieves full coverage across cloud and AI resources", with "Runtime protection from the Wiz Sensor." Source: wiz.io/platform, re-checked 7 October 2026. Google completed its acquisition of Wiz in March 2026.

- **Best for:** almost any shortlist. It set the reference point for agentless, graph-based cloud security, and the category largely follows its shape. Our [Onam vs Wiz](/compare/onam-vs-wiz) page says where it is stronger than us.
- **Check:** which capabilities sit in the Wiz One and Wiz Go packages and which are à la carte (wiz.io/pricing). Looking at other options? See [Wiz alternatives in 2026](/resources/blog/wiz-alternatives).

### 9. Onam Security (that is us)

Facts, not adjectives. Posture scanning connects through read-only cloud roles; workload scanning runs inside your account, and there is no Onam sensor on your hosts. One posture engine covers seven clouds, AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud and Kubernetes, with 11,433 posture rule definitions across 549 cloud services as the all-cloud totals, of which 9,853 are CSPM posture rules. Engines write into one security graph, so a path can cross a cloud boundary. Each finding gets a FAIR-style loss estimate — FAIR being The Open Group's risk analysis standard — raised for findings on attack paths, with the inputs shown next to the figure. Compliance is recomputed on every scan against 78 frameworks. SaaS posture covers 8 platforms. Every number traces to our published fact set.

- **Best for:** estates running OCI, Alibaba Cloud or IBM Cloud alongside the big three, and teams that need risk in money for a board.
- **The honest gap:** we have no public reference customers yet, and no live runtime enforcement. Without a sensor, read-only scanning cannot see inside a running process. If inline blocking is a requirement, one of the tools above sells it and we do not.

## How to choose a CSPM tool

Match the shortlist to your situation first:

| If this is you | Start your shortlist with |
| --- | --- |
| Azure-first, already paying for Microsoft security | Defender for Cloud, then one independent platform to compare |
| Standardised on Palo Alto, CrowdStrike, SentinelOne or Tenable | That vendor's cloud product, plus one independent platform |
| You want an agentless-first platform from an independent vendor | Wiz and Orca, side by side |
| Containers and Kubernetes dominate, runtime matters most | A runtime-first platform such as Sysdig, plus one posture-first platform |
| You run OCI, Alibaba Cloud or IBM Cloud, or need risk in money | Include Onam and ask every vendor to demo those clouds |
| Small team, tight budget | Start with a free tier (Defender foundational CSPM, open-source Prowler, or Onam's free plan) before buying |

Then run a two-week proof of concept. Connect three tools to the same non-production accounts you know have real problems, and compare what each ranks first, in what unit, and how many of the top findings are the same problem viewed from different angles. Our [CNAPP POC question list](/resources/blog/wiz-vs-orca-poc-questions) gives you the questions to ask in each week.

If you want Onam in that three, [request a scan](/request-demo). If the paths we surface are noise, say so.

## Frequently asked questions

### What is the best CSPM tool in 2026?

There is no single best tool for every estate. Wiz, Orca Security, Microsoft Defender for Cloud, Cortex Cloud, CrowdStrike Falcon Cloud Security, Tenable Cloud Security, SentinelOne and Sysdig are the most commonly shortlisted. Pick by your clouds, your existing security vendor and whether you need runtime protection, then prove it in a POC on your own accounts.

### What is the difference between CSPM and CNAPP?

CSPM checks cloud configuration against rules. A CNAPP bundles CSPM with workload protection, identity (CIEM), data security, code scanning and often runtime detection on one platform. Most tools on this list are sold as CNAPPs. More on [what a CNAPP is](/learn/cnapp).

### Agentless or agent-based CSPM: which is better?

Posture management itself works through cloud provider APIs and needs no agent. Agents or sensors add runtime visibility and blocking inside running workloads. Most vendors now offer both; the question is which features you lose on workloads where the agent is not deployed.

### Which CSPM tool is best for multi-cloud?

Every vendor says multi-cloud. Ask for the per-cloud rule breakdown, a live demo on your second and third clouds, and whether attack paths can cross from one cloud to another.

### Are there free CSPM tools?

Yes. Microsoft's foundational CSPM tier in Defender for Cloud is free, Prowler is an open-source posture scanner, and Onam has a free plan for one cloud account. Free tiers usually stop short of attack paths and full compliance coverage, so compare what is included.

### How long does a CSPM deployment take?

Connecting an account through a read-only role is usually quick for any of these tools; reaching your whole estate takes as long as your change process for granting that role across every account. Measure time to a complete inventory in your own POC rather than relying on vendor claims.

## Corrections

Last updated 7 October 2026. Wiz, Orca, SentinelOne and Sysdig were read on 7 October 2026; the others on the dates shown. Every statement about another vendor is a quotation from that vendor's public page. If anything is wrong or out of date, including anything about us, email hello@onamsecurity.com and it will be corrected.

*Read next: [Wiz alternatives in 2026](/resources/blog/wiz-alternatives), the [comparison pages](/compare), and [What is CSPM](/learn/cspm).*
`,
  },
  {
    slug: "onam-vs-wiz-orca-prisma-cloud",
    title: "Wiz vs Orca vs Prisma Cloud: 7 questions that decide a POC",
    category: "Buyer's Guide",
    excerpt:
      "Wiz vs Orca vs Prisma Cloud (now Cortex Cloud) in 2026: the 7 POC questions that separate them, a copyable scorecard, and where Onam fits and falls short.",
    author: "anup-yadav",
    date: "July 20, 2026",
    readTime: "9 min",
    body: `
Most cloud security proofs of concept are run badly — not because the buyer is careless, but because every platform demos well. Point any of them at a messy AWS account and findings appear. That is table stakes, and a POC that only proves it tells you nothing about which tool to buy.

The seven questions below are the ones worth asking *during* the trial, while you still have hands on the product and a vendor engineer on the call. Each one is answerable inside a two-week POC, and each separates platforms that look identical in a demo. For the full week-by-week list of 30 questions, including setup, accuracy and cost, see [Wiz vs Orca POC: 30 questions to ask in any CNAPP trial](/resources/blog/wiz-vs-orca-poc-questions).

If you're evaluating cloud security platforms in 2026, your shortlist probably reads: Wiz, Orca Security, Palo Alto Networks' Prisma Cloud (check whether your quote says Cortex Cloud) — and maybe us. We describe nobody else's product here; for that, read each vendor's own pages, or our [Wiz alternatives](/resources/blog/wiz-alternatives) post, which quotes them with sources and dates. And if a vendor tells you their competitors are bad products, stop trusting that vendor.

So this is not that post. Instead, here are the seven questions we believe actually separate cloud security platforms — the ones that predict whether the tool still works for you two years in. We'll give you Onam's answer to each, on the record. Then run the same checklist against every vendor on your shortlist and compare answers side by side.

## The seven questions that separate platforms

### 1. How many clouds get *first-class* treatment?

Every platform says "multi-cloud." The question is which clouds get the full engine depth and which get a check-the-box connector. If you run anything on Oracle Cloud (OCI), Alibaba Cloud, or IBM Cloud — common in finance, manufacturing, and Asia-Pacific enterprises — ask each vendor to demo *those* clouds, not AWS.

**Onam's answer:** posture rules on all 7 clouds — AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud and Kubernetes — through one rule engine and one compliance mapping, and we publish the per-cloud rule counts rather than only the total. Depth is not identical everywhere: some identity analysis, such as unused-permission and shadow-admin detection, is AWS-only today, and our docs say which.

### 2. Is the analysis cross-cloud, or per-cloud silos side by side?

Real attack paths cross boundaries: an exposed GCP service account key that can assume a role into your AWS production account is invisible to any tool that analyses each cloud separately. A dashboard that *displays* seven clouds is not the same as a graph that *correlates* them.

**Onam's answer:** one graph across all clouds, fed by posture, identity, network, data and threat-detection evidence. Attack-path entry points include other clouds, and federation between clouds is modelled as an edge, so a path can cross a provider boundary.

### 3. Agentless — and what does onboarding take?

Deployment friction predicts coverage: if connecting an account takes a change-management ticket, half your estate never gets connected. Ask for the exact onboarding steps and every permission each one grants.

**Onam's answer:** no agents on your hosts. Posture scanning connects through read-only cloud roles; agentless workload scanning runs inside your account. You connect a cloud with a template run in your own account, so every permission is readable first. For AWS we store no secret — Onam assumes your role; where a cloud needs a stored credential, it is kept in AWS Secrets Manager, encrypted with AWS KMS.

### 4. How does it prioritise — severity labels or business impact?

An alert firehose with 4,000 "critical" findings is operationally identical to no prioritisation at all. Ask *how* the platform decides what's first, and whether that reasoning is explainable to your CFO.

**Onam's answer:** a FAIR-style loss estimate for each finding — a minimum, likely and maximum figure computed from exploit likelihood (EPSS), exposure, records at risk, data sensitivity, asset value and applicable regulations, and raised for findings on attack paths. The inputs are shown next to the figure, so the top of the queue is explainable in business terms, not just CVSS arithmetic.

### 5. Does it connect findings across engines?

A public subnet is medium. An over-privileged identity is medium. A workload with a critical CVE is high. The same three on one attack path is a breach waiting to happen. Connecting them is the whole point of a unified platform — ask each vendor to show it live.

**Onam's answer:** attack paths are built from evidence across posture, identity, network, data and threat detection on one graph; only edges confirmed by that evidence are walked, and a high-EPSS vulnerability on a node raises the path's score.

### 6. Is compliance evidence continuous or point-in-time?

If evidence is generated when you click "export report," you are audit-ready one day per quarter. Ask whether framework mappings update as infrastructure changes.

**Onam's answer:** 78 frameworks — CIS benchmarks for each cloud, NIST 800-53, ISO 27001:2022, PCI DSS, HIPAA, SOC 2 and more — recomputed from the latest findings on every scan, with evidence per control. One finding maps to every framework it affects; auditors get PDF, CSV or Excel exports, not screenshots.

### 7. Does coverage span code to runtime?

Fixing a misconfiguration in the console while the Terraform that created it stays broken means the finding comes back on the next deploy. Ask whether the platform sees IaC, code, and runtime as one pipeline.

**Onam's answer:** Code Security scans repositories for SAST, secrets, IaC and dependency issues, and DAST tests a running application when you give it a URL. Code findings are reported on their own today rather than traced to the cloud resource they deploy, so ask every vendor to show that link live rather than take it on trust — including us.

## The checklist, in one table

| Evaluation criterion | Ask every vendor | Onam's answer |
| --- | --- | --- |
| Cloud coverage | Which clouds are first-class? Demo OCI/Alibaba/IBM. | Posture rules on all 7 clouds, counts published per cloud |
| Cross-cloud analysis | One graph or per-cloud silos? | One graph; paths can cross clouds |
| Deployment | Agents? What does onboarding grant? | No host agents; read-only posture roles, workload scanning in your account |
| Prioritisation | How is "what's first" decided? | FAIR-style loss estimate per finding, raised on attack paths |
| Cross-engine paths | Cross-engine evidence, live demo | Paths built from confirmed evidence across engines |
| Compliance | Continuous or point-in-time evidence? | 78 frameworks, recomputed every scan, PDF/CSV/Excel export |
| Code + runtime | IaC/code linked to runtime findings? | SAST · secrets · IaC · SCA · DAST; code findings reported separately today |

## Our bet, stated plainly

Onam's bet is that cloud security is increasingly decided by **posture coverage on every cloud you run**, including OCI, Alibaba Cloud and IBM Cloud, **one graph instead of separate modules**, and **prioritisation a CFO can read**. That's what we built. We are a young company with no public reference customers yet, and no runtime sensor; if either is your first filter, weigh it.

The honest way to decide is the checklist above. Run it against all four of us. We'll take our chances.

*Want Onam's answers demonstrated on your own environment instead of a slide deck? [Request a demo](/request-demo).*
`,
  },
  {
    slug: "cdr-behavioral-threat-detection",
    title: "Beyond GuardDuty: how three-level behavioral detection catches what rules miss",
    category: "CDR",
    excerpt:
      "Cloud threat detection needs three levels: rules for single suspicious events, correlation across several events, and statistical behaviour baselines.",
    author: "nishchal-gupta",
    date: "July 15, 2026",
    readTime: "10 min",
    body: `
AWS GuardDuty is a good product. It detects known malicious IP addresses, known cryptocurrency mining domains, known port scanning patterns, and a catalogue of documented attack signatures. If an attacker uses infrastructure that has appeared in threat feeds, GuardDuty will catch it.

The problem is that sophisticated attackers do not use infrastructure that appears in threat feeds. They use compromised legitimate accounts, new cloud instances with clean IP addresses, and legitimate cloud services as their command-and-control channel. They operate slowly enough to avoid rate-based anomaly rules. They escalate privileges incrementally — one permission at a time — over days or weeks.

Rule-based detection catches what you already know to look for. The question is how to catch what you do not.

## The three-level detection architecture

Onam's CDR (Cloud Detection and Response) engine reads the audit logs your clouds already produce and judges them at three levels. Each level catches a different class of attacker behaviour, and together they cover gaps a single level leaves open.

| Level | Approach | What it catches |
| --- | --- | --- |
| L1 | Detection rules over single events | Actions suspicious on their own: disabling logging, creating access keys for another user, known-bad indicators |
| L2 | Correlation scenarios across several events | Ordered steps by one actor within a time window — the shape of an attack no single event shows |
| L3 | Statistical behaviour baselines | An identity or account departing from its own recent history, even when no rule names the action |

**L1 — single-event rules.** The same idea as a cloud's built-in threat service, applied across seven clouds' audit logs — CloudTrail, Azure Activity Log, Google Cloud Audit Logs, OCI Audit, Alibaba Cloud ActionTrail, IBM Cloud Activity Tracker and Kubernetes audit logs — with one alert schema. Detections are mapped to MITRE ATT&CK techniques, so each alert says which phase of an attack it represents.

**L2 — correlation scenarios.** L2 reads the L1 findings for each actor and resource and matches them against scenarios: an ordered list of steps that must all occur within a time window. A role lookup, then an AssumeRole, then a new role created by a deployment stack is three ordinary events to L1. To L2 it is one scenario. On top of the scenarios, a sequence detector looks for four attack shapes in every supported cloud's own vocabulary: data exfiltration, identity pivot, secrets staging and compute hijack.

**L3 — behaviour baselines.** L3 keeps daily statistics per identity and per account — for example session counts, superuser counts and admin role grants — and compares today's value with the mean and spread of the recent window. A value well above that range, or activity where there was none before, raises a finding. It is statistics, not a black box: each L3 finding carries the metric, today's value, the historical mean and how far it departed.

![The CDR alert view in the Onam console (demo account)](/screenshots/screenshot-cdr.png)

## How L2 and L3 catch what L1 misses: incremental privilege escalation

The canonical example of what single-event rules cannot detect is incremental privilege escalation. Here is a pattern that shows up in published cloud intrusion write-ups.

**Day 1.** The attacker gains access to a developer's AWS credentials — through phishing, or an access key committed to a public repository. The developer's account can read from S3 buckets and invoke Lambda functions. The attacker reads the environment: lists resources, describes IAM policies, maps the account structure. All of these are legitimate API operations. No threat-intelligence indicator fires.

**Day 3.** The attacker notices that the developer's role has \`iam:ListRolePolicies\` and uses it to map roles with elevated permissions. They find a CI/CD role that can deploy CloudFormation stacks, and call \`sts:AssumeRole\` to take it on — a call the developer legitimately makes for manual deployments.

**Day 7.** Using the CI/CD role, the attacker deploys a stack that creates a new IAM role with administrator access. The deployment looks like ordinary CI/CD activity.

At no point did a single event look malicious on its own. What gives the attack away is the order and the volume: discovery calls, then a role assumption, then an administrator role created by the assumed identity. That ordered chain is what an L2 scenario or the identity-pivot sequence is written to match, and an admin role grant or a jump in an identity's session count is what an L3 baseline is written to flag.

## What a baseline needs

A baseline is only as good as its history. L3 compares each metric against a recent window of daily values and only judges a metric once enough days of history exist, so a brand-new identity or account is not flagged simply for having no past. The thresholds are set per baseline in the rule files — two or three standard deviations above the mean — rather than hidden inside a model.

## MITRE ATT&CK mapping in CDR context

CDR detections are mapped to MITRE ATT&CK techniques. That matters for two reasons.

First, it puts the alert in attack-chain context. A single unusual API call from a new IP is low severity in isolation. The same identity showing Valid Accounts (T1078.004) followed by Cloud Infrastructure Discovery (T1580) tells a story, and the ATT&CK tagging makes that visible in the timeline without manual analysis.

Second, it connects detections to posture. Every detection is joined to posture and identity context from the Onam graph, so an alert on a role assumption arrives next to what that role can reach — and a confirmed exfiltration sequence is written back to the resource's security posture, where attack-path analysis can see it.

## Multi-cloud coverage

An attacker who compromises one cloud's identity may use it to reach another — for example a secret in one provider's secrets manager that holds another provider's credentials. Onam applies the same three levels and the same four sequence shapes to every supported cloud's audit logs, in that cloud's own service vocabulary, and federation between clouds is modelled in the identity graph that attack paths walk. Each detection still belongs to the cloud whose log produced it; the graph is where the clouds meet.

## What to expect in the first weeks

The first weeks of CDR are about tuning out operational noise.

**First scans.** L1 rules start producing findings as soon as logs are read. The most common early findings are not active threats — they are configuration patterns that look like threats: instances making repeated metadata calls, functions calling APIs across regions, CI/CD pipelines creating IAM roles during provisioning.

**Tuning.** Review the L1 noise and suppress legitimate patterns with a reason and an expiry date — suppression should not be permanent for a cloud detection rule. Aim for an alert volume a person can review every day.

**Once history exists.** L3 baselines begin judging metrics once enough daily history has built up. The first L3 findings typically flag maintenance windows, pipelines that run at unusual hours and identities with legitimate but irregular usage. Each needs a decision: suppress with a reason and expiry, investigate, or escalate.

> CDR is not a "set it and forget it" product. It needs sustained analyst attention to tune and investigate. The return is coverage of attacker behaviour that single-event rules cannot see.

To see the three levels against your own audit logs, [book a demo](/request-demo).
`,
  },
  {
    slug: "aws-misconfigurations-first-scan",
    title: "5 AWS misconfigurations that commonly show up on a first scan",
    category: "CSPM",
    excerpt:
      "Five AWS misconfigurations that commonly show up on a first scan: what they are, why they persist, and how to fix them fast.",
    author: "nishchal-gupta",
    date: "July 10, 2026",
    readTime: "6 min",
    body: `
## Why the same five keep showing up

Cloud teams move fast, and defaults rarely favor the defender. Five misconfigurations come up again and again in AWS security reviews — often in accounts operated by teams that consider themselves mature. Each one is easy to introduce, easy to miss, and each one can quietly widen the blast radius of a routine credential leak into a full compromise.

## 1. S3 buckets exposed via bucket policies (not ACLs)

Everyone knows to block public ACLs. Fewer teams audit **bucket policies** that grant \`s3:GetObject\` to \`Principal: "*"\`. The AWS console labels these buckets "Public" only when the policy resource is the bucket itself — not when it's \`arn:aws:s3:::acme-corp-uploads/public/*\`.

- Enable **Block Public Access** at the account level.
- Alert on any new bucket policy statement whose principal is \`*\` or whose condition allows broad IPs.
- Treat any \`s3:*\` grant to \`arn:aws:iam::****4821:root\` from another account as a finding until proven intentional.

## 2. Over-privileged IAM roles attached to EC2

It is common to find \`AdministratorAccess\` on instance profiles that only need to read from one S3 prefix. Combined with an SSRF bug or an exposed metadata endpoint (IMDSv1), that role becomes an admin foothold.

- Enforce **IMDSv2** across the fleet.
- Replace \`*\` policies on instance profiles with least-privilege equivalents generated from IAM Access Analyzer.
- In Onam, a public-facing workload that can reach such a role shows up as a step on an attack path.

## 3. Public RDS snapshots

RDS snapshot sharing is a per-snapshot ACL — flipping it to "public" makes the entire database available to any AWS account. Teams do this to move data between environments and forget to revert.

## 4. Security groups with 0.0.0.0/0 on non-web ports

SSH (22), RDP (3389), database ports, and \`ANY\`-protocol rules facing the internet remain a classic initial-access route. Many are legacy — a rule opened for a demo years ago on an account no one owns anymore.

## 5. CloudTrail gaps

CloudTrail is either not enabled in every region, not covering S3 data events, or writing to a bucket in the same account with no MFA delete. Any attacker with account-level access rewinds the tape.

## What "fix it fast" actually looks like

Prioritization matters more than volume. Onam raises findings that sit on an attack path from an internet-exposed resource to a crown jewel such as a data store or key — so the SSH-open bastion in front of an admin IAM role comes before the internal-only bucket policy.

If you're onboarding a new AWS org, check for all five on the first scan. Finding some of them is not a failure of your team — it's the shape of AWS defaults.
`,
  },
  {
    slug: "ciem-vs-iam-security",
    title: "CIEM vs IAM Security: what's actually the difference?",
    category: "Identity",
    excerpt:
      "They sound identical. They aren't. Here's the practical split between IAM Security and Cloud Infrastructure Entitlement Management — and why you need both.",
    author: "poonam-yadav",
    date: "July 3, 2026",
    readTime: "5 min",
    body: `
## Two acronyms, one confused market

Vendors — us included — throw "IAM Security" and "CIEM" around interchangeably. In practice they answer different questions, and mature security programs run both.

## IAM Security answers: is this identity configured safely?

IAM Security is about the **static shape** of your identity plane:

- Are there IAM users with console access and no MFA?
- Are access keys older than 90 days?
- Are there inline policies with \`Action: "*"\` and \`Resource: "*"\`?
- Are service accounts stored in plaintext anywhere in your repos?

It's essentially a posture check against identity best practices. Every CSPM does some of this. Good ones do a lot of it.

## CIEM answers: what could this identity actually do?

CIEM starts where IAM Security stops. It reconciles **who has which entitlements**, **what those entitlements evaluate to** given every trust policy, permission boundary, and SCP in the chain, and — most importantly — **what was actually used** over a recent activity window.

The output isn't "this user has AdministratorAccess." Every scanner will tell you that. The output looks more like this (illustrative examples):

- \`user@example.com\` has effective \`s3:PutObject\` on 412 buckets across 3 accounts, but has only ever written to 4 of them.
- \`OnamReadOnly\` in account \`****4821\` is assumable by 17 principals in 6 other accounts through a chain of two roles.
- The CI service account \`build-runner\` has never called most of the actions it was granted when it was created.

That third bullet is where CIEM stops being interesting and starts being urgent. **Unused entitlements are usually where over-privilege hides.**

## Where the two overlap

- Detecting IAM users without MFA — IAM Security.
- Detecting an IAM user without MFA whose permissions include \`iam:PassRole\` on an admin role — that's CIEM. IAM Security tells you the user is unsafe. CIEM tells you what it will cost when the user is compromised.

## The rule we use internally

If the finding can be answered by looking at one resource in isolation, it's IAM Security. If it requires stitching together identity, trust, and behavior across accounts, it's CIEM.

You need both. IAM Security keeps the door from being obviously open. CIEM makes sure that if it opens, the blast radius is bounded.

## Frequently asked: the CIEM vs IAM difference

**What is the difference between CIEM and IAM?** IAM is the cloud provider's own identity service: it is where roles, policies and permissions are defined and granted. CIEM sits on top of it and answers a question IAM does not: what can each identity actually do once role chaining, permission boundaries, SCPs and resource policies are all resolved, and how much of that has it ever used.

**Is CIEM a replacement for IAM?** No. Every cloud account still runs on its provider's IAM. CIEM audits what IAM has granted, finds the entitlements nobody uses, and turns the gap between granted and used into least-privilege changes you can apply back in IAM.

**What is the difference between CIEM and traditional IAM tooling?** Traditional IAM tooling manages the lifecycle of identities: joiners, movers, leavers, access requests. CIEM is about effective permissions in cloud accounts, across providers, and about which of those permissions put data within reach. The two are complementary, and neither one covers the other's job.
`,
  },
  {
    slug: "ai-powered-cloud-remediation",
    title: "AI-powered cloud remediation: from finding to a reviewed fix",
    category: "Engineering",
    excerpt:
      "AI-powered cloud remediation: fix prompts that name the resource, AI code fixes on a review branch, and attack-path stories that explain why a fix matters.",
    author: "nishchal-gupta",
    date: "June 30, 2026",
    readTime: "6 min",
    body: `
Security tools got better at finding things. The bottleneck was never finding — it was fixing. A security team that surfaces hundreds of findings a week and has engineering time to fix a few dozen will always have a growing backlog, however well tuned the detection is.

AI-assisted remediation goes at that bottleneck. Not by reducing finding volume — the findings are real and need fixing — but by shortening the work between "identified" and "resolved" for each one.

## Why generic LLM suggestions fail

The obvious approach is to pipe findings into a general-purpose LLM and ask it to produce a fix. This works poorly in practice, for a specific reason: cloud security remediation is context-dependent in ways a general LLM cannot know without being told.

Consider a finding: "Lambda function \`payment-processor-prod\` has a role with \`s3:GetObject\` on \`*\`." A generic LLM will suggest: "Restrict the IAM role to only the specific S3 bucket the function needs to access." Technically correct. But which bucket? What is the ARN? Are there multiple buckets? Is the function deployed by Terraform, CloudFormation, or CDK? Is the role shared with other functions?

A useful fix starts from context the platform already holds: the resource, its account and region, the rule that failed and the rule's remediation guidance. In Onam, every finding carries an AI fix prompt built from that context — it names the resource and your cloud's tooling — which you paste into an assistant to draft the CLI command, Terraform change or console steps, then review before applying.

![AI-assisted remediation in the Onam platform](/diagrams/p-ai-security.svg)

## AI Code Fix: corrected source files on a fix branch

AI Code Fix works on the findings from a completed SAST scan of a repository — source files flagged by static analysis. It does not write tests, generate infrastructure-as-code patches or fix DAST results; those have no source file to rewrite.

| Step | What happens |
| --- | --- |
| Select | You choose the scan and which severities to fix. Findings your team marked as false positives are left out. |
| Group | Findings are grouped by file, so every issue in one file is fixed in a single pass. |
| Ground | A large language model receives the whole file, every finding in it, and the rule's guidance — the recommendation and a safe example in the same language where one exists. |
| Constrain | The model is told to fix only the listed issues and keep indentation, names and style unchanged. |
| Hand over | Corrected files are committed to a new fix branch and pushed for review. Nothing merges and nothing deploys on its own. |

For a hardcoded database password, the fix branch carries the same file with the literal replaced by an environment-variable lookup, and nothing else in the file changed. A developer reviews the diff, runs the tests and opens the pull request through the team's normal process.

## Attack-path stories: why the fix matters

The third piece addresses a different bottleneck: communication.

Attack path analysis produces a graph — nodes and edges, resource IDs, MITRE technique codes. That is precise for a security engineer and hard going for a CISO preparing a board update or a GRC team answering an auditor.

In Onam, each attack path opens as a step-by-step story: where the path starts, each hop with its MITRE ATT&CK tactic and technique, the data store or key it ends at, and a remediation step for each hop. The choke point — the resource that appears in the most paths — is marked, with the number of paths that fixing it would block. The story and the graph are drawn from the same path data, so they stay in sync.

## Data handling

AI Code Fix sends the full content of each affected file — and only files with findings — to the language model that writes the fix. The Git token it uses needs read access and permission to push a branch, and it is not stored. Every run is audit-logged: who asked, for which scan and which repository. The AI fix prompt on a posture finding is text you copy into the assistant of your choice, so you decide where it goes.

## Making AI remediation part of the workflow

The most common mistake in AI remediation rollout is treating it as a replacement for security engineering judgment. It is not. Every generated fix requires review before deployment. The model sees the file, the finding and the rule's guidance — it does not understand your team's operational constraints, your change management process, or the business reasons a particular configuration might be intentional.

> The right workflow is: AI drafts, an engineer reviews, an engineer approves, your pipeline deploys. The AI shortens the drafting. It does not replace the judgment — and it should not.

What remains is review, approval and change management — timelines bounded by process rather than by how long it takes someone to write the change.
`,
  },
  {
    slug: "attack-path-4000-to-3",
    title: "Attack paths vs. misconfigurations: why chained findings are your real cloud risk",
    category: "Attack Path",
    excerpt:
      "CSPM tools surface hundreds of misconfigurations. The ones behind breaches chain together; attack path analysis shows which chains are dangerous.",
    author: "nishchal-gupta",
    date: "June 24, 2026",
    readTime: "11 min",
    body: `
A busy cloud estate carries hundreds of open posture findings at any given time. Security teams triage by severity, work through the Critical queue, and ship patches. Three months later, the finding count is roughly the same. The board asks why the environment is still at risk.

The answer is that severity scores do not tell you which findings actually lead to breaches. They tell you how bad an individual misconfiguration is in isolation. But attackers do not exploit individual misconfigurations in isolation — they chain them together.

> The finding that causes a breach is rarely the most severe finding on your list. It is the one that connects to five other findings in a path that reaches your most critical assets.

## What an attack path actually is

An attack path is a sequence of exploitation steps that an attacker could take to move from an initial foothold to a target resource. Each step in the path exploits a specific misconfiguration or vulnerability. No single step requires extraordinary attacker capability — each one is a logical consequence of the previous.

A typical AWS attack path might look like this:

1. A Lambda function is exposed to the internet via an API Gateway without authentication. An attacker sends a crafted request that triggers an SSRF vulnerability in the application code.
2. The SSRF reaches the EC2 Instance Metadata Service (IMDSv1) and retrieves temporary credentials for the Lambda execution role.
3. The Lambda execution role has \`iam:PassRole\` permission on a deployment role used by the CI/CD pipeline.
4. Using \`iam:PassRole\`, the attacker creates a new Lambda function and assigns the deployment role, giving them pipeline-level permissions.
5. The deployment role has \`s3:GetObject\` on the S3 bucket where customer PII exports are staged for the data warehouse ETL pipeline.

At step one, the attacker is an anonymous internet user. At step five, they are reading customer PII. None of the individual misconfigurations — IMDSv1 enabled, overly permissive execution role, unscoped PassRole — are rated Critical in isolation. Together, they form a breach.

![The attack path view in the Onam console (demo account)](/screenshots/screenshot-attack-path.png)

## Chained findings: when 2 + 2 = 10

Some findings, in combination, produce a risk far larger than the sum of their individual severity scores.

A concrete example: suppose you have an EC2 instance that is internet-facing (a High finding) running a web application with a known CVE in its web framework (a Medium finding). Neither finding is marked Critical. But the CVE provides remote code execution, and the internet-facing exposure means the instance can be reached directly. The combination is Critical — a direct RCE entry point with no network controls in between.

Add one more element: suppose the instance profile grants \`ec2:DescribeInstances\` and \`ssm:SendCommand\` across the entire account. Now the attacker who exploited the CVE can run commands on every EC2 instance in the account. Three Medium/High findings. One account-wide compromise.

## Crown jewel path analysis

Not all attack paths matter equally. A path that reaches a development environment with synthetic test data is not the same as a path that reaches your production payment processor or customer data lake. Crown jewel path analysis focuses on the resources you care most about — your crown jewels — and on every path that leads to them.

In Onam, crown jewels are the resources a path can end at — data stores such as S3, RDS and DynamoDB, encryption keys, admin roles and similar high-value targets — and the data classification labels from data security posture (taken from names, tags and schema) raise the impact of paths that reach sensitive stores.

The result is a list of paths ranked by likelihood and impact, so the path to the customer data lake outranks the path to a test bucket.

## How Onam implements attack path analysis

Onam's attack path engine is built on a property graph. Every cloud resource — EC2 instances, IAM roles, S3 buckets, Lambda functions, security groups, VPCs, subnets, load balancers — is represented as a node. Relationships between resources are represented as typed edges.

Edges are derived from posture, identity, network, data and threat-detection evidence — for example an identity that can assume a role, a federation from another cloud, a security group rule that lets one workload reach another, or a key that encrypts a store. Each edge is marked confirmed, blocked or a gap, and only confirmed edges are walked.

Attack path discovery runs a breadth-first search across this graph, starting from entry points — the internet, admin identities, other identities, CI/CD, third parties and other clouds — and walking to every reachable crown jewel. Each path is scored on:

- Likelihood, which starts from the entry point and decays with every hop — shorter paths score higher.
- Exploitability — a node with a high-EPSS vulnerability raises the path's likelihood.
- Impact of the target, raised by its data classification.
- Confirmed controls — a WAF in front of the target or MFA on the entry point lowers the score.

![A privilege escalation chain modeled as a graph of identities and permissions](/diagrams/feat-ciem-privesc-chain.svg)

## MITRE ATT&CK tagging on every path step

Each step in an attack path is tagged with the MITRE ATT&CK technique it represents. This does two things: it grounds the abstract graph traversal in threat intelligence that security teams and CISOs recognize, and it gives security teams and auditors a shared, published vocabulary for what each step of a path does.

A path step that exploits IMDSv1 to steal credentials is tagged T1552.005 (Unsecured Credentials: Cloud Instance Metadata API). A step that uses \`iam:PassRole\` for privilege escalation is tagged T1548.005. A step that exfiltrates data from S3 is tagged T1530.

This tagging means that when you present an attack path finding to an engineering team, you can say: "This is a five-step privilege escalation path from an internet-exposed Lambda to your production database, using T1078 to T1548 to T1530. Here are the three changes that break the path at step two."

## What to fix first: breaking the chain vs. hardening the target

When you have an identified attack path, you have two remediation strategies. You can harden the target — make the crown jewel harder to access — or you can break the chain: remove a link in the path so the attacker cannot traverse it.

Breaking the chain is almost always the right answer. Hardening the target is valuable — encryption, access logging, strict IAM policies on the database itself — but it does not eliminate the path. If the chain is intact, a sufficiently motivated attacker will find a way to the end.

Finding the optimal break point means identifying the link that:

- Has the lowest remediation cost — a one-line IAM policy change beats a network re-architecture.
- Blocks the most paths simultaneously — a single overly permissive role may appear in a dozen paths.
- Has no compensating control already in place.

> Onam's path analysis marks the choke point — the resource that appears in the most paths — and shows how many paths fixing it would block.

## Making the case to engineering

The practical challenge in attack path remediation is not technical — it is organisational. A Medium severity finding does not motivate an engineering team to drop their sprint work. An attack path that demonstrates a five-step route from the internet to production customer data does.

Attack path visualisations exist precisely for this reason. When you can show an engineer an interactive graph where each node is a resource they recognise and each edge is a permission they can verify in the AWS console, the remediation priority becomes self-evident. You are not asking them to trust a risk score. You are showing them the exact sequence an attacker would follow.

This is why attack path analysis is not a CSPM feature — it is a communication tool. It translates the abstract language of cloud misconfiguration into the concrete language of "here is how you get breached, here is what to change."
`,
  },
  {
    slug: "fair-model-cloud-risk",
    title: "The FAIR model for cloud security: putting a dollar value on your attack surface",
    category: "Risk",
    excerpt:
      "FAIR model for cloud risk: CVSS ranks severity, FAIR asks what a breach of this attack surface would cost. How Onam applies a FAIR-style estimate.",
    author: "anup-yadav",
    date: "June 17, 2026",
    readTime: "9 min",
    body: `
Every cloud security tool produces a list of findings ranked by CVSS score. Critical findings go to the top of the queue; engineers fix them in order. This approach has an intuitive appeal — surely the highest-severity vulnerability is the most urgent.

The problem is that CVSS measures the exploitability and impact of a vulnerability in isolation. It does not know whether your environment has compensating controls. It does not know whether the vulnerable resource is a developer's test server or your payment processing API. It does not know whether you process ten thousand transactions per day or ten million. Two organisations with identical CVSS scores can face risks that differ by three orders of magnitude.

FAIR — Factor Analysis of Information Risk, published by The Open Group as the O-RT (Risk Taxonomy) and O-RA (Risk Analysis) standards — is the framework that fills this gap. It does not replace CVSS. It uses it as one input in a model that produces what your board actually cares about: the dollar value of your attack surface.

## The developer server vs. the payment processor

Consider two findings, both rated CVSS 9.1 (Critical):

- An unauthenticated RCE vulnerability in a web framework running on a developer's personal EC2 instance used for feature testing. The instance has no production data and can only be reached from the corporate VPN.
- The same vulnerability in the same web framework running on the API servers that process payment authorisations for your e-commerce platform, directly accessible from the internet.

CVSS says these are equivalent. Any security engineer knows they are not. FAIR makes that difference numerically explicit.

## FAIR fundamentals: frequency times magnitude

FAIR models risk as the product of two variables: Loss Event Frequency — how often will a loss event occur? — and Loss Magnitude — how much will it cost when it does?

Loss Event Frequency has two components:

- **Threat Event Frequency** — how often will a threat actor attempt to exploit this?
- **Vulnerability** — when a threat actor attempts exploitation, what is the probability of success?

Loss Magnitude breaks down into primary and secondary losses:

- **Primary losses** — incident response costs, forensics, data recovery, business downtime.
- **Secondary losses** — regulatory fines, legal liability, reputation damage, customer churn.

In a full FAIR analysis each variable is expressed as a range, and simulation produces a distribution of annualised loss exposure rather than a single point estimate. That makes uncertainty explicit rather than hiding it behind a precise-looking score.

## How Onam applies a FAIR-style estimate

The traditional objection to FAIR is that it needs too many manual inputs to scale. Onam computes a FAIR-style estimate for each finding from data the platform already has, and shows the inputs next to the result.

**Loss event frequency from EPSS and exposure.** FIRST's Exploit Prediction Scoring System (EPSS) gives the probability that a CVE will be exploited in the next 30 days. Onam multiplies it by an exposure factor: a publicly reachable resource counts fully, an internal one at a fraction. Findings that sit on an attack path have their exposure raised, and more so when they appear on several paths.

**Loss magnitude from records, sensitivity and asset value.** Primary loss starts from the number of records at risk and a per-record cost for your industry, then is scaled by the data's sensitivity (restricted, confidential, internal or public) and by the value of the asset — a crown jewel such as an encryption key, an admin role or a data warehouse weighs far more than an ordinary resource. You can replace the default record count, per-record cost and sensitivity weights with your own figures, so the estimate reflects your business rather than an industry average.

![Risk quantification in the Onam console (demo account)](/screenshots/screenshot-risk.png)

## Regulatory exposure

Secondary losses from regulation are often larger than the incident itself. When a finding's region and data class bring a regulation into play — GDPR, HIPAA, PCI DSS, CCPA, SOX and others — Onam does two things. It applies a regulatory weight to the loss magnitude, taking the single highest applicable weight rather than stacking them, so one finding is not double-counted. And it estimates a separate regulatory fine range from each regulation's published penalty structure, using the record count and annual revenue you configure. GDPR, for example, allows fines of up to €20 million or 4% of worldwide annual turnover, whichever is higher (Regulation (EU) 2016/679, Article 83(5)).

## From a finding list to a ranked queue

Each finding gets a minimum, likely and maximum loss estimate, a risk tier, the regulations that apply and the MITRE ATT&CK techniques involved, with the calculation inputs shown alongside. Instead of forty Critical findings and eighty High findings sorted by CVSS, you get a list ordered by estimated loss.

> This reordering often surprises security teams. The highest-loss finding is not always the highest-CVSS finding. It can be a Medium-severity misconfiguration — an RDS instance missing encryption at rest, a bucket open to another account — on a resource that holds sensitive data and never reached the top of a severity-sorted queue.

## Making the business case to engineering management

Security teams have historically struggled to translate findings into language that resonates with engineering managers and financial stakeholders. "We have a Critical finding" does not answer the question an engineering manager is actually asking: "What is the cost of not fixing this right now compared to shipping the feature we have committed to?"

FAIR makes this conversation tractable. "This finding puts an estimated range of loss on a customer data store, most of it regulatory. The fix is a small IAM policy change." That is a conversation an engineering manager can act on.

The goal of FAIR is not to produce a precise dollar figure — the uncertainty ranges in the model make that clear. It is to produce a defensible, data-grounded estimate that turns security prioritisation from an argument about severity scores into a business decision with quantified stakes.
`,
  },
  {
    slug: "kubernetes-rbac-pitfalls",
    title: "Kubernetes RBAC pitfalls that grant cluster-admin by accident",
    category: "Containers",
    excerpt:
      "Kubernetes RBAC pitfalls: a ClusterRoleBinding here, an aggregated role there, and a role that can only create pods can mount the host filesystem. Six patterns to audit.",
    author: "poonam-yadav",
    date: "June 10, 2026",
    readTime: "6 min",
    body: `
Kubernetes RBAC looks simple: roles list verbs on resources, bindings attach roles to subjects. The trouble is that several ordinary-looking grants are equivalent to cluster-admin once you follow what they allow. None of the six patterns below is exotic, and each one is easy to miss in a review that reads roles one at a time.

## 1. A ClusterRoleBinding where a RoleBinding was meant

A ClusterRole can be bound in two ways. A RoleBinding grants its rules inside one namespace; a ClusterRoleBinding grants them in every namespace and on cluster-scoped resources. Teams often reuse a ClusterRole such as \`edit\` and bind it with a ClusterRoleBinding by habit, turning "can edit the payments namespace" into "can edit every namespace".

**Audit:** list every ClusterRoleBinding and ask, for each, whether the subject genuinely needs cluster-wide scope.

## 2. Bindings to broad groups

Subjects such as \`system:authenticated\` (every authenticated identity) or \`system:serviceaccounts\` (every service account) appear in bindings created for convenience during setup. Anything granted to them is granted to every workload and user in the cluster.

**Audit:** search bindings for group subjects that start with \`system:\` and justify each one.

## 3. Wildcards

\`verbs: ["*"]\` or \`resources: ["*"]\` in a custom role grants everything that exists today and everything a future CRD adds tomorrow. A wildcard on resources in the core API group includes secrets.

**Audit:** treat any wildcard outside the built-in \`cluster-admin\` role as a finding until proven necessary.

## 4. "Can create pods" is not a small permission

A subject that can create pods in a namespace can run a pod that mounts the node's filesystem through a \`hostPath\` volume, runs privileged, or uses any service account in that namespace — and so inherits that service account's permissions. Unless Pod Security admission (or an equivalent policy) blocks privileged and host-path pods in that namespace, "create pods" is a path to the node and from there, often, to the cluster.

**Audit:** list who can create pods, deployments, jobs and other workload controllers, and confirm the namespace enforces the restricted or baseline Pod Security standard.

## 5. Verbs that grant more verbs

Some permissions exist to manage permissions. \`escalate\` lets a subject create roles with rules it does not hold; \`bind\` lets it bind roles it does not hold; \`impersonate\` lets it act as another user, group or service account. \`create\` on \`serviceaccounts/token\` mints tokens for other identities, and read access to \`secrets\` exposes whatever credentials the namespace stores.

**Audit:** search every role for \`escalate\`, \`bind\`, \`impersonate\`, \`serviceaccounts/token\` and \`secrets\`, and treat each as admin-adjacent.

## 6. Aggregated roles that grow on their own

ClusterRoles with an \`aggregationRule\` collect the rules of every ClusterRole carrying a matching label. The built-in \`admin\`, \`edit\` and \`view\` roles work this way, so installing an operator whose ClusterRoles carry those labels quietly widens what everyone bound to \`edit\` can do.

**Audit:** after installing an operator or CRD, diff the effective rules of \`admin\`, \`edit\` and \`view\` against what they held before.

## A habit that catches most of this

Review RBAC as effective access per subject, not as a list of roles. For each service account and group, ask what it can do across the whole cluster once every binding is counted. The six patterns above are the usual reasons the answer is "more than anyone intended".

[Onam's container security](/platform/container-security) checks Kubernetes clusters against posture rules, including RBAC and Pod Security settings, alongside the cloud accounts the clusters run in.
`,
  },
  {
    slug: "epss-over-cvss",
    title: "EPSS over CVSS: prioritising the CVEs attackers actually exploit",
    category: "Vulnerability",
    excerpt:
      "CVSS tells you how bad a vulnerability could be. EPSS tells you how likely it is to be exploited in the next 30 days. Guess which one predicts breaches.",
    author: "nishchal-gupta",
    date: "June 3, 2026",
    readTime: "5 min",
    body: `
Every vulnerability scanner sorts by CVSS, and every team that has worked a CVSS-sorted queue knows the problem: there are far more "critical" and "high" CVEs than anyone can patch, and the score does not say which of them attackers are actually using.

## What CVSS measures, and what it does not

CVSS, maintained by FIRST, describes the technical severity of a vulnerability: how it is reached, what it takes to exploit, and what an attacker gains. It is a good description of how bad a vulnerability could be. It is not a measure of how likely exploitation is, and FIRST's own guidance says the base score alone is not a measure of risk.

## What EPSS adds

The Exploit Prediction Scoring System, also published by FIRST, estimates the probability that a CVE will be exploited in the wild in the next 30 days. It is a number between 0 and 1, updated daily, built from observed exploitation activity and the characteristics of each CVE. Two CVEs with the same CVSS score can have very different EPSS scores, and that difference is the point.

## What KEV adds

The CISA Known Exploited Vulnerabilities catalogue lists CVEs with evidence of exploitation in the wild. EPSS is a forecast; KEV is a record. A CVE on KEV is not a prediction any more.

## How to use the three together

- **On KEV:** fix first, regardless of CVSS. Exploitation is already happening.
- **High EPSS:** next. The forecast says attackers are likely to use it soon.
- **High CVSS, low EPSS, not on KEV:** schedule it, but it should not displace the two groups above.
- **Context last, but always:** a CVE on an internet-facing workload with a path to sensitive data matters more than the same CVE on an isolated test box. Exploitability and exposure together decide the order.

## The caveat

EPSS is a probability across the whole internet, not a statement about your environment. A low score does not make a vulnerability safe to ignore when it sits on your most exposed system, and a high score on an unreachable internal host is less urgent than it looks. Use it to order work, not to close tickets.

## How Onam uses it

Onam carries EPSS and KEV on vulnerability findings alongside CVSS. Dependency findings from Code Security get a 0–10 risk score that weighs EPSS and KEV, attack paths through a node with a high-EPSS vulnerability score as more likely, and the FAIR-style loss estimate on each finding uses EPSS as its starting point for how often a loss event is expected. See [vulnerability management](/platform/vulnerability) for the details.
`,
  },
  {
    slug: "why-cloud-iam-permissions-are-never-used",
    title: "Why cloud IAM permissions go unused — and why that matters",
    category: "Identity",
    excerpt:
      "Your IAM policies are accumulating unused permissions faster than your team can audit them. Here's what the data shows and how to close the gap.",
    author: "poonam-yadav",
    date: "May 28, 2026",
    readTime: "8 min",
    body: `
Every cloud security team has the same conversation at some point: "We have too many IAM policies to audit manually." What they rarely say out loud is that the vast majority of the permissions in those policies have never been used once.

We are not going to put a percentage on it: a figure without a published sample behind it is marketing, not data. What is consistent is the mechanism. Permissions are granted to make something work and almost never removed when the thing stops needing them. It is not a failure of individual teams — it is the natural consequence of how cloud IAM actually works in practice.

![Illustrative IAM Security view — stylised, with demo data](/screenshots/screenshot-iam.png)

## How permissions accumulate

Cloud IAM permissions grow through three mechanisms, none of which are intentionally malicious.

**Copy-paste onboarding.** When a new service account or role is needed quickly, engineers copy an existing role and modify it. The source role has permissions that were useful once — a temporary migration, a debugging session, a feature that was later removed. Those permissions carry forward into every derivative role.

**Managed policy breadth.** AWS managed policies like \`AmazonS3FullAccess\` and \`AmazonEC2FullAccess\` cover entire service surfaces. A Lambda function that only reads from one S3 bucket gets full S3 permissions because attaching a managed policy is three clicks and writing a custom policy is forty minutes. The path of least resistance is also the path of least privilege violation.

**Permission creep without cleanup.** Role permissions accumulate as features get added. Nobody removes permissions when features are deprecated. A role that started with five specific permissions in 2022 has thirty by 2026, and the engineers who added the original five have moved to other teams.

## Why unused permissions matter

An unused permission is not harmless. It is a door that does not need to exist. From an attacker's perspective, the difference between a compromised Lambda execution role that can only read from one S3 bucket and one that has full S3 access is the difference between a minor incident and a data breach.

Consider the MITRE ATT&CK technique T1078.004 (Valid Cloud Accounts). When an attacker compromises a service account — through a misconfigured endpoint, a leaked credential in source code, or a supply chain attack — they inherit exactly the permissions that account holds. If that account has permissions it never uses, the attacker has capabilities the account's legitimate owners never intended to grant.

The SolarWinds attack demonstrated this at scale: compromised service accounts with broad cloud permissions allowed lateral movement that would have been impossible with properly scoped access. Every permission that exists but is not needed is a pivot point that should not exist.

## How CIEM measures the gap

CIEM (Cloud Infrastructure Entitlement Management) addresses this by computing the least-privilege gap — the difference between what an identity is permitted to do and what it actually does. Here is how Onam does it today.

**1. Effective permission resolution.** Attached policies alone do not tell you what a principal can actually do. Group membership adds permissions; explicit denies elsewhere remove them; conditions decide whether a grant applies at all; Service Control Policies (SCPs) at the organization level can block what an identity policy allows. Onam copies group policies onto members, classifies every condition by whether an attacker could satisfy it, nets out explicit denies and checks SCP deny statements. Permission boundaries and resource-based policies add further layers that Onam does not yet fold into the result — [the docs](/docs/ciem/effective-permissions) list exactly what is and is not modelled.

![How Onam resolves effective permissions on AWS — statements, groups, conditions, denies and SCPs](/diagrams/ciem-effective-access.svg)

**2. Usage analysis from activity logs.** CloudTrail records the API calls made in your AWS account. Onam reads the CloudTrail events its threat detection collects and builds a map of which actions each identity called. A granted action that has not appeared in the activity window is counted as unused, and the high-risk ones — \`iam:PassRole\`, \`iam:CreatePolicyVersion\`, \`s3:PutBucketPolicy\`, \`kms:ScheduleKeyDeletion\` and similar — are listed separately. Onam does this for AWS today.

**3. A concrete change, not an abstract one.** The unused list — especially the high-risk unused actions — tells engineers exactly what to remove, and the used list is the starting point for a replacement policy. That is a change someone can review, rather than a vague "reduce permissions" ticket.

## Where the gap is usually widest

Some identity types accumulate unused permissions faster than others:

- **Service accounts and workload roles** (Lambda, ECS, EC2 instance profiles). Created for one feature, forgotten when the team moves on, and rarely reviewed because no human logs in as them.
- **Cross-account roles.** Set up for a partner, a migration or a tool, then left in place long after the reason has gone.
- **Human users.** Permissions follow people through team changes; few are removed when they move.
- **Federated identities.** Broad SSO roles are convenient and hard to scope per person.

## What to do about it

The goal is not to achieve zero unused permissions immediately. That would require rewriting every IAM policy in your account simultaneously, which is operationally infeasible and will break things. Instead:

**Start with the highest-risk identities.** Shadow admins — identities that can reach admin-level access without holding an admin role — are the highest priority. A service account that can assume a role that can assume another role with \`iam:*\` permissions is a three-hop privilege escalation path. CIEM surfaces these chains; fix them first.

**Enforce for new identities.** The easiest permission to remediate is one that was never granted. Add a review gate to your IAM policy creation process that requires justification for any permission a similar role has not needed. This does not fix existing debt, but it stops new debt from accumulating.

**Automate the analysis, not the removal.** Let tooling compute the gap continuously, but do not remove permissions automatically — have a human review each change for operational correctness first. What looks unused over a few weeks may be used on a quarterly or annual cycle.

> The cost of a false-positive access removal is a production incident. Measure automatically, remove carefully.

Over-provisioning is not a problem you fix in a sprint. It is a long-running hygiene practice, and the right tool makes continuous progress measurable instead of invisible.
`,
  },
  {
    slug: "mitre-attack-cloud-mapping",
    title: "MITRE ATT&CK for Cloud: mapping real attacks to your posture score",
    category: "Threat Detection",
    excerpt:
      "How MITRE ATT&CK for Cloud translates abstract threat techniques into concrete cloud misconfigurations — and how your posture score tracks each one.",
    author: "poonam-yadav",
    date: "May 20, 2026",
    readTime: "10 min",
    body: `
MITRE ATT&CK for Cloud is a framework that catalogues the tactics, techniques, and procedures (TTPs) that adversaries use to attack cloud environments. It is maintained by MITRE, built from publicly reported adversary behaviour, and updated as new cloud attack techniques are observed in the wild.

Most discussions of MITRE ATT&CK treat it as an abstract threat intelligence reference. This post is about something more practical: how individual ATT&CK techniques translate into specific cloud misconfigurations that a CSPM tool can detect and score — and what that means for how you should read your posture score.

## How ATT&CK for Cloud is structured

The ATT&CK Cloud matrix covers IaaS, SaaS, Office Suite and Identity Provider platforms. It is organised as tactics (the adversary's goal) and techniques (the method used to achieve that goal).

| Tactic | Adversary goal |
| --- | --- |
| Initial Access | Getting into the environment |
| Execution | Running code |
| Persistence | Maintaining access after the initial foothold |
| Privilege Escalation | Gaining higher-level permissions |
| Defense Evasion | Hiding activity from detection |
| Credential Access | Stealing credentials for further use |
| Discovery | Mapping the environment |
| Lateral Movement | Moving from one resource to another |
| Collection | Gathering data of interest |
| Exfiltration | Removing data from the environment |
| Impact | Disrupting availability or integrity |

## Misconfigurations as enablers

Here is the key insight: most ATT&CK techniques require a precondition — a misconfiguration, gap, or overly permissive setting that the attacker can exploit. CSPM rules are, in effect, precondition detectors. When your posture score flags a finding, it is identifying a configuration that makes a specific technique easier to execute.

![Findings tagged with ATT&CK techniques in the Onam console (demo account)](/screenshots/screenshot-findings.png)

Let us walk through specific examples.

### T1078.004 — Valid Cloud Accounts (Initial Access)

This technique covers attackers using legitimately issued cloud credentials — obtained through phishing, credential stuffing, or exposure in source code — to access cloud resources. The CSPM rules that map to T1078.004:

- IAM access keys not rotated in 90+ days — stale credentials increase the exposure window.
- MFA not enforced on IAM users with console access — reduces the attacker's cost to exploit a credential.
- Long-lived GCP service account keys or Azure service principal secrets not rotated.
- EC2 instance metadata service (IMDSv1) accessible without authentication — credential theft via SSRF.

When your posture score degrades on any of these rules, it means T1078.004 is now easier to execute against your environment.

### T1548.005 — Temporary Elevated Cloud Access (Privilege Escalation)

Attackers with limited initial access use misconfigured IAM role assumption chains to escalate privileges to administrator level. The CSPM rules that map to T1548.005:

- IAM roles with overly permissive trust policies that allow any principal in the account to assume them.
- Service accounts with \`iam:PassRole\` to roles with higher privileges.
- Lambda functions with execution roles that include \`iam:CreatePolicyVersion\`.
- Cross-account trust relationships with external accounts without external ID requirements.

### T1562.008 — Disable Cloud Logs (Defense Evasion)

Before exfiltrating data or moving laterally, sophisticated attackers disable or tamper with logging to reduce the chance of detection. The CSPM rules that map to T1562.008:

- CloudTrail not enabled in all regions — gaps that create blind spots.
- CloudTrail log file validation not enabled — logs can be tampered with undetected.
- S3 buckets holding CloudTrail logs without MFA delete protection — an attacker can delete evidence.
- GuardDuty not enabled — the primary anomaly detection layer is disabled.

### T1530 — Data from Cloud Storage (Collection)

Attackers access cloud object storage that holds sensitive data — customer PII, source code, secrets, financial records. The CSPM rules that map to T1530:

- S3 buckets with public read access — no authentication required.
- S3 buckets without server-side encryption — data accessible in plain text if the bucket policy is bypassed.
- S3 access logging disabled — collection activity leaves no trace.
- Overly permissive IAM policies that grant \`s3:GetObject\` on \`*\` resources.

## How posture score maps to technique coverage

Each Onam posture rule carries the MITRE ATT&CK tactics and techniques it relates to. So a posture score below 100 does not only mean some rules are failing — it means there is a specific set of ATT&CK techniques whose preconditions are currently satisfied in your environment.

> This framing changes how you should prioritise remediation. A rule failure that maps to T1562.008 (Disable Cloud Logs) or T1078.004 (Valid Cloud Accounts) should be treated more urgently than one mapping to a technique that requires prior compromise of a privileged identity. The first set is accessible with minimal prior access; the second requires steps the attacker has not yet taken.

## Putting it into practice

The practical application of ATT&CK for Cloud is not to implement every mitigation in the matrix simultaneously. It is to use the technique-to-misconfiguration mapping to answer: "If an attacker is already in my environment with basic credentials, which techniques can they execute today?"

Walk through the privilege escalation techniques first. Then defense evasion. Then collection and exfiltration. Fix the rules that open the door to these techniques, and your posture score becomes a leading indicator of how hard your environment is to attack — not just a compliance checkbox.
`,
  },
  {
    slug: "agentless-cloud-security-architecture",
    title: "How we check thousands of rules without agents: the architecture behind Onam",
    category: "Engineering",
    excerpt:
      "Agentless cloud security architecture: how Onam scans 7 clouds with read-only posture roles and agentless workload scanning that runs in your account.",
    author: "nishchal-gupta",
    date: "May 6, 2026",
    readTime: "10 min",
    body: `
The most common question we get from security engineers evaluating Onam is some variation of: "How can you possibly check thousands of rules across dozens of cloud services without installing anything?"

It is a reasonable question, and "agentless" means different things in different products. This post explains exactly how Onam's agentless architecture works across all seven supported clouds — AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud, and Kubernetes — and where its limits are.

## The core principle: cloud control planes are APIs

Everything in a cloud environment has a configuration state. That state is stored and served by the cloud provider's control plane — the management layer that sits above your actual workloads. AWS, Azure, GCP, and the other clouds expose this configuration state through read-only APIs.

An S3 bucket's public access settings, encryption configuration, and lifecycle policy are all returned by \`GetBucketAcl\`, \`GetBucketEncryption\`, and \`GetBucketLifecycleConfiguration\`. A security group's inbound rules are returned by \`DescribeSecurityGroups\`. An IAM user's MFA status is returned by \`GetLoginProfile\` and \`ListMFADevices\`.

Nearly every security configuration that matters can be read from these control plane APIs. That is the foundation of agentless CSPM: Onam's posture scanning connects with a read-only IAM role, service principal, or service account — no agent on your workloads.

![Onam's agentless architecture: read-only API access to each cloud control plane](/diagrams/arch-overview.svg)

## How the discovery phase works

Before we can check rules, we need to know what resources exist. The discovery phase enumerates every resource across all configured cloud accounts.

For AWS, this means calling the List/Describe APIs for each service category in each region across every account: \`DescribeInstances\` for EC2, \`ListBuckets\` for S3, \`DescribeDBInstances\` for RDS, \`ListFunctions\` for Lambda, and so on across dozens of service categories. For an account with a couple of thousand resources across five regions, this generates a few hundred API calls.

Discovery output is normalised into a unified resource schema — a standard representation that captures the resource type, region, account, ARN, and all configuration attributes relevant to security evaluation. This normalised schema is what the rule evaluation engine operates against.

![The scan pipeline: discovery, normalisation, rule evaluation, and correlation](/diagrams/arch-scan-pipeline.svg)

## How rule evaluation works

Each rule in Onam's library is a declarative check against one or more attributes in the normalised resource schema. One cloud-agnostic engine evaluates every rule against every matching resource, and each check returns PASS, FAIL or ERROR.

A rule like "S3 buckets must have server-side encryption enabled" evaluates the \`encryption.rules[0].apply_server_side_encryption_by_default.sse_algorithm\` attribute in the normalised S3 bucket schema. If the attribute is present and set to AES256 or aws:kms, the rule passes. If it is absent or set to NONE, it fails.

Rules are authored in YAML — a human-readable format that non-engineers can review. Each rule specifies:

- The resource type it applies to.
- The condition expression that determines PASS or FAIL.
- The severity (Critical, High, Medium, Low), the rationale and references, and compliance framework mappings.
- The MITRE ATT&CK tactics and techniques it relates to, and written remediation guidance.

This YAML-first approach means adding a new rule for a new cloud service does not require changes to the core evaluation engine — just a new YAML file with the right schema.

## Network topology requires cross-resource correlation

Simple single-resource checks — is this bucket encrypted? is MFA enabled for this user? — can be evaluated purely from the resource's own configuration. But effective network exposure — whether a resource is actually reachable from the internet — requires correlating multiple resources.

Determining whether an EC2 instance is internet-accessible requires knowing: is it in a public subnet? Does its subnet's route table have a route to an internet gateway? Do the NACLs on that subnet allow inbound traffic on the relevant port? Does the security group allow inbound traffic from 0.0.0.0/0? Is there a load balancer in front of it?

This is why network security analysis runs as a separate phase after discovery, with access to the full normalised resource graph. The graph allows us to traverse VPC, subnet, route table, and internet gateway relationships and compute effective exposure rather than just checking individual resource configurations.

## Where agentless has limits

Agentless works for everything that lives in the cloud control plane. It does not work for everything, and it is worth being precise about the boundaries.

**OS-level vulnerability scanning** requires enumerating installed packages and kernel versions — information that is not exposed by cloud APIs. Onam's agentless workload scanning handles this by reading snapshots of instance volumes inside your own account, which means it deploys scanning resources there with the permissions they need. For hosts where you want package-level depth from the machine itself, an optional host agent is available.

**Runtime workload behavior** — what processes are running, what network connections are active, what system calls a container is making — requires a sensor running on the host. Onam does not have one. Rule evaluation covers the configuration surface; cloud audit logs cover the control-plane activity; live runtime behaviour is a different layer.

**Data plane access patterns** — reading the actual contents of S3 objects, database rows, or file system data — is not something Onam does. Data classification is based on metadata signals: naming patterns, tags, schema metadata, and resource configuration. This is sufficient for most DSPM use cases, but it will not detect sensitive data stored in an unexpectedly named bucket.

## Why agentless matters for security teams

The operational argument for agentless is usually framed around deployment complexity: no agents to install, no software versions to manage, no compatibility issues with operating systems. That is true, but there is a more important argument.

Agents expand your attack surface. An agent running on every instance in your fleet is a piece of software with elevated privileges that needs to be patched, monitored and secured, and if it has a vulnerability, every host it runs on is exposed.

Agentless does not mean footprint-free, and it is worth being exact. Posture scanning connects through read-only cloud roles; agentless workload scanning runs inside your account. Nothing runs on your hosts, but the workload scanner's resources do live in your account, with the permissions that onboarding template grants — every one of which you can read before you run it.

For organisations in regulated environments — healthcare, financial services, government — that precision matters: the question is what a tool adds to your system boundary, and the answer should be a list you can review, not a slogan.

To see the scan pipeline against one of your own accounts, [book a demo](/request-demo).
`,
  },
];

export const BLOG_CATEGORIES = Array.from(new Set(BLOG_POSTS.map((p) => p.category)));

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
