import type { Metadata } from 'next'
import { CloudSolutionTemplate } from '@/components/solutions/CloudSolutionTemplate'
export const metadata: Metadata = { title: 'GCP Cloud Security — Onam', description: '300+ GCP rules across BigQuery, GKE, IAM, and VPC.' }
export default function GCPPage() {
  return <CloudSolutionTemplate
    breadcrumb="Solutions · Google Cloud Platform"
    headline="Secure GCP Projects at Scale Without Slowing Down Engineering"
    sub="GCP gives engineering teams enormous flexibility and security teams enormous blind spots. Onam continuously audits every project from IAM bindings and BigQuery permissions to GKE configs and VPC firewall rules."
    docsHref="/docs/onboarding/gcp"
    stats={[{value:'300+',label:'GCP security rules'},{value:'30+',label:'GCP services monitored'},{value:'Org-wide',label:'folder and project sweep'},{value:'< 5 min',label:'to first finding'}]}
    services={['IAM Bindings, Service Accounts & Workload Identity','Google Cloud Storage Buckets','Compute Engine Instances & Instance Groups','Cloud SQL & Spanner','Google Kubernetes Engine (GKE)','BigQuery Datasets & Tables','VPC Firewall Rules & Shared VPC','Cloud KMS Key Rings & CryptoKeys','Cloud Logging & Audit Logs','Cloud Functions & Cloud Run','Artifact Registry & Container Analysis','Secret Manager','Cloud Armor Security Policies']}
    frameworks={[{name:'CIS GCP Foundations Benchmark'},{name:'NIST CSF 2.0'},{name:'ISO 27001:2022'},{name:'PCI-DSS v4.0'},{name:'SOC 2 Type II'}]}
    setupSteps={[{title:'Create org-level service account',body:"Grant 'Security Reviewer' and 'Organization Viewer' roles at the organization level using our gcloud commands — no custom roles required."},{title:'Provide credentials',body:"Generate a service account key, or configure Workload Identity Federation for keyless access, and provide it to the onboarding flow."},{title:'Full org sweep in < 5 min',body:'Onam traverses your entire GCP organization — folders, subfolders, and projects — and delivers findings within 5 minutes.'}]}
    uniqueFeatures={[{title:'Service Account Key Age & Usage Analysis',body:"Onam tracks every key's creation date, last authentication timestamp, and privilege level — flagging long-lived over-privileged keys GCP's native tooling doesn't surface in one view."},{title:'BigQuery Dataset Public Exposure Detection',body:'Onam identifies datasets and tables granting access to allUsers or allAuthenticatedUsers — a frequently overlooked misconfiguration that can expose petabytes of analytics data.'},{title:'GKE Workload Identity & RBAC Correlation',body:'Onam correlates GKE RBAC bindings with Workload Identity mappings to reveal Kubernetes service accounts granted excessive GCP permissions via identity federation.'}]}
    faqs={[
      { question: 'What GCP permissions does Onam require?', answer: "Onam uses a service account with the built-in 'Security Reviewer' and 'Organization Viewer' roles granted at the organization level. No custom roles are needed, and no write or destructive permissions are requested." },
      { question: 'Can Onam scan our entire GCP organization across all folders and projects?', answer: 'Yes. Onam traverses your entire GCP organization hierarchy — org → folders → subfolders → projects — automatically. New projects added after onboarding are discovered and included in subsequent scans.' },
      { question: 'Does Onam support Workload Identity Federation for keyless access?', answer: 'Yes. Instead of creating a service account key, you can configure Workload Identity Federation to allow Onam to authenticate using short-lived credentials — eliminating the need to manage or rotate a service account key.' },
      { question: 'What GCP compliance frameworks does Onam cover?', answer: 'Onam maps GCP findings to CIS GCP Foundations Benchmark, NIST CSF 2.0, ISO 27001:2022, PCI-DSS v4.0, and SOC 2 Type II out of the box.' },
      { question: 'Can Onam detect public BigQuery or Cloud Storage exposure?', answer: 'Yes. Onam checks IAM bindings at the organization, folder, project, bucket, and dataset level to identify allUsers or allAuthenticatedUsers grants — distinguishing genuinely public resources from those with inherited IAM that appears open but is blocked at a higher scope.' },
    ]}
  />
}