import Link from 'next/link'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ArrowRight, ShieldCheck, Users, Crosshair, Network, Database, Bug, Box, Cpu, CheckSquare, Layers, GitBranch, Activity, TrendingUp, Terminal, Radar } from 'lucide-react'

const clusters = [
  {
    label: 'Posture & Configuration',
    sub: 'Know what\'s misconfigured, exposed, or drifting before an attacker does.',
    pillars: [
      {
        icon: ShieldCheck, label: 'CSPM', color: 'text-brand-500', bg: 'bg-brand-50', border: 'border-brand-100',
        href: '/platform/cspm',
        question: 'Are my cloud configs secure?',
        body: 'Checks 1,918 posture rules continuously across every resource in all 7 clouds. No manual audits, no waiting for a quarterly scan.',
        stat: '1,918 posture rules',
      },
      {
        icon: Network, label: 'Network Security', color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-100',
        href: '/platform/network-security',
        question: 'What\'s actually reachable from the internet?',
        body: 'Analyses all 7 layers — VPC isolation, route tables, NACLs, security groups, load balancers, WAF, and logging gaps.',
        stat: '7-layer topology analysis',
      },
      {
        icon: Database, label: 'Data Security', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100',
        href: '/platform/data-security',
        question: 'Where is your sensitive data, and who can reach it?',
        body: 'Classifies data across S3, RDS, DynamoDB, Blob Storage and more. Shows every identity with a path to your PII across 62 data security rules.',
        stat: '62 data security rules · 7 domains',
      },
    ],
  },
  {
    label: 'Identity & Entitlement',
    sub: 'Surface every overprivileged identity and close the gap between what\'s granted and what\'s needed.',
    pillars: [
      {
        icon: Users, label: 'CIEM', color: 'text-cyan-500', bg: 'bg-cyan-50', border: 'border-cyan-100',
        href: '/platform/ciem',
        question: 'Who can access what — and should they?',
        body: '80% of cloud permissions are never used. We score every identity\'s least-privilege gap, track behavioral anomalies across CloudTrail, and show exact blast radius.',
        stat: 'Least-privilege scoring · Behavioral CIEM',
      },
      {
        icon: Radar, label: 'IAM Security', color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100',
        href: '/platform/iam',
        question: 'Are your IAM policies actually enforcing least privilege?',
        body: 'Deep-dives 57 IAM rules across 6 modules — policy statements, cross-account trust, federation risk, unused credentials, and service control policies.',
        stat: '57 IAM rules · 6 modules',
      },
    ],
  },
  {
    label: 'Threat, Attack Path & Risk',
    sub: 'Connect misconfigurations, identity paths, and CVEs into the attack chains that actually matter — with dollar-value impact.',
    pillars: [
      {
        icon: GitBranch, label: 'Attack Path Analysis', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100',
        href: '/platform/attack-path',
        question: 'Which misconfiguration chains lead to crown jewel compromise?',
        body: 'Builds a security graph from all posture and identity data. Identifies toxic combinations — pairs of issues that together create critical blast radius — and visualizes every path to your crown jewels.',
        stat: 'MITRE ATT&CK · Crown jewels · Toxic combos',
      },
      {
        icon: Activity, label: 'CDR — Detection', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100',
        href: '/platform/cdr',
        question: 'Is something happening in my cloud right now?',
        body: 'Three-tier behavioral detection (L1 rule-based, L2 statistical, L3 ML) over CloudTrail, VPC Flow Logs, and K8s audit logs. Real-time alerts mapped to MITRE ATT&CK techniques.',
        stat: 'L1/L2/L3 behavioral detection · Real-time',
      },
      {
        icon: TrendingUp, label: 'Risk Quantification', color: 'text-pink-500', bg: 'bg-pink-50', border: 'border-pink-100',
        href: '/platform/risk',
        question: 'What is this attack surface actually worth to an attacker?',
        body: 'FAIR model financial risk quantification. Every finding gets a dollar-denominated exposure estimate and regulatory fine projection — so you can prioritize by business impact, not just CVSS score.',
        stat: 'FAIR model · Dollar-value exposure · Blast radius',
      },
      {
        icon: Crosshair, label: 'Threat Detection', color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100',
        href: '/platform/threat-detection',
        question: 'What MITRE technique is being used against my environment?',
        body: 'Maps every suspicious event to MITRE ATT&CK for Cloud — from unusual role assumptions and API call anomalies to data exfiltration indicators and lateral movement patterns.',
        stat: 'MITRE ATT&CK for Cloud · All 7 CSPs',
      },
    ],
  },
  {
    label: 'Workloads, Code & Vulnerabilities',
    sub: 'Secure every workload type — from containerized microservices to Lambda functions to your code repository.',
    pillars: [
      {
        icon: Bug, label: 'Vulnerability Management', color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-100',
        href: '/platform/vulnerability',
        question: 'Which CVEs actually matter in my environment?',
        body: 'Correlates CVEs with network topology, EPSS exploit probability, and KEV active exploitation status. A 9.8 CVSS means nothing if the service isn\'t reachable.',
        stat: 'EPSS · KEV · Reachability-aware scoring',
      },
      {
        icon: Box, label: 'Container Security', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100',
        href: '/platform/container-security',
        question: 'Are my containers and Kubernetes clusters safe?',
        body: 'Checks image vulnerabilities, K8s RBAC, network policies, pod security, and CIS benchmarks across EKS, ECS, ECR, and self-managed clusters.',
        stat: 'EKS · ECS · ECR · K8s RBAC',
      },
      {
        icon: Terminal, label: 'Code Security (SecOps)', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200',
        href: '/platform/secops',
        question: 'Is the code your team is shipping introducing risk?',
        body: 'SAST, DAST, SCA, and IaC scanning across 14 languages with 2,852 rules. SBOM generation, EPSS enrichment, and AI-powered fix suggestions for every finding.',
        stat: '2,852 rules · 14 languages · 479 DAST payloads',
      },
      {
        icon: Cpu, label: 'AI Security', color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-100',
        href: '/platform/ai-security',
        question: 'Are your AI workloads introducing new risks?',
        body: 'Covers SageMaker, Bedrock, and ML pipeline security — model access controls, training data exposure, inference endpoint posture, and prompt injection risk vectors.',
        stat: 'SageMaker · Bedrock · ML pipelines',
      },
    ],
  },
  {
    label: 'Governance, Compliance & Discovery',
    sub: 'Continuous evidence collection across 13 frameworks plus full runtime technology inventory.',
    pillars: [
      {
        icon: CheckSquare, label: 'Compliance', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100',
        href: '/platform/compliance',
        question: 'Am I ready for my next audit?',
        body: 'Maps every finding to CIS, NIST, ISO 27001, PCI-DSS, HIPAA, GDPR, SOC 2, FedRAMP, and 5 more. One click to the evidence report — always fresh, never stale.',
        stat: '13 compliance frameworks',
      },
      {
        icon: Layers, label: 'Technology Engine', color: 'text-teal-500', bg: 'bg-teal-50', border: 'border-teal-200',
        href: '/platform/technology',
        question: 'What\'s actually deployed across my entire fleet?',
        body: 'Discovers shadow IT, forgotten services, and unpatched runtimes — databases, frameworks, OS versions, libraries — across your full environment. 5,025 detection rules across 34 technologies.',
        stat: '5,025 rules · 34 technologies · Runtime discovery',
      },
    ],
  },
]

