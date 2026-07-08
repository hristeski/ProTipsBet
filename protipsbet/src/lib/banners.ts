// FILE DESTINATION: src/lib/banners.ts

import type { BannerData } from "@/components/BannerWall";

// 50 slots total. Fill in href/imgSrc once you have real advertisers.
// The id is stable (banner-01 ... banner-50) for easier click tracking.
export const ALL_BANNERS: BannerData[] = Array.from({ length: 50 }, (_, i) => ({
  id: String(i + 1).padStart(2, "0"),
}));

// Distributed across pages - a few everywhere, not all in one place
export const HOME_BANNERS = ALL_BANNERS.slice(0, 8);
export const FREE_TIPS_BANNERS = ALL_BANNERS.slice(8, 16);
export const VIP_BANNERS = ALL_BANNERS.slice(16, 22);
export const HISTORY_BANNERS = ALL_BANNERS.slice(22, 30);
export const FOOTER_BANNERS = ALL_BANNERS.slice(30, 50);