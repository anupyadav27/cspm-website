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
    includes: [
      "Posture (CSPM, KSPM) and compliance",
      "Identity and permissions (CIEM)",
      "Sensitive data (DSPM)",
      "Agentless vulnerability and malware scanning",
    ],
  },
  {
    key: "posture",
    name: "Posture",
    unitPrice: 14,
    rateFactor: 0.7,
    summary:
      "Everything in Complete except vulnerability and malware scanning, for teams that already run a scanner",
    includes: [
      "Posture (CSPM, KSPM) and compliance",
      "Identity and permissions (CIEM)",
      "Sensitive data (DSPM)",
      "Bring your own scanner: no vulnerability or malware scanning",
    ],
  },
] as const;
export type CloudPlanKey = (typeof CLOUD_PLANS)[number]["key"];

/**
 * Volume levels. Once the total reaches a level, every unit gets that level's
 * discount. A cap stops the bill dropping at a step: nobody pays more than the
 * price at the start of the next level up, so the bill only ever rises with size.
 */
export type Level = { from: number; off: number; label: string };

export const UNIT_LEVELS: readonly Level[] = [
  { from: 0, off: 0, label: "Under 500 units" },
  { from: 500, off: 0.083, label: "500+ units" },
  { from: 1000, off: 0.167, label: "1,000+ units" },
  { from: 5000, off: 0.25, label: "5,000+ units" },
  { from: 10000, off: 0.33, label: "10,000+ units" },
];

export const DEV_LEVELS: readonly Level[] = [
  { from: 0, off: 0, label: "Under 50 developers" },
  { from: 50, off: 0.083, label: "50+ developers" },
  { from: 200, off: 0.167, label: "200+ developers" },
];

/** Rate per item at a level, rounded to cents. */
export const levelRate = (list: number, l: Level) => Math.round(list * (1 - l.off) * 100) / 100;

const cents = (n: number) => Math.round(n * 100) / 100;

/**
 * Price for `qty` items at `list` per item with volume levels.
 * Returns list price, discount, total, the level applied and whether the cap applied.
 */
