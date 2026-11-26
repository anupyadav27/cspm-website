import type { DocArticle } from "./types";

/**
 * AI Security (AI-SPM) documentation section (/docs/ai-security/*).
 *
 * Ground truth, and nothing else:
 *  - research_notes/Product update Nov 2026/posture_engines.md, section 1 (AI-SPM).
 *    Only items marked **live** are described as working: A1 (self-hosted AI on
 *    Kubernetes, inventory and exposure only), A2 (AI bill of materials), A3
 *    (provider guardrail presence), A4 (AI-to-data links), A5 (AI agents as
 *    identities), A6 (identity risk on AI workloads), A7 (AI Security console area),
 *    A13 (AI framework tiers). Items that are switched off or "not applied" (A8 pipeline
 *    builder, A9 AI path sync, A10 code-finding join, A11/A12/A15 rules and extra
 *    discovery reads, A14 OpenAI connector) appear only in :::limits blocks or not at all.
 *  - marketing/facts/limits.yaml `ai_security_aws_only` (the per-cloud resource list).
 *  - marketing/facts/product.yaml `capabilities.ai_spm_live_items` and
 *    `capabilities.ai_compliance_frameworks` — cleared by the owner on 2026-11-26.
 *
 * No AI rule counts: none is cleared (posture_engines.md A11). Do not add one.
 * The first paragraph of each body becomes the page's meta description.
 */
