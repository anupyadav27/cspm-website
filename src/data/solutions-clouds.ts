import { Network, KeyRound, Eye, Layers, GitBranch, ShieldCheck, Globe2, Server, Cpu, Boxes } from "lucide-react";
import type { CloudSolutionData, CloudRelated } from "@/components/site/CloudSolutionTemplate";
import { CLOUDS, FRAMEWORKS } from "@/lib/product-facts";

/**
 * Internal links every cloud page carries, plus per-cloud extras below.
 *
 * These are a deliberate SEO fix, not decoration. The 2026-08-06 GSC export
 * showed the cloud pages as the site's strongest non-brand positions
 * (OCI 23.7, IBM 28.9, Alibaba 29.6) while `/platform/attack-path` pulled 35%
 * of all impressions at position 82. The concept pages, the platform pages and
 * the cloud pages were competing for the same intent with almost no links
 * between them, splitting the signal three ways instead of concentrating it.
 */
const CLOUD_RELATED_BASE: CloudRelated[] = [
  {
    label: "What is CSPM?",
    href: "/learn/cspm",
    blurb: "Cloud security posture management explained — what it catches, and what it cannot.",
  },
  {
    label: "What is a cloud attack path?",
    href: "/learn/cloud-attack-path",
    blurb: "Why a list of findings is not a priority, and how chains reach crown jewels.",
  },
  {
    label: "Attack Path Analysis",
    href: "/platform/attack-path",
    blurb: "Attack paths and choke points computed across your whole estate.",
  },
  {
    label: "CIEM — identity risk",
    href: "/platform/ciem",
    blurb: "Effective permissions after role chains, SCPs and permission boundaries.",
  },
  {
    label: "Compliance — 78 frameworks",
    href: "/platform/compliance",
    blurb: "CIS, NIST, ISO 27001, PCI-DSS and more, scored continuously.",
  },
  {
    label: "Agentless scanning",
    href: "/platform/agentless",
    blurb: "Snapshot-based workload scanning that runs inside your own account.",
  },
];

