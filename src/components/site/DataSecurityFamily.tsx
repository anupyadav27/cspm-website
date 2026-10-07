import { Link } from "@tanstack/react-router";
import { ArrowRight, Database, HardDrive, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * "Three pages, one data picture" — shown on /platform/data-security,
 * /platform/database-security and /platform/encryption so a reader on any of
 * the three can see what the other two answer and what passes between them.
 * Every line here is grounded in what the datasec, database-security and
 * encryption-security engines exchange in code.
 */

type Key = "data-security" | "database-security" | "encryption";

const members: {
  key: Key;
  href: "/platform/data-security" | "/platform/database-security" | "/platform/encryption";
  icon: typeof Database;
  color: string;
  name: string;
  asks: string;
  covers: string;
  gives: string;
}[] = [
  {
    key: "data-security",
    href: "/platform/data-security",
    icon: Database,
    color: "#F59E0B",
    name: "DSPM — Data Security",
    asks: "What data do we hold, where, and how exposed is it?",
    covers: "Every kind of store: buckets, databases, warehouses, streams, Kubernetes secrets.",
    gives:
      "Labels (PII, PHI, PCI, financial, confidential), public and cross-account exposure, lineage.",
  },
  {
    key: "database-security",
    href: "/platform/database-security",
    icon: HardDrive,
    color: "#FB923C",
    name: "Database Security",
    asks: "Is each database hardened, private, audited and backed up?",
    covers: "Managed and self-hosted databases, down to CIS benchmarks for the engine itself.",
    gives:
      "A six-domain posture score per database, ranked higher where DSPM found sensitive data.",
  },
  {
    key: "encryption",
    href: "/platform/encryption",
    icon: Lock,
    color: "#EAB308",
    name: "Encryption & Keys",
    asks: "Is it encrypted, with a key we control, and who does the key let in?",
    covers: "KMS keys, vaults, certificates and secrets managers across every cloud.",
    gives: "Coverage, key-policy reach, rotation and drift — and sensitive stores on weak keys.",
  },
];

export function DataSecurityFamily({ current }: { current: Key }) {
  return (
    <section id="data-family" className="py-20 border-b border-[#E5E9F0] bg-[#F7F9FC]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
            Three pages, one data picture
          </div>
          <h2 className="mt-5 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
            DSPM, Database Security and Encryption share one scan
          </h2>
          <p className="mt-4 text-[#475569] leading-relaxed">
            They answer different questions about the same data. DSPM decides what is sensitive; the
            other two use that label to rank what they find.
          </p>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {members.map((m) => {
            const Icon = m.icon;
            const here = m.key === current;
            return (
              <div
                key={m.key}
                className={cn(
                  "bg-white rounded-2xl p-6 border flex flex-col",
                  here
                    ? "border-[#2563EB] shadow-[0_0_0_3px_rgba(37,99,235,.10)]"
                    : "border-[#E5E9F0]",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl grid place-items-center shrink-0"
                    style={{ backgroundColor: `color-mix(in srgb, ${m.color} 14%, #FFFFFF)` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: m.color }} />
                  </div>
                  <div className="font-display font-bold text-[#0B1220]">{m.name}</div>
                  {here && (
                    <span className="ml-auto text-[11px] font-bold uppercase tracking-widest text-[#2563EB]">
                      You are here
                    </span>
                  )}
                </div>
                <p className="mt-4 text-[#0B1220] font-semibold leading-snug">{m.asks}</p>
                <dl className="mt-3 space-y-2 text-sm text-[#475569] leading-relaxed flex-1">
                  <div>
                    <dt className="inline font-semibold text-[#334155]">Covers: </dt>
                    <dd className="inline">{m.covers}</dd>
                  </div>
                  <div>
                    <dt className="inline font-semibold text-[#334155]">Gives you: </dt>
                    <dd className="inline">{m.gives}</dd>
                  </div>
                </dl>
                {!here && (
                  <Link
                    to={m.href}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:gap-2.5 transition-all"
                  >
                    Go to {m.name} <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-8 text-center text-sm text-[#64748B]">
          How the labels pass between them is set out in the{" "}
          <Link
            to="/docs/$"
            params={{ _splat: "dspm/overview" }}
            className="text-[#2563EB] font-semibold hover:underline"
          >
            DSPM documentation
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
