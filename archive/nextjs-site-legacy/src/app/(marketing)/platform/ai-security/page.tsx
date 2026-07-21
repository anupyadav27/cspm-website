import type { Metadata } from 'next'
import { Cpu } from 'lucide-react'
import { ProductPageTemplate } from '@/components/platform/ProductPageTemplate'

export const metadata: Metadata = { title: 'AI Security — SageMaker, Bedrock, ML Workloads', description: 'Security posture for AI and ML workloads. SageMaker, Bedrock, and AI pipelines have unique risks.' }

export default function AISecurityPage() {
  return (
    <ProductPageTemplate
      icon={Cpu}
      iconColor="text-violet-400"
      iconBg="bg-violet-500/10"
      label="AI Security"
      question="Are my AI workloads introducing security risks I haven't thought about?"
      headline="The SEC, EU AI Act, and NIST AI RMF now require AI security posture. Most CSPM tools don't check it."
      sub="SageMaker models, Bedrock endpoints, training pipelines, and inference workloads have a distinct security surface — misconfigured by default, invisible to standard CSPM rules, and now subject to regulatory requirements that went into force in 2026. Onam checks all of it."
      painPoint="Teams moving to AI often focus entirely on model quality and ignore the security posture of the infrastructure behind it. A SageMaker notebook with public access. A Bedrock endpoint accessible without IAM authentication. Training jobs reading from an overly permissive S3 bucket. These aren't hypothetical — they're the defaults you get if you spin up AI infrastructure the same way you'd spin up anything else."
      mechanism="The AI security engine checks AWS SageMaker and Bedrock configurations against a library of AI-specific security rules — covering endpoint access controls, VPC isolation for training jobs, model artifact encryption, S3 bucket policies for training data, logging and monitoring for inference endpoints, and IAM permission scoping for ML service roles. Findings are integrated with the rest of your security posture so AI risks appear alongside your other critical findings, not in a separate silo."
      whatYouGet={[
        'SageMaker endpoint access control: public vs. VPC-only inference endpoints',
        'Bedrock model invocation audit: who can call your models, and with what IAM permissions',
        'Training job isolation: whether training runs inside a VPC with appropriate security groups',
        'Model artifact encryption: S3 buckets holding model files encrypted at rest',
        'Training data access analysis: overly permissive access to training datasets',
        'SageMaker Studio network isolation: public vs. private domain configuration',
        'ML service role scoping: execution roles with broader permissions than needed',
        'Logging and monitoring: CloudWatch logging enabled for inference and training jobs',
      ]}
      diagram={<img src="/diagrams/p-ai-security.svg" style={{ width: '100%' }} alt="AI and ML security posture" />}
      faqs={[
        {
          question: 'Which AWS AI services are covered today?',
          answer: 'SageMaker (endpoints, model registry, training jobs, notebook instances, Studio domains), Bedrock (model access configuration, agent permissions, knowledge base S3 sources), and associated infrastructure — S3 buckets holding model artefacts, ECR repositories with ML images, and IAM roles scoped to ML service actions.',
        },
        {
          question: 'Why does AI security need a separate engine if I already have CSPM?',
          answer: "Standard CSPM rules cover general-purpose cloud configuration. They don't know that a SageMaker endpoint should be in VPC isolation, that Bedrock knowledge bases have specific data access patterns, or that training jobs need network isolation from internet egress. AI Security adds domain-specific checks for the unique risk surface of AI and ML infrastructure.",
        },
        {
          question: 'What Azure and GCP AI services are on the roadmap?',
          answer: 'Azure OpenAI Service, Azure Machine Learning Studio, Google Vertex AI, and Google AI Platform are planned for the next major release. Findings from these services will appear in the same unified AI Security dashboard.',
        },
        {
          question: 'Do AI security findings appear in compliance reports?',
          answer: 'Yes. AI security findings map to relevant compliance controls — particularly SEC disclosure requirements, EU AI Act posture obligations, and NIST AI RMF controls. The 2026 regulatory wave makes AI infrastructure posture a compliance requirement, not just a best practice.',
        },
      ]}
      relatedHrefs={[
        { label: 'CSPM',              href: '/platform/cspm'       },
        { label: 'Data Security',     href: '/platform/data-security'},
        { label: 'IAM Security',      href: '/platform/iam'         },
      ]}
    />
  )
}