export const awsData: CloudSolutionData = {
  breadcrumb: "Solutions · Amazon Web Services",
  cloudName: "AWS",
  related: [
    { label: "CWPP — workload protection", href: "/platform/cwpp", blurb: "EC2, EKS, ECS and Lambda workloads, scanned without agents." },
    ...CLOUD_RELATED_BASE,
  ],
  headline: "Stop AWS Misconfigurations Before Attackers Find Them First",
  sub: "AWS's breadth — 200+ services across global regions — creates a sprawling attack surface that traditional tools cannot keep pace with. Onam continuously monitors every IAM policy, S3 bucket, security group, and Lambda configuration across all your AWS accounts with 800+ purpose-built rules.",
  docsHref: "/docs/onboarding/aws",
  stats: [
    { value: "2,018", label: "posture rules on AWS" },
    { value: "123", label: "AWS services in the catalog" },
    { value: "Read-only", label: "posture scanning role" },
    { value: String(FRAMEWORKS), label: "compliance frameworks" },
  ],
  services: [
    "IAM Users, Roles & Policies",
    "S3 Buckets & Object ACLs",
    "EC2 & Security Groups",
    "RDS & Aurora",
    "Lambda",
    "CloudTrail & CloudWatch",
    "KMS & Encryption",
    "EKS Clusters",
    "VPC Flow Logs & NACLs",
    "Elastic Load Balancers",
    "SNS / SQS",
    "Secrets Manager & Parameter Store",
    "GuardDuty & Security Hub",
    "Route 53 & CloudFront",
  ],
  servicesPlusNote:
    "CloudFormation, CodeBuild, CodePipeline, SageMaker, Bedrock, Elastic Beanstalk, Inspector, Macie, and more.",
  frameworks: [
    "CIS AWS Foundations Benchmark",
    "NIST 800-53",
    "PCI DSS",
    "SOC 2",
    "FedRAMP Moderate",
  ],
  setupSteps: [
    {
      title: "Create a read-only IAM role",
      body: "Use our CloudFormation template — one click, read-only, no destructive permissions. The role trusts Onam's AWS account with an external ID unique to your tenant.",
    },
    {
      title: "Paste the Role ARN into Onam",
      body: "Multi-account organizations connect in a single step via AWS Organizations: deploy a StackSet from the management account and every member account is onboarded automatically.",
    },
    {
      title: "Findings from the first scan",
      body: "Onam assumes the role via STS and scans all in-scope regions. Findings arrive prioritized, mapped to CIS/NIST/PCI, and ready to route to your ticketing system.",
    },
  ],
  featuresHeading: "What makes Onam different on AWS",
  features: [
    {
      icon: Layers,
      iconColor: "#F2AF04",
      title: "Organizations-aware multi-account scanning",
      body: "Onboard the AWS Organization once and every member account — current and future — is scanned automatically. SCPs, delegated admins, and OU structure are respected as first-class data.",
    },
    {
      icon: KeyRound,
      iconColor: "#2563EB",
      title: "IAM effective-permission graph",
      body: "Onam resolves Service Control Policies, permission boundaries, identity policies, and resource policies into a single effective-access graph. See what a principal can actually do — not just what a policy says.",
    },
    {
      icon: Globe2,
      iconColor: "#05A052",
      title: "S3 public-exposure chain analysis",
      body: "Every bucket is evaluated end-to-end: bucket policy, ACL, Block Public Access settings, and CloudFront origin. If any hop makes it reachable from the internet, Onam flags the full chain — not just the bucket.",
    },
  ],
  faqs: [
    {
      q: "What AWS permissions does Onam require?",
      a: "For posture scanning, read-only: the AWS-managed SecurityAudit and ReadOnlyAccess policies attached to a role that trusts Onam's AWS account with a per-tenant external ID. ReadOnlyAccess is broad enough to read stored objects; Onam requests it so data security posture management can locate sensitive data, and posture scanning reads configuration and metadata, not object or database contents. If you enable agentless workload scanning, the template also creates a scan workflow in your account, and Onam's role can start it.",
    },
    {
      q: "Can I scan every account in my AWS Organization in one step?",
      a: "Yes. Onboard the management account and Onam deploys the read-only role to every existing and future member account via a StackSet. New accounts added to the Organization are onboarded automatically.",
    },
    {
      q: "How long does the first scan take?",
      a: "It depends on how many accounts, regions and resources you connect. Findings appear as soon as the first scan completes, and every resource is re-checked on every scan after that.",
    },
    {
      q: "Do I need to install agents or change my network?",
      a: "No agents and no network changes. Posture scanning is AWS API calls from Onam's control plane using STS AssumeRole — no VPC peering, no PrivateLink, no security-group changes. Agentless workload scanning, if you enable it, runs inside your account through resources the onboarding template creates.",
    },
    {
      q: "Which frameworks do you map AWS findings to?",
      a: "Among the 78 frameworks Onam maps: CIS AWS Foundations Benchmark (several versions) and the CIS AWS service benchmarks, NIST 800-53, PCI DSS, SOC 2, and FedRAMP Moderate and High. Custom rules can carry their own framework mappings for internal standards.",
    },
  ],
};

