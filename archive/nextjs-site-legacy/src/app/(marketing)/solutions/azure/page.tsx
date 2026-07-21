import type { Metadata } from 'next'
import { CloudSolutionTemplate } from '@/components/solutions/CloudSolutionTemplate'

export const metadata: Metadata = {
  title: 'Azure Cloud Security — Onam',
  description: 'Full Azure security visibility — 350+ rules, Entra ID, AKS, NSGs, Key Vault, and continuous compliance across subscriptions.',
}

export default function AzurePage() {
  return (
    <CloudSolutionTemplate
      breadcrumb="Solutions · Microsoft Azure"
      headline="Full Azure Security Visibility Across Every Subscription and Tenant"
      sub="Azure's nested hierarchy of management groups, subscriptions, and resource groups makes consistent security posture nearly impossible to maintain manually. Onam maps your entire Azure estate — from Entra ID conditional access policies to NSG rules on every VM NIC — and flags drift the moment it occurs."
      docsHref="/docs/onboarding/azure"
      stats={[
        { value: '350+',         label: 'Azure security rules'     },
        { value: '35+',          label: 'Azure services monitored' },
        { value: 'Multi-tenant', label: 'Entra ID support'         },
        { value: '100%',         label: 'agentless deployment'     },
      ]}
      services={[
        'Entra ID Users, Groups & Service Principals','Azure Virtual Machines & VM Scale Sets',
        'Azure Blob Storage & ADLS Gen2','Azure SQL Database & Managed Instance',
        'Azure Kubernetes Service (AKS)','Network Security Groups & Azure Firewall',
        'Azure Key Vault & Managed HSM','App Service & Function Apps',
        'Azure Monitor & Diagnostic Settings','Azure Policy & Blueprints',
        'Virtual Networks & Peering','Azure AD Privileged Identity Management',
        'Container Registry (ACR)',
      ]}
      frameworks={[
        { name: 'CIS Microsoft Azure Foundations Benchmark' },{ name: 'ISO 27001:2022' },
        { name: 'NIST 800-53 Rev 5' },{ name: 'GDPR' },{ name: 'SOC 2 Type II' },
      ]}
      setupSteps={[
        { title: 'Register Onam in Entra ID', body: "Register Onam as an Entra ID application and grant it the built-in 'Security Reader' role at the management group level — no custom roles required." },
        { title: 'Provide Tenant & App IDs', body: 'Provide the Tenant ID and Application (Client) ID; Onam retrieves its own client secret from your Azure Key Vault via a secure reference.' },
        { title: 'Auto-discover all subscriptions', body: 'Onam enumerates all subscriptions under the management group and begins delivering findings within 5 minutes — new subscriptions are auto-discovered.' },
      ]}
      uniqueFeatures={[
        { title: 'Entra ID Conditional Access Gap Detection', body: 'Onam audits every Conditional Access policy for coverage gaps — identifying users, applications, and sign-in risk levels not protected by MFA or compliant-device requirements.' },
        { title: 'Cross-Subscription Lateral Movement Paths', body: 'Service principals and managed identities that span multiple subscriptions are mapped into attack paths, revealing how a compromised app in one subscription could pivot to production data in another.' },
        { title: 'Azure Policy Compliance Drift Tracking', body: 'Onam compares your Azure Policy initiative assignments against actual resource state, surfacing resources that have fallen out of compliance between Azure Policy evaluation cycles.' },
      ]}
      faqs={[
        { question: 'What Azure permissions does Onam need?', answer: 'Onam requires the built-in "Security Reader" role at the management group level. This grants read-only access across all subscriptions — no custom roles, no write permissions, and no access to your data plane.' },
        { question: 'Can Onam scan multiple Azure tenants?', answer: 'Yes. Onam supports multi-tenant Entra ID environments. Each tenant is connected separately via its own app registration, and findings are aggregated into a unified view across all tenants.' },
        { question: 'Does Onam support Azure Government and sovereign clouds?', answer: 'Yes. Onam supports Azure Government (US Gov Virginia / US Gov Arizona) and can be configured for Azure China via the appropriate Entra ID endpoints and ARM environments.' },
        { question: 'How does Onam handle new subscriptions added after initial setup?', answer: 'Onam automatically discovers new subscriptions under the connected management group — no re-configuration required. New subscriptions are included in the next scheduled scan cycle.' },
        { question: 'Which Azure compliance frameworks are mapped out of the box?', answer: 'Onam maps Azure findings to CIS Microsoft Azure Foundations Benchmark, ISO 27001:2022, NIST 800-53 Rev 5, GDPR, and SOC 2 Type II — with each finding linked to the specific control it affects.' },
      ]}
    />
  )
}
