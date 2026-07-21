# Network Security

The platform analyzes cloud network topology across **seven layers** — from VPC isolation at the top to flow-log monitoring at the bottom — to identify exposure paths, misconfigured firewall rules, and unprotected internet-facing resources. The output is a prioritized list of *effectively exposed* resources, not just a static dump of "ports open in security groups". A port that's open in a security group but unreachable through other layers is a low-priority finding; a port that's reachable through every layer is a critical finding.

<img src="/diagrams/network-security.svg" style="width:100%;max-width:920px;border-radius:10px;" alt="7-layer network security analysis" />

**Why network security in 2026 needs more than a security-group scanner:** every modern cloud has 5–10 overlapping network controls (VPC peering, transit gateways, route tables, NACLs, security groups, load balancers, WAFs, flow logs). A single layer in isolation tells you almost nothing about real risk. The platform reasons across all seven layers per scan and surfaces only what is *actually* exploitable.

---

## 7-Layer Analysis Model

The platform decomposes cloud network security into **seven layers**, evaluated top-to-bottom on every scan. Each layer asks a different question; together they answer the only question that matters: **"can the internet actually reach this resource, and if so, with what protection?"**

| Layer | Name | Question it answers |
|---|---|---|
| **L1** | Network Isolation | Are environments (prod / dev / shared services) properly segmented at the VPC and account level? |
| **L2** | Network Reachability | What can reach what — across route tables, NAT, public/private subnet markings? |
| **L3** | Network ACLs | Do subnet-level stateless rules permit or block the traffic? |
| **L4** | Security Groups | Do instance-level stateful rules permit traffic on the requested port? |
| **L5** | Load Balancer Security | If an LB sits in front, does it terminate TLS correctly and only on accepted versions? |
| **L6** | WAF Protection | Is application-layer filtering attached to internet-facing resources? |
| **L7** | Network Monitoring | Is there log visibility into the traffic that did pass through? |

**Why seven and not three?** Older CSPM tools only check L4 (security groups). That misses the most common misconfiguration patterns — over-broad transit gateways (L1), orphaned route tables (L2), default NACLs (L3), TLS 1.0 still accepted on a public ALB (L5), missing WAF on a CloudFront distribution (L6), and disabled VPC Flow Logs (L7). The platform looks at all of them.

---

## Effective Exposure

The platform's signature network capability is **effective-exposure analysis**. Instead of treating "port open in security group" as a finding, it traces the full path the internet would have to take to reach the resource — and only flags the resource as exposed if **every gate on the path permits the traffic**.

<img src="/diagrams/feat-network-effective-exposure.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="Effective exposure — 6 gates between the internet and your resource, all must permit traffic for the resource to be effectively exposed" />

**Reading the chain left to right — the six gates:**

