import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Eye,
  FileSearch,
  ListChecks,
  Lock,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import {
  ApprovalMock,
  AuditMock,
  DiagramFigure,
  EvidenceMock,
  IllustrativeFrame,
  OpsSection,
  PlanMock,
  StatusBadge,
  WorkspaceMock,
} from "@/components/site/ops/OpsUi";
import {
  OPS_AGENTS,
  OPS_COMMITMENTS,
  OPS_FEATURES,
  OPS_RISK_CLASSES,
  OPS_STATUS,
  OPS_USE_CASES,
  type OpsStatus,
} from "@/data/operations";
import { seo, faqJsonLd } from "@/lib/seo";

/**
 * Onam Operations — flagship page for the agentic operations layer.
 *
 * Honesty rules (see src/data/operations.ts header): every capability carries a status badge.
 * Only the AI Assistant is "Available". The workspace, orchestrator, Asset and Security agents
 * are "Early access". Executing changes in a customer cloud is "On the roadmap". Do not move a
 * status without evidence in the agentic platform repo's deploy history and onboarding notes.
 */

const FAQS = [
  {
    q: "Can I use Onam Operations today?",
    a: "It is in early access: running on the Onam platform and enabled per organisation by invitation, starting with AWS and the Onam Security inventory and findings. The AI Assistant inside Onam Security is available to every customer today.",
  },
  {
    q: "Can the agents change my cloud?",
    a: "Not in early access. Organisations start at the “propose” ceiling: agents answer, investigate and propose, and nothing touches your cloud. Executing an approved change is on the roadmap, and even then it needs a named person to approve the exact change, a write role you create in your own account, and it runs in an isolated sandbox that validates and rolls back.",
  },
  {
    q: "How is this different from the AI Assistant?",
    a: "The AI Assistant answers questions about your findings inside the Onam Security console. Onam Operations is a workspace above it: multi-step investigations with visible plans, evidence cards, tasks, an approval centre and an audit trail, run by specialist agents with declared permissions.",
  },
  {
    q: "Is my data used to train models?",
    a: "No. Customer data is never used to train or fine-tune a model. Agents call approved models through one model gateway, in the region agreed with you, one customer's data per call.",
  },
  {
    q: "What stops an agent being tricked by text in my cloud?",
    a: "Resource tags, policy descriptions and finding text are treated as untrusted data and labelled as such. The decisive control is in code: the policy engine and tool gateway check every call against the agent's declared scope, so a persuaded model still cannot call a tool its agent does not hold.",
  },
];

export const Route = createFileRoute("/platform/ai-operations/")({
  head: () =>
    seo({
      title: "Onam Operations — specialist AI agents for cloud operations",
      description:
        "Onam Operations: specialist AI agents investigate your cloud with evidence on every claim and change nothing without human approval. In early access.",
      path: "/platform/ai-operations",
    }),
  component: AiOperationsPage,
});

const STATUS_ORDER: OpsStatus[] = ["available", "early", "development", "roadmap"];

const NAV = [
  { id: "today", label: "What you can use today" },
  { id: "problem", label: "The problem" },
  { id: "workspace", label: "The agent workspace" },
  { id: "agents", label: "The specialist agents" },
  { id: "orchestrator", label: "The orchestrator" },
  { id: "approvals", label: "Approval and governance" },
  { id: "evidence", label: "Evidence and audit trail" },
  { id: "security", label: "Security architecture" },
  { id: "use-cases", label: "What you can do with it" },
  { id: "faq", label: "Questions" },
];

