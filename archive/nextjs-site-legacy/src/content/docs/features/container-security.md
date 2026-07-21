# Container & Kubernetes Security

The platform evaluates the security posture of every container surface in your cloud — Kubernetes clusters (EKS, AKS, GKE, OKE, IKS, ACK, self-managed), ECS task definitions, container registries, and the running workloads on top — without installing any agent on your nodes. The output is a prioritized list of *cluster-takeover risks*, *workload misconfigurations*, *image vulnerabilities*, and *missing network controls* — mapped to CIS and NSA hardening guidance.

<img src="/diagrams/container-security.svg" style="width:100%;max-width:920px;border-radius:10px;" alt="Container and Kubernetes security" />

**Why container security in 2026 matters more than ever:** the Kubernetes attack surface is uniquely large — every cluster has a control plane, a workload plane, an image supply chain, an RBAC system, and a network policy system. A single weak default in any one of them (e.g. "no NetworkPolicy resources in the namespace") gives an attacker who compromises one pod a clear path to every other pod. The platform reasons across all five surfaces.

---

## Coverage at a Glance

The platform covers **six surfaces** across every supported Kubernetes distribution. You don't enable surfaces individually — once a cluster is connected, every applicable check runs on every scan.

| Surface | What's checked |
|---|---|
| **Kubernetes posture** | RBAC analysis · network policies · pod security standards · privileged containers · host path mounts · service-account permissions |
| **Node security** | OS vulnerability scanning · node configuration benchmarks · CIS Kubernetes benchmark compliance |
| **Workload security** | Pod-spec misconfigurations · resource limits · dangerous capability grants · read-only filesystem · non-root user enforcement |
| **Image security** | Registry image scanning · known CVEs in images · base-image age · secrets in image layers |
| **Network** | Ingress exposure · LoadBalancer service types · missing network policies · cluster-to-cluster peering |
| **Registry & supply chain** | ECR / ACR / GCR / Docker Hub / GHCR / OCIR scanning · image signing verification · unsigned images in production |

---

## Supported Platforms

The same coverage applies across every supported Kubernetes distribution. ECS (AWS-only) is also supported via task-definition analysis.

| Platform | Provider | Coverage |
|---|---|---|
| **EKS** (Elastic Kubernetes Service) | AWS | Full — RBAC, workloads, nodes, images, network |
| **AKS** (Azure Kubernetes Service) | Azure | Full — RBAC, workloads, nodes, images, network |
| **GKE** (Google Kubernetes Engine) | GCP | Full — RBAC, workloads, nodes, images, network |
| **OKE** (Oracle Kubernetes Engine) | OCI | Full — RBAC, workloads, nodes, images |
| **IKS** (IBM Kubernetes Service) | IBM | Full — RBAC, workloads, nodes, images |
| **ACK** (Alibaba Container Service) | AliCloud | Partial — RBAC, workloads |
| **ECS** (Elastic Container Service) | AWS | Task-definition security · IAM roles · network mode |
| **Self-managed K8s** | Any | Via kubeconfig connection |

---

## How the Security Check Works

Every container security scan runs in three stages: discover the cluster state, evaluate against rule catalogs, emit prioritized findings. No agents on nodes — every check uses your read-only kubeconfig or IAM-based cluster access.

<img src="/diagrams/feat-container-pipeline.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="Container security pipeline — Discovery → Evaluation → Findings, three-stage" />

**Walking through the pipeline:**

1. **Discovery.** The platform reads cluster state through the K8s API server using your read-only credential. It enumerates Pods, Deployments, Services, Roles, RoleBindings, NetworkPolicies, Namespaces, ConfigMaps (Secrets references only — never values), Nodes, and the container images running on each. In parallel, container registries (ECR / ACR / GCR / GHCR / Docker Hub / OCIR) are scanned for image inventory.
2. **Evaluation.** The platform applies three rule catalogs: **CIS Kubernetes Benchmark v1.8** (112 controls), **NSA / CISA Kubernetes Hardening Guidance** (2024 edition), and **custom rules** (YAML rules you define for org-specific policies). Rule catalogs update with platform releases.
3. **Findings.** Output is categorized into RBAC findings (over-privileged service accounts, cluster-admin bindings), workload findings (privileged pods, missing limits), network findings (no policies, exposed services), and image findings (CVEs, unsigned images). Each is severity-graded and CIS-mapped.

<img src="/diagrams/p-container.svg" style="width:auto;max-width:100%;display:block;margin-left:auto;margin-right:auto;border-radius:10px;margin-bottom:16px;" alt="Onam CSPM — Container and Kubernetes security platform view showing cluster posture, RBAC findings, and workload risk dashboard" />