1. **Internet** — the source of every untrusted attacker. The starting state of the analysis.
2. **Gate 1 — Internet Gateway** — does the VPC even have an IGW attached? No IGW = no path. (For Azure this is a public IP / Front Door check; for GCP it's an external IP / Cloud NAT check.)
3. **Gate 2 — Route Table** — is there a route to `0.0.0.0/0` pointing at the IGW from the relevant subnet? Without this route, traffic cannot leave or enter via the IGW.
4. **Gate 3 — Subnet Type** — is the subnet "public" (associated with a route table that has the IGW route)? Resources in private subnets are not directly reachable from the internet even if their security group allows it.
5. **Gate 4 — Network ACL** — does the subnet's NACL permit inbound on the requested port? NACLs are stateless and apply at the subnet boundary.
6. **Gate 5 — Security Group** — does the instance's SG inbound rule permit traffic from `0.0.0.0/0` on the port? This is what most tools check; the platform checks it last.

**The result:** if all six gates permit the path, the resource is **effectively exposed** and the finding is CRITICAL. If any gate blocks the path, the platform records the finding as low priority — the policy text is still suboptimal but the actual risk is contained.

**Why this matters in practice:**

- **Alert fatigue goes down.** A typical large AWS account has hundreds of security groups with `0.0.0.0/0` rules — most are on instances in private subnets with no IGW path. Old tools alert on all of them; effective-exposure analysis correctly ranks only the truly reachable ones as critical.
- **Triage gets faster.** Each effectively-exposed finding shows the full path with the specific permit at each gate. You see exactly what to change to break the chain.
- **You spend remediation time on what attackers actually use.** The 1–5% of `0.0.0.0/0` security group rules that combine with a public-subnet IGW path are responsible for almost every documented cloud breach involving open ports.

<img src="/diagrams/p-network.svg" style="width:auto;max-width:100%;display:block;margin-left:auto;margin-right:auto;border-radius:10px;margin-bottom:16px;" alt="Onam CSPM — Network security platform view showing 7-layer topology analysis, exposure paths, and firewall findings dashboard" />

---

## Layer-by-Layer Coverage

Every scan evaluates all seven layers for every cloud account in scope. The checks below are the catalog the platform applies — they are framework-mapped (CIS, NIST, PCI, SOC 2) and update with rule catalog versions.

### Layer 1 — Network Isolation

Asks: are environments properly segmented at the VPC, transit gateway, and account level? Most lateral-movement attack paths trace back to a Layer 1 gap.

| Check | What the platform evaluates |
|---|---|
| VPC / VCN peer connectivity | Are production and dev VPCs peered without restrictive routing? |
| Transit Gateway routes | Does the TGW route table allow unrestricted cross-account traffic? |
| VPC sharing | Are shared VPCs granting broader access than the consumer needs? |
| Default VPC usage | Is the default VPC (no security controls by default) in use for production resources? |
| PrivateLink vs public endpoints | Are AWS services accessed via PrivateLink (private) or via the public service endpoint? |

### Layer 2 — Network Reachability

Asks: what can reach what — through route tables, NAT, and subnet types? L2 is where "I thought this was private" findings live.

| Check | What the platform evaluates |
|---|---|
| Public subnet identification | Subnets with both an IGW route AND public-IP allocation = effective internet exposure |
| NAT Gateway placement | Is NAT outbound-only (correct) or also providing inbound paths (misconfigured)? |
| Route table anomalies | Routes to unexpected destinations (`0.0.0.0/0` in subnets you intended to be private) |
| VPC Endpoints | Are S3 / DynamoDB accessed via VPC Endpoints (private) or via the public service endpoint? |

### Layer 3 — Network ACLs

Asks: do stateless subnet-boundary rules permit or block the traffic? NACLs and security groups don't always agree — when they conflict, NACL wins for matching traffic.

| Check | What the platform evaluates |
|---|---|
| Inbound rules allowing all traffic | `0.0.0.0/0` allow on any port in NACL inbound rules |
| Outbound unrestricted | Outbound `0.0.0.0/0` allows data exfiltration even if inbound is blocked |
| Default NACL in use | Default NACLs allow all traffic — production should use custom NACLs with explicit rules |
| Conflicting NACL / SG rules | NACLs are stateless, SGs are stateful — misalignment causes both false-positive and false-negative findings if treated separately |

### Layer 4 — Security Groups

The most-cited layer in cloud-breach post-mortems. The platform's findings split into two severity bands.

<img src="/diagrams/feat-network-sg-findings.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="Security Group findings — Critical (open to 0.0.0.0/0) and High (overly broad rules)" />

**Critical findings — inbound open to `0.0.0.0/0` (the internet):**

| Finding | Why it's critical | Recommended fix |
|---|---|---|
| **SSH — Port 22** | Direct shell access to Linux instances. Brute-force target. | Use AWS Session Manager / GCP IAP / Azure Bastion, OR a dedicated bastion host with VPN-only ingress |
| **RDP — Port 3389** | Windows remote desktop. BlueKeep + ransomware target. | Restrict to VPN CIDRs only or use a jump host |
| **Database ports** (3306 MySQL · 5432 Postgres · 1433 MSSQL · 27017 Mongo) | Direct data exfiltration path | Databases should never be internet-reachable — use private subnets + VPC Endpoint patterns |
| **Cache / KV stores** (6379 Redis · 11211 Memcached) | Default no-auth makes these especially dangerous · session theft + RCE risk | Restrict to application security groups only |
| **Kubernetes** (6443 API · 10250 kubelet) | Cluster takeover | Use private clusters or authorized-networks lists |

**High findings — overly broad inbound or orphaned rules:**

| Finding | Why it's a problem | Recommended fix |
|---|---|---|
| **Admin / management ports** (8080 · 8443 · 9090 open to large CIDR) | Often dashboard / metric endpoints with weak auth | Restrict to specific source IPs / SGs |
| **All TCP / UDP allowed inbound** | Equivalent to "no firewall" for that source CIDR | Specify ports explicitly; remove the catch-all rule |
| **Orphaned security group** | SG with rules but no resources attached — risk of accidental future attachment with stale rules | Delete or document the intended purpose |

### Layer 5 — Load Balancer Security

Asks: if a load balancer terminates TLS, does it do it correctly?

| Check | What the platform evaluates |
|---|---|
| HTTP listener on internet-facing LB | Missing HTTPS redirect (allowing plaintext on a public endpoint) |
| TLS version | TLS 1.0 / 1.1 still accepted — only TLS 1.2+ should be allowed; TLS 1.3 preferred |
| SSL policy | Outdated SSL policies with weak cipher suites (RC4, 3DES, etc.) |
| Access logging disabled | No request-level audit trail — can't reconstruct who hit what endpoint |
| Health check over HTTP | Health check using plaintext on an HTTPS application — leaks structure of the app |

### Layer 6 — WAF Protection

Asks: is application-layer filtering attached to internet-facing resources? Network firewalls block by IP and port; WAFs block by request content (SQL injection, XSS, OWASP Top 10).

| Check | What the platform evaluates |
|---|---|
| Internet-facing ALB without WAF | Application Load Balancer with no WAF attached |
| CloudFront without WAF | CDN distribution serving app traffic without WAF |
| API Gateway without WAF | REST / HTTP API exposed without WAF |
| WAF rule sets | OWASP Core Rule Set missing, rate limiting missing |
| WAF in COUNT mode | WAF deployed in detection-only mode, not blocking |

### Layer 7 — Network Monitoring

Asks: is there log visibility into the traffic that did pass through? Without flow logs you can't investigate a breach after the fact.

| Check | What the platform evaluates |
|---|---|
| VPC Flow Logs disabled | No traffic visibility for the VPC — investigation impossible |
| Flow logs not sent to centralized store | Logs stuck in CloudWatch instead of shipped to SIEM / S3 / data lake |
| DNS query logging disabled | Route 53 resolver query logging not enabled — DNS-based exfiltration invisible |
| WAF logging disabled | WAF blocking decisions not logged — cannot tune rules |
| Network Firewall logging | AWS Network Firewall log settings missing or partial |

---

## Supported Cloud Providers

The 7-layer model applies across every supported cloud, though some layers have CSP-specific service mappings (e.g. Azure NSG plays the role of AWS Security Groups, GCP firewall rules play both NACL and SG roles).

| Provider | L1 | L2 | L3 | L4 | L5 | L6 | L7 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| AWS | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Azure | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GCP | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| OCI | ✅ | ✅ | ✅ | ✅ | ✅ | Partial | ✅ |
| AliCloud | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Partial |
| IBM Cloud | ✅ | ✅ | ✅ | ✅ | ✅ | Partial | Partial |

**Partial = key controls covered, not 100% of the layer's scope.** Specifically, OCI's WAF coverage is partial because OCI's native WAF service is newer and has fewer rule sets to audit; IBM's L7 monitoring is partial because flow log integration is being migrated as IBM Cloud retires its older monitoring service.

---

## Key Findings to Prioritize

The ten most-encountered network security findings, with default severities. You can re-grade in **Settings → Network Security → Severity Policy**.

| Finding | Severity | Layer | Why it matters |
|---|---|:---:|---|
| SSH open to internet on production instance | CRITICAL | L4 | Brute-force target with full shell on success |
| Database port open to `0.0.0.0/0` | CRITICAL | L4 | Direct data-exfiltration path |
| Internet-facing application with no WAF | HIGH | L6 | OWASP Top 10 unblocked |
| VPC Flow Logs disabled | HIGH | L7 | No forensic capability after a breach |
| HTTP-only load balancer (no TLS) | HIGH | L5 | Plaintext credentials and sessions |
| TLS 1.0 / 1.1 accepted on public endpoint | HIGH | L5 | Known-broken cipher suites |
| Default VPC in use with resources | MEDIUM | L1 | No customized network controls |
| Default NACL in use (allows all) | MEDIUM | L3 | Subnet boundary not enforced |
| Outbound unrestricted in NACL | MEDIUM | L3 | Data exfiltration path open |
| Orphaned security group | LOW | L4 | Latent risk of future accidental attachment |

Every finding includes the affected resource, the full effective-exposure path (where applicable), the suggested fix, and the framework controls it satisfies.

---

## API

The Network Security API is part of the unified platform API. All endpoints require an authenticated session and are scoped to your tenant.

```http
# List network security findings
GET /gateway/api/v1/network-security/findings?severity=CRITICAL

# Get findings for a specific VPC
GET /gateway/api/v1/network-security/findings?resource_uid=vpc-12345678

# Get the effective-exposure path for a specific resource
GET /gateway/api/v1/network-security/exposure-path?resource_uid={uid}

# Network topology summary (rolled-up per layer)
GET /gateway/api/v1/views/network
```

Full request / response schemas in the [API Reference](/docs/reference/api-reference/). Webhook delivery on new CRITICAL network findings can be configured under **Settings → Notifications**.

---

## Frequently Asked Questions

**How does effective-exposure analysis differ from a port scan?**
A port scan sees only what's reachable from where the scanner sits. Effective-exposure analysis evaluates the *configuration* of every network gate to determine reachability without sending any traffic. The platform never scans your environment from outside — analysis is purely configuration-based, agentless, and read-only.

**Can a finding be both CRITICAL and not actually exploitable?**
No — that's exactly what effective-exposure analysis prevents. A security-group rule open to the internet on a private-subnet instance with no IGW route is graded *low priority*, not critical. Severity reflects actual reachability.

**Does the platform support custom severity grading?**
Yes. Per finding type, you can adjust severity in **Settings → Network Security → Severity Policy**. Re-grades apply to all future scans and recompute existing finding rollups overnight.

**Does the platform check IPv6 paths?**
Yes. IPv6 routes, IPv6 security group rules, and IPv6 NACL entries are evaluated alongside IPv4. A common finding is "IPv4 properly restricted but IPv6 open" — the platform flags both.

**What about Network Firewall and Azure Firewall?**
Supported on AWS and Azure. The platform evaluates rule groups, stateful vs stateless policy, log delivery, and rule-order anomalies (deny rules placed below allow rules that would never be reached).

**Can I export the topology for offline analysis?**
Yes. The full topology graph (VPCs, subnets, route tables, peerings, transit gateways, security groups, load balancers, WAFs) exports as JSON or GraphML for use in your own visualization tools.

---

*Last updated: 2026-05-09*
*For questions: support@onam.io*
