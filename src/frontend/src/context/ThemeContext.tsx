import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

export const THEMES = [
  {
    id: "rose-petal",
    name: "Rose Petal",
    emoji: "🌸",
    heartColor: "rgba(255, 110, 140, ",
    colors: ["#FF6E8C", "#FFB3C6", "#FFF0F3"],
    description: "Soft pink & white",
    isDark: false,
  },
  {
    id: "midnight-blue",
    name: "Midnight Blue",
    emoji: "🌙",
    heartColor: "rgba(130, 170, 255, ",
    colors: ["#6B7FD7", "#8AA0F8", "#1E2A4A"],
    description: "Dark starfield",
    isDark: true,
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    emoji: "🌅",
    heartColor: "rgba(255, 185, 80, ",
    colors: ["#F4A535", "#F8C46E", "#FFF8E7"],
    description: "Warm golden glow",
    isDark: false,
  },
  {
    id: "forest-green",
    name: "Forest Green",
    emoji: "🌿",
    heartColor: "rgba(90, 185, 120, ",
    colors: ["#4A9E6B", "#7DC89A", "#F0FAF4"],
    description: "Fresh & serene",
    isDark: false,
  },
  {
    id: "lavender-dream",
    name: "Lavender Dream",
    emoji: "💜",
    heartColor: "rgba(185, 130, 230, ",
    colors: ["#9B5FD4", "#C4A0E8", "#F7F0FF"],
    description: "Soft purple dream",
    isDark: false,
  },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  heartColor: string;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "rose-petal",
  setTheme: () => {},
  heartColor: "rgba(255, 110, 140, ",
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    const saved = localStorage.getItem("twoverse_theme");
    return (saved as ThemeId) || "rose-petal";
  });

  const setTheme = (t: ThemeId) => {
    setThemeState(t);
    localStorage.setItem("twoverse_theme", t);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const themeData = THEMES.find((t) => t.id === theme);
  const heartColor = themeData?.heartColor ?? "rgba(255, 110, 140, ";

  return (
    <ThemeContext.Provider value={{ theme, setTheme, heartColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
