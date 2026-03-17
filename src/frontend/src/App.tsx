import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import BottomNav from "./components/BottomNav";
import IntroScreen from "./components/IntroScreen";
import LofiHeartBackground from "./components/LofiHeartBackground";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import AICoach from "./pages/AICoach";
import AnniversaryTracker from "./pages/AnniversaryTracker";
import BondAnalytics from "./pages/BondAnalytics";
import Chat from "./pages/Chat";
import ConversationStarters from "./pages/ConversationStarters";
import CoupleChallenges from "./pages/CoupleChallenges";
import CoupleQuiz from "./pages/CoupleQuiz";
import Dashboard from "./pages/Dashboard";
import LoveLetters from "./pages/LoveLetters";
import MemoryVault from "./pages/MemoryVault";
import Missions from "./pages/Missions";
import MoreHub from "./pages/MoreHub";
import PhotoOfDay from "./pages/PhotoOfDay";
import Settings from "./pages/Settings";
import TimeCapsule from "./pages/TimeCapsule";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,
    },
  },
});

export type Page =
  | "dashboard"
  | "chat"
  | "memories"
  | "settings"
  | "more"
  | "analytics"
  | "missions"
  | "timecapsule"
  | "anniversaries"
  | "quiz"
  | "loveletters"
  | "photoofday"
  | "challenges"
  | "aicoach"
  | "starters";

function AppInner() {
  const [page, setPage] = useState<Page>("dashboard");
  const [showIntro, setShowIntro] = useState(
    () => !sessionStorage.getItem("twoverse_intro_seen"),
  );
  const { fontFamily, resolvedFontColor, isNightMode } = useTheme();

  const handleIntroDone = () => {
    sessionStorage.setItem("twoverse_intro_seen", "1");
    setShowIntro(false);
  };

  const pages: Record<Page, React.ReactNode> = {
    dashboard: <Dashboard onNavigate={(p) => setPage(p as Page)} />,
    chat: <Chat />,
    memories: <MemoryVault />,
    settings: <Settings />,
    more: <MoreHub onNavigate={setPage} />,
    analytics: <BondAnalytics onBack={() => setPage("more")} />,
    missions: <Missions onBack={() => setPage("more")} />,
    timecapsule: <TimeCapsule onBack={() => setPage("more")} />,
    anniversaries: <AnniversaryTracker onBack={() => setPage("more")} />,
    quiz: <CoupleQuiz onBack={() => setPage("more")} />,
    loveletters: <LoveLetters onBack={() => setPage("more")} />,
    photoofday: <PhotoOfDay onBack={() => setPage("more")} />,
    challenges: <CoupleChallenges onBack={() => setPage("more")} />,
    aicoach: <AICoach onBack={() => setPage("more")} />,
    starters: <ConversationStarters onBack={() => setPage("more")} />,
  };

  return (
    <div
      className="min-h-dvh relative overflow-x-hidden"
      style={{
        // @ts-ignore CSS custom properties
        "--app-font": `'${fontFamily}', sans-serif`,
        "--app-text": resolvedFontColor,
        fontFamily: `'${fontFamily}', sans-serif`,
        color: resolvedFontColor,
      }}
    >
      {showIntro && <IntroScreen onDone={handleIntroDone} />}
      <LofiHeartBackground />

      {/* Day/Night warm overlay */}
      {isNightMode && (
        <div
          className="pointer-events-none fixed inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,160,60,0.06) 0%, rgba(255,100,20,0.10) 100%)",
            mixBlendMode: "multiply",
          }}
        />
      )}

      <div
        className="mx-auto max-w-[430px] min-h-dvh relative flex flex-col"
        style={{ background: "transparent" }}
      >
        <main className="flex-1 pb-20 overflow-y-auto relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              {pages[page]}
            </motion.div>
          </AnimatePresence>
        </main>
        <BottomNav activePage={page} onNavigate={setPage} />
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppInner />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
