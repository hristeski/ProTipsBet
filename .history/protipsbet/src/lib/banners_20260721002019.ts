// FILE DESTINATION: src/lib/banners.ts

export interface BannerData {
  id: string;
  href?: string;
  videoSrc?: string;   // /banners/naslov.mp4
  imgSrc?: string;      // /banners/naslov.webp (fallback)
  alt?: string;
  width: number;
  height: number;
  position?: string;
}

// Пополнети со реалните fajlovi од public/banners/
// Сите банери се поставени на иста големина 120x40 и имаат рачно зададени линкови.
export const ALL_BANNERS: BannerData[] = [
  { id: "01", href: "https://japan-fixed.com/", videoSrc: "/banners/prediction-banner-01.mp4", imgSrc: "/banners/prediction-banner-01.webp", alt: "Predictions for today", width: 96, height: 32 },
  { id: "02", href: "https://egyptfixed.com/", videoSrc: "/banners/prediction-banner-02.mp4", imgSrc: "/banners/prediction-banner-02.webp", alt: "Sure win prediction today", width: 96, height: 32 },
  { id: "03", href: "https://soccervista.today/", videoSrc: "/banners/prediction-banner-03.mp4", imgSrc: "/banners/prediction-banner-03.webp", alt: "Vitibet predictions", width: 96, height: 32 },
  { id: "04", href: "https://safe-fixedmatches.com/", videoSrc: "/banners/prediction-banner-04.mp4", imgSrc: "/banners/prediction-banner-04.webp", alt: "24 prediction today", width: 96, height: 32 },
  { id: "05", href: "https://asia.japan-fixed.com/", videoSrc: "/banners/prediction-banner-05.mp4", imgSrc: "/banners/prediction-banner-05.webp", alt: "24 prediction today correct score tomorrow sure wins", width: 96, height: 32 },
  { id: "06", href: "https://fixedmatches.com.de/", videoSrc: "/banners/prediction-banner-06.mp4", imgSrc: "/banners/prediction-banner-06.webp", alt: "Soccervista 24 prediction today", width: 96, height: 32 },
  { id: "07", href: "https://darknet.bet-sportal.com/", videoSrc: "/banners/prediction-banner-07.mp4", imgSrc: "/banners/prediction-banner-07.webp", alt: "Today upset prediction", width: 96, height: 32 },
  { id: "08", href: "https://fixedmatch.net/", videoSrc: "/banners/prediction-banner-08.mp4", imgSrc: "/banners/prediction-banner-08.webp", alt: "Tipster24 prediction today", width: 96, height: 32 },
  { id: "09", href: "https://football.bet-sportal.com/", videoSrc: "/banners/prediction-banner-09.mp4", imgSrc: "/banners/prediction-banner-09.webp", alt: "Soccervista solo prediction", width: 96, height: 32 },
  { id: "10", href: "https://ivorycoast.bet-sportal.com/", videoSrc: "/banners/prediction-banner-10.mp4", imgSrc: "/banners/prediction-banner-10.webp", alt: "Soccervista focus predict", width: 96, height: 32 },
  { id: "11", href: "https://lio-bet.com/", videoSrc: "/banners/prediction-banner-11.mp4", imgSrc: "/banners/prediction-banner-11.webp", alt: "Soccervista predictions for today PredictZ", width: 96, height: 32 },
  { id: "12", href: "https://bet-sportal.com/", videoSrc: "/banners/prediction-banner-12.mp4", imgSrc: "/banners/prediction-banner-12.webp", alt: "Bet of the day Soccervista sure wins today to", width: 96, height: 32 },
  { id: "13", href: "https://bestfixedmatches.com/", videoSrc: "/banners/prediction-banner-13.mp4", imgSrc: "/banners/prediction-banner-13.webp", alt: "Top 10 most sure bet of the day", width: 96, height: 32 },
  { id: "14", href: "https://tanzania-bet.com/", videoSrc: "/banners/prediction-banner-14.mp4", imgSrc: "/banners/prediction-banner-14.webp", alt: "Most sure bet of the day", width: 96, height: 32 },
  { id: "15", href: "https://fixedmatches.bet-sportal.com/", videoSrc: "/banners/prediction-banner-15.mp4", imgSrc: "/banners/prediction-banner-15.webp", alt: "Soccervista bet of the today", width: 96, height: 32 },
  { id: "16", href: "https://fixingmatch.bet-sportal.com/", videoSrc: "/banners/prediction-banner-16.mp4", imgSrc: "/banners/prediction-banner-16.webp", alt: "My bet of the day sure wins", width: 96, height: 32 },
  { id: "17", href: "https://strongfixed.bet-sportal.com/", videoSrc: "/banners/prediction-banner-17.mp4", imgSrc: "/banners/prediction-banner-17.webp", alt: "Banker bet of the day", width: 96, height: 32 },
  { id: "18", href: "https://zulubet-1x2.com/", videoSrc: "/banners/prediction-banner-18.mp4", imgSrc: "/banners/prediction-banner-18.webp", alt: "Single bet of the day", width: 96, height: 32 },
    { id: "19", href: "https://darkweb.bet-sportal.com/", videoSrc: "/banners/dark-web-fixed-matches.mp4", imgSrc: "/banners/dark-web-fixed-matches.webp", alt: "Dark web fixed matches", width: 96, height: 32 },
  { id: "20", href: "https://legitfixedmatches.com/", videoSrc: "/banners/legit-fixed-matches.mp4", imgSrc: "/banners/legit-fixed-matches.webp", alt: "Legit fixed matches", width: 96, height: 32 },
  { id: "21", href: "https://ronaldo-7.net/", videoSrc: "/banners/accurate-soccer-prediction.mp4", imgSrc: "/banners/accurate-soccer-prediction.webp", alt: "Accurate soccer predictions", width: 96, height: 32 },
  { id: "22", href: "https://protipsbet.com/vip-tips", imgSrc: "/banners/protipsbet.webp", alt: "ProTipsBet VIP Tips", width: 20, height: 30, position: "footer" },

];

// Distributed across pages - a few everywhere, not all in one place
export const HOME_BANNERS = ALL_BANNERS.slice(0, 5);
export const FREE_TIPS_BANNERS = ALL_BANNERS.slice(5, 10);
export const VIP_BANNERS = ALL_BANNERS.slice(10, 15);
export const HISTORY_BANNERS = ALL_BANNERS.slice(15, 21);
export const FOOTER_BANNERS = ALL_BANNERS.filter((banner) => banner.position === "footer" || banner.id === "22");