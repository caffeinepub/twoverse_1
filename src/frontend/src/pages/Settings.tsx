import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { THEMES, loadGoogleFont, useTheme } from "../context/ThemeContext";
import {
  useGetDaysTogether,
  useGetSeasonalThemeEnabled,
  useGetStartDate,
  useSetSeasonalThemeEnabled,
  useSetStartDate,
} from "../hooks/useQueries";

const nanoToDateStr = (ns: bigint) => {
  const d = new Date(Number(ns / 1_000_000n));
  return d.toISOString().split("T")[0];
};

const FONTS = [
  { name: "Nunito", label: "Nunito" },
  { name: "Poppins", label: "Poppins" },
  { name: "Inter", label: "Inter" },
  { name: "Playfair Display", label: "Playfair Display" },
  { name: "Lora", label: "Lora" },
  { name: "Dancing Script", label: "Dancing Script" },
];

function getSeasonalThemeName(): string {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();
  if (month === 2 && day <= 14) return "Valentine's ❤️";
  if (month >= 3 && month <= 5) return "Spring 🌸";
  if (month >= 6 && month <= 8) return "Summer ☀️";
  if (month >= 9 && month <= 11) return "Autumn 🍂";
  if (month === 12 && day <= 25) return "Winter / Christmas 🎄";
  return "New Year 🎆";
}

