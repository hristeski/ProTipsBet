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
}

export default function BannerWall({ title = "Sponsored", banners }: BannerWallProps) {
  if (!banners.length) return null;

  return (
    <section className="py-8">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3 text-center">
        {title}
      </p>
      {/* 2 колони на мобилен, 4 на таблет, 6 на голем екран (прави банерите да се помали) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
          />
        ))}
      </div>
    </section>
  );
}