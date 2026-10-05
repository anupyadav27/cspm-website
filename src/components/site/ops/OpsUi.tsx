/**
 * Onam Operations — status badges and ILLUSTRATIVE workspace mockups.
 *
 * Every mockup here is drawn in HTML from the UX specification (docs/04 §2, §3.6, §4) and
 * the workspace's real navigation (apps/workspace Nav.tsx). They are NOT screenshots and
 * must always render inside <IllustrativeFrame>, which labels them as such. All values are
 * sample data — no figure here describes a real customer, and none is a product claim.
 */
import type { ReactNode } from "react";
import { OPS_STATUS, type OpsStatus } from "@/data/operations";

export function StatusBadge({ status, className = "" }: { status: OpsStatus; className?: string }) {
  const s = OPS_STATUS[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider whitespace-nowrap ${className}`}
      style={{ color: s.fg, backgroundColor: s.bg, borderColor: s.border }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.fg }} aria-hidden />
      {s.label}
    </span>
  );
}

export function IllustrativeFrame({
  title,
  caption,
  children,
}: {
  title: string;
  caption: string;
  children: ReactNode;
}) {
  return (
    <figure className="min-w-0 rounded-2xl border border-[#E5E9F0] bg-white shadow-[0_1px_2px_rgba(16,24,40,.04),0_12px_32px_rgba(16,24,40,.06)] overflow-hidden">
      <div className="flex items-center gap-2 border-b border-[#E5E9F0] bg-[#F8FAFC] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#E2E8F0]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#E2E8F0]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#E2E8F0]" aria-hidden />
        <span className="ml-2 truncate text-[12px] font-semibold text-[#334155]">{title}</span>
        <span className="ml-auto shrink-0 rounded border border-dashed border-[#94A3B8] px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-widest text-[#64748B]">
          Illustrative · sample data
        </span>
      </div>
      <div className="overflow-x-auto">{children}</div>
      <figcaption className="border-t border-[#E5E9F0] bg-[#F8FAFC] px-4 py-2.5 text-[12px] leading-relaxed text-[#64748B]">
        {caption} Illustrative mockup drawn from the design specification with sample data — not a
        screenshot of a customer environment.
      </figcaption>
    </figure>
  );
}

function AgentDot({ color, label }: { color: string; label: string }) {
  return (
    <span
      className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-[10px] font-bold text-white"
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {label}
    </span>
  );
}

const NAV: { section: string; items: { label: string; count?: number; active?: boolean }[] }[] = [
  {
    section: "Needs you",
    items: [{ label: "Home" }, { label: "Approvals", count: 2 }, { label: "Inbox" }],
  },
  {
    section: "Ask",
    items: [{ label: "Chat", active: true }, { label: "Assets" }, { label: "Agents" }],
  },
  {
    section: "Run",
    items: [{ label: "Tasks", count: 1 }, { label: "Workflows" }, { label: "Reports" }],
  },
  {
    section: "Govern",
    items: [{ label: "Knowledge" }, { label: "Activity" }, { label: "Settings" }],
  },
];

/** Workspace: navigation · conversation with per-agent replies · context panel. */
export function WorkspaceMock() {
  return (
    <div className="grid min-w-[340px] text-[12.5px] md:grid-cols-[150px_1fr] lg:grid-cols-[150px_1fr_220px]">
      <aside className="hidden border-r border-[#E5E9F0] bg-[#F8FAFC] p-3 md:block">
        <div className="mb-3 text-[11px] font-extrabold text-[#0B1220]">Onam Operations</div>
        {NAV.map((g) => (
          <div key={g.section} className="mb-3">
            <div className="mb-1 text-[9.5px] font-bold uppercase tracking-widest text-[#94A3B8]">
              {g.section}
            </div>
            {g.items.map((i) => (
              <div
                key={i.label}
                className={`flex items-center justify-between rounded-md px-2 py-1 ${i.active ? "bg-[#EFF4FF] font-semibold text-[#1D4ED8]" : "text-[#475569]"}`}
              >
                <span>{i.label}</span>
                {i.count ? (
                  <span className="rounded-full bg-[#2563EB] px-1.5 text-[9.5px] font-bold text-white">
                    {i.count}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </aside>

      <main className="space-y-3 p-4">
        <div className="border-b border-[#E5E9F0] pb-2">
          <div className="font-bold text-[#0B1220]"># Exposed production assets</div>
          <div className="text-[11px] text-[#64748B]">
            Agents in this conversation: Asset · Security
          </div>
        </div>
        <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-[#2563EB] px-3 py-2 text-white">
          Which production assets are reachable from the internet, and which of them have critical
          findings?
        </div>
        <PlanMock compact />
        <div
          className="rounded-xl border border-[#E5E9F0] border-l-[3px] bg-white p-3"
          style={{ borderLeftColor: "#0F766E" }}
        >
          <div className="mb-1 flex items-center gap-2">
            <AgentDot color="#0F766E" label="As" />
            <span className="font-semibold text-[#0B1220]">Asset Agent</span>
            <span className="text-[10.5px] text-[#94A3B8]">discover_assets · 214 rows</span>
          </div>
          <p className="text-[#334155]">
            214 production assets in the selected accounts; 61 have no owner tag.
          </p>
        </div>
        <div
          className="rounded-xl border border-[#E5E9F0] border-l-[3px] bg-white p-3"
          style={{ borderLeftColor: "#1D4ED8" }}
        >
          <div className="mb-1 flex items-center gap-2">
            <AgentDot color="#1D4ED8" label="Se" />
            <span className="font-semibold text-[#0B1220]">Security Agent</span>
            <span className="text-[10.5px] text-[#94A3B8]">query_findings · 12 rows</span>
          </div>
          <p className="text-[#334155]">
            <strong className="text-[#0B1220]">12 of them</strong> carry a critical finding. The top
            three allow SSH from 0.0.0.0/0.{" "}
            <span className="cursor-default rounded bg-[#EFF4FF] px-1 font-mono text-[11px] text-[#1D4ED8]">
              evidence E-101
            </span>
          </p>
          <div className="mt-2 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-2.5 py-1.5 text-[11.5px] text-[#92400E]">
            1 recommended change · approval required ·{" "}
            <span className="font-semibold underline">Review</span>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-3 py-2 text-[#94A3B8]">
          <span className="flex-1">Ask the agents… (@Security to target one)</span>
          <span className="rounded-md bg-[#2563EB] px-2 py-0.5 text-[11px] font-semibold text-white">
            Send
          </span>
        </div>
      </main>

      <aside className="hidden border-l border-[#E5E9F0] bg-[#FBFCFE] p-3 lg:block">
        <div className="mb-2 flex flex-wrap gap-1 text-[10.5px] font-semibold">
          {["Context", "Assets", "Tasks", "Evidence"].map((t, i) => (
            <span
              key={t}
              className={`rounded px-1.5 py-0.5 ${i === 0 ? "bg-[#0B1220] text-white" : "text-[#64748B]"}`}
            >
              {t}
            </span>
          ))}
        </div>
        <div className="space-y-1.5 text-[11.5px]">
          {[
            ["Assets in scope", "214"],
            ["Critical findings", "12"],
            ["Owner unknown", "61"],
            ["As of", "last scan"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex justify-between border-b border-dashed border-[#E5E9F0] pb-1"
            >
              <span className="text-[#64748B]">{k}</span>
              <span className="font-semibold text-[#0B1220]">{v}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 text-[9.5px] font-bold uppercase tracking-widest text-[#94A3B8]">
          Evidence
        </div>
        {["E-101 findings", "E-102 inventory"].map((e) => (
          <div key={e} className="mt-1 font-mono text-[11px] text-[#1D4ED8]">
            ▸ {e}
          </div>
        ))}
        <div className="mt-3 text-[9.5px] font-bold uppercase tracking-widest text-[#94A3B8]">
          Run
        </div>
        <div className="mt-1 text-[11px] text-[#475569]">2 steps · 1 wave · complete</div>
      </aside>
    </div>
  );
}

const PLAN_STEPS = [
  {
    n: 1,
    agent: "Asset",
    color: "#0F766E",
    skill: "discover_assets",
    result: "214",
    state: "done",
  },
  {
    n: 2,
    agent: "Security",
    color: "#1D4ED8",
    skill: "query_findings",
    result: "12",
    state: "done",
  },
  {
    n: 3,
    agent: "Security",
    color: "#1D4ED8",
    skill: "recommend_remediation",
    result: "1",
    state: "done",
  },
  {
    n: 4,
    agent: "Automation",
    color: "#BE185D",
    skill: "build_change_artifact",
    result: "—",
    state: "waiting",
  },
] as const;

/** The plan card: shown before the work runs, updated while it runs (docs/04 §1). */
export function PlanMock({ compact = false }: { compact?: boolean }) {
  const steps = compact ? PLAN_STEPS.slice(0, 2) : PLAN_STEPS;
  return (
    <div
      className={`rounded-xl border border-[#C7D7FE] bg-[#F5F8FF] ${compact ? "p-2.5" : "min-w-[320px] p-4"}`}
    >
      <div className="mb-2 flex items-center justify-between text-[10.5px] font-bold uppercase tracking-widest text-[#1D4ED8]">
        <span>Plan · {steps.length} steps</span>
        <span className="text-[#64748B] normal-case tracking-normal font-medium">
          {compact ? "complete" : "paused for approval"}
        </span>
      </div>
      <ol className="space-y-1.5">
        {steps.map((s) => (
          <li
            key={s.n}
            className="flex items-center gap-2 rounded-lg bg-white px-2 py-1.5 text-[12px]"
          >
            <span
              className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${s.state === "done" ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#FEF3C7] text-[#B45309]"}`}
            >
              {s.state === "done" ? "✓" : "…"}
            </span>
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: s.color }}
              aria-hidden
            />
            <span className="font-semibold text-[#0B1220]">{s.agent}</span>
            <span className="truncate font-mono text-[11px] text-[#64748B]">{s.skill}</span>
            <span className="ml-auto font-mono text-[11px] font-semibold text-[#0B1220]">
              {s.result}
            </span>
          </li>
        ))}
      </ol>
      {!compact && (
        <div className="mt-2 text-[11.5px] text-[#475569]">
          Step 4 changes the cloud, so the plan stops here until a person approves it.
        </div>
      )}
    </div>
  );
}

