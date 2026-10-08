import { Landmark, FileCheck2, ShieldAlert, Lock, FileSearch, ScrollText, Radar, Boxes, ClipboardList, GitPullRequest, CalendarCheck } from "lucide-react";
import type { IndustrySolutionData } from "@/components/site/IndustrySolutionTemplate";
import { CLOUDS, CSPM_POSTURE_RULES, FRAMEWORKS, fmt } from "@/lib/product-facts";

export const financialData: IndustrySolutionData = {
  breadcrumb: "Solutions · Financial Services",
  industryName: "Financial Services",
  headline: "Prove cloud compliance to your auditors before they ask",
  metaDescription:
    "Cloud security for financial services: banks, fintechs, insurers and asset managers get a continuous, auditable evidence trail across every cloud account.",
  sub: "Financial services firms face the strictest cloud security mandates on earth — and the shortest tolerance for breaches. Onam gives banks, fintechs, insurers, and asset managers a continuous, auditable evidence trail across every cloud account, so your next regulatory exam is a demonstration, not a scramble.",
  stats: [
    { value: String(FRAMEWORKS), label: "frameworks mapped" },
    { value: "Per control", label: "evidence collection" },
    { value: fmt(CSPM_POSTURE_RULES), label: "posture rules" },
    { value: String(CLOUDS), label: "clouds supported" },
  ],
  useCases: [
    {
      icon: FileCheck2,
      iconColor: "#2563EB",
      title: "PCI-DSS scope reduction & evidence",
      body: "Continuously identify every cloud resource in the cardholder data environment, validate segmentation, and export scope evidence auditors can accept without a follow-up meeting.",
    },
    {
      icon: Landmark,
      iconColor: "#F2AF04",
      title: "RBI frameworks for banks and NBFCs",
      body: "Findings mapped to the RBI frameworks for banks and for NBFCs, with a score per framework, evidence per control and PDF or CSV export for your next inspection.",
    },
    {
      icon: ShieldAlert,
      iconColor: "#E32D25",
      title: "Third-party & M&A cloud due diligence",
      body: "Onboard a newly acquired subsidiary's cloud tenancy and get a risk-ranked posture report from the first scan — before it gets connected to your production network.",
    },
    {
      icon: Radar,
      iconColor: "#05A052",
      title: "24/7 detection tuned for fraud-adjacent risk",
      body: "MITRE-mapped detections that pay attention to credential compromise, IAM privilege escalation, and data exfiltration from payment and reference-data systems.",
    },
  ],
  regulations: [
    { name: "PCI DSS", note: "Requirements mapped to cloud checks, with evidence per control exportable as PDF or CSV." },
    { name: "SOC 2", note: "Trust Services Criteria mapped to cloud checks and scored from the latest findings." },
    { name: "ISO 27001:2022", note: "Annex A controls mapped to cloud checks, with evidence per control." },
    { name: "RBI (banks)", note: "The RBI framework for banks, mapped to cloud checks and scored per framework." },
    { name: "RBI (NBFCs)", note: "The RBI framework for NBFCs, mapped to cloud checks and scored per framework." },
    { name: "GDPR", note: "Technical controls for personal data in cloud storage, databases and analytics." },
  ],
  whyChoose: [
    { title: "Evidence you can actually hand to an auditor", body: "Not screenshots. Timestamped evidence per control, exported as PDF or CSV." },
    { title: "Coverage across every cloud your firm uses", body: "AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud and Kubernetes — one control mapping, not seven." },
    { title: "Segregation of duties by design", body: "Posture scanning connects through read-only cloud roles, with role-based access inside Onam." },
    { title: "Deployed by risk teams, trusted by engineering", body: "No agents for posture scanning and no network changes. Security teams get results without lobbying for onboarding." },
  ],
  faqs: [
    {
      q: "Can Onam produce PCI DSS evidence for our QSA?",
      a: "Yes. PCI DSS requirements are mapped to cloud checks, each control keeps the resources evaluated, their results and timestamps, and reports export as PDF and CSV for your QSA to review.",
    },
    {
      q: "Which frameworks does Onam map for financial services?",
      a: "PCI DSS, SOC 2, ISO 27001:2022, GDPR, NIST 800-53, and the RBI frameworks for banks and NBFCs, among the 78 frameworks Onam maps. Each gets a score from the latest findings, evidence per control and PDF or CSV export.",
    },
    {
      q: "How is our data segregated from other Onam customers?",
      a: "Every customer's data carries a tenant identifier, and in our main databases PostgreSQL row-level security policies make the database itself refuse to return another tenant's rows. Data is encrypted at rest. See the Trust Center at /trust for details.",
    },
  ],
};

