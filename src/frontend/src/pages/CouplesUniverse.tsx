import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useGetAllGalaxyItems } from "../hooks/useQueries";

interface Star {
  x: number;
  y: number;
  r: number;
  color: string;
  label: string;
  type: "memory" | "mission" | "letter" | "anniversary";
  twinkleOffset: number;
  twinkleSpeed: number;
}

const STAR_COLORS = {
  memory: ["#ff8fab", "#ffb3c6", "#ff6b9d"],
  mission: ["#ffd166", "#ffb703", "#f4a261"],
  letter: ["#c77dff", "#b57bee", "#9d4edd"],
  anniversary: ["#ffffff", "#e8f4f8", "#cce8f0"],
};

function generateSpiralStars(counts: {
  memories: number;
  missions: number;
  letters: number;
  anniversaries: number;
}): Star[] {
  const stars: Star[] = [];
  const cx = 0;
  const cy = 0;

  let idx = 0;
  const addStars = (
    count: number,
    type: Star["type"],
    label: string,
    colorArr: string[],
  ) => {
    for (let i = 0; i < count; i++) {
      const angle = idx * 0.618 * 2 * Math.PI;
      const dist = 30 + idx * 18;
      const x = cx + dist * Math.cos(angle);
      const y = cy + dist * Math.sin(angle);
      const color = colorArr[i % colorArr.length];
      stars.push({
        x,
        y,
        r: 4 + Math.random() * 3,
        color,
        label: `${label} #${i + 1}`,
        type,
        twinkleOffset: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.5 + Math.random() * 1.5,
      });
      idx++;
    }
  };

  addStars(counts.memories, "memory", "Memory", STAR_COLORS.memory);
  addStars(counts.missions, "mission", "Mission", STAR_COLORS.mission);
  addStars(counts.letters, "letter", "Love Letter", STAR_COLORS.letter);
  addStars(
    counts.anniversaries,
    "anniversary",
    "Anniversary",
    STAR_COLORS.anniversary,
  );

  return stars;
}

const BG_STARS = Array.from({ length: 160 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: 0.5 + Math.random() * 1.5,
  opacity: 0.3 + Math.random() * 0.6,
  twinkleSpeed: 1 + Math.random() * 3,
  twinkleOffset: Math.random() * Math.PI * 2,
}));

