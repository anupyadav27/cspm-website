import { createFileRoute, notFound } from "@tanstack/react-router";
import { CapabilityPage, capabilityHead } from "@/components/site/CapabilityPage";
import { getCapability } from "@/data/capabilities";

/**
 * /disaster-recovery/<module> — one capability of the product (src/data/capabilities/drm.ts).
 * The trailing underscore keeps it un-nested: /disaster-recovery renders on its own (no <Outlet/>).
 */
export const Route = createFileRoute("/disaster-recovery_/$module")({
  loader: ({ params }) => {
    // Only the slug crosses to the client: a Capability holds an icon component.
    if (!getCapability("drm", params.module)) throw notFound();
    return { slug: params.module };
  },
  head: ({ params }) => capabilityHead("drm", params.module),
  component: Page,
});

function Page() {
  const { module } = Route.useParams();
  const cap = getCapability("drm", module);
  if (!cap) return null;
  return <CapabilityPage cap={cap} />;
}
