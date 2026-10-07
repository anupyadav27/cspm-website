import type { DocArticle } from "./types";
import {
  OPS_AGENTS,
  OPS_FEATURES,
  OPS_RISK_CLASSES,
  OPS_STATUS,
  OPS_USE_CASES,
  OPS_LEVELS,
  type OpsAgent,
} from "../operations";

/**
 * Docs for Onam AIOps (the agentic operations layer). Agent articles are generated from
 * src/data/operations.ts so the docs and the product page cannot disagree about an agent's
 * status, tools or limits. Honesty rules are in the header of that file.
 */

const label = (s: keyof typeof OPS_STATUS) => OPS_STATUS[s].label;

const AGENT_DOC_SLUGS = [
  "asset-agent",
  "security-agent",
  "compliance-agent",
  "data-agent",
  "automation-agent",
  "finops-agent",
  "dr-agent",
  "architecture-agent",
] as const;

function agentSection(a: OpsAgent): string {
  return `
## ${a.name}

**Status: ${label(a.status)}.** ${a.statusNote}

| | |
|---|---|
| Level | ${a.level} · ${a.levelName} |
| Authority | ${a.authority} |
| Answers | ${a.question} |

${a.purpose}

### What it does

${a.does.map((d) => `- ${d}`).join("\n")}

### Skills it may invoke

${a.skills.map((s) => `\`${s}\``).join(" · ")}

### Tools its skills may use

${a.tools.map((t) => `\`${t}\``).join(" · ")}

### What it must never do

${a.never.map((n) => `- ${n}`).join("\n")}

### Known limits

${a.limits}
`;
}

function agentArticle(slug: (typeof AGENT_DOC_SLUGS)[number]): DocArticle {
  const agents = OPS_AGENTS.filter((a) => a.slug === slug);
  const first = agents[0];
  const title = slug === "automation-agent" ? "Automation Agent" : first.name;
  const intro =
    slug === "automation-agent"
      ? "The Automation Agent works in two modes: a planner that turns a recommendation into a reversible change proposal, and an actor that may execute only from an approval."
      : `The ${first.name} — ${first.question.charAt(0).toLowerCase()}${first.question.slice(1)}`;
  return {
    slug: `operations/agents/${slug}`,
    title,
    breadcrumb: `Onam AIOps / Agents / ${title}`,
    body: `
${intro}

Every agent in Onam AIOps is a versioned definition — purpose, level, skills, tools and permissions held as data — certified through scope review, security review, an evaluation suite and documentation before it can be enabled. See [how agents work](/docs/operations/concepts) and the [full roster](/docs/operations/agents).
${agents.map(agentSection).join("\n---\n")}
> Status labels mean exactly what [Availability](/docs/operations/availability) says. Nothing marked “On the roadmap” is offered today.
`,
  };
}

export const articles: DocArticle[] = [
  {
    slug: "operations/overview",
    title: "Onam AIOps overview",
    breadcrumb: "Onam AIOps / Overview",
    body: `
Onam AIOps is a workspace where your team works with specialist AI agents that investigate your cloud with evidence and change nothing without a person’s approval.

> **Status: Early access.** Onam AIOps runs on the Onam platform and is enabled per organisation by invitation, starting with AWS and the Onam Security inventory and findings. Organisations start at the “propose” ceiling: agents answer, investigate and propose; nothing changes your cloud. See [Availability](/docs/operations/availability) for every capability’s status.

## What it is

A real question about a cloud estate usually spans several consoles — security findings, inventory, cost, recovery — and today someone joins the answers by hand. Onam AIOps adds a workspace above the products that already know your cloud:

- An **orchestrator** turns your request into a visible plan and routes each step to a specialist agent.
- **Specialist agents** — Asset, Security, Compliance, Data, Automation, and later FinOps, DR and Architecture — each with a declared job, permissions and limits.
- **Evidence** on every claim: the skill, query, rows and scan behind each number.
- An **approval centre** where every proposed change is decided by a named person, diff first.
- An **audit trail** of every turn, tool call, decision and approval, append-only and hash-chained.

