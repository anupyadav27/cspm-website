import { Link } from "@tanstack/react-router";
import { ArrowRight, FileSearch, ListChecks, Lock } from "lucide-react";
import { StatusBadge } from "./OpsUi";

/**
 * Promotional band for Onam AIOps, used on the homepage and the platform index.
 * Keep the "Early access" badge: the workspace is enabled per organisation by invitation and
 * agents cannot change a customer's cloud (see src/data/operations.ts).
 */
export function OpsBand() {
  return (
    <section className="border-b border-[#E5E9F0] bg-[#0B1220] py-16 md:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#93B4F8]">
              Onam AIOps
            </span>
            <StatusBadge status="early" />
          </div>
          <h2 className="mt-4 font-display text-3xl font-extrabold leading-[1.12] tracking-tight text-white md:text-[40px]">
            Specialist AI agents that investigate your cloud — and change nothing without your
            approval.
          </h2>
          <p className="mt-4 max-w-2xl text-[16.5px] leading-relaxed text-[#CBD5E1]">
            A workspace where your team works with specialist agents — Asset and Security in early
            access, Compliance, Data and Automation in development. They plan multi-step
            investigations, cite the evidence for every number, and propose changes for a person to
            decide, with every step on the record.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/platform/ai-operations"
              className="inline-flex items-center gap-2 rounded-[10px] bg-[#2563EB] px-5 py-3 text-[15px] font-semibold text-white transition hover:bg-[#1D4ED8]"
            >
              Meet the agents <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/platform/ai-operations/architecture"
              className="inline-flex items-center gap-2 rounded-[10px] border border-[#334155] px-5 py-3 text-[15px] font-semibold text-white transition hover:border-[#64748B]"
            >
              How it is designed
            </Link>
          </div>
        </div>
        <ul className="grid gap-3">
          {(
            [
              [
                ListChecks,
                "A plan you can see before it runs",
                "The orchestrator shows which agent does what, in which order.",
              ],
              [
                FileSearch,
                "Evidence on every claim",
                "Each number links to the query, rows and scan that produced it.",
              ],
              [
                Lock,
                "A person approves every change",
                "Diff first, rollback shown, bound to the exact change.",
              ],
            ] as const
          ).map(([Icon, t, b]) => (
            <li key={t} className="flex gap-3 rounded-2xl border border-[#1E293B] bg-[#111A2E] p-4">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#6AA2FF]" />
              <div>
                <div className="font-semibold text-white">{t}</div>
                <div className="mt-0.5 text-[14px] text-[#94A3B8]">{b}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
