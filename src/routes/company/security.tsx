import { createFileRoute } from "@tanstack/react-router";
import { Lock, KeyRound, ShieldCheck, FileSearch, EyeOff, Mail } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/company/security")({
  head: () =>
    seo({
      title: "Security & Responsible Disclosure — Onam Security",
      description:
        "Onam Security responsible disclosure policy, security practices, and vulnerability reporting. We take security seriously and respond within 24 hours.",
      path: "/company/security",
    }),
  component: SecurityPage,
});

const practices = [
  { icon: Lock, iconColor: "#2563EB", title: "Encryption at rest", body: "AES-256 for all finding data, configuration snapshots, and credential metadata. Per-tenant encryption keys managed in an HSM-backed key vault." },
  { icon: ShieldCheck, iconColor: "#05A052", title: "Encryption in transit", body: "TLS 1.2 minimum, TLS 1.3 preferred, for every request from browser, API, and cloud-connector traffic." },
  { icon: EyeOff, iconColor: "#F2AF04", title: "Read-only credentials", body: "Onam never writes, deletes, or modifies your cloud resources. Onboarding uses read-only IAM roles or service principals — no destructive permissions." },
  { icon: KeyRound, iconColor: "#E32D25", title: "No credential storage", body: "We store role ARNs, service-account IDs, and workload-identity federation trust configuration — never static access keys or passwords." },
  { icon: FileSearch, iconColor: "#2563EB", title: "Penetration testing", body: "Annual third-party penetration test by an independent CREST-affiliated firm. Executive summary is available on request under NDA." },
];

function SecurityPage() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-[#E5E9F0] bg-white">
        <div className="absolute inset-0 dot-grid opacity-60" />
        <div className="absolute -top-40 right-1/4 w-[600px] h-[500px] rounded-full bg-[#2563EB]/10 blur-[140px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#64748B]">Security</div>
          <h1 className="mt-5 font-display font-black text-[#0B1220] text-4xl md:text-5xl tracking-tight leading-[1.05]">
            Security & responsible disclosure.
          </h1>
          <p className="mt-6 text-lg text-[#475569] leading-relaxed">
            Onam Security responsible disclosure policy, security practices, and vulnerability reporting. We take security seriously and respond within 24 hours.
          </p>
          <p className="mt-4 text-sm text-[#64748B]">This page is maintained by Onam Security. Last updated: July 2026.</p>
        </div>
      </section>

      <section className="bg-[#F7F9FC] border-b border-[#E5E9F0] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
              Practices
            </div>
            <h2 className="mt-4 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
              How we protect your data
            </h2>
            <p className="mt-3 text-[#475569]">
              These are the controls currently enabled in Onam's production environment. This page is app-owner content and not an independent certification.
            </p>
          </div>
          <div className="mt-12 grid md:grid-cols-2 gap-5">
            {practices.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="bg-white border border-[#E5E9F0] rounded-2xl p-6 shadow-[0_1px_2px_rgba(16,24,40,.04),0_1px_3px_rgba(16,24,40,.06)]">
                  <div
                    className="w-12 h-12 rounded-xl grid place-items-center"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${p.iconColor} 12%, #FFFFFF)`,
                      boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${p.iconColor} 22%, transparent)`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: p.iconColor }} />
                  </div>
                  <h3 className="mt-5 font-display font-bold text-[#0B1220] text-lg">{p.title}</h3>
                  <p className="mt-2 text-sm text-[#475569] leading-relaxed">{p.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]">
            Responsible disclosure
          </div>
          <h2 className="mt-4 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
            Report a vulnerability
          </h2>

          <div className="mt-8 space-y-6 text-[#475569] leading-relaxed">
            <p>
              If you believe you've discovered a vulnerability in Onam's platform or website, we want to hear from you. Report it to{" "}
              <a href="mailto:security@onam.security" className="text-[#2563EB] font-semibold hover:underline">security@onam.security</a>{" "}
              with steps to reproduce, affected endpoints, and any relevant proof-of-concept material.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white border border-[#E5E9F0] rounded-2xl p-5">
                <div className="text-[11px] uppercase tracking-widest font-bold text-[#64748B]">Acknowledgement</div>
                <div className="mt-2 font-display font-bold text-[#0B1220] text-lg">Within 24 hours</div>
                <p className="mt-1.5 text-sm text-[#475569]">A human confirms receipt of your report.</p>
              </div>
              <div className="bg-white border border-[#E5E9F0] rounded-2xl p-5">
                <div className="text-[11px] uppercase tracking-widest font-bold text-[#64748B]">Initial triage</div>
                <div className="mt-2 font-display font-bold text-[#0B1220] text-lg">Within 5 business days</div>
                <p className="mt-1.5 text-sm text-[#475569]">Severity assessed and validated.</p>
              </div>
              <div className="bg-white border border-[#E5E9F0] rounded-2xl p-5">
                <div className="text-[11px] uppercase tracking-widest font-bold text-[#64748B]">Remediation</div>
                <div className="mt-2 font-display font-bold text-[#0B1220] text-lg">Prioritised by severity</div>
                <p className="mt-1.5 text-sm text-[#475569]">You are kept in the loop until closure.</p>
              </div>
            </div>

            <div>
              <h3 className="font-display font-bold text-[#0B1220] text-lg">Safe harbour</h3>
              <p className="mt-2">
                Onam will not pursue legal action against researchers who act in good faith to identify and report vulnerabilities, provided they: avoid privacy violations, service degradation, and data destruction; do not access or modify data that does not belong to them beyond what is necessary to demonstrate the vulnerability; give us a reasonable opportunity to remediate before public disclosure; and stop testing and report immediately if they encounter sensitive data.
              </p>
            </div>

            <div>
              <h3 className="font-display font-bold text-[#0B1220] text-lg">Out of scope</h3>
              <p className="mt-2">
                Reports of missing best-practice headers without a demonstrable impact, self-XSS, social engineering, physical attacks, and any activity that violates the safe-harbour conditions above.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-[#DBE7FE] bg-[#EFF4FF] p-6 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl grid place-items-center bg-[#2563EB] text-white shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-[#0B1220]">security@onam.security</div>
              <p className="text-sm text-[#475569] mt-1">PGP key available on request. Please do not include exploit payloads that would trigger production alerts before we've had a chance to acknowledge your report.</p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
