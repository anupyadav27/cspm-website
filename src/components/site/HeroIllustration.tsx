export type HeroImage = { src: string; alt: string; caption: string; width?: number; height?: number };

/** Product-page header illustration. Reviewed against IMAGE-REVIEW-CHECKLIST before use. */
export function HeroIllustration({ image }: { image: HeroImage }) {
  return (
    <figure className="mx-auto mt-14 max-w-5xl">
      <img
        src={image.src}
        alt={image.alt}
        width={image.width ?? 1672}
        height={image.height ?? 941}
        loading="eager"
        decoding="async"
        className="h-auto w-full rounded-2xl border border-[#E5E9F0] shadow-[0_12px_28px_rgba(16,24,40,.08)]"
      />
      <figcaption className="mt-3 text-center text-xs text-[#64748B]">{image.caption}</figcaption>
    </figure>
  );
}
