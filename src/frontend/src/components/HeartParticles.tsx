import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  opacityDelta: number;
}

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

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 20,
      size: Math.random() * 14 + 8,
      speedY: Math.random() * 0.8 + 0.3,
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.35 + 0.1,
      opacityDelta: 0,
    });

    // seed initial particles spread across the canvas
    for (let i = 0; i < 18; i++) {
      const p = createParticle();
      p.y = Math.random() * canvas.height;
      particles.push(p);
    }

    let frameCount = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      // spawn new particle every ~90 frames
      if (frameCount % 90 === 0 && particles.length < 30) {
        particles.push(createParticle());
      }

      particles = particles.filter((p) => p.y > -30 && p.opacity > 0);

      for (const p of particles) {
        p.y -= p.speedY;
        p.x += p.speedX;

        // gently fade near top
        if (p.y < canvas.height * 0.15) {
          p.opacity -= 0.004;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.font = `${p.size}px serif`;
        ctx.fillStyle = `${heartColorRef.current}${p.opacity})`;
        ctx.fillText("♥", p.x, p.y);
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
      style={{ opacity: 0.6 }}
    />
  );
}
