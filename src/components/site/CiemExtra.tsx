import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  Check,
  GitFork,
  Layers,
  Minus,
  Route as RouteIcon,
  ScanSearch,
  ShieldAlert,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * Extra sections for /platform/ciem. Every statement here was checked against the
 * identity engine (threat-engine engines/iam) on 2026-10-05. Where a capability is
 * AWS-only today, the card says so — keep it that way when editing.
 */

type Capability = { icon: LucideIcon; title: string; body: string; where: string };

const capabilities: Capability[] = [
  {
    icon: Layers,
    title: "Effective permissions",
    body: "Group policies are copied onto each member, conditions are classified by whether an attacker could meet them, explicit denies override allows, and SCP deny statements are checked. Each grant is labelled admin, IAM control, write, read, list or tagging.",
    where: "AWS in full · Azure, GCP and Kubernetes assignments and bindings",
  },
  {
    icon: GitFork,
    title: "Identity graph",
    body: "Has-policy, member-of, assumes and can-access edges, plus the link from a VM, instance or pod to the identity it runs as. Attack Path and blast-radius analysis read the same graph.",
    where: "AWS identity edges · runs-as links on Azure, GCP and Kubernetes",
  },
  {
    icon: ShieldAlert,
    title: "Escalation paths and shadow admins",
    body: "PassRole to an admin role, multi-hop assume-role chains, permission-boundary removal, and identities that can attach or rewrite their way to an admin policy — plus each cloud's own escalation vectors.",
    where: "AWS, Azure, GCP, OCI, IBM Cloud, Kubernetes · shadow admins on AWS",
  },
  {
    icon: RouteIcon,
    title: "Cross-account and federated trust",
    body: "Role trust policies checked for foreign accounts, wildcard principals, a missing ExternalId and OIDC or SAML federation, including from GitHub, GitLab, GCP and Azure.",
    where: "AWS in depth · cross-tenant, trusted-profile and RAM trust checks elsewhere",
  },
  {
    icon: Bot,
    title: "Non-human identities",
    body: "Roles classified by who can assume them — AWS services, execution roles, CI/CD over OIDC, EKS service accounts, cross-account principals. Managed identities, service accounts and Kubernetes service accounts are resolved like users.",
    where: "AWS, Azure, GCP, Kubernetes",
  },
  {
    icon: ScanSearch,
    title: "Unused permissions",
    body: "CloudTrail activity collected by threat detection is compared with granted actions. You get a permission gap per identity, the high-risk unused actions such as iam:PassRole or kms:ScheduleKeyDeletion, and a list of roles with no recent activity.",
    where: "AWS today",
  },
  {
    icon: Users,
    title: "Risk score and access reviews",
    body: "A 0–100 score built from escalation paths, recent escalation activity seen by CDR, blast radius and permission gap. High-tier identities open a review: pending, needs remediation, reviewed or deferred, with an audit trail.",
    where: "AWS identities today",
  },
];

type Mark = "yes" | "no";
const clouds = ["AWS", "Azure", "GCP", "K8s", "OCI", "Alibaba", "IBM"] as const;
const coverage: { row: string; marks: Mark[] }[] = [
  { row: "Effective-access table", marks: ["yes", "yes", "yes", "yes", "no", "no", "no"] },
  { row: "Escalation detection", marks: ["yes", "yes", "yes", "yes", "yes", "no", "yes"] },
  { row: "Multi-hop assume-role chains", marks: ["yes", "no", "no", "no", "no", "no", "no"] },
  { row: "Shadow admin detection", marks: ["yes", "no", "no", "no", "no", "no", "no"] },
  { row: "Trust and federation checks", marks: ["yes", "yes", "yes", "no", "yes", "yes", "yes"] },
  { row: "Unused permissions and stale roles", marks: ["yes", "no", "no", "no", "no", "no", "no"] },
  { row: "Risk score and access reviews", marks: ["yes", "no", "no", "no", "no", "no", "no"] },
  {
    row: "Identity hygiene (IAM Security)",
    marks: ["yes", "yes", "yes", "yes", "yes", "yes", "yes"],
  },
];

const eyebrow =
  "inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]";
const cardCls =
  "bg-white border border-[#E5E9F0] rounded-2xl p-6 shadow-[0_1px_2px_rgba(16,24,40,.04),0_1px_3px_rgba(16,24,40,.06)]";

