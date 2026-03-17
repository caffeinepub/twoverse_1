import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  useGetCurrentWeekChallenges,
  useIncrementChallengeProgress,
  useInitWeeklyChallenges,
  useResetWeeklyChallenges,
} from "../hooks/useQueries";

interface CoupleChallengesProps {
  onBack: () => void;
}

const CARD_STYLE = {
  background: "rgba(255,255,255,0.14)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  borderColor: "rgba(255,255,255,0.22)",
};

export default function CoupleChallenges({ onBack }: CoupleChallengesProps) {
  const { data: challenges = [], isLoading } = useGetCurrentWeekChallenges();
  const initChallenges = useInitWeeklyChallenges();
  const incrementProgress = useIncrementChallengeProgress();
  const resetChallenges = useResetWeeklyChallenges();

  // Init on mount (idempotent)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    initChallenges.mutate();
    // run once on mount
  }, [initChallenges.mutate]);

  const handleProgress = (id: bigint, title: string) => {
    incrementProgress.mutate(id, {
      onSuccess: () => toast.success(`+1 on "${title}" 🎯`),
      onError: () => toast.error("Couldn't update progress"),
    });
  };

  const handleReset = () => {
    resetChallenges.mutate(undefined, {
      onSuccess: () => toast.success("Week reset! New challenges ready 🔄"),
      onError: () => toast.error("Couldn't reset challenges"),
    });
  };

  const completed = challenges.filter((c) => c.isCompleted).length;
  const total = challenges.length;

  return (
    <div className="relative z-10 px-4 pt-8 pb-6 space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <button
          type="button"
          data-ocid="challenges.back_button"
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center border transition-all active:scale-95"
          style={CARD_STYLE}
        >
          <span style={{ color: "rgba(255,255,255,0.80)" }}>←</span>
        </button>
        <div>
          <h1
            className="font-display text-2xl font-bold"
            style={{ color: "rgba(255,255,255,0.97)" }}
          >
            Couple Challenges 🏆
          </h1>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
            {isLoading
              ? "Loading..."
              : total > 0
                ? `${completed}/${total} complete this week`
                : "No challenges yet"}
          </p>
        </div>
      </motion.div>

      {/* Weekly Progress Summary */}
      {total > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border px-5 py-4"
          style={CARD_STYLE}
        >
          <div className="flex items-center justify-between mb-2">
            <p
              className="font-semibold text-sm"
              style={{ color: "rgba(255,255,255,0.90)" }}
            >
              Week Progress
            </p>
            <p
              className="text-sm font-bold"
              style={{ color: "rgba(255,255,255,0.70)" }}
            >
              {completed}/{total}
            </p>
          </div>
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: total > 0 ? `${(completed / total) * 100}%` : "0%",
              }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #60C060, #90E890)",
                boxShadow: "0 0 8px rgba(96,200,96,0.50)",
              }}
            />
          </div>
        </motion.div>
      )}

      {/* Challenges List */}
      {isLoading ? (
        <div data-ocid="challenges.loading_state" className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-3xl border p-5 animate-pulse"
              style={{ ...CARD_STYLE, height: "100px" }}
            />
          ))}
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-3">
            {challenges.map((challenge, idx) => {
              const current = Number(challenge.currentCount);
              const target = Number(challenge.targetCount);
              const pct = Math.min((current / target) * 100, 100);
              return (
                <motion.div
                  key={String(challenge.id)}
                  data-ocid={`challenges.item.${idx + 1}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.06, duration: 0.35 }}
                  className="rounded-3xl border p-5 relative overflow-hidden"
                  style={{
                    ...CARD_STYLE,
                    borderColor: challenge.isCompleted
                      ? "rgba(100,220,100,0.40)"
                      : "rgba(255,255,255,0.22)",
                  }}
                >
                  {/* Completed glow */}
                  {challenge.isCompleted && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(ellipse at center, rgba(80,200,80,0.08) 0%, transparent 70%)",
                      }}
                    />
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p
                          className="font-display font-semibold text-base"
                          style={{ color: "rgba(255,255,255,0.95)" }}
                        >
                          {challenge.title}
                        </p>
                        {challenge.isCompleted && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-base"
                          >
                            ✅
                          </motion.span>
                        )}
                      </div>
                      <p
                        className="text-xs leading-snug mb-3"
                        style={{ color: "rgba(255,255,255,0.60)" }}
                      >
                        {challenge.description}
                      </p>

                      {/* Progress bar */}
                      <div className="flex items-center gap-3">
                        <div
                          className="flex-1 h-2 rounded-full overflow-hidden"
                          style={{ background: "rgba(255,255,255,0.15)" }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{
                              background: challenge.isCompleted
                                ? "linear-gradient(90deg, #60C060, #90E890)"
                                : "linear-gradient(90deg, rgba(255,160,80,0.8), rgba(255,200,80,0.9))",
                            }}
                          />
                        </div>
                        <span
                          className="text-xs font-bold"
                          style={{
                            color: "rgba(255,255,255,0.70)",
                            minWidth: "36px",
                          }}
                        >
                          {current}/{target}
                        </span>
                      </div>
                    </div>

                    {/* +1 button */}
                    {!challenge.isCompleted && (
                      <motion.button
                        type="button"
                        data-ocid={`challenges.item.${idx + 1}`}
                        whileTap={{ scale: 0.88 }}
                        onClick={() =>
                          handleProgress(challenge.id, challenge.title)
                        }
                        disabled={incrementProgress.isPending}
                        className="flex-shrink-0 w-12 h-12 rounded-2xl font-bold text-sm flex items-center justify-center transition-all"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255,160,80,0.70), rgba(255,100,60,0.80))",
                          color: "#fff",
                          boxShadow: "0 2px 12px rgba(255,120,60,0.30)",
                        }}
                      >
                        +1
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}

      {challenges.length === 0 && !isLoading && (
        <motion.div
          data-ocid="challenges.empty_state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10"
        >
          <p className="text-4xl mb-3">🎯</p>
          <p
            className="font-display text-lg"
            style={{ color: "rgba(255,255,255,0.70)" }}
          >
            No challenges this week
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Challenges will appear here automatically
          </p>
        </motion.div>
      )}

      {/* Reset Week (subtle) */}
      {challenges.length > 0 && (
        <div className="text-center pt-2">
          <button
            type="button"
            data-ocid="challenges.secondary_button"
            onClick={handleReset}
            disabled={resetChallenges.isPending}
            className="text-xs px-4 py-2 rounded-full border transition-all active:scale-95"
            style={{
              borderColor: "rgba(255,255,255,0.18)",
              color: "rgba(255,255,255,0.40)",
              background: "transparent",
            }}
          >
            {resetChallenges.isPending ? "Resetting..." : "Reset Week"}
          </button>
        </div>
      )}
    </div>
  );
}
