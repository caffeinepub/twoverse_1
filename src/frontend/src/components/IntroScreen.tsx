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

  const primaryColor = themeData?.colors[0] ?? "#FF6E8C";
  const outerGlow = `radial-gradient(circle, ${primaryColor}55 0%, transparent 70%)`;
  const innerGlow = `radial-gradient(circle, ${primaryColor}33 0%, transparent 65%)`;
  const logoShadow = `drop-shadow(0 0 24px ${primaryColor}88) drop-shadow(0 0 8px ${primaryColor}66)`;

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
                color: primaryColor,
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
            {/* Outer glow pulse ring */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute w-64 h-64 rounded-full pointer-events-none"
              style={{
                background: outerGlow,
                filter: "blur(12px)",
              }}
            />

            {/* Inner glow ring */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{
                duration: 1.8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 0.4,
              }}
              className="absolute w-52 h-52 rounded-full pointer-events-none"
              style={{
                background: innerGlow,
                filter: "blur(6px)",
              }}
            />

            {/* App Logo */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, y: [0, -8, 0] }}
              transition={{
                scale: {
                  type: "spring",
                  bounce: 0.5,
                  delay: 0.15,
                  duration: 0.8,
                },
                opacity: { delay: 0.15, duration: 0.5 },
                y: {
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 1,
                },
              }}
              className="z-10 relative"
            >
              <img
                src="/assets/uploads/Picsart_26-03-18_07-07-49-444-1.png"
                alt="TwoVerse Logo"
                className="w-48 h-48 object-contain rounded-3xl"
                style={{
                  filter: logoShadow,
                  mixBlendMode: "multiply",
                }}
              />
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="text-lg font-medium tracking-widest uppercase z-10"
              style={{
                color: themeData?.isDark
                  ? "rgba(255,255,255,0.6)"
                  : `${primaryColor}aa`,
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
                  : `${primaryColor}66`,
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
