import type { Metadata } from 'next'
import { Box } from 'lucide-react'
import { ProductPageTemplate } from '@/components/platform/ProductPageTemplate'

export const metadata: Metadata = { title: 'Container Security', description: 'EKS, ECS, and Kubernetes security — image scanning, RBAC analysis, network policies, and CIS benchmarks.' }

export default function ContainerSecurityPage() {
  return (
    <ProductPageTemplate
      icon={Box}
      iconColor="text-blue-400"
      iconBg="bg-blue-500/10"
      label="Container Security"
      question="Are my Kubernetes clusters and containers configured safely?"
      headline="Containers move fast. Misconfigurations move faster."
      sub="Container security covers your full container estate: image vulnerabilities, Kubernetes RBAC, network policies, pod security standards, and cluster CIS benchmarks — across EKS, ECS, and self-managed clusters."
      painPoint="Kubernetes makes it easy to run hundreds of workloads. It also makes it easy to accidentally run a privileged container, expose a dashboard service, or create an overpermissioned service account that can do things across your entire cluster. Container environments have a unique attack surface — and it's different from traditional cloud infrastructure."
      mechanism="The container security engine checks images at the registry level and in running workloads, identifies outdated base images and known CVEs, and analyses your Kubernetes configuration against CIS Kubernetes and EKS benchmarks. It maps service account permissions to RBAC policies, identifies pods running with excessive privileges, and checks whether network policies are enforced between namespaces. All findings are linked back to the relevant workload, namespace, and cluster."
      whatYouGet={[
        'Image vulnerability scanning: CVEs in base images and application layers',
        'Kubernetes CIS benchmark: cluster, node, and RBAC configuration checks',
        'Service account privilege analysis: which accounts have cluster-admin or excessive rights',
        'Pod security analysis: privileged containers, host path mounts, root users',
        'Network policy coverage: namespaces without ingress/egress restrictions',
        'Registry security: image pull policies, unsigned images, image age',
        'ECS task definition security: privileged tasks, secret exposure, logging config',
        'Runtime anomaly indicators: containers making unusual API calls or network connections',
      ]}
      diagram={<img src="/diagrams/p-container.svg" style={{ width: '100%' }} alt="Container and Kubernetes security" />}
      faqs={[
        {
          question: 'Which Kubernetes distributions are supported?',
          answer: 'EKS (AWS), AKS (Azure), GKE (GCP), and self-managed Kubernetes clusters via kubeconfig. OCI OKE support is on the roadmap. For ECS, Fargate and EC2 launch types are both covered.',
        },
        {
          question: 'Do I need to install anything inside my Kubernetes clusters?',
          answer: 'No agent is required for configuration and posture checks — the engine reads from the Kubernetes API server and your container registries using your existing credentials. For runtime anomaly detection (unusual process execution, unusual network connections), an optional lightweight eBPF sensor is available as a separate deployment.',
        },
        {
          question: 'What does the CIS Kubernetes Benchmark cover?',
          answer: 'CIS Kubernetes benchmarks cover control plane configuration (API server flags, etcd security, scheduler settings), node hardening (kubelet configuration, filesystem permissions), RBAC (service account scoping, cluster-admin usage), pod security (privileged containers, host path mounts), network policy enforcement, secrets management, and audit logging. All accessible controls are checked via the API.',
        },
        {
          question: 'How does container image scanning work?',
          answer: 'We pull image manifests from your registries (ECR, ACR, GCR, Docker Hub) and perform SBOM-based CVE matching using the package layer metadata. Image contents are not pulled — only the manifest and layer metadata are accessed. CVEs are matched against the NVD and vendor advisories, then enriched with EPSS and KEV data.',
        },
      ]}
      relatedHrefs={[
        { label: 'Vulnerability Management', href: '/platform/vulnerability'    },
        { label: 'Network Security',         href: '/platform/network-security' },
        { label: 'CSPM',                     href: '/platform/cspm'             },
      ]}
    />
  )
}