## What it is not

- **Not a chatbot.** A chatbot answers. This plans, investigates, proposes and records.
- **Not autonomous.** Every change to a customer cloud passes a human approval gate. No setting removes it.
- **Not a second scanner.** Agents reason over the data the products already resolved. An agent that re-scans your cloud is a bug.

## How it relates to the AI Assistant

The [AI Assistant](/platform/ai-assistant) inside Onam Security is available to every customer today: ask questions about your findings and get cited answers. Onam AIOps is the workspace above it — plans, tasks, approvals and an audit trail across specialist agents.

## Read next

- [Concepts](/docs/operations/concepts) — agents, skills, tools, tasks, approvals, evidence
- [The workspace](/docs/operations/workspace)
- [The agents](/docs/operations/agents)
- [Governance and approvals](/docs/operations/governance)
- [Security and safety](/docs/operations/security)
- [Architecture](/docs/operations/architecture)
`,
  },
  {
    slug: "operations/availability",
    title: "Availability and status",
    breadcrumb: "Onam AIOps / Availability",
    body: `
What in Onam AIOps you can use today, what is in early access or development, and what is on the roadmap — stated plainly, capability by capability.

## What the labels mean

| Label | Meaning |
|---|---|
${(["available", "early", "development", "roadmap"] as const).map((s) => `| **${label(s)}** | ${OPS_STATUS[s].meaning} |`).join("\n")}

## Capabilities

| Capability | Status | Detail |
|---|---|---|
${OPS_FEATURES.map((f) => `| ${f.name} | ${label(f.status)} | ${f.detail} |`).join("\n")}

## Agents

| Agent | Level | Status | Note |
|---|---|---|---|
${OPS_AGENTS.map((a) => `| [${a.name}](/docs/operations/agents/${a.slug}) | ${a.level} | ${label(a.status)} | ${a.statusNote} |`).join("\n")}

## Use cases

| Use case | Agents | Status |
|---|---|---|
${OPS_USE_CASES.map((u) => `| ${u.title} | ${u.agents} | ${label(u.status)} |`).join("\n")}

## Getting early access

Early access is by invitation. Onam enables your organisation, connects the agents to your Onam Security data, and sets your autonomy ceiling to “propose”. [Ask for early access](/request-demo).

> Executing changes in your cloud is not offered in early access. When it is, it will need a write role you create in your own account and an autonomy ceiling you raise yourself — and every change will still need a person’s approval.
`,
  },
  {
    slug: "operations/concepts",
    title: "Concepts: agents, skills, tools, tasks and approvals",
    breadcrumb: "Onam AIOps / Concepts",
    body: `
The words Onam AIOps uses, each with one meaning. Permissions are only reasonable when these are never used interchangeably.

## The vocabulary

