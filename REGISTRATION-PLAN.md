# Onam Security — Registration & Listings Plan (coworking checklist)

Execution layer for `PRESENCE-ROADMAP.md` (strategy) and `SEO-RUNBOOK.md` (on-site SEO).
This file is the **do-it-in-order** list. One task per working session.

**24 tasks across 6 phases:**

| Phase | What | Tasks |
|---|---|---|
| 0 | Foundation — the asset pack everything reuses | T-01 → T-02 |
| 1 | Search & entity presence | T-03 → T-06 |
| 2 | Money & runway (credits, DPIIT) | T-07 → T-08 |
| 3 | Buyer-intent review platforms | T-09 → T-11 |
| 4 | Distribution channels | T-12 → T-15 |
| 5 | Earned attention | T-16 → T-18 |
| 6 | Investor visibility & fundraising *(parallel with 3–4)* | T-19 → T-24 |

Phases 0–2 are strictly sequential. After that, Phase 3/4 and Phase 6 can interleave.

**How we work each task:**
1. I prep everything that can be prepped (copy, assets, verification files, emails).
2. You do the part that needs your login/identity/signature.
3. You paste back the resulting URL/status → I record it here and wire it into the site.

**Status legend:** ⬜ not started · 🟡 in progress · ✅ done · ⛔ blocked

---

## Phase 0 — Foundation (must come first; everything else reuses it)

### ⬜ T-01 · Build the Listing Kit
**Time:** you 0 min · me ~45 min
**Why first:** every platform below asks for the same 12 fields. Write once, paste 30×.
**I produce** `listing-kit/ONAM-LISTING-KIT.md` containing:
- Company legal name, founded, HQ, employee band, website, contact email
- Taglines: 8-word / 50-char / 100-char
- Descriptions: 25-word, 50-word, 100-word, 250-word, 500-word
- Category tags per platform taxonomy (CSPM, CNAPP, CIEM, Cloud Security)
- Feature bullet list (10) + differentiators (5), grounded in the verified fact sheet
- Founder bios (Anup, Ajay) — short + long
- Screenshot manifest: which 6 of `screenshots/` to use, in what order, with captions
- Logo asset paths + required export sizes (square 512, 1024, wide, favicon)
- Pricing summary, target-customer / ICP statement, competitor-alternative list
- Social handles + support/security contact
**You do:** confirm legal name, incorporation date, HQ city, employee count, contact email.
**Done when:** kit file exists and you've approved the 100-word description.

### ⬜ T-02 · Logo & screenshot export pack
**Time:** you 5 min · me ~20 min
**I produce:** `listing-kit/assets/` — PNG exports at every size the platforms demand
(512², 1024², 1200×630 OG, 1280×800 screenshots), from `public/logo.svg` + `screenshots/`.
**You do:** eyeball the exports, flag anything off-brand.
**Done when:** assets folder is ready to drag-and-drop.

---

## Phase 1 — Search & entity presence (unblocks the known SEO problem)

### ⬜ T-03 · Google Search Console verification + indexing
**Time:** you ~20 min · me ~10 min
**Blocking issue:** per the SEO audit, the site has never been verified in GSC. This is the
single biggest cause of zero visibility. Nothing else in SEO matters until it's done.
**I produce:** the DNS TXT / HTML-file verification artifact, deployed; plus the exact
URL list to submit for indexing.
**You do:** add the DNS record at BigRock (or upload the file), click Verify, submit sitemap,
request indexing on the cornerstone URLs.
**Done when:** property verified + sitemap shows "Success".

### ⬜ T-04 · Bing Webmaster Tools
**Time:** you ~15 min
**Why:** Bing's index is what ChatGPT and Copilot answer from. Direct AEO lever.
**You do:** bing.com/webmasters → "Import from Google Search Console" (one click after T-03).
**Done when:** sitemap listed under Sitemaps in Bing.

