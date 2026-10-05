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

[Onam's Data Security engine](/platform/data-security) is its DSPM implementation. It enumerates storage resources across your connected clouds through read-only posture roles, including object storage, managed databases, warehouses, and platforms such as Snowflake and Databricks.

Classification is metadata-based: Onam labels each store by likely sensitivity (PII, PHI, PCI, secrets) from names, tags, schema and configuration signals, without reading the contents. Where metadata is ambiguous, findings are marked low-confidence so a person can confirm them.

The classification is joined to the same identity graph that Onam's CIEM engine uses, so each sensitive store shows which principals can read or write it and through which paths. Network reachability is layered on top, so a store that is encrypted but publicly reachable is still treated as exposed. Alongside that you get encryption coverage, a public access map, credential exposure checks in object storage, a data residency report, retention and logging coverage, and data lineage across pipeline chains. Findings refresh continuously as stores, permissions and exposure change.

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

Data lineage is part of [Onam's Data Security engine](/platform/data-security), its DSPM implementation. Onam reconstructs pipeline chains end to end, from source through each hop to destination, and gives each chain a risk grade. It detects unencrypted hops along a flow, rather than only reporting encryption status per store, so an encrypted source feeding an unencrypted downstream store is reported as one finding about the flow instead of two unrelated findings about two resources. Critical and high-risk chain counts let you rank exposure by flow.

Lineage sits on the same graph as Onam's metadata-based classification, identity analysis and network reachability. That means a chain can be read alongside who can reach each store in it and whether any store is publicly reachable. Classification uses names, tags, schema and configuration signals rather than reading data contents.

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

[Onam's CIEM engine](/platform/ciem) resolves effective permissions for every human user, role and service account across your connected clouds, walking policies, group memberships and cross-account trust. Recent activity from CloudTrail, Azure Activity Log and GCP Cloud Audit Logs is joined against granted permissions, which produces a least-privilege gap score per identity and a suggested right-sized policy based on real usage. Non-human identities such as Lambda execution roles, instance profiles, EKS pod identities, GCP workload identities and Azure managed identities are analysed the same way as users.

For review, Onam lists shadow admins, zombie identities, stale keys, external principals that can assume privileged roles, and MFA coverage for privileged identities. Escalation paths are searched on the identity graph and cross-checked against Onam's cloud detection and response, so a path that has actually been used is separated from one that is only reachable. Database CIEM extends this to grants inside managed databases.

Access reviews in Onam are an attestation and remediation workflow: every identity carries a state (pending, needs remediation, reviewed or deferred), and the finding that triggered the review stays attached, so the reviewer can see why it was flagged.

[Request a demo](/request-demo) to run a review against your own accounts. For the background on CIEM itself, see [CIEM vs IAM security](/resources/blog/ciem-vs-iam-security).
`,
  },
  {
    slug: "wiz-alternatives",
    title: "Wiz alternatives in 2026: an honest shortlist, including us",
    category: "Buyer's Guide",
    excerpt:
      "Wiz alternatives in 2026: six cloud security platforms in their vendors' own published words, with links and dates, plus Onam. No scores.",
    author: "anup-yadav",
    date: "September 15, 2026",
    readTime: "9 min",
    body: `
Onam Security wrote this list, and Onam is on it. Read everything below with that in mind. We have tried to make it useful anyway: every vendor is described in its own published words, with the page we read and the date we read it, and we score nobody. Where we add a view of our own, it is labelled as ours.

People search for Wiz alternatives for ordinary reasons. A renewal quote landed. A second or third cloud arrived that the incumbent treats as a checkbox. The security team wants a ranking denominated in something the finance team can read. Someone decided that nothing more should be installed on workloads. None of those reasons is a verdict on Wiz, which is on nearly every cloud security shortlist for good reason. They are questions, and the honest way to answer them is to put the same questions to every platform on the list, including Wiz and including us.

## First, be clear what you would be replacing

Wiz describes its platform on its own site as "Built for cloud and AI, Wiz AI-APP is the platform to secure your AI applications from code to runtime." On prioritisation it promises "A single list of prioritized issues of toxic combinations of cloud and AI risk that have a high probability of being exploited." On deployment: "Wiz connects in minutes via API and achieves full coverage across cloud and AI resources", and "Runtime protection from the Wiz Sensor stops threats and provides deep, real-time threat detection." Source: wiz.io/platform, accessed 15 September 2026.

Two things in that description matter for a shortlist. The ranking unit is a prioritised list of toxic combinations, and runtime coverage comes from a sensor. Neither is a weakness. They are design choices, and the alternatives below make different ones. Your evaluation should decide which choices fit your estate, not which vendor has the better adjectives.

## How this list was built

- Each vendor is quoted from its own public page, verbatim, with the address and the date. If the page changes, the quote is out of date, not wrong, and we will fix it when told.
- Nothing here says what any product cannot do. We did not test them, and a page asserting a competitor's gap is out of date within a quarter. If a capability matters to you, ask that vendor to demonstrate it live.
- No ranking. The alternatives are listed in alphabetical order, with our own entry last.
- Corrections go to hello@onamsecurity.com and are applied, not argued with.

## Six alternatives to Wiz

### 1. CrowdStrike Falcon Cloud Security

In its own words, Falcon Cloud Security "unifies agentless visibility with the CrowdStrike Falcon sensor, combining real-time detection, AI-driven insights, and automated response in a single platform." On prioritisation: CrowdStrike "enriches cloud risk detections with adversary intelligence and graph-based context, enabling you to prioritize exploitable exposures and prevent breaches." On deployment it describes "a proven agent and agentless solution." Source: crowdstrike.com/platform/cloud-security, accessed 15 September 2026.

**Where it plainly fits, in our view:** organisations already running the Falcon sensor on endpoints, where cloud runtime protection extends an agent the operations team knows.

**What to ask them:** what agentless visibility alone covers on a workload with no sensor, and how a posture finding is ranked when no adversary intelligence applies to it.

### 2. Cortex Cloud (Palo Alto Networks)

If your shortlist says Prisma Cloud, check which product name is on the quote you receive. The Cortex Cloud page describes it as "a Cloud-Native Application Protection Platform (CNAPP) designed to secure cloud-native applications across multi-cloud environments." On prioritisation: "SmartScore prioritizes them by real-world exposure and production behavior, replacing volume-driven alerts with decisions grounded in actual risk." On deployment: "Our performance-optimized agent captures deep behavioral telemetry to understand attacker intent and contain threats." Source: paloaltonetworks.com/cortex/cloud, accessed 15 September 2026.

**Where it plainly fits, in our view:** estates already standardised on Palo Alto, where one commercial relationship covers network, endpoint and cloud, and procurement is simpler for it.

**What to ask them:** which workloads the agent must be deployed to, who owns that rollout, and what a workload without the agent receives.

### 3. Lacework FortiCNAPP (Fortinet)

Fortinet's page says "FortiCNAPP provides unmatched visibility and context to simplify securing everything from code to cloud", and on attack paths: "Quickly visualize complex relationships between entities, risks, and threats to gain deeper insight into potential attack paths." The page names AWS, Azure, Google Cloud and private clouds. It does not state the deployment model on that page, so ask. Source: fortinet.com/products/forticnapp, accessed 15 September 2026.

**Where it plainly fits, in our view:** Fortinet estates that want cloud posture from the vendor already in the network.

**What to ask them:** agent or agentless per workload type, and what unit the ranking is denominated in.

### 4. Microsoft Defender for Cloud

Microsoft's documentation describes Defender for Cloud as "a Cloud Native Application Protection Platform (CNAPP), which is a unified solution that combines multiple cloud security tools to protect applications across their entire lifecycle", with three components: cloud security posture management, DevSecOps and cloud workload protection. Posture is summarised by Secure score, which will "Summarize your security posture based on the security recommendations." For other clouds: "Connect to your multicloud environments by using agentless methods for CSPM insight and CWPP protection", with connectors for AWS and GCP. Attack path analysis is listed under the paid Defender CSPM plan, and server protection comes "through Microsoft Defender for Endpoint." Source: learn.microsoft.com, Defender for Cloud overview, accessed 14 September 2026.

**Where it plainly fits, in our view:** Azure-centred estates, where it is frequently already licensed and the native integration depth is hard for any third party to match.

**What to ask them:** which capabilities sit in the free foundational tier and which need the Defender CSPM plan, and how AWS and GCP resources are treated relative to Azure ones.

### 5. Orca Security

Orca's page says "Orca Security is the complete Cloud Security Platform that detects, prioritizes, and remediates security risks and compliance issues across your cloud estate." Prioritisation is described as "Dynamic scoring and attack path analysis." Deployment is "Agentless scanning across every workload" through SideScanning, with "Runtime observability and protection" from the Orca Sensor. Source: orca.security/platform, accessed 15 September 2026.

**Where it plainly fits, in our view:** the closest architectural neighbour to Wiz on this list, agentless first with an optional sensor for runtime, for teams that want that shape from a different vendor.

**What to ask them:** how a finding on one cloud is ranked against a finding on another, and what the sensor adds that agentless scanning does not.

### 6. Onam Security (that is us)

We are the newest company on this list, so here are the facts rather than the adjectives. Posture scanning connects through read-only cloud roles; agentless workload scanning runs inside your account, with no agent on your workloads. Seven clouds get the same treatment, AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud and Kubernetes, with 11,433 posture rule definitions across 549 cloud services as the all-cloud totals. Every engine writes into one security graph, so an attack path can start in one cloud and end in another. Verified paths are priced with FAIR, the Open Group's standard for putting a dollar value on cyber risk, so the top of the queue is a figure a board can weigh, not a severity label. Compliance evidence is continuous against 78 frameworks, and SaaS posture covers 8 platforms. Our figures come from our published fact set, which is the same source every page on this site quotes.

**The honest gap:** we have no public reference customers yet, and we have no live runtime enforcement. There is no Onam sensor, which also means read-only scanning cannot see inside a running process. If inline blocking is what you are buying, buy that from someone on this list who sells it. If proven enterprise scale is your first filter, that filter does not select us today.

**What to ask us:** the same seven questions as everyone else. Our answers are on the record on the [Onam vs Wiz](/compare/onam-vs-wiz) page.

## The seven questions to put to all of them

These are criteria, not claims. Every platform above will answer them differently, and the answers are what your shortlist should be scored on.

| Question | Why it separates platforms |
| --- | --- |
| How many clouds get first-class treatment? | Every vendor says multi-cloud. Ask for the per-cloud rule breakdown, not the headline. |
| Is the analysis cross-cloud, or per-cloud silos side by side? | A path that crosses a cloud boundary is invisible to anything that analyses each cloud separately. |
| Agentless, and how long to first finding? | Deployment friction predicts coverage. Whatever needs a rollout will not reach the whole estate. |
| What unit is the ranking denominated in? | A score ranks findings against each other. A dollar figure ranks them against everything else you fund. |
| Does it catch toxic combinations across engines? | The chain that reaches data is usually four ordinary findings in a row. |
| Is compliance evidence continuous or point-in-time? | Point-in-time evidence means you are audit-ready one day a quarter. |
| Does coverage span code to runtime? | A fix in the console that the Terraform re-creates on the next deploy is not a fix. |

## How to run this shortlist in an afternoon

Pick two vendors from the list plus the incumbent. Give each read-only access to one non-production account that you know has real problems. Then compare three things: what each platform ranks first, what unit that ranking is expressed in, and how many of the top findings are the same problem seen from different angles. That exercise takes an afternoon, costs nothing, and tells you more than any comparison page, including this one.

If you want to include us, [request a scan](/request-demo) and we will run it against one account. If the attack paths we surface are noise, tell us. That is more useful to us than a signature.

## Corrections

Last verified 15 September 2026. Every statement about another vendor above is a quotation from that vendor's own public page on the date shown. If any of it is wrong or out of date, including anything about us, email hello@onamsecurity.com and it will be corrected.

*Read next: [What to ask in a cloud security POC](/resources/blog/onam-vs-wiz-orca-prisma-cloud), the seven questions in full, and the [head-to-head comparison pages](/compare).*
`,
  },
  {
    slug: "best-cspm-tools",
    title: "The best CSPM tools in 2026: an honest shortlist, and we are on it",
    category: "Buyer's Guide",
    excerpt:
      "Best CSPM tools in 2026: seven worth shortlisting, each in its vendor's own words with a link and date, plus the five things that now separate them.",
    author: "anup-yadav",
    date: "September 15, 2026",
    readTime: "9 min",
    body: `
Onam Security wrote this list, and Onam is on it. That is the first thing to know. The second is that every other tool below is described in its vendor's own published words, with the page and the date, and nobody is scored. A "best tools" list written by a vendor is only worth reading if it is honest about both of those things, so here they are up front.

## What a CSPM tool is, in one paragraph

Cloud security posture management checks the configuration of your cloud estate against rules, continuously, and tells you where it is wrong: the public bucket, the role with wildcard permissions, the database with no encryption, the security group open to the world. In 2026 almost every CSPM tool is sold as part of a wider platform, usually labelled a CNAPP, and the posture engine is one of several on it. A longer explanation is on our [What is CSPM](/learn/cspm) page. What follows assumes you know roughly what you are buying and want to know which tools to shortlist.

## What separates CSPM tools now

Every tool on this list finds misconfigurations. That stopped being a differentiator years ago. Five things still separate them, and they are what the shortlist should be scored on.

1. **Depth per cloud.** The headline rule count hides whether your third cloud gets the same engine as your first. Ask for the per-cloud breakdown.
2. **One graph or several silos.** A path that starts in one cloud and ends in another is invisible to a tool that analyses each cloud on its own.
3. **Deployment.** Agentless and read-only means the whole estate gets connected. Anything that needs a rollout reaches part of it.
4. **The ranking unit.** Severity labels rank findings against each other. Business impact, ideally in money, ranks them against everything else the company could fund.
5. **Continuous compliance evidence.** Evidence generated when someone clicks export is evidence for one day a quarter.

## How this list was built

Vendors' own public pages, quoted verbatim, with the address and the date read. No claims about what any product cannot do, because we did not test them and a page asserting a competitor's gap rots within a quarter. No ranking order: alphabetical, with our own entry last. Corrections to hello@onamsecurity.com.

## The seven CSPM tools worth shortlisting in 2026

### 1. Cortex Cloud (Palo Alto Networks)

Palo Alto describes Cortex Cloud as "a Cloud-Native Application Protection Platform (CNAPP) designed to secure cloud-native applications across multi-cloud environments." On prioritisation: "SmartScore prioritizes them by real-world exposure and production behavior, replacing volume-driven alerts with decisions grounded in actual risk." On deployment: "Our performance-optimized agent captures deep behavioral telemetry to understand attacker intent and contain threats." If you were quoted Prisma Cloud, ask which product name applies. Source: paloaltonetworks.com/cortex/cloud, accessed 15 September 2026.

**In our view it fits** estates already on Palo Alto for network and endpoint, where one relationship covers cloud too.

### 2. CrowdStrike Falcon Cloud Security

CrowdStrike's page says Falcon Cloud Security "unifies agentless visibility with the CrowdStrike Falcon sensor, combining real-time detection, AI-driven insights, and automated response in a single platform", and that it "enriches cloud risk detections with adversary intelligence and graph-based context, enabling you to prioritize exploitable exposures and prevent breaches." Deployment is "a proven agent and agentless solution." Source: crowdstrike.com/platform/cloud-security, accessed 15 September 2026.

**In our view it fits** organisations already running the Falcon sensor on endpoints.

### 3. Microsoft Defender for Cloud

Microsoft's documentation describes it as "a Cloud Native Application Protection Platform (CNAPP), which is a unified solution that combines multiple cloud security tools to protect applications across their entire lifecycle", with cloud security posture management as one of three core components. Secure score will "Summarize your security posture based on the security recommendations." For AWS and GCP: "Connect to your multicloud environments by using agentless methods for CSPM insight and CWPP protection." Attack path analysis and the cloud security graph are listed under the paid Defender CSPM plan. Source: learn.microsoft.com, Defender for Cloud overview, accessed 14 September 2026.

**In our view it fits** Azure-centred estates, where it is often already licensed.

### 4. Orca Security

"Orca Security is the complete Cloud Security Platform that detects, prioritizes, and remediates security risks and compliance issues across your cloud estate." Prioritisation: "Dynamic scoring and attack path analysis." Deployment: "Agentless scanning across every workload" through SideScanning, with an optional Orca Sensor for "Runtime observability and protection." Source: orca.security/platform, accessed 15 September 2026.

**In our view it fits** teams that want agentless-first posture with a runtime sensor available when they need it.

### 5. Tenable Cloud Security (Tenable One Cloud Exposure)

Tenable's page positions the product to "Prevent cloud breaches and reduce cloud risk by closing gaps that misconfigurations, risky entitlements, and vulnerabilities create across multi-cloud and hybrid environments." Prioritisation: "Identify toxic combinations of risk first, with clear attack path visualizations and remediation workflows most likely to result in material damage." It "integrates with all major cloud providers (AWS, Azure, GCP)", and in-account scanning is available as an add-on where "the data never leaves the environment." Source: tenable.com/products/tenable-cloud-security, accessed 15 September 2026.

**In our view it fits** organisations already using Tenable for vulnerability management who want cloud posture in the same exposure view.

### 6. Wiz

Wiz describes its platform as "Built for cloud and AI, Wiz AI-APP is the platform to secure your AI applications from code to runtime", promising "A single list of prioritized issues of toxic combinations of cloud and AI risk that have a high probability of being exploited." Deployment: "Wiz connects in minutes via API and achieves full coverage across cloud and AI resources", with "Runtime protection from the Wiz Sensor." Source: wiz.io/platform, accessed 15 September 2026.

**In our view it fits** almost any shortlist. It set the reference point for agentless, graph-based cloud security, and the category largely follows its shape. Our own [Onam vs Wiz](/compare/onam-vs-wiz) page says where it is stronger than us.

### 7. Onam Security (that is us)

Facts, not adjectives. Posture scanning connects through read-only cloud roles; agentless workload scanning runs inside your account, with no agent on your workloads. Seven clouds get the same engine, AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud and Kubernetes, with 11,433 posture rule definitions across 549 cloud services as the all-cloud totals, of which 9,853 are CSPM posture rules. Every engine writes into one security graph, so a path can cross a cloud boundary. Verified attack paths are priced with FAIR, the Open Group's standard for expressing cyber risk in money, so the queue is ordered by exposure a board can weigh. Compliance evidence is continuous against 78 frameworks. SaaS posture covers 8 platforms. Every number traces to our published fact set, and the arithmetic behind a priced path is shown, not asserted.

**The honest gap:** we have no public reference customers yet, and no live runtime enforcement. There is no Onam sensor, so read-only scanning cannot see inside a running process. If inline blocking is a requirement, one of the six above sells it and we do not.

## The shortlist at a glance

Each cell below is what the vendor's own page says, on the date read. Blank means the page does not say, and you should ask.

| Tool | Ranking unit, as described | Deployment, as described | Read on |
| --- | --- | --- | --- |
| Cortex Cloud | SmartScore, real-world exposure and production behaviour | performance-optimized agent | 15 Sep 2026 |
| Falcon Cloud Security | adversary intelligence and graph-based context | agent and agentless | 15 Sep 2026 |
| Defender for Cloud | Secure score; attack paths in the Defender CSPM plan | agentless connectors; Defender for Endpoint for servers | 14 Sep 2026 |
| Orca Security | dynamic scoring and attack path analysis | agentless SideScanning; optional Orca Sensor | 15 Sep 2026 |
| Tenable Cloud Security | toxic combinations, attack path visualisations | integrates with AWS, Azure, GCP; in-account scanning add-on | 15 Sep 2026 |
| Wiz | prioritised toxic combinations on the Security Graph | API connection; Wiz Sensor for runtime | 15 Sep 2026 |
| Onam Security | verified attack paths priced in FAIR dollars | agentless, read-only, no sensor | our fact set |

## How to choose in an afternoon

Do not choose from this table. Pick three tools, connect each to one non-production account you know has real problems, read-only, and compare what each ranks first, in what unit, and how many of the top findings are the same problem viewed from different angles. That is the whole evaluation, and it beats every analyst grid and every vendor list, including this one.

If you want Onam in that three, [request a scan](/request-demo). If the paths we surface are noise, say so. We would rather hear it than win a deal we should not.

## Corrections

Last verified 15 September 2026. Every statement about another vendor is a quotation from that vendor's public page on the date shown. If anything is wrong or out of date, including anything about us, email hello@onamsecurity.com and it will be corrected.

*Read next: [Wiz alternatives in 2026](/resources/blog/wiz-alternatives), the [comparison pages](/compare), and [how agentless scanning works](/platform/agentless).*
`,
  },
  {
    slug: "onam-vs-wiz-orca-prisma-cloud",
    title: "What to ask in a cloud security POC: 7 questions for Wiz, Orca, Prisma Cloud and Onam",
    category: "Buyer's Guide",
    excerpt:
      "Running a cloud security POC against Wiz, Orca or Prisma Cloud? Seven questions that separate the platforms, Onam's answers, and a scoring checklist.",
    author: "anup-yadav",
    date: "July 20, 2026",
    readTime: "9 min",
    body: `
Most cloud security proofs of concept are run badly — not because the buyer is careless, but because every platform demos well. Point any of them at a messy AWS account and findings appear within the hour. That is table stakes, and a POC that only proves it tells you nothing about which tool to buy.

The seven questions below are the ones worth asking *during* the trial, while you still have hands on the product and a vendor engineer on the call. Each one is answerable inside a two-week POC, and each separates platforms that look identical in a demo.

If you're evaluating cloud security platforms in 2026, your shortlist probably reads: Wiz, Orca Security, Palo Alto Prisma Cloud — and maybe us. All three are mature, well-funded products with broad ecosystems, and if a vendor tells you their competitors are bad products, stop trusting that vendor.

So this is not that post. Instead, here are the seven questions we believe actually separate cloud security platforms — the ones that predict whether the tool still works for you two years in. We'll give you Onam's answer to each, on the record. Then run the same checklist against every vendor on your shortlist and compare answers side by side.

## The seven questions that separate platforms

### 1. How many clouds get *first-class* treatment?

Every platform says "multi-cloud." The question is which clouds get the full engine depth and which get a check-the-box connector. If you run anything on Oracle Cloud (OCI), Alibaba Cloud, or IBM Cloud — common in finance, manufacturing, and Asia-Pacific enterprises — ask each vendor to demo *those* clouds, not AWS.

**Onam's answer:** all 7 clouds — AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud, and Kubernetes — run the same rules, the same graph, the same attack-path analysis, and the same compliance mapping. No second-tier clouds.

### 2. Is the analysis cross-cloud, or per-cloud silos side by side?

Real attack paths cross boundaries: an exposed GCP service account key that can assume a role into your AWS production account is invisible to any tool that analyses each cloud separately. A dashboard that *displays* seven clouds is not the same as a graph that *correlates* them.

**Onam's answer:** one graph across all clouds and every security layer. Attack-path analysis follows the identity chain wherever it goes — including across cloud providers.

### 3. Agentless — and how long to first finding?

Deployment friction predicts coverage: if connecting an account takes a change-management ticket, half your estate never gets connected. Ask for the exact onboarding steps and the time from connection to first critical finding.

**Onam's answer:** 100% agentless. A read-only IAM role, service principal, or service account connects a cloud in under 3 minutes; we store only a role ARN, never long-lived credentials. First critical alert typically surfaces in under 5 minutes.

### 4. How does it prioritise — severity labels or business impact?

An alert firehose with 4,000 "critical" findings is operationally identical to no prioritisation at all. Ask *how* the platform decides what's first, and whether that reasoning is explainable to your CFO.

**Onam's answer:** FAIR-model risk quantification — findings are ranked by estimated dollar exposure, computed from asset value, exposure, and exploitability, so the top of the queue is defensible in business terms, not just CVSS arithmetic.

### 5. Does it catch toxic combinations across engines?

A public subnet is medium. An over-privileged identity is medium. A workload with a critical CVE is high. The same three on one attack path is a breach waiting to happen. This correlation is the whole point of a unified platform — ask each vendor to show it live.

**Onam's answer:** automated toxic-combination detection across every layer — posture, identity, vulnerabilities, network, data — because everything already lives on one graph.

### 6. Is compliance evidence continuous or point-in-time?

If evidence is generated when you click "export report," you are audit-ready one day per quarter. Ask whether framework mappings update as infrastructure changes.

**Onam's answer:** 78 frameworks — CIS (AWS, Azure, GCP), NIST 800-53, ISO 27001, PCI-DSS v4, HIPAA, SOC 2, and more — with continuous evidence. One finding maps to every framework it affects; auditors get exports, not screenshots.

### 7. Does coverage span code to runtime?

Fixing a misconfiguration in the console while the Terraform that created it stays broken means the finding comes back on the next deploy. Ask whether the platform sees IaC, code, and runtime as one pipeline.

**Onam's answer:** SAST, DAST, SCA, and IaC scanning correlated with runtime findings — so the fix lands where the resource is defined, not just where it's running.

## The checklist, in one table

| Evaluation criterion | Ask every vendor | Onam's answer |
| --- | --- | --- |
| Cloud coverage | Which clouds are first-class? Demo OCI/Alibaba/IBM. | All 7 clouds, same engine depth everywhere |
| Cross-cloud analysis | One graph or per-cloud silos? | Single graph, cross-cloud attack paths |
| Deployment | Agents? Time to first finding? | 100% agentless, < 3 min connect, < 5 min first alert |
| Prioritisation | How is "what's first" decided? | FAIR-model dollar-risk ranking |
| Toxic combinations | Cross-engine correlation, live demo | Automated across every layer |
| Compliance | Continuous or point-in-time evidence? | 78 frameworks, continuous, one-click export |
| Code + runtime | IaC/code linked to runtime findings? | SAST · DAST · SCA · IaC · runtime, correlated |
| Pricing model | Per-resource? Per-engine add-ons? | One platform, no per-engine add-ons |

## Where the big names are genuinely strong

Wiz, Orca, and Prisma Cloud earned their market position: strong products, large integration ecosystems, big security-research teams. If your estate is a single cloud and you have the budget and headcount to operate a large platform, any of them can serve you well.

Onam's bet is different: that the next generation of cloud security is won on **breadth of first-class coverage** (all 7 clouds, not 3), **one graph instead of bolted-together modules**, and **prioritisation a CFO can read**. That's what we built, and it's why teams running more than just the big-three clouds — or teams tired of triaging severity labels — pick us.

The honest way to decide is the checklist above. Run it against all four of us. We'll take our chances.

*Want Onam's answers demonstrated on your own environment instead of a slide deck? [Request a demo](/request-demo) — connecting your first cloud takes about 3 minutes.*
`,
  },
  {
    slug: "cdr-behavioral-threat-detection",
    title: "Beyond GuardDuty: how three-tier behavioral detection catches what rules miss",
    category: "CDR",
    excerpt:
      "Cloud threat detection needs three layers: rules for known signatures, behavioral baselines for slow privilege escalation, and ML anomaly detection.",
    author: "nishchal-gupta",
    date: "July 15, 2026",
    readTime: "10 min",
    body: `
AWS GuardDuty is a good product. It detects known malicious IP addresses, known cryptocurrency mining domains, known port scanning patterns, and a catalogue of documented attack signatures. If an attacker uses infrastructure that has appeared in threat feeds, GuardDuty will catch it.

The problem is that sophisticated attackers do not use infrastructure that appears in threat feeds. They use compromised legitimate accounts, new cloud instances with clean IP addresses, and legitimate cloud services as their command-and-control channel. They operate slowly enough to avoid rate-based anomaly rules. They escalate privileges incrementally — one permission at a time — over days or weeks.

Rule-based detection catches what you already know to look for. The question is how to catch what you do not.

## The three-tier detection architecture

Onam's CDR (Cloud Detection and Response) engine operates on three detection tiers that complement each other. Each tier catches a different class of attacker behavior, and together they close the gaps that any single tier leaves open.

| Tier | Approach | What it catches |
| --- | --- | --- |
| L1 | Rule-based signature detection | Known-bad indicators, documented exploit signatures, SSRF against the metadata service, mining indicators |
| L2 | Statistical behavioral baselines per identity | Legitimate credentials behaving unlike their own history |
| L3 | ML anomaly detection across the environment | Novel techniques and insider threats anomalous at the population level |

**L1 — Rule-based signature detection.** Exactly what GuardDuty does, extended to cover multi-cloud environments — Azure, GCP, OCI, Alibaba Cloud, IBM Cloud — with a single unified alert schema. Rules are mapped to MITRE ATT&CK techniques so each alert comes with context about which phase of the attack chain it represents.

**L2 — Statistical behavioral baseline detection.** For each IAM identity, compute role, and workload in your environment, Onam builds a statistical model of normal behavior. Normal means: which API calls does this identity make, at what time of day, from which IP ranges, in which regions, against which resources? L2 alerts when observed behavior deviates from the baseline beyond a configurable threshold. This catches attackers who are using legitimate credentials and behaving differently from the identity's established pattern.

**L3 — ML anomaly detection.** Where L2 looks at the behavior of individual identities against their own history, L3 looks at behavior across the entire environment and flags anomalies that do not match patterns anywhere in the account. This is particularly effective for detecting novel attack techniques and insider threats — cases where the attacker knows the environment well enough to mimic an individual identity's patterns, but whose behavior is still anomalous at the population level.

![The CDR alert view in the Onam console (demo account)](/screenshots/screenshot-cdr.png)

## How L2 catches what L1 misses: incremental privilege escalation

The canonical example of what L1 cannot detect is incremental privilege escalation. Here is a real pattern observed in cloud intrusions.

**Day 1.** The attacker gains access to a developer's AWS credentials — likely through phishing or an access key committed to a public GitHub repository. The developer's account can read from S3 buckets and invoke Lambda functions. The attacker reads the environment: lists resources, describes IAM policies, maps the account structure. All of these calls are legitimate API operations. No threat intelligence flags fire. GuardDuty sees nothing unusual.

**Day 3.** The attacker notices that the developer's role has \`iam:ListRolePolicies\` and uses it to map roles with elevated permissions. They find a CI/CD role that can deploy CloudFormation stacks. They call \`iam:AssumeRole\` to take on the CI/CD role — a call the developer legitimately makes for manual deployments. No rule fires.

**Day 7.** Using the CI/CD role, the attacker deploys a CloudFormation stack that creates a new IAM role with administrator access. The stack deployment is indistinguishable from legitimate CI/CD activity. The administrator role is now available.

At no point did the attacker trigger a signature-based rule. They used legitimate credentials to call legitimate APIs in a legitimate sequence — just not the developer's usual sequence.

L2 catches this because the behavioral baseline for the developer account shows API call patterns concentrated in us-east-1 between 9am and 6pm on weekdays. The attacker's activity happens at 2am UTC from an unusual IP range, covers nine regions in sequence (consistent with environment mapping), and includes \`iam:ListRolePolicies\` calls the developer has never made before. The deviation score exceeds the threshold on Day 1. By Day 3, the anomaly score has accumulated across multiple sessions and an L2 alert fires with the full session timeline.

## What "normal" means for a cloud identity

Building a behavioral baseline that is specific enough to be useful without generating constant false positives requires care about which signals you model. Onam's L2 baseline captures:

- **API call distribution** — which services and specific operations this identity calls, and in what frequency distribution. A Lambda execution role that calls DynamoDB and Secrets Manager but never touches IAM has a narrow, predictable profile.
- **Temporal patterns** — when the identity makes calls. Human users show strong daytime concentration; scheduled functions fire at consistent intervals. A 9-to-6 identity making calls at 2am is a strong signal.
- **Source IP and ASN patterns** — does this identity always call from the corporate CIDR block, a specific region, or cloud service IP ranges? New source ASNs, especially cloud VPS providers, are anomalous for human users.
- **Region distribution** — most deployments operate in one or two regions. An identity suddenly making calls across six regions in sequence is consistent with discovery behavior.
- **Resource access patterns** — which specific resources the identity touches. A service account that only ever writes to one DynamoDB table suddenly reading a different table is anomalous regardless of what the IAM policy technically allows.

> The baseline window is 30 days by default. New identities get a 14-day warm-up period during which L2 does not alert — it is building the baseline. This prevents false positives during service launches, when an identity's behavior naturally looks anomalous because it has no history.

## MITRE ATT&CK mapping in CDR context

Every CDR alert — regardless of which tier generated it — is tagged with the MITRE ATT&CK techniques it corresponds to. This matters for two reasons.

First, it puts the alert in attack chain context. A single L2 alert for an unusual API call from a new IP is low severity in isolation. But if the same identity triggered an L1 alert for metadata service enumeration two hours earlier, the two alerts together represent Initial Access (T1078.004) followed by Discovery (T1082). The ATT&CK tagging makes this correlation visible in the alert timeline without manual analysis.

Second, it connects CDR findings to posture findings. If your CDR alert is tagged T1548.005 — privilege escalation via role assumption — the posture engine can immediately surface the IAM misconfigurations that made the technique possible: the overly permissive trust policy, the missing condition key on AssumeRole. The CDR alert becomes a force multiplier for CSPM remediation.

## Cross-cloud correlation

Multi-cloud environments create a detection gap that single-cloud tools cannot address: an attacker who compromises an AWS identity can use that access to pivot to Azure or GCP workloads, and no single-cloud detection tool sees the full picture.

A pattern Onam's CDR engine is designed to catch: an attacker compromises AWS credentials and uses them to read Secrets Manager entries that contain Azure service principal credentials — a common pattern in cross-cloud deployments where one provider's secrets manager holds credentials for another. The AWS activity triggers an L2 alert because the identity has never accessed that specific secret. Ten minutes later, the Azure service principal makes unusual RBAC modification calls in Azure. Neither alert in isolation points to a cross-cloud attack. Together, with the 10-minute timestamp correlation, they tell a clear story.

Cross-cloud correlation requires a unified identity model that maps AWS IAM principals, Azure Managed Identities, and GCP Service Accounts into a single graph. Onam builds this model during the discovery phase; CDR alert correlation runs against it to surface cross-cloud attack chains that would be invisible to single-cloud tools.

## What to expect in the first 14 days

The first two weeks of CDR deployment are primarily about baseline calibration and tuning out operational noise.

**Days 1–3.** L1 rules begin firing immediately. The most common early findings are not active threats — they are configuration patterns that look like threats: instances making repeated metadata calls (legitimate credential refresh), Lambda functions calling APIs across regions (legitimate global services), CI/CD pipelines creating IAM roles during provisioning.

**Days 4–7.** Review and tune the L1 false positives. Mark legitimate patterns as suppressed with an expiry date — suppression should never be permanent for a cloud detection rule. The goal is alert volume a human can review in 30 minutes per day.

**Days 8–14.** L2 baselines finish their initial calibration. The first L2 alerts appear — typically flagging maintenance windows, pipelines that run at unusual hours, and identities with legitimate but irregular usage. Each alert requires a decision: suppress (with expiry and owner), investigate, or escalate.

By day 15, alert volume should be manageable and signal quality high enough for a 30-minute daily triage. The value of L3 becomes apparent after 30–60 days, when the model has enough history to distinguish population-level anomalies from operational variance.

> CDR is not a "set it and forget it" product. It requires sustained analyst engagement to tune baselines and investigate alerts. The return on that investment is coverage of the attacker behaviors no signature-based tool can detect — the class of behavior responsible for most significant cloud breaches.

To see the three tiers against your own telemetry, [book a demo](/request-demo).
`,
  },
  {
    slug: "aws-misconfigurations-first-scan",
    title: "The 5 AWS misconfigurations we find in 90% of first scans",
    category: "CSPM",
    excerpt:
      "Five AWS misconfigurations that commonly show up on a first scan: what they are, why they persist, and how to fix them fast.",
    author: "nishchal-gupta",
    date: "July 10, 2026",
    readTime: "6 min",
    body: `
## Why the same five keep showing up

Cloud teams move fast, and defaults rarely favor the defender. Across the AWS accounts we onboard, five misconfigurations recur with astonishing consistency — often in accounts operated by teams that consider themselves mature. Each one is easy to introduce, easy to miss, and each one can quietly widen the blast radius of a routine credential leak into a full compromise.

## 1. S3 buckets exposed via bucket policies (not ACLs)

Everyone knows to block public ACLs. Fewer teams audit **bucket policies** that grant \`s3:GetObject\` to \`Principal: "*"\`. The AWS console labels these buckets "Public" only when the policy resource is the bucket itself — not when it's \`arn:aws:s3:::acme-corp-uploads/public/*\`.

- Enable **Block Public Access** at the account level.
- Alert on any new bucket policy statement whose principal is \`*\` or whose condition allows broad IPs.
- Treat any \`s3:*\` grant to \`arn:aws:iam::****4821:root\` from another account as a finding until proven intentional.

## 2. Over-privileged IAM roles attached to EC2

We routinely find \`AdministratorAccess\` on instance profiles that only need to read from one S3 prefix. Combined with an SSRF bug or an exposed metadata endpoint (IMDSv1), that role becomes an admin foothold.

- Enforce **IMDSv2** across the fleet.
- Replace \`*\` policies on instance profiles with least-privilege equivalents generated from IAM Access Analyzer.
- In Onam, this pattern shows up as a red edge in the attack graph the moment a public-facing workload reaches the role.

## 3. Public RDS snapshots

RDS snapshot sharing is a per-snapshot ACL — flipping it to "public" makes the entire database available to any AWS account. Teams do this to move data between environments and forget to revert.

## 4. Security groups with 0.0.0.0/0 on non-web ports

SSH (22), RDP (3389), database ports, and \`ANY\`-protocol rules facing the internet are still the single most common initial-access vector we detect during onboarding. Most are legacy — a rule opened for a demo three years ago on an account no one owns anymore.

## 5. CloudTrail gaps

CloudTrail is either not enabled in every region, not covering S3 data events, or writing to a bucket in the same account with no MFA delete. Any attacker with account-level access rewinds the tape.

## What "fix it fast" actually looks like

Prioritization matters more than volume. Onam's attack-path engine ranks these five findings by **actual reachability from an internet-exposed resource to a crown jewel** — so the SSH-open bastion in front of an admin IAM role beats the internal-only bucket policy every time.

> "Coverage is table stakes. What we sell is the order you fix things in."

If you're onboarding a new AWS org, expect at least three of the five above on day one. That's not a failure of your team — it's the shape of AWS defaults.
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

CIEM starts where IAM Security stops. It reconciles **who has which entitlements**, **what those entitlements evaluate to** given every trust policy, permission boundary, and SCP in the chain, and — most importantly — **what was actually used** in the last 90 days.

The output isn't "this user has AdministratorAccess." Every scanner will tell you that. The output is:

- \`user@example.com\` has effective \`s3:PutObject\` on 412 buckets across 3 accounts, but has only ever written to 4 of them.
- \`OnamReadOnly\` in account \`****4821\` is assumable by 17 principals in 6 other accounts through a chain of two roles.
- The service account \`acme-corp-ci\` has never used 91% of its granted permissions since it was created.

That third bullet is where CIEM stops being interesting and starts being urgent. **Unused entitlements are the single largest source of over-privilege in most environments.**

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
    title: "AI-powered cloud remediation: from finding to fix in minutes",
    category: "Engineering",
    excerpt:
      "AI-powered cloud remediation: context-aware code fixes, Ansible playbooks for CVEs and threat narratives that shorten how long findings stay open.",
    author: "nishchal-gupta",
    date: "June 30, 2026",
    readTime: "8 min",
    body: `
The average mean time to remediate (MTTR) for cloud security findings is 47 days, according to data collected across enterprise cloud programs. That number has not changed meaningfully in five years, despite cloud security tooling improving substantially over the same period.

The tools got better at finding things. The bottleneck was never finding — it was fixing. A security team that surfaces 500 findings per week and has engineering bandwidth to fix 20 will always have an accumulating backlog, no matter how well-tuned the detection is.

AI-powered remediation addresses the bottleneck directly. Not by reducing finding volume — the findings are real and need to be fixed — but by reducing the time between "identified" and "resolved" for each one.

## Why generic LLM suggestions fail

The obvious approach is to pipe findings into a general-purpose LLM and ask it to produce a fix. This works poorly in practice, for a specific reason: cloud security remediation is context-dependent in ways a general LLM cannot know without being told.

Consider a finding: "Lambda function \`payment-processor-prod\` has a role with \`s3:GetObject\` on \`*\`." A generic LLM will suggest: "Restrict the IAM role to only the specific S3 bucket the function needs to access." Technically correct. But which bucket? What is the ARN? Are there multiple buckets? Is the function deployed by Terraform, CloudFormation, or CDK? Is the role shared with other functions?

A context-aware fix engine knows the answers because it has already discovered the Lambda function, its associated role, the S3 buckets it actually accesses (from CloudTrail analysis), the IaC stack that deployed it, and the other resources that share the role. The fix it generates is not generic guidance — it is a specific, deployable policy change with the correct ARN, condition keys, and IaC format.

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

## Vulnerability Fix: Ansible playbooks for CVE remediation

The traditional workflow for CVE remediation in cloud workloads is: CVSS alert appears, security team sends it to DevOps, DevOps writes a runbook, the runbook is reviewed, the runbook is executed. For a team managing hundreds of CVEs per month, the runbook-writing step alone is a significant bottleneck.

Onam's Vulnerability Fix engine generates Ansible playbooks that remediate CVEs without manual runbook writing. For each CVE finding, it:

1. Identifies the affected package and version from the vulnerability scan results.
2. Looks up the target version (the patched release) from the NVD advisory.
3. Generates an Ansible playbook that updates the specific package on the affected host.
4. Includes pre-flight checks (the package exists, the host is the right OS family) and post-flight validation (the patched version is installed).
5. Annotates the playbook with the CVE ID, CVSS score, and KEV status so the audit trail is self-documenting.

The generated playbook is idempotent — running it multiple times produces the same result. It is also scoped to minimum required privilege: it does not request root unless the package manager requires it, and it does not restart services unless the patch requires it.

For container workloads, the playbook also carries the equivalent Dockerfile line as a comment, so the fix can be built into the image. The playbooks are pushed to a fix branch for review.

## Threat Narratives: attack chain stories for CISOs and boards

The third capability addresses a different kind of bottleneck: communication.

Attack path analysis produces a graph — nodes and edges, resource IDs, MITRE technique codes. This output is precise and actionable for a security engineer. It is impenetrable to a CISO preparing a board presentation or a GRC team filing a regulatory response.

Threat Narratives converts the attack path graph into a natural-language description of the attack chain. Given a graph subpath representing a five-step privilege escalation, the engine generates:

> "An attacker who gains access to the API Gateway endpoint for the **checkout-service** Lambda function can exploit the SSRF vulnerability in the Node.js web framework (CVE-2024-37890) to retrieve temporary credentials from the EC2 Instance Metadata Service. These credentials belong to the **checkout-lambda-exec** execution role, which holds IAM PassRole permission on the **platform-deploy** role. Using this permission, the attacker can create a new Lambda function with the deployment role attached, gaining the ability to read from all S3 buckets in the account — including **customer-data-prod**, which contains 2.3 million customer records. This path combines Initial Access (T1078.004), Credential Access (T1552.005), and Privilege Escalation (T1548.005) into a five-step chain requiring no prior account access."

This narrative can be copied directly into a CISO report, an incident response ticket, or a regulatory filing. It requires no translation by a security engineer. The graph data and the human-readable story are generated from the same source, so they are always in sync.

## Typical MTTR reduction

Measuring the MTTR impact requires separating finding types, because the reduction varies significantly by category.

| Finding type | Before | With AI remediation |
| --- | --- | --- |
| IAM misconfiguration | 4–8 hours of investigation and policy authoring | 15–30 minutes of review and approval |
| OS-level CVE | 1–4 hours of runbook writing per CVE | Near-zero generation, 15 minutes of review |
| Escalation communication | An hour of engineer time per board-ready summary | A 10-minute review of the generated narrative |

Most of the reduction comes from eliminating the investigation phase — the engineer receives a specific, justified change rather than an abstract "reduce scope" recommendation.

## Privacy and safety: no code leaves your VPC

AI remediation generates fixes that reference your specific resource IDs, ARNs, IAM role names, and IaC configurations. These are sensitive artifacts. Sending them to a third-party LLM API is not acceptable for most enterprise cloud programs operating under SOC 2, ISO 27001, or government cloud frameworks.

All fix generation in Onam runs on dedicated model inference endpoints deployed in your cloud environment. The inference endpoint has no outbound internet access — it can only receive API calls from within your VPC and return responses. No cloud configuration data, no resource identifiers, and no generated fix content is transmitted to Onam's infrastructure or to any third-party LLM provider.

This is not a product constraint — it is an architectural requirement. The inference endpoint is part of the security boundary, not outside it.

## Making AI remediation part of the workflow

The most common mistake in AI remediation rollout is treating it as a replacement for security engineering judgment. It is not. Every generated fix requires review before deployment. The AI understands the IaC format, the least-privilege scope, and the resource context — it does not understand your team's operational constraints, your change management process, or the business reasons a particular configuration might be intentional.

> The right workflow is: AI generates, an engineer reviews, an engineer approves, automation deploys. The AI eliminates the generation phase. It does not eliminate the judgment phase — and it should not.

For teams that implement this workflow rigorously, the 47-day MTTR becomes an artefact of the pre-AI era. The remaining cycle time is review, approval, and change management — timelines bounded by process, not by engineer capacity. And process timelines can be shortened through policy, not headcount.
`,
  },
  {
    slug: "attack-path-4000-to-3",
    title: "Attack paths vs. misconfigurations: why toxic combinations are your real cloud risk",
    category: "Attack Path",
    excerpt:
      "CSPM tools surface hundreds of misconfigurations. The ones behind breaches chain together; attack path analysis shows which chains are dangerous.",
    author: "nishchal-gupta",
    date: "June 24, 2026",
    readTime: "11 min",
    body: `
The average enterprise cloud account has 400 to 600 CSPM findings at any given time. Security teams triage by severity, work through the Critical queue, and ship patches. Three months later, the finding count is roughly the same. The board asks why the environment is still at risk.

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

## Toxic combinations: when 2 + 2 = 10

The term "toxic combination" describes a set of findings that, in combination, produce a risk orders of magnitude larger than the sum of the individual risk scores. The concept has become standard terminology across the CNAPP space — for good reason.

A concrete example: suppose you have an EC2 instance that is internet-facing (a High finding) running a web application with a known CVE in its web framework (a Medium finding). Neither finding is marked Critical. But the CVE provides remote code execution, and the internet-facing exposure means the instance can be reached directly. The combination is Critical — a direct RCE entry point with no network controls in between.

Add one more element: suppose the instance profile grants \`ec2:DescribeInstances\` and \`ssm:SendCommand\` across the entire account. Now the attacker who exploited the CVE can run commands on every EC2 instance in the account. Three Medium/High findings. One account-wide compromise.

## Crown jewel path analysis

Not all attack paths matter equally. A path that reaches a development environment with synthetic test data is not the same as a path that reaches your production payment processor or customer data lake. Crown jewel path analysis starts from the resources you care most about — your crown jewels — and works backwards to find every path that leads to them.

Crown jewels are identified through a combination of:

- **Resource tags** — if your team already tags production databases and PII stores, those tags can automatically designate crown jewels.
- **Data classification signals** — S3 buckets with names matching PII or financial data patterns, RDS instances serving production applications.
- **Manual designation** — security teams can explicitly mark specific resources as crown jewels during onboarding.
- **Risk scoring** — resources that aggregate connections, like databases serving multiple services, score higher automatically.

Once crown jewels are designated, attack path analysis runs a reverse graph traversal: starting from each crown jewel, what resources can reach it, and through what chain of permissions and network paths? The result is a ranked list of paths sorted by likelihood of exploitation and blast radius.

## How Onam implements attack path analysis

Onam's attack path engine is built on a property graph. Every cloud resource — EC2 instances, IAM roles, S3 buckets, Lambda functions, security groups, VPCs, subnets, load balancers — is represented as a node. Relationships between resources are represented as typed edges.

| Edge type | Meaning |
| --- | --- |
| \`CAN_ASSUME\` | One IAM principal can assume another role (the trust policy allows it) |
| \`HAS_PERMISSION\` | An IAM principal has a specific action on a resource |
| \`NETWORK_REACHABLE\` | A resource is network-accessible from another resource or from the internet |
| \`RUNS_ON\` | A workload runs on a compute resource and inherits its instance role |
| \`EXPOSES\` | A load balancer or API Gateway exposes another resource to a broader network scope |

Attack path discovery runs a breadth-first search across this graph, starting from external entry points — internet-accessible endpoints, publicly accessible storage, misconfigured STS endpoints — and traversing the graph to find all reachable crown jewel nodes. Each discovered path is scored using a composite function of:

- Number of hops — shorter paths are higher priority.
- Exploitability of each step — a CVE with a public exploit vs. a step requiring valid credentials.
- Sensitivity of the target resource.
- Whether compensating controls exist along the path — monitoring, WAF, threat detection.

![A privilege escalation chain modeled as a graph of identities and permissions](/diagrams/feat-ciem-privesc-chain.svg)

## MITRE ATT&CK tagging on every path step

Each step in an attack path is tagged with the MITRE ATT&CK technique it represents. This does two things: it grounds the abstract graph traversal in threat intelligence that security teams and CISOs recognize, and it connects your attack path findings to your compliance posture for frameworks like NIST CSF and CIS Controls that reference ATT&CK.

A path step that exploits IMDSv1 to steal credentials is tagged T1552.005 (Unsecured Credentials: Cloud Instance Metadata API). A step that uses \`iam:PassRole\` for privilege escalation is tagged T1548.005. A step that exfiltrates data from S3 is tagged T1530.

This tagging means that when you present an attack path finding to an engineering team, you can say: "This is a five-step privilege escalation path from an internet-exposed Lambda to your production database, using T1078 to T1548 to T1530. Here are the three changes that break the path at step two."

## What to fix first: breaking the chain vs. hardening the target

When you have an identified attack path, you have two remediation strategies. You can harden the target — make the crown jewel harder to access — or you can break the chain: remove a link in the path so the attacker cannot traverse it.

Breaking the chain is almost always the right answer. Hardening the target is valuable — encryption, access logging, strict IAM policies on the database itself — but it does not eliminate the path. If the chain is intact, a sufficiently motivated attacker will find a way to the end.

Finding the optimal break point means identifying the link that:

- Has the lowest remediation cost — a one-line IAM policy change beats a network re-architecture.
- Blocks the most paths simultaneously — a single overly permissive role may appear in a dozen paths.
- Has no compensating control already in place.

> Onam's path analysis surfaces exactly this: for each discovered attack path, it identifies the minimum cut — the smallest set of changes that severs all paths to a given crown jewel.

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
      "FAIR model for cloud risk: CVSS ranks severity, FAIR answers what a breach of this attack surface would cost. How we apply it at Onam.",
    author: "anup-yadav",
    date: "June 17, 2026",
    readTime: "9 min",
    body: `
Every cloud security tool produces a list of findings ranked by CVSS score. Critical findings go to the top of the queue; engineers fix them in order. This approach has an intuitive appeal — surely the highest-severity vulnerability is the most urgent.

The problem is that CVSS measures the exploitability and impact of a vulnerability in isolation. It does not know whether your environment has compensating controls. It does not know whether the vulnerable resource is a developer's test server or your payment processing API. It does not know whether you process ten thousand transactions per day or ten million. Two organisations with identical CVSS scores can face risks that differ by three orders of magnitude.

FAIR — Factor Analysis of Information Risk — is the framework that fills this gap. It does not replace CVSS. It uses it as one input in a model that produces what your board actually cares about: the dollar value of your attack surface.

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

The model is probabilistic — each variable is expressed as a range with a confidence interval, and Monte Carlo simulation produces a distribution of annualised loss exposure (ALE) rather than a single point estimate. This is important: it makes uncertainty explicit rather than hiding it behind a precise-looking score.

## How Onam automates FAIR inputs

The traditional objection to FAIR is that it requires too many manual inputs to scale. Estimating threat event frequency for a specific vulnerability in a specific environment has historically required expert judgment for every finding. Onam automates the inputs where data is available.

**Threat probability from KEV and EPSS.** The CISA Known Exploited Vulnerabilities (KEV) catalog identifies vulnerabilities that have been actively exploited in the wild. FIRST's Exploit Prediction Scoring System (EPSS) provides a 30-day probability that a given CVE will be exploited. For a CVE on the KEV list with EPSS above 0.5, we set the threat event frequency high — this is a vulnerability attackers are actively targeting. For a CVE with EPSS below 0.01, the frequency is set low regardless of CVSS score.

**Vulnerability score from compensating controls.** A CVSS 9.1 vulnerability behind a WAF that blocks known exploit patterns is harder to exploit than the same vulnerability with no WAF. A public-facing resource is more vulnerable than one protected by VPN. Onam maps each finding's network exposure, WAF configuration, and authentication state to adjust the vulnerability component of the FAIR model.

**Loss magnitude from industry benchmarks.** IBM Cost of a Data Breach and Ponemon Institute publish per-record breach cost estimates by industry:

| Industry | Cost per exposed record |
| --- | --- |
| Healthcare | $499 |
| Financial services | $183 |
| Retail | $105 |

For a finding that exposes customer PII, Onam uses the record count (or an estimate based on database size), the industry classification, and the data sensitivity tier to compute a baseline loss magnitude.

![Risk quantification in the Onam console (demo account)](/screenshots/screenshot-risk.png)

## Regulatory fine projections

Secondary losses from regulatory exposure are often larger than primary incident response costs. Onam projects three regulatory fine structures for findings that involve personal data:

| Framework | Fine structure |
| --- | --- |
| GDPR | Up to €20M or 4% of global annual revenue, whichever is greater — a €2M cap per incident for a mid-size SaaS company with €50M revenue |
| HIPAA | $1.9M per violation category per year for wilful neglect; settlements for large breaches have reached $16M (Anthem) and $5.5M (Memorial Healthcare System) |
| PCI-DSS | $5,000–$500,000 per month for non-compliance, plus per-transaction liability after a breach; post-breach assessments average $1.2M for mid-tier merchants |

These fine projections are added to the loss magnitude estimate and allocated to each finding that contributes to the regulatory exposure. A single RDS database with unencrypted customer PII carries not just the breach cost of the records it contains, but a proportional share of the potential regulatory liability.

## Crown jewel risk multipliers

Standard FAIR analysis treats all resources of a given type equivalently. Crown jewel analysis applies multipliers that reflect the actual business value of specific resources.

A resource is designated as a crown jewel — and its risk magnitude multiplied — based on:

- Whether it is tagged as production and sensitive.
- Whether it is the endpoint of attack paths that reach other high-value resources.
- Whether it processes financial transactions, health records, or PII at scale.
- Whether it hosts intellectual property — source code, model weights, proprietary datasets.

The multiplier for a crown jewel finding ranges from 2x to 10x the base loss magnitude, depending on how central the resource is to your business operations and the sensitivity of the data it holds.

## Converting a finding list into a ranked remediation queue

The practical output of FAIR analysis is a dollar-ranked remediation queue. Instead of forty Critical findings and eighty High findings sorted by CVSS, you get a ranked list where each item has:

- **Annualised Loss Exposure (ALE)** — expected loss per year if this finding is not remediated.
- **Remediation cost estimate** — person-hours and infrastructure cost to fix.
- **Risk reduction ratio** — ALE divided by remediation cost: the return on security investment.
- **Regulatory exposure** — the portion of ALE attributable to regulatory fine risk.

A finding with ALE of $2.4M and a two-hour fix should be done today. A finding with ALE of $15K and three weeks of re-architecture goes on the backlog. A CVSS 9.1 finding on a development sandbox with ALE of $800 should be closed as accepted risk with a documented exception.

> This reordering often surprises security teams. The highest-ALE finding is rarely the highest-CVSS finding. It is frequently a Medium-severity misconfiguration — an S3 bucket with misconfigured access logging, an RDS instance missing encryption at rest — on a resource that never received attention because its CVSS score never made it to the top of the queue.

## Making the business case to engineering management

Security teams have historically struggled to translate findings into language that resonates with engineering managers and financial stakeholders. "We have a Critical finding" does not answer the question an engineering manager is actually asking: "What is the cost of not fixing this right now compared to shipping the feature we have committed to?"

FAIR makes this conversation tractable. "If this finding is not remediated in the next 30 days, our expected annual loss from this single exposure is $1.8M, of which $600K is attributable to GDPR fine risk. The fix is a two-hour IAM policy change. The return on that two hours is $1.8M in expected loss avoided." That is a conversation an engineering manager can act on.

The goal of FAIR is not to produce a precise dollar figure — the uncertainty ranges in the model make that clear. It is to produce a defensible, data-grounded estimate that turns security prioritisation from an argument about severity scores into a business decision with quantified stakes.
`,
  },
  {
    slug: "kubernetes-rbac-pitfalls",
    title: "Kubernetes RBAC pitfalls that grant cluster-admin by accident",
    category: "Containers",
    excerpt:
      "Kubernetes RBAC pitfalls: a ClusterRoleBinding here, an aggregated role there, and a read-only role can mount the host filesystem. Six patterns to audit.",
    author: "poonam-yadav",
    date: "June 10, 2026",
    readTime: "6 min",
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
  },
  {
    slug: "why-cloud-iam-permissions-are-never-used",
    title: "Why 90% of cloud IAM permissions are never used — and why that matters",
    category: "Identity",
    excerpt:
      "Your IAM policies are accumulating unused permissions faster than your team can audit them. Here's what the data shows and how to close the gap.",
    author: "poonam-yadav",
    date: "May 28, 2026",
    readTime: "8 min",
    body: `
Every cloud security team has the same conversation at some point: "We have too many IAM policies to audit manually." What they rarely say out loud is that the vast majority of the permissions in those policies have never been used once.

Across the cloud accounts we analyse, **more than 90% of granted IAM permissions are never exercised in a 90-day window.** For AWS, that figure is consistent across account sizes, industries, and engineering team maturity. It is not a failure of individual teams — it is the natural consequence of how cloud IAM actually works in practice.

![The IAM security view in the Onam console (demo account)](/screenshots/screenshot-iam.png)

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

CIEM (Cloud Infrastructure Entitlement Management) addresses this by computing the least-privilege gap — the difference between what an identity is permitted to do and what it actually does. The process has three steps.

**1. Effective permission resolution.** Attached policies alone do not tell you what a principal can actually do. Service Control Policies (SCPs) at the organization level can restrict what managed policies allow. Permission boundaries limit IAM users and roles. Resource-based policies on S3 buckets or KMS keys can grant access that is not reflected in identity-based policies. CIEM resolves all of these layers into a single effective permission set.

![How effective permissions are resolved from identity policies, boundaries, SCPs, and resource policies](/diagrams/feat-ciem-effective-perms.svg)

**2. Usage analysis from activity logs.** CloudTrail records every API call made in your AWS account. CIEM reads these logs — or their equivalents on Azure, GCP, and the other supported clouds — and builds a map of which permissions were exercised, by which identity, and when. A permission that appears in the effective permission set but has not appeared in any CloudTrail event in 90 days is flagged as unused.

**3. Least-privilege policy generation.** For each identity with unused permissions, CIEM can generate a suggested replacement policy that contains only the permissions that were actually used. This gives engineers a concrete, actionable change rather than an abstract "reduce permissions" recommendation.

## The numbers in practice

Across accounts we have analysed, the average gap between granted and used permissions breaks down as follows:

| Identity type | Granted permissions unused |
| --- | --- |
| Service accounts (Lambda, ECS, EC2 instance profiles) | 94% |
| Cross-account roles | 91% |
| Human IAM users | 87% |
| Federated identities (SAML, OIDC) | 83% |

The highest gap is consistently in service accounts — the identities most often forgotten after the feature they were created for is deployed and the team moves on to the next thing.

## What to do about it

The goal is not to achieve zero unused permissions immediately. That would require rewriting every IAM policy in your account simultaneously, which is operationally infeasible and will break things. Instead:

**Start with the highest-risk identities.** Shadow admins — identities that can reach admin-level access without holding an admin role — are the highest priority. A service account that can assume a role that can assume another role with \`iam:*\` permissions is a three-hop privilege escalation path. CIEM surfaces these chains; fix them first.

**Enforce for new identities.** The easiest permission to remediate is one that was never granted. Add a review gate to your IAM policy creation process that requires justification for any permission that has not been used in the last 90 days in a similar role. This does not fix existing debt, but it stops new debt from accumulating.

**Automate the generation, not the application.** CIEM can generate least-privilege replacement policies automatically. Do not apply them automatically — have a human review the suggestion for operational correctness before switching. What looks unused over 90 days may be used on a quarterly or annual cycle.

> The cost of a false-positive access removal is a production incident. Generate automatically, apply carefully.

The 90% figure is not a problem you can fix in a sprint. It is a long-running hygiene practice, and the right tool makes continuous progress measurable instead of invisible.
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
MITRE ATT&CK for Cloud is a framework that catalogues the tactics, techniques, and procedures (TTPs) that adversaries use to attack cloud environments. It is maintained by MITRE, peer-reviewed by threat intelligence teams at major security vendors, and updated as new cloud attack techniques are observed in the wild.

Most discussions of MITRE ATT&CK treat it as an abstract threat intelligence reference. This post is about something more practical: how individual ATT&CK techniques translate into specific cloud misconfigurations that a CSPM tool can detect and score — and what that means for how you should read your posture score.

## How ATT&CK for Cloud is structured

ATT&CK for Cloud covers four platforms: AWS, Azure, GCP, and Office 365. Each platform has a matrix of tactics (the adversary's goal) and techniques (the method used to achieve that goal).

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

When we assign a posture score to your cloud environment, each rule that contributes to the score is tagged with the ATT&CK techniques it relates to. A score of 87 out of 100 means 13% of your rules are failing — but it also means there is a specific set of ATT&CK techniques whose preconditions are currently satisfied in your environment.

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

It is a reasonable question. Most security tools that claim "agentless" operation are either scanning at a shallow level, missing entire service categories, or quietly requiring agents for the rules that actually matter. This post explains exactly how Onam's agentless architecture works across all seven supported clouds — AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud, and Kubernetes — and where its limits are.

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

Each rule in Onam's library is a declarative check against one or more attributes in the normalised resource schema. The check returns PASS, FAIL, or NOT_APPLICABLE.

A rule like "S3 buckets must have server-side encryption enabled" evaluates the \`encryption.rules[0].apply_server_side_encryption_by_default.sse_algorithm\` attribute in the normalised S3 bucket schema. If the attribute is present and set to AES256 or aws:kms, the rule passes. If it is absent or set to NONE, it fails.

Rules are authored in YAML — a human-readable format that non-engineers can review. Each rule specifies:

- The resource type it applies to.
- The condition expression that determines PASS or FAIL.
- The severity (Critical, High, Medium, Low, Info) and compliance framework mappings.
- The remediation steps — CLI, Terraform, console.

This YAML-first approach means adding a new rule for a new cloud service does not require changes to the core evaluation engine — just a new YAML file with the right schema.

## Network topology requires cross-resource correlation

Simple single-resource checks — is this bucket encrypted? is MFA enabled for this user? — can be evaluated purely from the resource's own configuration. But effective network exposure — whether a resource is actually reachable from the internet — requires correlating multiple resources.

Determining whether an EC2 instance is internet-accessible requires knowing: is it in a public subnet? Does its subnet's route table have a route to an internet gateway? Do the NACLs on that subnet allow inbound traffic on the relevant port? Does the security group allow inbound traffic from 0.0.0.0/0? Is there a load balancer in front of it?

This is why network security analysis runs as a separate phase after discovery, with access to the full normalised resource graph. The graph allows us to traverse VPC, subnet, route table, and internet gateway relationships and compute effective exposure rather than just checking individual resource configurations.

## Where agentless has limits

Agentless works for everything that lives in the cloud control plane. It does not work for everything, and it is worth being precise about the boundaries.

**OS-level vulnerability scanning** requires enumerating installed packages and kernel versions — information that is not exposed by cloud APIs. For EC2 instances, this requires a lightweight agent, deployed via AWS Systems Manager. Container image scanning, by contrast, can be done agentlessly by pulling and analysing the image from the registry.

**Runtime workload behavior** — what processes are running, what network connections are active, what system calls a container is making — requires an agent or eBPF-based monitor running on the host. CSPM rule evaluation covers the configuration surface; runtime behavior is a different, complementary layer.

**Data plane access patterns** — reading the actual contents of S3 objects, database rows, or file system data — is not something Onam does. Data classification is based on metadata signals: naming patterns, tags, schema metadata, and resource configuration. This is sufficient for most DSPM use cases, but it will not detect sensitive data stored in an unexpectedly named bucket.

## Why agentless matters for security teams

The operational argument for agentless is usually framed around deployment complexity: no agents to install, no software versions to manage, no compatibility issues with operating systems. That is true, but there is a more important argument.

Agents expand your attack surface. An agent running on every EC2 instance in your fleet is a piece of software with elevated privileges that needs to be patched, monitored, and secured. If the agent itself has a vulnerability — and security tool agents have had plenty — every host it runs on is at risk.

> An agentless scanner that never touches your hosts has exactly zero footprint to exploit.

For organisations that operate in regulated environments — healthcare, financial services, government — this is not an abstract concern. It is a compliance question: does this tool expand my system boundary in a way that requires additional controls? Agentless architecture answers that question with a clear no.

To see the scan pipeline against one of your own accounts, [book a demo](/request-demo).
`,
  },
];

export const BLOG_CATEGORIES = Array.from(new Set(BLOG_POSTS.map((p) => p.category)));

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