function AiOperationsPage() {
  return (
    <SiteLayout>
      <Hero />
      <TodaySection />
      <ProblemSection />
      <WorkspaceSection />
      <AgentsSection />
      <OrchestratorSection />
      <ApprovalSection />
      <EvidenceSection />
      <SecuritySection />
      <UseCasesSection />
      <FaqSection />
      <FinalCta />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }}
      />
    </SiteLayout>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[#E5E9F0] bg-white">
      <div className="absolute inset-0 dot-grid opacity-60" />
      <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[700px] rounded-full bg-[#2563EB]/10 blur-[140px]" />
      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6 md:pt-24">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-[#DBE7FE] bg-[#EFF4FF] px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-[#1D4ED8]">
            Onam Operations
          </span>
          <StatusBadge status="early" />
        </div>
        <h1 className="mt-6 max-w-4xl font-display text-4xl font-black leading-[1.05] tracking-tight text-[#0B1220] md:text-6xl">
          Specialist AI agents that investigate your cloud — and{" "}
          <span className="gradient-text">change nothing without your approval.</span>
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#475569]">
          Onam Operations is a workspace where your team works alongside specialist agents that
          already have your cloud estate in context. They plan a multi-step investigation, run it
          across domains, show the evidence for every number, and propose changes for a person to
          decide. Every step is recorded.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <BrandButton to="/request-demo" size="lg">
            Ask for early access <ArrowRight className="h-4 w-4" />
          </BrandButton>
          <BrandButton to="/platform/ai-operations/architecture" size="lg" variant="secondary">
            How it is designed
          </BrandButton>
        </div>
        <ul className="mt-10 grid gap-3 text-[14.5px] text-[#334155] sm:grid-cols-3 [&>*]:min-w-0">
          {[
            [ListChecks, "A plan you can see before it runs"],
            [FileSearch, "Evidence on every claim"],
            [Lock, "A person approves every change"],
          ].map(([Icon, text]) => {
            const I = Icon as typeof Check;
            return (
              <li
                key={text as string}
                className="flex items-center gap-2.5 rounded-xl border border-[#E5E9F0] bg-white/80 px-3.5 py-3"
              >
                <I className="h-4 w-4 shrink-0 text-[#2563EB]" />
                <span>{text as string}</span>
              </li>
            );
          })}
        </ul>
        <nav
          aria-label="On this page"
          className="mt-10 rounded-2xl border border-[#E2E8F2] bg-[#F8FAFC] p-5"
        >
          <p className="text-[12px] font-bold uppercase tracking-[1.5px] text-[#5C6B84]">
            On this page
          </p>
          <ul className="mt-3 grid gap-x-6 gap-y-1.5 text-[14.5px] sm:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0">
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="text-[#2563EB] hover:underline">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}

function TodaySection() {
  return (
    <OpsSection
      id="today"
      eyebrow="Status, stated plainly"
      title="What you can use today, and what is still coming"
      intro={
        <p>
          Onam Operations is new. We label every capability on this page so you never have to guess
          whether something exists. Nothing marked “On the roadmap” is available, and no date is
          promised for it.
        </p>
      }
      tint
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&>*]:min-w-0">
        {STATUS_ORDER.map((st) => (
          <div key={st} className="rounded-2xl border border-[#E5E9F0] bg-white p-5">
            <StatusBadge status={st} />
            <p className="mt-3 text-[13px] leading-relaxed text-[#64748B]">
              {OPS_STATUS[st].meaning}
            </p>
            <ul className="mt-4 space-y-3">
              {OPS_FEATURES.filter((f) => f.status === st).map((f) => (
                <li key={f.name}>
                  <div className="text-[14px] font-semibold text-[#0B1220]">{f.name}</div>
                  <div className="text-[13px] leading-relaxed text-[#475569]">{f.detail}</div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-6 text-[13.5px] text-[#64748B]">
        Looking for the assistant you can use right now?{" "}
        <Link to="/platform/ai-assistant" className="font-semibold text-[#2563EB] hover:underline">
          AI Assistant in Onam Security
        </Link>
        .
      </p>
    </OpsSection>
  );
}

function ProblemSection() {
  return (
    <OpsSection
      id="problem"
      eyebrow="The problem"
      title="The answer exists. It is spread across four consoles."
      intro={
        <p>
          A real question about a cloud estate — “which internet-exposed production assets hold
          regulated data, what do they cost, and would we get them back if the region went down?” —
          touches security, inventory, cost and recovery. Each lives in its own console. Today a
          senior engineer opens all four, exports four spreadsheets and joins them by resource ID by
          hand.
        </p>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2 [&>*]:min-w-0">
        <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] p-6">
          <div className="text-[12px] font-bold uppercase tracking-widest text-[#B91C1C]">
            Today, by hand
          </div>
          <ul className="mt-4 space-y-3 text-[15px] text-[#7F1D1D]">
            {[
              "Four consoles, four exports, one spreadsheet join",
              "Half a day to a week of a senior engineer’s time",
              "Stale the moment it is finished",
              "No evidence anyone can audit — a screenshot at best",
              "The fix happens out of band, unlogged",
            ].map((t) => (
              <li key={t} className="flex gap-2.5">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-[#DC2626]" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] p-6">
          <div className="text-[12px] font-bold uppercase tracking-widest text-[#15803D]">
            With Onam Operations
          </div>
          <ul className="mt-4 space-y-3 text-[15px] text-[#14532D]">
            {[
              "Ask once; the orchestrator plans the steps across agents",
              "Each agent narrows the previous one’s result — nothing re-discovers the estate",
              "Every number cites the query, rows and scan time behind it",
              "Disagreements between agents reach you, never silently resolved",
              "Changes are proposed with a diff and a rollback, and a person decides",
            ].map((t) => (
              <li key={t} className="flex gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-6 max-w-3xl text-[14px] leading-relaxed text-[#64748B]">
        In early access the agents read the Onam Security inventory and findings. Joining cost and
        recovery into the same answer is on the roadmap, as those data sources are connected.
      </p>
    </OpsSection>
  );
}

function WorkspaceSection() {
  return (
    <OpsSection
      id="workspace"
      eyebrow="The agent workspace"
      title="Shaped like team chat. Behaves like an operations console."
      intro={
        <p>
          The workspace looks familiar because chat is already in your muscle memory. But chat alone
          cannot carry a plan, an approval or an audit trail, so three rules set it apart.
        </p>
      }
      tint
    >
      <div className="grid gap-4 md:grid-cols-3 [&>*]:min-w-0">
        {[
          [
            Eye,
            "Every claim is inspectable",
            "Numbers and names in an agent’s reply link to the skill, query, rows and scan time that produced them.",
          ],
          [
            ListChecks,
            "The plan is visible before it runs",
            "A multi-step request shows its steps first, so you can stop it before it works — not only after.",
          ],
          [
            ShieldCheck,
            "Actions look like changes, not messages",
            "A proposed change is a distinct card: bordered, diff first, with explicit decision buttons.",
          ],
        ].map(([Icon, title, body]) => {
          const I = Icon as typeof Eye;
          return (
            <div key={title as string} className="rounded-2xl border border-[#E5E9F0] bg-white p-5">
              <I className="h-5 w-5 text-[#2563EB]" />
              <div className="mt-3 font-display text-lg font-bold text-[#0B1220]">
                {title as string}
              </div>
              <p className="mt-1.5 text-[14px] leading-relaxed text-[#475569]">{body as string}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-8">
        <IllustrativeFrame
          title="Onam Operations · Chat"
          caption="Chat with the agents: navigation on the left, each agent’s reply in its own attributed card, and a context panel for evidence, tasks and actions."
        >
          <WorkspaceMock />
        </IllustrativeFrame>
      </div>
      <div className="mt-6 grid gap-3 text-[14px] text-[#475569] sm:grid-cols-2 lg:grid-cols-4 [&>*]:min-w-0">
        {[
          ["Needs you", "Home, the approval queue and your inbox"],
          ["Ask", "Chat, the assets the agents see, and the agent directory"],
          ["Run", "Tasks, workflows and reports"],
          [
            "Govern",
            "Knowledge you give the agents, the activity record, and settings including the kill switch",
          ],
        ].map(([h, b]) => (
          <div key={h} className="rounded-xl border border-[#E5E9F0] bg-white p-4">
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#2563EB]">
              {h}
            </div>
            <div className="mt-1">{b}</div>
          </div>
        ))}
      </div>
    </OpsSection>
  );
}

function AgentsSection() {
  return (
    <OpsSection
      id="agents"
      eyebrow="The specialist agents"
      title="Eight specialists, each with a declared job and a declared limit"
      intro={
        <p>
          Each agent is a versioned definition, not a prompt: its purpose, level, skills, tools and
          permissions are data that can be reviewed. An agent invokes skills; skills invoke tools;
          only tools touch anything outside the platform. Automation works in two modes — a planner
          that proposes and an actor that may execute only from an approval.
        </p>
      }
    >
      <DiagramFigure
        src="/diagrams/ops-agent-roster.svg"
        alt="The orchestrator routes to read-and-recommend agents and proposing agents; proposals pass a human approval gate before the automation actor may execute."
        caption="Who may do what. L1 agents read and recommend; L2 agents write proposals only; the L3 actor runs only from an approval record."
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3 [&>*]:min-w-0">
        {OPS_AGENTS.map((a) => (
          <article
            key={a.id}
            className="flex flex-col rounded-2xl border border-[#E5E9F0] bg-white p-5"
            style={{ borderTop: `3px solid ${a.color}` }}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-lg font-bold text-[#0B1220]">{a.name}</h3>
              <StatusBadge status={a.status} />
            </div>
            <div className="mt-1 text-[12px] font-semibold text-[#64748B]">
              {a.level} · {a.levelName} · {a.authority}
            </div>
            <p className="mt-3 text-[14px] italic text-[#334155]">“{a.question}”</p>
            <ul className="mt-3 space-y-1.5 text-[13.5px] text-[#475569]">
              {a.does.slice(0, 3).map((d) => (
                <li key={d} className="flex gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#16A34A]" />
                  {d}
                </li>
              ))}
            </ul>
            <div className="mt-3 text-[11px] font-bold uppercase tracking-widest text-[#94A3B8]">
              Tools
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {a.tools.slice(0, 5).map((t) => (
                <span
                  key={t}
                  className="rounded bg-[#F1F5F9] px-1.5 py-0.5 font-mono text-[11px] text-[#334155]"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-3 text-[13px] text-[#7F1D1D]">
              <span className="font-semibold">Never:</span>{" "}
              {a.never[0].charAt(0).toLowerCase() + a.never[0].slice(1)}.
            </div>
            <div className="mt-auto pt-4 text-[12.5px] text-[#64748B]">{a.statusNote}</div>
          </article>
        ))}
      </div>
      <p className="mt-6 text-[14px] text-[#475569]">
        Full definitions — skills, tools, permissions and known limits for every agent — are in the{" "}
        <Link
          to="/docs/$"
          params={{ _splat: "operations/agents" }}
          className="font-semibold text-[#2563EB] hover:underline"
        >
          agent reference
        </Link>
        .
      </p>
    </OpsSection>
  );
}

function OrchestratorSection() {
  return (
    <OpsSection
      id="orchestrator"
      eyebrow="The orchestrator"
      title="It routes the work. It never answers on its own."
      intro={
        <p>
          The orchestrator turns a request into a plan: it detects the intent, picks the agents,
          orders the steps — in parallel where nothing depends on anything else — passes each step
          the previous step’s result, and joins the answers. It has no access to estate data itself,
          so it cannot answer a question unaudited.
        </p>
      }
      tint
    >
      <div className="grid items-start gap-8 lg:grid-cols-2 [&>*]:min-w-0">
        <IllustrativeFrame
          title="Plan card"
          caption="A plan pauses where a step would change the cloud, and waits for a person."
        >
          <div className="p-4">
            <PlanMock />
          </div>
        </IllustrativeFrame>
        <div className="space-y-4">
          {[
            [
              "Question",
              "Answered by one agent.",
              "How many production instances are in this account?",
            ],
            [
              "Investigation",
              "Several agents, results joined.",
              "Which exposed assets have critical findings, and who owns them?",
            ],
            [
              "Action request",
              "A plan, a proposal and an approval.",
              "Close SSH from the internet on these instances.",
            ],
            [
              "Report",
              "A synthesised document with its evidence.",
              "Give me the exposure summary for the board.",
            ],
          ].map(([k, d, ex]) => (
            <div key={k} className="rounded-xl border border-[#E5E9F0] bg-white p-4">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-semibold text-[#0B1220]">{k}</span>
                <span className="text-[13px] text-[#64748B]">{d}</span>
              </div>
              <div className="mt-1 text-[13.5px] italic text-[#334155]">“{ex}”</div>
            </div>
          ))}
          <div className="rounded-xl border-l-4 border-[#B45309] bg-[#FFFBEB] p-4 text-[14px] text-[#78350F]">
            <strong>Conflicts reach you.</strong> If one agent says “remove this” and another says
            “it is a recovery dependency”, the orchestrator does not pick a winner. Both positions
            and their evidence are shown, and you decide. A silently resolved conflict is a wrong
            answer in a confident tone.
          </div>
        </div>
      </div>
    </OpsSection>
  );
}

function ApprovalSection() {
  return (
    <OpsSection
      id="approvals"
      eyebrow="Approval and governance"
      title="The approval gate is the product, not a setting"
      intro={
        <p>
          There is no autonomy level, tenant setting or flag that lets an agent change your cloud
          without a recorded human approval. Risk is assigned by policy — never by the agent — and
          can only be raised automatically, never lowered: production targets, crown-jewel paths,
          regulated data, missing rollback and bulk changes all push a change up a class.
        </p>
      }
    >
      <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr] [&>*]:min-w-0">
        <IllustrativeFrame
          title="Approval centre"
          caption="The approval card leads with the exact change, then blast radius, reason and rollback — the approver’s first question answered before it is asked."
        >
          <ApprovalMock />
        </IllustrativeFrame>
        <div>
          <div className="overflow-x-auto rounded-xl border border-[#E5E9F0] bg-white">
            <table className="w-full min-w-[420px] text-left text-[13.5px]">
              <thead className="bg-[#F8FAFC] text-[#0B1220]">
                <tr>
                  <th className="px-3 py-2.5 font-semibold">Risk</th>
                  <th className="px-3 py-2.5 font-semibold">Who must approve</th>
                  <th className="px-3 py-2.5 font-semibold">For example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E9F0]">
                {OPS_RISK_CLASSES.map((r) => (
                  <tr key={r.cls} className="align-top">
                    <td className="px-3 py-2.5 font-semibold" style={{ color: r.color }}>
                      {r.cls}
                    </td>
                    <td className="px-3 py-2.5 text-[#334155]">{r.approval}</td>
                    <td className="px-3 py-2.5 text-[#475569]">{r.examples}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-5 space-y-2.5 text-[14px] text-[#334155]">
            {[
              "An approval binds to the change’s hash — approving one change cannot authorise another.",
              "The target is re-read just before execution; if it drifted, the approval is superseded.",
              "Approvals expire. Critical changes need two distinct people.",
              "Agents can never hold approval authority — the database refuses to record it.",
              "Review time is measured, so rubber-stamping becomes visible to admins.",
            ].map((t) => (
              <li key={t} className="flex gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-10">
        <DiagramFigure
          src="/diagrams/ops-read-write-paths.svg"
          alt="The read path passes three automatic gates; the write path passes seven gates including a person approving the exact change, then runs in a sandbox, is validated, and rolls back on failure."
          caption="Reading is cheap because it is safe. Changing your cloud is deliberately expensive."
        />
      </div>
    </OpsSection>
  );
}

function EvidenceSection() {
  return (
    <OpsSection
      id="evidence"
      eyebrow="Evidence and audit trail"
      title="A claim without evidence is a defect"
      intro={
        <p>
          Every factual claim an agent makes carries the skill, the tool, the query, the rows and
          the scan it came from. When the data cannot support an answer, the agent says it cannot
          verify it. Every turn, tool call, decision and approval is written to an append-only
          record, chained so that an edit or a deletion is detectable.
        </p>
      }
      tint
    >
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.4fr] [&>*]:min-w-0">
        <IllustrativeFrame
          title="Evidence card"
          caption="Open any number to see how it was produced, and re-run it."
        >
          <EvidenceMock />
        </IllustrativeFrame>
        <IllustrativeFrame
          title="Activity · audit trail"
          caption="Who did what, when and why — people and agents alike — with a check that the chain is intact."
        >
          <AuditMock />
        </IllustrativeFrame>
      </div>
    </OpsSection>
  );
}

function SecuritySection() {
  const items: { icon: typeof Lock; title: string; body: string }[] = [
    {
      icon: Users,
      title: "Tenant isolation at every layer",
      body: "Your data never crosses to another customer — not in a query, cache, memory, model call, event or log line. Each layer is isolated and tested on its own, so one bug is not one breach.",
    },
    {
      icon: Lock,
      title: "Zero-trust agents",
      body: "An agent is an untrusted principal. Its scope is verified on every call, it cannot change its own definition or permissions, and it can never exceed the person it acts for.",
    },
    {
      icon: ShieldCheck,
      title: "Prompt-injection defence in code",
      body: "Text from your cloud is labelled as data, never as instruction. The decisive control is the policy engine and tool gateway: a persuaded model still cannot call a tool its agent does not hold.",
    },
    {
      icon: Eye,
      title: "One model gateway",
      body: "All inference goes through one gateway, to approved models only, in the region agreed with you. Customer data is never used to train a model.",
    },
    {
      icon: ListChecks,
      title: "Kill switch and budgets",
      body: "Stop all agent activity for your organisation from settings. Every task has step, time and cost ceilings; when one is reached, the task stops and says what is left undone.",
    },
    {
      icon: FileSearch,
      title: "Fail safe",
      body: "On ambiguity, timeout, missing data or policy doubt, the platform stops and reports. A domain that is unavailable is named in the answer, never hidden.",
    },
  ];
  return (
    <OpsSection
      id="security"
      eyebrow="Security architecture"
      title="Built on the assumption that the model can be fooled"
      intro={
        <p>
          The controls that protect your cloud do not rely on the model behaving well. They sit in
          code, in the call path, where a refusal stops the request and is itself recorded. These
          are design commitments of the platform.
        </p>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0">
        {items.map((it) => {
          const I = it.icon;
          return (
            <div key={it.title} className="rounded-2xl border border-[#E5E9F0] bg-white p-5">
              <I className="h-5 w-5 text-[#2563EB]" />
              <div className="mt-3 font-display text-[17px] font-bold text-[#0B1220]">
                {it.title}
              </div>
              <p className="mt-1.5 text-[14px] leading-relaxed text-[#475569]">{it.body}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-8 rounded-2xl border border-[#082869] bg-[#082869] p-6 text-white md:p-8">
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#93B4F8]">
          Five things it will never do
        </div>
        <ol className="mt-4 grid gap-3 text-[15px] md:grid-cols-2 [&>*]:min-w-0">
          {OPS_COMMITMENTS.map((c, i) => (
            <li key={c} className="flex gap-3">
              <span className="font-mono text-[#93B4F8]">{i + 1}</span>
              <span className="text-[#E2E8F0]">{c}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-6">
        <BrandButton to="/platform/ai-operations/architecture" variant="secondary">
          See the architecture, block by block <ArrowRight className="h-4 w-4" />
        </BrandButton>
      </div>
    </OpsSection>
  );
}

function UseCasesSection() {
  return (
    <OpsSection
      id="use-cases"
      eyebrow="What you can do with it"
      title="Questions your team asks every week"
      intro={
        <p>
          Each use case shows the agents involved, what you get back, and whether a person must
          approve anything.
        </p>
      }
      tint
    >
      <div className="grid gap-4 md:grid-cols-2 [&>*]:min-w-0">
        {OPS_USE_CASES.map((u) => (
          <div key={u.title} className="rounded-2xl border border-[#E5E9F0] bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-[17px] font-bold text-[#0B1220]">{u.title}</h3>
              <StatusBadge status={u.status} />
            </div>
            <p className="mt-2 text-[14px] italic text-[#334155]">“{u.ask}”</p>
            <dl className="mt-3 grid grid-cols-[88px_1fr] gap-x-3 gap-y-1.5 text-[13.5px] [&>*]:min-w-0">
              <dt className="text-[#64748B]">Agents</dt>
              <dd className="text-[#0B1220]">{u.agents}</dd>
              <dt className="text-[#64748B]">You get</dt>
              <dd className="text-[#475569]">{u.outcome}</dd>
              <dt className="text-[#64748B]">Approval</dt>
              <dd className="text-[#475569]">{u.approval}</dd>
            </dl>
          </div>
        ))}
      </div>
    </OpsSection>
  );
}

function FaqSection() {
  return (
    <OpsSection id="faq" eyebrow="Questions" title="Common questions">
      <div className="max-w-3xl divide-y divide-[#E5E9F0] rounded-2xl border border-[#E5E9F0] bg-white">
        {FAQS.map((f) => (
          <details key={f.q} className="group p-5">
            <summary className="cursor-pointer list-none font-semibold text-[#0B1220] marker:hidden">
              <span className="flex items-center justify-between gap-4">
                {f.q}
                <span className="text-[#94A3B8] transition group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 text-[14.5px] leading-relaxed text-[#475569]">{f.a}</p>
          </details>
        ))}
      </div>
    </OpsSection>
  );
}

function FinalCta() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="gradient-border rounded-3xl p-8 text-center md:p-14">
          <h2 className="font-display text-3xl font-black tracking-tight text-[#0B1220] md:text-4xl">
            Work alongside agents that <span className="gradient-text">show their working.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[#475569]">
            Early access is by invitation and starts on AWS with your Onam Security data. Agents
            answer and propose; nothing changes your cloud.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <BrandButton to="/request-demo" size="lg">
              Ask for early access
            </BrandButton>
            <BrandButton href="/docs/operations/overview" size="lg" variant="secondary">
              Read the documentation
            </BrandButton>
          </div>
        </div>
      </div>
    </section>
  );
}
