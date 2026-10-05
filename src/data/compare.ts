/**
 * Comparison pages — /compare/onam-vs-*
 *
 * THE RULE THIS FILE EXISTS TO ENFORCE
 * ------------------------------------
 * Nothing here asserts a fact about a competitor's product. Not one line.
 *
 * Marketing guardrail 2 requires every competitor claim to trace to that
 * competitor's own public page, with a URL and an access date. That is a real
 * bar, and it decays: a true statement about Wiz in August is a false statement
 * about Wiz in October, and a page full of unsourced gap-claims is both a legal
 * exposure and, worse, the thing that destroys the honesty this company is
 * actually selling.
 *
 * So we sidestep it entirely, the same way the live blog post
 * (/resources/blog/onam-vs-wiz-orca-prisma-cloud) does: pose the seven
 * questions a buyer should ask, answer them **only for Onam**, and describe the
 * other platform only in its own published words (inTheirWords). A question is
 * not a claim. There is no "strengths" list in our words any more: a
 * description of a competitor in our words is a claim about them. An answer
 * about ourselves traces to facts/product.yaml, which is already cleared.
 *
 * If you add a line here that says what a competitor does, cannot do, or
 * charges — STOP. That needs their URL, an access date, and a human to clear
 * it. Guardrails 2 and 4.
 *
 * The one exception is `inTheirWords`: verbatim quotations from the
 * competitor's own public page, each with the address and the date we read
 * it — the house style of the wiz-alternatives post. A quotation is their
 * claim, attributed to them, not ours. Never paraphrase into a quote, never
 * quote a page you did not open, and re-date the entry when you re-read it.
 *
 * Domain pages (code, data, identity) carry their own `questions`, because
 * the seven platform questions do not separate a SAST tool or a DSPM tool.
 *
 * Every number below carries its scope and comes from marketing/facts/product.yaml
 * (cleared 2026-08-07).
 */

export type Competitor = {
  slug: string;
  name: string;
  /** Shown in the H1: "Onam vs {name}" */
  shortName: string;
  /** Search-facing framing, no factual claim about them. */
  intro: string;
  /** The one honest limit, guardrail 6. Different per page, all true. */
  honestLimit: string;
  /**
   * Domain comparisons only (code, data, identity). Absent on the cloud
   * platform pages, which use the shared QUESTIONS.
   */
  domain?: string;
  /** Overrides the shared seven questions for a domain comparison. */
  questions?: { q: string; onam: string }[];
  /** Verbatim quotations from the competitor's own pages. See header. */
  inTheirWords?: VendorQuotes[];
  /** How sentences refer to them when shortName reads badly there ("the dedicated CIEM tools"). */
  referAs?: string;
  /** True when the page covers several vendors, for verb agreement. */
  plural?: boolean;
  /** Domain pages: the Onam platform page for that domain, linked from the CTA. */
  platformHref?: string;
  /** <title> for a domain page. */
  metaTitle?: string;
  /** <meta name="description">, max 155 chars. Domain pages set their own. */
  metaDescription?: string;
};

export type VendorQuotes = {
  vendor: string;
  /** Exact text as published on `url`, without quotation marks. */
  quotes: string[];
  url: string;
  /** Human label for the source, e.g. "snyk.io/product/snyk-code". */
  source: string;
  /** Date we opened the page, e.g. "5 October 2026". */
  accessed: string;
  /** Optional plain statement of a fact the vendor itself published (e.g. a retirement). */
  note?: string;
};

