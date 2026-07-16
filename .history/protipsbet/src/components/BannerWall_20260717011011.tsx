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
    {/* Додадено е flex-col items-center за целата секција да биде центрирана */}
    <section className="py-8 px-4 w-full flex flex-col items-center">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3 text-center">
        {title}
      </p>
      
      {/* Менуваме од Grid во Flex со wrap и justify-center */}
      <div className="flex flex-wrap justify-center items-center gap-4 max-w-6xl w-full">
        {banners.map((b) => (
          {/* Овој div ги контролира големините (наместо колоните од гридот) */}
          <div key={b.id} className="w-[45%] md:w-[22%] lg:w-[15%] min-w-[120px] max-w-[200px]">
            <BannerAdSlot
              id={b.id}
              href={b.href}
              videoSrc={b.videoSrc}
              imgSrc={b.imgSrc}
              alt={b.alt}
              width={b.width}
              height={b.height}
            />
          </div>
        ))}
      </div>
    </section>
  );
}