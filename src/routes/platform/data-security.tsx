import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Eye,
  GitBranch,
  Globe,
  KeyRound,
  Route as RouteIcon,
  Users,
  X,
} from "lucide-react";
import { ProductPageTemplate } from "@/components/site/ProductPageTemplate";
import { DataSecurityFamily } from "@/components/site/DataSecurityFamily";
import { platformPages } from "@/data/platform-pages";
import { seo } from "@/lib/seo";

const data = platformPages["data-security"];

export const Route = createFileRoute("/platform/data-security")({
  head: () =>
    seo({
      title: "DSPM — Data Security Posture Management — Onam Security",
      description: data.metaDescription ?? data.sub,
      path: "/platform/data-security",
      image: "/og/platform-data-security.png",
    }),
  component: () => <ProductPageTemplate data={data} video="dspm" extra={<DspmDeepDive />} />,
});

const eyebrow =
  "inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#EFF4FF] text-[#1D4ED8] border border-[#DBE7FE]";

const reach = [
  {
    icon: Globe,
    title: "Public exposure",
    body: "Public only when a real grant makes it so: the provider's own policy verdict, an ACL grant to all users, or a wildcard principal — each checked against the matching public-access block. The finding names the grant.",
  },
  {
    icon: Users,
    title: "Other accounts",
    body: "Bucket policies are read statement by statement. An Allow to a principal in another account is flagged; write access from outside is critical, and read access is raised to critical when object reads were seen in the last day.",
  },
  {
    icon: Eye,
    title: "Observed access",
    body: "Cloud audit events from the last 30 days, grouped per store: how many accesses, how many distinct principals, which operations, and when it was last touched.",
  },
  {
    icon: KeyRound,
    title: "Encryption and keys",
    body: "The Encryption engine reads DSPM's labels: sensitive data on an unencrypted store is critical, sensitive data on a provider-managed key is high, and key policies are checked for wildcard and outside principals.",
  },
  {
    icon: RouteIcon,
    title: "Attack paths",
    body: "Classification, public access and encryption are written to the security graph. A path that ends at a sensitive, public or unencrypted store is scored as reaching a crown jewel.",
  },
];

const coverage: [string, string][] = [
  [
    "AWS",
    "S3 buckets, RDS instances and Aurora clusters, DynamoDB tables, Redshift clusters, Glue databases, OpenSearch domains, Kinesis streams; Lake Formation grants",
  ],
  [
    "Azure",
    "Storage accounts, Data Lake Storage, Azure SQL servers, Cosmos DB, Synapse workspaces, Key Vault",
  ],
  [
    "Google Cloud",
    "Cloud Storage buckets, Cloud SQL, BigQuery datasets, Spanner, Firestore, Secret Manager",
  ],
  ["Oracle Cloud", "Object Storage buckets, Autonomous Database, NoSQL tables, Streaming"],
  ["Alibaba Cloud", "OSS buckets, ApsaraDB RDS, PolarDB, Tablestore, MaxCompute projects"],
  [
    "IBM Cloud",
    "Cloud Object Storage buckets, Databases for PostgreSQL and other managed databases, Cloudant, Event Streams",
  ],
  [
    "Kubernetes",
    "Secrets, ConfigMaps (credential-like keys), persistent volume claims, StatefulSets",
  ],
  [
    "Self-hosted",
    "PostgreSQL, MySQL, MariaDB, SQL Server, MongoDB, Oracle, Cassandra, IBM Db2 and Snowflake, once onboarded as technology accounts",
  ],
];

const docs: { title: string; slug: string; desc: string }[] = [
  {
    title: "Overview",
    slug: "dspm/overview",
    desc: "What DSPM does, the five stages, and how it connects to the rest of Onam",
  },
  {
    title: "Discovery",
    slug: "dspm/discovery",
    desc: "Which stores are found and what is recorded about each",
  },
  {
    title: "Classification and its limits",
    slug: "dspm/classification",
    desc: "The signals behind every label, and what metadata cannot tell you",
  },
  {
    title: "Access mapping",
    slug: "dspm/access-mapping",
    desc: "Public grants, other accounts, observed access and attack paths",
  },
  {
    title: "Exposure, encryption and residency",
    slug: "dspm/exposure-and-residency",
    desc: "Encryption checks, the governance score and region rules",
  },
  {
    title: "Data lineage",
    slug: "dspm/lineage",
    desc: "How chains are built, what each hop records, what is out of view",
  },
  {
    title: "Findings reference",
    slug: "dspm/findings-reference",
    desc: "Every check, its severity and what passes it",
  },
  {
    title: "Coverage by cloud",
    slug: "dspm/coverage",
    desc: "Store types per cloud and per-service notes",
  },
];