/** Evidence card — docs/04 §3.6. */
export function EvidenceMock() {
  const rows: [string, ReactNode][] = [
    ["Claim", "12 production assets carry a critical finding"],
    ["Agent", "Security Agent · L1"],
    [
      "Skill",
      <span key="s" className="font-mono">
        query_findings v1.0
      </span>,
    ],
    [
      "Tool",
      <span key="t" className="font-mono">
        cei.query
      </span>,
    ],
    [
      "Query",
      <span key="q" className="font-mono text-[#1D4ED8]">
        Q-example · show query
      </span>,
    ],
    ["Rows", "12 of 12 (not truncated)"],
    [
      "As of",
      <span key="a" className="font-mono">
        sample time · scan example
      </span>,
    ],
    ["Source", "security findings · estate assets"],
  ];
  return (
    <div className="min-w-[320px] p-4">
      <div className="rounded-xl border border-[#E5E9F0]">
        <div className="flex items-center justify-between border-b border-[#E5E9F0] bg-[#F8FAFC] px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-[#334155]">
          <span>Evidence E-101</span>
          <span className="font-medium normal-case tracking-normal text-[#94A3B8]">copy</span>
        </div>
        <dl className="divide-y divide-[#F1F5F9] text-[12.5px]">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[72px_1fr] gap-2 px-3 py-1.5">
              <dt className="text-[#64748B]">{k}</dt>
              <dd className="text-[#0B1220]">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="flex justify-end gap-2 border-t border-[#E5E9F0] px-3 py-2 text-[11.5px]">
          <span className="rounded-md border border-[#CBD5E1] px-2 py-0.5 text-[#334155]">
            Re-run
          </span>
          <span className="rounded-md border border-[#CBD5E1] px-2 py-0.5 text-[#334155]">
            Open
          </span>
        </div>
      </div>
    </div>
  );
}

