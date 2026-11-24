/**
 * Short Q&A videos on the Onam Security YouTube channel, embedded on the site.
 *
 * Source of IDs: onam-studio/productions-index/2026-10-06-product-series/VIDEO-REGISTER.yaml
 * (Onam cuts only — partner cuts are not shown on the site). Change list:
 * marketing/onam-assets/seo/VIDEO-EMBEDS.md. If a video is re-uploaded with a new ID,
 * update it here and in the register together.
 *
 * 17 Nov 2026: the Estate, FinOps, DRM and AIOps videos, the four-product pitch and the
 * overview (uaI1p4GW--c, which names Estate, FinOps and DRM aloud) are no
 * longer embedded (products retired / renamed Onam AI). Their YouTube uploads and playlists
 * still exist and need handling on YouTube itself.
 */

export type Playlist = { name: string; id: string };

export const PLAYLISTS = {
  startHere: { name: "Onam Security: start here", id: "PLO_NYlUliH7Q" },
  cloudSecurity: { name: "Onam Security: cloud security", id: "PLHEDm7EIQZJs" },
} satisfies Record<string, Playlist>;

export const playlistUrl = (p: Playlist) => `https://www.youtube.com/playlist?list=${p.id}`;

export type Video = {
  id: string;
  title: string;
  description: string;
  /** ISO 8601, as YouTube reports it. */
  uploadDate: string;
  playlist: Playlist;
  /** A YouTube Short (9:16): shown in a tall frame instead of 16:9. */
  vertical?: boolean;
  /** Our own cover, served from /public (YouTube's hqdefault crops a Short to 4:3). */
  thumbnail?: string;
};

export const VIDEOS = {
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
  chokePoint: {
    id: "dLHhQLfZV38",
    title: "What Are Choke Points in an Attack Path, and Why Fix Them First?",
    description:
      "A one-minute animated short: four small cloud findings chain into one attack path (request forgery, IMDSv1, iam:PassRole, customer data), and requiring IMDSv2 cuts it at the choke point.",
    uploadDate: "2026-11-24T05:50:44Z",
    playlist: PLAYLISTS.cloudSecurity,
    vertical: true,
    thumbnail: "/videos/choke-point-short.jpg",
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
    id: "sj_DK_xJqrA",
    title: "DevSecOps: find hardcoded secrets with SAST, fix them with AI Code Fix | Onam Code Security",
    description:
      "A short Q&A on DevSecOps: finding hardcoded secrets with static analysis (SAST) and fixing them on a reviewable branch with AI Code Fix.",
    uploadDate: "2026-10-25T12:40:08Z",
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
} satisfies Record<string, Video>;

export type VideoKey = keyof typeof VIDEOS;
