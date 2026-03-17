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
  {
    id: "cherry-blossom",
    name: "Cherry Blossom",
    emoji: "🌸",
    heartColor: "rgba(232, 83, 122, ",
    colors: ["#E8537A", "#FFB0C8", "#FFF5F8"],
    description: "Delicate spring bloom",
    isDark: true,
    bgDeep: "#6B2D3E",
    heartFill: "#E8537A",
    heartHighlight: "#FFB0C8",
    heartShadow: "#3D1020",
    sparkleColor: "#FFD6E5",
  },
  {
    id: "velvet-night",
    name: "Velvet Night",
    emoji: "🌹",
    heartColor: "rgba(139, 34, 82, ",
    colors: ["#8B2252", "#C4637A", "#2D0F1C"],
    description: "Dark luxurious romance",
    isDark: true,
    bgDeep: "#1A0A14",
    heartFill: "#8B2252",
    heartHighlight: "#C4637A",
    heartShadow: "#0A0308",
    sparkleColor: "#E8A0B8",
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    emoji: "🌊",
    heartColor: "rgba(27, 143, 160, ",
    colors: ["#1B8FA0", "#60D0E4", "#E0F8FF"],
    description: "Calm ocean vibes",
    isDark: true,
    bgDeep: "#0A2A35",
    heartFill: "#1B8FA0",
    heartHighlight: "#60D0E4",
    heartShadow: "#051820",
    sparkleColor: "#A0EFF8",
  },
  {
    id: "coral-bliss",
    name: "Coral Bliss",
    emoji: "🌺",
    heartColor: "rgba(232, 86, 42, ",
    colors: ["#E8562A", "#FF9070", "#FFF0EC"],
    description: "Warm sunset warmth",
    isDark: true,
    bgDeep: "#3D1810",
    heartFill: "#E8562A",
    heartHighlight: "#FF9070",
    heartShadow: "#1E0808",
    sparkleColor: "#FFD0C0",
  },
  {
    id: "starlight-silver",
    name: "Starlight Silver",
    emoji: "⭐",
    heartColor: "rgba(128, 144, 192, ",
    colors: ["#8090C0", "#C0D0F0", "#F0F4FF"],
    description: "Elegant starfield",
    isDark: true,
    bgDeep: "#0F1520",
    heartFill: "#8090C0",
    heartHighlight: "#C0D0F0",
    heartShadow: "#05080F",
    sparkleColor: "#E0E8FF",
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