export const articles: DocArticle[] = [
  {
    slug: "ai-security/overview",
    title: "AI Security (AI-SPM) overview",
    breadcrumb: "AI Security / Overview",
    body: `
AI security posture management in Onam Security: find the AI services and self-hosted AI in your estate, and check how each one is set up.

:::card In 60 seconds
What it does: Finds the AI in your estate (managed AI services on AWS, Azure and Google Cloud, self-hosted model servers, notebooks and vector databases on Kubernetes, and the AI components in your software) and checks how each one is set up.
What it needs from you: The cloud accounts and Kubernetes clusters you have already connected. AI Security runs inside the same posture scan, through read-only cloud roles and a read-only Kubernetes ServiceAccount.
What you get: One AI inventory and AI bill of materials, plus findings for missing guardrails, AI servers exposed without authentication, risky AI configuration and over-privileged AI agents, mapped to OWASP Top 10 for LLM Applications 2025, NIST AI RMF, ISO/IEC 42001 and the EU AI Act.
:::

Teams adopt AI faster than security can review it. A model endpoint goes up for a test, a notebook gets a powerful execution role, someone runs a model server on a spare GPU node. AI Security gives that estate the same treatment the rest of your cloud gets: an inventory, checks every scan, and findings in the one queue.

![How AI Security works: AI sources, read-only discovery, one AI inventory, checks, findings mapped to AI frameworks](/diagrams/ai-security-overview.svg)

## How it works

:::flow How AI security posture works, from AI services to findings
Cloud AI services | SageMaker, Bedrock, Azure AI services, Azure OpenAI, Azure ML, Vertex AI || Self-hosted AI on Kubernetes | Ollama, vLLM, Jupyter, vector databases, KServe
Read-only discovery | Cloud roles, a read-only ServiceAccount and your SBOMs
AI inventory and AI BOM | Every AI resource and AI component in one list
Checks | Guardrails, exposure, configuration, data links, agent identities
Findings | In your queue, mapped to OWASP LLM, NIST AI RMF, ISO/IEC 42001 and the EU AI Act
:::

| Stage | What happens | Read more |
| --- | --- | --- |
| 1. Sources | Managed AI services on AWS, Azure and Google Cloud; self-hosted AI on your Kubernetes clusters; AI components inside your software | [Coverage by cloud](/docs/ai-security/coverage) |
| 2. Discover | The posture scan records each AI resource and its settings. A classifier recognises AI workloads in your clusters. The AI bill of materials is read from your SBOMs | [Discovery and AI bill of materials](/docs/ai-security/discovery-and-bom) |
| 3. Inventory | One list of models, endpoints, deployments, agents, notebooks, model servers and vector databases | [Discovery and AI bill of materials](/docs/ai-security/discovery-and-bom) |
| 4. Check | Guardrail presence, exposure without authentication, configuration, which data each AI service reads, and what each AI identity can do | [Guardrail and exposure checks](/docs/ai-security/guardrails-and-exposure), [AI and your data](/docs/ai-security/data-and-agents) |
| 5. Findings | In the same queue and exports as every other finding, mapped to AI frameworks | [AI compliance mappings](/docs/ai-security/compliance) |

## What AI Security covers today

:::matrix What runs today, by AI source
| Capability | Cloud AI services | Self-hosted AI on Kubernetes | Your software |
| --- | --- | --- | --- |
| Inventory | yes (AWS, Azure, Google Cloud) | yes (model servers, notebooks, vector databases) | yes (AI bill of materials) |
| Guardrail presence | yes (Bedrock Guardrails, Azure content filters, Model Armor) | — | — |
| Exposed without authentication | — | yes | — |
| Configuration checks | yes | planned (written, not yet switched on) | — |
| AI identities and their access | yes | — | — |
| Other clouds (OCI, Alibaba Cloud, IBM Cloud) | no | — | — |
:::

A dash means the check does not apply to that source.

## Find it in the console

:::steps A first tour of the AI Security area
### Open AI Security
AI Security has its own area in the console menu. Its tabs are **Overview**, **Inventory**, **Applications**, **Findings**, **Compliance**, **Coverage**, **Threats**, **Incidents** and **Settings**.
### Read the inventory
**Inventory** lists every AI resource the last scan found, from cloud AI services and from your Kubernetes clusters. Start here to answer "what AI do we run, and where?"
### Look at your AI applications
**Applications** lists your AI applications next to the raw inventory.
### Work the findings
**Findings** holds the AI findings: missing guardrails, AI servers exposed without authentication, risky configuration, AI agents with admin or wide write access. They are the same findings you see in the main queue.
### Check the frameworks
**Compliance** shows AI findings against OWASP Top 10 for LLM Applications 2025, NIST AI RMF, ISO/IEC 42001 and the EU AI Act. The remaining tabs (Coverage, Threats, Incidents and Settings) sit alongside.
:::

## How it connects to the rest of Onam

| Engine | What AI Security takes | What it gives back |
| --- | --- | --- |
| [CIEM](/docs/ciem/overview) | The identity behind each AI workload | AI execution identities marked as AI agents, with admin and wide-write findings |
| [DSPM](/docs/dspm/overview) | The data stores in your estate | AI-to-data links: which stores each AI service reads |
| [Compliance](/docs/compliance/frameworks) | — | AI findings mapped to AI frameworks |
| [Code security](/docs/code-security/sca-sbom) | SBOMs | The AI bill of materials |

:::limits Honest limits
- **AI Security checks configuration.** It does not send prompts to your models, red-team them or measure how well a guardrail blocks content.
- **AI on attack paths is not switched on yet.** AI findings sit in the findings queue; they are not yet drawn onto attack paths.
- **Self-hosted AI on Kubernetes is inventory and exposure only today.** Configuration rules for it are written and not yet switched on.
- **Other clouds are not covered.** AI services on Oracle Cloud, Alibaba Cloud and IBM Cloud are not checked. A connector for the OpenAI platform is not available.
- **A framework mapping is not full coverage.** See [AI compliance mappings](/docs/ai-security/compliance).
:::

## Questions customers ask

:::faq
### We already use Bedrock Guardrails. What does Onam add?
Bedrock Guardrails filters content on the models you attach it to. Onam checks **whether** a guardrail is attached, across models, deployments and agents, and does the same for Azure content filters and Google Model Armor, so one view answers "which of our AI has no guardrail?" on all three clouds. It also covers what guardrails do not: AI servers exposed without authentication, the identity each AI service runs as, which data stores it reads, and the mapping to AI frameworks. Onam does not replace the guardrail or test its policy.
### Does Onam read our prompts or model data?
No. AI Security works from configuration and metadata: what the cloud APIs report about each AI resource, what the Kubernetes API reports about each workload, and the package lists in your SBOMs. It does not call your models and does not read prompts, completions, training data or model weights. (If you separately deploy Onam's DSPM scanner, that scanner classifies samples of the data stores you point it at. See [DSPM classification](/docs/dspm/classification).)
### Do I need to deploy anything for AI Security?
No extra component. It runs in the posture scan of the cloud accounts and Kubernetes clusters you have already connected. If a cluster is not connected yet, follow [Connect Kubernetes clusters](/docs/onboarding/kubernetes).
### Which clouds are covered?
AWS, Azure and Google Cloud for managed AI services, plus self-hosted AI on any connected Kubernetes cluster. Oracle Cloud, Alibaba Cloud and IBM Cloud AI services are not covered. See [Coverage by cloud](/docs/ai-security/coverage).
### Does this make us compliant with the EU AI Act?
No tool does that on its own. AI findings map to EU AI Act controls, which gives you evidence for the controls a configuration check can speak to. Most of the Act is about how you build, document and govern AI, which you evidence yourself. See [AI compliance mappings](/docs/ai-security/compliance).
:::
`,
  },
  {
    slug: "ai-security/discovery-and-bom",
    title: "Discovery and AI bill of materials",
    breadcrumb: "AI Security / Discovery and AI bill of materials",
    body: `
How Onam finds AI: managed AI services through read-only cloud roles, self-hosted AI on Kubernetes through a workload classifier, and AI components from SBOMs.

You cannot secure AI you do not know about. Discovery builds one list from three places, each read the way the rest of Onam reads it.

:::flow Three ways AI is discovered, into one inventory
Cloud AI services | Read-only cloud roles || Kubernetes workloads | Read-only ServiceAccount || SBOMs | Packages in your code and images
Recognise AI | Resource types, model-server images, custom resources, AI packages
AI inventory | Resources, applications and the AI bill of materials
:::

## Managed AI services

The posture scan records each AI resource and its settings through the same read-only cloud roles that feed CSPM. Nothing extra is deployed.

| Cloud | What is discovered |
| --- | --- |
| AWS | SageMaker and Bedrock |
| Azure | Azure AI services accounts (including Azure OpenAI) and Azure Machine Learning workspaces |
| Google Cloud | Vertex AI endpoints, datasets and Workbench instances |

## Self-hosted AI on Kubernetes

Many teams run models themselves. A classifier reads the workloads and custom resources in each connected cluster and recognises the common building blocks of self-hosted AI:

| Kind | Recognised |
| --- | --- |
| Model servers and gateways | Ollama, vLLM, Text Generation Inference (TGI), LiteLLM, llama.cpp, LocalAI |
| Notebooks and ML tooling | Jupyter, MLflow |
| Vector databases | Qdrant, Weaviate, Chroma, Milvus, pgvector, Redis used as a vector store |
| Serving platforms (custom resources) | KServe, KubeRay, NVIDIA NIM, Seldon |

Each one is added to the AI inventory and checked for exposure without authentication (see [Guardrail and exposure checks](/docs/ai-security/guardrails-and-exposure)). Clusters are read through the read-only ServiceAccount you create in [Connect Kubernetes clusters](/docs/onboarding/kubernetes); nothing is installed in the cluster.

## AI bill of materials

The AI bill of materials (AI BOM) answers "which AI software do we ship?". Onam reads the software bills of materials it already holds for your code and images and picks out the AI components:

- **AI libraries**, the frameworks and SDKs your services import.
- **Model servers**, the serving software packaged in your images.
- **MCP SDKs**, the Model Context Protocol libraries that let an application expose tools to an AI agent or call them.

Read more about SBOMs in [Dependencies and SBOM](/docs/code-security/sca-sbom).

:::matrix What each discovery source records
| Source | AI resources | Resource settings | Exposure without auth | AI components |
| --- | --- | --- | --- | --- |
| Cloud AI services | yes | yes | — | — |
| Kubernetes workloads | yes | — | yes | — |
| SBOMs | — | — | — | yes (libraries, model servers, MCP SDKs) |
:::

:::limits What discovery does not see yet
- **More Google Cloud, Azure and AWS AI resource kinds are on the way.** Vertex AI feature stores, vector search and Colab, Azure Machine Learning connections and Bedrock knowledge-base data sources are not discovered yet.
- **AI services on Oracle Cloud, Alibaba Cloud and IBM Cloud are not discovered.**
- **The OpenAI platform is not connected.** Use of the OpenAI API from your own code shows up only as a library in the AI bill of materials.
- **AI that runs outside connected accounts and clusters is not seen**, for example a model on a laptop or a SaaS AI tool.
:::

## Questions customers ask

:::faq
### A team runs Ollama on a GPU node in our cluster. Will Onam find it?
Yes, if the cluster is connected. The classifier recognises Ollama and the other model servers listed above from the workload itself, adds it to the AI inventory and checks whether it is reachable without authentication.
### Do I have to install an agent in the cluster?
No. Discovery uses the read-only ServiceAccount from [Connect Kubernetes clusters](/docs/onboarding/kubernetes). Nothing is installed and no object is changed.
### Where does the AI bill of materials come from?
From the SBOMs Onam builds for your repositories and images. It is a view of those SBOMs filtered to AI libraries, model servers and MCP SDKs, so it is as complete as the code and images you have connected.
### Can I export AI findings?
Yes. AI findings sit in the same findings queue and exports as the rest of the platform.
:::
`,
  },
  {
    slug: "ai-security/guardrails-and-exposure",
    title: "Guardrail and exposure checks",
    breadcrumb: "AI Security / Guardrail and exposure checks",
    body: `
Which of your models, deployments and agents have no provider guardrail, and which self-hosted AI servers on Kubernetes answer anyone without authentication.

Two questions catch most of the early AI risk in a cloud estate: **is a guardrail in front of this model?** and **can anyone reach it?** Onam asks both every scan.

## Provider guardrail presence

Each cloud offers a managed guardrail that filters what goes into and comes out of a model. Onam checks that one is attached to your models, deployments and agents.

:::matrix Guardrail presence, by cloud
| Cloud | Guardrail checked | Checked on |
| --- | --- | --- |
| AWS | yes (Amazon Bedrock Guardrails) | Models, deployments and agents |
| Azure | yes (Azure AI content filters) | Models, deployments and agents |
| Google Cloud | yes (Google Model Armor) | Models, deployments and agents |
| Self-hosted on Kubernetes | — | No provider guardrail to check |
:::

A model with no guardrail is a finding. What the guardrail blocks, and how well, is configured and tested in the provider's own console.

## Self-hosted AI exposed without authentication

Model servers, notebooks and vector databases are often started for a test with authentication switched off. On a cluster with a public load balancer or ingress, that becomes an open model API, an open notebook that can run code, or an open copy of your embeddings.

:::flow From a Kubernetes workload to an exposure finding
Kubernetes workload | Deployment, StatefulSet or serving custom resource
Recognised as AI | Ollama, vLLM, Jupyter, Qdrant, KServe and others
Exposure joined | Network exposure from the same scan
Finding | Self-hosted AI exposed without authentication
:::

The list of recognised servers is on [Discovery and AI bill of materials](/docs/ai-security/discovery-and-bom).

## Configuration checks on cloud AI services

AI Security also runs configuration checks on the managed AI resources listed in [Coverage by cloud](/docs/ai-security/coverage). Their findings sit with the guardrail and exposure findings on the **Findings** tab of the AI Security area.

## Walk through a finding

:::steps Fixing a missing guardrail
### Find it
Open **AI Security** and the **Findings** tab, and find the guardrail findings. Each one names the model, deployment or agent it applies to.
### Weigh it
Look at the identity risk shown on the AI workload and at which data stores it reads (its AI-to-data links). A model with a powerful identity that reads sensitive data and has no guardrail comes first.
### Attach a guardrail
In the provider's console, attach a Bedrock guardrail, an Azure content filter or a Model Armor template. Onam does not change your AI configuration for you.
### Confirm on the next scan
The next scan sees the guardrail and the finding is resolved.
:::

:::limits Honest limits
- **Presence, not quality.** Onam checks that a guardrail is attached. It does not test prompts against it or judge its policy.
- **No model testing.** Onam does not send prompts to your models, red-team them or scan model weights.
- **Self-hosted AI: exposure only.** Configuration rules for self-hosted AI on Kubernetes are written and not yet switched on.
- **Onam does not change anything.** Attaching a guardrail or closing an exposed service is your change.
:::

## Questions customers ask

:::faq
### We already use Bedrock Guardrails. What does Onam add?
A check that the guardrail is actually attached, on every model, deployment and agent, in every account, every scan, plus the same check for Azure content filters and Google Model Armor. Guardrails filter content; they do not tell you which endpoint has none, whether a self-hosted model server is open to the internet, or what an AI agent's role can do. Onam covers those and puts them in one queue.
### Does Onam test whether our guardrail actually blocks prompt injection?
No. That needs prompts sent to the model, and Onam does not call your models. Use the provider's own evaluation tools or a dedicated AI red-teaming tool for that.
### Will Onam stop an exposed model server?
No. Onam reports; the fix is yours to make.
:::
`,
  },
  {
    slug: "ai-security/data-and-agents",
    title: "AI and your data, and AI agents as identities",
    breadcrumb: "AI Security / AI and your data, AI agents as identities",
    body: `
Which data stores each AI service reads, and what the identity behind each AI workload or agent is allowed to do.

A model is only as risky as what it can reach. Onam joins every AI resource to the data it reads and to the identity it runs as, so an AI finding carries its blast radius with it.

:::flow What an AI workload can reach
AI service or agent | Bedrock, SageMaker, Azure AI, Vertex AI
Its identity | Execution role or service identity, marked as an AI agent
What it is allowed to do | Admin or wide write access is a finding
Data it reads | AI-to-data links to your data stores
:::

## AI-to-data links

For each AI service, Onam records which data stores it reads, as a link between the AI resource and the store. [DSPM](/docs/dspm/overview) labels the same stores, so a link from an AI service to a store labelled as holding personal or other sensitive data tells you that this AI is reading sensitive data.

The link records **that** an AI service uses a store. It does not read the data.

## AI agents as identities

AI services act through identities: Bedrock and SageMaker roles on AWS, and other AI execution identities. In [CIEM](/docs/ciem/overview) these identities are marked as **AI agents**, so they can be reviewed as a group rather than lost among human and machine roles.

Two findings apply to AI agents in particular:

| Finding | Why it matters |
| --- | --- |
| AI agent with admin access | An agent that can do anything turns a prompt-injection or tool-misuse problem into an account takeover |
| AI agent with wide write access | An agent that can write or delete across many resources can damage data and infrastructure it never needed |

Right-sizing these identities follows the normal [right-sizing workflow](/docs/ciem/right-sizing).

## Identity risk on every AI workload

Each AI workload in the inventory shows the risk of the identity it runs as, taken from Onam's IAM posture analysis. A notebook with a broad execution role is visible as such on the notebook itself, without switching to the identity view.

:::limits Honest limits
- **AI is not on attack paths yet.** AI findings are not yet drawn onto attack paths.
- **Code findings are not joined to AI applications yet.** A SAST finding in the code of an AI application appears in Code security, not on the AI application.
- **Only links the scan can see.** An AI service that reaches data in a way the scan cannot see, for example with credentials embedded in code, is not linked.
- **Onam never edits IAM.** Removing access from an AI agent is your change.
:::

## Questions customers ask

:::faq
### Can Onam tell us which models were trained on customer data?
Onam shows which data stores each AI service reads. If DSPM has classified those stores as holding personal or other sensitive data, you see the combination. It does not inspect the model itself.
### Our Bedrock agent has a role with AdministratorAccess "just for the demo". Will Onam flag it?
Yes. The role is marked as an AI agent and its admin access raises a finding.
### Does Onam watch what our agents actually do at run time?
AI Security is posture: what an agent is allowed to do and what it can reach. Activity from cloud audit logs is covered by Onam's threat detection, not by these checks.
:::
`,
  },
  {
    slug: "ai-security/compliance",
    title: "AI compliance mappings",
    breadcrumb: "AI Security / AI compliance mappings",
    body: `
How AI findings map to OWASP Top 10 for LLM Applications 2025, NIST AI RMF, ISO/IEC 42001 and the EU AI Act, and what a mapping does and does not prove.

AI frameworks ask for evidence that you know what AI you run and that it is set up safely. AI Security's findings are mapped to the controls they speak to, and appear in the **Compliance** tab of the AI Security area and in Onam's [compliance](/docs/compliance/frameworks) reports.

## Two tiers

| Tier | What it means |
| --- | --- |
| **Automated** | At least one working Onam check is linked to the framework, so findings appear against its controls without you doing anything. It does **not** mean every control in the framework is checked. |
| **Attestation** | Onam tracks the framework so you can record your own evidence against it. No check is linked automatically. |

:::matrix AI frameworks in Onam
| Framework | Findings mapped automatically | Every control checked automatically | You record evidence |
| --- | --- | --- | --- |
| OWASP Top 10 for LLM Applications 2025 | yes | no | yes (for the controls no check covers) |
| NIST AI Risk Management Framework (AI RMF) | yes | no | yes (for the controls no check covers) |
| ISO/IEC 42001 (AI management systems) | yes | no | yes (for the controls no check covers) |
| EU AI Act | yes | no | yes (for the controls no check covers) |
| MITRE ATLAS | no | no | yes (attestation only) |
| OWASP Agentic 2026 | no | no | yes (attestation only) |
:::

## Why a mapping is not coverage

Most of these frameworks are about how an organisation builds and governs AI: risk assessments, documentation, human oversight, incident processes. A configuration check can speak to some controls, such as access to a model, its exposure or the presence of a guardrail, and Onam maps its findings to those. The rest you evidence yourself.

:::flow How a finding becomes framework evidence
AI finding | Missing guardrail, exposed AI server, over-privileged agent
Linked control | The framework controls the check speaks to
Compliance view | Findings shown against each linked control
Your evidence | Policies, assessments and records for the controls no check covers
:::

:::limits Honest limits
- **No framework is fully automated.** The automated tier means at least one working check is linked, not that every control is checked.
- **No certification.** Onam does not certify you against ISO/IEC 42001 or declare EU AI Act conformity. An auditor or notified body does that.
- **MITRE ATLAS and OWASP Agentic are attestation only** today.
:::

## Questions customers ask

:::faq
### Does a clean AI compliance view mean we meet the EU AI Act?
No. It means the controls a configuration check can speak to show no failing findings. Most obligations in the Act, such as risk management, data governance, technical documentation and human oversight, are evidenced by your own processes.
### Our auditor asked for ISO/IEC 42001 evidence. What can we hand over?
The Compliance view for ISO/IEC 42001 with the linked findings and their status, plus the AI inventory as a record of which AI systems you run. Pair it with your own management-system documents.
### Why are MITRE ATLAS and OWASP Agentic attestation only?
No Onam check is linked to them yet, so findings do not appear against their controls automatically. You can still track your evidence against them in Onam.
:::
`,
  },
  {
    slug: "ai-security/coverage",
    title: "AI Security coverage by cloud",
    breadcrumb: "AI Security / Coverage by cloud",
    body: `
Which AI services AI Security discovers and checks on AWS, Azure, Google Cloud and Kubernetes, and which clouds are not covered.

AI Security covers managed AI services on AWS, Azure and Google Cloud, and self-hosted AI on any connected Kubernetes cluster. AI services on other clouds are not covered.

:::matrix Coverage by cloud
| Capability | AWS | Azure | Google Cloud | Kubernetes (self-hosted) | OCI, Alibaba Cloud, IBM Cloud |
| --- | --- | --- | --- | --- | --- |
| AI resource inventory | yes | yes | yes | yes | no |
| Configuration checks | yes | yes | yes | planned (written, not switched on) | no |
| Guardrail presence | yes (Bedrock Guardrails) | yes (content filters) | yes (Model Armor) | — | no |
| Exposed without authentication | — | — | — | yes | no |
:::

A dash means the check does not apply to that source. The AI bill of materials comes from SBOMs and does not depend on the cloud. AI-to-data links and AI agent identities are described on [AI and your data](/docs/ai-security/data-and-agents); on AWS, Bedrock and SageMaker roles are marked as AI agents.

## Per cloud

| Cloud | AI resources discovered and checked |
| --- | --- |
| AWS | Amazon SageMaker and Amazon Bedrock |
| Azure | Azure AI services accounts, including Azure OpenAI, and Azure Machine Learning workspaces |
| Google Cloud | Vertex AI endpoints, datasets and Workbench instances |
| Kubernetes | Self-hosted model servers (Ollama, vLLM, TGI, LiteLLM, llama.cpp, LocalAI), Jupyter, MLflow, vector databases (Qdrant, Weaviate, Chroma, Milvus, pgvector, Redis as a vector store) and serving custom resources (KServe, KubeRay, NVIDIA NIM, Seldon) |

Connect clouds and clusters in [Connect a cloud](/docs/onboarding/aws). Kubernetes clusters on any cloud, or on-premises, count as Kubernetes here.

:::limits Honest limits
- **Oracle Cloud, Alibaba Cloud and IBM Cloud AI services are not covered.** Do not read "all clouds" into this page.
- **Some resource kinds are not discovered yet**, including Vertex AI feature stores, vector search and Colab, Azure Machine Learning connections and Bedrock knowledge-base data sources.
- **Self-hosted AI on Kubernetes is inventory and exposure only today.**
- **The OpenAI platform is not connected.**
:::

## Questions customers ask

:::faq
### We use Azure OpenAI. Is that covered?
Yes. Azure OpenAI runs in Azure AI services accounts, which are discovered and checked, including whether content filters are in place.
### We use Gemini through Vertex AI. What do you see?
Vertex AI endpoints, datasets and Workbench instances, their configuration, and whether Google Model Armor is in front of your models.
### We run models on OKE in Oracle Cloud. Is that covered?
The managed AI services on Oracle Cloud are not. Self-hosted AI on an OKE cluster is covered as Kubernetes once the cluster is connected: inventory and exposure.
### Is the OpenAI API covered?
Not as a connected platform. Use of OpenAI libraries in your code appears in the AI bill of materials.
:::
`,
  },
];