export default function Settings() {
  const { data: days } = useGetDaysTogether();
  const { data: startDate } = useGetStartDate();
  const setStartDate = useSetStartDate();
  const {
    theme,
    setTheme,
    fontFamily,
    setFontFamily,
    fontColorMode,
    setFontColorMode,
    fontColor,
    setFontColor,
    resolvedFontColor,
    dayNightMode,
    setDayNightMode,
  } = useTheme();
  const { data: seasonalEnabled } = useGetSeasonalThemeEnabled();
  const setSeasonalEnabled = useSetSeasonalThemeEnabled();
  const [dateInput, setDateInput] = useState("");
  const [fontsLoaded, setFontsLoaded] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (startDate) {
      setDateInput(nanoToDateStr(startDate));
    }
  }, [startDate]);

  // Pre-load all font previews
  useEffect(() => {
    for (const f of FONTS) {
      loadGoogleFont(f.name);
    }
    setFontsLoaded(new Set(FONTS.map((f) => f.name)));
  }, []);

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

      {/* Font & Text Customizer */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-3xl shadow-card p-5 border"
        style={glassCard}
        data-ocid="settings.panel"
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">✍️</span>
          <div>
            <h2
              className="font-semibold text-sm"
              style={{ color: "rgba(255,255,255,0.95)" }}
            >
              Font & Text
            </h2>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.60)" }}>
              Personalize your typography
            </p>
          </div>
        </div>

        {/* Font Picker */}
        <p
          className="text-xs font-medium mb-2"
          style={{ color: "rgba(255,255,255,0.75)" }}
        >
          Font Family
        </p>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {FONTS.map((f, idx) => {
            const isSelected = fontFamily === f.name;
            return (
              <motion.button
                key={f.name}
                data-ocid={`settings.font_button.${idx + 1}`}
                whileTap={{ scale: 0.96 }}
                onClick={() => setFontFamily(f.name)}
                className="relative px-3 py-2.5 rounded-2xl border-2 text-left transition-all overflow-hidden"
                style={{
                  borderColor: isSelected
                    ? "rgba(255,255,255,0.70)"
                    : "rgba(255,255,255,0.20)",
                  background: isSelected
                    ? "rgba(255,255,255,0.22)"
                    : "rgba(255,255,255,0.08)",
                }}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.90)" }}
                  >
                    <Check
                      className="w-2.5 h-2.5"
                      style={{ color: "#C2185B" }}
                      strokeWidth={3}
                    />
                  </motion.div>
                )}
                <p
                  className="text-sm font-medium leading-tight truncate"
                  style={{
                    fontFamily: fontsLoaded.has(f.name)
                      ? `'${f.name}', sans-serif`
                      : "inherit",
                    color: "rgba(255,255,255,0.92)",
                  }}
                >
                  {f.label}
                </p>
                <p
                  className="text-[10px] mt-0.5"
                  style={{
                    fontFamily: fontsLoaded.has(f.name)
                      ? `'${f.name}', sans-serif`
                      : "inherit",
                    color: "rgba(255,255,255,0.55)",
                  }}
                >
                  Hello, love ♥
                </p>
              </motion.button>
            );
          })}
        </div>

        {/* Color Mode Toggle */}
        <p
          className="text-xs font-medium mb-2"
          style={{ color: "rgba(255,255,255,0.75)" }}
        >
          Text Color
        </p>
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            data-ocid="settings.auto_color_toggle"
            onClick={() => setFontColorMode("auto")}
            className="flex-1 py-2 rounded-2xl text-xs font-medium transition-all border-2"
            style={{
              borderColor:
                fontColorMode === "auto"
                  ? "rgba(255,255,255,0.70)"
                  : "rgba(255,255,255,0.20)",
              background:
                fontColorMode === "auto"
                  ? "rgba(255,255,255,0.25)"
                  : "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.95)",
            }}
          >
            ✨ Auto
          </button>
          <button
            type="button"
            data-ocid="settings.manual_color_toggle"
            onClick={() => setFontColorMode("manual")}
            className="flex-1 py-2 rounded-2xl text-xs font-medium transition-all border-2"
            style={{
              borderColor:
                fontColorMode === "manual"
                  ? "rgba(255,255,255,0.70)"
                  : "rgba(255,255,255,0.20)",
              background:
                fontColorMode === "manual"
                  ? "rgba(255,255,255,0.25)"
                  : "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.95)",
            }}
          >
            🎨 Manual
          </button>
        </div>

        {fontColorMode === "auto" && (
          <div
            className="rounded-2xl px-3 py-2 text-xs"
            style={{
              background: "rgba(255,255,255,0.10)",
              color: "rgba(255,255,255,0.65)",
            }}
          >
            Auto picks high-contrast white or dark text based on your theme.
            Current:{" "}
            <span
              className="font-semibold"
              style={{
                color: resolvedFontColor === "#ffffff" ? "#ffffff" : "#b0b0ff",
              }}
            >
              {resolvedFontColor === "#ffffff" ? "White" : "Dark"}
            </span>
          </div>
        )}

        {fontColorMode === "manual" && (
          <div className="flex items-center gap-3">
            <label className="relative cursor-pointer">
              <input
                type="color"
                data-ocid="settings.font_color_input"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                className="sr-only"
              />
              <div
                className="w-10 h-10 rounded-2xl border-2 shadow-sm transition-transform hover:scale-105"
                style={{
                  background: fontColor,
                  borderColor: "rgba(255,255,255,0.40)",
                }}
              />
            </label>
            <Input
              data-ocid="settings.font_color_hex_input"
              value={fontColor}
              onChange={(e) => {
                const val = e.target.value;
                if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) setFontColor(val);
              }}
              maxLength={7}
              placeholder="#ffffff"
              className="flex-1 rounded-2xl text-xs h-9"
              style={{
                background: "rgba(255,255,255,0.12)",
                borderColor: "rgba(255,255,255,0.25)",
                color: "rgba(255,255,255,0.90)",
              }}
            />
          </div>
        )}
      </motion.div>

      {/* Seasonal Themes */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26 }}
        className="rounded-3xl shadow-card p-5 border"
        style={glassCard}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌸</span>
            <div>
              <h2
                className="font-semibold text-sm"
                style={{ color: "rgba(255,255,255,0.95)" }}
              >
                Seasonal Themes
              </h2>
              <p
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.60)" }}
              >
                Auto-switches theme by time of year
              </p>
            </div>
          </div>
          <button
            type="button"
            data-ocid="settings.seasonal_toggle"
            onClick={() => {
              const next = !(seasonalEnabled ?? false);
              localStorage.setItem("twoverse_seasonal_theme", String(next));
              setSeasonalEnabled.mutate(next);
            }}
            className="w-12 h-6 rounded-full relative transition-all border"
            style={{
              background: seasonalEnabled
                ? "rgba(255,255,255,0.35)"
                : "rgba(255,255,255,0.12)",
              borderColor: seasonalEnabled
                ? "rgba(255,255,255,0.60)"
                : "rgba(255,255,255,0.20)",
            }}
          >
            <div
              className="w-4 h-4 rounded-full absolute top-0.5 transition-all"
              style={{
                background: "rgba(255,255,255,0.95)",
                left: seasonalEnabled ? "calc(100% - 1.25rem)" : "0.125rem",
              }}
            />
          </button>
        </div>
        {seasonalEnabled && (
          <div
            className="rounded-2xl px-3 py-2 flex items-center gap-2 mt-2"
            style={{
              background: "rgba(255,255,255,0.10)",
              borderRadius: "12px",
            }}
          >
            <span className="text-sm">🗓️</span>
            <p
              className="text-xs font-medium"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              Active:{" "}
              <span className="font-bold">{getSeasonalThemeName()}</span>
            </p>
          </div>
        )}
      </motion.div>

      {/* Day / Night Mode */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="rounded-3xl shadow-card p-5 border"
        style={glassCard}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🌙</span>
          <div>
            <h2
              className="font-semibold text-sm"
              style={{ color: "rgba(255,255,255,0.95)" }}
            >
              Day / Night Mode
            </h2>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.60)" }}>
              Auto adds a warm amber glow at night
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(["auto", "day", "night"] as const).map((mode) => {
            const labels = { auto: "✨ Auto", day: "☀️ Day", night: "🌙 Night" };
            return (
              <button
                key={mode}
                type="button"
                data-ocid={`settings.daynight_${mode}_toggle`}
                onClick={() => setDayNightMode(mode)}
                className="py-2 rounded-2xl text-xs font-medium transition-all border-2"
                style={{
                  borderColor:
                    dayNightMode === mode
                      ? "rgba(255,255,255,0.70)"
                      : "rgba(255,255,255,0.20)",
                  background:
                    dayNightMode === mode
                      ? "rgba(255,255,255,0.25)"
                      : "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.95)",
                }}
              >
                {labels[mode]}
              </button>
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