export const azureData: CloudSolutionData = {
  breadcrumb: "Solutions · Microsoft Azure",
  cloudName: "Azure",
  related: [
    { label: "SaaS Security (SSPM)", href: "/platform/saas-security", blurb: "Microsoft 365, SharePoint and Entra posture on the same graph." },
    ...CLOUD_RELATED_BASE,
  ],
  headline: "Full Azure Security Visibility Across Every Subscription and Tenant",
  metaDescription:
    "Azure security posture management across management groups, subscriptions and resource groups, from Entra ID conditional access to NSG rules.",
  sub: "Azure's nested hierarchy of management groups, subscriptions, and resource groups makes consistent security posture nearly impossible to maintain manually. Onam maps your entire Azure estate — from Entra ID conditional access policies to NSG rules on every VM NIC — and flags drift the moment it occurs.",
  docsHref: "/docs/onboarding/azure",
  stats: [
    { value: "1,926", label: "posture rules on Azure" },
    { value: "95", label: "Azure services in the catalog" },
    { value: "Multi-tenant", label: "Entra ID support" },
    { value: String(FRAMEWORKS), label: "compliance frameworks" },
  ],
  services: [
    "Entra ID (Azure AD)",
    "Management Groups & Subscriptions",
    "Virtual Machines & NSGs",
    "Storage Accounts & Blob",
    "Azure SQL & Cosmos DB",
    "Key Vault",
    "AKS Clusters",
    "App Service & Functions",
    "Azure Monitor & Log Analytics",
    "Network Security Groups",
    "Load Balancers & Front Door",
    "Defender for Cloud",
  ],
  servicesPlusNote:
    "Azure Firewall, API Management, Container Registry, Data Factory, Synapse, Service Bus, Event Hubs, and more.",
  frameworks: [
    "CIS Microsoft Azure Foundations Benchmark",
    "ISO 27001:2022",
    "NIST 800-53",
    "GDPR",
    "SOC 2",
  ],
  setupSteps: [
    {
      title: "Register an Azure app for Onam",
      body: "Create a single-tenant app registration and assign it the built-in Reader and Security Reader roles at the management-group scope. No custom roles, no elevated permissions.",
    },
    {
      title: "Grant tenant-wide read consent",
      body: "One admin consent covers every subscription under the management group. Onam traverses the hierarchy automatically and inherits access to any new subscription without re-onboarding.",
    },
    {
      title: "Findings from the first scan",
      body: "Onam authenticates via workload identity federation — no client secrets to rotate — and scans every subscription, region, and Entra ID tenant in scope.",
    },
  ],
  featuresHeading: "What makes Onam different on Azure",
  features: [
    {
      icon: Layers,
      iconColor: "#F2AF04",
      title: "Management-group hierarchy traversal",
      body: "Onboard at the root management group and Onam scans every descendant subscription — inherited policies, Azure Policy assignments, and lock hierarchies included. No missed subscriptions.",
    },
    {
      icon: KeyRound,
      iconColor: "#2563EB",
      title: "Entra ID conditional access analysis",
      body: "Onam parses every conditional access policy, named location, and identity-protection rule. It surfaces gaps — MFA-exempted accounts, legacy-auth allowances, and privileged roles without CA coverage.",
    },
    {
      icon: Network,
      iconColor: "#05A052",
      title: "NIC-level network exposure mapping",
      body: "NSG effective-rules resolution across subnet and NIC scopes, application security groups, and Azure Firewall policy — evaluated together so you see the actual path an attacker can take.",
    },
  ],
  faqs: [
    {
      q: "How does Onam authenticate to Azure?",
      a: "Via workload identity federation — no long-lived client secrets. Onam's service principal is granted Reader and Security Reader at the management-group scope, and every API call is signed with a short-lived federated token.",
    },
    {
      q: "Does Onam support multiple Entra ID tenants?",
      a: "Yes. Enterprise customers commonly run multiple tenants for M&A, sovereignty, or partner isolation. Each tenant is onboarded independently and correlated in a single Onam workspace.",
    },
    {
      q: "Which management-group scope should I onboard?",
      a: "The Tenant Root Group for full coverage. If you have a dedicated 'Security' management group, that also works — Onam scans every subscription beneath the scope you grant.",
    },
    {
      q: "How are Azure Policy exemptions handled?",
      a: "Onam ingests Policy assignments and exemptions and surfaces them as first-class evidence in compliance reports. Exempted resources are visible, attributed, and time-bounded.",
    },
    {
      q: "Which frameworks do you map Azure findings to?",
      a: "Among the 78 frameworks Onam maps: CIS Microsoft Azure Foundations Benchmark and the CIS Azure service benchmarks, ISO 27001:2022, NIST 800-53, GDPR and SOC 2. Custom rules can carry their own framework mappings.",
    },
  ],
};

