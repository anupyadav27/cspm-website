# Onam Security — Online Presence Roadmap

Goal: be a recognized name in CSPM / cloud security — findable, credible, and cited by
search engines, AI engines, analysts, and buyers.

Layer model: everything below feeds the layer above.

```
        Analyst recognition (Gartner/Forrester/GigaOm)
        ▲  requires: customers + reviews + visibility
        Reviews & marketplaces (G2, PeerSpot, AWS/Azure/GCP)
        ▲  requires: real users + entity presence
        Earned media (blogs, listicles, podcasts, newsletters, PH)
        ▲  requires: content + assets + outreach
        Owned media (site ✅, blog ✅, social, YouTube, images/video)
```

---

## NOW (0–3 months) — owned assets + first earned mentions

### Social images & video (owned)
- [ ] **YouTube channel "Onam Security"** — the 12 console demo clips (`public/video/`,
      `public/screenshots/`) are ready-made content: 1 platform overview + short per-engine
      demos ("Attack path analysis in 90 seconds"). YouTube is the #2 search engine, and AI
      engines cite video transcripts. Write proper titles/descriptions with CSPM keywords.
- [ ] **Social card generator** — script to render branded stat/quote cards (PNG) for each
      blog post, so every LinkedIn/X post ships with a visual. (Claude can build this into
      /publish-post.)
- [ ] Re-post every video natively on LinkedIn (native video outperforms links ~5×).

### Earned mentions (free, fast)
- [ ] Pitch **CloudSecList + tl;dr sec** newsletters (free feature for interesting tools).
- [ ] **Qwoted / Featured / Help a B2B Writer** — 30 min/week answering journalist requests
      → quotes + backlinks in real publications.
- [ ] **Product Hunt launch** framed around the free agentless scan.
- [ ] **Listicle outreach**: find every "Top CSPM tools 2026" article ranking on page 1–2,
      email the author a short pitch to be added. 10 emails → typically 1–3 inclusions;
      these articles are what AI engines quote for "best CSPM tools".
- [ ] Dev.to / Medium cross-posts of every blog post (canonical set — already in social kits).

### Review-platform entities (free, feeds AI answers directly)
- [ ] G2 vendor profile (needs domain email) + first 2–3 customer reviews → unlocks CSPM grid.
- [ ] **PeerSpot** + **Gartner Peer Insights** vendor listings — free; enterprise buyers and
      AI engines read both. Reviews here are literally the "quadrant ladder" first rung.
- [ ] Capterra / GetApp / Software Advice (one Gartner Digital Markets submission covers all 3).

---

## NEXT (3–9 months) — marketplaces + analyst relationships begin

### CSP marketplaces (credibility + where cloud budgets get spent)
- [ ] **AWS Marketplace** first: join AWS Partner Network (free tier) → SaaS product listing
      → later: Foundational Technical Review → "AWS qualified software" badge. Weeks of
      paperwork, big payoff: buyers burn committed AWS spend on marketplace purchases.
- [ ] Azure Marketplace (via Microsoft Partner Center) second, GCP Marketplace third.
- [ ] Integration marketplaces: Slack App Directory, Atlassian Marketplace (Jira),
      PagerDuty — each listing = presence + high-authority backlink.

### Analyst ladder — the realistic path (NOT "apply to the MQ")
- [ ] **Book free vendor briefings**: Gartner and Forrester both accept vendor briefing
      requests at no cost — 30 min to put Onam on the CNAPP analysts' radar. Do this
      once there's a crisp deck. Being *known* to the analyst is the prerequisite for
      everything else.
- [ ] Target **startup-accessible research**: GigaOm Radar (includes challengers),
      KuppingerCole Leadership Compass, Frost & Sullivan — these publish smaller vendors
      and are themselves cited by buyers and AI.
- [ ] Aim for **Gartner "Cool Vendor" / Hype Cycle mention** — driven by briefings +
      differentiated story (7-cloud graph, FAIR dollar-risk), not size.
- [ ] Accumulate Peer Insights + G2 + PeerSpot reviews continuously — "Voice of the
      Customer" docs are compiled from these and are the volume-independent way to appear
      in Gartner-branded output.

### Big-4 / consultancy channel
- [ ] Deloitte/PwC/EY/KPMG cloud-security practices resell and recommend tooling — entry
      is via their alliance/partner programs, usually after a joint customer. Nearer-term
      equivalent: regional MSSPs and cloud consultancies (partner page + co-marketing).

---

## LATER (9–24 months) — compounding authority

- [ ] Annual **"State of Multi-Cloud Security" research report** from anonymized scan data
      → press coverage cycle every year.
- [ ] **Open-source tool** (free CLI misconfig checker) → GitHub stars, HN front page,
      newsletter features, permanent community credibility.
- [ ] Conference talks: BSides, fwd:cloudsec, OWASP chapters, AWS Community Days;
      (India: Nullcon, c0c0n, Seasides).
- [ ] Own webinar series + newsletter from blog content.
- [ ] Magic Quadrant / Forrester Wave inclusion — becomes realistic only with enterprise
      revenue + references; everything above is what makes it possible.

---

## Reality checks

- **Gartner MQ**: inclusion criteria are revenue/customer-count based. The ladder is:
  Peer Insights reviews → briefings → Cool Vendor/Hype Cycle → niche/visionary quadrant
  placement. Years, not months — start the free rungs now.
- **Marketplaces**: AWS listing alone is weeks of forms + a technical review. Worth it;
  don't do all three clouds at once.
- **Videos/images**: quality bar for enterprise buyers is real product footage + clean
  branding — which the demo clips already are. No need for expensive production.

## Division of labor

| Claude can produce | Only you can do |
|---|---|
| Social card generator, video titles/descriptions/scripts, pitch emails (newsletters, listicles, podcasts), PH listing copy, analyst briefing deck outline, partner one-pagers, research report | Create accounts/channels, send emails from your address, record voiceovers, sign partner/marketplace agreements, book briefings, ask customers for reviews |
