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
  sub: "Healthcare organizations are the most targeted sector in cloud-based breaches — and HHS Office for Civil Rights now pursues cloud misconfigurations as HIPAA violations without requiring a breach. Onam gives health systems, payers, and digital health companies continuous visibility into every PHI-adjacent cloud control, 24/7.",
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
      body: "Onam identifies S3 buckets, Azure Storage accounts, RDS databases, and BigQuery datasets that likely contain PHI — and continuously validates encryption, access, and public exposure on each.",
    },
    {
      icon: Lock,
      iconColor: "#F2AF04",
      title: "Encryption-at-rest & in-transit assurance",
      body: "Every managed data service is audited for KMS-backed encryption, TLS enforcement, and key-rotation posture. Non-conforming resources are surfaced at the next scan.",
    },
    {
      icon: ShieldAlert,
      iconColor: "#E32D25",
      title: "Access to PHI stores — who and why",
      body: "IAM effective-permissions on PHI-hosting resources are graphed against your workforce roles. Access anomalies (a marketing account with read on the EHR bucket) are surfaced immediately.",
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
    { title: "Purpose-built for PHI-adjacent controls", body: "Not a generic checklist. Rules that understand how PHI actually lives in AWS, Azure, and GCP." },
    { title: "Evidence per control", body: "Timestamped evidence for each HIPAA control, exported as PDF or CSV." },
    { title: "Zero PHI ever leaves your cloud", body: "Onam reads configuration, never data. No PHI ingested, ever." },
    { title: "Works for health systems, payers, and digital health", body: "One control set covers hospitals, insurers, digital health apps, and their BAAs." },
  ],
  faqs: [
    {
      q: "Does Onam ever ingest PHI?",
      a: "No. Onam reads configuration metadata — bucket policies, encryption settings, IAM bindings, database properties — never data-plane content. PHI never leaves your cloud.",
    },
    {
      q: "How does Onam identify which resources hold PHI?",
      a: "A combination of resource tags, service metadata, and configurable classification rules. Customers commonly seed the classifier with their internal PHI-tagging convention; Onam then propagates it as new resources appear.",
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
  sub: "Federal agencies and their contractors cannot afford a security posture that is visible only at authorization time — adversaries don't wait for your next ATO renewal. Onam maps findings to NIST 800-53, NIST 800-171 and FedRAMP Moderate and High controls, re-checked on every scan, across every cloud environment your agency or contractor operates.",
  stats: [
    { value: "FedRAMP", label: "Moderate and High mapped" },
    { value: "ConMon", label: "monthly evidence, automated" },
    { value: "GovCloud", label: "AWS & Azure Government" },
    { value: String(CLOUDS), label: "clouds supported" },
  ],
  useCases: [
    {
      icon: FileCheck2,
      iconColor: "#2563EB",
      title: "Continuous ATO evidence",
      body: "Automate the monthly Continuous Monitoring evidence expected under FedRAMP. Every 800-53 control status is timestamped and exportable as PDF or CSV for your 3PAO and Authorizing Official.",
    },
    {
      icon: Radar,
      iconColor: "#F2AF04",
      title: "Boundary drift detection",
      body: "When a resource is created outside your authorization boundary, Onam flags it — with the account, principal, and time of change. Boundary drift is caught at the next scan, not at the annual assessment.",
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
      title: "Cross-agency shared-service posture",
      body: "Agencies operating shared services see per-tenant posture and aggregated agency-wide risk in one workspace — with role-scoped access enforced end to end.",
    },
  ],
  regulations: [
    { name: "NIST 800-53", note: "Cloud-relevant control families — AC, AU, CM, IA, SC, SI — mapped to cloud checks with evidence per control." },
    { name: "FedRAMP Moderate", note: "Moderate baseline mapped to cloud checks, with PDF and CSV export." },
    { name: "FedRAMP High", note: "High baseline mapped to cloud checks, with PDF and CSV export." },
    { name: "NIST 800-171", note: "800-171 requirements mapped for CUI handlers." },
  ],
  whyChoose: [
    { title: "Built for continuous monitoring, not annual assessments", body: "Evidence collected every day, exportable on demand — designed for the ConMon reality of federal cloud." },
    { title: "GovCloud and sovereign region ready", body: "Deployable in AWS GovCloud, Azure Government, and equivalent sovereign environments." },
    { title: "Boundary-aware findings", body: "Onam knows which resources are in scope for your authorization boundary — and which are not. Findings are attributed accordingly." },
    { title: "Deployed by agencies and their contractors alike", body: "One control set covers federal owner, contractor, and shared-service scenarios." },
  ],
  faqs: [
    {
      q: "Can Onam be deployed in AWS GovCloud or Azure Government?",
      a: "Yes. Onam operates in AWS GovCloud (US) and Azure Government with the same depth as commercial regions. Data residency is enforced end to end.",
    },
    {
      q: "Do you support Continuous Monitoring (ConMon) obligations?",
      a: "Yes. Monthly ConMon evidence — control status, deviations, POA&M inputs — is generated automatically and formatted for 3PAO ingestion.",
    },
    {
      q: "Is Onam a FedRAMP ConMon tool, or a general CSPM with a FedRAMP mapping?",
      a: "Both, and the distinction matters. The posture engine is a general multi-cloud CSPM. The ConMon layer on top of it is specific: it produces the monthly deliverables a FedRAMP program actually has to hand over — control-status evidence per 800-53 control, deviation requests, POA&M inputs and vulnerability-scan summaries — on a schedule, in the formats a 3PAO and an Authorizing Official expect, without a person assembling them from screenshots each month.",
    },
    {
      q: "How does Onam handle authorization boundary?",
      a: "You define boundary by account, tag, or resource query. Every finding is attributed to boundary-in-scope, boundary-adjacent, or out-of-boundary — so 3PAOs know exactly what to review.",
    },
  ],
};