export const gcpData: CloudSolutionData = {
  breadcrumb: "Solutions · Google Cloud Platform",
  cloudName: "Google Cloud",
  related: [
    { label: "Data Security (DSPM)", href: "/platform/data-security", blurb: "BigQuery and GCS classification, exposure and access paths." },
    ...CLOUD_RELATED_BASE,
  ],
  headline: "Secure GCP Projects at Scale Without Slowing Down Engineering",
  metaDescription:
    "GCP security posture management: Onam audits every project, from IAM bindings and BigQuery permissions to GKE configs and VPC firewall rules.",
  sub: "GCP gives engineering teams enormous flexibility and security teams enormous blind spots. Onam continuously audits every project from IAM bindings and BigQuery permissions to GKE configs and VPC firewall rules.",
  docsHref: "/docs/onboarding/gcp",
  stats: [
    { value: "1,322", label: "posture rules on GCP" },
    { value: "71", label: "GCP services in the catalog" },
    { value: "Org-wide", label: "folder & project traversal" },
    { value: String(FRAMEWORKS), label: "compliance frameworks" },
  ],
  services: [
    "IAM & Service Accounts",
    "Organization, Folders & Projects",
    "Compute Engine & Firewall",
    "Cloud Storage Buckets",
    "BigQuery Datasets & Tables",
    "GKE Clusters",
    "Cloud SQL & Spanner",
    "Cloud KMS",
    "VPC & Cloud NAT",
    "Cloud Run & Cloud Functions",
    "Secret Manager",
    "Security Command Center",
  ],
  servicesPlusNote:
    "Pub/Sub, Cloud Build, Artifact Registry, Dataflow, Vertex AI, Cloud DNS, Load Balancing, and more.",
  frameworks: ["CIS GCP Foundation Benchmark", "NIST 800-53", "ISO 27001:2022", "SOC 2"],
  setupSteps: [
    {
      title: "Create an Onam service account",
      body: "Provision a service account at the organization level with the Security Reviewer and Viewer roles. Terraform module included.",
    },
    {
      title: "Grant org-level read access",
      body: "One binding at the organization node inherits down through every folder and project. New projects — created by any engineer, at any time — are covered automatically.",
    },
    {
      title: "Findings from the first scan",
      body: "Onam authenticates via workload identity federation, walks the resource hierarchy, and returns findings mapped to CIS GCP and the other frameworks you track.",
    },
  ],
  featuresHeading: "What makes Onam different on GCP",
  features: [
    {
      icon: GitBranch,
      iconColor: "#F2AF04",
      title: "Org → folder → project traversal",
      body: "Onboard once at the org node. Onam discovers every folder and project, respects Organization Policy constraints, and never misses a shadow project created by a busy team.",
    },
    {
      icon: KeyRound,
      iconColor: "#2563EB",
      title: "IAM binding + BigQuery permission graph",
      body: "Standard and conditional IAM bindings are correlated with BigQuery dataset ACLs and column-level policy tags. See which principals are granted read access to your regulated data.",
    },
    {
      icon: Boxes,
      iconColor: "#05A052",
      title: "GKE cluster & VPC firewall depth",
      body: "Autopilot and standard clusters are audited against CIS GKE — control plane, workload identity, PodSecurity, and network policies — alongside the VPC firewall rules that actually reach them.",
    },
  ],
  faqs: [
    {
      q: "What GCP permissions does Onam require?",
      a: "Read-only. The predefined Security Reviewer and Viewer roles at the organization scope. No write, no data-plane access, no BigQuery query execution against your tables.",
    },
    {
      q: "How does Onam discover new projects?",
      a: "Onam re-walks the resource hierarchy on every scan. Projects created after onboarding are picked up automatically at the next scan.",
    },
    {
      q: "Do you support multiple GCP organizations?",
      a: "Yes. Each organization is onboarded separately and unified in a single Onam workspace with shared policies and dashboards.",
    },
    {
      q: "How does Onam handle IAM Conditions?",
      a: "Conditional bindings — time-based, request-attribute-based, resource-attribute-based — are parsed and reflected in the effective-access graph, so you never mistake a scoped grant for a global one.",
    },
    {
      q: "Which frameworks do you map GCP findings to?",
      a: "Among the 78 frameworks Onam maps: CIS GCP Foundation Benchmark, CIS GKE, NIST 800-53, ISO 27001:2022 and SOC 2. Custom rules can carry their own framework mappings.",
    },
  ],
};

