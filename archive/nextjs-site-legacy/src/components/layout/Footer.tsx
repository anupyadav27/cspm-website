import Image from 'next/image'
import { PLATFORM_URL } from '@/lib/config'

const cols = [
  {
    heading: 'Platform',
    links: [
      { label: 'CSPM',                href: '/platform/cspm'               },
      { label: 'CIEM',                href: '/platform/ciem'               },
      { label: 'IAM Security',        href: '/platform/iam'                },
      { label: 'Attack Path',         href: '/platform/attack-path'        },
      { label: 'Threat Detection',    href: '/platform/threat-detection'   },
      { label: 'CDR — Detection',     href: '/platform/cdr'                },
      { label: 'Network Security',    href: '/platform/network-security'   },
      { label: 'Data Security',       href: '/platform/data-security'      },
      { label: 'Risk Quantification', href: '/platform/risk'               },
      { label: 'Vulnerability Mgmt',  href: '/platform/vulnerability'      },
      { label: 'Container Security',  href: '/platform/container-security' },
      { label: 'AI Security',         href: '/platform/ai-security'        },
      { label: 'Code Security',       href: '/platform/secops'             },
      { label: 'Compliance',          href: '/platform/compliance'         },
    ],
  },
  {
    heading: 'By Cloud',
    links: [
      { label: 'Amazon Web Services', href: '/solutions/aws'        },
      { label: 'Microsoft Azure',     href: '/solutions/azure'      },
      { label: 'Google Cloud',        href: '/solutions/gcp'        },
      { label: 'Oracle Cloud (OCI)',   href: '/solutions/oci'        },
      { label: 'Alibaba Cloud',       href: '/solutions/alicloud'   },
      { label: 'IBM Cloud',           href: '/solutions/ibm'        },
      { label: 'Kubernetes / EKS',    href: '/solutions/kubernetes' },
    ],
  },
  {
    heading: 'By Industry',
    links: [
      { label: 'Financial Services',  href: '/solutions/financial'  },
      { label: 'Healthcare',          href: '/solutions/healthcare' },
      { label: 'Government',          href: '/solutions/government' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Documentation',    href: '/docs'                         },
      { label: 'Blog',             href: '/resources/blog'               },
      { label: 'All Resources',    href: '/resources'                    },
      { label: 'AWS Onboarding',   href: '/docs/onboarding/aws'          },
      { label: 'Azure Onboarding', href: '/docs/onboarding/azure'        },
      { label: 'GCP Onboarding',   href: '/docs/onboarding/gcp'          },
      { label: 'API Reference',    href: '/docs/reference/api-reference'  },
      { label: 'RBAC & SSO',       href: '/docs/reference/rbac-and-sso'  },
      { label: 'Release Notes',    href: '/docs/release-notes'           },
    ],
  },
]

const companyLinks = [
  { label: 'About Onam',         href: '/company'                },
  { label: 'Careers',            href: '/company/careers'        },
  { label: 'Contact us',         href: '/company/contact'        },
  { label: 'Security',           href: '/company/security'       },
  { label: 'Pricing',            href: '/pricing'                },
  { label: 'Request a demo',     href: '/request-demo'           },
  { label: 'Platform status',    href: 'https://status.onam.security', newTab: true },
  { label: 'Log in to platform', href: PLATFORM_URL, newTab: true },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy'                  },
  { label: 'Terms of Use',   href: '/terms'                    },
  { label: 'Trust Center',   href: '/docs/trust/trust-center'  },
  { label: 'Cookie Policy',  href: '/privacy#cookies'          },
]

// Simple inline social icons — no external dependency
function LinkedInIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function TwitterXIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-navy-600 bg-navy-900 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Main grid: brand + 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="inline-block mb-4">
              <Image src="/logo.svg" alt="Onam Security" width={130} height={45} />
            </a>
            <p className="text-sm text-slate-300 leading-relaxed max-w-[200px]">
              Unified cloud security across every provider, every resource, every risk.
            </p>
            <div className="mt-4 text-xs text-slate-400">
              10,000+ rules · 16+ engines · 7 clouds · 13 frameworks
            </div>
            {/* Social links */}
            <div className="mt-5 flex items-center gap-3">
              <a href="https://linkedin.com/company/onam-security" target="_blank" rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-300 transition-colors" aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
              <a href="https://twitter.com/onamsecurity" target="_blank" rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-300 transition-colors" aria-label="X / Twitter">
                <TwitterXIcon />
              </a>
              <a href="https://github.com/onam-security" target="_blank" rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-300 transition-colors" aria-label="GitHub">
                <GitHubIcon />
              </a>
            </div>
          </div>

          {cols.map(col => (
            <div key={col.heading}>
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">{col.heading}</div>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link.label}>
                    <a href={link.href}
                      className="text-sm text-slate-300 hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Company bar */}
        <div className="border-t border-navy-600 pt-8 pb-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 mr-2">Company</span>
          {companyLinks.map(l => (
            <a
              key={l.label}
              href={l.href}
              {...('newTab' in l && l.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Legal bar */}
        <div className="border-t border-navy-600 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} Onam Security, Inc. All rights reserved.</p>
          <div className="flex gap-6 flex-wrap justify-center">
            {legalLinks.map(l => (
              <a key={l.label} href={l.href} className="text-xs text-slate-400 hover:text-slate-200 transition-colors">
                {l.label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
