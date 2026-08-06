export const SITE_URL = "https://www.onamsecurity.com";

/**
 * Google Search Console HTML-tag verification token.
 *
 * Paste the value from the `content="…"` attribute Google shows under
 * Settings → Ownership verification → HTML tag, then redeploy. Leave empty to
 * omit the tag entirely (an empty verification tag is worse than none —
 * Google reads it as a failed check).
 *
 * The DNS TXT method on BigRock is an equally valid alternative and survives
 * redeploys; use whichever is easier to keep in place.
 */
export const GSC_VERIFICATION = "";

type SeoInput = {
  title: string;
  description: string;
  /** Route path starting with "/", e.g. "/platform/cspm" */
  path: string;
  /** Site-relative image path; defaults to the shared OG card */
  image?: string;
  ogType?: "website" | "article";
};

/**
 * Builds the full per-page head: title, description, canonical URL, and
 * Open Graph / Twitter tags with absolute URLs. Root-level defaults
 * (charset, viewport, og:site_name, twitter:card, …) live in __root.tsx;
 * TanStack dedupes by name/property so per-page values here win.
 */
export function seo({ title, description, path, image = "/og-image.png", ogType = "website" }: SeoInput) {
  const url = `${SITE_URL}${path === "/" ? "/" : path}`;
  const imageUrl = `${SITE_URL}${image}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: ogType },
      { property: "og:url", content: url },
      { property: "og:image", content: imageUrl },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

/** FAQPage JSON-LD from visible {q, a} pairs — must mirror on-page FAQ content exactly. */
export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** First readable paragraph of a markdown body, trimmed to meta-description length. */
export function descriptionFromMarkdown(body: string, max = 155): string {
  const paragraphs = body
    .replace(/```[\s\S]*?```/g, "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p && !/^[#>|\-*\d]|^!\[/.test(p));
  const text = (paragraphs[0] ?? "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}
