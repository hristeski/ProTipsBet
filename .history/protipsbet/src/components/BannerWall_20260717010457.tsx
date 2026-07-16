// FILE DESTINATION: src/components/BannerWall.tsx

import BannerAdSlot from "./BannerAdSlot";

export interface BannerData {
  id: string;
  href?: string;
  videoSrc?: string;
  imgSrc?: string;
  alt?: string;
  width: number;
  height: number;
}

interface BannerWallProps {
  title?: string;
  banners: BannerData[];
  size?: "small" | "medium" | "large";
}

/**
 * Renders a block of banner ads in a responsive grid.
 * Tip: don't put all banners in one place (bad for mobile UX
 * and load speed). Better to spread them in groups of 4-8 - e.g.
 * a few under the Home hero, a few in the Free/VIP page sidebars,
 * a few in the footer, and a few between tickets on History.
 * Each page gets its own "banners" array (a slice of the full list).
 */
export default function BannerWall({ title = "Sponsored", banners, size = "medium" }: BannerWallProps) {
  if (!banners.length) return null;

  return (
    <section className="py-8">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3 text-center">
        {title}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {banners.map((b) => (
          <BannerAdSlot
            key={b.id}
            id={b.id}
            href={b.href}
            videoSrc={b.videoSrc}
            imgSrc={b.imgSrc}
            alt={b.alt}
            width={b.width}
            height={b.height}
            size={size}
          />
        ))}
      </div>
    </section>
  );
}