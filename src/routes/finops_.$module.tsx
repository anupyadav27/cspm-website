import { createFileRoute, notFound } from "@tanstack/react-router";
import { CapabilityPage, capabilityHead } from "@/components/site/CapabilityPage";
import { getCapability } from "@/data/capabilities";

/**
 * /finops/<module> — one capability of the product (src/data/capabilities/finops.ts).
 * The trailing underscore keeps it un-nested: /finops renders on its own (no <Outlet/>).
 */
export const Route = createFileRoute("/finops_/$module")({
  loader: ({ params }) => {
    // Only the slug crosses to the client: a Capability holds an icon component.
    if (!getCapability("finops", params.module)) throw notFound();
    return { slug: params.module };
  },
  head: ({ params }) => capabilityHead("finops", params.module),
  component: Page,
});

function Page() {
  const { module } = Route.useParams();
  const cap = getCapability("finops", module);
  if (!cap) return null;
  return <CapabilityPage cap={cap} />;
}
