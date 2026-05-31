import { useEffect, useRef } from 'react';

// 🟢 NVIDIA GTC Taipei — logo particles falling, May 31 – June 6
// Performance: single Image loaded once; each frame is pure ctx.drawImage blits.

const LOGO_COUNT = 18;
const LOGO_SIZES = [28, 38, 50, 64] as const;

interface LogoParticle {
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

function initParticle(w: number, h: number, fromTop = false): LogoParticle {
  const size = LOGO_SIZES[Math.floor(Math.random() * LOGO_SIZES.length)];
  return {
    x: rand(0, w),
    y: fromTop ? rand(-size * 2, 0) : rand(0, h),
    size,
    speedY: rand(0.4, 1.1),
    speedX: rand(-0.15, 0.15),
    angle: rand(0, Math.PI * 2),
    angleSpeed: rand(-0.005, 0.005),
    sineOffset: rand(0, Math.PI * 2),
    sineFreq: rand(0.006, 0.014),
    sineAmp: rand(20, 55),
    opacity: rand(0.35, 0.75),
  };
}

export default function NvidiaSnow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Active May 31 – June 6 (GTC Taipei countdown + Computex week)
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const active = (m === 5 && d === 31) || (m === 6 && d >= 1 && d <= 6);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = '/nvidia-logo.png';

    let animId: number;
    let particles: LogoParticle[] = [];
    let time = 0;
    let frame = 0;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function init() {
      resize();
      particles = Array.from({ length: LOGO_COUNT }, () =>
        initParticle(canvas!.width, canvas!.height, false)
      );
    }

    function tick() {
      animId = requestAnimationFrame(tick);
      frame++;
      if (frame % 2 !== 0) return; // ~30fps
      time++;

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      if (!img.complete) return;

      for (const p of particles) {
        p.x += p.speedX + Math.sin(time * p.sineFreq + p.sineOffset) * 0.4;
        p.y += p.speedY;
        p.angle += p.angleSpeed;

        if (p.y > canvas!.height + p.size * 2) {
          Object.assign(p, initParticle(canvas!.width, canvas!.height, true));
        }
        if (p.x > canvas!.width + p.size)  p.x = -p.size;
        if (p.x < -p.size) p.x = canvas!.width + p.size;

        ctx!.save();
        ctx!.globalAlpha = p.opacity;
        ctx!.translate(p.x, p.y);
        ctx!.rotate(p.angle);
        ctx!.drawImage(img, -p.size / 2, -p.size / 2, p.size, p.size);
        ctx!.restore();
      }
    }

    img.onload = () => {
      init();
      tick();
    };

    // If already cached
    if (img.complete) {
      init();
      tick();
    }

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  if (!active) return null;

  return (
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
  );
}
