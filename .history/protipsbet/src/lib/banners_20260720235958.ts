// FILE DESTINATION: src/lib/banners.ts

export interface BannerData {
  id: string;
  href?: string;
  videoSrc?: string;   // /banners/naslov.mp4
  imgSrc?: string;      // /banners/naslov.webp (fallback)
  alt?: string;
  width: number;
  height: number;
}

// Populated with the banner files available in public/banners/
export const FOOTER_BANNER: BannerData = {
  id: "22",
  href: "https://protipsbet.com/vip-tips",
  videoSrc: "/banners/protipsbet.mp4",
  imgSrc: "/banners/protipsbet.webp",
  alt: "ProTipsBet VIP Tips",
  width: 120,
  height: 40,
};

export const ALL_BANNERS: BannerData[] = [FOOTER_BANNER];

// Keep the other page sections empty so this banner only appears in the footer.
export const HOME_BANNERS: BannerData[] = [];
export const FREE_TIPS_BANNERS: BannerData[] = [];
export const VIP_BANNERS: BannerData[] = [];
export const HISTORY_BANNERS: BannerData[] = [];
export const FOOTER_BANNERS: BannerData[] = [FOOTER_BANNER];