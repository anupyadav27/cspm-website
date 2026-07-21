import { Landmark, FileCheck2, ShieldAlert, HeartPulse, Lock, FileSearch, Building2, ScrollText, Radar } from "lucide-react";
import type { IndustrySolutionData } from "@/components/site/IndustrySolutionTemplate";

export const financialData: IndustrySolutionData = {
  breadcrumb: "Solutions · Financial Services",
  industryName: "Financial Services",
  headline: "Prove Cloud Compliance to Your Auditors Before They Ask",
  sub: "Financial services firms face the strictest cloud security mandates on earth — and the shortest tolerance for breaches. Onam gives banks, fintechs, insurers, and asset managers a continuous, auditable evidence trail across every cloud account, so your next regulatory exam is a demonstration, not a scramble.",
  stats: [
    { value: "6", label: "financial frameworks mapped" },
    { value: "Continuous", label: "evidence collection" },
    { value: "10,000+", label: "controls audited" },
    { value: "100%", label: "agentless & read-only" },
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
      title: "SOX ITGC for cloud workloads",
      body: "Change management, access control, and logical-separation evidence collected on every commit and deploy — mapped to your control matrix and ready for external audit.",
    },
    {
      icon: ShieldAlert,
      iconColor: "#E32D25",
      title: "Third-party & M&A cloud due diligence",
      body: "Onboard a newly acquired subsidiary's cloud tenancy in minutes and get a risk-ranked posture report — before it gets connected to your production network.",
    },
    {
      icon: Radar,
      iconColor: "#05A052",
      title: "24/7 detection tuned for fraud-adjacent risk",
      body: "MITRE-mapped detections that pay attention to credential compromise, IAM privilege escalation, and data exfiltration from payment and reference-data systems.",
    },
  ],
  regulations: [
    { name: "PCI-DSS v4.0", note: "Every PCI requirement mapped to concrete cloud controls with evidence exportable per QSA request." },
    { name: "SOC 2 Type II", note: "Trust Services Criteria mapped continuously — no once-a-year scramble to reconstruct the year." },
    { name: "ISO 27001", note: "Annex A controls mapped to cloud primitives, with change-history evidence for surveillance audits." },
    { name: "NIST CSF", note: "Identify, Protect, Detect, Respond, Recover — every function scored per cloud account." },
    { name: "GLBA", note: "Safeguards Rule controls covering PII in cloud storage, databases, and analytics platforms." },
    { name: "SOX", note: "ITGCs for cloud change management, access, and segregation of duties — audit-ready evidence." },
  ],
  whyChoose: [
    { title: "Evidence you can actually hand to an auditor", body: "Not screenshots. Signed, timestamped exports mapped one-to-one against your framework's controls." },
    { title: "Coverage across every cloud your firm uses", body: "AWS, Azure, GCP, OCI, and Kubernetes — one control matrix, not seven." },
    { title: "Segregation of duties by design", body: "Read-only access, granular RBAC inside Onam, and full audit log — Onam itself passes SOX ITGCs." },
    { title: "Deployed by risk teams, trusted by engineering", body: "No agents, no network changes, no engineering time. Security teams get results without lobbying for onboarding." },
  ],
  faqs: [
    {
      q: "Can Onam produce PCI-DSS v4.0 evidence for our QSA?",
      a: "Yes. Every PCI requirement is mapped to concrete AWS/Azure/GCP controls. Evidence exports include configuration snapshots, timestamps, and change history — exactly what a QSA expects to see for cloud-scoped requirements.",
    },
    {
      q: "How does Onam help with SOX ITGCs for cloud?",
      a: "Onam captures continuous evidence for the three ITGC domains that auditors probe hardest in cloud: change management (who deployed what, when), access management (who has access to production, and why), and logical separation (dev/test/prod boundaries).",
    },
    {
      q: "Does Onam meet DORA operational-resilience requirements?",
      a: "Onam's continuous monitoring, incident-detection, and third-party posture-visibility capabilities align to DORA's ICT risk-management pillars. We can provide a control mapping for your DORA program on request.",
    },
    {
      q: "Is Onam itself audited?",
      a: "Yes — SOC 2 Type II, and controls aligned to ISO 27001. Reports are available under NDA.",
    },
    {
      q: "How is our data segregated from other Onam customers?",
      a: "Per-tenant encryption keys, tenant-scoped databases, and network isolation. No shared secrets, no cross-tenant queries.",
    },
  ],
};