| Term | Meaning | Example |
|---|---|---|
| **Agent** | A specialist with a declared purpose, level, skills, tools and permissions — a versioned definition, not a prompt | Security Agent, L1 |
| **Skill** | A declared, versioned capability with typed input and output, a risk level and an evidence contract | \`find_public_exposure\` |
| **Tool** | A concrete integration that touches something outside the platform | \`cei.query\` |
| **Permission** | Authority for one agent to perform one action on one class of resource through one tool | Security Agent may *read* findings |
| **Policy** | A rule, held as data, that decides whether something may happen and how many approvals it needs | Production security-group changes are high risk |
| **Task** | One unit of work with a lifecycle, an owner and a result | Investigate exposure of one instance |
| **Workflow** | A versioned multi-step procedure that can outlive a request | Prepare an account for audit |
| **Action** | A single attempted change to the outside world | Replace one ingress rule |
| **Approval** | A recorded human decision authorising one specific change at one version | Approved by a named person, bound to the change’s hash |
| **Evidence** | The data behind a claim, retained and addressable | Query, 14 rows, scan ID, time observed |
| **Memory** | What an agent keeps between turns, deliberately narrow | “This organisation treats staging as production for data classification” |

## How they relate

- A person creates a **task**; the orchestrator assigns its steps to **agents**.
- An agent invokes **skills**; skills use **tools**; only the tool gateway runs a tool.
- Every tool call is gated by **permission**; **policy** classifies the risk.
- Skills produce **evidence**. A change needs an **approval** before an **action** can exist.

Two rules follow and are enforced everywhere:

1. **The only path to your cloud runs through an approval.** There is no route from an agent to your cloud.
2. **Agents never call tools.** The skill layer exists so capability can be governed as data.

## Agent levels

| Level | Name | Reads | Writes | Approval |
|---|---|---|---|---|
${OPS_LEVELS.map((l) => `| ${l.level} | ${l.name} | ${l.reads} | ${l.writes} | ${l.approval} |`).join("\n")}

An agent’s level is fixed in its definition. Promotion needs re-certification; it is never a runtime decision.

## Memory never holds a fact about your estate

Estate facts change; a remembered fact goes stale silently. Agents read the current estate on every turn, with its observed time. Memory holds preferences and context you give them — and never a secret.
`,
  },
  {
    slug: "operations/workspace",
    title: "The workspace",
    breadcrumb: "Onam AIOps / Workspace",
    body: `
The Onam AIOps workspace is shaped like team chat and behaves like an operations console: plans, evidence, approvals and an audit trail around the conversation.

> **Status: Early access.** Screens below are described from the design; the illustrations on the [product page](/platform/ai-operations#workspace) are mockups with sample data, not screenshots.

## Three rules

| Rule | In the interface |
|---|---|
| Every claim is inspectable | Numbers and names in an agent’s reply open the evidence: skill, query, rows, scan and time |
| The plan is visible before it runs | A multi-step request shows its steps first, so you can stop it before it works |
| Actions look like changes, not messages | Proposed changes are distinct cards — diff first, with explicit decision buttons |

## Navigation

| Group | Screens |
|---|---|
| Needs you | Home (what is waiting, running, failed) · Approvals · Inbox |
| Ask | Chat · Assets (the estate the agents see) · Agents (who does what, and may touch what) |
| Run | Tasks · Workflows · Reports |
| Govern | Knowledge (what you told the agents) · Activity (the audit trail and its chain) · Settings (autonomy, budget, kill switch) |

## Chat

The primary working surface. Each agent answers in its own card, marked with its colour, so you always know who said what. You can target one agent (\`@Security\`), scope a question to accounts or environments, inspect evidence, and stop a running task at any time. A partially failed answer is never styled as a complete one: the unavailable domain is named.

## Agents

The agent directory shows each agent’s purpose, level, status and skills. An agent’s detail page lists its skills, tools, permission tuples, knowledge sources and known limits — a trust surface, so you can see exactly what it may touch.

## Tasks

Every unit of work, its state and what it is waiting on: running, waiting for approval, failed with a classified reason, cancelled or rolled back.

## Approvals

The single queue where changes are decided — grouped by risk then age. Each card leads with the exact change, then blast radius, reason, rollback and impact. You can approve, reject (with a reason), modify within declared bounds, or simulate. See [Governance and approvals](/docs/operations/governance).

## Activity

The audit record: query by user, agent, task, resource, action or time, with a check that the hash chain is intact — no record edited or removed.

## Reports

A conversation or task exported with its evidence preserved.

## Settings and the kill switch

Enable or disable agents for your organisation, set the autonomy ceiling, budgets and notification routing. The kill switch stops all agent activity for your organisation; it asks you to type the organisation name and says plainly what will happen.
`,
  },
  {
    slug: "operations/orchestrator",
    title: "The orchestrator",
    breadcrumb: "Onam AIOps / Orchestrator",
    body: `
The orchestrator turns a request into a plan, routes each step to a specialist agent, joins the results and surfaces conflicts. It never answers on its own.

> **Status: Early access.**

## What it does

1. Detects the intent and classifies the request.
2. Breaks it into steps and picks the agent for each.
3. Builds a plan and resolves dependencies — steps with no dependency run in parallel.
4. Passes each step the previous step’s result set, so agents narrow rather than re-discover.
5. Aggregates the answers on one canonical resource identity.
6. Surfaces conflicts between agents to you.
7. If an action is needed, raises it for approval — and stops there.

The orchestrator has **no access to estate data itself**. An orchestrator that could read data would eventually answer a question on its own, unaudited and without evidence.

## Kinds of request

| Kind | Produces | Example |
|---|---|---|
| Question | A direct answer from one agent | “How many production instances are in this account?” |
| Investigation | A plan and a joined answer | “Which exposed assets have critical findings, and who owns them?” |
| Action request | A plan, a proposal and an approval | “Close SSH from the internet on these instances.” |
| Workflow start | A workflow run | “Prepare this account for audit.” |
| Report | A synthesised document with evidence | “Give me the exposure summary for the board.” |
| Unsupported | A refusal with the reason | Anything outside cloud operations, or unsafe |

## Conflicts are never auto-resolved

| Conflict | Example | What happens |
|---|---|---|
| Fact | Two sources disagree on an instance size | Both shown with sources and times; a declared precedence applies and is flagged |
| Judgement | Security says remove it; another agent says it is a recovery dependency | Escalated to you with both positions and their evidence |
| Recommendation | Downsize versus scale out | Shown as a trade-off; the orchestrator does not pick |
| Staleness | One source is hours older | The oldest time is reported as the answer’s freshness |

## Failure handling

Permission denied is reported as “not authorised”, never as “no data”. A product that is down is named in the answer and the rest of the plan continues. A budget or loop limit stops the task and reports what is left undone. A failed validation after a change rolls back and is never retried with the same change.
`,
  },
  {
    slug: "operations/agents",
    title: "The specialist agents",
    breadcrumb: "Onam AIOps / Agents",
    body: `
Onam AIOps has eight specialist agent roles, each with a declared job, level, skills, tools and limits. Automation works in two modes: planner and actor.

![The orchestrator routes to read-and-recommend agents and proposing agents; proposals pass a human approval gate before the automation actor may execute.](/diagrams/ops-agent-roster.svg)

## The roster

| Agent | Level | Answers | Status |
|---|---|---|---|
${OPS_AGENTS.map((a) => `| [${a.name}](/docs/operations/agents/${a.slug}) | ${a.level} · ${a.authority} | ${a.question} | ${label(a.status)} |`).join("\n")}

## How agents escalate

Escalation is upward-only and explicit. An investigating agent that finds something needing a change hands it to the Automation planner through the orchestrator; it never acquires the capability itself. Ambiguity goes to a person. Conflicts go to the orchestrator, which shows them to you.

## How an agent is certified

No agent is enabled until it passes four gates, each producing a recorded artifact:

1. **Scope review** — every skill, tool and permission is necessary, and the narrowest that works.
2. **Security review** — the prompt-injection test corpus passes in full; no path to an unregistered tool; cross-customer tests pass.
3. **Evaluation** — accuracy, groundedness, tool success and cost per task meet declared floors on test estates.
4. **Documentation** — purpose, capabilities and known limits written for customers. An agent with no documented limits has not been examined.
`,
  },
  ...AGENT_DOC_SLUGS.map(agentArticle),
  {
    slug: "operations/governance",
    title: "Governance and approvals",
    breadcrumb: "Onam AIOps / Governance",
    body: `
How Onam AIOps decides what an agent may do, how risk is classified, and how a person approves a change before anything is applied.

> The approval centre is in **early access**. Executing an approved change in a customer cloud is **on the roadmap**.

## Principles, in priority order

1. **Human in the loop** — no configuration allows a change to your cloud without a recorded human approval. There is no flag for this.
2. **Fail safe** — on ambiguity, timeout, missing data or policy doubt, stop and report.
3. **Least privilege** — each agent holds the narrowest scope that does its job, checked per call.
4. **Explicit authorisation** — permission is granted to an agent, organisation, accounts, resource class, tool and action — never implied by a role.
5. **Evidence-based** — a claim with no evidence is a defect.

## Permissions

A permission is a tuple: agent · organisation · accounts · resource class · tool · action. The effective permission is the intersection of the agent’s grant, your own authority, your organisation’s policy and the conversation’s scope. An agent cannot exceed the person it acts for, and **no agent can ever hold the approve action** — the database refuses to record it.

## Risk classes

Risk is assigned by policy from the kind of change, resource class, environment, blast radius, reversibility and data sensitivity. **An agent never classifies its own risk.**

| Risk | Approval | Examples |
|---|---|---|
${OPS_RISK_CLASSES.map((r) => `| ${r.cls} | ${r.approval} | ${r.examples} |`).join("\n")}

A change is raised one class automatically when the target is production, is on an attack path to a crown jewel, holds regulated data, supports a tier-1 recovery plan, has no rollback, affects more than ten resources, or falls in a change freeze. **Nothing lowers a class.** Your organisation may set a higher floor, never a lower one.

## What makes an approval real

| Property | Meaning |
|---|---|
| Bound to the change | The approval records the change’s hash; approving one change cannot authorise another |
| Drift-checked | The target is re-read just before execution; if it changed, the approval is superseded |
| Expiring | Default seven days |
| Dual control | Critical changes need two distinct approvers, one an organisation admin |
| Separation of duties | Where enabled, the requester cannot approve |
| Reasoned rejection | A reason is mandatory and fed back to the agents |
| Rollback first | The approver sees the rollback plan before deciding; an irreversible change is approved as irreversible |
| Measured | Review time is recorded, so rubber-stamping becomes visible |

![Approval lifecycle: proposal, risk class, pending, the four decisions, approval bound to a hash, drift check before execution.](/diagrams/ops-approval-flow.svg)

## The four decisions

- **Approve** — records the decision and binds the change’s hash.
- **Reject** — terminal for this change; a reason is mandatory.
- **Modify** — change parameters within the bounds the skill declares; risk is re-classified.
- **Simulate** — a dry run with no side effect, shown before you decide.

An approval link in an email or chat message only opens the workspace — it never decides.

## Autonomy ceiling and kill switch

Your organisation sets how far agents may go: read → analyse → recommend → simulate → propose → execute. Early access starts at **propose**. The kill switch in Settings stops all agent activity for your organisation; tasks in flight are cancelled safely and nothing already executed is reverted.

## Audit

Every agent turn, tool call, decision, approval and action is recorded with actor, time, input, output and justification — append-only and hash-chained, so an edit or deletion is detectable. The Activity screen shows whether the chain is intact.
`,
  },
  {
    slug: "operations/security",
    title: "Security and AI safety",
    breadcrumb: "Onam AIOps / Security",
    body: `
Onam AIOps is designed on the assumption that a model can be fooled. The controls that protect your cloud sit in code, in the call path.

## Tenant isolation at every layer

Your data never crosses to another customer — in a query, a cache, an agent’s memory, the context assembled for a model, a model call, an event, or a log line. Each layer is isolated and tested on its own, because one mechanism covering everything is one bug away from a breach. Identity and organisation come only from the platform gateway, never from a request body.

## Zero-trust agents

An agent is an untrusted principal. It has an identity on every call; its scope is verified on every call; it cannot change its own definition, permissions, level or model; escalating to another agent transfers no authority; and it can be disabled in seconds without a deploy.

## Prompt injection

Text in your cloud — resource tags, object keys, policy descriptions, finding titles, commit messages — can be written by an attacker. Onam AIOps treats all of it as untrusted:

1. **Structured tool output only.** Free text from the estate travels in designated fields, never spliced into instructions.
2. **Instruction and data separated.** Untrusted content is delimited and labelled as data.
3. **Detection.** Known patterns are quarantined and logged; the investigation continues without them.
4. **Authorisation after the model — the decisive control.** Whatever the model was persuaded to attempt, the policy engine and tool gateway check it against the agent’s declared scope, in code.
5. **No new instructions through tool results.** Tool output cannot introduce tools, skills or instructions.

The first three reduce the chance an injection succeeds. The last two mean that when one does, nothing happens.

![Eight steps of an agent turn, with the policy check before the tool call and sanitising before the result returns to the model.](/diagrams/ops-agent-turn.svg)

## Groundedness

Every factual claim cites the skill, tool, query and rows behind it. Resource, finding and account identifiers must come from a tool result. When an agent cannot ground a claim it says so — “unable to verify” is a designed answer.

## Models

All inference goes through one model gateway: approved models only, in the region agreed with you, one customer’s data per call. Today it routes to Amazon Bedrock in-region. Customer data is never used to train or fine-tune a model. Agents that propose or act fail safe rather than fall back to a weaker model.

## Runaway protection

Every agent level has ceilings on tool calls and time, every task a cost ceiling, and repeated identical calls are detected and stopped. When a ceiling is reached, the task stops and reports what was spent and what is left undone.

## Execution sandbox (on the roadmap)

When execution is offered, changes will run in an isolated namespace holding the only write credential: default-deny egress allowlisted per action, a short-lived role scoped to the target, one action per container, a hard time limit, and every call captured as evidence.
`,
  },
  {
    slug: "operations/architecture",
    title: "Architecture",
    breadcrumb: "Onam AIOps / Architecture",
    body: `
The block architecture of Onam AIOps: eight blocks on the request path, a control plane beside them, and three forks — read, execute, infer.

![Block architecture: workspace, entry, orchestration, agents and capability blocks descend to Cloud Estate Intelligence, the execution sandbox and approved models, with governance, policy, approval and audit beside them.](/diagrams/ops-block-architecture.svg)

## The request path

| Block | Contains | Must never |
|---|---|---|
| A · Experience | Workspace UI, embedded panels, API clients | Hold a credential or call a product backend directly |
| B · Entry | The platform API gateway and the Operations API | Accept a tenant ID from a request body |
| C · Orchestration | Orchestrator, task service, workflow engine | Read estate data, or decide whether a control applies |
| D · Agents | Agent runtime, registry, context engine, memory | Call a tool directly, or change its own scope |
| E · Capability | Skill runtime, tool gateway, model gateway | Let unsanitised text back into the model’s context |
| F · Intelligence | Cloud Estate Intelligence | Write anything, or guess an identity mapping |
| G · Execution | The execution sandbox | Start without an approval record |
| H · Models | Approved model providers | Receive data outside the permitted provider or region |

## The control plane

Governance (kill switch, registries), the policy engine (permissions, risk class), the approval service (the human gate) and audit and evidence (append-only, hash-chained) sit beside every block. They are in the call path, not advisory: each can refuse, and a refusal stops the request.

## Two paths

![Read path with three gates; write path with seven gates including a person approving the exact change.](/diagrams/ops-read-write-paths.svg)

Reading passes entitlement, agent scope and the tenant filter, and returns an answer with evidence. Writing passes entitlement, agent scope, the actor level, an execute permission, a policy risk class, a person approving the exact change and a drift check — then runs in the sandbox, is validated, and rolls back on failure.

## Cloud Estate Intelligence

A read-only layer over what the products already found. It reads published contract views of each product’s data — never their own tables — resolves every resource to one canonical identity, stamps every row with when it was observed, and says which sources were unavailable. In early access it carries the Onam Security inventory, assets and findings; relationships, exposure, attack paths and compliance results are being connected; cost and recovery data are on the roadmap.

## Five architectural commitments

1. The agent layer never touches a product database directly.
2. Nothing reaches a customer cloud except through the tool gateway and the sandbox.
3. No component holds a model SDK; inference goes through the model gateway.
4. Identity comes only from the platform gateway.
5. Agent records live alongside the platform’s own, under the same tenancy rules.

The product page has the same design with diagrams: [How Onam AIOps is designed](/platform/ai-operations/architecture).
`,
  },
];
