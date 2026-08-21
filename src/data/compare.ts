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
};

/** The seven questions. Identical on every page — they are criteria, not claims. */
export const QUESTIONS: { q: string; onam: string }[] = [
  {
    q: "How many clouds get first-class treatment?",
    onam:
      "Seven, on the same footing: AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud and Kubernetes. 11,346 posture rule definitions across 549 cloud services — the all-cloud totals, not a per-cloud figure. Ask any vendor for the per-cloud breakdown rather than the headline number; that is where first-class and box-ticked diverge.",
  },
  {
    q: "Is the analysis cross-cloud, or per-cloud silos side by side?",
    onam:
      "One security graph. Every engine writes the same finding contract into one store, so a path can start in one cloud and end in another. Correlation is a property of the data model here, not a report generated over separate databases.",
  },
  {
    q: "Agentless — and how long to first finding?",
    onam:
      "Agentless and read-only. Nothing is installed in your workloads and nothing is written back to your accounts. The trade-off is stated in the trust whitepaper: read-only scanning cannot see inside a running process.",
  },
  {
    q: "How does it prioritise — severity labels or business impact?",
    onam:
      "By verified attack path, then priced with FAIR using named external inputs. A ranked list of criticals tells you what is broken; a priced path tells you which chain reaches data and what it would cost. Ask to see the arithmetic, not just the ranking.",
  },
  {
    q: "Does it catch toxic combinations across engines?",
    onam:
      "That is the whole design. The chain that reaches your data is usually four ordinary findings in a row, none of which any single rule would flag. Composition across posture, identity, data, workload and SaaS happens on one graph rather than by joining exports.",
  },
  {
    q: "Is compliance evidence continuous or point-in-time?",
    onam:
      "A control is evaluated once and reported against 78 compliance frameworks, continuously, with each gap connected to the path it sits on. Evidence for an audit — your auditor still decides what satisfies a control.",
  },
  {
    q: "Does coverage span code to runtime?",
    onam:
      "Posture, attack paths, identity (CIEM), data, containers and Kubernetes, SaaS posture across 8 platforms, and cloud detection and response — 29 engines on one graph rather than six products stitched together.",
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
];

export const getCompetitor = (slug: string) => COMPETITORS.find((c) => c.slug === slug);

/**
 * Provenance line shown on every page. Update the date whenever the strengths
 * sections are revisited — a comparison page with no date silently rots.
 */
export const VERIFIED_ON = "15 August 2026";
