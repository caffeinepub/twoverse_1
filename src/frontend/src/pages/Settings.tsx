import { Button } from "@/components/ui/button";
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

  return (
    <div className="relative z-10 px-5 pt-8 pb-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display text-2xl font-bold text-foreground">
          Settings ⚙️
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
            💕 {daysNum}
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
          <span className="text-xl">📅</span>
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
          <Button
            data-ocid="settings.save_date_button"
            onClick={handleSaveDate}
            disabled={!dateInput || setStartDate.isPending}
            className="w-full rounded-2xl"
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
          </Button>
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
          <span className="text-xl">🎨</span>
          <div>
            <h2 className="font-semibold text-foreground text-sm">Theme</h2>
            <p className="text-xs text-muted-foreground">Choose your vibe</p>
          </div>
        </div>
        <div className="space-y-2">
          {THEMES.map((t, idx) => (
            <motion.button
              key={t.id}
              data-ocid={`settings.theme_button.${idx + 1}`}
              whileTap={{ scale: 0.97 }}
              onClick={() => setTheme(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all text-left ${
                theme === t.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background hover:border-primary/40"
              }`}
            >
              <span className="text-2xl">{t.emoji}</span>
              <span className="font-medium text-sm text-foreground flex-1">
                {t.name}
              </span>
              {theme === t.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  <Check className="h-4 w-4 text-primary" />
                </motion.div>
              )}
            </motion.button>
          ))}
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
          <span className="text-xl">💝</span>
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
          © {new Date().getFullYear()}. Built with love using{" "}
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
