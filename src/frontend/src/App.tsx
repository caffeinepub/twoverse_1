import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import BottomNav from "./components/BottomNav";
import HeartParticles from "./components/HeartParticles";
import { ThemeProvider } from "./context/ThemeContext";
import AnniversaryTracker from "./pages/AnniversaryTracker";
import BondAnalytics from "./pages/BondAnalytics";
import Chat from "./pages/Chat";
import CoupleQuiz from "./pages/CoupleQuiz";
import Dashboard from "./pages/Dashboard";
import MemoryVault from "./pages/MemoryVault";
import Missions from "./pages/Missions";
import MoreHub from "./pages/MoreHub";
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

type Page =
  | "dashboard"
  | "chat"
  | "memories"
  | "settings"
  | "more"
  | "analytics"
  | "missions"
  | "timecapsule"
  | "anniversaries"
  | "quiz";

function AppInner() {
  const [page, setPage] = useState<Page>("dashboard");

  const pages: Record<Page, React.ReactNode> = {
    dashboard: <Dashboard />,
    chat: <Chat />,
    memories: <MemoryVault />,
    settings: <Settings />,
    more: <MoreHub onNavigate={setPage} />,
    analytics: <BondAnalytics onBack={() => setPage("more")} />,
    missions: <Missions onBack={() => setPage("more")} />,
    timecapsule: <TimeCapsule onBack={() => setPage("more")} />,
    anniversaries: <AnniversaryTracker onBack={() => setPage("more")} />,
    quiz: <CoupleQuiz onBack={() => setPage("more")} />,
  };

  return (
    <div className="min-h-dvh bg-background relative overflow-x-hidden">
      <HeartParticles />
      <div className="mx-auto max-w-[430px] min-h-dvh relative flex flex-col">
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
