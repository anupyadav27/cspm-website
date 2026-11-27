import type { DocArticle } from "./types";

/**
 * AI Security (AI-SPM) documentation section (/docs/ai-security/*), visual format.
 *
 * Design: research_notes/Product update Nov 2026/ai_security_design_direction.md (estate map,
 * Question pages, real annotated screens, ledger, next questions).
 * Console truth: ai_security_console_validation.md (captured 26 Nov 2026; M1–M29 applied):
 *  - Tab order is the console's: Overview, Inventory, Applications, Findings, Threats, Incidents,
 *    Compliance, Coverage, Settings. Overview is "not available yet"; Incidents is not described.
 *  - Prompt text: off by default; an admin can turn on prompt-text detection (owner, 27 Nov 2026).
 *  - Compliance uses the console's words: partly automated / you attest / threat model / not scored yet.
 *  - The Coverage tab's catalogue counts may be shown (owner, 27 Nov 2026), as an example workspace.
 *  - No shadow AI, no AI on attack paths, no OCI/Alibaba/IBM/OpenAI as covered, no AI rule counts.
 * Facts: marketing/facts/product.yaml capabilities.ai_spm_live_items, ai_compliance_frameworks;
 * limits.yaml ai_security_aws_only. Screens: public/screens/ai-security/ (redacted, Onam's internal
 * test workspace). The illustrative estate lives in src/data/explainers/ai-estate.ts.
 */

const CAPTURED = "Real console, Onam's internal test workspace, captured 26 Nov 2026. Account and tenant IDs redacted.";

