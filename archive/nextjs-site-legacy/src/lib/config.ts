export const PLATFORM_URL =
  process.env.NEXT_PUBLIC_PLATFORM_URL ?? 'https://app.onam.cloud'

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://d1ztjb6za8.execute-api.ap-south-1.amazonaws.com/prod'

export const SITE_URL = 'https://onam.security'

export const STATS = {
  rules:        '10,000+',
  clouds:       '7',
  frameworks:   '13',
  services:     '200+',
  scanTime:     '< 5 min',
  technologies: '34',
  engines:      '16+',
}

export const CLOUD_PROVIDERS = [
  { name: 'Amazon Web Services', short: 'AWS',      logo: '/logos/aws.svg',      href: '/solutions/aws'      },
  { name: 'Microsoft Azure',     short: 'Azure',    logo: '/logos/azure.svg',    href: '/solutions/azure'    },
  { name: 'Google Cloud',        short: 'GCP',      logo: '/logos/gcp.svg',      href: '/solutions/gcp'      },
  { name: 'Oracle Cloud',        short: 'OCI',      logo: '/logos/oci.svg',      href: '/solutions/oci'      },
  { name: 'Alibaba Cloud',       short: 'AliCloud', logo: '/logos/alicloud.svg', href: '/solutions/alicloud' },
  { name: 'IBM Cloud',           short: 'IBM',      logo: '/logos/ibm.svg',      href: '/solutions/ibm'      },
  { name: 'Kubernetes',          short: 'K8s',      logo: '/logos/k8s.svg',      href: '/solutions/kubernetes'},
]

export const COMPLIANCE_FRAMEWORKS = [
  { name: 'CIS AWS v2',   category: 'Benchmark'  },
  { name: 'CIS Azure',    category: 'Benchmark'  },
  { name: 'CIS GCP',      category: 'Benchmark'  },
  { name: 'NIST 800-53',  category: 'Regulation' },
  { name: 'ISO 27001',    category: 'Standard'   },
  { name: 'PCI-DSS v4',   category: 'Regulation' },
  { name: 'HIPAA',        category: 'Regulation' },
  { name: 'GDPR',         category: 'Regulation' },
  { name: 'SOC 2',        category: 'Standard'   },
  { name: 'FedRAMP',      category: 'Regulation' },
  { name: 'CIS K8s',      category: 'Benchmark'  },
  { name: 'MITRE ATT&CK', category: 'Framework'  },
  { name: 'CSA CCM v4',   category: 'Standard'   },
]