export const ociData: CloudSolutionData = {
  breadcrumb: "Solutions · Oracle Cloud Infrastructure",
  cloudName: "OCI",
  related: [
    { label: "Database Security", href: "/platform/database-security", blurb: "Autonomous DB and DB Systems posture, plus CIS Oracle Database benchmarks." },
    ...CLOUD_RELATED_BASE,
  ],
  headline: "Enterprise-Grade OCI Security Monitoring That Matches Oracle's Complexity",
  sub: "OCI's compartment model and policy language offer granular control, but auditing nested compartments and cross-tenancy access manually is operationally prohibitive. Onam traverses every compartment, audits IAM policies against least-privilege baselines, and monitors database, network, and storage continuously.",
  docsHref: "/docs/onboarding/oci",
  stats: [
    { value: "2,059", label: "posture rules on OCI" },
    { value: "61", label: "OCI services in the catalog" },
    { value: "Nested", label: "compartment traversal" },
    { value: String(FRAMEWORKS), label: "compliance frameworks" },
  ],
  services: [
    "IAM Users, Groups & Policies",
    "Compartments & Tenancies",
    "Compute Instances & VCNs",
    "Object Storage Buckets",
    "Autonomous Database",
    "MySQL & Database Cloud Service",
    "OKE Kubernetes Clusters",
    "Vault & KMS",
    "Load Balancers",
    "Security Zones",
    "Cloud Guard",
    "Logging & Audit",
  ],
  servicesPlusNote:
    "Functions, API Gateway, Streaming, Data Safe, Bastion, Web Application Firewall, and more.",
  frameworks: ["CIS Oracle Cloud Infrastructure Benchmark", "ISO 27001:2022", "SOC 2", "NIST 800-53"],
  setupSteps: [
    {
      title: "Create a read-only OCI user & group",
      body: "Provision an Onam user in the root tenancy, add it to a dedicated group, and attach a policy that grants inspect and read on all-resources across the tenancy.",
    },
    {
      title: "Generate an API signing key",
      body: "Upload the public key to the Onam user. The private key is stored in AWS Secrets Manager, encrypted with AWS KMS.",
    },
    {
      title: "Findings from the first scan",
      body: "Onam walks every compartment recursively — including nested and dynamic groups — and returns findings mapped to CIS OCI.",
    },
  ],
  featuresHeading: "What makes Onam different on OCI",
  features: [
    {
      icon: Layers,
      iconColor: "#F2AF04",
      title: "Full compartment-tree traversal",
      body: "Onam parses every parent, child, and cross-tenancy policy statement in Oracle's policy language and evaluates them against the compartment tree — including matching conditions and where clauses.",
    },
    {
      icon: KeyRound,
      iconColor: "#2563EB",
      title: "Autonomous Database posture",
      body: "Data Safe risk levels, private-endpoint enforcement, wallet rotation, and access-control list drift — audited continuously alongside your Autonomous DB workloads.",
    },
    {
      icon: Network,
      iconColor: "#05A052",
      title: "VCN + Security List analysis",
      body: "VCN topology, security lists, network security groups, and route tables are combined into one exposure graph so overly-permissive rules are surfaced with the resources they actually reach.",
    },
  ],
  faqs: [
    {
      q: "What OCI permissions does Onam require?",
      a: "A read-only policy: `allow group Onam-Readers to inspect all-resources in tenancy` plus `read` on specific families needed for deep configuration analysis. No manage, no use.",
    },
    {
      q: "Can Onam audit multiple OCI tenancies?",
      a: "Yes. Each tenancy is onboarded with its own signing key and unified in a single Onam workspace. Cross-tenancy policies are surfaced explicitly.",
    },
    {
      q: "How are Security Zones handled?",
      a: "Security Zone policies are ingested and their violations correlated with Onam's own findings — so you see one prioritized list, not two overlapping ones.",
    },
    {
      q: "Does Onam support OCI Government regions?",
      a: "Yes. OCI Government Cloud and dedicated regions are supported with the same read-only onboarding model.",
    },
    {
      q: "Which frameworks do you map OCI findings to?",
      a: "Among the 78 frameworks Onam maps: CIS Oracle Cloud Infrastructure Benchmark, CIS OKE, ISO 27001:2022, SOC 2 and NIST 800-53.",
    },
  ],
};

