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
  { id: "01", href: "https://japan-fixed.com/", videoSrc: "/banners/prediction-banner-01.mp4", imgSrc: "/banners/prediction-banner-01.webp", alt: "Predictions for today", width: 96, height: 32 },
  { id: "02", href: "https://egyptfixed.com/", videoSrc: "/banners/prediction-banner-02.mp4", imgSrc: "/banners/prediction-banner-02.webp", alt: "Sure win prediction today", width: 96, height: 32 },
  { id: "03", href: "https://soccervista.today/", videoSrc: "/banners/prediction-banner-03.mp4", imgSrc: "/banners/prediction-banner-03.webp", alt: "Vitibet predictions", width: 96, height: 32 },
  { id: "04", href: "https://www.forebet.com", videoSrc: "/banners/prediction-banner-04.mp4", imgSrc: "/banners/prediction-banner-04.webp", alt: "24 prediction today", width: 96, height: 32 },
  { id: "05", href: "https://www.betexplorer.com", videoSrc: "/banners/prediction-banner-05.mp4", imgSrc: "/banners/prediction-banner-05.webp", alt: "24 prediction today correct score tomorrow sure wins", width: 96, height: 32 },
  { id: "06", href: "https://www.soccervista.com", videoSrc: "/banners/prediction-banner-06.mp4", imgSrc: "/banners/prediction-banner-06.webp", alt: "Soccervista 24 prediction today", width: 96, height: 32 },
  { id: "07", href: "https://www.soccerstats.com", videoSrc: "/banners/prediction-banner-07.mp4", imgSrc: "/banners/prediction-banner-07.webp", alt: "Today upset prediction", width: 96, height: 32 },
  { id: "08", href: "https://www.tipster24.com", videoSrc: "/banners/prediction-banner-08.mp4", imgSrc: "/banners/prediction-banner-08.webp", alt: "Tipster24 prediction today", width: 96, height: 32 },
  { id: "09", href: "https://www.soccervista.com", videoSrc: "/banners/prediction-banner-09.mp4", imgSrc: "/banners/prediction-banner-09.webp", alt: "Soccervista solo prediction", width: 96, height: 32 },
  { id: "10", href: "https://www.betexplorer.com", videoSrc: "/banners/prediction-banner-10.mp4", imgSrc: "/banners/prediction-banner-10.webp", alt: "Soccervista focus predict", width: 96, height: 32 },
  { id: "11", href: "https://www.predictz.com", videoSrc: "/banners/prediction-banner-11.mp4", imgSrc: "/banners/prediction-banner-11.webp", alt: "Soccervista predictions for today PredictZ", width: 96, height: 32 },
  { id: "12", href: "https://www.soccervista.com", videoSrc: "/banners/prediction-banner-12.mp4", imgSrc: "/banners/prediction-banner-12.webp", alt: "Bet of the day Soccervista sure wins today to", width: 96, height: 32 },
  { id: "13", href: "https://www.forebet.com", videoSrc: "/banners/prediction-banner-13.mp4", imgSrc: "/banners/prediction-banner-13.webp", alt: "Top 10 most sure bet of the day", width: 96, height: 32 },
  { id: "14", href: "https://www.betexplorer.com", videoSrc: "/banners/prediction-banner-14.mp4", imgSrc: "/banners/prediction-banner-14.webp", alt: "Most sure bet of the day", width: 96, height: 32 },
  { id: "15", href: "https://www.soccervista.com", videoSrc: "/banners/prediction-banner-15.mp4", imgSrc: "/banners/prediction-banner-15.webp", alt: "Soccervista bet of the today", width: 96, height: 32 },
  { id: "16", href: "https://www.betexplorer.com", videoSrc: "/banners/prediction-banner-16.mp4", imgSrc: "/banners/prediction-banner-16.webp", alt: "My bet of the day sure wins", width: 96, height: 32 },
  { id: "17", href: "https://www.forebet.com", videoSrc: "/banners/prediction-banner-17.mp4", imgSrc: "/banners/prediction-banner-17.webp", alt: "Banker bet of the day", width: 96, height: 32 },
  { id: "18", href: "https://www.soccerpunter.com", videoSrc: "/banners/prediction-banner-18.mp4", imgSrc: "/banners/prediction-banner-18.webp", alt: "Single bet of the day", width: 96, height: 32 },
];

// Distributed across pages - a few everywhere, not all in one place
export const HOME_BANNERS = ALL_BANNERS.slice(0, 4);
export const FREE_TIPS_BANNERS = ALL_BANNERS.slice(4, 9);
export const VIP_BANNERS = ALL_BANNERS.slice(9, 12);
export const HISTORY_BANNERS = ALL_BANNERS.slice(12, 15);
export const FOOTER_BANNERS = ALL_BANNERS.slice(15, 18);