# Entity Profile Copy Pack — paste-ready

Create these three profiles, each linking to https://www.onamsecurity.com.
After creating them, give Claude the URLs — they get added to the site's
Organization schema (`sameAs`) and deployed, so all profiles cross-confirm.

Brand assets to upload are already in `social-kits/brand/`:
logo/avatar → `avatar-blue-400.png` (or `avatar-white-400.png` on dark),
LinkedIn banner → `banner-linkedin-1128x191.png`.

---

## 1. LinkedIn Company Page (linkedin.com/company/setup/new)

**Name:** Onam Security
**Website:** https://www.onamsecurity.com
**Industry:** Computer and Network Security
**Company size:** 2–10 employees
**Type:** Privately held
**Tagline (120 chars max):**
Unified CSPM & cloud security platform — one graph, one prioritized list, across AWS, Azure, GCP and more.

**About:**
Onam Security is a unified cloud security platform (CSPM/CNAPP) built by
security engineers. One deployment gives you posture management, attack-path
analysis, identity (CIEM), data security, container security, and cloud
detection & response — on a single security graph instead of six stitched
products.

- 10,000+ security rules with real depth per cloud service
- 200+ cloud services covered across AWS, Azure, GCP and more
- 13 compliance frameworks mapped to one control set
- Attack-path analysis that cuts thousands of findings to the handful that matter

We built Onam because cloud security tooling was fragmented, noisy, and hard
to act on. Security teams were paying for six products, wiring five
dashboards, and still missing the finding that mattered.

**Specialties:** Cloud Security, CSPM, CNAPP, Attack Path Analysis, CIEM,
Compliance Automation, Cloud Detection and Response, Kubernetes Security,
Multi-Cloud Security

---

## 2. Crunchbase (crunchbase.com — Add a Company)

**Name:** Onam Security
**Website:** https://www.onamsecurity.com
**Industries:** Cloud Security, Cyber Security, SaaS, Network Security
**Short description (~140 chars):**
Onam Security is a unified CSPM/CNAPP platform: posture, attack paths, identity, data, and detection on one cloud security graph.

**Full description:**
Onam Security is a unified cloud security platform that replaces the
fragmented multi-tool approach to cloud security. The platform combines
cloud security posture management (CSPM), attack-path analysis, cloud
infrastructure entitlement management (CIEM), data security posture,
container/Kubernetes security, and cloud detection & response in a single
security graph. Onam ships 10,000+ security rules across 200+ cloud
services on AWS, Azure, GCP and other clouds, maps findings to 13
compliance frameworks, and prioritizes the attack paths that actually
matter instead of flooding teams with thousands of disconnected findings.

**Founders:** Anup Yadav (CEO), Ajay Chaudhary (COO)
<!-- add founding date + HQ location before submitting -->

---

## 3. GitHub Organization (github.com/organizations/plan)

**Org name suggestion:** `onam-security` (or `onamsecurity` to match the domain)
**Display name:** Onam Security
**Website:** https://www.onamsecurity.com
**Bio (160 chars max):**
Unified CSPM & cloud security platform — one security graph across AWS, Azure, GCP. 10,000+ rules, attack-path analysis, 13 compliance frameworks.

**Profile README idea (later):** publish the rule-count/coverage stats table
and link to docs — gives the org page real content so it ranks for the brand.

---

## After creating — tell Claude the URLs

The site's Organization JSON-LD currently lists only `https://x.com/onamsecurity`
in `sameAs` (src/routes/__root.tsx:37). Adding the LinkedIn + Crunchbase +
GitHub URLs there is a 2-line change + deploy (next image: v23).