/** The seven questions. Identical on every page — they are criteria, not claims. */
export const QUESTIONS: { q: string; onam: string }[] = [
  {
    q: "How many clouds get first-class treatment?",
    onam: "Posture rules cover seven clouds through one rule engine: AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud and Kubernetes. 11,433 posture rule definitions across 549 cloud services — the all-cloud totals, not a per-cloud figure. Depth is not identical everywhere: some identity analysis, such as unused-permission and shadow-admin detection, runs on AWS today. Ask any vendor for the per-cloud breakdown rather than the headline number.",
  },
  {
    q: "Is the analysis cross-cloud, or per-cloud silos side by side?",
    onam: "One security graph. Engines write their findings and relationships into it, attack-path entry points include other clouds, and federation between clouds is modelled as an edge — so a path can start in one cloud and end in another.",
  },
  {
    q: "Agentless — and what does onboarding grant?",
    onam: "Agentless. Posture scanning connects through read-only cloud roles; agentless workload scanning runs inside your account, using resources deployed there at onboarding. No agent runs on your workloads, and every permission is in a template you can read before you run it. The trade-off is stated in the trust whitepaper: snapshot scanning cannot see inside a running process.",
  },
  {
    q: "How does it prioritise — severity labels or business impact?",
    onam: "By business impact as well as severity. Each finding gets a FAIR-style loss estimate — a minimum, likely and maximum figure from exploit likelihood, exposure, records at risk, data sensitivity, asset value and applicable regulations — raised for findings that sit on attack paths. Ask to see the inputs, not just the ranking.",
  },
  {
    q: "Does it connect findings across engines?",
    onam: "Yes, on one graph. Attack-path edges come from posture, identity, network, data and threat-detection evidence, and only edges confirmed by that evidence are walked. The chain that reaches your data is usually several ordinary findings in a row, none of which a single rule would rank first.",
  },
  {
    q: "Is compliance evidence continuous or point-in-time?",
    onam: "Findings are mapped to 78 compliance frameworks and the scores are recomputed from the latest findings on every scan, with evidence per control, a trend per framework and PDF, CSV or Excel export for your auditor.",
  },
  {
    q: "Does coverage span code to runtime?",
    onam: "Code Security (SAST, secrets, IaC, dependencies and DAST), posture, attack paths, identity (CIEM), data, containers and Kubernetes, SaaS posture across 8 platforms, and cloud detection and response — 29 engines on one platform. Code findings are reported on their own today rather than traced to the workload they deploy.",
  },
];

