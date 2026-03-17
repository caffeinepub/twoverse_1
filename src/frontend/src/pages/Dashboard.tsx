import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  nanoToDate,
  useAddCheckIn,
  useGetAllCheckIns,
  useGetDaysTogether,
  useGetTodaysPrompt,
} from "../hooks/useQueries";

const EMOTIONS: { emoji: string; label: string }[] = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😤", label: "Stressed" },
  { emoji: "😴", label: "Tired" },
  { emoji: "🤩", label: "Excited" },
  { emoji: "😢", label: "Sad" },
];

const HEART_BURST = [
  { sym: "💕", offset: -50 },
  { sym: "🩷", offset: -30 },
  { sym: "❤️", offset: -15 },
  { sym: "💖", offset: 0 },
  { sym: "💗", offset: 15 },
  { sym: "✨", offset: 30 },
  { sym: "💫", offset: 45 },
  { sym: "🌸", offset: -40 },
];

const isToday = (ts: bigint) => {
  const d = nanoToDate(ts);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
};

export default function Dashboard() {
  const { data: days } = useGetDaysTogether();
  const { data: prompt } = useGetTodaysPrompt();
  const { data: checkIns } = useGetAllCheckIns();
  const addCheckIn = useAddCheckIn();
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  const todaysCheckIn = checkIns?.find((c) => isToday(c.timestamp));

  const handleEmotion = (label: string) => {
    if (todaysCheckIn) {
      toast.info("You've already checked in today 💕");
      return;
    }
    addCheckIn.mutate(
      { emotion: label.toLowerCase(), note: null },
      {
        onSuccess: () => {
          toast.success(`Feeling ${label.toLowerCase()} noted! 💕`);
          setShowHeartBurst(true);
          setTimeout(() => setShowHeartBurst(false), 900);
        },
        onError: () => toast.error("Couldn't save your check-in"),
      },
    );
  };

  const daysNum = days != null ? Number(days) : null;

  return (
    <div className="relative z-10 px-5 pt-10 pb-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p
          className="text-sm font-medium tracking-widest uppercase mb-1"
          style={{ color: "rgba(255,255,255,0.75)" }}
        >
          TwoVerse
        </p>
        <h1
          className="font-display text-3xl font-bold leading-tight"
          style={{ color: "rgba(255,255,255,0.97)" }}
        >
          Our little world 🌸
        </h1>
      </motion.div>

      {/* Days Together Counter */}
      <motion.div
        data-ocid="dashboard.days_counter"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="rounded-3xl shadow-card p-6 text-center border"
        style={{
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.25)",
        }}
      >
        <div
          className="text-5xl font-display font-bold mb-2"
          style={{ color: "rgba(255,255,255,0.97)" }}
        >
          {daysNum !== null ? (
            <motion.span
              key={daysNum}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
            >
              💕 {daysNum}
            </motion.span>
          ) : (
            <span
              className="text-2xl"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              Set your start date
            </span>
          )}
        </div>
        {daysNum !== null && (
          <p
            className="text-sm font-medium"
            style={{ color: "rgba(255,255,255,0.70)" }}
          >
            {daysNum === 1 ? "day together" : "days together"}
          </p>
        )}
        {daysNum === null && (
          <p
            className="text-xs mt-1"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Go to Settings to begin your journey
          </p>
        )}
      </motion.div>

      {/* Daily Prompt */}
      <motion.div
        data-ocid="dashboard.prompt_card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="rounded-3xl p-5 border"
        style={{
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.20)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">✨</span>
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.80)" }}
          >
            Today's Prompt
          </p>
        </div>
        <p
          className="font-display text-lg font-semibold leading-snug"
          style={{ color: "rgba(255,255,255,0.95)" }}
        >
          {prompt || "What's one thing you love most about today?"}
        </p>
      </motion.div>

      {/* Daily Check-in */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="rounded-3xl shadow-card p-5 border relative overflow-visible"
        style={{
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.25)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🫶</span>
          <div>
            <h2
              className="font-semibold text-sm"
              style={{ color: "rgba(255,255,255,0.95)" }}
            >
              How are you feeling?
            </h2>
            {todaysCheckIn ? (
              <p
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                Today:{" "}
                <span
                  className="font-medium capitalize"
                  style={{ color: "rgba(255,255,255,0.90)" }}
                >
                  {todaysCheckIn.emotion}
                </span>
              </p>
            ) : (
              <p
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.60)" }}
              >
                Tap to check in for today
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {EMOTIONS.map((e, i) => {
            const isSelected = todaysCheckIn?.emotion === e.label.toLowerCase();
            return (
              <motion.button
                key={e.label}
                data-ocid={`dashboard.checkin_button.${i + 1}`}
                whileTap={{ scale: 0.93 }}
                whileHover={{ scale: 1.04 }}
                onClick={() => handleEmotion(e.label)}
                disabled={addCheckIn.isPending}
                className="flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border-2 transition-all"
                style={{
                  borderColor: isSelected
                    ? "rgba(255,255,255,0.70)"
                    : "rgba(255,255,255,0.20)",
                  background: isSelected
                    ? "rgba(255,255,255,0.25)"
                    : "rgba(255,255,255,0.08)",
                }}
              >
                <span className="text-2xl">{e.emoji}</span>
                <span
                  className="text-[11px] font-medium"
                  style={{ color: "rgba(255,255,255,0.80)" }}
                >
                  {e.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Heart burst on check-in */}
        <AnimatePresence>
          {showHeartBurst && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                pointerEvents: "none",
                zIndex: 20,
              }}
            >
              {HEART_BURST.map((h, i) => (
                <motion.span
                  key={h.sym}
                  initial={{ opacity: 1, y: 0, x: h.offset * 0.6, scale: 1 }}
                  animate={{
                    opacity: 0,
                    y: -90,
                    x: h.offset,
                    scale: 1.6,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.9,
                    ease: "easeOut",
                    delay: i * 0.07,
                  }}
                  style={{
                    position: "absolute",
                    fontSize: "22px",
                    lineHeight: 1,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {h.sym}
                </motion.span>
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer */}
      <div className="text-center pt-2">
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.50)" }}>
          © {new Date().getFullYear()} Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="hover:underline"
            style={{ color: "rgba(255,255,255,0.75)" }}
            target="_blank"
            rel="noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
