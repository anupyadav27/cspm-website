import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandButton } from "@/components/site/BrandButton";
import { seo } from "@/lib/seo";
import { FRAMEWORKS } from "@/lib/product-facts";

/**
 * Trust Center — /trust
 *
 * Source: marketing/onam-assets/trust/TRUST-CENTER.md (draft 2026-09-26, owner decisions
 * 2026-09-27), checked read-only against the product repository. Rules for this page:
 *
 * - Onam holds NO certification, attestation or registry listing. Nothing here may say or
 *   imply otherwise. A roadmap item moves to "achieved" only when the certificate, report or
 *   registry URL exists and facts/product.yaml records it as cleared.
 * - Every "OWNER TO CONFIRM" line in the draft was left OUT. Add one only after the owner
 *   confirms it in the draft.
 * - Encryption wording is fixed by product.yaml (company.note). Do not shorten it to a
 *   blanket "fully encrypted".
 * - /.well-known/security.txt points at #vulnerability-disclosure and #acknowledgments.
 *   Keep those ids.
 */

const UPDATED = "5 October 2026";
const SECURITY_EMAIL = "security@onamsecurity.com";

export const Route = createFileRoute("/trust")({
  head: () =>
    seo({
      title: "Trust Center — how Onam Security protects your data — Onam Security",
      description:
        "Onam Security Trust Center: how we connect to your clouds, what we store, encryption, sub-processors, and how to report a vulnerability.",
      path: "/trust",
    }),
  component: TrustPage,
});

const SECTIONS = [
  { id: "where-we-are", label: "Compliance mapping" },
  { id: "cloud-access", label: "How Onam connects" },
  { id: "data", label: "What we store" },
  { id: "encryption", label: "Encryption" },
  { id: "sign-in", label: "Sign-in and access" },
  { id: "isolation", label: "Keeping customers apart" },
  { id: "logging", label: "Logging and backups" },
  { id: "sub-processors", label: "Sub-processors" },
  { id: "vulnerability-disclosure", label: "Vulnerability disclosure" },
  { id: "acknowledgments", label: "Acknowledgments" },
];

const CLOUD_ACCESS: { cloud: string; create: string; access: string }[] = [
  {
    cloud: "AWS",
    create: "An IAM role that Onam assumes with an External ID",
    access:
      "AWS-managed SecurityAudit and ReadOnlyAccess policies, read of AWS Organizations account lists, and permission to start Onam's scan workflow in your account",
  },
  {
    cloud: "Azure",
    create: "Role assignments for Onam's service principal",
    access: "Built-in Reader and Storage Blob Data Reader",
  },
  {
    cloud: "Google Cloud",
    create: "A service account",
    access: "Viewer, Cloud Asset Viewer and Security Reviewer; billing read only if you opt in",
  },
  {
    cloud: "Oracle Cloud (OCI)",
    create: "A dedicated user and group",
    access:
      "read policies across the tenancy, including users, groups, policies, vaults, keys and secret metadata",
  },
  {
    cloud: "Alibaba Cloud",
    create: "A dedicated RAM user",
    access: "A dedicated read-only RAM policy",
  },
  {
    cloud: "IBM Cloud",
    create: "A service ID",
    access: "Viewer-level (read-only) access, scoped to a resource group",
  },
];

const SUB_PROCESSORS: { name: string; purpose: string; location: string }[] = [
  {
    name: "Amazon Web Services",
    purpose:
      "Hosting, databases, key management, and the model behind the AI assistant (Amazon Bedrock)",
    location:
      "The region agreed with each customer — US, Europe, India or other regions — to meet your compliance requirements",
  },
  {
    name: "Mistral AI",
    purpose:
      "AI Code Fix only, and only when you run it: the content of each source file that has findings is sent to the model to generate the fix",
    location: "Mistral AI's hosted API",
  },
  {
    name: "Google Workspace",
    purpose: "Email and collaboration",
    location: "Google's standard hosting regions",
  },
];

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-[#E2E8F2] pt-10">
      <h2 className="text-[25px] font-bold tracking-[-0.4px] text-[#0B1220]">{title}</h2>
      <div className="mt-4 space-y-4 text-[15.5px] leading-relaxed text-[#475569]">{children}</div>
    </section>
  );
}

function TrustPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-[900px] px-5 pt-12 pb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#CBD5E1] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[2px] text-[#2563EB]">
          <ShieldCheck className="h-3.5 w-3.5" />
          Trust Center
        </div>
        <h1 className="mt-4 text-[38px] font-extrabold leading-[1.08] tracking-[-1px] text-[#0B1220] sm:text-[44px]">
          Security at Onam
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-[#475569]">
          Onam Security reads your cloud configuration so it can show you which risks an attacker
          can reach. That makes our own security part of the product. This page explains, plainly,
          how Onam connects to your clouds, what it stores, and what we have and have not done yet.
        </p>
        <p className="mt-3 text-[13px] text-[#5C6B84]">Last updated {UPDATED}.</p>

        <nav
          aria-label="On this page"
          className="mt-8 rounded-2xl border border-[#E2E8F2] bg-[#F8FAFC] p-5"
        >
          <p className="text-[12px] font-bold uppercase tracking-[1.5px] text-[#5C6B84]">
            On this page
          </p>
          <ul className="mt-3 grid gap-x-6 gap-y-1.5 text-[14.5px] sm:grid-cols-2">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-[#2563EB] hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <div className="mx-auto max-w-[900px] space-y-12 px-5 pb-16">
        <Section id="where-we-are" title="Compliance mapping">
          <p>
            Onam&rsquo;s product maps <em>your</em> findings to {FRAMEWORKS} compliance frameworks.
            That is a product feature, not a statement about Onam&rsquo;s own certification.
          </p>
        </Section>

        <Section id="cloud-access" title="How Onam connects to your clouds">
          <p>
            You grant access with a template we provide, run in your own account, so you can read
            every permission before you deploy it.
          </p>
          <div className="overflow-x-auto rounded-xl border border-[#E2E8F2]">
            <table className="w-full min-w-[600px] text-left text-[14px]">
              <thead className="bg-[#F8FAFC] text-[#0B1220]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Cloud</th>
                  <th className="px-4 py-3 font-semibold">What you create</th>
                  <th className="px-4 py-3 font-semibold">Access level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F2]">
                {CLOUD_ACCESS.map((r) => (
                  <tr key={r.cloud} className="align-top">
                    <td className="px-4 py-3 font-semibold text-[#0B1220]">{r.cloud}</td>
                    <td className="px-4 py-3">{r.create}</td>
                    <td className="px-4 py-3">{r.access}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            <strong className="text-[#0B1220]">Posture scanning is read-only.</strong> It uses read
            permissions only.
          </p>
          <p>
            <strong className="text-[#0B1220]">
              Agentless workload scanning runs inside your account.
            </strong>{" "}
            If you enable it (AWS, Azure, Google Cloud), the template also creates resources in your
            account: a scan workflow, short-lived scan machines built from disk snapshots, and a
            storage bucket for results. Those resources hold the permissions needed to create and
            delete snapshots and scan machines; Onam&rsquo;s own role can only start that workflow,
            not create or delete resources itself. Leftover scan resources are removed automatically
            after a set number of hours.
          </p>
          <p>
            <strong className="text-[#0B1220]">What Onam reads.</strong> AWS&rsquo;s ReadOnlyAccess
            policy and Azure&rsquo;s Storage Blob Data Reader role are broad enough to read stored
            objects, not only configuration. Onam requests them so data security posture management
            can locate where sensitive data lives. Posture scanning and data classification read
            configuration and metadata; they do not read the contents of your files, objects or
            database rows.
          </p>
        </Section>

        <Section id="data" title="What we store, and where">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-[#0B1220]">Hosting:</strong> Onam runs on AWS, in the region
              agreed with you — US, Europe, India or other regions — so you can meet your own
              compliance requirements.
            </li>
            <li>
              <strong className="text-[#0B1220]">What we store:</strong> configuration and metadata
              from your clouds, findings, the asset and attack-path graph, and your users&rsquo;
              account details, in PostgreSQL and a graph database (Neo4j).
            </li>
            <li>
              <strong className="text-[#0B1220]">Your cloud credentials:</strong> where a cloud
              needs a stored credential (for example an OCI API key or an Alibaba Cloud access key),
              it is kept in AWS Secrets Manager, which encrypts it with AWS KMS. For AWS we store no
              secret — Onam assumes your role.
            </li>
            <li>
              <strong className="text-[#0B1220]">Your source code (AI Code Fix only):</strong> when
              you run a fix, the repository is cloned for that run and the clone is deleted when it
              finishes. The Git token is used for that request only and is never stored or logged.
              See{" "}
              <Link to="/platform/ai-code-fix" className="text-[#2563EB] underline">
                AI Code Fix
              </Link>
              .
            </li>
            <li>
              <strong className="text-[#0B1220]">Retention and deletion:</strong> customer data is
              kept for 30 days after a customer deactivates, then deleted.
            </li>
          </ul>
        </Section>

        <Section id="encryption" title="Encryption">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-[#0B1220]">At rest:</strong> customer data is encrypted at
              rest. Stored credentials are encrypted by AWS KMS through Secrets Manager.
            </li>
            <li>
              <strong className="text-[#0B1220]">In transit:</strong> data is encrypted in transit
              for all customer-facing and service-to-service traffic, with one internal job being
              moved to TLS. Browser-to-Onam traffic uses HTTPS.
            </li>
          </ul>
        </Section>

        <Section id="sign-in" title="Signing in and access control">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-[#0B1220]">Single sign-on:</strong> SAML 2.0 (set up per
              organisation), OpenID Connect, Google and Microsoft sign-in.
            </li>
            <li>
              <strong className="text-[#0B1220]">Multi-factor authentication:</strong> use your
              identity provider&rsquo;s MFA through single sign-on. Built-in MFA for password
              sign-in is not available yet.
            </li>
            <li>
              <strong className="text-[#0B1220]">Session cookies</strong> are HttpOnly, Secure in
              production, and SameSite=Lax.
            </li>
            <li>
              <strong className="text-[#0B1220]">Roles:</strong> users are invited into an
              organisation and can be limited to specific cloud accounts. Read-only roles cannot
              start scans or fixes.
            </li>
          </ul>
        </Section>

        <Section id="isolation" title="Keeping customers apart">
          <p>
            Every customer&rsquo;s data carries a tenant identifier. In our main databases,
            PostgreSQL row-level security policies make the database itself refuse to return another
            tenant&rsquo;s rows.
          </p>
        </Section>

        <Section id="logging" title="Logging and backups">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Reads of the product&rsquo;s data views are written to an audit log: who, what, when,
              from where, and the result.
            </li>
            <li>Databases are backed up with AWS Backup.</li>
          </ul>
        </Section>

        <Section id="sub-processors" title="Sub-processors">
          <p>The third parties that process customer data on our behalf today:</p>
          <div className="overflow-x-auto rounded-xl border border-[#E2E8F2]">
            <table className="w-full min-w-[600px] text-left text-[14px]">
              <thead className="bg-[#F8FAFC] text-[#0B1220]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Sub-processor</th>
                  <th className="px-4 py-3 font-semibold">Purpose</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F2]">
                {SUB_PROCESSORS.map((r) => (
                  <tr key={r.name} className="align-top">
                    <td className="px-4 py-3 font-semibold text-[#0B1220]">{r.name}</td>
                    <td className="px-4 py-3">{r.purpose}</td>
                    <td className="px-4 py-3">{r.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>We will update this list before adding a new sub-processor.</p>
        </Section>

        <Section id="vulnerability-disclosure" title="Vulnerability disclosure">
          <p>
            Found a security issue in Onam? Email{" "}
            <a href={`mailto:${SECURITY_EMAIL}`} className="font-semibold text-[#2563EB] underline">
              {SECURITY_EMAIL}
            </a>
            . Please give us enough detail to reproduce it, and a reasonable time to fix it before
            telling others.
          </p>
          <p>
            <strong className="text-[#0B1220]">Safe harbor.</strong> We will not take legal action
            against research done in good faith that avoids privacy violations, data destruction and
            service disruption, and that tests only accounts you own.
          </p>
          <p>
            Our machine-readable contact file is at{" "}
            <a href="/.well-known/security.txt" className="text-[#2563EB] underline">
              /.well-known/security.txt
            </a>
            .
          </p>
        </Section>

        <Section id="acknowledgments" title="Acknowledgments">
          <p>We thank the researchers who report issues to us. None have been reported yet.</p>
        </Section>

        <section className="rounded-2xl border border-[#E2E8F2] bg-white p-7">
          <h2 className="text-[21px] font-bold tracking-[-0.3px] text-[#0B1220]">Ask us</h2>
          <p className="mt-3 text-[15.5px] leading-relaxed text-[#475569]">
            Security questionnaire, DPA request, or a question this page does not answer? Write to
            us. We aim to answer standard security questionnaires within 2 working days.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <BrandButton href={`mailto:${SECURITY_EMAIL}`} size="lg">
              <Mail className="h-4 w-4" />
              {SECURITY_EMAIL}
            </BrandButton>
            <BrandButton to="/company/privacy" variant="secondary" size="lg">
              Privacy policy
              <ArrowRight className="h-4 w-4" />
            </BrandButton>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
