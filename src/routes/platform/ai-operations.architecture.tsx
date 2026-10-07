import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { DiagramFigure, OpsSection, StatusBadge } from "@/components/site/ops/OpsUi";
import { OPS_LEVELS } from "@/data/operations";
import { seo } from "@/lib/seo";

/**
 * How Onam AIOps is designed — block architecture, drawn from the agentic platform's
 * docs/05 §1 (block architecture), docs/18 (architecture views), docs/03 (agents, permissions),
 * docs/08 (security) and docs/10 (approval). Diagrams live in public/diagrams/ops-*.svg.
 * Status badges follow src/data/operations.ts. Executing changes is ON THE ROADMAP.
 */

export const Route = createFileRoute("/platform/ai-operations/architecture")({
  head: () =>
    seo({
      title: "How Onam AIOps is designed — agentic architecture",
      description:
        "Onam AIOps architecture: orchestrator, agent runtime, model and tool gateways, estate intelligence and a human approval gate before any change.",
      path: "/platform/ai-operations/architecture",
    }),
  component: ArchitecturePage,
});

const SPINE = [
  "Person",
  "Agent",
  "Multi-agent plan",
  "Workflow",
  "Tool",
  "Cloud",
  "Validation",
  "Evidence",
];

const BLOCKS: { id: string; name: string; contains: string; never: string }[] = [
  {
    id: "A",
    name: "Experience",
    contains: "Workspace UI, embedded panels, API clients",
    never: "Hold a credential, or call a product backend directly",
  },
  {
    id: "B",
    name: "Entry",
    contains: "The existing platform API gateway and the Operations API",
    never: "Accept a tenant ID from a request body",
  },
  {
    id: "C",
    name: "Orchestration",
    contains: "Orchestrator, task service, workflow engine",
    never: "Read estate data itself, or decide whether a control applies",
  },
  {
    id: "D",
    name: "Agents",
    contains: "Agent runtime, agent registry, context engine, memory",
    never: "Call a tool directly, or modify its own definition or scope",
  },
  {
    id: "E",
    name: "Capability",
    contains: "Skill runtime, tool gateway, model gateway",
    never: "Let unsanitised text re-enter the model’s context",
  },
  {
    id: "F",
    name: "Intelligence",
    contains: "Cloud Estate Intelligence: estate query, graph, identity resolver",
    never: "Write anything, or guess an identity mapping",
  },
  {
    id: "G",
    name: "Execution",
    contains: "The execution sandbox",
    never: "Start without an approval record, or reach a host outside its allowlist",
  },
  {
    id: "H",
    name: "Models",
    contains: "Approved model providers",
    never: "Receive data outside the permitted provider or region",
  },
];

const CONTROL: { name: string; does: string; never: string }[] = [
  {
    name: "Governance",
    does: "Kill switch, organisation settings, agent / skill / tool registries",
    never: "Be bypassed at runtime",
  },
  {
    name: "Policy engine",
    does: "Evaluates the permission tuple and assigns the risk class",
    never: "Be influenced by prompt content",
  },
  {
    name: "Approval service",
    does: "Records a person’s decision bound to the change’s hash",
    never: "Be held or exercised by an agent",
  },
  {
    name: "Audit and evidence",
    does: "Append-only, hash-chained record of every call, success or failure",
    never: "Be updated or deleted",
  },
];

const VOCAB: [string, string][] = [
  [
    "Agent",
    "A specialist with a declared purpose, level, skills, tools and permissions — a versioned definition, not a prompt.",
  ],
  [
    "Skill",
    "A declared, versioned capability with typed input and output, a risk level and an evidence contract. Agents invoke skills.",
  ],
  [
    "Tool",
    "A concrete integration that touches something outside the platform. Only skills invoke tools; only the tool gateway runs them.",
  ],
  [
    "Permission",
    "Authority for one agent to perform one action on one class of resource through one tool, in one organisation.",
  ],
  [
    "Policy",
    "A rule, held as data, that decides whether something may happen and how many approvals it needs.",
  ],
  [
    "Task",
    "One unit of work with a lifecycle, an owner and a result — visible in the task centre.",
  ],
  [
    "Workflow",
    "A versioned multi-step procedure that can outlive a single request, such as preparing an account for audit.",
  ],
  [
    "Action",
    "A single attempted change to the outside world. Only the automation actor performs one, only from an approval.",
  ],
  [
    "Approval",
    "A recorded human decision authorising one specific change at one specific version.",
  ],
  ["Evidence", "The data behind a claim — query, rows, scan and time — retained and addressable."],
  [
    "Memory",
    "What an agent keeps between turns, deliberately narrow. It never holds an estate fact or a secret.",
  ],
];

