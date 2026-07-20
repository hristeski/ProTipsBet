"use client";

import { memo, useEffect, useRef, useState } from "react";

interface BannerAdSlotProps {
  id: string;
  href?: string;
  videoSrc?: string;
  imgSrc?: string;
  alt?: string;
  size?: "small" | "medium" | "large";
  width: number;
  height: number;
}

const BannerAdSlot = memo(function BannerAdSlot({
  id,
  href,
  videoSrc,
  imgSrc,
  alt,
  size = "medium",
  width,
  height,
}: BannerAdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const showImg = isVisible && Boolean(imgSrc);
  const showPlaceholder = !isVisible && !imgSrc;

  const content = (
    <div
      ref={containerRef}
      data-ad-slot={id}
      className="relative w-full rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900/60 flex items-center justify-center group"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {showPlaceholder && (
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-700">
          Ad #{id}
        </span>
      )}

      {showImg && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgSrc}
          alt={alt ?? "Advertisement"}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-contain"
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
        className="block"
      >
        {content}
      </a>
    );
  }
  return content;
}