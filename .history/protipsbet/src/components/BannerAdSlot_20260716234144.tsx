"use client";

import { useEffect, useRef, useState } from "react";

interface BannerAdSlotProps {
  id: string;
  href?: string;
  imgSrc?: string;      // fallback / static image (webp or jpg)
  videoSrc?: string;    // mp4 or webm - preferred over gif
  alt?: string;
  size?: "small" | "medium" | "large";
  width: number;        // REQUIRED - avoids layout shift (CLS)
  height: number;       // REQUIRED
}

const SIZE_MAP = {
  small: "aspect-[3/1]",
  medium: "aspect-[4/1]",
  large: "aspect-[2/1]",
};

export default function BannerAdSlot({
  id,
  href,
  imgSrc,
  videoSrc,
  alt,
  size = "medium",
  width,
  height,
}: BannerAdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Only start loading the actual media once the slot is near the viewport.
  // This is what actually saves you from 50 banners loading at once.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" } // start loading 300px before it's on screen
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const content = (
    <div
      ref={containerRef}
      data-ad-slot={id}
      className={`relative w-full ${SIZE_MAP[size]} rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/60 flex items-center justify-center group`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {!isVisible && (
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-700">
          Ad Slot #{id}
        </span>
      )}

      {isVisible && videoSrc && (
        <video
          src={videoSrc}
          width={width}
          height={height}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          className="w-full h-full object-cover"
        />
      )}

      {isVisible && !videoSrc && imgSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgSrc}
          alt={alt ?? "Advertisement"}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="sponsored noopener noreferrer nofollow"
        aria-label={alt ?? `Advertisement ${id}`}
      >
        {content}
      </a>
    );
  }
  return content;
}