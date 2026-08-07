/**
 * Industry scenarios — sector archetypes, not customers.
 *
 * Content mirrors the five one-pagers in the case-study collection
 * (public/case-studies/Onam-Case-Studies.pdf), which labels every one of them
 * "ILLUSTRATIVE SCENARIO" and states plainly: "not a real or named customer;
 * the path and figures are illustrative, not outcomes."
 *
 * That framing is carried through here deliberately and must not be softened.
 * The PDF is publicly linked from /resources — a page claiming real customers
 * would be contradicted in one click.
 *
 * One deviation from the source: the PDF's "THE USP" quadrant uses absolute
 * competitive claims ("No competitor prices the path in dollars", "Only Onam
 * …"). Those are unverifiable superlatives about third parties, so the
 * `differentiator` field below states the same substance as a positive claim
 * about what Onam does. Sales collateral can carry that phrasing; indexed web
 * copy should not.
 */

export type ScenarioNode = { label: string; chokePoint?: boolean };

export type Scenario = {
  slug: string;
  title: string;
  /** Stack / data / stakes, shown under the title. */
  context: string;
  /** Left-to-right attack path; exactly one node is the choke point. */
  path: ScenarioNode[];
  challenge: string;
  brings: string;
  advantage: string;
  differentiator: string;
  /** Accent colour for this sector's card. */
  accent: string;
};

export const SCENARIOS: Scenario[] = [
  {
    slug: "financial-services",
    title: "A leading financial-services firm",
    context: "AWS + Azure · trading apps, PII, payment data · PCI-DSS & SOX",
    path: [{ label: "Public LB" }, { label: "App role", chokePoint: true }, { label: "RDS (PII)" }],
    challenge:
      "Audit season means assembling evidence from many tools, and the board asks one question the stack can't answer: how exposed are we, in dollars?",
    brings:
      "The public-LB → app-role → RDS (PII) path surfaces and is priced with FAIR/ALE; posture auto-maps to PCI-DSS controls on the same graph.",
    advantage:
      "A defensible dollar figure for the cardholder-data path plus the single fix that cuts it most — and audit evidence from one source.",
    differentiator:
      "The path is priced in dollars, so the CISO walks into the board meeting with a number rather than a spreadsheet of criticals.",
    accent: "#2563EB",
  },
  {
    slug: "ecommerce",
    title: "A high-growth e-commerce platform",
    context: "GCP + AWS · customer PII & payments · must not go down at peak",
    path: [
      { label: "Internet fn", chokePoint: true },
      { label: "IMDS" },
      { label: "IAM role" },
      { label: "S3 (PII)" },
    ],
    challenge:
      "Security can't be the team that slows releases — but a breach at peak season is existential, and no tool shows what an attacker could actually reach.",
    brings:
      "A four-hop path (internet function → IMDS → IAM → S3 PII) surfaces, is verified and priced; the function is the choke point.",
    advantage:
      "Fix one node and the largest cluster of reachable paths is gone. Read-only connect means zero drag on the release pipeline.",
    differentiator:
      "Priced paths within minutes of connecting, and peak-season exposure as a number you can track release over release.",
    accent: "#059669",
  },
  {
    slug: "gaming",
    title: "A global gaming company",
    context: "Multi-cloud live services · millions of players · CI/CD to prod daily",
    path: [{ label: "CI token", chokePoint: true }, { label: "Prod deploy" }, { label: "Player DB" }],
    challenge:
      "A compromised deploy is a breach and an outage at once; player data and uptime are the crown jewels, and the CI/CD path is invisible to point tools.",
    brings:
      "A long-lived CI token → prod-deploy → player-DB path surfaces and is ranked by combined breach and downtime exposure; the token is the choke point.",
    advantage:
      "Rotate or scope one CI token and the riskiest deploy paths close — exposure tracked release over release.",
    differentiator:
      "Player-data and downtime exposure are priced on one graph, giving a live-ops board a single number instead of two disconnected risk stories.",
    accent: "#7C3AED",
  },
  {
    slug: "sap-msp",
    title: "A leading SAP managed-service provider",
    context: "Multi-tenant SAP across AWS + Azure · dozens of enterprise customers",
    path: [
      { label: "Internet" },
      { label: "Jump host" },
      { label: "Operator role", chokePoint: true },
      { label: "Customer SAP" },
    ],
    challenge:
      "Cross-tenant risk is correlated by hand across six consoles. One blind spot in a shared component can breach many customers at once.",
    brings:
      "One graph across every tenant. A shared operator role surfaces as the choke point for the most cross-tenant paths — verified across five domains and MITRE-mapped.",
    advantage:
      "Scope that one operator role and the largest block of cross-tenant paths collapses together — measured, not guessed.",
    differentiator:
      "The cross-tenant route is priced in dollars on one graph — the assurance number an MSP's own customers ask for.",
    accent: "#EA580C",
  },
  {
    slug: "beauty-cpg",
    title: "A leading beauty / CPG brand",
    context: "M365 + SaaS (Okta, GitHub) + cloud · loyalty data · brand trust is the asset",
    path: [
      { label: "Okta identity", chokePoint: true },
      { label: "Cloud access" },
      { label: "Loyalty DB" },
    ],
    challenge:
      "Identity and data live in SaaS as much as in cloud, but the two are secured in separate tools — so the SaaS-to-cloud path to loyalty data is a blind spot.",
    brings:
      "SSPM puts the SaaS identity on the same graph as cloud; a federated Okta identity → cloud → loyalty-DB path surfaces as the choke point.",
    advantage:
      "Tighten one federated identity and the SaaS-to-cloud brand-risk paths drop — visible only because SaaS and cloud share one graph.",
    differentiator:
      "SaaS (SSPM) and cloud sit on one priced graph, so brand-risk exposure is expressed in dollars rather than split across two tools.",
    accent: "#DB2777",
  },
];
