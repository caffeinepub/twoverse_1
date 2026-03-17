import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { THEMES, useTheme } from "../context/ThemeContext";

interface IntroScreenProps {
  onDone: () => void;
}

export default function IntroScreen({ onDone }: IntroScreenProps) {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(true);
  const themeData = THEMES.find((t) => t.id === theme);

  const dismiss = useCallback(() => {
    setVisible(false);
    setTimeout(onDone, 600);
  }, [onDone]);

  useEffect(() => {
    const timer = setTimeout(dismiss, 2800);
    return () => clearTimeout(timer);
  }, [dismiss]);

  const floaters = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 28 + 14,
    delay: Math.random() * 2,
    dur: Math.random() * 3 + 3,
  }));

  const bgGradient = themeData?.isDark
    ? `linear-gradient(160deg, ${themeData.colors[2]} 0%, ${themeData.colors[0]}55 100%)`
    : `linear-gradient(160deg, ${themeData?.colors[2] ?? "#FFF0F3"} 0%, ${themeData?.colors[1] ?? "#FFB3C6"}88 100%)`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center cursor-pointer select-none"
          style={{ background: bgGradient }}
          onClick={dismiss}
        >
          {/* Floating hearts bg */}
          {floaters.map((f) => (
            <motion.div
              key={f.id}
              className="absolute pointer-events-none"
              style={{
                left: `${f.x}%`,
                top: `${f.y}%`,
                fontSize: `${f.size}px`,
                color: themeData?.colors[0] ?? "#FF6E8C",
                opacity: 0.35,
              }}
              animate={{
                y: ["-10px", "10px", "-10px"],
                rotate: [-8, 8, -8],
                opacity: [0.2, 0.55, 0.2],
              }}
              transition={{
                duration: f.dur,
                delay: f.delay,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              🩷
            </motion.div>
          ))}

          {/* Center content */}
          <div className="flex flex-col items-center gap-4 px-8">
            {/* Glow ring */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute w-72 h-72 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${themeData?.colors[0] ?? "#FF6E8C"}44 0%, transparent 70%)`,
              }}
            />

            {/* Main emoji */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                bounce: 0.5,
                delay: 0.15,
                duration: 0.8,
              }}
              className="text-6xl z-10"
            >
              🩷
            </motion.div>

            {/* Title */}
            <style>{`
              @keyframes title-shimmer {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
              }
            `}</style>
            <motion.h1
              initial={{ opacity: 0, y: 24, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: "spring",
                bounce: 0.35,
                delay: 0.3,
                duration: 0.9,
              }}
              className="font-display text-5xl font-bold text-center leading-tight z-10"
              style={{
                background: themeData?.isDark
                  ? "linear-gradient(90deg, #ffffff 0%, #ffffffaa 30%, #ffffff 50%, #ffffffaa 70%, #ffffff 100%)"
                  : `linear-gradient(90deg, ${themeData?.colors[0] ?? "#FF6E8C"} 0%, ${themeData?.colors[0] ?? "#FF6E8C"}88 30%, #fff 50%, ${themeData?.colors[0] ?? "#FF6E8C"}88 70%, ${themeData?.colors[0] ?? "#FF6E8C"} 100%)`,
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "title-shimmer 2.5s linear infinite",
              }}
            >
              TwoVerse
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="text-lg font-medium tracking-widest uppercase z-10"
              style={{
                color: themeData?.isDark
                  ? "rgba(255,255,255,0.6)"
                  : `${themeData?.colors[0] ?? "#FF6E8C"}aa`,
                letterSpacing: "0.25em",
              }}
            >
              your love story
            </motion.p>

            {/* Tap hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0.6, 0] }}
              transition={{
                delay: 1.4,
                duration: 1.4,
                times: [0, 0.2, 0.8, 1],
              }}
              className="text-xs mt-4 z-10"
              style={{
                color: themeData?.isDark
                  ? "rgba(255,255,255,0.35)"
                  : `${themeData?.colors[0] ?? "#FF6E8C"}66`,
              }}
            >
              tap to continue
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