export const alicloudData: CloudSolutionData = {
  breadcrumb: "Solutions · Alibaba Cloud",
  cloudName: "Alibaba Cloud",
  related: [
    { label: "Container Security", href: "/platform/container-security", blurb: "ACK cluster hardening against CIS Alibaba Cloud ACK." },
    ...CLOUD_RELATED_BASE,
  ],
  headline: "Unified Security Posture for Your Alibaba Cloud Workloads, Region by Region",
  sub: "Alibaba Cloud often runs alongside AWS and Azure, in China and international regions alike. Onam brings the same rule-driven posture coverage to it — RAM policies, OSS buckets, RDS instances and VPC configurations — evaluated by the same engine as your other clouds.",
  docsHref: "/docs/onboarding/alicloud",
  stats: [
    { value: "1,151", label: "posture rules on Alibaba Cloud" },
    { value: "68", label: "Alibaba Cloud services in the catalog" },
    { value: "China + intl", label: "regions scanned" },
    { value: String(FRAMEWORKS), label: "compliance frameworks" },
  ],
  services: [
    "RAM Users, Roles & Policies",
    "OSS Buckets & ACLs",
    "ECS Instances & Security Groups",
    "RDS (MySQL / PostgreSQL / SQL Server)",
    "VPC & VSwitch",
    "ACK Kubernetes Clusters",
    "KMS & Encryption",
    "ActionTrail Audit",
    "Server Load Balancer",
    "PolarDB",
    "Function Compute",
    "Log Service (SLS)",
  ],
  servicesPlusNote:
    "MaxCompute, DataWorks, MSE, API Gateway, Container Registry, Anti-DDoS, and more.",
  frameworks: [
    "CIS Alibaba Cloud Benchmark",
    "CIS Alibaba Cloud ACK",
    "ISO 27001:2022",
    "SOC 2",
  ],
  setupSteps: [
    {
      title: "Create a read-only RAM user for Onam",
      body: "Create a dedicated RAM user with Alibaba's AliyunReadOnlyAccess system policy plus a custom policy of Describe, Get and List calls, and an AccessKey pair for it. The user cannot create or change identities or policies.",
    },
    {
      title: "Enter the AccessKey in Onam",
      body: "Paste the AccessKey ID and secret into the onboarding wizard. Onam validates them, stores them encrypted, and uses them only for read calls.",
    },
    {
      title: "Findings from the first scan",
      body: "Onam scans China and international regions — Hangzhou, Shanghai, Beijing, Shenzhen, Hong Kong, Singapore, Sydney, Kuala Lumpur, Tokyo, Frankfurt and the US — and returns prioritized findings mapped to your frameworks.",
    },
  ],
  featuresHeading: "What makes Onam different on Alibaba Cloud",
  features: [
    {
      icon: Globe2,
      iconColor: "#F2AF04",
      title: "China and international regions, one engine",
      body: "China regions are scanned with the same rules as international ones, through the same read-only RAM user. Posture scanning reads configuration through Alibaba Cloud APIs; it does not read the data in your stores.",
    },
    {
      icon: KeyRound,
      iconColor: "#2563EB",
      title: "RAM identity findings",
      body: "RAM users, roles, groups, policies and access keys are inventoried, with findings for wildcard or admin policies, RAM roles with wildcard trust or assumable without MFA, broad OSS and KMS grants, access-key rotation and console MFA.",
    },
    {
      icon: Network,
      iconColor: "#05A052",
      title: "OSS and VPC exposure",
      body: "OSS bucket ACLs and policies, security groups and VPC settings are checked by posture rules, and the findings join the same graph that attack-path analysis walks.",
    },
  ],
  faqs: [
    {
      q: "What RAM permissions does Onam require?",
      a: "Read-only. A dedicated RAM user holding Alibaba's AliyunReadOnlyAccess system policy plus a custom policy whose every action is a Describe, Get, List or Lookup call. It cannot manage users, groups or policies.",
    },
    {
      q: "Do you support Alibaba Cloud Resource Directory?",
      a: "Yes. Connect the master account first, then create a RAM role in each member account that trusts the master account, as described in the Alibaba Cloud onboarding docs.",
    },
    {
      q: "Are China regions handled differently?",
      a: "No. China regions are scanned with the same rules and the same read-only RAM user as international regions. Onam itself is hosted in a region you choose — US, Europe, India or others — to meet your compliance requirements.",
    },
    {
      q: "Do you require agents?",
      a: "No agents for posture scanning. It uses signed Alibaba Cloud API calls through the read-only RAM user.",
    },
    {
      q: "Which frameworks do you map AliCloud findings to?",
      a: "Among the 78 frameworks Onam maps: CIS Alibaba Cloud and CIS ACK, ISO 27001:2022 and SOC 2.",
    },
  ],
};

