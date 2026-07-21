import type { Metadata } from 'next'
import { Network } from 'lucide-react'
import { ProductPageTemplate } from '@/components/platform/ProductPageTemplate'

export const metadata: Metadata = {
  title: 'Network Security — 7-Layer Cloud Topology Analysis',
  description: 'See your real cloud attack surface. 7-layer network analysis across VPCs, NACLs, security groups, load balancers, WAF, and monitoring.',
}

export default function NetworkSecurityPage() {
  return (
    <ProductPageTemplate
      icon={Network}
      iconColor="text-csm-purple"
      iconBg="bg-csm-purple/10"
      label="Network Security"
      question="What's actually reachable from the internet in my cloud?"
      headline="Security groups are one layer. Your attack surface has seven."
      sub="Most tools tell you which security groups have port 22 open to the world. Onam traces the full 7-layer network path — from VPC isolation all the way to WAF coverage and flow log monitoring — and shows you what's actually reachable from the internet, not just what the rules say."
      painPoint="That test subnet you spun up 8 months ago? Still publicly reachable. The load balancer that forwards to internal services? The TLS policy is outdated. Your VPC has a peering connection to a partner network — but does anyone know which resources that exposes? Network security in the cloud isn't just security groups. It's the interaction between routing tables, NACLs, SGs, load balancers, WAF rules, and monitoring coverage — and you need to see all of it."
      mechanism="The network engine traces the actual path between the internet and each resource in your cloud. First it checks whether your VPCs are properly isolated from each other. Then it looks at route tables to see which subnets are truly private. It evaluates your NACL rules at the subnet boundary. Then every security group rule — flagging open access on SSH, RDP, and database ports. It checks load balancer TLS settings and whether internet-facing services have WAF protection in front of them. Finally it verifies that flow logs and network monitoring are running. The result is a plain-English 'effective exposure' verdict for every resource: reachable from the internet, or not."
      whatYouGet={[
        'Effective exposure score for every resource: what\'s actually reachable from the internet',
        'Security group audit: every overly permissive inbound rule on SSH, RDP, and database ports',
        'Subnet classification: which subnets are truly private vs. publicly accessible',
        'NACL analysis: subnet-boundary ACL gaps and misconfigurations',
        'Load balancer security: TLS version, HTTP-to-HTTPS redirect, internet-facing exposure',
        'WAF coverage map: which resources are behind WAF, which are exposed without it',
        'Flow log coverage: networks and subnets with missing traffic monitoring',
        'VPC peering and transit gateway analysis: exposure from cross-account connections',
      ]}
      diagram={<img src="/diagrams/p-network.svg" style={{ width: '100%' }} alt="7-layer network security topology" />}
      faqs={[
        {
          question: 'Does Network Security only work for AWS VPCs?',
          answer: 'Network Security supports AWS, Azure, GCP, OCI, and AliCloud. The full 7-layer model is implemented for AWS. Azure, GCP, OCI, and AliCloud cover VNet/VPC configuration, security groups, routing, and monitoring gaps. Multi-cloud coverage expands with each release.',
        },
        {
          question: "What's the difference between this and a network vulnerability scanner like Nessus?",
          answer: 'Nessus scans for CVEs on running hosts by probing open ports. Network Security analyses the network configuration path — whether a resource is reachable from the internet based on routing tables, NACLs, security groups, WAF rules, and load balancer settings. It tells you about network exposure; Vulnerability Management tells you about exploitability.',
        },
        {
          question: 'Do I need agents installed on instances to use this?',
          answer: 'No. Everything is read from cloud control-plane APIs. We analyse VPC configuration, route tables, security group rules, NAT gateways, and load balancer settings without touching your instances or installing any software.',
        },
        {
          question: "What does 'effective exposure' mean in practice?",
          answer: "Effective exposure is the answer to: 'Can an attacker on the public internet reach this resource?' It factors in every layer — is the subnet public? Does the route table have an internet gateway? Are the NACLs permissive? Is the security group open? Is there a WAF in front of it? A resource might have a permissive security group but still be unexposed because the NACL blocks the traffic. Effective exposure shows the real picture.",
        },
      ]}
      relatedHrefs={[
        { label: 'CSPM — Config rules',      href: '/platform/cspm'           },
        { label: 'Threat Detection',         href: '/platform/threat-detection'},
        { label: 'Container Security',       href: '/platform/container-security'},
      ]}
    />
  )
}
