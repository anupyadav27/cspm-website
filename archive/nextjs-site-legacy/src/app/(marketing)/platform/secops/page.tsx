import type { Metadata } from 'next'
import { Terminal } from 'lucide-react'
import { ProductPageTemplate } from '@/components/platform/ProductPageTemplate'

export const metadata: Metadata = {
  title: 'Code Security (SecOps) — SAST, DAST, SCA, IaC Scanning | Onam',
  description: 'Unified code security with 2,852 rules across 14 languages. SAST, DAST, SCA, and IaC scanning with SBOM generation, EPSS enrichment, and AI-powered fix suggestions.',
}

export default function SecOpsPage() {
  return (
    <ProductPageTemplate
      icon={Terminal}
      iconColor="text-slate-300"
      iconBg="bg-slate-500/10"
      label="Code Security (SecOps)"
      question="Is the code your team ships today introducing vulnerabilities that your cloud posture cannot catch?"
      headline="Cloud posture covers what's deployed. Code security covers what's about to be deployed."
      sub="Onam SecOps brings SAST, DAST, SCA, and IaC scanning into the same platform as your cloud posture data — so you can see exactly where code vulnerabilities will land in your cloud environment and what their blast radius will be before the code ships."
      painPoint="Most organizations run code security and cloud security in completely separate tools with completely separate teams. A SAST scanner finds a SQL injection in a Lambda function — but it has no idea whether that Lambda is internet-exposed, what IAM permissions it has, or whether it has a path to your production database. Meanwhile, your CSPM tool flags the Lambda's overprivileged role — but it has no idea the function also has a code-level vulnerability that makes the IAM finding exploitable in under 30 seconds. The two findings together are critical. Neither tool alone knows that."
      mechanism="Onam SecOps runs four analysis types in a single unified pipeline. SAST (Static Application Security Testing) analyzes source code and compiled artifacts across 14 languages — Python, JavaScript, TypeScript, Java, Go, Ruby, PHP, C, C++, C#, Rust, Kotlin, Swift, and Terraform — with 2,852 rules covering OWASP Top 10, CWE Top 25, and custom policy checks. DAST (Dynamic Application Security Testing) runs 479 active payloads against deployed endpoints for runtime vulnerability discovery — SQL injection, XSS, SSRF, authentication bypass, and more. SCA (Software Composition Analysis) scans all third-party dependencies for known CVEs, with EPSS and KEV enrichment to surface actively exploited libraries. IaC scanning checks Terraform, CloudFormation, Helm charts, and Kubernetes manifests for security misconfigurations before they are deployed. All findings are correlated with cloud posture data — a code vulnerability in an internet-exposed, overprivileged service gets a boosted risk score automatically."
      whatYouGet={[
        'SAST — 2,852 rules across 14 languages: Python, Go, Java, JavaScript, TypeScript, Ruby, PHP, C/C++, C#, Rust, Kotlin, Swift, Terraform',
        'DAST — 479 active test payloads: SQL injection, XSS, SSRF, IDOR, auth bypass, and more, against deployed endpoints',
        'SCA — full dependency graph with CVE correlation, EPSS exploit probability, and CISA KEV active-exploitation flags',
        'IaC scanning — Terraform, CloudFormation, Helm, and Kubernetes manifests scanned before deployment',
        'SBOM generation — CycloneDX-format Software Bill of Materials for every repository and service',
        'Cloud context enrichment — findings in internet-exposed or overprivileged services automatically receive boosted risk scores',
        'AI-powered fix suggestions — Onam generates a corrected code diff for every SAST finding using Mistral-based remediation',
        'CI/CD integration — scan on every commit and PR, with blocking gates configurable by severity and finding type',
      ]}
      faqs={[
        {
          question: 'How does Onam SecOps connect to my code repositories?',
          answer: 'Onam connects to GitHub, GitLab, Bitbucket, and Azure DevOps via OAuth app or installation token. SAST and SCA scans run on every push and pull request. DAST scans run on schedule against deployed endpoints (configurable per environment — staging, production, or both). IaC scans run on Terraform plan output or raw manifest files in the repository.',
        },
        {
          question: 'What makes the AI-powered fix suggestions different from Copilot or Snyk Code?',
          answer: 'Onam fix suggestions are cloud-aware. When generating a fix for a SAST finding, the fix engine has access to the full cloud context — the IAM permissions of the function that runs this code, the network exposure of the service, and the data classification of the resources it touches. This means the fix addresses not just the code vulnerability but also the blast radius if the vulnerability were exploited in this specific cloud environment.',
        },
        {
          question: 'What is a CycloneDX SBOM and why does it matter?',
          answer: 'CycloneDX is an open standard for Software Bill of Materials — a machine-readable inventory of every library, framework, and dependency in a software package. SBOMs are increasingly required by enterprise procurement and government contracts (US Executive Order 14028 mandates them for software sold to federal agencies). Onam generates CycloneDX SBOMs on demand for any repository or service, with vulnerability status pre-populated for every component.',
        },
        {
          question: 'Can Onam SecOps block a deployment if it finds a critical vulnerability?',
          answer: 'Yes. Onam integrates as a CI/CD check in GitHub Actions, GitLab CI, Jenkins, and CircleCI. You configure severity thresholds per environment — for example, block any deployment to production that introduces a Critical SAST finding or a CVE with a KEV flag. Findings that match existing approved exceptions are automatically excluded from the gate check.',
        },
      ]}
      relatedHrefs={[
        { label: 'Vulnerability Management', href: '/platform/vulnerability'      },
        { label: 'Container Security',       href: '/platform/container-security' },
        { label: 'Attack Path Analysis',     href: '/platform/attack-path'        },
        { label: 'CSPM — Posture',           href: '/platform/cspm'               },
      ]}
    />
  )
}
