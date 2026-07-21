import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/company/terms")({
  head: () =>
    seo({
      title: "Terms of Service — Onam Security",
      description:
        "The terms governing your use of Onam Security's cloud security platform and website.",
      path: "/company/terms",
    }),
  component: TermsPage,
});

const sections: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "acceptance",
    title: "1. Acceptance",
    body: (
      <p>
        By accessing or using the Onam Security platform, website, or APIs (the "Service"), you agree to these Terms of Service on behalf of yourself and, if applicable, the organisation you represent ("Customer"). If you do not agree, do not use the Service.
      </p>
    ),
  },
  {
    id: "service",
    title: "2. The service",
    body: (
      <p>
        Onam provides a cloud security platform that reads configuration metadata from customer-connected cloud environments and returns findings, dashboards, and reports. The Service operates in read-only mode with respect to customer cloud environments and does not read data-plane content.
      </p>
    ),
  },
  {
    id: "subscription",
    title: "3. Subscription & billing",
    body: (
      <>
        <p>
          Access to the Service is offered under Free, Pro, and Enterprise plans. Fees, resource-count pricing, and billing terms for each plan are as published on our pricing page or in an executed order form. Unless otherwise agreed in writing, Pro plans are billed monthly and Enterprise plans are billed annually in advance.
        </p>
        <p className="mt-2">
          You are responsible for keeping billing information current. Non-payment may result in suspension or termination of the Service.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "4. Acceptable use",
    body: (
      <>
        <p>You agree not to: (a) use the Service to violate any law or third-party right; (b) attempt to gain unauthorised access to the Service or other customers' data; (c) reverse-engineer the Service except to the extent permitted by law; (d) resell or make the Service available to third parties without our written consent; or (e) submit credentials, keys, or authorisation material that you are not authorised to provide.</p>
      </>
    ),
  },
  {
    id: "customer-data",
    title: "5. Customer data",
    body: (
      <p>
        As between the parties, Customer retains all right, title, and interest in Customer Data. Customer grants Onam a limited licence to process Customer Data solely to provide, secure, and improve the Service. Onam's data handling is further described in our <a href="/company/privacy" className="text-[#2563EB] font-semibold hover:underline">Privacy Policy</a>.
      </p>
    ),
  },
  {
    id: "warranties",
    title: "6. Warranties & disclaimers",
    body: (
      <>
        <p>Onam warrants that it will provide the Service with reasonable skill and care and in material conformity with the applicable order form.</p>
        <p className="mt-2">
          EXCEPT AS EXPRESSLY STATED IN THESE TERMS OR AN ORDER FORM, THE SERVICE IS PROVIDED "AS IS" AND ONAM DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. ONAM DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "7. Limitation of liability",
    body: (
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER PARTY WILL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, REVENUE, OR DATA. EACH PARTY'S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATING TO THESE TERMS WILL NOT EXCEED THE FEES PAID BY CUSTOMER TO ONAM IN THE TWELVE MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM.
      </p>
    ),
  },
  {
    id: "termination",
    title: "8. Termination",
    body: (
      <p>
        Either party may terminate an Enterprise subscription for material breach if the breach is not cured within thirty (30) days of written notice. Free and Pro accounts may be closed by either party at any time. Upon termination, Customer's access to the Service ends and Customer Data is deleted or anonymised in accordance with our Privacy Policy.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "9. Governing law",
    body: (
      <p>
        These Terms are governed by the laws of the jurisdiction specified in your order form, or in the absence of an order form, the jurisdiction where Onam is incorporated. The parties agree to the exclusive jurisdiction of the courts of that jurisdiction.
      </p>
    ),
  },
  {
    id: "changes",
    title: "10. Changes",
    body: <p>We may update these Terms from time to time. Material changes will be posted here and, where appropriate, communicated by email.</p>,
  },
  {
    id: "contact",
    title: "11. Contact",
    body: (
      <p>
        Questions about these Terms can be sent to{" "}
        <a href="mailto:hello@onam.security" className="text-[#2563EB] font-semibold hover:underline">hello@onam.security</a>.
      </p>
    ),
  },
];

function TermsPage() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-[#E5E9F0] bg-white">
        <div className="absolute inset-0 dot-grid opacity-60" />
        <div className="absolute -top-40 right-1/4 w-[500px] h-[400px] rounded-full bg-[#2563EB]/10 blur-[140px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-14">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#64748B]">Legal</div>
          <h1 className="mt-5 font-display font-black text-[#0B1220] text-4xl md:text-5xl tracking-tight leading-[1.05]">
            Terms of Service
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