function DspmDeepDive() {
  return (
    <>
      <DataSecurityFamily current="data-security" />

      {/* Pipeline */}
      <section id="pipeline" className="py-20 border-b border-[#E5E9F0] bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className={eyebrow}>The whole pipeline</div>
            <h2 className="mt-5 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
              From a list of stores to findings on the graph
            </h2>
            <p className="mt-4 text-[#475569] leading-relaxed">
              DSPM runs inside every scan, after the posture checks. It reuses what the scan already
              read about each store, so there is nothing extra to connect.
            </p>
          </div>
          <figure className="mt-10">
            <img
              src="/diagrams/dspm-pipeline.svg"
              alt="Five stages of Onam DSPM: data stores, discovery through read-only roles, classification from metadata, the join with exposure, access, encryption and attack paths, and per-store findings"
              className="w-full h-auto rounded-xl border border-[#E5E9F0]"
              loading="lazy"
              width={960}
              height={470}
            />
          </figure>
        </div>
      </section>

      {/* Who can reach it */}
      <section id="who-can-reach-it" className="py-20 border-b border-[#E5E9F0] bg-[#F7F9FC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className={eyebrow}>Who and what can reach it</div>
            <h2 className="mt-5 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
              Five views of access, side by side
            </h2>
            <p className="mt-4 text-[#475569] leading-relaxed">
              A label on its own is a list. What makes it a priority is how the store can be reached
              — so each store carries all five.
            </p>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {reach.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.title} className="bg-white border border-[#E5E9F0] rounded-2xl p-5">
                  <div className="w-9 h-9 rounded-lg grid place-items-center bg-[#EFF4FF]">
                    <Icon className="w-4 h-4 text-[#2563EB]" />
                  </div>
                  <div className="mt-3 font-display font-bold text-[#0B1220]">{r.title}</div>
                  <p className="mt-2 text-sm text-[#475569] leading-relaxed">{r.body}</p>
                </div>
              );
            })}
          </div>
          <p className="mt-8 max-w-3xl mx-auto text-center text-sm text-[#64748B] leading-relaxed">
            What it does not do today: compute, for every store, the complete list of identities
            whose effective permissions allow a read. Identity-by-identity permissions are in{" "}
            <Link to="/platform/ciem" className="text-[#2563EB] font-semibold hover:underline">
              CIEM
            </Link>
            , on the same graph.
          </p>
        </div>
      </section>

      {/* Classification */}
      <section id="classification" className="py-20 border-b border-[#E5E9F0] bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className={eyebrow}>Classification you can audit</div>
            <h2 className="mt-5 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
              Every label traces back to something you can read
            </h2>
            <p className="mt-4 text-[#475569] leading-relaxed">
              Labels come from metadata, so the reason is always something you can read and change:
              a name, a tag, a schema.
            </p>
          </div>
          <figure className="mt-10">
            <img
              src="/diagrams/dspm-catalog-mock.svg"
              alt="Illustrative mock of the DSPM data catalog: five fictional stores with their labels, the likely metadata signal, encryption, public access and governance score"
              className="w-full h-auto rounded-xl border border-[#E5E9F0]"
              loading="lazy"
              width={960}
              height={330}
            />
            <figcaption className="mt-3 text-center text-xs text-[#64748B]">
              Stylised illustration with fictional names — not a screenshot of the console.
            </figcaption>
          </figure>
          <div className="mt-10 grid md:grid-cols-2 gap-4">
            <div className="bg-white border border-[#E5E9F0] rounded-2xl p-6">
              <div className="font-display font-bold text-[#0B1220]">What classification reads</div>
              <ul className="mt-4 space-y-2.5 text-sm text-[#475569]">
                {[
                  "Store names and descriptions",
                  "Tags",
                  "Database and schema names, for self-hosted databases",
                  "Key names in Kubernetes ConfigMaps",
                  "The metadata on posture rules that matched the store",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <Check className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-[#E5E9F0] rounded-2xl p-6">
              <div className="font-display font-bold text-[#0B1220]">What it does not read</div>
              <ul className="mt-4 space-y-2.5 text-sm text-[#475569]">
                {[
                  "Objects or files in a bucket",
                  "Rows in a table",
                  "Messages on a stream",
                  "Secret values",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <X className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-[#64748B] leading-relaxed">
                The trade-off: a store named for what it holds is labelled; one named "exports" is
                not, until you tag it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lineage */}
      <section id="lineage" className="py-20 border-b border-[#E5E9F0] bg-[#F7F9FC]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className={eyebrow}>
              <GitBranch className="w-3.5 h-3.5" /> Data lineage
            </div>
            <h2 className="mt-5 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
              Where the data goes after it lands
            </h2>
            <p className="mt-4 text-[#475569] leading-relaxed">
              Replication, backup, ETL writes, streaming and exports are linked into chains from the
              original source. Each hop that leaves a region or an account is flagged — the moments
              a copy escapes the controls on the original.
            </p>
          </div>
          <figure className="mt-10">
            <img
              src="/diagrams/dspm-lineage-chain.svg"
              alt="Illustrative lineage chain: a Kinesis stream feeds an S3 bucket, which replicates to another region and is exported to a partner account, with the cross-region and cross-account hops flagged"
              className="w-full h-auto rounded-xl border border-[#E5E9F0]"
              loading="lazy"
              width={960}
              height={400}
            />
          </figure>
          <p className="mt-6 max-w-3xl mx-auto text-center text-sm text-[#64748B] leading-relaxed">
            Lineage comes from the relationships the cloud's own configuration describes. A copy
            made by a script with no trace in configuration is outside its view.{" "}
            <Link
              to="/docs/$"
              params={{ _splat: "dspm/lineage" }}
              className="text-[#2563EB] font-semibold hover:underline"
            >
              How chains are built
            </Link>
          </p>
        </div>
      </section>

      {/* Coverage */}
      <section id="coverage" className="py-20 border-b border-[#E5E9F0] bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className={eyebrow}>Coverage</div>
            <h2 className="mt-5 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
              Store types analysed, cloud by cloud
            </h2>
            <p className="mt-4 text-[#475569] leading-relaxed">
              These get the full set of DSPM checks. Other data services — DocumentDB, Neptune,
              Timestream, queues and more — are covered by the storage and database posture rules.
            </p>
          </div>
          <div className="mt-10 overflow-x-auto rounded-2xl border border-[#E5E9F0]">
            <table className="w-full text-sm">
              <tbody>
                {coverage.map(([cloud, stores]) => (
                  <tr key={cloud} className="border-b border-[#E5E9F0] last:border-0">
                    <th
                      scope="row"
                      className="text-left align-top px-5 py-3.5 font-display font-bold text-[#0B1220] whitespace-nowrap bg-[#F8FAFC]"
                    >
                      {cloud}
                    </th>
                    <td className="px-5 py-3.5 text-[#475569] leading-relaxed">{stores}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Docs */}
      <section id="dspm-docs" className="py-20 border-b border-[#E5E9F0] bg-[#F7F9FC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className={eyebrow}>Documentation</div>
            <h2 className="mt-5 font-display font-extrabold text-[#0B1220] text-3xl md:text-4xl tracking-tight">
              The detail, written down
            </h2>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {docs.map((d) => (
              <Link
                key={d.slug}
                to="/docs/$"
                params={{ _splat: d.slug }}
                className="group bg-white border border-[#E5E9F0] rounded-2xl p-5 hover:shadow-[0_12px_28px_rgba(16,24,40,.08)] hover:-translate-y-0.5 transition-all"
              >
                <div className="font-display font-bold text-[#0B1220] group-hover:text-[#2563EB] transition flex items-center justify-between gap-2">
                  {d.title}
                  <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#2563EB] shrink-0" />
                </div>
                <p className="mt-2 text-sm text-[#475569] leading-relaxed">{d.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
