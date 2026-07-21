import type { Metadata } from 'next'
import { Layers } from 'lucide-react'
import { ProductPageTemplate } from '@/components/platform/ProductPageTemplate'

export const metadata: Metadata = { title: 'Technology Engine', description: 'Discover what technology stack is actually running across your cloud fleet. 5,000+ rules across 34 technologies.' }

export default function TechnologyPage() {
  return (
    <ProductPageTemplate
      icon={Layers}
      iconColor="text-slate-400"
      iconBg="bg-slate-500/10"
      label="Technology Engine"
      question="What technology is actually running in my cloud?"
      headline="Shadow IT and forgotten services are everywhere. Let's find yours."
      sub="The technology engine discovers the actual runtime stack across your fleet — databases, web servers, frameworks, runtimes, libraries — and flags configurations that don't meet security standards for each technology."
      painPoint="You have a CloudFormation template that says you're running PostgreSQL 14. What's actually running on that EC2 instance after 18 months of manual changes? Or the Node.js service that was deployed from a Docker image 6 months ago — is it still on the version the dev team thinks it is? The technology engine tells you what's actually there, not just what was declared."
      mechanism="The technology engine performs runtime discovery across your workloads using agentless techniques — reading package manifests, configuration files, and process metadata. It identifies 34 technology categories including databases, web servers, application runtimes, message queues, caching layers, and frameworks. Each detected technology is evaluated against 5,000+ technology-specific rules covering version currency, default configuration changes, and known-insecure settings."
      whatYouGet={[
        'Runtime technology inventory: what\'s actually running, not what was deployed',
        'Version currency analysis: outdated runtimes and libraries across your fleet',
        'End-of-life detection: technologies with no active security support',
        'Default configuration checks: databases, web servers, and frameworks using insecure defaults',
        '34 technology categories: from PostgreSQL to Nginx to Redis to Node.js',
        '5,000+ technology-specific rules tailored to each product\'s security model',
        'Shadow IT surface area: services running that your team may not know about',
        'Technology risk scoring: combined view of vulnerability exposure per technology',
      ]}
      diagram={<img src="/diagrams/p-technology.svg" style={{ width: '100%' }} alt="Technology engine — 34 cloud technologies" />}
      faqs={[
        {
          question: "What's the difference between Technology Engine and CSPM?",
          answer: "CSPM checks whether cloud resources are correctly configured for security — security groups, encryption settings, logging, IAM policies. Technology Engine discovers what software is running inside those resources — databases, frameworks, runtimes, libraries — and checks whether those software components are up to date, using secure defaults, and on the approved list. They complement each other: CSPM covers the cloud control plane; Technology Engine covers the software layer.",
        },
        {
          question: 'Which technology categories are covered?',
          answer: 'Databases (PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch), web servers (Nginx, Apache, HAProxy), application runtimes (Java, Node.js, Python, Go, Ruby), message queues (Kafka, RabbitMQ, SQS), caching layers, and application frameworks (Django, Rails, Spring, Laravel). 34 categories in total, with more added each quarter.',
        },
        {
          question: 'Does the Technology Engine need agents?',
          answer: 'For cloud-managed services (RDS, ElastiCache, Lambda runtimes), no agent is needed — version and configuration information comes from the cloud API. For self-managed software running on EC2 instances or VMs, a lightweight agentless technique reads package manifests and process metadata via Systems Manager. An optional agent provides deeper software inventory.',
        },
        {
          question: 'How does shadow IT detection work?',
          answer: 'You define an approved-software list in the Technology Engine configuration. The engine compares discovered technology against that list and flags any software running outside of it — including the resource it is running on, the account, the region, and the team responsible. This covers both unapproved commercial software and open-source packages not in your approved catalogue.',
        },
      ]}
      relatedHrefs={[
        { label: 'Vulnerability Management', href: '/platform/vulnerability'    },
        { label: 'Container Security',       href: '/platform/container-security'},
        { label: 'CSPM',                     href: '/platform/cspm'             },
      ]}
    />
  )
}