### ⬜ T-05 · Core entity profiles — LinkedIn, X, Crunchbase
**Time:** you ~60 min · me ~20 min
**Why:** these three are how Google and AI engines corroborate "Onam Security is a real company".
**I produce:** paste-ready field-by-field content for each of the three, from the Listing Kit.
**You do:** create LinkedIn Company Page, secure the X handle, submit Crunchbase profile.
**Done when:** three live URLs sent back to me.

### ⬜ T-06 · Wire profile URLs into the site's schema
**Time:** me ~20 min
**I do:** add all profile URLs to the Organization JSON-LD `sameAs` array, rebuild, deploy,
ping IndexNow. This is what closes the entity loop for AI engines.
**Done when:** deployed and `sameAs` verified live.

---

## Phase 2 — Money & runway (fast wins, real cash)

### ⬜ T-07 · Cloud credits: AWS Activate + Microsoft for Startups + Google for Startups
**Time:** you ~45 min total · me ~20 min
**Why:** a multi-cloud scanner burns cloud spend. This is $25k–$150k of runway for one form each.
**I produce:** the application narrative (what we build, traction, why we need credits) tailored
to each program's rubric.
**You do:** submit three applications (Crunchbase profile from T-05 helps approval odds).
**Done when:** at least one approval email.

### ⬜ T-08 · Startup India / DPIIT recognition
**Time:** you ~40 min · me ~15 min
**Why:** free; unlocks 3-year income-tax exemption, govt tender eligibility, public directory
listing, and is a prerequisite for most Indian accelerator/grant programs.
**I produce:** the "innovation & scalability" write-up the application requires.
**You do:** startupindia.gov.in → register → upload incorporation certificate + write-up.
**Done when:** DPIIT recognition number issued.

---

## Phase 3 — Buyer-intent review platforms (biggest pipeline lever)

### ⬜ T-09 · G2 vendor profile
**Time:** you ~30 min · me ~20 min
**Why:** CSPM buyers shortlist from G2 before they talk to anyone. Also a strong dofollow link.
**I produce:** full profile copy, category selection, feature checklist, comparison positioning.
**You do:** sell.g2.com → claim profile with a @onamsecurity.com email → paste content.
**Done when:** profile live in the CSPM category.

### ⬜ T-10 · Gartner Peer Insights + PeerSpot + Gartner Digital Markets
**Time:** you ~45 min · me ~15 min
**Note:** one Gartner Digital Markets submission covers Capterra + GetApp + Software Advice.
**Done when:** three vendor listings live.

### ⬜ T-11 · Customer review campaign
**Time:** you ~30 min · me ~20 min
**Why:** listings without reviews don't rank. 5 reviews on G2 unlocks the category grid — the
page AI engines quote for "best CSPM tools".
**I produce:** the ask-email (3 variants), a target list template, and a follow-up sequence.
**You do:** send to your happiest users; personally, not via a tool.
**Done when:** 5 G2 reviews + 3 Peer Insights reviews live.

---

## Phase 4 — Distribution channels

### ⬜ T-12 · AWS Partner Network + AWS Marketplace listing
**Time:** you ~3–4 h spread over weeks · me ~1 h
**Why:** buyers pay from committed AWS spend. Highest-value channel on this list, slowest to open.
**I produce:** listing copy, pricing dimensions, EULA-vs-SCMP decision note, FTR prep checklist.
**You do:** APN registration → Marketplace seller registration → tax/bank → product submission.
**Done when:** listing published. (Azure and GCP come after — do not run all three at once.)

### ⬜ T-13 · Cross-post pipeline: Dev.to + Medium + Hashnode
**Time:** you ~20 min setup · me ~30 min
**I do:** extend `/publish-post` so every new post emits canonical-tagged cross-post versions.
**You do:** create the three accounts, connect them.
**Done when:** one existing post is live on all three with `rel=canonical` back to us.

