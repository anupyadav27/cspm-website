# Onam Security — Keyword Plan & Visibility Strategy

Written 2026-08-06. Companion to `SEO-RUNBOOK.md`.

## 1. Why the site is invisible today

Four separate causes, in order of impact. Only two are on-page problems.

| # | Cause | Owner | Status |
|---|---|---|---|
| 1 | **Not verified in Google Search Console.** No sitemap submitted, no indexing requests, no query data. The site has been live since ~2026-07-19 and Google has no relationship with it. | User — needs a GSC account | Code hook shipped; token needed |
| 2 | **Domain authority is effectively zero.** ~3 weeks old, no backlinks. Head terms are held by DR 80–90 domains. | Off-page / PR | Long-term |
| 3 | **Four URL variants serve HTTP 200** (`http`/`https` × apex/`www`). Canonicals point the right way, but signals are split and crawl budget is wasted. | Infra (ingress) | See §5 |
| 4 | **On-page targeted only head terms.** Titles read "AWS Cloud Security — Onam" — no modifiers real buyers search. Three had a literal duplicated word ("Google Cloud Cloud Security"). | Site | Fixed 2026-08-06 |

**The honest expectation:** "cloud security", "CSPM", "CNAPP" are 12–24-month, backlink-driven targets. Nothing on-page wins them this quarter. Everything below is built to win the queries that *are* reachable, and to compound into authority for the head terms later.

## 2. Tiering

### Tier 1 — Winnable now (0–3 months)
Low competition, high intent, and Onam has a genuine factual claim.

| Keyword cluster | Target page | Why winnable |
|---|---|---|
| `oracle cloud security posture management`, `OCI CSPM`, `OCI CIS benchmark` | `/solutions/oci` | Only Oracle's own Cloud Guard and two DR-85 vendors compete. Onam has 2,059 OCI posture rules — more than its AWS count. |
| `alibaba cloud security posture management`, `alicloud CSPM` | `/solutions/alicloud` | Thin SERP; most vendors list Alibaba as a checkbox, not a depth claim. 1,151 rules. |
| `IBM cloud security posture management`, `IBM cloud CSPM` | `/solutions/ibm` | Almost no dedicated content exists anywhere. |
| `RBI cyber security framework compliance`, `canada PBMM compliance tool` | `/platform/compliance` | Regional frameworks with near-zero vendor content. Onam ships RBI Bank, RBI NBFC and Canada PBMM. |
| `SSPM tool`, `microsoft 365 security posture`, `snowflake security posture` | `/platform/saas-security` | New page, specific platform names, low competition on the long tail. |
| `agentless workload scanning`, `cloud security without agents` | `/platform/agentless` | Differentiator with a real mechanism to describe. |

### Tier 2 — Reachable with content + some links (3–9 months)
Informational head-adjacent queries. These feed AI answers (ChatGPT/Perplexity/Copilot) as much as classic SERPs, which is why the `/learn` hub exists.

| Keyword | Target page |
|---|---|
| `what is CSPM`, `cloud security posture management explained` | `/learn/cspm` |
| `what is CNAPP`, `CNAPP meaning` | `/learn/cnapp` |
| `what is CWPP`, `CWPP vs CSPM` | `/learn/cwpp` |
| `what is DSPM`, `data security posture management` | `/learn/dspm` |
| `what is CIEM`, `cloud entitlement management` | `/learn/ciem` |
| `what is SSPM`, `SaaS security posture management` | `/learn/sspm` |
| `cloud attack path`, `attack path analysis`, `toxic combination cloud` | `/learn/cloud-attack-path` |
| `agentless cloud security`, `agentless vs agent-based` | `/learn/agentless-cloud-security` |
| `CSPM vs CNAPP vs CWPP` | `/learn` (comparison table) |

### Tier 3 — Aspirational (12–24 months, links required)
`cloud security` · `CSPM` · `CNAPP` · `cloud security platform` · `AWS cloud security`

Do not optimize new pages *for* these. They are won by earning links to Tier 2 assets, not by writing another page.

## 3. Page → primary keyword map

One primary keyword per page. No two pages target the same primary — that is what causes cannibalisation.

| Page | Primary | Secondary |
|---|---|---|
| `/` | cloud security platform | CNAPP, agentless cloud security |
| `/platform/cspm` | cloud security posture management | CSPM tool, multi-cloud CSPM |
| `/platform/cnapp` | CNAPP platform | unified cloud security score |
| `/platform/cwpp` | cloud workload protection platform | agentless workload security |
| `/platform/data-security` | data security posture management | DSPM tool |
| `/platform/ciem` | cloud infrastructure entitlement management | least privilege cloud |
| `/platform/saas-security` | SaaS security posture management | SSPM, M365 security posture |
| `/platform/attack-path` | cloud attack path analysis | toxic combinations, choke points |
| `/platform/agentless` | agentless cloud scanning | snapshot scanning |
| `/solutions/aws` | AWS cloud security posture management | AWS CSPM, AWS misconfigurations |
| `/solutions/oci` | Oracle Cloud security posture management | OCI CSPM |
| `/solutions/alicloud` | Alibaba Cloud security posture management | AliCloud CSPM |
| `/solutions/ibm` | IBM Cloud security posture management | IBM Cloud CSPM |
| `/learn/*` | see Tier 2 | — |

## 4. What actually moves the needle next

In priority order. Items 1–2 are not code.

1. **Verify Google Search Console and submit the sitemap.** Nothing else matters until Google is crawling deliberately. Add the token to `GSC_VERIFICATION` in `src/lib/seo.ts` (or use the DNS TXT method on BigRock) and redeploy.
2. **Earn the first 10 backlinks.** Listicle inclusion is how competitors own these SERPs — the Tier 3 queries return "Top 6 CSPM Tools" posts, not vendor pages. Get on those lists: SlashDot, Expert Insights, G2, Capterra, AWS Marketplace, product directories. This is outreach, not code.
3. **Publish against Tier 1 and Tier 2 weekly** using `/publish-post`.
4. **Fix the 4-way URL split** (§5).

## 5. Redirect debt

`http://www`, `https://apex`, and `http://apex` all return 200 instead of 301-ing to `https://www`. Canonical tags currently carry the load.

**Investigated 2026-08-06 — both ingress routes are blocked by cluster policy.** The admission webhook rejects `permanent-redirect` containing `$request_uri`, and `server-snippet` directives are disabled cluster-wide. The only form that validates drops the path, sending every apex URL to the homepage — which Google treats as a soft-404 and which is *worse* than today's 200-plus-canonical. So nothing was applied. Full detail and the correct manifest are in `deploy/apex-redirect-ingress.yaml`.

`http → https` is separately constrained: TLS terminates at the NLB and nginx receives plain HTTP with **no `X-Forwarded-Proto`**, so nginx cannot tell the schemes apart. The client-side redirect in `__root.tsx` is the only current mechanism, and Googlebot does not reliably honour it.

The clean fix for both is a CDN in front (CloudFront or Cloudflare) doing the 301s at the edge. Worth doing — but it is not what is suppressing visibility, so it ranks below items 1–3 above.

## 6. Measurement

Re-run `/seo-checkup` fortnightly. Track: indexed page count, impressions, average position for the Tier 1 clusters, and referring domains. Expect impressions before clicks, and Tier 1 movement before anything else.
