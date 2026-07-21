export interface BlogPost {
  slug: string
  title: string
  description: string
  tag: string
  date: string
  readMin: number
  author: string
  authorTitle: string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'attack-paths-vs-misconfigurations',
    title: 'Attack Paths vs. Misconfigurations: Why Toxic Combinations Are Your Real Cloud Risk',
    description: 'Most CSPM tools surface hundreds of misconfigurations. The ones that actually lead to breaches are the ones that chain together — and most tools cannot show you which chains are dangerous.',
    tag: 'Attack Path',
    date: '2026-06-20',
    readMin: 11,
    author: 'Onam Security Team',
    authorTitle: 'Cloud Security Research',
  },
  {
    slug: 'fair-model-cloud-risk-quantification',
    title: 'The FAIR Model for Cloud Security: Putting a Dollar Value on Your Attack Surface',
    description: 'CVSS scores rank vulnerability severity. FAIR answers the question your board actually cares about: what does this attack surface cost if it is breached? Here is how we apply it at Onam.',
    tag: 'Risk',
    date: '2026-06-15',
    readMin: 9,
    author: 'Onam Security Team',
    authorTitle: 'Cloud Security Research',
  },
  {
    slug: 'cdr-behavioral-threat-detection',
    title: 'Beyond GuardDuty: How Three-Tier Behavioral Detection Catches What Rules Miss',
    description: 'Rule-based detection catches known attack signatures. Statistical behavioral baselines catch incremental privilege escalation. ML anomaly detection catches the rest. Here is why you need all three.',
    tag: 'CDR',
    date: '2026-06-10',
    readMin: 10,
    author: 'Onam Security Team',
    authorTitle: 'Cloud Security Research',
  },
  {
    slug: 'ai-powered-cloud-remediation',
    title: 'AI-Powered Cloud Security Remediation: From Finding to Fix in Minutes',
    description: 'The average MTTR for cloud security findings is 47 days. AI-powered remediation — context-aware code fixes, Ansible playbooks for CVEs, and threat narratives — is how we close that gap.',
    tag: 'Engineering',
    date: '2026-06-05',
    readMin: 8,
    author: 'Onam Engineering Team',
    authorTitle: 'Platform Engineering',
  },
  {
    slug: 'why-cloud-iam-permissions-are-never-used',
    title: 'Why 90% of Cloud IAM Permissions Are Never Used — and Why That Matters',
    description: 'Your IAM policies are accumulating unused permissions faster than your team can audit them. Here is what the data shows and how to close the gap.',
    tag: 'CIEM',
    date: '2026-05-07',
    readMin: 8,
    author: 'Onam Security Team',
    authorTitle: 'Cloud Security Research',
  },
  {
    slug: 'mitre-attack-cloud-mapping',
    title: 'MITRE ATT&CK for Cloud: Mapping Real Attacks to Your Posture Score',
    description: 'How MITRE ATT&CK for Cloud translates abstract threat techniques into concrete cloud misconfigurations — and how your posture score tracks each one.',
    tag: 'Threat Detection',
    date: '2026-05-04',
    readMin: 10,
    author: 'Onam Security Team',
    authorTitle: 'Cloud Security Research',
  },
  {
    slug: 'agentless-cloud-security-architecture',
    title: 'How We Check 10,000+ Rules Without Agents: The Architecture Behind Onam',
    description: 'A technical deep-dive into how Onam scans 40+ cloud services across 7 CSPs using only read-only IAM roles — no agents, no network changes, no configuration drift. Now covering 10,000+ rules across all major frameworks.',
    tag: 'Engineering',
    date: '2026-04-28',
    readMin: 12,
    author: 'Onam Engineering Team',
    authorTitle: 'Platform Engineering',
  },
]

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug)
}
