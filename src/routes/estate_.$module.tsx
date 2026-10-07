import { createFileRoute, notFound } from "@tanstack/react-router";
import { CapabilityPage, capabilityHead } from "@/components/site/CapabilityPage";
import { getCapability } from "@/data/capabilities";

/**
 * /estate/<module> — one capability of the product (src/data/capabilities/estate.ts).
 * The trailing underscore keeps it un-nested: /estate renders on its own (no <Outlet/>).
 */
export const Route = createFileRoute("/estate_/$module")({
  loader: ({ params }) => {
    // Only the slug crosses to the client: a Capability holds an icon component.
    if (!getCapability("estate", params.module)) throw notFound();
    return { slug: params.module };
  },
  head: ({ params }) => capabilityHead("estate", params.module),
  component: Page,
});

function Page() {
  const { module } = Route.useParams();
  const cap = getCapability("estate", module);
  if (!cap) return null;
  return <CapabilityPage cap={cap} />;
}
