import { useEffect, useRef } from 'react';

// 🌸 March only — cherry blossoms via canvas + sine-wave drift
const PETAL_COUNT = 35;

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;      // fall speed
  speedX: number;      // base horizontal drift
  angle: number;       // current rotation (rad)
  angleSpeed: number;  // rotation speed
  sineOffset: number;  // phase offset for sine sway
  sineFreq: number;    // frequency of sway
  sineAmp: number;     // amplitude of sway (px)
  opacity: number;
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function initPetal(canvasWidth: number, canvasHeight: number, fromTop = false): Petal {
  return {
    x: randomBetween(0, canvasWidth),
    y: fromTop ? randomBetween(-canvasHeight, 0) : randomBetween(0, canvasHeight),
    size: randomBetween(5, 11),
    speedY: randomBetween(0.6, 1.6),
    speedX: randomBetween(-0.3, 0.3),
    angle: randomBetween(0, Math.PI * 2),
    angleSpeed: randomBetween(-0.015, 0.015),
    sineOffset: randomBetween(0, Math.PI * 2),
    sineFreq: randomBetween(0.008, 0.018),
    sineAmp: randomBetween(40, 90),
    opacity: randomBetween(0.55, 0.9),
  };
}

// Draw a single 5-petal cherry blossom
function drawPetal(ctx: CanvasRenderingContext2D, p: Petal) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);
  ctx.globalAlpha = p.opacity;

  const r = p.size;
  const petalCount = 5;

  for (let i = 0; i < petalCount; i++) {
    ctx.save();
    ctx.rotate((i / petalCount) * Math.PI * 2);
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.7, r * 0.38, r * 0.7, 0, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(0, -r * 0.4, 0, 0, -r * 0.7, r * 0.8);
    grad.addColorStop(0, '#ffe0ee');
    grad.addColorStop(0.5, '#ffb3cc');
    grad.addColorStop(1, '#ff85aa');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }

  // center dot
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.18, 0, Math.PI * 2);
  ctx.fillStyle = '#ffcce0';
  ctx.fill();

  ctx.restore();
}

export default function SakuraEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Only run in March
  const month = new Date().getMonth();
  if (month !== 2) return null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let petals: Petal[] = [];
    let time = 0;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function init() {
      resize();
      petals = Array.from({ length: PETAL_COUNT }, () =>
        initPetal(canvas!.width, canvas!.height, false)
      );
    }

    function tick() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      time++;

      for (const p of petals) {
        // Sine-wave horizontal sway — looks like wind
        p.x += p.speedX + Math.sin(time * p.sineFreq + p.sineOffset) * 0.8;
        p.y += p.speedY;
        p.angle += p.angleSpeed;

        // Wrap around when off screen
        if (p.y > canvas!.height + 20) {
          const fresh = initPetal(canvas!.width, canvas!.height, true);
          fresh.y = -20;
          Object.assign(p, fresh);
        }
        if (p.x > canvas!.width + 20) p.x = -20;
        if (p.x < -20) p.x = canvas!.width + 20;

        drawPetal(ctx!, p);
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
  }, []);

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
        zIndex: 9999,
      }}
    />
  );
}