export function CiemExtra() {
  return (
    <>
      <section id="architecture" className="py-24 border-b border-[#E5E9F0] bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className={eyebrow}>The whole picture</div>
            <h2 className="mt-5 font-display font-extrabold text-[#0B1220] text-4xl md:text-5xl tracking-tight">
              From identity sources <span className="gradient-text">to a decision</span>
            </h2>
            <p className="mt-5 text-[#475569] leading-relaxed">
              CIEM reads the identities Onam's posture scan already inventories, resolves what each
              one can do, records how they connect, and turns that into findings a person can act
              on.
            </p>
          </div>
          <figure className="mt-12">
            <img
              src="/diagrams/ciem-architecture.svg"
              alt="Onam CIEM: identity sources from seven clouds feed an effective-permission resolver, which builds an identity graph and produces escalation, trust, unused-permission, risk-score and access-review outputs"
              className="w-full h-auto rounded-2xl border border-[#E5E9F0]"
              loading="lazy"
              width={920}
              height={470}
            />
          </figure>
        </div>
      </section>

      <section id="capabilities" className="py-24 border-b border-[#E5E9F0] bg-[#F7F9FC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className={eyebrow}>Capability by capability</div>
            <h2 className="mt-5 font-display font-extrabold text-[#0B1220] text-4xl md:text-5xl tracking-tight">
              What CIEM works out, <span className="gradient-text">and where</span>
            </h2>
            <p className="mt-5 text-[#475569] leading-relaxed">
              Each card says which clouds it runs on today. AWS has the deepest coverage; we would
              rather say that than let a checkmark imply otherwise.
            </p>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((c) => (
              <div key={c.title} className={cardCls}>
                <div className="w-10 h-10 rounded-xl grid place-items-center bg-[#ECFEFF]">
                  <c.icon className="w-5 h-5 text-[#0891B2]" />
                </div>
                <h3 className="mt-4 font-display font-bold text-[#0B1220] text-lg">{c.title}</h3>
                <p className="mt-2 text-sm text-[#475569] leading-relaxed">{c.body}</p>
                <p className="mt-4 pt-3 border-t border-[#E5E9F0] text-xs font-semibold text-[#334155]">
                  {c.where}
                </p>
              </div>
            ))}
            <Link
              to="/docs/$"
              params={{ _splat: "ciem/overview" }}
              className={`${cardCls} group flex flex-col justify-between hover:border-[#2563EB] transition`}
            >
              <div>
                <h3 className="font-display font-bold text-[#0B1220] text-lg">
                  Read the CIEM docs
                </h3>
                <p className="mt-2 text-sm text-[#475569] leading-relaxed">
                  How effective permissions are computed, every finding type, the right-sizing
                  workflow and per-cloud notes.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB]">
                Open the docs{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section id="coverage" className="py-24 border-b border-[#E5E9F0] bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className={eyebrow}>Per-cloud coverage</div>
            <h2 className="mt-5 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
              What runs on which cloud today
            </h2>
          </div>
          <div className="mt-10 overflow-x-auto rounded-2xl border border-[#E5E9F0]">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-[#F7F9FC] text-[#334155]">
                <tr>
                  <th scope="col" className="text-left font-semibold px-4 py-3">
                    Capability
                  </th>
                  {clouds.map((c) => (
                    <th key={c} scope="col" className="font-semibold px-3 py-3 text-center">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E9F0]">
                {coverage.map((r) => (
                  <tr key={r.row}>
                    <th scope="row" className="text-left font-medium text-[#0B1220] px-4 py-3">
                      {r.row}
                    </th>
                    {r.marks.map((m, i) => (
                      <td key={clouds[i]} className="px-3 py-3 text-center">
                        {m === "yes" ? (
                          <Check className="inline w-4 h-4 text-[#059669]" aria-label="Yes" />
                        ) : (
                          <Minus className="inline w-4 h-4 text-[#CBD5E1]" aria-label="Not yet" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-[#64748B] text-center">
            Identity hygiene — MFA, key age, password policy, root usage — is covered on all seven
            clouds through{" "}
            <Link to="/platform/iam" className="text-[#2563EB] hover:underline">
              IAM Security
            </Link>
            , which shares this engine and inventory.
          </p>
        </div>
      </section>
    </>
  );
}
