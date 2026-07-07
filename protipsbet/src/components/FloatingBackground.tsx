const ITEMS = [
  { emoji: "⚽", top: "8%", left: "6%", size: "2rem", duration: "9s", delay: "0s" },
  { emoji: "🏆", top: "18%", left: "88%", size: "2.4rem", duration: "11s", delay: "1.2s" },
  { emoji: "⚽", top: "70%", left: "10%", size: "1.6rem", duration: "8s", delay: "2s" },
  { emoji: "🎯", top: "80%", left: "82%", size: "2rem", duration: "10s", delay: "0.5s" },
  { emoji: "⚽", top: "40%", left: "92%", size: "1.4rem", duration: "7s", delay: "1.8s" },
  { emoji: "🥅", top: "55%", left: "3%", size: "2.2rem", duration: "12s", delay: "0.8s" },
  { emoji: "⚽", top: "12%", left: "45%", size: "1.2rem", duration: "9.5s", delay: "2.5s" },
  { emoji: "🏆", top: "85%", left: "50%", size: "1.6rem", duration: "10.5s", delay: "1.5s" },
];

/**
 * Decorative floating elements (balls, trophies, goal) behind the hero.
 * pointer-events-none so it never blocks clicks; low opacity;
 * respects prefers-reduced-motion via the .floating-item class in globals.css
 */
export default function FloatingBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {ITEMS.map((item, i) => (
        <span
          key={i}
          className="floating-item absolute opacity-[0.12] select-none"
          style={{
            top: item.top,
            left: item.left,
            fontSize: item.size,
            animationDuration: item.duration,
            animationDelay: item.delay,
          }}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  );
}