export type DocArticle = {
  slug: string;
  title: string;
  breadcrumb: string;
  /** Meta description; when absent, the first paragraph of the body is used. */
  description?: string;
  body: string; // markdown-ish; see src/components/site/Prose.tsx for supported syntax
};