export const healthcareData: IndustrySolutionData = {
  breadcrumb: "Solutions · Healthcare",
  industryName: "Healthcare",
  headline: "HIPAA cloud compliance evidence, ready before the audit",
  metaDescription:
    "Healthcare cloud security and HIPAA compliance: continuous visibility into every PHI-adjacent cloud control for health systems, payers and digital health.",
  sub: "HIPAA asks you to safeguard electronic PHI wherever it lives, and in the cloud that means configuration: encryption, access and exposure on every store that may hold it. Onam gives health systems, payers and digital health companies visibility into those controls, re-checked on every scan.",
  stats: [
    { value: String(FRAMEWORKS), label: "frameworks mapped" },
    { value: "Every scan", label: "PHI posture re-checked" },
    { value: "Per control", label: "HIPAA evidence" },
    { value: String(CLOUDS), label: "clouds supported" },
  ],
  useCases: [
    {
      icon: FileSearch,
      iconColor: "#2563EB",
      title: "PHI discovery across every data store",
      body: "Onam labels data stores — S3 buckets, Azure Storage accounts, RDS databases, BigQuery datasets and more — as likely PHI from their metadata: names, descriptions, tags and schema. Each labelled store is checked for encryption, access and public exposure on every scan.",
    },
    {
      icon: Lock,
      iconColor: "#F2AF04",
      title: "Encryption-at-rest & in-transit assurance",
      body: "Managed data services are checked for encryption at rest, TLS enforcement and key-rotation settings. Non-conforming resources are surfaced at the next scan.",
    },
    {
      icon: ShieldAlert,
      iconColor: "#E32D25",
      title: "Access to PHI stores — who and why",
      body: "Observed access from cloud audit events over the last 30 days shows which principals touched each PHI-labelled store, and with which operations. Identity permissions sit alongside in CIEM, and attack paths that end at a PHI store are scored as reaching a crown jewel.",
    },
    {
      icon: ScrollText,
      iconColor: "#05A052",
      title: "HIPAA audit evidence",
      body: "Control status and timestamped evidence per control, mapped to HIPAA and exported as PDF or CSV for your compliance officer and assessors.",
    },
  ],
  regulations: [
    { name: "HIPAA", note: "Security Rule safeguards mapped to cloud checks; process controls are marked for manual review." },
    { name: "NIST 800-53", note: "Control families mapped to cloud checks — for organizations that report in NIST terms." },
    { name: "SOC 2", note: "Trust Services Criteria evidence, collected from every scan, for vendor risk reviews." },
    { name: "ISO 27001:2022", note: "Annex A controls mapped to cloud checks, with evidence per control." },
    { name: "GDPR", note: "For US health orgs with EU cohorts — data-residency, DPIA-relevant controls, and access logging." },
  ],
  whyChoose: [
    { title: "PHI labels that drive priority", body: "Stores labelled as likely PHI raise the findings and attack paths that reach them, so the riskiest gaps come first." },
    { title: "Evidence per control", body: "Timestamped evidence for each HIPAA control, exported as PDF or CSV." },
    { title: "Classification without opening your data", body: "PHI labels come from metadata. Onam does not open objects, query rows or sample files." },
    { title: "Works for health systems, payers, and digital health", body: "One control set covers hospitals, insurers and digital health apps." },
  ],
  faqs: [
    {
      q: "Does Onam ever ingest PHI?",
      a: "Data classification uses metadata — store names, descriptions, tags, database and schema names, and configuration such as bucket policies, encryption settings and IAM bindings. It does not open objects, query rows or sample files.",
    },
    {
      q: "How does Onam identify which resources hold PHI?",
      a: "Tokens in a store's name, description and tags (for example patient or clinical), database and schema names for self-hosted databases, and the metadata on rules that matched it. A store whose name and tags say nothing about its contents gets no label until someone tags it, so tagging PHI stores by your own convention makes the labels complete.",
    },
    {
      q: "Can Onam produce evidence for an OCR audit?",
      a: "Onam maps HIPAA controls to cloud checks and keeps evidence per control — the resources evaluated, their results and timestamps — exported as PDF or CSV. Process controls are marked for manual review rather than scored as passing.",
    },
  ],
};

