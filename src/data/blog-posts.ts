import type { AuthorSlug } from "./authors";

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  /** Topic tags. Related posts are picked by category first, then shared tags. */
  tags?: string[];
  excerpt: string;
  /** Who put their name on it — see src/data/authors.ts. */
  author: AuthorSlug;
  /** Optional second name: checked the piece, did not write it. */
  reviewedBy?: AuthorSlug;
  date: string;
  /** Last substantive change; emitted as dateModified and shown in the byline. */
  updated?: string;
  readTime: string;
  /** Markdown-ish content rendered by Prose. The free plan CTA is appended to every body. */
  body?: string;
};

// Shared, fact-keyed copy (marketing/facts/product.yaml, limits.yaml; checked 27 Nov 2026).
// Edit here once instead of in every post.
export const ONAM_AT_A_GLANCE = "We are the newest company on this list, so here are the facts. Posture scanning connects through read-only cloud roles, and agentless workload scanning runs inside your account. Posture rules cover seven clouds (AWS, Azure, Google Cloud, OCI, Alibaba Cloud, IBM Cloud and Kubernetes): 12,912 rule definitions across 672 cloud services as the all-cloud totals, 11,856 of them CSPM posture rule definitions. These are definitions, not working checks: the catalogue includes rules that are switched off or have no check yet, and we publish the per-cloud breakdown. Engines write into one security graph, so an attack path can start in one cloud and end in another. Each finding gets a FAIR-style loss estimate for ranking (FAIR is published by The Open Group as the O-RT and O-RA standards); it is a per-finding estimate, not a price for a whole route and not a prediction. Compliance covers 144 frameworks: 119 with automated checks, 25 attestation-only. SaaS posture covers 9 platforms. These figures come from our published fact set, last checked on 27 November 2026.";

export const ONAM_PRICES = "Our prices are public: $20 per unit a month for Complete, which includes data security; $14 per unit a month for Posture; and $39 per active developer a month for code security, with a 25-unit minimum. There is no time-limited trial. Instead there is a [free plan](/start-free) of up to 25 units with API-based scanning only, and a [free one-time audit scan](/audit-scan) of one cloud account.";

/** The closing call to action every post ends with. */
export function freePlanCta(slug: string) {
  return `
## Try it on your own cloud

**Start free.** The free plan covers up to 25 units of cloud security, with API-based scanning only: posture (CSPM), identity and permissions (CIEM), data stores found through cloud APIs (DSPM checks, no content classification) and AI-SPM. Posture scanning connects through read-only cloud roles, the free plan deploys no agent or scanner, and no card is needed. Register, and the team emails you the login.

**[Start free](/start-free?from=/resources/blog/${slug})** · [Book a demo](/request-demo)
`;
}

