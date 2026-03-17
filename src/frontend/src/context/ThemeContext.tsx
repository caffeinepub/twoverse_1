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
    bgDeep: "#C2185B",
    heartFill: "#E91E8C",
    heartHighlight: "#FF80C0",
    heartShadow: "#880E4F",
    sparkleColor: "#FFD0E8",
  },
  {
    id: "midnight-blue",
    name: "Midnight Blue",
    emoji: "🌙",
    heartColor: "rgba(130, 170, 255, ",
    colors: ["#6B7FD7", "#8AA0F8", "#1E2A4A"],
    description: "Dark starfield",
    isDark: true,
    bgDeep: "#0D1B3E",
    heartFill: "#3F6FD8",
    heartHighlight: "#90B0FF",
    heartShadow: "#0A1530",
    sparkleColor: "#C0D8FF",
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    emoji: "🌅",
    heartColor: "rgba(255, 185, 80, ",
    colors: ["#F4A535", "#F8C46E", "#FFF8E7"],
    description: "Warm golden glow",
    isDark: false,
    bgDeep: "#B5631A",
    heartFill: "#F4A535",
    heartHighlight: "#FFD880",
    heartShadow: "#7C3F0A",
    sparkleColor: "#FFF0B0",
  },
  {
    id: "forest-green",
    name: "Forest Green",
    emoji: "🌿",
    heartColor: "rgba(90, 185, 120, ",
    colors: ["#4A9E6B", "#7DC89A", "#F0FAF4"],
    description: "Fresh & serene",
    isDark: false,
    bgDeep: "#1A5C38",
    heartFill: "#4A9E6B",
    heartHighlight: "#90D4A8",
    heartShadow: "#0F3A22",
    sparkleColor: "#C0F0D0",
  },
  {
    id: "lavender-dream",
    name: "Lavender Dream",
    emoji: "💜",
    heartColor: "rgba(185, 130, 230, ",
    colors: ["#9B5FD4", "#C4A0E8", "#F7F0FF"],
    description: "Soft purple dream",
    isDark: false,
    bgDeep: "#4A1A7A",
    heartFill: "#9B5FD4",
    heartHighlight: "#D0A0F0",
    heartShadow: "#2D0F50",
    sparkleColor: "#EDD0FF",
  },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  heartColor: string;
  themeData: (typeof THEMES)[number];
}

const defaultTheme = THEMES[0];

const ThemeContext = createContext<ThemeContextValue>({
  theme: "rose-petal",
  setTheme: () => {},
  heartColor: "rgba(255, 110, 140, ",
  themeData: defaultTheme,
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

  const themeData = THEMES.find((t) => t.id === theme) ?? defaultTheme;
  const heartColor = themeData.heartColor;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, heartColor, themeData }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
