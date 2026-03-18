import { useQueryClient } from "@tanstack/react-query";
import { Calendar, Heart, Palette, Trophy, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useTheme } from "../context/ThemeContext";
import {
  nanoToDate,
  useAddCheckIn,
  useGetAllCheckIns,
  useGetDaysTogether,
  useGetLovePulses,
  useGetMoodPrediction,
  useGetRelationshipXP,
  useGetStreakCount,
  useGetTodaysPrompt,
  useSendLovePulse,
} from "../hooks/useQueries";

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

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

const CARD_STYLE = {
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  borderColor: "rgba(255,255,255,0.25)",
};

const LEVEL_THRESHOLDS = [
  { min: 0, max: 99, level: 1, name: "New Beginnings", emoji: "🌱" },
  { min: 100, max: 249, level: 2, name: "Growing Together", emoji: "🌿" },
  { min: 250, max: 499, level: 3, name: "Heart Bonded", emoji: "💞" },
  { min: 500, max: 999, level: 4, name: "Soul Mates", emoji: "💫" },
  {
    min: 1000,
    max: Number.POSITIVE_INFINITY,
    level: 5,
    name: "Eternal Love",
    emoji: "👑",
  },
];

function getLevelInfo(xp: number) {
  const tier = LEVEL_THRESHOLDS.find((t) => xp <= t.max) ?? LEVEL_THRESHOLDS[4];
  const isMax = tier.level === 5;
  const progress = isMax
    ? 100
    : Math.round(((xp - tier.min) / (tier.max - tier.min + 1)) * 100);
  const xpToNext = isMax ? 0 : tier.max - xp + 1;
  return { tier, progress, xpToNext, isMax };
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { data: days } = useGetDaysTogether();
  const { data: prompt } = useGetTodaysPrompt();
  const { data: checkIns } = useGetAllCheckIns();
  const { data: streakCount } = useGetStreakCount();
  const { data: relationshipXP } = useGetRelationshipXP();
  const addCheckIn = useAddCheckIn();
  const { data: moodAlert } = useGetMoodPrediction();
  const { data: lovePulses = [] } = useGetLovePulses();
  const sendLovePulse = useSendLovePulse();
  const { themeData } = useTheme();
  const queryClient = useQueryClient();
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [moodBannerDismissed, setMoodBannerDismissed] = useState(false);
  const [showPulseModal, setShowPulseModal] = useState(false);
  const [pulseNameInput, setPulseNameInput] = useState<string>(
    () => localStorage.getItem("twoverse_partner_name") ?? "",
  );

  // Goal state
  const [goal, setGoal] = useState<string>(
    () => localStorage.getItem("twoverse_goal") ?? "",
  );
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalDraft, setGoalDraft] = useState("");
  const goalInputRef = useRef<HTMLInputElement>(null);

  const todaysCheckIn = checkIns?.find((c) => isToday(c.timestamp));
  const daysNum = days != null ? Number(days) : null;
  const streak = streakCount != null ? Number(streakCount) : 0;
  const xp = relationshipXP != null ? Number(relationshipXP) : 0;
  const { tier, progress, xpToNext, isMax } = getLevelInfo(xp);

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

  const startGoalEdit = () => {
    setGoalDraft(goal);
    setEditingGoal(true);
  };

  useEffect(() => {
    if (editingGoal && goalInputRef.current) {
      goalInputRef.current.focus();
    }
  }, [editingGoal]);

  // Refresh at midnight so days counter & prompt update without manual reload
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    function scheduleNextMidnight() {
      const now = new Date();
      const nextMidnight = new Date(now);
      nextMidnight.setHours(24, 0, 0, 0);
      const msUntilMidnight = nextMidnight.getTime() - now.getTime();
      timeoutId = setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["daysTogether"] });
        queryClient.invalidateQueries({ queryKey: ["todaysPrompt"] });
        scheduleNextMidnight();
      }, msUntilMidnight);
    }
    scheduleNextMidnight();
    return () => clearTimeout(timeoutId);
  }, [queryClient]);

  const saveGoal = () => {
    const trimmed = goalDraft.trim();
    setGoal(trimmed);
    localStorage.setItem("twoverse_goal", trimmed);
    setEditingGoal(false);
  };

  const heartAccent = themeData.heartFill;

  const timeAgo = (ns: bigint) => {
    const ms = Date.now() - Number(ns / 1_000_000n);
    const s = Math.floor(ms / 1000);
    if (s < 60) return "just now";
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  const handleSendPulse = () => {
    const name = pulseNameInput.trim() || "Someone";
    localStorage.setItem("twoverse_partner_name", name);
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
    sendLovePulse.mutate(
      { senderName: name },
      {
        onSuccess: () => {
          toast.success("💓 Pulse sent!");
          setShowPulseModal(false);
        },
        onError: () => toast.error("Couldn't send pulse"),
      },
    );
  };

  return (
    <div className="relative z-10 px-4 pt-8 pb-6 space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-2"
      >
        <p
          className="text-sm font-medium tracking-widest uppercase mb-1"
          style={{ color: "rgba(255,255,255,0.70)" }}
        >
          TwoVerse
        </p>
      </motion.div>

      {/* Couple Card */}
      <motion.div
        data-ocid="dashboard.couple_card"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.08, duration: 0.5 }}
        className="rounded-3xl border p-6"
        style={CARD_STYLE}
      >
        {/* Him / Heart / Her */}
        <div className="flex items-center justify-center gap-5 mb-4">
          {/* Him */}
          <div className="flex flex-col items-center gap-1.5">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center border-2"
              style={{
                background: "rgba(255,255,255,0.20)",
                borderColor: "rgba(255,255,255,0.40)",
              }}
            >
              <User size={26} color="rgba(255,255,255,0.90)" />
            </div>
            <span
              className="text-xs font-semibold tracking-wide"
              style={{ color: "rgba(255,255,255,0.80)" }}
            >
              Him
            </span>
          </div>

          {/* Center Heart */}
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{
              duration: 2.4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="flex items-center justify-center"
          >
            <Heart
              size={46}
              fill={heartAccent}
              color={heartAccent}
              style={{ filter: `drop-shadow(0 0 10px ${heartAccent}88)` }}
            />
          </motion.div>

          {/* Her */}
          <div className="flex flex-col items-center gap-1.5">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center border-2"
              style={{
                background: "rgba(255,255,255,0.20)",
                borderColor: "rgba(255,255,255,0.40)",
              }}
            >
              <User size={26} color="rgba(255,255,255,0.90)" />
            </div>
            <span
              className="text-xs font-semibold tracking-wide"
              style={{ color: "rgba(255,255,255,0.80)" }}
            >
              Her
            </span>
          </div>
        </div>

        {/* Days Together */}
        <div className="text-center">
          {daysNum !== null ? (
            <>
              <motion.p
                key={daysNum}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="font-display text-2xl font-bold"
                style={{ color: "rgba(255,255,255,0.97)" }}
              >
                Together for {daysNum} {daysNum === 1 ? "day" : "days"}
              </motion.p>
              <p
                className="text-sm mt-0.5"
                style={{ color: "rgba(255,255,255,0.60)" }}
              >
                {daysNum} {daysNum === 1 ? "day" : "days"} ✨
              </p>
            </>
          ) : (
            <>
              <p
                className="font-display text-lg font-semibold"
                style={{ color: "rgba(255,255,255,0.80)" }}
              >
                Set your start date in Settings
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "rgba(255,255,255,0.50)" }}
              >
                Go to Settings to begin your journey
              </p>
            </>
          )}
        </div>
      </motion.div>

      {/* Mood Prediction Banner */}
      {moodAlert && !moodBannerDismissed && (
        <motion.div
          data-ocid="dashboard.mood_prediction_banner"
          initial={{ opacity: 0, y: -10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ type: "spring", bounce: 0.25 }}
          className="rounded-2xl border px-4 py-3 flex items-start gap-3"
          style={{
            background: "rgba(100,160,255,0.16)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderColor: "rgba(100,160,255,0.35)",
            animation: "pulse-soft 3s ease-in-out infinite",
          }}
        >
          <span className="text-xl flex-shrink-0 mt-0.5">💙</span>
          <p
            className="text-xs leading-relaxed flex-1"
            style={{ color: "rgba(255,255,255,0.88)" }}
          >
            It looks like one of you has been feeling low lately{" "}
            <span className="font-semibold">💙</span> Maybe plan something cozy
            together?
          </p>
          <button
            type="button"
            data-ocid="dashboard.mood_banner_close_button"
            onClick={() => setMoodBannerDismissed(true)}
            className="text-xs flex-shrink-0 mt-0.5 opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: "rgba(255,255,255,0.80)" }}
          >
            ✕
          </button>
        </motion.div>
      )}

      {/* Streak Badge */}
      <motion.div
        data-ocid="dashboard.streak_badge"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.12, duration: 0.45 }}
        className="rounded-2xl border px-5 py-3 flex items-center justify-between"
        style={CARD_STYLE}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          {streak > 0 ? (
            <div>
              <p
                className="font-bold text-base"
                style={{ color: "rgba(255,255,255,0.97)" }}
              >
                {streak} day streak!
              </p>
              <p
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.60)" }}
              >
                Keep checking in together
              </p>
            </div>
          ) : (
            <div>
              <p
                className="font-semibold text-sm"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                Start your streak today!
              </p>
              <p
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                Check in daily to build it up
              </p>
            </div>
          )}
        </div>
        <div
          className="rounded-full px-3 py-1 text-xs font-bold"
          style={{
            background:
              streak > 0 ? "rgba(255,160,50,0.25)" : "rgba(255,255,255,0.10)",
            color: streak > 0 ? "#FFB347" : "rgba(255,255,255,0.50)",
            border: "1px solid",
            borderColor:
              streak > 0 ? "rgba(255,160,50,0.50)" : "rgba(255,255,255,0.15)",
          }}
        >
          {streak > 0 ? `🔥 ${streak}` : "0"}
        </div>
      </motion.div>

      {/* Relationship Level + XP Bar */}
      <motion.div
        data-ocid="dashboard.level_card"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.45 }}
        className="rounded-2xl border px-5 py-4"
        style={CARD_STYLE}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{tier.emoji}</span>
            <div>
              <p
                className="font-bold text-sm"
                style={{ color: "rgba(255,255,255,0.97)" }}
              >
                Level {tier.level} — {tier.name}
              </p>
              <p
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {isMax
                  ? "Max level reached! 🎉"
                  : `${xpToNext} XP to next level`}
              </p>
            </div>
          </div>
          <span
            className="text-xs font-bold"
            style={{ color: "rgba(255,255,255,0.70)" }}
          >
            {xp} XP
          </span>
        </div>
        {/* XP Progress Bar */}
        <div
          className="w-full h-2 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${heartAccent}99, ${heartAccent})`,
              boxShadow: `0 0 8px ${heartAccent}80`,
            }}
          />
        </div>
      </motion.div>

      {/* Our Goal Card */}
      <motion.div
        data-ocid="dashboard.goal_card"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.45 }}
        className="rounded-3xl border p-5 cursor-pointer active:scale-[0.98] transition-transform"
        style={CARD_STYLE}
        onClick={startGoalEdit}
      >
        <div className="flex items-center gap-3 mb-2">
          <Trophy size={20} color="#FFD060" fill="#FFD060" />
          <span
            className="text-sm font-bold tracking-wide"
            style={{ color: "rgba(255,255,255,0.90)" }}
          >
            Our Goal
          </span>
        </div>
        {editingGoal ? (
          <input
            ref={goalInputRef}
            data-ocid="dashboard.goal_input"
            value={goalDraft}
            onChange={(e) => setGoalDraft(e.target.value)}
            onBlur={saveGoal}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveGoal();
              if (e.key === "Escape") setEditingGoal(false);
            }}
            placeholder="What's your couple goal?"
            className="w-full bg-transparent outline-none text-sm font-medium placeholder:italic"
            style={{ color: "rgba(255,255,255,0.90)" }}
          />
        ) : goal ? (
          <p
            className="text-sm font-medium"
            style={{ color: "rgba(255,255,255,0.88)" }}
          >
            {goal}
          </p>
        ) : (
          <p
            className="text-sm italic"
            style={{ color: "rgba(255,255,255,0.50)" }}
          >
            Tap to add a goal...
          </p>
        )}
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24, duration: 0.45 }}
        className="grid grid-cols-2 gap-3"
      >
        <motion.button
          data-ocid="dashboard.love_calendar_button"
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.03 }}
          onClick={() => onNavigate?.("anniversaries")}
          className="rounded-2xl border p-5 flex flex-col items-center gap-3"
          style={CARD_STYLE}
        >
          <Calendar size={28} color="rgba(255,255,255,0.90)" />
          <span
            className="text-sm font-semibold"
            style={{ color: "rgba(255,255,255,0.88)" }}
          >
            Love Calendar
          </span>
        </motion.button>

        <motion.button
          data-ocid="dashboard.themes_button"
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.03 }}
          onClick={() => onNavigate?.("settings")}
          className="rounded-2xl border p-5 flex flex-col items-center gap-3"
          style={CARD_STYLE}
        >
          <Palette size={28} color="rgba(255,255,255,0.90)" />
          <span
            className="text-sm font-semibold"
            style={{ color: "rgba(255,255,255,0.88)" }}
          >
            Themes
          </span>
        </motion.button>
      </motion.div>

      {/* Love Pulse Card */}
      <motion.div
        data-ocid="dashboard.love_pulse_card"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26, duration: 0.45 }}
        className="rounded-3xl border p-5"
        style={CARD_STYLE}
      >
        {/* Pulse button */}
        <div className="flex flex-col items-center gap-3 mb-4">
          <motion.button
            data-ocid="dashboard.love_pulse_button"
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowPulseModal(true)}
            className="relative flex items-center justify-center w-20 h-20 rounded-full"
            style={{
              background: "rgba(255,100,130,0.18)",
              border: "2px solid rgba(255,100,130,0.45)",
            }}
          >
            {/* Ripple rings */}
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute rounded-full"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "2px solid rgba(255,100,130,0.45)",
                }}
                animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.65,
                  ease: "easeOut",
                }}
              />
            ))}
            <motion.span
              animate={{ scale: [1, 1.12, 1] }}
              transition={{
                duration: 1.4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="text-4xl z-10"
            >
              💓
            </motion.span>
          </motion.button>
          <div className="text-center">
            <p
              className="text-sm font-semibold"
              style={{ color: "rgba(255,255,255,0.92)" }}
            >
              Love Pulse
            </p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
              Tap to send a heartbeat 💗
            </p>
          </div>
        </div>

        {/* Recent pulses */}
        {lovePulses.length > 0 && (
          <div className="space-y-1.5">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Recent Pulses
            </p>
            {lovePulses
              .slice(-5)
              .reverse()
              .map((p, i) => (
                <div
                  key={String(p.id)}
                  data-ocid={`dashboard.pulse_item.${i + 1}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <span className="text-base">💓</span>
                  <p
                    className="text-xs flex-1"
                    style={{ color: "rgba(255,255,255,0.80)" }}
                  >
                    <span className="font-semibold">{p.senderName}</span> sent a
                    pulse
                  </p>
                  <span
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {timeAgo(p.timestamp)}
                  </span>
                </div>
              ))}
          </div>
        )}
        {lovePulses.length === 0 && (
          <p
            data-ocid="dashboard.pulse_empty_state"
            className="text-center text-xs italic"
            style={{ color: "rgba(255,255,255,0.40)" }}
          >
            No pulses yet — be the first! 💓
          </p>
        )}
      </motion.div>

      {/* Pulse Name Modal */}
      <AnimatePresence>
        {showPulseModal && (
          <motion.div
            data-ocid="dashboard.pulse_modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center pb-10 px-5"
            style={{
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(4px)",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowPulseModal(false);
            }}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.25 }}
              className="w-full max-w-sm rounded-3xl p-6 space-y-4"
              style={{
                background: "rgba(30,15,25,0.92)",
                border: "1px solid rgba(255,100,130,0.30)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{
                    duration: 1.4,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                  className="text-5xl mb-2"
                >
                  💓
                </motion.div>
                <h3
                  className="font-display text-xl font-bold"
                  style={{ color: "rgba(255,255,255,0.97)" }}
                >
                  Send a Love Pulse
                </h3>
                <p
                  className="text-xs mt-1"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  Your partner will feel your heartbeat
                </p>
              </div>
              <input
                data-ocid="dashboard.pulse_name_input"
                value={pulseNameInput}
                onChange={(e) => setPulseNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendPulse()}
                placeholder="Your name..."
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.20)",
                  color: "rgba(255,255,255,0.90)",
                }}
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  data-ocid="dashboard.pulse_cancel_button"
                  onClick={() => setShowPulseModal(false)}
                  className="flex-1 rounded-xl py-3 text-sm font-semibold"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.60)",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  data-ocid="dashboard.pulse_submit_button"
                  onClick={handleSendPulse}
                  disabled={sendLovePulse.isPending}
                  className="flex-1 rounded-xl py-3 text-sm font-bold"
                  style={{
                    background: "linear-gradient(135deg, #ff6482, #ff3366)",
                    color: "#fff",
                    boxShadow: "0 4px 20px rgba(255,50,100,0.40)",
                  }}
                >
                  {sendLovePulse.isPending ? "Sending..." : "Send 💓"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Daily Prompt */}
      <motion.div
        data-ocid="dashboard.prompt_card"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.45 }}
        className="rounded-3xl p-5 border"
        style={CARD_STYLE}
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
          className="font-display text-base font-semibold leading-snug"
          style={{ color: "rgba(255,255,255,0.95)" }}
        >
          {prompt || "What's one thing you love most about today?"}
        </p>
      </motion.div>

      {/* Daily Check-in */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34, duration: 0.45 }}
        className="rounded-3xl p-5 border relative overflow-visible"
        style={CARD_STYLE}
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
                  animate={{ opacity: 0, y: -90, x: h.offset, scale: 1.6 }}
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
