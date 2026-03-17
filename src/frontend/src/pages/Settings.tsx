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
      onSuccess: () => toast.success("Start date saved! \ud83d\udc95"),
      onError: () => toast.error("Couldn't save start date"),
    });
  };

  const daysNum = days != null ? Number(days) : null;

  return (
    <div className="relative z-10 px-5 pt-8 pb-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display text-2xl font-bold text-foreground">
          Settings \u2699\ufe0f
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Customize your TwoVerse experience
        </p>
      </motion.div>

      {/* Days Counter Summary */}
      {daysNum !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="bg-primary/10 rounded-3xl p-4 text-center border border-primary/20"
        >
          <p className="font-display text-3xl font-bold text-primary">
            \ud83d\udc95 {daysNum}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {daysNum === 1 ? "day" : "days"} of your love story
          </p>
        </motion.div>
      )}

      {/* Start Date */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-card p-5 border border-border"
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">\ud83d\udcc5</span>
          <div>
            <h2 className="font-semibold text-foreground text-sm">
              Start Date
            </h2>
            <p className="text-xs text-muted-foreground">
              When did your journey begin?
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <Label
              htmlFor="start-date"
              className="text-xs text-muted-foreground"
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
              "Save Start Date \ud83d\udc95"
            )}
          </button>
        </div>
      </motion.div>

      {/* Theme Customizer */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-card p-5 border border-border"
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">\ud83c\udfa8</span>
          <div>
            <h2 className="font-semibold text-foreground text-sm">Theme</h2>
            <p className="text-xs text-muted-foreground">Choose your vibe</p>
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
                    ? t.colors[0]
                    : "oklch(var(--border))",
                  background: t.isDark
                    ? `linear-gradient(135deg, ${t.colors[2]}ee 0%, ${t.colors[2]}cc 100%)`
                    : `linear-gradient(135deg, ${t.colors[2]}cc 0%, ${t.colors[2]}88 100%)`,
                }}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5, duration: 0.4 }}
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                    style={{ background: t.colors[0] }}
                  >
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </motion.div>
                )}
                <div className="flex gap-1 mb-2.5">
                  {t.colors.map((color) => (
                    <div
                      key={color}
                      className="w-5 h-5 rounded-full border-2 border-white/50 shadow-sm flex-shrink-0"
                      style={{ background: color }}
                    />
                  ))}
                </div>
                <p
                  className="font-semibold text-xs leading-tight"
                  style={{
                    color: t.isDark
                      ? "rgba(255,255,255,0.92)"
                      : "rgba(30,20,30,0.85)",
                  }}
                >
                  {t.name}
                </p>
                <p
                  className="text-[10px] mt-0.5 leading-tight"
                  style={{
                    color: t.isDark
                      ? "rgba(255,255,255,0.55)"
                      : "rgba(30,20,30,0.5)",
                  }}
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
        className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-card p-5 border border-border"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">\ud83d\udc9d</span>
          <h2 className="font-semibold text-foreground text-sm">
            About TwoVerse
          </h2>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          TwoVerse is your private world for two. A cozy space to celebrate
          every day together, share moments, and cherish memories.
        </p>
      </motion.div>

      {/* Footer */}
      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground">
          \u00a9 {new Date().getFullYear()}. Built with love using{" "}
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