export const articles: DocArticle[] = [
  {
    slug: "ai-security/overview",
    title: "AI Security (AI-SPM) overview",
    breadcrumb: "AI Security / Overview",
    description:
      "AI Security finds the AI services, model servers and agents in the clouds and clusters you've connected, read-only, and checks each one in your normal posture scan.",
    body: `
:::hero night
pill: AI Security · AI-SPM
title: Find every AI you run, see what's exposed and what it can reach.
lead: AI Security finds the AI services, model servers and agents in the clouds and clusters you've already connected, read-only, and checks each one in your normal posture scan.
chips: AWS · Azure · Google Cloud · Kubernetes
cta: Run a free audit scan | /audit-scan
secondary: See the 2-minute story | #what-happens-to-the-model-server-someone-forgot
visual: lensmap ai-estate
:::

## What happens to the model server someone forgot?

Onam finds it in the next posture scan, recognises it as AI, and flags it if anyone can reach it without a login.

:::story A Tuesday test
end: Read: guardrail and exposure checks | /docs/ai-security/guardrails-and-exposure
### Friday, 5:40 pm
frame: forgotten
Someone starts a model server on a spare GPU node to test something. It's still running.
### Loophole moves in
frame: loophole
**Loophole's doing:** anyone who finds the server can talk to it. There is no login in front.
### The next scan
frame: stamp
Onam recognises it as Ollama, checks its exposure, and raises **Exposed without authentication** in your usual queue.
### Monday
frame: closed
Close it the usual way. And the AI nobody listed is now in your inventory.
:::

## Where do I see this in Onam?

AI Security has its own area in the console. **Inventory** lists every AI resource the last scan found, in four views.

:::screen /screens/ai-security/ais-inventory-services-models.webp
url: app.onamsecurity.com/ui/ai-security?tab=inventory
alt: The AI Security Inventory tab, Services and models view: a table of AI notebooks, endpoints, models and guardrails on AWS and Azure, with account, region, kind, service and model columns.
size: 1440x1004
hidpi: yes
caption: ${CAPTURED}
1 @ 57,26.4: Four views of your AI: **services and models**, **agents**, **libraries (AI-BOM)** from your SBOMs, and **AI in SaaS**.
2 @ 76,40.2: Each row is typed: notebook, endpoint, model or guardrail, with its service and model.
3 @ 3,74.9: AI on every connected cloud in one list, with the account and region each runs in.
:::

The tabs, in the order the console shows them:

| Tab | What it answers |
| --- | --- |
| **Overview** | Not available yet. It arrives with the AI overview; today, Inventory and Findings show your AI and its findings |
| **Inventory** | What AI do we run, and where? Services and models, agents, libraries (AI-BOM) and AI in SaaS |
| **Applications** | Which AI belongs together? Assets grouped by the \`onam-ai-app\` tag, links between AI assets, and code |
| **Findings** | What should we fix first? Grouped by category, with views for fix first, new this week and internet exposed |
| **Threats** | Is anything suspicious happening on our AI? Detections on AI assets, from Onam threat detection |
| **Compliance** | Where do we stand on AI frameworks? By framework or by resource |
| **Coverage** | What can Onam see, and what can't it? Per AI product, with what to do about the gaps |
| **Settings** | Prompt-text detection (off by default), AI detectors, the tool limit per AI agent and the application tag |

Every AI finding is a normal Onam finding, so it also flows into [compliance reports](/docs/compliance/frameworks) and exports.

## What does it check, and what doesn't it?

It checks how your AI is set up and what it can reach. It does not test your models or change anything.

:::ledger
+ Finds managed AI services on AWS, Azure and Google Cloud
+ Finds self-hosted AI on your Kubernetes clusters, and flags it when it is **exposed without authentication**
+ Lists the AI components in your software from your SBOMs: the **AI bill of materials**
+ Checks that **Bedrock Guardrails**, **Azure content filters** or **Google Model Armor** are attached
+ Shows which data stores an AI service reads, and flags **AI agents with admin or wide write access**
+ Maps AI findings to **OWASP Top 10 for LLM 2025**, **NIST AI RMF**, **ISO/IEC 42001** and the **EU AI Act**
- Send prompts to your models, red-team them, or measure what a guardrail blocks
- Read prompt or answer text, unless an admin turns on **prompt-text detection** in Settings
- Run configuration rules on self-hosted AI (they are written, not yet switched on)
- Draw AI findings on attack paths (not switched on yet)
- Cover AI services on Oracle Cloud, Alibaba Cloud or IBM Cloud, or connect to the OpenAI platform
- Make you compliant: a framework mapping is evidence, not full coverage
:::

:::next Where do you want to go next?
### How does Onam find AI we didn't list? | /docs/ai-security/discovery-and-bom
Cloud roles, a read-only ServiceAccount, and the SBOMs you already have.
### Which of our AI has no guardrail, and is any of it open? | /docs/ai-security/guardrails-and-exposure
Guardrail presence on three clouds; self-hosted servers with no login.
### What data can our AI read, and what can our agents do? | /docs/ai-security/data-and-agents
One hop each: the identity it runs as and the stores it reads.
### What does "mapped to the EU AI Act" actually mean? | /docs/ai-security/compliance
Partly automated, you attest, and why a mapping is not coverage.
### Does it cover our clouds? | /docs/ai-security/coverage
Pick a cloud and see exactly what is checked.
### Run a free audit scan | /audit-scan | cta
One read-only scan of your estate, no commitment.
:::

## Questions customers ask

:::faq
### We already use Bedrock Guardrails. What does Onam add?
Bedrock Guardrails filters content on the models you attach it to. Onam checks **whether** a guardrail is attached, across models, deployments and agents, and does the same for Azure content filters and Google Model Armor, so one view answers "which of our AI has no guardrail?" on all three clouds. It also covers what guardrails do not: AI servers exposed without authentication, the identity each AI service runs as, which data stores it reads, and the mapping to AI frameworks. Onam does not replace the guardrail or test its policy.
### Does Onam read our prompts or model data?
Not by default. AI Security works from configuration and metadata: what the cloud APIs report about each AI resource, what the Kubernetes API reports about each workload, and the package lists in your SBOMs. Reading prompt and answer text, to find prompt injection, jailbreaks and sensitive answers, is a setting called **prompt-text detection**. It is off unless an admin turns it on. Onam never reads training data or model weights.
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
    description:
      "How Onam finds AI: managed AI services through read-only cloud roles, self-hosted AI on Kubernetes through a workload classifier, and AI components from your SBOMs.",
    body: `
:::hero light
eyebrow: How does Onam find AI we didn't list?
title: From three places you've already connected: your clouds, your clusters and your SBOMs.
lead: Managed AI services come from read-only cloud roles, self-hosted AI from a workload classifier, and AI components from the software bills of materials Onam already holds.
chips: Cloud roles · Read-only ServiceAccount · SBOMs
:::

## How does Onam recognise a self-hosted model server?

From the workload itself. A classifier reads the images and custom resources in each connected cluster and labels the common building blocks of self-hosted AI. Pick one:

:::switchboard What the classifier sees, and what it calls it
### ollama/ollama | info
**Model server.** Added to the AI inventory and checked for exposure without authentication. Other model servers and gateways recognised the same way: vLLM, Text Generation Inference (TGI), LiteLLM, llama.cpp and LocalAI.
### qdrant/qdrant | info
**Vector database.** Your embeddings, which can hold copies of your data. Also recognised: Weaviate, Chroma, Milvus, pgvector, and Redis used as a vector store.
### jupyter/scipy-notebook | info
**Notebook.** A notebook that is open to anyone can run code. Also recognised: MLflow.
### KServe InferenceService | info
**Serving platform** (custom resource). Also recognised: KubeRay, NVIDIA NIM and Seldon.
:::

Clusters are read through the read-only ServiceAccount you create in [Connect Kubernetes clusters](/docs/onboarding/kubernetes). Nothing is installed in the cluster and no object is changed.

## Which managed AI services are discovered?

The posture scan records each AI resource and its settings through the same read-only cloud roles that feed CSPM.

| Cloud | What is discovered |
| --- | --- |
| AWS | Amazon SageMaker and Amazon Bedrock |
| Azure | Azure AI services accounts (including Azure OpenAI) and Azure Machine Learning workspaces |
| Google Cloud | Vertex AI endpoints, datasets and Workbench instances |

:::screen /screens/ai-security/ais-inventory-libraries.webp
url: app.onamsecurity.com/ui/ai-security?tab=inventory
alt: The Inventory tab's Libraries (AI-BOM) view: a table of AI libraries such as mistralai, anthropic and google-genai found in container images, with kind, guardrail and exposure columns.
size: 1440x938
hidpi: yes
caption: Real console, Onam's internal test workspace, captured 27 Nov 2026. Tenant IDs redacted.
1 @ 52.8,13.2: **Libraries (AI-BOM)** sits beside services and models, agents and AI in SaaS.
2 @ 61,33.2: Each row is an AI library found in your software: model SDKs such as mistralai, anthropic and google-genai.
3 @ 10.4,33.2: The source is the container image whose SBOM it came from.
:::

## What is the AI bill of materials?

It is the list of AI software inside your applications, read from the SBOMs Onam builds for your code and images. It answers "which AI software do we ship?" and lives under **Inventory › Libraries (AI-BOM)**.

- **AI libraries:** the frameworks and SDKs your services import.
- **Model servers:** the serving software packaged in your images.
- **MCP SDKs:** the Model Context Protocol libraries that let an application expose tools to an AI agent or call them.

Read more about SBOMs in [Dependencies and SBOM](/docs/code-security/sca-sbom).

:::ledger
+ Managed AI resources and their settings on AWS, Azure and Google Cloud
+ Self-hosted model servers, notebooks, vector databases and serving platforms on connected clusters
+ AI libraries, model servers and MCP SDKs from your SBOMs
+ Groups AI into applications from the \`onam-ai-app\` tag, links between AI assets, and code
- Vertex AI feature stores, vector search and Colab, Azure Machine Learning connections, or Bedrock knowledge-base data sources (not discovered yet)
- AI services on Oracle Cloud, Alibaba Cloud or IBM Cloud
- The OpenAI platform itself: use of the OpenAI API from your code appears only as a library in the AI BOM
- AI on a laptop or anywhere outside the accounts and clusters you connected
:::

:::next Keep going
### Which of our AI has no guardrail, and is any of it open? | /docs/ai-security/guardrails-and-exposure
What the next scan flags on what discovery found.
### Does it cover our clouds? | /docs/ai-security/coverage
Pick a cloud and see exactly what is discovered.
:::

## Questions customers ask

:::faq
### A team runs Ollama on a GPU node in our cluster. Will Onam find it?
Yes, if the cluster is connected. The classifier recognises Ollama and the other model servers listed above from the workload itself, adds it to the AI inventory and checks whether it is reachable without authentication.
### Do I have to install an agent in the cluster?
No. Discovery uses the read-only ServiceAccount from [Connect Kubernetes clusters](/docs/onboarding/kubernetes). Nothing is installed and no object is changed.
### Where does the AI bill of materials come from?
From the SBOMs Onam builds for your repositories and images. It is a view of those SBOMs filtered to AI libraries, model servers and MCP SDKs, so it is as complete as the code and images you have connected.
### How do I group our AI into applications?
Put the tag \`onam-ai-app=<application name>\` on your AI resources. Onam also groups assets it can link to each other and to code. Onam never adds the tag itself.
### Can I export the inventory?
Yes. Inventory, Findings and the other AI tabs export to PDF and Excel or CSV, like the rest of the console.
:::
`,
  },
  {
    slug: "ai-security/guardrails-and-exposure",
    title: "Guardrail and exposure checks",
    breadcrumb: "AI Security / Guardrail and exposure checks",
    description:
      "Which of your models, deployments and agents have no provider guardrail, and which self-hosted AI servers on Kubernetes answer anyone without authentication.",
    body: `
:::hero light
eyebrow: Which of our AI has no guardrail, and is any of it open to the internet?
title: Onam checks both on every scan: guardrail attached, and login in front.
lead: Missing Bedrock Guardrails, Azure content filters or Google Model Armor, and self-hosted model servers that answer anyone, raise findings in your usual queue.
chips: Bedrock Guardrails · Azure content filters · Model Armor · Self-hosted on Kubernetes
:::

## What exactly does Onam see?

Whether a provider guardrail is attached, and whether a self-hosted AI server can be reached with no authentication. It does not open the guardrail to test it.

:::xray
:::

| Cloud | Guardrail checked | Checked on |
| --- | --- | --- |
| AWS | Amazon Bedrock Guardrails | Models, deployments and agents |
| Azure | Azure AI content filters | Models, deployments and agents |
| Google Cloud | Google Model Armor | Models, deployments and agents |
| Self-hosted on Kubernetes | No provider guardrail to check | Exposure without authentication instead |

## Why is an open model server a big deal?

Because it is started for a test with authentication off. Behind a public load balancer or ingress, that is an open model API, an open notebook that can run code, or an open copy of your embeddings.

The scan recognises the workload as AI (see [Discovery](/docs/ai-security/discovery-and-bom)), joins it with the network exposure found in the same scan, and raises **Self-hosted AI exposed without authentication**.

## Where do these findings show up?

On the **Findings** tab of AI Security, counted at the top and grouped by category, next to the configuration findings for your cloud AI services.

:::screen /screens/ai-security/ais-findings.webp
url: app.onamsecurity.com/ui/ai-security?tab=findings
alt: The AI Security Findings tab: status tabs, four counters for public endpoints, no guardrail, logging off and sensitive data, and findings grouped by category with rule IDs, assets and regions.
size: 1440x1004
hidpi: yes
caption: ${CAPTURED}
1 @ 41.7,32.6: **No guardrail** counts models and agents without a provider guardrail, at the top of the tab.
2 @ 22.5,62.3: Findings are grouped by category, each with a rule ID such as AI-AC-005.
3 @ 51.5,57.9: Each finding names the asset, its AI service and its region.
4 @ 30,44.4: Views for **fix first**, **new this week** and **internet exposed**.
:::

## How do I fix a missing guardrail?

Attach one in the provider's console; the next scan resolves the finding. Fix the riskiest first:

:::steps Fixing a missing guardrail
### Find it
Open **AI Security › Findings** and use the **Fix first** view. Each guardrail finding names the model, deployment or agent.
### Weigh it
Look at the identity the AI runs as and which data stores it reads ([AI and your data](/docs/ai-security/data-and-agents)). A model with a powerful identity that reads sensitive data and has no guardrail comes first.
### Attach a guardrail
In the provider's console, attach a Bedrock guardrail, an Azure content filter or a Model Armor template. Onam does not change your AI configuration.
### Confirm on the next scan
The next scan sees the guardrail and the finding is resolved.
:::

:::ledger
+ Guardrail attached or not, on every model, deployment and agent, every scan
+ Self-hosted AI exposed without authentication
+ Configuration findings on cloud AI services, such as public endpoints and logging off
- Test prompts against a guardrail or judge its policy
- Send prompts to your models, red-team them or scan model weights
- Run configuration rules on self-hosted AI (written, not yet switched on)
- Change anything: attaching a guardrail or closing an exposed service is your change
:::

:::next Keep going
### What data can our AI read, and what can our agents do? | /docs/ai-security/data-and-agents
How to tell which missing guardrail matters most.
### What does "mapped to the EU AI Act" mean? | /docs/ai-security/compliance
How these findings become framework evidence.
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
    description:
      "Which data stores each AI service reads, and what the identity behind each AI workload or agent is allowed to do.",
    body: `
:::hero light
eyebrow: What data can our AI read, and what can our AI agents do?
title: A model is only as risky as what it can reach.
lead: Onam links each AI service to the identity it runs as and the data stores it reads, so an AI finding carries its blast radius with it.
chips: CIEM · DSPM · One hop each
:::

## How do I see what one AI agent can reach?

Pick it, and look both ways: the role it runs as on one side, the stores it reads on the other.

:::rings
:::

## How does Onam know which data an AI service reads?

For each AI service, Onam records which data stores it reads, as a link between the AI resource and the store. [DSPM](/docs/dspm/overview) labels the same stores, so a link to a store holding personal or other sensitive data tells you this AI reads sensitive data.

The link records **that** an AI service uses a store, from the service's configuration. It does not read the data.

## Why treat AI agents as identities?

Because an agent acts through a role, and an over-powered role turns a prompt-injection problem into an account takeover. In [CIEM](/docs/ciem/overview), Bedrock and SageMaker roles and other AI execution identities are marked as **AI agents**, so you can review them as a group.

| Finding | Why it matters |
| --- | --- |
| AI agent with admin access | An agent that can do anything turns a prompt-injection or tool-misuse problem into an account takeover |
| AI agent with wide write access | An agent that can write or delete across many resources can damage data and infrastructure it never needed |
| More tools than the limit | An agent with more tools than the limit set in **Settings** gets a finding |

Where Onam can resolve the identity an AI workload runs as, the workload also shows that identity's risk, from Onam's IAM analysis. Right-sizing follows the normal [right-sizing workflow](/docs/ciem/right-sizing).

## Does Onam watch what our AI does at run time?

Partly. AI Security's **Threats** tab shows suspicious activity on your AI assets, found in your AI activity logs by Onam threat detection. The rest of AI Security is posture: what your AI is allowed to do and what it can reach.

:::screen /screens/ai-security/ais-threats.webp
url: app.onamsecurity.com/ui/ai-security?tab=threats
alt: The AI Security Threats tab with counters for open AI threats, critical or high, on AI assets and in an incident, filters for why the activity counts as AI and for AI application, and one medium threat on a Bedrock guardrail.
size: 1440x696
hidpi: yes
caption: ${CAPTURED}
1 @ 61.1,47: Threats on AI assets are counted on their own.
2 @ 35.4,67.4: Filter by why the activity counts as AI, or by AI application.
3 @ 93.5,86.6: Each threat names the detection that raised it.
:::

:::ledger
+ Which data stores each AI service reads, with DSPM's sensitivity labels
+ AI execution identities marked as AI agents, with admin and wide-write findings
+ The identity risk on AI workloads, where the identity can be resolved
+ Suspicious activity on AI assets, on the Threats tab
- Draw multi-hop paths: AI is not on attack paths yet
- Join SAST findings to AI applications: they stay in Code security
- See data reached in ways the scan cannot see, such as credentials embedded in code
- Edit IAM: removing access from an AI agent is your change
:::

:::next Keep going
### What does "mapped to the EU AI Act" mean? | /docs/ai-security/compliance
How these findings become framework evidence.
### Does it cover our clouds? | /docs/ai-security/coverage
Pick a cloud and see exactly what is checked.
:::

## Questions customers ask

:::faq
### Can Onam tell us which models were trained on customer data?
Onam shows which data stores each AI service reads. If DSPM has classified those stores as holding personal or other sensitive data, you see the combination. It does not inspect the model itself.
### Our Bedrock agent has a role with AdministratorAccess "just for the demo". Will Onam flag it?
Yes. The role is marked as an AI agent and its admin access raises a finding.
### Does Onam read the data our AI uses?
No. AI Security links an AI service to a store from the service's configuration. Classification of the store itself is DSPM's job, on the stores you choose. See [DSPM classification](/docs/dspm/classification).
:::
`,
  },
  {
    slug: "ai-security/compliance",
    title: "AI compliance mappings",
    breadcrumb: "AI Security / AI compliance mappings",
    description:
      "How AI findings map to OWASP Top 10 for LLM Applications 2025, NIST AI RMF, ISO/IEC 42001 and the EU AI Act, and what a mapping does and does not prove.",
    body: `
:::hero light
eyebrow: Which AI frameworks do our findings map to, and what does "mapped" mean?
title: A mapping is evidence for some controls, not a verdict on the framework.
lead: AI findings are linked to the framework controls they speak to. The Compliance tab shows each control as partly automated or you attest, so the gap is never hidden.
chips: OWASP LLM · NIST AI RMF · ISO/IEC 42001 · EU AI Act · MITRE ATLAS · OWASP Agentic
:::

## What do "partly automated" and "you attest" mean?

**Partly automated:** at least one Onam rule checks the control, so failing resources show against it. **You attest:** no rule checks it, so you record the evidence.

The pass rate counts automated controls only. Controls you attest count once you attest them. Pick a framework:

:::switchboard Six AI frameworks in Onam
### OWASP Top 10 for LLM 2025 | partial
Some controls are **partly automated**: findings such as a missing guardrail or sensitive data reaching AI show against them. The rest you attest.
### NIST AI RMF | partial
Some controls are **partly automated**. Most of the framework is about governance and risk processes, which you attest.
### ISO/IEC 42001 | partial
Some controls are **partly automated**. It is a management-system standard: most controls are your policies and records, which you attest. Onam does not certify you.
### EU AI Act | partial
Some controls are **partly automated**. Most obligations (risk management, documentation, human oversight) are evidenced by your own processes.
### MITRE ATLAS | info
**Used for the threat model.** ATLAS catalogues how AI systems are attacked. Onam uses it as a threat model, not as a pass/fail framework, so it has no pass rate.
### OWASP Agentic 2026 | no
**Not scored yet.** You can attest its controls; no Onam rule is linked to it yet.
:::

## Where do I see it?

On AI Security's **Compliance** tab, by framework or by resource, and in Onam's [compliance reports](/docs/compliance/frameworks).

:::screen /screens/ai-security/ais-compliance.webp
url: app.onamsecurity.com/ui/ai-security?tab=compliance
alt: The AI Security Compliance tab: six framework cards with their pass rate and counts of automated, partly automated and you-attest controls, and the OWASP LLM control table with type, checked-by and result columns.
size: 1440x1313
hidpi: yes
caption: ${CAPTURED}
1 @ 13.9,35.0: Six AI frameworks; each card splits controls into automated, partly automated and you attest.
2 @ 45,36.4: MITRE ATLAS is used for the threat model; OWASP Agentic is not scored yet.
3 @ 45.1,55.5: Each control says whether a rule checks it or you provide the evidence.
4 @ 90.3,55.5: A partly automated control fails when a linked rule finds a failing resource.
:::

:::ledger
+ Links AI findings to the controls they speak to, in four frameworks
+ Shows each control's type and what checks it, by framework or by resource
+ Lets you attest the controls no rule checks
+ Feeds the same evidence into Onam's compliance reports and exports
- Check every control in any framework automatically
- Certify you against ISO/IEC 42001 or declare EU AI Act conformity: an auditor or notified body does that
- Score OWASP Agentic yet
:::

:::next Keep going
### Does it cover our clouds? | /docs/ai-security/coverage
Pick a cloud and see exactly what is checked.
### Back to the overview | /docs/ai-security/overview
The AI estate map and the 2-minute story.
:::

## Questions customers ask

:::faq
### Does a clean AI compliance view mean we meet the EU AI Act?
No. It means the controls a configuration check can speak to show no failing findings. Most obligations in the Act, such as risk management, data governance, technical documentation and human oversight, are evidenced by your own processes.
### Our auditor asked for ISO/IEC 42001 evidence. What can we hand over?
The Compliance view for ISO/IEC 42001 with the linked findings and their status, your attestations, and the AI inventory as a record of which AI systems you run. Pair it with your own management-system documents.
### Why does a framework show 0% at first?
The pass rate counts automated controls only. Partly automated controls show a result once their rules have run, and controls you attest count once you attest them.
:::
`,
  },
  {
    slug: "ai-security/coverage",
    title: "AI Security coverage by cloud",
    breadcrumb: "AI Security / Coverage by cloud",
    description:
      "Which AI services AI Security discovers and checks on AWS, Azure, Google Cloud and Kubernetes, which clouds are not covered, and how the Coverage tab shows the gaps.",
    body: `
:::hero light
eyebrow: Does it cover our clouds?
title: AWS, Azure, Google Cloud and Kubernetes today. Pick yours to see exactly what.
lead: Managed AI services on three clouds, plus self-hosted AI on any connected cluster. Oracle Cloud, Alibaba Cloud and IBM Cloud AI services are not covered today.
chips: AWS · Azure · Google Cloud · Kubernetes
:::

## What is covered on my cloud?

:::switchboard Pick a cloud
### AWS | yes
**Amazon SageMaker and Amazon Bedrock:** inventory, configuration checks and Bedrock Guardrails presence. Bedrock and SageMaker roles are marked as AI agents in CIEM.
### Azure | yes
**Azure AI services accounts (including Azure OpenAI) and Azure Machine Learning workspaces:** inventory, configuration checks and Azure AI content filter presence.
### Google Cloud | yes
**Vertex AI endpoints, datasets and Workbench instances:** inventory, configuration checks and Google Model Armor presence.
### Kubernetes | partial
**Self-hosted AI on any connected cluster, on any cloud or on-premises:** model servers (Ollama, vLLM, TGI, LiteLLM, llama.cpp, LocalAI), Jupyter, MLflow, vector databases (Qdrant, Weaviate, Chroma, Milvus, pgvector, Redis as a vector store) and serving resources (KServe, KubeRay, NVIDIA NIM, Seldon). Inventory and exposure without authentication today; configuration rules are written, not yet switched on.
### Oracle Cloud | no
Managed AI services on Oracle Cloud are not checked. Self-hosted AI on an OKE cluster is covered as Kubernetes once the cluster is connected.
### Alibaba Cloud | no
Managed AI services on Alibaba Cloud are not checked. Self-hosted AI on a connected cluster is covered as Kubernetes.
### IBM Cloud | no
IBM watsonx and other IBM Cloud AI services are not checked.
### OpenAI platform | no
Not connected. Use of OpenAI libraries in your code appears in the AI bill of materials.
:::

The AI bill of materials comes from your SBOMs and does not depend on the cloud. Connect clouds and clusters in [Connect a cloud](/docs/onboarding/aws).

## How do I see what Onam can't see in my estate?

Open AI Security's **Coverage** tab. It lists each AI product, whether Onam is connected to it, how much of it Onam can read, and how many checks are active or still waiting.

:::screen /screens/ai-security/ais-coverage.webp
url: app.onamsecurity.com/ui/ai-security?tab=coverage
alt: The AI Security Coverage tab: a catalogue of 175 AI products split into cloud, self-run, SaaS and code, counters for products covered, checks active, checks waiting and products blocked, and a table of AWS Bedrock and SageMaker products with connection, read method and check counts.
size: 1440x1004
hidpi: yes
caption: ${CAPTURED} The counts are that workspace's.
1 @ 45,26.4: The catalogue of AI products, split by where they run: cloud, self-run, SaaS and code.
2 @ 61.1,32.6: **Checks waiting** are written but still being verified. They don't count until they pass.
3 @ 48.6,59.0: Whether Onam is connected to each AI product.
4 @ 73.6,59.0: How much of each product Onam can read: full, partial or none.
:::

A product can show **Connected** with no active checks: Onam can see it but does not check it yet. That is why a cloud can appear in the catalogue and still be "not covered" above. **Blocked** means the vendor offers no read-only access.

:::ledger
+ Managed AI services on AWS, Azure and Google Cloud
+ Self-hosted AI on any connected Kubernetes cluster: inventory and exposure
+ The AI bill of materials, whatever the cloud
+ A live Coverage tab that shows what Onam can and cannot see
- Oracle Cloud, Alibaba Cloud or IBM Cloud AI services
- The OpenAI platform
- Vertex AI feature stores, vector search and Colab, Azure Machine Learning connections or Bedrock knowledge-base data sources (not discovered yet)
- Configuration rules on self-hosted AI (written, not yet switched on)
:::

:::next Keep going
### Back to the overview | /docs/ai-security/overview
The AI estate map and the 2-minute story.
### Run a free audit scan | /audit-scan | cta
One read-only scan of your estate, no commitment.
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
