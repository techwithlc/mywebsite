import { useEffect, useRef } from 'react';

// ❄️ NVIDIA GTC Taipei — green crystalline snowflakes, May 31 – June 6
const FLAKE_COUNT = 40;

interface Flake {
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

function initFlake(w: number, h: number, fromTop = false): Flake {
  return {
    x: rand(0, w),
    y: fromTop ? rand(-h, 0) : rand(0, h),
    size: rand(7, 18),
    speedY: rand(0.5, 1.4),
    speedX: rand(-0.2, 0.2),
    angle: rand(0, Math.PI * 2),
    angleSpeed: rand(-0.008, 0.008),
    sineOffset: rand(0, Math.PI * 2),
    sineFreq: rand(0.006, 0.016),
    sineAmp: rand(30, 80),
    opacity: rand(0.45, 0.85),
  };
}

// NVIDIA-green crystalline snowflake with glow
function drawFlake(ctx: CanvasRenderingContext2D, f: Flake) {
  const { x, y, size, angle, opacity } = f;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.globalAlpha = opacity;

  ctx.strokeStyle = '#76b900';
  ctx.fillStyle = '#76b900';
  ctx.shadowColor = '#76b900';
  ctx.shadowBlur = size * 1.2;
  ctx.lineWidth = Math.max(1, size * 0.1);
  ctx.lineCap = 'round';

  // 6 main arms
  for (let i = 0; i < 6; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 3);

    // Main arm
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -size);
    ctx.stroke();

    // Upper sub-branches
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.55);
    ctx.lineTo(size * 0.22, -size * 0.72);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.55);
    ctx.lineTo(-size * 0.22, -size * 0.72);
    ctx.stroke();

    // Lower sub-branches
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.3);
    ctx.lineTo(size * 0.15, -size * 0.44);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.3);
    ctx.lineTo(-size * 0.15, -size * 0.44);
    ctx.stroke();

    ctx.restore();
  }

  // Glowing center hexagon
  ctx.shadowBlur = size * 0.5;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3 - Math.PI / 6;
    const r = size * 0.18;
    if (i === 0) ctx.moveTo(r * Math.cos(a), r * Math.sin(a));
    else ctx.lineTo(r * Math.cos(a), r * Math.sin(a));
  }
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

export default function NvidiaSnow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Active May 31 – June 6 (GTC Taipei countdown + Computex week)
  const now = new Date();
  const month = now.getMonth() + 1; // 1-based
  const day = now.getDate();
  const active =
    (month === 5 && day === 31) ||
    (month === 6 && day >= 1 && day <= 6);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let flakes: Flake[] = [];
    let time = 0;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function init() {
      resize();
      flakes = Array.from({ length: FLAKE_COUNT }, () =>
        initFlake(canvas!.width, canvas!.height, false)
      );
    }

    function tick() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      time++;

      for (const f of flakes) {
        f.x += f.speedX + Math.sin(time * f.sineFreq + f.sineOffset) * 0.6;
        f.y += f.speedY;
        f.angle += f.angleSpeed;

        if (f.y > canvas!.height + 30) {
          const fresh = initFlake(canvas!.width, canvas!.height, true);
          fresh.y = -30;
          Object.assign(f, fresh);
        }
        if (f.x > canvas!.width + 30) f.x = -30;
        if (f.x < -30) f.x = canvas!.width + 30;

        drawFlake(ctx!, f);
      }

      animId = requestAnimationFrame(tick);
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
