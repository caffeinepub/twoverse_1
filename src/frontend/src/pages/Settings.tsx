import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { THEMES, useTheme } from "../context/ThemeContext";
import {
  useGetDaysTogether,
  useGetStartDate,
  useSetStartDate,
} from "../hooks/useQueries";

const nanoToDateStr = (ns: bigint) => {
  const d = new Date(Number(ns / 1_000_000n));
  return d.toISOString().split("T")[0];
};

export default function Settings() {
  const { data: days } = useGetDaysTogether();
  const { data: startDate } = useGetStartDate();
  const setStartDate = useSetStartDate();
  const { theme, setTheme } = useTheme();
  const [dateInput, setDateInput] = useState("");

  useEffect(() => {
    if (startDate) {
      setDateInput(nanoToDateStr(startDate));
    }
  }, [startDate]);

  const handleSaveDate = () => {
    if (!dateInput) return;
    setStartDate.mutate(dateInput, {
      onSuccess: () => toast.success("Start date saved! 💕"),
      onError: () => toast.error("Couldn't save start date"),
    });
  };

  const daysNum = days != null ? Number(days) : null;

  const glassCard = {
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(12px)",
    borderColor: "rgba(255,255,255,0.25)",
  };

  return (
    <div className="relative z-10 px-5 pt-8 pb-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1
          className="font-display text-2xl font-bold"
          style={{ color: "rgba(255,255,255,0.97)" }}
        >
          Settings ⚙️
        </h1>
        <p
          className="text-xs mt-0.5"
          style={{ color: "rgba(255,255,255,0.60)" }}
        >
          Customize your TwoVerse experience
        </p>
      </motion.div>

      {/* Days Counter Summary */}
      {daysNum !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="rounded-3xl p-4 text-center border"
          style={{
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(12px)",
            borderColor: "rgba(255,255,255,0.30)",
          }}
        >
          <p
            className="font-display text-3xl font-bold"
            style={{ color: "rgba(255,255,255,0.97)" }}
          >
            💕 {daysNum}
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            {daysNum === 1 ? "day" : "days"} of your love story
          </p>
        </motion.div>
      )}

      {/* Start Date */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl shadow-card p-5 border"
        style={glassCard}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📅</span>
          <div>
            <h2
              className="font-semibold text-sm"
              style={{ color: "rgba(255,255,255,0.95)" }}
            >
              Start Date
            </h2>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.60)" }}>
              When did your journey begin?
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <Label
              htmlFor="start-date"
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.70)" }}
            >
              Date
            </Label>
            <Input
              id="start-date"
              data-ocid="settings.start_date_input"
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="mt-1 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.15)",
                borderColor: "rgba(255,255,255,0.25)",
                color: "rgba(255,255,255,0.95)",
              }}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
          <button
            type="button"
            data-ocid="settings.save_date_button"
            onClick={handleSaveDate}
            disabled={!dateInput || setStartDate.isPending}
            className="btn-primary"
          >
            {setStartDate.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : setStartDate.isSuccess ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Saved!
              </>
            ) : (
              "Save Start Date 💕"
            )}
          </button>
        </div>
      </motion.div>

      {/* Theme Customizer */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl shadow-card p-5 border"
        style={glassCard}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🎨</span>
          <div>
            <h2
              className="font-semibold text-sm"
              style={{ color: "rgba(255,255,255,0.95)" }}
            >
              Theme
            </h2>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.60)" }}>
              Choose your vibe
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {THEMES.map((t, idx) => {
            const isSelected = theme === t.id;
            return (
              <motion.button
                key={t.id}
                data-ocid={`settings.theme_button.${idx + 1}`}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(t.id)}
                className="relative text-left rounded-2xl p-3 border-2 transition-all overflow-hidden"
                style={{
                  borderColor: isSelected
                    ? "rgba(255,255,255,0.70)"
                    : "rgba(255,255,255,0.20)",
                  background: `linear-gradient(135deg, ${t.bgDeep}cc 0%, ${t.heartFill}55 100%)`,
                }}
              >
                {isSelected && (
                  <>
                    <style>{`
                      @keyframes card-shimmer {
                        0% { transform: translateX(-120%) skewX(-15deg); }
                        100% { transform: translateX(320%) skewX(-15deg); }
                      }
                    `}</style>
                    {/* Shimmer sweep overlay */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        overflow: "hidden",
                        borderRadius: "inherit",
                        pointerEvents: "none",
                        zIndex: 1,
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "40%",
                          height: "100%",
                          background:
                            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)",
                          animation: "card-shimmer 3s ease-in-out infinite",
                        }}
                      />
                    </div>
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        bounce: 0.5,
                        duration: 0.4,
                      }}
                      className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                      style={{
                        background: "rgba(255,255,255,0.90)",
                        zIndex: 2,
                      }}
                    >
                      <Check
                        className="w-3 h-3"
                        style={{ color: t.heartFill }}
                        strokeWidth={3}
                      />
                    </motion.div>
                  </>
                )}
                <div className="flex gap-1 mb-2.5">
                  {[t.heartFill, t.heartHighlight, t.bgDeep].map((color) => (
                    <div
                      key={color}
                      className="w-5 h-5 rounded-full border-2 border-white/50 shadow-sm flex-shrink-0"
                      style={{ background: color }}
                    />
                  ))}
                </div>
                <p
                  className="font-semibold text-xs leading-tight"
                  style={{ color: "rgba(255,255,255,0.95)" }}
                >
                  {t.name}
                </p>
                <p
                  className="text-[10px] mt-0.5 leading-tight"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  {t.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-3xl shadow-card p-5 border"
        style={glassCard}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">💝</span>
          <h2
            className="font-semibold text-sm"
            style={{ color: "rgba(255,255,255,0.95)" }}
          >
            About TwoVerse
          </h2>
        </div>
        <p
          className="text-xs leading-relaxed"
          style={{ color: "rgba(255,255,255,0.70)" }}
        >
          TwoVerse is your private world for two. A cozy space to celebrate
          every day together, share moments, and cherish memories.
        </p>
      </motion.div>

      {/* Footer */}
      <div className="text-center pt-2">
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.50)" }}>
          © {new Date().getFullYear()}. Built with love using{" "}
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