export function volumePrice(qty: number, list: number, levels: readonly Level[]) {
  const listTotal = cents(qty * list);
  if (qty <= 0) return { list: 0, discount: 0, total: 0, level: levels[0], capped: false };
  let own = levels[0];
  for (const l of levels) if (qty >= l.from) own = l;
  let total = cents(qty * levelRate(list, own));
  let level = own;
  let capped = false;
  for (const l of levels) {
    if (l.from > qty) {
      const cap = cents(l.from * levelRate(list, l));
      if (cap < total) {
        total = cap;
        level = l;
        capped = true;
      }
    }
  }
  return { list: listTotal, discount: cents(listTotal - total), total, level, capped };
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
  {
    key: "vm",
    label: "Virtual machines",
    examples:
      "EC2, Azure VMs and scale-set instances, Compute Engine, OCI, Alibaba ECS, IBM VPC instances",
    factor: 1,
    ratio: "1 unit each",
    defaults: { small: 15, mid: 120, large: 900 },
  },
  {
    key: "node",
    label: "Kubernetes nodes",
    examples: "Nodes in EKS, AKS, GKE, OKE, ACK, IBM or self-managed clusters",
    factor: 1,
    ratio: "1 unit each",
    defaults: { small: 0, mid: 30, large: 400 },
  },
  {
    key: "cluster",
    label: "Kubernetes clusters",
    examples: "Cluster posture (KSPM); pods and containers add nothing",
    factor: 1,
    ratio: "1 unit each",
    defaults: { small: 0, mid: 3, large: 25 },
  },
  {
    key: "db",
    label: "Managed databases",
    examples: "RDS and Aurora, Azure SQL, Cloud SQL, AlloyDB, OCI Autonomous DB, PolarDB",
    factor: 0.5,
    ratio: "2 = 1 unit",
    defaults: { small: 2, mid: 15, large: 120 },
  },
  {
    key: "warehouse",
    label: "Warehouses and NoSQL accounts",
    examples: "Redshift, Synapse, BigQuery datasets, Spanner, Cosmos DB accounts",
    factor: 0.5,
    ratio: "2 = 1 unit",
    defaults: { small: 0, mid: 4, large: 40 },
  },
  {
    key: "bucket",
    label: "Storage buckets and accounts",
    examples: "S3, Azure storage accounts, Cloud Storage, OCI and IBM buckets, OSS",
    factor: 0.1,
    ratio: "10 = 1 unit",
    defaults: { small: 20, mid: 150, large: 1500 },
  },
  {
    key: "fs",
    label: "File systems and NoSQL tables",
    examples: "EFS, Azure Files, Filestore, DynamoDB tables",
    factor: 0.1,
    ratio: "10 = 1 unit",
    defaults: { small: 0, mid: 20, large: 200 },
  },
  {
    key: "serverless",
    label: "Serverless containers",
    examples: "Fargate and ECS tasks, App Runner, Container Apps, Cloud Run",
    factor: 0.1,
    ratio: "10 = 1 unit",
    defaults: { small: 0, mid: 40, large: 600 },
  },
  {
    key: "function",
    label: "Functions and web apps",
    examples: "Lambda, Azure Functions and App Service, Cloud Functions, OCI Functions",
    factor: 0.02,
    ratio: "50 = 1 unit",
    defaults: { small: 25, mid: 300, large: 3000 },
  },
  {
    key: "cache",
    label: "Caches, search and streams",
    examples: "ElastiCache, OpenSearch, Azure Cache for Redis, Memorystore, Kinesis",
    factor: 0.25,
    ratio: "4 = 1 unit",
    defaults: { small: 0, mid: 8, large: 80 },
  },
  {
    key: "ai",
    label: "AI and ML services",
    examples: "SageMaker endpoints, Bedrock, Azure OpenAI, Vertex AI endpoints",
    factor: 0.5,
    ratio: "2 = 1 unit",
    defaults: { small: 0, mid: 4, large: 40 },
  },
  {
    key: "registry",
    label: "Container image repositories",
    examples: "ECR, Azure Container Registry, Artifact Registry, OCI and Alibaba registries",
    factor: 0.05,
    ratio: "20 = 1 unit",
    defaults: { small: 2, mid: 30, large: 300 },
  },
  {
    key: "selfmanaged",
    label: "Self-managed servers and devices",
    examples:
      "Your own databases, Linux hosts, firewalls and routers, web servers, VMware ESXi, Docker hosts",
    factor: 0.1,
    ratio: "10 = 1 unit",
    defaults: { small: 0, mid: 20, large: 300 },
  },
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
  {
    key: "m365",
    label: "Microsoft 365",
    note: "Entra ID, Exchange, Teams, OneDrive and SharePoint in one tenant",
  },
  { key: "dynamics", label: "Dynamics 365", note: "Per production environment; sandboxes free" },
  { key: "workspace", label: "Google Workspace", note: "Per Workspace domain" },
  { key: "okta", label: "Okta", note: "Per Okta org" },
  {
    key: "github",
    label: "GitHub",
    note: "Organisation settings; code scanning is priced per developer",
  },
  { key: "gitlab", label: "GitLab", note: "Group or instance settings" },
  { key: "snowflake", label: "Snowflake", note: "Per Snowflake account" },
];

export const usd = (n: number, cents = false) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: cents ? 2 : 0,
    minimumFractionDigits: cents ? 2 : 0,
  });
export const num = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });

/** Customer size, worked out from the total cloud and SaaS units. */
export const SIZES = [
  { upTo: 100, label: "Small", note: "Up to 100 units" },
  { upTo: 499.99, label: "Mid-size", note: "101 to 499 units" },
  { upTo: 4999.99, label: "Large", note: "500 to 4,999 units" },
  { upTo: 9999.99, label: "Very large", note: "5,000 to 9,999 units" },
  { upTo: Infinity, label: "Enterprise", note: "10,000 units or more" },
] as const;
export const sizeFor = (units: number) => SIZES.find((s) => units <= s.upTo)!;
