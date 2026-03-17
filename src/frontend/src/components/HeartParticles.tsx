import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  shape: "heart" | "sparkle" | "star";
  phase: number;
  waveAmp: number;
  waveFreq: number;
}

function pickShape(): Particle["shape"] {
  const r = Math.random();
  if (r < 0.6) return "heart";
  if (r < 0.85) return "sparkle";
  return "star";
}

const GLYPHS: Record<Particle["shape"], string> = {
  heart: "\u2665",
  sparkle: "\u2726",
  star: "\u2605",
};

export default function HeartParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { heartColor } = useTheme();
  const heartColorRef = useRef(heartColor);
  heartColorRef.current = heartColor;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const createParticle = (yOverride?: number): Particle => ({
      x: Math.random() * canvas.width,
      y: yOverride !== undefined ? yOverride : canvas.height + 20,
      size: Math.random() * 16 + 8,
      speedY: Math.random() * 1.0 + 0.2,
      speedX: 0,
      opacity: Math.random() * 0.37 + 0.08,
      shape: pickShape(),
      phase: Math.random() * Math.PI * 2,
      waveAmp: Math.random() * 0.6 + 0.2,
      waveFreq: Math.random() * 0.015 + 0.008,
    });

    for (let i = 0; i < 40; i++) {
      const p = createParticle(Math.random() * canvas.height);
      particles.push(p);
    }

    let frameCount = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      if (frameCount % 60 === 0 && particles.length < 55) {
        particles.push(createParticle());
      }

      particles = particles.filter((p) => p.y > -40 && p.opacity > 0);

      for (const p of particles) {
        p.y -= p.speedY;
        p.x += Math.sin(frameCount * p.waveFreq + p.phase) * p.waveAmp;

        if (p.y < canvas.height * 0.15) {
          p.opacity -= 0.003;
        }

        const col = heartColorRef.current;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.font = `${p.size}px serif`;
        ctx.fillStyle = `${col}${Math.max(0, p.opacity)})`;
        ctx.shadowBlur = p.size * 0.8;
        ctx.shadowColor = `${col}0.6)`;
        ctx.fillText(GLYPHS[p.shape], p.x, p.y);
        ctx.restore();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  );
}
