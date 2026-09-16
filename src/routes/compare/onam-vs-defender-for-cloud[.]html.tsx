import { createFileRoute } from "@tanstack/react-router";
import { legacyCompareRedirect } from "@/lib/legacy-compare";

export const Route = createFileRoute("/compare/onam-vs-defender-for-cloud.html")({
  beforeLoad: legacyCompareRedirect("onam-vs-defender"),
});
