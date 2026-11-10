/**
 * Onam list prices and the unit model behind the /pricing calculator.
 *
 * Source of truth: marketing/onam-assets/pricing-research/Onam-pricing-structure-draft.xlsx
 * (owner decisions in chat, 10 Nov 2026). Change a number here and the page,
 * the calculator and the FAQ all follow. Do not hard-code a price anywhere else.
 */

export const UNIT_PRICE = 20; // USD per unit per month, cloud (CNAPP) and SaaS
export const MIN_UNITS = 25; // smallest monthly bill, in units
export const DEV_PRICE = 39; // USD per active developer per month, code security

/**
 * Two cloud plans. Same unit counting; Posture drops agentless vulnerability and
 * malware scanning for customers who already run another scanner. Posture's
 * rates are the Complete rates times `rateFactor` ($20 -> $14 per unit).
 */
export const CLOUD_PLANS = [
  {
    key: "complete",
    name: "Complete",
    unitPrice: 20,
    rateFactor: 1,
    summary: "Posture, identity, data and agentless vulnerability and malware scanning",
    includes: ["Posture (CSPM, KSPM) and compliance", "Identity and permissions (CIEM)", "Sensitive data (DSPM)", "Agentless vulnerability and malware scanning"],
  },
  {
    key: "posture",
    name: "Posture",
    unitPrice: 14,
    rateFactor: 0.7,
    summary: "Everything in Complete except vulnerability and malware scanning, for teams that already run a scanner",
    includes: ["Posture (CSPM, KSPM) and compliance", "Identity and permissions (CIEM)", "Sensitive data (DSPM)", "Bring your own scanner: no vulnerability or malware scanning"],
  },
] as const;
export type CloudPlanKey = (typeof CLOUD_PLANS)[number]["key"];

/** Volume brackets: each slice of units is charged at its own rate, like tax brackets. */
export const UNIT_BRACKETS = [
  { from: 0, to: 500, rate: 20, label: "First 500 units" },
  { from: 500, to: 1000, rate: 18.34, label: "Units 501 to 1,000" },
  { from: 1000, to: 5000, rate: 16.66, label: "Units 1,001 to 5,000" },
  { from: 5000, to: 10000, rate: 15, label: "Units 5,001 to 10,000" },
  { from: 10000, to: Infinity, rate: 13.4, label: "Above 10,000 units" },
] as const;

export const DEV_BRACKETS = [
  { from: 0, to: 50, rate: 39, label: "First 50 developers" },
  { from: 50, to: 200, rate: 35.76, label: "Developers 51 to 200" },
  { from: 200, to: Infinity, rate: 32.49, label: "Above 200 developers" },
] as const;

export type Bracket = { from: number; to: number; rate: number; label: string };

/** Unit brackets for a plan (Posture = Complete rates x 0.7, rounded to cents). */
export const planBrackets = (factor: number): Bracket[] =>
  UNIT_BRACKETS.map((b) => ({ ...b, rate: Math.round(b.rate * factor * 100) / 100 }));

/** Price for a quantity across brackets. Returns the total and the slices used. */
export function bracketPrice(qty: number, brackets: readonly Bracket[]) {
  const slices: { label: string; qty: number; rate: number; cost: number }[] = [];
  let total = 0;
  for (const b of brackets) {
    if (qty <= b.from) break;
    const q = Math.min(qty, b.to) - b.from;
    const cost = q * b.rate;
    slices.push({ label: b.label, qty: q, rate: b.rate, cost });
    total += cost;
  }
  return { total, slices };
}

export type CloudResource = {
  key: string;
  label: string;
  examples: string;
  /** Units per resource. */
  factor: number;
  /** How the factor reads to a buyer. */
  ratio: string;
  defaults: { small: number; mid: number; large: number };
};

