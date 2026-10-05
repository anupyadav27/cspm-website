import { Landmark, FileCheck2, ShieldAlert, HeartPulse, Lock, FileSearch, Building2, ScrollText, Radar } from "lucide-react";
import type { IndustrySolutionData } from "@/components/site/IndustrySolutionTemplate";
import { CLOUDS, CSPM_POSTURE_RULES, FRAMEWORKS, fmt } from "@/lib/product-facts";

export const financialData: IndustrySolutionData = {
  breadcrumb: "Solutions · Financial Services",
  industryName: "Financial Services",
  headline: "Prove Cloud Compliance to Your Auditors Before They Ask",
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
  headline: "HIPAA Cloud Compliance Evidence, Ready Before the Audit",
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

export const governmentData: IndustrySolutionData = {
  breadcrumb: "Solutions · Government",
  industryName: "Government",
  headline: "Continuous FedRAMP Control Evidence for Your Government Cloud Workloads",
  sub: "Federal agencies and their contractors need a security posture that is visible between authorizations, not only at ATO time. Onam maps findings to NIST 800-53, NIST 800-171 and FedRAMP Moderate and High controls, re-checked on every scan, across every cloud account your agency or contractor connects.",
  stats: [
    { value: "FedRAMP", label: "Moderate and High mapped" },
    { value: "Every scan", label: "control status re-checked" },
    { value: "Per control", label: "timestamped evidence" },
    { value: String(CLOUDS), label: "clouds supported" },
  ],
  useCases: [
    {
      icon: FileCheck2,
      iconColor: "#2563EB",
      title: "Evidence for continuous monitoring",
      body: "Every 800-53 control mapped to cloud checks keeps its status, the resources evaluated and timestamps, re-checked on every scan and exportable as PDF, CSV or Excel when your 3PAO or Authorizing Official asks.",
    },
    {
      icon: Radar,
      iconColor: "#F2AF04",
      title: "Exceptions with an owner and an end date",
      body: "Record an exception or compensating control with its justification, approver and target date. Exceptions are flagged as the date nears, so an accepted risk does not quietly become permanent.",
    },
    {
      icon: Building2,
      iconColor: "#05A052",
      title: "NIST 800-171 for the defense industrial base",
      body: "Contractors handling CUI get NIST 800-171 requirements mapped to cloud checks, with evidence per control to prepare for assessment.",
    },
    {
      icon: ShieldAlert,
      iconColor: "#E32D25",
      title: "From framework to the failing resource",
      body: "Drill down from a framework to a control to the resources that fail it, with each finding's remediation guidance, so the people who own the fix see exactly what to change.",
    },
  ],
  regulations: [
    { name: "NIST 800-53", note: "Cloud-relevant control families — AC, AU, CM, IA, SC, SI — mapped to cloud checks with evidence per control." },
    { name: "FedRAMP Moderate", note: "Moderate baseline mapped to cloud checks, with PDF and CSV export." },
    { name: "FedRAMP High", note: "High baseline mapped to cloud checks, with PDF and CSV export." },
    { name: "NIST 800-171", note: "800-171 requirements mapped for CUI handlers." },
  ],
  whyChoose: [
    { title: "Built for continuous monitoring, not annual assessments", body: "Control status re-checked on every scan, with a score and trend per framework and evidence exportable on demand." },
    { title: "Hosted in the region you choose", body: "Onam is hosted in a customer-chosen region — US, Europe, India or others — to meet your compliance requirements." },
    { title: "Findings per account", body: "Compliance status is available per connected cloud account, so you can report on the accounts that make up a system." },
    { title: "One control set for owners and contractors", body: "The same mapping covers federal system owners, contractors and shared-service providers." },
  ],
  faqs: [
    {
      q: "Where is Onam hosted?",
      a: "In a region you choose — US, Europe, India or other regions — to meet your compliance requirements. Posture scanning connects through read-only cloud roles; agentless workload scanning runs inside your account.",
    },
    {
      q: "Do you support Continuous Monitoring (ConMon) obligations?",
      a: "Onam supplies the evidence a ConMon programme draws on: control status per 800-53 control, re-checked on every scan, with the resources evaluated and timestamps, plus vulnerability findings with EPSS and KEV context. Reports export as PDF, CSV, Excel or JSON for your monthly package.",
    },
    {
      q: "Is Onam a FedRAMP ConMon tool, or a general CSPM with a FedRAMP mapping?",
      a: "It is a multi-cloud posture platform with FedRAMP Moderate and High, NIST 800-53 and NIST 800-171 mapped to its checks. For ConMon it gives you per-control evidence, a score and trend per framework, exceptions with justification and target dates, and exports your team assembles into the POA&M and other monthly deliverables.",
    },
    {
      q: "How do I scope reporting to my authorization boundary?",
      a: "Connect the cloud accounts that make up the system. Compliance status is available per account, and you can drill from a framework down to the controls and resources inside those accounts.",
    },
  ],
};
