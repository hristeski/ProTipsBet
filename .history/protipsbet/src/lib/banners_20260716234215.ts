// FILE DESTINATION: src/lib/banners.ts

export interface BannerData {
  id: string;
  href?: string;
  videoSrc?: string;   // "/banners/naslov.mp4" - preferiran format, konvertiran od GIF
  imgSrc?: string;      // "/banners/naslov.webp" - fallback / za staticni banneri
  alt?: string;
  width: number;        // realna sirina na fajlot vo px (od ffprobe ili od originalot)
  height: number;       // realna visina
}

// 50 slotovi total. Popolni href/videoSrc/imgSrc otkako ke gi konvertiras
// so scripts/compress-banners.sh. id e stabilen (01...50) za click tracking.
export const ALL_BANNERS: BannerData[] = Array.from({ length: 50 }, (_, i) => ({
  id: String(i + 1).padStart(2, "0"),
  width: 300,   // default - promeni go za sekoj real banner
  height: 100,
}));

// ПРИМЕР - вака ќе изгледа еден пополнет банер откако ќе го конвертираш:
//
// {
//   id: "01",
//   href: "https://tvojot-affiliate-link.com/?ref=xxx",
//   videoSrc: "/banners/accurate-soccer-prediction.mp4",
//   imgSrc: "/banners/accurate-soccer-prediction.webp", // fallback
//   alt: "Accurate Soccer Prediction",
//   width: 728,
//   height: 90,
// }

// Distributed across pages - a few everywhere, not all in one place
export const HOME_BANNERS = ALL_BANNERS.slice(0, 8);
export const FREE_TIPS_BANNERS = ALL_BANNERS.slice(8, 16);
export const VIP_BANNERS = ALL_BANNERS.slice(16, 22);
export const HISTORY_BANNERS = ALL_BANNERS.slice(22, 30);
export const FOOTER_BANNERS = ALL_BANNERS.slice(30, 50);