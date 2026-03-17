import { motion } from "motion/react";

type Page = "dashboard" | "chat" | "memories" | "settings";

interface BottomNavProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { page: Page; icon: string; label: string; ocid: string }[] = [
  { page: "dashboard", icon: "🏠", label: "Home", ocid: "nav.home_link" },
  { page: "chat", icon: "💬", label: "Chat", ocid: "nav.chat_link" },
  { page: "memories", icon: "📸", label: "Memories", ocid: "nav.memory_link" },
  { page: "settings", icon: "⚙️", label: "Settings", ocid: "nav.settings_link" },
];

export default function BottomNav({ activePage, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-[430px]">
        <div className="bg-card/90 backdrop-blur-md border-t border-border flex items-center justify-around px-2 pb-safe">
          {navItems.map((item) => {
            const isActive = activePage === item.page;
            return (
              <button
                type="button"
                key={item.page}
                data-ocid={item.ocid}
                onClick={() => onNavigate(item.page)}
                className="relative flex flex-col items-center gap-0.5 py-3 px-4 rounded-xl transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span
                  className="text-xl relative z-10"
                  style={{ filter: isActive ? "none" : "grayscale(0.3)" }}
                >
                  {item.icon}
                </span>
                <span
                  className={`text-[10px] font-medium relative z-10 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