### ⬜ T-14 · Community memberships
**Time:** you ~60 min
**Where:** Cloud Security Alliance (corporate), null community (India), CISO Platform, OWASP
local chapter, Cloud Security Forum Slack, CNCF Slack, Peerlist.
**Rule:** join and contribute; no product pitching for the first month. Reddit (r/cybersecurity,
r/netsec, r/aws, r/devops) is read-only for you until you have karma.
**Done when:** accounts created, CSA membership decision made.

### ⬜ T-15 · Startup directory batch (backlink fix)
**Time:** you ~90 min in one sitting · me ~30 min
**Where:** SaaSHub, AlternativeTo, StackShare, BetaList, F6S, Wellfound, Tracxn, Indie Hackers,
Launching Next, StartupRanking, Uneed, SourceForge.
**I produce:** a single submission sheet — every field pre-filled per site, in submission order.
**You do:** one pass, copy-paste. Boring but it fixes "zero backlinks".
**Done when:** 12 submissions in, live URLs logged below.

---

## Phase 5 — Earned attention (after Phases 0–2 exist)

### ⬜ T-16 · Product Hunt launch
**Time:** you ~2 h on launch day · me ~1 h
**Prereq:** T-01, T-02, polished demo. Register the maker account **now** (PH weights account age).
**I produce:** tagline, description, first comment, 6 gallery assets, hunter-outreach note,
launch-day social kit.

### ⬜ T-17 · Newsletter + listicle outreach
**Time:** you ~45 min · me ~45 min
**Targets:** CloudSecList, tl;dr sec, plus every "Top CSPM tools 2026" article on page 1–2.
**I produce:** the ranked target list and a personalised pitch per target.

### ⬜ T-18 · Conference CFP submissions
**Time:** you ~30 min per submission · me ~1 h
**Targets:** Nullcon, c0c0n, SACON, Seasides, BSides (any city), DEF CON Cloud Village,
fwd:cloudsec, Black Hat Arsenal, RSAC Early Stage Expo.
**I produce:** 3 talk abstracts + speaker bio, reusable across all CFPs.

---

## Phase 6 — Investor visibility & fundraising

Runs **in parallel with Phases 3–4** — it reuses the Listing Kit (T-01) and the Crunchbase
profile (T-05). Order inside the phase matters: never approach investors before T-19 exists.

### ⬜ T-19 · Investor kit (prerequisite for everything below)
**Time:** you ~60 min of input · me ~2 h
**I produce** (via the `/make-deck` studio pipeline):
- 12–14 slide seed deck: problem, why now, product, differentiation (7-cloud graph, FAIR
  dollar-risk, 10k+ rules), traction, GTM, competition, team, ask & use of funds
- 1-page teaser (the thing you actually send cold)
- Metrics one-pager: ARR/pipeline, logos, scan volume, retention — whatever is real today
- 60-second and 3-minute verbal pitch scripts
- Data-room folder structure + checklist
**You do:** supply the real numbers (revenue, customers, burn, raise size, valuation ask).
**Done when:** deck approved and a shareable DocSend/Drive link exists.
**Rule:** a "no" from a fund is a 12-month cooldown. Kit first, outreach second.

### ⬜ T-20 · Investor-facing data profiles
**Time:** you ~90 min · me ~30 min
**Why:** this is where VCs source deals and where they check you *after* an intro.
- **Crunchbase** — done in T-05; now upgrade it (funding round, team, categories, press)
- **Tracxn** — Indian VCs source from here more than anywhere else; claim the profile
- **PitchBook** — claim the free company profile (they will have a stub already)
- **CB Insights** — claim profile; they publish cyber market maps that VCs read
- **Dealroom** — European/global LP + VC visibility
- **Signal by NFX** — free founder profile, doubles as a warm-intro path finder
- **OpenVC** — free; submit the startup and get a filtered investor list back
- **Wellfound (AngelList)** — company + jobs profile; doubles as hiring
- **F6S** — accelerator/grant application hub
**You do:** claim/submit each; log URLs.
**Done when:** 8 profiles live and consistent (same numbers everywhere — VCs cross-check).