/**
 * /solutions/government — the FedRAMP continuous monitoring (ConMon) page.
 *
 * Search Console (28 days to 2026-10-05): ~550 impressions at average position 84,
 * almost all of it the "fedramp conmon tools / software / solutions / platform /
 * services" cluster. Page-1 results for those queries explain the monthly ConMon
 * obligations (POA&M, inventory, scans, significant change, annual assessment); this
 * page now does too, and says plainly which of them Onam covers and which it does not.
 *
 * Truth notes: framework names and versions (NIST 800-53 rev5, NIST 800-171 R2,
 * FedRAMP Moderate/High) are from threat-engine catalog/complaince_csv/
 * final_compliance_rules_mapped.csv. No POA&M generator and no FedRAMP inventory
 * workbook exist in the product, so neither is claimed. No FedRAMP authorization
 * for Onam is recorded in facts/product.yaml, so none is claimed.
 */
export const governmentData: IndustrySolutionData = {
  breadcrumb: "Solutions · Government",
  industryName: "Government",
  headline: "FedRAMP continuous monitoring (ConMon) evidence, re-checked on every scan",
  metaDescription:
    "FedRAMP continuous monitoring (ConMon) tools: NIST 800-53 Rev 5 and FedRAMP Moderate/High control evidence every scan, exported for your monthly package.",
  sub: "FedRAMP continuous monitoring (ConMon) asks a cloud service provider to show, every month, that the controls authorized at ATO still hold — an updated POA&M, a current inventory, monthly vulnerability scans, and an annual assessment. Onam covers the cloud-configuration part of that work: findings mapped to NIST 800-53 Rev 5, NIST 800-171 and the FedRAMP Moderate and High baselines, re-checked on every scan across the cloud accounts in your boundary, with evidence your team exports into the package.",
  stats: [
    { value: "FedRAMP", label: "Moderate and High mapped" },
    { value: "Rev 5", label: "NIST 800-53 control catalog" },
    { value: "Per control", label: "timestamped evidence" },
    { value: String(CLOUDS), label: "clouds supported" },
  ],
  useCases: [
    {
      icon: FileSearch,
      iconColor: "#2563EB",
      title: "Monthly scanning — the cloud-configuration side",
      body: "Every connected cloud account is re-scanned against posture rules mapped to 800-53 Rev 5 controls, and vulnerability findings carry EPSS and KEV context. Onam does not replace the authenticated operating-system, database and web-application scans your authorization specifies, or the raw scanner files an agency may ask for.",
    },
    {
      icon: Boxes,
      iconColor: "#05A052",
      title: "System inventory — the input, not the workbook",
      body: "Onam discovers the resources in each connected account on every scan, so an asset that appeared since last month shows up with its findings. It does not fill in the FedRAMP Integrated Inventory Workbook; your team maps the discovered resources into it.",
    },
    {
      icon: ClipboardList,
      iconColor: "#F2AF04",
      title: "POA&M — the findings, not the document",
      body: "Each failing control lists the resources that fail it, with severity and remediation guidance, exportable as PDF, CSV, Excel or JSON. Onam does not generate or maintain your POA&M; your team tracks the items and their deadlines there.",
    },
    {
      icon: Radar,
      iconColor: "#E32D25",
      title: "Deviation requests and accepted risk",
      body: "Record an exception or compensating control with its justification, approver and target date. Exceptions are flagged as the date nears, so an accepted risk does not quietly become permanent. That record supports a deviation request; the request itself goes to your Authorizing Official.",
    },
    {
      icon: GitPullRequest,
      iconColor: "#4F46E5",
      title: "Significant change — control status either side",
      body: "After a change lands, the next scan re-checks the affected accounts against the same mapped controls, and the score and trend per framework show control status before and after. The significant change request and its security impact analysis stay with your team.",
    },
    {
      icon: CalendarCheck,
      iconColor: "#0D9488",
      title: "Annual assessment — evidence for your 3PAO",
      body: "Onam is not a 3PAO and does not perform the annual assessment or penetration test. It gives the assessor per-control evidence — resources evaluated, results, timestamps — for automated cloud-configuration controls. Process controls such as training, personnel security and physical protection are marked for manual review, not scored.",
    },
  ],
  regulations: [
    { name: "NIST 800-53 Rev 5", note: "The Rev 5 control catalog, with cloud-relevant families — AC, AU, CM, IA, SC, SI — mapped to cloud checks and evidence per control." },
    { name: "FedRAMP Moderate", note: "Moderate baseline mapped to cloud checks; process controls marked for manual review. PDF, CSV and Excel export." },
    { name: "FedRAMP High", note: "High baseline mapped to cloud checks; process controls marked for manual review. PDF, CSV and Excel export." },
    { name: "NIST 800-171", note: "800-171 requirements mapped to cloud checks for contractors handling CUI, with evidence per control to prepare for assessment." },
  ],
  whyChoose: [
    { title: "Built for continuous monitoring, not annual assessments", body: "Control status re-checked on every scan, with a score and trend per framework and evidence exportable on demand." },
    { title: "From framework to the failing resource", body: "Drill down from a framework to a control to the resources that fail it, with each finding's remediation guidance, so the people who own the fix see exactly what to change." },
    { title: "Findings per account", body: "Compliance status is available per connected cloud account, so you can report on the accounts that make up a system's authorization boundary." },
    { title: "Hosted in the region you choose", body: "Onam is hosted in a customer-chosen region — US, Europe, India or others — to meet your compliance requirements." },
  ],
  faqs: [
    {
      q: "What do FedRAMP ConMon tools need to do?",
      a: "FedRAMP continuous monitoring asks a cloud service provider to keep its authorized controls working and prove it monthly: an updated POA&M, an updated system inventory, monthly vulnerability scans, significant change requests when the system changes, and an annual assessment by a 3PAO. ConMon tools usually split that work — scanners, an inventory, a POA&M tracker and a GRC workspace. Onam is the cloud-configuration and evidence part of that stack.",
    },
    {
      q: "Which FedRAMP continuous monitoring deliverables does Onam help with?",
      a: "It helps with four: configuration findings for the monthly scan, a discovered resource inventory per account, the failing resources behind POA&M items, and per-control evidence for your 3PAO. It does not produce the POA&M itself, the FedRAMP Integrated Inventory Workbook, authenticated OS, database or web-application scans, the significant change request or the annual assessment.",
    },
    {
      q: "Is Onam a FedRAMP ConMon platform or a general CSPM with a FedRAMP mapping?",
      a: "It is a multi-cloud posture platform with FedRAMP Moderate and High, NIST 800-53 Rev 5 and NIST 800-171 mapped to its checks. For ConMon it gives you per-control evidence, a score and trend per framework, exceptions with justification and target dates, and exports — PDF, CSV, Excel or JSON — your team assembles into the monthly package.",
    },
    {
      q: "Does Onam map NIST 800-53 Rev 5 and the FedRAMP baselines?",
      a: "Yes. NIST 800-53 is mapped from the Rev 5 control catalog, and the FedRAMP Moderate and High baselines are mapped to cloud checks across AWS, Azure, GCP, OCI, Alibaba Cloud and IBM Cloud. Controls a cloud API cannot prove — training, personnel security, physical protection — are marked for manual review rather than scored as passing.",
    },
    {
      q: "Is Onam FedRAMP authorized?",
      a: "Mapping the FedRAMP baselines is not the same as holding a FedRAMP authorization, and this page claims no authorization for Onam. If your programme requires ConMon tooling to run inside a FedRAMP-authorized boundary, raise it with us before you evaluate, so you do not spend time on a tool you cannot use.",
    },
    {
      q: "Does Onam support FedRAMP 20x?",
      a: "Onam does not map the FedRAMP 20x Key Security Indicators as a framework today. What it does produce — control status re-checked on every scan and exported as JSON — is machine-readable evidence, but it is not a 20x submission.",
    },
    {
      q: "How do I scope reporting to my authorization boundary?",
      a: "Connect the cloud accounts that make up the system. Compliance status is available per account, and you can drill from a framework down to the controls and resources inside those accounts.",
    },
    {
      q: "Where is Onam hosted?",
      a: "In a region you choose — US, Europe, India or other regions — to meet your compliance requirements. Posture scanning connects through read-only cloud roles; snapshot-based workload scanning, if you enable it, runs inside your own account.",
    },
  ],
};
