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
  { id: "01", videoSrc: "/banners/prediction-banner-01.mp4", imgSrc: "/banners/prediction-banner-01.webp", alt: "Predictions for today", width: 100, height: 30 },
  { id: "02", videoSrc: "/banners/prediction-banner-02.mp4", imgSrc: "/banners/prediction-banner-02.webp", alt: "Sure win prediction today", width: 100, height: 30 },
  { id: "03", videoSrc: "/banners/prediction-banner-03.mp4", imgSrc: "/banners/prediction-banner-03.webp", alt: "Vitibet predictions", width: 250, height: 80 },
  { id: "04", videoSrc: "/banners/prediction-banner-04.mp4", imgSrc: "/banners/prediction-banner-04.webp", alt: "24 prediction today", width: 300, height: 90 },
  { id: "05", videoSrc: "/banners/prediction-banner-05.mp4", imgSrc: "/banners/prediction-banner-05.webp", alt: "24 prediction today correct score tomorrow sure wins", width: 300, height: 100 },
  { id: "06", videoSrc: "/banners/prediction-banner-06.mp4", imgSrc: "/banners/prediction-banner-06.webp", alt: "Soccervista 24 prediction today", width: 270, height: 70 },
  { id: "07", videoSrc: "/banners/prediction-banner-07.mp4", imgSrc: "/banners/prediction-banner-07.webp", alt: "Today upset prediction", width: 270, height: 70 },
  { id: "08", videoSrc: "/banners/prediction-banner-08.mp4", imgSrc: "/banners/prediction-banner-08.webp", alt: "Tipster24 prediction today", width: 276, height: 92 },
  { id: "09", videoSrc: "/banners/prediction-banner-09.mp4", imgSrc: "/banners/prediction-banner-09.webp", alt: "Soccervista solo prediction", width: 270, height: 70 },
  { id: "10", videoSrc: "/banners/prediction-banner-10.mp4", imgSrc: "/banners/prediction-banner-10.webp", alt: "Soccervista focus predict", width: 180, height: 60 },
  { id: "11", videoSrc: "/banners/prediction-banner-11.mp4", imgSrc: "/banners/prediction-banner-11.webp", alt: "Soccervista predictions for today PredictZ", width: 300, height: 100 },
  { id: "12", videoSrc: "/banners/prediction-banner-12.mp4", imgSrc: "/banners/prediction-banner-12.webp", alt: "Bet of the day Soccervista sure wins today to", width: 300, height: 100 },
  { id: "13", videoSrc: "/banners/prediction-banner-13.mp4", imgSrc: "/banners/prediction-banner-13.webp", alt: "Top 10 most sure bet of the day", width: 300, height: 100 },
  { id: "14", videoSrc: "/banners/prediction-banner-14.mp4", imgSrc: "/banners/prediction-banner-14.webp", alt: "Most sure bet of the day", width: 180, height: 60 },
  { id: "15", videoSrc: "/banners/prediction-banner-15.mp4", imgSrc: "/banners/prediction-banner-15.webp", alt: "Soccervista bet of the today", width: 270, height: 70 },
  { id: "16", videoSrc: "/banners/prediction-banner-16.mp4", imgSrc: "/banners/prediction-banner-16.webp", alt: "My bet of the day sure wins", width: 270, height: 70 },
  { id: "17", videoSrc: "/banners/prediction-banner-17.mp4", imgSrc: "/banners/prediction-banner-17.webp", alt: "Banker bet of the day", width: 270, height: 70 },
  { id: "18", videoSrc: "/banners/prediction-banner-18.mp4", imgSrc: "/banners/prediction-banner-18.webp", alt: "Single bet of the day", width: 130, height: 44 },
];

// Distributed across pages - a few everywhere, not all in one place
export const HOME_BANNERS = ALL_BANNERS.slice(0, 4);
export const FREE_TIPS_BANNERS = ALL_BANNERS.slice(4, 9);
export const VIP_BANNERS = ALL_BANNERS.slice(9, 12);
export const HISTORY_BANNERS = ALL_BANNERS.slice(12, 15);
export const FOOTER_BANNERS = ALL_BANNERS.slice(15, 18);