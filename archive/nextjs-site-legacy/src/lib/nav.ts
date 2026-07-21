export interface NavItem {
  title: string
  slug: string
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const NAV: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { title: 'Introduction', slug: '' },
    ],
  },
  {
    title: 'Architecture',
    items: [
      { title: 'Platform Overview', slug: 'architecture/overview' },
    ],
  },
  {
    title: 'Compliance',
    items: [
      { title: 'Framework Coverage', slug: 'compliance/framework-coverage' },
    ],
  },
  {
    title: 'Trust & Security',
    items: [
      { title: 'Trust Center', slug: 'trust/trust-center' },
      { title: 'Data Retention Policy', slug: 'trust/data-retention' },
      { title: 'SLA & SLO Reference', slug: 'trust/sla-and-slo' },
    ],
  },
  {
    title: 'Connect Your Cloud',
    items: [
      { title: 'Amazon Web Services', slug: 'onboarding/aws' },
      { title: 'Microsoft Azure', slug: 'onboarding/azure' },
      { title: 'Google Cloud Platform', slug: 'onboarding/gcp' },
      { title: 'Oracle Cloud (OCI)', slug: 'onboarding/oci' },
      { title: 'Alibaba Cloud', slug: 'onboarding/alicloud' },
      { title: 'IBM Cloud', slug: 'onboarding/ibm' },
    ],
  },
  {
    title: 'Security Capabilities',
    items: [
      { title: 'Attack Path Analysis',        slug: 'features/attack-path'            },
      { title: 'CDR — Behavioral Detection',  slug: 'features/cdr'                    },
      { title: 'Risk Quantification (FAIR)',   slug: 'features/risk'                   },
      { title: 'Code Security (SecOps)',       slug: 'features/secops'                 },
      { title: 'Vulnerability Management',     slug: 'features/vulnerability-management' },
      { title: 'Container Security',           slug: 'features/container-security'     },
      { title: 'Identity & Entitlement (CIEM)',slug: 'features/ciem'                   },
      { title: 'Data Security (DSPM)',         slug: 'features/data-security'          },
      { title: 'Network Security',             slug: 'features/network-security'       },
      { title: 'IaC & SecOps Scanning',        slug: 'features/iac-scanning'           },
    ],
  },
  {
    title: 'Reference',
    items: [
      { title: 'API Reference', slug: 'reference/api-reference' },
      { title: 'RBAC & SSO', slug: 'reference/rbac-and-sso' },
      { title: 'Integration Catalog', slug: 'reference/integration-catalog' },
    ],
  },
  {
    title: 'Release Notes',
    items: [
      { title: 'June 2026', slug: 'release-notes/2026-06' },
      { title: 'May 2026',  slug: 'release-notes/2026-05' },
    ],
  },
]
