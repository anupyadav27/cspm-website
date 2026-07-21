import type { Metadata } from 'next'
import { CloudSolutionTemplate } from '@/components/solutions/CloudSolutionTemplate'

export const metadata: Metadata = {
  title: 'AWS Cloud Security — Onam',
  description: '800+ AWS security rules across 40+ services. CIS AWS benchmarks, IAM analysis, S3 exposure, and continuous compliance.',
}

export default function AWSPage() {
  return (
    <CloudSolutionTemplate
      breadcrumb="Solutions · Amazon Web Services"
      headline="Stop AWS Misconfigurations Before Attackers Find Them First"
      sub="AWS's breadth — 200+ services across global regions — creates a sprawling attack surface that traditional tools cannot keep pace with. Onam continuously monitors every IAM policy, S3 bucket, security group, and Lambda configuration across all your AWS accounts with 800+ purpose-built rules."
      docsHref="/docs/onboarding/aws"
      stats={[
        { value: '800+',    label: 'AWS security rules'     },
        { value: '40+',     label: 'AWS services monitored' },
        { value: '< 5 min', label: 'to first finding'       },
        { value: '100%',    label: 'agentless, read-only'   },
      ]}
      services={[
        'IAM Users, Roles & Policies','S3 Buckets & Object ACLs','EC2 Instances & Security Groups',
        'RDS & Aurora Databases','Lambda Functions','CloudTrail & CloudWatch Logs',
        'KMS Keys & Encryption Settings','EKS Clusters & Node Groups','VPC Flow Logs & NACLs',
        'Elastic Load Balancers','SNS Topics & SQS Queues','Secrets Manager & Parameter Store',
        'GuardDuty & Security Hub','Route 53 & CloudFront',
      ]}
      serviceNote="Plus: CloudFormation, CodeBuild, CodePipeline, SageMaker, Bedrock, Elastic Beanstalk, Inspector, Macie, and more."
      frameworks={[
        { name: 'CIS AWS Foundations Benchmark' },{ name: 'NIST CSF 2.0' },
        { name: 'PCI-DSS v4.0' },{ name: 'SOC 2 Type II' },{ name: 'FedRAMP Moderate' },
      ]}
      setupSteps={[
        { title: 'Create a read-only IAM role', body: 'Use our CloudFormation template — one click, no manual policy writing. The role grants read-only access with no write or destructive permissions.' },
        { title: 'Paste the Role ARN', body: "Provide the ARN to Onam's onboarding wizard. Multi-account orgs connect via AWS Organizations in a single step — no per-account setup." },
        { title: 'First findings in < 5 minutes', body: 'Onam assumes the role via STS, scans all in-scope regions immediately, and delivers your first findings in under 5 minutes.' },
      ]}
      uniqueFeatures={[
        { title: 'Organizations-Aware Multi-Account Scanning', body: 'Onam traverses your entire AWS Organizations tree automatically — new member accounts are scanned within the next cycle without any manual re-configuration.' },
        { title: 'IAM Effective-Permission Graph', body: 'Onam resolves SCPs, permission boundaries, and resource-based policies into a single graph so you see exactly what a principal can actually do, not just what its policy says.' },
        { title: 'S3 Public-Exposure Chain Analysis', body: 'Onam traces the full exposure chain — bucket policy, ACL, Block Public Access settings, and CloudFront origin — to distinguish genuinely public data from buckets that merely look risky in isolation.' },
      ]}
      faqs={[
        { question: 'What AWS permissions does Onam require?', answer: 'Onam uses a read-only IAM role with SecurityAudit and ReadOnlyAccess managed policies. No write or destructive permissions are ever requested. You can review the exact policy in the onboarding wizard before deploying.' },
        { question: 'Can Onam scan all accounts in an AWS Organization in one step?', answer: 'Yes. You connect the management account once, and Onam automatically discovers and scans all member accounts via AWS Organizations — including accounts added after initial setup.' },
        { question: 'How long does the first scan take?', answer: 'Most accounts return initial findings within 5 minutes. Large environments with thousands of resources across many regions typically complete within 15–20 minutes.' },
        { question: 'Does Onam require any agents or network changes?', answer: 'No. Onam is 100% agentless and uses the AWS read-only IAM role via STS AssumeRole. There is no software to install, no VPN required, and no changes to your network configuration.' },
        { question: 'Which AWS compliance frameworks does Onam map to?', answer: 'Onam maps findings to CIS AWS Foundations Benchmark, NIST CSF 2.0, PCI-DSS v4.0, SOC 2 Type II, and FedRAMP Moderate out of the box. Each finding links to the specific control it affects.' },
      ]}
    />
  )
}
