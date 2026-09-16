/**
 * The people who put their name on Onam's writing.
 *
 * Why this file exists: until 2026-09-14 every article was bylined "Onam Security Team"
 * with an Organization author in its schema. Search engines weight named, verifiable
 * expertise, and a byline that resolves to a real person with a public profile is the
 * cheapest E-E-A-T signal a young domain can send. Each author here has a page at
 * /company/team/<slug> carrying Person schema; articles reference that page by @id.
 *
 * Rules:
 *  - Only real people, with the role they actually hold. Never a placeholder name.
 *  - `bio` and `linkedin` are optional so a card can ship before the profile is written,
 *    but a Person without `sameAs` is a weak entity — add the LinkedIn URL as soon as it exists.
 *  - A byline means the person wrote or owns the piece; `reviewedBy` means they checked it.
 */
import { SITE_URL } from "../lib/seo";

export type AuthorSlug = "anup-yadav" | "poonam-yadav" | "nishchal-gupta" | "ajay-chaudhary";

export type Author = {
  slug: AuthorSlug;
  name: string;
  role: string;
  initials: string;
  /** Avatar tile colour on the About page and author page. */
  color: string;
  bio?: string;
  linkedin?: string;
  /** What they write about — shown on the author page, used to route new posts. */
  topics: string[];
};

export const AUTHORS: Author[] = [
  {
    slug: "anup-yadav",
    name: "Anup Yadav",
    role: "CEO & Co-founder",
    initials: "AY",
    color: "#2563EB",
    bio: "15+ years in cloud security and infrastructure. Former security architect at a scale-up fintech and enterprise SaaS. Led incident response across AWS and Azure multi-cloud.",
    topics: ["Cloud risk quantification", "Buyer's guides", "Compliance"],
  },
  {
    slug: "poonam-yadav",
    name: "Poonam Yadav",
    role: "Co-founder & Head of Engineering",
    initials: "PY",
    color: "#05A052",
    topics: ["Identity and entitlements (CIEM)", "Kubernetes security", "Data and code security"],
  },
  {
    slug: "nishchal-gupta",
    name: "Nishchal Gupta",
    role: "Head of Sales",
    initials: "NG",
    color: "#7C3AED",
    topics: ["Security graph and attack paths", "Agentless architecture", "Threat detection"],
  },
  {
    slug: "ajay-chaudhary",
    name: "Ajay Chaudhary",
    role: "COO",
    initials: "AC",
    color: "#F2AF04",
    bio: "Operations and go-to-market leader with experience scaling B2B SaaS companies. Runs customer success, partnerships, and the business side of Onam so the engineering team can stay heads-down on the platform.",
    topics: ["Customer success", "Partnerships"],
  },
];

export function getAuthor(slug: string): Author | undefined {
  return AUTHORS.find((a) => a.slug === slug);
}

/**
 * Slugs that were published and then corrected. The old URL is already indexed and
 * cited by external links, so it has to keep resolving — the author route redirects
 * it to the canonical slug rather than letting it 404 and lose the entity's history.
 */
export const RENAMED_SLUGS: Record<string, AuthorSlug> = {
  "nischal-gupta": "nishchal-gupta",
};

/** The author page URL — the canonical identity every article's schema points at. */
export function authorUrl(a: Author): string {
  return `${SITE_URL}/company/team/${a.slug}`;
}

/**
 * schema.org Person. `@id` lets an Article reference the same node from any page, so
 * Google sees one person across the site rather than a fresh anonymous author per post.
 */
export function personJsonLd(a: Author) {
  return {
    "@type": "Person",
    "@id": `${authorUrl(a)}#person`,
    name: a.name,
    jobTitle: a.role,
    url: authorUrl(a),
    worksFor: { "@id": `${SITE_URL}/#organization` },
    ...(a.bio ? { description: a.bio } : {}),
    ...(a.linkedin ? { sameAs: [a.linkedin] } : {}),
  };
}
