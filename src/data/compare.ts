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
 * questions a buyer should ask, answer them **only for Onam**, and say plainly
 * where the other platform is strong. A question is not a claim. An answer
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
  /**
   * Where they are genuinely strong. Generic, widely-known and complimentary
   * by design — market position, ecosystem, heritage. Never a capability
   * assertion, which would need sourcing.
   */
  strengths: string[];
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
    onam: "Seven, on the same footing: AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud and Kubernetes. 11,433 posture rule definitions across 549 cloud services — the all-cloud totals, not a per-cloud figure. Ask any vendor for the per-cloud breakdown rather than the headline number; that is where first-class and box-ticked diverge.",
  },
  {
    q: "Is the analysis cross-cloud, or per-cloud silos side by side?",
    onam: "One security graph. Every engine writes the same finding contract into one store, so a path can start in one cloud and end in another. Correlation is a property of the data model here, not a report generated over separate databases.",
  },
  {
    q: "Agentless — and how long to first finding?",
    onam: "Agentless. Posture scanning connects through read-only cloud roles; agentless workload scanning runs inside your account, using resources deployed there at onboarding. No agent runs on your workloads. The trade-off is stated in the trust whitepaper: snapshot scanning cannot see inside a running process.",
  },
  {
    q: "How does it prioritise — severity labels or business impact?",
    onam: "By verified attack path, then priced with FAIR using named external inputs. A ranked list of criticals tells you what is broken; a priced path tells you which chain reaches data and what it would cost. Ask to see the arithmetic, not just the ranking.",
  },
  {
    q: "Does it catch toxic combinations across engines?",
    onam: "That is the whole design. The chain that reaches your data is usually four ordinary findings in a row, none of which any single rule would flag. Composition across posture, identity, data, workload and SaaS happens on one graph rather than by joining exports.",
  },
  {
    q: "Is compliance evidence continuous or point-in-time?",
    onam: "A control is evaluated once and reported against 78 compliance frameworks, continuously, with each gap connected to the path it sits on. Evidence for an audit — your auditor still decides what satisfies a control.",
  },
  {
    q: "Does coverage span code to runtime?",
    onam: "Posture, attack paths, identity (CIEM), data, containers and Kubernetes, SaaS posture across 8 platforms, and cloud detection and response — 29 engines on one graph rather than six products stitched together.",
  },
];