---

## RBAC Analysis

Kubernetes RBAC misconfigurations are **the single most common path to cluster compromise**. The platform traces the full chain — Service Account → RoleBinding → Role → effective verbs × resources × apiGroups — and flags the dangerous patterns.

<img src="/diagrams/feat-container-rbac.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="Kubernetes RBAC analysis — service account to effective permissions chain with high-risk pattern callouts" />

**Reading the chain top-to-bottom:**

The top row shows the four-link RBAC chain: a **service account** (attached to a pod) is bound by a **RoleBinding or ClusterRoleBinding** to a **Role or ClusterRole**, which defines effective **verbs × resources × apiGroups** permissions. The platform computes the resolved effective set per service account.

The bottom rows show **the five high-risk patterns the platform flags:**

| Pattern | Default severity | Why it's dangerous |
|---|---|---|
| **`cluster-admin` to service account** | CRITICAL | Pod compromise = cluster takeover; no remediation path other than rebinding |
| **Wildcard verbs (`*`) on sensitive resources** | HIGH | `verbs: ["*"]` on `secrets` / `pods` / `clusterroles` enables secret read + arbitrary exec |
| **`exec` / `attach` in production** | HIGH | `pods/exec` or `pods/attach` permissions allow shell into running pods — bypasses image immutability |
| **Unused service accounts with broad permissions** | MEDIUM | Cluster-wide perms granted but no pod has used them in 90 days — shrink the entitlement footprint |
| **Default service account with non-default bindings** | MEDIUM | The "default" SA bound to anything beyond the default cluster role — pods inherit broader access than intended |

**Worked-example finding:**

> **CRITICAL** — ClusterRoleBinding `dev-admin` grants `cluster-admin` to service account `default/app-runner` in namespace `production`. This gives the service account full control over the cluster. **Suggested fix:** create a least-privilege ClusterRole limited to the actual permissions the app uses (90-day window), bind that, and remove the cluster-admin binding.

---

## Pod Security Standards

The platform evaluates every pod against **Kubernetes Pod Security Standards** (the official replacement for the deprecated PodSecurityPolicy). Each pod is graded against three escalating levels.

| Standard | What's required | Recommended for |
|---|---|---|
| **Privileged** | Any configuration allowed | Legacy clusters only — flagged as low risk by the platform |
| **Baseline** | No host namespaces · no privileged containers · restricted capabilities | Minimum recommended baseline for non-prod |
| **Restricted** | All Baseline rules + non-root user · read-only filesystem · dropped ALL capabilities | Production workloads |

Findings are tagged with which Pod Security level the workload violates — so you can apply the standards via your admission controller (Kyverno / OPA / native PSA) without trial-and-error.

---

## Network Policy Coverage

By default, **Kubernetes allows all pod-to-pod traffic across the cluster**. There is no firewall between pods unless you create NetworkPolicy resources. This means a single compromised pod can reach every other pod in the namespace — including databases, message queues, and admin services. The platform flags namespaces without policies and explains the impact.

<img src="/diagrams/feat-container-netpol.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="Network policy coverage — without policy (lateral movement) vs with policy (least privilege intra-cluster)" />

**The two states side by side:**

| Posture | Pod-to-pod reachability | Risk if Pod A is compromised |
|---|---|---|
| **Without NetworkPolicy (default)** | Pod A ↔ Pod B ↔ Database on any port | Attacker reaches DB on 5432, 22, 80, 6379 — anything |
| **With NetworkPolicy (desired state)** | Pod A → Pod B on 8080 only · Pod B → DB on 5432 only · Pod A → DB blocked | Blast radius contained to Pod B's exposed port |

**What the platform flags:**

- Namespaces with **zero NetworkPolicy resources** — likely never configured.
- Pods with **no matching NetworkPolicy** — policies exist but selectors miss the pod.
- **Egress unrestricted** — pods that can reach the internet without rule, often a precursor to data exfiltration paths.
- **Cluster-wide allow-all policies** — a misconfigured policy that opens up everything (sometimes added during debugging and never removed).

The fix is rarely "deny everything" — that breaks legitimate traffic. The platform helps by suggesting policy templates based on what traffic actually flows in the namespace (derived from VPC Flow Logs or service mesh telemetry where available).

---

## Image Security

Container images are scanned in two contexts — at rest in registries and at runtime in the cluster — for four classes of issues:

| Check | What's flagged |
|---|---|
| **Known CVEs** | Matched against NVD, Red Hat, Debian, Ubuntu, Alpine, GitHub Security advisories |
| **Secrets in layers** | API keys, passwords, tokens accidentally baked into image history |
| **Base image age** | Images using EOL base OS versions (e.g. Debian 9, Ubuntu 18.04, Alpine 3.12) |
| **Image signing** | Unsigned images deployed to production (Cosign / Notary v2 / sigstore verification) |

