import { useEffect, useState } from 'react';

// 🌸 Cherry blossoms — only visible in March, gone by April
const PETAL_COUNT = 18;

interface Petal {
  id: number;
  left: number;       // vw %
  delay: number;      // s
  duration: number;   // s
  size: number;       // px
  swayX: number;      // px, how far it drifts side to side
  rotation: number;   // deg, initial spin
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function generatePetals(): Petal[] {
  return Array.from({ length: PETAL_COUNT }, (_, i) => ({
    id: i,
    left: randomBetween(0, 100),
    delay: randomBetween(0, 12),
    duration: randomBetween(8, 14),
    size: randomBetween(8, 16),
    swayX: randomBetween(40, 100) * (Math.random() > 0.5 ? 1 : -1),
    rotation: randomBetween(0, 360),
  }));
}

export default function SakuraEffect() {
  const [petals] = useState<Petal[]>(generatePetals);

  // Only render in March (month === 2 in JS, 0-indexed)
  const now = new Date();
  if (now.getMonth() !== 2) return null;

  return (
    <>
      <style>{`
        @keyframes sakura-fall {
          0%   { transform: translateY(-60px) translateX(0) rotate(var(--rot)); opacity: 0; }
          10%  { opacity: 0.85; }
          90%  { opacity: 0.7; }
          100% { transform: translateY(105vh) translateX(var(--sway)) rotate(calc(var(--rot) + 540deg)); opacity: 0; }
        }
        .sakura-petal {
          position: fixed;
          top: 0;
          pointer-events: none;
          z-index: 9999;
          border-radius: 50% 0 50% 0;
          background: radial-gradient(ellipse at 40% 35%, #ffd6e7 0%, #ffb3cc 60%, #ff8fab 100%);
          animation: sakura-fall var(--dur) var(--delay) infinite linear;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .sakura-petal { display: none; }
        }
      `}</style>
      {petals.map((p) => (
        <div
          key={p.id}
          className="sakura-petal"
          style={{
            left: `${p.left}vw`,
            width: `${p.size}px`,
            height: `${p.size * 0.85}px`,
            ['--dur' as string]: `${p.duration}s`,
            ['--delay' as string]: `${p.delay}s`,
            ['--sway' as string]: `${p.swayX}px`,
            ['--rot' as string]: `${p.rotation}deg`,
          }}
        />
      ))}
    </>
  );
}