export const COMPETITORS: Competitor[] = [
  {
    slug: "onam-vs-wiz",
    name: "Wiz",
    shortName: "Wiz",
    intro:
      "Wiz is on nearly every CSPM shortlist, and deservedly — it defined how most buyers think about agentless cloud security. If you are evaluating both, these are the seven questions worth asking each of us.",
    strengths: [
      "It set the reference point for agentless graph-based cloud security — the category largely follows its shape",
      "A very large integration ecosystem and a mature partner network",
      "Brand recognition that carries weight in a board conversation, which is a real advantage when you need budget",
      "A substantial security research organisation behind the product",
    ],
    honestLimit:
      "The honest gap: Wiz has thousands of customers and years of production hardening. We have no public reference customers yet. If proven scale at enterprise size is your first filter, that filter does not select us today.",
  },
  {
    slug: "onam-vs-orca",
    name: "Orca Security",
    shortName: "Orca",
    intro:
      "Orca made agentless scanning credible to buyers who had been told an agent was unavoidable. If it is on your shortlist alongside us, run these seven questions against both.",
    strengths: [
      "An early and influential agentless architecture — it moved the whole category away from agent-everywhere",
      "A mature product with a long track record in production estates",
      "A strong reputation for interface and workflow quality",
      "An established ecosystem and integration surface",
    ],
    honestLimit:
      "The honest gap: Orca has been deployed at scale for years and has the operational scar tissue that comes with it. We are newer, and our integration surface is smaller. Judge us on the graph and the paths, not on breadth of integrations.",
  },
  {
    slug: "onam-vs-prisma-cloud",
    name: "Palo Alto Prisma Cloud",
    shortName: "Prisma Cloud",
    intro:
      "Prisma Cloud usually arrives as part of a wider Palo Alto conversation, which changes the evaluation. If you are weighing it against us, these seven questions apply to both.",
    strengths: [
      "Breadth across a large security portfolio, and one commercial relationship covering much of it",
      "Deep network and firewall heritage that most cloud-native vendors do not have",
      "Existing enterprise agreements that can make procurement dramatically simpler",
      "Global support and professional services at a scale a startup cannot match",
    ],
    honestLimit:
      "The honest gap: if you already run Palo Alto across the estate, the consolidation argument runs in their favour, not ours. We are one platform for cloud security, not a portfolio, and we do not pretend that is the same thing.",
  },
  {
    slug: "onam-vs-defender",
    name: "Microsoft Defender for Cloud",
    shortName: "Defender for Cloud",
    intro:
      "Defender for Cloud is the default consideration for Azure-centred estates, and often the incumbent by the time anyone evaluates. These seven questions are worth asking of both of us.",
    strengths: [
      "Native to Azure, with an integration depth into the Microsoft estate that no third party matches",
      "Frequently already licensed, which removes procurement friction entirely",
      "One vendor relationship, one support path, one bill",
      "Microsoft's threat intelligence is among the largest in the world",
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
      "Snyk is the name most developers already know in application security. If it is on your list next to Onam for code security, the useful framing is that the two start from opposite ends: Snyk from where code is written, Onam from the cloud the code runs in. These are the questions that decide which end your team needs first.",
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
    strengths: [
      "One of the most widely recognised names in developer security — engineering teams often know it before the security team brings it up",
      "A product family under one vendor that it lists as covering code, open source dependencies, containers, IaC and secrets",
      "A developer-first design centred on the editor and the pull request, by its own description quoted above",
      "A long-running vulnerability research and intelligence operation behind the product",
    ],
    questions: [
      {
        q: "Where does a finding first reach the developer?",
        onam: "After a scan of the repository, in the Onam platform. A build gate is available but off by default: scans report, and the pipeline fails on findings only when you switch that on. Onam does not run in the developer's editor today.",
      },
      {
        q: "Does a dependency finding know whether the code is running and reachable?",
        onam: "Yes — that is the reason to put code findings on the cloud graph. A dependency finding is joined to the running workload, so it carries whether that workload is internet-reachable and what identity it holds, and SCA reports whether the vulnerable function is actually called.",
      },
      {
        q: "Does a runtime misconfiguration trace back to the template that created it?",
        onam: "Yes. Every runtime finding keeps its provenance — the repository, template and resource block that produced it — so the fix lands in code and does not reappear on the next terraform apply.",
      },
      {
        q: "Are IaC templates judged by the same rules as the running cloud?",
        onam: "Yes. Terraform, CloudFormation, Helm and Kubernetes manifests are evaluated against the same policy set the runtime posture engine uses, so a template is judged before it creates anything and the verdict matches what production would get.",
      },
      {
        q: "Where does secret detection look?",
        onam: "Source, container image layers, pipeline configuration and committed state files — the places copies of a secret accumulate, not only the secrets store where things are done correctly.",
      },
      {
        q: "What does an automated fix actually do?",
        onam: "AI Code Fix rewrites each source file flagged by static analysis with a large language model and pushes the result to a separate branch. It opens no pull request, merges nothing and deploys nothing. The full content of each affected file is sent to the model, which is worth knowing before you turn it on.",
      },
      {
        q: "What does it cost the team on day one?",
        onam: "A repository connection and a scan. Nothing blocks a build until you decide it should, so the first week is reading findings, not negotiating exceptions with every team whose pipeline went red.",
      },
    ],
    honestLimit:
      "The honest gap: Snyk is built to meet developers where they write code — in the editor and the pull request, in its own words above. Onam does not run in the editor, and our AI Code Fix pushes a branch rather than opening a pull request. If developer adoption at the keyboard is the goal, Snyk is designed for that and we are not. Our case is the join between code findings and the running cloud.",
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
      "Cyera is one of the companies that defined data security posture management as a category. If it is on your DSPM shortlist with Onam, the two make a different first choice: Cyera builds out from the data itself, Onam builds the data question into the same graph as the rest of your cloud risk. These questions show which one fits.",
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
    strengths: [
      "A company built around data security from the start, rather than one that added DSPM to another product",
      "Strong market momentum and analyst attention in data security posture management",
      "Coverage it describes as reaching beyond public cloud to SaaS, DBaaS and on-premises stores, in its own words above",
      "A platform that, by its own description, extends from data discovery into DLP, identity and AI agents",
    ],
    questions: [
      {
        q: "How is data classified — by reading contents, or from metadata?",
        onam: "From metadata: resource names, tags, table and column names, schemas and configuration. Onam does not read the contents of files or rows to classify them. Where the metadata is ambiguous, the finding is labelled low-confidence so a person can confirm it.",
      },
      {
        q: "Which data stores are covered?",
        onam: "Cloud data services across the clouds Onam scans: S3, RDS, Aurora, DynamoDB, Redshift and more on AWS; Blob Storage, Azure SQL, Cosmos DB and Data Lake Storage on Azure; GCS, BigQuery, Firestore and Spanner on GCP; the equivalents on OCI and Alibaba Cloud; plus Snowflake and Databricks.",
      },
      {
        q: "Who can actually reach the data — and by which path?",
        onam: "Classification is joined to the identity graph, so each store lists the principals that can read or write it and the route they take. Network reachability is layered on top: a bucket that is encrypted at rest but publicly reachable is treated as exposed.",
      },
      {
        q: "Does it follow data after it lands?",
        onam: "Yes. Lineage reconstructs each pipeline chain from source to destination and grades it, so an encrypted source feeding an unencrypted analytics table is one finding about the flow rather than two unrelated findings about two stores.",
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
    strengths: [
      "Specialist focus: a dedicated CIEM vendor spends all of its attention on identity and least privilege",
      "Enforcement rather than recommendation, in Sonrai's own description above — unused permissions blocked by policy, new access granted just in time",
      "A workflow that lets engineering request access through ChatOps instead of a ticket queue, by the same description",
      "Depth in the category: several established specialists, so a buyer who wants a dedicated identity product has real choice",
    ],
    questions: [
      {
        q: "Does it resolve effective permissions, or only list attached policies?",
        onam: "Effective permissions. The engine walks every policy, group membership and cross-account trust for each identity to compute what it can actually do — not just what is attached to it.",
      },
      {
        q: "Is unused access measured against real activity?",
        onam: "Yes, against 90 days of CloudTrail, Azure Activity Log and GCP Cloud Audit Logs. Findings that need no logs — shadow admins, cross-account trust, MFA gaps — work as soon as the account is connected.",
      },
      {
        q: "Are machine identities first-class?",
        onam: "Yes. Lambda execution roles, EC2 instance profiles, EKS pod identities, GCP workload identities and Azure managed identities are analysed the same way as people: effective permissions resolved, usage tracked, unused surface reported.",
      },
      {
        q: "Which privilege-escalation paths have actually been used?",
        onam: "Escalation paths are searched on the identity graph and cross-checked against cloud detection and response, so a path that has been walked is separated from one that is merely possible.",
      },
      {
        q: "Does it look inside databases, or only at cloud IAM?",
        onam: "Both. Database CIEM reads the grants inside managed databases. An identity with no IAM path to production data but a standing grant on the database itself is invisible to a tool that reads only the provider's IAM layer.",
      },
      {
        q: "How does an access review end?",
        onam: "With a recorded decision. Every identity carries a state — pending, needs remediation, reviewed or deferred — with an owner and the finding that triggered it, rather than a spreadsheet emailed once a quarter.",
      },
      {
        q: "Is identity risk connected to data and network exposure?",
        onam: "On the same graph. An over-permissioned role becomes one step in an attack path that ends at a sensitive data store, so it is ranked by what it reaches, not by how many permissions it has.",
      },
    ],
    honestLimit:
      "The honest gap: Onam finds unused and dangerous permissions and generates right-sized policies from real usage, but it does not enforce them. Nothing in Onam blocks a permission by policy or brokers just-in-time access — your team applies the change. If automated enforcement is what you are buying, Sonrai describes exactly that in its own words above, and we do not offer it.",
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
 * Provenance line shown on every page. Update the date whenever the strengths
 * sections are revisited — a comparison page with no date silently rots.
 */
export const VERIFIED_ON = "15 August 2026";