export const healthcareData: IndustrySolutionData = {
  breadcrumb: "Solutions · Healthcare",
  industryName: "Healthcare",
  headline: "HIPAA Cloud Compliance That Survives an OCR Audit",
  sub: "Healthcare organizations are the most targeted sector in cloud-based breaches — and HHS Office for Civil Rights now pursues cloud misconfigurations as HIPAA violations without requiring a breach. Onam gives health systems, payers, and digital health companies continuous visibility into every PHI-adjacent cloud control, 24/7.",
  stats: [
    { value: "5", label: "healthcare frameworks mapped" },
    { value: "24/7", label: "PHI posture monitoring" },
    { value: "< 5 min", label: "to first HIPAA finding" },
    { value: "100%", label: "agentless & read-only" },
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
      body: "Every managed data service is audited for KMS-backed encryption, TLS enforcement, and key-rotation posture. Non-conforming resources are surfaced the moment they appear.",
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
      title: "Audit evidence for OCR & HITRUST",
      body: "Timestamped configuration history and control-status exports mapped directly to HIPAA Security Rule and HITRUST CSF — the exact shape OCR and assessors expect.",
    },
  ],
  regulations: [
    { name: "HIPAA Security Rule", note: "§164.308 (administrative), §164.310 (physical), §164.312 (technical) — mapped to concrete cloud controls." },
    { name: "HITRUST CSF", note: "Every applicable CSF control mapped to cloud primitives with evidence for i1 and r2 assessments." },
    { name: "NIST 800-66", note: "HIPAA implementation guidance in NIST language — for organizations that report in NIST terms." },
    { name: "SOC 2 Type II", note: "Trust Services Criteria evidence, continuously collected, ready for BAAs and vendor risk reviews." },
    { name: "GDPR", note: "For US health orgs with EU cohorts — data-residency, DPIA-relevant controls, and access logging." },
  ],
  whyChoose: [
    { title: "Purpose-built for PHI-adjacent controls", body: "Not a generic checklist. Rules that understand how PHI actually lives in AWS, Azure, and GCP." },
    { title: "Evidence OCR will accept", body: "Signed, timestamped exports of exactly the controls a HIPAA-compliance officer needs to defend." },
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
      a: "Yes. Every HIPAA Security Rule technical safeguard has a mapped, evidence-producing control. Exports include timestamps, principal, and configuration hash — the audit trail OCR expects.",
    },
    {
      q: "Do you sign a BAA?",
      a: "Yes. Onam signs BAAs for all healthcare customers. Because Onam never processes PHI, the BAA scope is narrow and easy for your privacy team to review.",
    },
    {
      q: "Do you map to HITRUST?",
      a: "Yes. HITRUST CSF controls are mapped natively for i1 and r2 assessments — reducing evidence-collection effort ahead of your assessor engagement.",
    },
  ],
};

export const governmentData: IndustrySolutionData = {
  breadcrumb: "Solutions · Government",
  industryName: "Government",
  headline: "FedRAMP-Aligned Cloud Security for Government Workloads, Continuously",
  sub: "Federal agencies and their contractors cannot afford a security posture that is visible only at authorization time — adversaries don't wait for your next ATO renewal. Onam delivers continuous monitoring against NIST 800-53, FedRAMP, FISMA, and CMMC controls across every cloud environment your agency or contractor operates.",
  stats: [
    { value: "5", label: "federal frameworks mapped" },
    { value: "ConMon", label: "monthly evidence, automated" },
    { value: "GovCloud", label: "AWS & Azure Government" },
    { value: "100%", label: "agentless, read-only" },
  ],
  useCases: [
    {
      icon: FileCheck2,
      iconColor: "#2563EB",
      title: "Continuous ATO evidence",
      body: "Automate the monthly Continuous Monitoring evidence expected under FedRAMP. Every 800-53 control status is timestamped, hashed, and export-ready for your 3PAO and Authorizing Official.",
    },
    {
      icon: Radar,
      iconColor: "#F2AF04",
      title: "Boundary drift detection",
      body: "The moment a resource is created outside your authorization boundary, Onam flags it — with the account, principal, and time of change. Boundary drift is caught in minutes, not annual assessments.",
    },
    {
      icon: Building2,
      iconColor: "#05A052",
      title: "CMMC 2.0 for the defense industrial base",
      body: "Contractors handling CUI get every CMMC Level 2 practice mapped to concrete cloud controls — with evidence a C3PAO will accept for certification.",
    },
    {
      icon: ShieldAlert,
      iconColor: "#E32D25",
      title: "Cross-agency shared-service posture",
      body: "Agencies operating shared services see per-tenant posture and aggregated agency-wide risk in one workspace — with role-scoped access enforced end to end.",
    },
  ],
  regulations: [
    { name: "NIST 800-53 Rev 5", note: "Every applicable control family — AC, AU, CM, IA, SC, SI — mapped to concrete cloud primitives with ConMon-ready evidence." },
    { name: "FedRAMP", note: "Moderate and High baselines mapped natively. Evidence exports designed for 3PAO ingestion." },
    { name: "FISMA", note: "Annual FISMA reporting supported with agency-scoped control-status rollups." },
    { name: "CMMC 2.0", note: "Level 1 and Level 2 practices mapped for defense-industrial-base contractors." },
    { name: "NIST 800-171", note: "Every 800-171 requirement mapped for CUI handlers ahead of CMMC assessment." },
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
      q: "How does Onam handle authorization boundary?",
      a: "You define boundary by account, tag, or resource query. Every finding is attributed to boundary-in-scope, boundary-adjacent, or out-of-boundary — so 3PAOs know exactly what to review.",
    },
    {
      q: "Do you help contractors prepare for CMMC 2.0?",
      a: "Yes. Level 1 and Level 2 practices are mapped natively, with evidence exports designed for C3PAO assessments. Contractors typically shorten pre-assessment prep from months to weeks.",
    },
    {
      q: "Is Onam FedRAMP authorized?",
      a: "Onam operates FedRAMP-aligned environments for government workloads. Current authorization status is available under NDA on request.",
    },
  ],
};