/** Paid cloud resource types. Everything not listed is scanned and reported free. */
export const CLOUD_RESOURCES: CloudResource[] = [
  { key: "vm", label: "Virtual machines", examples: "EC2, Azure VMs and scale-set instances, Compute Engine, OCI, Alibaba ECS, IBM VPC instances", factor: 1, ratio: "1 unit each", defaults: { small: 15, mid: 120, large: 900 } },
  { key: "node", label: "Kubernetes nodes", examples: "Nodes in EKS, AKS, GKE, OKE, ACK, IBM or self-managed clusters", factor: 1, ratio: "1 unit each", defaults: { small: 0, mid: 30, large: 400 } },
  { key: "cluster", label: "Kubernetes clusters", examples: "Cluster posture (KSPM); pods and containers add nothing", factor: 1, ratio: "1 unit each", defaults: { small: 0, mid: 3, large: 25 } },
  { key: "db", label: "Managed databases", examples: "RDS and Aurora, Azure SQL, Cloud SQL, AlloyDB, OCI Autonomous DB, PolarDB", factor: 0.5, ratio: "2 = 1 unit", defaults: { small: 2, mid: 15, large: 120 } },
  { key: "warehouse", label: "Warehouses and NoSQL accounts", examples: "Redshift, Synapse, BigQuery datasets, Spanner, Cosmos DB accounts", factor: 0.5, ratio: "2 = 1 unit", defaults: { small: 0, mid: 4, large: 40 } },
  { key: "bucket", label: "Storage buckets and accounts", examples: "S3, Azure storage accounts, Cloud Storage, OCI and IBM buckets, OSS", factor: 0.1, ratio: "10 = 1 unit", defaults: { small: 20, mid: 150, large: 1500 } },
  { key: "fs", label: "File systems and NoSQL tables", examples: "EFS, Azure Files, Filestore, DynamoDB tables", factor: 0.1, ratio: "10 = 1 unit", defaults: { small: 0, mid: 20, large: 200 } },
  { key: "serverless", label: "Serverless containers", examples: "Fargate and ECS tasks, App Runner, Container Apps, Cloud Run", factor: 0.1, ratio: "10 = 1 unit", defaults: { small: 0, mid: 40, large: 600 } },
  { key: "function", label: "Functions and web apps", examples: "Lambda, Azure Functions and App Service, Cloud Functions, OCI Functions", factor: 0.02, ratio: "50 = 1 unit", defaults: { small: 25, mid: 300, large: 3000 } },
  { key: "cache", label: "Caches, search and streams", examples: "ElastiCache, OpenSearch, Azure Cache for Redis, Memorystore, Kinesis", factor: 0.25, ratio: "4 = 1 unit", defaults: { small: 0, mid: 8, large: 80 } },
  { key: "ai", label: "AI and ML services", examples: "SageMaker endpoints, Bedrock, Azure OpenAI, Vertex AI endpoints", factor: 0.5, ratio: "2 = 1 unit", defaults: { small: 0, mid: 4, large: 40 } },
  { key: "registry", label: "Container image repositories", examples: "ECR, Azure Container Registry, Artifact Registry, OCI and Alibaba registries", factor: 0.05, ratio: "20 = 1 unit", defaults: { small: 2, mid: 30, large: 300 } },
  { key: "selfmanaged", label: "Self-managed servers and devices", examples: "Your own databases, Linux hosts, firewalls and routers, web servers, VMware ESXi, Docker hosts", factor: 0.1, ratio: "10 = 1 unit", defaults: { small: 0, mid: 20, large: 300 } },
];

export const FREE_RESOURCES =
  "Identities and roles, networks and subnets, security groups, load balancers, disks, snapshots, keys, policies, DNS and logs";

export type SaasBand = { key: string; label: string; units: number | null };
export const SAAS_BANDS: SaasBand[] = [
  { key: "none", label: "Not connected", units: 0 },
  { key: "b100", label: "Up to 100 users", units: 5 },
  { key: "b500", label: "101 to 500 users", units: 15 },
  { key: "b2000", label: "501 to 2,000 users", units: 40 },
  { key: "b10000", label: "2,001 to 10,000 users", units: 100 },
  { key: "over", label: "Over 10,000 users", units: null },
];

export const SAAS_PLATFORMS = [
  { key: "m365", label: "Microsoft 365", note: "Entra ID, Exchange, Teams, OneDrive and SharePoint in one tenant" },
  { key: "dynamics", label: "Dynamics 365", note: "Per production environment; sandboxes free" },
  { key: "workspace", label: "Google Workspace", note: "Per Workspace domain" },
  { key: "okta", label: "Okta", note: "Per Okta org" },
  { key: "github", label: "GitHub", note: "Organisation settings; code scanning is priced per developer" },
  { key: "gitlab", label: "GitLab", note: "Group or instance settings" },
  { key: "snowflake", label: "Snowflake", note: "Per Snowflake account" },
];

export const usd = (n: number, cents = false) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: cents ? 2 : 0, minimumFractionDigits: cents ? 2 : 0 });
export const num = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });

/** Customer size, worked out from the total cloud and SaaS units. */
export const SIZES = [
  { upTo: 100, label: "Small", note: "Up to 100 units" },
  { upTo: 500, label: "Mid-size", note: "101 to 500 units" },
  { upTo: 5000, label: "Large", note: "501 to 5,000 units" },
  { upTo: 10000, label: "Very large", note: "5,001 to 10,000 units" },
  { upTo: Infinity, label: "Enterprise", note: "Above 10,000 units" },
] as const;
export const sizeFor = (units: number) => SIZES.find((s) => units <= s.upTo)!;