/** Approval card — diff first, never prose first (docs/04 §3.6). */
export function ApprovalMock() {
  return (
    <div className="min-w-[340px] p-4">
      <div className="rounded-xl border-2 border-[#FDBA74] bg-white shadow-[0_8px_24px_rgba(234,88,12,.08)]">
        <div className="flex items-center justify-between border-b border-[#FED7AA] bg-[#FFF7ED] px-3 py-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#9A3412]">
            Approval required
          </span>
          <span className="rounded-full bg-[#EA580C] px-2 py-0.5 text-[10px] font-bold text-white">
            HIGH
          </span>
        </div>
        <div className="space-y-2.5 px-3 py-3 text-[12.5px]">
          <div>
            <div className="font-semibold text-[#0B1220]">
              Restrict SSH ingress — sg-example · prod-web-tier
            </div>
            <div className="text-[11px] text-[#64748B]">
              Requested by Automation planner · task T-example
            </div>
          </div>
          <Block title="Change">
            <div className="rounded-md bg-[#0B1220] px-2.5 py-1.5 font-mono text-[11.5px] leading-relaxed">
              <div className="text-[#FCA5A5]">- 0.0.0.0/0 tcp/22</div>
              <div className="text-[#86EFAC]">+ 10.20.0.0/16 tcp/22</div>
            </div>
          </Block>
          <Block title="Blast radius">
            4 instances · 1 auto-scaling group · 2 business services
            <div className="text-[#B45309]">
              ⚠ 2 SSH sessions from outside 10.20.0.0/16 in the last 24h
            </div>
          </Block>
          <Block title="Why">
            Critical finding F-example · on a path to a crown-jewel database · evidence E-101
          </Block>
          <Block title="Rollback">
            Restore the previous rule · pre-state captured · reversible
          </Block>
          <div className="text-[11px] text-[#64748B]">
            Bound to change hash (sample) · expires in 7 days · target re-checked before execution
          </div>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-[#E5E9F0] px-3 py-2.5 text-[12px] font-semibold">
          <span className="rounded-md bg-[#16A34A] px-2.5 py-1 text-white">Approve</span>
          <span className="rounded-md border border-[#CBD5E1] px-2.5 py-1 text-[#334155]">
            Reject
          </span>
          <span className="rounded-md border border-[#CBD5E1] px-2.5 py-1 text-[#334155]">
            Modify
          </span>
          <span className="rounded-md border border-[#CBD5E1] px-2.5 py-1 text-[#334155]">
            Simulate
          </span>
        </div>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-0.5 text-[9.5px] font-bold uppercase tracking-widest text-[#94A3B8]">
        {title}
      </div>
      <div className="text-[#334155]">{children}</div>
    </div>
  );
}

const AUDIT_ROWS = [
  ["14:02:11", "you", "conversation.started", "—", "Low"],
  ["14:02:13", "Orchestrator", "plan.created", "4 steps", "Low"],
  ["14:02:19", "Asset Agent", "tool.called · cei.query", "214 rows", "Low"],
  ["14:02:27", "Security Agent", "tool.called · cei.query", "12 rows", "Low"],
  ["14:07:40", "Automation planner", "approval.requested", "sg-example", "High"],
  ["14:21:05", "you", "approval.approved", "hash (sample)", "High"],
] as const;

/** Activity / audit — append-only record with chain verification (docs/04 §4.9). */
export function AuditMock() {
  return (
    <div className="min-w-[560px] p-4">
      <div className="mb-2 flex items-center gap-2 rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-1.5 text-[12px] text-[#047857]">
        <span className="font-bold">Hash chain:</span> intact — no record edited or removed
      </div>
      <table className="w-full text-left text-[12px]">
        <thead className="text-[10px] uppercase tracking-widest text-[#94A3B8]">
          <tr>
            <th className="py-1.5 pr-3 font-bold">Time</th>
            <th className="py-1.5 pr-3 font-bold">Actor</th>
            <th className="py-1.5 pr-3 font-bold">Event</th>
            <th className="py-1.5 pr-3 font-bold">Target</th>
            <th className="py-1.5 font-bold">Risk</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F1F5F9]">
          {AUDIT_ROWS.map((r) => (
            <tr key={r[0] + r[2]}>
              <td className="py-1.5 pr-3 font-mono text-[#64748B]">{r[0]}</td>
              <td className="py-1.5 pr-3 text-[#0B1220]">{r[1]}</td>
              <td className="py-1.5 pr-3 font-mono text-[11px] text-[#334155]">{r[2]}</td>
              <td className="py-1.5 pr-3 text-[#475569]">{r[3]}</td>
              <td className="py-1.5">
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${r[4] === "High" ? "bg-[#FFEDD5] text-[#9A3412]" : "bg-[#F1F5F9] text-[#475569]"}`}
                >
                  {r[4]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A block diagram from public/diagrams. The SVGs carry their own light background, so they read in either theme. */
export function DiagramFigure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure className="min-w-0 rounded-2xl border border-[#E5E9F0] bg-white p-3 md:p-4">
      <a
        href={src}
        target="_blank"
        rel="noopener"
        className="block overflow-x-auto"
        title="Open full size"
      >
        <img src={src} alt={alt} loading="lazy" className="h-auto w-full min-w-[560px]" />
      </a>
      <figcaption className="mt-2 px-1 text-[12.5px] leading-relaxed text-[#64748B]">
        {caption}
      </figcaption>
    </figure>
  );
}

/** Small section shell shared by the two Onam Operations pages. */
export function OpsSection({
  id,
  eyebrow,
  title,
  intro,
  tint = false,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  tint?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 border-b border-[#E5E9F0] py-16 md:py-20 ${tint ? "bg-[#F7F9FC]" : "bg-white"}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#2563EB]">
            {eyebrow}
          </div>
          <h2 className="mt-3 font-display text-3xl font-extrabold leading-[1.12] tracking-tight text-[#0B1220] md:text-[38px]">
            {title}
          </h2>
          {intro ? (
            <div className="mt-4 text-[16.5px] leading-relaxed text-[#475569]">{intro}</div>
          ) : null}
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