**Supported registries:**

| Registry | Provider |
|---|---|
| ECR (Elastic Container Registry) | AWS |
| ACR (Azure Container Registry) | Azure |
| GCR / Artifact Registry | GCP |
| OCIR (Oracle Container Image Registry) | OCI |
| Docker Hub | Public |
| GitHub Container Registry (GHCR) | GitHub |
| Quay | Red Hat |

**Supply-chain integration:** image signing checks integrate with sigstore / Cosign — if your CI pipeline signs images at build, the platform verifies the signature is intact at deploy time and flags the runtime if a tampered image landed.

---

## CIS Kubernetes Benchmark Coverage

The platform maps findings to the **CIS Kubernetes Benchmark v1.8** — 112 controls organized into six sections. New CIS versions are added within 60 days of CIS publication; previous versions stay available for migration.

| Section | Controls | Examples |
|---|---:|---|
| Control Plane Components | 30 | API server flags, etcd config, scheduler settings |
| etcd | 7 | Data encryption, peer authentication, client cert auth |
| Control Plane Configuration | 4 | Audit log policy, profiling disabled |
| Worker Nodes | 28 | Kubelet config, node authorization, file permissions |
| Kubernetes Policies | 28 | RBAC, network policies, pod security |
| Managed K8s (EKS / AKS / GKE) | 15 | Provider-specific hardening |

CIS coverage is a strict subset of the platform's broader rule catalog — a finding usually maps to **CIS + NSA + custom rule mappings** simultaneously.

---

## Key Findings to Prioritize

The eight most-encountered container security findings, with default severity. Re-grade in **Settings → Container Security → Severity Policy**.

| Finding | Severity | Why it matters |
|---|---|---|
| `cluster-admin` bound to pod service account | CRITICAL | Full cluster takeover if pod is compromised |
| Privileged container running in production | CRITICAL | Container can escape to the host node |
| Secrets mounted as environment variables | HIGH | Secrets exposed in pod spec, stdout, container logs |
| No network policies in namespace | HIGH | Lateral movement across all pods |
| Missing resource limits on pods | MEDIUM | Resource exhaustion / DoS vector |
| Image using `latest` tag | MEDIUM | Unpredictable deployments — no version pinning |
| Read-write root filesystem | MEDIUM | Persistence after compromise |
| Default service account with non-empty RBAC | MEDIUM | Unintended access escalation across pods |

---

## API

The Container Security API is part of the unified platform API. All endpoints require an authenticated session and are scoped to your tenant.

```http
# List container security findings
GET /gateway/api/v1/container-security/findings?provider=aws&severity=CRITICAL

# Get findings for a specific cluster
GET /gateway/api/v1/container-security/findings?resource_uid=arn:aws:eks:us-east-1:123456789012:cluster/prod

# Container security posture summary
GET /gateway/api/v1/views/container
```

Webhook delivery on new CRITICAL findings can be configured under **Settings → Notifications**.

---

## Frequently Asked Questions

**Does the platform need to install anything on my nodes?**
No. The platform reads cluster state via the Kubernetes API using read-only credentials you grant. It never deploys DaemonSets, sidecar containers, or node agents.

**How does the platform get image-CVE data without running a scanner inside the cluster?**
Container registries are scanned at the registry level (ECR / ACR / GCR / etc.). The platform queries the registry's own catalog plus its own SBOM-generation pipeline, then matches package versions against CVE feeds. The cluster only tells us *which images are deployed where*; the registry tells us *what's in the images*.

**Can I scan air-gapped Kubernetes clusters?**
Yes. The platform supports a connector mode where a small read-only collector runs in your network and forwards cluster state to the platform. Image scanning still requires registry access — typically your internal registry mirror.

**Does the platform support Pod Security Admission (PSA)?**
Yes. PSA labels on namespaces are read and reflected in findings — namespaces enforcing `restricted` get fewer findings than namespaces enforcing `privileged`.

**What about service mesh (Istio / Linkerd)?**
Service mesh resources (VirtualServices, DestinationRules, AuthorizationPolicies) are read alongside core resources. mTLS posture and authorization policy gaps are surfaced as findings.

**Can I export the cluster topology?**
Yes. The full topology (namespaces, workloads, services, RBAC graph, network policies) exports as JSON or as a Mermaid graph for sharing in incident-response runbooks.

---

*Last updated: 2026-05-09*
*For questions: support@onam.io*
