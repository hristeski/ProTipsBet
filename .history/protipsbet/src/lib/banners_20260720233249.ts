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

// Пополнети со реалните fajlovi од public/banners/
// Сите банери се поставени на иста големина 120x40 и имаат рачно зададени линкови.
export const ALL_BANNERS: BannerData[] = [

  { id: "22", href: "https://protipsbet.com/vip-tips", videoSrc: "/banners/protipsbet.mp4", imgSrc: "/banners/protipsbet.webp", alt: "ProTipsBet VIP Tips", width: 120, height: 40 },

];

// Distributed across pages - a few everywhere, not all in one place
export const HOME_BANNERS = ALL_BANNERS.slice(0, 5);
export const FREE_TIPS_BANNERS = ALL_BANNERS.slice(5, 10);
export const VIP_BANNERS = ALL_BANNERS.slice(10, 15);
export const HISTORY_BANNERS = ALL_BANNERS.slice(15, 21);
export const FOOTER_BANNERS = ALL_BANNERS.slice(22);