export const ibmData: CloudSolutionData = {
  breadcrumb: "Solutions · IBM Cloud",
  cloudName: "IBM Cloud",
  related: [
    { label: "Database Security", href: "/platform/database-security", blurb: "Db2 and Cloudant posture, plus CIS IBM Db2 benchmark coverage." },
    ...CLOUD_RELATED_BASE,
  ],
  headline: "Continuous Security Posture for IBM Cloud Enterprise Workloads",
  sub: "IBM Cloud powers regulated enterprise workloads that demand rigorous, continuous security validation. Onam audits IAM access groups, Cloud Object Storage, VPC infrastructure, and Kubernetes clusters against enterprise security baselines — agentless and read-only.",
  docsHref: "/docs/onboarding/ibm",
  stats: [
    { value: "553", label: "posture rules on IBM Cloud" },
    { value: "63", label: "IBM Cloud services in the catalog" },
    { value: "Multi-region", label: "including EU sovereign" },
    { value: String(FRAMEWORKS), label: "compliance frameworks" },
  ],
  services: [
    "IAM Users, Access Groups & Trusted Profiles",
    "Resource Groups & Accounts",
    "Cloud Object Storage (COS)",
    "VPC Infrastructure & Security Groups",
    "IBM Cloud Kubernetes Service (IKS)",
    "Red Hat OpenShift on IBM Cloud",
    "Key Protect & Hyper Protect Crypto",
    "Databases for PostgreSQL / MongoDB",
    "Cloud Internet Services",
    "Activity Tracker Events",
    "Secrets Manager",
    "Cloud Functions",
  ],
  servicesPlusNote:
    "Event Streams, Code Engine, Container Registry, App ID, Certificate Manager, and more.",
  frameworks: [
    "CIS IBM Cloud Benchmark",
    "NIST 800-53",
    "ISO 27001:2022",
    "SOC 2",
    "GDPR",
  ],
  setupSteps: [
    {
      title: "Create a trusted profile for Onam",
      body: "Provision a trusted profile scoped to the enterprise or account, with Viewer and Reader access on all services. No API keys to manage — federated identity signs every call.",
    },
    {
      title: "Grant enterprise-wide read access",
      body: "One binding at the enterprise level covers every account group and child account. New accounts added by any team are onboarded automatically.",
    },
    {
      title: "Findings from the first scan",
      body: "Onam scans every region — classic and VPC — and returns findings mapped to CIS IBM Cloud and the other frameworks you track.",
    },
  ],
  featuresHeading: "What makes Onam different on IBM Cloud",
  features: [
    {
      icon: Layers,
      iconColor: "#F2AF04",
      title: "Enterprise & account-group traversal",
      body: "Onboard once at the enterprise root. Onam discovers every account group, account, and resource group — respecting IAM inheritance and enterprise-managed policies.",
    },
    {
      icon: KeyRound,
      iconColor: "#2563EB",
      title: "Access-group & policy graph",
      body: "IAM policies, access-group memberships, and trusted-profile claim rules are combined into one effective-access graph — so federated principals are audited end to end.",
    },
    {
      icon: ShieldCheck,
      iconColor: "#05A052",
      title: "Compliance for regulated workloads",
      body: "Findings on IBM Cloud are mapped to CIS IBM Cloud, NIST 800-53, ISO 27001:2022, SOC 2 and GDPR, with evidence per control and PDF or CSV export.",
    },
  ],
  faqs: [
    {
      q: "What IBM Cloud permissions does Onam require?",
      a: "Read-only. Viewer access at the account and enterprise scope plus Reader on services that expose configuration data. No write, no data-plane access.",
    },
    {
      q: "Do you support IBM Cloud enterprises with multiple accounts?",
      a: "Yes. Onboard at the enterprise level and Onam scans every account group and child account continuously — including accounts added after onboarding.",
    },
    {
      q: "Can Onam audit Red Hat OpenShift on IBM Cloud?",
      a: "Yes. ROKS clusters are audited alongside IKS with CIS Kubernetes and OpenShift-specific rules — RBAC, SCCs, image policies, and network policies.",
    },
    {
      q: "Do you cover EU sovereign regions?",
      a: "Yes. IBM Cloud for Financial Services and EU-sovereign regions are supported, with data-residency controls for Onam's own findings storage.",
    },
    {
      q: "Which frameworks do you map IBM Cloud findings to?",
      a: "Among the 78 frameworks Onam maps: CIS IBM Cloud, NIST 800-53, ISO 27001:2022, SOC 2 and GDPR.",
    },
  ],
};

