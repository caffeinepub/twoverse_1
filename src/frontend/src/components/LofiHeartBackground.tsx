import { useRef } from "react";
import { useTheme } from "../context/ThemeContext";

interface HeartConfig {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  floatY: number;
  swayX: number;
  rotation: number;
  opacity: number;
}

interface SparkleConfig {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const HEART_CONFIGS: HeartConfig[] = [
  {
    id: 1,
    x: 5,
    y: 10,
    size: 160,
    duration: 32,
    delay: 0,
    floatY: 18,
    swayX: 8,
    rotation: -8,
    opacity: 0.82,
  },
  {
    id: 2,
    x: 70,
    y: 5,
    size: 200,
    duration: 38,
    delay: 4,
    floatY: 22,
    swayX: 10,
    rotation: 6,
    opacity: 0.75,
  },
  {
    id: 3,
    x: 40,
    y: 35,
    size: 120,
    duration: 28,
    delay: 8,
    floatY: 14,
    swayX: 6,
    rotation: -4,
    opacity: 0.88,
  },
  {
    id: 4,
    x: 85,
    y: 50,
    size: 180,
    duration: 40,
    delay: 2,
    floatY: 20,
    swayX: 12,
    rotation: 10,
    opacity: 0.7,
  },
  {
    id: 5,
    x: 15,
    y: 60,
    size: 140,
    duration: 35,
    delay: 12,
    floatY: 16,
    swayX: 7,
    rotation: -6,
    opacity: 0.8,
  },
  {
    id: 6,
    x: 55,
    y: 70,
    size: 110,
    duration: 30,
    delay: 6,
    floatY: 12,
    swayX: 5,
    rotation: 8,
    opacity: 0.85,
  },
  {
    id: 7,
    x: 80,
    y: 80,
    size: 170,
    duration: 36,
    delay: 16,
    floatY: 19,
    swayX: 9,
    rotation: -5,
    opacity: 0.72,
  },
  {
    id: 8,
    x: 25,
    y: 82,
    size: 130,
    duration: 33,
    delay: 10,
    floatY: 15,
    swayX: 6,
    rotation: 7,
    opacity: 0.78,
  },
  {
    id: 9,
    x: 60,
    y: 20,
    size: 90,
    duration: 27,
    delay: 18,
    floatY: 11,
    swayX: 4,
    rotation: -9,
    opacity: 0.9,
  },
  {
    id: 10,
    x: 45,
    y: 88,
    size: 150,
    duration: 42,
    delay: 14,
    floatY: 17,
    swayX: 8,
    rotation: 4,
    opacity: 0.76,
  },
];

const SPARKLE_CONFIGS: SparkleConfig[] = [
  { id: 1, x: 20, y: 30, size: 28, duration: 4, delay: 0 },
  { id: 2, x: 75, y: 65, size: 22, duration: 5, delay: 1.5 },
  { id: 3, x: 50, y: 15, size: 18, duration: 3.5, delay: 0.8 },
];

function Heart({
  config,
  fill,
  highlight,
  shadow,
}: {
  config: HeartConfig;
  fill: string;
  highlight: string;
  shadow: string;
}) {
  const gradId = `hg${config.id}`;
  const glowId = `glow${config.id}`;
  const animName = `lofi-float-${config.id}`;

  return (
    <>
      <style>{`
        @keyframes ${animName} {
          0% { transform: translateY(0px) translateX(0px) rotate(${config.rotation}deg); }
          33% { transform: translateY(-${config.floatY}px) translateX(${config.swayX}px) rotate(${config.rotation + 2}deg); }
          66% { transform: translateY(-${config.floatY * 0.5}px) translateX(-${config.swayX * 0.6}px) rotate(${config.rotation - 1}deg); }
          100% { transform: translateY(0px) translateX(0px) rotate(${config.rotation}deg); }
        }
      `}</style>
      <div
        style={{
          position: "absolute",
          left: `${config.x}%`,
          top: `${config.y}%`,
          width: config.size,
          height: config.size,
          opacity: config.opacity,
          animation: `${animName} ${config.duration}s ease-in-out ${config.delay}s infinite`,
          filter: `drop-shadow(0 4px 16px ${shadow}88) drop-shadow(0 0 8px ${fill}55)`,
          pointerEvents: "none",
        }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 100 90"
          width={config.size}
          height={config.size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id={gradId} cx="38%" cy="32%" r="62%">
              <stop offset="0%" stopColor={highlight} stopOpacity="1" />
              <stop offset="40%" stopColor={fill} stopOpacity="1" />
              <stop offset="100%" stopColor={shadow} stopOpacity="1" />
            </radialGradient>
            <filter id={glowId}>
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="1.5"
                result="blur"
              />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Main heart shape */}
          <path
            d="M50 80 C50 80 8 52 8 26 C8 13 18 4 30 4 C38 4 46 9 50 16 C54 9 62 4 70 4 C82 4 92 13 92 26 C92 52 50 80 50 80 Z"
            fill={`url(#${gradId})`}
          />
          {/* Highlight gloss */}
          <ellipse
            cx="35"
            cy="24"
            rx="12"
            ry="8"
            fill={highlight}
            opacity="0.45"
            style={{ filter: "blur(3px)" }}
          />
          {/* Subtle shine dot */}
          <circle cx="30" cy="20" r="4" fill="white" opacity="0.30" />
        </svg>
      </div>
    </>
  );
}

function Sparkle({ config, color }: { config: SparkleConfig; color: string }) {
  const animName = `lofi-sparkle-${config.id}`;
  return (
    <>
      <style>{`
        @keyframes ${animName} {
          0%, 100% { transform: scale(0.8) rotate(0deg); opacity: 0.4; }
          50% { transform: scale(1.2) rotate(20deg); opacity: 1; }
        }
      `}</style>
      <div
        style={{
          position: "absolute",
          left: `${config.x}%`,
          top: `${config.y}%`,
          width: config.size,
          height: config.size,
          animation: `${animName} ${config.duration}s ease-in-out ${config.delay}s infinite`,
          pointerEvents: "none",
          filter: `drop-shadow(0 0 6px ${color})`,
        }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width={config.size}
          height={config.size}
        >
          <path
            d="M12 2 L13.2 10.8 L22 12 L13.2 13.2 L12 22 L10.8 13.2 L2 12 L10.8 10.8 Z"
            fill={color}
          />
          <path
            d="M12 6 L12.6 10.8 L17 12 L12.6 13.2 L12 18 L11.4 13.2 L7 12 L11.4 10.8 Z"
            fill="white"
            opacity="0.6"
          />
        </svg>
      </div>
    </>
  );
}

export default function LofiHeartBackground() {
  const { themeData } = useTheme();
  const prevThemeRef = useRef(themeData.id);
  prevThemeRef.current = themeData.id;

  const { heartFill, heartHighlight, heartShadow, sparkleColor, bgDeep } =
    themeData;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        backgroundColor: bgDeep,
        transition: "background-color 0.6s ease",
      }}
    >
      {/* Radial glow overlay for depth */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${heartFill}30 0%, transparent 70%)`,
          pointerEvents: "none",
          transition: "background 0.6s ease",
        }}
      />
      {HEART_CONFIGS.map((config) => (
        <Heart
          key={config.id}
          config={config}
          fill={heartFill}
          highlight={heartHighlight}
          shadow={heartShadow}
        />
      ))}
      {SPARKLE_CONFIGS.map((config) => (
        <Sparkle key={config.id} config={config} color={sparkleColor} />
      ))}
    </div>
  );
}
