import { createFileRoute, redirect } from "@tanstack/react-router";

/** The blog lives at /resources/blog; /blog is the address people type and link to. 301, see src/data/retired-pages.ts for retired posts. */
export const Route = createFileRoute("/blog/")({
  beforeLoad: () => {
    throw redirect({ href: "/resources/blog", statusCode: 301 });
  },
});