export const COMPETITORS: Competitor[] = [
  {
    slug: "onam-vs-wiz",
    name: "Wiz",
    shortName: "Wiz",
    intro:
      "Wiz is on most cloud security shortlists. If you are evaluating both, here is Wiz in its own published words, and the seven questions worth asking each of us.",
    inTheirWords: [
      {
        vendor: "Wiz",
        quotes: [
          "Built for cloud and AI, Wiz AI-APP is the platform to secure your AI applications from code to runtime.",
          "A single list of prioritized issues of toxic combinations of cloud and AI risk that have a high probability of being exploited.",
          "Wiz connects in minutes via API and achieves full coverage across cloud and AI resources",
          "Runtime protection from the Wiz Sensor stops threats and provides deep, real-time threat detection.",
        ],
        url: "https://www.wiz.io/platform",
        source: "wiz.io/platform",
        accessed: "15 September 2026",
      },
    ],
    honestLimit:
      "The honest gap: we are a young company with no public reference customers yet, and no runtime sensor. If proven scale at enterprise size or inline runtime blocking is your first filter, that filter does not select us today.",
  },
  {
    slug: "onam-vs-orca",
    name: "Orca Security",
    shortName: "Orca",
    intro:
      "If Orca is on your shortlist alongside us, here is Orca in its own published words, and the seven questions to run against both.",
    inTheirWords: [
      {
        vendor: "Orca Security",
        quotes: [
          "Orca Security is the complete Cloud Security Platform that detects, prioritizes, and remediates security risks and compliance issues across your cloud estate.",
          "Dynamic scoring and attack path analysis",
          "Agentless scanning across every workload",
          "Runtime observability and protection",
        ],
        url: "https://orca.security/platform/",
        source: "orca.security/platform",
        accessed: "15 September 2026",
      },
    ],
    honestLimit:
      "The honest gap: we are newer, and our integration surface is small — Jira and ServiceNow for tickets; Slack, PagerDuty, email and webhooks for alerts. Judge us on the graph and the paths, not on breadth of integrations.",
  },
  {
    slug: "onam-vs-prisma-cloud",
    name: "Palo Alto Prisma Cloud",
    shortName: "Prisma Cloud",
    intro:
      "Prisma Cloud often comes up as part of a wider Palo Alto Networks conversation, which changes the evaluation. Here is Palo Alto Networks' cloud platform in its own published words, and the seven questions that apply to both.",
    inTheirWords: [
      {
        vendor: "Palo Alto Networks — Cortex Cloud",
        quotes: [
          "a Cloud-Native Application Protection Platform (CNAPP) designed to secure cloud-native applications across multi-cloud environments.",
          "SmartScore prioritizes them by real-world exposure and production behavior, replacing volume-driven alerts with decisions grounded in actual risk.",
          "Our performance-optimized agent captures deep behavioral telemetry to understand attacker intent and contain threats.",
        ],
        url: "https://www.paloaltonetworks.com/cortex/cloud",
        source: "paloaltonetworks.com/cortex/cloud",
        accessed: "15 September 2026",
        note: "The page we read describes Cortex Cloud. If your quote says Prisma Cloud, ask which product name applies.",
      },
    ],
    honestLimit:
      "The honest gap: if you already run Palo Alto across the estate, the consolidation argument runs in their favour, not ours. We are one platform for cloud security, not a portfolio, and we do not pretend that is the same thing.",
  },
  {
    slug: "onam-vs-defender",
    name: "Microsoft Defender for Cloud",
    shortName: "Defender for Cloud",
    intro:
      "Defender for Cloud is a common consideration for Azure-centred estates. Here it is in Microsoft's own documentation, and the seven questions worth asking of both of us.",
    inTheirWords: [
      {
        vendor: "Microsoft Defender for Cloud",
        quotes: [
          "a Cloud Native Application Protection Platform (CNAPP), which is a unified solution that combines multiple cloud security tools to protect applications across their entire lifecycle",
          "Summarize your security posture based on the security recommendations.",
          "Connect to your multicloud environments by using agentless methods for CSPM insight and CWPP protection",
        ],
        url: "https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-cloud-introduction",
        source: "learn.microsoft.com, Defender for Cloud overview",
        accessed: "14 September 2026",
        note: "The same documentation lists attack path analysis under the paid Defender CSPM plan, and server protection through Microsoft Defender for Endpoint.",
      },
    ],
    honestLimit:
      "The honest gap: if your estate is overwhelmingly Azure and Microsoft, the native option is a genuinely reasonable answer and the burden is on us to justify a second tool. Our case is strongest where the estate spans several clouds.",
  },
  {
    slug: "onam-vs-snyk",
    metaTitle: "Onam vs Snyk for code security — seven questions to ask both — Onam Security",
    name: "Snyk",
    shortName: "Snyk",
    domain: "Code security",
    platformHref: "/platform/code-security",
    metaDescription:
      "Onam vs Snyk for code security: Snyk in its own published words, seven questions answered for Onam, and the one place Snyk is built for and we are not.",
    intro:
      "If Snyk is on your list next to Onam for code security, the useful framing is that the two start from opposite ends: Snyk, by its own description below, from where code is written; Onam from the platform that already watches your cloud. These are the questions that decide which end your team needs first.",
    inTheirWords: [
      {
        vendor: "Snyk",
        quotes: [
          "Snyk’s AI-native and agentic platform helps organizations secure and govern development to unleash productivity, reduce business risk, and accelerate software delivery for the age of AI.",
        ],
        url: "https://snyk.io/platform/",
        source: "snyk.io/platform",
        accessed: "5 October 2026",
      },
      {
        vendor: "Snyk Code",
        quotes: [
          "Find and auto-fix vulnerabilities as you code, with in-line remediation recommendations right in your IDE and pull requests.",
          "Scan, and automatically remediate source code issues with pre-screened fixes in seconds to minutes, build-free in the IDE and pull requests.",
        ],
        url: "https://snyk.io/product/snyk-code/",
        source: "snyk.io/product/snyk-code",
        accessed: "5 October 2026",
      },
    ],
    questions: [
      {
        q: "Where does a finding first reach the developer?",
        onam: "After a scan of the repository, in the Onam console. Onam has no editor plugin, CI plugin or pull-request check today: a scan reports, and a pipeline that wants a gate calls the scan API and decides for itself.",
      },
      {
        q: "Does a dependency finding know whether the code is running and reachable?",
        onam: "No. Onam ranks a dependency finding by CVSS, EPSS exploit probability, CISA KEV membership and whether a fix exists — not by call-graph reachability, and it does not yet link the finding to the workload running that code.",
      },
      {
        q: "How does it decide which code findings are real?",
        onam: "By what each rule can prove. Findings from taint and AST rules are listed as security issues with their own severity; pattern-rule matches are listed separately as hotspots to review and capped at medium, so they cannot bury a proven flaw.",
      },
      {
        q: "Are IaC templates judged by the same rules as the running cloud?",
        onam: "No. Terraform, Kubernetes YAML, CloudFormation and Dockerfiles in the repository are checked in the same scan as the code, using an IaC rule set of their own — separate from the rules the posture engine applies to deployed resources.",
      },
      {
        q: "Where does secret detection look?",
        onam: "Every file in the current state of the scanned branch, using community and Onam secret patterns for cloud keys, private keys, SaaS tokens and hard-coded credentials. It does not scan git history or test whether a credential is live.",
      },
      {
        q: "What does an automated fix actually do?",
        onam: "AI Code Fix rewrites each source file flagged by static analysis with a large language model and pushes the result to a separate branch. It opens no pull request, merges nothing and deploys nothing, and today it is run with you on request rather than from a console button. The full content of each affected file is sent to the model, which is worth knowing before you use it.",
      },
      {
        q: "What does it cost the team on day one?",
        onam: "A repository address and a scan. Nothing blocks a build, so the first week is reading findings, not negotiating exceptions with every team whose pipeline went red.",
      },
    ],
    honestLimit:
      "The honest gap: Snyk is built to meet developers where they write code — in the editor and the pull request, in its own words above. Onam does not run in the editor, and our AI Code Fix pushes a branch rather than opening a pull request. If developer adoption at the keyboard is the goal, Snyk is designed for that and we are not. Our case is code, dependency and app testing in the same platform as your cloud posture, with proven findings kept apart from noise.",
  },
  {
    slug: "onam-vs-cyera",
    metaTitle: "Onam vs Cyera for DSPM — six data security questions — Onam Security",
    name: "Cyera",
    shortName: "Cyera",
    domain: "Data security (DSPM)",
    platformHref: "/platform/data-security",
    metaDescription:
      "Onam vs Cyera for DSPM: Cyera in its own published words, six data security questions answered for Onam, and the honest gap on content classification.",
    intro:
      "If Cyera is on your DSPM shortlist with Onam, the two make a different first choice: Cyera, in its own words below, classifies the data itself; Onam builds the data question into the same graph as the rest of your cloud risk. These questions show which one fits.",
    inTheirWords: [
      {
        vendor: "Cyera",
        quotes: [
          "One unified platform to discover sensitive and proprietary data, govern human and AI access, and stop AI-driven risk in real time.",
          "Rapid agentless discovery and AI-native classification link sensitive and proprietary data with identities, access paths, and organizational context, enabling precise control of human and AI permissions and prioritization of real risk.",
        ],
        url: "https://www.cyera.com/platform",
        source: "cyera.com/platform",
        accessed: "5 October 2026",
      },
      {
        vendor: "Cyera DSPM",
        quotes: [
          "Uncover sensitive data across structured and unstructured sources, including what’s unique to your business. Cyera uses an AI-native classifier that adapts to your environment and classifies data automatically, with zero tuning.",
          "Take consistent actions on data that you trust over cloud, SaaS, DBaaS, and on-prem data stores.",
        ],
        url: "https://www.cyera.com/platform/dspm",
        source: "cyera.com/platform/dspm",
        accessed: "5 October 2026",
      },
    ],
    questions: [
      {
        q: "How is data classified — by reading contents, or from metadata?",
        onam: "From metadata: resource names, descriptions, tags, database and schema names, and configuration. Onam does not read the contents of files or rows to classify them. Because labels come from names and tags, the reason for a label is readable in the store's own name, and a wrong or missing label is corrected with a tag.",
      },
      {
        q: "Which data stores are covered?",
        onam: "Cloud data services across the clouds Onam scans: S3, RDS, Aurora, DynamoDB, Redshift and more on AWS; Blob Storage, Azure SQL, Cosmos DB and Data Lake Storage on Azure; GCS, BigQuery, Firestore and Spanner on GCP; the equivalents on OCI, Alibaba Cloud and IBM Cloud; Kubernetes secrets; plus self-hosted databases and Snowflake once onboarded.",
      },
      {
        q: "Who can actually reach the data — and by which path?",
        onam: "Each store shows the grants that make it public, the other accounts its policy lets in, the principals seen accessing it in the last 30 days, and the attack paths that end at it. A bucket that is encrypted at rest but publicly reachable is still treated as exposed. Per-identity effective permissions are answered in CIEM, on the same graph.",
      },
      {
        q: "Does it follow data after it lands?",
        onam: "Yes, as far as the cloud's resource relationships describe it. Replication, backup, ETL, streaming and export hops are linked into chains from the original source, and every hop that crosses a region or an account is flagged.",
      },
      {
        q: "Is a data finding connected to the rest of your cloud risk?",
        onam: 'It sits on the same graph as posture, identity and attack paths. A sensitive store becomes the crown jewel at the end of an attack path, so the question changes from "is this bucket risky" to "which chain of findings reaches it".',
      },
      {
        q: "What leaves your environment to make this work?",
        onam: "Metadata read through cloud APIs. Because classification does not read contents, the files and rows themselves are not copied out to be classified.",
      },
    ],
    honestLimit:
      "The honest gap: Onam classifies from metadata and does not read contents. Cyera describes AI-native classification of structured and unstructured data across cloud, SaaS, DBaaS and on-premises stores. If you need to know what is actually inside the files — or you need on-premises coverage — that is Cyera's design and not ours. Our case is data exposure joined to identity, network and attack paths on one graph.",
  },
  {
    slug: "onam-vs-ciem-tools",
    metaTitle: "Onam vs CIEM tools: Sonrai and Entra Permissions Management — Onam Security",
    name: "dedicated CIEM tools",
    shortName: "CIEM tools",
    referAs: "the dedicated CIEM tools",
    plural: true,
    domain: "Identity and entitlements (CIEM)",
    platformHref: "/platform/ciem",
    metaDescription:
      "Onam vs dedicated CIEM tools (Sonrai, the retired Entra Permissions Management): vendors in their own words, seven CIEM questions, one honest gap.",
    intro:
      "Cloud infrastructure entitlement management is sold both as a specialist product and as one engine inside a wider platform. If you are deciding between a dedicated CIEM tool and Onam — or replacing Microsoft Entra Permissions Management, which Microsoft has retired — these are the questions that separate the options.",
    inTheirWords: [
      {
        vendor: "Sonrai Security — Cloud Permissions Firewall",
        quotes: [
          "A one-click solution to least privilege without disrupting DevOps.",
          "The Cloud Permissions Firewall removes dangerous permissions before an attack can use them. Unused privileges, services, and regions are blocked in seconds with automated global policies.",
          "When an agent, human or machine needs new access, an automated just-in-time workflow is routed through your ChatOps tool for seamless approval.",
        ],
        url: "https://sonraisecurity.com/",
        source: "sonraisecurity.com",
        accessed: "5 October 2026",
      },
      {
        vendor: "Microsoft Entra Permissions Management",
        quotes: [
          "Microsoft Entra Permissions Management is a cloud infrastructure entitlement management (CIEM) solution that provides comprehensive visibility into permissions assigned to all identities.",
          "Effective April 1, 2025, Microsoft Entra Permissions Management will no longer be available for purchase, and on November 1, 2025, we'll retire and discontinue support of this product.",
        ],
        url: "https://learn.microsoft.com/en-us/previous-versions/entra/permissions-management/overview",
        source: "learn.microsoft.com, Permissions Management overview (previous versions)",
        accessed: "5 October 2026",
        note: "Microsoft's own documentation now sits under previous versions. If you are on it, you are choosing a replacement either way.",
      },
    ],
    questions: [
      {
        q: "Does it resolve effective permissions, or only list attached policies?",
        onam: "Effective permissions. On AWS, group policies are expanded onto members, conditions are classified, explicit denies are netted out and SCP deny statements are checked; Azure assignments, GCP bindings and Kubernetes RoleBindings resolve into the same table. Trust relationships are analysed alongside.",
      },
      {
        q: "Is unused access measured against real activity?",
        onam: "On AWS, yes: granted actions are compared with CloudTrail activity collected by Onam's threat detection, and the high-risk unused ones are listed. Usage-based analysis for the other clouds is not shipped yet. Findings that need no logs — escalation paths, shadow admins, cross-account trust — work as soon as the account is connected.",
      },
      {
        q: "Are machine identities first-class?",
        onam: "Yes. AWS roles are classified by who can assume them — AWS services, execution roles, CI/CD over OIDC, EKS service accounts, cross-account principals — and Azure managed identities, GCP service accounts and Kubernetes service accounts are resolved like users, with the link from each VM, instance or pod to the identity it runs as.",
      },
      {
        q: "Which privilege-escalation paths have actually been used?",
        onam: "Escalation paths found from policy are cross-checked against cloud detection and response: when the same identity has recently called escalation operations such as AssumeRole, PassRole or CreatePolicyVersion, the AWS finding is raised and marked CDR-confirmed. That shows the identity is exercising escalation operations; it does not prove each hop was walked.",
      },
      {
        q: "Does it look inside databases, or only at cloud IAM?",
        onam: "Partly. Database CIEM connects to databases with credentials you provide and detects identity activity inside them — new superuser and admin role grants, failed-login spikes, bulk reads. It does not yet analyse table-level grants as effective permissions.",
      },
      {
        q: "How does an access review end?",
        onam: "With a recorded decision. Each flagged identity carries a state — pending, needs remediation, reviewed or deferred — with the reviewer, the time and the evidence that triggered it, in an audit trail. Decisions expire and come back for review.",
      },
      {
        q: "Is identity risk connected to data and network exposure?",
        onam: "On the same graph. An over-permissioned role becomes one step in an attack path that ends at a sensitive data store, so it is ranked by what it reaches, not by how many permissions it has.",
      },
    ],
    honestLimit:
      "The honest gap: Onam finds dangerous and, on AWS, unused permissions, but it does not enforce anything. Nothing in Onam blocks a permission by policy or brokers just-in-time access — your team applies the change. If automated enforcement is what you are buying, Sonrai describes exactly that in its own words above, and we do not offer it.",
  },
];

export const getCompetitor = (slug: string) => COMPETITORS.find((c) => c.slug === slug);

/** The questions a page answers: its own for a domain comparison, else the shared seven. */
export const questionsFor = (c: Competitor) => c.questions ?? QUESTIONS;

/** Number words for headings ("The seven questions"). */
export const countWord = (n: number) =>
  ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"][n] ??
  String(n);

/**
 * Provenance line shown on the index page. Update the date whenever the shared
 * questions are revisited — a comparison page with no date silently rots.
 */
export const VERIFIED_ON = "5 October 2026";