export function PlatformPillars() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          question="What does Onam cover?"
          headline="Every angle your cloud is exposed from."
          sub="Posture, identity, threat, data, and compliance — connected into one platform. Here is what each domain checks and why it matters."
          theme="light"
          className="mb-16"
        />

        <div className="space-y-14">
          {clusters.map(cluster => (
            <div key={cluster.label}>
              {/* Cluster header */}
              <div className="mb-6 pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500 mb-1">
                    {cluster.label}
                  </h3>
                  <p className="text-sm font-medium text-slate-600 leading-snug max-w-xl">{cluster.sub}</p>
                </div>
                <span className="text-xs text-slate-500 shrink-0">
                  {cluster.pillars.length} {cluster.pillars.length === 1 ? 'engine' : 'engines'}
                </span>
              </div>

              {/* Pillar cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {cluster.pillars.map(p => {
                  const Icon = p.icon
                  return (
                    <Link key={p.label} href={p.href}
                      className="group block rounded-2xl border border-slate-200 bg-white p-6 hover:border-slate-300 hover:shadow-md transition-all"
                      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                    >
                      <div className="flex items-start justify-between mb-5">
                        <div className={`w-10 h-10 rounded-xl ${p.bg} border ${p.border} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 ${p.color}`} />
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all mt-1" />
                      </div>
                      <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">{p.label}</div>
                      <div className="text-sm font-bold text-slate-900 mb-2.5 leading-snug">{p.question}</div>
                      <p className="text-sm text-slate-600 leading-relaxed mb-4">{p.body}</p>
                      <div className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${p.color} bg-slate-50 border border-slate-100 rounded-full px-2.5 py-1`}>
                        {p.stat}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
