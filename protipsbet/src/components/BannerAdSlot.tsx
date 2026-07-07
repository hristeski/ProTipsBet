interface BannerAdSlotProps {
  id: string;
  href?: string;
  imgSrc?: string;
  alt?: string;
  size?: "small" | "medium" | "large";
}

const SIZE_MAP = {
  small: "aspect-[3/1]",
  medium: "aspect-[4/1]",
  large: "aspect-[2/1]",
};

/**
 * A single ad placeholder slot. Once you have a real banner (image,
 * affiliate link, or an ad-network embed script), just fill in
 * imgSrc/href or swap the content for their embed code.
 *
 * NOTE: Google AdSense and most mainstream ad networks heavily
 * restrict/prohibit gambling-related content without special
 * certification. For sports-tips/affiliate banners (bookmakers,
 * crypto exchanges) direct affiliate programs usually work better
 * than standard ad networks.
 */
export default function BannerAdSlot({ id, href, imgSrc, alt, size = "medium" }: BannerAdSlotProps) {
  const content = (
    <div
      data-ad-slot={id}
      className={`relative w-full ${SIZE_MAP[size]} rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/60 flex items-center justify-center group`}
    >
      {imgSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imgSrc} alt={alt ?? "Advertisement"} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 group-hover:text-zinc-500 transition-colors">
          Ad Slot #{id}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="sponsored noopener noreferrer nofollow" aria-label={alt ?? `Advertisement ${id}`}>
        {content}
      </a>
    );
  }
  return content;
}