export default function CouplesUniverse() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { data: galaxyData } = useGetAllGalaxyItems();
  const [tooltip, setTooltip] = useState<{
    label: string;
    x: number;
    y: number;
  } | null>(null);
  const animFrameRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const scaleRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });

  const totalStars =
    Number(galaxyData?.memories ?? 0) +
    Number(galaxyData?.completedMissions ?? 0) +
    Number(galaxyData?.loveLetters ?? 0) +
    Number(galaxyData?.anniversaries ?? 0);

  useEffect(() => {
    if (!galaxyData) return;
    starsRef.current = generateSpiralStars({
      memories: Number(galaxyData.memories),
      missions: Number(galaxyData.completedMissions),
      letters: Number(galaxyData.loveLetters),
      anniversaries: Number(galaxyData.anniversaries),
    });
  }, [galaxyData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let start: number | null = null;

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      scaleRef.current = devicePixelRatio;
      offsetRef.current = {
        x: canvas.width / 2,
        y: canvas.height / 2,
      };
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (ts: number) => {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      const w = canvas.width;
      const h = canvas.height;

      // Background gradient
      const bg = ctx.createRadialGradient(
        w / 2,
        h / 2,
        0,
        w / 2,
        h / 2,
        Math.max(w, h) * 0.7,
      );
      bg.addColorStop(0, "#1a0533");
      bg.addColorStop(0.5, "#0d0020");
      bg.addColorStop(1, "#000008");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Nebula cloud
      const nebula = ctx.createRadialGradient(
        w * 0.35,
        h * 0.45,
        0,
        w * 0.35,
        h * 0.45,
        w * 0.45,
      );
      nebula.addColorStop(0, "rgba(120,0,180,0.10)");
      nebula.addColorStop(0.4, "rgba(200,50,150,0.06)");
      nebula.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, w, h);

      const nebula2 = ctx.createRadialGradient(
        w * 0.65,
        h * 0.55,
        0,
        w * 0.65,
        h * 0.55,
        w * 0.4,
      );
      nebula2.addColorStop(0, "rgba(0,80,200,0.08)");
      nebula2.addColorStop(0.5, "rgba(0,160,220,0.04)");
      nebula2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, w, h);

      // Background twinkle stars
      for (const s of BG_STARS) {
        const twinkle =
          0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset);
        ctx.beginPath();
        ctx.arc((s.x * w) / 100, (s.y * h) / 100, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity * twinkle})`;
        ctx.fill();
      }

      const ox = offsetRef.current.x;
      const oy = offsetRef.current.y;

      // Data stars
      const stars = starsRef.current;
      for (const star of stars) {
        const twinkle =
          0.7 + 0.3 * Math.sin(t * star.twinkleSpeed + star.twinkleOffset);
        const float = Math.sin(t * 0.4 + star.twinkleOffset) * 2;

        // Glow
        const glow = ctx.createRadialGradient(
          ox + star.x,
          oy + star.y + float,
          0,
          ox + star.x,
          oy + star.y + float,
          star.r * 3.5,
        );
        glow.addColorStop(0, `${star.color}88`);
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(ox + star.x, oy + star.y + float, star.r * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Star core
        ctx.beginPath();
        ctx.arc(
          ox + star.x,
          oy + star.y + float,
          star.r * twinkle,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = star.color;
        ctx.fill();
      }

      // Empty state center sparkle
      if (stars.length === 0) {
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.5);
        ctx.font = `${40 + pulse * 8}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.globalAlpha = 0.4 + 0.3 * pulse;
        ctx.fillText("✨", ox, oy);
        ctx.globalAlpha = 1;
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = devicePixelRatio;
    const clickX = (e.clientX - rect.left) * dpr;
    const clickY = (e.clientY - rect.top) * dpr;
    const ox = offsetRef.current.x;
    const oy = offsetRef.current.y;

    for (const star of starsRef.current) {
      const dx = clickX - (ox + star.x);
      const dy = clickY - (oy + star.y);
      if (Math.sqrt(dx * dx + dy * dy) < star.r * 4 * dpr) {
        setTooltip({
          label: star.label,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top - 36,
        });
        return;
      }
    }
    setTooltip(null);
  };

  return (
    <div
      className="relative flex flex-col"
      style={{ height: "calc(100dvh - 80px)" }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-0 left-0 right-0 z-10 px-5 pt-8 pb-3"
        style={{
          background: "rgba(10,0,30,0.60)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(180,100,255,0.20)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="font-display text-xl font-bold"
              style={{ color: "rgba(255,255,255,0.97)" }}
            >
              Our Universe 🌌
            </h1>
            <p className="text-xs" style={{ color: "rgba(200,160,255,0.75)" }}>
              {totalStars} star{totalStars !== 1 ? "s" : ""} in your galaxy
            </p>
          </div>
          <div
            className="text-right text-xs"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            <span className="text-lg">🌠</span>
          </div>
        </div>
      </motion.div>

      {/* Galaxy canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onKeyDown={(e) => e.key === "Enter" && handleCanvasClick(e as any)}
        tabIndex={0}
        role="button"
        aria-label="Galaxy canvas - click stars to learn more"
        className="absolute inset-0 w-full h-full cursor-crosshair"
        style={{ touchAction: "manipulation" }}
      />

      {/* Tooltip */}
      {tooltip && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="absolute z-20 px-3 py-1.5 rounded-xl text-xs font-medium pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translateX(-50%)",
            background: "rgba(20,5,40,0.88)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(200,100,255,0.35)",
            color: "rgba(255,255,255,0.95)",
          }}
        >
          {tooltip.label}
        </motion.div>
      )}

      {/* Empty state overlay */}
      {totalStars === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          data-ocid="universe.empty_state"
          className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
          style={{ paddingTop: "80px" }}
        >
          <p className="text-5xl mb-3">🌌</p>
          <p
            className="text-sm font-medium"
            style={{ color: "rgba(200,160,255,0.85)" }}
          >
            Your universe is waiting...
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Add memories, letters & missions to grow your galaxy
          </p>
        </motion.div>
      )}

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute bottom-0 left-0 right-0 z-10 px-4 py-3"
        style={{
          background: "rgba(10,0,30,0.60)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(180,100,255,0.15)",
        }}
      >
        <div className="flex items-center justify-around text-[11px]">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: STAR_COLORS.memory[0] }}
            />
            <span style={{ color: "rgba(255,255,255,0.70)" }}>Memories</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: STAR_COLORS.mission[0] }}
            />
            <span style={{ color: "rgba(255,255,255,0.70)" }}>Missions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: STAR_COLORS.letter[0] }}
            />
            <span style={{ color: "rgba(255,255,255,0.70)" }}>Letters</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: STAR_COLORS.anniversary[0] }}
            />
            <span style={{ color: "rgba(255,255,255,0.70)" }}>
              Anniversaries
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