const ACTIONS: [string, string, string][] = [
  ["read", "Retrieve existing data", "Any agent"],
  ["analyse", "Compute over retrieved data", "Any agent"],
  ["recommend", "Produce a proposal", "Any agent — applying it needs approval"],
  ["simulate", "Dry-run with no side effect", "Any agent"],
  ["execute · modify", "Apply or alter a change", "L3 actor only, per risk class"],
  ["delete", "Remove a resource", "L3 actor only, always high or critical"],
  ["approve", "Authorise an action", "Never an agent — people only"],
];

function ArchitecturePage() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-[#E5E9F0] bg-white">
        <div className="absolute inset-0 dot-grid opacity-60" />
        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6 md:pt-20">
          <Link
            to="/platform/ai-operations"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2563EB] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Onam AIOps
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-[#DBE7FE] bg-[#EFF4FF] px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-[#1D4ED8]">
              How it is designed
            </span>
            <StatusBadge status="early" />
          </div>
          <h1 className="mt-5 max-w-4xl font-display text-4xl font-black leading-[1.06] tracking-tight text-[#0B1220] md:text-[56px]">
            Every arrow is a <span className="gradient-text">control point</span>, not a pipe.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#475569]">
            Onam AIOps is a governed agent platform built above the products that already know
            your cloud. It reasons over their resolved data instead of re-scanning, sends every call
            through one tool gateway and one model gateway, and puts a person between any
            recommendation and any change. This page walks through the design, block by block.
          </p>
          <ol className="mt-8 flex flex-wrap items-center gap-2 text-[13px]">
            {SPINE.map((s, i) => (
              <li key={s} className="flex items-center gap-2">
                <span
                  className={`rounded-lg border px-2.5 py-1.5 font-semibold ${s === "Cloud" ? "border-[#FCA5A5] bg-[#FEF2F2] text-[#991B1B]" : "border-[#E5E9F0] bg-white text-[#0B1220]"}`}
                >
                  {s}
                </span>
                {i < SPINE.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-[#94A3B8]" />}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[13px] text-[#64748B]">
            Each step can refuse. Nothing reaches your cloud without passing back through a person.
          </p>
        </div>
      </section>

      <OpsSection
        id="blocks"
        eyebrow="Block architecture"
        title="Eight blocks on the request path, four beside it"
        intro={
          <p>
            A request descends one block at a time and never skips one. Beside every block runs a
            control plane — governance, policy, approval and audit — that is in the call path rather
            than advisory: each can refuse, and a refusal stops the request. Below the capability
            block the path forks three ways: reading the estate, executing an approved change, and
            calling a model. Only the execution fork can change anything.
          </p>
        }
        tint
      >
        <DiagramFigure
          src="/diagrams/ops-block-architecture.svg"
          alt="Block architecture: workspace, entry, orchestration, agents and capability blocks descend to Cloud Estate Intelligence, the execution sandbox and approved models, with a control-plane column of governance, policy, approval and audit beside them."
          caption="Products feed Cloud Estate Intelligence; agents reach it only through the tool gateway; inference goes only through the model gateway; changes go only through the approval gate and the sandbox."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr] [&>*]:min-w-0">
          <div className="overflow-x-auto rounded-xl border border-[#E5E9F0] bg-white">
            <table className="w-full min-w-[560px] text-left text-[13.5px]">
              <thead className="bg-[#F8FAFC] text-[#0B1220]">
                <tr>
                  <th className="px-3 py-2.5 font-semibold">Block</th>
                  <th className="px-3 py-2.5 font-semibold">Contains</th>
                  <th className="px-3 py-2.5 font-semibold">Must never</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E9F0]">
                {BLOCKS.map((b) => (
                  <tr key={b.id} className="align-top">
                    <td className="whitespace-nowrap px-3 py-2.5 font-semibold text-[#0B1220]">
                      <span className="mr-1.5 font-mono text-[#2563EB]">{b.id}</span>
                      {b.name}
                    </td>
                    <td className="px-3 py-2.5 text-[#475569]">{b.contains}</td>
                    <td className="px-3 py-2.5 text-[#7F1D1D]">{b.never}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-3">
            {CONTROL.map((c) => (
              <div key={c.name} className="rounded-xl border border-[#E5E9F0] bg-white p-4">
                <div className="font-semibold text-[#0B1220]">{c.name}</div>
                <div className="mt-1 text-[13.5px] text-[#475569]">{c.does}</div>
                <div className="mt-1 text-[13px] text-[#7F1D1D]">
                  Must never: {c.never.charAt(0).toLowerCase() + c.never.slice(1)}.
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-[14px] leading-relaxed text-[#475569]">
          The “must never” column is the useful one. A diagram that only says what each block does
          cannot be enforced; one that says what each block is forbidden to do becomes a review
          checklist and a set of automated build checks.
        </p>
      </OpsSection>

      <OpsSection
        id="estate"
        eyebrow="Cloud Estate Intelligence"
        title="Agents reason over resolved truth — they do not rediscover your cloud"
        intro={
          <p>
            The products already scan your cloud. Cloud Estate Intelligence is a read-only layer
            over what they found: assets, relationships, findings and, in time, cost and recovery.
            Agents query it instead of calling cloud APIs, which is the difference between an answer
            in seconds and an answer after a fresh scan. An agent that goes and scans your cloud
            itself is treated as a bug.
          </p>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 [&>*]:min-w-0">
          {[
            [
              "Read through contracts",
              "It reads published, read-only views of each product’s data — never a product’s own tables — under a role that can only select.",
            ],
            [
              "One identity per resource",
              "An identity resolver maps each product’s resource IDs to one canonical ID, so answers join on the same resource rather than a similar name.",
            ],
            [
              "Freshness on every row",
              "Results carry the time they were observed and the scan they came from, so an answer can say how old it is.",
            ],
            [
              "Honest about gaps",
              "If a source is unavailable, the answer says which domain is missing and what is therefore unknown, instead of quietly returning less.",
            ],
          ].map(([t, b]) => (
            <div key={t} className="rounded-2xl border border-[#E5E9F0] bg-white p-5">
              <div className="font-display text-[16px] font-bold text-[#0B1220]">{t}</div>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#475569]">{b}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 overflow-x-auto rounded-xl border border-[#E5E9F0] bg-white">
          <table className="w-full min-w-[520px] text-left text-[13.5px]">
            <thead className="bg-[#F8FAFC] text-[#0B1220]">
              <tr>
                <th className="px-3 py-2.5 font-semibold">Data source</th>
                <th className="px-3 py-2.5 font-semibold">What agents see</th>
                <th className="px-3 py-2.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E9F0]">
              {(
                [
                  [
                    "Onam Security — inventory, assets, findings",
                    "What exists and what is wrong with it",
                    "early",
                  ],
                  [
                    "Onam Security — relationships, exposure, attack paths, compliance results",
                    "How it connects, what is reachable, which controls hold",
                    "development",
                  ],
                  ["Cost data (Onam FinOps)", "What it costs and what is wasted", "roadmap"],
                  ["Recovery data (Onam DRM)", "What would come back, and how fast", "roadmap"],
                ] as const
              ).map(([src, what, st]) => (
                <tr key={src} className="align-top">
                  <td className="px-3 py-2.5 font-semibold text-[#0B1220]">{src}</td>
                  <td className="px-3 py-2.5 text-[#475569]">{what}</td>
                  <td className="px-3 py-2.5">
                    <StatusBadge status={st} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </OpsSection>

      <OpsSection
        id="runtime"
        eyebrow="Agent runtime and model gateway"
        title="One turn: budgeted, scope-checked, recorded"
        intro={
          <p>
            Each agent turn runs the same eight steps. Two orderings matter more than the rest: the
            permission check happens before the tool call, and sanitising happens before the result
            goes back to the model. Reversing either would open a privilege-escalation or an
            injection path.
          </p>
        }
        tint
      >
        <DiagramFigure
          src="/diagrams/ops-agent-turn.svg"
          alt="Eight steps of an agent turn: governance check, context assembly, skill choice through the model gateway, policy check, tool gateway, estate query, sanitising, and answer with evidence."
          caption="If the model is persuaded by injected text to try something else, the policy engine and tool gateway still refuse it."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3 [&>*]:min-w-0">
          {[
            [
              "Model gateway",
              "No component holds a model SDK. All inference goes through one gateway that enforces the approved-model list, your region, per-task budgets, and that only one customer’s data is in any call. Today it routes to Amazon Bedrock in-region.",
            ],
            [
              "No silent downgrade",
              "Agents that propose or act do not fall back to a weaker model when the preferred one is unavailable; they fail safe and say so.",
            ],
            [
              "Budgets and loops",
              "Every level has a ceiling on tool calls and wall-clock time, and every task a cost ceiling. Repeated identical calls are detected and the task is stopped.",
            ],
          ].map(([t, b]) => (
            <div key={t} className="rounded-2xl border border-[#E5E9F0] bg-white p-5">
              <div className="font-display text-[16px] font-bold text-[#0B1220]">{t}</div>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#475569]">{b}</p>
            </div>
          ))}
        </div>
      </OpsSection>

      <OpsSection
        id="vocabulary"
        eyebrow="Concepts"
        title="Eleven words that are never used interchangeably"
        intro={
          <p>
            Agent platforms go wrong when a dozen concepts collapse into three words and nobody can
            reason about permissions. These are fixed.
          </p>
        }
      >
        <dl className="grid gap-3 md:grid-cols-2 [&>*]:min-w-0">
          {VOCAB.map(([k, v]) => (
            <div key={k} className="rounded-xl border border-[#E5E9F0] bg-white p-4">
              <dt className="font-semibold text-[#0B1220]">{k}</dt>
              <dd className="mt-1 text-[13.5px] leading-relaxed text-[#475569]">{v}</dd>
            </div>
          ))}
        </dl>
      </OpsSection>

      <OpsSection
        id="permissions"
        eyebrow="Permissions and levels"
        title="An agent cannot exceed the person it acts for"
        intro={
          <p>
            A permission is a tuple — agent, organisation, accounts, resource class, tool, action —
            and the effective permission is the intersection of what the agent is granted, what you
            are allowed to do, your organisation’s policy and the scope of the conversation. An
            agent acting for a read-only viewer can do no more than that viewer.
          </p>
        }
        tint
      >
        <div className="grid gap-6 lg:grid-cols-2 [&>*]:min-w-0">
          <div className="overflow-x-auto rounded-xl border border-[#E5E9F0] bg-white">
            <table className="w-full min-w-[440px] text-left text-[13.5px]">
              <thead className="bg-[#F8FAFC] text-[#0B1220]">
                <tr>
                  <th className="px-3 py-2.5 font-semibold">Level</th>
                  <th className="px-3 py-2.5 font-semibold">Writes</th>
                  <th className="px-3 py-2.5 font-semibold">Approval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E9F0]">
                {OPS_LEVELS.map((l) => (
                  <tr key={l.level} className="align-top">
                    <td className="whitespace-nowrap px-3 py-2.5 font-semibold text-[#0B1220]">
                      {l.level} · {l.name}
                    </td>
                    <td className="px-3 py-2.5 text-[#475569]">{l.writes}</td>
                    <td className="px-3 py-2.5 text-[#475569]">{l.approval}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto rounded-xl border border-[#E5E9F0] bg-white">
            <table className="w-full min-w-[440px] text-left text-[13.5px]">
              <thead className="bg-[#F8FAFC] text-[#0B1220]">
                <tr>
                  <th className="px-3 py-2.5 font-semibold">Action</th>
                  <th className="px-3 py-2.5 font-semibold">Meaning</th>
                  <th className="px-3 py-2.5 font-semibold">Who may hold it</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E9F0]">
                {ACTIONS.map(([a, m, w]) => (
                  <tr key={a} className="align-top">
                    <td className="whitespace-nowrap px-3 py-2.5 font-mono text-[12.5px] text-[#0B1220]">
                      {a}
                    </td>
                    <td className="px-3 py-2.5 text-[#475569]">{m}</td>
                    <td
                      className={`px-3 py-2.5 ${a === "approve" ? "font-semibold text-[#7F1D1D]" : "text-[#475569]"}`}
                    >
                      {w}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-[14px] leading-relaxed text-[#475569]">
          An agent’s level is fixed in its definition. Promotion is a governance event that needs
          re-certification — scope review, security review including the prompt-injection test
          corpus, an evaluation suite, and documentation of its limits — never a runtime decision.
        </p>
      </OpsSection>

      <OpsSection
        id="approval"
        eyebrow="The approval gate and execution"
        title="Seven gates between a proposal and your cloud"
        intro={
          <p>
            A change must pass entitlement, agent scope, the actor level, an execute permission, a
            policy-assigned risk class, a person approving the exact change, and a drift check on
            the target. Any one of them holding prevents an unauthorised change. Below the
            application, the database will not store an executed action without a matching approval.
          </p>
        }
      >
        <div className="grid gap-6">
          <DiagramFigure
            src="/diagrams/ops-read-write-paths.svg"
            alt="Read path with three gates; write path with seven gates, one a person, then sandbox execution, validation, evidence and rollback on failure."
            caption="The asymmetry is the product: reading is fast because it is safe; writing is deliberately expensive."
          />
          <DiagramFigure
            src="/diagrams/ops-approval-flow.svg"
            alt="Approval lifecycle: proposal, policy risk class, pending with simulate, modify, reject or approve, approval bound to hash and expiring, drift check before execution."
            caption="An approval is bound to one change, expires, and is superseded if the target changes before execution."
          />
        </div>
        <div className="mt-8 rounded-2xl border border-[#E5E9F0] bg-white p-6">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-display text-xl font-bold text-[#0B1220]">The execution sandbox</h3>
            <StatusBadge status="roadmap" />
          </div>
          <p className="mt-2 max-w-3xl text-[14px] text-[#475569]">
            Built and tested in the platform; enabled for no customer yet. When it is, it will
            require a write role you create in your own account and an autonomy ceiling you raise
            past “propose”.
          </p>
          <ul className="mt-4 grid gap-2 text-[14px] text-[#334155] md:grid-cols-2 [&>*]:min-w-0">
            {[
              "Its own isolated namespace — the only place holding a write credential",
              "Network egress default-deny, allowlisted to the endpoints the action declares",
              "Short-lived role scoped to the target account and operation",
              "One action per container, an ephemeral filesystem, a hard time limit",
              "Every command and API call captured into the evidence package",
              "Validation after every change; failure rolls back and raises an incident",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#DC2626]" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </OpsSection>

      <OpsSection
        id="deployment"
        eyebrow="Where it runs"
        title="A new surface on the existing platform, not a new silo"
        intro={
          <p>
            Onam AIOps runs as its own service group on the Onam platform, behind the same
            gateway, session and organisation model as Onam Security. It introduces no new identity
            or tenancy mechanism: identity reaches it only from the gateway, every table carries the
            tenant, and its data stays in the region agreed with you.
          </p>
        }
        tint
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 [&>*]:min-w-0">
          {[
            "Never touches a product database directly — all estate reads go through Cloud Estate Intelligence",
            "Nothing reaches a customer cloud except through the tool gateway and the sandbox",
            "No component holds a model SDK; inference goes through the model gateway",
            "Identity and tenant come only from the platform gateway",
            "Agent records live alongside the platform’s own, under the same naming and tenancy rules",
          ].map((t, i) => (
            <div key={t} className="rounded-2xl border border-[#E5E9F0] bg-white p-4">
              <div className="font-mono text-[12px] font-bold text-[#2563EB]">
                Commitment {i + 1}
              </div>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#334155]">{t}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <BrandButton to="/platform/ai-operations">Back to Onam AIOps</BrandButton>
          <BrandButton href="/docs/operations/governance" variant="secondary">
            Governance and safety docs <ArrowRight className="h-4 w-4" />
          </BrandButton>
        </div>
      </OpsSection>
    </SiteLayout>
  );
}
