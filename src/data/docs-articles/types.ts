export type DocArticle = {
  slug: string;
  title: string;
  breadcrumb: string;
  body: string; // markdown-ish; see src/components/site/Prose.tsx for supported syntax
};