export const kubernetesData: CloudSolutionData = {
  breadcrumb: "Solutions · Kubernetes",
  cloudName: "Kubernetes",
  related: [
    { label: "CWPP — workload protection", href: "/platform/cwpp", blurb: "Cluster workloads across every distribution, agentlessly." },
    ...CLOUD_RELATED_BASE,
  ],
  headline: "Production Kubernetes Security That Goes Beyond CIS Benchmarks",
  metaDescription:
    "Kubernetes security posture: find privileged pods, exposed dashboards and RBAC bindings that grant cluster-admin, with no sidecar or daemonset.",
  sub: "Kubernetes misconfigurations — privileged pods, exposed dashboards, RBAC bindings that grant cluster-admin — are a leading cause of container-based breaches. Onam audits every cluster object without deploying a sidecar or daemonset.",
  docsHref: "/docs/onboarding/kubernetes",
  stats: [
    { value: "824", label: "posture rules on Kubernetes" },
    { value: "EKS / AKS / GKE", label: "+ self-managed" },
    { value: "Agentless", label: "no sidecar, no daemonset" },
    { value: "CIS", label: "Kubernetes benchmarks mapped" },
  ],
  services: [
    "Deployments, StatefulSets & DaemonSets",
    "Pods & PodSecurity Standards",
    "RBAC — Roles & ClusterRoles",
    "ServiceAccounts & Bindings",
    "NetworkPolicies",
    "Ingress & Services",
    "Secrets & ConfigMaps",
    "Admission Controllers",
    "Container Images & Registries",
    "Nodes & Kubelet Config",
    "CRDs & Custom Resources",
    "etcd & Control-Plane Settings",
  ],
  servicesPlusNote:
    "GKE Autopilot, EKS Fargate, OpenShift, Rancher-managed clusters, and self-hosted kubeadm clusters.",
  frameworks: [
    "CIS Kubernetes Benchmark",
    "CIS EKS / AKS / GKE Benchmarks",
    "CIS OpenShift",
    "PCI DSS",
    "SOC 2",
  ],
  setupSteps: [
    {
      title: "Grant read-only cluster access",
      body: "Apply the Onam ClusterRole manifest — one kubectl apply. It grants get, list, and watch on every resource, and nothing else. No exec, no port-forward, no impersonation.",
    },
    {
      title: "Bind to Onam's service account",
      body: "Federated OIDC binding to Onam's service account — no long-lived kubeconfig files exchanged. For self-managed clusters, the token is stored in AWS Secrets Manager, encrypted with AWS KMS.",
    },
    {
      title: "Findings from the first scan",
      body: "Onam watches the API server for drift and audits workloads against CIS Kubernetes and image-supply-chain rules — no runtime agent required.",
    },
  ],
  featuresHeading: "What makes Onam different on Kubernetes",
  features: [
    {
      icon: Cpu,
      iconColor: "#F2AF04",
      title: "Beyond CIS — real attack paths",
      body: "Privileged pods on nodes that reach the metadata service, service accounts with cluster-admin bindings, and NetworkPolicy gaps are correlated into concrete attack paths — not disconnected findings.",
    },
    {
      icon: KeyRound,
      iconColor: "#2563EB",
      title: "RBAC effective-permission graph",
      body: "Every RoleBinding, ClusterRoleBinding, and ServiceAccount is resolved into what a pod can actually do — including cross-namespace escalation via aggregation rules and impersonation verbs.",
    },
    {
      icon: Boxes,
      iconColor: "#05A052",
      title: "Image supply-chain analysis",
      body: "Container images are traced back to their registries and their base layers. Unscanned images, missing signatures, and vulnerable OS packages are surfaced with the workloads that run them.",
    },
  ],
  faqs: [
    {
      q: "Do I need to install an agent or daemonset in my cluster?",
      a: "No agents. Onam talks to the Kubernetes API server as a read-only ServiceAccount — no sidecar, no daemonset, no eBPF probes.",
    },
    {
      q: "Which Kubernetes distributions do you support?",
      a: "EKS, AKS, GKE (including Autopilot), Red Hat OpenShift, Rancher-managed clusters, and self-hosted kubeadm clusters — same rules, same depth.",
    },
    {
      q: "How does Onam get access to a private cluster?",
      a: "For managed clusters, Onam uses cloud-provider IAM federation. For private self-managed clusters, a lightweight read-only broker runs inside your VPC and forwards API-server calls only.",
    },
    {
      q: "Do you scan container images?",
      a: "Yes. Onam correlates every running pod to its image digest and pulls image metadata from your registries to surface unsigned images, unpatched base layers, and vulnerable packages.",
    },
    {
      q: "Which frameworks do you map Kubernetes findings to?",
      a: "Among the 78 frameworks Onam maps: CIS Kubernetes Benchmark, CIS EKS / AKS / GKE / OKE, CIS OpenShift, PCI DSS and SOC 2.",
    },
  ],
};
