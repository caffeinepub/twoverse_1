import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import BottomNav from "./components/BottomNav";
import HeartParticles from "./components/HeartParticles";
import { ThemeProvider } from "./context/ThemeContext";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import MemoryVault from "./pages/MemoryVault";
import Settings from "./pages/Settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,
    },
  },
});

type Page = "dashboard" | "chat" | "memories" | "settings";

function AppInner() {
  const [page, setPage] = useState<Page>("dashboard");

  const pages: Record<Page, React.ReactNode> = {
    dashboard: <Dashboard />,
    chat: <Chat />,
    memories: <MemoryVault />,
    settings: <Settings />,
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
