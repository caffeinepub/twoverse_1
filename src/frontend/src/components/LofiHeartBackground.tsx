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
    y: 8,
    size: 28,
    duration: 42,
    delay: 0,
    floatY: 10,
    swayX: 5,
    rotation: -8,
    opacity: 0.5,
  },
  {
    id: 2,
    x: 18,
    y: 22,
    size: 22,
    duration: 50,
    delay: 4,
    floatY: 8,
    swayX: 4,
    rotation: 6,
    opacity: 0.42,
  },
  {
    id: 3,
    x: 35,
    y: 5,
    size: 34,
    duration: 46,
    delay: 8,
    floatY: 12,
    swayX: 6,
    rotation: -4,
    opacity: 0.48,
  },
  {
    id: 4,
    x: 55,
    y: 15,
    size: 20,
    duration: 54,
    delay: 2,
    floatY: 9,
    swayX: 3,
    rotation: 10,
    opacity: 0.4,
  },
  {
    id: 5,
    x: 72,
    y: 8,
    size: 30,
    duration: 38,
    delay: 12,
    floatY: 11,
    swayX: 5,
    rotation: -6,
    opacity: 0.46,
  },
  {
    id: 6,
    x: 88,
    y: 20,
    size: 18,
    duration: 48,
    delay: 6,
    floatY: 7,
    swayX: 3,
    rotation: 8,
    opacity: 0.38,
  },
  {
    id: 7,
    x: 10,
    y: 50,
    size: 26,
    duration: 56,
    delay: 16,
    floatY: 10,
    swayX: 4,
    rotation: -5,
    opacity: 0.44,
  },
  {
    id: 8,
    x: 28,
    y: 65,
    size: 38,
    duration: 44,
    delay: 10,
    floatY: 13,
    swayX: 6,
    rotation: 7,
    opacity: 0.5,
  },
  {
    id: 9,
    x: 50,
    y: 45,
    size: 20,
    duration: 58,
    delay: 18,
    floatY: 7,
    swayX: 3,
    rotation: -9,
    opacity: 0.36,
  },
  {
    id: 10,
    x: 68,
    y: 55,
    size: 32,
    duration: 40,
    delay: 14,
    floatY: 11,
    swayX: 5,
    rotation: 4,
    opacity: 0.46,
  },
  {
    id: 11,
    x: 82,
    y: 42,
    size: 24,
    duration: 52,
    delay: 7,
    floatY: 9,
    swayX: 4,
    rotation: -3,
    opacity: 0.42,
  },
  {
    id: 12,
    x: 42,
    y: 80,
    size: 22,
    duration: 45,
    delay: 20,
    floatY: 8,
    swayX: 3,
    rotation: 5,
    opacity: 0.38,
  },
];

const SPARKLE_CONFIGS: SparkleConfig[] = [
  { id: 1, x: 20, y: 30, size: 18, duration: 4, delay: 0 },
  { id: 2, x: 75, y: 65, size: 14, duration: 5, delay: 1.5 },
  { id: 3, x: 50, y: 15, size: 12, duration: 3.5, delay: 0.8 },
  { id: 4, x: 85, y: 40, size: 16, duration: 4.5, delay: 2.2 },
  { id: 5, x: 30, y: 70, size: 10, duration: 3.8, delay: 1.0 },
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
  const animName = `lofi-float-${config.id}`;

  return (
    <>
      <style>{`
        @keyframes ${animName} {
          0%   { transform: translateY(0px) translateX(0px) rotate(${config.rotation}deg); }
          33%  { transform: translateY(-${config.floatY}px) translateX(${config.swayX}px) rotate(${config.rotation + 2}deg); }
          66%  { transform: translateY(-${config.floatY * 0.5}px) translateX(-${config.swayX * 0.6}px) rotate(${config.rotation - 1}deg); }
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
          filter: `drop-shadow(0 2px 6px ${shadow}88) drop-shadow(0 0 3px ${fill}44)`,
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
          </defs>
          <path
            d="M50 80 C50 80 8 52 8 26 C8 13 18 4 30 4 C38 4 46 9 50 16 C54 9 62 4 70 4 C82 4 92 13 92 26 C92 52 50 80 50 80 Z"
            fill={`url(#${gradId})`}
          />
          <ellipse
            cx="35"
            cy="24"
            rx="10"
            ry="6"
            fill={highlight}
            opacity="0.4"
            style={{ filter: "blur(2px)" }}
          />
          <circle cx="30" cy="20" r="3" fill="white" opacity="0.28" />
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
          0%, 100% { transform: scale(0.8) rotate(0deg); opacity: 0.3; }
          50% { transform: scale(1.2) rotate(20deg); opacity: 0.85; }
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
          filter: `drop-shadow(0 0 4px ${color})`,
        }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width={config.size}
          height={config.size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2 L13.2 10.8 L22 12 L13.2 13.2 L12 22 L10.8 13.2 L2 12 L10.8 10.8 Z"
            fill={color}
          />
          <path
            d="M12 6 L12.6 10.8 L17 12 L12.6 13.2 L12 18 L11.4 13.2 L7 12 L11.4 10.8 Z"
            fill="white"
            opacity="0.5"
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
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${heartFill}28 0%, transparent 70%)`,
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
