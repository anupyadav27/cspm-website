import { useState, type ReactNode } from "react";
import { Play } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/site/system";
import { SITE_URL } from "@/lib/seo";
import { playlistUrl, VIDEOS, type Video, type VideoKey } from "@/data/videos";

const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const embed = (id: string) => `https://www.youtube-nocookie.com/embed/${id}`;

/** schema.org VideoObject for one embedded video. */
export function videoJsonLd(v: Video) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: v.title,
    description: v.description,
    thumbnailUrl: thumb(v.id),
    uploadDate: v.uploadDate,
    embedUrl: embed(v.id),
    contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
    publisher: { "@type": "Organization", name: "Onam", url: SITE_URL },
  };
}

/**
 * Click-to-play YouTube facade. Before the click the page loads only a static
 * thumbnail (i.ytimg.com, lazy) — no YouTube script, no iframe, no cookies. The
 * click swaps in the privacy-enhanced youtube-nocookie.com player.
 */
export function VideoFacade({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-line bg-[#0B1220] shadow-[0_1px_2px_rgba(16,24,40,.04),0_8px_24px_rgba(16,24,40,.08)]">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`${embed(video.id)}?autoplay=1&rel=0`}
          title={video.title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 h-full w-full focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/50"
          aria-label={`Play video: ${video.title}`}
        >
          <img
            src={thumb(video.id)}
            alt=""
            loading="lazy"
            decoding="async"
            width={480}
            height={360}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute inset-0 bg-black/20 transition group-hover:bg-black/10" />
          <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 shadow-lg transition group-hover:scale-105">
            <Play className="ml-1 h-7 w-7 fill-[#0B1220] text-[#0B1220]" aria-hidden />
          </span>
        </button>
      )}
    </div>
  );
}

/** Caption under every embed: AI-voice disclosure + link to the matching playlist. */
export function VideoCaption({ video }: { video: Video }) {
  return (
    <p className="mt-3 text-sm text-body">
      Voices are AI-generated. More short Q&amp;A videos:{" "}
      <a
        href={playlistUrl(video.playlist)}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-brand-500 hover:text-brand-600 underline underline-offset-2"
      >
        {video.playlist.name}
      </a>
    </p>
  );
}

/** A page band with heading, the click-to-play video, caption and VideoObject JSON-LD. */
export function VideoSection({
  video: key,
  eyebrow = "Watch",
  title,
  lead,
  children,
}: {
  video: VideoKey;
  eyebrow?: ReactNode;
  title?: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  const video: Video = VIDEOS[key];
  return (
    <Section id="video">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd(video)) }}
      />
      <Container className="max-w-4xl">
        <SectionHeading
          align="center"
          eyebrow={eyebrow}
          title={title ?? "The short Q&A"}
          lead={lead}
        />
        <div className="mt-10">
          <VideoFacade video={video} />
          <VideoCaption video={video} />
          {children}
        </div>
      </Container>
    </Section>
  );
}
