import { createFileRoute, redirect } from "@tanstack/react-router";
import { retiredTarget } from "@/data/retired-pages";

/** /blog/<slug> -> /resources/blog/<slug> (301). A retired slug goes straight to the post that absorbed it. */
export const Route = createFileRoute("/blog/$")({
  beforeLoad: ({ params }) => {
    const slug = (params._splat ?? "").replace(/^\/+|\/+$/g, "");
    const target = slug ? `/resources/blog/${slug}` : "/resources/blog";
    throw redirect({ href: retiredTarget(target) ?? target, statusCode: 301 });
  },
});
