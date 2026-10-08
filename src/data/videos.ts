/**
 * Short Q&A videos on the Onam Security YouTube channel, embedded on the site.
 *
 * Source of IDs: onam-studio/productions-index/2026-10-06-product-series/VIDEO-REGISTER.yaml
 * (Onam cuts only — partner cuts are not shown on the site). Change list:
 * marketing/onam-assets/seo/VIDEO-EMBEDS.md. If a video is re-uploaded with a new ID,
 * update it here and in the register together.
 */

export type Playlist = { name: string; id: string };

export const PLAYLISTS = {
  startHere: { name: "Onam Security: start here", id: "PLO_NYlUliH7Q" },
  cloudSecurity: { name: "Onam Security: cloud security", id: "PLHEDm7EIQZJs" },
  estate: { name: "Onam Estate", id: "PLMRwhR09P0I8" },
  finops: { name: "Onam FinOps", id: "PLXZIBgggDSIM" },
  drm: { name: "Onam DRM", id: "PLF5rP9ZPyges" },
  operations: { name: "Onam Operations (early access)", id: "PLfpJo_8MhfCA" },
} satisfies Record<string, Playlist>;

export const playlistUrl = (p: Playlist) => `https://www.youtube.com/playlist?list=${p.id}`;

export type Video = {
  id: string;
  title: string;
  description: string;
  /** ISO 8601, as YouTube reports it. */
  uploadDate: string;
  playlist: Playlist;
};

export const VIDEOS = {
  pitch: {
    id: "nB7rbux1Or4",
    title: "What is cloud security? One platform for multi-cloud security | Onam Security (presenter edition)",
    description:
      "A two-minute overview of Onam: one platform for cloud assets, security, cost and recovery across multiple clouds.",
    uploadDate: "2026-10-07T17:47:10-07:00",
    playlist: PLAYLISTS.startHere,
  },
  overview: {
    id: "uaI1p4GW--c",
    title: "What is cloud security? One platform for multi-cloud security posture | Onam Security",
    description:
      "A short Q&A on cloud security posture across multiple clouds, and how Onam Security brings the findings onto one platform.",
    uploadDate: "2026-10-06T09:13:08-07:00",
    playlist: PLAYLISTS.startHere,
  },
  cspm: {
    id: "-vXpQOJ5aCM",
    title: "What is CSPM? Cloud security posture management across AWS, Azure and more | Onam CSPM",
    description:
      "A short Q&A on cloud security posture management (CSPM): finding misconfigurations across AWS, Azure and other clouds with Onam CSPM.",
    uploadDate: "2026-10-06T19:01:47-07:00",
    playlist: PLAYLISTS.cloudSecurity,
  },
  ciem: {
    id: "6OQvY60pzEk",
    title: "What is CIEM? Effective permissions and least privilege in AWS IAM | Onam CIEM",
    description:
      "A short Q&A on cloud infrastructure entitlement management (CIEM): effective permissions and least privilege in AWS IAM with Onam CIEM.",
    uploadDate: "2026-10-06T19:01:25-07:00",
    playlist: PLAYLISTS.cloudSecurity,
  },
  cnapp: {
    id: "CfxgImbSpBI",
    title: "What is CNAPP? One view of your whole cloud risk | Onam CNAPP",
    description:
      "A short Q&A on cloud-native application protection (CNAPP): one view of cloud risk with Onam CNAPP.",
    uploadDate: "2026-10-06T09:13:04-07:00",
    playlist: PLAYLISTS.cloudSecurity,
  },
  dspm: {
    id: "0UTLz-kBhxY",
    title: "What is DSPM? Data security posture management: classification and lineage | Onam DSPM",
    description:
      "A short Q&A on data security posture management (DSPM): data classification and lineage with Onam DSPM.",
    uploadDate: "2026-10-06T09:13:14-07:00",
    playlist: PLAYLISTS.cloudSecurity,
  },
  attackPath: {
    id: "VAQFWAZq8fs",
    title: "Attack path analysis: choke points and MITRE ATT&CK in your cloud | Onam Attack Path",
    description:
      "A short Q&A on cloud attack path analysis: choke points and MITRE ATT&CK mapping with Onam Attack Path.",
    uploadDate: "2026-10-06T09:13:22-07:00",
    playlist: PLAYLISTS.cloudSecurity,
  },
  compliance: {
    id: "CgclgO1klMg",
    title: "Cloud compliance automation: audit evidence without screenshot hunts | Onam Compliance",
    description:
      "A short Q&A on cloud compliance automation: collecting audit evidence without screenshot hunts with Onam Compliance.",
    uploadDate: "2026-10-06T09:13:19-07:00",
    playlist: PLAYLISTS.cloudSecurity,
  },
  codeSecurity: {
    id: "YW1faBYuOqU",
    title: "DevSecOps: find hardcoded secrets with SAST, fix them with AI Code Fix | Onam Code Security",
    description:
      "A short Q&A on DevSecOps: finding hardcoded secrets with static analysis (SAST) and fixing them on a reviewable branch with AI Code Fix.",
    uploadDate: "2026-10-06T19:01:51-07:00",
    playlist: PLAYLISTS.cloudSecurity,
  },
  whichAlert: {
    id: "XWHyQACKa5I",
    title: "Cloud security: which alert do you fix first when four tools disagree? | Onam Security",
    description:
      "A short Q&A on prioritising cloud security alerts when separate tools disagree, and how Onam Security ranks them on one graph.",
    uploadDate: "2026-10-06T19:01:54-07:00",
    playlist: PLAYLISTS.cloudSecurity,
  },
  estate: {
    id: "oDrP_UsvQbk",
    title: "Cloud asset inventory: know everything you run, and who owns it | Onam Estate",
    description:
      "A short Q&A on cloud asset inventory: knowing everything you run, and who owns it, with Onam Estate.",
    uploadDate: "2026-10-06T09:12:36-07:00",
    playlist: PLAYLISTS.estate,
  },
  finops: {
    id: "NHKwU1YNfoI",
    title: "Cloud cost optimization and FinOps: who owns the bill, and what's next? | Onam FinOps",
    description:
      "A short Q&A on cloud cost optimization and FinOps: who owns the bill and what to do next, with Onam FinOps.",
    uploadDate: "2026-10-06T09:12:42-07:00",
    playlist: PLAYLISTS.finops,
  },
  drm: {
    id: "ZSyiHyGYrfE",
    title: "Disaster recovery plan: RTO and RPO against your real targets | Onam DRM",
    description:
      "A short Q&A on disaster recovery planning: checking predicted RTO and RPO against your real targets with Onam DRM.",
    uploadDate: "2026-10-06T09:12:50-07:00",
    playlist: PLAYLISTS.drm,
  },
  operations: {
    id: "fhy9dXkByJg",
    title: "AIOps and AI agents with a human in the loop | Onam AIOps",
    description:
      "A short Q&A on AIOps: AI agents that investigate with evidence and propose changes for a person to approve. Onam AIOps is in early access.",
    uploadDate: "2026-10-06T09:12:58-07:00",
    playlist: PLAYLISTS.operations,
  },
} satisfies Record<string, Video>;

export type VideoKey = keyof typeof VIDEOS;
