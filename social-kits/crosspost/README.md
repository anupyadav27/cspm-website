# Cross-posting guide — dev.to + Medium

Both platforms are high-authority domains that get indexed in days and are
heavily cited by Perplexity/ChatGPT. Every post links back canonically to
onamsecurity.com, so no duplicate-content penalty — the authority flows to us.

## dev.to (files in `dev-to/`)

One-time: create account at dev.to (sign in with GitHub once the org exists —
nice cross-link), set profile name "Onam Security", website, avatar from
`social-kits/brand/avatar-blue-400.png`.

Per post (~2 min each):
1. New Post → click the ⚙ next to Save → make sure "Use front matter" editor is on
   (or just paste — dev.to reads the `---` front matter block automatically).
2. Paste the entire file content (front matter included). The `canonical_url`
   is already set to the original post.
3. Change `published: false` → `published: true` when happy, Save.

Pace: 2–3 posts per day, not all 10 at once (new accounts dumping 10 posts
look spammy and get rate-limited). Start with 01 (comparison post), 03 (AWS
misconfigurations), 06 (attack paths) — the three with the broadest pull.

## Medium — no files needed, use the importer

Medium fetches the live page and sets the canonical link automatically:

1. medium.com → profile icon → **Stories → Import a story**
2. Paste each URL below → Import → review formatting → Publish.

https://www.onamsecurity.com/resources/blog/onam-vs-wiz-orca-prisma-cloud
https://www.onamsecurity.com/resources/blog/cdr-behavioral-threat-detection
https://www.onamsecurity.com/resources/blog/aws-misconfigurations-first-scan
https://www.onamsecurity.com/resources/blog/ciem-vs-iam-security
https://www.onamsecurity.com/resources/blog/ai-powered-cloud-remediation
https://www.onamsecurity.com/resources/blog/attack-path-4000-to-3
https://www.onamsecurity.com/resources/blog/fair-model-cloud-risk
https://www.onamsecurity.com/resources/blog/why-cloud-iam-permissions-are-never-used
https://www.onamsecurity.com/resources/blog/mitre-attack-cloud-mapping
https://www.onamsecurity.com/resources/blog/agentless-cloud-security-architecture

Add 3–5 topic tags on each (Cloud Security, Cybersecurity, AWS, DevOps,
Cloud Computing). Same pacing: a few per day.

## Regenerating

`npx tsx scripts/generate-crossposts.ts` — rebuilds `dev-to/` from
`src/data/blog-posts.ts` (new posts included automatically). Two posts are
currently skipped because they have no body yet: kubernetes-rbac-pitfalls,
epss-over-cvss.
