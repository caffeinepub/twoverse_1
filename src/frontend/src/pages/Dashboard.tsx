import { motion } from "motion/react";
import { toast } from "sonner";
import {
  nanoToDate,
  useAddCheckIn,
  useGetAllCheckIns,
  useGetDaysTogether,
  useGetTodaysPrompt,
} from "../hooks/useQueries";

const EMOTIONS: { emoji: string; label: string; color: string }[] = [
  {
    emoji: "😊",
    label: "Happy",
    color: "bg-yellow-100 border-yellow-300 text-yellow-800",
  },
  {
    emoji: "😌",
    label: "Calm",
    color: "bg-blue-100 border-blue-300 text-blue-800",
  },
  {
    emoji: "😤",
    label: "Stressed",
    color: "bg-orange-100 border-orange-300 text-orange-800",
  },
  {
    emoji: "😴",
    label: "Tired",
    color: "bg-slate-100 border-slate-300 text-slate-700",
  },
  {
    emoji: "🤩",
    label: "Excited",
    color: "bg-pink-100 border-pink-300 text-pink-800",
  },
  {
    emoji: "😢",
    label: "Sad",
    color: "bg-indigo-100 border-indigo-300 text-indigo-800",
  },
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

  const todaysCheckIn = checkIns?.find((c) => isToday(c.timestamp));

  const handleEmotion = (label: string) => {
    if (todaysCheckIn) {
      toast.info("You've already checked in today 💕");
      return;
    }
    addCheckIn.mutate(
      { emotion: label.toLowerCase(), note: null },
      {
        onSuccess: () =>
          toast.success(`Feeling ${label.toLowerCase()} noted! 💕`),
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
        <p className="text-sm text-muted-foreground font-medium tracking-widest uppercase mb-1">
          TwoVerse
        </p>
        <h1 className="font-display text-3xl font-bold text-foreground leading-tight">
          Our little world 🌸
        </h1>
      </motion.div>

      {/* Days Together Counter */}
      <motion.div
        data-ocid="dashboard.days_counter"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-card p-6 text-center border border-border"
      >
        <div className="text-5xl font-display font-bold text-primary mb-2">
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
            <span className="text-2xl text-muted-foreground">
              Set your start date
            </span>
          )}
        </div>
        {daysNum !== null && (
          <p className="text-muted-foreground text-sm font-medium">
            {daysNum === 1 ? "day together" : "days together"}
          </p>
        )}
        {daysNum === null && (
          <p className="text-muted-foreground text-xs mt-1">
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
        className="bg-primary/8 rounded-3xl p-5 border border-primary/20"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">✨</span>
          <p className="text-xs font-semibold text-primary uppercase tracking-widest">
            Today's Prompt
          </p>
        </div>
        <p className="font-display text-lg font-semibold text-foreground leading-snug">
          {prompt || "What's one thing you love most about today?"}
        </p>
      </motion.div>

      {/* Daily Check-in */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-card p-5 border border-border"
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🫶</span>
          <div>
            <h2 className="font-semibold text-foreground text-sm">
              How are you feeling?
            </h2>
            {todaysCheckIn ? (
              <p className="text-xs text-muted-foreground">
                Today:{" "}
                <span className="text-primary font-medium capitalize">
                  {todaysCheckIn.emotion}
                </span>
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
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
                className={`flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? "border-primary bg-primary/12 shadow-sm"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <span className="text-2xl">{e.emoji}</span>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {e.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Footer */}
      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="text-primary hover:underline"
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
