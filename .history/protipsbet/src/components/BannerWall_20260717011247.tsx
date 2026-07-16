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

export default function BannerWall({ title = "Sponsored", banners, size = "medium" }: BannerWallProps) {
  if (!banners.length) return null;

  return (
    <section className="py-8">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3 text-center">
        {title}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {banners.map((b) => (
          <div key={b.id} className="w-[45%] max-w-[200px] md:w-[22%] lg:w-[15%]">
            <BannerAdSlot
              id={b.id}
              href={b.href}
              videoSrc={b.videoSrc}
              imgSrc={b.imgSrc}
              alt={b.alt}
              width={b.width}
              height={b.height}
              size={size}
            />
          </div>
        ))}
      </div>
    </section>
  );
}