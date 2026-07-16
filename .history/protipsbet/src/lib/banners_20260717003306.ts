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
// href е сеуште празно - додади го твојот affiliate/partner линк за секој
export const ALL_BANNERS: BannerData[] = [
  { id: "01", videoSrc: "/banners/prediction-banner-01.mp4", imgSrc: "/banners/prediction-banner-01.webp", alt: "Matches Odds", width: 200, height: 66 },
  { id: "02", videoSrc: "/banners/prediction-banner-02.mp4", imgSrc: "/banners/prediction-banner-02.webp", alt: "Match Flashscore", width: 270, height: 70 },
  { id: "03", videoSrc: "/banners/prediction-banner-03.mp4", imgSrc: "/banners/prediction-banner-03.webp", alt: "Match Always", width: 250, height: 80 },
  { id: "04", videoSrc: "/banners/prediction-banner-04.mp4", imgSrc: "/banners/prediction-banner-04.webp", alt: "Matches", width: 300, height: 90 },
  { id: "05", videoSrc: "/banners/prediction-banner-05.mp4", imgSrc: "/banners/prediction-banner-05.webp", alt: "Matches Online", width: 300, height: 100 },
  { id: "06", videoSrc: "/banners/prediction-banner-06.mp4", imgSrc: "/banners/prediction-banner-06.webp", alt: "Soccer Net", width: 270, height: 70 },
  { id: "07", videoSrc: "/banners/prediction-banner-07.mp4", imgSrc: "/banners/prediction-banner-07.webp", alt: "Football Sure", width: 270, height: 70 },
  { id: "08", videoSrc: "/banners/prediction-banner-08.mp4", imgSrc: "/banners/prediction-banner-08.webp", alt: "Big Matches", width: 276, height: 92 },
  { id: "09", videoSrc: "/banners/prediction-banner-09.mp4", imgSrc: "/banners/prediction-banner-09.webp", alt: "Tips", width: 270, height: 70 },
  { id: "10", videoSrc: "/banners/prediction-banner-10.mp4", imgSrc: "/banners/prediction-banner-10.webp", alt: "Set Matches", width: 180, height: 60 },
  { id: "11", videoSrc: "/banners/prediction-banner-11.mp4", imgSrc: "/banners/prediction-banner-11.webp", alt: "Get Matches", width: 300, height: 100 },
  { id: "12", videoSrc: "/banners/prediction-banner-12.mp4", imgSrc: "/banners/prediction-banner-12.webp", alt: "Real Matches", width: 300, height: 100 },
  { id: "13", videoSrc: "/banners/prediction-banner-13.mp4", imgSrc: "/banners/prediction-banner-13.webp", alt: "Now Matches", width: 300, height: 100 },
  { id: "14", videoSrc: "/banners/prediction-banner-14.mp4", imgSrc: "/banners/prediction-banner-14.webp", alt: "Free Tips", width: 180, height: 60 },
  { id: "15", videoSrc: "/banners/prediction-banner-15.mp4", imgSrc: "/banners/prediction-banner-15.webp", alt: "Soccer Website", width: 270, height: 70 },
  { id: "16", videoSrc: "/banners/prediction-banner-16.mp4", imgSrc: "/banners/prediction-banner-16.webp", alt: "Soccer Predictions", width: 270, height: 70 },
  { id: "17", videoSrc: "/banners/prediction-banner-17.mp4", imgSrc: "/banners/prediction-banner-17.webp", alt: "Soccer Predictz", width: 270, height: 70 },
  { id: "18", videoSrc: "/banners/prediction-banner-18.mp4", imgSrc: "/banners/prediction-banner-18.webp", alt: "Zulu Bet", width: 130, height: 44 },
];

// Distributed across pages - a few everywhere, not all in one place
export const HOME_BANNERS = ALL_BANNERS.slice(0, 4);
export const FREE_TIPS_BANNERS = ALL_BANNERS.slice(4, 9);
export const VIP_BANNERS = ALL_BANNERS.slice(9, 12);
export const HISTORY_BANNERS = ALL_BANNERS.slice(12, 15);
export const FOOTER_BANNERS = ALL_BANNERS.slice(15, 18);