const POSTS: BlogPost[] = [
  {
    slug: "aws-security-hub-what-would-onam-add",
    title: "I already have AWS Security Hub. What would Onam add?",
    category: "CSPM",
    tags: ["cspm","aws","security-hub","multicloud"],
    excerpt: "Keep Security Hub. What it already does (exposure findings, attack path graph, unused access, Azure and Google Cloud CSPM), per AWS's own docs, and the lanes Onam adds.",
    author: "anup-yadav",
    date: "November 27, 2026",
    readTime: "7 min",
    body: `
:::answer
Keep Security Hub. It correlates AWS's own detectors (Security Hub CSPM, Inspector, GuardDuty, Macie and IAM Access Analyzer) into exposure findings, and its CSPM also checks Azure and Google Cloud. Onam adds what sits outside that set: OCI, Alibaba Cloud and IBM Cloud posture, in-cluster Kubernetes, nine SaaS platforms, your source code, and AI workloads, in one place.
:::

*Checked against Onam's product facts and AWS's documentation on 27 November 2026. Onam sells a cloud security platform; where we describe it, it is labelled.*

## What does Security Hub already do for us?

More than many people assume. Credit it before deciding anything.

- **Correlation into exposure findings.** AWS says Security Hub "correlates findings from Security Hub CSPM control checks, Amazon Inspector, and other AWS services to detect exposures associated with AWS resources". The signals include GuardDuty threats, Inspector vulnerabilities, CSPM misconfigurations and Macie sensitive data. ([What is Security Hub](https://docs.aws.amazon.com/securityhub/latest/userguide/what-is-securityhub-v2.html); [Exposure findings](https://docs.aws.amazon.com/securityhub/latest/userguide/exposure-findings.html))
- **A potential attack path graph.** It shows "the primary resource where the exposure was generated, the network path (if applicable), and the downstream resources that an attacker could reach by escalating permissions". It is available "only in the Security Hub console". ([Attack path graph](https://docs.aws.amazon.com/securityhub/latest/userguide/potential-attack-path-graph.html))
- **Unused access.** It identifies "IAM roles, users, access keys, and permissions that have not been used within a 90-day lookback period", and can generate "a scoped-down replacement policy". ([What is Security Hub](https://docs.aws.amazon.com/securityhub/latest/userguide/what-is-securityhub-v2.html))
- **Azure and Google Cloud posture.** Security Hub CSPM integrates with Azure (CIS Azure Foundations v4.0 and Azure Foundational Best Practices, "122 controls across both standards") and Google Cloud (CIS GCP Foundation v4.0.0, "69 controls"). Each gets its own security score. AWS's pricing page says Essentials "includes multicloud (Microsoft Azure and Google Cloud Platform (GCP)) coverage". ([Azure](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-azure.html); [GCP](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-gcp.html); [Pricing](https://aws.amazon.com/security-hub/pricing/))

So "Security Hub is AWS-only" is no longer true. If your estate is AWS, Azure and Google Cloud and nothing else, much of what you need is already in the account. Say so to your team before anyone buys anything.

## So where would Onam add something?

In the places the Security Hub pages we read do not describe:

1. **Clouds beyond the big three.** Onam's posture rules cover seven clouds: AWS, Azure, Google Cloud, OCI, Alibaba Cloud, IBM Cloud and Kubernetes. That is 12,912 rule definitions in all, including 2,275 for OCI, 1,785 for Alibaba Cloud and 665 for IBM Cloud. These are rule definitions, and not every definition is a working check yet.
2. **Inside your Kubernetes clusters.** Onam reads cluster workloads, RBAC and exposure, with 1,023 Kubernetes rule definitions (not every definition is a working check yet). Shadow-admin detection covers Kubernetes \`bind\`, \`escalate\` and \`impersonate\`, as well as AWS, Azure and Google Cloud.
3. **SaaS.** Onam runs posture checks on nine platforms: M365, SharePoint, Google Workspace, GitHub, GitLab, Bitbucket Cloud, Snowflake, Dynamics 365 and Okta. It also links one person's accounts across Google Workspace, Microsoft 365/Entra, AWS, Azure, Google Cloud, Kubernetes and OCI, so you can see who is admin in several places at once.
4. **Your source code.** Onam scans 13 languages with 835 rules it wrote itself. A code finding links to the cloud workload or image built from it, with the method and confidence shown. AWS sells Lambda code scanning as a Security Hub add-on ([Pricing](https://aws.amazon.com/security-hub/pricing/)). Compare the two on scope, not on name.
5. **AI workloads.** Onam covers cloud AI services on AWS (SageMaker, Bedrock), Azure (Azure AI services including Azure OpenAI, and Azure Machine Learning) and Google Cloud (Vertex AI). It finds self-hosted model servers on Kubernetes and checks whether they are exposed, and it checks whether provider guardrails are attached.
6. **Longer identity chains.** On AWS, Onam follows assume-role chains up to 12 hops. On Google Cloud, it follows service-account impersonation chains up to 4 hops.
7. **Compliance breadth.** Onam has 144 compliance frameworks: 119 with automated checks and 25 attestation-only. Security Hub CSPM lists FSBP, CIS, PCI DSS and NIST among its standards ([Security Hub CSPM](https://docs.aws.amazon.com/securityhub/latest/userguide/what-is-securityhub.html)).

## Side by side

| Question | AWS Security Hub (AWS docs, 27 Nov 2026) | Onam (product facts, 27 Nov 2026) | Verdict |
|---|---|---|---|
| Correlates misconfigurations, vulnerabilities, threats and sensitive data? | Yes, for AWS resources, through exposure findings | Yes, across its own engines; each finding gets a loss estimate for ranking | Same |
| Azure and Google Cloud posture | Yes: 122 Azure controls, 69 GCP controls | Yes | Same |
| OCI, Alibaba Cloud, IBM Cloud posture | Not described on the pages we read | Yes | Different |
| Unused access | 90-day lookback, with scoped-down policy recommendations | AWS and Google Cloud, from audit logs over a 30-day window | Same; Security Hub also writes the replacement policy |
| SaaS posture | Not described on the pages we read | 9 platforms | Different |
| Source code to cloud | Lambda code scanning add-on | Static analysis in 13 languages, linked to the workload | Different |
| AI inventory and guardrails | Not described on the pages we read | AWS, Azure, Google Cloud and self-hosted Kubernetes | Different |
| Threat detection | GuardDuty | Reads audit logs and matches threat intelligence; reads GuardDuty findings from your S3 export | Different approach |
| Automated response | Automation rules and EventBridge | Guidance only | **Onam does not** |
| Pricing unit | Per resource unit; AWS's worked examples use $3.75 a unit a month | $20 a unit a month (Complete) or $14 (Posture), minimum 25 units, counted by resource type | Units differ |

## Do I have to choose?

No. Onam's posture scanning connects through read-only cloud roles, and agentless workload scanning runs inside your account. Nothing in Security Hub has to be switched off. Many teams will keep Security Hub for AWS-native correlation and automation, and add a second tool only for the lanes it does not cover.

**Is it worth paying for both?** Price it on your own inventory. The two products count units differently, so a per-unit headline price tells you little. Onam's free plan (up to 25 units, API-based scanning only) is one way to compare on a real account without a purchase.

## What would make Onam the wrong choice?

The honest limit: **Onam does not act for you.** Response is guidance only. Onam does not quarantine roles, revoke sessions or block IP addresses. If automated containment is the reason you run Security Hub with EventBridge, keep doing that.

:::ledger
yes: What Onam adds
no: What Onam does not do
+ OCI, Alibaba Cloud and IBM Cloud posture rule definitions
+ In-cluster Kubernetes posture and RBAC escalation checks
+ Posture checks on nine SaaS platforms, and one person's accounts linked across platforms
+ Code findings linked to the workload built from them
+ AI inventory, exposure and guardrail checks on AWS, Azure, Google Cloud and self-hosted Kubernetes
- Does not take containment actions (quarantine, revoke, block); response is guidance
- Does not read GuardDuty from the API by default; it reads your S3 export
- Does not turn logging on for you
- Does not put AI services on attack paths yet
- Does not cover AI services on OCI, Alibaba Cloud or IBM Cloud
- Does not comment on pull requests, and has no IDE plugin
:::

:::faq Frequently asked questions
### Does Onam replace AWS Security Hub?
It does not have to. Security Hub correlates AWS's own services, and its CSPM now covers Azure and Google Cloud. Onam adds OCI, Alibaba Cloud, IBM Cloud, in-cluster Kubernetes, SaaS, code and AI workloads. Many teams run both.

### Does AWS Security Hub cover Azure and Google Cloud?
Yes. AWS documents Security Hub CSPM integrations for Microsoft Azure (CIS Azure Foundations v4.0 and Azure Foundational Best Practices, 122 controls) and Google Cloud (CIS GCP Foundation v4.0.0, 69 controls), each with its own security score (AWS docs, accessed 27 November 2026).

### Can I run Onam and Security Hub on the same accounts?
Yes. Onam's posture scanning connects through read-only cloud roles, and its agentless workload scanning runs inside your account. You do not need to change Security Hub.

### Is Onam cheaper than Security Hub?
The units differ. AWS prices Security Hub per resource unit, and its worked examples use $3.75 a month. Onam is $20 a unit a month for Complete or $14 for Posture, with a 25-unit minimum and its own unit definitions. Price both on your inventory.

### Does Onam take automatic action like EventBridge rules?
No. Onam's response is guidance only. It does not quarantine roles, revoke sessions or block IP addresses.
:::

:::next Read next
### Which five AWS misconfigurations should we check first? | /resources/blog/aws-misconfigurations-first-scan
Five read-only AWS CLI checks with their fixes.
### We run GuardDuty. What would we still miss? | /resources/blog/cdr-behavioral-threat-detection
The logs to switch on, and one attack traced from a log line to an incident.
:::
`,
  },
  {
    slug: "cspm-tools-public-pricing",
    title: "Which CSPM tools have public pricing? 2026 list with sources",
    category: "Buyer's Guide",
    tags: ["pricing","cspm","free-plan"],
    excerpt: "CSPM and CNAPP tools that publish prices in 2026: AWS, Google, Microsoft, Prowler, Cloudanix, Plerion, Aikido, Onam. Each quoted from its own page, with dates.",
    author: "anup-yadav",
    date: "November 23, 2026",
    updated: "November 27, 2026",
    readTime: "11 min",
    body: `
*Updated 27 November 2026: Onam now has a free plan, and AWS's pricing page now says Security Hub Essentials includes Azure and Google Cloud coverage. Both are reflected below. Onam sells a cloud security platform and is on this list; where we mention it, it is labelled.*

## The short answer

As of 23 November 2026, these cloud security posture management (CSPM) and CNAPP tools publish prices on a public page: **AWS Security Hub**, **Google Security Command Center**, **Microsoft Defender for Cloud**, **Prowler**, **Cloudanix**, **Plerion**, **Aikido** and **Onam Security**. Upwind lists per-resource prices through the AWS Security Hub Extended plan. Free options include Microsoft's Foundational CSPM, Google's Standard tier, Prowler's open-source scanner and Aikido's free Developer plan.

Wiz, Orca, Palo Alto Networks Cortex Cloud, CrowdStrike Falcon Cloud Security, Sysdig, Tenable Cloud Security and Fortinet's Lacework FortiCNAPP price by quote. That is a normal way to sell enterprise software, and it says nothing about the products themselves.

If you would rather see findings from your own account before reading further, Onam's [free plan](/start-free?from=/resources/blog/cspm-tools-public-pricing) covers up to 25 units with no card.

## CSPM public pricing at a glance

Every cell is what the vendor's own page said on the date shown. Prices are in US dollars and before tax.

| Vendor | Public price? | Pricing unit | Free tier | Source + date |
| --- | --- | --- | --- | --- |
| AWS Security Hub | Yes. Essentials $3.75 per resource unit a month (US East); Security Hub CSPM $0.0010 per check for the first 100,000 checks a month | Resource unit (Essentials); security checks, finding ingestions and rule evaluations (CSPM) | 30-day free trial | aws.amazon.com/security-hub/pricing and /security-hub/cspm/pricing, 23 Nov 2026 |
| Aikido | Yes, plans listed by monthly fee | Monthly fee that includes 10 users and rises with users | Developer plan, $0 "free forever", includes CSPM for 1 cloud account | aikido.dev/pricing, 23 Nov 2026 |
| Cloudanix | Yes. $3.49 per monitored asset a month (posture); $14.99 per workload a month (runtime) | Monitored asset; workload | "First month on us" | cloudanix.com/pricing, 23 Nov 2026 |
| Google Security Command Center | Yes. Premium pay-as-you-go from $0.0071 per Compute Engine hour; Premium subscription from $15,000 a year | Cloud usage (pay-as-you-go) or share of cloud spend (subscription) | Standard tier, "Free of charge" | cloud.google.com/security-command-center/pricing, 23 Nov 2026 |
| Microsoft Defender for Cloud | Yes. Defender CSPM about $5 per billable resource a month | Billable resource (servers, storage accounts, databases, serverless) | Foundational CSPM, free | azure.microsoft.com Defender for Cloud pricing and Azure Retail Prices API, 23 Nov 2026 |
| Plerion | Yes, a fixed monthly bill set by your cloud spend band | Your monthly cloud bill | Free trial; 30-day trial on AWS Marketplace | plerion.com/pricing, 23 Nov 2026 |
| Prowler | Yes. $79 per cloud account a month billed annually, $99 monthly | Cloud account | Open source, free under Apache-2.0; 7-day trial of Prowler Cloud | prowler.com/pricing, 23 Nov 2026 |
| Upwind | Yes, through AWS. $3.75 per resource a month (Cloud Security) | Resource | Not stated on the page we read | aws.amazon.com/security-hub/pricing (Extended plan), 23 Nov 2026 |
| Onam Security (us) | Yes. $20 per unit a month (Complete); $14 (Posture); $39 per active developer (code security) | Unit, counted by resource type; minimum 25 units | Free plan up to 25 units (API-based scanning only); free one-time audit scan | onamsecurity.com/pricing, 27 Nov 2026 |
| Wiz | Quote only | Not published | Not stated | wiz.io/pricing, 23 Nov 2026 |
| Sysdig | Quote only | Hosts ("compute instances for CSPM") | Not stated | sysdig.com/pricing, 23 Nov 2026 |
| Tenable Cloud Security | Quote only | Not published | Not stated | tenable.com/buy, 23 Nov 2026 |
| CrowdStrike Falcon Cloud Security | Quote only | Not published | Not stated | crowdstrike.com/en-us/pricing, 23 Nov 2026 |
| Cortex Cloud (Palo Alto Networks) | Quote only | Not published | Not stated | paloaltonetworks.com/cortex/cloud, 23 Nov 2026 |
| Lacework FortiCNAPP (Fortinet) | Quote only | Not published | Not stated | fortinet.com/products/forticnapp, 23 Nov 2026 |
| Orca Security | Not verified | Not verified | Not verified | Pricing page did not open, 23 Nov 2026 |

## How this list was built

- We opened each vendor's own pricing page on 23 November 2026 and copied the price, the unit and anything offered free. Where a page fills in its numbers in the browser, we read the same figure from the vendor's own public price list and say so.
- We only list what a page says. If a page did not open, or a number did not show, the vendor is marked "not verified" and no number is given.
- Third-party price estimates are left out. They can be useful in a negotiation, but they are not the vendor's own list price.
- Nothing here says what any product cannot do. We have not tested these tools against each other.
- Vendors are listed alphabetically, with our own entry last.
- Corrections go to hello@onamsecurity.com and we apply them.

## Why public pricing helps a buyer

A published price lets you work out a rough budget before the first sales call, compare the pricing unit across tools, and spot the plan where a feature you need begins. It does not tell you the final bill. Most published prices still have volume discounts, minimums or add-ons, so read the unit and the small print as carefully as the number.

The pricing unit matters as much as the price. On this list you will find tools priced per resource, per check, per cloud account, per monitored asset, per user, per developer and as a share of cloud spend. Two tools with the same headline price can cost very different amounts for the same estate.

## CSPM tools with public prices, in their own words

### 1. AWS Security Hub

AWS describes Security Hub as offering "a unified pricing model with an Essentials plan foundation, optional add-ons, and an Extended plan for curated partner solutions." The Essentials plan is priced per "Resource unit / mo" on a "Pay-as-you-go" basis, and its included capabilities list "Cloud Security Posture Management (Security Hub CSPM)". The page's price list sets this at $3.75 per resource unit per month in US East (N. Virginia). On the unit: "Pricing is anchored on Amazon EC2 instance, Azure Virtual Machines, and GCP Virtual Machines as 1 resource unit", with "12 functions = 1 resource unit", "18 images = 1 resource unit" and "125 identity resources = 1 resource unit". The page also says "Try AWS Security Hub at no cost with a 30-day free trial that includes Essentials plan capabilities." Source: aws.amazon.com/security-hub/pricing, accessed 23 November 2026. When we re-read the page on 27 November 2026, it also said Essentials "includes multicloud (Microsoft Azure and Google Cloud Platform (GCP)) coverage".

The standalone Security Hub CSPM is "priced along three dimensions: the quantity of security checks, the quantity of finding ingestion events, and the quantity of rule evaluations processed per month." Its worked examples use "$0.0010 per check (first 100,000 checks tier)" and a "first 10,000 events free tier" for finding ingestion, and "You can try AWS Security Hub CSPM at no cost with a 30-day free trial." AWS Config is required for AWS checks and "configuration items are priced separately." Source: aws.amazon.com/security-hub/cspm/pricing, accessed 23 November 2026.

- **Worth checking:** which of the two pricing models applies to your accounts, and the AWS Config charges that sit alongside CSPM checks.

### 2. Aikido

Aikido's free Developer plan is listed at "$0 / free forever", "Incl. 2 users", with "No credit card required". Its free features include "Cloud", described as "Misconfiguration checks (CSPM), Container & Virtual Machine Scanning, Cloud Asset Graph Search, IaC, and more", within limits that include "1 Cloud Account". The paid plans, Basic, Pro and Advanced, show a monthly "Total fee (incl. 10 users)" that changes as you select more users, and Enterprise is custom. The page notes "Prices do not include withholding, import, sales, VAT, or other local taxes." Source: aikido.dev/pricing, accessed 23 November 2026.

- **Worth checking:** the price is set by the number of users, so confirm how many cloud accounts each plan covers (the page lists 3 for Basic and 10 for Pro).

### 3. Cloudanix

Cloudanix lists "Cloud Pro" posture at "$3.49 / monitored asset / month", with "Min. 100 monitored assets", and runtime at "$14.99 / workload / month", with "Min. 25 protected workloads". Enterprise is "Custom pricing". On trials, the page says "First month on us", and Pro sign-up needs a card on file. Source: cloudanix.com/pricing, accessed 23 November 2026.

- **Worth checking:** what counts as a monitored asset in your estate.

### 4. Google Security Command Center

Google says "Security Command Center offers three service tiers: Standard, Premium, and Enterprise", with Standard "Free of charge", and "Google Cloud charges only for the Premium and Enterprise service tiers of Security Command Center." Premium is sold two ways. As a subscription, "the cost of the subscription is 5% of your projected annualized run rate of Google Cloud spend", and "The minimum annual cost of a Security Command Center Premium subscription is $15,000." On pay-as-you-go for project-level activations, the rate table lists Compute Engine at "$0.0071 / 1 hour" and Cloud SQL at "$0.0071 / 1 hour", among other services. Enterprise is "Subscription-based pricing for organization-level activations only." Source: cloud.google.com/security-command-center/pricing, accessed 23 November 2026.

- **Worth checking:** whether you would activate at project or organisation level, since the pay-as-you-go rates differ.

### 5. Microsoft Defender for Cloud

Microsoft says "Foundational CSPM (for free) provides continuous assessments, security recommendations, Secure Score, and the Microsoft cloud security benchmark across Azure, Amazon Web Services(AWS), and Google Cloud." The paid plan, Defender CSPM, "provides advanced security posture capabilities including agentless vulnerability scanning, attack path analysis, integrated data-aware security posture, code to cloud contextualization, and an intelligent cloud security graph." On the unit: "Pricing is dependent on cloud size, with billing based only on Server, Storage account, Database, Serverless Containers, and Serverless resource counts", and "8 functions and/or web apps = 1 billable resource". Source: azure.microsoft.com, Defender for Cloud pricing, accessed 23 November 2026.

The pricing page fills in the Defender CSPM figure in your browser. Microsoft's public Azure Retail Prices API lists the "DCSPM Node" meter at $0.006849 per hour, which is about $5 per billable resource a month (prices.azure.com, accessed 23 November 2026).

- **Worth checking:** which of your resources are billable, and whether Defender CSPM is already part of an agreement you have with Microsoft.

### 6. Plerion

Plerion says "There's one plan. Every customer gets the full platform, our agent, and a customer success engineer, whatever their cloud bill." The price is set by your cloud spend band. For example, the page's calculator shows a "Fixed monthly cloud bill" of "$100,000 – $130,000" giving an "Estimated fixed monthly Plerion bill" of "$3,100 – $3,700". Runtime or code security is a paid add-on, and "Usage over your license, billed at list price". On trials: "Is there a free trial? Yes, sign up, connect your cloud in about 10 minutes and see your real findings", and on AWS Marketplace "You can start a 30-day free trial with your AWS account." Source: plerion.com/pricing, accessed 23 November 2026.

- **Worth checking:** the band your cloud bill falls in, and what is excluded from it (the page gives Marketplace spending as an example).

### 7. Prowler

Prowler's open-source scanner is free: "Yes, forever, under Apache-2.0", and the CLI, SDK and Local Server "run every check on every provider." The hosted Prowler Cloud plan is "$79" "per cloud account / month, billed annually", or $99 per account billed monthly. The free trial is "$0" "for 7 days", with "No credit card, no cloud account limit." A Private Cloud option, "Deployed in your environment", is "Custom", via "AWS Marketplace or a direct quote." Source: prowler.com/pricing, accessed 23 November 2026.

- **Worth checking:** whether you want to run the open-source tool yourself or pay for the hosted service, and how many cloud accounts you have.

### 8. Upwind (through AWS Security Hub)

We did not find a price list on Upwind's own site. AWS lists Upwind as a curated partner in the Security Hub Extended plan, with "Upwind (Cloud Security) Per resource per month $3.75", "Upwind (Sensors) Per resource per month $7.00" and "Upwind (Shift Left) Per resource per month $5.25". AWS notes that "The Security Hub Essentials plan must be enabled before activating Extended Plan solutions" and "Extended Plan charges are in addition to Essentials plan charges." Source: aws.amazon.com/security-hub/pricing, accessed 23 November 2026.

- **Worth checking:** whether buying through AWS or directly from Upwind suits you, and how the Essentials charge adds to the total.

## CSPM tools that price by quote

These vendors did not show list prices on the pages we read on 23 November 2026. A quote-based price is common for large platforms and usually reflects discounts tied to the size and length of the contract.

- **CrowdStrike Falcon Cloud Security.** The pricing page lists endpoint bundles (Falcon Go, Pro, Enterprise and Complete); cloud security is not priced there (crowdstrike.com/en-us/pricing).
- **Cortex Cloud (Palo Alto Networks).** The product page offers "Request demo" and shows no price (paloaltonetworks.com/cortex/cloud).
- **Lacework FortiCNAPP (Fortinet).** The product page offers "Schedule a FortiCNAPP Demo", "Contact Sales" and links to "Free Trials" (fortinet.com/products/forticnapp).
- **Sysdig.** The page says "Prices tailored to your needs" with "Request a quote". For CNAPP, "Licensing is based on the number of hosts in a customer's environment (compute instances for CSPM)" (sysdig.com/pricing).
- **Tenable Cloud Security.** The buy page prices Nessus and some Tenable One products, and for others says to "request a customized quote" (tenable.com/buy).
- **Wiz.** The pricing page names "Wiz One", "Wiz Go" and "À la Carte" and asks you to fill in a pricing request (wiz.io/pricing).
- **Orca Security.** Orca's pricing page did not open when we tried, so we have not verified how Orca prices. Please check orca.security directly.

## And Onam Security (that is us)

Onam publishes its prices on the [pricing page](/pricing), with a calculator:

- **Complete:** $20 per unit a month. It includes posture (CSPM, KSPM) and compliance, identity and permissions (CIEM), sensitive data (DSPM), and agentless vulnerability and malware scanning.
- **Posture:** $14 per unit a month. Everything in Complete except vulnerability and malware scanning, for teams that already run a scanner.
- **Code security:** $39 per active developer a month.
- **Minimum:** 25 units a month, so the smallest Complete bill is $500 a month and the smallest Posture bill is $350.

**What a unit is.** Each virtual machine, Kubernetes node and Kubernetes cluster counts as 1 unit. Two managed databases, two warehouses or NoSQL accounts, or two AI and ML services count as 1 unit. Four caches, search or stream services count as 1 unit. Ten storage buckets, ten file systems or NoSQL tables, ten serverless containers, or ten self-managed servers and devices count as 1 unit. Twenty container image repositories, or fifty functions and web apps, count as 1 unit. Identities and roles, networks and subnets, security groups, load balancers, disks, snapshots, keys, policies, DNS and logs are scanned and reported at no charge.

**What is free (updated 27 November 2026).** There is no time-limited trial. The free plan covers up to 25 units, counted the same way as the paid plans, with API-based scanning only: posture and compliance (CSPM), identity and permissions (CIEM), data stores found through cloud APIs (DSPM checks, no content classification) and AI-SPM. Kubernetes posture, data-content classification and vulnerability and malware scanning need a scanner, so they are on paid plans. No card is needed; you register and the team emails you the login. We also run a [free one-time audit scan](/audit-scan) of one cloud account and go through the findings with you.

- **The honest gap:** we are a young company with no public reference customers yet, so please test us on your own accounts before you decide.

## How to choose using public prices

Start from your own estate before comparing numbers:

- **Count the thing each tool charges for.** Write down your virtual machines, databases, buckets, functions, cloud accounts and developers. Then price each shortlisted tool with its own unit.
- **Use the free tiers first.** Microsoft's Foundational CSPM, Google's Standard tier, Prowler's open-source scanner, Aikido's Developer plan and Onam's free plan let you see real findings before you spend anything.
- **Look for the minimum.** Several published prices have a floor: 100 monitored assets at Cloudanix, $15,000 a year for Google's Premium subscription, 25 units at Onam.
- **Check what is an add-on.** Runtime, code security, vulnerability scanning and threat detection are often priced separately. Compare the bundle you actually need.
- **Ask quote-based vendors for the unit.** Even without a list price, every vendor can tell you what the price grows with. That makes their quote comparable with the published ones.
- **Test on the same accounts.** A low price only helps if the tool covers your clouds and finds what matters to you. Run two or three tools on the same non-production accounts for two weeks.

:::faq Frequently asked questions
### Which CSPM tools have public pricing?

As of 23 November 2026 (Onam re-checked 27 November): AWS Security Hub, Google Security Command Center, Microsoft Defender for Cloud, Prowler, Cloudanix, Plerion, Aikido and Onam Security publish prices on their own pages. Upwind's per-resource prices are published on the AWS Security Hub pricing page. Wiz, Orca, Cortex Cloud, CrowdStrike, Sysdig, Tenable and FortiCNAPP price by quote.

### Is there a free CSPM tool?

Yes. Microsoft's Foundational CSPM in Defender for Cloud is free, Google's Security Command Center Standard tier is "Free of charge", Prowler's open-source scanner is free under Apache-2.0, Aikido's Developer plan includes CSPM for one cloud account at $0, and Onam's free plan covers up to 25 units with API-based scanning. AWS Security Hub and Security Hub CSPM have a 30-day free trial.

### How is CSPM usually priced?

The units vary. On this list we found per resource (AWS Security Hub, Microsoft Defender CSPM, Upwind), per security check (Security Hub CSPM), per cloud account (Prowler), per monitored asset (Cloudanix), by cloud spend (Plerion and Google's Premium subscription), per user (Aikido), per host (Sysdig) and per unit counted by resource type (Onam).

### How much does Microsoft Defender CSPM cost?

Foundational CSPM is free. Defender CSPM is billed per billable resource; Microsoft's public Azure Retail Prices API lists it at $0.006849 per hour, about $5 per billable resource a month, as of 23 November 2026.

### Does Wiz publish its pricing?

No. Wiz's pricing page names the Wiz One and Wiz Go packages and an à la carte option, and asks you to request a quote.

### How much does Onam Security cost?

$20 per unit a month for Complete, which includes data security; $14 per unit a month for Posture; and $39 per active developer a month for code security. The minimum is 25 units. There is no time-limited trial, but there is a free plan of up to 25 units (API-based scanning only, no card) and a free one-time audit scan. Details are on the [pricing page](/pricing).

### What is a unit in Onam's pricing?

A virtual machine, a Kubernetes node or a Kubernetes cluster is 1 unit each. Other resources count as fractions, for example 2 managed databases, 10 storage buckets or 50 functions per unit. Identities, networks, security groups, keys, policies and logs are not charged.
:::

## Corrections

Last updated 27 November 2026 (Onam's free plan; the Security Hub multicloud line). Every other vendor page above was read on 23 November 2026, and every statement about another vendor is a quotation or a figure from that vendor's own public page or price list. Prices change often, so check the source before you buy. If anything here is wrong or out of date, including anything about us, email hello@onamsecurity.com and it will be corrected.

*Read next: [Best CSPM tools in 2026](/resources/blog/best-cspm-tools), [Wiz.io alternatives and competitors](/resources/blog/wiz-alternatives), and [what a CNAPP is](/learn/cnapp).*
`,
  },
  {
    slug: "prisma-cloud-alternatives",
    title: "Prisma Cloud alternatives 2026: 10 compared, now that it is Cortex Cloud",
    category: "Buyer's Guide",
    tags: ["cnapp","cspm","vendor-list"],
    excerpt: "Prisma Cloud alternatives for 2026, now that Palo Alto sells it as Cortex Cloud: Wiz, Orca, Defender, CrowdStrike, Sysdig and more, in their own words.",
    author: "anup-yadav",
    date: "November 23, 2026",
    updated: "November 27, 2026",
    readTime: "11 min",
    body: `
*Vendor pages read 23 November 2026. Updated 27 November 2026: Onam's own figures and free plan. Onam sells a cloud security platform and is on this list; where we mention it, it is labelled. How the list was built is at the end.*

## The short answer

The main Prisma Cloud alternatives in 2026 are **Wiz**, **Orca Security**, **Microsoft Defender for Cloud**, **CrowdStrike Falcon Cloud Security**, **Sysdig Secure**, **Tenable One Cloud Exposure** (formerly Tenable Cloud Security), **Aqua Security**, **Check Point** and **Fortinet's Lacework FortiCNAPP**. Prisma Cloud itself is now sold by Palo Alto Networks as **Cortex Cloud**, which Palo Alto calls "the next version of Prisma Cloud". Wiz and Orca are agentless first. Defender for Cloud has a free foundational tier. Sysdig and Aqua lead with runtime. Choose by your clouds, the security vendor you already run and how much you want installed on workloads.

## Prisma Cloud alternatives at a glance

The deployment and ranking columns say what each vendor's own page says, on the date shown further down. "Best fit" is our view. Pricing says only what is public.

| Platform | Best fit, in our view | Deployment, as the vendor describes it | Ranking, as described | Public pricing |
| --- | --- | --- | --- | --- |
| Aqua Security | Container-heavy teams that want runtime enforcement | Agent-based, enforces locally | Risk filtered by what is actually executing | Ask for a quote |
| Check Point | Check Point network estates | Posture plus cloud security gateways | Prioritises risks across apps, network and workloads | Ask for a quote |
| CrowdStrike Falcon Cloud Security | Teams already running the Falcon sensor | Unified agent and agentless | Adversary intelligence and graph-based context | Ask for a quote |
| Lacework FortiCNAPP (Fortinet) | Fortinet network estates | Not stated on the page we read; ask | Attack path visualisation | Ask for a quote |
| Microsoft Defender for Cloud | Azure-centred estates | Agentless for AWS and GCP; Defender for Endpoint for servers | Secure score; attack paths in paid Defender CSPM | Published; foundational CSPM is free |
| Orca Security | Teams that want agentless-first scanning | SideScanning, plus optional Orca Sensor | Dynamic scoring and attack path analysis | Ask for a quote |
| Sysdig Secure | Kubernetes-heavy teams that want runtime depth | Agentless posture plus an agent | Runtime insights with cloud context | Ask for a quote |
| Tenable One Cloud Exposure | Tenable vulnerability management customers | AWS, Azure, GCP; in-account scanning add-on | Toxic combinations with attack paths | Ask for a quote |
| Wiz | Teams that want API-first with an optional sensor | Connects via API; Wiz Sensor for runtime | One prioritised list of toxic combinations | Packages quoted on request |
| Onam Security (us) | Estates including OCI, Alibaba or IBM Cloud; teams that want risk in money | Read-only cloud roles for posture; agentless workload scanning in your account | FAIR-style loss estimate per finding | $20 per unit a month Complete, $14 Posture, $39 per active developer ([pricing](/pricing)) |

## Why teams look for a Prisma Cloud alternative

The reasons are usually ordinary, and none of them is a verdict on Palo Alto Networks.

- **A renewal is coming.** Prisma Cloud uses credit-based licensing, and teams often want to check how their usage maps to the price.
- **The product has a new name and a new home.** In February 2025 Palo Alto said Prisma Cloud would merge with Cortex CDR to form Cortex Cloud, with a seamless upgrade for existing customers. Even a smooth upgrade changes the console and the workflow, so many teams look at the market again.
- **An agent rollout is on the table.** Cortex Cloud's runtime protection uses Palo Alto's agent. Some teams are happy to deploy it; others prefer to install as little as possible on workloads and want to compare first.
- **The estate changed.** A new cloud arrived, Kubernetes grew, or the board started asking for risk in money.

Cortex Cloud belongs on the same shortlist. The fair way to decide is to put the same questions to every platform, including Cortex Cloud and including us.

## First, be clear what you would be replacing

Palo Alto's launch release of 13 February 2025 introduced "Cortex® Cloud, the next version of Prisma Cloud", and said "Prisma Cloud is merged with Cortex CDR to form Cortex Cloud, stopping attacks in real-time" and "Existing Prisma Cloud customers will experience a seamless upgrade to Cortex Cloud." Source: paloaltonetworks.com/company/press, "Palo Alto Networks Introduces Cortex Cloud", accessed 23 November 2026.

The Cortex Cloud page says it "brings together proactive prevention, autonomous risk reduction and real-time defense in one unified platform". On deployment: "Cortex Cloud combines agentless scanning for cloud asset discovery, posture management and risk assessment with lightweight runtime agents for continuous threat monitoring and active protection." Source: paloaltonetworks.com/cortex/cloud, accessed 23 November 2026.

The Prisma Cloud page is still online. It lists "two deployment models: SaaS (Prisma Cloud Enterprise Edition) and Self-Hosted (Prisma Cloud Compute Edition)" and says "Prisma Cloud uses a credit-based licensing module". Source: paloaltonetworks.com/prisma/cloud, accessed 23 November 2026.

In plain terms: Prisma Cloud and Cortex Cloud are one product line, and Cortex Cloud is the newer version, built on Palo Alto's Cortex security operations platform. If your contract still says Prisma Cloud, ask your account team which edition you are on and what the move to Cortex Cloud means for your licence.

## Ten Prisma Cloud alternatives, in their own words

### 1. Aqua Security

Aqua says "Aqua Security is a cloud native application protection platform built to secure applications from development through production." On prioritisation: "Aquasec filters vulnerability risk based on what is actually executing in the workload". On deployment: "Aquasec's agent-based architecture enforces protection locally, even when environments are disconnected or air gapped". Source: aquasec.com/aqua-cloud-native-security-platform, accessed 23 November 2026.

- **Best for, in our view:** container and Kubernetes-heavy teams, including air-gapped or on-premises clusters, that want enforcement where workloads run.
- **Trade-off to check:** which workloads the agent must reach, and who owns that rollout.
- **Ask them:** how posture findings and runtime findings are ranked in one queue.

### 2. Check Point

The page at Check Point's CloudGuard address now uses the Check Point name: "Check Point is a comprehensive cloud security platform that allows you to prevent threats and prioritize risks in the cloud across your applications, network, and workloads." It also describes a partnership: "Check Point and Wiz Deliver End-to-End Cloud Security". Source: checkpoint.com/cloudguard, accessed 23 November 2026.

- **Best for, in our view:** organisations that already run Check Point firewalls and want cloud network security and posture from the same vendor.
- **Trade-off to check:** which product names are on the quote, and what the Wiz partnership means for what you buy from each company.
- **Ask them:** which posture features are Check Point's own and which come through the partnership.

### 3. CrowdStrike Falcon Cloud Security

CrowdStrike describes "The most complete CNAPP with unified agent and agentless protection, from code to cloud." On prioritisation: "CrowdStrike enriches cloud risk detections with adversary intelligence and graph-based context, enabling you to prioritize exploitable exposures and prevent breaches." Source: crowdstrike.com/platform/cloud-security, accessed 23 November 2026.

- **Best for, in our view:** organisations already running the Falcon sensor on endpoints.
- **Trade-off to check:** which protections need the sensor, and what a workload without it receives.
- **Ask them:** how a posture finding is ranked when no adversary intelligence applies to it.

### 4. Lacework FortiCNAPP (Fortinet)

Fortinet says "FortiCNAPP provides unmatched visibility and context to simplify securing everything from code to cloud". On attack paths: "Quickly visualize complex relationships between entities, risks, and threats to gain deeper insight into potential attack paths." Source: fortinet.com/products/forticnapp, accessed 23 November 2026.

- **Best for, in our view:** Fortinet estates that want cloud posture from the vendor already running the network.
- **Trade-off to check:** the page we read does not state the deployment model, so confirm agent or agentless per workload type.
- **Ask them:** what unit the ranking is expressed in.

### 5. Microsoft Defender for Cloud

Microsoft describes Defender for Cloud as a CNAPP, "which is a unified solution that combines multiple cloud security tools to protect applications across their entire lifecycle." For other clouds: "Connect to your multicloud environments by using agentless methods for CSPM insight and CWPP protection." Servers are protected "through Microsoft Defender for Endpoint". Source: learn.microsoft.com, Defender for Cloud overview, accessed 23 November 2026.

- **Best for, in our view:** Azure-centred estates, where it is often already licensed.
- **Trade-off to check:** foundational CSPM is free, while attack path analysis sits in the paid Defender CSPM plan, where "Pricing is dependent on cloud size" (azure.microsoft.com, Defender for Cloud pricing, accessed 23 November 2026).
- **Ask them:** how AWS and GCP resources are treated compared with Azure ones.

### 6. Orca Security

Orca's platform page describes "All-in-One Security For Cloud-Native and AI-Native Apps". Prioritisation is "Dynamic scoring & attack path analysis". Deployment is Orca SideScanning, "Agentless scanning across every workload", with the Orca Sensor for "Runtime observability & protection." Source: orca.security/platform, accessed 23 November 2026.

- **Best for, in our view:** teams that want agentless scanning first, adding a sensor only where they choose.
- **Trade-off to check:** what the sensor adds over SideScanning, and on which workloads you would need it.
- **Ask them:** how a finding on one cloud is ranked against a finding on another.

### 7. Sysdig Secure

Sysdig calls itself "The real-time cloud defense platform for teams who will not compromise on security." On prioritisation: "Sysdig prioritizes risk by combining runtime insights with cloud context to focus your team on what’s truly exploitable." Its page describes "Agent & agentless deployments". Source: sysdig.com/platform/secure, accessed 23 November 2026.

- **Best for, in our view:** container and Kubernetes-heavy teams that want runtime insight to drive prioritisation.
- **Trade-off to check:** which prioritisation signals depend on the agent.
- **Ask them:** what the ranking looks like where the agent is not running.

### 8. Tenable One Cloud Exposure

Tenable's old Cloud Security address now leads to Tenable One Cloud Exposure, which aims to "Prevent cloud breaches and reduce cloud risk by closing gaps that misconfigurations, risky entitlements, and vulnerabilities create across multi-cloud and hybrid environments". On prioritisation: "Identify toxic combinations of risk first, with clear attack path visualizations". It "integrates with all major cloud providers (AWS, Azure, GCP)", and in-account scanning is an add-on where "the data never leaves the environment." Source: tenable.com/cloud-security/products/cnapp, accessed 23 November 2026.

- **Best for, in our view:** organisations already using Tenable for vulnerability management.
- **Trade-off to check:** which scanning mode your quote includes.
- **Ask them:** how cloud findings rank against on-premises vulnerabilities in one queue.

### 9. Wiz

Wiz says "Built for cloud and AI, Wiz AI-APP is the platform to secure your AI applications from code to runtime." On prioritisation: "A single list of prioritized issues of toxic combinations of cloud and AI risk that have a high probability of being exploited and would lead to significant business impact." On runtime: "Runtime protection from the Wiz Sensor stops threats and provides deep, real-time threat detection with context for better prioritization." Source: wiz.io/platform, accessed 23 November 2026. Its pricing page lists Wiz One, Wiz Go and à la carte options by custom quote (wiz.io/pricing, 23 November 2026). Google completed its acquisition of Wiz in March 2026.

- **Best for, in our view:** teams that want to connect by API first and add a runtime sensor only where needed.
- **Trade-off to check:** which protections come from the API connection and which need the Wiz Sensor.
- **Ask them:** which package your use cases fall into. See also our [Wiz alternatives guide](/resources/blog/wiz-alternatives).

### And Onam Security (that is us)

${ONAM_AT_A_GLANCE}

${ONAM_PRICES}

- **Best for, in our view:** estates that run OCI, Alibaba Cloud or IBM Cloud alongside AWS, Azure or GCP, and teams that need to rank risk in money for a board.
- **The honest gap:** we have no public reference customers yet, and no live runtime enforcement. API-based posture scanning cannot see inside a running process. If inline blocking is what you are buying, buy it from one of the vendors above who sells it.
- **Ask us:** the same questions as everyone else. Our answers are on the [Onam vs Cortex Cloud](/compare/onam-vs-cortex-cloud) page.

## How to choose a Prisma Cloud alternative

Start from your own situation:

- **You are happy with Palo Alto and the agent suits you.** Price the move to Cortex Cloud, and run one alternative beside it so you have a real comparison at renewal.
- **You want as little as possible installed on workloads.** Put agentless-first platforms such as Wiz and Orca against Cortex Cloud in the same accounts, in the same two weeks.
- **You are Azure-first.** Price Defender CSPM first; you may already own part of it.
- **You already run CrowdStrike, Check Point or Fortinet.** Their cloud products extend a console your team knows. Test the posture side as hard as the runtime side.
- **Containers and runtime matter most.** Shortlist runtime-first platforms such as Sysdig and Aqua.
- **You run more than the big three clouds, or the board wants risk in money.** That is the case we built Onam for; test us against the incumbent.

Then ask every finalist the same questions:

| Question | Why it matters |
| --- | --- |
| What does onboarding grant, and what needs an agent? | Whatever needs a rollout tends to reach only part of the estate. |
| How many clouds get first-class treatment? | Ask for the per-cloud rule breakdown. |
| What unit is the ranking expressed in? | A score ranks findings against each other. A money figure ranks them against everything else you fund. |
| What does the price grow with? | Credits, resources, workloads and developers scale differently. |
| What happens to your Prisma Cloud policies and reports? | Custom policies, alert rules and reports need to be rebuilt somewhere. |

Pick two alternatives plus Cortex Cloud and give each read-only access to the same non-production accounts. Compare what each ranks first and why. Our [CNAPP POC question list](/resources/blog/wiz-vs-orca-poc-questions) has the full set of questions. If you want to include us, start on the free plan or ask for the free audit scan of one account.

## How this list was built

- Each vendor is quoted from its own public page, verbatim, with the address and the date. If a page changes, the quote is out of date, and we will update it when told.
- We did not test these products. "Trade-off to check" means a design choice stated on the vendor's own page that you should confirm fits you.
- No ranking. Vendors are listed alphabetically, with our own entry last.
- SentinelOne's cloud security page would not open for us on the day we checked, so SentinelOne Singularity Cloud Security is left out of this edition. We will add it once we can quote its page.
- Corrections go to hello@onamsecurity.com and we apply them.

:::faq Frequently asked questions
### What are the best Prisma Cloud alternatives in 2026?

The platforms most often compared with Prisma Cloud (now Cortex Cloud) are Wiz, Orca Security, Microsoft Defender for Cloud, CrowdStrike Falcon Cloud Security, Sysdig Secure, Tenable One Cloud Exposure, Aqua Security, Check Point, Lacework FortiCNAPP and SentinelOne Singularity Cloud Security, with newer platforms such as Onam. "Best" depends on your clouds, the vendor you already run and whether you want an agent on workloads, so trial two or three side by side.

### Is Prisma Cloud now Cortex Cloud?

Yes. In February 2025 Palo Alto Networks introduced Cortex Cloud as "the next version of Prisma Cloud", formed by merging Prisma Cloud with Cortex CDR, and said existing Prisma Cloud customers would get a seamless upgrade. The Prisma Cloud page is still online, so you will see both names. Ask your account team which one your contract covers.

### What is a cheaper alternative to Prisma Cloud?

The Palo Alto pages we read show no list prices, so any comparison starts with a quote. Microsoft publishes Defender for Cloud pricing and its foundational CSPM tier is free. Onam publishes $20 per unit a month for Complete, $14 for Posture and $39 per active developer for code security, and has a free plan of up to 25 units plus a free one-time audit scan ([pricing](/pricing)). The others quote on request. Compare tools on the same accounts, because a lower price only helps if it covers what you need.

### Is there an agentless alternative to Prisma Cloud?

Wiz, Orca, Microsoft Defender for Cloud and Sysdig all describe agentless scanning on their own pages, usually with an optional agent or sensor for runtime. Onam's posture scanning connects through read-only cloud roles, and its agentless workload scanning runs inside your account. Cortex Cloud also describes agentless scanning for posture.
:::

## Corrections

Last updated 27 November 2026 (Onam's own figures and free plan). Every vendor page quoted here was read on 23 November 2026, and every statement about another vendor is a quotation from that vendor's own public page. If any of it is wrong or out of date, including anything about us, email hello@onamsecurity.com and it will be corrected.

*Read next: [Wiz alternatives and competitors](/resources/blog/wiz-alternatives), [Best CSPM tools in 2026](/resources/blog/best-cspm-tools), [Wiz vs Orca POC: 30 questions to ask](/resources/blog/wiz-vs-orca-poc-questions), and [what a CNAPP is](/learn/cnapp).*
`,
  },
  {
    slug: "orca-security-alternatives",
    title: "Orca Security alternatives & competitors 2026: 8 compared, in their own words",
    category: "Buyer's Guide",
    tags: ["cnapp","cspm","vendor-list"],
    excerpt: "Orca Security alternatives for 2026, each quoted from its own site with a date: Wiz, Cortex Cloud, Defender, CrowdStrike, Sysdig, Upwind, Aqua, Tenable.",
    author: "anup-yadav",
    date: "November 23, 2026",
    updated: "November 27, 2026",
    readTime: "11 min",
    body: `
*Vendor pages read 23 November 2026. Updated 27 November 2026: Onam's own figures and free plan. Onam sells a cloud security platform and is on this list; where we mention it, it is labelled. How the list was built is at the end.*

## The short answer

The main Orca Security alternatives and competitors in 2026 are **Wiz**, **Palo Alto Networks Cortex Cloud** (formerly Prisma Cloud), **Microsoft Defender for Cloud**, **CrowdStrike Falcon Cloud Security**, **Sysdig Secure**, **Tenable One Cloud Exposure**, **Upwind** and **Aqua Security**. Wiz is closest to Orca in design: both describe agentless scanning with an optional runtime sensor. Defender for Cloud has a free foundational tier. Choose by your clouds, the security vendor you already run, and how much runtime protection you need.

## Orca Security alternatives at a glance

Deployment and ranking are what each vendor's own page says, on the date given below. "Best fit" is our view. Pricing says only what is public.

| Platform | Best fit, in our view | Deployment, as the vendor describes it | Ranking, as described | Public pricing |
| --- | --- | --- | --- | --- |
| Aqua Security | Container and Kubernetes teams that want enforcement on the workload | Agent-based enforcement; workload posture "without deploying agents" | Reachability, EPSS scores, evidence of active exploitation | Not on the pages we read |
| Cortex Cloud (Palo Alto) | Estates standardised on Palo Alto | Agentless scanning plus lightweight runtime agents | Connects vulnerabilities, misconfigurations, identities and exposure | Not on the pages we read |
| CrowdStrike Falcon Cloud Security | Teams already running the Falcon sensor | Agent and agentless | Adversary intelligence and graph-based context | Not on the pages we read |
| Defender for Cloud | Azure-centred estates | Agentless connectors for AWS and GCP | Secure score; attack paths in paid Defender CSPM | Published; foundational CSPM is free |
| Sysdig Secure | Container and Kubernetes-heavy teams | Agentless posture plus an agent | Runtime insights with cloud context | Not on the pages we read |
| Tenable One Cloud Exposure | Tenable vulnerability management customers | AWS, Azure, GCP integration; in-account scanning add-on | Toxic combinations, attack paths | "Request pricing" |
| Upwind | Teams that want runtime context to drive the ranking | Agentless cloud scanners plus runtime sensors | Runtime intelligence with workload, API and agent context | Not on the pages we read |
| Wiz | Teams that want Orca's agentless-first shape from another vendor | Connects via API; optional Wiz Sensor | A single list of toxic combinations | Custom quote |
| Onam Security (us) | Estates including OCI, Alibaba or IBM Cloud; teams that want risk in money | Read-only cloud roles for posture; agentless workload scanning in your account | FAIR-style loss estimate per finding | $20 per unit a month Complete, $14 Posture ([pricing](/pricing)) |

## Why teams look for an Orca alternative

The reasons are usually ordinary. A renewal is due and procurement wants a second quote. A new cloud arrived, perhaps with an acquisition. The team already pays an endpoint or network vendor that now sells cloud security, and someone asks whether one contract would be simpler. Finance wants a ranking it can read. Or the team wants more runtime protection this year.

None of those is a verdict on Orca, which is on many cloud security shortlists for good reason. The fair way to answer them is to put the same questions to every platform, including Orca and including us.

## First, be clear what you would be replacing

Orca's page description reads: "Orca Security is the complete Cloud Security Platform that detects, prioritizes, and remediates security risks and compliance issues across your cloud estate." The platform page lists Orca SideScanning as "Agentless scanning across every workload." and the Orca Sensor as "Runtime observability & protection." Prioritisation is "Dynamic scoring & attack path analysis." Source: orca.security/platform, accessed 23 November 2026. We did not find list prices on the Orca pages we read.

So coverage starts agentless, with a sensor for runtime, and the ranking combines a score with attack paths. These are design choices, and the alternatives below make different ones. Write down which parts you rely on today; that list is what a replacement has to cover.

## Eight Orca competitors, in their own words

### 1. Aqua Security

Aqua says its platform will "Monitor behavior, detect exploitable risk, enforce policy and contain threats across the application lifecycle." On prioritisation: "Aquasec filters vulnerability risk based on what is actually executing in the workload, so teams act on real exposure instead of theoretical lists." On deployment: "Aquasec's agent-based architecture enforces protection locally, even when environments are disconnected or air gapped." Source: aquasec.com, accessed 23 November 2026. Its platform page adds that you can "See your cloud workload posture immediately, without deploying agents" (aquasec.com/aqua-cloud-native-security-platform, 23 November 2026).

- **Best for, in our view:** container and Kubernetes teams that want policy enforced on the workload, including in air-gapped environments.
- **Trade-off to check:** which parts run agentless and which need the agent.
- **Ask them:** how a posture finding with no runtime signal ranks against one with runtime evidence.

### 2. Cortex Cloud (Palo Alto Networks)

If your shortlist says Prisma Cloud, check which product name is on the quote. Palo Alto says "Cortex Cloud goes beyond traditional CNAPP solutions by unifying application security, cloud posture management and runtime defense in one platform." On prioritisation: "By connecting vulnerabilities, misconfigurations, identities and exposure risks, the platform identifies the issues that matter most". On deployment: "Cortex Cloud combines agentless scanning for cloud asset discovery, posture management and risk assessment with lightweight runtime agents for continuous threat monitoring and active protection." Source: paloaltonetworks.com/cortex/cloud, accessed 23 November 2026.

- **Best for, in our view:** estates standardised on Palo Alto, where one relationship covers network, endpoint and cloud.
- **Trade-off to check:** which workloads the runtime agents must reach for the protection you want.
- **Ask them:** how existing Prisma Cloud contracts map to Cortex Cloud.

### 3. CrowdStrike Falcon Cloud Security

CrowdStrike calls it "The most complete CNAPP with unified agent and agentless protection, from code to cloud." On prioritisation: "CrowdStrike enriches cloud risk detections with adversary intelligence and graph-based context, enabling you to prioritize exploitable exposures and prevent breaches." Source: crowdstrike.com/platform/cloud-security, accessed 23 November 2026.

- **Best for, in our view:** organisations already running the Falcon sensor on endpoints.
- **Trade-off to check:** which protections need the sensor, and what a workload without it receives.
- **Ask them:** how a posture finding is ranked when no adversary intelligence applies to it.

### 4. Microsoft Defender for Cloud

Microsoft describes Defender for Cloud as "a Cloud Native Application Protection Platform (CNAPP), which is a unified solution that combines multiple cloud security tools to protect applications across their entire lifecycle." Secure score will "Summarize your security posture based on the security recommendations." For other clouds: "Connect to your multicloud environments by using agentless methods for CSPM insight and CWPP protection", with connectors for AWS and GCP. Source: learn.microsoft.com, Defender for Cloud overview, accessed 23 November 2026.

- **Best for, in our view:** Azure-centred estates, where it is often already licensed.
- **Trade-off to check:** "Foundational CSPM (for free) provides continuous assessments, security recommendations, Secure Score, and the Microsoft cloud security benchmark", while attack path analysis sits in the paid Defender CSPM plan, priced publicly by billable resource (azure.microsoft.com, Defender for Cloud pricing, 23 November 2026).
- **Ask them:** how AWS and GCP resources are treated relative to Azure ones.

### 5. Sysdig Secure

Sysdig calls itself "The real-time cloud defense platform for teams who will not compromise on security." On prioritisation: "Sysdig prioritizes risk by combining runtime insights with cloud context to focus your team on what’s truly exploitable." On deployment, its agentless approach is "complemented by a scalable, performant agent that analyzes active processes in real time". Source: sysdig.com/platform/secure, accessed 23 November 2026.

- **Best for, in our view:** container and Kubernetes-heavy teams that want runtime insight to drive prioritisation.
- **Trade-off to check:** which prioritisation signals depend on the agent.
- **Ask them:** what the ranking looks like for accounts where the agent is not running.

### 6. Tenable One Cloud Exposure

The page at Tenable's Cloud Security address now names the product Tenable One Cloud Exposure. It aims to "Prevent cloud breaches and reduce cloud risk by closing gaps that misconfigurations, risky entitlements, and vulnerabilities create across multi-cloud and hybrid environments". On prioritisation: "Identify toxic combinations of risk first, with clear attack path visualizations and remediation workflows most likely to result in material damage." In-account scanning is an add-on, where "the data never leaves the environment." Source: tenable.com/products/tenable-cloud-security, accessed 23 November 2026.

- **Best for, in our view:** organisations already using Tenable for vulnerability management.
- **Trade-off to check:** which scanning mode is in the base product and which is the add-on.
- **Ask them:** how cloud findings rank against on-premises vulnerabilities in one queue.

### 7. Upwind

Upwind's home page says "Combine the context of your cloud workloads, APIs, and agents with runtime intelligence to identify the most critical risks, build a plan to fix them, and catch new attacks in real time." Source: upwind.io, accessed 23 November 2026. Its CNAPP page says "Upwind brings together the ease-of-use of agentless and the power of runtime", listing "Agentless Cloud Scanners" and "Runtime Sensors" (upwind.io/cnapp, 23 November 2026).

- **Best for, in our view:** teams that want runtime context, such as what is reachable, to decide what gets fixed first.
- **Trade-off to check:** which findings come from the agentless scanners alone and which need the sensors.
- **Ask them:** how the ranking changes where the sensor is not deployed.

### 8. Wiz

Wiz says "Built for cloud and AI, Wiz AI-APP is the platform to secure your AI applications from code to runtime." On prioritisation: "A single list of prioritized issues of toxic combinations of cloud and AI risk that have a high probability of being exploited and would lead to significant business impact." On deployment: "Wiz connects in minutes via API and achieves full coverage across cloud and AI resources", and "Runtime protection from the Wiz Sensor stops threats and provides deep, real-time threat detection with context for better prioritization." Source: wiz.io/platform, accessed 23 November 2026. Pricing is by custom quote (wiz.io/pricing, 23 November 2026).

- **Best for, in our view:** the closest design to Orca on this list, for teams that want that shape from a different vendor.
- **Trade-off to check:** what the sensor adds over API-based coverage, and where you would need it.
- **Ask them:** how a finding on one cloud is ranked against a finding on another. For a direct comparison, use our [Wiz vs Orca POC questions](/resources/blog/wiz-vs-orca-poc-questions).

### And Onam Security (that is us)

${ONAM_AT_A_GLANCE}

${ONAM_PRICES}

- **Best for, in our view:** estates that run OCI, Alibaba Cloud or IBM Cloud alongside AWS, Azure or GCP, and teams that need to rank risk in money for a board.
- **The honest gap:** we have no public reference customers yet, and no live runtime enforcement. If inline blocking is what you are buying, buy it from someone above who sells it.
- **Ask us:** the same questions as everyone else. Our answers are on the [Onam vs Orca](/compare/onam-vs-orca) page.

## How to choose an Orca alternative

- **You like Orca's agentless-first design and want a second quote.** Run Wiz against Orca in the same accounts, in the same two weeks.
- **You are Azure-first and already pay for Microsoft security.** Price Defender CSPM first; part of it may already be in what you own.
- **You run CrowdStrike or Palo Alto on endpoints and network.** Their cloud products extend an agent your team already operates. Test the posture side as hard as the runtime side.
- **Containers and Kubernetes are most of your estate.** Shortlist the platforms that lead with runtime, such as Sysdig, Upwind and Aqua.
- **You run more than the big three clouds, or the board wants risk in money.** That is the case we built Onam for.

Then put the same questions to every finalist:

| Question | Why it matters |
| --- | --- |
| How many clouds get first-class treatment? | Ask for the per-cloud rule breakdown as well as the headline. |
| What does onboarding grant, and what needs an agent? | Whatever needs a rollout may take time to reach the whole estate. |
| What unit is the ranking expressed in? | A score ranks findings against each other; a money figure ranks them against other spending. |
| Does it connect findings across engines and clouds? | The path that reaches data is often several ordinary findings in a row. |
| Is compliance evidence continuous? | Continuous evidence means you are ready for an audit on any day. |

For the POC itself, give two vendors plus Orca read-only access to the same non-production accounts for two weeks, and compare what each ranks first. Our [CNAPP POC question list](/resources/blog/wiz-vs-orca-poc-questions) has the full set, grouped by week. If you want to include us, start on the free plan or ask for the free audit scan of one account.

## How this list was built

- Each vendor is quoted verbatim from its own public page, with the address and date. If a page changes, tell us and we will update the quote.
- We did not test these products, and nothing here says what any of them cannot do. "Trade-off to check" means a design choice on the vendor's own page that you should confirm fits you.
- No ranking. Alphabetical order, with our own entry last.
- SentinelOne Singularity Cloud Security is often on these shortlists, but its page returned a security check for us on 23 November 2026, so we left it out rather than quote it from memory.

:::faq Frequently asked questions
### What are the best Orca Security alternatives in 2026?

The platforms most often compared with Orca Security are Wiz, Palo Alto Networks Cortex Cloud, Microsoft Defender for Cloud, CrowdStrike Falcon Cloud Security, Sysdig Secure, Tenable One Cloud Exposure, Upwind and Aqua Security, with SentinelOne also on many shortlists. "Best" depends on your clouds, your current security vendor and how much runtime protection you need, so run the same POC against two or three of them.

### Who are Orca Security's main competitors?

In CNAPP and cloud security posture, Orca's main competitors include Wiz, Palo Alto Networks, Microsoft, CrowdStrike, Tenable, SentinelOne, Sysdig, Upwind and Aqua Security, along with newer platforms such as Onam. Wiz is the closest in design.

### What is the difference between Orca and Wiz?

On their own pages, both describe agentless coverage, an optional runtime sensor (the Orca Sensor and the Wiz Sensor) and prioritisation built on attack paths or toxic combinations. The differences show up in your own accounts, so test both side by side; see [Wiz vs Orca: what to ask in a POC](/resources/blog/wiz-vs-orca-poc-questions).

### Is there a cheaper or free alternative to Orca Security?

We did not find Orca list prices on the pages we read, so a comparison starts with a quote. Microsoft publishes Defender for Cloud pricing and its foundational CSPM tier is free. Onam publishes $20 per unit a month for Complete and $14 per unit for Posture, and has a free plan of up to 25 units (API-based scanning only) plus a free one-time audit scan. A lower price only helps if it covers what you need, so compare tools on the same accounts.
:::

## Corrections

Last updated 27 November 2026 (Onam's own figures and free plan). Every vendor page quoted here was read on 23 November 2026, and every statement about another vendor is a quotation from its own public page. If anything is wrong or out of date, including anything about us, email hello@onamsecurity.com and we will correct it.

*Read next: [Wiz.io alternatives & competitors 2026](/resources/blog/wiz-alternatives), [Wiz vs Orca: what to ask in a POC](/resources/blog/wiz-vs-orca-poc-questions), and [Onam vs Orca](/compare/onam-vs-orca).*
`,
  },
  {
    slug: "wiz-vs-orca-poc-questions",
    title: "Wiz vs Orca POC: 30 questions to ask in any CNAPP trial",
    category: "Buyer's Guide",
    tags: ["cnapp","poc"],
    excerpt: "Running a Wiz vs Orca (or any CNAPP) POC? 30 vendor-neutral questions grouped by week: access, coverage, accuracy, prioritisation, remediation and cost.",
    author: "anup-yadav",
    date: "October 7, 2026",
    updated: "November 27, 2026",
    readTime: "9 min",
    body: `
A cloud security proof of concept usually ends with two vendors who both found plenty, both demoed well, and a team that still cannot say which one to buy. That is not the buyer's fault. Point any CNAPP at a messy cloud account and findings appear. The questions below are designed to separate platforms that look identical in a demo, whether your shortlist is Wiz vs Orca, Wiz vs Cortex Cloud, or anything else.

*Updated 27 November 2026: Onam's own answers below now use current figures, and they absorb our older post "Wiz vs Orca vs Prisma Cloud: 7 questions that decide a POC", which now redirects here. Onam sells a cloud security platform; where we mention it, it is labelled. Every question works just as well with us left off your list.*

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
27. **What will an auditor receive?** Export a report for one framework and ask your auditor whether it is usable.
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

If you include us, these are our answers to the questions that decide most POCs, stated so you can check them in your own accounts.

| Question | Onam's answer (product facts, 27 November 2026) |
| --- | --- |
| 1, 3. What does onboarding grant, and what runs in my account? | Posture scanning connects through read-only cloud roles you can read before you run them; agentless workload scanning runs inside your account. On AWS, Onam stores no secret: it assumes your role. |
| 6. Which clouds get the full engine? | Posture rules on seven clouds (AWS, Azure, Google Cloud, OCI, Alibaba Cloud, IBM Cloud, Kubernetes): 12,912 rule definitions, published per cloud. Definitions, not working checks: some are switched off or have no check yet. |
| 9. Identity: on which clouds? | Shadow-admin detection runs on AWS, Azure, Google Cloud and Kubernetes. Unused-access analysis (granted compared with used) runs on AWS and Google Cloud and needs cloud audit logs flowing into Onam; other clouds show granted access. |
| 10. Code to cloud? | Code findings link to the cloud workload or image built from them, with the method and confidence shown; IaC matches are labelled as suggestions. Terraform findings can open a fix pull request. |
| 16–19. What is first, and why? | One security graph across clouds, so a path can cross a provider boundary. Each finding carries a FAIR-style loss estimate with its inputs shown: an estimate for ranking, not a prediction. |
| 26. Frameworks? | 144 compliance frameworks: 119 with automated checks, 25 attestation-only. Controls with no automated check are marked for manual review. |

The honest limit: we have no public reference customers yet and no runtime enforcement. Response to threats is guidance only: Onam does not quarantine roles, revoke sessions or block IP addresses. If inline blocking is one of your success criteria, we will not meet it. The head-to-heads are on the [Onam vs Wiz](/compare/onam-vs-wiz) and [Onam vs Orca](/compare/onam-vs-orca) pages.

:::faq Frequently asked questions
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
:::

*Read next: [What is CNAPP](/learn/cnapp), [What is CSPM](/learn/cspm), and [how attack paths work](/learn/cloud-attack-path).*
`,
  },
  {
    slug: "dspm-implementation-checklist",
    title: "DSPM implementation checklist: a practical rollout for cloud data",
    category: "Data Security",
    tags: ["dspm","data","aws"],
    excerpt: "A step-by-step DSPM implementation checklist: inventory every data store, classify it, map who can reach it, and fix exposure in a sensible order.",
    author: "anup-yadav",
    date: "October 5, 2026",
    updated: "November 27, 2026",
    readTime: "6 min",
    body: `
**How do we roll out DSPM without boiling the ocean?** Inventory every data store, including the non-production copies. Label how sensitive each one is, and record how confident the label is. Map who and what can reach each sensitive store. Then fix in order of reachability, not in order of discovery. The seven steps below do exactly that, and the first one needs nothing but the cloud CLI you already have.

*Updated 27 November 2026: the Onam section now matches our current product facts (DSPM content scanning, and one unsourced claim removed). The checklist is tool-neutral until the last section.*

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

- Every cloud account and subscription is connected, including the ones outside production.
- Every region is covered, including ones you do not think you use.
- Each store has an owner, even if the first owner is "unknown, needs triage".

On AWS you can start the inventory for object storage with read-only CLI calls. List the buckets, then check each one's public access block and default encryption:

\`\`\`
aws s3api list-buckets --query "Buckets[].Name" --output text
aws s3api get-public-access-block --bucket <bucket-name>
aws s3api get-bucket-encryption --bucket <bucket-name>
\`\`\`

The public access block is the bucket-level setting only; AWS applies the most restrictive combination of the bucket and account settings, so check the account level too. Commands from the AWS CLI reference: [list-buckets](https://docs.aws.amazon.com/cli/latest/reference/s3api/list-buckets.html), [get-public-access-block](https://docs.aws.amazon.com/cli/latest/reference/s3api/get-public-access-block.html), [get-bucket-encryption](https://docs.aws.amazon.com/cli/latest/reference/s3api/get-bucket-encryption.html) (accessed 27 November 2026). Repeat per account; the same idea applies to databases and warehouses with their own list and describe calls.

### 3. Classify, and record your confidence

Classification can be done by reading contents or by reading metadata: names, tags, schemas, column names and configuration. Each has trade-offs. Content inspection is more precise but means a tool reads your data. Metadata classification is less intrusive and faster, but it can be wrong when names are vague.

Whatever approach you use, keep a confidence level on each label. A table with columns named \`ssn\` and \`dob\` is high confidence. A bucket called \`data-backup\` is not, and should be flagged for a human to confirm.

### 4. Map who can reach each sensitive store

This is the step most programmes skip, and it is the one that matters most. For each store labelled sensitive, answer:

- Which human users, roles and service accounts can read it?
- Which can write or delete?
- Is it reachable from the internet, directly or through a public endpoint?
- Are there cross-account or external principals in that list?

Access is rarely granted on the store itself. It comes through role policies, group memberships and trust relationships, so this step needs identity analysis as well as a resource check.

### 5. Check the basic controls on every sensitive store

For each sensitive store, verify:

- Encryption at rest is enabled, with a key you control where policy requires it.
- Encryption in transit is enforced.
- Public access is blocked unless there is a documented reason.
- Access logging is on, so you can answer "who read this?" after the fact.
- Retention and lifecycle rules match your data retention policy.
- The store is in a region your residency commitments allow.

### 6. Prioritise sensitive stores by exposure

You will find more issues than you can fix in a sprint. Rank them by combining sensitivity, reachability and identity:

1. Sensitive data reachable from the internet.
2. Sensitive data readable by identities that are themselves over-privileged or unused.
3. Sensitive data without encryption or logging.
4. Everything else.

### 7. Make it continuous

A one-off DSPM assessment is out of date within weeks. Set a cadence for re-classification, alert on new stores and on permission changes to sensitive ones, and track the trend as well as the current count.

## Common mistakes

- **Scanning production only.** Copies in development and test accounts are where weak controls live.
- **Treating classification as the finish line.** A labelled store with unknown access is still an unknown risk.
- **Fixing per bucket instead of per root cause.** If one template creates every export bucket, fix the template.
- **No owner.** A finding without an owner does not get fixed.

## How Onam approaches it

[Onam's Data Security engine](/platform/data-security) is its DSPM implementation. It inventories data stores across your connected clouds through read-only posture roles: object storage, managed databases and warehouses, streams, and self-hosted databases you onboard.

:::dataflow data-security
:::

**How it classifies (updated 26 and 27 November 2026).** By default, Onam labels each store from metadata: its name, description, tags and schema. Where you choose to adopt it, by deploying Onam's DSPM scanner in your own cloud account (AWS: S3, RDS and Aurora snapshots; Azure: Blob, Files, Azure SQL; Google Cloud: Cloud Storage, BigQuery, Cloud SQL) or the on-premises collector, it also reads samples of files and rows and classifies their contents with country-specific detectors. Content scanning is opt-in per tenant: nothing configured means nothing scanned. Without the scanner, a store whose names and tags say nothing gets no label until someone tags it.

Each store then carries the ways it can be reached: the grants that make it public, the other accounts its bucket policy lets in, the principals seen accessing it in the last 30 days, and the attack paths on the shared security graph that end at it. Alongside that you get encryption, logging, lifecycle and residency checks, and data lineage across up to 8 hops of replication, backup, ETL, streaming and export. Copies made by scripts are not visible today; only copies the cloud records are followed. The detail is in the [DSPM documentation](/docs/dspm/overview).

:::faq Frequently asked questions
### What is the first step of a DSPM rollout?
Agree what "sensitive" means for you, then inventory every data store in every account and region, including development and test copies. Classification without a complete inventory leaves the riskiest copies out.

### Does DSPM have to read our data to classify it?
No. Classification can work from metadata such as names, tags and schemas. Reading samples of contents is more precise. In Onam, content scanning happens only where you deploy its DSPM scanner or on-premises collector; otherwise labels come from metadata.

### How should DSPM findings be prioritised?
By exposure: sensitive data reachable from the internet first, then sensitive data readable by over-privileged or unused identities, then sensitive data without encryption or logging.
:::
`,
  },
  {
    slug: "data-lineage-security-unencrypted-hops",
    title: "Is every hop our customer data takes encrypted? Data lineage security in practice",
    category: "Data Security",
    tags: ["dspm","data","encryption","aws"],
    excerpt: "Every bucket passes its encryption check, yet the data still lands somewhere unprotected. How data lineage security finds the weak hop in a pipeline.",
    author: "anup-yadav",
    date: "October 5, 2026",
    updated: "November 27, 2026",
    readTime: "6 min",
    body: `
**Is every hop our customer data takes encrypted, or only the places it starts and ends?** Check the route, not the resources. Follow each sensitive source through every copy, export and staging location, and compare encryption, access and lifecycle at each stop. The weak point is usually an intermediate extract nobody owns.

*Updated 27 November 2026: the Onam section now describes DSPM content scanning, which customers can adopt since 26 November.*

Here is the pattern. The source database is encrypted with a customer-managed key. The data lake it feeds is encrypted. The warehouse is encrypted. Every individual resource passes its encryption check. And yet, somewhere in the middle, a nightly job writes an intermediate extract to a staging location that has default settings, broad read access and no lifecycle rule. The data is sitting there in a form nobody intended.

No per-resource check will flag this as a data protection problem in context, because each resource is judged alone. The weakness is in the path. That is what data lineage security is about.

## What data lineage security means

Data lineage is the record of where data comes from, what transforms it, and where it ends up. Data teams have used lineage for years to debug pipelines and answer "where did this number come from?". Data lineage security applies the same idea to protection: for every route sensitive data takes, are the controls consistent from the first hop to the last?

The questions change from "is this bucket encrypted?" to:

- Where does data from this sensitive source end up?
- Is every hop along that route encrypted, at rest and in transit?
- Does access widen as data moves downstream?
- Does any hop cross a region or account boundary that your commitments do not allow?

## Why pipelines create exposure

Pipelines are built for correctness and speed. Consistent controls come second. The common causes:

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

- Start from the stores you have classified as sensitive rather than from every pipeline.
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

### Grade the data route as well as the resources

Give each route a single risk grade based on its weakest hop. A route with four strong hops and one weak one is a weak route. Ranking by route rather than by store also cuts duplicate work: one finding about one flow, instead of separate tickets for each store it touches.

### Fix at the point of creation

Most weak hops are created by pipeline code or infrastructure templates. Fix the job definition or the template that creates the staging location as well as the instance of it you found today, or it will be recreated on the next run.

### Re-check after every pipeline change

New jobs, new destinations and new consumers change the route. Treat a new downstream destination for a sensitive source as something that should trigger a review.

## A short worked example

A customer table lives in an encrypted managed database. A nightly job exports it to an object storage folder, then loads it into a warehouse.

:::flow Customer table route, illustrative
Source database | encrypted, customer-managed key, app role only
Nightly export folder | default key, broad engineering role, no lifecycle rule
Warehouse | encrypted, analytics group
:::

| Hop | Encrypted at rest | Who can read | Lifecycle |
| --- | --- | --- | --- |
| Source database | Yes, customer-managed key | Application role | Backups per policy |
| Export folder | Yes, default key | Broad data engineering role | **None: every night's copy kept forever** |
| Warehouse | Yes | Analytics group | Per policy |

Every resource passes a basic encryption check. The route still has a problem: the export folder keeps every night's full copy forever, readable by more identities than the source. The fix is a lifecycle rule and a narrower role on the export location, made in the template that creates it. On AWS, you can see whether an export bucket has any lifecycle rule with one read-only call; a bucket with none returns a \`NoSuchLifecycleConfiguration\` error:

\`\`\`
aws s3api get-bucket-lifecycle-configuration --bucket <export-bucket>
\`\`\`

Command from the AWS CLI reference, [get-bucket-lifecycle-configuration](https://docs.aws.amazon.com/cli/latest/reference/s3api/get-bucket-lifecycle-configuration.html), accessed 27 November 2026.

## How Onam approaches it

Data lineage is part of [Onam's Data Security engine](/platform/data-security), its DSPM implementation. Onam links the relationships your cloud's configuration already records (replication, backup, ETL writes, streaming, export and import) into chains that start at the original source and follow each path up to eight hops. Every hop that crosses a region or an account is flagged, because those are the moments a copy leaves the controls on the original.

Each store in a chain carries its own DSPM checks (encryption, public access, logging, lifecycle) and its classification, so the route and the state of each stop on it can be read together. Lineage sees what configuration describes: copies made by scripts are not visible today, because a script with its own credentials leaves no relationship to follow. How chains are built is set out in the [lineage documentation](/docs/dspm/lineage).

*Update, 26 November 2026: classification is from metadata (names, tags, schema) by default. Where you choose to adopt it, by deploying Onam's DSPM scanner in your own cloud account or the on-premises collector, Onam also reads samples of files and rows and classifies their contents. Content scanning is opt-in per tenant; without it, Onam does not read data contents.*

:::faq Frequently asked questions
### What is data lineage security?
Applying data lineage, the record of where data comes from and where it ends up, to protection: checking that encryption, access and region controls stay consistent on every hop a sensitive dataset takes.

### Why do encrypted pipelines still leak data?
Because each resource is checked alone. Intermediate stores such as staging buckets and export folders are created for one job with default settings, and often keep copies longer and open them to more people than the source.

### How many hops does Onam follow?
Up to eight, starting at the original source, with every region or account crossing flagged.
:::
`,
  },
  {
    slug: "iac-security-scanning-fix-at-source",
    title: "Why does a fixed cloud finding come back? IaC security scanning that fixes the template",
    category: "Code Security",
    tags: ["code","iac","terraform","devsecops"],
    excerpt: "Console fixes are undone by the next terraform apply. A practical guide to IaC security scanning that traces cloud findings back to the template line.",
    author: "anup-yadav",
    date: "October 5, 2026",
    updated: "November 27, 2026",
    readTime: "6 min",
    body: `
**Why does a security finding we fixed in the console come back a week later?** Because the template that created the resource was never changed, so the next apply put the old setting back. Fix it in the infrastructure-as-code (IaC) source, scan templates before they deploy, and link runtime findings back to the code that made them.

*Updated 27 November 2026: Onam now links code findings to the cloud workload or image built from them, so the Onam section below has changed.*

An engineer gets a ticket: a storage bucket allows public access. They open the cloud console, turn public access off, and close the ticket. A week later the same finding is back. Nobody re-opened the bucket by hand. The next \`terraform apply\` recreated it exactly as the template describes it, because the template was never changed.

## Why console fixes do not stick

When infrastructure is managed as code, the code is the source of truth. Terraform, CloudFormation, Helm charts and Kubernetes manifests describe the desired state, and every apply pushes the cloud back towards that state. A manual change in the console is drift. Depending on how the resource is managed, the next deployment either reverts it silently or shows it as an unexpected diff that someone "fixes" by re-applying.

The result is a finding that keeps coming back, gets triaged again, and wears down trust in the security tool that keeps reporting it.

## What the fix looks like in Terraform

Turning public access off in the console changes the bucket, not the code. The lasting fix is a resource in the template:

\`\`\`
resource "aws_s3_bucket_public_access_block" "exports" {
  bucket = aws_s3_bucket.exports.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
\`\`\`

The resource and its four arguments are from the Terraform AWS provider documentation, [aws_s3_bucket_public_access_block](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_public_access_block) (accessed 27 November 2026). To see where the console and the code already disagree, run \`terraform plan -refresh-only\`, which reports changes made outside Terraform without proposing to change anything ([terraform plan](https://developer.hashicorp.com/terraform/cli/commands/plan), accessed 27 November 2026).

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
3. **Against the plan**, so what is checked is what will change, including values from variables and modules.

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
- Exceptions are recorded with a reason and an expiry. Nobody deletes the rule to get past it.

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

[Onam's Code Security engine](/platform/code-security) checks Terraform in a repository as part of every scan, alongside static analysis in 13 languages, dependency analysis, secret detection and CI workflow files (GitHub Actions, GitLab CI, Bitbucket Pipelines and Azure Pipelines). The template checks use Code Security's own rules; the posture engine checks what is deployed.

**New since 26 November 2026: the link back from runtime.** Code findings now link to the cloud workload or image built from them, with the method and confidence of the match shown. IaC matches are labelled as suggestions, because a template-to-resource match is an inference. Terraform findings can open a fix pull request for your team to review.

What Onam does not do here yet: it cannot gate a build on new findings only (a pipeline can start a scan itself and decide), and it does not comment on pull requests. For static-analysis findings in application code, [AI Code Fix](/platform/ai-code-fix) can rewrite the affected file on a separate branch for review; nothing merges itself. See [CI usage](/docs/code-security/ci).

:::faq Frequently asked questions
### What is IaC security scanning?
Checking infrastructure templates such as Terraform against security policy before anything is created, so a public bucket or an open security group is caught in the pull request rather than in production.

### Why does a fixed cloud finding come back?
The resource is managed as code and the code still describes the old setting, so the next apply recreates it. Change the template, not only the console.

### How do I find drift between Terraform and the cloud?
Run \`terraform plan -refresh-only\`. It shows what changed outside Terraform without proposing changes.
:::
`,
  },
  {
    slug: "ci-cd-security-gates-delta-gating",
    title: "How do we add a CI/CD security gate engineers do not switch off?",
    category: "Code Security",
    tags: ["code","ci-cd","devsecops"],
    excerpt: "Security gates that fail every build get switched off. How to design CI/CD security gates around new findings, clear output and an exception path.",
    author: "anup-yadav",
    date: "October 5, 2026",
    updated: "November 27, 2026",
    readTime: "6 min",
    body: `
**How do we add a security gate to CI that engineers do not switch off?** Block only on findings the change introduces, start with a short list of high-confidence rules, put the reason in the pull request, and give people a recorded exception path. A gate that blocks on three-year-old findings will be made "non-blocking just for now" within a week, and then nobody reads it.

*Updated 27 November 2026: the Onam section now matches our current product facts; two claims we could not source were removed.*

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

- Prefer reachability over presence: does your code call the vulnerable function at all?
- Consider exploitation signals such as EPSS and the CISA Known Exploited Vulnerabilities list alongside CVSS.
- Consider runtime context: is the workload that ships this package internet-reachable, and what identity does it run as?

### Provide an exception path

- Allow a finding to be marked as a false positive or accepted risk, with a reason and an approver.
- Give exceptions an expiry date so they are reviewed.
- Keep exceptions visible to the security team.

### Keep it fast

- Run incremental scans on the changed files where the scanner supports it. In a pull request job, Git gives you that list directly:

\`\`\`
git diff --name-only --diff-filter=ACMR origin/main...HEAD
\`\`\`

The three-dot form compares the branch with the point where it left \`main\`, and \`--diff-filter=ACMR\` keeps added, copied, modified and renamed files ([git diff](https://git-scm.com/docs/git-diff), accessed 27 November 2026).

- Run heavier scans, such as full DAST, on a schedule or before release, not on every commit.

### Measure the gate itself

- Track new findings introduced per week, findings blocked, exceptions granted, and time to fix the backlog.
- If exceptions climb, the policy is too strict or the rules are noisy. Fix the policy rather than letting the gate be bypassed.

## How Onam approaches it

[Onam's Code Security engine](/platform/code-security) brings static analysis (13 languages, 835 rules Onam wrote itself), dependency analysis, Terraform checks and secret detection into the same platform as its cloud posture. Code findings link to the cloud workload or image built from them, with the method and confidence shown, which is the runtime context step 4 above asks for.

The honest limit on gating: Onam cannot yet gate a build on new findings only. A pipeline can start a scan itself, read the findings and decide ([CI usage](/docs/code-security/ci)). It does not comment on pull requests today. So the practical route to the baseline-and-diff pattern is to start in report-only mode, work the backlog down, and turn your own gate on once the baseline is small.

For static-analysis findings, [AI Code Fix](/platform/ai-code-fix) can rewrite the affected file and push it to a separate branch for your team to review; nothing merges itself.

:::faq Frequently asked questions
### What is delta gating in CI/CD security?
Recording existing findings as a baseline and blocking a change only on findings it introduces. Old findings go to a backlog with owners and dates.

### Which findings should block a build first?
High-confidence, high-impact ones: committed secrets, critical injection flaws, and public storage or open admin ports in IaC. Run the rest in report-only mode until their false-positive rate is known.

### Should a security gate scan every file on every commit?
No. Scan the changed files in the pull request and run heavier scans, such as full DAST, on a schedule or before release.
:::
`,
  },
  {
    slug: "ai-sast-remediation-fix-branch",
    title: "AI SAST remediation: what an AI code fix should and should not do",
    category: "Code Security",
    tags: ["code","sast","ai","remediation"],
    excerpt: "AI can draft fixes for SAST findings, but it should never merge its own code. A practical look at safe AI SAST remediation, with a review checklist.",
    author: "anup-yadav",
    date: "October 5, 2026",
    updated: "November 27, 2026",
    readTime: "6 min",
    body: `
**Can we let AI fix our SAST findings?** Let it draft, never ship. A safe AI code fix changes only the flagged lines, is grounded in the rule's own guidance, lands on a separate branch, and goes through the same review and tests as any other change. Below: the design rules, a review checklist, and what a good fix diff looks like.

*Updated 27 November 2026: this post now includes our older post "AI-powered cloud remediation", which redirects here, and names the model Onam's AI Code Fix uses.*

Static analysis tools are good at finding problems and poor at getting them fixed. Turning each finding into a correct code change is still a developer's job, and that is where the backlog grows. AI drafting helps, and it can also introduce subtle bugs or a false sense that something is fixed.

## Why SAST findings do not get fixed

The barriers are rarely about whether a finding is real. They are about effort and context:

- **The fix needs the whole file.** A SQL injection on one line may need a change to how a query helper is called, an import, or a parameter list elsewhere in the file.
- **The developer is not the author.** Findings land on whoever owns the repository now, who may never have seen the code.
- **Guidance is generic.** "Use parameterised queries" is correct and still leaves the actual change to be worked out for this codebase, in this language, with this library.
- **Many findings, one file.** A legacy file can carry several findings at once, and fixing them one by one produces conflicting changes.

## What AI can reasonably do

A language model given the right context can draft a plausible fix for many common SAST rule types: injection, unsafe use of cryptographic functions, hard-coded credentials, insecure deserialisation and similar. The quality depends heavily on what it is given:

- **The full file**, not a snippet, so it can see imports, helper functions and code style.
- **All the findings in that file at once**, so the changes are consistent.
- **The rule's own guidance**: what the issue is, the recommended fix, and a compliant example in the same language.

What AI should not do is decide on its own that a change is correct and ship it. A model can produce code that compiles, looks right and changes behaviour in a way only a test or a reviewer will catch.

## Design principles for safe AI code fixes

### Treat the AI fix as a proposal for review

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

## What a good AI fix looks like

For a hard-coded database password, a good fix branch carries the same file with the literal replaced by an environment-variable lookup, and nothing else changed. Illustrative Python diff:

\`\`\`
-    conn = psycopg2.connect(host=DB_HOST, user="app", password="s3cr3t-prod")
+    conn = psycopg2.connect(host=DB_HOST, user="app", password=os.environ["DB_PASSWORD"])
\`\`\`

If the diff also renames variables, reorders imports or reformats the file, reject it: the reviewer can no longer see the security change. (\`os.environ\` is Python's standard mapping of environment variables, [os.environ](https://docs.python.org/3/library/os.html#os.environ), accessed 27 November 2026.)

## How Onam approaches it

[Onam's AI Code Fix](/platform/ai-code-fix) works on the findings produced by its static analysis scanner. It rewrites static-analysis findings only; library (dependency) and live-app (DAST) findings are not rewritten, because there is no source line of yours to change.

| Step | What happens |
| --- | --- |
| Select | You choose the scan and which severities to fix. Findings your team marked as false positives are left out. |
| Group | Findings are grouped by file, so every issue in one file is fixed in a single pass. |
| Ground | The model receives the whole file, every finding in it, and the rule's guidance: the recommendation, plus a compliant example in the same language where one exists. |
| Constrain | The model is told to fix only the listed issues and keep indentation, names and style unchanged. |
| Hand over | Corrected files are committed to a fix branch named after the scan and pushed for review. Nothing merges and nothing deploys on its own. |

**Data handling.** For AI Code Fix, the affected file is sent to a language model (Mistral). Only files with findings are sent. The Git token needed to push the branch is passed per request and is not stored or logged. Each finding's outcome is recorded with a status, so you can see which were patched on the branch and which were not. If AI generation is not available, findings still carry the rule's explanation and compliant example as guidance.

:::faq Frequently asked questions
### Is it safe to let AI fix SAST findings?
Yes, if the AI only proposes: a separate branch, a small diff limited to the flagged issues, and the same review and tests as any other change. Never let a generated fix merge itself.

### Which model does Onam's AI Code Fix use?
Mistral. The affected file, the findings in it and the rule guidance are sent to it; only files with findings are sent.

### Can AI Code Fix fix vulnerable dependencies?
No. It rewrites static-analysis findings in your source only. Dependency and live-app findings carry guidance instead.
:::
`,
  },
  {
    slug: "cloud-access-review-checklist",
    title: "How do we run a cloud access review that removes access? A checklist",
    category: "Identity",
    tags: ["identity","ciem","aws"],
    excerpt: "Most cloud access reviews are a spreadsheet nobody answers. A practical checklist for reviewing cloud entitlements, including machine identities.",
    author: "anup-yadav",
    date: "October 5, 2026",
    updated: "November 27, 2026",
    readTime: "6 min",
    body: `
Once a quarter, someone exports a list of users and their roles, splits it by team, and emails each manager a spreadsheet with a column headed "Still needed? Y/N". Most rows come back "Y". Some do not come back at all. The spreadsheet is filed as audit evidence, and the access stays exactly as it was.

**How do we run a cloud access review that actually removes access?** Review effective permissions next to recent usage, start with shadow admins and external access, give reviewers concrete outcomes (keep, reduce, remove, defer with a date), and record each decision as a state that expires. "Still needed? Y/N" changes nothing; evidence and states do.

*Updated 27 November 2026: Onam's identity analysis now covers more clouds, so the Onam section has changed.*

## Why cloud access reviews are harder than they look

Access reviews were designed for applications with a handful of roles and a list of human users. Cloud accounts break that model in several ways:

- **Most identities are not people.** Service accounts, function execution roles, instance profiles, pod identities and managed identities often outnumber human users, and none of them has a manager to ask.
- **Attached is not effective.** What an identity can do depends on its policies, group memberships, permission boundaries, organisation-level guardrails and the roles it can assume. A reviewer looking at the attached policy names sees only part of it.
- **Access crosses accounts.** A role in one account may be assumable from another, or by an external party. That access does not appear in the target account's user list at all.
- **Reviewers lack evidence.** Asking "is this still needed?" without showing whether the access has been used invites a reflexive yes.
- **Nothing tracks the outcome.** A "no" in a spreadsheet does not remove anything. Someone has to turn it into a change, and that step is often lost.

## What a good review needs to answer

For each identity in scope, the reviewer should be able to see:

1. Who or what is this identity, and who owns it?
2. What can it effectively do, after all policies and role chains are resolved?
3. What has it used recently?
4. Can it reach admin-level permissions, directly or through a chain of roles?
5. Can anyone outside this account or organisation use it?
6. Has it been active at all?

With those answers on the page, most decisions become obvious.

## A checklist for cloud access reviews

### Before the review: set scope and ownership

- Include every cloud account and subscription, not only production.
- Include non-human identities explicitly. Give each one an owning team, since there is no line manager to ask.
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

On AWS you can produce the usage evidence for one role yourself with two read-only IAM calls. The first starts a report of when each service was last used; the second reads it:

\`\`\`
aws iam generate-service-last-accessed-details --arn arn:aws:iam::<account-id>:role/<role-name>
aws iam get-service-last-accessed-details --job-id <job-id-from-the-first-command>
\`\`\`

Services the role is allowed to use but has never called are the first candidates to remove. Commands from the AWS CLI reference: [generate-service-last-accessed-details](https://docs.aws.amazon.com/cli/latest/reference/iam/generate-service-last-accessed-details.html) and [get-service-last-accessed-details](https://docs.aws.amazon.com/cli/latest/reference/iam/get-service-last-accessed-details.html), accessed 27 November 2026.

- Show effective permissions rather than policy names.
- Show recent usage next to granted permissions, so the gap is visible.
- Show why the identity was flagged, if it was.
- Offer concrete outcomes rather than yes or no: keep, reduce to a suggested policy, remove, or defer with a reason.

### Record access decisions as states

Each identity should end the review in a clear state, for example:

- **Reviewed**: access confirmed as appropriate.
- **Needs remediation**: access should change, with a ticket or change attached.
- **Deferred**: a decision is postponed, with a reason and a date.
- **Pending**: not yet reviewed, and visible as such.

States make the review measurable. You can see what was decided, what is outstanding and what changed since last quarter.

### After the review: close the loop

- Turn every "needs remediation" decision into a change in IAM, ideally a reduced policy based on observed usage rather than a manual edit.
- Remove zombie identities and stale keys, after confirming nothing depends on them.
- Re-check after the change, so the review evidence reflects what is in place now.
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

[Onam's CIEM engine](/platform/ciem) resolves effective permissions for users, roles and service accounts from the posture inventory, walking policies, group memberships, conditions, explicit denies and cross-account trust. Machine identities such as Lambda execution roles, instance profiles, CI/CD roles over OIDC and Kubernetes service accounts are analysed alongside users.

**Which clouds get what (updated 27 November 2026):**

| Capability | Clouds |
| --- | --- |
| Shadow-admin detection | AWS, Azure, Google Cloud and Kubernetes |
| Unused access (granted compared with used, over a 30-day window) | AWS and Google Cloud, with cloud audit logs flowing into Onam; other clouds show granted access only |
| Escalation paths | AWS assume-role chains up to 12 hops; Google Cloud service-account impersonation chains up to 4 hops |
| Access reviews | AWS, with a risk score from usage; Azure and Google Cloud, opened from high or critical escalation findings, using granted access |

On AWS, an identity whose risk score reaches 60 is put up for review, and a review decision expires after 90 days, so "keep" is never permanent. Every identity in a review carries a state (pending, needs remediation, reviewed or deferred), and the finding that triggered the review stays attached, so the reviewer can see why it was flagged.

:::faq Frequently asked questions
### How often should cloud access be reviewed?
Quarterly is common for audits, but the useful pattern is continuous: re-review an identity when its permissions or its usage change, and let every "keep" decision expire.

### What should a cloud access review look at first?
Shadow admins (identities that can reach admin through a chain), external and cross-account access to privileged roles, zombie identities, privileged identities without MFA, and the largest gaps between granted and used permissions.

### Which clouds does Onam run access reviews on?
AWS, with a usage-based risk score; Azure and Google Cloud, opened from high or critical escalation findings and based on granted access.
:::

For the background on CIEM itself, see [CIEM vs IAM security](/resources/blog/ciem-vs-iam-security).
`,
  },
  {
    slug: "wiz-alternatives",
    title: "Wiz.io alternatives & competitors 2026: 8 compared, with public pricing",
    category: "Buyer's Guide",
    tags: ["cnapp","cspm","vendor-list"],
    excerpt: "Wiz.io alternatives and competitors for 2026, quoted from their own sites with dates: Orca, Cortex Cloud, Defender, CrowdStrike, Sysdig. Public pricing noted.",
    author: "anup-yadav",
    date: "September 15, 2026",
    updated: "November 27, 2026",
    readTime: "12 min",
    body: `
*Updated 27 November 2026: Onam's own figures and free plan. Vendor read dates are in the Corrections note. Onam sells a cloud security platform and is on this list; where we mention it, it is labelled. How the list was built is at the end.*

## The short answer

The main Wiz.io alternatives and competitors in 2026 are **Orca Security**, **Palo Alto Networks Cortex Cloud** (formerly Prisma Cloud), **Microsoft Defender for Cloud**, **CrowdStrike Falcon Cloud Security**, **Tenable Cloud Security**, **SentinelOne Singularity Cloud Security**, **Sysdig Secure** and **Fortinet's Lacework FortiCNAPP**. Orca is closest to Wiz in design. Defender for Cloud has a free foundational tier. Choose by your clouds, your current security vendor and whether you need runtime blocking.

## Wiz.io alternatives and competitors at a glance

Each cell in the deployment and ranking columns is what the vendor's own page says, on the date shown further down. "Best fit" is our view. Pricing says only what is public.

| Platform | Best fit, in our view | Deployment, as the vendor describes it | Ranking, as described | Public pricing |
| --- | --- | --- | --- | --- |
| Orca Security | Teams that want Wiz's agentless-first shape from another vendor | Agentless SideScanning; optional Orca Sensor | Dynamic scoring and attack path analysis | Ask for a quote |
| Cortex Cloud (Palo Alto) | Estates standardised on Palo Alto | Agentless scanning plus lightweight runtime agents | Connects vulnerabilities, misconfigurations, identities and exposure | Ask for a quote |
| Defender for Cloud | Azure-centred estates | Agentless connectors for AWS and GCP; Defender for Endpoint for servers | Secure score; attack paths in the paid Defender CSPM plan | Published; foundational CSPM is free |
| CrowdStrike Falcon Cloud Security | Teams already running the Falcon sensor | Agent and agentless | Adversary intelligence and graph context | Ask for a quote |
| Tenable Cloud Security | Tenable vulnerability management customers | Integrates with AWS, Azure, GCP; in-account scanning add-on | Toxic combinations, attack path visualisations | Ask for a quote |
| SentinelOne Singularity Cloud Security | SentinelOne endpoint customers | Not stated on the page we read; ask | "Verified, exploitable risk" | Ask for a quote |
| Sysdig Secure | Container and Kubernetes-heavy teams that want runtime depth | Agentless posture plus an agent | Runtime insights with cloud context | Ask for a quote |
| Lacework FortiCNAPP (Fortinet) | Fortinet network estates | Not stated on the page we read; ask | Attack path visualisation | Ask for a quote |
| Onam Security (us) | Multi-cloud estates including OCI, Alibaba or IBM Cloud; teams that want risk in money | Read-only cloud roles for posture; agentless workload scanning in your account | FAIR-style loss estimate per finding, raised on attack paths | $20 per unit a month, CIEM and DSPM included; free plan up to 25 units ([pricing](/pricing)) |

## Why teams look for a Wiz alternative

People search for Wiz alternatives for ordinary reasons. A renewal quote landed. Google completed its acquisition of Wiz in March 2026, and some buyers with a cloud-neutrality policy want to re-check their vendor mix; Google has said Wiz will keep supporting other clouds. A second or third cloud arrived. The security team wants a ranking the finance team can read. Someone decided that runtime blocking matters, or that nothing more should be installed on workloads.

None of those is a verdict on Wiz, which is on nearly every cloud security shortlist for good reason. They are questions, and the honest way to answer them is to put the same questions to every platform on the list, including Wiz and including us.

## First, be clear what you would be replacing

Wiz describes its platform as "Built for cloud and AI, Wiz AI-APP is the platform to secure your AI applications from code to runtime." On prioritisation it promises "A single list of prioritized issues of toxic combinations of cloud and AI risk that have a high probability of being exploited." On deployment: "Wiz connects in minutes via API and achieves full coverage across cloud and AI resources", and "Runtime protection from the Wiz Sensor stops threats and provides deep, real-time threat detection." Source: wiz.io/platform, re-checked 7 October 2026. Wiz does not publish list prices; its pricing page describes packages called Wiz One and Wiz Go plus à la carte options, quoted on request (wiz.io/pricing, 7 October 2026).

Two things in that description matter for a shortlist. The ranking unit is a prioritised list of combined risks, and runtime coverage comes from a sensor. Neither is a weakness. They are design choices, and the alternatives below make different ones.

## Eight Wiz competitors, in their own words

### 1. CrowdStrike Falcon Cloud Security

CrowdStrike calls it "The most complete CNAPP with unified agent and agentless protection, from code to cloud." On prioritisation: "CrowdStrike enriches cloud risk detections with adversary intelligence and graph-based context, enabling you to prioritize exploitable exposures and prevent breaches." Source: crowdstrike.com/platform/cloud-security, re-checked 23 November 2026.

- **Best for, in our view:** organisations already running the Falcon sensor on endpoints, where cloud runtime protection extends an agent the operations team knows.
- **Trade-off to check:** which protections need the sensor deployed, and what a workload without it receives.
- **Ask them:** how a posture finding is ranked when no adversary intelligence applies to it.

### 2. Cortex Cloud (Palo Alto Networks)

If your shortlist says Prisma Cloud, check which product name is on the quote. Palo Alto says "Cortex Cloud goes beyond traditional CNAPP solutions by unifying application security, cloud posture management and runtime defense in one platform." On prioritisation: "By connecting vulnerabilities, misconfigurations, identities and exposure risks, the platform identifies the issues that matter most". On deployment: "Cortex Cloud combines agentless scanning for cloud asset discovery, posture management and risk assessment with lightweight runtime agents for continuous threat monitoring and active protection." Source: paloaltonetworks.com/cortex/cloud, re-checked 23 November 2026.

- **Best for, in our view:** estates standardised on Palo Alto, where one commercial relationship covers network, endpoint and cloud.
- **Trade-off to check:** which workloads the runtime agents must reach, and who owns that rollout.
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

${ONAM_AT_A_GLANCE}

${ONAM_PRICES}

- **Best for, in our view:** estates that run OCI, Alibaba Cloud or IBM Cloud alongside AWS, Azure or GCP, and teams that need to rank risk in money for a board.
- **The honest gap:** we have no public reference customers yet, and no live runtime enforcement. API-based posture scanning cannot see inside a running process. If inline blocking is what you are buying, buy it from someone above who sells it.
- **Ask us:** the same questions as everyone else. Our answers are on the record on the [Onam vs Wiz](/compare/onam-vs-wiz) page.

## How to choose a Wiz alternative

Start from your own situation before looking at the feature grid:

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

If you want to include us, start on the free plan, or ask for the free audit scan and we will run it against one account. If the attack paths we surface are noise, tell us. That is more useful to us than a signature.

## How this list was built

- Each vendor is quoted from its own public page, verbatim, with the address and the date. If the page changes, the quote is out of date, not wrong, and we will fix it when told.
- Nothing here says what any product cannot do. We did not test them. "Trade-off to check" means a design choice stated on the vendor's own page that you should confirm fits you, not a gap.
- No ranking. Alternatives are listed alphabetically, with our own entry last.
- Corrections go to hello@onamsecurity.com and we apply them.

:::faq Frequently asked questions
### What are the best Wiz alternatives in 2026?

The platforms most often compared with Wiz are Orca Security, Palo Alto Networks Cortex Cloud, Microsoft Defender for Cloud, CrowdStrike Falcon Cloud Security, Tenable Cloud Security, SentinelOne Singularity Cloud Security, Sysdig Secure and Lacework FortiCNAPP. "Best" depends on your clouds, your existing security vendor and whether you need runtime blocking; run the same POC against two or three of them.

### Who are Wiz's main competitors?

In cloud security posture and CNAPP, Wiz's main competitors are Orca Security, Palo Alto Networks (Cortex Cloud), Microsoft (Defender for Cloud), CrowdStrike, Tenable, SentinelOne, Sysdig and Fortinet. Aqua Security and Check Point also appear on many shortlists, as do newer platforms such as Onam. Orca is the closest in design: agentless first, with an optional runtime sensor.

### What is a cheaper alternative to Wiz?

Wiz does not publish list prices, so any price comparison starts with a quote. Of the platforms here, Microsoft publishes Defender for Cloud pricing and its foundational CSPM tier is free, Prowler is an open-source posture scanner, and Onam publishes $20 per unit a month with CIEM and DSPM included, and has a free plan of up to 25 units plus a free one-time audit scan ([pricing](/pricing)). The others quote on request. Cheaper only helps if it covers what you need, so compare tools on the same accounts.

### What is the difference between Wiz and Orca?

On their own pages, both describe agentless scanning with an optional runtime sensor (the Wiz Sensor and the Orca Sensor) and attack-path-based prioritisation. The differences that matter show up in your own accounts, so test both side by side; see [Wiz vs Orca: what to ask in a POC](/resources/blog/wiz-vs-orca-poc-questions).

### Is there a free alternative to Wiz?

Microsoft's foundational CSPM tier in Defender for Cloud is free, open-source scanners such as Prowler cover posture checks for the main clouds, and Onam has a free plan of up to 25 units with API-based scanning only (CSPM, CIEM, API-based DSPM and AI-SPM). None of these is a like-for-like replacement for a full CNAPP, so compare what each covers.

### How much does Wiz cost?

Wiz does not publish list prices. Its pricing page describes the Wiz One and Wiz Go packages plus à la carte options, priced by quote. Ask every vendor the same question: what unit the price grows with, and what is an add-on.

### Is Wiz owned by Google?

Yes. Google completed its acquisition of Wiz in March 2026. Google has said Wiz will continue to support other clouds, including AWS, Azure and Oracle Cloud.
:::

## Corrections

Last updated 27 November 2026 (Onam's own figures and free plan). Cortex Cloud and CrowdStrike were re-read on 23 November 2026; Wiz, Orca, SentinelOne and Sysdig on 7 October 2026; the others on the dates shown. Every statement about another vendor is a quotation from that vendor's own public page. If any of it is wrong or out of date, including anything about us, email hello@onamsecurity.com and it will be corrected.

*Read next: [Best CSPM tools in 2026](/resources/blog/best-cspm-tools), [Prisma Cloud alternatives](/resources/blog/prisma-cloud-alternatives), [Orca Security alternatives](/resources/blog/orca-security-alternatives), [Which CSPM tools have public pricing](/resources/blog/cspm-tools-public-pricing), and [what a CNAPP is](/learn/cnapp).*
`,
  },
  {
    slug: "best-cspm-tools",
    title: "Best CSPM tools 2026: 9 compared in vendors' own words, with public pricing",
    category: "Buyer's Guide",
    tags: ["cspm","cnapp","vendor-list"],
    excerpt: "Best CSPM tools 2026: Wiz, Orca, Defender for Cloud, Cortex Cloud, CrowdStrike, Tenable, Sysdig and more, quoted from their own pages, with public pricing.",
    author: "anup-yadav",
    date: "September 15, 2026",
    updated: "November 27, 2026",
    readTime: "12 min",
    body: `
*Updated 27 November 2026: Onam's own figures and free plan. Onam sells a cloud security platform and is on this list; where we mention it, it is labelled. Every other tool is described in its vendor's own words, with the page and the date, and nobody is scored.*

## The short answer

The best CSPM tools in 2026 to shortlist are **Wiz**, **Orca Security**, **Microsoft Defender for Cloud**, **Palo Alto Networks Cortex Cloud**, **CrowdStrike Falcon Cloud Security**, **Tenable Cloud Security**, **SentinelOne Singularity Cloud Security** and **Sysdig Secure**, with Onam as a newer option. Most are sold as CNAPPs. Pick by your clouds, your current security vendor and whether you need runtime blocking.

## What a CSPM tool is, in one paragraph

Cloud security posture management checks the configuration of your cloud estate against rules, continuously, and tells you where it is wrong: the public bucket, the role with wildcard permissions, the database with no encryption, the security group open to the world. A longer explanation is on our [What is CSPM](/learn/cspm) page, and how CSPM sits inside a wider platform is on [What is CNAPP](/learn/cnapp).

## The best CSPM tools of 2026 at a glance

Deployment and ranking are what each vendor's own page says, on the date read. "Best fit" is our view. Pricing says only what is public.

| Tool | Best fit, in our view | Deployment, as described | Ranking, as described | Public pricing |
| --- | --- | --- | --- | --- |
| Cortex Cloud | Palo Alto estates | Agentless scanning plus lightweight runtime agents | Connects vulnerabilities, misconfigurations, identities and exposure | Ask for a quote |
| Falcon Cloud Security | Falcon endpoint customers | Agent and agentless | Adversary intelligence and graph context | Ask for a quote |
| Defender for Cloud | Azure-centred estates | Agentless connectors for AWS and GCP; Defender for Endpoint for servers | Secure score; attack paths in the paid Defender CSPM plan | Published; foundational CSPM is free |
| Orca Security | Agentless-first teams | Agentless SideScanning; optional Orca Sensor | Dynamic scoring and attack path analysis | Ask for a quote |
| Singularity Cloud Security | SentinelOne endpoint customers | Not stated on the page we read | "Verified, exploitable risk" | Ask for a quote |
| Sysdig Secure | Container and Kubernetes-heavy teams | Agentless posture plus an agent | Runtime insights with cloud context | Ask for a quote |
| Tenable Cloud Security | Tenable VM customers | Integrates with AWS, Azure, GCP; in-account scanning add-on | Toxic combinations, attack path visualisations | Ask for a quote |
| Wiz | Almost any shortlist; the category reference point | API connection; Wiz Sensor for runtime | "Prioritized issues of toxic combinations" | Packages quoted on request |
| Onam Security (us) | Estates beyond the big three clouds; risk in money | Read-only roles for posture; agentless workload scanning in your account | FAIR-style loss estimate, raised on attack paths | $20 per unit a month, CIEM and DSPM included; free plan up to 25 units ([pricing](/pricing)) |

## How to evaluate CSPM tools: five criteria that still separate them

Every tool on this list finds misconfigurations. That stopped being a differentiator years ago. Five things still separate them.

1. **Depth per cloud.** The headline rule count hides whether your third cloud gets the same engine as your first. Ask for the per-cloud breakdown.
2. **A single graph or several silos.** A path that starts in one cloud and ends in another is invisible to a tool that analyses each cloud on its own. See [cloud attack paths](/learn/cloud-attack-path).
3. **Deployment.** What onboarding grants, and which features need an agent or sensor. Anything that needs a rollout reaches part of the estate.
4. **The ranking unit.** Severity labels rank findings against each other. Business impact, ideally in money, ranks them against everything else the company could fund. See [cloud risk quantification](/learn/cloud-risk-quantification).
5. **Continuous compliance evidence.** Evidence generated when someone clicks export is evidence for one day a quarter.

## The CSPM tools worth shortlisting in 2026

### 1. Cortex Cloud (Palo Alto Networks)

Palo Alto says "Cortex Cloud goes beyond traditional CNAPP solutions by unifying application security, cloud posture management and runtime defense in one platform." On prioritisation: "By connecting vulnerabilities, misconfigurations, identities and exposure risks, the platform identifies the issues that matter most". On deployment: "Cortex Cloud combines agentless scanning for cloud asset discovery, posture management and risk assessment with lightweight runtime agents for continuous threat monitoring and active protection." Source: paloaltonetworks.com/cortex/cloud, re-checked 23 November 2026.

- **Best for:** estates already on Palo Alto for network and endpoint.
- **Check:** which workloads the agent must reach. If you were quoted Prisma Cloud, ask which product name applies.

### 2. CrowdStrike Falcon Cloud Security

CrowdStrike calls Falcon Cloud Security "The most complete CNAPP with unified agent and agentless protection, from code to cloud." On prioritisation: "CrowdStrike enriches cloud risk detections with adversary intelligence and graph-based context, enabling you to prioritize exploitable exposures and prevent breaches." Source: crowdstrike.com/platform/cloud-security, re-checked 23 November 2026.

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

${ONAM_AT_A_GLANCE}

${ONAM_PRICES}

- **Best for:** estates running OCI, Alibaba Cloud or IBM Cloud alongside the big three, and teams that need risk in money for a board.
- **The honest gap:** we have no public reference customers yet, and no live runtime enforcement. API-based posture scanning cannot see inside a running process. If inline blocking is a requirement, one of the tools above sells it and we do not.

## How to choose a CSPM tool

Match the shortlist to your situation first:

| If this is you | Start your shortlist with |
| --- | --- |
| Azure-first, already paying for Microsoft security | Defender for Cloud, then one independent platform to compare |
| Standardised on Palo Alto, CrowdStrike, SentinelOne or Tenable | That vendor's cloud product, plus one independent platform |
| You want an agentless-first platform from an independent vendor | Wiz and Orca, side by side |
| Containers and Kubernetes dominate, runtime matters most | A runtime-first platform such as Sysdig, plus one posture-first platform |
| You run OCI, Alibaba Cloud or IBM Cloud, or need risk in money | Include Onam and ask every vendor to demo those clouds |
| Small team, tight budget | Start with a free option (Defender foundational CSPM, open-source Prowler, or Onam's free plan of up to 25 units) before buying |

Then run a two-week proof of concept. Connect three tools to the same non-production accounts you know have real problems, and compare what each ranks first, in what unit, and how many of the top findings are the same problem viewed from different angles. Our [CNAPP POC question list](/resources/blog/wiz-vs-orca-poc-questions) gives you the questions to ask in each week.

If you want Onam in that three, start on the free plan or ask for the free audit scan. If the paths we surface are noise, say so.

## How this list was built

Vendors' own public pages, quoted verbatim, with the address and the date read. No claims about what any product cannot do, because we did not test them. "Check" lines are design choices stated on the vendor's own page that you should confirm fit you. Alphabetical order, with our own entry last. Corrections to hello@onamsecurity.com.

:::faq Frequently asked questions
### What is the best CSPM tool in 2026?

There is no single best tool for every estate. Wiz, Orca Security, Microsoft Defender for Cloud, Cortex Cloud, CrowdStrike Falcon Cloud Security, Tenable Cloud Security, SentinelOne and Sysdig are the most commonly shortlisted. Pick by your clouds, your existing security vendor and whether you need runtime protection, then prove it in a POC on your own accounts.

### What is the difference between CSPM and CNAPP?

CSPM checks cloud configuration against rules. A CNAPP bundles CSPM with workload protection, identity (CIEM), data security, code scanning and often runtime detection on one platform. Most tools on this list are sold as CNAPPs. More on [what a CNAPP is](/learn/cnapp).

### Agentless or agent-based CSPM: which is better?

Posture management itself works through cloud provider APIs and needs no agent. Agents or sensors add runtime visibility and blocking inside running workloads. Most vendors now offer both; the question is which features you lose on workloads where the agent is not deployed.

### Which CSPM tool is best for multi-cloud?

Every vendor says multi-cloud. Ask for the per-cloud rule breakdown, a live demo on your second and third clouds, and whether attack paths can cross from one cloud to another.

### Are there free CSPM tools?

Yes. Microsoft's foundational CSPM tier in Defender for Cloud is free, Prowler is an open-source posture scanner, and Onam has a free plan of up to 25 units with API-based scanning only. Free options usually stop short of attack paths and full compliance coverage, so compare what is included.

### How long does a CSPM deployment take?

Connecting an account through a read-only role is usually quick for any of these tools; reaching your whole estate takes as long as your change process for granting that role across every account. Measure time to a complete inventory in your own POC rather than relying on vendor claims.
:::

## Corrections

Last updated 27 November 2026 (Onam's own figures and free plan). Wiz, Orca, SentinelOne and Sysdig were read on 7 October 2026; the others on the dates shown. Every statement about another vendor is a quotation from that vendor's public page. If anything is wrong or out of date, including anything about us, email hello@onamsecurity.com and it will be corrected.

*Read next: [Which CSPM tools have public pricing](/resources/blog/cspm-tools-public-pricing), [Wiz alternatives](/resources/blog/wiz-alternatives), [Prisma Cloud alternatives](/resources/blog/prisma-cloud-alternatives), [Orca Security alternatives](/resources/blog/orca-security-alternatives), the [comparison pages](/compare), and [What is CSPM](/learn/cspm).*
`,
  },
  {
    slug: "cdr-behavioral-threat-detection",
    title: "We run GuardDuty. What would we still miss in cloud threat detection?",
    category: "Threat Detection",
    tags: ["threat-detection","cdr","aws","logging"],
    excerpt: "Which logs to switch on, one attack traced from the first CloudTrail line to an incident, and what correlation and baselines add to GuardDuty. With honest limits.",
    author: "anup-yadav",
    date: "July 15, 2026",
    updated: "November 27, 2026",
    readTime: "6 min",
    body: `
**We run GuardDuty. What would we still miss, and what does it take to catch it?** Mostly the attacks built from legitimate calls: stolen credentials used slowly, a role assumed the way your own engineers assume it, an admin role created by a pipeline identity. Catching those needs the right logs switched on, then detection that looks at the order of events and at each identity's normal behaviour, not only at single known-bad events. Keep GuardDuty; this post is about what sits around it.

*Rewritten 27 November 2026. The earlier version was titled "Beyond GuardDuty" and showed an out-of-date screenshot. It now says which logs to switch on, traces one attack from the first log line to an incident, and states Onam's limits. Every AWS command below is from the AWS CLI reference, read on 27 November 2026.*

## Step 1: are the logs there at all?

No detection, ours or anyone's, sees an event that was never logged. On AWS, check four sources. All four commands are read-only.

\`\`\`
aws cloudtrail describe-trails --query "trailList[].[Name,IsMultiRegionTrail]" --output table
aws ec2 describe-flow-logs --query "FlowLogs[].[ResourceId,FlowLogStatus]" --output table
aws eks describe-cluster --name <cluster-name> --query "cluster.logging.clusterLogging"
aws guardduty list-publishing-destinations --detector-id <detector-id>
\`\`\`

What you want to see:

| Source | Good looks like | Why it matters |
| --- | --- | --- |
| CloudTrail | A multi-Region trail | Every API call by every identity, the raw material for detection |
| VPC flow logs | An entry, status \`ACTIVE\`, for each VPC you care about | Network evidence: who talked to what |
| EKS control-plane logs | \`audit\` and \`authenticator\` in a block with \`"enabled": true\` | Who did what inside the cluster, and which IAM identity they signed in as |
| GuardDuty export | A destination of type \`S3\` with status \`PUBLISHING\` | GuardDuty findings in a place other tools can read |

Get the detector ID from \`aws guardduty list-detectors\`. Sources: [describe-trails](https://docs.aws.amazon.com/cli/latest/reference/cloudtrail/describe-trails.html), [describe-flow-logs](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-flow-logs.html), [eks describe-cluster](https://docs.aws.amazon.com/cli/latest/reference/eks/describe-cluster.html), [list-publishing-destinations](https://docs.aws.amazon.com/cli/latest/reference/guardduty/list-publishing-destinations.html), [list-detectors](https://docs.aws.amazon.com/cli/latest/reference/guardduty/list-detectors.html).

## Step 2: one attack, from the first log line to an incident

A pattern that appears in published cloud intrusion write-ups, shown as the CloudTrail events it leaves:

:::flow One stolen key, seven days (illustrative)
Day 1: discovery | ListBuckets, GetAccountAuthorizationDetails from a developer key
Day 3: pivot | ListRolePolicies, then AssumeRole into the CI/CD role
Day 7: escalation | CreateRole and AttachRolePolicy with admin rights, by the CI/CD role
Incident | one actor, ordered steps, inside a time window
:::

**Day 1.** The attacker has a developer's access key, from phishing or a key committed to a public repository. They list resources and read IAM policies. Every call is legitimate. No threat-intelligence indicator fires, because the source address is new and clean.

**Day 3.** The developer's identity can call \`iam:ListRolePolicies\`. The attacker finds a CI/CD role that can deploy stacks and calls \`sts:AssumeRole\`, the same call the developer makes for manual deployments.

**Day 7.** Using the CI/CD role, the attacker creates a new role with administrator access. It looks like ordinary pipeline work.

No single event is malicious on its own. What gives it away is the order and the actor: discovery, then a role assumption, then an admin role created by the assumed identity. In ATT&CK terms that is Valid Accounts: Cloud Accounts (T1078.004), then Cloud Infrastructure Discovery (T1580), then account manipulation to keep the access.

## Step 3: detection that reads order and behaviour

Onam's CDR engine reads the cloud audit logs you already produce and judges them at three levels:

| Level | Approach | In the example above |
| --- | --- | --- |
| L1 | Rules over single events | Each call alone: low or no severity |
| L2 | Correlation scenarios: ordered steps by one actor within a time window | Discovery, then AssumeRole, then an admin role created: one scenario |
| L3 | Statistical baselines per identity and account | An admin role grant and a jump in the identity's session count, against its own recent history |

L3 judges a metric only once enough daily history exists, so a new identity is not flagged just for having no past. Each L3 finding carries the metric, today's value and the baseline it was compared with.

Events are also checked against open threat-intelligence lists (botnet command-and-control addresses, Spamhaus DROP, phishing domains, with Tor exit nodes as context). A hit raises the alert's severity or raises its own alert.

All of this lands in one **Threats** area with five views: Overview, Incidents, Detections, Coverage and Threat intelligence. **Coverage** shows, per account, which logs Onam reads and which you still need to switch on. Onam never turns logging on for you.

## What Onam reads, and what it does not do

:::ledger
yes: What Onam reads
no: What Onam does not do
+ Cloud audit logs such as CloudTrail, Azure Activity Log and Google Cloud Audit Logs
+ Entra ID sign-in and audit logs, Defender for Cloud alerts, RDS and Azure SQL database audit logs and EKS authenticator logs, where they are exported
+ GuardDuty findings, read from your S3 export
+ Network flow logs on AWS, Azure and Google Cloud
- Response is guidance only: Onam does not quarantine roles, revoke sessions or block IP addresses
- Reading GuardDuty findings straight from the GuardDuty API is not generally available; Onam reads the S3 export
- Flow logs are not read on OCI, Alibaba Cloud or IBM Cloud
- DNS query logs are not a general CDR source yet
- Load-balancer, WAF, CloudFront and S3 access logs are read as context; Onam does not alert on web traffic patterns
:::

If automated containment through EventBridge or Lambda is why you run GuardDuty, keep it: Onam will tell you what to do, not do it for you.

## What to expect in the first weeks

- **Week one: noise.** L1 rules start as soon as logs are read. The first findings are usually configuration patterns that look like threats: pipelines creating roles during provisioning, functions calling APIs across Regions.
- **Tuning.** Suppress legitimate patterns with a reason and an expiry date. Aim for an alert volume one person can review each day.
- **Once history exists.** L3 baselines start judging. Expect maintenance windows and irregular but legitimate identities first; each needs a decision.

:::faq Frequently asked questions
### Is GuardDuty enough for cloud threat detection?
It catches known-bad infrastructure and documented attack signatures well. It is weaker against attacks made of legitimate calls in an unusual order. Keep it, export its findings, and add detection that correlates events by actor and time.

### Which logs do I need for cloud threat detection on AWS?
At least a multi-Region CloudTrail trail, VPC flow logs for the VPCs that matter, EKS audit and authenticator logs for your clusters, and GuardDuty findings exported to S3.

### Does Onam block attackers automatically?
No. Response is guidance only. Onam does not quarantine roles, revoke sessions or block IP addresses.

### Does Onam switch on logging for me?
No. The Coverage view shows which logs Onam reads and which you need to switch on, per account. Onam never turns logging on for you.
:::
`,
  },
  {
    slug: "aws-misconfigurations-first-scan",
    title: "Which five AWS misconfigurations should we check first? Commands and fixes",
    category: "CSPM",
    tags: ["cspm","aws","misconfiguration"],
    excerpt: "Five read-only AWS CLI checks, each with its fix: public S3 bucket policies, IMDSv1, public RDS snapshots, open admin ports and CloudTrail gaps.",
    author: "anup-yadav",
    date: "July 10, 2026",
    updated: "November 27, 2026",
    readTime: "5 min",
    body: `
**Which AWS misconfigurations should we check before anything else?** Five, because each one turns a small mistake into a breach: S3 buckets that are public through a policy, EC2 instances that still accept IMDSv1, RDS snapshots shared with every AWS account, security groups open to the internet on admin ports, and CloudTrail that does not cover every Region. Each check below is a read-only AWS CLI command you can run in a few minutes, with its fix.

*Rewritten 27 November 2026. The earlier version listed the same five without commands or fixes. Every command below is from the AWS CLI reference, linked under each check and read on 27 November 2026. We make no claim about how often these appear; we have not published data on that.*

**Before you start.** The checks need only read permissions such as \`Describe\`, \`Get\` and \`List\` (the AWS managed \`SecurityAudit\` policy covers them). The fixes change things, so run them through your normal change process, and in Terraform if Terraform owns the resource. EC2, RDS and CloudTrail checks are per Region: add \`--region <region>\` and repeat.

## 1. Is any S3 bucket public through its policy?

Blocking public ACLs is not enough; a bucket policy can still grant \`s3:GetObject\` to everyone. Check the account-level Block Public Access first, then ask S3 whether a bucket's policy makes it public:

\`\`\`
aws s3control get-public-access-block --account-id <account-id>
aws s3api get-bucket-policy-status --bucket <bucket-name>
\`\`\`

All four account-level settings should be \`true\`. For the bucket, \`"IsPublic": true\` is the finding.

**Fix**, once you have confirmed no bucket is meant to be public: turn on all four Block Public Access settings for the account (console: S3, Block Public Access settings for this account), or in Terraform for each bucket. Sources: [s3control get-public-access-block](https://docs.aws.amazon.com/cli/latest/reference/s3control/get-public-access-block.html), [get-bucket-policy-status](https://docs.aws.amazon.com/cli/latest/reference/s3api/get-bucket-policy-status.html).

## 2. Can an EC2 instance still use IMDSv1?

With IMDSv1, a server-side request forgery (SSRF) bug in an application can fetch the instance role's temporary credentials. IMDSv2 requires a session token first.

\`\`\`
aws ec2 describe-instances --filters Name=metadata-options.http-tokens,Values=optional --query "Reservations[].Instances[].InstanceId" --output text
\`\`\`

Any instance ID printed still accepts IMDSv1.

**Fix**, after checking the instance makes no IMDSv1 calls (AWS's \`MetadataNoToken\` CloudWatch metric tracks them):

\`\`\`
aws ec2 modify-instance-metadata-options --instance-id <instance-id> --http-tokens required --http-endpoint enabled
\`\`\`

Sources: [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html), [Modify instance metadata options for existing instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-IMDS-existing-instances.html).

## 3. Is any RDS snapshot shared with every AWS account?

Teams share a manual snapshot to move data between environments and forget to undo it. AWS documents that if \`all\` is in the values of a snapshot's \`restore\` attribute, "the manual DB snapshot is public and can be copied or restored by all Amazon Web Services accounts".

\`\`\`
aws rds describe-db-snapshot-attributes --db-snapshot-identifier <snapshot-id>
\`\`\`

**Fix:**

\`\`\`
aws rds modify-db-snapshot-attribute --db-snapshot-identifier <snapshot-id> --attribute-name restore --values-to-remove all
\`\`\`

Accounts added to the attribute by ID keep their access, so review those too. Sources: [describe-db-snapshot-attributes](https://docs.aws.amazon.com/cli/latest/reference/rds/describe-db-snapshot-attributes.html), [modify-db-snapshot-attribute](https://docs.aws.amazon.com/cli/latest/reference/rds/modify-db-snapshot-attribute.html).

## 4. Is SSH, RDP or a database port open to the whole internet?

This command is adapted from an example in the AWS CLI reference. It lists security groups with a rule on port 22 and a rule open to \`0.0.0.0/0\`. AWS notes that a group matches when any combination of its rules matches the filters, so confirm each result by reading the group's rules:

\`\`\`
aws ec2 describe-security-groups --filters Name=ip-permission.from-port,Values=22 Name=ip-permission.to-port,Values=22 Name=ip-permission.cidr,Values='0.0.0.0/0' --query "SecurityGroups[*].[GroupId,GroupName]"
\`\`\`

Repeat with 3389 (RDP), 3306, 5432 and the other database ports you use. Repeat with \`Name=ip-permission.ipv6-cidr,Values='::/0'\` for IPv6. Port 443 on a load balancer may be intended; admin ports rarely are.

**Fix:**

\`\`\`
aws ec2 revoke-security-group-ingress --group-id <group-id> --protocol tcp --port 22 --cidr 0.0.0.0/0
\`\`\`

For admin access, AWS Systems Manager Session Manager needs no inbound port at all. Sources: [describe-security-groups](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-security-groups.html), [revoke-security-group-ingress](https://docs.aws.amazon.com/cli/latest/reference/ec2/revoke-security-group-ingress.html).

## 5. Would you have a record if someone did any of the above?

\`\`\`
aws cloudtrail describe-trails --query "trailList[].[Name,IsMultiRegionTrail,LogFileValidationEnabled,S3BucketName]" --output table
\`\`\`

You want at least one trail with \`IsMultiRegionTrail\` and \`LogFileValidationEnabled\` both \`True\`, writing to a bucket that passes check 1.

**Fix:** turn an existing trail into a multi-Region trail with log file validation:

\`\`\`
aws cloudtrail update-trail --name <trail-name> --is-multi-region-trail --enable-log-file-validation
\`\`\`

Run it from the trail's home Region. S3 object-level (data) events are not logged unless you add them, and they are billed separately, so add them first for the buckets that hold sensitive data. Sources: [describe-trails](https://docs.aws.amazon.com/cli/latest/reference/cloudtrail/describe-trails.html), [update-trail](https://docs.aws.amazon.com/cli/latest/reference/cloudtrail/update-trail.html).

## Which of the five comes first?

The one that connects to others. An instance that accepts IMDSv1, is reachable on port 22 from the internet and has a broad instance role is one path, not three findings. Fix the link that breaks the path cheapest, usually IMDSv2 or the open port. More in [attack paths vs. misconfigurations](/resources/blog/attack-path-4000-to-3).

## Do we need a tool for this at all?

For these five, not necessarily: the commands above work, and AWS Security Hub CSPM checks them as controls. Fixing all five without us is a good outcome. A tool earns its place when you have many accounts and Regions, more than one cloud, or want these findings joined to identity and data so you can see which ones chain.

## Where Onam fits

Onam's posture scanning connects through read-only cloud roles and checks these five, and the rest of its AWS rule definitions, on every scan, across accounts and Regions. A finding that sits on an attack path from an internet-facing resource to a data store or key is ranked above one that does not. The free plan covers this kind of API-based posture scanning.

:::faq Frequently asked questions
### How do I check if an S3 bucket is public with the AWS CLI?
Run \`aws s3api get-bucket-policy-status --bucket <name>\`. \`"IsPublic": true\` means the bucket policy makes it public. Also check the account-level setting with \`aws s3control get-public-access-block --account-id <id>\`.

### How do I find EC2 instances that still allow IMDSv1?
Run \`aws ec2 describe-instances --filters Name=metadata-options.http-tokens,Values=optional\` in each Region. Those instances accept IMDSv1; require IMDSv2 with \`modify-instance-metadata-options --http-tokens required\`.

### How do I tell if an RDS snapshot is public?
Run \`aws rds describe-db-snapshot-attributes --db-snapshot-identifier <id>\`. If the \`restore\` attribute's values include \`all\`, any AWS account can copy or restore it.

### Are these checks safe to run in production?
The check commands only read configuration. The fix commands change resources, so run them through your change process.
:::
`,
  },
  {
    slug: "ciem-vs-iam-security",
    title: "CIEM vs IAM: what is the difference, and which do I need?",
    category: "Identity",
    tags: ["identity","ciem","aws"],
    excerpt: "The difference between CIEM and traditional IAM in plain words: IAM grants access, CIEM checks what it adds up to and what is used. Table and FAQ.",
    author: "poonam-yadav",
    date: "July 3, 2026",
    updated: "November 27, 2026",
    readTime: "6 min",
    body: `
*Updated 27 November 2026: Onam's identity analysis now runs on more clouds; the Onam section reflects that.*

## CIEM vs IAM: the short answer

IAM is where cloud access is granted: users, roles, policies and sign-in. CIEM (cloud infrastructure entitlement management) sits on top of IAM and checks what those grants actually allow once every policy is combined, and how much of that access is ever used. You keep IAM. CIEM tells you what to remove from it.

## CIEM vs traditional IAM at a glance

| Aspect | Traditional IAM | CIEM |
| --- | --- | --- |
| Main job | Create identities and grant access | Find out what granted access adds up to, and trim it |
| Question it answers | Who is allowed to sign in, and with which role? | What can this identity really do, and what has it used? |
| Scope | Identities across the organisation, often beyond the cloud | Users, roles and service accounts inside cloud accounts, often across several clouds |
| Looks at | One policy or one identity at a time | Policies, trust relationships, boundaries and activity together |
| Typical output | An account, a role assignment, an access request approved | Unused permissions, shadow admins, cross-account paths, a smaller policy to apply |
| Who uses it | IT and identity teams | Cloud security and platform teams |
| Replaces the other? | No | No. Changes are applied back in IAM |

## What is the difference between CIEM and traditional IAM?

Vendors, us included, often use "IAM security" and "CIEM" as if they meant the same thing. In practice they answer different questions, and mature security programmes run both.

### IAM security checks whether an identity is configured safely

IAM security is about the **static shape** of your identity plane:

- Are there IAM users with console access and no MFA?
- Are access keys older than 90 days?
- Are there inline policies with \`Action: "*"\` and \`Resource: "*"\`?
- Are service accounts stored in plaintext anywhere in your repos?

It's a posture check against identity best practice. Every CSPM does some of this. Good ones do a lot of it.

### CIEM works out what an identity could do

CIEM starts where IAM security stops. It reconciles **who has which entitlements** and **what those entitlements evaluate to**, given every trust policy, permission boundary and SCP in the chain. Most importantly, it checks **what was used** over a recent activity window.

The output isn't "this user has AdministratorAccess." Every scanner will tell you that. The output looks more like this (illustrative examples):

- \`user@example.com\` has effective \`s3:PutObject\` on 412 buckets across 3 accounts, but has only ever written to 4 of them.
- \`ReadOnlyAudit\` in account \`123456789012\` (AWS's documentation placeholder) is assumable by 17 principals in 6 other accounts through a chain of two roles.
- The CI service account \`build-runner\` has never called most of the actions it was granted when it was created.

The third bullet is the urgent one. **Unused entitlements are usually where over-privilege hides.**

## Where the two overlap

- Detecting IAM users without MFA is IAM security.
- Detecting an IAM user without MFA whose permissions include \`iam:PassRole\` on an admin role is CIEM. IAM security tells you the user is unsafe. CIEM tells you what it will cost when the user is compromised.

## CIEM vs IAM: which do I need?

You need IAM in any case; every cloud account runs on its provider's IAM. The question is whether you also need CIEM. A simple way to decide:

- **One small account, a handful of people.** You can review policies by hand. IAM plus basic posture checks is often enough to start.
- **Many accounts, several clouds, or lots of machine identities.** Nobody can work out effective permissions by reading policies one at a time. This is where CIEM earns its place.
- **An access review or audit is coming.** CIEM gives reviewers usage evidence, so they are not approving access blind. See the [cloud access review checklist](/resources/blog/cloud-access-review-checklist).

The rule we use internally: if the finding can be answered by looking at one resource in isolation, it's IAM security. If it requires stitching together identity, trust and behaviour across accounts, it's CIEM.

IAM security keeps the door from being obviously open. CIEM makes sure that if it opens, the blast radius is bounded.

## How Onam handles it, and what it does not do

[Onam's CIEM engine](/platform/ciem) resolves effective permissions for users, roles and service accounts from the posture inventory. Where it applies:

:::dataflow ciem
:::

- **Shadow-admin detection** runs on AWS, Azure, Google Cloud and Kubernetes.
- **Unused-access analysis** (granted compared with used, over a 30-day window) runs on AWS and Google Cloud and needs cloud audit logs flowing into Onam; other clouds show granted access only.
- **Escalation paths** are followed on AWS (assume-role chains, up to 12 hops) and Google Cloud (service-account impersonation chains, up to 4 hops).
- **Access reviews** run on AWS with a usage-based risk score, and on Azure and Google Cloud from high or critical escalation findings, using granted access.

Onam is not an identity provider and does not run joiner, mover and leaver workflows or access requests. Those stay with your IAM and identity tools.

:::faq Frequently asked questions
### What is the difference between CIEM and IAM?

IAM is the cloud provider's own identity service: it is where roles, policies and permissions are defined and granted. CIEM sits on top of it and answers a question IAM does not: what can each identity do once role chaining, permission boundaries, SCPs and resource policies are all resolved, and how much of that has it ever used.

### What is the difference between CIEM and traditional IAM tooling?

Traditional IAM tooling manages the lifecycle of identities: joiners, movers, leavers, access requests. CIEM is about effective permissions in cloud accounts, across providers, and about which of those permissions put data within reach. The two are complementary, and neither one covers the other's job.

### Do I need CIEM if I have IAM?

If you run one small account, IAM and careful policy reviews may be enough for now. Once you have many accounts, more than one cloud, or many service accounts and roles, IAM alone will not tell you what each identity can really do or which permissions are unused. That is the gap CIEM fills.

### Is CIEM a replacement for IAM?

No. Every cloud account still runs on its provider's IAM. CIEM audits what IAM has granted, finds the entitlements nobody uses, and turns the gap between granted and used into least-privilege changes you can apply back in IAM.

### Is CIEM part of CSPM or CNAPP?

Often, yes. Many platforms include CIEM alongside posture management as part of a CNAPP. Basic identity posture checks, such as missing MFA, usually sit in CSPM; effective-permission and usage analysis is CIEM. More on [what CSPM is](/learn/cspm) and [what a CNAPP is](/learn/cnapp).
:::
`,
  },
  {
    slug: "attack-path-4000-to-3",
    title: "Which of our findings could actually get us breached? Attack paths vs. misconfigurations",
    category: "Attack Path",
    tags: ["attack-path","risk","aws","identity"],
    excerpt: "CSPM tools surface hundreds of misconfigurations. The ones behind breaches chain together; attack path analysis shows which chains are dangerous.",
    author: "anup-yadav",
    date: "June 24, 2026",
    updated: "November 27, 2026",
    readTime: "11 min",
    body: `
**Which of our hundreds of findings could actually get us breached?** The ones that chain. An attacker rarely needs one Critical finding; they need three or four ordinary ones in a row that lead from the internet to your data. Map the chains, then fix the one link that breaks the most of them. Below: a five-step AWS path, the read-only check that finds its weakest link, and how to pick the break point.

*Updated 27 November 2026: corrected the worked example (it now starts on an EC2 instance, which is what has an instance metadata service), added a copy-paste check, and brought the Onam section in line with current product facts.*

A busy cloud estate carries hundreds of open posture findings at any given time. Security teams triage by severity, work through the Critical queue, and ship patches. Three months later, the finding count is roughly the same. The board asks why the environment is still at risk.

Severity scores do not tell you which findings lead to breaches. They tell you how bad one misconfiguration is on its own. Attackers rarely exploit misconfigurations one at a time. They chain them.

> The finding that causes a breach is rarely the most severe finding on your list. It is the one that connects to five other findings in a path that reaches your most critical assets.

## What an attack path is

An attack path is a sequence of exploitation steps that an attacker could take to move from an initial foothold to a target resource. Each step in the path exploits a specific misconfiguration or vulnerability. No single step needs unusual skill. Each one follows from the one before.

A typical AWS attack path might look like this:

1. A web application on an internet-facing EC2 instance has an SSRF vulnerability. An attacker sends a crafted request that makes the server fetch a URL of the attacker's choosing.
2. The SSRF reaches the EC2 Instance Metadata Service, which still accepts IMDSv1 requests, and retrieves temporary credentials for the instance role.
3. The instance role has \`iam:PassRole\` permission on a deployment role used by the CI/CD pipeline, plus permission to create Lambda functions.
4. Using \`iam:PassRole\`, the attacker creates a new Lambda function and assigns the deployment role, giving them pipeline-level permissions.
5. The deployment role has \`s3:GetObject\` on the S3 bucket where customer PII exports are staged for the data warehouse ETL pipeline.

At step one, the attacker is an anonymous internet user. At step five, they are reading customer PII. None of the individual misconfigurations (IMDSv1 allowed, an overly permissive instance role, an unscoped PassRole) is rated Critical on its own. Together, they form a breach.

**Find the cheapest link yourself.** Step 2 is usually the one-line fix. List the instances that still accept IMDSv1, then require IMDSv2 on one after checking it makes no IMDSv1 calls (AWS's \`MetadataNoToken\` CloudWatch metric tracks them):

\`\`\`
aws ec2 describe-instances --filters Name=metadata-options.http-tokens,Values=optional --query "Reservations[].Instances[].InstanceId" --output text
aws ec2 modify-instance-metadata-options --instance-id <instance-id> --http-tokens required --http-endpoint enabled
\`\`\`

The first command is read-only; the second changes the instance. Sources: [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) (the \`metadata-options.http-tokens\` filter) and [Modify instance metadata options for existing instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-IMDS-existing-instances.html), both accessed 27 November 2026.

![The attack path view in the Onam console (demo account)](/screenshots/screenshot-attack-path.png)

## How chained findings combine into higher risk

Some findings, in combination, produce a risk far larger than the sum of their individual severity scores.

A concrete example: suppose you have an EC2 instance that is internet-facing (a High finding) running a web application with a known CVE in its web framework (a Medium finding). Neither finding is marked Critical. But the CVE provides remote code execution, and the internet-facing exposure means the instance can be reached directly. The combination is Critical: a direct RCE entry point with no network controls in between.

Add one more element: suppose the instance profile grants \`ec2:DescribeInstances\` and \`ssm:SendCommand\` across the entire account. Now the attacker who exploited the CVE can run commands on every EC2 instance in the account. Three Medium or High findings add up to an account-wide compromise.

## Crown jewel path analysis

Not all attack paths matter equally. A path that reaches a development environment with synthetic test data is not the same as a path that reaches your production payment processor or customer data lake. Crown jewel path analysis focuses on the resources you care most about and on every path that leads to them.

In Onam, these are the resources a path can end at: data stores such as S3, RDS and DynamoDB, encryption keys, admin roles and similar high-value targets. Data classification labels from data security posture raise the impact of paths that reach sensitive stores. Those labels come from names, tags and schema by default, and from sampled contents where you have deployed Onam's DSPM scanner.

The result is a list of paths ranked by likelihood and impact, so the path to the customer data lake outranks the path to a test bucket.

## How Onam implements attack path analysis

Onam's attack path engine is built on one security graph. Every cloud resource is a node: instances, roles, buckets, functions, security groups, networks and load balancers. Relationships between resources are typed edges derived from posture, identity, network, data and threat-detection evidence: an identity that can assume a role, a federation from another cloud, a security group rule that lets one workload reach another, a key that encrypts a store. Because the graph spans clouds, a path can start in one cloud and end in another. Each finding on a path carries a FAIR-style loss estimate, used for ranking: it is an estimate per finding, not a price for the whole route.

:::dataflow attack-path
:::

What it does not cover yet: AI services do not appear on attack paths.

![A privilege escalation chain modelled as a graph of identities and permissions](/diagrams/feat-ciem-privesc-chain.svg)

## Naming each step with MITRE ATT&CK

Naming each step with its MITRE ATT&CK technique gives engineers and auditors a shared, published vocabulary. In the path above, stealing credentials from the metadata service is T1552.005 (Unsecured Credentials: Cloud Instance Metadata API), using \`iam:PassRole\` to gain the deployment role's rights is commonly mapped to T1548.005 (Temporary Elevated Cloud Access), and reading the bucket is T1530 (Data from Cloud Storage). So you can tell an engineering team: "This is a five-step path from an internet-facing instance to customer data. Here is the one change that breaks it at step two."

## What to fix first on an attack path: break the chain or harden the target

When you have an identified attack path, you have two remediation strategies. You can harden the target so it is harder to reach, or you can break the chain by removing a link the attacker needs.

Breaking the chain is almost always the right answer. Hardening the target (encryption, access logging, strict IAM policies on the database itself) is valuable, but it does not eliminate the path. If the chain is intact, a sufficiently motivated attacker will find a way to the end.

Finding the optimal break point means identifying the link that:

- Has the lowest remediation cost. A one-line IAM policy change beats a network re-architecture.
- Blocks the most paths at once. A single overly permissive role may appear in a dozen paths.
- Has no compensating control already in place.

> The best break point is usually the resource that appears in the most paths: one fix, many paths closed.

## Making the case to engineering

The practical challenge in attack path remediation is organisational more than technical. A Medium severity finding does not motivate an engineering team to drop their sprint work. An attack path that demonstrates a five-step route from the internet to production customer data does.

That is what attack path visualisations are for. Show an engineer an interactive graph where each node is a resource they recognise and each edge is a permission they can check in the AWS console, and the priority is obvious. You are showing them the exact sequence an attacker would follow instead of asking them to trust a risk score.

So attack path analysis works as a communication tool as much as a CSPM feature. It turns cloud misconfiguration into plain statements: here is how you get breached, and here is what to change.

:::faq Frequently asked questions
### What is an attack path in cloud security?
A sequence of steps an attacker could take from a foothold, such as an internet-facing service, to a valuable target such as a data store, where each step uses one misconfiguration, vulnerability or permission.

### What is a toxic combination?
Findings that are moderate on their own but serious together, for example an internet-facing instance, a remote code execution CVE on it, and an instance role that can run commands across the account.

### Should we fix the target or break the chain?
Break the chain, at the link that is cheapest to change and blocks the most paths. Hardening the target is still worth doing, but it leaves the path in place.
:::
`,
  },
  {
    slug: "fair-model-cloud-risk",
    title: "The FAIR model for cloud findings: ranking risk in money, per finding",
    category: "Risk",
    tags: ["risk","fair","attack-path","prioritisation"],
    excerpt: "Two findings, both CVSS 9.1: which first? How FAIR ranks cloud findings by estimated loss, and why Onam's figures are per-finding estimates for ranking, not predictions.",
    author: "anup-yadav",
    date: "June 17, 2026",
    updated: "November 27, 2026",
    readTime: "9 min",
    body: `
**Two findings are both CVSS 9.1. Which one do we fix first?** The one that could lose the business more money: CVSS scores the vulnerability, not your environment. FAIR adds how often a loss is likely and how big it would be, so the same CVE on a test server and on a payment API stop looking equal. Below: the model, a worked pair, and how Onam computes a per-finding estimate.

*Updated 27 November 2026: retitled from "putting a dollar value on your attack surface". Onam's figures are loss estimates per finding, for ranking: not a price for a whole route and not a prediction.*

Every cloud security tool produces a list of findings ranked by CVSS score. Critical findings go to the top of the queue; engineers fix them in order. The approach feels right. Surely the highest-severity vulnerability is the most urgent.

The problem is that CVSS measures the exploitability and impact of a vulnerability in isolation. It does not know whether your environment has compensating controls. It does not know whether the vulnerable resource is a developer's test server or your payment processing API. It does not know whether you process ten thousand transactions per day or ten million. Two organisations with identical CVSS scores can face risks that differ by three orders of magnitude.

FAIR (Factor Analysis of Information Risk) fills this gap. The Open Group publishes it as the O-RT (Risk Taxonomy) and O-RA (Risk Analysis) standards. FAIR does not replace CVSS. It uses severity as one input in a model that expresses risk as a range of loss in money, which is the unit your board already uses for every other decision.

## CVSS example: a developer server and a payment processor

Consider two findings, both rated CVSS 9.1 (Critical):

- An unauthenticated RCE vulnerability in a web framework running on a developer's personal EC2 instance used for feature testing. The instance has no production data and can only be reached from the corporate VPN.
- The same vulnerability in the same web framework running on the API servers that process payment authorisations for your e-commerce platform, directly accessible from the internet.

CVSS says these are equivalent. Any security engineer knows they are not. FAIR makes that difference numerically explicit. An illustrative pair (made-up inputs, for the arithmetic only):

| | Developer test server | Payment API |
| --- | --- | --- |
| CVSS | 9.1 | 9.1 |
| Reachable from the internet | No (VPN only) | Yes |
| Records at risk | 0 | 2 million card authorisations |
| Regulations in play | None | PCI DSS |
| Loss range, illustrative | Low thousands | Millions |
| Fix first? | Later | **Now** |

## FAIR fundamentals: frequency times magnitude

FAIR models risk as the product of two variables. Loss Event Frequency is how often a loss event will occur. Loss Magnitude is how much it will cost when it does.

Loss Event Frequency has two components:

- **Threat Event Frequency:** how often will a threat actor try to exploit this?
- **Vulnerability:** when a threat actor tries, what is the probability of success?

Loss Magnitude breaks down into primary and secondary losses:

- **Primary losses:** incident response costs, forensics, data recovery, business downtime.
- **Secondary losses:** regulatory fines, legal liability, reputation damage, customer churn.

In a full FAIR analysis each variable is expressed as a range, and simulation produces a distribution of annualised loss exposure rather than a single point estimate. That makes uncertainty explicit rather than hiding it behind a precise-looking score.

## How Onam applies a FAIR-style estimate

The traditional objection to FAIR is that it needs too many manual inputs to scale. Onam computes a FAIR-style estimate for each finding from data the platform already has, and shows the inputs next to the result.

**Loss event frequency from EPSS and exposure.** FIRST's Exploit Prediction Scoring System (EPSS) gives the probability that a CVE will be exploited in the next 30 days. Onam multiplies it by an exposure factor: a publicly reachable resource counts fully, an internal one at a fraction. Findings that sit on an attack path have their exposure raised, and more so when they appear on several paths.

**Loss magnitude from records, sensitivity and asset value.** Primary loss starts from the number of records at risk and a per-record cost for your industry, then is scaled by the data's sensitivity (restricted, confidential, internal or public) and by the value of the asset. A high-value asset such as an encryption key, an admin role or a data warehouse weighs far more than an ordinary resource. You can replace the default record count, per-record cost and sensitivity weights with your own figures, so the estimate reflects your business rather than an industry average.

![Risk quantification in the Onam console (demo account)](/screenshots/screenshot-risk.png)

## Regulatory exposure

Secondary losses from regulation are often larger than the incident itself. When a finding's region and data class bring a regulation into play, such as GDPR, HIPAA, PCI DSS, CCPA or SOX, Onam does two things. It applies a regulatory weight to the loss magnitude, taking the single highest applicable weight rather than stacking them, so one finding is not double-counted. And it estimates a separate regulatory fine range from each regulation's published penalty structure, using the record count and annual revenue you configure. GDPR, for example, allows fines of up to €20 million or 4% of worldwide annual turnover, whichever is higher (Regulation (EU) 2016/679, Article 83(5)).

## From a finding list to a ranked queue

Each finding gets a minimum, likely and maximum loss estimate (an estimate for ranking, not a price for a whole attack route and not a prediction), a risk tier, the regulations that apply and the MITRE ATT&CK techniques involved, with the calculation inputs shown alongside. Instead of forty Critical findings and eighty High findings sorted by CVSS, you get a list ordered by estimated loss.

> This reordering often surprises security teams. The highest-loss finding is not always the highest-CVSS finding. It can be a Medium-severity misconfiguration, such as an RDS instance missing encryption at rest or a bucket open to another account, on a resource that holds sensitive data and never reached the top of a severity-sorted queue.

## Making the business case to engineering management

Security teams have historically struggled to translate findings into language that resonates with engineering managers and financial stakeholders. "We have a Critical finding" does not answer the question an engineering manager is asking: "What is the cost of not fixing this right now compared to shipping the feature we have committed to?"

FAIR makes this conversation tractable. "This finding puts an estimated range of loss on a customer data store, most of it regulatory. The fix is a small IAM policy change." That is a conversation an engineering manager can act on.

FAIR does not aim at a precise dollar figure, and the uncertainty ranges in the model make that plain. The aim is a defensible estimate grounded in data. With it, prioritisation stops being an argument about severity scores and becomes a business decision with the stakes written down.

:::faq Frequently asked questions
### What is the FAIR model?
Factor Analysis of Information Risk: a model that expresses risk as loss event frequency times loss magnitude, each as a range. The Open Group publishes it as the O-RT (Risk Taxonomy) and O-RA (Risk Analysis) standards. It complements the largely qualitative ISO/IEC 27005.

### Does FAIR replace CVSS?
No. CVSS describes a vulnerability in isolation. FAIR uses severity and exploit likelihood as inputs, then adds exposure, data and business impact to rank findings in money.

### Are Onam's loss figures predictions?
No. They are loss estimates per finding, used to rank the queue. They are not a price for a whole attack route and not a forecast of what an incident would cost.
:::
`,
  },
  {
    slug: "kubernetes-rbac-pitfalls",
    title: "How does a ServiceAccount end up as cluster-admin? Kubernetes RBAC pitfalls with kubectl checks",
    category: "Containers",
    tags: ["kubernetes","containers","identity","ciem","attack-path"],
    excerpt: "Six Kubernetes RBAC patterns that grant cluster-admin by accident, each with a read-only kubectl and jq command to find it in your own cluster.",
    author: "poonam-yadav",
    date: "June 10, 2026",
    updated: "November 27, 2026",
    readTime: "4 min",
    body: `
**How does a default ServiceAccount end up as cluster-admin?** Usually through an ordinary-looking grant: a ClusterRoleBinding where a RoleBinding was meant, a binding to a \`system:\` group, a wildcard, the right to create pods, or a verb such as \`bind\` that grants more verbs. Each of the six patterns below comes with a read-only \`kubectl\` check you can run today.

*Updated 27 November 2026: added copy-paste audit commands for each pattern and current Onam coverage.*

Kubernetes RBAC looks simple: roles list verbs on resources, bindings attach roles to subjects. The trouble is that several grants are equivalent to cluster-admin once you follow what they allow, and each is easy to miss in a review that reads roles one at a time. The commands below need \`kubectl\` with read access to RBAC objects and [jq](https://jqlang.org/manual/). RBAC object fields are from the Kubernetes [RBAC documentation](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) (accessed 27 November 2026).

## 1. A ClusterRoleBinding where a RoleBinding was meant

A ClusterRole can be bound in two ways. A RoleBinding grants its rules inside one namespace; a ClusterRoleBinding grants them in every namespace and on cluster-scoped resources. Teams often reuse a ClusterRole such as \`edit\` and bind it with a ClusterRoleBinding by habit, turning "can edit the payments namespace" into "can edit every namespace".

**Audit:** list every ClusterRoleBinding and ask, for each, whether the subject genuinely needs cluster-wide scope. Start with the ones that hand out \`cluster-admin\`:

\`\`\`
kubectl get clusterrolebindings -o json | jq -r '.items[] | select(.roleRef.name=="cluster-admin") | .metadata.name + " -> " + ([.subjects[]? | .kind + ":" + .name] | join(", "))'
\`\`\`

## 2. Bindings to broad groups

Subjects such as \`system:authenticated\` (every authenticated identity) or \`system:serviceaccounts\` (every service account) appear in bindings created for convenience during setup. Anything granted to them is granted to every workload and user in the cluster.

**Audit:** search bindings for group subjects that start with \`system:\` and justify each one. Built-in bindings (for example \`system:basic-user\` and \`system:discovery\`) will appear; anything else needs a reason:

\`\`\`
kubectl get rolebindings,clusterrolebindings -A -o json | jq -r '.items[] | select(any(.subjects[]?; .kind=="Group" and (.name | startswith("system:")))) | (.metadata.namespace // "cluster") + "/" + .metadata.name'
\`\`\`

## 3. Wildcards

\`verbs: ["*"]\` or \`resources: ["*"]\` in a custom role grants everything that exists today and everything a future CRD adds tomorrow. A wildcard on resources in the core API group includes secrets.

**Audit:** treat any wildcard outside the built-in \`cluster-admin\` role as a finding until proven necessary:

\`\`\`
kubectl get clusterroles,roles -A -o json | jq -r '.items[] | select(any(.rules[]?; ((.verbs // []) | index("*")) or ((.resources // []) | index("*")))) | (.metadata.namespace // "cluster") + "/" + .metadata.name'
\`\`\`

## 4. Pod creation rights that reach the node

A subject that can create pods in a namespace can run a pod that mounts the node's filesystem through a \`hostPath\` volume, runs privileged, or uses any service account in that namespace, and so inherits that service account's permissions. Unless Pod Security admission (or an equivalent policy) blocks privileged and host-path pods in that namespace, "create pods" is a path to the node and from there, often, to the cluster.

**Audit:** list who can create pods, deployments, jobs and other workload controllers, and confirm the namespace enforces the restricted or baseline Pod Security standard. Check one identity, then every namespace's enforcement label:

\`\`\`
kubectl auth can-i create pods -n payments --as=system:serviceaccount:payments:default
kubectl get namespaces -L pod-security.kubernetes.io/enforce
\`\`\`

An empty value in the \`ENFORCE\` column means no Pod Security level is enforced on that namespace. See [kubectl auth can-i](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_auth/kubectl_auth_can-i/) and [Pod Security admission](https://kubernetes.io/docs/concepts/security/pod-security-admission/) (accessed 27 November 2026).

## 5. Verbs that grant more verbs

Some permissions exist to manage permissions. \`escalate\` lets a subject create roles with rules it does not hold; \`bind\` lets it bind roles it does not hold; \`impersonate\` lets it act as another user, group or service account. \`create\` on \`serviceaccounts/token\` mints tokens for other identities, and read access to \`secrets\` exposes whatever credentials the namespace stores.

**Audit:** search every role for \`escalate\`, \`bind\`, \`impersonate\`, \`serviceaccounts/token\` and \`secrets\`, and treat each as admin-adjacent. The first three verbs:

\`\`\`
kubectl get clusterroles,roles -A -o json | jq -r '.items[] | select(any(.rules[]?; (.verbs // []) | any(. == "escalate" or . == "bind" or . == "impersonate"))) | (.metadata.namespace // "cluster") + "/" + .metadata.name'
\`\`\`

## 6. Aggregated roles that grow on their own

ClusterRoles with an \`aggregationRule\` collect the rules of every ClusterRole carrying a matching label. The built-in \`admin\`, \`edit\` and \`view\` roles work this way, so installing an operator whose ClusterRoles carry those labels quietly widens what everyone bound to \`edit\` can do.

**Audit:** after installing an operator or CRD, diff the effective rules of \`admin\`, \`edit\` and \`view\` against what they held before:

\`\`\`
kubectl get clusterrole edit -o jsonpath='{.rules}' > edit-before.json
# install the operator, then:
kubectl get clusterrole edit -o jsonpath='{.rules}' > edit-after.json
diff edit-before.json edit-after.json
\`\`\`

## A habit that catches most of this

Review RBAC as effective access per subject rather than as a list of roles. For each service account and group, ask what it can do across the whole cluster once every binding is counted:

\`\`\`
kubectl auth can-i --list --as=system:serviceaccount:<namespace>:<serviceaccount>
\`\`\`

The six patterns above are the usual reasons the answer is "more than anyone intended".

## Where Onam fits

[Onam's container security](/platform/container-security) checks Kubernetes clusters against posture rules, including RBAC and Pod Security settings, alongside the cloud accounts the clusters run in. It has 1,023 Kubernetes rule definitions, and not every definition is a working check yet. Its shadow-admin detection covers the Kubernetes patterns above that grant more than they look: \`bind\` and \`escalate\`, \`impersonate\`, and pod creation with a privileged service account. Kubernetes posture needs Onam's read access inside the cluster, so it is on the paid plans rather than the free plan.

:::faq Frequently asked questions
### How do I find who has cluster-admin in Kubernetes?
List the ClusterRoleBindings whose \`roleRef\` is \`cluster-admin\` and print their subjects with \`kubectl get clusterrolebindings -o json\` and a jq filter, then check groups starting with \`system:\` separately.

### What can a ServiceAccount do in my cluster?
Run \`kubectl auth can-i --list --as=system:serviceaccount:<namespace>:<name>\`. It lists the actions that identity is allowed, after every binding is counted.

### Why is pod creation dangerous in Kubernetes RBAC?
A subject that can create pods can run one that mounts the node's filesystem, runs privileged or uses any service account in the namespace, unless Pod Security admission blocks it.
:::
`,
  },
  {
    slug: "epss-over-cvss",
    title: "EPSS over CVSS: which CVEs do we patch first?",
    category: "Vulnerability",
    tags: ["vulnerability","prioritisation","risk"],
    excerpt: "CVSS tells you how bad a vulnerability could be. EPSS tells you how likely it is to be exploited in the next 30 days. Guess which one predicts breaches.",
    author: "anup-yadav",
    date: "June 3, 2026",
    updated: "November 27, 2026",
    readTime: "4 min",
    body: `
**We have more critical CVEs than we can patch. Which ones first?** Anything on CISA's Known Exploited Vulnerabilities (KEV) list, then high EPSS, then the rest by CVSS, with internet exposure breaking ties. CVSS says how bad a flaw could be; EPSS forecasts whether attackers will use it; KEV records that they already have. You can pull both signals yourself with two commands, below.

*Updated 27 November 2026: added the commands to fetch EPSS and KEV data, and removed one Onam scoring claim we could not source.*

## What CVSS measures, and what it does not

CVSS, maintained by FIRST, describes the technical severity of a vulnerability: how it is reached, what it takes to exploit, and what an attacker gains. It is a good description of how bad a vulnerability could be. It is not a measure of how likely exploitation is, and FIRST's own guidance says the base score alone is not a measure of risk.

## What EPSS adds

The Exploit Prediction Scoring System, also published by FIRST, estimates the probability that a CVE will be exploited in the wild in the next 30 days. It is a number between 0 and 1, updated daily, built from observed exploitation activity and the characteristics of each CVE. Two CVEs with the same CVSS score can have very different EPSS scores, and that difference is what you prioritise on.

## What KEV adds

The CISA Known Exploited Vulnerabilities catalogue lists CVEs with evidence of exploitation in the wild. EPSS is a forecast; KEV is a record. A CVE on KEV is not a prediction any more.

## How to use the three together

- **On KEV:** fix first, regardless of CVSS. Exploitation is already happening.
- **High EPSS:** next. The forecast says attackers are likely to use it soon.
- **High CVSS, low EPSS, not on KEV:** schedule it, but it should not displace the two groups above.
- **Context last, but always:** a CVE on an internet-facing workload with a path to sensitive data matters more than the same CVE on an isolated test box. Exploitability and exposure together decide the order.

## Check it yourself

FIRST publishes EPSS scores through a free API. For Log4Shell (CVE-2021-44228) it returned an EPSS of 0.99999, at the 100th percentile, for 26 November 2026:

\`\`\`
curl -s "https://api.first.org/data/v1/epss?cve=CVE-2021-44228"
\`\`\`

CISA publishes the KEV catalogue as a JSON feed. This prints the KEV entry for a CVE, or nothing if it is not listed. Log4Shell's entry shows it was added on 10 December 2021:

\`\`\`
curl -s https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json | jq '.vulnerabilities[] | select(.cveID=="CVE-2021-44228")'
\`\`\`

Run the EPSS call for every critical in your queue (it accepts a comma-separated list of CVEs) and sort by the score. Sources: the FIRST EPSS API at api.first.org/data/v1/epss and the [CISA KEV catalogue](https://www.cisa.gov/known-exploited-vulnerabilities-catalog), both accessed 27 November 2026.

## The caveat

EPSS is a probability across the whole internet, not a statement about your environment. A low score does not make a vulnerability safe to ignore when it sits on your most exposed system, and a high score on an unreachable internal host is less urgent than it looks. Use it to order work, not to close tickets.

## How Onam uses it

The FAIR-style loss estimate Onam puts on each finding uses EPSS as its starting point for how often a loss event is expected, then adds exposure and the data at risk. The estimate is for ranking the queue, not a prediction. See [the FAIR model for cloud findings](/resources/blog/fair-model-cloud-risk) and [vulnerability management](/platform/vulnerability). Vulnerability scanning needs Onam's in-account scanner, so it is on the paid plans rather than the free plan.

:::faq Frequently asked questions
### What is the difference between EPSS and CVSS?
CVSS, maintained by FIRST, scores how severe a vulnerability is. EPSS, also from FIRST, estimates the probability it will be exploited in the next 30 days. Severity and likelihood are different questions.

### Should KEV vulnerabilities be patched first?
Yes. A CVE in CISA's Known Exploited Vulnerabilities catalogue has evidence of exploitation in the wild, so it outranks any forecast.

### Is a low EPSS score safe to ignore?
No. EPSS is a probability across the whole internet. A low-EPSS CVE on your most exposed system can still come first.
:::
`,
  },
  {
    slug: "why-cloud-iam-permissions-are-never-used",
    title: "Why cloud IAM permissions go unused — and why that matters",
    category: "Identity",
    tags: ["identity","ciem","aws"],
    excerpt: "Your IAM policies are accumulating unused permissions faster than your team can audit them. Here's what the data shows and how to close the gap.",
    author: "poonam-yadav",
    date: "May 28, 2026",
    updated: "November 27, 2026",
    readTime: "8 min",
    body: `
**Why do so many cloud IAM permissions never get used, and does it matter?** They are granted to make something work and almost never removed when the need ends. It matters because an attacker who takes over an identity inherits every permission it holds, used or not. The fix is to measure granted against used, and remove the gap carefully, starting with identities that can reach admin.

*Updated 27 November 2026: Onam's unused-access analysis now covers Google Cloud as well as AWS; one unsourced historical example was removed.*

We are not going to put a percentage on how many permissions go unused, because a figure without a published sample behind it is marketing. What is consistent is the mechanism. Permissions are granted to make something work and almost never removed when the thing stops needing them. That is less a failure of individual teams than a consequence of how cloud IAM works in practice.

![Illustrative IAM Security view, stylised, with demo data](/screenshots/screenshot-iam.png)

## How permissions accumulate

Cloud IAM permissions grow in three ways, none of them malicious.

**Copy-paste onboarding.** When a new service account or role is needed quickly, engineers copy an existing role and modify it. The source role has permissions that were useful once, for a temporary migration, a debugging session or a feature that was later removed. Those permissions carry forward into every derivative role.

**Managed policy breadth.** AWS managed policies like \`AmazonS3FullAccess\` and \`AmazonEC2FullAccess\` cover entire service surfaces. A Lambda function that only reads from one S3 bucket gets full S3 permissions because attaching a managed policy is three clicks and writing a custom policy is forty minutes. The easy route is also the one that breaks least privilege.

**Permission creep without cleanup.** Role permissions accumulate as features get added. Nobody removes permissions when features are deprecated. A role that started with five specific permissions in 2022 has thirty by 2026, and the engineers who added the original five have moved to other teams.

## Why unused permissions matter

An unused permission is a door that does not need to exist. From an attacker's perspective, the difference between a compromised Lambda execution role that can only read from one S3 bucket and one that has full S3 access is the difference between a minor incident and a data breach.

Consider the MITRE ATT&CK technique T1078.004 (Valid Cloud Accounts). When an attacker compromises a service account, whether through a misconfigured endpoint, a credential leaked in source code or a supply chain attack, they inherit exactly the permissions that account holds. If that account has permissions it never uses, the attacker has capabilities the account's legitimate owners never intended to grant.

Every permission that exists but is not needed is a pivot point that should not exist.

## How CIEM measures the gap

CIEM (Cloud Infrastructure Entitlement Management) addresses this by computing the least-privilege gap: the difference between what an identity is permitted to do and what it does. Here is how Onam does it today.

**1. Effective permission resolution.** Attached policies alone do not tell you what a principal can do. Group membership adds permissions. Explicit denies elsewhere remove them. Conditions decide whether a grant applies at all, and Service Control Policies (SCPs) at the organisation level can block what an identity policy allows. Onam copies group policies onto members, classifies every condition by whether an attacker could satisfy it, nets out explicit denies and checks SCP deny statements. Permission boundaries and resource-based policies add further layers that Onam does not yet fold into the result. [The docs](/docs/ciem/effective-permissions) list exactly what is and is not modelled.

![How Onam resolves effective permissions on AWS: statements, groups, conditions, denies and SCPs](/diagrams/ciem-effective-access.svg)

**2. Usage analysis from activity logs.** CloudTrail records the API calls made in your AWS account. Onam reads the CloudTrail events its threat detection collects and builds a map of which actions each identity called. A granted action that has not appeared in the activity window is counted as unused, and the high-risk ones are listed separately. These include \`iam:PassRole\`, \`iam:CreatePolicyVersion\`, \`s3:PutBucketPolicy\` and \`kms:ScheduleKeyDeletion\`. The activity window is 30 days. Unused-access analysis runs on AWS and Google Cloud and needs cloud audit logs flowing into Onam; other clouds show granted access only.

You can see a first version of this gap on AWS without any tool: IAM's service last accessed data lists the services a role is allowed to use and when it last tried. Two read-only calls:

\`\`\`
aws iam generate-service-last-accessed-details --arn arn:aws:iam::<account-id>:role/<role-name>
aws iam get-service-last-accessed-details --job-id <job-id-from-the-first-command>
\`\`\`

AWS notes the data counts all access attempts, including denied ones, and considers identity-based permissions policies only ([generate-service-last-accessed-details](https://docs.aws.amazon.com/cli/latest/reference/iam/generate-service-last-accessed-details.html), accessed 27 November 2026).

**3. A concrete change to review.** The unused list, especially the high-risk unused actions, tells engineers exactly what to remove, and the used list is the starting point for a replacement policy. That is a change someone can review, rather than a vague "reduce permissions" ticket.

## Where the gap is usually widest

Some identity types accumulate unused permissions faster than others:

- **Service accounts and workload roles** (Lambda, ECS, EC2 instance profiles). Created for one feature, forgotten when the team moves on, and rarely reviewed because no human logs in as them.
- **Cross-account roles.** Set up for a partner, a migration or a tool, then left in place long after the reason has gone.
- **Human users.** Permissions follow people through team changes; few are removed when they move.
- **Federated identities.** Broad SSO roles are convenient and hard to scope per person.

## What to do about it

Do not aim for zero unused permissions straight away. That would mean rewriting every IAM policy in your account at once, which is not workable and will break things. Instead:

**Start with the highest-risk identities.** Shadow admins come first. These are identities that can reach admin-level access without holding an admin role. A service account that can assume a role that can assume another role with \`iam:*\` permissions is a three-hop privilege escalation path. CIEM surfaces these chains; fix them first.

**Enforce for new identities.** The easiest permission to remediate is one that was never granted. Add a review gate to your IAM policy creation process that requires justification for any permission a similar role has not needed. This does not fix existing debt, but it stops new debt from accumulating.

**Automate the analysis and keep removal manual.** Let tooling compute the gap continuously, but do not remove permissions automatically. Have a person check each change for operational correctness first. What looks unused over a few weeks may be used on a quarterly or annual cycle.

> The cost of a false-positive access removal is a production incident. Measure automatically, remove carefully.

You will not fix over-provisioning in a sprint. It is a long-running hygiene practice, and good tooling lets you see and measure the progress.

:::faq Frequently asked questions
### What is an unused cloud permission?
A permission an identity is granted but has not called during a recent activity window, measured from cloud audit logs such as CloudTrail.

### Should unused permissions be removed automatically?
No. Measure automatically and remove carefully. Something unused for a few weeks may run quarterly or annually, and a wrong removal is a production incident.

### Which clouds does Onam measure unused access on?
AWS and Google Cloud, over a 30-day window, with cloud audit logs flowing into Onam. Other clouds show granted access only.
:::
`,
  },
  {
    slug: "mitre-attack-cloud-mapping",
    title: "Which MITRE ATT&CK techniques are open in our AWS account today?",
    category: "Threat Detection",
    tags: ["threat-detection","mitre","aws"],
    excerpt: "Four ATT&CK cloud techniques, the misconfiguration each one needs, and a read-only AWS CLI command that tells you whether it is open in your account.",
    author: "poonam-yadav",
    date: "May 20, 2026",
    updated: "November 27, 2026",
    readTime: "4 min",
    body: `
**Which MITRE ATT&CK techniques are open in our AWS account today?** Look at preconditions, not at the matrix. Most cloud techniques need a misconfiguration to work: a credential that can be stolen from instance metadata, a trail that does not cover every Region, a bucket a policy makes public, a role nobody has trimmed. Check those preconditions and you know which techniques an attacker with basic access could use against you this week. Below: four techniques, the precondition each needs, and a read-only AWS CLI command that tells you whether it is met.

*Rewritten 27 November 2026. The earlier version described ATT&CK in general and claimed every Onam posture rule carries ATT&CK tags, which our product facts do not yet support, so that claim is gone. AWS commands are from the AWS CLI reference, read on 27 November 2026. Technique names are from MITRE ATT&CK at attack.mitre.org.*

## Four techniques, four checks

| Technique | Precondition that makes it easy | Read-only check | Open if |
| --- | --- | --- | --- |
| T1552.005 Unsecured Credentials: Cloud Instance Metadata API | EC2 instances still accept IMDSv1, so an SSRF bug can fetch role credentials | \`aws ec2 describe-instances --filters Name=metadata-options.http-tokens,Values=optional --query "Reservations[].Instances[].InstanceId" --output text\` | Any instance ID is printed |
| T1562.008 Impair Defenses: Disable or Modify Cloud Logs | No multi-Region trail, or no log file validation | \`aws cloudtrail describe-trails --query "trailList[].[Name,IsMultiRegionTrail,LogFileValidationEnabled]" --output table\` | No trail shows \`True\` for both |
| T1530 Data from Cloud Storage | A bucket policy makes a bucket public | \`aws s3api get-bucket-policy-status --bucket <bucket-name>\` | \`"IsPublic": true\` |
| T1078.004 Valid Accounts: Cloud Accounts | Identities hold far more than they use, so a stolen key buys a lot | \`aws iam generate-service-last-accessed-details --arn <role-arn>\`, then \`aws iam get-service-last-accessed-details --job-id <job-id>\` | Services granted but never used |

Sources: [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html), [describe-trails](https://docs.aws.amazon.com/cli/latest/reference/cloudtrail/describe-trails.html), [get-bucket-policy-status](https://docs.aws.amazon.com/cli/latest/reference/s3api/get-bucket-policy-status.html), [generate-service-last-accessed-details](https://docs.aws.amazon.com/cli/latest/reference/iam/generate-service-last-accessed-details.html). EC2 and CloudTrail checks are per Region; add \`--region\` and repeat.

## Why preconditions, not the matrix

The ATT&CK cloud matrices (IaaS, SaaS, Office Suite and Identity Provider) list what attackers do, organised by tactic: initial access, privilege escalation, defense evasion, collection and so on. Read as a list, it is overwhelming. Read as "what does each technique need from my environment?", it becomes a short to-do list, because a handful of settings are the precondition for many techniques at once.

Two more mappings worth knowing for privilege escalation:

- **T1548.005 Temporary Elevated Cloud Access.** MITRE notes that in AWS, users with the \`PassRole\` permission can let a service they create assume a given role. Preconditions: identities with \`iam:PassRole\` on roles more privileged than themselves, and trust policies any principal in the account can satisfy.
- **Cross-account trust without an external ID**, which lets a third party's compromise become yours.

## Which to close first

Close the preconditions that need the least prior access:

1. **Credential theft and valid accounts** (T1552.005, T1078.004): an outsider can use these from the internet.
2. **Log tampering** (T1562.008): close it before an incident, because afterwards the evidence is gone.
3. **Privilege escalation** (T1548.005): these need a foothold, but turn a small one into admin.
4. **Collection** (T1530): the last step, often blocked by fixing the first three.

A finding that is a precondition for an early technique, on a resource reachable from the internet, outranks a higher-severity finding that needs an attacker who is already admin.

## Where Onam fits

Onam's posture scanning checks these preconditions, with the rest of its AWS rule definitions, on every scan across accounts and Regions, through read-only cloud roles. Findings that chain from an internet-facing resource to data or keys sit on attack paths and are ranked above ones that do not. On the threat-detection side, Onam's CDR correlates the events these techniques leave in CloudTrail; see [what GuardDuty would miss](/resources/blog/cdr-behavioral-threat-detection).

:::faq Frequently asked questions
### What is MITRE ATT&CK for cloud?
The part of MITRE's ATT&CK knowledge base that covers cloud platforms, organised as tactics (the attacker's goal) and techniques (how they reach it), built from publicly reported adversary behaviour.

### How do I map ATT&CK techniques to my cloud configuration?
For each technique, ask what it needs from your environment, such as IMDSv1 for T1552.005 or a public bucket policy for T1530, and check that precondition directly with a read-only command.

### Which ATT&CK techniques should a cloud team close first?
Those an outsider can use without prior access: stealing credentials from instance metadata and using valid cloud accounts. Then log tampering, privilege escalation and collection.
:::
`,
  },
  {
    slug: "agentless-cloud-security-architecture",
    title: "How we check thousands of rules without agents: the architecture behind Onam",
    category: "Engineering",
    tags: ["architecture","cspm","agentless","aws"],
    excerpt: "Agentless cloud security architecture: how Onam scans 7 clouds with read-only posture roles and agentless workload scanning that runs in your account.",
    author: "anup-yadav",
    date: "May 6, 2026",
    updated: "November 27, 2026",
    readTime: "10 min",
    body: `
**How can a security tool check thousands of rules across dozens of cloud services without an agent on our workloads?** By reading configuration from each cloud's control-plane APIs through a read-only role. Posture scanning needs nothing more. Finding vulnerable packages inside a VM is different: Onam's agentless workload scanning reads volume snapshots inside your account, so it deploys scanning resources there. This post shows both, with the exact API calls, and where agentless stops.

*Updated 27 November 2026: the data-classification section now describes DSPM content scanning (opt-in since 26 November), and the free plan's scope is stated. "Agentless" means different things in different products, so we are specific below. The clouds are AWS, Azure, Google Cloud, OCI, Alibaba Cloud, IBM Cloud and Kubernetes.*

## How agentless scanning reads cloud control plane APIs

Everything in a cloud environment has a configuration state. The cloud provider's control plane stores and serves it. That is the management layer that sits above your workloads. AWS, Azure, GCP, and the other clouds expose this configuration state through read-only APIs.

An S3 bucket's public access settings, encryption configuration, and lifecycle policy are all returned by \`GetBucketAcl\`, \`GetBucketEncryption\`, and \`GetBucketLifecycleConfiguration\`. A security group's inbound rules are returned by \`DescribeSecurityGroups\`. An IAM user's MFA status is returned by \`GetLoginProfile\` and \`ListMFADevices\`.

Nearly every security configuration that matters can be read from these control plane APIs. That is the foundation of agentless CSPM: Onam's posture scanning connects with a read-only IAM role, service principal or service account, with no agent on your workloads.

![Onam's agentless architecture: read-only API access to each cloud control plane](/diagrams/arch-overview.svg)

## How the discovery phase works

Before we can check rules, we need to know what resources exist. The discovery phase enumerates every resource across all configured cloud accounts.

For AWS, this means calling the List/Describe APIs for each service category in each region across every account: \`DescribeInstances\` for EC2, \`ListBuckets\` for S3, \`DescribeDBInstances\` for RDS, \`ListFunctions\` for Lambda, and so on across dozens of service categories. For an account with a couple of thousand resources across five regions, this generates a few hundred API calls.

Discovery output is normalised into a unified resource schema. This is a standard representation that captures the resource type, region, account, ARN, and all configuration attributes relevant to security evaluation. This normalised schema is what the rule evaluation engine operates against.

![The scan pipeline: discovery, normalisation, rule evaluation, and correlation](/diagrams/arch-scan-pipeline.svg)

## How rule evaluation works

Each rule in Onam's library is a declarative check against one or more attributes in the normalised resource schema. One cloud-agnostic engine evaluates every rule against every matching resource, and each check returns PASS, FAIL or ERROR.

A rule like "S3 buckets must have server-side encryption enabled" evaluates the \`encryption.rules[0].apply_server_side_encryption_by_default.sse_algorithm\` attribute in the normalised S3 bucket schema. If the attribute is present and set to AES256 or aws:kms, the rule passes. If it is absent or set to NONE, it fails.

Rules are written in YAML, a readable format that non-engineers can review. Each rule specifies:

- The resource type it applies to.
- The condition expression that determines PASS or FAIL.
- The severity (Critical, High, Medium, Low), the rationale and references, and compliance framework mappings.
- Written remediation guidance.

This YAML-first approach means adding a new rule for a new cloud service does not require changes to the core evaluation engine. It needs only a new YAML file with the right schema.

## Network exposure needs cross-resource correlation

Simple single-resource checks (is this bucket encrypted, is MFA enabled for this user) can be evaluated from the resource's own configuration alone. Effective network exposure is different. Working out whether a resource can be reached from the internet means correlating several resources.

Determining whether an EC2 instance is internet-accessible requires knowing: is it in a public subnet? Does its subnet's route table have a route to an internet gateway? Do the NACLs on that subnet allow inbound traffic on the relevant port? Does the security group allow inbound traffic from 0.0.0.0/0? Is there a load balancer in front of it?

This is why network security analysis runs as a separate phase after discovery, with access to the full normalised resource graph. The graph allows us to traverse VPC, subnet, route table, and internet gateway relationships and compute effective exposure instead of checking each resource configuration on its own.

## Where agentless has limits

Agentless works for everything that lives in the cloud control plane. It does not work for everything, and it is worth being precise about the boundaries.

**OS-level vulnerability scanning** requires enumerating installed packages and kernel versions. Cloud APIs do not expose that information. Onam's agentless workload scanning handles this by reading snapshots of instance volumes inside your own account, which means it deploys scanning resources there with the permissions they need.

**Runtime workload behaviour** needs a sensor on the host: which processes are running, which network connections are open, which system calls a container makes. Onam does not offer runtime enforcement. Rule evaluation covers the configuration surface and cloud audit logs cover control-plane activity. Live runtime behaviour is a different layer.

**Data contents** are not read through the control plane. By default, Onam's data classification uses metadata signals: naming patterns, tags, schema metadata and resource configuration, which will not detect sensitive data in an unexpectedly named bucket.

*Update, 26 November 2026: Onam's DSPM can now also read data contents, but only where you adopt it: if you deploy Onam's DSPM scanner in your own cloud account or the on-premises collector, it reads samples of files and rows and classifies what they contain. Content scanning is opt-in per tenant; without that scanner, classification works from metadata and Onam does not read data contents.*

## Why agentless matters for security teams

The operational argument for agentless is usually framed around deployment complexity: no agents to install, no software versions to manage, no compatibility issues with operating systems. That is true, but there is a stronger argument.

Agents expand your attack surface. An agent running on every instance in your fleet is a piece of software with elevated privileges that needs to be patched, monitored and secured, and if it has a vulnerability, every host it runs on is exposed.

Agentless does not mean footprint-free, and it is worth being exact. Posture scanning connects through read-only cloud roles; agentless workload scanning runs inside your account. The workload scanner's resources live in your account, with the permissions the onboarding template grants, and you can read every one of them before you run it. The free plan uses the read-only API part only: it deploys no agent or scanner, which is why vulnerability scanning, Kubernetes posture and data-content classification are on the paid plans.

For organisations in regulated sectors such as healthcare, financial services and government, that precision matters. The question is what a tool adds to your system boundary, and the answer should be a list you can review.

:::faq Frequently asked questions
### What does agentless cloud security mean?
Reading configuration and activity from the cloud provider's APIs instead of installing software on each workload. Posture checks need only a read-only role; scanning inside VMs for vulnerable packages needs snapshot-based scanning in your account or an agent.

### Does Onam install anything in my cloud account?
Posture scanning connects through read-only cloud roles. Agentless workload scanning deploys scanning resources inside your account, with permissions you can review in the onboarding template before running it. The free plan deploys no agent or scanner.

### Can agentless scanning see runtime behaviour?
No. Processes, network connections and system calls need a sensor on the host. Onam covers configuration, audit-log activity and snapshot-based workload scanning, and does not offer runtime enforcement.
:::
`,
  },
];

export const BLOG_POSTS: BlogPost[] = POSTS.map((p) => ({
  ...p,
  body: p.body ? `${p.body}\n${freePlanCta(p.slug)}` : p.body,
}));

export const BLOG_CATEGORIES = Array.from(new Set(BLOG_POSTS.map((p) => p.category)));

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

/** Related posts by topic: same category first, then shared tags, then newest. Never the post itself. */
export function relatedPosts(post: BlogPost, n = 3): BlogPost[] {
  const tags = new Set(post.tags ?? []);
  const score = (p: BlogPost) =>
    (p.category === post.category ? 3 : 0) + (p.tags ?? []).filter((t) => tags.has(t)).length * 2;
  return BLOG_POSTS.filter((p) => p.slug !== post.slug)
    .map((p) => ({ p, s: score(p), t: new Date(p.updated ?? p.date).getTime() }))
    .sort((a, b) => b.s - a.s || b.t - a.t)
    .slice(0, n)
    .map((x) => x.p);
}
