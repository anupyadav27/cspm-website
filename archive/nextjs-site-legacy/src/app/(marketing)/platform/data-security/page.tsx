import type { Metadata } from 'next'
import { Database } from 'lucide-react'
import { ProductPageTemplate } from '@/components/platform/ProductPageTemplate'

export const metadata: Metadata = { title: 'Data Security — DSPM', description: 'Discover where your sensitive data lives, classify it, and find every identity that can reach it.' }

export default function DataSecurityPage() {
  return (
    <ProductPageTemplate
      icon={Database}
      iconColor="text-csm-amber"
      iconBg="bg-csm-amber/10"
      label="Data Security (DSPM)"
      question="Where is your sensitive data — and who can reach it?"
      headline="Your data is in dozens of services. Do you know which ones are exposed?"
      sub="Data Security gives you a map of every storage resource across your cloud accounts, classifies what's inside, and shows you exactly which identities and network paths can reach it."
      painPoint="You know you have S3 buckets. You probably don't know which ones contain PII, which ones are encrypted, and which ones have access logs disabled. The same is true for RDS databases, DynamoDB tables, Azure Blob storage, and GCP buckets. When a data breach happens, the question 'what was in there?' should already have an answer."
      mechanism="The data security engine runs across 62 rules covering 7 domains: data classification (what's in each resource), encryption coverage (at rest and in transit), access controls (who can reach it), data lifecycle (retention policies), data residency (which regions), data lineage (where it flows), and DLP-style checks (credential files, exposed keys). It integrates with CIEM to show the intersection of 'sensitive data location' and 'who has access', surfacing the highest-risk combinations first."
      whatYouGet={[
        'Data store inventory: every S3 bucket, RDS instance, blob, and table classified',
        'Encryption coverage: which resources lack at-rest or in-transit encryption',
        'Public access map: storage resources accessible without authentication',
        'Access path analysis: every identity that can read or write to sensitive data stores',
        'Credential exposure check: config files, secrets, or keys stored in object storage',
        'Data residency report: sensitive data in regions outside your approved list',
        'Retention policy compliance: buckets and tables without lifecycle rules',
        'Logging and monitoring coverage: which data stores have access logging enabled',
      ]}
      diagram={<img src="/diagrams/p-datasec.svg" style={{ width: '100%' }} alt="Data security posture management" />}
      faqs={[
        {
          question: 'Does Onam read the actual contents of my data — files, database records, or objects?',
          answer: "No. Classification works by analysing resource metadata, tags, bucket policies, naming patterns, and configuration — not by reading the contents of files or database rows. Your data never leaves your cloud environment, and Onam's read-only access does not extend to data plane operations.",
        },
        {
          question: 'What cloud storage services are covered?',
          answer: 'AWS: S3, RDS, DynamoDB, Redshift, Glacier. Azure: Blob Storage, Azure SQL, Cosmos DB, Azure Data Lake. GCP: Cloud Storage, BigQuery, Spanner, Firestore. OCI and AliCloud storage services are also covered.',
        },
        {
          question: "What's the relationship between Data Security and DSPM?",
          answer: "Data Security is Onam's DSPM (Data Security Posture Management) capability. DSPM is the industry category term — it covers data classification, access path analysis, encryption coverage, data lifecycle, residency, and regulatory compliance. If a vendor or analyst refers to DSPM, this is the Onam capability they mean.",
        },
        {
          question: 'How does Onam identify sensitive data without reading file contents?',
          answer: 'We combine several signals: resource naming patterns (buckets named "pii-", "customer-data-", "health-records-"), existing classification tags applied by your team, object key prefixes in S3, and schema metadata for databases. We also flag resources known to hold sensitive data categories by function — payment processing databases, healthcare record stores, HR data buckets.',
        },
      ]}
      relatedHrefs={[
        { label: 'CIEM — Who has access',      href: '/platform/ciem'           },
        { label: 'CSPM — Misconfigurations',   href: '/platform/cspm'           },
        { label: 'Compliance frameworks',       href: '/platform/compliance'     },
      ]}
    />
  )
}
