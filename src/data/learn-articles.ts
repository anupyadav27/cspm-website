/**
 * Educational "what is X" articles targeting informational head queries.
 *
 * SEO shape, deliberate and consistent across every entry:
 *  - `question` becomes the H1 and matches the query verbatim ("What is CSPM?")
 *  - `answer` is a 40–60 word standalone definition, placed first on the page.
 *    This is the featured-snippet and AI-citation target — it must make sense
 *    quoted with no surrounding context and must not mention Onam.
 *  - `body` expands with the sub-questions that appear in People Also Ask.
 *  - `faqs` emit FAQPage JSON-LD.
 * Vendor-neutral by design: pages that read as product pages do not get cited.
 */

export type LearnFaq = { q: string; a: string };

export type LearnArticle = {
  slug: string;
  /** H1 — phrased exactly as the target query. */
  question: string;
  /** <title> — may differ from the H1 to fit modifiers. */
  title: string;
  /** Meta description. */
  excerpt: string;
  /** Acronym expansion shown under the H1. */
  term: string;
  /** The 40–60 word snippet-target definition. */
  answer: string;
  readTime: string;
  body: string;
  faqs: LearnFaq[];
  related: { label: string; href: string }[];
};

export const LEARN_ARTICLES: LearnArticle[] = [
  {
    slug: "cspm",
    question: "What is CSPM (Cloud Security Posture Management)?",
    title: "What is CSPM? Cloud Security Posture Management Explained",
    excerpt:
      "CSPM continuously checks cloud infrastructure for misconfigurations and compliance drift. A plain-English explanation of how it works, what it catches, what it misses, and how it differs from CNAPP, CWPP and CIEM.",
    term: "Cloud Security Posture Management",
    answer:
      "Cloud Security Posture Management (CSPM) is the continuous, automated inspection of cloud infrastructure configuration for misconfigurations, policy violations and compliance drift. It reads cloud provider APIs to evaluate resources — storage buckets, databases, security groups, IAM roles — against a rule set, then reports what is misconfigured and how to fix it.",
    readTime: "7 min",
    body: `
## Why CSPM exists

Cloud breaches are rarely sophisticated. The overwhelming majority start with something mundane: a storage bucket left public, a database reachable from the internet, a security group opened to 0.0.0.0/0 during a debugging session, an IAM role that accumulated permissions nobody removed.

None of this is caused by careless engineers. It is caused by scale and speed. A single team can create hundreds of cloud resources in a week, each with dozens of configuration options and defaults that were never designed to be secure — they were designed to work. Manual review cannot keep pace, and annual audits find problems roughly 360 days too late.

CSPM automates that review and runs it continuously.

## How CSPM works

Every CSPM tool follows the same four steps:

1. **Connect** — a read-only credential is granted in the cloud account: an IAM role on AWS, a service principal on Azure, a service account on GCP. No agent is installed.
2. **Discover** — the tool enumerates every resource across every region and account through the provider's APIs, building an inventory.
3. **Evaluate** — each resource is checked against a rule catalog. Rules are deterministic and binary: a bucket either blocks public access or it does not.
4. **Report and remediate** — failures become findings, ranked by severity, mapped to the compliance frameworks they violate, and paired with remediation steps.

The critical word is *continuous*. A scan that runs quarterly is an audit. CSPM re-evaluates as infrastructure changes, so a misconfiguration introduced on Tuesday surfaces on Tuesday.

## What CSPM catches

| Category | Typical findings |
| --- | --- |
| Storage exposure | Public buckets, unencrypted volumes, snapshots shared outside the account |
| Network exposure | Security groups open to the internet, management ports reachable, missing WAF |
| Identity | Root account in use, MFA not enforced, over-permissive policies, stale access keys |
| Encryption | Provider-managed keys where customer-managed is required, no key rotation, expired certificates |
| Logging | Audit logging disabled, flow logs off, retention below policy |
| Resilience | No backups, deletion protection off, single-AZ production databases |

## What CSPM does not catch

This is where most evaluations go wrong. CSPM reads *configuration*. It does not see:

- **What is running inside a workload.** An EC2 instance can be perfectly configured and still run an unpatched OpenSSL. That is [CWPP](/learn/cwpp).
- **What the data actually is.** CSPM sees an encrypted bucket, not that it holds 800,000 customer records. That is [DSPM](/learn/dspm).
- **Effective permissions.** CSPM reads a policy document; it does not resolve what a principal can actually do after role chaining, SCPs and permission boundaries. That is [CIEM](/learn/ciem).
- **Behaviour.** A valid credential used at 3am from a new country is not a misconfiguration. That is cloud detection and response.
- **Chains.** CSPM produces a list. It does not tell you that finding #47 plus finding #212 equals a path from the internet to your database. That is [attack path analysis](/learn/cloud-attack-path).

A CSPM tool that reports 4,000 findings with no chaining hands you a spreadsheet, not a priority.

## CSPM vs CNAPP vs CWPP vs CIEM

CSPM was the first category to exist, which is why the terms are often used loosely. The relationship is nesting, not competition:

- **CSPM** — configuration posture.
- **[CWPP](/learn/cwpp)** — the workloads themselves.
- **[CIEM](/learn/ciem)** — identity and effective permissions.
- **[DSPM](/learn/dspm)** — the data and its exposure.
- **[CNAPP](/learn/cnapp)** — the umbrella that runs all of the above on one data model.

Buying these as four products from four vendors reproduces the problem they were meant to solve: four consoles, four severity scales, and no correlation between them.

## What to look for in a CSPM tool

- **Rule depth per cloud, not cloud count.** "Supports 6 clouds" often means full depth on two and a token integration on the rest. Ask for the rule count per provider.
- **Agentless.** If it needs an agent for posture, coverage will stall at whatever percentage the platform team tolerates.
- **Remediation, not just detection.** A finding without a specific fix for that specific resource is a ticket nobody actions.
- **Framework mapping.** One finding should update every framework it affects at once.
- **Correlation with identity and data context.** Severity alone is a poor proxy for risk.

## Next steps

- [How Onam implements CSPM](/platform/cspm) — 9,853 posture rules across seven clouds
- [What is CNAPP?](/learn/cnapp) — the umbrella category
- [What is a cloud attack path?](/learn/cloud-attack-path) — why finding lists are not priorities
`,
    faqs: [
      {
        q: "What does CSPM stand for?",
        a: "CSPM stands for Cloud Security Posture Management. It is the continuous automated inspection of cloud infrastructure configuration for misconfigurations, policy violations and compliance drift.",
      },
      {
        q: "What is the difference between CSPM and CNAPP?",
        a: "CSPM covers configuration posture only. CNAPP is the umbrella category that combines CSPM with workload protection (CWPP), identity analysis (CIEM), data security (DSPM) and runtime detection on a single data model. CSPM is a component of CNAPP, not an alternative to it.",
      },
      {
        q: "Does CSPM require agents?",
        a: "No. CSPM reads configuration through cloud provider APIs using read-only credentials, so no software is installed on any workload. Some vendors add optional agents for runtime telemetry, but posture assessment itself is agentless.",
      },
      {
        q: "Is CSPM the same as a compliance tool?",
        a: "They overlap but are not the same. CSPM detects misconfigurations regardless of whether a framework mentions them; a compliance tool reports pass rates against specific control catalogs. Most CSPM tools map findings to frameworks like CIS, NIST and PCI-DSS, which is how one scan produces evidence for many frameworks at once.",
      },
      {
        q: "How often should CSPM scans run?",
        a: "Continuously. The value of CSPM over a periodic audit is that a misconfiguration introduced today is detected today. Most platforms run discovery continuously and re-evaluate rules on every change, rather than on a nightly or weekly batch.",
      },
    ],
    related: [
      { label: "What is CNAPP?", href: "/learn/cnapp" },
      { label: "What is CIEM?", href: "/learn/ciem" },
      { label: "Onam CSPM", href: "/platform/cspm" },
      { label: "Onam on AWS, Azure, GCP and four more clouds", href: "/solutions" },
      { label: "How Onam compares to Wiz, Orca and Prisma Cloud", href: "/compare" },
    ],
  },

  {
    slug: "cnapp",
    question: "What is CNAPP (Cloud-Native Application Protection Platform)?",
    title: "What is CNAPP? Cloud-Native Application Protection Explained",
    excerpt:
      "CNAPP unifies CSPM, CWPP, CIEM and DSPM on one data model instead of four consoles. What the category actually means, why it emerged, and how to tell a real CNAPP from a bundle of acquisitions.",
    term: "Cloud-Native Application Protection Platform",
    answer:
      "A Cloud-Native Application Protection Platform (CNAPP) is a single platform that combines cloud posture management, workload protection, identity entitlement analysis, data security and runtime threat detection on one shared data model — so risks that span those domains are correlated rather than reported separately.",
    readTime: "7 min",
    body: `
## Why the category exists

By around 2021 a typical cloud security stack had four or five tools: a posture scanner, a workload scanner, an identity analyser, a data classifier, and something watching logs. Each was competent. Together they were close to useless for answering the only question that matters — *what should we fix first?*

The reason is that risk in cloud environments is almost never contained within one tool's domain. A real incident looks like this:

> A container image has a known CVE (workload tool). The container runs with a service account that can assume a role (identity tool). That role can read a storage bucket (posture tool). The bucket holds customer PII (data tool). The container is reachable from the internet (network tool).

Five tools each hold one fact. Each fact on its own is a medium-severity finding that sits in a queue for months. Together they are a critical breach path. No individual tool can see it, and no human reliably assembles it by hand across five consoles.

CNAPP is the response: put every signal on one data model so the chain is computable.

## What a CNAPP includes

| Component | What it answers |
| --- | --- |
| [CSPM](/learn/cspm) | Is the infrastructure configured correctly? |
| [CWPP](/learn/cwpp) | Are the running workloads hardened and patched? |
| [CIEM](/learn/ciem) | Who can actually do what, and do they still need it? |
| [DSPM](/learn/dspm) | Where is the sensitive data and who can reach it? |
| [Attack path analysis](/learn/cloud-attack-path) | Which combinations actually reach something valuable? |
| Runtime detection (CDR) | Is something happening right now? |
| Code security (SAST/DAST/SCA/IaC) | Are we shipping the problem in the first place? |

Increasingly [SSPM](/learn/sspm) belongs here too, since the identity that compromises a SaaS tenant is usually the same identity that federates into the cloud account.

## Real CNAPP vs. a bundle

Many products marketed as CNAPP are several acquisitions behind one login page. The distinction is not marketing pedantry — it determines whether you get correlation or just consolidated billing. Tests that separate the two:

1. **One severity scale?** If the posture module says "high" and the vulnerability module says "7.5" and nothing reconciles them, the data models are separate.
2. **Does a finding in module A change the ranking in module B?** In a real CNAPP, a bucket holding PII raises the priority of the IAM finding that grants access to it. In a bundle, they never speak.
3. **Is there one asset inventory?** If each module discovers resources independently, you will find the same instance counted differently in two places.
4. **Can it show a path, not a list?** Chaining across domains is only possible on a shared graph.
5. **One onboarding?** If enabling the data module requires a second set of credentials and a second scan, it is a separate product.

## The posture score problem

Most CNAPPs produce a single score. Treat it carefully. A score is useful for trend ("are we improving?") and useless for action ("what do I do Monday?"). A good implementation lets the score decompose all the way down — score to pillar to finding to resource to remediation. A score that cannot be decomposed is a vanity metric.

## Does CNAPP replace everything else?

No. CNAPP does not replace a SIEM, an EDR on employee laptops, or your identity provider. It replaces the cluster of cloud-specific point tools that were each solving one slice of cloud risk, and it does so specifically because those slices are not independent.

## Next steps

- [How Onam implements CNAPP](/platform/cnapp) — seven scored pillars on one graph
- [What is CSPM?](/learn/cspm)
- [What is a cloud attack path?](/learn/cloud-attack-path)
`,
    faqs: [
      {
        q: "What does CNAPP stand for?",
        a: "CNAPP stands for Cloud-Native Application Protection Platform. The term was introduced by Gartner to describe platforms that unify cloud posture, workload, identity and data security rather than selling them as separate tools.",
      },
      {
        q: "What is the difference between CNAPP and CSPM?",
        a: "CSPM is one component of CNAPP. CSPM checks infrastructure configuration; CNAPP additionally covers workloads, identity entitlements, data exposure and runtime threats, and correlates all of them on a single data model so cross-domain attack paths become visible.",
      },
      {
        q: "Do I need CNAPP if I already have CSPM?",
        a: "If your CSPM produces long finding lists that nobody can prioritise, that is the specific problem CNAPP addresses. CSPM tells you what is misconfigured; CNAPP tells you which misconfigurations combine with identity, data and workload facts to create a real path to something valuable.",
      },
      {
        q: "Is CNAPP agentless?",
        a: "The posture, identity and data components are agentless everywhere. Workload coverage varies by vendor — some require an agent, others use snapshot-based agentless scanning that analyses a point-in-time copy of the volume without running anything on the workload.",
      },
    ],
    related: [
      { label: "What is CSPM?", href: "/learn/cspm" },
      { label: "What is CWPP?", href: "/learn/cwpp" },
      { label: "Onam CNAPP", href: "/platform/cnapp" },
      { label: "Onam on AWS, Azure, GCP and four more clouds", href: "/solutions" },
      { label: "How Onam compares to Wiz, Orca and Prisma Cloud", href: "/compare" },
    ],
  },

  {
    slug: "cwpp",
    question: "What is CWPP (Cloud Workload Protection Platform)?",
    title: "What is CWPP? Cloud Workload Protection Explained",
    excerpt:
      "CWPP secures the workloads themselves — VMs, containers, serverless functions and hosts — rather than the cloud configuration around them. How it works, agent vs agentless, and how it differs from CSPM.",
    term: "Cloud Workload Protection Platform",
    answer:
      "A Cloud Workload Protection Platform (CWPP) secures the compute workloads running in a cloud environment — virtual machines, containers, serverless functions and managed hosts — by inspecting what is installed and running inside them, rather than how the surrounding cloud infrastructure is configured.",
    readTime: "6 min",
    body: `
## The gap CWPP fills

[CSPM](/learn/cspm) looks at a virtual machine and sees a resource: its security group, its IAM role, whether its volume is encrypted. All of that can be correct while the machine itself is indefensible — running a three-year-old kernel, an unpatched OpenSSL, an SSH key baked into the base image, and a service listening on a port nobody documented.

Configuration is the door. The workload is the room. CWPP is the only category that opens the room.

## What counts as a workload

CWPP is deliberately broad, because "compute" stopped meaning "server" a long time ago:

- **Virtual machines** — EC2, Azure VMs, GCE, OCI Compute
- **Containers** — images in registries and containers actually running in EKS, AKS, GKE, OKE, ACK
- **Serverless** — Lambda, Azure Functions, Cloud Functions, including runtime versions and execution roles
- **Managed hosts** — anything the provider runs on your behalf where you still own the configuration inside

A tool that covers containers but not serverless is not a CWPP; it is container security.

## What CWPP checks

| Area | Examples |
| --- | --- |
| Vulnerabilities | Installed packages matched against CVE feeds, with exploitability context |
| OS hardening | CIS benchmarks for Ubuntu, RHEL, SUSE, Debian, CentOS |
| Container posture | Privileged containers, hostPath mounts, running as root, stale images |
| Serverless posture | End-of-support runtimes, over-permissive execution roles, secrets in environment variables |
| Secrets on disk | Credentials, private keys and tokens sitting in the filesystem |
| Runtime behaviour | Process, file and network activity, where the vendor supports it |

## Agent vs agentless

This is the decision that determines whether a CWPP rollout succeeds.

**Agent-based** installs software on every workload. It gives continuous runtime telemetry — process execution, syscalls, live network connections — which snapshot scanning cannot replicate. The cost is real: a package to distribute, a version to maintain, a rollout plan, an exception list for machines that break, and a recurring negotiation with the platform team. Coverage commonly plateaus well short of 100%, and the uncovered remainder is usually the legacy estate that most needs scanning.

**Agentless** takes a point-in-time snapshot of the workload's volume and analyses it out-of-band. Coverage is complete on day one because there is nothing to install, and there is zero performance impact. The trade-off is that it is point-in-time: it will not show you a process that spawned and exited between scans.

Most mature programmes use agentless as the coverage baseline and add runtime detection from cloud-native audit and flow logs, reserving agents for the small set of workloads that genuinely need live process telemetry.

## CWPP vs CSPM vs container security

- **CSPM** — the cloud configuration around the workload.
- **CWPP** — everything inside the workload, across every compute form factor.
- **Container security** — the container-specific slice: images, registries, Kubernetes RBAC, admission control. It is a subset of CWPP, not a synonym.

## Next steps

- [How Onam implements CWPP](/platform/cwpp) — VMs, containers, serverless and hosts, agentlessly
- [What is agentless cloud security?](/learn/agentless-cloud-security)
- [What is CNAPP?](/learn/cnapp)
`,
    faqs: [
      {
        q: "What does CWPP stand for?",
        a: "CWPP stands for Cloud Workload Protection Platform — security for the compute workloads themselves (virtual machines, containers, serverless functions and hosts), as distinct from the cloud infrastructure configuration around them.",
      },
      {
        q: "What is the difference between CWPP and CSPM?",
        a: "CSPM inspects cloud configuration — security groups, IAM policies, encryption settings. CWPP inspects what is actually installed and running inside the workload — packages, vulnerabilities, OS hardening, secrets on disk. A workload can pass every CSPM check and still be trivially exploitable.",
      },
      {
        q: "Does CWPP require an agent?",
        a: "Not necessarily. Agentless CWPP uses point-in-time volume snapshots analysed out-of-band, giving complete coverage with no software on the workload. Agents add continuous runtime telemetry but historically stall short of full coverage because every workload needs the agent installed and maintained.",
      },
      {
        q: "Is container security the same as CWPP?",
        a: "No. Container security covers images, registries, Kubernetes RBAC and admission policy. CWPP is the umbrella across every compute form factor, including the virtual machines and serverless functions that are not containers at all.",
      },
    ],
    related: [
      { label: "What is agentless cloud security?", href: "/learn/agentless-cloud-security" },
      { label: "What is CNAPP?", href: "/learn/cnapp" },
      { label: "Onam CWPP", href: "/platform/cwpp" },
      { label: "Onam on AWS, Azure, GCP and four more clouds", href: "/solutions" },
      { label: "How Onam compares to Wiz, Orca and Prisma Cloud", href: "/compare" },
    ],
  },

  {
    slug: "ciem",
    question: "What is CIEM (Cloud Infrastructure Entitlement Management)?",
    title: "What is CIEM? Cloud Entitlement Management Explained",
    excerpt:
      "CIEM resolves what identities can actually do in a cloud environment — after role chaining, SCPs and permission boundaries — and compares it against what they actually used. How it works and why policy review is not enough.",
    term: "Cloud Infrastructure Entitlement Management",
    answer:
      "Cloud Infrastructure Entitlement Management (CIEM) determines the effective permissions of every identity in a cloud environment — human users, service accounts and machine identities — after policies, role chains, service control policies and permission boundaries are resolved, then compares that against permissions actually used.",
    readTime: "6 min",
    body: `
## Why reading policies is not enough

Ask most teams who can delete the production database and you will get a confident answer that is wrong. Not because anyone is careless, but because cloud permissions do not resolve the way people read them.

A single effective permission can be the product of an identity policy, a resource policy, a permissions boundary, a service control policy, a session policy, and two or three role assumptions in between. Any one of those can grant or deny. Reading the attached policy on a role tells you almost nothing about what that role can reach.

CIEM computes the answer instead of reading it.

## The two questions CIEM answers

**1. What can this identity actually do?**

Full resolution across the identity graph — including transitive access. If role A can assume role B, and role B can read the production bucket, then role A can read the production bucket. This is where cross-account trust chains and federation hops matter, and where most privilege escalation actually lives.

**2. What did it actually do?**

Effective permissions are compared against real usage from cloud audit logs, typically over a 90-day window. The gap between granted and used is the excess.

That gap is consistently enormous. Industry analyses repeatedly find that the large majority of granted cloud permissions are never exercised. Every unused permission is attack surface with no operational benefit — a door that exists solely because someone attached a broad policy on a Friday and nothing ever removed it.

## What CIEM finds

- Identities with administrative access that has never been used
- Roles that can be assumed by overly broad principals, including wildcards
- Cross-account trust relationships nobody remembers creating
- Service accounts with human-grade permissions
- Stale credentials and access keys that outlived the person or workload
- Privilege escalation paths — permission sets that let an identity grant itself more
- Federation hops where an identity provider account unlocks cloud access

## CIEM vs IAM

IAM is the cloud provider's system for defining identities and policies. It is the mechanism. CIEM is the analysis layer on top: it does not create permissions, it works out what the permissions you already created actually mean in aggregate, and which of them are unnecessary.

Native IAM tooling shows you what a policy says. CIEM shows you what it does.

## Where CIEM fits

CIEM is one of the highest-value inputs to [attack path analysis](/learn/cloud-attack-path), because identity is how attackers move. A vulnerability gets an attacker onto one machine; entitlements determine whether that is a contained incident or a full compromise. That is why identity findings and posture findings need to sit on the same graph rather than in separate tools.

## Next steps

- [How Onam implements CIEM](/platform/ciem) — effective permissions across seven clouds
- [What is a cloud attack path?](/learn/cloud-attack-path)
- [What is CNAPP?](/learn/cnapp)
`,
    faqs: [
      {
        q: "What does CIEM stand for?",
        a: "CIEM stands for Cloud Infrastructure Entitlement Management. It is pronounced 'kim'. CIEM resolves and analyses the effective permissions of every identity in a cloud environment.",
      },
      {
        q: "What is the difference between CIEM and IAM?",
        a: "IAM is the cloud provider's mechanism for defining identities and attaching policies. CIEM is an analysis layer that computes what those policies actually permit once role chains, service control policies and permission boundaries are resolved, and compares that against what was actually used.",
      },
      {
        q: "What is the difference between CIEM and PAM?",
        a: "PAM (Privileged Access Management) controls and brokers access to privileged accounts, typically with vaulting and session recording. CIEM analyses entitlements already granted in cloud environments to find excess and escalation paths. PAM is a control; CIEM is an assessment.",
      },
      {
        q: "How does CIEM know which permissions are unused?",
        a: "By reading cloud audit logs — CloudTrail, Azure Activity Log, GCP Cloud Audit Logs — over a rolling window, usually 90 days, and comparing the actions actually taken against the full set the identity is entitled to take.",
      },
    ],
    related: [
      { label: "What is a cloud attack path?", href: "/learn/cloud-attack-path" },
      { label: "What is CSPM?", href: "/learn/cspm" },
      { label: "Onam CIEM", href: "/platform/ciem" },
      { label: "Onam on AWS, Azure, GCP and four more clouds", href: "/solutions" },
      { label: "How Onam compares to Wiz, Orca and Prisma Cloud", href: "/compare" },
    ],
  },

  {
    slug: "dspm",
    question: "What is DSPM (Data Security Posture Management)?",
    title: "What is DSPM? Data Security Posture Management Explained",
    excerpt:
      "DSPM finds where sensitive data lives across cloud storage, classifies it, and works out who can reach it. How classification works, why encryption-at-rest is not the answer, and how DSPM differs from CSPM and DLP.",
    term: "Data Security Posture Management",
    answer:
      "Data Security Posture Management (DSPM) discovers where sensitive data resides across cloud storage, databases and warehouses, classifies it by sensitivity, and determines which identities and network paths can reach it — shifting the security question from how a store is configured to what is actually inside it and who can read it.",
    readTime: "6 min",
    body: `
## The problem DSPM solves

Most organisations cannot answer a simple question: where is our customer data?

Not because nobody cares, but because data sprawls faster than anyone documents it. One production database becomes a database, three read replicas, four analytics warehouses, a dozen buckets holding exports, a data lake, a Snowflake stage, and a caching layer somebody stood up for a demo. Every copy is a copy of the risk, and no map exists — until an auditor, a regulator or a breach demands one.

## Why "encrypted at rest" is a weak answer

Compliance reports routinely show 100% encryption at rest. It is usually true and frequently irrelevant.

Encryption at rest protects against one specific threat: someone physically obtaining the storage medium. It does nothing about the far likelier scenario — a legitimate credential reading the data through the API exactly as designed. If the key is a provider-managed key that every principal in the account can use, "encrypted" is a checkbox, not a control.

DSPM asks the better questions: what is in this store, who can read it, and is any path to it reachable from outside?

## How DSPM works

1. **Discover** every data store across the estate — object storage, managed databases, warehouses, file systems, backups and snapshots.
2. **Classify** what each one holds. Sensitivity labels typically cover PII, PHI, PCI cardholder data, credentials and intellectual property.
3. **Map access** by joining classification with the identity graph, so you know exactly which principals can read or write each store.
4. **Assess exposure** by layering network reachability on top — a technically encrypted bucket that is publicly reachable is exposed.
5. **Monitor** continuously, because new datasets and permission changes appear constantly.

## Metadata vs content classification

Vendors split into two approaches, and the distinction matters for procurement and privacy review.

**Content-based** classification reads the data and pattern-matches on it. It is the more precise method and the more invasive one: it requires read access to the actual records, and often means data leaves your environment.

**Metadata-based** classification infers sensitivity from resource names, tags, schema and column names, storage class and configuration. A table with columns \`ssn\` and \`date_of_birth\`, or a bucket named \`customer-pii-exports\`, is a high-confidence classification without anyone reading a row. It is less precise on ambiguous stores, but it never touches the underlying data — which is often the deciding factor for regulated environments.

## DSPM vs CSPM vs DLP

- **[CSPM](/learn/cspm)** — is the store configured correctly?
- **DSPM** — what is in the store, and who can reach it?
- **DLP** — is data leaving through a channel it should not?

DSPM is the context layer that makes the other two useful. A public bucket is a medium finding; a public bucket holding 800,000 PII records is an incident. Same misconfiguration, entirely different priority — and only DSPM knows the difference.

## Next steps

- [How Onam implements DSPM](/platform/data-security)
- [What is CSPM?](/learn/cspm)
- [What is CNAPP?](/learn/cnapp)
`,
    faqs: [
      {
        q: "What does DSPM stand for?",
        a: "DSPM stands for Data Security Posture Management — discovering where sensitive data lives across cloud environments, classifying it, and determining who can access it.",
      },
      {
        q: "What is the difference between DSPM and DLP?",
        a: "DLP (Data Loss Prevention) monitors data in motion and blocks it leaving through unauthorised channels. DSPM maps data at rest — where it is, how sensitive it is, and which identities and network paths can reach it. DLP is a control at the boundary; DSPM is an assessment of the estate.",
      },
      {
        q: "Does DSPM read my actual data?",
        a: "It depends on the approach. Content-based classification reads records directly and is more precise but requires access to the data itself. Metadata-based classification infers sensitivity from names, tags, schemas and configuration without reading any content, which many regulated organisations prefer.",
      },
      {
        q: "Why is DSPM needed if data is already encrypted?",
        a: "Encryption at rest protects against physical media theft, not against a legitimate credential reading the data through the API. If the encryption key is usable by every principal in the account, encryption adds little. DSPM answers who can actually decrypt and read the data.",
      },
    ],
    related: [
      { label: "What is CSPM?", href: "/learn/cspm" },
      { label: "What is CIEM?", href: "/learn/ciem" },
      { label: "Onam DSPM", href: "/platform/data-security" },
      { label: "Onam on AWS, Azure, GCP and four more clouds", href: "/solutions" },
      { label: "How Onam compares to Wiz, Orca and Prisma Cloud", href: "/compare" },
    ],
  },

  {
    slug: "sspm",
    question: "What is SSPM (SaaS Security Posture Management)?",
    title: "What is SSPM? SaaS Security Posture Management Explained",
    excerpt:
      "SSPM secures the SaaS platforms your company runs on — Microsoft 365, Google Workspace, GitHub, Snowflake — which cloud CSPM tools never scan. What it covers and why SaaS admin accounts are the softest target you own.",
    term: "SaaS Security Posture Management",
    answer:
      "SaaS Security Posture Management (SSPM) continuously assesses the configuration and identity posture of SaaS applications — such as Microsoft 365, Google Workspace, GitHub and Snowflake — detecting misconfigured sharing settings, unprotected admin accounts, excessive permissions and disabled audit logging.",
    readTime: "6 min",
    body: `
## The blind spot

A cloud security platform will tell you an S3 bucket is public. It will say nothing about:

- A Microsoft 365 global administrator without MFA
- A SharePoint site shared with "anyone with the link"
- A Google Workspace guest account belonging to a contractor who left in 2023
- A Snowflake service account holding ACCOUNTADMIN
- A GitHub organisation with branch protection disabled on the default branch
- Microsoft 365 Unified Audit Log switched off at the tenant level

These are not edge cases. They are among the most commonly exploited footholds in real intrusions, and traditional CSPM scans none of them, because none of them are cloud infrastructure.

## Why SaaS is the softer target

**Identity concentration.** Compromising a Microsoft 365 or Okta administrator usually yields more lateral movement than compromising a virtual machine. SaaS admin accounts sit above the infrastructure, often federate into it, and are frequently protected by nothing more than a password and goodwill.

**Data exfiltration surface.** External sharing settings in SharePoint, OneDrive and Google Drive are one-click paths out of the organisation. No bucket policy check will ever see them.

**Audit gaps.** When audit logging is disabled or retention is set too low, incident response becomes guesswork. These settings are invisible to infrastructure tooling and are rarely reviewed after initial setup.

**Sprawl without procurement.** SaaS is adopted by teams, not by IT. The platform holding your most sensitive customer data may have been signed up for with a corporate card.

## What SSPM checks

| Area | Examples |
| --- | --- |
| Privileged identity | Admins without MFA, standing privilege, missing conditional access |
| External sharing | Anyone-with-link files, external guests, links without expiry |
| Audit configuration | Logging disabled, retention below policy, missing alerting |
| Dormant access | Stale guests, orphaned accounts, unused service principals |
| DevOps posture | Branch protection, token scopes, org membership, third-party OAuth apps |
| Data platform posture | Warehouse roles, network policies, grant sprawl |

## How SSPM connects

Through each platform's official API using read-only, scoped application permissions — Microsoft Graph, Google Admin SDK, GitHub and GitLab app tokens, Snowflake key-pair authentication. There is no agent and no browser extension. A well-built connector requests directory, audit and configuration scopes only, and never message or document contents.

## SSPM vs CSPM vs CIEM

- **[CSPM](/learn/cspm)** — cloud infrastructure configuration
- **SSPM** — SaaS application configuration and identity
- **[CIEM](/learn/ciem)** — effective permissions inside cloud providers

They meet at the identity provider. A SaaS compromise becomes a cloud compromise at the federation hop, which is exactly why keeping SSPM findings in a separate console from cloud findings defeats the purpose.

## Next steps

- [How Onam implements SSPM](/platform/saas-security) — 8 platforms, 433 CIS SaaS rules
- [What is CIEM?](/learn/ciem)
- [What is CNAPP?](/learn/cnapp)
`,
    faqs: [
      {
        q: "What does SSPM stand for?",
        a: "SSPM stands for SaaS Security Posture Management — continuous assessment of the configuration and identity posture of SaaS applications such as Microsoft 365, Google Workspace, GitHub, Okta and Snowflake.",
      },
      {
        q: "What is the difference between SSPM and CSPM?",
        a: "CSPM scans cloud infrastructure — compute, storage, networking, IAM inside AWS, Azure or GCP. SSPM scans the SaaS applications running on top of that infrastructure. A CSPM tool will never see a SharePoint sharing setting or a Microsoft 365 admin without MFA.",
      },
      {
        q: "What permissions does an SSPM tool need?",
        a: "Read-only application permissions scoped to directory, audit and configuration data — for example Microsoft Graph Directory.Read.All and AuditLog.Read.All. A properly built connector never requests write scopes and never reads message or document contents.",
      },
      {
        q: "Is SSPM the same as CASB?",
        a: "No. A CASB sits in the traffic path to broker and control access to cloud services, often via proxy. SSPM connects to the SaaS platform's API to assess how it is configured. CASB is an inline control; SSPM is a posture assessment.",
      },
    ],
    related: [
      { label: "What is CIEM?", href: "/learn/ciem" },
      { label: "What is CSPM?", href: "/learn/cspm" },
      { label: "Onam SSPM", href: "/platform/saas-security" },
      { label: "Onam on AWS, Azure, GCP and four more clouds", href: "/solutions" },
      { label: "How Onam compares to Wiz, Orca and Prisma Cloud", href: "/compare" },
    ],
  },

  {
    slug: "cloud-attack-path",
    question: "What is a cloud attack path?",
    title: "What is a Cloud Attack Path? Attack Path Analysis Explained",
    excerpt:
      "An attack path is the chain of individually-minor findings that together reach something valuable. Why severity-ranked lists bury real risk, what a toxic combination is, and how choke points cut hundreds of paths at once.",
    term: "Attack path analysis",
    answer:
      "A cloud attack path is a chain of individually low- or medium-severity findings that together create a route from an entry point — usually the public internet — to a high-value asset such as a database holding sensitive data. Attack path analysis computes these chains across posture, identity, network and workload data.",
    readTime: "7 min",
    body: `
## Not to be confused with an "on-path attack"

Worth clearing up first, because the terms look alike and mean nothing like each other.

An **on-path attack** (the term that replaced "man-in-the-middle") is a technique where an attacker positions themselves between two communicating parties to intercept or alter traffic. It describes a single interception technique at the network layer.

An **attack path** is the opposite kind of concept: not one technique, but a *chain* of configuration and identity weaknesses that together lead from an entry point to a valuable asset. On-path attacks are about eavesdropping on a conversation; attack paths are about route-finding across an environment.

Everything below is about the second one.

## Why finding lists fail

A typical cloud environment produces thousands of findings. Ranked by severity, the top of the list is dominated by criticals on resources nobody can reach, while the finding that actually matters sits at position 800 marked "medium".

Severity is a property of a finding in isolation. Risk is a property of a finding *in context*. The two diverge constantly:

- A critical CVE on an isolated development instance with no data and no network path is close to harmless.
- A medium-severity IMDSv1 setting on an internet-facing instance whose role can read the customer database is the whole breach.

The second one is what an attacker uses. Almost no tool surfaces it, because surfacing it requires knowing four things at once.

## What a path actually looks like

> **Entry** — an EC2 instance is reachable from the internet on port 443.
> **Hop 1** — the instance has IMDSv1 enabled, so a server-side request forgery yields credentials.
> **Hop 2** — those credentials belong to a role that can assume a second, more privileged role.
> **Hop 3** — the second role has \`s3:GetObject\` on a production bucket.
> **Target** — that bucket holds 847,000 customer records classified as PII.

Four findings. Individually: one medium, one low, two informational. Together: a complete breach path, and every fact needed to see it lives in a different tool in most stacks.

## Toxic combinations

A toxic combination is a set of conditions that are each acceptable alone and unacceptable together. Public network exposure is fine on a marketing site. A permissive IAM role is fine on an isolated workload. Sensitive data is fine in a locked-down store. Put all three on one resource and you have a critical exposure that no individual rule flags.

Detecting them requires evaluating combinations, not rules — which is only possible if every signal is on one graph.

## Choke points

Once paths are computed, most environments show heavy convergence: hundreds of distinct paths routing through a handful of nodes. That over-permissive role attached to twelve services, or that one peered VPC.

A choke point is a node that appears in a disproportionate number of paths. Fixing one choke point can eliminate more risk than closing a hundred individual findings, and it is the single most useful output of attack path analysis — it converts an unbounded backlog into a short, ordered list of high-leverage fixes.

## How it is computed

1. **Build a graph** — resources, identities, network routes and data stores as nodes; relationships as edges.
2. **Mark entry points** — anything reachable from the internet or from a lower-trust boundary.
3. **Mark targets** — crown jewels, typically defined by data classification rather than by hand.
4. **Traverse** — find every route from entry to target, respecting real permission semantics including transitive role assumption.
5. **Rank** — by target value, path length, exploitability of each hop, and how many paths share a node.

Mapping each hop to MITRE ATT&CK techniques makes the output legible to detection engineers and useful for tabletop exercises.

## What it changes

The practical shift is from "4,000 findings" to "3 paths that reach crown jewels, converging on 2 choke points". That is a backlog a team can actually clear this sprint — and it is the difference between a tool that reports risk and a tool that reduces it.

## Next steps

- [How Onam implements attack path analysis](/platform/attack-path)
- [What is CIEM?](/learn/ciem) — identity is how attackers move
- [What is CNAPP?](/learn/cnapp)
`,
    faqs: [
      {
        q: "What is a cloud attack path?",
        a: "A chain of individually low- or medium-severity findings that together create a route from an entry point such as the public internet to a high-value asset such as a database holding sensitive data. Each link is minor; the chain is critical.",
      },
      {
        q: "What is a toxic combination in cloud security?",
        a: "A set of conditions that are individually acceptable but dangerous together — for example public network exposure, plus an over-permissive IAM role, plus sensitive data, all on one resource. No single rule flags it because no single condition is a violation.",
      },
      {
        q: "What is a choke point in attack path analysis?",
        a: "A node that appears in a disproportionate number of attack paths — commonly an over-permissive role or a peered network. Remediating one choke point can eliminate hundreds of paths at once, which makes it the highest-leverage fix available.",
      },
      {
        q: "How is attack path analysis different from vulnerability scanning?",
        a: "Vulnerability scanning finds weaknesses in individual components and ranks them by CVSS. Attack path analysis determines whether those weaknesses connect to each other and to something valuable. A critical CVE with no path to anything ranks below a medium finding that completes a chain to your customer database.",
      },
      {
        q: "What is the difference between an attack path and an on-path attack?",
        a: "They are unrelated despite the similar wording. An on-path attack — previously called man-in-the-middle — is a single technique where an attacker intercepts traffic between two parties. An attack path is a chain of configuration and identity weaknesses that together lead from an entry point to a high-value asset. One is an interception technique; the other is a route across an environment.",
      },
    ],
    related: [
      { label: "What is CIEM?", href: "/learn/ciem" },
      { label: "What is CNAPP?", href: "/learn/cnapp" },
      { label: "Onam Attack Path", href: "/platform/attack-path" },
      { label: "Onam on AWS, Azure, GCP and four more clouds", href: "/solutions" },
      { label: "How Onam compares to Wiz, Orca and Prisma Cloud", href: "/compare" },
    ],
  },

  {
    slug: "agentless-cloud-security",
    question: "What is agentless cloud security?",
    title: "What is Agentless Cloud Security? Agentless vs Agent-Based",
    excerpt:
      "Agentless cloud security assesses infrastructure and workloads without installing software on them. How snapshot scanning works, what it can and cannot see, and an honest comparison with agent-based tooling.",
    term: "Agentless cloud security",
    answer:
      "Agentless cloud security assesses cloud infrastructure and workloads without installing any software on them. Configuration is read through cloud provider APIs with read-only credentials, and workload contents are inspected by analysing point-in-time volume snapshots out-of-band, so nothing runs on the systems being scanned.",
    readTime: "6 min",
    body: `
## Why agentless became the default

Agent rollouts are where security programmes stall. Every agent needs a package, a supported-platform matrix, a rollout plan, an exception list for the machines it breaks, a version upgrade treadmill, and a renewed argument with the platform team every quarter.

Six months in, a typical programme sits at partial coverage — and the uncovered remainder is disproportionately the legacy estate that most needs scanning. Worse, nobody can say with confidence which systems are uncovered, so the security posture report describes a subset of reality while reading like the whole.

Agentless inverts this. Coverage is complete from the first scan because there is nothing to install.

## How agentless workload scanning works

Configuration assessment is straightforward — read the provider's APIs. Workload inspection is the interesting part:

1. The platform assumes a read-only role and enumerates volumes attached to each workload.
2. A **snapshot** is created using the cloud provider's native snapshot primitive.
3. A short-lived scan worker mounts and analyses the snapshot — **inside the customer's own account**, orchestrated by native services such as AWS Step Functions, Azure Logic Apps or GCP Workflows.
4. Structured results — package inventory, configuration signals, findings — are relayed out. Raw disk contents never leave the environment.
5. The snapshot is deleted, and a reconciler sweeps orphaned artefacts so a failed scan cannot leave storage accruing cost.

A capacity manager throttles concurrent snapshots per cloud so scanning never competes with production for quota or IOPS.

## What agentless sees

- Complete package and OS inventory from the real installed software, not a manifest
- Vulnerabilities matched against what is actually present
- Host configuration — users, keys, services, hardening state
- Secrets and credentials sitting on disk
- Malware and known-bad artefacts at rest

## What agentless cannot see

Honest limitations matter here, because vendors routinely gloss over them:

- **Live process execution.** Snapshot scanning is point-in-time. A process that spawns and exits between scans is invisible.
- **In-memory-only activity.** Fileless techniques that never touch disk leave no snapshot artefact.
- **Real-time blocking.** Agentless observes; it does not intercept a syscall and stop it.

Much of the first gap is covered without agents by reading cloud-native audit and flow logs — CloudTrail, VPC Flow Logs, Azure Activity Log — which yields behavioural detection on the control plane and network without touching the workload. What genuinely requires an agent is host-level runtime prevention.

## Choosing

| | Agentless | Agent-based |
| --- | --- | --- |
| Coverage | Complete on day one | Whatever gets deployed |
| Deployment | None | Package, rollout, maintenance |
| Performance impact | None | CPU, memory, occasional instability |
| Runtime process telemetry | No | Yes |
| Real-time blocking | No | Yes |
| Point-in-time vs continuous | Point-in-time | Continuous |

Most mature programmes use agentless as the universal baseline, add log-based detection for behaviour, and deploy agents only on the narrow set of workloads that genuinely need runtime prevention. Starting with agents and hoping for coverage is the pattern that fails.

## Next steps

- [How Onam implements agentless scanning](/platform/agentless)
- [What is CWPP?](/learn/cwpp)
- [What is CSPM?](/learn/cspm)
`,
    faqs: [
      {
        q: "What is agentless cloud security?",
        a: "Security assessment that requires no software installed on the systems being scanned. Configuration is read through cloud provider APIs, and workload contents are inspected by analysing point-in-time volume snapshots out-of-band.",
      },
      {
        q: "Is agentless security less effective than agent-based?",
        a: "For coverage, configuration assessment and vulnerability detection, agentless is generally more effective because it reaches 100% of workloads immediately. Agents retain a genuine advantage for continuous runtime process telemetry and real-time blocking, which snapshot scanning cannot provide.",
      },
      {
        q: "Does agentless scanning send my data to the vendor?",
        a: "It should not. In a well-designed implementation, snapshot analysis runs inside your own cloud account and only structured findings — package lists, configuration signals, finding records — are transmitted. Raw disk images and file contents never leave your environment. This is worth verifying explicitly during evaluation.",
      },
      {
        q: "Does snapshot scanning increase cloud costs?",
        a: "Marginally and briefly. Snapshots are incremental and point-in-time, and should be deleted as soon as analysis completes. A reconciler that sweeps orphaned snapshots matters, because a failed scan that leaves snapshots behind will quietly accrue storage cost.",
      },
    ],
    related: [
      { label: "What is CWPP?", href: "/learn/cwpp" },
      { label: "What is CSPM?", href: "/learn/cspm" },
      { label: "Onam Agentless Scanning", href: "/platform/agentless" },
      { label: "Onam on AWS, Azure, GCP and four more clouds", href: "/solutions" },
      { label: "How Onam compares to Wiz, Orca and Prisma Cloud", href: "/compare" },
    ],
  },
  {
    slug: "cloud-risk-quantification",
    question: "What is cloud risk quantification?",
    title: "What is Cloud Risk Quantification? FAIR and Dollar-Value Risk Explained",
    excerpt:
      "Cloud risk quantification expresses security exposure as a probable dollar loss instead of a severity score. How the FAIR model works, what inputs it needs, and why a priced risk is what a board can actually act on.",
    term: "Cloud risk quantification",
    answer:
      "Cloud risk quantification is the practice of expressing security risk as a financial figure — a probable dollar loss — rather than a severity label or a proprietary score. It commonly uses the FAIR model (Factor Analysis of Information Risk), which combines how often a loss event is likely to occur with how much that event would cost.",
    readTime: "6 min",
    body: `
## Why a severity score is not enough

Most cloud security tools rank risk with a label — critical, high, medium — or a proprietary number between 0 and 100. Both are useful for triage inside one tool, and both fall apart the moment someone senior asks the only question that matters to a business: *how much?*

A severity score cannot be added to a risk register that speaks in currency, cannot be compared against the cost of the control that would fix it, and cannot be taken to a board or an insurer. Risk quantification exists to answer "how much" in the same units the rest of the business already uses: money.

## The FAIR model in one line

FAIR — Factor Analysis of Information Risk — is an open, published standard for quantifying risk in financial terms. At its core it is a single relationship:

> **Risk = Loss Event Frequency × Loss Magnitude**

Loss Event Frequency is how often a damaging event is expected in a year. Loss Magnitude is what one such event would cost. Multiply them and you get an **Annualized Loss Expectancy (ALE)** — a dollar figure per year of exposure. The power of FAIR is that each factor decomposes into smaller inputs you can actually estimate and inspect, rather than a black-box score.

## The inputs — named and defensible

A quantified figure is only as credible as the numbers behind it. A defensible model uses inputs that can be pointed at, not invented:

- **Per-record cost** — an external benchmark such as the IBM *Cost of a Data Breach* report, which publishes average cost per breached record by industry.
- **Data sensitivity** — a multiplier reflecting how regulated or confidential the exposed data is (restricted data carries far more loss than public data).
- **Regulatory exposure** — a multiplier for the strictest applicable regime (for example GDPR), where fines and notification costs are material.
- **Blast radius** — how much a given weakness can actually reach, which is where a security graph and attack-path analysis feed the model: a finding on a path to a large sensitive store is worth more than the same finding in isolation.

Because every magnitude figure traces back to a published cost times transparent multipliers, an auditor or a skeptical executive can follow the arithmetic.

## Why a dollar beats a score

A dollar figure travels where a score cannot. It slots directly into an enterprise risk register, frames a board conversation, and informs cyber-insurance decisions. It also changes prioritization: once every exposure carries a price, the work queue re-sorts around *dollars of risk removed per fix* — which is rarely the same order as raw severity.

## What quantified risk does and does not promise

Quantification produces a defensible estimate, not a prophecy. Its value is in relative prioritization and in giving leadership a currency-denominated view — not in predicting the exact cost of a future breach. Any specific figure shown in a demo or a model is illustrative until it is computed against real, named inputs for a real environment. Stated honestly, that is a strength: an estimate whose inputs are visible can be challenged and refined, which is exactly how a credible risk number should behave.

## Next steps

- [How Onam prices risk with FAIR](/platform/risk)
- [What is a cloud attack path?](/learn/cloud-attack-path) — how blast radius is computed
- [What is a choke point?](/learn/choke-point)
`,
    faqs: [
      {
        q: "What is the FAIR model?",
        a: "FAIR (Factor Analysis of Information Risk) is an open standard for quantifying information risk in financial terms. It expresses risk as Loss Event Frequency multiplied by Loss Magnitude, producing an annualized dollar figure, and decomposes each factor into estimable, inspectable inputs.",
      },
      {
        q: "How is cloud risk measured in dollars?",
        a: "By estimating how often a loss event would occur and how much it would cost, then multiplying the two. Magnitude typically draws on external per-record breach costs, adjusted by data sensitivity, regulatory exposure and how much the weakness can actually reach.",
      },
      {
        q: "Is quantified cloud risk accurate?",
        a: "It is a defensible estimate, not a prediction of an exact future loss. Its value is in prioritizing consistently and in giving leadership a currency figure they can act on. Because the inputs are named and external, the estimate can be challenged and refined over time.",
      },
    ],
    related: [
      { label: "What is a cloud attack path?", href: "/learn/cloud-attack-path" },
      { label: "What is a choke point?", href: "/learn/choke-point" },
      { label: "Onam Risk Quantification", href: "/platform/risk" },
      { label: "Onam on AWS, Azure, GCP and four more clouds", href: "/solutions" },
      { label: "How Onam compares to Wiz, Orca and Prisma Cloud", href: "/compare" },
    ],
  },
  {
    slug: "choke-point",
    question: "What is a choke point in cloud security?",
    title: "What is a Choke Point? Attack Path Choke Points Explained",
    excerpt:
      "A choke point is a single resource that sits on many attack paths, so fixing it severs the most routes at once. How choke points are found, why they are the highest-leverage fix, and how they turn a huge backlog into a short list.",
    term: "Attack path choke point",
    answer:
      "A choke point is a single resource — often an over-privileged identity or a shared network node — that appears on a large number of distinct attack paths. Because so many routes pass through it, remediating one choke point removes more risk than fixing many isolated findings, which makes it the highest-leverage fix in a cloud environment.",
    readTime: "5 min",
    body: `
## From an endless backlog to a few bottlenecks

Compute every route an attacker could take from an entry point to a valuable asset and a pattern almost always appears: hundreds of distinct paths do not spread evenly across the environment — they converge. A handful of nodes show up again and again, because so much of the cloud depends on them. That over-permissive role attached to a dozen services. That one peered network. That shared secret.

Those high-convergence nodes are choke points, and they are the most useful output of attack-path analysis, because they turn an unbounded list of findings into a short, ordered list of fixes.

## What makes something a choke point

A choke point is not defined by its own severity. A role that looks unremarkable in a findings list can be the single most important thing to fix if a large share of attack paths route through it. Two properties matter:

- **Convergence** — how many distinct paths pass through the node.
- **Position** — whether it sits between many entry points and many crown jewels, rather than at a dead end.

A critical finding on a resource that reaches nothing is not a choke point. A medium finding that every path depends on is.

## Why it is the highest-leverage fix

Fixing findings one at a time treats symptoms. Fixing a choke point cuts the routes themselves. Remediating a single over-privileged role can invalidate dozens of paths simultaneously — more risk removed in one change than in a hundred isolated closures. This is the difference between working *down* a backlog and working *through* it: the same remediation budget, spent where it severs the most exposure.

## How choke points are ranked

Once paths are computed, each node is scored by how many paths it appears on, weighted by the value of the targets those paths reach and by how exploitable the surrounding hops are. The top few nodes — often the "Top 5" — are surfaced first, so a team knows exactly where Monday's effort should go.

## Fixing them, and confirming the fix

Choke-point remediation follows the same discipline as any high-severity work, typically on windows such as Critical within 7 days, High within 30, and Medium within 90. The difference is leverage: because the fix removes many paths at once, its verification is visible — on the next scan, the paths that depended on it are gone, and the finding auto-resolves when the resource passes.

## Next steps

- [What is a cloud attack path?](/learn/cloud-attack-path)
- [How Onam surfaces choke points](/platform/attack-path)
- [What is cloud risk quantification?](/learn/cloud-risk-quantification)
`,
    faqs: [
      {
        q: "What is a choke point in an attack path?",
        a: "A single resource that appears on many distinct attack paths at once. Because so many routes depend on it, fixing that one node severs more paths — and removes more risk — than closing many isolated findings.",
      },
      {
        q: "How do you find choke points?",
        a: "Compute every attack path from entry points to valuable assets, then score each node by how many paths pass through it, weighted by the value of the targets those paths reach. The nodes with the highest convergence are the choke points.",
      },
      {
        q: "Why fix a choke point instead of the critical findings?",
        a: "Severity describes a finding in isolation; a choke point describes leverage. A modest-severity node that every path routes through can remove far more real risk when fixed than a critical finding on a resource an attacker cannot reach.",
      },
    ],
    related: [
      { label: "What is a cloud attack path?", href: "/learn/cloud-attack-path" },
      { label: "What is cloud risk quantification?", href: "/learn/cloud-risk-quantification" },
      { label: "Onam Attack Path Analysis", href: "/platform/attack-path" },
      { label: "Onam on AWS, Azure, GCP and four more clouds", href: "/solutions" },
      { label: "How Onam compares to Wiz, Orca and Prisma Cloud", href: "/compare" },
    ],
  },
  {
    slug: "kspm",
    question: "What is KSPM (Kubernetes Security Posture Management)?",
    title: "What is KSPM? Kubernetes Security Posture Management Explained",
    excerpt:
      "KSPM continuously checks Kubernetes clusters for misconfiguration, unsafe RBAC and workload risk. How it works, what it catches that CSPM misses, and how it differs from container scanning and CWPP.",
    term: "Kubernetes Security Posture Management",
    answer:
      "Kubernetes Security Posture Management (KSPM) is the continuous evaluation of Kubernetes clusters against security baselines — RBAC bindings, pod security context, network policy, admission control and secrets handling. It reads cluster state through the Kubernetes API and reports which objects violate policy, why it matters, and how to correct it.",
    readTime: "8 min",
    body: `
## Why Kubernetes needs its own posture management

A cloud posture tool reads the cloud provider's API. It can tell you an EKS cluster exists, which VPC it sits in, and whether its endpoint is public. It cannot tell you that a ServiceAccount inside that cluster is bound to cluster-admin, that a pod runs as UID 0 with the host filesystem mounted, or that no NetworkPolicy exists so every pod can reach every other pod.

Those objects live **inside** the cluster, behind the Kubernetes API — a different control plane with its own authentication, its own object model and its own failure modes. The cloud provider does not see them, so cloud posture management does not either.

That gap is where KSPM sits. It is not CSPM applied to Kubernetes; it is a separate evaluation against a separate API.

## What KSPM actually checks

| Area | Typical findings |
| --- | --- |
| RBAC | ClusterRoleBindings granting cluster-admin, wildcard verbs, service accounts with escalate or bind |
| Workload context | Privileged containers, hostPID and hostNetwork, root UID, writable root filesystem, missing seccomp |
| Network | No default-deny NetworkPolicy, services exposed via LoadBalancer without restriction |
| Secrets | Secrets mounted as environment variables, unencrypted etcd, tokens auto-mounted where unused |
| Admission and supply chain | No admission control, unsigned images, images from untrusted registries, \`:latest\` tags |
| Control plane | Anonymous auth enabled, insecure kubelet ports, audit logging off |

The CIS Kubernetes Benchmark is the usual baseline, and most of these map to it directly.

## KSPM vs container scanning vs CWPP

These three get used interchangeably and are not the same thing.

- **Container image scanning** looks at the image: which packages it contains and which have known CVEs. It answers *is this artefact vulnerable?*
- **KSPM** looks at the cluster: how workloads are configured, who can do what, what can talk to what. It answers *is this cluster configured safely?*
- **CWPP** looks at the running workload: process behaviour, file integrity, runtime detection. It answers *is something happening right now?*

A vulnerable image (scanning) running as root (KSPM) that starts a reverse shell (CWPP) is one incident described by three tools. Treating any one of them as the whole picture is the common mistake.

## Why RBAC is the part that matters most

Image CVEs get the attention because there is a number attached to them. But the finding that most often converts a container compromise into a cluster compromise is an over-permissive ServiceAccount.

The chain is short and well-worn: a pod is compromised through the application, its ServiceAccount token is auto-mounted at a known path, that token is bound to a role with broad verbs, and the attacker now speaks to the API server with those permissions. Nothing in that sequence requires a CVE.

This is why KSPM findings should be read as a graph rather than a list. *Which subjects can reach which resources, and what does that let them do next?* is a more useful question than *how many High findings do we have?*

## Where KSPM fits with cloud posture

A Kubernetes cluster is not an island. It runs on cloud infrastructure, its nodes have instance roles, and its workloads assume cloud identities through mechanisms like IRSA or Workload Identity.

The interesting failures cross that boundary in both directions: a pod that assumes a node role which can read a production bucket; a cloud IAM policy that grants access to the cluster's control plane. Evaluating cluster posture and cloud posture separately produces two correct reports that both miss the path between them.

## Getting started

1. Connect the cluster read-only — a kubeconfig or service account with \`get\`, \`list\` and \`watch\`. No agent is required for posture evaluation.
2. Baseline against CIS Kubernetes first. It is well understood, it is what auditors ask about, and it produces a finite list.
3. Fix RBAC before image CVEs. It is less satisfying and it removes more real risk.
4. Add a default-deny NetworkPolicy. Most clusters have none, and it is the single change that most reduces lateral movement.
5. Re-evaluate continuously. Clusters change hourly; a quarterly audit describes a cluster that no longer exists.
`,
    faqs: [
      {
        q: "Is KSPM different from CSPM?",
        a: "Yes. CSPM reads the cloud provider's API and sees the cluster as one resource. KSPM reads the Kubernetes API and sees the objects inside it — RBAC bindings, pod security context, network policy, admission control. A cluster can be perfectly configured at the cloud layer and unsafe inside.",
      },
      {
        q: "Does KSPM require an agent in the cluster?",
        a: "Posture evaluation does not. Cluster state is readable through the Kubernetes API with a read-only credential. Runtime detection — process behaviour, file integrity, syscall monitoring — is a different capability and does typically need something running in the cluster.",
      },
      {
        q: "What baseline should KSPM measure against?",
        a: "The CIS Kubernetes Benchmark is the standard starting point and the one auditors recognise. Pod Security Standards, NSA/CISA Kubernetes hardening guidance and NIST SP 800-190 are common additions once the CIS baseline is clean.",
      },
      {
        q: "Which KSPM finding should be fixed first?",
        a: "Usually an RBAC one. Over-permissive ServiceAccounts and ClusterRoleBindings are what turn a single compromised pod into cluster-wide access, and unlike image CVEs they cannot be resolved by a rebuild.",
      },
    ],
    related: [
      { label: "What is CWPP?", href: "/learn/cwpp" },
      { label: "What is CNAPP?", href: "/learn/cnapp" },
      { label: "What is a cloud attack path?", href: "/learn/cloud-attack-path" },
      { label: "Onam Container & Kubernetes Security", href: "/platform/container-security" },
      { label: "Onam on Kubernetes", href: "/solutions/kubernetes" },
    ],
  },
  {
    slug: "code-security",
    question: "What is code security in the cloud?",
    title: "What is Code Security? SAST, SCA, IaC Scanning and Runtime Explained",
    excerpt:
      "Code security covers SAST, DAST, SCA, IaC and secret scanning. What each one catches, why fixing findings in the console alone makes them return, and how code and runtime connect.",
    term: "Code Security",
    answer:
      "Code security is the practice of finding security defects in the artefacts that build a system — application source, dependencies, infrastructure-as-code templates and pipeline configuration — before they are deployed. It combines static analysis, dependency analysis, IaC scanning and secret detection, applied continuously as code changes.",
    readTime: "8 min",
    body: `
## The four techniques, and what each one can see

They are usually sold together and they look for different things.

**SAST — static application security testing.** Reads source code without running it, tracing how untrusted input flows to a dangerous operation. Catches injection, unsafe deserialisation, path traversal, weak cryptography. It sees code paths that tests never execute, and it produces false positives where it cannot prove a path is unreachable.

**SCA — software composition analysis.** Inventories dependencies, including transitive ones, and matches them against known vulnerabilities. Most of the code shipped is not written in-house, so this is usually where the volume is. Its weakness is the inverse of SAST's: it reports a vulnerable package whether or not the vulnerable function is ever called.

**DAST — dynamic application security testing.** Exercises the running application from the outside. It finds what is genuinely reachable, including configuration and deployment problems no static tool sees, but only on paths it manages to reach.

**IaC scanning.** Evaluates Terraform, CloudFormation, Helm charts and Kubernetes manifests against policy before anything is created. This is the earliest possible point to catch a misconfiguration — the template that will create a public bucket, rather than the public bucket.

**Secret detection** cuts across all of them: credentials in source, in image layers, in pipeline configuration, in committed state files.

## Why fixing it in the console makes it come back

This is the failure that makes code security a cloud security concern rather than an application security one.

A posture tool reports a storage bucket with public access. An engineer opens the cloud console, unchecks the box, marks the finding resolved. The next \`terraform apply\` recreates the bucket exactly as the template describes it — public — because the template was never changed.

The finding returns, gets re-triaged, gets fixed in the console again. Everyone is working, nothing is improving.

**The fix has to land where the resource is defined.** That requires knowing which template, repository and line produced a given running resource — which means connecting the code side to the runtime side rather than running two programmes that never meet.

## Reachability is what makes the numbers usable

A dependency scan on a mature service commonly returns hundreds of findings. Fixing them in CVSS order is a reasonable-sounding strategy that wastes most of the effort, because severity describes the vulnerability, not your exposure to it.

Three questions change the order:

1. **Is the vulnerable function actually called?** A critical CVE in a code path the application never executes is not a critical risk to that application.
2. **Is the workload reachable?** The same container behind an internal service and behind an internet-facing load balancer carries very different risk.
3. **What can it reach next?** A vulnerable workload with a read-only role is contained. The same workload with a role that can assume other roles is an entry point.

None of those questions can be answered from the code alone, which is why code findings become useful when they are joined to runtime context.

## Where it belongs in the pipeline

| Stage | What runs | What it should block |
| --- | --- | --- |
| Pre-commit | Secret detection | Any credential, always |
| Pull request | SAST diff, SCA on changed dependencies, IaC policy | New Critical or High on changed code |
| Build | Image scan, SBOM generation | Base images with known critical CVEs |
| Pre-deploy | IaC policy against the plan | Templates that would violate posture policy |
| Runtime | Posture, reachability, drift | Nothing — it reports; blocking here breaks production |

The rule that keeps this survivable: **gate on the delta, not the backlog.** A pipeline that fails on every pre-existing finding gets switched off within a fortnight. One that fails only on newly introduced findings holds the line while the backlog is worked separately.

## What good looks like

- Secret detection running before code leaves a laptop, not after it reaches the default branch.
- SCA prioritised by reachability, not by CVSS.
- IaC policy evaluated against the plan, so the misconfiguration is prevented rather than reported.
- Every runtime finding traceable back to the template and repository that produced it.
- One inventory across code and cloud, so "which running workloads contain this dependency?" is a query rather than a project.
`,
    faqs: [
      {
        q: "What is the difference between SAST, DAST and SCA?",
        a: "SAST reads your source code without running it. DAST exercises the running application from outside. SCA inventories third-party dependencies and matches them against known vulnerabilities. They find different classes of defect and none of them substitutes for another.",
      },
      {
        q: "Why do cloud misconfigurations come back after being fixed?",
        a: "Because they were fixed in the console while the infrastructure-as-code template that created them was left unchanged. The next apply recreates the original configuration. A fix only holds when it lands where the resource is defined.",
      },
      {
        q: "Should a build fail on every security finding?",
        a: "No. Gate on newly introduced findings and work the existing backlog separately. A pipeline that fails on every pre-existing issue is switched off or bypassed within weeks, which is worse than no gate at all.",
      },
      {
        q: "What is reachability analysis in dependency scanning?",
        a: "Determining whether the vulnerable function in a dependency is actually invoked by your application. It typically removes the large majority of raw findings and is the difference between a dependency report you can act on and one you cannot.",
      },
    ],
    related: [
      { label: "What is cloud secrets management?", href: "/learn/secrets-management" },
      { label: "What is KSPM?", href: "/learn/kspm" },
      { label: "What is CNAPP?", href: "/learn/cnapp" },
      { label: "Onam Code Security", href: "/platform/code-security" },
      { label: "Onam Container & Kubernetes Security", href: "/platform/container-security" },
    ],
  },
  {
    slug: "secrets-management",
    question: "What is cloud secrets management?",
    title: "What is Cloud Secrets Management? Keys, Rotation and Sprawl Explained",
    excerpt:
      "Cloud secrets management covers how credentials, keys and tokens are stored, accessed, rotated and audited. What goes wrong, why hardcoded secrets persist, and how key management differs from secrets management.",
    term: "Cloud Secrets Management",
    answer:
      "Cloud secrets management is the practice of storing, distributing, rotating and auditing credentials — API keys, database passwords, tokens and certificates — so that no application holds a long-lived secret in code or configuration. Secrets live in a dedicated store, are fetched at runtime, and every access is logged.",
    readTime: "7 min",
    body: `
## The problem is distribution, not storage

Nearly every team has a secrets store. Very few have a secrets *problem* that the store alone solves, because the hard part was never where to keep a secret — it was how an application gets one at the moment it needs it, without a human pasting it somewhere first.

That gap is where secrets end up in places they should not be: an environment variable in a task definition, a Kubernetes Secret mounted as plaintext, a CI variable, a Terraform state file, a Slack message from 2023, a commit from a Friday afternoon.

Each of those is a copy. A secret with copies cannot be rotated, because nobody knows how many there are.

## What actually goes wrong

| Failure | Why it happens | What it enables |
| --- | --- | --- |
| Hardcoded credentials | Fastest path to a working build | Anyone with repository read access has production access |
| Long-lived static keys | Rotation breaks things, so nobody rotates | A key leaked in 2022 still works today |
| Secrets in environment variables | Every runtime supports it | Readable by any process, and printed by most crash handlers |
| Over-broad key policies | Least privilege is fiddly to get right | One compromised service decrypts everything |
| No audit trail | Access logging is off by default in places | A leak is undetectable and its blast radius unknowable |
| Secrets in state and logs | A side effect, never a decision | Copies accumulate where nobody looks |

## Secrets management and key management are not the same thing

They get conflated because the same vendors sell both.

**Key management (KMS)** deals with cryptographic keys: generating them, controlling who may encrypt or decrypt with them, and ideally never letting the key material leave the boundary. The question is *who may perform this cryptographic operation?*

**Secrets management** deals with credential values: storing them, handing them to workloads, rotating them and recording who fetched what. The question is *which identity may read this value right now?*

They meet at encryption at rest — a secrets store encrypts its contents with a key from KMS — but a well-run KMS does not stop a database password appearing in a container image.

## The rotation problem, honestly

Rotation is where most programmes stall, and the reason is mechanical rather than cultural: rotating a secret means every consumer must pick up the new value without an outage, and most consumers read their secret exactly once at startup.

The approaches that work in practice all remove the long-lived secret rather than rotating it faster:

- **Workload identity.** The workload authenticates as itself — an instance role, IRSA, Workload Identity, a federated OIDC token — and receives short-lived credentials. There is no static secret to leak.
- **Dynamic secrets.** The store creates a credential on request with a short lease and revokes it after.
- **Dual-secret rotation.** Two valid credentials at a time, so the new one is deployed before the old one is revoked.

Everything else is scheduling pain around a design that assumed secrets are permanent.

## What good looks like

1. **No secret in source, ever** — enforced by a pre-commit hook and a repository scan, not by review.
2. **One store per environment**, with access granted to identities rather than people.
3. **Short-lived by default.** Workload identity where the platform supports it; leases where it does not.
4. **Every access audited**, with alerts on access from an unexpected identity or region.
5. **Scoped keys.** One key per data domain, so one compromise does not decrypt the estate.
6. **Detection in the pipeline and at rest** — scanning repositories, images, IaC, CI configuration and cloud resource metadata, because that is where copies actually accumulate.

The last point is the one most often missed: a secrets programme that only inspects the secrets store is auditing the one place secrets are handled correctly.
`,
    faqs: [
      {
        q: "What is the difference between secrets management and key management?",
        a: "Key management (KMS) controls cryptographic keys and who may encrypt or decrypt with them. Secrets management stores and distributes credential values — passwords, API keys, tokens — to the workloads that need them. A secrets store usually uses KMS to encrypt itself, but they answer different questions.",
      },
      {
        q: "Why are hardcoded secrets still so common?",
        a: "Because they work immediately and the alternative requires the workload to have an identity before it has a credential. The fix is rarely a policy; it is making the correct path as fast as the wrong one, then scanning to catch what slips through.",
      },
      {
        q: "How often should cloud secrets be rotated?",
        a: "Frequency matters less than lifetime. A secret rotated every 90 days is still valid for 90 days if it leaks on day one. Short-lived credentials issued to a workload identity remove the question rather than answering it.",
      },
      {
        q: "Where do leaked cloud secrets usually come from?",
        a: "Copies rather than the store itself — source control, container image layers, CI variables, Terraform state, environment variables and log output. Any secrets programme that only inspects the vault is inspecting the one place things are done correctly.",
      },
    ],
    related: [
      { label: "What is CIEM?", href: "/learn/ciem" },
      { label: "What is CSPM?", href: "/learn/cspm" },
      { label: "Onam Encryption & Key Security", href: "/platform/encryption" },
      { label: "Onam CIEM", href: "/platform/ciem" },
      { label: "Onam Code Security", href: "/platform/code-security" },
    ],
  },
];

export function getLearnArticle(slug: string): LearnArticle | undefined {
  return LEARN_ARTICLES.find((a) => a.slug === slug);
}
