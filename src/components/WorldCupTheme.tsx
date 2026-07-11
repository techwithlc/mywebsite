import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// ⚽ FIFA World Cup 2026 (June 11 – July 19) — falling ball particles + live stage banner.
const BALL_COUNT = 16;
const BALL_SIZES = [16, 22, 28] as const;

interface BallParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  angle: number;
  angleSpeed: number;
  sineOffset: number;
  sineFreq: number;
  sineAmp: number;
  opacity: number;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function initBall(w: number, h: number, fromTop = false): BallParticle {
  const size = BALL_SIZES[Math.floor(Math.random() * BALL_SIZES.length)];
  return {
    x: rand(0, w),
    y: fromTop ? rand(-size * 2, 0) : rand(0, h),
    size,
    speedY: rand(0.35, 0.9),
    speedX: rand(-0.15, 0.15),
    angle: rand(0, Math.PI * 2),
    angleSpeed: rand(-0.03, 0.03),
    sineOffset: rand(0, Math.PI * 2),
    sineFreq: rand(0.006, 0.014),
    sineAmp: rand(15, 45),
    opacity: rand(0.3, 0.65),
  };
}

// 2026 World Cup official calendar (Canada/Mexico/USA)
const STAGES = [
  { start: '2026-06-11', end: '2026-06-27', zh: '小組賽開踢', en: 'Group Stage' },
  { start: '2026-06-28', end: '2026-07-03', zh: '32強淘汰賽', en: 'Round of 32' },
  { start: '2026-07-04', end: '2026-07-07', zh: '16強賽', en: 'Round of 16' },
  { start: '2026-07-08', end: '2026-07-11', zh: '8強賽', en: 'Quarterfinals' },
  { start: '2026-07-12', end: '2026-07-13', zh: '準決賽倒數', en: 'Semifinals Coming Up' },
  { start: '2026-07-14', end: '2026-07-15', zh: '準決賽', en: 'Semifinals' },
  { start: '2026-07-16', end: '2026-07-17', zh: '決賽倒數', en: 'Final Coming Up' },
  { start: '2026-07-18', end: '2026-07-18', zh: '季軍賽', en: 'Third-Place Match' },
  { start: '2026-07-19', end: '2026-07-19', zh: '冠軍賽', en: 'The Final' },
];

function getStage(dateStr: string) {
  return STAGES.find((s) => dateStr >= s.start && dateStr <= s.end) ?? null;
}

const TOURNAMENT_START = '2026-06-05'; // banner appears a few days before kickoff
const TOURNAMENT_END = '2026-07-19';

function localDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function WorldCupTheme() {
  const { language } = useLanguage();
  const [dateStr] = useState(() => localDateStr(new Date()));
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const active = dateStr >= TOURNAMENT_START && dateStr <= TOURNAMENT_END;
  const stage = active ? getStage(dateStr) : null;

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: BallParticle[] = [];
    let time = 0;
    let frame = 0;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function init() {
      resize();
      particles = Array.from({ length: BALL_COUNT }, () =>
        initBall(canvas!.width, canvas!.height, false)
      );
    }

    function tick() {
      animId = requestAnimationFrame(tick);
      frame++;
      if (frame % 2 !== 0) return; // ~30fps
      time++;

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx!.font = '1px sans-serif'; // baseline reset; actual size set per-particle below
      ctx!.textAlign = 'center';
      ctx!.textBaseline = 'middle';

      for (const p of particles) {
        p.x += p.speedX + Math.sin(time * p.sineFreq + p.sineOffset) * 0.4;
        p.y += p.speedY;
        p.angle += p.angleSpeed;

        if (p.y > canvas!.height + p.size * 2) {
          Object.assign(p, initBall(canvas!.width, canvas!.height, true));
        }
        if (p.x > canvas!.width + p.size) p.x = -p.size;
        if (p.x < -p.size) p.x = canvas!.width + p.size;

        ctx!.save();
        ctx!.globalAlpha = p.opacity;
        ctx!.translate(p.x, p.y);
        ctx!.rotate(p.angle);
        ctx!.font = `${p.size}px sans-serif`;
        ctx!.fillText('⚽', 0, 0);
        ctx!.restore();
      }
    }

    init();
    tick();

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9998,
        }}
      />
      {stage && (
        <a
          href="https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026"
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-40 flex items-center justify-center gap-2 py-1.5 text-xs font-medium text-white transition-colors duration-300"
          style={{ background: 'linear-gradient(90deg, #0f9b6c, #0b7a54)' }}
        >
          <span>⚽</span>
          <span>
            {language === 'en'
              ? `FIFA World Cup 2026 — ${stage.en}`
              : `2026 世界盃足球賽 — ${stage.zh}`}
          </span>
        </a>
      )}
    </>
  );
}