### ⬜ T-21 · Angel networks & syndicates (India-first)
**Time:** you ~2 h · me ~45 min
**I produce:** application answers tailored per network + a tracking sheet.
- **LetsVenture** — largest Indian angel platform, structured application
- **Indian Angel Network (IAN)** — apply via their portal
- **Mumbai Angels**, **Chennai Angels**, **Hyderabad Angels**, **Lead Angels**
- **Inflection Point Ventures (IPV)**, **Venture Catalysts**, **100X.VC** (Class applications
  open in cycles — iSAFE notes, fast decisions)
- **AngelList India syndicates**
**You do:** submit applications; expect 4–8 weeks and lots of silence. Track in the sheet.
**Done when:** applications in, first screening call booked.

### ⬜ T-22 · Accelerators & founder programs
**Time:** you ~30–60 min per application · me ~45 min each
**Global:** Y Combinator, Techstars, Antler India
**India / B2B SaaS specialist:** Accel Atoms, Peak XV Surge, Blume, Together Fund
(B2B-SaaS-only, very close fit), Stellaris, Prime Venture Partners
**I produce:** the written application (YC's form especially rewards specific, terse answers)
and the 1-min founder video script.
**You do:** record the video, submit before deadlines.
**Note:** apply to at most 2–3 per cycle and do them properly; scattershot applications read
as scattershot.

### ⬜ T-23 · Cyber-specialist investors & security innovation showcases
**Time:** you ~90 min · me ~45 min
**Why:** generalist VCs don't understand CSPM differentiation; cyber-specialists do, and the
showcases below are how security startups get discovered *and* get press in the same week.
**Showcases (apply when open):** RSAC Innovation Sandbox, SINET16 Innovator Award, DataTribe
Challenge, Black Hat Startup Spotlight, CyberTech Global startup pavilion.
**Cyber-specialist funds to be visible to:** YL Ventures, Ten Eleven Ventures, Forgepoint
Capital, NightDragon, Team8, ClearSky, Glilot.
**I produce:** the showcase applications + a warm-intro map (who in your network connects to
each fund, sourced from LinkedIn once the company page exists).
**Done when:** at least 2 showcase applications submitted.

### ⬜ T-24 · Indian ecosystem & non-dilutive funding
**Time:** you ~2 h · me ~45 min
**Prereq:** T-08 (DPIIT recognition) — required for the government schemes.
- **Startup India Seed Fund Scheme (SISFS)** — up to ₹50L non-dilutive via approved incubators
- **SaaSBoomi** — the India B2B SaaS community; highest-signal room for SaaS investors
- **iSPIRT** — product-thinking community, strong investor adjacency
- **NASSCOM 10,000 Startups + DeepTech Club**; **NASSCOM Emerge 50** award
- **TiE** (TiE Delhi-NCR / TiE Global) — TiE50, chapter pitch events
- Incubators for SISFS routing: **T-Hub**, **NSRCEL (IIMB)**, **CIIE.CO (IIMA)**
**I produce:** the SISFS application narrative + incubator shortlist by fit and geography.
**Done when:** SISFS application submitted through one incubator.

---

## Deliberately skipped

- Paid "submit to 200 directories" services — Google discounts or penalises these.
- Peerlyst — defunct.
- Any directory charging for a dofollow link.
- Applying directly to a Gartner Magic Quadrant — see the reality check in `PRESENCE-ROADMAP.md`;
  the ladder is Peer Insights → briefings → Cool Vendor, over years.
- **Paid investor-list products and mass cold-emailing 500 VCs** — burns the list permanently;
  warm intros via T-20 (Signal/LinkedIn) convert orders of magnitude better.
- **Equity crowdfunding** — don't open that door before institutional rounds; it complicates
  the cap table for exactly the funds you want later.

---

## Live URL log (filled in as we go)

| Platform | URL | Date | Notes |
|---|---|---|---|
| _(empty)_ | | | |
