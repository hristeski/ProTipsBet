"use client";

import Script from "next/script";

export default function HistatsAnalytics() {
  return (
    <>
      <div id="histats_counter" style={{ display: "none" }} />
      <Script id="histats-init" strategy="afterInteractive">
        {`
          var _Hasync = _Hasync || [];
          _Hasync.push(['Histats.start', '1,5041817,4,400,120,90,00010000']);
          _Hasync.push(['Histats.fasi', '1']);
          _Hasync.push(['Histats.track_hits', '']);
          (function() {
            var hs = document.createElement('script');
            hs.type = 'text/javascript';
            hs.async = true;
            hs.src = ('//s10.histats.com/js15_as.js');
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hs);
          })();
        `}
      </Script>
    </>
  );
}