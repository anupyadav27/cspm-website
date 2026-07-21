import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/company/privacy")({
  head: () =>
    seo({
      title: "Privacy Policy — Onam Security",
      description:
        "How Onam Security collects, uses, and protects data — including cloud connection metadata, sub-processors, retention, and user rights.",
      path: "/company/privacy",
    }),
  component: PrivacyPage,
});

const sections: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "overview",
    title: "Overview",
    body: (
      <>
        <p>
          This Privacy Policy explains how Onam Security ("Onam", "we", "us") collects, uses, and protects data when you visit our website, sign up for an account, or connect a cloud environment to the Onam platform. This page is maintained by Onam Security and is not an independent certification.
        </p>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "What data we collect",
    body: (
      <>
        <p>We collect three categories of data:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li><strong className="text-[#0B1220]">Account data.</strong> Name, work email, company, and role you provide when creating an account or requesting a demo.</li>
          <li><strong className="text-[#0B1220]">Cloud configuration metadata.</strong> Onam reads configuration metadata from the cloud accounts you connect — for example, IAM policy documents, resource tags, security-group rules, and encryption settings. Onam does not read data-plane content (the objects inside your S3 buckets, the rows in your databases, or the payloads in your queues).</li>
          <li><strong className="text-[#0B1220]">Product usage data.</strong> Basic telemetry about how the Onam UI is used — page views, feature interactions, error events — used to improve the product.</li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use it",
    body: (
      <p>
        We use the data above to operate the Onam platform, deliver findings and reports to you, provide support, improve product quality, and communicate about your account. We do not sell your data. We do not use your cloud configuration data to train shared machine-learning models across customers.
      </p>
    ),
  },
  {
    id: "cloud-connection-data",
    title: "Cloud connection data",
    body: (
      <>
        <p>
          When you connect a cloud account to Onam, we store the identifiers required to authenticate to that account — for example, role ARNs, service-principal IDs, and workload-identity federation trust configurations. We do not store static access keys, secret access keys, or long-lived passwords.
        </p>
        <p className="mt-2">
          Every call Onam makes to your cloud is authenticated with a short-lived, tenant-scoped token and uses read-only permissions. Nothing Onam does can modify or delete resources in your environment.
        </p>
      </>
    ),
  },
  {
    id: "subprocessors",
    title: "Sub-processors",
    body: (
      <>
        <p>Onam uses a small number of sub-processors to operate the service. Current sub-processors include cloud infrastructure providers, email delivery, and identity providers used to sign in to Onam. A current list is available on request from <a href="mailto:privacy@onam.security" className="text-[#2563EB] font-semibold hover:underline">privacy@onam.security</a>.</p>
      </>
    ),
  },
  {
    id: "retention",
    title: "Data retention",
    body: (
      <>
        <p>Findings and configuration snapshots are retained per the plan you're on — 30 days on Free, 1 year on Pro, and custom retention on Enterprise. Account data is retained while your account is active and deleted or anonymised within 90 days of account closure, subject to legal-hold obligations.</p>
      </>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <p>Depending on your jurisdiction, you may have the right to access, correct, delete, port, or restrict processing of your personal data. To exercise any of these rights, email <a href="mailto:privacy@onam.security" className="text-[#2563EB] font-semibold hover:underline">privacy@onam.security</a>. We will respond within the timelines required by applicable law.</p>
      </>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: (
      <p>We implement administrative, technical, and physical safeguards designed to protect the data we hold. See our <a href="/company/security" className="text-[#2563EB] font-semibold hover:underline">Security page</a> for details on encryption, access, and vulnerability disclosure.</p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: <p>We may update this policy from time to time. Material changes will be posted here and, where appropriate, communicated by email.</p>,
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Questions about this policy or your data can be sent to{" "}
        <a href="mailto:privacy@onam.security" className="text-[#2563EB] font-semibold hover:underline">privacy@onam.security</a>.
      </p>
    ),
  },
];

function PrivacyPage() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-[#E5E9F0] bg-white">
        <div className="absolute inset-0 dot-grid opacity-60" />
        <div className="absolute -top-40 right-1/4 w-[500px] h-[400px] rounded-full bg-[#2563EB]/10 blur-[140px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-14">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#64748B]">Legal</div>
          <h1 className="mt-5 font-display font-black text-[#0B1220] text-4xl md:text-5xl tracking-tight leading-[1.05]">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-[#64748B]">Last updated: July 2026</p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6 grid lg:grid-cols-[220px_1fr] gap-10">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="text-[11px] uppercase tracking-widest font-bold text-[#64748B] mb-3">On this page</div>
              <nav className="space-y-1.5">
                {sections.map((s) => (
                  <a key={s.id} href={`#${s.id}`} className="block text-sm text-[#475569] hover:text-[#2563EB] transition">
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
          <article className="space-y-10">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="font-display font-extrabold text-[#0B1220] text-2xl tracking-tight">{s.title}</h2>
                <div className="mt-3 text-[#475569] leading-relaxed">{s.body}</div>
              </section>
            ))}
          </article>
        </div>
      </section>
    </SiteLayout>
  );
}
